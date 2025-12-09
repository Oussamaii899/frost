export const STOCK_TYPES = {
  discord_nitro: {
    label: "Discord Nitro",
    fields: [{ key: "nitro_link", label: "Nitro Link", type: "text", required: true }],
  },
  discord_boost: {
    label: "Discord Server Boost",
    fields: [{ key: "boost_code", label: "Boost Code", type: "text", required: true }],
  },
  spotify: {
    label: "Spotify Premium Account",
    fields: [
      { key: "email", label: "Account Email", type: "email", required: true },
      { key: "password", label: "Account Password", type: "password", required: true },
    ],
  },
  minecraft: {
    label: "Minecraft Java Edition",
    fields: [
      { key: "email", label: "Account Email", type: "email", required: true },
      { key: "password", label: "Account Password", type: "password", required: true },
    ],
  },
  snapchat: {
    label: "Snapchat+ Premium",
    fields: [
      { key: "email", label: "Account Email", type: "email", required: true },
      { key: "password", label: "Account Password", type: "password", required: true },
    ],
  },
  bot_hosting: {
    label: "Bot Hosting Service",
    fields: [
      { key: "hosting_url", label: "Hosting URL", type: "url", required: true },
      { key: "api_key", label: "API Key", type: "text", required: true },
    ],
  },
  license_key: {
    label: "License Key",
    fields: [{ key: "license_key", label: "License Key", type: "text", required: true }],
  },
  contact_support: {
    label: "Contact Support Required",
    fields: [
      {
        key: "note",
        label: "This product type requires seller contact for stock management",
        type: "text",
        required: false,
        disabled: true,
      },
    ],
  },
} as const

export type StockType = keyof typeof STOCK_TYPES

export const getStockTypeForProduct = (productName: string): StockType => {
  const name = productName.toLowerCase()

  if (name.includes("discord nitro")) return "discord_nitro"
  if (name.includes("server boost")) return "discord_boost"
  if (name.includes("spotify")) return "spotify"
  if (name.includes("minecraft")) return "minecraft"
  if (name.includes("snapchat")) return "snapchat"
  if (name.includes("hosting") || name.includes("bot")) return "bot_hosting"
  if (name.includes("license")) return "license_key"

  return "contact_support"
}
