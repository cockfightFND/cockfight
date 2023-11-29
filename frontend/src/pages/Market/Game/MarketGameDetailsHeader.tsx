import { BackgroundImage, Box, Stack, Text } from "@mantine/core"
import { GLOBAL_PADDING } from "../../../styles/variables"
import CircleImage from "../../../components/CircleImage"
import BackButtonBar from "../../../components/BackButtonBar"
import WithCollectionInfo from "../../../components/WithCollectionInfo"

const MarketGameDetailsHeader = ({ collectionAddress }: { collectionAddress: string }) => {
  return (
    <WithCollectionInfo collectionAddress={collectionAddress}>
      {({ name, thumbnailUrl }) => (
        <Box m={-GLOBAL_PADDING} mb={0}>
          <BackgroundImage src={thumbnailUrl + "/public"}>
            <Box bg="rgba(255, 255, 255, 0.6)" sx={{ backdropFilter: "blur(10px)" }} pb={50}>
              <BackButtonBar />

              <Stack spacing={10} align="center">
                <CircleImage src={thumbnailUrl + "/public"} width={80} height={80} border="2px solid" />
                <Text fz={24} fw={800}>
                  STring {name}
                </Text>
              </Stack>
            </Box>
          </BackgroundImage>
        </Box>
      )}
    </WithCollectionInfo>
  )
}

export default MarketGameDetailsHeader
