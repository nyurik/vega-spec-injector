export default class {
  constructor(onWarning) {
    this.onWarning = onWarning || (console ? console.log : () => {
    });
  }

  /**
   * Add signals to a vega spec, or ignore if the signal is already defined.
   * @param {object} spec vega spec to modify and return
   * @param {<object|string>[]} signals
   * @return {object} returns the same spec object as passed in
   */
  addSignals(spec, signals) {
    const newSigs = new Map(signals.map(v => typeof v === `string` ? [v, {name: v}] : [v.name, v]));

    for (const sig of this.findUndefined(spec, `signals`, newSigs.keys())) {
      spec.signals.push(newSigs.get(sig));
    }
    return spec;
  }

  /**
   * Set a spec field, and warn if overriding an existing value in that field
   * @param {object} spec vega spec to modify and return
   * @param {string} key
   * @param {*} value
   * @return {object} returns the same spec object as passed in
   */
  overrideField(spec, key, value) {
    if (spec[key] && spec[key] !== value) {
      this.onWarning(`Overriding ${key}: ${spec[key]} 𐃘 ${value}`);
    }
    spec[key] = value;
    return spec;
  }

  /**
   * Find all names that are not defined in the spec's section. Creates section if missing.
   * @param {object} spec
   * @param {string} section
   * @param {Iterable.<string>} names
   * @return {Iterable.<string>}
   */
  findUndefined(spec, section, names) {
    if (!spec.hasOwnProperty(section)) {
      spec[section] = [];
      return names;
    } else if (!Array.isArray(spec[section])) {
      throw new Error(`spec.${section} must be an array`);
    }

    const nameStrings = new Set(names);
    for (const obj of spec[section]) {
      // If obj has a name field, delete that name from the names
      // Set will silently ignore delete() for undefined names
      if (obj.name) nameStrings.delete(obj.name);
    }

    return nameStrings;
  }
}
