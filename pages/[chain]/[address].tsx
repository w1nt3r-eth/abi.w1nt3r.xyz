import { selectorsFromBytecode } from '@shazow/whatsabi';
import { ethers } from 'ethers';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Footer from '../../components/Footer';
import HeadMeta from '../../components/HeadMeta';
import qs from 'querystring';

type Signature = {
  id: number;
  created_at: string;
  text_signature: string;
  hex_signature: string;
  bytes_signature: string;
};

type Props = {
  address: string;
  explorer: string;
  selectors: string[];
  signatures: Signature[][];
  copyAs: {
    json: string;
    solidity: string;
  } | null;
};

export default function ABI(props: Props) {
  return (
    <div className="main">
      <Link href="/" className="back">
        ← Back
      </Link>
      <HeadMeta title={`Signatures for ${props.address}`} description={`ABI signatures for ${props.address}`} />
      <h1>
        Signatures for{' '}
        <Link href={`${props.explorer}${props.address}`} target="_blank" rel="noreferrer">
          {props.address}
        </Link>
      </h1>
      {props.signatures.map((signatures, i) => (
        <SelectorWithSignatures key={i} selector={props.selectors[i]} signatures={signatures} />
      ))}
      {props.copyAs && (
        <div className="buttons">
          <button onClick={() => navigator.clipboard.writeText(props.copyAs!.json)}>Copy as JSON</button>
          <button onClick={() => navigator.clipboard.writeText(props.copyAs!.solidity)}>Copy as Solidity</button>
        </div>
      )}
      <Footer />
      <style jsx>{`
        .main {
          padding: 2rem;
        }
        .back {
          text-decoration: none;
        }
        .buttons {
          padding-top: 1rem;
          display: flex;
          gap: 1rem;
        }
        button {
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
}

function SelectorWithSignatures(props: { selector: string; signatures: Signature[] }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = props.signatures.length > 1;

  // Signatures are sorted by time, the last one likely the most accurate
  const signatures = expanded ? props.signatures.slice().reverse() : props.signatures.slice(-1);

  return (
    <div className="container">
      <code className="selector">{props.selector}</code>
      <button className={canExpand ? '' : 'hidden'} onClick={() => setExpanded(!expanded)}>
        +{props.signatures.length - 1}
      </button>
      <ul>
        {signatures.map((signature) => (
          <li key={signature.id}>
            <code>{signature.text_signature}</code>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .container {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          font-size: 1rem;
          padding: 0.1rem 0;
        }
        .selector {
          opacity: 0.5;
        }
        .hidden {
          visibility: hidden;
        }
        ul,
        li {
          margin: 0;
          padding: 0;
        }
        li {
          list-style: none;
        }
        button {
          background: none;
          border: none;
          color: #0070f3;
        }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, res }) => {
  const address = params?.address as string;

  const networks: { [name: string]: string } = { 
    "https://etherscan.io/address/": "https://eth.public-rpc.com/", 
    "https://snowtrace.io/address/": "https://avalanche.public-rpc.com/", 
    "https://bscscan.com/address/": "https://bscrpc.com", 
    "https://polygonscan.com/address/": "https://polygon-rpc.com"
  
  };

  let code = "";
  let explorer = "";

  // for each network, connect to the provider and get the bytecode
  for (const [exp, net] of Object.entries(networks)) {
    const provider = new ethers.providers.JsonRpcProvider(net);
    code = await provider.getCode(address);
    explorer = exp;

    // if the bytecode is not empty, we found the contract
    if (code !== '0x') {
      break
    }
  }

  const selectors = selectorsFromBytecode(code);

  // const signatures = await Promise.all(selectors.map(fetchSignatures4BD));
  const signatures = await fetchSignaturesSamczsun(selectors);

  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=3600000');

  return {
    props: {
      address,
      explorer,
      selectors,
      signatures,
      copyAs: exportToCopyAs(address, signatures),
    },
  };
};

function exportToCopyAs(address: string, signatures: Signature[][]) {
  try {
    const functions = signatures
      .map((s) => s[s.length - 1]?.text_signature)
      .filter(Boolean)
      .map((text_signature) => `  function ${text_signature.replaceAll('[]', '[] calldata')}`);

    const iface = new ethers.utils.Interface(functions);

    return {
      json: iface.format(ethers.utils.FormatTypes.json) as string,
      solidity: [`interface ABI_${address} {`, ...functions.map((f) => f + ' external;'), '}'].join('\n'),
    };
  } catch (error) {
    console.warn(error);
    return null;
  }
}

async function fetchSignatures4BD(hex: string): Promise<Signature[]> {
  const response = await fetch(`https://www.4byte.directory/api/v1/signatures/?hex_signature=${hex}`);
  const data = await response.json();
  return data.results;
}

async function fetchSignaturesSamczsun(hexes: string[]): Promise<Signature[][]> {
  const response = await fetch(`https://sig.eth.samczsun.com/api/v1/signatures?${qs.stringify({ function: hexes })}`);
  const data = await response.json();
  if (!data.ok) {
    throw new Error(`Failed to fetch signatures: ${JSON.stringify(data)}`);
  }

  return hexes.map((hex, id) =>
    (data.result.function[hex] || []).map((record: any) => ({
      id,
      created_at: '',
      text_signature: record.name,
      hex_signature: hex,
      bytes_signature: '',
    }))
  );
}
