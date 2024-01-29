import type {
  ButtonStylesParams,
  BadgeStylesParams,
  MantineTheme,
  InputStylesParams,
  CheckboxStylesParams,
} from "@mantine/core"
import { getSize } from "@mantine/core"

interface Variations {
  variant?: string
  size: string | number
}

const height = { sm: 30, md: 48, lg: 72 }

const styles = {
  /* Buttons */
  Button: (theme: MantineTheme, { radius }: ButtonStylesParams, { variant, size }: Variations) => {
    const height = { sm: 30, md: 52, lg: 64 }
    const padding = { sm: 20, md: 26, lg: 40 }
    const fontSize = { sm: 12, md: 18, lg: 24 }
    let borderColor = theme.colors.mono[0]
    let backgroundColor = theme.colors.mono[6]
    let color = theme.colors.mono[0]
    let hoverColor = theme.colors.mono[9]
    let hoverBackgroundColor = theme.colors.mono[0]
    let hoverBorderColor = "none"
    let border = "none"

    switch (variant) {
      case "default":
        color = theme.colors.mono[3]
        backgroundColor = "transparent"
        hoverColor = theme.colors.mono[0]
        hoverBackgroundColor = theme.colors.mono[8]
        break
      case "outline":
        backgroundColor = "transparent"
        border = `1px solid ${borderColor}`
        break
      case "light":
        backgroundColor = "transparent"
        hoverBackgroundColor = "transparent"
        borderColor = theme.colors.mono[3]
        color = theme.colors.mono[3]
        border = `1px solid ${borderColor}`
        hoverColor = theme.colors.mono[0]
        hoverBorderColor = theme.colors.mono[0]
        break
      case "subtle":
        backgroundColor = theme.colors.mono[9]
        hoverBackgroundColor = theme.colors.mono[8]
        hoverColor = theme.colors.mono[0]
        break
      case "white":
        backgroundColor = "transparent"
        hoverBackgroundColor = "transparent"
        hoverColor = theme.colors.mono[3]
        break
    }

    return {
      root: {
        backgroundColor,
        borderColor,
        color,
        border,
        fontFamily: theme.headings.fontFamily,
        fontSize: getSize({ size, sizes: fontSize }),
        fontWeight: 600,
        height: variant === "white" ? "auto" : getSize({ size, sizes: height }),
        paddingLeft: variant === "white" ? 0 : getSize({ size, sizes: padding }),
        paddingRight: variant === "white" ? 0 : getSize({ size, sizes: padding }),
        borderRadius: radius ? radius : 8,

        "&:hover": {
          color: hoverColor,
          backgroundColor: hoverBackgroundColor,
          borderColor: hoverBorderColor,
        },

        "&:disabled, &[data-disabled]": {
          opacity: 0.4,
          backgroundColor,
          borderColor,
          color,
        },
      },
      leftIcon: {
        marginRight: getSize({ size, sizes: theme.spacing }),
      },
      rightIcon: {
        marginLeft: getSize({ size, sizes: theme.spacing }),
      },
    }
  },

  /* Inputs */
  Input: (theme: MantineTheme, _: InputStylesParams, { size }: Variations) => {
    const label = { md: theme.fontSizes.sm, lg: theme.fontSizes.md }
    const spacing = { md: theme.spacing.sm, lg: theme.spacing.md }
    const background = theme.colors.mono[7]

    return {
      label: {
        fontSize: getSize({ size, sizes: label }),
        marginBottom: getSize({ size, sizes: spacing }),
      },
      input: {
        border: 0,
        borderBottom: `1px solid ${background}`,
        height: getSize({ size, sizes: height }),
        lineHeight: `calc(${getSize({ size, sizes: height })} - 2px)`,
      },
      error: {
        color: theme.other.danger,
        fontSize: theme.fontSizes.sm,
        textAlign: "right",
      },
      invalid: {
        borderColor: theme.other.danger,
        "&:focus": { borderColor: theme.other.danger },
      },
    }
  },
  Checkbox: (theme: MantineTheme, _: CheckboxStylesParams, { size }: Variations) => {
    const iconSize = { xs: 16, sm: 20 }

    return {
      input: {
        borderRadius: 2,
        background: "none",
        borderColor: theme.colors.mono[3],

        "&:hover": {
          borderColor: theme.colors.mono[0],
        },

        "&:checked": {
          background: theme.colors.mono[0],
          borderColor: theme.colors.mono[0],
        },

        "&:checked + .mantine-Checkbox-icon, &:not(:checked) + .mantine-Checkbox-icon": {
          color: theme.colors.mono[9],
          fontSize: getSize({ size, sizes: iconSize }),
        },
      },

      label: {
        color: theme.colors.mono[3],
        paddingLeft: 12,
        fontSize: 16,
      },
      error: { marginTop: 0 },
    }
  },
  Radio: (theme: MantineTheme) => {
    return {
      inner: {
        alignSelf: "center",
      },
      radio: {
        background: "transparent",
        borderColor: theme.other.hover,
        width: 16,
        height: 16,
        "&:checked": { background: "unset", borderColor: theme.other.hover },
      },
      icon: {
        width: 8,
        height: 8,
        color: theme.other.hover,
      },
    }
  },
  Slider: (theme: MantineTheme) => {
    return {
      track: {
        height: 10,
        backgroundColor: theme.colors.mono[6],
        "&:before": {
          backgroundColor: theme.colors.mono[6],
        },
      },
      bar: {
        height: 10,
        backgroundColor: theme.colors.mono[0],
      },
      thumb: {
        height: 40,
        width: 40,
        borderRadius: 10,
        backgroundColor: theme.colors.mono[0],
        border: `3px solid ${theme.colors.mono[9]}`,
        transition: "height 100ms ease-in-out, width 100ms ease-in-out",
        "&:hover": {
          height: 44,
          width: 44,
        },
      },
      label: {
        display: "none",
      },
      mark: { display: "none" },
      markLabel: {
        marginTop: 30,
        fontWeight: 600,
      },
    }
  },

  /* Navigation */
  Anchor: (theme: MantineTheme) => {
    return {
      color: theme.other.brand,
      "&:hover": {
        color: theme.other.hover,
      },
    }
  },
  Tabs: (theme: MantineTheme) => {
    return {
      tabsList: {
        backgroundColor: "transparent",
      },
      tab: {
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: "transparent",
        color: theme.colors.mono[3],
        fontSize: theme.fontSizes.md,
        fontWeight: 600,
        height: getSize({ size: "md", sizes: height }),
        padding: `0 ${theme.spacing.lg}`,

        ...theme.fn.hover({
          color: theme.colors.mono[0],
        }),

        "&[data-active]": {
          borderBottom: `1px solid ${theme.colors.mono[0]}`,
          color: theme.colors.mono[0],
        },
      },
    }
  },
  Pagination: (theme: MantineTheme) => {
    return {
      control: {
        width: 36,
        height: 36,
        border: "none",
        borderRadius: 4,
        backgroundColor: "transparent",
        color: theme.colors.mono[2],
        fontFamily: "Manrope",
        "&:hover": {
          backgroundColor: theme.colors.mono[7],
        },
        "&[data-active]": {
          "&:hover:not([data-disabled])": {
            backgroundColor: theme.colors.mono[1],
          },
          backgroundColor: theme.colors.mono[0],
          color: theme.colors.mono[8],
        },
        "&:first-of-type": {
          backgroundColor: theme.colors.mono[6],
          color: theme.colors.mono[0],
          marginRight: 4,
          "&:hover": {
            backgroundColor: theme.colors.mono[5],
          },
        },
        "&:last-of-type": {
          backgroundColor: theme.colors.mono[6],
          color: theme.colors.mono[0],
          marginLeft: 4,
          "&:hover": {
            backgroundColor: theme.colors.mono[5],
          },
        },
      },
    }
  },

  /* Data display */
  Accordion: (theme: MantineTheme) => {
    return {
      item: {
        backgroundColor: theme.colors.mono[7],
        borderRadius: 12,
        border: 0,
        "&:not(:first-of-type)": {
          marginTop: theme.spacing.xs,
        },

        "&:first-of-type": {
          overflow: "hidden",
        },

        "&:last-of-type": {
          overflow: "hidden",
        },
      },
      control: {
        userSelect: "text",
        minHeight: 60,
        padding: `0 ${theme.spacing.xl}`,
        color: theme.colors.mono[0],
        "&:hover .mantine-Accordion-chevron": {
          color: theme.other.hover,
        },
        "&:hover": {
          background: "none",
        },
      },
      content: {
        borderTop: `1px solid ${theme.colors.mono[6]}`,
        padding: theme.spacing.xl,
      },
      label: {
        padding: "12px 0",
      },
    }
  },
  Badge: (theme: MantineTheme, { color }: BadgeStylesParams, { size }: Variations) => {
    const padding = { sm: "0 8px", md: "0 6px", lg: "0 11px" }
    const height = { sm: "19px", md: "20px", lg: "28px" }
    const label = { sm: theme.fontSizes.xs, md: theme.fontSizes.sm, lg: theme.fontSizes.sm }
    const fontColor = {
      sm: theme.colors[color ?? "mono"][0],
      md: theme.colors.mono[8],
      lg: theme.colors[color ?? "mono"][0],
    }
    const backgroundColor = {
      sm: theme.colors.mono[9],
      md: theme.colors[color ?? "mono"][9] ?? theme.colors.mono[3],
      lg: theme.colors.mono[5],
    }

    return {
      root: {
        padding: getSize({ size, sizes: padding }),
        height: getSize({ size, sizes: height }),
        fontSize: getSize({ size, sizes: label }),
        color: getSize({ size, sizes: fontColor }),
        backgroundColor: getSize({ size, sizes: backgroundColor }),
      },
    }
  },

  /* Overlays */
  Drawer: (theme: MantineTheme) => {
    return {
      content: {
        backgroundColor: theme.colors.mono[9],
        color: theme.colors.mono[0],
      },
      header: {
        height: 60,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: theme.spacing.xl,
        paddingRight: theme.spacing.xl,
        marginBottom: 0,
      },
      title: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.headings.fontFamily,
        fontWeight: 500,
      },
      body: {
        height: `calc(80vh - 60px)`,
        padding: theme.spacing.xl,
        paddingTop: 0,
      },
    }
  },
  Tooltip: (theme: MantineTheme) => {
    return {
      tooltip: {
        background: theme.other.hover,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.mono[9],
        padding: "6px 12px",
      },
    }
  },

  /* dates */
  TimeInput: (theme: MantineTheme) => {
    return {
      input: {
        border: 0,
        backgroundColor: theme.colors.mono[7],
        padding: "0 16px",
        "&:hover": {
          backgroundColor: theme.colors.mono[6],
        },
      },
    }
  },
  Calendar: (theme: MantineTheme) => {
    return {
      calendarBase: {
        maxWidth: "none",
      },
      calendarHeader: {
        button: {
          color: theme.colors.brand[0],
        },
      },
      day: {
        margin: 6,
        width: 32,
        height: 32,
        lineHeight: "32px",
        borderRadius: "50%",
        "&[data-selected]": {
          backgroundColor: theme.colors.brand[0],
        },
      },
    }
  },

  /* others */
  Notification: () => {
    return {
      root: {
        position: "absolute",
        top: 0,
        right: 0,
        marginTop: "76px",
        padding: "10px 20px !important",
        borderRadius: "12px",
        width: "fit-content",
        marginLeft: "auto",
        marginRight: "20px",
      },
      icon: {
        backgroundColor: "transparent !important",
      },
    }
  },
}

export default styles
