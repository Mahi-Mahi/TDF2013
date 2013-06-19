// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
};

String.prototype.format_time = function(br, prefix) {
  var data = this.split(/(h|\'|\")/).map(function(a) {
    return a.trim();
  });

  var h = parseInt(data[0], 10);
  var m = parseInt(data[2], 10);
  var s = parseInt(data[4], 10);

  var res = '';
  if (h > 0)
    res += h + ' h';
  if (br)
    res += '<br />';
  if (m > 0)
    res += ' ' + m + ' min.'
  if (s > 0)
    res += ' ' + s + ' s'
  if (res.length) {
    return (prefix ? prefix : '') + res;
  }
  return '';
  // return this.replace('h', ' h').replace("'", ' min.').replace('"', " s");
};

// EXTEND JQUERY SCROLLTO
jQuery.fn.extend({
    scrollTo : function(speed, easing) {
        return this.each(function() {
            var targetOffset = jQuery(this).offset().top;
            jQuery("html,body").animate({scrollTop: targetOffset}, speed, easing);
        });
    }
});


(function(){

    var matcher = /\s*(?:((?:(?:\\\.|[^.,])+\.?)+)\s*([!~><=]=|[><])\s*("|')?((?:\\\3|.)*?)\3|(.+?))\s*(?:,|$)/g;

    function resolve(element, data) {

        data = data.match(/(?:\\\.|[^.])+(?=\.|$)/g);

        var cur = jQuery.data(element)[data.shift()];

        while (cur && data[0]) {
            cur = cur[data.shift()];
        }

        return cur || undefined;

    }

    jQuery.expr[':'].data = function(el, i, match) {

        matcher.lastIndex = 0;

        var expr = match[3],
            m,
            check, val,
            allMatch = null,
            foundMatch = false;

        while (m = matcher.exec(expr)) {

            check = m[4];
            val = resolve(el, m[1] || m[5]);

            switch (m[2]) {
                case '==': foundMatch = val == check; break;
                case '!=': foundMatch = val != check; break;
                case '<=': foundMatch = val <= check; break;
                case '>=': foundMatch = val >= check; break;
                case '~=': foundMatch = RegExp(check).test(val); break;
                case '>': foundMatch = val > check; break;
                case '<': foundMatch = val < check; break;
                default: if (m[5]) foundMatch = !!val;
            }

            allMatch = allMatch === null ? foundMatch : allMatch && foundMatch;

        }

        return allMatch;

    };

}());

