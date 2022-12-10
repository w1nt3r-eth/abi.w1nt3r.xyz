Guess ABI of any EVM contract, even if it is not verified. Works by analyzing the bytecode,
extracting selectors from PUSH4/JUMPI instructions and comparing them to known ABI signatures.

Powered by <a href="https://github.com/shazow/whatsabi">@shazow/whatsabi</a> and <a href="https://www.4byte.directory/">4byte.directory</a>

## Getting Started

To begin, install the npm modules:

```
npm i
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
