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

  for (let i = 0; i < cases; i++) {
    const line = lines[i + 1];

    const numbers = line.split(' ');
    const result = solve(Number(numbers[0]), Number(numbers[1]));
    process.stdout.write(`Case #${i+1}: ${result}\n`);
  }
}

function solve(N, M) {
  return Math.ceil(N / 2) + Math.ceil(M / 2);
}
