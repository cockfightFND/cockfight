import { Box } from "@mantine/core"

const FromToLine = () => (
  <Box h={4} mx={12} bg="black" sx={{ position: "relative" }}>
    <Box
      h={4}
      w={14}
      bg="black"
      sx={{
        position: "absolute",
        right: -4,
        bottom: 4,
        transform: "rotate(45deg) translateY(-0.5px)",
        ":after": {
          content: "''",
          display: "block",
          position: "absolute",
          right: -4,
          width: 0,
          height: 0,
          borderTop: "3px solid black",
          borderRight: "3px solid transparent",
          borderBottom: "3px solid transparent",
          borderLeft: "3px solid black",
        },
      }}
    />
  </Box>
)

export default FromToLine
