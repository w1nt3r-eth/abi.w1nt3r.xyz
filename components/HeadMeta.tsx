import Head from 'next/head';

type Props = {
  title: string;
  description: string;
};

const BASE_URL = 'https://evm-abi-finder.vercel.app';

export default function HeadMeta(props: Props) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <link rel="icon" href="/favicon.png" />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:image" content={`${BASE_URL}/og_image.png`} />
      <meta property="og:url" content={`${BASE_URL}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@itasli" />
      <meta name="twitter:creator" content="@itasli" />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:image" content={`${BASE_URL}/og_image.png`} />
    </Head>
  );
}
