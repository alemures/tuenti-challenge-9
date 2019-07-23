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
    const result = solve(caseData.words);
    process.stdout.write(`Case #${i}: ${result}\n`);

    offset += 1 + caseData.M;
  }
}

function readCase(lines, offset) {
  const M = Number(lines[offset]);
  const words = lines.slice(offset + 1, offset + 1 + M);
  return { M, words };
}

function solve(words) {
  const chars = getChars(words);
  const relations = calculateRelations(words, chars);
  // console.log(relations);

  const uniqueSmallerChars = unique(
    getAllSmallerChars(relations)
  );
  const first = Object.keys(relations).filter(char => {
    return uniqueSmallerChars.indexOf(char) === -1;
  });
  const last = Object.keys(relations).filter(char => {
    return relations[char].length === 0;
  });

  // console.log(first, last, chars);

  // When chars is more than 1, only one first an one last is allowed
  if (chars.length > 1 && (first.length !== 1 || last.length !== 1)) {
    return 'AMBIGUOUS';
  }

  let hasEquivalentCharacters = false;
  const sortedChars = chars.sort((a, b) => {
    // The last one
    if (a === first[0] || b === last[0]) {
      return -1;
    }
    if (a === last[0] || b === first[0]) {
      return 1;
    }
    if (relations[a].indexOf(b) > -1) {
      return -1;
    }
    if (relations[b].indexOf(a) > -1) {
      return 1;
    }
    hasEquivalentCharacters = true;
    return 0;
  });

  if (!hasEquivalentCharacters) {
    return sortedChars.join(' ');
  }
  return 'AMBIGUOUS';
}

function calculateRelations(words, chars) {
  const relations = {};
  chars.forEach((char) => {
    relations[char] = []
  });

  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i];
    const word2 = words[i + 1];

    const minLength = min(word1.length, word2.length);
    for (let j = 0; j < minLength; j++) {
      const char1 = word1[j];
      const char2 = word2[j];

      if (char1 !== char2) {
        if (relations[char1].indexOf(char2) === -1) {
          relations[char1].push(char2);
        }
        break;
      }
    }
  }
  addIndirectRelations(relations);
  return relations;
}

function getCountSmallerChars(relations) {
  let count = 0;
  Object.keys(relations).forEach((char) => {
    count += relations[char].length;
  });
  return count;
}

function getAllSmallerChars(relations) {
  return Object.keys(relations)
    .map(char => relations[char])
    .reduce((acc, list) => acc.concat(list), []);
}

// Recursively adds related chars
function addIndirectRelations(relations) {
  let countBefore = getCountSmallerChars(relations);
  while(true) {
    Object.keys(relations).forEach((char) => {
      addIndirectRelationsByChar(relations, char, relations[char]);
    });

    let countAfter = getCountSmallerChars(relations);
    if (countBefore !== countAfter) {
      countBefore = countAfter;
    } else  {
      break;
    }
  }
}

function addIndirectRelationsByChar(relations, char, smallerChars) {
  relations[char].forEach((char2) => {
    const newChars = relations[char2].filter((char3) => {
      return smallerChars.indexOf(char3) === -1;
    });

    newChars.forEach((char3) => {
      if (smallerChars.indexOf(char3) === -1) {
        smallerChars.push(char3);
        addIndirectRelationsByChar(relations, char3, smallerChars);
      }
    });
  });
}

function unique(arr) {
  const map = {};
  arr.forEach(e => map[e] = 1);
  return Object.keys(map);
}

function min(a, b) {
  return a < b ? a : b;
}

function getChars(words) {
  const chars = {};
  words.forEach((word) => {
    for (let i = 0; i < word.length; i++) {
      chars[word[i]] = 1;
    }
  });
  return Object.keys(chars);
}
