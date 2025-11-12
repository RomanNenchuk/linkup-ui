import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    toast: Palette["primary"];
  }
  interface PaletteOptions {
    toast?: PaletteOptions["primary"];
  }

  interface Theme {
    custom: {};
  }

  interface ThemeOptions {
    custom?: {};
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff8c00",
      light: "#ffb74d",
      dark: "#c25e00",
      contrastText: "#ffffff",
    },
    toast: {
      main: "#424242",
      dark: "#212121",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f0f7f4",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a3c34",
      secondary: "#4a635d",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#0288d1",
    },
    success: {
      main: "#2e7d32",
    },
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
      color: "#1a3c34",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
      color: "#1a3c34",
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      color: "#4a635d",
    },
    button: {
      fontSize: "1rem",
      fontWeight: 500,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
        containedPrimary: {
          backgroundColor: "#2e7d32",
          "&:hover": {
            backgroundColor: "#4caf50",
          },
        },
        outlinedPrimary: {
          borderColor: "#2e7d32",
          color: "#2e7d32",
          "&:hover": {
            backgroundColor: "rgba(46, 125, 50, 0.04)",
            borderColor: "#4caf50",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1a3c34",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "& fieldset": {
              borderColor: "#c8e6c9",
            },
            "&:hover fieldset": {
              borderColor: "#4caf50",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2e7d32",
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginTop: "1.5rem",
          "& .MuiTabs-indicator": {
            display: "none",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          border: "1px solid #e0e0e0",
          borderRadius: "20px",
          marginLeft: "4px",
          marginRight: "4px",
          minHeight: "auto",
          padding: "4px 12px",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.9rem",
          color: "#4a635d",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#2e7d32",
            color: "#2e7d32",
          },
          "&.Mui-selected": {
            backgroundColor: "#2e7d32",
            color: "#fff !important",
            borderColor: "#2e7d32",
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export default theme;
