export type ThemeTokens = {
  primary: string;
  primaryMuted: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  fontHeading: string;
  fontBody: string;
  radius: string;
  slideBackground: string;
};

export const THEME_IDS = ["ocean", "midnight", "sand", "forest"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const themes: Record<ThemeId, { name: string; tokens: ThemeTokens }> = {
  ocean: {
    name: "Ocean",
    tokens: {
      primary: "#0f766e",
      primaryMuted: "#ccfbf1",
      surface: "#f8fafc",
      surfaceElevated: "#ffffff",
      text: "#0f172a",
      muted: "#64748b",
      accent: "#0d9488",
      border: "#e2e8f0",
      fontHeading: "var(--font-slide-heading)",
      fontBody: "var(--font-slide-body)",
      radius: "12px",
      slideBackground: "linear-gradient(160deg, #f0fdfa 0%, #f8fafc 45%, #ecfeff 100%)",
    },
  },
  midnight: {
    name: "Midnight",
    tokens: {
      primary: "#38bdf8",
      primaryMuted: "#0c4a6e",
      surface: "#0f172a",
      surfaceElevated: "#1e293b",
      text: "#f1f5f9",
      muted: "#94a3b8",
      accent: "#7dd3fc",
      border: "#334155",
      fontHeading: "var(--font-slide-heading)",
      fontBody: "var(--font-slide-body)",
      radius: "8px",
      slideBackground: "linear-gradient(165deg, #0f172a 0%, #1e293b 50%, #172554 100%)",
    },
  },
  sand: {
    name: "Sand",
    tokens: {
      primary: "#b45309",
      primaryMuted: "#fef3c7",
      surface: "#fffbeb",
      surfaceElevated: "#ffffff",
      text: "#422006",
      muted: "#78716c",
      accent: "#d97706",
      border: "#e7e5e4",
      fontHeading: "var(--font-slide-heading)",
      fontBody: "var(--font-slide-body)",
      radius: "16px",
      slideBackground: "linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)",
    },
  },
  forest: {
    name: "Forest",
    tokens: {
      primary: "#166534",
      primaryMuted: "#dcfce7",
      surface: "#f7fee7",
      surfaceElevated: "#ffffff",
      text: "#14532d",
      muted: "#57534e",
      accent: "#15803d",
      border: "#d9f99d",
      fontHeading: "var(--font-slide-heading)",
      fontBody: "var(--font-slide-body)",
      radius: "12px",
      slideBackground: "linear-gradient(145deg, #ecfccb 0%, #f7fee7 60%, #ffffff 100%)",
    },
  },
};

export function getTheme(themeId: string): (typeof themes)[ThemeId] {
  if (themeId in themes) {
    return themes[themeId as ThemeId];
  }
  return themes.ocean;
}

export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  return {
    "--slide-primary": tokens.primary,
    "--slide-primary-muted": tokens.primaryMuted,
    "--slide-surface": tokens.surface,
    "--slide-surface-elevated": tokens.surfaceElevated,
    "--slide-text": tokens.text,
    "--slide-muted": tokens.muted,
    "--slide-accent": tokens.accent,
    "--slide-border": tokens.border,
    "--slide-font-heading": tokens.fontHeading,
    "--slide-font-body": tokens.fontBody,
    "--slide-radius": tokens.radius,
    "--slide-bg": tokens.slideBackground,
  };
}
