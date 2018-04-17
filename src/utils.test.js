import {
  isDigraph,
  removeDigraphPitches,
  getMorae,
  getMoraCount,
  getPitchPatternName,
  getPitchNumFromPattern,
  makeHeiban,
  makeAtamadaka,
  makeOdaka,
  makeNakadaka,
  makePitchPattern,
} from './utils';

describe('isDigraph()', () => {
  it('sane default', () => expect(isDigraph()).toBe(false));
  it('no false positives', () => {
    expect(isDigraph('よ')).toBe(false);
    expect(isDigraph('ヨ')).toBe(false);
    expect(isDigraph('yo')).toBe(false);
    expect(isDigraph('鉄')).toBe(false);
  });
  it('detects digraphs', () => {
    expect(isDigraph('ょ')).toBe(true);
    expect(isDigraph('ョ')).toBe(true);
  });
});

describe('getMorae()', () => {
  it('sane defaults', () => {
    expect(getMorae()).toEqual([]);
    expect(getMorae('')).toEqual([]);
  });
  it('combines digraphs and splits mora', () => {
    expect(getMorae('し')).toEqual(['し']);
    expect(getMorae('しゅ')).toEqual(['しゅ']);
    expect(getMorae('がく')).toEqual(['が', 'く']);
    expect(getMorae('がくしゅ')).toEqual(['が', 'く', 'しゅ']);
    expect(getMorae('けっか')).toEqual(['け', 'っ', 'か']);
    expect(getMorae('しょうが')).toEqual(['しょ', 'う', 'が']);
    expect(getMorae('がっしょう')).toEqual(['が', 'っ', 'しょ', 'う']);
    expect(getMorae('かんじょう')).toEqual(['か', 'ん', 'じょ', 'う']);
  });
});

describe('getMoraCount()', () => {
  it('sane defaults', () => {
    expect(getMoraCount()).toEqual(0);
    expect(getMoraCount('')).toEqual(0);
  });
  it('returns mora length', () => expect(getMoraCount('ちゅうがっこう')).toEqual(6));
});

describe('getPitchPatternName()', () => {
  it('sane defaults', () => {
    expect(getPitchPatternName()).toBe('unknown');
    expect(getPitchPatternName(0)).toBe('unknown');
    expect(getPitchPatternName(undefined, -1)).toBe('unknown');
    expect(getPitchPatternName(2, 2, 'INVALID_LOCALE')).toBe('unknown');
    expect(getPitchPatternName(undefined, -1, 'JA')).toBe('不詳');
  });

  it('returns english name if no locale specified', () => {
    expect(getPitchPatternName(5, 0)).toBe('heiban');
  });

  it('returns english names when specified', () => {
    expect(getPitchPatternName(4, 0, 'EN')).toBe('heiban');
    expect(getPitchPatternName(4, 1, 'EN')).toBe('atamadaka');
    expect(getPitchPatternName(4, 2, 'EN')).toBe('nakadaka');
    expect(getPitchPatternName(4, 3, 'EN')).toBe('nakadaka');
    expect(getPitchPatternName(4, 4, 'EN')).toBe('odaka');
    expect(getPitchPatternName(4, 5, 'EN')).toBe('unknown');
  });

  it('returns japanese names when locale specified', () => {
    expect(getPitchPatternName(4, 0, 'JA')).toBe('平板');
    expect(getPitchPatternName(4, 1, 'JA')).toBe('頭高');
    expect(getPitchPatternName(4, 2, 'JA')).toBe('中高');
    expect(getPitchPatternName(4, 3, 'JA')).toBe('中高');
    expect(getPitchPatternName(4, 4, 'JA')).toBe('尾高');
    expect(getPitchPatternName(4, 5, 'JA')).toBe('不詳');
  });
});

describe('makeHeiban()', () => {
  it('sane default', () => expect(makeHeiban()).toEqual([]));
  it('1 mora', () => expect(makeHeiban(1)).toEqual([0, 1]));
  it('2 mora', () => expect(makeHeiban(2)).toEqual([0, 1, 1]));
  it('3 mora', () => expect(makeHeiban(3)).toEqual([0, 1, 1, 1]));
  it('4 mora', () => expect(makeHeiban(4)).toEqual([0, 1, 1, 1, 1]));
  it('5 mora', () => expect(makeHeiban(5)).toEqual([0, 1, 1, 1, 1, 1]));
});

