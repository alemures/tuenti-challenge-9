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
    const result = solve(caseData.M);
    process.stdout.write(`Case #${i}: ${result}\n`);

    offset += 2;
  }
}

function readCase(lines, offset) {
  const N = Number(lines[offset]);
  const M = lines[offset + 1].split(' ').map(str => Number(str));
  return { N, M };
}

function solve(M) {
  const map = {};
  M.forEach((number) => {
    map[number] = map[number] ? map[number] + 1 : 1;
  });

  if (isShortened(map)) {
    const lcmValue = lcmList(M);
    Object.keys(map).forEach((number) => {
      map[number] *= lcmValue;
    });
  }

  let candies = 0;
  let attendes = 0;

  Object.keys(map).forEach((number) => {
    const temp = map[number] / Number(number);
    attendes += temp;
    candies += Number(number) * temp;
  });

  const gcdValue = gcd(candies, attendes);
  return candies / gcdValue + '/' + attendes / gcdValue;
}

function lcmList(numbers) {
  let result = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
  }
  return result;
}

// lest common multiple
function lcm(n1, n2) {
  return n1 * n2 / gcd(n1, n2);
}

// greatest common divisor
function gcd(n1, n2) {
  let remainder;

  while(true) {
    remainder = n1 % n2;
    if (remainder === 0) {
      return n2;
    }
    n1 = n2;
    n2 = remainder;
  }
}

function isShortened(map) {
  return !!Object.keys(map).find((key) => {
    return map[key] < Number(key) || Number(key) % map[key] !== 0;
  });
}
