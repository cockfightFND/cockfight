import { useMantineTheme } from "@mantine/core"
import { useOs } from "@mantine/hooks"

// create media query style object
// example: bpStyles({ property: [base, mobile, laptop] })
interface StyleObject {
  [key: string]: string | number | StyleObject
}

interface InputObject {
  [key: string]: Array<string | number | StyleObject>
}

const breakpoints: Record<number, string> = {
  1: "@media(max-width: 992px)", // mobile
  2: "@media(min-width: 992px) and (max-width: 1600px)", // laptop
}

export function bpStyles(styles: InputObject): StyleObject {
  const result: StyleObject = {}

  for (const [key, value] of Object.entries(styles)) {
    if (!Array.isArray(value)) {
      result[key] = value
      continue
    }

    for (const [index, val] of value.entries()) {
      if (index === 0) {
        result[key] = val
        continue
      }

      if (!result[breakpoints[index]]) {
        result[breakpoints[index]] = {}
      }

      Object.assign(result[breakpoints[index]], { [key]: val })
    }
  }

  return result
}

export const useTableStyles = () => {
  const theme = useMantineTheme()
  return {
    "thead tr th": {
      fontSize: theme.fontSizes.sm,
      fontWeight: 600,
      color: theme.colors.mono[2],
      padding: "12px 10px",
      backgroundColor: theme.colors.mono[6],
      borderBottomColor: theme.colors.mono[9],
      ":first-of-type": {
        paddingLeft: 32,
        borderTopLeftRadius: 12,
      },
      ":last-of-type": {
        paddingRight: 32,
        borderTopRightRadius: 12,
      },
    },
    "tbody tr": {
      backgroundColor: theme.colors.mono[7],
      td: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.mono[0],
        padding: "32px 10px",
        borderTopColor: theme.colors.mono[9],
        ":first-of-type": {
          paddingLeft: 32,
        },
        ":last-of-type": {
          paddingRight: 32,
        },
      },
      ":last-of-type": {
        td: {
          ":first-of-type": {
            borderBottomLeftRadius: 12,
          },
          ":last-of-type": {
            borderBottomRightRadius: 12,
          },
        },
      },
    },
  }
}

export const useModalStyles = () => {
  const theme = useMantineTheme()
  return {
    inner: {
      ...bpStyles({
        padding: ["inherit", "0 !important"],
      }),
    },

    content: {
      flex: "unset !important",
      border: `1px solid ${theme.colors.mono[5]}`,
      background: theme.colors.mono[8],
      ...bpStyles({
        marginTop: [0, "auto"],
        height: ["fit-content", "80%"],
        width: [650, "100%"],
        borderRadius: [36, "36px 36px 0px 0px"],
      }),
    },
    title: {
      flex: 1,
      fontSize: 24,
      fontWeight: 500,
      color: theme.colors.mono[0],
    },
    header: {
      background: theme.colors.mono[8],
      justifyContent: "flex-end",
      padding: "40px 40px 0px !important",
    },
    body: {
      ...bpStyles({
        padding: ["0px 40px 40px", "0px 20px 40px"],
      }),
    },
    close: {
      width: 28,
      height: 28,
      color: theme.colors.mono[3],
      svg: {
        width: 28,
        height: 28,
      },
      ":hover": {
        color: theme.colors.mono[0],
      },
    },
  }
}

export const useDrawerModalTableStyles = () => {
  const theme = useMantineTheme()
  return {
    table: {
      width: "100%",
    },
    "thead tr th": {
      padding: "12px 0",
      fontWeight: 500,
      color: theme.colors.mono[3],
      ...bpStyles({ fontSize: [14, 12] }),
      borderColor: theme.colors.mono[7],
      ":first-of-type": {
        ...bpStyles({ paddingLeft: [190, 20, 80] }),
      },
      ":last-of-type": {
        ...bpStyles({ paddingRight: [190, 20, 80] }),
      },
    },
    "tbody tr": {
      cursor: "pointer",
      "&.selected": {
        backgroundColor: theme.colors.mono[8],
        td: {
          color: theme.colors.mono[0],
        },
      },
      ":hover": {
        backgroundColor: theme.colors.mono[8],
        td: {
          color: theme.colors.mono[0],
        },
      },
      td: {
        color: theme.colors.mono[4],
        padding: "20px 0",
        borderColor: theme.colors.mono[7],
        borderBottom: `1px solid ${theme.colors.mono[7]}`,
        ":first-of-type": {
          ...bpStyles({ paddingLeft: [190, 20, 80] }),
        },
        ":last-of-type": {
          ...bpStyles({ paddingRight: [190, 20, 80] }),
        },
      },
    },
  }
}

