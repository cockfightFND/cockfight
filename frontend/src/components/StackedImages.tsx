import { Box, Image, Text } from "@mantine/core"
import WithTokenDetails from "./WithTokenDetails"
import type { GameItemExternal } from "../data/types"

function getImageSize(index: number) {
  switch (index) {
    case 0:
      return 120

    case 1:
    case 3:
      return 92

    case 2:
    case 4:
      return 64
  }
}

function getLeftMargin(index: number) {
  switch (index) {
    case 1:
      return 40
    case 2:
      return 40 + 28
    case 3:
      return -40
    case 4:
      return -(40 + 28)
    default:
      return 0
  }
}

function getImageStyle(index: number) {
  return {
    boxShadow: "6px 12px 32px 0px rgba(0, 0, 0, 0.12)",
    left: "50%",
    marginLeft: getLeftMargin(index),
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 5 - index,
  }
}

interface Props {
  collectionAddress: string
  tokenAddresses: string[]
  beforeImportedItems?: GameItemExternal[]
  isPfp?: boolean
}

const StackedImages = ({ collectionAddress, tokenAddresses, beforeImportedItems, isPfp }: Props) => {
  return (
    <Box pos="relative" h={getImageSize(0)}>
      {tokenAddresses.length > 1 && (
        <Text
          sx={({ fn }) => ({
            background: fn.themeColor("mono.7"),
            borderRadius: 18 / 2,
            color: "white",
            fontSize: 12,
            height: 18,
            left: "50%",
            lineHeight: "18px",
            minWidth: 30,
            paddingLeft: 8,
            paddingRight: 8,
            position: "absolute",
            textAlign: "center",
            top: 0,
            transform: "translate(-50%, -50%)",
            zIndex: 6,
          })}
        >
          {tokenAddresses.length}
        </Text>
      )}

      {!beforeImportedItems ? (
        tokenAddresses.slice(0, 5).map((tokenAddress, index) => (
          <Box key={tokenAddress}>
            <WithTokenDetails collectionAddress={collectionAddress} tokenAddress={tokenAddress}>
              {(token) => (
                <Image
                  bg={token.backgroundColor}
                  src={token.imageUrl + "/public"}
                  sx={{
                    borderRadius: 12,
                    overflow: "hidden",
                    ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
                    ...getImageStyle(index),
                  }}
                  width={getImageSize(index)}
                  height={getImageSize(index)}
                  pos="absolute"
                />
              )}
            </WithTokenDetails>
          </Box>
        ))
      ) : (
        <>
          {beforeImportedItems.map((item, index) => (
            <Box key={item.item_id}>
              <Image
                bg="mono.1"
                src={item.image}
                sx={{
                  borderRadius: 12,
                  overflow: "hidden",
                  ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
                  ...getImageStyle(index),
                }}
                width={getImageSize(index)}
                height={getImageSize(index)}
                pos="absolute"
              />
            </Box>
          ))}
          )
        </>
      )}
    </Box>
  )
}

export default StackedImages
