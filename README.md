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

# (Optional) Install CLI globally
npm link
```

## Configuration

Parameters can be provided in three ways, in order of priority:

1. **CLI arguments**
2. **Environment variables**
3. **Hardcoded defaults**

| Parameter     | CLI arg position | Env var          | Default                                   |
| ------------- | ---------------- | ---------------- | ----------------------------------------- |
| Directory     | 1                | UNLOCK\_DIR      | `C:/Users/user/Documents/Pdf-files` |
| Password      | 2                | UNLOCK\_PASSWORD | `password`                                    |
| Output folder | 3                | UNLOCK\_OUTDIR   | `./unlocked`                              |

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
# Using defaults from .env or hardcoded
unlock-pdfs

# Override with CLI args
unlock-pdfs ./my-pdfs mySecretPwd ./output-folder
```

Or, without linking globally:

```bash
node src/unlock-pdfs.js [dir] [password] [outDir]
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
UNLOCK_DIR=./pdfs UNLOCK_PASSWORD=1234 node src/unlock-pdfs.js

# CLI-based
node src/unlock-pdfs.js ./invoices 98765 ./unlocked_invoices
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

