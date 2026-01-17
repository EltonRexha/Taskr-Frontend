import { useTheme } from "next-themes";

export function useCurrentTheme() {
  const { systemTheme, theme, setTheme } = useTheme();
  const isDark = theme === "system" ? systemTheme === "dark" : theme === "dark";
  return { theme: isDark ? "dark" : "light", setTheme };
}
