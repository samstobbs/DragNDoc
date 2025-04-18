import { colors } from "./colors"

export const lightTheme = {
  background: colors.neutral[50],
  foreground: colors.neutral[900],
  card: {
    background: "white",
    foreground: colors.neutral[900],
    border: colors.neutral[200],
  },
  primary: {
    background: colors.primary[500],
    foreground: "white",
    hover: colors.primary[600],
  },
  secondary: {
    background: colors.secondary[500],
    foreground: "white",
    hover: colors.secondary[600],
  },
  accent: {
    background: colors.accent[500],
    foreground: "white",
    hover: colors.accent[600],
  },
  muted: {
    background: colors.neutral[100],
    foreground: colors.neutral[700],
  },
  input: {
    background: "white",
    foreground: colors.neutral[900],
    border: colors.neutral[300],
    focus: colors.primary[500],
  },
  dragIndicator: {
    idle: colors.neutral[300],
    active: colors.primary[500],
    hover: colors.primary[400],
    border: colors.primary[300],
  },
}

export const darkTheme = {
  background: colors.neutral[950],
  foreground: colors.neutral[100],
  card: {
    background: colors.neutral[900],
    foreground: colors.neutral[100],
    border: colors.neutral[800],
  },
  primary: {
    background: colors.primary[600],
    foreground: "white",
    hover: colors.primary[700],
  },
  secondary: {
    background: colors.secondary[600],
    foreground: "white",
    hover: colors.secondary[700],
  },
  accent: {
    background: colors.accent[600],
    foreground: "white",
    hover: colors.accent[700],
  },
  muted: {
    background: colors.neutral[800],
    foreground: colors.neutral[300],
  },
  input: {
    background: colors.neutral[900],
    foreground: colors.neutral[100],
    border: colors.neutral[700],
    focus: colors.primary[500],
  },
  dragIndicator: {
    idle: colors.neutral[700],
    active: colors.primary[500],
    hover: colors.primary[600],
    border: colors.primary[700],
  },
}
