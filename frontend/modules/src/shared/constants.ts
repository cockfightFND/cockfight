/* URL */
export const EXTENSION_DOWNLOAD_URL = "https://chrome.google.com/webstore/detail/ffbceckpkpbcmgiaehlloocglmijnpmp"
export const ASSETS_URL = import.meta.env.INITIA_ASSETS_URL || "https://assets.stone-13.initia.xyz"
export const LIST_URL = import.meta.env.INITIA_LIST_URL || "https://list.stone-13.initia.xyz"
export const APP_URL = import.meta.env.INITIA_APP_URL || "https://app.stone-13.initia.xyz"
export const OMNITIA_API_URL = "https://omni-api.stone-13.initia.xyz"
export const VIP_API_URL = import.meta.env.INITIA_VIP_API_URL || "https://vip.stone-13.initia.xyz"
export const TOKENS_URL = new URL("/tokens.json", LIST_URL).href
export const PAIRS_URL = new URL("/pairs.json", LIST_URL).href
export const IBC_CHANNELS_URL = new URL("/ibc/channels.json", LIST_URL).href
export const FEE_TOKENS_URL = new URL("/fee/tokens.json", LIST_URL).href

/* Module */
export const DEX_UTILS_MODULE = import.meta.env.INITIA_DEX_UTILS_MODULE || "0x589b1e861579c3f07092859db5f8963e1dac50f1"
export const USERNAMES_MODULE = import.meta.env.INITIA_USERNAMES_MODULE || "0x62b7900f8b12f95bdd46c755b2e938493436ca0d"

/* Address */
export const PLACEHOLDER_ADDRESS = "init1wlvk4e083pd3nddlfe5quy56e68atra3gu9xfs"

/* Time */
export const DAY_IN_SECONDS = 24 * 60 * 60 // 86400
