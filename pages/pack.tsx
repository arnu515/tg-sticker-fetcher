import type { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const pack = query.pack as string;
  try {
    const url = new URL(pack);
    if (url.hostname !== "t.me") throw new Error("Invalid URL");
    if (!url.pathname.startsWith("/addstickers/"))
      throw new Error("Invalid URL");
    return { props: { pack: url.pathname.split("/")[2] } };
  } catch {
    return {
      notFound: true,
    };
  }
};

const Pack: NextPage<{ pack: string }> = ({ pack }) => {
  return <div>{pack}</div>;
};

export default Pack;
