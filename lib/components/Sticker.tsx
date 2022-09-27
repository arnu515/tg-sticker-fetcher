import type { StickerWithFile } from "$tg";
import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export default function Sticker({ sticker }: { sticker: StickerWithFile }) {
  const [lottiePlayer, setLottiePlayer] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const LottiePlayer = (await import("./LottiePlayer")).default;
      setLottiePlayer(
        <LottiePlayer
          url={`/api/tgfile?${new URLSearchParams({
            file_path: sticker.file.file_path!,
          }).toString()}`}
        />
      );
    })();
  }, [sticker]);

  console.log(sticker.file);
  if (!lottiePlayer) return <h1>loading</h1>;

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        borderColor: theme.fn.primaryShade() as any,
        borderRadius: "0.5rem",
        borderWidth: "1px",
        borderStyle: "solid",
      })}
    >
      {lottiePlayer}{" "}
      <Text
        style={{
          position: "absolute",
          right: 10,
          top: 10,
          fontSize: "24px",
        }}
      >
        {sticker.emoji}
      </Text>
      <Text
        style={{
          position: "absolute",
          right: 10,
          backgroundColor: "black",
          color: "white",
          bottom: 10,
          fontSize: "16px",
        }}
      >
        {sticker.file.file_path}
      </Text>
    </Box>
  );
}
