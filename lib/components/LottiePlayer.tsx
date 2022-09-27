// https://github.com/arnu515/lottie-player-zip

import React, { useEffect, useRef, useState } from "react";
import "@lottiefiles/lottie-player";
import { BlobReader, ZipReader } from "@zip.js/zip.js";
import pako from "pako";
import { Loader } from "@mantine/core";

interface Props {
  url?: string;
  data?: string;
  lottieProps?: any;
  showLoadingSpinner?: boolean;
}

const LoadingSpinner: React.FC = () => {
  return (
    <Loader
      size={64}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      p="1rem"
    />
  );
};

const LottiePlayer: React.FC<Props> = ({
  url,
  data: b64Data,
  lottieProps = {},
  showLoadingSpinner = true,
}) => {
  const [data, setData] = useState<string | null>(null);
  const [alreadyRendered, setAlreadyRendered] = useState(false);
  const playerRef = useRef<any>(null);

  async function unzip(file: Blob) {
    const br = new BlobReader(file);
    const zr = new ZipReader(br);
    const stream = new TransformStream();
    const dataJson = (await zr.getEntries()).find((i) =>
      i.filename.endsWith(".json")
    );
    if (!dataJson?.getData) {
      throw new Error();
    }

    dataJson.getData(stream);
    await zr.close();

    const fileData = await new Response(stream.readable).text();
    // parse to json to make sure file is valid
    JSON.parse(fileData);

    setData(fileData);
  }

  async function ungzip(file: Blob) {
    const fileData = pako.ungzip(new Uint8Array(await file.arrayBuffer()), {
      to: "string",
    });
    // parse to json to make sure file is valid
    JSON.parse(fileData);
    setData(fileData);
  }

  useEffect(() => {
    const run = async () => {
      if (url) {
        if (url.endsWith("zip")) {
          try {
            const res = await fetch(url);
            const file = await res.blob();

            await unzip(file);
          } catch {
            throw new Error("Invalid zip file");
          }
        } else if (
          url.endsWith("tgs") ||
          url.endsWith("gz") ||
          url.endsWith("tgz")
        ) {
          try {
            const res = await fetch(url);
            const file = await res.clone().blob();

            await ungzip(file);
          } catch {
            throw new Error("Invalid gzip file");
          }
        } else setData(url);
      } else if (b64Data) {
        const res = await fetch(b64Data);
        const file = await res.blob();
        if (file.type === "application/zip") await unzip(file);
        else if (file.type === "application/x-gzip") await ungzip(file);
        else setData(await file.text());
      }
    };
    run();
  }, [url, b64Data]);

  useEffect(() => {
    if (!playerRef.current) return;
    if (data) {
      if (!alreadyRendered)
        playerRef.current.addEventListener("rendered", () => {
          setAlreadyRendered(true);
          playerRef.current.load(data);
        });
      else playerRef.current.load(data);
    }
  }, [data, playerRef, alreadyRendered]);

  if (!data) {
    if (!showLoadingSpinner) return null;
    else return <LoadingSpinner />;
  }

  const props = {
    background: "transparent",
    speed: "1",
    style: { width: "300px", height: "300px" },
    loop: true,
    autoplay: true,
    ...lottieProps,
  };

  return <lottie-player ref={playerRef} {...props}></lottie-player>;
};

export default LottiePlayer;
