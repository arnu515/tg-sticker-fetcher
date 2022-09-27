import "@fontsource/poppins/400.css";
import type { AppProps } from "next/app";
import {
  ColorSchemeProvider,
  MantineProvider,
  ColorScheme,
} from "@mantine/core";
import { useLocalStorage, useHotkeys, useColorScheme } from "@mantine/hooks";

function MyApp({ Component, pageProps }: AppProps) {
  const preferredColorScheme = useColorScheme();
  const [theme, setTheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleTheme = (value?: ColorScheme) => {
    setTheme(value || theme === "light" ? "dark" : "light");
  };
  useHotkeys([["mod+J", () => toggleTheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={theme}
      toggleColorScheme={(i) => i && setTheme(i)}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ fontFamily: "Poppins, sans-serif", colorScheme: theme }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default MyApp;
