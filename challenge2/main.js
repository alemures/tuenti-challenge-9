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
    const result = solve(caseData.P, caseData.jumps);
    process.stdout.write(`Case #${i}: ${result}\n`);

    offset += caseData.P + 1;
  }
}

function readCase(lines, offset) {
  const P = Number(lines[offset]);
  const jumps = {};
  lines.slice(offset + 1, offset + 1 + P).forEach((l) => {
    const parts = l.split(':');
    jumps[parts[0]] = parts[1].split(',')
  });

  return { P, jumps };
}

function solve(P, jumps) {
  const count = { value: 0 };
   _solve('Galactica', jumps, count)

  return count.value;
}

function _solve(planet, jumps, count) {
  jumps[planet].forEach((p) => {
    if (p === 'New Earth') {
      count.value++;
    } else {
      _solve(p, jumps, count);
    }
  });
}
