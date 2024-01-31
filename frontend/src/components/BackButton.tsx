import { forwardRef } from "react"
import type { ButtonProps } from "@mantine/core"
import { Flex, UnstyledButton, createPolymorphicComponent } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import Icon from "../styles/icons/Icon"
import { GLOBAL_PADDING } from "../styles/variables"

interface Props extends ButtonProps {
  to?: string
  replace?: boolean
}

const _BackButton = forwardRef<HTMLButtonElement, Props>(({ to, replace, ...others }, ref) => {
  const navigate = useNavigate()
  const { state } = useLocation()

  return (
    <UnstyledButton
      p={GLOBAL_PADDING}
      onClick={() => (to ? navigate(to, { state, replace }) : navigate("/main"))}
      ref={ref}
      {...others}
    >
      <Flex>
        <Icon.Back />
      </Flex>
    </UnstyledButton>
  )
})

const BackButton = createPolymorphicComponent<"button", Props>(_BackButton)

export default BackButton