export const useSelectDrawerStyles = () => {
  const theme = useMantineTheme()
  return {
    content: {
      height: "calc(100% - 64px) !important",
      backgroundColor: theme.colors.mono[9],
      overflow: "auto",
    },
    header: {
      padding: 0,
      backgroundColor: theme.colors.mono[9],
      borderBottom: `1px solid ${theme.colors.mono[7]}`,
    },
    body: {
      padding: 0,
      backgroundColor: theme.colors.mono[9],
    },
    title: {
      width: "100%",
    },
    overlay: {
      backdropFilter: "none !important",
    },
  }
}

export const useInputStyles = () => {
  const theme = useMantineTheme()
  return {
    wrapper: {
      flex: 1,
    },
    input: {
      borderRadius: 0,
      backgroundColor: "transparent",
      border: 0,
      color: theme.colors.mono[0],
      fontWeight: 700,
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: "right" as const,
      ...bpStyles({
        fontSize: [110, 48, 90],
        height: [141, "auto", 116],
      }),
      ":disabled": {
        backgroundColor: "transparent",
        color: theme.colors.mono[4],
      },
    },
  }
}

export const useFullWidthTableStyles = () => {
  const theme = useMantineTheme()
  const os = useOs()
  const rowStyles =
    os === "ios"
      ? {
          td: {
            ":first-of-type": [{ paddingLeft: 20 }],
            ":last-of-type": [{ paddingRight: 20 }],
          },
          tr: {
            position: "relative",
            "th,td": {
              position: "relative",
              zIndex: 1,
              minWidth: "200px",
              border: "none !important",
            },
            borderBottom: `1px solid${theme.colors.mono[7]}`,
            width: "100%",
          },
          "thead tr": {
            th: {
              textTransform: "uppercase",
              ":first-of-type": [{ paddingLeft: 20 }],
              ":last-of-type": [{ paddingRight: 20 }],
            },
            borderTop: `1px solid${theme.colors.mono[7]}`,
          },
          "tbody tr": {
            "&:hover": {
              backgroundColor: theme.colors.mono[8],
            },
          },
          "[data-row-type=sell]": {
            backgroundColor: theme.colors.mono[8],
          },
        }
      : {
          td: {
            ":first-of-type": [{ paddingLeft: 20 }],
            ":last-of-type": [{ paddingRight: 20 }],
          },
          tr: {
            position: "relative",
            "th,td": {
              position: "relative",
              zIndex: 1,
              minWidth: "200px",
              border: "none !important",
            },
            "&::before": {
              zIndex: 0,
              content: "''",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              borderBottom: `1px solid${theme.colors.mono[7]}`,
              width: "100%",
              "@media(min-width: 1240px)": {
                width: "100vw",
                left: "calc(-1 * (100vw - 100%)/2)",
              },
            },
          },
          "thead tr": {
            th: {
              textTransform: "uppercase",
              ":first-of-type": [{ paddingLeft: 20 }],
              ":last-of-type": [{ paddingRight: 20 }],
            },
            "&::before": {
              borderTop: `1px solid${theme.colors.mono[7]}`,
            },
          },
          "tbody tr": {
            "&:hover": {
              "&::before": {
                backgroundColor: theme.colors.mono[8],
              },
            },
          },
          "[data-row-type=sell]": {
            "&:before": {
              backgroundColor: theme.colors.mono[8],
            },
          },
        }
  return rowStyles
}

export const useMyPageTableStyles = () => {
  const theme = useMantineTheme()
  const tableStyles = useFullWidthTableStyles()
  return {
    ...tableStyles,
    "[data-row-type=subRow]": {
      td: {
        ...bpStyles({
          paddingTop: [12, 8],
          paddingBottom: [12, 8],
        }),
      },
      "&:not(:last-of-type):before": {
        border: "none",
      },
      "& + tr:not([data-row-type=subRow])": {
        "&:before": {
          borderTop: `1px solid${theme.colors.mono[7]}`,
        },
      },
    },
    "tbody tr td": {
      ...bpStyles({
        paddingTop: [40, 20],
        paddingBottom: [40, 20],
        ":first-of-type": [{ paddingLeft: 20 }],
        ":last-of-type": [{ paddingRight: 20 }],
      }),
    },
  }
}

