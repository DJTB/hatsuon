import hatsuon from './index';

describe('index.js', () => {
  it('should say something', () => {
    expect(hatsuon('🐰')).toEqual('👉 🐰 👈');
    expect(hatsuon()).toEqual('No args passed!');
  });
});
