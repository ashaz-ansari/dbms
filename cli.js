#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = __dirname;
const PRACTICALS_DIR = path.join(ROOT, 'practical');
const INDEX_FILE = path.join(PRACTICALS_DIR, 'README-Index.txt');
const FILE_PATTERN = /^Practical-(\d{2})-(.+)\.txt$/;
const REPO = 'github:ashaz-ansari/dbms';

const pkg = require(path.join(ROOT, 'package.json'));

function fail(message) {
  process.stderr.write('rdbms-practicals: ' + message + '\n');
  process.exit(1);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

/* The first lines of each file hold the title, e.g.
 *   PRACTICAL 7: WRITE QUERIES USING SET, RELATIONAL, ARITHMETIC AND
 *                 LOGICAL OPERATORS
 * Continuation lines are joined until the Subject/College lines or the
 * dashed rule that opens the body. */
function titleOf(filePath) {
  const parts = [];
  for (const raw of read(filePath).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || /^-{4,}$/.test(line) || /^(Subject|College)\s*:/i.test(line)) break;
    parts.push(line);
  }
  return parts
    .join(' ')
    .replace(/^PRACTICAL\s+\d+\s*:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function catalogue() {
  if (!fs.existsSync(PRACTICALS_DIR)) {
    fail('the practical/ folder is missing from this install');
  }

  const items = [];
  for (const file of fs.readdirSync(PRACTICALS_DIR)) {
    const match = FILE_PATTERN.exec(file);
    if (!match) continue;
    const full = path.join(PRACTICALS_DIR, file);
    items.push({ number: Number(match[1]), file, path: full, title: titleOf(full) });
  }

  if (items.length === 0) fail('no practical .txt files were found');
  items.sort((a, b) => a.number - b.number);
  return items;
}

/* Clipboard tools, in the order they are tried. Windows goes through
 * PowerShell with base64 so that non-ASCII text survives; clip.exe can
 * only handle the console code page and is kept as a fallback. */
function clipboardTools() {
  if (process.platform === 'win32') {
    return [
      {
        name: 'powershell Set-Clipboard',
        cmd: 'powershell.exe',
        args: [
          '-NoProfile',
          '-NonInteractive',
          '-Command',
          '$b = [Console]::In.ReadToEnd(); ' +
            'Set-Clipboard -Value ([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($b)))',
        ],
        base64: true,
      },
      { name: 'clip', cmd: 'clip', args: [] },
    ];
  }
  if (process.platform === 'darwin') {
    return [{ name: 'pbcopy', cmd: 'pbcopy', args: [] }];
  }
  return [
    { name: 'wl-copy', cmd: 'wl-copy', args: [] },
    { name: 'xclip', cmd: 'xclip', args: ['-selection', 'clipboard'] },
    { name: 'xsel', cmd: 'xsel', args: ['--clipboard', '--input'] },
  ];
}

/* The files on disk use LF endings, but most Windows applications show
 * a lone LF as no break at all when pasting. */
function normaliseLineEndings(text) {
  const lf = text.replace(/\r\n/g, '\n');
  return process.platform === 'win32' ? lf.replace(/\n/g, '\r\n') : lf;
}

function copyToClipboard(text) {
  const content = normaliseLineEndings(text);
  const bytes = Buffer.byteLength(content, 'utf8');
  const failed = [];

  for (const tool of clipboardTools()) {
    const payload = tool.base64 ? Buffer.from(content, 'utf8').toString('base64') : content;
    const result = spawnSync(tool.cmd, tool.args, {
      input: payload,
      encoding: 'utf8',
      windowsHide: true,
      maxBuffer: 64 * 1024 * 1024,
    });
    if (!result.error && result.status === 0) return { via: tool.name, bytes };
    failed.push(tool.name + (result.error ? ' (' + result.error.code + ')' : ' (exit ' + result.status + ')'));
  }

  /* Last resort: the OSC 52 escape sequence, which many modern
   * terminals understand. Nothing is printed to the screen. */
  if (process.stdout.isTTY) {
    process.stdout.write('\u001b]52;c;' + Buffer.from(content, 'utf8').toString('base64') + '\u0007');
    return { via: 'OSC 52', bytes };
  }

  fail('could not reach a clipboard - tried ' + failed.join(', '));
}

function usage() {
  return [
    'Usage:',
    '  npx --yes ' + REPO + '              list the practicals',
    '  npx --yes ' + REPO + ' 3            print practical 3',
    '  npx --yes ' + REPO + ' 3 5 9        print several practicals',
    '  npx --yes ' + REPO + ' all          print all 24 practicals',
    '  npx --yes ' + REPO + ' --index      print the index file',
    '  npx --yes ' + REPO + ' 3 --copy     copy practical 3 to the',
    '                                   clipboard, printing nothing',
    '  npx --yes ' + REPO + ' 3 --save     save as a .txt file',
    '',
    'Options:',
    '  -c, --copy        copy the output to the clipboard instead of',
    '                    printing it. The word "copy" works too, so',
    '                    "rdbms copy 3" is the same as "rdbms 3 -c"',
    '  -s, --save        write .txt files instead of printing',
    '      --dir <path>  folder used by --save (default: current)',
    '  -a, --all         print every practical',
    '  -i, --index       print practical/README-Index.txt',
    '  -l, --list        list the practicals with titles (no arguments',
    '                    does the same)',
    '      --verbose     with --copy, report what was copied, on stderr',
    '  -h, --help        show this help',
    '  -v, --version     show the version',
    '',
    'A number may be written as 3, 03, p3 or practical-3.',
  ].join('\n');
}

function parseArgs(argv) {
  const opts = {
    numbers: [],
    list: false,
    all: false,
    index: false,
    save: false,
    copy: false,
    verbose: false,
    dir: null,
    help: false,
    version: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--version' || arg === '-v') opts.version = true;
    else if (arg === '--list' || arg === '-l') opts.list = true;
    else if (arg === '--index' || arg === '-i') opts.index = true;
    else if (arg === '--save' || arg === '-s') opts.save = true;
    else if (arg === '--copy' || arg === '-c' || arg.toLowerCase() === 'copy') opts.copy = true;
    else if (arg === '--verbose') opts.verbose = true;
    else if (arg === '--all' || arg === '-a' || arg.toLowerCase() === 'all') opts.all = true;
    else if (arg === '--dir') {
      const next = argv[++i];
      if (!next) return { error: '--dir needs a folder path' };
      opts.dir = next;
    } else if (/^\d{1,2}$/.test(arg)) {
      opts.numbers.push(Number(arg));
    } else {
      const match = /^(?:p|pr|practical)[-_ ]?(\d{1,2})$/i.exec(arg);
      if (match) opts.numbers.push(Number(match[1]));
      else return { error: 'unrecognised argument: ' + arg + ' (try --help)' };
    }
  }

  return opts;
}

function listing(items) {
  const lines = [
    'RDBMS Practicals 1-' + items[items.length - 1].number,
    'CM41201 - Government Polytechnic, Pune',
    'Source: ' + REPO,
    '',
  ];
  for (const item of items) {
    lines.push('  ' + String(item.number).padStart(2) + '  ' + item.title);
  }
  lines.push('', usage());
  return lines.join('\n');
}

function labelFor(opts, chosen) {
  const parts = [];
  if (opts.index) parts.push('the index');
  if (opts.all) parts.push('all ' + chosen.length + ' practicals');
  else if (chosen.length === 1) parts.push('practical ' + chosen[0].number);
  else if (chosen.length > 1) parts.push('practicals ' + chosen.map((c) => c.number).join(', '));
  return parts.join(' and ') || 'the output';
}

/* Copies when --copy was given, otherwise leaves the text to the caller.
 * Nothing ever goes to stdout in copy mode. */
function emit(text, opts, label) {
  if (!opts.copy) return false;
  const result = copyToClipboard(text);
  if (opts.verbose) {
    process.stderr.write(
      'Copied ' + label + ' to the clipboard via ' + result.via +
        ' (' + result.bytes + ' bytes)\n'
    );
  }
  return true;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.error) fail(opts.error);
  if (opts.version) return console.log(pkg.version);
  if (opts.help) return console.log(usage());

  const items = catalogue();
  const byNumber = new Map(items.map((item) => [item.number, item]));

  const unknown = opts.numbers.filter((n) => !byNumber.has(n));
  if (unknown.length > 0) {
    fail(
      'no practical numbered ' + unknown.join(', ') + '. Available numbers run from 1 to ' +
        items[items.length - 1].number + '.'
    );
  }

  const wantsListing = opts.list || (!opts.all && !opts.index && opts.numbers.length === 0);

  /* The list is a summary, so --save has nothing to write for it. */
  if (wantsListing) {
    const text = listing(items) + '\n';
    if (!emit(text, opts, 'the practical list')) process.stdout.write(text);
    return;
  }

  const chosen = opts.all ? items : opts.numbers.map((n) => byNumber.get(n));

  const docs = [];
  if (opts.index) docs.push({ name: path.basename(INDEX_FILE), text: read(INDEX_FILE) });
  for (const item of chosen) docs.push({ name: item.file, text: read(item.path) });

  if (opts.save) {
    const target = path.resolve(opts.dir || process.cwd());
    fs.mkdirSync(target, { recursive: true });
    for (const doc of docs) {
      const out = path.join(target, doc.name);
      fs.writeFileSync(out, doc.text, 'utf8');
      console.log('Saved ' + out);
    }
  }

  const text = docs.map((doc) => doc.text.replace(/\s*$/, '') + '\n').join('\n');
  if (!emit(text, opts, labelFor(opts, chosen)) && !opts.save) {
    process.stdout.write(text);
  }
}

main();
