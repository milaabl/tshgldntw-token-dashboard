import { FC } from "react"
import {
  Box,
  List,
  ListItem,
  LabelMd,
  BodyMd,
  ListIcon,
  LabelSm,
  BodySm,
} from "@threshold-network/components"
import { BsFillArrowRightCircleFill } from "react-icons/all"

const ListItemWithIcon: FC = ({ children }) => {
  return (
    <ListItem display={"flex"} justifyItems="center">
      <ListIcon
        color="brand.500"
        my="auto"
        as={BsFillArrowRightCircleFill}
        w="16px"
        h="16px"
      />
      {children}
    </ListItem>
  )
}

export const TakeNoteList: FC<{ size?: "sm" | "md" }> = ({ size = "md" }) => {
  const LabelComponent = size === "sm" ? LabelSm : LabelMd
  const BodyComponent = size === "sm" ? BodySm : BodyMd
  return (
    <List spacing="4">
      <ListItem>
        <LabelComponent mb="2">Bridging duration</LabelComponent>
        <List spacing="2">
          <ListItemWithIcon>
            <BodyComponent as="span">
              Your tBTC token will arrive in{" "}
              <Box as="span" color="brand.500">
                ~ 1 to 3 hours
              </Box>{" "}
              after you initiate minting, depending on your deposited amount.
            </BodyComponent>
          </ListItemWithIcon>
        </List>
      </ListItem>
      <ListItem>
        <LabelComponent mb="2">Minimum deposit</LabelComponent>
        <List spacing="2">
          <ListItemWithIcon>
            <BodyComponent>
              The minimum deposit at launch is{" "}
              <Box as="span" color="brand.500">
                0.01 BTC
              </Box>
              . Depositing less than the minimum can mean losing access to your
              funds.
            </BodyComponent>
          </ListItemWithIcon>
        </List>
      </ListItem>
      <ListItem>
        <LabelComponent mb="2">Bridging back btc is LIVE</LabelComponent>
        <List spacing="2">
          <ListItemWithIcon>
            <BodyComponent>
              You can bridge your BTC back whenever you want. Redemptions are
              now live.
            </BodyComponent>
          </ListItemWithIcon>
        </List>
      </ListItem>
    </List>
  )
}
