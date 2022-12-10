export default function Footer() {
  return (
    <footer>
      <a href="https://github.com/w1nt3r-eth/abi.w1nt3r.xyz">Original</a> project forked by <a href="https://github.com/itasli">@itasli</a>, 
      see <a href="https://github.com/itasli/evm-abi-finder">GitHub</a>.<br />
      Powered by <a href="https://github.com/shazow/whatsabi">@shazow/whatsabi</a> and{' '}
      <a href="https://sig.eth.samczsun.com/">Ethereum Signature Database</a>.
      <style jsx>{`
        footer {
          margin-top: 2rem;
        }
      `}</style>
    </footer>
  );
}
