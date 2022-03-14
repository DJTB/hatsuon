import { getMorae, makePitchPattern, getPitchPatternName } from './utils';

export {
  isDigraph,
  getMorae,
  getMoraCount,
  makePitchPattern,
  getPitchPatternName,
  getPitchNumFromPattern,
} from './utils';

/**
 * Returns pitch accent information for the provided word and pitch number
 *
 * @module
 * @param {string} [reading=''] Japanese word represented in kana
 * @param {number} [pitchNum=-1] pitch number
 * @returns {object} pitch data
 */
export function hatsuon({ reading = '', pitchNum = -1, locale = 'JA' } = {}) {
  const morae = getMorae(reading);

  return {
    reading,
    morae,
    pitchNum,
    pattern: makePitchPattern(morae.length, pitchNum),
    patternName: getPitchPatternName(morae.length, pitchNum, locale),
  };
}
