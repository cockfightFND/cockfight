import { InView } from "react-intersection-observer"
import type { UseInfiniteQueryResult } from "@tanstack/react-query"
import { Center, Text } from "@mantine/core"
import { SUBMIT_MARGIN } from "../styles/variables"

const FetchNextPage = ({ hasNextPage, fetchNextPage, isFetchingNextPage }: UseInfiniteQueryResult) => {
  if (!hasNextPage) return null
  return (
    <Center mt={SUBMIT_MARGIN}>
      <Text
        component={InView}
        rootMargin="50%"
        onChange={(inView) => {
          if (!inView) return
          fetchNextPage()
        }}
        fz={12}
      >
        {isFetchingNextPage ? "Loading more..." : "Nothing more to load"}
      </Text>
    </Center>
  )
}

export default FetchNextPage
