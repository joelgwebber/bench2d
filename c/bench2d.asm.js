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
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
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
  if (!Module['print']) Module['print'] = print;
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

  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
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
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
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
  if (/<?\{ ?[^}]* ?\}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
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
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
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
    if (type.name_ && type.name_[0] === '[') {
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
    code = Pointer_stringify(code);
    if (code[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (code.indexOf('"', 1) === code.length-1) {
        code = code.substr(1, code.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + code + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + code + ' })'); // new Function does not allow upvars in node
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
  getCompilerSetting: function (name) {
    throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work';
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


Module['Runtime'] = Runtime;









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
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
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
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
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
  var subs = [];
  var first = true;
  function dump(x) {
    //return;
    if (x) Module.print(x);
    Module.print(func);
    var pre = '';
    for (var a = 0; a < i; a++) pre += ' ';
    Module.print (pre + '^');
  }
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
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
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
  abort('Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.');
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 67108864;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;

var totalMemory = 4096;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'JS engine does not provide full typed array support');

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
    HEAP8[(((buffer)+(i))|0)]=chr;
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
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
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

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
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
var __ZTVN10__cxxabiv117__class_type_infoE = 2048;
var __ZTVN10__cxxabiv120__si_class_type_infoE = 2088;




STATIC_BASE = 8;

STATICTOP = STATIC_BASE + Runtime.alignMemory(2675);
/* global initializers */ __ATINIT__.push();


/* memory initializer */ allocate([66,101,110,99,104,109,97,114,107,32,99,111,109,112,108,101,116,101,46,10,32,32,109,115,47,102,114,97,109,101,58,32,37,102,32,53,116,104,32,37,37,105,108,101,58,32,37,102,32,57,53,116,104,32,37,37,105,108,101,58,32,37,102,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,55,98,50,83,104,97,112,101,0,0,0,0,0,0,0,0,8,8,0,0,144,0,0,0,0,0,0,0,224,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,49,49,98,50,69,100,103,101,83,104,97,112,101,0,0,0,48,8,0,0,208,0,0,0,160,0,0,0,0,0,0,0,0,0,0,0,48,1,0,0,3,0,0,0,4,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,49,52,98,50,80,111,108,121,103,111,110,83,104,97,112,101,0,0,0,0,0,0,0,0,48,8,0,0,24,1,0,0,160,0,0,0,0,0,0,0,16,0,0,0,32,0,0,0,64,0,0,0,96,0,0,0,128,0,0,0,160,0,0,0,192,0,0,0,224,0,0,0,0,1,0,0,64,1,0,0,128,1,0,0,192,1,0,0,0,2,0,0,128,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,4,0,0,0,0,0,0,40,4,0,0,0,0,0,0,0,0,0,0,88,4,0,0,5,0,0,0,6,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,49,55,98,50,67,111,110,116,97,99,116,76,105,115,116,101,110,101,114,0,0,0,0,0,8,8,0,0,64,4,0,0,0,0,0,0,144,4,0,0,7,0,0,0,8,0,0,0,3,0,0,0,0,0,0,0,49,53,98,50,67,111,110,116,97,99,116,70,105,108,116,101,114,0,0,0,0,0,0,0,8,8,0,0,120,4,0,0,0,0,0,0,232,4,0,0,3,0,0,0,9,0,0,0,10,0,0,0,0,0,0,0,50,51,98,50,67,104,97,105,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,0,0,0,57,98,50,67,111,110,116,97,99,116,0,0,0,0,0,0,8,8,0,0,208,4,0,0,48,8,0,0,176,4,0,0,224,4,0,0,0,0,0,0,0,0,0,0,48,5,0,0,4,0,0,0,11,0,0,0,12,0,0,0,0,0,0,0,50,52,98,50,67,104,97,105,110,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,0,0,0,0,48,8,0,0,16,5,0,0,224,4,0,0,0,0,0,0,0,0,0,0,112,5,0,0,5,0,0,0,13,0,0,0,14,0,0,0,0,0,0,0,49,53,98,50,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,0,0,0,48,8,0,0,88,5,0,0,224,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,4,0,0,1,0,0,0,15,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,152,6,0,0,6,0,0,0,17,0,0,0,18,0,0,0,0,0,0,0,50,50,98,50,69,100,103,101,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,0,0,0,0,48,8,0,0,120,6,0,0,224,4,0,0,0,0,0,0,0,0,0,0,224,6,0,0,7,0,0,0,19,0,0,0,20,0,0,0,0,0,0,0,50,51,98,50,69,100,103,101,65,110,100,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,0,0,0,0,0,48,8,0,0,192,6,0,0,224,4,0,0,0,0,0,0,0,0,0,0,40,7,0,0,8,0,0,0,21,0,0,0,22,0,0,0,0,0,0,0,50,53,98,50,80,111,108,121,103,111,110,65,110,100,67,105,114,99,108,101,67,111,110,116,97,99,116,0,0,0,0,0,48,8,0,0,8,7,0,0,224,4,0,0,0,0,0,0,0,0,0,0,104,7,0,0,9,0,0,0,23,0,0,0,24,0,0,0,0,0,0,0,49,54,98,50,80,111,108,121,103,111,110,67,111,110,116,97,99,116,0,0,0,0,0,0,48,8,0,0,80,7,0,0,224,4,0,0,0,0,0,0,83,116,57,116,121,112,101,95,105,110,102,111,0,0,0,0,8,8,0,0,120,7,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,0,48,8,0,0,144,7,0,0,136,7,0,0,0,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,0,0,0,48,8,0,0,200,7,0,0,184,7,0,0,0,0,0,0,0,0,0,0,240,7,0,0,25,0,0,0,26,0,0,0,27,0,0,0,28,0,0,0,4,0,0,0,1,0,0,0,1,0,0,0,10,0,0,0,0,0,0,0,120,8,0,0,25,0,0,0,29,0,0,0,27,0,0,0,28,0,0,0,4,0,0,0,2,0,0,0,2,0,0,0,11,0,0,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,0,0,0,48,8,0,0,80,8,0,0,240,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);




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


  function _llvm_lifetime_end() {}

  var _cosf=Math_cos;

  function ___cxa_pure_virtual() {
      ABORT = true;
      throw 'Pure virtual function called!';
    }

  var _floorf=Math_floor;

  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }function ___errno_location() {
      return ___errno_state;
    }

   
  Module["_memset"] = _memset;

  var _llvm_memset_p0i8_i32=_memset;

  
  
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }function __ZSt9terminatev() {
      _exit(-1234);
    }

  function _abort() {
      Module['abort']();
    }

  
  
  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
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
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
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
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
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
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
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
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          fileStore.createIndex('timestamp', 'timestamp', { unique: false });
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function() {
          callback(this.error);
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
  
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
  
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
  
            entries[cursor.primaryKey] = { timestamp: cursor.key };
  
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function() { callback(this.error); };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function() { done(this.error); };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
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
    }var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
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
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
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
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
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
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
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
        fd_start = fd_start || 0;
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
      },getStreamFromPtr:function (ptr) {
        return FS.streams[ptr - 1];
      },getPtrForStream:function (stream) {
        return stream ? stream.fd + 1 : 0;
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
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            callback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
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
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
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
        var lookup = FS.lookupPath(path);
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
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
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
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
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
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
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
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
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
        HEAP32[((_stdin)>>2)]=FS.getPtrForStream(stdin);
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=FS.getPtrForStream(stdout);
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=FS.getPtrForStream(stderr);
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
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
  
  
  
  
  function _mkport() { throw 'TODO' }var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
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
    }
  
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) return -1;
      return stream.fd;
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var fd = _fileno(stream);
      var bytesWritten = _write(fd, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
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
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
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
          }
          if (precision < 0) {
            precision = 6; // Standard default.
            precisionSet = false;
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
              HEAP32[((ptr)>>2)]=ret.length;
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

  var _sinf=Math_sin;


  var _sqrtf=Math_sqrt;

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

  function _clock() {
      if (_clock.start === undefined) _clock.start = Date.now();
      return Math.floor((Date.now() - _clock.start) * (1000000/1000));
    }

  
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  
  var ___cxa_caught_exceptions=[];
  
  var ___cxa_last_thrown_exception=0;function ___cxa_begin_catch(ptr) {
      __ZSt18uncaught_exceptionv.uncaught_exception--;
      ___cxa_caught_exceptions.push(___cxa_last_thrown_exception);
      return ptr;
    }

  
  function _malloc(bytes) {
      /* Over-allocate to make sure it is byte-aligned by 8.
       * This will leak memory, but this is only the dummy
       * implementation (replaced by dlmalloc normally) so
       * not an issue.
       */
      var ptr = Runtime.dynamicAlloc(bytes + 8);
      return (ptr+8) & 0xFFFFFFF8;
    }
  Module["_malloc"] = _malloc;
  
  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 
  Module["_memcpy"] = _memcpy;
  
  function _free() {
  }
  Module["_free"] = _free;function _qsort(base, num, size, cmp) {
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


  function _llvm_lifetime_start() {}

  var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;

  var Browser={mainLoop:{scheduler:null,method:"",shouldPause:false,paused:false,queue:[],pause:function () {
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
        
        // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
        // Module['forcedAspectRatio'] = 4 / 3;
        
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'] ||
                                    canvas['msRequestPointerLock'] ||
                                    function(){};
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 document['msExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas ||
                                document['msPointerLockElement'] === canvas;
        }
  
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
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
        var errorInfo = '?';
        function onContextCreationError(event) {
          errorInfo = event.statusMessage || errorInfo;
        }
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
  
  
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
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
          GLctx = Module.ctx = ctx;
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
        var canvasContainer = canvas.parentNode;
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement'] ||
               document['msFullScreenElement'] || document['msFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'] ||
                                      document['msExitFullscreen'] ||
                                      document['exitFullscreen'] ||
                                      function() {};
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else {
            
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            var canvasContainer = canvas.parentNode;
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
            
            if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
          Browser.updateCanvasDimensions(canvas);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
          document.addEventListener('MSFullscreenChange', fullScreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullScreen = canvasContainer['requestFullScreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvasContainer.requestFullScreen();
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
      },getMouseWheelDelta:function (event) {
        return Math.max(-1, Math.min(1, event.type === 'DOMMouseScroll' ? event.detail : -event.wheelDelta));
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
          
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (scrollX + rect.left);
              y = t.pageY - (scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (scrollX + rect.left);
            y = event.pageY - (scrollY + rect.top);
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
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function (canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
             document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
             document['fullScreenElement'] || document['fullscreenElement'] ||
             document['msFullScreenElement'] || document['msFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      }};

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
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

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");


var Math_min = Math.min;
function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
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

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
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

function invoke_viid(index,a1,a2,a3) {
  try {
    Module["dynCall_viid"](index,a1,a2,a3);
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
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=0;var n=0;var o=0;var p=0;var q=+env.NaN,r=+env.Infinity;var s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,z=0,A=0.0;var B=0;var C=0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=global.Math.floor;var M=global.Math.abs;var N=global.Math.sqrt;var O=global.Math.pow;var P=global.Math.cos;var Q=global.Math.sin;var R=global.Math.tan;var S=global.Math.acos;var T=global.Math.asin;var U=global.Math.atan;var V=global.Math.atan2;var W=global.Math.exp;var X=global.Math.log;var Y=global.Math.ceil;var Z=global.Math.imul;var _=env.abort;var $=env.assert;var aa=env.asmPrintInt;var ba=env.asmPrintFloat;var ca=env.min;var da=env.invoke_iiii;var ea=env.invoke_viiiii;var fa=env.invoke_vi;var ga=env.invoke_vii;var ha=env.invoke_ii;var ia=env.invoke_viii;var ja=env.invoke_v;var ka=env.invoke_viid;var la=env.invoke_viiiiii;var ma=env.invoke_iii;var na=env.invoke_iiiiii;var oa=env.invoke_viiii;var pa=env._llvm_lifetime_start;var qa=env._cosf;var ra=env._send;var sa=env.__ZSt9terminatev;var ta=env.___setErrNo;var ua=env.__ZSt18uncaught_exceptionv;var va=env._fflush;var wa=env._pwrite;var xa=env.__reallyNegative;var ya=env._sbrk;var za=env.___cxa_begin_catch;var Aa=env._sinf;var Ba=env._fileno;var Ca=env._sysconf;var Da=env._clock;var Ea=env._llvm_lifetime_end;var Fa=env._qsort;var Ga=env._printf;var Ha=env._floorf;var Ia=env._sqrtf;var Ja=env._write;var Ka=env._emscripten_memcpy_big;var La=env.___errno_location;var Ma=env._mkport;var Na=env.__exit;var Oa=env._abort;var Pa=env._fwrite;var Qa=env._time;var Ra=env._fprintf;var Sa=env.__formatString;var Ta=env._exit;var Ua=env.___cxa_pure_virtual;var Va=0.0;
// EMSCRIPTEN_START_FUNCS
function gb(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7&-8;return b|0}function hb(){return i|0}function ib(a){a=a|0;i=a}function jb(a,b){a=a|0;b=b|0;if((m|0)==0){m=a;n=b}}function kb(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function lb(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function mb(a){a=a|0;B=a}function nb(a){a=a|0;C=a}function ob(a){a=a|0;D=a}function pb(a){a=a|0;E=a}function qb(a){a=a|0;F=a}function rb(a){a=a|0;G=a}function sb(a){a=a|0;H=a}function tb(a){a=a|0;I=a}function ub(a){a=a|0;J=a}function vb(a){a=a|0;K=a}function wb(a,b){a=a|0;b=b|0;var d=0,e=0.0,f=0.0,j=0;b=i;i=i+24|0;a=b;d=i;i=i+16|0;yb(d);e=+g[d+4>>2];f=+g[d+8>>2];j=a;h[k>>3]=+g[d>>2];c[j>>2]=c[k>>2];c[j+4>>2]=c[k+4>>2];j=a+8|0;h[k>>3]=e;c[j>>2]=c[k>>2];c[j+4>>2]=c[k+4>>2];j=a+16|0;h[k>>3]=f;c[j>>2]=c[k>>2];c[j+4>>2]=c[k+4>>2];Ga(8,a|0)|0;i=b;return 0}function xb(a,b){a=a|0;b=b|0;i=i;return(c[a>>2]|0)-(c[b>>2]|0)|0}function yb(d){d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0,B=0.0,C=0.0,D=0,E=0,F=0,G=0.0;e=i;i=i+104392|0;f=e;h=e+8|0;j=e+103040|0;k=e+103096|0;l=e+103144|0;m=e+103152|0;n=e+103160|0;o=e+103312|0;p=e+103368|0;g[f>>2]=0.0;g[f+4>>2]=-10.0;sd(h,f);vd(h,0);c[j+44>>2]=0;f=j+36|0;q=j+4|0;c[q+0>>2]=0;c[q+4>>2]=0;c[q+8>>2]=0;c[q+12>>2]=0;c[q+16>>2]=0;c[q+20>>2]=0;c[q+24>>2]=0;c[q+28>>2]=0;a[f]=1;a[j+37|0]=1;a[j+38|0]=0;a[j+39|0]=0;c[j>>2]=0;a[j+40|0]=1;g[j+48>>2]=1.0;f=ud(h,j)|0;c[k>>2]=176;c[k+4>>2]=1;g[k+8>>2]=.009999999776482582;j=k+28|0;c[j+0>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;b[j+16>>1]=0;g[l>>2]=-40.0;g[l+4>>2]=0.0;g[m>>2]=40.0;g[m+4>>2]=0.0;kc(k,l,m);Pc(f,k,0.0)|0;c[n>>2]=248;c[n+4>>2]=2;g[n+8>>2]=.009999999776482582;c[n+148>>2]=0;g[n+12>>2]=0.0;g[n+16>>2]=0.0;sc(n,.5,.5);k=o+44|0;f=o+36|0;m=o+4|0;l=o+37|0;j=o+38|0;q=o+39|0;r=o;s=o+40|0;t=o+48|0;u=o+4|0;v=n;w=-7.0;x=.75;n=0;while(1){y=w;z=x;A=n;while(1){c[k>>2]=0;c[m+0>>2]=0;c[m+4>>2]=0;c[m+8>>2]=0;c[m+12>>2]=0;c[m+16>>2]=0;c[m+20>>2]=0;c[m+24>>2]=0;c[m+28>>2]=0;a[f]=1;a[l]=1;a[j]=0;a[q]=0;a[s]=1;g[t>>2]=1.0;c[r>>2]=2;B=+y;C=+z;D=u;g[D>>2]=B;g[D+4>>2]=C;Pc(ud(h,o)|0,v,5.0)|0;D=A+1|0;if((D|0)<40){A=D;z=z+0.0;y=y+1.125}else{break}}A=n+1|0;if((A|0)<40){w=w+.5625;x=x+1.0;n=A}else{E=0;break}}do{yd(h,.01666666753590107,3,3);E=E+1|0;}while((E|0)<64);E=p;n=0;while(1){v=Da()|0;yd(h,.01666666753590107,3,3);c[p+(n<<2)>>2]=(Da()|0)-v;v=n+1|0;if((v|0)<256){n=v}else{F=0;G=0.0;break}}do{G=G+ +(c[p+(F<<2)>>2]|0)/1.0e6*1.0e3;F=F+1|0;}while((F|0)!=256);g[d>>2]=G*.00390625;Fa(E|0,256,4,3);g[d+4>>2]=+(c[p+48>>2]|0)/1.0e6*1.0e3;g[d+8>>2]=+(c[p+972>>2]|0)/1.0e6*1.0e3;td(h);i=e;return}function zb(a){a=a|0;i=i;return}function Ab(a){a=a|0;za(a|0)|0;sa()}function Bb(a){a=a|0;i=i;return}function Cb(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function Db(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function Eb(a){a=a|0;var b=0;b=i;Zb(a);c[a+28>>2]=0;c[a+48>>2]=16;c[a+52>>2]=0;c[a+44>>2]=Cc(192)|0;c[a+36>>2]=16;c[a+40>>2]=0;c[a+32>>2]=Cc(64)|0;i=b;return}function Fb(a){a=a|0;var b=0;b=i;Dc(c[a+32>>2]|0);Dc(c[a+44>>2]|0);_b(a);i=b;return}function Gb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;f=ac(a,b,d)|0;d=a+28|0;c[d>>2]=(c[d>>2]|0)+1;d=a+40|0;b=c[d>>2]|0;g=a+36|0;h=a+32|0;if((b|0)==(c[g>>2]|0)){a=c[h>>2]|0;c[g>>2]=b<<1;g=Cc(b<<3)|0;c[h>>2]=g;j=a;Qe(g|0,j|0,c[d>>2]<<2|0)|0;Dc(j);k=c[d>>2]|0}else{k=b}c[(c[h>>2]|0)+(k<<2)>>2]=f;c[d>>2]=(c[d>>2]|0)+1;i=e;return f|0}function Hb(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;if(!(dc(a,b,d,e)|0)){i=f;return}e=a+40|0;d=c[e>>2]|0;g=a+36|0;h=a+32|0;if((d|0)==(c[g>>2]|0)){a=c[h>>2]|0;c[g>>2]=d<<1;g=Cc(d<<3)|0;c[h>>2]=g;j=a;Qe(g|0,j|0,c[e>>2]<<2|0)|0;Dc(j);k=c[e>>2]|0}else{k=d}c[(c[h>>2]|0)+(k<<2)>>2]=b;c[e>>2]=(c[e>>2]|0)+1;i=f;return}function Ib(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;e=a+56|0;f=c[e>>2]|0;if((f|0)==(b|0)){i=d;return 1}g=a+52|0;h=c[g>>2]|0;j=a+48|0;k=a+44|0;if((h|0)==(c[j>>2]|0)){a=c[k>>2]|0;c[j>>2]=h<<1;j=Cc(h*24|0)|0;c[k>>2]=j;l=a;Qe(j|0,l|0,(c[g>>2]|0)*12|0)|0;Dc(l);m=c[g>>2]|0;n=c[e>>2]|0}else{m=h;n=f}f=c[k>>2]|0;c[f+(m*12|0)>>2]=(n|0)>(b|0)?b:n;n=c[e>>2]|0;c[f+((c[g>>2]|0)*12|0)+4>>2]=(n|0)<(b|0)?b:n;c[g>>2]=(c[g>>2]|0)+1;i=d;return 1}function Jb(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0;h=i;j=a+60|0;c[j>>2]=0;k=b+12|0;l=+g[d+12>>2];m=+g[k>>2];n=+g[d+8>>2];o=+g[b+16>>2];p=e+12|0;q=+g[f+12>>2];r=+g[p>>2];s=+g[f+8>>2];t=+g[e+16>>2];u=+g[f>>2]+(q*r-s*t)-(+g[d>>2]+(l*m-n*o));v=r*s+q*t+ +g[f+4>>2]-(m*n+l*o+ +g[d+4>>2]);o=+g[b+8>>2]+ +g[e+8>>2];if(u*u+v*v>o*o){i=h;return}c[a+56>>2]=0;e=k;k=c[e+4>>2]|0;b=a+48|0;c[b>>2]=c[e>>2];c[b+4>>2]=k;g[a+40>>2]=0.0;g[a+44>>2]=0.0;c[j>>2]=1;j=p;p=c[j+4>>2]|0;k=a;c[k>>2]=c[j>>2];c[k+4>>2]=p;c[a+16>>2]=0;i=h;return}function Kb(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,l=0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0.0,v=0,w=0,x=0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0;h=i;j=a+60|0;c[j>>2]=0;l=e+12|0;m=+g[f+12>>2];n=+g[l>>2];o=+g[f+8>>2];p=+g[e+16>>2];q=+g[f>>2]+(m*n-o*p)- +g[d>>2];r=n*o+m*p+ +g[f+4>>2]- +g[d+4>>2];p=+g[d+12>>2];m=+g[d+8>>2];o=q*p+r*m;n=p*r-q*m;m=+g[b+8>>2]+ +g[e+8>>2];e=c[b+148>>2]|0;do{if((e|0)>0){d=0;f=0;q=-3.4028234663852886e+38;while(1){r=(o- +g[b+(d<<3)+20>>2])*+g[b+(d<<3)+84>>2]+(n- +g[b+(d<<3)+24>>2])*+g[b+(d<<3)+88>>2];if(r>m){s=19;break}t=r>q;u=t?r:q;v=t?d:f;t=d+1|0;if((t|0)<(e|0)){d=t;f=v;q=u}else{s=4;break}}if((s|0)==4){w=v;x=u<1.1920928955078125e-7;break}else if((s|0)==19){i=h;return}}else{w=0;x=1}}while(0);s=w+1|0;v=b+(w<<3)+20|0;f=c[v>>2]|0;d=c[v+4>>2]|0;u=(c[k>>2]=f,+g[k>>2]);q=(c[k>>2]=d,+g[k>>2]);v=b+(((s|0)<(e|0)?s:0)<<3)+20|0;s=c[v>>2]|0;e=c[v+4>>2]|0;r=(c[k>>2]=s,+g[k>>2]);p=(c[k>>2]=e,+g[k>>2]);if(x){c[j>>2]=1;c[a+56>>2]=1;x=b+(w<<3)+84|0;v=c[x+4>>2]|0;t=a+40|0;c[t>>2]=c[x>>2];c[t+4>>2]=v;y=+((u+r)*.5);z=+((q+p)*.5);v=a+48|0;g[v>>2]=y;g[v+4>>2]=z;v=l;t=c[v+4>>2]|0;x=a;c[x>>2]=c[v>>2];c[x+4>>2]=t;c[a+16>>2]=0;i=h;return}z=o-u;y=n-q;A=o-r;B=n-p;if(z*(r-u)+y*(p-q)<=0.0){if(z*z+y*y>m*m){i=h;return}c[j>>2]=1;c[a+56>>2]=1;t=a+40|0;C=+z;D=+y;x=t;g[x>>2]=C;g[x+4>>2]=D;D=+N(+(z*z+y*y));if(!(D<1.1920928955078125e-7)){C=1.0/D;g[t>>2]=z*C;g[a+44>>2]=y*C}t=a+48|0;c[t>>2]=f;c[t+4>>2]=d;d=l;t=c[d+4>>2]|0;f=a;c[f>>2]=c[d>>2];c[f+4>>2]=t;c[a+16>>2]=0;i=h;return}if(!(A*(u-r)+B*(q-p)<=0.0)){C=(u+r)*.5;r=(q+p)*.5;t=b+(w<<3)+84|0;if((o-C)*+g[t>>2]+(n-r)*+g[b+(w<<3)+88>>2]>m){i=h;return}c[j>>2]=1;c[a+56>>2]=1;w=t;t=c[w+4>>2]|0;b=a+40|0;c[b>>2]=c[w>>2];c[b+4>>2]=t;n=+C;C=+r;t=a+48|0;g[t>>2]=n;g[t+4>>2]=C;t=l;b=c[t+4>>2]|0;w=a;c[w>>2]=c[t>>2];c[w+4>>2]=b;c[a+16>>2]=0;i=h;return}if(A*A+B*B>m*m){i=h;return}c[j>>2]=1;c[a+56>>2]=1;j=a+40|0;m=+A;C=+B;b=j;g[b>>2]=m;g[b+4>>2]=C;C=+N(+(A*A+B*B));if(!(C<1.1920928955078125e-7)){m=1.0/C;g[j>>2]=A*m;g[a+44>>2]=B*m}j=a+48|0;c[j>>2]=s;c[j+4>>2]=e;e=l;l=c[e+4>>2]|0;j=a;c[j>>2]=c[e>>2];c[j+4>>2]=l;c[a+16>>2]=0;i=h;return}function Lb(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,l=0,m=0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0,u=0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0;j=i;l=b+60|0;c[l>>2]=0;m=f+12|0;n=+g[h+12>>2];o=+g[m>>2];p=+g[h+8>>2];q=+g[f+16>>2];r=+g[h>>2]+(n*o-p*q)- +g[e>>2];s=o*p+n*q+ +g[h+4>>2]- +g[e+4>>2];q=+g[e+12>>2];n=+g[e+8>>2];p=r*q+s*n;o=q*s-r*n;e=d+12|0;h=c[e>>2]|0;t=c[e+4>>2]|0;n=(c[k>>2]=h,+g[k>>2]);r=(c[k>>2]=t,+g[k>>2]);e=d+20|0;u=c[e>>2]|0;v=c[e+4>>2]|0;s=(c[k>>2]=u,+g[k>>2]);q=(c[k>>2]=v,+g[k>>2]);w=s-n;x=q-r;y=w*(s-p)+x*(q-o);z=p-n;A=o-r;B=z*w+A*x;C=+g[d+8>>2]+ +g[f+8>>2];if(B<=0.0){if(z*z+A*A>C*C){i=j;return}do{if((a[d+44|0]|0)!=0){f=d+28|0;D=+g[f>>2];if(!((n-p)*(n-D)+(r-o)*(r- +g[f+4>>2])>0.0)){break}i=j;return}}while(0);c[l>>2]=1;c[b+56>>2]=0;g[b+40>>2]=0.0;g[b+44>>2]=0.0;f=b+48|0;c[f>>2]=h;c[f+4>>2]=t;f=b+16|0;c[f>>2]=0;e=f;a[f]=0;a[e+1|0]=0;a[e+2|0]=0;a[e+3|0]=0;e=m;f=c[e+4>>2]|0;E=b;c[E>>2]=c[e>>2];c[E+4>>2]=f;i=j;return}if(y<=0.0){D=p-s;F=o-q;if(D*D+F*F>C*C){i=j;return}do{if((a[d+45|0]|0)!=0){f=d+36|0;G=+g[f>>2];if(!(D*(G-s)+F*(+g[f+4>>2]-q)>0.0)){break}i=j;return}}while(0);c[l>>2]=1;c[b+56>>2]=0;g[b+40>>2]=0.0;g[b+44>>2]=0.0;d=b+48|0;c[d>>2]=u;c[d+4>>2]=v;v=b+16|0;c[v>>2]=0;d=v;a[v]=1;a[d+1|0]=0;a[d+2|0]=0;a[d+3|0]=0;d=m;v=c[d+4>>2]|0;u=b;c[u>>2]=c[d>>2];c[u+4>>2]=v;i=j;return}F=1.0/(w*w+x*x);D=p-(n*y+s*B)*F;s=o-(r*y+q*B)*F;if(D*D+s*s>C*C){i=j;return}C=-x;if(w*A+z*C<0.0){H=-w;I=x}else{H=w;I=C}C=+N(+(H*H+I*I));if(C<1.1920928955078125e-7){J=H;K=I}else{w=1.0/C;J=H*w;K=I*w}c[l>>2]=1;c[b+56>>2]=1;w=+K;K=+J;l=b+40|0;g[l>>2]=w;g[l+4>>2]=K;l=b+48|0;c[l>>2]=h;c[l+4>>2]=t;t=b+16|0;c[t>>2]=0;l=t;a[t]=0;a[l+1|0]=0;a[l+2|0]=1;a[l+3|0]=0;l=m;m=c[l+4>>2]|0;t=b;c[t>>2]=c[l>>2];c[t+4>>2]=m;i=j;return}function Mb(b,d,e,f,h,j){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,O=0,P=0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0,Z=0.0,_=0.0,$=0.0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0.0,Da=0,Ea=0,Fa=0.0,Ga=0;l=i;i=i+144|0;m=l;n=l+16|0;o=l+40|0;p=l+96|0;q=l+120|0;r=b+132|0;s=+g[f+12>>2];t=+g[j+8>>2];u=+g[f+8>>2];v=+g[j+12>>2];w=s*t-u*v;x=t*u+s*v;v=+w;t=+x;y=+g[j>>2]- +g[f>>2];z=+g[j+4>>2]- +g[f+4>>2];A=s*y+u*z;B=s*z-u*y;y=+A;u=+B;f=r;g[f>>2]=y;g[f+4>>2]=u;f=b+140|0;g[f>>2]=v;g[f+4>>2]=t;f=b+144|0;t=+g[h+12>>2];j=b+140|0;v=+g[h+16>>2];C=r;u=A+(x*t-w*v);r=b+136|0;A=t*w+x*v+B;B=+u;v=+A;D=b+148|0;g[D>>2]=B;g[D+4>>2]=v;D=e+28|0;E=c[D>>2]|0;F=c[D+4>>2]|0;D=b+156|0;c[D>>2]=E;c[D+4>>2]=F;D=b+164|0;G=e+12|0;H=c[G>>2]|0;I=c[G+4>>2]|0;G=D;c[G>>2]=H;c[G+4>>2]=I;G=b+172|0;J=e+20|0;K=c[J>>2]|0;L=c[J+4>>2]|0;J=G;c[J>>2]=K;c[J+4>>2]=L;J=e+36|0;M=c[J>>2]|0;O=c[J+4>>2]|0;J=b+180|0;c[J>>2]=M;c[J+4>>2]=O;J=(a[e+44|0]|0)!=0;P=(a[e+45|0]|0)!=0;v=(c[k>>2]=K,+g[k>>2]);B=(c[k>>2]=H,+g[k>>2]);x=v-B;w=(c[k>>2]=L,+g[k>>2]);L=b+168|0;t=(c[k>>2]=I,+g[k>>2]);y=w-t;z=+N(+(x*x+y*y));s=(c[k>>2]=E,+g[k>>2]);Q=(c[k>>2]=F,+g[k>>2]);R=(c[k>>2]=M,+g[k>>2]);S=(c[k>>2]=O,+g[k>>2]);if(z<1.1920928955078125e-7){T=y;U=x}else{V=1.0/z;T=y*V;U=x*V}O=b+196|0;V=-U;M=O;g[M>>2]=T;F=b+200|0;g[F>>2]=V;x=(u-B)*T+(A-t)*V;if(J){V=B-s;B=t-Q;t=+N(+(V*V+B*B));if(t<1.1920928955078125e-7){W=B;X=V}else{y=1.0/t;W=B*y;X=V*y}y=-X;g[b+188>>2]=W;g[b+192>>2]=y;Y=T*X-U*W>=0.0;Z=(u-s)*W+(A-Q)*y}else{Y=0;Z=0.0}a:do{if(P){y=R-v;Q=S-w;W=+N(+(y*y+Q*Q));if(W<1.1920928955078125e-7){_=Q;$=y}else{s=1.0/W;_=Q*s;$=y*s}s=-$;E=b+204|0;g[E>>2]=_;I=b+208|0;g[I>>2]=s;H=U*_-T*$>0.0;y=(u-v)*_+(A-w)*s;if(!J){K=x>=0.0;if(!P){a[b+248|0]=K&1;e=b+212|0;if(K){aa=e;ba=64;break}else{ca=e;ba=65;break}}if(H){do{if(K){a[b+248|0]=1;da=b+212|0}else{e=y>=0.0;a[b+248|0]=e&1;ea=b+212|0;if(e){da=ea;break}s=+-T;Q=+U;e=ea;g[e>>2]=s;g[e+4>>2]=Q;e=b+228|0;g[e>>2]=s;g[e+4>>2]=Q;e=O;ea=c[e+4>>2]|0;fa=b+236|0;c[fa>>2]=c[e>>2];c[fa+4>>2]=ea;break a}}while(0);ea=O;fa=c[ea+4>>2]|0;e=da;c[e>>2]=c[ea>>2];c[e+4>>2]=fa;Q=+-+g[M>>2];s=+-+g[F>>2];fa=b+228|0;g[fa>>2]=Q;g[fa+4>>2]=s;fa=b+204|0;e=c[fa+4>>2]|0;ea=b+236|0;c[ea>>2]=c[fa>>2];c[ea+4>>2]=e;break}else{do{if(K){e=y>=0.0;a[b+248|0]=e&1;ea=b+212|0;if(!e){ga=ea;break}e=O;fa=c[e>>2]|0;ha=c[e+4>>2]|0;e=ea;c[e>>2]=fa;c[e+4>>2]=ha;s=+-(c[k>>2]=fa,+g[k>>2]);Q=+U;e=b+228|0;g[e>>2]=s;g[e+4>>2]=Q;e=b+236|0;c[e>>2]=fa;c[e+4>>2]=ha;break a}else{a[b+248|0]=0;ga=b+212|0}}while(0);Q=+-T;s=+U;K=ga;g[K>>2]=Q;g[K+4>>2]=s;s=+-+g[b+204>>2];Q=+-+g[b+208>>2];K=b+228|0;g[K>>2]=s;g[K+4>>2]=Q;K=O;ha=c[K+4>>2]|0;e=b+236|0;c[e>>2]=c[K>>2];c[e+4>>2]=ha;break}}if(Y&H){do{if(!(Z>=0.0)&!(x>=0.0)){ha=y>=0.0;a[b+248|0]=ha&1;e=b+212|0;if(ha){ia=e;break}Q=+-T;s=+U;ha=e;g[ha>>2]=Q;g[ha+4>>2]=s;ha=b+228|0;g[ha>>2]=Q;g[ha+4>>2]=s;ha=b+236|0;g[ha>>2]=Q;g[ha+4>>2]=s;break a}else{a[b+248|0]=1;ia=b+212|0}}while(0);ha=O;e=c[ha+4>>2]|0;K=ia;c[K>>2]=c[ha>>2];c[K+4>>2]=e;e=b+188|0;K=c[e+4>>2]|0;ha=b+228|0;c[ha>>2]=c[e>>2];c[ha+4>>2]=K;K=b+204|0;ha=c[K+4>>2]|0;e=b+236|0;c[e>>2]=c[K>>2];c[e+4>>2]=ha;break}if(Y){do{if(!(Z>=0.0)){if(!(x>=0.0)){a[b+248|0]=0;ja=b+212|0}else{ha=y>=0.0;a[b+248|0]=ha&1;e=b+212|0;if(ha){ka=e;break}else{ja=e}}s=+-T;Q=+U;e=ja;g[e>>2]=s;g[e+4>>2]=Q;Q=+-+g[E>>2];s=+-+g[I>>2];e=b+228|0;g[e>>2]=Q;g[e+4>>2]=s;s=+-+g[M>>2];Q=+-+g[F>>2];e=b+236|0;g[e>>2]=s;g[e+4>>2]=Q;break a}else{a[b+248|0]=1;ka=b+212|0}}while(0);e=O;ha=e;K=c[ha+4>>2]|0;fa=ka;c[fa>>2]=c[ha>>2];c[fa+4>>2]=K;K=b+188|0;fa=c[K+4>>2]|0;ha=b+228|0;c[ha>>2]=c[K>>2];c[ha+4>>2]=fa;fa=e;e=c[fa+4>>2]|0;ha=b+236|0;c[ha>>2]=c[fa>>2];c[ha+4>>2]=e;break}if(!H){do{if(!(Z>=0.0)|!(x>=0.0)){a[b+248|0]=0;la=b+212|0}else{e=y>=0.0;a[b+248|0]=e&1;ha=b+212|0;if(!e){la=ha;break}e=O;fa=c[e>>2]|0;K=c[e+4>>2]|0;e=ha;c[e>>2]=fa;c[e+4>>2]=K;e=b+228|0;c[e>>2]=fa;c[e+4>>2]=K;e=b+236|0;c[e>>2]=fa;c[e+4>>2]=K;break a}}while(0);Q=+-T;s=+U;H=la;g[H>>2]=Q;g[H+4>>2]=s;s=+-+g[E>>2];Q=+-+g[I>>2];H=b+228|0;g[H>>2]=s;g[H+4>>2]=Q;Q=+-+g[b+188>>2];s=+-+g[b+192>>2];H=b+236|0;g[H>>2]=Q;g[H+4>>2]=s;break}do{if(!(y>=0.0)){if(!(Z>=0.0)){a[b+248|0]=0;ma=b+212|0}else{H=x>=0.0;a[b+248|0]=H&1;K=b+212|0;if(H){na=K;break}else{ma=K}}s=+-T;Q=+U;K=ma;g[K>>2]=s;g[K+4>>2]=Q;Q=+-+g[M>>2];s=+-+g[F>>2];K=b+228|0;g[K>>2]=Q;g[K+4>>2]=s;s=+-+g[b+188>>2];Q=+-+g[b+192>>2];K=b+236|0;g[K>>2]=s;g[K+4>>2]=Q;break a}else{a[b+248|0]=1;na=b+212|0}}while(0);I=O;E=I;K=c[E+4>>2]|0;H=na;c[H>>2]=c[E>>2];c[H+4>>2]=K;K=I;I=c[K+4>>2]|0;H=b+228|0;c[H>>2]=c[K>>2];c[H+4>>2]=I;I=b+204|0;H=c[I+4>>2]|0;K=b+236|0;c[K>>2]=c[I>>2];c[K+4>>2]=H}else{if(!J){H=x>=0.0;a[b+248|0]=H&1;K=b+212|0;if(H){aa=K;ba=64;break}else{ca=K;ba=65;break}}K=Z>=0.0;if(Y){do{if(K){a[b+248|0]=1;oa=b+212|0}else{H=x>=0.0;a[b+248|0]=H&1;I=b+212|0;if(H){oa=I;break}y=+-T;Q=+U;H=I;g[H>>2]=y;g[H+4>>2]=Q;H=O;I=c[H>>2]|0;E=c[H+4>>2]|0;H=b+228|0;c[H>>2]=I;c[H+4>>2]=E;E=b+236|0;g[E>>2]=-(c[k>>2]=I,+g[k>>2]);g[E+4>>2]=Q;break a}}while(0);E=O;I=c[E+4>>2]|0;H=oa;c[H>>2]=c[E>>2];c[H+4>>2]=I;I=b+188|0;H=c[I+4>>2]|0;E=b+228|0;c[E>>2]=c[I>>2];c[E+4>>2]=H;Q=+-+g[M>>2];y=+-+g[F>>2];H=b+236|0;g[H>>2]=Q;g[H+4>>2]=y;break}else{do{if(K){H=x>=0.0;a[b+248|0]=H&1;E=b+212|0;if(!H){pa=E;break}H=O;I=c[H>>2]|0;e=c[H+4>>2]|0;H=E;c[H>>2]=I;c[H+4>>2]=e;H=b+228|0;c[H>>2]=I;c[H+4>>2]=e;y=+-(c[k>>2]=I,+g[k>>2]);Q=+U;I=b+236|0;g[I>>2]=y;g[I+4>>2]=Q;break a}else{a[b+248|0]=0;pa=b+212|0}}while(0);Q=+-T;y=+U;K=pa;g[K>>2]=Q;g[K+4>>2]=y;K=O;I=c[K+4>>2]|0;e=b+228|0;c[e>>2]=c[K>>2];c[e+4>>2]=I;y=+-+g[b+188>>2];Q=+-+g[b+192>>2];I=b+236|0;g[I>>2]=y;g[I+4>>2]=Q;break}}}while(0);if((ba|0)==64){pa=O;oa=c[pa>>2]|0;Y=c[pa+4>>2]|0;pa=aa;c[pa>>2]=oa;c[pa+4>>2]=Y;x=+-(c[k>>2]=oa,+g[k>>2]);Z=+U;oa=b+228|0;g[oa>>2]=x;g[oa+4>>2]=Z;oa=b+236|0;g[oa>>2]=x;g[oa+4>>2]=Z}else if((ba|0)==65){Z=+-T;T=+U;oa=ca;g[oa>>2]=Z;g[oa+4>>2]=T;oa=O;ca=c[oa>>2]|0;Y=c[oa+4>>2]|0;oa=b+228|0;c[oa>>2]=ca;c[oa+4>>2]=Y;oa=b+236|0;c[oa>>2]=ca;c[oa+4>>2]=Y}Y=h+148|0;oa=b+128|0;c[oa>>2]=c[Y>>2];if((c[Y>>2]|0)>0){ca=0;do{T=+g[f>>2];Z=+g[h+(ca<<3)+20>>2];U=+g[j>>2];x=+g[h+(ca<<3)+24>>2];w=+(+g[C>>2]+(T*Z-U*x));A=+(Z*U+T*x+ +g[r>>2]);pa=b+(ca<<3)|0;g[pa>>2]=w;g[pa+4>>2]=A;A=+g[f>>2];w=+g[h+(ca<<3)+84>>2];x=+g[j>>2];T=+g[h+(ca<<3)+88>>2];U=+(A*w-x*T);Z=+(w*x+A*T);pa=b+(ca<<3)+64|0;g[pa>>2]=U;g[pa+4>>2]=Z;ca=ca+1|0;}while((ca|0)<(c[Y>>2]|0))}Y=b+244|0;g[Y>>2]=.019999999552965164;ca=d+60|0;c[ca>>2]=0;pa=b+248|0;aa=c[oa>>2]|0;if((aa|0)<=0){i=l;return}Z=+g[b+164>>2];U=+g[L>>2];T=+g[b+212>>2];A=+g[b+216>>2];x=3.4028234663852886e+38;L=0;do{w=T*(+g[b+(L<<3)>>2]-Z)+A*(+g[b+(L<<3)+4>>2]-U);x=w<x?w:x;L=L+1|0;}while((L|0)!=(aa|0));if(x>.019999999552965164){i=l;return}Nb(m,b);aa=c[m>>2]|0;do{if((aa|0)==0){ba=75}else{U=+g[m+8>>2];if(U>+g[Y>>2]){i=l;return}if(!(U>x*.9800000190734863+.0010000000474974513)){ba=75;break}L=c[m+4>>2]|0;J=n;na=d+56|0;if((aa|0)==1){qa=na;ra=J;ba=77;break}c[na>>2]=2;na=D;ma=c[na+4>>2]|0;la=n;c[la>>2]=c[na>>2];c[la+4>>2]=ma;ma=n+8|0;la=ma;a[ma]=0;ma=L&255;a[la+1|0]=ma;a[la+2|0]=0;a[la+3|0]=1;la=G;na=c[la+4>>2]|0;ka=n+12|0;c[ka>>2]=c[la>>2];c[ka+4>>2]=na;na=n+20|0;ka=na;a[na]=0;a[ka+1|0]=ma;a[ka+2|0]=0;a[ka+3|0]=1;c[o>>2]=L;ka=L+1|0;ma=(ka|0)<(c[oa>>2]|0)?ka:0;c[o+4>>2]=ma;ka=b+(L<<3)|0;na=c[ka>>2]|0;la=c[ka+4>>2]|0;ka=o+8|0;c[ka>>2]=na;c[ka+4>>2]=la;ka=b+(ma<<3)|0;ma=c[ka>>2]|0;ja=c[ka+4>>2]|0;ka=o+16|0;c[ka>>2]=ma;c[ka+4>>2]=ja;ka=b+(L<<3)+64|0;ia=c[ka>>2]|0;ga=c[ka+4>>2]|0;ka=o+24|0;c[ka>>2]=ia;c[ka+4>>2]=ga;sa=ja;ta=ma;ua=la;va=na;wa=ia;xa=ga;ya=J;za=L;Aa=0}}while(0);if((ba|0)==75){qa=d+56|0;ra=n;ba=77}do{if((ba|0)==77){c[qa>>2]=1;aa=c[oa>>2]|0;if((aa|0)>1){x=+g[b+216>>2];U=+g[b+212>>2];m=0;A=U*+g[b+64>>2]+x*+g[b+68>>2];L=1;while(1){Z=U*+g[b+(L<<3)+64>>2]+x*+g[b+(L<<3)+68>>2];J=Z<A;ga=J?L:m;ia=L+1|0;if((ia|0)<(aa|0)){L=ia;A=J?Z:A;m=ga}else{Ba=ga;break}}}else{Ba=0}m=Ba+1|0;L=(m|0)<(aa|0)?m:0;m=b+(Ba<<3)|0;ga=c[m+4>>2]|0;J=n;c[J>>2]=c[m>>2];c[J+4>>2]=ga;ga=n+8|0;J=ga;a[ga]=0;a[J+1|0]=Ba;a[J+2|0]=1;a[J+3|0]=0;J=b+(L<<3)|0;ga=c[J+4>>2]|0;m=n+12|0;c[m>>2]=c[J>>2];c[m+4>>2]=ga;ga=n+20|0;m=ga;a[ga]=0;a[m+1|0]=L;a[m+2|0]=1;a[m+3|0]=0;m=o;if((a[pa]|0)==0){c[m>>2]=1;c[o+4>>2]=0;L=G;ga=c[L>>2]|0;J=c[L+4>>2]|0;L=o+8|0;c[L>>2]=ga;c[L+4>>2]=J;L=D;ia=c[L>>2]|0;na=c[L+4>>2]|0;L=o+16|0;c[L>>2]=ia;c[L+4>>2]=na;L=(g[k>>2]=-+g[M>>2],c[k>>2]|0);la=(g[k>>2]=-+g[F>>2],c[k>>2]|0);ma=o+24|0;c[ma>>2]=L;c[ma+4>>2]=la;sa=na;ta=ia;ua=J;va=ga;wa=L;xa=la;ya=ra;za=1;Aa=1;break}else{c[m>>2]=0;c[o+4>>2]=1;m=D;la=c[m>>2]|0;L=c[m+4>>2]|0;m=o+8|0;c[m>>2]=la;c[m+4>>2]=L;m=G;ga=c[m>>2]|0;J=c[m+4>>2]|0;m=o+16|0;c[m>>2]=ga;c[m+4>>2]=J;m=O;ia=c[m>>2]|0;na=c[m+4>>2]|0;m=o+24|0;c[m>>2]=ia;c[m+4>>2]=na;sa=J;ta=ga;ua=L;va=la;wa=ia;xa=na;ya=ra;za=0;Aa=1;break}}}while(0);A=(c[k>>2]=xa,+g[k>>2]);x=(c[k>>2]=wa,+g[k>>2]);U=(c[k>>2]=va,+g[k>>2]);Z=(c[k>>2]=ua,+g[k>>2]);T=(c[k>>2]=ta,+g[k>>2]);w=(c[k>>2]=sa,+g[k>>2]);sa=o+32|0;ta=o+24|0;ua=o+28|0;va=ta;_=-x;g[sa>>2]=A;g[o+36>>2]=_;xa=o+44|0;x=-A;ra=xa;g[ra>>2]=x;c[ra+4>>2]=wa;ra=o+8|0;O=ra;G=o+12|0;v=A*U+Z*_;g[o+40>>2]=v;D=o+52|0;g[D>>2]=T*x+(c[k>>2]=wa,+g[k>>2])*w;wa=p;p=o;if((Tb(wa,ya,sa,v,za)|0)<2){i=l;return}if((Tb(q,wa,xa,+g[D>>2],c[o+4>>2]|0)|0)<2){i=l;return}o=d+40|0;do{if(Aa){D=ta;xa=c[D>>2]|0;wa=c[D+4>>2]|0;D=o;c[D>>2]=xa;c[D+4>>2]=wa;wa=ra;D=c[wa>>2]|0;za=c[wa+4>>2]|0;wa=d+48|0;c[wa>>2]=D;c[wa+4>>2]=za;v=(c[k>>2]=D,+g[k>>2]);w=(c[k>>2]=xa,+g[k>>2]);x=+g[G>>2];T=+g[ua>>2];_=+g[q>>2];Z=+g[q+4>>2];U=+g[Y>>2];if(!((_-v)*w+(Z-x)*T<=U)){Ca=U;Da=0}else{U=_- +g[C>>2];_=Z- +g[r>>2];Z=+g[f>>2];A=+g[j>>2];u=+(U*Z+_*A);$=+(Z*_-U*A);xa=d;g[xa>>2]=u;g[xa+4>>2]=$;c[d+16>>2]=c[q+8>>2];Ca=+g[Y>>2];Da=1}$=+g[q+12>>2];u=+g[q+16>>2];if(!(($-v)*w+(u-x)*T<=Ca)){Ea=Da;break}T=$- +g[C>>2];$=u- +g[r>>2];u=+g[f>>2];x=+g[j>>2];w=+(T*u+$*x);v=+(u*$-T*x);xa=d+(Da*20|0)|0;g[xa>>2]=w;g[xa+4>>2]=v;c[d+(Da*20|0)+16>>2]=c[q+20>>2];Ea=Da+1|0}else{xa=c[p>>2]|0;D=h+(xa<<3)+84|0;za=c[D+4>>2]|0;wa=o;c[wa>>2]=c[D>>2];c[wa+4>>2]=za;za=h+(xa<<3)+20|0;xa=c[za+4>>2]|0;wa=d+48|0;c[wa>>2]=c[za>>2];c[wa+4>>2]=xa;v=+g[O>>2];w=+g[va>>2];x=+g[G>>2];T=+g[ua>>2];$=+g[Y>>2];if(!((+g[q>>2]-v)*w+(+g[q+4>>2]-x)*T<=$)){Fa=$;Ga=0}else{xa=q;wa=c[xa+4>>2]|0;za=d;c[za>>2]=c[xa>>2];c[za+4>>2]=wa;wa=q+8|0;za=wa;xa=d+16|0;D=xa;a[D+2|0]=a[za+3|0]|0;a[D+3|0]=a[za+2|0]|0;a[xa]=a[za+1|0]|0;a[D+1|0]=a[wa]|0;Fa=+g[Y>>2];Ga=1}wa=q+12|0;if(!((+g[wa>>2]-v)*w+(+g[q+16>>2]-x)*T<=Fa)){Ea=Ga;break}D=wa;wa=c[D+4>>2]|0;za=d+(Ga*20|0)|0;c[za>>2]=c[D>>2];c[za+4>>2]=wa;wa=q+20|0;za=wa;D=d+(Ga*20|0)+16|0;xa=D;a[xa+2|0]=a[za+3|0]|0;a[xa+3|0]=a[za+2|0]|0;a[D]=a[za+1|0]|0;a[xa+1|0]=a[wa]|0;Ea=Ga+1|0}}while(0);c[ca>>2]=Ea;i=l;return}function Nb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0,r=0,s=0,t=0,u=0.0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0,F=0.0,G=0;d=i;e=a;c[e>>2]=0;f=a+4|0;c[f>>2]=-1;h=a+8|0;g[h>>2]=-3.4028234663852886e+38;j=+g[b+216>>2];k=+g[b+212>>2];a=c[b+128>>2]|0;if((a|0)<=0){i=d;return}l=+g[b+164>>2];m=+g[b+168>>2];n=+g[b+172>>2];o=+g[b+176>>2];p=+g[b+244>>2];q=b+228|0;r=b+232|0;s=b+236|0;t=b+240|0;u=-3.4028234663852886e+38;v=0;while(1){w=+g[b+(v<<3)+64>>2];x=-w;y=-+g[b+(v<<3)+68>>2];z=+g[b+(v<<3)>>2];A=+g[b+(v<<3)+4>>2];B=(z-l)*x+(A-m)*y;C=(z-n)*x+(A-o)*y;D=B<C?B:C;if(D>p){break}if(!(j*w+k*y>=0.0)){if(!((x- +g[q>>2])*k+(y- +g[r>>2])*j<-.03490658849477768)&D>u){E=8}else{F=u}}else{if(!((x- +g[s>>2])*k+(y- +g[t>>2])*j<-.03490658849477768)&D>u){E=8}else{F=u}}if((E|0)==8){E=0;c[e>>2]=2;c[f>>2]=v;g[h>>2]=D;F=D}G=v+1|0;if((G|0)<(a|0)){u=F;v=G}else{E=10;break}}if((E|0)==10){i=d;return}c[e>>2]=2;c[f>>2]=v;g[h>>2]=D;i=d;return}function Ob(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0;f=i;i=i+256|0;Mb(f,a,b,c,d,e);i=f;return}function Pb(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0,L=0,M=0,O=0,P=0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0,V=0,W=0;j=i;i=i+104|0;k=j;l=j+8|0;m=j+16|0;n=j+40|0;o=j+48|0;p=j+72|0;q=j+96|0;r=b+60|0;c[r>>2]=0;s=+g[d+8>>2]+ +g[f+8>>2];c[k>>2]=0;t=+Qb(k,d,e,f,h);if(t>s){i=j;return}c[l>>2]=0;u=+Qb(l,f,h,d,e);if(u>s){i=j;return}if(u>t*.9800000190734863+.0010000000474974513){t=+g[h>>2];u=+g[h+4>>2];v=+g[h+8>>2];w=+g[h+12>>2];x=+g[e>>2];y=+g[e+4>>2];z=+g[e+8>>2];A=+g[e+12>>2];B=c[l>>2]|0;c[b+56>>2]=2;C=w;D=v;E=u;F=t;G=A;H=z;I=y;J=x;K=B;L=1;M=f;O=d}else{x=+g[e>>2];y=+g[e+4>>2];z=+g[e+8>>2];A=+g[e+12>>2];t=+g[h>>2];u=+g[h+4>>2];v=+g[h+8>>2];w=+g[h+12>>2];h=c[k>>2]|0;c[b+56>>2]=1;C=A;D=z;E=y;F=x;G=w;H=v;I=u;J=t;K=h;L=0;M=d;O=f}f=m;d=c[O+148>>2]|0;t=+g[M+(K<<3)+84>>2];u=+g[M+(K<<3)+88>>2];v=C*t-D*u;w=D*t+C*u;u=G*v+H*w;t=G*w-H*v;if((d|0)>0){h=0;k=0;v=3.4028234663852886e+38;while(1){w=u*+g[O+(h<<3)+84>>2]+t*+g[O+(h<<3)+88>>2];e=w<v;B=e?h:k;l=h+1|0;if((l|0)==(d|0)){P=B;break}else{v=e?w:v;k=B;h=l}}}else{P=0}h=P+1|0;k=(h|0)<(d|0)?h:0;v=+g[O+(P<<3)+20>>2];t=+g[O+(P<<3)+24>>2];u=+(J+(G*v-H*t));w=+(I+(H*v+G*t));h=m;g[h>>2]=u;g[h+4>>2]=w;h=K&255;d=m+8|0;l=d;a[d]=h;a[l+1|0]=P;a[l+2|0]=1;a[l+3|0]=0;w=+g[O+(k<<3)+20>>2];u=+g[O+(k<<3)+24>>2];t=+(J+(G*w-H*u));v=+(I+(H*w+G*u));O=m+12|0;g[O>>2]=t;g[O+4>>2]=v;O=m+20|0;m=O;a[O]=h;a[m+1|0]=k;a[m+2|0]=1;a[m+3|0]=0;m=K+1|0;k=(m|0)<(c[M+148>>2]|0)?m:0;m=M+(K<<3)+20|0;v=+g[m>>2];t=+g[m+4>>2];m=M+(k<<3)+20|0;u=+g[m>>2];w=+g[m+4>>2];x=u-v;y=w-t;z=+N(+(x*x+y*y));if(z<1.1920928955078125e-7){Q=y;R=x}else{A=1.0/z;Q=y*A;R=x*A}A=C*R-D*Q;x=C*Q+D*R;g[n>>2]=A;g[n+4>>2]=x;y=-A;z=F+(C*v-D*t);S=E+(D*v+C*t);m=o;T=z*x+S*y;g[q>>2]=y;g[q+4>>2]=-x;if((Tb(m,f,q,s-(z*A+S*x),K)|0)<2){i=j;return}if((Tb(p,m,n,s+((F+(C*u-D*w))*A+(E+(D*u+C*w))*x),k)|0)<2){i=j;return}C=+Q;Q=+-R;k=b+40|0;g[k>>2]=C;g[k+4>>2]=Q;Q=+((v+u)*.5);u=+((t+w)*.5);k=b+48|0;g[k>>2]=Q;g[k+4>>2]=u;u=+g[p>>2];Q=+g[p+4>>2];k=!(x*u+Q*y-T<=s);do{if(L<<24>>24==0){if(k){U=0}else{w=u-J;t=Q-I;v=+(G*w+H*t);C=+(G*t-H*w);n=b;g[n>>2]=v;g[n+4>>2]=C;c[b+16>>2]=c[p+8>>2];U=1}C=+g[p+12>>2];v=+g[p+16>>2];if(!(x*C+v*y-T<=s)){V=U;break}w=C-J;C=v-I;v=+(G*w+H*C);t=+(G*C-H*w);n=b+(U*20|0)|0;g[n>>2]=v;g[n+4>>2]=t;c[b+(U*20|0)+16>>2]=c[p+20>>2];V=U+1|0}else{if(k){W=0}else{t=u-J;v=Q-I;w=+(G*t+H*v);C=+(G*v-H*t);n=b;g[n>>2]=w;g[n+4>>2]=C;n=b+16|0;m=c[p+8>>2]|0;c[n>>2]=m;K=n;a[n]=m>>>8;a[K+1|0]=m;a[K+2|0]=m>>>24;a[K+3|0]=m>>>16;W=1}C=+g[p+12>>2];w=+g[p+16>>2];if(!(x*C+w*y-T<=s)){V=W;break}t=C-J;C=w-I;w=+(G*t+H*C);v=+(G*C-H*t);m=b+(W*20|0)|0;g[m>>2]=w;g[m+4>>2]=v;m=b+(W*20|0)+16|0;K=c[p+20>>2]|0;c[m>>2]=K;n=m;a[m]=K>>>8;a[n+1|0]=K;a[n+2|0]=K>>>24;a[n+3|0]=K>>>16;V=W+1|0}}while(0);c[r>>2]=V;i=j;return}function Qb(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0,v=0,w=0,x=0,y=0,z=0,A=0.0,B=0,C=0,D=0.0;h=i;j=c[b+148>>2]|0;k=+g[f+12>>2];l=+g[e+12>>2];m=+g[f+8>>2];n=+g[e+16>>2];o=+g[d+12>>2];p=+g[b+12>>2];q=+g[d+8>>2];r=+g[b+16>>2];s=+g[f>>2]+(k*l-m*n)-(+g[d>>2]+(o*p-q*r));t=l*m+k*n+ +g[f+4>>2]-(p*q+o*r+ +g[d+4>>2]);r=o*s+q*t;p=o*t-s*q;if((j|0)>0){u=0;v=0;q=-3.4028234663852886e+38;while(1){s=r*+g[b+(v<<3)+84>>2]+p*+g[b+(v<<3)+88>>2];w=s>q;x=w?v:u;y=v+1|0;if((y|0)==(j|0)){z=x;break}else{q=w?s:q;v=y;u=x}}}else{z=0}q=+Rb(b,d,z,e,f);u=((z|0)>0?z:j)+ -1|0;p=+Rb(b,d,u,e,f);v=z+1|0;x=(v|0)<(j|0)?v:0;r=+Rb(b,d,x,e,f);if(p>q&p>r){v=u;s=p;while(1){u=((v|0)>0?v:j)+ -1|0;p=+Rb(b,d,u,e,f);if(p>s){s=p;v=u}else{A=s;B=v;break}}c[a>>2]=B;i=h;return+A}if(r>q){C=x;D=r}else{A=q;B=z;c[a>>2]=B;i=h;return+A}while(1){z=C+1|0;x=(z|0)<(j|0)?z:0;q=+Rb(b,d,x,e,f);if(q>D){D=q;C=x}else{A=D;B=C;break}}c[a>>2]=B;i=h;return+A}function Rb(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0.0,v=0.0,w=0,x=0,y=0,z=0;h=i;j=c[e+148>>2]|0;k=+g[b+12>>2];l=+g[a+(d<<3)+84>>2];m=+g[b+8>>2];n=+g[a+(d<<3)+88>>2];o=k*l-m*n;p=l*m+k*n;n=+g[f+12>>2];l=+g[f+8>>2];q=n*o+l*p;r=n*p-o*l;if((j|0)>0){s=0;t=0;u=3.4028234663852886e+38;while(1){v=q*+g[e+(s<<3)+20>>2]+r*+g[e+(s<<3)+24>>2];w=v<u;x=w?s:t;y=s+1|0;if((y|0)==(j|0)){z=x;break}else{u=w?v:u;t=x;s=y}}}else{z=0}u=+g[a+(d<<3)+20>>2];r=+g[a+(d<<3)+24>>2];q=+g[e+(z<<3)+20>>2];v=+g[e+(z<<3)+24>>2];i=h;return+(o*(+g[f>>2]+(n*q-l*v)-(+g[b>>2]+(k*u-m*r)))+p*(q*l+n*v+ +g[f+4>>2]-(u*m+k*r+ +g[b+4>>2])))}function Sb(a,b,d,e,f,h){a=a|0;b=b|0;d=d|0;e=+e;f=f|0;h=+h;var j=0,k=0,l=0,m=0,n=0.0,o=0.0,p=0,q=0.0,r=0.0,s=0.0,t=0.0,u=0,v=0.0,w=0.0,x=0,y=0,z=0,A=0,B=0.0,C=0.0,D=0,E=0.0,F=0.0,G=0.0,H=0.0;j=i;k=b+60|0;if((c[k>>2]|0)==0){i=j;return}l=c[b+56>>2]|0;if((l|0)==1){m=d+12|0;n=+g[m>>2];o=+g[b+40>>2];p=d+8|0;q=+g[p>>2];r=+g[b+44>>2];s=n*o-q*r;t=o*q+n*r;r=+s;n=+t;u=a;g[u>>2]=r;g[u+4>>2]=n;n=+g[m>>2];r=+g[b+48>>2];q=+g[p>>2];o=+g[b+52>>2];v=+g[d>>2]+(n*r-q*o);w=r*q+n*o+ +g[d+4>>2];if((c[k>>2]|0)<=0){i=j;return}p=f+12|0;m=f+8|0;u=f;x=f+4|0;y=a;z=a+4|0;o=t;t=s;A=0;while(1){s=+g[p>>2];n=+g[b+(A*20|0)>>2];q=+g[m>>2];r=+g[b+(A*20|0)+4>>2];B=+g[u>>2]+(s*n-q*r);C=n*q+s*r+ +g[x>>2];r=e-(t*(B-v)+(C-w)*o);s=+((B-t*h+(B+t*r))*.5);B=+((C-o*h+(C+o*r))*.5);D=a+(A<<3)+8|0;g[D>>2]=s;g[D+4>>2]=B;D=A+1|0;if((D|0)>=(c[k>>2]|0)){break}o=+g[z>>2];t=+g[y>>2];A=D}i=j;return}else if((l|0)==0){A=a;g[A>>2]=1.0;y=a+4|0;g[y>>2]=0.0;t=+g[d+12>>2];o=+g[b+48>>2];w=+g[d+8>>2];v=+g[b+52>>2];B=+g[d>>2]+(t*o-w*v);s=o*w+t*v+ +g[d+4>>2];v=+g[f+12>>2];t=+g[b>>2];w=+g[f+8>>2];o=+g[b+4>>2];r=+g[f>>2]+(v*t-w*o);C=t*w+v*o+ +g[f+4>>2];o=B-r;v=s-C;do{if(o*o+v*v>1.4210854715202004e-14){w=r-B;t=C-s;q=+w;n=+t;z=a;g[z>>2]=q;g[z+4>>2]=n;n=+N(+(w*w+t*t));if(n<1.1920928955078125e-7){E=t;F=w;break}q=1.0/n;n=w*q;g[A>>2]=n;w=t*q;g[y>>2]=w;E=w;F=n}else{E=0.0;F=1.0}}while(0);v=+((B+F*e+(r-F*h))*.5);F=+((s+E*e+(C-E*h))*.5);y=a+8|0;g[y>>2]=v;g[y+4>>2]=F;i=j;return}else if((l|0)==2){l=f+12|0;F=+g[l>>2];v=+g[b+40>>2];y=f+8|0;E=+g[y>>2];C=+g[b+44>>2];s=F*v-E*C;r=v*E+F*C;A=a;C=+s;F=+r;z=A;g[z>>2]=C;g[z+4>>2]=F;F=+g[l>>2];C=+g[b+48>>2];E=+g[y>>2];v=+g[b+52>>2];B=+g[f>>2]+(F*C-E*v);o=C*E+F*v+ +g[f+4>>2];if((c[k>>2]|0)>0){f=d+12|0;y=d+8|0;l=d;z=d+4|0;d=a;x=a+4|0;v=r;F=s;u=0;while(1){E=+g[f>>2];C=+g[b+(u*20|0)>>2];n=+g[y>>2];w=+g[b+(u*20|0)+4>>2];q=+g[l>>2]+(E*C-n*w);t=C*n+E*w+ +g[z>>2];w=h-(F*(q-B)+(t-o)*v);E=+((q-F*e+(q+F*w))*.5);q=+((t-v*e+(t+v*w))*.5);m=a+(u<<3)+8|0;g[m>>2]=E;g[m+4>>2]=q;m=u+1|0;q=+g[d>>2];E=+g[x>>2];if((m|0)<(c[k>>2]|0)){u=m;F=q;v=E}else{G=E;H=q;break}}}else{G=r;H=s}s=+-H;H=+-G;u=A;g[u>>2]=s;g[u+4>>2]=H;i=j;return}else{i=j;return}}function Tb(b,d,e,f,h){b=b|0;d=d|0;e=e|0;f=+f;h=h|0;var j=0,k=0.0,l=0,m=0.0,n=0.0,o=0,p=0,q=0,r=0.0,s=0,t=0,u=0,v=0,w=0;j=i;k=+g[e>>2];l=d;m=+g[e+4>>2];e=d+4|0;n=k*+g[l>>2]+m*+g[e>>2]-f;o=d+12|0;p=o;q=d+16|0;r=k*+g[p>>2]+m*+g[q>>2]-f;if(!(n<=0.0)){s=0}else{t=b;u=d;c[t+0>>2]=c[u+0>>2];c[t+4>>2]=c[u+4>>2];c[t+8>>2]=c[u+8>>2];s=1}if(!(r<=0.0)){v=s}else{u=s+1|0;t=b+(s*12|0)|0;s=o;c[t+0>>2]=c[s+0>>2];c[t+4>>2]=c[s+4>>2];c[t+8>>2]=c[s+8>>2];v=u}if(!(n*r<0.0)){w=v;i=j;return w|0}f=n/(n-r);r=+g[l>>2];n=+g[e>>2];m=+(r+f*(+g[p>>2]-r));r=+(n+f*(+g[q>>2]-n));q=b+(v*12|0)|0;g[q>>2]=m;g[q+4>>2]=r;q=b+(v*12|0)+8|0;b=q;a[q]=h;a[b+1|0]=a[d+9|0]|0;a[b+2|0]=0;a[b+3|0]=1;w=v+1|0;i=j;return w|0}function Ub(d,e,f,h,j,k){d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0;l=i;i=i+136|0;m=l;n=l+96|0;o=l+112|0;c[m+16>>2]=0;c[m+20>>2]=0;g[m+24>>2]=0.0;c[m+44>>2]=0;c[m+48>>2]=0;g[m+52>>2]=0.0;Vb(m,d,e);Vb(m+28|0,f,h);h=m+56|0;f=j;c[h+0>>2]=c[f+0>>2];c[h+4>>2]=c[f+4>>2];c[h+8>>2]=c[f+8>>2];c[h+12>>2]=c[f+12>>2];f=m+72|0;h=k;c[f+0>>2]=c[h+0>>2];c[f+4>>2]=c[h+4>>2];c[f+8>>2]=c[h+8>>2];c[f+12>>2]=c[h+12>>2];a[m+88|0]=1;b[n+4>>1]=0;Xb(o,n,m);i=l;return+g[o+16>>2]<11920928955078125.0e-22|0}function Vb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0;e=i;f=c[b+4>>2]|0;if((f|0)==2){c[a+16>>2]=b+20;c[a+20>>2]=c[b+148>>2];g[a+24>>2]=+g[b+8>>2];i=e;return}else if((f|0)==3){h=b+12|0;j=(c[h>>2]|0)+(d<<3)|0;k=c[j+4>>2]|0;l=a;c[l>>2]=c[j>>2];c[l+4>>2]=k;k=d+1|0;d=a+8|0;l=c[h>>2]|0;if((k|0)<(c[b+16>>2]|0)){h=l+(k<<3)|0;k=c[h+4>>2]|0;j=d;c[j>>2]=c[h>>2];c[j+4>>2]=k}else{k=l;l=c[k+4>>2]|0;j=d;c[j>>2]=c[k>>2];c[j+4>>2]=l}c[a+16>>2]=a;c[a+20>>2]=2;g[a+24>>2]=+g[b+8>>2];i=e;return}else if((f|0)==0){c[a+16>>2]=b+12;c[a+20>>2]=1;g[a+24>>2]=+g[b+8>>2];i=e;return}else if((f|0)==1){c[a+16>>2]=b+12;c[a+20>>2]=2;g[a+24>>2]=+g[b+8>>2];i=e;return}else{i=e;return}}function Wb(a){a=a|0;var b=0,d=0,e=0.0,f=0.0,h=0,j=0.0,k=0.0,l=0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0,B=0,C=0;b=i;d=a+16|0;e=+g[d>>2];f=+g[d+4>>2];d=a+36|0;h=a+52|0;j=+g[h>>2];k=+g[h+4>>2];h=a+72|0;l=a+88|0;m=+g[l>>2];n=+g[l+4>>2];o=j-e;p=k-f;q=e*o+f*p;r=j*o+k*p;s=m-e;t=n-f;u=e*s+f*t;v=m*s+n*t;w=m-j;x=n-k;y=j*w+k*x;z=m*w+n*x;x=o*t-p*s;s=(j*n-k*m)*x;p=(f*m-e*n)*x;n=(e*k-f*j)*x;if(!(!(q>=-0.0)|!(u>=-0.0))){g[a+24>>2]=1.0;c[a+108>>2]=1;i=b;return}if(!(!(q<-0.0)|!(r>0.0)|!(n<=0.0))){x=1.0/(r-q);g[a+24>>2]=r*x;g[a+60>>2]=-(q*x);c[a+108>>2]=2;i=b;return}if(!(!(u<-0.0)|!(v>0.0)|!(p<=0.0))){x=1.0/(v-u);g[a+24>>2]=v*x;g[a+96>>2]=-(u*x);c[a+108>>2]=2;A=d+0|0;B=h+0|0;C=A+36|0;do{c[A>>2]=c[B>>2];A=A+4|0;B=B+4|0}while((A|0)<(C|0));i=b;return}if(!(!(r<=0.0)|!(y>=-0.0))){g[a+60>>2]=1.0;c[a+108>>2]=1;A=a+0|0;B=d+0|0;C=A+36|0;do{c[A>>2]=c[B>>2];A=A+4|0;B=B+4|0}while((A|0)<(C|0));i=b;return}if(!(!(v<=0.0)|!(z<=0.0))){g[a+96>>2]=1.0;c[a+108>>2]=1;A=a+0|0;B=h+0|0;C=A+36|0;do{c[A>>2]=c[B>>2];A=A+4|0;B=B+4|0}while((A|0)<(C|0));i=b;return}if(!(y<-0.0)|!(z>0.0)|!(s<=0.0)){v=1.0/(n+(s+p));g[a+24>>2]=s*v;g[a+60>>2]=p*v;g[a+96>>2]=n*v;c[a+108>>2]=3;i=b;return}else{v=1.0/(z-y);g[a+60>>2]=z*v;g[a+96>>2]=-(y*v);c[a+108>>2]=2;A=a+0|0;B=h+0|0;C=A+36|0;do{c[A>>2]=c[B>>2];A=A+4|0;B=B+4|0}while((A|0)<(C|0));i=b;return}}function Xb(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0.0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0,B=0.0,C=0.0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,O=0,P=0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0,Y=0,Z=0,_=0,$=0,aa=0.0,ba=0.0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0.0,sa=0.0,ta=0.0,ua=0.0,va=0,wa=0.0,xa=0,ya=0.0,za=0.0;h=i;i=i+176|0;j=h;l=h+16|0;m=h+32|0;n=h+144|0;o=h+160|0;c[20]=(c[20]|0)+1;p=f;q=f+28|0;r=j;s=f+56|0;c[r+0>>2]=c[s+0>>2];c[r+4>>2]=c[s+4>>2];c[r+8>>2]=c[s+8>>2];c[r+12>>2]=c[s+12>>2];s=l;r=f+72|0;c[s+0>>2]=c[r+0>>2];c[s+4>>2]=c[r+4>>2];c[s+8>>2]=c[r+8>>2];c[s+12>>2]=c[r+12>>2];r=m;Yb(m,e,p,j,q,l);q=m;p=m+108|0;t=+g[j+12>>2];u=+g[j+8>>2];s=f+16|0;v=f+20|0;w=+g[j>>2];x=+g[j+4>>2];y=+g[l+12>>2];z=+g[l+8>>2];j=f+44|0;A=f+48|0;B=+g[l>>2];C=+g[l+4>>2];l=m+16|0;D=m+20|0;E=m+52|0;F=m+56|0;G=m+16|0;H=m+52|0;I=m+24|0;J=m+60|0;K=m+36|0;L=c[p>>2]|0;M=0;a:while(1){O=(L|0)>0;if(O){P=0;do{c[n+(P<<2)>>2]=c[q+(P*36|0)+28>>2];c[o+(P<<2)>>2]=c[q+(P*36|0)+32>>2];P=P+1|0;}while((P|0)!=(L|0))}do{if((L|0)==2){P=G;Q=+g[P>>2];R=+g[P+4>>2];P=H;S=+g[P>>2];T=+g[P+4>>2];U=S-Q;V=T-R;W=Q*U+R*V;if(W>=-0.0){g[I>>2]=1.0;c[p>>2]=1;X=13;break}R=S*U+T*V;if(!(R<=0.0)){V=1.0/(R-W);g[I>>2]=R*V;g[J>>2]=-(W*V);c[p>>2]=2;X=14;break}else{g[J>>2]=1.0;c[p>>2]=1;P=r+0|0;Y=K+0|0;Z=P+36|0;do{c[P>>2]=c[Y>>2];P=P+4|0;Y=Y+4|0}while((P|0)<(Z|0));X=13;break}}else if((L|0)==3){Wb(m);Y=c[p>>2]|0;if((Y|0)==3){X=11;break a}else{_=Y;X=12}}else{_=L;X=12}}while(0);do{if((X|0)==12){X=0;if((_|0)==2){X=14;break}else if((_|0)==1){X=13;break}Y=1032;V=+g[Y>>2];$=_;aa=+g[Y+4>>2];ba=V}}while(0);do{if((X|0)==13){X=0;$=1;aa=-+g[D>>2];ba=-+g[l>>2]}else if((X|0)==14){X=0;V=+g[l>>2];W=+g[E>>2]-V;R=+g[D>>2];T=+g[F>>2]-R;if(V*T-W*R>0.0){$=2;aa=W;ba=-T;break}else{$=2;aa=-W;ba=T;break}}}while(0);if(aa*aa+ba*ba<1.4210854715202004e-14){ca=$;da=M;X=31;break}Y=q+($*36|0)|0;T=-ba;W=-aa;R=t*T+u*W;V=t*W-u*T;P=c[s>>2]|0;Z=c[v>>2]|0;if((Z|0)>1){ea=0;T=V*+g[P+4>>2]+R*+g[P>>2];fa=1;while(1){W=R*+g[P+(fa<<3)>>2]+V*+g[P+(fa<<3)+4>>2];ga=W>T;ha=ga?fa:ea;ia=fa+1|0;if((ia|0)==(Z|0)){ja=ha;break}else{fa=ia;T=ga?W:T;ea=ha}}}else{ja=0}c[q+($*36|0)+28>>2]=ja;T=+g[P+(ja<<3)>>2];V=+g[P+(ja<<3)+4>>2];R=w+(t*T-u*V);W=+R;U=+(T*u+t*V+x);ea=Y;g[ea>>2]=W;g[ea+4>>2]=U;U=ba*y+aa*z;W=aa*y-ba*z;ea=c[j>>2]|0;fa=c[A>>2]|0;if((fa|0)>1){Z=0;V=W*+g[ea+4>>2]+U*+g[ea>>2];ha=1;while(1){T=U*+g[ea+(ha<<3)>>2]+W*+g[ea+(ha<<3)+4>>2];ga=T>V;ia=ga?ha:Z;ka=ha+1|0;if((ka|0)==(fa|0)){la=ia;break}else{ha=ka;V=ga?T:V;Z=ia}}}else{la=0}c[q+($*36|0)+32>>2]=la;V=+g[ea+(la<<3)>>2];W=+g[ea+(la<<3)+4>>2];U=B+(y*V-z*W);T=+U;S=+(V*z+y*W+C);Z=q+($*36|0)+8|0;g[Z>>2]=T;g[Z+4>>2]=S;S=+(U-R);U=+(+g[q+($*36|0)+12>>2]- +g[q+($*36|0)+4>>2]);Z=q+($*36|0)+16|0;g[Z>>2]=S;g[Z+4>>2]=U;ma=M+1|0;c[22]=(c[22]|0)+1;if(O){Z=0;do{if((ja|0)==(c[n+(Z<<2)>>2]|0)){if((la|0)==(c[o+(Z<<2)>>2]|0)){X=30;break a}}Z=Z+1|0;}while((Z|0)<(L|0))}Z=(c[p>>2]|0)+1|0;c[p>>2]=Z;if((ma|0)<20){L=Z;M=ma}else{ca=Z;da=ma;X=31;break}}if((X|0)==11){L=c[24]|0;c[24]=(L|0)>(M|0)?L:M;na=d+8|0;oa=M;X=35}else if((X|0)==30){ca=c[p>>2]|0;da=ma;X=31}do{if((X|0)==31){ma=c[24]|0;c[24]=(ma|0)>(da|0)?ma:da;ma=d+8|0;if((ca|0)==1){p=m;M=c[p>>2]|0;L=c[p+4>>2]|0;p=d;c[p>>2]=M;c[p+4>>2]=L;p=m+8|0;o=c[p>>2]|0;la=c[p+4>>2]|0;p=ma;c[p>>2]=o;c[p+4>>2]=la;C=(c[k>>2]=M,+g[k>>2]);y=(c[k>>2]=o,+g[k>>2]);z=(c[k>>2]=L,+g[k>>2]);pa=ma;qa=1;ra=(c[k>>2]=la,+g[k>>2]);sa=z;ta=y;ua=C;va=da;break}else if((ca|0)==2){C=+g[I>>2];y=+g[J>>2];z=C*+g[m>>2]+y*+g[m+36>>2];B=C*+g[m+4>>2]+y*+g[m+40>>2];ba=+z;aa=+B;la=d;g[la>>2]=ba;g[la+4>>2]=aa;aa=C*+g[m+8>>2]+y*+g[m+44>>2];ba=C*+g[m+12>>2]+y*+g[m+48>>2];y=+aa;C=+ba;la=ma;g[la>>2]=y;g[la+4>>2]=C;pa=ma;qa=2;ra=ba;sa=B;ta=aa;ua=z;va=da;break}else if((ca|0)==3){na=ma;oa=da;X=35;break}else{pa=ma;qa=ca;ra=+g[d+12>>2];sa=+g[d+4>>2];ta=+g[ma>>2];ua=+g[d>>2];va=da;break}}}while(0);if((X|0)==35){z=+g[I>>2];aa=+g[J>>2];B=+g[m+96>>2];ba=z*+g[m>>2]+aa*+g[m+36>>2]+B*+g[m+72>>2];C=z*+g[m+4>>2]+aa*+g[m+40>>2]+B*+g[m+76>>2];B=+ba;aa=+C;J=d;g[J>>2]=B;g[J+4>>2]=aa;J=na;g[J>>2]=B;g[J+4>>2]=aa;pa=na;qa=3;ra=C;sa=C;ta=ba;ua=ba;va=oa}oa=d;na=pa;ba=ua-ta;J=d+4|0;I=d+12|0;ta=sa-ra;da=d+16|0;g[da>>2]=+N(+(ba*ba+ta*ta));c[d+20>>2]=va;if((qa|0)==2){ta=+g[l>>2]- +g[E>>2];ba=+g[D>>2]- +g[F>>2];wa=+N(+(ta*ta+ba*ba));X=39}else if((qa|0)==3){ba=+g[l>>2];ta=+g[D>>2];wa=(+g[E>>2]-ba)*(+g[m+92>>2]-ta)-(+g[F>>2]-ta)*(+g[m+88>>2]-ba);X=39}else{g[e>>2]=0.0;b[e+4>>1]=qa;if((qa|0)>0){xa=0;X=41}}if((X|0)==39){g[e>>2]=wa;b[e+4>>1]=qa;xa=0;X=41}if((X|0)==41){while(1){X=0;a[e+xa+6|0]=c[q+(xa*36|0)+28>>2];a[e+xa+9|0]=c[q+(xa*36|0)+32>>2];m=xa+1|0;if((m|0)<(qa|0)){xa=m;X=41}else{break}}}if((a[f+88|0]|0)==0){i=h;return}wa=+g[f+24>>2];ba=+g[f+52>>2];ta=+g[da>>2];ra=wa+ba;if(!(ta>ra&ta>1.1920928955078125e-7)){sa=+((+g[oa>>2]+ +g[na>>2])*.5);ua=+((+g[J>>2]+ +g[I>>2])*.5);f=d;g[f>>2]=sa;g[f+4>>2]=ua;f=pa;g[f>>2]=sa;g[f+4>>2]=ua;g[da>>2]=0.0;i=h;return}g[da>>2]=ta-ra;ra=+g[na>>2];ta=+g[oa>>2];ua=ra-ta;sa=+g[I>>2];C=+g[J>>2];aa=sa-C;B=+N(+(ua*ua+aa*aa));if(B<1.1920928955078125e-7){ya=aa;za=ua}else{z=1.0/B;ya=aa*z;za=ua*z}g[oa>>2]=wa*za+ta;g[J>>2]=wa*ya+C;g[na>>2]=ra-ba*za;g[I>>2]=sa-ba*ya;i=h;return}function Yb(a,e,f,h,j,k){a=a|0;e=e|0;f=f|0;h=h|0;j=j|0;k=k|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,O=0;l=i;m=b[e+4>>1]|0;n=m&65535;o=a+108|0;c[o>>2]=n;p=a;if(m<<16>>16==0){q=n}else{n=f+16|0;m=j+16|0;r=h+12|0;s=h+8|0;t=h;u=h+4|0;v=k+12|0;w=k+8|0;x=k;y=k+4|0;z=0;while(1){A=d[e+z+6|0]|0;c[p+(z*36|0)+28>>2]=A;B=d[e+z+9|0]|0;c[p+(z*36|0)+32>>2]=B;C=(c[n>>2]|0)+(A<<3)|0;D=+g[C>>2];E=+g[C+4>>2];C=(c[m>>2]|0)+(B<<3)|0;F=+g[C>>2];G=+g[C+4>>2];H=+g[r>>2];I=+g[s>>2];J=+g[t>>2]+(D*H-E*I);K=+J;L=+(H*E+D*I+ +g[u>>2]);C=p+(z*36|0)|0;g[C>>2]=K;g[C+4>>2]=L;L=+g[v>>2];K=+g[w>>2];I=+g[x>>2]+(F*L-G*K);D=+I;E=+(G*L+F*K+ +g[y>>2]);C=p+(z*36|0)+8|0;g[C>>2]=D;g[C+4>>2]=E;E=+(I-J);J=+(+g[p+(z*36|0)+12>>2]- +g[p+(z*36|0)+4>>2]);C=p+(z*36|0)+16|0;g[C>>2]=E;g[C+4>>2]=J;g[p+(z*36|0)+24>>2]=0.0;C=z+1|0;B=c[o>>2]|0;if((C|0)<(B|0)){z=C}else{q=B;break}}}do{if((q|0)>1){J=+g[e>>2];if((q|0)==2){E=+g[a+16>>2]- +g[a+52>>2];I=+g[a+20>>2]- +g[a+56>>2];M=+N(+(E*E+I*I))}else if((q|0)==3){I=+g[a+16>>2];E=+g[a+20>>2];M=(+g[a+52>>2]-I)*(+g[a+92>>2]-E)-(+g[a+56>>2]-E)*(+g[a+88>>2]-I)}else{M=0.0}if(!(M<J*.5)){if(!(J*2.0<M|M<1.1920928955078125e-7)){O=11;break}}c[o>>2]=0}else{O=11}}while(0);do{if((O|0)==11){if((q|0)==0){break}i=l;return}}while(0);c[a+28>>2]=0;c[a+32>>2]=0;q=c[f+16>>2]|0;M=+g[q>>2];J=+g[q+4>>2];q=c[j+16>>2]|0;I=+g[q>>2];E=+g[q+4>>2];D=+g[h+12>>2];K=+g[h+8>>2];F=+g[h>>2]+(M*D-J*K);L=D*J+M*K+ +g[h+4>>2];K=+F;M=+L;h=a;g[h>>2]=K;g[h+4>>2]=M;M=+g[k+12>>2];K=+g[k+8>>2];J=+g[k>>2]+(I*M-E*K);D=E*M+I*K+ +g[k+4>>2];K=+J;I=+D;k=a+8|0;g[k>>2]=K;g[k+4>>2]=I;I=+(J-F);F=+(D-L);k=a+16|0;g[k>>2]=I;g[k+4>>2]=F;c[o>>2]=1;i=l;return}function Zb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0;b=i;c[a>>2]=-1;d=a+12|0;c[d>>2]=16;c[a+8>>2]=0;e=Cc(576)|0;f=a+4|0;c[f>>2]=e;Oe(e|0,0,(c[d>>2]|0)*36|0)|0;e=(c[d>>2]|0)+ -1|0;g=c[f>>2]|0;if((e|0)>0){f=0;while(1){h=f+1|0;c[g+(f*36|0)+20>>2]=h;c[g+(f*36|0)+32>>2]=-1;j=(c[d>>2]|0)+ -1|0;if((h|0)<(j|0)){f=h}else{k=j;break}}}else{k=e}c[g+(k*36|0)+20>>2]=-1;c[g+(((c[d>>2]|0)+ -1|0)*36|0)+32>>2]=-1;c[a+16>>2]=0;c[a+20>>2]=0;c[a+24>>2]=0;i=b;return}function _b(a){a=a|0;var b=0;b=i;Dc(c[a+4>>2]|0);i=b;return}function $b(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;b=i;d=a+16|0;e=c[d>>2]|0;f=a+4|0;g=c[f>>2]|0;if((e|0)==-1){h=a+12|0;j=c[h>>2]|0;c[h>>2]=j<<1;k=Cc(j*72|0)|0;c[f>>2]=k;j=g;l=a+8|0;Qe(k|0,j|0,(c[l>>2]|0)*36|0)|0;Dc(j);j=c[l>>2]|0;k=(c[h>>2]|0)+ -1|0;m=c[f>>2]|0;if((j|0)<(k|0)){f=j;while(1){j=f+1|0;c[m+(f*36|0)+20>>2]=j;c[m+(f*36|0)+32>>2]=-1;n=(c[h>>2]|0)+ -1|0;if((j|0)<(n|0)){f=j}else{o=n;break}}}else{o=k}c[m+(o*36|0)+20>>2]=-1;c[m+(((c[h>>2]|0)+ -1|0)*36|0)+32>>2]=-1;h=c[l>>2]|0;c[d>>2]=h;p=l;q=m;r=h}else{p=a+8|0;q=g;r=e}e=q+(r*36|0)+20|0;c[d>>2]=c[e>>2];c[e>>2]=-1;c[q+(r*36|0)+24>>2]=-1;c[q+(r*36|0)+28>>2]=-1;c[q+(r*36|0)+32>>2]=0;c[q+(r*36|0)+16>>2]=0;c[p>>2]=(c[p>>2]|0)+1;i=b;return r|0}function ac(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0.0,k=0.0,l=0;e=i;f=$b(a)|0;h=a+4|0;j=+(+g[b>>2]+-.10000000149011612);k=+(+g[b+4>>2]+-.10000000149011612);l=(c[h>>2]|0)+(f*36|0)|0;g[l>>2]=j;g[l+4>>2]=k;k=+(+g[b+8>>2]+.10000000149011612);j=+(+g[b+12>>2]+.10000000149011612);b=(c[h>>2]|0)+(f*36|0)+8|0;g[b>>2]=k;g[b+4>>2]=j;c[(c[h>>2]|0)+(f*36|0)+16>>2]=d;c[(c[h>>2]|0)+(f*36|0)+32>>2]=0;bc(a,f);i=e;return f|0}function bc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0.0,l=0.0,m=0.0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0,H=0,I=0;d=i;e=a+24|0;c[e>>2]=(c[e>>2]|0)+1;e=a;f=c[e>>2]|0;if((f|0)==-1){c[e>>2]=b;c[(c[a+4>>2]|0)+(b*36|0)+20>>2]=-1;i=d;return}h=a+4|0;j=c[h>>2]|0;k=+g[j+(b*36|0)>>2];l=+g[j+(b*36|0)+4>>2];m=+g[j+(b*36|0)+8>>2];n=+g[j+(b*36|0)+12>>2];o=c[j+(f*36|0)+24>>2]|0;a:do{if((o|0)==-1){p=f}else{q=o;r=f;while(1){s=c[j+(r*36|0)+28>>2]|0;t=+g[j+(r*36|0)+8>>2];u=+g[j+(r*36|0)>>2];v=+g[j+(r*36|0)+12>>2];w=+g[j+(r*36|0)+4>>2];x=((t>m?t:m)-(u<k?u:k)+((v>n?v:n)-(w<l?w:l)))*2.0;y=x*2.0;z=(x-(t-u+(v-w))*2.0)*2.0;w=+g[j+(q*36|0)>>2];v=k<w?k:w;u=+g[j+(q*36|0)+4>>2];t=l<u?l:u;x=+g[j+(q*36|0)+8>>2];A=m>x?m:x;B=+g[j+(q*36|0)+12>>2];C=n>B?n:B;if((c[j+(q*36|0)+24>>2]|0)==-1){D=(A-v+(C-t))*2.0}else{D=(A-v+(C-t))*2.0-(x-w+(B-u))*2.0}u=z+D;B=+g[j+(s*36|0)>>2];w=k<B?k:B;x=+g[j+(s*36|0)+4>>2];t=l<x?l:x;C=+g[j+(s*36|0)+8>>2];v=m>C?m:C;A=+g[j+(s*36|0)+12>>2];E=n>A?n:A;if((c[j+(s*36|0)+24>>2]|0)==-1){F=(v-w+(E-t))*2.0}else{F=(v-w+(E-t))*2.0-(C-B+(A-x))*2.0}x=z+F;if(y<u&y<x){p=r;break a}G=u<x?q:s;s=c[j+(G*36|0)+24>>2]|0;if((s|0)==-1){p=G;break}else{q=s;r=G}}}}while(0);f=c[j+(p*36|0)+20>>2]|0;j=$b(a)|0;o=c[h>>2]|0;c[o+(j*36|0)+20>>2]=f;c[o+(j*36|0)+16>>2]=0;o=c[h>>2]|0;F=+g[o+(p*36|0)>>2];D=+g[o+(p*36|0)+4>>2];x=+(k<F?k:F);F=+(l<D?l:D);r=o+(j*36|0)|0;g[r>>2]=x;g[r+4>>2]=F;F=+g[o+(p*36|0)+8>>2];x=+g[o+(p*36|0)+12>>2];D=+(m>F?m:F);F=+(n>x?n:x);r=o+(j*36|0)+8|0;g[r>>2]=D;g[r+4>>2]=F;r=c[h>>2]|0;c[r+(j*36|0)+32>>2]=(c[r+(p*36|0)+32>>2]|0)+1;if((f|0)==-1){c[r+(j*36|0)+24>>2]=p;c[r+(j*36|0)+28>>2]=b;c[r+(p*36|0)+20>>2]=j;o=r+(b*36|0)+20|0;c[o>>2]=j;c[e>>2]=j;H=c[o>>2]|0}else{o=r+(f*36|0)+24|0;if((c[o>>2]|0)==(p|0)){c[o>>2]=j}else{c[r+(f*36|0)+28>>2]=j}c[r+(j*36|0)+24>>2]=p;c[r+(j*36|0)+28>>2]=b;c[r+(p*36|0)+20>>2]=j;c[r+(b*36|0)+20>>2]=j;H=j}if((H|0)==-1){i=d;return}else{I=H}do{H=ec(a,I)|0;j=c[h>>2]|0;b=c[j+(H*36|0)+24>>2]|0;r=c[j+(H*36|0)+28>>2]|0;p=c[j+(b*36|0)+32>>2]|0;f=c[j+(r*36|0)+32>>2]|0;c[j+(H*36|0)+32>>2]=((p|0)>(f|0)?p:f)+1;F=+g[j+(b*36|0)>>2];D=+g[j+(r*36|0)>>2];x=+g[j+(b*36|0)+4>>2];n=+g[j+(r*36|0)+4>>2];m=+(F<D?F:D);D=+(x<n?x:n);f=j+(H*36|0)|0;g[f>>2]=m;g[f+4>>2]=D;D=+g[j+(b*36|0)+8>>2];m=+g[j+(r*36|0)+8>>2];n=+g[j+(b*36|0)+12>>2];x=+g[j+(r*36|0)+12>>2];F=+(D>m?D:m);m=+(n>x?n:x);r=j+(H*36|0)+8|0;g[r>>2]=F;g[r+4>>2]=m;I=c[(c[h>>2]|0)+(H*36|0)+20>>2]|0;}while(!((I|0)==-1));i=d;return}function cc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0;d=i;e=a;if((c[e>>2]|0)==(b|0)){c[e>>2]=-1;i=d;return}f=a+4|0;h=c[f>>2]|0;j=c[h+(b*36|0)+20>>2]|0;k=h+(j*36|0)+20|0;l=c[k>>2]|0;m=c[h+(j*36|0)+24>>2]|0;if((m|0)==(b|0)){n=c[h+(j*36|0)+28>>2]|0}else{n=m}if((l|0)==-1){c[e>>2]=n;c[h+(n*36|0)+20>>2]=-1;e=a+16|0;c[k>>2]=c[e>>2];c[h+(j*36|0)+32>>2]=-1;c[e>>2]=j;e=a+8|0;c[e>>2]=(c[e>>2]|0)+ -1;i=d;return}e=h+(l*36|0)+24|0;if((c[e>>2]|0)==(j|0)){c[e>>2]=n}else{c[h+(l*36|0)+28>>2]=n}c[h+(n*36|0)+20>>2]=l;n=a+16|0;c[k>>2]=c[n>>2];c[h+(j*36|0)+32>>2]=-1;c[n>>2]=j;j=a+8|0;c[j>>2]=(c[j>>2]|0)+ -1;j=l;do{l=ec(a,j)|0;n=c[f>>2]|0;h=c[n+(l*36|0)+24>>2]|0;k=c[n+(l*36|0)+28>>2]|0;o=+g[n+(h*36|0)>>2];p=+g[n+(k*36|0)>>2];q=+g[n+(h*36|0)+4>>2];r=+g[n+(k*36|0)+4>>2];s=+(o<p?o:p);p=+(q<r?q:r);e=n+(l*36|0)|0;g[e>>2]=s;g[e+4>>2]=p;p=+g[n+(h*36|0)+8>>2];s=+g[n+(k*36|0)+8>>2];r=+g[n+(h*36|0)+12>>2];q=+g[n+(k*36|0)+12>>2];o=+(p>s?p:s);s=+(r>q?r:q);e=n+(l*36|0)+8|0;g[e>>2]=o;g[e+4>>2]=s;e=c[f>>2]|0;n=c[e+(h*36|0)+32>>2]|0;h=c[e+(k*36|0)+32>>2]|0;c[e+(l*36|0)+32>>2]=((n|0)>(h|0)?n:h)+1;j=c[e+(l*36|0)+20>>2]|0;}while(!((j|0)==-1));i=d;return}function dc(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0;f=i;h=a+4|0;j=c[h>>2]|0;do{if(+g[j+(b*36|0)>>2]<=+g[d>>2]){if(!(+g[j+(b*36|0)+4>>2]<=+g[d+4>>2])){break}if(!(+g[d+8>>2]<=+g[j+(b*36|0)+8>>2])){break}if(!(+g[d+12>>2]<=+g[j+(b*36|0)+12>>2])){break}else{k=0}i=f;return k|0}}while(0);cc(a,b);j=d;l=+g[j>>2];m=+g[j+4>>2];j=d+8|0;n=+g[j>>2];o=l+-.10000000149011612;l=m+-.10000000149011612;m=n+.10000000149011612;n=+g[j+4>>2]+.10000000149011612;p=+g[e>>2]*2.0;q=+g[e+4>>2]*2.0;if(p<0.0){r=o+p;s=m}else{r=o;s=p+m}if(q<0.0){t=l+q;u=n}else{t=l;u=q+n}e=c[h>>2]|0;n=+r;r=+t;h=e+(b*36|0)|0;g[h>>2]=n;g[h+4>>2]=r;r=+s;s=+u;h=e+(b*36|0)+8|0;g[h>>2]=r;g[h+4>>2]=s;bc(a,b);k=1;i=f;return k|0}function ec(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0,G=0.0,H=0,I=0,J=0,K=0;d=i;e=c[a+4>>2]|0;f=e+(b*36|0)|0;h=e+(b*36|0)+24|0;j=c[h>>2]|0;if((j|0)==-1){k=b;i=d;return k|0}l=e+(b*36|0)+32|0;if((c[l>>2]|0)<2){k=b;i=d;return k|0}m=e+(b*36|0)+28|0;n=c[m>>2]|0;o=e+(j*36|0)|0;p=e+(n*36|0)|0;q=e+(n*36|0)+32|0;r=e+(j*36|0)+32|0;s=(c[q>>2]|0)-(c[r>>2]|0)|0;if((s|0)>1){t=e+(n*36|0)+24|0;u=c[t>>2]|0;v=e+(n*36|0)+28|0;w=c[v>>2]|0;x=e+(u*36|0)|0;y=e+(w*36|0)|0;c[t>>2]=b;t=e+(b*36|0)+20|0;z=e+(n*36|0)+20|0;c[z>>2]=c[t>>2];c[t>>2]=n;t=c[z>>2]|0;do{if((t|0)==-1){c[a>>2]=n}else{z=e+(t*36|0)+24|0;if((c[z>>2]|0)==(b|0)){c[z>>2]=n;break}else{c[e+(t*36|0)+28>>2]=n;break}}}while(0);t=e+(u*36|0)+32|0;z=e+(w*36|0)+32|0;if((c[t>>2]|0)>(c[z>>2]|0)){c[v>>2]=u;c[m>>2]=w;c[e+(w*36|0)+20>>2]=b;A=+g[o>>2];B=+g[y>>2];C=A<B?A:B;B=+g[e+(j*36|0)+4>>2];A=+g[e+(w*36|0)+4>>2];D=+C;E=+(B<A?B:A);F=f;g[F>>2]=D;g[F+4>>2]=E;E=+g[e+(j*36|0)+8>>2];D=+g[e+(w*36|0)+8>>2];A=+g[e+(j*36|0)+12>>2];B=+g[e+(w*36|0)+12>>2];G=+(E>D?E:D);D=+(A>B?A:B);F=e+(b*36|0)+8|0;g[F>>2]=G;g[F+4>>2]=D;D=+g[x>>2];G=+g[e+(b*36|0)+4>>2];B=+g[e+(u*36|0)+4>>2];A=+(C<D?C:D);D=+(G<B?G:B);F=p;g[F>>2]=A;g[F+4>>2]=D;D=+g[e+(b*36|0)+8>>2];A=+g[e+(u*36|0)+8>>2];B=+g[e+(b*36|0)+12>>2];G=+g[e+(u*36|0)+12>>2];C=+(D>A?D:A);A=+(B>G?B:G);F=e+(n*36|0)+8|0;g[F>>2]=C;g[F+4>>2]=A;F=c[r>>2]|0;H=c[z>>2]|0;I=((F|0)>(H|0)?F:H)+1|0;c[l>>2]=I;H=c[t>>2]|0;J=(I|0)>(H|0)?I:H}else{c[v>>2]=w;c[m>>2]=u;c[e+(u*36|0)+20>>2]=b;A=+g[o>>2];C=+g[x>>2];G=A<C?A:C;C=+g[e+(j*36|0)+4>>2];A=+g[e+(u*36|0)+4>>2];B=+G;D=+(C<A?C:A);x=f;g[x>>2]=B;g[x+4>>2]=D;D=+g[e+(j*36|0)+8>>2];B=+g[e+(u*36|0)+8>>2];A=+g[e+(j*36|0)+12>>2];C=+g[e+(u*36|0)+12>>2];E=+(D>B?D:B);B=+(A>C?A:C);u=e+(b*36|0)+8|0;g[u>>2]=E;g[u+4>>2]=B;B=+g[y>>2];E=+g[e+(b*36|0)+4>>2];C=+g[e+(w*36|0)+4>>2];A=+(G<B?G:B);B=+(E<C?E:C);y=p;g[y>>2]=A;g[y+4>>2]=B;B=+g[e+(b*36|0)+8>>2];A=+g[e+(w*36|0)+8>>2];C=+g[e+(b*36|0)+12>>2];E=+g[e+(w*36|0)+12>>2];G=+(B>A?B:A);A=+(C>E?C:E);w=e+(n*36|0)+8|0;g[w>>2]=G;g[w+4>>2]=A;w=c[r>>2]|0;y=c[t>>2]|0;t=((w|0)>(y|0)?w:y)+1|0;c[l>>2]=t;y=c[z>>2]|0;J=(t|0)>(y|0)?t:y}c[q>>2]=J+1;k=n;i=d;return k|0}if(!((s|0)<-1)){k=b;i=d;return k|0}s=e+(j*36|0)+24|0;J=c[s>>2]|0;y=e+(j*36|0)+28|0;t=c[y>>2]|0;z=e+(J*36|0)|0;w=e+(t*36|0)|0;c[s>>2]=b;s=e+(b*36|0)+20|0;u=e+(j*36|0)+20|0;c[u>>2]=c[s>>2];c[s>>2]=j;s=c[u>>2]|0;do{if((s|0)==-1){c[a>>2]=j}else{u=e+(s*36|0)+24|0;if((c[u>>2]|0)==(b|0)){c[u>>2]=j;break}else{c[e+(s*36|0)+28>>2]=j;break}}}while(0);s=e+(J*36|0)+32|0;a=e+(t*36|0)+32|0;if((c[s>>2]|0)>(c[a>>2]|0)){c[y>>2]=J;c[h>>2]=t;c[e+(t*36|0)+20>>2]=b;A=+g[p>>2];G=+g[w>>2];E=A<G?A:G;G=+g[e+(n*36|0)+4>>2];A=+g[e+(t*36|0)+4>>2];C=+E;B=+(G<A?G:A);u=f;g[u>>2]=C;g[u+4>>2]=B;B=+g[e+(n*36|0)+8>>2];C=+g[e+(t*36|0)+8>>2];A=+g[e+(n*36|0)+12>>2];G=+g[e+(t*36|0)+12>>2];D=+(B>C?B:C);C=+(A>G?A:G);u=e+(b*36|0)+8|0;g[u>>2]=D;g[u+4>>2]=C;C=+g[z>>2];D=+g[e+(b*36|0)+4>>2];G=+g[e+(J*36|0)+4>>2];A=+(E<C?E:C);C=+(D<G?D:G);u=o;g[u>>2]=A;g[u+4>>2]=C;C=+g[e+(b*36|0)+8>>2];A=+g[e+(J*36|0)+8>>2];G=+g[e+(b*36|0)+12>>2];D=+g[e+(J*36|0)+12>>2];E=+(C>A?C:A);A=+(G>D?G:D);u=e+(j*36|0)+8|0;g[u>>2]=E;g[u+4>>2]=A;u=c[q>>2]|0;x=c[a>>2]|0;m=((u|0)>(x|0)?u:x)+1|0;c[l>>2]=m;x=c[s>>2]|0;K=(m|0)>(x|0)?m:x}else{c[y>>2]=t;c[h>>2]=J;c[e+(J*36|0)+20>>2]=b;A=+g[p>>2];E=+g[z>>2];D=A<E?A:E;E=+g[e+(n*36|0)+4>>2];A=+g[e+(J*36|0)+4>>2];G=+D;C=+(E<A?E:A);z=f;g[z>>2]=G;g[z+4>>2]=C;C=+g[e+(n*36|0)+8>>2];G=+g[e+(J*36|0)+8>>2];A=+g[e+(n*36|0)+12>>2];E=+g[e+(J*36|0)+12>>2];B=+(C>G?C:G);G=+(A>E?A:E);J=e+(b*36|0)+8|0;g[J>>2]=B;g[J+4>>2]=G;G=+g[w>>2];B=+g[e+(b*36|0)+4>>2];E=+g[e+(t*36|0)+4>>2];A=+(D<G?D:G);G=+(B<E?B:E);w=o;g[w>>2]=A;g[w+4>>2]=G;G=+g[e+(b*36|0)+8>>2];A=+g[e+(t*36|0)+8>>2];E=+g[e+(b*36|0)+12>>2];B=+g[e+(t*36|0)+12>>2];D=+(G>A?G:A);A=+(E>B?E:B);t=e+(j*36|0)+8|0;g[t>>2]=D;g[t+4>>2]=A;t=c[q>>2]|0;q=c[s>>2]|0;s=((t|0)>(q|0)?t:q)+1|0;c[l>>2]=s;l=c[a>>2]|0;K=(s|0)>(l|0)?s:l}c[r>>2]=K+1;k=j;i=d;return k|0}function fc(d,e){d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0.0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,M=0,N=0,O=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0.0,_=0.0,$=0,aa=0.0,ba=0.0,ca=0.0,da=0.0,ea=0.0,fa=0.0,ga=0.0,ha=0.0,ia=0.0,ja=0.0,ka=0.0,la=0,ma=0,na=0.0,oa=0,pa=0,qa=0.0,ra=0.0,sa=0,ta=0.0,ua=0.0,va=0.0,wa=0.0,xa=0,ya=0.0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0;f=i;i=i+336|0;h=f;j=f+40|0;k=f+80|0;l=f+96|0;m=f+192|0;n=f+216|0;o=f+320|0;p=f+328|0;c[26]=(c[26]|0)+1;q=d;c[q>>2]=0;r=e+128|0;s=d+4|0;g[s>>2]=+g[r>>2];d=e;t=e+28|0;u=h+0|0;v=e+56|0;w=u+36|0;do{c[u>>2]=c[v>>2];u=u+4|0;v=v+4|0}while((u|0)<(w|0));u=j+0|0;v=e+92|0;w=u+36|0;do{c[u>>2]=c[v>>2];u=u+4|0;v=v+4|0}while((u|0)<(w|0));v=h+24|0;x=+g[v>>2];y=+L(+(x/6.2831854820251465))*6.2831854820251465;z=x-y;g[v>>2]=z;u=h+28|0;x=+g[u>>2]-y;g[u>>2]=x;w=j+24|0;y=+g[w>>2];A=+L(+(y/6.2831854820251465))*6.2831854820251465;B=y-A;g[w>>2]=B;C=j+28|0;y=+g[C>>2]-A;g[C>>2]=y;A=+g[r>>2];D=+g[e+24>>2]+ +g[e+52>>2]+-.014999999664723873;E=D<.004999999888241291?.004999999888241291:D;b[k+4>>1]=0;r=l;F=e;c[r+0>>2]=c[F+0>>2];c[r+4>>2]=c[F+4>>2];c[r+8>>2]=c[F+8>>2];c[r+12>>2]=c[F+12>>2];c[r+16>>2]=c[F+16>>2];c[r+20>>2]=c[F+20>>2];c[r+24>>2]=c[F+24>>2];F=l+28|0;r=t;c[F+0>>2]=c[r+0>>2];c[F+4>>2]=c[r+4>>2];c[F+8>>2]=c[r+8>>2];c[F+12>>2]=c[r+12>>2];c[F+16>>2]=c[r+16>>2];c[F+20>>2]=c[r+20>>2];c[F+24>>2]=c[r+24>>2];a[l+88|0]=0;r=h+8|0;F=h+12|0;e=h+16|0;G=h+20|0;H=h;I=h+4|0;J=j+8|0;K=j+12|0;M=j+16|0;N=j+20|0;O=j;R=j+4|0;S=l+56|0;T=l+64|0;U=l+68|0;V=l+72|0;W=l+80|0;X=l+84|0;Y=m+16|0;D=E+.0012499999720603228;Z=E+-.0012499999720603228;_=y;y=B;B=x;x=z;$=0;z=0.0;a:while(1){aa=1.0-z;ba=aa*x+z*B;ca=+Q(+ba);da=+P(+ba);ba=+g[H>>2];ea=+g[I>>2];fa=aa*y+z*_;ga=+Q(+fa);ha=+P(+fa);fa=+g[O>>2];ia=+g[R>>2];ja=aa*+g[J>>2]+z*+g[M>>2]-(ha*fa-ga*ia);ka=aa*+g[K>>2]+z*+g[N>>2]-(ga*fa+ha*ia);ia=+(aa*+g[r>>2]+z*+g[e>>2]-(da*ba-ca*ea));fa=+(aa*+g[F>>2]+z*+g[G>>2]-(ca*ba+da*ea));la=S;g[la>>2]=ia;g[la+4>>2]=fa;g[T>>2]=ca;g[U>>2]=da;da=+ja;ja=+ka;la=V;g[la>>2]=da;g[la+4>>2]=ja;g[W>>2]=ga;g[X>>2]=ha;Xb(m,k,l);ha=+g[Y>>2];if(ha<=0.0){ma=3;break}if(ha<D){ma=5;break}+gc(n,k,d,h,t,j,z);la=0;ha=A;while(1){ga=+hc(n,o,p,ha);if(ga>D){ma=8;break a}if(ga>Z){na=ha;break}oa=c[o>>2]|0;pa=c[p>>2]|0;ja=+ic(n,oa,pa,z);if(ja<Z){ma=11;break a}if(!(ja<=D)){qa=z;ra=ha;sa=0;ta=ja;ua=ga}else{ma=13;break a}while(1){if((sa&1|0)==0){va=(qa+ra)*.5}else{va=qa+(E-ta)*(ra-qa)/(ua-ta)}ga=+ic(n,oa,pa,va);ja=ga-E;if(ja>0.0){wa=ja}else{wa=-ja}if(wa<.0012499999720603228){xa=sa;ya=va;break}za=ga>E;Aa=sa+1|0;c[32]=(c[32]|0)+1;if((Aa|0)==50){xa=50;ya=ha;break}else{qa=za?va:qa;ra=za?ra:va;sa=Aa;ta=za?ga:ta;ua=za?ua:ga}}pa=c[34]|0;c[34]=(pa|0)>(xa|0)?pa:xa;pa=la+1|0;if((pa|0)==8){na=z;break}else{la=pa;ha=ya}}la=$+1|0;c[28]=(c[28]|0)+1;if((la|0)==20){ma=25;break}_=+g[C>>2];y=+g[w>>2];B=+g[u>>2];x=+g[v>>2];$=la;z=na}if((ma|0)==3){c[q>>2]=2;g[s>>2]=0.0;Ba=$;Ca=c[30]|0;Da=(Ca|0)>(Ba|0);Ea=Da?Ca:Ba;c[30]=Ea;i=f;return}else if((ma|0)==5){c[q>>2]=3;g[s>>2]=z;Ba=$;Ca=c[30]|0;Da=(Ca|0)>(Ba|0);Ea=Da?Ca:Ba;c[30]=Ea;i=f;return}else if((ma|0)==8){c[q>>2]=4;g[s>>2]=A}else if((ma|0)==11){c[q>>2]=1;g[s>>2]=z}else if((ma|0)==13){c[q>>2]=3;g[s>>2]=z}else if((ma|0)==25){c[q>>2]=1;g[s>>2]=na;Ba=20;Ca=c[30]|0;Da=(Ca|0)>(Ba|0);Ea=Da?Ca:Ba;c[30]=Ea;i=f;return}c[28]=(c[28]|0)+1;Ba=$+1|0;Ca=c[30]|0;Da=(Ca|0)>(Ba|0);Ea=Da?Ca:Ba;c[30]=Ea;i=f;return}function gc(e,f,h,j,k,l,m){e=e|0;f=f|0;h=h|0;j=j|0;k=k|0;l=l|0;m=+m;var n=0,o=0,p=0,q=0,r=0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,O=0.0;n=i;c[e>>2]=h;c[e+4>>2]=k;o=b[f+4>>1]|0;p=e+8|0;q=p+0|0;r=j+0|0;j=q+36|0;do{c[q>>2]=c[r>>2];q=q+4|0;r=r+4|0}while((q|0)<(j|0));s=e+44|0;q=s+0|0;r=l+0|0;j=q+36|0;do{c[q>>2]=c[r>>2];q=q+4|0;r=r+4|0}while((q|0)<(j|0));t=1.0-m;u=t*+g[e+32>>2]+ +g[e+36>>2]*m;v=+Q(+u);w=+P(+u);u=+g[p>>2];x=+g[e+12>>2];y=t*+g[e+16>>2]+ +g[e+24>>2]*m-(w*u-v*x);z=t*+g[e+20>>2]+ +g[e+28>>2]*m-(v*u+w*x);x=t*+g[e+68>>2]+ +g[e+72>>2]*m;u=+Q(+x);A=+P(+x);x=+g[s>>2];B=+g[e+48>>2];C=t*+g[e+52>>2]+ +g[e+60>>2]*m-(A*x-u*B);D=t*+g[e+56>>2]+ +g[e+64>>2]*m-(u*x+A*B);if(o<<16>>16==1){c[e+80>>2]=0;o=(c[h+16>>2]|0)+(d[f+6|0]<<3)|0;B=+g[o>>2];x=+g[o+4>>2];o=(c[k+16>>2]|0)+(d[f+9|0]<<3)|0;m=+g[o>>2];t=+g[o+4>>2];o=e+92|0;E=C+(A*m-u*t)-(y+(w*B-v*x));F=D+(u*m+A*t)-(z+(v*B+w*x));x=+E;B=+F;s=o;g[s>>2]=x;g[s+4>>2]=B;B=+N(+(E*E+F*F));if(B<1.1920928955078125e-7){G=0.0;i=n;return+G}x=1.0/B;g[o>>2]=E*x;g[e+96>>2]=F*x;G=B;i=n;return+G}o=f+6|0;s=f+7|0;p=e+80|0;if((a[o]|0)==(a[s]|0)){c[p>>2]=2;r=c[k+16>>2]|0;q=r+(d[f+9|0]<<3)|0;B=+g[q>>2];x=+g[q+4>>2];q=r+(d[f+10|0]<<3)|0;F=+g[q>>2];E=+g[q+4>>2];q=e+92|0;t=F-B;m=E-x;H=-t;r=q;I=+m;J=+H;j=r;g[j>>2]=I;g[j+4>>2]=J;J=+N(+(m*m+t*t));if(J<1.1920928955078125e-7){K=H;L=m}else{t=1.0/J;J=m*t;g[q>>2]=J;m=t*H;g[e+96>>2]=m;K=m;L=J}J=(B+F)*.5;F=(x+E)*.5;E=+J;x=+F;q=e+84|0;g[q>>2]=E;g[q+4>>2]=x;q=(c[h+16>>2]|0)+(d[o]<<3)|0;x=+g[q>>2];E=+g[q+4>>2];B=(A*L-u*K)*(y+(w*x-v*E)-(C+(A*J-u*F)))+(u*L+A*K)*(z+(v*x+w*E)-(D+(u*J+A*F)));if(!(B<0.0)){G=B;i=n;return+G}F=+-L;L=+-K;q=r;g[q>>2]=F;g[q+4>>2]=L;G=-B;i=n;return+G}else{c[p>>2]=1;p=c[h+16>>2]|0;h=p+(d[o]<<3)|0;B=+g[h>>2];L=+g[h+4>>2];h=p+(d[s]<<3)|0;F=+g[h>>2];K=+g[h+4>>2];h=e+92|0;J=F-B;E=K-L;x=-J;s=h;m=+E;H=+x;p=s;g[p>>2]=m;g[p+4>>2]=H;H=+N(+(E*E+J*J));if(H<1.1920928955078125e-7){M=x;O=E}else{J=1.0/H;H=E*J;g[h>>2]=H;E=J*x;g[e+96>>2]=E;M=E;O=H}H=(B+F)*.5;F=(L+K)*.5;K=+H;L=+F;h=e+84|0;g[h>>2]=K;g[h+4>>2]=L;h=(c[k+16>>2]|0)+(d[f+9|0]<<3)|0;L=+g[h>>2];K=+g[h+4>>2];B=(w*O-v*M)*(C+(A*L-u*K)-(y+(w*H-v*F)))+(v*O+w*M)*(D+(u*L+A*K)-(z+(v*H+w*F)));if(!(B<0.0)){G=B;i=n;return+G}F=+-O;O=+-M;h=s;g[h>>2]=F;g[h+4>>2]=O;G=-B;i=n;return+G}return 0.0}function hc(a,b,d,e){a=a|0;b=b|0;d=d|0;e=+e;var f=0,h=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0,u=0.0,v=0.0,w=0.0,x=0.0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0.0,I=0,J=0;f=i;h=1.0-e;j=h*+g[a+32>>2]+ +g[a+36>>2]*e;k=+Q(+j);l=+P(+j);j=+g[a+8>>2];m=+g[a+12>>2];n=h*+g[a+16>>2]+ +g[a+24>>2]*e-(l*j-k*m);o=h*+g[a+20>>2]+ +g[a+28>>2]*e-(k*j+l*m);m=h*+g[a+68>>2]+ +g[a+72>>2]*e;j=+Q(+m);p=+P(+m);m=+g[a+44>>2];q=+g[a+48>>2];r=h*+g[a+52>>2]+ +g[a+60>>2]*e-(p*m-j*q);s=h*+g[a+56>>2]+ +g[a+64>>2]*e-(j*m+p*q);t=c[a+80>>2]|0;if((t|0)==0){q=+g[a+92>>2];m=+g[a+96>>2];e=l*q+k*m;h=l*m-k*q;u=-q;v=-m;w=p*u+j*v;x=p*v-j*u;y=c[a>>2]|0;z=c[y+16>>2]|0;A=c[y+20>>2]|0;if((A|0)>1){y=0;u=h*+g[z+4>>2]+e*+g[z>>2];B=1;while(1){v=e*+g[z+(B<<3)>>2]+h*+g[z+(B<<3)+4>>2];C=v>u;D=C?B:y;E=B+1|0;if((E|0)==(A|0)){F=D;break}else{B=E;u=C?v:u;y=D}}}else{F=0}c[b>>2]=F;F=c[a+4>>2]|0;y=c[F+16>>2]|0;B=c[F+20>>2]|0;if((B|0)>1){F=0;u=x*+g[y+4>>2]+w*+g[y>>2];A=1;while(1){h=w*+g[y+(A<<3)>>2]+x*+g[y+(A<<3)+4>>2];D=h>u;C=D?A:F;E=A+1|0;if((E|0)==(B|0)){G=C;break}else{A=E;u=D?h:u;F=C}}}else{G=0}c[d>>2]=G;F=z+(c[b>>2]<<3)|0;u=+g[F>>2];x=+g[F+4>>2];F=y+(G<<3)|0;w=+g[F>>2];h=+g[F+4>>2];H=q*(r+(p*w-j*h)-(n+(l*u-k*x)))+m*(s+(j*w+p*h)-(o+(k*u+l*x)));i=f;return+H}else if((t|0)==1){x=+g[a+92>>2];u=+g[a+96>>2];h=l*x-k*u;w=k*x+l*u;u=+g[a+84>>2];x=+g[a+88>>2];m=n+(l*u-k*x);q=o+(k*u+l*x);x=-h;u=-w;e=p*x+j*u;v=p*u-j*x;c[b>>2]=-1;F=c[a+4>>2]|0;G=c[F+16>>2]|0;y=c[F+20>>2]|0;if((y|0)>1){F=0;x=v*+g[G+4>>2]+e*+g[G>>2];z=1;while(1){u=e*+g[G+(z<<3)>>2]+v*+g[G+(z<<3)+4>>2];A=u>x;B=A?z:F;C=z+1|0;if((C|0)==(y|0)){I=B;break}else{z=C;x=A?u:x;F=B}}}else{I=0}c[d>>2]=I;F=G+(I<<3)|0;x=+g[F>>2];v=+g[F+4>>2];H=h*(r+(p*x-j*v)-m)+w*(s+(j*x+p*v)-q);i=f;return+H}else if((t|0)==2){q=+g[a+92>>2];v=+g[a+96>>2];x=p*q-j*v;w=j*q+p*v;v=+g[a+84>>2];q=+g[a+88>>2];m=r+(p*v-j*q);r=s+(j*v+p*q);q=-x;p=-w;v=l*q+k*p;j=l*p-k*q;c[d>>2]=-1;t=c[a>>2]|0;a=c[t+16>>2]|0;F=c[t+20>>2]|0;if((F|0)>1){t=0;q=j*+g[a+4>>2]+v*+g[a>>2];I=1;while(1){p=v*+g[a+(I<<3)>>2]+j*+g[a+(I<<3)+4>>2];G=p>q;z=G?I:t;y=I+1|0;if((y|0)==(F|0)){J=z;break}else{I=y;q=G?p:q;t=z}}}else{J=0}c[b>>2]=J;t=a+(J<<3)|0;q=+g[t>>2];j=+g[t+4>>2];H=x*(n+(l*q-k*j)-m)+w*(o+(k*q+l*j)-r);i=f;return+H}else{c[b>>2]=-1;c[d>>2]=-1;H=0.0;i=f;return+H}return 0.0}function ic(a,b,d,e){a=a|0;b=b|0;d=d|0;e=+e;var f=0,h=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0,u=0,v=0.0,w=0.0,x=0.0;f=i;h=1.0-e;j=h*+g[a+32>>2]+ +g[a+36>>2]*e;k=+Q(+j);l=+P(+j);j=+g[a+8>>2];m=+g[a+12>>2];n=h*+g[a+16>>2]+ +g[a+24>>2]*e-(l*j-k*m);o=h*+g[a+20>>2]+ +g[a+28>>2]*e-(k*j+l*m);m=h*+g[a+68>>2]+ +g[a+72>>2]*e;j=+Q(+m);p=+P(+m);m=+g[a+44>>2];q=+g[a+48>>2];r=h*+g[a+52>>2]+ +g[a+60>>2]*e-(p*m-j*q);s=h*+g[a+56>>2]+ +g[a+64>>2]*e-(j*m+p*q);t=c[a+80>>2]|0;if((t|0)==1){q=+g[a+92>>2];m=+g[a+96>>2];e=+g[a+84>>2];h=+g[a+88>>2];u=(c[(c[a+4>>2]|0)+16>>2]|0)+(d<<3)|0;v=+g[u>>2];w=+g[u+4>>2];x=(l*q-k*m)*(r+(p*v-j*w)-(n+(l*e-k*h)))+(k*q+l*m)*(s+(j*v+p*w)-(o+(k*e+l*h)));i=f;return+x}else if((t|0)==2){h=+g[a+92>>2];e=+g[a+96>>2];w=+g[a+84>>2];v=+g[a+88>>2];u=(c[(c[a>>2]|0)+16>>2]|0)+(b<<3)|0;m=+g[u>>2];q=+g[u+4>>2];x=(p*h-j*e)*(n+(l*m-k*q)-(r+(p*w-j*v)))+(j*h+p*e)*(o+(k*m+l*q)-(s+(j*w+p*v)));i=f;return+x}else if((t|0)==0){t=(c[(c[a>>2]|0)+16>>2]|0)+(b<<3)|0;v=+g[t>>2];w=+g[t+4>>2];t=(c[(c[a+4>>2]|0)+16>>2]|0)+(d<<3)|0;q=+g[t>>2];m=+g[t+4>>2];x=+g[a+92>>2]*(r+(p*q-j*m)-(n+(l*v-k*w)))+ +g[a+96>>2]*(s+(j*q+p*m)-(o+(k*v+l*w)));i=f;return+x}else{x=0.0;i=f;return+x}return 0.0}function jc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0;f=i;c[d+4>>2]=1;g[d+8>>2]=+g[b+8>>2];h=b+12|0;j=(c[h>>2]|0)+(e<<3)|0;k=c[j+4>>2]|0;l=d+12|0;c[l>>2]=c[j>>2];c[l+4>>2]=k;k=(c[h>>2]|0)+(e+1<<3)|0;l=c[k+4>>2]|0;j=d+20|0;c[j>>2]=c[k>>2];c[j+4>>2]=l;l=d+28|0;if((e|0)>0){j=(c[h>>2]|0)+(e+ -1<<3)|0;k=c[j+4>>2]|0;m=l;c[m>>2]=c[j>>2];c[m+4>>2]=k;a[d+44|0]=1}else{k=b+20|0;m=c[k+4>>2]|0;j=l;c[j>>2]=c[k>>2];c[j+4>>2]=m;a[d+44|0]=a[b+36|0]|0}m=d+36|0;if(((c[b+16>>2]|0)+ -2|0)>(e|0)){j=(c[h>>2]|0)+(e+2<<3)|0;e=c[j+4>>2]|0;h=m;c[h>>2]=c[j>>2];c[h+4>>2]=e;a[d+45|0]=1;i=f;return}else{e=b+28|0;h=c[e+4>>2]|0;j=m;c[j>>2]=c[e>>2];c[j+4>>2]=h;a[d+45|0]=a[b+37|0]|0;i=f;return}}function kc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0;f=d;d=c[f+4>>2]|0;g=b+12|0;c[g>>2]=c[f>>2];c[g+4>>2]=d;d=e;e=c[d+4>>2]|0;g=b+20|0;c[g>>2]=c[d>>2];c[g+4>>2]=e;a[b+44|0]=0;a[b+45|0]=0;i=i;return}function lc(a,d){a=a|0;d=d|0;var e=0,f=0,h=0,j=0;e=i;f=Ac(d,48)|0;if((f|0)==0){h=0}else{d=f;c[f>>2]=176;c[f+4>>2]=1;g[f+8>>2]=.009999999776482582;j=f+28|0;c[j+0>>2]=0;c[j+4>>2]=0;c[j+8>>2]=0;c[j+12>>2]=0;b[j+16>>1]=0;h=d}d=a+4|0;j=c[d+4>>2]|0;f=h+4|0;c[f>>2]=c[d>>2];c[f+4>>2]=j;j=h+12|0;f=a+12|0;c[j+0>>2]=c[f+0>>2];c[j+4>>2]=c[f+4>>2];c[j+8>>2]=c[f+8>>2];c[j+12>>2]=c[f+12>>2];c[j+16>>2]=c[f+16>>2];c[j+20>>2]=c[f+20>>2];c[j+24>>2]=c[f+24>>2];c[j+28>>2]=c[f+28>>2];b[j+32>>1]=b[f+32>>1]|0;i=e;return h|0}function mc(a){a=a|0;i=i;return 1}function nc(a,b,c){a=a|0;b=b|0;c=c|0;i=i;return 0}function oc(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0.0,h=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0;e=i;f=+g[d>>2];h=+g[c>>2]-f;j=+g[d+4>>2];k=+g[c+4>>2]-j;l=+g[d+12>>2];m=+g[d+8>>2];n=h*l+k*m;o=l*k-h*m;h=+g[c+8>>2]-f;f=+g[c+12>>2]-j;j=l*h+m*f-n;k=l*f-m*h-o;d=a+12|0;h=+g[d>>2];m=+g[d+4>>2];d=a+20|0;f=+g[d>>2];l=f-h;f=+g[d+4>>2]-m;p=-l;q=l*l+f*f;r=+N(+q);if(r<1.1920928955078125e-7){s=p;t=f}else{u=1.0/r;s=u*p;t=f*u}u=(m-o)*s+(h-n)*t;p=k*s+j*t;if(p==0.0){v=0;i=e;return v|0}r=u/p;if(r<0.0){v=0;i=e;return v|0}if(+g[c+16>>2]<r|q==0.0){v=0;i=e;return v|0}p=(l*(n+j*r-h)+f*(o+k*r-m))/q;if(p<0.0|p>1.0){v=0;i=e;return v|0}g[b+8>>2]=r;if(u>0.0){u=+-t;r=+-s;c=b;g[c>>2]=u;g[c+4>>2]=r;v=1;i=e;return v|0}else{r=+t;t=+s;c=b;g[c>>2]=r;g[c+4>>2]=t;v=1;i=e;return v|0}return 0}function pc(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0.0,f=0.0,h=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0;d=i;e=+g[c+12>>2];f=+g[a+12>>2];h=+g[c+8>>2];j=+g[a+16>>2];k=+g[c>>2];l=k+(e*f-h*j);m=+g[c+4>>2];n=f*h+e*j+m;j=+g[a+20>>2];f=+g[a+24>>2];o=k+(e*j-h*f);k=m+(h*j+e*f);f=+g[a+8>>2];e=+((l<o?l:o)-f);j=+((n<k?n:k)-f);a=b;g[a>>2]=e;g[a+4>>2]=j;j=+(f+(l>o?l:o));o=+(f+(n>k?n:k));a=b+8|0;g[a>>2]=j;g[a+4>>2]=o;i=d;return}function qc(a,b,c){a=a|0;b=b|0;c=+c;var d=0,e=0.0;d=i;g[b>>2]=0.0;c=+((+g[a+12>>2]+ +g[a+20>>2])*.5);e=+((+g[a+16>>2]+ +g[a+24>>2])*.5);a=b+4|0;g[a>>2]=c;g[a+4>>2]=e;g[b+12>>2]=0.0;i=d;return}function rc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0;d=i;e=Ac(b,152)|0;if((e|0)==0){f=0}else{c[e>>2]=248;c[e+4>>2]=2;g[e+8>>2]=.009999999776482582;c[e+148>>2]=0;g[e+12>>2]=0.0;g[e+16>>2]=0.0;f=e}e=a+4|0;b=c[e+4>>2]|0;h=f+4|0;c[h>>2]=c[e>>2];c[h+4>>2]=b;Qe(f+12|0,a+12|0,140)|0;i=d;return f|0}function sc(a,b,d){a=a|0;b=+b;d=+d;var e=0.0,f=0.0;c[a+148>>2]=4;e=-b;f=-d;g[a+20>>2]=e;g[a+24>>2]=f;g[a+28>>2]=b;g[a+32>>2]=f;g[a+36>>2]=b;g[a+40>>2]=d;g[a+44>>2]=e;g[a+48>>2]=d;g[a+84>>2]=0.0;g[a+88>>2]=-1.0;g[a+92>>2]=1.0;g[a+96>>2]=0.0;g[a+100>>2]=0.0;g[a+104>>2]=1.0;g[a+108>>2]=-1.0;g[a+112>>2]=0.0;g[a+12>>2]=0.0;g[a+16>>2]=0.0;i=i;return}function tc(a){a=a|0;i=i;return 1}function uc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0.0,h=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0,o=0,p=0;e=i;f=+g[d>>2]- +g[b>>2];h=+g[d+4>>2]- +g[b+4>>2];j=+g[b+12>>2];k=+g[b+8>>2];l=f*j+h*k;m=j*h-f*k;b=c[a+148>>2]|0;if((b|0)>0){n=0}else{o=1;i=e;return o|0}while(1){d=n+1|0;if((l- +g[a+(n<<3)+20>>2])*+g[a+(n<<3)+84>>2]+(m- +g[a+(n<<3)+24>>2])*+g[a+(n<<3)+88>>2]>0.0){o=0;p=4;break}if((d|0)<(b|0)){n=d}else{o=1;p=4;break}}if((p|0)==4){i=e;return o|0}return 0}function vc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0.0,j=0.0,k=0.0,l=0.0,m=0,n=0.0,o=0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0,v=0.0,w=0.0,x=0,y=0,z=0.0,A=0.0;f=i;h=+g[e>>2];j=+g[d>>2]-h;k=+g[e+4>>2];l=+g[d+4>>2]-k;m=e+12|0;n=+g[m>>2];o=e+8|0;p=+g[o>>2];q=j*n+l*p;r=n*l-j*p;j=+g[d+8>>2]-h;h=+g[d+12>>2]-k;k=n*j+p*h-q;l=n*h-p*j-r;e=c[a+148>>2]|0;if((e|0)<=0){s=0;i=f;return s|0}t=0;u=-1;j=0.0;p=+g[d+16>>2];a:while(1){h=+g[a+(t<<3)+84>>2];n=+g[a+(t<<3)+88>>2];v=(+g[a+(t<<3)+20>>2]-q)*h+(+g[a+(t<<3)+24>>2]-r)*n;w=k*h+l*n;b:do{if(w==0.0){if(v<0.0){s=0;x=15;break a}else{y=u;z=j;A=p}}else{do{if(w<0.0){if(!(v<j*w)){break}y=t;z=v/w;A=p;break b}}while(0);if(!(w>0.0)){y=u;z=j;A=p;break}if(!(v<p*w)){y=u;z=j;A=p;break}y=u;z=j;A=v/w}}while(0);d=t+1|0;if(A<z){s=0;x=15;break}if((d|0)<(e|0)){t=d;u=y;j=z;p=A}else{x=13;break}}if((x|0)==13){if(!((y|0)>-1)){s=0;i=f;return s|0}g[b+8>>2]=z;z=+g[m>>2];A=+g[a+(y<<3)+84>>2];p=+g[o>>2];j=+g[a+(y<<3)+88>>2];l=+(z*A-p*j);k=+(A*p+z*j);y=b;g[y>>2]=l;g[y+4>>2]=k;s=1;i=f;return s|0}else if((x|0)==15){i=f;return s|0}return 0}function wc(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0.0,h=0.0,j=0.0,k=0.0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0.0,t=0.0,u=0.0,v=0.0,w=0.0,x=0,y=0.0,z=0.0,A=0.0,B=0.0;e=i;f=+g[d+12>>2];h=+g[a+20>>2];j=+g[d+8>>2];k=+g[a+24>>2];l=+g[d>>2];m=l+(f*h-j*k);n=+g[d+4>>2];o=h*j+f*k+n;d=c[a+148>>2]|0;if((d|0)>1){k=m;h=o;p=m;q=o;r=1;while(1){s=+g[a+(r<<3)+20>>2];t=+g[a+(r<<3)+24>>2];u=l+(f*s-j*t);v=s*j+f*t+n;t=p<u?p:u;s=q<v?q:v;w=k>u?k:u;u=h>v?h:v;x=r+1|0;if((x|0)<(d|0)){r=x;q=s;p=t;h=u;k=w}else{y=s;z=t;A=u;B=w;break}}}else{y=o;z=m;A=o;B=m}m=+g[a+8>>2];o=+(z-m);z=+(y-m);a=b;g[a>>2]=o;g[a+4>>2]=z;z=+(B+m);B=+(A+m);a=b+8|0;g[a>>2]=z;g[a+4>>2]=B;i=e;return}function xc(a,b,d){a=a|0;b=b|0;d=+d;var e=0,f=0,h=0,j=0.0,k=0.0,l=0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0,w=0.0,x=0.0,y=0.0,z=0,A=0.0,B=0.0,C=0,D=0,E=0,F=0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0;e=i;f=c[a+148>>2]|0;h=(f|0)>0;do{if(h){j=0.0;k=0.0;l=0;do{j=j+ +g[a+(l<<3)+20>>2];k=k+ +g[a+(l<<3)+24>>2];l=l+1|0;}while((l|0)<(f|0));m=1.0/+(f|0);n=j*m;o=k*m;if(!h){p=0.0;q=0.0;r=o;s=n;t=0.0;u=0.0;break}l=a+20|0;v=a+24|0;m=0.0;w=0.0;x=0.0;y=0.0;z=0;while(1){A=+g[a+(z<<3)+20>>2]-n;B=+g[a+(z<<3)+24>>2]-o;C=z+1|0;D=(C|0)<(f|0);if(D){E=a+(C<<3)+20|0;F=a+(C<<3)+24|0}else{E=l;F=v}G=+g[E>>2]-n;H=+g[F>>2]-o;I=A*H-B*G;J=I*.5;K=y+J;L=J*.3333333432674408;J=m+(A+G)*L;M=w+(B+H)*L;L=x+I*.0833333358168602*(G*G+(A*A+A*G)+(H*H+(B*B+B*H)));if(D){m=J;w=M;x=L;y=K;z=C}else{p=M;q=J;r=o;s=n;t=L;u=K;break}}}else{n=1.0/+(f|0);p=0.0;q=0.0;r=n*0.0;s=n*0.0;t=0.0;u=0.0}}while(0);n=u*d;g[b>>2]=n;o=1.0/u;u=q*o;q=p*o;o=s+u;s=r+q;r=+o;p=+s;f=b+4|0;g[f>>2]=r;g[f+4>>2]=p;g[b+12>>2]=t*d+n*(o*o+s*s-(u*u+q*q));i=e;return}function yc(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;e=b+8|0;c[e>>2]=128;c[b+4>>2]=0;f=Cc(1024)|0;c[b>>2]=f;Oe(f|0,0,c[e>>2]<<3|0)|0;e=b+12|0;b=e+56|0;do{c[e>>2]=0;e=e+4|0}while((e|0)<(b|0));if((a[1024]|0)==0){g=1;h=0}else{i=d;return}while(1){if((g|0)>(c[320+(h<<2)>>2]|0)){e=h+1|0;a[376+g|0]=e;j=e}else{a[376+g|0]=h;j=h}e=g+1|0;if((e|0)==641){break}else{g=e;h=j}}a[1024]=1;i=d;return}function zc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0;b=i;d=a+4|0;e=a;a=c[e>>2]|0;if((c[d>>2]|0)>0){f=a;g=0}else{h=a;j=h;Dc(j);i=b;return}while(1){Dc(c[f+(g<<3)+4>>2]|0);a=g+1|0;k=c[e>>2]|0;if((a|0)<(c[d>>2]|0)){g=a;f=k}else{h=k;break}}j=h;Dc(j);i=b;return}function Ac(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;e=i;if((b|0)==0){f=0;i=e;return f|0}if((b|0)>640){f=Cc(b)|0;i=e;return f|0}g=d[376+b|0]|0;b=a+(g<<2)+12|0;h=c[b>>2]|0;if((h|0)!=0){c[b>>2]=c[h>>2];f=h;i=e;return f|0}h=a+4|0;j=c[h>>2]|0;k=a+8|0;l=a;if((j|0)==(c[k>>2]|0)){a=c[l>>2]|0;m=j+128|0;c[k>>2]=m;k=Cc(m<<3)|0;c[l>>2]=k;m=a;Qe(k|0,m|0,c[h>>2]<<3|0)|0;Oe((c[l>>2]|0)+(c[h>>2]<<3)|0,0,1024)|0;Dc(m);n=c[h>>2]|0}else{n=j}j=c[l>>2]|0;l=Cc(16384)|0;m=j+(n<<3)+4|0;c[m>>2]=l;k=c[320+(g<<2)>>2]|0;c[j+(n<<3)>>2]=k;n=(16384/(k|0)|0)+ -1|0;if((n|0)>0){j=l;g=0;while(1){a=g+1|0;c[j+(Z(g,k)|0)>>2]=j+(Z(a,k)|0);o=c[m>>2]|0;if((a|0)==(n|0)){p=o;break}else{g=a;j=o}}}else{p=l}c[p+(Z(n,k)|0)>>2]=0;c[b>>2]=c[c[m>>2]>>2];c[h>>2]=(c[h>>2]|0)+1;f=c[m>>2]|0;i=e;return f|0}function Bc(a,b,e){a=a|0;b=b|0;e=e|0;var f=0,g=0;f=i;if((e|0)==0){i=f;return}if((e|0)>640){Dc(b);i=f;return}else{g=a+((d[376+e|0]|0)<<2)+12|0;c[b>>2]=c[g>>2];c[g>>2]=b;i=f;return}}function Cc(a){a=a|0;var b=0,c=0;b=i;c=Ke(a)|0;i=b;return c|0}function Dc(a){a=a|0;var b=0;b=i;Le(a);i=b;return}function Ec(a){a=a|0;c[a+102400>>2]=0;c[a+102404>>2]=0;c[a+102408>>2]=0;c[a+102796>>2]=0;i=i;return}function Fc(a){a=a|0;i=i;return}function Gc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;f=b+102796|0;g=c[f>>2]|0;h=b+(g*12|0)+102412|0;c[b+(g*12|0)+102416>>2]=d;j=b+102400|0;k=c[j>>2]|0;if((k+d|0)>102400){c[h>>2]=Cc(d)|0;a[b+(g*12|0)+102420|0]=1}else{c[h>>2]=b+k;a[b+(g*12|0)+102420|0]=0;c[j>>2]=(c[j>>2]|0)+d}j=b+102404|0;g=(c[j>>2]|0)+d|0;c[j>>2]=g;j=b+102408|0;b=c[j>>2]|0;c[j>>2]=(b|0)>(g|0)?b:g;c[f>>2]=(c[f>>2]|0)+1;i=e;return c[h>>2]|0}function Hc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;f=b+102796|0;g=c[f>>2]|0;h=g+ -1|0;if((a[b+(h*12|0)+102420|0]|0)==0){j=b+(h*12|0)+102416|0;k=b+102400|0;c[k>>2]=(c[k>>2]|0)-(c[j>>2]|0);l=j;m=g}else{Dc(d);l=b+(h*12|0)+102416|0;m=c[f>>2]|0}h=b+102404|0;c[h>>2]=(c[h>>2]|0)-(c[l>>2]|0);c[f>>2]=m+ -1;i=e;return}function Ic(a){a=a|0;i=i;return}function Jc(a){a=a|0;i=i;return}function Kc(a){a=a|0;i=i;return 0.0}function Lc(d,e,f){d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;h=i;j=d+4|0;k=(a[e+39|0]|0)==0?0:8;b[j>>1]=k;if((a[e+38|0]|0)==0){l=k}else{m=(k&65535|16)&65535;b[j>>1]=m;l=m}if((a[e+36|0]|0)==0){n=l}else{m=(l&65535|4)&65535;b[j>>1]=m;n=m}if((a[e+37|0]|0)==0){o=n}else{m=(n&65535|2)&65535;b[j>>1]=m;o=m}if((a[e+40|0]|0)!=0){b[j>>1]=o&65535|32}c[d+88>>2]=f;f=e+4|0;o=c[f>>2]|0;j=c[f+4>>2]|0;f=d+12|0;c[f>>2]=o;c[f+4>>2]=j;f=e+12|0;p=+g[f>>2];g[d+20>>2]=+Q(+p);g[d+24>>2]=+P(+p);g[d+28>>2]=0.0;g[d+32>>2]=0.0;m=d+36|0;c[m>>2]=o;c[m+4>>2]=j;m=d+44|0;c[m>>2]=o;c[m+4>>2]=j;g[d+52>>2]=+g[f>>2];g[d+56>>2]=+g[f>>2];g[d+60>>2]=0.0;c[d+108>>2]=0;c[d+112>>2]=0;c[d+92>>2]=0;c[d+96>>2]=0;f=e+16|0;j=c[f+4>>2]|0;m=d+64|0;c[m>>2]=c[f>>2];c[m+4>>2]=j;g[d+72>>2]=+g[e+24>>2];g[d+132>>2]=+g[e+28>>2];g[d+136>>2]=+g[e+32>>2];g[d+140>>2]=+g[e+48>>2];g[d+76>>2]=0.0;g[d+80>>2]=0.0;g[d+84>>2]=0.0;g[d+144>>2]=0.0;j=c[e>>2]|0;c[d>>2]=j;m=d+116|0;if((j|0)==2){g[m>>2]=1.0;g[d+120>>2]=1.0;q=d+124|0;g[q>>2]=0.0;r=d+128|0;g[r>>2]=0.0;s=e+44|0;t=c[s>>2]|0;u=d+148|0;c[u>>2]=t;v=d+100|0;c[v>>2]=0;w=d+104|0;c[w>>2]=0;i=h;return}else{g[m>>2]=0.0;g[d+120>>2]=0.0;q=d+124|0;g[q>>2]=0.0;r=d+128|0;g[r>>2]=0.0;s=e+44|0;t=c[s>>2]|0;u=d+148|0;c[u>>2]=t;v=d+100|0;c[v>>2]=0;w=d+104|0;c[w>>2]=0;i=h;return}}function Mc(a){a=a|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0,v=0,w=0,x=0.0,y=0.0,z=0.0,A=0.0,B=0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0;d=i;i=i+16|0;e=d;f=a+116|0;h=a+120|0;j=a+124|0;k=a+128|0;l=a+28|0;g[l>>2]=0.0;g[a+32>>2]=0.0;m=a;n=f;c[n+0>>2]=0;c[n+4>>2]=0;c[n+8>>2]=0;c[n+12>>2]=0;if((c[m>>2]|0)>>>0<2){m=a+12|0;n=c[m>>2]|0;o=c[m+4>>2]|0;m=a+36|0;c[m>>2]=n;c[m+4>>2]=o;m=a+44|0;c[m>>2]=n;c[m+4>>2]=o;g[a+52>>2]=+g[a+56>>2];i=d;return}o=1032;p=+g[o>>2];q=+g[o+4>>2];o=c[a+100>>2]|0;do{if((o|0)==0){r=q;s=p;t=0.0;u=10}else{m=e;n=e+4|0;v=e+8|0;w=e+12|0;x=0.0;y=0.0;z=p;A=q;B=o;while(1){C=+g[B>>2];if(C==0.0){D=x;E=y;F=A;G=z}else{H=c[B+12>>2]|0;bb[c[(c[H>>2]|0)+28>>2]&3](H,e,C);C=+g[m>>2];I=C+ +g[f>>2];g[f>>2]=I;J=z+C*+g[n>>2];K=A+C*+g[v>>2];C=+g[w>>2]+ +g[j>>2];g[j>>2]=C;D=C;E=I;F=K;G=J}H=c[B+4>>2]|0;if((H|0)==0){break}else{x=D;y=E;z=G;A=F;B=H}}if(!(E>0.0)){r=F;s=G;t=D;u=10;break}A=1.0/E;g[h>>2]=A;L=D;M=E;N=F*A;O=G*A}}while(0);if((u|0)==10){g[f>>2]=1.0;g[h>>2]=1.0;L=t;M=1.0;N=r;O=s}do{if(L>0.0){if(!((b[a+4>>1]&16)==0)){u=14;break}s=L-(N*N+O*O)*M;g[j>>2]=s;P=1.0/s}else{u=14}}while(0);if((u|0)==14){g[j>>2]=0.0;P=0.0}g[k>>2]=P;k=a+44|0;j=k;P=+g[j>>2];M=+g[j+4>>2];L=+O;s=+N;j=l;g[j>>2]=L;g[j+4>>2]=s;s=+g[a+24>>2];L=+g[a+20>>2];r=+g[a+12>>2]+(s*O-L*N);t=O*L+s*N+ +g[a+16>>2];N=+r;s=+t;j=k;g[j>>2]=N;g[j+4>>2]=s;j=a+36|0;g[j>>2]=N;g[j+4>>2]=s;s=+g[a+72>>2];j=a+64|0;g[j>>2]=+g[j>>2]-s*(t-M);j=a+68|0;g[j>>2]=s*(r-P)+ +g[j>>2];i=d;return}function Nc(a){a=a|0;var b=0,d=0,e=0.0,f=0.0,h=0.0,j=0.0,k=0.0,l=0.0,m=0,n=0,o=0;b=i;i=i+16|0;d=b;e=+g[a+52>>2];f=+Q(+e);g[d+8>>2]=f;h=+P(+e);g[d+12>>2]=h;e=+g[a+28>>2];j=+g[a+32>>2];k=+(+g[a+36>>2]-(h*e-f*j));l=+(+g[a+40>>2]-(e*f+h*j));m=d;g[m>>2]=k;g[m+4>>2]=l;m=(c[a+88>>2]|0)+102872|0;n=c[a+100>>2]|0;if((n|0)==0){i=b;return}o=a+12|0;a=n;do{nd(a,m,d,o);a=c[a+4>>2]|0;}while((a|0)!=0);i=b;return}function Oc(a,d){a=a|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0;e=i;f=a+88|0;h=c[f>>2]|0;if((c[h+102868>>2]&2|0)!=0){j=0;i=e;return j|0}k=h;h=Ac(k,44)|0;if((h|0)==0){l=0}else{m=h;jd(m);l=m}kd(l,k,a,d);if(!((b[a+4>>1]&32)==0)){md(l,(c[f>>2]|0)+102872|0,a+12|0)}d=a+100|0;c[l+4>>2]=c[d>>2];c[d>>2]=l;d=a+104|0;c[d>>2]=(c[d>>2]|0)+1;c[l+8>>2]=a;if(+g[l>>2]>0.0){Mc(a)}a=(c[f>>2]|0)+102868|0;c[a>>2]=c[a>>2]|1;j=l;i=e;return j|0}function Pc(d,e,f){d=d|0;e=e|0;f=+f;var h=0,j=0;h=i;i=i+32|0;j=h;b[j+22>>1]=1;b[j+24>>1]=-1;b[j+26>>1]=0;c[j+4>>2]=0;g[j+8>>2]=.20000000298023224;g[j+12>>2]=0.0;a[j+20|0]=0;c[j>>2]=e;g[j+16>>2]=f;e=Oc(d,j)|0;i=h;return e|0}function Qc(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;do{if((c[b>>2]|0)!=2){if((c[d>>2]|0)==2){break}else{f=0}i=e;return f|0}}while(0);g=c[b+108>>2]|0;if((g|0)==0){f=1;i=e;return f|0}else{h=g}while(1){if((c[h>>2]|0)==(d|0)){if((a[(c[h+4>>2]|0)+61|0]|0)==0){f=0;j=7;break}}g=c[h+12>>2]|0;if((g|0)==0){f=1;j=7;break}else{h=g}}if((j|0)==7){i=e;return f|0}return 0}function Rc(a){a=a|0;i=i;return}function Sc(a){a=a|0;i=i;return}function Tc(a){a=a|0;var b=0;b=i;Eb(a);c[a+60>>2]=0;c[a+64>>2]=0;c[a+68>>2]=1040;c[a+72>>2]=1048;c[a+76>>2]=0;i=b;return}function Uc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;d=i;e=c[(c[b+48>>2]|0)+8>>2]|0;f=c[(c[b+52>>2]|0)+8>>2]|0;g=c[a+72>>2]|0;do{if((g|0)!=0){if((c[b+4>>2]&2|0)==0){break}Za[c[(c[g>>2]|0)+12>>2]&15](g,b)}}while(0);g=b+8|0;h=c[g>>2]|0;j=b+12|0;if((h|0)!=0){c[h+12>>2]=c[j>>2]}h=c[j>>2]|0;if((h|0)!=0){c[h+8>>2]=c[g>>2]}g=a+60|0;if((c[g>>2]|0)==(b|0)){c[g>>2]=c[j>>2]}j=b+24|0;g=c[j>>2]|0;h=b+28|0;if((g|0)!=0){c[g+12>>2]=c[h>>2]}g=c[h>>2]|0;if((g|0)!=0){c[g+8>>2]=c[j>>2]}j=e+112|0;if((b+16|0)==(c[j>>2]|0)){c[j>>2]=c[h>>2]}h=b+40|0;j=c[h>>2]|0;e=b+44|0;if((j|0)!=0){c[j+12>>2]=c[e>>2]}j=c[e>>2]|0;if((j|0)!=0){c[j+8>>2]=c[h>>2]}h=f+112|0;if((b+32|0)!=(c[h>>2]|0)){k=a+76|0;l=c[k>>2]|0;Qd(b,l);m=a+64|0;n=c[m>>2]|0;o=n+ -1|0;c[m>>2]=o;i=d;return}c[h>>2]=c[e>>2];k=a+76|0;l=c[k>>2]|0;Qd(b,l);m=a+64|0;n=c[m>>2]|0;o=n+ -1|0;c[m>>2]=o;i=d;return}function Vc(a){a=a|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;d=i;e=c[a+60>>2]|0;if((e|0)==0){i=d;return}f=a+4|0;h=a+72|0;j=a+68|0;k=e;while(1){e=c[k+48>>2]|0;l=c[k+52>>2]|0;m=c[k+56>>2]|0;n=c[k+60>>2]|0;o=c[e+8>>2]|0;p=c[l+8>>2]|0;q=k+4|0;a:do{if((c[q>>2]&8|0)==0){r=11}else{if(!(Qc(p,o)|0)){s=c[k+12>>2]|0;Uc(a,k);t=s;break}s=c[j>>2]|0;do{if((s|0)!=0){if(Wa[c[(c[s>>2]|0)+8>>2]&7](s,e,l)|0){break}u=c[k+12>>2]|0;Uc(a,k);t=u;break a}}while(0);c[q>>2]=c[q>>2]&-9;r=11}}while(0);do{if((r|0)==11){r=0;if((b[o+4>>1]&2)==0){v=0}else{v=(c[o>>2]|0)!=0}if((b[p+4>>1]&2)==0){w=0}else{w=(c[p>>2]|0)!=0}if(!(v|w)){t=c[k+12>>2]|0;break}q=c[(c[e+24>>2]|0)+(m*28|0)+24>>2]|0;s=c[(c[l+24>>2]|0)+(n*28|0)+24>>2]|0;u=c[f>>2]|0;if(+g[u+(s*36|0)>>2]- +g[u+(q*36|0)+8>>2]>0.0|+g[u+(s*36|0)+4>>2]- +g[u+(q*36|0)+12>>2]>0.0|+g[u+(q*36|0)>>2]- +g[u+(s*36|0)+8>>2]>0.0|+g[u+(q*36|0)+4>>2]- +g[u+(s*36|0)+12>>2]>0.0){s=c[k+12>>2]|0;Uc(a,k);t=s;break}else{Sd(k,c[h>>2]|0);t=c[k+12>>2]|0;break}}}while(0);if((t|0)==0){break}else{k=t}}i=d;return}function Wc(a){a=a|0;var b=0;b=i;Xc(a,a);i=b;return}function Xc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;i=i+8|0;e=d;f=a+52|0;c[f>>2]=0;g=a+40|0;h=c[g>>2]|0;if((h|0)>0){j=a+32|0;k=a+56|0;l=a;m=a+4|0;n=h;h=0;while(1){o=c[(c[j>>2]|0)+(h<<2)>>2]|0;c[k>>2]=o;if((o|0)==-1){p=n}else{Zc(l,a,(c[m>>2]|0)+(o*36|0)|0);p=c[g>>2]|0}o=h+1|0;if((o|0)<(p|0)){n=p;h=o}else{break}}q=c[f>>2]|0}else{q=0}c[g>>2]=0;g=a+44|0;h=c[g>>2]|0;c[e>>2]=4;$c(h,h+(q*12|0)|0,e);if((c[f>>2]|0)<=0){i=d;return}e=a+4|0;a=0;a:while(1){q=c[g>>2]|0;h=q+(a*12|0)|0;p=c[e>>2]|0;n=q+(a*12|0)+4|0;Yc(b,c[p+((c[h>>2]|0)*36|0)+16>>2]|0,c[p+((c[n>>2]|0)*36|0)+16>>2]|0);p=c[f>>2]|0;q=a;while(1){m=q+1|0;if((m|0)>=(p|0)){break a}l=c[g>>2]|0;if((c[l+(m*12|0)>>2]|0)!=(c[h>>2]|0)){a=m;continue a}if((c[l+(m*12|0)+4>>2]|0)==(c[n>>2]|0)){q=m}else{a=m;continue a}}}i=d;return}function Yc(a,d,f){a=a|0;d=d|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;h=i;j=c[d+16>>2]|0;k=c[f+16>>2]|0;l=c[d+20>>2]|0;d=c[f+20>>2]|0;f=c[j+8>>2]|0;m=c[k+8>>2]|0;if((f|0)==(m|0)){i=h;return}n=c[m+112>>2]|0;a:do{if((n|0)!=0){o=n;while(1){if((c[o>>2]|0)==(f|0)){p=c[o+4>>2]|0;q=c[p+48>>2]|0;r=c[p+52>>2]|0;s=c[p+56>>2]|0;t=c[p+60>>2]|0;if((q|0)==(j|0)&(r|0)==(k|0)&(s|0)==(l|0)&(t|0)==(d|0)){u=22;break}if((q|0)==(k|0)&(r|0)==(j|0)&(s|0)==(d|0)&(t|0)==(l|0)){u=22;break}}o=c[o+12>>2]|0;if((o|0)==0){break a}}if((u|0)==22){i=h;return}}}while(0);if(!(Qc(m,f)|0)){i=h;return}f=c[a+68>>2]|0;do{if((f|0)!=0){if(Wa[c[(c[f>>2]|0)+8>>2]&7](f,j,k)|0){break}i=h;return}}while(0);f=Pd(j,l,k,d,c[a+76>>2]|0)|0;if((f|0)==0){i=h;return}d=c[(c[f+48>>2]|0)+8>>2]|0;k=c[(c[f+52>>2]|0)+8>>2]|0;c[f+8>>2]=0;l=a+60|0;c[f+12>>2]=c[l>>2];j=c[l>>2]|0;if((j|0)!=0){c[j+8>>2]=f}c[l>>2]=f;l=f+16|0;c[f+20>>2]=f;c[l>>2]=k;c[f+24>>2]=0;j=d+112|0;c[f+28>>2]=c[j>>2];m=c[j>>2]|0;if((m|0)!=0){c[m+8>>2]=l}c[j>>2]=l;l=f+32|0;c[f+36>>2]=f;c[l>>2]=d;c[f+40>>2]=0;j=k+112|0;c[f+44>>2]=c[j>>2];f=c[j>>2]|0;if((f|0)!=0){c[f+8>>2]=l}c[j>>2]=l;l=d+4|0;j=e[l>>1]|0;if((j&2|0)==0){b[l>>1]=j|2;g[d+144>>2]=0.0}d=k+4|0;j=e[d>>1]|0;if((j&2|0)==0){b[d>>1]=j|2;g[k+144>>2]=0.0}k=a+64|0;c[k>>2]=(c[k>>2]|0)+1;i=h;return}function Zc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;e=i;i=i+1040|0;f=e;h=f+4|0;j=f;c[j>>2]=h;k=f+1028|0;c[k>>2]=0;l=f+1032|0;c[l>>2]=256;f=c[j>>2]|0;c[f+(c[k>>2]<<2)>>2]=c[a>>2];m=c[k>>2]|0;n=m+1|0;c[k>>2]=n;a:do{if((m|0)>-1){o=a+4|0;p=d;q=d+4|0;r=d+8|0;s=d+12|0;t=f;u=n;while(1){v=u+ -1|0;c[k>>2]=v;w=c[t+(v<<2)>>2]|0;do{if((w|0)==-1){x=v}else{y=c[o>>2]|0;if(+g[p>>2]- +g[y+(w*36|0)+8>>2]>0.0|+g[q>>2]- +g[y+(w*36|0)+12>>2]>0.0|+g[y+(w*36|0)>>2]- +g[r>>2]>0.0|+g[y+(w*36|0)+4>>2]- +g[s>>2]>0.0){x=v;break}z=y+(w*36|0)+24|0;if((c[z>>2]|0)==-1){if(!(Ib(b,w)|0)){break a}x=c[k>>2]|0;break}do{if((v|0)==(c[l>>2]|0)){c[l>>2]=v<<1;A=Cc(v<<3)|0;c[j>>2]=A;B=t;Qe(A|0,B|0,c[k>>2]<<2|0)|0;if((t|0)==(h|0)){break}Dc(B)}}while(0);B=c[j>>2]|0;c[B+(c[k>>2]<<2)>>2]=c[z>>2];A=(c[k>>2]|0)+1|0;c[k>>2]=A;C=y+(w*36|0)+28|0;do{if((A|0)==(c[l>>2]|0)){c[l>>2]=A<<1;D=Cc(A<<3)|0;c[j>>2]=D;E=B;Qe(D|0,E|0,c[k>>2]<<2|0)|0;if((B|0)==(h|0)){break}Dc(E)}}while(0);c[(c[j>>2]|0)+(c[k>>2]<<2)>>2]=c[C>>2];B=(c[k>>2]|0)+1|0;c[k>>2]=B;x=B}}while(0);if((x|0)<=0){break a}t=c[j>>2]|0;u=x}}}while(0);x=c[j>>2]|0;if((x|0)==(h|0)){i=e;return}Dc(x);c[j>>2]=0;i=e;return}function _c(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;e=c[a>>2]|0;f=c[b>>2]|0;do{if((e|0)<(f|0)){g=1}else{if((e|0)!=(f|0)){g=0;break}g=(c[a+4>>2]|0)<(c[b+4>>2]|0)}}while(0);i=d;return g|0}function $c(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0;e=i;i=i+384|0;f=e+224|0;g=e+240|0;h=e+256|0;j=e+272|0;k=e+288|0;l=e+304|0;m=e+320|0;n=e+336|0;o=e+352|0;p=e+368|0;q=e+208|0;r=e+176|0;s=e+160|0;t=e+192|0;u=e;v=e+16|0;w=e+48|0;x=e+64|0;y=e+32|0;z=e+80|0;A=e+96|0;B=e+128|0;C=e+144|0;D=e+112|0;E=a;a=b;a:while(1){b=a;F=a+ -12|0;G=F;H=E;b:while(1){I=H;J=b-I|0;switch((J|0)/12|0|0){case 2:{K=4;break a;break};case 5:{K=15;break a;break};case 1:case 0:{K=67;break a;break};case 3:{K=6;break a;break};case 4:{K=14;break a;break};default:{}}if((J|0)<372){K=21;break a}L=(J|0)/24|0;M=H+(L*12|0)|0;do{if((J|0)>11988){N=(J|0)/48|0;O=H+(N*12|0)|0;P=H+((N+L|0)*12|0)|0;N=ad(H,O,M,P,d)|0;if(!(db[c[d>>2]&7](F,P)|0)){Q=N;break}R=P;c[q+0>>2]=c[R+0>>2];c[q+4>>2]=c[R+4>>2];c[q+8>>2]=c[R+8>>2];c[R+0>>2]=c[G+0>>2];c[R+4>>2]=c[G+4>>2];c[R+8>>2]=c[G+8>>2];c[G+0>>2]=c[q+0>>2];c[G+4>>2]=c[q+4>>2];c[G+8>>2]=c[q+8>>2];if(!(db[c[d>>2]&7](P,M)|0)){Q=N+1|0;break}P=M;c[r+0>>2]=c[P+0>>2];c[r+4>>2]=c[P+4>>2];c[r+8>>2]=c[P+8>>2];c[P+0>>2]=c[R+0>>2];c[P+4>>2]=c[R+4>>2];c[P+8>>2]=c[R+8>>2];c[R+0>>2]=c[r+0>>2];c[R+4>>2]=c[r+4>>2];c[R+8>>2]=c[r+8>>2];if(!(db[c[d>>2]&7](M,O)|0)){Q=N+2|0;break}R=O;c[s+0>>2]=c[R+0>>2];c[s+4>>2]=c[R+4>>2];c[s+8>>2]=c[R+8>>2];c[R+0>>2]=c[P+0>>2];c[R+4>>2]=c[P+4>>2];c[R+8>>2]=c[P+8>>2];c[P+0>>2]=c[s+0>>2];c[P+4>>2]=c[s+4>>2];c[P+8>>2]=c[s+8>>2];if(!(db[c[d>>2]&7](O,H)|0)){Q=N+3|0;break}O=H;c[t+0>>2]=c[O+0>>2];c[t+4>>2]=c[O+4>>2];c[t+8>>2]=c[O+8>>2];c[O+0>>2]=c[R+0>>2];c[O+4>>2]=c[R+4>>2];c[O+8>>2]=c[R+8>>2];c[R+0>>2]=c[t+0>>2];c[R+4>>2]=c[t+4>>2];c[R+8>>2]=c[t+8>>2];Q=N+4|0}else{N=db[c[d>>2]&7](M,H)|0;R=db[c[d>>2]&7](F,M)|0;if(!N){if(!R){Q=0;break}N=M;c[C+0>>2]=c[N+0>>2];c[C+4>>2]=c[N+4>>2];c[C+8>>2]=c[N+8>>2];c[N+0>>2]=c[G+0>>2];c[N+4>>2]=c[G+4>>2];c[N+8>>2]=c[G+8>>2];c[G+0>>2]=c[C+0>>2];c[G+4>>2]=c[C+4>>2];c[G+8>>2]=c[C+8>>2];if(!(db[c[d>>2]&7](M,H)|0)){Q=1;break}O=H;c[D+0>>2]=c[O+0>>2];c[D+4>>2]=c[O+4>>2];c[D+8>>2]=c[O+8>>2];c[O+0>>2]=c[N+0>>2];c[O+4>>2]=c[N+4>>2];c[O+8>>2]=c[N+8>>2];c[N+0>>2]=c[D+0>>2];c[N+4>>2]=c[D+4>>2];c[N+8>>2]=c[D+8>>2];Q=2;break}if(R){R=H;c[z+0>>2]=c[R+0>>2];c[z+4>>2]=c[R+4>>2];c[z+8>>2]=c[R+8>>2];c[R+0>>2]=c[G+0>>2];c[R+4>>2]=c[G+4>>2];c[R+8>>2]=c[G+8>>2];c[G+0>>2]=c[z+0>>2];c[G+4>>2]=c[z+4>>2];c[G+8>>2]=c[z+8>>2];Q=1;break}R=H;c[A+0>>2]=c[R+0>>2];c[A+4>>2]=c[R+4>>2];c[A+8>>2]=c[R+8>>2];N=M;c[R+0>>2]=c[N+0>>2];c[R+4>>2]=c[N+4>>2];c[R+8>>2]=c[N+8>>2];c[N+0>>2]=c[A+0>>2];c[N+4>>2]=c[A+4>>2];c[N+8>>2]=c[A+8>>2];if(!(db[c[d>>2]&7](F,M)|0)){Q=1;break}c[B+0>>2]=c[N+0>>2];c[B+4>>2]=c[N+4>>2];c[B+8>>2]=c[N+8>>2];c[N+0>>2]=c[G+0>>2];c[N+4>>2]=c[G+4>>2];c[N+8>>2]=c[G+8>>2];c[G+0>>2]=c[B+0>>2];c[G+4>>2]=c[B+4>>2];c[G+8>>2]=c[B+8>>2];Q=2}}while(0);do{if(db[c[d>>2]&7](H,M)|0){S=F;T=Q}else{L=F;while(1){U=L+ -12|0;if((H|0)==(U|0)){break}if(db[c[d>>2]&7](U,M)|0){K=50;break}else{L=U}}if((K|0)==50){K=0;L=H;c[y+0>>2]=c[L+0>>2];c[y+4>>2]=c[L+4>>2];c[y+8>>2]=c[L+8>>2];J=U;c[L+0>>2]=c[J+0>>2];c[L+4>>2]=c[J+4>>2];c[L+8>>2]=c[J+8>>2];c[J+0>>2]=c[y+0>>2];c[J+4>>2]=c[y+4>>2];c[J+8>>2]=c[y+8>>2];S=U;T=Q+1|0;break}J=H+12|0;if(db[c[d>>2]&7](H,F)|0){V=J}else{if((J|0)==(F|0)){K=67;break a}else{W=J}while(1){X=W+12|0;if(db[c[d>>2]&7](H,W)|0){break}if((X|0)==(F|0)){K=67;break a}else{W=X}}J=W;c[x+0>>2]=c[J+0>>2];c[x+4>>2]=c[J+4>>2];c[x+8>>2]=c[J+8>>2];c[J+0>>2]=c[G+0>>2];c[J+4>>2]=c[G+4>>2];c[J+8>>2]=c[G+8>>2];c[G+0>>2]=c[x+0>>2];c[G+4>>2]=c[x+4>>2];c[G+8>>2]=c[x+8>>2];V=X}if((V|0)==(F|0)){K=67;break a}else{Y=V;Z=F}while(1){J=Y;while(1){_=J+12|0;if(db[c[d>>2]&7](H,J)|0){$=Z;break}else{J=_}}do{$=$+ -12|0;}while(db[c[d>>2]&7](H,$)|0);if(!(J>>>0<$>>>0)){H=J;continue b}L=J;c[w+0>>2]=c[L+0>>2];c[w+4>>2]=c[L+4>>2];c[w+8>>2]=c[L+8>>2];N=$;c[L+0>>2]=c[N+0>>2];c[L+4>>2]=c[N+4>>2];c[L+8>>2]=c[N+8>>2];c[N+0>>2]=c[w+0>>2];c[N+4>>2]=c[w+4>>2];c[N+8>>2]=c[w+8>>2];Y=_;Z=$}}}while(0);N=H+12|0;c:do{if(N>>>0<S>>>0){L=N;R=S;O=M;P=T;while(1){aa=L;while(1){ba=aa+12|0;if(db[c[d>>2]&7](aa,O)|0){aa=ba}else{ca=R;break}}do{ca=ca+ -12|0;}while(!(db[c[d>>2]&7](ca,O)|0));if(aa>>>0>ca>>>0){da=aa;ea=O;fa=P;break c}J=aa;c[v+0>>2]=c[J+0>>2];c[v+4>>2]=c[J+4>>2];c[v+8>>2]=c[J+8>>2];ga=ca;c[J+0>>2]=c[ga+0>>2];c[J+4>>2]=c[ga+4>>2];c[J+8>>2]=c[ga+8>>2];c[ga+0>>2]=c[v+0>>2];c[ga+4>>2]=c[v+4>>2];c[ga+8>>2]=c[v+8>>2];L=ba;R=ca;O=(O|0)==(aa|0)?ca:O;P=P+1|0}}else{da=N;ea=M;fa=T}}while(0);do{if((da|0)==(ea|0)){ha=fa}else{if(!(db[c[d>>2]&7](ea,da)|0)){ha=fa;break}M=da;c[u+0>>2]=c[M+0>>2];c[u+4>>2]=c[M+4>>2];c[u+8>>2]=c[M+8>>2];N=ea;c[M+0>>2]=c[N+0>>2];c[M+4>>2]=c[N+4>>2];c[M+8>>2]=c[N+8>>2];c[N+0>>2]=c[u+0>>2];c[N+4>>2]=c[u+4>>2];c[N+8>>2]=c[u+8>>2];ha=fa+1|0}}while(0);if((ha|0)==0){ia=cd(H,da,d)|0;N=da+12|0;if(cd(N,a,d)|0){K=62;break}if(ia){H=N;continue}}N=da;if((N-I|0)>=(b-N|0)){K=66;break}$c(H,da,d);H=da+12|0}if((K|0)==62){K=0;if(ia){K=67;break}else{E=H;a=da;continue}}else if((K|0)==66){K=0;$c(da+12|0,a,d);E=H;a=da;continue}}if((K|0)==4){if(!(db[c[d>>2]&7](F,H)|0)){i=e;return}da=p;p=H;c[da+0>>2]=c[p+0>>2];c[da+4>>2]=c[p+4>>2];c[da+8>>2]=c[p+8>>2];c[p+0>>2]=c[G+0>>2];c[p+4>>2]=c[G+4>>2];c[p+8>>2]=c[G+8>>2];c[G+0>>2]=c[da+0>>2];c[G+4>>2]=c[da+4>>2];c[G+8>>2]=c[da+8>>2];i=e;return}else if((K|0)==6){da=H+12|0;p=db[c[d>>2]&7](da,H)|0;E=db[c[d>>2]&7](F,da)|0;if(!p){if(!E){i=e;return}p=o;o=da;c[p+0>>2]=c[o+0>>2];c[p+4>>2]=c[o+4>>2];c[p+8>>2]=c[o+8>>2];c[o+0>>2]=c[G+0>>2];c[o+4>>2]=c[G+4>>2];c[o+8>>2]=c[G+8>>2];c[G+0>>2]=c[p+0>>2];c[G+4>>2]=c[p+4>>2];c[G+8>>2]=c[p+8>>2];if(!(db[c[d>>2]&7](da,H)|0)){i=e;return}p=m;m=H;c[p+0>>2]=c[m+0>>2];c[p+4>>2]=c[m+4>>2];c[p+8>>2]=c[m+8>>2];c[m+0>>2]=c[o+0>>2];c[m+4>>2]=c[o+4>>2];c[m+8>>2]=c[o+8>>2];c[o+0>>2]=c[p+0>>2];c[o+4>>2]=c[p+4>>2];c[o+8>>2]=c[p+8>>2];i=e;return}if(E){E=k;k=H;c[E+0>>2]=c[k+0>>2];c[E+4>>2]=c[k+4>>2];c[E+8>>2]=c[k+8>>2];c[k+0>>2]=c[G+0>>2];c[k+4>>2]=c[G+4>>2];c[k+8>>2]=c[G+8>>2];c[G+0>>2]=c[E+0>>2];c[G+4>>2]=c[E+4>>2];c[G+8>>2]=c[E+8>>2];i=e;return}E=l;l=H;c[E+0>>2]=c[l+0>>2];c[E+4>>2]=c[l+4>>2];c[E+8>>2]=c[l+8>>2];k=da;c[l+0>>2]=c[k+0>>2];c[l+4>>2]=c[k+4>>2];c[l+8>>2]=c[k+8>>2];c[k+0>>2]=c[E+0>>2];c[k+4>>2]=c[E+4>>2];c[k+8>>2]=c[E+8>>2];if(!(db[c[d>>2]&7](F,da)|0)){i=e;return}da=n;c[da+0>>2]=c[k+0>>2];c[da+4>>2]=c[k+4>>2];c[da+8>>2]=c[k+8>>2];c[k+0>>2]=c[G+0>>2];c[k+4>>2]=c[G+4>>2];c[k+8>>2]=c[G+8>>2];c[G+0>>2]=c[da+0>>2];c[G+4>>2]=c[da+4>>2];c[G+8>>2]=c[da+8>>2];i=e;return}else if((K|0)==14){ad(H,H+12|0,H+24|0,F,d)|0;i=e;return}else if((K|0)==15){da=H+12|0;k=H+24|0;n=H+36|0;ad(H,da,k,n,d)|0;if(!(db[c[d>>2]&7](F,n)|0)){i=e;return}F=j;j=n;c[F+0>>2]=c[j+0>>2];c[F+4>>2]=c[j+4>>2];c[F+8>>2]=c[j+8>>2];c[j+0>>2]=c[G+0>>2];c[j+4>>2]=c[G+4>>2];c[j+8>>2]=c[G+8>>2];c[G+0>>2]=c[F+0>>2];c[G+4>>2]=c[F+4>>2];c[G+8>>2]=c[F+8>>2];if(!(db[c[d>>2]&7](n,k)|0)){i=e;return}n=g;g=k;c[n+0>>2]=c[g+0>>2];c[n+4>>2]=c[g+4>>2];c[n+8>>2]=c[g+8>>2];c[g+0>>2]=c[j+0>>2];c[g+4>>2]=c[j+4>>2];c[g+8>>2]=c[j+8>>2];c[j+0>>2]=c[n+0>>2];c[j+4>>2]=c[n+4>>2];c[j+8>>2]=c[n+8>>2];if(!(db[c[d>>2]&7](k,da)|0)){i=e;return}k=f;f=da;c[k+0>>2]=c[f+0>>2];c[k+4>>2]=c[f+4>>2];c[k+8>>2]=c[f+8>>2];c[f+0>>2]=c[g+0>>2];c[f+4>>2]=c[g+4>>2];c[f+8>>2]=c[g+8>>2];c[g+0>>2]=c[k+0>>2];c[g+4>>2]=c[k+4>>2];c[g+8>>2]=c[k+8>>2];if(!(db[c[d>>2]&7](da,H)|0)){i=e;return}da=h;h=H;c[da+0>>2]=c[h+0>>2];c[da+4>>2]=c[h+4>>2];c[da+8>>2]=c[h+8>>2];c[h+0>>2]=c[f+0>>2];c[h+4>>2]=c[f+4>>2];c[h+8>>2]=c[f+8>>2];c[f+0>>2]=c[da+0>>2];c[f+4>>2]=c[da+4>>2];c[f+8>>2]=c[da+8>>2];i=e;return}else if((K|0)==21){bd(H,a,d);i=e;return}else if((K|0)==67){i=e;return}}function ad(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;g=i;i=i+128|0;h=g;j=g+16|0;k=g+32|0;l=g+48|0;m=g+64|0;n=g+80|0;o=g+96|0;p=g+112|0;q=db[c[f>>2]&7](b,a)|0;r=db[c[f>>2]&7](d,b)|0;do{if(q){if(r){s=l;t=a;c[s+0>>2]=c[t+0>>2];c[s+4>>2]=c[t+4>>2];c[s+8>>2]=c[t+8>>2];u=d;c[t+0>>2]=c[u+0>>2];c[t+4>>2]=c[u+4>>2];c[t+8>>2]=c[u+8>>2];c[u+0>>2]=c[s+0>>2];c[u+4>>2]=c[s+4>>2];c[u+8>>2]=c[s+8>>2];v=1;break}s=m;u=a;c[s+0>>2]=c[u+0>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];t=b;c[u+0>>2]=c[t+0>>2];c[u+4>>2]=c[t+4>>2];c[u+8>>2]=c[t+8>>2];c[t+0>>2]=c[s+0>>2];c[t+4>>2]=c[s+4>>2];c[t+8>>2]=c[s+8>>2];if(!(db[c[f>>2]&7](d,b)|0)){v=1;break}s=o;c[s+0>>2]=c[t+0>>2];c[s+4>>2]=c[t+4>>2];c[s+8>>2]=c[t+8>>2];u=d;c[t+0>>2]=c[u+0>>2];c[t+4>>2]=c[u+4>>2];c[t+8>>2]=c[u+8>>2];c[u+0>>2]=c[s+0>>2];c[u+4>>2]=c[s+4>>2];c[u+8>>2]=c[s+8>>2];v=2}else{if(!r){v=0;break}s=p;u=b;c[s+0>>2]=c[u+0>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];t=d;c[u+0>>2]=c[t+0>>2];c[u+4>>2]=c[t+4>>2];c[u+8>>2]=c[t+8>>2];c[t+0>>2]=c[s+0>>2];c[t+4>>2]=c[s+4>>2];c[t+8>>2]=c[s+8>>2];if(!(db[c[f>>2]&7](b,a)|0)){v=1;break}s=n;t=a;c[s+0>>2]=c[t+0>>2];c[s+4>>2]=c[t+4>>2];c[s+8>>2]=c[t+8>>2];c[t+0>>2]=c[u+0>>2];c[t+4>>2]=c[u+4>>2];c[t+8>>2]=c[u+8>>2];c[u+0>>2]=c[s+0>>2];c[u+4>>2]=c[s+4>>2];c[u+8>>2]=c[s+8>>2];v=2}}while(0);if(!(db[c[f>>2]&7](e,d)|0)){w=v;i=g;return w|0}n=k;k=d;c[n+0>>2]=c[k+0>>2];c[n+4>>2]=c[k+4>>2];c[n+8>>2]=c[k+8>>2];p=e;c[k+0>>2]=c[p+0>>2];c[k+4>>2]=c[p+4>>2];c[k+8>>2]=c[p+8>>2];c[p+0>>2]=c[n+0>>2];c[p+4>>2]=c[n+4>>2];c[p+8>>2]=c[n+8>>2];if(!(db[c[f>>2]&7](d,b)|0)){w=v+1|0;i=g;return w|0}d=j;j=b;c[d+0>>2]=c[j+0>>2];c[d+4>>2]=c[j+4>>2];c[d+8>>2]=c[j+8>>2];c[j+0>>2]=c[k+0>>2];c[j+4>>2]=c[k+4>>2];c[j+8>>2]=c[k+8>>2];c[k+0>>2]=c[d+0>>2];c[k+4>>2]=c[d+4>>2];c[k+8>>2]=c[d+8>>2];if(!(db[c[f>>2]&7](b,a)|0)){w=v+2|0;i=g;return w|0}b=h;h=a;c[b+0>>2]=c[h+0>>2];c[b+4>>2]=c[h+4>>2];c[b+8>>2]=c[h+8>>2];c[h+0>>2]=c[j+0>>2];c[h+4>>2]=c[j+4>>2];c[h+8>>2]=c[j+8>>2];c[j+0>>2]=c[b+0>>2];c[j+4>>2]=c[b+4>>2];c[j+8>>2]=c[b+8>>2];w=v+3|0;i=g;return w|0}function bd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=i;i=i+96|0;f=e;g=e+16|0;h=e+32|0;j=e+48|0;k=e+64|0;l=e+80|0;m=a+24|0;n=a+12|0;o=db[c[d>>2]&7](n,a)|0;p=db[c[d>>2]&7](m,n)|0;do{if(o){if(p){q=f;r=a;c[q+0>>2]=c[r+0>>2];c[q+4>>2]=c[r+4>>2];c[q+8>>2]=c[r+8>>2];s=m;c[r+0>>2]=c[s+0>>2];c[r+4>>2]=c[s+4>>2];c[r+8>>2]=c[s+8>>2];c[s+0>>2]=c[q+0>>2];c[s+4>>2]=c[q+4>>2];c[s+8>>2]=c[q+8>>2];break}q=g;s=a;c[q+0>>2]=c[s+0>>2];c[q+4>>2]=c[s+4>>2];c[q+8>>2]=c[s+8>>2];r=n;c[s+0>>2]=c[r+0>>2];c[s+4>>2]=c[r+4>>2];c[s+8>>2]=c[r+8>>2];c[r+0>>2]=c[q+0>>2];c[r+4>>2]=c[q+4>>2];c[r+8>>2]=c[q+8>>2];if(!(db[c[d>>2]&7](m,n)|0)){break}q=j;c[q+0>>2]=c[r+0>>2];c[q+4>>2]=c[r+4>>2];c[q+8>>2]=c[r+8>>2];s=m;c[r+0>>2]=c[s+0>>2];c[r+4>>2]=c[s+4>>2];c[r+8>>2]=c[s+8>>2];c[s+0>>2]=c[q+0>>2];c[s+4>>2]=c[q+4>>2];c[s+8>>2]=c[q+8>>2]}else{if(!p){break}q=k;s=n;c[q+0>>2]=c[s+0>>2];c[q+4>>2]=c[s+4>>2];c[q+8>>2]=c[s+8>>2];r=m;c[s+0>>2]=c[r+0>>2];c[s+4>>2]=c[r+4>>2];c[s+8>>2]=c[r+8>>2];c[r+0>>2]=c[q+0>>2];c[r+4>>2]=c[q+4>>2];c[r+8>>2]=c[q+8>>2];if(!(db[c[d>>2]&7](n,a)|0)){break}q=h;r=a;c[q+0>>2]=c[r+0>>2];c[q+4>>2]=c[r+4>>2];c[q+8>>2]=c[r+8>>2];c[r+0>>2]=c[s+0>>2];c[r+4>>2]=c[s+4>>2];c[r+8>>2]=c[s+8>>2];c[s+0>>2]=c[q+0>>2];c[s+4>>2]=c[q+4>>2];c[s+8>>2]=c[q+8>>2]}}while(0);h=a+36|0;if((h|0)==(b|0)){i=e;return}n=l;k=h;h=m;while(1){if(db[c[d>>2]&7](k,h)|0){m=k;c[n+0>>2]=c[m+0>>2];c[n+4>>2]=c[m+4>>2];c[n+8>>2]=c[m+8>>2];m=k;p=h;while(1){j=m;t=p;c[j+0>>2]=c[t+0>>2];c[j+4>>2]=c[t+4>>2];c[j+8>>2]=c[t+8>>2];if((p|0)==(a|0)){break}j=p+ -12|0;if(db[c[d>>2]&7](l,j)|0){g=p;p=j;m=g}else{break}}c[t+0>>2]=c[n+0>>2];c[t+4>>2]=c[n+4>>2];c[t+8>>2]=c[n+8>>2]}m=k+12|0;if((m|0)==(b|0)){break}else{p=k;k=m;h=p}}i=e;return}function cd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;e=i;i=i+256|0;f=e;g=e+16|0;h=e+32|0;j=e+48|0;k=e+64|0;l=e+80|0;m=e+96|0;n=e+112|0;o=e+128|0;p=e+144|0;q=e+160|0;r=e+176|0;s=e+192|0;t=e+208|0;u=e+224|0;v=e+240|0;switch((b-a|0)/12|0|0){case 3:{w=a+12|0;x=b+ -12|0;y=db[c[d>>2]&7](w,a)|0;z=db[c[d>>2]&7](x,w)|0;if(!y){if(!z){A=1;i=e;return A|0}y=t;t=w;c[y+0>>2]=c[t+0>>2];c[y+4>>2]=c[t+4>>2];c[y+8>>2]=c[t+8>>2];B=x;c[t+0>>2]=c[B+0>>2];c[t+4>>2]=c[B+4>>2];c[t+8>>2]=c[B+8>>2];c[B+0>>2]=c[y+0>>2];c[B+4>>2]=c[y+4>>2];c[B+8>>2]=c[y+8>>2];if(!(db[c[d>>2]&7](w,a)|0)){A=1;i=e;return A|0}y=r;r=a;c[y+0>>2]=c[r+0>>2];c[y+4>>2]=c[r+4>>2];c[y+8>>2]=c[r+8>>2];c[r+0>>2]=c[t+0>>2];c[r+4>>2]=c[t+4>>2];c[r+8>>2]=c[t+8>>2];c[t+0>>2]=c[y+0>>2];c[t+4>>2]=c[y+4>>2];c[t+8>>2]=c[y+8>>2];A=1;i=e;return A|0}if(z){z=p;p=a;c[z+0>>2]=c[p+0>>2];c[z+4>>2]=c[p+4>>2];c[z+8>>2]=c[p+8>>2];y=x;c[p+0>>2]=c[y+0>>2];c[p+4>>2]=c[y+4>>2];c[p+8>>2]=c[y+8>>2];c[y+0>>2]=c[z+0>>2];c[y+4>>2]=c[z+4>>2];c[y+8>>2]=c[z+8>>2];A=1;i=e;return A|0}z=q;q=a;c[z+0>>2]=c[q+0>>2];c[z+4>>2]=c[q+4>>2];c[z+8>>2]=c[q+8>>2];y=w;c[q+0>>2]=c[y+0>>2];c[q+4>>2]=c[y+4>>2];c[q+8>>2]=c[y+8>>2];c[y+0>>2]=c[z+0>>2];c[y+4>>2]=c[z+4>>2];c[y+8>>2]=c[z+8>>2];if(!(db[c[d>>2]&7](x,w)|0)){A=1;i=e;return A|0}w=s;c[w+0>>2]=c[y+0>>2];c[w+4>>2]=c[y+4>>2];c[w+8>>2]=c[y+8>>2];s=x;c[y+0>>2]=c[s+0>>2];c[y+4>>2]=c[s+4>>2];c[y+8>>2]=c[s+8>>2];c[s+0>>2]=c[w+0>>2];c[s+4>>2]=c[w+4>>2];c[s+8>>2]=c[w+8>>2];A=1;i=e;return A|0};case 1:case 0:{A=1;i=e;return A|0};case 2:{w=b+ -12|0;if(!(db[c[d>>2]&7](w,a)|0)){A=1;i=e;return A|0}s=u;u=a;c[s+0>>2]=c[u+0>>2];c[s+4>>2]=c[u+4>>2];c[s+8>>2]=c[u+8>>2];y=w;c[u+0>>2]=c[y+0>>2];c[u+4>>2]=c[y+4>>2];c[u+8>>2]=c[y+8>>2];c[y+0>>2]=c[s+0>>2];c[y+4>>2]=c[s+4>>2];c[y+8>>2]=c[s+8>>2];A=1;i=e;return A|0};case 5:{s=a+12|0;y=a+24|0;u=a+36|0;w=b+ -12|0;ad(a,s,y,u,d)|0;if(!(db[c[d>>2]&7](w,u)|0)){A=1;i=e;return A|0}x=o;o=u;c[x+0>>2]=c[o+0>>2];c[x+4>>2]=c[o+4>>2];c[x+8>>2]=c[o+8>>2];z=w;c[o+0>>2]=c[z+0>>2];c[o+4>>2]=c[z+4>>2];c[o+8>>2]=c[z+8>>2];c[z+0>>2]=c[x+0>>2];c[z+4>>2]=c[x+4>>2];c[z+8>>2]=c[x+8>>2];if(!(db[c[d>>2]&7](u,y)|0)){A=1;i=e;return A|0}u=m;m=y;c[u+0>>2]=c[m+0>>2];c[u+4>>2]=c[m+4>>2];c[u+8>>2]=c[m+8>>2];c[m+0>>2]=c[o+0>>2];c[m+4>>2]=c[o+4>>2];c[m+8>>2]=c[o+8>>2];c[o+0>>2]=c[u+0>>2];c[o+4>>2]=c[u+4>>2];c[o+8>>2]=c[u+8>>2];if(!(db[c[d>>2]&7](y,s)|0)){A=1;i=e;return A|0}y=l;l=s;c[y+0>>2]=c[l+0>>2];c[y+4>>2]=c[l+4>>2];c[y+8>>2]=c[l+8>>2];c[l+0>>2]=c[m+0>>2];c[l+4>>2]=c[m+4>>2];c[l+8>>2]=c[m+8>>2];c[m+0>>2]=c[y+0>>2];c[m+4>>2]=c[y+4>>2];c[m+8>>2]=c[y+8>>2];if(!(db[c[d>>2]&7](s,a)|0)){A=1;i=e;return A|0}s=n;n=a;c[s+0>>2]=c[n+0>>2];c[s+4>>2]=c[n+4>>2];c[s+8>>2]=c[n+8>>2];c[n+0>>2]=c[l+0>>2];c[n+4>>2]=c[l+4>>2];c[n+8>>2]=c[l+8>>2];c[l+0>>2]=c[s+0>>2];c[l+4>>2]=c[s+4>>2];c[l+8>>2]=c[s+8>>2];A=1;i=e;return A|0};case 4:{ad(a,a+12|0,a+24|0,b+ -12|0,d)|0;A=1;i=e;return A|0};default:{s=a+24|0;l=a+12|0;n=db[c[d>>2]&7](l,a)|0;y=db[c[d>>2]&7](s,l)|0;do{if(n){if(y){m=f;u=a;c[m+0>>2]=c[u+0>>2];c[m+4>>2]=c[u+4>>2];c[m+8>>2]=c[u+8>>2];o=s;c[u+0>>2]=c[o+0>>2];c[u+4>>2]=c[o+4>>2];c[u+8>>2]=c[o+8>>2];c[o+0>>2]=c[m+0>>2];c[o+4>>2]=c[m+4>>2];c[o+8>>2]=c[m+8>>2];break}m=g;o=a;c[m+0>>2]=c[o+0>>2];c[m+4>>2]=c[o+4>>2];c[m+8>>2]=c[o+8>>2];u=l;c[o+0>>2]=c[u+0>>2];c[o+4>>2]=c[u+4>>2];c[o+8>>2]=c[u+8>>2];c[u+0>>2]=c[m+0>>2];c[u+4>>2]=c[m+4>>2];c[u+8>>2]=c[m+8>>2];if(!(db[c[d>>2]&7](s,l)|0)){break}m=j;c[m+0>>2]=c[u+0>>2];c[m+4>>2]=c[u+4>>2];c[m+8>>2]=c[u+8>>2];o=s;c[u+0>>2]=c[o+0>>2];c[u+4>>2]=c[o+4>>2];c[u+8>>2]=c[o+8>>2];c[o+0>>2]=c[m+0>>2];c[o+4>>2]=c[m+4>>2];c[o+8>>2]=c[m+8>>2]}else{if(!y){break}m=k;o=l;c[m+0>>2]=c[o+0>>2];c[m+4>>2]=c[o+4>>2];c[m+8>>2]=c[o+8>>2];u=s;c[o+0>>2]=c[u+0>>2];c[o+4>>2]=c[u+4>>2];c[o+8>>2]=c[u+8>>2];c[u+0>>2]=c[m+0>>2];c[u+4>>2]=c[m+4>>2];c[u+8>>2]=c[m+8>>2];if(!(db[c[d>>2]&7](l,a)|0)){break}m=h;u=a;c[m+0>>2]=c[u+0>>2];c[m+4>>2]=c[u+4>>2];c[m+8>>2]=c[u+8>>2];c[u+0>>2]=c[o+0>>2];c[u+4>>2]=c[o+4>>2];c[u+8>>2]=c[o+8>>2];c[o+0>>2]=c[m+0>>2];c[o+4>>2]=c[m+4>>2];c[o+8>>2]=c[m+8>>2]}}while(0);h=a+36|0;if((h|0)==(b|0)){A=1;i=e;return A|0}l=v;k=0;y=h;h=s;while(1){if(db[c[d>>2]&7](y,h)|0){s=y;c[l+0>>2]=c[s+0>>2];c[l+4>>2]=c[s+4>>2];c[l+8>>2]=c[s+8>>2];s=y;j=h;while(1){g=s;C=j;c[g+0>>2]=c[C+0>>2];c[g+4>>2]=c[C+4>>2];c[g+8>>2]=c[C+8>>2];if((j|0)==(a|0)){break}g=j+ -12|0;if(db[c[d>>2]&7](v,g)|0){f=j;j=g;s=f}else{break}}c[C+0>>2]=c[l+0>>2];c[C+4>>2]=c[l+4>>2];c[C+8>>2]=c[l+8>>2];s=k+1|0;if((s|0)==8){break}else{D=s}}else{D=k}s=y+12|0;if((s|0)==(b|0)){A=1;E=35;break}else{j=y;k=D;y=s;h=j}}if((E|0)==35){i=e;return A|0}A=(y+12|0)==(b|0);i=e;return A|0}}return 0}function dd(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function ed(a,b){a=a|0;b=b|0;i=i;return}function fd(a,b){a=a|0;b=b|0;i=i;return}function gd(a,b,c){a=a|0;b=b|0;c=c|0;i=i;return}function hd(a,b,c){a=a|0;b=b|0;c=c|0;i=i;return}function id(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function jd(a){a=a|0;var d=0,e=0;d=i;b[a+32>>1]=1;b[a+34>>1]=-1;b[a+36>>1]=0;c[a+40>>2]=0;c[a+24>>2]=0;c[a+28>>2]=0;e=a;c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;i=d;return}function kd(d,e,f,h){d=d|0;e=e|0;f=f|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0;j=i;c[d+40>>2]=c[h+4>>2];g[d+16>>2]=+g[h+8>>2];g[d+20>>2]=+g[h+12>>2];c[d+8>>2]=f;c[d+4>>2]=0;f=d+32|0;k=h+22|0;b[f+0>>1]=b[k+0>>1]|0;b[f+2>>1]=b[k+2>>1]|0;b[f+4>>1]=b[k+4>>1]|0;a[d+38|0]=a[h+20|0]|0;k=c[h>>2]|0;f=db[c[(c[k>>2]|0)+8>>2]&7](k,e)|0;c[d+12>>2]=f;k=_a[c[(c[f>>2]|0)+12>>2]&3](f)|0;f=Ac(e,k*28|0)|0;e=d+24|0;c[e>>2]=f;if((k|0)>0){l=f;m=0}else{n=d+28|0;c[n>>2]=0;o=h+16|0;p=+g[o>>2];q=d;g[q>>2]=p;i=j;return}do{c[l+(m*28|0)+16>>2]=0;l=c[e>>2]|0;c[l+(m*28|0)+24>>2]=-1;m=m+1|0;}while((m|0)!=(k|0));n=d+28|0;c[n>>2]=0;o=h+16|0;p=+g[o>>2];q=d;g[q>>2]=p;i=j;return}function ld(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;e=a+12|0;f=c[e>>2]|0;g=_a[c[(c[f>>2]|0)+12>>2]&3](f)|0;f=a+24|0;Bc(b,c[f>>2]|0,g*28|0);c[f>>2]=0;f=c[e>>2]|0;g=c[f+4>>2]|0;if((g|0)==2){Ya[c[c[f>>2]>>2]&31](f);Bc(b,f,152);c[e>>2]=0;i=d;return}else if((g|0)==0){Ya[c[c[f>>2]>>2]&31](f);Bc(b,f,20);c[e>>2]=0;i=d;return}else if((g|0)==1){Ya[c[c[f>>2]>>2]&31](f);Bc(b,f,48);c[e>>2]=0;i=d;return}else if((g|0)==3){Ya[c[c[f>>2]>>2]&31](f);Bc(b,f,40);c[e>>2]=0;i=d;return}else{c[e>>2]=0;i=d;return}}function md(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;e=i;f=a+12|0;g=c[f>>2]|0;h=_a[c[(c[g>>2]|0)+12>>2]&3](g)|0;g=a+28|0;c[g>>2]=h;if((h|0)<=0){i=e;return}h=a+24|0;j=0;do{k=c[h>>2]|0;l=k+(j*28|0)|0;m=c[f>>2]|0;n=l;fb[c[(c[m>>2]|0)+24>>2]&15](m,n,d,j);c[k+(j*28|0)+24>>2]=Gb(b,n,l)|0;c[k+(j*28|0)+16>>2]=a;c[k+(j*28|0)+20>>2]=j;j=j+1|0;}while((j|0)<(c[g>>2]|0));i=e;return}function nd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0;f=i;i=i+40|0;h=f;j=f+16|0;k=f+32|0;l=a+28|0;if((c[l>>2]|0)<=0){i=f;return}m=a+24|0;n=a+12|0;a=h;o=j;p=h+4|0;q=j+4|0;r=h+8|0;s=j+8|0;t=h+12|0;u=j+12|0;v=e;w=d;x=e+4|0;y=d+4|0;z=k;A=k+4|0;B=0;do{C=c[m>>2]|0;D=c[n>>2]|0;E=C+(B*28|0)+20|0;fb[c[(c[D>>2]|0)+24>>2]&15](D,h,d,c[E>>2]|0);D=c[n>>2]|0;fb[c[(c[D>>2]|0)+24>>2]&15](D,j,e,c[E>>2]|0);E=C+(B*28|0)|0;F=+g[a>>2];G=+g[o>>2];H=+g[p>>2];I=+g[q>>2];J=+(F<G?F:G);G=+(H<I?H:I);D=E;g[D>>2]=J;g[D+4>>2]=G;G=+g[r>>2];J=+g[s>>2];I=+g[t>>2];H=+g[u>>2];F=+(G>J?G:J);J=+(I>H?I:H);D=C+(B*28|0)+8|0;g[D>>2]=F;g[D+4>>2]=J;J=+g[x>>2]- +g[y>>2];g[z>>2]=+g[v>>2]- +g[w>>2];g[A>>2]=J;Hb(b,c[C+(B*28|0)+24>>2]|0,E,k);B=B+1|0;}while((B|0)<(c[l>>2]|0));i=f;return}function od(a,b,d,e,f,g){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0;h=i;j=a+40|0;c[j>>2]=b;c[a+44>>2]=d;c[a+48>>2]=e;c[a+28>>2]=0;c[a+36>>2]=0;c[a+32>>2]=0;k=a;c[k>>2]=f;c[a+4>>2]=g;c[a+8>>2]=Gc(f,b<<2)|0;c[a+12>>2]=Gc(c[k>>2]|0,d<<2)|0;c[a+16>>2]=Gc(c[k>>2]|0,e<<2)|0;c[a+24>>2]=Gc(c[k>>2]|0,(c[j>>2]|0)*12|0)|0;c[a+20>>2]=Gc(c[k>>2]|0,(c[j>>2]|0)*12|0)|0;i=h;return}function pd(a){a=a|0;var b=0,d=0;b=i;d=a;Hc(c[d>>2]|0,c[a+20>>2]|0);Hc(c[d>>2]|0,c[a+24>>2]|0);Hc(c[d>>2]|0,c[a+16>>2]|0);Hc(c[d>>2]|0,c[a+12>>2]|0);Hc(c[d>>2]|0,c[a+8>>2]|0);i=b;return}function qd(d,e,f,h,j){d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;var l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,O=0.0,R=0,S=0,T=0.0,U=0.0,V=0.0,W=0.0,X=0,Y=0,Z=0.0,_=0.0;l=i;i=i+168|0;m=l;n=l+24|0;o=l+32|0;p=l+64|0;q=l+112|0;r=+g[f>>2];s=d+28|0;if((c[s>>2]|0)>0){t=d+8|0;u=h;v=h+4|0;h=d+20|0;w=d+24|0;x=0;while(1){y=c[(c[t>>2]|0)+(x<<2)>>2]|0;z=y+44|0;A=c[z>>2]|0;B=c[z+4>>2]|0;C=+g[y+56>>2];z=y+64|0;D=+g[z>>2];E=+g[z+4>>2];F=+g[y+72>>2];z=y+36|0;c[z>>2]=A;c[z+4>>2]=B;g[y+52>>2]=C;if((c[y>>2]|0)==2){G=+g[y+140>>2];H=+g[y+120>>2];I=1.0-r*+g[y+132>>2];J=I<1.0?I:1.0;I=J<0.0?0.0:J;J=1.0-r*+g[y+136>>2];K=J<1.0?J:1.0;L=(E+r*(G*+g[v>>2]+H*+g[y+80>>2]))*I;M=(D+r*(G*+g[u>>2]+H*+g[y+76>>2]))*I;O=(F+r*+g[y+128>>2]*+g[y+84>>2])*(K<0.0?0.0:K)}else{L=E;M=D;O=F}y=(c[h>>2]|0)+(x*12|0)|0;c[y>>2]=A;c[y+4>>2]=B;g[(c[h>>2]|0)+(x*12|0)+8>>2]=C;C=+M;F=+L;B=(c[w>>2]|0)+(x*12|0)|0;g[B>>2]=C;g[B+4>>2]=F;g[(c[w>>2]|0)+(x*12|0)+8>>2]=O;B=x+1|0;if((B|0)<(c[s>>2]|0)){x=B}else{R=w;S=h;break}}}else{R=d+24|0;S=d+20|0}h=o;w=f;c[h+0>>2]=c[w+0>>2];c[h+4>>2]=c[w+4>>2];c[h+8>>2]=c[w+8>>2];c[h+12>>2]=c[w+12>>2];c[h+16>>2]=c[w+16>>2];c[h+20>>2]=c[w+20>>2];h=c[S>>2]|0;c[o+24>>2]=h;x=c[R>>2]|0;c[o+28>>2]=x;u=p;c[u+0>>2]=c[w+0>>2];c[u+4>>2]=c[w+4>>2];c[u+8>>2]=c[w+8>>2];c[u+12>>2]=c[w+12>>2];c[u+16>>2]=c[w+16>>2];c[u+20>>2]=c[w+20>>2];w=d+12|0;c[p+24>>2]=c[w>>2];u=d+36|0;c[p+28>>2]=c[u>>2];c[p+32>>2]=h;c[p+36>>2]=x;c[p+40>>2]=c[d>>2];Vd(q,p);Xd(q);if((a[f+20|0]|0)!=0){Yd(q)}p=d+32|0;if((c[p>>2]|0)>0){x=d+16|0;h=0;do{v=c[(c[x>>2]|0)+(h<<2)>>2]|0;Za[c[(c[v>>2]|0)+28>>2]&15](v,o);h=h+1|0;}while((h|0)<(c[p>>2]|0))}g[e+12>>2]=+Kc(n);h=f+12|0;if((c[h>>2]|0)>0){x=d+16|0;v=0;do{if((c[p>>2]|0)>0){t=0;do{B=c[(c[x>>2]|0)+(t<<2)>>2]|0;Za[c[(c[B>>2]|0)+32>>2]&15](B,o);t=t+1|0;}while((t|0)<(c[p>>2]|0))}Zd(q);v=v+1|0;}while((v|0)<(c[h>>2]|0))}_d(q);g[e+16>>2]=+Kc(n);if((c[s>>2]|0)>0){h=c[R>>2]|0;v=0;do{x=c[S>>2]|0;t=x+(v*12|0)|0;B=t;O=+g[B>>2];L=+g[B+4>>2];M=+g[x+(v*12|0)+8>>2];x=h+(v*12|0)|0;F=+g[x>>2];C=+g[x+4>>2];D=+g[h+(v*12|0)+8>>2];E=r*F;K=r*C;I=E*E+K*K;if(I>4.0){K=2.0/+N(+I);T=C*K;U=F*K}else{T=C;U=F}F=r*D;if(F*F>2.4674012660980225){if(F>0.0){V=F}else{V=-F}W=D*(1.5707963705062866/V)}else{W=D}D=+(O+r*U);O=+(L+r*T);x=t;g[x>>2]=D;g[x+4>>2]=O;g[(c[S>>2]|0)+(v*12|0)+8>>2]=M+r*W;M=+U;O=+T;x=(c[R>>2]|0)+(v*12|0)|0;g[x>>2]=M;g[x+4>>2]=O;h=c[R>>2]|0;g[h+(v*12|0)+8>>2]=W;v=v+1|0;}while((v|0)<(c[s>>2]|0))}v=f+16|0;a:do{if((c[v>>2]|0)>0){f=d+16|0;h=0;while(1){x=$d(q)|0;if((c[p>>2]|0)>0){t=0;B=1;while(1){y=c[(c[f>>2]|0)+(t<<2)>>2]|0;A=B&(db[c[(c[y>>2]|0)+36>>2]&7](y,o)|0);y=t+1|0;if((y|0)<(c[p>>2]|0)){B=A;t=y}else{X=A;break}}}else{X=1}t=h+1|0;if(x&X){Y=0;break a}if((t|0)<(c[v>>2]|0)){h=t}else{Y=1;break}}}else{Y=1}}while(0);if((c[s>>2]|0)>0){v=d+8|0;X=0;do{p=c[(c[v>>2]|0)+(X<<2)>>2]|0;o=(c[S>>2]|0)+(X*12|0)|0;h=c[o>>2]|0;f=c[o+4>>2]|0;o=p+44|0;c[o>>2]=h;c[o+4>>2]=f;W=+g[(c[S>>2]|0)+(X*12|0)+8>>2];g[p+56>>2]=W;o=(c[R>>2]|0)+(X*12|0)|0;t=c[o+4>>2]|0;B=p+64|0;c[B>>2]=c[o>>2];c[B+4>>2]=t;g[p+72>>2]=+g[(c[R>>2]|0)+(X*12|0)+8>>2];T=+Q(+W);g[p+20>>2]=T;U=+P(+W);g[p+24>>2]=U;W=+g[p+28>>2];V=+g[p+32>>2];O=(c[k>>2]=h,+g[k>>2])-(U*W-T*V);M=(c[k>>2]=f,+g[k>>2])-(T*W+U*V);V=+O;O=+M;f=p+12|0;g[f>>2]=V;g[f+4>>2]=O;X=X+1|0;}while((X|0)<(c[s>>2]|0))}g[e+20>>2]=+Kc(n);n=c[q+40>>2]|0;e=d+4|0;do{if((c[e>>2]|0)!=0){if((c[u>>2]|0)<=0){break}X=m+16|0;R=0;do{S=c[(c[w>>2]|0)+(R<<2)>>2]|0;v=c[n+(R*152|0)+144>>2]|0;c[X>>2]=v;if((v|0)>0){f=0;do{g[m+(f<<2)>>2]=+g[n+(R*152|0)+(f*36|0)+16>>2];g[m+(f<<2)+8>>2]=+g[n+(R*152|0)+(f*36|0)+20>>2];f=f+1|0;}while((f|0)!=(v|0))}v=c[e>>2]|0;$a[c[(c[v>>2]|0)+20>>2]&3](v,S,m);R=R+1|0;}while((R|0)<(c[u>>2]|0))}}while(0);if(!j){Wd(q);i=l;return}j=c[s>>2]|0;u=(j|0)>0;if(u){m=c[d+8>>2]|0;e=0;O=3.4028234663852886e+38;while(1){n=c[m+(e<<2)>>2]|0;b:do{if((c[n>>2]|0)==0){Z=O}else{do{if(!((b[n+4>>1]&4)==0)){V=+g[n+72>>2];if(V*V>.001218469929881394){break}V=+g[n+64>>2];M=+g[n+68>>2];if(V*V+M*M>9999999747378752.0e-20){break}w=n+144|0;M=r+ +g[w>>2];g[w>>2]=M;Z=O<M?O:M;break b}}while(0);g[n+144>>2]=0.0;Z=0.0}}while(0);n=e+1|0;if((n|0)<(j|0)){e=n;O=Z}else{_=Z;break}}}else{_=3.4028234663852886e+38}if(!(_>=.5)|Y|u^1){Wd(q);i=l;return}u=d+8|0;d=0;do{Y=c[(c[u>>2]|0)+(d<<2)>>2]|0;e=Y+4|0;b[e>>1]=b[e>>1]&65533;g[Y+144>>2]=0.0;e=Y+64|0;c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;c[e+16>>2]=0;c[e+20>>2]=0;d=d+1|0;}while((d|0)<(c[s>>2]|0));Wd(q);i=l;return}function rd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0;f=i;i=i+128|0;h=f;j=f+24|0;k=f+72|0;l=a+28|0;if((c[l>>2]|0)>0){m=a+8|0;n=a+20|0;o=a+24|0;p=0;while(1){q=c[(c[m>>2]|0)+(p<<2)>>2]|0;r=q+44|0;s=c[r+4>>2]|0;t=(c[n>>2]|0)+(p*12|0)|0;c[t>>2]=c[r>>2];c[t+4>>2]=s;g[(c[n>>2]|0)+(p*12|0)+8>>2]=+g[q+56>>2];s=q+64|0;t=c[s+4>>2]|0;r=(c[o>>2]|0)+(p*12|0)|0;c[r>>2]=c[s>>2];c[r+4>>2]=t;t=c[o>>2]|0;g[t+(p*12|0)+8>>2]=+g[q+72>>2];q=p+1|0;if((q|0)<(c[l>>2]|0)){p=q}else{u=n;v=t;break}}}else{u=a+20|0;v=c[a+24>>2]|0}n=j;p=a+12|0;c[j+24>>2]=c[p>>2];o=a+36|0;c[j+28>>2]=c[o>>2];c[j+40>>2]=c[a>>2];m=b;c[n+0>>2]=c[m+0>>2];c[n+4>>2]=c[m+4>>2];c[n+8>>2]=c[m+8>>2];c[n+12>>2]=c[m+12>>2];c[n+16>>2]=c[m+16>>2];c[n+20>>2]=c[m+20>>2];c[j+32>>2]=c[u>>2];m=a+24|0;c[j+36>>2]=v;Vd(k,j);j=b+16|0;a:do{if((c[j>>2]|0)>0){v=0;do{v=v+1|0;if(be(k,d,e)|0){break a}}while((v|0)<(c[j>>2]|0))}}while(0);j=a+8|0;v=(c[u>>2]|0)+(d*12|0)|0;n=c[v+4>>2]|0;t=(c[(c[j>>2]|0)+(d<<2)>>2]|0)+36|0;c[t>>2]=c[v>>2];c[t+4>>2]=n;n=c[u>>2]|0;t=c[j>>2]|0;g[(c[t+(d<<2)>>2]|0)+52>>2]=+g[n+(d*12|0)+8>>2];d=n+(e*12|0)|0;n=c[d+4>>2]|0;v=(c[t+(e<<2)>>2]|0)+36|0;c[v>>2]=c[d>>2];c[v+4>>2]=n;g[(c[(c[j>>2]|0)+(e<<2)>>2]|0)+52>>2]=+g[(c[u>>2]|0)+(e*12|0)+8>>2];Xd(k);e=b+12|0;if((c[e>>2]|0)>0){n=0;do{Zd(k);n=n+1|0;}while((n|0)<(c[e>>2]|0))}w=+g[b>>2];if((c[l>>2]|0)>0){b=0;do{e=c[u>>2]|0;n=e+(b*12|0)|0;v=n;x=+g[v>>2];y=+g[v+4>>2];z=+g[e+(b*12|0)+8>>2];e=c[m>>2]|0;v=e+(b*12|0)|0;A=+g[v>>2];B=+g[v+4>>2];C=+g[e+(b*12|0)+8>>2];D=w*A;E=w*B;F=D*D+E*E;if(F>4.0){E=2.0/+N(+F);G=B*E;H=A*E}else{G=B;H=A}A=w*C;if(A*A>2.4674012660980225){if(A>0.0){I=A}else{I=-A}J=C*(1.5707963705062866/I)}else{J=C}C=x+w*H;x=y+w*G;y=z+w*J;z=+C;A=+x;e=n;g[e>>2]=z;g[e+4>>2]=A;g[(c[u>>2]|0)+(b*12|0)+8>>2]=y;B=+H;E=+G;e=(c[m>>2]|0)+(b*12|0)|0;g[e>>2]=B;g[e+4>>2]=E;g[(c[m>>2]|0)+(b*12|0)+8>>2]=J;e=c[(c[j>>2]|0)+(b<<2)>>2]|0;n=e+44|0;g[n>>2]=z;g[n+4>>2]=A;g[e+56>>2]=y;n=e+64|0;g[n>>2]=B;g[n+4>>2]=E;g[e+72>>2]=J;E=+Q(+y);g[e+20>>2]=E;B=+P(+y);g[e+24>>2]=B;y=+g[e+28>>2];A=+g[e+32>>2];z=+(C-(B*y-E*A));C=+(x-(E*y+B*A));n=e+12|0;g[n>>2]=z;g[n+4>>2]=C;b=b+1|0;}while((b|0)<(c[l>>2]|0))}l=c[k+40>>2]|0;b=a+4|0;if((c[b>>2]|0)==0){Wd(k);i=f;return}if((c[o>>2]|0)<=0){Wd(k);i=f;return}a=h+16|0;j=0;do{m=c[(c[p>>2]|0)+(j<<2)>>2]|0;u=c[l+(j*152|0)+144>>2]|0;c[a>>2]=u;if((u|0)>0){n=0;do{g[h+(n<<2)>>2]=+g[l+(j*152|0)+(n*36|0)+16>>2];g[h+(n<<2)+8>>2]=+g[l+(j*152|0)+(n*36|0)+20>>2];n=n+1|0;}while((n|0)!=(u|0))}u=c[b>>2]|0;$a[c[(c[u>>2]|0)+20>>2]&3](u,m,h);j=j+1|0;}while((j|0)<(c[o>>2]|0));Wd(k);i=f;return}function sd(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0;e=i;f=b;yc(f);Ec(b+68|0);Tc(b+102872|0);h=b+102968|0;c[b+102980>>2]=0;c[b+102984>>2]=0;j=b+102992|0;k=b+102952|0;c[k+0>>2]=0;c[k+4>>2]=0;c[k+8>>2]=0;c[k+12>>2]=0;a[j]=1;a[b+102993|0]=1;a[b+102994|0]=0;a[b+102995|0]=1;a[b+102976|0]=1;j=d;d=c[j+4>>2]|0;k=h;c[k>>2]=c[j>>2];c[k+4>>2]=d;c[b+102868>>2]=4;g[b+102988>>2]=0.0;c[b+102948>>2]=f;f=b+102996|0;c[f+0>>2]=0;c[f+4>>2]=0;c[f+8>>2]=0;c[f+12>>2]=0;c[f+16>>2]=0;c[f+20>>2]=0;c[f+24>>2]=0;c[f+28>>2]=0;i=e;return}function td(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;d=c[a+102952>>2]|0;if((d|0)!=0){e=a;f=d;while(1){d=c[f+96>>2]|0;g=c[f+100>>2]|0;while(1){if((g|0)==0){break}h=c[g+4>>2]|0;c[g+28>>2]=0;ld(g,e);g=h}if((d|0)==0){break}else{f=d}}}Fb(a+102872|0);zc(a);i=b;return}function ud(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;if((c[a+102868>>2]&2|0)!=0){e=0;i=d;return e|0}f=Ac(a,152)|0;if((f|0)==0){g=0}else{h=f;Lc(h,b,a);g=h}c[g+92>>2]=0;h=a+102952|0;c[g+96>>2]=c[h>>2];b=c[h>>2]|0;if((b|0)!=0){c[b+92>>2]=g}c[h>>2]=g;h=a+102960|0;c[h>>2]=(c[h>>2]|0)+1;e=g;i=d;return e|0}function vd(f,h){f=f|0;h=h|0;var j=0,k=0,l=0;j=i;k=f+102976|0;if((h&1|0)==(d[k]|0|0)){i=j;return}a[k]=h&1;if(h){i=j;return}h=c[f+102952>>2]|0;if((h|0)==0){i=j;return}else{l=h}do{h=l+4|0;f=e[h>>1]|0;if((f&2|0)==0){b[h>>1]=f|2;g[l+144>>2]=0.0}l=c[l+96>>2]|0;}while((l|0)!=0);i=j;return}function wd(d,f){d=d|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0.0,_=0,$=0;h=i;i=i+96|0;j=h;k=h+56|0;l=h+88|0;m=d+103008|0;g[m>>2]=0.0;n=d+103012|0;g[n>>2]=0.0;o=d+103016|0;g[o>>2]=0.0;p=d+102960|0;q=d+102872|0;r=d+68|0;od(j,c[p>>2]|0,c[d+102936>>2]|0,c[d+102964>>2]|0,r,c[d+102944>>2]|0);s=d+102952|0;t=c[s>>2]|0;if((t|0)!=0){u=t;do{t=u+4|0;b[t>>1]=b[t>>1]&65534;u=c[u+96>>2]|0;}while((u|0)!=0)}u=c[d+102932>>2]|0;if((u|0)!=0){t=u;do{u=t+4|0;c[u>>2]=c[u>>2]&-2;t=c[t+12>>2]|0;}while((t|0)!=0)}t=c[d+102956>>2]|0;if((t|0)!=0){u=t;do{a[u+60|0]=0;u=c[u+12>>2]|0;}while((u|0)!=0)}u=Gc(r,c[p>>2]<<2)|0;p=u;t=c[s>>2]|0;if((t|0)!=0){v=j+28|0;w=j+36|0;x=j+32|0;y=j+8|0;z=j+16|0;A=j+12|0;B=d+102968|0;C=d+102976|0;D=k+12|0;E=k+16|0;F=k+20|0;G=t;do{t=G+4|0;H=b[t>>1]|0;do{if((H&35)==34){if((c[G>>2]|0)==0){break}c[v>>2]=0;c[w>>2]=0;c[x>>2]=0;c[p>>2]=G;b[t>>1]=H&65535|1;I=0;J=1;while(1){K=J+ -1|0;L=c[p+(K<<2)>>2]|0;c[L+8>>2]=I;M=c[v>>2]|0;c[(c[y>>2]|0)+(M<<2)>>2]=L;c[v>>2]=M+1;M=L+4|0;N=e[M>>1]|0;if((N&2|0)==0){b[M>>1]=N|2;g[L+144>>2]=0.0}do{if((c[L>>2]|0)==0){O=K}else{N=c[L+112>>2]|0;if((N|0)==0){P=K}else{M=N;N=K;while(1){Q=c[M+4>>2]|0;R=Q+4|0;do{if((c[R>>2]&7|0)==6){if((a[(c[Q+48>>2]|0)+38|0]|0)!=0){S=N;break}if((a[(c[Q+52>>2]|0)+38|0]|0)!=0){S=N;break}T=c[w>>2]|0;c[w>>2]=T+1;c[(c[A>>2]|0)+(T<<2)>>2]=Q;c[R>>2]=c[R>>2]|1;T=c[M>>2]|0;U=T+4|0;V=b[U>>1]|0;if(!((V&1)==0)){S=N;break}c[p+(N<<2)>>2]=T;b[U>>1]=V&65535|1;S=N+1|0}else{S=N}}while(0);R=c[M+12>>2]|0;if((R|0)==0){P=S;break}else{M=R;N=S}}}N=c[L+108>>2]|0;if((N|0)==0){O=P;break}else{W=N;X=P}while(1){N=W+4|0;M=c[N>>2]|0;do{if((a[M+60|0]|0)==0){R=c[W>>2]|0;Q=R+4|0;V=b[Q>>1]|0;if((V&32)==0){Y=X;break}U=c[x>>2]|0;c[x>>2]=U+1;c[(c[z>>2]|0)+(U<<2)>>2]=M;a[(c[N>>2]|0)+60|0]=1;if(!((V&1)==0)){Y=X;break}c[p+(X<<2)>>2]=R;b[Q>>1]=V&65535|1;Y=X+1|0}else{Y=X}}while(0);N=c[W+12>>2]|0;if((N|0)==0){O=Y;break}else{W=N;X=Y}}}}while(0);if((O|0)<=0){break}I=c[v>>2]|0;J=O}qd(j,k,f,B,(a[C]|0)!=0);g[m>>2]=+g[D>>2]+ +g[m>>2];g[n>>2]=+g[E>>2]+ +g[n>>2];g[o>>2]=+g[F>>2]+ +g[o>>2];J=c[v>>2]|0;if((J|0)<=0){break}I=c[y>>2]|0;L=0;do{K=c[I+(L<<2)>>2]|0;if((c[K>>2]|0)==0){N=K+4|0;b[N>>1]=b[N>>1]&65534}L=L+1|0;}while((L|0)<(J|0))}}while(0);G=c[G+96>>2]|0;}while((G|0)!=0)}Hc(r,u);u=c[s>>2]|0;if((u|0)==0){Wc(q);Z=+Kc(l);_=d+103020|0;g[_>>2]=Z;pd(j);i=h;return}else{$=u}do{do{if(!((b[$+4>>1]&1)==0)){if((c[$>>2]|0)==0){break}Nc($)}}while(0);$=c[$+96>>2]|0;}while(($|0)!=0);Wc(q);Z=+Kc(l);_=d+103020|0;g[_>>2]=Z;pd(j);i=h;return}



function xd(d,f){d=d|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0.0,ca=0,da=0,ea=0.0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0.0,pa=0.0,qa=0.0,ra=0,sa=0.0,ta=0.0,ua=0.0,va=0,wa=0.0,xa=0,ya=0,za=0,Aa=0.0,Ba=0.0,Ca=0.0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,$a=0;h=i;i=i+352|0;j=h;k=h+56|0;l=h+192|0;m=h+200|0;n=h+240|0;o=h+280|0;p=h+288|0;q=h+328|0;r=d+102872|0;s=d+102944|0;od(j,64,32,0,d+68|0,c[s>>2]|0);t=d+102995|0;do{if((a[t]|0)==0){u=d+102932|0}else{v=c[d+102952>>2]|0;if((v|0)!=0){w=v;do{v=w+4|0;b[v>>1]=b[v>>1]&65534;g[w+60>>2]=0.0;w=c[w+96>>2]|0;}while((w|0)!=0)}w=d+102932|0;v=c[w>>2]|0;if((v|0)==0){u=w;break}else{x=v}while(1){v=x+4|0;c[v>>2]=c[v>>2]&-34;c[x+128>>2]=0;g[x+132>>2]=1.0;v=c[x+12>>2]|0;if((v|0)==0){u=w;break}else{x=v}}}}while(0);x=m;m=n;n=j+28|0;w=j+36|0;v=j+32|0;y=j+8|0;z=j+12|0;A=o;B=o+4|0;C=j+40|0;D=j+44|0;E=p;p=f;F=q;G=q+4|0;H=q+8|0;I=q+16|0;J=f+12|0;f=q+12|0;K=q+20|0;L=d+102994|0;d=k+16|0;M=k+20|0;N=k+24|0;O=k+44|0;R=k+48|0;S=k+52|0;T=k;U=k+28|0;V=k+56|0;W=k+92|0;X=k+128|0;Y=l;Z=l+4|0;while(1){_=c[u>>2]|0;if((_|0)==0){$=28;break}else{aa=_;ba=1.0;ca=0}while(1){_=aa+4|0;da=c[_>>2]|0;do{if((da&4|0)==0){ea=ba;fa=ca}else{if((c[aa+128>>2]|0)>8){ea=ba;fa=ca;break}if((da&32|0)==0){ga=c[aa+48>>2]|0;ha=c[aa+52>>2]|0;if((a[ga+38|0]|0)!=0){ea=ba;fa=ca;break}if((a[ha+38|0]|0)!=0){ea=ba;fa=ca;break}ia=c[ga+8>>2]|0;ja=c[ha+8>>2]|0;ka=c[ia>>2]|0;la=c[ja>>2]|0;ma=b[ia+4>>1]|0;na=b[ja+4>>1]|0;if(!((ma&2)!=0&(ka|0)!=0|(na&2)!=0&(la|0)!=0)){ea=ba;fa=ca;break}if(!((ma&8)!=0|(ka|0)!=2|((na&8)!=0|(la|0)!=2))){ea=ba;fa=ca;break}la=ia+28|0;na=ia+60|0;oa=+g[na>>2];ka=ja+28|0;ma=ja+60|0;pa=+g[ma>>2];do{if(oa<pa){qa=(pa-oa)/(1.0-oa);ra=ia+36|0;sa=1.0-qa;ta=+(+g[ra>>2]*sa+qa*+g[ia+44>>2]);ua=+(sa*+g[ia+40>>2]+qa*+g[ia+48>>2]);va=ra;g[va>>2]=ta;g[va+4>>2]=ua;va=ia+52|0;g[va>>2]=sa*+g[va>>2]+qa*+g[ia+56>>2];g[na>>2]=pa;wa=pa}else{if(!(pa<oa)){wa=oa;break}qa=(oa-pa)/(1.0-pa);va=ja+36|0;sa=1.0-qa;ua=+(+g[va>>2]*sa+qa*+g[ja+44>>2]);ta=+(sa*+g[ja+40>>2]+qa*+g[ja+48>>2]);ra=va;g[ra>>2]=ua;g[ra+4>>2]=ta;ra=ja+52|0;g[ra>>2]=sa*+g[ra>>2]+qa*+g[ja+56>>2];g[ma>>2]=oa;wa=oa}}while(0);ma=c[aa+56>>2]|0;ja=c[aa+60>>2]|0;c[d>>2]=0;c[M>>2]=0;g[N>>2]=0.0;c[O>>2]=0;c[R>>2]=0;g[S>>2]=0.0;Vb(T,c[ga+12>>2]|0,ma);Vb(U,c[ha+12>>2]|0,ja);xa=V+0|0;ya=la+0|0;za=xa+36|0;do{c[xa>>2]=c[ya>>2];xa=xa+4|0;ya=ya+4|0}while((xa|0)<(za|0));xa=W+0|0;ya=ka+0|0;za=xa+36|0;do{c[xa>>2]=c[ya>>2];xa=xa+4|0;ya=ya+4|0}while((xa|0)<(za|0));g[X>>2]=1.0;fc(l,k);if((c[Y>>2]|0)==3){oa=wa+(1.0-wa)*+g[Z>>2];Aa=oa<1.0?oa:1.0}else{Aa=1.0}g[aa+132>>2]=Aa;c[_>>2]=c[_>>2]|32;Ba=Aa}else{Ba=+g[aa+132>>2]}if(!(Ba<ba)){ea=ba;fa=ca;break}ea=Ba;fa=aa}}while(0);_=c[aa+12>>2]|0;if((_|0)==0){break}else{aa=_;ba=ea;ca=fa}}if((fa|0)==0|ea>.9999988079071045){$=28;break}_=c[(c[fa+48>>2]|0)+8>>2]|0;da=c[(c[fa+52>>2]|0)+8>>2]|0;ka=_+28|0;xa=x+0|0;ya=ka+0|0;za=xa+36|0;do{c[xa>>2]=c[ya>>2];xa=xa+4|0;ya=ya+4|0}while((xa|0)<(za|0));la=da+28|0;xa=m+0|0;ya=la+0|0;za=xa+36|0;do{c[xa>>2]=c[ya>>2];xa=xa+4|0;ya=ya+4|0}while((xa|0)<(za|0));ha=_+60|0;oa=+g[ha>>2];pa=(ea-oa)/(1.0-oa);ga=_+36|0;oa=1.0-pa;ja=_+44|0;ma=_+48|0;qa=+g[ga>>2]*oa+pa*+g[ja>>2];sa=oa*+g[_+40>>2]+pa*+g[ma>>2];ta=+qa;ua=+sa;na=ga;g[na>>2]=ta;g[na+4>>2]=ua;na=_+52|0;ga=_+56|0;Ca=oa*+g[na>>2]+pa*+g[ga>>2];g[na>>2]=Ca;g[ha>>2]=ea;ha=_+44|0;g[ha>>2]=ta;g[ha+4>>2]=ua;g[ga>>2]=Ca;ua=+Q(+Ca);ha=_+20|0;g[ha>>2]=ua;ta=+P(+Ca);na=_+24|0;g[na>>2]=ta;ia=_+28|0;Ca=+g[ia>>2];ra=_+32|0;pa=+g[ra>>2];va=_+12|0;oa=+(qa-(ta*Ca-ua*pa));qa=+(sa-(ua*Ca+ta*pa));Da=va;g[Da>>2]=oa;g[Da+4>>2]=qa;Da=da+60|0;qa=+g[Da>>2];oa=(ea-qa)/(1.0-qa);Ea=da+36|0;qa=1.0-oa;Fa=da+44|0;Ga=da+48|0;pa=+g[Ea>>2]*qa+oa*+g[Fa>>2];ta=qa*+g[da+40>>2]+oa*+g[Ga>>2];Ca=+pa;ua=+ta;Ha=Ea;g[Ha>>2]=Ca;g[Ha+4>>2]=ua;Ha=da+52|0;Ea=da+56|0;sa=qa*+g[Ha>>2]+oa*+g[Ea>>2];g[Ha>>2]=sa;g[Da>>2]=ea;Da=da+44|0;g[Da>>2]=Ca;g[Da+4>>2]=ua;g[Ea>>2]=sa;ua=+Q(+sa);Da=da+20|0;g[Da>>2]=ua;Ca=+P(+sa);Ha=da+24|0;g[Ha>>2]=Ca;Ia=da+28|0;sa=+g[Ia>>2];Ja=da+32|0;oa=+g[Ja>>2];Ka=da+12|0;qa=+(pa-(Ca*sa-ua*oa));pa=+(ta-(ua*sa+Ca*oa));La=Ka;g[La>>2]=qa;g[La+4>>2]=pa;Sd(fa,c[s>>2]|0);La=fa+4|0;Ma=c[La>>2]|0;c[La>>2]=Ma&-33;Na=fa+128|0;c[Na>>2]=(c[Na>>2]|0)+1;if((Ma&6|0)!=6){c[La>>2]=Ma&-37;xa=ka+0|0;ya=x+0|0;za=xa+36|0;do{c[xa>>2]=c[ya>>2];xa=xa+4|0;ya=ya+4|0}while((xa|0)<(za|0));xa=la+0|0;ya=m+0|0;za=xa+36|0;do{c[xa>>2]=c[ya>>2];xa=xa+4|0;ya=ya+4|0}while((xa|0)<(za|0));pa=+g[ga>>2];qa=+Q(+pa);g[ha>>2]=qa;oa=+P(+pa);g[na>>2]=oa;pa=+g[ia>>2];Ca=+g[ra>>2];sa=+(+g[ja>>2]-(oa*pa-qa*Ca));ua=+(+g[ma>>2]-(qa*pa+oa*Ca));la=va;g[la>>2]=sa;g[la+4>>2]=ua;ua=+g[Ea>>2];sa=+Q(+ua);g[Da>>2]=sa;Ca=+P(+ua);g[Ha>>2]=Ca;ua=+g[Ia>>2];oa=+g[Ja>>2];pa=+(+g[Fa>>2]-(Ca*ua-sa*oa));qa=+(+g[Ga>>2]-(sa*ua+Ca*oa));la=Ka;g[la>>2]=pa;g[la+4>>2]=qa;continue}la=_+4|0;ka=b[la>>1]|0;Ma=ka&65535;if((Ma&2|0)==0){Na=(Ma|2)&65535;b[la>>1]=Na;g[_+144>>2]=0.0;Oa=Na}else{Oa=ka}ka=da+4|0;Na=e[ka>>1]|0;if((Na&2|0)==0){b[ka>>1]=Na|2;g[da+144>>2]=0.0;Pa=b[la>>1]|0}else{Pa=Oa}c[n>>2]=0;c[w>>2]=0;c[v>>2]=0;Na=_+8|0;c[Na>>2]=0;Ma=c[n>>2]|0;c[(c[y>>2]|0)+(Ma<<2)>>2]=_;Qa=Ma+1|0;c[n>>2]=Qa;Ma=da+8|0;c[Ma>>2]=Qa;Qa=c[n>>2]|0;c[(c[y>>2]|0)+(Qa<<2)>>2]=da;c[n>>2]=Qa+1;Qa=c[w>>2]|0;c[w>>2]=Qa+1;c[(c[z>>2]|0)+(Qa<<2)>>2]=fa;b[la>>1]=Pa&65535|1;b[ka>>1]=e[ka>>1]|1;c[La>>2]=c[La>>2]|1;c[A>>2]=_;c[B>>2]=da;ka=_;la=1;while(1){a:do{if((c[ka>>2]|0)==2){Qa=c[ka+112>>2]|0;if((Qa|0)==0){break}Ra=ka+4|0;Sa=Qa;do{if((c[n>>2]|0)==(c[C>>2]|0)){break a}if((c[w>>2]|0)==(c[D>>2]|0)){break a}Qa=c[Sa+4>>2]|0;Ta=Qa+4|0;b:do{if((c[Ta>>2]&1|0)==0){Ua=c[Sa>>2]|0;Va=Ua;do{if((c[Va>>2]|0)==2){if(!((b[Ra>>1]&8)==0)){break}if((b[Ua+4>>1]&8)==0){break b}}}while(0);if((a[(c[Qa+48>>2]|0)+38|0]|0)!=0){break}if((a[(c[Qa+52>>2]|0)+38|0]|0)!=0){break}Wa=Ua+28|0;xa=E+0|0;ya=Wa+0|0;za=xa+36|0;do{c[xa>>2]=c[ya>>2];xa=xa+4|0;ya=ya+4|0}while((xa|0)<(za|0));Xa=Ua+4|0;if((b[Xa>>1]&1)==0){Ya=Ua+60|0;qa=+g[Ya>>2];pa=(ea-qa)/(1.0-qa);Za=Ua+36|0;qa=1.0-pa;oa=+g[Za>>2]*qa+pa*+g[Ua+44>>2];Ca=qa*+g[Ua+40>>2]+pa*+g[Ua+48>>2];ua=+oa;sa=+Ca;_a=Za;g[_a>>2]=ua;g[_a+4>>2]=sa;_a=Ua+52|0;Za=Ua+56|0;ta=qa*+g[_a>>2]+pa*+g[Za>>2];g[_a>>2]=ta;g[Ya>>2]=ea;Ya=Ua+44|0;g[Ya>>2]=ua;g[Ya+4>>2]=sa;g[Za>>2]=ta;sa=+Q(+ta);g[Ua+20>>2]=sa;ua=+P(+ta);g[Ua+24>>2]=ua;ta=+g[Ua+28>>2];pa=+g[Ua+32>>2];qa=+(oa-(ua*ta-sa*pa));oa=+(Ca-(sa*ta+ua*pa));Za=Ua+12|0;g[Za>>2]=qa;g[Za+4>>2]=oa}Sd(Qa,c[s>>2]|0);Za=c[Ta>>2]|0;if((Za&4|0)==0){xa=Wa+0|0;ya=E+0|0;za=xa+36|0;do{c[xa>>2]=c[ya>>2];xa=xa+4|0;ya=ya+4|0}while((xa|0)<(za|0));oa=+g[Ua+56>>2];qa=+Q(+oa);g[Ua+20>>2]=qa;pa=+P(+oa);g[Ua+24>>2]=pa;oa=+g[Ua+28>>2];ua=+g[Ua+32>>2];ta=+(+g[Ua+44>>2]-(pa*oa-qa*ua));sa=+(+g[Ua+48>>2]-(qa*oa+pa*ua));Ya=Ua+12|0;g[Ya>>2]=ta;g[Ya+4>>2]=sa;break}if((Za&2|0)==0){xa=Wa+0|0;ya=E+0|0;za=xa+36|0;do{c[xa>>2]=c[ya>>2];xa=xa+4|0;ya=ya+4|0}while((xa|0)<(za|0));sa=+g[Ua+56>>2];ta=+Q(+sa);g[Ua+20>>2]=ta;ua=+P(+sa);g[Ua+24>>2]=ua;sa=+g[Ua+28>>2];pa=+g[Ua+32>>2];oa=+(+g[Ua+44>>2]-(ua*sa-ta*pa));qa=+(+g[Ua+48>>2]-(ta*sa+ua*pa));Wa=Ua+12|0;g[Wa>>2]=oa;g[Wa+4>>2]=qa;break}c[Ta>>2]=Za|1;Wa=c[w>>2]|0;c[w>>2]=Wa+1;c[(c[z>>2]|0)+(Wa<<2)>>2]=Qa;Wa=e[Xa>>1]|0;if((Wa&1|0)!=0){break}b[Xa>>1]=Wa|1;do{if((c[Va>>2]|0)!=0){if((Wa&2|0)!=0){break}b[Xa>>1]=Wa|3;g[Ua+144>>2]=0.0}}while(0);c[Ua+8>>2]=c[n>>2];Wa=c[n>>2]|0;c[(c[y>>2]|0)+(Wa<<2)>>2]=Ua;c[n>>2]=Wa+1}}while(0);Sa=c[Sa+12>>2]|0;}while((Sa|0)!=0)}}while(0);if((la|0)>=2){break}ka=c[o+(la<<2)>>2]|0;la=la+1|0}qa=(1.0-ea)*+g[p>>2];g[F>>2]=qa;g[G>>2]=1.0/qa;g[H>>2]=1.0;c[I>>2]=20;c[f>>2]=c[J>>2];a[K]=0;rd(j,q,c[Na>>2]|0,c[Ma>>2]|0);la=c[n>>2]|0;if((la|0)>0){ka=la;la=0;while(1){_=c[(c[y>>2]|0)+(la<<2)>>2]|0;da=_+4|0;b[da>>1]=b[da>>1]&65534;if((c[_>>2]|0)==2){Nc(_);da=c[_+112>>2]|0;if((da|0)!=0){_=da;do{da=(c[_+4>>2]|0)+4|0;c[da>>2]=c[da>>2]&-34;_=c[_+12>>2]|0;}while((_|0)!=0)}$a=c[n>>2]|0}else{$a=ka}_=la+1|0;if((_|0)<($a|0)){ka=$a;la=_}else{break}}}Wc(r);if((a[L]|0)!=0){$=68;break}}if(($|0)==28){a[t]=1;pd(j);i=h;return}else if(($|0)==68){a[t]=0;pd(j);i=h;return}}function yd(b,d,e,f){b=b|0;d=+d;e=e|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0,t=0.0,u=0,v=0;h=i;i=i+56|0;j=h;k=h+8|0;l=h+40|0;m=h+48|0;n=b+102868|0;o=c[n>>2]|0;if((o&1|0)==0){p=o}else{Wc(b+102872|0);o=c[n>>2]&-2;c[n>>2]=o;p=o}c[n>>2]=p|2;p=k;g[p>>2]=d;c[k+12>>2]=e;c[k+16>>2]=f;if(d>0.0){g[k+4>>2]=1.0/d}else{g[k+4>>2]=0.0}f=b+102988|0;g[k+8>>2]=+g[f>>2]*d;a[k+20|0]=a[b+102992|0]|0;Vc(b+102872|0);g[b+103e3>>2]=+Kc(h+32|0);do{if((a[b+102995|0]|0)!=0){if(!(+g[p>>2]>0.0)){break}wd(b,k);g[b+103004>>2]=+Kc(l)}}while(0);do{if((a[b+102993|0]|0)==0){q=12}else{d=+g[p>>2];if(!(d>0.0)){r=d;break}xd(b,k);g[b+103024>>2]=+Kc(m);q=12}}while(0);if((q|0)==12){r=+g[p>>2]}if(r>0.0){g[f>>2]=+g[k+4>>2]}k=c[n>>2]|0;if((k&4|0)==0){s=k&-3;c[n>>2]=s;t=+Kc(j);u=b+102996|0;g[u>>2]=t;i=h;return}f=c[b+102952>>2]|0;if((f|0)==0){s=k&-3;c[n>>2]=s;t=+Kc(j);u=b+102996|0;g[u>>2]=t;i=h;return}else{v=f}do{g[v+76>>2]=0.0;g[v+80>>2]=0.0;g[v+84>>2]=0.0;v=c[v+96>>2]|0;}while((v|0)!=0);s=k&-3;c[n>>2]=s;t=+Kc(j);u=b+102996|0;g[u>>2]=t;i=h;return}function zd(a,c,d){a=a|0;c=c|0;d=d|0;var e=0,f=0;a=i;e=b[c+36>>1]|0;if(!(e<<16>>16!=(b[d+36>>1]|0)|e<<16>>16==0)){f=e<<16>>16>0;i=a;return f|0}if((b[d+32>>1]&b[c+34>>1])<<16>>16==0){f=0;i=a;return f|0}f=(b[d+34>>1]&b[c+32>>1])<<16>>16!=0;i=a;return f|0}function Ad(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0;g=i;h=Ac(f,144)|0;if((h|0)==0){j=0;k=j;i=g;return k|0}Rd(h,a,b,d,e);c[h>>2]=1184;j=h;k=j;i=g;return k|0}function Bd(a,b){a=a|0;b=b|0;var d=0;d=i;Ya[c[(c[a>>2]|0)+4>>2]&31](a);Bc(b,a,144);i=d;return}function Cd(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0;h=i;i=i+48|0;j=h;k=c[(c[a+48>>2]|0)+12>>2]|0;c[j>>2]=176;c[j+4>>2]=1;g[j+8>>2]=.009999999776482582;l=j+28|0;c[l+0>>2]=0;c[l+4>>2]=0;c[l+8>>2]=0;c[l+12>>2]=0;b[l+16>>1]=0;jc(k,j,c[a+56>>2]|0);Lb(d,j,e,c[(c[a+52>>2]|0)+12>>2]|0,f);i=h;return}function Dd(a){a=a|0;i=i;return}function Ed(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function Fd(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0;g=i;h=Ac(f,144)|0;if((h|0)==0){j=0;k=j;i=g;return k|0}Rd(h,a,b,d,e);c[h>>2]=1280;j=h;k=j;i=g;return k|0}function Gd(a,b){a=a|0;b=b|0;var d=0;d=i;Ya[c[(c[a>>2]|0)+4>>2]&31](a);Bc(b,a,144);i=d;return}function Hd(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0;h=i;i=i+48|0;j=h;k=c[(c[a+48>>2]|0)+12>>2]|0;c[j>>2]=176;c[j+4>>2]=1;g[j+8>>2]=.009999999776482582;l=j+28|0;c[l+0>>2]=0;c[l+4>>2]=0;c[l+8>>2]=0;c[l+12>>2]=0;b[l+16>>1]=0;jc(k,j,c[a+56>>2]|0);Ob(d,j,e,c[(c[a+52>>2]|0)+12>>2]|0,f);i=h;return}function Id(a){a=a|0;i=i;return}function Jd(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function Kd(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=i;b=Ac(f,144)|0;if((b|0)==0){g=0;h=g;i=e;return h|0}Rd(b,a,0,d,0);c[b>>2]=1352;g=b;h=g;i=e;return h|0}function Ld(a,b){a=a|0;b=b|0;var d=0;d=i;Ya[c[(c[a>>2]|0)+4>>2]&31](a);Bc(b,a,144);i=d;return}function Md(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=i;Jb(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function Nd(a){a=a|0;i=i;return}function Od(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function Pd(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0;h=i;if((a[1600]|0)==0){c[352]=3;c[1412>>2]=3;a[1416|0]=1;c[1504>>2]=4;c[1508>>2]=4;a[1512|0]=1;c[1432>>2]=4;c[1436>>2]=4;a[1440|0]=0;c[1528>>2]=5;c[1532>>2]=5;a[1536|0]=1;c[1456>>2]=6;c[1460>>2]=6;a[1464|0]=1;c[1420>>2]=6;c[1424>>2]=6;a[1428|0]=0;c[1480>>2]=7;c[1484>>2]=7;a[1488|0]=1;c[1516>>2]=7;c[1520>>2]=7;a[1524|0]=0;c[1552>>2]=8;c[1556>>2]=8;a[1560|0]=1;c[1444>>2]=8;c[1448>>2]=8;a[1452|0]=0;c[1576>>2]=9;c[1580>>2]=9;a[1584|0]=1;c[1540>>2]=9;c[1544>>2]=9;a[1548|0]=0;a[1600]=1}j=c[(c[b+12>>2]|0)+4>>2]|0;k=c[(c[e+12>>2]|0)+4>>2]|0;l=c[1408+(j*48|0)+(k*12|0)>>2]|0;if((l|0)==0){m=0;i=h;return m|0}if((a[1408+(j*48|0)+(k*12|0)+8|0]|0)==0){m=eb[l&15](e,f,b,d,g)|0;i=h;return m|0}else{m=eb[l&15](b,d,e,f,g)|0;i=h;return m|0}return 0}function Qd(a,d){a=a|0;d=d|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0;f=i;h=c[a+48>>2]|0;do{if((c[a+124>>2]|0)>0){j=c[h+8>>2]|0;k=j+4|0;l=e[k>>1]|0;if((l&2|0)==0){b[k>>1]=l|2;g[j+144>>2]=0.0}j=c[a+52>>2]|0;l=c[j+8>>2]|0;k=l+4|0;m=e[k>>1]|0;if((m&2|0)!=0){n=j;break}b[k>>1]=m|2;g[l+144>>2]=0.0;n=j}else{n=c[a+52>>2]|0}}while(0);Za[c[1408+((c[(c[h+12>>2]|0)+4>>2]|0)*48|0)+((c[(c[n+12>>2]|0)+4>>2]|0)*12|0)+4>>2]&15](a,d);i=f;return}function Rd(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0.0,l=0.0;h=i;c[a>>2]=1616;c[a+4>>2]=4;c[a+48>>2]=b;c[a+52>>2]=e;c[a+56>>2]=d;c[a+60>>2]=f;c[a+124>>2]=0;c[a+128>>2]=0;f=b+16|0;d=a+8|0;j=d+40|0;do{c[d>>2]=0;d=d+4|0}while((d|0)<(j|0));g[a+136>>2]=+N(+(+g[f>>2]*+g[e+16>>2]));k=+g[b+20>>2];l=+g[e+20>>2];g[a+140>>2]=k>l?k:l;i=h;return}function Sd(d,f){d=d|0;f=f|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;h=i;i=i+64|0;j=h;k=d+64|0;l=j+0|0;m=k+0|0;n=l+64|0;do{c[l>>2]=c[m>>2];l=l+4|0;m=m+4|0}while((l|0)<(n|0));m=d+4|0;l=c[m>>2]|0;c[m>>2]=l|4;n=l>>>1;l=c[d+48>>2]|0;o=c[d+52>>2]|0;p=(a[o+38|0]|a[l+38|0])<<24>>24!=0;q=c[l+8>>2]|0;r=c[o+8>>2]|0;s=q+12|0;t=r+12|0;do{if(p){u=Ub(c[l+12>>2]|0,c[d+56>>2]|0,c[o+12>>2]|0,c[d+60>>2]|0,s,t)|0;c[d+124>>2]=0;v=n&1;w=u}else{fb[c[c[d>>2]>>2]&15](d,k,s,t);u=d+124|0;x=(c[u>>2]|0)>0;a:do{if(x){y=c[j+60>>2]|0;if((y|0)>0){z=0}else{A=0;while(1){g[d+(A*20|0)+72>>2]=0.0;g[d+(A*20|0)+76>>2]=0.0;A=A+1|0;if((A|0)>=(c[u>>2]|0)){break a}}}do{A=d+(z*20|0)+72|0;g[A>>2]=0.0;B=d+(z*20|0)+76|0;g[B>>2]=0.0;C=c[d+(z*20|0)+80>>2]|0;D=0;while(1){E=D+1|0;if((c[j+(D*20|0)+16>>2]|0)==(C|0)){F=7;break}if((E|0)<(y|0)){D=E}else{break}}if((F|0)==7){F=0;g[A>>2]=+g[j+(D*20|0)+8>>2];g[B>>2]=+g[j+(D*20|0)+12>>2]}z=z+1|0;}while((z|0)<(c[u>>2]|0))}}while(0);u=n&1;if(!(x^(u|0)!=0)){v=u;w=x;break}y=q+4|0;C=e[y>>1]|0;if((C&2|0)==0){b[y>>1]=C|2;g[q+144>>2]=0.0}C=r+4|0;y=e[C>>1]|0;if((y&2|0)!=0){v=u;w=x;break}b[C>>1]=y|2;g[r+144>>2]=0.0;v=u;w=x}}while(0);r=c[m>>2]|0;c[m>>2]=w?r|2:r&-3;r=(v|0)==0;v=w^1;m=(f|0)==0;if(!(r^1|v|m)){Za[c[(c[f>>2]|0)+8>>2]&15](f,d)}if(!(r|w|m)){Za[c[(c[f>>2]|0)+12>>2]&15](f,d)}if(p|v|m){i=h;return}$a[c[(c[f>>2]|0)+16>>2]&3](f,d,j);i=h;return}function Td(a){a=a|0;i=i;return}function Ud(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function Vd(b,d){b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0.0,s=0.0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;e=i;f=b;h=d;c[f+0>>2]=c[h+0>>2];c[f+4>>2]=c[h+4>>2];c[f+8>>2]=c[h+8>>2];c[f+12>>2]=c[h+12>>2];c[f+16>>2]=c[h+16>>2];c[f+20>>2]=c[h+20>>2];h=c[d+40>>2]|0;f=b+32|0;c[f>>2]=h;j=c[d+28>>2]|0;k=b+48|0;c[k>>2]=j;l=b+36|0;c[l>>2]=Gc(h,j*88|0)|0;j=Gc(c[f>>2]|0,(c[k>>2]|0)*152|0)|0;f=b+40|0;c[f>>2]=j;c[b+24>>2]=c[d+32>>2];c[b+28>>2]=c[d+36>>2];h=c[d+24>>2]|0;d=b+44|0;c[d>>2]=h;if((c[k>>2]|0)<=0){i=e;return}m=b+20|0;n=b+8|0;b=j;j=h;h=0;while(1){o=c[j+(h<<2)>>2]|0;p=c[o+48>>2]|0;q=c[o+52>>2]|0;r=+g[(c[p+12>>2]|0)+8>>2];s=+g[(c[q+12>>2]|0)+8>>2];t=c[p+8>>2]|0;p=c[q+8>>2]|0;q=c[o+124>>2]|0;g[b+(h*152|0)+136>>2]=+g[o+136>>2];g[b+(h*152|0)+140>>2]=+g[o+140>>2];u=t+8|0;c[b+(h*152|0)+112>>2]=c[u>>2];v=p+8|0;c[b+(h*152|0)+116>>2]=c[v>>2];w=t+120|0;g[b+(h*152|0)+120>>2]=+g[w>>2];x=p+120|0;g[b+(h*152|0)+124>>2]=+g[x>>2];y=t+128|0;g[b+(h*152|0)+128>>2]=+g[y>>2];z=p+128|0;g[b+(h*152|0)+132>>2]=+g[z>>2];c[b+(h*152|0)+148>>2]=h;c[b+(h*152|0)+144>>2]=q;A=b+(h*152|0)+80|0;c[A+0>>2]=0;c[A+4>>2]=0;c[A+8>>2]=0;c[A+12>>2]=0;c[A+16>>2]=0;c[A+20>>2]=0;c[A+24>>2]=0;c[A+28>>2]=0;A=c[l>>2]|0;c[A+(h*88|0)+32>>2]=c[u>>2];c[A+(h*88|0)+36>>2]=c[v>>2];g[A+(h*88|0)+40>>2]=+g[w>>2];g[A+(h*88|0)+44>>2]=+g[x>>2];x=t+28|0;t=c[x+4>>2]|0;w=A+(h*88|0)+48|0;c[w>>2]=c[x>>2];c[w+4>>2]=t;t=p+28|0;p=c[t+4>>2]|0;w=A+(h*88|0)+56|0;c[w>>2]=c[t>>2];c[w+4>>2]=p;g[A+(h*88|0)+64>>2]=+g[y>>2];g[A+(h*88|0)+68>>2]=+g[z>>2];z=o+104|0;y=c[z+4>>2]|0;p=A+(h*88|0)+16|0;c[p>>2]=c[z>>2];c[p+4>>2]=y;y=o+112|0;p=c[y+4>>2]|0;z=A+(h*88|0)+24|0;c[z>>2]=c[y>>2];c[z+4>>2]=p;c[A+(h*88|0)+84>>2]=q;g[A+(h*88|0)+76>>2]=r;g[A+(h*88|0)+80>>2]=s;c[A+(h*88|0)+72>>2]=c[o+120>>2];if((q|0)>0){p=0;do{if((a[m]|0)==0){g[b+(h*152|0)+(p*36|0)+16>>2]=0.0;g[b+(h*152|0)+(p*36|0)+20>>2]=0.0}else{g[b+(h*152|0)+(p*36|0)+16>>2]=+g[n>>2]*+g[o+(p*20|0)+72>>2];g[b+(h*152|0)+(p*36|0)+20>>2]=+g[n>>2]*+g[o+(p*20|0)+76>>2]}g[b+(h*152|0)+(p*36|0)+24>>2]=0.0;g[b+(h*152|0)+(p*36|0)+28>>2]=0.0;g[b+(h*152|0)+(p*36|0)+32>>2]=0.0;z=o+(p*20|0)+64|0;y=A+(h*88|0)+(p<<3)|0;w=b+(h*152|0)+(p*36|0)|0;c[w+0>>2]=0;c[w+4>>2]=0;c[w+8>>2]=0;c[w+12>>2]=0;w=z;z=c[w+4>>2]|0;t=y;c[t>>2]=c[w>>2];c[t+4>>2]=z;p=p+1|0;}while((p|0)!=(q|0))}q=h+1|0;if((q|0)>=(c[k>>2]|0)){break}b=c[f>>2]|0;j=c[d>>2]|0;h=q}i=e;return}function Wd(a){a=a|0;var b=0,d=0;b=i;d=a+32|0;Hc(c[d>>2]|0,c[a+40>>2]|0);Hc(c[d>>2]|0,c[a+36>>2]|0);i=b;return}function Xd(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0.0,y=0.0,z=0,A=0,B=0,C=0.0,D=0.0,E=0.0,F=0.0,G=0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ba=0.0,ca=0,da=0,ea=0,fa=0,ga=0.0,ha=0.0,ia=0.0;b=i;i=i+56|0;d=b;e=b+16|0;f=b+32|0;h=a+48|0;if((c[h>>2]|0)<=0){i=b;return}j=a+40|0;k=a+36|0;l=a+44|0;m=a+24|0;n=a+28|0;a=d+8|0;o=d+12|0;p=e+8|0;q=e+12|0;r=d;s=e;t=f;u=0;do{v=c[j>>2]|0;w=c[k>>2]|0;x=+g[w+(u*88|0)+76>>2];y=+g[w+(u*88|0)+80>>2];z=(c[(c[l>>2]|0)+(c[v+(u*152|0)+148>>2]<<2)>>2]|0)+64|0;A=c[v+(u*152|0)+112>>2]|0;B=c[v+(u*152|0)+116>>2]|0;C=+g[v+(u*152|0)+120>>2];D=+g[v+(u*152|0)+124>>2];E=+g[v+(u*152|0)+128>>2];F=+g[v+(u*152|0)+132>>2];G=w+(u*88|0)+48|0;H=+g[G>>2];I=+g[G+4>>2];G=w+(u*88|0)+56|0;J=+g[G>>2];K=+g[G+4>>2];G=c[m>>2]|0;w=G+(A*12|0)|0;L=+g[w>>2];M=+g[w+4>>2];N=+g[G+(A*12|0)+8>>2];w=c[n>>2]|0;O=w+(A*12|0)|0;R=+g[O>>2];S=+g[O+4>>2];T=+g[w+(A*12|0)+8>>2];A=G+(B*12|0)|0;U=+g[A>>2];V=+g[A+4>>2];W=+g[G+(B*12|0)+8>>2];G=w+(B*12|0)|0;X=+g[G>>2];Y=+g[G+4>>2];Z=+g[w+(B*12|0)+8>>2];_=+Q(+N);g[a>>2]=_;$=+P(+N);g[o>>2]=$;N=+Q(+W);g[p>>2]=N;aa=+P(+W);g[q>>2]=aa;W=+(L-(H*$-I*_));ba=+(M-(I*$+H*_));B=r;g[B>>2]=W;g[B+4>>2]=ba;ba=+(U-(J*aa-K*N));W=+(V-(K*aa+J*N));B=s;g[B>>2]=ba;g[B+4>>2]=W;Sb(f,z,d,x,e,y);z=v+(u*152|0)+72|0;B=t;w=c[B+4>>2]|0;G=z;c[G>>2]=c[B>>2];c[G+4>>2]=w;w=v+(u*152|0)+144|0;G=c[w>>2]|0;do{if((G|0)>0){B=v+(u*152|0)+76|0;A=z;y=C+D;O=v+(u*152|0)+140|0;ca=0;do{da=f+(ca<<3)+8|0;x=+g[da>>2]-L;ea=f+(ca<<3)+12|0;W=+x;ba=+(+g[ea>>2]-M);fa=v+(u*152|0)+(ca*36|0)|0;g[fa>>2]=W;g[fa+4>>2]=ba;ba=+g[da>>2]-U;W=+ba;N=+(+g[ea>>2]-V);ea=v+(u*152|0)+(ca*36|0)+8|0;g[ea>>2]=W;g[ea+4>>2]=N;N=+g[B>>2];W=+g[v+(u*152|0)+(ca*36|0)+4>>2];J=+g[A>>2];aa=x*N-W*J;K=+g[v+(u*152|0)+(ca*36|0)+12>>2];_=N*ba-J*K;J=y+aa*E*aa+_*F*_;if(J>0.0){ga=1.0/J}else{ga=0.0}g[v+(u*152|0)+(ca*36|0)+24>>2]=ga;J=+g[B>>2];_=-+g[A>>2];aa=x*_-J*W;N=ba*_-J*K;J=y+aa*E*aa+N*F*N;if(J>0.0){ha=1.0/J}else{ha=0.0}g[v+(u*152|0)+(ca*36|0)+28>>2]=ha;ea=v+(u*152|0)+(ca*36|0)+32|0;g[ea>>2]=0.0;J=+g[A>>2]*(X-Z*K-R+T*W)+ +g[B>>2]*(Y+Z*ba-S-T*x);if(J<-1.0){g[ea>>2]=-(J*+g[O>>2])}ca=ca+1|0;}while((ca|0)!=(G|0));if((c[w>>2]|0)!=2){break}y=+g[v+(u*152|0)+76>>2];J=+g[z>>2];x=+g[v+(u*152|0)>>2]*y- +g[v+(u*152|0)+4>>2]*J;ba=y*+g[v+(u*152|0)+8>>2]-J*+g[v+(u*152|0)+12>>2];W=y*+g[v+(u*152|0)+36>>2]-J*+g[v+(u*152|0)+40>>2];K=y*+g[v+(u*152|0)+44>>2]-J*+g[v+(u*152|0)+48>>2];J=C+D;y=E*x;N=F*ba;aa=J+x*y+ba*N;ba=J+W*E*W+K*F*K;x=J+y*W+N*K;K=aa*ba-x*x;if(!(aa*aa<K*1.0e3)){c[w>>2]=1;break}g[v+(u*152|0)+96>>2]=aa;g[v+(u*152|0)+100>>2]=x;g[v+(u*152|0)+104>>2]=x;g[v+(u*152|0)+108>>2]=ba;if(K!=0.0){ia=1.0/K}else{ia=K}K=-(ia*x);g[v+(u*152|0)+80>>2]=ba*ia;g[v+(u*152|0)+84>>2]=K;g[v+(u*152|0)+88>>2]=K;g[v+(u*152|0)+92>>2]=aa*ia}}while(0);u=u+1|0;}while((u|0)<(c[h>>2]|0));i=b;return}function Yd(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0.0,n=0.0,o=0.0,p=0.0,q=0,r=0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0,P=0.0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0;b=i;d=a+48|0;if((c[d>>2]|0)<=0){i=b;return}e=a+40|0;f=a+28|0;a=c[f>>2]|0;h=0;do{j=c[e>>2]|0;k=c[j+(h*152|0)+112>>2]|0;l=c[j+(h*152|0)+116>>2]|0;m=+g[j+(h*152|0)+120>>2];n=+g[j+(h*152|0)+128>>2];o=+g[j+(h*152|0)+124>>2];p=+g[j+(h*152|0)+132>>2];q=c[j+(h*152|0)+144>>2]|0;r=a+(k*12|0)|0;s=r;t=+g[s>>2];u=+g[s+4>>2];v=+g[a+(k*12|0)+8>>2];s=a+(l*12|0)|0;w=+g[s>>2];x=+g[s+4>>2];y=+g[a+(l*12|0)+8>>2];s=j+(h*152|0)+72|0;z=+g[s>>2];A=+g[s+4>>2];if((q|0)>0){B=w;C=x;D=t;E=u;s=0;F=v;G=y;while(1){H=+g[j+(h*152|0)+(s*36|0)+16>>2];I=+g[j+(h*152|0)+(s*36|0)+20>>2];J=z*H+A*I;K=A*H-z*I;I=F-n*(+g[j+(h*152|0)+(s*36|0)>>2]*K- +g[j+(h*152|0)+(s*36|0)+4>>2]*J);H=D-m*J;L=E-m*K;M=G+p*(K*+g[j+(h*152|0)+(s*36|0)+8>>2]-J*+g[j+(h*152|0)+(s*36|0)+12>>2]);N=B+o*J;J=C+o*K;O=s+1|0;if((O|0)==(q|0)){P=L;Q=J;R=N;S=H;T=I;U=M;break}else{G=M;F=I;s=O;E=L;D=H;C=J;B=N}}}else{P=u;Q=x;R=w;S=t;T=v;U=y}B=+S;C=+P;s=r;g[s>>2]=B;g[s+4>>2]=C;s=c[f>>2]|0;g[s+(k*12|0)+8>>2]=T;C=+R;B=+Q;q=s+(l*12|0)|0;g[q>>2]=C;g[q+4>>2]=B;a=c[f>>2]|0;g[a+(l*12|0)+8>>2]=U;h=h+1|0;}while((h|0)<(c[d>>2]|0));i=b;return}function Zd(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0,u=0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0,aa=0.0,ba=0.0,ca=0.0,da=0.0,ea=0.0,fa=0.0,ga=0.0,ha=0.0,ia=0.0,ja=0.0,ka=0.0;b=i;d=a+48|0;if((c[d>>2]|0)<=0){i=b;return}e=a+40|0;f=a+28|0;a=c[f>>2]|0;h=0;do{j=c[e>>2]|0;k=j+(h*152|0)|0;l=c[j+(h*152|0)+112>>2]|0;m=c[j+(h*152|0)+116>>2]|0;n=+g[j+(h*152|0)+120>>2];o=+g[j+(h*152|0)+128>>2];p=+g[j+(h*152|0)+124>>2];q=+g[j+(h*152|0)+132>>2];r=j+(h*152|0)+144|0;s=c[r>>2]|0;t=a+(l*12|0)|0;u=t;v=+g[u>>2];w=+g[u+4>>2];x=+g[a+(l*12|0)+8>>2];u=a+(m*12|0)|0;y=+g[u>>2];z=+g[u+4>>2];A=+g[a+(m*12|0)+8>>2];u=j+(h*152|0)+72|0;B=+g[u>>2];C=+g[u+4>>2];D=-B;E=+g[j+(h*152|0)+136>>2];do{if((s|0)>0){F=y;G=z;H=v;I=w;u=0;J=x;K=A;do{L=+g[j+(h*152|0)+(u*36|0)+12>>2];M=+g[j+(h*152|0)+(u*36|0)+8>>2];N=+g[j+(h*152|0)+(u*36|0)+4>>2];O=+g[j+(h*152|0)+(u*36|0)>>2];P=E*+g[j+(h*152|0)+(u*36|0)+16>>2];Q=j+(h*152|0)+(u*36|0)+20|0;R=+g[Q>>2];S=R- +g[j+(h*152|0)+(u*36|0)+28>>2]*(C*(F-K*L-H+J*N)+(G+K*M-I-J*O)*D);T=-P;U=S<P?S:P;P=U<T?T:U;U=P-R;g[Q>>2]=P;P=C*U;R=U*D;H=H-n*P;I=I-n*R;J=J-o*(O*R-N*P);F=F+p*P;G=G+p*R;K=K+q*(M*R-L*P);u=u+1|0;}while((u|0)!=(s|0));if((c[r>>2]|0)!=1){V=I;W=H;X=G;Y=F;Z=J;_=K;$=7;break}P=+g[j+(h*152|0)+12>>2];L=+g[j+(h*152|0)+8>>2];R=+g[j+(h*152|0)+4>>2];M=+g[k>>2];u=j+(h*152|0)+16|0;N=+g[u>>2];O=N- +g[j+(h*152|0)+24>>2]*(B*(F-K*P-H+J*R)+C*(G+K*L-I-J*M)- +g[j+(h*152|0)+32>>2]);U=O>0.0?O:0.0;O=U-N;g[u>>2]=U;U=B*O;N=C*O;aa=I-n*N;ba=H-n*U;ca=G+p*N;da=F+p*U;ea=J-o*(M*N-R*U);fa=K+q*(L*N-P*U)}else{V=w;W=v;X=z;Y=y;Z=x;_=A;$=7}}while(0);a:do{if(($|0)==7){$=0;r=j+(h*152|0)+16|0;A=+g[r>>2];s=j+(h*152|0)+52|0;x=+g[s>>2];y=+g[j+(h*152|0)+12>>2];z=+g[j+(h*152|0)+8>>2];v=+g[j+(h*152|0)+4>>2];w=+g[k>>2];D=+g[j+(h*152|0)+48>>2];E=+g[j+(h*152|0)+44>>2];U=+g[j+(h*152|0)+40>>2];P=+g[j+(h*152|0)+36>>2];N=+g[j+(h*152|0)+104>>2];L=+g[j+(h*152|0)+100>>2];R=B*(Y-_*y-W+Z*v)+C*(X+_*z-V-Z*w)- +g[j+(h*152|0)+32>>2]-(A*+g[j+(h*152|0)+96>>2]+x*N);M=B*(Y-_*D-W+Z*U)+C*(X+_*E-V-Z*P)- +g[j+(h*152|0)+68>>2]-(A*L+x*+g[j+(h*152|0)+108>>2]);O=+g[j+(h*152|0)+80>>2]*R+ +g[j+(h*152|0)+88>>2]*M;T=R*+g[j+(h*152|0)+84>>2]+M*+g[j+(h*152|0)+92>>2];S=-O;ga=-T;if(!(!(O<=-0.0)|!(T<=-0.0))){T=S-A;O=ga-x;ha=B*T;ia=C*T;T=B*O;ja=C*O;O=ha+T;ka=ia+ja;g[r>>2]=S;g[s>>2]=ga;aa=V-n*ka;ba=W-n*O;ca=X+p*ka;da=Y+p*O;ea=Z-o*(w*ia-v*ha+(P*ja-U*T));fa=_+q*(z*ia-y*ha+(E*ja-D*T));break}T=R*+g[j+(h*152|0)+24>>2];ja=-T;do{if(T<=-0.0){if(!(M+L*ja>=0.0)){break}ha=ja-A;ia=0.0-x;O=B*ha;ka=C*ha;ha=B*ia;ga=C*ia;ia=ha+O;S=ga+ka;g[r>>2]=ja;g[s>>2]=0.0;aa=V-n*S;ba=W-n*ia;ca=X+p*S;da=Y+p*ia;ea=Z-o*(ka*w-O*v+(ga*P-ha*U));fa=_+q*(ka*z-O*y+(ga*E-ha*D));break a}}while(0);ja=M*+g[j+(h*152|0)+60>>2];L=-ja;do{if(ja<=-0.0){if(!(R+N*L>=0.0)){break}T=0.0-A;K=L-x;J=B*T;F=C*T;T=B*K;G=C*K;K=J+T;H=F+G;g[r>>2]=0.0;g[s>>2]=L;aa=V-n*H;ba=W-n*K;ca=X+p*H;da=Y+p*K;ea=Z-o*(F*w-J*v+(G*P-T*U));fa=_+q*(F*z-J*y+(G*E-T*D));break a}}while(0);if(!(R>=0.0)|!(M>=0.0)){aa=V;ba=W;ca=X;da=Y;ea=Z;fa=_;break}L=0.0-A;N=0.0-x;ja=B*L;T=C*L;L=B*N;G=C*N;N=ja+L;J=T+G;g[r>>2]=0.0;g[s>>2]=0.0;aa=V-n*J;ba=W-n*N;ca=X+p*J;da=Y+p*N;ea=Z-o*(T*w-ja*v+(G*P-L*U));fa=_+q*(T*z-ja*y+(G*E-L*D))}}while(0);q=+ba;o=+aa;j=t;g[j>>2]=q;g[j+4>>2]=o;j=c[f>>2]|0;g[j+(l*12|0)+8>>2]=ea;o=+da;q=+ca;k=j+(m*12|0)|0;g[k>>2]=o;g[k+4>>2]=q;a=c[f>>2]|0;g[a+(m*12|0)+8>>2]=fa;h=h+1|0;}while((h|0)<(c[d>>2]|0));i=b;return}function _d(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,k=0;b=i;d=c[a+48>>2]|0;if((d|0)<=0){i=b;return}e=c[a+40>>2]|0;f=c[a+44>>2]|0;a=0;do{h=c[f+(c[e+(a*152|0)+148>>2]<<2)>>2]|0;j=c[e+(a*152|0)+144>>2]|0;if((j|0)>0){k=0;do{g[h+(k*20|0)+72>>2]=+g[e+(a*152|0)+(k*36|0)+16>>2];g[h+(k*20|0)+76>>2]=+g[e+(a*152|0)+(k*36|0)+20>>2];k=k+1|0;}while((k|0)<(j|0))}a=a+1|0;}while((a|0)<(d|0));i=b;return}function $d(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0.0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0.0,y=0,z=0,A=0,B=0,C=0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ba=0.0,ca=0.0,da=0.0,ea=0.0,fa=0,ga=0.0,ha=0.0,ia=0.0,ja=0.0,ka=0.0,la=0.0,ma=0.0,na=0.0,oa=0.0,pa=0,qa=0.0,ra=0.0,sa=0.0;b=i;i=i+56|0;d=b;e=b+16|0;f=b+32|0;h=a+48|0;if((c[h>>2]|0)<=0){j=0.0;k=j>=-.014999999664723873;i=b;return k|0}l=a+36|0;m=a+24|0;a=d+8|0;n=d+12|0;o=e+8|0;p=e+12|0;q=d;r=e;s=f;t=f+8|0;u=f+16|0;v=c[m>>2]|0;w=0;x=0.0;while(1){y=c[l>>2]|0;z=y+(w*88|0)|0;A=c[y+(w*88|0)+32>>2]|0;B=c[y+(w*88|0)+36>>2]|0;C=y+(w*88|0)+48|0;D=+g[C>>2];E=+g[C+4>>2];F=+g[y+(w*88|0)+40>>2];G=+g[y+(w*88|0)+64>>2];C=y+(w*88|0)+56|0;H=+g[C>>2];I=+g[C+4>>2];J=+g[y+(w*88|0)+44>>2];K=+g[y+(w*88|0)+68>>2];C=c[y+(w*88|0)+84>>2]|0;y=v+(A*12|0)|0;L=+g[y>>2];M=+g[y+4>>2];N=+g[v+(A*12|0)+8>>2];y=v+(B*12|0)|0;O=+g[y>>2];R=+g[y+4>>2];S=+g[v+(B*12|0)+8>>2];if((C|0)>0){T=F+J;U=O;V=R;W=L;X=M;Y=N;Z=S;y=0;_=x;do{$=+Q(+Y);g[a>>2]=$;aa=+P(+Y);g[n>>2]=aa;ba=+Q(+Z);g[o>>2]=ba;ca=+P(+Z);g[p>>2]=ca;da=+(W-(D*aa-E*$));ea=+(X-(E*aa+D*$));fa=q;g[fa>>2]=da;g[fa+4>>2]=ea;ea=+(U-(H*ca-I*ba));da=+(V-(I*ca+H*ba));fa=r;g[fa>>2]=ea;g[fa+4>>2]=da;ae(f,z,d,e,y);fa=s;da=+g[fa>>2];ea=+g[fa+4>>2];fa=t;ba=+g[fa>>2];ca=+g[fa+4>>2];$=+g[u>>2];aa=ba-W;ga=ca-X;ha=ba-U;ba=ca-V;_=_<$?_:$;ca=($+.004999999888241291)*.20000000298023224;$=ca<0.0?ca:0.0;ca=ea*aa-da*ga;ia=ea*ha-da*ba;ja=ia*K*ia+(T+ca*G*ca);if(ja>0.0){ka=-($<-.20000000298023224?-.20000000298023224:$)/ja}else{ka=0.0}ja=da*ka;da=ea*ka;W=W-F*ja;X=X-F*da;Y=Y-G*(aa*da-ga*ja);U=U+J*ja;V=V+J*da;Z=Z+K*(ha*da-ba*ja);y=y+1|0;}while((y|0)!=(C|0));la=X;ma=W;na=V;oa=U;pa=c[m>>2]|0;qa=Y;ra=Z;sa=_}else{la=M;ma=L;na=R;oa=O;pa=v;qa=N;ra=S;sa=x}K=+ma;J=+la;C=pa+(A*12|0)|0;g[C>>2]=K;g[C+4>>2]=J;C=c[m>>2]|0;g[C+(A*12|0)+8>>2]=qa;J=+oa;K=+na;y=C+(B*12|0)|0;g[y>>2]=J;g[y+4>>2]=K;y=c[m>>2]|0;g[y+(B*12|0)+8>>2]=ra;C=w+1|0;if((C|0)<(c[h>>2]|0)){v=y;w=C;x=sa}else{j=sa;break}}k=j>=-.014999999664723873;i=b;return k|0}function ae(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0.0,m=0.0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0;h=i;j=c[b+72>>2]|0;if((j|0)==1){k=d+12|0;l=+g[k>>2];m=+g[b+16>>2];n=d+8|0;o=+g[n>>2];p=+g[b+20>>2];q=l*m-o*p;r=m*o+l*p;p=+q;l=+r;s=a;g[s>>2]=p;g[s+4>>2]=l;l=+g[k>>2];p=+g[b+24>>2];o=+g[n>>2];m=+g[b+28>>2];t=+g[e+12>>2];u=+g[b+(f<<3)>>2];v=+g[e+8>>2];w=+g[b+(f<<3)+4>>2];x=+g[e>>2]+(t*u-v*w);y=u*v+t*w+ +g[e+4>>2];g[a+16>>2]=q*(x-(+g[d>>2]+(l*p-o*m)))+(y-(p*o+l*m+ +g[d+4>>2]))*r- +g[b+76>>2]- +g[b+80>>2];r=+x;x=+y;n=a+8|0;g[n>>2]=r;g[n+4>>2]=x;i=h;return}else if((j|0)==0){x=+g[d+12>>2];r=+g[b+24>>2];y=+g[d+8>>2];m=+g[b+28>>2];l=+g[d>>2]+(x*r-y*m);o=r*y+x*m+ +g[d+4>>2];m=+g[e+12>>2];x=+g[b>>2];y=+g[e+8>>2];r=+g[b+4>>2];p=+g[e>>2]+(m*x-y*r);q=x*y+m*r+ +g[e+4>>2];r=p-l;m=q-o;y=+r;x=+m;n=a;g[n>>2]=y;g[n+4>>2]=x;x=+N(+(r*r+m*m));if(x<1.1920928955078125e-7){z=m;A=r}else{y=1.0/x;x=r*y;g[a>>2]=x;w=m*y;g[a+4>>2]=w;z=w;A=x}x=+((l+p)*.5);p=+((o+q)*.5);n=a+8|0;g[n>>2]=x;g[n+4>>2]=p;g[a+16>>2]=r*A+m*z- +g[b+76>>2]- +g[b+80>>2];i=h;return}else if((j|0)==2){j=e+12|0;z=+g[j>>2];m=+g[b+16>>2];n=e+8|0;A=+g[n>>2];r=+g[b+20>>2];p=z*m-A*r;x=m*A+z*r;k=a;r=+p;z=+x;s=k;g[s>>2]=r;g[s+4>>2]=z;z=+g[j>>2];r=+g[b+24>>2];A=+g[n>>2];m=+g[b+28>>2];q=+g[d+12>>2];o=+g[b+(f<<3)>>2];l=+g[d+8>>2];w=+g[b+(f<<3)+4>>2];y=+g[d>>2]+(q*o-l*w);t=o*l+q*w+ +g[d+4>>2];g[a+16>>2]=p*(y-(+g[e>>2]+(z*r-A*m)))+(t-(r*A+z*m+ +g[e+4>>2]))*x- +g[b+76>>2]- +g[b+80>>2];m=+y;y=+t;b=a+8|0;g[b>>2]=m;g[b+4>>2]=y;y=+-p;p=+-x;b=k;g[b>>2]=y;g[b+4>>2]=p;i=h;return}else{i=h;return}}function be(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0.0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0.0,z=0,A=0,B=0,C=0,D=0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0,N=0.0,O=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ba=0.0,ca=0.0,da=0.0,ea=0.0,fa=0.0,ga=0.0,ha=0,ia=0.0,ja=0.0,ka=0.0,la=0.0,ma=0.0,na=0.0,oa=0.0,pa=0.0,qa=0.0,ra=0,sa=0.0,ta=0.0,ua=0.0;e=i;i=i+56|0;f=e;h=e+16|0;j=e+32|0;k=a+48|0;if((c[k>>2]|0)<=0){l=0.0;m=l>=-.007499999832361937;i=e;return m|0}n=a+36|0;o=a+24|0;a=f+8|0;p=f+12|0;q=h+8|0;r=h+12|0;s=f;t=h;u=j;v=j+8|0;w=j+16|0;x=0;y=0.0;while(1){z=c[n>>2]|0;A=z+(x*88|0)|0;B=c[z+(x*88|0)+32>>2]|0;C=c[z+(x*88|0)+36>>2]|0;D=z+(x*88|0)+48|0;E=+g[D>>2];F=+g[D+4>>2];D=z+(x*88|0)+56|0;G=+g[D>>2];H=+g[D+4>>2];D=c[z+(x*88|0)+84>>2]|0;if((B|0)==(b|0)|(B|0)==(d|0)){I=+g[z+(x*88|0)+64>>2];J=+g[z+(x*88|0)+40>>2]}else{I=0.0;J=0.0}K=+g[z+(x*88|0)+44>>2];L=+g[z+(x*88|0)+68>>2];z=c[o>>2]|0;M=z+(B*12|0)|0;N=+g[M>>2];O=+g[M+4>>2];R=+g[z+(B*12|0)+8>>2];M=z+(C*12|0)|0;S=+g[M>>2];T=+g[M+4>>2];U=+g[z+(C*12|0)+8>>2];if((D|0)>0){V=J+K;W=S;X=T;Y=N;Z=O;_=R;$=U;M=0;aa=y;do{ba=+Q(+_);g[a>>2]=ba;ca=+P(+_);g[p>>2]=ca;da=+Q(+$);g[q>>2]=da;ea=+P(+$);g[r>>2]=ea;fa=+(Y-(E*ca-F*ba));ga=+(Z-(F*ca+E*ba));ha=s;g[ha>>2]=fa;g[ha+4>>2]=ga;ga=+(W-(G*ea-H*da));fa=+(X-(H*ea+G*da));ha=t;g[ha>>2]=ga;g[ha+4>>2]=fa;ae(j,A,f,h,M);ha=u;fa=+g[ha>>2];ga=+g[ha+4>>2];ha=v;da=+g[ha>>2];ea=+g[ha+4>>2];ba=+g[w>>2];ca=da-Y;ia=ea-Z;ja=da-W;da=ea-X;aa=aa<ba?aa:ba;ea=(ba+.004999999888241291)*.75;ba=ea<0.0?ea:0.0;ea=ga*ca-fa*ia;ka=ga*ja-fa*da;la=ka*L*ka+(V+ea*I*ea);if(la>0.0){ma=-(ba<-.20000000298023224?-.20000000298023224:ba)/la}else{ma=0.0}la=fa*ma;fa=ga*ma;Y=Y-J*la;Z=Z-J*fa;_=_-I*(ca*fa-ia*la);W=W+K*la;X=X+K*fa;$=$+L*(ja*fa-da*la);M=M+1|0;}while((M|0)!=(D|0));na=Z;oa=Y;pa=X;qa=W;ra=c[o>>2]|0;sa=_;ta=$;ua=aa}else{na=O;oa=N;pa=T;qa=S;ra=z;sa=R;ta=U;ua=y}L=+oa;K=+na;D=ra+(B*12|0)|0;g[D>>2]=L;g[D+4>>2]=K;D=c[o>>2]|0;g[D+(B*12|0)+8>>2]=sa;K=+qa;L=+pa;M=D+(C*12|0)|0;g[M>>2]=K;g[M+4>>2]=L;g[(c[o>>2]|0)+(C*12|0)+8>>2]=ta;M=x+1|0;if((M|0)<(c[k>>2]|0)){x=M;y=ua}else{l=ua;break}}m=l>=-.007499999832361937;i=e;return m|0}function ce(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=i;b=Ac(f,144)|0;if((b|0)==0){g=0;h=g;i=e;return h|0}Rd(b,a,0,d,0);c[b>>2]=1640;g=b;h=g;i=e;return h|0}function de(a,b){a=a|0;b=b|0;var d=0;d=i;Ya[c[(c[a>>2]|0)+4>>2]&31](a);Bc(b,a,144);i=d;return}function ee(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=i;Lb(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function fe(a){a=a|0;i=i;return}function ge(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function he(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=i;b=Ac(f,144)|0;if((b|0)==0){g=0;h=g;i=e;return h|0}Rd(b,a,0,d,0);c[b>>2]=1712;g=b;h=g;i=e;return h|0}function ie(a,b){a=a|0;b=b|0;var d=0;d=i;Ya[c[(c[a>>2]|0)+4>>2]&31](a);Bc(b,a,144);i=d;return}function je(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=i;Ob(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function ke(a){a=a|0;i=i;return}function le(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function me(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=i;b=Ac(f,144)|0;if((b|0)==0){g=0;h=g;i=e;return h|0}Rd(b,a,0,d,0);c[b>>2]=1784;g=b;h=g;i=e;return h|0}function ne(a,b){a=a|0;b=b|0;var d=0;d=i;Ya[c[(c[a>>2]|0)+4>>2]&31](a);Bc(b,a,144);i=d;return}function oe(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=i;Kb(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function pe(a){a=a|0;i=i;return}function qe(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function re(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;e=i;b=Ac(f,144)|0;if((b|0)==0){g=0;h=g;i=e;return h|0}Rd(b,a,0,d,0);c[b>>2]=1856;g=b;h=g;i=e;return h|0}function se(a,b){a=a|0;b=b|0;var d=0;d=i;Ya[c[(c[a>>2]|0)+4>>2]&31](a);Bc(b,a,144);i=d;return}function te(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=i;Pb(b,c[(c[a+48>>2]|0)+12>>2]|0,d,c[(c[a+52>>2]|0)+12>>2]|0,e);i=f;return}function ue(a){a=a|0;i=i;return}function ve(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function we(a){a=a|0;i=i;return}function xe(a){a=a|0;i=i;return}function ye(a){a=a|0;i=i;return}function ze(a){a=a|0;i=i;return}function Ae(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function Be(a){a=a|0;var b=0;b=i;Me(a);i=b;return}function Ce(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+56|0;f=e;if((a|0)==(b|0)){g=1;i=e;return g|0}if((b|0)==0){g=0;i=e;return g|0}h=Fe(b,1976,2032,0)|0;b=h;if((h|0)==0){g=0;i=e;return g|0}j=f+0|0;k=j+56|0;do{c[j>>2]=0;j=j+4|0}while((j|0)<(k|0));c[f>>2]=b;c[f+8>>2]=a;c[f+12>>2]=-1;c[f+48>>2]=1;fb[c[(c[h>>2]|0)+28>>2]&15](b,f,c[d>>2]|0,1);if((c[f+24>>2]|0)!=1){g=0;i=e;return g|0}c[d>>2]=c[f+16>>2];g=1;i=e;return g|0}function De(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=i;if((c[d+8>>2]|0)!=(b|0)){i=g;return}b=d+16|0;h=c[b>>2]|0;if((h|0)==0){c[b>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;i=g;return}if((h|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;i=g;return}e=d+24|0;if((c[e>>2]|0)!=2){i=g;return}c[e>>2]=f;i=g;return}function Ee(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=i;if((b|0)!=(c[d+8>>2]|0)){h=c[b+8>>2]|0;fb[c[(c[h>>2]|0)+28>>2]&15](h,d,e,f);i=g;return}h=d+16|0;b=c[h>>2]|0;if((b|0)==0){c[h>>2]=e;c[d+24>>2]=f;c[d+36>>2]=1;i=g;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;c[d+24>>2]=2;a[d+54|0]=1;i=g;return}e=d+24|0;if((c[e>>2]|0)!=2){i=g;return}c[e>>2]=f;i=g;return}function Fe(d,e,f,g){d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;h=i;i=i+56|0;j=h;k=c[d>>2]|0;l=d+(c[k+ -8>>2]|0)|0;m=c[k+ -4>>2]|0;k=m;c[j>>2]=f;c[j+4>>2]=d;c[j+8>>2]=e;c[j+12>>2]=g;g=j+16|0;e=j+20|0;d=j+24|0;n=j+28|0;o=j+32|0;p=j+40|0;q=(m|0)==(f|0);f=g;r=f+0|0;s=r+36|0;do{c[r>>2]=0;r=r+4|0}while((r|0)<(s|0));b[f+36>>1]=0;a[f+38|0]=0;if(q){c[j+48>>2]=1;cb[c[(c[m>>2]|0)+20>>2]&3](k,j,l,l,1,0);t=(c[d>>2]|0)==1?l:0;i=h;return t|0}Xa[c[(c[m>>2]|0)+24>>2]&3](k,j,l,1,0);l=c[j+36>>2]|0;if((l|0)==1){do{if((c[d>>2]|0)!=1){if((c[p>>2]|0)!=0){t=0;i=h;return t|0}if((c[n>>2]|0)!=1){t=0;i=h;return t|0}if((c[o>>2]|0)==1){break}else{t=0}i=h;return t|0}}while(0);t=c[g>>2]|0;i=h;return t|0}else if((l|0)==0){if((c[p>>2]|0)!=1){t=0;i=h;return t|0}if((c[n>>2]|0)!=1){t=0;i=h;return t|0}t=(c[o>>2]|0)==1?c[e>>2]|0:0;i=h;return t|0}else{t=0;i=h;return t|0}return 0}function Ge(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;h=i;j=b;if((j|0)==(c[d+8>>2]|0)){if((c[d+4>>2]|0)!=(e|0)){i=h;return}k=d+28|0;if((c[k>>2]|0)==1){i=h;return}c[k>>2]=f;i=h;return}if((j|0)!=(c[d>>2]|0)){j=c[b+8>>2]|0;Xa[c[(c[j>>2]|0)+24>>2]&3](j,d,e,f,g);i=h;return}do{if((c[d+16>>2]|0)!=(e|0)){j=d+20|0;if((c[j>>2]|0)==(e|0)){break}c[d+32>>2]=f;k=d+44|0;if((c[k>>2]|0)==4){i=h;return}l=d+52|0;a[l]=0;m=d+53|0;a[m]=0;n=c[b+8>>2]|0;cb[c[(c[n>>2]|0)+20>>2]&3](n,d,e,e,1,g);if((a[m]|0)==0){o=0;p=13}else{if((a[l]|0)==0){o=1;p=13}}a:do{if((p|0)==13){c[j>>2]=e;l=d+40|0;c[l>>2]=(c[l>>2]|0)+1;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){p=16;break}a[d+54|0]=1;if(o){break a}}else{p=16}}while(0);if((p|0)==16){if(o){break}}c[k>>2]=4;i=h;return}}while(0);c[k>>2]=3;i=h;return}}while(0);if((f|0)!=1){i=h;return}c[d+32>>2]=1;i=h;return}function He(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0;g=i;if((c[d+8>>2]|0)==(b|0)){if((c[d+4>>2]|0)!=(e|0)){i=g;return}h=d+28|0;if((c[h>>2]|0)==1){i=g;return}c[h>>2]=f;i=g;return}if((c[d>>2]|0)!=(b|0)){i=g;return}do{if((c[d+16>>2]|0)!=(e|0)){b=d+20|0;if((c[b>>2]|0)==(e|0)){break}c[d+32>>2]=f;c[b>>2]=e;b=d+40|0;c[b>>2]=(c[b>>2]|0)+1;do{if((c[d+36>>2]|0)==1){if((c[d+24>>2]|0)!=2){break}a[d+54|0]=1}}while(0);c[d+44>>2]=4;i=g;return}}while(0);if((f|0)!=1){i=g;return}c[d+32>>2]=1;i=g;return}function Ie(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0;j=i;if((b|0)!=(c[d+8>>2]|0)){k=c[b+8>>2]|0;cb[c[(c[k>>2]|0)+20>>2]&3](k,d,e,f,g,h);i=j;return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){i=j;return}a[d+52|0]=1;f=d+16|0;h=c[f>>2]|0;if((h|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){i=j;return}a[d+54|0]=1;i=j;return}if((h|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;i=j;return}e=d+24|0;h=c[e>>2]|0;if((h|0)==2){c[e>>2]=g;l=g}else{l=h}if(!((c[d+48>>2]|0)==1&(l|0)==1)){i=j;return}a[d+54|0]=1;i=j;return}function Je(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0;h=i;if((c[d+8>>2]|0)!=(b|0)){i=h;return}a[d+53|0]=1;if((c[d+4>>2]|0)!=(f|0)){i=h;return}a[d+52|0]=1;f=d+16|0;b=c[f>>2]|0;if((b|0)==0){c[f>>2]=e;c[d+24>>2]=g;c[d+36>>2]=1;if(!((c[d+48>>2]|0)==1&(g|0)==1)){i=h;return}a[d+54|0]=1;i=h;return}if((b|0)!=(e|0)){e=d+36|0;c[e>>2]=(c[e>>2]|0)+1;a[d+54|0]=1;i=h;return}e=d+24|0;b=c[e>>2]|0;if((b|0)==2){c[e>>2]=g;j=g}else{j=b}if(!((c[d+48>>2]|0)==1&(j|0)==1)){i=h;return}a[d+54|0]=1;i=h;return}function Ke(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,za=0,Aa=0,Ba=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,Ma=0,Na=0,Pa=0,Ra=0,Sa=0;b=i;do{if(a>>>0<245){if(a>>>0<11){d=16}else{d=a+11&-8}e=d>>>3;f=c[546]|0;g=f>>>e;if((g&3|0)!=0){h=(g&1^1)+e|0;j=h<<1;k=2224+(j<<2)|0;l=2224+(j+2<<2)|0;j=c[l>>2]|0;m=j+8|0;n=c[m>>2]|0;do{if((k|0)==(n|0)){c[546]=f&~(1<<h)}else{if(n>>>0<(c[2200>>2]|0)>>>0){Oa()}o=n+12|0;if((c[o>>2]|0)==(j|0)){c[o>>2]=k;c[l>>2]=n;break}else{Oa()}}}while(0);n=h<<3;c[j+4>>2]=n|3;l=j+(n|4)|0;c[l>>2]=c[l>>2]|1;p=m;i=b;return p|0}if(!(d>>>0>(c[2192>>2]|0)>>>0)){q=d;break}if((g|0)!=0){l=2<<e;n=g<<e&(l|0-l);l=(n&0-n)+ -1|0;n=l>>>12&16;k=l>>>n;l=k>>>5&8;o=k>>>l;k=o>>>2&4;r=o>>>k;o=r>>>1&2;s=r>>>o;r=s>>>1&1;t=(l|n|k|o|r)+(s>>>r)|0;r=t<<1;s=2224+(r<<2)|0;o=2224+(r+2<<2)|0;r=c[o>>2]|0;k=r+8|0;n=c[k>>2]|0;do{if((s|0)==(n|0)){c[546]=f&~(1<<t)}else{if(n>>>0<(c[2200>>2]|0)>>>0){Oa()}l=n+12|0;if((c[l>>2]|0)==(r|0)){c[l>>2]=s;c[o>>2]=n;break}else{Oa()}}}while(0);n=t<<3;o=n-d|0;c[r+4>>2]=d|3;s=r;f=s+d|0;c[s+(d|4)>>2]=o|1;c[s+n>>2]=o;n=c[2192>>2]|0;if((n|0)!=0){s=c[2204>>2]|0;e=n>>>3;n=e<<1;g=2224+(n<<2)|0;m=c[546]|0;j=1<<e;do{if((m&j|0)==0){c[546]=m|j;u=2224+(n+2<<2)|0;v=g}else{e=2224+(n+2<<2)|0;h=c[e>>2]|0;if(!(h>>>0<(c[2200>>2]|0)>>>0)){u=e;v=h;break}Oa()}}while(0);c[u>>2]=s;c[v+12>>2]=s;c[s+8>>2]=v;c[s+12>>2]=g}c[2192>>2]=o;c[2204>>2]=f;p=k;i=b;return p|0}n=c[2188>>2]|0;if((n|0)==0){q=d;break}j=(n&0-n)+ -1|0;n=j>>>12&16;m=j>>>n;j=m>>>5&8;r=m>>>j;m=r>>>2&4;t=r>>>m;r=t>>>1&2;h=t>>>r;t=h>>>1&1;e=c[2488+((j|n|m|r|t)+(h>>>t)<<2)>>2]|0;t=(c[e+4>>2]&-8)-d|0;h=e;r=e;while(1){e=c[h+16>>2]|0;if((e|0)==0){m=c[h+20>>2]|0;if((m|0)==0){break}else{w=m}}else{w=e}e=(c[w+4>>2]&-8)-d|0;m=e>>>0<t>>>0;t=m?e:t;h=w;r=m?w:r}h=r;k=c[2200>>2]|0;if(h>>>0<k>>>0){Oa()}f=h+d|0;o=f;if(!(h>>>0<f>>>0)){Oa()}f=c[r+24>>2]|0;g=c[r+12>>2]|0;do{if((g|0)==(r|0)){s=r+20|0;m=c[s>>2]|0;if((m|0)==0){e=r+16|0;n=c[e>>2]|0;if((n|0)==0){x=0;break}else{y=n;z=e}}else{y=m;z=s}while(1){s=y+20|0;m=c[s>>2]|0;if((m|0)!=0){z=s;y=m;continue}m=y+16|0;s=c[m>>2]|0;if((s|0)==0){break}else{y=s;z=m}}if(z>>>0<k>>>0){Oa()}else{c[z>>2]=0;x=y;break}}else{m=c[r+8>>2]|0;if(m>>>0<k>>>0){Oa()}s=m+12|0;if((c[s>>2]|0)!=(r|0)){Oa()}e=g+8|0;if((c[e>>2]|0)==(r|0)){c[s>>2]=g;c[e>>2]=m;x=g;break}else{Oa()}}}while(0);a:do{if((f|0)!=0){g=c[r+28>>2]|0;k=2488+(g<<2)|0;do{if((r|0)==(c[k>>2]|0)){c[k>>2]=x;if((x|0)!=0){break}c[2188>>2]=c[2188>>2]&~(1<<g);break a}else{if(f>>>0<(c[2200>>2]|0)>>>0){Oa()}m=f+16|0;if((c[m>>2]|0)==(r|0)){c[m>>2]=x}else{c[f+20>>2]=x}if((x|0)==0){break a}}}while(0);if(x>>>0<(c[2200>>2]|0)>>>0){Oa()}c[x+24>>2]=f;g=c[r+16>>2]|0;do{if((g|0)!=0){if(g>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[x+16>>2]=g;c[g+24>>2]=x;break}}}while(0);g=c[r+20>>2]|0;if((g|0)==0){break}if(g>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[x+20>>2]=g;c[g+24>>2]=x;break}}}while(0);if(t>>>0<16){f=t+d|0;c[r+4>>2]=f|3;g=h+(f+4)|0;c[g>>2]=c[g>>2]|1}else{c[r+4>>2]=d|3;c[h+(d|4)>>2]=t|1;c[h+(t+d)>>2]=t;g=c[2192>>2]|0;if((g|0)!=0){f=c[2204>>2]|0;k=g>>>3;g=k<<1;m=2224+(g<<2)|0;e=c[546]|0;s=1<<k;do{if((e&s|0)==0){c[546]=e|s;A=2224+(g+2<<2)|0;B=m}else{k=2224+(g+2<<2)|0;n=c[k>>2]|0;if(!(n>>>0<(c[2200>>2]|0)>>>0)){A=k;B=n;break}Oa()}}while(0);c[A>>2]=f;c[B+12>>2]=f;c[f+8>>2]=B;c[f+12>>2]=m}c[2192>>2]=t;c[2204>>2]=o}p=r+8|0;i=b;return p|0}else{if(a>>>0>4294967231){q=-1;break}g=a+11|0;s=g&-8;e=c[2188>>2]|0;if((e|0)==0){q=s;break}h=0-s|0;n=g>>>8;do{if((n|0)==0){C=0}else{if(s>>>0>16777215){C=31;break}g=(n+1048320|0)>>>16&8;k=n<<g;j=(k+520192|0)>>>16&4;l=k<<j;k=(l+245760|0)>>>16&2;D=14-(j|g|k)+(l<<k>>>15)|0;C=s>>>(D+7|0)&1|D<<1}}while(0);n=c[2488+(C<<2)>>2]|0;b:do{if((n|0)==0){E=h;F=0;G=0}else{if((C|0)==31){H=0}else{H=25-(C>>>1)|0}r=h;o=0;t=s<<H;m=n;f=0;while(1){D=c[m+4>>2]&-8;k=D-s|0;if(k>>>0<r>>>0){if((D|0)==(s|0)){E=k;F=m;G=m;break b}else{I=k;J=m}}else{I=r;J=f}k=c[m+20>>2]|0;D=c[m+(t>>>31<<2)+16>>2]|0;l=(k|0)==0|(k|0)==(D|0)?o:k;if((D|0)==0){E=I;F=l;G=J;break}else{r=I;o=l;t=t<<1;m=D;f=J}}}}while(0);if((F|0)==0&(G|0)==0){n=2<<C;h=e&(n|0-n);if((h|0)==0){q=s;break}n=(h&0-h)+ -1|0;h=n>>>12&16;f=n>>>h;n=f>>>5&8;m=f>>>n;f=m>>>2&4;t=m>>>f;m=t>>>1&2;o=t>>>m;t=o>>>1&1;K=c[2488+((n|h|f|m|t)+(o>>>t)<<2)>>2]|0}else{K=F}if((K|0)==0){L=E;M=G}else{t=E;o=K;m=G;while(1){f=(c[o+4>>2]&-8)-s|0;h=f>>>0<t>>>0;n=h?f:t;f=h?o:m;h=c[o+16>>2]|0;if((h|0)!=0){N=f;O=n;m=N;o=h;t=O;continue}h=c[o+20>>2]|0;if((h|0)==0){L=n;M=f;break}else{N=f;O=n;o=h;m=N;t=O}}}if((M|0)==0){q=s;break}if(!(L>>>0<((c[2192>>2]|0)-s|0)>>>0)){q=s;break}t=M;m=c[2200>>2]|0;if(t>>>0<m>>>0){Oa()}o=t+s|0;e=o;if(!(t>>>0<o>>>0)){Oa()}h=c[M+24>>2]|0;n=c[M+12>>2]|0;do{if((n|0)==(M|0)){f=M+20|0;r=c[f>>2]|0;if((r|0)==0){D=M+16|0;l=c[D>>2]|0;if((l|0)==0){P=0;break}else{Q=l;R=D}}else{Q=r;R=f}while(1){f=Q+20|0;r=c[f>>2]|0;if((r|0)!=0){R=f;Q=r;continue}r=Q+16|0;f=c[r>>2]|0;if((f|0)==0){break}else{Q=f;R=r}}if(R>>>0<m>>>0){Oa()}else{c[R>>2]=0;P=Q;break}}else{r=c[M+8>>2]|0;if(r>>>0<m>>>0){Oa()}f=r+12|0;if((c[f>>2]|0)!=(M|0)){Oa()}D=n+8|0;if((c[D>>2]|0)==(M|0)){c[f>>2]=n;c[D>>2]=r;P=n;break}else{Oa()}}}while(0);c:do{if((h|0)!=0){n=c[M+28>>2]|0;m=2488+(n<<2)|0;do{if((M|0)==(c[m>>2]|0)){c[m>>2]=P;if((P|0)!=0){break}c[2188>>2]=c[2188>>2]&~(1<<n);break c}else{if(h>>>0<(c[2200>>2]|0)>>>0){Oa()}r=h+16|0;if((c[r>>2]|0)==(M|0)){c[r>>2]=P}else{c[h+20>>2]=P}if((P|0)==0){break c}}}while(0);if(P>>>0<(c[2200>>2]|0)>>>0){Oa()}c[P+24>>2]=h;n=c[M+16>>2]|0;do{if((n|0)!=0){if(n>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[P+16>>2]=n;c[n+24>>2]=P;break}}}while(0);n=c[M+20>>2]|0;if((n|0)==0){break}if(n>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[P+20>>2]=n;c[n+24>>2]=P;break}}}while(0);d:do{if(L>>>0<16){h=L+s|0;c[M+4>>2]=h|3;n=t+(h+4)|0;c[n>>2]=c[n>>2]|1}else{c[M+4>>2]=s|3;c[t+(s|4)>>2]=L|1;c[t+(L+s)>>2]=L;n=L>>>3;if(L>>>0<256){h=n<<1;m=2224+(h<<2)|0;r=c[546]|0;D=1<<n;do{if((r&D|0)==0){c[546]=r|D;S=2224+(h+2<<2)|0;T=m}else{n=2224+(h+2<<2)|0;f=c[n>>2]|0;if(!(f>>>0<(c[2200>>2]|0)>>>0)){S=n;T=f;break}Oa()}}while(0);c[S>>2]=e;c[T+12>>2]=e;c[t+(s+8)>>2]=T;c[t+(s+12)>>2]=m;break}h=o;D=L>>>8;do{if((D|0)==0){U=0}else{if(L>>>0>16777215){U=31;break}r=(D+1048320|0)>>>16&8;f=D<<r;n=(f+520192|0)>>>16&4;l=f<<n;f=(l+245760|0)>>>16&2;k=14-(n|r|f)+(l<<f>>>15)|0;U=L>>>(k+7|0)&1|k<<1}}while(0);D=2488+(U<<2)|0;c[t+(s+28)>>2]=U;c[t+(s+20)>>2]=0;c[t+(s+16)>>2]=0;m=c[2188>>2]|0;k=1<<U;if((m&k|0)==0){c[2188>>2]=m|k;c[D>>2]=h;c[t+(s+24)>>2]=D;c[t+(s+12)>>2]=h;c[t+(s+8)>>2]=h;break}k=c[D>>2]|0;if((U|0)==31){V=0}else{V=25-(U>>>1)|0}e:do{if((c[k+4>>2]&-8|0)==(L|0)){W=k}else{D=L<<V;m=k;while(1){X=m+(D>>>31<<2)+16|0;f=c[X>>2]|0;if((f|0)==0){break}if((c[f+4>>2]&-8|0)==(L|0)){W=f;break e}else{D=D<<1;m=f}}if(X>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[X>>2]=h;c[t+(s+24)>>2]=m;c[t+(s+12)>>2]=h;c[t+(s+8)>>2]=h;break d}}}while(0);k=W+8|0;D=c[k>>2]|0;f=c[2200>>2]|0;if(W>>>0<f>>>0){Oa()}if(D>>>0<f>>>0){Oa()}else{c[D+12>>2]=h;c[k>>2]=h;c[t+(s+8)>>2]=D;c[t+(s+12)>>2]=W;c[t+(s+24)>>2]=0;break}}}while(0);p=M+8|0;i=b;return p|0}}while(0);M=c[2192>>2]|0;if(!(q>>>0>M>>>0)){W=M-q|0;X=c[2204>>2]|0;if(W>>>0>15){L=X;c[2204>>2]=L+q;c[2192>>2]=W;c[L+(q+4)>>2]=W|1;c[L+M>>2]=W;c[X+4>>2]=q|3}else{c[2192>>2]=0;c[2204>>2]=0;c[X+4>>2]=M|3;W=X+(M+4)|0;c[W>>2]=c[W>>2]|1}p=X+8|0;i=b;return p|0}X=c[2196>>2]|0;if(q>>>0<X>>>0){W=X-q|0;c[2196>>2]=W;X=c[2208>>2]|0;M=X;c[2208>>2]=M+q;c[M+(q+4)>>2]=W|1;c[X+4>>2]=q|3;p=X+8|0;i=b;return p|0}do{if((c[664]|0)==0){X=Ca(30)|0;if((X+ -1&X|0)==0){c[2664>>2]=X;c[2660>>2]=X;c[2668>>2]=-1;c[2672>>2]=-1;c[2676>>2]=0;c[2628>>2]=0;c[664]=(Qa(0)|0)&-16^1431655768;break}else{Oa()}}}while(0);X=q+48|0;W=c[2664>>2]|0;M=q+47|0;L=W+M|0;V=0-W|0;W=L&V;if(!(W>>>0>q>>>0)){p=0;i=b;return p|0}U=c[2624>>2]|0;do{if((U|0)!=0){T=c[2616>>2]|0;S=T+W|0;if(S>>>0<=T>>>0|S>>>0>U>>>0){p=0}else{break}i=b;return p|0}}while(0);f:do{if((c[2628>>2]&4|0)==0){U=c[2208>>2]|0;g:do{if((U|0)==0){Y=182}else{S=U;T=2632|0;while(1){Z=T;P=c[Z>>2]|0;if(!(P>>>0>S>>>0)){_=T+4|0;if((P+(c[_>>2]|0)|0)>>>0>S>>>0){break}}P=c[T+8>>2]|0;if((P|0)==0){Y=182;break g}else{T=P}}if((T|0)==0){Y=182;break}S=L-(c[2196>>2]|0)&V;if(!(S>>>0<2147483647)){$=0;break}h=ya(S|0)|0;P=(h|0)==((c[Z>>2]|0)+(c[_>>2]|0)|0);aa=h;ba=S;ca=P?h:-1;da=P?S:0;Y=191}}while(0);do{if((Y|0)==182){U=ya(0)|0;if((U|0)==(-1|0)){$=0;break}S=U;P=c[2660>>2]|0;h=P+ -1|0;if((h&S|0)==0){ea=W}else{ea=W-S+(h+S&0-P)|0}P=c[2616>>2]|0;S=P+ea|0;if(!(ea>>>0>q>>>0&ea>>>0<2147483647)){$=0;break}h=c[2624>>2]|0;if((h|0)!=0){if(S>>>0<=P>>>0|S>>>0>h>>>0){$=0;break}}h=ya(ea|0)|0;S=(h|0)==(U|0);aa=h;ba=ea;ca=S?U:-1;da=S?ea:0;Y=191}}while(0);h:do{if((Y|0)==191){S=0-ba|0;if((ca|0)!=(-1|0)){fa=ca;ga=da;Y=202;break f}do{if((aa|0)!=(-1|0)&ba>>>0<2147483647&ba>>>0<X>>>0){U=c[2664>>2]|0;h=M-ba+U&0-U;if(!(h>>>0<2147483647)){ha=ba;break}if((ya(h|0)|0)==(-1|0)){ya(S|0)|0;$=da;break h}else{ha=h+ba|0;break}}else{ha=ba}}while(0);if((aa|0)==(-1|0)){$=da}else{fa=aa;ga=ha;Y=202;break f}}}while(0);c[2628>>2]=c[2628>>2]|4;ia=$;Y=199}else{ia=0;Y=199}}while(0);do{if((Y|0)==199){if(!(W>>>0<2147483647)){break}$=ya(W|0)|0;ha=ya(0)|0;if(!((ha|0)!=(-1|0)&($|0)!=(-1|0)&$>>>0<ha>>>0)){break}aa=ha-$|0;ha=aa>>>0>(q+40|0)>>>0;if(ha){fa=$;ga=ha?aa:ia;Y=202}}}while(0);do{if((Y|0)==202){ia=(c[2616>>2]|0)+ga|0;c[2616>>2]=ia;if(ia>>>0>(c[2620>>2]|0)>>>0){c[2620>>2]=ia}ia=c[2208>>2]|0;i:do{if((ia|0)==0){W=c[2200>>2]|0;if((W|0)==0|fa>>>0<W>>>0){c[2200>>2]=fa}c[2632>>2]=fa;c[2636>>2]=ga;c[2644>>2]=0;c[2220>>2]=c[664];c[2216>>2]=-1;W=0;do{aa=W<<1;ha=2224+(aa<<2)|0;c[2224+(aa+3<<2)>>2]=ha;c[2224+(aa+2<<2)>>2]=ha;W=W+1|0;}while((W|0)!=32);W=fa+8|0;if((W&7|0)==0){ja=0}else{ja=0-W&7}W=ga+ -40-ja|0;c[2208>>2]=fa+ja;c[2196>>2]=W;c[fa+(ja+4)>>2]=W|1;c[fa+(ga+ -36)>>2]=40;c[2212>>2]=c[2672>>2]}else{W=2632|0;while(1){ka=c[W>>2]|0;la=W+4|0;ma=c[la>>2]|0;if((fa|0)==(ka+ma|0)){Y=214;break}ha=c[W+8>>2]|0;if((ha|0)==0){break}else{W=ha}}do{if((Y|0)==214){if((c[W+12>>2]&8|0)!=0){break}ha=ia;if(!(ha>>>0>=ka>>>0&ha>>>0<fa>>>0)){break}c[la>>2]=ma+ga;aa=(c[2196>>2]|0)+ga|0;$=ia+8|0;if(($&7|0)==0){na=0}else{na=0-$&7}$=aa-na|0;c[2208>>2]=ha+na;c[2196>>2]=$;c[ha+(na+4)>>2]=$|1;c[ha+(aa+4)>>2]=40;c[2212>>2]=c[2672>>2];break i}}while(0);if(fa>>>0<(c[2200>>2]|0)>>>0){c[2200>>2]=fa}W=fa+ga|0;aa=2632|0;while(1){oa=aa;if((c[oa>>2]|0)==(W|0)){Y=224;break}ha=c[aa+8>>2]|0;if((ha|0)==0){break}else{aa=ha}}do{if((Y|0)==224){if((c[aa+12>>2]&8|0)!=0){break}c[oa>>2]=fa;W=aa+4|0;c[W>>2]=(c[W>>2]|0)+ga;W=fa+8|0;if((W&7|0)==0){pa=0}else{pa=0-W&7}W=fa+(ga+8)|0;if((W&7|0)==0){qa=0}else{qa=0-W&7}W=fa+(qa+ga)|0;ha=W;$=pa+q|0;da=fa+$|0;ba=da;M=W-(fa+pa)-q|0;c[fa+(pa+4)>>2]=q|3;j:do{if((ha|0)==(c[2208>>2]|0)){X=(c[2196>>2]|0)+M|0;c[2196>>2]=X;c[2208>>2]=ba;c[fa+($+4)>>2]=X|1}else{if((ha|0)==(c[2204>>2]|0)){X=(c[2192>>2]|0)+M|0;c[2192>>2]=X;c[2204>>2]=ba;c[fa+($+4)>>2]=X|1;c[fa+(X+$)>>2]=X;break}X=ga+4|0;ca=c[fa+(X+qa)>>2]|0;if((ca&3|0)==1){ea=ca&-8;_=ca>>>3;k:do{if(ca>>>0<256){Z=c[fa+((qa|8)+ga)>>2]|0;V=c[fa+(ga+12+qa)>>2]|0;L=2224+(_<<1<<2)|0;do{if((Z|0)!=(L|0)){if(Z>>>0<(c[2200>>2]|0)>>>0){Oa()}if((c[Z+12>>2]|0)==(ha|0)){break}Oa()}}while(0);if((V|0)==(Z|0)){c[546]=c[546]&~(1<<_);break}do{if((V|0)==(L|0)){ra=V+8|0}else{if(V>>>0<(c[2200>>2]|0)>>>0){Oa()}S=V+8|0;if((c[S>>2]|0)==(ha|0)){ra=S;break}Oa()}}while(0);c[Z+12>>2]=V;c[ra>>2]=Z}else{L=W;S=c[fa+((qa|24)+ga)>>2]|0;T=c[fa+(ga+12+qa)>>2]|0;do{if((T|0)==(L|0)){h=qa|16;U=fa+(X+h)|0;P=c[U>>2]|0;if((P|0)==0){Q=fa+(h+ga)|0;h=c[Q>>2]|0;if((h|0)==0){sa=0;break}else{ta=h;ua=Q}}else{ta=P;ua=U}while(1){U=ta+20|0;P=c[U>>2]|0;if((P|0)!=0){ua=U;ta=P;continue}P=ta+16|0;U=c[P>>2]|0;if((U|0)==0){break}else{ta=U;ua=P}}if(ua>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[ua>>2]=0;sa=ta;break}}else{P=c[fa+((qa|8)+ga)>>2]|0;if(P>>>0<(c[2200>>2]|0)>>>0){Oa()}U=P+12|0;if((c[U>>2]|0)!=(L|0)){Oa()}Q=T+8|0;if((c[Q>>2]|0)==(L|0)){c[U>>2]=T;c[Q>>2]=P;sa=T;break}else{Oa()}}}while(0);if((S|0)==0){break}T=c[fa+(ga+28+qa)>>2]|0;Z=2488+(T<<2)|0;do{if((L|0)==(c[Z>>2]|0)){c[Z>>2]=sa;if((sa|0)!=0){break}c[2188>>2]=c[2188>>2]&~(1<<T);break k}else{if(S>>>0<(c[2200>>2]|0)>>>0){Oa()}V=S+16|0;if((c[V>>2]|0)==(L|0)){c[V>>2]=sa}else{c[S+20>>2]=sa}if((sa|0)==0){break k}}}while(0);if(sa>>>0<(c[2200>>2]|0)>>>0){Oa()}c[sa+24>>2]=S;L=qa|16;T=c[fa+(L+ga)>>2]|0;do{if((T|0)!=0){if(T>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[sa+16>>2]=T;c[T+24>>2]=sa;break}}}while(0);T=c[fa+(X+L)>>2]|0;if((T|0)==0){break}if(T>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[sa+20>>2]=T;c[T+24>>2]=sa;break}}}while(0);va=fa+((ea|qa)+ga)|0;wa=ea+M|0}else{va=ha;wa=M}X=va+4|0;c[X>>2]=c[X>>2]&-2;c[fa+($+4)>>2]=wa|1;c[fa+(wa+$)>>2]=wa;X=wa>>>3;if(wa>>>0<256){_=X<<1;ca=2224+(_<<2)|0;T=c[546]|0;S=1<<X;do{if((T&S|0)==0){c[546]=T|S;xa=2224+(_+2<<2)|0;za=ca}else{X=2224+(_+2<<2)|0;Z=c[X>>2]|0;if(!(Z>>>0<(c[2200>>2]|0)>>>0)){xa=X;za=Z;break}Oa()}}while(0);c[xa>>2]=ba;c[za+12>>2]=ba;c[fa+($+8)>>2]=za;c[fa+($+12)>>2]=ca;break}_=da;S=wa>>>8;do{if((S|0)==0){Aa=0}else{if(wa>>>0>16777215){Aa=31;break}T=(S+1048320|0)>>>16&8;ea=S<<T;Z=(ea+520192|0)>>>16&4;X=ea<<Z;ea=(X+245760|0)>>>16&2;V=14-(Z|T|ea)+(X<<ea>>>15)|0;Aa=wa>>>(V+7|0)&1|V<<1}}while(0);S=2488+(Aa<<2)|0;c[fa+($+28)>>2]=Aa;c[fa+($+20)>>2]=0;c[fa+($+16)>>2]=0;ca=c[2188>>2]|0;V=1<<Aa;if((ca&V|0)==0){c[2188>>2]=ca|V;c[S>>2]=_;c[fa+($+24)>>2]=S;c[fa+($+12)>>2]=_;c[fa+($+8)>>2]=_;break}V=c[S>>2]|0;if((Aa|0)==31){Ba=0}else{Ba=25-(Aa>>>1)|0}l:do{if((c[V+4>>2]&-8|0)==(wa|0)){Da=V}else{S=wa<<Ba;ca=V;while(1){Ea=ca+(S>>>31<<2)+16|0;ea=c[Ea>>2]|0;if((ea|0)==0){break}if((c[ea+4>>2]&-8|0)==(wa|0)){Da=ea;break l}else{S=S<<1;ca=ea}}if(Ea>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[Ea>>2]=_;c[fa+($+24)>>2]=ca;c[fa+($+12)>>2]=_;c[fa+($+8)>>2]=_;break j}}}while(0);V=Da+8|0;S=c[V>>2]|0;L=c[2200>>2]|0;if(Da>>>0<L>>>0){Oa()}if(S>>>0<L>>>0){Oa()}else{c[S+12>>2]=_;c[V>>2]=_;c[fa+($+8)>>2]=S;c[fa+($+12)>>2]=Da;c[fa+($+24)>>2]=0;break}}}while(0);p=fa+(pa|8)|0;i=b;return p|0}}while(0);aa=ia;$=2632|0;while(1){Fa=c[$>>2]|0;if(!(Fa>>>0>aa>>>0)){Ga=c[$+4>>2]|0;Ha=Fa+Ga|0;if(Ha>>>0>aa>>>0){break}}$=c[$+8>>2]|0}$=Fa+(Ga+ -39)|0;if(($&7|0)==0){Ia=0}else{Ia=0-$&7}$=Fa+(Ga+ -47+Ia)|0;da=$>>>0<(ia+16|0)>>>0?aa:$;$=da+8|0;ba=$;M=fa+8|0;if((M&7|0)==0){Ja=0}else{Ja=0-M&7}M=ga+ -40-Ja|0;c[2208>>2]=fa+Ja;c[2196>>2]=M;c[fa+(Ja+4)>>2]=M|1;c[fa+(ga+ -36)>>2]=40;c[2212>>2]=c[2672>>2];c[da+4>>2]=27;c[$+0>>2]=c[2632>>2];c[$+4>>2]=c[2636>>2];c[$+8>>2]=c[2640>>2];c[$+12>>2]=c[2644>>2];c[2632>>2]=fa;c[2636>>2]=ga;c[2644>>2]=0;c[2640>>2]=ba;ba=da+28|0;c[ba>>2]=7;if((da+32|0)>>>0<Ha>>>0){$=ba;while(1){ba=$+4|0;c[ba>>2]=7;if(($+8|0)>>>0<Ha>>>0){$=ba}else{break}}}if((da|0)==(aa|0)){break}$=da-ia|0;ba=aa+($+4)|0;c[ba>>2]=c[ba>>2]&-2;c[ia+4>>2]=$|1;c[aa+$>>2]=$;ba=$>>>3;if($>>>0<256){M=ba<<1;ha=2224+(M<<2)|0;W=c[546]|0;m=1<<ba;do{if((W&m|0)==0){c[546]=W|m;Ka=2224+(M+2<<2)|0;Ma=ha}else{ba=2224+(M+2<<2)|0;S=c[ba>>2]|0;if(!(S>>>0<(c[2200>>2]|0)>>>0)){Ka=ba;Ma=S;break}Oa()}}while(0);c[Ka>>2]=ia;c[Ma+12>>2]=ia;c[ia+8>>2]=Ma;c[ia+12>>2]=ha;break}M=ia;m=$>>>8;do{if((m|0)==0){Na=0}else{if($>>>0>16777215){Na=31;break}W=(m+1048320|0)>>>16&8;aa=m<<W;da=(aa+520192|0)>>>16&4;S=aa<<da;aa=(S+245760|0)>>>16&2;ba=14-(da|W|aa)+(S<<aa>>>15)|0;Na=$>>>(ba+7|0)&1|ba<<1}}while(0);m=2488+(Na<<2)|0;c[ia+28>>2]=Na;c[ia+20>>2]=0;c[ia+16>>2]=0;ha=c[2188>>2]|0;ba=1<<Na;if((ha&ba|0)==0){c[2188>>2]=ha|ba;c[m>>2]=M;c[ia+24>>2]=m;c[ia+12>>2]=ia;c[ia+8>>2]=ia;break}ba=c[m>>2]|0;if((Na|0)==31){Pa=0}else{Pa=25-(Na>>>1)|0}m:do{if((c[ba+4>>2]&-8|0)==($|0)){Ra=ba}else{m=$<<Pa;ha=ba;while(1){Sa=ha+(m>>>31<<2)+16|0;aa=c[Sa>>2]|0;if((aa|0)==0){break}if((c[aa+4>>2]&-8|0)==($|0)){Ra=aa;break m}else{m=m<<1;ha=aa}}if(Sa>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[Sa>>2]=M;c[ia+24>>2]=ha;c[ia+12>>2]=ia;c[ia+8>>2]=ia;break i}}}while(0);$=Ra+8|0;ba=c[$>>2]|0;m=c[2200>>2]|0;if(Ra>>>0<m>>>0){Oa()}if(ba>>>0<m>>>0){Oa()}else{c[ba+12>>2]=M;c[$>>2]=M;c[ia+8>>2]=ba;c[ia+12>>2]=Ra;c[ia+24>>2]=0;break}}}while(0);ia=c[2196>>2]|0;if(!(ia>>>0>q>>>0)){break}ba=ia-q|0;c[2196>>2]=ba;ia=c[2208>>2]|0;$=ia;c[2208>>2]=$+q;c[$+(q+4)>>2]=ba|1;c[ia+4>>2]=q|3;p=ia+8|0;i=b;return p|0}}while(0);c[(La()|0)>>2]=12;p=0;i=b;return p|0}function Le(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;b=i;if((a|0)==0){i=b;return}d=a+ -8|0;e=d;f=c[2200>>2]|0;if(d>>>0<f>>>0){Oa()}g=c[a+ -4>>2]|0;h=g&3;if((h|0)==1){Oa()}j=g&-8;k=a+(j+ -8)|0;l=k;a:do{if((g&1|0)==0){m=c[d>>2]|0;if((h|0)==0){i=b;return}n=-8-m|0;o=a+n|0;p=o;q=m+j|0;if(o>>>0<f>>>0){Oa()}if((p|0)==(c[2204>>2]|0)){r=a+(j+ -4)|0;if((c[r>>2]&3|0)!=3){s=p;t=q;break}c[2192>>2]=q;c[r>>2]=c[r>>2]&-2;c[a+(n+4)>>2]=q|1;c[k>>2]=q;i=b;return}r=m>>>3;if(m>>>0<256){m=c[a+(n+8)>>2]|0;u=c[a+(n+12)>>2]|0;v=2224+(r<<1<<2)|0;do{if((m|0)!=(v|0)){if(m>>>0<f>>>0){Oa()}if((c[m+12>>2]|0)==(p|0)){break}Oa()}}while(0);if((u|0)==(m|0)){c[546]=c[546]&~(1<<r);s=p;t=q;break}do{if((u|0)==(v|0)){w=u+8|0}else{if(u>>>0<f>>>0){Oa()}x=u+8|0;if((c[x>>2]|0)==(p|0)){w=x;break}Oa()}}while(0);c[m+12>>2]=u;c[w>>2]=m;s=p;t=q;break}v=o;r=c[a+(n+24)>>2]|0;x=c[a+(n+12)>>2]|0;do{if((x|0)==(v|0)){y=a+(n+20)|0;z=c[y>>2]|0;if((z|0)==0){A=a+(n+16)|0;B=c[A>>2]|0;if((B|0)==0){C=0;break}else{D=B;E=A}}else{D=z;E=y}while(1){y=D+20|0;z=c[y>>2]|0;if((z|0)!=0){E=y;D=z;continue}z=D+16|0;y=c[z>>2]|0;if((y|0)==0){break}else{D=y;E=z}}if(E>>>0<f>>>0){Oa()}else{c[E>>2]=0;C=D;break}}else{z=c[a+(n+8)>>2]|0;if(z>>>0<f>>>0){Oa()}y=z+12|0;if((c[y>>2]|0)!=(v|0)){Oa()}A=x+8|0;if((c[A>>2]|0)==(v|0)){c[y>>2]=x;c[A>>2]=z;C=x;break}else{Oa()}}}while(0);if((r|0)==0){s=p;t=q;break}x=c[a+(n+28)>>2]|0;o=2488+(x<<2)|0;do{if((v|0)==(c[o>>2]|0)){c[o>>2]=C;if((C|0)!=0){break}c[2188>>2]=c[2188>>2]&~(1<<x);s=p;t=q;break a}else{if(r>>>0<(c[2200>>2]|0)>>>0){Oa()}m=r+16|0;if((c[m>>2]|0)==(v|0)){c[m>>2]=C}else{c[r+20>>2]=C}if((C|0)==0){s=p;t=q;break a}}}while(0);if(C>>>0<(c[2200>>2]|0)>>>0){Oa()}c[C+24>>2]=r;v=c[a+(n+16)>>2]|0;do{if((v|0)!=0){if(v>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[C+16>>2]=v;c[v+24>>2]=C;break}}}while(0);v=c[a+(n+20)>>2]|0;if((v|0)==0){s=p;t=q;break}if(v>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[C+20>>2]=v;c[v+24>>2]=C;s=p;t=q;break}}else{s=e;t=j}}while(0);e=s;if(!(e>>>0<k>>>0)){Oa()}C=a+(j+ -4)|0;f=c[C>>2]|0;if((f&1|0)==0){Oa()}do{if((f&2|0)==0){if((l|0)==(c[2208>>2]|0)){D=(c[2196>>2]|0)+t|0;c[2196>>2]=D;c[2208>>2]=s;c[s+4>>2]=D|1;if((s|0)!=(c[2204>>2]|0)){i=b;return}c[2204>>2]=0;c[2192>>2]=0;i=b;return}if((l|0)==(c[2204>>2]|0)){D=(c[2192>>2]|0)+t|0;c[2192>>2]=D;c[2204>>2]=s;c[s+4>>2]=D|1;c[e+D>>2]=D;i=b;return}D=(f&-8)+t|0;E=f>>>3;b:do{if(f>>>0<256){w=c[a+j>>2]|0;h=c[a+(j|4)>>2]|0;d=2224+(E<<1<<2)|0;do{if((w|0)!=(d|0)){if(w>>>0<(c[2200>>2]|0)>>>0){Oa()}if((c[w+12>>2]|0)==(l|0)){break}Oa()}}while(0);if((h|0)==(w|0)){c[546]=c[546]&~(1<<E);break}do{if((h|0)==(d|0)){F=h+8|0}else{if(h>>>0<(c[2200>>2]|0)>>>0){Oa()}g=h+8|0;if((c[g>>2]|0)==(l|0)){F=g;break}Oa()}}while(0);c[w+12>>2]=h;c[F>>2]=w}else{d=k;g=c[a+(j+16)>>2]|0;v=c[a+(j|4)>>2]|0;do{if((v|0)==(d|0)){r=a+(j+12)|0;x=c[r>>2]|0;if((x|0)==0){o=a+(j+8)|0;m=c[o>>2]|0;if((m|0)==0){G=0;break}else{H=m;I=o}}else{H=x;I=r}while(1){r=H+20|0;x=c[r>>2]|0;if((x|0)!=0){I=r;H=x;continue}x=H+16|0;r=c[x>>2]|0;if((r|0)==0){break}else{H=r;I=x}}if(I>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[I>>2]=0;G=H;break}}else{x=c[a+j>>2]|0;if(x>>>0<(c[2200>>2]|0)>>>0){Oa()}r=x+12|0;if((c[r>>2]|0)!=(d|0)){Oa()}o=v+8|0;if((c[o>>2]|0)==(d|0)){c[r>>2]=v;c[o>>2]=x;G=v;break}else{Oa()}}}while(0);if((g|0)==0){break}v=c[a+(j+20)>>2]|0;w=2488+(v<<2)|0;do{if((d|0)==(c[w>>2]|0)){c[w>>2]=G;if((G|0)!=0){break}c[2188>>2]=c[2188>>2]&~(1<<v);break b}else{if(g>>>0<(c[2200>>2]|0)>>>0){Oa()}h=g+16|0;if((c[h>>2]|0)==(d|0)){c[h>>2]=G}else{c[g+20>>2]=G}if((G|0)==0){break b}}}while(0);if(G>>>0<(c[2200>>2]|0)>>>0){Oa()}c[G+24>>2]=g;d=c[a+(j+8)>>2]|0;do{if((d|0)!=0){if(d>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[G+16>>2]=d;c[d+24>>2]=G;break}}}while(0);d=c[a+(j+12)>>2]|0;if((d|0)==0){break}if(d>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[G+20>>2]=d;c[d+24>>2]=G;break}}}while(0);c[s+4>>2]=D|1;c[e+D>>2]=D;if((s|0)!=(c[2204>>2]|0)){J=D;break}c[2192>>2]=D;i=b;return}else{c[C>>2]=f&-2;c[s+4>>2]=t|1;c[e+t>>2]=t;J=t}}while(0);t=J>>>3;if(J>>>0<256){e=t<<1;f=2224+(e<<2)|0;C=c[546]|0;G=1<<t;do{if((C&G|0)==0){c[546]=C|G;K=2224+(e+2<<2)|0;L=f}else{t=2224+(e+2<<2)|0;j=c[t>>2]|0;if(!(j>>>0<(c[2200>>2]|0)>>>0)){K=t;L=j;break}Oa()}}while(0);c[K>>2]=s;c[L+12>>2]=s;c[s+8>>2]=L;c[s+12>>2]=f;i=b;return}f=s;L=J>>>8;do{if((L|0)==0){M=0}else{if(J>>>0>16777215){M=31;break}K=(L+1048320|0)>>>16&8;e=L<<K;G=(e+520192|0)>>>16&4;C=e<<G;e=(C+245760|0)>>>16&2;j=14-(G|K|e)+(C<<e>>>15)|0;M=J>>>(j+7|0)&1|j<<1}}while(0);L=2488+(M<<2)|0;c[s+28>>2]=M;c[s+20>>2]=0;c[s+16>>2]=0;j=c[2188>>2]|0;e=1<<M;c:do{if((j&e|0)==0){c[2188>>2]=j|e;c[L>>2]=f;c[s+24>>2]=L;c[s+12>>2]=s;c[s+8>>2]=s}else{C=c[L>>2]|0;if((M|0)==31){N=0}else{N=25-(M>>>1)|0}d:do{if((c[C+4>>2]&-8|0)==(J|0)){O=C}else{K=J<<N;G=C;while(1){P=G+(K>>>31<<2)+16|0;t=c[P>>2]|0;if((t|0)==0){break}if((c[t+4>>2]&-8|0)==(J|0)){O=t;break d}else{K=K<<1;G=t}}if(P>>>0<(c[2200>>2]|0)>>>0){Oa()}else{c[P>>2]=f;c[s+24>>2]=G;c[s+12>>2]=s;c[s+8>>2]=s;break c}}}while(0);C=O+8|0;D=c[C>>2]|0;K=c[2200>>2]|0;if(O>>>0<K>>>0){Oa()}if(D>>>0<K>>>0){Oa()}else{c[D+12>>2]=f;c[C>>2]=f;c[s+8>>2]=D;c[s+12>>2]=O;c[s+24>>2]=0;break}}}while(0);s=(c[2216>>2]|0)+ -1|0;c[2216>>2]=s;if((s|0)==0){Q=2640|0}else{i=b;return}while(1){s=c[Q>>2]|0;if((s|0)==0){break}else{Q=s+8|0}}c[2216>>2]=-1;i=b;return}function Me(a){a=a|0;var b=0;b=i;if((a|0)!=0){Le(a)}i=b;return}function Ne(){}function Oe(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;g=b&3;h=d|d<<8|d<<16|d<<24;i=f&~3;if(g){g=b+4-g|0;while((b|0)<(g|0)){a[b]=d;b=b+1|0}}while((b|0)<(i|0)){c[b>>2]=h;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}return b-e|0}function Pe(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function Qe(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;if((e|0)>=4096)return Ka(b|0,d|0,e|0)|0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function Re(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return Wa[a&7](b|0,c|0,d|0)|0}function Se(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;Xa[a&3](b|0,c|0,d|0,e|0,f|0)}function Te(a,b){a=a|0;b=b|0;Ya[a&31](b|0)}function Ue(a,b,c){a=a|0;b=b|0;c=c|0;Za[a&15](b|0,c|0)}function Ve(a,b){a=a|0;b=b|0;return _a[a&3](b|0)|0}function We(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;$a[a&3](b|0,c|0,d|0)}function Xe(a){a=a|0;ab[a&1]()}function Ye(a,b,c,d){a=a|0;b=b|0;c=c|0;d=+d;bb[a&3](b|0,c|0,+d)}function Ze(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;cb[a&3](b|0,c|0,d|0,e|0,f|0,g|0)}function _e(a,b,c){a=a|0;b=b|0;c=c|0;return db[a&7](b|0,c|0)|0}function $e(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;return eb[a&15](b|0,c|0,d|0,e|0,f|0)|0}function af(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;fb[a&15](b|0,c|0,d|0,e|0)}function bf(a,b,c){a=a|0;b=b|0;c=c|0;_(0);return 0}function cf(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;_(1)}function df(a){a=a|0;_(2)}function ef(a,b){a=a|0;b=b|0;_(3)}function ff(a){a=a|0;_(4);return 0}function gf(a,b,c){a=a|0;b=b|0;c=c|0;_(5)}function hf(){_(6)}function jf(){Ua()}function kf(a,b,c){a=a|0;b=b|0;c=+c;_(7)}function lf(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;_(8)}function mf(a,b){a=a|0;b=b|0;_(9);return 0}function nf(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;_(10);return 0}function of(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;_(11)}




// EMSCRIPTEN_END_FUNCS
var Wa=[bf,nc,uc,zd,Ce,bf,bf,bf];var Xa=[cf,He,Ge,cf];var Ya=[df,zb,Db,Bb,Cb,Sc,dd,Rc,id,Dd,Ed,Id,Jd,Nd,Od,Td,Ud,fe,ge,ke,le,pe,qe,ue,ve,xe,Ae,ye,ze,Be,df,df];var Za=[ef,ed,fd,Ld,ne,se,de,ie,Bd,Gd,ef,ef,ef,ef,ef,ef];var _a=[ff,mc,tc,ff];var $a=[gf,gd,hd,gf];var ab=[hf,jf];var bb=[kf,qc,xc,kf];var cb=[lf,Je,Ie,lf];var db=[mf,lc,rc,xb,_c,mf,mf,mf];var eb=[nf,oc,vc,Kd,me,re,ce,he,Ad,Fd,nf,nf,nf,nf,nf,nf];var fb=[of,pc,wc,Cd,Hd,Md,ee,je,oe,te,De,Ee,of,of,of,of];return{_strlen:Pe,_free:Le,_main:wb,_memset:Oe,_malloc:Ke,_memcpy:Qe,runPostSets:Ne,stackAlloc:gb,stackSave:hb,stackRestore:ib,setThrew:jb,setTempRet0:mb,setTempRet1:nb,setTempRet2:ob,setTempRet3:pb,setTempRet4:qb,setTempRet5:rb,setTempRet6:sb,setTempRet7:tb,setTempRet8:ub,setTempRet9:vb,dynCall_iiii:Re,dynCall_viiiii:Se,dynCall_vi:Te,dynCall_vii:Ue,dynCall_ii:Ve,dynCall_viii:We,dynCall_v:Xe,dynCall_viid:Ye,dynCall_viiiiii:Ze,dynCall_iii:_e,dynCall_iiiiii:$e,dynCall_viiii:af}})


// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_iiii": invoke_iiii, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_viid": invoke_viid, "invoke_viiiiii": invoke_viiiiii, "invoke_iii": invoke_iii, "invoke_iiiiii": invoke_iiiiii, "invoke_viiii": invoke_viiii, "_llvm_lifetime_start": _llvm_lifetime_start, "_cosf": _cosf, "_send": _send, "__ZSt9terminatev": __ZSt9terminatev, "___setErrNo": ___setErrNo, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "_fflush": _fflush, "_pwrite": _pwrite, "__reallyNegative": __reallyNegative, "_sbrk": _sbrk, "___cxa_begin_catch": ___cxa_begin_catch, "_sinf": _sinf, "_fileno": _fileno, "_sysconf": _sysconf, "_clock": _clock, "_llvm_lifetime_end": _llvm_lifetime_end, "_qsort": _qsort, "_printf": _printf, "_floorf": _floorf, "_sqrtf": _sqrtf, "_write": _write, "_emscripten_memcpy_big": _emscripten_memcpy_big, "___errno_location": ___errno_location, "_mkport": _mkport, "__exit": __exit, "_abort": _abort, "_fwrite": _fwrite, "_time": _time, "_fprintf": _fprintf, "__formatString": __formatString, "_exit": _exit, "___cxa_pure_virtual": ___cxa_pure_virtual, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity }, buffer);
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_viid = Module["dynCall_viid"] = asm["dynCall_viid"];
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
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, STATIC_BASE);
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      HEAPU8.set(data, STATIC_BASE);
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

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    ensureInitRuntime();

    preMain();

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

  var extra = '\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.';

  throw 'abort() at ' + stackTrace() + extra;
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






