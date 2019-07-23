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
    const result = solve(caseData.sender, caseData.message);
    process.stdout.write(`Case #${i}: ${result}\n`);

    offset += 2;
  }
}

function readCase(lines, offset) {
  const sender = lines[offset];
  const message = lines[offset + 1];
  return { sender, message };
}

const layoutWidth = 10;
const layoutHeight = 4;
const layout = [
  '1','2','3','4','5','6','7','8','9','0',
  'Q','W','E','R','T','Y','U','I','O','P',
  'A','S','D','F','G','H','J','K','L',';',
  'Z','X','C','V','B','N','M',',','.','-',
];

const layoutMap = createLayoutMap();
const invertedLayoutMap = invertMap(layoutMap);

function solve(sender, message) {
  const displacement = calculateDisplacement(sender, message);
  // console.log(displacement)
  const shiftedLayoutMap = shiftLayoutMap(displacement);
  // console.log(layoutMap)
  // console.log(shiftedLayoutMap)
  return decryptMessage(message, shiftedLayoutMap);
}

function createLayoutMap() {
  const map = {};
  layout.forEach((char, index) => {
    map[char] = { x: index % layoutWidth, y: Math.floor(index / layoutWidth) };
  });
  return map;
}

function calculateDisplacement(sender, message) {
  const lastCharacter = message[message.length - 1];
  // console.log(sender + '-' + JSON.stringify(layoutMap[sender]), lastCharacter + '-' + JSON.stringify(layoutMap[lastCharacter]));

  return {
    x: layoutMap[sender].x - layoutMap[lastCharacter].x,
    y: layoutMap[sender].y - layoutMap[lastCharacter].y
  };
}

function shiftLayoutMap(displacement) {
  const shiftedLayoutMap = {};
  Object.keys(layoutMap).forEach((char) => {
    const currentPosition = layoutMap[char];
    shiftedLayoutMap[char] = {
      x: (currentPosition.x + displacement.x) % layoutWidth,
      y: (currentPosition.y + displacement.y) % layoutHeight
    };
    // Handle negative coordinates
    if (shiftedLayoutMap[char].x < 0) shiftedLayoutMap[char].x += layoutWidth;
    if (shiftedLayoutMap[char].y < 0) shiftedLayoutMap[char].y += layoutHeight;
  });
  return shiftedLayoutMap;
}

function invertMap(map) {
  const inverted = {};
  Object.keys(map).forEach((char) => {
    inverted[pointToString(map[char])] = char;
  });
  return inverted;
}

function pointToString(point) {
  return point.x + ',' + point.y;
}

function decryptMessage(message, shiftedLayoutMap) {
  let decryptedMessage = '';
  for (let i = 0; i < message.length; i++) {
    const point = shiftedLayoutMap[message[i]];
    decryptedMessage += point ? invertedLayoutMap[pointToString(point)] : ' ';
  }
  return decryptedMessage;
}
