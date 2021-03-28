import React from "react";
import Head from "next/head";

interface Props {
  title: string;
  description?: string;
  tags?: string;
}

const Meta = (props: Props) => {
  const { title, description, tags } = props;

  // seo 처리를 위한 meta 태그 처리화.

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
    </>
  );
};

export default Meta;