export const useValidatorTableStyles = () => {
  const theme = useMantineTheme()

  const tableStyles = useFullWidthTableStyles()
  return {
    ...tableStyles,
    "thead tr th": {
      fontWeight: 600,
      color: theme.colors.mono[4],
      ...bpStyles({ fontSize: [12, 11] }),
    },
    "tbody tr td": {
      ...bpStyles({
        paddingTop: [35, 20],
        paddingBottom: [35, 20],
        ":first-of-type": [{ paddingLeft: 20 }],
        ":last-of-type": [{ paddingRight: 20 }],
      }),
    },
  }
}

export const useAppPaginationStyles = () => {
  const theme = useMantineTheme()
  return {
    control: {
      width: 36,
      height: 36,
      border: "none",
      borderRadius: 4,
      backgroundColor: "transparent",
      color: theme.colors.mono[2],

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
        marginRight: 12,
        "&:hover": {
          backgroundColor: theme.colors.mono[5],
        },
      },
      "&:last-of-type": {
        backgroundColor: theme.colors.mono[6],
        color: theme.colors.mono[0],
        marginLeft: 12,
        "&:hover": {
          backgroundColor: theme.colors.mono[5],
        },
      },
    },
  }
}

export const useAppHeaderStyles = () => {
  const theme = useMantineTheme()
  return {
    root: {
      header: {
        borderBottom: `1px solid ${theme.colors.mono[7]}`,
        a: {
          display: "flex",
          alignItems: "center",
          height: "100%",
          borderTop: `2px solid transparent`,
          borderBottom: `2px solid transparent`,
          ...bpStyles({ padding: ["0 12px", "0"] }),
        },

        "a.active": {
          borderBottomColor: theme.colors.mono[0],
        },
      },
    },
  }
}

export const useBlurButtonStyles = () => {
  const theme = useMantineTheme()
  return {
    flex: 1,
    ...bpStyles({
      paddingLeft: [36, 24],
      paddingRight: [36, 24],
      height: [76, 68],
      fontSize: [24, 20],
    }),
    color: theme.colors.mono[0],
    background: "rgba(161, 166, 170, 0.06)",
    textAlign: "right",
    borderRadius: 0,
    ":hover": {
      color: theme.colors.mono[1],
      background: "rgba(161, 166, 170, 0.06)",
      svg: {
        color: theme.colors.mono[1],
      },
    },
    ":disabled": {
      color: theme.colors.mono[5],
      background: "rgba(161, 166, 170, 0.06)",
      svg: {
        color: theme.colors.mono[5],
      },
    },
  } as const
}

export const useProposalInputStyles = () => {
  const theme = useMantineTheme()

  const wrapper = {
    label: { fontSize: 12, fontWeight: 600, color: theme.colors.mono[2] },
  }

  const input = {
    wrapper: { width: "100%", borderBottom: `1px solid ${theme.colors.mono[6]}` },
    input: { "&[data-with-icon]": { paddingLeft: 36 }, ...bpStyles({ fontSize: [24, 20], height: [60, 45] }) },
  }

  return { wrapper, input }
}

export const useProposaSelectStyles = () => {
  const theme = useMantineTheme()

  return {
    input: {
      textOverflow: "ellipsis",
      textTransform: "capitalize" as const,
      paddingLeft: 0,
      background: "unset",
      border: "none",
      borderRadius: 0,
      borderBottom: `1px solid ${theme.colors.mono[6]}`,
      minWidth: "fit-content",
      ...bpStyles({ height: [60, 45], fontSize: [24, 20] }),
    },

    dropdown: {
      maxHeight: 350,
      textTransform: "capitalize" as const,
      overflow: "auto",
      borderRadius: 0,
    },

    itemsWrapper: {
      padding: 0,
      background: theme.colors.mono[8],
    },

    item: {
      padding: "16px 12px",
      fontSize: 16,
      fontWeight: 500,
      borderRadius: 0,

      ":hover": {
        background: theme.colors.mono[7],
      },

      "&[data-selected]": {
        background: theme.colors.mono[7],
        ":hover": {
          background: theme.colors.mono[7],
        },
      },
    },
  }
}
