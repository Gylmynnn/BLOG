import { browser } from "$app/environment";

abstract class ThemeFeature {
   // feat : toggle light and dark mode
   abstract toggle: () => void
}

class Theme implements ThemeFeature {
   currentTheme = $state(browser && localStorage.getItem("color-scheme"));

   toggle = (): void => {
      const theme = this.currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("color-scheme", theme);
      localStorage.setItem("color-scheme", theme);
      this.currentTheme = theme;
   };
}

export const theme = new Theme();
