import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress color="#e9e9ed" height={7}/>
      <Component {...pageProps} />
    </>
  );
}