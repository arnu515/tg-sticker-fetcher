import ky from "ky-universal";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

const handler = async (req: NextRequest) => {
  const file_path = new URL(req.url).searchParams.get("file_path") as string;
  if (typeof file_path !== "string") {
    return new Response(
      JSON.stringify({
        error: "Not found",
        error_description: "Sticker pack not found",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  console.log(
    file_path,
    `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`
  );

  const resp = await ky.get(
    `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`
  );
  if (resp.status !== 200) {
    return new Response(
      JSON.stringify({
        error: resp.status === 404 ? "Not found" : "Unknown error",
        error_description: (await resp.clone().json()).description,
      }),
      { status: resp.status, headers: { "Content-Type": "application/json" } }
    );
  }

  const file = await resp.clone().arrayBuffer();

  return new Response(file, {
    headers: {
      "Content-Type": resp.headers.get("Content-Type") as string,
      "Content-Length": resp.headers.get("Content-Length") as string,
    },
    status: 200,
  });
};

export default handler;
