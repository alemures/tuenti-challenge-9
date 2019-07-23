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
    const result = solve(caseData);
    process.stdout.write(`Case #${i}:\n`);
    process.stdout.write(result + '\n');

    offset += caseData.F + caseData.P + 1;
  }
}

function readCase(lines, offset) {
  const line = lines[offset].split(' ');
  const W = Number(line[0]);
  const H = Number(line[1]);
  const F = Number(line[2]);
  const P = Number(line[3]);

  const folds = lines.slice(offset + 1, offset + 1 + F);
  const punches = lines.slice(offset + 1 + F, offset + 1 + F + P).map((l) => {
    const splitted = l.split(' ');
    return { x: Number(splitted[0]), y: Number(splitted[1]) };
  });

  return { W, H, F, P, folds, punches };
}

function solve(data) {
  data.folds.forEach((fold) => {
    switch(fold) {
      case 'L':
        unfoldLeft(data.W, data.H, data.punches);
        data.W *= 2;
        break;
      case 'R':
        unfoldRight(data.W, data.H, data.punches);
        data.W *= 2;
        break;
      case 'T':
        unfoldTop(data.W, data.H, data.punches);
        data.H *= 2;
        break;
      case 'B':
        unfoldBottom(data.W, data.H, data.punches);
        data.H *= 2;
        break;
    }
  });

  return data.punches.sort(pointComparator).map(p => {
    return p.x + ' ' + p.y;
  }).join('\n');
}

function unfoldTop(W, H, punches) {
  const length = punches.length;
  for (let i = 0; i < length; i++) {
    punches.push({ x: punches[i].x, y: punches[i].y * -1 - 1 });
  }
  punches.forEach((p) => {
    p.y += H;
  });
}

function unfoldRight(W, H, punches) {
  const length = punches.length;
  for (let i = 0; i < length; i++) {
    punches.push({ x: W * 2 - punches[i].x - 1, y: punches[i].y });
  }
}

function unfoldLeft(W, H, punches) {
  const length = punches.length;
  for (let i = 0; i < length; i++) {
    punches.push({ x: punches[i].x * -1 - 1, y: punches[i].y });
  }
  punches.forEach((p) => {
    p.x += W;
  });
}

function unfoldBottom(W, H, punches) {
  const length = punches.length;
  for (let i = 0; i < length; i++) {
    punches.push({ x: punches[i].x, y: H * 2 - punches[i].y - 1 });
  }
}

function pointComparator(a, b) {
  if (a.x > b.x) {
    return 1;
  } else if (a.x < b.x) {
    return -1;
  }

  if (a.y > b.y) {
    return 1;
  } else if (a.y < b.y) {
    return -1;
  }

  return 0;
}
