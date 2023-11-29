import { Center, Text } from "@mantine/core"

const ErrorMessage = ({ error }: { error: Error }) => (
  <Center p={100}>
    <Text c="mono.3">{error.message}</Text>
  </Center>
)

export default ErrorMessage
