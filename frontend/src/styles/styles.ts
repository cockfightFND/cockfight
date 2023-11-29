import type { MantineTheme } from "@mantine/core"
import { IMAGE_PADDING, MAX_WIDTH } from "./variables"

export const INPUT_PADDING = 20
export const CHECKBOX_SIZE = 16

const styles = {
  /* Image */
  Image: ({ fn }: MantineTheme) => {
    return {
      image: { padding: IMAGE_PADDING },
      placeholder: {
        backgroundColor: fn.themeColor("mono.0"),
        div: {
          display: "flex",
          justifyContent: "center",
          svg: {
            width: "50% !important",
            height: "50% !important",
          },
        },
      },
    }
  },
  /* Inputs */
  TextInput: ({ fn }: MantineTheme) => {
    return {
      input: {
        borderRadius: 12,
        border: `2px solid ${fn.themeColor("mono.2")}`,
        fontSize: 18,
        fontWeight: 800,
        height: 64,
        padding: `0 ${INPUT_PADDING}px`,

        "&:focus, &:focus-within": {
          border: `2px solid ${fn.themeColor("mono.9")}`,
        },

        "&::placeholder": {
          color: fn.themeColor("mono.3"),
        },
      },
      label: {
        color: fn.themeColor("mono.7"),
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 8,
      },
    }
  },

  /* Drawer */
  Drawer: () => {
    return {
      root: { display: "flex", justifyContent: "center" },
      inner: { maxWidth: MAX_WIDTH },
      content: { borderTopLeftRadius: "8px !important", borderTopRightRadius: "8px !important" },
      header: { padding: 20 },
      title: { flex: 1, fontSize: 16, fontWeight: 700, textAlign: "center", transform: "translateX(11px)" },
      close: { "&:active, &:hover": { background: "transparent" } },
    }
  },

  /* Modal */
  Modal: () => {
    return {
      root: { display: "flex", justifyContent: "center" },
      inner: { maxWidth: MAX_WIDTH },
      header: { padding: 20 },
      title: { flex: 1, fontSize: 16, fontWeight: 700, textAlign: "center", transform: "translateX(11px)" },
      close: { "&:active, &:hover": { background: "transparent" } },
    }
  },

  /* Checkbox */
  Checkbox: ({ fn }: MantineTheme) => {
    return {
      inner: { width: CHECKBOX_SIZE, height: CHECKBOX_SIZE },
      icon: {
        width: "100%",
        height: "100%",
        color: fn.themeColor("mono.5"),
      },
      input: {
        width: CHECKBOX_SIZE,
        height: CHECKBOX_SIZE,
        borderRadius: "50%",
        background: fn.themeColor("mono.0"),

        "&:checked": {
          borderColor: fn.themeColor("mono.9"),
          background: fn.themeColor("mono.0"),

          "&+.mantine-Checkbox-icon": {
            color: fn.themeColor("mono.9"),
          },
        },
      },

      label: {
        fontSize: 12,
        fontWeight: 600,
      },
    }
  },
}

export default styles
