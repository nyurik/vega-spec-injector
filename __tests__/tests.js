import VSI from '../src/index';

describe('addToList', () => {
  it('empty', () => {
    const spec = {};
    const result = new VSI().addToList(spec, `signals`, []);
    expect(spec).toBe(result);
    expect(spec.signals).toBeDefined();
    expect(spec.signals).toEqual([]);
  });

  it('empty signals', () => {
    const signals = [];
    const spec = {signals: signals};
    const result = new VSI().addToList(spec, `signals`, []);
    expect(spec).toBe(result);
    expect(spec.signals).toBeDefined();
    expect(spec.signals).toBe(signals);
  });

  it('add new', () => {
    const spec = {};
    const result = new VSI().addToList(spec, `signals`, [`sig`]);
    expect(spec).toBe(result);
    expect(spec.signals).toBeDefined();
    expect(spec.signals).toEqual([{name: `sig`}]);
  });

  it('add new to empty array', () => {
    const signals = [];
    const spec = {signals: signals};
    const result = new VSI().addToList(spec, `signals`, []);
    expect(spec).toBe(result);
    expect(spec.signals).toBeDefined();
    expect(spec.signals).toBe(signals);
  });

  it('no new sig', () => {
    const signals = [{name: `sig`}];
    const spec = {signals: signals};
    const result = new VSI().addToList(spec, `signals`, []);
    expect(spec).toBe(result);
    expect(spec.signals).toEqual([{name: `sig`}]);
  });

  it('same as defined', () => {
    const signals = [{name: `sig`, v: 1}];
    const spec = {signals: signals};
    const result = new VSI().addToList(spec, `signals`, [`sig`]);
    expect(spec).toBe(result);
    expect(spec.signals).toBeDefined();
    expect(spec.signals).toEqual([{name: `sig`, v: 1}]);
  });

  it('add new to existing', () => {
    const signals = [{name: `sig`, v: 1}];
    const spec = {signals: signals};
    const result = new VSI().addToList(spec, `signals`, [`sig2`]);
    expect(spec).toBe(result);
    expect(spec.signals).toBeDefined();
    expect(spec.signals).toEqual([{name: `sig`, v: 1}, {name: `sig2`}]);
  });

  it('add new obj to existing', () => {
    const spec = {signals: [{name: `sig`, v: 1}]};
    const result = new VSI().addToList(spec, `signals`, [{name:`sig2`}]);
    expect(spec).toBe(result);
    expect(spec.signals).toBeDefined();
    expect(spec.signals).toEqual([{name: `sig`, v: 1}, {name: `sig2`}]);
  });

  it('add multiple new obj to existing', () => {
    const spec = {signals: [{name: `sig`, v: 1}]};
    const result = new VSI().addToList(spec, `signals`, [{name: `sig2`, v: 2}, `sig3`]);
    expect(spec).toBe(result);
    expect(spec.signals).toBeDefined();
    expect(spec.signals).toEqual([{name: `sig`, v: 1}, {name: `sig2`, v: 2}, {name: `sig3`}]);
  });

});

describe('overrideField', () => {
  it('new', () => {
    const spec = {};
    const result = new VSI().overrideField(spec, `key`, `val`);
    expect(spec).toBe(result);
    expect(spec.key).toBe(`val`);
  });

  it('override', () => {
    let warn = ``;
    const vsi = new VSI(m => {
      warn = m
    });
    const spec = {key: `abc`};
    vsi.overrideField(spec, `key`, `abc`);
    expect(spec.key).toBe(`abc`);
    expect(warn).toBe(``);
    vsi.overrideField(spec, `key`, `xyz`);
    expect(spec.key).toBe(`xyz`);
    expect(warn).toBe(`Overriding key: abc 𐃘 xyz`);
  });
});

describe('findUndefined', () => {
  it('new section', () => {
    const spec = {};
    const result = new VSI().findUndefined(spec, `section`, [`val`]);
    expect(result).toEqual(['val']);
    expect(spec).toEqual({section: []});
  });

  it('find partially existing', () => {
    const spec = {section:[{name: `a`}, {name: `b`}, {}]};
    const result = new VSI().findUndefined(spec, `section`, [`a`, `val`]);
    expect(Array.from(result)).toEqual(['val']);
  });

  it('error on no array section', () => {
    const spec = {section:{}};
    expect(() => new VSI().findUndefined(spec, `section`, [`val`])).toThrowError(`spec.section must be an array`);
  });
});
