// Not submited

const japaneseNumeralsToNumber = require('./japaneseNumeralsToNumber');

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
    const result = solve(caseData.a, caseData.b, caseData.c);
    process.stdout.write(`Case #${i}: ${result}\n`);

    offset += 1;
  }
}

function readCase(lines, offset) {
  let temp = lines[offset].split(' OPERATOR ');
  let temp2 = temp[1].split(' = ')
  return { a: temp[0], b: temp2[0], c: temp2[1] };
}

function solve(a, b, c) {
  const validA = getValidNumbers(a);
  const validB = getValidNumbers(b);
  const validC = getValidNumbers(c);

  // console.log(validA, validB, validC);
  return findOperation(validA, validB, validC);
}

// Troubleshooting return of multiple posible options
function findOperation(validA, validB, validC) {
  console.log(validA.length,validB.length,validC.length)
  const operations = ['+', '-', '*'];
  let results = [];

  operations.forEach(op => {
    validA.forEach(a => {
      validB.forEach(b => {
        validC.forEach(c => {
          if (op === '+' && a + b === c
            || op === '-' && a - b === c
            || op === '*' && a * b === c) {
            results.push(`${a} ${op} ${b} = ${c}`);
          }
        });
      })
    });
  });

  return results;
}

function permut(string) {
  if (string.length < 2) return string;

  var permutations = [];
  for (var i = 0; i < string.length; i++) {
    var char = string[i];

    // Skip duplications
    if (string.indexOf(char) != i) continue;

    var remainingString = string.slice(0, i) + string.slice(i + 1, string.length);

    for (var subPermutation of permut(remainingString)) {
      permutations.push(char + subPermutation)
    }
  }
  return permutations;
}

function getValidNumbers(n) {
  return permut(n).filter(permut => {
    try {
      japaneseNumeralsToNumber(permut);
      return true;
    } catch(e) {
      return false;
    }
  }).map(n => japaneseNumeralsToNumber(n));
}
