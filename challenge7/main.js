// Wrong result

let data = '';

process.stdin.on('data', (chunk) => {
  data += chunk.toString();
});

process.stdin.on('end', () => {
  run();
});

process.stdin.resume();

function run() {
  const lines = data.split('\n');
  const cases = Number(lines[0]);
  let offset = 1;

  for (let i = 1; i <= cases; i++) {
    const caseData = readCase(lines, offset);
    const result = solve(caseData.originalLines, caseData.alteredLines);
    process.stdout.write(`Case #${i}: ${result}\n`);

    offset += 1 + caseData.M + 1 + caseData.L;
  }
}

function readCase(lines, offset) {
  const M = Number(lines[offset]);
  const originalLines = lines.slice(offset + 1, offset + 1 + M);
  const L = Number(lines[offset + 1 + M]);
  const alteredLines = lines.slice(offset + 1 + M + 1, offset + 1 + M + 1 + L);
  return { M, originalLines, L, alteredLines };
}

const MIN_CHAR_CODE = '0'.charCodeAt(0);
const MAX_CHAR_CODE = 'z'.charCodeAt(0);
const MAX_CHAR_SIZE = MAX_CHAR_CODE - MIN_CHAR_CODE;
const HASH_SIZE = 16;

function solve(originalLines, alteredLines) {
  const original = createMessage(originalLines)
  const altered = createMessage(alteredLines);

  const originalHash = notSoComplexHash(original.preamble + original.body);

  // print section offset in hash
  const offset = altered.preamble.length % 16;

  // Collision without print content
  if (equals(originalHash, notSoComplexHash(altered.preamble + altered.body))) {
    return '';
  }

  const result = calculateDiffAndPrintLength(originalHash, altered, offset);
  // console.log(result.diff, result.printLength);

  const print = buildPrintWithDiff(result.diff, result.printLength, offset);
  // console.log(print)

  // printBytes(originalHash);
  // printBytes(notSoComplexHash(altered.preamble + altered.body));
  // printBytes(notSoComplexHash(altered.preamble + print + altered.body));

  return print;
}

function buildPrintWithDiff(diff, printLength, offset) {
  offset += printLength % 16;
  const printArr = new Array(printLength).fill('0');

  for (let i = diff.length - 1, k = 0; i >= 0; i--,k++) {
    let tempDiff = diff[(i + offset) % HASH_SIZE];

    for(let j = 0; tempDiff > 0; j++) {
      const result = getCharByValue(tempDiff);
      const index = printLength - 1 - j * HASH_SIZE - k;
      printArr[index] = result.char;
      tempDiff -= result.value;
    }

  }

  return printArr.join('');
}

function getCharByValue(value) {
  const charCode = MIN_CHAR_CODE + value <= MAX_CHAR_CODE
    ? MIN_CHAR_CODE + value : MAX_CHAR_CODE;
  return {
    char: String.fromCharCode(charCode),
    value: charCode - MIN_CHAR_CODE
  };
}

// Calculates the minimum print length and the diff to build the final print section
function calculateDiffAndPrintLength(originalHash, altered, offset) {
  let print = '0';
  while (true) {
    let alteredHash = notSoComplexHash(altered.preamble + print + altered.body);
    let diff = createDiff(originalHash, alteredHash);

    if (isValidPrintLength(diff, print.length, offset)) {
      return { diff, printLength: print.length };
    }

    print += '0';
  }
}

function createDiff(hash1, hash2) {
  const diff = [];
  for (let i = 0; i < HASH_SIZE; i++) {
    const val = hash1[i] - hash2[i];
    diff.push(val >= 0 ? val : 256 + val);
  }
  return diff;
}

function isValidPrintLength(diff, printLength, offset) {
  const wrapCache = buildWrapCache(printLength, offset);
  for (let i = 0; i < HASH_SIZE; i++) {
    const index = (i + offset) % HASH_SIZE;
    const maxDistance = MAX_CHAR_SIZE * wrapCache[index];
    if (diff[index] > maxDistance) return false;
  }
  return true;
}

function buildWrapCache(printLength, offset) {
  const cache = (new Array(HASH_SIZE)).fill(0);
  for (let i = 0; i < printLength; i++) {
    const index = (i + offset) % HASH_SIZE;
    if (!cache[index]) cache[index] = 1;
    else cache[index]++;
  }
  return cache;
}

function createMessage(lines) {
  const printIndex = lines.indexOf('------');
  const preamble = lines.slice(0, printIndex).join('') + '---' ;
  const body = '---' + lines.slice(printIndex + 1).join('');
  return { preamble, body };
}

function equals(hash1, hash2) {
  if (hash1.length != hash2.length) return false;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) return false;
  }
  return true;
}

function printBytes(hash) {
  process.stdout.write('[');
  for (let i = 0; i < hash.length; i++) {
    process.stdout.write(hash.readUInt8(i) + ' ');
  }
  process.stdout.write(']\n');
}

function notSoComplexHash(inputText, offset = 0) {
  const hash = Buffer.alloc(HASH_SIZE);
  const textBytes = Buffer.from(inputText, 'ascii');
  for (let i = 0; i < textBytes.length; i++) {
    const index = (i + offset) % HASH_SIZE;
    hash[index] = hash[index] + textBytes[i];
  }
  return hash;
}
