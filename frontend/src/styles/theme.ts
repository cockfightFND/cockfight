import type { Tuple } from "@mantine/core"
import styles from "./styles"

const createColors = (color: string) => Array(10).fill(color) as Tuple<string, 10>

const theme = {
  colors: {
    mono: [
      "hsl(0, 0%, 97%)",
      "hsl(0, 0%, 93%)",
      "hsl(0, 0%, 88%)",
      "hsl(0, 0%, 73%)",
      "hsl(0, 0%, 64%)",
      "hsl(0, 0%, 54%)",
      "hsl(0, 0%, 44%)",
      "hsl(0, 0%, 26%)",
      "hsl(0, 0%, 14%)",
      "hsl(0, 0%, 10%)",
    ] as Tuple<string, 10>,
    brand: createColors("#7B61FF"),
    brandDark: createColors("#160926"),
    white: createColors("#FFFFFF"),
    black: createColors("#000000"),
    danger: createColors("#FF005C"),
  },
  fontFamily: "Visby CF",
  lineHeight: 1.3,
  components: {
    Drawer: {
      defaultProps: { position: "bottom", size: "auto", styles: styles.Drawer },
    },
    Image: {
      defaultProps: { fit: "contain", withPlaceholder: true, styles: styles.Image },
    },
    Modal: {
      defaultProps: { styles: styles.Modal },
    },
    Slider: {
      defaultProps: { color: "black", min: 0, step: 1, label: null },
    },
    TextInput: {
      defaultProps: { styles: styles.TextInput },
    },
    Checkbox: {
      defaultProps: { styles: styles.Checkbox },
    },
  },
  globalStyles: () => ({
    html: { touchAction: "manipulation", userSelect: "none" } as const,
    body: { fontWeight: 700 },
    a: { color: "inherit", textDecoration: "none" },
    svg: { fill: "currentColor" },
    img: { WebkitUserDrag: "none" },
  }),
  other: { brand: "#7B61FF" },
}

export default theme
