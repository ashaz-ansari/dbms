#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

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

function usage() {
  return [
    'Usage:',
    '  npx --yes ' + REPO + '              list the practicals',
    '  npx --yes ' + REPO + ' 3            print practical 3',
    '  npx --yes ' + REPO + ' 3 5 9        print several practicals',
    '  npx --yes ' + REPO + ' all          print all 24 practicals',
    '  npx --yes ' + REPO + ' --index      print the index file',
    '  npx --yes ' + REPO + ' 3 --save     save as a .txt file',
    '',
    'Options:',
    '  -l, --list        list the practicals with titles (no arguments',
    '                    does the same)',
    '  -a, --all         print every practical',
    '  -i, --index       print practical/README-Index.txt',
    '  -s, --save        write .txt files instead of printing',
    '      --dir <path>  folder used by --save (default: current)',
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

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.error) fail(opts.error);
  if (opts.version) return console.log(pkg.version);
  if (opts.help) return console.log(usage());

  const items = catalogue();
  const byNumber = new Map(items.map((item) => [item.number, item]));

  if (opts.list || (!opts.all && !opts.index && opts.numbers.length === 0)) {
    return console.log(listing(items));
  }

  const unknown = opts.numbers.filter((n) => !byNumber.has(n));
  if (unknown.length > 0) {
    fail(
      'no practical numbered ' + unknown.join(', ') + '. Available numbers run from 1 to ' +
        items[items.length - 1].number + '.'
    );
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
    return;
  }

  process.stdout.write(docs.map((doc) => doc.text.replace(/\s*$/, '') + '\n').join('\n'));
}

main();
