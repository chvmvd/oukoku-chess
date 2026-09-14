const fontFamilies = {
  medium: "ZenMaruGothic_500Medium",
  bold: "ZenMaruGothic_700Bold",
} as const;

export const theme = {
  colors: {
    background: "#FFFCF5",
    surface: "#FFFFFF",
    text: "#000000",
    border: "#888888",
    primary: "#2DB46D",
    onPrimary: "#FFFFFF",
    players: {
      red: {
        primary: "#EC4747",
        background: "#FDE6E6",
      },
      blue: {
        primary: "#289BEE",
        background: "#DEF0FE",
      },
    },
    board: {
      lightSquare: "#FDF3DB",
      darkSquare: "#DACBED",
      selectedSquare: "#FFDA7B",
      legalDestination: "#FFDA7B",
    },
  },
  typography: {
    display: { fontFamily: fontFamilies.bold, fontSize: 36 },
    headline: { fontFamily: fontFamilies.medium, fontSize: 32 },
    title: { fontFamily: fontFamilies.bold, fontSize: 20 },
    body: { fontFamily: fontFamilies.medium, fontSize: 20 },
    bodyLarge: { fontFamily: fontFamilies.medium, fontSize: 24 },
  },
} as const;
