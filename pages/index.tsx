import type { NextPage } from "next";
import { Box, Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const form = useForm({
    initialValues: { pack: "" },
    validate(values) {
      if (!values.pack) return { pack: "This field is required" };
      try {
        const url = new URL(values.pack, window.origin);
        if (url.hostname !== "t.me") throw new Error("Invalid URL");
        if (!url.pathname.startsWith("/addstickers/"))
          throw new Error("Invalid URL");
        return {};
      } catch {
        return { pack: "Invalid URL. Example: https://t.me/addstickers/asdf" };
      }
    },
  });
  const router = useRouter();

  return (
    <>
      <Text align="center" size="xl" weight={700} mt="1rem">
        Enter sticker pack link
      </Text>
      <Box
        sx={(theme) => ({
          maxWidth: theme.breakpoints.sm,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
        mt="2rem"
        mx="auto"
      >
        <form
          onSubmit={form.onSubmit(({ pack }) =>
            router.push("/pack?" + new URLSearchParams({ pack }).toString())
          )}
          style={{ width: "100%" }}
        >
          <TextInput
            withAsterisk
            label="Pack Link"
            placeholder="https://t.me/addstickers/packname"
            {...form.getInputProps("pack")}
          />
          <Button type="submit" fullWidth mt="0.5rem">
            Go
          </Button>
        </form>
      </Box>
    </>
  );
};

export default Home;
