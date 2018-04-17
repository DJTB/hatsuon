import hatsuon from './index';

describe('hatsuon()', () => {
  it('sane default', () =>
    expect(hatsuon()).toEqual({
      reading: '',
      pitchNum: -1,
      morae: [],
      pattern: [],
      patternName: '不詳',
    }));
  it('works', () => {
    expect(hatsuon({ reading: 'よみかた', pitchNum: 3 })).toEqual({
      reading: 'よみかた',
      pitchNum: 3,
      morae: ['よ', 'み', 'か', 'た'],
      pattern: [0, 1, 1, 0, 0],
      patternName: '中高',
    });
    expect(hatsuon({ reading: 'とっきゅう', pitchNum: 0 })).toEqual({
      reading: 'とっきゅう',
      pitchNum: 0,
      morae: ['と', 'っ', 'きゅ', 'う'],
      pattern: [0, 1, 1, 1, 1],
      patternName: '平板',
    });
  });
});
