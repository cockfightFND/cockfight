import { Button, Divider } from "@mantine/core"
import { Link } from "react-router-dom"
import Icon from "../../../styles/icons/Icon"

const InventoryGameDetailsMenu = ({ hasTokens, isPfp }: { hasTokens: boolean; isPfp?: boolean }) => {
  return (
    <Button.Group
      sx={({ fn }) => ({
        width: "fit-content",
        height: 39,
        borderRadius: 12,
        fontWeight: 600,
        border: `2px solid ${fn.themeColor("mono.9")}`,
        a: { flex: 1, border: "none", fontSize: 12 },
      })}
    >
      {hasTokens && (
        <>
          <Button variant="outline" color="dark" component={Link} to={`./export`} leftIcon={<Icon.Export />}>
            Export
          </Button>
          <Divider orientation="vertical" color="mono.9" my={10} />
        </>
      )}
      {!isPfp && (
        <Button variant="outline" color="dark" component={Link} to={`./import`} leftIcon={<Icon.Import />}>
          Import
        </Button>
      )}
    </Button.Group>
  )
}

export default InventoryGameDetailsMenu
