import { bcs } from "@initia/query"

function getVectorSize<T>(type: string, vector: T[], margin = 100) {
  const typeByteSizes: { [key: string]: number } = {
    u8: 1,
    u16: 2,
    u32: 4,
    u64: 8,
    u128: 16,
    u256: 32,
    bool: 1,
    address: 32,
  }

  const initialSize = (Math.ceil(vector.length ** (1 / 256)) + 1) * 8

  const size = vector.reduce((acc, val) => {
    const length = type in typeByteSizes ? typeByteSizes[type] : bcs.ser(type, val).toBytes().length
    return acc + length
  }, 0)

  return initialSize + size + margin
}

export default getVectorSize
