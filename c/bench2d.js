// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
try {
  this['Module'] = Module;
} catch(e) {
  this['Module'] = Module = {};
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function(filename) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename).toString();
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename).toString();
    }
    return ret;
  };
  Module['load'] = function(f) {
    globalEval(read(f));
  };
  if (!Module['arguments']) {
    Module['arguments'] = process['argv'].slice(2);
  }
}
if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  // Polyfill over SpiderMonkey/V8 differences
  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function(f) { snarf(f) };
  }
  if (!Module['arguments']) {
    if (typeof scriptArgs != 'undefined') {
      Module['arguments'] = scriptArgs;
    } else if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) {
  if (!Module['print']) {
    Module['print'] = function(x) {
      console.log(x);
    };
  }
  if (!Module['printErr']) {
    Module['printErr'] = function(x) {
      console.log(x);
    };
  }
}
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (!Module['arguments']) {
    if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }
  }
}
if (ENVIRONMENT_IS_WORKER) {
  // We can do very little here...
  var TRY_USE_DUMP = false;
  if (!Module['print']) {
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  Module['load'] = importScripts;
}
if (!ENVIRONMENT_IS_WORKER && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_SHELL) {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
if (!Module['preRun']) Module['preRun'] = [];
if (!Module['postRun']) Module['postRun'] = [];
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      var logg = log2(quantum);
      return '((((' +target + ')+' + (quantum-1) + ')>>' + logg + ')<<' + logg + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (/^\[\d+\ x\ (.*)\]/.test(type)) return true; // [15 x ?] blocks. Like structs
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type, quantumSize) {
    if (Runtime.QUANTUM_SIZE == 1) return 1;
    var size = {
      '%i1': 1,
      '%i8': 1,
      '%i16': 2,
      '%i32': 4,
      '%i64': 8,
      "%float": 4,
      "%double": 8
    }['%'+type]; // add '%' since float and double confuse Closure compiler as keys, and also spidermonkey as a compiler will remove 's from '_i8' etc
    if (!size) {
      if (type.charAt(type.length-1) == '*') {
        size = Runtime.QUANTUM_SIZE; // A pointer
      } else if (type[0] == 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 == 0);
        size = bits/8;
      }
    }
    return size;
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    type.flatIndexes = type.fields.map(function(field) {
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = size;
      } else if (Runtime.isStructType(field)) {
        size = Types.types[field].flatSize;
        alignSize = Types.types[field].alignSize;
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else {
        throw 'Unclear type in struct: ' + field + ', in ' + type.name_ + ' :: ' + dump(Types.types[type.name_]);
      }
      alignSize = type.packed ? 1 : Math.min(alignSize, Runtime.QUANTUM_SIZE);
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  addFunction: function (func, sig) {
    //assert(sig); // TODO: support asm
    var table = FUNCTION_TABLE; // TODO: support asm
    var ret = table.length;
    table.push(func);
    table.push(0);
    return ret;
  },
  removeFunction: function (index) {
    var table = FUNCTION_TABLE; // TODO: support asm
    table[index] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function() {
        Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xff;
      if (needed) {
        buffer.push(code);
        needed--;
      }
      if (buffer.length == 0) {
        if (code < 128) return String.fromCharCode(code);
        buffer.push(code);
        if (code > 191 && code < 224) {
          needed = 1;
        } else {
          needed = 2;
        }
        return '';
      }
      if (needed > 0) return '';
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var ret;
      if (c1 > 191 && c1 < 224) {
        ret = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      } else {
        ret = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = ((((STACKTOP)+3)>>2)<<2); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = ((((STATICTOP)+3)>>2)<<2); if (STATICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 4))*(quantum ? quantum : 4); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+(((low)>>>(0))))+((+(((high)>>>(0))))*(+(4294967296)))) : ((+(((low)>>>(0))))+((+(((high)|(0))))*(+(4294967296))))); return ret; },
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var setjmpId = 1; // Used in setjmp/longjmp
var setjmpLabels = {};
var ABORT = false;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function abort(text) {
  Module.print(text + ':\n' + (new Error).stack);
  ABORT = true;
  throw "Assertion: " + text;
}
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = globalScope['Module']['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length+1);
      writeStringToMemory(value, ret);
      return ret;
    } else if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,Math.min(Math.floor((value)/(+(4294967296))), (+(4294967295)))>>>0],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': (HEAPF64[(tempDoublePtr)>>3]=value,HEAP32[((ptr)>>2)]=((HEAP32[((tempDoublePtr)>>2)])|0),HEAP32[(((ptr)+(4))>>2)]=((HEAP32[(((tempDoublePtr)+(4))>>2)])|0)); break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return (HEAP32[((tempDoublePtr)>>2)]=HEAP32[((ptr)>>2)],HEAP32[(((tempDoublePtr)+(4))>>2)]=HEAP32[(((ptr)+(4))>>2)],(+(HEAPF64[(tempDoublePtr)>>3])));
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_NONE = 3; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    HEAPU8.set(new Uint8Array(slab), ret);
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return ((x+4095)>>12)<<12;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STACK_ROOT, STACKTOP, STACK_MAX;
var STATICTOP;
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value, or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 67108864;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(!!Int32Array && !!Float64Array && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
STACK_ROOT = STACKTOP = Runtime.alignMemory(1);
STACK_MAX = TOTAL_STACK; // we lose a little stack here, but TOTAL_STACK is nice and round so use that as the max
var tempDoublePtr = Runtime.alignMemory(allocate(12, 'i8', ALLOC_STACK), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
STATICTOP = STACK_MAX;
assert(STATICTOP < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
var nullString = allocate(intArrayFromString('(null)'), 'i8', ALLOC_STACK);
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATINIT__ = []; // functions called during startup
var __ATMAIN__ = []; // functions called when main() is to be run
var __ATEXIT__ = []; // functions called during shutdown
function initRuntime() {
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math.imul) Math.imul = function(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyTracking = {};
var calledRun = false;
var runDependencyWatcher = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 6000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    } 
    // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
    if (!calledRun && shouldRunNow) run();
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
// === Body ===
assert(STATICTOP == STACK_MAX); assert(STACK_MAX == TOTAL_STACK);
STATICTOP += 9516;
assert(STATICTOP < TOTAL_MEMORY);
__ATINIT__ = __ATINIT__.concat([
]);
var __ZTVN10__cxxabiv120__si_class_type_infoE;
var __ZTVN10__cxxabiv117__class_type_infoE;
allocate(24, "i8", ALLOC_NONE, 5242880);
allocate(4, "i8", ALLOC_NONE, 5242904);
allocate(4, "i8", ALLOC_NONE, 5242908);
allocate(4, "i8", ALLOC_NONE, 5242912);
allocate(4, "i8", ALLOC_NONE, 5242916);
allocate(4, "i8", ALLOC_NONE, 5242920);
allocate(4, "i8", ALLOC_NONE, 5242924);
allocate(4, "i8", ALLOC_NONE, 5242928);
allocate(4, "i8", ALLOC_NONE, 5242932);
allocate(4, "i8", ALLOC_NONE, 5242936);
allocate(4, "i8", ALLOC_NONE, 5242940);
allocate(8, "i8", ALLOC_NONE, 5242944);
allocate([48,32,60,61,32,105,66,32,38,38,32,105,66,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0] /* 0 _= iB && iB _ m_no */, "i8", ALLOC_NONE, 5242952);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,66,111,100,121,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5242984);
allocate([105,65,32,33,61,32,40,45,49,41,0] /* iA != (-1)\00 */, "i8", ALLOC_NONE, 5243024);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,105,115,116,97,110,99,101,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5243036);
allocate([109,95,119,111,114,108,100,45,62,73,115,76,111,99,107,101,100,40,41,32,61,61,32,102,97,108,115,101,0] /* m_world-_IsLocked()  */, "i8", ALLOC_NONE, 5243080);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,109,109,111,110,47,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5243112);
allocate([97,108,112,104,97,48,32,60,32,49,46,48,102,0] /* alpha0 _ 1.0f\00 */, "i8", ALLOC_NONE, 5243160);
allocate([99,104,105,108,100,50,32,33,61,32,40,45,49,41,0] /* child2 != (-1)\00 */, "i8", ALLOC_NONE, 5243176);
allocate([98,50,73,115,86,97,108,105,100,40,98,100,45,62,108,105,110,101,97,114,68,97,109,112,105,110,103,41,32,38,38,32,98,100,45,62,108,105,110,101,97,114,68,97,109,112,105,110,103,32,62,61,32,48,46,48,102,0] /* b2IsValid(bd-_linear */, "i8", ALLOC_NONE, 5243192);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,109,109,111,110,47,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5243252);
allocate([116,121,112,101,65,32,61,61,32,98,50,95,100,121,110,97,109,105,99,66,111,100,121,32,124,124,32,116,121,112,101,66,32,61,61,32,98,50,95,100,121,110,97,109,105,99,66,111,100,121,0] /* typeA == b2_dynamicB */, "i8", ALLOC_NONE, 5243300);
allocate([99,104,105,108,100,49,32,33,61,32,40,45,49,41,0] /* child1 != (-1)\00 */, "i8", ALLOC_NONE, 5243352);
allocate([98,50,73,115,86,97,108,105,100,40,98,100,45,62,97,110,103,117,108,97,114,68,97,109,112,105,110,103,41,32,38,38,32,98,100,45,62,97,110,103,117,108,97,114,68,97,109,112,105,110,103,32,62,61,32,48,46,48,102,0] /* b2IsValid(bd-_angula */, "i8", ALLOC_NONE, 5243368);
allocate([112,32,61,61,32,101,110,116,114,121,45,62,100,97,116,97,0] /* p == entry-_data\00 */, "i8", ALLOC_NONE, 5243428);
allocate([97,114,101,97,32,62,32,49,46,49,57,50,48,57,50,57,48,69,45,48,55,70,0] /* area _ 1.19209290E-0 */, "i8", ALLOC_NONE, 5243448);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,83,104,97,112,101,115,47,98,50,80,111,108,121,103,111,110,83,104,97,112,101,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5243472);
allocate([48,32,60,32,99,111,117,110,116,32,38,38,32,99,111,117,110,116,32,60,32,51,0] /* 0 _ count && count _ */, "i8", ALLOC_NONE, 5243528);
allocate([112,99,45,62,112,111,105,110,116,67,111,117,110,116,32,62,32,48,0] /* pc-_pointCount _ 0\0 */, "i8", ALLOC_NONE, 5243552);
allocate([109,95,110,111,100,101,115,91,112,114,111,120,121,73,100,93,46,73,115,76,101,97,102,40,41,0] /* m_nodes[proxyId].IsL */, "i8", ALLOC_NONE, 5243572);
allocate([115,116,97,99,107,67,111,117,110,116,32,60,32,115,116,97,99,107,83,105,122,101,0] /* stackCount _ stackSi */, "i8", ALLOC_NONE, 5243600);
allocate([99,97,99,104,101,45,62,99,111,117,110,116,32,60,61,32,51,0] /* cache-_count _= 3\00 */, "i8", ALLOC_NONE, 5243624);
allocate([98,50,73,115,86,97,108,105,100,40,98,100,45,62,97,110,103,117,108,97,114,86,101,108,111,99,105,116,121,41,0] /* b2IsValid(bd-_angula */, "i8", ALLOC_NONE, 5243644);
allocate([109,95,101,110,116,114,121,67,111,117,110,116,32,62,32,48,0] /* m_entryCount _ 0\00 */, "i8", ALLOC_NONE, 5243676);
allocate([98,108,111,99,107,67,111,117,110,116,32,42,32,98,108,111,99,107,83,105,122,101,32,60,61,32,98,50,95,99,104,117,110,107,83,105,122,101,0] /* blockCount _ blockSi */, "i8", ALLOC_NONE, 5243696);
allocate([109,95,118,101,114,116,101,120,67,111,117,110,116,32,62,61,32,51,0] /* m_vertexCount _= 3\0 */, "i8", ALLOC_NONE, 5243736);
allocate([48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,109,95,99,111,117,110,116,32,45,32,49,0] /* 0 _= index && index  */, "i8", ALLOC_NONE, 5243756);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,83,104,97,112,101,115,47,98,50,67,104,97,105,110,83,104,97,112,101,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5243792);
allocate([97,46,120,32,62,61,32,48,46,48,102,32,38,38,32,97,46,121,32,62,61,32,48,46,48,102,0] /* a.x _= 0.0f && a.y _ */, "i8", ALLOC_NONE, 5243848);
allocate([48,32,60,61,32,116,121,112,101,65,32,38,38,32,116,121,112,101,66,32,60,32,98,50,83,104,97,112,101,58,58,101,95,116,121,112,101,67,111,117,110,116,0] /* 0 _= typeA && typeB  */, "i8", ALLOC_NONE, 5243876);
allocate([98,45,62,73,115,65,99,116,105,118,101,40,41,32,61,61,32,116,114,117,101,0] /* b-_IsActive() == tru */, "i8", ALLOC_NONE, 5243920);
allocate([48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,109,95,99,111,117,110,116,0] /* 0 _= index && index  */, "i8", ALLOC_NONE, 5243944);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,67,111,108,108,105,100,101,80,111,108,121,103,111,110,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5243976);
allocate([98,50,73,115,86,97,108,105,100,40,98,100,45,62,97,110,103,108,101,41,0] /* b2IsValid(bd-_angle) */, "i8", ALLOC_NONE, 5244028);
allocate([109,95,101,110,116,114,121,67,111,117,110,116,32,60,32,98,50,95,109,97,120,83,116,97,99,107,69,110,116,114,105,101,115,0] /* m_entryCount _ b2_ma */, "i8", ALLOC_NONE, 5244052);
allocate([48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,98,50,95,98,108,111,99,107,83,105,122,101,115,0] /* 0 _= index && index  */, "i8", ALLOC_NONE, 5244088);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,84,105,109,101,79,102,73,109,112,97,99,116,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5244124);
allocate([48,46,48,102,32,60,61,32,108,111,119,101,114,32,38,38,32,108,111,119,101,114,32,60,61,32,105,110,112,117,116,46,109,97,120,70,114,97,99,116,105,111,110,0] /* 0.0f _= lower && low */, "i8", ALLOC_NONE, 5244172);
allocate([112,111,105,110,116,67,111,117,110,116,32,61,61,32,49,32,124,124,32,112,111,105,110,116,67,111,117,110,116,32,61,61,32,50,0] /* pointCount == 1 || p */, "i8", ALLOC_NONE, 5244216);
allocate([115,95,105,110,105,116,105,97,108,105,122,101,100,32,61,61,32,116,114,117,101,0] /* s_initialized == tru */, "i8", ALLOC_NONE, 5244252);
allocate([48,32,60,32,109,95,110,111,100,101,67,111,117,110,116,0] /* 0 _ m_nodeCount\00 */, "i8", ALLOC_NONE, 5244276);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,105,115,116,97,110,99,101,46,104,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5244292);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,67,111,108,108,105,100,101,69,100,103,101,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5244336);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5244384);
allocate([98,100,45,62,108,105,110,101,97,114,86,101,108,111,99,105,116,121,46,73,115,86,97,108,105,100,40,41,0] /* bd-_linearVelocity.I */, "i8", ALLOC_NONE, 5244444);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5244476);
allocate([109,95,98,111,100,121,67,111,117,110,116,32,60,32,109,95,98,111,100,121,67,97,112,97,99,105,116,121,0] /* m_bodyCount _ m_body */, "i8", ALLOC_NONE, 5244544);
allocate([109,95,101,110,116,114,121,67,111,117,110,116,32,61,61,32,48,0] /* m_entryCount == 0\00 */, "i8", ALLOC_NONE, 5244576);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5244596);
allocate([109,95,99,111,110,116,97,99,116,67,111,117,110,116,32,60,32,109,95,99,111,110,116,97,99,116,67,97,112,97,99,105,116,121,0] /* m_contactCount _ m_c */, "i8", ALLOC_NONE, 5244664);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5244700);
allocate([48,32,60,32,115,105,122,101,0] /* 0 _ size\00 */, "i8", ALLOC_NONE, 5244764);
allocate([109,95,106,111,105,110,116,67,111,117,110,116,32,60,32,109,95,106,111,105,110,116,67,97,112,97,99,105,116,121,0] /* m_jointCount _ m_joi */, "i8", ALLOC_NONE, 5244776);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,73,115,108,97,110,100,46,104,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5244808);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5244848);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,109,109,111,110,47,98,50,77,97,116,104,46,104,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5244908);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,111,110,116,97,99,116,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5244944);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5244996);
allocate([109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,112,111,108,121,103,111,110,0] /* m_fixtureB-_GetType( */, "i8", ALLOC_NONE, 5245056);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5245100);
allocate([109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,105,114,99,108,101,0] /* m_fixtureB-_GetType( */, "i8", ALLOC_NONE, 5245168);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5245212);
allocate([109,97,110,105,102,111,108,100,45,62,112,111,105,110,116,67,111,117,110,116,32,62,32,48,0] /* manifold-_pointCount */, "i8", ALLOC_NONE, 5245280);
allocate([48,32,60,61,32,116,121,112,101,50,32,38,38,32,116,121,112,101,50,32,60,32,98,50,83,104,97,112,101,58,58,101,95,116,121,112,101,67,111,117,110,116,0] /* 0 _= type2 && type2  */, "i8", ALLOC_NONE, 5245308);
allocate([116,111,105,73,110,100,101,120,66,32,60,32,109,95,98,111,100,121,67,111,117,110,116,0] /* toiIndexB _ m_bodyCo */, "i8", ALLOC_NONE, 5245352);
allocate([48,32,60,61,32,110,111,100,101,73,100,32,38,38,32,110,111,100,101,73,100,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0] /* 0 _= nodeId && nodeI */, "i8", ALLOC_NONE, 5245376);
allocate([48,32,60,61,32,112,114,111,120,121,73,100,32,38,38,32,112,114,111,120,121,73,100,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0] /* 0 _= proxyId && prox */, "i8", ALLOC_NONE, 5245416);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,121,110,97,109,105,99,84,114,101,101,46,104,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5245460);
allocate([48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,99,104,97,105,110,45,62,109,95,99,111,117,110,116,0] /* 0 _= index && index  */, "i8", ALLOC_NONE, 5245508);
allocate([98,100,45,62,112,111,115,105,116,105,111,110,46,73,115,86,97,108,105,100,40,41,0] /* bd-_position.IsValid */, "i8", ALLOC_NONE, 5245548);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,87,111,114,108,100,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5245572);
allocate([109,95,105,110,100,101,120,32,61,61,32,48,0] /* m_index == 0\00 */, "i8", ALLOC_NONE, 5245612);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,73,115,108,97,110,100,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5245628);
allocate([106,32,60,32,98,50,95,98,108,111,99,107,83,105,122,101,115,0] /* j _ b2_blockSizes\00 */, "i8", ALLOC_NONE, 5245672);
allocate([109,95,110,111,100,101,115,91,66,45,62,112,97,114,101,110,116,93,46,99,104,105,108,100,50,32,61,61,32,105,65,0] /* m_nodes[B-_parent].c */, "i8", ALLOC_NONE, 5245692);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,121,110,97,109,105,99,84,114,101,101,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/C */, "i8", ALLOC_NONE, 5245724);
allocate([48,32,60,61,32,105,69,32,38,38,32,105,69,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0] /* 0 _= iE && iE _ m_no */, "i8", ALLOC_NONE, 5245772);
allocate([48,32,60,61,32,101,100,103,101,49,32,38,38,32,101,100,103,101,49,32,60,32,112,111,108,121,49,45,62,109,95,118,101,114,116,101,120,67,111,117,110,116,0] /* 0 _= edge1 && edge1  */, "i8", ALLOC_NONE, 5245804);
allocate([48,32,60,61,32,105,68,32,38,38,32,105,68,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0] /* 0 _= iD && iD _ m_no */, "i8", ALLOC_NONE, 5245848);
allocate([116,97,114,103,101,116,32,62,32,116,111,108,101,114,97,110,99,101,0] /* target _ tolerance\0 */, "i8", ALLOC_NONE, 5245880);
allocate([102,97,108,115,101,0] /* false\00 */, "i8", ALLOC_NONE, 5245900);
allocate([66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,70,105,120,116,117,114,101,46,99,112,112,0] /* Box2D_v2.2.1/Box2D/D */, "i8", ALLOC_NONE, 5245908);
allocate([109,95,110,111,100,101,115,91,67,45,62,112,97,114,101,110,116,93,46,99,104,105,108,100,50,32,61,61,32,105,65,0] /* m_nodes[C-_parent].c */, "i8", ALLOC_NONE, 5245952);
allocate([109,95,73,32,62,32,48,46,48,102,0] /* m_I _ 0.0f\00 */, "i8", ALLOC_NONE, 5245984);
allocate([109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,112,111,108,121,103,111,110,0] /* m_fixtureA-_GetType( */, "i8", ALLOC_NONE, 5245996);
allocate([109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,101,100,103,101,0] /* m_fixtureA-_GetType( */, "i8", ALLOC_NONE, 5246040);
allocate([112,111,105,110,116,67,111,117,110,116,32,62,32,48,0] /* pointCount _ 0\00 */, "i8", ALLOC_NONE, 5246084);
allocate([48,32,60,61,32,116,121,112,101,49,32,38,38,32,116,121,112,101,49,32,60,32,98,50,83,104,97,112,101,58,58,101,95,116,121,112,101,67,111,117,110,116,0] /* 0 _= type1 && type1  */, "i8", ALLOC_NONE, 5246100);
allocate([109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,105,114,99,108,101,0] /* m_fixtureA-_GetType( */, "i8", ALLOC_NONE, 5246144);
allocate([109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,104,97,105,110,0] /* m_fixtureA-_GetType( */, "i8", ALLOC_NONE, 5246188);
allocate([48,32,60,61,32,105,71,32,38,38,32,105,71,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0] /* 0 _= iG && iG _ m_no */, "i8", ALLOC_NONE, 5246232);
allocate([109,95,116,121,112,101,32,61,61,32,98,50,95,100,121,110,97,109,105,99,66,111,100,121,0] /* m_type == b2_dynamic */, "i8", ALLOC_NONE, 5246264);
allocate([73,115,76,111,99,107,101,100,40,41,32,61,61,32,102,97,108,115,101,0] /* IsLocked() == false\ */, "i8", ALLOC_NONE, 5246292);
allocate([116,111,105,73,110,100,101,120,65,32,60,32,109,95,98,111,100,121,67,111,117,110,116,0] /* toiIndexA _ m_bodyCo */, "i8", ALLOC_NONE, 5246312);
allocate([109,95,110,111,100,101,67,111,117,110,116,32,61,61,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0] /* m_nodeCount == m_nod */, "i8", ALLOC_NONE, 5246336);
allocate([109,95,112,114,111,120,121,67,111,117,110,116,32,61,61,32,48,0] /* m_proxyCount == 0\00 */, "i8", ALLOC_NONE, 5246368);
allocate([48,32,60,61,32,105,70,32,38,38,32,105,70,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0] /* 0 _= iF && iF _ m_no */, "i8", ALLOC_NONE, 5246388);
allocate([48,32,60,61,32,105,67,32,38,38,32,105,67,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0] /* 0 _= iC && iC _ m_no */, "i8", ALLOC_NONE, 5246420);
allocate([100,101,110,32,62,32,48,46,48,102,0] /* den _ 0.0f\00 */, "i8", ALLOC_NONE, 5246452);
allocate([66,101,110,99,104,109,97,114,107,32,99,111,109,112,108,101,116,101,46,10,32,32,109,115,47,102,114,97,109,101,58,32,37,102,32,43,47,45,32,37,102,10,0] /* Benchmark complete.\ */, "i8", ALLOC_NONE, 5246464);
allocate(472, "i8", ALLOC_NONE, 5246508);
allocate([102,108,111,97,116,51,50,32,98,50,83,105,109,112,108,101,120,58,58,71,101,116,77,101,116,114,105,99,40,41,32,99,111,110,115,116,0] /* float32 b2Simplex::G */, "i8", ALLOC_NONE, 5246980);
allocate([98,50,86,101,99,50,32,98,50,83,105,109,112,108,101,120,58,58,71,101,116,83,101,97,114,99,104,68,105,114,101,99,116,105,111,110,40,41,32,99,111,110,115,116,0] /* b2Vec2 b2Simplex::Ge */, "i8", ALLOC_NONE, 5247020);
allocate([118,111,105,100,32,98,50,83,105,109,112,108,101,120,58,58,71,101,116,87,105,116,110,101,115,115,80,111,105,110,116,115,40,98,50,86,101,99,50,32,42,44,32,98,50,86,101,99,50,32,42,41,32,99,111,110,115,116,0] /* void b2Simplex::GetW */, "i8", ALLOC_NONE, 5247068);
allocate([98,50,86,101,99,50,32,98,50,83,105,109,112,108,101,120,58,58,71,101,116,67,108,111,115,101,115,116,80,111,105,110,116,40,41,32,99,111,110,115,116,0] /* b2Vec2 b2Simplex::Ge */, "i8", ALLOC_NONE, 5247128);
allocate([102,108,111,97,116,51,50,32,98,50,83,101,112,97,114,97,116,105,111,110,70,117,110,99,116,105,111,110,58,58,69,118,97,108,117,97,116,101,40,105,110,116,51,50,44,32,105,110,116,51,50,44,32,102,108,111,97,116,51,50,41,32,99,111,110,115,116,0] /* float32 b2Separation */, "i8", ALLOC_NONE, 5247172);
allocate([102,108,111,97,116,51,50,32,98,50,83,101,112,97,114,97,116,105,111,110,70,117,110,99,116,105,111,110,58,58,70,105,110,100,77,105,110,83,101,112,97,114,97,116,105,111,110,40,105,110,116,51,50,32,42,44,32,105,110,116,51,50,32,42,44,32,102,108,111,97,116,51,50,41,32,99,111,110,115,116,0] /* float32 b2Separation */, "i8", ALLOC_NONE, 5247240);
allocate([99,111,110,115,116,32,98,50,86,101,99,50,32,38,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,58,58,71,101,116,86,101,114,116,101,120,40,105,110,116,51,50,41,32,99,111,110,115,116,0] /* const b2Vec2 &b2Dist */, "i8", ALLOC_NONE, 5247324);
allocate([118,105,114,116,117,97,108,32,98,111,111,108,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,58,58,82,97,121,67,97,115,116,40,98,50,82,97,121,67,97,115,116,79,117,116,112,117,116,32,42,44,32,99,111,110,115,116,32,98,50,82,97,121,67,97,115,116,73,110,112,117,116,32,38,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,105,110,116,51,50,41,32,99,111,110,115,116,0] /* virtual bool b2Polyg */, "i8", ALLOC_NONE, 5247380);
allocate([118,105,114,116,117,97,108,32,118,111,105,100,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,58,58,67,111,109,112,117,116,101,77,97,115,115,40,98,50,77,97,115,115,68,97,116,97,32,42,44,32,102,108,111,97,116,51,50,41,32,99,111,110,115,116,0] /* virtual void b2Polyg */, "i8", ALLOC_NONE, 5247496);
allocate([118,111,105,100,32,42,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,71,101,116,85,115,101,114,68,97,116,97,40,105,110,116,51,50,41,32,99,111,110,115,116,0] /* void _b2DynamicTree: */, "i8", ALLOC_NONE, 5247568);
allocate([99,111,110,115,116,32,98,50,65,65,66,66,32,38,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,71,101,116,70,97,116,65,65,66,66,40,105,110,116,51,50,41,32,99,111,110,115,116,0] /* const b2AABB &b2Dyna */, "i8", ALLOC_NONE, 5247616);
allocate([118,111,105,100,32,98,50,67,104,97,105,110,83,104,97,112,101,58,58,71,101,116,67,104,105,108,100,69,100,103,101,40,98,50,69,100,103,101,83,104,97,112,101,32,42,44,32,105,110,116,51,50,41,32,99,111,110,115,116,0] /* void b2ChainShape::G */, "i8", ALLOC_NONE, 5247672);
allocate([118,111,105,100,32,98,50,83,105,109,112,108,101,120,58,58,82,101,97,100,67,97,99,104,101,40,99,111,110,115,116,32,98,50,83,105,109,112,108,101,120,67,97,99,104,101,32,42,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,41,0] /* void b2Simplex::Read */, "i8", ALLOC_NONE, 5247732);
allocate([118,111,105,100,32,98,50,70,105,120,116,117,114,101,58,58,68,101,115,116,114,111,121,40,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,32,42,41,0] /* void b2Fixture::Dest */, "i8", ALLOC_NONE, 5247876);
allocate([115,116,97,116,105,99,32,118,111,105,100,32,98,50,67,111,110,116,97,99,116,58,58,68,101,115,116,114,111,121,40,98,50,67,111,110,116,97,99,116,32,42,44,32,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,32,42,41,0] /* static void b2Contac */, "i8", ALLOC_NONE, 5247920);
allocate([115,116,97,116,105,99,32,98,50,67,111,110,116,97,99,116,32,42,98,50,67,111,110,116,97,99,116,58,58,67,114,101,97,116,101,40,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,44,32,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,44,32,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,32,42,41,0] /* static b2Contact _b2 */, "i8", ALLOC_NONE, 5247984);
allocate([118,111,105,100,32,98,50,73,115,108,97,110,100,58,58,83,111,108,118,101,84,79,73,40,99,111,110,115,116,32,98,50,84,105,109,101,83,116,101,112,32,38,44,32,105,110,116,51,50,44,32,105,110,116,51,50,41,0] /* void b2Island::Solve */, "i8", ALLOC_NONE, 5248080);
allocate([118,111,105,100,32,98,50,73,115,108,97,110,100,58,58,65,100,100,40,98,50,67,111,110,116,97,99,116,32,42,41,0] /* void b2Island::Add(b */, "i8", ALLOC_NONE, 5248140);
allocate([118,111,105,100,32,98,50,73,115,108,97,110,100,58,58,65,100,100,40,98,50,74,111,105,110,116,32,42,41,0] /* void b2Island::Add(b */, "i8", ALLOC_NONE, 5248172);
allocate([118,111,105,100,32,98,50,73,115,108,97,110,100,58,58,65,100,100,40,98,50,66,111,100,121,32,42,41,0] /* void b2Island::Add(b */, "i8", ALLOC_NONE, 5248204);
allocate([118,111,105,100,32,98,50,87,111,114,108,100,58,58,83,111,108,118,101,84,79,73,40,99,111,110,115,116,32,98,50,84,105,109,101,83,116,101,112,32,38,41,0] /* void b2World::SolveT */, "i8", ALLOC_NONE, 5248236);
allocate([118,111,105,100,32,98,50,87,111,114,108,100,58,58,83,111,108,118,101,40,99,111,110,115,116,32,98,50,84,105,109,101,83,116,101,112,32,38,41,0] /* void b2World::Solve( */, "i8", ALLOC_NONE, 5248280);
allocate([98,50,66,111,100,121,32,42,98,50,87,111,114,108,100,58,58,67,114,101,97,116,101,66,111,100,121,40,99,111,110,115,116,32,98,50,66,111,100,121,68,101,102,32,42,41,0] /* b2Body _b2World::Cre */, "i8", ALLOC_NONE, 5248320);
allocate([118,111,105,100,32,98,50,83,119,101,101,112,58,58,65,100,118,97,110,99,101,40,102,108,111,97,116,51,50,41,0] /* void b2Sweep::Advanc */, "i8", ALLOC_NONE, 5248368);
allocate([98,50,66,111,100,121,58,58,98,50,66,111,100,121,40,99,111,110,115,116,32,98,50,66,111,100,121,68,101,102,32,42,44,32,98,50,87,111,114,108,100,32,42,41,0] /* b2Body::b2Body(const */, "i8", ALLOC_NONE, 5248400);
allocate([118,111,105,100,32,98,50,66,111,100,121,58,58,82,101,115,101,116,77,97,115,115,68,97,116,97,40,41,0] /* void b2Body::ResetMa */, "i8", ALLOC_NONE, 5248448);
allocate([98,50,70,105,120,116,117,114,101,32,42,98,50,66,111,100,121,58,58,67,114,101,97,116,101,70,105,120,116,117,114,101,40,99,111,110,115,116,32,98,50,70,105,120,116,117,114,101,68,101,102,32,42,41,0] /* b2Fixture _b2Body::C */, "i8", ALLOC_NONE, 5248480);
allocate([98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,58,58,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0] /* b2PolygonAndCircleCo */, "i8", ALLOC_NONE, 5248536);
allocate([118,111,105,100,32,98,50,80,111,115,105,116,105,111,110,83,111,108,118,101,114,77,97,110,105,102,111,108,100,58,58,73,110,105,116,105,97,108,105,122,101,40,98,50,67,111,110,116,97,99,116,80,111,115,105,116,105,111,110,67,111,110,115,116,114,97,105,110,116,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,105,110,116,51,50,41,0] /* void b2PositionSolve */, "i8", ALLOC_NONE, 5248616);
allocate([98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,58,58,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,44,32,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,41,0] /* b2ChainAndPolygonCon */, "i8", ALLOC_NONE, 5248740);
allocate([98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,58,58,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0] /* b2EdgeAndPolygonCont */, "i8", ALLOC_NONE, 5248832);
allocate([98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,58,58,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,44,32,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,41,0] /* b2ChainAndCircleCont */, "i8", ALLOC_NONE, 5248908);
allocate([98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,58,58,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0] /* b2EdgeAndCircleConta */, "i8", ALLOC_NONE, 5249000);
allocate([102,108,111,97,116,51,50,32,98,50,83,101,112,97,114,97,116,105,111,110,70,117,110,99,116,105,111,110,58,58,73,110,105,116,105,97,108,105,122,101,40,99,111,110,115,116,32,98,50,83,105,109,112,108,101,120,67,97,99,104,101,32,42,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,32,42,44,32,99,111,110,115,116,32,98,50,83,119,101,101,112,32,38,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,32,42,44,32,99,111,110,115,116,32,98,50,83,119,101,101,112,32,38,44,32,102,108,111,97,116,51,50,41,0] /* float32 b2Separation */, "i8", ALLOC_NONE, 5249076);
allocate([98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,58,58,126,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,40,41,0] /* b2StackAllocator::~b */, "i8", ALLOC_NONE, 5249236);
allocate([118,111,105,100,32,42,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,58,58,65,108,108,111,99,97,116,101,40,105,110,116,51,50,41,0] /* void _b2StackAllocat */, "i8", ALLOC_NONE, 5249276);
allocate([118,111,105,100,32,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,58,58,70,114,101,101,40,118,111,105,100,32,42,41,0] /* void b2StackAllocato */, "i8", ALLOC_NONE, 5249316);
allocate([98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,58,58,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0] /* b2PolygonContact::b2 */, "i8", ALLOC_NONE, 5249352);
allocate([98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,58,58,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,40,41,0] /* b2BlockAllocator::b2 */, "i8", ALLOC_NONE, 5249416);
allocate([118,111,105,100,32,42,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,58,58,65,108,108,111,99,97,116,101,40,105,110,116,51,50,41,0] /* void _b2BlockAllocat */, "i8", ALLOC_NONE, 5249456);
allocate([118,111,105,100,32,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,58,58,70,114,101,101,40,118,111,105,100,32,42,44,32,105,110,116,51,50,41,0] /* void b2BlockAllocato */, "i8", ALLOC_NONE, 5249496);
allocate([118,111,105,100,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,58,58,83,101,116,40,99,111,110,115,116,32,98,50,83,104,97,112,101,32,42,44,32,105,110,116,51,50,41,0] /* void b2DistanceProxy */, "i8", ALLOC_NONE, 5249540);
allocate([98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,58,58,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,40,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,68,101,102,32,42,41,0] /* b2ContactSolver::b2C */, "i8", ALLOC_NONE, 5249592);
allocate([118,111,105,100,32,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,58,58,73,110,105,116,105,97,108,105,122,101,86,101,108,111,99,105,116,121,67,111,110,115,116,114,97,105,110,116,115,40,41,0] /* void b2ContactSolver */, "i8", ALLOC_NONE, 5249648);
allocate([118,111,105,100,32,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,58,58,83,111,108,118,101,86,101,108,111,99,105,116,121,67,111,110,115,116,114,97,105,110,116,115,40,41,0] /* void b2ContactSolver */, "i8", ALLOC_NONE, 5249704);
allocate([98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,58,58,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0] /* b2CircleContact::b2C */, "i8", ALLOC_NONE, 5249756);
allocate([98,111,111,108,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,77,111,118,101,80,114,111,120,121,40,105,110,116,51,50,44,32,99,111,110,115,116,32,98,50,65,65,66,66,32,38,44,32,99,111,110,115,116,32,98,50,86,101,99,50,32,38,41,0] /* bool b2DynamicTree:: */, "i8", ALLOC_NONE, 5249816);
allocate([118,111,105,100,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,70,114,101,101,78,111,100,101,40,105,110,116,51,50,41,0] /* void b2DynamicTree:: */, "i8", ALLOC_NONE, 5249888);
allocate([105,110,116,51,50,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,66,97,108,97,110,99,101,40,105,110,116,51,50,41,0] /* int32 b2DynamicTree: */, "i8", ALLOC_NONE, 5249924);
allocate([105,110,116,51,50,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,65,108,108,111,99,97,116,101,78,111,100,101,40,41,0] /* int32 b2DynamicTree: */, "i8", ALLOC_NONE, 5249960);
allocate([118,111,105,100,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,73,110,115,101,114,116,76,101,97,102,40,105,110,116,51,50,41,0] /* void b2DynamicTree:: */, "i8", ALLOC_NONE, 5249996);
allocate([118,111,105,100,32,98,50,70,105,110,100,73,110,99,105,100,101,110,116,69,100,103,101,40,98,50,67,108,105,112,86,101,114,116,101,120,32,42,44,32,99,111,110,115,116,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,105,110,116,51,50,44,32,99,111,110,115,116,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,41,0] /* void b2FindIncidentE */, "i8", ALLOC_NONE, 5250036);
allocate([102,108,111,97,116,51,50,32,98,50,69,100,103,101,83,101,112,97,114,97,116,105,111,110,40,99,111,110,115,116,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,105,110,116,51,50,44,32,99,111,110,115,116,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,41,0] /* float32 b2EdgeSepara */, "i8", ALLOC_NONE, 5250176);
allocate([118,111,105,100,32,98,50,67,111,108,108,105,100,101,69,100,103,101,65,110,100,67,105,114,99,108,101,40,98,50,77,97,110,105,102,111,108,100,32,42,44,32,99,111,110,115,116,32,98,50,69,100,103,101,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,99,111,110,115,116,32,98,50,67,105,114,99,108,101,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,41,0] /* void b2CollideEdgeAn */, "i8", ALLOC_NONE, 5250300);
allocate([118,111,105,100,32,98,50,84,105,109,101,79,102,73,109,112,97,99,116,40,98,50,84,79,73,79,117,116,112,117,116,32,42,44,32,99,111,110,115,116,32,98,50,84,79,73,73,110,112,117,116,32,42,41,0] /* void b2TimeOfImpact( */, "i8", ALLOC_NONE, 5250428);
allocate([118,111,105,100,32,98,50,68,105,115,116,97,110,99,101,40,98,50,68,105,115,116,97,110,99,101,79,117,116,112,117,116,32,42,44,32,98,50,83,105,109,112,108,101,120,67,97,99,104,101,32,42,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,73,110,112,117,116,32,42,41,0] /* void b2Distance(b2Di */, "i8", ALLOC_NONE, 5250484);
__ZTVN10__cxxabiv120__si_class_type_infoE=allocate([0,0,0,0,248,32,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
allocate(1, "i8", ALLOC_STATIC);
__ZTVN10__cxxabiv117__class_type_infoE=allocate([0,0,0,0,4,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
allocate(1, "i8", ALLOC_STATIC);
allocate([0,0,0,0,28,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250564);
allocate(1, "i8", ALLOC_NONE, 5250584);
allocate([0,0,0,0,44,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250588);
allocate(1, "i8", ALLOC_NONE, 5250608);
allocate([0,0,0,0,56,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250612);
allocate(1, "i8", ALLOC_NONE, 5250632);
allocate([0,0,0,0,68,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250636);
allocate(1, "i8", ALLOC_NONE, 5250656);
allocate([0,0,0,0,80,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250660);
allocate(1, "i8", ALLOC_NONE, 5250680);
allocate([0,0,0,0,92,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250684);
allocate(1, "i8", ALLOC_NONE, 5250704);
allocate([0,0,0,0,104,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250708);
allocate(1, "i8", ALLOC_NONE, 5250740);
allocate([0,0,0,0,112,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250744);
allocate(1, "i8", ALLOC_NONE, 5250764);
allocate([0,0,0,0,124,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250768);
allocate(1, "i8", ALLOC_NONE, 5250788);
allocate([0,0,0,0,132,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250792);
allocate(1, "i8", ALLOC_NONE, 5250812);
allocate([0,0,0,0,144,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250816);
allocate(1, "i8", ALLOC_NONE, 5250856);
allocate([0,0,0,0,156,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, 5250860);
allocate(1, "i8", ALLOC_NONE, 5250900);
allocate([83,116,57,116,121,112,101,95,105,110,102,111,0] /* St9type_info\00 */, "i8", ALLOC_NONE, 5250904);
allocate([78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0] /* N10__cxxabiv120__si_ */, "i8", ALLOC_NONE, 5250920);
allocate([78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0] /* N10__cxxabiv117__cla */, "i8", ALLOC_NONE, 5250960);
allocate([78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0] /* N10__cxxabiv116__shi */, "i8", ALLOC_NONE, 5250996);
allocate([57,98,50,67,111,110,116,97,99,116,0] /* 9b2Contact\00 */, "i8", ALLOC_NONE, 5251032);
allocate([55,98,50,83,104,97,112,101,0] /* 7b2Shape\00 */, "i8", ALLOC_NONE, 5251044);
allocate([50,53,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0] /* 25b2PolygonAndCircle */, "i8", ALLOC_NONE, 5251056);
allocate([50,52,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0] /* 24b2ChainAndPolygonC */, "i8", ALLOC_NONE, 5251084);
allocate([50,51,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0] /* 23b2EdgeAndPolygonCo */, "i8", ALLOC_NONE, 5251112);
allocate([50,51,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0] /* 23b2ChainAndCircleCo */, "i8", ALLOC_NONE, 5251140);
allocate([50,50,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0] /* 22b2EdgeAndCircleCon */, "i8", ALLOC_NONE, 5251168);
allocate([49,55,98,50,67,111,110,116,97,99,116,76,105,115,116,101,110,101,114,0] /* 17b2ContactListener\ */, "i8", ALLOC_NONE, 5251196);
allocate([49,54,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0] /* 16b2PolygonContact\0 */, "i8", ALLOC_NONE, 5251216);
allocate([49,53,98,50,67,111,110,116,97,99,116,70,105,108,116,101,114,0] /* 15b2ContactFilter\00 */, "i8", ALLOC_NONE, 5251236);
allocate([49,53,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,0] /* 15b2CircleContact\00 */, "i8", ALLOC_NONE, 5251256);
allocate([49,52,98,50,80,111,108,121,103,111,110,83,104,97,112,101,0] /* 14b2PolygonShape\00 */, "i8", ALLOC_NONE, 5251276);
allocate([49,49,98,50,69,100,103,101,83,104,97,112,101,0] /* 11b2EdgeShape\00 */, "i8", ALLOC_NONE, 5251296);
allocate(8, "i8", ALLOC_NONE, 5251312);
allocate([0,0,0,0,0,0,0,0,4,33,80,0], "i8", ALLOC_NONE, 5251320);
allocate([0,0,0,0,0,0,0,0,16,33,80,0], "i8", ALLOC_NONE, 5251332);
allocate([0,0,0,0,0,0,0,0,240,32,80,0], "i8", ALLOC_NONE, 5251344);
allocate(8, "i8", ALLOC_NONE, 5251356);
allocate(8, "i8", ALLOC_NONE, 5251364);
allocate([0,0,0,0,0,0,0,0,28,33,80,0], "i8", ALLOC_NONE, 5251372);
allocate([0,0,0,0,0,0,0,0,28,33,80,0], "i8", ALLOC_NONE, 5251384);
allocate([0,0,0,0,0,0,0,0,28,33,80,0], "i8", ALLOC_NONE, 5251396);
allocate([0,0,0,0,0,0,0,0,28,33,80,0], "i8", ALLOC_NONE, 5251408);
allocate([0,0,0,0,0,0,0,0,28,33,80,0], "i8", ALLOC_NONE, 5251420);
allocate(8, "i8", ALLOC_NONE, 5251432);
allocate([0,0,0,0,0,0,0,0,28,33,80,0], "i8", ALLOC_NONE, 5251440);
allocate(8, "i8", ALLOC_NONE, 5251452);
allocate([0,0,0,0,0,0,0,0,28,33,80,0], "i8", ALLOC_NONE, 5251460);
allocate([0,0,0,0,0,0,0,0,36,33,80,0], "i8", ALLOC_NONE, 5251472);
allocate([0,0,0,0,0,0,0,0,36,33,80,0], "i8", ALLOC_NONE, 5251484);
allocate(4, "i8", ALLOC_NONE, 5251496);
allocate(192, "i8", ALLOC_NONE, 5251500);
allocate(4, "i8", ALLOC_NONE, 5251692);
allocate(641, "i8", ALLOC_NONE, 5251696);
allocate([16,0,0,0,32,0,0,0,64,0,0,0,96,0,0,0,128,0,0,0,160,0,0,0,192,0,0,0,224,0,0,0,0,1,0,0,64,1,0,0,128,1,0,0,192,1,0,0,0,2,0,0,128,2,0,0], "i8", ALLOC_NONE, 5252340);
HEAP32[((5242936)>>2)]=(((5250716)|0));
HEAP32[((5242940)>>2)]=(((5250776)|0));
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(8))>>2)]=(142);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(12))>>2)]=(68);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(16))>>2)]=(98);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(20))>>2)]=(140);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(24))>>2)]=(76);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(28))>>2)]=(78);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(32))>>2)]=(144);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(36))>>2)]=(92);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(8))>>2)]=(10);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(12))>>2)]=(32);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(16))>>2)]=(98);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(20))>>2)]=(140);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(24))>>2)]=(76);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(28))>>2)]=(12);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(32))>>2)]=(80);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(36))>>2)]=(44);
HEAP32[((5250572)>>2)]=(112);
HEAP32[((5250576)>>2)]=(118);
HEAP32[((5250580)>>2)]=(46);
HEAP32[((5250596)>>2)]=(148);
HEAP32[((5250600)>>2)]=(70);
HEAP32[((5250604)>>2)]=(38);
HEAP32[((5250620)>>2)]=(108);
HEAP32[((5250624)>>2)]=(26);
HEAP32[((5250628)>>2)]=(6);
HEAP32[((5250644)>>2)]=(22);
HEAP32[((5250648)>>2)]=(2);
HEAP32[((5250652)>>2)]=(16);
HEAP32[((5250668)>>2)]=(154);
HEAP32[((5250672)>>2)]=(152);
HEAP32[((5250676)>>2)]=(150);
HEAP32[((5250692)>>2)]=(96);
HEAP32[((5250696)>>2)]=(20);
HEAP32[((5250700)>>2)]=(24);
HEAP32[((5250716)>>2)]=(56);
HEAP32[((5250720)>>2)]=(72);
HEAP32[((5250724)>>2)]=(116);
HEAP32[((5250728)>>2)]=(88);
HEAP32[((5250732)>>2)]=(146);
HEAP32[((5250736)>>2)]=(30);
HEAP32[((5250752)>>2)]=(58);
HEAP32[((5250756)>>2)]=(128);
HEAP32[((5250760)>>2)]=(64);
HEAP32[((5250776)>>2)]=(136);
HEAP32[((5250780)>>2)]=(18);
HEAP32[((5250784)>>2)]=(90);
HEAP32[((5250800)>>2)]=(14);
HEAP32[((5250804)>>2)]=(100);
HEAP32[((5250808)>>2)]=(62);
HEAP32[((5250824)>>2)]=(54);
HEAP32[((5250828)>>2)]=(122);
HEAP32[((5250832)>>2)]=(82);
HEAP32[((5250836)>>2)]=(48);
HEAP32[((5250840)>>2)]=(4);
HEAP32[((5250844)>>2)]=(84);
HEAP32[((5250848)>>2)]=(50);
HEAP32[((5250852)>>2)]=(106);
HEAP32[((5250868)>>2)]=(120);
HEAP32[((5250872)>>2)]=(110);
HEAP32[((5250876)>>2)]=(52);
HEAP32[((5250880)>>2)]=(40);
HEAP32[((5250884)>>2)]=(66);
HEAP32[((5250888)>>2)]=(74);
HEAP32[((5250892)>>2)]=(36);
HEAP32[((5250896)>>2)]=(42);
HEAP32[((5251312)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251316)>>2)]=((5250904)|0);
HEAP32[((5251320)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251324)>>2)]=((5250920)|0);
HEAP32[((5251332)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251336)>>2)]=((5250960)|0);
HEAP32[((5251344)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251348)>>2)]=((5250996)|0);
HEAP32[((5251356)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251360)>>2)]=((5251032)|0);
HEAP32[((5251364)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251368)>>2)]=((5251044)|0);
HEAP32[((5251372)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251376)>>2)]=((5251056)|0);
HEAP32[((5251384)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251388)>>2)]=((5251084)|0);
HEAP32[((5251396)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251400)>>2)]=((5251112)|0);
HEAP32[((5251408)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251412)>>2)]=((5251140)|0);
HEAP32[((5251420)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251424)>>2)]=((5251168)|0);
HEAP32[((5251432)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251436)>>2)]=((5251196)|0);
HEAP32[((5251440)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251444)>>2)]=((5251216)|0);
HEAP32[((5251452)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251456)>>2)]=((5251236)|0);
HEAP32[((5251460)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251464)>>2)]=((5251256)|0);
HEAP32[((5251472)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251476)>>2)]=((5251276)|0);
HEAP32[((5251484)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251488)>>2)]=((5251296)|0);
  var ERRNO_CODES={E2BIG:7,EACCES:13,EADDRINUSE:98,EADDRNOTAVAIL:99,EAFNOSUPPORT:97,EAGAIN:11,EALREADY:114,EBADF:9,EBADMSG:74,EBUSY:16,ECANCELED:125,ECHILD:10,ECONNABORTED:103,ECONNREFUSED:111,ECONNRESET:104,EDEADLK:35,EDESTADDRREQ:89,EDOM:33,EDQUOT:122,EEXIST:17,EFAULT:14,EFBIG:27,EHOSTUNREACH:113,EIDRM:43,EILSEQ:84,EINPROGRESS:115,EINTR:4,EINVAL:22,EIO:5,EISCONN:106,EISDIR:21,ELOOP:40,EMFILE:24,EMLINK:31,EMSGSIZE:90,EMULTIHOP:72,ENAMETOOLONG:36,ENETDOWN:100,ENETRESET:102,ENETUNREACH:101,ENFILE:23,ENOBUFS:105,ENODATA:61,ENODEV:19,ENOENT:2,ENOEXEC:8,ENOLCK:37,ENOLINK:67,ENOMEM:12,ENOMSG:42,ENOPROTOOPT:92,ENOSPC:28,ENOSR:63,ENOSTR:60,ENOSYS:38,ENOTCONN:107,ENOTDIR:20,ENOTEMPTY:39,ENOTRECOVERABLE:131,ENOTSOCK:88,ENOTSUP:95,ENOTTY:25,ENXIO:6,EOVERFLOW:75,EOWNERDEAD:130,EPERM:1,EPIPE:32,EPROTO:71,EPROTONOSUPPORT:93,EPROTOTYPE:91,ERANGE:34,EROFS:30,ESPIPE:29,ESRCH:3,ESTALE:116,ETIME:62,ETIMEDOUT:110,ETXTBSY:26,EWOULDBLOCK:11,EXDEV:18};
  function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      if (!___setErrNo.ret) ___setErrNo.ret = allocate([0], 'i32', ALLOC_STATIC);
      HEAP32[((___setErrNo.ret)>>2)]=value
      return value;
    }
  var _stdin=allocate(1, "i32*", ALLOC_STACK);
  var _stdout=allocate(1, "i32*", ALLOC_STACK);
  var _stderr=allocate(1, "i32*", ALLOC_STACK);
  var __impure_ptr=allocate(1, "i32*", ALLOC_STACK);var FS={currentPath:"/",nextInode:2,streams:[null],ignorePermissions:true,joinPath:function (parts, forceRelative) {
        var ret = parts[0];
        for (var i = 1; i < parts.length; i++) {
          if (ret[ret.length-1] != '/') ret += '/';
          ret += parts[i];
        }
        if (forceRelative && ret[0] == '/') ret = ret.substr(1);
        return ret;
      },absolutePath:function (relative, base) {
        if (typeof relative !== 'string') return null;
        if (base === undefined) base = FS.currentPath;
        if (relative && relative[0] == '/') base = '';
        var full = base + '/' + relative;
        var parts = full.split('/').reverse();
        var absolute = [''];
        while (parts.length) {
          var part = parts.pop();
          if (part == '' || part == '.') {
            // Nothing.
          } else if (part == '..') {
            if (absolute.length > 1) absolute.pop();
          } else {
            absolute.push(part);
          }
        }
        return absolute.length == 1 ? '/' : absolute.join('/');
      },analyzePath:function (path, dontResolveLastLink, linksVisited) {
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        };
        path = FS.absolutePath(path);
        if (path == '/') {
          ret.isRoot = true;
          ret.exists = ret.parentExists = true;
          ret.name = '/';
          ret.path = ret.parentPath = '/';
          ret.object = ret.parentObject = FS.root;
        } else if (path !== null) {
          linksVisited = linksVisited || 0;
          path = path.slice(1).split('/');
          var current = FS.root;
          var traversed = [''];
          while (path.length) {
            if (path.length == 1 && current.isFolder) {
              ret.parentExists = true;
              ret.parentPath = traversed.length == 1 ? '/' : traversed.join('/');
              ret.parentObject = current;
              ret.name = path[0];
            }
            var target = path.shift();
            if (!current.isFolder) {
              ret.error = ERRNO_CODES.ENOTDIR;
              break;
            } else if (!current.read) {
              ret.error = ERRNO_CODES.EACCES;
              break;
            } else if (!current.contents.hasOwnProperty(target)) {
              ret.error = ERRNO_CODES.ENOENT;
              break;
            }
            current = current.contents[target];
            if (current.link && !(dontResolveLastLink && path.length == 0)) {
              if (linksVisited > 40) { // Usual Linux SYMLOOP_MAX.
                ret.error = ERRNO_CODES.ELOOP;
                break;
              }
              var link = FS.absolutePath(current.link, traversed.join('/'));
              ret = FS.analyzePath([link].concat(path).join('/'),
                                   dontResolveLastLink, linksVisited + 1);
              return ret;
            }
            traversed.push(target);
            if (path.length == 0) {
              ret.exists = true;
              ret.path = traversed.join('/');
              ret.object = current;
            }
          }
        }
        return ret;
      },findObject:function (path, dontResolveLastLink) {
        FS.ensureRoot();
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },createObject:function (parent, name, properties, canRead, canWrite) {
        if (!parent) parent = '/';
        if (typeof parent === 'string') parent = FS.findObject(parent);
        if (!parent) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent path must exist.');
        }
        if (!parent.isFolder) {
          ___setErrNo(ERRNO_CODES.ENOTDIR);
          throw new Error('Parent must be a folder.');
        }
        if (!parent.write && !FS.ignorePermissions) {
          ___setErrNo(ERRNO_CODES.EACCES);
          throw new Error('Parent folder must be writeable.');
        }
        if (!name || name == '.' || name == '..') {
          ___setErrNo(ERRNO_CODES.ENOENT);
          throw new Error('Name must not be empty.');
        }
        if (parent.contents.hasOwnProperty(name)) {
          ___setErrNo(ERRNO_CODES.EEXIST);
          throw new Error("Can't overwrite object.");
        }
        parent.contents[name] = {
          read: canRead === undefined ? true : canRead,
          write: canWrite === undefined ? false : canWrite,
          timestamp: Date.now(),
          inodeNumber: FS.nextInode++
        };
        for (var key in properties) {
          if (properties.hasOwnProperty(key)) {
            parent.contents[name][key] = properties[key];
          }
        }
        return parent.contents[name];
      },createFolder:function (parent, name, canRead, canWrite) {
        var properties = {isFolder: true, isDevice: false, contents: {}};
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createPath:function (parent, path, canRead, canWrite) {
        var current = FS.findObject(parent);
        if (current === null) throw new Error('Invalid parent.');
        path = path.split('/').reverse();
        while (path.length) {
          var part = path.pop();
          if (!part) continue;
          if (!current.contents.hasOwnProperty(part)) {
            FS.createFolder(current, part, canRead, canWrite);
          }
          current = current.contents[part];
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        properties.isFolder = false;
        return FS.createObject(parent, name, properties, canRead, canWrite);
      },createDataFile:function (parent, name, data, canRead, canWrite) {
        if (typeof data === 'string') {
          var dataArray = new Array(data.length);
          for (var i = 0, len = data.length; i < len; ++i) dataArray[i] = data.charCodeAt(i);
          data = dataArray;
        }
        var properties = {
          isDevice: false,
          contents: data.subarray ? data.subarray(0) : data // as an optimization, create a new array wrapper (not buffer) here, to help JS engines understand this object
        };
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          var LazyUint8Array = function(chunkSize, length) {
            this.length = length;
            this.chunkSize = chunkSize;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % chunkSize;
            var chunkNum = Math.floor(idx / chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function(getter) {
            this.getter = getter;
          }
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var chunkSize = 1024*1024; // Chunk size in bytes
          if (!hasByteServing) chunkSize = datalength;
          // Function to get a range from the remote URL.
          var doXHR = (function(from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
            // Some hints to the browser that we want binary data.
            if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || '', true);
            }
          });
          var lazyArray = new LazyUint8Array(chunkSize, datalength);
          lazyArray.setDataGetter(function(chunkNum) {
            var start = chunkNum * lazyArray.chunkSize;
            var end = (chunkNum+1) * lazyArray.chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile) {
        Browser.init();
        var fullname = FS.joinPath([parent, name], true);
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },createLink:function (parent, name, target, canRead, canWrite) {
        var properties = {isDevice: false, link: target};
        return FS.createFile(parent, name, properties, canRead, canWrite);
      },createDevice:function (parent, name, input, output) {
        if (!(input || output)) {
          throw new Error('A device must have at least one callback defined.');
        }
        var ops = {isDevice: true, input: input, output: output};
        return FS.createFile(parent, name, ops, Boolean(input), Boolean(output));
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },ensureRoot:function () {
        if (FS.root) return;
        // The main file system tree. All the contents are inside this.
        FS.root = {
          read: true,
          write: true,
          isFolder: true,
          isDevice: false,
          timestamp: Date.now(),
          inodeNumber: 1,
          contents: {}
        };
      },init:function (input, output, error) {
        // Make sure we initialize only once.
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        FS.ensureRoot();
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        input = input || Module['stdin'];
        output = output || Module['stdout'];
        error = error || Module['stderr'];
        // Default handlers.
        var stdinOverridden = true, stdoutOverridden = true, stderrOverridden = true;
        if (!input) {
          stdinOverridden = false;
          input = function() {
            if (!input.cache || !input.cache.length) {
              var result;
              if (typeof window != 'undefined' &&
                  typeof window.prompt == 'function') {
                // Browser.
                result = window.prompt('Input: ');
                if (result === null) result = String.fromCharCode(0); // cancel ==> EOF
              } else if (typeof readline == 'function') {
                // Command line.
                result = readline();
              }
              if (!result) result = '';
              input.cache = intArrayFromString(result + '\n', true);
            }
            return input.cache.shift();
          };
        }
        var utf8 = new Runtime.UTF8Processor();
        function simpleOutput(val) {
          if (val === null || val === 10) {
            output.printer(output.buffer.join(''));
            output.buffer = [];
          } else {
            output.buffer.push(utf8.processCChar(val));
          }
        }
        if (!output) {
          stdoutOverridden = false;
          output = simpleOutput;
        }
        if (!output.printer) output.printer = Module['print'];
        if (!output.buffer) output.buffer = [];
        if (!error) {
          stderrOverridden = false;
          error = simpleOutput;
        }
        if (!error.printer) error.printer = Module['print'];
        if (!error.buffer) error.buffer = [];
        // Create the temporary folder, if not already created
        try {
          FS.createFolder('/', 'tmp', true, true);
        } catch(e) {}
        // Create the I/O devices.
        var devFolder = FS.createFolder('/', 'dev', true, true);
        var stdin = FS.createDevice(devFolder, 'stdin', input);
        var stdout = FS.createDevice(devFolder, 'stdout', null, output);
        var stderr = FS.createDevice(devFolder, 'stderr', null, error);
        FS.createDevice(devFolder, 'tty', input, output);
        // Create default streams.
        FS.streams[1] = {
          path: '/dev/stdin',
          object: stdin,
          position: 0,
          isRead: true,
          isWrite: false,
          isAppend: false,
          isTerminal: !stdinOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[2] = {
          path: '/dev/stdout',
          object: stdout,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          isTerminal: !stdoutOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        FS.streams[3] = {
          path: '/dev/stderr',
          object: stderr,
          position: 0,
          isRead: false,
          isWrite: true,
          isAppend: false,
          isTerminal: !stderrOverridden,
          error: false,
          eof: false,
          ungotten: []
        };
        assert(Math.max(_stdin, _stdout, _stderr) < 128); // make sure these are low, we flatten arrays with these
        HEAP32[((_stdin)>>2)]=1;
        HEAP32[((_stdout)>>2)]=2;
        HEAP32[((_stderr)>>2)]=3;
        // Other system paths
        FS.createPath('/', 'dev/shm/tmp', true, true); // temp files
        // Newlib initialization
        for (var i = FS.streams.length; i < Math.max(_stdin, _stdout, _stderr) + 4; i++) {
          FS.streams[i] = null; // Make sure to keep FS.streams dense
        }
        FS.streams[_stdin] = FS.streams[1];
        FS.streams[_stdout] = FS.streams[2];
        FS.streams[_stderr] = FS.streams[3];
        allocate([ allocate(
          [0, 0, 0, 0, _stdin, 0, 0, 0, _stdout, 0, 0, 0, _stderr, 0, 0, 0],
          'void*', ALLOC_STATIC) ], 'void*', ALLOC_NONE, __impure_ptr);
      },quit:function () {
        if (!FS.init.initialized) return;
        // Flush any partially-printed lines in stdout and stderr. Careful, they may have been closed
        if (FS.streams[2] && FS.streams[2].object.output.buffer.length > 0) FS.streams[2].object.output(10);
        if (FS.streams[3] && FS.streams[3].object.output.buffer.length > 0) FS.streams[3].object.output(10);
      },standardizePath:function (path) {
        if (path.substr(0, 2) == './') path = path.substr(2);
        return path;
      },deleteFile:function (path) {
        path = FS.analyzePath(path);
        if (!path.parentExists || !path.exists) {
          throw 'Invalid path ' + path;
        }
        delete path.parentObject.contents[path.name];
      }};
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream || stream.object.isDevice) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (stream.object.isFolder) {
        ___setErrNo(ERRNO_CODES.EISDIR);
        return -1;
      } else if (nbyte < 0 || offset < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        var contents = stream.object.contents;
        while (contents.length < offset) contents.push(0);
        for (var i = 0; i < nbyte; i++) {
          contents[offset + i] = HEAPU8[(((buf)+(i))|0)];
        }
        stream.object.timestamp = Date.now();
        return i;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.streams[fildes];
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      } else if (!stream.isWrite) {
        ___setErrNo(ERRNO_CODES.EACCES);
        return -1;
      } else if (nbyte < 0) {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      } else {
        if (stream.object.isDevice) {
          if (stream.object.output) {
            for (var i = 0; i < nbyte; i++) {
              try {
                stream.object.output(HEAP8[(((buf)+(i))|0)]);
              } catch (e) {
                ___setErrNo(ERRNO_CODES.EIO);
                return -1;
              }
            }
            stream.object.timestamp = Date.now();
            return i;
          } else {
            ___setErrNo(ERRNO_CODES.ENXIO);
            return -1;
          }
        } else {
          var bytesWritten = _pwrite(fildes, buf, nbyte, stream.position);
          if (bytesWritten != -1) stream.position += bytesWritten;
          return bytesWritten;
        }
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        if (FS.streams[stream]) FS.streams[stream].error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  Module["_strlen"] = _strlen;
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = (HEAP32[((tempDoublePtr)>>2)]=HEAP32[(((varargs)+(argIndex))>>2)],HEAP32[(((tempDoublePtr)+(4))>>2)]=HEAP32[(((varargs)+((argIndex)+(4)))>>2)],(+(HEAPF64[(tempDoublePtr)>>3])));
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+4))>>2)]];
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Runtime.getNativeFieldSize(type);
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false;
          if (next == 46) {
            var precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          } else {
            var precision = 6; // Standard default.
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = flagAlternative ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (flagAlwaysSigned) {
                if (currArg < 0) {
                  prefix = '-' + prefix;
                } else {
                  prefix = '+' + prefix;
                }
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (flagAlwaysSigned && currArg >= 0) {
                  argText = '+' + argText;
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*') || nullString;
              var argLength = _strlen(arg);
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              for (var i = 0; i < argLength; i++) {
                ret.push(HEAPU8[((arg++)|0)]);
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }
  function ___gxx_personality_v0() {
    }
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      function ExitStatus() {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + status + ")";
        this.status = status;
        Module.print('Exit Status: ' + status);
      };
      ExitStatus.prototype = new Error();
      ExitStatus.prototype.constructor = ExitStatus;
      exitRuntime();
      ABORT = true;
      throw new ExitStatus();
    }function _exit(status) {
      __exit(status);
    }function __ZSt9terminatev() {
      _exit(-1234);
    }
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  function _clock() {
      if (_clock.start === undefined) _clock.start = Date.now();
      return Math.floor((Date.now() - _clock.start) * (1000/1000));
    }
  function ___cxa_pure_virtual() {
      ABORT = true;
      throw 'Pure virtual function called!';
    }
  var _sqrtf=Math.sqrt;
  function ___assert_func(filename, line, func, condition) {
      throw 'Assertion failed: ' + (condition ? Pointer_stringify(condition) : 'unknown condition') + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + new Error().stack;
    }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i32=_memset;
  var _sinf=Math.sin;
  var _cosf=Math.cos;
  var _floorf=Math.floor;
  var _llvm_memset_p0i8_i64=_memset;
  function _abort() {
      ABORT = true;
      throw 'abort() at ' + (new Error().stack);
    }
  function ___errno_location() {
      return ___setErrNo.ret;
    }var ___errno=___errno_location;
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 8: return PAGE_SIZE;
        case 54:
        case 56:
        case 21:
        case 61:
        case 63:
        case 22:
        case 67:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 69:
        case 28:
        case 101:
        case 70:
        case 71:
        case 29:
        case 30:
        case 199:
        case 75:
        case 76:
        case 32:
        case 43:
        case 44:
        case 80:
        case 46:
        case 47:
        case 45:
        case 48:
        case 49:
        case 42:
        case 82:
        case 33:
        case 7:
        case 108:
        case 109:
        case 107:
        case 112:
        case 119:
        case 121:
          return 200809;
        case 13:
        case 104:
        case 94:
        case 95:
        case 34:
        case 35:
        case 77:
        case 81:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
        case 91:
        case 94:
        case 95:
        case 110:
        case 111:
        case 113:
        case 114:
        case 115:
        case 116:
        case 117:
        case 118:
        case 120:
        case 40:
        case 16:
        case 79:
        case 19:
          return -1;
        case 92:
        case 93:
        case 5:
        case 72:
        case 6:
        case 74:
        case 92:
        case 93:
        case 96:
        case 97:
        case 98:
        case 99:
        case 102:
        case 103:
        case 105:
          return 1;
        case 38:
        case 66:
        case 50:
        case 51:
        case 4:
          return 1024;
        case 15:
        case 64:
        case 41:
          return 32;
        case 55:
        case 37:
        case 17:
          return 2147483647;
        case 18:
        case 1:
          return 47839;
        case 59:
        case 57:
          return 99;
        case 68:
        case 58:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 14: return 32768;
        case 73: return 32767;
        case 39: return 16384;
        case 60: return 1000;
        case 106: return 700;
        case 52: return 256;
        case 62: return 255;
        case 2: return 100;
        case 65: return 64;
        case 36: return 20;
        case 100: return 16;
        case 20: return 6;
        case 53: return 4;
        case 10: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We need to make sure no one else allocates unfreeable memory!
      // We must control this entirely. So we don't even need to do
      // unfreeable allocations - the HEAP is ours, from STATICTOP up.
      // TODO: We could in theory slice off the top of the HEAP when
      //       sbrk gets a negative increment in |bytes|...
      var self = _sbrk;
      if (!self.called) {
        STATICTOP = alignMemoryPage(STATICTOP); // make sure we start out aligned
        self.called = true;
        _sbrk.DYNAMIC_START = STATICTOP;
      }
      var ret = STATICTOP;
      if (bytes != 0) Runtime.staticAlloc(bytes);
      return ret;  // Previous break location.
    }
  function _llvm_lifetime_start() {}
  function _llvm_lifetime_end() {}
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (Browser.initted) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : console.log("warning: cannot create object URLs");
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        function getMimetype(name) {
          return {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'ogg': 'audio/ogg',
            'wav': 'audio/wav',
            'mp3': 'audio/mpeg'
          }[name.substr(-3)];
          return ret;
        }
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
        var imagePlugin = {};
        imagePlugin['canHandle'] = function(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/.exec(name);
        };
        imagePlugin['handle'] = function(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            setTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'];
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule) {
        var ctx;
        try {
          if (useWebGL) {
            ctx = canvas.getContext('experimental-webgl', {
              alpha: false
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        this.lockPointer = lockPointer;
        this.resizeCanvas = resizeCanvas;
        if (typeof this.lockPointer === 'undefined') this.lockPointer = true;
        if (typeof this.resizeCanvas === 'undefined') this.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!this.fullScreenHandlersInstalled) {
          this.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen(); 
      },requestAnimationFrame:function (func) {
        if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                         window['mozRequestAnimationFrame'] ||
                                         window['webkitRequestAnimationFrame'] ||
                                         window['msRequestAnimationFrame'] ||
                                         window['oRequestAnimationFrame'] ||
                                         window['setTimeout'];
        }
        window.requestAnimationFrame(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          if (xhr.status == 200) {
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        Browser.updateResizeListeners();
      }};
__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___setErrNo(0);
Module["requestFullScreen"] = function(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function(func) { Browser.requestAnimationFrame(func) };
  Module["pauseMainLoop"] = function() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function() { Browser.mainLoop.resume() };
var Math_min = Math.min;
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.__ZTVN10__cxxabiv120__si_class_type_infoE|0;var n=env.__ZTVN10__cxxabiv117__class_type_infoE|0;var o=+env.NaN;var p=+env.Infinity;var q=0;var r=0;var s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,z=0,A=0.0;var B=0;var C=0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=global.Math.floor;var M=global.Math.abs;var N=global.Math.sqrt;var O=global.Math.pow;var P=global.Math.cos;var Q=global.Math.sin;var R=global.Math.tan;var S=global.Math.acos;var T=global.Math.asin;var U=global.Math.atan;var V=global.Math.atan2;var W=global.Math.exp;var X=global.Math.log;var Y=global.Math.ceil;var Z=global.Math.imul;var _=env.abort;var $=env.assert;var aa=env.asmPrintInt;var ab=env.asmPrintFloat;var ac=env.copyTempDouble;var ad=env.copyTempFloat;var ae=env.min;var af=env._llvm_lifetime_end;var ag=env._cosf;var ah=env._floorf;var ai=env._abort;var aj=env._fprintf;var ak=env._printf;var al=env.__reallyNegative;var am=env._sqrtf;var an=env._sysconf;var ao=env._clock;var ap=env.___setErrNo;var aq=env._fwrite;var ar=env._write;var as=env._exit;var at=env.___cxa_pure_virtual;var au=env.__formatString;var av=env.__ZSt9terminatev;var aw=env._sinf;var ax=env.___assert_func;var ay=env._pwrite;var az=env._sbrk;var aA=env.___errno_location;var aB=env.___gxx_personality_v0;var aC=env._llvm_lifetime_start;var aD=env._time;var aE=env.__exit;
// EMSCRIPTEN_START_FUNCS
function aR(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+3>>2<<2;return b|0}function aS(){return i|0}function aT(a){a=a|0;i=a}function aU(a){a=a|0;q=a}function aV(a){a=a|0;B=a}function aW(a){a=a|0;C=a}function aX(a){a=a|0;D=a}function aY(a){a=a|0;E=a}function aZ(a){a=a|0;F=a}function a_(a){a=a|0;G=a}function a$(a){a=a|0;H=a}function a0(a){a=a|0;I=a}function a1(a){a=a|0;J=a}function a2(a){a=a|0;K=a}function a3(a){a=a|0;return}function a4(a){a=a|0;return}function a5(a,b){a=a|0;b=b|0;var d=0.0;b=i;i=i+8|0;a=b|0;a9(a);d=+g[a+4>>2];ak(5246464,(s=i,i=i+16|0,h[k>>3]=+g[a>>2],c[s>>2]=c[k>>2]|0,c[s+4>>2]=c[k+4>>2]|0,h[k>>3]=d,c[s+8>>2]=c[k>>2]|0,c[s+12>>2]=c[k+4>>2]|0,s)|0);i=b;return 0}function a6(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;c[a>>2]=-1;b=a+12|0;c[b>>2]=16;c[a+8>>2]=0;d=dc(576)|0;e=a+4|0;c[e>>2]=d;di(d|0,0,(c[b>>2]|0)*36&-1|0);d=(c[b>>2]|0)-1|0;L4:do{if((d|0)>0){f=0;while(1){g=f+1|0;c[(c[e>>2]|0)+(f*36&-1)+20>>2]=g;c[(c[e>>2]|0)+(f*36&-1)+32>>2]=-1;h=(c[b>>2]|0)-1|0;if((g|0)<(h|0)){f=g}else{i=h;break L4}}}else{i=d}}while(0);c[(c[e>>2]|0)+(i*36&-1)+20>>2]=-1;c[(c[e>>2]|0)+(((c[b>>2]|0)-1|0)*36&-1)+32>>2]=-1;b=a+16|0;c[b>>2]=0;c[b+4>>2]=0;c[b+8>>2]=0;c[b+12>>2]=0;c[a+48>>2]=16;c[a+52>>2]=0;c[a+44>>2]=dc(192)|0;c[a+36>>2]=16;c[a+40>>2]=0;c[a+32>>2]=dc(64)|0;return}function a7(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,i=0.0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=a|0;f=bm(e)|0;h=a+4|0;i=+g[b+4>>2]+-.10000000149011612;j=(c[h>>2]|0)+(f*36&-1)|0;l=(g[k>>2]=+g[b>>2]+-.10000000149011612,c[k>>2]|0);m=(g[k>>2]=i,c[k>>2]|0)|0;c[j>>2]=0|l;c[j+4>>2]=m;i=+g[b+12>>2]+.10000000149011612;m=(c[h>>2]|0)+(f*36&-1)+8|0;j=(g[k>>2]=+g[b+8>>2]+.10000000149011612,c[k>>2]|0);b=(g[k>>2]=i,c[k>>2]|0)|0;c[m>>2]=0|j;c[m+4>>2]=b;c[(c[h>>2]|0)+(f*36&-1)+16>>2]=d;c[(c[h>>2]|0)+(f*36&-1)+32>>2]=0;bn(e,f);e=a+28|0;c[e>>2]=(c[e>>2]|0)+1|0;e=a+40|0;h=c[e>>2]|0;d=a+36|0;b=a+32|0;if((h|0)!=(c[d>>2]|0)){n=h;o=c[b>>2]|0;p=o+(n<<2)|0;c[p>>2]=f;q=c[e>>2]|0;r=q+1|0;c[e>>2]=r;return f|0}a=c[b>>2]|0;c[d>>2]=h<<1;d=dc(h<<3)|0;c[b>>2]=d;h=a;dh(d,h,c[e>>2]<<2);dd(h);n=c[e>>2]|0;o=c[b>>2]|0;p=o+(n<<2)|0;c[p>>2]=f;q=c[e>>2]|0;r=q+1|0;c[e>>2]=r;return f|0}function a8(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0,r=0,s=0.0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0.0;h=a+60|0;c[h>>2]=0;i=e+12|0;j=+g[f+12>>2];l=+g[i>>2];m=+g[f+8>>2];n=+g[e+16>>2];o=+g[f>>2]+(j*l-m*n)- +g[d>>2];p=l*m+j*n+ +g[f+4>>2]- +g[d+4>>2];n=+g[d+12>>2];j=+g[d+8>>2];m=o*n+p*j;l=n*p+o*(-0.0-j);j=+g[b+8>>2]+ +g[e+8>>2];e=c[b+148>>2]|0;do{if((e|0)>0){d=0;o=-3.4028234663852886e+38;f=0;while(1){p=(m- +g[b+20+(d<<3)>>2])*+g[b+84+(d<<3)>>2]+(l- +g[b+20+(d<<3)+4>>2])*+g[b+84+(d<<3)+4>>2];if(p>j){q=31;break}r=p>o;s=r?p:o;t=r?d:f;r=d+1|0;if((r|0)<(e|0)){d=r;o=s;f=t}else{q=15;break}}if((q|0)==15){u=s<1.1920928955078125e-7;v=t;break}else if((q|0)==31){return}}else{u=1;v=0}}while(0);q=v+1|0;t=b+20+(v<<3)|0;f=c[t>>2]|0;d=c[t+4>>2]|0;s=(c[k>>2]=f,+g[k>>2]);t=d;o=(c[k>>2]=t,+g[k>>2]);r=b+20+(((q|0)<(e|0)?q:0)<<3)|0;q=c[r>>2]|0;e=c[r+4>>2]|0;p=(c[k>>2]=q,+g[k>>2]);r=e;n=(c[k>>2]=r,+g[k>>2]);if(u){c[h>>2]=1;c[a+56>>2]=1;u=b+84+(v<<3)|0;w=a+40|0;x=c[u+4>>2]|0;c[w>>2]=c[u>>2]|0;c[w+4>>2]=x;x=a+48|0;w=(g[k>>2]=(s+p)*.5,c[k>>2]|0);u=(g[k>>2]=(o+n)*.5,c[k>>2]|0)|0;c[x>>2]=0|w;c[x+4>>2]=u;u=i;x=a;w=c[u+4>>2]|0;c[x>>2]=c[u>>2]|0;c[x+4>>2]=w;c[a+16>>2]=0;return}y=m-s;z=l-o;A=m-p;B=l-n;if(y*(p-s)+z*(n-o)<=0.0){if(y*y+z*z>j*j){return}c[h>>2]=1;c[a+56>>2]=1;w=a+40|0;x=w;u=(g[k>>2]=y,c[k>>2]|0);C=(g[k>>2]=z,c[k>>2]|0)|0;c[x>>2]=0|u;c[x+4>>2]=C;D=+N(y*y+z*z);if(D>=1.1920928955078125e-7){E=1.0/D;g[w>>2]=y*E;g[a+44>>2]=z*E}w=a+48|0;c[w>>2]=0|f&-1;c[w+4>>2]=t|d&0;d=i;t=a;w=c[d+4>>2]|0;c[t>>2]=c[d>>2]|0;c[t+4>>2]=w;c[a+16>>2]=0;return}if(A*(s-p)+B*(o-n)>0.0){E=(s+p)*.5;p=(o+n)*.5;w=b+84+(v<<3)|0;if((m-E)*+g[w>>2]+(l-p)*+g[b+84+(v<<3)+4>>2]>j){return}c[h>>2]=1;c[a+56>>2]=1;v=w;w=a+40|0;b=c[v+4>>2]|0;c[w>>2]=c[v>>2]|0;c[w+4>>2]=b;b=a+48|0;w=(g[k>>2]=E,c[k>>2]|0);v=(g[k>>2]=p,c[k>>2]|0)|0;c[b>>2]=0|w;c[b+4>>2]=v;v=i;b=a;w=c[v+4>>2]|0;c[b>>2]=c[v>>2]|0;c[b+4>>2]=w;c[a+16>>2]=0;return}if(A*A+B*B>j*j){return}c[h>>2]=1;c[a+56>>2]=1;h=a+40|0;w=h;b=(g[k>>2]=A,c[k>>2]|0);v=(g[k>>2]=B,c[k>>2]|0)|0;c[w>>2]=0|b;c[w+4>>2]=v;j=+N(A*A+B*B);if(j>=1.1920928955078125e-7){p=1.0/j;g[h>>2]=A*p;g[a+44>>2]=B*p}h=a+48|0;c[h>>2]=0|q&-1;c[h+4>>2]=r|e&0;e=i;i=a;r=c[e+4>>2]|0;c[i>>2]=c[e>>2]|0;c[i+4>>2]=r;c[a+16>>2]=0;return}function a9(d){d=d|0;var e=0,f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0.0,M=0.0,O=0,P=0.0,Q=0.0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0.0,_=0.0;e=i;i=i+105444|0;f=e|0;h=e+28|0;j=e+56|0;l=e+1080|0;m=e+1088|0;n=e+104116|0;o=e+104168|0;p=e+104216|0;q=e+104368|0;r=e+104420|0;g[l>>2]=0.0;g[l+4>>2]=-10.0;b7(m,l);l=m+102976|0;L51:do{if((a[l]&1)<<24>>24!=0){a[l]=0;s=c[m+102952>>2]|0;if((s|0)==0){break}else{t=s}while(1){s=t+4|0;u=b[s>>1]|0;if((u&2)<<16>>16==0){b[s>>1]=u|2;g[t+144>>2]=0.0}u=c[t+96>>2]|0;if((u|0)==0){break L51}else{t=u}}}}while(0);c[n+44>>2]=0;di(n+4|0,0,32);a[n+36|0]=1;a[n+37|0]=1;a[n+38|0]=0;a[n+39|0]=0;c[n>>2]=0;a[n+40|0]=1;g[n+48>>2]=1.0;t=m+102868|0;l=c[t>>2]|0;if((l&2|0)==0){v=l}else{ax(5245572,109,5248320,5246292);v=c[t>>2]|0}if((v&2|0)==0){v=bK(m|0,152)|0;if((v|0)==0){w=0}else{l=v;bO(l,n,m);w=l}c[w+92>>2]=0;l=m+102952|0;c[w+96>>2]=c[l>>2]|0;n=c[l>>2]|0;if((n|0)!=0){c[n+92>>2]=w}c[l>>2]=w;l=m+102960|0;c[l>>2]=(c[l>>2]|0)+1|0;x=w}else{x=0}c[o>>2]=5250868;c[o+4>>2]=1;g[o+8>>2]=.009999999776482582;w=o+28|0;c[w>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;c[w+12>>2]=0;b[w+16>>1]=0;w=o+12|0;c[w>>2]=-1038090240;c[w+4>>2]=0;w=o+20|0;c[w>>2]=1109393408;c[w+4>>2]=0;a[o+44|0]=0;a[o+45|0]=0;b[h+22>>1]=1;b[h+24>>1]=-1;b[h+26>>1]=0;c[h+4>>2]=0;g[h+8>>2]=.20000000298023224;g[h+12>>2]=0.0;a[h+20|0]=0;c[h>>2]=o|0;g[h+16>>2]=0.0;bQ(x,h);c[p>>2]=5250824;c[p+4>>2]=2;g[p+8>>2]=.009999999776482582;c[p+148>>2]=4;g[p+20>>2]=-.5;g[p+24>>2]=-.5;g[p+28>>2]=.5;g[p+32>>2]=-.5;g[p+36>>2]=.5;g[p+40>>2]=.5;g[p+44>>2]=-.5;g[p+48>>2]=.5;g[p+84>>2]=0.0;g[p+88>>2]=-1.0;g[p+92>>2]=1.0;g[p+96>>2]=0.0;g[p+100>>2]=0.0;g[p+104>>2]=1.0;g[p+108>>2]=-1.0;g[p+112>>2]=0.0;g[p+12>>2]=0.0;g[p+16>>2]=0.0;h=q+44|0;x=q+36|0;o=q+4|0;w=q+37|0;l=q+38|0;n=q+39|0;v=q|0;u=q+40|0;s=q+48|0;y=q+4|0;z=m|0;A=m+102952|0;B=m+102960|0;C=p|0;p=f+22|0;D=f+24|0;E=f+26|0;F=f|0;G=f+4|0;H=f+8|0;I=f+12|0;J=f+16|0;K=f+20|0;L=.75;M=-7.0;O=0;while(1){P=L;Q=M;R=O;while(1){c[h>>2]=0;di(o|0,0,32);a[x]=1;a[w]=1;a[l]=0;a[n]=0;a[u]=1;g[s>>2]=1.0;c[v>>2]=2;S=(g[k>>2]=Q,c[k>>2]|0);T=(g[k>>2]=P,c[k>>2]|0)|0;c[y>>2]=0|S;c[y+4>>2]=T;T=c[t>>2]|0;if((T&2|0)==0){U=T}else{ax(5245572,109,5248320,5246292);U=c[t>>2]|0}if((U&2|0)==0){T=bK(z,152)|0;if((T|0)==0){V=0}else{S=T;bO(S,q,m);V=S}c[V+92>>2]=0;c[V+96>>2]=c[A>>2]|0;S=c[A>>2]|0;if((S|0)!=0){c[S+92>>2]=V}c[A>>2]=V;c[B>>2]=(c[B>>2]|0)+1|0;W=V}else{W=0}b[p>>1]=1;b[D>>1]=-1;b[E>>1]=0;c[G>>2]=0;g[H>>2]=.20000000298023224;g[I>>2]=0.0;a[K]=0;c[F>>2]=C;g[J>>2]=5.0;bQ(W,f);S=R+1|0;if((S|0)<40){P=P+0.0;Q=Q+1.125;R=S}else{break}}R=O+1|0;if((R|0)<40){L=L+1.0;M=M+.5625;O=R}else{X=0;break}}while(1){ch(m,.01666666753590107,3,3);O=X+1|0;if((O|0)<64){X=O}else{Y=0;break}}while(1){X=ao()|0;ch(m,.01666666753590107,3,3);c[r+(Y<<2)>>2]=(ao()|0)-X|0;X=Y+1|0;if((X|0)<256){Y=X}else{break}}Y=0;M=0.0;while(1){L=+((c[r+(Y<<2)>>2]|0)>>>0>>>0)/1.0e3*1.0e3;g[j+(Y<<2)>>2]=L;Z=M+L;X=Y+1|0;if((X|0)==256){break}else{Y=X;M=Z}}M=Z*.00390625;g[d>>2]=M;Z=0.0;Y=0;while(1){L=+g[j+(Y<<2)>>2]-M;_=Z+L*L;r=Y+1|0;if((r|0)==256){break}else{Z=_;Y=r}}g[d+4>>2]=+N(_*.00390625);b9(m);i=e;return}function ba(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var i=0,j=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0;i=b+60|0;c[i>>2]=0;j=f+12|0;l=+g[h+12>>2];m=+g[j>>2];n=+g[h+8>>2];o=+g[f+16>>2];p=+g[h>>2]+(l*m-n*o)- +g[e>>2];q=m*n+l*o+ +g[h+4>>2]- +g[e+4>>2];o=+g[e+12>>2];l=+g[e+8>>2];n=p*o+q*l;m=o*q+p*(-0.0-l);e=d+12|0;h=c[e>>2]|0;r=c[e+4>>2]|0;l=(c[k>>2]=h,+g[k>>2]);e=r;p=(c[k>>2]=e,+g[k>>2]);s=d+20|0;t=c[s>>2]|0;u=c[s+4>>2]|0;q=(c[k>>2]=t,+g[k>>2]);s=u;o=(c[k>>2]=s,+g[k>>2]);v=q-l;w=o-p;x=v*(q-n)+w*(o-m);y=n-l;z=m-p;A=y*v+z*w;B=+g[d+8>>2]+ +g[f+8>>2];if(A<=0.0){if(y*y+z*z>B*B){return}do{if((a[d+44|0]&1)<<24>>24!=0){f=d+28|0;C=c[f+4>>2]|0;D=(c[k>>2]=c[f>>2]|0,+g[k>>2]);if((l-n)*(l-D)+(p-m)*(p-(c[k>>2]=C,+g[k>>2]))<=0.0){break}return}}while(0);c[i>>2]=1;c[b+56>>2]=0;g[b+40>>2]=0.0;g[b+44>>2]=0.0;C=b+48|0;c[C>>2]=0|h&-1;c[C+4>>2]=e|r&0;C=b+16|0;c[C>>2]=0;f=C;a[C]=0;a[f+1|0]=0;a[f+2|0]=0;a[f+3|0]=0;f=j;C=b;E=c[f+4>>2]|0;c[C>>2]=c[f>>2]|0;c[C+4>>2]=E;return}if(x<=0.0){D=n-q;F=m-o;if(D*D+F*F>B*B){return}do{if((a[d+45|0]&1)<<24>>24!=0){E=d+36|0;C=c[E+4>>2]|0;G=(c[k>>2]=c[E>>2]|0,+g[k>>2]);if(D*(G-q)+F*((c[k>>2]=C,+g[k>>2])-o)<=0.0){break}return}}while(0);c[i>>2]=1;c[b+56>>2]=0;g[b+40>>2]=0.0;g[b+44>>2]=0.0;d=b+48|0;c[d>>2]=0|t&-1;c[d+4>>2]=s|u&0;u=b+16|0;c[u>>2]=0;s=u;a[u]=1;a[s+1|0]=0;a[s+2|0]=0;a[s+3|0]=0;s=j;u=b;d=c[s+4>>2]|0;c[u>>2]=c[s>>2]|0;c[u+4>>2]=d;return}F=v*v+w*w;if(F<=0.0){ax(5244336,127,5250300,5246452)}D=1.0/F;F=n-(l*x+q*A)*D;q=m-(p*x+o*A)*D;if(F*F+q*q>B*B){return}B=-0.0-w;if(v*z+y*B<0.0){H=w;I=-0.0-v}else{H=B;I=v}v=+N(I*I+H*H);if(v<1.1920928955078125e-7){J=H;K=I}else{B=1.0/v;J=H*B;K=I*B}c[i>>2]=1;c[b+56>>2]=1;i=b+40|0;d=(g[k>>2]=J,c[k>>2]|0);u=(g[k>>2]=K,c[k>>2]|0)|0;c[i>>2]=0|d;c[i+4>>2]=u;u=b+48|0;c[u>>2]=0|h&-1;c[u+4>>2]=e|r&0;r=b+16|0;c[r>>2]=0;e=r;a[r]=0;a[e+1|0]=0;a[e+2|0]=1;a[e+3|0]=0;e=j;j=b;b=c[e+4>>2]|0;c[j>>2]=c[e>>2]|0;c[j+4>>2]=b;return}function bb(b,d,e,f,h,j){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0,y=0,z=0.0,A=0.0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0,_=0.0,$=0.0,aa=0,ab=0.0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0.0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0.0,aB=0.0,aC=0.0,aD=0.0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aM=0,aN=0,aO=0.0,aP=0,aQ=0,aR=0.0;l=i;i=i+84|0;m=l|0;n=l+12|0;o=l+36|0;p=l+60|0;q=b+132|0;r=+g[f+12>>2];s=+g[j+8>>2];t=+g[f+8>>2];u=+g[j+12>>2];v=r*s-t*u;w=s*t+r*u;x=(g[k>>2]=v,c[k>>2]|0);y=(g[k>>2]=w,c[k>>2]|0)|0;u=+g[j>>2]- +g[f>>2];s=+g[j+4>>2]- +g[f+4>>2];z=r*u+t*s;A=u*(-0.0-t)+r*s;f=(g[k>>2]=z,c[k>>2]|0);j=(g[k>>2]=A,c[k>>2]|0)|0;B=q;c[B>>2]=0|f;c[B+4>>2]=j;j=b+140|0;c[j>>2]=0|x;c[j+4>>2]=y;y=b+144|0;s=+g[h+12>>2];j=b+140|0;r=+g[h+16>>2];x=q|0;t=z+(w*s-v*r);q=b+136|0;z=s*v+w*r+A;B=b+148|0;f=(g[k>>2]=t,c[k>>2]|0);C=(g[k>>2]=z,c[k>>2]|0)|0;c[B>>2]=0|f;c[B+4>>2]=C;C=e+28|0;B=b+156|0;f=c[C>>2]|0;D=c[C+4>>2]|0;c[B>>2]=f;c[B+4>>2]=D;B=e+12|0;C=b+164|0;E=c[B>>2]|0;F=c[B+4>>2]|0;c[C>>2]=E;c[C+4>>2]=F;B=e+20|0;G=b+172|0;H=c[B>>2]|0;I=c[B+4>>2]|0;c[G>>2]=H;c[G+4>>2]=I;B=e+36|0;J=b+180|0;K=c[B>>2]|0;L=c[B+4>>2]|0;c[J>>2]=K;c[J+4>>2]=L;J=a[e+44|0]&1;B=J<<24>>24!=0;M=a[e+45|0]|0;e=(M&1)<<24>>24!=0;A=(c[k>>2]=H,+g[k>>2]);r=(c[k>>2]=E,+g[k>>2]);w=A-r;v=(c[k>>2]=I,+g[k>>2]);I=b+168|0;s=(c[k>>2]=F,+g[k>>2]);u=v-s;O=+N(w*w+u*u);P=(c[k>>2]=f,+g[k>>2]);Q=(c[k>>2]=D,+g[k>>2]);R=(c[k>>2]=K,+g[k>>2]);S=(c[k>>2]=L,+g[k>>2]);if(O<1.1920928955078125e-7){T=w;U=u}else{V=1.0/O;T=w*V;U=u*V}L=b+196|0;V=-0.0-T;K=L|0;g[K>>2]=U;D=b+200|0;g[D>>2]=V;u=(t-r)*U+(z-s)*V;if(B){V=r-P;r=s-Q;s=+N(V*V+r*r);if(s<1.1920928955078125e-7){W=V;X=r}else{w=1.0/s;W=V*w;X=r*w}w=-0.0-W;g[b+188>>2]=X;g[b+192>>2]=w;Y=(t-P)*X+(z-Q)*w;Z=U*W-T*X>=0.0}else{Y=0.0;Z=0}L155:do{if(e){X=R-A;W=S-v;w=+N(X*X+W*W);if(w<1.1920928955078125e-7){_=X;$=W}else{Q=1.0/w;_=X*Q;$=W*Q}Q=-0.0-_;f=b+204|0;g[f>>2]=$;F=b+208|0;g[F>>2]=Q;E=T*$-U*_>0.0;W=(t-A)*$+(z-v)*Q;if((J&M)<<24>>24==0){aa=E;ab=W;ac=154;break}if(Z&E){do{if(Y<0.0&u<0.0){H=W>=0.0;a[b+248|0]=H&1;ad=b+212|0;if(H){ae=ad;break}H=ad;ad=(g[k>>2]=-0.0-U,c[k>>2]|0);af=0|ad;ad=(g[k>>2]=T,c[k>>2]|0)|0;c[H>>2]=af;c[H+4>>2]=ad;H=b+228|0;c[H>>2]=af;c[H+4>>2]=ad;H=b+236|0;c[H>>2]=af;c[H+4>>2]=ad;break L155}else{a[b+248|0]=1;ae=b+212|0}}while(0);ad=L;H=ae;af=c[ad+4>>2]|0;c[H>>2]=c[ad>>2]|0;c[H+4>>2]=af;af=b+188|0;H=b+228|0;ad=c[af+4>>2]|0;c[H>>2]=c[af>>2]|0;c[H+4>>2]=ad;ad=b+204|0;H=b+236|0;af=c[ad+4>>2]|0;c[H>>2]=c[ad>>2]|0;c[H+4>>2]=af;break}if(Z){do{if(Y<0.0){if(u<0.0){a[b+248|0]=0;ag=b+212|0}else{af=W>=0.0;a[b+248|0]=af&1;H=b+212|0;if(af){ah=H;break}else{ag=H}}H=ag;af=(g[k>>2]=-0.0-U,c[k>>2]|0);ad=(g[k>>2]=T,c[k>>2]|0)|0;c[H>>2]=0|af;c[H+4>>2]=ad;Q=-0.0- +g[F>>2];ad=b+228|0;H=(g[k>>2]=-0.0- +g[f>>2],c[k>>2]|0);af=(g[k>>2]=Q,c[k>>2]|0)|0;c[ad>>2]=0|H;c[ad+4>>2]=af;Q=-0.0- +g[D>>2];af=b+236|0;ad=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);H=(g[k>>2]=Q,c[k>>2]|0)|0;c[af>>2]=0|ad;c[af+4>>2]=H;break L155}else{a[b+248|0]=1;ah=b+212|0}}while(0);H=L;af=ah;ad=c[H+4>>2]|0;c[af>>2]=c[H>>2]|0;c[af+4>>2]=ad;ad=b+188|0;af=b+228|0;ai=c[ad+4>>2]|0;c[af>>2]=c[ad>>2]|0;c[af+4>>2]=ai;ai=b+236|0;af=c[H+4>>2]|0;c[ai>>2]=c[H>>2]|0;c[ai+4>>2]=af;break}if(!E){do{if(Y<0.0|u<0.0){a[b+248|0]=0;aj=b+212|0}else{af=W>=0.0;a[b+248|0]=af&1;ai=b+212|0;if(!af){aj=ai;break}af=L;H=ai;ai=c[af>>2]|0;ad=c[af+4>>2]|0;c[H>>2]=ai;c[H+4>>2]=ad;H=b+228|0;c[H>>2]=ai;c[H+4>>2]=ad;H=b+236|0;c[H>>2]=ai;c[H+4>>2]=ad;break L155}}while(0);E=aj;ad=(g[k>>2]=-0.0-U,c[k>>2]|0);H=(g[k>>2]=T,c[k>>2]|0)|0;c[E>>2]=0|ad;c[E+4>>2]=H;Q=-0.0- +g[F>>2];H=b+228|0;E=(g[k>>2]=-0.0- +g[f>>2],c[k>>2]|0);ad=(g[k>>2]=Q,c[k>>2]|0)|0;c[H>>2]=0|E;c[H+4>>2]=ad;Q=-0.0- +g[b+192>>2];ad=b+236|0;H=(g[k>>2]=-0.0- +g[b+188>>2],c[k>>2]|0);E=(g[k>>2]=Q,c[k>>2]|0)|0;c[ad>>2]=0|H;c[ad+4>>2]=E;break}do{if(W<0.0){if(Y<0.0){a[b+248|0]=0;ak=b+212|0}else{E=u>=0.0;a[b+248|0]=E&1;ad=b+212|0;if(E){al=ad;break}else{ak=ad}}ad=ak;E=(g[k>>2]=-0.0-U,c[k>>2]|0);H=(g[k>>2]=T,c[k>>2]|0)|0;c[ad>>2]=0|E;c[ad+4>>2]=H;Q=-0.0- +g[D>>2];H=b+228|0;ad=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);E=(g[k>>2]=Q,c[k>>2]|0)|0;c[H>>2]=0|ad;c[H+4>>2]=E;Q=-0.0- +g[b+192>>2];E=b+236|0;H=(g[k>>2]=-0.0- +g[b+188>>2],c[k>>2]|0);ad=(g[k>>2]=Q,c[k>>2]|0)|0;c[E>>2]=0|H;c[E+4>>2]=ad;break L155}else{a[b+248|0]=1;al=b+212|0}}while(0);f=L;F=al;ad=c[f+4>>2]|0;c[F>>2]=c[f>>2]|0;c[F+4>>2]=ad;ad=b+228|0;F=c[f+4>>2]|0;c[ad>>2]=c[f>>2]|0;c[ad+4>>2]=F;F=b+204|0;ad=b+236|0;f=c[F+4>>2]|0;c[ad>>2]=c[F>>2]|0;c[ad+4>>2]=f;break}else{aa=0;ab=0.0;ac=154}}while(0);L196:do{if((ac|0)==154){if(B){al=Y>=0.0;if(Z){do{if(al){a[b+248|0]=1;am=b+212|0}else{ak=u>=0.0;a[b+248|0]=ak&1;aj=b+212|0;if(ak){am=aj;break}ak=aj;aj=(g[k>>2]=-0.0-U,c[k>>2]|0);ah=0;ag=(g[k>>2]=T,c[k>>2]|0);c[ak>>2]=ah|aj;c[ak+4>>2]=ag|0;ak=L;aj=b+228|0;ae=c[ak>>2]|0;M=c[ak+4>>2]|0;c[aj>>2]=ae;c[aj+4>>2]=M;M=b+236|0;c[M>>2]=ah|(g[k>>2]=-0.0-(c[k>>2]=ae,+g[k>>2]),c[k>>2]|0);c[M+4>>2]=ag|0;break L196}}while(0);ag=L;M=am;ae=c[ag+4>>2]|0;c[M>>2]=c[ag>>2]|0;c[M+4>>2]=ae;ae=b+188|0;M=b+228|0;ag=c[ae+4>>2]|0;c[M>>2]=c[ae>>2]|0;c[M+4>>2]=ag;v=-0.0- +g[D>>2];ag=b+236|0;M=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);ae=(g[k>>2]=v,c[k>>2]|0)|0;c[ag>>2]=0|M;c[ag+4>>2]=ae;break}else{do{if(al){ae=u>=0.0;a[b+248|0]=ae&1;ag=b+212|0;if(!ae){an=ag;break}ae=L;M=ag;ag=c[ae>>2]|0;ah=c[ae+4>>2]|0;c[M>>2]=ag;c[M+4>>2]=ah;M=b+228|0;c[M>>2]=ag;c[M+4>>2]=ah;ah=b+236|0;M=(g[k>>2]=-0.0-(c[k>>2]=ag,+g[k>>2]),c[k>>2]|0);ag=(g[k>>2]=T,c[k>>2]|0)|0;c[ah>>2]=0|M;c[ah+4>>2]=ag;break L196}else{a[b+248|0]=0;an=b+212|0}}while(0);al=an;ag=(g[k>>2]=-0.0-U,c[k>>2]|0);ah=(g[k>>2]=T,c[k>>2]|0)|0;c[al>>2]=0|ag;c[al+4>>2]=ah;ah=L;al=b+228|0;ag=c[ah+4>>2]|0;c[al>>2]=c[ah>>2]|0;c[al+4>>2]=ag;v=-0.0- +g[b+192>>2];ag=b+236|0;al=(g[k>>2]=-0.0- +g[b+188>>2],c[k>>2]|0);ah=(g[k>>2]=v,c[k>>2]|0)|0;c[ag>>2]=0|al;c[ag+4>>2]=ah;break}}ah=u>=0.0;if(!e){a[b+248|0]=ah&1;ag=b+212|0;if(ah){al=L;M=ag;ae=c[al>>2]|0;aj=c[al+4>>2]|0;c[M>>2]=ae;c[M+4>>2]=aj;aj=b+228|0;M=(g[k>>2]=-0.0-(c[k>>2]=ae,+g[k>>2]),c[k>>2]|0);ae=0|M;M=(g[k>>2]=T,c[k>>2]|0)|0;c[aj>>2]=ae;c[aj+4>>2]=M;aj=b+236|0;c[aj>>2]=ae;c[aj+4>>2]=M;break}else{M=ag;ag=(g[k>>2]=-0.0-U,c[k>>2]|0);aj=(g[k>>2]=T,c[k>>2]|0)|0;c[M>>2]=0|ag;c[M+4>>2]=aj;aj=L;M=b+228|0;ag=c[aj>>2]|0;ae=c[aj+4>>2]|0;c[M>>2]=ag;c[M+4>>2]=ae;M=b+236|0;c[M>>2]=ag;c[M+4>>2]=ae;break}}if(aa){do{if(ah){a[b+248|0]=1;ao=b+212|0}else{ae=ab>=0.0;a[b+248|0]=ae&1;M=b+212|0;if(ae){ao=M;break}ae=M;M=(g[k>>2]=-0.0-U,c[k>>2]|0);ag=0|M;M=(g[k>>2]=T,c[k>>2]|0)|0;c[ae>>2]=ag;c[ae+4>>2]=M;ae=b+228|0;c[ae>>2]=ag;c[ae+4>>2]=M;M=L;ae=b+236|0;ag=c[M+4>>2]|0;c[ae>>2]=c[M>>2]|0;c[ae+4>>2]=ag;break L196}}while(0);ag=L;ae=ao;M=c[ag+4>>2]|0;c[ae>>2]=c[ag>>2]|0;c[ae+4>>2]=M;v=-0.0- +g[D>>2];M=b+228|0;ae=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);ag=(g[k>>2]=v,c[k>>2]|0)|0;c[M>>2]=0|ae;c[M+4>>2]=ag;ag=b+204|0;M=b+236|0;ae=c[ag+4>>2]|0;c[M>>2]=c[ag>>2]|0;c[M+4>>2]=ae;break}else{do{if(ah){ae=ab>=0.0;a[b+248|0]=ae&1;M=b+212|0;if(!ae){ap=M;break}ae=L;ag=M;M=c[ae>>2]|0;aj=c[ae+4>>2]|0;c[ag>>2]=M;c[ag+4>>2]=aj;ag=b+228|0;ae=(g[k>>2]=-0.0-(c[k>>2]=M,+g[k>>2]),c[k>>2]|0);al=(g[k>>2]=T,c[k>>2]|0)|0;c[ag>>2]=0|ae;c[ag+4>>2]=al;al=b+236|0;c[al>>2]=M;c[al+4>>2]=aj;break L196}else{a[b+248|0]=0;ap=b+212|0}}while(0);ah=ap;aj=(g[k>>2]=-0.0-U,c[k>>2]|0);al=(g[k>>2]=T,c[k>>2]|0)|0;c[ah>>2]=0|aj;c[ah+4>>2]=al;v=-0.0- +g[b+208>>2];al=b+228|0;ah=(g[k>>2]=-0.0- +g[b+204>>2],c[k>>2]|0);aj=(g[k>>2]=v,c[k>>2]|0)|0;c[al>>2]=0|ah;c[al+4>>2]=aj;aj=L;al=b+236|0;ah=c[aj+4>>2]|0;c[al>>2]=c[aj>>2]|0;c[al+4>>2]=ah;break}}}while(0);ap=h+148|0;ao=b+128|0;c[ao>>2]=c[ap>>2]|0;L234:do{if((c[ap>>2]|0)>0){aa=0;while(1){T=+g[y>>2];U=+g[h+20+(aa<<3)>>2];ab=+g[j>>2];u=+g[h+20+(aa<<3)+4>>2];Y=U*ab+T*u+ +g[q>>2];e=b+(aa<<3)|0;an=(g[k>>2]=+g[x>>2]+(T*U-ab*u),c[k>>2]|0);am=(g[k>>2]=Y,c[k>>2]|0)|0;c[e>>2]=0|an;c[e+4>>2]=am;Y=+g[y>>2];u=+g[h+84+(aa<<3)>>2];ab=+g[j>>2];U=+g[h+84+(aa<<3)+4>>2];am=b+64+(aa<<3)|0;e=(g[k>>2]=Y*u-ab*U,c[k>>2]|0);an=(g[k>>2]=u*ab+Y*U,c[k>>2]|0)|0;c[am>>2]=0|e;c[am+4>>2]=an;an=aa+1|0;if((an|0)<(c[ap>>2]|0)){aa=an}else{break L234}}}}while(0);ap=b+244|0;g[ap>>2]=.019999999552965164;aa=d+60|0;c[aa>>2]=0;an=b+248|0;am=c[ao>>2]|0;L238:do{if((am|0)>0){U=+g[b+164>>2];Y=+g[I>>2];ab=+g[b+212>>2];u=+g[b+216>>2];e=0;T=3.4028234663852886e+38;while(1){v=ab*(+g[b+(e<<3)>>2]-U)+u*(+g[b+(e<<3)+4>>2]-Y);z=v<T?v:T;Z=e+1|0;if((Z|0)==(am|0)){aq=z;break L238}else{e=Z;T=z}}}else{aq=3.4028234663852886e+38}}while(0);if(aq>+g[ap>>2]){i=l;return}bc(m,b);am=c[m>>2]|0;do{if((am|0)==0){ac=190}else{T=+g[m+8>>2];if(T>+g[ap>>2]){i=l;return}if(T<=aq*.9800000190734863+.0010000000474974513){ac=190;break}I=c[m+4>>2]|0;e=d+56|0;if((am|0)==1){ar=e;ac=192;break}c[e>>2]=2;e=n;Z=c[C>>2]|0;B=c[C+4>>2]|0;c[e>>2]=Z;c[e+4>>2]=B;e=n+8|0;ah=e;a[e]=0;e=I&255;a[ah+1|0]=e;a[ah+2|0]=0;a[ah+3|0]=1;ah=n+12|0;al=c[G>>2]|0;aj=c[G+4>>2]|0;c[ah>>2]=al;c[ah+4>>2]=aj;ah=n+20|0;M=ah;a[ah]=0;a[M+1|0]=e;a[M+2|0]=0;a[M+3|0]=1;M=I+1|0;ah=(M|0)<(c[ao>>2]|0)?M:0;M=b+(I<<3)|0;ag=c[M>>2]|0;ae=c[M+4>>2]|0;M=b+(ah<<3)|0;ak=c[M>>2]|0;J=c[M+4>>2]|0;M=b+64+(I<<3)|0;f=c[M>>2]|0;ad=c[M+4>>2]|0;T=(c[k>>2]=Z,+g[k>>2]);Y=(c[k>>2]=B,+g[k>>2]);u=(c[k>>2]=al,+g[k>>2]);as=I;at=ah&255;au=f;av=ad;aw=ak;ax=J;ay=ag;az=ae;aA=u;aB=T;aC=(c[k>>2]=aj,+g[k>>2]);aD=Y;aE=e;aF=0;break}}while(0);do{if((ac|0)==190){ar=d+56|0;ac=192;break}}while(0);do{if((ac|0)==192){c[ar>>2]=1;am=c[ao>>2]|0;L257:do{if((am|0)>1){aq=+g[b+216>>2];Y=+g[b+212>>2];m=0;T=Y*+g[b+64>>2]+aq*+g[b+68>>2];e=1;while(1){u=Y*+g[b+64+(e<<3)>>2]+aq*+g[b+64+(e<<3)+4>>2];aj=u<T;ae=aj?e:m;ag=e+1|0;if((ag|0)<(am|0)){m=ae;T=aj?u:T;e=ag}else{aG=ae;break L257}}}else{aG=0}}while(0);e=aG+1|0;m=(e|0)<(am|0)?e:0;e=b+(aG<<3)|0;ae=n;ag=c[e>>2]|0;aj=c[e+4>>2]|0;c[ae>>2]=ag;c[ae+4>>2]=aj;ae=n+8|0;e=ae;a[ae]=0;ae=aG&255;a[e+1|0]=ae;a[e+2|0]=1;a[e+3|0]=0;e=b+(m<<3)|0;J=n+12|0;ak=c[e>>2]|0;ad=c[e+4>>2]|0;c[J>>2]=ak;c[J+4>>2]=ad;J=n+20|0;e=J;a[J]=0;a[e+1|0]=m&255;a[e+2|0]=1;a[e+3|0]=0;e=(a[an]&1)<<24>>24==0;T=(c[k>>2]=ag,+g[k>>2]);aq=(c[k>>2]=aj,+g[k>>2]);Y=(c[k>>2]=ak,+g[k>>2]);u=(c[k>>2]=ad,+g[k>>2]);if(e){e=c[G>>2]|0;ad=c[G+4>>2]|0;ak=c[C>>2]|0;aj=c[C+4>>2]|0;U=-0.0- +g[D>>2];ag=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);as=1;at=0;au=ag;av=(g[k>>2]=U,c[k>>2]|0);aw=ak;ax=aj;ay=e;az=ad;aA=Y;aB=T;aC=u;aD=aq;aE=ae;aF=1;break}else{ad=L;as=0;at=1;au=c[ad>>2]|0;av=c[ad+4>>2]|0;aw=c[G>>2]|0;ax=c[G+4>>2]|0;ay=c[C>>2]|0;az=c[C+4>>2]|0;aA=Y;aB=T;aC=u;aD=aq;aE=ae;aF=1;break}}}while(0);aq=(c[k>>2]=au,+g[k>>2]);u=(c[k>>2]=av,+g[k>>2]);T=(c[k>>2]=ax,+g[k>>2]);Y=(c[k>>2]=ay,+g[k>>2]);U=(c[k>>2]=az,+g[k>>2]);ab=-0.0-aq;z=Y*u+U*ab;v=-0.0-u;$=(c[k>>2]=aw,+g[k>>2])*v+T*aq;T=u*aB+aD*ab-z;A=u*aA+aC*ab-z;if(T>0.0){aH=0}else{aw=o;ax=n;c[aw>>2]=c[ax>>2]|0;c[aw+4>>2]=c[ax+4>>2]|0;c[aw+8>>2]=c[ax+8>>2]|0;aH=1}if(A>0.0){aI=aH}else{ax=o+(aH*12&-1)|0;aw=n+12|0;c[ax>>2]=c[aw>>2]|0;c[ax+4>>2]=c[aw+4>>2]|0;c[ax+8>>2]=c[aw+8>>2]|0;aI=aH+1|0}if(T*A<0.0){z=T/(T-A);aH=o+(aI*12&-1)|0;aw=(g[k>>2]=aB+z*(aA-aB),c[k>>2]|0);ax=(g[k>>2]=aD+z*(aC-aD),c[k>>2]|0)|0;c[aH>>2]=0|aw;c[aH+4>>2]=ax;ax=o+(aI*12&-1)+8|0;aH=ax;a[ax]=as&255;a[aH+1|0]=aE;a[aH+2|0]=0;a[aH+3|0]=1;aJ=aI+1|0}else{aJ=aI}if((aJ|0)<2){i=l;return}aD=+g[o>>2];aC=+g[o+4>>2];z=aD*v+aq*aC-$;aJ=o+12|0;aB=+g[aJ>>2];aA=+g[o+16>>2];A=aB*v+aq*aA-$;if(z>0.0){aK=0}else{aI=p;aH=o;c[aI>>2]=c[aH>>2]|0;c[aI+4>>2]=c[aH+4>>2]|0;c[aI+8>>2]=c[aH+8>>2]|0;aK=1}if(A>0.0){aL=aK}else{aH=p+(aK*12&-1)|0;aI=aJ;c[aH>>2]=c[aI>>2]|0;c[aH+4>>2]=c[aI+4>>2]|0;c[aH+8>>2]=c[aI+8>>2]|0;aL=aK+1|0}if(z*A<0.0){$=z/(z-A);aK=p+(aL*12&-1)|0;aI=(g[k>>2]=aD+$*(aB-aD),c[k>>2]|0);aH=(g[k>>2]=aC+$*(aA-aC),c[k>>2]|0)|0;c[aK>>2]=0|aI;c[aK+4>>2]=aH;aH=p+(aL*12&-1)+8|0;aK=aH;a[aH]=at;a[aK+1|0]=a[(o+8|0)+1|0]|0;a[aK+2|0]=0;a[aK+3|0]=1;aM=aL+1|0}else{aM=aL}if((aM|0)<2){i=l;return}aM=d+40|0;do{if(aF){aL=aM;c[aL>>2]=0|au;c[aL+4>>2]=av|0;aL=d+48|0;c[aL>>2]=0|ay;c[aL+4>>2]=az|0;aC=+g[p>>2];aA=+g[p+4>>2];$=+g[ap>>2];if(aq*(aC-Y)+u*(aA-U)>$){aN=0;aO=$}else{$=aC- +g[x>>2];aC=aA- +g[q>>2];aA=+g[y>>2];aD=+g[j>>2];aL=d;aK=(g[k>>2]=$*aA+aC*aD,c[k>>2]|0);o=(g[k>>2]=aA*aC+$*(-0.0-aD),c[k>>2]|0)|0;c[aL>>2]=0|aK;c[aL+4>>2]=o;c[d+16>>2]=c[p+8>>2]|0;aN=1;aO=+g[ap>>2]}aD=+g[p+12>>2];$=+g[p+16>>2];if(aq*(aD-Y)+u*($-U)>aO){aP=aN;break}aC=aD- +g[x>>2];aD=$- +g[q>>2];$=+g[y>>2];aA=+g[j>>2];o=d+(aN*20&-1)|0;aL=(g[k>>2]=aC*$+aD*aA,c[k>>2]|0);aK=(g[k>>2]=$*aD+aC*(-0.0-aA),c[k>>2]|0)|0;c[o>>2]=0|aL;c[o+4>>2]=aK;c[d+(aN*20&-1)+16>>2]=c[p+20>>2]|0;aP=aN+1|0}else{aK=h+84+(as<<3)|0;o=aM;aL=c[aK+4>>2]|0;c[o>>2]=c[aK>>2]|0;c[o+4>>2]=aL;aL=h+20+(as<<3)|0;o=d+48|0;aK=c[aL+4>>2]|0;c[o>>2]=c[aL>>2]|0;c[o+4>>2]=aK;aA=+g[ap>>2];if(aq*(+g[p>>2]-Y)+u*(+g[p+4>>2]-U)>aA){aQ=0;aR=aA}else{aK=p;o=d;aL=c[aK+4>>2]|0;c[o>>2]=c[aK>>2]|0;c[o+4>>2]=aL;aL=p+8|0;o=aL;aK=d+16|0;at=aK;a[at+2|0]=a[o+3|0]|0;a[at+3|0]=a[o+2|0]|0;a[aK]=a[o+1|0]|0;a[at+1|0]=a[aL]|0;aQ=1;aR=+g[ap>>2]}aL=p+12|0;if(aq*(+g[aL>>2]-Y)+u*(+g[p+16>>2]-U)>aR){aP=aQ;break}at=aL;aL=d+(aQ*20&-1)|0;o=c[at+4>>2]|0;c[aL>>2]=c[at>>2]|0;c[aL+4>>2]=o;o=p+20|0;aL=o;at=d+(aQ*20&-1)+16|0;aK=at;a[aK+2|0]=a[aL+3|0]|0;a[aK+3|0]=a[aL+2|0]|0;a[at]=a[aL+1|0]|0;a[aK+1|0]=a[o]|0;aP=aQ+1|0}}while(0);c[aa>>2]=aP;i=l;return}function bc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0;d=a|0;c[d>>2]=0;e=a+4|0;c[e>>2]=-1;f=a+8|0;g[f>>2]=-3.4028234663852886e+38;h=+g[b+216>>2];i=+g[b+212>>2];a=c[b+128>>2]|0;if((a|0)<=0){return}j=+g[b+164>>2];k=+g[b+168>>2];l=+g[b+172>>2];m=+g[b+176>>2];n=+g[b+244>>2];o=b+228|0;p=b+232|0;q=b+236|0;r=b+240|0;s=0;t=-3.4028234663852886e+38;while(1){u=+g[b+64+(s<<3)>>2];v=-0.0-u;w=-0.0- +g[b+64+(s<<3)+4>>2];x=+g[b+(s<<3)>>2];y=+g[b+(s<<3)+4>>2];z=(x-j)*v+(y-k)*w;A=(x-l)*v+(y-m)*w;B=z<A?z:A;if(B>n){break}do{if(h*u+i*w<0.0){if((v- +g[o>>2])*i+(w- +g[p>>2])*h>=-.03490658849477768&B>t){C=236;break}else{D=t;break}}else{if((v- +g[q>>2])*i+(w- +g[r>>2])*h>=-.03490658849477768&B>t){C=236;break}else{D=t;break}}}while(0);if((C|0)==236){C=0;c[d>>2]=2;c[e>>2]=s;g[f>>2]=B;D=B}E=s+1|0;if((E|0)<(a|0)){s=E;t=D}else{C=241;break}}if((C|0)==241){return}c[d>>2]=2;c[e>>2]=s;g[f>>2]=B;return}function bd(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0,B=0,C=0,D=0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,O=0,P=0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0;j=i;i=i+80|0;l=j|0;m=j+4|0;n=j+8|0;o=j+32|0;p=j+56|0;q=b+60|0;c[q>>2]=0;r=+g[d+8>>2]+ +g[f+8>>2];c[l>>2]=0;s=+be(l,d,e,f,h);if(s>r){i=j;return}c[m>>2]=0;t=+be(m,f,h,d,e);if(t>r){i=j;return}if(t>s*.9800000190734863+.0010000000474974513){s=+g[h>>2];t=+g[h+4>>2];u=+g[h+8>>2];v=+g[h+12>>2];w=+g[e>>2];x=+g[e+4>>2];y=+g[e+8>>2];z=+g[e+12>>2];A=c[m>>2]|0;c[b+56>>2]=2;B=f;C=d;D=A;E=1;F=w;G=x;H=y;I=z;J=s;K=t;L=u;M=v}else{v=+g[e>>2];u=+g[e+4>>2];t=+g[e+8>>2];s=+g[e+12>>2];z=+g[h>>2];y=+g[h+4>>2];x=+g[h+8>>2];w=+g[h+12>>2];h=c[l>>2]|0;c[b+56>>2]=1;B=d;C=f;D=h;E=0;F=z;G=y;H=x;I=w;J=v;K=u;L=t;M=s}h=c[C+148>>2]|0;do{if((D|0)>-1){if((c[B+148>>2]|0)>(D|0)){break}else{O=249;break}}else{O=249}}while(0);if((O|0)==249){ax(5243976,151,5250036,5245804)}s=+g[B+84+(D<<3)>>2];t=+g[B+84+(D<<3)+4>>2];u=M*s-L*t;v=L*s+M*t;t=I*u+H*v;s=-0.0-H;w=I*v+u*s;L336:do{if((h|0)>0){O=0;u=3.4028234663852886e+38;f=0;while(1){v=t*+g[C+84+(O<<3)>>2]+w*+g[C+84+(O<<3)+4>>2];d=v<u;l=d?O:f;e=O+1|0;if((e|0)==(h|0)){P=l;break L336}else{O=e;u=d?v:u;f=l}}}else{P=0}}while(0);f=P+1|0;O=(f|0)<(h|0)?f:0;w=+g[C+20+(P<<3)>>2];t=+g[C+20+(P<<3)+4>>2];u=F+(I*w-H*t);v=G+(H*w+I*t);f=n;h=(g[k>>2]=u,c[k>>2]|0);l=(g[k>>2]=v,c[k>>2]|0)|0;c[f>>2]=0|h;c[f+4>>2]=l;l=D&255;f=n+8|0;h=f;a[f]=l;f=P&255;a[h+1|0]=f;a[h+2|0]=1;a[h+3|0]=0;h=n+12|0;t=+g[C+20+(O<<3)>>2];w=+g[C+20+(O<<3)+4>>2];x=F+(I*t-H*w);y=G+(H*t+I*w);C=h;P=(g[k>>2]=x,c[k>>2]|0);d=(g[k>>2]=y,c[k>>2]|0)|0;c[C>>2]=0|P;c[C+4>>2]=d;d=n+20|0;C=d;a[d]=l;a[C+1|0]=O&255;a[C+2|0]=1;a[C+3|0]=0;C=D+1|0;O=(C|0)<(c[B+148>>2]|0)?C:0;C=B+20+(D<<3)|0;D=c[C+4>>2]|0;w=(c[k>>2]=c[C>>2]|0,+g[k>>2]);t=(c[k>>2]=D,+g[k>>2]);D=B+20+(O<<3)|0;B=c[D+4>>2]|0;z=(c[k>>2]=c[D>>2]|0,+g[k>>2]);Q=(c[k>>2]=B,+g[k>>2]);R=z-w;S=Q-t;T=+N(R*R+S*S);if(T<1.1920928955078125e-7){U=R;V=S}else{W=1.0/T;U=R*W;V=S*W}W=M*U-L*V;S=M*V+L*U;R=W*-1.0;T=J+(M*w-L*t);X=K+(L*w+M*t);Y=T*S+X*R;Z=r-(T*W+X*S);X=r+((J+(M*z-L*Q))*W+(K+(L*z+M*Q))*S);M=-0.0-W;L=-0.0-S;K=u*M+v*L-Z;J=x*M+y*L-Z;if(K>0.0){_=0}else{B=o;D=n;c[B>>2]=c[D>>2]|0;c[B+4>>2]=c[D+4>>2]|0;c[B+8>>2]=c[D+8>>2]|0;_=1}if(J>0.0){$=_}else{D=o+(_*12&-1)|0;B=h;c[D>>2]=c[B>>2]|0;c[D+4>>2]=c[B+4>>2]|0;c[D+8>>2]=c[B+8>>2]|0;$=_+1|0}if(K*J<0.0){Z=K/(K-J);_=o+($*12&-1)|0;B=(g[k>>2]=u+Z*(x-u),c[k>>2]|0);D=(g[k>>2]=v+Z*(y-v),c[k>>2]|0)|0;c[_>>2]=0|B;c[_+4>>2]=D;D=o+($*12&-1)+8|0;_=D;a[D]=l;a[_+1|0]=f;a[_+2|0]=0;a[_+3|0]=1;aa=$+1|0}else{aa=$}if((aa|0)<2){i=j;return}v=+g[o>>2];y=+g[o+4>>2];Z=W*v+S*y-X;aa=o+12|0;u=+g[aa>>2];x=+g[o+16>>2];J=W*u+S*x-X;if(Z>0.0){ab=0}else{$=p;_=o;c[$>>2]=c[_>>2]|0;c[$+4>>2]=c[_+4>>2]|0;c[$+8>>2]=c[_+8>>2]|0;ab=1}if(J>0.0){ac=ab}else{_=p+(ab*12&-1)|0;$=aa;c[_>>2]=c[$>>2]|0;c[_+4>>2]=c[$+4>>2]|0;c[_+8>>2]=c[$+8>>2]|0;ac=ab+1|0}if(Z*J<0.0){X=Z/(Z-J);ab=p+(ac*12&-1)|0;$=(g[k>>2]=v+X*(u-v),c[k>>2]|0);_=(g[k>>2]=y+X*(x-y),c[k>>2]|0)|0;c[ab>>2]=0|$;c[ab+4>>2]=_;_=p+(ac*12&-1)+8|0;ab=_;a[_]=O&255;a[ab+1|0]=a[(o+8|0)+1|0]|0;a[ab+2|0]=0;a[ab+3|0]=1;ad=ac+1|0}else{ad=ac}if((ad|0)<2){i=j;return}ad=b+40|0;ac=(g[k>>2]=V,c[k>>2]|0);ab=(g[k>>2]=U*-1.0,c[k>>2]|0)|0;c[ad>>2]=0|ac;c[ad+4>>2]=ab;ab=b+48|0;ad=(g[k>>2]=(w+z)*.5,c[k>>2]|0);ac=(g[k>>2]=(t+Q)*.5,c[k>>2]|0)|0;c[ab>>2]=0|ad;c[ab+4>>2]=ac;Q=+g[p>>2];t=+g[p+4>>2];ac=S*Q+R*t-Y>r;do{if(E<<24>>24==0){if(ac){ae=0}else{z=Q-F;w=t-G;ab=b;ad=(g[k>>2]=I*z+H*w,c[k>>2]|0);o=(g[k>>2]=z*s+I*w,c[k>>2]|0)|0;c[ab>>2]=0|ad;c[ab+4>>2]=o;c[b+16>>2]=c[p+8>>2]|0;ae=1}w=+g[p+12>>2];z=+g[p+16>>2];if(S*w+R*z-Y>r){af=ae;break}U=w-F;w=z-G;o=b+(ae*20&-1)|0;ab=(g[k>>2]=I*U+H*w,c[k>>2]|0);ad=(g[k>>2]=U*s+I*w,c[k>>2]|0)|0;c[o>>2]=0|ab;c[o+4>>2]=ad;c[b+(ae*20&-1)+16>>2]=c[p+20>>2]|0;af=ae+1|0}else{if(ac){ag=0}else{w=Q-F;U=t-G;ad=b;o=(g[k>>2]=I*w+H*U,c[k>>2]|0);ab=(g[k>>2]=w*s+I*U,c[k>>2]|0)|0;c[ad>>2]=0|o;c[ad+4>>2]=ab;ab=b+16|0;ad=c[p+8>>2]|0;c[ab>>2]=ad;o=ab;a[ab]=ad>>>8&255;a[o+1|0]=ad&255;a[o+2|0]=ad>>>24&255;a[o+3|0]=ad>>>16&255;ag=1}U=+g[p+12>>2];w=+g[p+16>>2];if(S*U+R*w-Y>r){af=ag;break}z=U-F;U=w-G;ad=b+(ag*20&-1)|0;o=(g[k>>2]=I*z+H*U,c[k>>2]|0);ab=(g[k>>2]=z*s+I*U,c[k>>2]|0)|0;c[ad>>2]=0|o;c[ad+4>>2]=ab;ab=b+(ag*20&-1)+16|0;ad=c[p+20>>2]|0;c[ab>>2]=ad;o=ab;a[ab]=ad>>>8&255;a[o+1|0]=ad&255;a[o+2|0]=ad>>>24&255;a[o+3|0]=ad>>>16&255;af=ag+1|0}}while(0);c[q>>2]=af;i=j;return}function be(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0,A=0.0,B=0;h=c[b+148>>2]|0;i=+g[f+12>>2];j=+g[e+12>>2];k=+g[f+8>>2];l=+g[e+16>>2];m=+g[d+12>>2];n=+g[b+12>>2];o=+g[d+8>>2];p=+g[b+16>>2];q=+g[f>>2]+(i*j-k*l)-(+g[d>>2]+(m*n-o*p));r=j*k+i*l+ +g[f+4>>2]-(n*o+m*p+ +g[d+4>>2]);p=m*q+o*r;n=m*r+q*(-0.0-o);L381:do{if((h|0)>0){s=0;o=-3.4028234663852886e+38;t=0;while(1){q=p*+g[b+84+(s<<3)>>2]+n*+g[b+84+(s<<3)+4>>2];u=q>o;v=u?s:t;w=s+1|0;if((w|0)==(h|0)){x=v;break L381}else{s=w;o=u?q:o;t=v}}}else{x=0}}while(0);n=+bf(b,d,x,e,f);t=((x|0)>0?x:h)-1|0;p=+bf(b,d,t,e,f);s=x+1|0;v=(s|0)<(h|0)?s:0;o=+bf(b,d,v,e,f);if(p>n&p>o){q=p;s=t;while(1){t=((s|0)>0?s:h)-1|0;p=+bf(b,d,t,e,f);if(p>q){q=p;s=t}else{y=q;z=s;break}}c[a>>2]=z;return+y}if(o>n){A=o;B=v}else{y=n;z=x;c[a>>2]=z;return+y}while(1){x=B+1|0;v=(x|0)<(h|0)?x:0;n=+bf(b,d,v,e,f);if(n>A){A=n;B=v}else{y=A;z=B;break}}c[a>>2]=z;return+y}function bf(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0.0,u=0,v=0,w=0,x=0;h=c[e+148>>2]|0;do{if((d|0)>-1){if((c[a+148>>2]|0)>(d|0)){break}else{i=296;break}}else{i=296}}while(0);if((i|0)==296){ax(5243976,32,5250176,5245804)}j=+g[b+12>>2];k=+g[a+84+(d<<3)>>2];l=+g[b+8>>2];m=+g[a+84+(d<<3)+4>>2];n=j*k-l*m;o=k*l+j*m;m=+g[f+12>>2];k=+g[f+8>>2];p=m*n+k*o;q=m*o+n*(-0.0-k);L401:do{if((h|0)>0){i=0;r=3.4028234663852886e+38;s=0;while(1){t=p*+g[e+20+(i<<3)>>2]+q*+g[e+20+(i<<3)+4>>2];u=t<r;v=u?i:s;w=i+1|0;if((w|0)==(h|0)){x=v;break L401}else{i=w;r=u?t:r;s=v}}}else{x=0}}while(0);q=+g[a+20+(d<<3)>>2];p=+g[a+20+(d<<3)+4>>2];r=+g[e+20+(x<<3)>>2];t=+g[e+20+(x<<3)+4>>2];return+(n*(+g[f>>2]+(m*r-k*t)-(+g[b>>2]+(j*q-l*p)))+o*(r*k+m*t+ +g[f+4>>2]-(q*l+j*p+ +g[b+4>>2])))}function bg(a,b,d,e,f,h){a=a|0;b=b|0;d=d|0;e=+e;f=f|0;h=+h;var i=0,j=0,l=0,m=0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0,w=0,x=0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0,E=0,F=0,G=0,H=0.0,I=0.0;i=b+60|0;if((c[i>>2]|0)==0){return}j=c[b+56>>2]|0;if((j|0)==0){l=a|0;g[l>>2]=1.0;m=a+4|0;g[m>>2]=0.0;n=+g[d+12>>2];o=+g[b+48>>2];p=+g[d+8>>2];q=+g[b+52>>2];r=+g[d>>2]+(n*o-p*q);s=o*p+n*q+ +g[d+4>>2];q=+g[f+12>>2];n=+g[b>>2];p=+g[f+8>>2];o=+g[b+4>>2];t=+g[f>>2]+(q*n-p*o);u=n*p+q*o+ +g[f+4>>2];o=r-t;q=s-u;do{if(o*o+q*q>1.4210854715202004e-14){p=t-r;n=u-s;v=a;w=(g[k>>2]=p,c[k>>2]|0);x=(g[k>>2]=n,c[k>>2]|0)|0;c[v>>2]=0|w;c[v+4>>2]=x;y=+N(p*p+n*n);if(y<1.1920928955078125e-7){z=p;A=n;break}B=1.0/y;y=p*B;g[l>>2]=y;p=n*B;g[m>>2]=p;z=y;A=p}else{z=1.0;A=0.0}}while(0);m=a+8|0;l=(g[k>>2]=(r+z*e+(t-z*h))*.5,c[k>>2]|0);x=(g[k>>2]=(s+A*e+(u-A*h))*.5,c[k>>2]|0)|0;c[m>>2]=0|l;c[m+4>>2]=x;return}else if((j|0)==1){x=d+12|0;A=+g[x>>2];u=+g[b+40>>2];m=d+8|0;s=+g[m>>2];z=+g[b+44>>2];t=A*u-s*z;r=u*s+A*z;l=a;v=(g[k>>2]=t,c[k>>2]|0);w=(g[k>>2]=r,c[k>>2]|0)|0;c[l>>2]=0|v;c[l+4>>2]=w;z=+g[x>>2];A=+g[b+48>>2];s=+g[m>>2];u=+g[b+52>>2];q=+g[d>>2]+(z*A-s*u);o=A*s+z*u+ +g[d+4>>2];if((c[i>>2]|0)<=0){return}m=f+12|0;x=f+8|0;w=f|0;l=f+4|0;v=a|0;C=a+4|0;D=0;u=t;t=r;while(1){r=+g[m>>2];z=+g[b+(D*20&-1)>>2];s=+g[x>>2];A=+g[b+(D*20&-1)+4>>2];p=+g[w>>2]+(r*z-s*A);y=z*s+r*A+ +g[l>>2];A=e-(u*(p-q)+(y-o)*t);E=a+8+(D<<3)|0;F=(g[k>>2]=(p-u*h+(p+u*A))*.5,c[k>>2]|0);G=(g[k>>2]=(y-t*h+(y+t*A))*.5,c[k>>2]|0)|0;c[E>>2]=0|F;c[E+4>>2]=G;G=D+1|0;if((G|0)>=(c[i>>2]|0)){break}D=G;u=+g[v>>2];t=+g[C>>2]}return}else if((j|0)==2){j=f+12|0;t=+g[j>>2];u=+g[b+40>>2];C=f+8|0;o=+g[C>>2];q=+g[b+44>>2];A=t*u-o*q;y=u*o+t*q;v=a;D=(g[k>>2]=A,c[k>>2]|0);l=(g[k>>2]=y,c[k>>2]|0)|0;c[v>>2]=0|D;c[v+4>>2]=l;q=+g[j>>2];t=+g[b+48>>2];o=+g[C>>2];u=+g[b+52>>2];p=+g[f>>2]+(q*t-o*u);r=t*o+q*u+ +g[f+4>>2];L425:do{if((c[i>>2]|0)>0){f=d+12|0;C=d+8|0;j=d|0;l=d+4|0;D=a|0;w=a+4|0;x=0;u=A;q=y;while(1){o=+g[f>>2];t=+g[b+(x*20&-1)>>2];s=+g[C>>2];z=+g[b+(x*20&-1)+4>>2];B=+g[j>>2]+(o*t-s*z);n=t*s+o*z+ +g[l>>2];z=h-(u*(B-p)+(n-r)*q);m=a+8+(x<<3)|0;G=(g[k>>2]=(B-u*e+(B+u*z))*.5,c[k>>2]|0);E=(g[k>>2]=(n-q*e+(n+q*z))*.5,c[k>>2]|0)|0;c[m>>2]=0|G;c[m+4>>2]=E;E=x+1|0;z=+g[D>>2];n=+g[w>>2];if((E|0)<(c[i>>2]|0)){x=E;u=z;q=n}else{H=z;I=n;break L425}}}else{H=A;I=y}}while(0);i=(g[k>>2]=-0.0-H,c[k>>2]|0);a=(g[k>>2]=-0.0-I,c[k>>2]|0)|0;c[v>>2]=0|i;c[v+4>>2]=a;return}else{return}}function bh(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0;e=c[b+4>>2]|0;if((e|0)==2){c[a+16>>2]=b+20|0;c[a+20>>2]=c[b+148>>2]|0;g[a+24>>2]=+g[b+8>>2];return}else if((e|0)==0){c[a+16>>2]=b+12|0;c[a+20>>2]=1;g[a+24>>2]=+g[b+8>>2];return}else if((e|0)==3){f=b+16|0;do{if((d|0)>-1){if((c[f>>2]|0)>(d|0)){break}else{h=326;break}}else{h=326}}while(0);if((h|0)==326){ax(5243036,53,5249540,5245508)}h=b+12|0;i=(c[h>>2]|0)+(d<<3)|0;j=a;k=c[i+4>>2]|0;c[j>>2]=c[i>>2]|0;c[j+4>>2]=k;k=d+1|0;d=a+8|0;j=c[h>>2]|0;if((k|0)<(c[f>>2]|0)){f=j+(k<<3)|0;k=d;h=c[f+4>>2]|0;c[k>>2]=c[f>>2]|0;c[k+4>>2]=h}else{h=j;j=d;d=c[h+4>>2]|0;c[j>>2]=c[h>>2]|0;c[j+4>>2]=d}c[a+16>>2]=a|0;c[a+20>>2]=2;g[a+24>>2]=+g[b+8>>2];return}else if((e|0)==1){c[a+16>>2]=b+12|0;c[a+20>>2]=2;g[a+24>>2]=+g[b+8>>2];return}else{ax(5243036,81,5249540,5245900);return}}function bi(a){a=a|0;var b=0,d=0,e=0.0,f=0.0,h=0,i=0.0,j=0.0,l=0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0;b=a+16|0;d=c[b+4>>2]|0;e=(c[k>>2]=c[b>>2]|0,+g[k>>2]);f=(c[k>>2]=d,+g[k>>2]);d=a+36|0;b=a+52|0;h=c[b+4>>2]|0;i=(c[k>>2]=c[b>>2]|0,+g[k>>2]);j=(c[k>>2]=h,+g[k>>2]);h=a+72|0;b=a+88|0;l=c[b+4>>2]|0;m=(c[k>>2]=c[b>>2]|0,+g[k>>2]);n=(c[k>>2]=l,+g[k>>2]);o=i-e;p=j-f;q=e*o+f*p;r=i*o+j*p;s=m-e;t=n-f;u=e*s+f*t;v=m*s+n*t;w=m-i;x=n-j;y=i*w+j*x;z=m*w+n*x;x=o*t-p*s;s=(i*n-j*m)*x;p=(f*m-e*n)*x;n=(e*j-f*i)*x;if(!(q<-0.0|u<-0.0)){g[a+24>>2]=1.0;c[a+108>>2]=1;return}if(!(q>=-0.0|r<=0.0|n>0.0)){x=1.0/(r-q);g[a+24>>2]=r*x;g[a+60>>2]=x*(-0.0-q);c[a+108>>2]=2;return}if(!(u>=-0.0|v<=0.0|p>0.0)){q=1.0/(v-u);g[a+24>>2]=v*q;g[a+96>>2]=q*(-0.0-u);c[a+108>>2]=2;dh(d,h,36);return}if(!(r>0.0|y<-0.0)){g[a+60>>2]=1.0;c[a+108>>2]=1;dh(a,d,36);return}if(!(v>0.0|z>0.0)){g[a+96>>2]=1.0;c[a+108>>2]=1;dh(a,h,36);return}if(y>=-0.0|z<=0.0|s>0.0){v=1.0/(n+(s+p));g[a+24>>2]=s*v;g[a+60>>2]=p*v;g[a+96>>2]=n*v;c[a+108>>2]=3;return}else{v=1.0/(z-y);g[a+60>>2]=z*v;g[a+96>>2]=v*(-0.0-y);c[a+108>>2]=2;dh(a,h,36);return}}function bj(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,O=0,P=0,Q=0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0,Z=0,_=0,$=0.0,aa=0.0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0.0,at=0,au=0,av=0,aw=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0.0,aG=0.0,aH=0.0;h=i;i=i+168|0;j=h|0;l=h+16|0;m=h+32|0;n=h+144|0;o=h+156|0;c[1310733]=(c[1310733]|0)+1|0;p=j;q=f+56|0;c[p>>2]=c[q>>2]|0;c[p+4>>2]=c[q+4>>2]|0;c[p+8>>2]=c[q+8>>2]|0;c[p+12>>2]=c[q+12>>2]|0;q=l;p=f+72|0;c[q>>2]=c[p>>2]|0;c[q+4>>2]=c[p+4>>2]|0;c[q+8>>2]=c[p+8>>2]|0;c[q+12>>2]=c[p+12>>2]|0;bk(m,e,f|0,j,f+28|0,l);p=m|0;q=m+108|0;r=c[q>>2]|0;if((r|0)==0){ax(5243036,194,5247128,5245900)}else if(!((r|0)==1|(r|0)==2|(r|0)==3)){ax(5243036,207,5247128,5245900)}r=j+12|0;s=j+8|0;t=f+16|0;u=f+20|0;v=j|0;w=j+4|0;j=l+12|0;x=l+8|0;y=f+44|0;z=f+48|0;A=l|0;B=l+4|0;l=m+16|0;C=m+20|0;D=m+52|0;E=m+56|0;F=m+16|0;G=m+52|0;H=m+24|0;I=m+60|0;J=m;K=m+36|0;L=0;M=c[q>>2]|0;L484:while(1){O=(M|0)>0;L486:do{if(O){P=0;while(1){c[n+(P<<2)>>2]=c[p+(P*36&-1)+28>>2]|0;c[o+(P<<2)>>2]=c[p+(P*36&-1)+32>>2]|0;Q=P+1|0;if((Q|0)==(M|0)){break L486}else{P=Q}}}}while(0);do{if((M|0)==2){P=c[F+4>>2]|0;R=(c[k>>2]=c[F>>2]|0,+g[k>>2]);S=(c[k>>2]=P,+g[k>>2]);P=c[G+4>>2]|0;T=(c[k>>2]=c[G>>2]|0,+g[k>>2]);U=(c[k>>2]=P,+g[k>>2]);V=T-R;W=U-S;X=R*V+S*W;if(X>=-0.0){g[H>>2]=1.0;c[q>>2]=1;Y=379;break}S=T*V+U*W;if(S>0.0){W=1.0/(S-X);g[H>>2]=S*W;g[I>>2]=W*(-0.0-X);c[q>>2]=2;Y=380;break}else{g[I>>2]=1.0;c[q>>2]=1;dh(J,K,36);Y=374;break}}else if((M|0)==3){bi(m);Y=374;break}else if((M|0)==1){Y=377}else{ax(5243036,498,5250484,5245900);Y=374;break}}while(0);do{if((Y|0)==374){Y=0;P=c[q>>2]|0;if((P|0)==0){ax(5243036,194,5247128,5245900);Y=377;break}else if((P|0)==1|(P|0)==2){Z=P;Y=378;break}else if((P|0)==3){_=L;break L484}else{ax(5243036,207,5247128,5245900);Y=377;break}}}while(0);do{if((Y|0)==377){Y=0;Z=c[q>>2]|0;Y=378;break}}while(0);do{if((Y|0)==378){Y=0;if((Z|0)==1){Y=379;break}else if((Z|0)==2){Y=380;break}ax(5243036,184,5247020,5245900);P=5242944;Q=c[P+4>>2]|0;X=(c[k>>2]=c[P>>2]|0,+g[k>>2]);$=X;aa=(c[k>>2]=Q,+g[k>>2]);break}}while(0);do{if((Y|0)==379){Y=0;$=-0.0- +g[l>>2];aa=-0.0- +g[C>>2]}else if((Y|0)==380){Y=0;X=+g[l>>2];W=+g[D>>2]-X;S=+g[C>>2];U=+g[E>>2]-S;if(W*(-0.0-S)-U*(-0.0-X)>0.0){$=U*-1.0;aa=W;break}else{$=U;aa=W*-1.0;break}}}while(0);if(aa*aa+$*$<1.4210854715202004e-14){_=L;break}Q=c[q>>2]|0;P=p+(Q*36&-1)|0;W=-0.0-aa;U=+g[r>>2];X=+g[s>>2];S=U*(-0.0-$)+X*W;V=U*W+$*X;ab=c[t>>2]|0;ac=c[u>>2]|0;do{if((ac|0)>1){W=V*+g[ab+4>>2]+S*+g[ab>>2];ad=1;ae=0;while(1){T=S*+g[ab+(ad<<3)>>2]+V*+g[ab+(ad<<3)+4>>2];af=T>W;ag=af?ad:ae;ah=ad+1|0;if((ah|0)==(ac|0)){break}else{W=af?T:W;ad=ah;ae=ag}}ae=p+(Q*36&-1)+28|0;c[ae>>2]=ag;ad=P|0;if((ag|0)>-1){ai=ag;aj=ae;ak=ad;Y=390;break}else{al=ag;am=ae;an=ad;Y=391;break}}else{ad=p+(Q*36&-1)+28|0;c[ad>>2]=0;ai=0;aj=ad;ak=P|0;Y=390;break}}while(0);do{if((Y|0)==390){Y=0;if((ac|0)>(ai|0)){ao=ai;ap=aj;aq=ak;ar=ab;break}else{al=ai;am=aj;an=ak;Y=391;break}}}while(0);if((Y|0)==391){Y=0;ax(5244292,103,5247324,5243944);ao=al;ap=am;aq=an;ar=c[t>>2]|0}V=+g[ar+(ao<<3)>>2];S=+g[ar+(ao<<3)+4>>2];W=V*X+U*S+ +g[w>>2];ab=P;ac=(g[k>>2]=+g[v>>2]+(U*V-X*S),c[k>>2]|0);ad=(g[k>>2]=W,c[k>>2]|0)|0;c[ab>>2]=0|ac;c[ab+4>>2]=ad;W=+g[j>>2];S=+g[x>>2];V=$*W+aa*S;T=aa*W+$*(-0.0-S);ad=c[y>>2]|0;ab=c[z>>2]|0;do{if((ab|0)>1){R=T*+g[ad+4>>2]+V*+g[ad>>2];ac=1;ae=0;while(1){as=V*+g[ad+(ac<<3)>>2]+T*+g[ad+(ac<<3)+4>>2];ah=as>R;at=ah?ac:ae;af=ac+1|0;if((af|0)==(ab|0)){break}else{R=ah?as:R;ac=af;ae=at}}ae=p+(Q*36&-1)+32|0;c[ae>>2]=at;ac=p+(Q*36&-1)+8|0;if((at|0)>-1){au=at;av=ae;aw=ac;Y=397;break}else{ay=at;az=ae;aA=ac;Y=398;break}}else{ac=p+(Q*36&-1)+32|0;c[ac>>2]=0;au=0;av=ac;aw=p+(Q*36&-1)+8|0;Y=397;break}}while(0);do{if((Y|0)==397){Y=0;if((ab|0)>(au|0)){aB=au;aC=av;aD=aw;aE=ad;break}else{ay=au;az=av;aA=aw;Y=398;break}}}while(0);if((Y|0)==398){Y=0;ax(5244292,103,5247324,5243944);aB=ay;aC=az;aD=aA;aE=c[y>>2]|0}T=+g[aE+(aB<<3)>>2];V=+g[aE+(aB<<3)+4>>2];X=+g[A>>2]+(W*T-S*V);U=T*S+W*V+ +g[B>>2];ad=aD;ab=(g[k>>2]=X,c[k>>2]|0);P=(g[k>>2]=U,c[k>>2]|0)|0;c[ad>>2]=0|ab;c[ad+4>>2]=P;V=U- +g[aq+4>>2];P=p+(Q*36&-1)+16|0;ad=(g[k>>2]=X- +g[aq>>2],c[k>>2]|0);ab=(g[k>>2]=V,c[k>>2]|0)|0;c[P>>2]=0|ad;c[P+4>>2]=ab;ab=L+1|0;c[1310732]=(c[1310732]|0)+1|0;L540:do{if(O){P=c[ap>>2]|0;ad=0;while(1){if((P|0)==(c[n+(ad<<2)>>2]|0)){if((c[aC>>2]|0)==(c[o+(ad<<2)>>2]|0)){_=ab;break L484}}ac=ad+1|0;if((ac|0)<(M|0)){ad=ac}else{break L540}}}}while(0);O=(c[q>>2]|0)+1|0;c[q>>2]=O;if((ab|0)<20){L=ab;M=O}else{_=ab;break}}M=c[1310731]|0;c[1310731]=(M|0)>(_|0)?M:_;M=d+8|0;bl(m,d|0,M);L=d|0;o=M|0;$=+g[L>>2]- +g[o>>2];aC=d+4|0;n=d+12|0;aa=+g[aC>>2]- +g[n>>2];ap=d+16|0;g[ap>>2]=+N($*$+aa*aa);c[d+20>>2]=_;_=c[q>>2]|0;if((_|0)==0){ax(5243036,246,5246980,5245900);aF=0.0}else if((_|0)==2){aa=+g[l>>2]- +g[D>>2];$=+g[C>>2]- +g[E>>2];aF=+N(aa*aa+$*$)}else if((_|0)==3){$=+g[l>>2];aa=+g[C>>2];aF=(+g[D>>2]-$)*(+g[m+92>>2]-aa)-(+g[E>>2]-aa)*(+g[m+88>>2]-$)}else if((_|0)==1){aF=0.0}else{ax(5243036,259,5246980,5245900);aF=0.0}g[e>>2]=aF;_=c[q>>2]|0;b[e+4>>1]=_&65535;L555:do{if((_|0)>0){q=0;while(1){a[q+(e+6)|0]=c[p+(q*36&-1)+28>>2]&255;a[q+(e+9)|0]=c[p+(q*36&-1)+32>>2]&255;m=q+1|0;if((m|0)<(_|0)){q=m}else{break L555}}}}while(0);if((a[f+88|0]&1)<<24>>24==0){i=h;return}aF=+g[f+24>>2];$=+g[f+52>>2];aa=+g[ap>>2];W=aF+$;if(!(aa>W&aa>1.1920928955078125e-7)){S=(+g[aC>>2]+ +g[n>>2])*.5;f=d;d=(g[k>>2]=(+g[L>>2]+ +g[o>>2])*.5,c[k>>2]|0);_=0|d;d=(g[k>>2]=S,c[k>>2]|0)|0;c[f>>2]=_;c[f+4>>2]=d;f=M;c[f>>2]=_;c[f+4>>2]=d;g[ap>>2]=0.0;i=h;return}g[ap>>2]=aa-W;W=+g[o>>2];aa=+g[L>>2];S=W-aa;V=+g[n>>2];X=+g[aC>>2];U=V-X;T=+N(S*S+U*U);if(T<1.1920928955078125e-7){aG=S;aH=U}else{R=1.0/T;aG=S*R;aH=U*R}g[L>>2]=aF*aG+aa;g[aC>>2]=aF*aH+X;g[o>>2]=W-$*aG;g[n>>2]=V-$*aH;i=h;return}function bk(a,e,f,h,i,j){a=a|0;e=e|0;f=f|0;h=h|0;i=i|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0.0,J=0.0,K=0,L=0.0,M=0.0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0;l=e+4|0;m=b[l>>1]|0;if((m&65535)<4){n=m}else{ax(5243036,102,5247732,5243624);n=b[l>>1]|0}l=n&65535;m=a+108|0;c[m>>2]=l;o=a|0;L574:do{if(n<<16>>16==0){p=l}else{q=f+20|0;r=f+16|0;s=i+20|0;t=i+16|0;u=h+12|0;v=h+8|0;w=h|0;x=h+4|0;y=j+12|0;z=j+8|0;A=j|0;B=j+4|0;C=0;while(1){D=o+(C*36&-1)|0;E=d[C+(e+6)|0]|0;c[o+(C*36&-1)+28>>2]=E;F=d[C+(e+9)|0]|0;G=o+(C*36&-1)+32|0;c[G>>2]=F;if((c[q>>2]|0)>(E|0)){H=F}else{ax(5244292,103,5247324,5243944);H=c[G>>2]|0}G=(c[r>>2]|0)+(E<<3)|0;E=c[G+4>>2]|0;I=(c[k>>2]=c[G>>2]|0,+g[k>>2]);J=(c[k>>2]=E,+g[k>>2]);do{if((H|0)>-1){if((c[s>>2]|0)>(H|0)){break}else{K=430;break}}else{K=430}}while(0);if((K|0)==430){K=0;ax(5244292,103,5247324,5243944)}E=(c[t>>2]|0)+(H<<3)|0;G=c[E+4>>2]|0;L=(c[k>>2]=c[E>>2]|0,+g[k>>2]);M=(c[k>>2]=G,+g[k>>2]);O=+g[u>>2];P=+g[v>>2];Q=+g[w>>2]+(I*O-J*P);R=J*O+I*P+ +g[x>>2];G=D;E=(g[k>>2]=Q,c[k>>2]|0);F=(g[k>>2]=R,c[k>>2]|0)|0;c[G>>2]=0|E;c[G+4>>2]=F;R=+g[y>>2];P=+g[z>>2];O=+g[A>>2]+(L*R-M*P);S=M*R+L*P+ +g[B>>2];F=o+(C*36&-1)+8|0;G=(g[k>>2]=O,c[k>>2]|0);E=(g[k>>2]=S,c[k>>2]|0)|0;c[F>>2]=0|G;c[F+4>>2]=E;S=+g[o+(C*36&-1)+12>>2]- +g[o+(C*36&-1)+4>>2];E=o+(C*36&-1)+16|0;F=(g[k>>2]=O-Q,c[k>>2]|0);G=(g[k>>2]=S,c[k>>2]|0)|0;c[E>>2]=0|F;c[E+4>>2]=G;g[o+(C*36&-1)+24>>2]=0.0;G=C+1|0;E=c[m>>2]|0;if((G|0)<(E|0)){C=G}else{p=E;break L574}}}}while(0);L587:do{if((p|0)>1){S=+g[e>>2];if((p|0)==2){Q=+g[a+16>>2]- +g[a+52>>2];O=+g[a+20>>2]- +g[a+56>>2];T=+N(Q*Q+O*O)}else if((p|0)==3){O=+g[a+16>>2];Q=+g[a+20>>2];T=(+g[a+52>>2]-O)*(+g[a+92>>2]-Q)-(+g[a+56>>2]-Q)*(+g[a+88>>2]-O)}else{ax(5243036,259,5246980,5245900);T=0.0}do{if(T>=S*.5){if(S*2.0<T|T<1.1920928955078125e-7){break}U=c[m>>2]|0;K=441;break L587}}while(0);c[m>>2]=0;break}else{U=p;K=441}}while(0);do{if((K|0)==441){if((U|0)==0){break}return}}while(0);c[a+28>>2]=0;c[a+32>>2]=0;if((c[f+20>>2]|0)<=0){ax(5244292,103,5247324,5243944)}U=c[f+16>>2]|0;f=c[U+4>>2]|0;T=(c[k>>2]=c[U>>2]|0,+g[k>>2]);S=(c[k>>2]=f,+g[k>>2]);if((c[i+20>>2]|0)<=0){ax(5244292,103,5247324,5243944)}f=c[i+16>>2]|0;i=c[f+4>>2]|0;O=(c[k>>2]=c[f>>2]|0,+g[k>>2]);Q=(c[k>>2]=i,+g[k>>2]);P=+g[h+12>>2];L=+g[h+8>>2];R=+g[h>>2]+(T*P-S*L);M=S*P+T*L+ +g[h+4>>2];h=a;i=(g[k>>2]=R,c[k>>2]|0);f=(g[k>>2]=M,c[k>>2]|0)|0;c[h>>2]=0|i;c[h+4>>2]=f;L=+g[j+12>>2];T=+g[j+8>>2];P=+g[j>>2]+(O*L-Q*T);S=Q*L+O*T+ +g[j+4>>2];j=a+8|0;f=(g[k>>2]=P,c[k>>2]|0);h=(g[k>>2]=S,c[k>>2]|0)|0;c[j>>2]=0|f;c[j+4>>2]=h;h=a+16|0;a=(g[k>>2]=P-R,c[k>>2]|0);j=(g[k>>2]=S-M,c[k>>2]|0)|0;c[h>>2]=0|a;c[h+4>>2]=j;c[m>>2]=1;return}function bl(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0.0,l=0.0,m=0.0,n=0,o=0,p=0.0;e=c[a+108>>2]|0;if((e|0)==1){f=a;h=b;i=c[f+4>>2]|0;c[h>>2]=c[f>>2]|0;c[h+4>>2]=i;i=a+8|0;h=d;f=c[i+4>>2]|0;c[h>>2]=c[i>>2]|0;c[h+4>>2]=f;return}else if((e|0)==0){ax(5243036,217,5247068,5245900);return}else if((e|0)==2){f=a+24|0;j=+g[f>>2];h=a+60|0;l=+g[h>>2];m=j*+g[a+4>>2]+l*+g[a+40>>2];i=b;n=(g[k>>2]=j*+g[a>>2]+l*+g[a+36>>2],c[k>>2]|0);o=(g[k>>2]=m,c[k>>2]|0)|0;c[i>>2]=0|n;c[i+4>>2]=o;m=+g[f>>2];l=+g[h>>2];j=m*+g[a+12>>2]+l*+g[a+48>>2];h=d;f=(g[k>>2]=m*+g[a+8>>2]+l*+g[a+44>>2],c[k>>2]|0);o=(g[k>>2]=j,c[k>>2]|0)|0;c[h>>2]=0|f;c[h+4>>2]=o;return}else if((e|0)==3){j=+g[a+24>>2];l=+g[a+60>>2];m=+g[a+96>>2];p=j*+g[a+4>>2]+l*+g[a+40>>2]+m*+g[a+76>>2];e=b;b=(g[k>>2]=j*+g[a>>2]+l*+g[a+36>>2]+m*+g[a+72>>2],c[k>>2]|0);a=0|b;b=(g[k>>2]=p,c[k>>2]|0)|0;c[e>>2]=a;c[e+4>>2]=b;e=d;c[e>>2]=a;c[e+4>>2]=b;return}else{ax(5243036,236,5247068,5245900);return}}function bm(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;b=a+16|0;d=c[b>>2]|0;if((d|0)==-1){e=a+8|0;f=c[e>>2]|0;g=a+12|0;if((f|0)==(c[g>>2]|0)){h=f}else{ax(5245724,61,5249960,5246336);h=c[g>>2]|0}f=a+4|0;i=c[f>>2]|0;c[g>>2]=h<<1;j=dc(h*72&-1)|0;c[f>>2]=j;h=i;dh(j,h,(c[e>>2]|0)*36&-1);dd(h);h=c[e>>2]|0;j=(c[g>>2]|0)-1|0;L627:do{if((h|0)<(j|0)){i=h;while(1){k=i+1|0;c[(c[f>>2]|0)+(i*36&-1)+20>>2]=k;c[(c[f>>2]|0)+(i*36&-1)+32>>2]=-1;l=(c[g>>2]|0)-1|0;if((k|0)<(l|0)){i=k}else{m=l;break L627}}}else{m=j}}while(0);c[(c[f>>2]|0)+(m*36&-1)+20>>2]=-1;c[(c[f>>2]|0)+(((c[g>>2]|0)-1|0)*36&-1)+32>>2]=-1;g=c[e>>2]|0;c[b>>2]=g;n=g;o=f;p=e}else{n=d;o=a+4|0;p=a+8|0}a=(c[o>>2]|0)+(n*36&-1)+20|0;c[b>>2]=c[a>>2]|0;c[a>>2]=-1;c[(c[o>>2]|0)+(n*36&-1)+24>>2]=-1;c[(c[o>>2]|0)+(n*36&-1)+28>>2]=-1;c[(c[o>>2]|0)+(n*36&-1)+32>>2]=0;c[(c[o>>2]|0)+(n*36&-1)+16>>2]=0;c[p>>2]=(c[p>>2]|0)+1|0;return n|0}function bn(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0.0,j=0.0,l=0.0,m=0.0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0,G=0;d=a+24|0;c[d>>2]=(c[d>>2]|0)+1|0;d=a|0;e=c[d>>2]|0;if((e|0)==-1){c[d>>2]=b;c[(c[a+4>>2]|0)+(b*36&-1)+20>>2]=-1;return}f=a+4|0;h=c[f>>2]|0;i=+g[h+(b*36&-1)>>2];j=+g[h+(b*36&-1)+4>>2];l=+g[h+(b*36&-1)+8>>2];m=+g[h+(b*36&-1)+12>>2];n=c[h+(e*36&-1)+24>>2]|0;L638:do{if((n|0)==-1){o=e}else{p=e;q=n;while(1){r=c[h+(p*36&-1)+28>>2]|0;s=+g[h+(p*36&-1)+8>>2];t=+g[h+(p*36&-1)>>2];u=+g[h+(p*36&-1)+12>>2];v=+g[h+(p*36&-1)+4>>2];w=((s>l?s:l)-(t<i?t:i)+((u>m?u:m)-(v<j?v:j)))*2.0;x=w*2.0;y=(w-(s-t+(u-v))*2.0)*2.0;v=+g[h+(q*36&-1)>>2];u=i<v?i:v;t=+g[h+(q*36&-1)+4>>2];s=j<t?j:t;w=+g[h+(q*36&-1)+8>>2];z=l>w?l:w;A=+g[h+(q*36&-1)+12>>2];B=m>A?m:A;if((c[h+(q*36&-1)+24>>2]|0)==-1){C=(z-u+(B-s))*2.0}else{C=(z-u+(B-s))*2.0-(w-v+(A-t))*2.0}t=y+C;A=+g[h+(r*36&-1)>>2];v=i<A?i:A;w=+g[h+(r*36&-1)+4>>2];s=j<w?j:w;B=+g[h+(r*36&-1)+8>>2];u=l>B?l:B;z=+g[h+(r*36&-1)+12>>2];D=m>z?m:z;if((c[h+(r*36&-1)+24>>2]|0)==-1){E=(u-v+(D-s))*2.0}else{E=(u-v+(D-s))*2.0-(B-A+(z-w))*2.0}w=y+E;if(x<t&x<w){o=p;break L638}F=t<w?q:r;r=c[h+(F*36&-1)+24>>2]|0;if((r|0)==-1){o=F;break L638}else{p=F;q=r}}}}while(0);n=c[h+(o*36&-1)+20>>2]|0;h=bm(a)|0;c[(c[f>>2]|0)+(h*36&-1)+20>>2]=n;c[(c[f>>2]|0)+(h*36&-1)+16>>2]=0;e=c[f>>2]|0;E=+g[e+(o*36&-1)>>2];C=+g[e+(o*36&-1)+4>>2];q=e+(h*36&-1)|0;p=(g[k>>2]=i<E?i:E,c[k>>2]|0);r=(g[k>>2]=j<C?j:C,c[k>>2]|0)|0;c[q>>2]=0|p;c[q+4>>2]=r;C=+g[e+(o*36&-1)+8>>2];j=+g[e+(o*36&-1)+12>>2];r=e+(h*36&-1)+8|0;e=(g[k>>2]=l>C?l:C,c[k>>2]|0);q=(g[k>>2]=m>j?m:j,c[k>>2]|0)|0;c[r>>2]=0|e;c[r+4>>2]=q;q=c[f>>2]|0;c[q+(h*36&-1)+32>>2]=(c[q+(o*36&-1)+32>>2]|0)+1|0;q=c[f>>2]|0;if((n|0)==-1){c[q+(h*36&-1)+24>>2]=o;c[(c[f>>2]|0)+(h*36&-1)+28>>2]=b;c[(c[f>>2]|0)+(o*36&-1)+20>>2]=h;c[(c[f>>2]|0)+(b*36&-1)+20>>2]=h;c[d>>2]=h}else{d=q+(n*36&-1)+24|0;if((c[d>>2]|0)==(o|0)){c[d>>2]=h}else{c[q+(n*36&-1)+28>>2]=h}c[(c[f>>2]|0)+(h*36&-1)+24>>2]=o;c[(c[f>>2]|0)+(h*36&-1)+28>>2]=b;c[(c[f>>2]|0)+(o*36&-1)+20>>2]=h;c[(c[f>>2]|0)+(b*36&-1)+20>>2]=h}h=c[(c[f>>2]|0)+(b*36&-1)+20>>2]|0;if((h|0)==-1){return}else{G=h}while(1){h=bq(a,G)|0;b=c[f>>2]|0;o=c[b+(h*36&-1)+24>>2]|0;n=c[b+(h*36&-1)+28>>2]|0;if((o|0)==-1){ax(5245724,307,5249996,5243352)}if((n|0)==-1){ax(5245724,308,5249996,5243176)}b=c[f>>2]|0;q=c[b+(o*36&-1)+32>>2]|0;d=c[b+(n*36&-1)+32>>2]|0;c[b+(h*36&-1)+32>>2]=((q|0)>(d|0)?q:d)+1|0;d=c[f>>2]|0;j=+g[d+(o*36&-1)>>2];m=+g[d+(n*36&-1)>>2];C=+g[d+(o*36&-1)+4>>2];l=+g[d+(n*36&-1)+4>>2];q=d+(h*36&-1)|0;b=(g[k>>2]=j<m?j:m,c[k>>2]|0);r=(g[k>>2]=C<l?C:l,c[k>>2]|0)|0;c[q>>2]=0|b;c[q+4>>2]=r;l=+g[d+(o*36&-1)+8>>2];C=+g[d+(n*36&-1)+8>>2];m=+g[d+(o*36&-1)+12>>2];j=+g[d+(n*36&-1)+12>>2];n=d+(h*36&-1)+8|0;d=(g[k>>2]=l>C?l:C,c[k>>2]|0);o=(g[k>>2]=m>j?m:j,c[k>>2]|0)|0;c[n>>2]=0|d;c[n+4>>2]=o;o=c[(c[f>>2]|0)+(h*36&-1)+20>>2]|0;if((o|0)==-1){break}else{G=o}}return}function bo(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0,j=0,l=0,m=0,n=0.0,o=0.0,p=0.0,q=0.0;d=a|0;if((c[d>>2]|0)==(b|0)){c[d>>2]=-1;return}e=a+4|0;f=c[e>>2]|0;h=c[f+(b*36&-1)+20>>2]|0;i=c[f+(h*36&-1)+20>>2]|0;j=c[f+(h*36&-1)+24>>2]|0;if((j|0)==(b|0)){l=c[f+(h*36&-1)+28>>2]|0}else{l=j}if((i|0)==-1){c[d>>2]=l;c[f+(l*36&-1)+20>>2]=-1;do{if((h|0)>-1){if((c[a+12>>2]|0)>(h|0)){break}else{m=514;break}}else{m=514}}while(0);if((m|0)==514){ax(5245724,97,5249888,5245376)}d=a+8|0;if((c[d>>2]|0)<=0){ax(5245724,98,5249888,5244276)}j=a+16|0;c[(c[e>>2]|0)+(h*36&-1)+20>>2]=c[j>>2]|0;c[(c[e>>2]|0)+(h*36&-1)+32>>2]=-1;c[j>>2]=h;c[d>>2]=(c[d>>2]|0)-1|0;return}d=f+(i*36&-1)+24|0;if((c[d>>2]|0)==(h|0)){c[d>>2]=l}else{c[f+(i*36&-1)+28>>2]=l}c[(c[e>>2]|0)+(l*36&-1)+20>>2]=i;do{if((h|0)>-1){if((c[a+12>>2]|0)>(h|0)){break}else{m=507;break}}else{m=507}}while(0);if((m|0)==507){ax(5245724,97,5249888,5245376)}m=a+8|0;if((c[m>>2]|0)<=0){ax(5245724,98,5249888,5244276)}l=a+16|0;c[(c[e>>2]|0)+(h*36&-1)+20>>2]=c[l>>2]|0;c[(c[e>>2]|0)+(h*36&-1)+32>>2]=-1;c[l>>2]=h;c[m>>2]=(c[m>>2]|0)-1|0;m=i;while(1){i=bq(a,m)|0;h=c[e>>2]|0;l=c[h+(i*36&-1)+24>>2]|0;f=c[h+(i*36&-1)+28>>2]|0;n=+g[h+(l*36&-1)>>2];o=+g[h+(f*36&-1)>>2];p=+g[h+(l*36&-1)+4>>2];q=+g[h+(f*36&-1)+4>>2];d=h+(i*36&-1)|0;j=(g[k>>2]=n<o?n:o,c[k>>2]|0);b=(g[k>>2]=p<q?p:q,c[k>>2]|0)|0;c[d>>2]=0|j;c[d+4>>2]=b;q=+g[h+(l*36&-1)+8>>2];p=+g[h+(f*36&-1)+8>>2];o=+g[h+(l*36&-1)+12>>2];n=+g[h+(f*36&-1)+12>>2];b=h+(i*36&-1)+8|0;h=(g[k>>2]=q>p?q:p,c[k>>2]|0);d=(g[k>>2]=o>n?o:n,c[k>>2]|0)|0;c[b>>2]=0|h;c[b+4>>2]=d;d=c[e>>2]|0;b=c[d+(l*36&-1)+32>>2]|0;l=c[d+(f*36&-1)+32>>2]|0;c[d+(i*36&-1)+32>>2]=((b|0)>(l|0)?b:l)+1|0;l=c[(c[e>>2]|0)+(i*36&-1)+20>>2]|0;if((l|0)==-1){break}else{m=l}}return}function bp(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,i=0,j=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0;do{if((b|0)>-1){if((c[a+12>>2]|0)>(b|0)){break}else{f=524;break}}else{f=524}}while(0);if((f|0)==524){ax(5245724,135,5249816,5245416)}f=a+4|0;h=c[f>>2]|0;if((c[h+(b*36&-1)+24>>2]|0)==-1){i=h}else{ax(5245724,137,5249816,5243572);i=c[f>>2]|0}do{if(+g[i+(b*36&-1)>>2]<=+g[d>>2]){if(+g[i+(b*36&-1)+4>>2]>+g[d+4>>2]){break}if(+g[d+8>>2]>+g[i+(b*36&-1)+8>>2]){break}if(+g[d+12>>2]>+g[i+(b*36&-1)+12>>2]){break}else{j=0}return j|0}}while(0);bo(a,b);i=d;h=c[i+4>>2]|0;l=(c[k>>2]=c[i>>2]|0,+g[k>>2]);m=(c[k>>2]=h,+g[k>>2]);h=d+8|0;d=c[h+4>>2]|0;n=(c[k>>2]=c[h>>2]|0,+g[k>>2]);o=l+-.10000000149011612;l=m+-.10000000149011612;m=n+.10000000149011612;n=(c[k>>2]=d,+g[k>>2])+.10000000149011612;p=+g[e>>2]*2.0;q=+g[e+4>>2]*2.0;if(p<0.0){r=m;s=o+p}else{r=p+m;s=o}if(q<0.0){t=n;u=l+q}else{t=q+n;u=l}e=c[f>>2]|0;f=e+(b*36&-1)|0;d=(g[k>>2]=s,c[k>>2]|0);h=(g[k>>2]=u,c[k>>2]|0)|0;c[f>>2]=0|d;c[f+4>>2]=h;h=e+(b*36&-1)+8|0;e=(g[k>>2]=r,c[k>>2]|0);f=(g[k>>2]=t,c[k>>2]|0)|0;c[h>>2]=0|e;c[h+4>>2]=f;bn(a,b);j=1;return j|0}function bq(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0,M=0,N=0,O=0;if((b|0)==-1){ax(5245724,382,5249924,5243024)}d=a+4|0;e=c[d>>2]|0;f=e+(b*36&-1)|0;h=e+(b*36&-1)+24|0;i=c[h>>2]|0;if((i|0)==-1){j=b;return j|0}l=e+(b*36&-1)+32|0;if((c[l>>2]|0)<2){j=b;return j|0}m=e+(b*36&-1)+28|0;n=c[m>>2]|0;do{if((i|0)>-1){if((i|0)<(c[a+12>>2]|0)){break}else{o=547;break}}else{o=547}}while(0);if((o|0)==547){ax(5245724,392,5249924,5242952)}do{if((n|0)>-1){if((n|0)<(c[a+12>>2]|0)){break}else{o=550;break}}else{o=550}}while(0);if((o|0)==550){ax(5245724,393,5249924,5246420)}p=c[d>>2]|0;q=p+(i*36&-1)|0;r=p+(n*36&-1)|0;s=p+(n*36&-1)+32|0;t=p+(i*36&-1)+32|0;u=(c[s>>2]|0)-(c[t>>2]|0)|0;if((u|0)>1){v=p+(n*36&-1)+24|0;w=c[v>>2]|0;x=p+(n*36&-1)+28|0;y=c[x>>2]|0;z=p+(w*36&-1)|0;A=p+(y*36&-1)|0;do{if((w|0)>-1){if((w|0)<(c[a+12>>2]|0)){break}else{o=554;break}}else{o=554}}while(0);if((o|0)==554){ax(5245724,407,5249924,5246388)}do{if((y|0)>-1){if((y|0)<(c[a+12>>2]|0)){break}else{o=557;break}}else{o=557}}while(0);if((o|0)==557){ax(5245724,408,5249924,5246232)}c[v>>2]=b;v=e+(b*36&-1)+20|0;B=p+(n*36&-1)+20|0;c[B>>2]=c[v>>2]|0;c[v>>2]=n;v=c[B>>2]|0;do{if((v|0)==-1){c[a>>2]=n}else{C=c[d>>2]|0;D=C+(v*36&-1)+24|0;if((c[D>>2]|0)==(b|0)){c[D>>2]=n;break}if((c[C+(v*36&-1)+28>>2]|0)==(b|0)){E=v;F=C}else{ax(5245724,424,5249924,5245952);E=c[B>>2]|0;F=c[d>>2]|0}c[F+(E*36&-1)+28>>2]=n}}while(0);E=p+(w*36&-1)+32|0;F=p+(y*36&-1)+32|0;if((c[E>>2]|0)>(c[F>>2]|0)){c[x>>2]=w;c[m>>2]=y;c[p+(y*36&-1)+20>>2]=b;G=+g[q>>2];H=+g[A>>2];I=G<H?G:H;H=+g[p+(i*36&-1)+4>>2];G=+g[p+(y*36&-1)+4>>2];B=f;v=(g[k>>2]=I,c[k>>2]|0);C=(g[k>>2]=H<G?H:G,c[k>>2]|0)|0;c[B>>2]=0|v;c[B+4>>2]=C;G=+g[p+(i*36&-1)+8>>2];H=+g[p+(y*36&-1)+8>>2];J=+g[p+(i*36&-1)+12>>2];K=+g[p+(y*36&-1)+12>>2];C=e+(b*36&-1)+8|0;B=(g[k>>2]=G>H?G:H,c[k>>2]|0);v=(g[k>>2]=J>K?J:K,c[k>>2]|0)|0;c[C>>2]=0|B;c[C+4>>2]=v;K=+g[z>>2];J=+g[e+(b*36&-1)+4>>2];H=+g[p+(w*36&-1)+4>>2];v=r;C=(g[k>>2]=I<K?I:K,c[k>>2]|0);B=(g[k>>2]=J<H?J:H,c[k>>2]|0)|0;c[v>>2]=0|C;c[v+4>>2]=B;H=+g[e+(b*36&-1)+8>>2];J=+g[p+(w*36&-1)+8>>2];K=+g[e+(b*36&-1)+12>>2];I=+g[p+(w*36&-1)+12>>2];B=p+(n*36&-1)+8|0;v=(g[k>>2]=H>J?H:J,c[k>>2]|0);C=(g[k>>2]=K>I?K:I,c[k>>2]|0)|0;c[B>>2]=0|v;c[B+4>>2]=C;C=c[t>>2]|0;B=c[F>>2]|0;v=((C|0)>(B|0)?C:B)+1|0;c[l>>2]=v;B=c[E>>2]|0;L=(v|0)>(B|0)?v:B}else{c[x>>2]=y;c[m>>2]=w;c[p+(w*36&-1)+20>>2]=b;I=+g[q>>2];K=+g[z>>2];J=I<K?I:K;K=+g[p+(i*36&-1)+4>>2];I=+g[p+(w*36&-1)+4>>2];z=f;m=(g[k>>2]=J,c[k>>2]|0);x=(g[k>>2]=K<I?K:I,c[k>>2]|0)|0;c[z>>2]=0|m;c[z+4>>2]=x;I=+g[p+(i*36&-1)+8>>2];K=+g[p+(w*36&-1)+8>>2];H=+g[p+(i*36&-1)+12>>2];G=+g[p+(w*36&-1)+12>>2];w=e+(b*36&-1)+8|0;x=(g[k>>2]=I>K?I:K,c[k>>2]|0);z=(g[k>>2]=H>G?H:G,c[k>>2]|0)|0;c[w>>2]=0|x;c[w+4>>2]=z;G=+g[A>>2];H=+g[e+(b*36&-1)+4>>2];K=+g[p+(y*36&-1)+4>>2];A=r;z=(g[k>>2]=J<G?J:G,c[k>>2]|0);w=(g[k>>2]=H<K?H:K,c[k>>2]|0)|0;c[A>>2]=0|z;c[A+4>>2]=w;K=+g[e+(b*36&-1)+8>>2];H=+g[p+(y*36&-1)+8>>2];G=+g[e+(b*36&-1)+12>>2];J=+g[p+(y*36&-1)+12>>2];y=p+(n*36&-1)+8|0;w=(g[k>>2]=K>H?K:H,c[k>>2]|0);A=(g[k>>2]=G>J?G:J,c[k>>2]|0)|0;c[y>>2]=0|w;c[y+4>>2]=A;A=c[t>>2]|0;y=c[E>>2]|0;E=((A|0)>(y|0)?A:y)+1|0;c[l>>2]=E;y=c[F>>2]|0;L=(E|0)>(y|0)?E:y}c[s>>2]=L+1|0;j=n;return j|0}if((u|0)>=-1){j=b;return j|0}u=p+(i*36&-1)+24|0;L=c[u>>2]|0;y=p+(i*36&-1)+28|0;E=c[y>>2]|0;F=p+(L*36&-1)|0;A=p+(E*36&-1)|0;do{if((L|0)>-1){if((L|0)<(c[a+12>>2]|0)){break}else{o=572;break}}else{o=572}}while(0);if((o|0)==572){ax(5245724,467,5249924,5245848)}do{if((E|0)>-1){if((E|0)<(c[a+12>>2]|0)){break}else{o=575;break}}else{o=575}}while(0);if((o|0)==575){ax(5245724,468,5249924,5245772)}c[u>>2]=b;u=e+(b*36&-1)+20|0;o=p+(i*36&-1)+20|0;c[o>>2]=c[u>>2]|0;c[u>>2]=i;u=c[o>>2]|0;do{if((u|0)==-1){c[a>>2]=i}else{w=c[d>>2]|0;z=w+(u*36&-1)+24|0;if((c[z>>2]|0)==(b|0)){c[z>>2]=i;break}if((c[w+(u*36&-1)+28>>2]|0)==(b|0)){M=u;N=w}else{ax(5245724,484,5249924,5245692);M=c[o>>2]|0;N=c[d>>2]|0}c[N+(M*36&-1)+28>>2]=i}}while(0);M=p+(L*36&-1)+32|0;N=p+(E*36&-1)+32|0;if((c[M>>2]|0)>(c[N>>2]|0)){c[y>>2]=L;c[h>>2]=E;c[p+(E*36&-1)+20>>2]=b;J=+g[r>>2];G=+g[A>>2];H=J<G?J:G;G=+g[p+(n*36&-1)+4>>2];J=+g[p+(E*36&-1)+4>>2];d=f;o=(g[k>>2]=H,c[k>>2]|0);u=(g[k>>2]=G<J?G:J,c[k>>2]|0)|0;c[d>>2]=0|o;c[d+4>>2]=u;J=+g[p+(n*36&-1)+8>>2];G=+g[p+(E*36&-1)+8>>2];K=+g[p+(n*36&-1)+12>>2];I=+g[p+(E*36&-1)+12>>2];u=e+(b*36&-1)+8|0;d=(g[k>>2]=J>G?J:G,c[k>>2]|0);o=(g[k>>2]=K>I?K:I,c[k>>2]|0)|0;c[u>>2]=0|d;c[u+4>>2]=o;I=+g[F>>2];K=+g[e+(b*36&-1)+4>>2];G=+g[p+(L*36&-1)+4>>2];o=q;u=(g[k>>2]=H<I?H:I,c[k>>2]|0);d=(g[k>>2]=K<G?K:G,c[k>>2]|0)|0;c[o>>2]=0|u;c[o+4>>2]=d;G=+g[e+(b*36&-1)+8>>2];K=+g[p+(L*36&-1)+8>>2];I=+g[e+(b*36&-1)+12>>2];H=+g[p+(L*36&-1)+12>>2];d=p+(i*36&-1)+8|0;o=(g[k>>2]=G>K?G:K,c[k>>2]|0);u=(g[k>>2]=I>H?I:H,c[k>>2]|0)|0;c[d>>2]=0|o;c[d+4>>2]=u;u=c[s>>2]|0;d=c[N>>2]|0;o=((u|0)>(d|0)?u:d)+1|0;c[l>>2]=o;d=c[M>>2]|0;O=(o|0)>(d|0)?o:d}else{c[y>>2]=E;c[h>>2]=L;c[p+(L*36&-1)+20>>2]=b;H=+g[r>>2];I=+g[F>>2];K=H<I?H:I;I=+g[p+(n*36&-1)+4>>2];H=+g[p+(L*36&-1)+4>>2];F=f;f=(g[k>>2]=K,c[k>>2]|0);r=(g[k>>2]=I<H?I:H,c[k>>2]|0)|0;c[F>>2]=0|f;c[F+4>>2]=r;H=+g[p+(n*36&-1)+8>>2];I=+g[p+(L*36&-1)+8>>2];G=+g[p+(n*36&-1)+12>>2];J=+g[p+(L*36&-1)+12>>2];L=e+(b*36&-1)+8|0;n=(g[k>>2]=H>I?H:I,c[k>>2]|0);r=(g[k>>2]=G>J?G:J,c[k>>2]|0)|0;c[L>>2]=0|n;c[L+4>>2]=r;J=+g[A>>2];G=+g[e+(b*36&-1)+4>>2];I=+g[p+(E*36&-1)+4>>2];A=q;q=(g[k>>2]=K<J?K:J,c[k>>2]|0);r=(g[k>>2]=G<I?G:I,c[k>>2]|0)|0;c[A>>2]=0|q;c[A+4>>2]=r;I=+g[e+(b*36&-1)+8>>2];G=+g[p+(E*36&-1)+8>>2];J=+g[e+(b*36&-1)+12>>2];K=+g[p+(E*36&-1)+12>>2];E=p+(i*36&-1)+8|0;p=(g[k>>2]=I>G?I:G,c[k>>2]|0);b=(g[k>>2]=J>K?J:K,c[k>>2]|0)|0;c[E>>2]=0|p;c[E+4>>2]=b;b=c[s>>2]|0;s=c[M>>2]|0;M=((b|0)>(s|0)?b:s)+1|0;c[l>>2]=M;l=c[N>>2]|0;O=(M|0)>(l|0)?M:l}c[t>>2]=O+1|0;j=i;return j|0}function br(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0.0,y=0.0,z=0,A=0,B=0.0,C=0.0,D=0,E=0.0,F=0.0,G=0,H=0,I=0,J=0,K=0,M=0,N=0,O=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0.0,$=0.0,aa=0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0.0,ag=0.0,ah=0.0,ai=0.0,aj=0.0,ak=0.0,al=0.0,am=0.0,an=0,ao=0,ap=0,aq=0.0,ar=0,as=0.0,at=0.0,au=0,av=0.0,aw=0.0,ay=0.0,az=0.0,aA=0,aB=0.0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0;f=i;i=i+308|0;h=f|0;j=f+36|0;l=f+72|0;m=f+84|0;n=f+176|0;o=f+200|0;p=f+300|0;q=f+304|0;c[1310730]=(c[1310730]|0)+1|0;r=d|0;c[r>>2]=0;s=e+128|0;t=d+4|0;g[t>>2]=+g[s>>2];d=e|0;u=e+28|0;dh(h,e+56|0,36);dh(j,e+92|0,36);v=h+24|0;w=+g[v>>2];x=+L(w/6.2831854820251465)*6.2831854820251465;y=w-x;g[v>>2]=y;z=h+28|0;w=+g[z>>2]-x;g[z>>2]=w;A=j+24|0;x=+g[A>>2];B=+L(x/6.2831854820251465)*6.2831854820251465;C=x-B;g[A>>2]=C;D=j+28|0;x=+g[D>>2]-B;g[D>>2]=x;B=+g[s>>2];E=+g[e+24>>2]+ +g[e+52>>2]+-.014999999664723873;F=E<.004999999888241291?.004999999888241291:E;if(F<=.0012499999720603228){ax(5244124,280,5250428,5245880)}b[l+4>>1]=0;s=m;G=e;c[s>>2]=c[G>>2]|0;c[s+4>>2]=c[G+4>>2]|0;c[s+8>>2]=c[G+8>>2]|0;c[s+12>>2]=c[G+12>>2]|0;c[s+16>>2]=c[G+16>>2]|0;c[s+20>>2]=c[G+20>>2]|0;c[s+24>>2]=c[G+24>>2]|0;G=m+28|0;s=u;c[G>>2]=c[s>>2]|0;c[G+4>>2]=c[s+4>>2]|0;c[G+8>>2]=c[s+8>>2]|0;c[G+12>>2]=c[s+12>>2]|0;c[G+16>>2]=c[s+16>>2]|0;c[G+20>>2]=c[s+20>>2]|0;c[G+24>>2]=c[s+24>>2]|0;a[m+88|0]=0;s=h+8|0;G=h+12|0;e=h+16|0;H=h+20|0;I=h|0;J=h+4|0;K=j+8|0;M=j+12|0;N=j+16|0;O=j+20|0;R=j|0;S=j+4|0;T=m+56|0;U=m+64|0;V=m+68|0;W=m+72|0;X=m+80|0;Y=m+84|0;Z=n+16|0;E=F+.0012499999720603228;_=F+-.0012499999720603228;$=0.0;aa=0;ab=y;y=w;w=C;C=x;L809:while(1){x=1.0-$;ac=x*+g[s>>2]+$*+g[e>>2];ad=x*+g[G>>2]+$*+g[H>>2];ae=x*ab+$*y;af=+Q(ae);ag=+P(ae);ae=+g[I>>2];ah=+g[J>>2];ai=x*+g[K>>2]+$*+g[N>>2];aj=x*+g[M>>2]+$*+g[O>>2];ak=x*w+$*C;x=+Q(ak);al=+P(ak);ak=+g[R>>2];am=+g[S>>2];an=(g[k>>2]=ac-(ag*ae-af*ah),c[k>>2]|0);ao=(g[k>>2]=ad-(af*ae+ag*ah),c[k>>2]|0)|0;c[T>>2]=0|an;c[T+4>>2]=ao;g[U>>2]=af;g[V>>2]=ag;ao=(g[k>>2]=ai-(al*ak-x*am),c[k>>2]|0);an=(g[k>>2]=aj-(x*ak+al*am),c[k>>2]|0)|0;c[W>>2]=0|ao;c[W+4>>2]=an;g[X>>2]=x;g[Y>>2]=al;bj(n,l,m);al=+g[Z>>2];if(al<=0.0){ap=597;break}if(al<E){ap=599;break}bs(o,l,d,h,u,j,$);an=0;al=B;while(1){x=+bv(o,p,q,al);if(x>E){ap=602;break L809}if(x>_){aq=al;break}ao=c[p>>2]|0;ar=c[q>>2]|0;am=+bw(o,ao,ar,$);if(am<_){ap=605;break L809}if(am>E){as=al;at=$;au=0;av=am;aw=x}else{ap=607;break L809}while(1){if((au&1|0)==0){ay=(at+as)*.5}else{ay=at+(F-av)*(as-at)/(aw-av)}x=+bw(o,ao,ar,ay);am=x-F;if(am>0.0){az=am}else{az=-0.0-am}if(az<.0012499999720603228){aA=au;aB=ay;break}aC=x>F;aD=au+1|0;c[1310726]=(c[1310726]|0)+1|0;if((aD|0)==50){aA=50;aB=al;break}else{as=aC?as:ay;at=aC?ay:at;au=aD;av=aC?x:av;aw=aC?aw:x}}ar=c[1310727]|0;c[1310727]=(ar|0)>(aA|0)?ar:aA;ar=an+1|0;if((ar|0)==8){aq=$;break}else{an=ar;al=aB}}an=aa+1|0;c[1310729]=(c[1310729]|0)+1|0;if((an|0)==20){ap=619;break}$=aq;aa=an;ab=+g[v>>2];y=+g[z>>2];w=+g[A>>2];C=+g[D>>2]}if((ap|0)==597){c[r>>2]=2;g[t>>2]=0.0;aE=aa;aF=c[1310728]|0;aG=(aF|0)>(aE|0);aH=aG?aF:aE;c[1310728]=aH;i=f;return}else if((ap|0)==605){c[r>>2]=1;g[t>>2]=$}else if((ap|0)==607){c[r>>2]=3;g[t>>2]=$}else if((ap|0)==619){c[r>>2]=1;g[t>>2]=aq;aE=20;aF=c[1310728]|0;aG=(aF|0)>(aE|0);aH=aG?aF:aE;c[1310728]=aH;i=f;return}else if((ap|0)==599){c[r>>2]=3;g[t>>2]=$;aE=aa;aF=c[1310728]|0;aG=(aF|0)>(aE|0);aH=aG?aF:aE;c[1310728]=aH;i=f;return}else if((ap|0)==602){c[r>>2]=4;g[t>>2]=B}c[1310729]=(c[1310729]|0)+1|0;aE=aa+1|0;aF=c[1310728]|0;aG=(aF|0)>(aE|0);aH=aG?aF:aE;c[1310728]=aH;i=f;return}function bs(e,f,h,i,j,l,m){e=e|0;f=f|0;h=h|0;i=i|0;j=j|0;l=l|0;m=+m;var n=0,o=0,p=0,q=0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0,G=0,H=0,I=0,J=0.0,K=0.0,L=0.0,M=0.0,O=0,R=0,S=0.0,T=0.0;n=e|0;c[n>>2]=h;o=e+4|0;c[o>>2]=j;p=b[f+4>>1]|0;if(!(p<<16>>16!=0&(p&65535)<3)){ax(5244124,50,5249076,5243528)}q=e+8|0;dh(q,i,36);i=e+44|0;dh(i,l,36);r=1.0-m;s=r*+g[e+16>>2]+ +g[e+24>>2]*m;t=r*+g[e+20>>2]+ +g[e+28>>2]*m;u=r*+g[e+32>>2]+ +g[e+36>>2]*m;v=+Q(u);w=+P(u);u=+g[q>>2];x=+g[e+12>>2];y=s-(w*u-v*x);s=t-(v*u+w*x);x=r*+g[e+52>>2]+ +g[e+60>>2]*m;u=r*+g[e+56>>2]+ +g[e+64>>2]*m;t=r*+g[e+68>>2]+ +g[e+72>>2]*m;m=+Q(t);r=+P(t);t=+g[i>>2];z=+g[e+48>>2];A=x-(r*t-m*z);x=u-(m*t+r*z);if(p<<16>>16==1){c[e+80>>2]=0;p=c[n>>2]|0;i=d[f+6|0]|0;if((c[p+20>>2]|0)<=(i|0)){ax(5244292,103,5247324,5243944)}q=(c[p+16>>2]|0)+(i<<3)|0;i=c[q+4>>2]|0;z=(c[k>>2]=c[q>>2]|0,+g[k>>2]);t=(c[k>>2]=i,+g[k>>2]);i=c[o>>2]|0;q=d[f+9|0]|0;if((c[i+20>>2]|0)<=(q|0)){ax(5244292,103,5247324,5243944)}p=(c[i+16>>2]|0)+(q<<3)|0;q=c[p+4>>2]|0;u=(c[k>>2]=c[p>>2]|0,+g[k>>2]);B=(c[k>>2]=q,+g[k>>2]);q=e+92|0;C=A+(r*u-m*B)-(y+(w*z-v*t));D=x+(m*u+r*B)-(s+(v*z+w*t));p=q;i=(g[k>>2]=C,c[k>>2]|0);l=(g[k>>2]=D,c[k>>2]|0)|0;c[p>>2]=0|i;c[p+4>>2]=l;t=+N(C*C+D*D);if(t<1.1920928955078125e-7){E=0.0;return+E}z=1.0/t;g[q>>2]=C*z;g[e+96>>2]=D*z;E=t;return+E}q=f+6|0;l=f+7|0;p=e+80|0;if(a[q]<<24>>24==a[l]<<24>>24){c[p>>2]=2;i=d[f+9|0]|0;F=j+20|0;G=c[F>>2]|0;if((G|0)>(i|0)){H=G}else{ax(5244292,103,5247324,5243944);H=c[F>>2]|0}F=j+16|0;j=c[F>>2]|0;G=j+(i<<3)|0;i=c[G+4>>2]|0;t=(c[k>>2]=c[G>>2]|0,+g[k>>2]);z=(c[k>>2]=i,+g[k>>2]);i=d[f+10|0]|0;if((H|0)>(i|0)){I=j}else{ax(5244292,103,5247324,5243944);I=c[F>>2]|0}F=I+(i<<3)|0;i=c[F+4>>2]|0;D=(c[k>>2]=c[F>>2]|0,+g[k>>2]);C=(c[k>>2]=i,+g[k>>2]);i=e+92|0;B=C-z;u=(D-t)*-1.0;F=i;I=(g[k>>2]=B,c[k>>2]|0);j=(g[k>>2]=u,c[k>>2]|0)|0;c[F>>2]=0|I;c[F+4>>2]=j;j=i|0;i=e+96|0;J=+N(B*B+u*u);if(J<1.1920928955078125e-7){K=B;L=u}else{M=1.0/J;J=B*M;g[j>>2]=J;B=u*M;g[i>>2]=B;K=J;L=B}B=(t+D)*.5;D=(z+C)*.5;I=e+84|0;H=(g[k>>2]=B,c[k>>2]|0);G=(g[k>>2]=D,c[k>>2]|0)|0;c[I>>2]=0|H;c[I+4>>2]=G;G=d[q]|0;if((c[h+20>>2]|0)<=(G|0)){ax(5244292,103,5247324,5243944)}I=(c[h+16>>2]|0)+(G<<3)|0;G=c[I+4>>2]|0;C=(c[k>>2]=c[I>>2]|0,+g[k>>2]);z=(c[k>>2]=G,+g[k>>2]);t=(r*K-m*L)*(y+(w*C-v*z)-(A+(r*B-m*D)))+(m*K+r*L)*(s+(v*C+w*z)-(x+(m*B+r*D)));if(t>=0.0){E=t;return+E}D=-0.0- +g[i>>2];i=(g[k>>2]=-0.0- +g[j>>2],c[k>>2]|0);j=(g[k>>2]=D,c[k>>2]|0)|0;c[F>>2]=0|i;c[F+4>>2]=j;E=-0.0-t;return+E}else{c[p>>2]=1;p=c[n>>2]|0;j=d[q]|0;q=c[p+20>>2]|0;if((q|0)>(j|0)){O=p;R=q}else{ax(5244292,103,5247324,5243944);q=c[n>>2]|0;O=q;R=c[q+20>>2]|0}q=(c[p+16>>2]|0)+(j<<3)|0;j=c[q+4>>2]|0;t=(c[k>>2]=c[q>>2]|0,+g[k>>2]);D=(c[k>>2]=j,+g[k>>2]);j=d[l]|0;if((R|0)<=(j|0)){ax(5244292,103,5247324,5243944)}R=(c[O+16>>2]|0)+(j<<3)|0;j=c[R+4>>2]|0;B=(c[k>>2]=c[R>>2]|0,+g[k>>2]);z=(c[k>>2]=j,+g[k>>2]);j=e+92|0;C=z-D;L=(B-t)*-1.0;R=j;O=(g[k>>2]=C,c[k>>2]|0);l=(g[k>>2]=L,c[k>>2]|0)|0;c[R>>2]=0|O;c[R+4>>2]=l;l=j|0;j=e+96|0;K=+N(C*C+L*L);if(K<1.1920928955078125e-7){S=C;T=L}else{J=1.0/K;K=C*J;g[l>>2]=K;C=L*J;g[j>>2]=C;S=K;T=C}C=(t+B)*.5;B=(D+z)*.5;O=e+84|0;e=(g[k>>2]=C,c[k>>2]|0);q=(g[k>>2]=B,c[k>>2]|0)|0;c[O>>2]=0|e;c[O+4>>2]=q;q=c[o>>2]|0;o=d[f+9|0]|0;if((c[q+20>>2]|0)<=(o|0)){ax(5244292,103,5247324,5243944)}f=(c[q+16>>2]|0)+(o<<3)|0;o=c[f+4>>2]|0;z=(c[k>>2]=c[f>>2]|0,+g[k>>2]);D=(c[k>>2]=o,+g[k>>2]);t=(w*S-v*T)*(A+(r*z-m*D)-(y+(w*C-v*B)))+(v*S+w*T)*(x+(m*z+r*D)-(s+(v*C+w*B)));if(t>=0.0){E=t;return+E}B=-0.0- +g[j>>2];j=(g[k>>2]=-0.0- +g[l>>2],c[k>>2]|0);l=(g[k>>2]=B,c[k>>2]|0)|0;c[R>>2]=0|j;c[R+4>>2]=l;E=-0.0-t;return+E}return 0.0}function bt(a){a=a|0;return 1}function bu(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function bv(a,b,d,e){a=a|0;b=b|0;d=d|0;e=+e;var f=0.0,h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0.0,t=0.0,u=0.0,v=0.0,w=0,x=0,y=0,z=0,A=0,B=0.0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0.0,N=0,O=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0;f=1.0-e;h=f*+g[a+16>>2]+ +g[a+24>>2]*e;i=f*+g[a+20>>2]+ +g[a+28>>2]*e;j=f*+g[a+32>>2]+ +g[a+36>>2]*e;l=+Q(j);m=+P(j);j=+g[a+8>>2];n=+g[a+12>>2];o=h-(m*j-l*n);h=i-(l*j+m*n);n=f*+g[a+52>>2]+ +g[a+60>>2]*e;j=f*+g[a+56>>2]+ +g[a+64>>2]*e;i=f*+g[a+68>>2]+ +g[a+72>>2]*e;e=+Q(i);f=+P(i);i=+g[a+44>>2];p=+g[a+48>>2];q=n-(f*i-e*p);n=j-(e*i+f*p);r=c[a+80>>2]|0;if((r|0)==1){p=+g[a+92>>2];i=+g[a+96>>2];j=m*p-l*i;s=l*p+m*i;i=+g[a+84>>2];p=+g[a+88>>2];t=o+(m*i-l*p);u=h+(l*i+m*p);p=-0.0-s;i=f*(-0.0-j)+e*p;v=e*j+f*p;c[b>>2]=-1;w=a+4|0;x=c[w>>2]|0;y=c[x+16>>2]|0;z=c[x+20>>2]|0;do{if((z|0)>1){p=v*+g[y+4>>2]+i*+g[y>>2];x=1;A=0;while(1){B=i*+g[y+(x<<3)>>2]+v*+g[y+(x<<3)+4>>2];C=B>p;D=C?x:A;E=x+1|0;if((E|0)==(z|0)){break}else{p=C?B:p;x=E;A=D}}c[d>>2]=D;A=c[w>>2]|0;if((D|0)>-1){F=D;G=A;H=683;break}else{I=D;J=A;H=684;break}}else{c[d>>2]=0;F=0;G=c[w>>2]|0;H=683;break}}while(0);do{if((H|0)==683){if((c[G+20>>2]|0)>(F|0)){K=F;L=G;break}else{I=F;J=G;H=684;break}}}while(0);if((H|0)==684){ax(5244292,103,5247324,5243944);K=I;L=J}J=(c[L+16>>2]|0)+(K<<3)|0;K=c[J+4>>2]|0;v=(c[k>>2]=c[J>>2]|0,+g[k>>2]);i=(c[k>>2]=K,+g[k>>2]);p=j*(q+(f*v-e*i)-t)+s*(n+(e*v+f*i)-u);return+p}else if((r|0)==2){u=+g[a+92>>2];i=+g[a+96>>2];v=f*u-e*i;s=e*u+f*i;i=+g[a+84>>2];u=+g[a+88>>2];t=q+(f*i-e*u);j=n+(e*i+f*u);u=-0.0-s;i=m*(-0.0-v)+l*u;B=l*v+m*u;c[d>>2]=-1;K=a|0;J=c[K>>2]|0;L=c[J+16>>2]|0;I=c[J+20>>2]|0;do{if((I|0)>1){u=B*+g[L+4>>2]+i*+g[L>>2];J=1;G=0;while(1){M=i*+g[L+(J<<3)>>2]+B*+g[L+(J<<3)+4>>2];F=M>u;N=F?J:G;w=J+1|0;if((w|0)==(I|0)){break}else{u=F?M:u;J=w;G=N}}c[b>>2]=N;G=c[K>>2]|0;if((N|0)>-1){O=N;R=G;H=691;break}else{S=N;T=G;H=692;break}}else{c[b>>2]=0;O=0;R=c[K>>2]|0;H=691;break}}while(0);do{if((H|0)==691){if((c[R+20>>2]|0)>(O|0)){U=O;V=R;break}else{S=O;T=R;H=692;break}}}while(0);if((H|0)==692){ax(5244292,103,5247324,5243944);U=S;V=T}T=(c[V+16>>2]|0)+(U<<3)|0;U=c[T+4>>2]|0;B=(c[k>>2]=c[T>>2]|0,+g[k>>2]);i=(c[k>>2]=U,+g[k>>2]);p=v*(o+(m*B-l*i)-t)+s*(h+(l*B+m*i)-j);return+p}else if((r|0)==0){r=a+92|0;j=+g[r>>2];U=a+96|0;i=+g[U>>2];B=m*j+l*i;s=j*(-0.0-l)+m*i;t=-0.0-i;i=f*(-0.0-j)+e*t;v=e*j+f*t;T=a|0;V=c[T>>2]|0;S=c[V+16>>2]|0;R=c[V+20>>2]|0;L928:do{if((R|0)>1){t=s*+g[S+4>>2]+B*+g[S>>2];V=1;O=0;while(1){j=B*+g[S+(V<<3)>>2]+s*+g[S+(V<<3)+4>>2];K=j>t;N=K?V:O;I=V+1|0;if((I|0)==(R|0)){W=N;break L928}else{t=K?j:t;V=I;O=N}}}else{W=0}}while(0);c[b>>2]=W;W=a+4|0;a=c[W>>2]|0;R=c[a+16>>2]|0;S=c[a+20>>2]|0;L933:do{if((S|0)>1){s=v*+g[R+4>>2]+i*+g[R>>2];a=1;O=0;while(1){B=i*+g[R+(a<<3)>>2]+v*+g[R+(a<<3)+4>>2];V=B>s;N=V?a:O;I=a+1|0;if((I|0)==(S|0)){X=N;break L933}else{s=V?B:s;a=I;O=N}}}else{X=0}}while(0);c[d>>2]=X;S=c[T>>2]|0;T=c[b>>2]|0;do{if((T|0)>-1){if((c[S+20>>2]|0)>(T|0)){Y=X;break}else{H=673;break}}else{H=673}}while(0);if((H|0)==673){ax(5244292,103,5247324,5243944);Y=c[d>>2]|0}X=(c[S+16>>2]|0)+(T<<3)|0;T=c[X+4>>2]|0;v=(c[k>>2]=c[X>>2]|0,+g[k>>2]);i=(c[k>>2]=T,+g[k>>2]);T=c[W>>2]|0;do{if((Y|0)>-1){if((c[T+20>>2]|0)>(Y|0)){break}else{H=676;break}}else{H=676}}while(0);if((H|0)==676){ax(5244292,103,5247324,5243944)}H=(c[T+16>>2]|0)+(Y<<3)|0;Y=c[H+4>>2]|0;s=(c[k>>2]=c[H>>2]|0,+g[k>>2]);B=(c[k>>2]=Y,+g[k>>2]);p=+g[r>>2]*(q+(f*s-e*B)-(o+(m*v-l*i)))+ +g[U>>2]*(n+(e*s+f*B)-(h+(l*v+m*i)));return+p}else{ax(5244124,183,5247240,5245900);c[b>>2]=-1;c[d>>2]=-1;p=0.0;return+p}return 0.0}function bw(a,b,d,e){a=a|0;b=b|0;d=d|0;e=+e;var f=0.0,h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0,v=0,w=0,x=0.0,y=0.0,z=0.0,A=0.0;f=1.0-e;h=f*+g[a+16>>2]+ +g[a+24>>2]*e;i=f*+g[a+20>>2]+ +g[a+28>>2]*e;j=f*+g[a+32>>2]+ +g[a+36>>2]*e;l=+Q(j);m=+P(j);j=+g[a+8>>2];n=+g[a+12>>2];o=h-(m*j-l*n);h=i-(l*j+m*n);n=f*+g[a+52>>2]+ +g[a+60>>2]*e;j=f*+g[a+56>>2]+ +g[a+64>>2]*e;i=f*+g[a+68>>2]+ +g[a+72>>2]*e;e=+Q(i);f=+P(i);i=+g[a+44>>2];p=+g[a+48>>2];q=n-(f*i-e*p);n=j-(e*i+f*p);r=c[a+80>>2]|0;if((r|0)==0){s=a+92|0;t=a+96|0;u=c[a>>2]|0;do{if((b|0)>-1){if((c[u+20>>2]|0)>(b|0)){break}else{v=703;break}}else{v=703}}while(0);if((v|0)==703){ax(5244292,103,5247324,5243944)}w=(c[u+16>>2]|0)+(b<<3)|0;u=c[w+4>>2]|0;p=(c[k>>2]=c[w>>2]|0,+g[k>>2]);i=(c[k>>2]=u,+g[k>>2]);u=c[a+4>>2]|0;do{if((d|0)>-1){if((c[u+20>>2]|0)>(d|0)){break}else{v=706;break}}else{v=706}}while(0);if((v|0)==706){ax(5244292,103,5247324,5243944)}w=(c[u+16>>2]|0)+(d<<3)|0;u=c[w+4>>2]|0;j=(c[k>>2]=c[w>>2]|0,+g[k>>2]);x=(c[k>>2]=u,+g[k>>2]);y=+g[s>>2]*(q+(f*j-e*x)-(o+(m*p-l*i)))+ +g[t>>2]*(n+(e*j+f*x)-(h+(l*p+m*i)));return+y}else if((r|0)==1){i=+g[a+92>>2];p=+g[a+96>>2];x=m*i-l*p;j=l*i+m*p;p=+g[a+84>>2];i=+g[a+88>>2];z=o+(m*p-l*i);A=h+(l*p+m*i);t=c[a+4>>2]|0;do{if((d|0)>-1){if((c[t+20>>2]|0)>(d|0)){break}else{v=710;break}}else{v=710}}while(0);if((v|0)==710){ax(5244292,103,5247324,5243944)}s=(c[t+16>>2]|0)+(d<<3)|0;d=c[s+4>>2]|0;i=(c[k>>2]=c[s>>2]|0,+g[k>>2]);p=(c[k>>2]=d,+g[k>>2]);y=x*(q+(f*i-e*p)-z)+j*(n+(e*i+f*p)-A);return+y}else if((r|0)==2){A=+g[a+92>>2];p=+g[a+96>>2];i=f*A-e*p;j=e*A+f*p;p=+g[a+84>>2];A=+g[a+88>>2];z=q+(f*p-e*A);q=n+(e*p+f*A);r=c[a>>2]|0;do{if((b|0)>-1){if((c[r+20>>2]|0)>(b|0)){break}else{v=714;break}}else{v=714}}while(0);if((v|0)==714){ax(5244292,103,5247324,5243944)}v=(c[r+16>>2]|0)+(b<<3)|0;b=c[v+4>>2]|0;A=(c[k>>2]=c[v>>2]|0,+g[k>>2]);f=(c[k>>2]=b,+g[k>>2]);y=i*(o+(m*A-l*f)-z)+j*(h+(l*A+m*f)-q);return+y}else{ax(5244124,242,5247172,5245900);y=0.0;return+y}return 0.0}function bx(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0;do{if((e|0)>-1){if(((c[b+16>>2]|0)-1|0)>(e|0)){break}else{f=724;break}}else{f=724}}while(0);if((f|0)==724){ax(5243792,89,5247672,5243756)}c[d+4>>2]=1;g[d+8>>2]=+g[b+8>>2];f=b+12|0;h=(c[f>>2]|0)+(e<<3)|0;i=d+12|0;j=c[h+4>>2]|0;c[i>>2]=c[h>>2]|0;c[i+4>>2]=j;j=(c[f>>2]|0)+(e+1<<3)|0;i=d+20|0;h=c[j+4>>2]|0;c[i>>2]=c[j>>2]|0;c[i+4>>2]=h;h=d+28|0;if((e|0)>0){i=(c[f>>2]|0)+(e-1<<3)|0;j=h;k=c[i+4>>2]|0;c[j>>2]=c[i>>2]|0;c[j+4>>2]=k;a[d+44|0]=1}else{k=b+20|0;j=h;h=c[k+4>>2]|0;c[j>>2]=c[k>>2]|0;c[j+4>>2]=h;a[d+44|0]=a[b+36|0]&1}h=d+36|0;if(((c[b+16>>2]|0)-2|0)>(e|0)){j=(c[f>>2]|0)+(e+2<<3)|0;e=h;f=c[j+4>>2]|0;c[e>>2]=c[j>>2]|0;c[e+4>>2]=f;a[d+45|0]=1;return}else{f=b+28|0;e=h;h=c[f+4>>2]|0;c[e>>2]=c[f>>2]|0;c[e+4>>2]=h;a[d+45|0]=a[b+37|0]&1;return}}function by(d,e){d=d|0;e=e|0;var f=0,h=0,i=0;f=bK(e,48)|0;if((f|0)==0){h=0}else{c[f>>2]=5250868;c[f+4>>2]=1;g[f+8>>2]=.009999999776482582;e=f+28|0;c[e>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;b[e+16>>1]=0;h=f}c[h+4>>2]=c[d+4>>2]|0;g[h+8>>2]=+g[d+8>>2];f=d+12|0;e=h+12|0;i=c[f+4>>2]|0;c[e>>2]=c[f>>2]|0;c[e+4>>2]=i;i=d+20|0;e=h+20|0;f=c[i+4>>2]|0;c[e>>2]=c[i>>2]|0;c[e+4>>2]=f;f=d+28|0;e=h+28|0;i=c[f+4>>2]|0;c[e>>2]=c[f>>2]|0;c[e+4>>2]=i;i=d+36|0;e=h+36|0;f=c[i+4>>2]|0;c[e>>2]=c[i>>2]|0;c[e+4>>2]=f;a[h+44|0]=a[d+44|0]&1;a[h+45|0]=a[d+45|0]&1;return h|0}function bz(a){a=a|0;return 1}function bA(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0.0,h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0;f=+g[d+12>>2];h=+g[a+12>>2];i=+g[d+8>>2];j=+g[a+16>>2];l=+g[d>>2];m=l+(f*h-i*j);n=+g[d+4>>2];o=h*i+f*j+n;j=+g[a+20>>2];h=+g[a+24>>2];p=l+(f*j-i*h);l=n+(i*j+f*h);h=+g[a+8>>2];a=b;d=(g[k>>2]=(m<p?m:p)-h,c[k>>2]|0);e=(g[k>>2]=(o<l?o:l)-h,c[k>>2]|0)|0;c[a>>2]=0|d;c[a+4>>2]=e;e=b+8|0;b=(g[k>>2]=h+(m>p?m:p),c[k>>2]|0);a=(g[k>>2]=h+(o>l?o:l),c[k>>2]|0)|0;c[e>>2]=0|b;c[e+4>>2]=a;return}function bB(a,b,d){a=a|0;b=b|0;d=+d;var e=0,f=0;g[b>>2]=0.0;d=(+g[a+16>>2]+ +g[a+24>>2])*.5;e=b+4|0;f=(g[k>>2]=(+g[a+12>>2]+ +g[a+20>>2])*.5,c[k>>2]|0);a=(g[k>>2]=d,c[k>>2]|0)|0;c[e>>2]=0|f;c[e+4>>2]=a;g[b+12>>2]=0.0;return}function bC(a,b,d){a=a|0;b=b|0;d=d|0;var e=0.0,f=0.0,h=0.0,i=0.0,j=0.0,k=0.0,l=0,m=0;e=+g[d>>2]- +g[b>>2];f=+g[d+4>>2]- +g[b+4>>2];h=+g[b+12>>2];i=+g[b+8>>2];j=e*h+f*i;k=h*f+e*(-0.0-i);b=c[a+148>>2]|0;d=0;while(1){if((d|0)>=(b|0)){l=1;m=744;break}if((j- +g[a+20+(d<<3)>>2])*+g[a+84+(d<<3)>>2]+(k- +g[a+20+(d<<3)+4>>2])*+g[a+84+(d<<3)+4>>2]>0.0){l=0;m=745;break}else{d=d+1|0}}if((m|0)==744){return l|0}else if((m|0)==745){return l|0}return 0}function bD(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0.0,h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0,x=0.0,y=0.0,z=0.0,A=0.0;f=+g[d+12>>2];h=+g[a+20>>2];i=+g[d+8>>2];j=+g[a+24>>2];l=+g[d>>2];m=l+(f*h-i*j);n=+g[d+4>>2];o=h*i+f*j+n;d=c[a+148>>2]|0;L1009:do{if((d|0)>1){j=o;h=m;p=o;q=m;e=1;while(1){r=+g[a+20+(e<<3)>>2];s=+g[a+20+(e<<3)+4>>2];t=l+(f*r-i*s);u=r*i+f*s+n;s=h<t?h:t;r=j<u?j:u;v=q>t?q:t;t=p>u?p:u;w=e+1|0;if((w|0)<(d|0)){j=r;h=s;p=t;q=v;e=w}else{x=r;y=s;z=t;A=v;break L1009}}}else{x=o;y=m;z=o;A=m}}while(0);m=+g[a+8>>2];a=b;d=(g[k>>2]=y-m,c[k>>2]|0);e=(g[k>>2]=x-m,c[k>>2]|0)|0;c[a>>2]=0|d;c[a+4>>2]=e;e=b+8|0;b=(g[k>>2]=A+m,c[k>>2]|0);a=(g[k>>2]=z+m,c[k>>2]|0)|0;c[e>>2]=0|b;c[e+4>>2]=a;return}function bE(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0;h=+g[e>>2];i=+g[d>>2]-h;j=+g[e+4>>2];l=+g[d+4>>2]-j;m=+g[e+12>>2];n=+g[e+8>>2];o=i*m+l*n;p=-0.0-n;q=m*l+i*p;i=+g[d+8>>2]-h;h=+g[d+12>>2]-j;j=m*i+n*h-o;n=i*p+m*h-q;e=a+12|0;f=c[e+4>>2]|0;h=(c[k>>2]=c[e>>2]|0,+g[k>>2]);m=(c[k>>2]=f,+g[k>>2]);f=a+20|0;a=c[f+4>>2]|0;p=(c[k>>2]=c[f>>2]|0,+g[k>>2]);i=p-h;p=(c[k>>2]=a,+g[k>>2])-m;l=-0.0-i;r=i*i+p*p;s=+N(r);if(s<1.1920928955078125e-7){t=p;u=l}else{v=1.0/s;t=p*v;u=v*l}l=(m-q)*u+(h-o)*t;v=n*u+j*t;if(v==0.0){w=0;return w|0}s=l/v;if(s<0.0){w=0;return w|0}if(+g[d+16>>2]<s|r==0.0){w=0;return w|0}v=(i*(o+j*s-h)+p*(q+n*s-m))/r;if(v<0.0|v>1.0){w=0;return w|0}g[b+8>>2]=s;if(l>0.0){d=b;a=(g[k>>2]=-0.0-t,c[k>>2]|0);f=(g[k>>2]=-0.0-u,c[k>>2]|0)|0;c[d>>2]=0|a;c[d+4>>2]=f;w=1;return w|0}else{f=b;b=(g[k>>2]=t,c[k>>2]|0);d=(g[k>>2]=u,c[k>>2]|0)|0;c[f>>2]=0|b;c[f+4>>2]=d;w=1;return w|0}return 0}function bF(a){a=a|0;de(a);return}function bG(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=bK(b,152)|0;if((d|0)==0){e=0}else{c[d>>2]=5250824;c[d+4>>2]=2;g[d+8>>2]=.009999999776482582;c[d+148>>2]=0;g[d+12>>2]=0.0;g[d+16>>2]=0.0;e=d}c[e+4>>2]=c[a+4>>2]|0;g[e+8>>2]=+g[a+8>>2];d=a+12|0;b=e+12|0;f=c[d+4>>2]|0;c[b>>2]=c[d>>2]|0;c[b+4>>2]=f;dh(e+20|0,a+20|0,64);dh(e+84|0,a+84|0,64);c[e+148>>2]=c[a+148>>2]|0;return e|0}function bH(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0.0,v=0.0,w=0,x=0.0,y=0,z=0.0;h=+g[e>>2];i=+g[d>>2]-h;j=+g[e+4>>2];l=+g[d+4>>2]-j;f=e+12|0;m=+g[f>>2];n=e+8|0;o=+g[n>>2];p=i*m+l*o;q=-0.0-o;r=m*l+i*q;i=+g[d+8>>2]-h;h=+g[d+12>>2]-j;j=m*i+o*h-p;o=i*q+m*h-r;h=+g[d+16>>2];d=c[a+148>>2]|0;m=0.0;e=0;s=-1;q=h;L1040:while(1){if((e|0)>=(d|0)){t=780;break}i=+g[a+84+(e<<3)>>2];l=+g[a+84+(e<<3)+4>>2];u=(+g[a+20+(e<<3)>>2]-p)*i+(+g[a+20+(e<<3)+4>>2]-r)*l;v=j*i+o*l;L1043:do{if(v==0.0){if(u<0.0){w=0;t=788;break L1040}else{x=m;y=s;z=q}}else{do{if(v<0.0){if(u>=m*v){break}x=u/v;y=e;z=q;break L1043}}while(0);if(v<=0.0){x=m;y=s;z=q;break}if(u>=q*v){x=m;y=s;z=q;break}x=m;y=s;z=u/v}}while(0);if(z<x){w=0;t=787;break}else{m=x;e=e+1|0;s=y;q=z}}if((t|0)==788){return w|0}else if((t|0)==780){if(m<0.0|m>h){ax(5243472,249,5247380,5244172)}if((s|0)<=-1){w=0;return w|0}g[b+8>>2]=m;m=+g[f>>2];h=+g[a+84+(s<<3)>>2];z=+g[n>>2];q=+g[a+84+(s<<3)+4>>2];s=b;b=(g[k>>2]=m*h-z*q,c[k>>2]|0);a=(g[k>>2]=h*z+m*q,c[k>>2]|0)|0;c[s>>2]=0|b;c[s+4>>2]=a;w=1;return w|0}else if((t|0)==787){return w|0}return 0}function bI(a,b,d){a=a|0;b=b|0;d=+d;var e=0,f=0,h=0,i=0,j=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0,E=0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0;e=a+148|0;f=c[e>>2]|0;do{if((f|0)>2){h=f;i=792}else{ax(5243472,306,5247496,5243736);j=c[e>>2]|0;if((j|0)>0){h=j;i=792;break}l=1.0/+(j|0);j=b|0;g[j>>2]=d*0.0;m=l*0.0;n=l*0.0;o=0.0;p=0.0;q=0.0;r=0.0;s=j;i=799;break}}while(0);do{if((i|0)==792){l=0.0;t=0.0;e=0;while(1){u=t+ +g[a+20+(e<<3)>>2];v=l+ +g[a+20+(e<<3)+4>>2];f=e+1|0;if((f|0)<(h|0)){l=v;t=u;e=f}else{break}}t=1.0/+(h|0);l=u*t;w=v*t;e=a+20|0;f=a+24|0;t=0.0;x=0.0;j=0;y=0.0;z=0.0;while(1){A=+g[a+20+(j<<3)>>2]-l;B=+g[a+20+(j<<3)+4>>2]-w;C=j+1|0;D=(C|0)<(h|0);if(D){E=a+20+(C<<3)|0;F=a+20+(C<<3)+4|0}else{E=e;F=f}G=+g[E>>2]-l;H=+g[F>>2]-w;I=A*H-B*G;J=I*.5;K=z+J;L=J*.3333333432674408;M=x+(A+G)*L;N=t+(B+H)*L;O=y+I*.0833333358168602*(G*G+(A*A+A*G)+(H*H+(B*B+B*H)));if(D){t=N;x=M;j=C;y=O;z=K}else{break}}z=K*d;j=b|0;g[j>>2]=z;if(K>1.1920928955078125e-7){P=z;Q=w;R=l;S=K;T=O;U=M;V=N;break}else{m=w;n=l;o=K;p=O;q=M;r=N;s=j;i=799;break}}}while(0);if((i|0)==799){ax(5243472,352,5247496,5243448);P=+g[s>>2];Q=m;R=n;S=o;T=p;U=q;V=r}r=1.0/S;S=U*r;U=V*r;r=R+S;R=Q+U;s=b+4|0;i=(g[k>>2]=r,c[k>>2]|0);F=(g[k>>2]=R,c[k>>2]|0)|0;c[s>>2]=0|i;c[s+4>>2]=F;g[b+12>>2]=T*d+P*(r*r+R*R-(S*S+U*U));return}function bJ(a){a=a|0;de(a);return}function bK(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;if((d|0)==0){e=0;return e|0}do{if((d|0)>0){if((d|0)<=640){break}e=dc(d)|0;return e|0}else{ax(5243252,104,5249456,5244764)}}while(0);f=a[d+5251696|0]|0;d=f&255;if((f&255)>=14){ax(5243252,112,5249456,5244088)}f=b+12+(d<<2)|0;g=c[f>>2]|0;if((g|0)!=0){c[f>>2]=c[g>>2]|0;e=g;return e|0}g=b+4|0;h=c[g>>2]|0;i=b+8|0;j=b|0;if((h|0)==(c[i>>2]|0)){b=c[j>>2]|0;k=h+128|0;c[i>>2]=k;i=dc(k<<3)|0;c[j>>2]=i;k=b;dh(i,k,c[g>>2]<<3);di((c[j>>2]|0)+(c[g>>2]<<3)|0,0,1024);dd(k);l=c[g>>2]|0}else{l=h}h=c[j>>2]|0;j=dc(16384)|0;k=h+(l<<3)+4|0;c[k>>2]=j;i=c[5252340+(d<<2)>>2]|0;c[h+(l<<3)>>2]=i;l=16384/(i|0)&-1;if((Z(l,i)|0)<16385){m=j}else{ax(5243252,140,5249456,5243696);m=c[k>>2]|0}j=l-1|0;l=m;L1106:do{if((j|0)>0){m=0;h=l;while(1){d=h+Z(m,i)|0;b=m+1|0;c[d>>2]=h+Z(b,i)|0;d=c[k>>2]|0;if((b|0)==(j|0)){n=d;break L1106}else{m=b;h=d}}}else{n=l}}while(0);c[n+Z(j,i)>>2]=0;c[f>>2]=c[c[k>>2]>>2]|0;c[g>>2]=(c[g>>2]|0)+1|0;e=c[k>>2]|0;return e|0}function bL(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=b+102796|0;f=c[e>>2]|0;if((f|0)>0){g=f}else{ax(5243112,63,5249316,5243676);g=c[e>>2]|0}f=g-1|0;if((c[b+102412+(f*12&-1)>>2]|0)!=(d|0)){ax(5243112,65,5249316,5243428)}if((a[b+102412+(f*12&-1)+8|0]&1)<<24>>24==0){g=b+102412+(f*12&-1)+4|0;h=b+102400|0;c[h>>2]=(c[h>>2]|0)-(c[g>>2]|0)|0;i=g}else{dd(d);i=b+102412+(f*12&-1)+4|0}f=b+102404|0;c[f>>2]=(c[f>>2]|0)-(c[i>>2]|0)|0;c[e>>2]=(c[e>>2]|0)-1|0;return}function bM(a){a=a|0;return}function bN(a){a=a|0;return}function bO(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0.0,l=0.0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;h=d+12|0;i=d+64|0;j=e+4|0;k=+g[j>>2];do{if(k==k&!(A=0.0,A!=A)&k>+-p&k<+p){l=+g[e+8>>2];if(l==l&!(A=0.0,A!=A)&l>+-p&l<+p){break}else{m=835;break}}else{m=835}}while(0);if((m|0)==835){ax(5242984,27,5248400,5245548)}n=e+16|0;k=+g[n>>2];do{if(k==k&!(A=0.0,A!=A)&k>+-p&k<+p){l=+g[e+20>>2];if(l==l&!(A=0.0,A!=A)&l>+-p&l<+p){break}else{m=838;break}}else{m=838}}while(0);if((m|0)==838){ax(5242984,28,5248400,5244444)}m=e+12|0;k=+g[m>>2];if(!(k==k&!(A=0.0,A!=A)&k>+-p&k<+p)){ax(5242984,29,5248400,5244028)}o=e+24|0;k=+g[o>>2];if(!(k==k&!(A=0.0,A!=A)&k>+-p&k<+p)){ax(5242984,30,5248400,5243644)}q=e+32|0;k=+g[q>>2];if(k<0.0|k==k&!(A=0.0,A!=A)&k>+-p&k<+p^1){ax(5242984,31,5248400,5243368)}r=e+28|0;k=+g[r>>2];if(k<0.0|k==k&!(A=0.0,A!=A)&k>+-p&k<+p^1){ax(5242984,32,5248400,5243192)}s=d+4|0;b[s>>1]=0;if((a[e+39|0]&1)<<24>>24==0){t=0}else{b[s>>1]=8;t=8}if((a[e+38|0]&1)<<24>>24==0){u=t}else{v=t|16;b[s>>1]=v;u=v}if((a[e+36|0]&1)<<24>>24==0){w=u}else{v=u|4;b[s>>1]=v;w=v}if((a[e+37|0]&1)<<24>>24==0){x=w}else{v=w|2;b[s>>1]=v;x=v}if((a[e+40|0]&1)<<24>>24!=0){b[s>>1]=x|32}c[d+88>>2]=f;f=j;j=h;h=c[f>>2]|0;x=c[f+4>>2]|0;c[j>>2]=h;c[j+4>>2]=x;k=+g[m>>2];g[d+20>>2]=+Q(k);g[d+24>>2]=+P(k);g[d+28>>2]=0.0;g[d+32>>2]=0.0;j=d+36|0;c[j>>2]=h;c[j+4>>2]=x;j=d+44|0;c[j>>2]=h;c[j+4>>2]=x;g[d+52>>2]=+g[m>>2];g[d+56>>2]=+g[m>>2];g[d+60>>2]=0.0;c[d+108>>2]=0;c[d+112>>2]=0;c[d+92>>2]=0;c[d+96>>2]=0;m=n;n=i;i=c[m+4>>2]|0;c[n>>2]=c[m>>2]|0;c[n+4>>2]=i;g[d+72>>2]=+g[o>>2];g[d+132>>2]=+g[r>>2];g[d+136>>2]=+g[q>>2];g[d+140>>2]=+g[e+48>>2];g[d+76>>2]=0.0;g[d+80>>2]=0.0;g[d+84>>2]=0.0;g[d+144>>2]=0.0;q=c[e>>2]|0;c[d>>2]=q;r=d+116|0;if((q|0)==2){g[r>>2]=1.0;g[d+120>>2]=1.0;q=d+124|0;g[q>>2]=0.0;o=d+128|0;g[o>>2]=0.0;i=e+44|0;n=c[i>>2]|0;m=d+148|0;c[m>>2]=n;x=d+100|0;c[x>>2]=0;j=d+104|0;c[j>>2]=0;return}else{g[r>>2]=0.0;g[d+120>>2]=0.0;q=d+124|0;g[q>>2]=0.0;o=d+128|0;g[o>>2]=0.0;i=e+44|0;n=c[i>>2]|0;m=d+148|0;c[m>>2]=n;x=d+100|0;c[x>>2]=0;j=d+104|0;c[j>>2]=0;return}}function bP(a){a=a|0;var d=0,e=0,f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0,J=0.0,K=0.0;d=i;i=i+16|0;e=d|0;f=a+116|0;h=a+120|0;j=a+124|0;l=a+128|0;m=a+28|0;g[m>>2]=0.0;g[a+32>>2]=0.0;n=f;c[n>>2]=0;c[n+4>>2]=0;c[n+8>>2]=0;c[n+12>>2]=0;n=c[a>>2]|0;if((n|0)==0|(n|0)==1){o=a+12|0;p=a+36|0;q=c[o>>2]|0;r=c[o+4>>2]|0;c[p>>2]=q;c[p+4>>2]=r;p=a+44|0;c[p>>2]=q;c[p+4>>2]=r;g[a+52>>2]=+g[a+56>>2];i=d;return}else if((n|0)!=2){ax(5242984,284,5248448,5246264)}n=5242944;r=c[n+4>>2]|0;s=(c[k>>2]=c[n>>2]|0,+g[k>>2]);t=(c[k>>2]=r,+g[k>>2]);r=c[a+100>>2]|0;L1173:do{if((r|0)==0){u=t;v=s}else{n=e|0;p=e+4|0;q=e+8|0;o=e+12|0;w=t;x=s;y=r;while(1){z=+g[y>>2];if(z==0.0){A=x;B=w}else{C=c[y+12>>2]|0;aN[c[(c[C>>2]|0)+28>>2]&255](C,e,z);z=+g[n>>2];g[f>>2]=z+ +g[f>>2];D=x+z*+g[p>>2];E=w+z*+g[q>>2];g[j>>2]=+g[o>>2]+ +g[j>>2];A=D;B=E}C=c[y+4>>2]|0;if((C|0)==0){u=B;v=A;break L1173}else{w=B;x=A;y=C}}}}while(0);A=+g[f>>2];if(A>0.0){B=1.0/A;g[h>>2]=B;F=v*B;G=u*B;H=A}else{g[f>>2]=1.0;g[h>>2]=1.0;F=v;G=u;H=1.0}u=+g[j>>2];do{if(u>0.0){if((b[a+4>>1]&16)<<16>>16!=0){I=879;break}v=u-(G*G+F*F)*H;g[j>>2]=v;if(v>0.0){J=v}else{ax(5242984,319,5248448,5245984);J=+g[j>>2]}K=1.0/J;break}else{I=879}}while(0);if((I|0)==879){g[j>>2]=0.0;K=0.0}g[l>>2]=K;l=a+44|0;j=c[l+4>>2]|0;K=(c[k>>2]=c[l>>2]|0,+g[k>>2]);J=(c[k>>2]=j,+g[k>>2]);j=m;m=(g[k>>2]=F,c[k>>2]|0);I=(g[k>>2]=G,c[k>>2]|0)|0;c[j>>2]=0|m;c[j+4>>2]=I;H=+g[a+24>>2];u=+g[a+20>>2];v=+g[a+12>>2]+(H*F-u*G);A=F*u+H*G+ +g[a+16>>2];I=(g[k>>2]=v,c[k>>2]|0);j=0|I;I=(g[k>>2]=A,c[k>>2]|0)|0;c[l>>2]=j;c[l+4>>2]=I;l=a+36|0;c[l>>2]=j;c[l+4>>2]=I;G=+g[a+72>>2];I=a+64|0;g[I>>2]=+g[I>>2]+(A-J)*(-0.0-G);I=a+68|0;g[I>>2]=G*(v-K)+ +g[I>>2];i=d;return}function bQ(d,e){d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;f=d+88|0;h=c[f>>2]|0;i=c[h+102868>>2]|0;if((i&2|0)==0){j=h;k=i}else{ax(5242984,153,5248480,5243080);i=c[f>>2]|0;j=i;k=c[i+102868>>2]|0}if((k&2|0)!=0){l=0;return l|0}k=j|0;j=bK(k,44)|0;if((j|0)==0){m=0}else{b[j+32>>1]=1;b[j+34>>1]=-1;b[j+36>>1]=0;c[j+40>>2]=0;c[j+24>>2]=0;c[j+28>>2]=0;c[j>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;m=j}c[m+40>>2]=c[e+4>>2]|0;g[m+16>>2]=+g[e+8>>2];g[m+20>>2]=+g[e+12>>2];j=m+8|0;c[j>>2]=d;i=m+4|0;c[i>>2]=0;h=m+32|0;n=e+22|0;b[h>>1]=b[n>>1]|0;b[h+2>>1]=b[n+2>>1]|0;b[h+4>>1]=b[n+4>>1]|0;a[m+38|0]=a[e+20|0]&1;n=c[e>>2]|0;h=aP[c[(c[n>>2]|0)+8>>2]&255](n,k)|0;n=m+12|0;c[n>>2]=h;o=aJ[c[(c[h>>2]|0)+12>>2]&255](h)|0;h=bK(k,o*28&-1)|0;k=m+24|0;c[k>>2]=h;L1205:do{if((o|0)>0){c[h+16>>2]=0;c[(c[k>>2]|0)+24>>2]=-1;if((o|0)==1){break}else{p=1}while(1){c[(c[k>>2]|0)+(p*28&-1)+16>>2]=0;c[(c[k>>2]|0)+(p*28&-1)+24>>2]=-1;q=p+1|0;if((q|0)==(o|0)){break L1205}else{p=q}}}}while(0);p=m+28|0;c[p>>2]=0;o=m|0;g[o>>2]=+g[e+16>>2];L1210:do{if((b[d+4>>1]&32)<<16>>16!=0){e=(c[f>>2]|0)+102872|0;h=d+12|0;q=c[n>>2]|0;r=aJ[c[(c[q>>2]|0)+12>>2]&255](q)|0;c[p>>2]=r;if((r|0)>0){s=0}else{break}while(1){r=c[k>>2]|0;q=r+(s*28&-1)|0;t=c[n>>2]|0;u=q|0;aQ[c[(c[t>>2]|0)+24>>2]&255](t,u,h,s);c[r+(s*28&-1)+24>>2]=a7(e,u,q)|0;c[r+(s*28&-1)+16>>2]=m;c[r+(s*28&-1)+20>>2]=s;r=s+1|0;if((r|0)<(c[p>>2]|0)){s=r}else{break L1210}}}}while(0);s=d+100|0;c[i>>2]=c[s>>2]|0;c[s>>2]=m;s=d+104|0;c[s>>2]=(c[s>>2]|0)+1|0;c[j>>2]=d;if(+g[o>>2]>0.0){bP(d)}d=(c[f>>2]|0)+102868|0;c[d>>2]=c[d>>2]|1;l=m;return l|0}function bR(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;d=c[(c[b+48>>2]|0)+8>>2]|0;e=c[(c[b+52>>2]|0)+8>>2]|0;f=c[a+72>>2]|0;do{if((f|0)!=0){if((c[b+4>>2]&2|0)==0){break}aI[c[(c[f>>2]|0)+12>>2]&255](f,b)}}while(0);f=b+8|0;g=c[f>>2]|0;h=b+12|0;if((g|0)!=0){c[g+12>>2]=c[h>>2]|0}g=c[h>>2]|0;if((g|0)!=0){c[g+8>>2]=c[f>>2]|0}f=a+60|0;if((c[f>>2]|0)==(b|0)){c[f>>2]=c[h>>2]|0}h=b+24|0;f=c[h>>2]|0;g=b+28|0;if((f|0)!=0){c[f+12>>2]=c[g>>2]|0}f=c[g>>2]|0;if((f|0)!=0){c[f+8>>2]=c[h>>2]|0}h=d+112|0;if((b+16|0)==(c[h>>2]|0)){c[h>>2]=c[g>>2]|0}g=b+40|0;h=c[g>>2]|0;d=b+44|0;if((h|0)!=0){c[h+12>>2]=c[d>>2]|0}h=c[d>>2]|0;if((h|0)!=0){c[h+8>>2]=c[g>>2]|0}g=e+112|0;if((b+32|0)!=(c[g>>2]|0)){i=a+76|0;j=c[i>>2]|0;cv(b,j);k=a+64|0;l=c[k>>2]|0;m=l-1|0;c[k>>2]=m;return}c[g>>2]=c[d>>2]|0;i=a+76|0;j=c[i>>2]|0;cv(b,j);k=a+64|0;l=c[k>>2]|0;m=l-1|0;c[k>>2]=m;return}function bS(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=c[a>>2]|0;e=c[b>>2]|0;if((d|0)<(e|0)){f=1;return f|0}if((d|0)!=(e|0)){f=0;return f|0}f=(c[a+4>>2]|0)<(c[b+4>>2]|0);return f|0}function bT(d){d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;e=c[d+60>>2]|0;if((e|0)==0){return}f=d+12|0;h=d+4|0;i=d+72|0;j=d+68|0;k=e;while(1){e=c[k+48>>2]|0;l=c[k+52>>2]|0;m=c[k+56>>2]|0;n=c[k+60>>2]|0;o=c[e+8>>2]|0;p=c[l+8>>2]|0;q=k+4|0;r=c[q>>2]|0;L1266:do{if((r&8|0)==0){s=948}else{do{if((c[p>>2]|0)==2){s=937}else{if((c[o>>2]|0)==2){s=937;break}else{break}}}while(0);L1270:do{if((s|0)==937){s=0;t=c[p+108>>2]|0;L1272:do{if((t|0)!=0){u=t;while(1){if((c[u>>2]|0)==(o|0)){if((a[(c[u+4>>2]|0)+61|0]&1)<<24>>24==0){break L1270}}v=c[u+12>>2]|0;if((v|0)==0){break L1272}else{u=v}}}}while(0);t=c[j>>2]|0;do{if((t|0)==0){w=r}else{if(aK[c[(c[t>>2]|0)+8>>2]&255](t,e,l)|0){w=c[q>>2]|0;break}else{u=c[k+12>>2]|0;bR(d,k);x=u;break L1266}}}while(0);c[q>>2]=w&-9;s=948;break L1266}}while(0);t=c[k+12>>2]|0;bR(d,k);x=t;break}}while(0);do{if((s|0)==948){s=0;if((b[o+4>>1]&2)<<16>>16==0){y=0}else{y=(c[o>>2]|0)!=0}if((b[p+4>>1]&2)<<16>>16==0){z=0}else{z=(c[p>>2]|0)!=0}if(!(y|z)){x=c[k+12>>2]|0;break}q=c[(c[e+24>>2]|0)+(m*28&-1)+24>>2]|0;r=c[(c[l+24>>2]|0)+(n*28&-1)+24>>2]|0;do{if((q|0)>-1){if((c[f>>2]|0)>(q|0)){break}else{s=956;break}}else{s=956}}while(0);if((s|0)==956){s=0;ax(5245460,159,5247616,5245416)}t=c[h>>2]|0;do{if((r|0)>-1){if((c[f>>2]|0)>(r|0)){A=t;break}else{s=959;break}}else{s=959}}while(0);if((s|0)==959){s=0;ax(5245460,159,5247616,5245416);A=c[h>>2]|0}if(+g[A+(r*36&-1)>>2]- +g[t+(q*36&-1)+8>>2]>0.0|+g[A+(r*36&-1)+4>>2]- +g[t+(q*36&-1)+12>>2]>0.0|+g[t+(q*36&-1)>>2]- +g[A+(r*36&-1)+8>>2]>0.0|+g[t+(q*36&-1)+4>>2]- +g[A+(r*36&-1)+12>>2]>0.0){u=c[k+12>>2]|0;bR(d,k);x=u;break}else{cx(k,c[i>>2]|0);x=c[k+12>>2]|0;break}}}while(0);if((x|0)==0){break}else{k=x}}return}function bU(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;d=i;i=i+4|0;e=d|0;f=a+52|0;c[f>>2]=0;g=a+40|0;h=c[g>>2]|0;if((h|0)>0){j=a+32|0;k=a+56|0;l=a|0;m=a+12|0;n=a+4|0;o=0;p=h;while(1){h=c[(c[j>>2]|0)+(o<<2)>>2]|0;c[k>>2]=h;if((h|0)==-1){q=p}else{do{if((h|0)>-1){if((c[m>>2]|0)>(h|0)){break}else{r=971;break}}else{r=971}}while(0);if((r|0)==971){r=0;ax(5245460,159,5247616,5245416)}bW(l,a,(c[n>>2]|0)+(h*36&-1)|0);q=c[g>>2]|0}s=o+1|0;if((s|0)<(q|0)){o=s;p=q}else{break}}t=c[f>>2]|0}else{t=0}c[g>>2]=0;g=a+44|0;q=c[g>>2]|0;c[e>>2]=114;bX(q,q+(t*12&-1)|0,e);if((c[f>>2]|0)<=0){i=d;return}e=a+12|0;t=a+4|0;a=0;L1330:while(1){q=c[g>>2]|0;p=q+(a*12&-1)|0;o=c[p>>2]|0;do{if((o|0)>-1){if((c[e>>2]|0)>(o|0)){break}else{r=979;break}}else{r=979}}while(0);if((r|0)==979){r=0;ax(5245460,153,5247568,5245416)}h=c[t>>2]|0;n=c[h+(o*36&-1)+16>>2]|0;l=q+(a*12&-1)+4|0;m=c[l>>2]|0;do{if((m|0)>-1){if((c[e>>2]|0)>(m|0)){u=h;break}else{r=982;break}}else{r=982}}while(0);if((r|0)==982){r=0;ax(5245460,153,5247568,5245416);u=c[t>>2]|0}bV(b,n,c[u+(m*36&-1)+16>>2]|0);h=c[f>>2]|0;q=a;while(1){o=q+1|0;if((o|0)>=(h|0)){break L1330}k=c[g>>2]|0;if((c[k+(o*12&-1)>>2]|0)!=(c[p>>2]|0)){a=o;continue L1330}if((c[k+(o*12&-1)+4>>2]|0)==(c[l>>2]|0)){q=o}else{a=o;continue L1330}}}i=d;return}function bV(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;h=c[e+16>>2]|0;i=c[f+16>>2]|0;j=c[e+20>>2]|0;e=c[f+20>>2]|0;f=c[h+8>>2]|0;k=c[i+8>>2]|0;if((f|0)==(k|0)){return}l=c[k+112>>2]|0;L1351:do{if((l|0)!=0){m=l;while(1){if((c[m>>2]|0)==(f|0)){n=c[m+4>>2]|0;o=c[n+48>>2]|0;p=c[n+52>>2]|0;q=c[n+56>>2]|0;r=c[n+60>>2]|0;if((o|0)==(h|0)&(p|0)==(i|0)&(q|0)==(j|0)&(r|0)==(e|0)){s=1018;break}if((o|0)==(i|0)&(p|0)==(h|0)&(q|0)==(e|0)&(r|0)==(j|0)){s=1024;break}}r=c[m+12>>2]|0;if((r|0)==0){break L1351}else{m=r}}if((s|0)==1024){return}else if((s|0)==1018){return}}}while(0);do{if((c[k>>2]|0)!=2){if((c[f>>2]|0)==2){break}return}}while(0);s=c[k+108>>2]|0;L1366:do{if((s|0)!=0){k=s;while(1){if((c[k>>2]|0)==(f|0)){if((a[(c[k+4>>2]|0)+61|0]&1)<<24>>24==0){break}}l=c[k+12>>2]|0;if((l|0)==0){break L1366}else{k=l}}return}}while(0);f=c[d+68>>2]|0;do{if((f|0)!=0){if(aK[c[(c[f>>2]|0)+8>>2]&255](f,h,i)|0){break}return}}while(0);f=cu(h,j,i,e,c[d+76>>2]|0)|0;if((f|0)==0){return}e=c[(c[f+48>>2]|0)+8>>2]|0;i=c[(c[f+52>>2]|0)+8>>2]|0;c[f+8>>2]=0;j=d+60|0;c[f+12>>2]=c[j>>2]|0;h=c[j>>2]|0;if((h|0)!=0){c[h+8>>2]=f}c[j>>2]=f;j=f+16|0;c[f+20>>2]=f;c[j>>2]=i;c[f+24>>2]=0;h=e+112|0;c[f+28>>2]=c[h>>2]|0;s=c[h>>2]|0;if((s|0)!=0){c[s+8>>2]=j}c[h>>2]=j;j=f+32|0;c[f+36>>2]=f;c[j>>2]=e;c[f+40>>2]=0;h=i+112|0;c[f+44>>2]=c[h>>2]|0;f=c[h>>2]|0;if((f|0)!=0){c[f+8>>2]=j}c[h>>2]=j;j=e+4|0;h=b[j>>1]|0;if((h&2)<<16>>16==0){b[j>>1]=h|2;g[e+144>>2]=0.0}e=i+4|0;h=b[e>>1]|0;if((h&2)<<16>>16==0){b[e>>1]=h|2;g[i+144>>2]=0.0}i=d+64|0;c[i>>2]=(c[i>>2]|0)+1|0;return}function bW(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;e=i;i=i+1036|0;f=e|0;h=f+4|0;j=f|0;c[j>>2]=h;k=f+1028|0;c[k>>2]=0;l=f+1032|0;c[l>>2]=256;c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[a>>2]|0;f=(c[k>>2]|0)+1|0;c[k>>2]=f;L1398:do{if((f|0)>0){m=a+4|0;n=d|0;o=d+4|0;p=d+8|0;q=d+12|0;r=b+56|0;s=b+52|0;t=b+48|0;u=b+44|0;v=f;while(1){w=v-1|0;c[k>>2]=w;x=c[j>>2]|0;y=c[x+(w<<2)>>2]|0;do{if((y|0)==-1){z=w}else{A=c[m>>2]|0;if(+g[n>>2]- +g[A+(y*36&-1)+8>>2]>0.0|+g[o>>2]- +g[A+(y*36&-1)+12>>2]>0.0|+g[A+(y*36&-1)>>2]- +g[p>>2]>0.0|+g[A+(y*36&-1)+4>>2]- +g[q>>2]>0.0){z=w;break}B=A+(y*36&-1)+24|0;if((c[B>>2]|0)==-1){C=c[r>>2]|0;if((C|0)==(y|0)){z=w;break}D=c[s>>2]|0;if((D|0)==(c[t>>2]|0)){E=c[u>>2]|0;c[t>>2]=D<<1;F=dc(D*24&-1)|0;c[u>>2]=F;G=E;dh(F,G,(c[s>>2]|0)*12&-1);dd(G);H=c[r>>2]|0;I=c[s>>2]|0}else{H=C;I=D}c[(c[u>>2]|0)+(I*12&-1)>>2]=(H|0)>(y|0)?y:H;D=c[r>>2]|0;c[(c[u>>2]|0)+((c[s>>2]|0)*12&-1)+4>>2]=(D|0)<(y|0)?y:D;c[s>>2]=(c[s>>2]|0)+1|0;z=c[k>>2]|0;break}do{if((w|0)==(c[l>>2]|0)){c[l>>2]=w<<1;D=dc(w<<3)|0;c[j>>2]=D;C=x;dh(D,C,c[k>>2]<<2);if((x|0)==(h|0)){break}dd(C)}}while(0);c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[B>>2]|0;C=(c[k>>2]|0)+1|0;c[k>>2]=C;D=A+(y*36&-1)+28|0;do{if((C|0)==(c[l>>2]|0)){G=c[j>>2]|0;c[l>>2]=C<<1;F=dc(C<<3)|0;c[j>>2]=F;E=G;dh(F,E,c[k>>2]<<2);if((G|0)==(h|0)){break}dd(E)}}while(0);c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[D>>2]|0;C=(c[k>>2]|0)+1|0;c[k>>2]=C;z=C}}while(0);if((z|0)>0){v=z}else{break L1398}}}}while(0);z=c[j>>2]|0;if((z|0)==(h|0)){i=e;return}dd(z);c[j>>2]=0;i=e;return}function bX(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0;e=i;i=i+360|0;f=e|0;g=e+12|0;h=e+24|0;j=e+36|0;k=e+48|0;l=e+168|0;m=e+180|0;n=e+192|0;o=e+204|0;p=e+216|0;q=e+228|0;r=e+240|0;s=e+252|0;t=e+264|0;u=e+276|0;v=e+348|0;w=e+120|0;x=e+132|0;y=e+144|0;z=e+156|0;A=e+288|0;B=e+300|0;C=e+324|0;D=e+336|0;E=e+312|0;F=e+60|0;G=e+72|0;H=e+84|0;I=e+96|0;J=e+108|0;K=a;a=b;L1427:while(1){b=a;L=a-12|0;M=L;N=K;L1429:while(1){O=N;P=b-O|0;Q=(P|0)/12&-1;if((Q|0)==3){R=1052;break L1427}else if((Q|0)==2){R=1050;break L1427}else if((Q|0)==5){R=1061;break L1427}else if((Q|0)==4){R=1060;break L1427}else if((Q|0)==0|(Q|0)==1){R=1138;break L1427}if((P|0)<372){R=1067;break L1427}Q=(P|0)/24&-1;S=N+(Q*12&-1)|0;do{if((P|0)>11988){T=(P|0)/48&-1;U=N+(T*12&-1)|0;V=N+((T+Q|0)*12&-1)|0;T=bY(N,U,S,V,d)|0;if(!(aP[c[d>>2]&255](L,V)|0)){W=T;break}X=V;c[z>>2]=c[X>>2]|0;c[z+4>>2]=c[X+4>>2]|0;c[z+8>>2]=c[X+8>>2]|0;c[X>>2]=c[M>>2]|0;c[X+4>>2]=c[M+4>>2]|0;c[X+8>>2]=c[M+8>>2]|0;c[M>>2]=c[z>>2]|0;c[M+4>>2]=c[z+4>>2]|0;c[M+8>>2]=c[z+8>>2]|0;if(!(aP[c[d>>2]&255](V,S)|0)){W=T+1|0;break}V=S;c[x>>2]=c[V>>2]|0;c[x+4>>2]=c[V+4>>2]|0;c[x+8>>2]=c[V+8>>2]|0;c[V>>2]=c[X>>2]|0;c[V+4>>2]=c[X+4>>2]|0;c[V+8>>2]=c[X+8>>2]|0;c[X>>2]=c[x>>2]|0;c[X+4>>2]=c[x+4>>2]|0;c[X+8>>2]=c[x+8>>2]|0;if(!(aP[c[d>>2]&255](S,U)|0)){W=T+2|0;break}X=U;c[w>>2]=c[X>>2]|0;c[w+4>>2]=c[X+4>>2]|0;c[w+8>>2]=c[X+8>>2]|0;c[X>>2]=c[V>>2]|0;c[X+4>>2]=c[V+4>>2]|0;c[X+8>>2]=c[V+8>>2]|0;c[V>>2]=c[w>>2]|0;c[V+4>>2]=c[w+4>>2]|0;c[V+8>>2]=c[w+8>>2]|0;if(!(aP[c[d>>2]&255](U,N)|0)){W=T+3|0;break}U=N;c[y>>2]=c[U>>2]|0;c[y+4>>2]=c[U+4>>2]|0;c[y+8>>2]=c[U+8>>2]|0;c[U>>2]=c[X>>2]|0;c[U+4>>2]=c[X+4>>2]|0;c[U+8>>2]=c[X+8>>2]|0;c[X>>2]=c[y>>2]|0;c[X+4>>2]=c[y+4>>2]|0;c[X+8>>2]=c[y+8>>2]|0;W=T+4|0}else{T=aP[c[d>>2]&255](S,N)|0;X=aP[c[d>>2]&255](L,S)|0;if(!T){if(!X){W=0;break}T=S;c[J>>2]=c[T>>2]|0;c[J+4>>2]=c[T+4>>2]|0;c[J+8>>2]=c[T+8>>2]|0;c[T>>2]=c[M>>2]|0;c[T+4>>2]=c[M+4>>2]|0;c[T+8>>2]=c[M+8>>2]|0;c[M>>2]=c[J>>2]|0;c[M+4>>2]=c[J+4>>2]|0;c[M+8>>2]=c[J+8>>2]|0;if(!(aP[c[d>>2]&255](S,N)|0)){W=1;break}U=N;c[H>>2]=c[U>>2]|0;c[H+4>>2]=c[U+4>>2]|0;c[H+8>>2]=c[U+8>>2]|0;c[U>>2]=c[T>>2]|0;c[U+4>>2]=c[T+4>>2]|0;c[U+8>>2]=c[T+8>>2]|0;c[T>>2]=c[H>>2]|0;c[T+4>>2]=c[H+4>>2]|0;c[T+8>>2]=c[H+8>>2]|0;W=2;break}T=N;if(X){c[F>>2]=c[T>>2]|0;c[F+4>>2]=c[T+4>>2]|0;c[F+8>>2]=c[T+8>>2]|0;c[T>>2]=c[M>>2]|0;c[T+4>>2]=c[M+4>>2]|0;c[T+8>>2]=c[M+8>>2]|0;c[M>>2]=c[F>>2]|0;c[M+4>>2]=c[F+4>>2]|0;c[M+8>>2]=c[F+8>>2]|0;W=1;break}c[G>>2]=c[T>>2]|0;c[G+4>>2]=c[T+4>>2]|0;c[G+8>>2]=c[T+8>>2]|0;X=S;c[T>>2]=c[X>>2]|0;c[T+4>>2]=c[X+4>>2]|0;c[T+8>>2]=c[X+8>>2]|0;c[X>>2]=c[G>>2]|0;c[X+4>>2]=c[G+4>>2]|0;c[X+8>>2]=c[G+8>>2]|0;if(!(aP[c[d>>2]&255](L,S)|0)){W=1;break}c[I>>2]=c[X>>2]|0;c[I+4>>2]=c[X+4>>2]|0;c[I+8>>2]=c[X+8>>2]|0;c[X>>2]=c[M>>2]|0;c[X+4>>2]=c[M+4>>2]|0;c[X+8>>2]=c[M+8>>2]|0;c[M>>2]=c[I>>2]|0;c[M+4>>2]=c[I+4>>2]|0;c[M+8>>2]=c[I+8>>2]|0;W=2}}while(0);do{if(aP[c[d>>2]&255](N,S)|0){Y=L;Z=W}else{Q=L;while(1){_=Q-12|0;if((N|0)==(_|0)){break}if(aP[c[d>>2]&255](_,S)|0){R=1109;break}else{Q=_}}if((R|0)==1109){R=0;Q=N;c[E>>2]=c[Q>>2]|0;c[E+4>>2]=c[Q+4>>2]|0;c[E+8>>2]=c[Q+8>>2]|0;P=_;c[Q>>2]=c[P>>2]|0;c[Q+4>>2]=c[P+4>>2]|0;c[Q+8>>2]=c[P+8>>2]|0;c[P>>2]=c[E>>2]|0;c[P+4>>2]=c[E+4>>2]|0;c[P+8>>2]=c[E+8>>2]|0;Y=_;Z=W+1|0;break}P=N+12|0;if(aP[c[d>>2]&255](N,L)|0){$=P}else{Q=P;while(1){if((Q|0)==(L|0)){R=1143;break L1427}aa=Q+12|0;if(aP[c[d>>2]&255](N,Q)|0){break}else{Q=aa}}P=Q;c[D>>2]=c[P>>2]|0;c[D+4>>2]=c[P+4>>2]|0;c[D+8>>2]=c[P+8>>2]|0;c[P>>2]=c[M>>2]|0;c[P+4>>2]=c[M+4>>2]|0;c[P+8>>2]=c[M+8>>2]|0;c[M>>2]=c[D>>2]|0;c[M+4>>2]=c[D+4>>2]|0;c[M+8>>2]=c[D+8>>2]|0;$=aa}if(($|0)==(L|0)){R=1146;break L1427}else{ab=L;ac=$}while(1){P=ac;while(1){ad=P+12|0;if(aP[c[d>>2]&255](N,P)|0){ae=ab;break}else{P=ad}}while(1){af=ae-12|0;if(aP[c[d>>2]&255](N,af)|0){ae=af}else{break}}if(P>>>0>=af>>>0){N=P;continue L1429}X=P;c[C>>2]=c[X>>2]|0;c[C+4>>2]=c[X+4>>2]|0;c[C+8>>2]=c[X+8>>2]|0;T=af;c[X>>2]=c[T>>2]|0;c[X+4>>2]=c[T+4>>2]|0;c[X+8>>2]=c[T+8>>2]|0;c[T>>2]=c[C>>2]|0;c[T+4>>2]=c[C+4>>2]|0;c[T+8>>2]=c[C+8>>2]|0;ab=af;ac=ad}}}while(0);Q=N+12|0;L1472:do{if(Q>>>0<Y>>>0){T=Y;X=Q;U=Z;V=S;while(1){ag=X;while(1){ah=ag+12|0;if(aP[c[d>>2]&255](ag,V)|0){ag=ah}else{ai=T;break}}while(1){aj=ai-12|0;if(aP[c[d>>2]&255](aj,V)|0){break}else{ai=aj}}if(ag>>>0>aj>>>0){ak=ag;al=U;am=V;break L1472}P=ag;c[B>>2]=c[P>>2]|0;c[B+4>>2]=c[P+4>>2]|0;c[B+8>>2]=c[P+8>>2]|0;an=aj;c[P>>2]=c[an>>2]|0;c[P+4>>2]=c[an+4>>2]|0;c[P+8>>2]=c[an+8>>2]|0;c[an>>2]=c[B>>2]|0;c[an+4>>2]=c[B+4>>2]|0;c[an+8>>2]=c[B+8>>2]|0;T=aj;X=ah;U=U+1|0;V=(V|0)==(ag|0)?aj:V}}else{ak=Q;al=Z;am=S}}while(0);do{if((ak|0)==(am|0)){ao=al}else{if(!(aP[c[d>>2]&255](am,ak)|0)){ao=al;break}S=ak;c[A>>2]=c[S>>2]|0;c[A+4>>2]=c[S+4>>2]|0;c[A+8>>2]=c[S+8>>2]|0;Q=am;c[S>>2]=c[Q>>2]|0;c[S+4>>2]=c[Q+4>>2]|0;c[S+8>>2]=c[Q+8>>2]|0;c[Q>>2]=c[A>>2]|0;c[Q+4>>2]=c[A+4>>2]|0;c[Q+8>>2]=c[A+8>>2]|0;ao=al+1|0}}while(0);if((ao|0)==0){ap=b1(N,ak,d)|0;Q=ak+12|0;if(b1(Q,a,d)|0){R=1121;break}if(ap){N=Q;continue}}Q=ak;if((Q-O|0)>=(b-Q|0)){R=1125;break}bX(N,ak,d);N=ak+12|0}if((R|0)==1121){R=0;if(ap){R=1136;break}else{K=N;a=ak;continue}}else if((R|0)==1125){R=0;bX(ak+12|0,a,d);K=N;a=ak;continue}}if((R|0)==1143){i=e;return}else if((R|0)==1146){i=e;return}else if((R|0)==1052){ak=N+12|0;K=q;q=r;r=s;s=t;t=u;u=aP[c[d>>2]&255](ak,N)|0;ap=aP[c[d>>2]&255](L,ak)|0;if(!u){if(!ap){i=e;return}u=ak;c[t>>2]=c[u>>2]|0;c[t+4>>2]=c[u+4>>2]|0;c[t+8>>2]=c[u+8>>2]|0;c[u>>2]=c[M>>2]|0;c[u+4>>2]=c[M+4>>2]|0;c[u+8>>2]=c[M+8>>2]|0;c[M>>2]=c[t>>2]|0;c[M+4>>2]=c[t+4>>2]|0;c[M+8>>2]=c[t+8>>2]|0;if(!(aP[c[d>>2]&255](ak,N)|0)){i=e;return}t=N;c[r>>2]=c[t>>2]|0;c[r+4>>2]=c[t+4>>2]|0;c[r+8>>2]=c[t+8>>2]|0;c[t>>2]=c[u>>2]|0;c[t+4>>2]=c[u+4>>2]|0;c[t+8>>2]=c[u+8>>2]|0;c[u>>2]=c[r>>2]|0;c[u+4>>2]=c[r+4>>2]|0;c[u+8>>2]=c[r+8>>2]|0;i=e;return}r=N;if(ap){c[K>>2]=c[r>>2]|0;c[K+4>>2]=c[r+4>>2]|0;c[K+8>>2]=c[r+8>>2]|0;c[r>>2]=c[M>>2]|0;c[r+4>>2]=c[M+4>>2]|0;c[r+8>>2]=c[M+8>>2]|0;c[M>>2]=c[K>>2]|0;c[M+4>>2]=c[K+4>>2]|0;c[M+8>>2]=c[K+8>>2]|0;i=e;return}c[q>>2]=c[r>>2]|0;c[q+4>>2]=c[r+4>>2]|0;c[q+8>>2]=c[r+8>>2]|0;K=ak;c[r>>2]=c[K>>2]|0;c[r+4>>2]=c[K+4>>2]|0;c[r+8>>2]=c[K+8>>2]|0;c[K>>2]=c[q>>2]|0;c[K+4>>2]=c[q+4>>2]|0;c[K+8>>2]=c[q+8>>2]|0;if(!(aP[c[d>>2]&255](L,ak)|0)){i=e;return}c[s>>2]=c[K>>2]|0;c[s+4>>2]=c[K+4>>2]|0;c[s+8>>2]=c[K+8>>2]|0;c[K>>2]=c[M>>2]|0;c[K+4>>2]=c[M+4>>2]|0;c[K+8>>2]=c[M+8>>2]|0;c[M>>2]=c[s>>2]|0;c[M+4>>2]=c[s+4>>2]|0;c[M+8>>2]=c[s+8>>2]|0;i=e;return}else if((R|0)==1050){if(!(aP[c[d>>2]&255](L,N)|0)){i=e;return}s=v;v=N;c[s>>2]=c[v>>2]|0;c[s+4>>2]=c[v+4>>2]|0;c[s+8>>2]=c[v+8>>2]|0;c[v>>2]=c[M>>2]|0;c[v+4>>2]=c[M+4>>2]|0;c[v+8>>2]=c[M+8>>2]|0;c[M>>2]=c[s>>2]|0;c[M+4>>2]=c[s+4>>2]|0;c[M+8>>2]=c[s+8>>2]|0;i=e;return}else if((R|0)==1067){s=l;v=N+24|0;K=N+12|0;ak=f;f=g;g=h;h=j;j=k;k=aP[c[d>>2]&255](K,N)|0;q=aP[c[d>>2]&255](v,K)|0;do{if(k){r=N;if(q){c[ak>>2]=c[r>>2]|0;c[ak+4>>2]=c[r+4>>2]|0;c[ak+8>>2]=c[r+8>>2]|0;ap=v;c[r>>2]=c[ap>>2]|0;c[r+4>>2]=c[ap+4>>2]|0;c[r+8>>2]=c[ap+8>>2]|0;c[ap>>2]=c[ak>>2]|0;c[ap+4>>2]=c[ak+4>>2]|0;c[ap+8>>2]=c[ak+8>>2]|0;break}c[f>>2]=c[r>>2]|0;c[f+4>>2]=c[r+4>>2]|0;c[f+8>>2]=c[r+8>>2]|0;ap=K;c[r>>2]=c[ap>>2]|0;c[r+4>>2]=c[ap+4>>2]|0;c[r+8>>2]=c[ap+8>>2]|0;c[ap>>2]=c[f>>2]|0;c[ap+4>>2]=c[f+4>>2]|0;c[ap+8>>2]=c[f+8>>2]|0;if(!(aP[c[d>>2]&255](v,K)|0)){break}c[h>>2]=c[ap>>2]|0;c[h+4>>2]=c[ap+4>>2]|0;c[h+8>>2]=c[ap+8>>2]|0;r=v;c[ap>>2]=c[r>>2]|0;c[ap+4>>2]=c[r+4>>2]|0;c[ap+8>>2]=c[r+8>>2]|0;c[r>>2]=c[h>>2]|0;c[r+4>>2]=c[h+4>>2]|0;c[r+8>>2]=c[h+8>>2]|0}else{if(!q){break}r=K;c[j>>2]=c[r>>2]|0;c[j+4>>2]=c[r+4>>2]|0;c[j+8>>2]=c[r+8>>2]|0;ap=v;c[r>>2]=c[ap>>2]|0;c[r+4>>2]=c[ap+4>>2]|0;c[r+8>>2]=c[ap+8>>2]|0;c[ap>>2]=c[j>>2]|0;c[ap+4>>2]=c[j+4>>2]|0;c[ap+8>>2]=c[j+8>>2]|0;if(!(aP[c[d>>2]&255](K,N)|0)){break}ap=N;c[g>>2]=c[ap>>2]|0;c[g+4>>2]=c[ap+4>>2]|0;c[g+8>>2]=c[ap+8>>2]|0;c[ap>>2]=c[r>>2]|0;c[ap+4>>2]=c[r+4>>2]|0;c[ap+8>>2]=c[r+8>>2]|0;c[r>>2]=c[g>>2]|0;c[r+4>>2]=c[g+4>>2]|0;c[r+8>>2]=c[g+8>>2]|0}}while(0);g=N+36|0;if((g|0)==(a|0)){i=e;return}else{aq=v;ar=g}while(1){if(aP[c[d>>2]&255](ar,aq)|0){g=ar;c[s>>2]=c[g>>2]|0;c[s+4>>2]=c[g+4>>2]|0;c[s+8>>2]=c[g+8>>2]|0;g=aq;v=ar;while(1){K=v;as=g;c[K>>2]=c[as>>2]|0;c[K+4>>2]=c[as+4>>2]|0;c[K+8>>2]=c[as+8>>2]|0;if((g|0)==(N|0)){break}K=g-12|0;if(aP[c[d>>2]&255](l,K)|0){v=g;g=K}else{break}}c[as>>2]=c[s>>2]|0;c[as+4>>2]=c[s+4>>2]|0;c[as+8>>2]=c[s+8>>2]|0}g=ar+12|0;if((g|0)==(a|0)){break}else{aq=ar;ar=g}}i=e;return}else if((R|0)==1061){ar=N+12|0;aq=N+24|0;a=N+36|0;s=m;m=n;n=o;o=p;bY(N,ar,aq,a,d);if(!(aP[c[d>>2]&255](L,a)|0)){i=e;return}p=a;c[o>>2]=c[p>>2]|0;c[o+4>>2]=c[p+4>>2]|0;c[o+8>>2]=c[p+8>>2]|0;c[p>>2]=c[M>>2]|0;c[p+4>>2]=c[M+4>>2]|0;c[p+8>>2]=c[M+8>>2]|0;c[M>>2]=c[o>>2]|0;c[M+4>>2]=c[o+4>>2]|0;c[M+8>>2]=c[o+8>>2]|0;if(!(aP[c[d>>2]&255](a,aq)|0)){i=e;return}a=aq;c[m>>2]=c[a>>2]|0;c[m+4>>2]=c[a+4>>2]|0;c[m+8>>2]=c[a+8>>2]|0;c[a>>2]=c[p>>2]|0;c[a+4>>2]=c[p+4>>2]|0;c[a+8>>2]=c[p+8>>2]|0;c[p>>2]=c[m>>2]|0;c[p+4>>2]=c[m+4>>2]|0;c[p+8>>2]=c[m+8>>2]|0;if(!(aP[c[d>>2]&255](aq,ar)|0)){i=e;return}aq=ar;c[s>>2]=c[aq>>2]|0;c[s+4>>2]=c[aq+4>>2]|0;c[s+8>>2]=c[aq+8>>2]|0;c[aq>>2]=c[a>>2]|0;c[aq+4>>2]=c[a+4>>2]|0;c[aq+8>>2]=c[a+8>>2]|0;c[a>>2]=c[s>>2]|0;c[a+4>>2]=c[s+4>>2]|0;c[a+8>>2]=c[s+8>>2]|0;if(!(aP[c[d>>2]&255](ar,N)|0)){i=e;return}ar=N;c[n>>2]=c[ar>>2]|0;c[n+4>>2]=c[ar+4>>2]|0;c[n+8>>2]=c[ar+8>>2]|0;c[ar>>2]=c[aq>>2]|0;c[ar+4>>2]=c[aq+4>>2]|0;c[ar+8>>2]=c[aq+8>>2]|0;c[aq>>2]=c[n>>2]|0;c[aq+4>>2]=c[n+4>>2]|0;c[aq+8>>2]=c[n+8>>2]|0;i=e;return}else if((R|0)==1060){bY(N,N+12|0,N+24|0,L,d);i=e;return}else if((R|0)==1136){i=e;return}else if((R|0)==1138){i=e;return}}function bY(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;g=i;i=i+96|0;h=g+60|0;j=g+72|0;k=g+84|0;l=g|0;m=g+12|0;n=g+24|0;o=g+36|0;p=g+48|0;q=aP[c[f>>2]&255](b,a)|0;r=aP[c[f>>2]&255](d,b)|0;do{if(q){s=a;if(r){c[l>>2]=c[s>>2]|0;c[l+4>>2]=c[s+4>>2]|0;c[l+8>>2]=c[s+8>>2]|0;t=d;c[s>>2]=c[t>>2]|0;c[s+4>>2]=c[t+4>>2]|0;c[s+8>>2]=c[t+8>>2]|0;c[t>>2]=c[l>>2]|0;c[t+4>>2]=c[l+4>>2]|0;c[t+8>>2]=c[l+8>>2]|0;u=1;break}c[m>>2]=c[s>>2]|0;c[m+4>>2]=c[s+4>>2]|0;c[m+8>>2]=c[s+8>>2]|0;t=b;c[s>>2]=c[t>>2]|0;c[s+4>>2]=c[t+4>>2]|0;c[s+8>>2]=c[t+8>>2]|0;c[t>>2]=c[m>>2]|0;c[t+4>>2]=c[m+4>>2]|0;c[t+8>>2]=c[m+8>>2]|0;if(!(aP[c[f>>2]&255](d,b)|0)){u=1;break}c[o>>2]=c[t>>2]|0;c[o+4>>2]=c[t+4>>2]|0;c[o+8>>2]=c[t+8>>2]|0;s=d;c[t>>2]=c[s>>2]|0;c[t+4>>2]=c[s+4>>2]|0;c[t+8>>2]=c[s+8>>2]|0;c[s>>2]=c[o>>2]|0;c[s+4>>2]=c[o+4>>2]|0;c[s+8>>2]=c[o+8>>2]|0;u=2}else{if(!r){u=0;break}s=b;c[p>>2]=c[s>>2]|0;c[p+4>>2]=c[s+4>>2]|0;c[p+8>>2]=c[s+8>>2]|0;t=d;c[s>>2]=c[t>>2]|0;c[s+4>>2]=c[t+4>>2]|0;c[s+8>>2]=c[t+8>>2]|0;c[t>>2]=c[p>>2]|0;c[t+4>>2]=c[p+4>>2]|0;c[t+8>>2]=c[p+8>>2]|0;if(!(aP[c[f>>2]&255](b,a)|0)){u=1;break}t=a;c[n>>2]=c[t>>2]|0;c[n+4>>2]=c[t+4>>2]|0;c[n+8>>2]=c[t+8>>2]|0;c[t>>2]=c[s>>2]|0;c[t+4>>2]=c[s+4>>2]|0;c[t+8>>2]=c[s+8>>2]|0;c[s>>2]=c[n>>2]|0;c[s+4>>2]=c[n+4>>2]|0;c[s+8>>2]=c[n+8>>2]|0;u=2}}while(0);if(!(aP[c[f>>2]&255](e,d)|0)){v=u;i=g;return v|0}n=k;k=d;c[n>>2]=c[k>>2]|0;c[n+4>>2]=c[k+4>>2]|0;c[n+8>>2]=c[k+8>>2]|0;p=e;c[k>>2]=c[p>>2]|0;c[k+4>>2]=c[p+4>>2]|0;c[k+8>>2]=c[p+8>>2]|0;c[p>>2]=c[n>>2]|0;c[p+4>>2]=c[n+4>>2]|0;c[p+8>>2]=c[n+8>>2]|0;if(!(aP[c[f>>2]&255](d,b)|0)){v=u+1|0;i=g;return v|0}d=h;h=b;c[d>>2]=c[h>>2]|0;c[d+4>>2]=c[h+4>>2]|0;c[d+8>>2]=c[h+8>>2]|0;c[h>>2]=c[k>>2]|0;c[h+4>>2]=c[k+4>>2]|0;c[h+8>>2]=c[k+8>>2]|0;c[k>>2]=c[d>>2]|0;c[k+4>>2]=c[d+4>>2]|0;c[k+8>>2]=c[d+8>>2]|0;if(!(aP[c[f>>2]&255](b,a)|0)){v=u+2|0;i=g;return v|0}b=j;j=a;c[b>>2]=c[j>>2]|0;c[b+4>>2]=c[j+4>>2]|0;c[b+8>>2]=c[j+8>>2]|0;c[j>>2]=c[h>>2]|0;c[j+4>>2]=c[h+4>>2]|0;c[j+8>>2]=c[h+8>>2]|0;c[h>>2]=c[b>>2]|0;c[h+4>>2]=c[b+4>>2]|0;c[h+8>>2]=c[b+8>>2]|0;v=u+3|0;i=g;return v|0}function bZ(a,b){a=a|0;b=b|0;return}function b_(a,b){a=a|0;b=b|0;return}function b$(a,b,c){a=a|0;b=b|0;c=c|0;return}function b0(a,b,c){a=a|0;b=b|0;c=c|0;return}function b1(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;e=i;i=i+192|0;f=e|0;g=e+12|0;h=e+24|0;j=e+36|0;k=e+48|0;l=e+60|0;m=e+72|0;n=e+84|0;o=e+96|0;p=e+108|0;q=e+120|0;r=e+132|0;s=e+144|0;t=e+156|0;u=e+168|0;v=e+180|0;w=(b-a|0)/12&-1;if((w|0)==0|(w|0)==1){x=1;i=e;return x|0}else if((w|0)==4){bY(a,a+12|0,a+24|0,b-12|0,d);x=1;i=e;return x|0}else if((w|0)==3){y=a+12|0;z=b-12|0;A=p;p=q;q=r;r=s;s=t;t=aP[c[d>>2]&255](y,a)|0;B=aP[c[d>>2]&255](z,y)|0;if(!t){if(!B){x=1;i=e;return x|0}t=y;c[s>>2]=c[t>>2]|0;c[s+4>>2]=c[t+4>>2]|0;c[s+8>>2]=c[t+8>>2]|0;C=z;c[t>>2]=c[C>>2]|0;c[t+4>>2]=c[C+4>>2]|0;c[t+8>>2]=c[C+8>>2]|0;c[C>>2]=c[s>>2]|0;c[C+4>>2]=c[s+4>>2]|0;c[C+8>>2]=c[s+8>>2]|0;if(!(aP[c[d>>2]&255](y,a)|0)){x=1;i=e;return x|0}s=a;c[q>>2]=c[s>>2]|0;c[q+4>>2]=c[s+4>>2]|0;c[q+8>>2]=c[s+8>>2]|0;c[s>>2]=c[t>>2]|0;c[s+4>>2]=c[t+4>>2]|0;c[s+8>>2]=c[t+8>>2]|0;c[t>>2]=c[q>>2]|0;c[t+4>>2]=c[q+4>>2]|0;c[t+8>>2]=c[q+8>>2]|0;x=1;i=e;return x|0}q=a;if(B){c[A>>2]=c[q>>2]|0;c[A+4>>2]=c[q+4>>2]|0;c[A+8>>2]=c[q+8>>2]|0;B=z;c[q>>2]=c[B>>2]|0;c[q+4>>2]=c[B+4>>2]|0;c[q+8>>2]=c[B+8>>2]|0;c[B>>2]=c[A>>2]|0;c[B+4>>2]=c[A+4>>2]|0;c[B+8>>2]=c[A+8>>2]|0;x=1;i=e;return x|0}c[p>>2]=c[q>>2]|0;c[p+4>>2]=c[q+4>>2]|0;c[p+8>>2]=c[q+8>>2]|0;A=y;c[q>>2]=c[A>>2]|0;c[q+4>>2]=c[A+4>>2]|0;c[q+8>>2]=c[A+8>>2]|0;c[A>>2]=c[p>>2]|0;c[A+4>>2]=c[p+4>>2]|0;c[A+8>>2]=c[p+8>>2]|0;if(!(aP[c[d>>2]&255](z,y)|0)){x=1;i=e;return x|0}c[r>>2]=c[A>>2]|0;c[r+4>>2]=c[A+4>>2]|0;c[r+8>>2]=c[A+8>>2]|0;y=z;c[A>>2]=c[y>>2]|0;c[A+4>>2]=c[y+4>>2]|0;c[A+8>>2]=c[y+8>>2]|0;c[y>>2]=c[r>>2]|0;c[y+4>>2]=c[r+4>>2]|0;c[y+8>>2]=c[r+8>>2]|0;x=1;i=e;return x|0}else if((w|0)==2){r=b-12|0;if(!(aP[c[d>>2]&255](r,a)|0)){x=1;i=e;return x|0}y=u;u=a;c[y>>2]=c[u>>2]|0;c[y+4>>2]=c[u+4>>2]|0;c[y+8>>2]=c[u+8>>2]|0;A=r;c[u>>2]=c[A>>2]|0;c[u+4>>2]=c[A+4>>2]|0;c[u+8>>2]=c[A+8>>2]|0;c[A>>2]=c[y>>2]|0;c[A+4>>2]=c[y+4>>2]|0;c[A+8>>2]=c[y+8>>2]|0;x=1;i=e;return x|0}else if((w|0)==5){w=a+12|0;y=a+24|0;A=a+36|0;u=b-12|0;r=l;l=m;m=n;n=o;bY(a,w,y,A,d);if(!(aP[c[d>>2]&255](u,A)|0)){x=1;i=e;return x|0}o=A;c[n>>2]=c[o>>2]|0;c[n+4>>2]=c[o+4>>2]|0;c[n+8>>2]=c[o+8>>2]|0;z=u;c[o>>2]=c[z>>2]|0;c[o+4>>2]=c[z+4>>2]|0;c[o+8>>2]=c[z+8>>2]|0;c[z>>2]=c[n>>2]|0;c[z+4>>2]=c[n+4>>2]|0;c[z+8>>2]=c[n+8>>2]|0;if(!(aP[c[d>>2]&255](A,y)|0)){x=1;i=e;return x|0}A=y;c[l>>2]=c[A>>2]|0;c[l+4>>2]=c[A+4>>2]|0;c[l+8>>2]=c[A+8>>2]|0;c[A>>2]=c[o>>2]|0;c[A+4>>2]=c[o+4>>2]|0;c[A+8>>2]=c[o+8>>2]|0;c[o>>2]=c[l>>2]|0;c[o+4>>2]=c[l+4>>2]|0;c[o+8>>2]=c[l+8>>2]|0;if(!(aP[c[d>>2]&255](y,w)|0)){x=1;i=e;return x|0}y=w;c[r>>2]=c[y>>2]|0;c[r+4>>2]=c[y+4>>2]|0;c[r+8>>2]=c[y+8>>2]|0;c[y>>2]=c[A>>2]|0;c[y+4>>2]=c[A+4>>2]|0;c[y+8>>2]=c[A+8>>2]|0;c[A>>2]=c[r>>2]|0;c[A+4>>2]=c[r+4>>2]|0;c[A+8>>2]=c[r+8>>2]|0;if(!(aP[c[d>>2]&255](w,a)|0)){x=1;i=e;return x|0}w=a;c[m>>2]=c[w>>2]|0;c[m+4>>2]=c[w+4>>2]|0;c[m+8>>2]=c[w+8>>2]|0;c[w>>2]=c[y>>2]|0;c[w+4>>2]=c[y+4>>2]|0;c[w+8>>2]=c[y+8>>2]|0;c[y>>2]=c[m>>2]|0;c[y+4>>2]=c[m+4>>2]|0;c[y+8>>2]=c[m+8>>2]|0;x=1;i=e;return x|0}else{m=a+24|0;y=a+12|0;w=f;f=g;g=h;h=j;j=k;k=aP[c[d>>2]&255](y,a)|0;r=aP[c[d>>2]&255](m,y)|0;do{if(k){A=a;if(r){c[w>>2]=c[A>>2]|0;c[w+4>>2]=c[A+4>>2]|0;c[w+8>>2]=c[A+8>>2]|0;l=m;c[A>>2]=c[l>>2]|0;c[A+4>>2]=c[l+4>>2]|0;c[A+8>>2]=c[l+8>>2]|0;c[l>>2]=c[w>>2]|0;c[l+4>>2]=c[w+4>>2]|0;c[l+8>>2]=c[w+8>>2]|0;break}c[f>>2]=c[A>>2]|0;c[f+4>>2]=c[A+4>>2]|0;c[f+8>>2]=c[A+8>>2]|0;l=y;c[A>>2]=c[l>>2]|0;c[A+4>>2]=c[l+4>>2]|0;c[A+8>>2]=c[l+8>>2]|0;c[l>>2]=c[f>>2]|0;c[l+4>>2]=c[f+4>>2]|0;c[l+8>>2]=c[f+8>>2]|0;if(!(aP[c[d>>2]&255](m,y)|0)){break}c[h>>2]=c[l>>2]|0;c[h+4>>2]=c[l+4>>2]|0;c[h+8>>2]=c[l+8>>2]|0;A=m;c[l>>2]=c[A>>2]|0;c[l+4>>2]=c[A+4>>2]|0;c[l+8>>2]=c[A+8>>2]|0;c[A>>2]=c[h>>2]|0;c[A+4>>2]=c[h+4>>2]|0;c[A+8>>2]=c[h+8>>2]|0}else{if(!r){break}A=y;c[j>>2]=c[A>>2]|0;c[j+4>>2]=c[A+4>>2]|0;c[j+8>>2]=c[A+8>>2]|0;l=m;c[A>>2]=c[l>>2]|0;c[A+4>>2]=c[l+4>>2]|0;c[A+8>>2]=c[l+8>>2]|0;c[l>>2]=c[j>>2]|0;c[l+4>>2]=c[j+4>>2]|0;c[l+8>>2]=c[j+8>>2]|0;if(!(aP[c[d>>2]&255](y,a)|0)){break}l=a;c[g>>2]=c[l>>2]|0;c[g+4>>2]=c[l+4>>2]|0;c[g+8>>2]=c[l+8>>2]|0;c[l>>2]=c[A>>2]|0;c[l+4>>2]=c[A+4>>2]|0;c[l+8>>2]=c[A+8>>2]|0;c[A>>2]=c[g>>2]|0;c[A+4>>2]=c[g+4>>2]|0;c[A+8>>2]=c[g+8>>2]|0}}while(0);g=a+36|0;if((g|0)==(b|0)){x=1;i=e;return x|0}y=v;j=m;m=0;r=g;while(1){if(aP[c[d>>2]&255](r,j)|0){g=r;c[y>>2]=c[g>>2]|0;c[y+4>>2]=c[g+4>>2]|0;c[y+8>>2]=c[g+8>>2]|0;g=j;h=r;while(1){f=h;D=g;c[f>>2]=c[D>>2]|0;c[f+4>>2]=c[D+4>>2]|0;c[f+8>>2]=c[D+8>>2]|0;if((g|0)==(a|0)){break}f=g-12|0;if(aP[c[d>>2]&255](v,f)|0){h=g;g=f}else{break}}c[D>>2]=c[y>>2]|0;c[D+4>>2]=c[y+4>>2]|0;c[D+8>>2]=c[y+8>>2]|0;g=m+1|0;if((g|0)==8){break}else{E=g}}else{E=m}g=r+12|0;if((g|0)==(b|0)){x=1;F=1205;break}else{j=r;m=E;r=g}}if((F|0)==1205){i=e;return x|0}x=(r+12|0)==(b|0);i=e;return x|0}return 0}function b2(a){a=a|0;de(a);return}function b3(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;if((c[b+28>>2]|0)!=0){ax(5245908,72,5247876,5246368)}e=b+12|0;f=c[e>>2]|0;g=aJ[c[(c[f>>2]|0)+12>>2]&255](f)|0;f=b+24|0;b=c[f>>2]|0;h=b;i=g*28&-1;L1662:do{if((i|0)!=0){do{if((i|0)>0){if((i|0)<=640){break}dd(h);break L1662}else{ax(5243252,164,5249496,5244764)}}while(0);g=a[i+5251696|0]|0;if((g&255)>=14){ax(5243252,173,5249496,5244088)}j=d+12+((g&255)<<2)|0;c[b>>2]=c[j>>2]|0;c[j>>2]=b}}while(0);c[f>>2]=0;f=c[e>>2]|0;b=c[f+4>>2]|0;if((b|0)==3){aH[c[c[f>>2]>>2]&255](f);i=a[5251736]|0;if((i&255)>=14){ax(5243252,173,5249496,5244088)}h=d+12+((i&255)<<2)|0;c[f>>2]=c[h>>2]|0;c[h>>2]=f;c[e>>2]=0;return}else if((b|0)==2){aH[c[c[f>>2]>>2]&255](f);h=a[5251848]|0;if((h&255)>=14){ax(5243252,173,5249496,5244088)}i=d+12+((h&255)<<2)|0;c[f>>2]=c[i>>2]|0;c[i>>2]=f;c[e>>2]=0;return}else if((b|0)==1){aH[c[c[f>>2]>>2]&255](f);i=a[5251744]|0;if((i&255)>=14){ax(5243252,173,5249496,5244088)}h=d+12+((i&255)<<2)|0;c[f>>2]=c[h>>2]|0;c[h>>2]=f;c[e>>2]=0;return}else if((b|0)==0){aH[c[c[f>>2]>>2]&255](f);b=a[5251716]|0;if((b&255)>=14){ax(5243252,173,5249496,5244088)}h=d+12+((b&255)<<2)|0;c[f>>2]=c[h>>2]|0;c[h>>2]=f;c[e>>2]=0;return}else{ax(5245908,115,5247876,5245900);c[e>>2]=0;return}}function b4(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0.0,K=0.0,L=0.0,M=0.0,N=0,O=0,P=0;f=i;i=i+40|0;h=f|0;j=f+16|0;l=f+32|0;m=a+28|0;if((c[m>>2]|0)<=0){i=f;return}n=a+24|0;o=a+12|0;a=h|0;p=j|0;q=h+4|0;r=j+4|0;s=h+8|0;t=j+8|0;u=h+12|0;v=j+12|0;w=e|0;x=d|0;y=e+4|0;z=d+4|0;A=l|0;B=l+4|0;C=b|0;D=b+40|0;E=b+36|0;F=b+32|0;b=0;while(1){G=c[n>>2]|0;H=c[o>>2]|0;I=G+(b*28&-1)+20|0;aQ[c[(c[H>>2]|0)+24>>2]&255](H,h,d,c[I>>2]|0);H=c[o>>2]|0;aQ[c[(c[H>>2]|0)+24>>2]&255](H,j,e,c[I>>2]|0);I=G+(b*28&-1)|0;J=+g[a>>2];K=+g[p>>2];L=+g[q>>2];M=+g[r>>2];H=I;N=(g[k>>2]=J<K?J:K,c[k>>2]|0);O=(g[k>>2]=L<M?L:M,c[k>>2]|0)|0;c[H>>2]=0|N;c[H+4>>2]=O;M=+g[s>>2];L=+g[t>>2];K=+g[u>>2];J=+g[v>>2];O=G+(b*28&-1)+8|0;H=(g[k>>2]=M>L?M:L,c[k>>2]|0);N=(g[k>>2]=K>J?K:J,c[k>>2]|0)|0;c[O>>2]=0|H;c[O+4>>2]=N;J=+g[y>>2]- +g[z>>2];g[A>>2]=+g[w>>2]- +g[x>>2];g[B>>2]=J;N=c[G+(b*28&-1)+24>>2]|0;if(bp(C,N,I,l)|0){I=c[D>>2]|0;if((I|0)==(c[E>>2]|0)){G=c[F>>2]|0;c[E>>2]=I<<1;O=dc(I<<3)|0;c[F>>2]=O;H=G;dh(O,H,c[D>>2]<<2);dd(H);P=c[D>>2]|0}else{P=I}c[(c[F>>2]|0)+(P<<2)>>2]=N;c[D>>2]=(c[D>>2]|0)+1|0}N=b+1|0;if((N|0)<(c[m>>2]|0)){b=N}else{break}}i=f;return}function b5(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;i=b+40|0;c[i>>2]=d;c[b+44>>2]=e;c[b+48>>2]=f;c[b+28>>2]=0;c[b+36>>2]=0;c[b+32>>2]=0;j=b|0;c[j>>2]=g;c[b+4>>2]=h;h=d<<2;d=g+102796|0;k=c[d>>2]|0;if((k|0)<32){l=k}else{ax(5243112,38,5249276,5244052);l=c[d>>2]|0}k=g+102412+(l*12&-1)|0;c[g+102412+(l*12&-1)+4>>2]=h;m=g+102400|0;n=c[m>>2]|0;if((n+h|0)>102400){c[k>>2]=dc(h)|0;a[g+102412+(l*12&-1)+8|0]=1}else{c[k>>2]=g+n|0;a[g+102412+(l*12&-1)+8|0]=0;c[m>>2]=(c[m>>2]|0)+h|0}m=g+102404|0;l=(c[m>>2]|0)+h|0;c[m>>2]=l;m=g+102408|0;g=c[m>>2]|0;c[m>>2]=(g|0)>(l|0)?g:l;c[d>>2]=(c[d>>2]|0)+1|0;c[b+8>>2]=c[k>>2]|0;k=c[j>>2]|0;d=e<<2;e=k+102796|0;l=c[e>>2]|0;if((l|0)<32){o=l}else{ax(5243112,38,5249276,5244052);o=c[e>>2]|0}l=k+102412+(o*12&-1)|0;c[k+102412+(o*12&-1)+4>>2]=d;g=k+102400|0;m=c[g>>2]|0;if((m+d|0)>102400){c[l>>2]=dc(d)|0;a[k+102412+(o*12&-1)+8|0]=1}else{c[l>>2]=k+m|0;a[k+102412+(o*12&-1)+8|0]=0;c[g>>2]=(c[g>>2]|0)+d|0}g=k+102404|0;o=(c[g>>2]|0)+d|0;c[g>>2]=o;g=k+102408|0;k=c[g>>2]|0;c[g>>2]=(k|0)>(o|0)?k:o;c[e>>2]=(c[e>>2]|0)+1|0;c[b+12>>2]=c[l>>2]|0;l=c[j>>2]|0;e=f<<2;f=l+102796|0;o=c[f>>2]|0;if((o|0)<32){p=o}else{ax(5243112,38,5249276,5244052);p=c[f>>2]|0}o=l+102412+(p*12&-1)|0;c[l+102412+(p*12&-1)+4>>2]=e;k=l+102400|0;g=c[k>>2]|0;if((g+e|0)>102400){c[o>>2]=dc(e)|0;a[l+102412+(p*12&-1)+8|0]=1}else{c[o>>2]=l+g|0;a[l+102412+(p*12&-1)+8|0]=0;c[k>>2]=(c[k>>2]|0)+e|0}k=l+102404|0;p=(c[k>>2]|0)+e|0;c[k>>2]=p;k=l+102408|0;l=c[k>>2]|0;c[k>>2]=(l|0)>(p|0)?l:p;c[f>>2]=(c[f>>2]|0)+1|0;c[b+16>>2]=c[o>>2]|0;o=c[j>>2]|0;f=(c[i>>2]|0)*12&-1;p=o+102796|0;l=c[p>>2]|0;if((l|0)<32){q=l}else{ax(5243112,38,5249276,5244052);q=c[p>>2]|0}l=o+102412+(q*12&-1)|0;c[o+102412+(q*12&-1)+4>>2]=f;k=o+102400|0;e=c[k>>2]|0;if((e+f|0)>102400){c[l>>2]=dc(f)|0;a[o+102412+(q*12&-1)+8|0]=1}else{c[l>>2]=o+e|0;a[o+102412+(q*12&-1)+8|0]=0;c[k>>2]=(c[k>>2]|0)+f|0}k=o+102404|0;q=(c[k>>2]|0)+f|0;c[k>>2]=q;k=o+102408|0;o=c[k>>2]|0;c[k>>2]=(o|0)>(q|0)?o:q;c[p>>2]=(c[p>>2]|0)+1|0;c[b+24>>2]=c[l>>2]|0;l=c[j>>2]|0;j=(c[i>>2]|0)*12&-1;i=l+102796|0;p=c[i>>2]|0;if((p|0)<32){r=p}else{ax(5243112,38,5249276,5244052);r=c[i>>2]|0}p=l+102412+(r*12&-1)|0;c[l+102412+(r*12&-1)+4>>2]=j;q=l+102400|0;o=c[q>>2]|0;if((o+j|0)>102400){c[p>>2]=dc(j)|0;a[l+102412+(r*12&-1)+8|0]=1;k=l+102404|0;f=c[k>>2]|0;e=f+j|0;c[k>>2]=e;g=l+102408|0;d=c[g>>2]|0;m=(d|0)>(e|0);h=m?d:e;c[g>>2]=h;n=c[i>>2]|0;s=n+1|0;c[i>>2]=s;t=p|0;u=c[t>>2]|0;v=u;w=b+20|0;c[w>>2]=v;return}else{c[p>>2]=l+o|0;a[l+102412+(r*12&-1)+8|0]=0;c[q>>2]=(c[q>>2]|0)+j|0;k=l+102404|0;f=c[k>>2]|0;e=f+j|0;c[k>>2]=e;g=l+102408|0;d=c[g>>2]|0;m=(d|0)>(e|0);h=m?d:e;c[g>>2]=h;n=c[i>>2]|0;s=n+1|0;c[i>>2]=s;t=p|0;u=c[t>>2]|0;v=u;w=b+20|0;c[w>>2]=v;return}}function b6(d,e,f,h,j){d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0.0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0.0,D=0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,O=0.0,R=0.0,S=0,T=0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0.0,af=0.0,ag=0;l=i;i=i+148|0;m=l|0;n=l+20|0;o=l+52|0;p=l+96|0;q=+g[f>>2];r=d+28|0;L1747:do{if((c[r>>2]|0)>0){s=d+8|0;t=h|0;u=h+4|0;v=d+20|0;w=d+24|0;x=0;while(1){y=c[(c[s>>2]|0)+(x<<2)>>2]|0;z=y+44|0;A=c[z>>2]|0;B=c[z+4>>2]|0;C=+g[y+56>>2];z=y+64|0;D=c[z+4>>2]|0;E=(c[k>>2]=c[z>>2]|0,+g[k>>2]);F=(c[k>>2]=D,+g[k>>2]);G=+g[y+72>>2];D=y+36|0;c[D>>2]=A;c[D+4>>2]=B;g[y+52>>2]=C;if((c[y>>2]|0)==2){H=+g[y+140>>2];I=+g[y+120>>2];J=1.0-q*+g[y+132>>2];K=J<1.0?J:1.0;J=K<0.0?0.0:K;K=1.0-q*+g[y+136>>2];L=K<1.0?K:1.0;M=(G+q*+g[y+128>>2]*+g[y+84>>2])*(L<0.0?0.0:L);O=(E+q*(H*+g[t>>2]+I*+g[y+76>>2]))*J;R=(F+q*(H*+g[u>>2]+I*+g[y+80>>2]))*J}else{M=G;O=E;R=F}y=(c[v>>2]|0)+(x*12&-1)|0;c[y>>2]=A;c[y+4>>2]=B;g[(c[v>>2]|0)+(x*12&-1)+8>>2]=C;B=(c[w>>2]|0)+(x*12&-1)|0;y=(g[k>>2]=O,c[k>>2]|0);A=(g[k>>2]=R,c[k>>2]|0)|0;c[B>>2]=0|y;c[B+4>>2]=A;g[(c[w>>2]|0)+(x*12&-1)+8>>2]=M;A=x+1|0;if((A|0)<(c[r>>2]|0)){x=A}else{S=v;T=w;break L1747}}}else{S=d+20|0;T=d+24|0}}while(0);h=n;w=f;c[h>>2]=c[w>>2]|0;c[h+4>>2]=c[w+4>>2]|0;c[h+8>>2]=c[w+8>>2]|0;c[h+12>>2]=c[w+12>>2]|0;c[h+16>>2]=c[w+16>>2]|0;c[h+20>>2]=c[w+20>>2]|0;h=c[S>>2]|0;c[n+24>>2]=h;v=c[T>>2]|0;c[n+28>>2]=v;x=o;c[x>>2]=c[w>>2]|0;c[x+4>>2]=c[w+4>>2]|0;c[x+8>>2]=c[w+8>>2]|0;c[x+12>>2]=c[w+12>>2]|0;c[x+16>>2]=c[w+16>>2]|0;c[x+20>>2]=c[w+20>>2]|0;w=d+12|0;c[o+24>>2]=c[w>>2]|0;x=d+36|0;c[o+28>>2]=c[x>>2]|0;c[o+32>>2]=h;c[o+36>>2]=v;c[o+40>>2]=c[d>>2]|0;cz(p,o);cA(p);if((a[f+20|0]&1)<<24>>24!=0){cB(p)}o=d+32|0;L1760:do{if((c[o>>2]|0)>0){v=d+16|0;h=0;while(1){u=c[(c[v>>2]|0)+(h<<2)>>2]|0;aI[c[(c[u>>2]|0)+28>>2]&255](u,n);u=h+1|0;if((u|0)<(c[o>>2]|0)){h=u}else{break L1760}}}}while(0);g[e+12>>2]=0.0;h=f+12|0;L1766:do{if((c[h>>2]|0)>0){v=d+16|0;u=0;while(1){L1770:do{if((c[o>>2]|0)>0){t=0;while(1){s=c[(c[v>>2]|0)+(t<<2)>>2]|0;aI[c[(c[s>>2]|0)+32>>2]&255](s,n);s=t+1|0;if((s|0)<(c[o>>2]|0)){t=s}else{break L1770}}}}while(0);cC(p);t=u+1|0;if((t|0)<(c[h>>2]|0)){u=t}else{break L1766}}}}while(0);h=c[p+48>>2]|0;L1777:do{if((h|0)>0){u=c[p+40>>2]|0;v=c[p+44>>2]|0;t=0;while(1){s=c[v+(c[u+(t*152&-1)+148>>2]<<2)>>2]|0;A=u+(t*152&-1)+144|0;L1781:do{if((c[A>>2]|0)>0){B=0;while(1){g[s+64+(B*20&-1)+8>>2]=+g[u+(t*152&-1)+(B*36&-1)+16>>2];g[s+64+(B*20&-1)+12>>2]=+g[u+(t*152&-1)+(B*36&-1)+20>>2];y=B+1|0;if((y|0)<(c[A>>2]|0)){B=y}else{break L1781}}}}while(0);A=t+1|0;if((A|0)<(h|0)){t=A}else{break L1777}}}}while(0);g[e+16>>2]=0.0;L1786:do{if((c[r>>2]|0)>0){h=0;while(1){t=c[S>>2]|0;u=t+(h*12&-1)|0;v=c[u+4>>2]|0;M=(c[k>>2]=c[u>>2]|0,+g[k>>2]);R=(c[k>>2]=v,+g[k>>2]);O=+g[t+(h*12&-1)+8>>2];t=c[T>>2]|0;v=t+(h*12&-1)|0;A=c[v+4>>2]|0;C=(c[k>>2]=c[v>>2]|0,+g[k>>2]);F=(c[k>>2]=A,+g[k>>2]);E=+g[t+(h*12&-1)+8>>2];G=q*C;J=q*F;I=G*G+J*J;if(I>4.0){J=2.0/+N(I);U=C*J;V=F*J}else{U=C;V=F}F=q*E;if(F*F>2.4674012660980225){if(F>0.0){W=F}else{W=-0.0-F}X=E*(1.5707963705062866/W)}else{X=E}t=(g[k>>2]=M+q*U,c[k>>2]|0);A=(g[k>>2]=R+q*V,c[k>>2]|0)|0;c[u>>2]=0|t;c[u+4>>2]=A;g[(c[S>>2]|0)+(h*12&-1)+8>>2]=O+q*X;A=(c[T>>2]|0)+(h*12&-1)|0;u=(g[k>>2]=U,c[k>>2]|0);t=(g[k>>2]=V,c[k>>2]|0)|0;c[A>>2]=0|u;c[A+4>>2]=t;g[(c[T>>2]|0)+(h*12&-1)+8>>2]=X;t=h+1|0;if((t|0)<(c[r>>2]|0)){h=t}else{break L1786}}}}while(0);h=f+16|0;f=d+16|0;t=0;while(1){if((t|0)>=(c[h>>2]|0)){Y=1;break}A=cD(p)|0;L1803:do{if((c[o>>2]|0)>0){u=1;v=0;while(1){s=c[(c[f>>2]|0)+(v<<2)>>2]|0;B=u&aP[c[(c[s>>2]|0)+36>>2]&255](s,n);s=v+1|0;if((s|0)<(c[o>>2]|0)){u=B;v=s}else{Z=B;break L1803}}}else{Z=1}}while(0);if(A&Z){Y=0;break}else{t=t+1|0}}L1809:do{if((c[r>>2]|0)>0){t=d+8|0;Z=0;while(1){o=c[(c[t>>2]|0)+(Z<<2)>>2]|0;n=(c[S>>2]|0)+(Z*12&-1)|0;f=o+44|0;h=c[n>>2]|0;v=c[n+4>>2]|0;c[f>>2]=h;c[f+4>>2]=v;X=+g[(c[S>>2]|0)+(Z*12&-1)+8>>2];g[o+56>>2]=X;f=(c[T>>2]|0)+(Z*12&-1)|0;n=o+64|0;u=c[f+4>>2]|0;c[n>>2]=c[f>>2]|0;c[n+4>>2]=u;g[o+72>>2]=+g[(c[T>>2]|0)+(Z*12&-1)+8>>2];V=+Q(X);g[o+20>>2]=V;U=+P(X);g[o+24>>2]=U;X=+g[o+28>>2];W=+g[o+32>>2];O=(c[k>>2]=h,+g[k>>2])-(U*X-V*W);R=(c[k>>2]=v,+g[k>>2])-(V*X+U*W);v=o+12|0;o=(g[k>>2]=O,c[k>>2]|0);h=(g[k>>2]=R,c[k>>2]|0)|0;c[v>>2]=0|o;c[v+4>>2]=h;h=Z+1|0;if((h|0)<(c[r>>2]|0)){Z=h}else{break L1809}}}}while(0);g[e+20>>2]=0.0;e=c[p+40>>2]|0;T=d+4|0;L1814:do{if((c[T>>2]|0)!=0){if((c[x>>2]|0)<=0){break}S=m+16|0;Z=0;while(1){t=c[(c[w>>2]|0)+(Z<<2)>>2]|0;A=c[e+(Z*152&-1)+144>>2]|0;c[S>>2]=A;L1819:do{if((A|0)>0){h=0;while(1){g[m+(h<<2)>>2]=+g[e+(Z*152&-1)+(h*36&-1)+16>>2];g[m+8+(h<<2)>>2]=+g[e+(Z*152&-1)+(h*36&-1)+20>>2];v=h+1|0;if((v|0)==(A|0)){break L1819}else{h=v}}}}while(0);A=c[T>>2]|0;aL[c[(c[A>>2]|0)+20>>2]&255](A,t,m);A=Z+1|0;if((A|0)<(c[x>>2]|0)){Z=A}else{break L1814}}}}while(0);if(!j){_=p+32|0;$=c[_>>2]|0;aa=e;bL($,aa);ab=p+36|0;ac=c[ab>>2]|0;ad=ac;bL($,ad);i=l;return}j=c[r>>2]|0;L1828:do{if((j|0)>0){x=d+8|0;R=3.4028234663852886e+38;m=0;while(1){T=c[(c[x>>2]|0)+(m<<2)>>2]|0;L1832:do{if((c[T>>2]|0)==0){ae=R}else{do{if((b[T+4>>1]&4)<<16>>16!=0){O=+g[T+72>>2];if(O*O>.001218469929881394){break}O=+g[T+64>>2];W=+g[T+68>>2];if(O*O+W*W>9999999747378752.0e-20){break}w=T+144|0;W=q+ +g[w>>2];g[w>>2]=W;ae=R<W?R:W;break L1832}}while(0);g[T+144>>2]=0.0;ae=0.0}}while(0);T=m+1|0;t=c[r>>2]|0;if((T|0)<(t|0)){R=ae;m=T}else{af=ae;ag=t;break L1828}}}else{af=3.4028234663852886e+38;ag=j}}while(0);if(!((ag|0)>0&((af<.5|Y)^1))){_=p+32|0;$=c[_>>2]|0;aa=e;bL($,aa);ab=p+36|0;ac=c[ab>>2]|0;ad=ac;bL($,ad);i=l;return}Y=d+8|0;d=0;while(1){ag=c[(c[Y>>2]|0)+(d<<2)>>2]|0;j=ag+4|0;b[j>>1]=b[j>>1]&-3;g[ag+144>>2]=0.0;j=ag+64|0;c[j>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;c[j+16>>2]=0;c[j+20>>2]=0;j=d+1|0;if((j|0)<(c[r>>2]|0)){d=j}else{break}}_=p+32|0;$=c[_>>2]|0;aa=e;bL($,aa);ab=p+36|0;ac=c[ab>>2]|0;ad=ac;bL($,ad);i=l;return}function b7(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0;e=b|0;f=b+8|0;c[f>>2]=128;c[b+4>>2]=0;h=dc(1024)|0;c[b>>2]=h;di(h|0,0,c[f>>2]<<3|0);di(b+12|0,0,56);if((a[5251692]&1)<<24>>24==0){f=0;h=1;while(1){if((f|0)>=14){ax(5243252,73,5249416,5245672)}if((h|0)>(c[5252340+(f<<2)>>2]|0)){i=f+1|0;a[h+5251696|0]=i&255;j=i}else{a[h+5251696|0]=f&255;j=f}i=h+1|0;if((i|0)==641){break}else{f=j;h=i}}a[5251692]=1}c[b+102468>>2]=0;c[b+102472>>2]=0;c[b+102476>>2]=0;c[b+102864>>2]=0;a6(b+102872|0);c[b+102932>>2]=0;c[b+102936>>2]=0;c[b+102940>>2]=5242940;c[b+102944>>2]=5242936;h=b+102948|0;c[b+102980>>2]=0;c[b+102984>>2]=0;j=h;c[j>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;c[j+16>>2]=0;a[b+102992|0]=1;a[b+102993|0]=1;a[b+102994|0]=0;a[b+102995|0]=1;a[b+102976|0]=1;j=d;d=b+102968|0;f=c[j+4>>2]|0;c[d>>2]=c[j>>2]|0;c[d+4>>2]=f;c[b+102868>>2]=4;g[b+102988>>2]=0.0;c[h>>2]=e;di(b+102996|0,0,32);return}function b8(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0,O=0,R=0,S=0,T=0,U=0;f=i;i=i+116|0;h=f|0;j=f+20|0;l=f+64|0;m=a+28|0;n=c[m>>2]|0;if((n|0)>(d|0)){o=n}else{ax(5245628,386,5248080,5246312);o=c[m>>2]|0}if((o|0)>(e|0)){p=o}else{ax(5245628,387,5248080,5245352);p=c[m>>2]|0}L1867:do{if((p|0)>0){o=a+8|0;n=a+20|0;q=a+24|0;r=0;while(1){s=c[(c[o>>2]|0)+(r<<2)>>2]|0;t=s+44|0;u=(c[n>>2]|0)+(r*12&-1)|0;v=c[t+4>>2]|0;c[u>>2]=c[t>>2]|0;c[u+4>>2]=v;g[(c[n>>2]|0)+(r*12&-1)+8>>2]=+g[s+56>>2];v=s+64|0;u=(c[q>>2]|0)+(r*12&-1)|0;t=c[v+4>>2]|0;c[u>>2]=c[v>>2]|0;c[u+4>>2]=t;g[(c[q>>2]|0)+(r*12&-1)+8>>2]=+g[s+72>>2];s=r+1|0;if((s|0)<(c[m>>2]|0)){r=s}else{w=n;x=q;break L1867}}}else{w=a+20|0;x=a+24|0}}while(0);p=a+12|0;c[j+24>>2]=c[p>>2]|0;q=a+36|0;c[j+28>>2]=c[q>>2]|0;c[j+40>>2]=c[a>>2]|0;n=j;r=b;c[n>>2]=c[r>>2]|0;c[n+4>>2]=c[r+4>>2]|0;c[n+8>>2]=c[r+8>>2]|0;c[n+12>>2]=c[r+12>>2]|0;c[n+16>>2]=c[r+16>>2]|0;c[n+20>>2]=c[r+20>>2]|0;c[j+32>>2]=c[w>>2]|0;c[j+36>>2]=c[x>>2]|0;cz(l,j);j=b+16|0;r=0;while(1){if((r|0)>=(c[j>>2]|0)){break}if(cI(l,d,e)|0){break}else{r=r+1|0}}r=a+8|0;j=(c[w>>2]|0)+(d*12&-1)|0;n=(c[(c[r>>2]|0)+(d<<2)>>2]|0)+36|0;o=c[j+4>>2]|0;c[n>>2]=c[j>>2]|0;c[n+4>>2]=o;g[(c[(c[r>>2]|0)+(d<<2)>>2]|0)+52>>2]=+g[(c[w>>2]|0)+(d*12&-1)+8>>2];d=(c[w>>2]|0)+(e*12&-1)|0;o=(c[(c[r>>2]|0)+(e<<2)>>2]|0)+36|0;n=c[d+4>>2]|0;c[o>>2]=c[d>>2]|0;c[o+4>>2]=n;g[(c[(c[r>>2]|0)+(e<<2)>>2]|0)+52>>2]=+g[(c[w>>2]|0)+(e*12&-1)+8>>2];cA(l);e=b+12|0;L1879:do{if((c[e>>2]|0)>0){n=0;while(1){cC(l);o=n+1|0;if((o|0)<(c[e>>2]|0)){n=o}else{break L1879}}}}while(0);y=+g[b>>2];L1884:do{if((c[m>>2]|0)>0){b=0;while(1){e=c[w>>2]|0;n=e+(b*12&-1)|0;o=c[n+4>>2]|0;z=(c[k>>2]=c[n>>2]|0,+g[k>>2]);A=(c[k>>2]=o,+g[k>>2]);B=+g[e+(b*12&-1)+8>>2];e=c[x>>2]|0;o=e+(b*12&-1)|0;d=c[o+4>>2]|0;C=(c[k>>2]=c[o>>2]|0,+g[k>>2]);D=(c[k>>2]=d,+g[k>>2]);E=+g[e+(b*12&-1)+8>>2];F=y*C;G=y*D;H=F*F+G*G;if(H>4.0){G=2.0/+N(H);I=C*G;J=D*G}else{I=C;J=D}D=y*E;if(D*D>2.4674012660980225){if(D>0.0){K=D}else{K=-0.0-D}L=E*(1.5707963705062866/K)}else{L=E}E=z+y*I;z=A+y*J;A=B+y*L;e=(g[k>>2]=E,c[k>>2]|0);d=0|e;e=(g[k>>2]=z,c[k>>2]|0)|0;c[n>>2]=d;c[n+4>>2]=e;g[(c[w>>2]|0)+(b*12&-1)+8>>2]=A;n=(c[x>>2]|0)+(b*12&-1)|0;o=(g[k>>2]=I,c[k>>2]|0);j=0|o;o=(g[k>>2]=J,c[k>>2]|0)|0;c[n>>2]=j;c[n+4>>2]=o;g[(c[x>>2]|0)+(b*12&-1)+8>>2]=L;n=c[(c[r>>2]|0)+(b<<2)>>2]|0;s=n+44|0;c[s>>2]=d;c[s+4>>2]=e;g[n+56>>2]=A;e=n+64|0;c[e>>2]=j;c[e+4>>2]=o;g[n+72>>2]=L;B=+Q(A);g[n+20>>2]=B;D=+P(A);g[n+24>>2]=D;A=+g[n+28>>2];C=+g[n+32>>2];o=n+12|0;n=(g[k>>2]=E-(D*A-B*C),c[k>>2]|0);e=(g[k>>2]=z-(B*A+D*C),c[k>>2]|0)|0;c[o>>2]=0|n;c[o+4>>2]=e;e=b+1|0;if((e|0)<(c[m>>2]|0)){b=e}else{break L1884}}}}while(0);m=c[l+40>>2]|0;r=a+4|0;if((c[r>>2]|0)==0){M=l+32|0;O=c[M>>2]|0;R=m;bL(O,R);S=l+36|0;T=c[S>>2]|0;U=T;bL(O,U);i=f;return}if((c[q>>2]|0)<=0){M=l+32|0;O=c[M>>2]|0;R=m;bL(O,R);S=l+36|0;T=c[S>>2]|0;U=T;bL(O,U);i=f;return}a=h+16|0;x=0;while(1){w=c[(c[p>>2]|0)+(x<<2)>>2]|0;b=c[m+(x*152&-1)+144>>2]|0;c[a>>2]=b;L1905:do{if((b|0)>0){e=0;while(1){g[h+(e<<2)>>2]=+g[m+(x*152&-1)+(e*36&-1)+16>>2];g[h+8+(e<<2)>>2]=+g[m+(x*152&-1)+(e*36&-1)+20>>2];o=e+1|0;if((o|0)==(b|0)){break L1905}else{e=o}}}}while(0);b=c[r>>2]|0;aL[c[(c[b>>2]|0)+20>>2]&255](b,w,h);b=x+1|0;if((b|0)<(c[q>>2]|0)){x=b}else{break}}M=l+32|0;O=c[M>>2]|0;R=m;bL(O,R);S=l+36|0;T=c[S>>2]|0;U=T;bL(O,U);i=f;return}function b9(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;b=c[a+102952>>2]|0;L1912:do{if((b|0)!=0){d=a|0;e=b;while(1){f=c[e+96>>2]|0;g=c[e+100>>2]|0;while(1){if((g|0)==0){break}h=c[g+4>>2]|0;c[g+28>>2]=0;b3(g,d);g=h}if((f|0)==0){break L1912}else{e=f}}}}while(0);dd(c[a+102904>>2]|0);dd(c[a+102916>>2]|0);dd(c[a+102876>>2]|0);if((c[a+102468>>2]|0)!=0){ax(5243112,32,5249236,5245612)}if((c[a+102864>>2]|0)!=0){ax(5243112,33,5249236,5244576)}b=a+4|0;e=a|0;a=c[e>>2]|0;if((c[b>>2]|0)>0){i=0;j=a}else{k=a;l=k;dd(l);return}while(1){dd(c[j+(i<<3)+4>>2]|0);a=i+1|0;d=c[e>>2]|0;if((a|0)<(c[b>>2]|0)){i=a;j=d}else{k=d;break}}l=k;dd(l);return}function ca(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0.0,aj=0.0,ak=0.0,al=0.0,am=0.0;f=i;i=i+100|0;h=f|0;j=f+16|0;l=f+68|0;m=d+103008|0;g[m>>2]=0.0;n=d+103012|0;g[n>>2]=0.0;o=d+103016|0;g[o>>2]=0.0;p=d+102960|0;q=d+102872|0;r=d+68|0;b5(j,c[p>>2]|0,c[d+102936>>2]|0,c[d+102964>>2]|0,r,c[d+102944>>2]|0);s=d+102952|0;t=c[s>>2]|0;L1933:do{if((t|0)!=0){u=t;while(1){v=u+4|0;b[v>>1]=b[v>>1]&-2;v=c[u+96>>2]|0;if((v|0)==0){break L1933}else{u=v}}}}while(0);t=c[d+102932>>2]|0;L1937:do{if((t|0)!=0){u=t;while(1){v=u+4|0;c[v>>2]=c[v>>2]&-2;v=c[u+12>>2]|0;if((v|0)==0){break L1937}else{u=v}}}}while(0);t=c[d+102956>>2]|0;L1941:do{if((t|0)!=0){u=t;while(1){a[u+60|0]=0;v=c[u+12>>2]|0;if((v|0)==0){break L1941}else{u=v}}}}while(0);t=c[p>>2]|0;p=t<<2;u=d+102864|0;v=c[u>>2]|0;if((v|0)<32){w=v}else{ax(5243112,38,5249276,5244052);w=c[u>>2]|0}v=d+102480+(w*12&-1)|0;c[d+102480+(w*12&-1)+4>>2]=p;x=d+102468|0;y=c[x>>2]|0;if((y+p|0)>102400){c[v>>2]=dc(p)|0;a[d+102480+(w*12&-1)+8|0]=1}else{c[v>>2]=y+(d+68)|0;a[d+102480+(w*12&-1)+8|0]=0;c[x>>2]=(c[x>>2]|0)+p|0}x=d+102472|0;w=(c[x>>2]|0)+p|0;c[x>>2]=w;x=d+102476|0;p=c[x>>2]|0;c[x>>2]=(p|0)>(w|0)?p:w;c[u>>2]=(c[u>>2]|0)+1|0;u=c[v>>2]|0;v=u;w=c[s>>2]|0;L1953:do{if((w|0)!=0){p=j+28|0;x=j+36|0;y=j+32|0;z=j+40|0;A=j+8|0;B=j+48|0;C=j+16|0;D=j+44|0;E=j+12|0;F=d+102968|0;G=d+102976|0;H=l+12|0;I=l+16|0;J=l+20|0;K=w;while(1){L=K+4|0;L1957:do{if((b[L>>1]&35)<<16>>16==34){if((c[K>>2]|0)==0){break}c[p>>2]=0;c[x>>2]=0;c[y>>2]=0;c[v>>2]=K;b[L>>1]=b[L>>1]|1;M=1;while(1){N=M-1|0;O=c[v+(N<<2)>>2]|0;R=O+4|0;if((b[R>>1]&32)<<16>>16==0){ax(5245572,445,5248280,5243920)}S=c[p>>2]|0;if((S|0)<(c[z>>2]|0)){T=S}else{ax(5244808,54,5248204,5244544);T=c[p>>2]|0}c[O+8>>2]=T;c[(c[A>>2]|0)+(c[p>>2]<<2)>>2]=O;c[p>>2]=(c[p>>2]|0)+1|0;S=b[R>>1]|0;if((S&2)<<16>>16==0){b[R>>1]=S|2;g[O+144>>2]=0.0}L1972:do{if((c[O>>2]|0)==0){U=N}else{S=c[O+112>>2]|0;L1974:do{if((S|0)==0){V=N}else{R=N;W=S;while(1){X=c[W+4>>2]|0;Y=X+4|0;do{if((c[Y>>2]&7|0)==6){if((a[(c[X+48>>2]|0)+38|0]&1)<<24>>24!=0){Z=R;break}if((a[(c[X+52>>2]|0)+38|0]&1)<<24>>24!=0){Z=R;break}_=c[x>>2]|0;if((_|0)<(c[D>>2]|0)){$=_}else{ax(5244808,62,5248140,5244664);$=c[x>>2]|0}c[x>>2]=$+1|0;c[(c[E>>2]|0)+($<<2)>>2]=X;c[Y>>2]=c[Y>>2]|1;_=c[W>>2]|0;aa=_+4|0;if((b[aa>>1]&1)<<16>>16!=0){Z=R;break}if((R|0)>=(t|0)){ax(5245572,495,5248280,5243600)}c[v+(R<<2)>>2]=_;b[aa>>1]=b[aa>>1]|1;Z=R+1|0}else{Z=R}}while(0);Y=c[W+12>>2]|0;if((Y|0)==0){V=Z;break L1974}else{R=Z;W=Y}}}}while(0);S=c[O+108>>2]|0;if((S|0)==0){U=V;break}else{ab=V;ac=S}while(1){S=ac+4|0;W=c[S>>2]|0;do{if((a[W+60|0]&1)<<24>>24==0){R=c[ac>>2]|0;Y=R+4|0;if((b[Y>>1]&32)<<16>>16==0){ad=ab;break}X=c[y>>2]|0;if((X|0)<(c[B>>2]|0)){ae=X}else{ax(5244808,68,5248172,5244776);ae=c[y>>2]|0}c[y>>2]=ae+1|0;c[(c[C>>2]|0)+(ae<<2)>>2]=W;a[(c[S>>2]|0)+60|0]=1;if((b[Y>>1]&1)<<16>>16!=0){ad=ab;break}if((ab|0)>=(t|0)){ax(5245572,524,5248280,5243600)}c[v+(ab<<2)>>2]=R;b[Y>>1]=b[Y>>1]|1;ad=ab+1|0}else{ad=ab}}while(0);S=c[ac+12>>2]|0;if((S|0)==0){U=ad;break L1972}else{ab=ad;ac=S}}}}while(0);if((U|0)>0){M=U}else{break}}b6(j,l,e,F,(a[G]&1)<<24>>24!=0);g[m>>2]=+g[H>>2]+ +g[m>>2];g[n>>2]=+g[I>>2]+ +g[n>>2];g[o>>2]=+g[J>>2]+ +g[o>>2];M=c[p>>2]|0;if((M|0)>0){af=0;ag=M}else{break}while(1){M=c[(c[A>>2]|0)+(af<<2)>>2]|0;if((c[M>>2]|0)==0){O=M+4|0;b[O>>1]=b[O>>1]&-2;ah=c[p>>2]|0}else{ah=ag}O=af+1|0;if((O|0)<(ah|0)){af=O;ag=ah}else{break L1957}}}}while(0);L=c[K+96>>2]|0;if((L|0)==0){break L1953}else{K=L}}}}while(0);bL(r,u);u=c[s>>2]|0;L2016:do{if((u|0)!=0){s=h+8|0;r=h+12|0;ah=h;ag=u;while(1){L2020:do{if((b[ag+4>>1]&1)<<16>>16!=0){if((c[ag>>2]|0)==0){break}ai=+g[ag+52>>2];aj=+Q(ai);g[s>>2]=aj;ak=+P(ai);g[r>>2]=ak;ai=+g[ag+28>>2];al=+g[ag+32>>2];am=+g[ag+40>>2]-(aj*ai+ak*al);af=(g[k>>2]=+g[ag+36>>2]-(ak*ai-aj*al),c[k>>2]|0);o=(g[k>>2]=am,c[k>>2]|0)|0;c[ah>>2]=0|af;c[ah+4>>2]=o;o=(c[ag+88>>2]|0)+102872|0;af=c[ag+100>>2]|0;if((af|0)==0){break}n=ag+12|0;m=af;while(1){b4(m,o,h,n);af=c[m+4>>2]|0;if((af|0)==0){break L2020}else{m=af}}}}while(0);m=c[ag+96>>2]|0;if((m|0)==0){break L2016}else{ag=m}}}}while(0);bU(q|0,q);g[d+103020>>2]=0.0;d=j|0;bL(c[d>>2]|0,c[j+20>>2]|0);bL(c[d>>2]|0,c[j+24>>2]|0);bL(c[d>>2]|0,c[j+16>>2]|0);bL(c[d>>2]|0,c[j+12>>2]|0);bL(c[d>>2]|0,c[j+8>>2]|0);i=f;return}function cb(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0.0,ah=0,ai=0,aj=0,ak=0,al=0.0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0.0,av=0.0,aw=0.0,ay=0.0,az=0,aA=0.0,aB=0.0,aC=0,aD=0,aE=0.0,aF=0.0,aG=0.0,aH=0.0,aI=0.0,aJ=0,aK=0,aL=0.0,aM=0,aN=0,aO=0,aP=0.0,aQ=0,aR=0,aS=0,aT=0,aU=0,aV=0,aW=0,aX=0,aY=0,aZ=0,a_=0,a$=0,a0=0,a1=0,a2=0.0,a3=0,a4=0,a5=0;f=i;i=i+348|0;h=f|0;j=f+16|0;l=f+68|0;m=f+200|0;n=f+208|0;o=f+244|0;p=f+280|0;q=f+288|0;r=f+324|0;s=d+102872|0;t=d+102944|0;b5(j,64,32,0,d+68|0,c[t>>2]|0);u=d+102995|0;L2031:do{if((a[u]&1)<<24>>24==0){v=d+102932|0}else{w=c[d+102952>>2]|0;L2034:do{if((w|0)!=0){x=w;while(1){y=x+4|0;b[y>>1]=b[y>>1]&-2;g[x+60>>2]=0.0;y=c[x+96>>2]|0;if((y|0)==0){break L2034}else{x=y}}}}while(0);w=d+102932|0;x=c[w>>2]|0;if((x|0)==0){v=w;break}else{z=x}while(1){x=z+4|0;c[x>>2]=c[x>>2]&-34;c[z+128>>2]=0;g[z+132>>2]=1.0;x=c[z+12>>2]|0;if((x|0)==0){v=w;break L2031}else{z=x}}}}while(0);z=n;n=o;o=j+28|0;w=j+36|0;x=j+32|0;y=j+40|0;A=j+8|0;B=j+44|0;C=j+12|0;D=p|0;E=p+4|0;F=q;q=e|0;G=r|0;H=r+4|0;I=r+8|0;J=r+16|0;K=e+12|0;e=r+12|0;L=r+20|0;M=s|0;N=d+102994|0;d=h+8|0;O=h+12|0;R=h;S=l+16|0;T=l+20|0;U=l+24|0;V=l+44|0;W=l+48|0;X=l+52|0;Y=l|0;Z=l+28|0;_=l+56|0;$=l+92|0;aa=l+128|0;ab=m|0;ac=m+4|0;while(1){ad=c[v>>2]|0;if((ad|0)==0){ae=1;af=1646;break}else{ag=1.0;ah=0;ai=ad}while(1){ad=ai+4|0;aj=c[ad>>2]|0;do{if((aj&4|0)==0){ak=ah;al=ag}else{if((c[ai+128>>2]|0)>8){ak=ah;al=ag;break}if((aj&32|0)==0){am=c[ai+48>>2]|0;an=c[ai+52>>2]|0;if((a[am+38|0]&1)<<24>>24!=0){ak=ah;al=ag;break}if((a[an+38|0]&1)<<24>>24!=0){ak=ah;al=ag;break}ao=c[am+8>>2]|0;ap=c[an+8>>2]|0;aq=c[ao>>2]|0;ar=c[ap>>2]|0;if(!((aq|0)==2|(ar|0)==2)){ax(5245572,641,5248236,5243300)}as=b[ao+4>>1]|0;at=b[ap+4>>1]|0;if(!((as&2)<<16>>16!=0&(aq|0)!=0|(at&2)<<16>>16!=0&(ar|0)!=0)){ak=ah;al=ag;break}if(!((as&8)<<16>>16!=0|(aq|0)!=2|((at&8)<<16>>16!=0|(ar|0)!=2))){ak=ah;al=ag;break}ar=ao+28|0;at=ao+60|0;au=+g[at>>2];aq=ap+28|0;as=ap+60|0;av=+g[as>>2];do{if(au<av){if(au<1.0){aw=au}else{ax(5244908,715,5248368,5243160);aw=+g[at>>2]}ay=(av-aw)/(1.0-aw);az=ao+36|0;aA=1.0-ay;aB=aA*+g[ao+40>>2]+ay*+g[ao+48>>2];aC=az;aD=(g[k>>2]=+g[az>>2]*aA+ay*+g[ao+44>>2],c[k>>2]|0);az=(g[k>>2]=aB,c[k>>2]|0)|0;c[aC>>2]=0|aD;c[aC+4>>2]=az;az=ao+52|0;g[az>>2]=aA*+g[az>>2]+ay*+g[ao+56>>2];g[at>>2]=av;aE=av}else{if(av>=au){aE=au;break}if(av<1.0){aF=av}else{ax(5244908,715,5248368,5243160);aF=+g[as>>2]}ay=(au-aF)/(1.0-aF);az=ap+36|0;aA=1.0-ay;aB=aA*+g[ap+40>>2]+ay*+g[ap+48>>2];aC=az;aD=(g[k>>2]=+g[az>>2]*aA+ay*+g[ap+44>>2],c[k>>2]|0);az=(g[k>>2]=aB,c[k>>2]|0)|0;c[aC>>2]=0|aD;c[aC+4>>2]=az;az=ap+52|0;g[az>>2]=aA*+g[az>>2]+ay*+g[ap+56>>2];g[as>>2]=au;aE=au}}while(0);if(aE>=1.0){ax(5245572,676,5248236,5243160)}as=c[ai+56>>2]|0;ap=c[ai+60>>2]|0;c[S>>2]=0;c[T>>2]=0;g[U>>2]=0.0;c[V>>2]=0;c[W>>2]=0;g[X>>2]=0.0;bh(Y,c[am+12>>2]|0,as);bh(Z,c[an+12>>2]|0,ap);dh(_,ar,36);dh($,aq,36);g[aa>>2]=1.0;br(m,l);if((c[ab>>2]|0)==3){au=aE+(1.0-aE)*+g[ac>>2];aG=au<1.0?au:1.0}else{aG=1.0}g[ai+132>>2]=aG;c[ad>>2]=c[ad>>2]|32;aH=aG}else{aH=+g[ai+132>>2]}if(aH>=ag){ak=ah;al=ag;break}ak=ai;al=aH}}while(0);ad=c[ai+12>>2]|0;if((ad|0)==0){break}else{ag=al;ah=ak;ai=ad}}if((ak|0)==0|al>.9999988079071045){ae=1;af=1647;break}ad=c[(c[ak+48>>2]|0)+8>>2]|0;aj=c[(c[ak+52>>2]|0)+8>>2]|0;ap=ad+28|0;dh(z,ap,36);as=aj+28|0;dh(n,as,36);at=ad+60|0;au=+g[at>>2];if(au<1.0){aI=au}else{ax(5244908,715,5248368,5243160);aI=+g[at>>2]}au=(al-aI)/(1.0-aI);ao=ad+36|0;av=1.0-au;az=ad+44|0;aC=ad+48|0;ay=+g[ao>>2]*av+au*+g[az>>2];aA=av*+g[ad+40>>2]+au*+g[aC>>2];aD=ao;ao=(g[k>>2]=ay,c[k>>2]|0);aJ=0|ao;ao=(g[k>>2]=aA,c[k>>2]|0)|0;c[aD>>2]=aJ;c[aD+4>>2]=ao;aD=ad+52|0;aK=ad+56|0;aB=av*+g[aD>>2]+au*+g[aK>>2];g[aD>>2]=aB;g[at>>2]=al;at=ad+44|0;c[at>>2]=aJ;c[at+4>>2]=ao;g[aK>>2]=aB;au=+Q(aB);ao=ad+20|0;g[ao>>2]=au;av=+P(aB);at=ad+24|0;g[at>>2]=av;aJ=ad+28|0;aB=+g[aJ>>2];aD=ad+32|0;aL=+g[aD>>2];aM=ad+12|0;aN=(g[k>>2]=ay-(av*aB-au*aL),c[k>>2]|0);aO=(g[k>>2]=aA-(au*aB+av*aL),c[k>>2]|0)|0;c[aM>>2]=0|aN;c[aM+4>>2]=aO;aO=aj+60|0;aL=+g[aO>>2];if(aL<1.0){aP=aL}else{ax(5244908,715,5248368,5243160);aP=+g[aO>>2]}aL=(al-aP)/(1.0-aP);aN=aj+36|0;av=1.0-aL;aQ=aj+44|0;aR=aj+48|0;aB=+g[aN>>2]*av+aL*+g[aQ>>2];au=av*+g[aj+40>>2]+aL*+g[aR>>2];aS=aN;aN=(g[k>>2]=aB,c[k>>2]|0);aT=0|aN;aN=(g[k>>2]=au,c[k>>2]|0)|0;c[aS>>2]=aT;c[aS+4>>2]=aN;aS=aj+52|0;aU=aj+56|0;aA=av*+g[aS>>2]+aL*+g[aU>>2];g[aS>>2]=aA;g[aO>>2]=al;aO=aj+44|0;c[aO>>2]=aT;c[aO+4>>2]=aN;g[aU>>2]=aA;aL=+Q(aA);aN=aj+20|0;g[aN>>2]=aL;av=+P(aA);aO=aj+24|0;g[aO>>2]=av;aT=aj+28|0;aA=+g[aT>>2];aS=aj+32|0;ay=+g[aS>>2];aV=aj+12|0;aW=(g[k>>2]=aB-(av*aA-aL*ay),c[k>>2]|0);aX=(g[k>>2]=au-(aL*aA+av*ay),c[k>>2]|0)|0;c[aV>>2]=0|aW;c[aV+4>>2]=aX;cx(ak,c[t>>2]|0);aX=ak+4|0;aW=c[aX>>2]|0;c[aX>>2]=aW&-33;aY=ak+128|0;c[aY>>2]=(c[aY>>2]|0)+1|0;if((aW&6|0)!=6){c[aX>>2]=aW&-37;dh(ap,z,36);dh(as,n,36);ay=+g[aK>>2];av=+Q(ay);g[ao>>2]=av;aA=+P(ay);g[at>>2]=aA;ay=+g[aJ>>2];aL=+g[aD>>2];au=+g[aC>>2]-(av*ay+aA*aL);aC=(g[k>>2]=+g[az>>2]-(aA*ay-av*aL),c[k>>2]|0);az=(g[k>>2]=au,c[k>>2]|0)|0;c[aM>>2]=0|aC;c[aM+4>>2]=az;au=+g[aU>>2];aL=+Q(au);g[aN>>2]=aL;av=+P(au);g[aO>>2]=av;au=+g[aT>>2];ay=+g[aS>>2];aA=+g[aR>>2]-(aL*au+av*ay);aR=(g[k>>2]=+g[aQ>>2]-(av*au-aL*ay),c[k>>2]|0);aQ=(g[k>>2]=aA,c[k>>2]|0)|0;c[aV>>2]=0|aR;c[aV+4>>2]=aQ;continue}aQ=ad+4|0;aV=b[aQ>>1]|0;if((aV&2)<<16>>16==0){b[aQ>>1]=aV|2;g[ad+144>>2]=0.0}aV=aj+4|0;aR=b[aV>>1]|0;if((aR&2)<<16>>16==0){b[aV>>1]=aR|2;g[aj+144>>2]=0.0}c[o>>2]=0;c[w>>2]=0;c[x>>2]=0;aR=c[y>>2]|0;do{if((aR|0)>0){aS=ad+8|0;c[aS>>2]=0;aT=c[A>>2]|0;c[aT>>2]=ad;c[o>>2]=1;if((aR|0)>1){aZ=aS;a_=aT;break}else{a$=aS;a0=aT;af=1592;break}}else{ax(5244808,54,5248204,5244544);aT=ad+8|0;c[aT>>2]=0;aS=c[A>>2]|0;c[aS>>2]=ad;c[o>>2]=1;a$=aT;a0=aS;af=1592;break}}while(0);if((af|0)==1592){af=0;ax(5244808,54,5248204,5244544);aZ=a$;a_=a0}aR=aj+8|0;c[aR>>2]=1;c[a_+4>>2]=aj;c[o>>2]=2;if((c[B>>2]|0)<=0){ax(5244808,62,5248140,5244664)}c[w>>2]=1;c[c[C>>2]>>2]=ak;b[aQ>>1]=b[aQ>>1]|1;b[aV>>1]=b[aV>>1]|1;c[aX>>2]=c[aX>>2]|1;c[D>>2]=ad;c[E>>2]=aj;aS=1;aT=ad;while(1){L2115:do{if((c[aT>>2]|0)==2){aO=c[aT+112>>2]|0;if((aO|0)==0){break}aN=aT+4|0;aU=c[y>>2]|0;az=aO;aO=c[o>>2]|0;while(1){if((aO|0)==(aU|0)){break L2115}aM=c[w>>2]|0;aC=c[B>>2]|0;if((aM|0)==(aC|0)){break L2115}aD=c[az+4>>2]|0;aJ=aD+4|0;L2122:do{if((c[aJ>>2]&1|0)==0){at=c[az>>2]|0;ao=at|0;do{if((c[ao>>2]|0)==2){if((b[aN>>1]&8)<<16>>16!=0){break}if((b[at+4>>1]&8)<<16>>16==0){a1=aO;break L2122}}}while(0);if((a[(c[aD+48>>2]|0)+38|0]&1)<<24>>24!=0){a1=aO;break}if((a[(c[aD+52>>2]|0)+38|0]&1)<<24>>24!=0){a1=aO;break}aK=at+28|0;dh(F,aK,36);as=at+4|0;if((b[as>>1]&1)<<16>>16==0){ap=at+60|0;aA=+g[ap>>2];if(aA<1.0){a2=aA}else{ax(5244908,715,5248368,5243160);a2=+g[ap>>2]}aA=(al-a2)/(1.0-a2);aW=at+36|0;ay=1.0-aA;aL=+g[aW>>2]*ay+aA*+g[at+44>>2];au=ay*+g[at+40>>2]+aA*+g[at+48>>2];aY=aW;aW=(g[k>>2]=aL,c[k>>2]|0);a3=0|aW;aW=(g[k>>2]=au,c[k>>2]|0)|0;c[aY>>2]=a3;c[aY+4>>2]=aW;aY=at+52|0;a4=at+56|0;av=ay*+g[aY>>2]+aA*+g[a4>>2];g[aY>>2]=av;g[ap>>2]=al;ap=at+44|0;c[ap>>2]=a3;c[ap+4>>2]=aW;g[a4>>2]=av;aA=+Q(av);g[at+20>>2]=aA;ay=+P(av);g[at+24>>2]=ay;av=+g[at+28>>2];aB=+g[at+32>>2];a4=at+12|0;aW=(g[k>>2]=aL-(ay*av-aA*aB),c[k>>2]|0);ap=(g[k>>2]=au-(aA*av+ay*aB),c[k>>2]|0)|0;c[a4>>2]=0|aW;c[a4+4>>2]=ap}cx(aD,c[t>>2]|0);ap=c[aJ>>2]|0;if((ap&4|0)==0){dh(aK,F,36);aB=+g[at+56>>2];ay=+Q(aB);g[at+20>>2]=ay;av=+P(aB);g[at+24>>2]=av;aB=+g[at+28>>2];aA=+g[at+32>>2];au=+g[at+48>>2]-(ay*aB+av*aA);a4=at+12|0;aW=(g[k>>2]=+g[at+44>>2]-(av*aB-ay*aA),c[k>>2]|0);a3=(g[k>>2]=au,c[k>>2]|0)|0;c[a4>>2]=0|aW;c[a4+4>>2]=a3;a1=aO;break}if((ap&2|0)==0){dh(aK,F,36);au=+g[at+56>>2];aA=+Q(au);g[at+20>>2]=aA;ay=+P(au);g[at+24>>2]=ay;au=+g[at+28>>2];aB=+g[at+32>>2];av=+g[at+48>>2]-(aA*au+ay*aB);aK=at+12|0;a3=(g[k>>2]=+g[at+44>>2]-(ay*au-aA*aB),c[k>>2]|0);a4=(g[k>>2]=av,c[k>>2]|0)|0;c[aK>>2]=0|a3;c[aK+4>>2]=a4;a1=aO;break}c[aJ>>2]=ap|1;if((aM|0)>=(aC|0)){ax(5244808,62,5248140,5244664)}c[w>>2]=aM+1|0;c[(c[C>>2]|0)+(aM<<2)>>2]=aD;ap=b[as>>1]|0;if((ap&1)<<16>>16!=0){a1=aO;break}b[as>>1]=ap|1;do{if((c[ao>>2]|0)!=0){if((ap&2)<<16>>16!=0){break}b[as>>1]=ap|3;g[at+144>>2]=0.0}}while(0);if((aO|0)>=(aU|0)){ax(5244808,54,5248204,5244544)}c[at+8>>2]=aO;c[(c[A>>2]|0)+(aO<<2)>>2]=at;ap=aO+1|0;c[o>>2]=ap;a1=ap}else{a1=aO}}while(0);aD=c[az+12>>2]|0;if((aD|0)==0){break L2115}else{az=aD;aO=a1}}}}while(0);if((aS|0)>=2){break}aO=c[p+(aS<<2)>>2]|0;aS=aS+1|0;aT=aO}av=(1.0-al)*+g[q>>2];g[G>>2]=av;g[H>>2]=1.0/av;g[I>>2]=1.0;c[J>>2]=20;c[e>>2]=c[K>>2]|0;a[L]=0;b8(j,r,c[aZ>>2]|0,c[aR>>2]|0);aT=c[o>>2]|0;L2160:do{if((aT|0)>0){aS=c[A>>2]|0;ad=0;while(1){aj=c[aS+(ad<<2)>>2]|0;aX=aj+4|0;b[aX>>1]=b[aX>>1]&-2;L2164:do{if((c[aj>>2]|0)==2){av=+g[aj+52>>2];aB=+Q(av);g[d>>2]=aB;aA=+P(av);g[O>>2]=aA;av=+g[aj+28>>2];au=+g[aj+32>>2];ay=+g[aj+40>>2]-(aB*av+aA*au);aX=(g[k>>2]=+g[aj+36>>2]-(aA*av-aB*au),c[k>>2]|0);aV=(g[k>>2]=ay,c[k>>2]|0)|0;c[R>>2]=0|aX;c[R+4>>2]=aV;aV=(c[aj+88>>2]|0)+102872|0;aX=c[aj+100>>2]|0;L2166:do{if((aX|0)!=0){aQ=aj+12|0;aO=aX;while(1){b4(aO,aV,h,aQ);az=c[aO+4>>2]|0;if((az|0)==0){break L2166}else{aO=az}}}}while(0);aV=c[aj+112>>2]|0;if((aV|0)==0){break}else{a5=aV}while(1){aV=(c[a5+4>>2]|0)+4|0;c[aV>>2]=c[aV>>2]&-34;aV=c[a5+12>>2]|0;if((aV|0)==0){break L2164}else{a5=aV}}}}while(0);aj=ad+1|0;if((aj|0)<(aT|0)){ad=aj}else{break L2160}}}}while(0);bU(M,s);if((a[N]&1)<<24>>24!=0){ae=0;af=1645;break}}if((af|0)==1647){a[u]=ae;N=j|0;s=c[N>>2]|0;M=j+20|0;a5=c[M>>2]|0;h=a5;bL(s,h);R=c[N>>2]|0;O=j+24|0;d=c[O>>2]|0;o=d;bL(R,o);aZ=c[N>>2]|0;r=j+16|0;L=c[r>>2]|0;K=L;bL(aZ,K);e=c[N>>2]|0;J=c[C>>2]|0;I=J;bL(e,I);H=c[A>>2]|0;G=H;bL(e,G);i=f;return}else if((af|0)==1645){a[u]=ae;N=j|0;s=c[N>>2]|0;M=j+20|0;a5=c[M>>2]|0;h=a5;bL(s,h);R=c[N>>2]|0;O=j+24|0;d=c[O>>2]|0;o=d;bL(R,o);aZ=c[N>>2]|0;r=j+16|0;L=c[r>>2]|0;K=L;bL(aZ,K);e=c[N>>2]|0;J=c[C>>2]|0;I=J;bL(e,I);H=c[A>>2]|0;G=H;bL(e,G);i=f;return}else if((af|0)==1646){a[u]=ae;N=j|0;s=c[N>>2]|0;M=j+20|0;a5=c[M>>2]|0;h=a5;bL(s,h);R=c[N>>2]|0;O=j+24|0;d=c[O>>2]|0;o=d;bL(R,o);aZ=c[N>>2]|0;r=j+16|0;L=c[r>>2]|0;K=L;bL(aZ,K);e=c[N>>2]|0;J=c[C>>2]|0;I=J;bL(e,I);H=c[A>>2]|0;G=H;bL(e,G);i=f;return}}function cc(a){a=a|0;return}function cd(a){a=a|0;return}function ce(a){a=a|0;return}function cf(a,c,d){a=a|0;c=c|0;d=d|0;var e=0;a=b[c+36>>1]|0;if(!(a<<16>>16!=b[d+36>>1]<<16>>16|a<<16>>16==0)){e=a<<16>>16>0;return e|0}if((b[d+32>>1]&b[c+34>>1])<<16>>16==0){e=0;return e|0}e=(b[d+34>>1]&b[c+32>>1])<<16>>16!=0;return e|0}function cg(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,i=0,j=0.0,k=0.0,l=0.0,m=0.0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0;f=c[(c[a+48>>2]|0)+12>>2]|0;h=c[(c[a+52>>2]|0)+12>>2]|0;a=b+60|0;c[a>>2]=0;i=f+12|0;j=+g[d+12>>2];k=+g[i>>2];l=+g[d+8>>2];m=+g[f+16>>2];n=h+12|0;o=+g[e+12>>2];p=+g[n>>2];q=+g[e+8>>2];r=+g[h+16>>2];s=+g[e>>2]+(o*p-q*r)-(+g[d>>2]+(j*k-l*m));t=p*q+o*r+ +g[e+4>>2]-(k*l+j*m+ +g[d+4>>2]);m=+g[f+8>>2]+ +g[h+8>>2];if(s*s+t*t>m*m){return}c[b+56>>2]=0;h=i;i=b+48|0;f=c[h+4>>2]|0;c[i>>2]=c[h>>2]|0;c[i+4>>2]=f;g[b+40>>2]=0.0;g[b+44>>2]=0.0;c[a>>2]=1;a=n;n=b;f=c[a+4>>2]|0;c[n>>2]=c[a>>2]|0;c[n+4>>2]=f;c[b+16>>2]=0;return}function ch(b,d,e,f){b=b|0;d=+d;e=e|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0.0,p=0,q=0,r=0,s=0;h=i;i=i+24|0;j=h|0;k=b+102868|0;l=c[k>>2]|0;if((l&1|0)==0){m=l}else{l=b+102872|0;bU(l|0,l);l=c[k>>2]&-2;c[k>>2]=l;m=l}c[k>>2]=m|2;m=j|0;g[m>>2]=d;c[j+12>>2]=e;c[j+16>>2]=f;f=d>0.0;if(f){g[j+4>>2]=1.0/d}else{g[j+4>>2]=0.0}e=b+102988|0;g[j+8>>2]=+g[e>>2]*d;a[j+20|0]=a[b+102992|0]&1;bT(b+102872|0);g[b+103e3>>2]=0.0;if(!((a[b+102995|0]&1)<<24>>24==0|f^1)){ca(b,j);g[b+103004>>2]=0.0}do{if((a[b+102993|0]&1)<<24>>24==0){n=1674}else{d=+g[m>>2];if(d<=0.0){o=d;break}cb(b,j);g[b+103024>>2]=0.0;n=1674;break}}while(0);if((n|0)==1674){o=+g[m>>2]}if(o>0.0){g[e>>2]=+g[j+4>>2]}j=c[k>>2]|0;if((j&4|0)==0){p=j;q=p&-3;c[k>>2]=q;r=b+102996|0;g[r>>2]=0.0;i=h;return}e=c[b+102952>>2]|0;if((e|0)==0){p=j;q=p&-3;c[k>>2]=q;r=b+102996|0;g[r>>2]=0.0;i=h;return}else{s=e}while(1){g[s+76>>2]=0.0;g[s+80>>2]=0.0;g[s+84>>2]=0.0;e=c[s+96>>2]|0;if((e|0)==0){break}else{s=e}}p=c[k>>2]|0;q=p&-3;c[k>>2]=q;r=b+102996|0;g[r>>2]=0.0;i=h;return}function ci(a){a=a|0;de(a);return}function cj(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0,l=0,m=0.0,n=0.0,o=0;h=bK(f,144)|0;if((h|0)==0){i=0;j=i|0;return j|0}f=h;k=h;c[k>>2]=5250572;c[h+4>>2]=4;c[h+48>>2]=a;l=h+52|0;c[l>>2]=d;c[h+56>>2]=b;c[h+60>>2]=e;c[h+124>>2]=0;c[h+128>>2]=0;di(h+8|0,0,40);g[h+136>>2]=+N(+g[a+16>>2]*+g[d+16>>2]);m=+g[a+20>>2];n=+g[d+20>>2];g[h+140>>2]=m>n?m:n;c[k>>2]=5250668;if((c[(c[a+12>>2]|0)+4>>2]|0)==3){o=d}else{ax(5245212,43,5248908,5246188);o=c[l>>2]|0}if((c[(c[o+12>>2]|0)+4>>2]|0)==0){i=f;j=i|0;return j|0}ax(5245212,44,5248908,5245168);i=f;j=i|0;return j|0}function ck(b,d){b=b|0;d=d|0;var e=0,f=0;aH[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251840]|0;if((e&255)>=14){ax(5243252,173,5249496,5244088)}f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}function cl(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0;h=i;i=i+48|0;j=h|0;k=c[(c[a+48>>2]|0)+12>>2]|0;c[j>>2]=5250868;c[j+4>>2]=1;g[j+8>>2]=.009999999776482582;l=j+28|0;c[l>>2]=0;c[l+4>>2]=0;c[l+8>>2]=0;c[l+12>>2]=0;b[l+16>>1]=0;bx(k,j,c[a+56>>2]|0);ba(d,j,e,c[(c[a+52>>2]|0)+12>>2]|0,f);i=h;return}function cm(a){a=a|0;de(a);return}function cn(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0,l=0,m=0.0,n=0.0,o=0;h=bK(f,144)|0;if((h|0)==0){i=0;j=i|0;return j|0}f=h;k=h;c[k>>2]=5250572;c[h+4>>2]=4;c[h+48>>2]=a;l=h+52|0;c[l>>2]=d;c[h+56>>2]=b;c[h+60>>2]=e;c[h+124>>2]=0;c[h+128>>2]=0;di(h+8|0,0,40);g[h+136>>2]=+N(+g[a+16>>2]*+g[d+16>>2]);m=+g[a+20>>2];n=+g[d+20>>2];g[h+140>>2]=m>n?m:n;c[k>>2]=5250620;if((c[(c[a+12>>2]|0)+4>>2]|0)==3){o=d}else{ax(5245100,43,5248740,5246188);o=c[l>>2]|0}if((c[(c[o+12>>2]|0)+4>>2]|0)==2){i=f;j=i|0;return j|0}ax(5245100,44,5248740,5245056);i=f;j=i|0;return j|0}function co(b,d){b=b|0;d=d|0;var e=0,f=0;aH[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251840]|0;if((e&255)>=14){ax(5243252,173,5249496,5244088)}f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}function cp(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0,m=0;h=i;i=i+300|0;j=h|0;k=h+252|0;l=c[(c[a+48>>2]|0)+12>>2]|0;c[k>>2]=5250868;c[k+4>>2]=1;g[k+8>>2]=.009999999776482582;m=k+28|0;c[m>>2]=0;c[m+4>>2]=0;c[m+8>>2]=0;c[m+12>>2]=0;b[m+16>>1]=0;bx(l,k,c[a+56>>2]|0);bb(j,d,k,e,c[(c[a+52>>2]|0)+12>>2]|0,f);i=h;return}function cq(a){a=a|0;de(a);return}function cr(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0.0,l=0.0,m=0;e=bK(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;b=e;c[b>>2]=5250572;c[e+4>>2]=4;c[e+48>>2]=a;j=e+52|0;c[j>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;di(e+8|0,0,40);g[e+136>>2]=+N(+g[a+16>>2]*+g[d+16>>2]);k=+g[a+20>>2];l=+g[d+20>>2];g[e+140>>2]=k>l?k:l;c[b>>2]=5250800;if((c[(c[a+12>>2]|0)+4>>2]|0)==0){m=d}else{ax(5244996,44,5249756,5246144);m=c[j>>2]|0}if((c[(c[m+12>>2]|0)+4>>2]|0)==0){h=f;i=h|0;return i|0}ax(5244996,45,5249756,5245168);h=f;i=h|0;return i|0}function cs(b,d){b=b|0;d=d|0;var e=0,f=0;aH[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251840]|0;if((e&255)>=14){ax(5243252,173,5249496,5244088)}f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}function ct(a){a=a|0;de(a);return}function cu(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0;if((a[5251496]&1)<<24>>24==0){c[1312875]=60;c[1312876]=86;a[5251508]=1;c[1312899]=28;c[1312900]=134;a[5251604]=1;c[1312881]=28;c[1312882]=134;a[5251532]=0;c[1312905]=132;c[1312906]=94;a[5251628]=1;c[1312887]=130;c[1312888]=102;a[5251556]=1;c[1312878]=130;c[1312879]=102;a[5251520]=0;c[1312893]=124;c[1312894]=34;a[5251580]=1;c[1312902]=124;c[1312903]=34;a[5251616]=0;c[1312911]=8;c[1312912]=126;a[5251652]=1;c[1312884]=8;c[1312885]=126;a[5251544]=0;c[1312917]=138;c[1312918]=104;a[5251676]=1;c[1312908]=138;c[1312909]=104;a[5251640]=0;a[5251496]=1}h=c[(c[b+12>>2]|0)+4>>2]|0;i=c[(c[e+12>>2]|0)+4>>2]|0;if(h>>>0>=4){ax(5244944,80,5247984,5246100)}if(i>>>0>=4){ax(5244944,81,5247984,5245308)}j=c[5251500+(h*48&-1)+(i*12&-1)>>2]|0;if((j|0)==0){k=0;return k|0}if((a[5251500+(h*48&-1)+(i*12&-1)+8|0]&1)<<24>>24==0){k=aF[j&255](e,f,b,d,g)|0;return k|0}else{k=aF[j&255](b,d,e,f,g)|0;return k|0}return 0}function cv(d,e){d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;if((a[5251496]&1)<<24>>24==0){ax(5244944,103,5247920,5244252)}f=d+48|0;do{if((c[d+124>>2]|0)>0){h=c[(c[f>>2]|0)+8>>2]|0;i=h+4|0;j=b[i>>1]|0;if((j&2)<<16>>16==0){b[i>>1]=j|2;g[h+144>>2]=0.0}h=d+52|0;j=c[(c[h>>2]|0)+8>>2]|0;i=j+4|0;k=b[i>>1]|0;if((k&2)<<16>>16!=0){l=h;break}b[i>>1]=k|2;g[j+144>>2]=0.0;l=h}else{l=d+52|0}}while(0);h=c[(c[(c[f>>2]|0)+12>>2]|0)+4>>2]|0;f=c[(c[(c[l>>2]|0)+12>>2]|0)+4>>2]|0;if((h|0)>-1&(f|0)<4){m=5251500+(h*48&-1)+(f*12&-1)+4|0;n=c[m>>2]|0;aI[n&255](d,e);return}ax(5244944,114,5247920,5243876);ax(5244944,115,5247920,5243876);m=5251500+(h*48&-1)+(f*12&-1)+4|0;n=c[m>>2]|0;aI[n&255](d,e);return}function cw(a){a=a|0;return}function cx(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;f=i;i=i+192|0;h=f|0;j=f+92|0;k=f+104|0;l=f+128|0;m=d+64|0;dh(l,m,64);n=d+4|0;o=c[n>>2]|0;c[n>>2]=o|4;p=o>>>1;o=c[d+48>>2]|0;q=c[d+52>>2]|0;r=((a[q+38|0]|a[o+38|0])&1)<<24>>24!=0;s=c[o+8>>2]|0;t=c[q+8>>2]|0;u=s+12|0;v=t+12|0;do{if(r){w=c[o+12>>2]|0;x=c[q+12>>2]|0;y=c[d+56>>2]|0;z=c[d+60>>2]|0;c[h+16>>2]=0;c[h+20>>2]=0;g[h+24>>2]=0.0;c[h+44>>2]=0;c[h+48>>2]=0;g[h+52>>2]=0.0;bh(h|0,w,y);bh(h+28|0,x,z);z=h+56|0;x=u;c[z>>2]=c[x>>2]|0;c[z+4>>2]=c[x+4>>2]|0;c[z+8>>2]=c[x+8>>2]|0;c[z+12>>2]=c[x+12>>2]|0;x=h+72|0;z=v;c[x>>2]=c[z>>2]|0;c[x+4>>2]=c[z+4>>2]|0;c[x+8>>2]=c[z+8>>2]|0;c[x+12>>2]=c[z+12>>2]|0;a[h+88|0]=1;b[j+4>>1]=0;bj(k,j,h);z=+g[k+16>>2]<11920928955078125.0e-22&1;c[d+124>>2]=0;A=z;B=p&1}else{aQ[c[c[d>>2]>>2]&255](d,m,u,v);z=d+124|0;x=(c[z>>2]|0)>0;y=x&1;L2317:do{if(x){w=c[l+60>>2]|0;C=0;while(1){D=d+64+(C*20&-1)+8|0;g[D>>2]=0.0;E=d+64+(C*20&-1)+12|0;g[E>>2]=0.0;F=c[d+64+(C*20&-1)+16>>2]|0;G=0;while(1){if((G|0)>=(w|0)){break}if((c[l+(G*20&-1)+16>>2]|0)==(F|0)){H=1762;break}else{G=G+1|0}}if((H|0)==1762){H=0;g[D>>2]=+g[l+(G*20&-1)+8>>2];g[E>>2]=+g[l+(G*20&-1)+12>>2]}F=C+1|0;if((F|0)<(c[z>>2]|0)){C=F}else{break L2317}}}}while(0);z=p&1;if(!(x^(z|0)!=0)){A=y;B=z;break}C=s+4|0;w=b[C>>1]|0;if((w&2)<<16>>16==0){b[C>>1]=w|2;g[s+144>>2]=0.0}w=t+4|0;C=b[w>>1]|0;if((C&2)<<16>>16!=0){A=y;B=z;break}b[w>>1]=C|2;g[t+144>>2]=0.0;A=y;B=z}}while(0);t=A<<24>>24!=0;A=c[n>>2]|0;c[n>>2]=t?A|2:A&-3;A=t^1;n=(e|0)==0;if(!((B|0)!=0|A|n)){aI[c[(c[e>>2]|0)+8>>2]&255](e,d)}if(!(t|(B|0)==0|n)){aI[c[(c[e>>2]|0)+12>>2]&255](e,d)}if(r|A|n){i=f;return}aL[c[(c[e>>2]|0)+16>>2]&255](e,d,l);i=f;return}function cy(a){a=a|0;de(a);return}function cz(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0.0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;e=b;f=d;c[e>>2]=c[f>>2]|0;c[e+4>>2]=c[f+4>>2]|0;c[e+8>>2]=c[f+8>>2]|0;c[e+12>>2]=c[f+12>>2]|0;c[e+16>>2]=c[f+16>>2]|0;c[e+20>>2]=c[f+20>>2]|0;f=c[d+40>>2]|0;e=b+32|0;c[e>>2]=f;h=c[d+28>>2]|0;i=b+48|0;c[i>>2]=h;j=h*88&-1;h=f+102796|0;k=c[h>>2]|0;if((k|0)<32){l=k}else{ax(5243112,38,5249276,5244052);l=c[h>>2]|0}k=f+102412+(l*12&-1)|0;c[f+102412+(l*12&-1)+4>>2]=j;m=f+102400|0;n=c[m>>2]|0;if((n+j|0)>102400){c[k>>2]=dc(j)|0;a[f+102412+(l*12&-1)+8|0]=1}else{c[k>>2]=f+n|0;a[f+102412+(l*12&-1)+8|0]=0;c[m>>2]=(c[m>>2]|0)+j|0}m=f+102404|0;l=(c[m>>2]|0)+j|0;c[m>>2]=l;m=f+102408|0;f=c[m>>2]|0;c[m>>2]=(f|0)>(l|0)?f:l;c[h>>2]=(c[h>>2]|0)+1|0;h=b+36|0;c[h>>2]=c[k>>2]|0;k=c[e>>2]|0;e=(c[i>>2]|0)*152&-1;l=k+102796|0;f=c[l>>2]|0;if((f|0)<32){o=f}else{ax(5243112,38,5249276,5244052);o=c[l>>2]|0}f=k+102412+(o*12&-1)|0;c[k+102412+(o*12&-1)+4>>2]=e;m=k+102400|0;j=c[m>>2]|0;if((j+e|0)>102400){c[f>>2]=dc(e)|0;a[k+102412+(o*12&-1)+8|0]=1}else{c[f>>2]=k+j|0;a[k+102412+(o*12&-1)+8|0]=0;c[m>>2]=(c[m>>2]|0)+e|0}m=k+102404|0;o=(c[m>>2]|0)+e|0;c[m>>2]=o;m=k+102408|0;k=c[m>>2]|0;c[m>>2]=(k|0)>(o|0)?k:o;c[l>>2]=(c[l>>2]|0)+1|0;l=b+40|0;c[l>>2]=c[f>>2]|0;c[b+24>>2]=c[d+32>>2]|0;c[b+28>>2]=c[d+36>>2]|0;f=c[d+24>>2]|0;d=b+44|0;c[d>>2]=f;if((c[i>>2]|0)<=0){return}o=b+20|0;k=b+8|0;b=0;m=f;while(1){f=c[m+(b<<2)>>2]|0;e=c[f+48>>2]|0;j=c[f+52>>2]|0;p=+g[(c[e+12>>2]|0)+8>>2];q=+g[(c[j+12>>2]|0)+8>>2];n=c[e+8>>2]|0;e=c[j+8>>2]|0;j=c[f+124>>2]|0;r=(j|0)>0;if(!r){ax(5244848,71,5249592,5246084)}s=c[l>>2]|0;g[s+(b*152&-1)+136>>2]=+g[f+136>>2];g[s+(b*152&-1)+140>>2]=+g[f+140>>2];t=n+8|0;c[s+(b*152&-1)+112>>2]=c[t>>2]|0;u=e+8|0;c[s+(b*152&-1)+116>>2]=c[u>>2]|0;v=n+120|0;g[s+(b*152&-1)+120>>2]=+g[v>>2];w=e+120|0;g[s+(b*152&-1)+124>>2]=+g[w>>2];x=n+128|0;g[s+(b*152&-1)+128>>2]=+g[x>>2];y=e+128|0;g[s+(b*152&-1)+132>>2]=+g[y>>2];c[s+(b*152&-1)+148>>2]=b;c[s+(b*152&-1)+144>>2]=j;di(s+(b*152&-1)+80|0,0,32);z=c[h>>2]|0;c[z+(b*88&-1)+32>>2]=c[t>>2]|0;c[z+(b*88&-1)+36>>2]=c[u>>2]|0;g[z+(b*88&-1)+40>>2]=+g[v>>2];g[z+(b*88&-1)+44>>2]=+g[w>>2];w=n+28|0;n=z+(b*88&-1)+48|0;v=c[w+4>>2]|0;c[n>>2]=c[w>>2]|0;c[n+4>>2]=v;v=e+28|0;e=z+(b*88&-1)+56|0;n=c[v+4>>2]|0;c[e>>2]=c[v>>2]|0;c[e+4>>2]=n;g[z+(b*88&-1)+64>>2]=+g[x>>2];g[z+(b*88&-1)+68>>2]=+g[y>>2];y=f+104|0;x=z+(b*88&-1)+16|0;n=c[y+4>>2]|0;c[x>>2]=c[y>>2]|0;c[x+4>>2]=n;n=f+112|0;x=z+(b*88&-1)+24|0;y=c[n+4>>2]|0;c[x>>2]=c[n>>2]|0;c[x+4>>2]=y;c[z+(b*88&-1)+84>>2]=j;g[z+(b*88&-1)+76>>2]=p;g[z+(b*88&-1)+80>>2]=q;c[z+(b*88&-1)+72>>2]=c[f+120>>2]|0;L2368:do{if(r){y=0;while(1){if((a[o]&1)<<24>>24==0){g[s+(b*152&-1)+(y*36&-1)+16>>2]=0.0;g[s+(b*152&-1)+(y*36&-1)+20>>2]=0.0}else{g[s+(b*152&-1)+(y*36&-1)+16>>2]=+g[k>>2]*+g[f+64+(y*20&-1)+8>>2];g[s+(b*152&-1)+(y*36&-1)+20>>2]=+g[k>>2]*+g[f+64+(y*20&-1)+12>>2]}g[s+(b*152&-1)+(y*36&-1)+24>>2]=0.0;g[s+(b*152&-1)+(y*36&-1)+28>>2]=0.0;g[s+(b*152&-1)+(y*36&-1)+32>>2]=0.0;x=f+64+(y*20&-1)|0;n=z+(b*88&-1)+(y<<3)|0;e=s+(b*152&-1)+(y*36&-1)|0;c[e>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;e=c[x+4>>2]|0;c[n>>2]=c[x>>2]|0;c[n+4>>2]=e;e=y+1|0;if((e|0)==(j|0)){break L2368}else{y=e}}}}while(0);j=b+1|0;if((j|0)>=(c[i>>2]|0)){break}b=j;m=c[d>>2]|0}return}function cA(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0.0,A=0,B=0,C=0,D=0.0,E=0.0,F=0.0,G=0.0,H=0,I=0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,R=0.0,S=0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0,ae=0,af=0,ag=0.0,ah=0.0,ai=0.0;b=i;i=i+56|0;d=b|0;e=b+16|0;f=b+32|0;h=a+48|0;if((c[h>>2]|0)<=0){i=b;return}j=a+40|0;l=a+36|0;m=a+44|0;n=a+24|0;o=a+28|0;a=d+8|0;p=d+12|0;q=e+8|0;r=e+12|0;s=d;t=e;u=f;v=0;while(1){w=c[j>>2]|0;x=c[l>>2]|0;y=+g[x+(v*88&-1)+76>>2];z=+g[x+(v*88&-1)+80>>2];A=c[(c[m>>2]|0)+(c[w+(v*152&-1)+148>>2]<<2)>>2]|0;B=c[w+(v*152&-1)+112>>2]|0;C=c[w+(v*152&-1)+116>>2]|0;D=+g[w+(v*152&-1)+120>>2];E=+g[w+(v*152&-1)+124>>2];F=+g[w+(v*152&-1)+128>>2];G=+g[w+(v*152&-1)+132>>2];H=x+(v*88&-1)+48|0;I=c[H+4>>2]|0;J=(c[k>>2]=c[H>>2]|0,+g[k>>2]);K=(c[k>>2]=I,+g[k>>2]);I=x+(v*88&-1)+56|0;x=c[I+4>>2]|0;L=(c[k>>2]=c[I>>2]|0,+g[k>>2]);M=(c[k>>2]=x,+g[k>>2]);x=c[n>>2]|0;I=x+(B*12&-1)|0;H=c[I+4>>2]|0;N=(c[k>>2]=c[I>>2]|0,+g[k>>2]);O=(c[k>>2]=H,+g[k>>2]);R=+g[x+(B*12&-1)+8>>2];H=c[o>>2]|0;I=H+(B*12&-1)|0;S=c[I+4>>2]|0;T=(c[k>>2]=c[I>>2]|0,+g[k>>2]);U=(c[k>>2]=S,+g[k>>2]);V=+g[H+(B*12&-1)+8>>2];B=x+(C*12&-1)|0;S=c[B+4>>2]|0;W=(c[k>>2]=c[B>>2]|0,+g[k>>2]);X=(c[k>>2]=S,+g[k>>2]);Y=+g[x+(C*12&-1)+8>>2];x=H+(C*12&-1)|0;S=c[x+4>>2]|0;Z=(c[k>>2]=c[x>>2]|0,+g[k>>2]);_=(c[k>>2]=S,+g[k>>2]);$=+g[H+(C*12&-1)+8>>2];if((c[A+124>>2]|0)<=0){ax(5244848,168,5249648,5245280)}aa=+Q(R);g[a>>2]=aa;ab=+P(R);g[p>>2]=ab;R=+Q(Y);g[q>>2]=R;ac=+P(Y);g[r>>2]=ac;C=(g[k>>2]=N-(J*ab-K*aa),c[k>>2]|0);H=(g[k>>2]=O-(K*ab+J*aa),c[k>>2]|0)|0;c[s>>2]=0|C;c[s+4>>2]=H;H=(g[k>>2]=W-(L*ac-M*R),c[k>>2]|0);C=(g[k>>2]=X-(M*ac+L*R),c[k>>2]|0)|0;c[t>>2]=0|H;c[t+4>>2]=C;bg(f,A+64|0,d,y,e,z);A=w+(v*152&-1)+72|0;C=A;H=c[u+4>>2]|0;c[C>>2]=c[u>>2]|0;c[C+4>>2]=H;H=w+(v*152&-1)+144|0;C=c[H>>2]|0;do{if((C|0)>0){S=w+(v*152&-1)+76|0;x=A|0;z=D+E;y=-0.0-$;R=-0.0-V;B=w+(v*152&-1)+140|0;I=0;while(1){L=+g[f+8+(I<<3)>>2];ac=L-N;M=+g[f+8+(I<<3)+4>>2];ad=w+(v*152&-1)+(I*36&-1)|0;ae=(g[k>>2]=ac,c[k>>2]|0);af=(g[k>>2]=M-O,c[k>>2]|0)|0;c[ad>>2]=0|ae;c[ad+4>>2]=af;aa=L-W;af=w+(v*152&-1)+(I*36&-1)+8|0;ad=(g[k>>2]=aa,c[k>>2]|0);ae=(g[k>>2]=M-X,c[k>>2]|0)|0;c[af>>2]=0|ad;c[af+4>>2]=ae;M=+g[S>>2];L=+g[w+(v*152&-1)+(I*36&-1)+4>>2];J=+g[x>>2];ab=ac*M-L*J;K=+g[w+(v*152&-1)+(I*36&-1)+12>>2];Y=M*aa-J*K;J=z+ab*F*ab+Y*G*Y;if(J>0.0){ag=1.0/J}else{ag=0.0}g[w+(v*152&-1)+(I*36&-1)+24>>2]=ag;J=+g[S>>2];Y=+g[x>>2]*-1.0;ab=ac*Y-J*L;M=Y*aa-J*K;J=z+ab*F*ab+M*G*M;if(J>0.0){ah=1.0/J}else{ah=0.0}g[w+(v*152&-1)+(I*36&-1)+28>>2]=ah;ae=w+(v*152&-1)+(I*36&-1)+32|0;g[ae>>2]=0.0;J=+g[x>>2]*(Z+K*y-T-L*R)+ +g[S>>2]*(_+$*aa-U-V*ac);if(J<-1.0){g[ae>>2]=J*(-0.0- +g[B>>2])}ae=I+1|0;if((ae|0)==(C|0)){break}else{I=ae}}if((c[H>>2]|0)!=2){break}R=+g[w+(v*152&-1)+76>>2];y=+g[A>>2];z=+g[w+(v*152&-1)>>2]*R- +g[w+(v*152&-1)+4>>2]*y;J=R*+g[w+(v*152&-1)+8>>2]-y*+g[w+(v*152&-1)+12>>2];ac=R*+g[w+(v*152&-1)+36>>2]-y*+g[w+(v*152&-1)+40>>2];aa=R*+g[w+(v*152&-1)+44>>2]-y*+g[w+(v*152&-1)+48>>2];y=D+E;R=F*z;L=G*J;K=y+z*R+J*L;J=y+ac*F*ac+aa*G*aa;z=y+R*ac+L*aa;aa=K*J-z*z;if(K*K>=aa*1.0e3){c[H>>2]=1;break}g[w+(v*152&-1)+96>>2]=K;g[w+(v*152&-1)+100>>2]=z;g[w+(v*152&-1)+104>>2]=z;g[w+(v*152&-1)+108>>2]=J;if(aa!=0.0){ai=1.0/aa}else{ai=aa}aa=z*(-0.0-ai);g[w+(v*152&-1)+80>>2]=J*ai;g[w+(v*152&-1)+84>>2]=aa;g[w+(v*152&-1)+88>>2]=aa;g[w+(v*152&-1)+92>>2]=K*ai}}while(0);w=v+1|0;if((w|0)<(c[h>>2]|0)){v=w}else{break}}i=b;return}
function cB(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,i=0,j=0.0,l=0.0,m=0.0,n=0.0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0;b=a+48|0;if((c[b>>2]|0)<=0){return}d=a+40|0;e=a+28|0;a=0;while(1){f=c[d>>2]|0;h=c[f+(a*152&-1)+112>>2]|0;i=c[f+(a*152&-1)+116>>2]|0;j=+g[f+(a*152&-1)+120>>2];l=+g[f+(a*152&-1)+128>>2];m=+g[f+(a*152&-1)+124>>2];n=+g[f+(a*152&-1)+132>>2];o=c[f+(a*152&-1)+144>>2]|0;p=c[e>>2]|0;q=p+(h*12&-1)|0;r=c[q+4>>2]|0;s=(c[k>>2]=c[q>>2]|0,+g[k>>2]);t=(c[k>>2]=r,+g[k>>2]);u=+g[p+(h*12&-1)+8>>2];r=p+(i*12&-1)|0;v=c[r+4>>2]|0;w=(c[k>>2]=c[r>>2]|0,+g[k>>2]);x=(c[k>>2]=v,+g[k>>2]);y=+g[p+(i*12&-1)+8>>2];p=f+(a*152&-1)+72|0;v=c[p+4>>2]|0;z=(c[k>>2]=c[p>>2]|0,+g[k>>2]);A=(c[k>>2]=v,+g[k>>2]);B=z*-1.0;L2416:do{if((o|0)>0){C=t;D=s;E=x;F=w;G=u;H=y;v=0;while(1){I=+g[f+(a*152&-1)+(v*36&-1)+16>>2];J=+g[f+(a*152&-1)+(v*36&-1)+20>>2];K=z*I+A*J;L=A*I+B*J;J=G-l*(+g[f+(a*152&-1)+(v*36&-1)>>2]*L- +g[f+(a*152&-1)+(v*36&-1)+4>>2]*K);I=D-j*K;M=C-j*L;N=H+n*(L*+g[f+(a*152&-1)+(v*36&-1)+8>>2]-K*+g[f+(a*152&-1)+(v*36&-1)+12>>2]);O=F+m*K;K=E+m*L;p=v+1|0;if((p|0)==(o|0)){P=M;Q=I;R=K;S=O;T=J;U=N;break L2416}else{C=M;D=I;E=K;F=O;G=J;H=N;v=p}}}else{P=t;Q=s;R=x;S=w;T=u;U=y}}while(0);o=(g[k>>2]=Q,c[k>>2]|0);f=(g[k>>2]=P,c[k>>2]|0)|0;c[q>>2]=0|o;c[q+4>>2]=f;g[(c[e>>2]|0)+(h*12&-1)+8>>2]=T;f=(c[e>>2]|0)+(i*12&-1)|0;o=(g[k>>2]=S,c[k>>2]|0);v=(g[k>>2]=R,c[k>>2]|0)|0;c[f>>2]=0|o;c[f+4>>2]=v;g[(c[e>>2]|0)+(i*12&-1)+8>>2]=U;v=a+1|0;if((v|0)<(c[b>>2]|0)){a=v}else{break}}return}function cC(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,i=0,j=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0,q=0,r=0,s=0,t=0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0,J=0.0,K=0.0,L=0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0.0,ag=0.0,ah=0.0,ai=0.0,aj=0.0;b=a+48|0;if((c[b>>2]|0)<=0){return}d=a+40|0;e=a+28|0;a=0;while(1){f=c[d>>2]|0;h=f+(a*152&-1)|0;i=c[f+(a*152&-1)+112>>2]|0;j=c[f+(a*152&-1)+116>>2]|0;l=+g[f+(a*152&-1)+120>>2];m=+g[f+(a*152&-1)+128>>2];n=+g[f+(a*152&-1)+124>>2];o=+g[f+(a*152&-1)+132>>2];p=f+(a*152&-1)+144|0;q=c[p>>2]|0;r=c[e>>2]|0;s=r+(i*12&-1)|0;t=c[s+4>>2]|0;u=(c[k>>2]=c[s>>2]|0,+g[k>>2]);v=(c[k>>2]=t,+g[k>>2]);w=+g[r+(i*12&-1)+8>>2];t=r+(j*12&-1)|0;s=c[t+4>>2]|0;x=(c[k>>2]=c[t>>2]|0,+g[k>>2]);y=(c[k>>2]=s,+g[k>>2]);z=+g[r+(j*12&-1)+8>>2];r=f+(a*152&-1)+72|0;s=c[r+4>>2]|0;A=(c[k>>2]=c[r>>2]|0,+g[k>>2]);B=(c[k>>2]=s,+g[k>>2]);C=A*-1.0;D=+g[f+(a*152&-1)+136>>2];do{if((q-1|0)>>>0<2){E=v;F=u;G=y;H=x;I=0;J=z;K=w;L=1838}else{ax(5244848,311,5249704,5244216);if((q|0)>0){E=v;F=u;G=y;H=x;I=0;J=z;K=w;L=1838;break}else{M=v;N=u;O=y;P=x;Q=z;R=w;break}}}while(0);L2429:do{if((L|0)==1838){while(1){L=0;w=+g[f+(a*152&-1)+(I*36&-1)+12>>2];z=+g[f+(a*152&-1)+(I*36&-1)+8>>2];x=+g[f+(a*152&-1)+(I*36&-1)+4>>2];y=+g[f+(a*152&-1)+(I*36&-1)>>2];u=D*+g[f+(a*152&-1)+(I*36&-1)+16>>2];s=f+(a*152&-1)+(I*36&-1)+20|0;v=+g[s>>2];S=v+ +g[f+(a*152&-1)+(I*36&-1)+28>>2]*(-0.0-(B*(H+w*(-0.0-J)-F-x*(-0.0-K))+C*(G+J*z-E-K*y)));T=-0.0-u;U=S<u?S:u;u=U<T?T:U;U=u-v;g[s>>2]=u;u=B*U;v=C*U;U=F-l*u;T=E-l*v;S=K-m*(y*v-x*u);x=H+n*u;y=G+n*v;V=J+o*(z*v-w*u);s=I+1|0;if((s|0)==(q|0)){M=T;N=U;O=y;P=x;Q=V;R=S;break L2429}else{E=T;F=U;G=y;H=x;I=s;J=V;K=S;L=1838}}}}while(0);L2433:do{if((c[p>>2]|0)==1){C=+g[f+(a*152&-1)+12>>2];D=+g[f+(a*152&-1)+8>>2];S=+g[f+(a*152&-1)+4>>2];V=+g[h>>2];q=f+(a*152&-1)+16|0;x=+g[q>>2];y=x+(A*(P+C*(-0.0-Q)-N-S*(-0.0-R))+B*(O+Q*D-M-R*V)- +g[f+(a*152&-1)+32>>2])*(-0.0- +g[f+(a*152&-1)+24>>2]);U=y>0.0?y:0.0;y=U-x;g[q>>2]=U;U=A*y;x=B*y;W=R-m*(V*x-S*U);X=Q+o*(D*x-C*U);Y=P+n*U;Z=O+n*x;_=N-l*U;$=M-l*x}else{q=f+(a*152&-1)+16|0;x=+g[q>>2];s=f+(a*152&-1)+52|0;U=+g[s>>2];if(x<0.0|U<0.0){ax(5244848,406,5249704,5243848)}C=-0.0-Q;D=+g[f+(a*152&-1)+12>>2];S=+g[f+(a*152&-1)+8>>2];V=-0.0-R;y=+g[f+(a*152&-1)+4>>2];T=+g[h>>2];u=+g[f+(a*152&-1)+48>>2];w=+g[f+(a*152&-1)+44>>2];v=+g[f+(a*152&-1)+40>>2];z=+g[f+(a*152&-1)+36>>2];aa=+g[f+(a*152&-1)+104>>2];ab=+g[f+(a*152&-1)+100>>2];ac=A*(P+D*C-N-y*V)+B*(O+Q*S-M-R*T)- +g[f+(a*152&-1)+32>>2]-(x*+g[f+(a*152&-1)+96>>2]+U*aa);ad=A*(P+u*C-N-v*V)+B*(O+Q*w-M-R*z)- +g[f+(a*152&-1)+68>>2]-(x*ab+U*+g[f+(a*152&-1)+108>>2]);V=+g[f+(a*152&-1)+80>>2]*ac+ +g[f+(a*152&-1)+88>>2]*ad;C=ac*+g[f+(a*152&-1)+84>>2]+ad*+g[f+(a*152&-1)+92>>2];ae=-0.0-V;af=-0.0-C;if(!(V>-0.0|C>-0.0)){C=ae-x;V=af-U;ag=A*C;ah=B*C;C=A*V;ai=B*V;V=ag+C;aj=ah+ai;g[q>>2]=ae;g[s>>2]=af;W=R-m*(T*ah-y*ag+(z*ai-v*C));X=Q+o*(S*ah-D*ag+(w*ai-u*C));Y=P+n*V;Z=O+n*aj;_=N-l*V;$=M-l*aj;break}aj=ac*(-0.0- +g[f+(a*152&-1)+24>>2]);do{if(aj>=0.0){if(ad+aj*ab<0.0){break}V=aj-x;C=0.0-U;ai=A*V;ag=B*V;V=A*C;ah=B*C;C=V+ai;af=ah+ag;g[q>>2]=aj;g[s>>2]=0.0;W=R-m*(ag*T-ai*y+(ah*z-V*v));X=Q+o*(ag*S-ai*D+(ah*w-V*u));Y=P+n*C;Z=O+n*af;_=N-l*C;$=M-l*af;break L2433}}while(0);aj=ad*(-0.0- +g[f+(a*152&-1)+60>>2]);do{if(aj>=0.0){if(ac+aj*aa<0.0){break}ab=0.0-x;af=aj-U;C=A*ab;V=B*ab;ab=A*af;ah=B*af;af=C+ab;ai=V+ah;g[q>>2]=0.0;g[s>>2]=aj;W=R-m*(V*T-C*y+(ah*z-ab*v));X=Q+o*(V*S-C*D+(ah*w-ab*u));Y=P+n*af;Z=O+n*ai;_=N-l*af;$=M-l*ai;break L2433}}while(0);if(ac<0.0|ad<0.0){W=R;X=Q;Y=P;Z=O;_=N;$=M;break}aj=0.0-x;aa=0.0-U;ai=A*aj;af=B*aj;aj=A*aa;ab=B*aa;aa=ai+aj;ah=af+ab;g[q>>2]=0.0;g[s>>2]=0.0;W=R-m*(af*T-ai*y+(ab*z-aj*v));X=Q+o*(af*S-ai*D+(ab*w-aj*u));Y=P+n*aa;Z=O+n*ah;_=N-l*aa;$=M-l*ah}}while(0);f=(c[e>>2]|0)+(i*12&-1)|0;h=(g[k>>2]=_,c[k>>2]|0);p=(g[k>>2]=$,c[k>>2]|0)|0;c[f>>2]=0|h;c[f+4>>2]=p;g[(c[e>>2]|0)+(i*12&-1)+8>>2]=W;p=(c[e>>2]|0)+(j*12&-1)|0;f=(g[k>>2]=Y,c[k>>2]|0);h=(g[k>>2]=Z,c[k>>2]|0)|0;c[p>>2]=0|f;c[p+4>>2]=h;g[(c[e>>2]|0)+(j*12&-1)+8>>2]=X;h=a+1|0;if((h|0)<(c[b>>2]|0)){a=h}else{break}}return}function cD(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0.0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0.0,y=0,z=0,A=0,B=0,C=0,D=0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0,N=0.0,O=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0,ag=0.0,ah=0.0,ai=0.0,aj=0.0,ak=0.0,al=0.0,am=0.0,an=0.0,ao=0.0,ap=0.0,aq=0.0,ar=0.0,as=0.0,at=0.0,au=0.0,av=0.0,aw=0.0,ax=0.0,ay=0.0,az=0.0,aA=0.0,aB=0;b=i;i=i+52|0;d=b|0;e=b+16|0;f=b+32|0;h=a+48|0;if((c[h>>2]|0)<=0){j=0.0;l=j>=-.014999999664723873;i=b;return l|0}m=a+36|0;n=a+24|0;a=d+8|0;o=d+12|0;p=e+8|0;q=e+12|0;r=d;s=e;t=f;u=f+8|0;v=f+16|0;w=0;x=0.0;while(1){y=c[m>>2]|0;z=y+(w*88&-1)|0;A=c[y+(w*88&-1)+32>>2]|0;B=c[y+(w*88&-1)+36>>2]|0;C=y+(w*88&-1)+48|0;D=c[C+4>>2]|0;E=(c[k>>2]=c[C>>2]|0,+g[k>>2]);F=(c[k>>2]=D,+g[k>>2]);G=+g[y+(w*88&-1)+40>>2];H=+g[y+(w*88&-1)+64>>2];D=y+(w*88&-1)+56|0;C=c[D+4>>2]|0;I=(c[k>>2]=c[D>>2]|0,+g[k>>2]);J=(c[k>>2]=C,+g[k>>2]);K=+g[y+(w*88&-1)+44>>2];L=+g[y+(w*88&-1)+68>>2];C=c[y+(w*88&-1)+84>>2]|0;y=c[n>>2]|0;D=y+(A*12&-1)|0;M=c[D+4>>2]|0;N=(c[k>>2]=c[D>>2]|0,+g[k>>2]);O=(c[k>>2]=M,+g[k>>2]);R=+g[y+(A*12&-1)+8>>2];M=y+(B*12&-1)|0;D=c[M+4>>2]|0;S=(c[k>>2]=c[M>>2]|0,+g[k>>2]);T=(c[k>>2]=D,+g[k>>2]);U=+g[y+(B*12&-1)+8>>2];if((C|0)>0){V=G+K;W=O;X=N;Y=T;Z=S;D=0;_=U;$=R;aa=x;while(1){ab=+Q($);g[a>>2]=ab;ac=+P($);g[o>>2]=ac;ad=+Q(_);g[p>>2]=ad;ae=+P(_);g[q>>2]=ae;M=(g[k>>2]=X-(E*ac-F*ab),c[k>>2]|0);af=(g[k>>2]=W-(F*ac+E*ab),c[k>>2]|0)|0;c[r>>2]=0|M;c[r+4>>2]=af;af=(g[k>>2]=Z-(I*ae-J*ad),c[k>>2]|0);M=(g[k>>2]=Y-(J*ae+I*ad),c[k>>2]|0)|0;c[s>>2]=0|af;c[s+4>>2]=M;cH(f,z,d,e,D);M=c[t+4>>2]|0;ad=(c[k>>2]=c[t>>2]|0,+g[k>>2]);ae=(c[k>>2]=M,+g[k>>2]);M=c[u+4>>2]|0;ab=(c[k>>2]=c[u>>2]|0,+g[k>>2]);ac=(c[k>>2]=M,+g[k>>2]);ag=+g[v>>2];ah=ab-X;ai=ac-W;aj=ab-Z;ab=ac-Y;ak=aa<ag?aa:ag;ac=(ag+.004999999888241291)*.20000000298023224;ag=ac<0.0?ac:0.0;ac=ae*ah-ad*ai;al=ae*aj-ad*ab;am=al*L*al+(V+ac*H*ac);if(am>0.0){an=(-0.0-(ag<-.20000000298023224?-.20000000298023224:ag))/am}else{an=0.0}am=ad*an;ad=ae*an;ao=X-G*am;ap=W-G*ad;aq=$-H*(ah*ad-ai*am);ar=Z+K*am;as=Y+K*ad;at=_+L*(aj*ad-ab*am);M=D+1|0;if((M|0)==(C|0)){break}else{W=ap;X=ao;Y=as;Z=ar;D=M;_=at;$=aq;aa=ak}}au=ap;av=ao;aw=as;ax=ar;ay=at;az=aq;aA=ak;aB=c[n>>2]|0}else{au=O;av=N;aw=T;ax=S;ay=U;az=R;aA=x;aB=y}D=aB+(A*12&-1)|0;C=(g[k>>2]=av,c[k>>2]|0);z=(g[k>>2]=au,c[k>>2]|0)|0;c[D>>2]=0|C;c[D+4>>2]=z;g[(c[n>>2]|0)+(A*12&-1)+8>>2]=az;z=(c[n>>2]|0)+(B*12&-1)|0;D=(g[k>>2]=ax,c[k>>2]|0);C=(g[k>>2]=aw,c[k>>2]|0)|0;c[z>>2]=0|D;c[z+4>>2]=C;g[(c[n>>2]|0)+(B*12&-1)+8>>2]=ay;C=w+1|0;if((C|0)<(c[h>>2]|0)){w=C;x=aA}else{j=aA;break}}l=j>=-.014999999664723873;i=b;return l|0}function cE(a){a=a|0;return}function cF(a){a=a|0;return}function cG(a){a=a|0;return}function cH(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,l=0.0,m=0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0;if((c[b+84>>2]|0)<=0){ax(5244848,617,5248616,5243552)}h=c[b+72>>2]|0;if((h|0)==2){i=e+12|0;j=+g[i>>2];l=+g[b+16>>2];m=e+8|0;n=+g[m>>2];o=+g[b+20>>2];p=j*l-n*o;q=l*n+j*o;r=a;s=(g[k>>2]=p,c[k>>2]|0);t=(g[k>>2]=q,c[k>>2]|0)|0;c[r>>2]=0|s;c[r+4>>2]=t;o=+g[i>>2];j=+g[b+24>>2];n=+g[m>>2];l=+g[b+28>>2];u=+g[d+12>>2];v=+g[b+(f<<3)>>2];w=+g[d+8>>2];x=+g[b+(f<<3)+4>>2];y=+g[d>>2]+(u*v-w*x);z=v*w+u*x+ +g[d+4>>2];g[a+16>>2]=p*(y-(+g[e>>2]+(o*j-n*l)))+(z-(j*n+o*l+ +g[e+4>>2]))*q- +g[b+76>>2]- +g[b+80>>2];m=a+8|0;i=(g[k>>2]=y,c[k>>2]|0);t=(g[k>>2]=z,c[k>>2]|0)|0;c[m>>2]=0|i;c[m+4>>2]=t;t=(g[k>>2]=-0.0-p,c[k>>2]|0);m=(g[k>>2]=-0.0-q,c[k>>2]|0)|0;c[r>>2]=0|t;c[r+4>>2]=m;return}else if((h|0)==1){m=d+12|0;q=+g[m>>2];p=+g[b+16>>2];r=d+8|0;z=+g[r>>2];y=+g[b+20>>2];l=q*p-z*y;o=p*z+q*y;t=a;i=(g[k>>2]=l,c[k>>2]|0);s=(g[k>>2]=o,c[k>>2]|0)|0;c[t>>2]=0|i;c[t+4>>2]=s;y=+g[m>>2];q=+g[b+24>>2];z=+g[r>>2];p=+g[b+28>>2];n=+g[e+12>>2];j=+g[b+(f<<3)>>2];x=+g[e+8>>2];u=+g[b+(f<<3)+4>>2];w=+g[e>>2]+(n*j-x*u);v=j*x+n*u+ +g[e+4>>2];g[a+16>>2]=l*(w-(+g[d>>2]+(y*q-z*p)))+(v-(q*z+y*p+ +g[d+4>>2]))*o- +g[b+76>>2]- +g[b+80>>2];f=a+8|0;r=(g[k>>2]=w,c[k>>2]|0);m=(g[k>>2]=v,c[k>>2]|0)|0;c[f>>2]=0|r;c[f+4>>2]=m;return}else if((h|0)==0){v=+g[d+12>>2];w=+g[b+24>>2];o=+g[d+8>>2];p=+g[b+28>>2];y=+g[d>>2]+(v*w-o*p);z=w*o+v*p+ +g[d+4>>2];p=+g[e+12>>2];v=+g[b>>2];o=+g[e+8>>2];w=+g[b+4>>2];q=+g[e>>2]+(p*v-o*w);l=v*o+p*w+ +g[e+4>>2];w=q-y;p=l-z;e=a;d=(g[k>>2]=w,c[k>>2]|0);h=(g[k>>2]=p,c[k>>2]|0)|0;c[e>>2]=0|d;c[e+4>>2]=h;o=+N(w*w+p*p);if(o<1.1920928955078125e-7){A=w;B=p}else{v=1.0/o;o=w*v;g[a>>2]=o;u=p*v;g[a+4>>2]=u;A=o;B=u}h=a+8|0;e=(g[k>>2]=(y+q)*.5,c[k>>2]|0);d=(g[k>>2]=(z+l)*.5,c[k>>2]|0)|0;c[h>>2]=0|e;c[h+4>>2]=d;g[a+16>>2]=w*A+p*B- +g[b+76>>2]- +g[b+80>>2];return}else{return}}function cI(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,l=0,m=0.0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0.0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0.0,ag=0.0,ah=0,ai=0.0,aj=0.0,ak=0.0,al=0.0,am=0.0,an=0.0,ao=0.0,ap=0.0,aq=0.0,ar=0.0,as=0.0,at=0.0,au=0.0,av=0.0,aw=0.0,ax=0.0,ay=0.0,az=0.0,aA=0.0,aB=0.0,aC=0.0,aD=0;e=i;i=i+52|0;f=e|0;h=e+16|0;j=e+32|0;l=a+48|0;if((c[l>>2]|0)<=0){m=0.0;n=m>=-.007499999832361937;i=e;return n|0}o=a+36|0;p=a+24|0;a=f+8|0;q=f+12|0;r=h+8|0;s=h+12|0;t=f;u=h;v=j;w=j+8|0;x=j+16|0;y=0;z=0.0;while(1){A=c[o>>2]|0;B=A+(y*88&-1)|0;C=c[A+(y*88&-1)+32>>2]|0;D=c[A+(y*88&-1)+36>>2]|0;E=A+(y*88&-1)+48|0;F=c[E+4>>2]|0;G=(c[k>>2]=c[E>>2]|0,+g[k>>2]);H=(c[k>>2]=F,+g[k>>2]);F=A+(y*88&-1)+56|0;E=c[F+4>>2]|0;I=(c[k>>2]=c[F>>2]|0,+g[k>>2]);J=(c[k>>2]=E,+g[k>>2]);E=c[A+(y*88&-1)+84>>2]|0;if((C|0)==(b|0)|(C|0)==(d|0)){K=+g[A+(y*88&-1)+40>>2];L=+g[A+(y*88&-1)+64>>2]}else{K=0.0;L=0.0}M=+g[A+(y*88&-1)+44>>2];N=+g[A+(y*88&-1)+68>>2];A=c[p>>2]|0;F=A+(C*12&-1)|0;O=c[F+4>>2]|0;R=(c[k>>2]=c[F>>2]|0,+g[k>>2]);S=(c[k>>2]=O,+g[k>>2]);T=+g[A+(C*12&-1)+8>>2];O=A+(D*12&-1)|0;F=c[O+4>>2]|0;U=(c[k>>2]=c[O>>2]|0,+g[k>>2]);V=(c[k>>2]=F,+g[k>>2]);W=+g[A+(D*12&-1)+8>>2];if((E|0)>0){X=K+M;Y=S;Z=R;_=V;$=U;aa=T;ab=W;F=0;ac=z;while(1){ad=+Q(aa);g[a>>2]=ad;ae=+P(aa);g[q>>2]=ae;af=+Q(ab);g[r>>2]=af;ag=+P(ab);g[s>>2]=ag;O=(g[k>>2]=Z-(G*ae-H*ad),c[k>>2]|0);ah=(g[k>>2]=Y-(H*ae+G*ad),c[k>>2]|0)|0;c[t>>2]=0|O;c[t+4>>2]=ah;ah=(g[k>>2]=$-(I*ag-J*af),c[k>>2]|0);O=(g[k>>2]=_-(J*ag+I*af),c[k>>2]|0)|0;c[u>>2]=0|ah;c[u+4>>2]=O;cH(j,B,f,h,F);O=c[v+4>>2]|0;af=(c[k>>2]=c[v>>2]|0,+g[k>>2]);ag=(c[k>>2]=O,+g[k>>2]);O=c[w+4>>2]|0;ad=(c[k>>2]=c[w>>2]|0,+g[k>>2]);ae=(c[k>>2]=O,+g[k>>2]);ai=+g[x>>2];aj=ad-Z;ak=ae-Y;al=ad-$;ad=ae-_;am=ac<ai?ac:ai;ae=(ai+.004999999888241291)*.75;ai=ae<0.0?ae:0.0;ae=ag*aj-af*ak;an=ag*al-af*ad;ao=an*N*an+(X+ae*L*ae);if(ao>0.0){ap=(-0.0-(ai<-.20000000298023224?-.20000000298023224:ai))/ao}else{ap=0.0}ao=af*ap;af=ag*ap;aq=Z-K*ao;ar=Y-K*af;as=aa-L*(aj*af-ak*ao);at=$+M*ao;au=_+M*af;av=ab+N*(al*af-ad*ao);O=F+1|0;if((O|0)==(E|0)){break}else{Y=ar;Z=aq;_=au;$=at;aa=as;ab=av;F=O;ac=am}}aw=ar;ax=aq;ay=au;az=at;aA=as;aB=av;aC=am;aD=c[p>>2]|0}else{aw=S;ax=R;ay=V;az=U;aA=T;aB=W;aC=z;aD=A}F=aD+(C*12&-1)|0;E=(g[k>>2]=ax,c[k>>2]|0);B=(g[k>>2]=aw,c[k>>2]|0)|0;c[F>>2]=0|E;c[F+4>>2]=B;g[(c[p>>2]|0)+(C*12&-1)+8>>2]=aA;B=(c[p>>2]|0)+(D*12&-1)|0;F=(g[k>>2]=az,c[k>>2]|0);E=(g[k>>2]=ay,c[k>>2]|0)|0;c[B>>2]=0|F;c[B+4>>2]=E;g[(c[p>>2]|0)+(D*12&-1)+8>>2]=aB;E=y+1|0;if((E|0)<(c[l>>2]|0)){y=E;z=aC}else{m=aC;break}}n=m>=-.007499999832361937;i=e;return n|0}function cJ(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0.0,l=0.0,m=0;e=bK(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;b=e;c[b>>2]=5250572;c[e+4>>2]=4;c[e+48>>2]=a;j=e+52|0;c[j>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;di(e+8|0,0,40);g[e+136>>2]=+N(+g[a+16>>2]*+g[d+16>>2]);k=+g[a+20>>2];l=+g[d+20>>2];g[e+140>>2]=k>l?k:l;c[b>>2]=5250692;if((c[(c[a+12>>2]|0)+4>>2]|0)==1){m=d}else{ax(5244700,41,5249e3,5246040);m=c[j>>2]|0}if((c[(c[m+12>>2]|0)+4>>2]|0)==0){h=f;i=h|0;return i|0}ax(5244700,42,5249e3,5245168);h=f;i=h|0;return i|0}function cK(b,d){b=b|0;d=d|0;var e=0,f=0;aH[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251840]|0;if((e&255)>=14){ax(5243252,173,5249496,5244088)}f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}function cL(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;ba(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function cM(a){a=a|0;de(a);return}function cN(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0.0,l=0.0,m=0;e=bK(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;b=e;c[b>>2]=5250572;c[e+4>>2]=4;c[e+48>>2]=a;j=e+52|0;c[j>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;di(e+8|0,0,40);g[e+136>>2]=+N(+g[a+16>>2]*+g[d+16>>2]);k=+g[a+20>>2];l=+g[d+20>>2];g[e+140>>2]=k>l?k:l;c[b>>2]=5250644;if((c[(c[a+12>>2]|0)+4>>2]|0)==1){m=d}else{ax(5244596,41,5248832,5246040);m=c[j>>2]|0}if((c[(c[m+12>>2]|0)+4>>2]|0)==2){h=f;i=h|0;return i|0}ax(5244596,42,5248832,5245056);h=f;i=h|0;return i|0}function cO(b,d){b=b|0;d=d|0;var e=0,f=0;aH[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251840]|0;if((e&255)>=14){ax(5243252,173,5249496,5244088)}f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}function cP(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;i=i+252|0;g=f|0;bb(g,b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function cQ(a){a=a|0;de(a);return}function cR(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0.0,l=0.0,m=0;e=bK(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;b=e;c[b>>2]=5250572;c[e+4>>2]=4;c[e+48>>2]=a;j=e+52|0;c[j>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;di(e+8|0,0,40);g[e+136>>2]=+N(+g[a+16>>2]*+g[d+16>>2]);k=+g[a+20>>2];l=+g[d+20>>2];g[e+140>>2]=k>l?k:l;c[b>>2]=5250596;if((c[(c[a+12>>2]|0)+4>>2]|0)==2){m=d}else{ax(5244476,41,5248536,5245996);m=c[j>>2]|0}if((c[(c[m+12>>2]|0)+4>>2]|0)==0){h=f;i=h|0;return i|0}ax(5244476,42,5248536,5245168);h=f;i=h|0;return i|0}function cS(b,d){b=b|0;d=d|0;var e=0,f=0;aH[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251840]|0;if((e&255)>=14){ax(5243252,173,5249496,5244088)}f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}function cT(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;a8(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function cU(a){a=a|0;de(a);return}function cV(a){a=a|0;return}function cW(a){a=a|0;return}function cX(a){a=a|0;return}function cY(a){a=a|0;return}function cZ(a){a=a|0;return}function c_(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((c[d+8>>2]|0)!=(b|0)){return}b=d+16|0;g=c[b>>2]|0;if((g|0)==0){c[b>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((g|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1|0;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function c$(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;if((c[d+8>>2]|0)==(b|0)){if((c[d+4>>2]|0)!=(e|0)){return}g=d+28|0;if((c[g>>2]|0)==1){return}c[g>>2]=f;return}if((c[d>>2]|0)!=(b|0)){return}do{if((c[d+16>>2]|0)!=(e|0)){b=d+20|0;if((c[b>>2]|0)==(e|0)){break}c[d+32>>2]=f;c[b>>2]=e;b=d+40|0;c[b>>2]=(c[b>>2]|0)+1|0;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){break}a[d+54|0]=1}}while(0);c[d+44>>2]=4;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function c0(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0;if((c[d+8>>2]|0)!=(b|0)){return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;b=c[f>>2]|0;if((b|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1|0;a[d+54|0]=1;return}e=d+24|0;b=c[e>>2]|0;if((b|0)==2){c[e>>2]=g;i=g}else{i=b}if(!((c[d+48>>2]|0)==1&(i|0)==1)){return}a[d+54|0]=1;return}function c1(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0.0,l=0.0,m=0;e=bK(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;b=e;c[b>>2]=5250572;c[e+4>>2]=4;c[e+48>>2]=a;j=e+52|0;c[j>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;di(e+8|0,0,40);g[e+136>>2]=+N(+g[a+16>>2]*+g[d+16>>2]);k=+g[a+20>>2];l=+g[d+20>>2];g[e+140>>2]=k>l?k:l;c[b>>2]=5250752;if((c[(c[a+12>>2]|0)+4>>2]|0)==2){m=d}else{ax(5244384,44,5249352,5245996);m=c[j>>2]|0}if((c[(c[m+12>>2]|0)+4>>2]|0)==2){h=f;i=h|0;return i|0}ax(5244384,45,5249352,5245056);h=f;i=h|0;return i|0}function c2(b,d){b=b|0;d=d|0;var e=0,f=0;aH[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251840]|0;if((e&255)>=14){ax(5243252,173,5249496,5244088)}f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}function c3(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bd(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function c4(a){a=a|0;de(a);return}function c5(a){a=a|0;de(a);return}function c6(a){a=a|0;de(a);return}function c7(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+56|0;f=e|0;if((a|0)==(b|0)){g=1;i=e;return g|0}if((b|0)==0){g=0;i=e;return g|0}h=c9(b,5251344,5251332,-1)|0;b=h;if((h|0)==0){g=0;i=e;return g|0}di(f|0,0,56);c[f>>2]=b;c[f+8>>2]=a;c[f+12>>2]=-1;c[f+48>>2]=1;aQ[c[(c[h>>2]|0)+28>>2]&255](b,f,c[d>>2]|0,1);if((c[f+24>>2]|0)!=1){g=0;i=e;return g|0}c[d>>2]=c[f+16>>2]|0;g=1;i=e;return g|0}function c8(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((b|0)!=(c[d+8>>2]|0)){g=c[b+8>>2]|0;aQ[c[(c[g>>2]|0)+28>>2]&255](g,d,e,f);return}g=d+16|0;b=c[g>>2]|0;if((b|0)==0){c[g>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1|0;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function c9(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;i=i+56|0;g=f|0;h=c[a>>2]|0;j=a+(c[h-8>>2]|0)|0;k=c[h-4>>2]|0;h=k;c[g>>2]=d;c[g+4>>2]=a;c[g+8>>2]=b;c[g+12>>2]=e;e=g+16|0;b=g+20|0;a=g+24|0;l=g+28|0;m=g+32|0;n=g+40|0;di(e|0,0,39);if((k|0)==(d|0)){c[g+48>>2]=1;aO[c[(c[k>>2]|0)+20>>2]&255](h,g,j,j,1,0);i=f;return((c[a>>2]|0)==1?j:0)|0}aG[c[(c[k>>2]|0)+24>>2]&255](h,g,j,1,0);j=c[g+36>>2]|0;if((j|0)==0){if((c[n>>2]|0)!=1){o=0;i=f;return o|0}if((c[l>>2]|0)!=1){o=0;i=f;return o|0}o=(c[m>>2]|0)==1?c[b>>2]|0:0;i=f;return o|0}else if((j|0)==1){do{if((c[a>>2]|0)!=1){if((c[n>>2]|0)!=0){o=0;i=f;return o|0}if((c[l>>2]|0)!=1){o=0;i=f;return o|0}if((c[m>>2]|0)==1){break}else{o=0}i=f;return o|0}}while(0);o=c[e>>2]|0;i=f;return o|0}else{o=0;i=f;return o|0}return 0}function da(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0;h=b|0;if((h|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){return}i=d+28|0;if((c[i>>2]|0)==1){return}c[i>>2]=f;return}if((h|0)!=(c[d>>2]|0)){h=c[b+8>>2]|0;aG[c[(c[h>>2]|0)+24>>2]&255](h,d,e,f,g);return}do{if((c[d+16>>2]|0)!=(e|0)){h=d+20|0;if((c[h>>2]|0)==(e|0)){break}c[d+32>>2]=f;i=d+44|0;if((c[i>>2]|0)==4){return}j=d+52|0;a[j]=0;k=d+53|0;a[k]=0;l=c[b+8>>2]|0;aO[c[(c[l>>2]|0)+20>>2]&255](l,d,e,e,1,g);do{if((a[k]&1)<<24>>24==0){m=0;n=2072}else{if((a[j]&1)<<24>>24==0){m=1;n=2072;break}else{break}}}while(0);L2729:do{if((n|0)==2072){c[h>>2]=e;j=d+40|0;c[j>>2]=(c[j>>2]|0)+1|0;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){n=2075;break}a[d+54|0]=1;if(m){break L2729}else{break}}else{n=2075}}while(0);if((n|0)==2075){if(m){break}}c[i>>2]=4;return}}while(0);c[i>>2]=3;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function db(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0;if((b|0)!=(c[d+8>>2]|0)){i=c[b+8>>2]|0;aO[c[(c[i>>2]|0)+20>>2]&255](i,d,e,f,g,h);return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;h=c[f>>2]|0;if((h|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((h|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1|0;a[d+54|0]=1;return}e=d+24|0;h=c[e>>2]|0;if((h|0)==2){c[e>>2]=g;j=g}else{j=h}if(!((c[d+48>>2]|0)==1&(j|0)==1)){return}a[d+54|0]=1;return}function dc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,aj=0,ak=0,al=0,am=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,aB=0,aC=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0;do{if(a>>>0<245){if(a>>>0<11){b=16}else{b=a+11&-8}d=b>>>3;e=c[1311627]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=5246548+(h<<2)|0;j=5246548+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[1311627]=e&(1<<g^-1)}else{if(l>>>0<(c[1311631]|0)>>>0){ai();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{ai();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[1311629]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=5246548+(p<<2)|0;m=5246548+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[1311627]=e&(1<<r^-1)}else{if(l>>>0<(c[1311631]|0)>>>0){ai();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{ai();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[1311629]|0;if((l|0)!=0){q=c[1311632]|0;d=l>>>3;l=d<<1;f=5246548+(l<<2)|0;k=c[1311627]|0;h=1<<d;do{if((k&h|0)==0){c[1311627]=k|h;s=f;t=5246548+(l+2<<2)|0}else{d=5246548+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[1311631]|0)>>>0){s=g;t=d;break}ai();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[1311629]=m;c[1311632]=e;n=i;return n|0}l=c[1311628]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[5246812+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[1311631]|0;if(r>>>0<i>>>0){ai();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){ai();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;L2827:do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;do{if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break L2827}else{w=l;x=k;break}}else{w=g;x=q}}while(0);while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){ai();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){ai();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){ai();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{ai();return 0}}}while(0);L2849:do{if((e|0)!=0){f=d+28|0;i=5246812+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[1311628]=c[1311628]&(1<<c[f>>2]^-1);break L2849}else{if(e>>>0<(c[1311631]|0)>>>0){ai();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break L2849}}}while(0);if(v>>>0<(c[1311631]|0)>>>0){ai();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4|0)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b|0)>>2]=p;f=c[1311629]|0;if((f|0)!=0){e=c[1311632]|0;i=f>>>3;f=i<<1;q=5246548+(f<<2)|0;k=c[1311627]|0;g=1<<i;do{if((k&g|0)==0){c[1311627]=k|g;y=q;z=5246548+(f+2<<2)|0}else{i=5246548+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[1311631]|0)>>>0){y=l;z=i;break}ai();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[1311629]=p;c[1311632]=m}f=d+8|0;if((f|0)==0){o=b;break}else{n=f}return n|0}else{if(a>>>0>4294967231){o=-1;break}f=a+11|0;g=f&-8;k=c[1311628]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=(14-(h|f|l)|0)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[5246812+(A<<2)>>2]|0;L2897:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break L2897}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break L2897}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[5246812+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}L2912:do{if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break L2912}else{p=r;m=i;q=e}}}}while(0);if((K|0)==0){o=g;break}if(J>>>0>=((c[1311629]|0)-g|0)>>>0){o=g;break}k=K;q=c[1311631]|0;if(k>>>0<q>>>0){ai();return 0}m=k+g|0;p=m;if(k>>>0>=m>>>0){ai();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;L2925:do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;do{if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break L2925}else{M=B;N=j;break}}else{M=d;N=r}}while(0);while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<q>>>0){ai();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<q>>>0){ai();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){ai();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{ai();return 0}}}while(0);L2947:do{if((e|0)!=0){i=K+28|0;q=5246812+(c[i>>2]<<2)|0;do{if((K|0)==(c[q>>2]|0)){c[q>>2]=L;if((L|0)!=0){break}c[1311628]=c[1311628]&(1<<c[i>>2]^-1);break L2947}else{if(e>>>0<(c[1311631]|0)>>>0){ai();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break L2947}}}while(0);if(L>>>0<(c[1311631]|0)>>>0){ai();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);do{if(J>>>0<16){e=J+g|0;c[K+4>>2]=e|3;i=k+(e+4|0)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[k+(g|4)>>2]=J|1;c[k+(J+g|0)>>2]=J;i=J>>>3;if(J>>>0<256){e=i<<1;q=5246548+(e<<2)|0;r=c[1311627]|0;j=1<<i;do{if((r&j|0)==0){c[1311627]=r|j;O=q;P=5246548+(e+2<<2)|0}else{i=5246548+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[1311631]|0)>>>0){O=d;P=i;break}ai();return 0}}while(0);c[P>>2]=p;c[O+12>>2]=p;c[k+(g+8|0)>>2]=O;c[k+(g+12|0)>>2]=q;break}e=m;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=(14-(d|r|i)|0)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=5246812+(Q<<2)|0;c[k+(g+28|0)>>2]=Q;c[k+(g+20|0)>>2]=0;c[k+(g+16|0)>>2]=0;q=c[1311628]|0;l=1<<Q;if((q&l|0)==0){c[1311628]=q|l;c[j>>2]=e;c[k+(g+24|0)>>2]=j;c[k+(g+12|0)>>2]=e;c[k+(g+8|0)>>2]=e;break}if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}l=J<<R;q=c[j>>2]|0;while(1){if((c[q+4>>2]&-8|0)==(J|0)){break}S=q+16+(l>>>31<<2)|0;j=c[S>>2]|0;if((j|0)==0){T=2259;break}else{l=l<<1;q=j}}if((T|0)==2259){if(S>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[S>>2]=e;c[k+(g+24|0)>>2]=q;c[k+(g+12|0)>>2]=e;c[k+(g+8|0)>>2]=e;break}}l=q+8|0;j=c[l>>2]|0;i=c[1311631]|0;if(q>>>0<i>>>0){ai();return 0}if(j>>>0<i>>>0){ai();return 0}else{c[j+12>>2]=e;c[l>>2]=e;c[k+(g+8|0)>>2]=j;c[k+(g+12|0)>>2]=q;c[k+(g+24|0)>>2]=0;break}}}while(0);k=K+8|0;if((k|0)==0){o=g;break}else{n=k}return n|0}}while(0);K=c[1311629]|0;if(o>>>0<=K>>>0){S=K-o|0;J=c[1311632]|0;if(S>>>0>15){R=J;c[1311632]=R+o|0;c[1311629]=S;c[R+(o+4|0)>>2]=S|1;c[R+K>>2]=S;c[J+4>>2]=o|3}else{c[1311629]=0;c[1311632]=0;c[J+4>>2]=K|3;S=J+(K+4|0)|0;c[S>>2]=c[S>>2]|1}n=J+8|0;return n|0}J=c[1311630]|0;if(o>>>0<J>>>0){S=J-o|0;c[1311630]=S;J=c[1311633]|0;K=J;c[1311633]=K+o|0;c[K+(o+4|0)>>2]=S|1;c[J+4>>2]=o|3;n=J+8|0;return n|0}do{if((c[1310720]|0)==0){J=an(8)|0;if((J-1&J|0)==0){c[1310722]=J;c[1310721]=J;c[1310723]=-1;c[1310724]=2097152;c[1310725]=0;c[1311738]=0;c[1310720]=aD(0)&-16^1431655768;break}else{ai();return 0}}}while(0);J=o+48|0;S=c[1310722]|0;K=o+47|0;R=S+K|0;Q=-S|0;S=R&Q;if(S>>>0<=o>>>0){n=0;return n|0}O=c[1311737]|0;do{if((O|0)!=0){P=c[1311735]|0;L=P+S|0;if(L>>>0<=P>>>0|L>>>0>O>>>0){n=0}else{break}return n|0}}while(0);L3039:do{if((c[1311738]&4|0)==0){O=c[1311633]|0;L3041:do{if((O|0)==0){T=2289}else{L=O;P=5246956;while(1){U=P|0;M=c[U>>2]|0;if(M>>>0<=L>>>0){V=P+4|0;if((M+(c[V>>2]|0)|0)>>>0>L>>>0){break}}M=c[P+8>>2]|0;if((M|0)==0){T=2289;break L3041}else{P=M}}if((P|0)==0){T=2289;break}L=R-(c[1311630]|0)&Q;if(L>>>0>=2147483647){W=0;break}q=az(L|0)|0;e=(q|0)==((c[U>>2]|0)+(c[V>>2]|0)|0);X=e?q:-1;Y=e?L:0;Z=q;_=L;T=2298;break}}while(0);do{if((T|0)==2289){O=az(0)|0;if((O|0)==-1){W=0;break}g=O;L=c[1310721]|0;q=L-1|0;if((q&g|0)==0){$=S}else{$=(S-g|0)+(q+g&-L)|0}L=c[1311735]|0;g=L+$|0;if(!($>>>0>o>>>0&$>>>0<2147483647)){W=0;break}q=c[1311737]|0;if((q|0)!=0){if(g>>>0<=L>>>0|g>>>0>q>>>0){W=0;break}}q=az($|0)|0;g=(q|0)==(O|0);X=g?O:-1;Y=g?$:0;Z=q;_=$;T=2298;break}}while(0);L3061:do{if((T|0)==2298){q=-_|0;if((X|0)!=-1){aa=Y;ab=X;T=2309;break L3039}do{if((Z|0)!=-1&_>>>0<2147483647&_>>>0<J>>>0){g=c[1310722]|0;O=(K-_|0)+g&-g;if(O>>>0>=2147483647){ac=_;break}if((az(O|0)|0)==-1){az(q|0);W=Y;break L3061}else{ac=O+_|0;break}}else{ac=_}}while(0);if((Z|0)==-1){W=Y}else{aa=ac;ab=Z;T=2309;break L3039}}}while(0);c[1311738]=c[1311738]|4;ad=W;T=2306;break}else{ad=0;T=2306}}while(0);do{if((T|0)==2306){if(S>>>0>=2147483647){break}W=az(S|0)|0;Z=az(0)|0;if(!((Z|0)!=-1&(W|0)!=-1&W>>>0<Z>>>0)){break}ac=Z-W|0;Z=ac>>>0>(o+40|0)>>>0;Y=Z?W:-1;if((Y|0)==-1){break}else{aa=Z?ac:ad;ab=Y;T=2309;break}}}while(0);do{if((T|0)==2309){ad=(c[1311735]|0)+aa|0;c[1311735]=ad;if(ad>>>0>(c[1311736]|0)>>>0){c[1311736]=ad}ad=c[1311633]|0;L3081:do{if((ad|0)==0){S=c[1311631]|0;if((S|0)==0|ab>>>0<S>>>0){c[1311631]=ab}c[1311739]=ab;c[1311740]=aa;c[1311742]=0;c[1311636]=c[1310720]|0;c[1311635]=-1;S=0;while(1){Y=S<<1;ac=5246548+(Y<<2)|0;c[5246548+(Y+3<<2)>>2]=ac;c[5246548+(Y+2<<2)>>2]=ac;ac=S+1|0;if((ac|0)==32){break}else{S=ac}}S=ab+8|0;if((S&7|0)==0){ae=0}else{ae=-S&7}S=(aa-40|0)-ae|0;c[1311633]=ab+ae|0;c[1311630]=S;c[ab+(ae+4|0)>>2]=S|1;c[ab+(aa-36|0)>>2]=40;c[1311634]=c[1310724]|0}else{S=5246956;while(1){af=c[S>>2]|0;ag=S+4|0;ah=c[ag>>2]|0;if((ab|0)==(af+ah|0)){T=2321;break}ac=c[S+8>>2]|0;if((ac|0)==0){break}else{S=ac}}do{if((T|0)==2321){if((c[S+12>>2]&8|0)!=0){break}ac=ad;if(!(ac>>>0>=af>>>0&ac>>>0<ab>>>0)){break}c[ag>>2]=ah+aa|0;ac=c[1311633]|0;Y=(c[1311630]|0)+aa|0;Z=ac;W=ac+8|0;if((W&7|0)==0){aj=0}else{aj=-W&7}W=Y-aj|0;c[1311633]=Z+aj|0;c[1311630]=W;c[Z+(aj+4|0)>>2]=W|1;c[Z+(Y+4|0)>>2]=40;c[1311634]=c[1310724]|0;break L3081}}while(0);if(ab>>>0<(c[1311631]|0)>>>0){c[1311631]=ab}S=ab+aa|0;Y=5246956;while(1){ak=Y|0;if((c[ak>>2]|0)==(S|0)){T=2331;break}Z=c[Y+8>>2]|0;if((Z|0)==0){break}else{Y=Z}}do{if((T|0)==2331){if((c[Y+12>>2]&8|0)!=0){break}c[ak>>2]=ab;S=Y+4|0;c[S>>2]=(c[S>>2]|0)+aa|0;S=ab+8|0;if((S&7|0)==0){al=0}else{al=-S&7}S=ab+(aa+8|0)|0;if((S&7|0)==0){am=0}else{am=-S&7}S=ab+(am+aa|0)|0;Z=S;W=al+o|0;ac=ab+W|0;_=ac;K=(S-(ab+al|0)|0)-o|0;c[ab+(al+4|0)>>2]=o|3;do{if((Z|0)==(c[1311633]|0)){J=(c[1311630]|0)+K|0;c[1311630]=J;c[1311633]=_;c[ab+(W+4|0)>>2]=J|1}else{if((Z|0)==(c[1311632]|0)){J=(c[1311629]|0)+K|0;c[1311629]=J;c[1311632]=_;c[ab+(W+4|0)>>2]=J|1;c[ab+(J+W|0)>>2]=J;break}J=aa+4|0;X=c[ab+(J+am|0)>>2]|0;if((X&3|0)==1){$=X&-8;V=X>>>3;L3116:do{if(X>>>0<256){U=c[ab+((am|8)+aa|0)>>2]|0;Q=c[ab+((aa+12|0)+am|0)>>2]|0;R=5246548+(V<<1<<2)|0;do{if((U|0)!=(R|0)){if(U>>>0<(c[1311631]|0)>>>0){ai();return 0}if((c[U+12>>2]|0)==(Z|0)){break}ai();return 0}}while(0);if((Q|0)==(U|0)){c[1311627]=c[1311627]&(1<<V^-1);break}do{if((Q|0)==(R|0)){ao=Q+8|0}else{if(Q>>>0<(c[1311631]|0)>>>0){ai();return 0}q=Q+8|0;if((c[q>>2]|0)==(Z|0)){ao=q;break}ai();return 0}}while(0);c[U+12>>2]=Q;c[ao>>2]=U}else{R=S;q=c[ab+((am|24)+aa|0)>>2]|0;P=c[ab+((aa+12|0)+am|0)>>2]|0;L3137:do{if((P|0)==(R|0)){O=am|16;g=ab+(J+O|0)|0;L=c[g>>2]|0;do{if((L|0)==0){e=ab+(O+aa|0)|0;M=c[e>>2]|0;if((M|0)==0){ap=0;break L3137}else{aq=M;ar=e;break}}else{aq=L;ar=g}}while(0);while(1){g=aq+20|0;L=c[g>>2]|0;if((L|0)!=0){aq=L;ar=g;continue}g=aq+16|0;L=c[g>>2]|0;if((L|0)==0){break}else{aq=L;ar=g}}if(ar>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[ar>>2]=0;ap=aq;break}}else{g=c[ab+((am|8)+aa|0)>>2]|0;if(g>>>0<(c[1311631]|0)>>>0){ai();return 0}L=g+12|0;if((c[L>>2]|0)!=(R|0)){ai();return 0}O=P+8|0;if((c[O>>2]|0)==(R|0)){c[L>>2]=P;c[O>>2]=g;ap=P;break}else{ai();return 0}}}while(0);if((q|0)==0){break}P=ab+((aa+28|0)+am|0)|0;U=5246812+(c[P>>2]<<2)|0;do{if((R|0)==(c[U>>2]|0)){c[U>>2]=ap;if((ap|0)!=0){break}c[1311628]=c[1311628]&(1<<c[P>>2]^-1);break L3116}else{if(q>>>0<(c[1311631]|0)>>>0){ai();return 0}Q=q+16|0;if((c[Q>>2]|0)==(R|0)){c[Q>>2]=ap}else{c[q+20>>2]=ap}if((ap|0)==0){break L3116}}}while(0);if(ap>>>0<(c[1311631]|0)>>>0){ai();return 0}c[ap+24>>2]=q;R=am|16;P=c[ab+(R+aa|0)>>2]|0;do{if((P|0)!=0){if(P>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[ap+16>>2]=P;c[P+24>>2]=ap;break}}}while(0);P=c[ab+(J+R|0)>>2]|0;if((P|0)==0){break}if(P>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[ap+20>>2]=P;c[P+24>>2]=ap;break}}}while(0);as=ab+(($|am)+aa|0)|0;at=$+K|0}else{as=Z;at=K}J=as+4|0;c[J>>2]=c[J>>2]&-2;c[ab+(W+4|0)>>2]=at|1;c[ab+(at+W|0)>>2]=at;J=at>>>3;if(at>>>0<256){V=J<<1;X=5246548+(V<<2)|0;P=c[1311627]|0;q=1<<J;do{if((P&q|0)==0){c[1311627]=P|q;au=X;av=5246548+(V+2<<2)|0}else{J=5246548+(V+2<<2)|0;U=c[J>>2]|0;if(U>>>0>=(c[1311631]|0)>>>0){au=U;av=J;break}ai();return 0}}while(0);c[av>>2]=_;c[au+12>>2]=_;c[ab+(W+8|0)>>2]=au;c[ab+(W+12|0)>>2]=X;break}V=ac;q=at>>>8;do{if((q|0)==0){aw=0}else{if(at>>>0>16777215){aw=31;break}P=(q+1048320|0)>>>16&8;$=q<<P;J=($+520192|0)>>>16&4;U=$<<J;$=(U+245760|0)>>>16&2;Q=(14-(J|P|$)|0)+(U<<$>>>15)|0;aw=at>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);q=5246812+(aw<<2)|0;c[ab+(W+28|0)>>2]=aw;c[ab+(W+20|0)>>2]=0;c[ab+(W+16|0)>>2]=0;X=c[1311628]|0;Q=1<<aw;if((X&Q|0)==0){c[1311628]=X|Q;c[q>>2]=V;c[ab+(W+24|0)>>2]=q;c[ab+(W+12|0)>>2]=V;c[ab+(W+8|0)>>2]=V;break}if((aw|0)==31){ax=0}else{ax=25-(aw>>>1)|0}Q=at<<ax;X=c[q>>2]|0;while(1){if((c[X+4>>2]&-8|0)==(at|0)){break}ay=X+16+(Q>>>31<<2)|0;q=c[ay>>2]|0;if((q|0)==0){T=2404;break}else{Q=Q<<1;X=q}}if((T|0)==2404){if(ay>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[ay>>2]=V;c[ab+(W+24|0)>>2]=X;c[ab+(W+12|0)>>2]=V;c[ab+(W+8|0)>>2]=V;break}}Q=X+8|0;q=c[Q>>2]|0;$=c[1311631]|0;if(X>>>0<$>>>0){ai();return 0}if(q>>>0<$>>>0){ai();return 0}else{c[q+12>>2]=V;c[Q>>2]=V;c[ab+(W+8|0)>>2]=q;c[ab+(W+12|0)>>2]=X;c[ab+(W+24|0)>>2]=0;break}}}while(0);n=ab+(al|8)|0;return n|0}}while(0);Y=ad;W=5246956;while(1){aB=c[W>>2]|0;if(aB>>>0<=Y>>>0){aC=c[W+4>>2]|0;aE=aB+aC|0;if(aE>>>0>Y>>>0){break}}W=c[W+8>>2]|0}W=aB+(aC-39|0)|0;if((W&7|0)==0){aF=0}else{aF=-W&7}W=aB+((aC-47|0)+aF|0)|0;ac=W>>>0<(ad+16|0)>>>0?Y:W;W=ac+8|0;_=ab+8|0;if((_&7|0)==0){aG=0}else{aG=-_&7}_=(aa-40|0)-aG|0;c[1311633]=ab+aG|0;c[1311630]=_;c[ab+(aG+4|0)>>2]=_|1;c[ab+(aa-36|0)>>2]=40;c[1311634]=c[1310724]|0;c[ac+4>>2]=27;c[W>>2]=c[1311739]|0;c[W+4>>2]=c[5246960>>2]|0;c[W+8>>2]=c[5246964>>2]|0;c[W+12>>2]=c[5246968>>2]|0;c[1311739]=ab;c[1311740]=aa;c[1311742]=0;c[1311741]=W;W=ac+28|0;c[W>>2]=7;L3235:do{if((ac+32|0)>>>0<aE>>>0){_=W;while(1){K=_+4|0;c[K>>2]=7;if((_+8|0)>>>0<aE>>>0){_=K}else{break L3235}}}}while(0);if((ac|0)==(Y|0)){break}W=ac-ad|0;_=Y+(W+4|0)|0;c[_>>2]=c[_>>2]&-2;c[ad+4>>2]=W|1;c[Y+W>>2]=W;_=W>>>3;if(W>>>0<256){K=_<<1;Z=5246548+(K<<2)|0;S=c[1311627]|0;q=1<<_;do{if((S&q|0)==0){c[1311627]=S|q;aH=Z;aI=5246548+(K+2<<2)|0}else{_=5246548+(K+2<<2)|0;Q=c[_>>2]|0;if(Q>>>0>=(c[1311631]|0)>>>0){aH=Q;aI=_;break}ai();return 0}}while(0);c[aI>>2]=ad;c[aH+12>>2]=ad;c[ad+8>>2]=aH;c[ad+12>>2]=Z;break}K=ad;q=W>>>8;do{if((q|0)==0){aJ=0}else{if(W>>>0>16777215){aJ=31;break}S=(q+1048320|0)>>>16&8;Y=q<<S;ac=(Y+520192|0)>>>16&4;_=Y<<ac;Y=(_+245760|0)>>>16&2;Q=(14-(ac|S|Y)|0)+(_<<Y>>>15)|0;aJ=W>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);q=5246812+(aJ<<2)|0;c[ad+28>>2]=aJ;c[ad+20>>2]=0;c[ad+16>>2]=0;Z=c[1311628]|0;Q=1<<aJ;if((Z&Q|0)==0){c[1311628]=Z|Q;c[q>>2]=K;c[ad+24>>2]=q;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}if((aJ|0)==31){aK=0}else{aK=25-(aJ>>>1)|0}Q=W<<aK;Z=c[q>>2]|0;while(1){if((c[Z+4>>2]&-8|0)==(W|0)){break}aL=Z+16+(Q>>>31<<2)|0;q=c[aL>>2]|0;if((q|0)==0){T=2439;break}else{Q=Q<<1;Z=q}}if((T|0)==2439){if(aL>>>0<(c[1311631]|0)>>>0){ai();return 0}else{c[aL>>2]=K;c[ad+24>>2]=Z;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}}Q=Z+8|0;W=c[Q>>2]|0;q=c[1311631]|0;if(Z>>>0<q>>>0){ai();return 0}if(W>>>0<q>>>0){ai();return 0}else{c[W+12>>2]=K;c[Q>>2]=K;c[ad+8>>2]=W;c[ad+12>>2]=Z;c[ad+24>>2]=0;break}}}while(0);ad=c[1311630]|0;if(ad>>>0<=o>>>0){break}W=ad-o|0;c[1311630]=W;ad=c[1311633]|0;Q=ad;c[1311633]=Q+o|0;c[Q+(o+4|0)>>2]=W|1;c[ad+4>>2]=o|3;n=ad+8|0;return n|0}}while(0);c[aA()>>2]=12;n=0;return n|0}function dd(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[1311631]|0;if(b>>>0<e>>>0){ai()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){ai()}h=f&-8;i=a+(h-8|0)|0;j=i;L3298:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){ai()}if((n|0)==(c[1311632]|0)){p=a+(h-4|0)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[1311629]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4|0)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256){k=c[a+(l+8|0)>>2]|0;s=c[a+(l+12|0)>>2]|0;t=5246548+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){ai()}if((c[k+12>>2]|0)==(n|0)){break}ai()}}while(0);if((s|0)==(k|0)){c[1311627]=c[1311627]&(1<<p^-1);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){ai()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}ai()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24|0)>>2]|0;v=c[a+(l+12|0)>>2]|0;L3332:do{if((v|0)==(t|0)){w=a+(l+20|0)|0;x=c[w>>2]|0;do{if((x|0)==0){y=a+(l+16|0)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break L3332}else{B=z;C=y;break}}else{B=x;C=w}}while(0);while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){ai()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8|0)>>2]|0;if(w>>>0<e>>>0){ai()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){ai()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{ai()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28|0)|0;m=5246812+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[1311628]=c[1311628]&(1<<c[v>>2]^-1);q=n;r=o;break L3298}else{if(p>>>0<(c[1311631]|0)>>>0){ai()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break L3298}}}while(0);if(A>>>0<(c[1311631]|0)>>>0){ai()}c[A+24>>2]=p;t=c[a+(l+16|0)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[1311631]|0)>>>0){ai()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20|0)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[1311631]|0)>>>0){ai()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){ai()}A=a+(h-4|0)|0;e=c[A>>2]|0;if((e&1|0)==0){ai()}do{if((e&2|0)==0){if((j|0)==(c[1311633]|0)){B=(c[1311630]|0)+r|0;c[1311630]=B;c[1311633]=q;c[q+4>>2]=B|1;if((q|0)==(c[1311632]|0)){c[1311632]=0;c[1311629]=0}if(B>>>0<=(c[1311634]|0)>>>0){return}df(0);return}if((j|0)==(c[1311632]|0)){B=(c[1311629]|0)+r|0;c[1311629]=B;c[1311632]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;L3403:do{if(e>>>0<256){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=5246548+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[1311631]|0)>>>0){ai()}if((c[u+12>>2]|0)==(j|0)){break}ai()}}while(0);if((g|0)==(u|0)){c[1311627]=c[1311627]&(1<<C^-1);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[1311631]|0)>>>0){ai()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}ai()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16|0)>>2]|0;t=c[a+(h|4)>>2]|0;L3405:do{if((t|0)==(b|0)){p=a+(h+12|0)|0;v=c[p>>2]|0;do{if((v|0)==0){m=a+(h+8|0)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break L3405}else{F=k;G=m;break}}else{F=v;G=p}}while(0);while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[1311631]|0)>>>0){ai()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[1311631]|0)>>>0){ai()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){ai()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{ai()}}}while(0);if((f|0)==0){break}t=a+(h+20|0)|0;u=5246812+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[1311628]=c[1311628]&(1<<c[t>>2]^-1);break L3403}else{if(f>>>0<(c[1311631]|0)>>>0){ai()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break L3403}}}while(0);if(E>>>0<(c[1311631]|0)>>>0){ai()}c[E+24>>2]=f;b=c[a+(h+8|0)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[1311631]|0)>>>0){ai()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12|0)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[1311631]|0)>>>0){ai()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[1311632]|0)){H=B;break}c[1311629]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256){d=r<<1;e=5246548+(d<<2)|0;A=c[1311627]|0;E=1<<r;do{if((A&E|0)==0){c[1311627]=A|E;I=e;J=5246548+(d+2<<2)|0}else{r=5246548+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[1311631]|0)>>>0){I=h;J=r;break}ai()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=(14-(E|J|d)|0)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=5246812+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[1311628]|0;d=1<<K;do{if((r&d|0)==0){c[1311628]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{if((K|0)==31){L=0}else{L=25-(K>>>1)|0}A=H<<L;J=c[I>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(H|0)){break}M=J+16+(A>>>31<<2)|0;E=c[M>>2]|0;if((E|0)==0){N=2618;break}else{A=A<<1;J=E}}if((N|0)==2618){if(M>>>0<(c[1311631]|0)>>>0){ai()}else{c[M>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break}}A=J+8|0;B=c[A>>2]|0;E=c[1311631]|0;if(J>>>0<E>>>0){ai()}if(B>>>0<E>>>0){ai()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=J;c[q+24>>2]=0;break}}}while(0);q=(c[1311635]|0)-1|0;c[1311635]=q;if((q|0)==0){O=5246964}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[1311635]=-1;return}function de(a){a=a|0;if((a|0)==0){return}dd(a);return}function df(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;do{if((c[1310720]|0)==0){b=an(8)|0;if((b-1&b|0)==0){c[1310722]=b;c[1310721]=b;c[1310723]=-1;c[1310724]=2097152;c[1310725]=0;c[1311738]=0;c[1310720]=aD(0)&-16^1431655768;break}else{ai();return 0}}}while(0);if(a>>>0>=4294967232){d=0;e=d&1;return e|0}b=c[1311633]|0;if((b|0)==0){d=0;e=d&1;return e|0}f=c[1311630]|0;do{if(f>>>0>(a+40|0)>>>0){g=c[1310722]|0;h=Z(((((((-40-a|0)-1|0)+f|0)+g|0)>>>0)/(g>>>0)>>>0)-1|0,g);i=b;j=5246956;while(1){k=c[j>>2]|0;if(k>>>0<=i>>>0){if((k+(c[j+4>>2]|0)|0)>>>0>i>>>0){l=j;break}}k=c[j+8>>2]|0;if((k|0)==0){l=0;break}else{j=k}}if((c[l+12>>2]&8|0)!=0){break}j=az(0)|0;i=l+4|0;if((j|0)!=((c[l>>2]|0)+(c[i>>2]|0)|0)){break}k=az(-(h>>>0>2147483646?-2147483648-g|0:h)|0)|0;m=az(0)|0;if(!((k|0)!=-1&m>>>0<j>>>0)){break}k=j-m|0;if((j|0)==(m|0)){break}c[i>>2]=(c[i>>2]|0)-k|0;c[1311735]=(c[1311735]|0)-k|0;i=c[1311633]|0;n=(c[1311630]|0)-k|0;k=i;o=i+8|0;if((o&7|0)==0){p=0}else{p=-o&7}o=n-p|0;c[1311633]=k+p|0;c[1311630]=o;c[k+(p+4|0)>>2]=o|1;c[k+(n+4|0)>>2]=40;c[1311634]=c[1310724]|0;d=(j|0)!=(m|0);e=d&1;return e|0}}while(0);if((c[1311630]|0)>>>0<=(c[1311634]|0)>>>0){d=0;e=d&1;return e|0}c[1311634]=-1;d=0;e=d&1;return e|0}function dg(b){b=b|0;var c=0;c=b;while(a[c]|0!=0){c=c+1|0}return c-b|0}function dh(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2]|0;b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function di(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=b+e|0;if((e|0)>=20){d=d&255;e=b&3;g=d|d<<8|d<<16|d<<24;h=f&~3;if(e){e=b+4-e|0;while((b|0)<(e|0)){a[b]=d;b=b+1|0}}while((b|0)<(h|0)){c[b>>2]=g;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}}function dj(){at()}function dk(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;return aF[a&255](b|0,c|0,d|0,e|0,f|0)|0}function dl(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;aG[a&255](b|0,c|0,d|0,e|0,f|0)}function dm(a,b){a=a|0;b=b|0;aH[a&255](b|0)}function dn(a,b,c){a=a|0;b=b|0;c=c|0;aI[a&255](b|0,c|0)}function dp(a,b){a=a|0;b=b|0;return aJ[a&255](b|0)|0}function dq(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return aK[a&255](b|0,c|0,d|0)|0}function dr(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;aL[a&255](b|0,c|0,d|0)}function ds(a){a=a|0;aM[a&255]()}function dt(a,b,c,d){a=a|0;b=b|0;c=c|0;d=+d;aN[a&255](b|0,c|0,+d)}function du(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;aO[a&255](b|0,c|0,d|0,e|0,f|0,g|0)}function dv(a,b,c){a=a|0;b=b|0;c=c|0;return aP[a&255](b|0,c|0)|0}function dw(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;aQ[a&255](b|0,c|0,d|0,e|0)}function dx(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;_(0);return 0}function dy(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;_(1)}function dz(a){a=a|0;_(2)}function dA(a,b){a=a|0;b=b|0;_(3)}function dB(a){a=a|0;_(4);return 0}function dC(a,b,c){a=a|0;b=b|0;c=c|0;_(5);return 0}function dD(a,b,c){a=a|0;b=b|0;c=c|0;_(6)}function dE(){_(7)}function dF(a,b,c){a=a|0;b=b|0;c=+c;_(8)}function dG(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;_(9)}function dH(a,b){a=a|0;b=b|0;_(10);return 0}function dI(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;_(11)}
// EMSCRIPTEN_END_FUNCS
var aF=[dx,dx,dx,dx,dx,dx,dx,dx,cj,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,cR,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,cr,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,bE,dx,dx,dx,dx,dx,dx,dx,dx,dx,bH,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,cN,dx,dx,dx,dx,dx,cJ,dx,c1,dx,dx,dx,dx,dx,cn,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx,dx];var aG=[dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,c$,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,da,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy,dy];var aH=[dz,dz,cF,dz,dz,dz,cq,dz,dz,dz,cY,dz,dz,dz,dz,dz,cQ,dz,ci,dz,cE,dz,dz,dz,cM,dz,cd,dz,dz,dz,dz,dz,c5,dz,dz,dz,dz,dz,cU,dz,dz,dz,dz,dz,dz,dz,cy,dz,dz,dz,dz,dz,dz,dz,a4,dz,bN,dz,dz,dz,dz,dz,ct,dz,c4,dz,dz,dz,c6,dz,cG,dz,b2,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,cW,dz,ce,dz,dz,dz,dz,dz,dz,dz,dz,dz,bF,dz,dz,dz,dz,dz,dz,dz,cw,dz,a3,dz,bJ,dz,dz,dz,dz,dz,cV,dz,dz,dz,dz,dz,dz,dz,bM,dz,dz,dz,cX,dz,cZ,dz,dz,dz,dz,dz,dz,dz,cm,dz,cc,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz,dz];var aI=[dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,cO,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,cs,dA,b_,dA,dA,dA,dA,dA,c2,dA,dA,dA,dA,dA,dA,dA,cK,dA,co,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,bZ,dA,dA,dA,dA,dA,dA,dA,dA,dA,ck,dA,dA,dA,dA,dA,dA,dA,cS,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA,dA];var aJ=[dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,bt,dB,dB,dB,dB,dB,dB,dB,bz,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB,dB];var aK=[dC,dC,dC,dC,bC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,bu,dC,dC,dC,dC,dC,dC,dC,dC,dC,c7,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,cf,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC,dC];var aL=[dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,b0,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,b$,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD,dD];var aM=[dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dj,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE,dE];var aN=[dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,bB,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,bI,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF,dF];var aO=[dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,c0,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,db,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG,dG];var aP=[dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,by,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,bG,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,bS,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH,dH];var aQ=[dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,cg,dI,dI,dI,dI,dI,dI,dI,cP,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,bA,dI,dI,dI,dI,dI,dI,dI,c_,dI,dI,dI,dI,dI,bD,dI,dI,dI,dI,dI,dI,dI,c3,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,c8,dI,dI,dI,cL,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,cp,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,cT,dI,dI,dI,dI,dI,cl,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI,dI];return{_strlen:dg,_free:dd,_main:a5,_memset:di,_malloc:dc,_memcpy:dh,stackAlloc:aR,stackSave:aS,stackRestore:aT,setThrew:aU,setTempRet0:aV,setTempRet1:aW,setTempRet2:aX,setTempRet3:aY,setTempRet4:aZ,setTempRet5:a_,setTempRet6:a$,setTempRet7:a0,setTempRet8:a1,setTempRet9:a2,dynCall_iiiiii:dk,dynCall_viiiii:dl,dynCall_vi:dm,dynCall_vii:dn,dynCall_ii:dp,dynCall_iiii:dq,dynCall_viii:dr,dynCall_v:ds,dynCall_viif:dt,dynCall_viiiiii:du,dynCall_iii:dv,dynCall_viiii:dw}})
// EMSCRIPTEN_END_ASM
({ Math: Math, Int8Array: Int8Array, Int16Array: Int16Array, Int32Array: Int32Array, Uint8Array: Uint8Array, Uint16Array: Uint16Array, Uint32Array: Uint32Array, Float32Array: Float32Array, Float64Array: Float64Array }, { abort: abort, assert: assert, asmPrintInt: asmPrintInt, asmPrintFloat: asmPrintFloat, copyTempDouble: copyTempDouble, copyTempFloat: copyTempFloat, min: Math_min, _llvm_lifetime_end: _llvm_lifetime_end, _cosf: _cosf, _floorf: _floorf, _abort: _abort, _fprintf: _fprintf, _printf: _printf, __reallyNegative: __reallyNegative, _sqrtf: _sqrtf, _sysconf: _sysconf, _clock: _clock, ___setErrNo: ___setErrNo, _fwrite: _fwrite, _write: _write, _exit: _exit, ___cxa_pure_virtual: ___cxa_pure_virtual, __formatString: __formatString, __ZSt9terminatev: __ZSt9terminatev, _sinf: _sinf, ___assert_func: ___assert_func, _pwrite: _pwrite, _sbrk: _sbrk, ___errno_location: ___errno_location, ___gxx_personality_v0: ___gxx_personality_v0, _llvm_lifetime_start: _llvm_lifetime_start, _time: _time, __exit: __exit, STACKTOP: STACKTOP, STACK_MAX: STACK_MAX, tempDoublePtr: tempDoublePtr, ABORT: ABORT, NaN: NaN, Infinity: Infinity, __ZTVN10__cxxabiv120__si_class_type_infoE: __ZTVN10__cxxabiv120__si_class_type_infoE, __ZTVN10__cxxabiv117__class_type_infoE: __ZTVN10__cxxabiv117__class_type_infoE }, buffer);
var _strlen = Module["_strlen"] = asm._strlen;
var _free = Module["_free"] = asm._free;
var _main = Module["_main"] = asm._main;
var _memset = Module["_memset"] = asm._memset;
var _malloc = Module["_malloc"] = asm._malloc;
var _memcpy = Module["_memcpy"] = asm._memcpy;
var dynCall_iiiiii = Module["dynCall_iiiiii"] = asm.dynCall_iiiiii;
var dynCall_viiiii = Module["dynCall_viiiii"] = asm.dynCall_viiiii;
var dynCall_vi = Module["dynCall_vi"] = asm.dynCall_vi;
var dynCall_vii = Module["dynCall_vii"] = asm.dynCall_vii;
var dynCall_ii = Module["dynCall_ii"] = asm.dynCall_ii;
var dynCall_iiii = Module["dynCall_iiii"] = asm.dynCall_iiii;
var dynCall_viii = Module["dynCall_viii"] = asm.dynCall_viii;
var dynCall_v = Module["dynCall_v"] = asm.dynCall_v;
var dynCall_viif = Module["dynCall_viif"] = asm.dynCall_viif;
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm.dynCall_viiiiii;
var dynCall_iii = Module["dynCall_iii"] = asm.dynCall_iii;
var dynCall_viiii = Module["dynCall_viiii"] = asm.dynCall_viiii;
Runtime.stackAlloc = function(size) { return asm.stackAlloc(size) };
Runtime.stackSave = function() { return asm.stackSave() };
Runtime.stackRestore = function(top) { asm.stackRestore(top) };
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
// === Auto-generated postamble setup entry stuff ===
Module.callMain = function callMain(args) {
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_STATIC) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_STATIC));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_STATIC);
  var ret;
  var initialStackTop = STACKTOP;
  try {
    ret = Module['_main'](argc, argv, 0);
  }
  catch(e) {
    if (e.name == 'ExitStatus') {
      return e.status;
    } else if (e == 'SimulateInfiniteLoop') {
      Module['noExitRuntime'] = true;
    } else {
      throw e;
    }
  } finally {
    STACKTOP = initialStackTop;
  }
  return ret;
}
function run(args) {
  args = args || Module['arguments'];
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return 0;
  }
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    var toRun = Module['preRun'];
    Module['preRun'] = [];
    for (var i = toRun.length-1; i >= 0; i--) {
      toRun[i]();
    }
    if (runDependencies > 0) {
      // a preRun added a dependency, run will be called later
      return 0;
    }
  }
  function doRun() {
    var ret = 0;
    calledRun = true;
    if (Module['_main']) {
      preMain();
      ret = Module.callMain(args);
      if (!Module['noExitRuntime']) {
        exitRuntime();
      }
    }
    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
      while (Module['postRun'].length > 0) {
        Module['postRun'].pop()();
      }
    }
    return ret;
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
    return 0;
  } else {
    return doRun();
  }
}
Module['run'] = Module.run = run;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
initRuntime();
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
if (shouldRunNow) {
  run();
}
// {{POST_RUN_ADDITIONS}}
  // {{MODULE_ADDITIONS}}
