
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

document.head = document.body

if (!Element.prototype.matches) {
  Element.prototype.matches = 
      Element.prototype.matchesSelector || 
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector || 
      Element.prototype.oMatchesSelector || 
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = document.body.querySelectorAll(s),
            i = matches.length;
        while (--i >= 0 && matches[i] !== this) {}
        return i > -1;            
      };
}

if (!Element.prototype.after) {
  Element.prototype.after = function () {
   var argArr = Array.prototype.slice.call(arguments),
       docFrag = document.createDocumentFragment();
       
   argArr.forEach(function (argItem) {
     var isNode = true // argItem instanceof Node;
     docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
   });
       
   this.parentNode.insertBefore(docFrag, this.nextSibling);
 }
}

if (!HTMLElement.prototype.focus) {
  HTMLElement.prototype.focus = function () {}
}
if (!Element.prototype.before) {
  Element.prototype.before = function () {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = true // argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.parentNode.insertBefore(docFrag, this);
}
}

Element.prototype.insertAdjacentElement = 
    function (position, element) {
       if (position === 'beforebegin') {
          this.before(element)
       } else if (position === 'afterend') {
          this.after(element)
       }
    }

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

