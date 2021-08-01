import { ThemeOptions } from "@mui/material"

export const PRIMARY_COLOR = "#0088b3"

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: "#906a5d",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#b0c5cc",
    },
    background: {
      default: "#fbf9ed",
    },
  },
  typography: {
    fontSize: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
        },
      },
    },
  },
}

export const FAILED_COLOR = "#cb8f0d"
export const OK_COLOR = "#29ac47"

export default theme
