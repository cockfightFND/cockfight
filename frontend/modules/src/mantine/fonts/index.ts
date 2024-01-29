import Thin from "./PilatWide-Thin.woff2"
import Light from "./PilatWide-Light.woff2"
import Regular from "./PilatWide-Regular.woff2"
import Book from "./PilatWide-Book.woff2"
import Demi from "./PilatWide-Demi.woff2"
import Bold from "./PilatWide-Bold.woff2"
import Heavy from "./PilatWide-Heavy.woff2"
import Black from "./PilatWide-Black.woff2"

const PilatWide: [number, string][] = [
  [100, Thin],
  [300, Light],
  [400, Regular],
  [500, Book],
  [600, Demi],
  [700, Bold],
  [800, Heavy],
  [900, Black],
]

const fonts = PilatWide.map(([weight, src]) => ({
  "@font-face": {
    fontFamily: "Pilat Wide",
    src: `url('${src}')`,
    fontWeight: weight,
  },
}))

export default fonts
