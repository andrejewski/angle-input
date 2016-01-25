
// vanilla JavaScript
var input = document.querySelector('.plain-angle-input');
var outlet = document.querySelector('.plain-angle-outlet');

var angle = AngleInput(input);
  
input.oninput = function(e) {
  outlet.innerText = angle()+"deg";
}

input.onchange = function(e) {
  outlet.innerHTML = "<b>"+angle()+"deg</b>";
}

// React JavaScript
var r = React.createElement;
var root = document.getElementById('react-root');

var Page = React.createClass({
  getInitialState: function() {
    return {value: 0, changed: false};
  },
  onChange: function(value) {
    this.setState({value: value, changed: true});
  },
  onInput: function(value) {
    this.setState({value: value, changed: false});
  },
  render: function() {
    return r('div', {}, [
      r('h3', {key: 'h3'}, 'React'),
      r(ReactAngleInput, {
        key: 'angle',
        className: 'angle-input default-input',
        onChange: this.onChange,
        onInput: this.onInput,
        value: this.state.value,
      }),
      r('p', {key: 'p'}, this.state.changed
        ? r('b', {}, this.state.value + 'deg')
        : this.state.value + 'deg')
    ]);
  }
});

ReactDOM.render(r(Page, {}), root);

