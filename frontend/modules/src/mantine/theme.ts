import DoneSharpIcon from "@mui/icons-material/DoneSharp"
import type { MantineThemeOverride, Tuple } from "@mantine/core"
import styles from "./styles"

const createColors = (color: string) => Array(10).fill(color) as Tuple<string, 10>

const theme: MantineThemeOverride = {
  colorScheme: "dark",
  cursorType: "pointer",
  defaultRadius: 12,
  colors: {
    mono: [
      "#F5F5F5", // 0
      "#D1D9E0", // 1
      "#A1A6AA", // 2
      "#757C82", // 3
      "#585F67", // 4
      "#383D42", // 5
      "#303437", // 6
      "#222426", // 7
      "#161717", // 8
      "#070708", // 9
    ],
    brand: createColors("#2AB9FC"),
    hover: createColors("#5FC1EE"),
    success: createColors("#B0EE5F"),
    danger: createColors("#FF5656"),
    warning: createColors("#FFBE5E"),
    info: createColors("#27D8FF"),
    extra: createColors("#CE89F4"),
  },
  primaryColor: "mono",
  fontFamily: "Pilat Wide",
  lineHeight: 1.5,
  fontSizes: { xs: "10px", sm: "12px", md: "14px", lg: "20px", xl: "24px" },
  spacing: { xs: "2px", sm: "4px", md: "8px", lg: "12px", xl: "20px" },
  headings: {
    fontFamily: "Pilat Wide",
    sizes: {
      h1: { fontSize: "50px", fontWeight: 700, lineHeight: 1.2 },
      h2: { fontSize: "40px", fontWeight: 600, lineHeight: 1.2 },
      h3: { fontSize: "28px", fontWeight: 600, lineHeight: 1.2 },
      h4: { fontSize: "24px", fontWeight: 600, lineHeight: 1.2 },
      h5: { fontSize: "16px", fontWeight: 600, lineHeight: 1.2 },
      h6: { fontSize: "14px", fontWeight: 600, lineHeight: 1.2 },
    },
  },
  components: {
    /* Buttons */
    Button: { defaultProps: { styles: styles.Button } },

    /* Inputs */
    TextInput: { defaultProps: { variant: "filled", styles: styles.Input } },
    Checkbox: { defaultProps: { icon: DoneSharpIcon, size: "xs", styles: styles.Checkbox } },
    Radio: { defaultProps: { styles: styles.Radio } },
    Slider: { defaultProps: { styles: styles.Slider } },

    /* Navigation */
    Anchor: { defaultProps: { underline: false, sx: styles.Anchor } },
    Tabs: { defaultProps: { variant: "unstyled", keepMounted: false, styles: styles.Tabs } },
    Pagination: {
      defaultProps: { getItemProps: (page: number) => ({ fz: page > 10000 ? 12 : 14 }), styles: styles.Pagination },
    },

    /* Data display */
    Accordion: { defaultProps: { transitionDuration: 100, multiple: true, styles: styles.Accordion } },
    Badge: { defaultProps: { radius: 2, styles: styles.Badge } },

    /* Overlays */
    Drawer: {
      defaultProps: {
        size: "80vh",
        position: "bottom",
        transitionProps: { duration: 100 },
        zIndex: 1050,
        overlayProps: { blur: 5 },
        styles: styles.Drawer,
      },
    },
    Modal: {
      defaultProps: {
        centered: true,
        transitionProps: { duration: 100 },
        zIndex: 1050,
        overlayProps: { blur: 5 },
      },
    },
    Overlay: { defaultProps: {} },
    Tooltip: { defaultProps: { withArrow: true, arrowSize: 6, radius: 2, styles: styles.Tooltip } },

    /* Typography */
    Table: { defaultProps: { fontSize: "md", verticalSpacing: "lg" } },

    /* Miscellaneous */
    Paper: { defaultProps: {} }, // It affects Drawer
    ScrollArea: { defaultProps: { type: "never", h: "fill-available" } },

    /* dates */
    TimeInput: { defaultProps: { styles: styles.TimeInput } },
    Calendar: { defaultProps: { styles: styles.Calendar } },

    /* others */
    Notification: { defaultProps: { styles: styles.Notification } },
  },
  globalStyles: (theme) => ({
    body: {
      backgroundColor: theme.colors.mono[8],
      color: theme.colors.mono[0],
    },

    a: {
      color: "unset",
      textDecoration: "none",
    },
  }),
  other: {
    breakpoint: 992,
    breakpointLaptop: 1600,

    brand: "#2AB9FC",
    hover: "#5FC1EE",
    gradient: "linear-gradient(90deg, #39A0F4 0%, #BB8CF4 50%, #F05D7D 100%)",
    gradients: {
      left: "linear-gradient(90deg, #39A0F4 0%, #B08DF4 100%)",
      center: "linear-gradient(90deg, #B08DF4 0%, #B08DF4 100%)",
      right: "linear-gradient(90deg, #B08DF4 0%, #F05D7D 100%)",
    },

    success: "#B0EE5F",
    danger: "#FF5656",
    warning: "#FFBE5E",
    info: "#27D8FF",
    extra: "#CE89F4",

    fn: {
      borderGradient: (
        image = "linear-gradient(90deg, #39A0F4 0%, #BB8CF4 50%, #F05D7D 100%)",
        borderImageSlice = 1
      ) => ({
        borderImage: image,
        borderImageSlice,
      }),
    },
  },
}

export default theme
