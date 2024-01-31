// CONFIG
export const NETWORK_KEY = import.meta.env.INITIA_NETWORK_KEY || "game-4"
export const RPC_URL = import.meta.env.INITIA_RPC_URL || "https://rpc.game-4.initia.xyz"
export const REST_URL = import.meta.env.INITIA_REST_URL || "https://lcd.game-4.initia.xyz"

export const GAS_PRICE = import.meta.env.INITIA_GAS_PRICE || "0umin"
export const INIT_METADATA =
  import.meta.env.INITIA_INIT_METADATA || "0x58fa316c7257f4c6b2535b738f291f10a4d9ba14ac758289a2d464697cbf6c29"
export const INIT_DENOM =
  import.meta.env.INITIA_FAUCET_DENOM || "uinit"
export const MARKETPLACE_MODULE_ADDRESS =
  import.meta.env.INITIA_MARKETPLACE_MODULE_ADDRESS || "0x57b04cec102f9b76cb2cb76452982d77853351fa"
export const FAUCET_SERVER_URL = import.meta.env.INITIA_FAUCET_SERVER_URL || "https://faucet.game-4.initia.xyz"
export const FAUCET_RECAPTCHA_SITEKEY = import.meta.env.INITIA_FAUCET_RECAPTCHA_SITEKEY
export const WEB3AUTH_KEY = import.meta.env.INITIA_WEB3AUTH_KEY
export const WEB3AUTH_SECRET = import.meta.env.INITIA_WEB3AUTH_SECRET

// API
export const API_URL = import.meta.env.INITIA_API_URL || "http://localhost:3000"

// CONTRACT
export const CONTRACT_MODULE_NAME = 'cockfight'
export const CONTRACT_BECH_ADDRESS = 'init18axzdspct53qpx2kavayardap9vkyjz77ey36u'
export const CONTRACT_HEX_ADDRESS = '0x3F4C26C0385D22009956EB3A4E8DBD095962485E'

// REGEX
export const INIT_BECH32_REGEX = /^init1(?:[a-z0-9]){38}/
export const INIT_HEX_REGEX = /0x(?:[a-f1-9][a-f0-9]*){1,64}/
export const INIT_ACCOUNT_REGEX = new RegExp(
  INIT_BECH32_REGEX.source + '|' + INIT_HEX_REGEX.source
)
export const INIT_OPERATOR_ADD_REGEX = /^initvaloper1[a-z0-9]{38}$/
export const BASE_64_REGEX =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
export const CHAIN_ID_REGEX = /^[a-zA-Z0-9-]{1,32}$/
