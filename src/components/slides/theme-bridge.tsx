"use client";

import { getTheme, tokensToCssVars, type ThemeId } from "@/lib/themes/presets";

export function ThemeBridge({
  themeId,
  children,
  className,
}: {
  themeId: ThemeId | string;
  children: React.ReactNode;
  className?: string;
}) {
  const { tokens } = getTheme(themeId);
  const vars = tokensToCssVars(tokens) as React.CSSProperties;

  return (
    <div className={className} style={vars}>
      {children}
    </div>
  );
}
