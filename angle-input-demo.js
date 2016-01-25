
var input = document.querySelector('.plain-angle-input');
var outlet = document.querySelector('.plain-angle-outlet');

var angle = AngleInput(input);
  
input.oninput = function(e) {
  outlet.innerText = angle()+"deg";
}

input.onchange = function(e) {
  outlet.innerHTML = "<b>"+angle()+"deg</b>";
}

