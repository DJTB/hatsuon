const {
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
} = require('./index');

const fixtures = [
  [{ reading: 'な', pitchNum: 0 }, { reading: 'き', pitchNum: 1 }],
  [
    { reading: 'みず', pitchNum: 0 },
    { reading: 'あき', pitchNum: 1 },
    { reading: 'はな', pitchNum: 2 },
  ],
  [
    { reading: 'かいしゃ', pitchNum: 0 },
    { reading: 'でんき', pitchNum: 1 },
    { reading: 'おかし', pitchNum: 2 },
    { reading: 'おとこ', pitchNum: 3 },
  ],
  [
    { reading: 'だいがく', pitchNum: 0 },
    { reading: 'ぶんがく', pitchNum: 1 },
    { reading: 'ゆきぐに', pitchNum: 2 },
    { reading: 'いんかん', pitchNum: 3 },
    { reading: 'おとうと', pitchNum: 4 },
  ],
  [
    { reading: 'ちゅうごくご', pitchNum: 0 },
    { reading: 'しゃあべっと', pitchNum: 1 },
    { reading: 'ふきゅうりつ', pitchNum: 2 },
    { reading: 'やまのぼり', pitchNum: 3 },
    { reading: 'こがたばす', pitchNum: 4 },
    { reading: 'ももなはな', pitchNum: 5 },
  ],
  [
    { reading: 'けんぶつにん', pitchNum: 0 },
    { reading: 'けんもほろろ', pitchNum: 1 },
    { reading: 'おまわりさん', pitchNum: 2 },
    { reading: 'ちゅうがっこう', pitchNum: 3 },
    { reading: 'こくごじてん', pitchNum: 4 },
    { reading: 'たんさんがす', pitchNum: 5 },
    { reading: 'じゅういちがつ', pitchNum: 6 },
  ],
];

describe('PitchDiagram utils', () => {
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

  describe('patterns', () => {
    describe('makePitchPattern()', () => {
      it('sane default', () => expect(makePitchPattern()).toEqual([]));
      it('creates correct patterns', () => {
        expect(
          fixtures.map((patternList) =>
            patternList.map(({ reading, pitchNum }) =>
              makePitchPattern(getMoraCount(reading), pitchNum)
            )
          )
        ).toMatchSnapshot();
      });
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
      });

      it('returns japanese names when locale specified', () => {
        expect(getPitchPatternName(4, 0, 'JA')).toBe('平板');
        expect(getPitchPatternName(4, 1, 'JA')).toBe('頭高');
        expect(getPitchPatternName(4, 2, 'JA')).toBe('中高');
        expect(getPitchPatternName(4, 3, 'JA')).toBe('中高');
        expect(getPitchPatternName(4, 4, 'JA')).toBe('尾高');
      });
    });

    describe('makePitchPattern() and getPitchPatternName()', () => {
      it('pitch pattern should match pattern type', () => {
        expect(
          fixtures.map((patternList) =>
            patternList.map(({ reading, pitchNum }) => [
              ...makePitchPattern(getMoraCount(reading), pitchNum),
              getPitchPatternName(getMoraCount(reading), pitchNum),
            ])
          )
        ).toMatchSnapshot();
      });
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
});

describe('reverse engineer pitchnums', () => {
  describe('ojad style (includes digraph pitch)', () => {
    it('こ', () => {
      const reading = 'こ';
      const pitchPattern = [0, 1];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 0;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('て', () => {
      const reading = 'て';
      const pitchPattern = [1, 0];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 1;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('たば', () => {
      const reading = 'たば';
      const pitchPattern = [1, 0, 0];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 1;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('なんがつ', () => {
      const reading = 'なんがつ';
      const pitchPattern = [1, 0, 0, 0, 0];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 1;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('えだ', () => {
      const reading = 'えだ';
      const pitchPattern = [0, 1, 1];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 0;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('ようき', () => {
      const reading = 'ようき';
      const pitchPattern = [0, 1, 1, 1];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 0;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('ひがしぐち', () => {
      const reading = 'ひがしぐち';
      const pitchPattern = [0, 1, 1, 1, 1, 1];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 0;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('くみ', () => {
      const reading = 'くみ';
      const pitchPattern = [0, 1, 0];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 2;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('きゅうけいじょ', () => {
      const reading = 'きゅうけいじょ';
      const pitchPattern = [0, 0, 1, 1, 1, 1, 1, 1];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 0;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('ふらんすじん', () => {
      const reading = 'ふらんすじん';
      const pitchPattern = [0, 1, 1, 1, 0, 0, 0];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 4;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('かいぎしつ', () => {
      const reading = 'かいぎしつ';
      const pitchPattern = [0, 1, 1, 0, 0, 0];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 3;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('おとこのひと', () => {
      const reading = 'おとこのひと';
      const pitchPattern = [0, 1, 1, 1, 1, 1, 0];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 6;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });

    it('りょこうしゃ', () => {
      const reading = 'りょこうしゃ';
      const pitchPattern = [0, 0, 1, 0, 0, 0, 0];
      const actual = getPitchNumFromPattern(reading, pitchPattern, true);
      const expected = 2;
      expect(actual).toEqual(expected);
      expect(makePitchPattern(getMoraCount(reading), actual)).toEqual(
        removeDigraphPitches(reading, pitchPattern)
      );
    });
  });
});
