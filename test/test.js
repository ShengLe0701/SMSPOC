import assert from 'assert';
import immutable from 'immutable';

describe('Equality operator', () => {
  it('Should return true if operands are equal', () => {
    const map = immutable.fromJS({ a: 1 });
    assert.strictEqual(true, map === map.set('a', 1));
  });
});