describe('makeAtamadaka()', () => {
  it('sane default', () => expect(makeAtamadaka()).toEqual([]));
  it('1 mora', () => expect(makeAtamadaka(1)).toEqual([1, 0]));
  it('2 mora', () => expect(makeAtamadaka(2)).toEqual([1, 0, 0]));
  it('3 mora', () => expect(makeAtamadaka(3)).toEqual([1, 0, 0, 0]));
  it('4 mora', () => expect(makeAtamadaka(4)).toEqual([1, 0, 0, 0, 0]));
  it('5 mora', () => expect(makeAtamadaka(5)).toEqual([1, 0, 0, 0, 0, 0]));
});

describe('makeOdaka()', () => {
  it('sane defaults', () => {
    expect(makeOdaka()).toEqual([]);
    expect(makeOdaka(1)).toEqual([]);
  });
  it('2 mora', () => expect(makeOdaka(2)).toEqual([0, 1, 0]));
  it('3 mora', () => expect(makeOdaka(3)).toEqual([0, 1, 1, 0]));
  it('4 mora', () => expect(makeOdaka(4)).toEqual([0, 1, 1, 1, 0]));
  it('5 mora', () => expect(makeOdaka(5)).toEqual([0, 1, 1, 1, 1, 0]));
});

describe('makeNakadaka()', () => {
  it('sane defaults', () => {
    expect(makeNakadaka()).toEqual([]);
    expect(makeNakadaka(1)).toEqual([]);
    expect(makeNakadaka(2)).toEqual([]);
    expect(makeNakadaka(3, 0)).toEqual([]);
    expect(makeNakadaka(3, 1)).toEqual([]);
    expect(makeNakadaka(3, 3)).toEqual([]);
  });
  it('3 mora pitch 2', () => expect(makeNakadaka(3, 2)).toEqual([0, 1, 0, 0]));
  it('4 mora pitch 2', () => expect(makeNakadaka(4, 2)).toEqual([0, 1, 0, 0, 0]));
  it('4 mora pitch 3', () => expect(makeNakadaka(4, 3)).toEqual([0, 1, 1, 0, 0]));
  it('5 mora pitch 2', () => expect(makeNakadaka(5, 2)).toEqual([0, 1, 0, 0, 0, 0]));
  it('5 mora pitch 3', () => expect(makeNakadaka(5, 3)).toEqual([0, 1, 1, 0, 0, 0]));
  it('5 mora pitch 4', () => expect(makeNakadaka(5, 4)).toEqual([0, 1, 1, 1, 0, 0]));
});

describe('makePitchPattern()', () => {
  it('sane default', () => expect(makePitchPattern()).toEqual([]));
  it('creates correct patterns', () => {
    combinedDigraphs.forEach((patternList) =>
      patternList.forEach(({ reading, pitchNum, pattern }) =>
        expect(makePitchPattern(getMoraCount(reading), pitchNum)).toEqual(pattern)
      )
    );
  });
});

describe('getPitchPatternName()', () => {
  it('pitch pattern should match pattern type', () => {
    combinedDigraphs.forEach((patternList) =>
      patternList.forEach(({ reading, pitchNum, patternName }) =>
        expect(getPitchPatternName(getMoraCount(reading), pitchNum)).toEqual(patternName)
      )
    );
  });
});

describe('getPitchNumFromPattern', () => {
  it('combined digraphs', () => {
    combinedDigraphs.forEach((patternList) =>
      patternList.forEach(({ reading, pattern, pitchNum }) => {
        const result = getPitchNumFromPattern(reading, pattern);
        expect(result).toEqual(pitchNum);
        expect(makePitchPattern(getMoraCount(reading), result)).toEqual(pattern);
      })
    );
  });

  it('separate digraphs', () => {
    separateDigraphs.forEach(({ reading, pattern, pitchNum }) => {
      const result = getPitchNumFromPattern(reading, pattern, true);
      expect(result).toEqual(pitchNum);
      expect(makePitchPattern(getMoraCount(reading), result)).toEqual(
        removeDigraphPitches(reading, pattern)
      );
    });
  });
});

