/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *               Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
const identifierPairs = {
  element: 0,
  id: 1,
  class: 2,
  attribute: 3,
  pseudoClass: 4,
  pseudoElement: 5,
  defaultValue: -1,
};

class CssSelector {
  constructor({
    tag,
    identifier,
    classes,
    attributes,
    pseudoClasses,
    pseudoElem,
    previousCallIdentifier,
  }) {
    this.tag = tag;
    this.identifier = identifier;
    this.classes = classes;
    this.attributes = attributes;
    this.pseudoClasses = pseudoClasses;
    this.pseudoElem = pseudoElem;
    this.previousCallIdentifier = previousCallIdentifier;
  }

  element(element) {
    this.element = element; // Useless field. Except warnings of linter.
    if (this.previousCallIdentifier === identifierPairs.element) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    throw new Error(
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    );
  }

  id(id) {
    if (this.identifier.length !== 0) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    if (this.previousCallIdentifier > identifierPairs.id) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.previousCallIdentifier = identifierPairs.id;

    this.identifier = id;
    return this;
  }

  class(domClass) {
    if (this.previousCallIdentifier > identifierPairs.class) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.previousCallIdentifier = identifierPairs.class;

    this.classes.push(domClass);
    return this;
  }

  attr(attr) {
    if (this.previousCallIdentifier > identifierPairs.attribute) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.previousCallIdentifier = identifierPairs.attribute;

    this.attributes.push(attr);
    return this;
  }

  pseudoClass(psClass) {
    if (this.previousCallIdentifier > identifierPairs.pseudoClass) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.previousCallIdentifier = identifierPairs.pseudoClass;

    this.pseudoClasses.push(psClass);
    return this;
  }

  pseudoElement(psElement) {
    if (this.pseudoElem.length !== 0) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }

    this.previousCallIdentifier = identifierPairs.pseudoElement;

    this.pseudoElem = psElement;
    return this;
  }

  stringify() {
    const tagStr = this.tag.length === 0 ? '' : `${this.tag}`;

    const idStr = this.identifier.length === 0 ? '' : `#${this.identifier}`;

    const classesStr = this.classes.reduce(
      (str, domClass) => str.concat(`.${domClass}`),
      '',
    );

    const attributesStr = this.attributes.reduce(
      (str, attribute) => str.concat(`[${attribute}]`),
      '',
    );

    const pseudoClassesStr = this.pseudoClasses.reduce(
      (str, domPseudoClass) => str.concat(`:${domPseudoClass}`),
      '',
    );

    const pseudoElementStr = this.pseudoElem.length === 0 ? '' : `::${this.pseudoElem}`;

    return `${tagStr}${idStr}${classesStr}${attributesStr}${pseudoClassesStr}${pseudoElementStr}`;
  }
}

const cssSelectorBuilder = {

  element(tag) {
    return new CssSelector({
      tag,
      identifier: '',
      classes: [],
      attributes: [],
      pseudoClasses: [],
      pseudoElem: '',
      previousCallIdentifier: identifierPairs.element,
    });
  },

  id(identifier) {
    return new CssSelector({
      tag: '',
      identifier,
      classes: [],
      attributes: [],
      pseudoClasses: [],
      pseudoElem: '',
      previousCallIdentifier: identifierPairs.id,
    });
  },

  class(domClass) {
    return new CssSelector({
      tag: '',
      identifier: '',
      classes: [domClass],
      attributes: [],
      pseudoClasses: [],
      pseudoElem: '',
      previousCallIdentifier: identifierPairs.class,
    });
  },

  attr(value) {
    return new CssSelector({
      tag: '',
      identifier: '',
      classes: [],
      attributes: [value],
      pseudoClasses: [],
      pseudoElem: '',
      previousCallIdentifier: identifierPairs.attribute,
    });
  },

  pseudoClass(value) {
    return new CssSelector({
      tag: '',
      identifier: '',
      classes: [],
      attributes: [],
      pseudoClasses: [value],
      pseudoElem: '',
      previousCallIdentifier: identifierPairs.pseudoClass,
    });
  },

  pseudoElement(value) {
    return new CssSelector({
      tag: '',
      identifier: '',
      classes: [],
      attributes: [],
      pseudoClasses: [],
      pseudoElem: value,
      previousCallIdentifier: identifierPairs.pseudoElement,
    });
  },

  combine(selector1, combinator, selector2) {
    return {
      stringify: () => `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
    };
  },

  resetObject() {
    this.tag = '';
    this.identifier = '';
    this.classes = [];
    this.attributes = [];
    this.pseudoClasses = [];
    this.pseudoElem = '';
    this.previousCallIdentifier = identifierPairs.defaultValue;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
