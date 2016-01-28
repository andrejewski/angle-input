# Angle Input

Angle Input is a UI component for entering an angle value. Angle Input aims to be the go-to component of its kind and currently has components that work for vanilla JavaScript, jQuery, and React.

```sh
npm install angle-input
```

## Usage

Usage depends on which environment Angle Input is used.

### Vanilla JavaScript Usage

```js
var AngleInput = require('angle-input');

// these are the defaults
var options = {
  max: 360,       // maximum value
  min: 0,         // minimum value
  step: 1,        // [min, min+step, ..., max]
  name: 'angle',  // used for <input name>
};

// elem should be a non-void element
// (i.e.) it can contain an <input/>
var elem = document.getElementById('my-angle-input');

// the element is bound to its angle options,
// and an [g/s]etter for the angle is returned.
var angle = AngleInput(elem, options);

var newAngle = 180;
var oldAngle = angle(); // get
angle(newAngle);        // set

// listen element events like you would
// for any standard input component.

// fired for only definitive value changes
elem.onchange = function(e) {
  // elem.addEventListener() and
  // elem.removeEventListener() also work.
}

// fired for every immediate value change
// similar to <input type='range'/>
elem.oninput = function(e) {
  // these events are synthetic
  // access the real events via the member e.raw
}
```

### jQuery Usage

jQuery does not deviate much from the Vanilla, jQuery integration is essentially two methods: 

- `jQuery.angleInput($ || DOMNode, [options])`
- `$($ || DOMNode).angleInput([options])`

The differences are very subtle. The former is used when you want to access the AngleInput [g/s]etter for **one** specific element. The latter is used when you want to chain the creation of AngleInput for **one or more** elements **and continue the chain with the elements** using other jQuery functions.

```js
var xetter = $.angleInput($('.single-input-angle'), options)
// ^ Note: you may create multiple Angle Inputs, but only
// the [g/s]etter for the first element is returned.

$('.angle-input')
  .angleInput(options)
  .addClass('default-angle-input')
  .on('change', updateAngleLabel);
```

To access the AngleInput [g/s]etters for multiple elements, use:

```js
var xetters = $(elements).map($.angleInput).get();
```

Event handling with jQuery is the same as with any other input, but only `change` and `input` events are fired. Also, jQuery's `$.val()` method does not work. Use `$.angleInput(elem)()` to access the angle value instead.

### React Usage

The React component of Angle Input is written in React-style and therefore is quite different than plain JavaScript.

```js
var AngleInput = require('angle-input/react');

var MyComponent = React.createClass({
  render: function() {
    return React.createElement(AngleInput, {
      // default props
      defaultValue: 0,
      max: 360,
      min: 0,
      step: 1,

      className: 'angle-input',
      pivotClassName: 'angle-input-pivot',
      onChange: function(newAngle) {},
      onInput: function(newAngle) {}
    });
  }
});
```

Note: The React component does not support form submission via a nested `<input>` tag. Instead a parent component must get this value from the component.

## Styling

Angle Input has a unified HTML representation so CSS written for a React input works for a plain JavaScript input. The markup, where `<x>` is any non-void tag, is as follows:

```
<x>
  <span><span/>
</x>
```

`<x>` is the **container** and `<span>` is the **pivot**, which rotates counter-clockwise relative to its container.

Using CSS `:after` and `:before` selectors, the styles of Angle Input are endless.

