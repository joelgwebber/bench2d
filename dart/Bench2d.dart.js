//  ********** Library dart:core **************
//  ********** Natives dart:core **************
function $throw(e) {
  // If e is not a value, we can use V8's captureStackTrace utility method.
  // TODO(jmesserly): capture the stack trace on other JS engines.
  if (e && (typeof e == 'object') && Error.captureStackTrace) {
    // TODO(jmesserly): this will clobber the e.stack property
    Error.captureStackTrace(e, $throw);
  }
  throw e;
}
Object.defineProperty(Object.prototype, '$index', { value: function(i) {
  var proto = Object.getPrototypeOf(this);
  if (proto !== Object) {
    proto.$index = function(i) { return this[i]; }
  }
  return this[i];
}, enumerable: false, writable: true, configurable: true});
Object.defineProperty(Array.prototype, '$index', { value: function(i) { 
  return this[i]; 
}, enumerable: false, writable: true, configurable: true});
Object.defineProperty(String.prototype, '$index', { value: function(i) { 
  return this[i]; 
}, enumerable: false, writable: true, configurable: true});
Object.defineProperty(Object.prototype, '$setindex', { value: function(i, value) {
  var proto = Object.getPrototypeOf(this);
  if (proto !== Object) {
    proto.$setindex = function(i, value) { return this[i] = value; }
  }
  return this[i] = value;
}, enumerable: false, writable: true, configurable: true});
Object.defineProperty(Array.prototype, '$setindex', { value: function(i, value) { 
  return this[i] = value; }, enumerable: false, writable: true, 
  configurable: true});
