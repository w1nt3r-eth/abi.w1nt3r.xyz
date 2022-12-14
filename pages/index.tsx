import type { NextPage } from 'next';
import Footer from '../components/Footer';
import HeadMeta from '../components/HeadMeta';

// TODO: Using Next's <Link> component for navigation is not showing loading state
/* eslint-disable @next/next/no-html-link-for-pages */

const Home: NextPage = () => {
  return (
    <div className="container">
      <HeadMeta title="ABI for unverified contracts" description="Guess ABI of any Ethereum contract" />

      <main className="main">
        <h1 className="title">Get ABI for unverified contracts</h1>

        <p className="description">
          Guess ABI of any Ethereum contract, even if it is not verified on Etherscan. Works by analyzing the bytecode,
          extracting selectors from PUSH4/JUMPI instructions and comparing them to known ABI signatures.
        </p>

        <form action="/search" method="get">
          <input
            name="address"
            type="search"
            placeholder="0x123...abc"
            required
            autoFocus
            autoCapitalize="none"
            autoCorrect="false"
            spellCheck="false"
            autoComplete="off"
          />
          <button type="submit">→</button>
        </form>
        <p className="description">Or try some examples:</p>
        <p className="description">
          <a href="/mainnet/0x7a250d5630b4cf539739df2c5dacb4c659f2488d">0x7a250d5630b4cf539739df2c5dacb4c659f2488d</a>
          <br />
          <a href="/mainnet/0x2d8a1e139cb15319b1f325eb917c9c704f45db7c">0x2d8a1e139cb15319b1f325eb917c9c704f45db7c</a>
          <br />
          <a href="/mainnet/0xaE9C73fd0Fd237c1c6f66FE009d24ce969e98704">0xaE9C73fd0Fd237c1c6f66FE009d24ce969e98704</a>
        </p>

        <Footer />
      </main>
      <style jsx>{`
        .main {
          padding: 2rem;
          max-width: 60ch;
        }
        form {
          display: flex;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          font-size: 1.5rem;
        }
        button {
          width: 50px;
        }
      `}</style>
    </div>
  );
};

export default Home;
