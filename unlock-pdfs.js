#!/usr/bin/env node
/**
 * unlock-pdfs.js (library + CLI)
 * -----------------------------------------------
 * Batch-unlock password-protected PDF files with **qpdf**,
 * reading parameters from CLI args, environment variables, or defaults.
 *
 * ▸ CLI usage:
 *      unlock-pdfs [dir] [password] [outDir]
 *
 * ▸ Env vars:
 *      UNLOCK_DIR       (e.g. C:/Users/user/Documents/PromAi/payslips)
 *      UNLOCK_PASSWORD  (e.g. 5851)
 *      UNLOCK_OUTDIR    (e.g. ./unlocked)
 *
 * Priority: CLI args > Env vars > Hardcoded defaults
 *
 * ▸ Import as module:
 *      import { unlock } from './unlock-pdfs.js';
 *
 * Prerequisites
 * -------------
 *  1. Install qpdf  → https://qpdf.sourceforge.io/
 *  2. chmod +x unlock-pdfs.js   (Linux/macOS)
 */

import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import url from 'url';
import dotenv from 'dotenv';
dotenv.config();

const execAsync = promisify(exec);

/**
 * Unlock all PDF files in a directory using qpdf.
 * @param {string} dir      Source directory to scan.
 * @param {string} password Owner/user password.
 * @param {string} [outDir] Destination directory (default = dir).
 * @returns {Promise<{processed:string[], failed:string[]}>}
 */
export async function unlock(dir, password, outDir) {
    const absSrc = path.resolve(dir);
    const absDst = path.resolve(outDir ?? dir);

    if (absSrc !== absDst) {
        await fs.mkdir(absDst, { recursive: true });
    }

    const dirents = await fs.readdir(absSrc, { withFileTypes: true });
    const pdfs = dirents.filter(d => d.isFile() && d.name.toLowerCase().endsWith('.pdf'));

    if (pdfs.length === 0) {
        console.warn('No PDF files found in', absSrc);
        return { processed: [], failed: [] };
    }

    const processed = [];
    const failed = [];

    for (const d of pdfs) {
        const src = path.join(absSrc, d.name);
        const dest = path.join(absDst, d.name.replace(/\.pdf$/i, '.pdf'));
        try {
            await execAsync(`qpdf --password=${password} --decrypt "${src}" "${dest}"`);
            console.log(`✓ Unlocked: ${d.name}`);
            processed.push(d.name);
        } catch (e) {
            console.error(`✗ Failed to unlock ${d.name}:`, e.stderr || e.message);
            failed.push(d.name);
        }
    }
    return { processed, failed };
}

// ------------------------- CLI --------------------------
function parseCli(args) {
    const [, , dirArg, pwdArg, outArg] = args;
    return { dirArg, pwdArg, outArg };
}

async function main() {
    const { dirArg, pwdArg, outArg } = parseCli(process.argv);

    // Determine parameters: CLI > Env > Defaults
    const dir = dirArg || process.env.UNLOCK_DIR || '';
    const pwd = pwdArg || process.env.UNLOCK_PASSWORD || '';
    const outDir = outArg || process.env.UNLOCK_OUTDIR || './unlocked';

    if (!pwd) {
        console.error('Error: password must be provided via CLI or UNLOCK_PASSWORD env var');
        console.error('Usage: unlock-pdfs [directory] [password] [outputDir]');
        process.exit(1);
    }

    try {
        await unlock(dir, pwd, outDir);
    } catch (err) {
        console.error('Fatal:', err.message);
        process.exit(1);
    }
}

// Run if executed directly (not imported)
const isRunDirect = url.fileURLToPath(import.meta.url) === process.argv[1];
if (isRunDirect) {
    main();
}
