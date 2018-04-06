// TODO: export default hatsuon(pitch, ...readings) that returns detailed object
// export individual methods as well for easy re-use
// if 2 readings passed, figure out the modified pitch
// https://japanese.stackexchange.com/questions/29488/what-are-the-pitch-accent-rules-for-compound-nouns
// also waseda info about edge-cases like せい

const HIRA_DIGRAPHS = ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゃ', 'ゅ', 'ょ', 'ゎ', 'ゕ', 'ゖ'];
const KATA_DIGRAPHS = ['ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ', 'ヮ', 'ヵ', 'ヶ'];
const PATTERN_NAMES = {
  HEIBAN: {
    EN: 'heiban',
    JA: '平板',
  },
  ATAMADAKA: {
    EN: 'atamadaka',
    JA: '頭高',
  },
  NAKADAKA: {
    EN: 'nakadaka',
    JA: '中高',
  },
  ODAKA: {
    EN: 'odaka',
    JA: '尾高',
  },
};

const isDigraph = (kana = '') => KATA_DIGRAPHS.includes(kana) || HIRA_DIGRAPHS.includes(kana);

// [か, し, ゅ, う] => [か, しゅ, う]
const combineDigraphs = (arr = [], char = '') =>
  isDigraph(char) ? arr.slice(0, -1).concat(arr.slice(-1) + char) : arr.concat(char);

function getMorae(reading = '') {
  return reading.split('').reduce(combineDigraphs, []);
}

function getMoraCount(reading = '') {
  return getMorae(reading).length;
}

function getPitchPatternName(moraCount = 0, pitchNum = -1, locale = 'EN') {
  let names = { EN: 'unknown', JA: '不詳' };
  if (pitchNum === 0) {
    names = PATTERN_NAMES.HEIBAN;
  }
  if (pitchNum === 1) {
    names = PATTERN_NAMES.ATAMADAKA;
  }
  if (pitchNum > 1 && pitchNum < moraCount) {
    names = PATTERN_NAMES.NAKADAKA;
  }
  if (pitchNum > 1 && pitchNum === moraCount) {
    names = PATTERN_NAMES.ODAKA;
  }
  return names[locale] || 'unknown';
}

// initial low -> rest high, particle high
// [0, 1, 1, 1, 1, 1]
function makeHeiban(moraCount = 0) {
  if (moraCount < 1) return [];
  return [
    0,
    ...Array(moraCount)
      .fill(1)
      .slice(0, -1),
    1,
  ];
}

// initial high -> rest low, particle low
// [1, 0, 0, 0, 0, 0]
function makeAtamadaka(moraCount = 0) {
  if (moraCount < 1) return [];
  return [
    1,
    ...Array(moraCount)
      .fill(0)
      .slice(0, -1),
    0,
  ];
}

// initial low, rest high, particle low
// [0, 1, 1, 1, 1, 0]
function makeOdaka(moraCount = 0) {
  if (moraCount < 2) return [];
  return [
    0,
    ...Array(moraCount)
      .fill(1)
      .slice(0, -1),
    0,
  ];
}

// initial low, one or more high, rest (at least 1) low, particle low
// final mora before particle *must* be low
// [0, 1, 0, 0, 0, 0]
// [0, 1, 1, 0, 0, 0]
// [0, 1, 1, 1, 0, 0]
function makeNakadaka(moraCount = 0, pitchNum = 0) {
  if (moraCount < 3 || pitchNum < 2 || pitchNum >= moraCount) return [];
  return [0, ...Array(pitchNum - 1).fill(1), ...Array(moraCount - pitchNum).fill(0), 0];
}

function removeDigraphPitches(reading = '', pattern = []) {
  return pattern.filter((x, i) => !isDigraph(reading[i]));
}

// some sources include digraphs as points in the pitch pattern,
// so for those we need to use digraphsIncluded=true flag
// to strip them in order to maintain consistency with makePitchPattern
function getPitchNumFromPattern(reading = '', pitchPattern = [], digraphsIncluded = false) {
  let pattern = pitchPattern.slice();
  const particle = pattern.pop();
  const isHeiban = particle === 1;
  if (isHeiban) {
    return 0;
  }
  if (digraphsIncluded) {
    pattern = removeDigraphPitches(reading, pattern);
  }
  pattern = pattern.slice(1);
  return pattern.findIndex((x) => x === 0) + 1 || pattern.length + 1;
}

// returned pitch pattern lengths are moraCount + 1
// the final index indicates particle pitch
function makePitchPattern(moraCount = 0, pitchNum = -1) {
  switch (getPitchPatternName(moraCount, pitchNum)) {
    case PATTERN_NAMES.HEIBAN.EN:
      return makeHeiban(moraCount);
    case PATTERN_NAMES.ATAMADAKA.EN:
      return makeAtamadaka(moraCount);
    case PATTERN_NAMES.ODAKA.EN:
      return makeOdaka(moraCount);
    case PATTERN_NAMES.NAKADAKA.EN:
      return makeNakadaka(moraCount, pitchNum);
    default:
      return [];
  }
}

module.exports = {
  isDigraph,
  removeDigraphPitches,
  getMorae,
  getMoraCount,
  getPitchPatternName,
  getPitchNumFromPattern,
  makePitchPattern,
  makeHeiban,
  makeAtamadaka,
  makeOdaka,
  makeNakadaka,
};
