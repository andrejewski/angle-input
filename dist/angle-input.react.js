
(function() {
  
  var React = this.React || React;
  if(typeof React === 'undefined') {
    var React = require('react');
  }

  var r = React.createElement;

  function radToDeg(rad) {
    return rad * (180/Math.PI);
  }

  function getCenter(element) {
    var rect = element.getBoundingClientRect();
    return [
      rect.left + (rect.width / 2),
      rect.top + (rect.height / 2),
    ];
  }

  function angle(vector, element) {
    var center = getCenter(element);
    var x = vector[0] - center[0];
    var y = vector[1] - center[1];
    var deg = radToDeg(Math.atan2(x, y));
    deg -= 90;
    if(deg < 0) deg += 360;
    return deg;
  }

  var $all = document.body;

  var AngleInput = React.createClass({
    displayName: 'AngleInput',
    propTypes: {
      defaultValue: React.PropTypes.number,
      max: React.PropTypes.number,
      min: React.PropTypes.number,
      step: React.PropTypes.number,
      onChange: React.PropTypes.func,
      onInput: React.PropTypes.func,

      className: React.PropTypes.string,
      pivotClassName: React.PropTypes.string,
    },
    getDefaultProps: function() {
      return {
        defaultValue: 0,
        max: 360,
        min: 0,
        step: 1,

        className: 'angle-input',
        pivotClassName: 'angle-input-pivot',
      }
    },
    getInitialState: function() {
      return {value: this.props.defaultValue || 0};
    },
    normalize: function(degree) {
      var max = this.props.max;
      var min = this.props.min;
      var step = this.props.step || 1;
      var n = Math.max(min, Math.min(degree, max));
      var s = n - (n % step);
      var high = Math.ceil(n / step);
      var low = Math.round(n / step);
      return high >= (n / step)
        ? (high * step == 360) ? 0 : (high * step)
        : low * step;
    },
    _onFocus: function(e) {
      this.beginKeyboardInput();
    },
    _onBlur: function(e) {
      this.endKeyboardInput();
    },
    _onKeyDown: function(e) {
      var max = this.props.max;
      var min = this.props.min;
      var step = this.props.step || 1;
      var value = this.state.value;

      var LEFT_ARROW  = 37;
      var UP_ARROW    = 38;
      var RIGHT_ARROW = 39;
      var DOWN_ARROW  = 40;

      var dir = 0;
      switch(e.keyCode) {
        case UP_ARROW:
        case RIGHT_ARROW:
          dir = 1;
          break; 
        case DOWN_ARROW:
        case LEFT_ARROW:
          dir = -1;
          break;
      }
      var val = value + (dir * step);
      if(val === max + 1) val = min;
      if(val === min - 1) val = max - 1;
      val = this.normalize(val); 
      if(dir) {
        e.preventDefault();
        this.setState({value: val});
        if(this.props.onChange) {
          this.props.onChange(val);
        }
      }
    },
    _onMouseDown: function(e) {
      this.beginTracking();
    },
    _onMouseMove: function(e) {
      this.updateWithEvent(e, false);
    },
    _onMouseUp: function(e) {
      this.updateWithEvent(e, true);
      this.endTracking();
    },
    beginTracking: function() {
      $all.addEventListener('mousemove', this._onMouseMove, false);
      $all.addEventListener('mouseup', this._onMouseUp, false);
      this.tracking = true;
    },
    endTracking: function() {
      $all.removeEventListener('mousemove', this._onMouseMove, false);
      $all.removeEventListener('mouseup', this._onMouseUp, false);
      this.tracking = false;
    },
    updateWithEvent: function(event, done) {
      var $dom = this.refs.container;
      var vector = [event.x, event.y];
      var deg = angle(vector, $dom);
      var value = this.normalize(deg);
      this.setState({value: value});
      var fx = done
        ? this.props.onChange
        : this.props.onInput;
      if(fx) fx(value);
    },
    beginKeyboardInput: function() {
      $all.addEventListener('keydown', this._onKeyDown, false);
      this.keyboardInput = true;
    },
    endKeyboardInput: function() {
      $all.removeEventListener('keydown', this._onKeyDown, false);
      this.keyboardInput = false;
    },
    render: function() {
      var className = this.props.className || 'angle-input';
      var pivotClassName = this.props.pivotClassName || 'angle-input-pivot';
      return r('div', {
        ref: 'container',
        className: className,
        onFocus: this._onFocus,
        onBlur: this._onBlur,
        onMouseDown: this._onMouseDown,
        tabIndex: this.props.tabIndex || 0,
      }, [r('span', {
        key: 'pivot',
        className: pivotClassName,
        style: {transform: "rotate(-"+this.state.value+"deg)"},
      })].concat(this.props.children || []));
    }
  });

  if(typeof module !== 'undefined' && module.exports) {
    module.exports = AngleInput;
  } else if (this.AngleInput) {
    this.ReactAngleInput = AngleInput;
  } else {
    this.AngleInput = AngleInput;
  }

}).call(this);

