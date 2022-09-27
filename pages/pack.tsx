import type { GetServerSideProps, NextPage } from "next";
import tg, { StickerSet, TGResponse, File } from "$tg";
import { Button, Grid, Text } from "@mantine/core";
import Link from "next/link";
import Sticker from "lib/components/Sticker";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const pack = query.pack as string;
  try {
    const url = new URL(pack);
    if (url.hostname !== "t.me") throw new Error("Invalid URL");
    if (!url.pathname.startsWith("/addstickers/"))
      throw new Error("Invalid URL");
    const res = await tg.get("getStickerSet", {
      searchParams: { name: url.pathname.split("/")[2] },
    });
    const data = await res.json<TGResponse<StickerSet>>();
    if (data.error_code) {
      if (data.error_code === 404) return { notFound: true };
      throw new Error(data.description || "An unknown error occurred");
    }
    const stickerFiles = await Promise.all(
      data.result.stickers.map(async (sticker) => {
        const fileRes = await tg.get("getFile", {
          searchParams: { file_id: sticker.file_id },
        });
        const fileData = await fileRes.json<TGResponse<File>>();
        if (!fileData.ok) {
          if (fileData.error_code === 404) return { notFound: true };
          throw new Error(fileData.description || "An unknown error occurred");
        }
        return fileData.result;
      })
    );

    return { props: { pack: data.result, stickerFiles } };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

const Pack: NextPage<{ pack: StickerSet; stickerFiles: File[] }> = ({
  pack,
  stickerFiles,
}) => {
  return (
    <>
      <Text
        weight={500}
        size={72}
        ml="1rem"
        mt="1rem"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {pack.title || pack.name} Sticker Pack
        <Link href="/" passHref>
          <Button mr="1rem" component="a">
            Go back
          </Button>
        </Link>
      </Text>
      <Grid grow gutter="md" mt="1rem">
        {pack.stickers.map((sticker, i) => (
          <Grid.Col md={3} lg={2} sm={4} key={sticker.file_id}>
            <Sticker sticker={{ ...sticker, file: stickerFiles[i] }} />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};

export default Pack;
