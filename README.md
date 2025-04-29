# unlock-pdfs

A small Node.js library and CLI tool to batch-unlock password-protected PDF files using [qpdf](https://qpdf.sourceforge.io/).

## Features

- **Batch processing**: Iterates through all PDF files in a directory
- **Flexible configuration**:
  - CLI arguments
  - Environment variables
  - Hardcoded defaults
- **Modular**: Use the `unlock` function in your own scripts

## Prerequisites

- **Node.js** ≥ 14
- **qpdf** installed and available in your `PATH`
  - Download/install: [https://qpdf.sourceforge.io/](https://qpdf.sourceforge.io/)

## Installation

```bash
# Clone this repo
git clone https://github.com/mengeshaster/unlock-pdfs.git
cd unlock-pdfs

# Install dependencies
npm install
```

## package.json Scripts

You can define a CLI script in your `package.json` for convenience:

```json
{
  "scripts": {
    "cli": "node src/unlock-pdfs.js C:/Users/user/Documents/Pdf-files some-password ./unlocked"
  }
}
```

With this, you can run the CLI via npm:

```bash
npm run cli
```  
This invokes the tool with the default parameters shown above.

## Configuration

Parameters can be provided in three ways, in order of priority:

1. **CLI arguments**
2. **Environment variables**
3. **Hardcoded defaults**

| Parameter     | CLI arg position | Env var          | Default                                   |
| ------------- | ---------------- | ---------------- | ----------------------------------------- |
| Directory     | 1                | UNLOCK_DIR       | `C:/Users/user/Documents/Pdf-files`       |
| Password      | 2                | UNLOCK_PASSWORD  | `password`                                |
| Output folder | 3                | UNLOCK_OUTDIR    | `./unlocked`                              |

To use a `.env` file, install and configure [`dotenv`](https://github.com/motdotla/dotenv):

```bash
npm install dotenv
```

Create a `.env` in project root:

```ini
UNLOCK_DIR=C:/Users/user/Documents/Pdf-files
UNLOCK_PASSWORD=password
UNLOCK_OUTDIR=./unlocked
```

## Usage

### CLI Mode

```bash
# With npm script (uses defaults)
npm run cli

# Using direct CLI invocation
unlock-pdfs ./my-pdfs mySecretPwd ./output-folder
# or:
node src/unlock-pdfs.js ./my-pdfs mySecretPwd ./output-folder
```

### As a Module

```js
import { unlock } from './src/unlock-pdfs.js';

(async () => {
  const result = await unlock(
    './my-pdfs',
    'mySecretPwd',
    './output'
  );
  console.log(result);
})();
```

## Examples

```bash
# Environment-based
env UNLOCK_DIR=./pdfs UNLOCK_PASSWORD=1234 node src/unlock-pdfs.js

# CLI-based
node src/unlock-pdfs.js C:/Users/user/Documents/Pdf-files some-password ./unlocked
```

## Error Handling & Logs

- If `qpdf` is not found, the script will report an error. Ensure `qpdf --version` works in your shell.
- Processed and failed file names are logged to the console.

## Development & Contribution

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -am 'Add xyz'`)
4. Push to the branch (`git push origin feature/xyz`)
5. Open a Pull Request

## License

MIT © Benny Mengesha