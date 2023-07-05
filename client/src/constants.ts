// export const SERVER_API = `http://34.140.94.14:5000`

export const DISCORD_SERVER_LINK = "https://discord.gg/anevqcFqjS"

export const SERVER_ASSET = (fileName: string) => `/api/images/${fileName}`

export const GRID_SET_RANGE = 100

export const BG_FOREST_BIOM = {
  day: "#133A2B",
  // night: "#1E1C2F88",
  night: "#042b3088",
  // night: "#000",
}

export const zIndexOf = (
  type:
    | "player"
    | "bio"
    | "settable -1"
    | "settable -2"
    | "settable"
    | "settable +1"
    | "mob"
    | "messages"
): number => {
  return {
    messages: 8,
    bio: 7,
    mob: 6,
    "settable +1": 5,
    settable: 4,
    player: 3,
    "settable -1": 2,
    "settable -2": 1,
  }[type]
}
