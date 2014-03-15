// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
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
  Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function read(filename, binary) {
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
  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };
  Module['load'] = function load(f) {
    globalEval(read(f));
  };
  Module['arguments'] = process['argv'].slice(2);
  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }
  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };
  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  this['Module'] = Module;
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  if (typeof console !== 'undefined') {
    Module['print'] = function print(x) {
      console.log(x);
    };
    Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  if (ENVIRONMENT_IS_WEB) {
    this['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
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
Module['preRun'] = [];
Module['postRun'] = [];
// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
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
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
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
  if (isArrayType(type)) return true;
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
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
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
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
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
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + Pointer_stringify(code) + ' })'); // new Function does not allow upvars in node
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
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;
      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }
      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*(+4294967296))) : ((+((low>>>0)))+((+((high|0)))*(+4294967296)))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
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
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
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
    var func = Module['_' + ident]; // closure exported function
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
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
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
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
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
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
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
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
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
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
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
  // TODO: use TextDecoder
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
// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr', 
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0
}
Module['stringToUTF16'] = stringToUTF16;
// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr', 
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0
}
Module['stringToUTF32'] = stringToUTF32;
function demangle(func) {
  try {
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    var i = 3;
    // params, etc.
    var basicTypes = {
      'v': 'void',
      'b': 'bool',
      'c': 'char',
      's': 'short',
      'i': 'int',
      'l': 'long',
      'f': 'float',
      'd': 'double',
      'w': 'wchar_t',
      'a': 'signed char',
      'h': 'unsigned char',
      't': 'unsigned short',
      'j': 'unsigned int',
      'm': 'unsigned long',
      'x': 'long long',
      'y': 'unsigned long long',
      'z': '...'
    };
    function dump(x) {
      //return;
      if (x) Module.print(x);
      Module.print(func);
      var pre = '';
      for (var a = 0; a < i; a++) pre += ' ';
      Module.print (pre + '^');
    }
    var subs = [];
    function parseNested() {
      i++;
      if (func[i] === 'K') i++; // ignore const
      var parts = [];
      while (func[i] !== 'E') {
        if (func[i] === 'S') { // substitution
          i++;
          var next = func.indexOf('_', i);
          var num = func.substring(i, next) || 0;
          parts.push(subs[num] || '?');
          i = next+1;
          continue;
        }
        if (func[i] === 'C') { // constructor
          parts.push(parts[parts.length-1]);
          i += 2;
          continue;
        }
        var size = parseInt(func.substr(i));
        var pre = size.toString().length;
        if (!size || !pre) { i--; break; } // counter i++ below us
        var curr = func.substr(i + pre, size);
        parts.push(curr);
        subs.push(curr);
        i += pre + size;
      }
      i++; // skip E
      return parts;
    }
    var first = true;
    function parse(rawList, limit, allowVoid) { // main parser
      limit = limit || Infinity;
      var ret = '', list = [];
      function flushList() {
        return '(' + list.join(', ') + ')';
      }
      var name;
      if (func[i] === 'N') {
        // namespaced N-E
        name = parseNested().join('::');
        limit--;
        if (limit === 0) return rawList ? [name] : name;
      } else {
        // not namespaced
        if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
        var size = parseInt(func.substr(i));
        if (size) {
          var pre = size.toString().length;
          name = func.substr(i + pre, size);
          i += pre + size;
        }
      }
      first = false;
      if (func[i] === 'I') {
        i++;
        var iList = parse(true);
        var iRet = parse(true, 1, true);
        ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
      } else {
        ret = name;
      }
      paramLoop: while (i < func.length && limit-- > 0) {
        //dump('paramLoop');
        var c = func[i++];
        if (c in basicTypes) {
          list.push(basicTypes[c]);
        } else {
          switch (c) {
            case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
            case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
            case 'L': { // literal
              i++; // skip basic type
              var end = func.indexOf('E', i);
              var size = end - i;
              list.push(func.substr(i, size));
              i += size + 2; // size + 'EE'
              break;
            }
            case 'A': { // array
              var size = parseInt(func.substr(i));
              i += size.toString().length;
              if (func[i] !== '_') throw '?';
              i++; // skip _
              list.push(parse(true, 1, true)[0] + ' [' + size + ']');
              break;
            }
            case 'E': break paramLoop;
            default: ret += '?' + c; break paramLoop;
          }
        }
      }
      if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
      return rawList ? list : ret + flushList();
    }
    return parse();
  } catch(e) {
    return func;
  }
}
function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}
function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 67108864;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
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
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited
var runtimeInitialized = false;
function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
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
function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;
function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;
function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;
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
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i)
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;
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
if (!Math['imul']) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];
var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
var memoryInitializer = null;
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 7872;
/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });
var __ZTVN10__cxxabiv120__si_class_type_infoE;
__ZTVN10__cxxabiv120__si_class_type_infoE=allocate([0,0,0,0,32,24,0,0,76,0,0,0,82,0,0,0,78,0,0,0,22,0,0,0,2,0,0,0,4,0,0,0,4,0,0,0,14,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var __ZTVN10__cxxabiv117__class_type_infoE;
__ZTVN10__cxxabiv117__class_type_infoE=allocate([0,0,0,0,48,24,0,0,76,0,0,0,74,0,0,0,78,0,0,0,22,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_STATIC);
var __ZN12b2BroadPhaseC1Ev;
var __ZN12b2BroadPhaseD1Ev;
var __ZN13b2DynamicTreeC1Ev;
var __ZN13b2DynamicTreeD1Ev;
var __ZN16b2BlockAllocatorC1Ev;
var __ZN16b2BlockAllocatorD1Ev;
var __ZN16b2StackAllocatorC1Ev;
var __ZN16b2StackAllocatorD1Ev;
var __ZN7b2TimerC1Ev;
var __ZN6b2BodyC1EPK9b2BodyDefP7b2World;
var __ZN16b2ContactManagerC1Ev;
var __ZN9b2FixtureC1Ev;
var __ZN8b2IslandC1EiiiP16b2StackAllocatorP17b2ContactListener;
var __ZN8b2IslandD1Ev;
var __ZN7b2WorldC1ERK6b2Vec2;
var __ZN7b2WorldD1Ev;
var __ZN15b2ContactSolverC1EP18b2ContactSolverDef;
var __ZN15b2ContactSolverD1Ev;
/* memory initializer */ allocate([104,21,0,0,0,0,0,0,176,21,0,0,0,0,0,0,48,32,60,61,32,105,66,32,38,38,32,105,66,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,98,100,45,62,112,111,115,105,116,105,111,110,46,73,115,86,97,108,105,100,40,41,0,0,105,65,32,33,61,32,40,45,49,41,0,0,0,0,0,0,48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,99,104,97,105,110,45,62,109,95,99,111,117,110,116,0,0,0,0,109,95,119,111,114,108,100,45,62,73,115,76,111,99,107,101,100,40,41,32,61,61,32,102,97,108,115,101,0,0,0,0,109,95,105,110,100,101,120,32,61,61,32,48,0,0,0,0,97,108,112,104,97,48,32,60,32,49,46,48,102,0,0,0,99,104,105,108,100,50,32,33,61,32,40,45,49,41,0,0,98,50,73,115,86,97,108,105,100,40,98,100,45,62,108,105,110,101,97,114,68,97,109,112,105,110,103,41,32,38,38,32,98,100,45,62,108,105,110,101,97,114,68,97,109,112,105,110,103,32,62,61,32,48,46,48,102,0,0,0,0,0,0,0,106,32,60,32,98,50,95,98,108,111,99,107,83,105,122,101,115,0,0,0,0,0,0,0,116,121,112,101,65,32,61,61,32,98,50,95,100,121,110,97,109,105,99,66,111,100,121,32,124,124,32,116,121,112,101,66,32,61,61,32,98,50,95,100,121,110,97,109,105,99,66,111,100,121,0,0,0,0,0,0,99,104,105,108,100,49,32,33,61,32,40,45,49,41,0,0,98,50,73,115,86,97,108,105,100,40,98,100,45,62,97,110,103,117,108,97,114,68,97,109,112,105,110,103,41,32,38,38,32,98,100,45,62,97,110,103,117,108,97,114,68,97,109,112,105,110,103,32,62,61,32,48,46,48,102,0,0,0,0,0,112,32,61,61,32,101,110,116,114,121,45,62,100,97,116,97,0,0,0,0,0,0,0,0,97,114,101,97,32,62,32,49,46,49,57,50,48,57,50,57,48,101,45,48,55,70,0,0,48,32,60,32,99,111,117,110,116,32,38,38,32,99,111,117,110,116,32,60,32,51,0,0,112,99,45,62,112,111,105,110,116,67,111,117,110,116,32,62,32,48,0,0,0,0,0,0,109,95,110,111,100,101,115,91,112,114,111,120,121,73,100,93,46,73,115,76,101,97,102,40,41,0,0,0,0,0,0,0,115,116,97,99,107,67,111,117,110,116,32,60,32,115,116,97,99,107,83,105,122,101,0,0,99,97,99,104,101,45,62,99,111,117,110,116,32,60,61,32,51,0,0,0,0,0,0,0,98,50,73,115,86,97,108,105,100,40,98,100,45,62,97,110,103,117,108,97,114,86,101,108,111,99,105,116,121,41,0,0,109,95,101,110,116,114,121,67,111,117,110,116,32,62,32,48,0,0,0,0,0,0,0,0,98,108,111,99,107,67,111,117,110,116,32,42,32,98,108,111,99,107,83,105,122,101,32,60,61,32,98,50,95,99,104,117,110,107,83,105,122,101,0,0,109,95,118,101,114,116,101,120,67,111,117,110,116,32,62,61,32,51,0,0,0,0,0,0,48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,109,95,99,111,117,110,116,32,45,32,49,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,105,115,116,97,110,99,101,46,104,0,0,0,0,0,0,0,97,46,120,32,62,61,32,48,46,48,102,32,38,38,32,97,46,121,32,62,61,32,48,46,48,102,0,0,0,0,0,0,48,32,60,61,32,116,121,112,101,65,32,38,38,32,116,121,112,101,66,32,60,32,98,50,83,104,97,112,101,58,58,101,95,116,121,112,101,67,111,117,110,116,0,0,0,0,0,0,48,32,60,61,32,112,114,111,120,121,73,100,32,38,38,32,112,114,111,120,121,73,100,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,0,0,0,0,0,0,98,45,62,73,115,65,99,116,105,118,101,40,41,32,61,61,32,116,114,117,101,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,105,115,116,97,110,99,101,46,104,0,0,0,0,0,0,0,48,32,60,61,32,101,100,103,101,49,32,38,38,32,101,100,103,101,49,32,60,32,112,111,108,121,49,45,62,109,95,118,101,114,116,101,120,67,111,117,110,116,0,0,0,0,0,0,98,50,73,115,86,97,108,105,100,40,98,100,45,62,97,110,103,108,101,41,0,0,0,0,109,95,101,110,116,114,121,67,111,117,110,116,32,60,32,98,50,95,109,97,120,83,116,97,99,107,69,110,116,114,105,101,115,0,0,0,0,0,0,0,48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,98,50,95,98,108,111,99,107,83,105,122,101,115,0,0,0,0,0,116,97,114,103,101,116,32,62,32,116,111,108,101,114,97,110,99,101,0,0,0,0,0,0,48,46,48,102,32,60,61,32,108,111,119,101,114,32,38,38,32,108,111,119,101,114,32,60,61,32,105,110,112,117,116,46,109,97,120,70,114,97,99,116,105,111,110,0,0,0,0,0,48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,109,95,99,111,117,110,116,0,0,0,112,111,105,110,116,67,111,117,110,116,32,61,61,32,49,32,124,124,32,112,111,105,110,116,67,111,117,110,116,32,61,61,32,50,0,0,0,0,0,0,115,95,105,110,105,116,105,97,108,105,122,101,100,32,61,61,32,116,114,117,101,0,0,0,48,32,60,32,109,95,110,111,100,101,67,111,117,110,116,0,48,32,60,61,32,105,110,100,101,120,32,38,38,32,105,110,100,101,120,32,60,32,109,95,99,111,117,110,116,0,0,0,100,101,110,32,62,32,48,46,48,102,0,0,0,0,0,0,98,100,45,62,108,105,110,101,97,114,86,101,108,111,99,105,116,121,46,73,115,86,97,108,105,100,40,41,0,0,0,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,112,111,108,121,103,111,110,0,0,0,0,0,109,95,98,111,100,121,67,111,117,110,116,32,60,32,109,95,98,111,100,121,67,97,112,97,99,105,116,121,0,0,0,0,109,95,101,110,116,114,121,67,111,117,110,116,32,61,61,32,48,0,0,0,0,0,0,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,112,111,108,121,103,111,110,0,0,0,0,0,109,95,99,111,110,116,97,99,116,67,111,117,110,116,32,60,32,109,95,99,111,110,116,97,99,116,67,97,112,97,99,105,116,121,0,0,0,0,0,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,101,100,103,101,0,0,0,0,0,0,0,0,48,32,60,32,115,105,122,101,0,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,73,115,108,97,110,100,46,104,0,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,101,100,103,101,0,0,0,0,0,0,0,0,109,95,106,111,105,110,116,67,111,117,110,116,32,60,32,109,95,106,111,105,110,116,67,97,112,97,99,105,116,121,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,109,109,111,110,47,98,50,77,97,116,104,46,104,0,0,0,0,0,0,112,111,105,110,116,67,111,117,110,116,32,62,32,48,0,0,102,97,108,115,101,0,0,0,109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,112,111,108,121,103,111,110,0,0,0,0,0,109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,105,114,99,108,101,0,0,0,0,0,0,109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,112,111,108,121,103,111,110,0,0,0,0,0,109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,105,114,99,108,101,0,0,0,0,0,0,48,32,60,61,32,116,121,112,101,49,32,38,38,32,116,121,112,101,49,32,60,32,98,50,83,104,97,112,101,58,58,101,95,116,121,112,101,67,111,117,110,116,0,0,0,0,0,0,109,97,110,105,102,111,108,100,45,62,112,111,105,110,116,67,111,117,110,116,32,62,32,48,0,0,0,0,0,0,0,0,48,32,60,61,32,116,121,112,101,50,32,38,38,32,116,121,112,101,50,32,60,32,98,50,83,104,97,112,101,58,58,101,95,116,121,112,101,67,111,117,110,116,0,0,0,0,0,0,109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,105,114,99,108,101,0,0,0,0,0,0,109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,112,111,108,121,103,111,110,0,0,0,0,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,105,114,99,108,101,0,0,0,0,0,0,109,95,102,105,120,116,117,114,101,66,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,105,114,99,108,101,0,0,0,0,0,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,104,97,105,110,0,0,0,0,0,0,0,48,32,60,61,32,110,111,100,101,73,100,32,38,38,32,110,111,100,101,73,100,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,116,111,105,73,110,100,101,120,66,32,60,32,109,95,98,111,100,121,67,111,117,110,116,0,109,95,102,105,120,116,117,114,101,65,45,62,71,101,116,84,121,112,101,40,41,32,61,61,32,98,50,83,104,97,112,101,58,58,101,95,99,104,97,105,110,0,0,0,0,0,0,0,102,97,108,115,101,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,121,110,97,109,105,99,84,114,101,101,46,104,0,0,0,0,102,97,108,115,101,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,105,115,116,97,110,99,101,46,99,112,112,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,66,111,100,121,46,99,112,112,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,109,109,111,110,47,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,46,99,112,112,0,0,73,115,76,111,99,107,101,100,40,41,32,61,61,32,102,97,108,115,101,0,0,0,0,0,116,111,105,73,110,100,101,120,65,32,60,32,109,95,98,111,100,121,67,111,117,110,116,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,109,109,111,110,47,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,46,99,112,112,0,0,109,95,110,111,100,101,115,91,66,45,62,112,97,114,101,110,116,93,46,99,104,105,108,100,50,32,61,61,32,105,65,0,109,95,110,111,100,101,67,111,117,110,116,32,61,61,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,83,104,97,112,101,115,47,98,50,80,111,108,121,103,111,110,83,104,97,112,101,46,99,112,112,0,0,48,32,60,61,32,105,69,32,38,38,32,105,69,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,67,111,108,108,105,100,101,80,111,108,121,103,111,110,46,99,112,112,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,83,104,97,112,101,115,47,98,50,67,104,97,105,110,83,104,97,112,101,46,99,112,112,0,0,0,0,48,32,60,61,32,105,68,32,38,38,32,105,68,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,84,105,109,101,79,102,73,109,112,97,99,116,46,99,112,112,0,109,95,110,111,100,101,115,91,67,45,62,112,97,114,101,110,116,93,46,99,104,105,108,100,50,32,61,61,32,105,65,0,109,95,73,32,62,32,48,46,48,102,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,46,99,112,112,0,0,0,0,0,0,0,0,109,95,112,114,111,120,121,67,111,117,110,116,32,61,61,32,48,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,67,111,110,116,97,99,116,115,47,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,46,99,112,112,0,0,0,0,0,0,0,0,48,32,60,61,32,105,71,32,38,38,32,105,71,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,109,95,116,121,112,101,32,61,61,32,98,50,95,100,121,110,97,109,105,99,66,111,100,121,0,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,87,111,114,108,100,46,99,112,112,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,73,115,108,97,110,100,46,99,112,112,0,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,68,121,110,97,109,105,99,84,114,101,101,46,99,112,112,0,0,48,32,60,61,32,112,114,111,120,121,73,100,32,38,38,32,112,114,111,120,121,73,100,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,0,0,0,0,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,68,121,110,97,109,105,99,115,47,98,50,70,105,120,116,117,114,101,46,99,112,112,0,0,0,0,0,0,0,48,32,60,61,32,105,70,32,38,38,32,105,70,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,48,32,60,61,32,105,67,32,38,38,32,105,67,32,60,32,109,95,110,111,100,101,67,97,112,97,99,105,116,121,0,0,66,111,120,50,68,95,118,50,46,50,46,49,47,66,111,120,50,68,47,67,111,108,108,105,115,105,111,110,47,98,50,67,111,108,108,105,100,101,69,100,103,101,46,99,112,112,0,0,66,101,110,99,104,109,97,114,107,32,99,111,109,112,108,101,116,101,46,10,32,32,109,115,47,102,114,97,109,101,58,32,37,102,32,53,116,104,32,37,37,105,108,101,58,32,37,102,32,57,53,116,104,32,37,37,105,108,101,58,32,37,102,10,0,0,0,0,0,0,0,0,71,101,116,77,101,116,114,105,99,0,0,0,0,0,0,0,71,101,116,87,105,116,110,101,115,115,80,111,105,110,116,115,0,0,0,0,0,0,0,0,71,101,116,67,108,111,115,101,115,116,80,111,105,110,116,0,69,118,97,108,117,97,116,101,0,0,0,0,0,0,0,0,70,105,110,100,77,105,110,83,101,112,97,114,97,116,105,111,110,0,0,0,0,0,0,0,71,101,116,86,101,114,116,101,120,0,0,0,0,0,0,0,71,101,116,86,101,114,116,101,120,0,0,0,0,0,0,0,82,97,121,67,97,115,116,0,67,111,109,112,117,116,101,77,97,115,115,0,0,0,0,0,71,101,116,85,115,101,114,68,97,116,97,0,0,0,0,0,71,101,116,70,97,116,65,65,66,66,0,0,0,0,0,0,71,101,116,67,104,105,108,100,69,100,103,101,0,0,0,0,82,101,97,100,67,97,99,104,101,0,0,0,0,0,0,0,68,101,115,116,114,111,121,0,67,114,101,97,116,101,80,114,111,120,105,101,115,0,0,0,68,101,115,116,114,111,121,0,67,114,101,97,116,101,0,0,83,111,108,118,101,84,79,73,0,0,0,0,0,0,0,0,65,100,100,0,0,0,0,0,83,111,108,118,101,84,79,73,0,0,0,0,0,0,0,0,83,111,108,118,101,0,0,0,67,114,101,97,116,101,66,111,100,121,0,0,0,0,0,0,65,100,118,97,110,99,101,0,98,50,66,111,100,121,0,0,82,101,115,101,116,77,97,115,115,68,97,116,97,0,0,0,67,114,101,97,116,101,70,105,120,116,117,114,101,0,0,0,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,0,0,0,73,110,105,116,105,97,108,105,122,101,0,0,0,0,0,0,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,0,0,0,0,0,0,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,73,110,105,116,105,97,108,105,122,101,0,0,0,0,0,0,126,98,50,83,116,97,99,107,65,108,108,111,99,97,116,111,114,0,0,0,0,0,0,0,65,108,108,111,99,97,116,101,0,0,0,0,0,0,0,0,70,114,101,101,0,0,0,0,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,0,0,0,0,0,0,98,50,66,108,111,99,107,65,108,108,111,99,97,116,111,114,0,0,0,0,0,0,0,0,65,108,108,111,99,97,116,101,0,0,0,0,0,0,0,0,70,114,101,101,0,0,0,0,83,101,116,0,0,0,0,0,98,50,67,111,110,116,97,99,116,83,111,108,118,101,114,0,73,110,105,116,105,97,108,105,122,101,86,101,108,111,99,105,116,121,67,111,110,115,116,114,97,105,110,116,115,0,0,0,83,111,108,118,101,86,101,108,111,99,105,116,121,67,111,110,115,116,114,97,105,110,116,115,0,0,0,0,0,0,0,0,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,0,77,111,118,101,80,114,111,120,121,0,0,0,0,0,0,0,70,114,101,101,78,111,100,101,0,0,0,0,0,0,0,0,66,97,108,97,110,99,101,0,65,108,108,111,99,97,116,101,78,111,100,101,0,0,0,0,73,110,115,101,114,116,76,101,97,102,0,0,0,0,0,0,98,50,70,105,110,100,73,110,99,105,100,101,110,116,69,100,103,101,0,0,0,0,0,0,98,50,69,100,103,101,83,101,112,97,114,97,116,105,111,110,0,0,0,0,0,0,0,0,98,50,67,111,108,108,105,100,101,69,100,103,101,65,110,100,67,105,114,99,108,101,0,0,98,50,84,105,109,101,79,102,73,109,112,97,99,116,0,0,98,50,68,105,115,116,97,110,99,101,0,0,0,0,0,0,0,0,0,0,80,24,0,0,2,0,0,0,16,0,0,0,42,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,24,0,0,12,0,0,0,40,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,24,0,0,4,0,0,0,54,0,0,0,80,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,24,0,0,18,0,0,0,46,0,0,0,26,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,24,0,0,20,0,0,0,34,0,0,0,60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,24,0,0,22,0,0,0,28,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,176,24,0,0,38,0,0,0,8,0,0,0,6,0,0,0,12,0,0,0,6,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,184,24,0,0,10,0,0,0,10,0,0,0,58,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,24,0,0,72,0,0,0,52,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,208,24,0,0,6,0,0,0,62,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,24,0,0,36,0,0,0,64,0,0,0,2,0,0,0,2,0,0,0,8,0,0,0,4,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,24,0,0,30,0,0,0,12,0,0,0,6,0,0,0,4,0,0,0,4,0,0,0,14,0,0,0,16,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,57,98,50,67,111,110,116,97,99,116,0,0,0,0,0,0,55,98,50,83,104,97,112,101,0,0,0,0,0,0,0,0,50,53,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,0,50,52,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,0,0,0,0,50,51,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,0,0,0,0,0,50,51,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,0,0,0,50,50,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,0,0,0,0,49,55,98,50,67,111,110,116,97,99,116,76,105,115,116,101,110,101,114,0,0,0,0,0,49,54,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,0,0,0,0,49,53,98,50,67,111,110,116,97,99,116,70,105,108,116,101,114,0,0,0,0,0,0,0,49,53,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,0,0,0,49,52,98,50,80,111,108,121,103,111,110,83,104,97,112,101,0,0,0,0,0,0,0,0,49,49,98,50,69,100,103,101,83,104,97,112,101,0,0,0,0,0,0,0,72,22,0,0,0,0,0,0,88,22,0,0,48,24,0,0,0,0,0,0,0,0,0,0,128,22,0,0,64,24,0,0,0,0,0,0,0,0,0,0,168,22,0,0,24,24,0,0,0,0,0,0,0,0,0,0,208,22,0,0,0,0,0,0,224,22,0,0,0,0,0,0,240,22,0,0,80,24,0,0,0,0,0,0,0,0,0,0,16,23,0,0,80,24,0,0,0,0,0,0,0,0,0,0,48,23,0,0,80,24,0,0,0,0,0,0,0,0,0,0,80,23,0,0,80,24,0,0,0,0,0,0,0,0,0,0,112,23,0,0,80,24,0,0,0,0,0,0,0,0,0,0,144,23,0,0,0,0,0,0,168,23,0,0,80,24,0,0,0,0,0,0,0,0,0,0,192,23,0,0,0,0,0,0,216,23,0,0,80,24,0,0,0,0,0,0,0,0,0,0,240,23,0,0,88,24,0,0,0,0,0,0,0,0,0,0,8,24,0,0,88,24,0,0,0,0,0,0,16,0,0,0,32,0,0,0,64,0,0,0,96,0,0,0,128,0,0,0,160,0,0,0,192,0,0,0,224,0,0,0,0,1,0,0,64,1,0,0,128,1,0,0,192,1,0,0,0,2,0,0,128,2,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
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
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value
      return value;
    }
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 0777, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 0777 | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },reconcile:function (src, dst, callback) {
        var total = 0;
        var create = {};
        for (var key in src.files) {
          if (!src.files.hasOwnProperty(key)) continue;
          var e = src.files[key];
          var e2 = dst.files[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create[key] = e;
            total++;
          }
        }
        var remove = {};
        for (var key in dst.files) {
          if (!dst.files.hasOwnProperty(key)) continue;
          var e = dst.files[key];
          var e2 = src.files[key];
          if (!e2) {
            remove[key] = e;
            total++;
          }
        }
        if (!total) {
          // early out
          return callback(null);
        }
        var completed = 0;
        function done(err) {
          if (err) return callback(err);
          if (++completed >= total) {
            return callback(null);
          }
        };
        // create a single transaction to handle and IDB reads / writes we'll need to do
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        transaction.onerror = function transaction_onerror() { callback(this.error); };
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        for (var path in create) {
          if (!create.hasOwnProperty(path)) continue;
          var entry = create[path];
          if (dst.type === 'local') {
            // save file to local
            try {
              if (FS.isDir(entry.mode)) {
                FS.mkdir(path, entry.mode);
              } else if (FS.isFile(entry.mode)) {
                var stream = FS.open(path, 'w+', 0666);
                FS.write(stream, entry.contents, 0, entry.contents.length, 0, true /* canOwn */);
                FS.close(stream);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // save file to IDB
            var req = store.put(entry, path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
        for (var path in remove) {
          if (!remove.hasOwnProperty(path)) continue;
          var entry = remove[path];
          if (dst.type === 'local') {
            // delete file from local
            try {
              if (FS.isDir(entry.mode)) {
                // TODO recursive delete?
                FS.rmdir(path);
              } else if (FS.isFile(entry.mode)) {
                FS.unlink(path);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // delete file from IDB
            var req = store.delete(path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
      },getLocalSet:function (mount, callback) {
        var files = {};
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
        var check = FS.readdir(mount.mountpoint)
          .filter(isRealDir)
          .map(toAbsolute(mount.mountpoint));
        while (check.length) {
          var path = check.pop();
          var stat, node;
          try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path)
              .filter(isRealDir)
              .map(toAbsolute(path)));
            files[path] = { mode: stat.mode, timestamp: stat.mtime };
          } else if (FS.isFile(stat.mode)) {
            files[path] = { contents: node.contents, mode: stat.mode, timestamp: stat.mtime };
          } else {
            return callback(new Error('node type not supported'));
          }
        }
        return callback(null, { type: 'local', files: files });
      },getDB:function (name, callback) {
        // look it up in the cache
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        req.onupgradeneeded = function req_onupgradeneeded() {
          db = req.result;
          db.createObjectStore(IDBFS.DB_STORE_NAME);
        };
        req.onsuccess = function req_onsuccess() {
          db = req.result;
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function req_onerror() {
          callback(this.error);
        };
      },getRemoteSet:function (mount, callback) {
        var files = {};
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function transaction_onerror() { callback(this.error); };
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          store.openCursor().onsuccess = function store_openCursor_onsuccess(event) {
            var cursor = event.target.result;
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, files: files });
            }
            files[cursor.key] = cursor.value;
            cursor.continue();
          };
        });
      }};
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.position = position;
          return position;
        }}};
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[null],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || { recurse_count: 0 };
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
        // start at the root
        var current = FS.root;
        var current_path = '/';
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            current = current.mount.root;
          }
          // follow symlinks
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
            this.parent = null;
            this.mount = null;
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            FS.hashAddNode(this);
          };
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
          FS.FSNode.prototype = {};
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
        return new FS.FSNode(parent, name, mode, rdev);
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 1;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
        var completed = 0;
        var total = FS.mounts.length;
        function done(err) {
          if (err) {
            return callback(err);
          }
          if (++completed >= total) {
            callback(null);
          }
        };
        // sync all mounts
        for (var i = 0; i < FS.mounts.length; i++) {
          var mount = FS.mounts[i];
          if (!mount.type.syncfs) {
            done(null);
            continue;
          }
          mount.type.syncfs(mount, populate, done);
        }
      },mount:function (type, opts, mountpoint) {
        var lookup;
        if (mountpoint) {
          lookup = FS.lookupPath(mountpoint, { follow: false });
          mountpoint = lookup.path;  // use the absolute path
        }
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          root: null
        };
        // create a root node for the fs
        var root = type.mount(mount);
        root.mount = mount;
        mount.root = root;
        // assign the mount info to the mountpoint's node
        if (lookup) {
          lookup.node.mount = mount;
          lookup.node.mounted = true;
          // compatibility update FS.root if we mount to /
          if (mountpoint === '/') {
            FS.root = mount.root;
          }
        }
        // add to our cached list of mounts
        FS.mounts.push(mount);
        return root;
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 0666;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 0777;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 0666;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path, { follow: false });
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.errnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0);
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=stdin.fd;
        assert(stdin.fd === 1, 'invalid handle for stdin (' + stdin.fd + ')');
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=stdout.fd;
        assert(stdout.fd === 2, 'invalid handle for stdout (' + stdout.fd + ')');
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=stderr.fd;
        assert(stderr.fd === 3, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
          this.stack = stackTrace();
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.root = FS.createNode(null, '/', 16384 | 0777, 0);
        FS.mount(MEMFS, {}, '/');
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        FS.ensureErrnoError();
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
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
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
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
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
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
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 0777, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var bytesWritten = _write(stream, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
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
          ret = HEAPF64[(((varargs)+(argIndex))>>3)];
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+8))>>2)]];
          argIndex += 8; // each 32-bit chunk is in a 64-bit block
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Math.max(Runtime.getNativeFieldSize(type), Runtime.getAlignSize(type, null, true));
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
          var flagPadSign = false;
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
              case 32:
                flagPadSign = true;
                break;
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
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
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
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
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
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
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
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
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
      var keys = [];
      for (var i = 0; i < num; i++) keys.push(i);
      keys.sort(function(a, b) {
        return Module['dynCall_iii'](cmp, base+a*size, base+b*size);
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
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }function __ZSt9terminatev() {
      _exit(-1234);
    }
  function _clock() {
      if (_clock.start === undefined) _clock.start = Date.now();
      return Math.floor((Date.now() - _clock.start) * (1000000/1000));
    }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i64=_memset;
  var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  var _sqrtf=Math_sqrt;
  function ___assert_fail(condition, filename, line, func) {
      ABORT = true;
      throw 'Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + stackTrace();
    }
  var _llvm_memset_p0i8_i32=_memset;
  var _sinf=Math_sin;
  var _cosf=Math_cos;
  var _floorf=Math_floor;
  function ___cxa_pure_virtual() {
      ABORT = true;
      throw 'Pure virtual function called!';
    }
  function _llvm_lifetime_start() {}
  function _llvm_lifetime_end() {}
  function _abort() {
      Module['abort']();
    }
  function ___errno_location() {
      return ___errno_state;
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
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
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
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
          img.onload = function img_onload() {
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
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
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
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
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
            Browser.safeSetTimeout(function() {
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
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
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
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
            ['experimental-webgl', 'webgl'].some(function(webglId) {
              return ctx = canvas.getContext(webglId, contextAttributes);
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
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
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
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
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
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (window.scrollX + rect.left);
              y = t.pageY - (window.scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (window.scrollX + rect.left);
            y = event.pageY - (window.scrollY + rect.top);
          }
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
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
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
var Math_min = Math.min;
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viif(index,a1,a2,a3) {
  try {
    Module["dynCall_viif"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.__ZTVN10__cxxabiv117__class_type_infoE|0;var n=env.__ZTVN10__cxxabiv120__si_class_type_infoE|0;var o=+env.NaN;var p=+env.Infinity;var q=0;var r=0;var s=0;var t=0;var u=0,v=0,w=0,x=0,y=0.0,z=0,A=0,B=0,C=0.0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=global.Math.floor;var O=global.Math.abs;var P=global.Math.sqrt;var Q=global.Math.pow;var R=global.Math.cos;var S=global.Math.sin;var T=global.Math.tan;var U=global.Math.acos;var V=global.Math.asin;var W=global.Math.atan;var X=global.Math.atan2;var Y=global.Math.exp;var Z=global.Math.log;var _=global.Math.ceil;var $=global.Math.imul;var aa=env.abort;var ab=env.assert;var ac=env.asmPrintInt;var ad=env.asmPrintFloat;var ae=env.min;var af=env.invoke_ii;var ag=env.invoke_viiiii;var ah=env.invoke_vi;var ai=env.invoke_vii;var aj=env.invoke_iiii;var ak=env.invoke_viii;var al=env.invoke_v;var am=env.invoke_viif;var an=env.invoke_viiiiii;var ao=env.invoke_iii;var ap=env.invoke_iiiiii;var aq=env.invoke_viiii;var ar=env._llvm_lifetime_end;var as=env._cosf;var at=env.___assert_fail;var au=env._abort;var av=env._fprintf;var aw=env._printf;var ax=env._fflush;var ay=env.__reallyNegative;var az=env._sqrtf;var aA=env._floorf;var aB=env._clock;var aC=env.___setErrNo;var aD=env._fwrite;var aE=env._qsort;var aF=env._send;var aG=env._write;var aH=env._exit;var aI=env._sysconf;var aJ=env.___cxa_pure_virtual;var aK=env.__formatString;var aL=env.__ZSt9terminatev;var aM=env._sinf;var aN=env._pwrite;var aO=env._sbrk;var aP=env.___errno_location;var aQ=env.___gxx_personality_v0;var aR=env._llvm_lifetime_start;var aS=env._time;var aT=env.__exit;var aU=0.0;
// EMSCRIPTEN_START_FUNCS
function a5(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7&-8;return b|0}function a6(){return i|0}function a7(a){a=a|0;i=a}function a8(a,b){a=a|0;b=b|0;if((q|0)==0){q=a;r=b}}function a9(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function ba(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function bb(a){a=a|0;D=a}function bc(a){a=a|0;E=a}function bd(a){a=a|0;F=a}function be(a){a=a|0;G=a}function bf(a){a=a|0;H=a}function bg(a){a=a|0;I=a}function bh(a){a=a|0;J=a}function bi(a){a=a|0;K=a}function bj(a){a=a|0;L=a}function bk(a){a=a|0;M=a}function bl(){c[1542]=m+8;c[1544]=n+8;c[1548]=n+8;c[1552]=n+8;c[1556]=m+8;c[1558]=m+8;c[1560]=n+8;c[1564]=n+8;c[1568]=n+8;c[1572]=n+8;c[1576]=n+8;c[1580]=m+8;c[1582]=n+8;c[1586]=m+8;c[1588]=n+8;c[1592]=n+8;c[1596]=n+8}function bm(a,b){a=a|0;b=b|0;var c=0.0,d=0.0,e=0;b=i;i=i+16|0;a=b|0;bo(a);c=+g[a+4>>2];d=+g[a+8>>2];aw(4272,(e=i,i=i+24|0,h[e>>3]=+g[a>>2],h[e+8>>3]=c,h[e+16>>3]=d,e)|0)|0;i=e;i=b;return 0}function bn(a,b){a=a|0;b=b|0;return(c[a>>2]|0)-(c[b>>2]|0)|0}function bo(b){b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0.0,w=0.0,x=0.0,y=0.0,z=0,A=0.0,B=0,C=0,D=0,E=0.0,F=0;d=i;i=i+104392|0;e=d|0;f=d+8|0;h=d+103040|0;j=d+103096|0;k=d+103144|0;l=d+103152|0;m=d+103160|0;n=d+103312|0;o=d+103368|0;g[e>>2]=0.0;g[e+4>>2]=-10.0;cX(f,e);c_(f,0);c[h+44>>2]=0;eb(h+4|0,0,32);a[h+36|0]=1;a[h+37|0]=1;a[h+38|0]=0;a[h+39|0]=0;c[h>>2]=0;a[h+40|0]=1;g[h+48>>2]=1.0;e=cZ(f,h)|0;c[j>>2]=5664;c[j+4>>2]=1;g[j+8>>2]=.009999999776482582;eb(j+28|0,0,18);g[k>>2]=-40.0;g[k+4>>2]=0.0;g[l>>2]=40.0;g[l+4>>2]=0.0;bY(j,k,l);cv(e,j|0,0.0)|0;c[m>>2]=5616;c[m+4>>2]=2;g[m+8>>2]=.009999999776482582;c[m+148>>2]=0;g[m+12>>2]=0.0;g[m+16>>2]=0.0;b6(m,.5,.5);j=n+44|0;e=n+36|0;l=n+4|0;k=n+37|0;h=n+38|0;p=n+39|0;q=n|0;r=n+40|0;s=n+48|0;t=n+4|0;u=m|0;v=.75;w=-7.0;m=0;while(1){x=v;y=w;z=m;while(1){c[j>>2]=0;eb(l|0,0,32);a[e]=1;a[k]=1;a[h]=0;a[p]=0;a[r]=1;g[s>>2]=1.0;c[q>>2]=2;A=+x;g[t>>2]=y;g[t+4>>2]=A;cv(cZ(f,n)|0,u,5.0)|0;B=z+1|0;if((B|0)<40){x=x+0.0;y=y+1.125;z=B}else{break}}z=m+1|0;if((z|0)<40){v=v+1.0;w=w+.5625;m=z}else{C=0;break}}while(1){c1(f,.01666666753590107,3,3);m=C+1|0;if((m|0)<64){C=m}else{D=0;break}}while(1){C=aB()|0;c1(f,.01666666753590107,3,3);c[o+(D<<2)>>2]=(aB()|0)-C;C=D+1|0;if((C|0)<256){D=C}else{E=0.0;F=0;break}}do{E=E+ +(c[o+(F<<2)>>2]|0)/1.0e6*1.0e3;F=F+1|0;}while((F|0)<256);g[b>>2]=E*.00390625;aE(o|0,256,4,8);g[b+4>>2]=+(c[o+48>>2]|0)/1.0e6*1.0e3;g[b+8>>2]=+(c[o+972>>2]|0)/1.0e6*1.0e3;cY(f);i=d;return}function bp(a){a=a|0;bL(a|0);c[a+28>>2]=0;c[a+48>>2]=16;c[a+52>>2]=0;c[a+44>>2]=ci(192)|0;c[a+36>>2]=16;c[a+40>>2]=0;c[a+32>>2]=ci(64)|0;return}function bq(a){a=a|0;cj(c[a+32>>2]|0);cj(c[a+44>>2]|0);bM(a|0);return}function br(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=bO(a|0,b,d)|0;d=a+28|0;c[d>>2]=(c[d>>2]|0)+1;d=a+40|0;b=c[d>>2]|0;f=a+36|0;g=a+32|0;if((b|0)==(c[f>>2]|0)){a=c[g>>2]|0;c[f>>2]=b<<1;f=ci(b<<3)|0;c[g>>2]=f;h=a;a=c[d>>2]<<2;ea(f|0,h|0,a)|0;cj(h);i=c[d>>2]|0}else{i=b}c[(c[g>>2]|0)+(i<<2)>>2]=e;c[d>>2]=(c[d>>2]|0)+1;return e|0}function bs(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;if(!(bR(a|0,b,d,e)|0)){return}e=a+40|0;d=c[e>>2]|0;f=a+36|0;g=a+32|0;if((d|0)==(c[f>>2]|0)){a=c[g>>2]|0;c[f>>2]=d<<1;f=ci(d<<3)|0;c[g>>2]=f;h=a;a=c[e>>2]<<2;ea(f|0,h|0,a)|0;cj(h);i=c[e>>2]|0}else{i=d}c[(c[g>>2]|0)+(i<<2)>>2]=b;c[e>>2]=(c[e>>2]|0)+1;return}function bt(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;d=a+56|0;e=c[d>>2]|0;if((e|0)==(b|0)){return 1}f=a+52|0;g=c[f>>2]|0;h=a+48|0;i=a+44|0;if((g|0)==(c[h>>2]|0)){a=c[i>>2]|0;c[h>>2]=g<<1;h=ci(g*24|0)|0;c[i>>2]=h;j=a;a=(c[f>>2]|0)*12|0;ea(h|0,j|0,a)|0;cj(j);k=c[d>>2]|0;l=c[f>>2]|0}else{k=e;l=g}c[(c[i>>2]|0)+(l*12|0)>>2]=(k|0)>(b|0)?b:k;k=c[d>>2]|0;c[(c[i>>2]|0)+((c[f>>2]|0)*12|0)+4>>2]=(k|0)<(b|0)?b:k;c[f>>2]=(c[f>>2]|0)+1;return 1}function bu(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,k=0.0,l=0.0,m=0.0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0;h=a+60|0;c[h>>2]=0;i=b+12|0;j=+g[d+12>>2];k=+g[i>>2];l=+g[d+8>>2];m=+g[b+16>>2];n=e+12|0;o=+g[f+12>>2];p=+g[n>>2];q=+g[f+8>>2];r=+g[e+16>>2];s=+g[f>>2]+(o*p-q*r)-(+g[d>>2]+(j*k-l*m));t=p*q+o*r+ +g[f+4>>2]-(k*l+j*m+ +g[d+4>>2]);m=+g[b+8>>2]+ +g[e+8>>2];if(s*s+t*t>m*m){return}c[a+56>>2]=0;e=i;i=a+48|0;b=c[e+4>>2]|0;c[i>>2]=c[e>>2];c[i+4>>2]=b;g[a+40>>2]=0.0;g[a+44>>2]=0.0;c[h>>2]=1;h=n;n=a;b=c[h+4>>2]|0;c[n>>2]=c[h>>2];c[n+4>>2]=b;c[a+16>>2]=0;return}function bv(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0,j=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0,r=0,s=0.0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0;h=a+60|0;c[h>>2]=0;i=e+12|0;j=+g[f+12>>2];l=+g[i>>2];m=+g[f+8>>2];n=+g[e+16>>2];o=+g[f>>2]+(j*l-m*n)- +g[d>>2];p=l*m+j*n+ +g[f+4>>2]- +g[d+4>>2];n=+g[d+12>>2];j=+g[d+8>>2];m=o*n+p*j;l=n*p+o*(-0.0-j);j=+g[b+8>>2]+ +g[e+8>>2];e=c[b+148>>2]|0;do{if((e|0)>0){d=0;o=-3.4028234663852886e+38;f=0;while(1){p=(m- +g[b+20+(d<<3)>>2])*+g[b+84+(d<<3)>>2]+(l- +g[b+20+(d<<3)+4>>2])*+g[b+84+(d<<3)+4>>2];if(p>j){q=92;break}r=p>o;s=r?p:o;t=r?d:f;r=d+1|0;if((r|0)<(e|0)){d=r;o=s;f=t}else{q=71;break}}if((q|0)==71){u=s<1.1920928955078125e-7;v=t;break}else if((q|0)==92){return}}else{u=1;v=0}}while(0);q=v+1|0;t=b+20+(v<<3)|0;f=c[t>>2]|0;d=c[t+4>>2]|0;s=(c[k>>2]=f,+g[k>>2]);t=d;o=(c[k>>2]=t,+g[k>>2]);r=b+20+(((q|0)<(e|0)?q:0)<<3)|0;q=c[r>>2]|0;e=c[r+4>>2]|0;p=(c[k>>2]=q,+g[k>>2]);r=e;n=(c[k>>2]=r,+g[k>>2]);if(u){c[h>>2]=1;c[a+56>>2]=1;u=b+84+(v<<3)|0;w=a+40|0;x=c[u+4>>2]|0;c[w>>2]=c[u>>2];c[w+4>>2]=x;x=a+48|0;y=+((o+n)*.5);g[x>>2]=(s+p)*.5;g[x+4>>2]=y;x=i;w=a;u=c[x+4>>2]|0;c[w>>2]=c[x>>2];c[w+4>>2]=u;c[a+16>>2]=0;return}y=m-s;z=l-o;A=m-p;B=l-n;if(y*(p-s)+z*(n-o)<=0.0){if(y*y+z*z>j*j){return}c[h>>2]=1;c[a+56>>2]=1;u=a+40|0;w=u;C=+z;g[w>>2]=y;g[w+4>>2]=C;C=+P(y*y+z*z);if(C>=1.1920928955078125e-7){D=1.0/C;g[u>>2]=y*D;g[a+44>>2]=z*D}u=a+48|0;c[u>>2]=f|0;c[u+4>>2]=t|d&0;d=i;t=a;u=c[d+4>>2]|0;c[t>>2]=c[d>>2];c[t+4>>2]=u;c[a+16>>2]=0;return}if(A*(s-p)+B*(o-n)>0.0){D=(s+p)*.5;p=(o+n)*.5;u=b+84+(v<<3)|0;if((m-D)*+g[u>>2]+(l-p)*+g[b+84+(v<<3)+4>>2]>j){return}c[h>>2]=1;c[a+56>>2]=1;v=u;u=a+40|0;b=c[v+4>>2]|0;c[u>>2]=c[v>>2];c[u+4>>2]=b;b=a+48|0;l=+p;g[b>>2]=D;g[b+4>>2]=l;b=i;u=a;v=c[b+4>>2]|0;c[u>>2]=c[b>>2];c[u+4>>2]=v;c[a+16>>2]=0;return}if(A*A+B*B>j*j){return}c[h>>2]=1;c[a+56>>2]=1;h=a+40|0;v=h;j=+B;g[v>>2]=A;g[v+4>>2]=j;j=+P(A*A+B*B);if(j>=1.1920928955078125e-7){l=1.0/j;g[h>>2]=A*l;g[a+44>>2]=B*l}h=a+48|0;c[h>>2]=q|0;c[h+4>>2]=r|e&0;e=i;i=a;r=c[e+4>>2]|0;c[i>>2]=c[e>>2];c[i+4>>2]=r;c[a+16>>2]=0;return}function bw(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var i=0,j=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0;i=b+60|0;c[i>>2]=0;j=f+12|0;l=+g[h+12>>2];m=+g[j>>2];n=+g[h+8>>2];o=+g[f+16>>2];p=+g[h>>2]+(l*m-n*o)- +g[e>>2];q=m*n+l*o+ +g[h+4>>2]- +g[e+4>>2];o=+g[e+12>>2];l=+g[e+8>>2];n=p*o+q*l;m=o*q+p*(-0.0-l);e=d+12|0;h=c[e>>2]|0;r=c[e+4>>2]|0;l=(c[k>>2]=h,+g[k>>2]);e=r;p=(c[k>>2]=e,+g[k>>2]);s=d+20|0;t=c[s>>2]|0;u=c[s+4>>2]|0;q=(c[k>>2]=t,+g[k>>2]);s=u;o=(c[k>>2]=s,+g[k>>2]);v=q-l;w=o-p;x=v*(q-n)+w*(o-m);y=n-l;z=m-p;A=y*v+z*w;B=+g[d+8>>2]+ +g[f+8>>2];if(A<=0.0){if(y*y+z*z>B*B){return}do{if((a[d+44|0]&1)!=0){f=d+28|0;if((l-n)*(l- +g[f>>2])+(p-m)*(p- +g[f+4>>2])<=0.0){break}return}}while(0);c[i>>2]=1;c[b+56>>2]=0;g[b+40>>2]=0.0;g[b+44>>2]=0.0;f=b+48|0;c[f>>2]=h|0;c[f+4>>2]=e|r&0;f=b+16|0;c[f>>2]=0;C=f;a[f]=0;a[C+1|0]=0;a[C+2|0]=0;a[C+3|0]=0;C=j;f=b;D=c[C+4>>2]|0;c[f>>2]=c[C>>2];c[f+4>>2]=D;return}if(x<=0.0){E=n-q;F=m-o;if(E*E+F*F>B*B){return}do{if((a[d+45|0]&1)!=0){D=d+36|0;if(E*(+g[D>>2]-q)+F*(+g[D+4>>2]-o)<=0.0){break}return}}while(0);c[i>>2]=1;c[b+56>>2]=0;g[b+40>>2]=0.0;g[b+44>>2]=0.0;d=b+48|0;c[d>>2]=t|0;c[d+4>>2]=s|u&0;u=b+16|0;c[u>>2]=0;s=u;a[u]=1;a[s+1|0]=0;a[s+2|0]=0;a[s+3|0]=0;s=j;u=b;d=c[s+4>>2]|0;c[u>>2]=c[s>>2];c[u+4>>2]=d;return}F=v*v+w*w;if(F<=0.0){at(1392,4224,127,5224)}E=1.0/F;F=n-(l*x+q*A)*E;q=m-(p*x+o*A)*E;if(F*F+q*q>B*B){return}B=-0.0-w;if(v*z+y*B<0.0){G=w;H=-0.0-v}else{G=B;H=v}v=+P(H*H+G*G);if(v<1.1920928955078125e-7){I=G;J=H}else{B=1.0/v;I=G*B;J=H*B}c[i>>2]=1;c[b+56>>2]=1;i=b+40|0;B=+J;g[i>>2]=I;g[i+4>>2]=B;i=b+48|0;c[i>>2]=h|0;c[i+4>>2]=e|r&0;r=b+16|0;c[r>>2]=0;e=r;a[r]=0;a[e+1|0]=0;a[e+2|0]=1;a[e+3|0]=0;e=j;j=b;b=c[e+4>>2]|0;c[j>>2]=c[e>>2];c[j+4>>2]=b;return}function bx(b,d,e,f,h,j){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,Q=0,R=0,S=0,T=0,U=0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0,ad=0.0,ae=0.0,af=0,ag=0.0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,au=0,av=0.0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0.0,aK=0,aL=0,aM=0.0;l=i;i=i+40|0;m=l|0;n=l+16|0;o=n|0;p=n;q=i;i=i+56|0;r=i;i=i+24|0;s=i;i=i+24|0;t=s|0;u=s;v=b+132|0;w=+g[f+12>>2];x=+g[j+8>>2];y=+g[f+8>>2];z=+g[j+12>>2];A=w*x-y*z;B=x*y+w*z;z=+A;x=+B;C=+g[j>>2]- +g[f>>2];D=+g[j+4>>2]- +g[f+4>>2];E=w*C+y*D;F=C*(-0.0-y)+w*D;D=+F;f=v;g[f>>2]=E;g[f+4>>2]=D;f=b+140|0;g[f>>2]=z;g[f+4>>2]=x;f=b+144|0;x=+g[h+12>>2];j=b+140|0;z=+g[h+16>>2];G=v|0;D=E+(B*x-A*z);v=b+136|0;E=x*A+B*z+F;H=b+148|0;F=+E;g[H>>2]=D;g[H+4>>2]=F;H=e+28|0;I=b+156|0;J=c[H>>2]|0;K=c[H+4>>2]|0;c[I>>2]=J;c[I+4>>2]=K;I=e+12|0;H=b+164|0;L=c[I>>2]|0;M=c[I+4>>2]|0;c[H>>2]=L;c[H+4>>2]=M;I=e+20|0;N=b+172|0;O=c[I>>2]|0;Q=c[I+4>>2]|0;c[N>>2]=O;c[N+4>>2]=Q;I=e+36|0;R=b+180|0;S=c[I>>2]|0;T=c[I+4>>2]|0;c[R>>2]=S;c[R+4>>2]=T;R=a[e+44|0]&1;I=R<<24>>24!=0;U=a[e+45|0]|0;e=(U&1)!=0;F=(c[k>>2]=O,+g[k>>2]);z=(c[k>>2]=L,+g[k>>2]);B=F-z;A=(c[k>>2]=Q,+g[k>>2]);Q=b+168|0;x=(c[k>>2]=M,+g[k>>2]);w=A-x;y=+P(B*B+w*w);C=(c[k>>2]=J,+g[k>>2]);V=(c[k>>2]=K,+g[k>>2]);W=(c[k>>2]=S,+g[k>>2]);X=(c[k>>2]=T,+g[k>>2]);if(y<1.1920928955078125e-7){Y=B;Z=w}else{_=1.0/y;Y=B*_;Z=w*_}T=b+196|0;_=-0.0-Y;S=T|0;g[S>>2]=Z;K=b+200|0;g[K>>2]=_;w=(D-z)*Z+(E-x)*_;if(I){_=z-C;z=x-V;x=+P(_*_+z*z);if(x<1.1920928955078125e-7){$=_;aa=z}else{B=1.0/x;$=_*B;aa=z*B}B=-0.0-$;g[b+188>>2]=aa;g[b+192>>2]=B;ab=(D-C)*aa+(E-V)*B;ac=Z*$-Y*aa>=0.0}else{ab=0.0;ac=0}L141:do{if(e){aa=W-F;$=X-A;B=+P(aa*aa+$*$);if(B<1.1920928955078125e-7){ad=aa;ae=$}else{V=1.0/B;ad=aa*V;ae=$*V}V=-0.0-ad;J=b+204|0;g[J>>2]=ae;M=b+208|0;g[M>>2]=V;L=Y*ae-Z*ad>0.0;$=(D-F)*ae+(E-A)*V;if((R&U)<<24>>24==0){af=L;ag=$;ah=159;break}if(ac&L){do{if(ab<0.0&w<0.0){O=$>=0.0;a[b+248|0]=O&1;ai=b+212|0;if(O){aj=ai;break}O=ai;V=+(-0.0-Z);aa=+Y;g[O>>2]=V;g[O+4>>2]=aa;O=b+228|0;g[O>>2]=V;g[O+4>>2]=aa;O=b+236|0;g[O>>2]=V;g[O+4>>2]=aa;break L141}else{a[b+248|0]=1;aj=b+212|0}}while(0);O=T;ai=aj;ak=c[O+4>>2]|0;c[ai>>2]=c[O>>2];c[ai+4>>2]=ak;ak=b+188|0;ai=b+228|0;O=c[ak+4>>2]|0;c[ai>>2]=c[ak>>2];c[ai+4>>2]=O;O=b+204|0;ai=b+236|0;ak=c[O+4>>2]|0;c[ai>>2]=c[O>>2];c[ai+4>>2]=ak;break}if(ac){do{if(ab<0.0){if(w<0.0){a[b+248|0]=0;al=b+212|0}else{ak=$>=0.0;a[b+248|0]=ak&1;ai=b+212|0;if(ak){am=ai;break}else{al=ai}}ai=al;aa=+Y;g[ai>>2]=-0.0-Z;g[ai+4>>2]=aa;ai=b+228|0;aa=+(-0.0- +g[M>>2]);g[ai>>2]=-0.0- +g[J>>2];g[ai+4>>2]=aa;ai=b+236|0;aa=+(-0.0- +g[K>>2]);g[ai>>2]=-0.0- +g[S>>2];g[ai+4>>2]=aa;break L141}else{a[b+248|0]=1;am=b+212|0}}while(0);ai=T;ak=am;O=c[ai+4>>2]|0;c[ak>>2]=c[ai>>2];c[ak+4>>2]=O;O=b+188|0;ak=b+228|0;an=c[O+4>>2]|0;c[ak>>2]=c[O>>2];c[ak+4>>2]=an;an=b+236|0;ak=c[ai+4>>2]|0;c[an>>2]=c[ai>>2];c[an+4>>2]=ak;break}if(!L){do{if(ab<0.0|w<0.0){a[b+248|0]=0;ao=b+212|0}else{ak=$>=0.0;a[b+248|0]=ak&1;an=b+212|0;if(!ak){ao=an;break}ak=T;ai=an;an=c[ak>>2]|0;O=c[ak+4>>2]|0;c[ai>>2]=an;c[ai+4>>2]=O;ai=b+228|0;c[ai>>2]=an;c[ai+4>>2]=O;ai=b+236|0;c[ai>>2]=an;c[ai+4>>2]=O;break L141}}while(0);L=ao;aa=+Y;g[L>>2]=-0.0-Z;g[L+4>>2]=aa;L=b+228|0;aa=+(-0.0- +g[M>>2]);g[L>>2]=-0.0- +g[J>>2];g[L+4>>2]=aa;L=b+236|0;aa=+(-0.0- +g[b+192>>2]);g[L>>2]=-0.0- +g[b+188>>2];g[L+4>>2]=aa;break}do{if($<0.0){if(ab<0.0){a[b+248|0]=0;ap=b+212|0}else{L=w>=0.0;a[b+248|0]=L&1;O=b+212|0;if(L){aq=O;break}else{ap=O}}O=ap;aa=+Y;g[O>>2]=-0.0-Z;g[O+4>>2]=aa;O=b+228|0;aa=+(-0.0- +g[K>>2]);g[O>>2]=-0.0- +g[S>>2];g[O+4>>2]=aa;O=b+236|0;aa=+(-0.0- +g[b+192>>2]);g[O>>2]=-0.0- +g[b+188>>2];g[O+4>>2]=aa;break L141}else{a[b+248|0]=1;aq=b+212|0}}while(0);J=T;M=aq;O=c[J+4>>2]|0;c[M>>2]=c[J>>2];c[M+4>>2]=O;O=b+228|0;M=c[J+4>>2]|0;c[O>>2]=c[J>>2];c[O+4>>2]=M;M=b+204|0;O=b+236|0;J=c[M+4>>2]|0;c[O>>2]=c[M>>2];c[O+4>>2]=J}else{af=0;ag=0.0;ah=159}}while(0);L182:do{if((ah|0)==159){if(I){aq=ab>=0.0;if(ac){do{if(aq){a[b+248|0]=1;ar=b+212|0}else{ap=w>=0.0;a[b+248|0]=ap&1;ao=b+212|0;if(ap){ar=ao;break}ap=ao;ao=0;A=+Y;c[ap>>2]=ao|(g[k>>2]=-0.0-Z,c[k>>2]|0);g[ap+4>>2]=A;ap=T;am=b+228|0;al=c[ap>>2]|0;aj=c[ap+4>>2]|0;c[am>>2]=al;c[am+4>>2]=aj;aj=b+236|0;c[aj>>2]=ao|(g[k>>2]=-0.0-(c[k>>2]=al,+g[k>>2]),c[k>>2]|0);g[aj+4>>2]=A;break L182}}while(0);aj=T;al=ar;ao=c[aj+4>>2]|0;c[al>>2]=c[aj>>2];c[al+4>>2]=ao;ao=b+188|0;al=b+228|0;aj=c[ao+4>>2]|0;c[al>>2]=c[ao>>2];c[al+4>>2]=aj;aj=b+236|0;A=+(-0.0- +g[K>>2]);g[aj>>2]=-0.0- +g[S>>2];g[aj+4>>2]=A;break}else{do{if(aq){aj=w>=0.0;a[b+248|0]=aj&1;al=b+212|0;if(!aj){as=al;break}aj=T;ao=al;al=c[aj>>2]|0;am=c[aj+4>>2]|0;c[ao>>2]=al;c[ao+4>>2]=am;ao=b+228|0;c[ao>>2]=al;c[ao+4>>2]=am;am=b+236|0;A=+Y;g[am>>2]=-0.0-(c[k>>2]=al,+g[k>>2]);g[am+4>>2]=A;break L182}else{a[b+248|0]=0;as=b+212|0}}while(0);aq=as;A=+Y;g[aq>>2]=-0.0-Z;g[aq+4>>2]=A;aq=T;am=b+228|0;al=c[aq+4>>2]|0;c[am>>2]=c[aq>>2];c[am+4>>2]=al;al=b+236|0;A=+(-0.0- +g[b+192>>2]);g[al>>2]=-0.0- +g[b+188>>2];g[al+4>>2]=A;break}}al=w>=0.0;if(!e){a[b+248|0]=al&1;am=b+212|0;if(al){aq=T;ao=am;aj=c[aq>>2]|0;ap=c[aq+4>>2]|0;c[ao>>2]=aj;c[ao+4>>2]=ap;ap=b+228|0;A=+(-0.0-(c[k>>2]=aj,+g[k>>2]));E=+Y;g[ap>>2]=A;g[ap+4>>2]=E;ap=b+236|0;g[ap>>2]=A;g[ap+4>>2]=E;break}else{ap=am;E=+Y;g[ap>>2]=-0.0-Z;g[ap+4>>2]=E;ap=T;am=b+228|0;aj=c[ap>>2]|0;ao=c[ap+4>>2]|0;c[am>>2]=aj;c[am+4>>2]=ao;am=b+236|0;c[am>>2]=aj;c[am+4>>2]=ao;break}}if(af){do{if(al){a[b+248|0]=1;at=b+212|0}else{ao=ag>=0.0;a[b+248|0]=ao&1;am=b+212|0;if(ao){at=am;break}ao=am;E=+(-0.0-Z);A=+Y;g[ao>>2]=E;g[ao+4>>2]=A;ao=b+228|0;g[ao>>2]=E;g[ao+4>>2]=A;ao=T;am=b+236|0;aj=c[ao+4>>2]|0;c[am>>2]=c[ao>>2];c[am+4>>2]=aj;break L182}}while(0);aj=T;am=at;ao=c[aj+4>>2]|0;c[am>>2]=c[aj>>2];c[am+4>>2]=ao;ao=b+228|0;A=+(-0.0- +g[K>>2]);g[ao>>2]=-0.0- +g[S>>2];g[ao+4>>2]=A;ao=b+204|0;am=b+236|0;aj=c[ao+4>>2]|0;c[am>>2]=c[ao>>2];c[am+4>>2]=aj;break}else{do{if(al){aj=ag>=0.0;a[b+248|0]=aj&1;am=b+212|0;if(!aj){au=am;break}aj=T;ao=am;am=c[aj>>2]|0;ap=c[aj+4>>2]|0;c[ao>>2]=am;c[ao+4>>2]=ap;ao=b+228|0;A=+Y;g[ao>>2]=-0.0-(c[k>>2]=am,+g[k>>2]);g[ao+4>>2]=A;ao=b+236|0;c[ao>>2]=am;c[ao+4>>2]=ap;break L182}else{a[b+248|0]=0;au=b+212|0}}while(0);al=au;A=+Y;g[al>>2]=-0.0-Z;g[al+4>>2]=A;al=b+228|0;A=+(-0.0- +g[b+208>>2]);g[al>>2]=-0.0- +g[b+204>>2];g[al+4>>2]=A;al=T;ap=b+236|0;ao=c[al+4>>2]|0;c[ap>>2]=c[al>>2];c[ap+4>>2]=ao;break}}}while(0);au=h+148|0;at=b+128|0;c[at>>2]=c[au>>2];if((c[au>>2]|0)>0){af=0;do{Z=+g[f>>2];Y=+g[h+20+(af<<3)>>2];ag=+g[j>>2];w=+g[h+20+(af<<3)+4>>2];e=b+(af<<3)|0;ab=+(Y*ag+Z*w+ +g[v>>2]);g[e>>2]=+g[G>>2]+(Z*Y-ag*w);g[e+4>>2]=ab;ab=+g[f>>2];w=+g[h+84+(af<<3)>>2];ag=+g[j>>2];Y=+g[h+84+(af<<3)+4>>2];e=b+64+(af<<3)|0;Z=+(w*ag+ab*Y);g[e>>2]=ab*w-ag*Y;g[e+4>>2]=Z;af=af+1|0;}while((af|0)<(c[au>>2]|0))}au=b+244|0;g[au>>2]=.019999999552965164;af=d+60|0;c[af>>2]=0;e=b+248|0;as=c[at>>2]|0;if((as|0)>0){Z=+g[b+164>>2];Y=+g[Q>>2];ag=+g[b+212>>2];w=+g[b+216>>2];Q=0;ab=3.4028234663852886e+38;while(1){A=ag*(+g[b+(Q<<3)>>2]-Z)+w*(+g[b+(Q<<3)+4>>2]-Y);E=A<ab?A:ab;ar=Q+1|0;if((ar|0)<(as|0)){Q=ar;ab=E}else{av=E;break}}}else{av=3.4028234663852886e+38}if(av>+g[au>>2]){i=l;return}by(m,b);Q=c[m>>2]|0;do{if((Q|0)==0){ah=195}else{ab=+g[m+8>>2];if(ab>+g[au>>2]){i=l;return}if(ab<=av*.9800000190734863+.0010000000474974513){ah=195;break}as=c[m+4>>2]|0;ar=n;ac=d+56|0;if((Q|0)==1){aw=ar;ax=ac;ah=197;break}c[ac>>2]=2;ac=c[H+4>>2]|0;c[o>>2]=c[H>>2];c[o+4>>2]=ac;ac=n+8|0;I=ac;a[ac]=0;ac=as&255;a[I+1|0]=ac;a[I+2|0]=0;a[I+3|0]=1;I=p+12|0;ao=c[N+4>>2]|0;c[I>>2]=c[N>>2];c[I+4>>2]=ao;ao=p+20|0;I=ao;a[ao]=0;a[I+1|0]=ac;a[I+2|0]=0;a[I+3|0]=1;c[q>>2]=as;I=as+1|0;ac=(I|0)<(c[at>>2]|0)?I:0;c[q+4>>2]=ac;I=b+(as<<3)|0;ao=q+8|0;ap=c[I>>2]|0;al=c[I+4>>2]|0;c[ao>>2]=ap;c[ao+4>>2]=al;ao=b+(ac<<3)|0;ac=q+16|0;I=c[ao>>2]|0;am=c[ao+4>>2]|0;c[ac>>2]=I;c[ac+4>>2]=am;ac=b+64+(as<<3)|0;ao=q+24|0;aj=c[ac>>2]|0;aq=c[ac+4>>2]|0;c[ao>>2]=aj;c[ao+4>>2]=aq;ay=aq;az=aj;aA=ap;aB=al;aC=I;aD=am;aE=as;aF=0;aG=ar}}while(0);if((ah|0)==195){aw=n;ax=d+56|0;ah=197}do{if((ah|0)==197){c[ax>>2]=1;Q=c[at>>2]|0;if((Q|0)>1){av=+g[b+216>>2];ab=+g[b+212>>2];m=0;Y=ab*+g[b+64>>2]+av*+g[b+68>>2];ar=1;while(1){w=ab*+g[b+64+(ar<<3)>>2]+av*+g[b+64+(ar<<3)+4>>2];as=w<Y;am=as?ar:m;I=ar+1|0;if((I|0)<(Q|0)){m=am;Y=as?w:Y;ar=I}else{aH=am;break}}}else{aH=0}ar=aH+1|0;m=(ar|0)<(Q|0)?ar:0;ar=b+(aH<<3)|0;am=c[ar+4>>2]|0;c[o>>2]=c[ar>>2];c[o+4>>2]=am;am=n+8|0;ar=am;a[am]=0;a[ar+1|0]=aH&255;a[ar+2|0]=1;a[ar+3|0]=0;ar=b+(m<<3)|0;am=p+12|0;I=c[ar+4>>2]|0;c[am>>2]=c[ar>>2];c[am+4>>2]=I;I=p+20|0;am=I;a[I]=0;a[am+1|0]=m&255;a[am+2|0]=1;a[am+3|0]=0;am=q|0;if((a[e]&1)==0){c[am>>2]=1;c[q+4>>2]=0;m=q+8|0;I=c[N>>2]|0;ar=c[N+4>>2]|0;c[m>>2]=I;c[m+4>>2]=ar;m=q+16|0;as=c[H>>2]|0;al=c[H+4>>2]|0;c[m>>2]=as;c[m+4>>2]=al;m=q+24|0;ap=(g[k>>2]=-0.0- +g[S>>2],c[k>>2]|0);aj=(g[k>>2]=-0.0- +g[K>>2],c[k>>2]|0);c[m>>2]=ap;c[m+4>>2]=aj;ay=aj;az=ap;aA=I;aB=ar;aC=as;aD=al;aE=1;aF=1;aG=aw;break}else{c[am>>2]=0;c[q+4>>2]=1;am=q+8|0;al=c[H>>2]|0;as=c[H+4>>2]|0;c[am>>2]=al;c[am+4>>2]=as;am=q+16|0;ar=c[N>>2]|0;I=c[N+4>>2]|0;c[am>>2]=ar;c[am+4>>2]=I;am=T;ap=q+24|0;aj=c[am>>2]|0;m=c[am+4>>2]|0;c[ap>>2]=aj;c[ap+4>>2]=m;ay=m;az=aj;aA=al;aB=as;aC=ar;aD=I;aE=0;aF=1;aG=aw;break}}}while(0);Y=(c[k>>2]=ay,+g[k>>2]);av=(c[k>>2]=aA,+g[k>>2]);ab=(c[k>>2]=aB,+g[k>>2]);w=(c[k>>2]=aC,+g[k>>2]);Z=(c[k>>2]=aD,+g[k>>2]);aD=q+32|0;aC=q+24|0;aB=q+28|0;aA=aC|0;ag=-0.0-(c[k>>2]=az,+g[k>>2]);g[aD>>2]=Y;g[q+36>>2]=ag;ay=q+44|0;E=-0.0-Y;aw=ay;g[aw>>2]=E;c[aw+4>>2]=az;aw=q+8|0;T=aw|0;N=q+12|0;A=Y*av+ab*ag;g[q+40>>2]=A;H=q+52|0;g[H>>2]=w*E+(c[k>>2]=az,+g[k>>2])*Z;az=r|0;r=q|0;if((bE(az,aG,aD,A,aE)|0)<2){i=l;return}if((bE(s,az,ay,+g[H>>2],c[q+4>>2]|0)|0)<2){i=l;return}q=d+40|0;do{if(aF){H=aC;ay=q;az=c[H>>2]|0;aE=c[H+4>>2]|0;c[ay>>2]=az;c[ay+4>>2]=aE;aE=aw;ay=d+48|0;H=c[aE>>2]|0;aD=c[aE+4>>2]|0;c[ay>>2]=H;c[ay+4>>2]=aD;A=(c[k>>2]=H,+g[k>>2]);Z=(c[k>>2]=az,+g[k>>2]);E=+g[N>>2];w=+g[aB>>2];ag=+g[s>>2];ab=+g[u+4>>2];av=+g[au>>2];if((ag-A)*Z+(ab-E)*w>av){aI=0;aJ=av}else{av=ag- +g[G>>2];ag=ab- +g[v>>2];ab=+g[f>>2];Y=+g[j>>2];az=d;ae=+(ab*ag+av*(-0.0-Y));g[az>>2]=av*ab+ag*Y;g[az+4>>2]=ae;c[d+16>>2]=c[s+8>>2];aI=1;aJ=+g[au>>2]}ae=+g[u+12>>2];Y=+g[s+16>>2];if((ae-A)*Z+(Y-E)*w>aJ){aK=aI;break}w=ae- +g[G>>2];ae=Y- +g[v>>2];Y=+g[f>>2];E=+g[j>>2];az=d+(aI*20|0)|0;Z=+(Y*ae+w*(-0.0-E));g[az>>2]=w*Y+ae*E;g[az+4>>2]=Z;c[d+(aI*20|0)+16>>2]=c[u+20>>2];aK=aI+1|0}else{az=c[r>>2]|0;H=h+84+(az<<3)|0;aD=q;ay=c[H+4>>2]|0;c[aD>>2]=c[H>>2];c[aD+4>>2]=ay;ay=h+20+(az<<3)|0;az=d+48|0;aD=c[ay+4>>2]|0;c[az>>2]=c[ay>>2];c[az+4>>2]=aD;Z=+g[T>>2];E=+g[aA>>2];ae=+g[N>>2];Y=+g[aB>>2];w=+g[au>>2];if((+g[s>>2]-Z)*E+(+g[u+4>>2]-ae)*Y>w){aL=0;aM=w}else{aD=d;az=c[t+4>>2]|0;c[aD>>2]=c[t>>2];c[aD+4>>2]=az;az=s+8|0;aD=az;ay=d+16|0;H=ay;a[H+2|0]=a[aD+3|0]|0;a[H+3|0]=a[aD+2|0]|0;a[ay]=a[aD+1|0]|0;a[H+1|0]=a[az]|0;aL=1;aM=+g[au>>2]}az=u+12|0;if((+g[az>>2]-Z)*E+(+g[s+16>>2]-ae)*Y>aM){aK=aL;break}H=az;az=d+(aL*20|0)|0;aD=c[H+4>>2]|0;c[az>>2]=c[H>>2];c[az+4>>2]=aD;aD=u+20|0;az=aD;H=d+(aL*20|0)+16|0;ay=H;a[ay+2|0]=a[az+3|0]|0;a[ay+3|0]=a[az+2|0]|0;a[H]=a[az+1|0]|0;a[ay+1|0]=a[aD]|0;aK=aL+1|0}}while(0);c[af>>2]=aK;i=l;return}function by(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0;d=a|0;c[d>>2]=0;e=a+4|0;c[e>>2]=-1;f=a+8|0;g[f>>2]=-3.4028234663852886e+38;h=+g[b+216>>2];i=+g[b+212>>2];a=c[b+128>>2]|0;if((a|0)<=0){return}j=+g[b+164>>2];k=+g[b+168>>2];l=+g[b+172>>2];m=+g[b+176>>2];n=+g[b+244>>2];o=b+228|0;p=b+232|0;q=b+236|0;r=b+240|0;s=0;t=-3.4028234663852886e+38;while(1){u=+g[b+64+(s<<3)>>2];v=-0.0-u;w=-0.0- +g[b+64+(s<<3)+4>>2];x=+g[b+(s<<3)>>2];y=+g[b+(s<<3)+4>>2];z=(x-j)*v+(y-k)*w;A=(x-l)*v+(y-m)*w;B=z<A?z:A;if(B>n){break}if(h*u+i*w<0.0){if((v- +g[o>>2])*i+(w- +g[p>>2])*h>=-.03490658849477768&B>t){C=229}else{D=t}}else{if((v- +g[q>>2])*i+(w- +g[r>>2])*h>=-.03490658849477768&B>t){C=229}else{D=t}}if((C|0)==229){C=0;c[d>>2]=2;c[e>>2]=s;g[f>>2]=B;D=B}E=s+1|0;if((E|0)<(a|0)){s=E;t=D}else{C=233;break}}if((C|0)==233){return}c[d>>2]=2;c[e>>2]=s;g[f>>2]=B;return}function bz(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0;f=i;i=i+256|0;bx(f|0,a,b,c,d,e);i=f;return}function bA(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0,E=0,F=0,G=0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,Q=0,R=0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0,Y=0,Z=0;j=i;i=i+40|0;k=j|0;l=j+8|0;m=j+16|0;n=m|0;o=i;i=i+8|0;p=i;i=i+24|0;q=i;i=i+24|0;r=i;i=i+8|0;s=b+60|0;c[s>>2]=0;t=+g[d+8>>2]+ +g[f+8>>2];c[k>>2]=0;u=+bB(k,d,e,f,h);if(u>t){i=j;return}c[l>>2]=0;v=+bB(l,f,h,d,e);if(v>t){i=j;return}if(v>u*.9800000190734863+.0010000000474974513){u=+g[h>>2];v=+g[h+4>>2];w=+g[h+8>>2];x=+g[h+12>>2];y=+g[e>>2];z=+g[e+4>>2];A=+g[e+8>>2];B=+g[e+12>>2];C=c[l>>2]|0;c[b+56>>2]=2;D=f;E=d;F=C;G=1;H=y;I=z;J=A;K=B;L=u;M=v;N=w;O=x}else{x=+g[e>>2];w=+g[e+4>>2];v=+g[e+8>>2];u=+g[e+12>>2];B=+g[h>>2];A=+g[h+4>>2];z=+g[h+8>>2];y=+g[h+12>>2];h=c[k>>2]|0;c[b+56>>2]=1;D=d;E=f;F=h;G=0;H=B;I=A;J=z;K=y;L=x;M=w;N=v;O=u}h=m;f=c[E+148>>2]|0;if((F|0)<=-1){at(1024,3e3,151,5176)}d=c[D+148>>2]|0;if((d|0)<=(F|0)){at(1024,3e3,151,5176)}u=+g[D+84+(F<<3)>>2];v=+g[D+84+(F<<3)+4>>2];w=O*u-N*v;x=N*u+O*v;v=K*w+J*x;u=-0.0-J;y=K*x+w*u;if((f|0)>0){k=0;w=3.4028234663852886e+38;e=0;while(1){x=v*+g[E+84+(k<<3)>>2]+y*+g[E+84+(k<<3)+4>>2];C=x<w;l=C?k:e;Q=k+1|0;if((Q|0)<(f|0)){k=Q;w=C?x:w;e=l}else{R=l;break}}}else{R=0}e=R+1|0;k=(e|0)<(f|0)?e:0;w=+g[E+20+(R<<3)>>2];y=+g[E+20+(R<<3)+4>>2];v=+(I+(J*w+K*y));g[n>>2]=H+(K*w-J*y);g[n+4>>2]=v;n=F&255;e=m+8|0;m=e;a[e]=n;a[m+1|0]=R&255;a[m+2|0]=1;a[m+3|0]=0;v=+g[E+20+(k<<3)>>2];y=+g[E+20+(k<<3)+4>>2];E=h+12|0;w=+(I+(J*v+K*y));g[E>>2]=H+(K*v-J*y);g[E+4>>2]=w;E=h+20|0;m=E;a[E]=n;a[m+1|0]=k&255;a[m+2|0]=1;a[m+3|0]=0;m=F+1|0;k=(m|0)<(d|0)?m:0;m=D+20+(F<<3)|0;w=+g[m>>2];y=+g[m+4>>2];m=D+20+(k<<3)|0;v=+g[m>>2];x=+g[m+4>>2];z=v-w;A=x-y;B=+P(z*z+A*A);if(B<1.1920928955078125e-7){S=z;T=A}else{U=1.0/B;S=z*U;T=A*U}U=O*S-N*T;A=O*T+N*S;g[o>>2]=U;g[o+4>>2]=A;z=U*-1.0;B=L+(O*w-N*y);V=M+(N*w+O*y);m=p|0;W=B*A+V*z;g[r>>2]=-0.0-U;g[r+4>>2]=-0.0-A;if((bE(m,h,r,t-(B*U+V*A),F)|0)<2){i=j;return}if((bE(q|0,m,o,t+((L+(O*v-N*x))*U+(M+(N*v+O*x))*A),k)|0)<2){i=j;return}k=b+40|0;O=+(S*-1.0);g[k>>2]=T;g[k+4>>2]=O;k=b+48|0;O=+((y+x)*.5);g[k>>2]=(w+v)*.5;g[k+4>>2]=O;O=+g[q>>2];v=+g[q+4>>2];k=A*O+z*v-W>t;do{if(G<<24>>24==0){if(k){X=0}else{w=O-H;x=v-I;o=b;y=+(w*u+K*x);g[o>>2]=K*w+J*x;g[o+4>>2]=y;c[b+16>>2]=c[q+8>>2];X=1}y=+g[q+12>>2];x=+g[q+16>>2];if(A*y+z*x-W>t){Y=X;break}w=y-H;y=x-I;o=b+(X*20|0)|0;x=+(w*u+K*y);g[o>>2]=K*w+J*y;g[o+4>>2]=x;c[b+(X*20|0)+16>>2]=c[q+20>>2];Y=X+1|0}else{if(k){Z=0}else{x=O-H;y=v-I;o=b;w=+(x*u+K*y);g[o>>2]=K*x+J*y;g[o+4>>2]=w;o=b+16|0;m=c[q+8>>2]|0;c[o>>2]=m;F=o;a[o]=m>>>8&255;a[F+1|0]=m&255;a[F+2|0]=m>>>24&255;a[F+3|0]=m>>>16&255;Z=1}w=+g[q+12>>2];y=+g[q+16>>2];if(A*w+z*y-W>t){Y=Z;break}x=w-H;w=y-I;m=b+(Z*20|0)|0;y=+(x*u+K*w);g[m>>2]=K*x+J*w;g[m+4>>2]=y;m=b+(Z*20|0)+16|0;F=c[q+20>>2]|0;c[m>>2]=F;o=m;a[m]=F>>>8&255;a[o+1|0]=F&255;a[o+2|0]=F>>>24&255;a[o+3|0]=F>>>16&255;Y=Z+1|0}}while(0);c[s>>2]=Y;i=j;return}function bB(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0,A=0.0,B=0;h=c[b+148>>2]|0;i=+g[f+12>>2];j=+g[e+12>>2];k=+g[f+8>>2];l=+g[e+16>>2];m=+g[d+12>>2];n=+g[b+12>>2];o=+g[d+8>>2];p=+g[b+16>>2];q=+g[f>>2]+(i*j-k*l)-(+g[d>>2]+(m*n-o*p));r=j*k+i*l+ +g[f+4>>2]-(n*o+m*p+ +g[d+4>>2]);p=m*q+o*r;n=m*r+q*(-0.0-o);if((h|0)>0){s=0;o=-3.4028234663852886e+38;t=0;while(1){q=p*+g[b+84+(s<<3)>>2]+n*+g[b+84+(s<<3)+4>>2];u=q>o;v=u?s:t;w=s+1|0;if((w|0)<(h|0)){s=w;o=u?q:o;t=v}else{x=v;break}}}else{x=0}o=+bC(b,d,x,e,f);t=((x|0)>0?x:h)-1|0;n=+bC(b,d,t,e,f);s=x+1|0;v=(s|0)<(h|0)?s:0;p=+bC(b,d,v,e,f);if(n>o&n>p){q=n;s=t;while(1){t=((s|0)>0?s:h)-1|0;n=+bC(b,d,t,e,f);if(n>q){q=n;s=t}else{y=q;z=s;break}}c[a>>2]=z;return+y}if(p>o){A=p;B=v}else{y=o;z=x;c[a>>2]=z;return+y}while(1){x=B+1|0;v=(x|0)<(h|0)?x:0;o=+bC(b,d,v,e,f);if(o>A){A=o;B=v}else{y=A;z=B;break}}c[a>>2]=z;return+y}function bC(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0,r=0.0,s=0,t=0.0,u=0,v=0,w=0,x=0;h=c[e+148>>2]|0;if((d|0)<=-1){at(1024,3e3,32,5200);return 0.0}if((c[a+148>>2]|0)<=(d|0)){at(1024,3e3,32,5200);return 0.0}i=+g[b+12>>2];j=+g[a+84+(d<<3)>>2];k=+g[b+8>>2];l=+g[a+84+(d<<3)+4>>2];m=i*j-k*l;n=j*k+i*l;l=+g[f+12>>2];j=+g[f+8>>2];o=l*m+j*n;p=l*n+m*(-0.0-j);if((h|0)>0){q=0;r=3.4028234663852886e+38;s=0;while(1){t=o*+g[e+20+(q<<3)>>2]+p*+g[e+20+(q<<3)+4>>2];u=t<r;v=u?q:s;w=q+1|0;if((w|0)<(h|0)){q=w;r=u?t:r;s=v}else{x=v;break}}}else{x=0}r=+g[a+20+(d<<3)>>2];p=+g[a+20+(d<<3)+4>>2];o=+g[e+20+(x<<3)>>2];t=+g[e+20+(x<<3)+4>>2];return+(m*(+g[f>>2]+(l*o-j*t)-(+g[b>>2]+(i*r-k*p)))+n*(o*j+l*t+ +g[f+4>>2]-(r*k+i*p+ +g[b+4>>2])))}function bD(a,b,d,e,f,h){a=a|0;b=b|0;d=d|0;e=+e;f=f|0;h=+h;var i=0,j=0,k=0,l=0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0,v=0.0,w=0.0,x=0.0,y=0.0,z=0,A=0,B=0,C=0,D=0,E=0.0,F=0.0;i=b+60|0;if((c[i>>2]|0)==0){return}j=c[b+56>>2]|0;if((j|0)==0){k=a|0;g[k>>2]=1.0;l=a+4|0;g[l>>2]=0.0;m=+g[d+12>>2];n=+g[b+48>>2];o=+g[d+8>>2];p=+g[b+52>>2];q=+g[d>>2]+(m*n-o*p);r=n*o+m*p+ +g[d+4>>2];p=+g[f+12>>2];m=+g[b>>2];o=+g[f+8>>2];n=+g[b+4>>2];s=+g[f>>2]+(p*m-o*n);t=m*o+p*n+ +g[f+4>>2];n=q-s;p=r-t;do{if(n*n+p*p>1.4210854715202004e-14){o=s-q;m=t-r;u=a;v=+m;g[u>>2]=o;g[u+4>>2]=v;v=+P(o*o+m*m);if(v<1.1920928955078125e-7){w=o;x=m;break}y=1.0/v;v=o*y;g[k>>2]=v;o=m*y;g[l>>2]=o;w=v;x=o}else{w=1.0;x=0.0}}while(0);l=a+8|0;p=+((r+x*e+(t-x*h))*.5);g[l>>2]=(q+w*e+(s-w*h))*.5;g[l+4>>2]=p;return}else if((j|0)==1){l=d+12|0;p=+g[l>>2];w=+g[b+40>>2];k=d+8|0;s=+g[k>>2];q=+g[b+44>>2];x=p*w-s*q;t=w*s+p*q;u=a;q=+t;g[u>>2]=x;g[u+4>>2]=q;q=+g[l>>2];p=+g[b+48>>2];s=+g[k>>2];w=+g[b+52>>2];r=+g[d>>2]+(q*p-s*w);n=p*s+q*w+ +g[d+4>>2];if((c[i>>2]|0)<=0){return}k=f+12|0;l=f+8|0;u=f|0;z=f+4|0;A=a|0;B=a+4|0;C=0;w=x;x=t;while(1){t=+g[k>>2];q=+g[b+(C*20|0)>>2];s=+g[l>>2];p=+g[b+(C*20|0)+4>>2];o=+g[u>>2]+(t*q-s*p);v=q*s+t*p+ +g[z>>2];p=e-(w*(o-r)+(v-n)*x);D=a+8+(C<<3)|0;t=+((v-x*h+(v+x*p))*.5);g[D>>2]=(o-w*h+(o+w*p))*.5;g[D+4>>2]=t;D=C+1|0;if((D|0)>=(c[i>>2]|0)){break}C=D;w=+g[A>>2];x=+g[B>>2]}return}else if((j|0)==2){j=f+12|0;x=+g[j>>2];w=+g[b+40>>2];B=f+8|0;n=+g[B>>2];r=+g[b+44>>2];t=x*w-n*r;p=w*n+x*r;A=a;r=+p;g[A>>2]=t;g[A+4>>2]=r;r=+g[j>>2];x=+g[b+48>>2];n=+g[B>>2];w=+g[b+52>>2];o=+g[f>>2]+(r*x-n*w);v=x*n+r*w+ +g[f+4>>2];if((c[i>>2]|0)>0){f=d+12|0;B=d+8|0;j=d|0;C=d+4|0;d=a|0;z=a+4|0;u=0;w=t;r=p;while(1){n=+g[f>>2];x=+g[b+(u*20|0)>>2];s=+g[B>>2];q=+g[b+(u*20|0)+4>>2];y=+g[j>>2]+(n*x-s*q);m=x*s+n*q+ +g[C>>2];q=h-(w*(y-o)+(m-v)*r);l=a+8+(u<<3)|0;n=+((m-r*e+(m+r*q))*.5);g[l>>2]=(y-w*e+(y+w*q))*.5;g[l+4>>2]=n;l=u+1|0;n=+g[d>>2];q=+g[z>>2];if((l|0)<(c[i>>2]|0)){u=l;w=n;r=q}else{E=n;F=q;break}}}else{E=t;F=p}p=+(-0.0-F);g[A>>2]=-0.0-E;g[A+4>>2]=p;return}else{return}}function bE(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=+f;h=h|0;var i=0.0,j=0,k=0.0,l=0.0,m=0,n=0,o=0,p=0.0,q=0,r=0,s=0,t=0,u=0;i=+g[e>>2];j=d|0;k=+g[e+4>>2];e=d+4|0;l=i*+g[j>>2]+k*+g[e>>2]-f;m=d+12|0;n=m|0;o=d+16|0;p=i*+g[n>>2]+k*+g[o>>2]-f;if(l>0.0){q=0}else{r=b;s=d;c[r>>2]=c[s>>2];c[r+4>>2]=c[s+4>>2];c[r+8>>2]=c[s+8>>2];q=1}if(p>0.0){t=q}else{s=b+(q*12|0)|0;r=m;c[s>>2]=c[r>>2];c[s+4>>2]=c[r+4>>2];c[s+8>>2]=c[r+8>>2];t=q+1|0}if(l*p>=0.0){u=t;return u|0}f=l/(l-p);p=+g[j>>2];l=+g[e>>2];e=b+(t*12|0)|0;k=+(l+f*(+g[o>>2]-l));g[e>>2]=p+f*(+g[n>>2]-p);g[e+4>>2]=k;e=b+(t*12|0)+8|0;b=e;a[e]=h&255;a[b+1|0]=a[d+9|0]|0;a[b+2|0]=0;a[b+3|0]=1;u=t+1|0;return u|0}function bF(d,e,f,h,j,k){d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0;l=i;i=i+136|0;m=l|0;n=l+96|0;o=l+112|0;c[m+16>>2]=0;c[m+20>>2]=0;g[m+24>>2]=0.0;c[m+44>>2]=0;c[m+48>>2]=0;g[m+52>>2]=0.0;bG(m|0,d,e);bG(m+28|0,f,h);h=m+56|0;f=j;c[h>>2]=c[f>>2];c[h+4>>2]=c[f+4>>2];c[h+8>>2]=c[f+8>>2];c[h+12>>2]=c[f+12>>2];f=m+72|0;h=k;c[f>>2]=c[h>>2];c[f+4>>2]=c[h+4>>2];c[f+8>>2]=c[h+8>>2];c[f+12>>2]=c[h+12>>2];a[m+88|0]=1;b[n+4>>1]=0;bI(o,n,m);i=l;return+g[o+16>>2]<11920928955078125.0e-22|0}function bG(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0;e=c[b+4>>2]|0;if((e|0)==0){c[a+16>>2]=b+12;c[a+20>>2]=1;g[a+24>>2]=+g[b+8>>2];return}else if((e|0)==2){c[a+16>>2]=b+20;c[a+20>>2]=c[b+148>>2];g[a+24>>2]=+g[b+8>>2];return}else if((e|0)==3){if((d|0)<=-1){at(96,2616,53,5e3)}f=b+16|0;if((c[f>>2]|0)<=(d|0)){at(96,2616,53,5e3)}h=b+12|0;i=(c[h>>2]|0)+(d<<3)|0;j=a;k=c[i+4>>2]|0;c[j>>2]=c[i>>2];c[j+4>>2]=k;k=d+1|0;d=a+8|0;j=c[h>>2]|0;if((k|0)<(c[f>>2]|0)){f=j+(k<<3)|0;k=d;h=c[f+4>>2]|0;c[k>>2]=c[f>>2];c[k+4>>2]=h}else{h=j;j=d;d=c[h+4>>2]|0;c[j>>2]=c[h>>2];c[j+4>>2]=d}c[a+16>>2]=a;c[a+20>>2]=2;g[a+24>>2]=+g[b+8>>2];return}else if((e|0)==1){c[a+16>>2]=b+12;c[a+20>>2]=2;g[a+24>>2]=+g[b+8>>2];return}else{at(2608,2616,81,5e3)}}function bH(a){a=a|0;var b=0,d=0.0,e=0.0,f=0,h=0.0,i=0.0,j=0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0;b=a+16|0;d=+g[b>>2];e=+g[b+4>>2];b=a+36|0;f=a+52|0;h=+g[f>>2];i=+g[f+4>>2];f=a+72|0;j=a+88|0;k=+g[j>>2];l=+g[j+4>>2];m=h-d;n=i-e;o=d*m+e*n;p=h*m+i*n;q=k-d;r=l-e;s=d*q+e*r;t=k*q+l*r;u=k-h;v=l-i;w=h*u+i*v;x=k*u+l*v;v=m*r-n*q;q=(h*l-i*k)*v;n=(e*k-d*l)*v;l=(d*i-e*h)*v;if(!(o<-0.0|s<-0.0)){g[a+24>>2]=1.0;c[a+108>>2]=1;return}if(!(o>=-0.0|p<=0.0|l>0.0)){v=1.0/(p-o);g[a+24>>2]=p*v;g[a+60>>2]=v*(-0.0-o);c[a+108>>2]=2;return}if(!(s>=-0.0|t<=0.0|n>0.0)){o=1.0/(t-s);g[a+24>>2]=t*o;g[a+96>>2]=o*(-0.0-s);c[a+108>>2]=2;j=b;y=f;ea(j|0,y|0,36)|0;return}if(!(p>0.0|w<-0.0)){g[a+60>>2]=1.0;c[a+108>>2]=1;y=a;j=b;ea(y|0,j|0,36)|0;return}if(!(t>0.0|x>0.0)){g[a+96>>2]=1.0;c[a+108>>2]=1;j=a;y=f;ea(j|0,y|0,36)|0;return}if(w>=-0.0|x<=0.0|q>0.0){t=1.0/(l+(q+n));g[a+24>>2]=q*t;g[a+60>>2]=n*t;g[a+96>>2]=l*t;c[a+108>>2]=3;return}else{t=1.0/(x-w);g[a+60>>2]=x*t;g[a+96>>2]=t*(-0.0-w);c[a+108>>2]=2;y=a;a=f;ea(y|0,a|0,36)|0;return}}function bI(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0.0,v=0,w=0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,Q=0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0,Z=0,_=0.0,$=0.0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0.0,aq=0.0,ar=0.0;h=i;i=i+176|0;j=h|0;k=h+16|0;l=h+32|0;m=h+144|0;n=h+160|0;c[1634]=(c[1634]|0)+1;o=j;p=f+56|0;c[o>>2]=c[p>>2];c[o+4>>2]=c[p+4>>2];c[o+8>>2]=c[p+8>>2];c[o+12>>2]=c[p+12>>2];p=k;o=f+72|0;c[p>>2]=c[o>>2];c[p+4>>2]=c[o+4>>2];c[p+8>>2]=c[o+8>>2];c[p+12>>2]=c[o+12>>2];bJ(l,e,f|0,j,f+28|0,k);o=l|0;p=l+108|0;q=c[p>>2]|0;if((q|0)==1|(q|0)==2|(q|0)==3){r=l+16|0;s=l+20|0;t=+g[j+12>>2];u=+g[j+8>>2];v=f+16|0;w=f+20|0;x=+g[j>>2];y=+g[j+4>>2];z=+g[k+12>>2];A=+g[k+8>>2];B=-0.0-A;j=f+44|0;C=f+48|0;D=+g[k>>2];E=+g[k+4>>2];k=l+52|0;F=l+56|0;G=l+16|0;H=l+52|0;I=l+24|0;J=l+60|0;K=l;L=l+36|0;M=0;N=q;L447:while(1){O=(N|0)>0;if(O){Q=0;do{c[m+(Q<<2)>>2]=c[o+(Q*36|0)+28>>2];c[n+(Q<<2)>>2]=c[o+(Q*36|0)+32>>2];Q=Q+1|0;}while((Q|0)<(N|0))}do{if((N|0)==2){R=+g[G>>2];S=+g[G+4>>2];T=+g[H>>2];U=+g[H+4>>2];V=T-R;W=U-S;X=R*V+S*W;if(X>=-0.0){g[I>>2]=1.0;c[p>>2]=1;Y=373;break}S=T*V+U*W;if(S>0.0){W=1.0/(S-X);g[I>>2]=S*W;g[J>>2]=W*(-0.0-X);c[p>>2]=2;Y=374;break}else{g[J>>2]=1.0;c[p>>2]=1;ea(K|0,L|0,36)|0;Y=373;break}}else if((N|0)==3){bH(l);Q=c[p>>2]|0;if((Q|0)==0){Y=371;break L447}else if((Q|0)==1){Y=373}else if((Q|0)==2){Y=374}else if((Q|0)==3){Z=M;Y=398;break L447}else{Y=372;break L447}}else if((N|0)==1){Y=373}else{Y=369;break L447}}while(0);do{if((Y|0)==373){Y=0;_=-0.0- +g[r>>2];$=-0.0- +g[s>>2];aa=1}else if((Y|0)==374){Y=0;X=+g[r>>2];W=+g[k>>2]-X;S=+g[s>>2];U=+g[F>>2]-S;if(W*(-0.0-S)-U*(-0.0-X)>0.0){_=U*-1.0;$=W;aa=2;break}else{_=U;$=W*-1.0;aa=2;break}}}while(0);if($*$+_*_<1.4210854715202004e-14){Z=M;Y=398;break}Q=o+(aa*36|0)|0;W=-0.0-$;U=t*(-0.0-_)+u*W;X=t*W+_*u;ab=c[v>>2]|0;ac=c[w>>2]|0;if((ac|0)>1){W=X*+g[ab+4>>2]+U*+g[ab>>2];ad=1;ae=0;while(1){S=U*+g[ab+(ad<<3)>>2]+X*+g[ab+(ad<<3)+4>>2];af=S>W;ag=af?ad:ae;ah=ad+1|0;if((ah|0)<(ac|0)){W=af?S:W;ad=ah;ae=ag}else{break}}ae=o+(aa*36|0)+28|0;c[ae>>2]=ag;if((ag|0)>-1){ai=ag;aj=ae}else{Y=412;break}}else{ae=o+(aa*36|0)+28|0;c[ae>>2]=0;ai=0;aj=ae}if((ac|0)<=(ai|0)){Y=413;break}W=+g[ab+(ai<<3)>>2];X=+g[ab+(ai<<3)+4>>2];U=x+(t*W-u*X);ae=Q;S=+(W*u+t*X+y);g[ae>>2]=U;g[ae+4>>2]=S;S=_*z+$*A;X=$*z+_*B;ae=c[j>>2]|0;ad=c[C>>2]|0;if((ad|0)>1){W=X*+g[ae+4>>2]+S*+g[ae>>2];ah=1;af=0;while(1){V=S*+g[ae+(ah<<3)>>2]+X*+g[ae+(ah<<3)+4>>2];ak=V>W;al=ak?ah:af;am=ah+1|0;if((am|0)<(ad|0)){W=ak?V:W;ah=am;af=al}else{break}}af=o+(aa*36|0)+32|0;c[af>>2]=al;if((al|0)>-1){an=al;ao=af}else{Y=414;break}}else{af=o+(aa*36|0)+32|0;c[af>>2]=0;an=0;ao=af}if((ad|0)<=(an|0)){Y=415;break}W=+g[ae+(an<<3)>>2];X=+g[ae+(an<<3)+4>>2];S=D+(z*W-A*X);af=o+(aa*36|0)+8|0;V=+(W*A+z*X+E);g[af>>2]=S;g[af+4>>2]=V;af=o+(aa*36|0)+16|0;V=+(+g[o+(aa*36|0)+12>>2]- +g[o+(aa*36|0)+4>>2]);g[af>>2]=S-U;g[af+4>>2]=V;af=M+1|0;c[1632]=(c[1632]|0)+1;if(O){ah=c[aj>>2]|0;Q=0;do{if((ah|0)==(c[m+(Q<<2)>>2]|0)){if((c[ao>>2]|0)==(c[n+(Q<<2)>>2]|0)){Z=af;Y=398;break L447}}Q=Q+1|0;}while((Q|0)<(N|0))}Q=(c[p>>2]|0)+1|0;c[p>>2]=Q;if((af|0)<20){M=af;N=Q}else{Z=af;Y=398;break}}if((Y|0)==369){at(2608,2616,498,5264)}else if((Y|0)==371){at(2608,2616,194,4384)}else if((Y|0)==372){at(2608,2616,207,4384)}else if((Y|0)==398){N=c[1630]|0;c[1630]=(N|0)>(Z|0)?N:Z;N=d+8|0;bK(l,d|0,N);M=d|0;n=N|0;E=+g[M>>2]- +g[n>>2];ao=d+4|0;m=d+12|0;z=+g[ao>>2]- +g[m>>2];aj=d+16|0;g[aj>>2]=+P(E*E+z*z);c[d+20>>2]=Z;Z=c[p>>2]|0;if((Z|0)==0){at(2608,2616,246,4344)}else if((Z|0)==2){z=+g[r>>2]- +g[k>>2];E=+g[s>>2]- +g[F>>2];ap=+P(z*z+E*E)}else if((Z|0)==3){E=+g[r>>2];z=+g[s>>2];ap=(+g[k>>2]-E)*(+g[l+92>>2]-z)-(+g[F>>2]-z)*(+g[l+88>>2]-E)}else if((Z|0)==1){ap=0.0}else{at(2608,2616,259,4344)}g[e>>2]=ap;b[e+4>>1]=Z&65535;l=0;do{a[e+6+l|0]=c[o+(l*36|0)+28>>2]&255;a[e+9+l|0]=c[o+(l*36|0)+32>>2]&255;l=l+1|0;}while((l|0)<(Z|0));if((a[f+88|0]&1)==0){i=h;return}ap=+g[f+24>>2];E=+g[f+52>>2];z=+g[aj>>2];A=ap+E;if(!(z>A&z>1.1920928955078125e-7)){f=d;D=+((+g[M>>2]+ +g[n>>2])*.5);B=+((+g[ao>>2]+ +g[m>>2])*.5);g[f>>2]=D;g[f+4>>2]=B;f=N;g[f>>2]=D;g[f+4>>2]=B;g[aj>>2]=0.0;i=h;return}g[aj>>2]=z-A;A=+g[n>>2];z=+g[M>>2];B=A-z;D=+g[m>>2];_=+g[ao>>2];$=D-_;y=+P(B*B+$*$);if(y<1.1920928955078125e-7){aq=B;ar=$}else{t=1.0/y;aq=B*t;ar=$*t}g[M>>2]=ap*aq+z;g[ao>>2]=ap*ar+_;g[n>>2]=A-E*aq;g[m>>2]=D-E*ar;i=h;return}else if((Y|0)==412){at(1360,976,103,4456)}else if((Y|0)==413){at(1360,976,103,4456)}else if((Y|0)==414){at(1360,976,103,4456)}else if((Y|0)==415){at(1360,976,103,4456)}}else if((q|0)==0){at(2608,2616,194,4384)}else{at(2608,2616,207,4384)}}function bJ(a,e,f,h,i,j){a=a|0;e=e|0;f=f|0;h=h|0;i=i|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0;k=b[e+4>>1]|0;if((k&65535)>>>0>=4>>>0){at(592,2616,102,4544)}l=k&65535;m=a+108|0;c[m>>2]=l;n=a|0;L529:do{if(k<<16>>16==0){o=l}else{p=f+20|0;q=f+16|0;r=i+20|0;s=i+16|0;t=h+12|0;u=h+8|0;v=h|0;w=h+4|0;x=j+12|0;y=j+8|0;z=j|0;A=j+4|0;B=0;while(1){C=d[e+6+B|0]|0;c[n+(B*36|0)+28>>2]=C;D=d[e+9+B|0]|0;c[n+(B*36|0)+32>>2]=D;if((c[p>>2]|0)<=(C|0)){E=424;break}F=(c[q>>2]|0)+(C<<3)|0;G=+g[F>>2];H=+g[F+4>>2];if((c[r>>2]|0)<=(D|0)){E=426;break}F=(c[s>>2]|0)+(D<<3)|0;I=+g[F>>2];J=+g[F+4>>2];K=+g[t>>2];L=+g[u>>2];M=+g[v>>2]+(G*K-H*L);F=n+(B*36|0)|0;N=+(H*K+G*L+ +g[w>>2]);g[F>>2]=M;g[F+4>>2]=N;N=+g[x>>2];L=+g[y>>2];G=+g[z>>2]+(I*N-J*L);F=n+(B*36|0)+8|0;K=+(J*N+I*L+ +g[A>>2]);g[F>>2]=G;g[F+4>>2]=K;F=n+(B*36|0)+16|0;K=+(+g[n+(B*36|0)+12>>2]- +g[n+(B*36|0)+4>>2]);g[F>>2]=G-M;g[F+4>>2]=K;g[n+(B*36|0)+24>>2]=0.0;F=B+1|0;D=c[m>>2]|0;if((F|0)<(D|0)){B=F}else{o=D;break L529}}if((E|0)==424){at(1360,976,103,4456)}else if((E|0)==426){at(1360,976,103,4456)}}}while(0);do{if((o|0)>1){K=+g[e>>2];if((o|0)==2){M=+g[a+16>>2]- +g[a+52>>2];G=+g[a+20>>2]- +g[a+56>>2];O=+P(M*M+G*G)}else if((o|0)==3){G=+g[a+16>>2];M=+g[a+20>>2];O=(+g[a+52>>2]-G)*(+g[a+92>>2]-M)-(+g[a+56>>2]-M)*(+g[a+88>>2]-G)}else{at(2608,2616,259,4344)}if(O>=K*.5){if(!(K*2.0<O|O<1.1920928955078125e-7)){E=436;break}}c[m>>2]=0}else{E=436}}while(0);do{if((E|0)==436){if((o|0)==0){break}return}}while(0);c[a+28>>2]=0;c[a+32>>2]=0;if((c[f+20>>2]|0)<=0){at(1360,976,103,4456)}o=c[f+16>>2]|0;O=+g[o>>2];K=+g[o+4>>2];if((c[i+20>>2]|0)<=0){at(1360,976,103,4456)}o=c[i+16>>2]|0;G=+g[o>>2];M=+g[o+4>>2];L=+g[h+12>>2];I=+g[h+8>>2];N=+g[h>>2]+(O*L-K*I);J=K*L+O*I+ +g[h+4>>2];h=a;I=+J;g[h>>2]=N;g[h+4>>2]=I;I=+g[j+12>>2];O=+g[j+8>>2];L=+g[j>>2]+(G*I-M*O);K=M*I+G*O+ +g[j+4>>2];j=a+8|0;O=+K;g[j>>2]=L;g[j+4>>2]=O;j=a+16|0;O=+(K-J);g[j>>2]=L-N;g[j+4>>2]=O;c[m>>2]=1;return}function bK(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0;e=c[a+108>>2]|0;if((e|0)==0){at(2608,2616,217,4360)}else if((e|0)==1){f=a;h=b;i=c[f+4>>2]|0;c[h>>2]=c[f>>2];c[h+4>>2]=i;i=a+8|0;h=d;f=c[i+4>>2]|0;c[h>>2]=c[i>>2];c[h+4>>2]=f;return}else if((e|0)==2){f=a+24|0;j=+g[f>>2];h=a+60|0;k=+g[h>>2];i=b;l=+(j*+g[a+4>>2]+k*+g[a+40>>2]);g[i>>2]=j*+g[a>>2]+k*+g[a+36>>2];g[i+4>>2]=l;l=+g[f>>2];k=+g[h>>2];h=d;j=+(l*+g[a+12>>2]+k*+g[a+48>>2]);g[h>>2]=l*+g[a+8>>2]+k*+g[a+44>>2];g[h+4>>2]=j;return}else if((e|0)==3){j=+g[a+24>>2];k=+g[a+60>>2];l=+g[a+96>>2];e=b;m=+(j*+g[a>>2]+k*+g[a+36>>2]+l*+g[a+72>>2]);n=+(j*+g[a+4>>2]+k*+g[a+40>>2]+l*+g[a+76>>2]);g[e>>2]=m;g[e+4>>2]=n;e=d;g[e>>2]=m;g[e+4>>2]=n;return}else{at(2608,2616,236,4360)}}function bL(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;c[a>>2]=-1;b=a+12|0;c[b>>2]=16;c[a+8>>2]=0;d=ci(576)|0;e=a+4|0;c[e>>2]=d;eb(d|0,0,(c[b>>2]|0)*36|0|0);d=(c[b>>2]|0)-1|0;if((d|0)>0){f=0;while(1){g=f+1|0;c[(c[e>>2]|0)+(f*36|0)+20>>2]=g;c[(c[e>>2]|0)+(f*36|0)+32>>2]=-1;h=(c[b>>2]|0)-1|0;if((g|0)<(h|0)){f=g}else{i=h;break}}}else{i=d}c[(c[e>>2]|0)+(i*36|0)+20>>2]=-1;c[(c[e>>2]|0)+(((c[b>>2]|0)-1|0)*36|0)+32>>2]=-1;c[a+16>>2]=0;c[a+20>>2]=0;c[a+24>>2]=0;return}function bM(a){a=a|0;cj(c[a+4>>2]|0);return}function bN(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;b=a+16|0;d=c[b>>2]|0;if((d|0)==-1){e=a+8|0;f=c[e>>2]|0;g=a+12|0;if((f|0)!=(c[g>>2]|0)){at(2880,4016,61,5144);return 0}h=a+4|0;i=c[h>>2]|0;c[g>>2]=f<<1;j=ci(f*72|0)|0;c[h>>2]=j;f=i;i=(c[e>>2]|0)*36|0;ea(j|0,f|0,i)|0;cj(f);f=c[e>>2]|0;i=(c[g>>2]|0)-1|0;if((f|0)<(i|0)){j=f;while(1){f=j+1|0;c[(c[h>>2]|0)+(j*36|0)+20>>2]=f;c[(c[h>>2]|0)+(j*36|0)+32>>2]=-1;k=(c[g>>2]|0)-1|0;if((f|0)<(k|0)){j=f}else{l=k;break}}}else{l=i}c[(c[h>>2]|0)+(l*36|0)+20>>2]=-1;c[(c[h>>2]|0)+(((c[g>>2]|0)-1|0)*36|0)+32>>2]=-1;g=c[e>>2]|0;c[b>>2]=g;m=g;n=h;o=e}else{m=d;n=a+4|0;o=a+8|0}a=(c[n>>2]|0)+(m*36|0)+20|0;c[b>>2]=c[a>>2];c[a>>2]=-1;c[(c[n>>2]|0)+(m*36|0)+24>>2]=-1;c[(c[n>>2]|0)+(m*36|0)+28>>2]=-1;c[(c[n>>2]|0)+(m*36|0)+32>>2]=0;c[(c[n>>2]|0)+(m*36|0)+16>>2]=0;c[o>>2]=(c[o>>2]|0)+1;return m|0}function bO(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,i=0.0;e=bN(a)|0;f=a+4|0;h=(c[f>>2]|0)+(e*36|0)|0;i=+(+g[b+4>>2]+-.10000000149011612);g[h>>2]=+g[b>>2]+-.10000000149011612;g[h+4>>2]=i;h=(c[f>>2]|0)+(e*36|0)+8|0;i=+(+g[b+12>>2]+.10000000149011612);g[h>>2]=+g[b+8>>2]+.10000000149011612;g[h+4>>2]=i;c[(c[f>>2]|0)+(e*36|0)+16>>2]=d;c[(c[f>>2]|0)+(e*36|0)+32>>2]=0;bP(a,e);return e|0}function bP(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0.0,j=0.0,k=0.0,l=0.0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0,F=0,G=0;d=a+24|0;c[d>>2]=(c[d>>2]|0)+1;d=a|0;e=c[d>>2]|0;if((e|0)==-1){c[d>>2]=b;c[(c[a+4>>2]|0)+(b*36|0)+20>>2]=-1;return}f=a+4|0;h=c[f>>2]|0;i=+g[h+(b*36|0)>>2];j=+g[h+(b*36|0)+4>>2];k=+g[h+(b*36|0)+8>>2];l=+g[h+(b*36|0)+12>>2];m=c[h+(e*36|0)+24>>2]|0;L594:do{if((m|0)==-1){n=e}else{o=e;p=m;while(1){q=c[h+(o*36|0)+28>>2]|0;r=+g[h+(o*36|0)+8>>2];s=+g[h+(o*36|0)>>2];t=+g[h+(o*36|0)+12>>2];u=+g[h+(o*36|0)+4>>2];v=((r>k?r:k)-(s<i?s:i)+((t>l?t:l)-(u<j?u:j)))*2.0;w=v*2.0;x=(v-(r-s+(t-u))*2.0)*2.0;u=+g[h+(p*36|0)>>2];t=i<u?i:u;s=+g[h+(p*36|0)+4>>2];r=j<s?j:s;v=+g[h+(p*36|0)+8>>2];y=k>v?k:v;z=+g[h+(p*36|0)+12>>2];A=l>z?l:z;if((c[h+(p*36|0)+24>>2]|0)==-1){B=(y-t+(A-r))*2.0}else{B=(y-t+(A-r))*2.0-(v-u+(z-s))*2.0}s=x+B;z=+g[h+(q*36|0)>>2];u=i<z?i:z;v=+g[h+(q*36|0)+4>>2];r=j<v?j:v;A=+g[h+(q*36|0)+8>>2];t=k>A?k:A;y=+g[h+(q*36|0)+12>>2];C=l>y?l:y;if((c[h+(q*36|0)+24>>2]|0)==-1){D=(t-u+(C-r))*2.0}else{D=(t-u+(C-r))*2.0-(A-z+(y-v))*2.0}v=x+D;if(w<s&w<v){n=o;break L594}E=s<v?p:q;q=c[h+(E*36|0)+24>>2]|0;if((q|0)==-1){n=E;break}else{o=E;p=q}}}}while(0);m=c[h+(n*36|0)+20>>2]|0;h=bN(a)|0;c[(c[f>>2]|0)+(h*36|0)+20>>2]=m;c[(c[f>>2]|0)+(h*36|0)+16>>2]=0;e=c[f>>2]|0;D=+g[e+(n*36|0)>>2];B=+g[e+(n*36|0)+4>>2];p=e+(h*36|0)|0;v=+(j<B?j:B);g[p>>2]=i<D?i:D;g[p+4>>2]=v;v=+g[e+(n*36|0)+8>>2];D=+g[e+(n*36|0)+12>>2];p=e+(h*36|0)+8|0;i=+(l>D?l:D);g[p>>2]=k>v?k:v;g[p+4>>2]=i;p=c[f>>2]|0;c[p+(h*36|0)+32>>2]=(c[p+(n*36|0)+32>>2]|0)+1;p=c[f>>2]|0;if((m|0)==-1){c[p+(h*36|0)+24>>2]=n;c[(c[f>>2]|0)+(h*36|0)+28>>2]=b;c[(c[f>>2]|0)+(n*36|0)+20>>2]=h;c[(c[f>>2]|0)+(b*36|0)+20>>2]=h;c[d>>2]=h}else{d=p+(m*36|0)+24|0;if((c[d>>2]|0)==(n|0)){c[d>>2]=h}else{c[p+(m*36|0)+28>>2]=h}c[(c[f>>2]|0)+(h*36|0)+24>>2]=n;c[(c[f>>2]|0)+(h*36|0)+28>>2]=b;c[(c[f>>2]|0)+(n*36|0)+20>>2]=h;c[(c[f>>2]|0)+(b*36|0)+20>>2]=h}h=c[(c[f>>2]|0)+(b*36|0)+20>>2]|0;if((h|0)==-1){return}else{F=h}while(1){h=bS(a,F)|0;b=c[f>>2]|0;n=c[b+(h*36|0)+24>>2]|0;m=c[b+(h*36|0)+28>>2]|0;if((n|0)==-1){G=487;break}if((m|0)==-1){G=489;break}p=c[b+(n*36|0)+32>>2]|0;d=c[b+(m*36|0)+32>>2]|0;c[b+(h*36|0)+32>>2]=((p|0)>(d|0)?p:d)+1;d=c[f>>2]|0;i=+g[d+(n*36|0)>>2];v=+g[d+(m*36|0)>>2];k=+g[d+(n*36|0)+4>>2];D=+g[d+(m*36|0)+4>>2];p=d+(h*36|0)|0;l=+(k<D?k:D);g[p>>2]=i<v?i:v;g[p+4>>2]=l;l=+g[d+(n*36|0)+8>>2];v=+g[d+(m*36|0)+8>>2];i=+g[d+(n*36|0)+12>>2];D=+g[d+(m*36|0)+12>>2];m=d+(h*36|0)+8|0;k=+(i>D?i:D);g[m>>2]=l>v?l:v;g[m+4>>2]=k;m=c[(c[f>>2]|0)+(h*36|0)+20>>2]|0;if((m|0)==-1){G=494;break}else{F=m}}if((G|0)==487){at(360,4016,307,5160)}else if((G|0)==489){at(200,4016,308,5160)}else if((G|0)==494){return}}function bQ(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0,j=0,k=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0;d=a|0;if((c[d>>2]|0)==(b|0)){c[d>>2]=-1;return}e=a+4|0;f=c[e>>2]|0;h=c[f+(b*36|0)+20>>2]|0;i=c[f+(h*36|0)+20>>2]|0;j=c[f+(h*36|0)+24>>2]|0;if((j|0)==(b|0)){k=c[f+(h*36|0)+28>>2]|0}else{k=j}if((i|0)==-1){c[d>>2]=k;c[f+(k*36|0)+20>>2]=-1;if((h|0)<=-1){at(2440,4016,97,5120)}if((c[a+12>>2]|0)<=(h|0)){at(2440,4016,97,5120)}d=a+8|0;if((c[d>>2]|0)<=0){at(1344,4016,98,5120)}j=a+16|0;c[(c[e>>2]|0)+(h*36|0)+20>>2]=c[j>>2];c[(c[e>>2]|0)+(h*36|0)+32>>2]=-1;c[j>>2]=h;c[d>>2]=(c[d>>2]|0)-1;return}d=f+(i*36|0)+24|0;if((c[d>>2]|0)==(h|0)){c[d>>2]=k}else{c[f+(i*36|0)+28>>2]=k}c[(c[e>>2]|0)+(k*36|0)+20>>2]=i;if((h|0)<=-1){at(2440,4016,97,5120)}if((c[a+12>>2]|0)<=(h|0)){at(2440,4016,97,5120)}k=a+8|0;if((c[k>>2]|0)<=0){at(1344,4016,98,5120)}f=a+16|0;c[(c[e>>2]|0)+(h*36|0)+20>>2]=c[f>>2];c[(c[e>>2]|0)+(h*36|0)+32>>2]=-1;c[f>>2]=h;c[k>>2]=(c[k>>2]|0)-1;k=i;do{i=bS(a,k)|0;h=c[e>>2]|0;f=c[h+(i*36|0)+24>>2]|0;d=c[h+(i*36|0)+28>>2]|0;l=+g[h+(f*36|0)>>2];m=+g[h+(d*36|0)>>2];n=+g[h+(f*36|0)+4>>2];o=+g[h+(d*36|0)+4>>2];j=h+(i*36|0)|0;p=+(n<o?n:o);g[j>>2]=l<m?l:m;g[j+4>>2]=p;p=+g[h+(f*36|0)+8>>2];m=+g[h+(d*36|0)+8>>2];l=+g[h+(f*36|0)+12>>2];o=+g[h+(d*36|0)+12>>2];j=h+(i*36|0)+8|0;n=+(l>o?l:o);g[j>>2]=p>m?p:m;g[j+4>>2]=n;j=c[e>>2]|0;h=c[j+(f*36|0)+32>>2]|0;f=c[j+(d*36|0)+32>>2]|0;c[j+(i*36|0)+32>>2]=((h|0)>(f|0)?h:f)+1;k=c[(c[e>>2]|0)+(i*36|0)+20>>2]|0;}while((k|0)!=-1);return}function bR(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0;if((b|0)<=-1){at(904,4016,135,5104);return 0}if((c[a+12>>2]|0)<=(b|0)){at(904,4016,135,5104);return 0}f=a+4|0;h=c[f>>2]|0;if((c[h+(b*36|0)+24>>2]|0)!=-1){at(536,4016,137,5104);return 0}do{if(+g[h+(b*36|0)>>2]<=+g[d>>2]){if(+g[h+(b*36|0)+4>>2]>+g[d+4>>2]){break}if(+g[d+8>>2]>+g[h+(b*36|0)+8>>2]){break}if(+g[d+12>>2]>+g[h+(b*36|0)+12>>2]){break}else{i=0}return i|0}}while(0);bQ(a,b);h=d;j=d+8|0;k=+g[h>>2]+-.10000000149011612;l=+g[h+4>>2]+-.10000000149011612;m=+g[j>>2]+.10000000149011612;n=+g[j+4>>2]+.10000000149011612;o=+g[e>>2]*2.0;p=+g[e+4>>2]*2.0;if(o<0.0){q=m;r=k+o}else{q=o+m;r=k}if(p<0.0){s=n;t=l+p}else{s=p+n;t=l}e=c[f>>2]|0;f=e+(b*36|0)|0;l=+t;g[f>>2]=r;g[f+4>>2]=l;f=e+(b*36|0)+8|0;l=+s;g[f>>2]=q;g[f+4>>2]=l;bP(a,b);i=1;return i|0}function bS(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0,I=0,J=0,K=0;if((b|0)==-1){at(80,4016,382,5136);return 0}d=a+4|0;e=c[d>>2]|0;f=e+(b*36|0)|0;h=e+(b*36|0)+24|0;i=c[h>>2]|0;if((i|0)==-1){j=b;return j|0}k=e+(b*36|0)+32|0;if((c[k>>2]|0)<2){j=b;return j|0}l=e+(b*36|0)+28|0;m=c[l>>2]|0;if((i|0)<=-1){at(24,4016,392,5136);return 0}n=c[a+12>>2]|0;if((i|0)>=(n|0)){at(24,4016,392,5136);return 0}if(!((m|0)>-1&(m|0)<(n|0))){at(4192,4016,393,5136);return 0}o=e+(i*36|0)|0;p=e+(m*36|0)|0;q=e+(m*36|0)+32|0;r=e+(i*36|0)+32|0;s=(c[q>>2]|0)-(c[r>>2]|0)|0;if((s|0)>1){t=e+(m*36|0)+24|0;u=c[t>>2]|0;v=e+(m*36|0)+28|0;w=c[v>>2]|0;x=e+(u*36|0)|0;y=e+(w*36|0)|0;if(!((u|0)>-1&(u|0)<(n|0))){at(4160,4016,407,5136);return 0}if(!((w|0)>-1&(w|0)<(n|0))){at(3864,4016,408,5136);return 0}c[t>>2]=b;t=e+(b*36|0)+20|0;z=e+(m*36|0)+20|0;c[z>>2]=c[t>>2];c[t>>2]=m;t=c[z>>2]|0;do{if((t|0)==-1){c[a>>2]=m}else{z=c[d>>2]|0;A=z+(t*36|0)+24|0;if((c[A>>2]|0)==(b|0)){c[A>>2]=m;break}A=z+(t*36|0)+28|0;if((c[A>>2]|0)==(b|0)){c[A>>2]=m;break}else{at(3192,4016,424,5136);return 0}}}while(0);t=e+(u*36|0)+32|0;A=e+(w*36|0)+32|0;if((c[t>>2]|0)>(c[A>>2]|0)){c[v>>2]=u;c[l>>2]=w;c[e+(w*36|0)+20>>2]=b;B=+g[o>>2];C=+g[y>>2];D=B<C?B:C;C=+g[e+(i*36|0)+4>>2];B=+g[e+(w*36|0)+4>>2];z=f;E=+(C<B?C:B);g[z>>2]=D;g[z+4>>2]=E;E=+g[e+(i*36|0)+8>>2];B=+g[e+(w*36|0)+8>>2];C=+g[e+(i*36|0)+12>>2];F=+g[e+(w*36|0)+12>>2];z=e+(b*36|0)+8|0;G=+(C>F?C:F);g[z>>2]=E>B?E:B;g[z+4>>2]=G;G=+g[x>>2];B=+g[e+(b*36|0)+4>>2];E=+g[e+(u*36|0)+4>>2];z=p;F=+(B<E?B:E);g[z>>2]=D<G?D:G;g[z+4>>2]=F;F=+g[e+(b*36|0)+8>>2];G=+g[e+(u*36|0)+8>>2];D=+g[e+(b*36|0)+12>>2];E=+g[e+(u*36|0)+12>>2];z=e+(m*36|0)+8|0;B=+(D>E?D:E);g[z>>2]=F>G?F:G;g[z+4>>2]=B;z=c[r>>2]|0;H=c[A>>2]|0;I=((z|0)>(H|0)?z:H)+1|0;c[k>>2]=I;H=c[t>>2]|0;J=(I|0)>(H|0)?I:H}else{c[v>>2]=w;c[l>>2]=u;c[e+(u*36|0)+20>>2]=b;B=+g[o>>2];G=+g[x>>2];F=B<G?B:G;G=+g[e+(i*36|0)+4>>2];B=+g[e+(u*36|0)+4>>2];x=f;E=+(G<B?G:B);g[x>>2]=F;g[x+4>>2]=E;E=+g[e+(i*36|0)+8>>2];B=+g[e+(u*36|0)+8>>2];G=+g[e+(i*36|0)+12>>2];D=+g[e+(u*36|0)+12>>2];u=e+(b*36|0)+8|0;C=+(G>D?G:D);g[u>>2]=E>B?E:B;g[u+4>>2]=C;C=+g[y>>2];B=+g[e+(b*36|0)+4>>2];E=+g[e+(w*36|0)+4>>2];y=p;D=+(B<E?B:E);g[y>>2]=F<C?F:C;g[y+4>>2]=D;D=+g[e+(b*36|0)+8>>2];C=+g[e+(w*36|0)+8>>2];F=+g[e+(b*36|0)+12>>2];E=+g[e+(w*36|0)+12>>2];w=e+(m*36|0)+8|0;B=+(F>E?F:E);g[w>>2]=D>C?D:C;g[w+4>>2]=B;w=c[r>>2]|0;y=c[t>>2]|0;t=((w|0)>(y|0)?w:y)+1|0;c[k>>2]=t;y=c[A>>2]|0;J=(t|0)>(y|0)?t:y}c[q>>2]=J+1;j=m;return j|0}if((s|0)>=-1){j=b;return j|0}s=e+(i*36|0)+24|0;J=c[s>>2]|0;y=e+(i*36|0)+28|0;t=c[y>>2]|0;A=e+(J*36|0)|0;w=e+(t*36|0)|0;if(!((J|0)>-1&(J|0)<(n|0))){at(3112,4016,467,5136);return 0}if(!((t|0)>-1&(t|0)<(n|0))){at(2968,4016,468,5136);return 0}c[s>>2]=b;s=e+(b*36|0)+20|0;n=e+(i*36|0)+20|0;c[n>>2]=c[s>>2];c[s>>2]=i;s=c[n>>2]|0;do{if((s|0)==-1){c[a>>2]=i}else{n=c[d>>2]|0;u=n+(s*36|0)+24|0;if((c[u>>2]|0)==(b|0)){c[u>>2]=i;break}u=n+(s*36|0)+28|0;if((c[u>>2]|0)==(b|0)){c[u>>2]=i;break}else{at(2848,4016,484,5136);return 0}}}while(0);s=e+(J*36|0)+32|0;d=e+(t*36|0)+32|0;if((c[s>>2]|0)>(c[d>>2]|0)){c[y>>2]=J;c[h>>2]=t;c[e+(t*36|0)+20>>2]=b;B=+g[p>>2];C=+g[w>>2];D=B<C?B:C;C=+g[e+(m*36|0)+4>>2];B=+g[e+(t*36|0)+4>>2];a=f;E=+(C<B?C:B);g[a>>2]=D;g[a+4>>2]=E;E=+g[e+(m*36|0)+8>>2];B=+g[e+(t*36|0)+8>>2];C=+g[e+(m*36|0)+12>>2];F=+g[e+(t*36|0)+12>>2];a=e+(b*36|0)+8|0;G=+(C>F?C:F);g[a>>2]=E>B?E:B;g[a+4>>2]=G;G=+g[A>>2];B=+g[e+(b*36|0)+4>>2];E=+g[e+(J*36|0)+4>>2];a=o;F=+(B<E?B:E);g[a>>2]=D<G?D:G;g[a+4>>2]=F;F=+g[e+(b*36|0)+8>>2];G=+g[e+(J*36|0)+8>>2];D=+g[e+(b*36|0)+12>>2];E=+g[e+(J*36|0)+12>>2];a=e+(i*36|0)+8|0;B=+(D>E?D:E);g[a>>2]=F>G?F:G;g[a+4>>2]=B;a=c[q>>2]|0;u=c[d>>2]|0;n=((a|0)>(u|0)?a:u)+1|0;c[k>>2]=n;u=c[s>>2]|0;K=(n|0)>(u|0)?n:u}else{c[y>>2]=t;c[h>>2]=J;c[e+(J*36|0)+20>>2]=b;B=+g[p>>2];G=+g[A>>2];F=B<G?B:G;G=+g[e+(m*36|0)+4>>2];B=+g[e+(J*36|0)+4>>2];A=f;E=+(G<B?G:B);g[A>>2]=F;g[A+4>>2]=E;E=+g[e+(m*36|0)+8>>2];B=+g[e+(J*36|0)+8>>2];G=+g[e+(m*36|0)+12>>2];D=+g[e+(J*36|0)+12>>2];J=e+(b*36|0)+8|0;C=+(G>D?G:D);g[J>>2]=E>B?E:B;g[J+4>>2]=C;C=+g[w>>2];B=+g[e+(b*36|0)+4>>2];E=+g[e+(t*36|0)+4>>2];w=o;D=+(B<E?B:E);g[w>>2]=F<C?F:C;g[w+4>>2]=D;D=+g[e+(b*36|0)+8>>2];C=+g[e+(t*36|0)+8>>2];F=+g[e+(b*36|0)+12>>2];E=+g[e+(t*36|0)+12>>2];t=e+(i*36|0)+8|0;B=+(F>E?F:E);g[t>>2]=D>C?D:C;g[t+4>>2]=B;t=c[q>>2]|0;q=c[s>>2]|0;s=((t|0)>(q|0)?t:q)+1|0;c[k>>2]=s;k=c[d>>2]|0;K=(s|0)>(k|0)?s:k}c[r>>2]=K+1;j=i;return j|0}function bT(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0.0,y=0.0,z=0,A=0.0,B=0.0,C=0,D=0.0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,O=0,P=0,Q=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0.0,_=0.0,$=0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0.0,ag=0.0,ah=0.0,ai=0.0,aj=0.0,ak=0.0,al=0,am=0,an=0.0,ao=0,ap=0,aq=0.0,ar=0.0,as=0,au=0.0,av=0.0,aw=0.0,ax=0.0,ay=0,az=0.0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0;f=i;i=i+336|0;h=f|0;j=f+40|0;k=f+80|0;l=f+96|0;m=f+192|0;n=f+216|0;o=f+320|0;p=f+328|0;c[1628]=(c[1628]|0)+1;q=d|0;c[q>>2]=0;r=e+128|0;s=d+4|0;g[s>>2]=+g[r>>2];d=e|0;t=e+28|0;u=h;v=e+56|0;ea(u|0,v|0,36)|0;v=j;u=e+92|0;ea(v|0,u|0,36)|0;u=h+24|0;w=+g[u>>2];x=+N(w/6.2831854820251465)*6.2831854820251465;y=w-x;g[u>>2]=y;v=h+28|0;w=+g[v>>2]-x;g[v>>2]=w;z=j+24|0;x=+g[z>>2];A=+N(x/6.2831854820251465)*6.2831854820251465;B=x-A;g[z>>2]=B;C=j+28|0;x=+g[C>>2]-A;g[C>>2]=x;A=+g[r>>2];D=+g[e+24>>2]+ +g[e+52>>2]+-.014999999664723873;E=D<.004999999888241291?.004999999888241291:D;if(E<=.0012499999720603228){at(1176,3144,280,5248)}b[k+4>>1]=0;r=l;F=e;c[r>>2]=c[F>>2];c[r+4>>2]=c[F+4>>2];c[r+8>>2]=c[F+8>>2];c[r+12>>2]=c[F+12>>2];c[r+16>>2]=c[F+16>>2];c[r+20>>2]=c[F+20>>2];c[r+24>>2]=c[F+24>>2];F=l+28|0;r=t;c[F>>2]=c[r>>2];c[F+4>>2]=c[r+4>>2];c[F+8>>2]=c[r+8>>2];c[F+12>>2]=c[r+12>>2];c[F+16>>2]=c[r+16>>2];c[F+20>>2]=c[r+20>>2];c[F+24>>2]=c[r+24>>2];a[l+88|0]=0;r=h+8|0;F=h+12|0;e=h+16|0;G=h+20|0;H=h|0;I=h+4|0;J=j+8|0;K=j+12|0;L=j+16|0;M=j+20|0;O=j|0;P=j+4|0;Q=l+56|0;T=l+64|0;U=l+68|0;V=l+72|0;W=l+80|0;X=l+84|0;Y=m+16|0;D=E+.0012499999720603228;Z=E+-.0012499999720603228;_=0.0;$=0;aa=y;y=w;w=B;B=x;L758:while(1){x=1.0-_;ab=x*aa+_*y;ac=+S(ab);ad=+R(ab);ab=+g[H>>2];ae=+g[I>>2];af=x*w+_*B;ag=+S(af);ah=+R(af);af=+g[O>>2];ai=+g[P>>2];aj=x*+g[J>>2]+_*+g[L>>2]-(ah*af-ag*ai);ak=x*+g[K>>2]+_*+g[M>>2]-(ag*af+ah*ai);ai=+(x*+g[F>>2]+_*+g[G>>2]-(ac*ab+ad*ae));g[Q>>2]=x*+g[r>>2]+_*+g[e>>2]-(ad*ab-ac*ae);g[Q+4>>2]=ai;g[T>>2]=ac;g[U>>2]=ad;ad=+ak;g[V>>2]=aj;g[V+4>>2]=ad;g[W>>2]=ag;g[X>>2]=ah;bI(m,k,l);ah=+g[Y>>2];if(ah<=0.0){al=598;break}if(ah<D){al=600;break}+bU(n,k,d,h,t,j,_);am=0;ah=A;while(1){ag=+bV(n,o,p,ah);if(ag>D){al=603;break L758}if(ag>Z){an=ah;break}ao=c[o>>2]|0;ap=c[p>>2]|0;ad=+bW(n,ao,ap,_);if(ad<Z){al=606;break L758}if(ad>D){aq=ah;ar=_;as=0;au=ad;av=ag}else{al=608;break L758}while(1){if((as&1|0)==0){aw=(ar+aq)*.5}else{aw=ar+(E-au)*(aq-ar)/(av-au)}ag=+bW(n,ao,ap,aw);ad=ag-E;if(ad>0.0){ax=ad}else{ax=-0.0-ad}if(ax<.0012499999720603228){ay=as;az=aw;break}aA=ag>E;aB=as+1|0;c[1620]=(c[1620]|0)+1;if((aB|0)==50){ay=50;az=ah;break}else{aq=aA?aq:aw;ar=aA?aw:ar;as=aB;au=aA?ag:au;av=aA?av:ag}}ap=c[1622]|0;c[1622]=(ap|0)>(ay|0)?ap:ay;ap=am+1|0;if((ap|0)==8){an=_;break}else{am=ap;ah=az}}am=$+1|0;c[1626]=(c[1626]|0)+1;if((am|0)==20){al=620;break}_=an;$=am;aa=+g[u>>2];y=+g[v>>2];w=+g[z>>2];B=+g[C>>2]}if((al|0)==608){c[q>>2]=3;g[s>>2]=_}else if((al|0)==606){c[q>>2]=1;g[s>>2]=_}else if((al|0)==620){c[q>>2]=1;g[s>>2]=an;aC=20;aD=c[1624]|0;aE=(aD|0)>(aC|0);aF=aE?aD:aC;c[1624]=aF;i=f;return}else if((al|0)==598){c[q>>2]=2;g[s>>2]=0.0;aC=$;aD=c[1624]|0;aE=(aD|0)>(aC|0);aF=aE?aD:aC;c[1624]=aF;i=f;return}else if((al|0)==600){c[q>>2]=3;g[s>>2]=_;aC=$;aD=c[1624]|0;aE=(aD|0)>(aC|0);aF=aE?aD:aC;c[1624]=aF;i=f;return}else if((al|0)==603){c[q>>2]=4;g[s>>2]=A}c[1626]=(c[1626]|0)+1;aC=$+1|0;aD=c[1624]|0;aE=(aD|0)>(aC|0);aF=aE?aD:aC;c[1624]=aF;i=f;return}function bU(e,f,h,i,j,k,l){e=e|0;f=f|0;h=h|0;i=i|0;j=j|0;k=k|0;l=+l;var m=0,n=0,o=0,p=0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0;c[e>>2]=h;c[e+4>>2]=j;m=b[f+4>>1]|0;if(!(m<<16>>16!=0&(m&65535)>>>0<3>>>0)){at(488,3144,50,4864);return 0.0}n=e+8|0;o=n;p=i;ea(o|0,p|0,36)|0;p=e+44|0;o=p;i=k;ea(o|0,i|0,36)|0;q=1.0-l;r=q*+g[e+32>>2]+ +g[e+36>>2]*l;s=+S(r);t=+R(r);r=+g[n>>2];u=+g[e+12>>2];v=q*+g[e+16>>2]+ +g[e+24>>2]*l-(t*r-s*u);w=q*+g[e+20>>2]+ +g[e+28>>2]*l-(s*r+t*u);u=q*+g[e+68>>2]+ +g[e+72>>2]*l;r=+S(u);x=+R(u);u=+g[p>>2];y=+g[e+48>>2];z=q*+g[e+52>>2]+ +g[e+60>>2]*l-(x*u-r*y);A=q*+g[e+56>>2]+ +g[e+64>>2]*l-(r*u+x*y);if(m<<16>>16==1){c[e+80>>2]=0;m=d[f+6|0]|0;if((c[h+20>>2]|0)<=(m|0)){at(1248,776,103,4440);return 0.0}p=(c[h+16>>2]|0)+(m<<3)|0;y=+g[p>>2];u=+g[p+4>>2];p=d[f+9|0]|0;if((c[j+20>>2]|0)<=(p|0)){at(1248,776,103,4440);return 0.0}m=(c[j+16>>2]|0)+(p<<3)|0;l=+g[m>>2];q=+g[m+4>>2];m=e+92|0;B=z+(x*l-r*q)-(v+(t*y-s*u));C=A+(r*l+x*q)-(w+(s*y+t*u));p=m;u=+C;g[p>>2]=B;g[p+4>>2]=u;u=+P(B*B+C*C);if(u<1.1920928955078125e-7){D=0.0;return+D}y=1.0/u;g[m>>2]=B*y;g[e+96>>2]=C*y;D=u;return+D}m=f+6|0;p=f+7|0;n=e+80|0;if((a[m]|0)==(a[p]|0)){c[n>>2]=2;i=d[f+9|0]|0;o=c[j+20>>2]|0;if((o|0)<=(i|0)){at(1248,776,103,4440);return 0.0}k=c[j+16>>2]|0;E=k+(i<<3)|0;u=+g[E>>2];y=+g[E+4>>2];E=d[f+10|0]|0;if((o|0)<=(E|0)){at(1248,776,103,4440);return 0.0}o=k+(E<<3)|0;C=+g[o>>2];B=+g[o+4>>2];o=e+92|0;q=B-y;l=(C-u)*-1.0;E=o;F=+l;g[E>>2]=q;g[E+4>>2]=F;F=+P(q*q+l*l);if(F<1.1920928955078125e-7){G=q;H=l}else{I=1.0/F;F=q*I;g[o>>2]=F;q=l*I;g[e+96>>2]=q;G=F;H=q}q=(u+C)*.5;C=(y+B)*.5;o=e+84|0;B=+C;g[o>>2]=q;g[o+4>>2]=B;o=d[m]|0;if((c[h+20>>2]|0)<=(o|0)){at(1248,776,103,4440);return 0.0}k=(c[h+16>>2]|0)+(o<<3)|0;B=+g[k>>2];y=+g[k+4>>2];u=(x*G-r*H)*(v+(t*B-s*y)-(z+(x*q-r*C)))+(r*G+x*H)*(w+(s*B+t*y)-(A+(r*q+x*C)));if(u>=0.0){D=u;return+D}C=+(-0.0-H);g[E>>2]=-0.0-G;g[E+4>>2]=C;D=-0.0-u;return+D}else{c[n>>2]=1;n=d[m]|0;m=c[h+20>>2]|0;if((m|0)<=(n|0)){at(1248,776,103,4440);return 0.0}E=c[h+16>>2]|0;h=E+(n<<3)|0;u=+g[h>>2];C=+g[h+4>>2];h=d[p]|0;if((m|0)<=(h|0)){at(1248,776,103,4440);return 0.0}m=E+(h<<3)|0;G=+g[m>>2];H=+g[m+4>>2];m=e+92|0;q=H-C;y=(G-u)*-1.0;h=m;B=+y;g[h>>2]=q;g[h+4>>2]=B;B=+P(q*q+y*y);if(B<1.1920928955078125e-7){J=q;K=y}else{F=1.0/B;B=q*F;g[m>>2]=B;q=y*F;g[e+96>>2]=q;J=B;K=q}q=(u+G)*.5;G=(C+H)*.5;m=e+84|0;H=+G;g[m>>2]=q;g[m+4>>2]=H;m=d[f+9|0]|0;if((c[j+20>>2]|0)<=(m|0)){at(1248,776,103,4440);return 0.0}f=(c[j+16>>2]|0)+(m<<3)|0;H=+g[f>>2];C=+g[f+4>>2];u=(t*J-s*K)*(z+(x*H-r*C)-(v+(t*q-s*G)))+(s*J+t*K)*(A+(r*H+x*C)-(w+(s*q+t*G)));if(u>=0.0){D=u;return+D}G=+(-0.0-K);g[h>>2]=-0.0-J;g[h+4>>2]=G;D=-0.0-u;return+D}return 0.0}function bV(a,b,d,e){a=a|0;b=b|0;d=d|0;e=+e;var f=0.0,h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0.0,v=0.0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0.0,I=0.0,J=0,K=0,L=0,M=0;f=1.0-e;h=f*+g[a+32>>2]+ +g[a+36>>2]*e;i=+S(h);j=+R(h);h=+g[a+8>>2];k=+g[a+12>>2];l=f*+g[a+16>>2]+ +g[a+24>>2]*e-(j*h-i*k);m=f*+g[a+20>>2]+ +g[a+28>>2]*e-(i*h+j*k);k=f*+g[a+68>>2]+ +g[a+72>>2]*e;h=+S(k);n=+R(k);k=+g[a+44>>2];o=+g[a+48>>2];p=f*+g[a+52>>2]+ +g[a+60>>2]*e-(n*k-h*o);q=f*+g[a+56>>2]+ +g[a+64>>2]*e-(h*k+n*o);r=c[a+80>>2]|0;if((r|0)==0){s=a+92|0;o=+g[s>>2];t=a+96|0;k=+g[t>>2];e=j*o+i*k;f=o*(-0.0-i)+j*k;u=-0.0-k;k=n*(-0.0-o)+h*u;v=h*o+n*u;w=a|0;x=c[w>>2]|0;y=c[x+16>>2]|0;z=c[x+20>>2]|0;if((z|0)>1){u=f*+g[y+4>>2]+e*+g[y>>2];x=1;A=0;while(1){o=e*+g[y+(x<<3)>>2]+f*+g[y+(x<<3)+4>>2];B=o>u;C=B?x:A;D=x+1|0;if((D|0)<(z|0)){u=B?o:u;x=D;A=C}else{E=C;break}}}else{E=0}c[b>>2]=E;E=a+4|0;A=c[E>>2]|0;x=c[A+16>>2]|0;z=c[A+20>>2]|0;if((z|0)>1){u=v*+g[x+4>>2]+k*+g[x>>2];A=1;y=0;while(1){f=k*+g[x+(A<<3)>>2]+v*+g[x+(A<<3)+4>>2];C=f>u;D=C?A:y;B=A+1|0;if((B|0)<(z|0)){u=C?f:u;A=B;y=D}else{F=D;break}}}else{F=0}c[d>>2]=F;y=c[w>>2]|0;w=c[b>>2]|0;if((w|0)<=-1){at(1248,776,103,4440);return 0.0}if((c[y+20>>2]|0)<=(w|0)){at(1248,776,103,4440);return 0.0}A=(c[y+16>>2]|0)+(w<<3)|0;u=+g[A>>2];v=+g[A+4>>2];A=c[E>>2]|0;if((F|0)<=-1){at(1248,776,103,4440);return 0.0}if((c[A+20>>2]|0)<=(F|0)){at(1248,776,103,4440);return 0.0}E=(c[A+16>>2]|0)+(F<<3)|0;k=+g[E>>2];f=+g[E+4>>2];G=+g[s>>2]*(p+(n*k-h*f)-(l+(j*u-i*v)))+ +g[t>>2]*(q+(h*k+n*f)-(m+(i*u+j*v)));return+G}else if((r|0)==1){v=+g[a+92>>2];u=+g[a+96>>2];f=j*v-i*u;k=i*v+j*u;u=+g[a+84>>2];v=+g[a+88>>2];e=l+(j*u-i*v);o=m+(i*u+j*v);v=-0.0-k;u=n*(-0.0-f)+h*v;H=h*f+n*v;c[b>>2]=-1;t=a+4|0;s=c[t>>2]|0;E=c[s+16>>2]|0;F=c[s+20>>2]|0;do{if((F|0)>1){v=H*+g[E+4>>2]+u*+g[E>>2];s=1;A=0;while(1){I=u*+g[E+(s<<3)>>2]+H*+g[E+(s<<3)+4>>2];w=I>v;J=w?s:A;y=s+1|0;if((y|0)<(F|0)){v=w?I:v;s=y;A=J}else{break}}c[d>>2]=J;if((J|0)>-1){K=J;break}at(1248,776,103,4440);return 0.0}else{c[d>>2]=0;K=0}}while(0);J=c[t>>2]|0;if((c[J+20>>2]|0)<=(K|0)){at(1248,776,103,4440);return 0.0}t=(c[J+16>>2]|0)+(K<<3)|0;H=+g[t>>2];u=+g[t+4>>2];G=f*(p+(n*H-h*u)-e)+k*(q+(h*H+n*u)-o);return+G}else if((r|0)==2){o=+g[a+92>>2];u=+g[a+96>>2];H=n*o-h*u;k=h*o+n*u;u=+g[a+84>>2];o=+g[a+88>>2];e=p+(n*u-h*o);p=q+(h*u+n*o);o=-0.0-k;n=j*(-0.0-H)+i*o;u=i*H+j*o;c[d>>2]=-1;d=a|0;a=c[d>>2]|0;r=c[a+16>>2]|0;t=c[a+20>>2]|0;do{if((t|0)>1){o=u*+g[r+4>>2]+n*+g[r>>2];a=1;K=0;while(1){h=n*+g[r+(a<<3)>>2]+u*+g[r+(a<<3)+4>>2];J=h>o;L=J?a:K;F=a+1|0;if((F|0)<(t|0)){o=J?h:o;a=F;K=L}else{break}}c[b>>2]=L;if((L|0)>-1){M=L;break}at(1248,776,103,4440);return 0.0}else{c[b>>2]=0;M=0}}while(0);b=c[d>>2]|0;if((c[b+20>>2]|0)<=(M|0)){at(1248,776,103,4440);return 0.0}d=(c[b+16>>2]|0)+(M<<3)|0;u=+g[d>>2];n=+g[d+4>>2];G=H*(l+(j*u-i*n)-e)+k*(m+(i*u+j*n)-p);return+G}else{at(1872,3144,183,4416);return 0.0}return 0.0}function bW(a,b,d,e){a=a|0;b=b|0;d=d|0;e=+e;var f=0.0,h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0.0,v=0.0,w=0.0;f=1.0-e;h=f*+g[a+32>>2]+ +g[a+36>>2]*e;i=+S(h);j=+R(h);h=+g[a+8>>2];k=+g[a+12>>2];l=f*+g[a+16>>2]+ +g[a+24>>2]*e-(j*h-i*k);m=f*+g[a+20>>2]+ +g[a+28>>2]*e-(i*h+j*k);k=f*+g[a+68>>2]+ +g[a+72>>2]*e;h=+S(k);n=+R(k);k=+g[a+44>>2];o=+g[a+48>>2];p=f*+g[a+52>>2]+ +g[a+60>>2]*e-(n*k-h*o);q=f*+g[a+56>>2]+ +g[a+64>>2]*e-(h*k+n*o);r=c[a+80>>2]|0;if((r|0)==0){o=+g[a+92>>2];k=+g[a+96>>2];s=c[a>>2]|0;if((b|0)<=-1){at(1248,776,103,4440);return 0.0}if((c[s+20>>2]|0)<=(b|0)){at(1248,776,103,4440);return 0.0}t=(c[s+16>>2]|0)+(b<<3)|0;e=+g[t>>2];f=+g[t+4>>2];t=c[a+4>>2]|0;if((d|0)<=-1){at(1248,776,103,4440);return 0.0}if((c[t+20>>2]|0)<=(d|0)){at(1248,776,103,4440);return 0.0}s=(c[t+16>>2]|0)+(d<<3)|0;u=+g[s>>2];v=+g[s+4>>2];w=o*(p+(n*u-h*v)-(l+(j*e-i*f)))+k*(q+(h*u+n*v)-(m+(i*e+j*f)));return+w}else if((r|0)==1){f=+g[a+92>>2];e=+g[a+96>>2];v=+g[a+84>>2];u=+g[a+88>>2];s=c[a+4>>2]|0;if((d|0)<=-1){at(1248,776,103,4440);return 0.0}if((c[s+20>>2]|0)<=(d|0)){at(1248,776,103,4440);return 0.0}t=(c[s+16>>2]|0)+(d<<3)|0;k=+g[t>>2];o=+g[t+4>>2];w=(j*f-i*e)*(p+(n*k-h*o)-(l+(j*v-i*u)))+(i*f+j*e)*(q+(h*k+n*o)-(m+(i*v+j*u)));return+w}else if((r|0)==2){u=+g[a+92>>2];v=+g[a+96>>2];o=+g[a+84>>2];k=+g[a+88>>2];r=c[a>>2]|0;if((b|0)<=-1){at(1248,776,103,4440);return 0.0}if((c[r+20>>2]|0)<=(b|0)){at(1248,776,103,4440);return 0.0}a=(c[r+16>>2]|0)+(b<<3)|0;e=+g[a>>2];f=+g[a+4>>2];w=(n*u-h*v)*(l+(j*e-i*f)-(p+(n*o-h*k)))+(h*u+n*v)*(m+(i*e+j*f)-(q+(h*o+n*k)));return+w}else{at(1872,3144,242,4400);return 0.0}return 0.0}function bX(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0,l=0;if((e|0)<=-1){at(736,3056,89,4528)}f=b+16|0;if(((c[f>>2]|0)-1|0)<=(e|0)){at(736,3056,89,4528)}c[d+4>>2]=1;g[d+8>>2]=+g[b+8>>2];h=b+12|0;i=(c[h>>2]|0)+(e<<3)|0;j=d+12|0;k=c[i+4>>2]|0;c[j>>2]=c[i>>2];c[j+4>>2]=k;k=(c[h>>2]|0)+(e+1<<3)|0;j=d+20|0;i=c[k+4>>2]|0;c[j>>2]=c[k>>2];c[j+4>>2]=i;i=d+28|0;if((e|0)>0){j=(c[h>>2]|0)+(e-1<<3)|0;k=i;l=c[j+4>>2]|0;c[k>>2]=c[j>>2];c[k+4>>2]=l;a[d+44|0]=1}else{l=b+20|0;k=i;i=c[l+4>>2]|0;c[k>>2]=c[l>>2];c[k+4>>2]=i;a[d+44|0]=a[b+36|0]&1}i=d+36|0;if(((c[f>>2]|0)-2|0)>(e|0)){f=(c[h>>2]|0)+(e+2<<3)|0;e=i;h=c[f+4>>2]|0;c[e>>2]=c[f>>2];c[e+4>>2]=h;a[d+45|0]=1;return}else{h=b+28|0;e=i;i=c[h+4>>2]|0;c[e>>2]=c[h>>2];c[e+4>>2]=i;a[d+45|0]=a[b+37|0]&1;return}}function bY(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0;f=d;d=b+12|0;g=c[f+4>>2]|0;c[d>>2]=c[f>>2];c[d+4>>2]=g;g=e;e=b+20|0;d=c[g+4>>2]|0;c[e>>2]=c[g>>2];c[e+4>>2]=d;a[b+44|0]=0;a[b+45|0]=0;return}function bZ(b,d){b=b|0;d=d|0;var e=0,f=0,h=0;e=cg(d,48)|0;if((e|0)==0){f=0}else{c[e>>2]=5664;c[e+4>>2]=1;g[e+8>>2]=.009999999776482582;eb(e+28|0,0,18);f=e}c[f+4>>2]=c[b+4>>2];g[f+8>>2]=+g[b+8>>2];e=b+12|0;d=f+12|0;h=c[e+4>>2]|0;c[d>>2]=c[e>>2];c[d+4>>2]=h;h=b+20|0;d=f+20|0;e=c[h+4>>2]|0;c[d>>2]=c[h>>2];c[d+4>>2]=e;e=b+28|0;d=f+28|0;h=c[e+4>>2]|0;c[d>>2]=c[e>>2];c[d+4>>2]=h;h=b+36|0;d=f+36|0;e=c[h+4>>2]|0;c[d>>2]=c[h>>2];c[d+4>>2]=e;a[f+44|0]=a[b+44|0]&1;a[f+45|0]=a[b+45|0]&1;return f|0}function b_(a){a=a|0;return 1}function b$(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function b0(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0.0,h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0;f=+g[d>>2];h=+g[c>>2]-f;i=+g[d+4>>2];j=+g[c+4>>2]-i;k=+g[d+12>>2];l=+g[d+8>>2];m=h*k+j*l;n=-0.0-l;o=k*j+h*n;h=+g[c+8>>2]-f;f=+g[c+12>>2]-i;i=k*h+l*f-m;l=h*n+k*f-o;d=a+12|0;f=+g[d>>2];k=+g[d+4>>2];d=a+20|0;n=+g[d>>2]-f;h=+g[d+4>>2]-k;j=-0.0-n;p=n*n+h*h;q=+P(p);if(q<1.1920928955078125e-7){r=h;s=j}else{t=1.0/q;r=h*t;s=t*j}j=(k-o)*s+(f-m)*r;t=l*s+i*r;if(t==0.0){u=0;return u|0}q=j/t;if(q<0.0){u=0;return u|0}if(+g[c+16>>2]<q|p==0.0){u=0;return u|0}t=(n*(m+i*q-f)+h*(o+l*q-k))/p;if(t<0.0|t>1.0){u=0;return u|0}g[b+8>>2]=q;if(j>0.0){c=b;j=+(-0.0-s);g[c>>2]=-0.0-r;g[c+4>>2]=j;u=1;return u|0}else{c=b;j=+s;g[c>>2]=r;g[c+4>>2]=j;u=1;return u|0}return 0}function b1(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0.0,f=0.0,h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0;e=+g[c+12>>2];f=+g[a+12>>2];h=+g[c+8>>2];i=+g[a+16>>2];j=+g[c>>2];k=j+(e*f-h*i);l=+g[c+4>>2];m=f*h+e*i+l;i=+g[a+20>>2];f=+g[a+24>>2];n=j+(e*i-h*f);j=l+(h*i+e*f);f=+g[a+8>>2];a=b;e=+((m<j?m:j)-f);g[a>>2]=(k<n?k:n)-f;g[a+4>>2]=e;a=b+8|0;e=+(f+(m>j?m:j));g[a>>2]=f+(k>n?k:n);g[a+4>>2]=e;return}function b2(a,b,c){a=a|0;b=b|0;c=+c;var d=0;g[b>>2]=0.0;d=b+4|0;c=+((+g[a+16>>2]+ +g[a+24>>2])*.5);g[d>>2]=(+g[a+12>>2]+ +g[a+20>>2])*.5;g[d+4>>2]=c;g[b+12>>2]=0.0;return}function b3(a){a=a|0;return}function b4(a){a=a|0;d8(a);return}function b5(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=cg(b,152)|0;if((d|0)==0){e=0}else{c[d>>2]=5616;c[d+4>>2]=2;g[d+8>>2]=.009999999776482582;c[d+148>>2]=0;g[d+12>>2]=0.0;g[d+16>>2]=0.0;e=d}c[e+4>>2]=c[a+4>>2];g[e+8>>2]=+g[a+8>>2];d=a+12|0;b=e+12|0;f=c[d+4>>2]|0;c[b>>2]=c[d>>2];c[b+4>>2]=f;f=e+20|0;b=a+20|0;ea(f|0,b|0,64)|0;b=e+84|0;f=a+84|0;ea(b|0,f|0,64)|0;c[e+148>>2]=c[a+148>>2];return e|0}function b6(a,b,d){a=a|0;b=+b;d=+d;var e=0.0,f=0.0;c[a+148>>2]=4;e=-0.0-b;f=-0.0-d;g[a+20>>2]=e;g[a+24>>2]=f;g[a+28>>2]=b;g[a+32>>2]=f;g[a+36>>2]=b;g[a+40>>2]=d;g[a+44>>2]=e;g[a+48>>2]=d;g[a+84>>2]=0.0;g[a+88>>2]=-1.0;g[a+92>>2]=1.0;g[a+96>>2]=0.0;g[a+100>>2]=0.0;g[a+104>>2]=1.0;g[a+108>>2]=-1.0;g[a+112>>2]=0.0;g[a+12>>2]=0.0;g[a+16>>2]=0.0;return}function b7(a){a=a|0;return 1}function b8(a,b,d){a=a|0;b=b|0;d=d|0;var e=0.0,f=0.0,h=0.0,i=0.0,j=0.0,k=0.0,l=0,m=0;e=+g[d>>2]- +g[b>>2];f=+g[d+4>>2]- +g[b+4>>2];h=+g[b+12>>2];i=+g[b+8>>2];j=e*h+f*i;k=h*f+e*(-0.0-i);b=c[a+148>>2]|0;d=0;while(1){if((d|0)>=(b|0)){l=1;m=784;break}if((j- +g[a+20+(d<<3)>>2])*+g[a+84+(d<<3)>>2]+(k- +g[a+20+(d<<3)+4>>2])*+g[a+84+(d<<3)+4>>2]>0.0){l=0;m=785;break}else{d=d+1|0}}if((m|0)==785){return l|0}else if((m|0)==784){return l|0}return 0}function b9(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0.0,u=0.0,v=0,w=0.0,x=0,y=0.0;h=+g[e>>2];i=+g[d>>2]-h;j=+g[e+4>>2];k=+g[d+4>>2]-j;f=e+12|0;l=+g[f>>2];m=e+8|0;n=+g[m>>2];o=i*l+k*n;p=-0.0-n;q=l*k+i*p;i=+g[d+8>>2]-h;h=+g[d+12>>2]-j;j=l*i+n*h-o;n=i*p+l*h-q;h=+g[d+16>>2];d=c[a+148>>2]|0;l=0.0;e=0;r=-1;p=h;L992:while(1){if((e|0)>=(d|0)){s=797;break}i=+g[a+84+(e<<3)>>2];k=+g[a+84+(e<<3)+4>>2];t=(+g[a+20+(e<<3)>>2]-o)*i+(+g[a+20+(e<<3)+4>>2]-q)*k;u=j*i+n*k;L995:do{if(u==0.0){if(t<0.0){v=0;s=803;break L992}else{w=l;x=r;y=p}}else{do{if(u<0.0){if(t>=l*u){break}w=t/u;x=e;y=p;break L995}}while(0);if(u<=0.0){w=l;x=r;y=p;break}if(t>=p*u){w=l;x=r;y=p;break}w=l;x=r;y=t/u}}while(0);if(y<w){v=0;s=802;break}else{l=w;e=e+1|0;r=x;p=y}}if((s|0)==797){if(l<0.0|l>h){at(1200,2912,249,4472);return 0}if((r|0)<=-1){v=0;return v|0}g[b+8>>2]=l;l=+g[f>>2];h=+g[a+84+(r<<3)>>2];y=+g[m>>2];p=+g[a+84+(r<<3)+4>>2];r=b;w=+(h*y+l*p);g[r>>2]=l*h-y*p;g[r+4>>2]=w;v=1;return v|0}else if((s|0)==803){return v|0}else if((s|0)==802){return v|0}return 0}function ca(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0.0,h=0.0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0,w=0.0,x=0.0,y=0.0,z=0.0;f=+g[d+12>>2];h=+g[a+20>>2];i=+g[d+8>>2];j=+g[a+24>>2];k=+g[d>>2];l=k+(f*h-i*j);m=+g[d+4>>2];n=h*i+f*j+m;d=c[a+148>>2]|0;if((d|0)>1){j=n;h=l;o=n;p=l;e=1;while(1){q=+g[a+20+(e<<3)>>2];r=+g[a+20+(e<<3)+4>>2];s=k+(f*q-i*r);t=q*i+f*r+m;r=h<s?h:s;q=j<t?j:t;u=p>s?p:s;s=o>t?o:t;v=e+1|0;if((v|0)<(d|0)){j=q;h=r;o=s;p=u;e=v}else{w=q;x=r;y=s;z=u;break}}}else{w=n;x=l;y=n;z=l}l=+g[a+8>>2];a=b;n=+(w-l);g[a>>2]=x-l;g[a+4>>2]=n;a=b+8|0;n=+(y+l);g[a>>2]=z+l;g[a+4>>2]=n;return}function cb(a,b,d){a=a|0;b=b|0;d=+d;var e=0,f=0.0,h=0.0,i=0,j=0.0,k=0.0,l=0,m=0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0;e=c[a+148>>2]|0;if((e|0)>2){f=0.0;h=0.0;i=0}else{at(712,2912,306,4480)}do{h=h+ +g[a+20+(i<<3)>>2];f=f+ +g[a+20+(i<<3)+4>>2];i=i+1|0;}while((i|0)<(e|0));j=1.0/+(e|0);k=h*j;h=f*j;i=a+20|0;l=a+24|0;j=0.0;f=0.0;m=0;n=0.0;o=0.0;do{p=+g[a+20+(m<<3)>>2]-k;q=+g[a+20+(m<<3)+4>>2]-h;m=m+1|0;r=(m|0)<(e|0);if(r){s=a+20+(m<<3)|0;t=a+20+(m<<3)+4|0}else{s=i;t=l}u=+g[s>>2]-k;v=+g[t>>2]-h;w=p*v-q*u;x=w*.5;o=o+x;y=x*.3333333432674408;f=f+(p+u)*y;j=j+(q+v)*y;n=n+w*.0833333358168602*(u*u+(p*p+p*u)+(v*v+(q*q+q*v)))}while(r);v=o*d;g[b>>2]=v;if(o>1.1920928955078125e-7){q=1.0/o;o=f*q;f=j*q;q=k+o;k=h+f;t=b+4|0;h=+k;g[t>>2]=q;g[t+4>>2]=h;g[b+12>>2]=n*d+v*(q*q+k*k-(o*o+f*f));return}else{at(464,2912,352,4480)}}function cc(a){a=a|0;return}function cd(a){a=a|0;d8(a);return}function ce(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0;d=b+8|0;c[d>>2]=128;c[b+4>>2]=0;e=ci(1024)|0;c[b>>2]=e;eb(e|0,0,c[d>>2]<<3|0);eb(b+12|0,0,56);if((a[7224]&1)==0){f=0;g=1}else{return}while(1){if((f|0)>=14){h=823;break}if((g|0)>(c[6400+(f<<2)>>2]|0)){b=f+1|0;a[7232+g|0]=b&255;i=b}else{a[7232+g|0]=f&255;i=f}b=g+1|0;if((b|0)<641){f=i;g=b}else{break}}if((h|0)==823){at(280,2800,73,4952)}a[7224]=1;return}function cf(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0;b=a+4|0;d=a|0;a=c[d>>2]|0;if((c[b>>2]|0)>0){e=0;f=a}else{g=a;h=g;cj(h);return}while(1){cj(c[f+(e<<3)+4>>2]|0);a=e+1|0;i=c[d>>2]|0;if((a|0)<(c[b>>2]|0)){e=a;f=i}else{g=i;break}}h=g;cj(h);return}function cg(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;if((d|0)==0){e=0;return e|0}if((d|0)<=0){at(1680,2800,104,4976);return 0}if((d|0)>640){e=ci(d)|0;return e|0}f=a[7232+d|0]|0;d=f&255;if((f&255)>>>0>=14>>>0){at(1136,2800,112,4976);return 0}f=b+12+(d<<2)|0;g=c[f>>2]|0;if((g|0)!=0){c[f>>2]=c[g>>2];e=g;return e|0}g=b+4|0;h=c[g>>2]|0;i=b+8|0;j=b|0;if((h|0)==(c[i>>2]|0)){b=c[j>>2]|0;k=h+128|0;c[i>>2]=k;i=ci(k<<3)|0;c[j>>2]=i;k=b;b=c[g>>2]<<3;ea(i|0,k|0,b)|0;eb((c[j>>2]|0)+(c[g>>2]<<3)|0,0,1024);cj(k);l=c[g>>2]|0}else{l=h}h=c[j>>2]|0;j=ci(16384)|0;k=h+(l<<3)+4|0;c[k>>2]=j;b=c[6400+(d<<2)>>2]|0;c[h+(l<<3)>>2]=b;l=16384/(b|0)|0;if(($(l,b)|0)>=16385){at(672,2800,140,4976);return 0}h=l-1|0;if((h|0)>0){l=0;d=j;while(1){i=l+1|0;c[d+($(l,b)|0)>>2]=d+($(i,b)|0);m=c[k>>2]|0;if((i|0)<(h|0)){l=i;d=m}else{n=m;break}}}else{n=j}c[n+($(h,b)|0)>>2]=0;c[f>>2]=c[c[k>>2]>>2];c[g>>2]=(c[g>>2]|0)+1;e=c[k>>2]|0;return e|0}function ch(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;if((e|0)==0){return}if((e|0)<=0){at(1680,2800,164,4992)}if((e|0)>640){cj(d);return}f=a[7232+e|0]|0;if((f&255)>>>0>=14>>>0){at(1136,2800,173,4992)}e=b+12+((f&255)<<2)|0;c[d>>2]=c[e>>2];c[e>>2]=d;return}function ci(a){a=a|0;return d6(a)|0}function cj(a){a=a|0;d7(a);return}function ck(a){a=a|0;c[a+102400>>2]=0;c[a+102404>>2]=0;c[a+102408>>2]=0;c[a+102796>>2]=0;return}function cl(a){a=a|0;if((c[a+102400>>2]|0)!=0){at(168,2704,32,4880)}if((c[a+102796>>2]|0)==0){return}else{at(1520,2704,33,4880)}}function cm(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=b+102796|0;f=c[e>>2]|0;if((f|0)>=32){at(1096,2704,38,4904);return 0}g=b+102412+(f*12|0)|0;c[b+102412+(f*12|0)+4>>2]=d;h=b+102400|0;i=c[h>>2]|0;if((i+d|0)>102400){c[g>>2]=ci(d)|0;a[b+102412+(f*12|0)+8|0]=1}else{c[g>>2]=b+i;a[b+102412+(f*12|0)+8|0]=0;c[h>>2]=(c[h>>2]|0)+d}h=b+102404|0;f=(c[h>>2]|0)+d|0;c[h>>2]=f;h=b+102408|0;b=c[h>>2]|0;c[h>>2]=(b|0)>(f|0)?b:f;c[e>>2]=(c[e>>2]|0)+1;return c[g>>2]|0}function cn(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=b+102796|0;f=c[e>>2]|0;if((f|0)<=0){at(648,2704,63,4920)}g=f-1|0;if((c[b+102412+(g*12|0)>>2]|0)!=(d|0)){at(440,2704,65,4920)}if((a[b+102412+(g*12|0)+8|0]&1)==0){h=b+102412+(g*12|0)+4|0;i=b+102400|0;c[i>>2]=(c[i>>2]|0)-(c[h>>2]|0);j=f;k=h}else{cj(d);j=c[e>>2]|0;k=b+102412+(g*12|0)+4|0}g=b+102404|0;c[g>>2]=(c[g>>2]|0)-(c[k>>2]|0);c[e>>2]=j-1;return}function co(a){a=a|0;return}function cp(a){a=a|0;return}function cq(a){a=a|0;return+0.0}function cr(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,i=0.0,j=0,k=0,l=0,m=0,n=0,o=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;h=e+4|0;i=+g[h>>2];if(!(i==i&!(aU=0.0,aU!=aU)&i>-p&i<p)){at(56,2664,27,4672)}i=+g[e+8>>2];if(!(i==i&!(aU=0.0,aU!=aU)&i>-p&i<p)){at(56,2664,27,4672)}j=e+16|0;i=+g[j>>2];if(!(i==i&!(aU=0.0,aU!=aU)&i>-p&i<p)){at(1408,2664,28,4672)}i=+g[e+20>>2];if(!(i==i&!(aU=0.0,aU!=aU)&i>-p&i<p)){at(1408,2664,28,4672)}k=e+12|0;i=+g[k>>2];if(!(i==i&!(aU=0.0,aU!=aU)&i>-p&i<p)){at(1072,2664,29,4672)}l=e+24|0;i=+g[l>>2];if(!(i==i&!(aU=0.0,aU!=aU)&i>-p&i<p)){at(616,2664,30,4672)}m=e+32|0;i=+g[m>>2];if(i<0.0|i==i&!(aU=0.0,aU!=aU)&i>-p&i<p^1){at(376,2664,31,4672)}n=e+28|0;i=+g[n>>2];if(i<0.0|i==i&!(aU=0.0,aU!=aU)&i>-p&i<p^1){at(216,2664,32,4672)}o=d+4|0;b[o>>1]=0;if((a[e+39|0]&1)==0){q=0}else{b[o>>1]=8;q=8}if((a[e+38|0]&1)==0){r=q}else{s=q|16;b[o>>1]=s;r=s}if((a[e+36|0]&1)==0){t=r}else{s=r|4;b[o>>1]=s;t=s}if((a[e+37|0]&1)==0){u=t}else{s=t|2;b[o>>1]=s;u=s}if((a[e+40|0]&1)!=0){b[o>>1]=u|32}c[d+88>>2]=f;f=h;h=d+12|0;u=c[f>>2]|0;o=c[f+4>>2]|0;c[h>>2]=u;c[h+4>>2]=o;i=+g[k>>2];g[d+20>>2]=+S(i);g[d+24>>2]=+R(i);g[d+28>>2]=0.0;g[d+32>>2]=0.0;h=d+36|0;c[h>>2]=u;c[h+4>>2]=o;h=d+44|0;c[h>>2]=u;c[h+4>>2]=o;g[d+52>>2]=+g[k>>2];g[d+56>>2]=+g[k>>2];g[d+60>>2]=0.0;c[d+108>>2]=0;c[d+112>>2]=0;c[d+92>>2]=0;c[d+96>>2]=0;k=j;j=d+64|0;o=c[k+4>>2]|0;c[j>>2]=c[k>>2];c[j+4>>2]=o;g[d+72>>2]=+g[l>>2];g[d+132>>2]=+g[n>>2];g[d+136>>2]=+g[m>>2];g[d+140>>2]=+g[e+48>>2];g[d+76>>2]=0.0;g[d+80>>2]=0.0;g[d+84>>2]=0.0;g[d+144>>2]=0.0;m=c[e>>2]|0;c[d>>2]=m;n=d+116|0;if((m|0)==2){g[n>>2]=1.0;g[d+120>>2]=1.0;v=d+124|0;g[v>>2]=0.0;w=d+128|0;g[w>>2]=0.0;x=e+44|0;y=c[x>>2]|0;z=d+148|0;c[z>>2]=y;A=d+100|0;c[A>>2]=0;B=d+104|0;c[B>>2]=0;return}else{g[n>>2]=0.0;g[d+120>>2]=0.0;v=d+124|0;g[v>>2]=0.0;w=d+128|0;g[w>>2]=0.0;x=e+44|0;y=c[x>>2]|0;z=d+148|0;c[z>>2]=y;A=d+100|0;c[A>>2]=0;B=d+104|0;c[B>>2]=0;return}}function cs(a){a=a|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0.0,A=0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0;d=i;i=i+16|0;e=d|0;f=a+116|0;h=a+120|0;j=a+124|0;k=a+128|0;l=a+28|0;g[l>>2]=0.0;g[a+32>>2]=0.0;eb(f|0,0,16);m=c[a>>2]|0;if((m|0)==2){n=6544;o=+g[n>>2];p=+g[n+4>>2];n=c[a+100>>2]|0;do{if((n|0)==0){q=0.0;r=o;s=p;t=939}else{u=e|0;v=e+4|0;w=e+8|0;x=e+12|0;y=p;z=o;A=n;B=0.0;C=0.0;while(1){D=+g[A>>2];if(D==0.0){E=z;F=y;G=B;H=C}else{I=c[A+12>>2]|0;a0[c[(c[I>>2]|0)+28>>2]&7](I,e,D);D=+g[u>>2];J=D+ +g[f>>2];g[f>>2]=J;K=z+D*+g[v>>2];L=y+D*+g[w>>2];D=+g[x>>2]+ +g[j>>2];g[j>>2]=D;E=K;F=L;G=J;H=D}I=c[A+4>>2]|0;if((I|0)==0){break}else{y=F;z=E;A=I;B=G;C=H}}if(G<=0.0){q=H;r=E;s=F;t=939;break}C=1.0/G;g[h>>2]=C;M=E*C;N=F*C;O=G;P=H}}while(0);if((t|0)==939){g[f>>2]=1.0;g[h>>2]=1.0;M=r;N=s;O=1.0;P=q}do{if(P>0.0){if((b[a+4>>1]&16)!=0){t=945;break}q=P-(N*N+M*M)*O;g[j>>2]=q;if(q>0.0){Q=1.0/q;break}else{at(3224,2664,319,4680)}}else{t=945}}while(0);if((t|0)==945){g[j>>2]=0.0;Q=0.0}g[k>>2]=Q;k=a+44|0;Q=+g[k>>2];O=+g[k+4>>2];j=l;P=+N;g[j>>2]=M;g[j+4>>2]=P;P=+g[a+24>>2];q=+g[a+20>>2];s=+g[a+12>>2]+(P*M-q*N);r=M*q+P*N+ +g[a+16>>2];N=+s;P=+r;g[k>>2]=N;g[k+4>>2]=P;k=a+36|0;g[k>>2]=N;g[k+4>>2]=P;P=+g[a+72>>2];k=a+64|0;g[k>>2]=+g[k>>2]+(r-O)*(-0.0-P);k=a+68|0;g[k>>2]=P*(s-Q)+ +g[k>>2];i=d;return}else if((m|0)==0|(m|0)==1){m=a+12|0;k=a+36|0;j=c[m>>2]|0;l=c[m+4>>2]|0;c[k>>2]=j;c[k+4>>2]=l;k=a+44|0;c[k>>2]=j;c[k+4>>2]=l;g[a+52>>2]=+g[a+56>>2];i=d;return}else{at(3896,2664,284,4680)}}function ct(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0;b=i;i=i+16|0;d=b|0;e=d|0;f=d;h=d+8|0;j=+g[a+52>>2];k=+S(j);g[h>>2]=k;l=+R(j);g[h+4>>2]=l;j=+g[a+28>>2];m=+g[a+32>>2];n=+(+g[a+40>>2]-(j*k+l*m));g[e>>2]=+g[a+36>>2]-(l*j-k*m);g[e+4>>2]=n;e=(c[a+88>>2]|0)+102872|0;h=c[a+100>>2]|0;if((h|0)==0){i=b;return}d=a+12|0;a=h;do{cS(a,e,f,d);a=c[a+4>>2]|0;}while((a|0)!=0);i=b;return}function cu(a,d){a=a|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;e=a+88|0;f=c[e>>2]|0;if((c[f+102868>>2]&2|0)!=0){at(136,2664,153,4696);return 0}h=f|0;f=cg(h,44)|0;if((f|0)==0){i=0}else{j=f;cO(j);i=j}cP(i,h,a,d);if((b[a+4>>1]&32)!=0){cR(i,(c[e>>2]|0)+102872|0,a+12|0)}d=a+100|0;c[i+4>>2]=c[d>>2];c[d>>2]=i;d=a+104|0;c[d>>2]=(c[d>>2]|0)+1;c[i+8>>2]=a;if(+g[i>>2]<=0.0){k=c[e>>2]|0;l=k+102868|0;m=c[l>>2]|0;n=m|1;c[l>>2]=n;return i|0}cs(a);k=c[e>>2]|0;l=k+102868|0;m=c[l>>2]|0;n=m|1;c[l>>2]=n;return i|0}function cv(d,e,f){d=d|0;e=e|0;f=+f;var h=0,j=0;h=i;i=i+32|0;j=h|0;b[j+22>>1]=1;b[j+24>>1]=-1;b[j+26>>1]=0;c[j+4>>2]=0;g[j+8>>2]=.20000000298023224;g[j+12>>2]=0.0;a[j+20|0]=0;c[j>>2]=e;g[j+16>>2]=f;e=cu(d,j)|0;i=h;return e|0}function cw(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0;do{if((c[b>>2]|0)!=2){if((c[d>>2]|0)==2){break}else{e=0}return e|0}}while(0);f=c[b+108>>2]|0;if((f|0)==0){e=1;return e|0}else{g=f}while(1){if((c[g>>2]|0)==(d|0)){if((a[(c[g+4>>2]|0)+61|0]&1)==0){e=0;h=975;break}}f=c[g+12>>2]|0;if((f|0)==0){e=1;h=977;break}else{g=f}}if((h|0)==977){return e|0}else if((h|0)==975){return e|0}return 0}function cx(a){a=a|0;return}function cy(a){a=a|0;bp(a|0);c[a+60>>2]=0;c[a+64>>2]=0;c[a+68>>2]=16;c[a+72>>2]=8;c[a+76>>2]=0;return}function cz(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;d=c[(c[b+48>>2]|0)+8>>2]|0;e=c[(c[b+52>>2]|0)+8>>2]|0;f=c[a+72>>2]|0;do{if((f|0)!=0){if((c[b+4>>2]&2|0)==0){break}aY[c[(c[f>>2]|0)+12>>2]&31](f,b)}}while(0);f=b+8|0;g=c[f>>2]|0;h=b+12|0;if((g|0)!=0){c[g+12>>2]=c[h>>2]}g=c[h>>2]|0;if((g|0)!=0){c[g+8>>2]=c[f>>2]}f=a+60|0;if((c[f>>2]|0)==(b|0)){c[f>>2]=c[h>>2]}h=b+24|0;f=c[h>>2]|0;g=b+28|0;if((f|0)!=0){c[f+12>>2]=c[g>>2]}f=c[g>>2]|0;if((f|0)!=0){c[f+8>>2]=c[h>>2]}h=d+112|0;if((b+16|0)==(c[h>>2]|0)){c[h>>2]=c[g>>2]}g=b+40|0;h=c[g>>2]|0;d=b+44|0;if((h|0)!=0){c[h+12>>2]=c[d>>2]}h=c[d>>2]|0;if((h|0)!=0){c[h+8>>2]=c[g>>2]}g=e+112|0;if((b+32|0)!=(c[g>>2]|0)){i=a+76|0;j=c[i>>2]|0;dl(b,j);k=a+64|0;l=c[k>>2]|0;m=l-1|0;c[k>>2]=m;return}c[g>>2]=c[d>>2];i=a+76|0;j=c[i>>2]|0;dl(b,j);k=a+64|0;l=c[k>>2]|0;m=l-1|0;c[k>>2]=m;return}function cA(a){a=a|0;var d=0,e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;d=c[a+60>>2]|0;if((d|0)==0){return}e=a+12|0;f=a+4|0;h=a+72|0;i=a+68|0;j=d;L1283:while(1){d=c[j+48>>2]|0;k=c[j+52>>2]|0;l=c[j+56>>2]|0;m=c[j+60>>2]|0;n=c[d+8>>2]|0;o=c[k+8>>2]|0;p=j+4|0;L1285:do{if((c[p>>2]&8|0)==0){q=1015}else{if(!(cw(o,n)|0)){r=c[j+12>>2]|0;cz(a,j);s=r;break}r=c[i>>2]|0;do{if((r|0)!=0){if(aZ[c[(c[r>>2]|0)+8>>2]&15](r,d,k)|0){break}t=c[j+12>>2]|0;cz(a,j);s=t;break L1285}}while(0);c[p>>2]=c[p>>2]&-9;q=1015}}while(0);do{if((q|0)==1015){q=0;if((b[n+4>>1]&2)==0){u=0}else{u=(c[n>>2]|0)!=0|0}if((b[o+4>>1]&2)==0){v=1}else{v=(c[o>>2]|0)==0}if((u|0)==0&v){s=c[j+12>>2]|0;break}p=c[(c[d+24>>2]|0)+(l*28|0)+24>>2]|0;r=c[(c[k+24>>2]|0)+(m*28|0)+24>>2]|0;if((p|0)<=-1){q=1032;break L1283}t=c[e>>2]|0;if((t|0)<=(p|0)){q=1033;break L1283}w=c[f>>2]|0;if(!((r|0)>-1&(t|0)>(r|0))){q=1025;break L1283}if(+g[w+(r*36|0)>>2]- +g[w+(p*36|0)+8>>2]>0.0|+g[w+(r*36|0)+4>>2]- +g[w+(p*36|0)+12>>2]>0.0|+g[w+(p*36|0)>>2]- +g[w+(r*36|0)+8>>2]>0.0|+g[w+(p*36|0)+4>>2]- +g[w+(r*36|0)+12>>2]>0.0){r=c[j+12>>2]|0;cz(a,j);s=r;break}else{dn(j,c[h>>2]|0);s=c[j+12>>2]|0;break}}}while(0);if((s|0)==0){q=1030;break}else{j=s}}if((q|0)==1032){at(4064,2560,159,4512)}else if((q|0)==1033){at(4064,2560,159,4512)}else if((q|0)==1025){at(4064,2560,159,4512)}else if((q|0)==1030){return}}function cB(a){a=a|0;cC(a|0,a);return}function cC(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;d=i;i=i+8|0;e=d|0;f=a+52|0;c[f>>2]=0;g=a+40|0;h=c[g>>2]|0;do{if((h|0)>0){j=a+32|0;k=a+56|0;l=a|0;m=a+12|0;n=a+4|0;o=0;p=h;while(1){q=c[(c[j>>2]|0)+(o<<2)>>2]|0;c[k>>2]=q;if((q|0)==-1){r=p}else{if((q|0)<=-1){s=1056;break}if((c[m>>2]|0)<=(q|0)){s=1057;break}cE(l,a,(c[n>>2]|0)+(q*36|0)|0);r=c[g>>2]|0}q=o+1|0;if((q|0)<(r|0)){o=q;p=r}else{s=1043;break}}if((s|0)==1056){at(4064,2560,159,4512)}else if((s|0)==1057){at(4064,2560,159,4512)}else if((s|0)==1043){t=c[f>>2]|0;break}}else{t=0}}while(0);c[g>>2]=0;g=a+44|0;r=c[g>>2]|0;c[e>>2]=4;cG(r,r+(t*12|0)|0,e);if((c[f>>2]|0)<=0){i=d;return}e=a+12|0;t=a+4|0;a=0;L1336:while(1){r=c[g>>2]|0;h=r+(a*12|0)|0;p=c[h>>2]|0;if((p|0)<=-1){s=1059;break}o=c[e>>2]|0;if((o|0)<=(p|0)){s=1058;break}n=c[t>>2]|0;l=r+(a*12|0)+4|0;r=c[l>>2]|0;if(!((r|0)>-1&(o|0)>(r|0))){s=1050;break}cD(b,c[n+(p*36|0)+16>>2]|0,c[n+(r*36|0)+16>>2]|0);r=c[f>>2]|0;n=a;while(1){p=n+1|0;if((p|0)>=(r|0)){s=1060;break L1336}o=c[g>>2]|0;if((c[o+(p*12|0)>>2]|0)!=(c[h>>2]|0)){a=p;continue L1336}if((c[o+(p*12|0)+4>>2]|0)==(c[l>>2]|0)){n=p}else{a=p;continue L1336}}}if((s|0)==1060){i=d;return}else if((s|0)==1050){at(4064,2560,153,4496)}else if((s|0)==1058){at(4064,2560,153,4496)}else if((s|0)==1059){at(4064,2560,153,4496)}}function cD(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=c[d+16>>2]|0;h=c[e+16>>2]|0;i=c[d+20>>2]|0;d=c[e+20>>2]|0;e=c[f+8>>2]|0;j=c[h+8>>2]|0;if((e|0)==(j|0)){return}k=c[j+112>>2]|0;L1354:do{if((k|0)!=0){l=k;while(1){if((c[l>>2]|0)==(e|0)){m=c[l+4>>2]|0;n=c[m+48>>2]|0;o=c[m+52>>2]|0;p=c[m+56>>2]|0;q=c[m+60>>2]|0;if((n|0)==(f|0)&(o|0)==(h|0)&(p|0)==(i|0)&(q|0)==(d|0)){r=1085;break}if((n|0)==(h|0)&(o|0)==(f|0)&(p|0)==(d|0)&(q|0)==(i|0)){r=1089;break}}l=c[l+12>>2]|0;if((l|0)==0){break L1354}}if((r|0)==1085){return}else if((r|0)==1089){return}}}while(0);if(!(cw(j,e)|0)){return}e=c[a+68>>2]|0;do{if((e|0)!=0){if(aZ[c[(c[e>>2]|0)+8>>2]&15](e,f,h)|0){break}return}}while(0);e=dk(f,i,h,d,c[a+76>>2]|0)|0;if((e|0)==0){return}d=c[(c[e+48>>2]|0)+8>>2]|0;h=c[(c[e+52>>2]|0)+8>>2]|0;c[e+8>>2]=0;i=a+60|0;c[e+12>>2]=c[i>>2];f=c[i>>2]|0;if((f|0)!=0){c[f+8>>2]=e}c[i>>2]=e;i=e+16|0;c[e+20>>2]=e;c[i>>2]=h;c[e+24>>2]=0;f=d+112|0;c[e+28>>2]=c[f>>2];j=c[f>>2]|0;if((j|0)!=0){c[j+8>>2]=i}c[f>>2]=i;i=e+32|0;c[e+36>>2]=e;c[i>>2]=d;c[e+40>>2]=0;f=h+112|0;c[e+44>>2]=c[f>>2];e=c[f>>2]|0;if((e|0)!=0){c[e+8>>2]=i}c[f>>2]=i;i=d+4|0;f=b[i>>1]|0;if((f&2)==0){b[i>>1]=f|2;g[d+144>>2]=0.0}d=h+4|0;f=b[d>>1]|0;if((f&2)==0){b[d>>1]=f|2;g[h+144>>2]=0.0}h=a+64|0;c[h>>2]=(c[h>>2]|0)+1;return}function cE(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;e=i;i=i+1040|0;f=e|0;h=f+4|0;j=f|0;c[j>>2]=h;k=f+1028|0;c[k>>2]=0;l=f+1032|0;c[l>>2]=256;c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[a>>2];f=(c[k>>2]|0)+1|0;c[k>>2]=f;L1392:do{if((f|0)>0){m=a+4|0;n=d|0;o=d+4|0;p=d+8|0;q=d+12|0;r=f;while(1){s=r-1|0;c[k>>2]=s;t=c[j>>2]|0;u=c[t+(s<<2)>>2]|0;do{if((u|0)==-1){v=s}else{w=c[m>>2]|0;if(+g[n>>2]- +g[w+(u*36|0)+8>>2]>0.0|+g[o>>2]- +g[w+(u*36|0)+12>>2]>0.0|+g[w+(u*36|0)>>2]- +g[p>>2]>0.0|+g[w+(u*36|0)+4>>2]- +g[q>>2]>0.0){v=s;break}x=w+(u*36|0)+24|0;if((c[x>>2]|0)==-1){if(!(bt(b,u)|0)){break L1392}v=c[k>>2]|0;break}do{if((s|0)==(c[l>>2]|0)){c[l>>2]=s<<1;y=ci(s<<3)|0;c[j>>2]=y;z=t;A=c[k>>2]<<2;ea(y|0,z|0,A)|0;if((t|0)==(h|0)){break}cj(z)}}while(0);c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[x>>2];z=(c[k>>2]|0)+1|0;c[k>>2]=z;A=w+(u*36|0)+28|0;do{if((z|0)==(c[l>>2]|0)){y=c[j>>2]|0;c[l>>2]=z<<1;B=ci(z<<3)|0;c[j>>2]=B;C=y;D=c[k>>2]<<2;ea(B|0,C|0,D)|0;if((y|0)==(h|0)){break}cj(C)}}while(0);c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[A>>2];z=(c[k>>2]|0)+1|0;c[k>>2]=z;v=z}}while(0);if((v|0)>0){r=v}else{break}}}}while(0);v=c[j>>2]|0;if((v|0)==(h|0)){i=e;return}cj(v);c[j>>2]=0;i=e;return}function cF(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=c[a>>2]|0;e=c[b>>2]|0;if((d|0)<(e|0)){f=1;return f|0}if((d|0)!=(e|0)){f=0;return f|0}f=(c[a+4>>2]|0)<(c[b+4>>2]|0);return f|0}function cG(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0;e=i;i=i+480|0;f=e|0;g=e+16|0;h=e+32|0;j=e+48|0;k=e+64|0;l=e+224|0;m=e+240|0;n=e+256|0;o=e+272|0;p=e+288|0;q=e+304|0;r=e+320|0;s=e+336|0;t=e+352|0;u=e+368|0;v=e+464|0;w=e+160|0;x=e+176|0;y=e+192|0;z=e+208|0;A=e+384|0;B=e+400|0;C=e+432|0;D=e+448|0;E=e+416|0;F=e+80|0;G=e+96|0;H=e+112|0;I=e+128|0;J=e+144|0;K=a;a=b;L1429:while(1){b=a;L=a-12|0;M=L;N=K;L1431:while(1){O=N;P=b-O|0;switch((P|0)/12|0|0){case 5:{Q=1140;break L1429;break};case 2:{Q=1129;break L1429;break};case 0:case 1:{Q=1213;break L1429;break};case 3:{Q=1131;break L1429;break};case 4:{Q=1139;break L1429;break};default:{}}if((P|0)<372){Q=1146;break L1429}R=(P|0)/24|0;S=N+(R*12|0)|0;do{if((P|0)>11988){T=(P|0)/48|0;U=N+(T*12|0)|0;V=N+((T+R|0)*12|0)|0;T=cH(N,U,S,V,d)|0;if(!(a2[c[d>>2]&15](L,V)|0)){W=T;break}X=V;c[z>>2]=c[X>>2];c[z+4>>2]=c[X+4>>2];c[z+8>>2]=c[X+8>>2];c[X>>2]=c[M>>2];c[X+4>>2]=c[M+4>>2];c[X+8>>2]=c[M+8>>2];c[M>>2]=c[z>>2];c[M+4>>2]=c[z+4>>2];c[M+8>>2]=c[z+8>>2];if(!(a2[c[d>>2]&15](V,S)|0)){W=T+1|0;break}V=S;c[x>>2]=c[V>>2];c[x+4>>2]=c[V+4>>2];c[x+8>>2]=c[V+8>>2];c[V>>2]=c[X>>2];c[V+4>>2]=c[X+4>>2];c[V+8>>2]=c[X+8>>2];c[X>>2]=c[x>>2];c[X+4>>2]=c[x+4>>2];c[X+8>>2]=c[x+8>>2];if(!(a2[c[d>>2]&15](S,U)|0)){W=T+2|0;break}X=U;c[w>>2]=c[X>>2];c[w+4>>2]=c[X+4>>2];c[w+8>>2]=c[X+8>>2];c[X>>2]=c[V>>2];c[X+4>>2]=c[V+4>>2];c[X+8>>2]=c[V+8>>2];c[V>>2]=c[w>>2];c[V+4>>2]=c[w+4>>2];c[V+8>>2]=c[w+8>>2];if(!(a2[c[d>>2]&15](U,N)|0)){W=T+3|0;break}U=N;c[y>>2]=c[U>>2];c[y+4>>2]=c[U+4>>2];c[y+8>>2]=c[U+8>>2];c[U>>2]=c[X>>2];c[U+4>>2]=c[X+4>>2];c[U+8>>2]=c[X+8>>2];c[X>>2]=c[y>>2];c[X+4>>2]=c[y+4>>2];c[X+8>>2]=c[y+8>>2];W=T+4|0}else{T=a2[c[d>>2]&15](S,N)|0;X=a2[c[d>>2]&15](L,S)|0;if(!T){if(!X){W=0;break}T=S;c[J>>2]=c[T>>2];c[J+4>>2]=c[T+4>>2];c[J+8>>2]=c[T+8>>2];c[T>>2]=c[M>>2];c[T+4>>2]=c[M+4>>2];c[T+8>>2]=c[M+8>>2];c[M>>2]=c[J>>2];c[M+4>>2]=c[J+4>>2];c[M+8>>2]=c[J+8>>2];if(!(a2[c[d>>2]&15](S,N)|0)){W=1;break}U=N;c[H>>2]=c[U>>2];c[H+4>>2]=c[U+4>>2];c[H+8>>2]=c[U+8>>2];c[U>>2]=c[T>>2];c[U+4>>2]=c[T+4>>2];c[U+8>>2]=c[T+8>>2];c[T>>2]=c[H>>2];c[T+4>>2]=c[H+4>>2];c[T+8>>2]=c[H+8>>2];W=2;break}T=N;if(X){c[F>>2]=c[T>>2];c[F+4>>2]=c[T+4>>2];c[F+8>>2]=c[T+8>>2];c[T>>2]=c[M>>2];c[T+4>>2]=c[M+4>>2];c[T+8>>2]=c[M+8>>2];c[M>>2]=c[F>>2];c[M+4>>2]=c[F+4>>2];c[M+8>>2]=c[F+8>>2];W=1;break}c[G>>2]=c[T>>2];c[G+4>>2]=c[T+4>>2];c[G+8>>2]=c[T+8>>2];X=S;c[T>>2]=c[X>>2];c[T+4>>2]=c[X+4>>2];c[T+8>>2]=c[X+8>>2];c[X>>2]=c[G>>2];c[X+4>>2]=c[G+4>>2];c[X+8>>2]=c[G+8>>2];if(!(a2[c[d>>2]&15](L,S)|0)){W=1;break}c[I>>2]=c[X>>2];c[I+4>>2]=c[X+4>>2];c[I+8>>2]=c[X+8>>2];c[X>>2]=c[M>>2];c[X+4>>2]=c[M+4>>2];c[X+8>>2]=c[M+8>>2];c[M>>2]=c[I>>2];c[M+4>>2]=c[I+4>>2];c[M+8>>2]=c[I+8>>2];W=2}}while(0);do{if(a2[c[d>>2]&15](N,S)|0){Y=L;Z=W}else{R=L;while(1){_=R-12|0;if((N|0)==(_|0)){break}if(a2[c[d>>2]&15](_,S)|0){Q=1188;break}else{R=_}}if((Q|0)==1188){Q=0;R=N;c[E>>2]=c[R>>2];c[E+4>>2]=c[R+4>>2];c[E+8>>2]=c[R+8>>2];P=_;c[R>>2]=c[P>>2];c[R+4>>2]=c[P+4>>2];c[R+8>>2]=c[P+8>>2];c[P>>2]=c[E>>2];c[P+4>>2]=c[E+4>>2];c[P+8>>2]=c[E+8>>2];Y=_;Z=W+1|0;break}P=N+12|0;if(a2[c[d>>2]&15](N,L)|0){$=P}else{R=P;while(1){if((R|0)==(L|0)){Q=1224;break L1429}aa=R+12|0;if(a2[c[d>>2]&15](N,R)|0){break}else{R=aa}}P=R;c[D>>2]=c[P>>2];c[D+4>>2]=c[P+4>>2];c[D+8>>2]=c[P+8>>2];c[P>>2]=c[M>>2];c[P+4>>2]=c[M+4>>2];c[P+8>>2]=c[M+8>>2];c[M>>2]=c[D>>2];c[M+4>>2]=c[D+4>>2];c[M+8>>2]=c[D+8>>2];$=aa}if(($|0)==(L|0)){Q=1218;break L1429}else{ab=L;ac=$}while(1){P=ac;while(1){ad=P+12|0;if(a2[c[d>>2]&15](N,P)|0){ae=ab;break}else{P=ad}}do{ae=ae-12|0;}while(a2[c[d>>2]&15](N,ae)|0);if(P>>>0>=ae>>>0){N=P;continue L1431}X=P;c[C>>2]=c[X>>2];c[C+4>>2]=c[X+4>>2];c[C+8>>2]=c[X+8>>2];T=ae;c[X>>2]=c[T>>2];c[X+4>>2]=c[T+4>>2];c[X+8>>2]=c[T+8>>2];c[T>>2]=c[C>>2];c[T+4>>2]=c[C+4>>2];c[T+8>>2]=c[C+8>>2];ab=ae;ac=ad}}}while(0);R=N+12|0;L1474:do{if(R>>>0<Y>>>0){T=Y;X=R;U=Z;V=S;while(1){af=X;while(1){ag=af+12|0;if(a2[c[d>>2]&15](af,V)|0){af=ag}else{ah=T;break}}do{ah=ah-12|0;}while(!(a2[c[d>>2]&15](ah,V)|0));if(af>>>0>ah>>>0){ai=af;aj=U;ak=V;break L1474}P=af;c[B>>2]=c[P>>2];c[B+4>>2]=c[P+4>>2];c[B+8>>2]=c[P+8>>2];al=ah;c[P>>2]=c[al>>2];c[P+4>>2]=c[al+4>>2];c[P+8>>2]=c[al+8>>2];c[al>>2]=c[B>>2];c[al+4>>2]=c[B+4>>2];c[al+8>>2]=c[B+8>>2];T=ah;X=ag;U=U+1|0;V=(V|0)==(af|0)?ah:V}}else{ai=R;aj=Z;ak=S}}while(0);do{if((ai|0)==(ak|0)){am=aj}else{if(!(a2[c[d>>2]&15](ak,ai)|0)){am=aj;break}S=ai;c[A>>2]=c[S>>2];c[A+4>>2]=c[S+4>>2];c[A+8>>2]=c[S+8>>2];R=ak;c[S>>2]=c[R>>2];c[S+4>>2]=c[R+4>>2];c[S+8>>2]=c[R+8>>2];c[R>>2]=c[A>>2];c[R+4>>2]=c[A+4>>2];c[R+8>>2]=c[A+8>>2];am=aj+1|0}}while(0);if((am|0)==0){an=cI(N,ai,d)|0;R=ai+12|0;if(cI(R,a,d)|0){Q=1200;break}if(an){N=R;continue}}R=ai;if((R-O|0)>=(b-R|0)){Q=1204;break}cG(N,ai,d);N=ai+12|0}if((Q|0)==1200){Q=0;if(an){Q=1219;break}else{K=N;a=ai;continue}}else if((Q|0)==1204){Q=0;cG(ai+12|0,a,d);K=N;a=ai;continue}}if((Q|0)==1140){ai=N+12|0;K=N+24|0;an=N+36|0;am=m;m=n;n=o;o=p;cH(N,ai,K,an,d)|0;if(!(a2[c[d>>2]&15](L,an)|0)){i=e;return}p=an;c[o>>2]=c[p>>2];c[o+4>>2]=c[p+4>>2];c[o+8>>2]=c[p+8>>2];c[p>>2]=c[M>>2];c[p+4>>2]=c[M+4>>2];c[p+8>>2]=c[M+8>>2];c[M>>2]=c[o>>2];c[M+4>>2]=c[o+4>>2];c[M+8>>2]=c[o+8>>2];if(!(a2[c[d>>2]&15](an,K)|0)){i=e;return}an=K;c[m>>2]=c[an>>2];c[m+4>>2]=c[an+4>>2];c[m+8>>2]=c[an+8>>2];c[an>>2]=c[p>>2];c[an+4>>2]=c[p+4>>2];c[an+8>>2]=c[p+8>>2];c[p>>2]=c[m>>2];c[p+4>>2]=c[m+4>>2];c[p+8>>2]=c[m+8>>2];if(!(a2[c[d>>2]&15](K,ai)|0)){i=e;return}K=ai;c[am>>2]=c[K>>2];c[am+4>>2]=c[K+4>>2];c[am+8>>2]=c[K+8>>2];c[K>>2]=c[an>>2];c[K+4>>2]=c[an+4>>2];c[K+8>>2]=c[an+8>>2];c[an>>2]=c[am>>2];c[an+4>>2]=c[am+4>>2];c[an+8>>2]=c[am+8>>2];if(!(a2[c[d>>2]&15](ai,N)|0)){i=e;return}ai=N;c[n>>2]=c[ai>>2];c[n+4>>2]=c[ai+4>>2];c[n+8>>2]=c[ai+8>>2];c[ai>>2]=c[K>>2];c[ai+4>>2]=c[K+4>>2];c[ai+8>>2]=c[K+8>>2];c[K>>2]=c[n>>2];c[K+4>>2]=c[n+4>>2];c[K+8>>2]=c[n+8>>2];i=e;return}else if((Q|0)==1129){if(!(a2[c[d>>2]&15](L,N)|0)){i=e;return}n=v;v=N;c[n>>2]=c[v>>2];c[n+4>>2]=c[v+4>>2];c[n+8>>2]=c[v+8>>2];c[v>>2]=c[M>>2];c[v+4>>2]=c[M+4>>2];c[v+8>>2]=c[M+8>>2];c[M>>2]=c[n>>2];c[M+4>>2]=c[n+4>>2];c[M+8>>2]=c[n+8>>2];i=e;return}else if((Q|0)==1146){n=l;v=N+24|0;K=N+12|0;ai=f;f=g;g=h;h=j;j=k;k=a2[c[d>>2]&15](K,N)|0;am=a2[c[d>>2]&15](v,K)|0;do{if(k){an=N;if(am){c[ai>>2]=c[an>>2];c[ai+4>>2]=c[an+4>>2];c[ai+8>>2]=c[an+8>>2];m=v;c[an>>2]=c[m>>2];c[an+4>>2]=c[m+4>>2];c[an+8>>2]=c[m+8>>2];c[m>>2]=c[ai>>2];c[m+4>>2]=c[ai+4>>2];c[m+8>>2]=c[ai+8>>2];break}c[f>>2]=c[an>>2];c[f+4>>2]=c[an+4>>2];c[f+8>>2]=c[an+8>>2];m=K;c[an>>2]=c[m>>2];c[an+4>>2]=c[m+4>>2];c[an+8>>2]=c[m+8>>2];c[m>>2]=c[f>>2];c[m+4>>2]=c[f+4>>2];c[m+8>>2]=c[f+8>>2];if(!(a2[c[d>>2]&15](v,K)|0)){break}c[h>>2]=c[m>>2];c[h+4>>2]=c[m+4>>2];c[h+8>>2]=c[m+8>>2];an=v;c[m>>2]=c[an>>2];c[m+4>>2]=c[an+4>>2];c[m+8>>2]=c[an+8>>2];c[an>>2]=c[h>>2];c[an+4>>2]=c[h+4>>2];c[an+8>>2]=c[h+8>>2]}else{if(!am){break}an=K;c[j>>2]=c[an>>2];c[j+4>>2]=c[an+4>>2];c[j+8>>2]=c[an+8>>2];m=v;c[an>>2]=c[m>>2];c[an+4>>2]=c[m+4>>2];c[an+8>>2]=c[m+8>>2];c[m>>2]=c[j>>2];c[m+4>>2]=c[j+4>>2];c[m+8>>2]=c[j+8>>2];if(!(a2[c[d>>2]&15](K,N)|0)){break}m=N;c[g>>2]=c[m>>2];c[g+4>>2]=c[m+4>>2];c[g+8>>2]=c[m+8>>2];c[m>>2]=c[an>>2];c[m+4>>2]=c[an+4>>2];c[m+8>>2]=c[an+8>>2];c[an>>2]=c[g>>2];c[an+4>>2]=c[g+4>>2];c[an+8>>2]=c[g+8>>2]}}while(0);g=N+36|0;if((g|0)==(a|0)){i=e;return}else{ao=v;ap=g}while(1){if(a2[c[d>>2]&15](ap,ao)|0){g=ap;c[n>>2]=c[g>>2];c[n+4>>2]=c[g+4>>2];c[n+8>>2]=c[g+8>>2];g=ao;v=ap;while(1){K=v;aq=g;c[K>>2]=c[aq>>2];c[K+4>>2]=c[aq+4>>2];c[K+8>>2]=c[aq+8>>2];if((g|0)==(N|0)){break}K=g-12|0;if(a2[c[d>>2]&15](l,K)|0){v=g;g=K}else{break}}c[aq>>2]=c[n>>2];c[aq+4>>2]=c[n+4>>2];c[aq+8>>2]=c[n+8>>2]}g=ap+12|0;if((g|0)==(a|0)){break}else{ao=ap;ap=g}}i=e;return}else if((Q|0)==1213){i=e;return}else if((Q|0)==1218){i=e;return}else if((Q|0)==1219){i=e;return}else if((Q|0)==1131){ap=N+12|0;ao=q;q=r;r=s;s=t;t=u;u=a2[c[d>>2]&15](ap,N)|0;a=a2[c[d>>2]&15](L,ap)|0;if(!u){if(!a){i=e;return}u=ap;c[t>>2]=c[u>>2];c[t+4>>2]=c[u+4>>2];c[t+8>>2]=c[u+8>>2];c[u>>2]=c[M>>2];c[u+4>>2]=c[M+4>>2];c[u+8>>2]=c[M+8>>2];c[M>>2]=c[t>>2];c[M+4>>2]=c[t+4>>2];c[M+8>>2]=c[t+8>>2];if(!(a2[c[d>>2]&15](ap,N)|0)){i=e;return}t=N;c[r>>2]=c[t>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];c[t>>2]=c[u>>2];c[t+4>>2]=c[u+4>>2];c[t+8>>2]=c[u+8>>2];c[u>>2]=c[r>>2];c[u+4>>2]=c[r+4>>2];c[u+8>>2]=c[r+8>>2];i=e;return}r=N;if(a){c[ao>>2]=c[r>>2];c[ao+4>>2]=c[r+4>>2];c[ao+8>>2]=c[r+8>>2];c[r>>2]=c[M>>2];c[r+4>>2]=c[M+4>>2];c[r+8>>2]=c[M+8>>2];c[M>>2]=c[ao>>2];c[M+4>>2]=c[ao+4>>2];c[M+8>>2]=c[ao+8>>2];i=e;return}c[q>>2]=c[r>>2];c[q+4>>2]=c[r+4>>2];c[q+8>>2]=c[r+8>>2];ao=ap;c[r>>2]=c[ao>>2];c[r+4>>2]=c[ao+4>>2];c[r+8>>2]=c[ao+8>>2];c[ao>>2]=c[q>>2];c[ao+4>>2]=c[q+4>>2];c[ao+8>>2]=c[q+8>>2];if(!(a2[c[d>>2]&15](L,ap)|0)){i=e;return}c[s>>2]=c[ao>>2];c[s+4>>2]=c[ao+4>>2];c[s+8>>2]=c[ao+8>>2];c[ao>>2]=c[M>>2];c[ao+4>>2]=c[M+4>>2];c[ao+8>>2]=c[M+8>>2];c[M>>2]=c[s>>2];c[M+4>>2]=c[s+4>>2];c[M+8>>2]=c[s+8>>2];i=e;return}else if((Q|0)==1224){i=e;return}else if((Q|0)==1139){cH(N,N+12|0,N+24|0,L,d)|0;i=e;return}}function cH(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;g=i;i=i+128|0;h=g+80|0;j=g+96|0;k=g+112|0;l=g|0;m=g+16|0;n=g+32|0;o=g+48|0;p=g+64|0;q=a2[c[f>>2]&15](b,a)|0;r=a2[c[f>>2]&15](d,b)|0;do{if(q){s=a;if(r){c[l>>2]=c[s>>2];c[l+4>>2]=c[s+4>>2];c[l+8>>2]=c[s+8>>2];t=d;c[s>>2]=c[t>>2];c[s+4>>2]=c[t+4>>2];c[s+8>>2]=c[t+8>>2];c[t>>2]=c[l>>2];c[t+4>>2]=c[l+4>>2];c[t+8>>2]=c[l+8>>2];u=1;break}c[m>>2]=c[s>>2];c[m+4>>2]=c[s+4>>2];c[m+8>>2]=c[s+8>>2];t=b;c[s>>2]=c[t>>2];c[s+4>>2]=c[t+4>>2];c[s+8>>2]=c[t+8>>2];c[t>>2]=c[m>>2];c[t+4>>2]=c[m+4>>2];c[t+8>>2]=c[m+8>>2];if(!(a2[c[f>>2]&15](d,b)|0)){u=1;break}c[o>>2]=c[t>>2];c[o+4>>2]=c[t+4>>2];c[o+8>>2]=c[t+8>>2];s=d;c[t>>2]=c[s>>2];c[t+4>>2]=c[s+4>>2];c[t+8>>2]=c[s+8>>2];c[s>>2]=c[o>>2];c[s+4>>2]=c[o+4>>2];c[s+8>>2]=c[o+8>>2];u=2}else{if(!r){u=0;break}s=b;c[p>>2]=c[s>>2];c[p+4>>2]=c[s+4>>2];c[p+8>>2]=c[s+8>>2];t=d;c[s>>2]=c[t>>2];c[s+4>>2]=c[t+4>>2];c[s+8>>2]=c[t+8>>2];c[t>>2]=c[p>>2];c[t+4>>2]=c[p+4>>2];c[t+8>>2]=c[p+8>>2];if(!(a2[c[f>>2]&15](b,a)|0)){u=1;break}t=a;c[n>>2]=c[t>>2];c[n+4>>2]=c[t+4>>2];c[n+8>>2]=c[t+8>>2];c[t>>2]=c[s>>2];c[t+4>>2]=c[s+4>>2];c[t+8>>2]=c[s+8>>2];c[s>>2]=c[n>>2];c[s+4>>2]=c[n+4>>2];c[s+8>>2]=c[n+8>>2];u=2}}while(0);if(!(a2[c[f>>2]&15](e,d)|0)){v=u;i=g;return v|0}n=k;k=d;c[n>>2]=c[k>>2];c[n+4>>2]=c[k+4>>2];c[n+8>>2]=c[k+8>>2];p=e;c[k>>2]=c[p>>2];c[k+4>>2]=c[p+4>>2];c[k+8>>2]=c[p+8>>2];c[p>>2]=c[n>>2];c[p+4>>2]=c[n+4>>2];c[p+8>>2]=c[n+8>>2];if(!(a2[c[f>>2]&15](d,b)|0)){v=u+1|0;i=g;return v|0}d=h;h=b;c[d>>2]=c[h>>2];c[d+4>>2]=c[h+4>>2];c[d+8>>2]=c[h+8>>2];c[h>>2]=c[k>>2];c[h+4>>2]=c[k+4>>2];c[h+8>>2]=c[k+8>>2];c[k>>2]=c[d>>2];c[k+4>>2]=c[d+4>>2];c[k+8>>2]=c[d+8>>2];if(!(a2[c[f>>2]&15](b,a)|0)){v=u+2|0;i=g;return v|0}b=j;j=a;c[b>>2]=c[j>>2];c[b+4>>2]=c[j+4>>2];c[b+8>>2]=c[j+8>>2];c[j>>2]=c[h>>2];c[j+4>>2]=c[h+4>>2];c[j+8>>2]=c[h+8>>2];c[h>>2]=c[b>>2];c[h+4>>2]=c[b+4>>2];c[h+8>>2]=c[b+8>>2];v=u+3|0;i=g;return v|0}function cI(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;e=i;i=i+256|0;f=e|0;g=e+16|0;h=e+32|0;j=e+48|0;k=e+64|0;l=e+240|0;switch((b-a|0)/12|0|0){case 5:{m=a+12|0;n=a+24|0;o=a+36|0;p=b-12|0;q=e+80|0;r=e+96|0;s=e+112|0;t=e+128|0;cH(a,m,n,o,d)|0;if(!(a2[c[d>>2]&15](p,o)|0)){u=1;i=e;return u|0}v=o;c[t>>2]=c[v>>2];c[t+4>>2]=c[v+4>>2];c[t+8>>2]=c[v+8>>2];w=p;c[v>>2]=c[w>>2];c[v+4>>2]=c[w+4>>2];c[v+8>>2]=c[w+8>>2];c[w>>2]=c[t>>2];c[w+4>>2]=c[t+4>>2];c[w+8>>2]=c[t+8>>2];if(!(a2[c[d>>2]&15](o,n)|0)){u=1;i=e;return u|0}o=n;c[r>>2]=c[o>>2];c[r+4>>2]=c[o+4>>2];c[r+8>>2]=c[o+8>>2];c[o>>2]=c[v>>2];c[o+4>>2]=c[v+4>>2];c[o+8>>2]=c[v+8>>2];c[v>>2]=c[r>>2];c[v+4>>2]=c[r+4>>2];c[v+8>>2]=c[r+8>>2];if(!(a2[c[d>>2]&15](n,m)|0)){u=1;i=e;return u|0}n=m;c[q>>2]=c[n>>2];c[q+4>>2]=c[n+4>>2];c[q+8>>2]=c[n+8>>2];c[n>>2]=c[o>>2];c[n+4>>2]=c[o+4>>2];c[n+8>>2]=c[o+8>>2];c[o>>2]=c[q>>2];c[o+4>>2]=c[q+4>>2];c[o+8>>2]=c[q+8>>2];if(!(a2[c[d>>2]&15](m,a)|0)){u=1;i=e;return u|0}m=a;c[s>>2]=c[m>>2];c[s+4>>2]=c[m+4>>2];c[s+8>>2]=c[m+8>>2];c[m>>2]=c[n>>2];c[m+4>>2]=c[n+4>>2];c[m+8>>2]=c[n+8>>2];c[n>>2]=c[s>>2];c[n+4>>2]=c[s+4>>2];c[n+8>>2]=c[s+8>>2];u=1;i=e;return u|0};case 2:{s=b-12|0;if(!(a2[c[d>>2]&15](s,a)|0)){u=1;i=e;return u|0}n=e+224|0;m=a;c[n>>2]=c[m>>2];c[n+4>>2]=c[m+4>>2];c[n+8>>2]=c[m+8>>2];q=s;c[m>>2]=c[q>>2];c[m+4>>2]=c[q+4>>2];c[m+8>>2]=c[q+8>>2];c[q>>2]=c[n>>2];c[q+4>>2]=c[n+4>>2];c[q+8>>2]=c[n+8>>2];u=1;i=e;return u|0};case 3:{n=a+12|0;q=b-12|0;m=e+144|0;s=e+160|0;o=e+176|0;r=e+192|0;v=e+208|0;t=a2[c[d>>2]&15](n,a)|0;w=a2[c[d>>2]&15](q,n)|0;if(!t){if(!w){u=1;i=e;return u|0}t=n;c[v>>2]=c[t>>2];c[v+4>>2]=c[t+4>>2];c[v+8>>2]=c[t+8>>2];p=q;c[t>>2]=c[p>>2];c[t+4>>2]=c[p+4>>2];c[t+8>>2]=c[p+8>>2];c[p>>2]=c[v>>2];c[p+4>>2]=c[v+4>>2];c[p+8>>2]=c[v+8>>2];if(!(a2[c[d>>2]&15](n,a)|0)){u=1;i=e;return u|0}v=a;c[o>>2]=c[v>>2];c[o+4>>2]=c[v+4>>2];c[o+8>>2]=c[v+8>>2];c[v>>2]=c[t>>2];c[v+4>>2]=c[t+4>>2];c[v+8>>2]=c[t+8>>2];c[t>>2]=c[o>>2];c[t+4>>2]=c[o+4>>2];c[t+8>>2]=c[o+8>>2];u=1;i=e;return u|0}o=a;if(w){c[m>>2]=c[o>>2];c[m+4>>2]=c[o+4>>2];c[m+8>>2]=c[o+8>>2];w=q;c[o>>2]=c[w>>2];c[o+4>>2]=c[w+4>>2];c[o+8>>2]=c[w+8>>2];c[w>>2]=c[m>>2];c[w+4>>2]=c[m+4>>2];c[w+8>>2]=c[m+8>>2];u=1;i=e;return u|0}c[s>>2]=c[o>>2];c[s+4>>2]=c[o+4>>2];c[s+8>>2]=c[o+8>>2];m=n;c[o>>2]=c[m>>2];c[o+4>>2]=c[m+4>>2];c[o+8>>2]=c[m+8>>2];c[m>>2]=c[s>>2];c[m+4>>2]=c[s+4>>2];c[m+8>>2]=c[s+8>>2];if(!(a2[c[d>>2]&15](q,n)|0)){u=1;i=e;return u|0}c[r>>2]=c[m>>2];c[r+4>>2]=c[m+4>>2];c[r+8>>2]=c[m+8>>2];n=q;c[m>>2]=c[n>>2];c[m+4>>2]=c[n+4>>2];c[m+8>>2]=c[n+8>>2];c[n>>2]=c[r>>2];c[n+4>>2]=c[r+4>>2];c[n+8>>2]=c[r+8>>2];u=1;i=e;return u|0};case 4:{cH(a,a+12|0,a+24|0,b-12|0,d)|0;u=1;i=e;return u|0};case 0:case 1:{u=1;i=e;return u|0};default:{r=a+24|0;n=a+12|0;m=f;f=g;g=h;h=j;j=k;k=a2[c[d>>2]&15](n,a)|0;q=a2[c[d>>2]&15](r,n)|0;do{if(k){s=a;if(q){c[m>>2]=c[s>>2];c[m+4>>2]=c[s+4>>2];c[m+8>>2]=c[s+8>>2];o=r;c[s>>2]=c[o>>2];c[s+4>>2]=c[o+4>>2];c[s+8>>2]=c[o+8>>2];c[o>>2]=c[m>>2];c[o+4>>2]=c[m+4>>2];c[o+8>>2]=c[m+8>>2];break}c[f>>2]=c[s>>2];c[f+4>>2]=c[s+4>>2];c[f+8>>2]=c[s+8>>2];o=n;c[s>>2]=c[o>>2];c[s+4>>2]=c[o+4>>2];c[s+8>>2]=c[o+8>>2];c[o>>2]=c[f>>2];c[o+4>>2]=c[f+4>>2];c[o+8>>2]=c[f+8>>2];if(!(a2[c[d>>2]&15](r,n)|0)){break}c[h>>2]=c[o>>2];c[h+4>>2]=c[o+4>>2];c[h+8>>2]=c[o+8>>2];s=r;c[o>>2]=c[s>>2];c[o+4>>2]=c[s+4>>2];c[o+8>>2]=c[s+8>>2];c[s>>2]=c[h>>2];c[s+4>>2]=c[h+4>>2];c[s+8>>2]=c[h+8>>2]}else{if(!q){break}s=n;c[j>>2]=c[s>>2];c[j+4>>2]=c[s+4>>2];c[j+8>>2]=c[s+8>>2];o=r;c[s>>2]=c[o>>2];c[s+4>>2]=c[o+4>>2];c[s+8>>2]=c[o+8>>2];c[o>>2]=c[j>>2];c[o+4>>2]=c[j+4>>2];c[o+8>>2]=c[j+8>>2];if(!(a2[c[d>>2]&15](n,a)|0)){break}o=a;c[g>>2]=c[o>>2];c[g+4>>2]=c[o+4>>2];c[g+8>>2]=c[o+8>>2];c[o>>2]=c[s>>2];c[o+4>>2]=c[s+4>>2];c[o+8>>2]=c[s+8>>2];c[s>>2]=c[g>>2];c[s+4>>2]=c[g+4>>2];c[s+8>>2]=c[g+8>>2]}}while(0);g=a+36|0;if((g|0)==(b|0)){u=1;i=e;return u|0}n=l;j=r;r=0;q=g;while(1){if(a2[c[d>>2]&15](q,j)|0){g=q;c[n>>2]=c[g>>2];c[n+4>>2]=c[g+4>>2];c[n+8>>2]=c[g+8>>2];g=j;h=q;while(1){f=h;x=g;c[f>>2]=c[x>>2];c[f+4>>2]=c[x+4>>2];c[f+8>>2]=c[x+8>>2];if((g|0)==(a|0)){break}f=g-12|0;if(a2[c[d>>2]&15](l,f)|0){h=g;g=f}else{break}}c[x>>2]=c[n>>2];c[x+4>>2]=c[n+4>>2];c[x+8>>2]=c[n+8>>2];g=r+1|0;if((g|0)==8){break}else{y=g}}else{y=r}g=q+12|0;if((g|0)==(b|0)){u=1;z=1294;break}else{j=q;r=y;q=g}}if((z|0)==1294){i=e;return u|0}u=(q+12|0)==(b|0);i=e;return u|0}}return 0}function cJ(a){a=a|0;d8(a);return}function cK(a,b){a=a|0;b=b|0;return}function cL(a,b){a=a|0;b=b|0;return}function cM(a,b,c){a=a|0;b=b|0;c=c|0;return}function cN(a,b,c){a=a|0;b=b|0;c=c|0;return}function cO(a){a=a|0;b[a+32>>1]=1;b[a+34>>1]=-1;b[a+36>>1]=0;c[a+40>>2]=0;c[a+24>>2]=0;c[a+28>>2]=0;eb(a|0,0,16);return}function cP(d,e,f,h){d=d|0;e=e|0;f=f|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0.0,o=0;c[d+40>>2]=c[h+4>>2];g[d+16>>2]=+g[h+8>>2];g[d+20>>2]=+g[h+12>>2];c[d+8>>2]=f;c[d+4>>2]=0;f=d+32|0;i=h+22|0;b[f>>1]=b[i>>1]|0;b[f+2>>1]=b[i+2>>1]|0;b[f+4>>1]=b[i+4>>1]|0;a[d+38|0]=a[h+20|0]&1;i=c[h>>2]|0;f=a2[c[(c[i>>2]|0)+8>>2]&15](i,e)|0;c[d+12>>2]=f;i=aV[c[(c[f>>2]|0)+12>>2]&7](f)|0;f=cg(e,i*28|0)|0;e=d+24|0;c[e>>2]=f;if((i|0)>0){j=0;k=f}else{l=d+28|0;c[l>>2]=0;m=h+16|0;n=+g[m>>2];o=d|0;g[o>>2]=n;return}while(1){c[k+(j*28|0)+16>>2]=0;c[(c[e>>2]|0)+(j*28|0)+24>>2]=-1;f=j+1|0;if((f|0)>=(i|0)){break}j=f;k=c[e>>2]|0}l=d+28|0;c[l>>2]=0;m=h+16|0;n=+g[m>>2];o=d|0;g[o>>2]=n;return}function cQ(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;if((c[a+28>>2]|0)!=0){at(3576,4112,72,4560)}d=a+12|0;e=c[d>>2]|0;f=aV[c[(c[e>>2]|0)+12>>2]&7](e)|0;e=a+24|0;ch(b,c[e>>2]|0,f*28|0);c[e>>2]=0;e=c[d>>2]|0;f=c[e+4>>2]|0;if((f|0)==3){aX[c[c[e>>2]>>2]&127](e);ch(b,e,40);c[d>>2]=0;return}else if((f|0)==2){aX[c[c[e>>2]>>2]&127](e);ch(b,e,152);c[d>>2]=0;return}else if((f|0)==0){aX[c[c[e>>2]>>2]&127](e);ch(b,e,20);c[d>>2]=0;return}else if((f|0)==1){aX[c[c[e>>2]>>2]&127](e);ch(b,e,48);c[d>>2]=0;return}else{at(2552,4112,115,4560)}}function cR(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=a+28|0;if((c[e>>2]|0)!=0){at(3576,4112,124,4568)}f=a+12|0;g=c[f>>2]|0;h=aV[c[(c[g>>2]|0)+12>>2]&7](g)|0;c[e>>2]=h;if((h|0)<=0){return}h=a+24|0;g=0;do{i=c[h>>2]|0;j=i+(g*28|0)|0;k=c[f>>2]|0;l=j|0;a4[c[(c[k>>2]|0)+24>>2]&31](k,l,d,g);c[i+(g*28|0)+24>>2]=br(b,l,j)|0;c[i+(g*28|0)+16>>2]=a;c[i+(g*28|0)+20>>2]=g;g=g+1|0;}while((g|0)<(c[e>>2]|0));return}function cS(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0;f=i;i=i+40|0;h=f|0;j=f+16|0;k=f+32|0;l=a+28|0;if((c[l>>2]|0)<=0){i=f;return}m=a+24|0;n=a+12|0;a=h|0;o=j|0;p=h+4|0;q=j+4|0;r=h+8|0;s=j+8|0;t=h+12|0;u=j+12|0;v=e|0;w=d|0;x=e+4|0;y=d+4|0;z=k|0;A=k+4|0;B=0;do{C=c[m>>2]|0;D=c[n>>2]|0;E=C+(B*28|0)+20|0;a4[c[(c[D>>2]|0)+24>>2]&31](D,h,d,c[E>>2]|0);D=c[n>>2]|0;a4[c[(c[D>>2]|0)+24>>2]&31](D,j,e,c[E>>2]|0);E=C+(B*28|0)|0;F=+g[a>>2];G=+g[o>>2];H=+g[p>>2];I=+g[q>>2];D=E;J=+(H<I?H:I);g[D>>2]=F<G?F:G;g[D+4>>2]=J;J=+g[r>>2];G=+g[s>>2];F=+g[t>>2];I=+g[u>>2];D=C+(B*28|0)+8|0;H=+(F>I?F:I);g[D>>2]=J>G?J:G;g[D+4>>2]=H;H=+g[x>>2]- +g[y>>2];g[z>>2]=+g[v>>2]- +g[w>>2];g[A>>2]=H;bs(b,c[C+(B*28|0)+24>>2]|0,E,k);B=B+1|0;}while((B|0)<(c[l>>2]|0));i=f;return}function cT(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0;h=a+40|0;c[h>>2]=b;c[a+44>>2]=d;c[a+48>>2]=e;c[a+28>>2]=0;c[a+36>>2]=0;c[a+32>>2]=0;i=a|0;c[i>>2]=f;c[a+4>>2]=g;c[a+8>>2]=cm(f,b<<2)|0;c[a+12>>2]=cm(c[i>>2]|0,d<<2)|0;c[a+16>>2]=cm(c[i>>2]|0,e<<2)|0;c[a+24>>2]=cm(c[i>>2]|0,(c[h>>2]|0)*12|0)|0;c[a+20>>2]=cm(c[i>>2]|0,(c[h>>2]|0)*12|0)|0;return}function cU(a){a=a|0;var b=0;b=a|0;cn(c[b>>2]|0,c[a+20>>2]|0);cn(c[b>>2]|0,c[a+24>>2]|0);cn(c[b>>2]|0,c[a+16>>2]|0);cn(c[b>>2]|0,c[a+12>>2]|0);cn(c[b>>2]|0,c[a+8>>2]|0);return}function cV(d,e,f,h,j){d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0,Q=0,T=0.0,U=0.0,V=0.0,W=0.0,X=0,Y=0,Z=0.0,_=0.0,$=0;l=i;i=i+168|0;m=l|0;n=l+24|0;o=l+32|0;p=l+64|0;q=l+112|0;co(n);r=+g[f>>2];s=d+28|0;if((c[s>>2]|0)>0){t=d+8|0;u=h|0;v=h+4|0;h=d+20|0;w=d+24|0;x=0;while(1){y=c[(c[t>>2]|0)+(x<<2)>>2]|0;z=y+44|0;A=c[z>>2]|0;B=c[z+4>>2]|0;C=+g[y+56>>2];z=y+64|0;D=+g[z>>2];E=+g[z+4>>2];F=+g[y+72>>2];z=y+36|0;c[z>>2]=A;c[z+4>>2]=B;g[y+52>>2]=C;if((c[y>>2]|0)==2){G=+g[y+140>>2];H=+g[y+120>>2];I=1.0-r*+g[y+132>>2];J=I<1.0?I:1.0;I=J<0.0?0.0:J;J=1.0-r*+g[y+136>>2];K=J<1.0?J:1.0;L=(F+r*+g[y+128>>2]*+g[y+84>>2])*(K<0.0?0.0:K);M=(D+r*(G*+g[u>>2]+H*+g[y+76>>2]))*I;N=(E+r*(G*+g[v>>2]+H*+g[y+80>>2]))*I}else{L=F;M=D;N=E}y=(c[h>>2]|0)+(x*12|0)|0;c[y>>2]=A;c[y+4>>2]=B;g[(c[h>>2]|0)+(x*12|0)+8>>2]=C;B=(c[w>>2]|0)+(x*12|0)|0;C=+N;g[B>>2]=M;g[B+4>>2]=C;g[(c[w>>2]|0)+(x*12|0)+8>>2]=L;B=x+1|0;if((B|0)<(c[s>>2]|0)){x=B}else{O=h;Q=w;break}}}else{O=d+20|0;Q=d+24|0}cp(n);w=o;h=f;c[w>>2]=c[h>>2];c[w+4>>2]=c[h+4>>2];c[w+8>>2]=c[h+8>>2];c[w+12>>2]=c[h+12>>2];c[w+16>>2]=c[h+16>>2];c[w+20>>2]=c[h+20>>2];w=c[O>>2]|0;c[o+24>>2]=w;x=c[Q>>2]|0;c[o+28>>2]=x;v=p;c[v>>2]=c[h>>2];c[v+4>>2]=c[h+4>>2];c[v+8>>2]=c[h+8>>2];c[v+12>>2]=c[h+12>>2];c[v+16>>2]=c[h+16>>2];c[v+20>>2]=c[h+20>>2];h=d+12|0;c[p+24>>2]=c[h>>2];v=d+36|0;c[p+28>>2]=c[v>>2];c[p+32>>2]=w;c[p+36>>2]=x;c[p+40>>2]=c[d>>2];dr(q,p);dt(q);if((a[f+20|0]&1)!=0){du(q)}p=d+32|0;if((c[p>>2]|0)>0){x=d+16|0;w=0;do{u=c[(c[x>>2]|0)+(w<<2)>>2]|0;aY[c[(c[u>>2]|0)+28>>2]&31](u,o);w=w+1|0;}while((w|0)<(c[p>>2]|0))}g[e+12>>2]=+cq(n);cp(n);w=f+12|0;if((c[w>>2]|0)>0){x=d+16|0;u=0;do{if((c[p>>2]|0)>0){t=0;do{B=c[(c[x>>2]|0)+(t<<2)>>2]|0;aY[c[(c[B>>2]|0)+32>>2]&31](B,o);t=t+1|0;}while((t|0)<(c[p>>2]|0))}dv(q);u=u+1|0;}while((u|0)<(c[w>>2]|0))}dw(q);g[e+16>>2]=+cq(n);if((c[s>>2]|0)>0){w=0;do{u=c[O>>2]|0;x=u+(w*12|0)|0;L=+g[x>>2];M=+g[x+4>>2];N=+g[u+(w*12|0)+8>>2];u=c[Q>>2]|0;t=u+(w*12|0)|0;C=+g[t>>2];E=+g[t+4>>2];D=+g[u+(w*12|0)+8>>2];F=r*C;I=r*E;H=F*F+I*I;if(H>4.0){I=2.0/+P(H);T=C*I;U=E*I}else{T=C;U=E}E=r*D;if(E*E>2.4674012660980225){if(E>0.0){V=E}else{V=-0.0-E}W=D*(1.5707963705062866/V)}else{W=D}D=+(M+r*U);g[x>>2]=L+r*T;g[x+4>>2]=D;g[(c[O>>2]|0)+(w*12|0)+8>>2]=N+r*W;x=(c[Q>>2]|0)+(w*12|0)|0;N=+U;g[x>>2]=T;g[x+4>>2]=N;g[(c[Q>>2]|0)+(w*12|0)+8>>2]=W;w=w+1|0;}while((w|0)<(c[s>>2]|0))}cp(n);w=f+16|0;f=d+16|0;x=0;while(1){if((x|0)>=(c[w>>2]|0)){X=1;break}u=dx(q)|0;if((c[p>>2]|0)>0){t=1;B=0;while(1){y=c[(c[f>>2]|0)+(B<<2)>>2]|0;A=t&(a2[c[(c[y>>2]|0)+36>>2]&15](y,o)|0);y=B+1|0;if((y|0)<(c[p>>2]|0)){t=A;B=y}else{Y=A;break}}}else{Y=1}if(u&Y){X=0;break}else{x=x+1|0}}if((c[s>>2]|0)>0){x=d+8|0;Y=0;do{p=c[(c[x>>2]|0)+(Y<<2)>>2]|0;o=(c[O>>2]|0)+(Y*12|0)|0;f=p+44|0;w=c[o>>2]|0;B=c[o+4>>2]|0;c[f>>2]=w;c[f+4>>2]=B;W=+g[(c[O>>2]|0)+(Y*12|0)+8>>2];g[p+56>>2]=W;f=(c[Q>>2]|0)+(Y*12|0)|0;o=p+64|0;t=c[f+4>>2]|0;c[o>>2]=c[f>>2];c[o+4>>2]=t;g[p+72>>2]=+g[(c[Q>>2]|0)+(Y*12|0)+8>>2];T=+S(W);g[p+20>>2]=T;U=+R(W);g[p+24>>2]=U;W=+g[p+28>>2];V=+g[p+32>>2];t=p+12|0;N=+((c[k>>2]=B,+g[k>>2])-(T*W+U*V));g[t>>2]=(c[k>>2]=w,+g[k>>2])-(U*W-T*V);g[t+4>>2]=N;Y=Y+1|0;}while((Y|0)<(c[s>>2]|0))}g[e+20>>2]=+cq(n);n=c[q+40>>2]|0;e=d+4|0;do{if((c[e>>2]|0)!=0){if((c[v>>2]|0)<=0){break}Y=m+16|0;Q=0;do{O=c[(c[h>>2]|0)+(Q<<2)>>2]|0;x=c[n+(Q*152|0)+144>>2]|0;c[Y>>2]=x;if((x|0)>0){t=0;do{g[m+(t<<2)>>2]=+g[n+(Q*152|0)+(t*36|0)+16>>2];g[m+8+(t<<2)>>2]=+g[n+(Q*152|0)+(t*36|0)+20>>2];t=t+1|0;}while((t|0)<(x|0))}x=c[e>>2]|0;a_[c[(c[x>>2]|0)+20>>2]&7](x,O,m);Q=Q+1|0;}while((Q|0)<(c[v>>2]|0))}}while(0);if(!j){ds(q);i=l;return}j=c[s>>2]|0;if((j|0)>0){v=d+8|0;N=3.4028234663852886e+38;m=0;while(1){e=c[(c[v>>2]|0)+(m<<2)>>2]|0;L1784:do{if((c[e>>2]|0)==0){Z=N}else{do{if((b[e+4>>1]&4)!=0){V=+g[e+72>>2];if(V*V>.001218469929881394){break}V=+g[e+64>>2];T=+g[e+68>>2];if(V*V+T*T>9999999747378752.0e-20){break}n=e+144|0;T=r+ +g[n>>2];g[n>>2]=T;Z=N<T?N:T;break L1784}}while(0);g[e+144>>2]=0.0;Z=0.0}}while(0);e=m+1|0;O=c[s>>2]|0;if((e|0)<(O|0)){N=Z;m=e}else{_=Z;$=O;break}}}else{_=3.4028234663852886e+38;$=j}if(!(($|0)>0&((_<.5|X)^1))){ds(q);i=l;return}X=d+8|0;d=0;do{$=c[(c[X>>2]|0)+(d<<2)>>2]|0;j=$+4|0;b[j>>1]=b[j>>1]&-3;g[$+144>>2]=0.0;eb($+64|0,0,24);d=d+1|0;}while((d|0)<(c[s>>2]|0));ds(q);i=l;return}function cW(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0;f=i;i=i+128|0;h=f|0;j=f+24|0;k=f+72|0;l=a+28|0;m=c[l>>2]|0;if((m|0)<=(d|0)){at(2776,3968,386,4600)}if((m|0)<=(e|0)){at(2480,3968,387,4600)}if((m|0)>0){m=a+8|0;n=a+20|0;o=a+24|0;p=0;while(1){q=c[(c[m>>2]|0)+(p<<2)>>2]|0;r=q+44|0;s=(c[n>>2]|0)+(p*12|0)|0;t=c[r+4>>2]|0;c[s>>2]=c[r>>2];c[s+4>>2]=t;g[(c[n>>2]|0)+(p*12|0)+8>>2]=+g[q+56>>2];t=q+64|0;s=(c[o>>2]|0)+(p*12|0)|0;r=c[t+4>>2]|0;c[s>>2]=c[t>>2];c[s+4>>2]=r;g[(c[o>>2]|0)+(p*12|0)+8>>2]=+g[q+72>>2];q=p+1|0;if((q|0)<(c[l>>2]|0)){p=q}else{u=n;v=o;break}}}else{u=a+20|0;v=a+24|0}o=a+12|0;c[j+24>>2]=c[o>>2];n=a+36|0;c[j+28>>2]=c[n>>2];c[j+40>>2]=c[a>>2];p=j;m=b;c[p>>2]=c[m>>2];c[p+4>>2]=c[m+4>>2];c[p+8>>2]=c[m+8>>2];c[p+12>>2]=c[m+12>>2];c[p+16>>2]=c[m+16>>2];c[p+20>>2]=c[m+20>>2];c[j+32>>2]=c[u>>2];c[j+36>>2]=c[v>>2];dr(k,j);j=b+16|0;m=0;while(1){if((m|0)>=(c[j>>2]|0)){break}if(dz(k,d,e)|0){break}else{m=m+1|0}}m=a+8|0;j=(c[u>>2]|0)+(d*12|0)|0;p=(c[(c[m>>2]|0)+(d<<2)>>2]|0)+36|0;q=c[j+4>>2]|0;c[p>>2]=c[j>>2];c[p+4>>2]=q;g[(c[(c[m>>2]|0)+(d<<2)>>2]|0)+52>>2]=+g[(c[u>>2]|0)+(d*12|0)+8>>2];d=(c[u>>2]|0)+(e*12|0)|0;q=(c[(c[m>>2]|0)+(e<<2)>>2]|0)+36|0;p=c[d+4>>2]|0;c[q>>2]=c[d>>2];c[q+4>>2]=p;g[(c[(c[m>>2]|0)+(e<<2)>>2]|0)+52>>2]=+g[(c[u>>2]|0)+(e*12|0)+8>>2];dt(k);e=b+12|0;if((c[e>>2]|0)>0){p=0;do{dv(k);p=p+1|0;}while((p|0)<(c[e>>2]|0))}w=+g[b>>2];if((c[l>>2]|0)>0){b=0;do{e=c[u>>2]|0;p=e+(b*12|0)|0;x=+g[p>>2];y=+g[p+4>>2];z=+g[e+(b*12|0)+8>>2];e=c[v>>2]|0;q=e+(b*12|0)|0;A=+g[q>>2];B=+g[q+4>>2];C=+g[e+(b*12|0)+8>>2];D=w*A;E=w*B;F=D*D+E*E;if(F>4.0){E=2.0/+P(F);G=A*E;H=B*E}else{G=A;H=B}B=w*C;if(B*B>2.4674012660980225){if(B>0.0){I=B}else{I=-0.0-B}J=C*(1.5707963705062866/I)}else{J=C}C=x+w*G;x=y+w*H;y=z+w*J;z=+C;B=+x;g[p>>2]=z;g[p+4>>2]=B;g[(c[u>>2]|0)+(b*12|0)+8>>2]=y;p=(c[v>>2]|0)+(b*12|0)|0;A=+G;E=+H;g[p>>2]=A;g[p+4>>2]=E;g[(c[v>>2]|0)+(b*12|0)+8>>2]=J;p=c[(c[m>>2]|0)+(b<<2)>>2]|0;e=p+44|0;g[e>>2]=z;g[e+4>>2]=B;g[p+56>>2]=y;e=p+64|0;g[e>>2]=A;g[e+4>>2]=E;g[p+72>>2]=J;E=+S(y);g[p+20>>2]=E;A=+R(y);g[p+24>>2]=A;y=+g[p+28>>2];B=+g[p+32>>2];e=p+12|0;z=+(x-(E*y+A*B));g[e>>2]=C-(A*y-E*B);g[e+4>>2]=z;b=b+1|0;}while((b|0)<(c[l>>2]|0))}l=c[k+40>>2]|0;b=a+4|0;if((c[b>>2]|0)==0){ds(k);i=f;return}if((c[n>>2]|0)<=0){ds(k);i=f;return}a=h+16|0;m=0;do{v=c[(c[o>>2]|0)+(m<<2)>>2]|0;u=c[l+(m*152|0)+144>>2]|0;c[a>>2]=u;if((u|0)>0){e=0;do{g[h+(e<<2)>>2]=+g[l+(m*152|0)+(e*36|0)+16>>2];g[h+8+(e<<2)>>2]=+g[l+(m*152|0)+(e*36|0)+20>>2];e=e+1|0;}while((e|0)<(u|0))}u=c[b>>2]|0;a_[c[(c[u>>2]|0)+20>>2]&7](u,v,h);m=m+1|0;}while((m|0)<(c[n>>2]|0));ds(k);i=f;return}function cX(b,d){b=b|0;d=d|0;var e=0,f=0,h=0;e=b|0;ce(e);ck(b+68|0);cy(b+102872|0);c[b+102980>>2]=0;c[b+102984>>2]=0;eb(b+102952|0,0,16);a[b+102992|0]=1;a[b+102993|0]=1;a[b+102994|0]=0;a[b+102995|0]=1;a[b+102976|0]=1;f=d;d=b+102968|0;h=c[f+4>>2]|0;c[d>>2]=c[f>>2];c[d+4>>2]=h;c[b+102868>>2]=4;g[b+102988>>2]=0.0;c[b+102948>>2]=e;eb(b+102996|0,0,32);return}function cY(a){a=a|0;var b=0,d=0,e=0,f=0,g=0;b=c[a+102952>>2]|0;if((b|0)!=0){d=a|0;e=b;while(1){b=c[e+96>>2]|0;f=c[e+100>>2]|0;while(1){if((f|0)==0){break}g=c[f+4>>2]|0;c[f+28>>2]=0;cQ(f,d);f=g}if((b|0)==0){break}else{e=b}}}bq(a+102872|0);cl(a+68|0);cf(a|0);return}function cZ(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;if((c[a+102868>>2]&2|0)!=0){at(2752,3928,109,4648);return 0}d=cg(a|0,152)|0;if((d|0)==0){e=0}else{f=d;cr(f,b,a);e=f}c[e+92>>2]=0;f=a+102952|0;c[e+96>>2]=c[f>>2];b=c[f>>2]|0;if((b|0)!=0){c[b+92>>2]=e}c[f>>2]=e;f=a+102960|0;c[f>>2]=(c[f>>2]|0)+1;return e|0}function c_(d,e){d=d|0;e=e|0;var f=0,h=0;f=d+102976|0;if((e&1|0)==(a[f]&1|0)){return}a[f]=e&1;if(e){return}e=c[d+102952>>2]|0;if((e|0)==0){return}else{h=e}do{e=h+4|0;d=b[e>>1]|0;if((d&2)==0){b[e>>1]=d|2;g[h+144>>2]=0.0}h=c[h+96>>2]|0;}while((h|0)!=0);return}function c$(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0;f=i;i=i+96|0;h=f|0;j=f+56|0;k=f+88|0;l=d+103008|0;g[l>>2]=0.0;m=d+103012|0;g[m>>2]=0.0;n=d+103016|0;g[n>>2]=0.0;o=d+102960|0;p=d+102872|0;q=d+68|0;cT(h,c[o>>2]|0,c[d+102936>>2]|0,c[d+102964>>2]|0,q,c[d+102944>>2]|0);r=d+102952|0;s=c[r>>2]|0;if((s|0)!=0){t=s;do{s=t+4|0;b[s>>1]=b[s>>1]&-2;t=c[t+96>>2]|0;}while((t|0)!=0)}t=c[d+102932>>2]|0;if((t|0)!=0){s=t;do{t=s+4|0;c[t>>2]=c[t>>2]&-2;s=c[s+12>>2]|0;}while((s|0)!=0)}s=c[d+102956>>2]|0;if((s|0)!=0){t=s;do{a[t+60|0]=0;t=c[t+12>>2]|0;}while((t|0)!=0)}t=c[o>>2]|0;o=cm(q,t<<2)|0;s=o;u=c[r>>2]|0;L1904:do{if((u|0)!=0){v=h+28|0;w=h+36|0;x=h+32|0;y=h+40|0;z=h+8|0;A=h+48|0;B=h+16|0;C=h+44|0;D=h+12|0;E=d+102968|0;F=d+102976|0;G=j+12|0;H=j+16|0;I=j+20|0;J=u;L1906:while(1){K=J+4|0;do{if((b[K>>1]&35)==34){if((c[J>>2]|0)==0){break}c[v>>2]=0;c[w>>2]=0;c[x>>2]=0;c[s>>2]=J;b[K>>1]=b[K>>1]|1;L=1;while(1){M=L-1|0;N=c[s+(M<<2)>>2]|0;O=N+4|0;if((b[O>>1]&32)==0){P=1516;break L1906}Q=c[v>>2]|0;if((Q|0)>=(c[y>>2]|0)){P=1519;break L1906}c[N+8>>2]=Q;c[(c[z>>2]|0)+(c[v>>2]<<2)>>2]=N;c[v>>2]=(c[v>>2]|0)+1;Q=b[O>>1]|0;if((Q&2)==0){b[O>>1]=Q|2;g[N+144>>2]=0.0}do{if((c[N>>2]|0)==0){R=M}else{Q=c[N+112>>2]|0;if((Q|0)==0){S=M}else{O=M;T=Q;while(1){Q=c[T+4>>2]|0;U=Q+4|0;do{if((c[U>>2]&7|0)==6){if((a[(c[Q+48>>2]|0)+38|0]&1)!=0){V=O;break}if((a[(c[Q+52>>2]|0)+38|0]&1)!=0){V=O;break}W=c[w>>2]|0;if((W|0)>=(c[C>>2]|0)){P=1530;break L1906}c[w>>2]=W+1;c[(c[D>>2]|0)+(W<<2)>>2]=Q;c[U>>2]=c[U>>2]|1;W=c[T>>2]|0;X=W+4|0;if((b[X>>1]&1)!=0){V=O;break}if((O|0)>=(t|0)){P=1534;break L1906}c[s+(O<<2)>>2]=W;b[X>>1]=b[X>>1]|1;V=O+1|0}else{V=O}}while(0);U=c[T+12>>2]|0;if((U|0)==0){S=V;break}else{O=V;T=U}}}T=c[N+108>>2]|0;if((T|0)==0){R=S;break}else{Y=S;Z=T}while(1){T=Z+4|0;O=c[T>>2]|0;do{if((a[O+60|0]&1)==0){U=c[Z>>2]|0;Q=U+4|0;if((b[Q>>1]&32)==0){_=Y;break}X=c[x>>2]|0;if((X|0)>=(c[A>>2]|0)){P=1542;break L1906}c[x>>2]=X+1;c[(c[B>>2]|0)+(X<<2)>>2]=O;a[(c[T>>2]|0)+60|0]=1;if((b[Q>>1]&1)!=0){_=Y;break}if((Y|0)>=(t|0)){P=1546;break L1906}c[s+(Y<<2)>>2]=U;b[Q>>1]=b[Q>>1]|1;_=Y+1|0}else{_=Y}}while(0);T=c[Z+12>>2]|0;if((T|0)==0){R=_;break}else{Y=_;Z=T}}}}while(0);if((R|0)>0){L=R}else{break}}cV(h,j,e,E,(a[F]&1)!=0);g[l>>2]=+g[G>>2]+ +g[l>>2];g[m>>2]=+g[H>>2]+ +g[m>>2];g[n>>2]=+g[I>>2]+ +g[n>>2];L=c[v>>2]|0;if((L|0)>0){$=0;aa=L}else{break}while(1){L=c[(c[z>>2]|0)+($<<2)>>2]|0;if((c[L>>2]|0)==0){N=L+4|0;b[N>>1]=b[N>>1]&-2;ab=c[v>>2]|0}else{ab=aa}N=$+1|0;if((N|0)<(ab|0)){$=N;aa=ab}else{break}}}}while(0);J=c[J+96>>2]|0;if((J|0)==0){break L1904}}if((P|0)==1530){at(1592,1696,62,4616)}else if((P|0)==1534){at(568,3928,495,4640)}else if((P|0)==1516){at(952,3928,445,4640)}else if((P|0)==1546){at(568,3928,524,4640)}else if((P|0)==1519){at(1488,1696,54,4616)}else if((P|0)==1542){at(1784,1696,68,4616)}}}while(0);cn(q,o);co(k);o=c[r>>2]|0;if((o|0)!=0){r=o;do{do{if((b[r+4>>1]&1)!=0){if((c[r>>2]|0)==0){break}ct(r)}}while(0);r=c[r+96>>2]|0;}while((r|0)!=0)}cB(p);g[d+103020>>2]=+cq(k);cU(h);i=f;return}function c0(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0.0,ab=0,ac=0,ad=0,ae=0,af=0.0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0.0,ar=0.0,as=0.0,au=0.0,av=0,aw=0.0,ax=0.0,ay=0.0,az=0.0,aA=0,aB=0.0,aC=0.0,aD=0,aE=0,aF=0,aG=0,aH=0,aI=0,aJ=0,aK=0,aL=0,aM=0,aN=0,aO=0,aP=0,aQ=0,aR=0;f=i;i=i+352|0;h=f|0;j=f+56|0;k=f+192|0;l=f+200|0;m=f+240|0;n=f+280|0;o=f+288|0;p=f+328|0;q=d+102872|0;r=d+102944|0;cT(h,64,32,0,d+68|0,c[r>>2]|0);s=d+102995|0;do{if((a[s]&1)==0){t=d+102932|0}else{u=c[d+102952>>2]|0;if((u|0)!=0){v=u;do{u=v+4|0;b[u>>1]=b[u>>1]&-2;g[v+60>>2]=0.0;v=c[v+96>>2]|0;}while((v|0)!=0)}v=d+102932|0;u=c[v>>2]|0;if((u|0)==0){t=v;break}else{w=u}while(1){u=w+4|0;c[u>>2]=c[u>>2]&-34;c[w+128>>2]=0;g[w+132>>2]=1.0;u=c[w+12>>2]|0;if((u|0)==0){t=v;break}else{w=u}}}}while(0);w=l;l=m;m=h+28|0;v=h+36|0;u=h+32|0;x=h+40|0;y=h+8|0;z=h+44|0;A=h+12|0;B=n|0;C=n+4|0;D=o;o=e|0;E=p|0;F=p+4|0;G=p+8|0;H=p+16|0;I=e+12|0;e=p+12|0;J=p+20|0;K=d+102994|0;d=j+16|0;L=j+20|0;M=j+24|0;N=j+44|0;O=j+48|0;P=j+52|0;Q=j|0;T=j+28|0;U=j+56|0;V=j+92|0;W=j+128|0;X=k|0;Y=k+4|0;L1987:while(1){Z=c[t>>2]|0;if((Z|0)==0){_=1;$=1690;break}else{aa=1.0;ab=0;ac=Z}while(1){Z=ac+4|0;ad=c[Z>>2]|0;do{if((ad&4|0)==0){ae=ab;af=aa}else{if((c[ac+128>>2]|0)>8){ae=ab;af=aa;break}if((ad&32|0)==0){ag=c[ac+48>>2]|0;ah=c[ac+52>>2]|0;if((a[ag+38|0]&1)!=0){ae=ab;af=aa;break}if((a[ah+38|0]&1)!=0){ae=ab;af=aa;break}ai=c[ag+8>>2]|0;aj=c[ah+8>>2]|0;ak=c[ai>>2]|0;al=c[aj>>2]|0;am=(al|0)==2;if(!((ak|0)==2|am)){$=1589;break L1987}an=b[ai+4>>1]|0;ao=b[aj+4>>1]|0;if(((an&2)==0|(ak|0)==0)&((ao&2)==0|(al|0)==0)){ae=ab;af=aa;break}if((an&8)==0){ap=(ak|0)!=2|0}else{ap=1}if((ao&8)==0){if((ap|0)==0&am){ae=ab;af=aa;break}}am=ai+28|0;ao=ai+60|0;aq=+g[ao>>2];ak=aj+28|0;an=aj+60|0;ar=+g[an>>2];do{if(aq<ar){if(aq>=1.0){$=1598;break L1987}as=(ar-aq)/(1.0-aq);al=ai+36|0;au=1.0-as;av=al;aw=+(au*+g[ai+40>>2]+as*+g[ai+48>>2]);g[av>>2]=+g[al>>2]*au+as*+g[ai+44>>2];g[av+4>>2]=aw;av=ai+52|0;g[av>>2]=au*+g[av>>2]+as*+g[ai+56>>2];g[ao>>2]=ar;ax=ar}else{if(ar>=aq){ax=aq;break}if(ar>=1.0){$=1603;break L1987}as=(aq-ar)/(1.0-ar);av=aj+36|0;au=1.0-as;al=av;aw=+(au*+g[aj+40>>2]+as*+g[aj+48>>2]);g[al>>2]=+g[av>>2]*au+as*+g[aj+44>>2];g[al+4>>2]=aw;al=aj+52|0;g[al>>2]=au*+g[al>>2]+as*+g[aj+56>>2];g[an>>2]=aq;ax=aq}}while(0);if(ax>=1.0){$=1607;break L1987}an=c[ac+56>>2]|0;aj=c[ac+60>>2]|0;c[d>>2]=0;c[L>>2]=0;g[M>>2]=0.0;c[N>>2]=0;c[O>>2]=0;g[P>>2]=0.0;bG(Q,c[ag+12>>2]|0,an);bG(T,c[ah+12>>2]|0,aj);aj=am;ea(U|0,aj|0,36)|0;aj=ak;ea(V|0,aj|0,36)|0;g[W>>2]=1.0;bT(k,j);if((c[X>>2]|0)==3){aq=ax+(1.0-ax)*+g[Y>>2];ay=aq<1.0?aq:1.0}else{ay=1.0}g[ac+132>>2]=ay;c[Z>>2]=c[Z>>2]|32;az=ay}else{az=+g[ac+132>>2]}if(az>=aa){ae=ab;af=aa;break}ae=ac;af=az}}while(0);Z=c[ac+12>>2]|0;if((Z|0)==0){break}else{aa=af;ab=ae;ac=Z}}if((ae|0)==0|af>.9999988079071045){_=1;$=1691;break}Z=c[(c[ae+48>>2]|0)+8>>2]|0;ad=c[(c[ae+52>>2]|0)+8>>2]|0;aj=Z+28|0;ea(w|0,aj|0,36)|0;an=ad+28|0;ea(l|0,an|0,36)|0;ao=Z+60|0;aq=+g[ao>>2];if(aq>=1.0){$=1620;break}ar=(af-aq)/(1.0-aq);ai=Z+36|0;aq=1.0-ar;al=Z+44|0;av=Z+48|0;as=+g[ai>>2]*aq+ar*+g[al>>2];au=aq*+g[Z+40>>2]+ar*+g[av>>2];aA=ai;aw=+as;aB=+au;g[aA>>2]=aw;g[aA+4>>2]=aB;aA=Z+52|0;ai=Z+56|0;aC=aq*+g[aA>>2]+ar*+g[ai>>2];g[aA>>2]=aC;g[ao>>2]=af;ao=Z+44|0;g[ao>>2]=aw;g[ao+4>>2]=aB;g[ai>>2]=aC;aB=+S(aC);ao=Z+20|0;g[ao>>2]=aB;aw=+R(aC);aA=Z+24|0;g[aA>>2]=aw;aD=Z+28|0;aC=+g[aD>>2];aE=Z+32|0;ar=+g[aE>>2];aF=Z+12|0;aq=+(au-(aB*aC+aw*ar));g[aF>>2]=as-(aw*aC-aB*ar);g[aF+4>>2]=aq;aG=ad+60|0;aq=+g[aG>>2];if(aq>=1.0){$=1623;break}ar=(af-aq)/(1.0-aq);aH=ad+36|0;aq=1.0-ar;aI=ad+44|0;aJ=ad+48|0;aB=+g[aH>>2]*aq+ar*+g[aI>>2];aC=aq*+g[ad+40>>2]+ar*+g[aJ>>2];aK=aH;aw=+aB;as=+aC;g[aK>>2]=aw;g[aK+4>>2]=as;aK=ad+52|0;aH=ad+56|0;au=aq*+g[aK>>2]+ar*+g[aH>>2];g[aK>>2]=au;g[aG>>2]=af;aG=ad+44|0;g[aG>>2]=aw;g[aG+4>>2]=as;g[aH>>2]=au;as=+S(au);aG=ad+20|0;g[aG>>2]=as;aw=+R(au);aK=ad+24|0;g[aK>>2]=aw;aL=ad+28|0;au=+g[aL>>2];aM=ad+32|0;ar=+g[aM>>2];aN=ad+12|0;aq=+(aC-(as*au+aw*ar));g[aN>>2]=aB-(aw*au-as*ar);g[aN+4>>2]=aq;dn(ae,c[r>>2]|0);aO=ae+4|0;aP=c[aO>>2]|0;c[aO>>2]=aP&-33;aQ=ae+128|0;c[aQ>>2]=(c[aQ>>2]|0)+1;if((aP&6|0)!=6){c[aO>>2]=aP&-37;ea(aj|0,w|0,36)|0;ea(an|0,l|0,36)|0;aq=+g[ai>>2];ar=+S(aq);g[ao>>2]=ar;as=+R(aq);g[aA>>2]=as;aq=+g[aD>>2];au=+g[aE>>2];aw=+(+g[av>>2]-(ar*aq+as*au));g[aF>>2]=+g[al>>2]-(as*aq-ar*au);g[aF+4>>2]=aw;aw=+g[aH>>2];au=+S(aw);g[aG>>2]=au;ar=+R(aw);g[aK>>2]=ar;aw=+g[aL>>2];aq=+g[aM>>2];as=+(+g[aJ>>2]-(au*aw+ar*aq));g[aN>>2]=+g[aI>>2]-(ar*aw-au*aq);g[aN+4>>2]=as;continue}aN=Z+4|0;aI=b[aN>>1]|0;if((aI&2)==0){b[aN>>1]=aI|2;g[Z+144>>2]=0.0}aI=ad+4|0;aJ=b[aI>>1]|0;if((aJ&2)==0){b[aI>>1]=aJ|2;g[ad+144>>2]=0.0}c[m>>2]=0;c[v>>2]=0;c[u>>2]=0;if((c[x>>2]|0)<=0){$=1633;break}aJ=Z+8|0;c[aJ>>2]=0;c[(c[y>>2]|0)+(c[m>>2]<<2)>>2]=Z;aM=(c[m>>2]|0)+1|0;c[m>>2]=aM;if((aM|0)>=(c[x>>2]|0)){$=1636;break}aL=ad+8|0;c[aL>>2]=aM;c[(c[y>>2]|0)+(c[m>>2]<<2)>>2]=ad;c[m>>2]=(c[m>>2]|0)+1;aM=c[v>>2]|0;if((aM|0)>=(c[z>>2]|0)){$=1639;break}c[v>>2]=aM+1;c[(c[A>>2]|0)+(aM<<2)>>2]=ae;b[aN>>1]=b[aN>>1]|1;b[aI>>1]=b[aI>>1]|1;c[aO>>2]=c[aO>>2]|1;c[B>>2]=Z;c[C>>2]=ad;ad=1;aO=Z;while(1){L2043:do{if((c[aO>>2]|0)==2){Z=c[aO+112>>2]|0;if((Z|0)==0){break}aI=aO+4|0;aN=Z;do{if((c[m>>2]|0)==(c[x>>2]|0)){break L2043}if((c[v>>2]|0)==(c[z>>2]|0)){break L2043}Z=c[aN+4>>2]|0;aM=Z+4|0;L2050:do{if((c[aM>>2]&1|0)==0){aK=c[aN>>2]|0;aG=aK|0;do{if((c[aG>>2]|0)==2){if((b[aI>>1]&8)!=0){break}if((b[aK+4>>1]&8)==0){break L2050}}}while(0);if((a[(c[Z+48>>2]|0)+38|0]&1)!=0){break}if((a[(c[Z+52>>2]|0)+38|0]&1)!=0){break}aH=aK+28|0;ea(D|0,aH|0,36)|0;aF=aK+4|0;if((b[aF>>1]&1)==0){al=aK+60|0;as=+g[al>>2];if(as>=1.0){$=1655;break L1987}aq=(af-as)/(1.0-as);av=aK+36|0;as=1.0-aq;au=+g[av>>2]*as+aq*+g[aK+44>>2];aw=as*+g[aK+40>>2]+aq*+g[aK+48>>2];aE=av;ar=+au;aB=+aw;g[aE>>2]=ar;g[aE+4>>2]=aB;aE=aK+52|0;av=aK+56|0;aC=as*+g[aE>>2]+aq*+g[av>>2];g[aE>>2]=aC;g[al>>2]=af;al=aK+44|0;g[al>>2]=ar;g[al+4>>2]=aB;g[av>>2]=aC;aB=+S(aC);g[aK+20>>2]=aB;ar=+R(aC);g[aK+24>>2]=ar;aC=+g[aK+28>>2];aq=+g[aK+32>>2];av=aK+12|0;as=+(aw-(aB*aC+ar*aq));g[av>>2]=au-(ar*aC-aB*aq);g[av+4>>2]=as}dn(Z,c[r>>2]|0);av=c[aM>>2]|0;if((av&4|0)==0){ea(aH|0,D|0,36)|0;as=+g[aK+56>>2];aq=+S(as);g[aK+20>>2]=aq;aB=+R(as);g[aK+24>>2]=aB;as=+g[aK+28>>2];aC=+g[aK+32>>2];al=aK+12|0;ar=+(+g[aK+48>>2]-(aq*as+aB*aC));g[al>>2]=+g[aK+44>>2]-(aB*as-aq*aC);g[al+4>>2]=ar;break}if((av&2|0)==0){ea(aH|0,D|0,36)|0;ar=+g[aK+56>>2];aC=+S(ar);g[aK+20>>2]=aC;aq=+R(ar);g[aK+24>>2]=aq;ar=+g[aK+28>>2];as=+g[aK+32>>2];aH=aK+12|0;aB=+(+g[aK+48>>2]-(aC*ar+aq*as));g[aH>>2]=+g[aK+44>>2]-(aq*ar-aC*as);g[aH+4>>2]=aB;break}c[aM>>2]=av|1;av=c[v>>2]|0;if((av|0)>=(c[z>>2]|0)){$=1664;break L1987}c[v>>2]=av+1;c[(c[A>>2]|0)+(av<<2)>>2]=Z;av=b[aF>>1]|0;if((av&1)!=0){break}b[aF>>1]=av|1;do{if((c[aG>>2]|0)!=0){if((av&2)!=0){break}b[aF>>1]=av|3;g[aK+144>>2]=0.0}}while(0);av=c[m>>2]|0;if((av|0)>=(c[x>>2]|0)){$=1671;break L1987}c[aK+8>>2]=av;c[(c[y>>2]|0)+(c[m>>2]<<2)>>2]=aK;c[m>>2]=(c[m>>2]|0)+1}}while(0);aN=c[aN+12>>2]|0;}while((aN|0)!=0)}}while(0);if((ad|0)>=2){break}aN=c[n+(ad<<2)>>2]|0;ad=ad+1|0;aO=aN}aB=(1.0-af)*+g[o>>2];g[E>>2]=aB;g[F>>2]=1.0/aB;g[G>>2]=1.0;c[H>>2]=20;c[e>>2]=c[I>>2];a[J]=0;cW(h,p,c[aJ>>2]|0,c[aL>>2]|0);if((c[m>>2]|0)>0){aO=0;do{ad=c[(c[y>>2]|0)+(aO<<2)>>2]|0;aN=ad+4|0;b[aN>>1]=b[aN>>1]&-2;do{if((c[ad>>2]|0)==2){ct(ad);aN=c[ad+112>>2]|0;if((aN|0)==0){break}else{aR=aN}do{aN=(c[aR+4>>2]|0)+4|0;c[aN>>2]=c[aN>>2]&-34;aR=c[aR+12>>2]|0;}while((aR|0)!=0)}}while(0);aO=aO+1|0;}while((aO|0)<(c[m>>2]|0))}cB(q);if((a[K]&1)!=0){_=0;$=1689;break}}if(($|0)==1671){at(1488,1696,54,4616)}else if(($|0)==1598){at(184,1816,715,4664)}else if(($|0)==1664){at(1592,1696,62,4616)}else if(($|0)==1607){at(184,3928,676,4624)}else if(($|0)==1655){at(184,1816,715,4664)}else if(($|0)==1689){a[s]=_;cU(h);i=f;return}else if(($|0)==1690){a[s]=_;cU(h);i=f;return}else if(($|0)==1691){a[s]=_;cU(h);i=f;return}else if(($|0)==1589){at(304,3928,641,4624)}else if(($|0)==1633){at(1488,1696,54,4616)}else if(($|0)==1620){at(184,1816,715,4664)}else if(($|0)==1636){at(1488,1696,54,4616)}else if(($|0)==1639){at(1592,1696,62,4616)}else if(($|0)==1623){at(184,1816,715,4664)}else if(($|0)==1603){at(184,1816,715,4664)}}function c1(b,d,e,f){b=b|0;d=+d;e=e|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0,u=0,v=0.0,w=0,x=0;h=i;i=i+56|0;j=h|0;k=h+8|0;l=h+32|0;m=h+40|0;n=h+48|0;co(j);o=b+102868|0;p=c[o>>2]|0;if((p&1|0)==0){q=p}else{cB(b+102872|0);p=c[o>>2]&-2;c[o>>2]=p;q=p}c[o>>2]=q|2;q=k|0;g[q>>2]=d;c[k+12>>2]=e;c[k+16>>2]=f;f=d>0.0;if(f){g[k+4>>2]=1.0/d}else{g[k+4>>2]=0.0}e=b+102988|0;g[k+8>>2]=+g[e>>2]*d;a[k+20|0]=a[b+102992|0]&1;co(l);cA(b+102872|0);g[b+103e3>>2]=+cq(l);if(!((a[b+102995|0]&1)==0|f^1)){co(m);c$(b,k);g[b+103004>>2]=+cq(m)}do{if((a[b+102993|0]&1)==0){r=1702}else{d=+g[q>>2];if(d<=0.0){s=d;break}co(n);c0(b,k);g[b+103024>>2]=+cq(n);r=1702}}while(0);if((r|0)==1702){s=+g[q>>2]}if(s>0.0){g[e>>2]=+g[k+4>>2]}k=c[o>>2]|0;if((k&4|0)==0){t=k;u=t&-3;c[o>>2]=u;v=+cq(j);w=b+102996|0;g[w>>2]=v;i=h;return}e=c[b+102952>>2]|0;if((e|0)==0){t=k;u=t&-3;c[o>>2]=u;v=+cq(j);w=b+102996|0;g[w>>2]=v;i=h;return}else{x=e}do{g[x+76>>2]=0.0;g[x+80>>2]=0.0;g[x+84>>2]=0.0;x=c[x+96>>2]|0;}while((x|0)!=0);t=c[o>>2]|0;u=t&-3;c[o>>2]=u;v=+cq(j);w=b+102996|0;g[w>>2]=v;i=h;return}function c2(a,c,d){a=a|0;c=c|0;d=d|0;var e=0;a=b[c+36>>1]|0;if(!(a<<16>>16!=(b[d+36>>1]|0)|a<<16>>16==0)){e=a<<16>>16>0;return e|0}if((b[d+32>>1]&b[c+34>>1])<<16>>16==0){e=0;return e|0}e=(b[d+34>>1]&b[c+32>>1])<<16>>16!=0;return e|0}function c3(a){a=a|0;return}function c4(a){a=a|0;d8(a);return}function c5(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;g=cg(f,144)|0;if((g|0)==0){h=0;i=h|0;return i|0}dm(g,a,b,d,e);c[g>>2]=5416;if((c[(c[(c[g+48>>2]|0)+12>>2]|0)+4>>2]|0)!=3){at(2504,3792,43,4816);return 0}if((c[(c[(c[g+52>>2]|0)+12>>2]|0)+4>>2]|0)==0){h=g;i=h|0;return i|0}else{at(2344,3792,44,4816);return 0}return 0}function c6(a,b){a=a|0;b=b|0;aX[c[(c[a>>2]|0)+4>>2]&127](a);ch(b,a,144);return}function c7(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0;f=i;i=i+48|0;h=f|0;j=c[(c[a+48>>2]|0)+12>>2]|0;c[h>>2]=5664;c[h+4>>2]=1;g[h+8>>2]=.009999999776482582;eb(h+28|0,0,18);bX(j,h,c[a+56>>2]|0);bw(b,h,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function c8(a){a=a|0;return}function c9(a){a=a|0;d8(a);return}function da(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;g=cg(f,144)|0;if((g|0)==0){h=0;i=h|0;return i|0}dm(g,a,b,d,e);c[g>>2]=5352;if((c[(c[(c[g+48>>2]|0)+12>>2]|0)+4>>2]|0)!=3){at(2392,3720,43,4760);return 0}if((c[(c[(c[g+52>>2]|0)+12>>2]|0)+4>>2]|0)==2){h=g;i=h|0;return i|0}else{at(2248,3720,44,4760);return 0}return 0}function db(a,b){a=a|0;b=b|0;aX[c[(c[a>>2]|0)+4>>2]&127](a);ch(b,a,144);return}function dc(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0;f=i;i=i+48|0;h=f|0;j=c[(c[a+48>>2]|0)+12>>2]|0;c[h>>2]=5664;c[h+4>>2]=1;g[h+8>>2]=.009999999776482582;eb(h+28|0,0,18);bX(j,h,c[a+56>>2]|0);bz(b,h,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function dd(a){a=a|0;return}function de(a){a=a|0;d8(a);return}function df(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=cg(f,144)|0;if((e|0)==0){g=0;h=g|0;return h|0}dm(e,a,0,d,0);c[e>>2]=5584;if((c[(c[(c[e+48>>2]|0)+12>>2]|0)+4>>2]|0)!=0){at(2296,3656,44,5088);return 0}if((c[(c[(c[e+52>>2]|0)+12>>2]|0)+4>>2]|0)==0){g=e;h=g|0;return h|0}else{at(2200,3656,45,5088);return 0}return 0}function dg(a,b){a=a|0;b=b|0;aX[c[(c[a>>2]|0)+4>>2]&127](a);ch(b,a,144);return}function dh(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bu(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function di(a){a=a|0;return}function dj(a){a=a|0;d8(a);return}function dk(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0;if((a[7024]&1)==0){c[1758]=10;c[1759]=2;a[7040]=1;c[1782]=8;c[1783]=8;a[7136]=1;c[1764]=8;c[1765]=8;a[7064]=0;c[1788]=2;c[1789]=14;a[7160]=1;c[1770]=6;c[1771]=22;a[7088]=1;c[1761]=6;c[1762]=22;a[7052]=0;c[1776]=18;c[1777]=20;a[7112]=1;c[1785]=18;c[1786]=20;a[7148]=0;c[1794]=12;c[1795]=18;a[7184]=1;c[1767]=12;c[1768]=18;a[7076]=0;c[1800]=16;c[1801]=4;a[7208]=1;c[1791]=16;c[1792]=4;a[7172]=0;a[7024]=1}h=c[(c[b+12>>2]|0)+4>>2]|0;i=c[(c[e+12>>2]|0)+4>>2]|0;if(h>>>0>=4>>>0){at(2072,3600,80,4592);return 0}if(i>>>0>=4>>>0){at(2152,3600,81,4592);return 0}j=c[7032+(h*48|0)+(i*12|0)>>2]|0;if((j|0)==0){k=0;return k|0}if((a[7032+(h*48|0)+(i*12|0)+8|0]&1)==0){k=a3[j&31](e,f,b,d,g)|0;return k|0}else{k=a3[j&31](b,d,e,f,g)|0;return k|0}return 0}function dl(d,e){d=d|0;e=e|0;var f=0,h=0,i=0,j=0,k=0,l=0;if((a[7024]&1)==0){at(1320,3600,103,4584)}f=d+48|0;do{if((c[d+124>>2]|0)>0){h=c[(c[f>>2]|0)+8>>2]|0;i=h+4|0;j=b[i>>1]|0;if((j&2)==0){b[i>>1]=j|2;g[h+144>>2]=0.0}h=d+52|0;j=c[(c[h>>2]|0)+8>>2]|0;i=j+4|0;k=b[i>>1]|0;if((k&2)!=0){l=h;break}b[i>>1]=k|2;g[j+144>>2]=0.0;l=h}else{l=d+52|0}}while(0);h=c[(c[(c[f>>2]|0)+12>>2]|0)+4>>2]|0;f=c[(c[(c[l>>2]|0)+12>>2]|0)+4>>2]|0;if((h|0)>-1&(f|0)<4){aY[c[7032+(h*48|0)+(f*12|0)+4>>2]&31](d,e);return}else{at(856,3600,114,4584)}}function dm(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0.0,i=0.0;c[a>>2]=5288;c[a+4>>2]=4;c[a+48>>2]=b;c[a+52>>2]=e;c[a+56>>2]=d;c[a+60>>2]=f;c[a+124>>2]=0;c[a+128>>2]=0;eb(a+8|0,0,40);g[a+136>>2]=+P(+g[b+16>>2]*+g[e+16>>2]);h=+g[b+20>>2];i=+g[e+20>>2];g[a+140>>2]=h>i?h:i;return}function dn(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;f=i;i=i+64|0;h=f|0;j=d+64|0;k=h;l=j;ea(k|0,l|0,64)|0;l=d+4|0;k=c[l>>2]|0;c[l>>2]=k|4;m=k>>>1;k=c[d+48>>2]|0;n=c[d+52>>2]|0;o=((a[n+38|0]|a[k+38|0])&1)!=0;p=c[k+8>>2]|0;q=c[n+8>>2]|0;r=p+12|0;s=q+12|0;do{if(o){t=bF(c[k+12>>2]|0,c[d+56>>2]|0,c[n+12>>2]|0,c[d+60>>2]|0,r,s)|0;c[d+124>>2]=0;u=t;v=m&1}else{a4[c[c[d>>2]>>2]&31](d,j,r,s);t=d+124|0;w=(c[t>>2]|0)>0;if(w){x=c[h+60>>2]|0;y=0;do{z=d+64+(y*20|0)+8|0;g[z>>2]=0.0;A=d+64+(y*20|0)+12|0;g[A>>2]=0.0;B=c[d+64+(y*20|0)+16>>2]|0;C=0;while(1){if((C|0)>=(x|0)){break}if((c[h+(C*20|0)+16>>2]|0)==(B|0)){D=1792;break}else{C=C+1|0}}if((D|0)==1792){D=0;g[z>>2]=+g[h+(C*20|0)+8>>2];g[A>>2]=+g[h+(C*20|0)+12>>2]}y=y+1|0;}while((y|0)<(c[t>>2]|0))}t=m&1;if(!(w^(t|0)!=0)){u=w;v=t;break}y=p+4|0;x=b[y>>1]|0;if((x&2)==0){b[y>>1]=x|2;g[p+144>>2]=0.0}x=q+4|0;y=b[x>>1]|0;if((y&2)!=0){u=w;v=t;break}b[x>>1]=y|2;g[q+144>>2]=0.0;u=w;v=t}}while(0);q=c[l>>2]|0;c[l>>2]=u?q|2:q&-3;q=(v|0)==0;v=u^1;l=(e|0)==0;if(!(q^1|v|l)){aY[c[(c[e>>2]|0)+8>>2]&31](e,d)}if(!(q|u|l)){aY[c[(c[e>>2]|0)+12>>2]&31](e,d)}if(o|v|l){i=f;return}a_[c[(c[e>>2]|0)+16>>2]&7](e,d,h);i=f;return}function dp(a){a=a|0;return}function dq(a){a=a|0;d8(a);return}function dr(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0,v=0,w=0,x=0,y=0,z=0;e=b;f=d;c[e>>2]=c[f>>2];c[e+4>>2]=c[f+4>>2];c[e+8>>2]=c[f+8>>2];c[e+12>>2]=c[f+12>>2];c[e+16>>2]=c[f+16>>2];c[e+20>>2]=c[f+20>>2];f=c[d+40>>2]|0;e=b+32|0;c[e>>2]=f;h=c[d+28>>2]|0;i=b+48|0;c[i>>2]=h;j=b+36|0;c[j>>2]=cm(f,h*88|0)|0;h=b+40|0;c[h>>2]=cm(c[e>>2]|0,(c[i>>2]|0)*152|0)|0;c[b+24>>2]=c[d+32>>2];c[b+28>>2]=c[d+36>>2];e=c[d+24>>2]|0;d=b+44|0;c[d>>2]=e;if((c[i>>2]|0)<=0){return}f=b+20|0;k=b+8|0;b=0;l=e;while(1){e=c[l+(b<<2)>>2]|0;m=c[e+48>>2]|0;n=c[e+52>>2]|0;o=c[m+8>>2]|0;p=c[n+8>>2]|0;q=c[e+124>>2]|0;if((q|0)<=0){r=1813;break}s=+g[(c[n+12>>2]|0)+8>>2];t=+g[(c[m+12>>2]|0)+8>>2];m=c[h>>2]|0;g[m+(b*152|0)+136>>2]=+g[e+136>>2];g[m+(b*152|0)+140>>2]=+g[e+140>>2];n=o+8|0;c[m+(b*152|0)+112>>2]=c[n>>2];u=p+8|0;c[m+(b*152|0)+116>>2]=c[u>>2];v=o+120|0;g[m+(b*152|0)+120>>2]=+g[v>>2];w=p+120|0;g[m+(b*152|0)+124>>2]=+g[w>>2];x=o+128|0;g[m+(b*152|0)+128>>2]=+g[x>>2];y=p+128|0;g[m+(b*152|0)+132>>2]=+g[y>>2];c[m+(b*152|0)+148>>2]=b;c[m+(b*152|0)+144>>2]=q;eb(m+(b*152|0)+80|0,0,32);z=c[j>>2]|0;c[z+(b*88|0)+32>>2]=c[n>>2];c[z+(b*88|0)+36>>2]=c[u>>2];g[z+(b*88|0)+40>>2]=+g[v>>2];g[z+(b*88|0)+44>>2]=+g[w>>2];w=o+28|0;o=z+(b*88|0)+48|0;v=c[w+4>>2]|0;c[o>>2]=c[w>>2];c[o+4>>2]=v;v=p+28|0;p=z+(b*88|0)+56|0;o=c[v+4>>2]|0;c[p>>2]=c[v>>2];c[p+4>>2]=o;g[z+(b*88|0)+64>>2]=+g[x>>2];g[z+(b*88|0)+68>>2]=+g[y>>2];y=e+104|0;x=z+(b*88|0)+16|0;o=c[y+4>>2]|0;c[x>>2]=c[y>>2];c[x+4>>2]=o;o=e+112|0;x=z+(b*88|0)+24|0;y=c[o+4>>2]|0;c[x>>2]=c[o>>2];c[x+4>>2]=y;c[z+(b*88|0)+84>>2]=q;g[z+(b*88|0)+76>>2]=t;g[z+(b*88|0)+80>>2]=s;c[z+(b*88|0)+72>>2]=c[e+120>>2];y=0;do{if((a[f]&1)==0){g[m+(b*152|0)+(y*36|0)+16>>2]=0.0;g[m+(b*152|0)+(y*36|0)+20>>2]=0.0}else{g[m+(b*152|0)+(y*36|0)+16>>2]=+g[k>>2]*+g[e+64+(y*20|0)+8>>2];g[m+(b*152|0)+(y*36|0)+20>>2]=+g[k>>2]*+g[e+64+(y*20|0)+12>>2]}g[m+(b*152|0)+(y*36|0)+24>>2]=0.0;g[m+(b*152|0)+(y*36|0)+28>>2]=0.0;g[m+(b*152|0)+(y*36|0)+32>>2]=0.0;x=e+64+(y*20|0)|0;o=z+(b*88|0)+(y<<3)|0;eb(m+(b*152|0)+(y*36|0)|0,0,16);p=c[x+4>>2]|0;c[o>>2]=c[x>>2];c[o+4>>2]=p;y=y+1|0;}while((y|0)<(q|0));q=b+1|0;if((q|0)>=(c[i>>2]|0)){r=1822;break}b=q;l=c[d>>2]|0}if((r|0)==1813){at(1856,3512,71,5008)}else if((r|0)==1822){return}}function ds(a){a=a|0;var b=0;b=a+32|0;cn(c[b>>2]|0,c[a+40>>2]|0);cn(c[b>>2]|0,c[a+36>>2]|0);return}function dt(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0.0,C=0.0,D=0.0,E=0.0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0,L=0.0,M=0.0,N=0.0,O=0,P=0.0,Q=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0,af=0,ag=0,ah=0.0,ai=0.0,aj=0.0;b=i;i=i+16|0;d=b|0;e=d|0;f=d;h=i;i=i+16|0;j=h|0;k=h;l=i;i=i+24|0;m=l|0;n=l;o=a+48|0;if((c[o>>2]|0)<=0){i=b;return}p=a+40|0;q=a+36|0;r=a+44|0;s=a+24|0;t=a+28|0;a=d+8|0;d=a;u=a+4|0;a=h+8|0;h=a;v=a+4|0;a=l+8|0;l=0;while(1){w=c[p>>2]|0;x=c[q>>2]|0;y=c[(c[r>>2]|0)+(c[w+(l*152|0)+148>>2]<<2)>>2]|0;z=c[w+(l*152|0)+112>>2]|0;A=c[w+(l*152|0)+116>>2]|0;B=+g[w+(l*152|0)+120>>2];C=+g[w+(l*152|0)+124>>2];D=+g[w+(l*152|0)+128>>2];E=+g[w+(l*152|0)+132>>2];F=x+(l*88|0)+48|0;G=+g[F>>2];H=+g[F+4>>2];F=x+(l*88|0)+56|0;I=+g[F>>2];J=+g[F+4>>2];F=c[s>>2]|0;K=F+(z*12|0)|0;L=+g[K>>2];M=+g[K+4>>2];N=+g[F+(z*12|0)+8>>2];K=c[t>>2]|0;O=K+(z*12|0)|0;P=+g[O>>2];Q=+g[O+4>>2];T=+g[K+(z*12|0)+8>>2];z=F+(A*12|0)|0;U=+g[z>>2];V=+g[z+4>>2];W=+g[F+(A*12|0)+8>>2];F=K+(A*12|0)|0;X=+g[F>>2];Y=+g[F+4>>2];Z=+g[K+(A*12|0)+8>>2];if((c[y+124>>2]|0)<=0){_=1828;break}$=+g[x+(l*88|0)+80>>2];aa=+g[x+(l*88|0)+76>>2];ab=+S(N);g[d>>2]=ab;ac=+R(N);g[u>>2]=ac;N=+S(W);g[h>>2]=N;ad=+R(W);g[v>>2]=ad;W=+(M-(H*ac+G*ab));g[e>>2]=L-(G*ac-H*ab);g[e+4>>2]=W;W=+(V-(J*ad+I*N));g[j>>2]=U-(I*ad-J*N);g[j+4>>2]=W;bD(n,y+64|0,f,aa,k,$);y=w+(l*152|0)+72|0;x=y;A=c[m+4>>2]|0;c[x>>2]=c[m>>2];c[x+4>>2]=A;A=w+(l*152|0)+144|0;x=c[A>>2]|0;do{if((x|0)>0){K=w+(l*152|0)+76|0;F=y|0;$=B+C;aa=-0.0-Z;W=-0.0-T;z=w+(l*152|0)+140|0;O=0;do{ae=a+(O<<3)|0;N=+g[ae>>2]-L;af=a+(O<<3)+4|0;ag=w+(l*152|0)+(O*36|0)|0;J=+(+g[af>>2]-M);g[ag>>2]=N;g[ag+4>>2]=J;J=+g[ae>>2]-U;ae=w+(l*152|0)+(O*36|0)+8|0;ad=+(+g[af>>2]-V);g[ae>>2]=J;g[ae+4>>2]=ad;ad=+g[K>>2];I=+g[w+(l*152|0)+(O*36|0)+4>>2];ab=+g[F>>2];H=N*ad-I*ab;ac=+g[w+(l*152|0)+(O*36|0)+12>>2];G=ad*J-ab*ac;ab=$+H*D*H+G*E*G;if(ab>0.0){ah=1.0/ab}else{ah=0.0}g[w+(l*152|0)+(O*36|0)+24>>2]=ah;ab=+g[K>>2];G=+g[F>>2]*-1.0;H=N*G-ab*I;ad=G*J-ab*ac;ab=$+H*D*H+ad*E*ad;if(ab>0.0){ai=1.0/ab}else{ai=0.0}g[w+(l*152|0)+(O*36|0)+28>>2]=ai;ae=w+(l*152|0)+(O*36|0)+32|0;g[ae>>2]=0.0;ab=+g[F>>2]*(X+ac*aa-P-I*W)+ +g[K>>2]*(Y+Z*J-Q-T*N);if(ab<-1.0){g[ae>>2]=ab*(-0.0- +g[z>>2])}O=O+1|0;}while((O|0)<(x|0));if((c[A>>2]|0)!=2){break}W=+g[w+(l*152|0)+76>>2];aa=+g[y>>2];$=+g[w+(l*152|0)>>2]*W- +g[w+(l*152|0)+4>>2]*aa;ab=W*+g[w+(l*152|0)+8>>2]-aa*+g[w+(l*152|0)+12>>2];N=W*+g[w+(l*152|0)+36>>2]-aa*+g[w+(l*152|0)+40>>2];J=W*+g[w+(l*152|0)+44>>2]-aa*+g[w+(l*152|0)+48>>2];aa=B+C;W=D*$;I=E*ab;ac=aa+$*W+ab*I;ab=aa+N*D*N+J*E*J;$=aa+W*N+I*J;J=ac*ab-$*$;if(ac*ac>=J*1.0e3){c[A>>2]=1;break}g[w+(l*152|0)+96>>2]=ac;g[w+(l*152|0)+100>>2]=$;g[w+(l*152|0)+104>>2]=$;g[w+(l*152|0)+108>>2]=ab;if(J!=0.0){aj=1.0/J}else{aj=J}J=$*(-0.0-aj);g[w+(l*152|0)+80>>2]=ab*aj;g[w+(l*152|0)+84>>2]=J;g[w+(l*152|0)+88>>2]=J;g[w+(l*152|0)+92>>2]=ac*aj}}while(0);w=l+1|0;if((w|0)<(c[o>>2]|0)){l=w}else{_=1846;break}}if((_|0)==1828){at(2120,3512,168,5024)}else if((_|0)==1846){i=b;return}}function du(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,i=0,j=0.0,k=0.0,l=0.0,m=0.0,n=0,o=0,p=0,q=0.0,r=0.0,s=0.0,t=0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0;b=a+48|0;if((c[b>>2]|0)<=0){return}d=a+40|0;e=a+28|0;a=0;do{f=c[d>>2]|0;h=c[f+(a*152|0)+112>>2]|0;i=c[f+(a*152|0)+116>>2]|0;j=+g[f+(a*152|0)+120>>2];k=+g[f+(a*152|0)+128>>2];l=+g[f+(a*152|0)+124>>2];m=+g[f+(a*152|0)+132>>2];n=c[f+(a*152|0)+144>>2]|0;o=c[e>>2]|0;p=o+(h*12|0)|0;q=+g[p>>2];r=+g[p+4>>2];s=+g[o+(h*12|0)+8>>2];t=o+(i*12|0)|0;u=+g[t>>2];v=+g[t+4>>2];w=+g[o+(i*12|0)+8>>2];o=f+(a*152|0)+72|0;x=+g[o>>2];y=+g[o+4>>2];z=x*-1.0;if((n|0)>0){A=r;B=q;C=v;D=u;E=s;F=w;o=0;while(1){G=+g[f+(a*152|0)+(o*36|0)+16>>2];H=+g[f+(a*152|0)+(o*36|0)+20>>2];I=x*G+y*H;J=y*G+z*H;H=E-k*(+g[f+(a*152|0)+(o*36|0)>>2]*J- +g[f+(a*152|0)+(o*36|0)+4>>2]*I);G=B-j*I;K=A-j*J;L=F+m*(J*+g[f+(a*152|0)+(o*36|0)+8>>2]-I*+g[f+(a*152|0)+(o*36|0)+12>>2]);M=D+l*I;I=C+l*J;t=o+1|0;if((t|0)<(n|0)){A=K;B=G;C=I;D=M;E=H;F=L;o=t}else{N=K;O=G;P=I;Q=M;R=H;S=L;break}}}else{N=r;O=q;P=v;Q=u;R=s;S=w}F=+N;g[p>>2]=O;g[p+4>>2]=F;g[(c[e>>2]|0)+(h*12|0)+8>>2]=R;o=(c[e>>2]|0)+(i*12|0)|0;F=+P;g[o>>2]=Q;g[o+4>>2]=F;g[(c[e>>2]|0)+(i*12|0)+8>>2]=S;a=a+1|0;}while((a|0)<(c[b>>2]|0));return}function dv(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,i=0,j=0,k=0.0,l=0.0,m=0.0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0.0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0;b=a+48|0;if((c[b>>2]|0)<=0){return}d=a+40|0;e=a+28|0;a=0;L4:while(1){f=c[d>>2]|0;h=f+(a*152|0)|0;i=c[f+(a*152|0)+112>>2]|0;j=c[f+(a*152|0)+116>>2]|0;k=+g[f+(a*152|0)+120>>2];l=+g[f+(a*152|0)+128>>2];m=+g[f+(a*152|0)+124>>2];n=+g[f+(a*152|0)+132>>2];o=f+(a*152|0)+144|0;p=c[o>>2]|0;q=c[e>>2]|0;r=q+(i*12|0)|0;s=q+(j*12|0)|0;t=f+(a*152|0)+72|0;u=+g[t>>2];v=+g[t+4>>2];w=u*-1.0;x=+g[f+(a*152|0)+136>>2];if((p-1|0)>>>0<2>>>0){y=+g[r+4>>2];z=+g[r>>2];A=+g[s+4>>2];B=+g[s>>2];C=0;D=+g[q+(j*12|0)+8>>2];E=+g[q+(i*12|0)+8>>2]}else{F=4;break}do{G=+g[f+(a*152|0)+(C*36|0)+12>>2];H=+g[f+(a*152|0)+(C*36|0)+8>>2];I=+g[f+(a*152|0)+(C*36|0)+4>>2];J=+g[f+(a*152|0)+(C*36|0)>>2];K=x*+g[f+(a*152|0)+(C*36|0)+16>>2];q=f+(a*152|0)+(C*36|0)+20|0;L=+g[q>>2];M=L+ +g[f+(a*152|0)+(C*36|0)+28>>2]*(-0.0-(v*(B+G*(-0.0-D)-z-I*(-0.0-E))+w*(A+D*H-y-E*J)));N=-0.0-K;O=M<K?M:K;K=O<N?N:O;O=K-L;g[q>>2]=K;K=v*O;L=w*O;z=z-k*K;y=y-k*L;E=E-l*(J*L-I*K);B=B+m*K;A=A+m*L;D=D+n*(H*L-G*K);C=C+1|0;}while((C|0)<(p|0));L9:do{if((c[o>>2]|0)==1){w=+g[f+(a*152|0)+12>>2];x=+g[f+(a*152|0)+8>>2];K=+g[f+(a*152|0)+4>>2];G=+g[h>>2];p=f+(a*152|0)+16|0;L=+g[p>>2];H=L+(u*(B+w*(-0.0-D)-z-K*(-0.0-E))+v*(A+D*x-y-E*G)- +g[f+(a*152|0)+32>>2])*(-0.0- +g[f+(a*152|0)+24>>2]);I=H>0.0?H:0.0;H=I-L;g[p>>2]=I;I=u*H;L=v*H;P=E-l*(G*L-K*I);Q=D+n*(x*L-w*I);R=B+m*I;S=A+m*L;T=z-k*I;U=y-k*L}else{p=f+(a*152|0)+16|0;L=+g[p>>2];q=f+(a*152|0)+52|0;I=+g[q>>2];if(L<0.0|I<0.0){F=9;break L4}w=-0.0-D;x=+g[f+(a*152|0)+12>>2];K=+g[f+(a*152|0)+8>>2];G=-0.0-E;H=+g[f+(a*152|0)+4>>2];J=+g[h>>2];O=+g[f+(a*152|0)+48>>2];N=+g[f+(a*152|0)+44>>2];M=+g[f+(a*152|0)+40>>2];V=+g[f+(a*152|0)+36>>2];W=+g[f+(a*152|0)+104>>2];X=+g[f+(a*152|0)+100>>2];Y=u*(B+x*w-z-H*G)+v*(A+D*K-y-E*J)- +g[f+(a*152|0)+32>>2]-(L*+g[f+(a*152|0)+96>>2]+I*W);Z=u*(B+O*w-z-M*G)+v*(A+D*N-y-E*V)- +g[f+(a*152|0)+68>>2]-(L*X+I*+g[f+(a*152|0)+108>>2]);G=+g[f+(a*152|0)+80>>2]*Y+ +g[f+(a*152|0)+88>>2]*Z;w=Y*+g[f+(a*152|0)+84>>2]+Z*+g[f+(a*152|0)+92>>2];_=-0.0-G;$=-0.0-w;if(!(G>-0.0|w>-0.0)){w=_-L;G=$-I;aa=u*w;ab=v*w;w=u*G;ac=v*G;G=aa+w;ad=ab+ac;g[p>>2]=_;g[q>>2]=$;P=E-l*(J*ab-H*aa+(V*ac-M*w));Q=D+n*(K*ab-x*aa+(N*ac-O*w));R=B+m*G;S=A+m*ad;T=z-k*G;U=y-k*ad;break}ad=Y*(-0.0- +g[f+(a*152|0)+24>>2]);do{if(ad>=0.0){if(Z+ad*X<0.0){break}G=ad-L;w=0.0-I;ac=u*G;aa=v*G;G=u*w;ab=v*w;w=G+ac;$=ab+aa;g[p>>2]=ad;g[q>>2]=0.0;P=E-l*(aa*J-ac*H+(ab*V-G*M));Q=D+n*(aa*K-ac*x+(ab*N-G*O));R=B+m*w;S=A+m*$;T=z-k*w;U=y-k*$;break L9}}while(0);ad=Z*(-0.0- +g[f+(a*152|0)+60>>2]);do{if(ad>=0.0){if(Y+ad*W<0.0){break}X=0.0-L;$=ad-I;w=u*X;G=v*X;X=u*$;ab=v*$;$=w+X;ac=G+ab;g[p>>2]=0.0;g[q>>2]=ad;P=E-l*(G*J-w*H+(ab*V-X*M));Q=D+n*(G*K-w*x+(ab*N-X*O));R=B+m*$;S=A+m*ac;T=z-k*$;U=y-k*ac;break L9}}while(0);if(Y<0.0|Z<0.0){P=E;Q=D;R=B;S=A;T=z;U=y;break}ad=0.0-L;W=0.0-I;ac=u*ad;$=v*ad;ad=u*W;X=v*W;W=ac+ad;ab=$+X;g[p>>2]=0.0;g[q>>2]=0.0;P=E-l*($*J-ac*H+(X*V-ad*M));Q=D+n*($*K-ac*x+(X*N-ad*O));R=B+m*W;S=A+m*ab;T=z-k*W;U=y-k*ab}}while(0);f=(c[e>>2]|0)+(i*12|0)|0;k=+U;g[f>>2]=T;g[f+4>>2]=k;g[(c[e>>2]|0)+(i*12|0)+8>>2]=P;f=(c[e>>2]|0)+(j*12|0)|0;k=+S;g[f>>2]=R;g[f+4>>2]=k;g[(c[e>>2]|0)+(j*12|0)+8>>2]=Q;f=a+1|0;if((f|0)<(c[b>>2]|0)){a=f}else{F=23;break}}if((F|0)==4){at(1280,3512,311,5056)}else if((F|0)==9){at(824,3512,406,5056)}else if((F|0)==23){return}}function dw(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,i=0,j=0,k=0,l=0;b=a+48|0;d=c[b>>2]|0;if((d|0)<=0){return}e=a+40|0;f=a+44|0;a=0;h=d;while(1){d=c[e>>2]|0;i=c[(c[f>>2]|0)+(c[d+(a*152|0)+148>>2]<<2)>>2]|0;j=d+(a*152|0)+144|0;if((c[j>>2]|0)>0){k=0;do{g[i+64+(k*20|0)+8>>2]=+g[d+(a*152|0)+(k*36|0)+16>>2];g[i+64+(k*20|0)+12>>2]=+g[d+(a*152|0)+(k*36|0)+20>>2];k=k+1|0;}while((k|0)<(c[j>>2]|0));l=c[b>>2]|0}else{l=h}j=a+1|0;if((j|0)<(l|0)){a=j;h=l}else{break}}return}function dx(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,z=0,A=0,B=0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0.0,ag=0.0,ah=0.0,ai=0.0,aj=0.0,ak=0.0,al=0.0,am=0.0,an=0.0,ao=0.0,ap=0.0,aq=0.0,ar=0;b=i;i=i+16|0;d=b|0;e=d|0;f=d;h=i;i=i+16|0;j=h|0;k=h;l=i;i=i+20|0;i=i+7&-8;m=a+48|0;if((c[m>>2]|0)<=0){n=0.0;o=n>=-.014999999664723873;i=b;return o|0}p=a+36|0;q=a+24|0;a=d+8|0;d=a;r=a+4|0;a=h+8|0;h=a;s=a+4|0;a=l;t=l+8|0;u=l+16|0;v=0;w=0.0;while(1){x=c[p>>2]|0;y=x+(v*88|0)|0;z=c[x+(v*88|0)+32>>2]|0;A=c[x+(v*88|0)+36>>2]|0;B=x+(v*88|0)+48|0;C=+g[B>>2];D=+g[B+4>>2];E=+g[x+(v*88|0)+40>>2];F=+g[x+(v*88|0)+64>>2];B=x+(v*88|0)+56|0;G=+g[B>>2];H=+g[B+4>>2];I=+g[x+(v*88|0)+44>>2];J=+g[x+(v*88|0)+68>>2];B=c[x+(v*88|0)+84>>2]|0;x=c[q>>2]|0;K=x+(z*12|0)|0;L=+g[K>>2];M=+g[K+4>>2];N=+g[x+(z*12|0)+8>>2];K=x+(A*12|0)|0;O=+g[K>>2];P=+g[K+4>>2];Q=+g[x+(A*12|0)+8>>2];if((B|0)>0){T=E+I;U=M;V=L;W=P;X=O;K=0;Y=Q;Z=N;_=w;do{$=+S(Z);g[d>>2]=$;aa=+R(Z);g[r>>2]=aa;ab=+S(Y);g[h>>2]=ab;ac=+R(Y);g[s>>2]=ac;ad=+(U-(D*aa+C*$));g[e>>2]=V-(C*aa-D*$);g[e+4>>2]=ad;ad=+(W-(H*ac+G*ab));g[j>>2]=X-(G*ac-H*ab);g[j+4>>2]=ad;dy(l,y,f,k,K);ad=+g[a>>2];ab=+g[a+4>>2];ac=+g[t>>2];$=+g[t+4>>2];aa=+g[u>>2];ae=ac-V;af=$-U;ag=ac-X;ac=$-W;_=_<aa?_:aa;$=(aa+.004999999888241291)*.20000000298023224;aa=$<0.0?$:0.0;$=ab*ae-ad*af;ah=ab*ag-ad*ac;ai=ah*J*ah+(T+$*F*$);if(ai>0.0){aj=(-0.0-(aa<-.20000000298023224?-.20000000298023224:aa))/ai}else{aj=0.0}ai=ad*aj;ad=ab*aj;V=V-E*ai;U=U-E*ad;Z=Z-F*(ae*ad-af*ai);X=X+I*ai;W=W+I*ad;Y=Y+J*(ag*ad-ac*ai);K=K+1|0;}while((K|0)<(B|0));ak=U;al=V;am=W;an=X;ao=Y;ap=Z;aq=_;ar=c[q>>2]|0}else{ak=M;al=L;am=P;an=O;ao=Q;ap=N;aq=w;ar=x}B=ar+(z*12|0)|0;J=+ak;g[B>>2]=al;g[B+4>>2]=J;g[(c[q>>2]|0)+(z*12|0)+8>>2]=ap;B=(c[q>>2]|0)+(A*12|0)|0;J=+am;g[B>>2]=an;g[B+4>>2]=J;g[(c[q>>2]|0)+(A*12|0)+8>>2]=ao;B=v+1|0;if((B|0)<(c[m>>2]|0)){v=B;w=aq}else{n=aq;break}}o=n>=-.014999999664723873;i=b;return o|0}function dy(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,i=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0,r=0.0,s=0.0,t=0.0,u=0,v=0,w=0.0;if((c[b+84>>2]|0)<=0){at(512,3512,617,4744)}h=c[b+72>>2]|0;if((h|0)==0){i=+g[d+12>>2];j=+g[b+24>>2];k=+g[d+8>>2];l=+g[b+28>>2];m=+g[d>>2]+(i*j-k*l);n=j*k+i*l+ +g[d+4>>2];l=+g[e+12>>2];i=+g[b>>2];k=+g[e+8>>2];j=+g[b+4>>2];o=+g[e>>2]+(l*i-k*j);p=i*k+l*j+ +g[e+4>>2];j=o-m;l=p-n;q=a;k=+l;g[q>>2]=j;g[q+4>>2]=k;k=+P(j*j+l*l);if(k<1.1920928955078125e-7){r=j;s=l}else{i=1.0/k;k=j*i;g[a>>2]=k;t=l*i;g[a+4>>2]=t;r=k;s=t}q=a+8|0;t=+((n+p)*.5);g[q>>2]=(m+o)*.5;g[q+4>>2]=t;g[a+16>>2]=j*r+l*s- +g[b+76>>2]- +g[b+80>>2];return}else if((h|0)==1){q=d+12|0;s=+g[q>>2];l=+g[b+16>>2];u=d+8|0;r=+g[u>>2];j=+g[b+20>>2];t=s*l-r*j;o=l*r+s*j;v=a;j=+o;g[v>>2]=t;g[v+4>>2]=j;j=+g[q>>2];s=+g[b+24>>2];r=+g[u>>2];l=+g[b+28>>2];m=+g[e+12>>2];p=+g[b+(f<<3)>>2];n=+g[e+8>>2];k=+g[b+(f<<3)+4>>2];i=+g[e>>2]+(m*p-n*k);w=p*n+m*k+ +g[e+4>>2];g[a+16>>2]=t*(i-(+g[d>>2]+(j*s-r*l)))+(w-(s*r+j*l+ +g[d+4>>2]))*o- +g[b+76>>2]- +g[b+80>>2];u=a+8|0;o=+w;g[u>>2]=i;g[u+4>>2]=o;return}else if((h|0)==2){h=e+12|0;o=+g[h>>2];i=+g[b+16>>2];u=e+8|0;w=+g[u>>2];l=+g[b+20>>2];j=o*i-w*l;r=i*w+o*l;q=a;l=+r;g[q>>2]=j;g[q+4>>2]=l;l=+g[h>>2];o=+g[b+24>>2];w=+g[u>>2];i=+g[b+28>>2];s=+g[d+12>>2];t=+g[b+(f<<3)>>2];k=+g[d+8>>2];m=+g[b+(f<<3)+4>>2];n=+g[d>>2]+(s*t-k*m);p=t*k+s*m+ +g[d+4>>2];g[a+16>>2]=j*(n-(+g[e>>2]+(l*o-w*i)))+(p-(o*w+l*i+ +g[e+4>>2]))*r- +g[b+76>>2]- +g[b+80>>2];b=a+8|0;i=+p;g[b>>2]=n;g[b+4>>2]=i;i=+(-0.0-r);g[q>>2]=-0.0-j;g[q+4>>2]=i;return}else{return}}function dz(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0,A=0,B=0,C=0,D=0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0,N=0.0,O=0.0,P=0.0,Q=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ab=0.0,ac=0.0,ad=0.0,ae=0.0,af=0.0,ag=0.0,ah=0.0,ai=0.0,aj=0.0,ak=0.0,al=0.0,am=0.0,an=0.0,ao=0.0,ap=0.0,aq=0.0,ar=0.0,as=0.0,at=0;e=i;i=i+16|0;f=e|0;h=f|0;j=f;k=i;i=i+16|0;l=k|0;m=k;n=i;i=i+20|0;i=i+7&-8;o=a+48|0;if((c[o>>2]|0)<=0){p=0.0;q=p>=-.007499999832361937;i=e;return q|0}r=a+36|0;s=a+24|0;a=f+8|0;f=a;t=a+4|0;a=k+8|0;k=a;u=a+4|0;a=n;v=n+8|0;w=n+16|0;x=0;y=0.0;while(1){z=c[r>>2]|0;A=z+(x*88|0)|0;B=c[z+(x*88|0)+32>>2]|0;C=c[z+(x*88|0)+36>>2]|0;D=z+(x*88|0)+48|0;E=+g[D>>2];F=+g[D+4>>2];D=z+(x*88|0)+56|0;G=+g[D>>2];H=+g[D+4>>2];D=c[z+(x*88|0)+84>>2]|0;if((B|0)==(b|0)|(B|0)==(d|0)){I=+g[z+(x*88|0)+40>>2];J=+g[z+(x*88|0)+64>>2]}else{I=0.0;J=0.0}K=+g[z+(x*88|0)+44>>2];L=+g[z+(x*88|0)+68>>2];z=c[s>>2]|0;M=z+(B*12|0)|0;N=+g[M>>2];O=+g[M+4>>2];P=+g[z+(B*12|0)+8>>2];M=z+(C*12|0)|0;Q=+g[M>>2];T=+g[M+4>>2];U=+g[z+(C*12|0)+8>>2];if((D|0)>0){V=I+K;W=O;X=N;Y=T;Z=Q;_=P;$=U;M=0;aa=y;do{ab=+S(_);g[f>>2]=ab;ac=+R(_);g[t>>2]=ac;ad=+S($);g[k>>2]=ad;ae=+R($);g[u>>2]=ae;af=+(W-(F*ac+E*ab));g[h>>2]=X-(E*ac-F*ab);g[h+4>>2]=af;af=+(Y-(H*ae+G*ad));g[l>>2]=Z-(G*ae-H*ad);g[l+4>>2]=af;dy(n,A,j,m,M);af=+g[a>>2];ad=+g[a+4>>2];ae=+g[v>>2];ab=+g[v+4>>2];ac=+g[w>>2];ag=ae-X;ah=ab-W;ai=ae-Z;ae=ab-Y;aa=aa<ac?aa:ac;ab=(ac+.004999999888241291)*.75;ac=ab<0.0?ab:0.0;ab=ad*ag-af*ah;aj=ad*ai-af*ae;ak=aj*L*aj+(V+ab*J*ab);if(ak>0.0){al=(-0.0-(ac<-.20000000298023224?-.20000000298023224:ac))/ak}else{al=0.0}ak=af*al;af=ad*al;X=X-I*ak;W=W-I*af;_=_-J*(ag*af-ah*ak);Z=Z+K*ak;Y=Y+K*af;$=$+L*(ai*af-ae*ak);M=M+1|0;}while((M|0)<(D|0));am=W;an=X;ao=Y;ap=Z;aq=_;ar=$;as=aa;at=c[s>>2]|0}else{am=O;an=N;ao=T;ap=Q;aq=P;ar=U;as=y;at=z}D=at+(B*12|0)|0;L=+am;g[D>>2]=an;g[D+4>>2]=L;g[(c[s>>2]|0)+(B*12|0)+8>>2]=aq;D=(c[s>>2]|0)+(C*12|0)|0;L=+ao;g[D>>2]=ap;g[D+4>>2]=L;g[(c[s>>2]|0)+(C*12|0)+8>>2]=ar;D=x+1|0;if((D|0)<(c[o>>2]|0)){x=D;y=as}else{p=as;break}}q=p>=-.007499999832361937;i=e;return q|0}function dA(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=cg(f,144)|0;if((e|0)==0){g=0;h=g|0;return h|0}dm(e,a,0,d,0);c[e>>2]=5448;if((c[(c[(c[e+48>>2]|0)+12>>2]|0)+4>>2]|0)!=1){at(1736,3448,41,4840);return 0}if((c[(c[(c[e+52>>2]|0)+12>>2]|0)+4>>2]|0)==0){g=e;h=g|0;return h|0}else{at(2024,3448,42,4840);return 0}return 0}function dB(a,b){a=a|0;b=b|0;aX[c[(c[a>>2]|0)+4>>2]&127](a);ch(b,a,144);return}function dC(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bw(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function dD(a){a=a|0;return}function dE(a){a=a|0;d8(a);return}function dF(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=cg(f,144)|0;if((e|0)==0){g=0;h=g|0;return h|0}dm(e,a,0,d,0);c[e>>2]=5384;if((c[(c[(c[e+48>>2]|0)+12>>2]|0)+4>>2]|0)!=1){at(1632,3376,41,4792);return 0}if((c[(c[(c[e+52>>2]|0)+12>>2]|0)+4>>2]|0)==2){g=e;h=g|0;return h|0}else{at(1976,3376,42,4792);return 0}return 0}function dG(a,b){a=a|0;b=b|0;aX[c[(c[a>>2]|0)+4>>2]&127](a);ch(b,a,144);return}function dH(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bz(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function dI(a){a=a|0;return}function dJ(a){a=a|0;d8(a);return}function dK(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=cg(f,144)|0;if((e|0)==0){g=0;h=g|0;return h|0}dm(e,a,0,d,0);c[e>>2]=5320;if((c[(c[(c[e+48>>2]|0)+12>>2]|0)+4>>2]|0)!=2){at(1544,3304,41,4712);return 0}if((c[(c[(c[e+52>>2]|0)+12>>2]|0)+4>>2]|0)==0){g=e;h=g|0;return h|0}else{at(1928,3304,42,4712);return 0}return 0}function dL(a,b){a=a|0;b=b|0;aX[c[(c[a>>2]|0)+4>>2]&127](a);ch(b,a,144);return}function dM(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bv(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function dN(a){a=a|0;return}function dO(a){a=a|0;d8(a);return}function dP(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=cg(f,144)|0;if((e|0)==0){g=0;h=g|0;return h|0}dm(e,a,0,d,0);c[e>>2]=5520;if((c[(c[(c[e+48>>2]|0)+12>>2]|0)+4>>2]|0)!=2){at(1440,3240,44,4928);return 0}if((c[(c[(c[e+52>>2]|0)+12>>2]|0)+4>>2]|0)==2){g=e;h=g|0;return h|0}else{at(1880,3240,45,4928);return 0}return 0}function dQ(a,b){a=a|0;b=b|0;aX[c[(c[a>>2]|0)+4>>2]&127](a);ch(b,a,144);return}function dR(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;bA(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);return}function dS(a){a=a|0;return}function dT(a){a=a|0;d8(a);return}function dU(a){a=a|0;return}function dV(a){a=a|0;dU(a|0);return}function dW(a){a=a|0;return}function dX(a){a=a|0;return}function dY(a){a=a|0;dU(a|0);d8(a);return}function dZ(a){a=a|0;dU(a|0);d8(a);return}function d_(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+56|0;f=e|0;if((a|0)==(b|0)){g=1;i=e;return g|0}if((b|0)==0){g=0;i=e;return g|0}h=d1(b,6208,6192,-1)|0;b=h;if((h|0)==0){g=0;i=e;return g|0}eb(f|0,0,56);c[f>>2]=b;c[f+8>>2]=a;c[f+12>>2]=-1;c[f+48>>2]=1;a4[c[(c[h>>2]|0)+28>>2]&31](b,f,c[d>>2]|0,1);if((c[f+24>>2]|0)!=1){g=0;i=e;return g|0}c[d>>2]=c[f+16>>2];g=1;i=e;return g|0}function d$(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((c[d+8>>2]|0)!=(b|0)){return}b=d+16|0;g=c[b>>2]|0;if((g|0)==0){c[b>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((g|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function d0(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0;if((b|0)!=(c[d+8>>2]|0)){g=c[b+8>>2]|0;a4[c[(c[g>>2]|0)+28>>2]&31](g,d,e,f);return}g=d+16|0;b=c[g>>2]|0;if((b|0)==0){c[g>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;return}e=d+24|0;if((c[e>>2]|0)!=2){return}c[e>>2]=f;return}function d1(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;f=i;i=i+56|0;g=f|0;h=c[a>>2]|0;j=a+(c[h-8>>2]|0)|0;k=c[h-4>>2]|0;h=k;c[g>>2]=d;c[g+4>>2]=a;c[g+8>>2]=b;c[g+12>>2]=e;e=g+16|0;b=g+20|0;a=g+24|0;l=g+28|0;m=g+32|0;n=g+40|0;eb(e|0,0,39);if((k|0)==(d|0)){c[g+48>>2]=1;a1[c[(c[k>>2]|0)+20>>2]&7](h,g,j,j,1,0);i=f;return((c[a>>2]|0)==1?j:0)|0}aW[c[(c[k>>2]|0)+24>>2]&7](h,g,j,1,0);j=c[g+36>>2]|0;if((j|0)==0){if((c[n>>2]|0)!=1){o=0;i=f;return o|0}if((c[l>>2]|0)!=1){o=0;i=f;return o|0}o=(c[m>>2]|0)==1?c[b>>2]|0:0;i=f;return o|0}else if((j|0)==1){do{if((c[a>>2]|0)!=1){if((c[n>>2]|0)!=0){o=0;i=f;return o|0}if((c[l>>2]|0)!=1){o=0;i=f;return o|0}if((c[m>>2]|0)==1){break}else{o=0}i=f;return o|0}}while(0);o=c[e>>2]|0;i=f;return o|0}else{o=0;i=f;return o|0}return 0}function d2(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0,m=0,n=0;h=b|0;if((h|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){return}i=d+28|0;if((c[i>>2]|0)==1){return}c[i>>2]=f;return}if((h|0)!=(c[d>>2]|0)){h=c[b+8>>2]|0;aW[c[(c[h>>2]|0)+24>>2]&7](h,d,e,f,g);return}do{if((c[d+16>>2]|0)!=(e|0)){h=d+20|0;if((c[h>>2]|0)==(e|0)){break}c[d+32>>2]=f;i=d+44|0;if((c[i>>2]|0)==4){return}j=d+52|0;a[j]=0;k=d+53|0;a[k]=0;l=c[b+8>>2]|0;a1[c[(c[l>>2]|0)+20>>2]&7](l,d,e,e,1,g);if((a[k]&1)==0){m=0;n=196}else{if((a[j]&1)==0){m=1;n=196}}L250:do{if((n|0)==196){c[h>>2]=e;j=d+40|0;c[j>>2]=(c[j>>2]|0)+1;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){n=199;break}a[d+54|0]=1;if(m){break L250}}else{n=199}}while(0);if((n|0)==199){if(m){break}}c[i>>2]=4;return}}while(0);c[i>>2]=3;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function d3(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;if((c[d+8>>2]|0)==(b|0)){if((c[d+4>>2]|0)!=(e|0)){return}g=d+28|0;if((c[g>>2]|0)==1){return}c[g>>2]=f;return}if((c[d>>2]|0)!=(b|0)){return}do{if((c[d+16>>2]|0)!=(e|0)){b=d+20|0;if((c[b>>2]|0)==(e|0)){break}c[d+32>>2]=f;c[b>>2]=e;b=d+40|0;c[b>>2]=(c[b>>2]|0)+1;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){break}a[d+54|0]=1}}while(0);c[d+44>>2]=4;return}}while(0);if((f|0)!=1){return}c[d+32>>2]=1;return}function d4(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0;if((b|0)!=(c[d+8>>2]|0)){i=c[b+8>>2]|0;a1[c[(c[i>>2]|0)+20>>2]&7](i,d,e,f,g,h);return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;h=c[f>>2]|0;if((h|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((h|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;return}e=d+24|0;h=c[e>>2]|0;if((h|0)==2){c[e>>2]=g;j=g}else{j=h}if(!((c[d+48>>2]|0)==1&(j|0)==1)){return}a[d+54|0]=1;return}function d5(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0;if((c[d+8>>2]|0)!=(b|0)){return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){return}a[d+52|0]=1;f=d+16|0;b=c[f>>2]|0;if((b|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){return}a[d+54|0]=1;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;return}e=d+24|0;b=c[e>>2]|0;if((b|0)==2){c[e>>2]=g;i=g}else{i=b}if(!((c[d+48>>2]|0)==1&(i|0)==1)){return}a[d+54|0]=1;return}
function d6(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ab=0,ac=0,ad=0,ae=0,af=0,ag=0,ah=0,ai=0,aj=0,ak=0,al=0,am=0,an=0,ao=0,ap=0,aq=0,ar=0,as=0,at=0,av=0,aw=0,ax=0,ay=0,az=0,aA=0,aB=0,aC=0,aD=0,aE=0,aF=0,aG=0,aH=0;do{if(a>>>0<245>>>0){if(a>>>0<11>>>0){b=16}else{b=a+11&-8}d=b>>>3;e=c[1638]|0;f=e>>>(d>>>0);if((f&3|0)!=0){g=(f&1^1)+d|0;h=g<<1;i=6592+(h<<2)|0;j=6592+(h+2<<2)|0;h=c[j>>2]|0;k=h+8|0;l=c[k>>2]|0;do{if((i|0)==(l|0)){c[1638]=e&~(1<<g)}else{if(l>>>0<(c[1642]|0)>>>0){au();return 0}m=l+12|0;if((c[m>>2]|0)==(h|0)){c[m>>2]=i;c[j>>2]=l;break}else{au();return 0}}}while(0);l=g<<3;c[h+4>>2]=l|3;j=h+(l|4)|0;c[j>>2]=c[j>>2]|1;n=k;return n|0}if(b>>>0<=(c[1640]|0)>>>0){o=b;break}if((f|0)!=0){j=2<<d;l=f<<d&(j|-j);j=(l&-l)-1|0;l=j>>>12&16;i=j>>>(l>>>0);j=i>>>5&8;m=i>>>(j>>>0);i=m>>>2&4;p=m>>>(i>>>0);m=p>>>1&2;q=p>>>(m>>>0);p=q>>>1&1;r=(j|l|i|m|p)+(q>>>(p>>>0))|0;p=r<<1;q=6592+(p<<2)|0;m=6592+(p+2<<2)|0;p=c[m>>2]|0;i=p+8|0;l=c[i>>2]|0;do{if((q|0)==(l|0)){c[1638]=e&~(1<<r)}else{if(l>>>0<(c[1642]|0)>>>0){au();return 0}j=l+12|0;if((c[j>>2]|0)==(p|0)){c[j>>2]=q;c[m>>2]=l;break}else{au();return 0}}}while(0);l=r<<3;m=l-b|0;c[p+4>>2]=b|3;q=p;e=q+b|0;c[q+(b|4)>>2]=m|1;c[q+l>>2]=m;l=c[1640]|0;if((l|0)!=0){q=c[1643]|0;d=l>>>3;l=d<<1;f=6592+(l<<2)|0;k=c[1638]|0;h=1<<d;do{if((k&h|0)==0){c[1638]=k|h;s=f;t=6592+(l+2<<2)|0}else{d=6592+(l+2<<2)|0;g=c[d>>2]|0;if(g>>>0>=(c[1642]|0)>>>0){s=g;t=d;break}au();return 0}}while(0);c[t>>2]=q;c[s+12>>2]=q;c[q+8>>2]=s;c[q+12>>2]=f}c[1640]=m;c[1643]=e;n=i;return n|0}l=c[1639]|0;if((l|0)==0){o=b;break}h=(l&-l)-1|0;l=h>>>12&16;k=h>>>(l>>>0);h=k>>>5&8;p=k>>>(h>>>0);k=p>>>2&4;r=p>>>(k>>>0);p=r>>>1&2;d=r>>>(p>>>0);r=d>>>1&1;g=c[6856+((h|l|k|p|r)+(d>>>(r>>>0))<<2)>>2]|0;r=g;d=g;p=(c[g+4>>2]&-8)-b|0;while(1){g=c[r+16>>2]|0;if((g|0)==0){k=c[r+20>>2]|0;if((k|0)==0){break}else{u=k}}else{u=g}g=(c[u+4>>2]&-8)-b|0;k=g>>>0<p>>>0;r=u;d=k?u:d;p=k?g:p}r=d;i=c[1642]|0;if(r>>>0<i>>>0){au();return 0}e=r+b|0;m=e;if(r>>>0>=e>>>0){au();return 0}e=c[d+24>>2]|0;f=c[d+12>>2]|0;do{if((f|0)==(d|0)){q=d+20|0;g=c[q>>2]|0;if((g|0)==0){k=d+16|0;l=c[k>>2]|0;if((l|0)==0){v=0;break}else{w=l;x=k}}else{w=g;x=q}while(1){q=w+20|0;g=c[q>>2]|0;if((g|0)!=0){w=g;x=q;continue}q=w+16|0;g=c[q>>2]|0;if((g|0)==0){break}else{w=g;x=q}}if(x>>>0<i>>>0){au();return 0}else{c[x>>2]=0;v=w;break}}else{q=c[d+8>>2]|0;if(q>>>0<i>>>0){au();return 0}g=q+12|0;if((c[g>>2]|0)!=(d|0)){au();return 0}k=f+8|0;if((c[k>>2]|0)==(d|0)){c[g>>2]=f;c[k>>2]=q;v=f;break}else{au();return 0}}}while(0);L545:do{if((e|0)!=0){f=d+28|0;i=6856+(c[f>>2]<<2)|0;do{if((d|0)==(c[i>>2]|0)){c[i>>2]=v;if((v|0)!=0){break}c[1639]=c[1639]&~(1<<c[f>>2]);break L545}else{if(e>>>0<(c[1642]|0)>>>0){au();return 0}q=e+16|0;if((c[q>>2]|0)==(d|0)){c[q>>2]=v}else{c[e+20>>2]=v}if((v|0)==0){break L545}}}while(0);if(v>>>0<(c[1642]|0)>>>0){au();return 0}c[v+24>>2]=e;f=c[d+16>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[1642]|0)>>>0){au();return 0}else{c[v+16>>2]=f;c[f+24>>2]=v;break}}}while(0);f=c[d+20>>2]|0;if((f|0)==0){break}if(f>>>0<(c[1642]|0)>>>0){au();return 0}else{c[v+20>>2]=f;c[f+24>>2]=v;break}}}while(0);if(p>>>0<16>>>0){e=p+b|0;c[d+4>>2]=e|3;f=r+(e+4)|0;c[f>>2]=c[f>>2]|1}else{c[d+4>>2]=b|3;c[r+(b|4)>>2]=p|1;c[r+(p+b)>>2]=p;f=c[1640]|0;if((f|0)!=0){e=c[1643]|0;i=f>>>3;f=i<<1;q=6592+(f<<2)|0;k=c[1638]|0;g=1<<i;do{if((k&g|0)==0){c[1638]=k|g;y=q;z=6592+(f+2<<2)|0}else{i=6592+(f+2<<2)|0;l=c[i>>2]|0;if(l>>>0>=(c[1642]|0)>>>0){y=l;z=i;break}au();return 0}}while(0);c[z>>2]=e;c[y+12>>2]=e;c[e+8>>2]=y;c[e+12>>2]=q}c[1640]=p;c[1643]=m}f=d+8|0;if((f|0)==0){o=b;break}else{n=f}return n|0}else{if(a>>>0>4294967231>>>0){o=-1;break}f=a+11|0;g=f&-8;k=c[1639]|0;if((k|0)==0){o=g;break}r=-g|0;i=f>>>8;do{if((i|0)==0){A=0}else{if(g>>>0>16777215>>>0){A=31;break}f=(i+1048320|0)>>>16&8;l=i<<f;h=(l+520192|0)>>>16&4;j=l<<h;l=(j+245760|0)>>>16&2;B=14-(h|f|l)+(j<<l>>>15)|0;A=g>>>((B+7|0)>>>0)&1|B<<1}}while(0);i=c[6856+(A<<2)>>2]|0;L353:do{if((i|0)==0){C=0;D=r;E=0}else{if((A|0)==31){F=0}else{F=25-(A>>>1)|0}d=0;m=r;p=i;q=g<<F;e=0;while(1){B=c[p+4>>2]&-8;l=B-g|0;if(l>>>0<m>>>0){if((B|0)==(g|0)){C=p;D=l;E=p;break L353}else{G=p;H=l}}else{G=d;H=m}l=c[p+20>>2]|0;B=c[p+16+(q>>>31<<2)>>2]|0;j=(l|0)==0|(l|0)==(B|0)?e:l;if((B|0)==0){C=G;D=H;E=j;break}else{d=G;m=H;p=B;q=q<<1;e=j}}}}while(0);if((E|0)==0&(C|0)==0){i=2<<A;r=k&(i|-i);if((r|0)==0){o=g;break}i=(r&-r)-1|0;r=i>>>12&16;e=i>>>(r>>>0);i=e>>>5&8;q=e>>>(i>>>0);e=q>>>2&4;p=q>>>(e>>>0);q=p>>>1&2;m=p>>>(q>>>0);p=m>>>1&1;I=c[6856+((i|r|e|q|p)+(m>>>(p>>>0))<<2)>>2]|0}else{I=E}if((I|0)==0){J=D;K=C}else{p=I;m=D;q=C;while(1){e=(c[p+4>>2]&-8)-g|0;r=e>>>0<m>>>0;i=r?e:m;e=r?p:q;r=c[p+16>>2]|0;if((r|0)!=0){p=r;m=i;q=e;continue}r=c[p+20>>2]|0;if((r|0)==0){J=i;K=e;break}else{p=r;m=i;q=e}}}if((K|0)==0){o=g;break}if(J>>>0>=((c[1640]|0)-g|0)>>>0){o=g;break}q=K;m=c[1642]|0;if(q>>>0<m>>>0){au();return 0}p=q+g|0;k=p;if(q>>>0>=p>>>0){au();return 0}e=c[K+24>>2]|0;i=c[K+12>>2]|0;do{if((i|0)==(K|0)){r=K+20|0;d=c[r>>2]|0;if((d|0)==0){j=K+16|0;B=c[j>>2]|0;if((B|0)==0){L=0;break}else{M=B;N=j}}else{M=d;N=r}while(1){r=M+20|0;d=c[r>>2]|0;if((d|0)!=0){M=d;N=r;continue}r=M+16|0;d=c[r>>2]|0;if((d|0)==0){break}else{M=d;N=r}}if(N>>>0<m>>>0){au();return 0}else{c[N>>2]=0;L=M;break}}else{r=c[K+8>>2]|0;if(r>>>0<m>>>0){au();return 0}d=r+12|0;if((c[d>>2]|0)!=(K|0)){au();return 0}j=i+8|0;if((c[j>>2]|0)==(K|0)){c[d>>2]=i;c[j>>2]=r;L=i;break}else{au();return 0}}}while(0);L403:do{if((e|0)!=0){i=K+28|0;m=6856+(c[i>>2]<<2)|0;do{if((K|0)==(c[m>>2]|0)){c[m>>2]=L;if((L|0)!=0){break}c[1639]=c[1639]&~(1<<c[i>>2]);break L403}else{if(e>>>0<(c[1642]|0)>>>0){au();return 0}r=e+16|0;if((c[r>>2]|0)==(K|0)){c[r>>2]=L}else{c[e+20>>2]=L}if((L|0)==0){break L403}}}while(0);if(L>>>0<(c[1642]|0)>>>0){au();return 0}c[L+24>>2]=e;i=c[K+16>>2]|0;do{if((i|0)!=0){if(i>>>0<(c[1642]|0)>>>0){au();return 0}else{c[L+16>>2]=i;c[i+24>>2]=L;break}}}while(0);i=c[K+20>>2]|0;if((i|0)==0){break}if(i>>>0<(c[1642]|0)>>>0){au();return 0}else{c[L+20>>2]=i;c[i+24>>2]=L;break}}}while(0);do{if(J>>>0<16>>>0){e=J+g|0;c[K+4>>2]=e|3;i=q+(e+4)|0;c[i>>2]=c[i>>2]|1}else{c[K+4>>2]=g|3;c[q+(g|4)>>2]=J|1;c[q+(J+g)>>2]=J;i=J>>>3;if(J>>>0<256>>>0){e=i<<1;m=6592+(e<<2)|0;r=c[1638]|0;j=1<<i;do{if((r&j|0)==0){c[1638]=r|j;O=m;P=6592+(e+2<<2)|0}else{i=6592+(e+2<<2)|0;d=c[i>>2]|0;if(d>>>0>=(c[1642]|0)>>>0){O=d;P=i;break}au();return 0}}while(0);c[P>>2]=k;c[O+12>>2]=k;c[q+(g+8)>>2]=O;c[q+(g+12)>>2]=m;break}e=p;j=J>>>8;do{if((j|0)==0){Q=0}else{if(J>>>0>16777215>>>0){Q=31;break}r=(j+1048320|0)>>>16&8;i=j<<r;d=(i+520192|0)>>>16&4;B=i<<d;i=(B+245760|0)>>>16&2;l=14-(d|r|i)+(B<<i>>>15)|0;Q=J>>>((l+7|0)>>>0)&1|l<<1}}while(0);j=6856+(Q<<2)|0;c[q+(g+28)>>2]=Q;c[q+(g+20)>>2]=0;c[q+(g+16)>>2]=0;m=c[1639]|0;l=1<<Q;if((m&l|0)==0){c[1639]=m|l;c[j>>2]=e;c[q+(g+24)>>2]=j;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}if((Q|0)==31){R=0}else{R=25-(Q>>>1)|0}l=J<<R;m=c[j>>2]|0;while(1){if((c[m+4>>2]&-8|0)==(J|0)){break}S=m+16+(l>>>31<<2)|0;j=c[S>>2]|0;if((j|0)==0){T=423;break}else{l=l<<1;m=j}}if((T|0)==423){if(S>>>0<(c[1642]|0)>>>0){au();return 0}else{c[S>>2]=e;c[q+(g+24)>>2]=m;c[q+(g+12)>>2]=e;c[q+(g+8)>>2]=e;break}}l=m+8|0;j=c[l>>2]|0;i=c[1642]|0;if(m>>>0<i>>>0){au();return 0}if(j>>>0<i>>>0){au();return 0}else{c[j+12>>2]=e;c[l>>2]=e;c[q+(g+8)>>2]=j;c[q+(g+12)>>2]=m;c[q+(g+24)>>2]=0;break}}}while(0);q=K+8|0;if((q|0)==0){o=g;break}else{n=q}return n|0}}while(0);K=c[1640]|0;if(o>>>0<=K>>>0){S=K-o|0;J=c[1643]|0;if(S>>>0>15>>>0){R=J;c[1643]=R+o;c[1640]=S;c[R+(o+4)>>2]=S|1;c[R+K>>2]=S;c[J+4>>2]=o|3}else{c[1640]=0;c[1643]=0;c[J+4>>2]=K|3;S=J+(K+4)|0;c[S>>2]=c[S>>2]|1}n=J+8|0;return n|0}J=c[1641]|0;if(o>>>0<J>>>0){S=J-o|0;c[1641]=S;J=c[1644]|0;K=J;c[1644]=K+o;c[K+(o+4)>>2]=S|1;c[J+4>>2]=o|3;n=J+8|0;return n|0}do{if((c[1614]|0)==0){J=aI(30)|0;if((J-1&J|0)==0){c[1616]=J;c[1615]=J;c[1617]=-1;c[1618]=-1;c[1619]=0;c[1749]=0;c[1614]=(aS(0)|0)&-16^1431655768;break}else{au();return 0}}}while(0);J=o+48|0;S=c[1616]|0;K=o+47|0;R=S+K|0;Q=-S|0;S=R&Q;if(S>>>0<=o>>>0){n=0;return n|0}O=c[1748]|0;do{if((O|0)!=0){P=c[1746]|0;L=P+S|0;if(L>>>0<=P>>>0|L>>>0>O>>>0){n=0}else{break}return n|0}}while(0);L612:do{if((c[1749]&4|0)==0){O=c[1644]|0;L614:do{if((O|0)==0){T=453}else{L=O;P=7e3;while(1){U=P|0;M=c[U>>2]|0;if(M>>>0<=L>>>0){V=P+4|0;if((M+(c[V>>2]|0)|0)>>>0>L>>>0){break}}M=c[P+8>>2]|0;if((M|0)==0){T=453;break L614}else{P=M}}if((P|0)==0){T=453;break}L=R-(c[1641]|0)&Q;if(L>>>0>=2147483647>>>0){W=0;break}m=aO(L|0)|0;e=(m|0)==((c[U>>2]|0)+(c[V>>2]|0)|0);X=e?m:-1;Y=e?L:0;Z=m;_=L;T=462}}while(0);do{if((T|0)==453){O=aO(0)|0;if((O|0)==-1){W=0;break}g=O;L=c[1615]|0;m=L-1|0;if((m&g|0)==0){$=S}else{$=S-g+(m+g&-L)|0}L=c[1746]|0;g=L+$|0;if(!($>>>0>o>>>0&$>>>0<2147483647>>>0)){W=0;break}m=c[1748]|0;if((m|0)!=0){if(g>>>0<=L>>>0|g>>>0>m>>>0){W=0;break}}m=aO($|0)|0;g=(m|0)==(O|0);X=g?O:-1;Y=g?$:0;Z=m;_=$;T=462}}while(0);L634:do{if((T|0)==462){m=-_|0;if((X|0)!=-1){aa=Y;ab=X;T=473;break L612}do{if((Z|0)!=-1&_>>>0<2147483647>>>0&_>>>0<J>>>0){g=c[1616]|0;O=K-_+g&-g;if(O>>>0>=2147483647>>>0){ac=_;break}if((aO(O|0)|0)==-1){aO(m|0)|0;W=Y;break L634}else{ac=O+_|0;break}}else{ac=_}}while(0);if((Z|0)==-1){W=Y}else{aa=ac;ab=Z;T=473;break L612}}}while(0);c[1749]=c[1749]|4;ad=W;T=470}else{ad=0;T=470}}while(0);do{if((T|0)==470){if(S>>>0>=2147483647>>>0){break}W=aO(S|0)|0;Z=aO(0)|0;if(!((Z|0)!=-1&(W|0)!=-1&W>>>0<Z>>>0)){break}ac=Z-W|0;Z=ac>>>0>(o+40|0)>>>0;Y=Z?W:-1;if((Y|0)!=-1){aa=Z?ac:ad;ab=Y;T=473}}}while(0);do{if((T|0)==473){ad=(c[1746]|0)+aa|0;c[1746]=ad;if(ad>>>0>(c[1747]|0)>>>0){c[1747]=ad}ad=c[1644]|0;L654:do{if((ad|0)==0){S=c[1642]|0;if((S|0)==0|ab>>>0<S>>>0){c[1642]=ab}c[1750]=ab;c[1751]=aa;c[1753]=0;c[1647]=c[1614];c[1646]=-1;S=0;do{Y=S<<1;ac=6592+(Y<<2)|0;c[6592+(Y+3<<2)>>2]=ac;c[6592+(Y+2<<2)>>2]=ac;S=S+1|0;}while(S>>>0<32>>>0);S=ab+8|0;if((S&7|0)==0){ae=0}else{ae=-S&7}S=aa-40-ae|0;c[1644]=ab+ae;c[1641]=S;c[ab+(ae+4)>>2]=S|1;c[ab+(aa-36)>>2]=40;c[1645]=c[1618]}else{S=7e3;while(1){af=c[S>>2]|0;ag=S+4|0;ah=c[ag>>2]|0;if((ab|0)==(af+ah|0)){T=485;break}ac=c[S+8>>2]|0;if((ac|0)==0){break}else{S=ac}}do{if((T|0)==485){if((c[S+12>>2]&8|0)!=0){break}ac=ad;if(!(ac>>>0>=af>>>0&ac>>>0<ab>>>0)){break}c[ag>>2]=ah+aa;ac=c[1644]|0;Y=(c[1641]|0)+aa|0;Z=ac;W=ac+8|0;if((W&7|0)==0){ai=0}else{ai=-W&7}W=Y-ai|0;c[1644]=Z+ai;c[1641]=W;c[Z+(ai+4)>>2]=W|1;c[Z+(Y+4)>>2]=40;c[1645]=c[1618];break L654}}while(0);if(ab>>>0<(c[1642]|0)>>>0){c[1642]=ab}S=ab+aa|0;Y=7e3;while(1){aj=Y|0;if((c[aj>>2]|0)==(S|0)){T=495;break}Z=c[Y+8>>2]|0;if((Z|0)==0){break}else{Y=Z}}do{if((T|0)==495){if((c[Y+12>>2]&8|0)!=0){break}c[aj>>2]=ab;S=Y+4|0;c[S>>2]=(c[S>>2]|0)+aa;S=ab+8|0;if((S&7|0)==0){ak=0}else{ak=-S&7}S=ab+(aa+8)|0;if((S&7|0)==0){al=0}else{al=-S&7}S=ab+(al+aa)|0;Z=S;W=ak+o|0;ac=ab+W|0;_=ac;K=S-(ab+ak)-o|0;c[ab+(ak+4)>>2]=o|3;do{if((Z|0)==(c[1644]|0)){J=(c[1641]|0)+K|0;c[1641]=J;c[1644]=_;c[ab+(W+4)>>2]=J|1}else{if((Z|0)==(c[1643]|0)){J=(c[1640]|0)+K|0;c[1640]=J;c[1643]=_;c[ab+(W+4)>>2]=J|1;c[ab+(J+W)>>2]=J;break}J=aa+4|0;X=c[ab+(J+al)>>2]|0;if((X&3|0)==1){$=X&-8;V=X>>>3;L699:do{if(X>>>0<256>>>0){U=c[ab+((al|8)+aa)>>2]|0;Q=c[ab+(aa+12+al)>>2]|0;R=6592+(V<<1<<2)|0;do{if((U|0)!=(R|0)){if(U>>>0<(c[1642]|0)>>>0){au();return 0}if((c[U+12>>2]|0)==(Z|0)){break}au();return 0}}while(0);if((Q|0)==(U|0)){c[1638]=c[1638]&~(1<<V);break}do{if((Q|0)==(R|0)){am=Q+8|0}else{if(Q>>>0<(c[1642]|0)>>>0){au();return 0}m=Q+8|0;if((c[m>>2]|0)==(Z|0)){am=m;break}au();return 0}}while(0);c[U+12>>2]=Q;c[am>>2]=U}else{R=S;m=c[ab+((al|24)+aa)>>2]|0;P=c[ab+(aa+12+al)>>2]|0;do{if((P|0)==(R|0)){O=al|16;g=ab+(J+O)|0;L=c[g>>2]|0;if((L|0)==0){e=ab+(O+aa)|0;O=c[e>>2]|0;if((O|0)==0){an=0;break}else{ao=O;ap=e}}else{ao=L;ap=g}while(1){g=ao+20|0;L=c[g>>2]|0;if((L|0)!=0){ao=L;ap=g;continue}g=ao+16|0;L=c[g>>2]|0;if((L|0)==0){break}else{ao=L;ap=g}}if(ap>>>0<(c[1642]|0)>>>0){au();return 0}else{c[ap>>2]=0;an=ao;break}}else{g=c[ab+((al|8)+aa)>>2]|0;if(g>>>0<(c[1642]|0)>>>0){au();return 0}L=g+12|0;if((c[L>>2]|0)!=(R|0)){au();return 0}e=P+8|0;if((c[e>>2]|0)==(R|0)){c[L>>2]=P;c[e>>2]=g;an=P;break}else{au();return 0}}}while(0);if((m|0)==0){break}P=ab+(aa+28+al)|0;U=6856+(c[P>>2]<<2)|0;do{if((R|0)==(c[U>>2]|0)){c[U>>2]=an;if((an|0)!=0){break}c[1639]=c[1639]&~(1<<c[P>>2]);break L699}else{if(m>>>0<(c[1642]|0)>>>0){au();return 0}Q=m+16|0;if((c[Q>>2]|0)==(R|0)){c[Q>>2]=an}else{c[m+20>>2]=an}if((an|0)==0){break L699}}}while(0);if(an>>>0<(c[1642]|0)>>>0){au();return 0}c[an+24>>2]=m;R=al|16;P=c[ab+(R+aa)>>2]|0;do{if((P|0)!=0){if(P>>>0<(c[1642]|0)>>>0){au();return 0}else{c[an+16>>2]=P;c[P+24>>2]=an;break}}}while(0);P=c[ab+(J+R)>>2]|0;if((P|0)==0){break}if(P>>>0<(c[1642]|0)>>>0){au();return 0}else{c[an+20>>2]=P;c[P+24>>2]=an;break}}}while(0);aq=ab+(($|al)+aa)|0;ar=$+K|0}else{aq=Z;ar=K}J=aq+4|0;c[J>>2]=c[J>>2]&-2;c[ab+(W+4)>>2]=ar|1;c[ab+(ar+W)>>2]=ar;J=ar>>>3;if(ar>>>0<256>>>0){V=J<<1;X=6592+(V<<2)|0;P=c[1638]|0;m=1<<J;do{if((P&m|0)==0){c[1638]=P|m;as=X;at=6592+(V+2<<2)|0}else{J=6592+(V+2<<2)|0;U=c[J>>2]|0;if(U>>>0>=(c[1642]|0)>>>0){as=U;at=J;break}au();return 0}}while(0);c[at>>2]=_;c[as+12>>2]=_;c[ab+(W+8)>>2]=as;c[ab+(W+12)>>2]=X;break}V=ac;m=ar>>>8;do{if((m|0)==0){av=0}else{if(ar>>>0>16777215>>>0){av=31;break}P=(m+1048320|0)>>>16&8;$=m<<P;J=($+520192|0)>>>16&4;U=$<<J;$=(U+245760|0)>>>16&2;Q=14-(J|P|$)+(U<<$>>>15)|0;av=ar>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=6856+(av<<2)|0;c[ab+(W+28)>>2]=av;c[ab+(W+20)>>2]=0;c[ab+(W+16)>>2]=0;X=c[1639]|0;Q=1<<av;if((X&Q|0)==0){c[1639]=X|Q;c[m>>2]=V;c[ab+(W+24)>>2]=m;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}if((av|0)==31){aw=0}else{aw=25-(av>>>1)|0}Q=ar<<aw;X=c[m>>2]|0;while(1){if((c[X+4>>2]&-8|0)==(ar|0)){break}ax=X+16+(Q>>>31<<2)|0;m=c[ax>>2]|0;if((m|0)==0){T=568;break}else{Q=Q<<1;X=m}}if((T|0)==568){if(ax>>>0<(c[1642]|0)>>>0){au();return 0}else{c[ax>>2]=V;c[ab+(W+24)>>2]=X;c[ab+(W+12)>>2]=V;c[ab+(W+8)>>2]=V;break}}Q=X+8|0;m=c[Q>>2]|0;$=c[1642]|0;if(X>>>0<$>>>0){au();return 0}if(m>>>0<$>>>0){au();return 0}else{c[m+12>>2]=V;c[Q>>2]=V;c[ab+(W+8)>>2]=m;c[ab+(W+12)>>2]=X;c[ab+(W+24)>>2]=0;break}}}while(0);n=ab+(ak|8)|0;return n|0}}while(0);Y=ad;W=7e3;while(1){ay=c[W>>2]|0;if(ay>>>0<=Y>>>0){az=c[W+4>>2]|0;aA=ay+az|0;if(aA>>>0>Y>>>0){break}}W=c[W+8>>2]|0}W=ay+(az-39)|0;if((W&7|0)==0){aB=0}else{aB=-W&7}W=ay+(az-47+aB)|0;ac=W>>>0<(ad+16|0)>>>0?Y:W;W=ac+8|0;_=ab+8|0;if((_&7|0)==0){aC=0}else{aC=-_&7}_=aa-40-aC|0;c[1644]=ab+aC;c[1641]=_;c[ab+(aC+4)>>2]=_|1;c[ab+(aa-36)>>2]=40;c[1645]=c[1618];c[ac+4>>2]=27;c[W>>2]=c[1750];c[W+4>>2]=c[1751];c[W+8>>2]=c[1752];c[W+12>>2]=c[1753];c[1750]=ab;c[1751]=aa;c[1753]=0;c[1752]=W;W=ac+28|0;c[W>>2]=7;if((ac+32|0)>>>0<aA>>>0){_=W;while(1){W=_+4|0;c[W>>2]=7;if((_+8|0)>>>0<aA>>>0){_=W}else{break}}}if((ac|0)==(Y|0)){break}_=ac-ad|0;W=Y+(_+4)|0;c[W>>2]=c[W>>2]&-2;c[ad+4>>2]=_|1;c[Y+_>>2]=_;W=_>>>3;if(_>>>0<256>>>0){K=W<<1;Z=6592+(K<<2)|0;S=c[1638]|0;m=1<<W;do{if((S&m|0)==0){c[1638]=S|m;aD=Z;aE=6592+(K+2<<2)|0}else{W=6592+(K+2<<2)|0;Q=c[W>>2]|0;if(Q>>>0>=(c[1642]|0)>>>0){aD=Q;aE=W;break}au();return 0}}while(0);c[aE>>2]=ad;c[aD+12>>2]=ad;c[ad+8>>2]=aD;c[ad+12>>2]=Z;break}K=ad;m=_>>>8;do{if((m|0)==0){aF=0}else{if(_>>>0>16777215>>>0){aF=31;break}S=(m+1048320|0)>>>16&8;Y=m<<S;ac=(Y+520192|0)>>>16&4;W=Y<<ac;Y=(W+245760|0)>>>16&2;Q=14-(ac|S|Y)+(W<<Y>>>15)|0;aF=_>>>((Q+7|0)>>>0)&1|Q<<1}}while(0);m=6856+(aF<<2)|0;c[ad+28>>2]=aF;c[ad+20>>2]=0;c[ad+16>>2]=0;Z=c[1639]|0;Q=1<<aF;if((Z&Q|0)==0){c[1639]=Z|Q;c[m>>2]=K;c[ad+24>>2]=m;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}if((aF|0)==31){aG=0}else{aG=25-(aF>>>1)|0}Q=_<<aG;Z=c[m>>2]|0;while(1){if((c[Z+4>>2]&-8|0)==(_|0)){break}aH=Z+16+(Q>>>31<<2)|0;m=c[aH>>2]|0;if((m|0)==0){T=603;break}else{Q=Q<<1;Z=m}}if((T|0)==603){if(aH>>>0<(c[1642]|0)>>>0){au();return 0}else{c[aH>>2]=K;c[ad+24>>2]=Z;c[ad+12>>2]=ad;c[ad+8>>2]=ad;break}}Q=Z+8|0;_=c[Q>>2]|0;m=c[1642]|0;if(Z>>>0<m>>>0){au();return 0}if(_>>>0<m>>>0){au();return 0}else{c[_+12>>2]=K;c[Q>>2]=K;c[ad+8>>2]=_;c[ad+12>>2]=Z;c[ad+24>>2]=0;break}}}while(0);ad=c[1641]|0;if(ad>>>0<=o>>>0){break}_=ad-o|0;c[1641]=_;ad=c[1644]|0;Q=ad;c[1644]=Q+o;c[Q+(o+4)>>2]=_|1;c[ad+4>>2]=o|3;n=ad+8|0;return n|0}}while(0);c[(aP()|0)>>2]=12;n=0;return n|0}function d7(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;if((a|0)==0){return}b=a-8|0;d=b;e=c[1642]|0;if(b>>>0<e>>>0){au()}f=c[a-4>>2]|0;g=f&3;if((g|0)==1){au()}h=f&-8;i=a+(h-8)|0;j=i;L871:do{if((f&1|0)==0){k=c[b>>2]|0;if((g|0)==0){return}l=-8-k|0;m=a+l|0;n=m;o=k+h|0;if(m>>>0<e>>>0){au()}if((n|0)==(c[1643]|0)){p=a+(h-4)|0;if((c[p>>2]&3|0)!=3){q=n;r=o;break}c[1640]=o;c[p>>2]=c[p>>2]&-2;c[a+(l+4)>>2]=o|1;c[i>>2]=o;return}p=k>>>3;if(k>>>0<256>>>0){k=c[a+(l+8)>>2]|0;s=c[a+(l+12)>>2]|0;t=6592+(p<<1<<2)|0;do{if((k|0)!=(t|0)){if(k>>>0<e>>>0){au()}if((c[k+12>>2]|0)==(n|0)){break}au()}}while(0);if((s|0)==(k|0)){c[1638]=c[1638]&~(1<<p);q=n;r=o;break}do{if((s|0)==(t|0)){u=s+8|0}else{if(s>>>0<e>>>0){au()}v=s+8|0;if((c[v>>2]|0)==(n|0)){u=v;break}au()}}while(0);c[k+12>>2]=s;c[u>>2]=k;q=n;r=o;break}t=m;p=c[a+(l+24)>>2]|0;v=c[a+(l+12)>>2]|0;do{if((v|0)==(t|0)){w=a+(l+20)|0;x=c[w>>2]|0;if((x|0)==0){y=a+(l+16)|0;z=c[y>>2]|0;if((z|0)==0){A=0;break}else{B=z;C=y}}else{B=x;C=w}while(1){w=B+20|0;x=c[w>>2]|0;if((x|0)!=0){B=x;C=w;continue}w=B+16|0;x=c[w>>2]|0;if((x|0)==0){break}else{B=x;C=w}}if(C>>>0<e>>>0){au()}else{c[C>>2]=0;A=B;break}}else{w=c[a+(l+8)>>2]|0;if(w>>>0<e>>>0){au()}x=w+12|0;if((c[x>>2]|0)!=(t|0)){au()}y=v+8|0;if((c[y>>2]|0)==(t|0)){c[x>>2]=v;c[y>>2]=w;A=v;break}else{au()}}}while(0);if((p|0)==0){q=n;r=o;break}v=a+(l+28)|0;m=6856+(c[v>>2]<<2)|0;do{if((t|0)==(c[m>>2]|0)){c[m>>2]=A;if((A|0)!=0){break}c[1639]=c[1639]&~(1<<c[v>>2]);q=n;r=o;break L871}else{if(p>>>0<(c[1642]|0)>>>0){au()}k=p+16|0;if((c[k>>2]|0)==(t|0)){c[k>>2]=A}else{c[p+20>>2]=A}if((A|0)==0){q=n;r=o;break L871}}}while(0);if(A>>>0<(c[1642]|0)>>>0){au()}c[A+24>>2]=p;t=c[a+(l+16)>>2]|0;do{if((t|0)!=0){if(t>>>0<(c[1642]|0)>>>0){au()}else{c[A+16>>2]=t;c[t+24>>2]=A;break}}}while(0);t=c[a+(l+20)>>2]|0;if((t|0)==0){q=n;r=o;break}if(t>>>0<(c[1642]|0)>>>0){au()}else{c[A+20>>2]=t;c[t+24>>2]=A;q=n;r=o;break}}else{q=d;r=h}}while(0);d=q;if(d>>>0>=i>>>0){au()}A=a+(h-4)|0;e=c[A>>2]|0;if((e&1|0)==0){au()}do{if((e&2|0)==0){if((j|0)==(c[1644]|0)){B=(c[1641]|0)+r|0;c[1641]=B;c[1644]=q;c[q+4>>2]=B|1;if((q|0)!=(c[1643]|0)){return}c[1643]=0;c[1640]=0;return}if((j|0)==(c[1643]|0)){B=(c[1640]|0)+r|0;c[1640]=B;c[1643]=q;c[q+4>>2]=B|1;c[d+B>>2]=B;return}B=(e&-8)+r|0;C=e>>>3;L973:do{if(e>>>0<256>>>0){u=c[a+h>>2]|0;g=c[a+(h|4)>>2]|0;b=6592+(C<<1<<2)|0;do{if((u|0)!=(b|0)){if(u>>>0<(c[1642]|0)>>>0){au()}if((c[u+12>>2]|0)==(j|0)){break}au()}}while(0);if((g|0)==(u|0)){c[1638]=c[1638]&~(1<<C);break}do{if((g|0)==(b|0)){D=g+8|0}else{if(g>>>0<(c[1642]|0)>>>0){au()}f=g+8|0;if((c[f>>2]|0)==(j|0)){D=f;break}au()}}while(0);c[u+12>>2]=g;c[D>>2]=u}else{b=i;f=c[a+(h+16)>>2]|0;t=c[a+(h|4)>>2]|0;do{if((t|0)==(b|0)){p=a+(h+12)|0;v=c[p>>2]|0;if((v|0)==0){m=a+(h+8)|0;k=c[m>>2]|0;if((k|0)==0){E=0;break}else{F=k;G=m}}else{F=v;G=p}while(1){p=F+20|0;v=c[p>>2]|0;if((v|0)!=0){F=v;G=p;continue}p=F+16|0;v=c[p>>2]|0;if((v|0)==0){break}else{F=v;G=p}}if(G>>>0<(c[1642]|0)>>>0){au()}else{c[G>>2]=0;E=F;break}}else{p=c[a+h>>2]|0;if(p>>>0<(c[1642]|0)>>>0){au()}v=p+12|0;if((c[v>>2]|0)!=(b|0)){au()}m=t+8|0;if((c[m>>2]|0)==(b|0)){c[v>>2]=t;c[m>>2]=p;E=t;break}else{au()}}}while(0);if((f|0)==0){break}t=a+(h+20)|0;u=6856+(c[t>>2]<<2)|0;do{if((b|0)==(c[u>>2]|0)){c[u>>2]=E;if((E|0)!=0){break}c[1639]=c[1639]&~(1<<c[t>>2]);break L973}else{if(f>>>0<(c[1642]|0)>>>0){au()}g=f+16|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=E}else{c[f+20>>2]=E}if((E|0)==0){break L973}}}while(0);if(E>>>0<(c[1642]|0)>>>0){au()}c[E+24>>2]=f;b=c[a+(h+8)>>2]|0;do{if((b|0)!=0){if(b>>>0<(c[1642]|0)>>>0){au()}else{c[E+16>>2]=b;c[b+24>>2]=E;break}}}while(0);b=c[a+(h+12)>>2]|0;if((b|0)==0){break}if(b>>>0<(c[1642]|0)>>>0){au()}else{c[E+20>>2]=b;c[b+24>>2]=E;break}}}while(0);c[q+4>>2]=B|1;c[d+B>>2]=B;if((q|0)!=(c[1643]|0)){H=B;break}c[1640]=B;return}else{c[A>>2]=e&-2;c[q+4>>2]=r|1;c[d+r>>2]=r;H=r}}while(0);r=H>>>3;if(H>>>0<256>>>0){d=r<<1;e=6592+(d<<2)|0;A=c[1638]|0;E=1<<r;do{if((A&E|0)==0){c[1638]=A|E;I=e;J=6592+(d+2<<2)|0}else{r=6592+(d+2<<2)|0;h=c[r>>2]|0;if(h>>>0>=(c[1642]|0)>>>0){I=h;J=r;break}au()}}while(0);c[J>>2]=q;c[I+12>>2]=q;c[q+8>>2]=I;c[q+12>>2]=e;return}e=q;I=H>>>8;do{if((I|0)==0){K=0}else{if(H>>>0>16777215>>>0){K=31;break}J=(I+1048320|0)>>>16&8;d=I<<J;E=(d+520192|0)>>>16&4;A=d<<E;d=(A+245760|0)>>>16&2;r=14-(E|J|d)+(A<<d>>>15)|0;K=H>>>((r+7|0)>>>0)&1|r<<1}}while(0);I=6856+(K<<2)|0;c[q+28>>2]=K;c[q+20>>2]=0;c[q+16>>2]=0;r=c[1639]|0;d=1<<K;do{if((r&d|0)==0){c[1639]=r|d;c[I>>2]=e;c[q+24>>2]=I;c[q+12>>2]=q;c[q+8>>2]=q}else{if((K|0)==31){L=0}else{L=25-(K>>>1)|0}A=H<<L;J=c[I>>2]|0;while(1){if((c[J+4>>2]&-8|0)==(H|0)){break}M=J+16+(A>>>31<<2)|0;E=c[M>>2]|0;if((E|0)==0){N=780;break}else{A=A<<1;J=E}}if((N|0)==780){if(M>>>0<(c[1642]|0)>>>0){au()}else{c[M>>2]=e;c[q+24>>2]=J;c[q+12>>2]=q;c[q+8>>2]=q;break}}A=J+8|0;B=c[A>>2]|0;E=c[1642]|0;if(J>>>0<E>>>0){au()}if(B>>>0<E>>>0){au()}else{c[B+12>>2]=e;c[A>>2]=e;c[q+8>>2]=B;c[q+12>>2]=J;c[q+24>>2]=0;break}}}while(0);q=(c[1646]|0)-1|0;c[1646]=q;if((q|0)==0){O=7008}else{return}while(1){q=c[O>>2]|0;if((q|0)==0){break}else{O=q+8|0}}c[1646]=-1;return}function d8(a){a=a|0;if((a|0)==0){return}d7(a);return}function d9(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function ea(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function eb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=b+e|0;if((e|0)>=20){d=d&255;e=b&3;g=d|d<<8|d<<16|d<<24;h=f&~3;if(e){e=b+4-e|0;while((b|0)<(e|0)){a[b]=d;b=b+1|0}}while((b|0)<(h|0)){c[b>>2]=g;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}}function ec(){aJ()}function ed(a,b){a=a|0;b=b|0;return aV[a&7](b|0)|0}function ee(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;aW[a&7](b|0,c|0,d|0,e|0,f|0)}function ef(a,b){a=a|0;b=b|0;aX[a&127](b|0)}function eg(a,b,c){a=a|0;b=b|0;c=c|0;aY[a&31](b|0,c|0)}function eh(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return aZ[a&15](b|0,c|0,d|0)|0}function ei(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;a_[a&7](b|0,c|0,d|0)}function ej(a){a=a|0;a$[a&3]()}function ek(a,b,c,d){a=a|0;b=b|0;c=c|0;d=+d;a0[a&7](b|0,c|0,+d)}function el(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;a1[a&7](b|0,c|0,d|0,e|0,f|0,g|0)}function em(a,b,c){a=a|0;b=b|0;c=c|0;return a2[a&15](b|0,c|0)|0}function en(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;return a3[a&31](b|0,c|0,d|0,e|0,f|0)|0}function eo(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;a4[a&31](b|0,c|0,d|0,e|0)}function ep(a){a=a|0;aa(0);return 0}function eq(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;aa(1)}function er(a){a=a|0;aa(2)}function es(a,b){a=a|0;b=b|0;aa(3)}function et(a,b,c){a=a|0;b=b|0;c=c|0;aa(4);return 0}function eu(a,b,c){a=a|0;b=b|0;c=c|0;aa(5)}function ev(){aa(6)}function ew(a,b,c){a=a|0;b=b|0;c=+c;aa(7)}function ex(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;aa(8)}function ey(a,b){a=a|0;b=b|0;aa(9);return 0}function ez(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;aa(10);return 0}function eA(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;aa(11)}
// EMSCRIPTEN_END_FUNCS
var aV=[ep,ep,b7,ep,b_,ep,ep,ep];var aW=[eq,eq,d3,eq,d2,eq,eq,eq];var aX=[er,er,dO,er,dE,er,dj,er,cJ,er,dS,er,b4,er,bM,er,dp,er,cY,er,cf,er,dX,er,co,er,dJ,er,dD,er,b3,er,cO,er,c8,er,cc,er,cx,er,dN,er,dq,er,ds,er,dI,er,bq,er,ce,er,c4,er,dd,er,bp,er,dT,er,c9,er,di,er,cd,er,cU,er,cy,er,ck,er,c3,er,dY,er,dV,er,dW,er,de,er,dZ,er,bL,er,cl,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er,er];var aY=[es,es,dg,es,db,es,cK,es,dL,es,cX,es,cL,es,dQ,es,dr,es,c6,es,dG,es,dB,es,es,es,es,es,es,es,es,es];var aZ=[et,et,d_,et,b$,et,c2,et,b8,et,et,et,et,et,et,et];var a_=[eu,eu,cN,eu,cr,eu,cM,eu];var a$=[ev,ev,ec,ev];var a0=[ew,ew,cb,ew,b2,ew,ew,ew];var a1=[ex,ex,d5,ex,d4,ex,cT,ex];var a2=[ey,ey,b5,ey,cF,ey,bZ,ey,bn,ey,ey,ey,ey,ey,ey,ey];var a3=[ez,ez,dP,ez,b9,ez,dA,ez,dK,ez,df,ez,c5,ez,b0,ez,da,ez,dF,ez,ez,ez,ez,ez,ez,ez,ez,ez,ez,ez,ez,ez];var a4=[eA,eA,ca,eA,dc,eA,dh,eA,d$,eA,dR,eA,dM,eA,d0,eA,b1,eA,dH,eA,c7,eA,dC,eA,eA,eA,eA,eA,eA,eA,eA,eA];return{_strlen:d9,_free:d7,_main:bm,_memset:eb,_malloc:d6,_memcpy:ea,runPostSets:bl,stackAlloc:a5,stackSave:a6,stackRestore:a7,setThrew:a8,setTempRet0:bb,setTempRet1:bc,setTempRet2:bd,setTempRet3:be,setTempRet4:bf,setTempRet5:bg,setTempRet6:bh,setTempRet7:bi,setTempRet8:bj,setTempRet9:bk,dynCall_ii:ed,dynCall_viiiii:ee,dynCall_vi:ef,dynCall_vii:eg,dynCall_iiii:eh,dynCall_viii:ei,dynCall_v:ej,dynCall_viif:ek,dynCall_viiiiii:el,dynCall_iii:em,dynCall_iiiiii:en,dynCall_viiii:eo}})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_ii": invoke_ii, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_iiii": invoke_iiii, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_viif": invoke_viif, "invoke_viiiiii": invoke_viiiiii, "invoke_iii": invoke_iii, "invoke_iiiiii": invoke_iiiiii, "invoke_viiii": invoke_viiii, "_llvm_lifetime_end": _llvm_lifetime_end, "_cosf": _cosf, "___assert_fail": ___assert_fail, "_abort": _abort, "_fprintf": _fprintf, "_printf": _printf, "_fflush": _fflush, "__reallyNegative": __reallyNegative, "_sqrtf": _sqrtf, "_floorf": _floorf, "_clock": _clock, "___setErrNo": ___setErrNo, "_fwrite": _fwrite, "_qsort": _qsort, "_send": _send, "_write": _write, "_exit": _exit, "_sysconf": _sysconf, "___cxa_pure_virtual": ___cxa_pure_virtual, "__formatString": __formatString, "__ZSt9terminatev": __ZSt9terminatev, "_sinf": _sinf, "_pwrite": _pwrite, "_sbrk": _sbrk, "___errno_location": ___errno_location, "___gxx_personality_v0": ___gxx_personality_v0, "_llvm_lifetime_start": _llvm_lifetime_start, "_time": _time, "__exit": __exit, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity, "__ZTVN10__cxxabiv117__class_type_infoE": __ZTVN10__cxxabiv117__class_type_infoE, "__ZTVN10__cxxabiv120__si_class_type_infoE": __ZTVN10__cxxabiv120__si_class_type_infoE }, buffer);
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_viif = Module["dynCall_viif"] = asm["dynCall_viif"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_iiiiii = Module["dynCall_iiiiii"] = asm["dynCall_iiiiii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
// === Auto-generated postamble setup entry stuff ===
if (memoryInitializer) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    applyData(Module['readBinary'](memoryInitializer));
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      applyData(data);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var preloadStartTime = null;
var calledMain = false;
dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}
Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  initialStackTop = STACKTOP;
  try {
    var ret = Module['_main'](argc, argv, 0);
    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}
function run(args) {
  args = args || Module['arguments'];
  if (preloadStartTime === null) preloadStartTime = Date.now();
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }
  preRun();
  if (runDependencies > 0) {
    // a preRun added a dependency, run will be called later
    return;
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    Module['calledRun'] = true;
    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }
    postRun();
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;
function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;
  // exit the runtime
  exitRuntime();
  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371
  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;
function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }
  ABORT = true;
  EXITSTATUS = 1;
  throw 'abort() at ' + stackTrace();
}
Module['abort'] = Module.abort = abort;
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
