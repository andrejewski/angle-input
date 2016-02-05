
(function() {

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

  function accessible(container) {
    if(container.tabIndex === -1) container.tabIndex = 0;
  }

  function fireEvent(element, name, rawEvent) {
    if ("createEvent" in document) {
      var event = document.createEvent("HTMLEvents");
      event.initEvent(name, false, true);
      event.raw = rawEvent;
      element.dispatchEvent(event);
    } else {
      var event = document.createEventObject();
      event.raw = rawEvent;
      element.fireEvent("on"+name, event);
    }
  }

  function angleFormInput(container) {
    var input = container.querySelector('input');
    if(!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      container.appendChild(input);
    }
    return input;
  }

  function anglePivotElem(container) {
    var pivot = container.querySelector('.pivot');
    if(!pivot) {
      pivot = document.createElement('span');
      pivot.className = 'angle-input-pivot';
      container.appendChild(pivot);
    }
    return pivot;
  }

  var defaults = {
    max: 360,
    min: 0,
    step: 1,
    name: 'angle'
  };

  function lookup(dicts) {
    return function _lookup(key) {
      for(var i = 0; i < dicts.length; i++) {
        var val = dicts[i][key];
        if(val !== undefined) return val;
      }
    }
  }

  function AngleInput($dom, options) {
    var key = lookup([$dom.dataset, options || {}, defaults]);
    var max = +key('max');
    var min = +key('min');
    var step = +key('step');
    var name = key('name');
    var value = normalize(min);

    accessible($dom);

    var $input = angleFormInput($dom);
    $input.name = name;
    
    var $pivot = anglePivotElem($dom);

    function normalize(degree) {
      var n = Math.max(min, Math.min(degree, max));
      var s = n - (n % step);
      var high = Math.ceil(n / step);
      var low = Math.round(n / step);
      return high >= (n / step)
        ? (high * step == 360) ? 0 : (high * step)
        : low * step;
    }
    
    function updateView() {
      $pivot.style.transform = "rotate(-"+value+"deg)";
      $input.value = value;
    }

    function updateWithEvent(event, done) {
      var vector = [event.x, event.y];
      var deg = angle(vector, $dom);
      value = normalize(deg);
      updateView();

      fireEvent($dom, done ? 'change' : 'input', event);
    }

    function beginKeyboardInput() {
      var $all = document.body;

      function endKeyboardInput(e) {
        $all.removeEventListener('keydown', keyboardInput, false);
        $dom.removeEventListener('blur', endKeyboardInput, false);
      }

      var LEFT_ARROW  = 37;
      var UP_ARROW    = 38;
      var RIGHT_ARROW = 39;
      var DOWN_ARROW  = 40;

      function keyboardInput(e) {
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
        if(dir) {
          e.preventDefault();
          Angle(val);
        }
      }

      $all.addEventListener('keydown', keyboardInput, false);
      $dom.addEventListener('blur', endKeyboardInput, false);
    }

    function beginTracking(e) {
      var $all = document.body;

      function endTracking(e) {
        updateWithEvent(e, true);
        $all.removeEventListener('mousemove', duringTracking, false);
        $all.removeEventListener('mouseup', endTracking, false);
      }

      function duringTracking(e) {
        updateWithEvent(e);
      }

      $all.addEventListener('mousemove', duringTracking, false);
      $all.addEventListener('mouseup', endTracking, false);
    }

    function Angle(deg) {
      if(typeof deg === 'number') {
        value = normalize(deg);
        updateView();
        fireEvent($dom, 'change');
      }
      return value;
    }

    function attach() {
      $dom.addEventListener('focus', beginKeyboardInput, false);
      $dom.addEventListener('mousedown', beginTracking, false);
      return Angle;
    }

    function detach() {
      $dom.removeEventListener('focus', beginKeyboardInput, false);
      $dom.removeEventListener('mousedown', beginTracking, false);
      return Angle;
    }

    Angle.attach = attach;
    Angle.detach = detach;

    updateView();
    attach();
    return Angle;
  }

  if(typeof module !== 'undefined' && module.exports) {
    module.exports = AngleInput;
    try {
      var jQuery = require('jquery'); 
    } catch(error) {}
  } else {
    this.AngleInput = AngleInput;
  }

  if(typeof jQuery !== 'undefined' && jQuery.fn) {
    jQuery.fn.angleInput = function(options) {
      var $elems = $(this);
      $elems.each(function(index, $elem) {
        if(!$elem.angleDelegate) {
          $elem.angleDelegate = AngleInput($elem, options);
        }
      });
      return $elems;      
    }

    jQuery.angleInput = function($elems, options) {
      if(typeof $elems === 'number') {
        // assume being called by $.fn.each or $.fn.map
        // angleInput(index, elem)
        $elems = $(options);
        options = null;
      }
      var elem = $elems
        .angleInput(options)
        .get(0);
      if(elem) return elem.angleDelegate;
    }
  }

}).call(this);

