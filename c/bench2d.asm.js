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
  Module['read'] = function(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function(filename) { return Module['read'](filename, true) };
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
  Module['read'] = read;
  Module['readBinary'] = function(f) {
    return read(f, 'binary');
  };
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
    if (typeof callback == 'function') {
      callback();
      continue;
    }
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
var runtimeInitialized = false;
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
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
var calledInit = false, calledRun = false;
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
function addPreRun(func) {
  if (!Module['preRun']) Module['preRun'] = [];
  else if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
  Module['preRun'].push(func);
}
var awaitingMemoryInitializer = false;
function loadMemoryInitializer(filename) {
  function applyData(data) {
    HEAPU8.set(data, TOTAL_STACK);
    runPostSets();
  }
  // always do this asynchronously, to keep shell and web as similar as possible
  addPreRun(function() {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
      applyData(Module['readBinary'](filename));
    } else {
      Browser.asyncLoad(filename, function(data) {
        applyData(data);
      }, function(data) {
        throw 'could not load memory initializer ' + filename;
      });
    }
  });
  awaitingMemoryInitializer = false;
}
// === Body ===
assert(STATICTOP == STACK_MAX); assert(STACK_MAX == TOTAL_STACK);
STATICTOP += 9492;
assert(STATICTOP < TOTAL_MEMORY);
__ATINIT__ = __ATINIT__.concat([
]);
var __ZTVN10__cxxabiv120__si_class_type_infoE;
var __ZTVN10__cxxabiv117__class_type_infoE;
__ZTVN10__cxxabiv120__si_class_type_infoE=allocate([0,0,0,0,224,32,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
__ZTVN10__cxxabiv117__class_type_infoE=allocate([0,0,0,0,236,32,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
/* memory initializer */ allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,132,30,80,0,192,30,80,0,0,0,0,0,0,0,0,0,48,32,60,61,32,105,66,32,38,38,32,105,66,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,66,111,100,121,46,99,112,112,0,0,105,65,32,33,61,32,40,45,49,41,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,105,115,116,97,110,99,101,46,99,112,112,0,109,95,119,111,114,108,100,45,62,73,115,76,111,99,107,101,100,40,41,32,61,61,32,102,97,108,115,101,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,109,109,111,110,47,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,46,99,112,112,0,0,97,108,112,104,97,48,32,60,32,49,46,48,102,0,0,0,99,104,105,108,100,50,32,33,61,32,40,45,49,41,0,0,98,50,73,115,86,97,108,105,100,40,98,100,45,62,108,105,110,101,97,114,68,97,109,112,105,110,103,41,32,38,38,32,98,100,45,62,108,105,110,101,97,114,68,97,109,112,105,110,103,32,62,61,32,48,46,48,102,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,109,109,111,110,47,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,46,99,112,112,0,0,116,121,112,101,65,32,61,61,32,98,50,95,100,121,110,97,109,105,99,66,111,100,121,32,124,124,32,116,121,112,101,66,32,61,61,32,98,50,95,100,121,110,97,109,105,99,66,111,100,121,0,0,99,104,105,108,100,49,32,33,61,32,40,45,49,41,0,0,98,50,73,115,86,97,108,105,100,40,98,100,45,62,97,110,103,117,108,97,114,68,97,109,112,105,110,103,41,32,38,38,32,98,100,45,62,97,110,103,117,108,97,114,68,97,109,112,105,110,103,32,62,61,32,48,46,48,102,0,112,32,61,61,32,101,110,116,114,121,45,62,100,97,116,97,0,0,0,0,97,114,101,97,32,62,32,49,46,49,57,50,48,57,50,57,48,69,45,48,55,70,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,83,104,97,112,101,115,47,98,50,80,111,108,121,103,111,110,83,104,97,112,101,46,99,112,112,0,0,48,32,60,32,99,111,117,110,116,32,38,38,32,99,111,117,110,116,32,60,32,51,0,0,112,99,45,62,112,111,105,110,116,67,111,117,110,116,32,62,32,48,0,0,109,95,110,111,100,101,115,91,112,114,111,120,121,73,100,93,46,73,115,76,101,97,102,40,41,0,0,0,115,116,97,99,107,67,111,117,110,116,32,60,32,115,116,97,99,107,83,105,122,101,0,0,99,97,99,104,101,45,62,99,111,117,110,116,32,60,61,32,51,0,0,0,98,50,73,115,86,97,108,105,100,40,98,100,45,62,97,110,103,117,108,97,114,86,101,108,111,99,105,116,121,41,0,0,109,95,101,110,116,114,121,67,111,117,110,116,32,62,32,48,0,0,0,0,98,108,111,99,107,67,111,117,110,116,32,42,32,98,108,111,99,107,83,105,122,101,32,60,61,32,98,50,95,99,104,117,110,107,83,105,122,101,0,0,109,95,118,101,114,116,101,120,67,111,117,110,116,32,62,61,32,51,0,0,48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,109,95,99,111,117,110,116,32,45,32,49,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,83,104,97,112,101,115,47,98,50,67,104,97,105,110,83,104,97,112,101,46,99,112,112,0,0,0,0,97,46,120,32,62,61,32,48,46,48,102,32,38,38,32,97,46,121,32,62,61,32,48,46,48,102,0,0,48,32,60,61,32,116,121,112,101,65,32,38,38,32,116,121,112,101,66,32,60,32,98,50,83,104,97,112,101,58,58,101,95,116,121,112,101,67,111,117,110,116,0,0,98,45,62,73,115,65,99,116,105,118,101,40,41,32,61,61,32,116,114,117,101,0,0,0,48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,109,95,99,111,117,110,116,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,67,111,108,108,105,100,101,80,111,108,121,103,111,110,46,99,112,112,0,0,0,98,50,73,115,86,97,108,105,100,40,98,100,45,62,97,110,103,108,101,41,0,0,0,0,109,95,101,110,116,114,121,67,111,117,110,116,32,60,32,98,50,95,109,97,120,83,116,97,99,107,69,110,116,114,105,101,115,0,0,0,48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,98,50,95,98,108,111,99,107,83,105,122,101,115,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,84,105,109,101,79,102,73,109,112,97,99,116,46,99,112,112,0,48,46,48,102,32,60,61,32,108,111,119,101,114,32,38,38,32,108,111,119,101,114,32,60,61,32,105,110,112,117,116,46,109,97,120,70,114,97,99,116,105,111,110,0,112,111,105,110,116,67,111,117,110,116,32,61,61,32,49,32,124,124,32,112,111,105,110,116,67,111,117,110,116,32,61,61,32,50,0,0,115,95,105,110,105,116,105,97,108,105,122,101,100,32,61,61,32,116,114,117,101,0,0,0,48,32,60,32,109,95,110,111,100,101,67,111,117,110,116,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,105,115,116,97,110,99,101,46,104,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,67,111,108,108,105,100,101,69,100,103,101,46,99,112,112,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,46,99,112,112,0,0,0,98,100,45,62,108,105,110,101,97,114,86,101,108,111,99,105,116,121,46,73,115,86,97,108,105,100,40,41,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0,0,109,95,98,111,100,121,67,111,117,110,116,32,60,32,109,95,98,111,100,121,67,97,112,97,99,105,116,121,0,0,0,0,109,95,101,110,116,114,121,67,111,117,110,116,32,61,61,32,48,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,109,95,99,111,110,116,97,99,116,67,111,117,110,116,32,60,32,109,95,99,111,110,116,97,99,116,67,97,112,97,99,105,116,121,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0,48,32,60,32,115,105,122,101,0,0,0,0,109,95,106,111,105,110,116,67,111,117,110,116,32,60,32,109,95,106,111,105,110,116,67,97,112,97,99,105,116,121,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,73,115,108,97,110,100,46,104,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,46,99,112,112,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,109,109,111,110,47,98,50,77,97,116,104,46,104,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,111,110,116,97,99,116,46,99,112,112,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,112,111,108,121,103,111,110,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,46,99,112,112,0,0,0,109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,105,114,99,108,101,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,109,97,110,105,102,111,108,100,45,62,112,111,105,110,116,67,111,117,110,116,32,62,32,48,0,0,0,0,48,32,60,61,32,116,121,112,101,50,32,38,38,32,116,121,112,101,50,32,60,32,98,50,83,104,97,112,101,58,58,101,95,116,121,112,101,67,111,117,110,116,0,0,116,111,105,73,110,100,101,120,66,32,60,32,109,95,98,111,100,121,67,111,117,110,116,0,48,32,60,61,32,110,111,100,101,73,100,32,38,38,32,110,111,100,101,73,100,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,48,32,60,61,32,112,114,111,120,121,73,100,32,38,38,32,112,114,111,120,121,73,100,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,121,110,97,109,105,99,84,114,101,101,46,104,0,0,0,0,48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,99,104,97,105,110,45,62,109,95,99,111,117,110,116,0,0,0,0,98,100,45,62,112,111,115,105,116,105,111,110,46,73,115,86,97,108,105,100,40,41,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,87,111,114,108,100,46,99,112,112,0,109,95,105,110,100,101,120,32,61,61,32,48,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,73,115,108,97,110,100,46,99,112,112,0,0,0,0,106,32,60,32,98,50,95,98,108,111,99,107,83,105,122,101,115,0,0,0,109,95,110,111,100,101,115,91,66,45,62,112,97,114,101,110,116,93,46,99,104,105,108,100,50,32,61,61,32,105,65,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,121,110,97,109,105,99,84,114,101,101,46,99,112,112,0,0,48,32,60,61,32,105,69,32,38,38,32,105,69,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,48,32,60,61,32,101,100,103,101,49,32,38,38,32,101,100,103,101,49,32,60,32,112,111,108,121,49,45,62,109,95,118,101,114,116,101,120,67,111,117,110,116,0,0,48,32,60,61,32,105,68,32,38,38,32,105,68,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,116,97,114,103,101,116,32,62,32,116,111,108,101,114,97,110,99,101,0,0,102,97,108,115,101,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,70,105,120,116,117,114,101,46,99,112,112,0,0,0,109,95,110,111,100,101,115,91,67,45,62,112,97,114,101,110,116,93,46,99,104,105,108,100,50,32,61,61,32,105,65,0,109,95,73,32,62,32,48,46,48,102,0,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,112,111,108,121,103,111,110,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,101,100,103,101,0,0,0,0,112,111,105,110,116,67,111,117,110,116,32,62,32,48,0,0,48,32,60,61,32,116,121,112,101,49,32,38,38,32,116,121,112,101,49,32,60,32,98,50,83,104,97,112,101,58,58,101,95,116,121,112,101,67,111,117,110,116,0,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,105,114,99,108,101,0,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,104,97,105,110,0,0,0,48,32,60,61,32,105,71,32,38,38,32,105,71,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,109,95,116,121,112,101,32,61,61,32,98,50,95,100,121,110,97,109,105,99,66,111,100,121,0,0,0,0,73,115,76,111,99,107,101,100,40,41,32,61,61,32,102,97,108,115,101,0,116,111,105,73,110,100,101,120,65,32,60,32,109,95,98,111,100,121,67,111,117,110,116,0,109,95,110,111,100,101,67,111,117,110,116,32,61,61,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,0,109,95,112,114,111,120,121,67,111,117,110,116,32,61,61,32,48,0,0,0,48,32,60,61,32,105,70,32,38,38,32,105,70,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,48,32,60,61,32,105,67,32,38,38,32,105,67,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,100,101,110,32,62,32,48,46,48,102,0,0,66,101,110,99,104,109,97,114,107,32,99,111,109,112,108,101,116,101,46,10,32,32,109,115,47,102,114,97,109,101,58,32,37,102,32,53,116,104,32,37,37,105,108,101,58,32,37,102,32,57,53,116,104,32,37,37,105,108,101,58,32,37,102,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,102,108,111,97,116,51,50,32,98,50,83,105,109,112,108,101,120,58,58,71,101,116,77,101,116,114,105,99,40,41,32,99,111,110,115,116,0,0,0,0,118,111,105,100,32,98,50,83,105,109,112,108,101,120,58,58,71,101,116,87,105,116,110,101,115,115,80,111,105,110,116,115,40,98,50,86,101,99,50,32,42,44,32,98,50,86,101,99,50,32,42,41,32,99,111,110,115,116,0,0,98,50,86,101,99,50,32,98,50,83,105,109,112,108,101,120,58,58,71,101,116,67,108,111,115,101,115,116,80,111,105,110,116,40,41,32,99,111,110,115,116,0,0,0,102,108,111,97,116,51,50,32,98,50,83,101,112,97,114,97,116,105,111,110,70,117,110,99,116,105,111,110,58,58,69,118,97,108,117,97,116,101,40,105,110,116,51,50,44,32,105,110,116,51,50,44,32,102,108,111,97,116,51,50,41,32,99,111,110,115,116,0,102,108,111,97,116,51,50,32,98,50,83,101,112,97,114,97,116,105,111,110,70,117,110,99,116,105,111,110,58,58,70,105,110,100,77,105,110,83,101,112,97,114,97,116,105,111,110,40,105,110,116,51,50,32,42,44,32,105,110,116,51,50,32,42,44,32,102,108,111,97,116,51,50,41,32,99,111,110,115,116,0,0,0,0,99,111,110,115,116,32,98,50,86,101,99,50,32,38,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,58,58,71,101,116,86,101,114,116,101,120,40,105,110,116,51,50,41,32,99,111,110,115,116,0,0,0,118,105,114,116,117,97,108,32,98,111,111,108,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,58,58,82,97,121,67,97,115,116,40,98,50,82,97,121,67,97,115,116,79,117,116,112,117,116,32,42,44,32,99,111,110,115,116,32,98,50,82,97,121,67,97,115,116,73,110,112,117,116,32,38,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,105,110,116,51,50,41,32,99,111,110,115,116,0,0,0,118,105,114,116,117,97,108,32,118,111,105,100,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,58,58,67,111,109,112,117,116,101,77,97,115,115,40,98,50,77,97,115,115,68,97,116,97,32,42,44,32,102,108,111,97,116,51,50,41,32,99,111,110,115,116,0,0,0,118,111,105,100,32,42,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,71,101,116,85,115,101,114,68,97,116,97,40,105,110,116,51,50,41,32,99,111,110,115,116,0,0,0,99,111,110,115,116,32,98,50,65,65,66,66,32,38,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,71,101,116,70,97,116,65,65,66,66,40,105,110,116,51,50,41,32,99,111,110,115,116,0,0,0,0,118,111,105,100,32,98,50,67,104,97,105,110,83,104,97,112,101,58,58,71,101,116,67,104,105,108,100,69,100,103,101,40,98,50,69,100,103,101,83,104,97,112,101,32,42,44,32,105,110,116,51,50,41,32,99,111,110,115,116,0,118,111,105,100,32,98,50,83,105,109,112,108,101,120,58,58,82,101,97,100,67,97,99,104,101,40,99,111,110,115,116,32,98,50,83,105,109,112,108,101,120,67,97,99,104,101,32,42,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,41,0,0,0,118,111,105,100,32,98,50,70,105,120,116,117,114,101,58,58,68,101,115,116,114,111,121,40,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,32,42,41,0,115,116,97,116,105,99,32,118,111,105,100,32,98,50,67,111,110,116,97,99,116,58,58,68,101,115,116,114,111,121,40,98,50,67,111,110,116,97,99,116,32,42,44,32,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,32,42,41,0,115,116,97,116,105,99,32,98,50,67,111,110,116,97,99,116,32,42,98,50,67,111,110,116,97,99,116,58,58,67,114,101,97,116,101,40,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,44,32,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,44,32,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,32,42,41,0,118,111,105,100,32,98,50,73,115,108,97,110,100,58,58,83,111,108,118,101,84,79,73,40,99,111,110,115,116,32,98,50,84,105,109,101,83,116,101,112,32,38,44,32,105,110,116,51,50,44,32,105,110,116,51,50,41,0,0,0,118,111,105,100,32,98,50,73,115,108,97,110,100,58,58,65,100,100,40,98,50,67,111,110,116,97,99,116,32,42,41,0,118,111,105,100,32,98,50,73,115,108,97,110,100,58,58,65,100,100,40,98,50,74,111,105,110,116,32,42,41,0,0,0,118,111,105,100,32,98,50,73,115,108,97,110,100,58,58,65,100,100,40,98,50,66,111,100,121,32,42,41,0,0,0,0,118,111,105,100,32,98,50,87,111,114,108,100,58,58,83,111,108,118,101,84,79,73,40,99,111,110,115,116,32,98,50,84,105,109,101,83,116,101,112,32,38,41,0,0,118,111,105,100,32,98,50,87,111,114,108,100,58,58,83,111,108,118,101,40,99,111,110,115,116,32,98,50,84,105,109,101,83,116,101,112,32,38,41,0,98,50,66,111,100,121,32,42,98,50,87,111,114,108,100,58,58,67,114,101,97,116,101,66,111,100,121,40,99,111,110,115,116,32,98,50,66,111,100,121,68,101,102,32,42,41,0,0,118,111,105,100,32,98,50,83,119,101,101,112,58,58,65,100,118,97,110,99,101,40,102,108,111,97,116,51,50,41,0,0,98,50,66,111,100,121,58,58,98,50,66,111,100,121,40,99,111,110,115,116,32,98,50,66,111,100,121,68,101,102,32,42,44,32,98,50,87,111,114,108,100,32,42,41,0,0,0,0,118,111,105,100,32,98,50,66,111,100,121,58,58,82,101,115,101,116,77,97,115,115,68,97,116,97,40,41,0,0,0,0,98,50,70,105,120,116,117,114,101,32,42,98,50,66,111,100,121,58,58,67,114,101,97,116,101,70,105,120,116,117,114,101,40,99,111,110,115,116,32,98,50,70,105,120,116,117,114,101,68,101,102,32,42,41,0,0,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,58,58,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0,0,118,111,105,100,32,98,50,80,111,115,105,116,105,111,110,83,111,108,118,101,114,77,97,110,105,102,111,108,100,58,58,73,110,105,116,105,97,108,105,122,101,40,98,50,67,111,110,116,97,99,116,80,111,115,105,116,105,111,110,67,111,110,115,116,114,97,105,110,116,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,105,110,116,51,50,41,0,0,0,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,58,58,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,44,32,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,41,0,0,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,58,58,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0,0,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,58,58,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,44,32,98,50,70,105,120,116,117,114,101,32,42,44,32,105,110,116,51,50,41,0,0,0,0,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,58,58,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0,0,0,0,102,108,111,97,116,51,50,32,98,50,83,101,112,97,114,97,116,105,111,110,70,117,110,99,116,105,111,110,58,58,73,110,105,116,105,97,108,105,122,101,40,99,111,110,115,116,32,98,50,83,105,109,112,108,101,120,67,97,99,104,101,32,42,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,32,42,44,32,99,111,110,115,116,32,98,50,83,119,101,101,112,32,38,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,32,42,44,32,99,111,110,115,116,32,98,50,83,119,101,101,112,32,38,44,32,102,108,111,97,116,51,50,41,0,0,0,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,58,58,126,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,40,41,0,0,0,118,111,105,100,32,42,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,58,58,65,108,108,111,99,97,116,101,40,105,110,116,51,50,41,0,118,111,105,100,32,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,58,58,70,114,101,101,40,118,111,105,100,32,42,41,0,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,58,58,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0,0,0,0,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,58,58,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,40,41,0,0,0,0,118,111,105,100,32,42,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,58,58,65,108,108,111,99,97,116,101,40,105,110,116,51,50,41,0,118,111,105,100,32,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,58,58,70,114,101,101,40,118,111,105,100,32,42,44,32,105,110,116,51,50,41,0,0,118,111,105,100,32,98,50,68,105,115,116,97,110,99,101,80,114,111,120,121,58,58,83,101,116,40,99,111,110,115,116,32,98,50,83,104,97,112,101,32,42,44,32,105,110,116,51,50,41,0,0,0,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,58,58,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,40,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,68,101,102,32,42,41,0,0,118,111,105,100,32,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,58,58,73,110,105,116,105,97,108,105,122,101,86,101,108,111,99,105,116,121,67,111,110,115,116,114,97,105,110,116,115,40,41,0,0,0,118,111,105,100,32,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,58,58,83,111,108,118,101,86,101,108,111,99,105,116,121,67,111,110,115,116,114,97,105,110,116,115,40,41,0,0,0,0,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,58,58,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,40,98,50,70,105,120,116,117,114,101,32,42,44,32,98,50,70,105,120,116,117,114,101,32,42,41,0,0,98,111,111,108,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,77,111,118,101,80,114,111,120,121,40,105,110,116,51,50,44,32,99,111,110,115,116,32,98,50,65,65,66,66,32,38,44,32,99,111,110,115,116,32,98,50,86,101,99,50,32,38,41,0,0,0,0,118,111,105,100,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,70,114,101,101,78,111,100,101,40,105,110,116,51,50,41,0,105,110,116,51,50,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,66,97,108,97,110,99,101,40,105,110,116,51,50,41,0,105,110,116,51,50,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,65,108,108,111,99,97,116,101,78,111,100,101,40,41,0,118,111,105,100,32,98,50,68,121,110,97,109,105,99,84,114,101,101,58,58,73,110,115,101,114,116,76,101,97,102,40,105,110,116,51,50,41,0,0,0,118,111,105,100,32,98,50,70,105,110,100,73,110,99,105,100,101,110,116,69,100,103,101,40,98,50,67,108,105,112,86,101,114,116,101,120,32,42,44,32,99,111,110,115,116,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,105,110,116,51,50,44,32,99,111,110,115,116,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,41,0,0,0,0,102,108,111,97,116,51,50,32,98,50,69,100,103,101,83,101,112,97,114,97,116,105,111,110,40,99,111,110,115,116,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,105,110,116,51,50,44,32,99,111,110,115,116,32,98,50,80,111,108,121,103,111,110,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,41,0,0,0,118,111,105,100,32,98,50,67,111,108,108,105,100,101,69,100,103,101,65,110,100,67,105,114,99,108,101,40,98,50,77,97,110,105,102,111,108,100,32,42,44,32,99,111,110,115,116,32,98,50,69,100,103,101,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,44,32,99,111,110,115,116,32,98,50,67,105,114,99,108,101,83,104,97,112,101,32,42,44,32,99,111,110,115,116,32,98,50,84,114,97,110,115,102,111,114,109,32,38,41,0,118,111,105,100,32,98,50,84,105,109,101,79,102,73,109,112,97,99,116,40,98,50,84,79,73,79,117,116,112,117,116,32,42,44,32,99,111,110,115,116,32,98,50,84,79,73,73,110,112,117,116,32,42,41,0,0,118,111,105,100,32,98,50,68,105,115,116,97,110,99,101,40,98,50,68,105,115,116,97,110,99,101,79,117,116,112,117,116,32,42,44,32,98,50,83,105,109,112,108,101,120,67,97,99,104,101,32,42,44,32,99,111,110,115,116,32,98,50,68,105,115,116,97,110,99,101,73,110,112,117,116,32,42,41,0,0,0,0,0,0,4,33,80,0,114,0,0,0,120,0,0,0,48,0,0,0,0,0,0,0,0,0,0,0,20,33,80,0,150,0,0,0,72,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,32,33,80,0,110,0,0,0,28,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,44,33,80,0,24,0,0,0,2,0,0,0,18,0,0,0,0,0,0,0,0,0,0,0,56,33,80,0,156,0,0,0,154,0,0,0,152,0,0,0,0,0,0,0,0,0,0,0,68,33,80,0,98,0,0,0,22,0,0,0,26,0,0,0,0,0,0,0,0,0,0,0,80,33,80,0,58,0,0,0,74,0,0,0,118,0,0,0,90,0,0,0,148,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,88,33,80,0,60,0,0,0,130,0,0,0,66,0,0,0,0,0,0,0,0,0,0,0,100,33,80,0,138,0,0,0,20,0,0,0,92,0,0,0,0,0,0,0,0,0,0,0,108,33,80,0,16,0,0,0,102,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0,120,33,80,0,56,0,0,0,124,0,0,0,84,0,0,0,50,0,0,0,4,0,0,0,86,0,0,0,52,0,0,0,108,0,0,0,0,0,0,0,0,0,0,0,132,33,80,0,122,0,0,0,112,0,0,0,54,0,0,0,42,0,0,0,68,0,0,0,76,0,0,0,38,0,0,0,44,0,0,0,0,0,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,57,98,50,67,111,110,116,97,99,116,0,0,55,98,50,83,104,97,112,101,0,0,0,0,50,53,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,50,52,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,50,51,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,0,50,51,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,50,50,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,49,55,98,50,67,111,110,116,97,99,116,76,105,115,116,101,110,101,114,0,49,54,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,49,53,98,50,67,111,110,116,97,99,116,70,105,108,116,101,114,0,0,0,49,53,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,49,52,98,50,80,111,108,121,103,111,110,83,104,97,112,101,0,0,0,0,49,49,98,50,69,100,103,101,83,104,97,112,101,0,0,0,0,0,0,0,64,31,80,0,0,0,0,0,80,31,80,0,236,32,80,0,0,0,0,0,120,31,80,0,248,32,80,0,0,0,0,0,156,31,80,0,216,32,80,0,0,0,0,0,192,31,80,0,0,0,0,0,204,31,80,0,0,0,0,0,216,31,80,0,4,33,80,0,0,0,0,0,244,31,80,0,4,33,80,0,0,0,0,0,16,32,80,0,4,33,80,0,0,0,0,0,44,32,80,0,4,33,80,0,0,0,0,0,72,32,80,0,4,33,80,0,0,0,0,0,100,32,80,0,0,0,0,0,120,32,80,0,4,33,80,0,0,0,0,0,140,32,80,0,0,0,0,0,160,32,80,0,4,33,80,0,0,0,0,0,180,32,80,0,12,33,80,0,0,0,0,0,200,32,80,0,12,33,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,32,0,0,0,64,0,0,0,96,0,0,0,128,0,0,0,160,0,0,0,192,0,0,0,224,0,0,0,0,1,0,0,64,1,0,0,128,1,0,0,192,1,0,0,0,2,0,0,128,2,0,0], "i8", ALLOC_NONE, TOTAL_STACK)
function runPostSets() {
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(8))>>2)]=(144);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(12))>>2)]=(12);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(16))>>2)]=(100);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(20))>>2)]=(142);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(24))>>2)]=(78);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(28))>>2)]=(80);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(32))>>2)]=(146);
HEAP32[(((__ZTVN10__cxxabiv120__si_class_type_infoE)+(36))>>2)]=(94);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(8))>>2)]=(10);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(12))>>2)]=(34);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(16))>>2)]=(100);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(20))>>2)]=(142);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(24))>>2)]=(78);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(28))>>2)]=(14);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(32))>>2)]=(82);
HEAP32[(((__ZTVN10__cxxabiv117__class_type_infoE)+(36))>>2)]=(46);
HEAP32[((5251288)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251296)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251308)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251320)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251332)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251340)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251348)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251360)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251372)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251384)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251396)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251408)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251416)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251428)>>2)]=(((__ZTVN10__cxxabiv117__class_type_infoE+8)|0));
HEAP32[((5251436)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251448)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
HEAP32[((5251460)>>2)]=(((__ZTVN10__cxxabiv120__si_class_type_infoE+8)|0));
}
if (!awaitingMemoryInitializer) runPostSets();
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
  Module["_memcpy"] = _memcpy;function _qsort(base, num, size, cmp) {
      if (num == 0 || size == 0) return;
      // forward calls to the JavaScript sort method
      // first, sort the items logically
      var comparator = function(x, y) {
        return Runtime.dynCall('iii', cmp, [x, y]);
      }
      var keys = [];
      for (var i = 0; i < num; i++) keys.push(i);
      keys.sort(function(a, b) {
        return comparator(base+a*size, base+b*size);
      });
      // apply the sort
      var temp = _malloc(num*size);
      _memcpy(temp, base, num*size);
      for (var i = 0; i < num; i++) {
        if (keys[i] == i) continue; // already in place
        _memcpy(base+i*size, temp+keys[i]*size, size);
      }
      _free(temp);
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
  var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
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
          }[name.substr(name.lastIndexOf('.')+1)];
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
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
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
function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  try {
    return Module.dynCall_iiiiii(index,a1,a2,a3,a4,a5);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module.dynCall_viiiii(index,a1,a2,a3,a4,a5);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_vi(index,a1) {
  try {
    Module.dynCall_vi(index,a1);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_vii(index,a1,a2) {
  try {
    Module.dynCall_vii(index,a1,a2);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_ii(index,a1) {
  try {
    return Module.dynCall_ii(index,a1);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module.dynCall_iiii(index,a1,a2,a3);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_viii(index,a1,a2,a3) {
  try {
    Module.dynCall_viii(index,a1,a2,a3);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_v(index) {
  try {
    Module.dynCall_v(index);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_viif(index,a1,a2,a3) {
  try {
    Module.dynCall_viif(index,a1,a2,a3);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module.dynCall_viiiiii(index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module.dynCall_iii(index,a1,a2);
  } catch(e) {
    asm.setThrew(1);
  }
}
function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module.dynCall_viiii(index,a1,a2,a3,a4);
  } catch(e) {
    asm.setThrew(1);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.__ZTVN10__cxxabiv120__si_class_type_infoE|0;var n=env.__ZTVN10__cxxabiv117__class_type_infoE|0;var o=+env.NaN;var p=+env.Infinity;var q=0;var r=0;var s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,z=0,A=0.0;var B=0;var C=0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=global.Math.floor;var M=global.Math.abs;var N=global.Math.sqrt;var O=global.Math.pow;var P=global.Math.cos;var Q=global.Math.sin;var R=global.Math.tan;var S=global.Math.acos;var T=global.Math.asin;var U=global.Math.atan;var V=global.Math.atan2;var W=global.Math.exp;var X=global.Math.log;var Y=global.Math.ceil;var Z=global.Math.imul;var _=env.abort;var $=env.assert;var aa=env.asmPrintInt;var ab=env.asmPrintFloat;var ac=env.copyTempDouble;var ad=env.copyTempFloat;var ae=env.min;var af=env.invoke_iiiiii;var ag=env.invoke_viiiii;var ah=env.invoke_vi;var ai=env.invoke_vii;var aj=env.invoke_ii;var ak=env.invoke_iiii;var al=env.invoke_viii;var am=env.invoke_v;var an=env.invoke_viif;var ao=env.invoke_viiiiii;var ap=env.invoke_iii;var aq=env.invoke_viiii;var ar=env._llvm_lifetime_end;var as=env._cosf;var at=env._floorf;var au=env._abort;var av=env._fprintf;var aw=env._printf;var ax=env.__reallyNegative;var ay=env._sqrtf;var az=env._sysconf;var aA=env._clock;var aB=env.___setErrNo;var aC=env._fwrite;var aD=env._qsort;var aE=env._write;var aF=env._exit;var aG=env.___cxa_pure_virtual;var aH=env.__formatString;var aI=env.__ZSt9terminatev;var aJ=env._sinf;var aK=env.___assert_func;var aL=env._pwrite;var aM=env._sbrk;var aN=env.___errno_location;var aO=env.___gxx_personality_v0;var aP=env._llvm_lifetime_start;var aQ=env._time;var aR=env.__exit;
// EMSCRIPTEN_START_FUNCS
function a2(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+3>>2<<2;return b|0}function a3(){return i|0}function a4(a){a=a|0;i=a}function a5(a){a=a|0;q=a}function a6(a){a=a|0;B=a}function a7(a){a=a|0;C=a}function a8(a){a=a|0;D=a}function a9(a){a=a|0;E=a}function ba(a){a=a|0;F=a}function bb(a){a=a|0;G=a}function bc(a){a=a|0;H=a}function bd(a){a=a|0;I=a}function be(a){a=a|0;J=a}function bf(a){a=a|0;K=a}function bg(a){a=a|0;return}function bh(a){a=a|0;return}function bi(a,b){a=a|0;b=b|0;return(c[a>>2]|0)-(c[b>>2]|0)|0}function bj(a,b){a=a|0;b=b|0;var d=0.0,e=0.0;b=i;i=i+12|0;a=b|0;bn(a);d=+g[a+4>>2];e=+g[a+8>>2];aw(5246464,(s=i,i=i+24|0,h[k>>3]=+g[a>>2],c[s>>2]=c[k>>2]|0,c[s+4>>2]=c[k+4>>2]|0,h[k>>3]=d,c[s+8>>2]=c[k>>2]|0,c[s+12>>2]=c[k+4>>2]|0,h[k>>3]=e,c[s+16>>2]=c[k>>2]|0,c[s+20>>2]=c[k+4>>2]|0,s)|0);i=b;return 0}function bk(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;c[a>>2]=-1;b=a+12|0;c[b>>2]=16;c[a+8>>2]=0;d=dr(576)|0;e=a+4|0;c[e>>2]=d;dx(d|0,0,(c[b>>2]|0)*36&-1|0);d=(c[b>>2]|0)-1|0;L5:do{if((d|0)>0){f=0;while(1){g=f+1|0;c[(c[e>>2]|0)+(f*36&-1)+20>>2]=g;c[(c[e>>2]|0)+(f*36&-1)+32>>2]=-1;h=(c[b>>2]|0)-1|0;if((g|0)<(h|0)){f=g}else{i=h;break L5}}}else{i=d}}while(0);c[(c[e>>2]|0)+(i*36&-1)+20>>2]=-1;c[(c[e>>2]|0)+(((c[b>>2]|0)-1|0)*36&-1)+32>>2]=-1;dx(a+16|0,0,16);c[a+48>>2]=16;c[a+52>>2]=0;c[a+44>>2]=dr(192)|0;c[a+36>>2]=16;c[a+40>>2]=0;c[a+32>>2]=dr(64)|0;return}function bl(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,i=0.0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=a|0;f=bA(e)|0;h=a+4|0;i=+g[b+4>>2]+-.10000000149011612;j=(c[h>>2]|0)+(f*36&-1)|0;l=(g[k>>2]=+g[b>>2]+-.10000000149011612,c[k>>2]|0);m=(g[k>>2]=i,c[k>>2]|0)|0;c[j>>2]=0|l;c[j+4>>2]=m;i=+g[b+12>>2]+.10000000149011612;m=(c[h>>2]|0)+(f*36&-1)+8|0;j=(g[k>>2]=+g[b+8>>2]+.10000000149011612,c[k>>2]|0);b=(g[k>>2]=i,c[k>>2]|0)|0;c[m>>2]=0|j;c[m+4>>2]=b;c[(c[h>>2]|0)+(f*36&-1)+16>>2]=d;c[(c[h>>2]|0)+(f*36&-1)+32>>2]=0;bB(e,f);e=a+28|0;c[e>>2]=(c[e>>2]|0)+1|0;e=a+40|0;h=c[e>>2]|0;d=a+36|0;b=a+32|0;if((h|0)!=(c[d>>2]|0)){n=h;o=c[b>>2]|0;p=o+(n<<2)|0;c[p>>2]=f;q=c[e>>2]|0;r=q+1|0;c[e>>2]=r;return f|0}a=c[b>>2]|0;c[d>>2]=h<<1;d=dr(h<<3)|0;c[b>>2]=d;h=a;dw(d|0,h|0,c[e>>2]<<2|0);ds(h);n=c[e>>2]|0;o=c[b>>2]|0;p=o+(n<<2)|0;c[p>>2]=f;q=c[e>>2]|0;r=q+1|0;c[e>>2]=r;return f|0}function bm(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0,r=0,s=0.0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0.0;h=a+60|0;c[h>>2]=0;i=e+12|0;j=+g[f+12>>2];l=+g[i>>2];m=+g[f+8>>2];n=+g[e+16>>2];o=+g[f>>2]+(j*l-m*n)- +g[d>>2];p=l*m+j*n+ +g[f+4>>2]- +g[d+4>>2];n=+g[d+12>>2];j=+g[d+8>>2];m=o*n+p*j;l=n*p+o*(-0.0-j);j=+g[b+8>>2]+ +g[e+8>>2];e=c[b+148>>2]|0;do{if((e|0)>0){d=0;o=-3.4028234663852886e+38;f=0;while(1){p=(m- +g[b+20+(d<<3)>>2])*+g[b+84+(d<<3)>>2]+(l- +g[b+20+(d<<3)+4>>2])*+g[b+84+(d<<3)+4>>2];if(p>j){q=32;break}r=p>o;s=r?p:o;t=r?d:f;r=d+1|0;if((r|0)<(e|0)){d=r;o=s;f=t}else{q=16;break}}if((q|0)==16){u=s<1.1920928955078125e-7;v=t;break}else if((q|0)==32){return}}else{u=1;v=0}}while(0);q=v+1|0;t=b+20+(v<<3)|0;f=c[t>>2]|0;d=c[t+4>>2]|0;s=(c[k>>2]=f,+g[k>>2]);t=d;o=(c[k>>2]=t,+g[k>>2]);r=b+20+(((q|0)<(e|0)?q:0)<<3)|0;q=c[r>>2]|0;e=c[r+4>>2]|0;p=(c[k>>2]=q,+g[k>>2]);r=e;n=(c[k>>2]=r,+g[k>>2]);if(u){c[h>>2]=1;c[a+56>>2]=1;u=b+84+(v<<3)|0;w=a+40|0;x=c[u+4>>2]|0;c[w>>2]=c[u>>2]|0;c[w+4>>2]=x;x=a+48|0;w=(g[k>>2]=(s+p)*.5,c[k>>2]|0);u=(g[k>>2]=(o+n)*.5,c[k>>2]|0)|0;c[x>>2]=0|w;c[x+4>>2]=u;u=i;x=a;w=c[u+4>>2]|0;c[x>>2]=c[u>>2]|0;c[x+4>>2]=w;c[a+16>>2]=0;return}y=m-s;z=l-o;A=m-p;B=l-n;if(y*(p-s)+z*(n-o)<=0.0){if(y*y+z*z>j*j){return}c[h>>2]=1;c[a+56>>2]=1;w=a+40|0;x=w;u=(g[k>>2]=y,c[k>>2]|0);C=(g[k>>2]=z,c[k>>2]|0)|0;c[x>>2]=0|u;c[x+4>>2]=C;D=+N(+(y*y+z*z));if(D>=1.1920928955078125e-7){E=1.0/D;g[w>>2]=y*E;g[a+44>>2]=z*E}w=a+48|0;c[w>>2]=0|f&-1;c[w+4>>2]=t|d&0;d=i;t=a;w=c[d+4>>2]|0;c[t>>2]=c[d>>2]|0;c[t+4>>2]=w;c[a+16>>2]=0;return}if(A*(s-p)+B*(o-n)>0.0){E=(s+p)*.5;p=(o+n)*.5;w=b+84+(v<<3)|0;if((m-E)*+g[w>>2]+(l-p)*+g[b+84+(v<<3)+4>>2]>j){return}c[h>>2]=1;c[a+56>>2]=1;v=w;w=a+40|0;b=c[v+4>>2]|0;c[w>>2]=c[v>>2]|0;c[w+4>>2]=b;b=a+48|0;w=(g[k>>2]=E,c[k>>2]|0);v=(g[k>>2]=p,c[k>>2]|0)|0;c[b>>2]=0|w;c[b+4>>2]=v;v=i;b=a;w=c[v+4>>2]|0;c[b>>2]=c[v>>2]|0;c[b+4>>2]=w;c[a+16>>2]=0;return}if(A*A+B*B>j*j){return}c[h>>2]=1;c[a+56>>2]=1;h=a+40|0;w=h;b=(g[k>>2]=A,c[k>>2]|0);v=(g[k>>2]=B,c[k>>2]|0)|0;c[w>>2]=0|b;c[w+4>>2]=v;j=+N(+(A*A+B*B));if(j>=1.1920928955078125e-7){p=1.0/j;g[h>>2]=A*p;g[a+44>>2]=B*p}h=a+48|0;c[h>>2]=0|q&-1;c[h+4>>2]=r|e&0;e=i;i=a;r=c[e+4>>2]|0;c[i>>2]=c[e>>2]|0;c[i+4>>2]=r;c[a+16>>2]=0;return}function bn(d){d=d|0;var e=0,f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0.0,L=0.0,M=0,N=0.0,O=0.0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0.0,X=0,Y=0.0;e=i;i=i+104420|0;f=e|0;h=e+28|0;j=e+56|0;l=e+64|0;m=e+103092|0;n=e+103144|0;o=e+103192|0;p=e+103344|0;q=e+103396|0;g[j>>2]=0.0;g[j+4>>2]=-10.0;cm(l,j);j=l+102976|0;L52:do{if((a[j]&1)<<24>>24!=0){a[j]=0;r=c[l+102952>>2]|0;if((r|0)==0){break}else{s=r}while(1){r=s+4|0;t=b[r>>1]|0;if((t&2)<<16>>16==0){b[r>>1]=t|2;g[s+144>>2]=0.0}t=c[s+96>>2]|0;if((t|0)==0){break L52}else{s=t}}}}while(0);c[m+44>>2]=0;dx(m+4|0,0,32);a[m+36|0]=1;a[m+37|0]=1;a[m+38|0]=0;a[m+39|0]=0;c[m>>2]=0;a[m+40|0]=1;g[m+48>>2]=1.0;s=l+102868|0;if((c[s>>2]&2|0)!=0){aK(5245572,109,5248296,5246292)}j=l|0;t=bY(j,152)|0;if((t|0)==0){u=0}else{r=t;b1(r,m,l);u=r}c[u+92>>2]=0;r=l+102952|0;c[u+96>>2]=c[r>>2]|0;m=c[r>>2]|0;if((m|0)!=0){c[m+92>>2]=u}c[r>>2]=u;m=l+102960|0;c[m>>2]=(c[m>>2]|0)+1|0;c[n>>2]=5250844;c[n+4>>2]=1;g[n+8>>2]=.009999999776482582;dx(n+28|0,0,18);t=n+12|0;c[t>>2]=-1038090240;c[t+4>>2]=0;t=n+20|0;c[t>>2]=1109393408;c[t+4>>2]=0;a[n+44|0]=0;a[n+45|0]=0;b[h+22>>1]=1;b[h+24>>1]=-1;b[h+26>>1]=0;c[h+4>>2]=0;g[h+8>>2]=.20000000298023224;g[h+12>>2]=0.0;a[h+20|0]=0;c[h>>2]=n|0;g[h+16>>2]=0.0;b3(u,h);c[o>>2]=5250800;c[o+4>>2]=2;g[o+8>>2]=.009999999776482582;c[o+148>>2]=4;g[o+20>>2]=-.5;g[o+24>>2]=-.5;g[o+28>>2]=.5;g[o+32>>2]=-.5;g[o+36>>2]=.5;g[o+40>>2]=.5;g[o+44>>2]=-.5;g[o+48>>2]=.5;g[o+84>>2]=0.0;g[o+88>>2]=-1.0;g[o+92>>2]=1.0;g[o+96>>2]=0.0;g[o+100>>2]=0.0;g[o+104>>2]=1.0;g[o+108>>2]=-1.0;g[o+112>>2]=0.0;g[o+12>>2]=0.0;g[o+16>>2]=0.0;h=p+44|0;u=p+36|0;n=p+4|0;t=p+37|0;v=p+38|0;w=p+39|0;x=p|0;y=p+40|0;z=p+48|0;A=p+4|0;B=o|0;o=f+22|0;C=f+24|0;D=f+26|0;E=f|0;F=f+4|0;G=f+8|0;H=f+12|0;I=f+16|0;J=f+20|0;K=.75;L=-7.0;M=0;L72:while(1){N=K;O=L;P=M;while(1){c[h>>2]=0;dx(n|0,0,32);a[u]=1;a[t]=1;a[v]=0;a[w]=0;a[y]=1;g[z>>2]=1.0;c[x>>2]=2;Q=(g[k>>2]=O,c[k>>2]|0);R=(g[k>>2]=N,c[k>>2]|0)|0;c[A>>2]=0|Q;c[A+4>>2]=R;if((c[s>>2]&2|0)!=0){S=57;break L72}R=bY(j,152)|0;if((R|0)==0){T=0}else{Q=R;b1(Q,p,l);T=Q}c[T+92>>2]=0;c[T+96>>2]=c[r>>2]|0;Q=c[r>>2]|0;if((Q|0)!=0){c[Q+92>>2]=T}c[r>>2]=T;c[m>>2]=(c[m>>2]|0)+1|0;b[o>>1]=1;b[C>>1]=-1;b[D>>1]=0;c[F>>2]=0;g[G>>2]=.20000000298023224;g[H>>2]=0.0;a[J]=0;c[E>>2]=B;g[I>>2]=5.0;b3(T,f);Q=P+1|0;if((Q|0)<40){N=N+0.0;O=O+1.125;P=Q}else{break}}P=M+1|0;if((P|0)<40){K=K+1.0;L=L+.5625;M=P}else{U=0;break}}if((S|0)==57){aK(5245572,109,5248296,5246292)}while(1){cv(l,.01666666753590107,3,3);S=U+1|0;if((S|0)<64){U=S}else{V=0;break}}while(1){U=aA()|0;cv(l,.01666666753590107,3,3);c[q+(V<<2)>>2]=(aA()|0)-U|0;U=V+1|0;if((U|0)<256){V=U}else{W=0.0;X=0;break}}while(1){Y=W+ +((c[q+(X<<2)>>2]|0)>>>0>>>0)/1.0e3*1.0e3;V=X+1|0;if((V|0)==256){break}else{W=Y;X=V}}g[d>>2]=Y*.00390625;aD(q|0,256,4,70);g[d+4>>2]=+((c[q+48>>2]|0)>>>0>>>0)/1.0e3*1.0e3;g[d+8>>2]=+((c[q+972>>2]|0)>>>0>>>0)/1.0e3*1.0e3;cn(l);i=e;return}function bo(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var i=0,j=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0;i=b+60|0;c[i>>2]=0;j=f+12|0;l=+g[h+12>>2];m=+g[j>>2];n=+g[h+8>>2];o=+g[f+16>>2];p=+g[h>>2]+(l*m-n*o)- +g[e>>2];q=m*n+l*o+ +g[h+4>>2]- +g[e+4>>2];o=+g[e+12>>2];l=+g[e+8>>2];n=p*o+q*l;m=o*q+p*(-0.0-l);e=d+12|0;h=c[e>>2]|0;r=c[e+4>>2]|0;l=(c[k>>2]=h,+g[k>>2]);e=r;p=(c[k>>2]=e,+g[k>>2]);s=d+20|0;t=c[s>>2]|0;u=c[s+4>>2]|0;q=(c[k>>2]=t,+g[k>>2]);s=u;o=(c[k>>2]=s,+g[k>>2]);v=q-l;w=o-p;x=v*(q-n)+w*(o-m);y=n-l;z=m-p;A=y*v+z*w;B=+g[d+8>>2]+ +g[f+8>>2];if(A<=0.0){if(y*y+z*z>B*B){return}do{if((a[d+44|0]&1)<<24>>24!=0){f=d+28|0;C=c[f+4>>2]|0;D=(c[k>>2]=c[f>>2]|0,+g[k>>2]);if((l-n)*(l-D)+(p-m)*(p-(c[k>>2]=C,+g[k>>2]))<=0.0){break}return}}while(0);c[i>>2]=1;c[b+56>>2]=0;g[b+40>>2]=0.0;g[b+44>>2]=0.0;C=b+48|0;c[C>>2]=0|h&-1;c[C+4>>2]=e|r&0;C=b+16|0;c[C>>2]=0;f=C;a[C]=0;a[f+1|0]=0;a[f+2|0]=0;a[f+3|0]=0;f=j;C=b;E=c[f+4>>2]|0;c[C>>2]=c[f>>2]|0;c[C+4>>2]=E;return}if(x<=0.0){D=n-q;F=m-o;if(D*D+F*F>B*B){return}do{if((a[d+45|0]&1)<<24>>24!=0){E=d+36|0;C=c[E+4>>2]|0;G=(c[k>>2]=c[E>>2]|0,+g[k>>2]);if(D*(G-q)+F*((c[k>>2]=C,+g[k>>2])-o)<=0.0){break}return}}while(0);c[i>>2]=1;c[b+56>>2]=0;g[b+40>>2]=0.0;g[b+44>>2]=0.0;d=b+48|0;c[d>>2]=0|t&-1;c[d+4>>2]=s|u&0;u=b+16|0;c[u>>2]=0;s=u;a[u]=1;a[s+1|0]=0;a[s+2|0]=0;a[s+3|0]=0;s=j;u=b;d=c[s+4>>2]|0;c[u>>2]=c[s>>2]|0;c[u+4>>2]=d;return}F=v*v+w*w;if(F<=0.0){aK(5244336,127,5250276,5246452)}D=1.0/F;F=n-(l*x+q*A)*D;q=m-(p*x+o*A)*D;if(F*F+q*q>B*B){return}B=-0.0-w;if(v*z+y*B<0.0){H=w;I=-0.0-v}else{H=B;I=v}v=+N(+(I*I+H*H));if(v<1.1920928955078125e-7){J=H;K=I}else{B=1.0/v;J=H*B;K=I*B}c[i>>2]=1;c[b+56>>2]=1;i=b+40|0;d=(g[k>>2]=J,c[k>>2]|0);u=(g[k>>2]=K,c[k>>2]|0)|0;c[i>>2]=0|d;c[i+4>>2]=u;u=b+48|0;c[u>>2]=0|h&-1;c[u+4>>2]=e|r&0;r=b+16|0;c[r>>2]=0;e=r;a[r]=0;a[e+1|0]=0;a[e+2|0]=1;a[e+3|0]=0;e=j;j=b;b=c[e+4>>2]|0;c[j>>2]=c[e>>2]|0;c[j+4>>2]=b;return}function bp(b,d,e,f,h,j){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0,y=0,z=0.0,A=0.0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0,_=0.0,$=0.0,aa=0,ab=0.0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0.0,ar=0,as=0,at=0,au=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0.0,aB=0.0,aC=0.0,aD=0.0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aM=0,aN=0,aO=0.0,aP=0,aQ=0,aR=0.0;l=i;i=i+84|0;m=l|0;n=l+12|0;o=l+36|0;p=l+60|0;q=b+132|0;r=+g[f+12>>2];s=+g[j+8>>2];t=+g[f+8>>2];u=+g[j+12>>2];v=r*s-t*u;w=s*t+r*u;x=(g[k>>2]=v,c[k>>2]|0);y=(g[k>>2]=w,c[k>>2]|0)|0;u=+g[j>>2]- +g[f>>2];s=+g[j+4>>2]- +g[f+4>>2];z=r*u+t*s;A=u*(-0.0-t)+r*s;f=(g[k>>2]=z,c[k>>2]|0);j=(g[k>>2]=A,c[k>>2]|0)|0;B=q;c[B>>2]=0|f;c[B+4>>2]=j;j=b+140|0;c[j>>2]=0|x;c[j+4>>2]=y;y=b+144|0;s=+g[h+12>>2];j=b+140|0;r=+g[h+16>>2];x=q|0;t=z+(w*s-v*r);q=b+136|0;z=s*v+w*r+A;B=b+148|0;f=(g[k>>2]=t,c[k>>2]|0);C=(g[k>>2]=z,c[k>>2]|0)|0;c[B>>2]=0|f;c[B+4>>2]=C;C=e+28|0;B=b+156|0;f=c[C>>2]|0;D=c[C+4>>2]|0;c[B>>2]=f;c[B+4>>2]=D;B=e+12|0;C=b+164|0;E=c[B>>2]|0;F=c[B+4>>2]|0;c[C>>2]=E;c[C+4>>2]=F;B=e+20|0;G=b+172|0;H=c[B>>2]|0;I=c[B+4>>2]|0;c[G>>2]=H;c[G+4>>2]=I;B=e+36|0;J=b+180|0;K=c[B>>2]|0;L=c[B+4>>2]|0;c[J>>2]=K;c[J+4>>2]=L;J=a[e+44|0]&1;B=J<<24>>24!=0;M=a[e+45|0]|0;e=(M&1)<<24>>24!=0;A=(c[k>>2]=H,+g[k>>2]);r=(c[k>>2]=E,+g[k>>2]);w=A-r;v=(c[k>>2]=I,+g[k>>2]);I=b+168|0;s=(c[k>>2]=F,+g[k>>2]);u=v-s;O=+N(+(w*w+u*u));P=(c[k>>2]=f,+g[k>>2]);Q=(c[k>>2]=D,+g[k>>2]);R=(c[k>>2]=K,+g[k>>2]);S=(c[k>>2]=L,+g[k>>2]);if(O<1.1920928955078125e-7){T=w;U=u}else{V=1.0/O;T=w*V;U=u*V}L=b+196|0;V=-0.0-T;K=L|0;g[K>>2]=U;D=b+200|0;g[D>>2]=V;u=(t-r)*U+(z-s)*V;if(B){V=r-P;r=s-Q;s=+N(+(V*V+r*r));if(s<1.1920928955078125e-7){W=V;X=r}else{w=1.0/s;W=V*w;X=r*w}w=-0.0-W;g[b+188>>2]=X;g[b+192>>2]=w;Y=(t-P)*X+(z-Q)*w;Z=U*W-T*X>=0.0}else{Y=0.0;Z=0}L147:do{if(e){X=R-A;W=S-v;w=+N(+(X*X+W*W));if(w<1.1920928955078125e-7){_=X;$=W}else{Q=1.0/w;_=X*Q;$=W*Q}Q=-0.0-_;f=b+204|0;g[f>>2]=$;F=b+208|0;g[F>>2]=Q;E=T*$-U*_>0.0;W=(t-A)*$+(z-v)*Q;if((J&M)<<24>>24==0){aa=E;ab=W;ac=151;break}if(Z&E){do{if(Y<0.0&u<0.0){H=W>=0.0;a[b+248|0]=H&1;ad=b+212|0;if(H){ae=ad;break}H=ad;ad=(g[k>>2]=-0.0-U,c[k>>2]|0);af=0|ad;ad=(g[k>>2]=T,c[k>>2]|0)|0;c[H>>2]=af;c[H+4>>2]=ad;H=b+228|0;c[H>>2]=af;c[H+4>>2]=ad;H=b+236|0;c[H>>2]=af;c[H+4>>2]=ad;break L147}else{a[b+248|0]=1;ae=b+212|0}}while(0);ad=L;H=ae;af=c[ad+4>>2]|0;c[H>>2]=c[ad>>2]|0;c[H+4>>2]=af;af=b+188|0;H=b+228|0;ad=c[af+4>>2]|0;c[H>>2]=c[af>>2]|0;c[H+4>>2]=ad;ad=b+204|0;H=b+236|0;af=c[ad+4>>2]|0;c[H>>2]=c[ad>>2]|0;c[H+4>>2]=af;break}if(Z){do{if(Y<0.0){if(u<0.0){a[b+248|0]=0;ag=b+212|0}else{af=W>=0.0;a[b+248|0]=af&1;H=b+212|0;if(af){ah=H;break}else{ag=H}}H=ag;af=(g[k>>2]=-0.0-U,c[k>>2]|0);ad=(g[k>>2]=T,c[k>>2]|0)|0;c[H>>2]=0|af;c[H+4>>2]=ad;Q=-0.0- +g[F>>2];ad=b+228|0;H=(g[k>>2]=-0.0- +g[f>>2],c[k>>2]|0);af=(g[k>>2]=Q,c[k>>2]|0)|0;c[ad>>2]=0|H;c[ad+4>>2]=af;Q=-0.0- +g[D>>2];af=b+236|0;ad=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);H=(g[k>>2]=Q,c[k>>2]|0)|0;c[af>>2]=0|ad;c[af+4>>2]=H;break L147}else{a[b+248|0]=1;ah=b+212|0}}while(0);H=L;af=ah;ad=c[H+4>>2]|0;c[af>>2]=c[H>>2]|0;c[af+4>>2]=ad;ad=b+188|0;af=b+228|0;ai=c[ad+4>>2]|0;c[af>>2]=c[ad>>2]|0;c[af+4>>2]=ai;ai=b+236|0;af=c[H+4>>2]|0;c[ai>>2]=c[H>>2]|0;c[ai+4>>2]=af;break}if(!E){do{if(Y<0.0|u<0.0){a[b+248|0]=0;aj=b+212|0}else{af=W>=0.0;a[b+248|0]=af&1;ai=b+212|0;if(!af){aj=ai;break}af=L;H=ai;ai=c[af>>2]|0;ad=c[af+4>>2]|0;c[H>>2]=ai;c[H+4>>2]=ad;H=b+228|0;c[H>>2]=ai;c[H+4>>2]=ad;H=b+236|0;c[H>>2]=ai;c[H+4>>2]=ad;break L147}}while(0);E=aj;ad=(g[k>>2]=-0.0-U,c[k>>2]|0);H=(g[k>>2]=T,c[k>>2]|0)|0;c[E>>2]=0|ad;c[E+4>>2]=H;Q=-0.0- +g[F>>2];H=b+228|0;E=(g[k>>2]=-0.0- +g[f>>2],c[k>>2]|0);ad=(g[k>>2]=Q,c[k>>2]|0)|0;c[H>>2]=0|E;c[H+4>>2]=ad;Q=-0.0- +g[b+192>>2];ad=b+236|0;H=(g[k>>2]=-0.0- +g[b+188>>2],c[k>>2]|0);E=(g[k>>2]=Q,c[k>>2]|0)|0;c[ad>>2]=0|H;c[ad+4>>2]=E;break}do{if(W<0.0){if(Y<0.0){a[b+248|0]=0;ak=b+212|0}else{E=u>=0.0;a[b+248|0]=E&1;ad=b+212|0;if(E){al=ad;break}else{ak=ad}}ad=ak;E=(g[k>>2]=-0.0-U,c[k>>2]|0);H=(g[k>>2]=T,c[k>>2]|0)|0;c[ad>>2]=0|E;c[ad+4>>2]=H;Q=-0.0- +g[D>>2];H=b+228|0;ad=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);E=(g[k>>2]=Q,c[k>>2]|0)|0;c[H>>2]=0|ad;c[H+4>>2]=E;Q=-0.0- +g[b+192>>2];E=b+236|0;H=(g[k>>2]=-0.0- +g[b+188>>2],c[k>>2]|0);ad=(g[k>>2]=Q,c[k>>2]|0)|0;c[E>>2]=0|H;c[E+4>>2]=ad;break L147}else{a[b+248|0]=1;al=b+212|0}}while(0);f=L;F=al;ad=c[f+4>>2]|0;c[F>>2]=c[f>>2]|0;c[F+4>>2]=ad;ad=b+228|0;F=c[f+4>>2]|0;c[ad>>2]=c[f>>2]|0;c[ad+4>>2]=F;F=b+204|0;ad=b+236|0;f=c[F+4>>2]|0;c[ad>>2]=c[F>>2]|0;c[ad+4>>2]=f;break}else{aa=0;ab=0.0;ac=151}}while(0);L188:do{if((ac|0)==151){if(B){al=Y>=0.0;if(Z){do{if(al){a[b+248|0]=1;am=b+212|0}else{ak=u>=0.0;a[b+248|0]=ak&1;aj=b+212|0;if(ak){am=aj;break}ak=aj;aj=(g[k>>2]=-0.0-U,c[k>>2]|0);ah=0;ag=(g[k>>2]=T,c[k>>2]|0);c[ak>>2]=ah|aj;c[ak+4>>2]=ag|0;ak=L;aj=b+228|0;ae=c[ak>>2]|0;M=c[ak+4>>2]|0;c[aj>>2]=ae;c[aj+4>>2]=M;M=b+236|0;c[M>>2]=ah|(g[k>>2]=-0.0-(c[k>>2]=ae,+g[k>>2]),c[k>>2]|0);c[M+4>>2]=ag|0;break L188}}while(0);ag=L;M=am;ae=c[ag+4>>2]|0;c[M>>2]=c[ag>>2]|0;c[M+4>>2]=ae;ae=b+188|0;M=b+228|0;ag=c[ae+4>>2]|0;c[M>>2]=c[ae>>2]|0;c[M+4>>2]=ag;v=-0.0- +g[D>>2];ag=b+236|0;M=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);ae=(g[k>>2]=v,c[k>>2]|0)|0;c[ag>>2]=0|M;c[ag+4>>2]=ae;break}else{do{if(al){ae=u>=0.0;a[b+248|0]=ae&1;ag=b+212|0;if(!ae){an=ag;break}ae=L;M=ag;ag=c[ae>>2]|0;ah=c[ae+4>>2]|0;c[M>>2]=ag;c[M+4>>2]=ah;M=b+228|0;c[M>>2]=ag;c[M+4>>2]=ah;ah=b+236|0;M=(g[k>>2]=-0.0-(c[k>>2]=ag,+g[k>>2]),c[k>>2]|0);ag=(g[k>>2]=T,c[k>>2]|0)|0;c[ah>>2]=0|M;c[ah+4>>2]=ag;break L188}else{a[b+248|0]=0;an=b+212|0}}while(0);al=an;ag=(g[k>>2]=-0.0-U,c[k>>2]|0);ah=(g[k>>2]=T,c[k>>2]|0)|0;c[al>>2]=0|ag;c[al+4>>2]=ah;ah=L;al=b+228|0;ag=c[ah+4>>2]|0;c[al>>2]=c[ah>>2]|0;c[al+4>>2]=ag;v=-0.0- +g[b+192>>2];ag=b+236|0;al=(g[k>>2]=-0.0- +g[b+188>>2],c[k>>2]|0);ah=(g[k>>2]=v,c[k>>2]|0)|0;c[ag>>2]=0|al;c[ag+4>>2]=ah;break}}ah=u>=0.0;if(!e){a[b+248|0]=ah&1;ag=b+212|0;if(ah){al=L;M=ag;ae=c[al>>2]|0;aj=c[al+4>>2]|0;c[M>>2]=ae;c[M+4>>2]=aj;aj=b+228|0;M=(g[k>>2]=-0.0-(c[k>>2]=ae,+g[k>>2]),c[k>>2]|0);ae=0|M;M=(g[k>>2]=T,c[k>>2]|0)|0;c[aj>>2]=ae;c[aj+4>>2]=M;aj=b+236|0;c[aj>>2]=ae;c[aj+4>>2]=M;break}else{M=ag;ag=(g[k>>2]=-0.0-U,c[k>>2]|0);aj=(g[k>>2]=T,c[k>>2]|0)|0;c[M>>2]=0|ag;c[M+4>>2]=aj;aj=L;M=b+228|0;ag=c[aj>>2]|0;ae=c[aj+4>>2]|0;c[M>>2]=ag;c[M+4>>2]=ae;M=b+236|0;c[M>>2]=ag;c[M+4>>2]=ae;break}}if(aa){do{if(ah){a[b+248|0]=1;ao=b+212|0}else{ae=ab>=0.0;a[b+248|0]=ae&1;M=b+212|0;if(ae){ao=M;break}ae=M;M=(g[k>>2]=-0.0-U,c[k>>2]|0);ag=0|M;M=(g[k>>2]=T,c[k>>2]|0)|0;c[ae>>2]=ag;c[ae+4>>2]=M;ae=b+228|0;c[ae>>2]=ag;c[ae+4>>2]=M;M=L;ae=b+236|0;ag=c[M+4>>2]|0;c[ae>>2]=c[M>>2]|0;c[ae+4>>2]=ag;break L188}}while(0);ag=L;ae=ao;M=c[ag+4>>2]|0;c[ae>>2]=c[ag>>2]|0;c[ae+4>>2]=M;v=-0.0- +g[D>>2];M=b+228|0;ae=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);ag=(g[k>>2]=v,c[k>>2]|0)|0;c[M>>2]=0|ae;c[M+4>>2]=ag;ag=b+204|0;M=b+236|0;ae=c[ag+4>>2]|0;c[M>>2]=c[ag>>2]|0;c[M+4>>2]=ae;break}else{do{if(ah){ae=ab>=0.0;a[b+248|0]=ae&1;M=b+212|0;if(!ae){ap=M;break}ae=L;ag=M;M=c[ae>>2]|0;aj=c[ae+4>>2]|0;c[ag>>2]=M;c[ag+4>>2]=aj;ag=b+228|0;ae=(g[k>>2]=-0.0-(c[k>>2]=M,+g[k>>2]),c[k>>2]|0);al=(g[k>>2]=T,c[k>>2]|0)|0;c[ag>>2]=0|ae;c[ag+4>>2]=al;al=b+236|0;c[al>>2]=M;c[al+4>>2]=aj;break L188}else{a[b+248|0]=0;ap=b+212|0}}while(0);ah=ap;aj=(g[k>>2]=-0.0-U,c[k>>2]|0);al=(g[k>>2]=T,c[k>>2]|0)|0;c[ah>>2]=0|aj;c[ah+4>>2]=al;v=-0.0- +g[b+208>>2];al=b+228|0;ah=(g[k>>2]=-0.0- +g[b+204>>2],c[k>>2]|0);aj=(g[k>>2]=v,c[k>>2]|0)|0;c[al>>2]=0|ah;c[al+4>>2]=aj;aj=L;al=b+236|0;ah=c[aj+4>>2]|0;c[al>>2]=c[aj>>2]|0;c[al+4>>2]=ah;break}}}while(0);ap=h+148|0;ao=b+128|0;c[ao>>2]=c[ap>>2]|0;L226:do{if((c[ap>>2]|0)>0){aa=0;while(1){T=+g[y>>2];U=+g[h+20+(aa<<3)>>2];ab=+g[j>>2];u=+g[h+20+(aa<<3)+4>>2];Y=U*ab+T*u+ +g[q>>2];e=b+(aa<<3)|0;an=(g[k>>2]=+g[x>>2]+(T*U-ab*u),c[k>>2]|0);am=(g[k>>2]=Y,c[k>>2]|0)|0;c[e>>2]=0|an;c[e+4>>2]=am;Y=+g[y>>2];u=+g[h+84+(aa<<3)>>2];ab=+g[j>>2];U=+g[h+84+(aa<<3)+4>>2];am=b+64+(aa<<3)|0;e=(g[k>>2]=Y*u-ab*U,c[k>>2]|0);an=(g[k>>2]=u*ab+Y*U,c[k>>2]|0)|0;c[am>>2]=0|e;c[am+4>>2]=an;an=aa+1|0;if((an|0)<(c[ap>>2]|0)){aa=an}else{break L226}}}}while(0);ap=b+244|0;g[ap>>2]=.019999999552965164;aa=d+60|0;c[aa>>2]=0;an=b+248|0;am=c[ao>>2]|0;L230:do{if((am|0)>0){U=+g[b+164>>2];Y=+g[I>>2];ab=+g[b+212>>2];u=+g[b+216>>2];e=0;T=3.4028234663852886e+38;while(1){v=ab*(+g[b+(e<<3)>>2]-U)+u*(+g[b+(e<<3)+4>>2]-Y);z=v<T?v:T;Z=e+1|0;if((Z|0)==(am|0)){aq=z;break L230}else{e=Z;T=z}}}else{aq=3.4028234663852886e+38}}while(0);if(aq>+g[ap>>2]){i=l;return}bq(m,b);am=c[m>>2]|0;do{if((am|0)==0){ac=187}else{T=+g[m+8>>2];if(T>+g[ap>>2]){i=l;return}if(T<=aq*.9800000190734863+.0010000000474974513){ac=187;break}I=c[m+4>>2]|0;e=d+56|0;if((am|0)==1){ar=e;ac=189;break}c[e>>2]=2;e=n;Z=c[C>>2]|0;B=c[C+4>>2]|0;c[e>>2]=Z;c[e+4>>2]=B;e=n+8|0;ah=e;a[e]=0;e=I&255;a[ah+1|0]=e;a[ah+2|0]=0;a[ah+3|0]=1;ah=n+12|0;al=c[G>>2]|0;aj=c[G+4>>2]|0;c[ah>>2]=al;c[ah+4>>2]=aj;ah=n+20|0;M=ah;a[ah]=0;a[M+1|0]=e;a[M+2|0]=0;a[M+3|0]=1;M=I+1|0;ah=(M|0)<(c[ao>>2]|0)?M:0;M=b+(I<<3)|0;ag=c[M>>2]|0;ae=c[M+4>>2]|0;M=b+(ah<<3)|0;ak=c[M>>2]|0;J=c[M+4>>2]|0;M=b+64+(I<<3)|0;f=c[M>>2]|0;ad=c[M+4>>2]|0;T=(c[k>>2]=Z,+g[k>>2]);Y=(c[k>>2]=B,+g[k>>2]);u=(c[k>>2]=al,+g[k>>2]);as=I;at=ah&255;au=f;av=ad;aw=ak;ax=J;ay=ag;az=ae;aA=u;aB=T;aC=(c[k>>2]=aj,+g[k>>2]);aD=Y;aE=e;aF=0;break}}while(0);do{if((ac|0)==187){ar=d+56|0;ac=189;break}}while(0);do{if((ac|0)==189){c[ar>>2]=1;am=c[ao>>2]|0;L249:do{if((am|0)>1){aq=+g[b+216>>2];Y=+g[b+212>>2];m=0;T=Y*+g[b+64>>2]+aq*+g[b+68>>2];e=1;while(1){u=Y*+g[b+64+(e<<3)>>2]+aq*+g[b+64+(e<<3)+4>>2];aj=u<T;ae=aj?e:m;ag=e+1|0;if((ag|0)<(am|0)){m=ae;T=aj?u:T;e=ag}else{aG=ae;break L249}}}else{aG=0}}while(0);e=aG+1|0;m=(e|0)<(am|0)?e:0;e=b+(aG<<3)|0;ae=n;ag=c[e>>2]|0;aj=c[e+4>>2]|0;c[ae>>2]=ag;c[ae+4>>2]=aj;ae=n+8|0;e=ae;a[ae]=0;ae=aG&255;a[e+1|0]=ae;a[e+2|0]=1;a[e+3|0]=0;e=b+(m<<3)|0;J=n+12|0;ak=c[e>>2]|0;ad=c[e+4>>2]|0;c[J>>2]=ak;c[J+4>>2]=ad;J=n+20|0;e=J;a[J]=0;a[e+1|0]=m&255;a[e+2|0]=1;a[e+3|0]=0;e=(a[an]&1)<<24>>24==0;T=(c[k>>2]=ag,+g[k>>2]);aq=(c[k>>2]=aj,+g[k>>2]);Y=(c[k>>2]=ak,+g[k>>2]);u=(c[k>>2]=ad,+g[k>>2]);if(e){e=c[G>>2]|0;ad=c[G+4>>2]|0;ak=c[C>>2]|0;aj=c[C+4>>2]|0;U=-0.0- +g[D>>2];ag=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);as=1;at=0;au=ag;av=(g[k>>2]=U,c[k>>2]|0);aw=ak;ax=aj;ay=e;az=ad;aA=Y;aB=T;aC=u;aD=aq;aE=ae;aF=1;break}else{ad=L;as=0;at=1;au=c[ad>>2]|0;av=c[ad+4>>2]|0;aw=c[G>>2]|0;ax=c[G+4>>2]|0;ay=c[C>>2]|0;az=c[C+4>>2]|0;aA=Y;aB=T;aC=u;aD=aq;aE=ae;aF=1;break}}}while(0);aq=(c[k>>2]=au,+g[k>>2]);u=(c[k>>2]=av,+g[k>>2]);T=(c[k>>2]=ax,+g[k>>2]);Y=(c[k>>2]=ay,+g[k>>2]);U=(c[k>>2]=az,+g[k>>2]);ab=-0.0-aq;z=Y*u+U*ab;v=-0.0-u;$=(c[k>>2]=aw,+g[k>>2])*v+T*aq;T=u*aB+aD*ab-z;A=u*aA+aC*ab-z;if(T>0.0){aH=0}else{dw(o|0,n|0,12);aH=1}if(A>0.0){aI=aH}else{dw(o+(aH*12&-1)|0,n+12|0,12);aI=aH+1|0}if(T*A<0.0){z=T/(T-A);aH=o+(aI*12&-1)|0;n=(g[k>>2]=aB+z*(aA-aB),c[k>>2]|0);aw=(g[k>>2]=aD+z*(aC-aD),c[k>>2]|0)|0;c[aH>>2]=0|n;c[aH+4>>2]=aw;aw=o+(aI*12&-1)+8|0;aH=aw;a[aw]=as&255;a[aH+1|0]=aE;a[aH+2|0]=0;a[aH+3|0]=1;aJ=aI+1|0}else{aJ=aI}if((aJ|0)<2){i=l;return}aD=+g[o>>2];aC=+g[o+4>>2];z=aD*v+aq*aC-$;aJ=o+12|0;aB=+g[aJ>>2];aA=+g[o+16>>2];A=aB*v+aq*aA-$;if(z>0.0){aK=0}else{dw(p|0,o|0,12);aK=1}if(A>0.0){aL=aK}else{dw(p+(aK*12&-1)|0,aJ|0,12);aL=aK+1|0}if(z*A<0.0){$=z/(z-A);aK=p+(aL*12&-1)|0;aJ=(g[k>>2]=aD+$*(aB-aD),c[k>>2]|0);aI=(g[k>>2]=aC+$*(aA-aC),c[k>>2]|0)|0;c[aK>>2]=0|aJ;c[aK+4>>2]=aI;aI=p+(aL*12&-1)+8|0;aK=aI;a[aI]=at;a[aK+1|0]=a[(o+8|0)+1|0]|0;a[aK+2|0]=0;a[aK+3|0]=1;aM=aL+1|0}else{aM=aL}if((aM|0)<2){i=l;return}aM=d+40|0;do{if(aF){aL=aM;c[aL>>2]=0|au;c[aL+4>>2]=av|0;aL=d+48|0;c[aL>>2]=0|ay;c[aL+4>>2]=az|0;aC=+g[p>>2];aA=+g[p+4>>2];$=+g[ap>>2];if(aq*(aC-Y)+u*(aA-U)>$){aN=0;aO=$}else{$=aC- +g[x>>2];aC=aA- +g[q>>2];aA=+g[y>>2];aD=+g[j>>2];aL=d;aK=(g[k>>2]=$*aA+aC*aD,c[k>>2]|0);o=(g[k>>2]=aA*aC+$*(-0.0-aD),c[k>>2]|0)|0;c[aL>>2]=0|aK;c[aL+4>>2]=o;c[d+16>>2]=c[p+8>>2]|0;aN=1;aO=+g[ap>>2]}aD=+g[p+12>>2];$=+g[p+16>>2];if(aq*(aD-Y)+u*($-U)>aO){aP=aN;break}aC=aD- +g[x>>2];aD=$- +g[q>>2];$=+g[y>>2];aA=+g[j>>2];o=d+(aN*20&-1)|0;aL=(g[k>>2]=aC*$+aD*aA,c[k>>2]|0);aK=(g[k>>2]=$*aD+aC*(-0.0-aA),c[k>>2]|0)|0;c[o>>2]=0|aL;c[o+4>>2]=aK;c[d+(aN*20&-1)+16>>2]=c[p+20>>2]|0;aP=aN+1|0}else{aK=h+84+(as<<3)|0;o=aM;aL=c[aK+4>>2]|0;c[o>>2]=c[aK>>2]|0;c[o+4>>2]=aL;aL=h+20+(as<<3)|0;o=d+48|0;aK=c[aL+4>>2]|0;c[o>>2]=c[aL>>2]|0;c[o+4>>2]=aK;aA=+g[ap>>2];if(aq*(+g[p>>2]-Y)+u*(+g[p+4>>2]-U)>aA){aQ=0;aR=aA}else{aK=p;o=d;aL=c[aK+4>>2]|0;c[o>>2]=c[aK>>2]|0;c[o+4>>2]=aL;aL=p+8|0;o=aL;aK=d+16|0;at=aK;a[at+2|0]=a[o+3|0]|0;a[at+3|0]=a[o+2|0]|0;a[aK]=a[o+1|0]|0;a[at+1|0]=a[aL]|0;aQ=1;aR=+g[ap>>2]}aL=p+12|0;if(aq*(+g[aL>>2]-Y)+u*(+g[p+16>>2]-U)>aR){aP=aQ;break}at=aL;aL=d+(aQ*20&-1)|0;o=c[at+4>>2]|0;c[aL>>2]=c[at>>2]|0;c[aL+4>>2]=o;o=p+20|0;aL=o;at=d+(aQ*20&-1)+16|0;aK=at;a[aK+2|0]=a[aL+3|0]|0;a[aK+3|0]=a[aL+2|0]|0;a[at]=a[aL+1|0]|0;a[aK+1|0]=a[o]|0;aP=aQ+1|0}}while(0);c[aa>>2]=aP;i=l;return}function bq(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0;d=a|0;c[d>>2]=0;e=a+4|0;c[e>>2]=-1;f=a+8|0;g[f>>2]=-3.4028234663852886e+38;h=+g[b+216>>2];i=+g[b+212>>2];a=c[b+128>>2]|0;if((a|0)<=0){return}j=+g[b+164>>2];k=+g[b+168>>2];l=+g[b+172>>2];m=+g[b+176>>2];n=+g[b+244>>2];o=b+228|0;p=b+232|0;q=b+236|0;r=b+240|0;s=0;t=-3.4028234663852886e+38;while(1){u=+g[b+64+(s<<3)>>2];v=-0.0-u;w=-0.0- +g[b+64+(s<<3)+4>>2];x=+g[b+(s<<3)>>2];y=+g[b+(s<<3)+4>>2];z=(x-j)*v+(y-k)*w;A=(x-l)*v+(y-m)*w;B=z<A?z:A;if(B>n){break}do{if(h*u+i*w<0.0){if((v- +g[o>>2])*i+(w- +g[p>>2])*h>=-.03490658849477768&B>t){C=233;break}else{D=t;break}}else{if((v- +g[q>>2])*i+(w- +g[r>>2])*h>=-.03490658849477768&B>t){C=233;break}else{D=t;break}}}while(0);if((C|0)==233){C=0;c[d>>2]=2;c[e>>2]=s;g[f>>2]=B;D=B}E=s+1|0;if((E|0)<(a|0)){s=E;t=D}else{C=236;break}}if((C|0)==236){return}c[d>>2]=2;c[e>>2]=s;g[f>>2]=B;return}function br(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0,A=0.0,B=0;h=c[b+148>>2]|0;i=+g[f+12>>2];j=+g[e+12>>2];k=+g[f+8>>2];l=+g[e+16>>2];m=+g[d+12>>2];n=+g[b+12>>2];o=+g[d+8>>2];p=+g[b+16>>2];q=+g[f>>2]+(i*j-k*l)-(+g[d>>2]+(m*n-o*p));r=j*k+i*l+ +g[f+4>>2]-(n*o+m*p+ +g[d+4>>2]);p=m*q+o*r;n=m*r+q*(-0.0-o);L313:do{if((h|0)>0){s=0;o=-3.4028234663852886e+38;t=0;while(1){q=p*+g[b+84+(s<<3)>>2]+n*+g[b+84+(s<<3)+4>>2];u=q>o;v=u?s:t;w=s+1|0;if((w|0)==(h|0)){x=v;break L313}else{s=w;o=u?q:o;t=v}}}else{x=0}}while(0);n=+bt(b,d,x,e,f);t=((x|0)>0?x:h)-1|0;p=+bt(b,d,t,e,f);s=x+1|0;v=(s|0)<(h|0)?s:0;o=+bt(b,d,v,e,f);if(p>n&p>o){q=p;s=t;while(1){t=((s|0)>0?s:h)-1|0;p=+bt(b,d,t,e,f);if(p>q){q=p;s=t}else{y=q;z=s;break}}c[a>>2]=z;return+y}if(o>n){A=o;B=v}else{y=n;z=x;c[a>>2]=z;return+y}while(1){x=B+1|0;v=(x|0)<(h|0)?x:0;n=+bt(b,d,v,e,f);if(n>A){A=n;B=v}else{y=A;z=B;break}}c[a>>2]=z;return+y}function bs(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0,B=0,C=0,D=0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,O=0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0;j=i;i=i+80|0;l=j|0;m=j+4|0;n=j+8|0;o=j+32|0;p=j+56|0;q=b+60|0;c[q>>2]=0;r=+g[d+8>>2]+ +g[f+8>>2];c[l>>2]=0;s=+br(l,d,e,f,h);if(s>r){i=j;return}c[m>>2]=0;t=+br(m,f,h,d,e);if(t>r){i=j;return}if(t>s*.9800000190734863+.0010000000474974513){s=+g[h>>2];t=+g[h+4>>2];u=+g[h+8>>2];v=+g[h+12>>2];w=+g[e>>2];x=+g[e+4>>2];y=+g[e+8>>2];z=+g[e+12>>2];A=c[m>>2]|0;c[b+56>>2]=2;B=f;C=d;D=A;E=1;F=w;G=x;H=y;I=z;J=s;K=t;L=u;M=v}else{v=+g[e>>2];u=+g[e+4>>2];t=+g[e+8>>2];s=+g[e+12>>2];z=+g[h>>2];y=+g[h+4>>2];x=+g[h+8>>2];w=+g[h+12>>2];h=c[l>>2]|0;c[b+56>>2]=1;B=d;C=f;D=h;E=0;F=z;G=y;H=x;I=w;J=v;K=u;L=t;M=s}h=c[C+148>>2]|0;if((D|0)<=-1){aK(5243976,151,5250012,5245804)}f=c[B+148>>2]|0;if((f|0)<=(D|0)){aK(5243976,151,5250012,5245804)}s=+g[B+84+(D<<3)>>2];t=+g[B+84+(D<<3)+4>>2];u=M*s-L*t;v=L*s+M*t;t=I*u+H*v;s=-0.0-H;w=I*v+u*s;L344:do{if((h|0)>0){d=0;u=3.4028234663852886e+38;l=0;while(1){v=t*+g[C+84+(d<<3)>>2]+w*+g[C+84+(d<<3)+4>>2];e=v<u;A=e?d:l;m=d+1|0;if((m|0)==(h|0)){O=A;break L344}else{d=m;u=e?v:u;l=A}}}else{O=0}}while(0);l=O+1|0;d=(l|0)<(h|0)?l:0;w=+g[C+20+(O<<3)>>2];t=+g[C+20+(O<<3)+4>>2];u=F+(I*w-H*t);v=G+(H*w+I*t);l=n;h=(g[k>>2]=u,c[k>>2]|0);A=(g[k>>2]=v,c[k>>2]|0)|0;c[l>>2]=0|h;c[l+4>>2]=A;A=D&255;l=n+8|0;h=l;a[l]=A;l=O&255;a[h+1|0]=l;a[h+2|0]=1;a[h+3|0]=0;h=n+12|0;t=+g[C+20+(d<<3)>>2];w=+g[C+20+(d<<3)+4>>2];x=F+(I*t-H*w);y=G+(H*t+I*w);C=h;O=(g[k>>2]=x,c[k>>2]|0);e=(g[k>>2]=y,c[k>>2]|0)|0;c[C>>2]=0|O;c[C+4>>2]=e;e=n+20|0;C=e;a[e]=A;a[C+1|0]=d&255;a[C+2|0]=1;a[C+3|0]=0;C=D+1|0;d=(C|0)<(f|0)?C:0;C=B+20+(D<<3)|0;D=c[C+4>>2]|0;w=(c[k>>2]=c[C>>2]|0,+g[k>>2]);t=(c[k>>2]=D,+g[k>>2]);D=B+20+(d<<3)|0;B=c[D+4>>2]|0;z=(c[k>>2]=c[D>>2]|0,+g[k>>2]);P=(c[k>>2]=B,+g[k>>2]);Q=z-w;R=P-t;S=+N(+(Q*Q+R*R));if(S<1.1920928955078125e-7){T=Q;U=R}else{V=1.0/S;T=Q*V;U=R*V}V=M*T-L*U;R=M*U+L*T;Q=V*-1.0;S=J+(M*w-L*t);W=K+(L*w+M*t);X=S*R+W*Q;Y=r-(S*V+W*R);W=r+((J+(M*z-L*P))*V+(K+(L*z+M*P))*R);M=-0.0-V;L=-0.0-R;K=u*M+v*L-Y;J=x*M+y*L-Y;if(K>0.0){Z=0}else{dw(o|0,n|0,12);Z=1}if(J>0.0){_=Z}else{dw(o+(Z*12&-1)|0,h|0,12);_=Z+1|0}if(K*J<0.0){Y=K/(K-J);Z=o+(_*12&-1)|0;h=(g[k>>2]=u+Y*(x-u),c[k>>2]|0);n=(g[k>>2]=v+Y*(y-v),c[k>>2]|0)|0;c[Z>>2]=0|h;c[Z+4>>2]=n;n=o+(_*12&-1)+8|0;Z=n;a[n]=A;a[Z+1|0]=l;a[Z+2|0]=0;a[Z+3|0]=1;$=_+1|0}else{$=_}if(($|0)<2){i=j;return}v=+g[o>>2];y=+g[o+4>>2];Y=V*v+R*y-W;$=o+12|0;u=+g[$>>2];x=+g[o+16>>2];J=V*u+R*x-W;if(Y>0.0){aa=0}else{dw(p|0,o|0,12);aa=1}if(J>0.0){ab=aa}else{dw(p+(aa*12&-1)|0,$|0,12);ab=aa+1|0}if(Y*J<0.0){W=Y/(Y-J);aa=p+(ab*12&-1)|0;$=(g[k>>2]=v+W*(u-v),c[k>>2]|0);_=(g[k>>2]=y+W*(x-y),c[k>>2]|0)|0;c[aa>>2]=0|$;c[aa+4>>2]=_;_=p+(ab*12&-1)+8|0;aa=_;a[_]=d&255;a[aa+1|0]=a[(o+8|0)+1|0]|0;a[aa+2|0]=0;a[aa+3|0]=1;ac=ab+1|0}else{ac=ab}if((ac|0)<2){i=j;return}ac=b+40|0;ab=(g[k>>2]=U,c[k>>2]|0);aa=(g[k>>2]=T*-1.0,c[k>>2]|0)|0;c[ac>>2]=0|ab;c[ac+4>>2]=aa;aa=b+48|0;ac=(g[k>>2]=(w+z)*.5,c[k>>2]|0);ab=(g[k>>2]=(t+P)*.5,c[k>>2]|0)|0;c[aa>>2]=0|ac;c[aa+4>>2]=ab;P=+g[p>>2];t=+g[p+4>>2];ab=R*P+Q*t-X>r;do{if(E<<24>>24==0){if(ab){ad=0}else{z=P-F;w=t-G;aa=b;ac=(g[k>>2]=I*z+H*w,c[k>>2]|0);o=(g[k>>2]=z*s+I*w,c[k>>2]|0)|0;c[aa>>2]=0|ac;c[aa+4>>2]=o;c[b+16>>2]=c[p+8>>2]|0;ad=1}w=+g[p+12>>2];z=+g[p+16>>2];if(R*w+Q*z-X>r){ae=ad;break}T=w-F;w=z-G;o=b+(ad*20&-1)|0;aa=(g[k>>2]=I*T+H*w,c[k>>2]|0);ac=(g[k>>2]=T*s+I*w,c[k>>2]|0)|0;c[o>>2]=0|aa;c[o+4>>2]=ac;c[b+(ad*20&-1)+16>>2]=c[p+20>>2]|0;ae=ad+1|0}else{if(ab){af=0}else{w=P-F;T=t-G;ac=b;o=(g[k>>2]=I*w+H*T,c[k>>2]|0);aa=(g[k>>2]=w*s+I*T,c[k>>2]|0)|0;c[ac>>2]=0|o;c[ac+4>>2]=aa;aa=b+16|0;ac=c[p+8>>2]|0;c[aa>>2]=ac;o=aa;a[aa]=ac>>>8&255;a[o+1|0]=ac&255;a[o+2|0]=ac>>>24&255;a[o+3|0]=ac>>>16&255;af=1}T=+g[p+12>>2];w=+g[p+16>>2];if(R*T+Q*w-X>r){ae=af;break}z=T-F;T=w-G;ac=b+(af*20&-1)|0;o=(g[k>>2]=I*z+H*T,c[k>>2]|0);aa=(g[k>>2]=z*s+I*T,c[k>>2]|0)|0;c[ac>>2]=0|o;c[ac+4>>2]=aa;aa=b+(af*20&-1)+16|0;ac=c[p+20>>2]|0;c[aa>>2]=ac;o=aa;a[aa]=ac>>>8&255;a[o+1|0]=ac&255;a[o+2|0]=ac>>>24&255;a[o+3|0]=ac>>>16&255;ae=af+1|0}}while(0);c[q>>2]=ae;i=j;return}function bt(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0,r=0.0,s=0,t=0.0,u=0,v=0,w=0,x=0;h=c[e+148>>2]|0;if((d|0)<=-1){aK(5243976,32,5250152,5245804)}if((c[a+148>>2]|0)<=(d|0)){aK(5243976,32,5250152,5245804)}i=+g[b+12>>2];j=+g[a+84+(d<<3)>>2];k=+g[b+8>>2];l=+g[a+84+(d<<3)+4>>2];m=i*j-k*l;n=j*k+i*l;l=+g[f+12>>2];j=+g[f+8>>2];o=l*m+j*n;p=l*n+m*(-0.0-j);L395:do{if((h|0)>0){q=0;r=3.4028234663852886e+38;s=0;while(1){t=o*+g[e+20+(q<<3)>>2]+p*+g[e+20+(q<<3)+4>>2];u=t<r;v=u?q:s;w=q+1|0;if((w|0)==(h|0)){x=v;break L395}else{q=w;r=u?t:r;s=v}}}else{x=0}}while(0);p=+g[a+20+(d<<3)>>2];o=+g[a+20+(d<<3)+4>>2];r=+g[e+20+(x<<3)>>2];t=+g[e+20+(x<<3)+4>>2];return+(m*(+g[f>>2]+(l*r-j*t)-(+g[b>>2]+(i*p-k*o)))+n*(r*j+l*t+ +g[f+4>>2]-(p*k+i*o+ +g[b+4>>2])))}function bu(a,b,d,e,f,h){a=a|0;b=b|0;d=d|0;e=+e;f=f|0;h=+h;var i=0,j=0,l=0,m=0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0,w=0,x=0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0,E=0,F=0,G=0,H=0.0,I=0.0;i=b+60|0;if((c[i>>2]|0)==0){return}j=c[b+56>>2]|0;if((j|0)==0){l=a|0;g[l>>2]=1.0;m=a+4|0;g[m>>2]=0.0;n=+g[d+12>>2];o=+g[b+48>>2];p=+g[d+8>>2];q=+g[b+52>>2];r=+g[d>>2]+(n*o-p*q);s=o*p+n*q+ +g[d+4>>2];q=+g[f+12>>2];n=+g[b>>2];p=+g[f+8>>2];o=+g[b+4>>2];t=+g[f>>2]+(q*n-p*o);u=n*p+q*o+ +g[f+4>>2];o=r-t;q=s-u;do{if(o*o+q*q>1.4210854715202004e-14){p=t-r;n=u-s;v=a;w=(g[k>>2]=p,c[k>>2]|0);x=(g[k>>2]=n,c[k>>2]|0)|0;c[v>>2]=0|w;c[v+4>>2]=x;y=+N(+(p*p+n*n));if(y<1.1920928955078125e-7){z=p;A=n;break}B=1.0/y;y=p*B;g[l>>2]=y;p=n*B;g[m>>2]=p;z=y;A=p}else{z=1.0;A=0.0}}while(0);m=a+8|0;l=(g[k>>2]=(r+z*e+(t-z*h))*.5,c[k>>2]|0);x=(g[k>>2]=(s+A*e+(u-A*h))*.5,c[k>>2]|0)|0;c[m>>2]=0|l;c[m+4>>2]=x;return}else if((j|0)==1){x=d+12|0;A=+g[x>>2];u=+g[b+40>>2];m=d+8|0;s=+g[m>>2];z=+g[b+44>>2];t=A*u-s*z;r=u*s+A*z;l=a;v=(g[k>>2]=t,c[k>>2]|0);w=(g[k>>2]=r,c[k>>2]|0)|0;c[l>>2]=0|v;c[l+4>>2]=w;z=+g[x>>2];A=+g[b+48>>2];s=+g[m>>2];u=+g[b+52>>2];q=+g[d>>2]+(z*A-s*u);o=A*s+z*u+ +g[d+4>>2];if((c[i>>2]|0)<=0){return}m=f+12|0;x=f+8|0;w=f|0;l=f+4|0;v=a|0;C=a+4|0;D=0;u=t;t=r;while(1){r=+g[m>>2];z=+g[b+(D*20&-1)>>2];s=+g[x>>2];A=+g[b+(D*20&-1)+4>>2];p=+g[w>>2]+(r*z-s*A);y=z*s+r*A+ +g[l>>2];A=e-(u*(p-q)+(y-o)*t);E=a+8+(D<<3)|0;F=(g[k>>2]=(p-u*h+(p+u*A))*.5,c[k>>2]|0);G=(g[k>>2]=(y-t*h+(y+t*A))*.5,c[k>>2]|0)|0;c[E>>2]=0|F;c[E+4>>2]=G;G=D+1|0;if((G|0)>=(c[i>>2]|0)){break}D=G;u=+g[v>>2];t=+g[C>>2]}return}else if((j|0)==2){j=f+12|0;t=+g[j>>2];u=+g[b+40>>2];C=f+8|0;o=+g[C>>2];q=+g[b+44>>2];A=t*u-o*q;y=u*o+t*q;v=a;D=(g[k>>2]=A,c[k>>2]|0);l=(g[k>>2]=y,c[k>>2]|0)|0;c[v>>2]=0|D;c[v+4>>2]=l;q=+g[j>>2];t=+g[b+48>>2];o=+g[C>>2];u=+g[b+52>>2];p=+g[f>>2]+(q*t-o*u);r=t*o+q*u+ +g[f+4>>2];L419:do{if((c[i>>2]|0)>0){f=d+12|0;C=d+8|0;j=d|0;l=d+4|0;D=a|0;w=a+4|0;x=0;u=A;q=y;while(1){o=+g[f>>2];t=+g[b+(x*20&-1)>>2];s=+g[C>>2];z=+g[b+(x*20&-1)+4>>2];B=+g[j>>2]+(o*t-s*z);n=t*s+o*z+ +g[l>>2];z=h-(u*(B-p)+(n-r)*q);m=a+8+(x<<3)|0;G=(g[k>>2]=(B-u*e+(B+u*z))*.5,c[k>>2]|0);E=(g[k>>2]=(n-q*e+(n+q*z))*.5,c[k>>2]|0)|0;c[m>>2]=0|G;c[m+4>>2]=E;E=x+1|0;z=+g[D>>2];n=+g[w>>2];if((E|0)<(c[i>>2]|0)){x=E;u=z;q=n}else{H=z;I=n;break L419}}}else{H=A;I=y}}while(0);i=(g[k>>2]=-0.0-H,c[k>>2]|0);a=(g[k>>2]=-0.0-I,c[k>>2]|0)|0;c[v>>2]=0|i;c[v+4>>2]=a;return}else{return}}function bv(a){a=a|0;var b=0,d=0,e=0.0,f=0.0,h=0,i=0.0,j=0.0,l=0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0;b=a+16|0;d=c[b+4>>2]|0;e=(c[k>>2]=c[b>>2]|0,+g[k>>2]);f=(c[k>>2]=d,+g[k>>2]);d=a+36|0;b=a+52|0;h=c[b+4>>2]|0;i=(c[k>>2]=c[b>>2]|0,+g[k>>2]);j=(c[k>>2]=h,+g[k>>2]);h=a+72|0;b=a+88|0;l=c[b+4>>2]|0;m=(c[k>>2]=c[b>>2]|0,+g[k>>2]);n=(c[k>>2]=l,+g[k>>2]);o=i-e;p=j-f;q=e*o+f*p;r=i*o+j*p;s=m-e;t=n-f;u=e*s+f*t;v=m*s+n*t;w=m-i;x=n-j;y=i*w+j*x;z=m*w+n*x;x=o*t-p*s;s=(i*n-j*m)*x;p=(f*m-e*n)*x;n=(e*j-f*i)*x;if(!(q<-0.0|u<-0.0)){g[a+24>>2]=1.0;c[a+108>>2]=1;return}if(!(q>=-0.0|r<=0.0|n>0.0)){x=1.0/(r-q);g[a+24>>2]=r*x;g[a+60>>2]=x*(-0.0-q);c[a+108>>2]=2;return}if(!(u>=-0.0|v<=0.0|p>0.0)){q=1.0/(v-u);g[a+24>>2]=v*q;g[a+96>>2]=q*(-0.0-u);c[a+108>>2]=2;dw(d|0,h|0,36);return}if(!(r>0.0|y<-0.0)){g[a+60>>2]=1.0;c[a+108>>2]=1;dw(a|0,d|0,36);return}if(!(v>0.0|z>0.0)){g[a+96>>2]=1.0;c[a+108>>2]=1;dw(a|0,h|0,36);return}if(y>=-0.0|z<=0.0|s>0.0){v=1.0/(n+(s+p));g[a+24>>2]=s*v;g[a+60>>2]=p*v;g[a+96>>2]=n*v;c[a+108>>2]=3;return}else{v=1.0/(z-y);g[a+60>>2]=z*v;g[a+96>>2]=v*(-0.0-y);c[a+108>>2]=2;dw(a|0,h|0,36);return}}function bw(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0;e=c[b+4>>2]|0;if((e|0)==0){c[a+16>>2]=b+12|0;c[a+20>>2]=1;g[a+24>>2]=+g[b+8>>2];return}else if((e|0)==2){c[a+16>>2]=b+20|0;c[a+20>>2]=c[b+148>>2]|0;g[a+24>>2]=+g[b+8>>2];return}else if((e|0)==3){if((d|0)<=-1){aK(5243036,53,5249516,5245508)}f=b+16|0;if((c[f>>2]|0)<=(d|0)){aK(5243036,53,5249516,5245508)}h=b+12|0;i=(c[h>>2]|0)+(d<<3)|0;j=a;k=c[i+4>>2]|0;c[j>>2]=c[i>>2]|0;c[j+4>>2]=k;k=d+1|0;d=a+8|0;j=c[h>>2]|0;if((k|0)<(c[f>>2]|0)){f=j+(k<<3)|0;k=d;h=c[f+4>>2]|0;c[k>>2]=c[f>>2]|0;c[k+4>>2]=h}else{h=j;j=d;d=c[h+4>>2]|0;c[j>>2]=c[h>>2]|0;c[j+4>>2]=d}c[a+16>>2]=a|0;c[a+20>>2]=2;g[a+24>>2]=+g[b+8>>2];return}else if((e|0)==1){c[a+16>>2]=b+12|0;c[a+20>>2]=2;g[a+24>>2]=+g[b+8>>2];return}else{aK(5243036,81,5249516,5245900)}}function bx(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0.0,v=0.0,w=0,x=0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0,E=0.0,F=0.0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,O=0,P=0,Q=0,R=0,S=0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0,$=0,aa=0.0,ab=0.0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0.0,ar=0.0,as=0.0;h=i;i=i+168|0;j=h|0;l=h+16|0;m=h+32|0;n=h+144|0;o=h+156|0;c[1310733]=(c[1310733]|0)+1|0;dw(j|0,f+56|0,16);dw(l|0,f+72|0,16);by(m,e,f|0,j,f+28|0,l);p=m|0;q=m+108|0;r=c[q>>2]|0;if((r|0)==1|(r|0)==2|(r|0)==3){s=m+16|0;t=m+20|0;u=+g[j+12>>2];v=+g[j+8>>2];w=f+16|0;x=f+20|0;y=+g[j>>2];z=+g[j+4>>2];A=+g[l+12>>2];B=+g[l+8>>2];C=-0.0-B;j=f+44|0;D=f+48|0;E=+g[l>>2];F=+g[l+4>>2];l=m+52|0;G=m+56|0;H=m+16|0;I=m+52|0;J=m+24|0;K=m+60|0;L=m;M=m+36|0;O=0;P=r;L476:while(1){Q=(P|0)>0;L478:do{if(Q){R=0;while(1){c[n+(R<<2)>>2]=c[p+(R*36&-1)+28>>2]|0;c[o+(R<<2)>>2]=c[p+(R*36&-1)+32>>2]|0;S=R+1|0;if((S|0)==(P|0)){break L478}else{R=S}}}}while(0);do{if((P|0)==2){R=c[H+4>>2]|0;T=(c[k>>2]=c[H>>2]|0,+g[k>>2]);U=(c[k>>2]=R,+g[k>>2]);R=c[I+4>>2]|0;V=(c[k>>2]=c[I>>2]|0,+g[k>>2]);W=(c[k>>2]=R,+g[k>>2]);X=V-T;Y=W-U;Z=T*X+U*Y;if(Z>=-0.0){g[J>>2]=1.0;c[q>>2]=1;_=378;break}U=V*X+W*Y;if(U>0.0){Y=1.0/(U-Z);g[J>>2]=U*Y;g[K>>2]=Y*(-0.0-Z);c[q>>2]=2;_=379;break}else{g[K>>2]=1.0;c[q>>2]=1;dw(L|0,M|0,36);_=378;break}}else if((P|0)==3){bv(m);R=c[q>>2]|0;if((R|0)==0){_=376;break L476}else if((R|0)==1){_=378;break}else if((R|0)==2){_=379;break}else if((R|0)==3){$=O;_=403;break L476}else{_=377;break L476}}else if((P|0)==1){_=378}else{_=374;break L476}}while(0);do{if((_|0)==378){_=0;aa=-0.0- +g[s>>2];ab=-0.0- +g[t>>2];ac=1}else if((_|0)==379){_=0;Z=+g[s>>2];Y=+g[l>>2]-Z;U=+g[t>>2];W=+g[G>>2]-U;if(Y*(-0.0-U)-W*(-0.0-Z)>0.0){aa=W*-1.0;ab=Y;ac=2;break}else{aa=W;ab=Y*-1.0;ac=2;break}}}while(0);if(ab*ab+aa*aa<1.4210854715202004e-14){$=O;_=403;break}R=p+(ac*36&-1)|0;Y=-0.0-ab;W=u*(-0.0-aa)+v*Y;Z=u*Y+aa*v;S=c[w>>2]|0;ad=c[x>>2]|0;if((ad|0)>1){Y=Z*+g[S+4>>2]+W*+g[S>>2];ae=1;af=0;while(1){U=W*+g[S+(ae<<3)>>2]+Z*+g[S+(ae<<3)+4>>2];ag=U>Y;ah=ag?ae:af;ai=ae+1|0;if((ai|0)==(ad|0)){break}else{Y=ag?U:Y;ae=ai;af=ah}}af=p+(ac*36&-1)+28|0;c[af>>2]=ah;if((ah|0)>-1){aj=ah;ak=af}else{_=417;break}}else{af=p+(ac*36&-1)+28|0;c[af>>2]=0;aj=0;ak=af}if((ad|0)<=(aj|0)){_=418;break}Y=+g[S+(aj<<3)>>2];Z=+g[S+(aj<<3)+4>>2];W=y+(u*Y-v*Z);af=R;ae=(g[k>>2]=W,c[k>>2]|0);ai=(g[k>>2]=Y*v+u*Z+z,c[k>>2]|0)|0;c[af>>2]=0|ae;c[af+4>>2]=ai;Z=aa*A+ab*B;Y=ab*A+aa*C;ai=c[j>>2]|0;af=c[D>>2]|0;if((af|0)>1){U=Y*+g[ai+4>>2]+Z*+g[ai>>2];ae=1;ag=0;while(1){X=Z*+g[ai+(ae<<3)>>2]+Y*+g[ai+(ae<<3)+4>>2];al=X>U;am=al?ae:ag;an=ae+1|0;if((an|0)==(af|0)){break}else{U=al?X:U;ae=an;ag=am}}ag=p+(ac*36&-1)+32|0;c[ag>>2]=am;if((am|0)>-1){ao=am;ap=ag}else{_=419;break}}else{ag=p+(ac*36&-1)+32|0;c[ag>>2]=0;ao=0;ap=ag}if((af|0)<=(ao|0)){_=420;break}U=+g[ai+(ao<<3)>>2];Y=+g[ai+(ao<<3)+4>>2];Z=E+(A*U-B*Y);ag=p+(ac*36&-1)+8|0;ae=(g[k>>2]=Z,c[k>>2]|0);R=(g[k>>2]=U*B+A*Y+F,c[k>>2]|0)|0;c[ag>>2]=0|ae;c[ag+4>>2]=R;Y=+g[p+(ac*36&-1)+12>>2]- +g[p+(ac*36&-1)+4>>2];R=p+(ac*36&-1)+16|0;ag=(g[k>>2]=Z-W,c[k>>2]|0);ae=(g[k>>2]=Y,c[k>>2]|0)|0;c[R>>2]=0|ag;c[R+4>>2]=ae;ae=O+1|0;c[1310732]=(c[1310732]|0)+1|0;L515:do{if(Q){R=c[ak>>2]|0;ag=0;while(1){if((R|0)==(c[n+(ag<<2)>>2]|0)){if((c[ap>>2]|0)==(c[o+(ag<<2)>>2]|0)){$=ae;_=403;break L476}}S=ag+1|0;if((S|0)<(P|0)){ag=S}else{break L515}}}}while(0);Q=(c[q>>2]|0)+1|0;c[q>>2]=Q;if((ae|0)<20){O=ae;P=Q}else{$=ae;_=403;break}}if((_|0)==374){aK(5243036,498,5250460,5245900)}else if((_|0)==376){aK(5243036,194,5247104,5245900)}else if((_|0)==377){aK(5243036,207,5247104,5245900)}else if((_|0)==403){P=c[1310731]|0;c[1310731]=(P|0)>($|0)?P:$;P=d+8|0;bz(m,d|0,P);O=d|0;o=P|0;F=+g[O>>2]- +g[o>>2];ap=d+4|0;n=d+12|0;A=+g[ap>>2]- +g[n>>2];ak=d+16|0;g[ak>>2]=+N(+(F*F+A*A));c[d+20>>2]=$;$=c[q>>2]|0;if(($|0)==0){aK(5243036,246,5247004,5245900)}else if(($|0)==2){A=+g[s>>2]- +g[l>>2];F=+g[t>>2]- +g[G>>2];aq=+N(+(A*A+F*F))}else if(($|0)==3){F=+g[s>>2];A=+g[t>>2];aq=(+g[l>>2]-F)*(+g[m+92>>2]-A)-(+g[G>>2]-A)*(+g[m+88>>2]-F)}else if(($|0)==1){aq=0.0}else{aK(5243036,259,5247004,5245900)}g[e>>2]=aq;b[e+4>>1]=$&65535;m=0;while(1){a[m+(e+6)|0]=c[p+(m*36&-1)+28>>2]&255;a[m+(e+9)|0]=c[p+(m*36&-1)+32>>2]&255;G=m+1|0;if((G|0)<($|0)){m=G}else{break}}if((a[f+88|0]&1)<<24>>24==0){i=h;return}aq=+g[f+24>>2];F=+g[f+52>>2];A=+g[ak>>2];B=aq+F;if(!(A>B&A>1.1920928955078125e-7)){E=(+g[ap>>2]+ +g[n>>2])*.5;f=d;d=(g[k>>2]=(+g[O>>2]+ +g[o>>2])*.5,c[k>>2]|0);m=0|d;d=(g[k>>2]=E,c[k>>2]|0)|0;c[f>>2]=m;c[f+4>>2]=d;f=P;c[f>>2]=m;c[f+4>>2]=d;g[ak>>2]=0.0;i=h;return}g[ak>>2]=A-B;B=+g[o>>2];A=+g[O>>2];E=B-A;C=+g[n>>2];aa=+g[ap>>2];ab=C-aa;z=+N(+(E*E+ab*ab));if(z<1.1920928955078125e-7){ar=E;as=ab}else{u=1.0/z;ar=E*u;as=ab*u}g[O>>2]=aq*ar+A;g[ap>>2]=aq*as+aa;g[o>>2]=B-F*ar;g[n>>2]=C-F*as;i=h;return}else if((_|0)==417){aK(5244292,103,5247300,5243944)}else if((_|0)==418){aK(5244292,103,5247300,5243944)}else if((_|0)==419){aK(5244292,103,5247300,5243944)}else if((_|0)==420){aK(5244292,103,5247300,5243944)}}else if((r|0)==0){aK(5243036,194,5247104,5245900)}else{aK(5243036,207,5247104,5245900)}}function by(a,e,f,h,i,j){a=a|0;e=e|0;f=f|0;h=h|0;i=i|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,O=0.0,P=0.0,Q=0.0;l=b[e+4>>1]|0;if((l&65535)>=4){aK(5243036,102,5247708,5243624)}m=l&65535;n=a+108|0;c[n>>2]=m;o=a|0;L558:do{if(l<<16>>16==0){p=m}else{q=f+20|0;r=f+16|0;s=i+20|0;t=i+16|0;u=h+12|0;v=h+8|0;w=h|0;x=h+4|0;y=j+12|0;z=j+8|0;A=j|0;B=j+4|0;C=0;while(1){D=d[C+(e+6)|0]|0;c[o+(C*36&-1)+28>>2]=D;E=d[C+(e+9)|0]|0;c[o+(C*36&-1)+32>>2]=E;if((c[q>>2]|0)<=(D|0)){F=429;break}G=(c[r>>2]|0)+(D<<3)|0;D=c[G+4>>2]|0;H=(c[k>>2]=c[G>>2]|0,+g[k>>2]);I=(c[k>>2]=D,+g[k>>2]);if((c[s>>2]|0)<=(E|0)){F=431;break}D=(c[t>>2]|0)+(E<<3)|0;E=c[D+4>>2]|0;J=(c[k>>2]=c[D>>2]|0,+g[k>>2]);K=(c[k>>2]=E,+g[k>>2]);L=+g[u>>2];M=+g[v>>2];O=+g[w>>2]+(H*L-I*M);P=I*L+H*M+ +g[x>>2];E=o+(C*36&-1)|0;D=(g[k>>2]=O,c[k>>2]|0);G=(g[k>>2]=P,c[k>>2]|0)|0;c[E>>2]=0|D;c[E+4>>2]=G;P=+g[y>>2];M=+g[z>>2];H=+g[A>>2]+(J*P-K*M);L=K*P+J*M+ +g[B>>2];G=o+(C*36&-1)+8|0;E=(g[k>>2]=H,c[k>>2]|0);D=(g[k>>2]=L,c[k>>2]|0)|0;c[G>>2]=0|E;c[G+4>>2]=D;L=+g[o+(C*36&-1)+12>>2]- +g[o+(C*36&-1)+4>>2];D=o+(C*36&-1)+16|0;G=(g[k>>2]=H-O,c[k>>2]|0);E=(g[k>>2]=L,c[k>>2]|0)|0;c[D>>2]=0|G;c[D+4>>2]=E;g[o+(C*36&-1)+24>>2]=0.0;E=C+1|0;D=c[n>>2]|0;if((E|0)<(D|0)){C=E}else{p=D;break L558}}if((F|0)==429){aK(5244292,103,5247300,5243944)}else if((F|0)==431){aK(5244292,103,5247300,5243944)}}}while(0);do{if((p|0)>1){L=+g[e>>2];if((p|0)==2){O=+g[a+16>>2]- +g[a+52>>2];H=+g[a+20>>2]- +g[a+56>>2];Q=+N(+(O*O+H*H))}else if((p|0)==3){H=+g[a+16>>2];O=+g[a+20>>2];Q=(+g[a+52>>2]-H)*(+g[a+92>>2]-O)-(+g[a+56>>2]-O)*(+g[a+88>>2]-H)}else{aK(5243036,259,5247004,5245900)}if(Q>=L*.5){if(!(L*2.0<Q|Q<1.1920928955078125e-7)){F=441;break}}c[n>>2]=0;break}else{F=441}}while(0);do{if((F|0)==441){if((p|0)==0){break}return}}while(0);c[a+28>>2]=0;c[a+32>>2]=0;if((c[f+20>>2]|0)<=0){aK(5244292,103,5247300,5243944)}p=c[f+16>>2]|0;f=c[p+4>>2]|0;Q=(c[k>>2]=c[p>>2]|0,+g[k>>2]);L=(c[k>>2]=f,+g[k>>2]);if((c[i+20>>2]|0)<=0){aK(5244292,103,5247300,5243944)}f=c[i+16>>2]|0;i=c[f+4>>2]|0;H=(c[k>>2]=c[f>>2]|0,+g[k>>2]);O=(c[k>>2]=i,+g[k>>2]);M=+g[h+12>>2];J=+g[h+8>>2];P=+g[h>>2]+(Q*M-L*J);K=L*M+Q*J+ +g[h+4>>2];h=a;i=(g[k>>2]=P,c[k>>2]|0);f=(g[k>>2]=K,c[k>>2]|0)|0;c[h>>2]=0|i;c[h+4>>2]=f;J=+g[j+12>>2];Q=+g[j+8>>2];M=+g[j>>2]+(H*J-O*Q);L=O*J+H*Q+ +g[j+4>>2];j=a+8|0;f=(g[k>>2]=M,c[k>>2]|0);h=(g[k>>2]=L,c[k>>2]|0)|0;c[j>>2]=0|f;c[j+4>>2]=h;h=a+16|0;a=(g[k>>2]=M-P,c[k>>2]|0);j=(g[k>>2]=L-K,c[k>>2]|0)|0;c[h>>2]=0|a;c[h+4>>2]=j;c[n>>2]=1;return}function bz(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0.0,l=0.0,m=0.0,n=0,o=0,p=0.0;e=c[a+108>>2]|0;if((e|0)==0){aK(5243036,217,5247044,5245900)}else if((e|0)==1){f=a;h=b;i=c[f+4>>2]|0;c[h>>2]=c[f>>2]|0;c[h+4>>2]=i;i=a+8|0;h=d;f=c[i+4>>2]|0;c[h>>2]=c[i>>2]|0;c[h+4>>2]=f;return}else if((e|0)==2){f=a+24|0;j=+g[f>>2];h=a+60|0;l=+g[h>>2];m=j*+g[a+4>>2]+l*+g[a+40>>2];i=b;n=(g[k>>2]=j*+g[a>>2]+l*+g[a+36>>2],c[k>>2]|0);o=(g[k>>2]=m,c[k>>2]|0)|0;c[i>>2]=0|n;c[i+4>>2]=o;m=+g[f>>2];l=+g[h>>2];j=m*+g[a+12>>2]+l*+g[a+48>>2];h=d;f=(g[k>>2]=m*+g[a+8>>2]+l*+g[a+44>>2],c[k>>2]|0);o=(g[k>>2]=j,c[k>>2]|0)|0;c[h>>2]=0|f;c[h+4>>2]=o;return}else if((e|0)==3){j=+g[a+24>>2];l=+g[a+60>>2];m=+g[a+96>>2];p=j*+g[a+4>>2]+l*+g[a+40>>2]+m*+g[a+76>>2];e=b;b=(g[k>>2]=j*+g[a>>2]+l*+g[a+36>>2]+m*+g[a+72>>2],c[k>>2]|0);a=0|b;b=(g[k>>2]=p,c[k>>2]|0)|0;c[e>>2]=a;c[e+4>>2]=b;e=d;c[e>>2]=a;c[e+4>>2]=b;return}else{aK(5243036,236,5247044,5245900)}}function bA(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;b=a+16|0;d=c[b>>2]|0;if((d|0)==-1){e=a+8|0;f=c[e>>2]|0;g=a+12|0;if((f|0)!=(c[g>>2]|0)){aK(5245724,61,5249936,5246336)}h=a+4|0;i=c[h>>2]|0;c[g>>2]=f<<1;j=dr(f*72&-1)|0;c[h>>2]=j;f=i;dw(j|0,f|0,(c[e>>2]|0)*36&-1|0);ds(f);f=c[e>>2]|0;j=(c[g>>2]|0)-1|0;L606:do{if((f|0)<(j|0)){i=f;while(1){k=i+1|0;c[(c[h>>2]|0)+(i*36&-1)+20>>2]=k;c[(c[h>>2]|0)+(i*36&-1)+32>>2]=-1;l=(c[g>>2]|0)-1|0;if((k|0)<(l|0)){i=k}else{m=l;break L606}}}else{m=j}}while(0);c[(c[h>>2]|0)+(m*36&-1)+20>>2]=-1;c[(c[h>>2]|0)+(((c[g>>2]|0)-1|0)*36&-1)+32>>2]=-1;g=c[e>>2]|0;c[b>>2]=g;n=g;o=h;p=e}else{n=d;o=a+4|0;p=a+8|0}a=(c[o>>2]|0)+(n*36&-1)+20|0;c[b>>2]=c[a>>2]|0;c[a>>2]=-1;c[(c[o>>2]|0)+(n*36&-1)+24>>2]=-1;c[(c[o>>2]|0)+(n*36&-1)+28>>2]=-1;c[(c[o>>2]|0)+(n*36&-1)+32>>2]=0;c[(c[o>>2]|0)+(n*36&-1)+16>>2]=0;c[p>>2]=(c[p>>2]|0)+1|0;return n|0}function bB(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0.0,j=0.0,l=0.0,m=0.0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0,G=0,H=0;d=a+24|0;c[d>>2]=(c[d>>2]|0)+1|0;d=a|0;e=c[d>>2]|0;if((e|0)==-1){c[d>>2]=b;c[(c[a+4>>2]|0)+(b*36&-1)+20>>2]=-1;return}f=a+4|0;h=c[f>>2]|0;i=+g[h+(b*36&-1)>>2];j=+g[h+(b*36&-1)+4>>2];l=+g[h+(b*36&-1)+8>>2];m=+g[h+(b*36&-1)+12>>2];n=c[h+(e*36&-1)+24>>2]|0;L616:do{if((n|0)==-1){o=e}else{p=e;q=n;while(1){r=c[h+(p*36&-1)+28>>2]|0;s=+g[h+(p*36&-1)+8>>2];t=+g[h+(p*36&-1)>>2];u=+g[h+(p*36&-1)+12>>2];v=+g[h+(p*36&-1)+4>>2];w=((s>l?s:l)-(t<i?t:i)+((u>m?u:m)-(v<j?v:j)))*2.0;x=w*2.0;y=(w-(s-t+(u-v))*2.0)*2.0;v=+g[h+(q*36&-1)>>2];u=i<v?i:v;t=+g[h+(q*36&-1)+4>>2];s=j<t?j:t;w=+g[h+(q*36&-1)+8>>2];z=l>w?l:w;A=+g[h+(q*36&-1)+12>>2];B=m>A?m:A;if((c[h+(q*36&-1)+24>>2]|0)==-1){C=(z-u+(B-s))*2.0}else{C=(z-u+(B-s))*2.0-(w-v+(A-t))*2.0}t=y+C;A=+g[h+(r*36&-1)>>2];v=i<A?i:A;w=+g[h+(r*36&-1)+4>>2];s=j<w?j:w;B=+g[h+(r*36&-1)+8>>2];u=l>B?l:B;z=+g[h+(r*36&-1)+12>>2];D=m>z?m:z;if((c[h+(r*36&-1)+24>>2]|0)==-1){E=(u-v+(D-s))*2.0}else{E=(u-v+(D-s))*2.0-(B-A+(z-w))*2.0}w=y+E;if(x<t&x<w){o=p;break L616}F=t<w?q:r;r=c[h+(F*36&-1)+24>>2]|0;if((r|0)==-1){o=F;break L616}else{p=F;q=r}}}}while(0);n=c[h+(o*36&-1)+20>>2]|0;h=bA(a)|0;c[(c[f>>2]|0)+(h*36&-1)+20>>2]=n;c[(c[f>>2]|0)+(h*36&-1)+16>>2]=0;e=c[f>>2]|0;E=+g[e+(o*36&-1)>>2];C=+g[e+(o*36&-1)+4>>2];q=e+(h*36&-1)|0;p=(g[k>>2]=i<E?i:E,c[k>>2]|0);r=(g[k>>2]=j<C?j:C,c[k>>2]|0)|0;c[q>>2]=0|p;c[q+4>>2]=r;C=+g[e+(o*36&-1)+8>>2];j=+g[e+(o*36&-1)+12>>2];r=e+(h*36&-1)+8|0;e=(g[k>>2]=l>C?l:C,c[k>>2]|0);q=(g[k>>2]=m>j?m:j,c[k>>2]|0)|0;c[r>>2]=0|e;c[r+4>>2]=q;q=c[f>>2]|0;c[q+(h*36&-1)+32>>2]=(c[q+(o*36&-1)+32>>2]|0)+1|0;q=c[f>>2]|0;if((n|0)==-1){c[q+(h*36&-1)+24>>2]=o;c[(c[f>>2]|0)+(h*36&-1)+28>>2]=b;c[(c[f>>2]|0)+(o*36&-1)+20>>2]=h;c[(c[f>>2]|0)+(b*36&-1)+20>>2]=h;c[d>>2]=h}else{d=q+(n*36&-1)+24|0;if((c[d>>2]|0)==(o|0)){c[d>>2]=h}else{c[q+(n*36&-1)+28>>2]=h}c[(c[f>>2]|0)+(h*36&-1)+24>>2]=o;c[(c[f>>2]|0)+(h*36&-1)+28>>2]=b;c[(c[f>>2]|0)+(o*36&-1)+20>>2]=h;c[(c[f>>2]|0)+(b*36&-1)+20>>2]=h}h=c[(c[f>>2]|0)+(b*36&-1)+20>>2]|0;if((h|0)==-1){return}else{G=h}while(1){h=bE(a,G)|0;b=c[f>>2]|0;o=c[b+(h*36&-1)+24>>2]|0;n=c[b+(h*36&-1)+28>>2]|0;if((o|0)==-1){H=487;break}if((n|0)==-1){H=489;break}q=c[b+(o*36&-1)+32>>2]|0;d=c[b+(n*36&-1)+32>>2]|0;c[b+(h*36&-1)+32>>2]=((q|0)>(d|0)?q:d)+1|0;d=c[f>>2]|0;j=+g[d+(o*36&-1)>>2];m=+g[d+(n*36&-1)>>2];C=+g[d+(o*36&-1)+4>>2];l=+g[d+(n*36&-1)+4>>2];q=d+(h*36&-1)|0;b=(g[k>>2]=j<m?j:m,c[k>>2]|0);r=(g[k>>2]=C<l?C:l,c[k>>2]|0)|0;c[q>>2]=0|b;c[q+4>>2]=r;l=+g[d+(o*36&-1)+8>>2];C=+g[d+(n*36&-1)+8>>2];m=+g[d+(o*36&-1)+12>>2];j=+g[d+(n*36&-1)+12>>2];n=d+(h*36&-1)+8|0;d=(g[k>>2]=l>C?l:C,c[k>>2]|0);o=(g[k>>2]=m>j?m:j,c[k>>2]|0)|0;c[n>>2]=0|d;c[n+4>>2]=o;o=c[(c[f>>2]|0)+(h*36&-1)+20>>2]|0;if((o|0)==-1){H=494;break}else{G=o}}if((H|0)==487){aK(5245724,307,5249972,5243352)}else if((H|0)==489){aK(5245724,308,5249972,5243176)}else if((H|0)==494){return}}function bC(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0,j=0,l=0,m=0.0,n=0.0,o=0.0,p=0.0,q=0;d=a|0;if((c[d>>2]|0)==(b|0)){c[d>>2]=-1;return}e=a+4|0;f=c[e>>2]|0;h=c[f+(b*36&-1)+20>>2]|0;i=c[f+(h*36&-1)+20>>2]|0;j=c[f+(h*36&-1)+24>>2]|0;if((j|0)==(b|0)){l=c[f+(h*36&-1)+28>>2]|0}else{l=j}if((i|0)==-1){c[d>>2]=l;c[f+(l*36&-1)+20>>2]=-1;if((h|0)<=-1){aK(5245724,97,5249864,5245376)}if((c[a+12>>2]|0)<=(h|0)){aK(5245724,97,5249864,5245376)}d=a+8|0;if((c[d>>2]|0)<=0){aK(5245724,98,5249864,5244276)}j=a+16|0;c[(c[e>>2]|0)+(h*36&-1)+20>>2]=c[j>>2]|0;c[(c[e>>2]|0)+(h*36&-1)+32>>2]=-1;c[j>>2]=h;c[d>>2]=(c[d>>2]|0)-1|0;return}d=f+(i*36&-1)+24|0;if((c[d>>2]|0)==(h|0)){c[d>>2]=l}else{c[f+(i*36&-1)+28>>2]=l}c[(c[e>>2]|0)+(l*36&-1)+20>>2]=i;if((h|0)<=-1){aK(5245724,97,5249864,5245376)}if((c[a+12>>2]|0)<=(h|0)){aK(5245724,97,5249864,5245376)}l=a+8|0;if((c[l>>2]|0)<=0){aK(5245724,98,5249864,5244276)}f=a+16|0;c[(c[e>>2]|0)+(h*36&-1)+20>>2]=c[f>>2]|0;c[(c[e>>2]|0)+(h*36&-1)+32>>2]=-1;c[f>>2]=h;c[l>>2]=(c[l>>2]|0)-1|0;l=i;while(1){i=bE(a,l)|0;h=c[e>>2]|0;f=c[h+(i*36&-1)+24>>2]|0;d=c[h+(i*36&-1)+28>>2]|0;m=+g[h+(f*36&-1)>>2];n=+g[h+(d*36&-1)>>2];o=+g[h+(f*36&-1)+4>>2];p=+g[h+(d*36&-1)+4>>2];j=h+(i*36&-1)|0;b=(g[k>>2]=m<n?m:n,c[k>>2]|0);q=(g[k>>2]=o<p?o:p,c[k>>2]|0)|0;c[j>>2]=0|b;c[j+4>>2]=q;p=+g[h+(f*36&-1)+8>>2];o=+g[h+(d*36&-1)+8>>2];n=+g[h+(f*36&-1)+12>>2];m=+g[h+(d*36&-1)+12>>2];q=h+(i*36&-1)+8|0;h=(g[k>>2]=p>o?p:o,c[k>>2]|0);j=(g[k>>2]=n>m?n:m,c[k>>2]|0)|0;c[q>>2]=0|h;c[q+4>>2]=j;j=c[e>>2]|0;q=c[j+(f*36&-1)+32>>2]|0;f=c[j+(d*36&-1)+32>>2]|0;c[j+(i*36&-1)+32>>2]=((q|0)>(f|0)?q:f)+1|0;f=c[(c[e>>2]|0)+(i*36&-1)+20>>2]|0;if((f|0)==-1){break}else{l=f}}return}function bD(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,i=0,j=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0;if((b|0)<=-1){aK(5245724,135,5249792,5245416)}if((c[a+12>>2]|0)<=(b|0)){aK(5245724,135,5249792,5245416)}f=a+4|0;h=c[f>>2]|0;if((c[h+(b*36&-1)+24>>2]|0)!=-1){aK(5245724,137,5249792,5243572)}do{if(+g[h+(b*36&-1)>>2]<=+g[d>>2]){if(+g[h+(b*36&-1)+4>>2]>+g[d+4>>2]){break}if(+g[d+8>>2]>+g[h+(b*36&-1)+8>>2]){break}if(+g[d+12>>2]>+g[h+(b*36&-1)+12>>2]){break}else{i=0}return i|0}}while(0);bC(a,b);h=d;j=c[h+4>>2]|0;l=(c[k>>2]=c[h>>2]|0,+g[k>>2]);m=(c[k>>2]=j,+g[k>>2]);j=d+8|0;d=c[j+4>>2]|0;n=(c[k>>2]=c[j>>2]|0,+g[k>>2]);o=l+-.10000000149011612;l=m+-.10000000149011612;m=n+.10000000149011612;n=(c[k>>2]=d,+g[k>>2])+.10000000149011612;p=+g[e>>2]*2.0;q=+g[e+4>>2]*2.0;if(p<0.0){r=m;s=o+p}else{r=p+m;s=o}if(q<0.0){t=n;u=l+q}else{t=q+n;u=l}e=c[f>>2]|0;f=e+(b*36&-1)|0;d=(g[k>>2]=s,c[k>>2]|0);j=(g[k>>2]=u,c[k>>2]|0)|0;c[f>>2]=0|d;c[f+4>>2]=j;j=e+(b*36&-1)+8|0;e=(g[k>>2]=r,c[k>>2]|0);f=(g[k>>2]=t,c[k>>2]|0)|0;c[j>>2]=0|e;c[j+4>>2]=f;bB(a,b);i=1;return i|0}function bE(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0.0,D=0.0,E=0.0,F=0,G=0,H=0.0,I=0.0,J=0,K=0;if((b|0)==-1){aK(5245724,382,5249900,5243024)}d=a+4|0;e=c[d>>2]|0;f=e+(b*36&-1)|0;h=e+(b*36&-1)+24|0;i=c[h>>2]|0;if((i|0)==-1){j=b;return j|0}l=e+(b*36&-1)+32|0;if((c[l>>2]|0)<2){j=b;return j|0}m=e+(b*36&-1)+28|0;n=c[m>>2]|0;if((i|0)<=-1){aK(5245724,392,5249900,5242952)}o=c[a+12>>2]|0;if((i|0)>=(o|0)){aK(5245724,392,5249900,5242952)}if(!((n|0)>-1&(n|0)<(o|0))){aK(5245724,393,5249900,5246420)}p=e+(i*36&-1)|0;q=e+(n*36&-1)|0;r=e+(n*36&-1)+32|0;s=e+(i*36&-1)+32|0;t=(c[r>>2]|0)-(c[s>>2]|0)|0;if((t|0)>1){u=e+(n*36&-1)+24|0;v=c[u>>2]|0;w=e+(n*36&-1)+28|0;x=c[w>>2]|0;y=e+(v*36&-1)|0;z=e+(x*36&-1)|0;if(!((v|0)>-1&(v|0)<(o|0))){aK(5245724,407,5249900,5246388)}if(!((x|0)>-1&(x|0)<(o|0))){aK(5245724,408,5249900,5246232)}c[u>>2]=b;u=e+(b*36&-1)+20|0;A=e+(n*36&-1)+20|0;c[A>>2]=c[u>>2]|0;c[u>>2]=n;u=c[A>>2]|0;do{if((u|0)==-1){c[a>>2]=n}else{A=c[d>>2]|0;B=A+(u*36&-1)+24|0;if((c[B>>2]|0)==(b|0)){c[B>>2]=n;break}B=A+(u*36&-1)+28|0;if((c[B>>2]|0)==(b|0)){c[B>>2]=n;break}else{aK(5245724,424,5249900,5245952)}}}while(0);u=e+(v*36&-1)+32|0;B=e+(x*36&-1)+32|0;if((c[u>>2]|0)>(c[B>>2]|0)){c[w>>2]=v;c[m>>2]=x;c[e+(x*36&-1)+20>>2]=b;C=+g[p>>2];D=+g[z>>2];E=C<D?C:D;D=+g[e+(i*36&-1)+4>>2];C=+g[e+(x*36&-1)+4>>2];A=f;F=(g[k>>2]=E,c[k>>2]|0);G=(g[k>>2]=D<C?D:C,c[k>>2]|0)|0;c[A>>2]=0|F;c[A+4>>2]=G;C=+g[e+(i*36&-1)+8>>2];D=+g[e+(x*36&-1)+8>>2];H=+g[e+(i*36&-1)+12>>2];I=+g[e+(x*36&-1)+12>>2];G=e+(b*36&-1)+8|0;A=(g[k>>2]=C>D?C:D,c[k>>2]|0);F=(g[k>>2]=H>I?H:I,c[k>>2]|0)|0;c[G>>2]=0|A;c[G+4>>2]=F;I=+g[y>>2];H=+g[e+(b*36&-1)+4>>2];D=+g[e+(v*36&-1)+4>>2];F=q;G=(g[k>>2]=E<I?E:I,c[k>>2]|0);A=(g[k>>2]=H<D?H:D,c[k>>2]|0)|0;c[F>>2]=0|G;c[F+4>>2]=A;D=+g[e+(b*36&-1)+8>>2];H=+g[e+(v*36&-1)+8>>2];I=+g[e+(b*36&-1)+12>>2];E=+g[e+(v*36&-1)+12>>2];A=e+(n*36&-1)+8|0;F=(g[k>>2]=D>H?D:H,c[k>>2]|0);G=(g[k>>2]=I>E?I:E,c[k>>2]|0)|0;c[A>>2]=0|F;c[A+4>>2]=G;G=c[s>>2]|0;A=c[B>>2]|0;F=((G|0)>(A|0)?G:A)+1|0;c[l>>2]=F;A=c[u>>2]|0;J=(F|0)>(A|0)?F:A}else{c[w>>2]=x;c[m>>2]=v;c[e+(v*36&-1)+20>>2]=b;E=+g[p>>2];I=+g[y>>2];H=E<I?E:I;I=+g[e+(i*36&-1)+4>>2];E=+g[e+(v*36&-1)+4>>2];y=f;m=(g[k>>2]=H,c[k>>2]|0);w=(g[k>>2]=I<E?I:E,c[k>>2]|0)|0;c[y>>2]=0|m;c[y+4>>2]=w;E=+g[e+(i*36&-1)+8>>2];I=+g[e+(v*36&-1)+8>>2];D=+g[e+(i*36&-1)+12>>2];C=+g[e+(v*36&-1)+12>>2];v=e+(b*36&-1)+8|0;w=(g[k>>2]=E>I?E:I,c[k>>2]|0);y=(g[k>>2]=D>C?D:C,c[k>>2]|0)|0;c[v>>2]=0|w;c[v+4>>2]=y;C=+g[z>>2];D=+g[e+(b*36&-1)+4>>2];I=+g[e+(x*36&-1)+4>>2];z=q;y=(g[k>>2]=H<C?H:C,c[k>>2]|0);v=(g[k>>2]=D<I?D:I,c[k>>2]|0)|0;c[z>>2]=0|y;c[z+4>>2]=v;I=+g[e+(b*36&-1)+8>>2];D=+g[e+(x*36&-1)+8>>2];C=+g[e+(b*36&-1)+12>>2];H=+g[e+(x*36&-1)+12>>2];x=e+(n*36&-1)+8|0;v=(g[k>>2]=I>D?I:D,c[k>>2]|0);z=(g[k>>2]=C>H?C:H,c[k>>2]|0)|0;c[x>>2]=0|v;c[x+4>>2]=z;z=c[s>>2]|0;x=c[u>>2]|0;u=((z|0)>(x|0)?z:x)+1|0;c[l>>2]=u;x=c[B>>2]|0;J=(u|0)>(x|0)?u:x}c[r>>2]=J+1|0;j=n;return j|0}if((t|0)>=-1){j=b;return j|0}t=e+(i*36&-1)+24|0;J=c[t>>2]|0;x=e+(i*36&-1)+28|0;u=c[x>>2]|0;B=e+(J*36&-1)|0;z=e+(u*36&-1)|0;if(!((J|0)>-1&(J|0)<(o|0))){aK(5245724,467,5249900,5245848)}if(!((u|0)>-1&(u|0)<(o|0))){aK(5245724,468,5249900,5245772)}c[t>>2]=b;t=e+(b*36&-1)+20|0;o=e+(i*36&-1)+20|0;c[o>>2]=c[t>>2]|0;c[t>>2]=i;t=c[o>>2]|0;do{if((t|0)==-1){c[a>>2]=i}else{o=c[d>>2]|0;v=o+(t*36&-1)+24|0;if((c[v>>2]|0)==(b|0)){c[v>>2]=i;break}v=o+(t*36&-1)+28|0;if((c[v>>2]|0)==(b|0)){c[v>>2]=i;break}else{aK(5245724,484,5249900,5245692)}}}while(0);t=e+(J*36&-1)+32|0;d=e+(u*36&-1)+32|0;if((c[t>>2]|0)>(c[d>>2]|0)){c[x>>2]=J;c[h>>2]=u;c[e+(u*36&-1)+20>>2]=b;H=+g[q>>2];C=+g[z>>2];D=H<C?H:C;C=+g[e+(n*36&-1)+4>>2];H=+g[e+(u*36&-1)+4>>2];a=f;v=(g[k>>2]=D,c[k>>2]|0);o=(g[k>>2]=C<H?C:H,c[k>>2]|0)|0;c[a>>2]=0|v;c[a+4>>2]=o;H=+g[e+(n*36&-1)+8>>2];C=+g[e+(u*36&-1)+8>>2];I=+g[e+(n*36&-1)+12>>2];E=+g[e+(u*36&-1)+12>>2];o=e+(b*36&-1)+8|0;a=(g[k>>2]=H>C?H:C,c[k>>2]|0);v=(g[k>>2]=I>E?I:E,c[k>>2]|0)|0;c[o>>2]=0|a;c[o+4>>2]=v;E=+g[B>>2];I=+g[e+(b*36&-1)+4>>2];C=+g[e+(J*36&-1)+4>>2];v=p;o=(g[k>>2]=D<E?D:E,c[k>>2]|0);a=(g[k>>2]=I<C?I:C,c[k>>2]|0)|0;c[v>>2]=0|o;c[v+4>>2]=a;C=+g[e+(b*36&-1)+8>>2];I=+g[e+(J*36&-1)+8>>2];E=+g[e+(b*36&-1)+12>>2];D=+g[e+(J*36&-1)+12>>2];a=e+(i*36&-1)+8|0;v=(g[k>>2]=C>I?C:I,c[k>>2]|0);o=(g[k>>2]=E>D?E:D,c[k>>2]|0)|0;c[a>>2]=0|v;c[a+4>>2]=o;o=c[r>>2]|0;a=c[d>>2]|0;v=((o|0)>(a|0)?o:a)+1|0;c[l>>2]=v;a=c[t>>2]|0;K=(v|0)>(a|0)?v:a}else{c[x>>2]=u;c[h>>2]=J;c[e+(J*36&-1)+20>>2]=b;D=+g[q>>2];E=+g[B>>2];I=D<E?D:E;E=+g[e+(n*36&-1)+4>>2];D=+g[e+(J*36&-1)+4>>2];B=f;f=(g[k>>2]=I,c[k>>2]|0);q=(g[k>>2]=E<D?E:D,c[k>>2]|0)|0;c[B>>2]=0|f;c[B+4>>2]=q;D=+g[e+(n*36&-1)+8>>2];E=+g[e+(J*36&-1)+8>>2];C=+g[e+(n*36&-1)+12>>2];H=+g[e+(J*36&-1)+12>>2];J=e+(b*36&-1)+8|0;n=(g[k>>2]=D>E?D:E,c[k>>2]|0);q=(g[k>>2]=C>H?C:H,c[k>>2]|0)|0;c[J>>2]=0|n;c[J+4>>2]=q;H=+g[z>>2];C=+g[e+(b*36&-1)+4>>2];E=+g[e+(u*36&-1)+4>>2];z=p;p=(g[k>>2]=I<H?I:H,c[k>>2]|0);q=(g[k>>2]=C<E?C:E,c[k>>2]|0)|0;c[z>>2]=0|p;c[z+4>>2]=q;E=+g[e+(b*36&-1)+8>>2];C=+g[e+(u*36&-1)+8>>2];H=+g[e+(b*36&-1)+12>>2];I=+g[e+(u*36&-1)+12>>2];u=e+(i*36&-1)+8|0;e=(g[k>>2]=E>C?E:C,c[k>>2]|0);b=(g[k>>2]=H>I?H:I,c[k>>2]|0)|0;c[u>>2]=0|e;c[u+4>>2]=b;b=c[r>>2]|0;r=c[t>>2]|0;t=((b|0)>(r|0)?b:r)+1|0;c[l>>2]=t;l=c[d>>2]|0;K=(t|0)>(l|0)?t:l}c[s>>2]=K+1|0;j=i;return j|0}function bF(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0.0,y=0.0,z=0,A=0,B=0.0,C=0.0,D=0,E=0.0,F=0.0,G=0,H=0,I=0,J=0,K=0,M=0,N=0,O=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0.0,$=0.0,aa=0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0.0,ag=0.0,ah=0.0,ai=0.0,aj=0.0,ak=0.0,al=0.0,am=0.0,an=0,ao=0,ap=0,aq=0.0,ar=0,as=0.0,at=0.0,au=0,av=0.0,aw=0.0,ax=0.0,ay=0.0,az=0,aA=0.0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0;f=i;i=i+308|0;h=f|0;j=f+36|0;l=f+72|0;m=f+84|0;n=f+176|0;o=f+200|0;p=f+300|0;q=f+304|0;c[1310730]=(c[1310730]|0)+1|0;r=d|0;c[r>>2]=0;s=e+128|0;t=d+4|0;g[t>>2]=+g[s>>2];d=e|0;u=e+28|0;dw(h|0,e+56|0,36);dw(j|0,e+92|0,36);v=h+24|0;w=+g[v>>2];x=+L(+(w/6.2831854820251465))*6.2831854820251465;y=w-x;g[v>>2]=y;z=h+28|0;w=+g[z>>2]-x;g[z>>2]=w;A=j+24|0;x=+g[A>>2];B=+L(+(x/6.2831854820251465))*6.2831854820251465;C=x-B;g[A>>2]=C;D=j+28|0;x=+g[D>>2]-B;g[D>>2]=x;B=+g[s>>2];E=+g[e+24>>2]+ +g[e+52>>2]+-.014999999664723873;F=E<.004999999888241291?.004999999888241291:E;if(F<=.0012499999720603228){aK(5244124,280,5250404,5245880)}b[l+4>>1]=0;dw(m|0,e|0,28);dw(m+28|0,u|0,28);a[m+88|0]=0;e=h+8|0;s=h+12|0;G=h+16|0;H=h+20|0;I=h|0;J=h+4|0;K=j+8|0;M=j+12|0;N=j+16|0;O=j+20|0;R=j|0;S=j+4|0;T=m+56|0;U=m+64|0;V=m+68|0;W=m+72|0;X=m+80|0;Y=m+84|0;Z=n+16|0;E=F+.0012499999720603228;_=F+-.0012499999720603228;$=0.0;aa=0;ab=y;y=w;w=C;C=x;L780:while(1){x=1.0-$;ac=x*+g[e>>2]+$*+g[G>>2];ad=x*+g[s>>2]+$*+g[H>>2];ae=x*ab+$*y;af=+Q(+ae);ag=+P(+ae);ae=+g[I>>2];ah=+g[J>>2];ai=x*+g[K>>2]+$*+g[N>>2];aj=x*+g[M>>2]+$*+g[O>>2];ak=x*w+$*C;x=+Q(+ak);al=+P(+ak);ak=+g[R>>2];am=+g[S>>2];an=(g[k>>2]=ac-(ag*ae-af*ah),c[k>>2]|0);ao=(g[k>>2]=ad-(af*ae+ag*ah),c[k>>2]|0)|0;c[T>>2]=0|an;c[T+4>>2]=ao;g[U>>2]=af;g[V>>2]=ag;ao=(g[k>>2]=ai-(al*ak-x*am),c[k>>2]|0);an=(g[k>>2]=aj-(x*ak+al*am),c[k>>2]|0)|0;c[W>>2]=0|ao;c[W+4>>2]=an;g[X>>2]=x;g[Y>>2]=al;bx(n,l,m);al=+g[Z>>2];if(al<=0.0){ap=598;break}if(al<E){ap=600;break}bG(o,l,d,h,u,j,$);an=0;al=B;while(1){x=+bK(o,p,q,al);if(x>E){ap=603;break L780}if(x>_){aq=al;break}ao=c[p>>2]|0;ar=c[q>>2]|0;am=+bL(o,ao,ar,$);if(am<_){ap=606;break L780}if(am>E){as=al;at=$;au=0;av=am;aw=x}else{ap=608;break L780}while(1){if((au&1|0)==0){ax=(at+as)*.5}else{ax=at+(F-av)*(as-at)/(aw-av)}x=+bL(o,ao,ar,ax);am=x-F;if(am>0.0){ay=am}else{ay=-0.0-am}if(ay<.0012499999720603228){az=au;aA=ax;break}aB=x>F;aC=au+1|0;c[1310726]=(c[1310726]|0)+1|0;if((aC|0)==50){az=50;aA=al;break}else{as=aB?as:ax;at=aB?ax:at;au=aC;av=aB?x:av;aw=aB?aw:x}}ar=c[1310727]|0;c[1310727]=(ar|0)>(az|0)?ar:az;ar=an+1|0;if((ar|0)==8){aq=$;break}else{an=ar;al=aA}}an=aa+1|0;c[1310729]=(c[1310729]|0)+1|0;if((an|0)==20){ap=620;break}$=aq;aa=an;ab=+g[v>>2];y=+g[z>>2];w=+g[A>>2];C=+g[D>>2]}if((ap|0)==608){c[r>>2]=3;g[t>>2]=$}else if((ap|0)==606){c[r>>2]=1;g[t>>2]=$}else if((ap|0)==603){c[r>>2]=4;g[t>>2]=B}else if((ap|0)==598){c[r>>2]=2;g[t>>2]=0.0;aD=aa;aE=c[1310728]|0;aF=(aE|0)>(aD|0);aG=aF?aE:aD;c[1310728]=aG;i=f;return}else if((ap|0)==600){c[r>>2]=3;g[t>>2]=$;aD=aa;aE=c[1310728]|0;aF=(aE|0)>(aD|0);aG=aF?aE:aD;c[1310728]=aG;i=f;return}else if((ap|0)==620){c[r>>2]=1;g[t>>2]=aq;aD=20;aE=c[1310728]|0;aF=(aE|0)>(aD|0);aG=aF?aE:aD;c[1310728]=aG;i=f;return}c[1310729]=(c[1310729]|0)+1|0;aD=aa+1|0;aE=c[1310728]|0;aF=(aE|0)>(aD|0);aG=aF?aE:aD;c[1310728]=aG;i=f;return}function bG(e,f,h,i,j,l,m){e=e|0;f=f|0;h=h|0;i=i|0;j=j|0;l=l|0;m=+m;var n=0,o=0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0,E=0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0;c[e>>2]=h;c[e+4>>2]=j;n=b[f+4>>1]|0;if(!(n<<16>>16!=0&(n&65535)<3)){aK(5244124,50,5249052,5243528)}o=e+8|0;dw(o|0,i|0,36);i=e+44|0;dw(i|0,l|0,36);p=1.0-m;q=p*+g[e+16>>2]+ +g[e+24>>2]*m;r=p*+g[e+20>>2]+ +g[e+28>>2]*m;s=p*+g[e+32>>2]+ +g[e+36>>2]*m;t=+Q(+s);u=+P(+s);s=+g[o>>2];v=+g[e+12>>2];w=q-(u*s-t*v);q=r-(t*s+u*v);v=p*+g[e+52>>2]+ +g[e+60>>2]*m;s=p*+g[e+56>>2]+ +g[e+64>>2]*m;r=p*+g[e+68>>2]+ +g[e+72>>2]*m;m=+Q(+r);p=+P(+r);r=+g[i>>2];x=+g[e+48>>2];y=v-(p*r-m*x);v=s-(m*r+p*x);if(n<<16>>16==1){c[e+80>>2]=0;n=d[f+6|0]|0;if((c[h+20>>2]|0)<=(n|0)){aK(5244292,103,5247300,5243944)}i=(c[h+16>>2]|0)+(n<<3)|0;n=c[i+4>>2]|0;x=(c[k>>2]=c[i>>2]|0,+g[k>>2]);r=(c[k>>2]=n,+g[k>>2]);n=d[f+9|0]|0;if((c[j+20>>2]|0)<=(n|0)){aK(5244292,103,5247300,5243944)}i=(c[j+16>>2]|0)+(n<<3)|0;n=c[i+4>>2]|0;s=(c[k>>2]=c[i>>2]|0,+g[k>>2]);z=(c[k>>2]=n,+g[k>>2]);n=e+92|0;A=y+(p*s-m*z)-(w+(u*x-t*r));B=v+(m*s+p*z)-(q+(t*x+u*r));i=n;o=(g[k>>2]=A,c[k>>2]|0);l=(g[k>>2]=B,c[k>>2]|0)|0;c[i>>2]=0|o;c[i+4>>2]=l;r=+N(+(A*A+B*B));if(r<1.1920928955078125e-7){C=0.0;return+C}x=1.0/r;g[n>>2]=A*x;g[e+96>>2]=B*x;C=r;return+C}n=f+6|0;l=f+7|0;i=e+80|0;if(a[n]<<24>>24==a[l]<<24>>24){c[i>>2]=2;o=d[f+9|0]|0;D=c[j+20>>2]|0;if((D|0)<=(o|0)){aK(5244292,103,5247300,5243944)}E=c[j+16>>2]|0;F=E+(o<<3)|0;o=c[F+4>>2]|0;r=(c[k>>2]=c[F>>2]|0,+g[k>>2]);x=(c[k>>2]=o,+g[k>>2]);o=d[f+10|0]|0;if((D|0)<=(o|0)){aK(5244292,103,5247300,5243944)}D=E+(o<<3)|0;o=c[D+4>>2]|0;B=(c[k>>2]=c[D>>2]|0,+g[k>>2]);A=(c[k>>2]=o,+g[k>>2]);o=e+92|0;z=A-x;s=(B-r)*-1.0;D=o;E=(g[k>>2]=z,c[k>>2]|0);F=(g[k>>2]=s,c[k>>2]|0)|0;c[D>>2]=0|E;c[D+4>>2]=F;G=+N(+(z*z+s*s));if(G<1.1920928955078125e-7){H=z;I=s}else{J=1.0/G;G=z*J;g[o>>2]=G;z=s*J;g[e+96>>2]=z;H=G;I=z}z=(r+B)*.5;B=(x+A)*.5;o=e+84|0;F=(g[k>>2]=z,c[k>>2]|0);E=(g[k>>2]=B,c[k>>2]|0)|0;c[o>>2]=0|F;c[o+4>>2]=E;E=d[n]|0;if((c[h+20>>2]|0)<=(E|0)){aK(5244292,103,5247300,5243944)}o=(c[h+16>>2]|0)+(E<<3)|0;E=c[o+4>>2]|0;A=(c[k>>2]=c[o>>2]|0,+g[k>>2]);x=(c[k>>2]=E,+g[k>>2]);r=(p*H-m*I)*(w+(u*A-t*x)-(y+(p*z-m*B)))+(m*H+p*I)*(q+(t*A+u*x)-(v+(m*z+p*B)));if(r>=0.0){C=r;return+C}E=(g[k>>2]=-0.0-H,c[k>>2]|0);o=(g[k>>2]=-0.0-I,c[k>>2]|0)|0;c[D>>2]=0|E;c[D+4>>2]=o;C=-0.0-r;return+C}else{c[i>>2]=1;i=d[n]|0;n=c[h+20>>2]|0;if((n|0)<=(i|0)){aK(5244292,103,5247300,5243944)}o=c[h+16>>2]|0;h=o+(i<<3)|0;i=c[h+4>>2]|0;r=(c[k>>2]=c[h>>2]|0,+g[k>>2]);I=(c[k>>2]=i,+g[k>>2]);i=d[l]|0;if((n|0)<=(i|0)){aK(5244292,103,5247300,5243944)}n=o+(i<<3)|0;i=c[n+4>>2]|0;H=(c[k>>2]=c[n>>2]|0,+g[k>>2]);B=(c[k>>2]=i,+g[k>>2]);i=e+92|0;z=B-I;x=(H-r)*-1.0;n=i;o=(g[k>>2]=z,c[k>>2]|0);l=(g[k>>2]=x,c[k>>2]|0)|0;c[n>>2]=0|o;c[n+4>>2]=l;A=+N(+(z*z+x*x));if(A<1.1920928955078125e-7){K=z;L=x}else{G=1.0/A;A=z*G;g[i>>2]=A;z=x*G;g[e+96>>2]=z;K=A;L=z}z=(r+H)*.5;H=(I+B)*.5;i=e+84|0;e=(g[k>>2]=z,c[k>>2]|0);l=(g[k>>2]=H,c[k>>2]|0)|0;c[i>>2]=0|e;c[i+4>>2]=l;l=d[f+9|0]|0;if((c[j+20>>2]|0)<=(l|0)){aK(5244292,103,5247300,5243944)}f=(c[j+16>>2]|0)+(l<<3)|0;l=c[f+4>>2]|0;B=(c[k>>2]=c[f>>2]|0,+g[k>>2]);I=(c[k>>2]=l,+g[k>>2]);r=(u*K-t*L)*(y+(p*B-m*I)-(w+(u*z-t*H)))+(t*K+u*L)*(v+(m*B+p*I)-(q+(t*z+u*H)));if(r>=0.0){C=r;return+C}l=(g[k>>2]=-0.0-K,c[k>>2]|0);f=(g[k>>2]=-0.0-L,c[k>>2]|0)|0;c[n>>2]=0|l;c[n+4>>2]=f;C=-0.0-r;return+C}return 0.0}function bH(a){a=a|0;return 1}function bI(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function bJ(b,d){b=b|0;d=d|0;var e=0,f=0,h=0;e=bY(d,48)|0;if((e|0)==0){f=0}else{c[e>>2]=5250844;c[e+4>>2]=1;g[e+8>>2]=.009999999776482582;dx(e+28|0,0,18);f=e}c[f+4>>2]=c[b+4>>2]|0;g[f+8>>2]=+g[b+8>>2];e=b+12|0;d=f+12|0;h=c[e+4>>2]|0;c[d>>2]=c[e>>2]|0;c[d+4>>2]=h;h=b+20|0;d=f+20|0;e=c[h+4>>2]|0;c[d>>2]=c[h>>2]|0;c[d+4>>2]=e;e=b+28|0;d=f+28|0;h=c[e+4>>2]|0;c[d>>2]=c[e>>2]|0;c[d+4>>2]=h;h=b+36|0;d=f+36|0;e=c[h+4>>2]|0;c[d>>2]=c[h>>2]|0;c[d+4>>2]=e;a[f+44|0]=a[b+44|0]&1;a[f+45|0]=a[b+45|0]&1;return f|0}function bK(a,b,d,e){a=a|0;b=b|0;d=d|0;e=+e;var f=0.0,h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0.0,v=0.0,w=0.0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0.0,I=0.0,J=0.0,K=0,L=0,M=0,N=0;f=1.0-e;h=f*+g[a+16>>2]+ +g[a+24>>2]*e;i=f*+g[a+20>>2]+ +g[a+28>>2]*e;j=f*+g[a+32>>2]+ +g[a+36>>2]*e;l=+Q(+j);m=+P(+j);j=+g[a+8>>2];n=+g[a+12>>2];o=h-(m*j-l*n);h=i-(l*j+m*n);n=f*+g[a+52>>2]+ +g[a+60>>2]*e;j=f*+g[a+56>>2]+ +g[a+64>>2]*e;i=f*+g[a+68>>2]+ +g[a+72>>2]*e;e=+Q(+i);f=+P(+i);i=+g[a+44>>2];p=+g[a+48>>2];q=n-(f*i-e*p);n=j-(e*i+f*p);r=c[a+80>>2]|0;if((r|0)==0){s=a+92|0;p=+g[s>>2];t=a+96|0;i=+g[t>>2];j=m*p+l*i;u=p*(-0.0-l)+m*i;v=-0.0-i;i=f*(-0.0-p)+e*v;w=e*p+f*v;x=a|0;y=c[x>>2]|0;z=c[y+16>>2]|0;A=c[y+20>>2]|0;L875:do{if((A|0)>1){v=u*+g[z+4>>2]+j*+g[z>>2];y=1;B=0;while(1){p=j*+g[z+(y<<3)>>2]+u*+g[z+(y<<3)+4>>2];C=p>v;D=C?y:B;E=y+1|0;if((E|0)==(A|0)){F=D;break L875}else{v=C?p:v;y=E;B=D}}}else{F=0}}while(0);c[b>>2]=F;F=a+4|0;A=c[F>>2]|0;z=c[A+16>>2]|0;B=c[A+20>>2]|0;L880:do{if((B|0)>1){u=w*+g[z+4>>2]+i*+g[z>>2];A=1;y=0;while(1){j=i*+g[z+(A<<3)>>2]+w*+g[z+(A<<3)+4>>2];D=j>u;E=D?A:y;C=A+1|0;if((C|0)==(B|0)){G=E;break L880}else{u=D?j:u;A=C;y=E}}}else{G=0}}while(0);c[d>>2]=G;B=c[x>>2]|0;x=c[b>>2]|0;if((x|0)<=-1){aK(5244292,103,5247300,5243944)}if((c[B+20>>2]|0)<=(x|0)){aK(5244292,103,5247300,5243944)}z=(c[B+16>>2]|0)+(x<<3)|0;x=c[z+4>>2]|0;w=(c[k>>2]=c[z>>2]|0,+g[k>>2]);i=(c[k>>2]=x,+g[k>>2]);x=c[F>>2]|0;if((G|0)<=-1){aK(5244292,103,5247300,5243944)}if((c[x+20>>2]|0)<=(G|0)){aK(5244292,103,5247300,5243944)}F=(c[x+16>>2]|0)+(G<<3)|0;G=c[F+4>>2]|0;u=(c[k>>2]=c[F>>2]|0,+g[k>>2]);j=(c[k>>2]=G,+g[k>>2]);v=+g[s>>2]*(q+(f*u-e*j)-(o+(m*w-l*i)))+ +g[t>>2]*(n+(e*u+f*j)-(h+(l*w+m*i)));return+v}else if((r|0)==2){i=+g[a+92>>2];w=+g[a+96>>2];j=f*i-e*w;u=e*i+f*w;w=+g[a+84>>2];i=+g[a+88>>2];p=q+(f*w-e*i);H=n+(e*w+f*i);i=-0.0-u;w=m*(-0.0-j)+l*i;I=l*j+m*i;c[d>>2]=-1;t=a|0;s=c[t>>2]|0;G=c[s+16>>2]|0;F=c[s+20>>2]|0;do{if((F|0)>1){i=I*+g[G+4>>2]+w*+g[G>>2];s=1;x=0;while(1){J=w*+g[G+(s<<3)>>2]+I*+g[G+(s<<3)+4>>2];z=J>i;K=z?s:x;B=s+1|0;if((B|0)==(F|0)){break}else{i=z?J:i;s=B;x=K}}c[b>>2]=K;if((K|0)>-1){L=K;break}aK(5244292,103,5247300,5243944)}else{c[b>>2]=0;L=0}}while(0);K=c[t>>2]|0;if((c[K+20>>2]|0)<=(L|0)){aK(5244292,103,5247300,5243944)}t=(c[K+16>>2]|0)+(L<<3)|0;L=c[t+4>>2]|0;I=(c[k>>2]=c[t>>2]|0,+g[k>>2]);w=(c[k>>2]=L,+g[k>>2]);v=j*(o+(m*I-l*w)-p)+u*(h+(l*I+m*w)-H);return+v}else if((r|0)==1){H=+g[a+92>>2];w=+g[a+96>>2];I=m*H-l*w;u=l*H+m*w;w=+g[a+84>>2];H=+g[a+88>>2];p=o+(m*w-l*H);o=h+(l*w+m*H);H=-0.0-u;m=f*(-0.0-I)+e*H;w=e*I+f*H;c[b>>2]=-1;b=a+4|0;a=c[b>>2]|0;r=c[a+16>>2]|0;L=c[a+20>>2]|0;do{if((L|0)>1){H=w*+g[r+4>>2]+m*+g[r>>2];a=1;t=0;while(1){l=m*+g[r+(a<<3)>>2]+w*+g[r+(a<<3)+4>>2];K=l>H;M=K?a:t;F=a+1|0;if((F|0)==(L|0)){break}else{H=K?l:H;a=F;t=M}}c[d>>2]=M;if((M|0)>-1){N=M;break}aK(5244292,103,5247300,5243944)}else{c[d>>2]=0;N=0}}while(0);d=c[b>>2]|0;if((c[d+20>>2]|0)<=(N|0)){aK(5244292,103,5247300,5243944)}b=(c[d+16>>2]|0)+(N<<3)|0;N=c[b+4>>2]|0;w=(c[k>>2]=c[b>>2]|0,+g[k>>2]);m=(c[k>>2]=N,+g[k>>2]);v=I*(q+(f*w-e*m)-p)+u*(n+(e*w+f*m)-o);return+v}else{aK(5244124,183,5247216,5245900)}return 0.0}function bL(a,b,d,e){a=a|0;b=b|0;d=d|0;e=+e;var f=0.0,h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0.0,t=0,u=0,v=0.0,w=0.0,x=0.0;f=1.0-e;h=f*+g[a+16>>2]+ +g[a+24>>2]*e;i=f*+g[a+20>>2]+ +g[a+28>>2]*e;j=f*+g[a+32>>2]+ +g[a+36>>2]*e;l=+Q(+j);m=+P(+j);j=+g[a+8>>2];n=+g[a+12>>2];o=h-(m*j-l*n);h=i-(l*j+m*n);n=f*+g[a+52>>2]+ +g[a+60>>2]*e;j=f*+g[a+56>>2]+ +g[a+64>>2]*e;i=f*+g[a+68>>2]+ +g[a+72>>2]*e;e=+Q(+i);f=+P(+i);i=+g[a+44>>2];p=+g[a+48>>2];q=n-(f*i-e*p);n=j-(e*i+f*p);r=c[a+80>>2]|0;if((r|0)==1){p=+g[a+92>>2];i=+g[a+96>>2];j=+g[a+84>>2];s=+g[a+88>>2];t=c[a+4>>2]|0;if((d|0)<=-1){aK(5244292,103,5247300,5243944)}if((c[t+20>>2]|0)<=(d|0)){aK(5244292,103,5247300,5243944)}u=(c[t+16>>2]|0)+(d<<3)|0;t=c[u+4>>2]|0;v=(c[k>>2]=c[u>>2]|0,+g[k>>2]);w=(c[k>>2]=t,+g[k>>2]);x=(m*p-l*i)*(q+(f*v-e*w)-(o+(m*j-l*s)))+(l*p+m*i)*(n+(e*v+f*w)-(h+(l*j+m*s)));return+x}else if((r|0)==0){s=+g[a+92>>2];j=+g[a+96>>2];t=c[a>>2]|0;if((b|0)<=-1){aK(5244292,103,5247300,5243944)}if((c[t+20>>2]|0)<=(b|0)){aK(5244292,103,5247300,5243944)}u=(c[t+16>>2]|0)+(b<<3)|0;t=c[u+4>>2]|0;w=(c[k>>2]=c[u>>2]|0,+g[k>>2]);v=(c[k>>2]=t,+g[k>>2]);t=c[a+4>>2]|0;if((d|0)<=-1){aK(5244292,103,5247300,5243944)}if((c[t+20>>2]|0)<=(d|0)){aK(5244292,103,5247300,5243944)}u=(c[t+16>>2]|0)+(d<<3)|0;d=c[u+4>>2]|0;i=(c[k>>2]=c[u>>2]|0,+g[k>>2]);p=(c[k>>2]=d,+g[k>>2]);x=s*(q+(f*i-e*p)-(o+(m*w-l*v)))+j*(n+(e*i+f*p)-(h+(l*w+m*v)));return+x}else if((r|0)==2){v=+g[a+92>>2];w=+g[a+96>>2];p=+g[a+84>>2];i=+g[a+88>>2];r=c[a>>2]|0;if((b|0)<=-1){aK(5244292,103,5247300,5243944)}if((c[r+20>>2]|0)<=(b|0)){aK(5244292,103,5247300,5243944)}a=(c[r+16>>2]|0)+(b<<3)|0;b=c[a+4>>2]|0;j=(c[k>>2]=c[a>>2]|0,+g[k>>2]);s=(c[k>>2]=b,+g[k>>2]);x=(f*v-e*w)*(o+(m*j-l*s)-(q+(f*p-e*i)))+(e*v+f*w)*(h+(l*j+m*s)-(n+(e*p+f*i)));return+x}else{aK(5244124,242,5247148,5245900)}return 0.0}function bM(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0,l=0;if((e|0)<=-1){aK(5243792,89,5247648,5243756)}f=b+16|0;if(((c[f>>2]|0)-1|0)<=(e|0)){aK(5243792,89,5247648,5243756)}c[d+4>>2]=1;g[d+8>>2]=+g[b+8>>2];h=b+12|0;i=(c[h>>2]|0)+(e<<3)|0;j=d+12|0;k=c[i+4>>2]|0;c[j>>2]=c[i>>2]|0;c[j+4>>2]=k;k=(c[h>>2]|0)+(e+1<<3)|0;j=d+20|0;i=c[k+4>>2]|0;c[j>>2]=c[k>>2]|0;c[j+4>>2]=i;i=d+28|0;if((e|0)>0){j=(c[h>>2]|0)+(e-1<<3)|0;k=i;l=c[j+4>>2]|0;c[k>>2]=c[j>>2]|0;c[k+4>>2]=l;a[d+44|0]=1}else{l=b+20|0;k=i;i=c[l+4>>2]|0;c[k>>2]=c[l>>2]|0;c[k+4>>2]=i;a[d+44|0]=a[b+36|0]&1}i=d+36|0;if(((c[f>>2]|0)-2|0)>(e|0)){f=(c[h>>2]|0)+(e+2<<3)|0;e=i;h=c[f+4>>2]|0;c[e>>2]=c[f>>2]|0;c[e+4>>2]=h;a[d+45|0]=1;return}else{h=b+28|0;e=i;i=c[h+4>>2]|0;c[e>>2]=c[h>>2]|0;c[e+4>>2]=i;a[d+45|0]=a[b+37|0]&1;return}}function bN(a){a=a|0;return 1}function bO(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0.0,h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0;f=+g[d+12>>2];h=+g[a+12>>2];i=+g[d+8>>2];j=+g[a+16>>2];l=+g[d>>2];m=l+(f*h-i*j);n=+g[d+4>>2];o=h*i+f*j+n;j=+g[a+20>>2];h=+g[a+24>>2];p=l+(f*j-i*h);l=n+(i*j+f*h);h=+g[a+8>>2];a=b;d=(g[k>>2]=(m<p?m:p)-h,c[k>>2]|0);e=(g[k>>2]=(o<l?o:l)-h,c[k>>2]|0)|0;c[a>>2]=0|d;c[a+4>>2]=e;e=b+8|0;b=(g[k>>2]=h+(m>p?m:p),c[k>>2]|0);a=(g[k>>2]=h+(o>l?o:l),c[k>>2]|0)|0;c[e>>2]=0|b;c[e+4>>2]=a;return}function bP(a,b,d){a=a|0;b=b|0;d=+d;var e=0,f=0;g[b>>2]=0.0;d=(+g[a+16>>2]+ +g[a+24>>2])*.5;e=b+4|0;f=(g[k>>2]=(+g[a+12>>2]+ +g[a+20>>2])*.5,c[k>>2]|0);a=(g[k>>2]=d,c[k>>2]|0)|0;c[e>>2]=0|f;c[e+4>>2]=a;g[b+12>>2]=0.0;return}function bQ(a,b,d){a=a|0;b=b|0;d=d|0;var e=0.0,f=0.0,h=0.0,i=0.0,j=0.0,k=0.0,l=0,m=0;e=+g[d>>2]- +g[b>>2];f=+g[d+4>>2]- +g[b+4>>2];h=+g[b+12>>2];i=+g[b+8>>2];j=e*h+f*i;k=h*f+e*(-0.0-i);b=c[a+148>>2]|0;d=0;while(1){if((d|0)>=(b|0)){l=1;m=762;break}if((j- +g[a+20+(d<<3)>>2])*+g[a+84+(d<<3)>>2]+(k- +g[a+20+(d<<3)+4>>2])*+g[a+84+(d<<3)+4>>2]>0.0){l=0;m=761;break}else{d=d+1|0}}if((m|0)==761){return l|0}else if((m|0)==762){return l|0}return 0}function bR(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0.0,h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0,x=0.0,y=0.0,z=0.0,A=0.0;f=+g[d+12>>2];h=+g[a+20>>2];i=+g[d+8>>2];j=+g[a+24>>2];l=+g[d>>2];m=l+(f*h-i*j);n=+g[d+4>>2];o=h*i+f*j+n;d=c[a+148>>2]|0;L985:do{if((d|0)>1){j=o;h=m;p=o;q=m;e=1;while(1){r=+g[a+20+(e<<3)>>2];s=+g[a+20+(e<<3)+4>>2];t=l+(f*r-i*s);u=r*i+f*s+n;s=h<t?h:t;r=j<u?j:u;v=q>t?q:t;t=p>u?p:u;w=e+1|0;if((w|0)<(d|0)){j=r;h=s;p=t;q=v;e=w}else{x=r;y=s;z=t;A=v;break L985}}}else{x=o;y=m;z=o;A=m}}while(0);m=+g[a+8>>2];a=b;d=(g[k>>2]=y-m,c[k>>2]|0);e=(g[k>>2]=x-m,c[k>>2]|0)|0;c[a>>2]=0|d;c[a+4>>2]=e;e=b+8|0;b=(g[k>>2]=A+m,c[k>>2]|0);a=(g[k>>2]=z+m,c[k>>2]|0)|0;c[e>>2]=0|b;c[e+4>>2]=a;return}function bS(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0;h=+g[e>>2];i=+g[d>>2]-h;j=+g[e+4>>2];l=+g[d+4>>2]-j;m=+g[e+12>>2];n=+g[e+8>>2];o=i*m+l*n;p=-0.0-n;q=m*l+i*p;i=+g[d+8>>2]-h;h=+g[d+12>>2]-j;j=m*i+n*h-o;n=i*p+m*h-q;e=a+12|0;f=c[e+4>>2]|0;h=(c[k>>2]=c[e>>2]|0,+g[k>>2]);m=(c[k>>2]=f,+g[k>>2]);f=a+20|0;a=c[f+4>>2]|0;p=(c[k>>2]=c[f>>2]|0,+g[k>>2]);i=p-h;p=(c[k>>2]=a,+g[k>>2])-m;l=-0.0-i;r=i*i+p*p;s=+N(+r);if(s<1.1920928955078125e-7){t=p;u=l}else{v=1.0/s;t=p*v;u=v*l}l=(m-q)*u+(h-o)*t;v=n*u+j*t;if(v==0.0){w=0;return w|0}s=l/v;if(s<0.0){w=0;return w|0}if(+g[d+16>>2]<s|r==0.0){w=0;return w|0}v=(i*(o+j*s-h)+p*(q+n*s-m))/r;if(v<0.0|v>1.0){w=0;return w|0}g[b+8>>2]=s;if(l>0.0){d=b;a=(g[k>>2]=-0.0-t,c[k>>2]|0);f=(g[k>>2]=-0.0-u,c[k>>2]|0)|0;c[d>>2]=0|a;c[d+4>>2]=f;w=1;return w|0}else{f=b;b=(g[k>>2]=t,c[k>>2]|0);d=(g[k>>2]=u,c[k>>2]|0)|0;c[f>>2]=0|b;c[f+4>>2]=d;w=1;return w|0}return 0}function bT(a){a=a|0;dt(a);return}function bU(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=bY(b,152)|0;if((d|0)==0){e=0}else{c[d>>2]=5250800;c[d+4>>2]=2;g[d+8>>2]=.009999999776482582;c[d+148>>2]=0;g[d+12>>2]=0.0;g[d+16>>2]=0.0;e=d}c[e+4>>2]=c[a+4>>2]|0;g[e+8>>2]=+g[a+8>>2];d=a+12|0;b=e+12|0;f=c[d+4>>2]|0;c[b>>2]=c[d>>2]|0;c[b+4>>2]=f;dw(e+20|0,a+20|0,64);dw(e+84|0,a+84|0,64);c[e+148>>2]=c[a+148>>2]|0;return e|0}function bV(a){a=a|0;dt(a);return}function bW(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0.0,i=0.0,j=0.0,l=0.0,m=0.0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0.0,v=0.0,w=0,x=0.0,y=0,z=0.0;h=+g[e>>2];i=+g[d>>2]-h;j=+g[e+4>>2];l=+g[d+4>>2]-j;f=e+12|0;m=+g[f>>2];n=e+8|0;o=+g[n>>2];p=i*m+l*o;q=-0.0-o;r=m*l+i*q;i=+g[d+8>>2]-h;h=+g[d+12>>2]-j;j=m*i+o*h-p;o=i*q+m*h-r;h=+g[d+16>>2];d=c[a+148>>2]|0;m=0.0;e=0;s=-1;q=h;L1017:while(1){if((e|0)>=(d|0)){t=798;break}i=+g[a+84+(e<<3)>>2];l=+g[a+84+(e<<3)+4>>2];u=(+g[a+20+(e<<3)>>2]-p)*i+(+g[a+20+(e<<3)+4>>2]-r)*l;v=j*i+o*l;L1020:do{if(v==0.0){if(u<0.0){w=0;t=805;break L1017}else{x=m;y=s;z=q}}else{do{if(v<0.0){if(u>=m*v){break}x=u/v;y=e;z=q;break L1020}}while(0);if(v<=0.0){x=m;y=s;z=q;break}if(u>=q*v){x=m;y=s;z=q;break}x=m;y=s;z=u/v}}while(0);if(z<x){w=0;t=804;break}else{m=x;e=e+1|0;s=y;q=z}}if((t|0)==798){if(m<0.0|m>h){aK(5243472,249,5247356,5244172)}if((s|0)<=-1){w=0;return w|0}g[b+8>>2]=m;m=+g[f>>2];h=+g[a+84+(s<<3)>>2];z=+g[n>>2];q=+g[a+84+(s<<3)+4>>2];s=b;b=(g[k>>2]=m*h-z*q,c[k>>2]|0);a=(g[k>>2]=h*z+m*q,c[k>>2]|0)|0;c[s>>2]=0|b;c[s+4>>2]=a;w=1;return w|0}else if((t|0)==805){return w|0}else if((t|0)==804){return w|0}return 0}function bX(a,b,d){a=a|0;b=b|0;d=+d;var e=0,f=0.0,h=0.0,i=0,j=0.0,l=0.0,m=0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0;e=c[a+148>>2]|0;if((e|0)>2){f=0.0;h=0.0;i=0}else{aK(5243472,306,5247472,5243736)}while(1){j=h+ +g[a+20+(i<<3)>>2];l=f+ +g[a+20+(i<<3)+4>>2];m=i+1|0;if((m|0)<(e|0)){f=l;h=j;i=m}else{break}}h=1.0/+(e|0);f=j*h;j=l*h;i=a+20|0;m=a+24|0;h=0.0;l=0.0;n=0;o=0.0;p=0.0;while(1){q=+g[a+20+(n<<3)>>2]-f;r=+g[a+20+(n<<3)+4>>2]-j;s=n+1|0;t=(s|0)<(e|0);if(t){u=a+20+(s<<3)|0;v=a+20+(s<<3)+4|0}else{u=i;v=m}w=+g[u>>2]-f;x=+g[v>>2]-j;y=q*x-r*w;z=y*.5;A=p+z;B=z*.3333333432674408;C=l+(q+w)*B;D=h+(r+x)*B;E=o+y*.0833333358168602*(w*w+(q*q+q*w)+(x*x+(r*r+r*x)));if(t){h=D;l=C;n=s;o=E;p=A}else{break}}p=A*d;g[b>>2]=p;if(A>1.1920928955078125e-7){o=1.0/A;A=C*o;C=D*o;o=f+A;f=j+C;n=b+4|0;v=(g[k>>2]=o,c[k>>2]|0);u=(g[k>>2]=f,c[k>>2]|0)|0;c[n>>2]=0|v;c[n+4>>2]=u;g[b+12>>2]=E*d+p*(o*o+f*f-(A*A+C*C));return}else{aK(5243472,352,5247472,5243448)}}function bY(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;if((d|0)==0){e=0;return e|0}if((d|0)<=0){aK(5243252,104,5249432,5244764)}if((d|0)>640){e=dr(d)|0;return e|0}f=a[d+5251672|0]|0;d=f&255;if((f&255)>=14){aK(5243252,112,5249432,5244088)}f=b+12+(d<<2)|0;g=c[f>>2]|0;if((g|0)!=0){c[f>>2]=c[g>>2]|0;e=g;return e|0}g=b+4|0;h=c[g>>2]|0;i=b+8|0;j=b|0;if((h|0)==(c[i>>2]|0)){b=c[j>>2]|0;k=h+128|0;c[i>>2]=k;i=dr(k<<3)|0;c[j>>2]=i;k=b;dw(i|0,k|0,c[g>>2]<<3|0);dx((c[j>>2]|0)+(c[g>>2]<<3)|0,0,1024);ds(k);l=c[g>>2]|0}else{l=h}h=c[j>>2]|0;j=dr(16384)|0;k=h+(l<<3)+4|0;c[k>>2]=j;i=c[5252316+(d<<2)>>2]|0;c[h+(l<<3)>>2]=i;l=16384/(i|0)&-1;if((Z(l,i)|0)>=16385){aK(5243252,140,5249432,5243696)}h=l-1|0;L1080:do{if((h|0)>0){l=0;d=j;while(1){b=d+Z(l,i)|0;m=l+1|0;c[b>>2]=d+Z(m,i)|0;b=c[k>>2]|0;if((m|0)==(h|0)){n=b;break L1080}else{l=m;d=b}}}else{n=j}}while(0);c[n+Z(h,i)>>2]=0;c[f>>2]=c[c[k>>2]>>2]|0;c[g>>2]=(c[g>>2]|0)+1|0;e=c[k>>2]|0;return e|0}function bZ(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=b+102796|0;f=c[e>>2]|0;if((f|0)<=0){aK(5243112,63,5249292,5243676)}g=f-1|0;if((c[b+102412+(g*12&-1)>>2]|0)!=(d|0)){aK(5243112,65,5249292,5243428)}if((a[b+102412+(g*12&-1)+8|0]&1)<<24>>24==0){h=b+102412+(g*12&-1)+4|0;i=b+102400|0;c[i>>2]=(c[i>>2]|0)-(c[h>>2]|0)|0;j=f;k=h}else{ds(d);j=c[e>>2]|0;k=b+102412+(g*12&-1)+4|0}g=b+102404|0;c[g>>2]=(c[g>>2]|0)-(c[k>>2]|0)|0;c[e>>2]=j-1|0;return}function b_(a){a=a|0;return}function b$(a){a=a|0;return}function b0(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;d=c[(c[b+48>>2]|0)+8>>2]|0;e=c[(c[b+52>>2]|0)+8>>2]|0;f=c[a+72>>2]|0;do{if((f|0)!=0){if((c[b+4>>2]&2|0)==0){break}aV[c[(c[f>>2]|0)+12>>2]&255](f,b)}}while(0);f=b+8|0;g=c[f>>2]|0;h=b+12|0;if((g|0)!=0){c[g+12>>2]=c[h>>2]|0}g=c[h>>2]|0;if((g|0)!=0){c[g+8>>2]=c[f>>2]|0}f=a+60|0;if((c[f>>2]|0)==(b|0)){c[f>>2]=c[h>>2]|0}h=b+24|0;f=c[h>>2]|0;g=b+28|0;if((f|0)!=0){c[f+12>>2]=c[g>>2]|0}f=c[g>>2]|0;if((f|0)!=0){c[f+8>>2]=c[h>>2]|0}h=d+112|0;if((b+16|0)==(c[h>>2]|0)){c[h>>2]=c[g>>2]|0}g=b+40|0;h=c[g>>2]|0;d=b+44|0;if((h|0)!=0){c[h+12>>2]=c[d>>2]|0}h=c[d>>2]|0;if((h|0)!=0){c[h+8>>2]=c[g>>2]|0}g=e+112|0;if((b+32|0)!=(c[g>>2]|0)){i=a+76|0;j=c[i>>2]|0;cJ(b,j);k=a+64|0;l=c[k>>2]|0;m=l-1|0;c[k>>2]=m;return}c[g>>2]=c[d>>2]|0;i=a+76|0;j=c[i>>2]|0;cJ(b,j);k=a+64|0;l=c[k>>2]|0;m=l-1|0;c[k>>2]=m;return}function b1(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,i=0.0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,u=0;h=e+4|0;i=+g[h>>2];if(!(i==i&!(A=0.0,A!=A)&i>+-p&i<+p)){aK(5242984,27,5248376,5245548)}i=+g[e+8>>2];if(!(i==i&!(A=0.0,A!=A)&i>+-p&i<+p)){aK(5242984,27,5248376,5245548)}j=e+16|0;i=+g[j>>2];if(!(i==i&!(A=0.0,A!=A)&i>+-p&i<+p)){aK(5242984,28,5248376,5244444)}i=+g[e+20>>2];if(!(i==i&!(A=0.0,A!=A)&i>+-p&i<+p)){aK(5242984,28,5248376,5244444)}k=e+12|0;i=+g[k>>2];if(!(i==i&!(A=0.0,A!=A)&i>+-p&i<+p)){aK(5242984,29,5248376,5244028)}l=e+24|0;i=+g[l>>2];if(!(i==i&!(A=0.0,A!=A)&i>+-p&i<+p)){aK(5242984,30,5248376,5243644)}m=e+32|0;i=+g[m>>2];if(i<0.0|i==i&!(A=0.0,A!=A)&i>+-p&i<+p^1){aK(5242984,31,5248376,5243368)}n=e+28|0;i=+g[n>>2];if(i<0.0|i==i&!(A=0.0,A!=A)&i>+-p&i<+p^1){aK(5242984,32,5248376,5243192)}o=d+4|0;b[o>>1]=0;if((a[e+39|0]&1)<<24>>24==0){q=0}else{b[o>>1]=8;q=8}if((a[e+38|0]&1)<<24>>24==0){r=q}else{s=q|16;b[o>>1]=s;r=s}if((a[e+36|0]&1)<<24>>24==0){t=r}else{s=r|4;b[o>>1]=s;t=s}if((a[e+37|0]&1)<<24>>24==0){u=t}else{s=t|2;b[o>>1]=s;u=s}if((a[e+40|0]&1)<<24>>24!=0){b[o>>1]=u|32}c[d+88>>2]=f;f=h;h=d+12|0;u=c[f>>2]|0;o=c[f+4>>2]|0;c[h>>2]=u;c[h+4>>2]=o;i=+g[k>>2];g[d+20>>2]=+Q(+i);g[d+24>>2]=+P(+i);g[d+28>>2]=0.0;g[d+32>>2]=0.0;h=d+36|0;c[h>>2]=u;c[h+4>>2]=o;h=d+44|0;c[h>>2]=u;c[h+4>>2]=o;g[d+52>>2]=+g[k>>2];g[d+56>>2]=+g[k>>2];g[d+60>>2]=0.0;c[d+108>>2]=0;c[d+112>>2]=0;c[d+92>>2]=0;c[d+96>>2]=0;k=j;j=d+64|0;o=c[k+4>>2]|0;c[j>>2]=c[k>>2]|0;c[j+4>>2]=o;g[d+72>>2]=+g[l>>2];g[d+132>>2]=+g[n>>2];g[d+136>>2]=+g[m>>2];g[d+140>>2]=+g[e+48>>2];g[d+76>>2]=0.0;g[d+80>>2]=0.0;g[d+84>>2]=0.0;g[d+144>>2]=0.0;m=c[e>>2]|0;c[d>>2]=m;n=d+116|0;if((m|0)==2){g[n>>2]=1.0;g[d+120>>2]=1.0;m=d+124|0;g[m>>2]=0.0;l=d+128|0;g[l>>2]=0.0;o=e+44|0;j=c[o>>2]|0;k=d+148|0;c[k>>2]=j;h=d+100|0;c[h>>2]=0;u=d+104|0;c[u>>2]=0;return}else{g[n>>2]=0.0;g[d+120>>2]=0.0;m=d+124|0;g[m>>2]=0.0;l=d+128|0;g[l>>2]=0.0;o=e+44|0;j=c[o>>2]|0;k=d+148|0;c[k>>2]=j;h=d+100|0;c[h>>2]=0;u=d+104|0;c[u>>2]=0;return}}function b2(a){a=a|0;var d=0,e=0,f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0,w=0,x=0,y=0,z=0.0,A=0.0,B=0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0,R=0.0;d=i;i=i+16|0;e=d|0;f=a+116|0;h=a+120|0;j=a+124|0;l=a+128|0;m=a+28|0;g[m>>2]=0.0;g[a+32>>2]=0.0;dx(f|0,0,16);n=c[a>>2]|0;if((n|0)==2){o=5242944;p=c[o+4>>2]|0;q=(c[k>>2]=c[o>>2]|0,+g[k>>2]);r=(c[k>>2]=p,+g[k>>2]);p=c[a+100>>2]|0;do{if((p|0)==0){s=0.0;t=q;u=r;v=916}else{o=e|0;w=e+4|0;x=e+8|0;y=e+12|0;z=r;A=q;B=p;C=0.0;D=0.0;while(1){E=+g[B>>2];if(E==0.0){F=A;G=z;H=C;I=D}else{J=c[B+12>>2]|0;a_[c[(c[J>>2]|0)+28>>2]&255](J,e,E);E=+g[o>>2];K=E+ +g[f>>2];g[f>>2]=K;L=A+E*+g[w>>2];M=z+E*+g[x>>2];E=+g[y>>2]+ +g[j>>2];g[j>>2]=E;F=L;G=M;H=K;I=E}J=c[B+4>>2]|0;if((J|0)==0){break}else{z=G;A=F;B=J;C=H;D=I}}if(H<=0.0){s=I;t=F;u=G;v=916;break}D=1.0/H;g[h>>2]=D;N=F*D;O=G*D;P=H;Q=I;break}}while(0);if((v|0)==916){g[f>>2]=1.0;g[h>>2]=1.0;N=t;O=u;P=1.0;Q=s}do{if(Q>0.0){if((b[a+4>>1]&16)<<16>>16!=0){v=922;break}s=Q-(O*O+N*N)*P;g[j>>2]=s;if(s>0.0){R=1.0/s;break}else{aK(5242984,319,5248424,5245984)}}else{v=922}}while(0);if((v|0)==922){g[j>>2]=0.0;R=0.0}g[l>>2]=R;l=a+44|0;j=c[l+4>>2]|0;R=(c[k>>2]=c[l>>2]|0,+g[k>>2]);P=(c[k>>2]=j,+g[k>>2]);j=m;m=(g[k>>2]=N,c[k>>2]|0);v=(g[k>>2]=O,c[k>>2]|0)|0;c[j>>2]=0|m;c[j+4>>2]=v;Q=+g[a+24>>2];s=+g[a+20>>2];u=+g[a+12>>2]+(Q*N-s*O);t=N*s+Q*O+ +g[a+16>>2];v=(g[k>>2]=u,c[k>>2]|0);j=0|v;v=(g[k>>2]=t,c[k>>2]|0)|0;c[l>>2]=j;c[l+4>>2]=v;l=a+36|0;c[l>>2]=j;c[l+4>>2]=v;O=+g[a+72>>2];v=a+64|0;g[v>>2]=+g[v>>2]+(t-P)*(-0.0-O);v=a+68|0;g[v>>2]=O*(u-R)+ +g[v>>2];i=d;return}else if((n|0)==0|(n|0)==1){n=a+12|0;v=a+36|0;l=c[n>>2]|0;j=c[n+4>>2]|0;c[v>>2]=l;c[v+4>>2]=j;v=a+44|0;c[v>>2]=l;c[v+4>>2]=j;g[a+52>>2]=+g[a+56>>2];i=d;return}else{aK(5242984,284,5248424,5246264)}}function b3(d,e){d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;f=d+88|0;h=c[f>>2]|0;if((c[h+102868>>2]&2|0)!=0){aK(5242984,153,5248456,5243080)}i=h|0;h=bY(i,44)|0;if((h|0)==0){j=0}else{b[h+32>>1]=1;b[h+34>>1]=-1;b[h+36>>1]=0;c[h+40>>2]=0;c[h+24>>2]=0;c[h+28>>2]=0;dx(h|0,0,16);j=h}c[j+40>>2]=c[e+4>>2]|0;g[j+16>>2]=+g[e+8>>2];g[j+20>>2]=+g[e+12>>2];h=j+8|0;c[h>>2]=d;k=j+4|0;c[k>>2]=0;dw(j+32|0,e+22|0,6);a[j+38|0]=a[e+20|0]&1;l=c[e>>2]|0;m=a0[c[(c[l>>2]|0)+8>>2]&255](l,i)|0;l=j+12|0;c[l>>2]=m;n=aW[c[(c[m>>2]|0)+12>>2]&255](m)|0;m=bY(i,n*28&-1)|0;i=j+24|0;c[i>>2]=m;L1211:do{if((n|0)>0){c[m+16>>2]=0;c[(c[i>>2]|0)+24>>2]=-1;if((n|0)==1){break}else{o=1}while(1){c[(c[i>>2]|0)+(o*28&-1)+16>>2]=0;c[(c[i>>2]|0)+(o*28&-1)+24>>2]=-1;p=o+1|0;if((p|0)==(n|0)){break L1211}else{o=p}}}}while(0);o=j+28|0;c[o>>2]=0;n=j|0;g[n>>2]=+g[e+16>>2];L1216:do{if((b[d+4>>1]&32)<<16>>16!=0){e=(c[f>>2]|0)+102872|0;m=d+12|0;p=c[l>>2]|0;q=aW[c[(c[p>>2]|0)+12>>2]&255](p)|0;c[o>>2]=q;if((q|0)>0){r=0}else{break}while(1){q=c[i>>2]|0;p=q+(r*28&-1)|0;s=c[l>>2]|0;t=p|0;a1[c[(c[s>>2]|0)+24>>2]&255](s,t,m,r);c[q+(r*28&-1)+24>>2]=bl(e,t,p)|0;c[q+(r*28&-1)+16>>2]=j;c[q+(r*28&-1)+20>>2]=r;q=r+1|0;if((q|0)<(c[o>>2]|0)){r=q}else{break L1216}}}}while(0);r=d+100|0;c[k>>2]=c[r>>2]|0;c[r>>2]=j;r=d+104|0;c[r>>2]=(c[r>>2]|0)+1|0;c[h>>2]=d;if(+g[n>>2]<=0.0){u=c[f>>2]|0;v=u+102868|0;w=c[v>>2]|0;x=w|1;c[v>>2]=x;return j|0}b2(d);u=c[f>>2]|0;v=u+102868|0;w=c[v>>2]|0;x=w|1;c[v>>2]=x;return j|0}function b4(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=c[a>>2]|0;e=c[b>>2]|0;if((d|0)<(e|0)){f=1;return f|0}if((d|0)!=(e|0)){f=0;return f|0}f=(c[a+4>>2]|0)<(c[b+4>>2]|0);return f|0}function b5(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;h=c[e+16>>2]|0;i=c[f+16>>2]|0;j=c[e+20>>2]|0;e=c[f+20>>2]|0;f=c[h+8>>2]|0;k=c[i+8>>2]|0;if((f|0)==(k|0)){return}l=c[k+112>>2]|0;L1237:do{if((l|0)!=0){m=l;while(1){if((c[m>>2]|0)==(f|0)){n=c[m+4>>2]|0;o=c[n+48>>2]|0;p=c[n+52>>2]|0;q=c[n+56>>2]|0;r=c[n+60>>2]|0;if((o|0)==(h|0)&(p|0)==(i|0)&(q|0)==(j|0)&(r|0)==(e|0)){s=976;break}if((o|0)==(i|0)&(p|0)==(h|0)&(q|0)==(e|0)&(r|0)==(j|0)){s=982;break}}r=c[m+12>>2]|0;if((r|0)==0){break L1237}else{m=r}}if((s|0)==982){return}else if((s|0)==976){return}}}while(0);do{if((c[k>>2]|0)!=2){if((c[f>>2]|0)==2){break}return}}while(0);s=c[k+108>>2]|0;L1252:do{if((s|0)!=0){k=s;while(1){if((c[k>>2]|0)==(f|0)){if((a[(c[k+4>>2]|0)+61|0]&1)<<24>>24==0){break}}l=c[k+12>>2]|0;if((l|0)==0){break L1252}else{k=l}}return}}while(0);f=c[d+68>>2]|0;do{if((f|0)!=0){if(aX[c[(c[f>>2]|0)+8>>2]&255](f,h,i)|0){break}return}}while(0);f=cI(h,j,i,e,c[d+76>>2]|0)|0;if((f|0)==0){return}e=c[(c[f+48>>2]|0)+8>>2]|0;i=c[(c[f+52>>2]|0)+8>>2]|0;c[f+8>>2]=0;j=d+60|0;c[f+12>>2]=c[j>>2]|0;h=c[j>>2]|0;if((h|0)!=0){c[h+8>>2]=f}c[j>>2]=f;j=f+16|0;c[f+20>>2]=f;c[j>>2]=i;c[f+24>>2]=0;h=e+112|0;c[f+28>>2]=c[h>>2]|0;s=c[h>>2]|0;if((s|0)!=0){c[s+8>>2]=j}c[h>>2]=j;j=f+32|0;c[f+36>>2]=f;c[j>>2]=e;c[f+40>>2]=0;h=i+112|0;c[f+44>>2]=c[h>>2]|0;f=c[h>>2]|0;if((f|0)!=0){c[f+8>>2]=j}c[h>>2]=j;j=e+4|0;h=b[j>>1]|0;if((h&2)<<16>>16==0){b[j>>1]=h|2;g[e+144>>2]=0.0}e=i+4|0;h=b[e>>1]|0;if((h&2)<<16>>16==0){b[e>>1]=h|2;g[i+144>>2]=0.0}i=d+64|0;c[i>>2]=(c[i>>2]|0)+1|0;return}function b6(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;e=i;i=i+1036|0;f=e|0;h=f+4|0;j=f|0;c[j>>2]=h;k=f+1028|0;c[k>>2]=0;l=f+1032|0;c[l>>2]=256;c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[a>>2]|0;f=(c[k>>2]|0)+1|0;c[k>>2]=f;L1284:do{if((f|0)>0){m=a+4|0;n=d|0;o=d+4|0;p=d+8|0;q=d+12|0;r=b+56|0;s=b+52|0;t=b+48|0;u=b+44|0;v=f;while(1){w=v-1|0;c[k>>2]=w;x=c[j>>2]|0;y=c[x+(w<<2)>>2]|0;do{if((y|0)==-1){z=w}else{A=c[m>>2]|0;if(+g[n>>2]- +g[A+(y*36&-1)+8>>2]>0.0|+g[o>>2]- +g[A+(y*36&-1)+12>>2]>0.0|+g[A+(y*36&-1)>>2]- +g[p>>2]>0.0|+g[A+(y*36&-1)+4>>2]- +g[q>>2]>0.0){z=w;break}B=A+(y*36&-1)+24|0;if((c[B>>2]|0)==-1){C=c[r>>2]|0;if((C|0)==(y|0)){z=w;break}D=c[s>>2]|0;if((D|0)==(c[t>>2]|0)){E=c[u>>2]|0;c[t>>2]=D<<1;F=dr(D*24&-1)|0;c[u>>2]=F;G=E;dw(F|0,G|0,(c[s>>2]|0)*12&-1|0);ds(G);H=c[r>>2]|0;I=c[s>>2]|0}else{H=C;I=D}c[(c[u>>2]|0)+(I*12&-1)>>2]=(H|0)>(y|0)?y:H;D=c[r>>2]|0;c[(c[u>>2]|0)+((c[s>>2]|0)*12&-1)+4>>2]=(D|0)<(y|0)?y:D;c[s>>2]=(c[s>>2]|0)+1|0;z=c[k>>2]|0;break}do{if((w|0)==(c[l>>2]|0)){c[l>>2]=w<<1;D=dr(w<<3)|0;c[j>>2]=D;C=x;dw(D|0,C|0,c[k>>2]<<2|0);if((x|0)==(h|0)){break}ds(C)}}while(0);c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[B>>2]|0;C=(c[k>>2]|0)+1|0;c[k>>2]=C;D=A+(y*36&-1)+28|0;do{if((C|0)==(c[l>>2]|0)){G=c[j>>2]|0;c[l>>2]=C<<1;F=dr(C<<3)|0;c[j>>2]=F;E=G;dw(F|0,E|0,c[k>>2]<<2|0);if((G|0)==(h|0)){break}ds(E)}}while(0);c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[D>>2]|0;C=(c[k>>2]|0)+1|0;c[k>>2]=C;z=C}}while(0);if((z|0)>0){v=z}else{break L1284}}}}while(0);z=c[j>>2]|0;if((z|0)==(h|0)){i=e;return}ds(z);c[j>>2]=0;i=e;return}function b7(d){d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;e=c[d+60>>2]|0;if((e|0)==0){return}f=d+12|0;h=d+4|0;i=d+72|0;j=d+68|0;k=e;L1316:while(1){e=c[k+48>>2]|0;l=c[k+52>>2]|0;m=c[k+56>>2]|0;n=c[k+60>>2]|0;o=c[e+8>>2]|0;p=c[l+8>>2]|0;q=k+4|0;r=c[q>>2]|0;L1318:do{if((r&8|0)==0){s=1022}else{do{if((c[p>>2]|0)==2){s=1011}else{if((c[o>>2]|0)==2){s=1011;break}else{break}}}while(0);L1322:do{if((s|0)==1011){s=0;t=c[p+108>>2]|0;L1324:do{if((t|0)!=0){u=t;while(1){if((c[u>>2]|0)==(o|0)){if((a[(c[u+4>>2]|0)+61|0]&1)<<24>>24==0){break L1322}}v=c[u+12>>2]|0;if((v|0)==0){break L1324}else{u=v}}}}while(0);t=c[j>>2]|0;do{if((t|0)==0){w=r}else{if(aX[c[(c[t>>2]|0)+8>>2]&255](t,e,l)|0){w=c[q>>2]|0;break}else{u=c[k+12>>2]|0;b0(d,k);x=u;break L1318}}}while(0);c[q>>2]=w&-9;s=1022;break L1318}}while(0);t=c[k+12>>2]|0;b0(d,k);x=t;break}}while(0);do{if((s|0)==1022){s=0;if((b[o+4>>1]&2)<<16>>16==0){y=0}else{y=(c[o>>2]|0)!=0}if((b[p+4>>1]&2)<<16>>16==0){z=0}else{z=(c[p>>2]|0)!=0}if(!(y|z)){x=c[k+12>>2]|0;break}q=c[(c[e+24>>2]|0)+(m*28&-1)+24>>2]|0;r=c[(c[l+24>>2]|0)+(n*28&-1)+24>>2]|0;if((q|0)<=-1){s=1040;break L1316}t=c[f>>2]|0;if((t|0)<=(q|0)){s=1039;break L1316}u=c[h>>2]|0;if(!((r|0)>-1&(t|0)>(r|0))){s=1032;break L1316}if(+g[u+(r*36&-1)>>2]- +g[u+(q*36&-1)+8>>2]>0.0|+g[u+(r*36&-1)+4>>2]- +g[u+(q*36&-1)+12>>2]>0.0|+g[u+(q*36&-1)>>2]- +g[u+(r*36&-1)+8>>2]>0.0|+g[u+(q*36&-1)+4>>2]- +g[u+(r*36&-1)+12>>2]>0.0){r=c[k+12>>2]|0;b0(d,k);x=r;break}else{cL(k,c[i>>2]|0);x=c[k+12>>2]|0;break}}}while(0);if((x|0)==0){s=1037;break}else{k=x}}if((s|0)==1032){aK(5245460,159,5247592,5245416)}else if((s|0)==1037){return}else if((s|0)==1039){aK(5245460,159,5247592,5245416)}else if((s|0)==1040){aK(5245460,159,5247592,5245416)}}function b8(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;d=i;i=i+4|0;e=d|0;f=a+52|0;c[f>>2]=0;g=a+40|0;h=c[g>>2]|0;do{if((h|0)>0){j=a+32|0;k=a+56|0;l=a|0;m=a+12|0;n=a+4|0;o=0;p=h;while(1){q=c[(c[j>>2]|0)+(o<<2)>>2]|0;c[k>>2]=q;if((q|0)==-1){r=p}else{if((q|0)<=-1){s=1063;break}if((c[m>>2]|0)<=(q|0)){s=1062;break}b6(l,a,(c[n>>2]|0)+(q*36&-1)|0);r=c[g>>2]|0}q=o+1|0;if((q|0)<(r|0)){o=q;p=r}else{s=1049;break}}if((s|0)==1062){aK(5245460,159,5247592,5245416)}else if((s|0)==1063){aK(5245460,159,5247592,5245416)}else if((s|0)==1049){t=c[f>>2]|0;break}}else{t=0}}while(0);c[g>>2]=0;g=a+44|0;r=c[g>>2]|0;c[e>>2]=116;b9(r,r+(t*12&-1)|0,e);if((c[f>>2]|0)<=0){i=d;return}e=a+12|0;t=a+4|0;a=0;L1379:while(1){r=c[g>>2]|0;h=r+(a*12&-1)|0;p=c[h>>2]|0;if((p|0)<=-1){s=1066;break}o=c[e>>2]|0;if((o|0)<=(p|0)){s=1067;break}n=c[t>>2]|0;l=r+(a*12&-1)+4|0;r=c[l>>2]|0;if(!((r|0)>-1&(o|0)>(r|0))){s=1056;break}b5(b,c[n+(p*36&-1)+16>>2]|0,c[n+(r*36&-1)+16>>2]|0);r=c[f>>2]|0;n=a;while(1){p=n+1|0;if((p|0)>=(r|0)){s=1065;break L1379}o=c[g>>2]|0;if((c[o+(p*12&-1)>>2]|0)!=(c[h>>2]|0)){a=p;continue L1379}if((c[o+(p*12&-1)+4>>2]|0)==(c[l>>2]|0)){n=p}else{a=p;continue L1379}}}if((s|0)==1065){i=d;return}else if((s|0)==1066){aK(5245460,153,5247544,5245416)}else if((s|0)==1067){aK(5245460,153,5247544,5245416)}else if((s|0)==1056){aK(5245460,153,5247544,5245416)}}function b9(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0;e=i;i=i+360|0;f=e|0;g=e+12|0;h=e+24|0;j=e+36|0;k=e+48|0;l=e+168|0;m=e+180|0;n=e+192|0;o=e+204|0;p=e+216|0;q=e+228|0;r=e+240|0;s=e+252|0;t=e+264|0;u=e+276|0;v=e+348|0;w=e+120|0;x=e+132|0;y=e+144|0;z=e+156|0;A=e+288|0;B=e+300|0;C=e+324|0;D=e+336|0;E=e+312|0;F=e+60|0;G=e+72|0;H=e+84|0;I=e+96|0;J=e+108|0;K=a;a=b;L1394:while(1){b=a;L=a-12|0;M=L;N=K;L1396:while(1){O=N;P=b-O|0;Q=(P|0)/12&-1;if((Q|0)==2){R=1071;break L1394}else if((Q|0)==3){R=1073;break L1394}else if((Q|0)==4){R=1081;break L1394}else if((Q|0)==0|(Q|0)==1){R=1152;break L1394}else if((Q|0)==5){R=1082;break L1394}if((P|0)<372){R=1088;break L1394}Q=(P|0)/24&-1;S=N+(Q*12&-1)|0;do{if((P|0)>11988){T=(P|0)/48&-1;U=N+(T*12&-1)|0;V=N+((T+Q|0)*12&-1)|0;T=ca(N,U,S,V,d)|0;if(!(a0[c[d>>2]&255](L,V)|0)){W=T;break}X=V;dw(z|0,X|0,12);dw(X|0,M|0,12);dw(M|0,z|0,12);if(!(a0[c[d>>2]&255](V,S)|0)){W=T+1|0;break}V=S;dw(x|0,V|0,12);dw(V|0,X|0,12);dw(X|0,x|0,12);if(!(a0[c[d>>2]&255](S,U)|0)){W=T+2|0;break}X=U;dw(w|0,X|0,12);dw(X|0,V|0,12);dw(V|0,w|0,12);if(!(a0[c[d>>2]&255](U,N)|0)){W=T+3|0;break}U=N;dw(y|0,U|0,12);dw(U|0,X|0,12);dw(X|0,y|0,12);W=T+4|0}else{T=a0[c[d>>2]&255](S,N)|0;X=a0[c[d>>2]&255](L,S)|0;if(!T){if(!X){W=0;break}T=S;dw(J|0,T|0,12);dw(T|0,M|0,12);dw(M|0,J|0,12);if(!(a0[c[d>>2]&255](S,N)|0)){W=1;break}U=N;dw(H|0,U|0,12);dw(U|0,T|0,12);dw(T|0,H|0,12);W=2;break}T=N;if(X){dw(F|0,T|0,12);dw(T|0,M|0,12);dw(M|0,F|0,12);W=1;break}dw(G|0,T|0,12);X=S;dw(T|0,X|0,12);dw(X|0,G|0,12);if(!(a0[c[d>>2]&255](L,S)|0)){W=1;break}dw(I|0,X|0,12);dw(X|0,M|0,12);dw(M|0,I|0,12);W=2}}while(0);do{if(a0[c[d>>2]&255](N,S)|0){Y=L;Z=W}else{Q=L;while(1){_=Q-12|0;if((N|0)==(_|0)){break}if(a0[c[d>>2]&255](_,S)|0){R=1130;break}else{Q=_}}if((R|0)==1130){R=0;Q=N;dw(E|0,Q|0,12);P=_;dw(Q|0,P|0,12);dw(P|0,E|0,12);Y=_;Z=W+1|0;break}P=N+12|0;if(a0[c[d>>2]&255](N,L)|0){$=P}else{Q=P;while(1){if((Q|0)==(L|0)){R=1148;break L1394}aa=Q+12|0;if(a0[c[d>>2]&255](N,Q)|0){break}else{Q=aa}}P=Q;dw(D|0,P|0,12);dw(P|0,M|0,12);dw(M|0,D|0,12);$=aa}if(($|0)==(L|0)){R=1165;break L1394}else{ab=L;ac=$}while(1){P=ac;while(1){ad=P+12|0;if(a0[c[d>>2]&255](N,P)|0){ae=ab;break}else{P=ad}}while(1){af=ae-12|0;if(a0[c[d>>2]&255](N,af)|0){ae=af}else{break}}if(P>>>0>=af>>>0){N=P;continue L1396}X=P;dw(C|0,X|0,12);T=af;dw(X|0,T|0,12);dw(T|0,C|0,12);ab=af;ac=ad}}}while(0);Q=N+12|0;L1439:do{if(Q>>>0<Y>>>0){T=Y;X=Q;U=Z;V=S;while(1){ag=X;while(1){ah=ag+12|0;if(a0[c[d>>2]&255](ag,V)|0){ag=ah}else{ai=T;break}}while(1){aj=ai-12|0;if(a0[c[d>>2]&255](aj,V)|0){break}else{ai=aj}}if(ag>>>0>aj>>>0){ak=ag;al=U;am=V;break L1439}P=ag;dw(B|0,P|0,12);an=aj;dw(P|0,an|0,12);dw(an|0,B|0,12);T=aj;X=ah;U=U+1|0;V=(V|0)==(ag|0)?aj:V}}else{ak=Q;al=Z;am=S}}while(0);do{if((ak|0)==(am|0)){ao=al}else{if(!(a0[c[d>>2]&255](am,ak)|0)){ao=al;break}S=ak;dw(A|0,S|0,12);Q=am;dw(S|0,Q|0,12);dw(Q|0,A|0,12);ao=al+1|0}}while(0);if((ao|0)==0){ap=cf(N,ak,d)|0;Q=ak+12|0;if(cf(Q,a,d)|0){R=1142;break}if(ap){N=Q;continue}}Q=ak;if((Q-O|0)>=(b-Q|0)){R=1146;break}b9(N,ak,d);N=ak+12|0}if((R|0)==1146){R=0;b9(ak+12|0,a,d);K=N;a=ak;continue}else if((R|0)==1142){R=0;if(ap){R=1161;break}else{K=N;a=ak;continue}}}if((R|0)==1071){if(!(a0[c[d>>2]&255](L,N)|0)){i=e;return}ak=v;v=N;dw(ak|0,v|0,12);dw(v|0,M|0,12);dw(M|0,ak|0,12);i=e;return}else if((R|0)==1073){ak=N+12|0;v=q;q=r;r=s;s=t;t=u;u=a0[c[d>>2]&255](ak,N)|0;K=a0[c[d>>2]&255](L,ak)|0;if(!u){if(!K){i=e;return}u=ak;dw(t|0,u|0,12);dw(u|0,M|0,12);dw(M|0,t|0,12);if(!(a0[c[d>>2]&255](ak,N)|0)){i=e;return}t=N;dw(r|0,t|0,12);dw(t|0,u|0,12);dw(u|0,r|0,12);i=e;return}r=N;if(K){dw(v|0,r|0,12);dw(r|0,M|0,12);dw(M|0,v|0,12);i=e;return}dw(q|0,r|0,12);v=ak;dw(r|0,v|0,12);dw(v|0,q|0,12);if(!(a0[c[d>>2]&255](L,ak)|0)){i=e;return}dw(s|0,v|0,12);dw(v|0,M|0,12);dw(M|0,s|0,12);i=e;return}else if((R|0)==1081){ca(N,N+12|0,N+24|0,L,d);i=e;return}else if((R|0)==1165){i=e;return}else if((R|0)==1148){i=e;return}else if((R|0)==1152){i=e;return}else if((R|0)==1082){s=N+12|0;v=N+24|0;ak=N+36|0;q=m;m=n;n=o;o=p;ca(N,s,v,ak,d);if(!(a0[c[d>>2]&255](L,ak)|0)){i=e;return}L=ak;dw(o|0,L|0,12);dw(L|0,M|0,12);dw(M|0,o|0,12);if(!(a0[c[d>>2]&255](ak,v)|0)){i=e;return}ak=v;dw(m|0,ak|0,12);dw(ak|0,L|0,12);dw(L|0,m|0,12);if(!(a0[c[d>>2]&255](v,s)|0)){i=e;return}v=s;dw(q|0,v|0,12);dw(v|0,ak|0,12);dw(ak|0,q|0,12);if(!(a0[c[d>>2]&255](s,N)|0)){i=e;return}s=N;dw(n|0,s|0,12);dw(s|0,v|0,12);dw(v|0,n|0,12);i=e;return}else if((R|0)==1161){i=e;return}else if((R|0)==1088){R=l;n=N+24|0;v=N+12|0;s=f;f=g;g=h;h=j;j=k;k=a0[c[d>>2]&255](v,N)|0;q=a0[c[d>>2]&255](n,v)|0;do{if(k){ak=N;if(q){dw(s|0,ak|0,12);m=n;dw(ak|0,m|0,12);dw(m|0,s|0,12);break}dw(f|0,ak|0,12);m=v;dw(ak|0,m|0,12);dw(m|0,f|0,12);if(!(a0[c[d>>2]&255](n,v)|0)){break}dw(h|0,m|0,12);ak=n;dw(m|0,ak|0,12);dw(ak|0,h|0,12)}else{if(!q){break}ak=v;dw(j|0,ak|0,12);m=n;dw(ak|0,m|0,12);dw(m|0,j|0,12);if(!(a0[c[d>>2]&255](v,N)|0)){break}m=N;dw(g|0,m|0,12);dw(m|0,ak|0,12);dw(ak|0,g|0,12)}}while(0);g=N+36|0;if((g|0)==(a|0)){i=e;return}else{aq=n;ar=g}while(1){if(a0[c[d>>2]&255](ar,aq)|0){dw(R|0,ar|0,12);g=aq;n=ar;while(1){as=g;dw(n|0,as|0,12);if((g|0)==(N|0)){break}v=g-12|0;if(a0[c[d>>2]&255](l,v)|0){n=g;g=v}else{break}}dw(as|0,R|0,12)}g=ar+12|0;if((g|0)==(a|0)){break}else{aq=ar;ar=g}}i=e;return}}function ca(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;g=i;i=i+96|0;h=g+60|0;j=g+72|0;k=g+84|0;l=g|0;m=g+12|0;n=g+24|0;o=g+36|0;p=g+48|0;q=a0[c[f>>2]&255](b,a)|0;r=a0[c[f>>2]&255](d,b)|0;do{if(q){s=a;if(r){dw(l|0,s|0,12);t=d;dw(s|0,t|0,12);dw(t|0,l|0,12);u=1;break}dw(m|0,s|0,12);t=b;dw(s|0,t|0,12);dw(t|0,m|0,12);if(!(a0[c[f>>2]&255](d,b)|0)){u=1;break}dw(o|0,t|0,12);s=d;dw(t|0,s|0,12);dw(s|0,o|0,12);u=2}else{if(!r){u=0;break}s=b;dw(p|0,s|0,12);t=d;dw(s|0,t|0,12);dw(t|0,p|0,12);if(!(a0[c[f>>2]&255](b,a)|0)){u=1;break}t=a;dw(n|0,t|0,12);dw(t|0,s|0,12);dw(s|0,n|0,12);u=2}}while(0);if(!(a0[c[f>>2]&255](e,d)|0)){v=u;i=g;return v|0}n=k;k=d;dw(n|0,k|0,12);p=e;dw(k|0,p|0,12);dw(p|0,n|0,12);if(!(a0[c[f>>2]&255](d,b)|0)){v=u+1|0;i=g;return v|0}d=h;h=b;dw(d|0,h|0,12);dw(h|0,k|0,12);dw(k|0,d|0,12);if(!(a0[c[f>>2]&255](b,a)|0)){v=u+2|0;i=g;return v|0}b=j;j=a;dw(b|0,j|0,12);dw(j|0,h|0,12);dw(h|0,b|0,12);v=u+3|0;i=g;return v|0}function cb(a,b){a=a|0;b=b|0;return}function cc(a,b){a=a|0;b=b|0;return}function cd(a,b,c){a=a|0;b=b|0;c=c|0;return}function ce(a,b,c){a=a|0;b=b|0;c=c|0;return}function cf(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;e=i;i=i+192|0;f=e|0;g=e+12|0;h=e+24|0;j=e+36|0;k=e+48|0;l=e+60|0;m=e+72|0;n=e+84|0;o=e+96|0;p=e+108|0;q=e+120|0;r=e+132|0;s=e+144|0;t=e+156|0;u=e+168|0;v=e+180|0;w=(b-a|0)/12&-1;if((w|0)==2){x=b-12|0;if(!(a0[c[d>>2]&255](x,a)|0)){y=1;i=e;return y|0}z=u;u=a;dw(z|0,u|0,12);A=x;dw(u|0,A|0,12);dw(A|0,z|0,12);y=1;i=e;return y|0}else if((w|0)==4){ca(a,a+12|0,a+24|0,b-12|0,d);y=1;i=e;return y|0}else if((w|0)==5){z=a+12|0;A=a+24|0;u=a+36|0;x=b-12|0;B=l;l=m;m=n;n=o;ca(a,z,A,u,d);if(!(a0[c[d>>2]&255](x,u)|0)){y=1;i=e;return y|0}o=u;dw(n|0,o|0,12);C=x;dw(o|0,C|0,12);dw(C|0,n|0,12);if(!(a0[c[d>>2]&255](u,A)|0)){y=1;i=e;return y|0}u=A;dw(l|0,u|0,12);dw(u|0,o|0,12);dw(o|0,l|0,12);if(!(a0[c[d>>2]&255](A,z)|0)){y=1;i=e;return y|0}A=z;dw(B|0,A|0,12);dw(A|0,u|0,12);dw(u|0,B|0,12);if(!(a0[c[d>>2]&255](z,a)|0)){y=1;i=e;return y|0}z=a;dw(m|0,z|0,12);dw(z|0,A|0,12);dw(A|0,m|0,12);y=1;i=e;return y|0}else if((w|0)==0|(w|0)==1){y=1;i=e;return y|0}else if((w|0)==3){w=a+12|0;m=b-12|0;A=p;p=q;q=r;r=s;s=t;t=a0[c[d>>2]&255](w,a)|0;z=a0[c[d>>2]&255](m,w)|0;if(!t){if(!z){y=1;i=e;return y|0}t=w;dw(s|0,t|0,12);B=m;dw(t|0,B|0,12);dw(B|0,s|0,12);if(!(a0[c[d>>2]&255](w,a)|0)){y=1;i=e;return y|0}s=a;dw(q|0,s|0,12);dw(s|0,t|0,12);dw(t|0,q|0,12);y=1;i=e;return y|0}q=a;if(z){dw(A|0,q|0,12);z=m;dw(q|0,z|0,12);dw(z|0,A|0,12);y=1;i=e;return y|0}dw(p|0,q|0,12);A=w;dw(q|0,A|0,12);dw(A|0,p|0,12);if(!(a0[c[d>>2]&255](m,w)|0)){y=1;i=e;return y|0}dw(r|0,A|0,12);w=m;dw(A|0,w|0,12);dw(w|0,r|0,12);y=1;i=e;return y|0}else{r=a+24|0;w=a+12|0;A=f;f=g;g=h;h=j;j=k;k=a0[c[d>>2]&255](w,a)|0;m=a0[c[d>>2]&255](r,w)|0;do{if(k){p=a;if(m){dw(A|0,p|0,12);q=r;dw(p|0,q|0,12);dw(q|0,A|0,12);break}dw(f|0,p|0,12);q=w;dw(p|0,q|0,12);dw(q|0,f|0,12);if(!(a0[c[d>>2]&255](r,w)|0)){break}dw(h|0,q|0,12);p=r;dw(q|0,p|0,12);dw(p|0,h|0,12)}else{if(!m){break}p=w;dw(j|0,p|0,12);q=r;dw(p|0,q|0,12);dw(q|0,j|0,12);if(!(a0[c[d>>2]&255](w,a)|0)){break}q=a;dw(g|0,q|0,12);dw(q|0,p|0,12);dw(p|0,g|0,12)}}while(0);g=a+36|0;if((g|0)==(b|0)){y=1;i=e;return y|0}w=v;j=r;r=0;m=g;while(1){if(a0[c[d>>2]&255](m,j)|0){dw(w|0,m|0,12);g=j;h=m;while(1){D=g;dw(h|0,D|0,12);if((g|0)==(a|0)){break}f=g-12|0;if(a0[c[d>>2]&255](v,f)|0){h=g;g=f}else{break}}dw(D|0,w|0,12);g=r+1|0;if((g|0)==8){break}else{E=g}}else{E=r}g=m+12|0;if((g|0)==(b|0)){y=1;F=1236;break}else{j=m;r=E;m=g}}if((F|0)==1236){i=e;return y|0}y=(m+12|0)==(b|0);i=e;return y|0}return 0}function cg(a){a=a|0;dt(a);return}function ch(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0.0,K=0.0,L=0.0,M=0.0,N=0,O=0,P=0;f=i;i=i+40|0;h=f|0;j=f+16|0;l=f+32|0;m=a+28|0;if((c[m>>2]|0)<=0){i=f;return}n=a+24|0;o=a+12|0;a=h|0;p=j|0;q=h+4|0;r=j+4|0;s=h+8|0;t=j+8|0;u=h+12|0;v=j+12|0;w=e|0;x=d|0;y=e+4|0;z=d+4|0;A=l|0;B=l+4|0;C=b|0;D=b+40|0;E=b+36|0;F=b+32|0;b=0;while(1){G=c[n>>2]|0;H=c[o>>2]|0;I=G+(b*28&-1)+20|0;a1[c[(c[H>>2]|0)+24>>2]&255](H,h,d,c[I>>2]|0);H=c[o>>2]|0;a1[c[(c[H>>2]|0)+24>>2]&255](H,j,e,c[I>>2]|0);I=G+(b*28&-1)|0;J=+g[a>>2];K=+g[p>>2];L=+g[q>>2];M=+g[r>>2];H=I;N=(g[k>>2]=J<K?J:K,c[k>>2]|0);O=(g[k>>2]=L<M?L:M,c[k>>2]|0)|0;c[H>>2]=0|N;c[H+4>>2]=O;M=+g[s>>2];L=+g[t>>2];K=+g[u>>2];J=+g[v>>2];O=G+(b*28&-1)+8|0;H=(g[k>>2]=M>L?M:L,c[k>>2]|0);N=(g[k>>2]=K>J?K:J,c[k>>2]|0)|0;c[O>>2]=0|H;c[O+4>>2]=N;J=+g[y>>2]- +g[z>>2];g[A>>2]=+g[w>>2]- +g[x>>2];g[B>>2]=J;N=c[G+(b*28&-1)+24>>2]|0;if(bD(C,N,I,l)|0){I=c[D>>2]|0;if((I|0)==(c[E>>2]|0)){G=c[F>>2]|0;c[E>>2]=I<<1;O=dr(I<<3)|0;c[F>>2]=O;H=G;dw(O|0,H|0,c[D>>2]<<2|0);ds(H);P=c[D>>2]|0}else{P=I}c[(c[F>>2]|0)+(P<<2)>>2]=N;c[D>>2]=(c[D>>2]|0)+1|0}N=b+1|0;if((N|0)<(c[m>>2]|0)){b=N}else{break}}i=f;return}function ci(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;if((c[b+28>>2]|0)!=0){aK(5245908,72,5247852,5246368)}e=b+12|0;f=c[e>>2]|0;g=aW[c[(c[f>>2]|0)+12>>2]&255](f)|0;f=b+24|0;b=c[f>>2]|0;h=b;i=g*28&-1;do{if((i|0)!=0){if((i|0)<=0){aK(5243252,164,5249472,5244764)}if((i|0)>640){ds(h);break}g=a[i+5251672|0]|0;if((g&255)<14){j=d+12+((g&255)<<2)|0;c[b>>2]=c[j>>2]|0;c[j>>2]=b;break}else{aK(5243252,173,5249472,5244088)}}}while(0);c[f>>2]=0;f=c[e>>2]|0;b=c[f+4>>2]|0;if((b|0)==1){aU[c[c[f>>2]>>2]&255](f);i=a[5251720]|0;if((i&255)>=14){aK(5243252,173,5249472,5244088)}h=d+12+((i&255)<<2)|0;c[f>>2]=c[h>>2]|0;c[h>>2]=f;c[e>>2]=0;return}else if((b|0)==2){aU[c[c[f>>2]>>2]&255](f);h=a[5251824]|0;if((h&255)>=14){aK(5243252,173,5249472,5244088)}i=d+12+((h&255)<<2)|0;c[f>>2]=c[i>>2]|0;c[i>>2]=f;c[e>>2]=0;return}else if((b|0)==3){aU[c[c[f>>2]>>2]&255](f);i=a[5251712]|0;if((i&255)>=14){aK(5243252,173,5249472,5244088)}h=d+12+((i&255)<<2)|0;c[f>>2]=c[h>>2]|0;c[h>>2]=f;c[e>>2]=0;return}else if((b|0)==0){aU[c[c[f>>2]>>2]&255](f);b=a[5251692]|0;if((b&255)>=14){aK(5243252,173,5249472,5244088)}h=d+12+((b&255)<<2)|0;c[f>>2]=c[h>>2]|0;c[h>>2]=f;c[e>>2]=0;return}else{aK(5245908,115,5247852,5245900)}}function cj(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;i=b+40|0;c[i>>2]=d;c[b+44>>2]=e;c[b+48>>2]=f;c[b+28>>2]=0;c[b+36>>2]=0;c[b+32>>2]=0;j=b|0;c[j>>2]=g;c[b+4>>2]=h;h=d<<2;d=g+102796|0;k=c[d>>2]|0;if((k|0)>=32){aK(5243112,38,5249252,5244052)}l=g+102412+(k*12&-1)|0;c[g+102412+(k*12&-1)+4>>2]=h;m=g+102400|0;n=c[m>>2]|0;if((n+h|0)>102400){c[l>>2]=dr(h)|0;a[g+102412+(k*12&-1)+8|0]=1}else{c[l>>2]=g+n|0;a[g+102412+(k*12&-1)+8|0]=0;c[m>>2]=(c[m>>2]|0)+h|0}m=g+102404|0;k=(c[m>>2]|0)+h|0;c[m>>2]=k;m=g+102408|0;g=c[m>>2]|0;c[m>>2]=(g|0)>(k|0)?g:k;c[d>>2]=(c[d>>2]|0)+1|0;c[b+8>>2]=c[l>>2]|0;l=c[j>>2]|0;d=e<<2;e=l+102796|0;k=c[e>>2]|0;if((k|0)>=32){aK(5243112,38,5249252,5244052)}g=l+102412+(k*12&-1)|0;c[l+102412+(k*12&-1)+4>>2]=d;m=l+102400|0;h=c[m>>2]|0;if((h+d|0)>102400){c[g>>2]=dr(d)|0;a[l+102412+(k*12&-1)+8|0]=1}else{c[g>>2]=l+h|0;a[l+102412+(k*12&-1)+8|0]=0;c[m>>2]=(c[m>>2]|0)+d|0}m=l+102404|0;k=(c[m>>2]|0)+d|0;c[m>>2]=k;m=l+102408|0;l=c[m>>2]|0;c[m>>2]=(l|0)>(k|0)?l:k;c[e>>2]=(c[e>>2]|0)+1|0;c[b+12>>2]=c[g>>2]|0;g=c[j>>2]|0;e=f<<2;f=g+102796|0;k=c[f>>2]|0;if((k|0)>=32){aK(5243112,38,5249252,5244052)}l=g+102412+(k*12&-1)|0;c[g+102412+(k*12&-1)+4>>2]=e;m=g+102400|0;d=c[m>>2]|0;if((d+e|0)>102400){c[l>>2]=dr(e)|0;a[g+102412+(k*12&-1)+8|0]=1}else{c[l>>2]=g+d|0;a[g+102412+(k*12&-1)+8|0]=0;c[m>>2]=(c[m>>2]|0)+e|0}m=g+102404|0;k=(c[m>>2]|0)+e|0;c[m>>2]=k;m=g+102408|0;g=c[m>>2]|0;c[m>>2]=(g|0)>(k|0)?g:k;c[f>>2]=(c[f>>2]|0)+1|0;c[b+16>>2]=c[l>>2]|0;l=c[j>>2]|0;f=(c[i>>2]|0)*12&-1;k=l+102796|0;g=c[k>>2]|0;if((g|0)>=32){aK(5243112,38,5249252,5244052)}m=l+102412+(g*12&-1)|0;c[l+102412+(g*12&-1)+4>>2]=f;e=l+102400|0;d=c[e>>2]|0;if((d+f|0)>102400){c[m>>2]=dr(f)|0;a[l+102412+(g*12&-1)+8|0]=1}else{c[m>>2]=l+d|0;a[l+102412+(g*12&-1)+8|0]=0;c[e>>2]=(c[e>>2]|0)+f|0}e=l+102404|0;g=(c[e>>2]|0)+f|0;c[e>>2]=g;e=l+102408|0;l=c[e>>2]|0;c[e>>2]=(l|0)>(g|0)?l:g;c[k>>2]=(c[k>>2]|0)+1|0;c[b+24>>2]=c[m>>2]|0;m=c[j>>2]|0;j=(c[i>>2]|0)*12&-1;i=m+102796|0;k=c[i>>2]|0;if((k|0)>=32){aK(5243112,38,5249252,5244052)}g=m+102412+(k*12&-1)|0;c[m+102412+(k*12&-1)+4>>2]=j;l=m+102400|0;e=c[l>>2]|0;if((e+j|0)>102400){c[g>>2]=dr(j)|0;a[m+102412+(k*12&-1)+8|0]=1;f=m+102404|0;d=c[f>>2]|0;h=d+j|0;c[f>>2]=h;n=m+102408|0;o=c[n>>2]|0;p=(o|0)>(h|0);q=p?o:h;c[n>>2]=q;r=c[i>>2]|0;s=r+1|0;c[i>>2]=s;t=g|0;u=c[t>>2]|0;v=u;w=b+20|0;c[w>>2]=v;return}else{c[g>>2]=m+e|0;a[m+102412+(k*12&-1)+8|0]=0;c[l>>2]=(c[l>>2]|0)+j|0;f=m+102404|0;d=c[f>>2]|0;h=d+j|0;c[f>>2]=h;n=m+102408|0;o=c[n>>2]|0;p=(o|0)>(h|0);q=p?o:h;c[n>>2]=q;r=c[i>>2]|0;s=r+1|0;c[i>>2]=s;t=g|0;u=c[t>>2]|0;v=u;w=b+20|0;c[w>>2]=v;return}}function ck(d,e,f,h,j){d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0.0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0.0,D=0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,O=0.0,R=0.0,S=0,T=0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0.0,af=0.0,ag=0;l=i;i=i+148|0;m=l|0;n=l+20|0;o=l+52|0;p=l+96|0;q=+g[f>>2];r=d+28|0;L1714:do{if((c[r>>2]|0)>0){s=d+8|0;t=h|0;u=h+4|0;v=d+20|0;w=d+24|0;x=0;while(1){y=c[(c[s>>2]|0)+(x<<2)>>2]|0;z=y+44|0;A=c[z>>2]|0;B=c[z+4>>2]|0;C=+g[y+56>>2];z=y+64|0;D=c[z+4>>2]|0;E=(c[k>>2]=c[z>>2]|0,+g[k>>2]);F=(c[k>>2]=D,+g[k>>2]);G=+g[y+72>>2];D=y+36|0;c[D>>2]=A;c[D+4>>2]=B;g[y+52>>2]=C;if((c[y>>2]|0)==2){H=+g[y+140>>2];I=+g[y+120>>2];J=1.0-q*+g[y+132>>2];K=J<1.0?J:1.0;J=K<0.0?0.0:K;K=1.0-q*+g[y+136>>2];L=K<1.0?K:1.0;M=(G+q*+g[y+128>>2]*+g[y+84>>2])*(L<0.0?0.0:L);O=(E+q*(H*+g[t>>2]+I*+g[y+76>>2]))*J;R=(F+q*(H*+g[u>>2]+I*+g[y+80>>2]))*J}else{M=G;O=E;R=F}y=(c[v>>2]|0)+(x*12&-1)|0;c[y>>2]=A;c[y+4>>2]=B;g[(c[v>>2]|0)+(x*12&-1)+8>>2]=C;B=(c[w>>2]|0)+(x*12&-1)|0;y=(g[k>>2]=O,c[k>>2]|0);A=(g[k>>2]=R,c[k>>2]|0)|0;c[B>>2]=0|y;c[B+4>>2]=A;g[(c[w>>2]|0)+(x*12&-1)+8>>2]=M;A=x+1|0;if((A|0)<(c[r>>2]|0)){x=A}else{S=v;T=w;break L1714}}}else{S=d+20|0;T=d+24|0}}while(0);h=f;dw(n|0,h|0,24);w=c[S>>2]|0;c[n+24>>2]=w;v=c[T>>2]|0;c[n+28>>2]=v;dw(o|0,h|0,24);h=d+12|0;c[o+24>>2]=c[h>>2]|0;x=d+36|0;c[o+28>>2]=c[x>>2]|0;c[o+32>>2]=w;c[o+36>>2]=v;c[o+40>>2]=c[d>>2]|0;cN(p,o);cO(p);if((a[f+20|0]&1)<<24>>24!=0){cP(p)}o=d+32|0;L1727:do{if((c[o>>2]|0)>0){v=d+16|0;w=0;while(1){u=c[(c[v>>2]|0)+(w<<2)>>2]|0;aV[c[(c[u>>2]|0)+28>>2]&255](u,n);u=w+1|0;if((u|0)<(c[o>>2]|0)){w=u}else{break L1727}}}}while(0);g[e+12>>2]=0.0;w=f+12|0;L1733:do{if((c[w>>2]|0)>0){v=d+16|0;u=0;while(1){L1737:do{if((c[o>>2]|0)>0){t=0;while(1){s=c[(c[v>>2]|0)+(t<<2)>>2]|0;aV[c[(c[s>>2]|0)+32>>2]&255](s,n);s=t+1|0;if((s|0)<(c[o>>2]|0)){t=s}else{break L1737}}}}while(0);cR(p);t=u+1|0;if((t|0)<(c[w>>2]|0)){u=t}else{break L1733}}}}while(0);w=c[p+48>>2]|0;L1744:do{if((w|0)>0){u=c[p+40>>2]|0;v=c[p+44>>2]|0;t=0;while(1){s=c[v+(c[u+(t*152&-1)+148>>2]<<2)>>2]|0;A=u+(t*152&-1)+144|0;L1748:do{if((c[A>>2]|0)>0){B=0;while(1){g[s+64+(B*20&-1)+8>>2]=+g[u+(t*152&-1)+(B*36&-1)+16>>2];g[s+64+(B*20&-1)+12>>2]=+g[u+(t*152&-1)+(B*36&-1)+20>>2];y=B+1|0;if((y|0)<(c[A>>2]|0)){B=y}else{break L1748}}}}while(0);A=t+1|0;if((A|0)<(w|0)){t=A}else{break L1744}}}}while(0);g[e+16>>2]=0.0;L1753:do{if((c[r>>2]|0)>0){w=0;while(1){t=c[S>>2]|0;u=t+(w*12&-1)|0;v=c[u+4>>2]|0;M=(c[k>>2]=c[u>>2]|0,+g[k>>2]);R=(c[k>>2]=v,+g[k>>2]);O=+g[t+(w*12&-1)+8>>2];t=c[T>>2]|0;v=t+(w*12&-1)|0;A=c[v+4>>2]|0;C=(c[k>>2]=c[v>>2]|0,+g[k>>2]);F=(c[k>>2]=A,+g[k>>2]);E=+g[t+(w*12&-1)+8>>2];G=q*C;J=q*F;I=G*G+J*J;if(I>4.0){J=2.0/+N(+I);U=C*J;V=F*J}else{U=C;V=F}F=q*E;if(F*F>2.4674012660980225){if(F>0.0){W=F}else{W=-0.0-F}X=E*(1.5707963705062866/W)}else{X=E}t=(g[k>>2]=M+q*U,c[k>>2]|0);A=(g[k>>2]=R+q*V,c[k>>2]|0)|0;c[u>>2]=0|t;c[u+4>>2]=A;g[(c[S>>2]|0)+(w*12&-1)+8>>2]=O+q*X;A=(c[T>>2]|0)+(w*12&-1)|0;u=(g[k>>2]=U,c[k>>2]|0);t=(g[k>>2]=V,c[k>>2]|0)|0;c[A>>2]=0|u;c[A+4>>2]=t;g[(c[T>>2]|0)+(w*12&-1)+8>>2]=X;t=w+1|0;if((t|0)<(c[r>>2]|0)){w=t}else{break L1753}}}}while(0);w=f+16|0;f=d+16|0;t=0;while(1){if((t|0)>=(c[w>>2]|0)){Y=1;break}A=cQ(p)|0;L1770:do{if((c[o>>2]|0)>0){u=1;v=0;while(1){s=c[(c[f>>2]|0)+(v<<2)>>2]|0;B=u&a0[c[(c[s>>2]|0)+36>>2]&255](s,n);s=v+1|0;if((s|0)<(c[o>>2]|0)){u=B;v=s}else{Z=B;break L1770}}}else{Z=1}}while(0);if(A&Z){Y=0;break}else{t=t+1|0}}L1776:do{if((c[r>>2]|0)>0){t=d+8|0;Z=0;while(1){o=c[(c[t>>2]|0)+(Z<<2)>>2]|0;n=(c[S>>2]|0)+(Z*12&-1)|0;f=o+44|0;w=c[n>>2]|0;v=c[n+4>>2]|0;c[f>>2]=w;c[f+4>>2]=v;X=+g[(c[S>>2]|0)+(Z*12&-1)+8>>2];g[o+56>>2]=X;f=(c[T>>2]|0)+(Z*12&-1)|0;n=o+64|0;u=c[f+4>>2]|0;c[n>>2]=c[f>>2]|0;c[n+4>>2]=u;g[o+72>>2]=+g[(c[T>>2]|0)+(Z*12&-1)+8>>2];V=+Q(+X);g[o+20>>2]=V;U=+P(+X);g[o+24>>2]=U;X=+g[o+28>>2];W=+g[o+32>>2];O=(c[k>>2]=w,+g[k>>2])-(U*X-V*W);R=(c[k>>2]=v,+g[k>>2])-(V*X+U*W);v=o+12|0;o=(g[k>>2]=O,c[k>>2]|0);w=(g[k>>2]=R,c[k>>2]|0)|0;c[v>>2]=0|o;c[v+4>>2]=w;w=Z+1|0;if((w|0)<(c[r>>2]|0)){Z=w}else{break L1776}}}}while(0);g[e+20>>2]=0.0;e=c[p+40>>2]|0;T=d+4|0;L1781:do{if((c[T>>2]|0)!=0){if((c[x>>2]|0)<=0){break}S=m+16|0;Z=0;while(1){t=c[(c[h>>2]|0)+(Z<<2)>>2]|0;A=c[e+(Z*152&-1)+144>>2]|0;c[S>>2]=A;L1786:do{if((A|0)>0){w=0;while(1){g[m+(w<<2)>>2]=+g[e+(Z*152&-1)+(w*36&-1)+16>>2];g[m+8+(w<<2)>>2]=+g[e+(Z*152&-1)+(w*36&-1)+20>>2];v=w+1|0;if((v|0)==(A|0)){break L1786}else{w=v}}}}while(0);A=c[T>>2]|0;aY[c[(c[A>>2]|0)+20>>2]&255](A,t,m);A=Z+1|0;if((A|0)<(c[x>>2]|0)){Z=A}else{break L1781}}}}while(0);if(!j){_=p+32|0;$=c[_>>2]|0;aa=e;bZ($,aa);ab=p+36|0;ac=c[ab>>2]|0;ad=ac;bZ($,ad);i=l;return}j=c[r>>2]|0;L1795:do{if((j|0)>0){x=d+8|0;R=3.4028234663852886e+38;m=0;while(1){T=c[(c[x>>2]|0)+(m<<2)>>2]|0;L1799:do{if((c[T>>2]|0)==0){ae=R}else{do{if((b[T+4>>1]&4)<<16>>16!=0){O=+g[T+72>>2];if(O*O>.001218469929881394){break}O=+g[T+64>>2];W=+g[T+68>>2];if(O*O+W*W>9999999747378752.0e-20){break}h=T+144|0;W=q+ +g[h>>2];g[h>>2]=W;ae=R<W?R:W;break L1799}}while(0);g[T+144>>2]=0.0;ae=0.0}}while(0);T=m+1|0;t=c[r>>2]|0;if((T|0)<(t|0)){R=ae;m=T}else{af=ae;ag=t;break L1795}}}else{af=3.4028234663852886e+38;ag=j}}while(0);if(!((ag|0)>0&((af<.5|Y)^1))){_=p+32|0;$=c[_>>2]|0;aa=e;bZ($,aa);ab=p+36|0;ac=c[ab>>2]|0;ad=ac;bZ($,ad);i=l;return}Y=d+8|0;d=0;while(1){ag=c[(c[Y>>2]|0)+(d<<2)>>2]|0;j=ag+4|0;b[j>>1]=b[j>>1]&-3;g[ag+144>>2]=0.0;dx(ag+64|0,0,24);ag=d+1|0;if((ag|0)<(c[r>>2]|0)){d=ag}else{break}}_=p+32|0;$=c[_>>2]|0;aa=e;bZ($,aa);ab=p+36|0;ac=c[ab>>2]|0;ad=ac;bZ($,ad);i=l;return}function cl(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0,O=0,R=0,S=0,T=0,U=0;f=i;i=i+116|0;h=f|0;j=f+20|0;l=f+64|0;m=a+28|0;n=c[m>>2]|0;if((n|0)<=(d|0)){aK(5245628,386,5248056,5246312)}if((n|0)<=(e|0)){aK(5245628,387,5248056,5245352)}L1821:do{if((n|0)>0){o=a+8|0;p=a+20|0;q=a+24|0;r=0;while(1){s=c[(c[o>>2]|0)+(r<<2)>>2]|0;t=s+44|0;u=(c[p>>2]|0)+(r*12&-1)|0;v=c[t+4>>2]|0;c[u>>2]=c[t>>2]|0;c[u+4>>2]=v;g[(c[p>>2]|0)+(r*12&-1)+8>>2]=+g[s+56>>2];v=s+64|0;u=(c[q>>2]|0)+(r*12&-1)|0;t=c[v+4>>2]|0;c[u>>2]=c[v>>2]|0;c[u+4>>2]=t;g[(c[q>>2]|0)+(r*12&-1)+8>>2]=+g[s+72>>2];s=r+1|0;if((s|0)<(c[m>>2]|0)){r=s}else{w=p;x=q;break L1821}}}else{w=a+20|0;x=a+24|0}}while(0);n=a+12|0;c[j+24>>2]=c[n>>2]|0;q=a+36|0;c[j+28>>2]=c[q>>2]|0;c[j+40>>2]=c[a>>2]|0;dw(j|0,b|0,24);c[j+32>>2]=c[w>>2]|0;c[j+36>>2]=c[x>>2]|0;cN(l,j);j=b+16|0;p=0;while(1){if((p|0)>=(c[j>>2]|0)){break}if(cV(l,d,e)|0){break}else{p=p+1|0}}p=a+8|0;j=(c[w>>2]|0)+(d*12&-1)|0;r=(c[(c[p>>2]|0)+(d<<2)>>2]|0)+36|0;o=c[j+4>>2]|0;c[r>>2]=c[j>>2]|0;c[r+4>>2]=o;g[(c[(c[p>>2]|0)+(d<<2)>>2]|0)+52>>2]=+g[(c[w>>2]|0)+(d*12&-1)+8>>2];d=(c[w>>2]|0)+(e*12&-1)|0;o=(c[(c[p>>2]|0)+(e<<2)>>2]|0)+36|0;r=c[d+4>>2]|0;c[o>>2]=c[d>>2]|0;c[o+4>>2]=r;g[(c[(c[p>>2]|0)+(e<<2)>>2]|0)+52>>2]=+g[(c[w>>2]|0)+(e*12&-1)+8>>2];cO(l);e=b+12|0;L1833:do{if((c[e>>2]|0)>0){r=0;while(1){cR(l);o=r+1|0;if((o|0)<(c[e>>2]|0)){r=o}else{break L1833}}}}while(0);y=+g[b>>2];L1838:do{if((c[m>>2]|0)>0){b=0;while(1){e=c[w>>2]|0;r=e+(b*12&-1)|0;o=c[r+4>>2]|0;z=(c[k>>2]=c[r>>2]|0,+g[k>>2]);A=(c[k>>2]=o,+g[k>>2]);B=+g[e+(b*12&-1)+8>>2];e=c[x>>2]|0;o=e+(b*12&-1)|0;d=c[o+4>>2]|0;C=(c[k>>2]=c[o>>2]|0,+g[k>>2]);D=(c[k>>2]=d,+g[k>>2]);E=+g[e+(b*12&-1)+8>>2];F=y*C;G=y*D;H=F*F+G*G;if(H>4.0){G=2.0/+N(+H);I=C*G;J=D*G}else{I=C;J=D}D=y*E;if(D*D>2.4674012660980225){if(D>0.0){K=D}else{K=-0.0-D}L=E*(1.5707963705062866/K)}else{L=E}E=z+y*I;z=A+y*J;A=B+y*L;e=(g[k>>2]=E,c[k>>2]|0);d=0|e;e=(g[k>>2]=z,c[k>>2]|0)|0;c[r>>2]=d;c[r+4>>2]=e;g[(c[w>>2]|0)+(b*12&-1)+8>>2]=A;r=(c[x>>2]|0)+(b*12&-1)|0;o=(g[k>>2]=I,c[k>>2]|0);j=0|o;o=(g[k>>2]=J,c[k>>2]|0)|0;c[r>>2]=j;c[r+4>>2]=o;g[(c[x>>2]|0)+(b*12&-1)+8>>2]=L;r=c[(c[p>>2]|0)+(b<<2)>>2]|0;s=r+44|0;c[s>>2]=d;c[s+4>>2]=e;g[r+56>>2]=A;e=r+64|0;c[e>>2]=j;c[e+4>>2]=o;g[r+72>>2]=L;B=+Q(+A);g[r+20>>2]=B;D=+P(+A);g[r+24>>2]=D;A=+g[r+28>>2];C=+g[r+32>>2];o=r+12|0;r=(g[k>>2]=E-(D*A-B*C),c[k>>2]|0);e=(g[k>>2]=z-(B*A+D*C),c[k>>2]|0)|0;c[o>>2]=0|r;c[o+4>>2]=e;e=b+1|0;if((e|0)<(c[m>>2]|0)){b=e}else{break L1838}}}}while(0);m=c[l+40>>2]|0;p=a+4|0;if((c[p>>2]|0)==0){M=l+32|0;O=c[M>>2]|0;R=m;bZ(O,R);S=l+36|0;T=c[S>>2]|0;U=T;bZ(O,U);i=f;return}if((c[q>>2]|0)<=0){M=l+32|0;O=c[M>>2]|0;R=m;bZ(O,R);S=l+36|0;T=c[S>>2]|0;U=T;bZ(O,U);i=f;return}a=h+16|0;x=0;while(1){w=c[(c[n>>2]|0)+(x<<2)>>2]|0;b=c[m+(x*152&-1)+144>>2]|0;c[a>>2]=b;L1859:do{if((b|0)>0){e=0;while(1){g[h+(e<<2)>>2]=+g[m+(x*152&-1)+(e*36&-1)+16>>2];g[h+8+(e<<2)>>2]=+g[m+(x*152&-1)+(e*36&-1)+20>>2];o=e+1|0;if((o|0)==(b|0)){break L1859}else{e=o}}}}while(0);b=c[p>>2]|0;aY[c[(c[b>>2]|0)+20>>2]&255](b,w,h);b=x+1|0;if((b|0)<(c[q>>2]|0)){x=b}else{break}}M=l+32|0;O=c[M>>2]|0;R=m;bZ(O,R);S=l+36|0;T=c[S>>2]|0;U=T;bZ(O,U);i=f;return}function cm(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0;e=b|0;f=b+8|0;c[f>>2]=128;c[b+4>>2]=0;h=dr(1024)|0;c[b>>2]=h;dx(h|0,0,c[f>>2]<<3|0);dx(b+12|0,0,56);do{if((a[5251668]&1)<<24>>24==0){f=0;h=1;while(1){if((f|0)>=14){i=1435;break}if((h|0)>(c[5252316+(f<<2)>>2]|0)){j=f+1|0;a[h+5251672|0]=j&255;k=j}else{a[h+5251672|0]=f&255;k=f}j=h+1|0;if((j|0)<641){f=k;h=j}else{i=1440;break}}if((i|0)==1440){a[5251668]=1;break}else if((i|0)==1435){aK(5243252,73,5249392,5245672)}}}while(0);c[b+102468>>2]=0;c[b+102472>>2]=0;c[b+102476>>2]=0;c[b+102864>>2]=0;bk(b+102872|0);c[b+102932>>2]=0;c[b+102936>>2]=0;c[b+102940>>2]=5242940;c[b+102944>>2]=5242936;i=b+102948|0;c[b+102980>>2]=0;c[b+102984>>2]=0;dx(i|0,0,20);a[b+102992|0]=1;a[b+102993|0]=1;a[b+102994|0]=0;a[b+102995|0]=1;a[b+102976|0]=1;k=d;d=b+102968|0;h=c[k+4>>2]|0;c[d>>2]=c[k>>2]|0;c[d+4>>2]=h;c[b+102868>>2]=4;g[b+102988>>2]=0.0;c[i>>2]=e;dx(b+102996|0,0,32);return}function cn(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;b=c[a+102952>>2]|0;L1879:do{if((b|0)!=0){d=a|0;e=b;while(1){f=c[e+96>>2]|0;g=c[e+100>>2]|0;while(1){if((g|0)==0){break}h=c[g+4>>2]|0;c[g+28>>2]=0;ci(g,d);g=h}if((f|0)==0){break L1879}else{e=f}}}}while(0);ds(c[a+102904>>2]|0);ds(c[a+102916>>2]|0);ds(c[a+102876>>2]|0);if((c[a+102468>>2]|0)!=0){aK(5243112,32,5249212,5245612)}if((c[a+102864>>2]|0)!=0){aK(5243112,33,5249212,5244576)}b=a+4|0;e=a|0;a=c[e>>2]|0;if((c[b>>2]|0)>0){i=0;j=a}else{k=a;l=k;ds(l);return}while(1){ds(c[j+(i<<3)+4>>2]|0);a=i+1|0;d=c[e>>2]|0;if((a|0)<(c[b>>2]|0)){i=a;j=d}else{k=d;break}}l=k;ds(l);return}function co(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0.0,ah=0.0,ai=0.0,aj=0.0,ak=0.0;f=i;i=i+100|0;h=f|0;j=f+16|0;l=f+68|0;m=d+103008|0;g[m>>2]=0.0;n=d+103012|0;g[n>>2]=0.0;o=d+103016|0;g[o>>2]=0.0;p=d+102960|0;q=d+102872|0;r=d+68|0;cj(j,c[p>>2]|0,c[d+102936>>2]|0,c[d+102964>>2]|0,r,c[d+102944>>2]|0);s=d+102952|0;t=c[s>>2]|0;L1902:do{if((t|0)!=0){u=t;while(1){v=u+4|0;b[v>>1]=b[v>>1]&-2;v=c[u+96>>2]|0;if((v|0)==0){break L1902}else{u=v}}}}while(0);t=c[d+102932>>2]|0;L1906:do{if((t|0)!=0){u=t;while(1){v=u+4|0;c[v>>2]=c[v>>2]&-2;v=c[u+12>>2]|0;if((v|0)==0){break L1906}else{u=v}}}}while(0);t=c[d+102956>>2]|0;L1910:do{if((t|0)!=0){u=t;while(1){a[u+60|0]=0;v=c[u+12>>2]|0;if((v|0)==0){break L1910}else{u=v}}}}while(0);t=c[p>>2]|0;p=t<<2;u=d+102864|0;v=c[u>>2]|0;if((v|0)>=32){aK(5243112,38,5249252,5244052)}w=d+102480+(v*12&-1)|0;c[d+102480+(v*12&-1)+4>>2]=p;x=d+102468|0;y=c[x>>2]|0;if((y+p|0)>102400){c[w>>2]=dr(p)|0;a[d+102480+(v*12&-1)+8|0]=1}else{c[w>>2]=y+(d+68)|0;a[d+102480+(v*12&-1)+8|0]=0;c[x>>2]=(c[x>>2]|0)+p|0}x=d+102472|0;v=(c[x>>2]|0)+p|0;c[x>>2]=v;x=d+102476|0;p=c[x>>2]|0;c[x>>2]=(p|0)>(v|0)?p:v;c[u>>2]=(c[u>>2]|0)+1|0;u=c[w>>2]|0;w=u;v=c[s>>2]|0;L1922:do{if((v|0)!=0){p=j+28|0;x=j+36|0;y=j+32|0;z=j+40|0;A=j+8|0;B=j+48|0;C=j+16|0;D=j+44|0;E=j+12|0;F=d+102968|0;G=d+102976|0;H=l+12|0;I=l+16|0;J=l+20|0;K=v;L1924:while(1){L=K+4|0;L1926:do{if((b[L>>1]&35)<<16>>16==34){if((c[K>>2]|0)==0){break}c[p>>2]=0;c[x>>2]=0;c[y>>2]=0;c[w>>2]=K;b[L>>1]=b[L>>1]|1;M=1;while(1){N=M-1|0;O=c[w+(N<<2)>>2]|0;R=O+4|0;if((b[R>>1]&32)<<16>>16==0){S=1496;break L1924}T=c[p>>2]|0;if((T|0)>=(c[z>>2]|0)){S=1499;break L1924}c[O+8>>2]=T;c[(c[A>>2]|0)+(c[p>>2]<<2)>>2]=O;c[p>>2]=(c[p>>2]|0)+1|0;T=b[R>>1]|0;if((T&2)<<16>>16==0){b[R>>1]=T|2;g[O+144>>2]=0.0}L1936:do{if((c[O>>2]|0)==0){U=N}else{T=c[O+112>>2]|0;L1938:do{if((T|0)==0){V=N}else{R=N;W=T;while(1){X=c[W+4>>2]|0;Y=X+4|0;do{if((c[Y>>2]&7|0)==6){if((a[(c[X+48>>2]|0)+38|0]&1)<<24>>24!=0){Z=R;break}if((a[(c[X+52>>2]|0)+38|0]&1)<<24>>24!=0){Z=R;break}_=c[x>>2]|0;if((_|0)>=(c[D>>2]|0)){S=1510;break L1924}c[x>>2]=_+1|0;c[(c[E>>2]|0)+(_<<2)>>2]=X;c[Y>>2]=c[Y>>2]|1;_=c[W>>2]|0;$=_+4|0;if((b[$>>1]&1)<<16>>16!=0){Z=R;break}if((R|0)>=(t|0)){S=1514;break L1924}c[w+(R<<2)>>2]=_;b[$>>1]=b[$>>1]|1;Z=R+1|0}else{Z=R}}while(0);Y=c[W+12>>2]|0;if((Y|0)==0){V=Z;break L1938}else{R=Z;W=Y}}}}while(0);T=c[O+108>>2]|0;if((T|0)==0){U=V;break}else{aa=V;ab=T}while(1){T=ab+4|0;W=c[T>>2]|0;do{if((a[W+60|0]&1)<<24>>24==0){R=c[ab>>2]|0;Y=R+4|0;if((b[Y>>1]&32)<<16>>16==0){ac=aa;break}X=c[y>>2]|0;if((X|0)>=(c[B>>2]|0)){S=1522;break L1924}c[y>>2]=X+1|0;c[(c[C>>2]|0)+(X<<2)>>2]=W;a[(c[T>>2]|0)+60|0]=1;if((b[Y>>1]&1)<<16>>16!=0){ac=aa;break}if((aa|0)>=(t|0)){S=1526;break L1924}c[w+(aa<<2)>>2]=R;b[Y>>1]=b[Y>>1]|1;ac=aa+1|0}else{ac=aa}}while(0);T=c[ab+12>>2]|0;if((T|0)==0){U=ac;break L1936}else{aa=ac;ab=T}}}}while(0);if((U|0)>0){M=U}else{break}}ck(j,l,e,F,(a[G]&1)<<24>>24!=0);g[m>>2]=+g[H>>2]+ +g[m>>2];g[n>>2]=+g[I>>2]+ +g[n>>2];g[o>>2]=+g[J>>2]+ +g[o>>2];M=c[p>>2]|0;if((M|0)>0){ad=0;ae=M}else{break}while(1){M=c[(c[A>>2]|0)+(ad<<2)>>2]|0;if((c[M>>2]|0)==0){O=M+4|0;b[O>>1]=b[O>>1]&-2;af=c[p>>2]|0}else{af=ae}O=ad+1|0;if((O|0)<(af|0)){ad=O;ae=af}else{break L1926}}}}while(0);L=c[K+96>>2]|0;if((L|0)==0){break L1922}else{K=L}}if((S|0)==1522){aK(5244808,68,5248148,5244776)}else if((S|0)==1526){aK(5245572,524,5248256,5243600)}else if((S|0)==1510){aK(5244808,62,5248116,5244664)}else if((S|0)==1499){aK(5244808,54,5248180,5244544)}else if((S|0)==1514){aK(5245572,495,5248256,5243600)}else if((S|0)==1496){aK(5245572,445,5248256,5243920)}}}while(0);bZ(r,u);u=c[s>>2]|0;L1983:do{if((u|0)!=0){s=h+8|0;r=h+12|0;S=h;af=u;while(1){L1987:do{if((b[af+4>>1]&1)<<16>>16!=0){if((c[af>>2]|0)==0){break}ag=+g[af+52>>2];ah=+Q(+ag);g[s>>2]=ah;ai=+P(+ag);g[r>>2]=ai;ag=+g[af+28>>2];aj=+g[af+32>>2];ak=+g[af+40>>2]-(ah*ag+ai*aj);ae=(g[k>>2]=+g[af+36>>2]-(ai*ag-ah*aj),c[k>>2]|0);ad=(g[k>>2]=ak,c[k>>2]|0)|0;c[S>>2]=0|ae;c[S+4>>2]=ad;ad=(c[af+88>>2]|0)+102872|0;ae=c[af+100>>2]|0;if((ae|0)==0){break}o=af+12|0;n=ae;while(1){ch(n,ad,h,o);ae=c[n+4>>2]|0;if((ae|0)==0){break L1987}else{n=ae}}}}while(0);n=c[af+96>>2]|0;if((n|0)==0){break L1983}else{af=n}}}}while(0);b8(q|0,q);g[d+103020>>2]=0.0;d=j|0;bZ(c[d>>2]|0,c[j+20>>2]|0);bZ(c[d>>2]|0,c[j+24>>2]|0);bZ(c[d>>2]|0,c[j+16>>2]|0);bZ(c[d>>2]|0,c[j+12>>2]|0);bZ(c[d>>2]|0,c[j+8>>2]|0);i=f;return}function cp(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0.0,ah=0,ai=0,aj=0,ak=0,al=0.0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0.0,av=0.0,aw=0.0,ax=0,ay=0.0,az=0.0,aA=0,aB=0,aC=0.0,aD=0.0,aE=0.0,aF=0,aG=0,aH=0.0,aI=0,aJ=0,aL=0,aM=0,aN=0,aO=0,aP=0,aQ=0,aR=0,aS=0,aT=0,aU=0,aV=0,aW=0;f=i;i=i+348|0;h=f|0;j=f+16|0;l=f+68|0;m=f+200|0;n=f+208|0;o=f+244|0;p=f+280|0;q=f+288|0;r=f+324|0;s=d+102872|0;t=d+102944|0;cj(j,64,32,0,d+68|0,c[t>>2]|0);u=d+102995|0;L1998:do{if((a[u]&1)<<24>>24==0){v=d+102932|0}else{w=c[d+102952>>2]|0;L2001:do{if((w|0)!=0){x=w;while(1){y=x+4|0;b[y>>1]=b[y>>1]&-2;g[x+60>>2]=0.0;y=c[x+96>>2]|0;if((y|0)==0){break L2001}else{x=y}}}}while(0);w=d+102932|0;x=c[w>>2]|0;if((x|0)==0){v=w;break}else{z=x}while(1){x=z+4|0;c[x>>2]=c[x>>2]&-34;c[z+128>>2]=0;g[z+132>>2]=1.0;x=c[z+12>>2]|0;if((x|0)==0){v=w;break L1998}else{z=x}}}}while(0);z=n;n=o;o=j+28|0;w=j+36|0;x=j+32|0;y=j+40|0;A=j+8|0;B=j+44|0;C=j+12|0;D=p|0;E=p+4|0;F=q;q=e|0;G=r|0;H=r+4|0;I=r+8|0;J=r+16|0;K=e+12|0;e=r+12|0;L=r+20|0;M=s|0;N=d+102994|0;d=h+8|0;O=h+12|0;R=h;S=l+16|0;T=l+20|0;U=l+24|0;V=l+44|0;W=l+48|0;X=l+52|0;Y=l|0;Z=l+28|0;_=l+56|0;$=l+92|0;aa=l+128|0;ab=m|0;ac=m+4|0;L2008:while(1){ad=c[v>>2]|0;if((ad|0)==0){ae=1;af=1676;break}else{ag=1.0;ah=0;ai=ad}while(1){ad=ai+4|0;aj=c[ad>>2]|0;do{if((aj&4|0)==0){ak=ah;al=ag}else{if((c[ai+128>>2]|0)>8){ak=ah;al=ag;break}if((aj&32|0)==0){am=c[ai+48>>2]|0;an=c[ai+52>>2]|0;if((a[am+38|0]&1)<<24>>24!=0){ak=ah;al=ag;break}if((a[an+38|0]&1)<<24>>24!=0){ak=ah;al=ag;break}ao=c[am+8>>2]|0;ap=c[an+8>>2]|0;aq=c[ao>>2]|0;ar=c[ap>>2]|0;if(!((aq|0)==2|(ar|0)==2)){af=1575;break L2008}as=b[ao+4>>1]|0;at=b[ap+4>>1]|0;if(!((as&2)<<16>>16!=0&(aq|0)!=0|(at&2)<<16>>16!=0&(ar|0)!=0)){ak=ah;al=ag;break}if(!((as&8)<<16>>16!=0|(aq|0)!=2|((at&8)<<16>>16!=0|(ar|0)!=2))){ak=ah;al=ag;break}ar=ao+28|0;at=ao+60|0;au=+g[at>>2];aq=ap+28|0;as=ap+60|0;av=+g[as>>2];do{if(au<av){if(au>=1.0){af=1581;break L2008}aw=(av-au)/(1.0-au);ax=ao+36|0;ay=1.0-aw;az=ay*+g[ao+40>>2]+aw*+g[ao+48>>2];aA=ax;aB=(g[k>>2]=+g[ax>>2]*ay+aw*+g[ao+44>>2],c[k>>2]|0);ax=(g[k>>2]=az,c[k>>2]|0)|0;c[aA>>2]=0|aB;c[aA+4>>2]=ax;ax=ao+52|0;g[ax>>2]=ay*+g[ax>>2]+aw*+g[ao+56>>2];g[at>>2]=av;aC=av}else{if(av>=au){aC=au;break}if(av>=1.0){af=1586;break L2008}aw=(au-av)/(1.0-av);ax=ap+36|0;ay=1.0-aw;az=ay*+g[ap+40>>2]+aw*+g[ap+48>>2];aA=ax;aB=(g[k>>2]=+g[ax>>2]*ay+aw*+g[ap+44>>2],c[k>>2]|0);ax=(g[k>>2]=az,c[k>>2]|0)|0;c[aA>>2]=0|aB;c[aA+4>>2]=ax;ax=ap+52|0;g[ax>>2]=ay*+g[ax>>2]+aw*+g[ap+56>>2];g[as>>2]=au;aC=au}}while(0);if(aC>=1.0){af=1590;break L2008}as=c[ai+56>>2]|0;ap=c[ai+60>>2]|0;c[S>>2]=0;c[T>>2]=0;g[U>>2]=0.0;c[V>>2]=0;c[W>>2]=0;g[X>>2]=0.0;bw(Y,c[am+12>>2]|0,as);bw(Z,c[an+12>>2]|0,ap);dw(_|0,ar|0,36);dw($|0,aq|0,36);g[aa>>2]=1.0;bF(m,l);if((c[ab>>2]|0)==3){au=aC+(1.0-aC)*+g[ac>>2];aD=au<1.0?au:1.0}else{aD=1.0}g[ai+132>>2]=aD;c[ad>>2]=c[ad>>2]|32;aE=aD}else{aE=+g[ai+132>>2]}if(aE>=ag){ak=ah;al=ag;break}ak=ai;al=aE}}while(0);ad=c[ai+12>>2]|0;if((ad|0)==0){break}else{ag=al;ah=ak;ai=ad}}if((ak|0)==0|al>.9999988079071045){ae=1;af=1678;break}ad=c[(c[ak+48>>2]|0)+8>>2]|0;aj=c[(c[ak+52>>2]|0)+8>>2]|0;ap=ad+28|0;dw(z|0,ap|0,36);as=aj+28|0;dw(n|0,as|0,36);at=ad+60|0;au=+g[at>>2];if(au>=1.0){af=1603;break}av=(al-au)/(1.0-au);ao=ad+36|0;au=1.0-av;ax=ad+44|0;aA=ad+48|0;aw=+g[ao>>2]*au+av*+g[ax>>2];ay=au*+g[ad+40>>2]+av*+g[aA>>2];aB=ao;ao=(g[k>>2]=aw,c[k>>2]|0);aF=0|ao;ao=(g[k>>2]=ay,c[k>>2]|0)|0;c[aB>>2]=aF;c[aB+4>>2]=ao;aB=ad+52|0;aG=ad+56|0;az=au*+g[aB>>2]+av*+g[aG>>2];g[aB>>2]=az;g[at>>2]=al;at=ad+44|0;c[at>>2]=aF;c[at+4>>2]=ao;g[aG>>2]=az;av=+Q(+az);ao=ad+20|0;g[ao>>2]=av;au=+P(+az);at=ad+24|0;g[at>>2]=au;aF=ad+28|0;az=+g[aF>>2];aB=ad+32|0;aH=+g[aB>>2];aI=ad+12|0;aJ=(g[k>>2]=aw-(au*az-av*aH),c[k>>2]|0);aL=(g[k>>2]=ay-(av*az+au*aH),c[k>>2]|0)|0;c[aI>>2]=0|aJ;c[aI+4>>2]=aL;aL=aj+60|0;aH=+g[aL>>2];if(aH>=1.0){af=1606;break}au=(al-aH)/(1.0-aH);aJ=aj+36|0;aH=1.0-au;aM=aj+44|0;aN=aj+48|0;az=+g[aJ>>2]*aH+au*+g[aM>>2];av=aH*+g[aj+40>>2]+au*+g[aN>>2];aO=aJ;aJ=(g[k>>2]=az,c[k>>2]|0);aP=0|aJ;aJ=(g[k>>2]=av,c[k>>2]|0)|0;c[aO>>2]=aP;c[aO+4>>2]=aJ;aO=aj+52|0;aQ=aj+56|0;ay=aH*+g[aO>>2]+au*+g[aQ>>2];g[aO>>2]=ay;g[aL>>2]=al;aL=aj+44|0;c[aL>>2]=aP;c[aL+4>>2]=aJ;g[aQ>>2]=ay;au=+Q(+ay);aJ=aj+20|0;g[aJ>>2]=au;aH=+P(+ay);aL=aj+24|0;g[aL>>2]=aH;aP=aj+28|0;ay=+g[aP>>2];aO=aj+32|0;aw=+g[aO>>2];aR=aj+12|0;aS=(g[k>>2]=az-(aH*ay-au*aw),c[k>>2]|0);aT=(g[k>>2]=av-(au*ay+aH*aw),c[k>>2]|0)|0;c[aR>>2]=0|aS;c[aR+4>>2]=aT;cL(ak,c[t>>2]|0);aT=ak+4|0;aS=c[aT>>2]|0;c[aT>>2]=aS&-33;aU=ak+128|0;c[aU>>2]=(c[aU>>2]|0)+1|0;if((aS&6|0)!=6){c[aT>>2]=aS&-37;dw(ap|0,z|0,36);dw(as|0,n|0,36);aw=+g[aG>>2];aH=+Q(+aw);g[ao>>2]=aH;ay=+P(+aw);g[at>>2]=ay;aw=+g[aF>>2];au=+g[aB>>2];av=+g[aA>>2]-(aH*aw+ay*au);aA=(g[k>>2]=+g[ax>>2]-(ay*aw-aH*au),c[k>>2]|0);ax=(g[k>>2]=av,c[k>>2]|0)|0;c[aI>>2]=0|aA;c[aI+4>>2]=ax;av=+g[aQ>>2];au=+Q(+av);g[aJ>>2]=au;aH=+P(+av);g[aL>>2]=aH;av=+g[aP>>2];aw=+g[aO>>2];ay=+g[aN>>2]-(au*av+aH*aw);aN=(g[k>>2]=+g[aM>>2]-(aH*av-au*aw),c[k>>2]|0);aM=(g[k>>2]=ay,c[k>>2]|0)|0;c[aR>>2]=0|aN;c[aR+4>>2]=aM;continue}aM=ad+4|0;aR=b[aM>>1]|0;if((aR&2)<<16>>16==0){b[aM>>1]=aR|2;g[ad+144>>2]=0.0}aR=aj+4|0;aN=b[aR>>1]|0;if((aN&2)<<16>>16==0){b[aR>>1]=aN|2;g[aj+144>>2]=0.0}c[o>>2]=0;c[w>>2]=0;c[x>>2]=0;aN=c[y>>2]|0;if((aN|0)<=0){af=1616;break}aO=ad+8|0;c[aO>>2]=0;aP=c[A>>2]|0;c[aP>>2]=ad;c[o>>2]=1;if((aN|0)<=1){af=1619;break}aN=aj+8|0;c[aN>>2]=1;c[aP+4>>2]=aj;c[o>>2]=2;if((c[B>>2]|0)<=0){af=1622;break}c[w>>2]=1;c[c[C>>2]>>2]=ak;b[aM>>1]=b[aM>>1]|1;b[aR>>1]=b[aR>>1]|1;c[aT>>2]=c[aT>>2]|1;c[D>>2]=ad;c[E>>2]=aj;aj=1;aT=ad;while(1){L2059:do{if((c[aT>>2]|0)==2){ad=c[aT+112>>2]|0;if((ad|0)==0){break}aR=aT+4|0;aM=c[y>>2]|0;aP=ad;ad=c[o>>2]|0;while(1){if((ad|0)==(aM|0)){break L2059}aL=c[w>>2]|0;aJ=c[B>>2]|0;if((aL|0)==(aJ|0)){break L2059}aQ=c[aP+4>>2]|0;ax=aQ+4|0;L2066:do{if((c[ax>>2]&1|0)==0){aI=c[aP>>2]|0;aA=aI|0;do{if((c[aA>>2]|0)==2){if((b[aR>>1]&8)<<16>>16!=0){break}if((b[aI+4>>1]&8)<<16>>16==0){aV=ad;break L2066}}}while(0);if((a[(c[aQ+48>>2]|0)+38|0]&1)<<24>>24!=0){aV=ad;break}if((a[(c[aQ+52>>2]|0)+38|0]&1)<<24>>24!=0){aV=ad;break}aB=aI+28|0;dw(F|0,aB|0,36);aF=aI+4|0;if((b[aF>>1]&1)<<16>>16==0){at=aI+60|0;ay=+g[at>>2];if(ay>=1.0){af=1638;break L2008}aw=(al-ay)/(1.0-ay);ao=aI+36|0;ay=1.0-aw;au=+g[ao>>2]*ay+aw*+g[aI+44>>2];av=ay*+g[aI+40>>2]+aw*+g[aI+48>>2];aG=ao;ao=(g[k>>2]=au,c[k>>2]|0);as=0|ao;ao=(g[k>>2]=av,c[k>>2]|0)|0;c[aG>>2]=as;c[aG+4>>2]=ao;aG=aI+52|0;ap=aI+56|0;aH=ay*+g[aG>>2]+aw*+g[ap>>2];g[aG>>2]=aH;g[at>>2]=al;at=aI+44|0;c[at>>2]=as;c[at+4>>2]=ao;g[ap>>2]=aH;aw=+Q(+aH);g[aI+20>>2]=aw;ay=+P(+aH);g[aI+24>>2]=ay;aH=+g[aI+28>>2];az=+g[aI+32>>2];ap=aI+12|0;ao=(g[k>>2]=au-(ay*aH-aw*az),c[k>>2]|0);at=(g[k>>2]=av-(aw*aH+ay*az),c[k>>2]|0)|0;c[ap>>2]=0|ao;c[ap+4>>2]=at}cL(aQ,c[t>>2]|0);at=c[ax>>2]|0;if((at&4|0)==0){dw(aB|0,F|0,36);az=+g[aI+56>>2];ay=+Q(+az);g[aI+20>>2]=ay;aH=+P(+az);g[aI+24>>2]=aH;az=+g[aI+28>>2];aw=+g[aI+32>>2];av=+g[aI+48>>2]-(ay*az+aH*aw);ap=aI+12|0;ao=(g[k>>2]=+g[aI+44>>2]-(aH*az-ay*aw),c[k>>2]|0);as=(g[k>>2]=av,c[k>>2]|0)|0;c[ap>>2]=0|ao;c[ap+4>>2]=as;aV=ad;break}if((at&2|0)==0){dw(aB|0,F|0,36);av=+g[aI+56>>2];aw=+Q(+av);g[aI+20>>2]=aw;ay=+P(+av);g[aI+24>>2]=ay;av=+g[aI+28>>2];az=+g[aI+32>>2];aH=+g[aI+48>>2]-(aw*av+ay*az);aB=aI+12|0;as=(g[k>>2]=+g[aI+44>>2]-(ay*av-aw*az),c[k>>2]|0);ap=(g[k>>2]=aH,c[k>>2]|0)|0;c[aB>>2]=0|as;c[aB+4>>2]=ap;aV=ad;break}c[ax>>2]=at|1;if((aL|0)>=(aJ|0)){af=1647;break L2008}c[w>>2]=aL+1|0;c[(c[C>>2]|0)+(aL<<2)>>2]=aQ;at=b[aF>>1]|0;if((at&1)<<16>>16!=0){aV=ad;break}b[aF>>1]=at|1;do{if((c[aA>>2]|0)!=0){if((at&2)<<16>>16!=0){break}b[aF>>1]=at|3;g[aI+144>>2]=0.0}}while(0);if((ad|0)>=(aM|0)){af=1654;break L2008}c[aI+8>>2]=ad;c[(c[A>>2]|0)+(ad<<2)>>2]=aI;at=ad+1|0;c[o>>2]=at;aV=at}else{aV=ad}}while(0);aQ=c[aP+12>>2]|0;if((aQ|0)==0){break L2059}else{aP=aQ;ad=aV}}}}while(0);if((aj|0)>=2){break}ad=c[p+(aj<<2)>>2]|0;aj=aj+1|0;aT=ad}aH=(1.0-al)*+g[q>>2];g[G>>2]=aH;g[H>>2]=1.0/aH;g[I>>2]=1.0;c[J>>2]=20;c[e>>2]=c[K>>2]|0;a[L]=0;cl(j,r,c[aO>>2]|0,c[aN>>2]|0);aT=c[o>>2]|0;L2097:do{if((aT|0)>0){aj=c[A>>2]|0;ad=0;while(1){aP=c[aj+(ad<<2)>>2]|0;aM=aP+4|0;b[aM>>1]=b[aM>>1]&-2;L2101:do{if((c[aP>>2]|0)==2){aH=+g[aP+52>>2];az=+Q(+aH);g[d>>2]=az;aw=+P(+aH);g[O>>2]=aw;aH=+g[aP+28>>2];av=+g[aP+32>>2];ay=+g[aP+40>>2]-(az*aH+aw*av);aM=(g[k>>2]=+g[aP+36>>2]-(aw*aH-az*av),c[k>>2]|0);aR=(g[k>>2]=ay,c[k>>2]|0)|0;c[R>>2]=0|aM;c[R+4>>2]=aR;aR=(c[aP+88>>2]|0)+102872|0;aM=c[aP+100>>2]|0;L2103:do{if((aM|0)!=0){aq=aP+12|0;ar=aM;while(1){ch(ar,aR,h,aq);an=c[ar+4>>2]|0;if((an|0)==0){break L2103}else{ar=an}}}}while(0);aR=c[aP+112>>2]|0;if((aR|0)==0){break}else{aW=aR}while(1){aR=(c[aW+4>>2]|0)+4|0;c[aR>>2]=c[aR>>2]&-34;aR=c[aW+12>>2]|0;if((aR|0)==0){break L2101}else{aW=aR}}}}while(0);aP=ad+1|0;if((aP|0)<(aT|0)){ad=aP}else{break L2097}}}}while(0);b8(M,s);if((a[N]&1)<<24>>24!=0){ae=0;af=1677;break}}if((af|0)==1647){aK(5244808,62,5248116,5244664)}else if((af|0)==1654){aK(5244808,54,5248180,5244544)}else if((af|0)==1676){a[u]=ae;N=j|0;s=c[N>>2]|0;M=j+20|0;aW=c[M>>2]|0;h=aW;bZ(s,h);R=c[N>>2]|0;O=j+24|0;d=c[O>>2]|0;o=d;bZ(R,o);r=c[N>>2]|0;L=j+16|0;K=c[L>>2]|0;e=K;bZ(r,e);J=c[N>>2]|0;I=c[C>>2]|0;H=I;bZ(J,H);G=c[A>>2]|0;q=G;bZ(J,q);i=f;return}else if((af|0)==1677){a[u]=ae;N=j|0;s=c[N>>2]|0;M=j+20|0;aW=c[M>>2]|0;h=aW;bZ(s,h);R=c[N>>2]|0;O=j+24|0;d=c[O>>2]|0;o=d;bZ(R,o);r=c[N>>2]|0;L=j+16|0;K=c[L>>2]|0;e=K;bZ(r,e);J=c[N>>2]|0;I=c[C>>2]|0;H=I;bZ(J,H);G=c[A>>2]|0;q=G;bZ(J,q);i=f;return}else if((af|0)==1678){a[u]=ae;N=j|0;s=c[N>>2]|0;M=j+20|0;aW=c[M>>2]|0;h=aW;bZ(s,h);R=c[N>>2]|0;O=j+24|0;d=c[O>>2]|0;o=d;bZ(R,o);r=c[N>>2]|0;L=j+16|0;K=c[L>>2]|0;e=K;bZ(r,e);J=c[N>>2]|0;I=c[C>>2]|0;H=I;bZ(J,H);G=c[A>>2]|0;q=G;bZ(J,q);i=f;return}else if((af|0)==1638){aK(5244908,715,5248344,5243160)}else if((af|0)==1575){aK(5245572,641,5248212,5243300)}else if((af|0)==1581){aK(5244908,715,5248344,5243160)}else if((af|0)==1586){aK(5244908,715,5248344,5243160)}else if((af|0)==1590){aK(5245572,676,5248212,5243160)}else if((af|0)==1603){aK(5244908,715,5248344,5243160)}else if((af|0)==1606){aK(5244908,715,5248344,5243160)}else if((af|0)==1616){aK(5244808,54,5248180,5244544)}else if((af|0)==1619){aK(5244808,54,5248180,5244544)}else if((af|0)==1622){aK(5244808,62,5248116,5244664)}}function cq(a){a=a|0;return}function cr(a){a=a|0;return}function cs(a){a=a|0;return}function ct(a,c,d){a=a|0;c=c|0;d=d|0;var e=0;a=b[c+36>>1]|0;if(!(a<<16>>16!=b[d+36>>1]<<16>>16|a<<16>>16==0)){e=a<<16>>16>0;return e|0}if((b[d+32>>1]&b[c+34>>1])<<16>>16==0){e=0;return e|0}e=(b[d+34>>1]&b[c+32>>1])<<16>>16!=0;return e|0}function cu(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,i=0,j=0.0,k=0.0,l=0.0,m=0.0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0;f=c[(c[a+48>>2]|0)+12>>2]|0;h=c[(c[a+52>>2]|0)+12>>2]|0;a=b+60|0;c[a>>2]=0;i=f+12|0;j=+g[d+12>>2];k=+g[i>>2];l=+g[d+8>>2];m=+g[f+16>>2];n=h+12|0;o=+g[e+12>>2];p=+g[n>>2];q=+g[e+8>>2];r=+g[h+16>>2];s=+g[e>>2]+(o*p-q*r)-(+g[d>>2]+(j*k-l*m));t=p*q+o*r+ +g[e+4>>2]-(k*l+j*m+ +g[d+4>>2]);m=+g[f+8>>2]+ +g[h+8>>2];if(s*s+t*t>m*m){return}c[b+56>>2]=0;h=i;i=b+48|0;f=c[h+4>>2]|0;c[i>>2]=c[h>>2]|0;c[i+4>>2]=f;g[b+40>>2]=0.0;g[b+44>>2]=0.0;c[a>>2]=1;a=n;n=b;f=c[a+4>>2]|0;c[n>>2]=c[a>>2]|0;c[n+4>>2]=f;c[b+16>>2]=0;return}function cv(b,d,e,f){b=b|0;d=+d;e=e|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0.0,p=0,q=0,r=0,s=0;h=i;i=i+24|0;j=h|0;k=b+102868|0;l=c[k>>2]|0;if((l&1|0)==0){m=l}else{l=b+102872|0;b8(l|0,l);l=c[k>>2]&-2;c[k>>2]=l;m=l}c[k>>2]=m|2;m=j|0;g[m>>2]=d;c[j+12>>2]=e;c[j+16>>2]=f;f=d>0.0;if(f){g[j+4>>2]=1.0/d}else{g[j+4>>2]=0.0}e=b+102988|0;g[j+8>>2]=+g[e>>2]*d;a[j+20|0]=a[b+102992|0]&1;b7(b+102872|0);g[b+103e3>>2]=0.0;if(!((a[b+102995|0]&1)<<24>>24==0|f^1)){co(b,j);g[b+103004>>2]=0.0}do{if((a[b+102993|0]&1)<<24>>24==0){n=1705}else{d=+g[m>>2];if(d<=0.0){o=d;break}cp(b,j);g[b+103024>>2]=0.0;n=1705;break}}while(0);if((n|0)==1705){o=+g[m>>2]}if(o>0.0){g[e>>2]=+g[j+4>>2]}j=c[k>>2]|0;if((j&4|0)==0){p=j;q=p&-3;c[k>>2]=q;r=b+102996|0;g[r>>2]=0.0;i=h;return}e=c[b+102952>>2]|0;if((e|0)==0){p=j;q=p&-3;c[k>>2]=q;r=b+102996|0;g[r>>2]=0.0;i=h;return}else{s=e}while(1){g[s+76>>2]=0.0;g[s+80>>2]=0.0;g[s+84>>2]=0.0;e=c[s+96>>2]|0;if((e|0)==0){break}else{s=e}}p=c[k>>2]|0;q=p&-3;c[k>>2]=q;r=b+102996|0;g[r>>2]=0.0;i=h;return}function cw(a){a=a|0;dt(a);return}function cx(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0;f=i;i=i+48|0;h=f|0;j=c[(c[a+48>>2]|0)+12>>2]|0;c[h>>2]=5250844;c[h+4>>2]=1;g[h+8>>2]=.009999999776482582;dx(h+28|0,0,18);bM(j,h,c[a+56>>2]|0);bo(b,h,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function cy(a){a=a|0;dt(a);return}function cz(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0;f=i;i=i+300|0;h=f|0;j=f+252|0;k=c[(c[a+48>>2]|0)+12>>2]|0;c[j>>2]=5250844;c[j+4>>2]=1;g[j+8>>2]=.009999999776482582;dx(j+28|0,0,18);bM(k,j,c[a+56>>2]|0);bp(h,b,j,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function cA(a){a=a|0;dt(a);return}function cB(a){a=a|0;dt(a);return}function cC(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0.0,l=0.0;h=bY(f,144)|0;if((h|0)==0){i=0;j=i|0;return j|0}f=h;c[f>>2]=5250548;c[h+4>>2]=4;c[h+48>>2]=a;c[h+52>>2]=d;c[h+56>>2]=b;c[h+60>>2]=e;c[h+124>>2]=0;c[h+128>>2]=0;dx(h+8|0,0,40);g[h+136>>2]=+N(+(+g[a+16>>2]*+g[d+16>>2]));k=+g[a+20>>2];l=+g[d+20>>2];g[h+140>>2]=k>l?k:l;c[f>>2]=5250644;if((c[(c[a+12>>2]|0)+4>>2]|0)!=3){aK(5245212,43,5248884,5246188)}if((c[(c[d+12>>2]|0)+4>>2]|0)==0){i=h;j=i|0;return j|0}else{aK(5245212,44,5248884,5245168)}return 0}function cD(b,d){b=b|0;d=d|0;var e=0,f=0;aU[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251816]|0;if((e&255)<14){f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}else{aK(5243252,173,5249472,5244088)}}function cE(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0,k=0.0,l=0.0;h=bY(f,144)|0;if((h|0)==0){i=0;j=i|0;return j|0}f=h;c[f>>2]=5250548;c[h+4>>2]=4;c[h+48>>2]=a;c[h+52>>2]=d;c[h+56>>2]=b;c[h+60>>2]=e;c[h+124>>2]=0;c[h+128>>2]=0;dx(h+8|0,0,40);g[h+136>>2]=+N(+(+g[a+16>>2]*+g[d+16>>2]));k=+g[a+20>>2];l=+g[d+20>>2];g[h+140>>2]=k>l?k:l;c[f>>2]=5250596;if((c[(c[a+12>>2]|0)+4>>2]|0)!=3){aK(5245100,43,5248716,5246188)}if((c[(c[d+12>>2]|0)+4>>2]|0)==2){i=h;j=i|0;return j|0}else{aK(5245100,44,5248716,5245056)}return 0}function cF(b,d){b=b|0;d=d|0;var e=0,f=0;aU[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251816]|0;if((e&255)<14){f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}else{aK(5243252,173,5249472,5244088)}}function cG(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,k=0.0;e=bY(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;c[f>>2]=5250548;c[e+4>>2]=4;c[e+48>>2]=a;c[e+52>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;dx(e+8|0,0,40);g[e+136>>2]=+N(+(+g[a+16>>2]*+g[d+16>>2]));j=+g[a+20>>2];k=+g[d+20>>2];g[e+140>>2]=j>k?j:k;c[f>>2]=5250776;if((c[(c[a+12>>2]|0)+4>>2]|0)!=0){aK(5244996,44,5249732,5246144)}if((c[(c[d+12>>2]|0)+4>>2]|0)==0){h=e;i=h|0;return i|0}else{aK(5244996,45,5249732,5245168)}return 0}function cH(b,d){b=b|0;d=d|0;var e=0,f=0;aU[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251816]|0;if((e&255)<14){f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}else{aK(5243252,173,5249472,5244088)}}function cI(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0;if((a[5251472]&1)<<24>>24==0){c[1312869]=62;c[1312870]=88;a[5251484]=1;c[1312893]=30;c[1312894]=136;a[5251580]=1;c[1312875]=30;c[1312876]=136;a[5251508]=0;c[1312899]=134;c[1312900]=96;a[5251604]=1;c[1312881]=132;c[1312882]=104;a[5251532]=1;c[1312872]=132;c[1312873]=104;a[5251496]=0;c[1312887]=126;c[1312888]=36;a[5251556]=1;c[1312896]=126;c[1312897]=36;a[5251592]=0;c[1312905]=8;c[1312906]=128;a[5251628]=1;c[1312878]=8;c[1312879]=128;a[5251520]=0;c[1312911]=140;c[1312912]=106;a[5251652]=1;c[1312902]=140;c[1312903]=106;a[5251616]=0;a[5251472]=1}h=c[(c[b+12>>2]|0)+4>>2]|0;i=c[(c[e+12>>2]|0)+4>>2]|0;if(h>>>0>=4){aK(5244944,80,5247960,5246100)}if(i>>>0>=4){aK(5244944,81,5247960,5245308)}j=c[5251476+(h*48&-1)+(i*12&-1)>>2]|0;if((j|0)==0){k=0;return k|0}if((a[5251476+(h*48&-1)+(i*12&-1)+8|0]&1)<<24>>24==0){k=aS[j&255](e,f,b,d,g)|0;return k|0}else{k=aS[j&255](b,d,e,f,g)|0;return k|0}return 0}function cJ(d,e){d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0,l=0;if((a[5251472]&1)<<24>>24==0){aK(5244944,103,5247896,5244252)}f=d+48|0;do{if((c[d+124>>2]|0)>0){h=c[(c[f>>2]|0)+8>>2]|0;i=h+4|0;j=b[i>>1]|0;if((j&2)<<16>>16==0){b[i>>1]=j|2;g[h+144>>2]=0.0}h=d+52|0;j=c[(c[h>>2]|0)+8>>2]|0;i=j+4|0;k=b[i>>1]|0;if((k&2)<<16>>16!=0){l=h;break}b[i>>1]=k|2;g[j+144>>2]=0.0;l=h}else{l=d+52|0}}while(0);h=c[(c[(c[f>>2]|0)+12>>2]|0)+4>>2]|0;f=c[(c[(c[l>>2]|0)+12>>2]|0)+4>>2]|0;if((h|0)>-1&(f|0)<4){aV[c[5251476+(h*48&-1)+(f*12&-1)+4>>2]&255](d,e);return}else{aK(5244944,114,5247896,5243876)}}function cK(a){a=a|0;return}function cL(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;f=i;i=i+192|0;h=f|0;j=f+92|0;k=f+104|0;l=f+128|0;m=d+64|0;dw(l|0,m|0,64);n=d+4|0;o=c[n>>2]|0;c[n>>2]=o|4;p=o>>>1;o=c[d+48>>2]|0;q=c[d+52>>2]|0;r=((a[q+38|0]|a[o+38|0])&1)<<24>>24!=0;s=c[o+8>>2]|0;t=c[q+8>>2]|0;u=s+12|0;v=t+12|0;do{if(r){w=c[o+12>>2]|0;x=c[q+12>>2]|0;y=c[d+56>>2]|0;z=c[d+60>>2]|0;c[h+16>>2]=0;c[h+20>>2]=0;g[h+24>>2]=0.0;c[h+44>>2]=0;c[h+48>>2]=0;g[h+52>>2]=0.0;bw(h|0,w,y);bw(h+28|0,x,z);dw(h+56|0,u|0,16);dw(h+72|0,v|0,16);a[h+88|0]=1;b[j+4>>1]=0;bx(k,j,h);z=+g[k+16>>2]<11920928955078125.0e-22&1;c[d+124>>2]=0;A=z;B=p&1}else{a1[c[c[d>>2]>>2]&255](d,m,u,v);z=d+124|0;x=(c[z>>2]|0)>0;y=x&1;L2273:do{if(x){w=c[l+60>>2]|0;C=0;while(1){D=d+64+(C*20&-1)+8|0;g[D>>2]=0.0;E=d+64+(C*20&-1)+12|0;g[E>>2]=0.0;F=c[d+64+(C*20&-1)+16>>2]|0;G=0;while(1){if((G|0)>=(w|0)){break}if((c[l+(G*20&-1)+16>>2]|0)==(F|0)){H=1788;break}else{G=G+1|0}}if((H|0)==1788){H=0;g[D>>2]=+g[l+(G*20&-1)+8>>2];g[E>>2]=+g[l+(G*20&-1)+12>>2]}F=C+1|0;if((F|0)<(c[z>>2]|0)){C=F}else{break L2273}}}}while(0);z=p&1;if(!(x^(z|0)!=0)){A=y;B=z;break}C=s+4|0;w=b[C>>1]|0;if((w&2)<<16>>16==0){b[C>>1]=w|2;g[s+144>>2]=0.0}w=t+4|0;C=b[w>>1]|0;if((C&2)<<16>>16!=0){A=y;B=z;break}b[w>>1]=C|2;g[t+144>>2]=0.0;A=y;B=z}}while(0);t=A<<24>>24!=0;A=c[n>>2]|0;c[n>>2]=t?A|2:A&-3;A=t^1;n=(e|0)==0;if(!((B|0)!=0|A|n)){aV[c[(c[e>>2]|0)+8>>2]&255](e,d)}if(!(t|(B|0)==0|n)){aV[c[(c[e>>2]|0)+12>>2]&255](e,d)}if(r|A|n){i=f;return}aY[c[(c[e>>2]|0)+16>>2]&255](e,d,l);i=f;return}function cM(a){a=a|0;dt(a);return}function cN(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0,v=0,w=0,x=0,y=0,z=0;dw(b|0,d|0,24);e=c[d+40>>2]|0;f=b+32|0;c[f>>2]=e;h=c[d+28>>2]|0;i=b+48|0;c[i>>2]=h;j=h*88&-1;h=e+102796|0;k=c[h>>2]|0;if((k|0)>=32){aK(5243112,38,5249252,5244052)}l=e+102412+(k*12&-1)|0;c[e+102412+(k*12&-1)+4>>2]=j;m=e+102400|0;n=c[m>>2]|0;if((n+j|0)>102400){c[l>>2]=dr(j)|0;a[e+102412+(k*12&-1)+8|0]=1}else{c[l>>2]=e+n|0;a[e+102412+(k*12&-1)+8|0]=0;c[m>>2]=(c[m>>2]|0)+j|0}m=e+102404|0;k=(c[m>>2]|0)+j|0;c[m>>2]=k;m=e+102408|0;e=c[m>>2]|0;c[m>>2]=(e|0)>(k|0)?e:k;c[h>>2]=(c[h>>2]|0)+1|0;h=b+36|0;c[h>>2]=c[l>>2]|0;l=c[f>>2]|0;f=(c[i>>2]|0)*152&-1;k=l+102796|0;e=c[k>>2]|0;if((e|0)>=32){aK(5243112,38,5249252,5244052)}m=l+102412+(e*12&-1)|0;c[l+102412+(e*12&-1)+4>>2]=f;j=l+102400|0;n=c[j>>2]|0;if((n+f|0)>102400){c[m>>2]=dr(f)|0;a[l+102412+(e*12&-1)+8|0]=1}else{c[m>>2]=l+n|0;a[l+102412+(e*12&-1)+8|0]=0;c[j>>2]=(c[j>>2]|0)+f|0}j=l+102404|0;e=(c[j>>2]|0)+f|0;c[j>>2]=e;j=l+102408|0;l=c[j>>2]|0;c[j>>2]=(l|0)>(e|0)?l:e;c[k>>2]=(c[k>>2]|0)+1|0;k=b+40|0;c[k>>2]=c[m>>2]|0;c[b+24>>2]=c[d+32>>2]|0;c[b+28>>2]=c[d+36>>2]|0;m=c[d+24>>2]|0;d=b+44|0;c[d>>2]=m;if((c[i>>2]|0)<=0){return}e=b+20|0;l=b+8|0;b=0;j=m;while(1){m=c[j+(b<<2)>>2]|0;f=c[m+48>>2]|0;n=c[m+52>>2]|0;o=c[f+8>>2]|0;p=c[n+8>>2]|0;q=c[m+124>>2]|0;if((q|0)<=0){r=1818;break}s=+g[(c[n+12>>2]|0)+8>>2];t=+g[(c[f+12>>2]|0)+8>>2];f=c[k>>2]|0;g[f+(b*152&-1)+136>>2]=+g[m+136>>2];g[f+(b*152&-1)+140>>2]=+g[m+140>>2];n=o+8|0;c[f+(b*152&-1)+112>>2]=c[n>>2]|0;u=p+8|0;c[f+(b*152&-1)+116>>2]=c[u>>2]|0;v=o+120|0;g[f+(b*152&-1)+120>>2]=+g[v>>2];w=p+120|0;g[f+(b*152&-1)+124>>2]=+g[w>>2];x=o+128|0;g[f+(b*152&-1)+128>>2]=+g[x>>2];y=p+128|0;g[f+(b*152&-1)+132>>2]=+g[y>>2];c[f+(b*152&-1)+148>>2]=b;c[f+(b*152&-1)+144>>2]=q;dx(f+(b*152&-1)+80|0,0,32);z=c[h>>2]|0;c[z+(b*88&-1)+32>>2]=c[n>>2]|0;c[z+(b*88&-1)+36>>2]=c[u>>2]|0;g[z+(b*88&-1)+40>>2]=+g[v>>2];g[z+(b*88&-1)+44>>2]=+g[w>>2];w=o+28|0;o=z+(b*88&-1)+48|0;v=c[w+4>>2]|0;c[o>>2]=c[w>>2]|0;c[o+4>>2]=v;v=p+28|0;p=z+(b*88&-1)+56|0;o=c[v+4>>2]|0;c[p>>2]=c[v>>2]|0;c[p+4>>2]=o;g[z+(b*88&-1)+64>>2]=+g[x>>2];g[z+(b*88&-1)+68>>2]=+g[y>>2];y=m+104|0;x=z+(b*88&-1)+16|0;o=c[y+4>>2]|0;c[x>>2]=c[y>>2]|0;c[x+4>>2]=o;o=m+112|0;x=z+(b*88&-1)+24|0;y=c[o+4>>2]|0;c[x>>2]=c[o>>2]|0;c[x+4>>2]=y;c[z+(b*88&-1)+84>>2]=q;g[z+(b*88&-1)+76>>2]=t;g[z+(b*88&-1)+80>>2]=s;c[z+(b*88&-1)+72>>2]=c[m+120>>2]|0;y=0;while(1){if((a[e]&1)<<24>>24==0){g[f+(b*152&-1)+(y*36&-1)+16>>2]=0.0;g[f+(b*152&-1)+(y*36&-1)+20>>2]=0.0}else{g[f+(b*152&-1)+(y*36&-1)+16>>2]=+g[l>>2]*+g[m+64+(y*20&-1)+8>>2];g[f+(b*152&-1)+(y*36&-1)+20>>2]=+g[l>>2]*+g[m+64+(y*20&-1)+12>>2]}g[f+(b*152&-1)+(y*36&-1)+24>>2]=0.0;g[f+(b*152&-1)+(y*36&-1)+28>>2]=0.0;g[f+(b*152&-1)+(y*36&-1)+32>>2]=0.0;x=m+64+(y*20&-1)|0;o=z+(b*88&-1)+(y<<3)|0;dx(f+(b*152&-1)+(y*36&-1)|0,0,16);p=c[x+4>>2]|0;c[o>>2]=c[x>>2]|0;c[o+4>>2]=p;p=y+1|0;if((p|0)==(q|0)){break}else{y=p}}y=b+1|0;if((y|0)>=(c[i>>2]|0)){r=1827;break}b=y;j=c[d>>2]|0}if((r|0)==1818){aK(5244848,71,5249568,5246084)}else if((r|0)==1827){return}}function cO(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0.0,C=0.0,D=0.0,E=0.0,F=0,G=0,H=0.0,I=0.0,J=0.0,K=0.0,L=0,M=0.0,N=0.0,O=0.0,R=0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0,ag=0,ah=0.0,ai=0.0,aj=0.0;b=i;i=i+56|0;d=b|0;e=b+16|0;f=b+32|0;h=a+48|0;if((c[h>>2]|0)<=0){i=b;return}j=a+40|0;l=a+36|0;m=a+44|0;n=a+24|0;o=a+28|0;a=d+8|0;p=d+12|0;q=e+8|0;r=e+12|0;s=d;t=e;u=f;v=0;while(1){w=c[j>>2]|0;x=c[l>>2]|0;y=c[(c[m>>2]|0)+(c[w+(v*152&-1)+148>>2]<<2)>>2]|0;z=c[w+(v*152&-1)+112>>2]|0;A=c[w+(v*152&-1)+116>>2]|0;B=+g[w+(v*152&-1)+120>>2];C=+g[w+(v*152&-1)+124>>2];D=+g[w+(v*152&-1)+128>>2];E=+g[w+(v*152&-1)+132>>2];F=x+(v*88&-1)+48|0;G=c[F+4>>2]|0;H=(c[k>>2]=c[F>>2]|0,+g[k>>2]);I=(c[k>>2]=G,+g[k>>2]);G=x+(v*88&-1)+56|0;F=c[G+4>>2]|0;J=(c[k>>2]=c[G>>2]|0,+g[k>>2]);K=(c[k>>2]=F,+g[k>>2]);F=c[n>>2]|0;G=F+(z*12&-1)|0;L=c[G+4>>2]|0;M=(c[k>>2]=c[G>>2]|0,+g[k>>2]);N=(c[k>>2]=L,+g[k>>2]);O=+g[F+(z*12&-1)+8>>2];L=c[o>>2]|0;G=L+(z*12&-1)|0;R=c[G+4>>2]|0;S=(c[k>>2]=c[G>>2]|0,+g[k>>2]);T=(c[k>>2]=R,+g[k>>2]);U=+g[L+(z*12&-1)+8>>2];z=F+(A*12&-1)|0;R=c[z+4>>2]|0;V=(c[k>>2]=c[z>>2]|0,+g[k>>2]);W=(c[k>>2]=R,+g[k>>2]);X=+g[F+(A*12&-1)+8>>2];F=L+(A*12&-1)|0;R=c[F+4>>2]|0;Y=(c[k>>2]=c[F>>2]|0,+g[k>>2]);Z=(c[k>>2]=R,+g[k>>2]);_=+g[L+(A*12&-1)+8>>2];if((c[y+124>>2]|0)<=0){$=1832;break}aa=+g[x+(v*88&-1)+80>>2];ab=+g[x+(v*88&-1)+76>>2];ac=+Q(+O);g[a>>2]=ac;ad=+P(+O);g[p>>2]=ad;O=+Q(+X);g[q>>2]=O;ae=+P(+X);g[r>>2]=ae;x=(g[k>>2]=M-(H*ad-I*ac),c[k>>2]|0);A=(g[k>>2]=N-(I*ad+H*ac),c[k>>2]|0)|0;c[s>>2]=0|x;c[s+4>>2]=A;A=(g[k>>2]=V-(J*ae-K*O),c[k>>2]|0);x=(g[k>>2]=W-(K*ae+J*O),c[k>>2]|0)|0;c[t>>2]=0|A;c[t+4>>2]=x;bu(f,y+64|0,d,ab,e,aa);y=w+(v*152&-1)+72|0;x=y;A=c[u+4>>2]|0;c[x>>2]=c[u>>2]|0;c[x+4>>2]=A;A=w+(v*152&-1)+144|0;x=c[A>>2]|0;do{if((x|0)>0){L=w+(v*152&-1)+76|0;R=y|0;aa=B+C;ab=-0.0-_;O=-0.0-U;F=w+(v*152&-1)+140|0;z=0;while(1){J=+g[f+8+(z<<3)>>2];ae=J-M;K=+g[f+8+(z<<3)+4>>2];G=w+(v*152&-1)+(z*36&-1)|0;af=(g[k>>2]=ae,c[k>>2]|0);ag=(g[k>>2]=K-N,c[k>>2]|0)|0;c[G>>2]=0|af;c[G+4>>2]=ag;ac=J-V;ag=w+(v*152&-1)+(z*36&-1)+8|0;G=(g[k>>2]=ac,c[k>>2]|0);af=(g[k>>2]=K-W,c[k>>2]|0)|0;c[ag>>2]=0|G;c[ag+4>>2]=af;K=+g[L>>2];J=+g[w+(v*152&-1)+(z*36&-1)+4>>2];H=+g[R>>2];ad=ae*K-J*H;I=+g[w+(v*152&-1)+(z*36&-1)+12>>2];X=K*ac-H*I;H=aa+ad*D*ad+X*E*X;if(H>0.0){ah=1.0/H}else{ah=0.0}g[w+(v*152&-1)+(z*36&-1)+24>>2]=ah;H=+g[L>>2];X=+g[R>>2]*-1.0;ad=ae*X-H*J;K=X*ac-H*I;H=aa+ad*D*ad+K*E*K;if(H>0.0){ai=1.0/H}else{ai=0.0}g[w+(v*152&-1)+(z*36&-1)+28>>2]=ai;af=w+(v*152&-1)+(z*36&-1)+32|0;g[af>>2]=0.0;H=+g[R>>2]*(Y+I*ab-S-J*O)+ +g[L>>2]*(Z+_*ac-T-U*ae);if(H<-1.0){g[af>>2]=H*(-0.0- +g[F>>2])}af=z+1|0;if((af|0)==(x|0)){break}else{z=af}}if((c[A>>2]|0)!=2){break}O=+g[w+(v*152&-1)+76>>2];ab=+g[y>>2];aa=+g[w+(v*152&-1)>>2]*O- +g[w+(v*152&-1)+4>>2]*ab;H=O*+g[w+(v*152&-1)+8>>2]-ab*+g[w+(v*152&-1)+12>>2];ae=O*+g[w+(v*152&-1)+36>>2]-ab*+g[w+(v*152&-1)+40>>2];ac=O*+g[w+(v*152&-1)+44>>2]-ab*+g[w+(v*152&-1)+48>>2];ab=B+C;O=D*aa;J=E*H;I=ab+aa*O+H*J;H=ab+ae*D*ae+ac*E*ac;aa=ab+O*ae+J*ac;ac=I*H-aa*aa;if(I*I>=ac*1.0e3){c[A>>2]=1;break}g[w+(v*152&-1)+96>>2]=I;g[w+(v*152&-1)+100>>2]=aa;g[w+(v*152&-1)+104>>2]=aa;g[w+(v*152&-1)+108>>2]=H;if(ac!=0.0){aj=1.0/ac}else{aj=ac}ac=aa*(-0.0-aj);g[w+(v*152&-1)+80>>2]=H*aj;g[w+(v*152&-1)+84>>2]=ac;g[w+(v*152&-1)+88>>2]=ac;g[w+(v*152&-1)+92>>2]=I*aj}}while(0);w=v+1|0;if((w|0)<(c[h>>2]|0)){v=w}else{$=1850;break}}if(($|0)==1850){i=b;return}else if(($|0)==1832){aK(5244848,168,5249624,5245280)}}function cP(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,i=0,j=0.0,l=0.0,m=0.0,n=0.0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0;b=a+48|0;if((c[b>>2]|0)<=0){return}d=a+40|0;e=a+28|0;a=0;while(1){f=c[d>>2]|0;h=c[f+(a*152&-1)+112>>2]|0;i=c[f+(a*152&-1)+116>>2]|0;j=+g[f+(a*152&-1)+120>>2];l=+g[f+(a*152&-1)+128>>2];m=+g[f+(a*152&-1)+124>>2];n=+g[f+(a*152&-1)+132>>2];o=c[f+(a*152&-1)+144>>2]|0;p=c[e>>2]|0;q=p+(h*12&-1)|0;r=c[q+4>>2]|0;s=(c[k>>2]=c[q>>2]|0,+g[k>>2]);t=(c[k>>2]=r,+g[k>>2]);u=+g[p+(h*12&-1)+8>>2];r=p+(i*12&-1)|0;v=c[r+4>>2]|0;w=(c[k>>2]=c[r>>2]|0,+g[k>>2]);x=(c[k>>2]=v,+g[k>>2]);y=+g[p+(i*12&-1)+8>>2];p=f+(a*152&-1)+72|0;v=c[p+4>>2]|0;z=(c[k>>2]=c[p>>2]|0,+g[k>>2]);A=(c[k>>2]=v,+g[k>>2]);B=z*-1.0;L2372:do{if((o|0)>0){C=t;D=s;E=x;F=w;G=u;H=y;v=0;while(1){I=+g[f+(a*152&-1)+(v*36&-1)+16>>2];J=+g[f+(a*152&-1)+(v*36&-1)+20>>2];K=z*I+A*J;L=A*I+B*J;J=G-l*(+g[f+(a*152&-1)+(v*36&-1)>>2]*L- +g[f+(a*152&-1)+(v*36&-1)+4>>2]*K);I=D-j*K;M=C-j*L;N=H+n*(L*+g[f+(a*152&-1)+(v*36&-1)+8>>2]-K*+g[f+(a*152&-1)+(v*36&-1)+12>>2]);O=F+m*K;K=E+m*L;p=v+1|0;if((p|0)==(o|0)){P=M;Q=I;R=K;S=O;T=J;U=N;break L2372}else{C=M;D=I;E=K;F=O;G=J;H=N;v=p}}}else{P=t;Q=s;R=x;S=w;T=u;U=y}}while(0);o=(g[k>>2]=Q,c[k>>2]|0);f=(g[k>>2]=P,c[k>>2]|0)|0;c[q>>2]=0|o;c[q+4>>2]=f;g[(c[e>>2]|0)+(h*12&-1)+8>>2]=T;f=(c[e>>2]|0)+(i*12&-1)|0;o=(g[k>>2]=S,c[k>>2]|0);v=(g[k>>2]=R,c[k>>2]|0)|0;c[f>>2]=0|o;c[f+4>>2]=v;g[(c[e>>2]|0)+(i*12&-1)+8>>2]=U;v=a+1|0;if((v|0)<(c[b>>2]|0)){a=v}else{break}}return}function cQ(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0.0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0.0,y=0,z=0,A=0,B=0,C=0,D=0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0,N=0.0,O=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0,ag=0.0,ah=0.0,ai=0.0,aj=0.0,ak=0.0,al=0.0,am=0.0,an=0.0,ao=0.0,ap=0.0,aq=0.0,ar=0.0,as=0.0,at=0.0,au=0.0,av=0.0,aw=0.0,ax=0.0,ay=0.0,az=0.0,aA=0.0,aB=0;b=i;i=i+52|0;d=b|0;e=b+16|0;f=b+32|0;h=a+48|0;if((c[h>>2]|0)<=0){j=0.0;l=j>=-.014999999664723873;i=b;return l|0}m=a+36|0;n=a+24|0;a=d+8|0;o=d+12|0;p=e+8|0;q=e+12|0;r=d;s=e;t=f;u=f+8|0;v=f+16|0;w=0;x=0.0;while(1){y=c[m>>2]|0;z=y+(w*88&-1)|0;A=c[y+(w*88&-1)+32>>2]|0;B=c[y+(w*88&-1)+36>>2]|0;C=y+(w*88&-1)+48|0;D=c[C+4>>2]|0;E=(c[k>>2]=c[C>>2]|0,+g[k>>2]);F=(c[k>>2]=D,+g[k>>2]);G=+g[y+(w*88&-1)+40>>2];H=+g[y+(w*88&-1)+64>>2];D=y+(w*88&-1)+56|0;C=c[D+4>>2]|0;I=(c[k>>2]=c[D>>2]|0,+g[k>>2]);J=(c[k>>2]=C,+g[k>>2]);K=+g[y+(w*88&-1)+44>>2];L=+g[y+(w*88&-1)+68>>2];C=c[y+(w*88&-1)+84>>2]|0;y=c[n>>2]|0;D=y+(A*12&-1)|0;M=c[D+4>>2]|0;N=(c[k>>2]=c[D>>2]|0,+g[k>>2]);O=(c[k>>2]=M,+g[k>>2]);R=+g[y+(A*12&-1)+8>>2];M=y+(B*12&-1)|0;D=c[M+4>>2]|0;S=(c[k>>2]=c[M>>2]|0,+g[k>>2]);T=(c[k>>2]=D,+g[k>>2]);U=+g[y+(B*12&-1)+8>>2];if((C|0)>0){V=G+K;W=O;X=N;Y=T;Z=S;D=0;_=U;$=R;aa=x;while(1){ab=+Q(+$);g[a>>2]=ab;ac=+P(+$);g[o>>2]=ac;ad=+Q(+_);g[p>>2]=ad;ae=+P(+_);g[q>>2]=ae;M=(g[k>>2]=X-(E*ac-F*ab),c[k>>2]|0);af=(g[k>>2]=W-(F*ac+E*ab),c[k>>2]|0)|0;c[r>>2]=0|M;c[r+4>>2]=af;af=(g[k>>2]=Z-(I*ae-J*ad),c[k>>2]|0);M=(g[k>>2]=Y-(J*ae+I*ad),c[k>>2]|0)|0;c[s>>2]=0|af;c[s+4>>2]=M;c0(f,z,d,e,D);M=c[t+4>>2]|0;ad=(c[k>>2]=c[t>>2]|0,+g[k>>2]);ae=(c[k>>2]=M,+g[k>>2]);M=c[u+4>>2]|0;ab=(c[k>>2]=c[u>>2]|0,+g[k>>2]);ac=(c[k>>2]=M,+g[k>>2]);ag=+g[v>>2];ah=ab-X;ai=ac-W;aj=ab-Z;ab=ac-Y;ak=aa<ag?aa:ag;ac=(ag+.004999999888241291)*.20000000298023224;ag=ac<0.0?ac:0.0;ac=ae*ah-ad*ai;al=ae*aj-ad*ab;am=al*L*al+(V+ac*H*ac);if(am>0.0){an=(-0.0-(ag<-.20000000298023224?-.20000000298023224:ag))/am}else{an=0.0}am=ad*an;ad=ae*an;ao=X-G*am;ap=W-G*ad;aq=$-H*(ah*ad-ai*am);ar=Z+K*am;as=Y+K*ad;at=_+L*(aj*ad-ab*am);M=D+1|0;if((M|0)==(C|0)){break}else{W=ap;X=ao;Y=as;Z=ar;D=M;_=at;$=aq;aa=ak}}au=ap;av=ao;aw=as;ax=ar;ay=at;az=aq;aA=ak;aB=c[n>>2]|0}else{au=O;av=N;aw=T;ax=S;ay=U;az=R;aA=x;aB=y}D=aB+(A*12&-1)|0;C=(g[k>>2]=av,c[k>>2]|0);z=(g[k>>2]=au,c[k>>2]|0)|0;c[D>>2]=0|C;c[D+4>>2]=z;g[(c[n>>2]|0)+(A*12&-1)+8>>2]=az;z=(c[n>>2]|0)+(B*12&-1)|0;D=(g[k>>2]=ax,c[k>>2]|0);C=(g[k>>2]=aw,c[k>>2]|0)|0;c[z>>2]=0|D;c[z+4>>2]=C;g[(c[n>>2]|0)+(B*12&-1)+8>>2]=ay;C=w+1|0;if((C|0)<(c[h>>2]|0)){w=C;x=aA}else{j=aA;break}}l=j>=-.014999999664723873;i=b;return l|0}
function cR(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,i=0,j=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0,q=0,r=0,s=0,t=0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0,J=0.0,K=0.0,L=0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0.0,ag=0.0,ah=0.0,ai=0.0,aj=0.0;b=a+48|0;if((c[b>>2]|0)<=0){return}d=a+40|0;e=a+28|0;a=0;L2397:while(1){f=c[d>>2]|0;h=f+(a*152&-1)|0;i=c[f+(a*152&-1)+112>>2]|0;j=c[f+(a*152&-1)+116>>2]|0;l=+g[f+(a*152&-1)+120>>2];m=+g[f+(a*152&-1)+128>>2];n=+g[f+(a*152&-1)+124>>2];o=+g[f+(a*152&-1)+132>>2];p=f+(a*152&-1)+144|0;q=c[p>>2]|0;r=c[e>>2]|0;s=r+(i*12&-1)|0;t=c[s+4>>2]|0;u=(c[k>>2]=c[s>>2]|0,+g[k>>2]);v=(c[k>>2]=t,+g[k>>2]);w=+g[r+(i*12&-1)+8>>2];t=r+(j*12&-1)|0;s=c[t+4>>2]|0;x=(c[k>>2]=c[t>>2]|0,+g[k>>2]);y=(c[k>>2]=s,+g[k>>2]);z=+g[r+(j*12&-1)+8>>2];r=f+(a*152&-1)+72|0;s=c[r+4>>2]|0;A=(c[k>>2]=c[r>>2]|0,+g[k>>2]);B=(c[k>>2]=s,+g[k>>2]);C=A*-1.0;D=+g[f+(a*152&-1)+136>>2];if((q-1|0)>>>0<2){E=v;F=u;G=y;H=x;I=0;J=z;K=w}else{L=1875;break}while(1){w=+g[f+(a*152&-1)+(I*36&-1)+12>>2];z=+g[f+(a*152&-1)+(I*36&-1)+8>>2];x=+g[f+(a*152&-1)+(I*36&-1)+4>>2];y=+g[f+(a*152&-1)+(I*36&-1)>>2];u=D*+g[f+(a*152&-1)+(I*36&-1)+16>>2];s=f+(a*152&-1)+(I*36&-1)+20|0;v=+g[s>>2];M=v+ +g[f+(a*152&-1)+(I*36&-1)+28>>2]*(-0.0-(B*(H+w*(-0.0-J)-F-x*(-0.0-K))+C*(G+J*z-E-K*y)));N=-0.0-u;O=M<u?M:u;u=O<N?N:O;O=u-v;g[s>>2]=u;u=B*O;v=C*O;P=F-l*u;Q=E-l*v;R=K-m*(y*v-x*u);S=H+n*u;T=G+n*v;U=J+o*(z*v-w*u);s=I+1|0;if((s|0)==(q|0)){break}else{E=Q;F=P;G=T;H=S;I=s;J=U;K=R}}L2402:do{if((c[p>>2]|0)==1){C=+g[f+(a*152&-1)+12>>2];D=+g[f+(a*152&-1)+8>>2];u=+g[f+(a*152&-1)+4>>2];w=+g[h>>2];q=f+(a*152&-1)+16|0;v=+g[q>>2];z=v+(A*(S+C*(-0.0-U)-P-u*(-0.0-R))+B*(T+U*D-Q-R*w)- +g[f+(a*152&-1)+32>>2])*(-0.0- +g[f+(a*152&-1)+24>>2]);x=z>0.0?z:0.0;z=x-v;g[q>>2]=x;x=A*z;v=B*z;V=R-m*(w*v-u*x);W=U+o*(D*v-C*x);X=S+n*x;Y=T+n*v;Z=P-l*x;_=Q-l*v}else{q=f+(a*152&-1)+16|0;v=+g[q>>2];s=f+(a*152&-1)+52|0;x=+g[s>>2];if(v<0.0|x<0.0){L=1880;break L2397}C=-0.0-U;D=+g[f+(a*152&-1)+12>>2];u=+g[f+(a*152&-1)+8>>2];w=-0.0-R;z=+g[f+(a*152&-1)+4>>2];y=+g[h>>2];O=+g[f+(a*152&-1)+48>>2];N=+g[f+(a*152&-1)+44>>2];M=+g[f+(a*152&-1)+40>>2];$=+g[f+(a*152&-1)+36>>2];aa=+g[f+(a*152&-1)+104>>2];ab=+g[f+(a*152&-1)+100>>2];ac=A*(S+D*C-P-z*w)+B*(T+U*u-Q-R*y)- +g[f+(a*152&-1)+32>>2]-(v*+g[f+(a*152&-1)+96>>2]+x*aa);ad=A*(S+O*C-P-M*w)+B*(T+U*N-Q-R*$)- +g[f+(a*152&-1)+68>>2]-(v*ab+x*+g[f+(a*152&-1)+108>>2]);w=+g[f+(a*152&-1)+80>>2]*ac+ +g[f+(a*152&-1)+88>>2]*ad;C=ac*+g[f+(a*152&-1)+84>>2]+ad*+g[f+(a*152&-1)+92>>2];ae=-0.0-w;af=-0.0-C;if(!(w>-0.0|C>-0.0)){C=ae-v;w=af-x;ag=A*C;ah=B*C;C=A*w;ai=B*w;w=ag+C;aj=ah+ai;g[q>>2]=ae;g[s>>2]=af;V=R-m*(y*ah-z*ag+($*ai-M*C));W=U+o*(u*ah-D*ag+(N*ai-O*C));X=S+n*w;Y=T+n*aj;Z=P-l*w;_=Q-l*aj;break}aj=ac*(-0.0- +g[f+(a*152&-1)+24>>2]);do{if(aj>=0.0){if(ad+aj*ab<0.0){break}w=aj-v;C=0.0-x;ai=A*w;ag=B*w;w=A*C;ah=B*C;C=w+ai;af=ah+ag;g[q>>2]=aj;g[s>>2]=0.0;V=R-m*(ag*y-ai*z+(ah*$-w*M));W=U+o*(ag*u-ai*D+(ah*N-w*O));X=S+n*C;Y=T+n*af;Z=P-l*C;_=Q-l*af;break L2402}}while(0);aj=ad*(-0.0- +g[f+(a*152&-1)+60>>2]);do{if(aj>=0.0){if(ac+aj*aa<0.0){break}ab=0.0-v;af=aj-x;C=A*ab;w=B*ab;ab=A*af;ah=B*af;af=C+ab;ai=w+ah;g[q>>2]=0.0;g[s>>2]=aj;V=R-m*(w*y-C*z+(ah*$-ab*M));W=U+o*(w*u-C*D+(ah*N-ab*O));X=S+n*af;Y=T+n*ai;Z=P-l*af;_=Q-l*ai;break L2402}}while(0);if(ac<0.0|ad<0.0){V=R;W=U;X=S;Y=T;Z=P;_=Q;break}aj=0.0-v;aa=0.0-x;ai=A*aj;af=B*aj;aj=A*aa;ab=B*aa;aa=ai+aj;ah=af+ab;g[q>>2]=0.0;g[s>>2]=0.0;V=R-m*(af*y-ai*z+(ab*$-aj*M));W=U+o*(af*u-ai*D+(ab*N-aj*O));X=S+n*aa;Y=T+n*ah;Z=P-l*aa;_=Q-l*ah}}while(0);f=(c[e>>2]|0)+(i*12&-1)|0;h=(g[k>>2]=Z,c[k>>2]|0);p=(g[k>>2]=_,c[k>>2]|0)|0;c[f>>2]=0|h;c[f+4>>2]=p;g[(c[e>>2]|0)+(i*12&-1)+8>>2]=V;p=(c[e>>2]|0)+(j*12&-1)|0;f=(g[k>>2]=X,c[k>>2]|0);h=(g[k>>2]=Y,c[k>>2]|0)|0;c[p>>2]=0|f;c[p+4>>2]=h;g[(c[e>>2]|0)+(j*12&-1)+8>>2]=W;h=a+1|0;if((h|0)<(c[b>>2]|0)){a=h}else{L=1894;break}}if((L|0)==1875){aK(5244848,311,5249680,5244216)}else if((L|0)==1880){aK(5244848,406,5249680,5243848)}else if((L|0)==1894){return}}function cS(a){a=a|0;return}function cT(a){a=a|0;return}function cU(a){a=a|0;return}function cV(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,l=0,m=0.0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0.0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0.0,ag=0.0,ah=0,ai=0.0,aj=0.0,ak=0.0,al=0.0,am=0.0,an=0.0,ao=0.0,ap=0.0,aq=0.0,ar=0.0,as=0.0,at=0.0,au=0.0,av=0.0,aw=0.0,ax=0.0,ay=0.0,az=0.0,aA=0.0,aB=0.0,aC=0.0,aD=0;e=i;i=i+52|0;f=e|0;h=e+16|0;j=e+32|0;l=a+48|0;if((c[l>>2]|0)<=0){m=0.0;n=m>=-.007499999832361937;i=e;return n|0}o=a+36|0;p=a+24|0;a=f+8|0;q=f+12|0;r=h+8|0;s=h+12|0;t=f;u=h;v=j;w=j+8|0;x=j+16|0;y=0;z=0.0;while(1){A=c[o>>2]|0;B=A+(y*88&-1)|0;C=c[A+(y*88&-1)+32>>2]|0;D=c[A+(y*88&-1)+36>>2]|0;E=A+(y*88&-1)+48|0;F=c[E+4>>2]|0;G=(c[k>>2]=c[E>>2]|0,+g[k>>2]);H=(c[k>>2]=F,+g[k>>2]);F=A+(y*88&-1)+56|0;E=c[F+4>>2]|0;I=(c[k>>2]=c[F>>2]|0,+g[k>>2]);J=(c[k>>2]=E,+g[k>>2]);E=c[A+(y*88&-1)+84>>2]|0;if((C|0)==(b|0)|(C|0)==(d|0)){K=+g[A+(y*88&-1)+40>>2];L=+g[A+(y*88&-1)+64>>2]}else{K=0.0;L=0.0}M=+g[A+(y*88&-1)+44>>2];N=+g[A+(y*88&-1)+68>>2];A=c[p>>2]|0;F=A+(C*12&-1)|0;O=c[F+4>>2]|0;R=(c[k>>2]=c[F>>2]|0,+g[k>>2]);S=(c[k>>2]=O,+g[k>>2]);T=+g[A+(C*12&-1)+8>>2];O=A+(D*12&-1)|0;F=c[O+4>>2]|0;U=(c[k>>2]=c[O>>2]|0,+g[k>>2]);V=(c[k>>2]=F,+g[k>>2]);W=+g[A+(D*12&-1)+8>>2];if((E|0)>0){X=K+M;Y=S;Z=R;_=V;$=U;aa=T;ab=W;F=0;ac=z;while(1){ad=+Q(+aa);g[a>>2]=ad;ae=+P(+aa);g[q>>2]=ae;af=+Q(+ab);g[r>>2]=af;ag=+P(+ab);g[s>>2]=ag;O=(g[k>>2]=Z-(G*ae-H*ad),c[k>>2]|0);ah=(g[k>>2]=Y-(H*ae+G*ad),c[k>>2]|0)|0;c[t>>2]=0|O;c[t+4>>2]=ah;ah=(g[k>>2]=$-(I*ag-J*af),c[k>>2]|0);O=(g[k>>2]=_-(J*ag+I*af),c[k>>2]|0)|0;c[u>>2]=0|ah;c[u+4>>2]=O;c0(j,B,f,h,F);O=c[v+4>>2]|0;af=(c[k>>2]=c[v>>2]|0,+g[k>>2]);ag=(c[k>>2]=O,+g[k>>2]);O=c[w+4>>2]|0;ad=(c[k>>2]=c[w>>2]|0,+g[k>>2]);ae=(c[k>>2]=O,+g[k>>2]);ai=+g[x>>2];aj=ad-Z;ak=ae-Y;al=ad-$;ad=ae-_;am=ac<ai?ac:ai;ae=(ai+.004999999888241291)*.75;ai=ae<0.0?ae:0.0;ae=ag*aj-af*ak;an=ag*al-af*ad;ao=an*N*an+(X+ae*L*ae);if(ao>0.0){ap=(-0.0-(ai<-.20000000298023224?-.20000000298023224:ai))/ao}else{ap=0.0}ao=af*ap;af=ag*ap;aq=Z-K*ao;ar=Y-K*af;as=aa-L*(aj*af-ak*ao);at=$+M*ao;au=_+M*af;av=ab+N*(al*af-ad*ao);O=F+1|0;if((O|0)==(E|0)){break}else{Y=ar;Z=aq;_=au;$=at;aa=as;ab=av;F=O;ac=am}}aw=ar;ax=aq;ay=au;az=at;aA=as;aB=av;aC=am;aD=c[p>>2]|0}else{aw=S;ax=R;ay=V;az=U;aA=T;aB=W;aC=z;aD=A}F=aD+(C*12&-1)|0;E=(g[k>>2]=ax,c[k>>2]|0);B=(g[k>>2]=aw,c[k>>2]|0)|0;c[F>>2]=0|E;c[F+4>>2]=B;g[(c[p>>2]|0)+(C*12&-1)+8>>2]=aA;B=(c[p>>2]|0)+(D*12&-1)|0;F=(g[k>>2]=az,c[k>>2]|0);E=(g[k>>2]=ay,c[k>>2]|0)|0;c[B>>2]=0|F;c[B+4>>2]=E;g[(c[p>>2]|0)+(D*12&-1)+8>>2]=aB;E=y+1|0;if((E|0)<(c[l>>2]|0)){y=E;z=aC}else{m=aC;break}}n=m>=-.007499999832361937;i=e;return n|0}function cW(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bo(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function cX(a){a=a|0;dt(a);return}function cY(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;i=i+252|0;g=f|0;bp(g,b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function cZ(a){a=a|0;dt(a);return}function c_(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bm(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function c$(a){a=a|0;dt(a);return}function c0(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,l=0.0,m=0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0;if((c[b+84>>2]|0)<=0){aK(5244848,617,5248592,5243552)}h=c[b+72>>2]|0;if((h|0)==2){i=e+12|0;j=+g[i>>2];l=+g[b+16>>2];m=e+8|0;n=+g[m>>2];o=+g[b+20>>2];p=j*l-n*o;q=l*n+j*o;r=a;s=(g[k>>2]=p,c[k>>2]|0);t=(g[k>>2]=q,c[k>>2]|0)|0;c[r>>2]=0|s;c[r+4>>2]=t;o=+g[i>>2];j=+g[b+24>>2];n=+g[m>>2];l=+g[b+28>>2];u=+g[d+12>>2];v=+g[b+(f<<3)>>2];w=+g[d+8>>2];x=+g[b+(f<<3)+4>>2];y=+g[d>>2]+(u*v-w*x);z=v*w+u*x+ +g[d+4>>2];g[a+16>>2]=p*(y-(+g[e>>2]+(o*j-n*l)))+(z-(j*n+o*l+ +g[e+4>>2]))*q- +g[b+76>>2]- +g[b+80>>2];m=a+8|0;i=(g[k>>2]=y,c[k>>2]|0);t=(g[k>>2]=z,c[k>>2]|0)|0;c[m>>2]=0|i;c[m+4>>2]=t;t=(g[k>>2]=-0.0-p,c[k>>2]|0);m=(g[k>>2]=-0.0-q,c[k>>2]|0)|0;c[r>>2]=0|t;c[r+4>>2]=m;return}else if((h|0)==1){m=d+12|0;q=+g[m>>2];p=+g[b+16>>2];r=d+8|0;z=+g[r>>2];y=+g[b+20>>2];l=q*p-z*y;o=p*z+q*y;t=a;i=(g[k>>2]=l,c[k>>2]|0);s=(g[k>>2]=o,c[k>>2]|0)|0;c[t>>2]=0|i;c[t+4>>2]=s;y=+g[m>>2];q=+g[b+24>>2];z=+g[r>>2];p=+g[b+28>>2];n=+g[e+12>>2];j=+g[b+(f<<3)>>2];x=+g[e+8>>2];u=+g[b+(f<<3)+4>>2];w=+g[e>>2]+(n*j-x*u);v=j*x+n*u+ +g[e+4>>2];g[a+16>>2]=l*(w-(+g[d>>2]+(y*q-z*p)))+(v-(q*z+y*p+ +g[d+4>>2]))*o- +g[b+76>>2]- +g[b+80>>2];f=a+8|0;r=(g[k>>2]=w,c[k>>2]|0);m=(g[k>>2]=v,c[k>>2]|0)|0;c[f>>2]=0|r;c[f+4>>2]=m;return}else if((h|0)==0){v=+g[d+12>>2];w=+g[b+24>>2];o=+g[d+8>>2];p=+g[b+28>>2];y=+g[d>>2]+(v*w-o*p);z=w*o+v*p+ +g[d+4>>2];p=+g[e+12>>2];v=+g[b>>2];o=+g[e+8>>2];w=+g[b+4>>2];q=+g[e>>2]+(p*v-o*w);l=v*o+p*w+ +g[e+4>>2];w=q-y;p=l-z;e=a;d=(g[k>>2]=w,c[k>>2]|0);h=(g[k>>2]=p,c[k>>2]|0)|0;c[e>>2]=0|d;c[e+4>>2]=h;o=+N(+(w*w+p*p));if(o<1.1920928955078125e-7){A=w;B=p}else{v=1.0/o;o=w*v;g[a>>2]=o;u=p*v;g[a+4>>2]=u;A=o;B=u}h=a+8|0;e=(g[k>>2]=(y+q)*.5,c[k>>2]|0);d=(g[k>>2]=(z+l)*.5,c[k>>2]|0)|0;c[h>>2]=0|e;c[h+4>>2]=d;g[a+16>>2]=w*A+p*B- +g[b+76>>2]- +g[b+80>>2];return}else{return}}function c1(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,k=0.0;e=bY(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;c[f>>2]=5250548;c[e+4>>2]=4;c[e+48>>2]=a;c[e+52>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;dx(e+8|0,0,40);g[e+136>>2]=+N(+(+g[a+16>>2]*+g[d+16>>2]));j=+g[a+20>>2];k=+g[d+20>>2];g[e+140>>2]=j>k?j:k;c[f>>2]=5250668;if((c[(c[a+12>>2]|0)+4>>2]|0)!=1){aK(5244700,41,5248976,5246040)}if((c[(c[d+12>>2]|0)+4>>2]|0)==0){h=e;i=h|0;return i|0}else{aK(5244700,42,5248976,5245168)}return 0}function c2(b,d){b=b|0;d=d|0;var e=0,f=0;aU[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251816]|0;if((e&255)<14){f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}else{aK(5243252,173,5249472,5244088)}}function c3(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,k=0.0;e=bY(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;c[f>>2]=5250548;c[e+4>>2]=4;c[e+48>>2]=a;c[e+52>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;dx(e+8|0,0,40);g[e+136>>2]=+N(+(+g[a+16>>2]*+g[d+16>>2]));j=+g[a+20>>2];k=+g[d+20>>2];g[e+140>>2]=j>k?j:k;c[f>>2]=5250620;if((c[(c[a+12>>2]|0)+4>>2]|0)!=1){aK(5244596,41,5248808,5246040)}if((c[(c[d+12>>2]|0)+4>>2]|0)==2){h=e;i=h|0;return i|0}else{aK(5244596,42,5248808,5245056)}return 0}function c4(b,d){b=b|0;d=d|0;var e=0,f=0;aU[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251816]|0;if((e&255)<14){f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}else{aK(5243252,173,5249472,5244088)}}function c5(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,k=0.0;e=bY(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;c[f>>2]=5250548;c[e+4>>2]=4;c[e+48>>2]=a;c[e+52>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;dx(e+8|0,0,40);g[e+136>>2]=+N(+(+g[a+16>>2]*+g[d+16>>2]));j=+g[a+20>>2];k=+g[d+20>>2];g[e+140>>2]=j>k?j:k;c[f>>2]=5250572;if((c[(c[a+12>>2]|0)+4>>2]|0)!=2){aK(5244476,41,5248512,5245996)}if((c[(c[d+12>>2]|0)+4>>2]|0)==0){h=e;i=h|0;return i|0}else{aK(5244476,42,5248512,5245168)}return 0}function c6(b,d){b=b|0;d=d|0;var e=0,f=0;aU[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251816]|0;if((e&255)<14){f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}else{aK(5243252,173,5249472,5244088)}}function c7(a){a=a|0;return}function c8(a){a=a|0;return}function c9(a){a=a|0;return}function da(a){a=a|0;return}function db(a){a=a|0;return}function dc(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((c[d+8>>2]|0)!=(b|0)){return}b=d+16|0;g=c[b>>2]|0;if((g|0)==0){c[b>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((g|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1|0;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function dd(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;if((c[d+8>>2]|0)==(b|0)){if((c[d+4>>2]|0)!=(e|0)){return}g=d+28|0;if((c[g>>2]|0)==1){return}c[g>>2]=f;return}if((c[d>>2]|0)!=(b|0)){return}do{if((c[d+16>>2]|0)!=(e|0)){b=d+20|0;if((c[b>>2]|0)==(e|0)){break}c[d+32>>2]=f;c[b>>2]=e;b=d+40|0;c[b>>2]=(c[b>>2]|0)+1|0;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){break}a[d+54|0]=1}}while(0);c[d+44>>2]=4;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function de(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0;if((c[d+8>>2]|0)!=(b|0)){return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;b=c[f>>2]|0;if((b|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1|0;a[d+54|0]=1;return}e=d+24|0;b=c[e>>2]|0;if((b|0)==2){c[e>>2]=g;i=g}else{i=b}if(!((c[d+48>>2]|0)==1&(i|0)==1)){return}a[d+54|0]=1;return}function df(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bs(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function dg(a){a=a|0;dt(a);return}function dh(a){a=a|0;dt(a);return}function di(a){a=a|0;dt(a);return}function dj(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+56|0;f=e|0;if((a|0)==(b|0)){g=1;i=e;return g|0}if((b|0)==0){g=0;i=e;return g|0}h=dl(b,5251320,5251308,-1)|0;b=h;if((h|0)==0){g=0;i=e;return g|0}dx(f|0,0,56);c[f>>2]=b;c[f+8>>2]=a;c[f+12>>2]=-1;c[f+48>>2]=1;a1[c[(c[h>>2]|0)+28>>2]&255](b,f,c[d>>2]|0,1);if((c[f+24>>2]|0)!=1){g=0;i=e;return g|0}c[d>>2]=c[f+16>>2]|0;g=1;i=e;return g|0}function dk(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((b|0)!=(c[d+8>>2]|0)){g=c[b+8>>2]|0;a1[c[(c[g>>2]|0)+28>>2]&255](g,d,e,f);return}g=d+16|0;b=c[g>>2]|0;if((b|0)==0){c[g>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1|0;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function dl(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;i=i+56|0;g=f|0;h=c[a>>2]|0;j=a+(c[h-8>>2]|0)|0;k=c[h-4>>2]|0;h=k;c[g>>2]=d;c[g+4>>2]=a;c[g+8>>2]=b;c[g+12>>2]=e;e=g+16|0;b=g+20|0;a=g+24|0;l=g+28|0;m=g+32|0;n=g+40|0;dx(e|0,0,39);if((k|0)==(d|0)){c[g+48>>2]=1;a$[c[(c[k>>2]|0)+20>>2]&255](h,g,j,j,1,0);i=f;return((c[a>>2]|0)==1?j:0)|0}aT[c[(c[k>>2]|0)+24>>2]&255](h,g,j,1,0);j=c[g+36>>2]|0;if((j|0)==1){do{if((c[a>>2]|0)!=1){if((c[n>>2]|0)!=0){o=0;i=f;return o|0}if((c[l>>2]|0)!=1){o=0;i=f;return o|0}if((c[m>>2]|0)==1){break}else{o=0}i=f;return o|0}}while(0);o=c[e>>2]|0;i=f;return o|0}else if((j|0)==0){if((c[n>>2]|0)!=1){o=0;i=f;return o|0}if((c[l>>2]|0)!=1){o=0;i=f;return o|0}o=(c[m>>2]|0)==1?c[b>>2]|0:0;i=f;return o|0}else{o=0;i=f;return o|0}return 0}function dm(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0;h=b|0;if((h|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){return}i=d+28|0;if((c[i>>2]|0)==1){return}c[i>>2]=f;return}if((h|0)!=(c[d>>2]|0)){h=c[b+8>>2]|0;aT[c[(c[h>>2]|0)+24>>2]&255](h,d,e,f,g);return}do{if((c[d+16>>2]|0)!=(e|0)){h=d+20|0;if((c[h>>2]|0)==(e|0)){break}c[d+32>>2]=f;i=d+44|0;if((c[i>>2]|0)==4){return}j=d+52|0;a[j]=0;k=d+53|0;a[k]=0;l=c[b+8>>2]|0;a$[c[(c[l>>2]|0)+20>>2]&255](l,d,e,e,1,g);do{if((a[k]&1)<<24>>24==0){m=0;n=2083}else{if((a[j]&1)<<24>>24==0){m=1;n=2083;break}else{break}}}while(0);L2665:do{if((n|0)==2083){c[h>>2]=e;j=d+40|0;c[j>>2]=(c[j>>2]|0)+1|0;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){n=2086;break}a[d+54|0]=1;if(m){break L2665}else{break}}else{n=2086}}while(0);if((n|0)==2086){if(m){break}}c[i>>2]=4;return}}while(0);c[i>>2]=3;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function dn(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0;if((b|0)!=(c[d+8>>2]|0)){i=c[b+8>>2]|0;a$[c[(c[i>>2]|0)+20>>2]&255](i,d,e,f,g,h);return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;h=c[f>>2]|0;if((h|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((h|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1|0;a[d+54|0]=1;return}e=d+24|0;h=c[e>>2]|0;if((h|0)==2){c[e>>2]=g;j=g}else{j=h}if(!((c[d+48>>2]|0)==1&(j|0)==1)){return}a[d+54|0]=1;return}function dp(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,k=0.0;e=bY(f,144)|0;if((e|0)==0){h=0;i=h|0;return i|0}f=e;c[f>>2]=5250548;c[e+4>>2]=4;c[e+48>>2]=a;c[e+52>>2]=d;c[e+56>>2]=0;c[e+60>>2]=0;c[e+124>>2]=0;c[e+128>>2]=0;dx(e+8|0,0,40);g[e+136>>2]=+N(+(+g[a+16>>2]*+g[d+16>>2]));j=+g[a+20>>2];k=+g[d+20>>2];g[e+140>>2]=j>k?j:k;c[f>>2]=5250728;if((c[(c[a+12>>2]|0)+4>>2]|0)!=2){aK(5244384,44,5249328,5245996)}if((c[(c[d+12>>2]|0)+4>>2]|0)==2){h=e;i=h|0;return i|0}else{aK(5244384,45,5249328,5245056)}return 0}function dq(b,d){b=b|0;d=d|0;var e=0,f=0;aU[c[(c[b>>2]|0)+4>>2]&255](b);e=a[5251816]|0;if((e&255)<14){f=d+12+((e&255)<<2)|0;c[b>>2]=c[f>>2]|0;c[f>>2]=b;return}else{aK(5243252,173,5249472,5244088)}}function dr(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,av=0,aw=0,ax=0,ay=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0;do{if(a>>>0<245){if(a>>>0<11){b=16}else{b=a+11&-8}d=b>>>3;e=c[1311633]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=5246572+(h<<2)|0;j=5246572+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[1311633]=e&(1<<g^-1)}else{if(l>>>0<(c[1311637]|0)>>>0){au();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{au();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[1311635]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=5246572+(p<<2)|0;m=5246572+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[1311633]=e&(1<<r^-1)}else{if(l>>>0<(c[1311637]|0)>>>0){au();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{au();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[1311635]|0;if((l|0)!=0){q=c[1311638]|0;d=l>>>3;l=d<<1;f=5246572+(l<<2)|0;k=c[1311633]|0;h=1<<d;do{if((k&h|0)==0){c[1311633]=k|h;s=f;t=5246572+(l+2<<2)|0}else{d=5246572+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[1311637]|0)>>>0){s=g;t=d;break}au();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[1311635]=m;c[1311638]=e;n=i;return n|0}l=c[1311634]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[5246836+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[1311637]|0;if(r>>>0<i>>>0){au();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){au();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;L2900:do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;do{if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break L2900}else{w=l;x=k;break}}else{w=g;x=q}}while(0);while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){au();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){au();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){au();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{au();return 0}}}while(0);L2922:do{if((e|0)!=0){f=d+28|0;i=5246836+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[1311634]=c[1311634]&(1<<c[f>>2]^-1);break L2922}else{if(e>>>0<(c[1311637]|0)>>>0){au();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break L2922}}}while(0);if(v>>>0<(c[1311637]|0)>>>0){au();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4|0)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b|0)>>2]=p;f=c[1311635]|0;if((f|0)!=0){e=c[1311638]|0;i=f>>>3;f=i<<1;q=5246572+(f<<2)|0;k=c[1311633]|0;g=1<<i;do{if((k&g|0)==0){c[1311633]=k|g;y=q;z=5246572+(f+2<<2)|0}else{i=5246572+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[1311637]|0)>>>0){y=l;z=i;break}au();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[1311635]=p;c[1311638]=m}f=d+8|0;if((f|0)==0){o=b;break}else{n=f}return n|0}else{if(a>>>0>4294967231){o=-1;break}f=a+11|0;g=f&-8;k=c[1311634]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=(14-(h|f|l)|0)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[5246836+(A<<2)>>2]|0;L2730:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break L2730}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break L2730}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[5246836+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}L2745:do{if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break L2745}else{p=r;m=i;q=e}}}}while(0);if((K|0)==0){o=g;break}if(J>>>0>=((c[1311635]|0)-g|0)>>>0){o=g;break}k=K;q=c[1311637]|0;if(k>>>0<q>>>0){au();return 0}m=k+g|0;p=m;if(k>>>0>=m>>>0){au();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;L2758:do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;do{if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break L2758}else{M=B;N=j;break}}else{M=d;N=r}}while(0);while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<q>>>0){au();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<q>>>0){au();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){au();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{au();return 0}}}while(0);L2780:do{if((e|0)!=0){i=K+28|0;q=5246836+(c[i>>2]<<2)|0;do{if((K|0)==(c[q>>2]|0)){c[q>>2]=L;if((L|0)!=0){break}c[1311634]=c[1311634]&(1<<c[i>>2]^-1);break L2780}else{if(e>>>0<(c[1311637]|0)>>>0){au();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break L2780}}}while(0);if(L>>>0<(c[1311637]|0)>>>0){au();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);do{if(J>>>0<16){e=J+g|0;c[K+4>>2]=e|3;i=k+(e+4|0)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[k+(g|4)>>2]=J|1;c[k+(J+g|0)>>2]=J;i=J>>>3;if(J>>>0<256){e=i<<1;q=5246572+(e<<2)|0;r=c[1311633]|0;j=1<<i;do{if((r&j|0)==0){c[1311633]=r|j;O=q;P=5246572+(e+2<<2)|0}else{i=5246572+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[1311637]|0)>>>0){O=d;P=i;break}au();return 0}}while(0);c[P>>2]=p;c[O+12>>2]=p;c[k+(g+8|0)>>2]=O;c[k+(g+12|0)>>2]=q;break}e=m;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=(14-(d|r|i)|0)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=5246836+(Q<<2)|0;c[k+(g+28|0)>>2]=Q;c[k+(g+20|0)>>2]=0;c[k+(g+16|0)>>2]=0;q=c[1311634]|0;l=1<<Q;if((q&l|0)==0){c[1311634]=q|l;c[j>>2]=e;c[k+(g+24|0)>>2]=j;c[k+(g+12|0)>>2]=e;c[k+(g+8|0)>>2]=e;break}if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}l=J<<R;q=c[j>>2]|0;while(1){if((c[q+4>>2]&-8|0)==(J|0)){break}S=q+16+(l>>>31<<2)|0;j=c[S>>2]|0;if((j|0)==0){T=2281;break}else{l=l<<1;q=j}}if((T|0)==2281){if(S>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[S>>2]=e;c[k+(g+24|0)>>2]=q;c[k+(g+12|0)>>2]=e;c[k+(g+8|0)>>2]=e;break}}l=q+8|0;j=c[l>>2]|0;i=c[1311637]|0;if(q>>>0<i>>>0){au();return 0}if(j>>>0<i>>>0){au();return 0}else{c[j+12>>2]=e;c[l>>2]=e;c[k+(g+8|0)>>2]=j;c[k+(g+12|0)>>2]=q;c[k+(g+24|0)>>2]=0;break}}}while(0);k=K+8|0;if((k|0)==0){o=g;break}else{n=k}return n|0}}while(0);K=c[1311635]|0;if(o>>>0<=K>>>0){S=K-o|0;J=c[1311638]|0;if(S>>>0>15){R=J;c[1311638]=R+o|0;c[1311635]=S;c[R+(o+4|0)>>2]=S|1;c[R+K>>2]=S;c[J+4>>2]=o|3}else{c[1311635]=0;c[1311638]=0;c[J+4>>2]=K|3;S=J+(K+4|0)|0;c[S>>2]=c[S>>2]|1}n=J+8|0;return n|0}J=c[1311636]|0;if(o>>>0<J>>>0){S=J-o|0;c[1311636]=S;J=c[1311639]|0;K=J;c[1311639]=K+o|0;c[K+(o+4|0)>>2]=S|1;c[J+4>>2]=o|3;n=J+8|0;return n|0}do{if((c[1310720]|0)==0){J=az(8)|0;if((J-1&J|0)==0){c[1310722]=J;c[1310721]=J;c[1310723]=-1;c[1310724]=2097152;c[1310725]=0;c[1311744]=0;c[1310720]=aQ(0)&-16^1431655768;break}else{au();return 0}}}while(0);J=o+48|0;S=c[1310722]|0;K=o+47|0;R=S+K|0;Q=-S|0;S=R&Q;if(S>>>0<=o>>>0){n=0;return n|0}O=c[1311743]|0;do{if((O|0)!=0){P=c[1311741]|0;L=P+S|0;if(L>>>0<=P>>>0|L>>>0>O>>>0){n=0}else{break}return n|0}}while(0);L2989:do{if((c[1311744]&4|0)==0){O=c[1311639]|0;L2991:do{if((O|0)==0){T=2311}else{L=O;P=5246980;while(1){U=P|0;M=c[U>>2]|0;if(M>>>0<=L>>>0){V=P+4|0;if((M+(c[V>>2]|0)|0)>>>0>L>>>0){break}}M=c[P+8>>2]|0;if((M|0)==0){T=2311;break L2991}else{P=M}}if((P|0)==0){T=2311;break}L=R-(c[1311636]|0)&Q;if(L>>>0>=2147483647){W=0;break}q=aM(L|0)|0;e=(q|0)==((c[U>>2]|0)+(c[V>>2]|0)|0);X=e?q:-1;Y=e?L:0;Z=q;_=L;T=2320;break}}while(0);do{if((T|0)==2311){O=aM(0)|0;if((O|0)==-1){W=0;break}g=O;L=c[1310721]|0;q=L-1|0;if((q&g|0)==0){$=S}else{$=(S-g|0)+(q+g&-L)|0}L=c[1311741]|0;g=L+$|0;if(!($>>>0>o>>>0&$>>>0<2147483647)){W=0;break}q=c[1311743]|0;if((q|0)!=0){if(g>>>0<=L>>>0|g>>>0>q>>>0){W=0;break}}q=aM($|0)|0;g=(q|0)==(O|0);X=g?O:-1;Y=g?$:0;Z=q;_=$;T=2320;break}}while(0);L3011:do{if((T|0)==2320){q=-_|0;if((X|0)!=-1){aa=Y;ab=X;T=2331;break L2989}do{if((Z|0)!=-1&_>>>0<2147483647&_>>>0<J>>>0){g=c[1310722]|0;O=(K-_|0)+g&-g;if(O>>>0>=2147483647){ac=_;break}if((aM(O|0)|0)==-1){aM(q|0);W=Y;break L3011}else{ac=O+_|0;break}}else{ac=_}}while(0);if((Z|0)==-1){W=Y}else{aa=ac;ab=Z;T=2331;break L2989}}}while(0);c[1311744]=c[1311744]|4;ad=W;T=2328;break}else{ad=0;T=2328}}while(0);do{if((T|0)==2328){if(S>>>0>=2147483647){break}W=aM(S|0)|0;Z=aM(0)|0;if(!((Z|0)!=-1&(W|0)!=-1&W>>>0<Z>>>0)){break}ac=Z-W|0;Z=ac>>>0>(o+40|0)>>>0;Y=Z?W:-1;if((Y|0)==-1){break}else{aa=Z?ac:ad;ab=Y;T=2331;break}}}while(0);do{if((T|0)==2331){ad=(c[1311741]|0)+aa|0;c[1311741]=ad;if(ad>>>0>(c[1311742]|0)>>>0){c[1311742]=ad}ad=c[1311639]|0;L3031:do{if((ad|0)==0){S=c[1311637]|0;if((S|0)==0|ab>>>0<S>>>0){c[1311637]=ab}c[1311745]=ab;c[1311746]=aa;c[1311748]=0;c[1311642]=c[1310720]|0;c[1311641]=-1;S=0;while(1){Y=S<<1;ac=5246572+(Y<<2)|0;c[5246572+(Y+3<<2)>>2]=ac;c[5246572+(Y+2<<2)>>2]=ac;ac=S+1|0;if((ac|0)==32){break}else{S=ac}}S=ab+8|0;if((S&7|0)==0){ae=0}else{ae=-S&7}S=(aa-40|0)-ae|0;c[1311639]=ab+ae|0;c[1311636]=S;c[ab+(ae+4|0)>>2]=S|1;c[ab+(aa-36|0)>>2]=40;c[1311640]=c[1310724]|0}else{S=5246980;while(1){af=c[S>>2]|0;ag=S+4|0;ah=c[ag>>2]|0;if((ab|0)==(af+ah|0)){T=2343;break}ac=c[S+8>>2]|0;if((ac|0)==0){break}else{S=ac}}do{if((T|0)==2343){if((c[S+12>>2]&8|0)!=0){break}ac=ad;if(!(ac>>>0>=af>>>0&ac>>>0<ab>>>0)){break}c[ag>>2]=ah+aa|0;ac=c[1311639]|0;Y=(c[1311636]|0)+aa|0;Z=ac;W=ac+8|0;if((W&7|0)==0){ai=0}else{ai=-W&7}W=Y-ai|0;c[1311639]=Z+ai|0;c[1311636]=W;c[Z+(ai+4|0)>>2]=W|1;c[Z+(Y+4|0)>>2]=40;c[1311640]=c[1310724]|0;break L3031}}while(0);if(ab>>>0<(c[1311637]|0)>>>0){c[1311637]=ab}S=ab+aa|0;Y=5246980;while(1){aj=Y|0;if((c[aj>>2]|0)==(S|0)){T=2353;break}Z=c[Y+8>>2]|0;if((Z|0)==0){break}else{Y=Z}}do{if((T|0)==2353){if((c[Y+12>>2]&8|0)!=0){break}c[aj>>2]=ab;S=Y+4|0;c[S>>2]=(c[S>>2]|0)+aa|0;S=ab+8|0;if((S&7|0)==0){ak=0}else{ak=-S&7}S=ab+(aa+8|0)|0;if((S&7|0)==0){al=0}else{al=-S&7}S=ab+(al+aa|0)|0;Z=S;W=ak+o|0;ac=ab+W|0;_=ac;K=(S-(ab+ak|0)|0)-o|0;c[ab+(ak+4|0)>>2]=o|3;do{if((Z|0)==(c[1311639]|0)){J=(c[1311636]|0)+K|0;c[1311636]=J;c[1311639]=_;c[ab+(W+4|0)>>2]=J|1}else{if((Z|0)==(c[1311638]|0)){J=(c[1311635]|0)+K|0;c[1311635]=J;c[1311638]=_;c[ab+(W+4|0)>>2]=J|1;c[ab+(J+W|0)>>2]=J;break}J=aa+4|0;X=c[ab+(J+al|0)>>2]|0;if((X&3|0)==1){$=X&-8;V=X>>>3;L3076:do{if(X>>>0<256){U=c[ab+((al|8)+aa|0)>>2]|0;Q=c[ab+((aa+12|0)+al|0)>>2]|0;R=5246572+(V<<1<<2)|0;do{if((U|0)!=(R|0)){if(U>>>0<(c[1311637]|0)>>>0){au();return 0}if((c[U+12>>2]|0)==(Z|0)){break}au();return 0}}while(0);if((Q|0)==(U|0)){c[1311633]=c[1311633]&(1<<V^-1);break}do{if((Q|0)==(R|0)){am=Q+8|0}else{if(Q>>>0<(c[1311637]|0)>>>0){au();return 0}q=Q+8|0;if((c[q>>2]|0)==(Z|0)){am=q;break}au();return 0}}while(0);c[U+12>>2]=Q;c[am>>2]=U}else{R=S;q=c[ab+((al|24)+aa|0)>>2]|0;P=c[ab+((aa+12|0)+al|0)>>2]|0;L3078:do{if((P|0)==(R|0)){O=al|16;g=ab+(J+O|0)|0;L=c[g>>2]|0;do{if((L|0)==0){e=ab+(O+aa|0)|0;M=c[e>>2]|0;if((M|0)==0){an=0;break L3078}else{ao=M;ap=e;break}}else{ao=L;ap=g}}while(0);while(1){g=ao+20|0;L=c[g>>2]|0;if((L|0)!=0){ao=L;ap=g;continue}g=ao+16|0;L=c[g>>2]|0;if((L|0)==0){break}else{ao=L;ap=g}}if(ap>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[ap>>2]=0;an=ao;break}}else{g=c[ab+((al|8)+aa|0)>>2]|0;if(g>>>0<(c[1311637]|0)>>>0){au();return 0}L=g+12|0;if((c[L>>2]|0)!=(R|0)){au();return 0}O=P+8|0;if((c[O>>2]|0)==(R|0)){c[L>>2]=P;c[O>>2]=g;an=P;break}else{au();return 0}}}while(0);if((q|0)==0){break}P=ab+((aa+28|0)+al|0)|0;U=5246836+(c[P>>2]<<2)|0;do{if((R|0)==(c[U>>2]|0)){c[U>>2]=an;if((an|0)!=0){break}c[1311634]=c[1311634]&(1<<c[P>>2]^-1);break L3076}else{if(q>>>0<(c[1311637]|0)>>>0){au();return 0}Q=q+16|0;if((c[Q>>2]|0)==(R|0)){c[Q>>2]=an}else{c[q+20>>2]=an}if((an|0)==0){break L3076}}}while(0);if(an>>>0<(c[1311637]|0)>>>0){au();return 0}c[an+24>>2]=q;R=al|16;P=c[ab+(R+aa|0)>>2]|0;do{if((P|0)!=0){if(P>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[an+16>>2]=P;c[P+24>>2]=an;break}}}while(0);P=c[ab+(J+R|0)>>2]|0;if((P|0)==0){break}if(P>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[an+20>>2]=P;c[P+24>>2]=an;break}}}while(0);aq=ab+(($|al)+aa|0)|0;ar=$+K|0}else{aq=Z;ar=K}J=aq+4|0;c[J>>2]=c[J>>2]&-2;c[ab+(W+4|0)>>2]=ar|1;c[ab+(ar+W|0)>>2]=ar;J=ar>>>3;if(ar>>>0<256){V=J<<1;X=5246572+(V<<2)|0;P=c[1311633]|0;q=1<<J;do{if((P&q|0)==0){c[1311633]=P|q;as=X;at=5246572+(V+2<<2)|0}else{J=5246572+(V+2<<2)|0;U=c[J>>2]|0;if(U>>>0>=(c[1311637]|0)>>>0){as=U;at=J;break}au();return 0}}while(0);c[at>>2]=_;c[as+12>>2]=_;c[ab+(W+8|0)>>2]=as;c[ab+(W+12|0)>>2]=X;break}V=ac;q=ar>>>8;do{if((q|0)==0){av=0}else{if(ar>>>0>16777215){av=31;break}P=(q+1048320|0)>>>16&8;$=q<<P;J=($+520192|0)>>>16&4;U=$<<J;$=(U+245760|0)>>>16&2;Q=(14-(J|P|$)|0)+(U<<$>>>15)|0;av=ar>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);q=5246836+(av<<2)|0;c[ab+(W+28|0)>>2]=av;c[ab+(W+20|0)>>2]=0;c[ab+(W+16|0)>>2]=0;X=c[1311634]|0;Q=1<<av;if((X&Q|0)==0){c[1311634]=X|Q;c[q>>2]=V;c[ab+(W+24|0)>>2]=q;c[ab+(W+12|0)>>2]=V;c[ab+(W+8|0)>>2]=V;break}if((av|0)==31){aw=0}else{aw=25-(av>>>1)|0}Q=ar<<aw;X=c[q>>2]|0;while(1){if((c[X+4>>2]&-8|0)==(ar|0)){break}ax=X+16+(Q>>>31<<2)|0;q=c[ax>>2]|0;if((q|0)==0){T=2426;break}else{Q=Q<<1;X=q}}if((T|0)==2426){if(ax>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[ax>>2]=V;c[ab+(W+24|0)>>2]=X;c[ab+(W+12|0)>>2]=V;c[ab+(W+8|0)>>2]=V;break}}Q=X+8|0;q=c[Q>>2]|0;$=c[1311637]|0;if(X>>>0<$>>>0){au();return 0}if(q>>>0<$>>>0){au();return 0}else{c[q+12>>2]=V;c[Q>>2]=V;c[ab+(W+8|0)>>2]=q;c[ab+(W+12|0)>>2]=X;c[ab+(W+24|0)>>2]=0;break}}}while(0);n=ab+(ak|8)|0;return n|0}}while(0);Y=ad;W=5246980;while(1){ay=c[W>>2]|0;if(ay>>>0<=Y>>>0){aA=c[W+4>>2]|0;aB=ay+aA|0;if(aB>>>0>Y>>>0){break}}W=c[W+8>>2]|0}W=ay+(aA-39|0)|0;if((W&7|0)==0){aC=0}else{aC=-W&7}W=ay+((aA-47|0)+aC|0)|0;ac=W>>>0<(ad+16|0)>>>0?Y:W;W=ac+8|0;_=ab+8|0;if((_&7|0)==0){aD=0}else{aD=-_&7}_=(aa-40|0)-aD|0;c[1311639]=ab+aD|0;c[1311636]=_;c[ab+(aD+4|0)>>2]=_|1;c[ab+(aa-36|0)>>2]=40;c[1311640]=c[1310724]|0;c[ac+4>>2]=27;dw(W|0,5246980,16);c[1311745]=ab;c[1311746]=aa;c[1311748]=0;c[1311747]=W;W=ac+28|0;c[W>>2]=7;L3195:do{if((ac+32|0)>>>0<aB>>>0){_=W;while(1){K=_+4|0;c[K>>2]=7;if((_+8|0)>>>0<aB>>>0){_=K}else{break L3195}}}}while(0);if((ac|0)==(Y|0)){break}W=ac-ad|0;_=Y+(W+4|0)|0;c[_>>2]=c[_>>2]&-2;c[ad+4>>2]=W|1;c[Y+W>>2]=W;_=W>>>3;if(W>>>0<256){K=_<<1;Z=5246572+(K<<2)|0;S=c[1311633]|0;q=1<<_;do{if((S&q|0)==0){c[1311633]=S|q;aE=Z;aF=5246572+(K+2<<2)|0}else{_=5246572+(K+2<<2)|0;Q=c[_>>2]|0;if(Q>>>0>=(c[1311637]|0)>>>0){aE=Q;aF=_;break}au();return 0}}while(0);c[aF>>2]=ad;c[aE+12>>2]=ad;c[ad+8>>2]=aE;c[ad+12>>2]=Z;break}K=ad;q=W>>>8;do{if((q|0)==0){aG=0}else{if(W>>>0>16777215){aG=31;break}S=(q+1048320|0)>>>16&8;Y=q<<S;ac=(Y+520192|0)>>>16&4;_=Y<<ac;Y=(_+245760|0)>>>16&2;Q=(14-(ac|S|Y)|0)+(_<<Y>>>15)|0;aG=W>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);q=5246836+(aG<<2)|0;c[ad+28>>2]=aG;c[ad+20>>2]=0;c[ad+16>>2]=0;Z=c[1311634]|0;Q=1<<aG;if((Z&Q|0)==0){c[1311634]=Z|Q;c[q>>2]=K;c[ad+24>>2]=q;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}if((aG|0)==31){aH=0}else{aH=25-(aG>>>1)|0}Q=W<<aH;Z=c[q>>2]|0;while(1){if((c[Z+4>>2]&-8|0)==(W|0)){break}aI=Z+16+(Q>>>31<<2)|0;q=c[aI>>2]|0;if((q|0)==0){T=2461;break}else{Q=Q<<1;Z=q}}if((T|0)==2461){if(aI>>>0<(c[1311637]|0)>>>0){au();return 0}else{c[aI>>2]=K;c[ad+24>>2]=Z;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}}Q=Z+8|0;W=c[Q>>2]|0;q=c[1311637]|0;if(Z>>>0<q>>>0){au();return 0}if(W>>>0<q>>>0){au();return 0}else{c[W+12>>2]=K;c[Q>>2]=K;c[ad+8>>2]=W;c[ad+12>>2]=Z;c[ad+24>>2]=0;break}}}while(0);ad=c[1311636]|0;if(ad>>>0<=o>>>0){break}W=ad-o|0;c[1311636]=W;ad=c[1311639]|0;Q=ad;c[1311639]=Q+o|0;c[Q+(o+4|0)>>2]=W|1;c[ad+4>>2]=o|3;n=ad+8|0;return n|0}}while(0);c[aN()>>2]=12;n=0;return n|0}function ds(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[1311637]|0;if(b>>>0<e>>>0){au()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){au()}h=f&-8;i=a+(h-8|0)|0;j=i;L3248:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){au()}if((n|0)==(c[1311638]|0)){p=a+(h-4|0)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[1311635]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4|0)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256){k=c[a+(l+8|0)>>2]|0;s=c[a+(l+12|0)>>2]|0;t=5246572+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){au()}if((c[k+12>>2]|0)==(n|0)){break}au()}}while(0);if((s|0)==(k|0)){c[1311633]=c[1311633]&(1<<p^-1);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){au()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}au()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24|0)>>2]|0;v=c[a+(l+12|0)>>2]|0;L3282:do{if((v|0)==(t|0)){w=a+(l+20|0)|0;x=c[w>>2]|0;do{if((x|0)==0){y=a+(l+16|0)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break L3282}else{B=z;C=y;break}}else{B=x;C=w}}while(0);while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){au()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8|0)>>2]|0;if(w>>>0<e>>>0){au()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){au()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{au()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28|0)|0;m=5246836+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[1311634]=c[1311634]&(1<<c[v>>2]^-1);q=n;r=o;break L3248}else{if(p>>>0<(c[1311637]|0)>>>0){au()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break L3248}}}while(0);if(A>>>0<(c[1311637]|0)>>>0){au()}c[A+24>>2]=p;t=c[a+(l+16|0)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[1311637]|0)>>>0){au()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20|0)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[1311637]|0)>>>0){au()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){au()}A=a+(h-4|0)|0;e=c[A>>2]|0;if((e&1|0)==0){au()}do{if((e&2|0)==0){if((j|0)==(c[1311639]|0)){B=(c[1311636]|0)+r|0;c[1311636]=B;c[1311639]=q;c[q+4>>2]=B|1;if((q|0)==(c[1311638]|0)){c[1311638]=0;c[1311635]=0}if(B>>>0<=(c[1311640]|0)>>>0){return}du(0);return}if((j|0)==(c[1311638]|0)){B=(c[1311635]|0)+r|0;c[1311635]=B;c[1311638]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;L3353:do{if(e>>>0<256){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=5246572+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[1311637]|0)>>>0){au()}if((c[u+12>>2]|0)==(j|0)){break}au()}}while(0);if((g|0)==(u|0)){c[1311633]=c[1311633]&(1<<C^-1);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[1311637]|0)>>>0){au()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}au()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16|0)>>2]|0;t=c[a+(h|4)>>2]|0;L3355:do{if((t|0)==(b|0)){p=a+(h+12|0)|0;v=c[p>>2]|0;do{if((v|0)==0){m=a+(h+8|0)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break L3355}else{F=k;G=m;break}}else{F=v;G=p}}while(0);while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[1311637]|0)>>>0){au()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[1311637]|0)>>>0){au()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){au()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{au()}}}while(0);if((f|0)==0){break}t=a+(h+20|0)|0;u=5246836+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[1311634]=c[1311634]&(1<<c[t>>2]^-1);break L3353}else{if(f>>>0<(c[1311637]|0)>>>0){au()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break L3353}}}while(0);if(E>>>0<(c[1311637]|0)>>>0){au()}c[E+24>>2]=f;b=c[a+(h+8|0)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[1311637]|0)>>>0){au()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12|0)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[1311637]|0)>>>0){au()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[1311638]|0)){H=B;break}c[1311635]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256){d=r<<1;e=5246572+(d<<2)|0;A=c[1311633]|0;E=1<<r;do{if((A&E|0)==0){c[1311633]=A|E;I=e;J=5246572+(d+2<<2)|0}else{r=5246572+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[1311637]|0)>>>0){I=h;J=r;break}au()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=(14-(E|J|d)|0)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=5246836+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[1311634]|0;d=1<<K;do{if((r&d|0)==0){c[1311634]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{if((K|0)==31){L=0}else{L=25-(K>>>1)|0}A=H<<L;J=c[I>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(H|0)){break}M=J+16+(A>>>31<<2)|0;E=c[M>>2]|0;if((E|0)==0){N=2640;break}else{A=A<<1;J=E}}if((N|0)==2640){if(M>>>0<(c[1311637]|0)>>>0){au()}else{c[M>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break}}A=J+8|0;B=c[A>>2]|0;E=c[1311637]|0;if(J>>>0<E>>>0){au()}if(B>>>0<E>>>0){au()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=J;c[q+24>>2]=0;break}}}while(0);q=(c[1311641]|0)-1|0;c[1311641]=q;if((q|0)==0){O=5246988}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[1311641]=-1;return}function dt(a){a=a|0;if((a|0)==0){return}ds(a);return}function du(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;do{if((c[1310720]|0)==0){b=az(8)|0;if((b-1&b|0)==0){c[1310722]=b;c[1310721]=b;c[1310723]=-1;c[1310724]=2097152;c[1310725]=0;c[1311744]=0;c[1310720]=aQ(0)&-16^1431655768;break}else{au();return 0}}}while(0);if(a>>>0>=4294967232){d=0;e=d&1;return e|0}b=c[1311639]|0;if((b|0)==0){d=0;e=d&1;return e|0}f=c[1311636]|0;do{if(f>>>0>(a+40|0)>>>0){g=c[1310722]|0;h=Z(((((((-40-a|0)-1|0)+f|0)+g|0)>>>0)/(g>>>0)>>>0)-1|0,g);i=b;j=5246980;while(1){k=c[j>>2]|0;if(k>>>0<=i>>>0){if((k+(c[j+4>>2]|0)|0)>>>0>i>>>0){l=j;break}}k=c[j+8>>2]|0;if((k|0)==0){l=0;break}else{j=k}}if((c[l+12>>2]&8|0)!=0){break}j=aM(0)|0;i=l+4|0;if((j|0)!=((c[l>>2]|0)+(c[i>>2]|0)|0)){break}k=aM(-(h>>>0>2147483646?-2147483648-g|0:h)|0)|0;m=aM(0)|0;if(!((k|0)!=-1&m>>>0<j>>>0)){break}k=j-m|0;if((j|0)==(m|0)){break}c[i>>2]=(c[i>>2]|0)-k|0;c[1311741]=(c[1311741]|0)-k|0;i=c[1311639]|0;n=(c[1311636]|0)-k|0;k=i;o=i+8|0;if((o&7|0)==0){p=0}else{p=-o&7}o=n-p|0;c[1311639]=k+p|0;c[1311636]=o;c[k+(p+4|0)>>2]=o|1;c[k+(n+4|0)>>2]=40;c[1311640]=c[1310724]|0;d=(j|0)!=(m|0);e=d&1;return e|0}}while(0);if((c[1311636]|0)>>>0<=(c[1311640]|0)>>>0){d=0;e=d&1;return e|0}c[1311640]=-1;d=0;e=d&1;return e|0}function dv(b){b=b|0;var c=0;c=b;while(a[c]|0!=0){c=c+1|0}return c-b|0}function dw(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2]|0;b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function dx(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=b+e|0;if((e|0)>=20){d=d&255;e=b&3;g=d|d<<8|d<<16|d<<24;h=f&~3;if(e){e=b+4-e|0;while((b|0)<(e|0)){a[b]=d;b=b+1|0}}while((b|0)<(h|0)){c[b>>2]=g;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}}function dy(){aG()}function dz(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;return aS[a&255](b|0,c|0,d|0,e|0,f|0)|0}function dA(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;aT[a&255](b|0,c|0,d|0,e|0,f|0)}function dB(a,b){a=a|0;b=b|0;aU[a&255](b|0)}function dC(a,b,c){a=a|0;b=b|0;c=c|0;aV[a&255](b|0,c|0)}function dD(a,b){a=a|0;b=b|0;return aW[a&255](b|0)|0}function dE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return aX[a&255](b|0,c|0,d|0)|0}function dF(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;aY[a&255](b|0,c|0,d|0)}function dG(a){a=a|0;aZ[a&255]()}function dH(a,b,c,d){a=a|0;b=b|0;c=c|0;d=+d;a_[a&255](b|0,c|0,+d)}function dI(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;a$[a&255](b|0,c|0,d|0,e|0,f|0,g|0)}function dJ(a,b,c){a=a|0;b=b|0;c=c|0;return a0[a&255](b|0,c|0)|0}function dK(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;a1[a&255](b|0,c|0,d|0,e|0)}function dL(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;_(0);return 0}function dM(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;_(1)}function dN(a){a=a|0;_(2)}function dO(a,b){a=a|0;b=b|0;_(3)}function dP(a){a=a|0;_(4);return 0}function dQ(a,b,c){a=a|0;b=b|0;c=c|0;_(5);return 0}function dR(a,b,c){a=a|0;b=b|0;c=c|0;_(6)}function dS(){_(7)}function dT(a,b,c){a=a|0;b=b|0;c=+c;_(8)}function dU(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;_(9)}function dV(a,b){a=a|0;b=b|0;_(10);return 0}function dW(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;_(11)}
// EMSCRIPTEN_END_FUNCS
var aS=[dL,dL,dL,dL,dL,dL,dL,dL,cC,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,c5,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,cG,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,bS,dL,dL,dL,dL,dL,dL,dL,dL,dL,bW,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,c3,dL,dL,dL,dL,dL,c1,dL,dp,dL,dL,dL,dL,dL,cE,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL,dL];var aT=[dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dd,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dm,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM,dM];var aU=[dN,dN,cT,dN,dN,dN,cA,dN,dN,dN,da,dN,di,dN,dN,dN,dN,dN,cZ,dN,cw,dN,cS,dN,dN,dN,cX,dN,cr,dN,dN,dN,dN,dN,dh,dN,dN,dN,dN,dN,c$,dN,dN,dN,dN,dN,dN,dN,cM,dN,dN,dN,dN,dN,dN,dN,bh,dN,b$,dN,dN,dN,dN,dN,cB,dN,dg,dN,dN,dN,dN,dN,cU,dN,cg,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,c8,dN,cs,dN,dN,dN,dN,dN,dN,dN,dN,dN,bT,dN,dN,dN,dN,dN,dN,dN,cK,dN,bg,dN,bV,dN,dN,dN,dN,dN,c7,dN,dN,dN,dN,dN,dN,dN,b_,dN,dN,dN,c9,dN,db,dN,dN,dN,dN,dN,dN,dN,cy,dN,cq,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN,dN];var aV=[dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,c4,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,cH,dO,cc,dO,dO,dO,dO,dO,dq,dO,dO,dO,dO,dO,dO,dO,c2,dO,cF,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,cb,dO,dO,dO,dO,dO,dO,dO,dO,dO,cD,dO,dO,dO,dO,dO,dO,dO,c6,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO,dO];var aW=[dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,bH,dP,dP,dP,dP,dP,dP,dP,bN,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP,dP];var aX=[dQ,dQ,dQ,dQ,bQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,bI,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dj,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,ct,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ,dQ];var aY=[dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,ce,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,cd,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR,dR];var aZ=[dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dy,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS,dS];var a_=[dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,bP,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,bX,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT,dT];var a$=[dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,de,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dn,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU,dU];var a0=[dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,bJ,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,bi,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,bU,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,b4,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV,dV];var a1=[dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,cu,dW,dW,dW,dW,dW,dW,dW,cY,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,bO,dW,dW,dW,dW,dW,dW,dW,dc,dW,dW,dW,dW,dW,bR,dW,dW,dW,dW,dW,dW,dW,df,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dk,dW,dW,dW,cW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,cz,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,c_,dW,dW,dW,dW,dW,cx,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW,dW];return{_strlen:dv,_free:ds,_main:bj,_memset:dx,_malloc:dr,_memcpy:dw,stackAlloc:a2,stackSave:a3,stackRestore:a4,setThrew:a5,setTempRet0:a6,setTempRet1:a7,setTempRet2:a8,setTempRet3:a9,setTempRet4:ba,setTempRet5:bb,setTempRet6:bc,setTempRet7:bd,setTempRet8:be,setTempRet9:bf,dynCall_iiiiii:dz,dynCall_viiiii:dA,dynCall_vi:dB,dynCall_vii:dC,dynCall_ii:dD,dynCall_iiii:dE,dynCall_viii:dF,dynCall_v:dG,dynCall_viif:dH,dynCall_viiiiii:dI,dynCall_iii:dJ,dynCall_viiii:dK}})
// EMSCRIPTEN_END_ASM
({ Math: Math, Int8Array: Int8Array, Int16Array: Int16Array, Int32Array: Int32Array, Uint8Array: Uint8Array, Uint16Array: Uint16Array, Uint32Array: Uint32Array, Float32Array: Float32Array, Float64Array: Float64Array }, { abort: abort, assert: assert, asmPrintInt: asmPrintInt, asmPrintFloat: asmPrintFloat, copyTempDouble: copyTempDouble, copyTempFloat: copyTempFloat, min: Math_min, invoke_iiiiii: invoke_iiiiii, invoke_viiiii: invoke_viiiii, invoke_vi: invoke_vi, invoke_vii: invoke_vii, invoke_ii: invoke_ii, invoke_iiii: invoke_iiii, invoke_viii: invoke_viii, invoke_v: invoke_v, invoke_viif: invoke_viif, invoke_viiiiii: invoke_viiiiii, invoke_iii: invoke_iii, invoke_viiii: invoke_viiii, _llvm_lifetime_end: _llvm_lifetime_end, _cosf: _cosf, _floorf: _floorf, _abort: _abort, _fprintf: _fprintf, _printf: _printf, __reallyNegative: __reallyNegative, _sqrtf: _sqrtf, _sysconf: _sysconf, _clock: _clock, ___setErrNo: ___setErrNo, _fwrite: _fwrite, _qsort: _qsort, _write: _write, _exit: _exit, ___cxa_pure_virtual: ___cxa_pure_virtual, __formatString: __formatString, __ZSt9terminatev: __ZSt9terminatev, _sinf: _sinf, ___assert_func: ___assert_func, _pwrite: _pwrite, _sbrk: _sbrk, ___errno_location: ___errno_location, ___gxx_personality_v0: ___gxx_personality_v0, _llvm_lifetime_start: _llvm_lifetime_start, _time: _time, __exit: __exit, STACKTOP: STACKTOP, STACK_MAX: STACK_MAX, tempDoublePtr: tempDoublePtr, ABORT: ABORT, NaN: NaN, Infinity: Infinity, __ZTVN10__cxxabiv120__si_class_type_infoE: __ZTVN10__cxxabiv120__si_class_type_infoE, __ZTVN10__cxxabiv117__class_type_infoE: __ZTVN10__cxxabiv117__class_type_infoE }, buffer);
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
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(!Module['preRun'] || Module['preRun'].length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  ensureInitRuntime();
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
    ensureInitRuntime();
    preMain();
    var ret = 0;
    calledRun = true;
    if (Module['_main'] && shouldRunNow) {
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
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
  // {{MODULE_ADDITIONS}}