// macOS dictionary pitch number examples
const combinedDigraphs = [
  [
    {
      reading: '',
      pitchNum: -1,
      pattern: [],
      patternName: 'unknown',
    },
  ],
  [
    {
      reading: 'な',
      pitchNum: 0,
      pattern: [0, 1],
      patternName: 'heiban',
    },
    {
      reading: 'き',
      pitchNum: 1,
      pattern: [1, 0],
      patternName: 'atamadaka',
    },
  ],
  [
    {
      reading: 'みず',
      pitchNum: 0,
      pattern: [0, 1, 1],
      patternName: 'heiban',
    },
    {
      reading: 'あき',
      pitchNum: 1,
      pattern: [1, 0, 0],
      patternName: 'atamadaka',
    },
    {
      reading: 'はな',
      pitchNum: 2,
      pattern: [0, 1, 0],
      patternName: 'odaka',
    },
  ],
  [
    {
      reading: 'かいしゃ',
      pitchNum: 0,
      pattern: [0, 1, 1, 1],
      patternName: 'heiban',
    },
    {
      reading: 'でんき',
      pitchNum: 1,
      pattern: [1, 0, 0, 0],
      patternName: 'atamadaka',
    },
    {
      reading: 'おかし',
      pitchNum: 2,
      pattern: [0, 1, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'おとこ',
      pitchNum: 3,
      pattern: [0, 1, 1, 0],
      patternName: 'odaka',
    },
  ],
  [
    {
      reading: 'だいがく',
      pitchNum: 0,
      pattern: [0, 1, 1, 1, 1],
      patternName: 'heiban',
    },
    {
      reading: 'ぶんがく',
      pitchNum: 1,
      pattern: [1, 0, 0, 0, 0],
      patternName: 'atamadaka',
    },
    {
      reading: 'ゆきぐに',
      pitchNum: 2,
      pattern: [0, 1, 0, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'いんかん',
      pitchNum: 3,
      pattern: [0, 1, 1, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'おとうと',
      pitchNum: 4,
      pattern: [0, 1, 1, 1, 0],
      patternName: 'odaka',
    },
  ],
  [
    {
      reading: 'ちゅうごくご',
      pitchNum: 0,
      pattern: [0, 1, 1, 1, 1, 1],
      patternName: 'heiban',
    },
    {
      reading: 'しゃあべっと',
      pitchNum: 1,
      pattern: [1, 0, 0, 0, 0, 0],
      patternName: 'atamadaka',
    },
    {
      reading: 'ふきゅうりつ',
      pitchNum: 2,
      pattern: [0, 1, 0, 0, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'やまのぼり',
      pitchNum: 3,
      pattern: [0, 1, 1, 0, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'こがたばす',
      pitchNum: 4,
      pattern: [0, 1, 1, 1, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'ももなはな',
      pitchNum: 5,
      pattern: [0, 1, 1, 1, 1, 0],
      patternName: 'odaka',
    },
  ],
  [
    {
      reading: 'けんぶつにん',
      pitchNum: 0,
      pattern: [0, 1, 1, 1, 1, 1, 1],
      patternName: 'heiban',
    },
    {
      reading: 'けんもほろろ',
      pitchNum: 1,
      pattern: [1, 0, 0, 0, 0, 0, 0],
      patternName: 'atamadaka',
    },
    {
      reading: 'おまわりさん',
      pitchNum: 2,
      pattern: [0, 1, 0, 0, 0, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'ちゅうがっこう',
      pitchNum: 3,
      pattern: [0, 1, 1, 0, 0, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'こくごじてん',
      pitchNum: 4,
      pattern: [0, 1, 1, 1, 0, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'たんさんがす',
      pitchNum: 5,
      pattern: [0, 1, 1, 1, 1, 0, 0],
      patternName: 'nakadaka',
    },
    {
      reading: 'じゅういちがつ',
      pitchNum: 6,
      pattern: [0, 1, 1, 1, 1, 1, 0],
      patternName: 'odaka',
    },
  ],
];

// ojad data
const separateDigraphs = [
  { reading: 'こ', pitchNum: 0, pattern: [0, 1] },
  { reading: 'て', pitchNum: 1, pattern: [1, 0] },
  { reading: 'たば', pitchNum: 1, pattern: [1, 0, 0] },
  { reading: 'なんがつ', pitchNum: 1, pattern: [1, 0, 0, 0, 0] },
  { reading: 'えだ', pitchNum: 0, pattern: [0, 1, 1] },
  { reading: 'ようき', pitchNum: 0, pattern: [0, 1, 1, 1] },
  { reading: 'ひがしぐち', pitchNum: 0, pattern: [0, 1, 1, 1, 1, 1] },
  { reading: 'くみ', pitchNum: 2, pattern: [0, 1, 0] },
  { reading: 'きゅうけいじょ', pitchNum: 0, pattern: [0, 0, 1, 1, 1, 1, 1, 1] },
  { reading: 'ふらんすじん', pitchNum: 4, pattern: [0, 1, 1, 1, 0, 0, 0] },
  { reading: 'かいぎしつ', pitchNum: 3, pattern: [0, 1, 1, 0, 0, 0] },
  { reading: 'おとこのひと', pitchNum: 6, pattern: [0, 1, 1, 1, 1, 1, 0] },
  { reading: 'りょこうしゃ', pitchNum: 2, pattern: [0, 0, 1, 0, 0, 0, 0] },
];
