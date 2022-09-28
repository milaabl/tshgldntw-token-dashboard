import { FC, useEffect, useRef, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  Alert,
  AlertIcon,
  Button,
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { BodyLg, BodySm, H5 } from "@threshold-network/components"
import { FormikProps } from "formik"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import AdvancedParamsForm, { FormValues } from "./AdvancedParamsForm"
import { useStakingState } from "../../../hooks/useStakingState"
import { ModalType } from "../../../enums"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"
import StakingStats from "../../StakingStats"
import useCheckDuplicateProviderAddress from "../../../web3/hooks/useCheckDuplicateProviderAddress"
import { featureFlags } from "../../../constants"
import { useStakeTransaction } from "../../../web3/hooks/useStakeTransaction"

const ConfirmStakingParamsModal: FC<
  BaseModalProps & { stakeAmount: string }
> = ({ stakeAmount }) => {
  const formRef = useRef<FormikProps<FormValues>>(null)
  const { closeModal, openModal } = useModal()
  const [hasBeenValidatedOnMount, setHasBeenValidatedOnMount] = useState(false)
  const { account } = useWeb3React()
  const { updateState } = useStakingState()
  const checkIfProviderUsed = useCheckDuplicateProviderAddress()

  // stake transaction, opens success modal on success callback
  // not needed once MAS is launched
  const { stake } = useStakeTransaction((tx) => {
    if (featureFlags.MULTI_APP_STAKING) {
      openModal(ModalType.StakeSuccess, {
        transactionHash: tx.hash,
      })
    } else {
      openModal(ModalType.StakeSuccessOLD, {
        transactionHash: tx.hash,
      })
    }
  })

  useEffect(() => {
    const forceFormValidation = async () => {
      if (hasBeenValidatedOnMount || !formRef.current) return
      setHasBeenValidatedOnMount(true)
      const errors = await formRef.current.validateForm()
      if (errors) {
        formRef.current.setErrors(errors)
        formRef.current.setTouched({ stakingProvider: true })
      }
    }
    forceFormValidation()
  })

  const onSubmit = ({
    stakingProvider,
    beneficiary,
    authorizer,
  }: FormValues) => {
    updateState("stakingProvider", stakingProvider)
    updateState("beneficiary", beneficiary)
    updateState("authorizer", authorizer)
    updateState("stakeAmount", stakeAmount)

    if (featureFlags.MULTI_APP_STAKING) {
      openModal(ModalType.SubmitStake)
    } else {
      stake({ stakingProvider, beneficiary, authorizer, amount: stakeAmount })
    }
  }

  return (
    <>
      <ModalHeader display="flex" alignItems="baseline">
        <H5 mr={2}>Stake Tokens</H5>
        <BodySm>(Step 1)</BodySm>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" spacing={6}>
          <H5>You are about to make a deposit into the T Staking Contract.</H5>
          {featureFlags.MULTI_APP_STAKING && (
            <BodyLg>Staking requires 2 transactions.</BodyLg>
          )}
        </InfoBox>
        <StakingStats
          {...{
            stakeAmount,
            beneficiary: account as string,
            stakingProvider: account as string,
            authorizer: account as string,
          }}
        />
        <Alert my={6} status="info" fontSize="sm">
          <AlertIcon />
          Take note! These addresses cannot be changed later.
        </Alert>

        <AdvancedParamsForm
          innerRef={formRef}
          formId="advanced-staking-params-form"
          initialAddress={account as string}
          onSubmitForm={onSubmit}
          checkIfProviderUsed={checkIfProviderUsed}
        />

        <StakingContractLearnMore textAlign="center" mt="8" />
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button type="submit" form="advanced-staking-params-form">
          {featureFlags.MULTI_APP_STAKING ? "Continue" : "Stake"}
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(ConfirmStakingParamsModal)
