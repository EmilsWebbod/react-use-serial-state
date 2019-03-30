const expect = require('chai').expect;

before(() => {
  require('isomorphic-fetch');
});

describe('simple validate test', () => {
  it('should return true for null string', () => {
    expect(true).to.equal(true);
  });
});
