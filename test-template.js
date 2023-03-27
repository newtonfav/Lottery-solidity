class Car {
  park() {
    return 'stopped!';
  }

  drive() {
    return 'vroom';
  }
}

let benz;

beforeEach(() => {
  benz = new Car();
});

describe('Car', () => {
  it('can park', () => {
    assert.equal(benz.park(), 'stopped!');
  });

  it('can drive', () => {
    assert.equal(benz.drive(), 'vroom');
  });
});
