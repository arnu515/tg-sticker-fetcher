import "@fontsource/poppins/400.css";
import type { AppProps } from "next/app";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(prefersDark.matches ? "dark" : "light");
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={theme}
      toggleColorScheme={(i) => i && setTheme(i)}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ fontFamily: "Poppins, sans-serif", colorScheme: "dark" }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default MyApp;
