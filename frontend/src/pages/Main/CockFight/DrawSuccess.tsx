import { Link } from "react-router-dom"
import Confetti from "react-confetti"
import { useRecoilValue } from "recoil"
import { Box, Flex, Image, SimpleGrid, Text } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"
import type { TicketResponse } from "@initia/marketplace-api-types"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"
import DrawButtons from "./DrawButtons"
import DrawPoolItem from "./DrawPoolItem"
import PrimaryButton from "../../../components/PrimaryButton"
import { fixedBottomHeightState, navigationBarHeightState } from "../../../app/hooks"
import { GLOBAL_PADDING } from "../../../styles/variables"

const DrawSuccess = ({ results, isPfp }: { results: TicketResponse[]; isPfp: boolean }) => {
  const { ref, width } = useElementSize()
  const { pool } = useDrawPoolEntry()
  const navigationHeight = useRecoilValue(navigationBarHeightState)
  const fixedBottomHeight = useRecoilValue(fixedBottomHeightState)

  const paddingBottom = navigationHeight + GLOBAL_PADDING + (fixedBottomHeight ? fixedBottomHeight + GLOBAL_PADDING : 0)

  if (!results[0].result) throw new Error("No Results!!")
  const hasPrize = results.some((item) => !!(item.result && item.result?.index === 0))
  const isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)

  return (
    <>
      <Box
        ref={ref}
        pos="absolute"
        top={48}
        left={0}
        right={0}
        pt={1}
        h={isMobile ? "calc(100vh - 48px)" : 738}
        sx={{ overflowX: "hidden", overflowY: "scroll" }}
      >
        <Box
          pos="sticky"
          top={-2}
          pt={40}
          pb={60}
          w="100%"
          sx={{
            backgroundImage: "linear-gradient(180deg, #7455D9 80%, rgba(116, 85, 217, 0) 100%)",
            zIndex: 2,
          }}
        >
          <Text
            fz={32}
            c="white"
            fw={400}
            ff="Fugaz One"
            align="center"
            tt="uppercase"
            sx={{ textShadow: "0px 3px 0px black" }}
          >
            {hasPrize ? (
              <>
                Congrats,
                <br />
                here’s your
                <br />
                prize!
              </>
            ) : (
              "Try Again?"
            )}
          </Text>
          {!hasPrize && (
            <Box component={Link} c="purple.1" fz={14} fw={600} to={"/draw"}>
              <Text align="center">
                or{" "}
                <Text span td="underline">
                  Back to Home
                </Text>
              </Text>
            </Box>
          )}
        </Box>
        <Flex direction="column" justify="center" align="center" pb={paddingBottom}>
          {(hasPrize || results.length === 1) && (
            <DrawPoolItem
              token={results[0].result.token}
              poolId={pool.poolId}
              isPfp={isPfp}
              runAnim={hasPrize}
              spinCount={2}
              duration={500}
            />
          )}
          {results.length > 1 && (
            <SimpleGrid cols={5} spacing={4} p={16} mt={hasPrize ? 60 : undefined} mb={100} w="100%" sx={{ zIndex: 1 }}>
              {results.map((ticket) => (
                <Box key={ticket.ticketId} sx={{ borderRadius: 8, boxShadow: "0px 4px 9px 0px hsla(0, 0%, 0%, 0.1)" }}>
                  <Image
                    key={ticket.ticketId}
                    src={ticket.result?.token.imageUrl + "/public"}
                    bg="white"
                    width={(width - 48) / 5}
                    height={(width - 48) / 5}
                    sx={{
                      borderRadius: 8,
                      boxShadow:
                        "0px 2px 5px 0px hsla(0, 0%, 100%, 0.2) inset, 0px -2px 3px 0px hsla(0, 0%, 0%, 0.19) inset",
                      ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
                    }}
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}

          {hasPrize && (
            <Flex
              pos={isMobile ? "fixed" : "absolute"}
              bottom={isMobile ? 0 : 87}
              pt={40}
              pb={40}
              w="100%"
              justify="center"
              sx={{
                backgroundImage: isMobile
                  ? "linear-gradient(180deg, rgba(116, 85, 217, 0) 0%, #7455D9 40%)"
                  : undefined,
                zIndex: 2,
              }}
            >
              {isMobile ? (
                <PrimaryButton component={Link} to={"/my"} px={46}>
                  Go to mypage
                </PrimaryButton>
              ) : (
                <Flex
                  pos="fixed"
                  justify="center"
                  align="center"
                  w={375}
                  h={127}
                  sx={{
                    backgroundImage: "linear-gradient(180deg, rgba(116, 85, 217, 0) 0%, #7455D9 40%)",
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                  }}
                >
                  <PrimaryButton component={Link} to={"/my"} px={46}>
                    Go to mypage
                  </PrimaryButton>
                </Flex>
              )}
            </Flex>
          )}
        </Flex>

        {hasPrize && (
          <Confetti
            recycle={false}
            confettiSource={{
              x: (isMobile ? window.innerWidth : 375) / 2,
              y: 100,
              w: 10,
              h: 10,
            }}
            tweenDuration={500}
            gravity={0.1}
            width={isMobile ? window.innerWidth : 375}
            height={isMobile ? window.innerHeight : 738}
            numberOfPieces={30}
            colors={["#61FFF6", "#FFEF61"]}
            drawShape={(ctx) => {
              ctx.fillRect(0, 0, 22, 30)
            }}
          />
        )}
      </Box>
      {!hasPrize && <DrawButtons />}
    </>
  )
}

export default DrawSuccess