function $add(x, y) {
  return ((typeof(x) == 'number' && typeof(y) == 'number') ||
          (typeof(x) == 'string'))
    ? x + y : x.$add(y);
}
function $eq(x, y) {
  if (x == null) return y == null;
  return (typeof(x) == 'number' && typeof(y) == 'number') ||
         (typeof(x) == 'boolean' && typeof(y) == 'boolean') ||
         (typeof(x) == 'string' && typeof(y) == 'string')
    ? x == y : x.$eq(y);
}
// TODO(jimhug): Should this or should it not match equals?
Object.defineProperty(Object.prototype, '$eq', { value: function(other) { 
  return this === other;
}, enumerable: false, writable: true, configurable: true });
function $lt(x, y) {
  return (typeof(x) == 'number' && typeof(y) == 'number')
    ? x < y : x.$lt(y);
}
function $ne(x, y) {
  if (x == null) return y != null;
  return (typeof(x) == 'number' && typeof(y) == 'number') ||
         (typeof(x) == 'boolean' && typeof(y) == 'boolean') ||
         (typeof(x) == 'string' && typeof(y) == 'string')
    ? x != y : !x.$eq(y);
}
Object.defineProperty(Object.prototype, '$typeNameOf', { value: function() {
  if ((typeof(window) != 'undefined' && window.constructor.name == 'DOMWindow')
      || typeof(process) != 'undefined') { // fast-path for Chrome and Node
    return this.constructor.name;
  }
  var str = Object.prototype.toString.call(this);
  str = str.substring(8, str.length - 1);
  if (str == 'Window') {
    str = 'DOMWindow';
  } else if (str == 'Document') {
    str = 'HTMLDocument';
  }
  return str;
}, enumerable: false, writable: true, configurable: true});
Object.defineProperty(Object.prototype, "get$typeName", { value: Object.prototype.$typeNameOf, enumerable: false, writable: true, configurable: true});
// ********** Code for Object **************
Object.defineProperty(Object.prototype, "noSuchMethod", { value: function(name, args) {
  $throw(new NoSuchMethodException(this, name, args));
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(Object.prototype, "add$1", { value: function($0) {
  return this.noSuchMethod("add", [$0]);
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(Object.prototype, "initialize$0", { value: function() {
  return this.noSuchMethod("initialize", []);
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(Object.prototype, "setRange$3", { value: function($0, $1, $2) {
  return this.noSuchMethod("setRange", [$0, $1, $2]);
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(Object.prototype, "solveVelocityConstraints$1", { value: function($0) {
  return this.noSuchMethod("solveVelocityConstraints", [$0]);
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(Object.prototype, "start$0", { value: function() {
  return this.noSuchMethod("start", []);
}, enumerable: false, writable: true, configurable: true });
// ********** Code for Clock **************
function Clock() {}
Clock.now = function() {
  return new Date().getTime();
}
Clock.frequency = function() {
  return (1000);
}
// ********** Code for IndexOutOfRangeException **************
function IndexOutOfRangeException(_index) {
  this._index = _index;
}
IndexOutOfRangeException.prototype.toString = function() {
  return ("IndexOutOfRangeException: " + this._index);
}
// ********** Code for NoSuchMethodException **************
function NoSuchMethodException(_receiver, _functionName, _arguments) {
  this._receiver = _receiver;
  this._functionName = _functionName;
  this._arguments = _arguments;
}
NoSuchMethodException.prototype.toString = function() {
  var sb = new StringBufferImpl("");
  for (var i = (0);
   i < this._arguments.get$length(); i++) {
    if (i > (0)) {
      sb.add(", ");
    }
    sb.add(this._arguments.$index(i));
  }
  sb.add("]");
  return $add(("NoSuchMethodException - receiver: '" + this._receiver + "' "), ("function name: '" + this._functionName + "' arguments: [" + sb + "]"));
}
// ********** Code for IllegalArgumentException **************
function IllegalArgumentException(args) {
  this._args = args;
}
IllegalArgumentException.prototype.toString = function() {
  return ("Illegal argument(s): " + this._args);
}
// ********** Code for NoMoreElementsException **************
function NoMoreElementsException() {

}
NoMoreElementsException.prototype.toString = function() {
  return "NoMoreElementsException";
}
// ********** Code for EmptyQueueException **************
function EmptyQueueException() {

}
EmptyQueueException.prototype.toString = function() {
  return "EmptyQueueException";
}
// ********** Code for Expect **************
function Expect() {}
Expect.equals = function(expected, actual, reason) {
  if ($eq(expected, actual)) return;
  var msg = Expect._getMessage(reason);
  Expect._fail(("Expect.equals(expected: <" + expected + ">, actual: <" + actual + ">" + msg + ") fails."));
}
Expect._getMessage = function(reason) {
  return (reason == null) ? "" : (", '" + reason + "'");
}
Expect._fail = function(message) {
  $throw(new ExpectException(message));
}
// ********** Code for ExpectException **************
function ExpectException(message) {
  this.message = message;
}
ExpectException.prototype.toString = function() {
  return this.message;
}
// ********** Code for Math **************
Math.min = function(a, b) {
  if (a == b) return a;
    if (a < b) {
      if (isNaN(b)) return b;
      else return a;
    }
    if (isNaN(a)) return a;
    else return b;
}
Math.max = function(a, b) {
  return (a >= b) ? a : b;
}
// ********** Code for top level **************
function dart_core_print(obj) {
  return _print(obj);
}
function _print(obj) {
  if (typeof console == 'object') {
    if (obj) obj = obj.toString();
    console.log(obj);
  } else {
    write(obj);
    write('\n');
  }
}
//  ********** Library dart:coreimpl **************
// ********** Code for ListFactory **************
ListFactory = Array;
ListFactory.ListFactory$from$factory = function(other) {
  var list = [];
  for (var $$i = other.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    list.add$1(e);
  }
  return list;
}
Object.defineProperty(ListFactory.prototype, "get$length", { value: function() { return this.length; }, enumerable: false, writable: true, configurable: true });
Object.defineProperty(ListFactory.prototype, "set$length", { value: function(value) { return this.length = value; }, enumerable: false, writable: true, configurable: true });
Object.defineProperty(ListFactory.prototype, "add", { value: function(value) {
  this.push(value);
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(ListFactory.prototype, "clear", { value: function() {
  this.set$length((0));
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(ListFactory.prototype, "getRange", { value: function(start, length) {
  return this.slice(start, start + length);
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(ListFactory.prototype, "setRange", { value: function(start, length, from, startFrom) {
  if (length == (0)) return;
  if (length < (0)) $throw(new IllegalArgumentException("length is negative"));
  if (start < (0)) $throw(new IndexOutOfRangeException(start));
  var end = start + length;
  if (end > this.get$length()) $throw(new IndexOutOfRangeException(end));
  if (startFrom < (0)) $throw(new IndexOutOfRangeException(startFrom));
  var endFrom = startFrom + length;
  if (endFrom > from.get$length()) $throw(new IndexOutOfRangeException(endFrom));
  for (var i = (0);
   $lt(i, length); (i = $add(i, (1)))) this.$setindex($add(start, i), from.$index($add(startFrom, i)));
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(ListFactory.prototype, "isEmpty", { value: function() {
  return this.get$length() == (0);
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(ListFactory.prototype, "iterator", { value: function() {
  return new ListIterator(this);
}, enumerable: false, writable: true, configurable: true });
Object.defineProperty(ListFactory.prototype, "add$1", { value: ListFactory.prototype.add, enumerable: false, writable: true, configurable: true });
Object.defineProperty(ListFactory.prototype, "setRange$3", { value: function($0, $1, $2) {
  return this.setRange($0, $1, $2, (0));
}, enumerable: false, writable: true, configurable: true });
// ********** Code for ListIterator **************
function ListIterator(array) {
  this._dart_coreimpl_array = array;
  this._dart_coreimpl_pos = (0);
}
ListIterator.prototype.hasNext = function() {
  return this._dart_coreimpl_array.get$length() > this._dart_coreimpl_pos;
}
ListIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  return this._dart_coreimpl_array.$index(this._dart_coreimpl_pos++);
}
// ********** Code for NumImplementation **************
NumImplementation = Number;
NumImplementation.prototype.$negate = function() {
  'use strict'; return -this;
}
NumImplementation.prototype.isNaN = function() {
  'use strict'; return isNaN(this);
}
NumImplementation.prototype.isNegative = function() {
  'use strict'; return this == 0 ? (1 / this) < 0 : this < 0;
}
NumImplementation.prototype.abs = function() {
  'use strict'; return Math.abs(this);
}
NumImplementation.prototype.floor = function() {
  'use strict'; return Math.floor(this);
}
NumImplementation.prototype.toDouble = function() {
  'use strict'; return this + 0;
}
NumImplementation.prototype.compareTo = function(other) {
  var thisValue = this.toDouble();
  if (thisValue < other) {
    return (-1);
  }
  else if (thisValue > other) {
    return (1);
  }
  else if (thisValue == other) {
    if (thisValue == (0)) {
      var thisIsNegative = this.isNegative();
      var otherIsNegative = other.isNegative();
      if ($eq(thisIsNegative, otherIsNegative)) return (0);
      if (thisIsNegative) return (-1);
      return (1);
    }
    return (0);
  }
  else if (this.isNaN()) {
    if (other.isNaN()) {
      return (0);
    }
    return (1);
  }
  else {
    return (-1);
  }
}
// ********** Code for DoubleLinkedQueueEntry **************
function DoubleLinkedQueueEntry(e) {
  this._element = e;
}
DoubleLinkedQueueEntry.prototype._link = function(p, n) {
  this._next = n;
  this._previous = p;
  p._next = this;
  n._previous = this;
}
DoubleLinkedQueueEntry.prototype.append = function(e) {
  new DoubleLinkedQueueEntry(e)._link(this, this._next);
}
DoubleLinkedQueueEntry.prototype.prepend = function(e) {
  new DoubleLinkedQueueEntry(e)._link(this._previous, this);
}
DoubleLinkedQueueEntry.prototype.remove = function() {
  this._previous._next = this._next;
  this._next._previous = this._previous;
  this._next = null;
  this._previous = null;
  return this._element;
}
DoubleLinkedQueueEntry.prototype.get$element = function() {
  return this._element;
}
// ********** Code for DoubleLinkedQueueEntry_CircleContact **************
/** Implements extends for Dart classes on JavaScript prototypes. */
function $inherits(child, parent) {
  if (child.prototype.__proto__) {
    child.prototype.__proto__ = parent.prototype;
  } else {
    function tmp() {};
    tmp.prototype = parent.prototype;
    child.prototype = new tmp();
    child.prototype.constructor = child;
  }
}
$inherits(DoubleLinkedQueueEntry_CircleContact, DoubleLinkedQueueEntry);
function DoubleLinkedQueueEntry_CircleContact(e) {
  this._element = e;
}
// ********** Code for DoubleLinkedQueueEntry_DynamicTreeNode **************
$inherits(DoubleLinkedQueueEntry_DynamicTreeNode, DoubleLinkedQueueEntry);
function DoubleLinkedQueueEntry_DynamicTreeNode(e) {
  this._element = e;
}
// ********** Code for DoubleLinkedQueueEntry_PolygonAndCircleContact **************
$inherits(DoubleLinkedQueueEntry_PolygonAndCircleContact, DoubleLinkedQueueEntry);
function DoubleLinkedQueueEntry_PolygonAndCircleContact(e) {
  this._element = e;
}
// ********** Code for DoubleLinkedQueueEntry_PolygonContact **************
$inherits(DoubleLinkedQueueEntry_PolygonContact, DoubleLinkedQueueEntry);
function DoubleLinkedQueueEntry_PolygonContact(e) {
  this._element = e;
}
// ********** Code for _DoubleLinkedQueueEntrySentinel **************
$inherits(_DoubleLinkedQueueEntrySentinel, DoubleLinkedQueueEntry);
function _DoubleLinkedQueueEntrySentinel() {}
_DoubleLinkedQueueEntrySentinel.prototype.remove = function() {
  $throw(const$0000);
}
_DoubleLinkedQueueEntrySentinel.prototype.get$element = function() {
  $throw(const$0000);
}
// ********** Code for _DoubleLinkedQueueEntrySentinel_CircleContact **************
$inherits(_DoubleLinkedQueueEntrySentinel_CircleContact, _DoubleLinkedQueueEntrySentinel);
function _DoubleLinkedQueueEntrySentinel_CircleContact() {
  DoubleLinkedQueueEntry_CircleContact.call(this, null);
  this._link(this, this);
}
// ********** Code for _DoubleLinkedQueueEntrySentinel_DynamicTreeNode **************
$inherits(_DoubleLinkedQueueEntrySentinel_DynamicTreeNode, _DoubleLinkedQueueEntrySentinel);
function _DoubleLinkedQueueEntrySentinel_DynamicTreeNode() {
  DoubleLinkedQueueEntry_DynamicTreeNode.call(this, null);
  this._link(this, this);
}
// ********** Code for _DoubleLinkedQueueEntrySentinel_PolygonAndCircleContact **************
$inherits(_DoubleLinkedQueueEntrySentinel_PolygonAndCircleContact, _DoubleLinkedQueueEntrySentinel);
function _DoubleLinkedQueueEntrySentinel_PolygonAndCircleContact() {
  DoubleLinkedQueueEntry_PolygonAndCircleContact.call(this, null);
  this._link(this, this);
}
// ********** Code for _DoubleLinkedQueueEntrySentinel_PolygonContact **************
$inherits(_DoubleLinkedQueueEntrySentinel_PolygonContact, _DoubleLinkedQueueEntrySentinel);
function _DoubleLinkedQueueEntrySentinel_PolygonContact() {
  DoubleLinkedQueueEntry_PolygonContact.call(this, null);
  this._link(this, this);
}
// ********** Code for DoubleLinkedQueue **************
function DoubleLinkedQueue() {}
DoubleLinkedQueue.prototype.addLast = function(value) {
  this._sentinel.prepend(value);
}
DoubleLinkedQueue.prototype.addFirst = function(value) {
  this._sentinel.append(value);
}
DoubleLinkedQueue.prototype.add = function(value) {
  this.addLast(value);
}
DoubleLinkedQueue.prototype.removeFirst = function() {
  return this._sentinel._next.remove();
}
DoubleLinkedQueue.prototype.isEmpty = function() {
  return (this._sentinel._next == this._sentinel);
}
DoubleLinkedQueue.prototype.iterator = function() {
  return new _DoubleLinkedQueueIterator(this._sentinel);
}
DoubleLinkedQueue.prototype.add$1 = DoubleLinkedQueue.prototype.add;
// ********** Code for DoubleLinkedQueue_CircleContact **************
$inherits(DoubleLinkedQueue_CircleContact, DoubleLinkedQueue);
function DoubleLinkedQueue_CircleContact() {
  this._sentinel = new _DoubleLinkedQueueEntrySentinel_CircleContact();
}
// ********** Code for DoubleLinkedQueue_DynamicTreeNode **************
$inherits(DoubleLinkedQueue_DynamicTreeNode, DoubleLinkedQueue);
function DoubleLinkedQueue_DynamicTreeNode() {
  this._sentinel = new _DoubleLinkedQueueEntrySentinel_DynamicTreeNode();
}
// ********** Code for DoubleLinkedQueue_PolygonAndCircleContact **************
$inherits(DoubleLinkedQueue_PolygonAndCircleContact, DoubleLinkedQueue);
function DoubleLinkedQueue_PolygonAndCircleContact() {
  this._sentinel = new _DoubleLinkedQueueEntrySentinel_PolygonAndCircleContact();
}
// ********** Code for DoubleLinkedQueue_PolygonContact **************
$inherits(DoubleLinkedQueue_PolygonContact, DoubleLinkedQueue);
function DoubleLinkedQueue_PolygonContact() {
  this._sentinel = new _DoubleLinkedQueueEntrySentinel_PolygonContact();
}
// ********** Code for _DoubleLinkedQueueIterator **************
function _DoubleLinkedQueueIterator(_sentinel) {
  this._sentinel = _sentinel;
  this._currentEntry = this._sentinel;
}
_DoubleLinkedQueueIterator.prototype.hasNext = function() {
  return this._currentEntry._next != this._sentinel;
}
_DoubleLinkedQueueIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  this._currentEntry = this._currentEntry._next;
  return this._currentEntry.get$element();
}
// ********** Code for StopwatchImplementation **************
function StopwatchImplementation() {
  this._start = null;
  this._stop = null;
}
StopwatchImplementation.prototype.start = function() {
  if (this._start == null) {
    this._start = Clock.now();
  }
  else {
    if (this._stop == null) {
      return;
    }
    this._start = Clock.now() - (this._stop - this._start);
  }
}
StopwatchImplementation.prototype.stop = function() {
  if (this._start == null) {
    return;
  }
  this._stop = Clock.now();
}
StopwatchImplementation.prototype.elapsed = function() {
  if (this._start == null) {
    return (0);
  }
  return (this._stop == null) ? (Clock.now() - this._start) : (this._stop - this._start);
}
StopwatchImplementation.prototype.frequency = function() {
  return Clock.frequency();
}
StopwatchImplementation.prototype.start$0 = StopwatchImplementation.prototype.start;
// ********** Code for StringBufferImpl **************
function StringBufferImpl(content) {
  this.clear();
  this.add(content);
}
StringBufferImpl.prototype.add = function(obj) {
  var str = obj.toString();
  if (str == null || str.isEmpty()) return this;
  this._buffer.add(str);
  this._dart_coreimpl_length = this._dart_coreimpl_length + str.length;
  return this;
}
StringBufferImpl.prototype.clear = function() {
  this._buffer = new Array();
  this._dart_coreimpl_length = (0);
  return this;
}
StringBufferImpl.prototype.toString = function() {
  if (this._buffer.get$length() == (0)) return "";
  if (this._buffer.get$length() == (1)) return this._buffer[(0)];
  var result = StringBase.concatAll(this._buffer);
  this._buffer.clear();
  this._buffer.add(result);
  return result;
}
StringBufferImpl.prototype.add$1 = StringBufferImpl.prototype.add;
// ********** Code for StringBase **************
function StringBase() {}
StringBase.join = function(strings, separator) {
  if (strings.get$length() == (0)) return "";
  var s = strings[(0)];
  for (var i = (1);
   i < strings.get$length(); i++) {
    s = $add($add(s, separator), strings[i]);
  }
  return s;
}
StringBase.concatAll = function(strings) {
  return StringBase.join(strings, "");
}
// ********** Code for StringImplementation **************
StringImplementation = String;
StringImplementation.prototype.isEmpty = function() {
  return this.length == (0);
}
StringImplementation.prototype.compareTo = function(other) {
  'use strict'; return this == other ? 0 : this < other ? -1 : 1;
}
// ********** Code for _Worker **************
var _Worker = {};
// ********** Code for top level **************
//  ********** Library dom **************
// ********** Code for dom_Window **************
var dom_Window = {};
// ********** Code for dom_AbstractWorker **************
var dom_AbstractWorker = {};
// ********** Code for dom_ArrayBuffer **************
var dom_ArrayBuffer = {};
// ********** Code for dom_ArrayBufferView **************
var dom_ArrayBufferView = {};
// ********** Code for dom_Attr **************
var dom_Attr = {};
// ********** Code for dom_AudioBuffer **************
var dom_AudioBuffer = {};
// ********** Code for dom_AudioBufferSourceNode **************
var dom_AudioBufferSourceNode = {};
// ********** Code for dom_AudioChannelMerger **************
var dom_AudioChannelMerger = {};
// ********** Code for dom_AudioChannelSplitter **************
var dom_AudioChannelSplitter = {};
// ********** Code for dom_AudioContext **************
var dom_AudioContext = {};
// ********** Code for dom_AudioDestinationNode **************
var dom_AudioDestinationNode = {};
// ********** Code for dom_AudioGain **************
var dom_AudioGain = {};
// ********** Code for dom_AudioGainNode **************
var dom_AudioGainNode = {};
// ********** Code for dom_AudioListener **************
var dom_AudioListener = {};
// ********** Code for dom_AudioNode **************
var dom_AudioNode = {};
// ********** Code for dom_AudioPannerNode **************
var dom_AudioPannerNode = {};
// ********** Code for dom_AudioParam **************
var dom_AudioParam = {};
// ********** Code for dom_AudioProcessingEvent **************
var dom_AudioProcessingEvent = {};
// ********** Code for dom_AudioSourceNode **************
var dom_AudioSourceNode = {};
// ********** Code for dom_BarInfo **************
var dom_BarInfo = {};
// ********** Code for dom_BeforeLoadEvent **************
var dom_BeforeLoadEvent = {};
// ********** Code for dom_BiquadFilterNode **************
var dom_BiquadFilterNode = {};
function $dynamic(name) {
  var f = Object.prototype[name];
  if (f && f.methods) return f.methods;

  var methods = {};
  if (f) methods.Object = f;
  function $dynamicBind() {
    // Find the target method
    var obj = this;
    var tag = obj.$typeNameOf();
    var method = methods[tag];
    if (!method) {
      var table = $dynamicMetadata;
      for (var i = 0; i < table.length; i++) {
        var entry = table[i];
        if (entry.map.hasOwnProperty(tag)) {
          method = methods[entry.tag];
          if (method) break;
        }
      }
    }
    method = method || methods.Object;
    var proto = Object.getPrototypeOf(obj);
    if (!proto.hasOwnProperty(name)) {
      Object.defineProperty(proto, name,
        { value: method, enumerable: false, writable: true, 
        configurable: true });
    }

    return method.apply(this, Array.prototype.slice.call(arguments));
  };
  $dynamicBind.methods = methods;
  Object.defineProperty(Object.prototype, name, { value: $dynamicBind,
      enumerable: false, writable: true, configurable: true});
  return methods;
}
if (typeof $dynamicMetadata == 'undefined') $dynamicMetadata = [];

function $dynamicSetMetadata(inputTable) {
  // TODO: Deal with light isolates.
  var table = [];
  for (var i = 0; i < inputTable.length; i++) {
    var tag = inputTable[i][0];
    var tags = inputTable[i][1];
    var map = {};
    var tagNames = tags.split('|');
    for (var j = 0; j < tagNames.length; j++) {
      map[tagNames[j]] = true;
    }
    table.push({tag: tag, tags: tags, map: map});
  }
  $dynamicMetadata = table;
}
$dynamic("get$type").BiquadFilterNode = function() {
  return this.type;
}
// ********** Code for dom_Blob **************
var dom_Blob = {};
$dynamic("get$type").Blob = function() {
  return this.type;
}
// ********** Code for dom_CDATASection **************
var dom_CDATASection = {};
// ********** Code for dom_CSSCharsetRule **************
var dom_CSSCharsetRule = {};
// ********** Code for dom_CSSFontFaceRule **************
var dom_CSSFontFaceRule = {};
// ********** Code for dom_CSSImportRule **************
var dom_CSSImportRule = {};
// ********** Code for dom_CSSMediaRule **************
var dom_CSSMediaRule = {};
// ********** Code for dom_CSSPageRule **************
var dom_CSSPageRule = {};
// ********** Code for dom_CSSPrimitiveValue **************
var dom_CSSPrimitiveValue = {};
// ********** Code for dom_CSSRule **************
var dom_CSSRule = {};
$dynamic("get$type").CSSRule = function() {
  return this.type;
}
// ********** Code for dom_CSSRuleList **************
var dom_CSSRuleList = {};
// ********** Code for dom_CSSStyleDeclaration **************
var dom_CSSStyleDeclaration = {};
// ********** Code for dom_CSSStyleRule **************
var dom_CSSStyleRule = {};
// ********** Code for dom_CSSStyleSheet **************
var dom_CSSStyleSheet = {};
// ********** Code for dom_CSSUnknownRule **************
var dom_CSSUnknownRule = {};
// ********** Code for dom_CSSValue **************
var dom_CSSValue = {};
// ********** Code for dom_CSSValueList **************
var dom_CSSValueList = {};
// ********** Code for dom_CanvasGradient **************
var dom_CanvasGradient = {};
// ********** Code for dom_CanvasPattern **************
var dom_CanvasPattern = {};
// ********** Code for dom_CanvasPixelArray **************
var dom_CanvasPixelArray = {};
// ********** Code for dom_CanvasRenderingContext **************
var dom_CanvasRenderingContext = {};
// ********** Code for dom_CanvasRenderingContext2D **************
var dom_CanvasRenderingContext2D = {};
// ********** Code for dom_CharacterData **************
var dom_CharacterData = {};
// ********** Code for dom_ClientRect **************
var dom_ClientRect = {};
// ********** Code for dom_ClientRectList **************
var dom_ClientRectList = {};
// ********** Code for dom_Clipboard **************
var dom_Clipboard = {};
// ********** Code for dom_CloseEvent **************
var dom_CloseEvent = {};
// ********** Code for dom_Comment **************
var dom_Comment = {};
// ********** Code for dom_CompositionEvent **************
var dom_CompositionEvent = {};
// ********** Code for Console **************
Console = (typeof console == 'undefined' ? {} : console);
// ********** Code for dom_ConvolverNode **************
var dom_ConvolverNode = {};
// ********** Code for dom_Coordinates **************
var dom_Coordinates = {};
// ********** Code for dom_Counter **************
var dom_Counter = {};
// ********** Code for dom_Crypto **************
var dom_Crypto = {};
// ********** Code for dom_CustomEvent **************
var dom_CustomEvent = {};
// ********** Code for dom_DOMApplicationCache **************
var dom_DOMApplicationCache = {};
// ********** Code for dom_DOMException **************
var dom_DOMException = {};
// ********** Code for dom_DOMFileSystem **************
var dom_DOMFileSystem = {};
// ********** Code for dom_DOMFileSystemSync **************
var dom_DOMFileSystemSync = {};
// ********** Code for dom_DOMFormData **************
var dom_DOMFormData = {};
// ********** Code for dom_DOMImplementation **************
var dom_DOMImplementation = {};
// ********** Code for dom_DOMMimeType **************
var dom_DOMMimeType = {};
$dynamic("get$type").DOMMimeType = function() {
  return this.type;
}
// ********** Code for dom_DOMMimeTypeArray **************
var dom_DOMMimeTypeArray = {};
// ********** Code for dom_DOMParser **************
var dom_DOMParser = {};
// ********** Code for dom_DOMPlugin **************
var dom_DOMPlugin = {};
// ********** Code for dom_DOMPluginArray **************
var dom_DOMPluginArray = {};
// ********** Code for dom_DOMSelection **************
var dom_DOMSelection = {};
$dynamic("get$type").DOMSelection = function() {
  return this.type;
}
// ********** Code for dom_DOMSettableTokenList **************
var dom_DOMSettableTokenList = {};
// ********** Code for dom_DOMTokenList **************
var dom_DOMTokenList = {};
$dynamic("add$1").DOMTokenList = function($0) {
  return this.add($0);
};
// ********** Code for dom_DOMURL **************
var dom_DOMURL = {};
// ********** Code for dom_DOMWindow **************
var dom_DOMWindow = {};
// ********** Code for dom_DataTransferItem **************
var dom_DataTransferItem = {};
$dynamic("get$type").DataTransferItem = function() {
  return this.type;
}
// ********** Code for dom_DataTransferItemList **************
var dom_DataTransferItemList = {};
// ********** Code for dom_DataView **************
var dom_DataView = {};
// ********** Code for dom_Database **************
var dom_Database = {};
// ********** Code for dom_DatabaseSync **************
var dom_DatabaseSync = {};
// ********** Code for dom_DedicatedWorkerContext **************
var dom_DedicatedWorkerContext = {};
// ********** Code for dom_DelayNode **************
var dom_DelayNode = {};
// ********** Code for dom_DeviceMotionEvent **************
var dom_DeviceMotionEvent = {};
// ********** Code for dom_DeviceOrientationEvent **************
var dom_DeviceOrientationEvent = {};
// ********** Code for dom_DirectoryEntry **************
var dom_DirectoryEntry = {};
// ********** Code for dom_DirectoryEntrySync **************
var dom_DirectoryEntrySync = {};
// ********** Code for dom_DirectoryReader **************
var dom_DirectoryReader = {};
// ********** Code for dom_DirectoryReaderSync **************
var dom_DirectoryReaderSync = {};
// ********** Code for dom_Document **************
var dom_Document = {};
// ********** Code for dom_DocumentFragment **************
var dom_DocumentFragment = {};
// ********** Code for dom_DocumentType **************
var dom_DocumentType = {};
// ********** Code for dom_DynamicsCompressorNode **************
var dom_DynamicsCompressorNode = {};
// ********** Code for dom_Element **************
var dom_Element = {};
// ********** Code for dom_ElementTimeControl **************
var dom_ElementTimeControl = {};
// ********** Code for dom_ElementTraversal **************
var dom_ElementTraversal = {};
// ********** Code for dom_Entity **************
var dom_Entity = {};
// ********** Code for dom_EntityReference **************
var dom_EntityReference = {};
// ********** Code for dom_Entry **************
var dom_Entry = {};
// ********** Code for dom_EntryArray **************
var dom_EntryArray = {};
// ********** Code for dom_EntryArraySync **************
var dom_EntryArraySync = {};
// ********** Code for dom_EntrySync **************
var dom_EntrySync = {};
// ********** Code for dom_ErrorEvent **************
var dom_ErrorEvent = {};
// ********** Code for dom_Event **************
var dom_Event = {};
$dynamic("get$type").Event = function() {
  return this.type;
}
// ********** Code for dom_EventException **************
var dom_EventException = {};
// ********** Code for dom_EventSource **************
var dom_EventSource = {};
// ********** Code for dom_EventTarget **************
var dom_EventTarget = {};
// ********** Code for dom_File **************
var dom_File = {};
// ********** Code for dom_FileEntry **************
var dom_FileEntry = {};
// ********** Code for dom_FileEntrySync **************
var dom_FileEntrySync = {};
// ********** Code for dom_FileError **************
var dom_FileError = {};
// ********** Code for dom_FileException **************
var dom_FileException = {};
// ********** Code for dom_FileList **************
var dom_FileList = {};
// ********** Code for dom_FileReader **************
var dom_FileReader = {};
// ********** Code for dom_FileReaderSync **************
var dom_FileReaderSync = {};
// ********** Code for dom_FileWriter **************
var dom_FileWriter = {};
$dynamic("get$position").FileWriter = function() {
  return this.position;
}
// ********** Code for dom_FileWriterSync **************
var dom_FileWriterSync = {};
$dynamic("get$position").FileWriterSync = function() {
  return this.position;
}
// ********** Code for dom_Float32Array **************
var dom_Float32Array = {};
$dynamic("get$length").Float32Array = function() {
  return this.length;
}
// ********** Code for dom_Float64Array **************
var dom_Float64Array = {};
$dynamic("get$length").Float64Array = function() {
  return this.length;
}
// ********** Code for dom_Geolocation **************
var dom_Geolocation = {};
// ********** Code for dom_Geoposition **************
var dom_Geoposition = {};
// ********** Code for dom_HTMLAllCollection **************
var dom_HTMLAllCollection = {};
// ********** Code for dom_HTMLAnchorElement **************
var dom_HTMLAnchorElement = {};
$dynamic("set$shape").HTMLAnchorElement = function(value) {
  this.shape = value;
}
$dynamic("get$type").HTMLAnchorElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLAppletElement **************
var dom_HTMLAppletElement = {};
// ********** Code for dom_HTMLAreaElement **************
var dom_HTMLAreaElement = {};
$dynamic("set$shape").HTMLAreaElement = function(value) {
  this.shape = value;
}
// ********** Code for dom_HTMLAudioElement **************
var dom_HTMLAudioElement = {};
// ********** Code for dom_HTMLBRElement **************
var dom_HTMLBRElement = {};
// ********** Code for dom_HTMLBaseElement **************
var dom_HTMLBaseElement = {};
// ********** Code for dom_HTMLBaseFontElement **************
var dom_HTMLBaseFontElement = {};
// ********** Code for dom_HTMLBodyElement **************
var dom_HTMLBodyElement = {};
// ********** Code for dom_HTMLButtonElement **************
var dom_HTMLButtonElement = {};
$dynamic("get$type").HTMLButtonElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLCanvasElement **************
var dom_HTMLCanvasElement = {};
// ********** Code for dom_HTMLCollection **************
var dom_HTMLCollection = {};
$dynamic("$setindex").HTMLCollection = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
// ********** Code for dom_HTMLDListElement **************
var dom_HTMLDListElement = {};
// ********** Code for dom_HTMLDataListElement **************
var dom_HTMLDataListElement = {};
// ********** Code for dom_HTMLDetailsElement **************
var dom_HTMLDetailsElement = {};
// ********** Code for dom_HTMLDirectoryElement **************
var dom_HTMLDirectoryElement = {};
// ********** Code for dom_HTMLDivElement **************
var dom_HTMLDivElement = {};
// ********** Code for dom_HTMLDocument **************
var dom_HTMLDocument = {};
// ********** Code for dom_HTMLElement **************
var dom_HTMLElement = {};
// ********** Code for dom_HTMLEmbedElement **************
var dom_HTMLEmbedElement = {};
$dynamic("get$type").HTMLEmbedElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLFieldSetElement **************
var dom_HTMLFieldSetElement = {};
// ********** Code for dom_HTMLFontElement **************
var dom_HTMLFontElement = {};
// ********** Code for dom_HTMLFormElement **************
var dom_HTMLFormElement = {};
// ********** Code for dom_HTMLFrameElement **************
var dom_HTMLFrameElement = {};
// ********** Code for dom_HTMLFrameSetElement **************
var dom_HTMLFrameSetElement = {};
// ********** Code for dom_HTMLHRElement **************
var dom_HTMLHRElement = {};
// ********** Code for dom_HTMLHeadElement **************
var dom_HTMLHeadElement = {};
// ********** Code for dom_HTMLHeadingElement **************
var dom_HTMLHeadingElement = {};
// ********** Code for dom_HTMLHtmlElement **************
var dom_HTMLHtmlElement = {};
// ********** Code for dom_HTMLIFrameElement **************
var dom_HTMLIFrameElement = {};
// ********** Code for dom_HTMLImageElement **************
var dom_HTMLImageElement = {};
$dynamic("get$x").HTMLImageElement = function() {
  return this.x;
}
$dynamic("get$y").HTMLImageElement = function() {
  return this.y;
}
// ********** Code for dom_HTMLInputElement **************
var dom_HTMLInputElement = {};
$dynamic("get$type").HTMLInputElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLIsIndexElement **************
var dom_HTMLIsIndexElement = {};
// ********** Code for dom_HTMLKeygenElement **************
var dom_HTMLKeygenElement = {};
$dynamic("get$type").HTMLKeygenElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLLIElement **************
var dom_HTMLLIElement = {};
$dynamic("get$type").HTMLLIElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLLabelElement **************
var dom_HTMLLabelElement = {};
// ********** Code for dom_HTMLLegendElement **************
var dom_HTMLLegendElement = {};
// ********** Code for dom_HTMLLinkElement **************
var dom_HTMLLinkElement = {};
$dynamic("get$type").HTMLLinkElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLMapElement **************
var dom_HTMLMapElement = {};
// ********** Code for dom_HTMLMarqueeElement **************
var dom_HTMLMarqueeElement = {};
$dynamic("start$0").HTMLMarqueeElement = function() {
  return this.start();
};
// ********** Code for dom_HTMLMediaElement **************
var dom_HTMLMediaElement = {};
// ********** Code for dom_HTMLMenuElement **************
var dom_HTMLMenuElement = {};
// ********** Code for dom_HTMLMetaElement **************
var dom_HTMLMetaElement = {};
// ********** Code for dom_HTMLMeterElement **************
var dom_HTMLMeterElement = {};
// ********** Code for dom_HTMLModElement **************
var dom_HTMLModElement = {};
// ********** Code for dom_HTMLOListElement **************
var dom_HTMLOListElement = {};
$dynamic("get$type").HTMLOListElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLObjectElement **************
var dom_HTMLObjectElement = {};
$dynamic("get$type").HTMLObjectElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLOptGroupElement **************
var dom_HTMLOptGroupElement = {};
// ********** Code for dom_HTMLOptionElement **************
var dom_HTMLOptionElement = {};
// ********** Code for dom_HTMLOptionsCollection **************
var dom_HTMLOptionsCollection = {};
// ********** Code for dom_HTMLOutputElement **************
var dom_HTMLOutputElement = {};
$dynamic("get$type").HTMLOutputElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLParagraphElement **************
var dom_HTMLParagraphElement = {};
// ********** Code for dom_HTMLParamElement **************
var dom_HTMLParamElement = {};
$dynamic("get$type").HTMLParamElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLPreElement **************
var dom_HTMLPreElement = {};
// ********** Code for dom_HTMLProgressElement **************
var dom_HTMLProgressElement = {};
$dynamic("get$position").HTMLProgressElement = function() {
  return this.position;
}
// ********** Code for dom_HTMLPropertiesCollection **************
var dom_HTMLPropertiesCollection = {};
// ********** Code for dom_HTMLQuoteElement **************
var dom_HTMLQuoteElement = {};
// ********** Code for dom_HTMLScriptElement **************
var dom_HTMLScriptElement = {};
$dynamic("get$type").HTMLScriptElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLSelectElement **************
var dom_HTMLSelectElement = {};
$dynamic("get$type").HTMLSelectElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLSourceElement **************
var dom_HTMLSourceElement = {};
$dynamic("get$type").HTMLSourceElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLSpanElement **************
var dom_HTMLSpanElement = {};
// ********** Code for dom_HTMLStyleElement **************
var dom_HTMLStyleElement = {};
$dynamic("get$type").HTMLStyleElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLTableCaptionElement **************
var dom_HTMLTableCaptionElement = {};
// ********** Code for dom_HTMLTableCellElement **************
var dom_HTMLTableCellElement = {};
// ********** Code for dom_HTMLTableColElement **************
var dom_HTMLTableColElement = {};
// ********** Code for dom_HTMLTableElement **************
var dom_HTMLTableElement = {};
// ********** Code for dom_HTMLTableRowElement **************
var dom_HTMLTableRowElement = {};
// ********** Code for dom_HTMLTableSectionElement **************
var dom_HTMLTableSectionElement = {};
// ********** Code for dom_HTMLTextAreaElement **************
var dom_HTMLTextAreaElement = {};
$dynamic("get$type").HTMLTextAreaElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLTitleElement **************
var dom_HTMLTitleElement = {};
// ********** Code for dom_HTMLTrackElement **************
var dom_HTMLTrackElement = {};
// ********** Code for dom_HTMLUListElement **************
var dom_HTMLUListElement = {};
$dynamic("get$type").HTMLUListElement = function() {
  return this.type;
}
// ********** Code for dom_HTMLUnknownElement **************
var dom_HTMLUnknownElement = {};
// ********** Code for dom_HTMLVideoElement **************
var dom_HTMLVideoElement = {};
// ********** Code for dom_HashChangeEvent **************
var dom_HashChangeEvent = {};
// ********** Code for dom_HighPass2FilterNode **************
var dom_HighPass2FilterNode = {};
// ********** Code for dom_History **************
var dom_History = {};
// ********** Code for dom_IDBAny **************
var dom_IDBAny = {};
// ********** Code for dom_IDBCursor **************
var dom_IDBCursor = {};
// ********** Code for dom_IDBCursorWithValue **************
var dom_IDBCursorWithValue = {};
// ********** Code for dom_IDBDatabase **************
var dom_IDBDatabase = {};
// ********** Code for dom_IDBDatabaseError **************
var dom_IDBDatabaseError = {};
// ********** Code for dom_IDBDatabaseException **************
var dom_IDBDatabaseException = {};
// ********** Code for dom_IDBFactory **************
var dom_IDBFactory = {};
// ********** Code for dom_IDBIndex **************
var dom_IDBIndex = {};
// ********** Code for dom_IDBKey **************
var dom_IDBKey = {};
// ********** Code for dom_IDBKeyRange **************
var dom_IDBKeyRange = {};
// ********** Code for dom_IDBObjectStore **************
var dom_IDBObjectStore = {};
$dynamic("add$1").IDBObjectStore = function($0) {
  return this.add($0);
};
// ********** Code for dom_IDBRequest **************
var dom_IDBRequest = {};
// ********** Code for dom_IDBTransaction **************
var dom_IDBTransaction = {};
// ********** Code for dom_IDBVersionChangeEvent **************
var dom_IDBVersionChangeEvent = {};
// ********** Code for dom_IDBVersionChangeRequest **************
var dom_IDBVersionChangeRequest = {};
// ********** Code for dom_ImageData **************
var dom_ImageData = {};
// ********** Code for dom_InjectedScriptHost **************
var dom_InjectedScriptHost = {};
$dynamic("get$type").InjectedScriptHost = function() {
  return this.type.bind(this);
}
// ********** Code for dom_InspectorFrontendHost **************
var dom_InspectorFrontendHost = {};
// ********** Code for dom_Int16Array **************
var dom_Int16Array = {};
$dynamic("get$length").Int16Array = function() {
  return this.length;
}
// ********** Code for dom_Int32Array **************
var dom_Int32Array = {};
$dynamic("get$length").Int32Array = function() {
  return this.length;
}
// ********** Code for dom_Int8Array **************
var dom_Int8Array = {};
$dynamic("get$length").Int8Array = function() {
  return this.length;
}
// ********** Code for dom_JavaScriptAudioNode **************
var dom_JavaScriptAudioNode = {};
// ********** Code for dom_JavaScriptCallFrame **************
var dom_JavaScriptCallFrame = {};
$dynamic("get$type").JavaScriptCallFrame = function() {
  return this.type;
}
// ********** Code for dom_KeyboardEvent **************
var dom_KeyboardEvent = {};
// ********** Code for dom_Location **************
var dom_Location = {};
// ********** Code for dom_LowPass2FilterNode **************
var dom_LowPass2FilterNode = {};
// ********** Code for dom_MediaController **************
var dom_MediaController = {};
// ********** Code for dom_MediaElementAudioSourceNode **************
var dom_MediaElementAudioSourceNode = {};
// ********** Code for dom_MediaError **************
var dom_MediaError = {};
// ********** Code for dom_MediaList **************
var dom_MediaList = {};
$dynamic("$setindex").MediaList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
// ********** Code for dom_MediaQueryList **************
var dom_MediaQueryList = {};
// ********** Code for dom_MediaQueryListListener **************
var dom_MediaQueryListListener = {};
// ********** Code for dom_MemoryInfo **************
var dom_MemoryInfo = {};
// ********** Code for dom_MessageChannel **************
var dom_MessageChannel = {};
// ********** Code for dom_MessageEvent **************
var dom_MessageEvent = {};
// ********** Code for dom_MessagePort **************
var dom_MessagePort = {};
$dynamic("start$0").MessagePort = function() {
  return this.start();
};
// ********** Code for dom_Metadata **************
var dom_Metadata = {};
// ********** Code for dom_MouseEvent **************
var dom_MouseEvent = {};
$dynamic("get$x").MouseEvent = function() {
  return this.x;
}
$dynamic("get$y").MouseEvent = function() {
  return this.y;
}
// ********** Code for dom_MutationCallback **************
var dom_MutationCallback = {};
// ********** Code for dom_MutationEvent **************
var dom_MutationEvent = {};
// ********** Code for dom_MutationRecord **************
var dom_MutationRecord = {};
$dynamic("get$type").MutationRecord = function() {
  return this.type;
}
// ********** Code for dom_NamedNodeMap **************
var dom_NamedNodeMap = {};
$dynamic("$setindex").NamedNodeMap = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
// ********** Code for dom_Navigator **************
var dom_Navigator = {};
// ********** Code for dom_Node **************
var dom_Node = {};
// ********** Code for dom_NodeFilter **************
var dom_NodeFilter = {};
// ********** Code for dom_NodeIterator **************
var dom_NodeIterator = {};
// ********** Code for dom_NodeList **************
var dom_NodeList = {};
$dynamic("$setindex").NodeList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
// ********** Code for dom_NodeSelector **************
var dom_NodeSelector = {};
// ********** Code for dom_Notation **************
var dom_Notation = {};
// ********** Code for dom_Notification **************
var dom_Notification = {};
// ********** Code for dom_NotificationCenter **************
var dom_NotificationCenter = {};
// ********** Code for dom_OESStandardDerivatives **************
var dom_OESStandardDerivatives = {};
// ********** Code for dom_OESTextureFloat **************
var dom_OESTextureFloat = {};
// ********** Code for dom_OESVertexArrayObject **************
var dom_OESVertexArrayObject = {};
// ********** Code for dom_OfflineAudioCompletionEvent **************
var dom_OfflineAudioCompletionEvent = {};
// ********** Code for dom_OperationNotAllowedException **************
var dom_OperationNotAllowedException = {};
// ********** Code for dom_OverflowEvent **************
var dom_OverflowEvent = {};
// ********** Code for dom_PageTransitionEvent **************
var dom_PageTransitionEvent = {};
// ********** Code for dom_Performance **************
var dom_Performance = {};
// ********** Code for dom_PerformanceNavigation **************
var dom_PerformanceNavigation = {};
$dynamic("get$type").PerformanceNavigation = function() {
  return this.type;
}
// ********** Code for dom_PerformanceTiming **************
var dom_PerformanceTiming = {};
// ********** Code for dom_PointerLock **************
var dom_PointerLock = {};
// ********** Code for dom_PopStateEvent **************
var dom_PopStateEvent = {};
// ********** Code for dom_PositionError **************
var dom_PositionError = {};
// ********** Code for dom_ProcessingInstruction **************
var dom_ProcessingInstruction = {};
// ********** Code for dom_ProgressEvent **************
var dom_ProgressEvent = {};
// ********** Code for dom_RGBColor **************
var dom_RGBColor = {};
// ********** Code for dom_Range **************
var dom_Range = {};
// ********** Code for dom_RangeException **************
var dom_RangeException = {};
// ********** Code for dom_RealtimeAnalyserNode **************
var dom_RealtimeAnalyserNode = {};
// ********** Code for dom_Rect **************
var dom_Rect = {};
// ********** Code for dom_SQLError **************
var dom_SQLError = {};
// ********** Code for dom_SQLException **************
var dom_SQLException = {};
// ********** Code for dom_SQLResultSet **************
var dom_SQLResultSet = {};
// ********** Code for dom_SQLResultSetRowList **************
var dom_SQLResultSetRowList = {};
// ********** Code for dom_SQLTransaction **************
var dom_SQLTransaction = {};
// ********** Code for dom_SQLTransactionSync **************
var dom_SQLTransactionSync = {};
// ********** Code for dom_SVGAElement **************
var dom_SVGAElement = {};
// ********** Code for dom_SVGAltGlyphDefElement **************
var dom_SVGAltGlyphDefElement = {};
// ********** Code for dom_SVGAltGlyphElement **************
var dom_SVGAltGlyphElement = {};
// ********** Code for dom_SVGAltGlyphItemElement **************
var dom_SVGAltGlyphItemElement = {};
// ********** Code for dom_SVGAngle **************
var dom_SVGAngle = {};
// ********** Code for dom_SVGAnimateColorElement **************
var dom_SVGAnimateColorElement = {};
// ********** Code for dom_SVGAnimateElement **************
var dom_SVGAnimateElement = {};
// ********** Code for dom_SVGAnimateMotionElement **************
var dom_SVGAnimateMotionElement = {};
// ********** Code for dom_SVGAnimateTransformElement **************
var dom_SVGAnimateTransformElement = {};
// ********** Code for dom_SVGAnimatedAngle **************
var dom_SVGAnimatedAngle = {};
// ********** Code for dom_SVGAnimatedBoolean **************
var dom_SVGAnimatedBoolean = {};
// ********** Code for dom_SVGAnimatedEnumeration **************
var dom_SVGAnimatedEnumeration = {};
// ********** Code for dom_SVGAnimatedInteger **************
var dom_SVGAnimatedInteger = {};
// ********** Code for dom_SVGAnimatedLength **************
var dom_SVGAnimatedLength = {};
// ********** Code for dom_SVGAnimatedLengthList **************
var dom_SVGAnimatedLengthList = {};
// ********** Code for dom_SVGAnimatedNumber **************
var dom_SVGAnimatedNumber = {};
// ********** Code for dom_SVGAnimatedNumberList **************
var dom_SVGAnimatedNumberList = {};
// ********** Code for dom_SVGAnimatedPreserveAspectRatio **************
var dom_SVGAnimatedPreserveAspectRatio = {};
// ********** Code for dom_SVGAnimatedRect **************
var dom_SVGAnimatedRect = {};
// ********** Code for dom_SVGAnimatedString **************
var dom_SVGAnimatedString = {};
// ********** Code for dom_SVGAnimatedTransformList **************
var dom_SVGAnimatedTransformList = {};
// ********** Code for dom_SVGAnimationElement **************
var dom_SVGAnimationElement = {};
// ********** Code for dom_SVGCircleElement **************
var dom_SVGCircleElement = {};
// ********** Code for dom_SVGClipPathElement **************
var dom_SVGClipPathElement = {};
// ********** Code for dom_SVGColor **************
var dom_SVGColor = {};
// ********** Code for dom_SVGComponentTransferFunctionElement **************
var dom_SVGComponentTransferFunctionElement = {};
$dynamic("get$type").SVGComponentTransferFunctionElement = function() {
  return this.type;
}
// ********** Code for dom_SVGCursorElement **************
var dom_SVGCursorElement = {};
$dynamic("get$x").SVGCursorElement = function() {
  return this.x;
}
$dynamic("get$y").SVGCursorElement = function() {
  return this.y;
}
// ********** Code for dom_SVGDefsElement **************
var dom_SVGDefsElement = {};
// ********** Code for dom_SVGDescElement **************
var dom_SVGDescElement = {};
// ********** Code for dom_SVGDocument **************
var dom_SVGDocument = {};
// ********** Code for dom_SVGElement **************
var dom_SVGElement = {};
// ********** Code for dom_SVGElementInstance **************
var dom_SVGElementInstance = {};
// ********** Code for dom_SVGElementInstanceList **************
var dom_SVGElementInstanceList = {};
// ********** Code for dom_SVGEllipseElement **************
var dom_SVGEllipseElement = {};
// ********** Code for dom_SVGException **************
var dom_SVGException = {};
// ********** Code for dom_SVGExternalResourcesRequired **************
var dom_SVGExternalResourcesRequired = {};
// ********** Code for dom_SVGFEBlendElement **************
var dom_SVGFEBlendElement = {};
$dynamic("get$x").SVGFEBlendElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEBlendElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEColorMatrixElement **************
var dom_SVGFEColorMatrixElement = {};
$dynamic("get$type").SVGFEColorMatrixElement = function() {
  return this.type;
}
$dynamic("get$x").SVGFEColorMatrixElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEColorMatrixElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEComponentTransferElement **************
var dom_SVGFEComponentTransferElement = {};
$dynamic("get$x").SVGFEComponentTransferElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEComponentTransferElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFECompositeElement **************
var dom_SVGFECompositeElement = {};
$dynamic("get$x").SVGFECompositeElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFECompositeElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEConvolveMatrixElement **************
var dom_SVGFEConvolveMatrixElement = {};
$dynamic("get$x").SVGFEConvolveMatrixElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEConvolveMatrixElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEDiffuseLightingElement **************
var dom_SVGFEDiffuseLightingElement = {};
$dynamic("get$x").SVGFEDiffuseLightingElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEDiffuseLightingElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEDisplacementMapElement **************
var dom_SVGFEDisplacementMapElement = {};
$dynamic("get$x").SVGFEDisplacementMapElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEDisplacementMapElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEDistantLightElement **************
var dom_SVGFEDistantLightElement = {};
// ********** Code for dom_SVGFEDropShadowElement **************
var dom_SVGFEDropShadowElement = {};
$dynamic("get$x").SVGFEDropShadowElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEDropShadowElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEFloodElement **************
var dom_SVGFEFloodElement = {};
$dynamic("get$x").SVGFEFloodElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEFloodElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEFuncAElement **************
var dom_SVGFEFuncAElement = {};
// ********** Code for dom_SVGFEFuncBElement **************
var dom_SVGFEFuncBElement = {};
// ********** Code for dom_SVGFEFuncGElement **************
var dom_SVGFEFuncGElement = {};
// ********** Code for dom_SVGFEFuncRElement **************
var dom_SVGFEFuncRElement = {};
// ********** Code for dom_SVGFEGaussianBlurElement **************
var dom_SVGFEGaussianBlurElement = {};
$dynamic("get$x").SVGFEGaussianBlurElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEGaussianBlurElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEImageElement **************
var dom_SVGFEImageElement = {};
$dynamic("get$x").SVGFEImageElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEImageElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEMergeElement **************
var dom_SVGFEMergeElement = {};
$dynamic("get$x").SVGFEMergeElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEMergeElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEMergeNodeElement **************
var dom_SVGFEMergeNodeElement = {};
// ********** Code for dom_SVGFEMorphologyElement **************
var dom_SVGFEMorphologyElement = {};
$dynamic("get$x").SVGFEMorphologyElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEMorphologyElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEOffsetElement **************
var dom_SVGFEOffsetElement = {};
$dynamic("get$x").SVGFEOffsetElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEOffsetElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFEPointLightElement **************
var dom_SVGFEPointLightElement = {};
$dynamic("get$x").SVGFEPointLightElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFEPointLightElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFESpecularLightingElement **************
var dom_SVGFESpecularLightingElement = {};
$dynamic("get$x").SVGFESpecularLightingElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFESpecularLightingElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFESpotLightElement **************
var dom_SVGFESpotLightElement = {};
$dynamic("get$x").SVGFESpotLightElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFESpotLightElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFETileElement **************
var dom_SVGFETileElement = {};
$dynamic("get$x").SVGFETileElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFETileElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFETurbulenceElement **************
var dom_SVGFETurbulenceElement = {};
$dynamic("get$type").SVGFETurbulenceElement = function() {
  return this.type;
}
$dynamic("get$x").SVGFETurbulenceElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFETurbulenceElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFilterElement **************
var dom_SVGFilterElement = {};
$dynamic("get$x").SVGFilterElement = function() {
  return this.x;
}
$dynamic("get$y").SVGFilterElement = function() {
  return this.y;
}
// ********** Code for dom_SVGFilterPrimitiveStandardAttributes **************
var dom_SVGFilterPrimitiveStandardAttributes = {};
$dynamic("get$x").SVGFilterPrimitiveStandardAttributes = function() {
  return this.x;
}
$dynamic("get$y").SVGFilterPrimitiveStandardAttributes = function() {
  return this.y;
}
// ********** Code for dom_SVGFitToViewBox **************
var dom_SVGFitToViewBox = {};
// ********** Code for dom_SVGFontElement **************
var dom_SVGFontElement = {};
// ********** Code for dom_SVGFontFaceElement **************
var dom_SVGFontFaceElement = {};
// ********** Code for dom_SVGFontFaceFormatElement **************
var dom_SVGFontFaceFormatElement = {};
// ********** Code for dom_SVGFontFaceNameElement **************
var dom_SVGFontFaceNameElement = {};
// ********** Code for dom_SVGFontFaceSrcElement **************
var dom_SVGFontFaceSrcElement = {};
// ********** Code for dom_SVGFontFaceUriElement **************
var dom_SVGFontFaceUriElement = {};
// ********** Code for dom_SVGForeignObjectElement **************
var dom_SVGForeignObjectElement = {};
$dynamic("get$x").SVGForeignObjectElement = function() {
  return this.x;
}
$dynamic("get$y").SVGForeignObjectElement = function() {
  return this.y;
}
// ********** Code for dom_SVGGElement **************
var dom_SVGGElement = {};
// ********** Code for dom_SVGGlyphElement **************
var dom_SVGGlyphElement = {};
// ********** Code for dom_SVGGlyphRefElement **************
var dom_SVGGlyphRefElement = {};
$dynamic("get$x").SVGGlyphRefElement = function() {
  return this.x;
}
$dynamic("get$y").SVGGlyphRefElement = function() {
  return this.y;
}
// ********** Code for dom_SVGGradientElement **************
var dom_SVGGradientElement = {};
// ********** Code for dom_SVGHKernElement **************
var dom_SVGHKernElement = {};
// ********** Code for dom_SVGImageElement **************
var dom_SVGImageElement = {};
$dynamic("get$x").SVGImageElement = function() {
  return this.x;
}
$dynamic("get$y").SVGImageElement = function() {
  return this.y;
}
// ********** Code for dom_SVGLangSpace **************
var dom_SVGLangSpace = {};
// ********** Code for dom_SVGLength **************
var dom_SVGLength = {};
// ********** Code for dom_SVGLengthList **************
var dom_SVGLengthList = {};
// ********** Code for dom_SVGLineElement **************
var dom_SVGLineElement = {};
// ********** Code for dom_SVGLinearGradientElement **************
var dom_SVGLinearGradientElement = {};
// ********** Code for dom_SVGLocatable **************
var dom_SVGLocatable = {};
// ********** Code for dom_SVGMPathElement **************
var dom_SVGMPathElement = {};
// ********** Code for dom_SVGMarkerElement **************
var dom_SVGMarkerElement = {};
// ********** Code for dom_SVGMaskElement **************
var dom_SVGMaskElement = {};
$dynamic("get$x").SVGMaskElement = function() {
  return this.x;
}
$dynamic("get$y").SVGMaskElement = function() {
  return this.y;
}
// ********** Code for dom_SVGMatrix **************
var dom_SVGMatrix = {};
// ********** Code for dom_SVGMetadataElement **************
var dom_SVGMetadataElement = {};
// ********** Code for dom_SVGMissingGlyphElement **************
var dom_SVGMissingGlyphElement = {};
// ********** Code for dom_SVGNumber **************
var dom_SVGNumber = {};
// ********** Code for dom_SVGNumberList **************
var dom_SVGNumberList = {};
// ********** Code for dom_SVGPaint **************
var dom_SVGPaint = {};
// ********** Code for dom_SVGPathElement **************
var dom_SVGPathElement = {};
// ********** Code for dom_SVGPathSeg **************
var dom_SVGPathSeg = {};
// ********** Code for dom_SVGPathSegArcAbs **************
var dom_SVGPathSegArcAbs = {};
$dynamic("get$angle").SVGPathSegArcAbs = function() {
  return this.angle;
}
$dynamic("get$x").SVGPathSegArcAbs = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegArcAbs = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegArcRel **************
var dom_SVGPathSegArcRel = {};
$dynamic("get$angle").SVGPathSegArcRel = function() {
  return this.angle;
}
$dynamic("get$x").SVGPathSegArcRel = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegArcRel = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegClosePath **************
var dom_SVGPathSegClosePath = {};
// ********** Code for dom_SVGPathSegCurvetoCubicAbs **************
var dom_SVGPathSegCurvetoCubicAbs = {};
$dynamic("get$x").SVGPathSegCurvetoCubicAbs = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegCurvetoCubicAbs = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegCurvetoCubicRel **************
var dom_SVGPathSegCurvetoCubicRel = {};
$dynamic("get$x").SVGPathSegCurvetoCubicRel = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegCurvetoCubicRel = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegCurvetoCubicSmoothAbs **************
var dom_SVGPathSegCurvetoCubicSmoothAbs = {};
$dynamic("get$x").SVGPathSegCurvetoCubicSmoothAbs = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegCurvetoCubicSmoothAbs = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegCurvetoCubicSmoothRel **************
var dom_SVGPathSegCurvetoCubicSmoothRel = {};
$dynamic("get$x").SVGPathSegCurvetoCubicSmoothRel = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegCurvetoCubicSmoothRel = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegCurvetoQuadraticAbs **************
var dom_SVGPathSegCurvetoQuadraticAbs = {};
$dynamic("get$x").SVGPathSegCurvetoQuadraticAbs = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegCurvetoQuadraticAbs = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegCurvetoQuadraticRel **************
var dom_SVGPathSegCurvetoQuadraticRel = {};
$dynamic("get$x").SVGPathSegCurvetoQuadraticRel = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegCurvetoQuadraticRel = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegCurvetoQuadraticSmoothAbs **************
var dom_SVGPathSegCurvetoQuadraticSmoothAbs = {};
$dynamic("get$x").SVGPathSegCurvetoQuadraticSmoothAbs = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegCurvetoQuadraticSmoothAbs = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegCurvetoQuadraticSmoothRel **************
var dom_SVGPathSegCurvetoQuadraticSmoothRel = {};
$dynamic("get$x").SVGPathSegCurvetoQuadraticSmoothRel = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegCurvetoQuadraticSmoothRel = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegLinetoAbs **************
var dom_SVGPathSegLinetoAbs = {};
$dynamic("get$x").SVGPathSegLinetoAbs = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegLinetoAbs = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegLinetoHorizontalAbs **************
var dom_SVGPathSegLinetoHorizontalAbs = {};
$dynamic("get$x").SVGPathSegLinetoHorizontalAbs = function() {
  return this.x;
}
// ********** Code for dom_SVGPathSegLinetoHorizontalRel **************
var dom_SVGPathSegLinetoHorizontalRel = {};
$dynamic("get$x").SVGPathSegLinetoHorizontalRel = function() {
  return this.x;
}
// ********** Code for dom_SVGPathSegLinetoRel **************
var dom_SVGPathSegLinetoRel = {};
$dynamic("get$x").SVGPathSegLinetoRel = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegLinetoRel = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegLinetoVerticalAbs **************
var dom_SVGPathSegLinetoVerticalAbs = {};
$dynamic("get$y").SVGPathSegLinetoVerticalAbs = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegLinetoVerticalRel **************
var dom_SVGPathSegLinetoVerticalRel = {};
$dynamic("get$y").SVGPathSegLinetoVerticalRel = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegList **************
var dom_SVGPathSegList = {};
// ********** Code for dom_SVGPathSegMovetoAbs **************
var dom_SVGPathSegMovetoAbs = {};
$dynamic("get$x").SVGPathSegMovetoAbs = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegMovetoAbs = function() {
  return this.y;
}
// ********** Code for dom_SVGPathSegMovetoRel **************
var dom_SVGPathSegMovetoRel = {};
$dynamic("get$x").SVGPathSegMovetoRel = function() {
  return this.x;
}
$dynamic("get$y").SVGPathSegMovetoRel = function() {
  return this.y;
}
// ********** Code for dom_SVGPatternElement **************
var dom_SVGPatternElement = {};
$dynamic("get$x").SVGPatternElement = function() {
  return this.x;
}
$dynamic("get$y").SVGPatternElement = function() {
  return this.y;
}
// ********** Code for dom_SVGPoint **************
var dom_SVGPoint = {};
$dynamic("get$x").SVGPoint = function() {
  return this.x;
}
$dynamic("get$y").SVGPoint = function() {
  return this.y;
}
// ********** Code for dom_SVGPointList **************
var dom_SVGPointList = {};
// ********** Code for dom_SVGPolygonElement **************
var dom_SVGPolygonElement = {};
// ********** Code for dom_SVGPolylineElement **************
var dom_SVGPolylineElement = {};
// ********** Code for dom_SVGPreserveAspectRatio **************
var dom_SVGPreserveAspectRatio = {};
// ********** Code for dom_SVGRadialGradientElement **************
var dom_SVGRadialGradientElement = {};
// ********** Code for dom_SVGRect **************
var dom_SVGRect = {};
$dynamic("get$x").SVGRect = function() {
  return this.x;
}
$dynamic("get$y").SVGRect = function() {
  return this.y;
}
// ********** Code for dom_SVGRectElement **************
var dom_SVGRectElement = {};
$dynamic("get$x").SVGRectElement = function() {
  return this.x;
}
$dynamic("get$y").SVGRectElement = function() {
  return this.y;
}
// ********** Code for dom_SVGRenderingIntent **************
var dom_SVGRenderingIntent = {};
// ********** Code for dom_SVGSVGElement **************
var dom_SVGSVGElement = {};
$dynamic("get$x").SVGSVGElement = function() {
  return this.x;
}
$dynamic("get$y").SVGSVGElement = function() {
  return this.y;
}
// ********** Code for dom_SVGScriptElement **************
var dom_SVGScriptElement = {};
$dynamic("get$type").SVGScriptElement = function() {
  return this.type;
}
// ********** Code for dom_SVGSetElement **************
var dom_SVGSetElement = {};
// ********** Code for dom_SVGStopElement **************
var dom_SVGStopElement = {};
// ********** Code for dom_SVGStringList **************
var dom_SVGStringList = {};
// ********** Code for dom_SVGStylable **************
var dom_SVGStylable = {};
// ********** Code for dom_SVGStyleElement **************
var dom_SVGStyleElement = {};
$dynamic("get$type").SVGStyleElement = function() {
  return this.type;
}
// ********** Code for dom_SVGSwitchElement **************
var dom_SVGSwitchElement = {};
// ********** Code for dom_SVGSymbolElement **************
var dom_SVGSymbolElement = {};
// ********** Code for dom_SVGTRefElement **************
var dom_SVGTRefElement = {};
// ********** Code for dom_SVGTSpanElement **************
var dom_SVGTSpanElement = {};
// ********** Code for dom_SVGTests **************
var dom_SVGTests = {};
// ********** Code for dom_SVGTextContentElement **************
var dom_SVGTextContentElement = {};
// ********** Code for dom_SVGTextElement **************
var dom_SVGTextElement = {};
// ********** Code for dom_SVGTextPathElement **************
var dom_SVGTextPathElement = {};
// ********** Code for dom_SVGTextPositioningElement **************
var dom_SVGTextPositioningElement = {};
$dynamic("get$x").SVGTextPositioningElement = function() {
  return this.x;
}
$dynamic("get$y").SVGTextPositioningElement = function() {
  return this.y;
}
// ********** Code for dom_SVGTitleElement **************
var dom_SVGTitleElement = {};
// ********** Code for dom_SVGTransform **************
var dom_SVGTransform = {};
$dynamic("get$angle").SVGTransform = function() {
  return this.angle;
}
$dynamic("get$type").SVGTransform = function() {
  return this.type;
}
// ********** Code for dom_SVGTransformList **************
var dom_SVGTransformList = {};
// ********** Code for dom_SVGTransformable **************
var dom_SVGTransformable = {};
// ********** Code for dom_SVGURIReference **************
var dom_SVGURIReference = {};
// ********** Code for dom_SVGUnitTypes **************
var dom_SVGUnitTypes = {};
// ********** Code for dom_SVGUseElement **************
var dom_SVGUseElement = {};
$dynamic("get$x").SVGUseElement = function() {
  return this.x;
}
$dynamic("get$y").SVGUseElement = function() {
  return this.y;
}
// ********** Code for dom_SVGVKernElement **************
var dom_SVGVKernElement = {};
// ********** Code for dom_SVGViewElement **************
var dom_SVGViewElement = {};
// ********** Code for dom_SVGViewSpec **************
var dom_SVGViewSpec = {};
// ********** Code for dom_SVGZoomAndPan **************
var dom_SVGZoomAndPan = {};
// ********** Code for dom_SVGZoomEvent **************
var dom_SVGZoomEvent = {};
// ********** Code for dom_Screen **************
var dom_Screen = {};
// ********** Code for dom_ScriptProfile **************
var dom_ScriptProfile = {};
// ********** Code for dom_ScriptProfileNode **************
var dom_ScriptProfileNode = {};
// ********** Code for dom_SharedWorker **************
var dom_SharedWorker = {};
// ********** Code for dom_SharedWorkerContext **************
var dom_SharedWorkerContext = {};
// ********** Code for dom_SpeechInputEvent **************
var dom_SpeechInputEvent = {};
// ********** Code for dom_SpeechInputResult **************
var dom_SpeechInputResult = {};
// ********** Code for dom_SpeechInputResultList **************
var dom_SpeechInputResultList = {};
// ********** Code for dom_Storage **************
var dom_Storage = {};
// ********** Code for dom_StorageEvent **************
var dom_StorageEvent = {};
// ********** Code for dom_StorageInfo **************
var dom_StorageInfo = {};
// ********** Code for dom_StyleMedia **************
var dom_StyleMedia = {};
$dynamic("get$type").StyleMedia = function() {
  return this.type;
}
// ********** Code for dom_StyleSheet **************
var dom_StyleSheet = {};
$dynamic("get$type").StyleSheet = function() {
  return this.type;
}
// ********** Code for dom_StyleSheetList **************
var dom_StyleSheetList = {};
$dynamic("$setindex").StyleSheetList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
// ********** Code for dom_Text **************
var dom_Text = {};
// ********** Code for dom_TextEvent **************
var dom_TextEvent = {};
// ********** Code for dom_TextMetrics **************
var dom_TextMetrics = {};
// ********** Code for dom_TextTrack **************
var dom_TextTrack = {};
// ********** Code for dom_TextTrackCue **************
var dom_TextTrackCue = {};
// ********** Code for dom_TextTrackCueList **************
var dom_TextTrackCueList = {};
// ********** Code for dom_TextTrackList **************
var dom_TextTrackList = {};
// ********** Code for dom_TimeRanges **************
var dom_TimeRanges = {};
// ********** Code for dom_Touch **************
var dom_Touch = {};
// ********** Code for dom_TouchEvent **************
var dom_TouchEvent = {};
// ********** Code for dom_TouchList **************
var dom_TouchList = {};
$dynamic("$setindex").TouchList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
// ********** Code for dom_TrackEvent **************
var dom_TrackEvent = {};
// ********** Code for dom_TreeWalker **************
var dom_TreeWalker = {};
// ********** Code for dom_UIEvent **************
var dom_UIEvent = {};
// ********** Code for dom_Uint16Array **************
var dom_Uint16Array = {};
$dynamic("get$length").Uint16Array = function() {
  return this.length;
}
// ********** Code for dom_Uint32Array **************
var dom_Uint32Array = {};
$dynamic("get$length").Uint32Array = function() {
  return this.length;
}
// ********** Code for dom_Uint8Array **************
var dom_Uint8Array = {};
$dynamic("get$length").Uint8Array = function() {
  return this.length;
}
// ********** Code for dom_ValidityState **************
var dom_ValidityState = {};
// ********** Code for dom_WaveShaperNode **************
var dom_WaveShaperNode = {};
// ********** Code for dom_WebGLActiveInfo **************
var dom_WebGLActiveInfo = {};
$dynamic("get$type").WebGLActiveInfo = function() {
  return this.type;
}
// ********** Code for dom_WebGLBuffer **************
var dom_WebGLBuffer = {};
// ********** Code for dom_WebGLCompressedTextures **************
var dom_WebGLCompressedTextures = {};
// ********** Code for dom_WebGLContextAttributes **************
var dom_WebGLContextAttributes = {};
// ********** Code for dom_WebGLContextEvent **************
var dom_WebGLContextEvent = {};
// ********** Code for dom_WebGLDebugRendererInfo **************
var dom_WebGLDebugRendererInfo = {};
// ********** Code for dom_WebGLDebugShaders **************
var dom_WebGLDebugShaders = {};
// ********** Code for dom_WebGLFramebuffer **************
var dom_WebGLFramebuffer = {};
// ********** Code for dom_WebGLLoseContext **************
var dom_WebGLLoseContext = {};
// ********** Code for dom_WebGLProgram **************
var dom_WebGLProgram = {};
// ********** Code for dom_WebGLRenderbuffer **************
var dom_WebGLRenderbuffer = {};
// ********** Code for dom_WebGLRenderingContext **************
var dom_WebGLRenderingContext = {};
// ********** Code for dom_WebGLShader **************
var dom_WebGLShader = {};
// ********** Code for dom_WebGLTexture **************
var dom_WebGLTexture = {};
// ********** Code for dom_WebGLUniformLocation **************
var dom_WebGLUniformLocation = {};
// ********** Code for dom_WebGLVertexArrayObjectOES **************
var dom_WebGLVertexArrayObjectOES = {};
// ********** Code for dom_WebKitAnimation **************
var dom_WebKitAnimation = {};
// ********** Code for dom_WebKitAnimationEvent **************
var dom_WebKitAnimationEvent = {};
// ********** Code for dom_WebKitAnimationList **************
var dom_WebKitAnimationList = {};
// ********** Code for dom_WebKitBlobBuilder **************
var dom_WebKitBlobBuilder = {};
// ********** Code for dom_WebKitCSSFilterValue **************
var dom_WebKitCSSFilterValue = {};
// ********** Code for dom_WebKitCSSKeyframeRule **************
var dom_WebKitCSSKeyframeRule = {};
// ********** Code for dom_WebKitCSSKeyframesRule **************
var dom_WebKitCSSKeyframesRule = {};
// ********** Code for dom_WebKitCSSMatrix **************
var dom_WebKitCSSMatrix = {};
// ********** Code for dom_WebKitCSSTransformValue **************
var dom_WebKitCSSTransformValue = {};
// ********** Code for dom_WebKitMutationObserver **************
var dom_WebKitMutationObserver = {};
// ********** Code for dom_WebKitNamedFlow **************
var dom_WebKitNamedFlow = {};
// ********** Code for dom_WebKitPoint **************
var dom_WebKitPoint = {};
$dynamic("get$x").WebKitPoint = function() {
  return this.x;
}
$dynamic("get$y").WebKitPoint = function() {
  return this.y;
}
// ********** Code for dom_WebKitTransitionEvent **************
var dom_WebKitTransitionEvent = {};
// ********** Code for dom_WebSocket **************
var dom_WebSocket = {};
// ********** Code for dom_WheelEvent **************
var dom_WheelEvent = {};
$dynamic("get$x").WheelEvent = function() {
  return this.x;
}
$dynamic("get$y").WheelEvent = function() {
  return this.y;
}
// ********** Code for dom_Worker **************
var dom_Worker = {};
// ********** Code for dom_WorkerContext **************
var dom_WorkerContext = {};
// ********** Code for dom_WorkerLocation **************
var dom_WorkerLocation = {};
// ********** Code for dom_WorkerNavigator **************
var dom_WorkerNavigator = {};
// ********** Code for dom_XMLHttpRequest **************
var dom_XMLHttpRequest = {};
// ********** Code for dom_XMLHttpRequestException **************
var dom_XMLHttpRequestException = {};
// ********** Code for dom_XMLHttpRequestProgressEvent **************
var dom_XMLHttpRequestProgressEvent = {};
$dynamic("get$position").XMLHttpRequestProgressEvent = function() {
  return this.position;
}
// ********** Code for dom_XMLHttpRequestUpload **************
var dom_XMLHttpRequestUpload = {};
// ********** Code for dom_XMLSerializer **************
var dom_XMLSerializer = {};
// ********** Code for dom_XPathEvaluator **************
var dom_XPathEvaluator = {};
// ********** Code for dom_XPathException **************
var dom_XPathException = {};
// ********** Code for dom_XPathExpression **************
var dom_XPathExpression = {};
// ********** Code for dom_XPathNSResolver **************
var dom_XPathNSResolver = {};
// ********** Code for dom_XPathResult **************
var dom_XPathResult = {};
// ********** Code for dom_XSLTProcessor **************
var dom_XSLTProcessor = {};
// ********** Code for _Collections **************
function _Collections() {}
// ********** Code for _VariableSizeListIterator **************
function _VariableSizeListIterator() {}
_VariableSizeListIterator.prototype.hasNext = function() {
  return this._array.get$length() > this._pos;
}
_VariableSizeListIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  return this._array.$index(this._pos++);
}
// ********** Code for _FixedSizeListIterator **************
$inherits(_FixedSizeListIterator, _VariableSizeListIterator);
function _FixedSizeListIterator() {}
_FixedSizeListIterator.prototype.hasNext = function() {
  return this._length > this._pos;
}
// ********** Code for _Lists **************
function _Lists() {}
// ********** Code for top level **************
//  ********** Library box2d **************
// ********** Code for AxisAlignedBox **************
function AxisAlignedBox(lowerBound, upperBound) {
  this.lowerBound = lowerBound;
  this.upperBound = upperBound;
  if (this.lowerBound == null) {
    this.lowerBound = new Vector((0), (0));
  }
  if (this.upperBound == null) {
    this.upperBound = new Vector((0), (0));
  }
}
AxisAlignedBox.prototype.setFromCombination = function(boxOne, boxTwo) {
  this.lowerBound.x = Math.min(boxOne.lowerBound.x, boxTwo.lowerBound.x);
  this.lowerBound.y = Math.min(boxOne.lowerBound.y, boxTwo.lowerBound.y);
  this.upperBound.x = Math.max(boxOne.upperBound.x, boxTwo.upperBound.x);
  this.upperBound.y = Math.max(boxOne.upperBound.y, boxTwo.upperBound.y);
}
AxisAlignedBox.testOverlap = function(a, b) {
  if (b.lowerBound.x > a.upperBound.x || b.lowerBound.y > a.upperBound.y) {
    return false;
  }
  if (a.lowerBound.x > b.upperBound.x || a.lowerBound.y > b.upperBound.y) {
    return false;
  }
  return true;
}
AxisAlignedBox.prototype.get$center = function() {
  var c = new Vector.copy$ctor(this.lowerBound);
  c.addLocal(this.upperBound);
  c.mulLocal((0.5));
  return c;
}
AxisAlignedBox.prototype.contains = function(aabb) {
  return this.lowerBound.x > aabb.lowerBound.x && this.lowerBound.y > aabb.lowerBound.y && this.upperBound.y < aabb.upperBound.y && this.upperBound.x < aabb.upperBound.x;
}
AxisAlignedBox.prototype.setFrom = function(other) {
  this.lowerBound.setFrom(other.lowerBound);
  this.upperBound.setFrom(other.upperBound);
}
AxisAlignedBox.prototype.toString = function() {
  return $add($add(this.lowerBound.toString(), ", "), this.upperBound.toString());
}
// ********** Code for Collision **************
Collision._construct$ctor = function(pool) {
  this.normal1 = new Vector((0), (0));
  this.localTangent = new Vector((0), (0));
  this.normal = new Vector((0), (0));
  this.results2 = new EdgeResults();
  this.incidentEdge = new Array((2));
  this.results1 = new EdgeResults();
  this.planePoint = new Vector((0), (0));
  this.localNormal = new Vector((0), (0));
  this._pool = pool;
  this.clipPoints1 = new Array((2));
  this.cache = new SimplexCache();
  this.v12 = new Vector((0), (0));
  this.clipPoints2 = new Array((2));
  this.v11 = new Vector((0), (0));
  this.input = new DistanceInput();
  this.tangent = new Vector((0), (0));
  this.output = new DistanceOutput();
  this.incidentEdge.$setindex((0), new ClipVertex());
  this.incidentEdge.$setindex((1), new ClipVertex());
  this.clipPoints1.$setindex((0), new ClipVertex());
  this.clipPoints1.$setindex((1), new ClipVertex());
  this.clipPoints2.$setindex((0), new ClipVertex());
  this.clipPoints2.$setindex((1), new ClipVertex());
}
Collision._construct$ctor.prototype = Collision.prototype;
function Collision() {}
Collision.prototype.get$incidentEdge = function() { return this.incidentEdge; };
Collision.prototype.testOverlap = function(shapeA, shapeB, transformA, transformB) {
  this.input.proxyA.setFromShape(shapeA);
  this.input.proxyB.setFromShape(shapeB);
  this.input.transformA.setFrom(transformA);
  this.input.transformB.setFrom(transformB);
  this.input.useRadii = true;
  this.cache.count = (0);
  this._pool.distance.distance(this.output, this.cache, this.input);
  return this.output.distance < (0.000001192);
}
Collision.clipSegmentToLine = function(vOut, vIn, norm, offset) {
  var numOut = (0);
  var distance0 = Vector.dot(norm, vIn[(0)].v) - offset;
  var distance1 = Vector.dot(norm, vIn[(1)].v) - offset;
  if (distance0 <= (0)) {
    vOut[numOut++].setFrom(vIn[(0)]);
  }
  if (distance1 <= (0)) {
    vOut[numOut++].setFrom(vIn[(1)]);
  }
  if (distance0 * distance1 < (0)) {
    var interp = distance0 / (distance0 - distance1);
    vOut[numOut].v.setFrom(vIn[(1)].v).subLocal(vIn[(0)].v).mulLocal(interp).addLocal(vIn[(0)].v);
    if (distance0 > (0)) {
      vOut[numOut].id.setFrom(vIn[(0)].id);
    }
    else {
      vOut[numOut].id.setFrom(vIn[(1)].id);
    }
    ++numOut;
  }
  return numOut;
}
Collision.prototype.collideCircles = function(manifold, circle1, xfA, circle2, xfB) {
  manifold.pointCount = (0);
  var v = circle1.position;
  var pAy = xfA.position.y + xfA.rotation.col1.y * v.x + xfA.rotation.col2.y * v.y;
  var pAx = xfA.position.x + xfA.rotation.col1.x * v.x + xfA.rotation.col2.x * v.y;
  var v1 = circle2.position;
  var pBy = xfB.position.y + xfB.rotation.col1.y * v1.x + xfB.rotation.col2.y * v1.y;
  var pBx = xfB.position.x + xfB.rotation.col1.x * v1.x + xfB.rotation.col2.x * v1.y;
  var dx = pBx - pAx;
  var dy = pBy - pAy;
  var distSqr = dx * dx + dy * dy;
  var radius = circle1.radius + circle2.radius;
  if (distSqr > radius * radius) {
    return;
  }
  manifold.type = (0);
  manifold.localPoint.setFrom(circle1.position);
  manifold.localNormal.setZero();
  manifold.pointCount = (1);
  manifold.points[(0)].localPoint.setFrom(circle2.position);
  manifold.points[(0)].id.zero();
}
Collision.prototype.collidePolygonAndCircle = function(manifold, polygon, xfA, circle, xfB) {
  manifold.pointCount = (0);
  var v = circle.position;
  var cy = xfB.position.y + xfB.rotation.col1.y * v.x + xfB.rotation.col2.y * v.y;
  var cx = xfB.position.x + xfB.rotation.col1.x * v.x + xfB.rotation.col2.x * v.y;
  var v1x = cx - xfA.position.x;
  var v1y = cy - xfA.position.y;
  var b = xfA.rotation.col1;
  var b1 = xfA.rotation.col2;
  var cLocaly = v1x * b1.x + v1y * b1.y;
  var cLocalx = v1x * b.x + v1y * b.y;
  var normalIndex = (0);
  var separation = (1e-12);
  var radius = polygon.radius + circle.radius;
  var vertexCount = polygon.vertexCount;
  var vertices = polygon.vertices;
  var normals = polygon.normals;
  for (var i = (0);
   i < vertexCount; i++) {
    var vertex = vertices[i];
    var tempx = cLocalx - vertex.x;
    var tempy = cLocaly - vertex.y;
    var norm = normals[i];
    var s = norm.x * tempx + norm.y * tempy;
    if (s > radius) {
      return;
    }
    if (s > separation) {
      separation = s;
      normalIndex = i;
    }
  }
  var vertIndex1 = normalIndex;
  var vertIndex2 = vertIndex1 + (1) < vertexCount ? vertIndex1 + (1) : (0);
  var v1 = vertices[vertIndex1];
  var v2 = vertices[vertIndex2];
  if (separation < (1.192e-7)) {
    manifold.pointCount = (1);
    manifold.type = (1);
    var norm = normals[normalIndex];
    manifold.localNormal.x = norm.x;
    manifold.localNormal.y = norm.y;
    manifold.localPoint.x = (v1.x + v2.x) * (0.5);
    manifold.localPoint.y = (v1.y + v2.y) * (0.5);
    var mpoint = manifold.points[(0)];
    mpoint.localPoint.x = circle.position.x;
    mpoint.localPoint.y = circle.position.y;
    mpoint.id.zero();
    return;
  }
  var tempX = cLocalx - v1.x;
  var tempY = cLocaly - v1.y;
  var temp2X = v2.x - v1.x;
  var temp2Y = v2.y - v1.y;
  var u1 = tempX * temp2X + tempY * temp2Y;
  var temp3X = cLocalx - v2.x;
  var temp3Y = cLocaly - v2.y;
  var temp4X = v1.x - v2.x;
  var temp4Y = v1.y - v2.y;
  var u2 = temp3X * temp4X + temp3Y * temp4Y;
  if (u1 <= (0)) {
    var dx = cLocalx - v1.x;
    var dy = cLocaly - v1.y;
    if (dx * dx + dy * dy > radius * radius) {
      return;
    }
    manifold.pointCount = (1);
    manifold.type = (1);
    manifold.localNormal.x = cLocalx - v1.x;
    manifold.localNormal.y = cLocaly - v1.y;
    manifold.localNormal.normalize();
    manifold.localPoint.setFrom(v1);
    manifold.points[(0)].localPoint.setFrom(circle.position);
    manifold.points[(0)].id.zero();
  }
  else if (u2 <= (0)) {
    var dx = cLocalx - v2.x;
    var dy = cLocaly - v2.y;
    if (dx * dx + dy * dy > radius * radius) {
      return;
    }
    manifold.pointCount = (1);
    manifold.type = (1);
    manifold.localNormal.x = cLocalx - v2.x;
    manifold.localNormal.y = cLocaly - v2.y;
    manifold.localNormal.normalize();
    manifold.localPoint.setFrom(v2);
    manifold.points[(0)].localPoint.setFrom(circle.position);
    manifold.points[(0)].id.zero();
  }
  else {
    var fcx = (v1.x + v2.x) * (0.5);
    var fcy = (v1.y + v2.y) * (0.5);
    var tx = cLocalx - fcx;
    var ty = cLocaly - fcy;
    var norm = normals[vertIndex1];
    separation = tx * norm.x + ty * norm.y;
    if (separation > radius) {
      return;
    }
    manifold.pointCount = (1);
    manifold.type = (1);
    manifold.localNormal.setFrom(normals[vertIndex1]);
    manifold.localPoint.x = fcx;
    manifold.localPoint.y = fcy;
    manifold.points[(0)].localPoint.setFrom(circle.position);
    manifold.points[(0)].id.zero();
  }
}
Collision.prototype.edgeSeparation = function(poly1, xf1, edge1, poly2, xf2) {
  var count1 = poly1.vertexCount;
  var vertices1 = poly1.vertices;
  var normals1 = poly1.normals;
  var count2 = poly2.vertexCount;
  var vertices2 = poly2.vertices;
  var R = xf1.rotation;
  var v = normals1[edge1];
  var normal1Worldy = R.col1.y * v.x + R.col2.y * v.y;
  var normal1Worldx = R.col1.x * v.x + R.col2.x * v.y;
  var R1 = xf2.rotation;
  var normal1x = normal1Worldx * R1.col1.x + normal1Worldy * R1.col1.y;
  var normal1y = normal1Worldx * R1.col2.x + normal1Worldy * R1.col2.y;
  var index = (0);
  var minDot = (99999999999999);
  for (var i = (0);
   i < count2; ++i) {
    var a = vertices2[i];
    var dot = a.x * normal1x + a.y * normal1y;
    if (dot < minDot) {
      minDot = dot;
      index = i;
    }
  }
  var v3 = vertices1[edge1];
  var v1y = xf1.position.y + R.col1.y * v3.x + R.col2.y * v3.y;
  var v1x = xf1.position.x + R.col1.x * v3.x + R.col2.x * v3.y;
  var v4 = vertices2[index];
  var v2y = xf2.position.y + R1.col1.y * v4.x + R1.col2.y * v4.y - v1y;
  var v2x = xf2.position.x + R1.col1.x * v4.x + R1.col2.x * v4.y - v1x;
  return v2x * normal1Worldx + v2y * normal1Worldy;
}
Collision.prototype.findMaxSeparation = function(results, poly1, xf1, poly2, xf2) {
  var count1 = poly1.vertexCount;
  var normals1 = poly1.normals;
  var v = poly2.centroid;
  var predy = xf2.position.y + xf2.rotation.col1.y * v.x + xf2.rotation.col2.y * v.y;
  var predx = xf2.position.x + xf2.rotation.col1.x * v.x + xf2.rotation.col2.x * v.y;
  var v1 = poly1.centroid;
  var tempy = xf1.position.y + xf1.rotation.col1.y * v1.x + xf1.rotation.col2.y * v1.y;
  var tempx = xf1.position.x + xf1.rotation.col1.x * v1.x + xf1.rotation.col2.x * v1.y;
  var dx = predx - tempx;
  var dy = predy - tempy;
  var R = xf1.rotation;
  var dLocal1x = dx * R.col1.x + dy * R.col1.y;
  var dLocal1y = dx * R.col2.x + dy * R.col2.y;
  var edge = (0);
  var dot;
  var maxDot = (1e-12);
  for (var i = (0);
   i < count1; i++) {
    var norm = normals1[i];
    dot = norm.x * dLocal1x + norm.y * dLocal1y;
    if (dot > maxDot) {
      maxDot = dot;
      edge = i;
    }
  }
  var s = this.edgeSeparation(poly1, xf1, edge, poly2, xf2);
  var prevEdge = edge - (1) >= (0) ? edge - (1) : count1 - (1);
  var sPrev = this.edgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
  var nextEdge = edge + (1) < count1 ? edge + (1) : (0);
  var sNext = this.edgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
  var bestEdge;
  var bestSeparation;
  var increment;
  if (sPrev > s && sPrev > sNext) {
    increment = (-1);
    bestEdge = prevEdge;
    bestSeparation = sPrev;
  }
  else if (sNext > s) {
    increment = (1);
    bestEdge = nextEdge;
    bestSeparation = sNext;
  }
  else {
    results.edgeIndex = edge;
    results.separation = s;
    return;
  }
  while (true) {
    if (increment == (-1)) {
      edge = bestEdge - (1) >= (0) ? bestEdge - (1) : count1 - (1);
    }
    else {
      edge = bestEdge + (1) < count1 ? bestEdge + (1) : (0);
    }
    s = this.edgeSeparation(poly1, xf1, edge, poly2, xf2);
    if (s > bestSeparation) {
      bestEdge = edge;
      bestSeparation = s;
    }
    else {
      break;
    }
  }
  results.edgeIndex = bestEdge;
  results.separation = bestSeparation;
}
Collision.prototype.findIncidentEdge = function(c, poly1, xf1, edge1, poly2, xf2) {
  var count1 = poly1.vertexCount;
  var normals1 = poly1.normals;
  var count2 = poly2.vertexCount;
  var vertices2 = poly2.vertices;
  var normals2 = poly2.normals;
  Matrix22.mulMatrixAndVectorToOut(xf1.rotation, normals1[edge1], this.normal1);
  Matrix22.mulTransMatrixAndVectorToOut(xf2.rotation, this.normal1, this.normal1);
  var index = (0);
  var minDot = (99999999999999);
  for (var i = (0);
   i < count2; ++i) {
    var dot = Vector.dot(this.normal1, normals2[i]);
    if (dot < minDot) {
      minDot = dot;
      index = i;
    }
  }
  var i1 = index;
  var i2 = i1 + (1) < count2 ? i1 + (1) : (0);
  Transform.mulToOut(xf2, vertices2[i1], c[(0)].v);
  c[(0)].id.features.referenceEdge = edge1;
  c[(0)].id.features.incidentEdge = i1;
  c[(0)].id.features.incidentVertex = (0);
  Transform.mulToOut(xf2, vertices2[i2], c[(1)].v);
  c[(1)].id.features.referenceEdge = edge1;
  c[(1)].id.features.incidentEdge = i2;
  c[(1)].id.features.incidentVertex = (1);
}
Collision.prototype.collidePolygons = function(manifold, polyA, xfA, polyB, xfB) {
  manifold.pointCount = (0);
  var totalRadius = polyA.radius + polyB.radius;
  this.findMaxSeparation(this.results1, polyA, xfA, polyB, xfB);
  if (this.results1.separation > totalRadius) {
    return;
  }
  this.findMaxSeparation(this.results2, polyB, xfB, polyA, xfA);
  if (this.results2.separation > totalRadius) {
    return;
  }
  var poly1;
  var poly2;
  var xf1, xf2;
  var edge1;
  var flip;
  var k_relativeTol = (0.98);
  var k_absoluteTol = (0.001);
  if (this.results2.separation > k_relativeTol * this.results1.separation + k_absoluteTol) {
    poly1 = polyB;
    poly2 = polyA;
    xf1 = xfB;
    xf2 = xfA;
    edge1 = this.results2.edgeIndex;
    manifold.type = (2);
    flip = (1);
  }
  else {
    poly1 = polyA;
    poly2 = polyB;
    xf1 = xfA;
    xf2 = xfB;
    edge1 = this.results1.edgeIndex;
    manifold.type = (1);
    flip = (0);
  }
  this.findIncidentEdge(this.incidentEdge, poly1, xf1, edge1, poly2, xf2);
  var count1 = poly1.vertexCount;
  var vertices1 = poly1.vertices;
  this.v11.setFrom(vertices1[edge1]);
  this.v12.setFrom(edge1 + (1) < count1 ? vertices1[edge1 + (1)] : vertices1[(0)]);
  this.localTangent.setFrom(this.v12).subLocal(this.v11);
  this.localTangent.normalize();
  Vector.crossVectorAndNumToOut(this.localTangent, (1), this.localNormal);
  this.planePoint.setFrom(this.v11).addLocal(this.v12).mulLocal((0.5));
  Matrix22.mulMatrixAndVectorToOut(xf1.rotation, this.localTangent, this.tangent);
  Vector.crossVectorAndNumToOut(this.tangent, (1), this.normal);
  Transform.mulToOut(xf1, this.v11, this.v11);
  Transform.mulToOut(xf1, this.v12, this.v12);
  var frontOffset = Vector.dot(this.normal, this.v11);
  var sideOffset1 = -Vector.dot(this.tangent, this.v11) + totalRadius;
  var sideOffset2 = Vector.dot(this.tangent, this.v12) + totalRadius;
  var np;
  this.tangent.negateLocal();
  np = Collision.clipSegmentToLine(this.clipPoints1, this.incidentEdge, this.tangent, sideOffset1);
  this.tangent.negateLocal();
  if (np < (2)) {
    return;
  }
  np = Collision.clipSegmentToLine(this.clipPoints2, this.clipPoints1, this.tangent, sideOffset2);
  if (np < (2)) {
    return;
  }
  manifold.localNormal.setFrom(this.localNormal);
  manifold.localPoint.setFrom(this.planePoint);
  var pointCount = (0);
  for (var i = (0);
   i < (2); ++i) {
    var separation = Vector.dot(this.normal, this.clipPoints2[i].v) - frontOffset;
    if (separation <= totalRadius) {
      var cp = manifold.points[pointCount];
      Transform.mulTransToOut(xf2, this.clipPoints2[i].v, cp.localPoint);
      cp.id.setFrom(this.clipPoints2[i].id);
      cp.id.features.flip = flip;
      ++pointCount;
    }
  }
  manifold.pointCount = pointCount;
}
// ********** Code for ClipVertex **************
function ClipVertex() {
  this.v = new Vector((0), (0));
  this.id = new ContactID();
}
ClipVertex.prototype.setFrom = function(cv) {
  this.v.setFrom(cv.v);
  this.id.setFrom(cv.id);
}
// ********** Code for EdgeResults **************
function EdgeResults() {
  this.separation = (0);
  this.edgeIndex = (0);
}
// ********** Code for ContactID **************
function ContactID() {
  this.features = new Features();
}
ContactID.prototype.get$features = function() { return this.features; };
ContactID.prototype.$eq = function(other) {
  return $eq(other.get$features(), this.features);
}
ContactID.prototype.setFrom = function(other) {
  this.features.setFrom(other.features);
}
ContactID.prototype.isEqual = function(other) {
  return $eq(other.features, this.features);
}
ContactID.prototype.zero = function() {
  this.features.zero();
}
// ********** Code for Distance **************
Distance._construct$ctor = function() {
  this.closestPoint = new Vector((0), (0));
  this.normal = new Vector((0), (0));
  this.iters = (0);
  this.maxIters = (20);
  this.simplex = new Simplex();
  this.searchDirection = new Vector((0), (0));
  this.temp = new Vector((0), (0));
  this.calls = (0);
  this.saveB = new Array((3));
  this.saveA = new Array((3));
}
Distance._construct$ctor.prototype = Distance.prototype;
function Distance() {}
Distance.prototype.distance = function(output, cache, input) {
  var $0, $1;
  this.calls++;
  var proxyA = input.proxyA;
  var proxyB = input.proxyB;
  var transformA = input.transformA;
  var transformB = input.transformB;
  this.simplex.readCache(cache, proxyA, transformA, proxyB, transformB);
  var vertices = this.simplex.vertices;
  var saveCount = (0);
  this.simplex.getClosestPoint(this.closestPoint);
  var distanceSqr1 = this.closestPoint.get$lengthSquared();
  var distanceSqr2 = distanceSqr1;
  var iter = (0);
  while (iter < this.maxIters) {
    saveCount = this.simplex.count;
    for (var i = (0);
     i < saveCount; i++) {
      this.saveA.$setindex(i, vertices[i].indexA);
      this.saveB.$setindex(i, vertices[i].indexB);
    }
    switch (this.simplex.count) {
      case (1):

        break;

      case (2):

        this.simplex.solve2();
        break;

      case (3):

        this.simplex.solve3();
        break;

      default:


    }
    if (this.simplex.count == (3)) {
      break;
    }
    this.simplex.getClosestPoint(this.closestPoint);
    distanceSqr2 = this.closestPoint.get$lengthSquared();
    if (distanceSqr2 >= distanceSqr1) {
    }
    distanceSqr1 = distanceSqr2;
    this.simplex.getSearchDirection(this.searchDirection);
    if (this.searchDirection.get$lengthSquared() < (1.4208639999999999e-14)) {
      break;
    }
    var vertex = vertices[this.simplex.count];
    Matrix22.mulTransMatrixAndVectorToOut(transformA.rotation, this.searchDirection.negateLocal(), this.temp);
    vertex.indexA = proxyA.getSupport(this.temp);
    Transform.mulToOut(transformA, proxyA.vertices[vertex.indexA], vertex.wA);
    Matrix22.mulTransMatrixAndVectorToOut(transformB.rotation, this.searchDirection.negateLocal(), this.temp);
    vertex.indexB = proxyB.getSupport(this.temp);
    Transform.mulToOut(transformB, proxyB.vertices[vertex.indexB], vertex.wB);
    vertex.w.setFrom(vertex.wB).subLocal(vertex.wA);
    ++iter;
    ++this.iters;
    var duplicate = false;
    for (var i = (0);
     i < saveCount; ++i) {
      if (vertex.indexA == this.saveA.$index(i) && vertex.indexB == this.saveB.$index(i)) {
        duplicate = true;
        break;
      }
    }
    if (duplicate) {
      break;
    }
    ((($0 = this.simplex).count = ($1 = $0.count + (1)), $1));
  }
  this.maxIters = Math.max(this.maxIters, iter);
  this.simplex.getWitnessPoints(output.pointA, output.pointB);
  output.distance = MathBox.distance(output.pointA, output.pointB);
  output.iterations = iter;
  this.simplex.writeCache(cache);
  if (input.useRadii) {
    var rA = proxyA.radius;
    var rB = proxyB.radius;
    if (output.distance > rA + rB && output.distance > (1.192e-7)) {
      output.distance = output.distance - (rA + rB);
      this.normal.setFrom(output.pointB).subLocal(output.pointA);
      this.normal.normalize();
      this.temp.setFrom(this.normal).mulLocal(rA);
      output.pointA.addLocal(this.temp);
      this.temp.setFrom(this.normal).mulLocal(rB);
      output.pointB.subLocal(this.temp);
    }
    else {
      output.pointA.addLocal(output.pointB).mulLocal((0.5));
      output.pointB.setFrom(output.pointA);
      output.distance = (0);
    }
  }
}
// ********** Code for DistanceInput **************
function DistanceInput() {
  this.transformB = new Transform();
  this.transformA = new Transform();
  this.proxyA = new DistanceProxy();
  this.proxyB = new DistanceProxy();
  this.useRadii = false;
}
// ********** Code for DistanceOutput **************
function DistanceOutput() {
  this.pointB = new Vector((0), (0));
  this.pointA = new Vector((0), (0));
}
// ********** Code for DistanceProxy **************
function DistanceProxy() {
  this.vertices = new Array((8));
  this.radius = (0);
  this.count = (0);
  for (var i = (0);
   i < this.vertices.get$length(); i++) {
    this.vertices.$setindex(i, new Vector((0), (0)));
  }
}
DistanceProxy.prototype.get$vertices = function() { return this.vertices; };
DistanceProxy.prototype.get$radius = function() { return this.radius; };
DistanceProxy.prototype.set$radius = function(value) { return this.radius = value; };
DistanceProxy.prototype.setFromShape = function(shape) {
  if ($eq(shape.get$type(), (0))) {
    this.vertices[(0)].setFrom(shape.get$position());
    this.count = (1);
    this.radius = shape.get$radius();
  }
  else if ($eq(shape.get$type(), (1))) {
    this.count = shape.get$vertexCount();
    this.radius = shape.get$radius();
    for (var i = (0);
     i < this.count; i++) {
      this.vertices[i].setFrom(shape.get$vertices().$index(i));
    }
  }
  else {
  }
}
DistanceProxy.prototype.getSupport = function(direction) {
  var bestIndex = (0);
  var bestValue = Vector.dot(this.vertices[(0)], direction);
  for (var i = (1);
   i < this.count; i++) {
    var value = Vector.dot(this.vertices[i], direction);
    if (value > bestValue) {
      bestIndex = i;
      bestValue = value;
    }
  }
  return bestIndex;
}
// ********** Code for Features **************
function Features() {
  this.referenceEdge = (0);
  this.incidentVertex = (0);
  this.incidentEdge = (0);
  this.flip = (0);
}
Features.prototype.get$referenceEdge = function() { return this.referenceEdge; };
Features.prototype.set$referenceEdge = function(value) { return this.referenceEdge = value; };
Features.prototype.get$incidentEdge = function() { return this.incidentEdge; };
Features.prototype.set$incidentEdge = function(value) { return this.incidentEdge = value; };
Features.prototype.get$incidentVertex = function() { return this.incidentVertex; };
Features.prototype.set$incidentVertex = function(value) { return this.incidentVertex = value; };
Features.prototype.get$flip = function() { return this.flip; };
Features.prototype.set$flip = function(value) { return this.flip = value; };
Features.prototype.setFrom = function(f) {
  this.referenceEdge = f.referenceEdge;
  this.incidentEdge = f.incidentEdge;
  this.incidentVertex = f.incidentVertex;
  this.flip = f.flip;
}
Features.prototype.$eq = function(other) {
  return this.referenceEdge == other.get$referenceEdge() && this.incidentEdge == other.get$incidentEdge() && this.incidentVertex == other.get$incidentVertex() && this.flip == other.get$flip();
}
Features.prototype.toString = function() {
  var s = $add($add($add($add("Features: (" + this.flip, " ,") + this.incidentEdge, " ,") + this.incidentVertex, " ,") + this.referenceEdge, ")");
  return s;
}
Features.prototype.zero = function() {
  this.referenceEdge = (0);
  this.incidentEdge = (0);
  this.incidentVertex = (0);
  this.flip = (0);
}
// ********** Code for Manifold **************
function Manifold() {
  this.pointCount = (0);
  this.localPoint = new Vector((0), (0));
  this.points = new Array((2));
  this.localNormal = new Vector((0), (0));
  for (var i = (0);
   i < (2); i++) {
    this.points.$setindex(i, new ManifoldPoint());
  }
}
Manifold.prototype.get$type = function() { return this.type; };
Manifold.prototype.set$type = function(value) { return this.type = value; };
Manifold.prototype.setFrom = function(other) {
  for (var i = (0);
   i < other.pointCount; i++) {
    this.points[i].setFrom(other.points[i]);
  }
  this.type = other.type;
  this.localNormal.setFrom(other.localNormal);
  this.localPoint.setFrom(other.localPoint);
  this.pointCount = other.pointCount;
}
// ********** Code for ManifoldPoint **************
function ManifoldPoint() {
  this.tangentImpulse = (0);
  this.id = new ContactID();
  this.localPoint = new Vector((0), (0));
  this.normalImpulse = (0);
}
ManifoldPoint.prototype.setFrom = function(other) {
  this.localPoint.setFrom(other.localPoint);
  this.normalImpulse = other.normalImpulse;
  this.tangentImpulse = other.tangentImpulse;
  this.id.setFrom(other.id);
}
// ********** Code for ManifoldType **************
function ManifoldType() {}
// ********** Code for Simplex **************
function Simplex() {
  this.v3 = new SimplexVertex();
  this.v1 = new SimplexVertex();
  this.v2 = new SimplexVertex();
  this.e23 = new Vector((0), (0));
  this.case22 = new Vector((0), (0));
  this.vertices = new Array((3));
  this.e13 = new Vector((0), (0));
  this.case3 = new Vector((0), (0));
  this.case2 = new Vector((0), (0));
  this.e12 = new Vector((0), (0));
  this.case33 = new Vector((0), (0));
  this.count = (0);
  this.vertices.$setindex((0), this.v1);
  this.vertices.$setindex((1), this.v2);
  this.vertices.$setindex((2), this.v3);
}
Simplex.prototype.get$vertices = function() { return this.vertices; };
Simplex.prototype.readCache = function(cache, proxyA, transformA, proxyB, transformB) {
  this.count = cache.count;
  for (var i = (0);
   i < this.count; ++i) {
    var v = this.vertices[i];
    v.indexA = cache.indexA.$index(i);
    v.indexB = cache.indexB.$index(i);
    var wALocal = proxyA.vertices[v.indexA];
    var wBLocal = proxyB.vertices[v.indexB];
    Transform.mulToOut(transformA, wALocal, v.wA);
    Transform.mulToOut(transformB, wBLocal, v.wB);
    v.w.setFrom(v.wB).subLocal(v.wA);
    v.a = (0);
  }
  if (this.count > (1)) {
    var metric1 = cache.metric;
    var metric2 = this.getMetric();
    if (metric2 < (0.5) * metric1 || (2) * metric1 < metric2 || metric2 < (1.192e-7)) {
      this.count = (0);
    }
  }
  if (this.count == (0)) {
    var v = this.vertices[(0)];
    v.indexA = (0);
    v.indexB = (0);
    var wALocal = proxyA.vertices[(0)];
    var wBLocal = proxyB.vertices[(0)];
    Transform.mulToOut(transformA, wALocal, v.wA);
    Transform.mulToOut(transformB, wBLocal, v.wB);
    v.w.setFrom(v.wB).subLocal(v.wA);
    this.count = (1);
  }
}
Simplex.prototype.writeCache = function(cache) {
  cache.metric = this.getMetric();
  cache.count = this.count;
  for (var i = (0);
   i < this.count; ++i) {
    cache.indexA.$setindex(i, (this.vertices[i].indexA));
    cache.indexB.$setindex(i, (this.vertices[i].indexB));
  }
}
Simplex.prototype.getSearchDirection = function(out) {
  switch (this.count) {
    case (1):

      out.setFrom(this.v1.w).negateLocal();
      return;

    case (2):

      this.e12.setFrom(this.v2.w).subLocal(this.v1.w);
      out.setFrom(this.v1.w).negateLocal();
      var sgn = Vector.crossVectors(this.e12, out);
      if (sgn > (0)) {
        Vector.crossNumAndVectorToOut((1), this.e12, out);
        return;
      }
      else {
        Vector.crossVectorAndNumToOut(this.e12, (1), out);
        return;
      }

    default:

      out.setZero();
      return;

  }
}
Simplex.prototype.getClosestPoint = function(out) {
  switch (this.count) {
    case (0):

      out.setZero();
      return;

    case (1):

      out.setFrom(this.v1.w);
      return;

    case (2):

      this.case22.setFrom(this.v2.w).mulLocal(this.v2.a);
      this.case2.setFrom(this.v1.w).mulLocal(this.v1.a).addLocal(this.case22);
      out.setFrom(this.case2);
      return;

    case (3):

      out.setZero();
      return;

    default:

      out.setZero();
      return;

  }
}
Simplex.prototype.getWitnessPoints = function(pA, pB) {
  switch (this.count) {
    case (0):

      break;

    case (1):

      pA.setFrom(this.v1.wA);
      pB.setFrom(this.v1.wB);
      break;

    case (2):

      this.case2.setFrom(this.v1.wA).mulLocal(this.v1.a);
      pA.setFrom(this.v2.wA).mulLocal(this.v2.a).addLocal(this.case2);
      this.case2.setFrom(this.v1.wB).mulLocal(this.v1.a);
      pB.setFrom(this.v2.wB).mulLocal(this.v2.a).addLocal(this.case2);
      break;

    case (3):

      pA.setFrom(this.v1.wA).mulLocal(this.v1.a);
      this.case3.setFrom(this.v2.wA).mulLocal(this.v2.a);
      this.case33.setFrom(this.v3.wA).mulLocal(this.v3.a);
      pA.addLocal(this.case3).addLocal(this.case33);
      pB.setFrom(pA);
      break;

    default:

      break;

  }
}
Simplex.prototype.getMetric = function() {
  switch (this.count) {
    case (0):

      return (0);

    case (1):

      return (0);

    case (2):

      return MathBox.distance(this.v1.w, this.v2.w);

    case (3):

      this.case3.setFrom(this.v2.w).subLocal(this.v1.w);
      this.case33.setFrom(this.v3.w).subLocal(this.v1.w);
      return Vector.crossVectors(this.case3, this.case33);

    default:

      return (0);

  }
}
Simplex.prototype.solve2 = function() {
  var w1 = this.v1.w;
  var w2 = this.v2.w;
  this.e12.setFrom(w2).subLocal(w1);
  var d12_2 = -Vector.dot(w1, this.e12);
  if (d12_2 <= (0)) {
    this.v1.a = (1);
    this.count = (1);
    return;
  }
  var d12_1 = Vector.dot(w2, this.e12);
  if (d12_1 <= (0)) {
    this.v2.a = (1);
    this.count = (1);
    this.v1.setFrom(this.v2);
    return;
  }
  var inv_d12 = (1) / (d12_1 + d12_2);
  this.v1.a = d12_1 * inv_d12;
  this.v2.a = d12_2 * inv_d12;
  this.count = (2);
}
Simplex.prototype.solve3 = function() {
  var w1 = this.v1.w;
  var w2 = this.v2.w;
  var w3 = this.v3.w;
  this.e12.setFrom(w2).subLocal(w1);
  var w1e12 = Vector.dot(w1, this.e12);
  var w2e12 = Vector.dot(w2, this.e12);
  var d12_1 = w2e12;
  var d12_2 = -w1e12;
  this.e13.setFrom(w3).subLocal(w1);
  var w1e13 = Vector.dot(w1, this.e13);
  var w3e13 = Vector.dot(w3, this.e13);
  var d13_1 = w3e13;
  var d13_2 = -w1e13;
  this.e23.setFrom(w3).subLocal(w2);
  var w2e23 = Vector.dot(w2, this.e23);
  var w3e23 = Vector.dot(w3, this.e23);
  var d23_1 = w3e23;
  var d23_2 = -w2e23;
  var n123 = Vector.crossVectors(this.e12, this.e13);
  var d123_1 = n123 * Vector.crossVectors(w2, w3);
  var d123_2 = n123 * Vector.crossVectors(w3, w1);
  var d123_3 = n123 * Vector.crossVectors(w1, w2);
  if (d12_2 <= (0) && d13_2 <= (0)) {
    this.v1.a = (1);
    this.count = (1);
    return;
  }
  if (d12_1 > (0) && d12_2 > (0) && d123_3 <= (0)) {
    var inv_d12 = (1) / (d12_1 + d12_2);
    this.v1.a = d12_1 * inv_d12;
    this.v2.a = d12_2 * inv_d12;
    this.count = (2);
    return;
  }
  if (d13_1 > (0) && d13_2 > (0) && d123_2 <= (0)) {
    var inv_d13 = (1) / (d13_1 + d13_2);
    this.v1.a = d13_1 * inv_d13;
    this.v3.a = d13_2 * inv_d13;
    this.count = (2);
    this.v2.setFrom(this.v3);
    return;
  }
  if (d12_1 <= (0) && d23_2 <= (0)) {
    this.v2.a = (1);
    this.count = (1);
    this.v1.setFrom(this.v2);
    return;
  }
  if (d13_1 <= (0) && d23_1 <= (0)) {
    this.v3.a = (1);
    this.count = (1);
    this.v1.setFrom(this.v3);
    return;
  }
  if (d23_1 > (0) && d23_2 > (0) && d123_1 <= (0)) {
    var inv_d23 = (1) / (d23_1 + d23_2);
    this.v2.a = d23_1 * inv_d23;
    this.v3.a = d23_2 * inv_d23;
    this.count = (2);
    this.v1.setFrom(this.v3);
    return;
  }
  var inv_d123 = (1) / (d123_1 + d123_2 + d123_3);
  this.v1.a = d123_1 * inv_d123;
  this.v2.a = d123_2 * inv_d123;
  this.v3.a = d123_3 * inv_d123;
  this.count = (3);
}
// ********** Code for SimplexCache **************
function SimplexCache() {
  this.indexA = new Array((3));
  this.metric = (0);
  this.indexB = new Array((3));
  this.count = (0);
  for (var i = (0);
   i < (3); i++) {
    this.indexA.$setindex(i, (2147483647));
    this.indexB.$setindex(i, (2147483647));
  }
}
// ********** Code for SimplexVertex **************
function SimplexVertex() {
  this.w = new Vector((0), (0));
  this.a = (0);
  this.wB = new Vector((0), (0));
  this.indexB = (0);
  this.wA = new Vector((0), (0));
  this.indexA = (0);
}
SimplexVertex.prototype.setFrom = function(sv) {
  this.wA.setFrom(sv.wA);
  this.wB.setFrom(sv.wB);
  this.w.setFrom(sv.w);
  this.a = sv.a;
  this.indexA = sv.indexA;
  this.indexB = sv.indexB;
}
SimplexVertex.prototype.toString = function() {
  return $add($add($add($add($add("wA: ", this.wA.toString()), " wB: "), this.wB.toString()), " w: "), this.w.toString());
}
// ********** Code for TimeOfImpact **************
TimeOfImpact._construct$ctor = function(argPool) {
  this.fcn = new SeparationFunction();
  this.xfB = new Transform();
  this.indexes = new Array((2));
  this.xfA = new Transform();
  this.distanceInput = new DistanceInput();
  this.distanceOutput = new DistanceOutput();
  this.sweepA = new Sweep();
  this.cache = new SimplexCache();
  this.pool = argPool;
  this.sweepB = new Sweep();
  this.indexes.$setindex((0), (0));
  this.indexes.$setindex((1), (0));
  $globals.TimeOfImpact_toiCalls = (0);
  $globals.TimeOfImpact_toiIters = (0);
  $globals.TimeOfImpact_toiMaxIters = (0);
  $globals.TimeOfImpact_toiRootIters = (0);
  $globals.TimeOfImpact_toiMaxRootIters = (0);
}
TimeOfImpact._construct$ctor.prototype = TimeOfImpact.prototype;
function TimeOfImpact() {}
TimeOfImpact.prototype.timeOfImpact = function(output, input) {
  ++$globals.TimeOfImpact_toiCalls;
  output.state = (0);
  output.t = input.tMax;
  var proxyA = input.proxyA;
  var proxyB = input.proxyB;
  this.sweepA.setFrom(input.sweepA);
  this.sweepB.setFrom(input.sweepB);
  this.sweepA.normalize();
  this.sweepB.normalize();
  var tMax = input.tMax;
  var totalRadius = proxyA.radius + proxyB.radius;
  var target = Math.max((0.005), totalRadius - (0.015));
  var tolerance = (0.00125);
  var t1 = (0);
  var iter = (0);
  this.cache.count = (0);
  this.distanceInput.proxyA = input.proxyA;
  this.distanceInput.proxyB = input.proxyB;
  this.distanceInput.useRadii = false;
  while (true) {
    this.sweepA.getTransform(this.xfA, t1);
    this.sweepB.getTransform(this.xfB, t1);
    this.distanceInput.transformA = this.xfA;
    this.distanceInput.transformB = this.xfB;
    this.pool.distance.distance(this.distanceOutput, this.cache, this.distanceInput);
    if (this.distanceOutput.distance <= (0)) {
      output.state = (2);
      output.t = (0);
      break;
    }
    if (this.distanceOutput.distance < target + tolerance) {
      output.state = (3);
      output.t = t1;
      break;
    }
    this.fcn.initialize(this.cache, proxyA, this.sweepA, proxyB, this.sweepB, t1);
    var done = false;
    var t2 = tMax;
    var pushBackIter = (0);
    while (true) {
      var s2 = this.fcn.findMinSeparation(this.indexes, t2);
      if (s2 > target + tolerance) {
        output.state = (4);
        output.t = tMax;
        done = true;
        break;
      }
      if (s2 > target - tolerance) {
        t1 = t2;
        break;
      }
      var s1 = this.fcn.evaluate(this.indexes.$index((0)), this.indexes.$index((1)), t1);
      if (s1 < target - tolerance) {
        output.state = (1);
        output.t = t1;
        done = true;
        break;
      }
      if (s1 <= target + tolerance) {
        output.state = (3);
        output.t = t1;
        done = true;
        break;
      }
      var rootIterCount = (0);
      var a1 = t1, a2 = t2;
      while (true) {
        var t = null;
        if ((rootIterCount & (1)) == (1)) {
          t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
        }
        else {
          t = (0.5) * (a1 + a2);
        }
        var s = this.fcn.evaluate(this.indexes.$index((0)), this.indexes.$index((1)), t);
        if ((s - target).abs() < tolerance) {
          t2 = t;
          break;
        }
        if (s > target) {
          a1 = t;
          s1 = s;
        }
        else {
          a2 = t;
          s2 = s;
        }
        ++rootIterCount;
        ++$globals.TimeOfImpact_toiRootIters;
        if (rootIterCount == (50)) {
          break;
        }
      }
      $globals.TimeOfImpact_toiMaxRootIters = Math.max($globals.TimeOfImpact_toiMaxRootIters, rootIterCount);
      ++pushBackIter;
      if (pushBackIter == (8)) {
        break;
      }
    }
    ++iter;
    ++$globals.TimeOfImpact_toiIters;
    if (done) {
      break;
    }
    if (iter == (1000)) {
      output.state = (1);
      output.t = t1;
      break;
    }
  }
  $globals.TimeOfImpact_toiMaxIters = Math.max($globals.TimeOfImpact_toiMaxIters, iter);
}
// ********** Code for SeparationFunction **************
function SeparationFunction() {
  this.temp = new Vector((0), (0));
  this.normal = new Vector((0), (0));
  this.axis = new Vector((0), (0));
  this.localPointA1 = new Vector((0), (0));
  this.sweepB = new Sweep();
  this.proxyA = new DistanceProxy();
  this.proxyB = new DistanceProxy();
  this.sweepA = new Sweep();
  this.pointA = new Vector((0), (0));
  this.pointB = new Vector((0), (0));
  this.localPointA2 = new Vector((0), (0));
  this.localPointA = new Vector((0), (0));
  this.localPointB = new Vector((0), (0));
  this.xfb = new Transform();
  this.xfa = new Transform();
  this.localPoint = new Vector((0), (0));
  this.localPointB2 = new Vector((0), (0));
  this.localPointB1 = new Vector((0), (0));
  this.axisB = new Vector((0), (0));
  this.type = (0);
  this.axisA = new Vector((0), (0));
}
SeparationFunction.prototype.get$type = function() { return this.type; };
SeparationFunction.prototype.set$type = function(value) { return this.type = value; };
SeparationFunction.prototype.initialize = function(cache, argProxyA, argSweepA, argProxyB, argSweepB, t1) {
  this.proxyA = argProxyA;
  this.proxyB = argProxyB;
  var count = cache.count;
  this.sweepA = argSweepA;
  this.sweepB = argSweepB;
  this.sweepA.getTransform(this.xfa, t1);
  this.sweepB.getTransform(this.xfb, t1);
  if (count == (1)) {
    this.type = (0);
    this.localPointA.setFrom(this.proxyA.vertices[cache.indexA.$index((0))]);
    this.localPointB.setFrom(this.proxyB.vertices[cache.indexB.$index((0))]);
    Transform.mulToOut(this.xfa, this.localPointA, this.pointA);
    Transform.mulToOut(this.xfb, this.localPointB, this.pointB);
    this.axis.setFrom(this.pointB).subLocal(this.pointA);
    var s = this.axis.normalize();
    return s;
  }
  else if (cache.indexA.$index((0)) == cache.indexA.$index((1))) {
    this.type = (2);
    this.localPointB1.setFrom(this.proxyB.vertices[cache.indexB.$index((0))]);
    this.localPointB2.setFrom(this.proxyB.vertices[cache.indexB.$index((1))]);
    this.temp.setFrom(this.localPointB2).subLocal(this.localPointB1);
    Vector.crossVectorAndNumToOut(this.temp, (1), this.axis);
    this.axis.normalize();
    Matrix22.mulMatrixAndVectorToOut(this.xfb.rotation, this.axis, this.normal);
    this.localPoint.setFrom(this.localPointB1);
    this.localPoint.addLocal(this.localPointB2);
    this.localPoint.mulLocal((0.5));
    Transform.mulToOut(this.xfb, this.localPoint, this.pointB);
    this.localPointA.setFrom(this.proxyA.vertices[cache.indexA.$index((0))]);
    Transform.mulToOut(this.xfa, this.localPointA, this.pointA);
    this.temp.setFrom(this.pointA);
    this.temp.subLocal(this.pointB);
    var s = Vector.dot(this.temp, this.normal);
    if (s < (0)) {
      this.axis.negateLocal();
      s = -s;
    }
    return s;
  }
  else {
    this.type = (1);
    this.localPointA1.setFrom(this.proxyA.vertices[cache.indexA.$index((0))]);
    this.localPointA2.setFrom(this.proxyA.vertices[cache.indexA.$index((1))]);
    this.temp.setFrom(this.localPointA2);
    this.temp.subLocal(this.localPointA1);
    Vector.crossVectorAndNumToOut(this.temp, (1), this.axis);
    this.axis.normalize();
    Matrix22.mulMatrixAndVectorToOut(this.xfa.rotation, this.axis, this.normal);
    this.localPoint.setFrom(this.localPointA1);
    this.localPoint.addLocal(this.localPointA2);
    this.localPoint.mulLocal((0.5));
    Transform.mulToOut(this.xfa, this.localPoint, this.pointA);
    this.localPointB.setFrom(this.proxyB.vertices[cache.indexB.$index((0))]);
    Transform.mulToOut(this.xfb, this.localPointB, this.pointB);
    this.temp.setFrom(this.pointB);
    this.temp.subLocal(this.pointA);
    var s = Vector.dot(this.temp, this.normal);
    if (s < (0)) {
      this.axis.negateLocal();
      s = -s;
    }
    return s;
  }
}
SeparationFunction.prototype.findMinSeparation = function(indexes, t) {
  this.sweepA.getTransform(this.xfa, t);
  this.sweepB.getTransform(this.xfb, t);
  switch (this.type) {
    case (0):

      Matrix22.mulTransMatrixAndVectorToOut(this.xfa.rotation, this.axis, this.axisA);
      Matrix22.mulTransMatrixAndVectorToOut(this.xfb.rotation, this.axis.negateLocal(), this.axisB);
      this.axis.negateLocal();
      indexes.$setindex((0), this.proxyA.getSupport(this.axisA));
      indexes.$setindex((1), this.proxyB.getSupport(this.axisB));
      this.localPointA.setFrom(this.proxyA.vertices[indexes.$index((0))]);
      this.localPointB.setFrom(this.proxyB.vertices[indexes.$index((1))]);
      Transform.mulToOut(this.xfa, this.localPointA, this.pointA);
      Transform.mulToOut(this.xfb, this.localPointB, this.pointB);
      var separation = Vector.dot(this.pointB.subLocal(this.pointA), this.axis);
      return separation;

    case (1):

      Matrix22.mulMatrixAndVectorToOut(this.xfa.rotation, this.axis, this.normal);
      Transform.mulToOut(this.xfa, this.localPoint, this.pointA);
      this.normal.negateLocal();
      Matrix22.mulTransMatrixAndVectorToOut(this.xfb.rotation, this.normal, this.axisB);
      this.normal.negateLocal();
      indexes.$setindex((0), (-1));
      indexes.$setindex((1), this.proxyB.getSupport(this.axisB));
      this.localPointB.setFrom(this.proxyB.vertices[indexes.$index((1))]);
      Transform.mulToOut(this.xfb, this.localPointB, this.pointB);
      var separation = Vector.dot(this.pointB.subLocal(this.pointA), this.normal);
      return separation;

    case (2):

      Matrix22.mulMatrixAndVectorToOut(this.xfb.rotation, this.axis, this.normal);
      Transform.mulToOut(this.xfb, this.localPoint, this.pointB);
      Matrix22.mulTransMatrixAndVectorToOut(this.xfa.rotation, this.normal.negateLocal(), this.axisA);
      this.normal.negateLocal();
      indexes.$setindex((1), (-1));
      indexes.$setindex((0), this.proxyA.getSupport(this.axisA));
      this.localPointA.setFrom(this.proxyA.vertices[indexes.$index((0))]);
      Transform.mulToOut(this.xfa, this.localPointA, this.pointA);
      var separation = Vector.dot(this.pointA.subLocal(this.pointB), this.normal);
      return separation;

    default:

      indexes.$setindex((0), (-1));
      indexes.$setindex((1), (-1));
      return (0);

  }
}
SeparationFunction.prototype.evaluate = function(indexA, indexB, t) {
  this.sweepA.getTransform(this.xfa, t);
  this.sweepB.getTransform(this.xfb, t);
  switch (this.type) {
    case (0):

      Matrix22.mulTransMatrixAndVectorToOut(this.xfa.rotation, this.axis, this.axisA);
      Matrix22.mulTransMatrixAndVectorToOut(this.xfb.rotation, this.axis.negateLocal(), this.axisB);
      this.axis.negateLocal();
      this.localPointA.setFrom(this.proxyA.vertices[indexA]);
      this.localPointB.setFrom(this.proxyB.vertices[indexB]);
      Transform.mulToOut(this.xfa, this.localPointA, this.pointA);
      Transform.mulToOut(this.xfb, this.localPointB, this.pointB);
      var separation = Vector.dot(this.pointB.subLocal(this.pointA), this.axis);
      return separation;

    case (1):

      Matrix22.mulMatrixAndVectorToOut(this.xfa.rotation, this.axis, this.normal);
      Transform.mulToOut(this.xfa, this.localPoint, this.pointA);
      this.normal.negateLocal();
      Matrix22.mulTransMatrixAndVectorToOut(this.xfb.rotation, this.normal, this.axisB);
      this.normal.negateLocal();
      this.localPointB.setFrom(this.proxyB.vertices[indexB]);
      Transform.mulToOut(this.xfb, this.localPointB, this.pointB);
      var separation = Vector.dot(this.pointB.subLocal(this.pointA), this.normal);
      return separation;

    case (2):

      Matrix22.mulMatrixAndVectorToOut(this.xfb.rotation, this.axis, this.normal);
      Transform.mulToOut(this.xfb, this.localPoint, this.pointB);
      Matrix22.mulTransMatrixAndVectorToOut(this.xfa.rotation, this.normal.negateLocal(), this.axisA);
      this.normal.negateLocal();
      this.localPointA.setFrom(this.proxyA.vertices[indexA]);
      Transform.mulToOut(this.xfa, this.localPointA, this.pointA);
      var separation = Vector.dot(this.pointA.subLocal(this.pointB), this.normal);
      return separation;

    default:

      return (0);

  }
}
// ********** Code for TimeOfImpactInput **************
function TimeOfImpactInput() {
  this.tMax = (0);
  this.sweepB = new Sweep();
  this.proxyA = new DistanceProxy();
  this.proxyB = new DistanceProxy();
  this.sweepA = new Sweep();
}
// ********** Code for TimeOfImpactOutputState **************
function TimeOfImpactOutputState() {}
// ********** Code for TimeOfImpactOutput **************
function TimeOfImpactOutput() {
  this.state = (0);
  this.t = (0);
}
// ********** Code for Type **************
function Type() {}
// ********** Code for WorldManifold **************
function WorldManifold() {
  this.pool3 = new Vector((0), (0));
  this.normal = new Vector((0), (0));
  this.points = new Array((2));
  this.pool4 = new Vector((0), (0));
  for (var i = (0);
   i < (2); i++) {
    this.points.$setindex(i, new Vector((0), (0)));
  }
}
WorldManifold.prototype.initialize = function(manifold, xfA, radiusA, xfB, radiusB) {
  switch (manifold.type) {
    case (0):

      var pointA = this.pool3;
      var pointB = this.pool4;
      this.normal.x = (1);
      this.normal.y = (0);
      pointA.x = xfA.position.x + xfA.rotation.col1.x * manifold.localPoint.x + xfA.rotation.col2.x * manifold.localPoint.y;
      pointA.y = xfA.position.y + xfA.rotation.col1.y * manifold.localPoint.x + xfA.rotation.col2.y * manifold.localPoint.y;
      pointB.x = xfB.position.x + xfB.rotation.col1.x * manifold.points[(0)].localPoint.x + xfB.rotation.col2.x * manifold.points[(0)].localPoint.y;
      pointB.y = xfB.position.y + xfB.rotation.col1.y * manifold.points[(0)].localPoint.x + xfB.rotation.col2.y * manifold.points[(0)].localPoint.y;
      if (MathBox.distanceSquared(pointA, pointB) > (1.4208639999999999e-14)) {
        this.normal.x = pointB.x - pointA.x;
        this.normal.y = pointB.y - pointA.y;
        this.normal.normalize();
      }
      var cAx = this.normal.x * radiusA + pointA.x;
      var cAy = this.normal.y * radiusA + pointA.y;
      var cBx = -this.normal.x * radiusB + pointB.x;
      var cBy = -this.normal.y * radiusB + pointB.y;
      this.points[(0)].x = (cAx + cBx) * (0.5);
      this.points[(0)].y = (cAy + cBy) * (0.5);
      return;

    case (1):

      var planePoint = this.pool3;
      this.normal.x = xfA.rotation.col1.x * manifold.localNormal.x + xfA.rotation.col2.x * manifold.localNormal.y;
      this.normal.y = xfA.rotation.col1.y * manifold.localNormal.x + xfA.rotation.col2.y * manifold.localNormal.y;
      planePoint.x = xfA.position.x + xfA.rotation.col1.x * manifold.localPoint.x + xfA.rotation.col2.x * manifold.localPoint.y;
      planePoint.y = xfA.position.y + xfA.rotation.col1.y * manifold.localPoint.x + xfA.rotation.col2.y * manifold.localPoint.y;
      var clipPoint = this.pool4;
      for (var i = (0);
       i < manifold.pointCount; i++) {
        clipPoint.x = xfB.position.x + xfB.rotation.col1.x * manifold.points[i].localPoint.x + xfB.rotation.col2.x * manifold.points[i].localPoint.y;
        clipPoint.y = xfB.position.y + xfB.rotation.col1.y * manifold.points[i].localPoint.x + xfB.rotation.col2.y * manifold.points[i].localPoint.y;
        var scalar = radiusA - ((clipPoint.x - planePoint.x) * this.normal.x + (clipPoint.y - planePoint.y) * this.normal.y);
        var cAx = this.normal.x * scalar + clipPoint.x;
        var cAy = this.normal.y * scalar + clipPoint.y;
        var cBx = -this.normal.x * radiusB + clipPoint.x;
        var cBy = -this.normal.y * radiusB + clipPoint.y;
        this.points[i].x = (cAx + cBx) * (0.5);
        this.points[i].y = (cAy + cBy) * (0.5);
      }
      return;

    case (2):

      var planePoint = this.pool3;
      var R = xfB.rotation;
      this.normal.x = R.col1.x * manifold.localNormal.x + R.col2.x * manifold.localNormal.y;
      this.normal.y = R.col1.y * manifold.localNormal.x + R.col2.y * manifold.localNormal.y;
      var v = manifold.localPoint;
      planePoint.x = xfB.position.x + xfB.rotation.col1.x * v.x + xfB.rotation.col2.x * v.y;
      planePoint.y = xfB.position.y + xfB.rotation.col1.y * v.x + xfB.rotation.col2.y * v.y;
      var clipPoint = this.pool4;
      for (var i = (0);
       i < manifold.pointCount; i++) {
        clipPoint.x = xfA.position.x + xfA.rotation.col1.x * manifold.points[i].localPoint.x + xfA.rotation.col2.x * manifold.points[i].localPoint.y;
        clipPoint.y = xfA.position.y + xfA.rotation.col1.y * manifold.points[i].localPoint.x + xfA.rotation.col2.y * manifold.points[i].localPoint.y;
        var scalar = radiusB - ((clipPoint.x - planePoint.x) * this.normal.x + (clipPoint.y - planePoint.y) * this.normal.y);
        var cBx = this.normal.x * scalar + clipPoint.x;
        var cBy = this.normal.y * scalar + clipPoint.y;
        var cAx = -this.normal.x * radiusA + clipPoint.x;
        var cAy = -this.normal.y * radiusA + clipPoint.y;
        this.points[i].x = (cAx + cBx) * (0.5);
        this.points[i].y = (cAy + cBy) * (0.5);
      }
      this.normal.x = -this.normal.x;
      this.normal.y = -this.normal.y;
      break;

  }
}
// ********** Code for BroadPhase **************
function BroadPhase() {
  this._pairCapacity = (16);
  this._moveCapacity = (16);
  this._pairCount = (0);
  this.proxyCount = (0);
  this._tree = new DynamicTree();
  this._moveCount = (0);
  this.queryProxy = null;
  this.moveBuffer = new Array(this._moveCapacity);
  this._pairBuffer = new Array(this._pairCapacity);
  for (var i = (0);
   i < this._pairCapacity; i++) {
    this._pairBuffer.$setindex(i, new Pair());
  }
}
BroadPhase.prototype.createProxy = function(box, userData) {
  var node = this._tree.createProxy(box, userData);
  this.proxyCount++;
  this._bufferMove(node);
  return node;
}
BroadPhase.prototype.moveProxy = function(proxy, box, displacement) {
  var buffer = this._tree.moveProxy(proxy, box, displacement);
  if (buffer) {
    this._bufferMove(proxy);
  }
}
BroadPhase.prototype.testOverlap = function(proxyA, proxyB) {
  var a = proxyA.box;
  var b = proxyB.box;
  if (b.lowerBound.x - a.upperBound.x > (0) || b.lowerBound.y - a.upperBound.y > (0)) {
    return false;
  }
  if (a.lowerBound.x - b.upperBound.x > (0) || a.lowerBound.y - b.upperBound.y > (0)) {
    return false;
  }
  return true;
}
BroadPhase.prototype.updatePairs = function(callback) {
  this._pairCount = (0);
  for (var i = (0);
   i < this._moveCount; ++i) {
    this.queryProxy = this.moveBuffer[i];
    if (this.queryProxy == null) {
      continue;
    }
    this._tree.query(this, this.queryProxy.box);
  }
  this._moveCount = (0);
  var pairBuffer = ListFactory.ListFactory$from$factory(this._pairBuffer.getRange((0), this._pairCount));
  pairBuffer.sort((function (a, b) {
    return a.compareTo(b);
  })
  );
  this._pairBuffer.setRange$3((0), this._pairCount, pairBuffer);
  var i = (0);
  while (i < this._pairCount) {
    var primaryPair = this._pairBuffer[i];
    var userDataA = primaryPair.proxyA.userData;
    var userDataB = primaryPair.proxyB.userData;
    callback.addPair(userDataA, userDataB);
    i++;
    while (i < this._pairCount) {
      var pair = this._pairBuffer[i];
      if (pair.proxyA != primaryPair.proxyA || pair.proxyB != primaryPair.proxyB) {
        break;
      }
      i++;
    }
  }
  this._tree.rebalance((4));
}
BroadPhase.prototype.treeCallback = function(proxy) {
  if ($eq(proxy, this.queryProxy)) {
    return true;
  }
  if (this._pairCount == this._pairCapacity) {
    var oldBuffer = this._pairBuffer;
    this._pairCapacity = this._pairCapacity * (2);
    this._pairBuffer = new Array(this._pairCapacity);
    for (var i = (0);
     i < oldBuffer.get$length(); i++) {
      this._pairBuffer.$setindex(i, oldBuffer[i]);
    }
    for (var i = oldBuffer.get$length();
     i < this._pairCapacity; i++) {
      this._pairBuffer.$setindex(i, new Pair());
    }
  }
  if (proxy.key < this.queryProxy.key) {
    this._pairBuffer[this._pairCount].proxyA = proxy;
    this._pairBuffer[this._pairCount].proxyB = this.queryProxy;
  }
  else {
    this._pairBuffer[this._pairCount].proxyA = this.queryProxy;
    this._pairBuffer[this._pairCount].proxyB = proxy;
  }
  this._pairCount++;
  return true;
}
BroadPhase.prototype._bufferMove = function(node) {
  if (this._moveCount == this._moveCapacity) {
    var old = this.moveBuffer;
    this._moveCapacity = this._moveCapacity * (2);
    this.moveBuffer = new Array(this._moveCapacity);
    for (var i = (0);
     i < old.get$length(); i++) {
      this.moveBuffer.$setindex(i, old[i]);
    }
  }
  this.moveBuffer.$setindex(this._moveCount, node);
  ++this._moveCount;
}
// ********** Code for DynamicTree **************
function DynamicTree() {
  this._path = (0);
  this.deltaOne = new Vector((0), (0));
  this._nodeCount = (0);
  this._lastLeaf = null;
  this._drawVectors = new Array((4));
  this.center = new Vector((0), (0));
  this._tempVector = new Vector((0), (0));
  this._nodeStack = new DoubleLinkedQueue_DynamicTreeNode();
  this._root = null;
  this._insertionCount = (0);
  this._tempBox = new AxisAlignedBox();
  this.deltaTwo = new Vector((0), (0));
  this._nodeCounter = (0);
  for (var i = (0);
   i < this._drawVectors.get$length(); i++) {
    this._drawVectors.$setindex(i, new Vector((0), (0)));
  }
}
DynamicTree.prototype.get$center = function() { return this.center; };
DynamicTree.prototype.createProxy = function(box, userData) {
  var proxy = this._allocateNode();
  proxy.box.lowerBound.x = box.lowerBound.x - (0.1);
  proxy.box.lowerBound.y = box.lowerBound.y - (0.1);
  proxy.box.upperBound.x = box.upperBound.x + (0.1);
  proxy.box.upperBound.y = box.upperBound.y + (0.1);
  proxy.userData = userData;
  this._insertLeaf(proxy);
  var iterationCount = this._nodeCount >> (4);
  var tryCount = (0);
  var height = this.computeHeightFromRoot();
  while (height > (64) && tryCount < (10)) {
    this.rebalance(iterationCount);
    height = this.computeHeightFromRoot();
    tryCount++;
  }
  return proxy;
}
DynamicTree.prototype.moveProxy = function(argProxy, argBox, displacement) {
  var $0, $1, $2, $3, $4, $5, $6, $7;
  if (argProxy.box.contains(argBox)) {
    return false;
  }
  this._removeLeaf(argProxy);
  ($0 = argBox.lowerBound).x = $0.x - (0.1);
  ($1 = argBox.lowerBound).y = $1.y - (0.1);
  ($2 = argBox.upperBound).x = $2.x + (0.1);
  ($3 = argBox.upperBound).y = $3.y + (0.1);
  this._tempVector.setFrom(displacement);
  this._tempVector.mulLocal((2));
  if (this._tempVector.x < (0)) {
    ($4 = argBox.lowerBound).x = $4.x + this._tempVector.x;
  }
  else {
    ($5 = argBox.upperBound).x = $5.x + this._tempVector.x;
  }
  if (this._tempVector.y < (0)) {
    ($6 = argBox.lowerBound).y = $6.y + this._tempVector.y;
  }
  else {
    ($7 = argBox.upperBound).y = $7.y + this._tempVector.y;
  }
  argProxy.box.setFrom(argBox);
  this._insertLeaf(argProxy);
  return true;
}
DynamicTree.prototype._allocateNode = function() {
  if (this._nodeStack.isEmpty()) {
    for (var i = (0);
     i < (6); i++) {
      this._nodeStack.addFirst(new DynamicTreeNode._construct$ctor());
    }
  }
  var node = this._nodeStack.removeFirst();
  node.parent = null;
  node.childOne = null;
  node.childTwo = null;
  node.userData = null;
  node.key = this._nodeCounter;
  this._nodeCounter++;
  this._nodeCount++;
  return node;
}
DynamicTree.prototype.query = function(callback, argBox) {
  this._query(callback, argBox, this._root, (1));
}
DynamicTree.prototype._query = function(callback, argBox, node, count) {
  if (node == null) {
    return true;
  }
  if (AxisAlignedBox.testOverlap(argBox, node.box)) {
    if (node.get$isLeaf()) {
      var proceed = callback.treeCallback(node);
      if (!proceed) {
        return false;
      }
    }
    else {
      if (count < (64)) {
        count++;
        var proceed = this._query(callback, argBox, node.childOne, count);
        if (!proceed) {
          return false;
        }
      }
      if (count < (64)) {
        count++;
        var proceed = this._query(callback, argBox, node.childTwo, count);
        if (!proceed) {
          return false;
        }
      }
    }
  }
  return true;
}
DynamicTree.prototype._insertLeaf = function(node) {
  this._insertionCount++;
  if (this._root == null) {
    this._root = node;
    node.parent = null;
    return;
  }
  this.center.setFrom(node.box.get$center());
  var sibling = this._root;
  var childOne, childTwo;
  if (!sibling.get$isLeaf()) {
    do {
      childOne = sibling.childOne;
      childTwo = sibling.childTwo;
      this.deltaOne.setFrom(childOne.box.get$center());
      this.deltaTwo.setFrom(childTwo.box.get$center());
      this.deltaOne.subLocal(this.center).absLocal();
      this.deltaTwo.subLocal(this.center).absLocal();
      var normOne = this.deltaOne.x + this.deltaOne.y;
      var normTwo = this.deltaTwo.x + this.deltaTwo.y;
      if (normOne < normTwo) {
        sibling = childOne;
      }
      else {
        sibling = childTwo;
      }
    }
    while ($eq(sibling.get$isLeaf(), false))
  }
  var node1 = sibling.parent;
  var node2 = this._allocateNode();
  node2.parent = node1;
  node2.userData = null;
  node2.box.setFromCombination(node.box, sibling.box);
  if (node1 != null) {
    if (sibling.parent.childOne == sibling) {
      node1.childOne = node2;
    }
    else {
      node1.childTwo = node2;
    }
    node2.childOne = sibling;
    node2.childTwo = node;
    sibling.parent = node2;
    node.parent = node2;
    do {
      if (node1.box.contains(node2.box)) {
        break;
      }
      node1.box.setFromCombination(node1.childOne.box, node1.childTwo.box);
      node2 = node1;
      node1 = node1.parent;
    }
    while (node1 != null)
  }
  else {
    node2.childOne = sibling;
    node2.childTwo = node;
    sibling.parent = node2;
    node.parent = node2;
    this._root = node2;
  }
}
DynamicTree.prototype._removeLeaf = function(argNode) {
  if (argNode == this._root) {
    this._root = null;
    if (this._lastLeaf == argNode) {
      this._lastLeaf = null;
    }
    return;
  }
  var node2 = argNode.parent;
  var node1 = node2.parent;
  var sibling;
  if (node2.childOne == argNode) {
    sibling = node2.childTwo;
  }
  else {
    sibling = node2.childOne;
  }
  if (node1 != null) {
    if (node1.childOne == node2) {
      node1.childOne = sibling;
    }
    else {
      node1.childTwo = sibling;
    }
    sibling.parent = node1;
    this._freeNode(node2);
    while (node1 != null) {
      this._tempBox.setFrom(node1.box);
      node1.box.setFromCombination(node1.childOne.box, node1.childTwo.box);
      if (this._tempBox.contains(node1.box)) {
        break;
      }
      node1 = node1.parent;
    }
  }
  else {
    this._root = sibling;
    sibling.parent = null;
    this._freeNode(node2);
  }
  if (this._lastLeaf == argNode) {
    this._lastLeaf = this._root;
  }
}
DynamicTree.prototype.computeHeightFromRoot = function() {
  return this._computeHeight(this._root);
}
DynamicTree.prototype._computeHeight = function(node) {
  if (node == null) {
    return (0);
  }
  var heightOne = this._computeHeight(node.childOne);
  var heightTwo = this._computeHeight(node.childTwo);
  return (1) + Math.max(heightOne, heightTwo);
}
DynamicTree.prototype.rebalance = function(iterations) {
  if (this._root == null) {
    return;
  }
  var current;
  for (var i = (0);
   i < iterations; i++) {
    current = this._root;
    var bit = (0);
    while (!current.get$isLeaf()) {
      var goLeft = (this._path >> bit) & (1);
      if (goLeft == (0)) {
        current = current.childOne;
      }
      else {
        current = current.childTwo;
      }
      bit = (bit + (1)) & (31);
    }
    this._path++;
    this._removeLeaf(current);
    this._insertLeaf(current);
  }
}
DynamicTree.prototype._freeNode = function(node) {
  this._nodeStack.addFirst(node);
  this._nodeCount--;
}
// ********** Code for DynamicTreeNode **************
DynamicTreeNode._construct$ctor = function() {
  this.childOne = null;
  this.next = null;
  this.parent = null;
  this.childTwo = null;
  this.box = new AxisAlignedBox();
}
DynamicTreeNode._construct$ctor.prototype = DynamicTreeNode.prototype;
function DynamicTreeNode() {}
DynamicTreeNode.prototype.get$isLeaf = function() {
  return this.childOne == null;
}
DynamicTreeNode.prototype.toString = function() {
  return this.box.toString();
}
// ********** Code for Pair **************
function Pair() {
  this.proxyA = null;
  this.proxyB = null;
}
Pair.prototype.compareTo = function(pair2) {
  if (this.proxyA.key < pair2.proxyA.key) {
    return (-1);
  }
  if (this.proxyA.key == pair2.proxyA.key) {
    if (this.proxyB.key < pair2.proxyB.key) {
      return (-1);
    }
    else {
      if (this.proxyB.key == pair2.proxyB.key) {
        return (0);
      }
      else {
        return (1);
      }
    }
  }
  return (1);
}
// ********** Code for MassData **************
function MassData() {
  this.center = new Vector((0), (0));
  this.mass = (0);
  this.inertia = (0);
}
MassData.prototype.get$center = function() { return this.center; };
MassData.prototype.set$center = function(value) { return this.center = value; };
// ********** Code for Shape **************
function Shape(type, radius) {
  this.type = type;
  this.radius = radius;
}
Shape.prototype.get$type = function() { return this.type; };
Shape.prototype.set$type = function(value) { return this.type = value; };
Shape.prototype.get$radius = function() { return this.radius; };
Shape.prototype.set$radius = function(value) { return this.radius = value; };
Shape.prototype.computeAxisAlignedBox = function(box, transform) {

}
Shape.prototype.computeMass = function(massData, density) {

}
Shape.prototype.clone = function() {

}
// ********** Code for PolygonShape **************
$inherits(PolygonShape, Shape);
function PolygonShape() {
  this.centroid = new Vector((0), (0));
  this.poolTransform = new Transform();
  this.vertices = new Array((8));
  this.vectorPool = new Array((6));
  this.vertexCount = (0);
  this.normals = new Array((8));
  Shape.call(this, (1), (0.01));
  for (var i = (0);
   i < (6); i++) {
    this.vectorPool.$setindex(i, new Vector((0), (0)));
  }
  for (var i = (0);
   i < this.vertices.get$length(); i++) {
    this.vertices.$setindex(i, new Vector((0), (0)));
  }
  for (var i = (0);
   i < this.normals.get$length(); i++) {
    this.normals.$setindex(i, new Vector((0), (0)));
  }
}
PolygonShape.copy$ctor = function(other) {
  this.centroid = new Vector.copy$ctor(other.centroid);
  this.poolTransform = new Transform();
  this.vertices = new Array((8));
  this.vectorPool = new Array((6));
  this.vertexCount = other.vertexCount;
  this.normals = new Array((8));
  Shape.call(this, (1), other.radius);
  for (var i = (0);
   i < (6); i++) {
    this.vectorPool.$setindex(i, new Vector((0), (0)));
  }
  for (var i = (0);
   i < other.vertices.get$length(); i++) {
    this.vertices.$setindex(i, new Vector.copy$ctor(other.vertices[i]));
  }
  for (var i = (0);
   i < other.normals.get$length(); i++) {
    this.normals.$setindex(i, new Vector.copy$ctor(other.normals[i]));
  }
}
PolygonShape.copy$ctor.prototype = PolygonShape.prototype;
PolygonShape.prototype.get$vertices = function() { return this.vertices; };
PolygonShape.prototype.get$vertexCount = function() { return this.vertexCount; };
PolygonShape.prototype.set$vertexCount = function(value) { return this.vertexCount = value; };
PolygonShape.prototype.clone = function() {
  return new PolygonShape.copy$ctor(this);
}
PolygonShape.prototype.setAsBox = function(hx, hy) {
  this.vertexCount = (4);
  this.vertices[(0)].setCoords(-hx, -hy);
  this.vertices[(1)].setCoords(hx, -hy);
  this.vertices[(2)].setCoords(hx, hy);
  this.vertices[(3)].setCoords(-hx, hy);
  this.normals[(0)].setCoords((0), (-1));
  this.normals[(1)].setCoords((1), (0));
  this.normals[(2)].setCoords((0), (1));
  this.normals[(3)].setCoords((-1), (0));
  this.centroid.setZero();
}
PolygonShape.prototype.setAsEdge = function(v1, v2) {
  this.vertexCount = (2);
  this.vertices[(0)].setFrom(v1);
  this.vertices[(1)].setFrom(v2);
  this.centroid.setFrom(v1).addLocal(v2).mulLocal((0.5));
  this.normals[(0)].setFrom(v2).subLocal(v1);
  Vector.crossVectorAndNumToOut(this.normals[(0)], (1), this.normals[(0)]);
  this.normals[(0)].normalize();
  this.normals[(1)].setFrom(this.normals[(0)]).negateLocal();
}
PolygonShape.prototype.computeAxisAlignedBox = function(argAabb, argXf) {
  var lower = this.vectorPool[(0)];
  var upper = this.vectorPool[(1)];
  var v = this.vectorPool[(2)];
  Transform.mulToOut(argXf, this.vertices[(0)], lower);
  upper.setFrom(lower);
  for (var i = (1);
   i < this.vertexCount; ++i) {
    Transform.mulToOut(argXf, this.vertices[i], v);
    Vector.minToOut(lower, v, lower);
    Vector.maxToOut(upper, v, upper);
  }
  argAabb.lowerBound.x = lower.x - this.radius;
  argAabb.lowerBound.y = lower.y - this.radius;
  argAabb.upperBound.x = upper.x + this.radius;
  argAabb.upperBound.y = upper.y + this.radius;
}
PolygonShape.prototype.computeMass = function(massData, density) {
  if (this.vertexCount == (2)) {
    massData.center.setFrom(this.vertices[(0)]).addLocal(this.vertices[(1)]).mulLocal((0.5));
    massData.mass = (0);
    massData.inertia = (0);
    return;
  }
  var center = this.vectorPool[(0)];
  center.setZero();
  var area = (0);
  var I = (0);
  var pRef = this.vectorPool[(1)];
  pRef.setZero();
  var k_inv3 = (0.3333333333333333);
  var e1 = this.vectorPool[(2)];
  var e2 = this.vectorPool[(3)];
  for (var i = (0);
   i < this.vertexCount; ++i) {
    var p1 = pRef;
    var p2 = this.vertices[i];
    var p3 = i + (1) < this.vertexCount ? this.vertices[i + (1)] : this.vertices[(0)];
    e1.setFrom(p2);
    e1.subLocal(p1);
    e2.setFrom(p3);
    e2.subLocal(p1);
    var D = Vector.crossVectors(e1, e2);
    var triangleArea = (0.5) * D;
    area += triangleArea;
    center.x = center.x + (triangleArea * k_inv3 * (p1.x + p2.x + p3.x));
    center.y = center.y + (triangleArea * k_inv3 * (p1.y + p2.y + p3.y));
    var px = p1.x;
    var py = p1.y;
    var ex1 = e1.x;
    var ey1 = e1.y;
    var ex2 = e2.x;
    var ey2 = e2.y;
    var intx2 = k_inv3 * ((0.25) * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + (0.5) * px * px;
    var inty2 = k_inv3 * ((0.25) * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + (0.5) * py * py;
    I += (D * (intx2 + inty2));
  }
  massData.mass = density * area;
  center.mulLocal((1) / area);
  massData.center.setFrom(center);
  massData.inertia = I * density;
}
// ********** Code for ShapeType **************
function ShapeType() {}
// ********** Code for ContactFilter **************
function ContactFilter() {

}
ContactFilter.prototype.shouldCollide = function(fixtureA, fixtureB) {
  var filterA = fixtureA.filter;
  var filterB = fixtureB.filter;
  if (filterA.groupIndex == filterB.groupIndex && filterA.groupIndex != (0)) {
    return filterA.groupIndex > (0);
  }
  var collide = (filterA.maskBits & filterB.categoryBits) != (0) && (filterA.categoryBits & filterB.maskBits) != (0);
  return collide;
}
// ********** Code for ContactImpulse **************
function ContactImpulse() {
  this.tangentImpulses = new Array((2));
  this.normalImpulses = new Array((2));
}
// ********** Code for Body **************
function Body(bd, world) {
  this._angularVelocity = (0);
  this.prev = null;
  this._force = new Vector((0), (0));
  this._linearVelocity = new Vector.copy$ctor(bd.linearVelocity);
  this._torque = (0);
  this._inertia = (0);
  this.sweep = new Sweep();
  this.oldCenter = new Vector((0), (0));
  this.fixtureCount = (0);
  this._pmd = new MassData();
  this.originTransform = new Transform();
  this.invInertia = (0);
  this.flags = (0);
  this.userData = bd.userData;
  this.sleepTime = (0);
  this.world = world;
  this.fixtureList = null;
  this.jointList = null;
  this.tempCenter = new Vector((0), (0));
  this._fixDef = new FixtureDef();
  this.next = null;
  this._pxf = new Transform();
  this.contactList = null;
  this._type = bd.type;
  this.angularDamping = bd.angularDamping;
  this.linearDamping = bd.linearDamping;
  if (bd.bullet) {
    this.flags = this.flags | (8);
  }
  if (bd.fixedRotation) {
    this.flags = this.flags | (16);
  }
  if (bd.allowSleep) {
    this.flags = this.flags | (4);
  }
  if (bd.awake) {
    this.flags = this.flags | (2);
  }
  if (bd.active) {
    this.flags = this.flags | (32);
  }
  this.originTransform.position.setFrom(bd.position);
  this.originTransform.rotation.setAngle(bd.angle);
  this.sweep.localCenter.setZero();
  Transform.mulToOut(this.originTransform, this.sweep.localCenter, this.sweep.centerZero);
  this.sweep.center.setFrom(this.sweep.centerZero);
  this.sweep.angle = bd.angle;
  this.sweep.angleZero = bd.angle;
  if (this._type == (2)) {
    this.mass = (1);
    this.invMass = (1);
  }
  else {
    this.mass = (0);
    this.invMass = (0);
  }
}
Body.prototype.createFixture = function(def) {
  var $0;
  var fixture = new Fixture();
  fixture.create(this, def);
  if ((this.flags & (32)) == (32)) {
    var broadPhase = this.world._contactManager.broadPhase;
    fixture.createProxy(broadPhase, this.originTransform);
  }
  fixture.next = this.fixtureList;
  this.fixtureList = fixture;
  ++this.fixtureCount;
  fixture.body = this;
  if (fixture.density > (0)) {
    this.resetMassData();
  }
  ($0 = this.world)._flags = $0._flags | (1);
  return fixture;
}
Body.prototype.get$position = function() {
  return this.originTransform.position;
}
Body.prototype.get$angle = function() {
  return this.sweep.angle;
}
Body.prototype.get$localCenter = function() {
  return this.sweep.localCenter;
}
Body.prototype.get$linearVelocity = function() {
  return this._linearVelocity;
}
Body.prototype.get$angularVelocity = function() {
  return this._angularVelocity;
}
Body.prototype.set$angularVelocity = function(w) {
  if (this._type != (0)) {
    if (w * w > (0)) {
      this.set$awake(true);
    }
    this._angularVelocity = w;
  }
}
Body.prototype.resetMassData = function() {
  this.mass = (0);
  this.invMass = (0);
  this._inertia = (0);
  this.invInertia = (0);
  this.sweep.localCenter.setZero();
  if (this._type == (0) || this._type == (1)) {
    this.sweep.center.setFrom(this.originTransform.position);
    this.sweep.centerZero.setFrom(this.originTransform.position);
    return;
  }
  this.tempCenter.setZero();
  var massData = this._pmd;
  for (var f = this.fixtureList;
   f != null; f = f.next) {
    if (f.density == (0)) {
      continue;
    }
    f.getMassData(massData);
    this.mass = this.mass + massData.mass;
    var temp = new Vector.copy$ctor(massData.center);
    temp.mulLocal(massData.mass);
    this.tempCenter.addLocal(temp);
    this._inertia = this._inertia + massData.inertia;
  }
  if (this.mass > (0)) {
    this.invMass = (1) / this.mass;
    this.tempCenter.mulLocal(this.invMass);
  }
  else {
    this.mass = (1);
    this.invMass = (1);
  }
  if (this._inertia > (0) && (this.flags & (16)) == (0)) {
    this._inertia = this._inertia - (this.mass * Vector.dot(this.tempCenter, this.tempCenter));
    this.invInertia = (1) / this._inertia;
  }
  else {
    this._inertia = (0);
    this.invInertia = (0);
  }
  this.oldCenter.setFrom(this.sweep.center);
  this.sweep.localCenter.setFrom(this.tempCenter);
  Transform.mulToOut(this.originTransform, this.sweep.localCenter, this.sweep.centerZero);
  this.sweep.center.setFrom(this.sweep.centerZero);
  var temp = new Vector.copy$ctor(this.sweep.center);
  temp.subLocal(this.oldCenter);
  Vector.crossNumAndVectorToOut(this._angularVelocity, temp, temp);
  this._linearVelocity.addLocal(temp);
}
Body.prototype.getWorldPoint = function(localPoint) {
  var v = new Vector((0), (0));
  this.getWorldPointToOut(localPoint, v);
  return v;
}
Body.prototype.getWorldPointToOut = function(localPoint, out) {
  Transform.mulToOut(this.originTransform, localPoint, out);
}
Body.prototype.getWorldVector = function(localVector) {
  var out = new Vector((0), (0));
  this.getWorldVectorToOut(localVector, out);
  return out;
}
Body.prototype.getWorldVectorToOut = function(localVector, out) {
  Matrix22.mulMatrixAndVectorToOut(this.originTransform.rotation, localVector, out);
}
Body.prototype.get$type = function() {
  return this._type;
}
Body.prototype.get$bullet = function() {
  return (this.flags & (8)) == (8);
}
Body.prototype.get$awake = function() {
  return (this.flags & (2)) == (2);
}
Body.prototype.set$awake = function(flag) {
  if (flag) {
    if ((this.flags & (2)) == (0)) {
      this.flags = this.flags | (2);
      this.sleepTime = (0);
    }
  }
  else {
    this.flags = this.flags & (-3);
    this.sleepTime = (0);
    this._linearVelocity.setZero();
    this._angularVelocity = (0);
    this._force.setZero();
    this._torque = (0);
  }
}
Body.prototype.get$active = function() {
  return (this.flags & (32)) == (32);
}
Body.prototype.synchronizeFixtures = function() {
  var xf1 = this._pxf;
  xf1.rotation.setAngle(this.sweep.angleZero);
  Matrix22.mulMatrixAndVectorToOut(xf1.rotation, this.sweep.localCenter, xf1.position);
  xf1.position.mulLocal((-1));
  xf1.position.addLocal(this.sweep.centerZero);
  var broadPhase = this.world._contactManager.broadPhase;
  for (var f = this.fixtureList;
   f != null; f = f.next) {
    f.synchronize(broadPhase, xf1, this.originTransform);
  }
}
Body.prototype.synchronizeTransform = function() {
  var $0, $1, $2, $3;
  var c = Math.cos(this.sweep.angle);
  var s = Math.sin(this.sweep.angle);
  this.originTransform.rotation.col1.x = c;
  this.originTransform.rotation.col2.x = -s;
  this.originTransform.rotation.col1.y = s;
  this.originTransform.rotation.col2.y = c;
  this.originTransform.position.x = this.originTransform.rotation.col1.x * this.sweep.localCenter.x + this.originTransform.rotation.col2.x * this.sweep.localCenter.y;
  this.originTransform.position.y = this.originTransform.rotation.col1.y * this.sweep.localCenter.x + this.originTransform.rotation.col2.y * this.sweep.localCenter.y;
  ($0 = this.originTransform.position).x = $0.x * (-1);
  ($1 = this.originTransform.position).y = $1.y * (-1);
  ($2 = this.originTransform.position).x = $2.x + this.sweep.center.x;
  ($3 = this.originTransform.position).y = $3.y + this.sweep.center.y;
}
Body.prototype.shouldCollide = function(other) {
  if (this._type != (2) && other._type != (2)) {
    return false;
  }
  return true;
}
Body.prototype.advance = function(t) {
  this.sweep.advance(t);
  this.sweep.center.setFrom(this.sweep.centerZero);
  this.sweep.angle = this.sweep.angleZero;
  this.synchronizeTransform();
}
// ********** Code for BodyDef **************
function BodyDef() {
  this.linearVelocity = new Vector((0), (0));
  this.bullet = false;
  this.allowSleep = true;
  this.active = true;
  this.angularVelocity = (0);
  this.angularDamping = (0);
  this.linearDamping = (0);
  this.userData = null;
  this.awake = true;
  this.angle = (0);
  this.position = new Vector((0), (0));
  this.fixedRotation = false;
  this.type = (0);
}
BodyDef.prototype.get$type = function() { return this.type; };
BodyDef.prototype.set$type = function(value) { return this.type = value; };
BodyDef.prototype.get$angle = function() { return this.angle; };
BodyDef.prototype.set$angle = function(value) { return this.angle = value; };
BodyDef.prototype.get$position = function() { return this.position; };
BodyDef.prototype.set$position = function(value) { return this.position = value; };
// ********** Code for BodyType **************
function BodyType() {}
// ********** Code for ContactManager **************
function ContactManager(argPool) {
  this.contactCount = (0);
  this.contactList = null;
  this.pool = argPool;
  this.broadPhase = new BroadPhase();
  this.contactFilter = new ContactFilter();
  this.contactListener = null;
}
ContactManager.prototype.addPair = function(fixtureA, fixtureB) {
  var bodyA = fixtureA.body;
  var bodyB = fixtureB.body;
  if (bodyA == bodyB) {
    return;
  }
  var edge = bodyB.contactList;
  while (edge != null) {
    if ($eq(edge.other, bodyA)) {
      var fA = edge.contact.fixtureA;
      var fB = edge.contact.fixtureB;
      if ($eq(fA, fixtureA) && $eq(fB, fixtureB)) {
        return;
      }
      if ($eq(fA, fixtureB) && $eq(fB, fixtureA)) {
        return;
      }
    }
    edge = edge.next;
  }
  if ($eq(bodyB.shouldCollide(bodyA), false)) {
    return;
  }
  if (this.contactFilter != null && $eq(this.contactFilter.shouldCollide(fixtureA, fixtureB), false)) {
    return;
  }
  var c = this.pool.popContact(fixtureA, fixtureB);
  fixtureA = c.fixtureA;
  fixtureB = c.fixtureB;
  bodyA = fixtureA.body;
  bodyB = fixtureB.body;
  c.prev = null;
  c.next = this.contactList;
  if (this.contactList != null) {
    this.contactList.prev = c;
  }
  this.contactList = c;
  c.edge1.contact = c;
  c.edge1.other = bodyB;
  c.edge1.prev = null;
  c.edge1.next = bodyA.contactList;
  if (bodyA.contactList != null) {
    bodyA.contactList.prev = c.edge1;
  }
  bodyA.contactList = c.edge1;
  c.edge2.contact = c;
  c.edge2.other = bodyA;
  c.edge2.prev = null;
  c.edge2.next = bodyB.contactList;
  if (bodyB.contactList != null) {
    bodyB.contactList.prev = c.edge2;
  }
  bodyB.contactList = c.edge2;
  ++this.contactCount;
}
ContactManager.prototype.findNewContacts = function() {
  this.broadPhase.updatePairs(this);
}
ContactManager.prototype.destroy = function(c) {
  var fixtureA = c.fixtureA;
  var fixtureB = c.fixtureB;
  var bodyA = fixtureA.body;
  var bodyB = fixtureB.body;
  if (this.contactListener != null && c.get$touching()) {
    this.contactListener.noSuchMethod("endContact", [c]);
  }
  if (c.prev != null) {
    c.prev.next = c.next;
  }
  if (c.next != null) {
    c.next.prev = c.prev;
  }
  if ($eq(c, this.contactList)) {
    this.contactList = c.next;
  }
  if (c.edge1.prev != null) {
    c.edge1.prev.next = c.edge1.next;
  }
  if (c.edge1.next != null) {
    c.edge1.next.prev = c.edge1.prev;
  }
  if ($eq(c.edge1, bodyA.contactList)) {
    bodyA.contactList = c.edge1.next;
  }
  if (c.edge2.prev != null) {
    c.edge2.prev.next = c.edge2.next;
  }
  if (c.edge2.next != null) {
    c.edge2.next.prev = c.edge2.prev;
  }
  if ($eq(c.edge2, bodyB.contactList)) {
    bodyB.contactList = c.edge2.next;
  }
  this.pool.pushContact(c);
  --this.contactCount;
}
ContactManager.prototype.collide = function() {
  var c = this.contactList;
  while (c != null) {
    var fixtureA = c.fixtureA;
    var fixtureB = c.fixtureB;
    var bodyA = fixtureA.body;
    var bodyB = fixtureB.body;
    if ($eq(bodyA.get$awake(), false) && $eq(bodyB.get$awake(), false)) {
      c = c.next;
      continue;
    }
    if ((c.flags & (8)) == (8)) {
      if ($eq(bodyB.shouldCollide(bodyA), false)) {
        var cNuke = c;
        c = cNuke.next;
        this.destroy(cNuke);
        continue;
      }
      if (this.contactFilter != null && $eq(this.contactFilter.shouldCollide(fixtureA, fixtureB), false)) {
        var cNuke = c;
        c = cNuke.next;
        this.destroy(cNuke);
        continue;
      }
      c.flags = c.flags & (-9);
    }
    var proxyIdA = fixtureA.proxy;
    var proxyIdB = fixtureB.proxy;
    var overlap = this.broadPhase.testOverlap(proxyIdA, proxyIdB);
    if ($eq(overlap, false)) {
      var cNuke = c;
      c = cNuke.next;
      this.destroy(cNuke);
      continue;
    }
    c.update(this.contactListener);
    c = c.next;
  }
}
// ********** Code for Filter **************
function Filter() {
  this.maskBits = (0);
  this.groupIndex = (0);
  this.categoryBits = (0);
}
Filter.prototype.setFrom = function(other) {
  this.categoryBits = other.categoryBits;
  this.maskBits = other.maskBits;
  this.groupIndex = other.groupIndex;
}
// ********** Code for Fixture **************
function Fixture() {
  this.shape = null;
  this.filter = new Filter();
  this._poolTwo = new AxisAlignedBox();
  this.box = new AxisAlignedBox();
  this.next = null;
  this.proxy = null;
  this.body = null;
  this._poolOne = new AxisAlignedBox();
}
Fixture.prototype.get$density = function() { return this.density; };
Fixture.prototype.set$density = function(value) { return this.density = value; };
Fixture.prototype.get$shape = function() { return this.shape; };
Fixture.prototype.set$shape = function(value) { return this.shape = value; };
Fixture.prototype.create = function(b, def) {
  this.userData = def.userData;
  this.friction = def.friction;
  this.restitution = def.restitution;
  this.body = b;
  this.next = null;
  this.filter.setFrom(def.filter);
  this.isSensor = def.isSensor;
  this.shape = def.shape.clone();
  this.density = def.density;
}
Fixture.prototype.createProxy = function(broadPhase, xf) {
  this.shape.computeAxisAlignedBox(this.box, xf);
  this.proxy = broadPhase.createProxy(this.box, this);
}
Fixture.prototype.synchronize = function(broadPhase, transformOne, transformTwo) {
  if (this.proxy == null) {
    return;
  }
  this.shape.computeAxisAlignedBox(this._poolOne, transformOne);
  this.shape.computeAxisAlignedBox(this._poolTwo, transformTwo);
  this.box.lowerBound.x = this._poolOne.lowerBound.x < this._poolTwo.lowerBound.x ? this._poolOne.lowerBound.x : this._poolTwo.lowerBound.x;
  this.box.lowerBound.y = this._poolOne.lowerBound.y < this._poolTwo.lowerBound.y ? this._poolOne.lowerBound.y : this._poolTwo.lowerBound.y;
  this.box.upperBound.x = this._poolOne.upperBound.x > this._poolTwo.upperBound.x ? this._poolOne.upperBound.x : this._poolTwo.upperBound.x;
  this.box.upperBound.y = this._poolOne.upperBound.y > this._poolTwo.upperBound.y ? this._poolOne.upperBound.y : this._poolTwo.upperBound.y;
  var disp = this._poolOne.lowerBound;
  disp.x = transformTwo.position.x - transformOne.position.x;
  disp.y = transformTwo.position.y - transformOne.position.y;
  broadPhase.moveProxy(this.proxy, this.box, disp);
}
Fixture.prototype.getMassData = function(massData) {
  this.shape.computeMass(massData, this.density);
}
Fixture.prototype.get$type = function() {
  return this.shape.type;
}
// ********** Code for FixtureDef **************
function FixtureDef() {
  this.shape = null;
  this.friction = (0.2);
  this.restitution = (0);
  this.density = (0);
  this.isSensor = false;
  this.filter = new Filter();
  this.userData = null;
  this.filter.categoryBits = (1);
  this.filter.maskBits = (65535);
  this.filter.groupIndex = (0);
}
FixtureDef.prototype.get$shape = function() { return this.shape; };
FixtureDef.prototype.set$shape = function(value) { return this.shape = value; };
FixtureDef.prototype.get$density = function() { return this.density; };
FixtureDef.prototype.set$density = function(value) { return this.density = value; };
// ********** Code for Island **************
function Island() {
  this._translation = new Vector((0), (0));
  this.impulse = new ContactImpulse();
  this._contactSolver = new ContactSolver();
}
Island.prototype.init = function(argBodyCapacity, argContactCapacity, argJointCapacity, argListener) {
  this.bodyCapacity = argBodyCapacity;
  this.contactCapacity = argContactCapacity;
  this.jointCapacity = argJointCapacity;
  this.bodyCount = (0);
  this.contactCount = (0);
  this.listener = argListener;
  if (this.bodies == null || this.bodyCapacity > this.bodies.get$length()) {
    this.bodies = new Array(this.bodyCapacity);
  }
  if (this.contacts == null || this.contactCapacity > this.contacts.get$length()) {
    this.contacts = new Array(this.contactCapacity);
  }
  if (this.joints == null || this.jointCapacity > this.joints.get$length()) {
    this.joints = new Array(this.jointCapacity);
  }
  if (this.velocities == null || this.bodyCapacity > this.velocities.get$length()) {
    var old = this.velocities == null ? new Array((0)) : this.velocities;
    this.velocities = new Array(this.bodyCapacity);
    this.velocities.setRange$3((0), old.get$length(), old);
    for (var i = old.get$length();
     i < this.velocities.get$length(); i++) {
      this.velocities.$setindex(i, new Velocity());
    }
  }
  if (this.positions == null || this.bodyCapacity > this.positions.get$length()) {
    var old = this.positions == null ? new Array((0)) : this.positions;
    this.positions = new Array(this.bodyCapacity);
    this.positions.setRange$3((0), old.get$length(), old);
    for (var i = old.get$length();
     i < this.positions.get$length(); i++) {
      this.positions.$setindex(i, new Position());
    }
  }
}
Island.prototype.clear = function() {
  this.bodyCount = (0);
  this.contactCount = (0);
  this.jointCount = (0);
}
Island.prototype.solve = function(step, gravity, allowSleep) {
  var $0;
  for (var i = (0);
   i < this.bodyCount; ++i) {
    var b = this.bodies[i];
    if (b.get$type() != (2)) {
      continue;
    }
    var velocityDelta = new Vector((b._force.x * b.invMass + gravity.x) * step.dt, (b._force.y * b.invMass + gravity.y) * step.dt);
    b.get$linearVelocity().addLocal(velocityDelta);
    var newAngularVelocity = b.get$angularVelocity() + (step.dt * b.invInertia * b._torque);
    b.set$angularVelocity(newAngularVelocity);
    var a = ((1) - step.dt * b.linearDamping);
    var a1 = ((0) > (a < (1) ? a : (1)) ? (0) : (a < (1) ? a : (1)));
    b.get$linearVelocity().mulLocal(a1);
    var a2 = ((1) - step.dt * b.angularDamping);
    var b1 = (a2 < (1) ? a2 : (1));
    b.set$angularVelocity(b.get$angularVelocity() * ((0) > b1 ? (0) : b1));
  }
  var i1 = (-1);
  for (var i2 = (0);
   i2 < this.contactCount; ++i2) {
    var fixtureA = this.contacts[i2].fixtureA;
    var fixtureB = this.contacts[i2].fixtureB;
    var bodyA = fixtureA.body;
    var bodyB = fixtureB.body;
    var nonStatic = bodyA.get$type() != (0) && bodyB.get$type() != (0);
    if (nonStatic) {
      ++i1;
      var temp = this.contacts[i1];
      this.contacts.$setindex(i1, this.contacts[i2]);
      this.contacts.$setindex(i2, temp);
    }
  }
  this._contactSolver.init(this.contacts, this.contactCount, step.dtRatio);
  this._contactSolver.warmStart();
  for (var i = (0);
   i < this.jointCount; ++i) {
    this.joints.$index(i).initVelocityConstraints(step);
  }
  for (var i = (0);
   i < step.velocityIterations; ++i) {
    for (var j = (0);
     j < this.jointCount; ++j) {
      this.joints.$index(j).solveVelocityConstraints$1(step);
    }
    this._contactSolver.solveVelocityConstraints();
  }
  this._contactSolver.storeImpulses();
  var temp = new Vector((0), (0));
  for (var i = (0);
   i < this.bodyCount; ++i) {
    var b = this.bodies[i];
    if (b.get$type() == (0)) {
      continue;
    }
    this._translation.setFrom(b.get$linearVelocity());
    this._translation.mulLocal(step.dt);
    if (Vector.dot(this._translation, this._translation) > (4)) {
      var ratio = (2) / this._translation.get$length();
      b.get$linearVelocity().mulLocal(ratio);
    }
    var rotation = step.dt * b.get$angularVelocity();
    if (rotation * rotation > (2.4674011002723395)) {
      var ratio = (1.5707963267948966) / rotation.abs();
      b.set$angularVelocity(b.get$angularVelocity() * ratio);
    }
    b.sweep.centerZero.setFrom(b.sweep.center);
    b.sweep.angleZero = b.sweep.angle;
    temp.setFrom(b.get$linearVelocity());
    temp.mulLocal(step.dt);
    b.sweep.center.addLocal(temp);
    ($0 = b.sweep).angle = $0.angle + (step.dt * b.get$angularVelocity());
    b.synchronizeTransform();
  }
  for (var i = (0);
   i < step.positionIterations; ++i) {
    var contactsOkay = this._contactSolver.solvePositionConstraints((0.2));
    var jointsOkay = true;
    for (var j = (0);
     j < this.jointCount; ++j) {
      var jointOkay = this.joints.$index(j).solvePositionConstraints((0.2));
      jointsOkay = jointsOkay && jointOkay;
    }
    if (contactsOkay && jointsOkay) {
      break;
    }
  }
  this.report(this._contactSolver.constraints);
  if (allowSleep) {
    var minSleepTime = (99999999999999);
    var linTolSqr = (0.0001);
    var angTolSqr = (0.0012184696791468343);
    for (var i = (0);
     i < this.bodyCount; ++i) {
      var b = this.bodies[i];
      if (b.get$type() == (0)) {
        continue;
      }
      if ((b.flags & (4)) == (0)) {
        b.sleepTime = (0);
        minSleepTime = (0);
      }
      if ((b.flags & (4)) == (0) || b.get$angularVelocity() * b.get$angularVelocity() > angTolSqr || Vector.dot(b.get$linearVelocity(), b.get$linearVelocity()) > linTolSqr) {
        b.sleepTime = (0);
        minSleepTime = (0);
      }
      else {
        b.sleepTime = b.sleepTime + step.dt;
        minSleepTime = Math.min(minSleepTime, b.sleepTime);
      }
    }
    if (minSleepTime >= (0.5)) {
      for (var i = (0);
       i < this.bodyCount; ++i) {
        var b = this.bodies[i];
        b.set$awake(false);
      }
    }
  }
}
Island.prototype.addBody = function(body) {
  body.islandIndex = this.bodyCount;
  this.bodies.$setindex(this.bodyCount++, body);
}
Island.prototype.addContact = function(contact) {
  this.contacts.$setindex(this.contactCount++, contact);
}
Island.prototype.addJoint = function(joint) {
  this.joints.$setindex(this.jointCount++, joint);
}
Island.prototype.report = function(constraints) {
  if (this.listener == null) {
    return;
  }
  for (var i = (0);
   i < this.contactCount; ++i) {
    var c = this.contacts[i];
    var cc = constraints[i];
    for (var j = (0);
     j < cc.pointCount; ++j) {
      this.impulse.normalImpulses.$setindex(j, cc.points[j].normalImpulse);
      this.impulse.tangentImpulses.$setindex(j, cc.points[j].tangentImpulse);
    }
    this.listener.noSuchMethod("postSolve", [c, this.impulse]);
  }
}
// ********** Code for Position **************
function Position() {
  this.x = new Vector((0), (0));
  this.a = (0);
}
Position.prototype.get$x = function() { return this.x; };
Position.prototype.set$x = function(value) { return this.x = value; };
// ********** Code for Velocity **************
function Velocity() {
  this.v = new Vector((0), (0));
  this.a = (0);
}
// ********** Code for TimeStep **************
function TimeStep() {
  this.dtRatio = (0);
  this.dt = (0);
  this.velocityIterations = (0);
  this.inv_dt = (0);
  this.warmStarting = true;
  this.positionIterations = (0);
}
// ********** Code for World **************
function World(gravity, doSleep, argPool) {
  this._bodyList = null;
  this._bodyCount = (0);
  this.toiSolver = new TimeOfImpactSolver();
  this.toiOutput = new TimeOfImpactOutput();
  this._jointCount = (0);
  this._warmStarting = true;
  this._flags = (4);
  this.axis = new Vector((0), (0));
  this.backup = new Sweep();
  this.island = new Island();
  this.cB = new Vector((0), (0));
  this._fixtureDestructionListener = null;
  this.stack = new Array((10));
  this.center = new Vector((0), (0));
  this.timestep = new TimeStep();
  this._allowSleep = doSleep;
  this._gravity = gravity;
  this._continuousPhysics = true;
  this.wqwrapper = new WorldQueryWrapper();
  this.cA = new Vector((0), (0));
  this._jointDestructionListener = null;
  this._inverseTimestep = (0);
  this.toiInput = new TimeOfImpactInput();
  this._pool = argPool;
  this._contactStacks = new Array((2));
  this.contacts = new Array((32));
  this._jointList = null;
  this._debugDraw = null;
  this._contactManager = new ContactManager(this);
  for (var i = (0);
   i < this._contactStacks.get$length(); i++) {
    this._contactStacks.$setindex(i, new Array((2)));
  }
  this._initializeRegisters();
}
World.prototype.get$center = function() { return this.center; };
World.prototype._addType = function(creatorStack, type1, type2) {
  var register = new ContactRegister();
  register.creator = creatorStack;
  register.primary = true;
  this._contactStacks[type1].$setindex(type2, register);
  if (type1 != type2) {
    var register2 = new ContactRegister();
    register2.creator = creatorStack;
    register2.primary = false;
    this._contactStacks[type2].$setindex(type1, register2);
  }
}
World.prototype._initializeRegisters = function() {
  this._addType(this._pool.getCircleContactStack(), (0), (0));
  this._addType(this._pool.getPolyCircleContactStack(), (1), (0));
  this._addType(this._pool.getPolyContactStack(), (1), (1));
}
World.prototype.popContact = function(fixtureA, fixtureB) {
  var type1 = fixtureA.get$type();
  var type2 = fixtureB.get$type();
  var reg = this._contactStacks[type1][type2];
  var creator = reg.creator;
  if (creator != null) {
    if (creator.isEmpty()) {
      creator = this._getFreshContactStack(type1, type2);
    }
    if (reg.primary) {
      var c = creator.removeFirst();
      c.init(fixtureA, fixtureB);
      return c;
    }
    else {
      var c = creator.removeFirst();
      c.init(fixtureB, fixtureA);
      return c;
    }
  }
  else {
    return null;
  }
}
World.prototype._getFreshContactStack = function(type1, type2) {
  if (type1 == (0) && type2 == (0)) {
    return this._pool.getCircleContactStack();
  }
  else if (type1 == (1) && type2 == (1)) {
    return this._pool.getPolyContactStack();
  }
  else {
    return this._pool.getPolyCircleContactStack();
  }
}
World.prototype.pushContact = function(contact) {
  if (contact.manifold.pointCount > (0)) {
    contact.fixtureA.body.set$awake(true);
    contact.fixtureB.body.set$awake(true);
  }
  var type1 = contact.fixtureA.get$type();
  var type2 = contact.fixtureB.get$type();
  var creator = this._contactStacks[type1][type2].creator;
  creator.addFirst(contact);
}
World.prototype.createBody = function(def) {
  if (this.get$locked()) {
    return null;
  }
  var b = new Body(def, this);
  b.prev = null;
  b.next = this._bodyList;
  if (this._bodyList != null) {
    this._bodyList.prev = b;
  }
  this._bodyList = b;
  ++this._bodyCount;
  return b;
}
World.prototype.step = function(dt, velocityIterations, positionIterations) {
  if ((this._flags & (1)) == (1)) {
    this._contactManager.findNewContacts();
    this._flags = this._flags & (-2);
  }
  this._flags = this._flags | (2);
  this.timestep.dt = dt;
  this.timestep.velocityIterations = velocityIterations;
  this.timestep.positionIterations = positionIterations;
  if (dt > (0)) {
    this.timestep.inv_dt = (1) / dt;
  }
  else {
    this.timestep.inv_dt = (0);
  }
  this.timestep.dtRatio = this._inverseTimestep * dt;
  this.timestep.warmStarting = this._warmStarting;
  this._contactManager.collide();
  if (this.timestep.dt > (0)) {
    this.solve(this.timestep);
  }
  if (this._continuousPhysics && this.timestep.dt > (0)) {
    this.solveTimeOfImpact();
  }
  if (this.timestep.dt > (0)) {
    this._inverseTimestep = this.timestep.inv_dt;
  }
  if ((this._flags & (4)) == (4)) {
    this.clearForces();
  }
  this._flags = this._flags & (-3);
}
World.prototype.clearForces = function() {
  for (var body = this._bodyList;
   body != null; body = body.next) {
    body._force.setZero();
    body._torque = (0);
  }
}
World.prototype.get$locked = function() {
  return (this._flags & (2)) == (2);
}
World.prototype.get$jointList = function() {
  return this._jointList;
}
World.prototype.solve = function(timeStep) {
  this.island.init(this._bodyCount, this._contactManager.contactCount, this._jointCount, this._contactManager.contactListener);
  for (var b = this._bodyList;
   b != null; b = b.next) {
    b.flags = b.flags & (-2);
  }
  for (var c = this._contactManager.contactList;
   c != null; c = c.next) {
    c.flags = c.flags & (-2);
  }
  for (var j = this.get$jointList();
   j != null; j = j._next) {
    j.islandFlag = false;
  }
  var stackSize = this._bodyCount;
  if (this.stack.get$length() < stackSize) {
    this.stack = new Array(stackSize);
  }
  for (var seed = this._bodyList;
   seed != null; seed = seed.next) {
    if ((seed.flags & (1)) == (1)) {
      continue;
    }
    if ($eq(seed.get$awake(), false) || $eq(seed.get$active(), false)) {
      continue;
    }
    if (seed.get$type() == (0)) {
      continue;
    }
    this.island.clear();
    var stackCount = (0);
    this.stack.$setindex(stackCount++, seed);
    seed.flags = seed.flags | (1);
    while (stackCount > (0)) {
      var b = this.stack[--stackCount];
      this.island.addBody(b);
      b.set$awake(true);
      if (b.get$type() == (0)) {
        continue;
      }
      for (var ce = b.contactList;
       ce != null; ce = ce.next) {
        var contact = ce.contact;
        if ((contact.flags & (1)) == (1)) {
          continue;
        }
        if ($eq(contact.get$enabled(), false) || $eq(contact.get$touching(), false)) {
          continue;
        }
        var sensorA = contact.fixtureA.isSensor;
        var sensorB = contact.fixtureB.isSensor;
        if (sensorA || sensorB) {
          continue;
        }
        this.island.addContact(contact);
        contact.flags = contact.flags | (1);
        var other = ce.other;
        if ((other.flags & (1)) == (1)) {
          continue;
        }
        this.stack.$setindex(stackCount++, other);
        other.flags = other.flags | (1);
      }
      for (var je = b.jointList;
       je != null; je = je.next) {
        if ($eq(je.joint.islandFlag, true)) {
          continue;
        }
        var other = je.other;
        if ($eq(other.get$active(), false)) {
          continue;
        }
        this.island.addJoint(je.joint);
        je.joint.islandFlag = true;
        if (((other.flags & (1)) == (1))) {
          continue;
        }
        this.stack.$setindex(stackCount++, other);
        other.flags = other.flags | (1);
      }
    }
    this.island.solve(timeStep, this._gravity, this._allowSleep);
    for (var i = (0);
     i < this.island.bodyCount; ++i) {
      var b = this.island.bodies[i];
      if (b.get$type() == (0)) {
        b.flags = b.flags & (-2);
      }
    }
  }
  for (var b = this._bodyList;
   b != null; b = b.next) {
    if ((b.flags & (1)) == (0)) {
      continue;
    }
    if (b.get$type() == (0)) {
      continue;
    }
    b.synchronizeFixtures();
  }
  this._contactManager.findNewContacts();
}
World.prototype.solveTimeOfImpact = function() {
  for (var c = this._contactManager.contactList;
   c != null; c = c.next) {
    c.flags = c.flags | (4);
    c.toiCount = (0);
  }
  for (var body = this._bodyList;
   body != null; body = body.next) {
    if ((body.flags & (1)) == (0) || body.get$type() == (1) || body.get$type() == (0)) {
      body.flags = body.flags | (64);
    }
    else {
      body.flags = body.flags & (-65);
    }
  }
  for (var body = this._bodyList;
   body != null; body = body.next) {
    if ((body.flags & (64)) == (64)) {
      continue;
    }
    if ($eq(body.get$bullet(), true)) {
      continue;
    }
    this.solveTimeOfImpactGivenBody(body);
    body.flags = body.flags | (64);
  }
  for (var body = this._bodyList;
   body != null; body = body.next) {
    if ((body.flags & (64)) == (64)) {
      continue;
    }
    if ($eq(body.get$bullet(), false)) {
      continue;
    }
    this.solveTimeOfImpactGivenBody(body);
    body.flags = body.flags | (64);
  }
}
World.prototype.solveTimeOfImpactGivenBody = function(body) {
  var $0;
  var toiContact = null;
  var toi = (1);
  var toiOther = null;
  var found;
  var count;
  var iter = (0);
  var bullet = body.get$bullet();
  do {
    count = (0);
    found = false;
    for (var ce = body.contactList;
     ce != null; ce = ce.next) {
      if ($eq(ce.contact, toiContact)) {
        continue;
      }
      var other = ce.other;
      var type = other.get$type();
      if ($eq(bullet, true)) {
        if ((other.flags & (64)) == (0)) {
          continue;
        }
        if (type != (0) && (ce.contact.flags & (16)) != (0)) {
          continue;
        }
      }
      else if (type == (2)) {
        continue;
      }
      var contact = ce.contact;
      if ($eq(contact.get$enabled(), false)) {
        continue;
      }
      if (contact.toiCount > (10)) {
        continue;
      }
      var fixtureA = contact.fixtureA;
      var fixtureB = contact.fixtureB;
      if (fixtureA.isSensor || fixtureB.isSensor) {
        continue;
      }
      var bodyA = fixtureA.body;
      var bodyB = fixtureB.body;
      this.toiInput.proxyA.setFromShape(fixtureA.shape);
      this.toiInput.proxyB.setFromShape(fixtureB.shape);
      this.toiInput.sweepA.setFrom(bodyA.sweep);
      this.toiInput.sweepB.setFrom(bodyB.sweep);
      this.toiInput.tMax = toi;
      this._pool.timeOfImpact.timeOfImpact(this.toiOutput, this.toiInput);
      if (this.toiOutput.state == (3) && this.toiOutput.t < toi) {
        toiContact = contact;
        toi = this.toiOutput.t;
        toiOther = other;
        found = true;
      }
      ++count;
    }
    ++iter;
  }
  while (found && count > (1) && iter < (50))
  if (toiContact == null) {
    body.advance((1));
    return;
  }
  this.backup.setFrom(body.sweep);
  body.advance(toi);
  toiContact.update(this._contactManager.contactListener);
  if ($eq(toiContact.get$enabled(), false)) {
    body.sweep.setFrom(this.backup);
    this.solveTimeOfImpactGivenBody(body);
  }
  ((toiContact.toiCount = ($0 = toiContact.toiCount + (1)), $0));
  if (this.contacts == null || this.contacts.get$length() < (32)) {
    this.contacts = new Array((32));
  }
  count = (0);
  for (var ce = body.contactList;
   ce != null && count < (32); ce = ce.next) {
    var other = ce.other;
    var type = other.get$type();
    if (type == (2)) {
      continue;
    }
    var contact = ce.contact;
    if ($eq(contact.get$enabled(), false)) {
      continue;
    }
    var fixtureA = contact.fixtureA;
    var fixtureB = contact.fixtureB;
    if (fixtureA.isSensor || fixtureB.isSensor) {
      continue;
    }
    if ($ne(contact, toiContact)) {
      contact.update(this._contactManager.contactListener);
    }
    if ($eq(contact.get$enabled(), false)) {
      continue;
    }
    if ($eq(contact.get$touching(), false)) {
      continue;
    }
    this.contacts.$setindex(count, contact);
    ++count;
  }
  this.toiSolver.initialize(this.contacts, count, body);
  var k_toiBaumgarte = (0.75);
  for (var i = (0);
   i < (20); ++i) {
    var contactsOkay = this.toiSolver.solve(k_toiBaumgarte);
    if (contactsOkay) {
      break;
    }
  }
  if (toiOther.get$type() != (0)) {
    toiContact.flags = toiContact.flags | (16);
  }
}
// ********** Code for WorldQueryWrapper **************
function WorldQueryWrapper() {

}
WorldQueryWrapper.prototype.treeCallback = function(node) {
  var fixture = node.userData;
  return this.callback.noSuchMethod("reportFixture", [fixture]);
}
// ********** Code for Contact **************
function Contact(pool) {
  this.manifold = new Manifold();
  this.edge1 = new ContactEdge();
  this._oldManifold = new Manifold();
  this.fixtureA = null;
  this.fixtureB = null;
  this.pool = pool;
  this.edge2 = new ContactEdge();
}
Contact.prototype.init = function(fixA, fixB) {
  this.flags = (0);
  this.fixtureA = fixA;
  this.fixtureB = fixB;
  this.manifold.pointCount = (0);
  this.prev = null;
  this.next = null;
  this.edge1.contact = null;
  this.edge1.prev = null;
  this.edge1.next = null;
  this.edge1.other = null;
  this.edge2.contact = null;
  this.edge2.prev = null;
  this.edge2.next = null;
  this.edge2.other = null;
  this.toiCount = (0);
}
Contact.prototype.get$touching = function() {
  return (this.flags & (2)) == (2);
}
Contact.prototype.get$enabled = function() {
  return (this.flags & (4)) == (4);
}
Contact.prototype.evaluate = function(argManifold, xfA, xfB) {

}
Contact.prototype.update = function(listener) {
  this._oldManifold.setFrom(this.manifold);
  this.flags = this.flags | (4);
  var touching = false;
  var wasTouching = (this.flags & (2)) == (2);
  var sensorA = this.fixtureA.isSensor;
  var sensorB = this.fixtureB.isSensor;
  var sensor = sensorA || sensorB;
  var bodyA = this.fixtureA.body;
  var bodyB = this.fixtureB.body;
  var xfA = bodyA.originTransform;
  var xfB = bodyB.originTransform;
  if (sensor) {
    var shapeA = this.fixtureA.shape;
    var shapeB = this.fixtureB.shape;
    touching = this.pool.collision.testOverlap(shapeA, shapeB, xfA, xfB);
    this.manifold.pointCount = (0);
  }
  else {
    this.evaluate(this.manifold, xfA, xfB);
    touching = this.manifold.pointCount > (0);
    for (var i = (0);
     i < this.manifold.pointCount; ++i) {
      var mp2 = this.manifold.points[i];
      mp2.normalImpulse = (0);
      mp2.tangentImpulse = (0);
      var id2 = mp2.id;
      for (var j = (0);
       j < this._oldManifold.pointCount; ++j) {
        var mp1 = this._oldManifold.points[j];
        if (mp1.id.isEqual(id2)) {
          mp2.normalImpulse = mp1.normalImpulse;
          mp2.tangentImpulse = mp1.tangentImpulse;
          break;
        }
      }
    }
    if ($ne(touching, wasTouching)) {
      bodyA.set$awake(true);
      bodyB.set$awake(true);
    }
  }
  if (touching) {
    this.flags = this.flags | (2);
  }
  else {
    this.flags = this.flags & (-3);
  }
  if (listener == null) {
    return;
  }
  if ($eq(wasTouching, false) && $eq(touching, true)) {
    listener.noSuchMethod("beginContact", [this]);
  }
  if ($eq(wasTouching, true) && $eq(touching, false)) {
    listener.noSuchMethod("endContact", [this]);
  }
  if ($eq(sensor, false) && touching) {
    listener.noSuchMethod("preSolve", [this, this._oldManifold]);
  }
}
// ********** Code for ContactConstraint **************
function ContactConstraint() {
  this.localPoint = new Vector((0), (0));
  this.points = new Array((2));
  this.normalMass = new Matrix22();
  this.localNormal = new Vector((0), (0));
  this.manifold = null;
  this.normal = new Vector((0), (0));
  this.pointCount = (0);
  this.K = new Matrix22();
  for (var i = (0);
   i < (2); i++) {
    this.points.$setindex(i, new ContactConstraintPoint());
  }
}
ContactConstraint.prototype.get$type = function() { return this.type; };
ContactConstraint.prototype.set$type = function(value) { return this.type = value; };
ContactConstraint.prototype.get$radius = function() { return this.radius; };
ContactConstraint.prototype.set$radius = function(value) { return this.radius = value; };
ContactConstraint.prototype.toString = function() {
  var result = $add($add(("localNormal: \"" + this.localNormal + "\", localPoint: \"" + this.localPoint + "\" "), ("normal: \"" + this.normal + "\", radius: \"" + this.radius + "\" friction: \"" + this.friction + "\" ")), ("restitution: \"" + this.restitution + "\", pointCount: \"" + this.pointCount + "\""));
  return result;
}
// ********** Code for ContactConstraintPoint **************
function ContactConstraintPoint() {
  this.tangentMass = (0);
  this.rB = new Vector((0), (0));
  this.localPoint = new Vector((0), (0));
  this.velocityBias = (0);
  this.rA = new Vector((0), (0));
  this.tangentImpulse = (0);
  this.normalMass = (0);
  this.normalImpulse = (0);
}
ContactConstraintPoint.prototype.toString = function() {
  return $add($add($add($add($add($add($add($add($add($add("normal impulse: " + this.normalImpulse, ", tangentImpulse: ") + this.tangentImpulse, ", normalMass: ") + this.normalMass, ", tangentMass: ") + this.tangentMass, ", velocityBias: ") + this.velocityBias, ", localPoint "), this.localPoint), ", rA: "), this.rA), ", rB: "), this.rB);
}
// ********** Code for ContactEdge **************
function ContactEdge() {
  this.other = null;
  this.contact = null;
  this.prev = null;
  this.next = null;
}
// ********** Code for CircleContact **************
$inherits(CircleContact, Contact);
function CircleContact(argPool) {
  Contact.call(this, argPool);
}
CircleContact.prototype.init = function(fA, fB) {
  Expect.equals((0), fA.get$type());
  Expect.equals((0), fB.get$type());
  Contact.prototype.init.call(this, fA, fB);
}
CircleContact.prototype.evaluate = function(argManifold, xfA, xfB) {
  this.pool.collision.collideCircles(argManifold, this.fixtureA.shape, xfA, this.fixtureB.shape, xfB);
}
// ********** Code for ContactRegister **************
function ContactRegister() {
  this.primary = false;
  this.creator = null;
}
// ********** Code for ContactSolver **************
function ContactSolver() {
  this.P2 = new Vector((0), (0));
  this.x = new Vector((0), (0));
  this.d = new Vector((0), (0));
  this.P1 = new Vector((0), (0));
  this.rB = new Vector((0), (0));
  this.temp1 = new Vector((0), (0));
  this.dv1 = new Vector((0), (0));
  this.P = new Vector((0), (0));
  this.constraints = new Array((256));
  this.temp2 = new Vector((0), (0));
  this.dv = new Vector((0), (0));
  this.rA = new Vector((0), (0));
  this.psolver = new PositionSolverManifold();
  this.worldManifold = new WorldManifold();
  this.tangent = new Vector((0), (0));
  this.dv2 = new Vector((0), (0));
  for (var i = (0);
   i < this.constraints.get$length(); i++) {
    this.constraints.$setindex(i, new ContactConstraint());
  }
}
ContactSolver.prototype.get$x = function() { return this.x; };
ContactSolver.prototype.init = function(contacts, contactCount, impulseRatio) {
  this.constraintCount = contactCount;
  if (this.constraints.get$length() < contactCount) {
    var old = this.constraints;
    var newLen = Math.max(old.get$length() * (2), this.constraintCount);
    this.constraints = new Array(newLen);
    this.constraints.setRange$3((0), old.get$length(), old);
    for (var i = old.get$length();
     i < this.constraints.get$length(); i++) {
      this.constraints.$setindex(i, new ContactConstraint());
    }
  }
  for (var i = (0);
   i < this.constraintCount; ++i) {
    var contact = contacts[i];
    var fixtureA = contact.fixtureA;
    var fixtureB = contact.fixtureB;
    var shapeA = fixtureA.shape;
    var shapeB = fixtureB.shape;
    var radiusA = shapeA.radius;
    var radiusB = shapeB.radius;
    var bodyA = fixtureA.body;
    var bodyB = fixtureB.body;
    var manifold = contact.manifold;
    var friction = Settings.mixFriction(fixtureA.friction, fixtureB.friction);
    var restitution = Settings.mixRestitution(fixtureA.restitution, fixtureB.restitution);
    var vA = bodyA.get$linearVelocity();
    var vB = bodyB.get$linearVelocity();
    var wA = bodyA.get$angularVelocity();
    var wB = bodyB.get$angularVelocity();
    this.worldManifold.initialize(manifold, bodyA.originTransform, radiusA, bodyB.originTransform, radiusB);
    var cc = this.constraints[i];
    cc.bodyA = bodyA;
    cc.bodyB = bodyB;
    cc.manifold = manifold;
    cc.normal.x = this.worldManifold.normal.x;
    cc.normal.y = this.worldManifold.normal.y;
    cc.pointCount = manifold.pointCount;
    cc.friction = friction;
    cc.restitution = restitution;
    cc.localNormal.x = manifold.localNormal.x;
    cc.localNormal.y = manifold.localNormal.y;
    cc.localPoint.x = manifold.localPoint.x;
    cc.localPoint.y = manifold.localPoint.y;
    cc.radius = radiusA + radiusB;
    cc.type = manifold.type;
    for (var j = (0);
     j < cc.pointCount; ++j) {
      var cp = manifold.points[j];
      var ccp = cc.points[j];
      ccp.normalImpulse = impulseRatio * cp.normalImpulse;
      ccp.tangentImpulse = impulseRatio * cp.tangentImpulse;
      ccp.localPoint.x = cp.localPoint.x;
      ccp.localPoint.y = cp.localPoint.y;
      ccp.rA.x = this.worldManifold.points[j].x - bodyA.sweep.center.x;
      ccp.rA.y = this.worldManifold.points[j].y - bodyA.sweep.center.y;
      ccp.rB.x = this.worldManifold.points[j].x - bodyB.sweep.center.x;
      ccp.rB.y = this.worldManifold.points[j].y - bodyB.sweep.center.y;
      var rnA = ccp.rA.x * cc.normal.y - ccp.rA.y * cc.normal.x;
      var rnB = ccp.rB.x * cc.normal.y - ccp.rB.y * cc.normal.x;
      rnA *= rnA;
      rnB *= rnB;
      var kNormal = bodyA.invMass + bodyB.invMass + bodyA.invInertia * rnA + bodyB.invInertia * rnB;
      ccp.normalMass = (1) / kNormal;
      this.tangent.x = (1) * cc.normal.y;
      this.tangent.y = (-1) * cc.normal.x;
      var rtA = ccp.rA.x * this.tangent.y - ccp.rA.y * this.tangent.x;
      var rtB = ccp.rB.x * this.tangent.y - ccp.rB.y * this.tangent.x;
      rtA *= rtA;
      rtB *= rtB;
      var kTangent = bodyA.invMass + bodyB.invMass + bodyA.invInertia * rtA + bodyB.invInertia * rtB;
      ccp.tangentMass = (1) / kTangent;
      ccp.velocityBias = (0);
      this.temp2.x = -wA * ccp.rA.y;
      this.temp2.y = wA * ccp.rA.x;
      this.temp1.x = -wB * ccp.rB.y + vB.x - vA.x - this.temp2.x;
      this.temp1.y = wB * ccp.rB.x + vB.y - vA.y - this.temp2.y;
      var a = cc.normal;
      var vRel = a.x * this.temp1.x + a.y * this.temp1.y;
      if (vRel < (-1)) {
        ccp.velocityBias = -restitution * vRel;
      }
    }
    if (cc.pointCount == (2)) {
      var ccp1 = cc.points[(0)];
      var ccp2 = cc.points[(1)];
      var invMassA = bodyA.invMass;
      var invIA = bodyA.invInertia;
      var invMassB = bodyB.invMass;
      var invIB = bodyB.invInertia;
      var rn1A = Vector.crossVectors(ccp1.rA, cc.normal);
      var rn1B = Vector.crossVectors(ccp1.rB, cc.normal);
      var rn2A = Vector.crossVectors(ccp2.rA, cc.normal);
      var rn2B = Vector.crossVectors(ccp2.rB, cc.normal);
      var k11 = invMassA + invMassB + invIA * rn1A * rn1A + invIB * rn1B * rn1B;
      var k22 = invMassA + invMassB + invIA * rn2A * rn2A + invIB * rn2B * rn2B;
      var k12 = invMassA + invMassB + invIA * rn1A * rn2A + invIB * rn1B * rn2B;
      if (k11 * k11 < (100) * (k11 * k22 - k12 * k12)) {
        cc.K.col1.x = k11;
        cc.K.col1.y = k12;
        cc.K.col2.x = k12;
        cc.K.col2.y = k22;
        cc.normalMass.col1.x = cc.K.col1.x;
        cc.normalMass.col1.y = cc.K.col1.y;
        cc.normalMass.col2.x = cc.K.col2.x;
        cc.normalMass.col2.y = cc.K.col2.y;
        cc.normalMass.invertLocal();
      }
      else {
        cc.pointCount = (1);
      }
    }
  }
}
ContactSolver.prototype.warmStart = function() {
  var $0, $1, $2, $3;
  for (var i = (0);
   i < this.constraintCount; ++i) {
    var c = this.constraints[i];
    var bodyA = c.bodyA;
    var bodyB = c.bodyB;
    var invMassA = bodyA.invMass;
    var invIA = bodyA.invInertia;
    var invMassB = bodyB.invMass;
    var invIB = bodyB.invInertia;
    var normal = c.normal;
    Vector.crossVectorAndNumToOut(normal, (1), this.tangent);
    for (var j = (0);
     j < c.pointCount; ++j) {
      var ccp = c.points[j];
      var Px = ccp.normalImpulse * normal.x + ccp.tangentImpulse * this.tangent.x;
      var Py = ccp.normalImpulse * normal.y + ccp.tangentImpulse * this.tangent.y;
      bodyA.set$angularVelocity(bodyA.get$angularVelocity() - (invIA * (ccp.rA.x * Py - ccp.rA.y * Px)));
      ($0 = bodyA.get$linearVelocity()).x = $0.x - (Px * invMassA);
      ($1 = bodyA.get$linearVelocity()).y = $1.y - (Py * invMassA);
      bodyB.set$angularVelocity(bodyB.get$angularVelocity() + (invIB * (ccp.rB.x * Py - ccp.rB.y * Px)));
      ($2 = bodyB.get$linearVelocity()).x = $2.x + (Px * invMassB);
      ($3 = bodyB.get$linearVelocity()).y = $3.y + (Py * invMassB);
    }
  }
}
ContactSolver.prototype.solveVelocityConstraints = function() {
  for (var i = (0);
   i < this.constraintCount; ++i) {
    var c = this.constraints[i];
    var bodyA = c.bodyA;
    var bodyB = c.bodyB;
    var wA = bodyA.get$angularVelocity();
    var wB = bodyB.get$angularVelocity();
    var vA = bodyA.get$linearVelocity();
    var vB = bodyB.get$linearVelocity();
    var invMassA = bodyA.invMass;
    var invIA = bodyA.invInertia;
    var invMassB = bodyB.invMass;
    var invIB = bodyB.invInertia;
    this.tangent.x = (1) * c.normal.y;
    this.tangent.y = (-1) * c.normal.x;
    var friction = c.friction;
    for (var j = (0);
     j < c.pointCount; ++j) {
      var ccp = c.points[j];
      var a = ccp.rA;
      this.dv.x = -wB * ccp.rB.y + vB.x - vA.x + wA * a.y;
      this.dv.y = wB * ccp.rB.x + vB.y - vA.y - wA * a.x;
      var vt = this.dv.x * this.tangent.x + this.dv.y * this.tangent.y;
      var lambda = ccp.tangentMass * (-vt);
      var maxFriction = friction * ccp.normalImpulse;
      var newImpulse = MathBox.clamp(ccp.tangentImpulse + lambda, -maxFriction, maxFriction);
      lambda = newImpulse - ccp.tangentImpulse;
      var Px = this.tangent.x * lambda;
      var Py = this.tangent.y * lambda;
      vA.x = vA.x - (Px * invMassA);
      vA.y = vA.y - (Py * invMassA);
      wA -= (invIA * (ccp.rA.x * Py - ccp.rA.y * Px));
      vB.x = vB.x + (Px * invMassB);
      vB.y = vB.y + (Py * invMassB);
      wB += (invIB * (ccp.rB.x * Py - ccp.rB.y * Px));
      ccp.tangentImpulse = newImpulse;
    }
    if (c.pointCount == (1)) {
      var ccp = c.points[(0)];
      var a1 = ccp.rA;
      this.dv.x = -wB * ccp.rB.y + vB.x - vA.x + wA * a1.y;
      this.dv.y = wB * ccp.rB.x + vB.y - vA.y - wA * a1.x;
      var b = c.normal;
      var vn = this.dv.x * b.x + this.dv.y * b.y;
      var lambda = -ccp.normalMass * (vn - ccp.velocityBias);
      var a = ccp.normalImpulse + lambda;
      var newImpulse = (a > (0) ? a : (0));
      lambda = newImpulse - ccp.normalImpulse;
      var Px = c.normal.x * lambda;
      var Py = c.normal.y * lambda;
      vA.x = vA.x - (Px * invMassA);
      vA.y = vA.y - (Py * invMassA);
      wA -= (invIA * (ccp.rA.x * Py - ccp.rA.y * Px));
      vB.x = vB.x + (Px * invMassB);
      vB.y = vB.y + (Py * invMassB);
      wB += (invIB * (ccp.rB.x * Py - ccp.rB.y * Px));
      ccp.normalImpulse = newImpulse;
    }
    else {
      var cp1 = c.points[(0)];
      var cp2 = c.points[(1)];
      var a = new Vector(cp1.normalImpulse, cp2.normalImpulse);
      this.dv1.x = -wB * cp1.rB.y + vB.x - vA.x + wA * cp1.rA.y;
      this.dv1.y = wB * cp1.rB.x + vB.y - vA.y - wA * cp1.rA.x;
      this.dv2.x = -wB * cp2.rB.y + vB.x - vA.x + wA * cp2.rA.y;
      this.dv2.y = wB * cp2.rB.x + vB.y - vA.y - wA * cp2.rA.x;
      var vn1 = this.dv1.x * c.normal.x + this.dv1.y * c.normal.y;
      var vn2 = this.dv2.x * c.normal.x + this.dv2.y * c.normal.y;
      var b = new Vector(vn1 - cp1.velocityBias, vn2 - cp2.velocityBias);
      this.temp2.x = c.K.col1.x * a.x + c.K.col2.x * a.y;
      this.temp2.y = c.K.col1.y * a.x + c.K.col2.y * a.y;
      b.x = b.x - this.temp2.x;
      b.y = b.y - this.temp2.y;
      while (true) {
        Matrix22.mulMatrixAndVectorToOut(c.normalMass, b, this.x);
        this.x.mulLocal((-1));
        if (this.x.x >= (0) && this.x.y >= (0)) {
          this.d.setFrom(this.x).subLocal(a);
          this.P1.setFrom(c.normal).mulLocal(this.d.x);
          this.P2.setFrom(c.normal).mulLocal(this.d.y);
          this.temp1.setFrom(this.P1).addLocal(this.P2);
          this.temp2.setFrom(this.temp1).mulLocal(invMassA);
          vA.subLocal(this.temp2);
          this.temp2.setFrom(this.temp1).mulLocal(invMassB);
          vB.addLocal(this.temp2);
          wA -= (invIA * (Vector.crossVectors(cp1.rA, this.P1) + Vector.crossVectors(cp2.rA, this.P2)));
          wB += (invIB * (Vector.crossVectors(cp1.rB, this.P1) + Vector.crossVectors(cp2.rB, this.P2)));
          cp1.normalImpulse = this.x.x;
          cp2.normalImpulse = this.x.y;
          break;
        }
        this.x.x = -cp1.normalMass * b.x;
        this.x.y = (0);
        vn1 = (0);
        vn2 = c.K.col1.y * this.x.x + b.y;
        if (this.x.x >= (0) && vn2 >= (0)) {
          this.d.setFrom(this.x).subLocal(a);
          this.P1.setFrom(c.normal).mulLocal(this.d.x);
          this.P2.setFrom(c.normal).mulLocal(this.d.y);
          this.temp1.setFrom(this.P1).addLocal(this.P2);
          this.temp2.setFrom(this.temp1).mulLocal(invMassA);
          vA.subLocal(this.temp2);
          this.temp2.setFrom(this.temp1).mulLocal(invMassB);
          vB.addLocal(this.temp2);
          wA -= (invIA * (Vector.crossVectors(cp1.rA, this.P1) + Vector.crossVectors(cp2.rA, this.P2)));
          wB += (invIB * (Vector.crossVectors(cp1.rB, this.P1) + Vector.crossVectors(cp2.rB, this.P2)));
          cp1.normalImpulse = this.x.x;
          cp2.normalImpulse = this.x.y;
          break;
        }
        this.x.x = (0);
        this.x.y = -cp2.normalMass * b.y;
        vn1 = c.K.col2.x * this.x.y + b.x;
        vn2 = (0);
        if (this.x.y >= (0) && vn1 >= (0)) {
          this.d.setFrom(this.x).subLocal(a);
          this.P1.setFrom(c.normal).mulLocal(this.d.x);
          this.P2.setFrom(c.normal).mulLocal(this.d.y);
          this.temp1.setFrom(this.P1).addLocal(this.P2);
          this.temp2.setFrom(this.temp1).mulLocal(invMassA);
          vA.subLocal(this.temp2);
          this.temp2.setFrom(this.temp1).mulLocal(invMassB);
          vB.addLocal(this.temp2);
          wA -= (invIA * (Vector.crossVectors(cp1.rA, this.P1) + Vector.crossVectors(cp2.rA, this.P2)));
          wB += (invIB * (Vector.crossVectors(cp1.rB, this.P1) + Vector.crossVectors(cp2.rB, this.P2)));
          cp1.normalImpulse = this.x.x;
          cp2.normalImpulse = this.x.y;
          break;
        }
        this.x.x = (0);
        this.x.y = (0);
        vn1 = b.x;
        vn2 = b.y;
        if (vn1 >= (0) && vn2 >= (0)) {
          this.d.setFrom(this.x).subLocal(a);
          this.P1.setFrom(c.normal).mulLocal(this.d.x);
          this.P2.setFrom(c.normal).mulLocal(this.d.y);
          this.temp1.setFrom(this.P1).addLocal(this.P2);
          this.temp2.setFrom(this.temp1).mulLocal(invMassA);
          vA.subLocal(this.temp2);
          this.temp2.setFrom(this.temp1).mulLocal(invMassB);
          vB.addLocal(this.temp2);
          wA -= (invIA * (Vector.crossVectors(cp1.rA, this.P1) + Vector.crossVectors(cp2.rA, this.P2)));
          wB += (invIB * (Vector.crossVectors(cp1.rB, this.P1) + Vector.crossVectors(cp2.rB, this.P2)));
          cp1.normalImpulse = this.x.x;
          cp2.normalImpulse = this.x.y;
          break;
        }
        break;
      }
    }
    bodyA.get$linearVelocity().setFrom(vA);
    bodyA.set$angularVelocity(wA);
    bodyB.get$linearVelocity().setFrom(vB);
    bodyB.set$angularVelocity(wB);
  }
}
ContactSolver.prototype.storeImpulses = function() {
  for (var i = (0);
   i < this.constraintCount; i++) {
    var c = this.constraints[i];
    var m = c.manifold;
    for (var j = (0);
     j < c.pointCount; j++) {
      m.points[j].normalImpulse = c.points[j].normalImpulse;
      m.points[j].tangentImpulse = c.points[j].tangentImpulse;
    }
  }
}
ContactSolver.prototype.solvePositionConstraints = function(baumgarte) {
  var $0, $1;
  var minSeparation = (0);
  for (var i = (0);
   i < this.constraintCount; ++i) {
    var c = this.constraints[i];
    var bodyA = c.bodyA;
    var bodyB = c.bodyB;
    var invMassA = bodyA.mass * bodyA.invMass;
    var invIA = bodyA.mass * bodyA.invInertia;
    var invMassB = bodyB.mass * bodyB.invMass;
    var invIB = bodyB.mass * bodyB.invInertia;
    for (var j = (0);
     j < c.pointCount; ++j) {
      var psm = this.psolver;
      psm.initialize(c, j);
      var normal = psm.normal;
      var point = psm.point;
      var separation = psm.separation;
      this.rA.setFrom(point).subLocal(bodyA.sweep.center);
      this.rB.setFrom(point).subLocal(bodyB.sweep.center);
      minSeparation = Math.min(minSeparation, separation);
      var C = MathBox.clamp(baumgarte * (separation + (0.005)), (-0.2), (0));
      var rnA = Vector.crossVectors(this.rA, normal);
      var rnB = Vector.crossVectors(this.rB, normal);
      var K = invMassA + invMassB + invIA * rnA * rnA + invIB * rnB * rnB;
      var impulse = K > (0) ? -C / K : (0);
      this.P.setFrom(normal).mulLocal(impulse);
      this.temp1.setFrom(this.P).mulLocal(invMassA);
      bodyA.sweep.center.subLocal(this.temp1);
      ;
      ($0 = bodyA.sweep).angle = $0.angle - (invIA * Vector.crossVectors(this.rA, this.P));
      bodyA.synchronizeTransform();
      this.temp1.setFrom(this.P).mulLocal(invMassB);
      bodyB.sweep.center.addLocal(this.temp1);
      ($1 = bodyB.sweep).angle = $1.angle + (invIB * Vector.crossVectors(this.rB, this.P));
      bodyB.synchronizeTransform();
    }
  }
  return minSeparation >= (-0.0075);
}
// ********** Code for PositionSolverManifold **************
function PositionSolverManifold() {
  this.normal = new Vector((0), (0));
  this.point = new Vector((0), (0));
  this.planePoint = new Vector((0), (0));
  this.pointB = new Vector((0), (0));
  this.temp = new Vector((0), (0));
  this.separation = (0);
  this.clipPoint = new Vector((0), (0));
  this.pointA = new Vector((0), (0));
}
PositionSolverManifold.prototype.initialize = function(cc, index) {
  switch (cc.type) {
    case (0):

      cc.bodyA.getWorldPointToOut(cc.localPoint, this.pointA);
      cc.bodyB.getWorldPointToOut(cc.points[(0)].localPoint, this.pointB);
      if (MathBox.distanceSquared(this.pointA, this.pointB) > (1.4208639999999999e-14)) {
        this.normal.setFrom(this.pointB).subLocal(this.pointA);
        this.normal.normalize();
      }
      else {
        this.normal.setCoords((1), (0));
      }
      this.point.setFrom(this.pointA).addLocal(this.pointB).mulLocal((0.5));
      this.temp.setFrom(this.pointB).subLocal(this.pointA);
      this.separation = Vector.dot(this.temp, this.normal) - cc.radius;
      break;

    case (1):

      cc.bodyA.getWorldVectorToOut(cc.localNormal, this.normal);
      cc.bodyA.getWorldPointToOut(cc.localPoint, this.planePoint);
      cc.bodyB.getWorldPointToOut(cc.points[index].localPoint, this.clipPoint);
      this.temp.setFrom(this.clipPoint).subLocal(this.planePoint);
      this.separation = Vector.dot(this.temp, this.normal) - cc.radius;
      this.point.setFrom(this.clipPoint);
      break;

    case (2):

      cc.bodyB.getWorldVectorToOut(cc.localNormal, this.normal);
      cc.bodyB.getWorldPointToOut(cc.localPoint, this.planePoint);
      cc.bodyA.getWorldPointToOut(cc.points[index].localPoint, this.clipPoint);
      this.temp.setFrom(this.clipPoint).subLocal(this.planePoint);
      this.separation = Vector.dot(this.temp, this.normal) - cc.radius;
      this.point.setFrom(this.clipPoint);
      this.normal.negateLocal();

  }
}
// ********** Code for PolygonAndCircleContact **************
$inherits(PolygonAndCircleContact, Contact);
function PolygonAndCircleContact(argPool) {
  Contact.call(this, argPool);
}
PolygonAndCircleContact.prototype.init = function(fA, fB) {
  Expect.equals((1), fA.get$type());
  Expect.equals((0), fB.get$type());
  Contact.prototype.init.call(this, fA, fB);
}
PolygonAndCircleContact.prototype.evaluate = function(argManifold, xfA, xfB) {
  this.pool.collision.collidePolygonAndCircle(argManifold, this.fixtureA.shape, xfA, this.fixtureB.shape, xfB);
}
// ********** Code for PolygonContact **************
$inherits(PolygonContact, Contact);
function PolygonContact(argPool) {
  Contact.call(this, argPool);
}
PolygonContact.prototype.init = function(fA, fB) {
  Expect.equals((1), fA.get$type());
  Expect.equals((1), fB.get$type());
  Contact.prototype.init.call(this, fA, fB);
}
PolygonContact.prototype.evaluate = function(argManifold, xfA, xfB) {
  this.pool.collision.collidePolygons(argManifold, this.fixtureA.shape, xfA, this.fixtureB.shape, xfB);
}
// ********** Code for TimeOfImpactSolver **************
function TimeOfImpactSolver() {
  this.psm = new TimeOfImpactSolverManifold();
  this.constraints = new Array((4));
  this.rB = new Vector((0), (0));
  this.toiBody = null;
  this.P = new Vector((0), (0));
  this.rA = new Vector((0), (0));
  this.temp = new Vector((0), (0));
  this.count = (0);
  for (var i = (0);
   i < this.constraints.get$length(); i++) {
    this.constraints.$setindex(i, new TimeOfImpactConstraint());
  }
}
TimeOfImpactSolver.prototype.initialize = function(contacts, argCount, argToiBody) {
  this.count = argCount;
  this.toiBody = argToiBody;
  if (this.count >= this.constraints.get$length()) {
    var old = this.constraints;
    var newLen = Math.max(this.count, old.get$length() * (2));
    this.constraints = new Array(newLen);
    this.constraints.setRange$3((0), old.get$length(), old);
    for (var i = old.get$length();
     i < this.constraints.get$length(); i++) {
      this.constraints.$setindex(i, new TimeOfImpactConstraint());
    }
  }
  for (var i = (0);
   i < this.count; i++) {
    var contact = contacts[i];
    var fixtureA = contact.fixtureA;
    var fixtureB = contact.fixtureB;
    var shapeA = fixtureA.shape;
    var shapeB = fixtureB.shape;
    var radiusA = shapeA.radius;
    var radiusB = shapeB.radius;
    var bodyA = fixtureA.body;
    var bodyB = fixtureB.body;
    var manifold = contact.manifold;
    var constraint = this.constraints[i];
    constraint.bodyA = bodyA;
    constraint.bodyB = bodyB;
    constraint.localNormal.setFrom(manifold.localNormal);
    constraint.localPoint.setFrom(manifold.localPoint);
    constraint.type = manifold.type;
    constraint.pointCount = manifold.pointCount;
    constraint.radius = radiusA + radiusB;
    for (var j = (0);
     j < constraint.pointCount; ++j) {
      var cp = manifold.points[j];
      constraint.localPoints.$setindex(j, cp.localPoint);
    }
  }
}
TimeOfImpactSolver.prototype.solve = function(baumgarte) {
  var $0, $1;
  var minSeparation = (0);
  for (var i = (0);
   i < this.count; ++i) {
    var c = this.constraints[i];
    var bodyA = c.bodyA;
    var bodyB = c.bodyB;
    var massA = bodyA.mass;
    var massB = bodyB.mass;
    if ($eq(bodyA, this.toiBody)) {
      massB = (0);
    }
    else {
      massA = (0);
    }
    var invMassA = massA * bodyA.invMass;
    var invIA = massA * bodyA.invInertia;
    var invMassB = massB * bodyB.invMass;
    var invIB = massB * bodyB.invInertia;
    for (var j = (0);
     j < c.pointCount; ++j) {
      this.psm.initialize(c, j);
      var normal = this.psm.normal;
      var point = this.psm.point;
      var separation = this.psm.separation;
      this.rA.setFrom(point).subLocal(bodyA.sweep.center);
      this.rB.setFrom(point).subLocal(bodyB.sweep.center);
      minSeparation = Math.min(minSeparation, separation);
      var C = MathBox.clamp(baumgarte * (separation + (0.005)), (-0.2), (0));
      var rnA = Vector.crossVectors(this.rA, normal);
      var rnB = Vector.crossVectors(this.rB, normal);
      var K = invMassA + invMassB + invIA * rnA * rnA + invIB * rnB * rnB;
      var impulse = K > (0) ? -C / K : (0);
      this.P.setFrom(normal).mulLocal(impulse);
      this.temp.setFrom(this.P).mulLocal(invMassA);
      bodyA.sweep.center.subLocal(this.temp);
      ($0 = bodyA.sweep).angle = $0.angle - (invIA * Vector.crossVectors(this.rA, this.P));
      bodyA.synchronizeTransform();
      this.temp.setFrom(this.P).mulLocal(invMassB);
      bodyB.sweep.center.addLocal(this.temp);
      ($1 = bodyB.sweep).angle = $1.angle + (invIB * Vector.crossVectors(this.rB, this.P));
      bodyB.synchronizeTransform();
    }
  }
  return minSeparation >= (-0.0075);
}
// ********** Code for TimeOfImpactSolverManifold **************
function TimeOfImpactSolverManifold() {
  this.normal = new Vector((0), (0));
  this.point = new Vector((0), (0));
  this.planePoint = new Vector((0), (0));
  this.pointB = new Vector((0), (0));
  this.temp = new Vector((0), (0));
  this.separation = (0);
  this.clipPoint = new Vector((0), (0));
  this.pointA = new Vector((0), (0));
}
TimeOfImpactSolverManifold.prototype.initialize = function(cc, index) {
  switch (cc.type) {
    case (0):

      this.pointA.setFrom(cc.bodyA.getWorldPoint(cc.localPoint));
      this.pointB.setFrom(cc.bodyB.getWorldPoint(cc.localPoints[(0)]));
      if (MathBox.distanceSquared(this.pointA, this.pointB) > (1.4208639999999999e-14)) {
        this.normal.setFrom(this.pointB).subLocal(this.pointA);
        this.normal.normalize();
      }
      else {
        this.normal.setCoords((1), (0));
      }
      this.point.setFrom(this.pointA).addLocal(this.pointB).mulLocal((0.5));
      this.temp.setFrom(this.pointB).subLocal(this.pointA);
      this.separation = Vector.dot(this.temp, this.normal) - cc.radius;
      break;

    case (1):

      this.normal.setFrom(cc.bodyA.getWorldVector(cc.localNormal));
      this.planePoint.setFrom(cc.bodyA.getWorldPoint(cc.localPoint));
      this.clipPoint.setFrom(cc.bodyB.getWorldPoint(cc.localPoints[index]));
      this.temp.setFrom(this.clipPoint).subLocal(this.planePoint);
      this.separation = Vector.dot(this.temp, this.normal) - cc.radius;
      this.point.setFrom(this.clipPoint);
      break;

    case (2):

      this.normal.setFrom(cc.bodyB.getWorldVector(cc.localNormal));
      this.planePoint.setFrom(cc.bodyB.getWorldPoint(cc.localPoint));
      this.clipPoint.setFrom(cc.bodyA.getWorldPoint(cc.localPoints[index]));
      this.temp.setFrom(this.clipPoint).subLocal(this.planePoint);
      this.separation = Vector.dot(this.temp, this.normal) - cc.radius;
      this.point.setFrom(this.clipPoint);
      this.normal.negateLocal();
      break;

  }
}
// ********** Code for TimeOfImpactConstraint **************
function TimeOfImpactConstraint() {
  this.bodyB = null;
  this.pointCount = (0);
  this.localPoints = new Array((2));
  this.radius = (0);
  this.localPoint = new Vector((0), (0));
  this.bodyA = null;
  this.type = (0);
  this.localNormal = new Vector((0), (0));
  for (var i = (0);
   i < this.localPoints.get$length(); i++) {
    this.localPoints.$setindex(i, new Vector((0), (0)));
  }
}
TimeOfImpactConstraint.prototype.get$type = function() { return this.type; };
TimeOfImpactConstraint.prototype.set$type = function(value) { return this.type = value; };
TimeOfImpactConstraint.prototype.get$radius = function() { return this.radius; };
TimeOfImpactConstraint.prototype.set$radius = function(value) { return this.radius = value; };
// ********** Code for DefaultWorldPool **************
function DefaultWorldPool() {
  this.distance = new Distance._construct$ctor();
  this.collision = new Collision._construct$ctor(this);
  this.timeOfImpact = new TimeOfImpact._construct$ctor(this);
}
DefaultWorldPool.prototype.getCircleContactStack = function() {
  var queue = new DoubleLinkedQueue_CircleContact();
  for (var i = (0);
   i < (10); i++) {
    queue.addFirst(new CircleContact(this));
  }
  return queue;
}
DefaultWorldPool.prototype.getPolyCircleContactStack = function() {
  var queue = new DoubleLinkedQueue_PolygonAndCircleContact();
  for (var i = (0);
   i < (10); i++) {
    queue.addFirst(new PolygonAndCircleContact(this));
  }
  return queue;
}
DefaultWorldPool.prototype.getPolyContactStack = function() {
  var queue = new DoubleLinkedQueue_PolygonContact();
  for (var i = (0);
   i < (10); i++) {
    queue.addFirst(new PolygonContact(this));
  }
  return queue;
}
// ********** Code for MathBox **************
function MathBox() {}
MathBox.distanceSquared = function(v1, v2) {
  var dx = (v1.x - v2.x);
  var dy = (v1.y - v2.y);
  return dx * dx + dy * dy;
}
MathBox.distance = function(v1, v2) {
  return Math.sqrt(MathBox.distanceSquared(v1, v2));
}
MathBox.clamp = function(a, low, high) {
  return Math.max(low, Math.min(a, high));
}
// ********** Code for Matrix22 **************
function Matrix22(c1, c2) {
  if (c1 == null) {
    c1 = new Vector((0), (0));
  }
  if (c2 == null) {
    c2 = new Vector((0), (0));
  }
  this.col1 = c1;
  this.col2 = c2;
}
Matrix22.prototype.get$col1 = function() { return this.col1; };
Matrix22.prototype.set$col1 = function(value) { return this.col1 = value; };
Matrix22.prototype.get$col2 = function() { return this.col2; };
Matrix22.prototype.set$col2 = function(value) { return this.col2 = value; };
Matrix22.prototype.$eq = function(other) {
  if ($ne(other) && (other instanceof Matrix22)) {
    return $eq(this.col1, other.get$col1()) && $eq(this.col2, other.get$col2());
  }
  else {
    return false;
  }
}
Matrix22.prototype.setAngle = function(angle) {
  var cosin = Math.cos(angle);
  var sin = Math.sin(angle);
  this.col1.setCoords(cosin, sin);
  this.col2.setCoords(-sin, cosin);
}
Matrix22.prototype.setFrom = function(matrix) {
  this.col1.setFrom(matrix.col1);
  this.col2.setFrom(matrix.col2);
}
Matrix22.mulTransMatrixAndVectorToOut = function(matrix, vector, out) {
  var outx = vector.x * matrix.col1.x + vector.y * matrix.col1.y;
  out.y = vector.x * matrix.col2.x + vector.y * matrix.col2.y;
  out.x = outx;
}
Matrix22.mulMatrixAndVectorToOut = function(matrix, vector, out) {
  var tempy = matrix.col1.y * vector.x + matrix.col2.y * vector.y;
  out.x = matrix.col1.x * vector.x + matrix.col2.x * vector.y;
  out.y = tempy;
}
Matrix22.prototype.invertLocal = function() {
  var a = this.col1.x, b = this.col2.x, c = this.col1.y, d = this.col2.y;
  var det = a * d - b * c;
  if (det != (0)) {
    det = (1) / det;
  }
  this.col1.x = det * d;
  this.col2.x = -det * b;
  this.col1.y = -det * c;
  this.col2.y = det * a;
  return this;
}
Matrix22.prototype.toString = function() {
  return $add($add(this.col1.toString(), ", "), this.col2.toString());
}
// ********** Code for Settings **************
function Settings() {}
Settings.mixFriction = function(friction1, friction2) {
  return Math.sqrt(friction1 * friction2);
}
Settings.mixRestitution = function(restitution1, restitution2) {
  return restitution1 > restitution2 ? restitution1 : restitution2;
}
// ********** Code for Sweep **************
function Sweep() {
  this.angle = (0);
  this.angleZero = (0);
  this.centerZero = new Vector((0), (0));
  this.center = new Vector((0), (0));
  this.localCenter = new Vector((0), (0));
}
Sweep.prototype.get$localCenter = function() { return this.localCenter; };
Sweep.prototype.get$centerZero = function() { return this.centerZero; };
Sweep.prototype.get$center = function() { return this.center; };
Sweep.prototype.get$angleZero = function() { return this.angleZero; };
Sweep.prototype.set$angleZero = function(value) { return this.angleZero = value; };
Sweep.prototype.get$angle = function() { return this.angle; };
Sweep.prototype.set$angle = function(value) { return this.angle = value; };
Sweep.prototype.$eq = function(other) {
  return $eq(this.localCenter, other.get$localCenter()) && $eq(this.centerZero, other.get$centerZero()) && $eq(this.center, other.get$center()) && this.angleZero == other.get$angleZero() && this.angle == other.get$angle();
}
Sweep.prototype.setFrom = function(other) {
  this.localCenter.setFrom(other.localCenter);
  this.centerZero.setFrom(other.centerZero);
  this.center.setFrom(other.center);
  this.angleZero = other.angleZero;
  this.angle = other.angle;
}
Sweep.prototype.normalize = function() {
  var d = (6.283185307179586) * (this.angleZero / (6.283185307179586)).floor();
  this.angleZero = this.angleZero - d;
  this.angle = this.angle - d;
}
Sweep.prototype.getTransform = function(xf, alpha) {
  var $0, $1;
  xf.position.x = ((1) - alpha) * this.centerZero.x + alpha * this.center.x;
  xf.position.y = ((1) - alpha) * this.centerZero.y + alpha * this.center.y;
  xf.rotation.setAngle(((1) - alpha) * this.angleZero + alpha * this.angle);
  ($0 = xf.position).x = $0.x - (xf.rotation.col1.x * this.localCenter.x + xf.rotation.col2.x * this.localCenter.y);
  ($1 = xf.position).y = $1.y - (xf.rotation.col1.y * this.localCenter.x + xf.rotation.col2.y * this.localCenter.y);
}
Sweep.prototype.advance = function(time) {
  this.centerZero.x = ((1) - time) * this.centerZero.x + time * this.center.x;
  this.centerZero.y = ((1) - time) * this.centerZero.y + time * this.center.y;
  this.angleZero = ((1) - time) * this.angleZero + time * this.angle;
}
// ********** Code for Transform **************
function Transform() {
  this.position = new Vector((0), (0));
  this.rotation = new Matrix22();
}
Transform.prototype.get$position = function() { return this.position; };
Transform.prototype.get$rotation = function() { return this.rotation; };
Transform.prototype.$eq = function(other) {
  if ($eq(other)) {
    return false;
  }
  else {
    return $eq(this.position, other.get$position()) && $eq(this.rotation, other.get$rotation());
  }
}
Transform.prototype.setFrom = function(other) {
  this.position.setFrom(other.position);
  this.rotation.setFrom(other.rotation);
}
Transform.mulToOut = function(transform, vector, out) {
  var tempY = transform.position.y + transform.rotation.col1.y * vector.x + transform.rotation.col2.y * vector.y;
  out.x = transform.position.x + transform.rotation.col1.x * vector.x + transform.rotation.col2.x * vector.y;
  out.y = tempY;
}
Transform.mulTransToOut = function(T, v, out) {
  var v1x = v.x - T.position.x;
  var v1y = v.y - T.position.y;
  var b = T.rotation.col1;
  var b1 = T.rotation.col2;
  var tempy = v1x * b1.x + v1y * b1.y;
  out.x = v1x * b.x + v1y * b.y;
  out.y = tempy;
}
// ********** Code for Vector **************
function Vector(x, y) {
  this.y = y;
  this.x = x;
}
Vector.copy$ctor = function(other) {
  this.y = other.y;
  this.x = other.x;
}
Vector.copy$ctor.prototype = Vector.prototype;
Vector.prototype.get$x = function() { return this.x; };
Vector.prototype.set$x = function(value) { return this.x = value; };
Vector.prototype.get$y = function() { return this.y; };
Vector.prototype.set$y = function(value) { return this.y = value; };
Vector.prototype.$eq = function(other) {
  if ($eq(other)) {
    return false;
  }
  else {
    return this.x == other.get$x() && this.y == other.get$y();
  }
}
Vector.prototype.addLocal = function(v) {
  this.x = this.x + v.x;
  this.y = this.y + v.y;
  return this;
}
Vector.prototype.subLocal = function(other) {
  this.x = this.x - other.x;
  this.y = this.y - other.y;
  return this;
}
Vector.prototype.setCoords = function(xCoord, yCoord) {
  this.x = xCoord;
  this.y = yCoord;
  return this;
}
Vector.crossVectors = function(v1, v2) {
  return (v1.x * v2.y - v1.y * v2.x);
}
Vector.dot = function(one, two) {
  return one.x * two.x + one.y * two.y;
}
Vector.crossNumAndVectorToOut = function(s, a, out) {
  var tempY = s * a.x;
  out.x = -s * a.y;
  out.y = tempY;
}
Vector.crossVectorAndNumToOut = function(a, s, out) {
  var tempy = -s * a.x;
  out.x = s * a.y;
  out.y = tempy;
}
Vector.prototype.setFrom = function(v) {
  this.setCoords(v.x, v.y);
  return this;
}
Vector.prototype.mulLocal = function(d) {
  this.x = this.x * d;
  this.y = this.y * d;
  return this;
}
Vector.prototype.setZero = function() {
  this.setCoords((0), (0));
  return this;
}
Vector.prototype.get$length = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
}
Vector.minToOut = function(a, b, out) {
  out.x = a.x < b.x ? a.x : b.x;
  out.y = a.y < b.y ? a.y : b.y;
}
Vector.maxToOut = function(a, b, out) {
  out.x = a.x > b.x ? a.x : b.x;
  out.y = a.y > b.y ? a.y : b.y;
}
Vector.prototype.get$lengthSquared = function() {
  return this.x * this.x + this.y * this.y;
}
Vector.prototype.absLocal = function() {
  this.x = this.x.abs();
  this.y = this.y.abs();
}
Vector.prototype.normalize = function() {
  var len = this.get$length();
  if (len < (1.192e-7)) {
    return (0);
  }
  var invLength = (1) / len;
  this.x = this.x * invLength;
  this.y = this.y * invLength;
  return len;
}
Vector.prototype.negateLocal = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
}
Vector.prototype.toString = function() {
  return $add($add("(" + this.x, ", ") + this.y, ")");
}
// ********** Code for top level **************
//  ********** Library Bench2d **************
// ********** Code for Bench2d **************
function Bench2d() {
  var gravity = new Vector((0), (-10));
  var doSleep = true;
  this.world = new World(gravity, doSleep, new DefaultWorldPool());
}
Bench2d.prototype.initialize = function() {
  {
    var bd = new BodyDef();
    var ground = this.world.createBody(bd);
    var shape = new PolygonShape();
    shape.setAsEdge(new Vector((-40), (0)), new Vector((40), (0)));
    var fixDef = new FixtureDef();
    fixDef.set$shape(shape);
    fixDef.set$density((0));
    ground.createFixture(fixDef);
  }
  {
    var a = (0.5);
    var shape = new PolygonShape();
    shape.setAsBox(a, a);
    var fixDef = new FixtureDef();
    fixDef.set$shape(shape);
    fixDef.set$density((5));
    var x = new Vector((-7), (0.75));
    var y = new Vector((0), (0));
    var deltaX = new Vector((0.5625), (1));
    var deltaY = new Vector((1.125), (0));
    for (var i = (0);
     i < (40); ++i) {
      y.setFrom(x);
      for (var j = i;
       j < (40); ++j) {
        var bd = new BodyDef();
        bd.type = (2);
        bd.position.setFrom(y);
        var body = this.world.createBody(bd);
        body.createFixture(fixDef);
        y.addLocal(deltaY);
      }
      x.addLocal(deltaX);
    }
  }
}
Bench2d.prototype.step = function() {
  this.world.step((0.016666666666666666), (3), (3));
}
Bench2d.prototype.warmup = function() {
  for (var i = (0);
   i < (64); ++i) this.step();
}
Bench2d.prototype.bench = function() {
  var times = new Array((256));
  for (var i = (0);
   i < (256); ++i) {
    var watch = new StopwatchImplementation();
    watch.start$0();
    this.step();
    watch.stop();
    times.$setindex(i, (1000) * watch.elapsed() / watch.frequency());
    dart_core_print(("" + i + ": " + times.$index(i)));
  }
  var total = (0);
  for (var i = (0);
   i < (256); ++i) total = $add(total, times.$index(i));
  dart_core_print(("Average: " + (total / (256))));
}
Bench2d.prototype.initialize$0 = Bench2d.prototype.initialize;
// ********** Code for top level **************
function main() {
  var bench2d = new Bench2d();
  bench2d.initialize$0();
  bench2d.warmup();
  bench2d.bench();
}
// 113 dynamic types.
// 164 types
// 11 !leaf
(function(){
  var table = [
    // [dynamic-dispatch-tag, tags of classes implementing dynamic-dispatch-tag]
    ['Blob', 'Blob|File'],
    ['CSSRule', 'CSSRule|CSSCharsetRule|CSSFontFaceRule|CSSImportRule|CSSMediaRule|CSSPageRule|CSSStyleRule|CSSUnknownRule|WebKitCSSKeyframeRule|WebKitCSSKeyframesRule'],
    ['DOMTokenList', 'DOMTokenList|DOMSettableTokenList'],
    ['Event', 'Event|AudioProcessingEvent|BeforeLoadEvent|CloseEvent|CustomEvent|DeviceMotionEvent|DeviceOrientationEvent|ErrorEvent|HashChangeEvent|IDBVersionChangeEvent|MessageEvent|MutationEvent|OfflineAudioCompletionEvent|OverflowEvent|PageTransitionEvent|PopStateEvent|ProgressEvent|XMLHttpRequestProgressEvent|SpeechInputEvent|StorageEvent|TrackEvent|UIEvent|CompositionEvent|KeyboardEvent|MouseEvent|SVGZoomEvent|TextEvent|TouchEvent|WheelEvent|WebGLContextEvent|WebKitAnimationEvent|WebKitTransitionEvent'],
    ['HTMLCollection', 'HTMLCollection|HTMLOptionsCollection|HTMLPropertiesCollection'],
    ['HTMLInputElement', 'HTMLInputElement|HTMLIsIndexElement'],
    ['SVGComponentTransferFunctionElement', 'SVGComponentTransferFunctionElement|SVGFEFuncAElement|SVGFEFuncBElement|SVGFEFuncGElement|SVGFEFuncRElement'],
    ['SVGTextPositioningElement', 'SVGTextPositioningElement|SVGAltGlyphElement|SVGTRefElement|SVGTSpanElement|SVGTextElement'],
    ['StyleSheet', 'StyleSheet|CSSStyleSheet'],
  ];
  $dynamicSetMetadata(table);
})();
//  ********** Globals **************
function $static_init(){
}
var const$0000 = Object.create(EmptyQueueException.prototype, {});
var const$0001 = Object.create(NoMoreElementsException.prototype, {});
var $globals = {};
$static_init();
main();
