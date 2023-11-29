import type { PropsWithChildren, ReactNode } from "react"
import { Box, Text, Title } from "@mantine/core"
import { GLOBAL_PADDING } from "../../../styles/variables"
import BackButtonBar from "../../../components/BackButtonBar"

interface Props {
  step: number
  title: string | ReactNode
  back?: string
}

const InventoryCreateDrawStepComponent = ({ step, title, back, children }: PropsWithChildren<Props>) => {
  return (
    <>
      <Box bg="mono.9" c="mono.1" m={-GLOBAL_PADDING} mb={0}>
        <BackButtonBar
          to={back}
          backReplace={true}
          buttonColor="mono.5"
          label={
            <Text c="mono.2">
              Step {step}
              <Text c="mono.7" span>
                {" "}
                of 3
              </Text>
            </Text>
          }
        />

        <Box p={GLOBAL_PADDING} py={32} mih={150}>
          {typeof title === "string" ? (
            <Title fz={20} fw={800} sx={{ whiteSpace: "pre-line" }}>
              {title}
            </Title>
          ) : (
            title
          )}
        </Box>
      </Box>

      <Box py={24}>{children}</Box>
    </>
  )
}

export default InventoryCreateDrawStepComponent
