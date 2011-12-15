var mandreel_total_memory = 67108864;
var mandreel_stack_memory = 1048576;
var mandreel_heap_memory = 65250768; //init_memory = 285232
/////////////////////////////////////////////
// Heap
/////////////////////////////////////////////
var heap;
var heap8;
var heapU8;
var heap16;
var heapU16;
var heap32;
var heapU32;
var heapFloat;
var heapDouble;
var heapNewPos;

var ABORT = false;

var g_mandreel_cache_files = false;


var mandreel_cache_files = [];
var g_mandreel_working_folder = 'DataPC/';
var g_mandreel_datafiles_sufix = '.dat';
var __FUNCTION_TABLE__ = [];
var mandreel_pos_function_table = 1;
function register_delegate(ptr_func) 
{
	var functionId = mandreel_pos_function_table;
	__FUNCTION_TABLE__[functionId] = ptr_func;
	
	mandreel_pos_function_table++;
	return functionId*4;
}


var g_addr_emit = 0;
function emit_start(addr)
{
	g_addr_emit = addr;
}

function emit_8(data)
{
	heapU8[g_addr_emit] = data;	
	g_addr_emit++;
}

function emit_16(data)
{
	heapU16[g_addr_emit>>1] = data;		
	g_addr_emit+=2;
}

function emit_32(data)
{
	heapU32[g_addr_emit>>2] = data;			
	g_addr_emit+=4;
}

function emit_fill(data, size)
{
	var j;
	for (j=0;j<size;j++)
	{
		heapU8[g_addr_emit] = data;			
		g_addr_emit++;
	}			
}

function emit_string(v)
{
	var j;
	var len = v.length;
	var data;
			
	for(j = 0; j < len; j++)
	{
		data = v.charCodeAt(j);
		
		heapU8[g_addr_emit] = data;					
		g_addr_emit++;
	}					
}





var g_stack_pointer = Malloc(mandreel_stack_memory);



var _ZTVN10__cxxabiv117__class_type_infoE = 0;
var _ZTVN10__cxxabiv120__si_class_type_infoE = 0;
var  _ZTVN10__cxxabiv121__vmi_class_type_infoE = 0;


function _assert(sp)
{
	var p0 = heap32[sp>>2];sp+=4;
  var p1 = heap32[sp>>2];sp+=4;
  var line = heap32[sp>>2];sp+=4;
	var name = get_string_from_ptr(p0);
	var file = get_string_from_ptr(p1);
	assert(false, name + file + ' ' + line);
}
__cxa_pure_virtual.__index__ = 0;
function __cxa_pure_virtual()
{
	assert(0);
}

// operator delete[]
function _ZdaPv(sp)
{
	free(sp);
}

// operator delete
function _ZdlPv(sp)
{
	free(sp);
}

// operator new[](unsigned int)
function _Znaj(sp)
{
	malloc(sp);	
}
// operator new[](unsigned int)
function _Znwj(sp)
{
	malloc(sp);		
}

function abort(sp)
{
	assert(0);
}

var r_g0 = 0;
var r_g1 = 0;
var f_g0 = 0;

//isFinite(aux)
//isNaN(aux)

var tlsf_ptr = 0;

function initHeap()
{
	heap = new ArrayBuffer(mandreel_total_memory);
	heap8 = new Int8Array(heap);
	heapU8 = new Uint8Array(heap);
	heap16 = new Int16Array(heap);
	heapU16 = new Uint16Array(heap);
	heap32 = new Int32Array(heap);
	heapU32 = new Uint32Array(heap);
	heapFloat = new Float32Array(heap);
	heapDouble = new Float64Array(heap);
	heapNewPos = 512;
	
	for (var i=0;i<mandreel_total_memory/4;i++)
	{
		heapU32[i] = 0;
	}		
}

function Malloc(bytes)
{
	if ( heap == undefined )
	{
		initHeap();
	}	
	var newOffset = heapNewPos;
	// Always 32 bit aligned
	heapNewPos += ((bytes + 3) & 0xfffffffc);
	
	if (heapNewPos>mandreel_total_memory)
	{
		assert(false);		
	}
	
	return newOffset;
}

function assert(condition, _text) {
//console.assert(condition, _text);
    if (!condition) {
      var text = "Assertion failed: " + _text;
      alert(text + ':\n' + (new Error).stack);
      ABORT = true;
      throw "Assertion: " + text;
    }
  }
  
  function my_assert(sp)
  {
	var p0 = heap32[sp>>2];sp+=4;
  var p1 = heap32[sp>>2];sp+=4;
	//var name = get_string_from_ptr(p1);
	
	assert(false, 'hola');
  }

  function WriteHeapDouble(addr, value)
  {
  //assert((addr&7)==0);
	heapDouble[addr>>3] = value;
  }
  
    function WriteHeapU64(addr, value)
  {
	heap32[addr>>2] = value.l;
	heap32[(addr>>2)+1] = value.h;
  }
		

var arg_test_local = Malloc(8);
function my_arg_test(sp)
{
	var ptr = heapU32[sp>>2];
	var size = heapU32[(sp+4)>>2];
	
	var arg = heapU32[ptr>>2];
	
	
	if (size == 4)
	{
	heap32[ptr>>2] = arg+4;
	
	arg = heap32[arg>>2];
	
	heap32[arg_test_local>>2] = arg;
	
	//dump('my_arg_test ' + arg + ' ' + ptr + '\n');
	
	}
	else
	{
		arg = (arg+7) & ~7;
		 
		heap32[ptr>>2] = arg+8;
	
	//assert((arg&7)==0);
	var value0 = heap32[arg>>2];
	var value1 = heap32[(arg+4)>>2];
	//arg = llvm_readDouble(arg);
	
	//assert((arg_test_local&7)==0);
	
	heap32[arg_test_local>>2] = value0;
	heap32[(arg_test_local+4)>>2] = value1;
	
	//llvm_writeDouble(arg_test_local,arg);
	
	//dump('my_arg_test ' + arg + ' ' + ptr + '\n');
	

	}
	
	
	
	
	r_g0 = arg_test_local;
}




  
  
function uint(value) {
    if (value >= 0) return value;
    return 4294967296 + value;
  }
  


function puts(sp)
{
	var addr = heapU32[sp>>2];
	
	var name = get_string_from_ptr(addr);
	
	name+='\n';
	 
	dump(name);
    
}

function _Z11print_valued(_stack_pos, value)
{
	dump(value);
	dump('\n');
}

function _Z11print_labelPKc(_stack_pos, addr)
{
	puts(_stack_pos,addr);
	dump('\n');
}




function gettimeofday(sp)
  {
  var ptr = heap32[sp>>2];
  var time_ms = Date.now();  
	heap32[ptr>>2] = time_ms/1000;	
	heap32[(ptr>>2)+1] = (time_ms%1000)*1000;
	r_g0 = 0;
  }
  
  
  function free(sp)
  {
	var ptr = heapU32[sp>>2];
  	sp-=8;
	
	heap32[(sp)>>2] = tlsf_ptr;
	heap32[(sp+4)>>2] = ptr;
	tlsf_free(sp);	
  }
  
  function malloc_size(sp)
  {
  var ptr = heapU32[sp>>2];
  
	sp-=4;
	
	heap32[(sp)>>2] = ptr;	
	tlsf_block_size(sp);			
  }

  
  function realloc(sp)
  {
	var ptr = heapU32[sp>>2];
	var size = heapU32[(sp+4)>>2];
	
	//assert(ptr == 0);
	
	sp-=12;
	
	//dump('realloc ' + sp + ' ' + ptr + ' ' + size + '\n');
	
	heap32[(sp)>>2] = tlsf_ptr;
	heap32[(sp+4)>>2] = ptr;
	heap32[(sp+8)>>2] = size;
	tlsf_realloc(sp);	
	
	//dump('return ' + r_g0 + '\n');
  }
  
  var llvm_double_addr = Malloc(8);
  
  function llvm_writeDouble(addr,src)
  {  
  //assert((llvm_double_addr&7)==0);
	heapDouble[llvm_double_addr>>3] = src;
	
	//assert((addr&7)==0);
	
	var val0 = heap32[(llvm_double_addr)>>2];
	var val1 = heap32[(llvm_double_addr+4)>>2];
	
	heap32[(addr)>>2] = val0;
	heap32[(addr+4)>>2] = val1;
  }
  
  function llvm_readDouble(addr)
  {
  	//assert((addr&7)==0);

	var val0 = heap32[(addr)>>2];
	var val1 = heap32[(addr+4)>>2];
	
	heap32[(llvm_double_addr)>>2] = val0;
	heap32[(llvm_double_addr+4)>>2] = val1;
	
	
//	assert((llvm_double_addr&7)==0);
	var result = heapDouble[llvm_double_addr>>3];
	
	
	return result;
	
  }
  
  function llvm_move_double(addr_dst, addr_src)
  {
  	
	var val0 = heapU32[(addr_src)>>2];
	var val1 = heapU32[(addr_src+4)>>2];
	
	heapU32[(addr_dst)>>2] = val0;
	heapU32[(addr_dst+4)>>2] = val1;
		
  }
  
  function llvm_move_float(addr_dst, addr_src)
  {
	heapU32[(addr_dst)] = heapU32[(addr_src)];		
  }
  
  function malloc(sp)
  {
	var size = heapU32[sp>>2];
	
	if (size == 0)
	{
		size = 4;
	}
  
  
	if (tlsf_ptr == 0)
	{
		var addr = Malloc(mandreel_heap_memory);
		
		sp-=8;
		heap32[(sp)>>2] = addr;
		heap32[(sp+4)>>2] = mandreel_heap_memory;
		tlsf_create(sp);
		tlsf_ptr = r_g0;
	}
   
	sp-=8;
	
	heap32[(sp)>>2] = tlsf_ptr;
	heap32[(sp+4)>>2] = size;
	tlsf_malloc(sp);	
	
	if (r_g0 == 0)
	{
		dump('malloc failed ' + size + '\n');
		assert(false);
	}
  }
  
  
   function log10f(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.log(value)/Math.LN10;
  }
  
   function log10(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.log(value)/Math.LN10;
  }

function logf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.log(value);
  }
  
  function log(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.log(value);
  }

  
  
  function cosf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.cos(value);
	//assert (isNaN(f_g0) == false);
  }
  
  function acosf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.acos(value);
  }
  
  function asinf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.asin(value);
  }
  
  function asin(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.asin(value);
  }
  
  function acos(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.acos(value);
  }
  
  function floor(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.floor(value);
  }
  
  function floorf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.floor(value);
  }
  
  function round(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.round(value);
  }
  
  function roundf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.round(value);
  }
  
  function ceilf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.ceil(value);
  }
  
  function ceil(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.ceil(value);
  }
  
  
  function exp2(sp)
  {
  var value = heapDouble[sp>>3];
  
	f_g0 = Math.pow(2,value);
  }
  
  function exp2f(sp)
  {
  var value = heapFloat[sp>>2];
  
	f_g0 = Math.pow(2,value);
  }
  
  
  
  function pow(sp)
  {
  var value = heapDouble[sp>>3];
  var value2 = heapDouble[(sp+8)>>3];
	f_g0 = Math.pow(value,value2);
  }
  
  function powf(sp)
  {
  var value = heapFloat[sp>>2];
  var value2 = heapFloat[(sp+4)>>2];
	f_g0 = Math.pow(value,value2);
  }
  
  function cos(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.cos(value);
	//assert (isNaN(f_g0) == false);
  }
  
  function tan(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.tan(value);
	//assert (isNaN(f_g0) == false);
  }
  
   function sinf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.sin(value);
	
	//assert (isNaN(f_g0) == false);
  }
  
  function expf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.exp(value);	
  }
  
  function exp(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.exp(value);	
  }
  
  function tanf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.tan(value);
  }
 
 function atanf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.atan(value);
  }
  
  function atan(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.atan(value);
  }
   
  function abs(sp)
  {  
  var value = heap32[sp>>2];
  if (value<0)
  r_g0 = -value;
  else
  r_g0 = value;	
  }
  
  function sin(sp)
  {  
  var value = heapDouble[sp>>3];
	f_g0 = Math.sin(value);
  }
  
  function sqrtf(sp)
  {
  var value = heapFloat[sp>>2];
	f_g0 = Math.sqrt(value);
  }
  
  function sqrt(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.sqrt(value);
  }
  
  function fmod(sp)
  {
  var value = heapDouble[sp>>3];sp+=8;
  var value2 = heapDouble[sp>>3];
	f_g0 = value % value2;
  }
  
   function fmodf(sp)
  {
  var value = heapFloat[sp>>2];sp+=4;
  var value2 = heapFloat[sp>>2];
	f_g0 = value % value2;
  }


  function atan2f(sp)
  {
  var x = heapFloat[sp>>2];sp+=4;
  var y = heapFloat[sp>>2];
	f_g0 = Math.atan2(x,y);
  }
  
  function atan2(sp)
  {
  var x = heapDouble[sp>>3];
  var y = heapDouble[(sp+8)>>3];
	f_g0 = Math.atan2(x,y);
  }
  
  function fabs(sp)
  {
  var value = heapDouble[sp>>3];
	f_g0 = Math.abs(value);
  }
  
  
  function _Z18OutputDebugStringAPKc(sp)
  {
  puts(sp);
	
  }
  
  
  function getenv(sp)
  {
  r_g0 = 0;
  }

  
  function mandreel_fcmp_ord(X, Y)
  {
	return (X == X && Y == Y);
  }
  
  function mandreel_fcmp_uno(X, Y)
{
    
        return (X != X || Y != Y);    
}

var llvm_errno = Malloc(4);
function _errno(sp)
{
	r_g0 = llvm_errno;
}




if (!window["dump"])
	window["dump"] = function dump(str){console.log(str)} ;



  
  function get_string_from_ptr(ptr)
  {
	var ret = "";
	
	if (ptr == 0)
		return ret;
	
	var i = 0;
	while (1) {
  //    if ((ptr.pos + i) >= ptr.slab.length) { return "<< Invalid read: " + (ptr.pos+i) + " : " + ptr.slab.length + " >>"; } else {}
	if (heapU8[ptr + i] == 0)
		break;
  
      var t = String.fromCharCode(heapU8[ptr + i]);      
      ret += t;
      i += 1;
    }
		
	return ret;
  }
  
  function fill_ptr_from_string(ptr, v)
  {
	var j;
	var len = v.length;
	var data;
	
  	for(j = 0; j < len; j++)
	{
		data = v.charCodeAt(j);
		
		heapU8[ptr] = data;					
		ptr++;
	}				
		heapU8[ptr] = 0;
	}
  
  var file_ids = [];
  var current_file_id = 20;
  
  function create_file_id(buffer)
  {
	this.buffer = buffer;
	this.offset = 0;
	this.byteArray = new Uint8Array(buffer);
  }
  
  function mandreel_rewind(sp)
  {
  var file_id = heap32[sp>>2];sp+=4;
  
  file_ids[file_id].offset = 0;
	
	r_g0 = 0;
	
	//return 0;
  }
  
  
  function mandreel_fseek(sp)
  {
  var file_id = heap32[sp>>2];sp+=4;
  var pos = heap32[sp>>2];sp+=4;
  var type = heap32[sp>>2];sp+=4;
  
	if (type == 2)
	{
		file_ids[file_id].offset = file_ids[file_id].buffer.byteLength + pos;
	}
	else if (type == 1)
	{
		file_ids[file_id].offset = file_ids[file_id].offset + pos;

	}
	else if (type == 0)
	{
		file_ids[file_id].offset = pos;

	}
	
	r_g0 = 0;
	
	//return 0;
  }
  
  function mandreel_fclose(sp)
  {
  var file_id = heap32[sp>>2];sp+=4;
  
	file_ids[file_id] = null;
	r_g0 = 0;
	//return 0;
  }
  
  
  
  function mandreel_feof(sp)
  {
  var file_id = heap32[sp>>2];sp+=4;
  
  var offset = file_ids[file_id].offset;
  var total = file_ids[file_id].buffer.byteLength;
  
  if (offset>=total)
  r_g0 = 1;
  else
  r_g0 = 0;
  
  }
  
  function mandreel_getc(sp) 
  {  
  var file_id = heap32[sp>>2];sp+=4;
  
  
  var offset = file_ids[file_id].offset;
  
  
	var buffer = file_ids[file_id].buffer;
	
	var byteArray = file_ids[file_id].byteArray;
	
	var total = 1;
	
	var result;
		
	if ((offset+total)>buffer.byteLength)
	{
		result = -1;
	}
	else
	{		
		result = byteArray[offset];		
		file_ids[file_id].offset+=total;
	}
			
	r_g0 = result;	
  }
  
  
  
  function mandreel_fread(sp)
  {
  var ptr = heap32[sp>>2];sp+=4;
  var size = heap32[sp>>2];sp+=4;
  var count = heap32[sp>>2];sp+=4;
  var file_id = heap32[sp>>2];sp+=4;
  
  var offset = file_ids[file_id].offset;
  
  //dump('fread ' + ptr + ' ' + size + ' ' + count + ' ' + file_id + ' ' + offset + '\n');
  
	var buffer = file_ids[file_id].buffer;
	
	var total = size*count;
	
	if ((offset+total)>buffer.byteLength)
		total = buffer.byteLength-offset;
	
	var byteArray = file_ids[file_id].byteArray;
	
	
	var sub_array = byteArray.subarray(offset, offset+total);
	
	heapU8.set(sub_array,ptr);
	

	//heapU8.set(byteArray, ptr);
	//for (var i=0;i<total;++i)
	//{
//		heapU8[ptr+i] = byteArray[i+offset];
//	}
	
	
	file_ids[file_id].offset+=total;
	
	r_g0 = total/size;	
	//return total;
  }
  
  function mandreel_ftell(sp)
  {	
  var file_id = heap32[sp>>2];sp+=4;
  
	var value = file_ids[file_id].offset;
	//dump('offset ftell ' + value + '\n');
	r_g0 = value;
	//return value;
  }
  
  function mandreel_ungetc(sp)
  {
	var my_char = heap32[sp>>2];sp+=4;  
	var file_id = heap32[sp>>2];sp+=4;
	
	var offset = file_ids[file_id].offset-1;
	
	var byteArray = file_ids[file_id].byteArray;
	
	assert(byteArray[offset] == my_char);
	
	file_ids[file_id].offset = offset;	
	
	return my_char;
  }
  function mandreel_fopen(sp)
  {
  var ptr_name = heap32[sp>>2];sp+=4;
  var ptr_flags = heap32[sp>>2];sp+=4;
  
  
	var name = get_string_from_ptr(ptr_name);
	var flags = get_string_from_ptr(ptr_flags);
	//dump('fopen\n');
	//dump(name);
	//dump('\n');
	//dump(flags);
	//dump('\n');

	var buffer;

	var full_name;
	
	name = name.toLowerCase();

	
	full_name	= g_mandreel_working_folder + name + g_mandreel_datafiles_sufix;
	
	buffer =mandreel_cache_files[name];
	
	if (buffer == null)
	{
	
	var xhr = new XMLHttpRequest();  
		
	
	xhr.open("GET", full_name, false);  
	
	
	if("responseType" in xhr)
		xhr.responseType="arraybuffer";
    else
	{		
		xhr.overrideMimeType('text/plain; charset=x-user-defined');
	}
	 				
	
	try{
	xhr.send(null); 
	}catch(e)
	{
	//dump('\nerror opening file ' + full_name + '\n');
	r_g0 = 0;
	return;
	}
	
	//dump(xhr.status);
	
	if (xhr.status == 404)
	{
	//dump('\nerror opening file ' + full_name + '\n');
	r_g0 = 0;
	return;
	}
	
	

	if (xhr.responseType=="arraybuffer")
		buffer=xhr.response;
	else if (xhr.mozResponseArrayBuffer != null)
		buffer = xhr.mozResponseArrayBuffer;  
	else
		buffer=xhr.response;
		
		if (g_mandreel_cache_files)
			mandreel_cache_files[name] = buffer;
	}	
	
	
	//dump(mandreel_cache_files);
		
		
	if (buffer == null)
	{
		//dump('\nerror opening file ' + full_name + '\n');
		r_g0 = 0;
		return;
	}
	
	//dump('\nopening file ' + full_name + ' ' + buffer.byteLength + '\n');
	
	
	file_ids[current_file_id] = new create_file_id(buffer);
	
	var old_id = current_file_id;
	current_file_id++;

	r_g0 = old_id;
	//return old_id;
  }

  function llvm_store_unalign32_float(addr, value)
  {
	heapFloat[0] = value;
	var data = heap32[0];
	heap8[addr] = data&0xff;
	heap8[addr+1] = (data>>>8)&0xff;
	heap8[addr+2] = (data>>>16)&0xff;
	heap8[addr+3] = (data>>>24)&0xff;
  }
  function llvm_store_unalign32(addr, value)
  {
	heap8[addr] = value&0xff;
	heap8[addr+1] = (value>>>8)&0xff;
	heap8[addr+2] = (value>>>16)&0xff;
	heap8[addr+3] = (value>>>24)&0xff;			
  }
  
  function llvm_read_unalign32(addr)
  {
	var value;
	value = heapU8[addr];
	value |= heapU8[addr+1]<<8;
	value |= heapU8[addr+2]<<16;
	value |= heapU8[addr+3]<<24;
	return value;
  }
  
  function llvm_read_unalign32_float(addr)
  {
	var value;
	value = heapU8[addr];
	value |= heapU8[addr+1]<<8;
	value |= heapU8[addr+2]<<16;
	value |= heapU8[addr+3]<<24;
	
	heap32[0] = value;
	return  heapFloat[0];	
  }

  function mandreel_getlocalstorage()
  {
	return window.localStorage;
	//return window.sessionStorage;
  }

  function mandreel_openls(sp)
  {
	var ptr_name = heap32[sp>>2];sp+=4;  
  
	var key = get_string_from_ptr(ptr_name);
	
	var my_localStorage = mandreel_getlocalstorage();
	
	var value = my_localStorage.getItem(key);
	
	if (value == null)
	{	
		r_g0 = -1;
		return;
	}
	
	
	var length = my_localStorage.getItem(key + '_size');
	
	if (length == null)
	{			
		r_g0 = -1;
		return;
	}
	
	
	
	
	dump('mandreel_openls ' + key + ' return ' + length);
		
	
	r_g0 = parseInt(length);
	
	
	
	return;
	
  }
  
  function mandreel_readls(sp)
  {
	var ptr_name = heap32[sp>>2];sp+=4;  
	var data_dst = heap32[sp>>2];sp+=4;  
	var data_len = heap32[sp>>2];sp+=4;  
  
	var key = get_string_from_ptr(ptr_name);
	
	var my_localStorage = mandreel_getlocalstorage();
	
	var value = my_localStorage.getItem(key);
	
	var data = JSON.parse(value);
	
	
	for (var i=0;i<data_len;++i)
	{
		heapU8[data_dst+i] = data[i];
	}
	
	r_g0 =  data_len;	
	return;
		
}

function mandreel_removels(sp)
 {
 var ptr_name_a = heap32[sp>>2];sp+=4;  
 var key_a = get_string_from_ptr(ptr_name_a);
 
 var my_localStorage = mandreel_getlocalstorage();

	my_localStorage.removeItem(key_a);
	my_localStorage.removeItem(key_a + '_size');
	r_g0 = 0; 

 }
 

function mandreel_renamels(sp)
 {
 var ptr_name_a = heap32[sp>>2];sp+=4;  
  var ptr_name_b = heap32[sp>>2];sp+=4;  
  
  var key_a = get_string_from_ptr(ptr_name_a);
  var key_b = get_string_from_ptr(ptr_name_b);
  
  var my_localStorage = mandreel_getlocalstorage();
    
  
  var value = my_localStorage.getItem(key_a);  
  var value2 = my_localStorage.getItem(key_a + '_size');
  
  if (value != null && value2 != null)
  {
	my_localStorage.setItem(key_b, value);
	my_localStorage.setItem(key_b + '_size', value2);
  
	my_localStorage.removeItem(key_a);
	my_localStorage.removeItem(key_a + '_size');
	
  
	r_g0 = 0;
}
else
 r_g0 = -1;
 }

function mandreel_writels(sp)
  {
	var ptr_name = heap32[sp>>2];sp+=4;  
	var data_src = heap32[sp>>2];sp+=4;  
	var data_len = heap32[sp>>2];sp+=4;  
  
	var key = get_string_from_ptr(ptr_name);
	


	var data = new Uint8Array(heap,data_src,data_len);		
	
	var value = JSON.stringify(data);
	
	var my_localStorage = mandreel_getlocalstorage();
				
	try 
	{
		my_localStorage.setItem(key, value);
	} catch(e) 
	{
		dump('error saving ' + key);
		dump(e.message);
		r_g0 =  0;	
		return;
	}
	
	try 
	{
		my_localStorage.setItem(key + '_size', data_len);
	} catch(e) 
	{	
		dump('error saving ' + key);
		dump(e.message);
		r_g0 =  0;	
		return;
	}
	
	
	r_g0 =  data_len;	
	return;
		
}

function mandreel_call_constructors(_ptr, size,stackPos)
{
var ptr = _ptr;

ptr = ptr >> 2;

for (var i=0;i<size;++i)
{


var tag = heap32[ptr];
var ptr_id = heap32[ptr+1];	

__FUNCTION_TABLE__[(ptr_id)>>2](stackPos);

ptr+=2;

}
}

function get_string_from_wptr(ptr)
  {
	var ret = "";
	
	if (ptr == 0)
		return ret;
	
	assert((ptr&1)==0);
	ptr>>=1;
	var i = 0;
	while (1) {
  //    if ((ptr.pos + i) >= ptr.slab.length) { return "<< Invalid read: " + (ptr.pos+i) + " : " + ptr.slab.length + " >>"; } else {}
	if (heapU16[ptr + i] == 0)
		break;
  
      var t = String.fromCharCode(heapU16[ptr + i]);
     // if (t == "\0") { break; } else {}
      ret += t;
      i += 1;
    }
		
	return ret;
  }
  
  function fill_wptr_from_string(ptr, v)
  {
	var j;
	var len = v.length;
	var data;
	
	assert((ptr&1)==0);
	ptr>>=1;
	
  	for(j = 0; j < len; j++)
	{
		data = v.charCodeAt(j);
		
		heapU16[ptr] = data;					
		ptr++;
	}				
		heapU16[ptr] = 0;
	}

function mandreelInterGetParams(sp)
{
	var params = [];	
	
	var offset = 0;
	for (i=1;i<arguments.length;++i)
	{		
		var type = arguments[i];
				
		switch(type)
		{
			case 'int':
				params[i-1] = heap32[(sp+offset)>>2];				
				break;
			case 'float':
				params[i-1] = heapFloat[(sp+offset)>>2];				
				break;
			case 'string':				
				params[i-1] = get_string_from_ptr(heap32[(sp+offset)>>2]);				
				break;
			default:
				assert(false);
		}		
		offset+=4;
	}
	
	return params;
}

function mandreelInterRetParam(type, value)
{
	switch(type)
	{
		case 'int':
			r_g0 = value;
			break;
		case 'float':
			f_g0 = value;
			break;
		default:
			assert(false);
	}
	
	return 0;
}

function MandreelInterGetFunctionPtr(value)
{
	return __FUNCTION_TABLE__[value >> 2];
}


function MandreelInterCallFunction(returnType,func_name)
{
	var size_params = 0;
	
	var i;
	var num_params = (arguments.length-2)/2;
	num_params|=0;	
	for (i=2;i<num_params*2+2;i+=2)
	{		
		var type = arguments[i];
		
		var size_arg = 0;		
		switch(type)
		{
			case 'int':
				size_arg = 4;
				break;
			case 'float':
				size_arg = 4;
				break;
			case 'string':				
				size_arg = 4;
				size_arg += ((arguments[i+1].length + 4) & 0xfffffffc);					
				break;
			case 'wstring':				
				size_arg = 4;
				size_arg += ((arguments[i+1].length*2 + 4) & 0xfffffffc);			
				break;				
			default:
				assert(false);
		}
		
		size_params += size_arg;	
	}	
		
	// stack always 8 byte aligned
	size_params=((size_params+7)& 0xfffffff8);	
	
	var sp = 0;
	
	if (i<(arguments.length))
		sp = arguments[i];
	else
		sp = g_stack_pointer+800*1024;
		
	sp-=size_params;	
		
	var offset = 0;
	var ptr_data = num_params*4+sp;
    for (i=2;i<num_params*2+2;i+=2)
	{
		var type = arguments[i];
		
		var size_arg = 0;
		switch(type)
		{
			case 'int':
				heap32[(sp+offset)>>2] = arguments[i+1];
				break;
			case 'float':
				heapFloat[(sp+offset)>>2] = arguments[i+1];				
				break;
			case 'string':
				{
					heap32[(sp+offset)>>2] = ptr_data;	
					var string = arguments[i+1];
					fill_ptr_from_string(ptr_data,string);
					
					ptr_data += ((string.length + 4) & 0xfffffffc);	
				}				
				break;
			case 'wstring':
				{
					MandreelInterWriteInt((sp+offset),ptr_data);	
					var string = arguments[i+1];
					MandreelInterWriteWString(ptr_data,string);
					
					ptr_data += ((string.length*2 + 4) & 0xfffffffc);	
				}				
				break;
			default:
				assert(false);
		}		
		offset+=4;
	}		
	
	window[func_name](sp);
	
	if (returnType == 'int')
		return r_g0;
	else if (returnType == 'float')
		return f_g0;
	else
	{
		assert(returnType == 'void');
		return;
	}
}


function MandreelInterCallFunctionPtr(returnType,func_ptr)
{
	var size_params = 0;
	
	var i;
	var num_params = (arguments.length-2)/2;
	num_params|=0;	
	for (i=2;i<num_params*2+2;i+=2)
	{		
		var type = arguments[i];
		
		var size_arg = 0;		
		switch(type)
		{
			case 'int':
				size_arg = 4;
				break;
			case 'float':
				size_arg = 4;
				break;
			case 'string':				
				size_arg = 4;
				size_arg += ((arguments[i+1].length + 4) & 0xfffffffc);					
				break;
			case 'wstring':				
				size_arg = 4;
				size_arg += ((arguments[i+1].length*2 + 4) & 0xfffffffc);			
				break;				
			default:
				assert(false);
		}
		
		size_params += size_arg;	
	}	
		
	// stack always 8 byte aligned
	size_params=((size_params+7)& 0xfffffff8);	
	
	var sp = 0;
	
	if (i<(arguments.length))
		sp = arguments[i];
	else
		sp = g_stack_pointer+800*1024;
		
	sp-=size_params;	
		
	var offset = 0;
	var ptr_data = num_params*4+sp;
    for (i=2;i<num_params*2+2;i+=2)
	{
		var type = arguments[i];
		
		var size_arg = 0;
		switch(type)
		{
			case 'int':
				heap32[(sp+offset)>>2] = arguments[i+1];
				break;
			case 'float':
				heapFloat[(sp+offset)>>2] = arguments[i+1];				
				break;
			case 'string':
				{
					heap32[(sp+offset)>>2] = ptr_data;	
					var string = arguments[i+1];
					fill_ptr_from_string(ptr_data,string);
					
					ptr_data += ((string.length + 4) & 0xfffffffc);	
				}				
				break;
			case 'wstring':
				{
					MandreelInterWriteInt((sp+offset),ptr_data);	
					var string = arguments[i+1];
					MandreelInterWriteWString(ptr_data,string);
					
					ptr_data += ((string.length*2 + 4) & 0xfffffffc);	
				}				
				break;
			default:
				assert(false);
		}		
		offset+=4;
	}		
	
	__FUNCTION_TABLE__[(func_ptr)>>2](sp);
	
	if (returnType == 'int')
		return r_g0;
	else if (returnType == 'float')
		return f_g0;
	else
	{
		assert(returnType == 'void');
		return;
	}
}


var MANDREEL_HTTP_REQUEST_MODE_GET = 0;
var MANDREEL_HTTP_REQUEST_MODE_POST = 1;
var MANDREEL_HTTP_REQUEST_MODE_PUT = 2;

var MANDREEL_HTTP_REQUEST_STATUS_ERROR = 0;
var MANDREEL_HTTP_REQUEST_STATUS_BUSY = 1;
var MANDREEL_HTTP_REQUEST_STATUS_FINISHED = 2;
var MANDREEL_HTTP_REQUEST_STATUS_INIT = 3;


var mandreel_js_mapping_ids = [];
var mandreel_js_mapping_ids_free = [];


function Mandreel_HttpRequest_Create(sp)
{
	var ptr_url = heap32[sp>>2];sp+=4;
	var type = heap32[sp>>2];sp+=4;
  
  
	var url = get_string_from_ptr(ptr_url);
	
	
	var str_type = 'GET';
	if (type == MANDREEL_HTTP_REQUEST_MODE_GET)
		str_type = 'GET';
	else if (type == MANDREEL_HTTP_REQUEST_MODE_PUT)
		str_type = 'PUT';
	else if (type == MANDREEL_HTTP_REQUEST_MODE_POST)
		str_type = 'POST';
	
	var xmlhttp_get = new XMLHttpRequest();			
	xmlhttp_get.open(str_type,url);       

	if("responseType" in xmlhttp_get)
		xmlhttp_get.responseType="arraybuffer";
    else
	{		
		xmlhttp_get.overrideMimeType('text/plain; charset=x-user-defined');
	}	
				
	if (mandreel_js_mapping_ids_free.length == 0)
		mandreel_js_mapping_ids_free.push(mandreel_js_mapping_ids.length);
		
	var new_id = mandreel_js_mapping_ids_free.pop();
	
	var my_state = {    
	buffer : null,
	httpRequest : xmlhttp_get,
	status : MANDREEL_HTTP_REQUEST_STATUS_INIT,
	offset_read : 0
  };
  
  
	
	mandreel_js_mapping_ids[new_id] = my_state;
	
	r_g0 = new_id+1;
}

function Mandreel_HttpRequest_Send(sp)
{
	var _id = heap32[sp>>2];sp+=4;
	var ptr_data = heap32[sp>>2];sp+=4;
	var id = _id-1;
	
	var data;

	if (ptr_data)
		data = get_string_from_ptr(ptr_data);
	else
		data = null;
	
	var my_state = mandreel_js_mapping_ids[id];
	
	
	my_state.status = MANDREEL_HTTP_REQUEST_STATUS_BUSY;
	
	my_state.httpRequest.onreadystatechange = function() 
	{
		if (my_state.httpRequest.readyState==4)    
		{
			if (my_state.httpRequest.status==200)
			{				
				var buffer;
				
				if (my_state.httpRequest.responseType=="arraybuffer")
					buffer=my_state.httpRequest.response;
				else if (my_state.httpRequest.mozResponseArrayBuffer != null)
					buffer = my_state.httpRequest.mozResponseArrayBuffer;  
				else
					buffer=my_state.httpRequest.response;
			
				my_state.status = MANDREEL_HTTP_REQUEST_STATUS_FINISHED;
				my_state.buffer =  new Uint8Array(buffer);
				//alert(my_state.buffer.length);
				
				//alert(mandreel_js_mapping_ids[id].buffer);
				
			}			
			else
				my_state.status = MANDREEL_HTTP_REQUEST_STATUS_ERROR;
		}
	}
	
	my_state.httpRequest.send(data);
}


function Mandreel_HttpRequest_Status(sp)
{
	var _id = heap32[sp>>2];sp+=4;
	var id = _id-1;
	
	
	r_g0 = mandreel_js_mapping_ids[id].status;
}

function Mandreel_HttpRequest_Read(sp)
{
	var _id = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	var size = heap32[sp>>2];sp+=4;
	var id = _id-1;
	
	var remaining_bytes =  mandreel_js_mapping_ids[id].buffer.length - mandreel_js_mapping_ids[id].offset_read;

	if (size>remaining_bytes)
		size = remaining_bytes;
		
	var sub_array = mandreel_js_mapping_ids[id].buffer.subarray(mandreel_js_mapping_ids[id].offset_read, mandreel_js_mapping_ids[id].offset_read+size);	
	heapU8.set(sub_array,ptr);
		
	mandreel_js_mapping_ids[id].offset_read+=size;
	
	r_g0 = size;
}

function Mandreel_HttpRequest_BytesAvalable(sp)
{
	var _id = heap32[sp>>2];sp+=4;
	var id = _id-1;
	
	
	if (mandreel_js_mapping_ids[id].buffer)	
		r_g0 = mandreel_js_mapping_ids[id].buffer.length - mandreel_js_mapping_ids[id].offset_read;
	else
		r_g0 = 0;
}

function Mandreel_HttpRequest_Close(sp)
{
	var _id = heap32[sp>>2];sp+=4;
	var id = _id-1;
	
	mandreel_js_mapping_ids[id] = null;
	mandreel_js_mapping_ids_free.push(id);
}

function Mandreel_HttpRequest_SetRequestHeader(sp)
{
	var _id = heap32[sp>>2];sp+=4;
	var ptr_a = heap32[sp>>2];sp+=4;
	var ptr_b = heap32[sp>>2];sp+=4;
	var id = _id-1;
	
	var str_a = get_string_from_ptr(ptr_a);
	var str_b = get_string_from_ptr(ptr_b);
	
	var my_state = mandreel_js_mapping_ids[id];
	
	my_state.httpRequest.setRequestHeader(str_a, str_b);
}


var Mandreel_TextureAsync_textures = 0;
var Mandreel_TextureAsync_textures_loaded = 0;
function Mandreel_TextureAsync_SetData(sp)
{
	var texture_id = heap32[sp>>2];sp+=4;
	
	var tex = array_ids_ogl[texture_id];	
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
	
	tex.image = null;
}

function Mandreel_TextureAsync_CheckPending(sp)
{
	r_g0 = Mandreel_TextureAsync_textures - Mandreel_TextureAsync_textures_loaded;
}

function Mandreel_TextureAsync_GetProperties(sp)
{	
	var texture_id = heap32[sp>>2];sp+=4;
	var ptr_width = heap32[sp>>2];sp+=4;
	var ptr_height = heap32[sp>>2];sp+=4;
	
	var tex = array_ids_ogl[texture_id];	
	
	if (tex == null || tex.mandreel_width == undefined)
		r_g0 = 0;
	else
	{
		heap32[ptr_width>>2] = tex.mandreel_width;
		heap32[ptr_height>>2] = tex.mandreel_height;
		r_g0 = 1;
	}
}

function Mandreel_TextureAsync_Load(sp)
{
	var ptr_name = heap32[sp>>2];sp+=4;
	var texture_id = heap32[sp>>2];sp+=4;
	
	var name = get_string_from_ptr(ptr_name);
	
	name = name.toLowerCase();

	
	var full_name	= g_mandreel_working_folder + name;
	
	var image  = new Image();
	
	
	Mandreel_TextureAsync_textures++;
			
	
	image.onerror = function() {
          dump('error loading texture ' + image.src + '\n');
		  Mandreel_TextureAsync_textures_loaded++;
      }
	image.onload = function() 	
	{	
		var tex = array_ids_ogl[texture_id];	
		
		tex.image = image;
		tex.mandreel_width = image.width;
		tex.mandreel_height = image.height;
		
		Mandreel_TextureAsync_textures_loaded++;
			
		MandreelInterCallFunction('void',"Mandreel_TextureAsync_Loaded",'int',texture_id,'int',image.width,'int',image.height);
				
	}
	
	image.src = full_name;
}

function __sandbox_OutputDebugString(sp)
{
	puts(sp);
}




var MANDREELCALLJS_TYPE_RETURN_VOID = 0;
var MANDREELCALLJS_TYPE_INT = 1;
var MANDREELCALLJS_TYPE_FLOAT =  2;
var MANDREELCALLJS_TYPE_STRING =  3;
var MANDREELCALLJS_TYPE_RETURN_INT =  4;
var MANDREELCALLJS_TYPE_RETURN_FLOAT =  5;

function MandreelInterWriteString(ptr, value)
{
	fill_ptr_from_string(ptr,value);
}

function MandreelInterWriteWString(ptr, value)
{	
	fill_wptr_from_string(ptr, value);
}

function MandreelInterWriteFloat(ptr, value)
{
	heapFloat[ptr>>2] = value;
}

function MandreelLockFrame()
{	
}

function MandreelUnlockFrame()
{
}

function MandreelInterGetGlobalStack()
{
	return g_stack_pointer;
}

function MandreelInterWriteInt(ptr, value)
{
	heap32[ptr>>2] = value;
}

function MandreelInterStringFromWPtr(ptr)
{
	return get_string_from_wptr(ptr);
}

function MandreelInterStringFromPtr(ptr)
{
	return get_string_from_ptr(ptr);
}

function mandreel_my_call_external_array(method, params)
{
	var result	
	var resultString;	
	try 
	{
		switch(params.length)
		{
			case 1:
				resultString = window[method](params[0]);			
				break;
			case 2:
				resultString = window[method](params[0],params[1]);			
				break;
			case 3:
				resultString = window[method](params[0],params[1],params[2]);			
				break;
			case 4:
				resultString = window[method](params[0],params[1],params[2],params[3]);			
				break;				
			case 5:
				resultString = window[method](params[0],params[1],params[2],params[3],params[4]);			
				break;								
			case 6:
				resultString = window[method](params[0],params[1],params[2],params[3],params[4],params[5]);			
				break;												
			case 7:
				resultString = window[method](params[0],params[1],params[2],params[3],params[4],params[5],params[6]);			
				break;																
			case 8:
				resultString = window[method](params[0],params[1],params[2],params[3],params[4],params[5],params[6],params[7]);			
				break;						
			default:
				assert(false);
		}		
		result = 0;
	} catch(e) { dump(e); result = 1;}
	
	return [result,resultString];
}


function Mandreel_InterJS_Call(sp)
{
	var new_sp = sp;
	var method_ptr = heap32[sp>>2];sp+=4; 		
	var method = get_string_from_ptr(method_ptr);
	
	var params = new Array();
		
	
	params.push(new_sp);
	
	var var_int;
	var var_string;
	var var_double;
	
	var return_type;
	var return_ptr;
	while (true)
	{
		var my_type = heap32[sp>>2];sp+=4;
				
		
		if (my_type == MANDREELCALLJS_TYPE_RETURN_VOID)
		{
			return_type = my_type;
			break;
		}
		else if (my_type == MANDREELCALLJS_TYPE_INT)
		{
			var_int = heap32[sp>>2];
						
			params.push(var_int);
			sp+=4;
		}
		else if (my_type == MANDREELCALLJS_TYPE_FLOAT)
		{
			sp = (sp+7) & ~7;
			
			var_double = llvm_readDouble(sp);
					
			params.push(var_double);
			sp+=8;
		}
		else if (my_type == MANDREELCALLJS_TYPE_STRING)
		{
			var_int = heap32[sp>>2];
			var_string = get_string_from_ptr(var_int);
						
			params.push(var_string);
			sp+=4;
		}		
		else if (my_type == MANDREELCALLJS_TYPE_RETURN_INT)
		{
			return_type = my_type;
			return_ptr = heap32[sp>>2];
			break;
		}
		else if (my_type == MANDREELCALLJS_TYPE_RETURN_FLOAT)
		{
			return_type = my_type;
			return_ptr = heap32[sp>>2];
			break;
		}
		else
		{			
			assert(false);
		}
	}
	
	var result = mandreel_my_call_external_array(method,params);	
	
	r_g0 = result[0];	
	
	
	if (r_g0 == 0)
	{
		if (return_type == MANDREELCALLJS_TYPE_RETURN_INT)
		{
			heap32[return_ptr>>2] = result[1];
		}
		else if (return_type == MANDREELCALLJS_TYPE_RETURN_FLOAT)
		{
			heapFloat[return_ptr>>2] = result[1];			
		}
		
	}
}

function iMandreelRegisterExternalCallback()
{
}

function __mandreel_internal_CreateWindow()
{
}

var array_ids_ogl = [];

var max_ogl_id = 8192;

var array_ids_ogl_enable = [];
var g_current_program_id = 0;


var uniformArrays2 = [];
var uniformArrays3 = [];
var uniformArrays4 = [];
var uniformArraysCreated = 0;
var mandreel_draw_enable = true;

function myglCreateUniformArrays()
{
	if ( uniformArraysCreated == 0 )
	{
		for(var i=0; i<256;i++ )
		{
			uniformArrays2[i] = new Float32Array(i*2);
			uniformArrays3[i] = new Float32Array(i*3);
			uniformArrays4[i] = new Float32Array(i*4);
		}
		uniformArraysCreated = 1;
	}
}

var my_super_id = 1;
function myglNewSlot()
{
	//var id = array_ids_ogl_enable.pop();	
	var id = my_super_id;
	my_super_id++;
	return id;
}

function myglFreeSlot(id)
{
	//array_ids_ogl_enable.push(id);		
}


function myglCreateProgram(sp)
{	
	var id = myglNewSlot();
	var program = gl.createProgram();
	
	program.uniform_locations_current_id = 0;
	program.array_uniform_locations = [];
	
	array_ids_ogl[id] = program;
	
		
	r_g0 = id;	
}

function myglCreateShader(sp)
{	
	var type = heap32[sp>>2];sp+=4;
	var id = myglNewSlot();
	
	array_ids_ogl[id] = gl.createShader(type);
		
	r_g0 = id;	
}

function myglAttachShader(sp)
{
	var program_id = heap32[sp>>2];sp+=4;
	var shader_id = heap32[sp>>2];sp+=4;
	
	gl.attachShader(array_ids_ogl[program_id], array_ids_ogl[shader_id]);
}

function myglBindAttribLocation(sp)
{
	var program_id = heap32[sp>>2];sp+=4;
	var index = heap32[sp>>2];sp+=4;
	var ptr_string = heap32[sp>>2];sp+=4;
	
	var string = get_string_from_ptr(ptr_string);
	
	gl.bindAttribLocation(array_ids_ogl[program_id], index, string);
}

function myglLinkProgram(sp)
{
	var program_id = heap32[sp>>2];sp+=4;
	
	gl.linkProgram(array_ids_ogl[program_id]);
}

function myglShaderSource(sp)
{
	var id = heap32[sp>>2];sp+=4;	
	var ptr_string = heap32[sp>>2];sp+=4;
	
	var shader = array_ids_ogl[id];
	
	var shader_code = get_string_from_ptr(ptr_string);
	
	//dump(shader_code);
	
	
	gl.shaderSource(shader, shader_code);	
}


function myglDrawArrays(sp)
{
	var mode = heap32[sp>>2];sp+=4;
	var first = heap32[sp>>2];sp+=4;
	var count = heap32[sp>>2];sp+=4;
	
	if (mandreel_draw_enable)
		gl.drawArrays(mode, first, count);
		
	
	//dump('draw arrays ' + mode + ' ' + first + ' ' + count + '\n');
 }

function myglDrawElements(sp)
{	
	var mode = heapU32[sp>>2]; sp+=4;
	var count = heapU32[sp>>2]; sp+=4;
	var type = heapU32[sp>>2]; sp+=4;
	var offset = heapU32[sp>>2]; sp+=4;
	
	
	if (mandreel_draw_enable)
		gl.drawElements(mode, count, type, offset);		
		
		
	
}

function myglCreateTexture(sp)
{	
	var id = myglNewSlot();
	array_ids_ogl[id] = gl.createTexture();
		
	r_g0 = id;	
}

function myglCreateRenderBuffer(sp) {
	var id = myglNewSlot();
    array_ids_ogl[id] = gl.createRenderbuffer();

    r_g0 = id;    
}

function myglCreateFrameBuffer(sp) {
	var id = myglNewSlot();	
    array_ids_ogl[id] = gl.createFramebuffer();

    r_g0 = id;    
}

function myglBindFramebuffer(sp) 
{
    var target = heap32[sp >> 2]; sp += 4;
    var framebuffer_id = heap32[sp >> 2]; sp += 4;
    
    var framebuffer = array_ids_ogl[framebuffer_id];
    
    gl.bindFramebuffer(target,framebuffer);

}

function myglBindRenderbuffer(sp) 
{
    var target = heap32[sp >> 2]; sp += 4;
    var renderbuffer_id = heap32[sp >> 2]; sp += 4;
    
    var renderbuffer = array_ids_ogl[renderbuffer_id];
    
    gl.bindRenderbuffer(target,renderbuffer);

}


function myglRenderbufferStorage(sp) {
    var target = heap32[sp >> 2]; sp += 4;
    var internalformat = heap32[sp >> 2]; sp += 4;
    var witdth = heap32[sp >> 2]; sp += 4;
    var height = heap32[sp >> 2]; sp += 4;

    gl.renderbufferStorage(target, internalformat, witdth, height);

}

function myglFramebufferRenderbuffer (sp)
{
  var target = heap32[sp>>2];sp+=4;
  var attachment = heap32[sp>>2];sp+=4;
  var renderbuffertarget = heap32[sp>>2];sp+=4;
  var renderbuffer_id = heap32[sp>>2];sp+=4;
 
    var renderbuffer = array_ids_ogl[renderbuffer_id];

    gl.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer);
 
}

function myglFramebufferTexture2D (sp)
{
  var target = heap32[sp>>2];sp+=4;
  var attachment = heap32[sp>>2];sp+=4;
  var textarget = heap32[sp>>2];sp+=4;
  var texture_id = heap32[sp>>2];sp+=4;
  var level = heap32[sp>>2];sp+=4;
  
  var texture = array_ids_ogl[texture_id];
  
  gl.framebufferTexture2D(target, attachment, textarget, texture, level);


}

function myglTexImage2D(sp)
 {
  var target = heap32[sp>>2];sp+=4;
  var level = heap32[sp>>2];sp+=4;
  var internalFormat = heap32[sp>>2];sp+=4;
  var width = heap32[sp>>2];sp+=4;
  var height = heap32[sp>>2];sp+=4;
  var border = heap32[sp>>2];sp+=4;
  var format = heap32[sp>>2];sp+=4;
  var type = heap32[sp>>2];sp+=4;
  var data = heap32[sp>>2];sp+=4;    
  
  if (level>0)
	return;
  
  if (data == 0)
  {
	gl.texImage2D(target, level, internalFormat, width, height, border, format, type, null);
	return;
  }
  
  
  	var bufferView;	
   if (type == gl.UNSIGNED_SHORT_5_6_5 || type == gl.UNSIGNED_SHORT_4_4_4_4 || type == gl.UNSIGNED_SHORT_5_5_5_1)
   {
		bufferView = new Uint16Array(heap,data,width*height);	
	}
	else if (type == gl.UNSIGNED_BYTE)
	{
		if (format == gl.LUMINANCE)
			bufferView = new Uint8Array(heap,data,width*height);	
		else if (format == gl.RGB)
			bufferView = new Uint8Array(heap,data,width*height*3);	
		else if (format == gl.RGBA)
			bufferView = new Uint8Array(heap,data,width*height*4);	
		else if (format == gl.ALPHA)
			bufferView = new Uint8Array(heap,data,width*height);
		else if (format == gl.LUMINANCE_ALPHA)
			bufferView = new Uint8Array(heap,data,width*height*2);
		else
		{
			dump('format unknown ' + format + '\n');
			assert(false);
		}
	}
	else
	{
	dump('type unknown ' + type + '\n');
		assert(false);
	}
  
  gl.texImage2D(target, level, internalFormat, width, height, border, format, type, bufferView);
  gl.generateMipmap(gl.TEXTURE_2D);
 }
  function myglStencilFunc(sp)
  {
  var func = heap32[sp>>2];sp+=4;
  var ref = heap32[sp>>2];sp+=4;
  var mask = heap32[sp>>2];sp+=4;
  
  gl.stencilFunc(func, ref, mask);
  }
  
  function myglStencilFuncSeparate(sp)
  {
  var face = heap32[sp>>2];sp+=4;
  var func = heap32[sp>>2];sp+=4;
  var ref = heap32[sp>>2];sp+=4;
  var mask = heap32[sp>>2];sp+=4;
  
  gl.stencilFuncSeparate(face,func,ref,mask);
  }
  
  function myglStencilMaskSeparate(sp)
  {
  var face = heap32[sp>>2];sp+=4;
   var mask = heap32[sp>>2];sp+=4;
   
   gl.stencilMaskSeparate(face,mask);
  }
  
  function myglStencilMask(sp)
  {
   var mask = heap32[sp>>2];sp+=4;
   
   gl.stencilMask(mask);
  }
  function myglStencilOp (sp)
  {
   var fail = heap32[sp>>2];sp+=4;
  var zfail = heap32[sp>>2];sp+=4;
   var zpass = heap32[sp>>2];sp+=4;
  
  gl.stencilOp(fail, zfail, zpass);
  }
  
  function myglStencilOpSeparate (sp)
  {
  var face = heap32[sp>>2];sp+=4;
   var fail = heap32[sp>>2];sp+=4;
  var zfail = heap32[sp>>2];sp+=4;
   var zpass = heap32[sp>>2];sp+=4;
  
  gl.stencilOpSeparate(face, fail, zfail, zpass);
  }
 
 function myglTexSubImage2D(sp)
 {
  var target = heap32[sp>>2];sp+=4;
  var level = heap32[sp>>2];sp+=4;
  var xoffset = heap32[sp>>2];sp+=4;
  var yoffset = heap32[sp>>2];sp+=4;
  var width = heap32[sp>>2];sp+=4;
  var height = heap32[sp>>2];sp+=4;
  var format = heap32[sp>>2];sp+=4;
  var type = heap32[sp>>2];sp+=4;
  var data = heap32[sp>>2];sp+=4;    
  
  
  
  	var bufferView;	
   if (type == gl.UNSIGNED_SHORT_5_6_5 || type == gl.UNSIGNED_SHORT_4_4_4_4 || type == gl.UNSIGNED_SHORT_5_5_5_1)
   {
		bufferView = new Uint16Array(heap,data,width*height);	
	}
	else if (type == gl.UNSIGNED_BYTE)
	{
		if (format == gl.LUMINANCE)
			bufferView = new Uint8Array(heap,data,width*height);	
		else if (format == gl.RGB)
			bufferView = new Uint8Array(heap,data,width*height*3);	
		else if (format == gl.RGBA)
			bufferView = new Uint8Array(heap,data,width*height*4);	
		else if (format == gl.ALPHA)
			bufferView = new Uint8Array(heap,data,width*height);	
	}
  
  gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, bufferView);
 }
 
  
  function myglCreateBuffer(sp)
{	
	var id = myglNewSlot();
	array_ids_ogl[id] = gl.createBuffer();
		
	r_g0 = id;	
}

var glBufferDataArray = [];

function myglBufferData(sp)
{
	var target = heapU32[sp>>2]; sp+=4;
	var size = heapU32[sp>>2]; sp+=4;
	var data = heapU32[sp>>2]; sp+=4;
	var usage = heapU32[sp>>2]; sp+=4;
		
	if (data == 0)
		gl.bufferData(target, size, usage);
	else
	{
		if (usage == gl.STATIC_DRAW || true)
		{
			var buffer_data = new Int8Array(heap, data, size);
			gl.bufferData(target, buffer_data, usage);				
		}
		else
		{
			var new_size = size/4;
			var buffer_data = glBufferDataArray[new_size];
			
			if (buffer_data == null)
			{
				buffer_data =  new Int32Array(new_size);
				glBufferDataArray[new_size] = buffer_data;
			}
			
			var new_data = data>>2;
			
			for ( var i = 0 ; i < new_size ; ++i )
			{
				buffer_data[i] = heap32[new_data+i];
			}
			
			gl.bufferData(target, buffer_data, usage);
		}
	}	
}

function myglBufferSubData(sp)
{
	var target = heapU32[sp>>2]; sp+=4;
	var offset = heapU32[sp>>2]; sp+=4;
	var size = heapU32[sp>>2]; sp+=4;
	var data = heapU32[sp>>2]; sp+=4;
		
	
	var buffer_data = new Int8Array(heap, data, size);
	gl.bufferSubData(target, offset, buffer_data);				
	
//	dump('buffer sub data ' + offset + ' ' + size + ' ' + data + '\n')
	
}


function myglBindBuffer(sp)
{
	var target = heapU32[sp>>2]; sp+=4;
	var id = heapU32[sp>>2]; sp+=4;
	
	gl.bindBuffer(target, array_ids_ogl[id]);	
}


function myglUseProgram(sp)
{
	var program_id = heap32[sp>>2];sp+=4;
	
	g_current_program_id = program_id;
	
	gl.useProgram(array_ids_ogl[program_id]);

}

function myglDisableVertexAttribArray(sp)
{
	var idx = heapU32[sp>>2];sp+=4;
	gl.disableVertexAttribArray(idx);
}
function myglEnableVertexAttribArray(sp)
{
	var idx = heapU32[sp>>2];sp+=4;
	gl.enableVertexAttribArray(idx);
}

function myglVertexAttribPointer(sp)
{
	var idx = heapU32[sp>>2];sp+=4;
	var size = heapU32[sp>>2];sp+=4;
	var type = heapU32[sp>>2];sp+=4;
	var normalized = heapU32[sp>>2];sp+=4;
	var stride = heapU32[sp>>2];sp+=4;
	var ptr = heapU32[sp>>2];sp+=4;
	
	//dump(idx + ' ' + size + ' ' + type + ' ' + normalized + ' ' + stride + ' ' + ptr + '\n');
	
		
	gl.vertexAttribPointer(idx, size, type, normalized, stride, ptr);			
}

function myglPolygonOffset(sp)
{
	var factor = heapFloat[sp>>2]; sp+=4;
	var units = heapFloat[sp>>2]; sp+=4;
	gl.polygonOffset(factor, units);
}

function myglEnable(sp)
 {
	var value = heap32[sp>>2];sp+=4;
	
	gl.enable(value);	
  }
  
function myglDisable(sp)
 {
	var value = heap32[sp>>2];sp+=4;
	
	gl.disable(value);	
  }  
  
  function myglDepthFunc(sp)
  {
	var func = heapU32[sp>>2];sp+=4;
	
	gl.depthFunc(func);
	
  }
  
  function myglGenerateMipmap(sp)
  {
	var texture_type = heap32[sp>>2];sp+=4;
	gl.generateMipmap(texture_type);
  }
  
  function myglPixelStorei (sp)
  {
	var pname = heap32[sp>>2];sp+=4;
	var param = heap32[sp>>2];sp+=4;
	gl.pixelStorei(pname,param);
  }
  
  
  function myglBindTexture(sp)
  {
  var texture_type = heap32[sp>>2];sp+=4;
  var texture_id = heap32[sp>>2];sp+=4;
 
if (texture_id == 0)
{
	gl.bindTexture(texture_type, null);
}
else
{ 
	var tex = array_ids_ogl[texture_id];	
	gl.bindTexture(texture_type, tex);
	}
	
  }
  
  function myglActiveTexture(sp)
{
	var param = heapU32[sp>>2];sp+=4;
	gl.activeTexture(param);
}

function myglCompileShader(sp)
{
	var id = heap32[sp>>2];sp+=4;
	
	var shader = array_ids_ogl[id];
	
	gl.compileShader(shader);
}

function myglGetUniformLocation(sp)
{
	var program_id = heap32[sp>>2];sp+=4;
	var ptr_string = heap32[sp>>2];sp+=4;
	
	var string = get_string_from_ptr(ptr_string);
	var program = array_ids_ogl[program_id];
	var result = gl.getUniformLocation(program, string);	 	
	
	if (result != null)
	{
		program.array_uniform_locations[program.uniform_locations_current_id] = result;	
		r_g0 = program.uniform_locations_current_id;
		program.uniform_locations_current_id++;
	}
	else
		r_g0 = -1;
}

function myglIsEnabled(sp)
{
	var cap = heap32[sp>>2];sp+=4;
	
	r_g0 = gl.isEnabled(cap);
}


function myglUniform1i(sp)
{
	var index = heap32[sp>>2];sp+=4;
	var value = heap32[sp>>2];sp+=4;
	
	var program = array_ids_ogl[g_current_program_id];
	
	var uniform_value = program.array_uniform_locations[index];
	
	gl.uniform1i(uniform_value, value);
}

function myglUniform1f(sp)
{
	var index = heap32[sp>>2];sp+=4;
	var value = heapFloat[sp>>2];sp+=4;
	
	var program = array_ids_ogl[g_current_program_id];
	
	var uniform_value = program.array_uniform_locations[index];
	
	gl.uniform1f(uniform_value, value);
}

function myglUniform3f(sp)
{
	var index = heap32[sp>>2];sp+=4;
	var x = heapFloat[sp>>2];sp+=4;
	var y = heapFloat[sp>>2];sp+=4;
	var z = heapFloat[sp>>2];sp+=4;
	
	var program = array_ids_ogl[g_current_program_id];
	
	var uniform_value = program.array_uniform_locations[index];
	
	gl.uniform3f(uniform_value, x,y,z);
}

function myglUniform4f(sp)
{
	var index = heap32[sp>>2];sp+=4;
	var x = heapFloat[sp>>2];sp+=4;
	var y = heapFloat[sp>>2];sp+=4;
	var z = heapFloat[sp>>2];sp+=4;
	var w = heapFloat[sp>>2];sp+=4;
	
	var program = array_ids_ogl[g_current_program_id];
	var uniform_value = program.array_uniform_locations[index];
	
	gl.uniform4f(uniform_value, x,y,z,w);
}


function myglUniform3fv(sp)
{
	myglCreateUniformArrays();
	
	var index = heap32[sp>>2];sp+=4;
	var count = heap32[sp>>2];sp+=4;
	var data = heap32[sp>>2];sp+=4;
		
	var new_data = data>>2;
	var new_count = count*3;
	var bufferView = uniformArrays3[count];

	for ( var i = 0 ; i < new_count ; ++i )
	{
		bufferView[i] = heapFloat[new_data+i];
	}

	var program = array_ids_ogl[g_current_program_id];
	var uniform_value = program.array_uniform_locations[index];
	gl.uniform3fv(uniform_value, bufferView);
}

function myglUniform2fv(sp) 
{
	myglCreateUniformArrays();
	
    var index = heap32[sp >> 2]; sp += 4;
    var count = heap32[sp >> 2]; sp += 4;
    var data = heap32[sp >> 2]; sp += 4;

	var new_data = data>>2;
	var new_count = count*2;
	var bufferView = uniformArrays2[count];

	for ( var i = 0 ; i < new_count ; ++i )
	{
		bufferView[i] = heapFloat[new_data+i];
	}


	var program = array_ids_ogl[g_current_program_id];
    var uniform_value = program.array_uniform_locations[index];
    gl.uniform2fv(uniform_value, bufferView);
}


function myglUniform4fv(sp)
{
	myglCreateUniformArrays();
	
	var index = heap32[sp>>2];sp+=4;
	var count = heap32[sp>>2];sp+=4;
	var data = heap32[sp>>2];sp+=4;
		
	
	var new_data = data>>2;
	var new_count = count*4;
	var bufferView = uniformArrays4[count];

	for ( var i = 0 ; i < new_count ; ++i )
	{
		bufferView[i] = heapFloat[new_data+i];
	}

	
	var program = array_ids_ogl[g_current_program_id];
	var uniform_value = program.array_uniform_locations[index];
	gl.uniform4fv(uniform_value, bufferView);
}


function myglUniformMatrix4fv(sp)
{
	myglCreateUniformArrays();
	
	var index = heap32[sp>>2];sp+=4;
	var count = heap32[sp>>2];sp+=4;
	var transpose = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	
	var program = array_ids_ogl[g_current_program_id];
	var uniform_value = program.array_uniform_locations[index];
	
	//var buffer_data = new Float32Array(heap, ptr, count*16);	
	for ( var i = 0 ; i < count*16 ; ++i )
	{
		uniformArrays4[count*4][i] = heapFloat[(ptr>>2)+i];
	}
		
	//gl.uniformMatrix4fv(uniform_value, transpose, buffer_data);	
	//gl.uniformMatrix4fv(uniform_value, transpose, heapFloat.subarray(ptr/4,(ptr/4)+(count*16)));	
	gl.uniformMatrix4fv(uniform_value, transpose, uniformArrays4[count*4]);	
}

function myglUniformMatrix3fv(sp)
{
	myglCreateUniformArrays();
	
	var index = heap32[sp>>2];sp+=4;
	var count = heap32[sp>>2];sp+=4;
	var transpose = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	
	var program = array_ids_ogl[g_current_program_id];
	var uniform_value = program.array_uniform_locations[index];
	
	//var buffer_data = new Float32Array(heap, ptr, count*9);	
	for ( var i = 0 ; i < count*9 ; ++i )
	{
		uniformArrays3[count*3][i] = heapFloat[(ptr>>2)+i];
	}
		
	//gl.uniformMatrix3fv(uniform_value, transpose, buffer_data);	
	//gl.uniformMatrix3fv(uniform_value, transpose, heapFloat.subarray(ptr/4,(ptr/4)+(count*9)));	
	gl.uniformMatrix3fv(uniform_value, transpose, uniformArrays3[count*3]);	
}



function myglValidateProgram(sp)
{
	var program_id = heap32[sp>>2];sp+=4;
	
	gl.validateProgram(array_ids_ogl[program_id]);	 	
}

function myglGetAttribLocation(sp)
{
	var program_id = heap32[sp>>2];sp+=4;
	var ptr_string = heap32[sp>>2];sp+=4;
	
	var string = get_string_from_ptr(ptr_string);
	var result = gl.getAttribLocation(array_ids_ogl[program_id], string);	 	
				
	r_g0 = result;	
}

function myglGetProgramInfoLogLength(sp)
{
	var program_id = heap32[sp>>2];sp+=4;	
	
	var info_log = gl.getProgramInfoLog(array_ids_ogl[program_id]);	 	
	
	if (info_log)
		r_g0 = info_log.length+1;
	else
		r_g0 = 0;
}


function myglGetProgramInfoLog(sp)
{
	var program_id = heap32[sp>>2];sp+=4;
	var ptr_string = heap32[sp>>2];sp+=4;
	
	var info_log = gl.getProgramInfoLog(array_ids_ogl[program_id]);	 	
		
	fill_ptr_from_string(ptr_string, info_log);
}

function myglGetShaderInfoLogLength(sp)
{
	var program_id = heap32[sp>>2];sp+=4;	
	
	var info_log = gl.getShaderInfoLog(array_ids_ogl[program_id]);	 	
	
	if (info_log)
		r_g0 = info_log.length+1;
	else
		r_g0 = 0;
}

function myglGetShaderInfoLog(sp)
{
	var program_id = heap32[sp>>2];sp+=4;
	var ptr_string = heap32[sp>>2];sp+=4;
	
	var info_log = gl.getShaderInfoLog(array_ids_ogl[program_id]);	 	
		
	fill_ptr_from_string(ptr_string, info_log);
}

function myglViewport(sp) {
    var x = heap32[sp >> 2]; sp += 4;
    var y = heap32[sp >> 2]; sp += 4;
    var width = heap32[sp >> 2]; sp += 4;
    var height = heap32[sp >> 2]; sp += 4;

    gl.viewport(x,y,width,height);

}

function myglScissor(sp) 
{
    var x = heap32[sp >> 2]; sp += 4;
    var y = heap32[sp >> 2]; sp += 4;
    var width = heap32[sp >> 2]; sp += 4;
    var height = heap32[sp >> 2]; sp += 4;

    gl.scissor(x,y,width,height);	
}



function myglClearColor(sp)
{
  var r = heapFloat[sp>>2];sp+=4;
  var g = heapFloat[sp>>2];sp+=4;  
  var b = heapFloat[sp>>2];sp+=4;
  var a = heapFloat[sp>>2];sp+=4;
  
  gl.clearColor(r,g,b,a);
  
  
}

function myglClearStencil(sp)
{
	var stencil = heap32[sp>>2];sp+=4;
	gl.clearStencil(stencil);
}


function myglClearDepthf(sp)
{
	var depth = heapFloat[sp>>2];sp+=4;
	gl.clearDepth(depth);
}

function myglClear(sp)
  {
  var mask = heap32[sp>>2];sp+=4;
  
  
  //dump('clear ' + mask + '\n');
	if (mandreel_draw_enable)
		gl.clear(mask);
  }
  
  function myglGetError(sp)
  {  
	//r_g0 = gl.getError();	
	r_g0 = 0;
  }
  
  function myglGetProgramParameter(sp)
  {
	var program_id = heap32[sp>>2];sp+=4;
	var pname = heap32[sp>>2];sp+=4;
	
	r_g0 = gl.getProgramParameter(array_ids_ogl[program_id], pname);
  }
  
  function myglGetActiveAttrib (sp)
  {
	var program_id = heap32[sp>>2];sp+=4;
	var index = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	
	 var result = gl.getActiveAttrib(array_ids_ogl[program_id], index);	 
	 
	 if (result != null)
	 {
		heap32[(ptr)>>2] = result.size;
		heap32[(ptr+4)>>2] = result.type;	 
		fill_ptr_from_string(ptr+8, result.name);	 	
		r_g0 = 0;
	}
	else
	   r_g0 = 1;
  }
  
    function myglGetActiveUniform (sp)
  {
	var program_id = heap32[sp>>2];sp+=4;
	var index = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	
	 var result = gl.getActiveUniform(array_ids_ogl[program_id], index);	 
	 
	 if (result != null)
	 {
		heap32[(ptr)>>2] = result.size;
		heap32[(ptr+4)>>2] = result.type;	 
		fill_ptr_from_string(ptr+8, result.name);	 	
		r_g0 = 0;
	}
	else
	   r_g0 = 1;
  }

  function myglTexParameterf (sp)
  {
	var target = heap32[sp>>2];sp+=4;
	var pname = heap32[sp>>2];sp+=4;
	var value = heapFloat[sp>>2];sp+=4;
		
	gl.texParameterf(target,pname,value);	
}

function myglTexParameteri (sp)
  {
	var target = heap32[sp>>2];sp+=4;
	var pname = heap32[sp>>2];sp+=4;
	var value = heap32[sp>>2];sp+=4;
		
	gl.texParameteri(target,pname,value);	
}

function myglCullFace (sp)
 {
	var mode = heap32[sp>>2];sp+=4;
	gl.cullFace(mode);
 }
 
 function myglDepthMask (sp)
 {
	var flag = heap32[sp>>2];sp+=4;
	gl.depthMask(flag);
 }
 
 function myglDepthRangef (sp)
 {
	var zNear = heapFloat[sp>>2];sp+=4;
	var zFar = heapFloat[sp>>2];sp+=4;
	gl.depthRange(zNear, zFar);
 }

function myglFrontFace (sp)
 {
	var mode = heap32[sp>>2];sp+=4;
	gl.frontFace(mode);
 }
 
 function myglBlendFunc (sp)
 {
	var sfactor = heap32[sp>>2];sp+=4;
	var dfactor = heap32[sp>>2];sp+=4;
	gl.blendFunc(sfactor,dfactor);
 }
 
 function myglColorMask (sp)
 {
	var red = heap32[sp>>2];sp+=4;
	var green = heap32[sp>>2];sp+=4;
	var blue = heap32[sp>>2];sp+=4;
	var alpha = heap32[sp>>2];sp+=4;
	gl.colorMask(red,green,blue,alpha);
 }
 
 function removeByElement(arrayName,arrayElement)
 {
    for(var i=0; i<arrayName.length;i++ )
     { 
        if(arrayName[i]==arrayElement)
		{
            arrayName.splice(i,1); 
			return;
		}
      } 
  }
 
 
 function mygetParameter(sp)
 {
	var pname = heap32[sp>>2];sp+=4;
	r_g0 = gl.getParameter(pname);
 }
 
 
 function mygetProgramParameter(sp)
 {
 	var program_id = heap32[sp>>2];sp+=4;
	var pname = heap32[sp>>2];sp+=4;
	r_g0 = gl.getProgramParameter(array_ids_ogl[program_id], pname);
 }
 
 function mygetShaderParameter(sp)
 {
 	var shader_id = heap32[sp>>2];sp+=4;
	var pname = heap32[sp>>2];sp+=4;
	r_g0 = gl.getShaderParameter(array_ids_ogl[shader_id], pname);
 }
 
 function myglVertexAttrib1f(sp)
 {
	var index = heap32[sp>>2];sp+=4;
	var x = heapFloat[sp>>2];sp+=4;
	gl.vertexAttrib1f(index,x);
 }
 
  function myglVertexAttrib2f(sp)
 {
	var index = heap32[sp>>2];sp+=4;
	var x = heapFloat[sp>>2];sp+=4;
	var y = heapFloat[sp>>2];sp+=4;
	gl.vertexAttrib2f(index,x,y);
 }
 
  function myglVertexAttrib3f(sp)
 {
	var index = heap32[sp>>2];sp+=4;
	var x = heapFloat[sp>>2];sp+=4;
	var y = heapFloat[sp>>2];sp+=4;
	var z = heapFloat[sp>>2];sp+=4;
	gl.vertexAttrib3f(index,x,y,z);
 }

  function myglVertexAttrib4f(sp)
 {
	var index = heap32[sp>>2];sp+=4;
	var x = heapFloat[sp>>2];sp+=4;
	var y = heapFloat[sp>>2];sp+=4;
	var z = heapFloat[sp>>2];sp+=4;
	var w = heapFloat[sp>>2];sp+=4;
	gl.vertexAttrib4f(index,x,y,z,w);
 }
 
 function myglVertexAttrib1fv(sp)
 {
	var index = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	var x = heap32[ptr>>2];ptr+=4;
	gl.vertexAttrib1f(index,x);
 }
 
 function myglVertexAttrib2fv(sp)
 {
	var index = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	var x = heap32[ptr>>2];ptr+=4;
	var y = heap32[ptr>>2];ptr+=4;

	gl.vertexAttrib2f(index,x,y);
 }
 
 function myglVertexAttrib3fv(sp)
 {
	var index = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	var x = heap32[ptr>>2];ptr+=4;
	var y = heap32[ptr>>2];ptr+=4;
	var z = heap32[ptr>>2];ptr+=4;

	gl.vertexAttrib3f(index,x,y,z);
 }
 
 function myglVertexAttrib4fv(sp)
 {
	var index = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	var x = heap32[ptr>>2];ptr+=4;
	var y = heap32[ptr>>2];ptr+=4;
	var z = heap32[ptr>>2];ptr+=4;
	var w = heap32[ptr>>2];ptr+=4;

	gl.vertexAttrib4f(index,x,y,z,w);
 }
 
 
 function myglDeleteTexture (sp)
 {
 
	var texture_id = heap32[sp>>2];sp+=4;
	
	var texture = array_ids_ogl[texture_id];	
	
	gl.deleteTexture(texture);
		
	array_ids_ogl[texture_id] = null;		
	
	myglFreeSlot(texture_id);		
 }
 
 function myglDeleteBuffer (sp)
 {
 
	var buffer_id = heap32[sp>>2];sp+=4;
	
	var buffer = array_ids_ogl[buffer_id];	
	
	gl.deleteBuffer(buffer);
	
	array_ids_ogl[buffer_id] = null;		
	
	myglFreeSlot(buffer_id);		 
 }
 
 function myglDeleteFrameBuffer (sp)
 {
	var framebuffer_id = heap32[sp>>2];sp+=4;
	
	var framebuffer = array_ids_ogl[framebuffer_id];	
	
	gl.deleteFramebuffer(framebuffer);
	
	array_ids_ogl[framebuffer_id] = null;		
	
	myglFreeSlot(framebuffer_id);		 
 }
 
 
 function myglDeleteProgram (sp)
 {
	var program_id = heap32[sp>>2];sp+=4;
	
	var program = array_ids_ogl[program_id];	
	
	gl.deleteProgram(program);
	
	array_ids_ogl[program_id] = null;		
	
	myglFreeSlot(program_id);		 
 }
 
 function myglDeleteRenderBuffer (sp)
 {
	var renderbuffer_id = heap32[sp>>2];sp+=4;
	
	var renderbuffer = array_ids_ogl[renderbuffer_id];	
	
	gl.deleteRenderbuffer(renderbuffer);
	
	array_ids_ogl[renderbuffer_id] = null;		
	
	myglFreeSlot(renderbuffer_id);	
 }
 
 function myglDeleteShader (sp)
 {
	var shader_id = heap32[sp>>2];sp+=4;
	
	var shader = array_ids_ogl[shader_id];	
	
	gl.deleteShader(shader);
	
	array_ids_ogl[shader_id] = null;		
	
	myglFreeSlot(shader_id);	
 }
 
 function myglInit(sp)
 {
	
	for (var i=0;i<max_ogl_id;++i)
	{
		array_ids_ogl_enable.push(i+1);		
	}
 }
 
 function myglReadPixels(sp)
 {
  var x = heap32[sp>>2];sp+=4;
  var y = heap32[sp>>2];sp+=4;
  var width = heap32[sp>>2];sp+=4;
  var height = heap32[sp>>2];sp+=4;
  var format = heap32[sp>>2];sp+=4;
  var type = heap32[sp>>2];sp+=4;
  var pixels = heap32[sp>>2];sp+=4;    
 
	var bufferView = new Uint8Array(heap,pixels,width*height*4);	 
  gl.readPixels(x,y,width,height,format,type,bufferView);
}
 
 var webAudioContext = 0;

var mandreel_audio_init = null_mandreel_audio;
var mandreel_audio_end = null_mandreel_audio;
var mandreel_audio_update = null_mandreel_audio;
var mandreel_audio_createBuffer = null_mandreel_audio;
var mandreel_audio_playChannel = null_mandreel_audio;
var mandreel_audio_stopChannel = null_mandreel_audio;
var mandreel_audio_setChannelVolume = null_mandreel_audio;
var mandreel_audio_setChannelPan = null_mandreel_audio;
var mandreel_audio_setChannelPitch = null_mandreel_audio;
var mandreel_audio_playMusic = null_mandreel_audio;
var mandreel_audio_stopMusic = null_mandreel_audio;
var mandreel_audio_useMusicFunctions = _mandreel_audio_useMusicFunctions;
var mandreel_audio_checkBuffersPending = null_mandreel_audio;
var mandreel_audio_setMusicVol = null_mandreel_audio;

var mandreel_audio_startedFunction = 0;

var MandreelAudioDriver = "null";

function mandreel_start_audio(audioServer, audioUrl,startedFunction)
{
	mandreel_audio_startedFunction = startedFunction;
	
	// Check audio driver data availability
	var webAudioDataAvailable = false;
	var flashAudioDataAvailable = false;
	var flashLiteAudioDataAvailable = false;
	var FatLines = mandreelFatData.split('\n');
	for ( var i=0;i<FatLines.length;++i )
	{
		var params = FatLines[i].split(',');
		if ( params[0] == "audiodriver" )
		{
			var data = params[1];
			data = data.replace('\r','');
			if ( data == "webaudio" )
				webAudioDataAvailable = true;
			else if ( data == "flash" )
				flashAudioDataAvailable = true;
			else if ( data == "flashlite" )
				flashLiteAudioDataAvailable = true;
		}
	}
	
	
	// Init audio driver
	{
		// webaudio
		if ( webAudioDataAvailable && MandreelAudioDriver == "null" )
		{
			try	{ webAudioContext = new webkitAudioContext(); } catch(err) { webAudioContext = 0; }
			if ( webAudioContext )
			{
				wa_MainAudioDriver();
				MandreelAudioDriver = "webAudio";
			}
		}
		// flash
		if ( flashAudioDataAvailable && MandreelAudioDriver == "null" )
		{
			MandreelAudioDriver = "flash";
			if ( audioServer == null )
			{
				audioServer = "";
				audioUrl = "";
			}
			fl_MainAudioDriver(audioServer,audioUrl);
		}
		// flashlite
		if ( flashLiteAudioDataAvailable && MandreelAudioDriver == "null" )
		{
			MandreelAudioDriver = "flashlite";
			mandreel_flashaudio_lite = true;
			fl_MainAudioDriver("","");
		}
		// null
		if ( MandreelAudioDriver == "null" )		
		{
			null_MainAudioDriver();
		}
	}
	dump("AudioDriver ("+MandreelAudioDriver+")");
}

function mandreel_audio_isLogEnabled(sp)
{
	r_g0 = 0;
}

function _mandreel_audio_useMusicFunctions(sp)
{
	r_g0 = 0;
}

function MandreelAudioStarted()
{
	setTimeout(mandreel_audio_startedFunction, 10);
}


function mandreel_audio_getAudioDriverName(sp)
{
	var name_ptr = heap32[sp>>2];sp+=4;
	fill_ptr_from_string(name_ptr, MandreelAudioDriver);
}
var webAudioBuffers = new Array();
var webAudioChannels = new Array(32);
var webAudioGain = new Array(32);
var webAudioUseMusicFunctions = true;

function wa_mandreel_audio_init(sp)
{
}

function wa_mandreel_audio_end(sp)
{
}

function wa_mandreel_audio_update(sp)
{
}

function wa_getFileNameNoExt(fileName)
{
	var fileNameNoExt = fileName.toLowerCase();
	var indexDot = fileNameNoExt.lastIndexOf('.');
	if ( indexDot != -1 )
		fileNameNoExt = fileNameNoExt.substr(0,indexDot);
	fileNameNoExt = fileNameNoExt.replace(/\\/g,"/");
	if ( fileNameNoExt.length > 0 )
	{
		if ( fileNameNoExt.charAt(0) == "/" )
		{
			if (fileNameNoExt.length > 1 )
				fileNameNoExt = fileNameNoExt.substr(1,fileNameNoExt.length-1);
			else
				fileNameNoExt = "";
		}
	}
	return fileNameNoExt;
}

var wa_mandreel_cache_audio_files = false;
var wa_mandreel_cache_audio_files_path = '';

function mandreel_webAudio_reloadfile(fileName,callback)
{
	var fileNameNoExt = wa_getFileNameNoExt(fileName);
	var url = wa_mandreel_cache_audio_files_path+fileNameNoExt+".ogg";
	dump("webAudio: loading buffer ("+fileName+") url("+url+")");	
	var request = new XMLHttpRequest();				
	request.open("GET", url, true);
	request.responseType = "arraybuffer";
	request.onreadystatechange = function()
	{
		if (request.readyState == 4)
		{
			
			if (request.status == 404) callback(null);
			
			callback(request.response);			
				
		}	
	}
	request.send();
}

window.BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;

function mandreel_webaudio_saveFile(name, my_arrayBuffer)
{
	dump('mandreel_webaudio_saveFile ' + name);
	g_mandreel_fs.root.getFile(name, {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };
	  
	  var bb = new window.BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
      bb.append(my_arrayBuffer);	
      fileWriter.write(bb.getBlob('text/plain'));

      

    }, function(e) { dump('error 1 mandreel_webaudio_saveFile ' + name);MandreelFsErrorHandler(e) });

  }, function(e) { dump('error 2 mandreel_webaudio_saveFile ' + name);MandreelFsErrorHandler(e) });
}

function mandreel_webaudio_loadFile(name, callback, callback2)
{
	g_mandreel_fs.root.getFile(name, {}, function(fileEntry) {
	
	fileEntry.file(function(file) {
	
		var reader = new FileReader();
	
	
       reader.onloadend = function(e) {
	   	   
	   dump('mandreel_fs_loadFile ' + name);
	   if (this.result.byteLength)
		callback(this.result);
	   else 
	   callback2(this.result);
         
       };
	   
	   
	   	reader.readAsArrayBuffer(file);
		

	
	}, function(e) { dump('error 1 webaudio_loadFile ' + name);MandreelFsErrorHandler(e) } );

  }, function(e) { dump('error 2 webaudio_loadFile ' + name);MandreelFsErrorHandler(e) } );
}


function mandreel_webAudio_cacheFile(fileName, callback)
{
	if (!g_mandreel_fs)
	{
		mandreel_webAudio_reloadfile(fileName, callback);
		
		return;
	}
	fileName = fileName.toLowerCase();	      

	fileName = fileName.replace(/\\/g,"/");
	
	if (fileName[0] == '/')	
		fileName = fileName.substring(1);
	
	dump('chanka name ' + fileName);
	
	g_mandreel_fs.root.getFile(fileName, {}, function(fileEntry) {
	
	fileEntry.getMetadata(function(metaData){
	var my_seconds = metaData.modificationTime.getTime()/1000;
	
	if (g_mandreel_timestamp_fs>my_seconds)
	{
		dump('mandreel_webAudio_cacheFile1 ');		
		fileEntry.remove(function() {
				mandreel_webAudio_reloadfile(fileName, function(response) { callback(response); if (response) mandreel_webaudio_saveFile(fileName, response); } );
			}, function(e) { dump('error 1 mandreel_webAudio_cacheFile ' + fileName);MandreelFsErrorHandler(e); mandreel_webAudio_reloadfile(fileName, function(response) { callback(response); if (response) mandreel_webaudio_saveFile(fileName, response); } );});
		
	}
	else
	{
		//alert('mandreel_fscachefile2');		
		dump('mandreel_webAudio_cacheFile2');		
		mandreel_webaudio_loadFile(fileName, function(response) { callback(response);  } ,
		function() {
				mandreel_webAudio_reloadfile(fileName, function(response) { callback(response); if (response) mandreel_webaudio_saveFile(fileName, response); } );
			}
		);
		
		
		
	}
		
		
		}, function(e) { dump('error 2 mandreel_webAudio_cacheFile ' + fileName);MandreelFsErrorHandler(e) });

    
  }, function(error) {dump('mandreel_webAudio_cacheFile3');	mandreel_webAudio_reloadfile(fileName, function(response) { callback(response); if (response) mandreel_webaudio_saveFile(fileName, response); });});
}

function mandreel_webAudio_queueLoadBuffer(fileName, callback)
{
	//dump("mandreel_webAudio_queueLoadBuffer "+fileName);
	if ( webAudioContext )
	{
		var fileNameNoExt = wa_getFileNameNoExt(fileName);
		var buffer = webAudioBuffers[fileNameNoExt];
		if ( buffer == null && buffer != "invalid" )
		{
			if ( fileNameNoExt != "" )
			{
				if (wa_mandreel_cache_audio_files == true)
				{
					webAudioBuffers[fileNameNoExt] = "invalid";
					
					mandreel_webAudio_cacheFile(fileName, function(response) {
					
						if (callback != null)
							callback();

						if ( response != null )
							webAudioBuffers[fileNameNoExt] = webAudioContext.createBuffer(response, true);
						else
							webAudioBuffers[fileNameNoExt] = "invalid";
					} );
					return;
				}
				
				var url = g_mandreel_working_folder+fileNameNoExt+".ogg";
				dump("webAudio: loading buffer ("+fileName+") url("+url+")");
				webAudioBuffers[fileNameNoExt] = "invalid";
				var request = new XMLHttpRequest();
				request.open("GET", url, true);
				request.responseType = "arraybuffer";
				request.onreadystatechange = function()
				{
					if (request.readyState == 4)
					{
						if (callback != null)
							callback();

						if (request.status == 404) return;
						//dump("webAudio: loaded buffer "+request.status);
						if ( request.response != null )
							webAudioBuffers[fileNameNoExt] = webAudioContext.createBuffer(request.response, true);
						else
							webAudioBuffers[fileNameNoExt] = "invalid";
					}
				}
				request.send();
			}
			else
				webAudioBuffers[fileNameNoExt] = "invalid";
		}
	}
}

function webAudioParsePreloadFile(response)
{
	var pos = 4;
	var bytes = new Uint8Array(response);
	while ( pos < bytes.byteLength )
	{
		// filename
		var fileName = "";
		while ( bytes[pos] != 0 )
		{
			fileName += String.fromCharCode(bytes[pos]);
			pos++;
		}
		pos++;
		// filesize
		var filesize = bytes[pos] | (bytes[pos+1]<<8) | (bytes[pos+2]<<16) | (bytes[pos+3]<<24);
		dump("preload audio file ("+fileName+")");
		pos += 4;
		// contents
		var fileNameNoExt = wa_getFileNameNoExt(fileName);
		var bufferdata = new Uint8Array(filesize);
		bufferdata.set(bytes.subarray(pos,pos+filesize));
		webAudioBuffers[fileNameNoExt] = webAudioContext.createBuffer(bufferdata.buffer, true);
		pos += filesize;
	}
}

function mandreel_webAudio_queueLoadPackedBuffers(fileName, callback)
{
	if ( webAudioContext )
	{
		// TODO
		/*if (wa_mandreel_cache_audio_files == true)
		{
			webAudioBuffers[fileNameNoExt] = "invalid";
			
			mandreel_webAudio_cacheFile(fileName, function(response) {
			
				if (callback != null)
					callback();

				if ( response != null )
					webAudioBuffers[fileNameNoExt] = webAudioContext.createBuffer(response, true);
				else
					webAudioBuffers[fileNameNoExt] = "invalid";
			} );
			return;
		}*/
		
		var url = g_mandreel_working_folder+fileName;
		dump("webAudio: loading preload buffers ("+fileName+") url("+url+")");
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";
		request.onreadystatechange = function()
		{
			if (request.readyState == 4)
			{
				if (callback != null)
					callback();

				if (request.status == 404)
					return;
				if ( request.response != null )
					webAudioParsePreloadFile(request.response);
			}
		}
		request.send();
	}
}



var wa_mandreel_audio_buffers_num = 0;
var wa_mandreel_audio_buffers_loaded = 0;

function wa_mandreel_audio_checkBuffersPending(sp)
{
	r_g0 = wa_mandreel_audio_buffers_num - wa_mandreel_audio_buffers_loaded;
}

function wa_mandreel_audio_createBuffer(sp)
{
	if ( webAudioContext )
	{
		var ptr_fileName = heap32[sp>>2];sp+=4;  
		var maxChannels = heap32[sp>>2];sp+=4;
		var fileName = get_string_from_ptr(ptr_fileName).toLowerCase();
		var fileNameNoExt = wa_getFileNameNoExt(fileName);
		var buffer = webAudioBuffers[fileNameNoExt];		
		if ( buffer == null && buffer != "invalid" )
		{
			wa_mandreel_audio_buffers_num++;
			mandreel_webAudio_queueLoadBuffer(fileName, function () {wa_mandreel_audio_buffers_loaded++;});
		}
	}
	
	r_g0 = 0;
}

function wa_mandreel_audio_playChannel(sp)
{
	if ( webAudioContext )
	{
		var ptr_fileName = heap32[sp>>2];sp+=4;  
		var channel = heap32[sp>>2];sp+=4;  
		var vol = heapFloat[sp>>2];sp+=4;  
		var loop = heap32[sp>>2];sp+=4;
		var pitch = heapFloat[sp>>2];sp+=4;  
		var fileName = get_string_from_ptr(ptr_fileName).toLowerCase();
		var fileNameNoExt = wa_getFileNameNoExt(fileName);
		var buffer = webAudioBuffers[fileNameNoExt];
		if ( buffer == null || buffer == "invalid" )
		{
			mandreel_webAudio_queueLoadBuffer(fileName);
			buffer = webAudioBuffers[fileNameNoExt];
		}
		if ( buffer != null && buffer != "invalid" )
		{
			var chn = webAudioContext.createBufferSource();
			var gain = webAudioContext.createGainNode();
			if ( chn && gain )
			{
				webAudioChannels[channel] = chn;
				webAudioGain[channel] = gain;
				chn.buffer = buffer;
				chn.connect(gain);
				gain.connect(webAudioContext.destination);
				var bLoop = loop != 0;
				chn.loop = bLoop;
				gain.gain.value = vol;
				chn.playbackRate.value = pitch;
				chn.noteOn(0);
				//dump("webAudio: PlayChannel "+channel+" "+fileName+" "+vol+" "+bLoop+" "+pitch);
			}
		}
	}
	r_g0 = 0;
}

function wa_mandreel_audio_stopChannel(sp)
{
	if ( webAudioContext )
	{
		var ptr_fileName = heap32[sp>>2];sp+=4;  
		var channel = heap32[sp>>2];sp+=4; 
		var index = heapFloat[sp>>2];sp+=4;
		var chn = webAudioChannels[channel];
		if ( chn != null )
		{
			//dump("webAudio: StopChannel "+channel);
			chn.noteOff(0);
			webAudioChannels[channel] = null;
			webAudioGain[channel] = null;
		}
	}
}

function wa_mandreel_audio_setChannelVolume(sp)
{
	if ( webAudioContext )
	{
		var channel = heap32[sp>>2];sp+=4; 
		var vol = heapFloat[sp>>2];sp+=4; 
		var gain = webAudioGain[channel];
		if ( gain != null )
			gain.gain.value = vol;
	}
}

function wa_mandreel_audio_setChannelPan(sp)
{
	if ( webAudioContext )
	{
		var channel = heap32[sp>>2];sp+=4; 
		var pan = heapFloat[sp>>2];sp+=4;  
	}
}

function wa_mandreel_audio_setChannelPitch(sp)
{
	if ( webAudioContext )
	{
		var channel = heap32[sp>>2];sp+=4; 
		var pitch = heapFloat[sp>>2];sp+=4;
		var chn = webAudioChannels[channel];
		if ( chn != null )
		{
			chn.playbackRate.value = pitch;
		}
	}
}

var mwebAudioPreloadState = "start";
//var mwebAudioPreloadRequest = 0;
var mwebAudioPreloadAssets = 0;
var mwebAudioCurrentPreloadAsset = 0;
var mwebAudioAsyncFiles = '';
var mwebListAudioAsyncFiles ='';
var mwebListAudioAsyncFilesPos = 0;
var mwebTotalPreloadingFiles = 0;
var mwebCurrentPreloadingFiles = 0;
function mwebCallbackAsync()
{
	mwebListAudioAsyncFilesPos++;
	if ( mwebListAudioAsyncFilesPos >= mwebListAudioAsyncFiles.length )
	{
		mwebListAudioAsyncFiles = null;
		mwebAudioAsyncFiles = null;
		return;
	}
		
	setTimeout("mandreel_webAudio_queueLoadBuffer(mwebListAudioAsyncFiles[mwebListAudioAsyncFilesPos], mwebCallbackAsync);",10);
}

function mwebCallbackAsyncPreload()
{
	mwebCurrentPreloadingFiles++;
}

function mandreel_webAudio_PreloadAssets()
{
	/*if ( mwebAudioPreloadState == "start" )
	{
		//dump("webaudio start");
			mwebAudioPreloadRequest = new XMLHttpRequest();
			var url = g_mandreel_working_folder+"mandreel.fat.dat";
			mwebAudioPreloadRequest.open("GET", url, true);
			mwebAudioPreloadRequest.onreadystatechange = function()
			{
				if (mwebAudioPreloadRequest.readyState != 4) return;
				if ( mwebAudioPreloadRequest.status != 404 && mwebAudioPreloadRequest.response != null )
					mwebAudioPreloadState = "parseFat";
				else
				{
					mwebAudioPreloadState = "done";
					dump("error pre-loading audio assets, status("+mwebAudioPreloadRequest.status+")");
				}
			}
			mwebAudioPreloadState = "loadingFat";
			mwebAudioPreloadRequest.send();
	}
	else if ( mwebAudioPreloadState == "parseFat" )*/
	if ( mwebAudioPreloadState == "start" )
	{
		//mwebAudioPreloadAssets = mwebAudioPreloadRequest.response.split('\n');
		//mwebAudioPreloadRequest = 0;
		mwebAudioPreloadAssets = mandreelFatData.split('\n');
		mwebAudioCurrentPreloadAsset = 0;
		mwebAudioPreloadState = "preloading";
	}
	else if ( mwebAudioPreloadState == "preloading" )
	{
		//dump("webaudio preloading");
		var queued = false;
		while ( !queued && mwebAudioPreloadState != "done" )
		{
			if ( mwebAudioCurrentPreloadAsset < mwebAudioPreloadAssets.length )
			{
				var params = mwebAudioPreloadAssets[mwebAudioCurrentPreloadAsset].split(',');
				if ( params[0] == "audiofile" && params[1])
				{
					var sync_load = true;
					if (params[2] && (params[2]&1) == 0)
						sync_load = false;
						
					if (sync_load)
					{
						mandreel_webAudio_queueLoadBuffer(params[1],mwebCallbackAsyncPreload);
						mwebTotalPreloadingFiles++;
						queued = true;
					}
					
				}
				else if ( params[0] == "audiopreloadfile" )
				{						
					mandreel_webAudio_queueLoadPackedBuffers(params[1],mwebCallbackAsyncPreload);
					mwebTotalPreloadingFiles++;
					queued = true;
				}
				mwebAudioCurrentPreloadAsset++;
			}
			else
				queued = true;
				
			if ( mwebAudioCurrentPreloadAsset >= mwebAudioPreloadAssets.length )
			{
				if (mwebCurrentPreloadingFiles == mwebTotalPreloadingFiles)
				{				
					mwebAudioPreloadState = "done";
					mwebAudioPreloadAssets = 0;
				}
			}
		}
	}
	
	if ( mwebAudioPreloadState == "done" )
	{		
		setTimeout("MandreelAudioStarted()", 10);
	}
	else	
		setTimeout("mandreel_webAudio_PreloadAssets()", 10);
}

function wa_mandreel_audio_useMusicFunctions(sp)
{
	r_g0 = webAudioUseMusicFunctions ? 1 : 0;
}

var wa_mandreelMusicElement = null;
var wa_mandreelMusicElementFilename = "";
var wa_mandreelMusicElementVolume = 1.0;
function wa_mandreel_audio_playMusic(sp)
{
	var ptr_fileName = heap32[sp>>2];sp+=4;  
	var fileName = get_string_from_ptr(ptr_fileName).toLowerCase();
	var fileNameNoExt = wa_getFileNameNoExt(fileName);
	var fileNameFull = g_mandreel_working_folder + fileNameNoExt + ".ogg";

	if ( wa_mandreelMusicElementFilename != fileNameFull )
	{
		mandreel_audio_stopMusic(0);
		var audio = document.createElement("audio");
		var type = fileNameFull.slice(fileNameFull.lastIndexOf(".")+1);
		switch(type){
			case "mp3" : type = "mpeg"; break;
			case "ogg" : type = "ogg"; break;
			case "wav" : type = "wav"; break;
			default : throw("'" + fileNameFull + "' is not a recognized audio file");
		}
		
		// set correct id for lookup, loading method and data types
		audio.setAttribute("type", "audio/" + type);
		var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
		if ( is_chrome )
			audio.setAttribute("loop", "loop");
		else
			audio.addEventListener('ended', function(){this.currentTime = 0;}, false);
		audio.volume = wa_mandreelMusicElementVolume;
		audio.setAttribute("autoplay", "true");
		audio.setAttribute("src", fileNameFull);
		
		
		// include into list and document
		document.body.appendChild(audio);
		wa_mandreelMusicElement = audio;
		wa_mandreelMusicElementFilename = fileNameFull;
	}
}

function wa_mandreel_audio_stopMusic(sp)
{
	if ( wa_mandreelMusicElement != null )
	{
		document.body.removeChild(wa_mandreelMusicElement);
		wa_mandreelMusicElement = null;
		wa_mandreelMusicElementFilename = "";
	}
}

function wa_mandreel_audio_setMusicVol(sp)
{
	var vol = heapFloat[sp>>2];sp+=4;
	wa_mandreelMusicElementVolume = vol;
	if ( wa_mandreelMusicElement != null )
	{
		wa_mandreelMusicElement.volume = wa_mandreelMusicElementVolume;
	}
}

function wa_MainAudioDriver()
{
	mandreel_audio_init = wa_mandreel_audio_init;
	mandreel_audio_end = wa_mandreel_audio_end;
	mandreel_audio_update = wa_mandreel_audio_update;
	mandreel_audio_createBuffer = wa_mandreel_audio_createBuffer;
	mandreel_audio_playChannel = wa_mandreel_audio_playChannel;
	mandreel_audio_stopChannel = wa_mandreel_audio_stopChannel;
	mandreel_audio_setChannelVolume = wa_mandreel_audio_setChannelVolume;
	mandreel_audio_setChannelPan = wa_mandreel_audio_setChannelPan;
	mandreel_audio_setChannelPitch = wa_mandreel_audio_setChannelPitch;
	mandreel_audio_useMusicFunctions = wa_mandreel_audio_useMusicFunctions;
	mandreel_audio_playMusic = wa_mandreel_audio_playMusic;
	mandreel_audio_stopMusic = wa_mandreel_audio_stopMusic;
	mandreel_audio_checkBuffersPending = wa_mandreel_audio_checkBuffersPending;
	mandreel_audio_setMusicVol = wa_mandreel_audio_setMusicVol;
	
	setTimeout("mandreel_webAudio_PreloadAssets()", 10);
}

var mandreel_flashaudio_server = "";
var mandreel_flashaudio_lite = false;
var mandreel_flashaudio_musicaudiotag = true;

function as3Error(str)
{
	var params = str.split(' ');
	if ( params[0] == "createdBuffer" )
		mandreel_audio_flash_lastBufferCreatedSwf = parseInt(params[1]);
	dump("as3Log: "+str);
}

function mandreel_audio_getFlashMovieObject(movieName)
{
	if (window.document[movieName])
	{
		return window.document[movieName];
	}
	if (navigator.appName.indexOf("Microsoft Internet")==-1)
	{
		if (document.embeds && document.embeds[movieName])
			return document.embeds[movieName];
	}
	else
	{
		return document.getElementById(movieName);
	}
}

function mandreel_sendmsg_flash(msg)
{
	if ( mandreel_flashaudio_server != "" )
	{
		var iframeWin = document.getElementById("ninja-iframe").contentWindow;
		iframeWin.postMessage(msg,mandreel_flashaudio_server);
	}
	else
	{
		var flashMovie=mandreel_audio_getFlashMovieObject("FlashDiv");
		if ( flashMovie != null )
			flashMovie.receiveMessage(msg);
		else
			dump("error: flashMovie not found");
	}
}

function fl_mandreel_audio_init(sp)
{
	mandreel_sendmsg_flash("init "+g_mandreel_working_folder);
}

function fl_mandreel_audio_end(sp)
{
}

function fl_mandreel_audio_update(sp)
{
}

function mandreel_flashaudiolite_createBuffer(fileName)
{
	mandreel_audio_flash_lastBufferCreated++;
	mandreel_sendmsg_flash("createBuffer "+wa_getFileNameNoExt(fileName)+" "+mandreel_audio_flash_lastBufferCreated);
}

var mandreel_audio_flash_lastBufferCreated = 0;
function fl_mandreel_audio_createBuffer(sp)
{
	var ptr_fileName = heap32[sp>>2];sp+=4;  
	var fileName = get_string_from_ptr(ptr_fileName).toLowerCase();
	mandreel_flashaudiolite_createBuffer(fileName);
}

function fl_internal_mandreel_audio_checkBuffersPending()
{
	return mandreel_flashaudio_lite && (mandreel_audio_flash_lastBufferCreatedSwf != mandreel_audio_flash_lastBufferCreated);
}

var mandreel_audio_flash_lastBufferCreatedSwf = 0;
function fl_mandreel_audio_checkBuffersPending(sp)
{
	r_g0 = 0;
	if ( fl_internal_mandreel_audio_checkBuffersPending() )
		r_g0 = 1;
	dump("fl_mandreel_audio_checkBuffersPending ("+r_g0+") ("+mandreel_audio_flash_lastBufferCreatedSwf+") ("+mandreel_audio_flash_lastBufferCreated+")");
}


function fl_mandreel_audio_playChannel(sp)
{
	var ptr_fileName = heap32[sp>>2];sp+=4;  
	var channel = heap32[sp>>2];sp+=4;  
	var vol = heapFloat[sp>>2];sp+=4;  
	var loop = heap32[sp>>2];sp+=4;
	var pitch = heapFloat[sp>>2];sp+=4;  
	var fileName = get_string_from_ptr(ptr_fileName).toLowerCase();
	mandreel_sendmsg_flash("playChannel "+fileName+" "+channel+" "+loop+" "+vol+" "+pitch);
	r_g0 = 0;
}

function fl_mandreel_audio_stopChannel(sp)
{
	var ptr_fileName = heap32[sp>>2];sp+=4;  
	var channel = heap32[sp>>2];sp+=4; 
	var index = heapFloat[sp>>2];sp+=4; 
	
	mandreel_sendmsg_flash("stopChannel "+channel);
}

function fl_mandreel_audio_setChannelVolume(sp)
{
	var channel = heap32[sp>>2];sp+=4; 
	var vol = heapFloat[sp>>2];sp+=4; 

	mandreel_sendmsg_flash("setChannelVolume "+channel+" "+vol);
}

function fl_mandreel_audio_setChannelPan(sp)
{
	var channel = heap32[sp>>2];sp+=4; 
	var pan = heapFloat[sp>>2];sp+=4;  
	mandreel_sendmsg_flash("setChannelPan "+channel+" "+pan);
}

function fl_mandreel_audio_setChannelPitch(sp)
{
	var channel = heap32[sp>>2];sp+=4; 
	var pitch = heapFloat[sp>>2];sp+=4;  
	mandreel_sendmsg_flash("setChannelPitch "+channel+" "+pitch);
}


function mandreel_audio_load_flash()
{
	var failed = "";
	try
	{
		var mandreelAudioSwf = g_mandreel_working_folder+"mandreelaudio.swf";
		if ( mandreel_flashaudio_lite )
			mandreelAudioSwf = g_mandreel_working_folder+"mandreelaudiolite.swf";
		var swf = swfobject.createSWF({ data:mandreelAudioSwf, width:"0", height:"0", allowScriptAccess:"always" }, { menu:"false" }, "FlashDiv");
		if ( !swf )
			failed  = "swfobject.js not avaiable or Unable to open "+mandreelAudioSwf;
	}
	catch(err)
	{
		failed  = err;
	}
	if ( failed != "" )
	{
		dump("Failed to create flash audio driver ("+failed+"). Null driver will be used.");
		MandreelAudioDriver = "null";
	}
}

function fl_MainAudioDriver(audioServer, audioUrl)
{
	mandreel_flashaudio_server = audioServer;
	if ( mandreel_flashaudio_lite )
		mandreel_flashaudio_server = "";
	if ( mandreel_flashaudio_server != "" )
	{
		window.addEventListener("message", receiveMessage2, false);
		var el = document.createElement("iframe");
		el.setAttribute('id', 'ninja-iframe');
		el.setAttribute('width', '0');
		el.setAttribute('height', '0');
		el.setAttribute('frameborder', '0');
		document.body.appendChild(el);
		el.onerror = function(message) { alert(message); };
		el.setAttribute('src', audioServer+audioUrl+"/MandreelAudio.html");
		setTimeout("CheckNinjaFrameReady()", 1000);
	}
	else
	{
		setTimeout("mandreel_audio_load_flash()", 10);
	}
}
var ninjaLoaded = false;
function CheckNinjaFrameReady()
{
	try
	{
		mandreel_sendmsg_flash("loadFlash");
	}
	catch(err)
	{
	}
	if ( !ninjaLoaded )
		setTimeout("CheckNinjaFrameReady()", 1000);
}

function fl_map_mandreel_audio_functions()
{
	mandreel_audio_init = fl_mandreel_audio_init;
	mandreel_audio_end = fl_mandreel_audio_end;
	mandreel_audio_update = fl_mandreel_audio_update;
	mandreel_audio_createBuffer = fl_mandreel_audio_createBuffer;
	mandreel_audio_playChannel = fl_mandreel_audio_playChannel;
	mandreel_audio_stopChannel = fl_mandreel_audio_stopChannel;
	mandreel_audio_setChannelVolume = fl_mandreel_audio_setChannelVolume;
	mandreel_audio_setChannelPan = fl_mandreel_audio_setChannelPan;
	mandreel_audio_setChannelPitch = fl_mandreel_audio_setChannelPitch;
	if ( mandreel_flashaudio_musicaudiotag )
	{
		mandreel_audio_useMusicFunctions = wa_mandreel_audio_useMusicFunctions;
		mandreel_audio_playMusic = wa_mandreel_audio_playMusic;
		mandreel_audio_stopMusic = wa_mandreel_audio_stopMusic;
		mandreel_audio_setMusicVol = wa_mandreel_audio_setMusicVol;
	}
	else
		dump("WARNING: flash music functions not supported");
	mandreel_audio_checkBuffersPending = fl_mandreel_audio_checkBuffersPending;
}

function receiveMessage2(event)
{
	ninjaLoaded = true;
	fl_map_mandreel_audio_functions();
	setTimeout("MandreelAudioStarted()", 10);
}

function mandreel_flashlite_checkPreloadFinished()
{
	if ( !fl_internal_mandreel_audio_checkBuffersPending() )
		MandreelAudioStarted();
	else
		setTimeout("mandreel_flashlite_checkPreloadFinished()", 10);
}

function mandreel_flashlite_startPreload()
{
	mandreel_sendmsg_flash("init "+g_mandreel_working_folder);
	// preload sounds
	var FatLines = mandreelFatData.split('\n');
	for ( var i=0;i<FatLines.length;++i )
	{
		var params = FatLines[i].replace('\r','').split(',');
		if ( params[0] == "audiofile" && params[1] )
		{
			var sync_load = true;
			if (params[2] && (params[2]&1) == 0)
				sync_load = false;
				
			if (sync_load)
			{
				
				mandreel_flashaudiolite_createBuffer(params[1]);
			}
		}
	}
	setTimeout("mandreel_flashlite_checkPreloadFinished()", 10);
}

function flashReady()
{
	fl_map_mandreel_audio_functions();
	setTimeout("mandreel_flashlite_startPreload()",10);
}

function null_mandreel_audio(sp)
{
	r_g0 = 0;
}

function null_MainAudioDriver()
{
	mandreel_audio_init = null_mandreel_audio;
	mandreel_audio_end = null_mandreel_audio;
	mandreel_audio_update = null_mandreel_audio;
	mandreel_audio_createBuffer = null_mandreel_audio;
	mandreel_audio_playChannel = null_mandreel_audio;
	mandreel_audio_stopChannel = null_mandreel_audio;
	mandreel_audio_setChannelVolume = null_mandreel_audio;
	mandreel_audio_setChannelPan = null_mandreel_audio;
	mandreel_audio_setChannelPitch = null_mandreel_audio;
	mandreel_audio_useMusicFunctions = wa_mandreel_audio_useMusicFunctions;
	mandreel_audio_playMusic = wa_mandreel_audio_playMusic;
	mandreel_audio_stopMusic = wa_mandreel_audio_stopMusic;
	mandreel_audio_setMusicVol = wa_mandreel_audio_setMusicVol;
	setTimeout("MandreelAudioStarted()", 10);
}

var mandreel_flash_socket_callback = null

function mandreel_flash_sockets_load_flash(callback)
{
	mandreel_flash_socket_callback = callback;
	var failed = "";
	try
	{
		var mandreelSocketsSwf = g_mandreel_working_folder+"mandreelflashsockets.swf";
		var swf = swfobject.createSWF({ data:mandreelSocketsSwf, width:"0", height:"0", allowScriptAccess:"always" }, { menu:"false" }, "FlashDivSockets");
		if ( !swf )
			failed  = "Unable to open MandreelFlashSockets.swf";
	}
	catch(err)
	{
		failed  = err;
	}			
}

var js_mandreel_flash_socket_swf_loaded = false;

function js_mandreel_flash_socket_ready()
{
	js_mandreel_flash_socket_swf_loaded = true;
	if (mandreel_flash_socket_callback)
		mandreel_flash_socket_callback();
}


function Mandreel_Socket_InitLibrary(sp)
{
	mandreel_flash_sockets_load_flash();
}

function Mandreel_Socket_Library_Ready(sp)
{
	if (js_mandreel_flash_socket_swf_loaded)
		r_g0 = 1;
	else
		r_g0 = 0;	
}

function mandreel_flash_sockets_getFlashMovieObject(movieName)
{
	if (window.document[movieName])
	{
		return window.document[movieName];
	}
	if (navigator.appName.indexOf("Microsoft Internet")==-1)
	{
		if (document.embeds && document.embeds[movieName])
			return document.embeds[movieName];
	}
	else
	{
		return document.getElementById(movieName);
	}
}

function js_mandreel_flash_socket_onError(message)
{
	var id = parseInt(message);
	
	var sp = g_stack_pointer+512*1024;
	
	dump('on error ' + id);
	
	heap32[sp>>2] = id;	
	mandreel_flash_tcp_onError(sp);
	
}
function js_mandreel_flash_socket_onConnect(message)
{
	var id = parseInt(message);
	
	var sp = g_stack_pointer+512*1024;
	
	dump('connected ' + id);
	
	heap32[sp>>2] = id;	
	mandreel_flash_tcp_onConnect(sp);
}

function js_mandreel_flash_tcp_receive_callbak(message)
{	
	var strings = message.split(' ');
	
	var id = parseInt(strings[0]);
	var data = strings[1];
	
	var sp = g_stack_pointer+512*1024;
	
	var data_ptr = sp + 1024;
	fill_ptr_from_string(data_ptr,data);
	
	heap32[sp>>2] = id;
	heap32[(sp+4)>>2] = data_ptr;		
	mandreel_flash_tcp_receive_callbak(sp);	
}

function js_mandreel_flash_tcp_update(sp)
{
	var id = heap32[sp>>2];sp+=4;
	var size = heap32[sp>>2];sp+=4;
	
	var flashMovie=mandreel_flash_sockets_getFlashMovieObject("FlashDivSockets");	
	flashMovie.receiveMessage("receive " + id + " " + size);
}

function js_mandreel_flash_tcp_create(sp)
{
	var id = heap32[sp>>2];sp+=4;
		
	var flashMovie=mandreel_flash_sockets_getFlashMovieObject("FlashDivSockets");		
	flashMovie.receiveMessage("create " + id);
}

function js_mandreel_flash_tcp_connectTo(sp)
{
	var id = heap32[sp>>2];sp+=4;
	var ptr_string = heap32[sp>>2];sp+=4;
	var port = heap32[sp>>2];sp+=4;
	
	var server_name = get_string_from_ptr(ptr_string);
	
	var flashMovie=mandreel_flash_sockets_getFlashMovieObject("FlashDivSockets");	
	flashMovie.receiveMessage("connect " + id + " " + server_name + " " + port);
}

function js_mandreel_flash_tcp_close(sp)
{
	var id = heap32[sp>>2];sp+=4;
		
	
	var flashMovie=mandreel_flash_sockets_getFlashMovieObject("FlashDivSockets");	
	flashMovie.receiveMessage("close " + id);
	dump("js_mandreel_flash_tcp_close " + id);
}
function js_mandreel_flash_tcp_write(sp)
{
	var id = heap32[sp>>2];sp+=4;
	var ptr = heap32[sp>>2];sp+=4;
	
	var message = get_string_from_ptr(ptr);
	
	dump('js_mandreel_flash_tcp_write ' + message);
	
	var flashMovie=mandreel_flash_sockets_getFlashMovieObject("FlashDivSockets");	
	r_g0 = flashMovie.receiveMessage("send " + id + " " + message);
}



function js_mandreel_flash_tcp_dump(msg)
{
	dump(msg);
}

function _Z5benchv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
var __label__ = 0;
	i7 = sp + -104400;var g0 = i7>>2; // save stack
	r0 = sp + -103048; 
	r1 = r0 >> 2;
	heap32[(r1+2)] = 128;
	heap32[(r1+1)] = 0;
	heap32[(g0)] = 1024;
	malloc(i7);
	r2 = r_g0;
	r3 = 1024;
	heap32[(fp+-25762)] = r2;
	r5 = 0;
_1: while(true){
	r4 = (r3 + -1)&-1;
	r3 = (r2 - r3)&-1;
	heap8[r3+1024] = r5;
	r3 = r4;
	if(r4 !=0) //_LBB0_1
{
continue _1;
}
else{
break _1;
}
}
	r2 = 56;
_4: while(true){
	r3 = (r2 + -1)&-1;
	r2 = (r0 - r2)&-1;
	heap8[r2+68] = r5;
	r2 = r3;
	if(r3 !=0) //_LBB0_3
{
continue _4;
}
else{
break _4;
}
}
	r2 = _ZN16b2BlockAllocator28s_blockSizeLookupInitializedE_2E_b;
	r3 = heapU8[r2];
if(!(r3 != 0)) //_LBB0_11
{
	r3 = 1;
_9: while(true){
	if(r3 <641) //_LBB0_6
{
	if(r5 <14) //_LBB0_8
{
	r4 = _ZN16b2BlockAllocator12s_blockSizesE;
	r6 = r5 << 2;
	r4 = (r4 + r6)&-1;
	r4 = r4 >> 2;
	r4 = heap32[(r4)];
	r4 = r4 < r3;
	r4 = r4 & 1;
	r6 = (r3 + 1)&-1;
	r5 = (r5 + r4)&-1;
	r4 = _ZN16b2BlockAllocator17s_blockSizeLookupE;
	heap8[r4+r3] = r5;
	r3 = r6;
}
else{
__label__ = 7;
break _9;
}
}
else{
__label__ = 10;
break _9;
}
}
switch(__label__ ){//multiple entries
case 10: 
	r3 = 1;
	heap8[r2] = r3;
break;
case 7: 
	r0 = _2E_str562;
	r1 = _2E_str158;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 73;
	_assert(i7);
break;
}
}
	heap32[(r1+25617)] = 0;
	heap32[(r1+25618)] = 0;
	heap32[(r1+25619)] = 0;
	heap32[(r1+25716)] = 0;
	heap32[(r1+25718)] = -1;
	heap32[(r1+25721)] = 16;
	heap32[(r1+25720)] = 0;
	heap32[(g0)] = 576;
	malloc(i7);
	r2 = r_g0;
	r3 = (r0 + 102468)&-1;
	r4 = (r0 + 102864)&-1;
	r5 = (r0 + 102884)&-1;
	r6 = (r0 + 102876)&-1;
	r7 = 576;
	heap32[(r1+25719)] = r2;
	r9 = 0;
_17: while(true){
	r8 = (r7 + -1)&-1;
	r7 = (r2 - r7)&-1;
	heap8[r7+576] = r9;
	r7 = r8;
	if(r8 !=0) //_LBB0_12
{
continue _17;
}
else{
break _17;
}
}
_19: while(true){
	r7 = (r9 * 9)&-1;
	r7 = r7 << 2;
	r2 = (r2 + r7)&-1;
	r9 = (r9 + 1)&-1;
	r2 = r2 >> 2;
	r8 = r6 >> 2;
	heap32[(r2+5)] = r9;
	r2 = heap32[(r8)];
	r2 = (r2 + r7)&-1;
	r2 = r2 >> 2;
	heap32[(r2+8)] = -1;
	r7 = r5 >> 2;
	r10 = heap32[(r7)];
	r2 = heap32[(r8)];
	r11 = (r10 + -1)&-1;
	if(r11 >r9) //_LBB0_13
{
continue _19;
}
else{
break _19;
}
}
	r5 = (r10 * 36)&-1;
	r2 = (r5 + r2)&-1;
	r2 = r2 >> 2;
	heap32[(r2+-4)] = -1;
	r2 = heap32[(r7)];
	r5 = heap32[(r8)];
	r2 = (r2 * 36)&-1;
	r2 = (r2 + r5)&-1;
	r2 = r2 >> 2;
	heap32[(r2+-1)] = -1;
	heap32[(r1+25722)] = 0;
	heap32[(r1+25723)] = 0;
	heap32[(r1+25724)] = 0;
	heap32[(r1+25725)] = 0;
	heap32[(r1+25730)] = 16;
	heap32[(r1+25731)] = 0;
	heap32[(g0)] = 192;
	malloc(i7);
	heap32[(r1+25729)] = r_g0;
	heap32[(r1+25727)] = 16;
	heap32[(r1+25728)] = 0;
	heap32[(g0)] = 64;
	malloc(i7);
	heap32[(r1+25726)] = r_g0;
	heap32[(r1+25733)] = 0;
	r2 = b2_defaultFilter;
	heap32[(r1+25734)] = 0;
	r5 = b2_defaultListener;
	heap32[(r1+25735)] = r2;
	heap32[(r1+25736)] = r5;
	heap32[(r1+25745)] = 0;
	heap32[(r1+25746)] = 0;
	heap32[(r1+25738)] = 0;
	heap32[(r1+25739)] = 0;
	heap32[(r1+25740)] = 0;
	r2 = 1;
	heap32[(r1+25741)] = 0;
	heap8[sp+-56] = r2;
	r5 = 0;
	heap8[sp+-55] = r2;
	heap8[sp+-54] = r5;
	heap8[sp+-53] = r2;
	heap8[sp+-72] = r2;
	heap32[(r1+25742)] = 0;
	heap32[(r1+25743)] = -1054867456;
	heap32[(r1+25717)] = 4;
	r6 = (r0 + 102916)&-1;
	r7 = (r0 + 102904)&-1;
	r9 = (r0 + 102952)&-1;
	r10 = (r0 + 102976)&-1;
	r11 = -102996;
	heap32[(r1+25747)] = 0;
	heap32[(r1+25737)] = r0;
_22: while(true){
	r12 = (r11 + -1)&-1;
	r11 = (r0 - r11)&-1;
	heap8[r11] = r5;
	r11 = r12;
	if(r12 !=-103028) //_LBB0_15
{
continue _22;
}
else{
break _22;
}
}
	r11 = heapU8[r10];
_25: do {
if(!(r11 ==0)) //_LBB0_21
{
	r11 = r9 >> 2;
	heap8[r10] = r5;
	r10 = heap32[(r11)];
if(!(r10 ==0)) //_LBB0_21
{
__label__ = 18; //SET chanka
_27: while(true){
	r11 = heapU16[(r10+4)>>1];
	r12 = r11 & 2;
if(!(r12 !=0)) //_LBB0_20
{
	r11 = r11 | 2;
	r12 = r10 >> 2;
	heap16[(r10+4)>>1] = r11;
	heap32[(r12+36)] = 0;
}
	r10 = r10 >> 2;
	r10 = heap32[(r10+24)];
	if(r10 !=0) //_LBB0_18
{
continue _27;
}
else{
break _25;
}
}
}
}
} while(0);
	r10 = sp + -104128; 
	r11 = r10 >> 2;
	heap32[(r11+11)] = 0;
	heap32[(r11+1)] = 0;
	heap32[(r11+2)] = 0;
	heap32[(r11+3)] = 0;
	heap32[(r11+4)] = 0;
	heap32[(r11+5)] = 0;
	heap32[(r11+6)] = 0;
	heap32[(r11+7)] = 0;
	heap32[(r11+8)] = 0;
	heap8[sp+-104092] = r2;
	heap8[sp+-104091] = r2;
	heap8[sp+-104090] = r5;
	heap8[sp+-104089] = r5;
	heap32[(fp+-26032)] = 0;
	heap8[sp+-104088] = r2;
	heap32[(r11+12)] = 1065353216;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r10;
	r10 = _ZTV11b2EdgeShape;
	r11 = sp + -104176; 
	_ZN7b2World10CreateBodyEPK9b2BodyDef(i7);
	r10 = (r10 + 8)&-1;
	r13 = r11 >> 2;
	heap32[(fp+-26044)] = r10;
	heap32[(r13+1)] = 1;
	heap32[(r13+2)] = 1008981770;
	heap32[(r13+7)] = 0;
	heap32[(r13+8)] = 0;
	heap32[(r13+9)] = 0;
	heap32[(r13+10)] = 0;
	heap32[(r13+3)] = -1038090240;
	heap32[(r13+4)] = 0;
	heap32[(r13+5)] = 1109393408;
	heap32[(r13+6)] = 0;
	heap8[sp+-104132] = r5;
	heap8[sp+-104131] = r5;
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r11;
	heap32[(g0+2)] = 0;
	_ZN6b2Body13CreateFixtureEPK7b2Shapef(i7);
	r11 = _ZTV14b2PolygonShape;
	r12 = sp + -104328; 
	r11 = (r11 + 8)&-1;
	heap32[(fp+-26044)] = r10;
	r10 = r12 >> 2;
	heap32[(fp+-26082)] = r11;
	heap32[(r10+1)] = 2;
	heap32[(r10+2)] = 1008981770;
	heap32[(r10+37)] = 4;
	heap32[(r10+5)] = -1090519040;
	heap32[(r10+6)] = -1090519040;
	heap32[(r10+7)] = 1056964608;
	heap32[(r10+8)] = -1090519040;
	heap32[(r10+9)] = 1056964608;
	heap32[(r10+10)] = 1056964608;
	heap32[(r10+11)] = -1090519040;
	heap32[(r10+12)] = 1056964608;
	heap32[(r10+21)] = 0;
	heap32[(r10+22)] = -1082130432;
	heap32[(r10+23)] = 1065353216;
	heap32[(r10+24)] = 0;
	heap32[(r10+25)] = 0;
	heap32[(r10+26)] = 1065353216;
	heap32[(r10+27)] = -1082130432;
	r13 = sp + -104384; 
	heap32[(r10+28)] = 0;
	r14 = (r13 + 4)&-1;
	r15 = 40;
	f0 =                        -7;
	f1 =                      0.75;
	heap32[(r10+3)] = 0;
	heap32[(r10+4)] = 0;
	f4 =                         0;
	f5 =                     1.125;
_33: while(true){
	r10 = r15;
	f2 = f0;
	f3 = f1;
_35: while(true){
	r16 = r13 >> 2;
	r17 = r14 >> 2;
	heap32[(r16+11)] = 0;
	heap32[(r17)] = 0;
	heap32[(r17+1)] = 0;
	heap32[(r17+2)] = 0;
	heap32[(r17+3)] = 0;
	heap32[(r17+4)] = 0;
	heap32[(r17+5)] = 0;
	heap32[(r17+6)] = 0;
	heap32[(r17+7)] = 0;
	heap8[sp+-104348] = r2;
	heap8[sp+-104347] = r2;
	heap8[sp+-104346] = r5;
	heap8[sp+-104345] = r5;
	heap8[sp+-104344] = r2;
	heap32[(r16+12)] = 1065353216;
	heap32[(fp+-26096)] = 2;
	heapFloat[(r16+1)] = f2;
	heapFloat[(r16+2)] = f3;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r13;
	_ZN7b2World10CreateBodyEPK9b2BodyDef(i7);
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r12;
	heap32[(g0+2)] = 1084227584;
	r10 = (r10 + -1)&-1;
	f3 = f3+f4;
	f2 = f2+f5;
	_ZN6b2Body13CreateFixtureEPK7b2Shapef(i7);
	if(r10 !=0) //_LBB0_22
{
continue _35;
}
else{
break _35;
}
}
	f2 =                         1;
	f3 =                    0.5625;
	r15 = (r15 + -1)&-1;
	f1 = f1+f2;
	f0 = f0+f3;
	if(r15 ==0) //_LBB0_25
{
break _33;
}
else{
continue _33;
}
}
	r10 = 64;
	heap32[(fp+-26082)] = r11;
_39: while(true){
	r10 = (r10 + -1)&-1;
	heap32[(g0)] = r0;
	_ZN7b2World4StepEfii(i7);
	if(r10 !=0) //_LBB0_26
{
continue _39;
}
else{
break _39;
}
}
	r10 = r5;
	f1 =                      1000;
_42: while(true){
	r11 = sp + -16; 
	heap32[(g0)] = r11;
	heap32[(g0+1)] = 0;
	gettimeofday(i7);
	r11 = r11 >> 2;
	r12 = heap32[(fp+-4)];
	r11 = heap32[(r11+1)];
	heap32[(g0)] = r0;
	_ZN7b2World4StepEfii(i7);
	r13 = sp + -8; 
	heap32[(g0)] = r13;
	heap32[(g0+1)] = 0;
	gettimeofday(i7);
	r14 = heap32[(fp+-2)];
	r15 = r14 >> 31;
	heap32[(g0)] = r14;
	heap32[(g0+1)] = r15;
	heap32[(g0+2)] = 1000000;
	heap32[(g0+3)] = 0;
	r13 = r13 >> 2;
	r13 = heap32[(r13+1)];
	__muldi3(i7);
	r16 = (r_g0 + r13)&-1;
	r17 = r13 >> 31;
	r14 = uint(r16) < uint(r_g0) ? r2 : r5; 
	r15 = (r_g1 + r17)&-1;
	r13 = uint(r16) < uint(r13) ? r2 : r14; 
	r13 = (r15 + r13)&-1;
	heap32[(g0)] = r16;
	heap32[(g0+1)] = r13;
	heap32[(g0+2)] = 1000;
	heap32[(g0+3)] = 0;
	__udivdi3(i7);
	r13 = r_g0;
	r14 = r12 >> 31;
	heap32[(g0)] = r12;
	heap32[(g0+1)] = r14;
	heap32[(g0+2)] = 1000000;
	heap32[(g0+3)] = 0;
	__muldi3(i7);
	r15 = (r_g0 + r11)&-1;
	r16 = r11 >> 31;
	r12 = uint(r15) < uint(r_g0) ? r2 : r5; 
	r14 = (r_g1 + r16)&-1;
	r11 = uint(r15) < uint(r11) ? r2 : r12; 
	r11 = (r14 + r11)&-1;
	heap32[(g0)] = r15;
	heap32[(g0+1)] = r11;
	heap32[(g0+2)] = 1000;
	heap32[(g0+3)] = 0;
	__udivdi3(i7);
	r12 = sp + -104072; 
	r14 = r10 << 2;
	r14 = (r12 + r14)&-1;
	r11 = (r13 - r_g0)&-1;
	f0 = r11; //fitos r11, f0
	r13 = r14 >> 2;
	f0 = f0/f1;
	heap32[(r13)] = r11;
	f0 = f0*f1;
	r11 = _2E_str;
	f0 = f0; //fstod f0, f0
	heap32[(g0)] = r11;
	llvm_writeDouble((i7+8),f0);
	r10 = (r10 + 1)&-1;
	printf(i7);
	if(r10 !=256) //_LBB0_28
{
continue _42;
}
else{
break _42;
}
}
	r2 = _2E_str1;
	r5 = 0;
	heap32[(g0)] = r2;
	printf(i7);
	r2 = r5;
_45: while(true){
	r10 = r5 << 2;
	r10 = (r12 + r10)&-1;
	r10 = r10 >> 2;
	r10 = heap32[(r10)];
	r5 = (r5 + 1)&-1;
	r2 = (r10 + r2)&-1;
	if(r5 !=256) //_LBB0_30
{
continue _45;
}
else{
break _45;
}
}
	f0 = r2; //fitos r2, f0
	f2 =                0.00390625;
	f0 = f0*f2;
	f0 = f0/f1;
	f0 = f0*f1;
	f0 = f0; //fstod f0, f0
	heap32[(g0)] = r11;
	llvm_writeDouble((i7+8),f0);
	r2 = r9 >> 2;
	printf(i7);
	r2 = heap32[(r2)];
_48: do {
if(!(r2 ==0)) //_LBB0_45
{
_49: while(true){
	r2 = r2 >> 2;
	r5 = heap32[(r2+25)];
	r2 = heap32[(r2+24)];
if(!(r5 ==0)) //_LBB0_44
{
_52: while(true){
	r9 = r5 >> 2;
	r5 = heap32[(r9+1)];
	heap32[(r9+7)] = 0;
	r10 = heap32[(r9+3)];
	r11 = r10 >> 2;
	r11 = heap32[(r11)];
	r11 = r11 >> 2;
	r11 = heap32[(r11+3)];
	heap32[(g0)] = r10;
	__FUNCTION_TABLE__[(r11)>>2](i7);
	r11 = heap32[(r9+6)];
	r10 = (r_g0 * 28)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r11;
	heap32[(g0+2)] = r10;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
	heap32[(r9+6)] = 0;
	r10 = heap32[(r9+3)];
	r11 = r10 >> 2;
	r12 = heap32[(r11+1)];
	if(r12 >1) //_LBB0_36
{
	if(r12 ==2) //_LBB0_40
{
	r11 = heap32[(r11)];
	r11 = r11 >> 2;
	r11 = heap32[(r11)];
	heap32[(g0)] = r10;
	__FUNCTION_TABLE__[(r11)>>2](i7);
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r10;
	heap32[(g0+2)] = 152;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
}
else{
	if(r12 ==3) //_LBB0_41
{
	r11 = heap32[(r11)];
	r11 = r11 >> 2;
	r11 = heap32[(r11)];
	heap32[(g0)] = r10;
	__FUNCTION_TABLE__[(r11)>>2](i7);
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r10;
	heap32[(g0+2)] = 40;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
}
else{
break _49;
}
}
}
else{
	if(r12 ==0) //_LBB0_38
{
	r11 = heap32[(r11)];
	r11 = r11 >> 2;
	r11 = heap32[(r11)];
	heap32[(g0)] = r10;
	__FUNCTION_TABLE__[(r11)>>2](i7);
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r10;
	heap32[(g0+2)] = 20;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
}
else{
	if(r12 ==1) //_LBB0_39
{
	r11 = heap32[(r11)];
	r11 = r11 >> 2;
	r11 = heap32[(r11)];
	heap32[(g0)] = r10;
	__FUNCTION_TABLE__[(r11)>>2](i7);
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r10;
	heap32[(g0+2)] = 48;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
}
else{
break _49;
}
}
}
	heap32[(r9+3)] = 0;
if(!(r5 !=0)) //_LBB0_33
{
break _52;
}
}
}
if(!(r2 !=0)) //_LBB0_32
{
break _48;
}
}
	r0 = _2E_str7;
	r1 = _2E_str32144;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 115;
	_assert(i7);
}
} while(0);
	r0 = r7 >> 2;
	r0 = heap32[(r0)];
	heap32[(g0)] = r0;
	r0 = r6 >> 2;
	free(i7);
	r0 = heap32[(r0)];
	heap32[(g0)] = r0;
	free(i7);
	r0 = heap32[(r8)];
	heap32[(g0)] = r0;
	r0 = r3 >> 2;
	free(i7);
	r0 = heap32[(r0)];
	if(r0 ==0) //_LBB0_47
{
	r0 = r4 >> 2;
	r0 = heap32[(r0)];
	if(r0 ==0) //_LBB0_49
{
	r0 = heap32[(fp+-25762)];
	r2 = heap32[(r1+1)];
_73: do {
	if(r2 >0) //_LBB0_51
{
	r2 = 0;
_75: while(true){
	r3 = r2 << 3;
	r0 = (r0 + r3)&-1;
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	heap32[(g0)] = r0;
	free(i7);
	r2 = (r2 + 1)&-1;
	r0 = heap32[(fp+-25762)];
	r3 = heap32[(r1+1)];
if(!(r3 >r2)) //_LBB0_52
{
break _73;
}
}
}
} while(0);
	heap32[(g0)] = r0;
	free(i7);
	return;
}
else{
	r1 = _2E_str270;
	r0 = _2E_str169;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 33;
	_assert(i7);
}
}
else{
	r1 = _2E_str68;
	r4 = _2E_str169;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = 32;
	_assert(i7);
}
}

function main(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	_Z5benchv(i7);
	r0 = 0;
	r_g0 = r0;
	return;
}

function _Z22b2CollideEdgeAndCircleP10b2ManifoldPK11b2EdgeShapeRK11b2TransformPK13b2CircleShapeS6_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+3)];
	r2 = heap32[(fp+4)];
	r3 = r0 >> 2;
	r2 = r2 >> 2;
	heap32[(r3+15)] = 0;
	r1 = r1 >> 2;
	f0 = heapFloat[(r2+2)];
	f1 = heapFloat[(r1+3)];
	f2 = heapFloat[(r2+3)];
	f3 = heapFloat[(r1+4)];
	r4 = heap32[(fp+2)];
	f4 = f2*f1;
	f5 = f0*f3;
	f0 = f0*f1;
	f1 = f2*f3;
	r4 = r4 >> 2;
	f2 = f4-f5;
	f3 = heapFloat[(r2)];
	f0 = f0+f1;
	f1 = heapFloat[(r2+1)];
	f2 = f2+f3;
	f3 = heapFloat[(r4)];
	f0 = f0+f1;
	f1 = heapFloat[(r4+1)];
	r2 = heap32[(fp+1)];
	f4 = heapFloat[(r4+3)];
	f2 = f2-f3;
	f3 = heapFloat[(r4+2)];
	f0 = f0-f1;
	r4 = r2 >> 2;
	f1 = f4*f0;
	f5 = f2*f3;
	f2 = f4*f2;
	f0 = f3*f0;
	f3 = heapFloat[(r4+5)];
	f0 = f2+f0;
	f2 = heapFloat[(r4+3)];
	f4 = heapFloat[(r4+6)];
	f1 = f1-f5;
	f5 = heapFloat[(r4+4)];
	f6 = f3-f2;
	f7 = f0-f2;
	f8 = f4-f5;
	f9 = f1-f5;
	f10 = f6*f7;
	f11 = f8*f9;
	f12 = heapFloat[(r4+2)];
	f13 = heapFloat[(r1+2)];
	f10 = f10+f11;
	f11 = f12+f13;
	f12 =                         0;
_1: do {
	if(f10 >f12) //_LBB2_7
{
	f13 = f3-f0;
	f14 = f4-f1;
	f13 = f6*f13;
	f14 = f8*f14;
	f13 = f13+f14;
	if(f13 >f12) //_LBB2_12
{
	f14 = f6*f6;
	f15 = f8*f8;
	f14 = f14+f15;
	if(f14 >f12) //_LBB2_14
{
	f15 = f2*f13;
	f3 = f3*f10;
	f13 = f5*f13;
	f4 = f4*f10;
	f10 =                         1;
	f3 = f15+f3;
	f14 = f10/f14;
	f4 = f13+f4;
	f3 = f3*f14;
	f4 = f4*f14;
	f0 = f0-f3;
	f1 = f1-f4;
	f0 = f0*f0;
	f1 = f1*f1;
	f3 = f11*f11;
	f0 = f0+f1;
	if(f3 <f0) //_LBB2_22
{
__label__ = 21;
break _1;
}
else{
	f0 = f6*f9;
	f1 = f7*f8;
	f0 = f0-f1;
	if(f0 <f12) //_LBB2_17
{
	f6 = -f6;
}
else{
	f8 = -f8;
}
	f0 = f8*f8;
	f1 = f6*f6;
	f0 = f0+f1;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	f0 = f_g0;
	f1 =   1.1920928955078125e-007;
	if(f0 >=f1) //_LBB2_20
{
	f0 = f10/f0;
	f8 = f8*f0;
	f6 = f6*f0;
}
	heap32[(r3+15)] = 1;
	heap32[(r3+14)] = 1;
	heapFloat[(r3+10)] = f8;
	heapFloat[(r3+11)] = f6;
	heapFloat[(r3+12)] = f2;
	heapFloat[(r3+13)] = f5;
	r2 = 0;
	heap32[(r3+4)] = 0;
	heap8[r0+16] = r2;
	r4 = 1;
	heap8[r0+17] = r2;
	heap8[r0+18] = r4;
__label__ = 5;
break _1;
}
}
else{
	r0 = _2E_str2;
	r1 = _2E_str13;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 127;
	_assert(i7);
}
}
else{
	f1 = f1-f4;
	f0 = f0-f3;
	f2 = f0*f0;
	f5 = f1*f1;
	f6 = f11*f11;
	f2 = f2+f5;
	if(f6 <f2) //_LBB2_22
{
__label__ = 21;
break _1;
}
else{
	r2 = heapU8[r2+45];
if(!(r2 ==0)) //_LBB2_11
{
	f2 = heapFloat[(r4+9)];
	f5 = heapFloat[(r4+10)];
	f2 = f2-f3;
	f5 = f5-f4;
	f0 = f2*f0;
	f1 = f5*f1;
	f0 = f0+f1;
	if(f0 >f12) //_LBB2_22
{
__label__ = 21;
break _1;
}
}
	heap32[(r3+15)] = 1;
	heap32[(r3+14)] = 0;
	heap32[(r3+10)] = 0;
	heap32[(r3+11)] = 0;
	heapFloat[(r3+12)] = f3;
	heapFloat[(r3+13)] = f4;
	r2 = 1;
	heap32[(r3+4)] = 0;
	r4 = 0;
	heap8[r0+16] = r2;
	heap8[r0+17] = r4;
	heap8[r0+18] = r4;
	heap8[r0+19] = r4;
__label__ = 6;
break _1;
}
}
}
else{
	f3 = f7*f7;
	f4 = f9*f9;
	f6 = f11*f11;
	f3 = f3+f4;
	if(f6 <f3) //_LBB2_22
{
__label__ = 21;
}
else{
	r2 = heapU8[r2+44];
if(!(r2 ==0)) //_LBB2_4
{
	f3 = heapFloat[(r4+7)];
	f4 = heapFloat[(r4+8)];
	f3 = f2-f3;
	f0 = f2-f0;
	f4 = f5-f4;
	f1 = f5-f1;
	f0 = f3*f0;
	f1 = f4*f1;
	f0 = f0+f1;
	if(f0 >f12) //_LBB2_22
{
__label__ = 21;
break _1;
}
}
	heap32[(r3+15)] = 1;
	heap32[(r3+14)] = 0;
	heap32[(r3+10)] = 0;
	heap32[(r3+11)] = 0;
	heapFloat[(r3+12)] = f2;
	heapFloat[(r3+13)] = f5;
	r2 = 0;
	heap32[(r3+4)] = 0;
	heap8[r0+16] = r2;
	heap8[r0+17] = r2;
	heap8[r0+18] = r2;
__label__ = 5;
}
}
} while(0);
switch(__label__ ){//multiple entries
case 21: 
	return;
break;
case 5: 
	heap8[r0+19] = r2;
break;
}
	f0 = heapFloat[(r1+4)];
	heap32[(r3)] = heap32[(r1+3)];
	heapFloat[(r3+1)] = f0;
	return;
}

function _Z23b2CollideEdgeAndPolygonP10b2ManifoldPK11b2EdgeShapeRK11b2TransformPK14b2PolygonShapeS6_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
var __label__ = 0;
	i7 = sp + -352;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+4)];
	r1 = heap32[(fp+2)];
	r0 = r0 >> 2;
	r1 = r1 >> 2;
	f0 = heapFloat[(r0+1)];
	f1 = heapFloat[(r1+1)];
	f2 = heapFloat[(r0)];
	f3 = heapFloat[(r1)];
	f2 = f2-f3;
	f3 = heapFloat[(r1+3)];
	f0 = f0-f1;
	f1 = heapFloat[(r1+2)];
	f4 = heapFloat[(r0+2)];
	f5 = heapFloat[(r0+3)];
	r0 = sp + -328; 
	f6 = f3*f2;
	f7 = f1*f0;
	r1 = r0 >> 2;
	f0 = f3*f0;
	f2 = f2*f1;
	f6 = f6+f7;
	f7 = f3*f4;
	f8 = f1*f5;
	f0 = f0-f2;
	heapFloat[(r1+33)] = f6;
	f2 = f3*f5;
	f1 = f1*f4;
	f3 = f7-f8;
	heapFloat[(r1+34)] = f0;
	r2 = heap32[(fp+3)];
	f1 = f2+f1;
	heapFloat[(r1+35)] = f3;
	r3 = r2 >> 2;
	heapFloat[(r1+36)] = f1;
	f2 = heapFloat[(r3+3)];
	f4 = heapFloat[(r3+4)];
	f5 = f1*f2;
	f7 = f3*f4;
	f5 = f5-f7;
	f2 = f3*f2;
	f1 = f1*f4;
	f1 = f2+f1;
	f2 = f5+f6;
	r4 = heap32[(fp+1)];
	f0 = f1+f0;
	heapFloat[(r1+37)] = f2;
	r5 = r4 >> 2;
	heapFloat[(r1+38)] = f0;
	f0 = heapFloat[(r5+8)];
	heap32[(r1+39)] = heap32[(r5+7)];
	heapFloat[(r1+40)] = f0;
	f0 = heapFloat[(r5+4)];
	f1 = heapFloat[(r5+3)];
	heapFloat[(r1+41)] = f1;
	heapFloat[(r1+42)] = f0;
	f2 = heapFloat[(r5+6)];
	f3 = heapFloat[(r5+5)];
	heapFloat[(r1+43)] = f3;
	heapFloat[(r1+44)] = f2;
	f4 = heapFloat[(r5+10)];
	heap32[(r1+45)] = heap32[(r5+9)];
	heapFloat[(r1+46)] = f4;
	f0 = f2-f0;
	f1 = f3-f1;
	r5 = heapU8[r4+44];
	r4 = heapU8[r4+45];
	f2 = f1*f1;
	f3 = f0*f0;
	f2 = f2+f3;
	heapFloat[(g0)] = f2;
	sqrtf(i7);
	f2 = f_g0;
	r6 = heap32[(fp)];
	f3 =   1.1920928955078125e-007;
	if(f2 >=f3) //_LBB3_2
{
	f4 =                         1;
	f2 = f4/f2;
	f1 = f1*f2;
	f0 = f0*f2;
}
	f2 = -f1;
	heapFloat[(r1+49)] = f0;
	heapFloat[(r1+50)] = f2;
	f2 = heapFloat[(r1+41)];
	f4 = heapFloat[(r1+37)];
	f5 = heapFloat[(r1+42)];
	f6 = heapFloat[(r1+38)];
	f4 = f4-f2;
	f6 = f6-f5;
	f4 = f0*f4;
	f6 = f6*f1;
	f4 = f4-f6;
	r5 = r5 & 255;
	if(r5 !=0) //_LBB3_5
{
	f6 = heapFloat[(r1+40)];
	f7 = heapFloat[(r1+39)];
	f5 = f5-f6;
	f2 = f2-f7;
	f6 = f2*f2;
	f7 = f5*f5;
	f6 = f6+f7;
	heapFloat[(g0)] = f6;
	sqrtf(i7);
	f6 = f_g0;
	if(f6 >=f3) //_LBB3_7
{
	f7 =                         1;
	f6 = f7/f6;
	f2 = f2*f6;
	f5 = f5*f6;
}
	f6 = -f2;
	heapFloat[(r1+47)] = f5;
	heapFloat[(r1+48)] = f6;
	f6 = f2*f0;
	f7 = f5*f1;
	f8 = heapFloat[(r1+37)];
	f9 = heapFloat[(r1+39)];
	f10 = heapFloat[(r1+38)];
	f11 = heapFloat[(r1+40)];
	f8 = f8-f9;
	f9 = f10-f11;
	f6 = f6-f7;
	f7 =                         0;
	r7 = f6 >= f7;
	f5 = f5*f8;
	f2 = f9*f2;
	r7 = r7 & 1;
	f2 = f5-f2;
}
else{
	f2 =                         0;
	r7 = 0;
}
	r4 = r4 & 255;
_11: do {
	if(r4 ==0) //_LBB3_34
{
	if(r5 ==0) //_LBB3_49
{
	f0 =                         0;
	r4 = f4 >= f0;
	r4 = r4 & 1;
	heap8[sp+-80] = r4;
	if(f4 <f0) //_LBB3_51
{
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	f2 = -f1;
	f3 = -f0;
	heapFloat[(r1+53)] = f2;
	heapFloat[(r1+54)] = f3;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f0;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
}
else{
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	heapFloat[(r1+53)] = f1;
	f1 = -f1;
	heapFloat[(r1+54)] = f0;
	f0 = -f0;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f0;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
}
}
else{
	r4 = r7 & 255;
	if(r4 ==0) //_LBB3_39
{
	f0 =                         0;
	r4 = f2 < f0;
	r5 = f4 < f0;
	r4 = r4 | r5;
	r5 = r4 & 1;
	r5 = r5 ^ 1;
	heap8[sp+-80] = r5;
	if(r4 != 0) //_LBB3_41
{
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	f3 = -f1;
	f4 = -f0;
	heapFloat[(r1+53)] = f3;
	heapFloat[(r1+54)] = f4;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f0;
	f0 = heapFloat[(r1+48)];
	f1 = heapFloat[(r1+47)];
	f1 = -f1;
	f0 = -f0;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
}
else{
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	heapFloat[(r1+53)] = f1;
	heapFloat[(r1+54)] = f0;
	heapFloat[(r1+57)] = f1;
	f1 = -f1;
	heapFloat[(r1+58)] = f0;
	f0 = -f0;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
}
}
else{
	f0 =                         0;
	r4 = f2 < f0;
	r5 = f4 < f0;
	r4 = r4 & r5;
	r5 = r4 & 1;
	r5 = r5 ^ 1;
	heap8[sp+-80] = r5;
	if(r4 != 0) //_LBB3_38
{
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	f2 = -f1;
	f3 = -f0;
	heapFloat[(r1+53)] = f2;
	heapFloat[(r1+54)] = f3;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f0;
	heapFloat[(r1+59)] = f2;
	heapFloat[(r1+60)] = f3;
}
else{
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	heapFloat[(r1+53)] = f1;
	heapFloat[(r1+54)] = f0;
	f2 = heapFloat[(r1+48)];
	heap32[(r1+57)] = heap32[(r1+47)];
	f1 = -f1;
	heapFloat[(r1+58)] = f2;
	f0 = -f0;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
}
}
}
}
else{
	f5 = heapFloat[(r1+46)];
	f6 = heapFloat[(r1+44)];
	f7 = heapFloat[(r1+45)];
	f8 = heapFloat[(r1+43)];
	f5 = f5-f6;
	f6 = f7-f8;
	f7 = f6*f6;
	f8 = f5*f5;
	f7 = f7+f8;
	heapFloat[(g0)] = f7;
	sqrtf(i7);
	f7 = f_g0;
	if(f7 >=f3) //_LBB3_12
{
	f3 =                         1;
	f3 = f3/f7;
	f6 = f6*f3;
	f5 = f5*f3;
}
	f3 = -f6;
	heapFloat[(r1+51)] = f5;
	heapFloat[(r1+52)] = f3;
	f7 = heapFloat[(r1+37)];
	f8 = heapFloat[(r1+43)];
	f9 = heapFloat[(r1+38)];
	f10 = heapFloat[(r1+44)];
	f7 = f7-f8;
	f8 = f9-f10;
	f1 = f1*f5;
	f0 = f0*f6;
	f7 = f5*f7;
	f8 = f8*f6;
	f0 = f1-f0;
	f1 = f7-f8;
	if(r5 ==0) //_LBB3_42
{
	f2 =                         0;
	if(f0 <=f2) //_LBB3_46
{
	r4 = f4 < f2;
	r5 = f1 < f2;
	r4 = r4 | r5;
	r5 = r4 & 1;
	r5 = r5 ^ 1;
	heap8[sp+-80] = r5;
	if(r4 != 0) //_LBB3_48
{
	f4 = heapFloat[(r1+50)];
	f0 = heapFloat[(r1+49)];
	f1 = -f0;
	f2 = -f4;
	heapFloat[(r1+53)] = f1;
	f1 = -f5;
	heapFloat[(r1+54)] = f2;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f6;
	heapFloat[(r1+59)] = f0;
	heapFloat[(r1+60)] = f4;
}
else{
	f4 = heapFloat[(r1+50)];
	f5 = heapFloat[(r1+49)];
	heapFloat[(r1+53)] = f5;
	f6 = -f5;
	heapFloat[(r1+54)] = f4;
	f0 = -f4;
	heapFloat[(r1+57)] = f6;
	heapFloat[(r1+58)] = f0;
	heapFloat[(r1+59)] = f5;
	heapFloat[(r1+60)] = f4;
}
}
else{
	r4 = f4 < f2;
	r5 = f1 < f2;
	r4 = r4 & r5;
	r5 = r4 & 1;
	r5 = r5 ^ 1;
	heap8[sp+-80] = r5;
	if(r4 != 0) //_LBB3_45
{
	f1 = heapFloat[(r1+50)];
	f2 = heapFloat[(r1+49)];
	f4 = -f2;
	f5 = -f1;
	heapFloat[(r1+53)] = f4;
	heapFloat[(r1+54)] = f5;
	heapFloat[(r1+57)] = f4;
	heapFloat[(r1+58)] = f5;
	heapFloat[(r1+59)] = f2;
	heapFloat[(r1+60)] = f1;
}
else{
	f1 = heapFloat[(r1+50)];
	f2 = heapFloat[(r1+49)];
	heapFloat[(r1+53)] = f2;
	f2 = -f2;
	heapFloat[(r1+54)] = f1;
	f1 = -f1;
	heapFloat[(r1+57)] = f2;
	heapFloat[(r1+58)] = f1;
	heapFloat[(r1+59)] = f5;
	heapFloat[(r1+60)] = f3;
}
}
}
else{
	r5 = r7 & 255;
if(!(r5 !=1)) //_LBB3_19
{
	f7 =                         0;
if(!(f0 <=f7)) //_LBB3_19
{
	r5 = f2 < f7;
	r7 = f4 < f7;
	r5 = r5 & r7;
	r7 = f1 < f7;
	r5 = r5 & r7;
	r7 = r5 & 1;
	r7 = r7 ^ 1;
	heap8[sp+-80] = r7;
	if(r5 != 0) //_LBB3_18
{
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	f1 = -f1;
	f0 = -f0;
	heapFloat[(r1+53)] = f1;
	heapFloat[(r1+54)] = f0;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f0;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
break _11;
}
else{
	f0 = heapFloat[(r1+50)];
	heap32[(r1+53)] = heap32[(r1+49)];
	heapFloat[(r1+54)] = f0;
	f0 = heapFloat[(r1+48)];
	heap32[(r1+57)] = heap32[(r1+47)];
	heapFloat[(r1+58)] = f0;
	heapFloat[(r1+59)] = f5;
	heapFloat[(r1+60)] = f3;
break _11;
}
}
}
	if(r5 ==0) //_LBB3_25
{
	f7 =                         0;
	if(f0 <=f7) //_LBB3_31
{
	r5 = f2 < f7;
	r7 = f4 < f7;
	r5 = r5 | r7;
	r7 = f1 < f7;
	r5 = r5 | r7;
	r7 = r5 & 1;
	r7 = r7 ^ 1;
	heap8[sp+-80] = r7;
	if(r5 != 0) //_LBB3_33
{
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	f1 = -f1;
	f0 = -f0;
	heapFloat[(r1+53)] = f1;
	f1 = -f5;
	heapFloat[(r1+54)] = f0;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f6;
	f0 = heapFloat[(r1+48)];
	f1 = heapFloat[(r1+47)];
	f1 = -f1;
	f0 = -f0;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
}
else{
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	heapFloat[(r1+53)] = f1;
	heapFloat[(r1+54)] = f0;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f0;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
}
}
else{
_59: do {
if(!(f1 >=f7)) //_LBB3_29
{
if(!(f2 <f7)) //_LBB3_30
{
if(!(f4 <f7)) //_LBB3_30
{
break _59;
}
}
	r5 = 0;
	heap8[sp+-80] = r5;
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	f1 = -f1;
	f0 = -f0;
	heapFloat[(r1+53)] = f1;
	heapFloat[(r1+54)] = f0;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f0;
	f0 = heapFloat[(r1+48)];
	f1 = heapFloat[(r1+47)];
	f1 = -f1;
	f0 = -f0;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
break _11;
}
} while(0);
	r5 = 1;
	heap8[sp+-80] = r5;
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	heapFloat[(r1+53)] = f1;
	heapFloat[(r1+54)] = f0;
	heapFloat[(r1+57)] = f1;
	heapFloat[(r1+58)] = f0;
	heapFloat[(r1+59)] = f5;
	heapFloat[(r1+60)] = f3;
}
}
else{
	f0 =                         0;
_66: do {
if(!(f2 >=f0)) //_LBB3_23
{
if(!(f4 <f0)) //_LBB3_24
{
if(!(f1 <f0)) //_LBB3_24
{
break _66;
}
}
	r5 = 0;
	heap8[sp+-80] = r5;
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	f1 = -f1;
	f0 = -f0;
	heapFloat[(r1+53)] = f1;
	f2 = -f5;
	heapFloat[(r1+54)] = f0;
	heapFloat[(r1+57)] = f2;
	heapFloat[(r1+58)] = f6;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
break _11;
}
} while(0);
	r5 = 1;
	heap8[sp+-80] = r5;
	f0 = heapFloat[(r1+50)];
	f1 = heapFloat[(r1+49)];
	heapFloat[(r1+53)] = f1;
	heapFloat[(r1+54)] = f0;
	f2 = heapFloat[(r1+48)];
	heap32[(r1+57)] = heap32[(r1+47)];
	heapFloat[(r1+58)] = f2;
	heapFloat[(r1+59)] = f1;
	heapFloat[(r1+60)] = f0;
}
}
}
} while(0);
	r3 = heap32[(r3+37)];
	heap32[(r1+32)] = r3;
	if(r3 <1) //_LBB3_54
{
	r0 = r6 >> 2;
	heap32[(r1+61)] = 1017370378;
	heap32[(r0+15)] = 0;
	return;
}
else{
	r4 = 0;
_76: while(true){
	r5 = r4 << 3;
	r7 = (r2 + r5)&-1;
	r7 = r7 >> 2;
	f0 = heapFloat[(r1+36)];
	f1 = heapFloat[(r7+5)];
	f2 = heapFloat[(r1+35)];
	f3 = heapFloat[(r7+6)];
	f4 = f0*f1;
	f5 = f2*f3;
	r5 = (r0 + r5)&-1;
	f1 = f2*f1;
	f0 = f0*f3;
	f2 = f4-f5;
	f3 = heapFloat[(r1+33)];
	f4 = heapFloat[(r1+34)];
	f0 = f1+f0;
	r5 = r5 >> 2;
	f1 = f2+f3;
	f0 = f0+f4;
	heapFloat[(r5)] = f1;
	heapFloat[(r5+1)] = f0;
	f0 = heapFloat[(r1+35)];
	f1 = heapFloat[(r7+21)];
	f2 = heapFloat[(r1+36)];
	f3 = heapFloat[(r7+22)];
	f4 = f2*f1;
	f5 = f0*f3;
	f0 = f0*f1;
	f1 = f2*f3;
	f2 = f4-f5;
	r4 = (r4 + 1)&-1;
	f0 = f0+f1;
	heapFloat[(r5+16)] = f2;
	heapFloat[(r5+17)] = f0;
if(!(r3 >r4)) //_LBB3_55
{
break _76;
}
}
	r3 = heap32[(r1+32)];
	r4 = r6 >> 2;
	heap32[(r1+61)] = 1017370378;
	heap32[(r4+15)] = 0;
_79: do {
if(!(r3 <1)) //_LBB3_102
{
	f0 = heapFloat[(r1+42)];
	f1 = heapFloat[(r1+41)];
	f2 = heapFloat[(r1+53)];
	f3 = heapFloat[(r1+54)];
	f4 =   3.4028234663852886e+038;
	r5 = 0;
_81: while(true){
	r7 = r5 << 3;
	r7 = (r0 + r7)&-1;
	r7 = r7 >> 2;
	f5 = heapFloat[(r7)];
	f6 = heapFloat[(r7+1)];
	f5 = f5-f1;
	f6 = f6-f0;
	f5 = f2*f5;
	f6 = f3*f6;
	f5 = f5+f6;
	r5 = (r5 + 1)&-1;
	f4 = f4 > f5 ? f5 : f4; 
if(!(r5 <r3)) //_LBB3_58
{
break _81;
}
}
	f0 =      0.019999999552965164;
if(!(f4 >f0)) //_LBB3_102
{
	f1 = heapFloat[(r1+53)];
	f2 = heapFloat[(r1+54)];
	f3 =  -3.4028234663852886e+038;
	r5 = -1;
	r7 = 0;
	f5 = f3;
	r8 = r7;
_85: while(true){
	if(r3 >r8) //_LBB3_61
{
	r9 = r8 << 3;
	r9 = (r0 + r9)&-1;
	r9 = r9 >> 2;
	f6 = heapFloat[(r9+16)];
	f7 = heapFloat[(r1+41)];
	f8 = heapFloat[(r9)];
	f9 = heapFloat[(r1+43)];
	f10 = heapFloat[(r1+42)];
	f11 = heapFloat[(r9+1)];
	f12 = heapFloat[(r1+44)];
	f13 = heapFloat[(r9+17)];
	f10 = f11-f10;
	f11 = f11-f12;
	f12 = -f6;
	f7 = f8-f7;
	f8 = f8-f9;
	f7 = f7*f12;
	f9 = f10*f13;
	f8 = f8*f12;
	f10 = f11*f13;
	f7 = f7-f9;
	f8 = f8-f10;
	f7 = f7 < f8 ? f7 : f8; 
	if(f7 <=f0) //_LBB3_63
{
	f8 = -f13;
	f6 = f6*f2;
	f9 = f1*f8;
	f6 = f6+f9;
	f9 =                         0;
	if(f6 <f9) //_LBB3_67
{
	f6 = heapFloat[(r1+57)];
	f9 = heapFloat[(r1+58)];
	f6 = f12-f6;
	f8 = f8-f9;
	f6 = f6*f1;
	f8 = f8*f2;
	f6 = f6+f8;
	f8 =     -0.034906588494777679;
	if(f6 <f8) //_LBB3_66
{
__label__ = 66;
}
else{
	if(f5 >=f7) //_LBB3_66
{
__label__ = 66;
}
else{
__label__ = 65;
}
}
}
else{
	f6 = heapFloat[(r1+59)];
	f9 = heapFloat[(r1+60)];
	f12 = f12-f6;
	f8 = f8-f9;
	f12 = f12*f1;
	f8 = f8*f2;
	f8 = f12+f8;
	f12 =     -0.034906588494777679;
	if(f8 <f12) //_LBB3_66
{
__label__ = 66;
}
else{
	if(f5 <f7) //_LBB3_69
{
__label__ = 65;
}
else{
__label__ = 66;
}
}
}
switch(__label__ ){//multiple entries
case 65: 
	r7 = 2;
	f3 = f7;
	r5 = r8;
	f5 = f7;
break;
}
	r8 = (r8 + 1)&-1;
}
else{
__label__ = 59;
break _85;
}
}
else{
__label__ = 68;
break _85;
}
}
_97: do {
switch(__label__ ){//multiple entries
case 68: 
	if(r7 ==0) //_LBB3_76
{
__label__ = 72;
break _97;
}
else{
	r8 = r5;
	f7 = f3;
__label__ = 70;
break _97;
}
break;
case 59: 
	r7 = 2;
__label__ = 70;
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 70: 
	if(f7 >f0) //_LBB3_102
{
break _79;
}
else{
	f0 =       0.98000001907348633;
	f0 = f4*f0;
	f3 =     0.0010000000474974513;
	f0 = f0+f3;
	if(f7 >f0) //_LBB3_77
{
	r5 = (r6 + 56)&-1;
	if(r7 !=1) //_LBB3_85
{
	r5 = r5 >> 2;
	heap32[(r5)] = 2;
	f0 = heapFloat[(r1+42)];
	r5 = sp + -24; 
	r10 = r5 >> 2;
	heap32[(fp+-6)] = heap32[(r1+41)];
	r5 = 0;
	heapFloat[(r10+1)] = f0;
	heap8[sp+-16] = r5;
	heap8[sp+-15] = r8;
	r7 = 1;
	heap8[sp+-14] = r5;
	heap8[sp+-13] = r7;
	f0 = heapFloat[(r1+44)];
	heap32[(r10+3)] = heap32[(r1+43)];
	heapFloat[(r10+4)] = f0;
	r10 = (r8 + 1)&-1;
	r10 = r10 < r3 ? r10 : r5; 
	heap8[sp+-4] = r5;
	r3 = r10 << 3;
	r9 = r8 << 3;
	heap8[sp+-3] = r8;
	r3 = (r0 + r3)&-1;
	r0 = (r0 + r9)&-1;
	heap8[sp+-2] = r5;
	r3 = r3 >> 2;
	heap8[sp+-1] = r7;
	r0 = r0 >> 2;
	f0 = heapFloat[(r0)];
	f1 = heapFloat[(r0+1)];
	f2 = heapFloat[(r3)];
	f3 = heapFloat[(r3+1)];
	f4 = heapFloat[(r0+16)];
	f5 = heapFloat[(r0+17)];
__label__ = 82;
}
else{
__label__ = 74;
}
}
else{
__label__ = 72;
}
}
break;
}
switch(__label__ ){//multiple entries
case 72: 
	r5 = (r6 + 56)&-1;
__label__ = 74;
break;
}
switch(__label__ ){//multiple entries
case 74: 
	r5 = r5 >> 2;
	heap32[(r5)] = 1;
_110: do {
	if(r3 >1) //_LBB3_80
{
	f0 = heapFloat[(r1+16)];
	f3 = heapFloat[(r1+17)];
	f0 = f1*f0;
	f3 = f2*f3;
	r5 = 2;
	f0 = f0+f3;
	r8 = r3 > 2 ? r3 : r5; 
	r7 = (r0 + 76)&-1;
	r9 = 1;
	r5 = 0;
_112: while(true){
	r10 = r7 >> 2;
	f3 = heapFloat[(r10+-1)];
	f4 = heapFloat[(r10)];
	f3 = f1*f3;
	f4 = f2*f4;
	f3 = f3+f4;
	r10 = (r9 + 1)&-1;
	r5 = f3 < f0 ? r9 : r5; 
	f0 = f3 < f0 ? f3 : f0; 
	r7 = (r7 + 8)&-1;
	r9 = r10;
if(!(r8 !=r10)) //_LBB3_81
{
break _110;
}
}
}
else{
	r5 = 0;
}
} while(0);
	r8 = r5 << 3;
	r8 = (r0 + r8)&-1;
	r8 = r8 >> 2;
	r7 = sp + -24; 
	f0 = heapFloat[(r8+1)];
	r7 = r7 >> 2;
	heap32[(fp+-6)] = heap32[(r8)];
	r8 = 0;
	heapFloat[(r7+1)] = f0;
	r9 = (r5 + 1)&-1;
	r3 = r9 < r3 ? r9 : r8; 
	heap8[sp+-16] = r8;
	r9 = r3 << 3;
	r10 = 1;
	heap8[sp+-15] = r5;
	r0 = (r0 + r9)&-1;
	heap8[sp+-14] = r10;
	r0 = r0 >> 2;
	heap8[sp+-13] = r8;
	f0 = heapFloat[(r0+1)];
	heap32[(r7+3)] = heap32[(r0)];
	heapFloat[(r7+4)] = f0;
	heap8[sp+-4] = r8;
	heap8[sp+-3] = r3;
	heap8[sp+-2] = r10;
	heap8[sp+-1] = r8;
	r0 = heapU8[sp+-80];
	if(r0 ==0) //_LBB3_84
{
	f4 = heapFloat[(r1+50)];
	f6 = heapFloat[(r1+49)];
	r8 = 1;
	f0 = heapFloat[(r1+43)];
	f1 = heapFloat[(r1+44)];
	f2 = heapFloat[(r1+41)];
	f3 = heapFloat[(r1+42)];
	f5 = -f4;
	f4 = -f6;
	r10 = 0;
	r5 = r8;
}
else{
	f0 = heapFloat[(r1+41)];
	f1 = heapFloat[(r1+42)];
	f2 = heapFloat[(r1+43)];
	f3 = heapFloat[(r1+44)];
	f4 = heapFloat[(r1+49)];
	f5 = heapFloat[(r1+50)];
	r5 = r10;
}
break;
}
	f6 = f5*f0;
	f7 = f1*f4;
	r0 = sp + -48; 
	r3 = sp + -24; 
	f8 = -f4;
	f6 = f6-f7;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r3;
	heapFloat[(g0+2)] = f5;
	heapFloat[(g0+3)] = f8;
	heapFloat[(g0+4)] = f6;
	heap32[(g0+5)] = r8;
	_Z19b2ClipSegmentToLineP12b2ClipVertexPKS_RK6b2Vec2fi(i7);
	r3 = r_g0;
if(!(r3 <2)) //_LBB3_102
{
	f6 = -f5;
	f2 = f2*f6;
	f3 = f4*f3;
	r3 = sp + -72; 
	f2 = f2+f3;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r0;
	heapFloat[(g0+2)] = f6;
	heapFloat[(g0+3)] = f4;
	heapFloat[(g0+4)] = f2;
	heap32[(g0+5)] = r10;
	_Z19b2ClipSegmentToLineP12b2ClipVertexPKS_RK6b2Vec2fi(i7);
	r0 = r_g0;
if(!(r0 <2)) //_LBB3_102
{
	r0 = r5 & 1;
	if(r0 ==0) //_LBB3_90
{
	r7 = r8 << 3;
	r2 = (r2 + r7)&-1;
	r2 = r2 >> 2;
	f2 = heapFloat[(r2+22)];
	heap32[(r4+10)] = heap32[(r2+21)];
	heapFloat[(r4+11)] = f2;
	f2 = heapFloat[(r2+6)];
	heap32[(r4+12)] = heap32[(r2+5)];
	heapFloat[(r4+13)] = f2;
}
else{
	heapFloat[(r4+10)] = f4;
	heapFloat[(r4+11)] = f5;
	heapFloat[(r4+12)] = f0;
	heapFloat[(r4+13)] = f1;
}
	r2 = r3 >> 2;
	f2 = heapFloat[(r2+1)];
	f3 = heapFloat[(fp+-18)];
	f6 = heapFloat[(r1+61)];
	f7 = f3-f0;
	f8 = f2-f1;
	f7 = f4*f7;
	f8 = f5*f8;
	f7 = f7+f8;
	if(f6 >=f7) //_LBB3_93
{
	if(r0 ==0) //_LBB3_95
{
	heapFloat[(r4)] = f3;
	heapFloat[(r4+1)] = f2;
	r0 = heapU8[sp+-61];
	heap8[r6+18] = r0;
	r0 = heapU8[sp+-62];
	heap8[r6+19] = r0;
	r0 = heapU8[sp+-63];
	heap8[r6+16] = r0;
	r3 = heapU8[sp+-64];
	r0 = 1;
	heap8[r6+17] = r3;
}
else{
	f7 = heapFloat[(r1+33)];
	f8 = heapFloat[(r1+34)];
	f3 = f3-f7;
	f7 = heapFloat[(r1+36)];
	f9 = heapFloat[(r1+35)];
	f2 = f2-f8;
	f8 = f7*f3;
	f10 = f9*f2;
	f2 = f7*f2;
	f3 = f3*f9;
	f7 = f8+f10;
	f2 = f2-f3;
	heapFloat[(r4)] = f7;
	heapFloat[(r4+1)] = f2;
	r3 = heap32[(r2+2)];
	r0 = 1;
	heap32[(r4+4)] = r3;
}
}
else{
	r0 = 0;
}
	f2 = heapFloat[(r2+4)];
	f3 = heapFloat[(r2+3)];
	f0 = f3-f0;
	f1 = f2-f1;
	f0 = f4*f0;
	f1 = f5*f1;
	f0 = f0+f1;
	if(f6 >=f0) //_LBB3_100
{
	if(r5 != 0) //_LBB3_99
{
	f0 = heapFloat[(r1+33)];
	f1 = heapFloat[(r1+34)];
	r5 = (r0 * 20)&-1;
	f3 = f3-f0;
	f0 = heapFloat[(r1+36)];
	f4 = heapFloat[(r1+35)];
	f2 = f2-f1;
	r1 = (r6 + r5)&-1;
	f1 = f0*f3;
	f5 = f4*f2;
	r1 = r1 >> 2;
	f2 = f0*f2;
	f3 = f3*f4;
	f0 = f1+f5;
	f2 = f2-f3;
	heapFloat[(r1)] = f0;
	heapFloat[(r1+1)] = f2;
	r2 = heap32[(r2+5)];
	heap32[(r1+4)] = r2;
}
else{
	r1 = (r0 * 20)&-1;
	r1 = (r6 + r1)&-1;
	r2 = r1 >> 2;
	heapFloat[(r2)] = f3;
	heapFloat[(r2+1)] = f2;
	r2 = heapU8[sp+-49];
	heap8[r1+18] = r2;
	r2 = heapU8[sp+-50];
	heap8[r1+19] = r2;
	r2 = heapU8[sp+-51];
	heap8[r1+16] = r2;
	r2 = heapU8[sp+-52];
	heap8[r1+17] = r2;
}
	r0 = (r0 + 1)&-1;
}
	heap32[(r4+15)] = r0;
	return;
}
}
}
}
} while(0);
	return;
}
}

function _ZL16b2EdgeSeparationPK14b2PolygonShapeRK11b2TransformiS1_S4_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
if(!(r0 <0)) //_LBB4_2
{
	r1 = heap32[(fp)];
	r2 = r1 >> 2;
	r2 = heap32[(r2+37)];
	if(r2 >r0) //_LBB4_3
{
	r2 = heap32[(fp+3)];
	r3 = r2 >> 2;
	r4 = heap32[(fp+1)];
	r5 = heap32[(fp+4)];
	r3 = heap32[(r3+37)];
	r0 = r0 << 3;
	r0 = (r1 + r0)&-1;
	r1 = r4 >> 2;
	r0 = r0 >> 2;
	f0 = heapFloat[(r1+2)];
	f1 = heapFloat[(r0+21)];
	f2 = heapFloat[(r1+3)];
	f3 = heapFloat[(r0+22)];
	r4 = r5 >> 2;
	f4 = f2*f1;
	f5 = f0*f3;
	f1 = f0*f1;
	f3 = f2*f3;
	f6 = heapFloat[(r4+3)];
	f4 = f4-f5;
	f5 = heapFloat[(r4+2)];
	f1 = f1+f3;
_4: do {
	if(r3 >0) //_LBB4_5
{
	f3 = f6*f1;
	f7 = f4*f5;
	f8 = f6*f4;
	f9 = f5*f1;
	f3 = f3-f7;
	f7 = f8+f9;
	r6 = 0;
	f8 =   3.4028234663852886e+038;
	r5 = r6;
_6: while(true){
	r7 = r6 << 3;
	r7 = (r2 + r7)&-1;
	r7 = r7 >> 2;
	f9 = heapFloat[(r7+5)];
	f10 = heapFloat[(r7+6)];
	f9 = f9*f7;
	f10 = f10*f3;
	f9 = f9+f10;
	r7 = (r6 + 1)&-1;
	r5 = f9 < f8 ? r6 : r5; 
	f8 = f9 < f8 ? f9 : f8; 
	r6 = r7;
if(!(r3 !=r7)) //_LBB4_6
{
break _4;
}
}
}
else{
	r5 = 0;
}
} while(0);
	r3 = r5 << 3;
	r2 = (r2 + r3)&-1;
	r2 = r2 >> 2;
	f3 = heapFloat[(r2+5)];
	f7 = heapFloat[(r2+6)];
	f8 = heapFloat[(r0+5)];
	f9 = heapFloat[(r0+6)];
	f10 = f6*f3;
	f11 = f5*f7;
	f12 = f2*f8;
	f13 = f0*f9;
	f3 = f5*f3;
	f5 = f6*f7;
	f0 = f0*f8;
	f2 = f2*f9;
	f6 = f10-f11;
	f7 = heapFloat[(r4)];
	f8 = f12-f13;
	f9 = heapFloat[(r1)];
	f3 = f3+f5;
	f5 = heapFloat[(r4+1)];
	f0 = f0+f2;
	f2 = heapFloat[(r1+1)];
	f6 = f6+f7;
	f7 = f8+f9;
	f3 = f3+f5;
	f0 = f0+f2;
	f2 = f6-f7;
	f0 = f3-f0;
	f2 = f2*f4;
	f0 = f0*f1;
	f0 = f2+f0;
	f_g0 = f0;
	return;
}
}
	r0 = _2E_str4;
	r1 = _2E_str15;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 32;
	_assert(i7);
}

function _ZL19b2FindMaxSeparationPiPK14b2PolygonShapeRK11b2TransformS2_S5_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+3)];
	r1 = heap32[(fp+4)];
	r2 = heap32[(fp+1)];
	r3 = heap32[(fp+2)];
	r4 = r2 >> 2;
	r5 = heap32[(r4+37)];
	r6 = heap32[(fp)];
_1: do {
	if(r5 >0) //_LBB5_2
{
	r7 = r1 >> 2;
	r8 = r3 >> 2;
	r9 = r0 >> 2;
	f0 = heapFloat[(r8+2)];
	f1 = heapFloat[(r4+3)];
	f2 = heapFloat[(r8+3)];
	f3 = heapFloat[(r4+4)];
	f4 = heapFloat[(r7+2)];
	f5 = heapFloat[(r9+3)];
	f6 = heapFloat[(r7+3)];
	f7 = heapFloat[(r9+4)];
	f8 = f6*f5;
	f9 = f4*f7;
	f10 = f2*f1;
	f11 = f0*f3;
	f4 = f4*f5;
	f5 = f6*f7;
	f1 = f0*f1;
	f3 = f2*f3;
	f6 = f8-f9;
	f7 = heapFloat[(r7)];
	f8 = f10-f11;
	f9 = heapFloat[(r8)];
	f4 = f4+f5;
	f5 = heapFloat[(r7+1)];
	f1 = f1+f3;
	f3 = heapFloat[(r8+1)];
	f6 = f6+f7;
	f7 = f8+f9;
	f4 = f4+f5;
	f1 = f1+f3;
	f3 = f6-f7;
	f1 = f4-f1;
	f4 = f2*f1;
	f5 = f3*f0;
	f2 = f2*f3;
	f0 = f0*f1;
	f1 = f4-f5;
	f0 = f2+f0;
	r7 = 0;
	f2 =  -3.4028234663852886e+038;
	r4 = r7;
_3: while(true){
	r8 = r7 << 3;
	r8 = (r2 + r8)&-1;
	r8 = r8 >> 2;
	f3 = heapFloat[(r8+21)];
	f4 = heapFloat[(r8+22)];
	f3 = f3*f0;
	f4 = f4*f1;
	f3 = f3+f4;
	r8 = (r7 + 1)&-1;
	r4 = f3 > f2 ? r7 : r4; 
	f2 = f3 > f2 ? f3 : f2; 
	r7 = r8;
	if(r5 !=r8) //_LBB5_3
{
continue _3;
}
else{
break _1;
}
}
}
else{
	r4 = 0;
}
} while(0);
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r4;
	heap32[(g0+3)] = r0;
	heap32[(g0+4)] = r1;
	_ZL16b2EdgeSeparationPK14b2PolygonShapeRK11b2TransformiS1_S4_(i7);
	f0 = f_g0;
	r7 = r4 > 0 ? r4 : r5; 
	r7 = (r7 + -1)&-1;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r7;
	heap32[(g0+3)] = r0;
	heap32[(g0+4)] = r1;
	_ZL16b2EdgeSeparationPK14b2PolygonShapeRK11b2TransformiS1_S4_(i7);
	f1 = f_g0;
	r8 = (r4 + 1)&-1;
	r9 = 0;
	r8 = r8 < r5 ? r8 : r9; 
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r8;
	heap32[(g0+3)] = r0;
	heap32[(g0+4)] = r1;
	_ZL16b2EdgeSeparationPK14b2PolygonShapeRK11b2TransformiS1_S4_(i7);
	f2 = f_g0;
	if(f1 <=f0) //_LBB5_7
{
__label__ = 7;
}
else{
	if(f1 <=f2) //_LBB5_7
{
__label__ = 7;
}
else{
	r8 = 1;
__label__ = 9;
}
}
switch(__label__ ){//multiple entries
case 7: 
	if(f2 >f0) //_LBB5_9
{
	r7 = r8;
	f1 = f2;
	r8 = r9;
__label__ = 9;
}
else{
__label__ = 13;
}
break;
}
_13: do {
switch(__label__ ){//multiple entries
case 9: 
_14: while(true){
	r4 = r7;
	f0 = f1;
	r7 = r8 & 1;
	if(r7 ==0) //_LBB5_12
{
	r7 = (r4 + 1)&-1;
	r7 = r7 < r5 ? r7 : r9; 
}
else{
	r7 = r4 > 0 ? r4 : r5; 
	r7 = (r7 + -1)&-1;
}
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r7;
	heap32[(g0+3)] = r0;
	heap32[(g0+4)] = r1;
	_ZL16b2EdgeSeparationPK14b2PolygonShapeRK11b2TransformiS1_S4_(i7);
	f1 = f_g0;
	if(f1 >f0) //_LBB5_10
{
continue _14;
}
else{
break _13;
}
}
break;
}
} while(0);
	r0 = r6 >> 2;
	heap32[(r0)] = r4;
	f_g0 = f0;
	return;
}

function _Z19b2ClipSegmentToLineP12b2ClipVertexPKS_RK6b2Vec2fi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = r0 >> 2;
	f0 = heapFloat[(r1)];
	f1 = heapFloat[(fp+2)];
	f2 = heapFloat[(r1+3)];
	f3 = heapFloat[(r1+1)];
	f4 = heapFloat[(fp+3)];
	f5 = heapFloat[(r1+4)];
	f6 = f0*f1;
	f3 = f3*f4;
	f1 = f2*f1;
	f2 = f5*f4;
	f3 = f6+f3;
	f4 = heapFloat[(fp+4)];
	f1 = f1+f2;
	f2 = f3-f4;
	r2 = heap32[(fp)];
	r3 = heap32[(fp+5)];
	f1 = f1-f4;
	f3 =                         0;
	if(f2 <=f3) //_LBB6_2
{
	r5 = r2 >> 2;
	heapFloat[(r5)] = f0;
	heap32[(r5+1)] = heap32[(r1+1)];
	r6 = heap32[(r1+2)];
	r4 = 1;
	heap32[(r5+2)] = r6;
}
else{
	r4 = 0;
}
	if(f1 <=f3) //_LBB6_5
{
	r5 = (r4 * 12)&-1;
	r5 = (r2 + r5)&-1;
	r5 = r5 >> 2;
	heap32[(r5)] = heap32[(r1+3)];
	heap32[(r5+1)] = heap32[(r1+4)];
	r6 = heap32[(r1+5)];
	r4 = (r4 + 1)&-1;
	heap32[(r5+2)] = r6;
}
	f0 = f2*f1;
if(!(f0 >=f3)) //_LBB6_8
{
	f0 = f2-f1;
	f1 = heapFloat[(r1+3)];
	f3 = heapFloat[(r1)];
	r5 = (r4 * 12)&-1;
	f1 = f1-f3;
	f0 = f2/f0;
	f2 = heapFloat[(r1+4)];
	f4 = heapFloat[(r1+1)];
	r1 = (r2 + r5)&-1;
	f2 = f2-f4;
	f1 = f1*f0;
	f0 = f2*f0;
	r2 = r1 >> 2;
	f1 = f3+f1;
	f0 = f4+f0;
	heapFloat[(r2)] = f1;
	heapFloat[(r2+1)] = f0;
	heap8[r1+8] = r3;
	r0 = heapU8[r0+9];
	r2 = 0;
	heap8[r1+9] = r0;
	r0 = 1;
	heap8[r1+10] = r2;
	heap8[r1+11] = r0;
	r4 = (r4 + 1)&-1;
}
	r_g0 = r4;
	return;
}

function _ZN15b2DistanceProxy3SetEPK7b2Shapei(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var f0;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = r0 >> 2;
	r2 = heap32[(r1+1)];
	r3 = heap32[(fp)];
_1: do {
	if(r2 >1) //_LBB7_3
{
	if(r2 ==2) //_LBB7_6
{
	r3 = r3 >> 2;
	r0 = (r0 + 20)&-1;
	heap32[(r3+4)] = r0;
	r0 = heap32[(r1+37)];
	heap32[(r3+5)] = r0;
	heap32[(r3+6)] = heap32[(r1+2)];
	return;
}
else{
	if(r2 ==3) //_LBB7_7
{
	r0 = heap32[(fp+2)];
if(!(r0 <0)) //_LBB7_9
{
	r2 = heap32[(r1+4)];
	if(r2 >r0) //_LBB7_10
{
	r2 = r0 << 3;
	r4 = heap32[(r1+3)];
	r4 = (r4 + r2)&-1;
	r4 = r4 >> 2;
	f0 = heapFloat[(r4+1)];
	r5 = r3 >> 2;
	heap32[(r5)] = heap32[(r4)];
	heapFloat[(r5+1)] = f0;
	r4 = heap32[(r1+3)];
	r0 = (r0 + 1)&-1;
	r6 = heap32[(r1+4)];
	if(r0 >=r6) //_LBB7_12
{
	r0 = r4 >> 2;
	f0 = heapFloat[(r0+1)];
	heap32[(r5+2)] = heap32[(r0)];
	heapFloat[(r5+3)] = f0;
}
else{
	r0 = (r4 + r2)&-1;
	r0 = r0 >> 2;
	f0 = heapFloat[(r0+3)];
	heap32[(r5+2)] = heap32[(r0+2)];
	heapFloat[(r5+3)] = f0;
}
	heap32[(r5+4)] = r3;
	heap32[(r5+5)] = 2;
	heap32[(r5+6)] = heap32[(r1+2)];
	return;
}
}
	r0 = _2E_str410;
	r1 = _2E_str18;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 53;
	_assert(i7);
}
else{
break _1;
}
}
}
else{
	if(r2 ==0) //_LBB7_5
{
	r3 = r3 >> 2;
	r0 = (r0 + 12)&-1;
	heap32[(r3+4)] = r0;
	heap32[(r3+5)] = 1;
	heap32[(r3+6)] = heap32[(r1+2)];
	return;
}
else{
	if(r2 ==1) //_LBB7_14
{
	r2 = r3 >> 2;
	r0 = (r0 + 12)&-1;
	heap32[(r2+4)] = r0;
	heap32[(r2+5)] = 2;
	heap32[(r2+6)] = heap32[(r1+2)];
	return;
}
}
}
} while(0);
	r0 = _2E_str7;
	r1 = _2E_str18;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 81;
	_assert(i7);
}

function _Z10b2DistanceP16b2DistanceOutputP14b2SimplexCachePK15b2DistanceInput(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
	var r20;
	var r21;
	var r22;
	var r23;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
	var f16;
	var f17;
	var f18;
	var f19;
	var f20;
	var f21;
	var f22;
	var f23;
	var f24;
	var f25;
	var f26;
	var f27;
var __label__ = 0;
	i7 = sp + -152;var g0 = i7>>2; // save stack
	r0 = b2_gjkCalls;
	r0 = r0 >> 2;
	r1 = heap32[(r0)];
	r1 = (r1 + 1)&-1;
	r2 = heap32[(fp+1)];
	heap32[(r0)] = r1;
	r0 = heapU16[(r2+4)>>1];
	if(uint(r0) <uint(4)) //_LBB8_2
{
	r1 = heap32[(fp+2)];
	r3 = r1 >> 2;
	r4 = heap32[(fp)];
	f0 = heapFloat[(r3+14)];
	f1 = heapFloat[(r3+15)];
	f2 = heapFloat[(r3+16)];
	f3 = heapFloat[(r3+17)];
	f4 = heapFloat[(r3+18)];
	f5 = heapFloat[(r3+19)];
	f6 = heapFloat[(r3+20)];
	f7 = heapFloat[(r3+21)];
	r5 = sp + -112; 
	r6 = 0;
	r7 = r5 >> 2;
	heap32[(r7+27)] = r0;
_3: while(true){
	if(r0 >r6) //_LBB8_3
{
	r0 = (r6 * 9)&-1;
	r7 = sp + -112; 
	r8 = r0 << 2;
	r8 = (r7 + r8)&-1;
	r9 = (r2 + r6)&-1;
	r10 = heapU8[r9+6];
	r8 = r8 >> 2;
	heap32[(r8+7)] = r10;
	r9 = heapU8[r9+9];
	heap32[(r8+8)] = r9;
	r11 = heap32[(r3+5)];
	if(r11 >r10) //_LBB8_5
{
	r11 = heap32[(r3+12)];
	if(r11 >r9) //_LBB8_7
{
	r11 = heap32[(r3+4)];
	r10 = r10 << 3;
	r10 = (r11 + r10)&-1;
	r10 = r10 >> 2;
	f8 = heapFloat[(r10)];
	f9 = heapFloat[(r10+1)];
	r10 = heap32[(r3+11)];
	r9 = r9 << 3;
	r9 = (r10 + r9)&-1;
	r9 = r9 >> 2;
	r10 = r0 << 2;
	f10 = f3*f8;
	f11 = f2*f9;
	r0 = r0 << 2;
	r10 = (r7 + r10)&-1;
	f12 = heapFloat[(r9)];
	f13 = heapFloat[(r9+1)];
	f8 = f2*f8;
	f9 = f3*f9;
	f10 = f10-f11;
	r0 = (r7 + r0)&-1;
	f11 = f7*f12;
	f14 = f6*f13;
	f8 = f8+f9;
	r9 = r10 >> 2;
	f9 = f10+f0;
	r0 = r0 >> 2;
	f10 = f6*f12;
	f12 = f7*f13;
	f11 = f11-f14;
	f8 = f8+f1;
	heapFloat[(r9)] = f9;
	f11 = f11+f4;
	heapFloat[(r0+1)] = f8;
	f10 = f10+f12;
	f10 = f10+f5;
	heapFloat[(r0+2)] = f11;
	f9 = f11-f9;
	heapFloat[(r8+3)] = f10;
	f8 = f10-f8;
	heapFloat[(r0+4)] = f9;
	heapFloat[(r0+5)] = f8;
	r7 = r7 >> 2;
	heap32[(r0+6)] = 0;
	r6 = (r6 + 1)&-1;
	r0 = heap32[(r7+27)];
}
else{
__label__ = 4;
break _3;
}
}
else{
__label__ = 4;
break _3;
}
}
else{
__label__ = 8;
break _3;
}
}
_8: do {
switch(__label__ ){//multiple entries
case 8: 
_10: do {
	if(r0 >1) //_LBB8_11
{
	r6 = r2 >> 2;
	f8 = heapFloat[(r6)];
	if(r0 >1) //_LBB8_14
{
	if(r0 ==2) //_LBB8_18
{
	r0 = sp + -112; 
	r0 = r0 >> 2;
	f9 = heapFloat[(r0+5)];
	f10 = heapFloat[(r0+14)];
	f11 = heapFloat[(r0+4)];
	f12 = heapFloat[(r0+13)];
	f11 = f11-f12;
	f9 = f9-f10;
	f10 = f11*f11;
	f9 = f9*f9;
	f9 = f10+f9;
	heapFloat[(g0)] = f9;
	sqrtf(i7);
	f9 = f_g0;
}
else{
	if(r0 ==3) //_LBB8_19
{
	r0 = sp + -112; 
	r0 = r0 >> 2;
	f9 = heapFloat[(r0+13)];
	f10 = heapFloat[(r0+4)];
	f11 = heapFloat[(r0+22)];
	f12 = heapFloat[(r0+23)];
	f13 = heapFloat[(r0+5)];
	f14 = heapFloat[(r0+14)];
	f9 = f9-f10;
	f12 = f12-f13;
	f13 = f14-f13;
	f10 = f11-f10;
	f9 = f9*f12;
	f10 = f13*f10;
	f9 = f9-f10;
}
else{
__label__ = 18;
break _10;
}
}
}
else{
	if(r0 ==0) //_LBB8_17
{
__label__ = 15;
break _10;
}
else{
	if(r0 ==1) //_LBB8_16
{
	f9 =                         0;
}
else{
__label__ = 18;
break _10;
}
}
}
	f10 =                       0.5;
	f10 = f8*f10;
if(!(f10 >f9)) //_LBB8_25
{
	f8 = f8+f8;
if(!(f8 <f9)) //_LBB8_25
{
	f8 =   1.1920928955078125e-007;
if(!(f9 <f8)) //_LBB8_25
{
	r0 = sp + -112; 
	r0 = r0 >> 2;
	r0 = heap32[(r0+27)];
__label__ = 24;
break _10;
}
}
}
	r0 = sp + -112; 
	r0 = r0 >> 2;
	heap32[(r0+27)] = 0;
__label__ = 25;
}
else{
__label__ = 24;
}
} while(0);
switch(__label__ ){//multiple entries
case 24: 
	if(r0 !=0) //_LBB8_32
{
	r6 = (r0 + -1)&-1;
	if(uint(r6) >uint(2)) //_LBB8_35
{
	r0 = _2E_str7;
	r1 = _2E_str18;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 207;
	_assert(i7);
}
else{
	r6 = r5;
__label__ = 30;
}
}
else{
__label__ = 25;
}
break;
}
switch(__label__ ){//multiple entries
case 25: 
	r6 = sp + -112; 
	r7 = r6 >> 2;
	heap32[(r7+7)] = 0;
	heap32[(r7+8)] = 0;
	r0 = heap32[(r3+5)];
	if(r0 >0) //_LBB8_29
{
	r0 = heap32[(r3+12)];
	if(r0 >0) //_LBB8_31
{
	r0 = heap32[(r3+4)];
	r0 = r0 >> 2;
	f8 = heapFloat[(r0)];
	f9 = heapFloat[(r0+1)];
	r0 = heap32[(r3+11)];
	r0 = r0 >> 2;
	f10 = f3*f8;
	f11 = f2*f9;
	f12 = heapFloat[(r0)];
	f13 = heapFloat[(r0+1)];
	f8 = f2*f8;
	f9 = f3*f9;
	f10 = f10-f11;
	f11 = f7*f12;
	f14 = f6*f13;
	f8 = f8+f9;
	f9 = f10+f0;
	f10 = f6*f12;
	f12 = f7*f13;
	f11 = f11-f14;
	f8 = f8+f1;
	heapFloat[(fp+-28)] = f9;
	f11 = f11+f4;
	heapFloat[(r7+1)] = f8;
	f10 = f10+f12;
	f10 = f10+f5;
	heapFloat[(r7+2)] = f11;
	f9 = f11-f9;
	heapFloat[(r7+3)] = f10;
	f8 = f10-f8;
	heapFloat[(r7+4)] = f9;
	r0 = 1;
	heapFloat[(r7+5)] = f8;
	heap32[(r7+27)] = 1;
__label__ = 30;
}
else{
break _8;
}
}
else{
break _8;
}
break;
}
_37: do {
switch(__label__ ){//multiple entries
case 30: 
	r7 = b2_gjkIters;
	r7 = r7 >> 2;
	r8 = (r5 + 36)&-1;
	f8 = -f6;
	r9 = (r5 + 72)&-1;
	r10 = heap32[(r7)];
	r5 = (r5 + 32)&-1;
	r11 = 0;
_39: while(true){
	if(r11 <20) //_LBB8_36
{
if(!(r0 <1)) //_LBB8_39
{
	r12 = sp + -124; 
	r13 = sp + -136; 
	r14 = r5;
	r15 = r0;
_44: while(true){
	r16 = r14 >> 2;
	r17 = r12 >> 2;
	r18 = heap32[(r16+-1)];
	heap32[(r17)] = r18;
	r15 = (r15 + -1)&-1;
	r14 = (r14 + 36)&-1;
	r17 = (r13 + 4)&-1;
	r12 = (r12 + 4)&-1;
	r13 = r13 >> 2;
	r16 = heap32[(r16)];
	heap32[(r13)] = r16;
	r13 = r17;
if(!(r15 !=0)) //_LBB8_38
{
break _44;
}
}
}
	r12 = (r11 + 1)&-1;
_47: do {
	if(r0 ==3) //_LBB8_49
{
	r13 = sp + -112; 
	r14 = r13 >> 2;
	f10 = heapFloat[(r14+13)];
	f11 = heapFloat[(r14+5)];
	f13 = heapFloat[(r14+23)];
	f12 = heapFloat[(r14+14)];
	f9 = heapFloat[(r14+4)];
	f14 = heapFloat[(r14+22)];
	f15 = f10-f9;
	f16 = f13-f11;
	f17 = f12-f11;
	f18 = f14-f9;
	f19 = f9*f15;
	f20 = f11*f17;
	f21 = f9*f18;
	f22 = f11*f16;
	f19 = f19+f20;
	f20 = f21+f22;
	f21 = -f19;
	f22 = -f20;
	f23 =                         0;
if(!(f21 >f23)) //_LBB8_52
{
if(!(f22 >f23)) //_LBB8_52
{
	r13 = 1;
	heap32[(r14+6)] = 1065353216;
	heap32[(r14+27)] = 1;
__label__ = 68;
break _47;
}
}
	f24 = f9*f12;
	f25 = f11*f10;
	f26 = f15*f16;
	f27 = f17*f18;
	f15 = f10*f15;
	f17 = f12*f17;
	f26 = f26-f27;
	f24 = f24-f25;
	f15 = f15+f17;
	f17 = f24*f26;
if(!(f21 <=f23)) //_LBB8_56
{
if(!(f15 <=f23)) //_LBB8_56
{
if(!(f17 >f23)) //_LBB8_56
{
	f13 =                         1;
	f14 = f15-f19;
	f13 = f13/f14;
	f14 = f15*f13;
	f13 = f13*f21;
	heapFloat[(r14+6)] = f14;
	heapFloat[(r14+15)] = f13;
	heap32[(r14+27)] = 2;
__label__ = 69;
break _47;
}
}
}
	f11 = f14*f11;
	f9 = f13*f9;
	f18 = f14*f18;
	f16 = f13*f16;
	f9 = f11-f9;
	f11 = f18+f16;
	f9 = f9*f26;
	if(f22 <=f23) //_LBB8_60
{
__label__ = 56;
}
else{
	if(f11 <=f23) //_LBB8_60
{
__label__ = 56;
}
else{
	if(f9 >f23) //_LBB8_60
{
__label__ = 56;
}
else{
	f9 =                         1;
	f10 = f11-f20;
	f9 = f9/f10;
	f11 = f11*f9;
	f9 = f9*f22;
	heapFloat[(r14+6)] = f11;
	heapFloat[(r14+24)] = f9;
	r13 = r9 >> 2;
	heap32[(r14+27)] = 2;
	r15 = heap32[(r13)];
	r16 = r8 >> 2;
	r17 = heap32[(r13+1)];
	r18 = heap32[(r13+2)];
	r19 = heap32[(r13+3)];
	r20 = heap32[(r13+4)];
	r21 = heap32[(r13+5)];
	r22 = heap32[(r13+6)];
	r23 = heap32[(r13+7)];
	r13 = heap32[(r13+8)];
	heap32[(r16)] = r15;
	heap32[(r16+1)] = r17;
	heap32[(r16+2)] = r18;
	heap32[(r16+3)] = r19;
	heap32[(r16+4)] = r20;
	heap32[(r16+5)] = r21;
	heap32[(r16+6)] = r22;
	heap32[(r16+7)] = r23;
	heap32[(r16+8)] = r13;
__label__ = 67;
}
}
}
switch(__label__ ){//multiple entries
case 56: 
	f16 = f14-f10;
	f18 = f13-f12;
	f19 = f10*f16;
	f20 = f12*f18;
	f19 = f19+f20;
	f20 = -f19;
if(!(f15 >f23)) //_LBB8_63
{
if(!(f20 >f23)) //_LBB8_63
{
	heap32[(r14+15)] = 1065353216;
	r15 = r8 >> 2;
	heap32[(r14+27)] = 1;
	r13 = 1;
	r16 = heap32[(r15)];
	r17 = heap32[(r15+1)];
	r18 = heap32[(r15+2)];
	r19 = heap32[(r15+3)];
	r20 = heap32[(r15+4)];
	r21 = heap32[(r15+5)];
	r22 = heap32[(r15+6)];
	r23 = heap32[(r15+7)];
	r15 = heap32[(r15+8)];
	heap32[(fp+-28)] = r16;
	heap32[(r14+1)] = r17;
	heap32[(r14+2)] = r18;
	heap32[(r14+3)] = r19;
	heap32[(r14+4)] = r20;
	heap32[(r14+5)] = r21;
	heap32[(r14+6)] = r22;
	heap32[(r14+7)] = r23;
	heap32[(r14+8)] = r15;
__label__ = 68;
break _47;
}
}
	f15 = f14*f16;
	f16 = f13*f18;
	f15 = f15+f16;
if(!(f11 >f23)) //_LBB8_66
{
if(!(f15 >f23)) //_LBB8_66
{
	heap32[(r14+24)] = 1065353216;
	r15 = r9 >> 2;
	heap32[(r14+27)] = 1;
	r13 = 1;
	r16 = heap32[(r15)];
	r17 = heap32[(r15+1)];
	r18 = heap32[(r15+2)];
	r19 = heap32[(r15+3)];
	r20 = heap32[(r15+4)];
	r21 = heap32[(r15+5)];
	r22 = heap32[(r15+6)];
	r23 = heap32[(r15+7)];
	r15 = heap32[(r15+8)];
	heap32[(fp+-28)] = r16;
	heap32[(r14+1)] = r17;
	heap32[(r14+2)] = r18;
	heap32[(r14+3)] = r19;
	heap32[(r14+4)] = r20;
	heap32[(r14+5)] = r21;
	heap32[(r14+6)] = r22;
	heap32[(r14+7)] = r23;
	heap32[(r14+8)] = r15;
__label__ = 68;
break _47;
}
}
	f10 = f10*f13;
	f11 = f12*f14;
	f10 = f10-f11;
	f10 = f10*f26;
	if(f20 <=f23) //_LBB8_70
{
__label__ = 66;
break _39;
}
else{
	if(f15 <=f23) //_LBB8_70
{
__label__ = 66;
break _39;
}
else{
	if(f10 >f23) //_LBB8_70
{
__label__ = 66;
break _39;
}
else{
	f9 =                         1;
	f10 = f15-f19;
	f9 = f9/f10;
	f10 = f15*f9;
	f9 = f9*f20;
	heapFloat[(r14+15)] = f10;
	heapFloat[(r14+24)] = f9;
	r13 = r9 >> 2;
	heap32[(r14+27)] = 2;
	r15 = heap32[(r13)];
	r16 = heap32[(r13+1)];
	r17 = heap32[(r13+2)];
	r18 = heap32[(r13+3)];
	r19 = heap32[(r13+4)];
	r20 = heap32[(r13+5)];
	r21 = heap32[(r13+6)];
	r22 = heap32[(r13+7)];
	r13 = heap32[(r13+8)];
	heap32[(fp+-28)] = r15;
	heap32[(r14+1)] = r16;
	heap32[(r14+2)] = r17;
	heap32[(r14+3)] = r18;
	heap32[(r14+4)] = r19;
	heap32[(r14+5)] = r20;
	heap32[(r14+6)] = r21;
	heap32[(r14+7)] = r22;
	heap32[(r14+8)] = r13;
}
}
}
break;
}
	f12 = heapFloat[(r14+14)];
	f11 = heapFloat[(r14+5)];
	f10 = heapFloat[(r14+13)];
	f9 = heapFloat[(r14+4)];
__label__ = 69;
break _47;
}
else{
	if(r0 ==2) //_LBB8_43
{
	r13 = sp + -112; 
	r14 = r13 >> 2;
	f9 = heapFloat[(r14+4)];
	f10 = heapFloat[(r14+13)];
	f11 = heapFloat[(r14+5)];
	f12 = heapFloat[(r14+14)];
	f13 = f10-f9;
	f14 = f12-f11;
	f15 = f9*f13;
	f16 = f11*f14;
	f15 = f15+f16;
	f16 = -f15;
	f17 =                         0;
	if(f16 >f17) //_LBB8_45
{
	f13 = f10*f13;
	f14 = f12*f14;
	f13 = f13+f14;
	if(f13 >f17) //_LBB8_47
{
	f14 =                         1;
	f15 = f13-f15;
	f14 = f14/f15;
	f13 = f13*f14;
	f14 = f14*f16;
	heapFloat[(r14+6)] = f13;
	heapFloat[(r14+15)] = f14;
	heap32[(r14+27)] = 2;
__label__ = 69;
}
else{
	heap32[(r14+15)] = 1065353216;
	r15 = r8 >> 2;
	heap32[(r14+27)] = 1;
	r13 = 1;
	r16 = heap32[(r15)];
	r17 = heap32[(r15+1)];
	r18 = heap32[(r15+2)];
	r19 = heap32[(r15+3)];
	r20 = heap32[(r15+4)];
	r21 = heap32[(r15+5)];
	r22 = heap32[(r15+6)];
	r23 = heap32[(r15+7)];
	r15 = heap32[(r15+8)];
	heap32[(fp+-28)] = r16;
	heap32[(r14+1)] = r17;
	heap32[(r14+2)] = r18;
	heap32[(r14+3)] = r19;
	heap32[(r14+4)] = r20;
	heap32[(r14+5)] = r21;
	heap32[(r14+6)] = r22;
	heap32[(r14+7)] = r23;
	heap32[(r14+8)] = r15;
__label__ = 68;
}
}
else{
	r13 = 1;
	heap32[(r14+6)] = 1065353216;
	heap32[(r14+27)] = 1;
__label__ = 68;
}
}
else{
	if(r0 !=1) //_LBB8_48
{
__label__ = 44;
break _39;
}
else{
	r13 = r0;
__label__ = 68;
}
}
}
} while(0);
switch(__label__ ){//multiple entries
case 69: 
	f13 = f12-f11;
	f12 = f10-f9;
	f9 = f13*f9;
	f10 = f12*f11;
	f9 = f9-f10;
	f10 =                         0;
	if(f9 <=f10) //_LBB8_75
{
	f12 = -f12;
	r13 = 2;
	r14 = r13;
}
else{
	f13 = -f13;
	r13 = 2;
	r14 = r13;
}
break;
case 68: 
	r14 = sp + -112; 
	r14 = r14 >> 2;
	f9 = heapFloat[(r14+5)];
	f10 = heapFloat[(r14+4)];
	f12 = -f9;
	f13 = -f10;
	r14 = 1;
break;
}
	f9 = f13*f13;
	f10 = f12*f12;
	f9 = f9+f10;
	f10 =   1.4210854715202004e-014;
	if(f9 >=f10) //_LBB8_78
{
	r13 = heap32[(r3+5)];
	r15 = heap32[(r3+4)];
	if(r13 >1) //_LBB8_80
{
	f9 = -f13;
	f10 = f13*f2;
	f11 = f3*f12;
	f9 = f3*f9;
	f14 = f2*f12;
	f10 = f10-f11;
	f9 = f9-f14;
	r17 = r15 >> 2;
	f11 = heapFloat[(r17)];
	f14 = heapFloat[(r17+1)];
	f11 = f11*f9;
	f14 = f14*f10;
	r17 = 2;
	f11 = f11+f14;
	r16 = r13 > 2 ? r13 : r17; 
	r18 = 1;
	r17 = 0;
_97: while(true){
	r19 = r18 << 3;
	r19 = (r15 + r19)&-1;
	r19 = r19 >> 2;
	f14 = heapFloat[(r19)];
	f15 = heapFloat[(r19+1)];
	f14 = f14*f9;
	f15 = f15*f10;
	f14 = f14+f15;
	r19 = (r18 + 1)&-1;
	r17 = f14 > f11 ? r18 : r17; 
	f11 = f14 > f11 ? f14 : f11; 
	r18 = r19;
if(!(r16 !=r19)) //_LBB8_81
{
break _97;
}
}
	r16 = (r14 * 36)&-1;
	r16 = (r6 + r16)&-1;
	r16 = r16 >> 2;
	heap32[(r16+7)] = r17;
	if(r17 <0) //_LBB8_84
{
__label__ = 79;
break _39;
}
}
else{
	r16 = (r14 * 36)&-1;
	r16 = (r6 + r16)&-1;
	r17 = 0;
	r16 = r16 >> 2;
	heap32[(r16+7)] = 0;
}
	if(r13 >r17) //_LBB8_85
{
	r13 = r17 << 3;
	r13 = (r15 + r13)&-1;
	r13 = r13 >> 2;
	f9 = heapFloat[(r13)];
	f10 = heapFloat[(r13+1)];
	r13 = (r14 * 36)&-1;
	f11 = f3*f9;
	f14 = f2*f10;
	r13 = (r6 + r13)&-1;
	f9 = f2*f9;
	f10 = f3*f10;
	f11 = f11-f14;
	f11 = f11+f0;
	r13 = r13 >> 2;
	f9 = f9+f10;
	f9 = f9+f1;
	heapFloat[(r13)] = f11;
	heapFloat[(r13+1)] = f9;
	r14 = heap32[(r3+12)];
	r15 = heap32[(r3+11)];
	if(r14 >1) //_LBB8_87
{
	f10 = f13*f8;
	f14 = f7*f12;
	f13 = f7*f13;
	f12 = f6*f12;
	f10 = f10+f14;
	f12 = f13+f12;
	r16 = r15 >> 2;
	f13 = heapFloat[(r16)];
	f14 = heapFloat[(r16+1)];
	f13 = f13*f12;
	f14 = f14*f10;
	r16 = 2;
	f13 = f13+f14;
	r18 = r14 > 2 ? r14 : r16; 
	r19 = 1;
	r16 = 0;
_105: while(true){
	r20 = r19 << 3;
	r20 = (r15 + r20)&-1;
	r20 = r20 >> 2;
	f14 = heapFloat[(r20)];
	f15 = heapFloat[(r20+1)];
	f14 = f14*f12;
	f15 = f15*f10;
	f14 = f14+f15;
	r20 = (r19 + 1)&-1;
	r16 = f14 > f13 ? r19 : r16; 
	f13 = f14 > f13 ? f14 : f13; 
	r19 = r20;
if(!(r18 !=r20)) //_LBB8_88
{
break _105;
}
}
	heap32[(r13+8)] = r16;
	if(r16 <0) //_LBB8_91
{
__label__ = 86;
break _39;
}
}
else{
	r16 = 0;
	heap32[(r13+8)] = 0;
}
	if(r14 >r16) //_LBB8_92
{
	r14 = r16 << 3;
	r14 = (r15 + r14)&-1;
	r14 = r14 >> 2;
	f10 = heapFloat[(r14)];
	f12 = heapFloat[(r14+1)];
	f13 = f7*f10;
	f14 = f6*f12;
	f10 = f6*f10;
	f12 = f7*f12;
	f13 = f13-f14;
	f10 = f10+f12;
	f12 = f13+f4;
	f10 = f10+f5;
	heapFloat[(r13+2)] = f12;
	f11 = f12-f11;
	heapFloat[(r13+3)] = f10;
	r14 = 0;
	f9 = f10-f9;
	heapFloat[(r13+4)] = f11;
	heapFloat[(r13+5)] = f9;
_111: while(true){
	if(r14 <r0) //_LBB8_93
{
	r13 = sp + -124; 
	r15 = r14 << 2;
	r13 = (r13 + r15)&-1;
	r13 = r13 >> 2;
	r13 = heap32[(r13)];
if(!(r17 !=r13)) //_LBB8_95
{
	r13 = sp + -136; 
	r13 = (r13 + r15)&-1;
	r13 = r13 >> 2;
	r13 = heap32[(r13)];
	if(r16 ==r13) //_LBB8_100
{
__label__ = 95;
break _39;
}
}
	r14 = (r14 + 1)&-1;
}
else{
break _111;
}
}
	r0 = sp + -112; 
	r11 = r0 >> 2;
	r0 = heap32[(r11+27)];
	r0 = (r0 + 1)&-1;
	heap32[(r11+27)] = r0;
	r11 = r12;
}
else{
__label__ = 86;
break _39;
}
}
else{
__label__ = 79;
break _39;
}
}
else{
__label__ = 96;
break _39;
}
}
else{
__label__ = 94;
break _39;
}
}
_118: do {
switch(__label__ ){//multiple entries
case 66: 
	f0 = f10+f9;
	f1 =                         1;
	f0 = f0+f17;
	f0 = f1/f0;
	r0 = (r10 + r11)&-1;
	f1 = f10*f0;
	heap32[(r7)] = r0;
	f2 = f9*f0;
	heapFloat[(r14+6)] = f1;
	f0 = f17*f0;
	heapFloat[(r14+15)] = f2;
	r0 = b2_gjkMaxIters;
	heapFloat[(r14+24)] = f0;
	r0 = r0 >> 2;
	heap32[(r14+27)] = 3;
	r5 = heap32[(r0)];
	r5 = r5 > r11 ? r5 : r11; 
	heap32[(r0)] = r5;
__label__ = 105;
break _118;
break;
case 79: 
	r0 = (r10 + r11)&-1;
	heap32[(r7)] = r0;
break _8;
break;
case 86: 
	r13 = (r10 + r11)&-1;
	heap32[(r7)] = r13;
	r13 = _2E_str29;
	r0 = _2E_str3;
	heap32[(g0)] = r13;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 103;
	_assert(i7);
break;
case 95: 
	r10 = (r10 + r11)&-1;
	r13 = sp + -112; 
	r10 = (r10 + 1)&-1;
	r13 = r13 >> 2;
	heap32[(r7)] = r10;
	r13 = heap32[(r13+27)];
	r11 = (r11 + 1)&-1;
__label__ = 97;
break _118;
break;
case 94: 
	r13 = r0;
__label__ = 96;
break _118;
break;
case 44: 
	r0 = (r10 + r11)&-1;
	heap32[(r7)] = r0;
	r0 = _2E_str7;
	r1 = _2E_str18;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 498;
	_assert(i7);
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 96: 
	r0 = (r10 + r11)&-1;
	heap32[(r7)] = r0;
__label__ = 97;
break;
}
_127: do {
switch(__label__ ){//multiple entries
case 97: 
	r0 = b2_gjkMaxIters;
	r0 = r0 >> 2;
	r5 = heap32[(r0)];
	r5 = r5 > r11 ? r5 : r11; 
	heap32[(r0)] = r5;
	if(r13 >1) //_LBB8_105
{
	if(r13 ==2) //_LBB8_110
{
	r0 = sp + -112; 
	r0 = r0 >> 2;
	f2 = heapFloat[(r0+15)];
	f0 = heapFloat[(r0+9)];
	f4 = heapFloat[(r0+6)];
	f1 = heapFloat[(fp+-28)];
	f3 = heapFloat[(r0+10)];
	f5 = heapFloat[(r0+1)];
	f1 = f1*f4;
	f0 = f0*f2;
	f1 = f1+f0;
	r5 = r4 >> 2;
	f0 = f5*f4;
	f3 = f3*f2;
	f0 = f0+f3;
	heapFloat[(r5)] = f1;
	heapFloat[(r5+1)] = f0;
	f3 = heapFloat[(r0+11)];
	f5 = heapFloat[(r0+2)];
	f6 = heapFloat[(r0+12)];
	f7 = heapFloat[(r0+3)];
	f5 = f5*f4;
	f3 = f3*f2;
	f3 = f5+f3;
	f4 = f7*f4;
	f2 = f6*f2;
	f2 = f4+f2;
	heapFloat[(r5+2)] = f3;
	heapFloat[(r5+3)] = f2;
__label__ = 107;
break _127;
}
else{
if(!(r13 !=3)) //_LBB8_112
{
__label__ = 105;
break _127;
}
}
}
else{
	if(r13 ==0) //_LBB8_108
{
	r1 = _2E_str7;
	r2 = _2E_str18;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = 217;
	_assert(i7);
}
else{
	if(r13 ==1) //_LBB8_109
{
	r0 = sp + -112; 
	r0 = r0 >> 2;
	f0 = heapFloat[(r0+1)];
	f1 = heapFloat[(fp+-28)];
	r5 = r4 >> 2;
	heapFloat[(r5)] = f1;
	heapFloat[(r5+1)] = f0;
	f2 = heapFloat[(r0+3)];
	f3 = heapFloat[(r0+2)];
	heapFloat[(r5+2)] = f3;
	heapFloat[(r5+3)] = f2;
__label__ = 107;
break _127;
}
}
}
	r1 = _2E_str7;
	r2 = _2E_str18;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = 236;
	_assert(i7);
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 105: 
	r0 = sp + -112; 
	r0 = r0 >> 2;
	f0 = heapFloat[(r0+15)];
	f1 = heapFloat[(r0+9)];
	f2 = heapFloat[(r0+6)];
	f3 = heapFloat[(fp+-28)];
	f4 = heapFloat[(r0+10)];
	f5 = heapFloat[(r0+1)];
	f3 = f3*f2;
	f1 = f1*f0;
	f6 = heapFloat[(r0+24)];
	f7 = heapFloat[(r0+18)];
	f8 = heapFloat[(r0+19)];
	f2 = f5*f2;
	f0 = f4*f0;
	f1 = f3+f1;
	f3 = f7*f6;
	f3 = f1+f3;
	r0 = r4 >> 2;
	f0 = f2+f0;
	f1 = f8*f6;
	f2 = f0+f1;
	heapFloat[(r0)] = f3;
	heapFloat[(r0+1)] = f2;
	heapFloat[(r0+2)] = f3;
	heapFloat[(r0+3)] = f2;
	f1 = f3;
	f0 = f2;
break;
}
	f1 = f1-f3;
	f0 = f0-f2;
	f1 = f1*f1;
	f0 = f0*f0;
	f0 = f1+f0;
	heapFloat[(g0)] = f0;
	r0 = r4 >> 2;
	sqrtf(i7);
	r4 = sp + -112; 
	heapFloat[(r0+4)] = f_g0;
	r5 = r4 >> 2;
	heap32[(r0+5)] = r11;
	r6 = heap32[(r5+27)];
	if(r6 >1) //_LBB8_116
{
	if(r6 ==2) //_LBB8_123
{
	f0 = heapFloat[(r5+5)];
	f1 = heapFloat[(r5+14)];
	f2 = heapFloat[(r5+4)];
	f3 = heapFloat[(r5+13)];
	f2 = f2-f3;
	f0 = f0-f1;
	f1 = f2*f2;
	f0 = f0*f0;
	f0 = f1+f0;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	r6 = heap32[(r5+27)];
	r5 = r2 >> 2;
	heapFloat[(r5)] = f_g0;
	heap16[(r2+4)>>1] = r6;
	if(r6 <1) //_LBB8_126
{
__label__ = 118;
}
else{
__label__ = 116;
}
}
else{
	if(r6 ==3) //_LBB8_120
{
	f0 = heapFloat[(r5+13)];
	f1 = heapFloat[(r5+4)];
	f2 = heapFloat[(r5+22)];
	f3 = heapFloat[(r5+23)];
	f4 = heapFloat[(r5+5)];
	f5 = heapFloat[(r5+14)];
	f0 = f0-f1;
	f3 = f3-f4;
	f4 = f5-f4;
	f1 = f2-f1;
	f0 = f0*f3;
	f1 = f4*f1;
	f0 = f0-f1;
__label__ = 114;
}
else{
__label__ = 18;
break _37;
}
}
}
else{
	if(r6 ==0) //_LBB8_119
{
__label__ = 15;
break _37;
}
else{
	if(r6 ==1) //_LBB8_118
{
	f0 =                         0;
__label__ = 114;
}
else{
__label__ = 18;
break _37;
}
}
}
switch(__label__ ){//multiple entries
case 114: 
	r5 = r2 >> 2;
	heapFloat[(r5)] = f0;
	heap16[(r2+4)>>1] = r6;
__label__ = 116;
break;
}
_154: do {
switch(__label__ ){//multiple entries
case 116: 
	r5 = 0;
_156: while(true){
	r7 = (r5 * 9)&-1;
	r7 = r7 << 2;
	r7 = (r4 + r7)&-1;
	r7 = r7 >> 2;
	r8 = (r2 + r5)&-1;
	r9 = heap32[(r7+7)];
	heap8[r8+6] = r9;
	r7 = heap32[(r7+8)];
	r5 = (r5 + 1)&-1;
	heap8[r8+9] = r7;
if(!(r5 <r6)) //_LBB8_125
{
break _154;
}
}
break;
}
} while(0);
	r1 = heapU8[r1+88];
if(!(r1 ==0)) //_LBB8_134
{
	f0 = heapFloat[(r3+6)];
	f1 = heapFloat[(r3+13)];
	f2 = heapFloat[(r0+4)];
	f3 = f0+f1;
if(!(f2 <=f3)) //_LBB8_133
{
	f4 =   1.1920928955078125e-007;
if(!(f2 <=f4)) //_LBB8_133
{
	f2 = f2-f3;
	heapFloat[(r0+4)] = f2;
	f2 = heapFloat[(r0+3)];
	f3 = heapFloat[(r0+1)];
	f5 = heapFloat[(r0+2)];
	f6 = heapFloat[(r0)];
	f2 = f2-f3;
	f3 = f5-f6;
	f5 = f3*f3;
	f6 = f2*f2;
	f5 = f5+f6;
	heapFloat[(g0)] = f5;
	sqrtf(i7);
	f5 = f_g0;
	if(f5 >=f4) //_LBB8_131
{
	f4 =                         1;
	f4 = f4/f5;
	f3 = f3*f4;
	f2 = f2*f4;
}
	f4 = f3*f0;
	f5 = heapFloat[(r0)];
	f4 = f5+f4;
	heapFloat[(r0)] = f4;
	f0 = f2*f0;
	f4 = heapFloat[(r0+1)];
	f0 = f4+f0;
	heapFloat[(r0+1)] = f0;
	f0 = f3*f1;
	f3 = heapFloat[(r0+2)];
	f0 = f3-f0;
	heapFloat[(r0+2)] = f0;
	f0 = f2*f1;
	f1 = heapFloat[(r0+3)];
	f0 = f1-f0;
	heapFloat[(r0+3)] = f0;
	return;
}
}
	f0 = heapFloat[(r0)];
	f1 = heapFloat[(r0+2)];
	f0 = f0+f1;
	f1 =                       0.5;
	f2 = heapFloat[(r0+1)];
	f3 = heapFloat[(r0+3)];
	f2 = f2+f3;
	f0 = f0*f1;
	f1 = f2*f1;
	heapFloat[(r0)] = f0;
	heapFloat[(r0+1)] = f1;
	heapFloat[(r0+2)] = f0;
	heapFloat[(r0+3)] = f1;
	heap32[(r0+4)] = 0;
}
	return;
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 18: 
	r0 = _2E_str7;
	r1 = _2E_str18;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 259;
	_assert(i7);
break;
case 15: 
	r0 = _2E_str7;
	r1 = _2E_str18;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 246;
	_assert(i7);
break;
}
break;
}
} while(0);
	r0 = _2E_str29;
	r1 = _2E_str3;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 103;
	_assert(i7);
}
else{
	r0 = _2E_str5;
	r2 = _2E_str18;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = 102;
	_assert(i7);
}
}

function _ZN13b2DynamicTree7BalanceEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	if(r0 !=-1) //_LBB9_2
{
	r1 = heap32[(fp)];
	r1 = r1 >> 2;
	r2 = heap32[(r1+1)];
	r3 = (r0 * 36)&-1;
	r3 = (r2 + r3)&-1;
	r3 = r3 >> 2;
	r4 = heap32[(r3+6)];
_3: do {
if(!(r4 ==-1)) //_LBB9_45
{
	r5 = heap32[(r3+8)];
if(!(r5 <2)) //_LBB9_45
{
if(!(r4 <0)) //_LBB9_6
{
	r5 = heap32[(r1+3)];
	if(r5 >r4) //_LBB9_7
{
	r6 = heap32[(r3+7)];
if(!(r6 <0)) //_LBB9_9
{
	if(r5 >r6) //_LBB9_10
{
	r7 = (r6 * 36)&-1;
	r8 = (r4 * 36)&-1;
	r7 = (r2 + r7)&-1;
	r8 = (r2 + r8)&-1;
	r7 = r7 >> 2;
	r8 = r8 >> 2;
	r9 = heap32[(r7+8)];
	r10 = heap32[(r8+8)];
	r9 = (r9 - r10)&-1;
	if(r9 <2) //_LBB9_27
{
	if(r9 >-2) //_LBB9_45
{
break _3;
}
else{
	r6 = heap32[(r8+6)];
if(!(r6 <0)) //_LBB9_30
{
	if(r5 >r6) //_LBB9_31
{
	r9 = heap32[(r8+7)];
if(!(r9 <0)) //_LBB9_33
{
	if(r5 >r9) //_LBB9_34
{
	heap32[(r8+6)] = r0;
	r5 = heap32[(r3+5)];
	heap32[(r8+5)] = r5;
	heap32[(r3+5)] = r4;
	r5 = heap32[(r8+5)];
	if(r5 ==-1) //_LBB9_40
{
	heap32[(r1)] = r4;
}
else{
	r1 = heap32[(r1+1)];
	r5 = (r5 * 36)&-1;
	r1 = (r1 + r5)&-1;
	r1 = r1 >> 2;
	r5 = heap32[(r1+6)];
	if(r5 !=r0) //_LBB9_37
{
	r5 = heap32[(r1+7)];
	if(r5 ==r0) //_LBB9_39
{
	heap32[(r1+7)] = r4;
}
else{
	r1 = _2E_str25;
	r0 = _2E_str115;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 484;
	_assert(i7);
}
}
else{
	heap32[(r1+6)] = r4;
}
}
	r1 = (r6 * 36)&-1;
	r5 = (r9 * 36)&-1;
	r1 = (r2 + r1)&-1;
	r2 = (r2 + r5)&-1;
	r1 = r1 >> 2;
	r2 = r2 >> 2;
	r5 = heap32[(r1+8)];
	r10 = heap32[(r2+8)];
	if(r5 <=r10) //_LBB9_44
{
	heap32[(r8+7)] = r9;
	heap32[(r3+6)] = r6;
	heap32[(r1+5)] = r0;
	f0 = heapFloat[(r1+1)];
	f1 = heapFloat[(r7+1)];
	f2 = heapFloat[(r1)];
	f3 = heapFloat[(r7)];
	f2 = f3 < f2 ? f3 : f2; 
	f0 = f1 < f0 ? f1 : f0; 
	heapFloat[(r3)] = f2;
	heapFloat[(r3+1)] = f0;
	f1 = heapFloat[(r1+3)];
	f3 = heapFloat[(r7+3)];
	f4 = heapFloat[(r1+2)];
	f5 = heapFloat[(r7+2)];
	f4 = f5 > f4 ? f5 : f4; 
	f1 = f3 > f1 ? f3 : f1; 
	heapFloat[(r3+2)] = f4;
	heapFloat[(r3+3)] = f1;
	f3 = heapFloat[(r2+1)];
	f5 = heapFloat[(r2)];
	f2 = f2 < f5 ? f2 : f5; 
	f0 = f0 < f3 ? f0 : f3; 
	heapFloat[(r8)] = f2;
	heapFloat[(r8+1)] = f0;
	f0 = heapFloat[(r2+3)];
	f2 = heapFloat[(r2+2)];
	f2 = f4 > f2 ? f4 : f2; 
	f0 = f1 > f0 ? f1 : f0; 
	heapFloat[(r8+2)] = f2;
	heapFloat[(r8+3)] = f0;
	r0 = heap32[(r7+8)];
	r0 = r0 > r5 ? r0 : r5; 
	r0 = (r0 + 1)&-1;
	heap32[(r3+8)] = r0;
	r1 = heap32[(r2+8)];
}
else{
	heap32[(r8+7)] = r6;
	heap32[(r3+6)] = r9;
	heap32[(r2+5)] = r0;
	f0 = heapFloat[(r2+1)];
	f1 = heapFloat[(r7+1)];
	f2 = heapFloat[(r2)];
	f3 = heapFloat[(r7)];
	f2 = f3 < f2 ? f3 : f2; 
	f0 = f1 < f0 ? f1 : f0; 
	heapFloat[(r3)] = f2;
	heapFloat[(r3+1)] = f0;
	f1 = heapFloat[(r2+3)];
	f3 = heapFloat[(r7+3)];
	f4 = heapFloat[(r2+2)];
	f5 = heapFloat[(r7+2)];
	f4 = f5 > f4 ? f5 : f4; 
	f1 = f3 > f1 ? f3 : f1; 
	heapFloat[(r3+2)] = f4;
	heapFloat[(r3+3)] = f1;
	f3 = heapFloat[(r1+1)];
	f5 = heapFloat[(r1)];
	f2 = f2 < f5 ? f2 : f5; 
	f0 = f0 < f3 ? f0 : f3; 
	heapFloat[(r8)] = f2;
	heapFloat[(r8+1)] = f0;
	f0 = heapFloat[(r1+3)];
	f2 = heapFloat[(r1+2)];
	f2 = f4 > f2 ? f4 : f2; 
	f0 = f1 > f0 ? f1 : f0; 
	heapFloat[(r8+2)] = f2;
	heapFloat[(r8+3)] = f0;
	r0 = heap32[(r7+8)];
	r0 = r0 > r10 ? r0 : r10; 
	r0 = (r0 + 1)&-1;
	heap32[(r3+8)] = r0;
	r1 = heap32[(r1+8)];
}
	r0 = r0 > r1 ? r0 : r1; 
	r0 = (r0 + 1)&-1;
	heap32[(r8+8)] = r0;
	r_g0 = r4;
	return;
}
}
	r0 = _2E_str24;
	r1 = _2E_str115;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 468;
	_assert(i7);
}
}
	r0 = _2E_str23;
	r1 = _2E_str115;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 467;
	_assert(i7);
}
}
else{
	r4 = heap32[(r7+6)];
if(!(r4 <0)) //_LBB9_13
{
	if(r5 >r4) //_LBB9_14
{
	r9 = heap32[(r7+7)];
if(!(r9 <0)) //_LBB9_16
{
	if(r5 >r9) //_LBB9_17
{
	heap32[(r7+6)] = r0;
	r5 = heap32[(r3+5)];
	heap32[(r7+5)] = r5;
	heap32[(r3+5)] = r6;
	r5 = heap32[(r7+5)];
	if(r5 ==-1) //_LBB9_23
{
	heap32[(r1)] = r6;
}
else{
	r1 = heap32[(r1+1)];
	r5 = (r5 * 36)&-1;
	r1 = (r1 + r5)&-1;
	r1 = r1 >> 2;
	r5 = heap32[(r1+6)];
	if(r5 !=r0) //_LBB9_20
{
	r5 = heap32[(r1+7)];
	if(r5 ==r0) //_LBB9_22
{
	heap32[(r1+7)] = r6;
}
else{
	r1 = _2E_str22;
	r4 = _2E_str115;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = 424;
	_assert(i7);
}
}
else{
	heap32[(r1+6)] = r6;
}
}
	r1 = (r4 * 36)&-1;
	r5 = (r9 * 36)&-1;
	r1 = (r2 + r1)&-1;
	r2 = (r2 + r5)&-1;
	r1 = r1 >> 2;
	r2 = r2 >> 2;
	r5 = heap32[(r1+8)];
	r10 = heap32[(r2+8)];
	if(r5 <=r10) //_LBB9_26
{
	heap32[(r7+7)] = r9;
	heap32[(r3+7)] = r4;
	heap32[(r1+5)] = r0;
	f0 = heapFloat[(r1+1)];
	f1 = heapFloat[(r8+1)];
	f2 = heapFloat[(r1)];
	f3 = heapFloat[(r8)];
	f2 = f3 < f2 ? f3 : f2; 
	f0 = f1 < f0 ? f1 : f0; 
	heapFloat[(r3)] = f2;
	heapFloat[(r3+1)] = f0;
	f1 = heapFloat[(r1+3)];
	f3 = heapFloat[(r8+3)];
	f4 = heapFloat[(r1+2)];
	f5 = heapFloat[(r8+2)];
	f4 = f5 > f4 ? f5 : f4; 
	f1 = f3 > f1 ? f3 : f1; 
	heapFloat[(r3+2)] = f4;
	heapFloat[(r3+3)] = f1;
	f3 = heapFloat[(r2+1)];
	f5 = heapFloat[(r2)];
	f2 = f2 < f5 ? f2 : f5; 
	f0 = f0 < f3 ? f0 : f3; 
	heapFloat[(r7)] = f2;
	heapFloat[(r7+1)] = f0;
	f0 = heapFloat[(r2+3)];
	f2 = heapFloat[(r2+2)];
	f2 = f4 > f2 ? f4 : f2; 
	f0 = f1 > f0 ? f1 : f0; 
	heapFloat[(r7+2)] = f2;
	heapFloat[(r7+3)] = f0;
	r0 = heap32[(r8+8)];
	r0 = r0 > r5 ? r0 : r5; 
	r0 = (r0 + 1)&-1;
	heap32[(r3+8)] = r0;
	r1 = heap32[(r2+8)];
	r0 = r0 > r1 ? r0 : r1; 
	r0 = (r0 + 1)&-1;
	heap32[(r7+8)] = r0;
	r_g0 = r6;
	return;
}
else{
	heap32[(r7+7)] = r4;
	heap32[(r3+7)] = r9;
	heap32[(r2+5)] = r0;
	f0 = heapFloat[(r2+1)];
	f1 = heapFloat[(r8+1)];
	f2 = heapFloat[(r2)];
	f3 = heapFloat[(r8)];
	f2 = f3 < f2 ? f3 : f2; 
	f0 = f1 < f0 ? f1 : f0; 
	heapFloat[(r3)] = f2;
	heapFloat[(r3+1)] = f0;
	f1 = heapFloat[(r2+3)];
	f3 = heapFloat[(r8+3)];
	f4 = heapFloat[(r2+2)];
	f5 = heapFloat[(r8+2)];
	f4 = f5 > f4 ? f5 : f4; 
	f1 = f3 > f1 ? f3 : f1; 
	heapFloat[(r3+2)] = f4;
	heapFloat[(r3+3)] = f1;
	f3 = heapFloat[(r1+1)];
	f5 = heapFloat[(r1)];
	f2 = f2 < f5 ? f2 : f5; 
	f0 = f0 < f3 ? f0 : f3; 
	heapFloat[(r7)] = f2;
	heapFloat[(r7+1)] = f0;
	f0 = heapFloat[(r1+3)];
	f2 = heapFloat[(r1+2)];
	f2 = f4 > f2 ? f4 : f2; 
	f0 = f1 > f0 ? f1 : f0; 
	heapFloat[(r7+2)] = f2;
	heapFloat[(r7+3)] = f0;
	r2 = heap32[(r8+8)];
	r2 = r2 > r10 ? r2 : r10; 
	r2 = (r2 + 1)&-1;
	heap32[(r3+8)] = r2;
	r1 = heap32[(r1+8)];
	r1 = r2 > r1 ? r2 : r1; 
	r1 = (r1 + 1)&-1;
	heap32[(r7+8)] = r1;
	r_g0 = r6;
	return;
}
}
}
	r4 = _2E_str21;
	r9 = _2E_str115;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r9;
	heap32[(g0+2)] = 408;
	_assert(i7);
}
}
	r4 = _2E_str20;
	r0 = _2E_str115;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 407;
	_assert(i7);
}
}
}
	r0 = _2E_str19;
	r1 = _2E_str115;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 393;
	_assert(i7);
}
}
	r0 = _2E_str1823;
	r1 = _2E_str115;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 392;
	_assert(i7);
}
}
} while(0);
	r_g0 = r0;
	return;
}
else{
	r0 = _2E_str17;
	r1 = _2E_str115;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 382;
	_assert(i7);
}
}

function _ZN13b2DynamicTree12AllocateNodeEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+4)];
	if(r1 ==-1) //_LBB10_2
{
	r1 = heap32[(r0+2)];
	r2 = heap32[(r0+3)];
	if(r1 ==r2) //_LBB10_4
{
	r3 = heap32[(r0+1)];
	r4 = r2 << 1;
	heap32[(r0+3)] = r4;
	r2 = (r2 * 72)&-1;
	heap32[(g0)] = r2;
	malloc(i7);
	heap32[(r0+1)] = r_g0;
	r1 = (r1 * 36)&-1;
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r1;
	memcpy(i7);
	heap32[(g0)] = r3;
	free(i7);
	r1 = heap32[(r0+3)];
	r2 = heap32[(r0+2)];
	r3 = heap32[(r0+1)];
	r4 = (r1 + -1)&-1;
	if(r4 >r2) //_LBB10_6
{
_6: while(true){
	r1 = (r2 * 9)&-1;
	r1 = r1 << 2;
	r3 = (r3 + r1)&-1;
	r2 = (r2 + 1)&-1;
	r3 = r3 >> 2;
	heap32[(r3+5)] = r2;
	r3 = heap32[(r0+1)];
	r1 = (r3 + r1)&-1;
	r1 = r1 >> 2;
	heap32[(r1+8)] = -1;
	r1 = heap32[(r0+3)];
	r3 = heap32[(r0+1)];
	r4 = (r1 + -1)&-1;
if(!(r4 >r2)) //_LBB10_6
{
break _6;
}
}
}
	r1 = (r1 * 36)&-1;
	r1 = (r1 + r3)&-1;
	r1 = r1 >> 2;
	heap32[(r1+-4)] = -1;
	r1 = heap32[(r0+3)];
	r2 = heap32[(r0+1)];
	r1 = (r1 * 36)&-1;
	r1 = (r1 + r2)&-1;
	r1 = r1 >> 2;
	heap32[(r1+-1)] = -1;
	r1 = heap32[(r0+2)];
	heap32[(r0+4)] = r1;
}
else{
	r1 = _2E_str2924;
	r0 = _2E_str115;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 61;
	_assert(i7);
}
}
	r2 = (r1 * 36)&-1;
	r3 = heap32[(r0+1)];
	r3 = (r3 + r2)&-1;
	r3 = r3 >> 2;
	r4 = heap32[(r3+5)];
	heap32[(r0+4)] = r4;
	heap32[(r3+5)] = -1;
	r3 = heap32[(r0+1)];
	r3 = (r3 + r2)&-1;
	r3 = r3 >> 2;
	heap32[(r3+6)] = -1;
	r3 = heap32[(r0+1)];
	r3 = (r3 + r2)&-1;
	r3 = r3 >> 2;
	heap32[(r3+7)] = -1;
	r3 = heap32[(r0+1)];
	r3 = (r3 + r2)&-1;
	r3 = r3 >> 2;
	heap32[(r3+8)] = 0;
	r3 = heap32[(r0+1)];
	r2 = (r3 + r2)&-1;
	r2 = r2 >> 2;
	heap32[(r2+4)] = 0;
	r2 = heap32[(r0+2)];
	r2 = (r2 + 1)&-1;
	heap32[(r0+2)] = r2;
	r_g0 = r1;
	return;
}

function _ZN13b2DynamicTree10InsertLeafEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r2 = heap32[(r1+6)];
	r2 = (r2 + 1)&-1;
	heap32[(r1+6)] = r2;
	r2 = heap32[(r1)];
	r3 = heap32[(fp+1)];
	if(r2 !=-1) //_LBB11_2
{
	r4 = heap32[(r1+1)];
	r5 = (r3 * 36)&-1;
	r6 = (r4 + r5)&-1;
	r6 = r6 >> 2;
	f0 = heapFloat[(r6)];
	f1 = heapFloat[(r6+1)];
	f2 = heapFloat[(r6+2)];
	f3 = heapFloat[(r6+3)];
_3: while(true){
	r7 = (r2 * 36)&-1;
	r6 = (r4 + r7)&-1;
	r8 = r6 >> 2;
	r6 = heap32[(r8+6)];
	if(r6 !=-1) //_LBB11_3
{
	f4 = heapFloat[(r8+2)];
	f5 = heapFloat[(r8)];
	f6 = heapFloat[(r8+3)];
	f7 = heapFloat[(r8+1)];
	f8 = f4 > f2 ? f4 : f2; 
	f9 = f5 < f0 ? f5 : f0; 
	f10 = f6 > f3 ? f6 : f3; 
	f11 = f7 < f1 ? f7 : f1; 
	r9 = (r6 * 36)&-1;
	f8 = f8-f9;
	f9 = f10-f11;
	f4 = f4-f5;
	f5 = f6-f7;
	f6 = f8+f9;
	r9 = (r4 + r9)&-1;
	f4 = f4+f5;
	f5 =                        -2;
	r9 = r9 >> 2;
	f6 = f6+f6;
	f4 = f4*f5;
	f7 = heapFloat[(r9+1)];
	f8 = heapFloat[(r9)];
	f9 = heapFloat[(r9+3)];
	f10 = heapFloat[(r9+2)];
	f4 = f6+f4;
	r10 = heap32[(r8+7)];
	f6 = f6+f6;
	f4 = f4+f4;
	f11 = f1 < f7 ? f1 : f7; 
	f12 = f0 < f8 ? f0 : f8; 
	f13 = f3 > f9 ? f3 : f9; 
	f14 = f2 > f10 ? f2 : f10; 
	r9 = heap32[(r9+6)];
	if(r9 !=-1) //_LBB11_5
{
	f12 = f14-f12;
	f11 = f13-f11;
	f8 = f10-f8;
	f7 = f9-f7;
	f9 = f12+f11;
	f7 = f8+f7;
	f8 = f9+f9;
	f7 = f7*f5;
	f7 = f8+f7;
}
else{
	f7 = f14-f12;
	f8 = f13-f11;
	f7 = f7+f8;
	f7 = f7+f7;
}
	r9 = (r10 * 36)&-1;
	r9 = (r4 + r9)&-1;
	r9 = r9 >> 2;
	f8 = heapFloat[(r9+1)];
	f9 = heapFloat[(r9)];
	f10 = heapFloat[(r9+3)];
	f11 = heapFloat[(r9+2)];
	f7 = f7+f4;
	f12 = f1 < f8 ? f1 : f8; 
	f13 = f0 < f9 ? f0 : f9; 
	f14 = f3 > f10 ? f3 : f10; 
	f15 = f2 > f11 ? f2 : f11; 
	r9 = heap32[(r9+6)];
	if(r9 !=-1) //_LBB11_8
{
	f13 = f15-f13;
	f12 = f14-f12;
	f9 = f11-f9;
	f8 = f10-f8;
	f10 = f13+f12;
	f8 = f9+f8;
	f9 = f10+f10;
	f5 = f8*f5;
	f5 = f9+f5;
}
else{
	f5 = f15-f13;
	f8 = f14-f12;
	f5 = f5+f8;
	f5 = f5+f5;
}
	f4 = f5+f4;
if(!(f6 >=f7)) //_LBB11_11
{
	if(f6 <f4) //_LBB11_14
{
break _3;
}
}
	r2 = r6;
if(!(f7 <f4)) //_LBB11_13
{
	r2 = r10;
}
}
else{
break _3;
}
}
	r4 = heap32[(r8+5)];
	heap32[(g0)] = r0;
	_ZN13b2DynamicTree12AllocateNodeEv(i7);
	r6 = r_g0;
	r8 = (r6 * 36)&-1;
	r9 = heap32[(r1+1)];
	r9 = (r9 + r8)&-1;
	r9 = r9 >> 2;
	heap32[(r9+5)] = r4;
	r9 = heap32[(r1+1)];
	r9 = (r9 + r8)&-1;
	r9 = r9 >> 2;
	heap32[(r9+4)] = 0;
	r9 = heap32[(r1+1)];
	r10 = (r9 + r7)&-1;
	r10 = r10 >> 2;
	r9 = (r9 + r8)&-1;
	f4 = heapFloat[(r10)];
	f5 = heapFloat[(r10+1)];
	r9 = r9 >> 2;
	f0 = f0 < f4 ? f0 : f4; 
	f1 = f1 < f5 ? f1 : f5; 
	heapFloat[(r9)] = f0;
	heapFloat[(r9+1)] = f1;
	f0 = heapFloat[(r10+2)];
	f1 = heapFloat[(r10+3)];
	f0 = f2 > f0 ? f2 : f0; 
	f1 = f3 > f1 ? f3 : f1; 
	heapFloat[(r9+2)] = f0;
	heapFloat[(r9+3)] = f1;
	r9 = heap32[(r1+1)];
	r10 = (r9 + r7)&-1;
	r10 = r10 >> 2;
	r10 = heap32[(r10+8)];
	r8 = (r9 + r8)&-1;
	r8 = r8 >> 2;
	r9 = (r10 + 1)&-1;
	heap32[(r8+8)] = r9;
	r8 = heap32[(r1+1)];
	if(r4 ==-1) //_LBB11_19
{
	r4 = (r6 * 36)&-1;
	r8 = (r8 + r4)&-1;
	r8 = r8 >> 2;
	heap32[(r8+6)] = r2;
	r2 = heap32[(r1+1)];
	r2 = (r2 + r4)&-1;
	r2 = r2 >> 2;
	heap32[(r2+7)] = r3;
	r2 = heap32[(r1+1)];
	r2 = (r2 + r7)&-1;
	r2 = r2 >> 2;
	heap32[(r2+5)] = r6;
	r2 = heap32[(r1+1)];
	r2 = (r2 + r5)&-1;
	r2 = r2 >> 2;
	heap32[(r2+5)] = r6;
	heap32[(r1)] = r6;
}
else{
	r4 = (r4 * 36)&-1;
	r8 = (r8 + r4)&-1;
	r8 = r8 >> 2;
	r4 = heap32[(r8+6)];
	if(r4 !=r2) //_LBB11_17
{
	heap32[(r8+7)] = r6;
}
else{
	heap32[(r8+6)] = r6;
}
	r8 = (r6 * 36)&-1;
	r4 = heap32[(r1+1)];
	r4 = (r4 + r8)&-1;
	r4 = r4 >> 2;
	heap32[(r4+6)] = r2;
	r2 = heap32[(r1+1)];
	r2 = (r2 + r8)&-1;
	r2 = r2 >> 2;
	heap32[(r2+7)] = r3;
	r2 = heap32[(r1+1)];
	r2 = (r2 + r7)&-1;
	r2 = r2 >> 2;
	heap32[(r2+5)] = r6;
	r2 = heap32[(r1+1)];
	r2 = (r2 + r5)&-1;
	r2 = r2 >> 2;
	heap32[(r2+5)] = r6;
}
	r2 = heap32[(r1+1)];
	r2 = (r2 + r5)&-1;
	r2 = (r2 + 20)&-1;
_27: while(true){
	r2 = r2 >> 2;
	r2 = heap32[(r2)];
	if(r2 !=-1) //_LBB11_21
{
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r2;
	_ZN13b2DynamicTree7BalanceEi(i7);
	r2 = r_g0;
	r3 = heap32[(r1+1)];
	r4 = (r2 * 36)&-1;
	r4 = (r3 + r4)&-1;
	r4 = r4 >> 2;
	r5 = heap32[(r4+6)];
	if(r5 !=-1) //_LBB11_23
{
	r4 = heap32[(r4+7)];
	if(r4 !=-1) //_LBB11_25
{
	r4 = (r4 * 36)&-1;
	r5 = (r5 * 36)&-1;
	r6 = (r3 + r4)&-1;
	r7 = (r3 + r5)&-1;
	r6 = r6 >> 2;
	r7 = r7 >> 2;
	r2 = (r2 * 36)&-1;
	r6 = heap32[(r6+8)];
	r7 = heap32[(r7+8)];
	r3 = (r3 + r2)&-1;
	r6 = r7 > r6 ? r7 : r6; 
	r3 = r3 >> 2;
	r6 = (r6 + 1)&-1;
	heap32[(r3+8)] = r6;
	r3 = heap32[(r1+1)];
	r5 = (r3 + r5)&-1;
	r4 = (r3 + r4)&-1;
	r5 = r5 >> 2;
	r4 = r4 >> 2;
	r3 = (r3 + r2)&-1;
	f0 = heapFloat[(r4+1)];
	f1 = heapFloat[(r5+1)];
	f2 = heapFloat[(r4)];
	f3 = heapFloat[(r5)];
	r3 = r3 >> 2;
	f2 = f3 < f2 ? f3 : f2; 
	f0 = f1 < f0 ? f1 : f0; 
	heapFloat[(r3)] = f2;
	heapFloat[(r3+1)] = f0;
	f0 = heapFloat[(r4+3)];
	f1 = heapFloat[(r5+3)];
	f2 = heapFloat[(r4+2)];
	f3 = heapFloat[(r5+2)];
	f2 = f3 > f2 ? f3 : f2; 
	f0 = f1 > f0 ? f1 : f0; 
	heapFloat[(r3+2)] = f2;
	heapFloat[(r3+3)] = f0;
	r3 = heap32[(r1+1)];
	r2 = (r3 + r2)&-1;
	r2 = (r2 + 20)&-1;
}
else{
__label__ = 24;
break _27;
}
}
else{
__label__ = 22;
break _27;
}
}
else{
__label__ = 27;
break _27;
}
}
switch(__label__ ){//multiple entries
case 27: 
	return;
break;
case 24: 
	r2 = _2E_str31;
	r0 = _2E_str115;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 308;
	_assert(i7);
break;
case 22: 
	r2 = _2E_str30;
	r0 = _2E_str115;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 307;
	_assert(i7);
break;
}
}
else{
	heap32[(r1)] = r3;
	r0 = (r3 * 36)&-1;
	r1 = heap32[(r1+1)];
	r0 = (r1 + r0)&-1;
	r0 = r0 >> 2;
	heap32[(r0+5)] = -1;
	return;
}
}

function _ZNK20b2SeparationFunction8EvaluateEiif(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
	var f16;
	var f17;
	var f18;
	var f19;
	var f20;
	var f21;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	f0 =                         1;
	f1 = heapFloat[(fp+3)];
	f2 = heapFloat[(r0+7)];
	f3 = heapFloat[(r0+6)];
	f4 = heapFloat[(r0+9)];
	f0 = f0-f1;
	f5 = heapFloat[(r0+5)];
	f6 = heapFloat[(r0+4)];
	f7 = heapFloat[(r0+8)];
	f7 = f0*f7;
	f4 = f4*f1;
	f4 = f7+f4;
	heapFloat[(g0)] = f4;
	sinf(i7);
	f7 = f_g0;
	heapFloat[(g0)] = f4;
	cosf(i7);
	f4 = f_g0;
	f8 = heapFloat[(r0+2)];
	f9 = heapFloat[(r0+3)];
	f10 = heapFloat[(r0+16)];
	f11 = heapFloat[(r0+15)];
	f12 = heapFloat[(r0+14)];
	f13 = heapFloat[(r0+13)];
	f14 = heapFloat[(r0+17)];
	f15 = heapFloat[(r0+18)];
	f14 = f0*f14;
	f15 = f15*f1;
	f14 = f14+f15;
	heapFloat[(g0)] = f14;
	sinf(i7);
	f15 = f_g0;
	heapFloat[(g0)] = f14;
	cosf(i7);
	f14 = f_g0;
	f16 = heapFloat[(r0+11)];
	f17 = heapFloat[(r0+12)];
	f6 = f6*f0;
	f3 = f3*f1;
	f18 = f4*f8;
	f19 = f7*f9;
	f5 = f5*f0;
	f2 = f2*f1;
	f8 = f7*f8;
	f9 = f4*f9;
	f13 = f13*f0;
	f11 = f11*f1;
	f20 = f14*f16;
	f21 = f15*f17;
	f0 = f12*f0;
	f1 = f10*f1;
	f10 = f15*f16;
	f12 = f14*f17;
	f3 = f6+f3;
	f6 = f18-f19;
	f2 = f5+f2;
	f5 = f8+f9;
	f8 = f13+f11;
	f9 = f20-f21;
	f0 = f0+f1;
	f1 = f10+f12;
	r1 = heap32[(r0+20)];
	r2 = heap32[(fp+1)];
	f3 = f3-f6;
	f2 = f2-f5;
	f5 = f8-f9;
	f0 = f0-f1;
_1: do {
	if(r1 ==2) //_LBB12_14
{
	if(r2 <0) //_LBB12_16
{
break _1;
}
else{
	r1 = heap32[(r0)];
	r1 = r1 >> 2;
	r3 = heap32[(r1+5)];
	if(r3 >r2) //_LBB12_17
{
	f1 = heapFloat[(r0+21)];
	f6 = heapFloat[(r0+22)];
	f8 = heapFloat[(r0+23)];
	f9 = heapFloat[(r0+24)];
	f10 = f14*f1;
	f11 = f15*f6;
	f1 = f15*f1;
	f6 = f14*f6;
	f12 = f15*f8;
	f13 = f14*f9;
	f8 = f14*f8;
	f9 = f15*f9;
	f10 = f10-f11;
	f1 = f1+f6;
	f6 = f12+f13;
	f8 = f8-f9;
	f5 = f10+f5;
	f0 = f1+f0;
	r0 = heap32[(r1+4)];
	r1 = r2 << 3;
	r0 = (r0 + r1)&-1;
	r0 = r0 >> 2;
	f1 = heapFloat[(r0)];
	f9 = heapFloat[(r0+1)];
	f10 = f4*f1;
	f11 = f7*f9;
	f1 = f7*f1;
	f4 = f4*f9;
	f7 = f10-f11;
	f1 = f1+f4;
	f3 = f7+f3;
	f1 = f1+f2;
	f2 = f3-f5;
	f0 = f1-f0;
	f1 = f2*f8;
	f0 = f0*f6;
	f0 = f1+f0;
	f_g0 = f0;
	return;
}
else{
break _1;
}
}
}
else{
	r3 = heap32[(fp+2)];
	if(r1 ==1) //_LBB12_10
{
if(!(r3 <0)) //_LBB12_12
{
	r2 = heap32[(r0+1)];
	r2 = r2 >> 2;
	r1 = heap32[(r2+5)];
	if(r1 >r3) //_LBB12_13
{
	f1 = heapFloat[(r0+21)];
	f6 = heapFloat[(r0+22)];
	f8 = heapFloat[(r0+23)];
	f9 = heapFloat[(r0+24)];
	f10 = f4*f1;
	f11 = f7*f6;
	f1 = f7*f1;
	f6 = f4*f6;
	f12 = f7*f8;
	f13 = f4*f9;
	f4 = f4*f8;
	f7 = f7*f9;
	f8 = f10-f11;
	f1 = f1+f6;
	f6 = f12+f13;
	f4 = f4-f7;
	f3 = f8+f3;
	f2 = f1+f2;
	r0 = heap32[(r2+4)];
	r2 = r3 << 3;
	r0 = (r0 + r2)&-1;
	r0 = r0 >> 2;
	f7 = heapFloat[(r0)];
	f1 = heapFloat[(r0+1)];
	f8 = f14*f7;
	f9 = f15*f1;
	f7 = f15*f7;
	f14 = f14*f1;
	f15 = f8-f9;
	f7 = f7+f14;
	f5 = f15+f5;
	f0 = f7+f0;
	f3 = f5-f3;
	f0 = f0-f2;
	f2 = f3*f4;
	f0 = f0*f6;
	f0 = f2+f0;
	f_g0 = f0;
	return;
}
}
	r2 = _2E_str29;
	r0 = _2E_str3;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 103;
	_assert(i7);
}
else{
	if(r1 !=0) //_LBB12_18
{
	r0 = _2E_str7;
	r1 = _2E_str335;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 242;
	_assert(i7);
}
else{
if(!(r2 <0)) //_LBB12_5
{
	r1 = heap32[(r0)];
	r1 = r1 >> 2;
	r4 = heap32[(r1+5)];
	if(r4 >r2) //_LBB12_6
{
if(!(r3 <0)) //_LBB12_8
{
	r4 = heap32[(r0+1)];
	r4 = r4 >> 2;
	r5 = heap32[(r4+5)];
	if(r5 >r3) //_LBB12_9
{
	r1 = heap32[(r1+4)];
	r2 = r2 << 3;
	r2 = (r1 + r2)&-1;
	r2 = r2 >> 2;
	f1 = heapFloat[(r2)];
	f6 = heapFloat[(r2+1)];
	r2 = heap32[(r4+4)];
	r3 = r3 << 3;
	r2 = (r2 + r3)&-1;
	r2 = r2 >> 2;
	f8 = heapFloat[(r2)];
	f9 = heapFloat[(r2+1)];
	f10 = f14*f8;
	f11 = f15*f9;
	f12 = f4*f1;
	f13 = f7*f6;
	f15 = f15*f8;
	f14 = f14*f9;
	f7 = f7*f1;
	f4 = f4*f6;
	f1 = f10-f11;
	f6 = f12-f13;
	f14 = f15+f14;
	f4 = f7+f4;
	f5 = f1+f5;
	f3 = f6+f3;
	f0 = f14+f0;
	f2 = f4+f2;
	f3 = f5-f3;
	f4 = heapFloat[(r0+23)];
	f0 = f0-f2;
	f2 = heapFloat[(r0+24)];
	f3 = f3*f4;
	f0 = f0*f2;
	f0 = f3+f0;
	f_g0 = f0;
	return;
}
}
}
}
}
}
}
} while(0);
	r0 = _2E_str29;
	r1 = _2E_str3;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 103;
	_assert(i7);
}

function _ZNK12b2ChainShape12GetChildEdgeEP11b2EdgeShapei(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var f0;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
if(!(r0 <0)) //_LBB13_2
{
	r1 = heap32[(fp)];
	r2 = r1 >> 2;
	r3 = heap32[(r2+4)];
	r3 = (r3 + -1)&-1;
	if(r3 >r0) //_LBB13_3
{
	r3 = heap32[(fp+1)];
	r4 = r3 >> 2;
	heap32[(r4+1)] = 1;
	heap32[(r4+2)] = heap32[(r2+2)];
	r5 = r0 << 3;
	r6 = heap32[(r2+3)];
	r6 = (r6 + r5)&-1;
	r6 = r6 >> 2;
	f0 = heapFloat[(r6+1)];
	heap32[(r4+3)] = heap32[(r6)];
	heapFloat[(r4+4)] = f0;
	r6 = heap32[(r2+3)];
	r6 = (r5 + r6)&-1;
	r6 = r6 >> 2;
	f0 = heapFloat[(r6+3)];
	heap32[(r4+5)] = heap32[(r6+2)];
	heapFloat[(r4+6)] = f0;
	if(r0 <1) //_LBB13_5
{
	f0 = heapFloat[(r2+6)];
	heap32[(r4+7)] = heap32[(r2+5)];
	heapFloat[(r4+8)] = f0;
	r6 = heapU8[r1+36];
	heap8[r3+44] = r6;
}
else{
	r6 = heap32[(r2+3)];
	r6 = (r5 + r6)&-1;
	r6 = r6 >> 2;
	f0 = heapFloat[(r6+-1)];
	heap32[(r4+7)] = heap32[(r6+-2)];
	r6 = 1;
	heapFloat[(r4+8)] = f0;
	heap8[r3+44] = r6;
}
	r6 = heap32[(r2+4)];
	r6 = (r6 + -2)&-1;
	if(r6 <=r0) //_LBB13_8
{
	f0 = heapFloat[(r2+8)];
	heap32[(r4+9)] = heap32[(r2+7)];
	heapFloat[(r4+10)] = f0;
	r0 = heapU8[r1+37];
	heap8[r3+45] = r0;
	return;
}
else{
	r1 = heap32[(r2+3)];
	r1 = (r5 + r1)&-1;
	r1 = r1 >> 2;
	f0 = heapFloat[(r1+5)];
	heap32[(r4+9)] = heap32[(r1+4)];
	r1 = 1;
	heapFloat[(r4+10)] = f0;
	heap8[r3+45] = r1;
	return;
}
}
}
	r0 = _2E_str240;
	r1 = _2E_str139;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 89;
	_assert(i7);
}

function _ZN11b2EdgeShapeD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV11b2EdgeShape;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN11b2EdgeShapeD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV11b2EdgeShape;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZNK11b2EdgeShape5CloneEP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r2;
	var r3;
	var r4;
	var f0;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 48;
	r0 = _ZTV11b2EdgeShape;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r2 = r_g0 >> 2;
	r0 = (r0 + 8)&-1;
	heap32[(r2)] = r0;
	heap32[(r2+1)] = 1;
	heap32[(r2+2)] = 1008981770;
	heap32[(r2+7)] = 0;
	heap32[(r2+8)] = 0;
	heap32[(r2+9)] = 0;
	r0 = 0;
	heap32[(r2+10)] = 0;
	r3 = heap32[(fp)];
	heap8[r_g0+44] = r0;
	r4 = r3 >> 2;
	heap8[r_g0+45] = r0;
	r0 = heap32[(r4+1)];
	heap32[(r2+1)] = r0;
	heap32[(r2+2)] = heap32[(r4+2)];
	f0 = heapFloat[(r4+4)];
	heap32[(r2+3)] = heap32[(r4+3)];
	heapFloat[(r2+4)] = f0;
	f0 = heapFloat[(r4+6)];
	heap32[(r2+5)] = heap32[(r4+5)];
	heapFloat[(r2+6)] = f0;
	f0 = heapFloat[(r4+8)];
	heap32[(r2+7)] = heap32[(r4+7)];
	heapFloat[(r2+8)] = f0;
	f0 = heapFloat[(r4+10)];
	heap32[(r2+9)] = heap32[(r4+9)];
	heapFloat[(r2+10)] = f0;
	r0 = heapU8[r3+44];
	heap8[r_g0+44] = r0;
	r0 = heapU8[r3+45];
	heap8[r_g0+45] = r0;
	return;
}

function _ZNK11b2EdgeShape13GetChildCountEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 1;
	r_g0 = r0;
	return;
}

function _ZNK11b2EdgeShape9TestPointERK11b2TransformRK6b2Vec2(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZNK11b2EdgeShape7RayCastEP15b2RayCastOutputRK14b2RayCastInputRK11b2Transformi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
	var f16;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(fp+2)];
	r2 = heap32[(fp+3)];
	r1 = r1 >> 2;
	r2 = r2 >> 2;
	f0 = heapFloat[(r0+4)];
	f1 = heapFloat[(r0+6)];
	f2 = heapFloat[(r0+3)];
	f3 = heapFloat[(r0+5)];
	f3 = f3-f2;
	f1 = f1-f0;
	f4 = heapFloat[(r1+2)];
	f5 = heapFloat[(r2)];
	f6 = heapFloat[(r1)];
	f7 = heapFloat[(r1+3)];
	f8 = heapFloat[(r2+1)];
	f9 = heapFloat[(r1+1)];
	f10 = heapFloat[(r2+3)];
	f11 = heapFloat[(r2+2)];
	f4 = f4-f5;
	f7 = f7-f8;
	f5 = f6-f5;
	f6 = f9-f8;
	f8 = f1*f1;
	f9 = f3*f3;
	f12 = f8+f9;
	f13 = f10*f7;
	f14 = f4*f11;
	f15 = f10*f6;
	f16 = f5*f11;
	f4 = f10*f4;
	f7 = f11*f7;
	f5 = f10*f5;
	f6 = f11*f6;
	heapFloat[(g0)] = f12;
	f10 = f15-f16;
	f11 = f13-f14;
	f5 = f5+f6;
	f4 = f4+f7;
	sqrtf(i7);
	f6 = f_g0;
	r0 = heap32[(fp+1)];
	f7 = f11-f10;
	f4 = f4-f5;
	f11 = -f3;
	f12 =   1.1920928955078125e-007;
	if(f6 >=f12) //_LBB19_2
{
	f12 =                         1;
	f12 = f12/f6;
	f6 = f1*f12;
	f11 = f12*f11;
}
else{
	f6 = f1;
}
	f12 = f6*f4;
	f13 = f11*f7;
	f12 = f12+f13;
	f13 =                         0;
if(!(f12 ==f13)) //_LBB19_12
{
	f14 = f2-f5;
	f15 = f0-f10;
	f14 = f6*f14;
	f15 = f11*f15;
	f14 = f14+f15;
	f12 = f14/f12;
if(!(f12 <f13)) //_LBB19_12
{
	f15 = heapFloat[(r1+4)];
if(!(f15 <f12)) //_LBB19_12
{
	f8 = f9+f8;
if(!(f8 ==f13)) //_LBB19_12
{
	f4 = f4*f12;
	f7 = f7*f12;
	f4 = f5+f4;
	f5 = f10+f7;
	f2 = f4-f2;
	f0 = f5-f0;
	f2 = f2*f3;
	f0 = f0*f1;
	f0 = f2+f0;
	f0 = f0/f8;
if(!(f0 <f13)) //_LBB19_12
{
	f1 =                         1;
if(!(f0 >f1)) //_LBB19_12
{
	r0 = r0 >> 2;
	heapFloat[(r0+2)] = f12;
if(!(f14 <=f13)) //_LBB19_11
{
	f6 = -f6;
	f11 = -f11;
}
	heapFloat[(r0)] = f6;
	heapFloat[(r0+1)] = f11;
	r0 = 1;
	r_g0 = r0;
	return;
}
}
}
}
}
}
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZNK11b2EdgeShape11ComputeAABBEP6b2AABBRK11b2Transformi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp)];
	r1 = r1 >> 2;
	r0 = r0 >> 2;
	f0 = heapFloat[(r0+3)];
	f1 = heapFloat[(r1+3)];
	f2 = heapFloat[(r0+2)];
	f3 = heapFloat[(r1+4)];
	f4 = heapFloat[(r1+5)];
	f5 = heapFloat[(r1+6)];
	f6 = f0*f1;
	f7 = f2*f3;
	f8 = f0*f4;
	f9 = f2*f5;
	f1 = f2*f1;
	f3 = f0*f3;
	f2 = f2*f4;
	f0 = f0*f5;
	f4 = f6-f7;
	f5 = heapFloat[(r0)];
	f6 = f8-f9;
	f1 = f1+f3;
	f3 = heapFloat[(r0+1)];
	f0 = f2+f0;
	f2 = f4+f5;
	f4 = f6+f5;
	r0 = heap32[(fp+1)];
	f5 = heapFloat[(r1+2)];
	f6 = f2 < f4 ? f2 : f4; 
	f1 = f1+f3;
	f0 = f0+f3;
	f3 = f1 < f0 ? f1 : f0; 
	r0 = r0 >> 2;
	f6 = f6-f5;
	f2 = f2 > f4 ? f2 : f4; 
	f3 = f3-f5;
	heapFloat[(r0)] = f6;
	f0 = f1 > f0 ? f1 : f0; 
	f1 = f2+f5;
	heapFloat[(r0+1)] = f3;
	f0 = f0+f5;
	heapFloat[(r0+2)] = f1;
	heapFloat[(r0+3)] = f0;
	return;
}

function _ZNK11b2EdgeShape11ComputeMassEP10b2MassDataf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var f0;
	var f1;
	var f2;
	var f3;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r0 = r0 >> 2;
	r1 = heap32[(fp)];
	r1 = r1 >> 2;
	heap32[(r0)] = 0;
	f0 = heapFloat[(r1+3)];
	f1 = heapFloat[(r1+5)];
	f0 = f0+f1;
	f1 =                       0.5;
	f2 = heapFloat[(r1+4)];
	f3 = heapFloat[(r1+6)];
	f2 = f2+f3;
	f0 = f0*f1;
	f1 = f2*f1;
	heapFloat[(r0+1)] = f0;
	heapFloat[(r0+2)] = f1;
	heap32[(r0+3)] = 0;
	return;
}

function _ZNK14b2PolygonShape5CloneEP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var f0;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 152;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r0 = r_g0;
	r1 = _ZTV14b2PolygonShape;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(r2+1)] = 2;
	heap32[(r2+2)] = 1008981770;
	heap32[(r2+37)] = 0;
	r1 = heap32[(fp)];
	heap32[(r2+3)] = 0;
	r3 = r1 >> 2;
	heap32[(r2+4)] = 0;
	r4 = heap32[(r3+1)];
	heap32[(r2+1)] = r4;
	heap32[(r2+2)] = heap32[(r3+2)];
	f0 = heapFloat[(r3+4)];
	heap32[(r2+3)] = heap32[(r3+3)];
	heapFloat[(r2+4)] = f0;
	r4 = (r0 + 20)&-1;
	r5 = (r1 + 20)&-1;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = 64;
	memcpy(i7);
	r4 = (r0 + 84)&-1;
	r1 = (r1 + 84)&-1;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 64;
	memcpy(i7);
	r1 = heap32[(r3+37)];
	heap32[(r2+37)] = r1;
	r_g0 = r0;
	return;
}

function _ZN14b2PolygonShapeD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV14b2PolygonShape;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN14b2PolygonShapeD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV14b2PolygonShape;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZNK14b2PolygonShape13GetChildCountEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 1;
	r_g0 = r0;
	return;
}

function _ZNK14b2PolygonShape9TestPointERK11b2TransformRK6b2Vec2(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp+1)];
	r1 = r1 >> 2;
	r0 = r0 >> 2;
	f0 = heapFloat[(r0)];
	f1 = heapFloat[(r1)];
	f2 = heapFloat[(r0+1)];
	f3 = heapFloat[(r1+1)];
	r0 = heap32[(fp)];
	f4 = heapFloat[(r1+3)];
	f0 = f0-f1;
	f1 = heapFloat[(r1+2)];
	f2 = f2-f3;
	r1 = r0 >> 2;
	f3 = f4*f2;
	f5 = f0*f1;
	f0 = f4*f0;
	f1 = f1*f2;
	f2 = f3-f5;
	f0 = f0+f1;
	r1 = heap32[(r1+37)];
	r2 = 0;
_1: while(true){
	if(r1 >r2) //_LBB26_1
{
	r3 = r2 << 3;
	r3 = (r0 + r3)&-1;
	r3 = r3 >> 2;
	f1 = heapFloat[(r3+5)];
	f3 = heapFloat[(r3+6)];
	f4 = heapFloat[(r3+21)];
	f1 = f0-f1;
	f5 = heapFloat[(r3+22)];
	f3 = f2-f3;
	f1 = f4*f1;
	f3 = f5*f3;
	f1 = f1+f3;
	f3 =                         0;
	if(f1 <=f3) //_LBB26_3
{
	r2 = (r2 + 1)&-1;
continue _1;
}
else{
__label__ = 2;
break _1;
}
}
else{
__label__ = 5;
break _1;
}
}
switch(__label__ ){//multiple entries
case 5: 
	r0 = 1;
break;
case 2: 
	r0 = 0;
break;
}
	r0 = r0 & 255;
	r_g0 = r0;
	return;
}

function _ZNK14b2PolygonShape7RayCastEP15b2RayCastOutputRK14b2RayCastInputRK11b2Transformi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+3)];
	r1 = heap32[(fp+2)];
	r1 = r1 >> 2;
	r0 = r0 >> 2;
	f0 = heapFloat[(r1+2)];
	f1 = heapFloat[(r0)];
	f2 = heapFloat[(r1)];
	f3 = heapFloat[(r1+3)];
	f4 = heapFloat[(r0+1)];
	f5 = heapFloat[(r1+1)];
	f0 = f0-f1;
	f6 = heapFloat[(r0+3)];
	f3 = f3-f4;
	f7 = heapFloat[(r0+2)];
	f1 = f2-f1;
	f2 = f5-f4;
	r2 = heap32[(fp)];
	f4 = f6*f3;
	f5 = f0*f7;
	f8 = f6*f2;
	f9 = f1*f7;
	f0 = f6*f0;
	f3 = f7*f3;
	f1 = f6*f1;
	f2 = f7*f2;
	f6 = f8-f9;
	f4 = f4-f5;
	f1 = f1+f2;
	f0 = f0+f3;
	r3 = r2 >> 2;
	r4 = heap32[(fp+1)];
	f2 = f4-f6;
	f0 = f0-f1;
	f3 = heapFloat[(r1+4)];
	r1 = heap32[(r3+37)];
	f4 =                         0;
	r3 = -1;
	r5 = 0;
	f5 = f3;
_1: while(true){
	if(r1 >r5) //_LBB27_1
{
	r6 = r5 << 3;
	r6 = (r2 + r6)&-1;
	r6 = r6 >> 2;
	f7 = heapFloat[(r6+5)];
	f8 = heapFloat[(r6+6)];
	f9 = heapFloat[(r6+21)];
	f7 = f7-f1;
	f10 = heapFloat[(r6+22)];
	f8 = f8-f6;
	f11 = f9*f0;
	f12 = f10*f2;
	f7 = f9*f7;
	f8 = f10*f8;
	f9 = f11+f12;
	f7 = f7+f8;
	f8 =                         0;
_4: do {
	if(f9 !=f8) //_LBB27_4
{
if(!(f9 >=f8)) //_LBB27_7
{
	f10 = f4*f9;
if(!(f10 <=f7)) //_LBB27_7
{
	f4 = f7/f9;
	r3 = r5;
break _4;
}
}
if(!(f9 <=f8)) //_LBB27_3
{
	f8 = f5*f9;
if(!(f8 <=f7)) //_LBB27_3
{
	f5 = f7/f9;
}
}
}
else{
	if(f7 <f8) //_LBB27_18
{
__label__ = 17;
break _1;
}
}
} while(0);
	if(f5 <f4) //_LBB27_18
{
__label__ = 17;
break _1;
}
else{
	r5 = (r5 + 1)&-1;
continue _1;
}
}
else{
__label__ = 12;
break _1;
}
}
_15: do {
switch(__label__ ){//multiple entries
case 12: 
	f0 =                         0;
if(!(f4 <f0)) //_LBB27_15
{
	if(f3 >=f4) //_LBB27_16
{
	if(r3 <0) //_LBB27_18
{
break _15;
}
else{
	r1 = r3 << 3;
	r1 = (r2 + r1)&-1;
	r2 = r4 >> 2;
	heapFloat[(r2+2)] = f4;
	r1 = r1 >> 2;
	f0 = heapFloat[(r0+2)];
	f1 = heapFloat[(r1+21)];
	f2 = heapFloat[(r0+3)];
	f3 = heapFloat[(r1+22)];
	f4 = f2*f1;
	f5 = f0*f3;
	f0 = f0*f1;
	f1 = f2*f3;
	f2 = f4-f5;
	f0 = f0+f1;
	heapFloat[(r2)] = f2;
	heapFloat[(r2+1)] = f0;
	r0 = 1;
	r_g0 = r0;
	return;
}
}
}
	r0 = _2E_str351;
	r2 = _2E_str149;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = 249;
	_assert(i7);
break;
}
} while(0);
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZNK14b2PolygonShape11ComputeAABBEP6b2AABBRK11b2Transformi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+2)];
	r1 = r1 >> 2;
	r2 = r0 >> 2;
	f0 = heapFloat[(r1+2)];
	f1 = heapFloat[(r2+5)];
	f2 = heapFloat[(r1+3)];
	f3 = heapFloat[(r2+6)];
	f4 = f2*f1;
	f5 = f0*f3;
	f1 = f0*f1;
	f3 = f2*f3;
	f6 = heapFloat[(r1)];
	f4 = f4-f5;
	f5 = heapFloat[(r1+1)];
	f1 = f1+f3;
	r1 = heap32[(r2+37)];
	r3 = heap32[(fp+1)];
	f3 = f4+f6;
	f1 = f1+f5;
_1: do {
	if(r1 >1) //_LBB28_2
{
	r4 = 2;
	r1 = r1 > 2 ? r1 : r4; 
	r1 = (r1 + -1)&-1;
	r0 = (r0 + 32)&-1;
	f4 = f3;
	f7 = f1;
_3: while(true){
	r4 = r0 >> 2;
	f8 = heapFloat[(r4+-1)];
	f9 = heapFloat[(r4)];
	f10 = f0*f8;
	f11 = f2*f9;
	f8 = f2*f8;
	f9 = f0*f9;
	f10 = f10+f11;
	f8 = f8-f9;
	f9 = f10+f5;
	f8 = f8+f6;
	r1 = (r1 + -1)&-1;
	f1 = f1 < f9 ? f1 : f9; 
	f3 = f3 < f8 ? f3 : f8; 
	f7 = f7 > f9 ? f7 : f9; 
	f4 = f4 > f8 ? f4 : f8; 
	r0 = (r0 + 8)&-1;
	if(r1 !=0) //_LBB28_3
{
continue _3;
}
else{
break _1;
}
}
}
else{
	f4 = f3;
	f7 = f1;
}
} while(0);
	f0 = heapFloat[(r2+2)];
	r0 = r3 >> 2;
	f2 = f3-f0;
	f1 = f1-f0;
	heapFloat[(r0)] = f2;
	f2 = f4+f0;
	heapFloat[(r0+1)] = f1;
	f0 = f7+f0;
	heapFloat[(r0+2)] = f2;
	heapFloat[(r0+3)] = f0;
	return;
}

function _ZNK14b2PolygonShape11ComputeMassEP10b2MassDataf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
	var f16;
	var f17;
	var f18;
	var f19;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r1 = heap32[(r1+37)];
	if(r1 <3) //_LBB29_2
{
	r0 = _2E_str48;
	r1 = _2E_str149;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 306;
	_assert(i7);
}
else{
	r2 = heap32[(fp+1)];
	f0 = heapFloat[(fp+2)];
	r3 = 0;
	f1 =                         0;
	f2 = f1;
_4: while(true){
	r4 = r3 << 3;
	r4 = (r0 + r4)&-1;
	r4 = r4 >> 2;
	f3 = heapFloat[(r4+5)];
	f4 = heapFloat[(r4+6)];
	r3 = (r3 + 1)&-1;
	f2 = f2+f3;
	f1 = f1+f4;
if(!(r1 !=r3)) //_LBB29_3
{
break _4;
}
}
	f3 =                         1;
	f4 = r1; //fitos r1, f4
	f4 = f3/f4;
	f2 = f2*f4;
	f1 = f1*f4;
	r3 = (r0 + 24)&-1;
	r4 = (r0 + 20)&-1;
	r5 = (r0 + 28)&-1;
	r0 = (r0 + 32)&-1;
	r6 = 0;
	f4 =                         0;
	f5 = f4;
	f6 = f4;
	f7 = f4;
	f19 =        0.3333333432674408;
_7: while(true){
	r7 = r0 >> 2;
	f8 = heapFloat[(r7+-2)];
	f9 = heapFloat[(r7+-3)];
	r6 = (r6 + 1)&-1;
	f8 = f8-f1;
	f9 = f9-f2;
	if(r6 <r1) //_LBB29_7
{
	r7 = r5;
	r8 = r0;
}
else{
	r7 = r4;
	r8 = r3;
}
	r7 = r7 >> 2;
	r8 = r8 >> 2;
	f10 = heapFloat[(r7)];
	f11 = heapFloat[(r8)];
	f10 = f10-f2;
	f11 = f11-f1;
	f12 = f9*f11;
	f13 = f8*f10;
	f14 = f9*f9;
	f15 = f10*f9;
	f16 = f8*f8;
	f17 = f11*f8;
	f18 =                       0.5;
	f12 = f12-f13;
	f13 = f14+f15;
	f14 = f10*f10;
	f15 = f16+f17;
	f16 = f11*f11;
	f17 =      0.083333335816860199;
	f18 = f12*f18;
	f13 = f13+f14;
	f14 = f15+f16;
	f9 = f9+f10;
	f10 = f18*f19;
	f8 = f8+f11;
	f11 = f12*f17;
	f12 = f13+f14;
	f9 = f9*f10;
	f8 = f8*f10;
	f10 = f11*f12;
	f5 = f5+f18;
	f6 = f6+f9;
	f7 = f7+f8;
	f4 = f10+f4;
	r5 = (r5 + 8)&-1;
	r0 = (r0 + 8)&-1;
if(!(r6 <r1)) //_LBB29_5
{
break _7;
}
}
	f8 = f5*f0;
	r0 = r2 >> 2;
	heapFloat[(r0)] = f8;
	f9 =   1.1920928955078125e-007;
	if(f5 >f9) //_LBB29_11
{
	f3 = f3/f5;
	f5 = f7*f3;
	f3 = f6*f3;
	f1 = f5+f1;
	f2 = f3+f2;
	f6 = f2*f2;
	f7 = f1*f1;
	f3 = f3*f3;
	f5 = f5*f5;
	f6 = f6+f7;
	f3 = f3+f5;
	f3 = f6-f3;
	heapFloat[(r0+1)] = f2;
	f0 = f4*f0;
	f2 = f8*f3;
	f0 = f0+f2;
	heapFloat[(r0+2)] = f1;
	heapFloat[(r0+3)] = f0;
	return;
}
else{
	r0 = _2E_str250;
	r1 = _2E_str149;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 352;
	_assert(i7);
}
}
}

function _ZN16b2BlockAllocator4FreeEPvi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
if(!(r0 ==0)) //_LBB30_23
{
	if(r0 >0) //_LBB30_3
{
	r1 = heap32[(fp+1)];
	if(r0 <641) //_LBB30_5
{
	r2 = _ZN16b2BlockAllocator17s_blockSizeLookupE;
	r0 = heapU8[r2+r0];
	if(uint(r0) <uint(14)) //_LBB30_7
{
	r2 = heap32[(fp)];
	r3 = _ZN16b2BlockAllocator12s_blockSizesE;
	r0 = r0 << 2;
	r3 = (r3 + r0)&-1;
	r3 = r3 >> 2;
	r4 = r2 >> 2;
	r3 = heap32[(r3)];
	r5 = 0;
	r6 = heap32[(r4+1)];
	r7 = (r1 + r3)&-1;
	r8 = r5;
_9: while(true){
	if(r6 >r8) //_LBB30_8
{
	r9 = heap32[(r4)];
	r10 = r8 << 3;
	r9 = (r9 + r10)&-1;
	r9 = r9 >> 2;
	r10 = heap32[(r9+1)];
	r9 = heap32[(r9)];
	if(r9 ==r3) //_LBB30_13
{
if(!(uint(r10) >uint(r1))) //_LBB30_10
{
	r9 = (r10 + 16384)&-1;
if(!(uint(r7) >uint(r9))) //_LBB30_10
{
	r5 = 1;
}
}
}
else{
	if(uint(r7) >uint(r10)) //_LBB30_11
{
	r10 = (r10 + 16384)&-1;
if(!(uint(r10) <=uint(r1))) //_LBB30_10
{
__label__ = 11;
break _9;
}
}
}
	r8 = (r8 + 1)&-1;
}
else{
__label__ = 17;
break _9;
}
}
switch(__label__ ){//multiple entries
case 17: 
	r4 = r5 & 255;
	if(r4 ==0) //_LBB30_20
{
	r0 = _2E_str461;
	r1 = _2E_str158;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 196;
	_assert(i7);
}
else{
	r4 = r1;
	r6 = -3;
_24: while(true){
	r3 = (r3 + -1)&-1;
	r5 = (r4 + 1)&-1;
	heap8[r4] = r6;
	r4 = r5;
if(!(r3 !=0)) //_LBB30_21
{
break _24;
}
}
	r0 = (r2 + r0)&-1;
	r0 = r0 >> 2;
	r2 = r1 >> 2;
	r3 = heap32[(r0+3)];
	heap32[(r2)] = r3;
	heap32[(r0+3)] = r1;
}
break;
case 11: 
	r0 = _2E_str360;
	r1 = _2E_str158;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 185;
	_assert(i7);
break;
}
}
else{
	r0 = _2E_str259;
	r1 = _2E_str158;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 173;
	_assert(i7);
}
}
else{
	heap32[(g0)] = r1;
	free(i7);
	return;
}
}
else{
	r0 = _2E_str57;
	r1 = _2E_str158;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 164;
	_assert(i7);
}
}
	return;
}

function _ZN16b2BlockAllocator8AllocateEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	if(r0 ==0) //_LBB31_23
{
	r0 = 0;
	r_g0 = r0;
	return;
}
else{
	if(r0 >0) //_LBB31_3
{
	if(r0 <641) //_LBB31_5
{
	r1 = _ZN16b2BlockAllocator17s_blockSizeLookupE;
	r0 = heapU8[r1+r0];
	if(uint(r0) <uint(14)) //_LBB31_7
{
	r1 = heap32[(fp)];
	r0 = r0 << 2;
	r2 = (r1 + r0)&-1;
	r2 = r2 >> 2;
	r3 = heap32[(r2+3)];
	if(r3 ==0) //_LBB31_9
{
	r1 = r1 >> 2;
	r3 = heap32[(r1+1)];
	r4 = heap32[(r1+2)];
	if(r3 ==r4) //_LBB31_11
{
	r4 = (r4 + 128)&-1;
	r5 = heap32[(r1)];
	heap32[(r1+2)] = r4;
	r4 = r4 << 3;
	heap32[(g0)] = r4;
	malloc(i7);
	heap32[(r1)] = r_g0;
	r3 = r3 << 3;
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r3;
	memcpy(i7);
	r3 = heap32[(r1+1)];
	r4 = heap32[(r1)];
	r3 = r3 << 3;
	r3 = (r4 + r3)&-1;
	r4 = 1024;
	r7 = 0;
_14: while(true){
	r6 = (r4 + -1)&-1;
	r4 = (r3 - r4)&-1;
	heap8[r4+1024] = r7;
	r4 = r6;
if(!(r6 !=0)) //_LBB31_12
{
break _14;
}
}
	heap32[(g0)] = r5;
	free(i7);
	r3 = heap32[(r1+1)];
}
	r4 = heap32[(r1)];
	r3 = r3 << 3;
	r3 = (r4 + r3)&-1;
	heap32[(g0)] = 16384;
	r4 = 16384;
	malloc(i7);
	r5 = r_g0;
	r3 = r3 >> 2;
	heap32[(r3+1)] = r5;
	r7 = -51;
_18: while(true){
	r6 = (r4 + -1)&-1;
	r4 = (r5 - r4)&-1;
	heap8[r4+16384] = r7;
	r4 = r6;
if(!(r6 !=0)) //_LBB31_15
{
break _18;
}
}
	r4 = _ZN16b2BlockAllocator12s_blockSizesE;
	r0 = (r4 + r0)&-1;
	r0 = r0 >> 2;
	r0 = heap32[(r0)];
	r4 = 16384;
	r4 = (r4 /r0)&-1;
	heap32[(r3)] = r0;
	r5 = (r4 * r0)&-1;
	if(r5 >16384) //_LBB31_20
{
	r0 = _2E_str663;
	r1 = _2E_str158;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 140;
	_assert(i7);
}
else{
	r4 = (r4 + -1)&-1;
	r5 = heap32[(r3+1)];
_24: do {
	if(r4 >0) //_LBB31_19
{
	r6 = 0;
	r7 = r4;
	r8 = r5;
_26: while(true){
	r8 = (r8 + r6)&-1;
	r5 = (r5 + r0)&-1;
	r8 = r8 >> 2;
	r5 = (r5 + r6)&-1;
	heap32[(r8)] = r5;
	r5 = heap32[(r3+1)];
	r7 = (r7 + -1)&-1;
	r6 = (r6 + r0)&-1;
	r8 = r5;
if(!(r7 !=0)) //_LBB31_21
{
break _24;
}
}
}
} while(0);
	r0 = (r4 * r0)&-1;
	r0 = (r5 + r0)&-1;
	r0 = r0 >> 2;
	heap32[(r0)] = 0;
	r0 = heap32[(r3+1)];
	r0 = r0 >> 2;
	r0 = heap32[(r0)];
	heap32[(r2+3)] = r0;
	r0 = heap32[(r1+1)];
	r0 = (r0 + 1)&-1;
	heap32[(r1+1)] = r0;
	r0 = heap32[(r3+1)];
	r_g0 = r0;
	return;
}
}
else{
	r0 = r3 >> 2;
	r0 = heap32[(r0)];
	heap32[(r2+3)] = r0;
	r_g0 = r3;
	return;
}
}
else{
	r0 = _2E_str259;
	r1 = _2E_str158;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 112;
	_assert(i7);
}
}
else{
	heap32[(g0)] = r0;
	malloc(i7);
	return;
}
}
else{
	r0 = _2E_str57;
	r1 = _2E_str158;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 104;
	_assert(i7);
}
}
}

function _ZN16b2StackAllocator4FreeEPv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r2 = heap32[(r1+25699)];
	if(r2 >0) //_LBB32_2
{
	r3 = heap32[(fp+1)];
	r4 = (r2 + -1)&-1;
	r4 = (r4 * 12)&-1;
	r4 = (r0 + r4)&-1;
	r5 = r4 >> 2;
	r6 = heap32[(r5+25603)];
	if(r6 ==r3) //_LBB32_4
{
	r0 = (r0 + 102796)&-1;
	r4 = heapU8[r4+102420];
	if(r4 ==0) //_LBB32_6
{
	r5 = heap32[(r5+25604)];
	r3 = heap32[(r1+25600)];
	r3 = (r3 - r5)&-1;
	heap32[(r1+25600)] = r3;
}
else{
	heap32[(g0)] = r3;
	free(i7);
	r2 = r0 >> 2;
	r5 = heap32[(r5+25604)];
	r2 = heap32[(r2)];
}
	r3 = heap32[(r1+25601)];
	r3 = (r3 - r5)&-1;
	r0 = r0 >> 2;
	r2 = (r2 + -1)&-1;
	heap32[(r1+25601)] = r3;
	heap32[(r0)] = r2;
	return;
}
else{
	r0 = _2E_str472;
	r1 = _2E_str169;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 65;
	_assert(i7);
}
}
else{
	r0 = _2E_str371;
	r1 = _2E_str169;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 63;
	_assert(i7);
}
}

function _ZN16b2StackAllocator8AllocateEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r2 = heap32[(r1+25699)];
	if(r2 <32) //_LBB33_2
{
	r3 = heap32[(fp+1)];
	r4 = (r0 + 102796)&-1;
	r2 = (r2 * 12)&-1;
	r2 = (r0 + r2)&-1;
	r5 = r2 >> 2;
	heap32[(r5+25604)] = r3;
	r6 = heap32[(r1+25600)];
	r7 = (r6 + r3)&-1;
	if(r7 <102401) //_LBB33_4
{
	r7 = (r0 + 102400)&-1;
	r0 = (r0 + r6)&-1;
	r6 = 0;
	heap32[(r5+25603)] = r0;
	r0 = r7 >> 2;
	heap8[r2+102420] = r6;
	r2 = heap32[(r0)];
	r2 = (r2 + r3)&-1;
	heap32[(r0)] = r2;
}
else{
	heap32[(g0)] = r3;
	malloc(i7);
	r6 = 1;
	heap32[(r5+25603)] = r_g0;
	heap8[r2+102420] = r6;
}
	r0 = heap32[(r1+25601)];
	r0 = (r0 + r3)&-1;
	heap32[(r1+25601)] = r0;
	r2 = heap32[(r1+25602)];
	r0 = r2 > r0 ? r2 : r0; 
	r2 = r4 >> 2;
	heap32[(r1+25602)] = r0;
	r0 = heap32[(r2)];
	r0 = (r0 + 1)&-1;
	heap32[(r2)] = r0;
	r0 = heap32[(r5+25603)];
	r_g0 = r0;
	return;
}
else{
	r0 = _2E_str573;
	r1 = _2E_str169;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 38;
	_assert(i7);
}
}

function _ZN6b2Body19SynchronizeFixturesEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
	var r20;
	var r21;
	var r22;
	var r23;
	var r24;
	var r25;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
var __label__ = 0;
	i7 = sp + -72;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	f0 = heapFloat[(r1+13)];
	heapFloat[(g0)] = f0;
	r2 = sp + -48; 
	heap32[(fp+-13)] = r2;
	sinf(i7);
	r2 = r2 >> 2;
	heap32[(fp+-14)] = r2;
	heapFloat[(r2+2)] = f_g0;
	heapFloat[(g0)] = f0;
	cosf(i7);
	heapFloat[(r2+3)] = f_g0;
	f1 = heapFloat[(r1+7)];
	f2 = heapFloat[(r2+2)];
	f3 = heapFloat[(r1+8)];
	f4 = f_g0*f1;
	f5 = f2*f3;
	f1 = f2*f1;
	f0 = f_g0*f3;
	f2 = f4-f5;
	f3 = heapFloat[(r1+9)];
	f4 = heapFloat[(r1+10)];
	f0 = f1+f0;
	f1 = f3-f2;
	f0 = f4-f0;
	heapFloat[(fp+-12)] = f1;
	heapFloat[(r2+1)] = f0;
	r2 = heap32[(r1+25)];
_1: do {
if(!(r2 ==0)) //_LBB34_47
{
	r3 = heap32[(r1+22)];
	r4 = (r3 + 102872)&-1;
	r0 = (r0 + 12)&-1;
	r5 = (r3 + 102884)&-1;
	r6 = (r3 + 102876)&-1;
	r7 = (r3 + 102912)&-1;
	r8 = (r3 + 102908)&-1;
	r9 = (r3 + 102904)&-1;
	r10 = (r3 + 102880)&-1;
	r3 = (r3 + 102888)&-1;
_3: while(true){
	r2 = r2 >> 2;
	r11 = heap32[(r2+7)];
if(!(r11 <1)) //_LBB34_46
{
	r11 = 0;
_7: while(true){
	r12 = (r11 * 7)&-1;
	r13 = heap32[(r2+3)];
	r14 = r13 >> 2;
	r15 = heap32[(r2+6)];
	r16 = r12 << 2;
	r14 = heap32[(r14)];
	r16 = (r15 + r16)&-1;
	r14 = r14 >> 2;
	r16 = r16 >> 2;
	r14 = heap32[(r14+6)];
	r17 = heap32[(r16+5)];
	r18 = sp + -16; 
	heap32[(g0)] = r13;
	heap32[(g0+1)] = r18;
	r13 = heap32[(fp+-13)];
	heap32[(g0+2)] = r13;
	heap32[(g0+3)] = r17;
	__FUNCTION_TABLE__[(r14)>>2](i7);
	r13 = heap32[(r2+3)];
	r14 = r13 >> 2;
	r14 = heap32[(r14)];
	r14 = r14 >> 2;
	r14 = heap32[(r14+6)];
	r17 = heap32[(r16+5)];
	r19 = sp + -32; 
	heap32[(g0)] = r13;
	heap32[(g0+1)] = r19;
	heap32[(g0+2)] = r0;
	heap32[(g0+3)] = r17;
	__FUNCTION_TABLE__[(r14)>>2](i7);
	r13 = r18 >> 2;
	r14 = r19 >> 2;
	f0 = heapFloat[(r14+1)];
	f1 = heapFloat[(r13+1)];
	f2 = heapFloat[(fp+-8)];
	f3 = heapFloat[(fp+-4)];
	f2 = f3 < f2 ? f3 : f2; 
	f0 = f1 < f0 ? f1 : f0; 
	heapFloat[(r16)] = f2;
	heapFloat[(r16+1)] = f0;
	f1 = heapFloat[(r14+3)];
	f3 = heapFloat[(r13+3)];
	f4 = heapFloat[(r14+2)];
	f5 = heapFloat[(r13+2)];
	f4 = f5 > f4 ? f5 : f4; 
	f1 = f3 > f1 ? f3 : f1; 
	heapFloat[(r16+2)] = f4;
	heapFloat[(r16+3)] = f1;
	r13 = heap32[(r16+6)];
	if(r13 <0) //_LBB34_6
{
__label__ = 6;
break _3;
}
else{
	r14 = r5 >> 2;
	r17 = heap32[(r14)];
	if(r17 >r13) //_LBB34_7
{
	r17 = r6 >> 2;
	r18 = heap32[(r17)];
	r19 = (r13 * 36)&-1;
	r20 = (r18 + r19)&-1;
	r20 = r20 >> 2;
	r21 = heap32[(r20+6)];
	if(r21 ==-1) //_LBB34_9
{
	f3 = heapFloat[(r1+4)];
	r21 = heap32[(fp+-14)];
	f5 = heapFloat[(r21+1)];
	f6 = heapFloat[(r1+3)];
	f7 = heapFloat[(fp+-12)];
	f8 = heapFloat[(r20)];
	if(f8 >f2) //_LBB34_13
{
__label__ = 13;
}
else{
	f2 = heapFloat[(r20+1)];
	if(f2 >f0) //_LBB34_13
{
__label__ = 13;
}
else{
	f0 = heapFloat[(r20+2)];
	if(f4 >f0) //_LBB34_13
{
__label__ = 13;
}
else{
	f0 = heapFloat[(r20+3)];
	if(f1 <=f0) //_LBB34_45
{
__label__ = 42;
}
else{
__label__ = 13;
}
}
}
}
switch(__label__ ){//multiple entries
case 13: 
	f0 = f3-f5;
	f1 = f6-f7;
	r21 = r4 >> 2;
	r22 = heap32[(r21)];
_18: do {
	if(r22 !=r13) //_LBB34_15
{
	r20 = heap32[(r20+5)];
	r22 = (r20 * 36)&-1;
	r23 = (r18 + r22)&-1;
	r23 = r23 >> 2;
	r24 = heap32[(r23+6)];
	r25 = heap32[(r23+5)];
	if(r24 ==r13) //_LBB34_17
{
	r24 = heap32[(r23+7)];
}
	if(r25 ==-1) //_LBB34_29
{
	r23 = (r24 * 36)&-1;
	r18 = (r18 + r23)&-1;
	r18 = r18 >> 2;
	heap32[(r21)] = r24;
	heap32[(r18+5)] = -1;
	if(r20 <0) //_LBB34_31
{
__label__ = 23;
break _3;
}
else{
	r14 = heap32[(r14)];
	if(r14 >r20) //_LBB34_32
{
	r14 = r10 >> 2;
	r18 = heap32[(r14)];
	if(r18 >0) //_LBB34_34
{
	r18 = r3 >> 2;
	r21 = heap32[(r17)];
	r21 = (r21 + r22)&-1;
	r23 = heap32[(r18)];
	r21 = r21 >> 2;
	heap32[(r21+5)] = r23;
	r21 = heap32[(r17)];
	r21 = (r21 + r22)&-1;
	r21 = r21 >> 2;
	heap32[(r21+8)] = -1;
	heap32[(r18)] = r20;
	r18 = heap32[(r14)];
	r18 = (r18 + -1)&-1;
	heap32[(r14)] = r18;
}
else{
__label__ = 31;
break _3;
}
}
else{
__label__ = 23;
break _3;
}
}
}
else{
	r21 = (r25 * 36)&-1;
	r18 = (r18 + r21)&-1;
	r18 = r18 >> 2;
	r21 = heap32[(r18+6)];
	if(r21 !=r20) //_LBB34_21
{
	heap32[(r18+7)] = r24;
}
else{
	heap32[(r18+6)] = r24;
}
	r18 = (r24 * 36)&-1;
	r21 = heap32[(r17)];
	r18 = (r21 + r18)&-1;
	r18 = r18 >> 2;
	heap32[(r18+5)] = r25;
	if(r20 <0) //_LBB34_24
{
__label__ = 23;
break _3;
}
else{
	r14 = heap32[(r14)];
	if(r14 >r20) //_LBB34_25
{
	r14 = r10 >> 2;
	r18 = heap32[(r14)];
	if(r18 >0) //_LBB34_27
{
	r18 = r3 >> 2;
	r21 = heap32[(r17)];
	r21 = (r21 + r22)&-1;
	r24 = heap32[(r18)];
	r21 = r21 >> 2;
	heap32[(r21+5)] = r24;
	r21 = heap32[(r17)];
	r21 = (r21 + r22)&-1;
	r21 = r21 >> 2;
	heap32[(r21+8)] = -1;
	heap32[(r18)] = r20;
	r18 = heap32[(r14)];
	r18 = (r18 + -1)&-1;
	heap32[(r14)] = r18;
_36: while(true){
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r25;
	_ZN13b2DynamicTree7BalanceEi(i7);
	r14 = (r_g0 * 36)&-1;
	r18 = heap32[(r17)];
	r20 = (r18 + r14)&-1;
	r20 = r20 >> 2;
	r21 = heap32[(r20+6)];
	r22 = heap32[(r20+7)];
	r21 = (r21 * 36)&-1;
	r22 = (r22 * 36)&-1;
	r24 = (r18 + r21)&-1;
	r18 = (r18 + r22)&-1;
	r24 = r24 >> 2;
	r18 = r18 >> 2;
	f2 = heapFloat[(r18+1)];
	f3 = heapFloat[(r24+1)];
	f4 = heapFloat[(r18)];
	f5 = heapFloat[(r24)];
	f4 = f5 < f4 ? f5 : f4; 
	f2 = f3 < f2 ? f3 : f2; 
	heapFloat[(r20)] = f4;
	heapFloat[(r20+1)] = f2;
	f2 = heapFloat[(r18+3)];
	f3 = heapFloat[(r24+3)];
	f4 = heapFloat[(r18+2)];
	f5 = heapFloat[(r24+2)];
	f4 = f5 > f4 ? f5 : f4; 
	f2 = f3 > f2 ? f3 : f2; 
	heapFloat[(r20+2)] = f4;
	heapFloat[(r20+3)] = f2;
	r18 = heap32[(r17)];
	r20 = (r18 + r22)&-1;
	r21 = (r18 + r21)&-1;
	r20 = r20 >> 2;
	r21 = r21 >> 2;
	r20 = heap32[(r20+8)];
	r21 = heap32[(r21+8)];
	r18 = (r18 + r14)&-1;
	r20 = r21 > r20 ? r21 : r20; 
	r18 = r18 >> 2;
	r20 = (r20 + 1)&-1;
	heap32[(r18+8)] = r20;
	r18 = heap32[(r17)];
	r14 = (r18 + r14)&-1;
	r14 = r14 >> 2;
	r25 = heap32[(r14+5)];
	if(r25 ==-1) //_LBB34_35
{
break _18;
}
}
}
else{
__label__ = 25;
break _3;
}
}
else{
__label__ = 23;
break _3;
}
}
}
}
else{
	heap32[(r21)] = -1;
}
} while(0);
	r14 = r12 << 2;
	r18 = r12 << 2;
	r12 = r12 << 2;
	r14 = (r15 + r14)&-1;
	r18 = (r15 + r18)&-1;
	r12 = (r15 + r12)&-1;
	r14 = r14 >> 2;
	r15 = r18 >> 2;
	r12 = r12 >> 2;
	f2 = heapFloat[(r14+1)];
	f3 =      -0.10000000149011612;
	f4 = heapFloat[(r15)];
	f5 = heapFloat[(r16+3)];
	f6 =       0.10000000149011612;
	f7 = heapFloat[(r12+2)];
	f1 = f1+f1;
	f2 = f2+f3;
	f3 = f4+f3;
	f4 = f5+f6;
	f5 = f7+f6;
	f0 = f0+f0;
	f6 =                         0;
	if(f1 >=f6) //_LBB34_37
{
	f5 = f5+f1;
}
else{
	f3 = f3+f1;
}
	if(f0 >=f6) //_LBB34_40
{
	f4 = f4+f0;
}
else{
	f2 = f2+f0;
}
	r12 = heap32[(r17)];
	r12 = (r12 + r19)&-1;
	r12 = r12 >> 2;
	heapFloat[(r12)] = f3;
	heapFloat[(r12+1)] = f2;
	heapFloat[(r12+2)] = f5;
	heapFloat[(r12+3)] = f4;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r13;
	r12 = r7 >> 2;
	_ZN13b2DynamicTree10InsertLeafEi(i7);
	r14 = r8 >> 2;
	r15 = heap32[(r12)];
	r16 = heap32[(r14)];
	if(r15 ==r16) //_LBB34_43
{
	r17 = r9 >> 2;
	r18 = heap32[(r17)];
	r19 = r16 << 1;
	heap32[(r14)] = r19;
	r14 = r16 << 3;
	heap32[(g0)] = r14;
	malloc(i7);
	heap32[(r17)] = r_g0;
	r15 = r15 << 2;
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r18;
	heap32[(g0+2)] = r15;
	memcpy(i7);
	heap32[(g0)] = r18;
	free(i7);
	r15 = heap32[(r12)];
}
	r14 = r9 >> 2;
	r15 = r15 << 2;
	r14 = heap32[(r14)];
	r14 = (r14 + r15)&-1;
	r14 = r14 >> 2;
	heap32[(r14)] = r13;
	r13 = heap32[(r12)];
	r13 = (r13 + 1)&-1;
	heap32[(r12)] = r13;
break;
}
	r11 = (r11 + 1)&-1;
	r12 = heap32[(r2+7)];
if(!(r12 >r11)) //_LBB34_4
{
break _7;
}
}
else{
__label__ = 8;
break _3;
}
}
else{
__label__ = 6;
break _3;
}
}
}
}
	r2 = heap32[(r2+1)];
	if(r2 !=0) //_LBB34_2
{
__label__ = 2;
}
else{
break _1;
}
}
switch(__label__ ){//multiple entries
case 6: 
	r2 = _2E_str27;
	r0 = _2E_str115;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 135;
	_assert(i7);
break;
case 23: 
	r2 = _2E_str1320;
	r0 = _2E_str115;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 97;
	_assert(i7);
break;
case 31: 
	r2 = _2E_str26;
	r0 = _2E_str115;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 98;
	_assert(i7);
break;
case 25: 
	r2 = _2E_str26;
	r14 = _2E_str115;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r14;
	heap32[(g0+2)] = 98;
	_assert(i7);
break;
case 8: 
	r2 = _2E_str28;
	r0 = _2E_str115;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 137;
	_assert(i7);
break;
}
}
} while(0);
	return;
}

function _ZN6b2Body13CreateFixtureEPK7b2Shapef(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
	var r20;
	var r21;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
var __label__ = 0;
	i7 = sp + -32;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r2 = heap32[(r1+22)];
	r3 = heapU8[r2+102868];
	r3 = r3 & 2;
	if(r3 ==0) //_LBB35_2
{
	r3 = heap32[(fp+1)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = 44;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r4 = r_g0;
	r5 = r4 >> 2;
	heap32[(r5+6)] = 0;
	heap32[(r5+7)] = 0;
	heap32[(r5+3)] = 0;
	heap32[(r5)] = 0;
	heap32[(r5+10)] = 0;
	heap32[(r5+4)] = 1045220557;
	heap32[(r5+5)] = 0;
	heap32[(r5+2)] = r0;
	r6 = 1;
	heap32[(r5+1)] = 0;
	r7 = -1;
	heap16[(r4+32)>>1] = r6;
	r8 = 0;
	heap16[(r4+34)>>1] = r7;
	heap16[(r4+36)>>1] = r8;
	r7 = r3 >> 2;
	heap8[r4+38] = r8;
	r7 = heap32[(r7)];
	r7 = r7 >> 2;
	r7 = heap32[(r7+2)];
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r2;
	__FUNCTION_TABLE__[(r7)>>2](i7);
	r7 = r_g0 >> 2;
	heap32[(r5+3)] = r_g0;
	r7 = heap32[(r7)];
	r7 = r7 >> 2;
	r7 = heap32[(r7+3)];
	heap32[(g0)] = r_g0;
	__FUNCTION_TABLE__[(r7)>>2](i7);
	r3 = r_g0;
	r7 = (r3 * 28)&-1;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r7;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r2 = r_g0;
	heap32[(r5+6)] = r2;
if(!(r3 <1)) //_LBB35_5
{
_4: while(true){
	r5 = (r6 * 7)&-1;
	r5 = r5 << 2;
	r2 = (r2 + r5)&-1;
	r2 = r2 >> 2;
	r7 = r4 >> 2;
	heap32[(r2+-3)] = 0;
	r2 = heap32[(r7+6)];
	r2 = (r2 + r5)&-1;
	r2 = r2 >> 2;
	heap32[(r2+-1)] = -1;
	if(r3 ==r6) //_LBB35_5
{
break _4;
}
else{
	r2 = heap32[(r7+6)];
	r6 = (r6 + 1)&-1;
}
}
}
	f0 = heapFloat[(fp+2)];
	r2 = r4 >> 2;
	heap32[(r2+7)] = 0;
	heapFloat[(r2)] = f0;
	r3 = heapU16[(r0+4)>>1];
	r3 = r3 & 32;
_8: do {
if(!(r3 ==0)) //_LBB35_12
{
	r3 = heap32[(r2+3)];
	r5 = r3 >> 2;
	r5 = heap32[(r5)];
	r5 = r5 >> 2;
	r6 = heap32[(r1+22)];
	r5 = heap32[(r5+3)];
	heap32[(g0)] = r3;
	__FUNCTION_TABLE__[(r5)>>2](i7);
	r3 = r_g0;
	heap32[(r2+7)] = r3;
if(!(r3 <1)) //_LBB35_12
{
	r3 = (r0 + 12)&-1;
	r5 = (r6 + 102872)&-1;
	r7 = (r6 + 102876)&-1;
	r9 = (r6 + 102900)&-1;
	r10 = (r6 + 102912)&-1;
	r11 = (r6 + 102908)&-1;
	r6 = (r6 + 102904)&-1;
	r12 = r8;
_11: while(true){
	r13 = heap32[(r2+3)];
	r14 = r13 >> 2;
	r14 = heap32[(r14)];
	r14 = r14 >> 2;
	r15 = heap32[(r2+6)];
	r14 = heap32[(r14+6)];
	r16 = (r15 + r8)&-1;
	heap32[(g0)] = r13;
	heap32[(g0+1)] = r16;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = r12;
	__FUNCTION_TABLE__[(r14)>>2](i7);
	r13 = (r12 * 7)&-1;
	r13 = r13 << 2;
	heap32[(g0)] = r5;
	_ZN13b2DynamicTree12AllocateNodeEv(i7);
	r14 = r_g0;
	r17 = r7 >> 2;
	r13 = (r15 + r13)&-1;
	r13 = r13 >> 2;
	r15 = (r14 * 36)&-1;
	r18 = heap32[(r17)];
	r18 = (r18 + r15)&-1;
	f0 =      -0.10000000149011612;
	f1 = heapFloat[(r13+1)];
	f2 = heapFloat[(r13)];
	r18 = r18 >> 2;
	f2 = f2+f0;
	f0 = f1+f0;
	heapFloat[(r18)] = f2;
	heapFloat[(r18+1)] = f0;
	r18 = heap32[(r17)];
	r18 = (r18 + r15)&-1;
	f0 =       0.10000000149011612;
	f1 = heapFloat[(r13+3)];
	f2 = heapFloat[(r13+2)];
	r18 = r18 >> 2;
	f2 = f2+f0;
	f0 = f1+f0;
	heapFloat[(r18+2)] = f2;
	heapFloat[(r18+3)] = f0;
	r18 = heap32[(r17)];
	r18 = (r18 + r15)&-1;
	r18 = r18 >> 2;
	heap32[(r18+4)] = r16;
	r16 = heap32[(r17)];
	r15 = (r16 + r15)&-1;
	r15 = r15 >> 2;
	heap32[(r15+8)] = 0;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r14;
	_ZN13b2DynamicTree10InsertLeafEi(i7);
	r15 = r9 >> 2;
	r16 = heap32[(r15)];
	r16 = (r16 + 1)&-1;
	r17 = r10 >> 2;
	heap32[(r15)] = r16;
	r15 = r11 >> 2;
	r16 = heap32[(r17)];
	r18 = heap32[(r15)];
	if(r16 ==r18) //_LBB35_10
{
	r19 = r6 >> 2;
	r20 = heap32[(r19)];
	r21 = r18 << 1;
	heap32[(r15)] = r21;
	r15 = r18 << 3;
	heap32[(g0)] = r15;
	malloc(i7);
	heap32[(r19)] = r_g0;
	r16 = r16 << 2;
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r20;
	heap32[(g0+2)] = r16;
	memcpy(i7);
	heap32[(g0)] = r20;
	free(i7);
	r16 = heap32[(r17)];
}
	r15 = r6 >> 2;
	r16 = r16 << 2;
	r15 = heap32[(r15)];
	r15 = (r15 + r16)&-1;
	r15 = r15 >> 2;
	heap32[(r15)] = r14;
	r15 = heap32[(r17)];
	r15 = (r15 + 1)&-1;
	heap32[(r17)] = r15;
	heap32[(r13+6)] = r14;
	r14 = (r12 + 1)&-1;
	r8 = (r8 + 28)&-1;
	heap32[(r13+4)] = r4;
	heap32[(r13+5)] = r12;
	r13 = heap32[(r2+7)];
	r12 = r14;
if(!(r13 >r14)) //_LBB35_8
{
break _8;
}
}
}
}
} while(0);
	r3 = heap32[(r1+25)];
	heap32[(r2+1)] = r3;
	heap32[(r1+25)] = r4;
	r3 = heap32[(r1+26)];
	r3 = (r3 + 1)&-1;
	heap32[(r1+26)] = r3;
	heap32[(r2+2)] = r0;
	f0 = heapFloat[(r2)];
	f1 =                         0;
if(!(f0 <=f1)) //_LBB35_35
{
	heap32[(r1+29)] = 0;
	heap32[(r1+30)] = 0;
	heap32[(r1+31)] = 0;
	heap32[(r1+32)] = 0;
	heap32[(r1+7)] = 0;
	heap32[(r1+8)] = 0;
	r2 = heap32[(r1)];
	if(uint(r2) >uint(1)) //_LBB35_15
{
	if(r2 ==2) //_LBB35_17
{
	r2 = heap32[(r1+25)];
	if(r2 !=0) //_LBB35_19
{
	f3 = f1;
	f4 = f1;
	f2 = f1;
	f0 = f1;
_25: while(true){
	r2 = r2 >> 2;
	f5 = heapFloat[(r2)];
	if(f5 !=f1) //_LBB35_22
{
	r3 = heap32[(r2+3)];
	r4 = r3 >> 2;
	r4 = heap32[(r4)];
	r4 = r4 >> 2;
	r4 = heap32[(r4+7)];
	r5 = sp + -16; 
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r5;
	heapFloat[(g0+2)] = f5;
	__FUNCTION_TABLE__[(r4)>>2](i7);
	f3 = heapFloat[(r1+29)];
	f5 = heapFloat[(fp+-4)];
	f4 = f3+f5;
	heapFloat[(r1+29)] = f4;
	r3 = r5 >> 2;
	f3 = heapFloat[(r3+2)];
	f6 = heapFloat[(r3+1)];
	f6 = f6*f5;
	f3 = f3*f5;
	f5 = heapFloat[(r1+31)];
	f7 = heapFloat[(r3+3)];
	f0 = f0+f6;
	f2 = f2+f3;
	f3 = f5+f7;
	heapFloat[(r1+31)] = f3;
}
	r2 = heap32[(r2+1)];
if(!(r2 !=0)) //_LBB35_20
{
break _25;
}
}
	f1 =                         0;
	if(f4 >f1) //_LBB35_26
{
	f1 =                         1;
	f1 = f1/f4;
	f0 = f0*f1;
	f2 = f2*f1;
	heapFloat[(r1+30)] = f1;
__label__ = 25;
}
else{
__label__ = 24;
}
}
else{
	f0 =                         0;
	f2 = f0;
	f3 = f0;
__label__ = 24;
}
switch(__label__ ){//multiple entries
case 24: 
	f4 =                         1;
	heap32[(r1+29)] = 1065353216;
	heap32[(r1+30)] = 1065353216;
break;
}
	f1 =                         0;
	if(f3 <=f1) //_LBB35_33
{
__label__ = 30;
}
else{
	r0 = heapU8[r0+4];
	r0 = r0 & 16;
	if(r0 !=0) //_LBB35_33
{
__label__ = 30;
}
else{
	f5 = f0*f0;
	f6 = f2*f2;
	f5 = f5+f6;
	f4 = f4*f5;
	f3 = f3-f4;
	heapFloat[(r1+31)] = f3;
	if(f3 >f1) //_LBB35_32
{
	f1 =                         1;
	f1 = f1/f3;
__label__ = 31;
}
else{
	r1 = _2E_str2296;
	r0 = _2E_str2195;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 319;
	_assert(i7);
}
}
}
switch(__label__ ){//multiple entries
case 30: 
	heap32[(r1+31)] = 0;
break;
}
	heapFloat[(r1+32)] = f1;
	f1 = heapFloat[(r1+11)];
	f3 = heapFloat[(r1+12)];
	heapFloat[(r1+7)] = f0;
	heapFloat[(r1+8)] = f2;
	f4 = heapFloat[(r1+6)];
	f5 = heapFloat[(r1+5)];
	f6 = f4*f0;
	f7 = f5*f2;
	f0 = f5*f0;
	f2 = f4*f2;
	f4 = f6-f7;
	f5 = heapFloat[(r1+3)];
	f6 = heapFloat[(r1+4)];
	f0 = f0+f2;
	f2 = f4+f5;
	f0 = f0+f6;
	heapFloat[(r1+11)] = f2;
	heapFloat[(r1+12)] = f0;
	heapFloat[(r1+9)] = f2;
	heapFloat[(r1+10)] = f0;
	f0 = f0-f3;
	f3 = heapFloat[(r1+18)];
	f4 = heapFloat[(r1+16)];
	f0 = f0*f3;
	f0 = f4-f0;
	f1 = f2-f1;
	heapFloat[(r1+16)] = f0;
	f0 = f1*f3;
	f1 = heapFloat[(r1+17)];
	f0 = f1+f0;
	heapFloat[(r1+17)] = f0;
}
else{
	r0 = _2E_str2397;
	r1 = _2E_str2195;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 284;
	_assert(i7);
}
}
else{
	f1 = heapFloat[(r1+4)];
	f0 = heapFloat[(r1+3)];
	heapFloat[(r1+9)] = f0;
	heapFloat[(r1+10)] = f1;
	heapFloat[(r1+11)] = f0;
	heapFloat[(r1+12)] = f1;
	heap32[(r1+13)] = heap32[(r1+14)];
}
}
	r0 = heap32[(r1+22)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+25717)];
	r1 = r1 | 1;
	heap32[(r0+25717)] = r1;
	return;
}
else{
	r0 = _2E_str2094;
	r1 = _2E_str2195;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 153;
	_assert(i7);
}
}

function _GLOBAL__D_b2_defaultFilter(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = b2_defaultListener;
	r1 = _ZTV17b2ContactListener;
	r2 = b2_defaultFilter;
	r3 = _ZTV15b2ContactFilter;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	r2 = r2 >> 2;
	r3 = (r3 + 8)&-1;
	heap32[(r0)] = r1;
	heap32[(r2)] = r3;
	return;
}

function _ZN17b2ContactListener12BeginContactEP9b2Contact(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function _ZN17b2ContactListener10EndContactEP9b2Contact(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function _ZN17b2ContactListener8PreSolveEP9b2ContactPK10b2Manifold(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function _ZN17b2ContactListener9PostSolveEP9b2ContactPK16b2ContactImpulse(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function _ZSt13__adjust_heapIP6b2PairiS0_PFbRKS0_S3_EEvT_T0_S7_T1_T2_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = r0 << 1;
	r2 = (r1 + 2)&-1;
	r3 = heap32[(fp+2)];
	r4 = heap32[(fp)];
	r5 = heap32[(fp+3)];
	r6 = heap32[(fp+4)];
	r7 = heap32[(fp+5)];
_1: do {
	if(r2 <r3) //_LBB41_2
{
	r8 = r0;
_3: while(true){
	r9 = r8;
	r8 = r1 | 1;
	r1 = (r2 * 12)&-1;
	r10 = (r8 * 12)&-1;
	r1 = (r4 + r1)&-1;
	r10 = (r4 + r10)&-1;
	r1 = r1 >> 2;
	r10 = r10 >> 2;
	r11 = heap32[(r1)];
	r12 = heap32[(r10)];
	if(r11 >=r12) //_LBB41_5
{
	if(r11 ==r12) //_LBB41_7
{
	r1 = heap32[(r1+1)];
	r10 = heap32[(r10+1)];
	r8 = r1 < r10 ? r8 : r2; 
}
else{
	r8 = r2;
}
}
	r1 = (r8 * 12)&-1;
	r2 = (r9 * 12)&-1;
	r1 = (r4 + r1)&-1;
	r2 = (r4 + r2)&-1;
	r9 = r1 >> 2;
	r10 = r2 >> 2;
	r1 = heap32[(r9)];
	heap32[(r10)] = r1;
	r2 = heap32[(r9+1)];
	r1 = r8 << 1;
	heap32[(r10+1)] = r2;
	r9 = heap32[(r9+2)];
	r2 = (r1 + 2)&-1;
	heap32[(r10+2)] = r9;
	if(r2 <r3) //_LBB41_3
{
continue _3;
}
else{
break _1;
}
}
}
else{
	r8 = r0;
}
} while(0);
	if(r2 ==r3) //_LBB41_11
{
	r1 = r1 | 1;
	r2 = (r1 * 12)&-1;
	r8 = (r8 * 12)&-1;
	r2 = (r4 + r2)&-1;
	r8 = (r4 + r8)&-1;
	r2 = r2 >> 2;
	r8 = r8 >> 2;
	r3 = heap32[(r2)];
	heap32[(r8)] = r3;
	r3 = heap32[(r2+1)];
	heap32[(r8+1)] = r3;
	r2 = heap32[(r2+2)];
	heap32[(r8+2)] = r2;
	r8 = r1;
}
_15: while(true){
	if(r8 <=r0) //_LBB41_19
{
break _15;
}
else{
	r1 = (r8 + -1)&-1;
	r2 = r1 >>> 31;
	r1 = (r1 + r2)&-1;
	r1 = r1 >> 1;
	r2 = (r1 * 12)&-1;
	r2 = (r4 + r2)&-1;
	r3 = r2 >> 2;
	r2 = heap32[(r3)];
	if(r2 >=r5) //_LBB41_16
{
	if(r2 !=r5) //_LBB41_19
{
break _15;
}
else{
	r9 = heap32[(r3+1)];
	if(r9 >=r6) //_LBB41_19
{
break _15;
}
}
}
else{
	r9 = heap32[(r3+1)];
}
	r8 = (r8 * 12)&-1;
	r8 = (r4 + r8)&-1;
	r8 = r8 >> 2;
	heap32[(r8)] = r2;
	heap32[(r8+1)] = r9;
	r2 = heap32[(r3+2)];
	heap32[(r8+2)] = r2;
	r8 = r1;
continue _15;
}
}
	r0 = (r8 * 12)&-1;
	r0 = (r4 + r0)&-1;
	r0 = r0 >> 2;
	heap32[(r0)] = r5;
	heap32[(r0+1)] = r6;
	heap32[(r0+2)] = r7;
	return;
}

function _ZSt16__introsort_loopIP6b2PairiPFbRKS0_S3_EEvT_S6_T0_T1_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = heap32[(fp+2)];
_1: while(true){
	r3 = (r1 - r0)&-1;
	if(r3 >203) //_LBB42_1
{
	if(r2 !=0) //_LBB42_10
{
	r3 = (r3 / 24)&-1;
	r3 = (r3 * 12)&-1;
	r4 = (r0 + r3)&-1;
	r5 = r0 >> 2;
	r6 = r4 >> 2;
	r7 = heap32[(r5)];
	r8 = heap32[(r6)];
	r9 = (r1 + -12)&-1;
_5: do {
	if(r7 <r8) //_LBB42_13
{
__label__ = 13;
}
else{
if(!(r7 !=r8)) //_LBB42_22
{
	r10 = (r0 + r3)&-1;
	r10 = r10 >> 2;
	r11 = heap32[(r5+1)];
	r10 = heap32[(r10+1)];
if(!(r11 >=r10)) //_LBB42_22
{
__label__ = 13;
break _5;
}
}
	r3 = r1 >> 2;
	r10 = heap32[(r3+-3)];
	if(r7 <r10) //_LBB42_20
{
__label__ = 19;
}
else{
if(!(r7 !=r10)) //_LBB42_25
{
	r5 = heap32[(r5+1)];
	r11 = heap32[(r3+-2)];
	if(r5 <r11) //_LBB42_20
{
__label__ = 19;
break _5;
}
}
	if(r8 <r10) //_LBB42_18
{
__label__ = 17;
}
else{
	if(r8 !=r10) //_LBB42_14
{
__label__ = 27;
}
else{
	r5 = heap32[(r6+1)];
	r3 = heap32[(r3+-2)];
	r4 = r5 < r3 ? r9 : r4; 
__label__ = 27;
}
}
}
}
} while(0);
_16: do {
switch(__label__ ){//multiple entries
case 13: 
	r6 = r1 >> 2;
	r10 = heap32[(r6+-3)];
	if(r8 >=r10) //_LBB42_15
{
if(!(r8 !=r10)) //_LBB42_17
{
	r3 = (r0 + r3)&-1;
	r3 = r3 >> 2;
	r3 = heap32[(r3+1)];
	r8 = heap32[(r6+-2)];
	if(r3 <r8) //_LBB42_14
{
__label__ = 27;
break _16;
}
}
	if(r7 >=r10) //_LBB42_19
{
	if(r7 ==r10) //_LBB42_21
{
	r3 = heap32[(r5+1)];
	r4 = heap32[(r6+-2)];
	r4 = r3 < r4 ? r9 : r0; 
__label__ = 27;
}
else{
__label__ = 19;
}
}
else{
__label__ = 17;
}
}
else{
__label__ = 27;
}
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 19: 
	r4 = r0;
break;
case 17: 
	r4 = r9;
break;
}
	r3 = r4 >> 2;
	r4 = heap32[(r3)];
	r3 = heap32[(r3+1)];
	r5 = r1;
	r6 = r0;
_28: while(true){
	if(r7 <r4) //_LBB42_33
{
__label__ = 31;
}
else{
	if(r7 ==r4) //_LBB42_32
{
	r7 = r6 >> 2;
	r7 = heap32[(r7+1)];
	if(r7 >=r3) //_LBB42_31
{
__label__ = 36;
}
else{
__label__ = 31;
}
}
else{
__label__ = 36;
}
}
switch(__label__ ){//multiple entries
case 31: 
	r6 = (r6 + 12)&-1;
_35: while(true){
	r7 = r6 >> 2;
	r8 = heap32[(r7)];
if(!(r8 <r4)) //_LBB42_38
{
	if(r8 ==r4) //_LBB42_37
{
	r7 = heap32[(r7+1)];
	if(r7 >=r3) //_LBB42_36
{
break _35;
}
}
else{
break _35;
}
}
	r6 = (r6 + 12)&-1;
}
break;
}
	r5 = (r5 + -12)&-1;
_42: while(true){
	r7 = r5 >> 2;
	r8 = heap32[(r7)];
if(!(r4 <r8)) //_LBB42_43
{
	if(r4 !=r8) //_LBB42_44
{
break _42;
}
else{
	r9 = heap32[(r7+1)];
	if(r3 >=r9) //_LBB42_44
{
break _42;
}
}
}
	r5 = (r5 + -12)&-1;
}
	if(uint(r6) >=uint(r5)) //_LBB42_46
{
break _28;
}
else{
	r9 = r6 >> 2;
	r10 = heap32[(r9+2)];
	r11 = heap32[(r9+1)];
	r12 = heap32[(r9)];
	heap32[(r9)] = r8;
	r8 = heap32[(r7+1)];
	heap32[(r9+1)] = r8;
	r8 = heap32[(r7+2)];
	heap32[(r9+2)] = r8;
	heap32[(r7)] = r12;
	heap32[(r7+1)] = r11;
	heap32[(r7+2)] = r10;
	r6 = (r6 + 12)&-1;
	r7 = heap32[(r9+3)];
}
}
	r3 = r2 >>> 31;
	r2 = (r2 + r3)&-1;
	r2 = r2 >> 1;
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r2;
	_ZSt16__introsort_loopIP6b2PairiPFbRKS0_S3_EEvT_S6_T0_T1_(i7);
	r1 = r6;
continue _1;
}
else{
__label__ = 2;
break _1;
}
}
else{
__label__ = 9;
break _1;
}
}
_51: do {
switch(__label__ ){//multiple entries
case 2: 
	r2 = (r3 / 12)&-1;
	r4 = (r2 + -2)&-1;
	r5 = r4 >>> 31;
	r4 = (r4 + r5)&-1;
	r4 = r4 >> 1;
	r5 = (r4 * 12)&-1;
	r5 = (r0 + r5)&-1;
	r5 = r5 >> 2;
	r6 = heap32[(r5+2)];
	r7 = heap32[(r5)];
	r5 = heap32[(r5+1)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r7;
	heap32[(g0+4)] = r5;
	heap32[(g0+5)] = r6;
	_ZSt13__adjust_heapIP6b2PairiS0_PFbRKS0_S3_EEvT_T0_S7_T1_T2_(i7);
	r5 = (r2 + -1)&-1;
if(!(uint(r5) <uint(3))) //_LBB42_6
{
	r4 = (r4 + -1)&-1;
_55: while(true){
	r5 = r4;
	r4 = (r5 * 3)&-1;
	r4 = r4 << 2;
	r4 = (r0 + r4)&-1;
	r4 = r4 >> 2;
	r6 = heap32[(r4+2)];
	r7 = heap32[(r4)];
	r4 = heap32[(r4+1)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r7;
	heap32[(g0+4)] = r4;
	heap32[(g0+5)] = r6;
	r4 = (r5 + -1)&-1;
	_ZSt13__adjust_heapIP6b2PairiS0_PFbRKS0_S3_EEvT_T0_S7_T1_T2_(i7);
if(!(r5 !=0)) //_LBB42_4
{
break _55;
}
}
	if(r3 <24) //_LBB42_9
{
break _51;
}
}
_58: while(true){
	r2 = (r1 + -12)&-1;
if(!(r0 ==r1)) //_LBB42_8
{
	r1 = r1 >> 2;
	r3 = r0 >> 2;
	r4 = heap32[(r1+-1)];
	r5 = heap32[(r3)];
	r6 = heap32[(r1+-3)];
	r7 = heap32[(r1+-2)];
	heap32[(r1+-3)] = r5;
	r5 = heap32[(r3+1)];
	heap32[(r1+-2)] = r5;
	r3 = heap32[(r3+2)];
	r5 = (r2 - r0)&-1;
	heap32[(r1+-1)] = r3;
	r1 = (r5 / 12)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = r1;
	heap32[(g0+3)] = r6;
	heap32[(g0+4)] = r7;
	heap32[(g0+5)] = r4;
	_ZSt13__adjust_heapIP6b2PairiS0_PFbRKS0_S3_EEvT_T0_S7_T1_T2_(i7);
}
	r3 = (r2 - r0)&-1;
	r1 = r2;
	if(r3 >23) //_LBB42_6
{
continue _58;
}
else{
break _51;
}
}
break;
}
} while(0);
	return;
}

function _ZN17b2ContactListenerD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV17b2ContactListener;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN17b2ContactListenerD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV17b2ContactListener;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN16b2ContactManager15FindNewContactsEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
var __label__ = 0;
	i7 = sp + -1064;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = sp + -1040; 
	r2 = (r1 + 4)&-1;
	r3 = 0;
	r0 = r0 >> 2;
	heap32[(r0+13)] = 0;
_1: while(true){
	r4 = heap32[(r0+10)];
	if(r4 >r3) //_LBB45_1
{
	r4 = r3 << 2;
	r5 = heap32[(r0+8)];
	r4 = (r5 + r4)&-1;
	r4 = r4 >> 2;
	r4 = heap32[(r4)];
	heap32[(r0+14)] = r4;
if(!(r4 ==-1)) //_LBB45_27
{
	if(r4 <0) //_LBB45_4
{
__label__ = 4;
break _1;
}
else{
	r5 = heap32[(r0+3)];
	if(r5 >r4) //_LBB45_5
{
	r5 = heap32[(r0+1)];
	r6 = r1 >> 2;
	heap32[(fp+-260)] = r2;
	heap32[(r6+258)] = 256;
	r7 = heap32[(r0)];
	r8 = 1;
	heap32[(r6+1)] = r7;
	heap32[(r6+257)] = 1;
_8: while(true){
	if(r8 >0) //_LBB45_6
{
	r8 = (r8 + -1)&-1;
	heap32[(r6+257)] = r8;
	r7 = heap32[(fp+-260)];
	r9 = r8 << 2;
	r10 = (r7 + r9)&-1;
	r10 = r10 >> 2;
	r10 = heap32[(r10)];
if(!(r10 ==-1)) //_LBB45_24
{
	r11 = heap32[(r0+1)];
	r12 = (r10 * 36)&-1;
	r13 = (r4 * 36)&-1;
	r13 = (r5 + r13)&-1;
	r11 = (r11 + r12)&-1;
	r12 = r13 >> 2;
	r11 = r11 >> 2;
	f0 = heapFloat[(r12)];
	f1 = heapFloat[(r11+2)];
	f0 = f0-f1;
	f1 =                         0;
if(!(f0 >f1)) //_LBB45_24
{
	f0 = heapFloat[(r11)];
	f2 = heapFloat[(r12+2)];
	f3 = heapFloat[(r11+1)];
	f4 = heapFloat[(r12+3)];
	f0 = f0-f2;
	f2 = f3-f4;
	f3 = heapFloat[(r12+1)];
	f4 = heapFloat[(r11+3)];
	f3 = f3-f4;
if(!(f3 >f1)) //_LBB45_24
{
if(!(f0 >f1)) //_LBB45_24
{
if(!(f2 >f1)) //_LBB45_24
{
	r12 = heap32[(r11+6)];
	if(r12 !=-1) //_LBB45_17
{
	r10 = heap32[(r6+258)];
if(!(r8 !=r10)) //_LBB45_20
{
	r8 = r10 << 1;
	heap32[(r6+258)] = r8;
	r8 = r10 << 3;
	heap32[(g0)] = r8;
	malloc(i7);
	heap32[(fp+-260)] = r_g0;
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = r9;
	memcpy(i7);
if(!(r2 ==r7)) //_LBB45_20
{
	heap32[(g0)] = r7;
	free(i7);
}
}
	r8 = heap32[(r6+257)];
	r8 = r8 << 2;
	r7 = heap32[(fp+-260)];
	r8 = (r7 + r8)&-1;
	r7 = heap32[(r11+6)];
	r8 = r8 >> 2;
	heap32[(r8)] = r7;
	r8 = heap32[(r6+257)];
	r8 = (r8 + 1)&-1;
	heap32[(r6+257)] = r8;
	r7 = heap32[(r6+258)];
if(!(r8 !=r7)) //_LBB45_23
{
	r9 = heap32[(fp+-260)];
	r10 = r7 << 1;
	heap32[(r6+258)] = r10;
	r7 = r7 << 3;
	heap32[(g0)] = r7;
	malloc(i7);
	heap32[(fp+-260)] = r_g0;
	r8 = r8 << 2;
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r9;
	heap32[(g0+2)] = r8;
	memcpy(i7);
if(!(r2 ==r9)) //_LBB45_23
{
	heap32[(g0)] = r9;
	free(i7);
}
}
	r8 = heap32[(r6+257)];
	r8 = r8 << 2;
	r7 = heap32[(fp+-260)];
	r8 = (r7 + r8)&-1;
	r7 = heap32[(r11+7)];
	r8 = r8 >> 2;
	heap32[(r8)] = r7;
	r8 = heap32[(r6+257)];
	r8 = (r8 + 1)&-1;
	heap32[(r6+257)] = r8;
}
else{
	r7 = heap32[(r0+14)];
if(!(r7 ==r10)) //_LBB45_24
{
	r8 = heap32[(r0+13)];
	r9 = heap32[(r0+12)];
	if(r8 ==r9) //_LBB45_15
{
	r7 = heap32[(r0+11)];
	r11 = r9 << 1;
	heap32[(r0+12)] = r11;
	r9 = (r9 * 24)&-1;
	heap32[(g0)] = r9;
	malloc(i7);
	heap32[(r0+11)] = r_g0;
	r8 = (r8 * 12)&-1;
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = r8;
	memcpy(i7);
	heap32[(g0)] = r7;
	free(i7);
	r8 = heap32[(r0+13)];
	r7 = heap32[(r0+14)];
}
	r8 = (r8 * 12)&-1;
	r9 = heap32[(r0+11)];
	r8 = (r9 + r8)&-1;
	r8 = r8 >> 2;
	r7 = r7 > r10 ? r10 : r7; 
	heap32[(r8)] = r7;
	r7 = heap32[(r0+13)];
	r7 = (r7 * 12)&-1;
	r8 = heap32[(r0+11)];
	r9 = heap32[(r0+14)];
	r7 = (r8 + r7)&-1;
	r7 = r7 >> 2;
	r8 = r9 < r10 ? r10 : r9; 
	heap32[(r7+1)] = r8;
	r7 = heap32[(r0+13)];
	r7 = (r7 + 1)&-1;
	heap32[(r0+13)] = r7;
	r8 = heap32[(r6+257)];
}
}
}
}
}
}
}
}
else{
break _8;
}
}
	r4 = heap32[(fp+-260)];
if(!(r4 ==r2)) //_LBB45_27
{
	heap32[(g0)] = r4;
	free(i7);
}
}
else{
__label__ = 4;
break _1;
}
}
}
	r3 = (r3 + 1)&-1;
continue _1;
}
else{
__label__ = 28;
break _1;
}
}
switch(__label__ ){//multiple entries
case 28: 
	heap32[(r0+10)] = 0;
	r1 = heap32[(r0+13)];
_36: do {
if(!(r1 ==0)) //_LBB45_143
{
	r2 = heap32[(r0+11)];
	r3 = (r1 * 12)&-1;
	r4 = (r2 + r3)&-1;
	r5 = (r3 / 12)&-1;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r5;
	_ZSt16__introsort_loopIP6b2PairiPFbRKS0_S3_EEvT_S6_T0_T1_(i7);
	if(r3 <204) //_LBB45_66
{
	if(uint(r1) <uint(2)) //_LBB45_143
{
break _36;
}
else{
	r3 = (r2 + 12)&-1;
	r1 = (r1 + -1)&-1;
	r4 = 0;
	r5 = -12;
_41: while(true){
	r6 = (r2 + r4)&-1;
	r7 = r6 >> 2;
	r8 = r2 >> 2;
	r9 = heap32[(r7+3)];
	r10 = heap32[(r8)];
	r11 = heap32[(r7+4)];
	r12 = heap32[(r7+5)];
_43: do {
	if(r9 <r10) //_LBB45_71
{
__label__ = 69;
}
else{
if(!(r9 !=r10)) //_LBB45_75
{
	r10 = heap32[(r8+1)];
if(!(r11 >=r10)) //_LBB45_75
{
__label__ = 69;
break _43;
}
}
	r7 = heap32[(r7)];
	if(r9 >=r7) //_LBB45_77
{
	r8 = (r3 + r4)&-1;
	r10 = (r3 + r4)&-1;
	if(r9 ==r7) //_LBB45_79
{
	r7 = r6 >> 2;
	r7 = heap32[(r7+1)];
	if(r11 <r7) //_LBB45_81
{
__label__ = 76;
}
else{
__label__ = 82;
}
}
else{
__label__ = 82;
}
}
else{
__label__ = 76;
}
switch(__label__ ){//multiple entries
case 76: 
_52: while(true){
	r8 = r6 >> 2;
	r10 = heap32[(r8)];
	heap32[(r8+3)] = r10;
	r10 = heap32[(r8+1)];
	heap32[(r8+4)] = r10;
	r10 = heap32[(r8+2)];
	heap32[(r8+5)] = r10;
	r10 = heap32[(r8+-3)];
	if(r9 >=r10) //_LBB45_83
{
	if(r9 ==r10) //_LBB45_85
{
	r8 = heap32[(r8+-2)];
if(!(r11 <r8)) //_LBB45_82
{
__label__ = 81;
break _52;
}
}
else{
__label__ = 79;
break _52;
}
}
	r6 = (r6 + -12)&-1;
}
switch(__label__ ){//multiple entries
case 81: 
	r10 = r6;
	r8 = r6;
break;
case 79: 
	r10 = r6;
	r8 = r6;
break;
}
break;
}
	r6 = r10 >> 2;
	r7 = r8 >> 2;
	heap32[(r6)] = r9;
	heap32[(r7+1)] = r11;
	heap32[(r7+2)] = r12;
__label__ = 83;
}
} while(0);
switch(__label__ ){//multiple entries
case 69: 
_64: do {
if(!(r4 ==-12)) //_LBB45_74
{
	r6 = r5;
_66: while(true){
	r7 = (r2 - r6)&-1;
	r7 = r7 >> 2;
	r10 = heap32[(r7+-3)];
	heap32[(r7)] = r10;
	r10 = heap32[(r7+-2)];
	heap32[(r7+1)] = r10;
	r10 = heap32[(r7+-1)];
	r6 = (r6 + 12)&-1;
	heap32[(r7+2)] = r10;
if(!(r6 !=0)) //_LBB45_73
{
break _64;
}
}
}
} while(0);
	heap32[(r8)] = r9;
	heap32[(r8+1)] = r11;
	heap32[(r8+2)] = r12;
break;
}
	r1 = (r1 + -1)&-1;
	r5 = (r5 + -12)&-1;
	r4 = (r4 + 12)&-1;
	if(r1 ==0) //_LBB45_143
{
break _36;
}
else{
continue _41;
}
}
}
}
else{
	r3 = 0;
	r4 = r2;
_71: while(true){
	r5 = r4 >> 2;
	r6 = r2 >> 2;
	r7 = (r4 + 12)&-1;
	r8 = heap32[(r5+3)];
	r9 = heap32[(r6)];
	r10 = heap32[(r5+4)];
	r11 = heap32[(r5+5)];
_73: do {
	if(r8 >=r9) //_LBB45_34
{
if(!(r8 !=r9)) //_LBB45_38
{
	r9 = heap32[(r6+1)];
	if(r10 <r9) //_LBB45_33
{
__label__ = 32;
break _73;
}
}
	r6 = heap32[(r5)];
	if(r8 >=r6) //_LBB45_40
{
	if(r8 ==r6) //_LBB45_42
{
	r5 = heap32[(r5+1)];
	if(r10 <r5) //_LBB45_39
{
__label__ = 42;
}
else{
	r5 = r7;
	r4 = r7;
__label__ = 48;
}
}
else{
	r5 = r7;
	r4 = r7;
__label__ = 48;
}
}
else{
__label__ = 42;
}
switch(__label__ ){//multiple entries
case 42: 
_85: while(true){
	r5 = r4 >> 2;
	r6 = heap32[(r5)];
	heap32[(r5+3)] = r6;
	r6 = heap32[(r5+1)];
	heap32[(r5+4)] = r6;
	r6 = heap32[(r5+2)];
	heap32[(r5+5)] = r6;
	r6 = heap32[(r5+-3)];
	if(r8 >=r6) //_LBB45_46
{
	if(r8 ==r6) //_LBB45_48
{
	r5 = heap32[(r5+-2)];
if(!(r10 <r5)) //_LBB45_45
{
__label__ = 47;
break _85;
}
}
else{
__label__ = 45;
break _85;
}
}
	r4 = (r4 + -12)&-1;
}
switch(__label__ ){//multiple entries
case 47: 
	r5 = r4;
break;
case 45: 
	r5 = r4;
break;
}
break;
}
	r5 = r5 >> 2;
	r4 = r4 >> 2;
	heap32[(r5)] = r8;
	heap32[(r4+1)] = r10;
	heap32[(r4+2)] = r11;
__label__ = 49;
}
else{
__label__ = 32;
}
} while(0);
switch(__label__ ){//multiple entries
case 32: 
	r4 = (r3 + -12)&-1;
_97: while(true){
	r5 = (r2 - r4)&-1;
	r5 = r5 >> 2;
	r9 = heap32[(r5+-3)];
	heap32[(r5)] = r9;
	r9 = heap32[(r5+-2)];
	heap32[(r5+1)] = r9;
	r9 = heap32[(r5+-1)];
	r4 = (r4 + 12)&-1;
	heap32[(r5+2)] = r9;
if(!(r4 !=0)) //_LBB45_36
{
break _97;
}
}
	heap32[(r6)] = r8;
	heap32[(r6+1)] = r10;
	heap32[(r6+2)] = r11;
break;
}
	r3 = (r3 + -12)&-1;
	r4 = r7;
if(!(r3 !=-180)) //_LBB45_32
{
break _71;
}
}
if(!(r1 ==16)) //_LBB45_143
{
	r3 = -200;
	r4 = 0;
	r3 = (r3 - r2)&-1;
	r1 = (r4 - r1)&-1;
	r5 = (r2 + 192)&-1;
	r6 = 16;
	r7 = 15;
_103: while(true){
	r8 = (r7 * 3)&-1;
	r8 = r8 << 2;
	r8 = (r2 + r8)&-1;
	r8 = r8 >> 2;
	r9 = heap32[(r8+3)];
	r10 = heap32[(r8)];
	r11 = heap32[(r8+4)];
	r12 = heap32[(r8+5)];
	if(r9 >=r10) //_LBB45_56
{
	if(r9 ==r10) //_LBB45_58
{
	r8 = heap32[(r8+1)];
	if(r11 <r8) //_LBB45_55
{
__label__ = 53;
}
else{
	r8 = r5;
	r10 = r6;
__label__ = 63;
}
}
else{
	r8 = r5;
	r10 = r6;
__label__ = 63;
}
}
else{
__label__ = 53;
}
switch(__label__ ){//multiple entries
case 53: 
	r8 = r3;
	r10 = r7;
	r13 = r3;
_113: while(true){
	r14 = -20;
	r15 = -8;
	r16 = (r14 - r13)&-1;
	r17 = -16;
	r15 = (r15 - r13)&-1;
	r16 = r16 >> 2;
	r18 = -4;
	r17 = (r17 - r13)&-1;
	r15 = r15 >> 2;
	r16 = heap32[(r16)];
	r19 = -12;
	r18 = (r18 - r13)&-1;
	r17 = r17 >> 2;
	heap32[(r15)] = r16;
	r15 = (r19 - r13)&-1;
	r16 = r18 >> 2;
	r17 = heap32[(r17)];
	r18 = -32;
	r19 = (r4 - r13)&-1;
	r15 = r15 >> 2;
	heap32[(r16)] = r17;
	r16 = (r18 - r13)&-1;
	r17 = r19 >> 2;
	r15 = heap32[(r15)];
	r16 = r16 >> 2;
	heap32[(r17)] = r15;
	r15 = heap32[(r16)];
	if(r9 >=r15) //_LBB45_62
{
	if(r9 !=r15) //_LBB45_64
{
break _113;
}
else{
	r15 = -28;
	r15 = (r15 - r13)&-1;
	r15 = r15 >> 2;
	r15 = heap32[(r15)];
if(!(r11 <r15)) //_LBB45_61
{
break _113;
}
}
}
	r13 = (r13 + 12)&-1;
	r10 = (r10 + -1)&-1;
	r8 = (r8 + 12)&-1;
}
	r8 = (r14 - r8)&-1;
break;
}
	r10 = (r10 * 12)&-1;
	r10 = (r2 + r10)&-1;
	r8 = r8 >> 2;
	r10 = r10 >> 2;
	heap32[(r8)] = r9;
	r3 = (r3 + -12)&-1;
	r7 = (r7 + 1)&-1;
	r6 = (r6 + 1)&-1;
	r5 = (r5 + 12)&-1;
	heap32[(r10+1)] = r11;
	heap32[(r10+2)] = r12;
	r8 = (r1 + r7)&-1;
	if(r8 ==-1) //_LBB45_143
{
break _36;
}
else{
continue _103;
}
}
}
}
}
} while(0);
	r3 = heap32[(r0+13)];
	r1 = 0;
_122: while(true){
	if(r3 >r1) //_LBB45_89
{
	r2 = heap32[(r0+11)];
	r3 = (r1 * 12)&-1;
	r2 = (r2 + r3)&-1;
	r2 = r2 >> 2;
	r3 = heap32[(r2)];
	if(r3 <0) //_LBB45_91
{
__label__ = 86;
break _122;
}
else{
	r4 = heap32[(r0+3)];
	if(r4 >r3) //_LBB45_92
{
	r5 = heap32[(r2+1)];
	if(r5 <0) //_LBB45_94
{
__label__ = 86;
break _122;
}
else{
	if(r4 >r5) //_LBB45_95
{
	r4 = heap32[(r0+1)];
	r3 = (r3 * 36)&-1;
	r5 = (r5 * 36)&-1;
	r3 = (r4 + r3)&-1;
	r4 = (r4 + r5)&-1;
	r3 = r3 >> 2;
	r4 = r4 >> 2;
	r3 = heap32[(r3+4)];
	r4 = heap32[(r4+4)];
	r3 = r3 >> 2;
	r4 = r4 >> 2;
	r5 = heap32[(r3+4)];
	r6 = heap32[(r4+4)];
	r7 = r5 >> 2;
	r8 = r6 >> 2;
	r9 = heap32[(r7+2)];
	r10 = heap32[(r8+2)];
_129: do {
if(!(r9 ==r10)) //_LBB45_139
{
	r3 = heap32[(r3+5)];
	r4 = heap32[(r4+5)];
	r11 = (r10 + 112)&-1;
_131: while(true){
	r11 = r11 >> 2;
	r11 = heap32[(r11)];
	if(r11 !=0) //_LBB45_97
{
	r12 = r11 >> 2;
	r13 = heap32[(r12)];
if(!(r13 !=r9)) //_LBB45_106
{
	r12 = heap32[(r12+1)];
	r12 = r12 >> 2;
	r13 = heap32[(r12+12)];
	r14 = heap32[(r12+13)];
	r15 = heap32[(r12+14)];
	r12 = heap32[(r12+15)];
if(!(r13 !=r5)) //_LBB45_102
{
if(!(r14 !=r6)) //_LBB45_102
{
if(!(r15 !=r3)) //_LBB45_102
{
	if(r12 ==r4) //_LBB45_139
{
break _129;
}
}
}
}
if(!(r13 !=r6)) //_LBB45_106
{
if(!(r14 !=r5)) //_LBB45_106
{
if(!(r15 !=r4)) //_LBB45_106
{
	if(r12 ==r3) //_LBB45_139
{
break _129;
}
}
}
}
}
	r11 = (r11 + 12)&-1;
}
else{
break _131;
}
}
	r11 = r10 >> 2;
	r11 = heap32[(r11)];
if(!(r11 ==2)) //_LBB45_110
{
	r11 = r9 >> 2;
	r11 = heap32[(r11)];
	if(r11 !=2) //_LBB45_139
{
break _129;
}
}
	r10 = (r10 + 108)&-1;
_149: while(true){
	r10 = r10 >> 2;
	r10 = heap32[(r10)];
	if(r10 !=0) //_LBB45_111
{
	r11 = r10 >> 2;
	r12 = heap32[(r11)];
if(!(r12 !=r9)) //_LBB45_113
{
	r11 = heap32[(r11+1)];
	r11 = heapU8[r11+61];
	if(r11 ==0) //_LBB45_139
{
break _129;
}
}
	r10 = (r10 + 12)&-1;
}
else{
break _149;
}
}
	r9 = heap32[(r0+17)];
if(!(r9 ==0)) //_LBB45_117
{
	r10 = r9 >> 2;
	r10 = heap32[(r10)];
	r10 = r10 >> 2;
	r10 = heap32[(r10+2)];
	heap32[(g0)] = r9;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r6;
	__FUNCTION_TABLE__[(r10)>>2](i7);
	r9 = r_g0;
	if(r9 ==0) //_LBB45_139
{
break _129;
}
}
	r9 = _ZN9b2Contact13s_initializedE_2E_b;
	r10 = heap32[(r0+19)];
	r11 = heapU8[r9];
if(!(r11 != 0)) //_LBB45_119
{
	r11 = _ZN9b2Contact11s_registersE;
	r12 = r11 >> 2;
	r13 = _ZN15b2CircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__;
	r14 = _ZN15b2CircleContact7DestroyEP9b2ContactP16b2BlockAllocator__index__;
	heap32[(r12)] = r13;
	r13 = 1;
	heap32[(r12+1)] = r14;
	r14 = _ZN25b2PolygonAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__;
	heap8[r11+8] = r13;
	r15 = _ZN25b2PolygonAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator__index__;
	heap32[(r12+24)] = r14;
	heap32[(r12+25)] = r15;
	heap8[r11+104] = r13;
	heap32[(r12+6)] = r14;
	r14 = 0;
	heap32[(r12+7)] = r15;
	r15 = _ZN16b2PolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__;
	heap8[r11+32] = r14;
	r16 = _ZN16b2PolygonContact7DestroyEP9b2ContactP16b2BlockAllocator__index__;
	heap32[(r12+30)] = r15;
	heap32[(r12+31)] = r16;
	r15 = _ZN22b2EdgeAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__;
	heap8[r11+128] = r13;
	r16 = _ZN22b2EdgeAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator__index__;
	heap32[(r12+12)] = r15;
	heap32[(r12+13)] = r16;
	heap8[r11+56] = r13;
	heap32[(r12+3)] = r15;
	heap32[(r12+4)] = r16;
	r15 = _ZN23b2EdgeAndPolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__;
	heap8[r11+20] = r14;
	r16 = _ZN23b2EdgeAndPolygonContact7DestroyEP9b2ContactP16b2BlockAllocator__index__;
	heap32[(r12+18)] = r15;
	heap32[(r12+19)] = r16;
	heap8[r11+80] = r13;
	heap32[(r12+27)] = r15;
	heap32[(r12+28)] = r16;
	r15 = _ZN23b2ChainAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__;
	heap8[r11+116] = r14;
	r16 = _ZN23b2ChainAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator__index__;
	heap32[(r12+36)] = r15;
	heap32[(r12+37)] = r16;
	heap8[r11+152] = r13;
	heap32[(r12+9)] = r15;
	heap32[(r12+10)] = r16;
	r15 = _ZN24b2ChainAndPolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__;
	heap8[r11+44] = r14;
	r16 = _ZN24b2ChainAndPolygonContact7DestroyEP9b2ContactP16b2BlockAllocator__index__;
	heap32[(r12+42)] = r15;
	heap32[(r12+43)] = r16;
	heap8[r11+176] = r13;
	heap32[(r12+33)] = r15;
	heap32[(r12+34)] = r16;
	heap8[r11+140] = r14;
	heap8[r9] = r13;
}
	r7 = heap32[(r7+3)];
	r7 = r7 >> 2;
	r7 = heap32[(r7+1)];
	if(uint(r7) <uint(4)) //_LBB45_121
{
	r8 = heap32[(r8+3)];
	r8 = r8 >> 2;
	r8 = heap32[(r8+1)];
	if(uint(r8) <uint(4)) //_LBB45_123
{
	r9 = _ZN9b2Contact11s_registersE;
	r7 = (r7 * 48)&-1;
	r7 = (r9 + r7)&-1;
	r8 = (r8 * 12)&-1;
	r7 = (r7 + r8)&-1;
	r8 = r7 >> 2;
	r8 = heap32[(r8)];
if(!(r8 ==0)) //_LBB45_139
{
	r7 = heapU8[r7+8];
	if(r7 ==0) //_LBB45_126
{
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r5;
	heap32[(g0+3)] = r3;
	heap32[(g0+4)] = r10;
	__FUNCTION_TABLE__[(r8)>>2](i7);
	r3 = r_g0;
}
else{
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r6;
	heap32[(g0+3)] = r4;
	heap32[(g0+4)] = r10;
	__FUNCTION_TABLE__[(r8)>>2](i7);
	r3 = r_g0;
}
if(!(r3 ==0)) //_LBB45_139
{
	r4 = r3 >> 2;
	r5 = heap32[(r4+12)];
	r6 = heap32[(r4+13)];
	r5 = r5 >> 2;
	r6 = r6 >> 2;
	r5 = heap32[(r5+2)];
	r6 = heap32[(r6+2)];
	heap32[(r4+2)] = 0;
	r7 = heap32[(r0+15)];
	heap32[(r4+3)] = r7;
	r7 = heap32[(r0+15)];
if(!(r7 ==0)) //_LBB45_130
{
	r7 = r7 >> 2;
	heap32[(r7+2)] = r3;
}
	heap32[(r0+15)] = r3;
	heap32[(r4+5)] = r3;
	heap32[(r4+4)] = r6;
	r7 = r5 >> 2;
	heap32[(r4+6)] = 0;
	r8 = heap32[(r7+28)];
	heap32[(r4+7)] = r8;
	r8 = heap32[(r7+28)];
if(!(r8 ==0)) //_LBB45_132
{
	r8 = r8 >> 2;
	r9 = (r3 + 16)&-1;
	heap32[(r8+2)] = r9;
}
	r8 = (r3 + 16)&-1;
	heap32[(r7+28)] = r8;
	heap32[(r4+9)] = r3;
	heap32[(r4+8)] = r5;
	r8 = r6 >> 2;
	heap32[(r4+10)] = 0;
	r9 = heap32[(r8+28)];
	heap32[(r4+11)] = r9;
	r4 = heap32[(r8+28)];
if(!(r4 ==0)) //_LBB45_134
{
	r4 = r4 >> 2;
	r9 = (r3 + 32)&-1;
	heap32[(r4+2)] = r9;
}
	r3 = (r3 + 32)&-1;
	heap32[(r8+28)] = r3;
	r3 = heapU16[(r5+4)>>1];
	r4 = r3 & 2;
if(!(r4 !=0)) //_LBB45_136
{
	r3 = r3 | 2;
	heap16[(r5+4)>>1] = r3;
	heap32[(r7+36)] = 0;
}
	r3 = heapU16[(r6+4)>>1];
	r4 = r3 & 2;
if(!(r4 !=0)) //_LBB45_138
{
	r3 = r3 | 2;
	heap16[(r6+4)>>1] = r3;
	heap32[(r8+36)] = 0;
}
	r3 = heap32[(r0+16)];
	r3 = (r3 + 1)&-1;
	heap32[(r0+16)] = r3;
}
}
}
else{
__label__ = 116;
break _122;
}
}
else{
__label__ = 114;
break _122;
}
}
} while(0);
	r3 = heap32[(r0+13)];
	r4 = (r1 + 1)&-1;
_186: while(true){
	r1 = r4;
	if(r3 >r1) //_LBB45_140
{
	r4 = (r1 * 3)&-1;
	r5 = heap32[(r0+11)];
	r4 = r4 << 2;
	r4 = (r5 + r4)&-1;
	r5 = r4 >> 2;
	r4 = heap32[(r5)];
	r6 = heap32[(r2)];
	if(r4 !=r6) //_LBB45_144
{
continue _122;
}
else{
	r4 = (r1 + 1)&-1;
	r5 = heap32[(r5+1)];
	r6 = heap32[(r2+1)];
	if(r5 !=r6) //_LBB45_144
{
continue _122;
}
else{
continue _186;
}
}
}
else{
continue _122;
}
}
}
else{
__label__ = 86;
break _122;
}
}
}
else{
__label__ = 86;
break _122;
}
}
}
else{
__label__ = 139;
break _122;
}
}
switch(__label__ ){//multiple entries
case 86: 
	r0 = _2E_str27;
	r1 = _2E_str1109;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 153;
	_assert(i7);
break;
case 139: 
	return;
break;
case 116: 
	r0 = _2E_str4202;
	r1 = _2E_str1199;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 81;
	_assert(i7);
break;
case 114: 
	r0 = _2E_str3201;
	r1 = _2E_str1199;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 80;
	_assert(i7);
break;
}
break;
case 4: 
	r0 = _2E_str27;
	r1 = _2E_str1109;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 159;
	_assert(i7);
break;
}
}

function _ZN16b2ContactManager7DestroyEP9b2Contact(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = r0 >> 2;
	r2 = heap32[(fp)];
	r3 = heap32[(r1+12)];
	r4 = heap32[(r1+13)];
	r2 = r2 >> 2;
	r3 = r3 >> 2;
	r4 = r4 >> 2;
	r5 = heap32[(r2+18)];
	r3 = heap32[(r3+2)];
	r4 = heap32[(r4+2)];
if(!(r5 ==0)) //_LBB46_3
{
	r6 = heapU8[r0+4];
	r6 = r6 & 2;
if(!(r6 ==0)) //_LBB46_3
{
	r6 = r5 >> 2;
	r6 = heap32[(r6)];
	r6 = r6 >> 2;
	r6 = heap32[(r6+3)];
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r0;
	__FUNCTION_TABLE__[(r6)>>2](i7);
}
}
	r5 = heap32[(r1+2)];
if(!(r5 ==0)) //_LBB46_5
{
	r5 = r5 >> 2;
	r6 = heap32[(r1+3)];
	heap32[(r5+3)] = r6;
}
	r5 = heap32[(r1+3)];
if(!(r5 ==0)) //_LBB46_7
{
	r5 = r5 >> 2;
	r6 = heap32[(r1+2)];
	heap32[(r5+2)] = r6;
}
	r5 = heap32[(r2+15)];
if(!(r5 !=r0)) //_LBB46_9
{
	r5 = heap32[(r1+3)];
	heap32[(r2+15)] = r5;
}
	r5 = heap32[(r1+6)];
if(!(r5 ==0)) //_LBB46_11
{
	r5 = r5 >> 2;
	r6 = heap32[(r1+7)];
	heap32[(r5+3)] = r6;
}
	r5 = heap32[(r1+7)];
if(!(r5 ==0)) //_LBB46_13
{
	r5 = r5 >> 2;
	r6 = heap32[(r1+6)];
	heap32[(r5+2)] = r6;
}
	r3 = r3 >> 2;
	r5 = (r0 + 16)&-1;
	r6 = heap32[(r3+28)];
if(!(r5 !=r6)) //_LBB46_15
{
	r5 = heap32[(r1+7)];
	heap32[(r3+28)] = r5;
}
	r3 = heap32[(r1+10)];
if(!(r3 ==0)) //_LBB46_17
{
	r3 = r3 >> 2;
	r5 = heap32[(r1+11)];
	heap32[(r3+3)] = r5;
}
	r3 = heap32[(r1+11)];
if(!(r3 ==0)) //_LBB46_19
{
	r3 = r3 >> 2;
	r5 = heap32[(r1+10)];
	heap32[(r3+2)] = r5;
}
	r3 = r4 >> 2;
	r4 = (r0 + 32)&-1;
	r5 = heap32[(r3+28)];
if(!(r4 !=r5)) //_LBB46_21
{
	r4 = heap32[(r1+11)];
	heap32[(r3+28)] = r4;
}
	r3 = _ZN9b2Contact13s_initializedE_2E_b;
	r3 = heapU8[r3];
	if(r3 != 0) //_LBB46_23
{
	r3 = heap32[(r2+19)];
	r4 = heap32[(r1+31)];
if(!(r4 <1)) //_LBB46_28
{
	r4 = heap32[(r1+12)];
	r4 = r4 >> 2;
	r4 = heap32[(r4+2)];
	r5 = heapU16[(r4+4)>>1];
	r6 = r5 & 2;
if(!(r6 !=0)) //_LBB46_26
{
	r5 = r5 | 2;
	r6 = r4 >> 2;
	heap16[(r4+4)>>1] = r5;
	heap32[(r6+36)] = 0;
}
	r4 = heap32[(r1+13)];
	r4 = r4 >> 2;
	r4 = heap32[(r4+2)];
	r5 = heapU16[(r4+4)>>1];
	r6 = r5 & 2;
if(!(r6 !=0)) //_LBB46_28
{
	r5 = r5 | 2;
	r6 = r4 >> 2;
	heap16[(r4+4)>>1] = r5;
	heap32[(r6+36)] = 0;
}
}
	r4 = heap32[(r1+13)];
	r1 = heap32[(r1+12)];
	r4 = r4 >> 2;
	r1 = r1 >> 2;
	r4 = heap32[(r4+3)];
	r1 = heap32[(r1+3)];
	r4 = r4 >> 2;
	r1 = r1 >> 2;
	r4 = heap32[(r4+1)];
	r5 = 3;
	r1 = heap32[(r1+1)];
	r5 = r4 > r5;
	r5 = r5 & 1;
	r6 = r1 >>> 31;
	r5 = r5 | r6;
	if(r5 ==0) //_LBB46_30
{
	r5 = _ZN9b2Contact11s_registersE;
	r1 = (r1 * 48)&-1;
	r1 = (r5 + r1)&-1;
	r4 = (r4 * 12)&-1;
	r1 = (r1 + r4)&-1;
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r3;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r0 = heap32[(r2+16)];
	r0 = (r0 + -1)&-1;
	heap32[(r2+16)] = r0;
	return;
}
else{
	r0 = _2E_str2200;
	r1 = _2E_str1199;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 114;
	_assert(i7);
}
}
else{
	r0 = _2E_str198;
	r1 = _2E_str1199;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 103;
	_assert(i7);
}
}

function _ZN7b2World4StepEfii(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
	var r20;
	var r21;
	var r22;
	var r23;
	var r24;
	var r25;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
	var f16;
	var f17;
	var f18;
	var f19;
	var f20;
	var f21;
	var f22;
	var f23;
	var f24;
	var f25;
	var f26;
	var f27;
	var f28;
	var f29;
	var f30;
var __label__ = 0;
	i7 = sp + -944;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	heap32[(fp+-212)] = r0;
	r1 = r0 >> 2;
	heap32[(fp+-226)] = r1;
	r1 = heap32[(r1+25717)];
	r0 = (r0 + 102868)&-1;
	r2 = r1 & 1;
	if(r2 != 0) //_LBB47_2
{
	r1 = heap32[(fp+-212)];
	r1 = (r1 + 102872)&-1;
	heap32[(g0)] = r1;
	r2 = r0 >> 2;
	_ZN16b2ContactManager15FindNewContactsEv(i7);
	r1 = heap32[(r2)];
	r1 = r1 & -2;
	heap32[(r2)] = r1;
}
	r0 = r0 >> 2;
	heap32[(fp+-227)] = r0;
	r1 = r1 | 2;
	heap32[(r0)] = r1;
	r0 = heap32[(fp+-226)];
	f0 = heapFloat[(r0+25747)];
	f1 =       0.01666666753590107;
	heapFloat[(fp+-197)] = f1;
	r1 = heap32[(fp+-212)];
	r2 = (r1 + 102988)&-1;
	heap32[(fp+-228)] = r2;
	f0 = f0*f1;
	r2 = heapU8[r1+102992];
	heap32[(fp+-211)] = r2;
	r2 = (r1 + 102872)&-1;
	heap32[(fp+-219)] = r2;
	r2 = (r1 + 102932)&-1;
	heap32[(fp+-221)] = r2;
	r0 = heap32[(r0+25733)];
	r2 = (r1 + 102884)&-1;
	r3 = (r1 + 102876)&-1;
	r4 = (r1 + 102944)&-1;
	heap32[(fp+-206)] = r4;
	r1 = (r1 + 102940)&-1;
_4: while(true){
	if(r0 !=0) //_LBB47_4
{
	r4 = r0 >> 2;
	r5 = heap32[(r4+12)];
	r6 = heap32[(r4+13)];
	r7 = r5 >> 2;
	r8 = r6 >> 2;
	r9 = heap32[(r4+1)];
	r10 = heap32[(r4+14)];
	r11 = heap32[(r4+15)];
	r12 = heap32[(r7+2)];
	r13 = heap32[(r8+2)];
	r14 = r9 & 8;
_7: do {
if(!(r14 ==0)) //_LBB47_19
{
	r14 = r13 >> 2;
	r14 = heap32[(r14)];
	if(r14 ==2) //_LBB47_7
{
__label__ = 6;
}
else{
	r14 = r12 >> 2;
	r14 = heap32[(r14)];
	if(r14 !=2) //_LBB47_12
{
__label__ = 11;
}
else{
__label__ = 6;
}
}
_11: do {
switch(__label__ ){//multiple entries
case 6: 
	r14 = (r13 + 108)&-1;
_13: while(true){
	r14 = r14 >> 2;
	r14 = heap32[(r14)];
	if(r14 ==0) //_LBB47_13
{
break _13;
}
else{
	r15 = r14 >> 2;
	r16 = heap32[(r15)];
if(!(r16 !=r12)) //_LBB47_10
{
	r15 = heap32[(r15+1)];
	r15 = heapU8[r15+61];
	if(r15 ==0) //_LBB47_12
{
break _11;
}
}
	r14 = (r14 + 12)&-1;
}
}
	r14 = r1 >> 2;
	r14 = heap32[(r14)];
	if(r14 !=0) //_LBB47_15
{
	r9 = r14 >> 2;
	r9 = heap32[(r9)];
	r9 = r9 >> 2;
	r9 = heap32[(r9+2)];
	heap32[(g0)] = r14;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r6;
	__FUNCTION_TABLE__[(r9)>>2](i7);
	r9 = r_g0;
	if(r9 ==0) //_LBB47_18
{
	r4 = heap32[(r4+3)];
	r7 = heap32[(fp+-219)];
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r0;
	_ZN16b2ContactManager7DestroyEP9b2Contact(i7);
	r0 = r4;
continue _4;
}
else{
	r9 = heap32[(r4+1)];
}
}
	r5 = r9 & -9;
	heap32[(r4+1)] = r5;
break _7;
break;
}
} while(0);
	r4 = heap32[(r4+3)];
	r5 = heap32[(fp+-219)];
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r0;
	_ZN16b2ContactManager7DestroyEP9b2Contact(i7);
	r0 = r4;
continue _4;
}
} while(0);
	r5 = heapU8[r12+4];
	r5 = r5 & 2;
	if(r5 ==0) //_LBB47_22
{
__label__ = 20;
}
else{
	r5 = r12 >> 2;
	r5 = heap32[(r5)];
	if(r5 ==0) //_LBB47_22
{
__label__ = 20;
}
else{
	r5 = 0;
__label__ = 21;
}
}
switch(__label__ ){//multiple entries
case 20: 
	r5 = 1;
break;
}
	r6 = heapU8[r13+4];
	r6 = r6 & 2;
	if(r6 ==0) //_LBB47_26
{
	r5 = r5 & 255;
	if(r5 ==0) //_LBB47_28
{
__label__ = 26;
}
else{
__label__ = 25;
}
}
else{
	r6 = r13 >> 2;
	r6 = heap32[(r6)];
	if(r6 !=0) //_LBB47_28
{
__label__ = 26;
}
else{
	r5 = r5 & 255;
	if(r5 ==0) //_LBB47_28
{
__label__ = 26;
}
else{
__label__ = 25;
}
}
}
switch(__label__ ){//multiple entries
case 26: 
	r5 = heap32[(r7+6)];
	r6 = (r10 * 28)&-1;
	r5 = (r5 + r6)&-1;
	r5 = r5 >> 2;
	r5 = heap32[(r5+6)];
	if(r5 <0) //_LBB47_30
{
__label__ = 28;
break _4;
}
else{
	r6 = r2 >> 2;
	r6 = heap32[(r6)];
	if(r6 >r5) //_LBB47_31
{
	r7 = heap32[(r8+6)];
	r8 = (r11 * 28)&-1;
	r7 = (r7 + r8)&-1;
	r7 = r7 >> 2;
	r7 = heap32[(r7+6)];
	if(r7 <0) //_LBB47_33
{
__label__ = 28;
break _4;
}
else{
	if(r6 >r7) //_LBB47_34
{
	r6 = r3 >> 2;
	r6 = heap32[(r6)];
	r7 = (r7 * 36)&-1;
	r5 = (r5 * 36)&-1;
	r7 = (r6 + r7)&-1;
	r5 = (r6 + r5)&-1;
	r6 = r7 >> 2;
	r5 = r5 >> 2;
	f1 = heapFloat[(r6)];
	f2 = heapFloat[(r5+2)];
	f1 = f1-f2;
	f2 =                         0;
if(!(f1 >f2)) //_LBB47_38
{
	f1 = heapFloat[(r6+1)];
	f3 = heapFloat[(r5+3)];
	f1 = f1-f3;
if(!(f1 >f2)) //_LBB47_38
{
	f1 = heapFloat[(r5)];
	f3 = heapFloat[(r6+2)];
	f1 = f1-f3;
if(!(f1 >f2)) //_LBB47_38
{
	f1 = heapFloat[(r5+1)];
	f3 = heapFloat[(r6+3)];
	f1 = f1-f3;
	if(f1 <=f2) //_LBB47_39
{
	r5 = heap32[(fp+-206)];
	r5 = r5 >> 2;
	r5 = heap32[(r5)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r5;
	_ZN9b2Contact6UpdateEP17b2ContactListener(i7);
	r0 = heap32[(r4+3)];
continue _4;
}
}
}
}
	r4 = heap32[(r4+3)];
	r5 = heap32[(fp+-219)];
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r0;
	_ZN16b2ContactManager7DestroyEP9b2Contact(i7);
	r0 = r4;
continue _4;
}
else{
__label__ = 28;
break _4;
}
}
}
else{
__label__ = 28;
break _4;
}
}
break;
case 25: 
	r0 = heap32[(r4+3)];
continue _4;
break;
}
}
else{
__label__ = 38;
break _4;
}
}
switch(__label__ ){//multiple entries
case 28: 
	r0 = _2E_str27;
	r1 = _2E_str1109;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 159;
	_assert(i7);
break;
case 38: 
	r0 = heap32[(fp+-226)];
	heap32[(r0+25750)] = 0;
	r0 = heap32[(fp+-212)];
	r0 = heapU8[r0+102995];
if(!(r0 ==0)) //_LBB47_191
{
	r0 = heap32[(fp+-226)];
	heap32[(r0+25752)] = 0;
	heap32[(r0+25753)] = 0;
	heap32[(r0+25754)] = 0;
	r1 = heap32[(fp+-206)];
	r1 = r1 >> 2;
	r2 = heap32[(r0+25740)];
	r3 = heap32[(r0+25741)];
	r4 = heap32[(r0+25734)];
	r1 = heap32[(r1)];
	heap32[(fp+-200)] = r1;
	r1 = heap32[(fp+-212)];
	r1 = (r1 + 68)&-1;
	heap32[(fp+-205)] = r1;
	r5 = r2 << 2;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r5;
	_ZN16b2StackAllocator8AllocateEi(i7);
	r5 = r_g0;
	r6 = r4 << 2;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r6;
	_ZN16b2StackAllocator8AllocateEi(i7);
	r6 = r_g0;
	r7 = r3 << 2;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r7;
	_ZN16b2StackAllocator8AllocateEi(i7);
	r7 = r_g0;
	r8 = (r2 * 12)&-1;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r8;
	_ZN16b2StackAllocator8AllocateEi(i7);
	heap32[(fp+-198)] = r_g0;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r8;
	_ZN16b2StackAllocator8AllocateEi(i7);
	r1 = r_g0;
	r0 = heap32[(r0+25738)];
_56: do {
if(!(r0 ==0)) //_LBB47_44
{
_57: while(true){
	r8 = heapU16[(r0+4)>>1];
	r8 = r8 & 65534;
	r9 = r0 >> 2;
	heap16[(r0+4)>>1] = r8;
	r0 = heap32[(r9+24)];
if(!(r0 !=0)) //_LBB47_43
{
break _56;
}
}
}
} while(0);
	r0 = heap32[(fp+-221)];
	r0 = r0 >> 2;
	r0 = heap32[(r0)];
_60: do {
if(!(r0 ==0)) //_LBB47_46
{
_61: while(true){
	r0 = r0 >> 2;
	r8 = heap32[(r0+1)];
	r8 = r8 & -2;
	heap32[(r0+1)] = r8;
	r0 = heap32[(r0+3)];
if(!(r0 !=0)) //_LBB47_45
{
break _60;
}
}
}
} while(0);
	r0 = heap32[(fp+-226)];
	r0 = heap32[(r0+25739)];
_64: do {
if(!(r0 ==0)) //_LBB47_49
{
	r8 = 0;
_66: while(true){
	r9 = r0 >> 2;
	heap8[r0+60] = r8;
	r0 = heap32[(r9+3)];
if(!(r0 !=0)) //_LBB47_48
{
break _64;
}
}
}
} while(0);
	r0 = heap32[(fp+-212)];
	r8 = (r0 + 103008)&-1;
	heap32[(fp+-207)] = r8;
	r8 = (r0 + 103012)&-1;
	heap32[(fp+-208)] = r8;
	r8 = (r0 + 103016)&-1;
	heap32[(fp+-209)] = r8;
	r8 = (r0 + 102960)&-1;
	r9 = (r0 + 102952)&-1;
	heap32[(fp+-213)] = r9;
	r8 = r8 >> 2;
	r8 = heap32[(r8)];
	r10 = r8 << 2;
	r11 = heap32[(fp+-205)];
	heap32[(g0)] = r11;
	heap32[(g0+1)] = r10;
	r10 = (r0 + 102976)&-1;
	heap32[(fp+-210)] = r10;
	r10 = (r0 + 102972)&-1;
	heap32[(fp+-201)] = r10;
	r0 = (r0 + 102968)&-1;
	heap32[(fp+-202)] = r0;
	_ZN16b2StackAllocator8AllocateEi(i7);
	r0 = r_g0;
_69: while(true){
	r9 = r9 >> 2;
	r9 = heap32[(r9)];
	heap32[(fp+-203)] = r9;
	if(r9 !=0) //_LBB47_50
{
	r9 = heap32[(fp+-203)];
	r9 = heapU16[(r9+4)>>1];
	r10 = r9 & 1;
_72: do {
if(!(r10 != 0)) //_LBB47_183
{
	r10 = r9 & 2;
	r10 = r10 & 65535;
if(!(r10 ==0)) //_LBB47_183
{
	r9 = r9 & 32;
	r9 = r9 & 65535;
if(!(r9 ==0)) //_LBB47_183
{
	r9 = heap32[(fp+-203)];
	r9 = r9 >> 2;
	r9 = heap32[(r9)];
if(!(r9 ==0)) //_LBB47_183
{
	r9 = r0 >> 2;
	r10 = heap32[(fp+-203)];
	heap32[(r9)] = r10;
	r9 = heapU16[(r10+4)>>1];
	r11 = 0;
	r12 = 1;
	r9 = r9 | 1;
	heap16[(r10+4)>>1] = r9;
	r9 = r11;
	r10 = r11;
_77: while(true){
	if(r12 >0) //_LBB47_55
{
	r13 = r12 << 2;
	r13 = (r0 + r13)&-1;
	r13 = r13 >> 2;
	r13 = heap32[(r13+-1)];
	r14 = heapU8[r13+4];
	r14 = r14 & 32;
	if(r14 !=0) //_LBB47_57
{
	if(r11 <r2) //_LBB47_59
{
	r14 = r11 << 2;
	r14 = (r5 + r14)&-1;
	r15 = r13 >> 2;
	r14 = r14 >> 2;
	heap32[(r15+2)] = r11;
	heap32[(r14)] = r13;
	r14 = heapU16[(r13+4)>>1];
	r16 = r14 & 2;
if(!(r16 !=0)) //_LBB47_61
{
	r14 = r14 | 2;
	heap16[(r13+4)>>1] = r14;
	heap32[(r15+36)] = 0;
}
	r12 = (r12 + -1)&-1;
	r11 = (r11 + 1)&-1;
	r14 = heap32[(r15)];
if(!(r14 ==0)) //_LBB47_91
{
	r14 = (r13 + 112)&-1;
_86: while(true){
	r14 = r14 >> 2;
	r14 = heap32[(r14)];
	if(r14 !=0) //_LBB47_63
{
	r15 = r14 >> 2;
	r16 = heap32[(r15+1)];
	r17 = r16 >> 2;
	r18 = heap32[(r17+1)];
	r19 = r18 & 1;
if(!(r19 != 0)) //_LBB47_66
{
	r19 = r18 & 4;
if(!(r19 ==0)) //_LBB47_66
{
	r18 = r18 & 2;
	if(r18 !=0) //_LBB47_67
{
	r18 = heap32[(r17+12)];
	r18 = heapU8[r18+38];
if(!(r18 !=0)) //_LBB47_66
{
	r18 = heap32[(r17+13)];
	r18 = heapU8[r18+38];
if(!(r18 !=0)) //_LBB47_66
{
	if(r10 <r4) //_LBB47_71
{
	r18 = r10 << 2;
	r18 = (r6 + r18)&-1;
	r18 = r18 >> 2;
	heap32[(r18)] = r16;
	r16 = heap32[(r17+1)];
	r16 = r16 | 1;
	heap32[(r17+1)] = r16;
	r15 = heap32[(r15)];
	r10 = (r10 + 1)&-1;
	r16 = heapU8[r15+4];
	r16 = r16 & 1;
	if(r16 ==0) //_LBB47_73
{
	if(r12 <r8) //_LBB47_75
{
	r16 = r12 << 2;
	r16 = (r0 + r16)&-1;
	r16 = r16 >> 2;
	heap32[(r16)] = r15;
	r16 = heapU16[(r15+4)>>1];
	r12 = (r12 + 1)&-1;
	r16 = r16 | 1;
	heap16[(r15+4)>>1] = r16;
}
else{
__label__ = 69;
break _69;
}
}
}
else{
__label__ = 66;
break _69;
}
}
}
}
}
}
	r14 = (r14 + 12)&-1;
}
else{
break _86;
}
}
	r13 = (r13 + 108)&-1;
_100: while(true){
	r13 = r13 >> 2;
	r13 = heap32[(r13)];
	if(r13 !=0) //_LBB47_79
{
	r14 = r13 >> 2;
	r15 = heap32[(r14+1)];
	r16 = heapU8[r15+60];
	if(r16 ==0) //_LBB47_81
{
	r16 = heap32[(r14)];
	r17 = heapU8[r16+4];
	r17 = r17 & 32;
if(!(r17 ==0)) //_LBB47_80
{
	if(r9 <r3) //_LBB47_84
{
	r17 = r9 << 2;
	r17 = (r7 + r17)&-1;
	r17 = r17 >> 2;
	heap32[(r17)] = r15;
	r14 = heap32[(r14+1)];
	r15 = 1;
	r9 = (r9 + 1)&-1;
	heap8[r14+60] = r15;
	r14 = heapU8[r16+4];
	r14 = r14 & 1;
	if(r14 ==0) //_LBB47_86
{
	if(r12 <r8) //_LBB47_88
{
	r14 = r12 << 2;
	r14 = (r0 + r14)&-1;
	r14 = r14 >> 2;
	heap32[(r14)] = r16;
	r14 = heapU16[(r16+4)>>1];
	r12 = (r12 + 1)&-1;
	r14 = r14 | 1;
	heap16[(r16+4)>>1] = r14;
}
else{
__label__ = 80;
break _69;
}
}
}
else{
__label__ = 77;
break _69;
}
}
}
	r13 = (r13 + 12)&-1;
}
else{
continue _77;
}
}
}
}
else{
__label__ = 55;
break _69;
}
}
else{
__label__ = 53;
break _69;
}
}
else{
break _77;
}
}
	r12 = heap32[(fp+-210)];
	r12 = heapU8[r12];
	heap32[(fp+-204)] = r12;
_111: do {
if(!(r11 <1)) //_LBB47_98
{
	r12 = 0;
_113: while(true){
	r13 = r12 << 2;
	r13 = (r5 + r13)&-1;
	r13 = r13 >> 2;
	r13 = heap32[(r13)];
	r13 = r13 >> 2;
	f1 = heapFloat[(r13+14)];
	f2 = heapFloat[(r13+12)];
	f3 = heapFloat[(r13+11)];
	f4 = heapFloat[(r13+16)];
	f5 = heapFloat[(r13+17)];
	f6 = heapFloat[(r13+18)];
	heapFloat[(r13+9)] = f3;
	r14 = (r12 + 1)&-1;
	heapFloat[(r13+10)] = f2;
	heapFloat[(r13+13)] = f1;
	r15 = heap32[(r13)];
	if(r15 ==2) //_LBB47_96
{
	r15 = heap32[(fp+-202)];
	r15 = r15 >> 2;
	r16 = heap32[(fp+-201)];
	r16 = r16 >> 2;
	f7 = heapFloat[(r15)];
	f8 = heapFloat[(r13+35)];
	f9 = heapFloat[(r16)];
	f10 = heapFloat[(r13+19)];
	f11 = heapFloat[(r13+30)];
	f12 = heapFloat[(r13+20)];
	f13 = heapFloat[(r13+33)];
	f14 = heapFloat[(r13+34)];
	f15 = heapFloat[(r13+32)];
	f7 = f7*f8;
	f10 = f10*f11;
	f8 = f9*f8;
	f9 = f12*f11;
	f11 = heapFloat[(fp+-197)];
	f12 = f13*f11;
	f13 =                         1;
	f14 = f14*f11;
	f7 = f7+f10;
	f8 = f8+f9;
	f9 = f13-f12;
	f10 = f13-f14;
	f12 = f15*f11;
	f14 = heapFloat[(r13+21)];
	f7 = f7*f11;
	f8 = f8*f11;
	f9 = f9 < f13 ? f9 : f13; 
	f11 =                         0;
	f10 = f10 < f13 ? f10 : f13; 
	f12 = f12*f14;
	f4 = f4+f7;
	f7 = f9 < f11 ? f11 : f9; 
	f5 = f5+f8;
	f8 = f10 < f11 ? f11 : f10; 
	f6 = f12+f6;
	f4 = f4*f7;
	f5 = f5*f7;
	f6 = f8*f6;
}
	r12 = (r12 * 3)&-1;
	r12 = r12 << 2;
	r13 = (r1 + r12)&-1;
	r13 = r13 >> 2;
	heapFloat[(r13)] = f3;
	r15 = heap32[(fp+-198)];
	r12 = (r15 + r12)&-1;
	heapFloat[(r13+1)] = f2;
	r12 = r12 >> 2;
	heapFloat[(r13+2)] = f1;
	heapFloat[(r12)] = f4;
	heapFloat[(r12+1)] = f5;
	heapFloat[(r12+2)] = f6;
	r12 = r14;
if(!(r11 >r14)) //_LBB47_94
{
break _111;
}
}
}
} while(0);
	r12 = sp + -680; 
	r13 = r12 >> 2;
	heap32[(fp+-170)] = 1015580809;
	heap32[(r13+1)] = 1114636287;
	heapFloat[(r13+2)] = f0;
	heap32[(r13+3)] = 3;
	heap32[(r13+4)] = 3;
	r14 = heap32[(fp+-211)];
	heap8[sp+-660] = r14;
	heap32[(r13+6)] = r1;
	r15 = sp + -728; 
	r16 = heap32[(fp+-198)];
	heap32[(r13+7)] = r16;
	r13 = r15 >> 2;
	heap32[(fp+-182)] = 1015580809;
	heap32[(r13+1)] = 1114636287;
	heapFloat[(r13+2)] = f0;
	heap32[(r13+3)] = 3;
	heap32[(r13+4)] = 3;
	heap8[sp+-708] = r14;
	heap32[(r13+6)] = r6;
	heap32[(r13+7)] = r10;
	heap32[(r13+8)] = r1;
	heap32[(r13+9)] = r16;
	r16 = heap32[(fp+-205)];
	heap32[(r13+10)] = r16;
	r13 = sp + -784; 
	heap32[(g0)] = r13;
	heap32[(g0+1)] = r15;
	_ZN15b2ContactSolverC1EP18b2ContactSolverDef(i7);
	heap32[(g0)] = r13;
	r14 = r14 & 255;
	_ZN15b2ContactSolver29InitializeVelocityConstraintsEv(i7);
_119: do {
if(!(r14 ==0)) //_LBB47_106
{
	r14 = r13 >> 2;
	r15 = heap32[(r14+12)];
if(!(r15 <1)) //_LBB47_106
{
	r16 = heap32[(r14+10)];
	r14 = heap32[(r14+7)];
	r17 = (r16 + 12)&-1;
	r18 = 0;
_122: while(true){
	r19 = (r18 * 38)&-1;
	r19 = r19 << 2;
	r19 = (r16 + r19)&-1;
	r19 = r19 >> 2;
	r20 = heap32[(r19+28)];
	r21 = heap32[(r19+29)];
	r20 = (r20 * 12)&-1;
	r21 = (r21 * 12)&-1;
	r20 = (r14 + r20)&-1;
	r21 = (r14 + r21)&-1;
	r20 = r20 >> 2;
	r21 = r21 >> 2;
	r22 = heap32[(r19+36)];
	r18 = (r18 + 1)&-1;
	f1 = heapFloat[(r20)];
	f2 = heapFloat[(r20+1)];
	f3 = heapFloat[(r20+2)];
	f4 = heapFloat[(r21)];
	f5 = heapFloat[(r21+1)];
	f6 = heapFloat[(r21+2)];
	if(r22 >0) //_LBB47_103
{
	f7 = heapFloat[(r19+18)];
	f8 = heapFloat[(r19+30)];
	f9 = heapFloat[(r19+32)];
	f10 = heapFloat[(r19+31)];
	f11 = heapFloat[(r19+33)];
	f12 = heapFloat[(r19+19)];
	f13 = -f7;
	r19 = r17;
_126: while(true){
	r23 = r19 >> 2;
	f14 = heapFloat[(r23+1)];
	f15 = heapFloat[(r23+2)];
	f16 = f7*f14;
	f17 = f12*f15;
	f14 = f12*f14;
	f15 = f13*f15;
	f18 = heapFloat[(r23+-3)];
	f14 = f14+f15;
	f15 = heapFloat[(r23+-1)];
	f19 = heapFloat[(r23+-2)];
	f16 = f16+f17;
	f17 = heapFloat[(r23)];
	f18 = f18*f14;
	f19 = f19*f16;
	f15 = f15*f14;
	f17 = f17*f16;
	f18 = f18-f19;
	f15 = f15-f17;
	f17 = f18*f9;
	f18 = f16*f8;
	f19 = f14*f8;
	f15 = f15*f11;
	f16 = f16*f10;
	f14 = f14*f10;
	r22 = (r22 + -1)&-1;
	f3 = f3-f17;
	f1 = f1-f18;
	f2 = f2-f19;
	f6 = f15+f6;
	f4 = f4+f16;
	f5 = f5+f14;
	r19 = (r19 + 36)&-1;
if(!(r22 !=0)) //_LBB47_104
{
break _126;
}
}
}
	heapFloat[(r20)] = f1;
	heapFloat[(r20+1)] = f2;
	heapFloat[(r20+2)] = f3;
	heapFloat[(r21)] = f4;
	r17 = (r17 + 152)&-1;
	heapFloat[(r21+1)] = f5;
	heapFloat[(r21+2)] = f6;
if(!(r15 >r18)) //_LBB47_101
{
break _119;
}
}
}
}
} while(0);
_130: do {
	if(r9 >0) //_LBB47_108
{
	r14 = 0;
_132: while(true){
	r15 = r14 << 2;
	r15 = (r7 + r15)&-1;
	r15 = r15 >> 2;
	r15 = heap32[(r15)];
	r16 = r15 >> 2;
	r16 = heap32[(r16)];
	r16 = r16 >> 2;
	r16 = heap32[(r16+7)];
	heap32[(g0)] = r15;
	heap32[(g0+1)] = r12;
	r14 = (r14 + 1)&-1;
	__FUNCTION_TABLE__[(r16)>>2](i7);
if(!(r9 >r14)) //_LBB47_109
{
break _130;
}
}
}
} while(0);
	r14 = 0;
_135: while(true){
if(!(r9 <1)) //_LBB47_111
{
	r15 = 0;
_139: while(true){
	r16 = r15 << 2;
	r16 = (r7 + r16)&-1;
	r16 = r16 >> 2;
	r16 = heap32[(r16)];
	r17 = r16 >> 2;
	r17 = heap32[(r17)];
	r17 = r17 >> 2;
	r17 = heap32[(r17+8)];
	heap32[(g0)] = r16;
	heap32[(g0+1)] = r12;
	r15 = (r15 + 1)&-1;
	__FUNCTION_TABLE__[(r17)>>2](i7);
if(!(r9 >r15)) //_LBB47_110
{
break _139;
}
}
}
	r14 = (r14 + 1)&-1;
	heap32[(g0)] = r13;
	_ZN15b2ContactSolver24SolveVelocityConstraintsEv(i7);
	if(r14 >2) //_LBB47_114
{
break _135;
}
}
	r13 = r13 >> 2;
	heap32[(fp+-199)] = r13;
	r13 = heap32[(r13+12)];
_143: do {
if(!(r13 <1)) //_LBB47_120
{
	r14 = heap32[(fp+-199)];
	r15 = heap32[(r14+10)];
	r14 = heap32[(r14+11)];
	r15 = (r15 + 148)&-1;
	r16 = 0;
_145: while(true){
	r17 = r15 >> 2;
	r18 = heap32[(r17+-1)];
if(!(r18 <1)) //_LBB47_119
{
	r18 = heap32[(r17)];
	r18 = r18 << 2;
	r18 = (r14 + r18)&-1;
	r18 = r18 >> 2;
	r18 = heap32[(r18)];
	r19 = 0;
_149: while(true){
	r20 = (r19 * 5)&-1;
	r21 = (r19 * 9)&-1;
	r21 = r21 << 2;
	r20 = r20 << 2;
	r20 = (r18 + r20)&-1;
	r21 = (r15 + r21)&-1;
	r20 = r20 >> 2;
	r21 = r21 >> 2;
	r19 = (r19 + 1)&-1;
	heap32[(r20+18)] = heap32[(r21+-33)];
	heap32[(r20+19)] = heap32[(r21+-32)];
	r20 = heap32[(r17+-1)];
if(!(r20 >r19)) //_LBB47_118
{
break _149;
}
}
}
	r16 = (r16 + 1)&-1;
	r15 = (r15 + 152)&-1;
if(!(r13 >r16)) //_LBB47_116
{
break _143;
}
}
}
} while(0);
_153: do {
	if(r11 >0) //_LBB47_122
{
	r14 = 0;
_155: while(true){
	r15 = (r14 * 3)&-1;
	r16 = r15 << 2;
	r17 = heap32[(fp+-198)];
	r17 = (r17 + r16)&-1;
	r17 = r17 >> 2;
	f1 = heapFloat[(r17)];
	f2 = heapFloat[(r17+1)];
	f3 = heapFloat[(fp+-197)];
	f4 = f1*f3;
	f3 = f2*f3;
	r16 = (r1 + r16)&-1;
	r16 = r16 >> 2;
	f4 = f4*f4;
	f3 = f3*f3;
	f3 = f4+f3;
	r14 = (r14 + 1)&-1;
	f4 = heapFloat[(r16)];
	f5 = heapFloat[(r16+1)];
	f6 = heapFloat[(r16+2)];
	f7 = heapFloat[(r17+2)];
	f8 =                         4;
	if(f3 >f8) //_LBB47_125
{
	heapFloat[(g0)] = f3;
	f3 =                         2;
	sqrtf(i7);
	f3 = f3/f_g0;
	f1 = f1*f3;
	f2 = f2*f3;
}
	f3 = heapFloat[(fp+-197)];
	f3 = f7*f3;
	f8 = f3*f3;
	f9 =        2.4674012660980225;
	if(f8 >f9) //_LBB47_128
{
	f8 =                         0;
	if(f3 <=f8) //_LBB47_130
{
	f3 = -f3;
}
	f8 =        1.5707963705062866;
	f3 = f8/f3;
	f7 = f7*f3;
}
	r16 = r15 << 2;
	r18 = r15 << 2;
	r16 = (r1 + r16)&-1;
	f3 = heapFloat[(fp+-197)];
	f8 = f1*f3;
	r19 = r15 << 2;
	r18 = (r1 + r18)&-1;
	f9 = f2*f3;
	r16 = r16 >> 2;
	f4 = f4+f8;
	r19 = (r1 + r19)&-1;
	r20 = r15 << 2;
	f3 = f7*f3;
	r18 = r18 >> 2;
	f5 = f5+f9;
	heapFloat[(r16)] = f4;
	r15 = r15 << 2;
	r16 = heap32[(fp+-198)];
	r20 = (r16 + r20)&-1;
	r19 = r19 >> 2;
	f3 = f3+f6;
	heapFloat[(r18+1)] = f5;
	r15 = (r16 + r15)&-1;
	r16 = r20 >> 2;
	heapFloat[(r19+2)] = f3;
	r15 = r15 >> 2;
	heapFloat[(r16)] = f1;
	heapFloat[(r15+1)] = f2;
	heapFloat[(r17+2)] = f7;
if(!(r11 >r14)) //_LBB47_123
{
break _153;
}
}
}
} while(0);
	r14 = -1;
_167: while(true){
	r14 = (r14 + 1)&-1;
	if(r14 <3) //_LBB47_133
{
_170: do {
	if(r13 >0) //_LBB47_135
{
	r15 = heap32[(fp+-199)];
	r16 = heap32[(r15+9)];
	r15 = heap32[(r15+6)];
	f1 =                         0;
	r17 = 0;
_172: while(true){
	r18 = r16 >> 2;
	r19 = heap32[(r18+8)];
	r20 = heap32[(r18+9)];
	r19 = (r19 * 12)&-1;
	r20 = (r20 * 12)&-1;
	r19 = (r15 + r19)&-1;
	r20 = (r15 + r20)&-1;
	r19 = r19 >> 2;
	r20 = r20 >> 2;
	r21 = heap32[(r18+21)];
	r17 = (r17 + 1)&-1;
	f2 = heapFloat[(r19)];
	f3 = heapFloat[(r19+1)];
	f4 = heapFloat[(r19+2)];
	f5 = heapFloat[(r20)];
	f6 = heapFloat[(r20+1)];
	f7 = heapFloat[(r20+2)];
	if(r21 >0) //_LBB47_138
{
	f8 = heapFloat[(r18+12)];
	f9 = heapFloat[(r18+13)];
	f10 = heapFloat[(r18+10)];
	f11 = heapFloat[(r18+16)];
	f12 = heapFloat[(r18+14)];
	f13 = heapFloat[(r18+15)];
	f14 = heapFloat[(r18+11)];
	f15 = heapFloat[(r18+17)];
	f16 = f10+f14;
	r18 = 0;
_176: while(true){
	r22 = sp + -584; 
	heapFloat[(g0)] = f4;
	r23 = r22 >> 2;
	sinf(i7);
	f17 = f_g0;
	heapFloat[(r23+2)] = f17;
	heapFloat[(g0)] = f4;
	cosf(i7);
	f18 = f_g0;
	heapFloat[(r23+3)] = f18;
	r24 = sp + -600; 
	heapFloat[(g0)] = f7;
	r25 = r24 >> 2;
	sinf(i7);
	f19 = f_g0;
	heapFloat[(r25+2)] = f19;
	heapFloat[(g0)] = f7;
	f20 = f18*f8;
	f21 = f17*f9;
	cosf(i7);
	f17 = f17*f8;
	f18 = f18*f9;
	f20 = f20-f21;
	f21 = f_g0*f12;
	f23 = f19*f13;
	f17 = f17+f18;
	f18 = f2-f20;
	heapFloat[(r25+3)] = f_g0;
	f19 = f19*f12;
	f20 = f_g0*f13;
	f21 = f21-f23;
	f17 = f3-f17;
	heapFloat[(fp+-146)] = f18;
	f18 = f19+f20;
	f19 = f5-f21;
	heapFloat[(r23+1)] = f17;
	f17 = f6-f18;
	heapFloat[(fp+-150)] = f19;
	heapFloat[(r25+1)] = f17;
	r23 = sp + -624; 
	heap32[(g0)] = r23;
	heap32[(g0+1)] = r16;
	heap32[(g0+2)] = r22;
	heap32[(g0+3)] = r24;
	heap32[(g0+4)] = r18;
	_ZN24b2PositionSolverManifold10InitializeEP27b2ContactPositionConstraintRK11b2TransformS4_i(i7);
	r22 = r23 >> 2;
	f17 = heapFloat[(r22+3)];
	f18 = heapFloat[(r22+2)];
	f19 = heapFloat[(fp+-156)];
	f20 = f17-f3;
	f21 = heapFloat[(r22+1)];
	f22 = f18-f2;
	f17 = f17-f6;
	f18 = f18-f5;
	f23 = f22*f21;
	f24 = f20*f19;
	f23 = f23-f24;
	f24 = f18*f21;
	f25 = f17*f19;
	f26 = f11*f23;
	f24 = f24-f25;
	f25 = heapFloat[(r22+4)];
	f27 = f15*f24;
	f23 = f26*f23;
	f23 = f16+f23;
	f24 = f27*f24;
	f26 =                         0;
	f23 = f23+f24;
	f1 = f1 < f25 ? f1 : f25; 
	if(f23 >f26) //_LBB47_141
{
	f24 =      0.004999999888241291;
	f24 = f25+f24;
	f25 =       0.20000000298023224;
	f24 = f24*f25;
	f26 = f24 < f26 ? f24 : f26; 
	f24 =      -0.20000000298023224;
	f26 = f26 < f24 ? f24 : f26; 
	f26 = -f26;
	f26 = f26/f23;
}
	f21 = f21*f26;
	f19 = f19*f26;
	f22 = f22*f21;
	f20 = f20*f19;
	f18 = f18*f21;
	f17 = f17*f19;
	f20 = f22-f20;
	f17 = f18-f17;
	f18 = f19*f10;
	f22 = f21*f10;
	f20 = f20*f11;
	f19 = f19*f14;
	f21 = f21*f14;
	f17 = f17*f15;
	r18 = (r18 + 1)&-1;
	f2 = f2-f18;
	f3 = f3-f22;
	f4 = f4-f20;
	f5 = f5+f19;
	f6 = f6+f21;
	f7 = f17+f7;
if(!(r21 !=r18)) //_LBB47_139
{
break _176;
}
}
}
	heapFloat[(r19)] = f2;
	heapFloat[(r19+1)] = f3;
	heapFloat[(r19+2)] = f4;
	heapFloat[(r20)] = f5;
	r16 = (r16 + 88)&-1;
	heapFloat[(r20+1)] = f6;
	heapFloat[(r20+2)] = f7;
if(!(r13 >r17)) //_LBB47_136
{
break _170;
}
}
}
else{
	f1 =                         0;
}
} while(0);
_184: do {
	if(r9 >0) //_LBB47_146
{
	r16 = 0;
	r17 = 1;
	r18 = r16;
_186: while(true){
	r15 = r18 << 2;
	r15 = (r7 + r15)&-1;
	r15 = r15 >> 2;
	r15 = heap32[(r15)];
	r19 = r15 >> 2;
	r19 = heap32[(r19)];
	r19 = r19 >> 2;
	r19 = heap32[(r19+9)];
	heap32[(g0)] = r15;
	heap32[(g0+1)] = r12;
	r15 = r17 & 255;
	__FUNCTION_TABLE__[(r19)>>2](i7);
	r15 = r15 == r16;
	r17 = r_g0 == r16;
	r15 = r15 | r17;
	r17 = r15 & 1;
	r18 = (r18 + 1)&-1;
	r17 = r17 ^ 1;
if(!(r9 >r18)) //_LBB47_147
{
break _184;
}
}
}
else{
	r15 = 0;
}
} while(0);
	if(r15 != 0) //_LBB47_151
{
__label__ = 137;
}
else{
	f2 =     -0.014999999664723873;
	if(f1 <f2) //_LBB47_151
{
__label__ = 137;
}
else{
__label__ = 136;
break _167;
}
}
}
else{
__label__ = 138;
break _167;
}
}
switch(__label__ ){//multiple entries
case 138: 
	r9 = 0;
break;
case 136: 
	r9 = 1;
break;
}
_195: do {
if(!(r11 <1)) //_LBB47_156
{
	r12 = 0;
_197: while(true){
	r13 = (r12 * 3)&-1;
	r13 = r13 << 2;
	r14 = r12 << 2;
	r15 = (r1 + r13)&-1;
	r14 = (r5 + r14)&-1;
	r15 = r15 >> 2;
	r14 = r14 >> 2;
	r14 = heap32[(r14)];
	f1 = heapFloat[(r15+1)];
	r14 = r14 >> 2;
	heap32[(r14+11)] = heap32[(r15)];
	heapFloat[(r14+12)] = f1;
	f1 = heapFloat[(r15+2)];
	r15 = heap32[(fp+-198)];
	r13 = (r15 + r13)&-1;
	r13 = r13 >> 2;
	heapFloat[(r14+14)] = f1;
	f2 = heapFloat[(r13+1)];
	heap32[(r14+16)] = heap32[(r13)];
	heapFloat[(r14+17)] = f2;
	heap32[(r14+18)] = heap32[(r13+2)];
	heapFloat[(g0)] = f1;
	sinf(i7);
	heapFloat[(r14+5)] = f_g0;
	heapFloat[(g0)] = f1;
	cosf(i7);
	heapFloat[(r14+6)] = f_g0;
	f2 = heapFloat[(r14+7)];
	f3 = heapFloat[(r14+5)];
	f4 = heapFloat[(r14+8)];
	f5 = f_g0*f2;
	f6 = f3*f4;
	f2 = f3*f2;
	f1 = f_g0*f4;
	f3 = f5-f6;
	f4 = heapFloat[(r14+11)];
	f5 = heapFloat[(r14+12)];
	f1 = f2+f1;
	f2 = f4-f3;
	r12 = (r12 + 1)&-1;
	f1 = f5-f1;
	heapFloat[(r14+3)] = f2;
	heapFloat[(r14+4)] = f1;
if(!(r11 >r12)) //_LBB47_155
{
break _195;
}
}
}
} while(0);
	r12 = heap32[(fp+-199)];
	r12 = heap32[(r12+10)];
	r13 = heap32[(fp+-200)];
_200: do {
if(!(r13 ==0)) //_LBB47_163
{
if(!(r10 <1)) //_LBB47_163
{
	r13 = (r12 + 144)&-1;
	r14 = 0;
_203: while(true){
	r15 = r14 << 2;
	r15 = (r6 + r15)&-1;
	r16 = r13 >> 2;
	r15 = r15 >> 2;
	r16 = heap32[(r16)];
	r15 = heap32[(r15)];
	r17 = sp + -648; 
	r18 = r17 >> 2;
	heap32[(r18+4)] = r16;
if(!(r16 <1)) //_LBB47_162
{
	r18 = 0;
_207: while(true){
	r19 = (r18 * 9)&-1;
	r20 = r18 << 2;
	r19 = r19 << 2;
	r20 = (r17 + r20)&-1;
	r19 = (r13 + r19)&-1;
	r20 = r20 >> 2;
	r19 = r19 >> 2;
	r18 = (r18 + 1)&-1;
	heap32[(r20)] = heap32[(r19+-32)];
	heap32[(r20+2)] = heap32[(r19+-31)];
if(!(r18 <r16)) //_LBB47_161
{
break _207;
}
}
}
	r14 = (r14 + 1)&-1;
	r16 = heap32[(fp+-200)];
	r18 = r16 >> 2;
	r18 = heap32[(r18)];
	r18 = r18 >> 2;
	r18 = heap32[(r18+5)];
	heap32[(g0)] = r16;
	heap32[(g0+1)] = r15;
	heap32[(g0+2)] = r17;
	r13 = (r13 + 152)&-1;
	__FUNCTION_TABLE__[(r18)>>2](i7);
if(!(r10 >r14)) //_LBB47_159
{
break _200;
}
}
}
}
} while(0);
	r10 = heap32[(fp+-204)];
	r10 = r10 & 255;
_211: do {
if(!(r10 ==0)) //_LBB47_178
{
	r10 = 1;
	r10 = r11 < r10;
if(!(r10 != 0)) //_LBB47_178
{
	r10 = 0;
	f1 =   3.4028234663852886e+038;
_214: while(true){
	r13 = r10 << 2;
	r13 = (r5 + r13)&-1;
	r13 = r13 >> 2;
	r13 = heap32[(r13)];
	r10 = (r10 + 1)&-1;
	r14 = r13 >> 2;
	r15 = heap32[(r14)];
_216: do {
	if(r15 !=0) //_LBB47_168
{
	r13 = heapU16[(r13+4)>>1];
	r13 = r13 & 4;
if(!(r13 ==0)) //_LBB47_171
{
	f2 = heapFloat[(r14+18)];
	f2 = f2*f2;
	f3 =     0.0012184699298813939;
if(!(f2 >f3)) //_LBB47_171
{
	f2 = heapFloat[(r14+16)];
	f3 = heapFloat[(r14+17)];
	f2 = f2*f2;
	f3 = f3*f3;
	f2 = f2+f3;
	f3 =   9.9999997473787516e-005;
	if(f2 <=f3) //_LBB47_172
{
	f2 = heapFloat[(r14+36)];
	f3 = heapFloat[(fp+-197)];
	f2 = f2+f3;
	f1 = f1 < f2 ? f1 : f2; 
	heapFloat[(r14+36)] = f2;
break _216;
}
}
}
	f1 =                         0;
	heap32[(r14+36)] = 0;
}
} while(0);
if(!(r11 >r10)) //_LBB47_166
{
break _214;
}
}
	r9 = r9 & 255;
if(!(r9 ==0)) //_LBB47_178
{
	f2 =                       0.5;
if(!(f1 <f2)) //_LBB47_178
{
	r9 = 0;
_227: while(true){
	r10 = r9 << 2;
	r10 = (r5 + r10)&-1;
	r10 = r10 >> 2;
	r10 = heap32[(r10)];
	r13 = heapU16[(r10+4)>>1];
	r13 = r13 & 65533;
	r14 = r10 >> 2;
	heap16[(r10+4)>>1] = r13;
	heap32[(r14+36)] = 0;
	heap32[(r14+16)] = 0;
	heap32[(r14+17)] = 0;
	heap32[(r14+18)] = 0;
	heap32[(r14+19)] = 0;
	r9 = (r9 + 1)&-1;
	heap32[(r14+20)] = 0;
	heap32[(r14+21)] = 0;
if(!(r11 >r9)) //_LBB47_177
{
break _211;
}
}
}
}
}
}
} while(0);
	r9 = heap32[(fp+-199)];
	r10 = heap32[(r9+8)];
	heap32[(g0)] = r10;
	heap32[(g0+1)] = r12;
	_ZN16b2StackAllocator4FreeEPv(i7);
	r9 = heap32[(r9+9)];
	heap32[(g0)] = r10;
	heap32[(g0+1)] = r9;
	r9 = heap32[(fp+-207)];
	r9 = r9 >> 2;
	_ZN16b2StackAllocator4FreeEPv(i7);
	f1 =                         0;
	f2 = heapFloat[(r9)];
	f2 = f2+f1;
	r10 = heap32[(fp+-208)];
	r10 = r10 >> 2;
	heapFloat[(r9)] = f2;
	f2 = heapFloat[(r10)];
	f2 = f2+f1;
	r9 = heap32[(fp+-209)];
	r9 = r9 >> 2;
	heapFloat[(r10)] = f2;
	f2 = heapFloat[(r9)];
	f1 = f2+f1;
	heapFloat[(r9)] = f1;
if(!(r11 <1)) //_LBB47_183
{
	r9 = 0;
_231: while(true){
	r10 = r9 << 2;
	r10 = (r5 + r10)&-1;
	r10 = r10 >> 2;
	r10 = heap32[(r10)];
	r12 = r10 >> 2;
	r12 = heap32[(r12)];
if(!(r12 !=0)) //_LBB47_182
{
	r12 = heapU16[(r10+4)>>1];
	r12 = r12 & 65534;
	heap16[(r10+4)>>1] = r12;
}
	r9 = (r9 + 1)&-1;
if(!(r11 >r9)) //_LBB47_180
{
break _72;
}
}
}
}
}
}
}
} while(0);
	r9 = heap32[(fp+-203)];
	r9 = (r9 + 96)&-1;
}
else{
__label__ = 170;
break _69;
}
}
switch(__label__ ){//multiple entries
case 170: 
	r2 = heap32[(fp+-205)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	r0 = heap32[(fp+-213)];
	r0 = r0 >> 2;
	_ZN16b2StackAllocator4FreeEPv(i7);
	r0 = heap32[(r0)];
_239: do {
if(!(r0 ==0)) //_LBB47_190
{
_240: while(true){
	r2 = heapU16[(r0+4)>>1];
	r2 = r2 & 1;
if(!(r2 ==0)) //_LBB47_189
{
	r2 = r0 >> 2;
	r2 = heap32[(r2)];
if(!(r2 ==0)) //_LBB47_189
{
	heap32[(g0)] = r0;
	_ZN6b2Body19SynchronizeFixturesEv(i7);
}
}
	r0 = r0 >> 2;
	r0 = heap32[(r0+24)];
if(!(r0 !=0)) //_LBB47_186
{
break _239;
}
}
}
} while(0);
	r0 = heap32[(fp+-219)];
	heap32[(g0)] = r0;
	_ZN16b2ContactManager15FindNewContactsEv(i7);
	r0 = heap32[(fp+-226)];
	heap32[(r0+25755)] = 0;
	r2 = heap32[(fp+-205)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r1;
	_ZN16b2StackAllocator4FreeEPv(i7);
	heap32[(g0)] = r2;
	r1 = heap32[(fp+-198)];
	heap32[(g0+1)] = r1;
	_ZN16b2StackAllocator4FreeEPv(i7);
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r7;
	_ZN16b2StackAllocator4FreeEPv(i7);
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r6;
	_ZN16b2StackAllocator4FreeEPv(i7);
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r5;
	_ZN16b2StackAllocator4FreeEPv(i7);
	heap32[(r0+25751)] = 0;
break;
case 69: 
	r9 = _2E_str25179;
	r14 = _2E_str13169;
	heap32[(g0)] = r9;
	heap32[(g0+1)] = r14;
	heap32[(g0+2)] = 495;
	_assert(i7);
break;
case 66: 
	r9 = _2E_str18172;
	r14 = _2E_str19173;
	heap32[(g0)] = r9;
	heap32[(g0+1)] = r14;
	heap32[(g0+2)] = 62;
	_assert(i7);
break;
case 80: 
	r9 = _2E_str25179;
	r13 = _2E_str13169;
	heap32[(g0)] = r9;
	heap32[(g0+1)] = r13;
	heap32[(g0+2)] = 524;
	_assert(i7);
break;
case 77: 
	r9 = _2E_str21175;
	r13 = _2E_str19173;
	heap32[(g0)] = r9;
	heap32[(g0+1)] = r13;
	heap32[(g0+2)] = 68;
	_assert(i7);
break;
case 55: 
	r9 = _2E_str20174;
	r0 = _2E_str19173;
	heap32[(g0)] = r9;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 54;
	_assert(i7);
break;
case 53: 
	r9 = _2E_str24178;
	r0 = _2E_str13169;
	heap32[(g0)] = r9;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 445;
	_assert(i7);
break;
}
}
	r0 = heap32[(fp+-212)];
	r0 = heapU8[r0+102993];
if(!(r0 ==0)) //_LBB47_437
{
	r0 = heap32[(fp+-212)];
	r1 = (r0 + 102995)&-1;
	heap32[(fp+-230)] = r1;
	r2 = heap32[(fp+-206)];
	r2 = r2 >> 2;
	r3 = heap32[(r2)];
	r0 = (r0 + 68)&-1;
	heap32[(fp+-222)] = r0;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 256;
	_ZN16b2StackAllocator8AllocateEi(i7);
	r4 = r_g0;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 128;
	_ZN16b2StackAllocator8AllocateEi(i7);
	r5 = r_g0;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 0;
	_ZN16b2StackAllocator8AllocateEi(i7);
	heap32[(fp+-229)] = r_g0;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 768;
	_ZN16b2StackAllocator8AllocateEi(i7);
	r6 = r_g0;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 768;
	_ZN16b2StackAllocator8AllocateEi(i7);
	r0 = r_g0;
	r1 = heapU8[r1];
_256: do {
if(!(r1 ==0)) //_LBB47_197
{
	r1 = heap32[(fp+-226)];
	r1 = heap32[(r1+25738)];
_258: do {
if(!(r1 ==0)) //_LBB47_195
{
_259: while(true){
	r7 = heapU16[(r1+4)>>1];
	r7 = r7 & 65534;
	r8 = r1 >> 2;
	heap16[(r1+4)>>1] = r7;
	heap32[(r8+15)] = 0;
	r1 = heap32[(r8+24)];
if(!(r1 !=0)) //_LBB47_194
{
break _258;
}
}
}
} while(0);
	r1 = heap32[(fp+-221)];
	r1 = r1 >> 2;
	r1 = heap32[(r1)];
if(!(r1 ==0)) //_LBB47_197
{
__label__ = 181; //SET chanka
_262: while(true){
	r1 = r1 >> 2;
	r7 = heap32[(r1+1)];
	r7 = r7 & -34;
	heap32[(r1+1)] = r7;
	heap32[(r1+32)] = 0;
	heap32[(r1+33)] = 1065353216;
	r1 = heap32[(r1+3)];
if(!(r1 !=0)) //_LBB47_196
{
break _256;
}
}
}
}
} while(0);
	r1 = sp + -568; 
	r7 = (r1 + 28)&-1;
	heap32[(fp+-214)] = r7;
	r7 = (r1 + 56)&-1;
	heap32[(fp+-223)] = r7;
	r7 = (r1 + 92)&-1;
	heap32[(fp+-224)] = r7;
	r7 = heap32[(fp+-212)];
	r7 = (r7 + 102994)&-1;
	heap32[(fp+-225)] = r7;
	r7 = 0;
	f0 =                         1;
	r8 = heap32[(fp+-221)];
_265: while(true){
	r8 = r8 >> 2;
	r8 = heap32[(r8)];
	heap32[(fp+-220)] = r8;
	if(r8 !=0) //_LBB47_198
{
	r8 = heap32[(fp+-220)];
	r8 = r8 >> 2;
	r9 = heap32[(r8+1)];
	r10 = r9 & 4;
_269: do {
	if(r10 !=0) //_LBB47_200
{
	r10 = heap32[(r8+32)];
if(!(r10 >8)) //_LBB47_199
{
	r9 = r9 & 32;
	if(r9 ==0) //_LBB47_203
{
	r9 = heap32[(r8+12)];
	r10 = heapU8[r9+38];
	if(r10 !=0) //_LBB47_199
{
break _269;
}
else{
	r10 = heap32[(r8+13)];
	r11 = heapU8[r10+38];
	if(r11 !=0) //_LBB47_199
{
break _269;
}
else{
	r9 = r9 >> 2;
	r10 = r10 >> 2;
	r11 = heap32[(r9+2)];
	r12 = heap32[(r10+2)];
	r13 = r11 >> 2;
	r14 = r12 >> 2;
	r15 = heap32[(r13)];
	r16 = heap32[(r14)];
if(!(r15 ==2)) //_LBB47_208
{
if(!(r16 ==2)) //_LBB47_208
{
__label__ = 191;
break _265;
}
}
	r12 = heapU16[(r12+4)>>1];
	r17 = 0;
	r11 = heapU16[(r11+4)>>1];
	r18 = r11 >>> 1;
	r18 = r18 & 1;
	r19 = r15 == r17;
	r18 = r18 ^ 1;
	r19 = r19 & 1;
	r18 = r18 | r19;
if(!(r18 ==0)) //_LBB47_210
{
	r18 = r12 >>> 1;
	r18 = r18 & 1;
	r19 = r16 == r17;
	r18 = r18 ^ 1;
	r19 = r19 & 1;
	r18 = r18 | r19;
	if(r18 != 0) //_LBB47_199
{
break _269;
}
}
	r11 = r11 & 8;
if(!(r11 !=0)) //_LBB47_214
{
if(!(r15 !=2)) //_LBB47_214
{
	r11 = r12 & 8;
	r11 = r11 & 65535;
if(!(r11 !=0)) //_LBB47_214
{
	if(r16 ==2) //_LBB47_199
{
break _269;
}
}
}
}
	f1 = heapFloat[(r13+15)];
	f2 = heapFloat[(r14+15)];
	heapFloat[(fp+-218)] = f2;
	if(f1 >=f2) //_LBB47_218
{
	f2 = heapFloat[(fp+-218)];
	if(f2 <f1) //_LBB47_220
{
	f2 =                         1;
	f3 = heapFloat[(fp+-218)];
	if(f3 <f2) //_LBB47_222
{
	f3 = heapFloat[(fp+-218)];
	f4 = f1-f3;
	f3 = f2-f3;
	f3 = f4/f3;
	f4 = heapFloat[(r14+11)];
	f2 = f2-f3;
	f5 = heapFloat[(r14+9)];
	f6 = heapFloat[(r14+12)];
	f7 = heapFloat[(r14+10)];
	f5 = f5*f2;
	f4 = f4*f3;
	f7 = f7*f2;
	f6 = f6*f3;
	f4 = f5+f4;
	f5 = f7+f6;
	heapFloat[(r14+9)] = f4;
	heapFloat[(r14+10)] = f5;
	f4 = heapFloat[(r14+13)];
	f5 = heapFloat[(r14+14)];
	f2 = f2*f4;
	f3 = f5*f3;
	f2 = f2+f3;
	heapFloat[(r14+13)] = f2;
	heapFloat[(r14+15)] = f1;
	heapFloat[(fp+-218)] = f1;
}
else{
__label__ = 200;
break _265;
}
}
else{
	heapFloat[(fp+-218)] = f1;
}
}
else{
	f2 =                         1;
	if(f1 <f2) //_LBB47_217
{
	f3 = heapFloat[(fp+-218)];
	f4 = f3-f1;
	f1 = f2-f1;
	f1 = f4/f1;
	f4 = heapFloat[(r13+11)];
	f2 = f2-f1;
	f5 = heapFloat[(r13+9)];
	f6 = heapFloat[(r13+12)];
	f7 = heapFloat[(r13+10)];
	f5 = f5*f2;
	f4 = f4*f1;
	f7 = f7*f2;
	f6 = f6*f1;
	f4 = f5+f4;
	f5 = f7+f6;
	heapFloat[(r13+9)] = f4;
	heapFloat[(r13+10)] = f5;
	f4 = heapFloat[(r13+13)];
	f5 = heapFloat[(r13+14)];
	f2 = f2*f4;
	f1 = f5*f1;
	f1 = f2+f1;
	heapFloat[(r13+13)] = f1;
	heapFloat[(r13+15)] = f3;
}
else{
__label__ = 200;
break _265;
}
}
	f1 =                         1;
	heapFloat[(fp+-213)] = f1;
	f2 = heapFloat[(fp+-218)];
	if(f2 <f1) //_LBB47_225
{
	r11 = heap32[(r8+15)];
	r12 = heap32[(r8+14)];
	r15 = r1 >> 2;
	heap32[(r15+4)] = 0;
	heap32[(r15+5)] = 0;
	heap32[(r15+6)] = 0;
	heap32[(r15+11)] = 0;
	heap32[(r15+12)] = 0;
	heap32[(r15+13)] = 0;
	r9 = heap32[(r9+3)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r9;
	heap32[(g0+2)] = r12;
	_ZN15b2DistanceProxy3SetEPK7b2Shapei(i7);
	r9 = heap32[(r10+3)];
	r10 = heap32[(fp+-214)];
	heap32[(g0)] = r10;
	heap32[(g0+1)] = r9;
	heap32[(g0+2)] = r11;
	_ZN15b2DistanceProxy3SetEPK7b2Shapei(i7);
	r9 = heap32[(r13+7)];
	r10 = heap32[(fp+-223)];
	r10 = r10 >> 2;
	r11 = heap32[(r13+8)];
	r12 = heap32[(r13+9)];
	r16 = heap32[(r13+10)];
	r18 = heap32[(r13+11)];
	r19 = heap32[(r13+12)];
	r20 = heap32[(r13+13)];
	r21 = heap32[(r13+14)];
	r13 = heap32[(r13+15)];
	heap32[(r10)] = r9;
	heap32[(r10+1)] = r11;
	heap32[(r10+2)] = r12;
	heap32[(r10+3)] = r16;
	heap32[(r10+4)] = r18;
	heap32[(r10+5)] = r19;
	heap32[(r10+6)] = r20;
	heap32[(r10+7)] = r21;
	heap32[(r10+8)] = r13;
	r9 = heap32[(r14+7)];
	r10 = heap32[(fp+-224)];
	r10 = r10 >> 2;
	r11 = heap32[(r14+8)];
	r12 = heap32[(r14+9)];
	r13 = heap32[(r14+10)];
	r16 = heap32[(r14+11)];
	r18 = heap32[(r14+12)];
	r19 = heap32[(r14+13)];
	r20 = heap32[(r14+14)];
	r14 = heap32[(r14+15)];
	heap32[(r10)] = r9;
	heap32[(r10+1)] = r11;
	heap32[(r10+2)] = r12;
	heap32[(r10+3)] = r13;
	heap32[(r10+4)] = r16;
	heap32[(r10+5)] = r18;
	heap32[(r10+6)] = r19;
	heap32[(r10+7)] = r20;
	heap32[(r10+8)] = r14;
	r9 = b2_toiCalls;
	r9 = r9 >> 2;
	heap32[(r15+32)] = 1065353216;
	r10 = heap32[(r9)];
	r10 = (r10 + 1)&-1;
	heap32[(r9)] = r10;
	f1 = heapFloat[(r15+14)];
	heapFloat[(fp+-210)] = f1;
	f1 = heapFloat[(r15+15)];
	heapFloat[(fp+-211)] = f1;
	f1 = heapFloat[(r15+16)];
	heapFloat[(fp+-202)] = f1;
	f1 = heapFloat[(r15+17)];
	heapFloat[(fp+-203)] = f1;
	f1 = heapFloat[(r15+18)];
	heapFloat[(fp+-204)] = f1;
	f1 = heapFloat[(r15+19)];
	heapFloat[(fp+-205)] = f1;
	f1 = heapFloat[(r15+22)];
	heapFloat[(fp+-216)] = f1;
	f1 = heapFloat[(r15+23)];
	heapFloat[(fp+-212)] = f1;
	f1 = heapFloat[(r15+24)];
	f2 = heapFloat[(r15+25)];
	heapFloat[(fp+-206)] = f2;
	f2 = heapFloat[(r15+26)];
	heapFloat[(fp+-207)] = f2;
	f2 = heapFloat[(r15+27)];
	heapFloat[(fp+-208)] = f2;
	f2 = heapFloat[(r15+28)];
	heapFloat[(fp+-209)] = f2;
	f2 = heapFloat[(r15+31)];
	heapFloat[(fp+-217)] = f2;
	f2 = heapFloat[(r15+21)];
	f3 = heapFloat[(r15+20)];
	f4 = heapFloat[(r15+29)];
	f5 = heapFloat[(r15+30)];
	f6 =        6.2831854820251465;
	f7 = f3/f6;
	heapFloat[(g0)] = f7;
	floorf(i7);
	f7 = f_g0;
	f8 = f4/f6;
	heapFloat[(g0)] = f8;
	floorf(i7);
	f8 = f_g0;
	f9 = heapFloat[(r15+6)];
	f10 = heapFloat[(r15+13)];
	f11 = f9+f10;
	f12 =     -0.014999999664723873;
	f11 = f11+f12;
	f12 =      0.004999999888241291;
	f11 = f11 < f12 ? f12 : f11; 
	f12 =     0.0012499999720603228;
	if(f11 >f12) //_LBB47_227
{
	f7 = f7*f6;
	f6 = f8*f6;
	f3 = f3-f7;
	heapFloat[(fp+-198)] = f3;
	f2 = f2-f7;
	heapFloat[(fp+-199)] = f2;
	f2 = f4-f6;
	heapFloat[(fp+-200)] = f2;
	f2 = f5-f6;
	heapFloat[(fp+-201)] = f2;
	f2 = heapFloat[(r15+32)];
	r9 = sp + -296; 
	heap16[(sp+-196)>>1] = r17;
	r10 = r9 >> 2;
	heap32[(fp+-74)] = heap32[(fp+-142)];
	heap32[(r10+1)] = heap32[(r15+1)];
	heap32[(r10+2)] = heap32[(r15+2)];
	heap32[(r10+3)] = heap32[(r15+3)];
	r11 = heap32[(r15+4)];
	heap32[(r10+4)] = r11;
	r11 = heap32[(r15+5)];
	heap32[(r10+5)] = r11;
	heapFloat[(r10+6)] = f9;
	heap32[(r10+7)] = heap32[(r15+7)];
	heap32[(r10+8)] = heap32[(r15+8)];
	heap32[(r10+9)] = heap32[(r15+9)];
	heap32[(r10+10)] = heap32[(r15+10)];
	r11 = heap32[(r15+11)];
	heap32[(r10+11)] = r11;
	r11 = heap32[(r15+12)];
	f3 =    -0.0012499999720603228;
	heap32[(r10+12)] = r11;
	f4 = f11+f12;
	f3 = f11+f3;
	f5 =                         0;
	heapFloat[(fp+-215)] = f5;
	heapFloat[(r10+13)] = f10;
	heap8[sp+-208] = r17;
_298: while(true){
	f6 = heapFloat[(fp+-213)];
	f6 = f6-f5;
	f7 = heapFloat[(fp+-198)];
	f7 = f6*f7;
	f8 = heapFloat[(fp+-199)];
	f8 = f8*f5;
	f7 = f7+f8;
	heapFloat[(g0)] = f7;
	sinf(i7);
	f8 = f_g0;
	heapFloat[(g0)] = f7;
	cosf(i7);
	f9 = f_g0;
	f10 = heapFloat[(fp+-200)];
	f10 = f6*f10;
	f13 = heapFloat[(fp+-201)];
	f13 = f13*f5;
	f10 = f10+f13;
	heapFloat[(g0)] = f10;
	sinf(i7);
	f13 = f_g0;
	f14 = heapFloat[(fp+-210)];
	f15 = f9*f14;
	f16 = heapFloat[(fp+-211)];
	f17 = f8*f16;
	f18 = heapFloat[(fp+-202)];
	f18 = f18*f6;
	f19 = heapFloat[(fp+-204)];
	f19 = f19*f5;
	heapFloat[(g0)] = f10;
	f10 = f18+f19;
	f15 = f15-f17;
	f14 = f8*f14;
	f16 = f9*f16;
	f17 = heapFloat[(fp+-203)];
	f17 = f17*f6;
	f18 = heapFloat[(fp+-205)];
	f18 = f18*f5;
	f17 = f17+f18;
	f14 = f14+f16;
	f15 = f10-f15;
	cosf(i7);
	f14 = f17-f14;
	heapFloat[(r10+14)] = f15;
	heapFloat[(r10+15)] = f14;
	f14 = heapFloat[(fp+-206)];
	f14 = f14*f6;
	f15 = heapFloat[(fp+-208)];
	f15 = f15*f5;
	f18 = heapFloat[(fp+-212)];
	f19 = f_g0*f18;
	f20 = f13*f1;
	heapFloat[(r10+16)] = f8;
	f8 = heapFloat[(fp+-207)];
	f8 = f8*f6;
	f21 = heapFloat[(fp+-209)];
	f21 = f21*f5;
	f18 = f13*f18;
	f22 = f_g0*f1;
	f14 = f14+f15;
	f15 = f19-f20;
	f8 = f8+f21;
	f18 = f18+f22;
	f14 = f14-f15;
	heapFloat[(r10+17)] = f9;
	f8 = f8-f18;
	heapFloat[(r10+18)] = f14;
	heapFloat[(r10+19)] = f8;
	heapFloat[(r10+20)] = f13;
	heapFloat[(r10+21)] = f_g0;
	r11 = sp + -320; 
	r12 = sp + -200; 
	heap32[(g0)] = r11;
	heap32[(g0+1)] = r12;
	heap32[(g0+2)] = r9;
	r11 = r11 >> 2;
	_Z10b2DistanceP16b2DistanceOutputP14b2SimplexCachePK15b2DistanceInput(i7);
	f8 = heapFloat[(r11+4)];
	f9 = heapFloat[(fp+-215)];
	if(f8 >f9) //_LBB47_230
{
	if(f8 >=f4) //_LBB47_232
{
	r11 = sp + -424; 
	r12 = r11 >> 2;
	heap32[(fp+-106)] = r1;
	r13 = heap32[(fp+-214)];
	heap32[(r12+1)] = r13;
	r13 = heapU16[(sp+-196)>>1];
	r14 = (r13 + -1)&-1;
	if(uint(r14) <uint(2)) //_LBB47_234
{
	r14 = (r17 + 1)&-1;
	f8 = heapFloat[(fp+-210)];
	heapFloat[(r12+2)] = f8;
	f8 = heapFloat[(fp+-211)];
	heapFloat[(r12+3)] = f8;
	f8 = heapFloat[(fp+-202)];
	heapFloat[(r12+4)] = f8;
	f8 = heapFloat[(fp+-203)];
	heapFloat[(r12+5)] = f8;
	f8 = heapFloat[(fp+-204)];
	heapFloat[(r12+6)] = f8;
	f8 = heapFloat[(fp+-205)];
	heapFloat[(r12+7)] = f8;
	f8 = heapFloat[(fp+-198)];
	heapFloat[(r12+8)] = f8;
	f8 = heapFloat[(fp+-199)];
	heapFloat[(r12+9)] = f8;
	f8 = heapFloat[(fp+-216)];
	heapFloat[(r12+10)] = f8;
	f8 = heapFloat[(fp+-212)];
	heapFloat[(r12+11)] = f8;
	heapFloat[(r12+12)] = f1;
	f8 = heapFloat[(fp+-206)];
	heapFloat[(r12+13)] = f8;
	f8 = heapFloat[(fp+-207)];
	heapFloat[(r12+14)] = f8;
	f8 = heapFloat[(fp+-208)];
	heapFloat[(r12+15)] = f8;
	f8 = heapFloat[(fp+-209)];
	heapFloat[(r12+16)] = f8;
	f8 = heapFloat[(fp+-200)];
	heapFloat[(r12+17)] = f8;
	f8 = heapFloat[(fp+-201)];
	heapFloat[(r12+18)] = f8;
	f8 = heapFloat[(fp+-217)];
	heapFloat[(r12+19)] = f8;
	heapFloat[(g0)] = f7;
	sinf(i7);
	f8 = f_g0;
	heapFloat[(g0)] = f7;
	cosf(i7);
	f7 = f_g0;
	f9 = heapFloat[(r12+2)];
	f13 = heapFloat[(r12+3)];
	f14 = heapFloat[(r12+14)];
	f15 = heapFloat[(r12+13)];
	f16 = heapFloat[(r12+17)];
	f18 = heapFloat[(r12+16)];
	f19 = heapFloat[(r12+15)];
	f20 = heapFloat[(r12+18)];
	f16 = f6*f16;
	f20 = f20*f5;
	f16 = f16+f20;
	heapFloat[(g0)] = f16;
	sinf(i7);
	f20 = f_g0;
	heapFloat[(g0)] = f16;
	cosf(i7);
	f16 = f_g0;
	f21 = heapFloat[(r12+11)];
	f22 = heapFloat[(r12+12)];
	f23 = f7*f9;
	f24 = f8*f13;
	f9 = f8*f9;
	f13 = f7*f13;
	f15 = f15*f6;
	f19 = f19*f5;
	f25 = f16*f21;
	f26 = f20*f22;
	f6 = f14*f6;
	f14 = f18*f5;
	f18 = f20*f21;
	f21 = f16*f22;
	f22 = f23-f24;
	f9 = f9+f13;
	f13 = f15+f19;
	f15 = f25-f26;
	f6 = f6+f14;
	f14 = f18+f21;
	f10 = f10-f22;
	f9 = f17-f9;
	f13 = f13-f15;
	f6 = f6-f14;
_303: do {
	if(r13 !=1) //_LBB47_242
{
	r13 = heapU8[sp+-194];
	r16 = heapU8[sp+-193];
	if(r13 !=r16) //_LBB47_254
{
	heap32[(r12+20)] = 1;
	r18 = heap32[(fp+-106)];
	r18 = r18 >> 2;
	r19 = heap32[(r18+5)];
	if(r19 >r13) //_LBB47_256
{
	if(r19 >r16) //_LBB47_258
{
	r18 = heap32[(r18+4)];
	r13 = r13 << 3;
	r13 = (r18 + r13)&-1;
	r13 = r13 >> 2;
	f14 = heapFloat[(r13)];
	f15 = heapFloat[(r13+1)];
	r13 = r16 << 3;
	r13 = (r18 + r13)&-1;
	r13 = r13 >> 2;
	f17 = heapFloat[(r13)];
	f18 = heapFloat[(r13+1)];
	f19 = f17-f14;
	f21 = f18-f15;
	f22 = -f19;
	heapFloat[(r12+23)] = f21;
	heapFloat[(r12+24)] = f22;
	f21 = f21*f21;
	f19 = f19*f19;
	f19 = f21+f19;
	heapFloat[(g0)] = f19;
	sqrtf(i7);
	f19 = f_g0;
	f21 =   1.1920928955078125e-007;
	if(f19 >=f21) //_LBB47_260
{
	f21 =                         1;
	f21 = f21/f19;
	f19 = heapFloat[(r12+23)];
	f19 = f19*f21;
	heapFloat[(r12+23)] = f19;
	f22 = heapFloat[(r12+24)];
	f21 = f22*f21;
	heapFloat[(r12+24)] = f21;
}
else{
	f19 = heapFloat[(r12+23)];
	f21 = heapFloat[(r12+24)];
}
	f14 = f14+f17;
	f17 =                       0.5;
	f15 = f15+f18;
	f14 = f14*f17;
	f15 = f15*f17;
	heapFloat[(r12+21)] = f14;
	heapFloat[(r12+22)] = f15;
	r13 = heap32[(r12+1)];
	r16 = heapU8[sp+-191];
	r13 = r13 >> 2;
	r18 = heap32[(r13+5)];
	if(r18 >r16) //_LBB47_263
{
	r13 = heap32[(r13+4)];
	r16 = r16 << 3;
	r13 = (r13 + r16)&-1;
	r13 = r13 >> 2;
	f17 = heapFloat[(r13)];
	f18 = heapFloat[(r13+1)];
	f22 = f16*f17;
	f23 = f20*f18;
	f24 = f7*f14;
	f25 = f8*f15;
	f17 = f20*f17;
	f16 = f16*f18;
	f14 = f8*f14;
	f15 = f7*f15;
	f18 = f22-f23;
	f20 = f24-f25;
	f16 = f17+f16;
	f14 = f14+f15;
	f13 = f18+f13;
	f10 = f20+f10;
	f15 = f7*f19;
	f17 = f8*f21;
	f6 = f16+f6;
	f9 = f14+f9;
	f8 = f8*f19;
	f7 = f7*f21;
	f10 = f13-f10;
	f13 = f15-f17;
	f6 = f6-f9;
	f7 = f8+f7;
	f8 = f10*f13;
	f6 = f6*f7;
	f6 = f8+f6;
	f7 =                         0;
	if(f6 >=f7) //_LBB47_240
{
__label__ = 221;
break _303;
}
else{
	f6 = -f19;
	r13 = 8;
	f7 = -f21;
	heapFloat[(r12+23)] = f6;
	heapFloat[(r12+24)] = f7;
	f6 = f2;
__label__ = 241;
break _303;
}
}
else{
__label__ = 225;
break _265;
}
}
else{
__label__ = 225;
break _265;
}
}
else{
__label__ = 225;
break _265;
}
}
else{
	heap32[(r12+20)] = 2;
	r16 = heap32[(r15+12)];
	r18 = heapU8[sp+-191];
	if(r16 >r18) //_LBB47_245
{
	r19 = heapU8[sp+-190];
	if(r16 >r19) //_LBB47_247
{
	r16 = heap32[(r15+11)];
	r18 = r18 << 3;
	r18 = (r16 + r18)&-1;
	r18 = r18 >> 2;
	f14 = heapFloat[(r18)];
	f15 = heapFloat[(r18+1)];
	r18 = r19 << 3;
	r16 = (r16 + r18)&-1;
	r16 = r16 >> 2;
	f17 = heapFloat[(r16)];
	f18 = heapFloat[(r16+1)];
	f19 = f17-f14;
	f21 = f18-f15;
	f22 = -f19;
	heapFloat[(r12+23)] = f21;
	heapFloat[(r12+24)] = f22;
	f21 = f21*f21;
	f19 = f19*f19;
	f19 = f21+f19;
	heapFloat[(g0)] = f19;
	sqrtf(i7);
	f19 = f_g0;
	f21 =   1.1920928955078125e-007;
	if(f19 >=f21) //_LBB47_249
{
	f21 =                         1;
	f21 = f21/f19;
	f19 = heapFloat[(r12+23)];
	f19 = f19*f21;
	heapFloat[(r12+23)] = f19;
	f22 = heapFloat[(r12+24)];
	f21 = f22*f21;
	heapFloat[(r12+24)] = f21;
}
else{
	f19 = heapFloat[(r12+23)];
	f21 = heapFloat[(r12+24)];
}
	f14 = f14+f17;
	f17 =                       0.5;
	f15 = f15+f18;
	f14 = f14*f17;
	f15 = f15*f17;
	heapFloat[(r12+21)] = f14;
	heapFloat[(r12+22)] = f15;
	r16 = heap32[(r15+5)];
	if(r16 >r13) //_LBB47_252
{
	r16 = heap32[(r15+4)];
	r13 = r13 << 3;
	r13 = (r16 + r13)&-1;
	r13 = r13 >> 2;
	f17 = heapFloat[(r13)];
	f18 = heapFloat[(r13+1)];
	f22 = f7*f17;
	f23 = f8*f18;
	f24 = f16*f14;
	f25 = f20*f15;
	f8 = f8*f17;
	f7 = f7*f18;
	f14 = f20*f14;
	f15 = f16*f15;
	f17 = f22-f23;
	f18 = f24-f25;
	f7 = f8+f7;
	f8 = f14+f15;
	f10 = f17+f10;
	f13 = f18+f13;
	f14 = f16*f19;
	f15 = f20*f21;
	f7 = f7+f9;
	f6 = f8+f6;
	f8 = f20*f19;
	f9 = f16*f21;
	f10 = f10-f13;
	f13 = f14-f15;
	f6 = f7-f6;
	f7 = f8+f9;
	f8 = f10*f13;
	f6 = f6*f7;
	f6 = f8+f6;
	f7 =                         0;
	if(f6 >=f7) //_LBB47_240
{
__label__ = 221;
}
else{
	f6 = -f19;
	r13 = 8;
	f7 = -f21;
	heapFloat[(r12+23)] = f6;
	heapFloat[(r12+24)] = f7;
	f6 = f2;
__label__ = 241;
}
}
else{
__label__ = 225;
break _265;
}
}
else{
__label__ = 225;
break _265;
}
}
else{
__label__ = 225;
break _265;
}
}
}
else{
	heap32[(r12+20)] = 0;
	r13 = heap32[(fp+-106)];
	r16 = heapU8[sp+-194];
	r13 = r13 >> 2;
	r18 = heap32[(r13+5)];
	if(r18 >r16) //_LBB47_237
{
	r18 = heap32[(r12+1)];
	r19 = heapU8[sp+-191];
	r18 = r18 >> 2;
	r20 = heap32[(r18+5)];
	if(r20 >r19) //_LBB47_239
{
	r13 = heap32[(r13+4)];
	r16 = r16 << 3;
	r13 = (r13 + r16)&-1;
	r13 = r13 >> 2;
	f14 = heapFloat[(r13)];
	f15 = heapFloat[(r13+1)];
	r13 = heap32[(r18+4)];
	r16 = r19 << 3;
	r13 = (r13 + r16)&-1;
	r13 = r13 >> 2;
	f17 = heapFloat[(r13)];
	f18 = heapFloat[(r13+1)];
	f19 = f16*f17;
	f21 = f20*f18;
	f22 = f7*f14;
	f23 = f8*f15;
	f20 = f20*f17;
	f16 = f16*f18;
	f8 = f8*f14;
	f7 = f7*f15;
	f14 = f19-f21;
	f15 = f22-f23;
	f16 = f20+f16;
	f7 = f8+f7;
	f8 = f14+f13;
	f10 = f15+f10;
	f8 = f8-f10;
	f6 = f16+f6;
	f7 = f7+f9;
	f6 = f6-f7;
	heapFloat[(r12+23)] = f8;
	heapFloat[(r12+24)] = f6;
	f7 = f8*f8;
	f6 = f6*f6;
	f6 = f7+f6;
	heapFloat[(g0)] = f6;
	sqrtf(i7);
	f6 = f_g0;
	f7 =   1.1920928955078125e-007;
	if(f6 >=f7) //_LBB47_241
{
	f7 =                         1;
	f6 = f7/f6;
	f7 = heapFloat[(r12+23)];
	f7 = f7*f6;
	heapFloat[(r12+23)] = f7;
	f7 = heapFloat[(r12+24)];
	r13 = 8;
	f6 = f7*f6;
	heapFloat[(r12+24)] = f6;
	f6 = f2;
__label__ = 241;
}
else{
__label__ = 221;
}
}
else{
__label__ = 218;
break _265;
}
}
else{
__label__ = 218;
break _265;
}
}
} while(0);
switch(__label__ ){//multiple entries
case 221: 
	r13 = 8;
	f6 = f2;
break;
}
_330: while(true){
	f7 =                         1;
	f8 = heapFloat[(r12+7)];
	f9 = heapFloat[(r12+6)];
	f10 = heapFloat[(r12+9)];
	f13 = f7-f6;
	f14 = heapFloat[(r12+5)];
	f15 = heapFloat[(r12+4)];
	f16 = heapFloat[(r12+8)];
	f16 = f13*f16;
	f10 = f10*f6;
	f10 = f16+f10;
	heapFloat[(g0)] = f10;
	sinf(i7);
	f16 = f_g0;
	heapFloat[(g0)] = f10;
	cosf(i7);
	f10 = f_g0;
	f17 = heapFloat[(r12+2)];
	f18 = heapFloat[(r12+3)];
	f19 = heapFloat[(r12+16)];
	f20 = heapFloat[(r12+15)];
	f21 = heapFloat[(r12+14)];
	f22 = heapFloat[(r12+13)];
	f23 = heapFloat[(r12+17)];
	f24 = heapFloat[(r12+18)];
	f23 = f13*f23;
	f24 = f24*f6;
	f23 = f23+f24;
	heapFloat[(g0)] = f23;
	sinf(i7);
	f24 = f_g0;
	heapFloat[(g0)] = f23;
	cosf(i7);
	f23 = f_g0;
	f25 = heapFloat[(r12+11)];
	f26 = heapFloat[(r12+12)];
	f15 = f15*f13;
	f9 = f9*f6;
	f27 = f10*f17;
	f28 = f16*f18;
	f14 = f14*f13;
	f8 = f8*f6;
	f17 = f16*f17;
	f18 = f10*f18;
	f22 = f22*f13;
	f20 = f20*f6;
	f29 = f23*f25;
	f30 = f24*f26;
	f13 = f21*f13;
	f19 = f19*f6;
	f21 = f24*f25;
	f25 = f23*f26;
	f9 = f15+f9;
	f15 = f27-f28;
	f8 = f14+f8;
	f14 = f17+f18;
	f17 = f22+f20;
	f18 = f29-f30;
	f13 = f13+f19;
	f19 = f21+f25;
	r16 = heap32[(r12+20)];
	f9 = f9-f15;
	f8 = f8-f14;
	f14 = f17-f18;
	f13 = f13-f19;
	if(r16 ==2) //_LBB47_291
{
	f15 = heapFloat[(r12+23)];
	f17 = heapFloat[(r12+24)];
	f18 = f23*f15;
	f19 = f24*f17;
	f20 = heapFloat[(r12+21)];
	f21 = heapFloat[(r12+22)];
	f18 = f18-f19;
	f15 = f24*f15;
	f17 = f23*f17;
	f15 = f15+f17;
	r19 = heap32[(fp+-106)];
	f17 = f23*f20;
	f19 = f24*f21;
	f20 = f24*f20;
	f21 = f23*f21;
	r19 = r19 >> 2;
	f17 = f17-f19;
	f19 = f20+f21;
	r22 = heap32[(r19+5)];
	f14 = f17+f14;
	f13 = f19+f13;
	r16 = heap32[(r19+4)];
	if(r22 >1) //_LBB47_293
{
	f17 = -f18;
	f19 = f18*f16;
	f20 = f10*f15;
	f17 = f10*f17;
	f21 = f16*f15;
	f19 = f19-f20;
	f17 = f17-f21;
	r19 = r16 >> 2;
	f20 = heapFloat[(r19)];
	f21 = heapFloat[(r19+1)];
	f20 = f20*f17;
	f21 = f21*f19;
	r19 = 2;
	f20 = f20+f21;
	r18 = r22 > 2 ? r22 : r19; 
	r20 = 1;
	r19 = 0;
_336: while(true){
	r21 = r20 << 3;
	r21 = (r16 + r21)&-1;
	r21 = r21 >> 2;
	f21 = heapFloat[(r21)];
	f22 = heapFloat[(r21+1)];
	f21 = f21*f17;
	f22 = f22*f19;
	f21 = f21+f22;
	r21 = (r20 + 1)&-1;
	r19 = f21 > f20 ? r20 : r19; 
	f20 = f21 > f20 ? f21 : f20; 
	r20 = r21;
if(!(r18 !=r21)) //_LBB47_294
{
break _336;
}
}
	if(r19 <0) //_LBB47_297
{
__label__ = 218;
break _265;
}
}
else{
	r19 = 0;
}
	if(r22 >r19) //_LBB47_298
{
	r22 = r19 << 3;
	r22 = (r16 + r22)&-1;
	r22 = r22 >> 2;
	f17 = heapFloat[(r22)];
	f19 = heapFloat[(r22+1)];
	f20 = f10*f17;
	f21 = f16*f19;
	f16 = f16*f17;
	f10 = f10*f19;
	f17 = f20-f21;
	f10 = f16+f10;
	f9 = f17+f9;
	f8 = f10+f8;
	f9 = f9-f14;
	f8 = f8-f13;
	f9 = f9*f18;
	f8 = f8*f15;
	f8 = f9+f8;
	r22 = -1;
}
else{
__label__ = 218;
break _265;
}
}
else{
	if(r16 ==1) //_LBB47_283
{
	f15 = heapFloat[(r12+23)];
	f17 = heapFloat[(r12+24)];
	f18 = f10*f15;
	f19 = f16*f17;
	f20 = heapFloat[(r12+21)];
	f21 = heapFloat[(r12+22)];
	f18 = f18-f19;
	f15 = f16*f15;
	f17 = f10*f17;
	f15 = f15+f17;
	r19 = heap32[(r12+1)];
	f17 = f10*f20;
	f19 = f16*f21;
	f16 = f16*f20;
	f10 = f10*f21;
	r19 = r19 >> 2;
	f17 = f17-f19;
	f10 = f16+f10;
	r16 = heap32[(r19+5)];
	f9 = f17+f9;
	f8 = f10+f8;
	r19 = heap32[(r19+4)];
	if(r16 >1) //_LBB47_285
{
	f10 = -f18;
	f16 = f18*f24;
	f17 = f23*f15;
	f10 = f23*f10;
	f19 = f24*f15;
	f16 = f16-f17;
	f10 = f10-f19;
	r22 = r19 >> 2;
	f17 = heapFloat[(r22)];
	f19 = heapFloat[(r22+1)];
	f17 = f17*f10;
	f19 = f19*f16;
	r22 = 2;
	f17 = f17+f19;
	r18 = r16 > 2 ? r16 : r22; 
	r20 = 1;
	r22 = 0;
_347: while(true){
	r21 = r20 << 3;
	r21 = (r19 + r21)&-1;
	r21 = r21 >> 2;
	f19 = heapFloat[(r21)];
	f20 = heapFloat[(r21+1)];
	f19 = f19*f10;
	f20 = f20*f16;
	f19 = f19+f20;
	r21 = (r20 + 1)&-1;
	r22 = f19 > f17 ? r20 : r22; 
	f17 = f19 > f17 ? f19 : f17; 
	r20 = r21;
if(!(r18 !=r21)) //_LBB47_286
{
break _347;
}
}
	if(r22 <0) //_LBB47_289
{
__label__ = 263;
break _265;
}
}
else{
	r22 = 0;
}
	if(r16 >r22) //_LBB47_290
{
	r16 = r22 << 3;
	r19 = (r19 + r16)&-1;
	r19 = r19 >> 2;
	f10 = heapFloat[(r19)];
	f16 = heapFloat[(r19+1)];
	f17 = f23*f10;
	f19 = f24*f16;
	f10 = f24*f10;
	f16 = f23*f16;
	f23 = f17-f19;
	f10 = f10+f16;
	f14 = f23+f14;
	f10 = f10+f13;
	f9 = f14-f9;
	f8 = f10-f8;
	f9 = f9*f18;
	f8 = f8*f15;
	f8 = f9+f8;
	r19 = -1;
}
else{
__label__ = 263;
break _265;
}
}
else{
	if(r16 !=0) //_LBB47_299
{
__label__ = 272;
break _265;
}
else{
	f15 = heapFloat[(r12+23)];
	f17 = heapFloat[(r12+24)];
	f18 = -f15;
	r16 = heap32[(fp+-106)];
	r16 = r16 >> 2;
	f19 = f15*f24;
	f20 = f23*f17;
	f18 = f23*f18;
	f21 = f24*f17;
	r18 = heap32[(r16+5)];
	f19 = f19-f20;
	f18 = f18-f21;
	r16 = heap32[(r16+4)];
_355: do {
	if(r18 >1) //_LBB47_270
{
	f20 = f10*f17;
	f21 = f15*f16;
	f22 = f10*f15;
	f25 = f16*f17;
	f20 = f20-f21;
	f21 = f22+f25;
	r19 = r16 >> 2;
	f22 = heapFloat[(r19)];
	f25 = heapFloat[(r19+1)];
	f22 = f22*f21;
	f25 = f25*f20;
	r19 = 2;
	f22 = f22+f25;
	r20 = r18 > 2 ? r18 : r19; 
	r21 = 1;
	r19 = 0;
_357: while(true){
	r22 = r21 << 3;
	r22 = (r16 + r22)&-1;
	r22 = r22 >> 2;
	f25 = heapFloat[(r22)];
	f26 = heapFloat[(r22+1)];
	f25 = f25*f21;
	f26 = f26*f20;
	f25 = f25+f26;
	r22 = (r21 + 1)&-1;
	r19 = f25 > f22 ? r21 : r19; 
	f22 = f25 > f22 ? f25 : f22; 
	r21 = r22;
if(!(r20 !=r22)) //_LBB47_271
{
break _355;
}
}
}
else{
	r19 = 0;
}
} while(0);
	r20 = heap32[(r12+1)];
	r20 = r20 >> 2;
	r21 = heap32[(r20+5)];
	r20 = heap32[(r20+4)];
_361: do {
	if(r21 >1) //_LBB47_274
{
	r22 = r20 >> 2;
	f20 = heapFloat[(r22)];
	f21 = heapFloat[(r22+1)];
	f20 = f20*f18;
	f21 = f21*f19;
	r22 = 2;
	f20 = f20+f21;
	r23 = r21 > 2 ? r21 : r22; 
	r24 = 1;
	r22 = 0;
_363: while(true){
	r25 = r24 << 3;
	r25 = (r20 + r25)&-1;
	r25 = r25 >> 2;
	f21 = heapFloat[(r25)];
	f22 = heapFloat[(r25+1)];
	f21 = f21*f18;
	f22 = f22*f19;
	f21 = f21+f22;
	r25 = (r24 + 1)&-1;
	r22 = f21 > f20 ? r24 : r22; 
	f20 = f21 > f20 ? f21 : f20; 
	r24 = r25;
if(!(r23 !=r25)) //_LBB47_275
{
break _361;
}
}
}
else{
	r22 = 0;
}
} while(0);
	if(r19 <0) //_LBB47_278
{
__label__ = 218;
break _265;
}
else{
	if(r18 >r19) //_LBB47_279
{
	if(r22 <0) //_LBB47_281
{
__label__ = 218;
break _265;
}
else{
	if(r21 >r22) //_LBB47_282
{
	r18 = r19 << 3;
	r16 = (r16 + r18)&-1;
	r16 = r16 >> 2;
	f18 = heapFloat[(r16)];
	f19 = heapFloat[(r16+1)];
	r16 = r22 << 3;
	r16 = (r20 + r16)&-1;
	r16 = r16 >> 2;
	f20 = heapFloat[(r16)];
	f21 = heapFloat[(r16+1)];
	f22 = f23*f20;
	f25 = f24*f21;
	f26 = f10*f18;
	f27 = f16*f19;
	f24 = f24*f20;
	f23 = f23*f21;
	f16 = f16*f18;
	f10 = f10*f19;
	f18 = f22-f25;
	f19 = f26-f27;
	f23 = f24+f23;
	f10 = f16+f10;
	f14 = f18+f14;
	f9 = f19+f9;
	f13 = f23+f13;
	f8 = f10+f8;
	f9 = f14-f9;
	f8 = f13-f8;
	f9 = f9*f15;
	f8 = f8*f17;
	f8 = f9+f8;
}
else{
__label__ = 218;
break _265;
}
}
}
else{
__label__ = 218;
break _265;
}
}
}
}
}
	if(f4 >=f8) //_LBB47_302
{
	if(f3 >=f8) //_LBB47_304
{
	heap32[(g0)] = r11;
	heap32[(g0+1)] = r19;
	heap32[(g0+2)] = r22;
	heapFloat[(g0+3)] = f5;
	_ZNK20b2SeparationFunction8EvaluateEiif(i7);
	f9 = f_g0;
	if(f3 <=f9) //_LBB47_306
{
	if(f4 <f9) //_LBB47_308
{
	r16 = 0;
	f7 = f5;
	f10 = f6;
_376: while(true){
	r18 = (r16 + 1)&-1;
	r20 = r16 & 1;
	if(r20 ==0) //_LBB47_311
{
	f13 = f7+f10;
	f14 =                       0.5;
	f13 = f13*f14;
}
else{
	f13 = f11-f9;
	f14 = f10-f7;
	f13 = f13*f14;
	f14 = f8-f9;
	f13 = f13/f14;
	f13 = f13+f7;
}
	heap32[(g0)] = r11;
	heap32[(g0+1)] = r19;
	heap32[(g0+2)] = r22;
	heapFloat[(g0+3)] = f13;
	_ZNK20b2SeparationFunction8EvaluateEiif(i7);
	f14 = f_g0;
	f15 = f14-f11;
	f16 =                         0;
	if(f15 <=f16) //_LBB47_314
{
	f15 = -f15;
}
	if(f15 >=f12) //_LBB47_317
{
	if(f14 <=f11) //_LBB47_319
{
	f8 = f14;
	f10 = f13;
}
else{
	f9 = f14;
	f7 = f13;
}
	r16 = b2_toiRootIters;
	r16 = r16 >> 2;
	r20 = heap32[(r16)];
	r20 = (r20 + 1)&-1;
	heap32[(r16)] = r20;
	r16 = r18;
	if(r18 !=50) //_LBB47_309
{
__label__ = 282;
}
else{
__label__ = 293;
break _376;
}
}
else{
__label__ = 288;
break _376;
}
}
switch(__label__ ){//multiple entries
case 293: 
	r16 = 50;
break;
case 288: 
	f6 = f13;
break;
}
	r18 = b2_toiMaxRootIters;
	r18 = r18 >> 2;
	r19 = heap32[(r18)];
	r13 = (r13 + -1)&-1;
	r16 = r19 > r16 ? r19 : r16; 
	heap32[(r18)] = r16;
	if(r13 !=0) //_LBB47_265
{
__label__ = 241;
}
else{
__label__ = 295;
break _330;
}
}
else{
__label__ = 280;
break _298;
}
}
else{
__label__ = 278;
break _298;
}
}
else{
__label__ = 276;
break _330;
}
}
else{
__label__ = 274;
break _298;
}
}
switch(__label__ ){//multiple entries
case 276: 
	f5 = f6;
break;
}
	r17 = b2_toiIters;
	r17 = r17 >> 2;
	r11 = heap32[(r17)];
	r11 = (r11 + 1)&-1;
	heap32[(r17)] = r11;
	r17 = r14;
	if(r14 !=20) //_LBB47_228
{
__label__ = 211;
}
else{
__label__ = 296;
break _298;
}
}
else{
__label__ = 215;
break _265;
}
}
else{
__label__ = 213;
break _298;
}
}
else{
__label__ = 297;
break _298;
}
}
_397: do {
switch(__label__ ){//multiple entries
case 296: 
	r17 = 20;
__label__ = 297;
break _397;
break;
case 280: 
	r9 = 1;
	f2 = f5;
__label__ = 298;
break _397;
break;
case 278: 
	r9 = 0;
	f2 = f5;
__label__ = 298;
break _397;
break;
case 274: 
	r9 = 0;
__label__ = 298;
break _397;
break;
case 213: 
	r9 = b2_toiMaxIters;
	r9 = r9 >> 2;
	r10 = heap32[(r9)];
	r10 = r10 > r17 ? r10 : r17; 
	heap32[(r9)] = r10;
__label__ = 301;
break;
}
} while(0);
_403: do {
switch(__label__ ){//multiple entries
case 297: 
	r9 = b2_toiMaxIters;
	r9 = r9 >> 2;
	r10 = heap32[(r9)];
	r17 = r10 > r17 ? r10 : r17; 
	heap32[(r9)] = r17;
__label__ = 302;
break _403;
break;
case 298: 
	r10 = b2_toiIters;
	r10 = r10 >> 2;
	r11 = heap32[(r10)];
	r12 = b2_toiMaxIters;
	r11 = (r11 + 1)&-1;
	r12 = r12 >> 2;
	heap32[(r10)] = r11;
	r10 = (r17 + 1)&-1;
	r11 = heap32[(r12)];
	r10 = r11 > r10 ? r11 : r10; 
	heap32[(r12)] = r10;
	if(r9 != 0) //_LBB47_328
{
	f5 = f2;
__label__ = 301;
}
else{
	heapFloat[(fp+-213)] = f7;
__label__ = 302;
}
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 301: 
	f1 =                         1;
	f2 = heapFloat[(fp+-218)];
	f3 = f1-f2;
	f3 = f3*f5;
	f2 = f3+f2;
	f1 = f2 < f1 ? f2 : f1; 
	heapFloat[(fp+-213)] = f1;
break;
}
	f1 = heapFloat[(fp+-213)];
	heapFloat[(r8+33)] = f1;
	r9 = heap32[(r8+1)];
	r9 = r9 | 32;
	heap32[(r8+1)] = r9;
}
else{
__label__ = 209;
break _265;
}
}
else{
__label__ = 207;
break _265;
}
}
}
}
else{
	f1 = heapFloat[(r8+33)];
	heapFloat[(fp+-213)] = f1;
}
	f1 = heapFloat[(fp+-213)];
if(!(f1 >=f0)) //_LBB47_199
{
	r7 = heap32[(fp+-220)];
	f0 = f1;
}
}
}
} while(0);
	r8 = heap32[(fp+-220)];
	r8 = (r8 + 12)&-1;
}
else{
	if(r7 ==0) //_LBB47_337
{
__label__ = 309;
break _265;
}
else{
	f1 =       0.99999880790710449;
	if(f0 <=f1) //_LBB47_338
{
	r8 = r7 >> 2;
	r9 = heap32[(r8+12)];
	r9 = r9 >> 2;
	r9 = heap32[(r9+2)];
	r10 = r9 >> 2;
	f1 = heapFloat[(r10+15)];
	f2 =                         1;
	if(f1 <f2) //_LBB47_340
{
	r11 = heap32[(r8+13)];
	r11 = r11 >> 2;
	r11 = heap32[(r11+2)];
	r12 = r11 >> 2;
	f3 = heapFloat[(r10+7)];
	f4 = heapFloat[(r10+8)];
	f5 = heapFloat[(r10+9)];
	f6 = heapFloat[(r10+10)];
	f7 = heapFloat[(r10+11)];
	f8 = heapFloat[(r10+12)];
	f9 = heapFloat[(r10+13)];
	f10 = heapFloat[(r10+14)];
	f11 = heapFloat[(r12+7)];
	f12 = heapFloat[(r12+8)];
	f13 = heapFloat[(r12+9)];
	f14 = heapFloat[(r12+10)];
	f15 = heapFloat[(r12+11)];
	f16 = heapFloat[(r12+12)];
	f17 = heapFloat[(r12+13)];
	f18 = heapFloat[(r12+14)];
	f19 = heapFloat[(r12+15)];
	f20 = f0-f1;
	f21 = f2-f1;
	f20 = f20/f21;
	f21 = f2-f20;
	f22 = f5*f21;
	f23 = f7*f20;
	f24 = f6*f21;
	f25 = f8*f20;
	f22 = f22+f23;
	f21 = f21*f9;
	f20 = f10*f20;
	f23 = f24+f25;
	heapFloat[(r10+9)] = f22;
	f20 = f21+f20;
	heapFloat[(r10+10)] = f23;
	heapFloat[(r10+13)] = f20;
	heapFloat[(r10+15)] = f0;
	heapFloat[(r10+11)] = f22;
	heapFloat[(r10+12)] = f23;
	heapFloat[(r10+14)] = f20;
	heapFloat[(g0)] = f20;
	sinf(i7);
	heapFloat[(r10+5)] = f_g0;
	heapFloat[(g0)] = f20;
	cosf(i7);
	heapFloat[(r10+6)] = f_g0;
	f21 = heapFloat[(r10+7)];
	f22 = heapFloat[(r10+5)];
	f23 = heapFloat[(r10+8)];
	f24 = f_g0*f21;
	f25 = f22*f23;
	f21 = f22*f21;
	f20 = f_g0*f23;
	f22 = f24-f25;
	f23 = heapFloat[(r10+11)];
	f24 = heapFloat[(r10+12)];
	f20 = f21+f20;
	f21 = f23-f22;
	f20 = f24-f20;
	heapFloat[(r10+3)] = f21;
	heapFloat[(r10+4)] = f20;
	f20 = heapFloat[(r12+15)];
	if(f20 <f2) //_LBB47_342
{
	f21 = f0-f20;
	f20 = f2-f20;
	f20 = f21/f20;
	f21 = heapFloat[(r12+11)];
	f22 = f2-f20;
	f23 = heapFloat[(r12+9)];
	f24 = heapFloat[(r12+12)];
	f25 = heapFloat[(r12+10)];
	f23 = f23*f22;
	f21 = f21*f20;
	f25 = f25*f22;
	f24 = f24*f20;
	f21 = f23+f21;
	f23 = f25+f24;
	heapFloat[(r12+9)] = f21;
	heapFloat[(r12+10)] = f23;
	f24 = heapFloat[(r12+13)];
	f25 = heapFloat[(r12+14)];
	f22 = f22*f24;
	f20 = f25*f20;
	f20 = f22+f20;
	heapFloat[(r12+13)] = f20;
	heapFloat[(r12+15)] = f0;
	heapFloat[(r12+11)] = f21;
	heapFloat[(r12+12)] = f23;
	heapFloat[(r12+14)] = f20;
	heapFloat[(g0)] = f20;
	sinf(i7);
	heapFloat[(r12+5)] = f_g0;
	heapFloat[(g0)] = f20;
	cosf(i7);
	heapFloat[(r12+6)] = f_g0;
	f21 = heapFloat[(r12+7)];
	f22 = heapFloat[(r12+5)];
	f23 = heapFloat[(r12+8)];
	f24 = f_g0*f21;
	f25 = f22*f23;
	f21 = f22*f21;
	f20 = f_g0*f23;
	f22 = f24-f25;
	f23 = heapFloat[(r12+11)];
	f24 = heapFloat[(r12+12)];
	f20 = f21+f20;
	f21 = f23-f22;
	f20 = f24-f20;
	heapFloat[(r12+3)] = f21;
	heapFloat[(r12+4)] = f20;
	r13 = heap32[(r2)];
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r13;
	_ZN9b2Contact6UpdateEP17b2ContactListener(i7);
	r13 = heap32[(r8+1)];
	r14 = r13 & -33;
	heap32[(r8+1)] = r14;
	r14 = heap32[(r8+32)];
	r14 = (r14 + 1)&-1;
	heap32[(r8+32)] = r14;
	r14 = r13 & 6;
	if(r14 !=6) //_LBB47_348
{
	r7 = r13 & -37;
	heap32[(r8+1)] = r7;
	heapFloat[(r10+7)] = f3;
	heapFloat[(r10+8)] = f4;
	heapFloat[(r10+9)] = f5;
	heapFloat[(r10+10)] = f6;
	heapFloat[(r10+11)] = f7;
	heapFloat[(r10+12)] = f8;
	heapFloat[(r10+13)] = f9;
	heapFloat[(r10+14)] = f10;
	heapFloat[(r10+15)] = f1;
	heapFloat[(r12+7)] = f11;
	heapFloat[(r12+8)] = f12;
	heapFloat[(r12+9)] = f13;
	heapFloat[(r12+10)] = f14;
	heapFloat[(r12+11)] = f15;
	heapFloat[(r12+12)] = f16;
	heapFloat[(r12+13)] = f17;
	heapFloat[(r12+14)] = f18;
	heapFloat[(r12+15)] = f19;
	f0 = heapFloat[(r10+14)];
	heapFloat[(g0)] = f0;
	sinf(i7);
	heapFloat[(r10+5)] = f_g0;
	heapFloat[(g0)] = f0;
	cosf(i7);
	heapFloat[(r10+6)] = f_g0;
	f1 = heapFloat[(r10+7)];
	f3 = heapFloat[(r10+5)];
	f4 = heapFloat[(r10+8)];
	f5 = f_g0*f1;
	f6 = f3*f4;
	f1 = f3*f1;
	f0 = f_g0*f4;
	f3 = f5-f6;
	f4 = heapFloat[(r10+11)];
	f5 = heapFloat[(r10+12)];
	f0 = f1+f0;
	f1 = f4-f3;
	f0 = f5-f0;
	heapFloat[(r10+3)] = f1;
	heapFloat[(r10+4)] = f0;
	f0 = heapFloat[(r12+14)];
	heapFloat[(g0)] = f0;
	sinf(i7);
	heapFloat[(r12+5)] = f_g0;
	heapFloat[(g0)] = f0;
	cosf(i7);
	heapFloat[(r12+6)] = f_g0;
	f1 = heapFloat[(r12+7)];
	f3 = heapFloat[(r12+5)];
	f4 = heapFloat[(r12+8)];
	f5 = f_g0*f1;
	f6 = f3*f4;
	f1 = f3*f1;
	f0 = f_g0*f4;
	f3 = f5-f6;
	f4 = heapFloat[(r12+11)];
	f5 = heapFloat[(r12+12)];
	f0 = f1+f0;
	f1 = f4-f3;
	r7 = 0;
	f0 = f5-f0;
	heapFloat[(r12+3)] = f1;
	heapFloat[(r12+4)] = f0;
	f0 = f2;
	r8 = heap32[(fp+-221)];
continue _265;
}
else{
	r13 = heapU16[(r9+4)>>1];
	r14 = r13 & 2;
if(!(r14 !=0)) //_LBB47_345
{
	r13 = r13 | 2;
	heap16[(r9+4)>>1] = r13;
	heap32[(r10+36)] = 0;
}
	r13 = heapU16[(r11+4)>>1];
	r14 = r13 & 2;
if(!(r14 !=0)) //_LBB47_347
{
	r13 = r13 | 2;
	heap16[(r11+4)>>1] = r13;
	heap32[(r12+36)] = 0;
}
	r13 = r4 >> 2;
	heap32[(r10+2)] = 0;
	heap32[(r13)] = r9;
	heap32[(r12+2)] = 1;
	r14 = r5 >> 2;
	heap32[(r13+1)] = r11;
	heap32[(r14)] = r7;
	r7 = heapU16[(r9+4)>>1];
	r7 = r7 | 1;
	heap16[(r9+4)>>1] = r7;
	r7 = heapU16[(r11+4)>>1];
	r7 = r7 | 1;
	heap16[(r11+4)>>1] = r7;
	r7 = heap32[(r8+1)];
	r7 = r7 | 1;
	r13 = sp + -432; 
	heap32[(r8+1)] = r7;
	r8 = 2;
	r7 = 1;
	r14 = 0;
	r15 = r13 >> 2;
	heap32[(fp+-108)] = r9;
	heap32[(r15+1)] = r11;
_430: while(true){
	if(r14 <2) //_LBB47_349
{
	r9 = r14 << 2;
	r9 = (r13 + r9)&-1;
	r9 = r9 >> 2;
	r9 = heap32[(r9)];
	r11 = r9 >> 2;
	r11 = heap32[(r11)];
	if(r11 ==2) //_LBB47_351
{
	r11 = (r9 + 112)&-1;
_435: while(true){
	r11 = r11 >> 2;
	r11 = heap32[(r11)];
	if(r11 ==0) //_LBB47_381
{
break _435;
}
else{
	if(r8 ==64) //_LBB47_381
{
break _435;
}
else{
	if(r7 !=32) //_LBB47_352
{
	r15 = r11 >> 2;
	r16 = heap32[(r15+1)];
	r17 = heapU8[r16+4];
	r17 = r17 & 1;
_440: do {
	if(r17 ==0) //_LBB47_354
{
	r15 = heap32[(r15)];
	r17 = r15 >> 2;
	r18 = heap32[(r17)];
if(!(r18 !=2)) //_LBB47_357
{
	r18 = heapU8[r9+4];
	r18 = r18 & 8;
if(!(r18 !=0)) //_LBB47_357
{
	r18 = heapU8[r15+4];
	r18 = r18 & 8;
	if(r18 ==0) //_LBB47_353
{
break _440;
}
}
}
	r18 = r16 >> 2;
	r19 = heap32[(r18+12)];
	r19 = heapU8[r19+38];
if(!(r19 !=0)) //_LBB47_353
{
	r19 = heap32[(r18+13)];
	r19 = heapU8[r19+38];
if(!(r19 !=0)) //_LBB47_353
{
	f1 = heapFloat[(r17+7)];
	f2 = heapFloat[(r17+8)];
	f3 = heapFloat[(r17+9)];
	f4 = heapFloat[(r17+10)];
	f5 = heapFloat[(r17+11)];
	f6 = heapFloat[(r17+12)];
	f7 = heapFloat[(r17+13)];
	f8 = heapFloat[(r17+14)];
	f9 = heapFloat[(r17+15)];
	r19 = heapU8[r15+4];
	r19 = r19 & 1;
if(!(r19 != 0)) //_LBB47_363
{
	f10 =                         1;
	if(f9 <f10) //_LBB47_362
{
	f11 = f0-f9;
	f12 = f10-f9;
	f11 = f11/f12;
	f10 = f10-f11;
	f12 = f3*f10;
	f13 = f5*f11;
	f12 = f12+f13;
	f13 = f4*f10;
	f14 = f6*f11;
	f10 = f10*f7;
	f11 = f8*f11;
	f13 = f13+f14;
	heapFloat[(r17+9)] = f12;
	f10 = f10+f11;
	heapFloat[(r17+10)] = f13;
	heapFloat[(r17+13)] = f10;
	heapFloat[(r17+15)] = f0;
	heapFloat[(r17+11)] = f12;
	heapFloat[(r17+12)] = f13;
	heapFloat[(r17+14)] = f10;
	heapFloat[(g0)] = f10;
	sinf(i7);
	heapFloat[(r17+5)] = f_g0;
	heapFloat[(g0)] = f10;
	cosf(i7);
	heapFloat[(r17+6)] = f_g0;
	f11 = heapFloat[(r17+7)];
	f12 = heapFloat[(r17+5)];
	f13 = heapFloat[(r17+8)];
	f14 = f_g0*f11;
	f15 = f12*f13;
	f11 = f12*f11;
	f10 = f_g0*f13;
	f12 = f14-f15;
	f13 = heapFloat[(r17+11)];
	f14 = heapFloat[(r17+12)];
	f10 = f11+f10;
	f11 = f13-f12;
	f10 = f14-f10;
	heapFloat[(r17+3)] = f11;
	heapFloat[(r17+4)] = f10;
}
else{
__label__ = 330;
break _265;
}
}
	r19 = heap32[(r2)];
	heap32[(g0)] = r16;
	heap32[(g0+1)] = r19;
	_ZN9b2Contact6UpdateEP17b2ContactListener(i7);
	r19 = heap32[(r18+1)];
	r20 = r19 & 4;
	if(r20 !=0) //_LBB47_365
{
	r20 = r19 & 2;
	if(r20 !=0) //_LBB47_367
{
	r19 = r19 | 1;
	heap32[(r18+1)] = r19;
	if(r7 <32) //_LBB47_369
{
	r18 = r7 << 2;
	r18 = (r5 + r18)&-1;
	r18 = r18 >> 2;
	heap32[(r18)] = r16;
	r16 = heapU16[(r15+4)>>1];
	r7 = (r7 + 1)&-1;
	r18 = r16 & 1;
	if(r18 ==0) //_LBB47_371
{
	r18 = r16 | 1;
	heap16[(r15+4)>>1] = r18;
	r18 = heap32[(r17)];
if(!(r18 ==0)) //_LBB47_374
{
	r18 = r16 & 2;
if(!(r18 !=0)) //_LBB47_374
{
	r16 = r16 | 3;
	heap16[(r15+4)>>1] = r16;
	heap32[(r17+36)] = 0;
}
}
	if(r8 <64) //_LBB47_376
{
	r16 = r8 << 2;
	r16 = (r4 + r16)&-1;
	r18 = (r8 + 1)&-1;
	r16 = r16 >> 2;
	heap32[(r17+2)] = r8;
	heap32[(r16)] = r15;
	r8 = r18;
}
else{
__label__ = 343;
break _265;
}
}
}
else{
__label__ = 337;
break _265;
}
}
else{
	heapFloat[(r17+7)] = f1;
	heapFloat[(r17+8)] = f2;
	heapFloat[(r17+9)] = f3;
	heapFloat[(r17+10)] = f4;
	heapFloat[(r17+11)] = f5;
	heapFloat[(r17+12)] = f6;
	heapFloat[(r17+13)] = f7;
	heapFloat[(r17+14)] = f8;
	heapFloat[(r17+15)] = f9;
	heapFloat[(g0)] = f8;
	sinf(i7);
	heapFloat[(r17+5)] = f_g0;
	heapFloat[(g0)] = f8;
	cosf(i7);
	heapFloat[(r17+6)] = f_g0;
	f2 = heapFloat[(r17+7)];
	f3 = heapFloat[(r17+5)];
	f4 = heapFloat[(r17+8)];
	f5 = f_g0*f2;
	f6 = f3*f4;
	f2 = f3*f2;
	f1 = f_g0*f4;
	f3 = f5-f6;
	f4 = heapFloat[(r17+11)];
	f5 = heapFloat[(r17+12)];
	f1 = f2+f1;
	f2 = f4-f3;
	f1 = f5-f1;
	heapFloat[(r17+3)] = f2;
	heapFloat[(r17+4)] = f1;
}
}
else{
	heapFloat[(r17+7)] = f1;
	heapFloat[(r17+8)] = f2;
	heapFloat[(r17+9)] = f3;
	heapFloat[(r17+10)] = f4;
	heapFloat[(r17+11)] = f5;
	heapFloat[(r17+12)] = f6;
	heapFloat[(r17+13)] = f7;
	heapFloat[(r17+14)] = f8;
	heapFloat[(r17+15)] = f9;
	heapFloat[(g0)] = f8;
	sinf(i7);
	heapFloat[(r17+5)] = f_g0;
	heapFloat[(g0)] = f8;
	cosf(i7);
	heapFloat[(r17+6)] = f_g0;
	f2 = heapFloat[(r17+7)];
	f3 = heapFloat[(r17+5)];
	f4 = heapFloat[(r17+8)];
	f5 = f_g0*f2;
	f6 = f3*f4;
	f2 = f3*f2;
	f1 = f_g0*f4;
	f3 = f5-f6;
	f4 = heapFloat[(r17+11)];
	f5 = heapFloat[(r17+12)];
	f1 = f2+f1;
	f2 = f4-f3;
	f1 = f5-f1;
	heapFloat[(r17+3)] = f2;
	heapFloat[(r17+4)] = f1;
}
}
}
}
} while(0);
	r11 = (r11 + 12)&-1;
}
else{
break _435;
}
}
}
}
}
	r14 = (r14 + 1)&-1;
}
else{
break _430;
}
}
	r9 = heap32[(r10+2)];
	if(r8 >r9) //_LBB47_385
{
	r10 = heap32[(r12+2)];
	if(r8 <=r10) //_LBB47_388
{
__label__ = 356;
break _265;
}
else{
_470: do {
if(!(r8 <1)) //_LBB47_390
{
	r11 = 0;
_472: while(true){
	r12 = r11 << 2;
	r12 = (r4 + r12)&-1;
	r12 = r12 >> 2;
	r13 = (r11 * 3)&-1;
	r12 = heap32[(r12)];
	r12 = r12 >> 2;
	r13 = r13 << 2;
	r14 = (r0 + r13)&-1;
	f1 = heapFloat[(r12+12)];
	r14 = r14 >> 2;
	heap32[(r14)] = heap32[(r12+11)];
	heapFloat[(r14+1)] = f1;
	heap32[(r14+2)] = heap32[(r12+14)];
	r13 = (r6 + r13)&-1;
	f1 = heapFloat[(r12+17)];
	r13 = r13 >> 2;
	heap32[(r13)] = heap32[(r12+16)];
	r11 = (r11 + 1)&-1;
	heapFloat[(r13+1)] = f1;
	heap32[(r13+2)] = heap32[(r12+18)];
if(!(r8 >r11)) //_LBB47_389
{
break _470;
}
}
}
} while(0);
	f1 =                         1;
	f0 = f1-f0;
	f2 = heapFloat[(fp+-197)];
	f0 = f0*f2;
	f2 = f1/f0;
	r11 = sp + -128; 
	r12 = r11 >> 2;
	heap32[(r12+6)] = r5;
	heap32[(r12+7)] = r7;
	r13 = heap32[(fp+-222)];
	heap32[(r12+10)] = r13;
	heapFloat[(fp+-32)] = f0;
	heapFloat[(r12+1)] = f2;
	heap32[(r12+2)] = 1065353216;
	heap32[(r12+3)] = 3;
	r13 = 0;
	heap32[(r12+4)] = 20;
	heap8[sp+-108] = r13;
	heap32[(r12+8)] = r0;
	heap32[(r12+9)] = r6;
	r12 = sp + -184; 
	heap32[(g0)] = r12;
	heap32[(g0+1)] = r11;
	r11 = -1;
	_ZN15b2ContactSolverC1EP18b2ContactSolverDef(i7);
_475: while(true){
	r11 = (r11 + 1)&-1;
	if(r11 <20) //_LBB47_391
{
	r14 = r12 >> 2;
	r15 = heap32[(r14+12)];
	if(r15 <1) //_LBB47_407
{
break _475;
}
else{
	r16 = heap32[(r14+9)];
	r14 = heap32[(r14+6)];
	f2 =                         0;
	r17 = 0;
_479: while(true){
	r18 = r16 >> 2;
	r19 = heap32[(r18+8)];
	r17 = (r17 + 1)&-1;
	r20 = heap32[(r18+9)];
	f3 = heapFloat[(r18+12)];
	f4 = heapFloat[(r18+13)];
	f5 = heapFloat[(r18+14)];
	f6 = heapFloat[(r18+15)];
	r21 = heap32[(r18+21)];
	if(r19 ==r9) //_LBB47_396
{
__label__ = 364;
}
else{
	if(r19 ==r10) //_LBB47_396
{
__label__ = 364;
}
else{
	f7 =                         0;
	f8 = f7;
__label__ = 365;
}
}
switch(__label__ ){//multiple entries
case 364: 
	f7 = heapFloat[(r18+10)];
	f8 = heapFloat[(r18+16)];
break;
}
	r19 = (r19 * 12)&-1;
	r20 = (r20 * 12)&-1;
	r19 = (r14 + r19)&-1;
	r20 = (r14 + r20)&-1;
	r19 = r19 >> 2;
	r20 = r20 >> 2;
	f9 = heapFloat[(r19)];
	f10 = heapFloat[(r19+1)];
	f11 = heapFloat[(r19+2)];
	f12 = heapFloat[(r20)];
	f13 = heapFloat[(r20+1)];
	f14 = heapFloat[(r20+2)];
	if(r21 >0) //_LBB47_399
{
	f15 = heapFloat[(r18+17)];
	f16 = heapFloat[(r18+11)];
	f17 = f7+f16;
	r18 = 0;
_489: while(true){
	r22 = sp + -16; 
	heapFloat[(g0)] = f11;
	r23 = r22 >> 2;
	sinf(i7);
	f18 = f_g0;
	heapFloat[(r23+2)] = f18;
	heapFloat[(g0)] = f11;
	cosf(i7);
	f19 = f_g0;
	heapFloat[(r23+3)] = f19;
	r24 = sp + -32; 
	heapFloat[(g0)] = f14;
	r25 = r24 >> 2;
	sinf(i7);
	f20 = f_g0;
	heapFloat[(r25+2)] = f20;
	heapFloat[(g0)] = f14;
	f21 = f19*f3;
	f22 = f18*f4;
	cosf(i7);
	f18 = f18*f3;
	f19 = f19*f4;
	f21 = f21-f22;
	f22 = f_g0*f5;
	f24 = f20*f6;
	f18 = f18+f19;
	f19 = f9-f21;
	heapFloat[(r25+3)] = f_g0;
	f20 = f20*f5;
	f21 = f_g0*f6;
	f22 = f22-f24;
	f18 = f10-f18;
	heapFloat[(fp+-4)] = f19;
	f19 = f20+f21;
	f20 = f12-f22;
	heapFloat[(r23+1)] = f18;
	f18 = f13-f19;
	heapFloat[(fp+-8)] = f20;
	heapFloat[(r25+1)] = f18;
	r23 = sp + -56; 
	heap32[(g0)] = r23;
	heap32[(g0+1)] = r16;
	heap32[(g0+2)] = r22;
	heap32[(g0+3)] = r24;
	heap32[(g0+4)] = r18;
	_ZN24b2PositionSolverManifold10InitializeEP27b2ContactPositionConstraintRK11b2TransformS4_i(i7);
	r22 = r23 >> 2;
	f18 = heapFloat[(r22+3)];
	f19 = heapFloat[(r22+2)];
	f20 = heapFloat[(fp+-14)];
	f21 = f18-f10;
	f22 = heapFloat[(r22+1)];
	f23 = f19-f9;
	f18 = f18-f13;
	f19 = f19-f12;
	f24 = f23*f22;
	f25 = f21*f20;
	f24 = f24-f25;
	f25 = f19*f22;
	f26 = f18*f20;
	f27 = f8*f24;
	f25 = f25-f26;
	f26 = heapFloat[(r22+4)];
	f28 = f15*f25;
	f24 = f27*f24;
	f24 = f17+f24;
	f25 = f28*f25;
	f27 =                         0;
	f24 = f24+f25;
	f2 = f2 < f26 ? f2 : f26; 
	if(f24 >f27) //_LBB47_402
{
	f25 =      0.004999999888241291;
	f25 = f26+f25;
	f26 =                      0.75;
	f25 = f25*f26;
	f27 = f25 < f27 ? f25 : f27; 
	f25 =      -0.20000000298023224;
	f27 = f27 < f25 ? f25 : f27; 
	f27 = -f27;
	f27 = f27/f24;
}
	f22 = f22*f27;
	f20 = f20*f27;
	f23 = f23*f22;
	f21 = f21*f20;
	f19 = f19*f22;
	f18 = f18*f20;
	f21 = f23-f21;
	f18 = f19-f18;
	f19 = f20*f7;
	f23 = f22*f7;
	f21 = f21*f8;
	f20 = f20*f16;
	f22 = f22*f16;
	f18 = f18*f15;
	r18 = (r18 + 1)&-1;
	f9 = f9-f19;
	f10 = f10-f23;
	f11 = f11-f21;
	f12 = f12+f20;
	f13 = f13+f22;
	f14 = f18+f14;
if(!(r21 !=r18)) //_LBB47_400
{
break _489;
}
}
}
	heapFloat[(r19)] = f9;
	heapFloat[(r19+1)] = f10;
	heapFloat[(r19+2)] = f11;
	heapFloat[(r20)] = f12;
	r16 = (r16 + 88)&-1;
	heapFloat[(r20+1)] = f13;
	heapFloat[(r20+2)] = f14;
if(!(r15 >r17)) //_LBB47_393
{
break _479;
}
}
	f3 =    -0.0074999998323619366;
	if(f2 >=f3) //_LBB47_407
{
break _475;
}
}
}
else{
break _475;
}
}
	r11 = (r9 * 12)&-1;
	r9 = r9 << 2;
	r11 = (r0 + r11)&-1;
	r9 = (r4 + r9)&-1;
	r11 = r11 >> 2;
	r9 = r9 >> 2;
	r14 = heap32[(r9)];
	f2 = heapFloat[(r11+1)];
	r14 = r14 >> 2;
	heap32[(r14+9)] = heap32[(r11)];
	heapFloat[(r14+10)] = f2;
	r9 = heap32[(r9)];
	r14 = (r10 * 12)&-1;
	r10 = r10 << 2;
	r14 = (r0 + r14)&-1;
	r10 = (r4 + r10)&-1;
	r9 = r9 >> 2;
	r14 = r14 >> 2;
	heap32[(r9+13)] = heap32[(r11+2)];
	r9 = r10 >> 2;
	r10 = heap32[(r9)];
	f2 = heapFloat[(r14+1)];
	r10 = r10 >> 2;
	heap32[(r10+9)] = heap32[(r14)];
	heapFloat[(r10+10)] = f2;
	r9 = heap32[(r9)];
	r9 = r9 >> 2;
	heap32[(r9+13)] = heap32[(r14+2)];
	heap32[(g0)] = r12;
	_ZN15b2ContactSolver29InitializeVelocityConstraintsEv(i7);
_497: while(true){
	r13 = (r13 + 1)&-1;
	heap32[(g0)] = r12;
	_ZN15b2ContactSolver24SolveVelocityConstraintsEv(i7);
if(!(r13 <3)) //_LBB47_408
{
break _497;
}
}
_500: do {
if(!(r8 <1)) //_LBB47_421
{
	r9 = 0;
_502: while(true){
	r10 = (r9 * 3)&-1;
	r11 = r10 << 2;
	r13 = (r6 + r11)&-1;
	r13 = r13 >> 2;
	f2 = heapFloat[(r13)];
	f3 = heapFloat[(r13+1)];
	f4 = f2*f0;
	f5 = f3*f0;
	r11 = (r0 + r11)&-1;
	r11 = r11 >> 2;
	f4 = f4*f4;
	f5 = f5*f5;
	f4 = f4+f5;
	r14 = (r9 + 1)&-1;
	f5 = heapFloat[(r11)];
	f6 = heapFloat[(r11+1)];
	f7 = heapFloat[(r11+2)];
	f8 = heapFloat[(r13+2)];
	f9 =                         4;
	if(f4 >f9) //_LBB47_413
{
	heapFloat[(g0)] = f4;
	f4 =                         2;
	sqrtf(i7);
	f4 = f4/f_g0;
	f2 = f2*f4;
	f3 = f3*f4;
}
	f4 = f0*f8;
	f9 = f4*f4;
	f10 =        2.4674012660980225;
	if(f9 >f10) //_LBB47_416
{
	f9 =                         0;
	if(f4 <=f9) //_LBB47_418
{
	f4 = -f4;
}
	f9 =        1.5707963705062866;
	f4 = f9/f4;
	f8 = f8*f4;
}
	r11 = r10 << 2;
	r15 = r10 << 2;
	r11 = (r0 + r11)&-1;
	f4 = f2*f0;
	r16 = r10 << 2;
	r15 = (r0 + r15)&-1;
	f9 = f3*f0;
	f4 = f5+f4;
	r11 = r11 >> 2;
	r16 = (r0 + r16)&-1;
	f5 = f0*f8;
	f6 = f6+f9;
	r17 = r10 << 2;
	r15 = r15 >> 2;
	heapFloat[(r11)] = f4;
	r10 = r10 << 2;
	r11 = (r6 + r17)&-1;
	f5 = f5+f7;
	r16 = r16 >> 2;
	heapFloat[(r15+1)] = f6;
	r10 = (r6 + r10)&-1;
	r11 = r11 >> 2;
	heapFloat[(r16+2)] = f5;
	r9 = r9 << 2;
	r10 = r10 >> 2;
	heapFloat[(r11)] = f2;
	r9 = (r4 + r9)&-1;
	heapFloat[(r10+1)] = f3;
	r9 = r9 >> 2;
	heapFloat[(r13+2)] = f8;
	r9 = heap32[(r9)];
	r9 = r9 >> 2;
	heapFloat[(r9+11)] = f4;
	heapFloat[(r9+12)] = f6;
	heapFloat[(r9+14)] = f5;
	heapFloat[(r9+16)] = f2;
	heapFloat[(r9+17)] = f3;
	heapFloat[(r9+18)] = f8;
	heapFloat[(g0)] = f5;
	sinf(i7);
	heapFloat[(r9+5)] = f_g0;
	heapFloat[(g0)] = f5;
	cosf(i7);
	heapFloat[(r9+6)] = f_g0;
	f3 = heapFloat[(r9+7)];
	f4 = heapFloat[(r9+5)];
	f5 = heapFloat[(r9+8)];
	f6 = f_g0*f3;
	f7 = f4*f5;
	f3 = f4*f3;
	f2 = f_g0*f5;
	f4 = f6-f7;
	f5 = heapFloat[(r9+11)];
	f6 = heapFloat[(r9+12)];
	f2 = f3+f2;
	f3 = f5-f4;
	f2 = f6-f2;
	heapFloat[(r9+3)] = f3;
	heapFloat[(r9+4)] = f2;
	r9 = r14;
if(!(r8 >r14)) //_LBB47_411
{
break _500;
}
}
}
} while(0);
	r9 = r12 >> 2;
	r10 = heap32[(r9+10)];
_514: do {
if(!(r3 ==0)) //_LBB47_428
{
if(!(r7 <1)) //_LBB47_428
{
	r11 = (r10 + 144)&-1;
	r12 = 0;
_517: while(true){
	r13 = r12 << 2;
	r13 = (r5 + r13)&-1;
	r14 = r11 >> 2;
	r13 = r13 >> 2;
	r14 = heap32[(r14)];
	r13 = heap32[(r13)];
	r15 = sp + -80; 
	r16 = r15 >> 2;
	heap32[(r16+4)] = r14;
if(!(r14 <1)) //_LBB47_427
{
	r16 = 0;
_521: while(true){
	r17 = (r16 * 9)&-1;
	r18 = r16 << 2;
	r17 = r17 << 2;
	r18 = (r15 + r18)&-1;
	r17 = (r11 + r17)&-1;
	r18 = r18 >> 2;
	r17 = r17 >> 2;
	r16 = (r16 + 1)&-1;
	heap32[(r18)] = heap32[(r17+-32)];
	heap32[(r18+2)] = heap32[(r17+-31)];
if(!(r16 <r14)) //_LBB47_426
{
break _521;
}
}
}
	r12 = (r12 + 1)&-1;
	r14 = r3 >> 2;
	r14 = heap32[(r14)];
	r14 = r14 >> 2;
	r14 = heap32[(r14+5)];
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r13;
	heap32[(g0+2)] = r15;
	r11 = (r11 + 152)&-1;
	__FUNCTION_TABLE__[(r14)>>2](i7);
if(!(r7 >r12)) //_LBB47_424
{
break _514;
}
}
}
}
} while(0);
	r7 = heap32[(r9+8)];
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r10;
	_ZN16b2StackAllocator4FreeEPv(i7);
	r9 = heap32[(r9+9)];
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r9;
	_ZN16b2StackAllocator4FreeEPv(i7);
_525: do {
if(!(r8 <1)) //_LBB47_434
{
	r7 = 0;
_527: while(true){
	r9 = r7 << 2;
	r9 = (r4 + r9)&-1;
	r9 = r9 >> 2;
	r9 = heap32[(r9)];
	r10 = heapU16[(r9+4)>>1];
	r10 = r10 & 65534;
	r11 = r9 >> 2;
	heap16[(r9+4)>>1] = r10;
	r10 = heap32[(r11)];
if(!(r10 !=2)) //_LBB47_433
{
	heap32[(g0)] = r9;
	_ZN6b2Body19SynchronizeFixturesEv(i7);
	r9 = heap32[(r11+28)];
if(!(r9 ==0)) //_LBB47_433
{
__label__ = 395; //SET chanka
_531: while(true){
	r9 = r9 >> 2;
	r10 = heap32[(r9+1)];
	r10 = r10 >> 2;
	r11 = heap32[(r10+1)];
	r11 = r11 & -34;
	heap32[(r10+1)] = r11;
	r9 = heap32[(r9+3)];
if(!(r9 !=0)) //_LBB47_432
{
break _531;
}
}
}
}
	r7 = (r7 + 1)&-1;
if(!(r8 >r7)) //_LBB47_430
{
break _525;
}
}
}
} while(0);
	r7 = heap32[(fp+-219)];
	heap32[(g0)] = r7;
	r7 = 0;
	_ZN16b2ContactManager15FindNewContactsEv(i7);
	r8 = heap32[(fp+-225)];
	r9 = heapU8[r8];
	f0 = f1;
	r8 = heap32[(fp+-221)];
	if(r9 ==0) //_LBB47_334
{
__label__ = 306;
}
else{
__label__ = 398;
break _265;
}
}
}
else{
__label__ = 352;
break _265;
}
}
}
else{
__label__ = 311;
break _265;
}
}
else{
__label__ = 311;
break _265;
}
}
else{
__label__ = 309;
break _265;
}
}
}
}
switch(__label__ ){//multiple entries
case 309: 
	r1 = 1;
break;
case 343: 
	r1 = _2E_str20174;
	r7 = _2E_str19173;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = 54;
	_assert(i7);
break;
case 337: 
	r1 = _2E_str18172;
	r7 = _2E_str19173;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = 62;
	_assert(i7);
break;
case 330: 
	r1 = _2E_str16170;
	r7 = _2E_str17171;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = 715;
	_assert(i7);
break;
case 356: 
	r1 = _2E_str2155;
	r7 = _2E_str1154;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = 387;
	_assert(i7);
break;
case 398: 
	r1 = 0;
break;
case 352: 
	r1 = _2E_str153;
	r7 = _2E_str1154;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = 386;
	_assert(i7);
break;
case 311: 
	r1 = _2E_str16170;
	r8 = _2E_str17171;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r8;
	heap32[(g0+2)] = 715;
	_assert(i7);
break;
case 218: 
	r8 = _2E_str29;
	r0 = _2E_str3;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 103;
	_assert(i7);
break;
case 263: 
	r8 = _2E_str29;
	r19 = _2E_str3;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r19;
	heap32[(g0+2)] = 103;
	_assert(i7);
break;
case 272: 
	r8 = _2E_str7;
	r0 = _2E_str335;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 183;
	_assert(i7);
break;
case 225: 
	r8 = _2E_str29;
	r13 = _2E_str3;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r13;
	heap32[(g0+2)] = 103;
	_assert(i7);
break;
case 215: 
	r8 = _2E_str436;
	r0 = _2E_str335;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 50;
	_assert(i7);
break;
case 209: 
	r8 = _2E_str537;
	r0 = _2E_str335;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 280;
	_assert(i7);
break;
case 207: 
	r8 = _2E_str16170;
	r0 = _2E_str13169;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 676;
	_assert(i7);
break;
case 200: 
	r8 = _2E_str16170;
	r0 = _2E_str17171;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 715;
	_assert(i7);
break;
case 191: 
	r8 = _2E_str23177;
	r0 = _2E_str13169;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 641;
	_assert(i7);
break;
}
	r2 = heap32[(fp+-230)];
	heap8[r2] = r1;
	r1 = heap32[(fp+-222)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	_ZN16b2StackAllocator4FreeEPv(i7);
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r6;
	_ZN16b2StackAllocator4FreeEPv(i7);
	heap32[(g0)] = r1;
	r0 = heap32[(fp+-229)];
	heap32[(g0+1)] = r0;
	_ZN16b2StackAllocator4FreeEPv(i7);
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r5;
	_ZN16b2StackAllocator4FreeEPv(i7);
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r4;
	_ZN16b2StackAllocator4FreeEPv(i7);
	r0 = heap32[(fp+-226)];
	heap32[(r0+25756)] = 0;
}
	r0 = heap32[(fp+-228)];
	r0 = r0 >> 2;
	heap32[(r0)] = 1114636287;
	r0 = heap32[(fp+-227)];
	r0 = heap32[(r0)];
	r1 = r0 & 4;
	if(r1 !=0) //_LBB47_439
{
	r1 = heap32[(fp+-226)];
	r1 = heap32[(r1+25738)];
if(!(r1 ==0)) //_LBB47_438
{
_557: while(true){
	r0 = r1 >> 2;
	heap32[(r0+19)] = 0;
	heap32[(r0+20)] = 0;
	heap32[(r0+21)] = 0;
	r1 = heap32[(r0+24)];
if(!(r1 !=0)) //_LBB47_440
{
break _557;
}
}
	r0 = heap32[(fp+-227)];
	r0 = heap32[(r0)];
}
}
	r0 = r0 & -3;
	r1 = heap32[(fp+-227)];
	heap32[(r1)] = r0;
	r0 = heap32[(fp+-226)];
	heap32[(r0+25749)] = 0;
	return;
break;
}
}

function _ZN7b2World10CreateBodyEPK9b2BodyDef(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var f0;
	var f1;
	var f2;
	var f3;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heapU8[r0+102868];
	r1 = r1 & 2;
	if(r1 ==0) //_LBB48_2
{
	r1 = heap32[(fp+1)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 152;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r2 = r_g0;
	r3 = r1 >> 2;
	f0 = heapFloat[(r3+1)];
if(!(mandreel_fcmp_uno(f0,f0))) //_LBB48_8
{
	f1 = -Infinity;
if(!(f0 <=f1)) //_LBB48_8
{
	f2 = Infinity;
if(!(f0 >=f2)) //_LBB48_8
{
	f0 = heapFloat[(r3+2)];
if(!(mandreel_fcmp_uno(f0,f0))) //_LBB48_8
{
if(!(f0 <=f1)) //_LBB48_8
{
	if(f0 <f2) //_LBB48_9
{
	f0 = heapFloat[(r3+4)];
if(!(mandreel_fcmp_uno(f0,f0))) //_LBB48_15
{
if(!(f0 <=f1)) //_LBB48_15
{
if(!(f0 >=f2)) //_LBB48_15
{
	f0 = heapFloat[(r3+5)];
if(!(mandreel_fcmp_uno(f0,f0))) //_LBB48_15
{
if(!(f0 <=f1)) //_LBB48_15
{
	if(f0 <f2) //_LBB48_16
{
	f0 = heapFloat[(r3+3)];
if(!(mandreel_fcmp_uno(f0,f0))) //_LBB48_19
{
if(!(f0 <=f1)) //_LBB48_19
{
	if(f0 <f2) //_LBB48_20
{
	f0 = heapFloat[(r3+6)];
if(!(mandreel_fcmp_uno(f0,f0))) //_LBB48_23
{
if(!(f0 <=f1)) //_LBB48_23
{
	if(f0 <f2) //_LBB48_24
{
	f0 = heapFloat[(r3+8)];
if(!(mandreel_fcmp_uno(f0,f0))) //_LBB48_28
{
if(!(f0 <=f1)) //_LBB48_28
{
if(!(f0 >=f2)) //_LBB48_28
{
	f3 =                         0;
	if(f0 >=f3) //_LBB48_29
{
	f0 = heapFloat[(r3+7)];
if(!(mandreel_fcmp_uno(f0,f0))) //_LBB48_33
{
if(!(f0 <=f1)) //_LBB48_33
{
if(!(f0 >=f2)) //_LBB48_33
{
	if(f0 >=f3) //_LBB48_34
{
	r4 = 0;
	heap16[(r2+4)>>1] = r4;
	r5 = heapU8[r1+39];
	if(r5 !=0) //_LBB48_36
{
	r4 = 8;
	heap16[(r2+4)>>1] = r4;
}
	r5 = heapU8[r1+38];
	if(r5 !=0) //_LBB48_39
{
	r4 = r4 | 16;
	heap16[(r2+4)>>1] = r4;
}
	r5 = heapU8[r1+36];
	if(r5 !=0) //_LBB48_42
{
	r4 = r4 | 4;
	heap16[(r2+4)>>1] = r4;
}
	r5 = heapU8[r1+37];
	if(r5 !=0) //_LBB48_45
{
	r4 = r4 | 2;
	heap16[(r2+4)>>1] = r4;
}
	r1 = heapU8[r1+40];
if(!(r1 ==0)) //_LBB48_48
{
	r1 = r4 | 32;
	heap16[(r2+4)>>1] = r1;
}
	r1 = r2 >> 2;
	heap32[(r1+22)] = r0;
	f0 = heapFloat[(r3+2)];
	heap32[(r1+3)] = heap32[(r3+1)];
	heapFloat[(r1+4)] = f0;
	f0 = heapFloat[(r3+3)];
	heapFloat[(g0)] = f0;
	sinf(i7);
	heapFloat[(r1+5)] = f_g0;
	heapFloat[(g0)] = f0;
	cosf(i7);
	heapFloat[(r1+6)] = f_g0;
	heap32[(r1+7)] = 0;
	heap32[(r1+8)] = 0;
	f0 = heapFloat[(r1+4)];
	f1 = heapFloat[(r1+3)];
	heapFloat[(r1+9)] = f1;
	heapFloat[(r1+10)] = f0;
	heapFloat[(r1+11)] = f1;
	heapFloat[(r1+12)] = f0;
	heap32[(r1+13)] = heap32[(r3+3)];
	heap32[(r1+14)] = heap32[(r3+3)];
	heap32[(r1+15)] = 0;
	heap32[(r1+27)] = 0;
	heap32[(r1+28)] = 0;
	heap32[(r1+23)] = 0;
	heap32[(r1+24)] = 0;
	f0 = heapFloat[(r3+5)];
	heap32[(r1+16)] = heap32[(r3+4)];
	heapFloat[(r1+17)] = f0;
	heap32[(r1+18)] = heap32[(r3+6)];
	heap32[(r1+33)] = heap32[(r3+7)];
	heap32[(r1+34)] = heap32[(r3+8)];
	heap32[(r1+35)] = heap32[(r3+12)];
	heap32[(r1+19)] = 0;
	heap32[(r1+20)] = 0;
	heap32[(r1+21)] = 0;
	heap32[(r1+36)] = 0;
	r4 = heap32[(r3)];
	heap32[(r1)] = r4;
	if(r4 !=2) //_LBB48_50
{
	heap32[(r1+29)] = 0;
	heap32[(r1+30)] = 0;
}
else{
	heap32[(r1+29)] = 1065353216;
	heap32[(r1+30)] = 1065353216;
}
	heap32[(r1+31)] = 0;
	heap32[(r1+32)] = 0;
	r3 = heap32[(r3+11)];
	heap32[(r1+37)] = r3;
	heap32[(r1+25)] = 0;
	heap32[(r1+26)] = 0;
	r3 = r0 >> 2;
	heap32[(r1+23)] = 0;
	r4 = heap32[(r3+25738)];
	heap32[(r1+24)] = r4;
	r1 = heap32[(r3+25738)];
if(!(r1 ==0)) //_LBB48_53
{
	r1 = r1 >> 2;
	heap32[(r1+23)] = r2;
}
	r0 = (r0 + 102952)&-1;
	r0 = r0 >> 2;
	heap32[(r0)] = r2;
	r0 = heap32[(r3+25740)];
	r0 = (r0 + 1)&-1;
	heap32[(r3+25740)] = r0;
	r_g0 = r2;
	return;
}
}
}
}
	r0 = _2E_str29103;
	r1 = _2E_str2195;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 32;
	_assert(i7);
}
}
}
}
	r0 = _2E_str28102;
	r1 = _2E_str2195;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 31;
	_assert(i7);
}
}
}
	r0 = _2E_str27101;
	r1 = _2E_str2195;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 30;
	_assert(i7);
}
}
}
	r0 = _2E_str26100;
	r1 = _2E_str2195;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 29;
	_assert(i7);
}
}
}
}
}
}
	r0 = _2E_str2599;
	r1 = _2E_str2195;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 28;
	_assert(i7);
}
}
}
}
}
}
	r0 = _2E_str2498;
	r1 = _2E_str2195;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 27;
	_assert(i7);
}
else{
	r0 = _2E_str26180;
	r1 = _2E_str13169;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 109;
	_assert(i7);
}
}

function _ZN15b2ContactFilter13ShouldCollideEP9b2FixtureS1_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = heap32[(fp+2)];
	r2 = heapU16[(r0+36)>>1];
	r3 = heapU16[(r1+36)>>1];
	if(r2 !=r3) //_LBB49_4
{
__label__ = 4;
}
else{
	if(r2 ==0) //_LBB49_4
{
__label__ = 4;
}
else{
	r0 = r2 << 16;
	r0 = r0 >> 16;
	r1 = 0;
	r0 = r0 > r1;
__label__ = 3;
}
}
switch(__label__ ){//multiple entries
case 4: 
	r2 = heapU16[(r1+32)>>1];
	r3 = heapU16[(r0+34)>>1];
	r2 = r2 & r3;
	r2 = r2 & 65535;
	if(r2 ==0) //_LBB49_6
{
	r0 = 0;
	r_g0 = r0;
	return;
}
else{
	r1 = heapU16[(r1+34)>>1];
	r0 = heapU16[(r0+32)>>1];
	r0 = r1 & r0;
	r0 = r0 & 65535;
	r1 = 0;
	r0 = r0 != r1;
}
break;
}
	r0 = r0 & 1;
	r_g0 = r0;
	return;
}

function _ZN15b2ContactFilterD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV15b2ContactFilter;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN15b2ContactFilterD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV15b2ContactFilter;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN23b2ChainAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var f0;
	var f1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+4)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 144;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r0 = r_g0;
	r1 = _ZTV9b2Contact;
	r1 = (r1 + 8)&-1;
	r2 = r0 >> 2;
	heap32[(r2)] = r1;
	r1 = heap32[(fp)];
	heap32[(r2+1)] = 4;
	r3 = heap32[(fp+2)];
	heap32[(r2+12)] = r1;
	r4 = heap32[(fp+1)];
	heap32[(r2+13)] = r3;
	r5 = heap32[(fp+3)];
	heap32[(r2+14)] = r4;
	heap32[(r2+15)] = r5;
	heap32[(r2+31)] = 0;
	heap32[(r2+2)] = 0;
	heap32[(r2+3)] = 0;
	heap32[(r2+5)] = 0;
	heap32[(r2+6)] = 0;
	heap32[(r2+7)] = 0;
	heap32[(r2+4)] = 0;
	heap32[(r2+9)] = 0;
	heap32[(r2+10)] = 0;
	heap32[(r2+11)] = 0;
	heap32[(r2+8)] = 0;
	r3 = r3 >> 2;
	heap32[(r2+32)] = 0;
	r1 = r1 >> 2;
	f0 = heapFloat[(r3+4)];
	f1 = heapFloat[(r1+4)];
	f0 = f1*f0;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	heapFloat[(r2+34)] = f_g0;
	r1 = heap32[(r2+13)];
	r3 = heap32[(r2+12)];
	r1 = r1 >> 2;
	r3 = r3 >> 2;
	f0 = heapFloat[(r1+5)];
	f1 = heapFloat[(r3+5)];
	r4 = _ZTV23b2ChainAndCircleContact;
	f0 = f1 > f0 ? f1 : f0; 
	r4 = (r4 + 8)&-1;
	heapFloat[(r2+35)] = f0;
	heap32[(r2)] = r4;
	r2 = heap32[(r3+3)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+1)];
	if(r2 ==3) //_LBB52_2
{
	r1 = heap32[(r1+3)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	if(r1 ==0) //_LBB52_4
{
	r_g0 = r0;
	return;
}
else{
	r0 = _2E_str2191;
	r1 = _2E_str1190;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 44;
	_assert(i7);
}
}
else{
	r0 = _2E_str189;
	r1 = _2E_str1190;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 43;
	_assert(i7);
}
}

function _ZN23b2ChainAndCircleContactD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV23b2ChainAndCircleContact;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN23b2ChainAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -72;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+12)];
	r1 = r1 >> 2;
	r2 = _ZTV11b2EdgeShape;
	r1 = heap32[(r1+3)];
	r3 = sp + -48; 
	r2 = (r2 + 8)&-1;
	r4 = r3 >> 2;
	heap32[(fp+-12)] = r2;
	heap32[(r4+1)] = 1;
	heap32[(r4+2)] = 1008981770;
	heap32[(r4+7)] = 0;
	heap32[(r4+8)] = 0;
	heap32[(r4+9)] = 0;
	r2 = 0;
	heap32[(r4+10)] = 0;
	heap8[sp+-4] = r2;
	heap8[sp+-3] = r2;
	r2 = heap32[(r0+14)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r2;
	_ZNK12b2ChainShape12GetChildEdgeEP11b2EdgeShapei(i7);
	r0 = heap32[(r0+13)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+3)];
	r1 = heap32[(fp+1)];
	r2 = heap32[(fp+2)];
	r4 = heap32[(fp+3)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r0;
	heap32[(g0+4)] = r4;
	_Z22b2CollideEdgeAndCircleP10b2ManifoldPK11b2EdgeShapeRK11b2TransformPK13b2CircleShapeS6_(i7);
	return;
}

function _ZN23b2ChainAndCircleContactD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV23b2ChainAndCircleContact;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN23b2ChainAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r1 = heap32[(r1)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	heap32[(g0)] = r0;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r1 = heap32[(fp+1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 144;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
	return;
}

function _ZN24b2ChainAndPolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var f0;
	var f1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+4)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 144;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r0 = r_g0;
	r1 = _ZTV9b2Contact;
	r1 = (r1 + 8)&-1;
	r2 = r0 >> 2;
	heap32[(r2)] = r1;
	r1 = heap32[(fp)];
	heap32[(r2+1)] = 4;
	r3 = heap32[(fp+2)];
	heap32[(r2+12)] = r1;
	r4 = heap32[(fp+1)];
	heap32[(r2+13)] = r3;
	r5 = heap32[(fp+3)];
	heap32[(r2+14)] = r4;
	heap32[(r2+15)] = r5;
	heap32[(r2+31)] = 0;
	heap32[(r2+2)] = 0;
	heap32[(r2+3)] = 0;
	heap32[(r2+5)] = 0;
	heap32[(r2+6)] = 0;
	heap32[(r2+7)] = 0;
	heap32[(r2+4)] = 0;
	heap32[(r2+9)] = 0;
	heap32[(r2+10)] = 0;
	heap32[(r2+11)] = 0;
	heap32[(r2+8)] = 0;
	r3 = r3 >> 2;
	heap32[(r2+32)] = 0;
	r1 = r1 >> 2;
	f0 = heapFloat[(r3+4)];
	f1 = heapFloat[(r1+4)];
	f0 = f1*f0;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	heapFloat[(r2+34)] = f_g0;
	r1 = heap32[(r2+13)];
	r3 = heap32[(r2+12)];
	r1 = r1 >> 2;
	r3 = r3 >> 2;
	f0 = heapFloat[(r1+5)];
	f1 = heapFloat[(r3+5)];
	r4 = _ZTV24b2ChainAndPolygonContact;
	f0 = f1 > f0 ? f1 : f0; 
	r4 = (r4 + 8)&-1;
	heapFloat[(r2+35)] = f0;
	heap32[(r2)] = r4;
	r2 = heap32[(r3+3)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+1)];
	if(r2 ==3) //_LBB57_2
{
	r1 = heap32[(r1+3)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	if(r1 ==2) //_LBB57_4
{
	r_g0 = r0;
	return;
}
else{
	r0 = _2E_str2194;
	r1 = _2E_str1193;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 44;
	_assert(i7);
}
}
else{
	r0 = _2E_str189;
	r1 = _2E_str1193;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 43;
	_assert(i7);
}
}

function _ZN24b2ChainAndPolygonContactD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV24b2ChainAndPolygonContact;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN24b2ChainAndPolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -72;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+12)];
	r1 = r1 >> 2;
	r2 = _ZTV11b2EdgeShape;
	r1 = heap32[(r1+3)];
	r3 = sp + -48; 
	r2 = (r2 + 8)&-1;
	r4 = r3 >> 2;
	heap32[(fp+-12)] = r2;
	heap32[(r4+1)] = 1;
	heap32[(r4+2)] = 1008981770;
	heap32[(r4+7)] = 0;
	heap32[(r4+8)] = 0;
	heap32[(r4+9)] = 0;
	r2 = 0;
	heap32[(r4+10)] = 0;
	heap8[sp+-4] = r2;
	heap8[sp+-3] = r2;
	r2 = heap32[(r0+14)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r2;
	_ZNK12b2ChainShape12GetChildEdgeEP11b2EdgeShapei(i7);
	r0 = heap32[(r0+13)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+3)];
	r1 = heap32[(fp+1)];
	r2 = heap32[(fp+2)];
	r4 = heap32[(fp+3)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r0;
	heap32[(g0+4)] = r4;
	_Z23b2CollideEdgeAndPolygonP10b2ManifoldPK11b2EdgeShapeRK11b2TransformPK14b2PolygonShapeS6_(i7);
	return;
}

function _ZN24b2ChainAndPolygonContactD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV24b2ChainAndPolygonContact;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN24b2ChainAndPolygonContact7DestroyEP9b2ContactP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r1 = heap32[(r1)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	heap32[(g0)] = r0;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r1 = heap32[(fp+1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 144;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
	return;
}

function _ZN15b2CircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
	var f1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+4)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 144;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r0 = r_g0;
	r1 = _ZTV9b2Contact;
	r1 = (r1 + 8)&-1;
	r2 = r0 >> 2;
	heap32[(r2)] = r1;
	r1 = heap32[(fp)];
	heap32[(r2+1)] = 4;
	r3 = heap32[(fp+2)];
	heap32[(r2+12)] = r1;
	heap32[(r2+13)] = r3;
	heap32[(r2+14)] = 0;
	heap32[(r2+15)] = 0;
	heap32[(r2+31)] = 0;
	heap32[(r2+2)] = 0;
	heap32[(r2+3)] = 0;
	heap32[(r2+5)] = 0;
	heap32[(r2+6)] = 0;
	heap32[(r2+7)] = 0;
	heap32[(r2+4)] = 0;
	heap32[(r2+9)] = 0;
	heap32[(r2+10)] = 0;
	heap32[(r2+11)] = 0;
	heap32[(r2+8)] = 0;
	r3 = r3 >> 2;
	heap32[(r2+32)] = 0;
	r1 = r1 >> 2;
	f0 = heapFloat[(r3+4)];
	f1 = heapFloat[(r1+4)];
	f0 = f1*f0;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	heapFloat[(r2+34)] = f_g0;
	r1 = heap32[(r2+13)];
	r3 = heap32[(r2+12)];
	r1 = r1 >> 2;
	r3 = r3 >> 2;
	f0 = heapFloat[(r1+5)];
	f1 = heapFloat[(r3+5)];
	r4 = _ZTV15b2CircleContact;
	f0 = f1 > f0 ? f1 : f0; 
	r4 = (r4 + 8)&-1;
	heapFloat[(r2+35)] = f0;
	heap32[(r2)] = r4;
	r2 = heap32[(r3+3)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+1)];
	if(r2 ==0) //_LBB62_2
{
	r1 = heap32[(r1+3)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	if(r1 ==0) //_LBB62_4
{
	r_g0 = r0;
	return;
}
else{
	r0 = _2E_str2191;
	r1 = _2E_str1196;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 45;
	_assert(i7);
}
}
else{
	r0 = _2E_str195;
	r1 = _2E_str1196;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 44;
	_assert(i7);
}
}

function _ZN15b2CircleContactD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV15b2CircleContact;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN15b2CircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+13)];
	r0 = heap32[(r0+12)];
	r1 = r1 >> 2;
	r0 = r0 >> 2;
	r2 = heap32[(fp+1)];
	r1 = heap32[(r1+3)];
	r0 = heap32[(r0+3)];
	r3 = heap32[(fp+3)];
	r4 = heap32[(fp+2)];
	r2 = r2 >> 2;
	r1 = r1 >> 2;
	heap32[(r2+15)] = 0;
	r3 = r3 >> 2;
	r4 = r4 >> 2;
	r0 = r0 >> 2;
	f0 = heapFloat[(r3+2)];
	f1 = heapFloat[(r1+3)];
	f2 = heapFloat[(r3+3)];
	f3 = heapFloat[(r1+4)];
	f4 = heapFloat[(r4+2)];
	f5 = heapFloat[(r0+3)];
	f6 = heapFloat[(r4+3)];
	f7 = heapFloat[(r0+4)];
	f8 = f2*f1;
	f9 = f0*f3;
	f10 = f6*f5;
	f11 = f4*f7;
	f0 = f0*f1;
	f1 = f2*f3;
	f2 = f4*f5;
	f3 = f6*f7;
	f4 = f8-f9;
	f5 = heapFloat[(r3)];
	f6 = f10-f11;
	f7 = heapFloat[(r4)];
	f0 = f0+f1;
	f1 = heapFloat[(r3+1)];
	f2 = f2+f3;
	f3 = heapFloat[(r4+1)];
	f4 = f4+f5;
	f5 = f6+f7;
	f0 = f0+f1;
	f1 = f2+f3;
	f2 = f4-f5;
	f0 = f0-f1;
	f1 = heapFloat[(r0+2)];
	f3 = heapFloat[(r1+2)];
	f1 = f1+f3;
	f2 = f2*f2;
	f0 = f0*f0;
	f1 = f1*f1;
	f0 = f2+f0;
if(!(f1 <f0)) //_LBB64_2
{
	heap32[(r2+14)] = 0;
	f0 = heapFloat[(r0+4)];
	heap32[(r2+12)] = heap32[(r0+3)];
	heapFloat[(r2+13)] = f0;
	heap32[(r2+10)] = 0;
	heap32[(r2+11)] = 0;
	heap32[(r2+15)] = 1;
	f0 = heapFloat[(r1+4)];
	heap32[(r2)] = heap32[(r1+3)];
	heapFloat[(r2+1)] = f0;
	heap32[(r2+4)] = 0;
}
	return;
}

function _ZN15b2CircleContactD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV15b2CircleContact;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN15b2CircleContact7DestroyEP9b2ContactP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r1 = heap32[(r1)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	heap32[(g0)] = r0;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r1 = heap32[(fp+1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 144;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
	return;
}

function _ZN9b2Contact6UpdateEP17b2ContactListener(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var f0;
	var f1;
var __label__ = 0;
	i7 = sp + -216;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = (r0 + 64)&-1;
	r2 = sp + -200; 
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 64;
	memcpy(i7);
	r3 = r0 >> 2;
	r4 = heap32[(r3+1)];
	r5 = r4 | 4;
	heap32[(r3+1)] = r5;
	r5 = heap32[(r3+12)];
	r6 = heap32[(r3+13)];
	r4 = r4 >>> 1;
	r7 = r5 >> 2;
	r8 = r6 >> 2;
	r6 = heapU8[r6+38];
	r5 = heapU8[r5+38];
	r5 = r6 | r5;
	r6 = heap32[(fp+1)];
	r4 = r4 & 1;
	r9 = heap32[(r7+2)];
	r10 = heap32[(r8+2)];
	r5 = r5 & 255;
	if(r5 ==0) //_LBB67_2
{
	r7 = heap32[(r3)];
	r7 = r7 >> 2;
	r7 = heap32[(r7)];
	r8 = (r9 + 12)&-1;
	r11 = (r10 + 12)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r8;
	heap32[(g0+3)] = r11;
	__FUNCTION_TABLE__[(r7)>>2](i7);
	r1 = heap32[(r3+31)];
	r7 = 0;
if(!(r1 <1)) //_LBB67_10
{
	r8 = r2 >> 2;
	r8 = heap32[(r8+15)];
	r11 = r7;
_5: while(true){
	r12 = (r11 * 5)&-1;
	r13 = r12 << 2;
	r13 = (r0 + r13)&-1;
	r13 = r13 >> 2;
	heap32[(r13+18)] = 0;
	heap32[(r13+19)] = 0;
	r14 = heap32[(r13+20)];
	r15 = r7;
_7: while(true){
	if(r8 >r15) //_LBB67_5
{
	r16 = (r15 * 5)&-1;
	r16 = r16 << 2;
	r16 = (r2 + r16)&-1;
	r16 = r16 >> 2;
	r17 = heap32[(r16+4)];
	if(r17 !=r14) //_LBB67_7
{
	r15 = (r15 + 1)&-1;
}
else{
__label__ = 6;
break _7;
}
}
else{
__label__ = 9;
break _7;
}
}
switch(__label__ ){//multiple entries
case 6: 
	r12 = r12 << 2;
	r12 = (r0 + r12)&-1;
	r12 = r12 >> 2;
	heap32[(r12+18)] = heap32[(r16+2)];
	heap32[(r13+19)] = heap32[(r16+3)];
break;
}
	r11 = (r11 + 1)&-1;
if(!(r11 <r1)) //_LBB67_4
{
break _5;
}
}
}
	r1 = r1 > r7;
	r1 = r1 & 1;
	if(r1 !=r4) //_LBB67_12
{
	r7 = heapU16[(r9+4)>>1];
	r8 = r7 & 2;
if(!(r8 !=0)) //_LBB67_14
{
	r7 = r7 | 2;
	r8 = r9 >> 2;
	heap16[(r9+4)>>1] = r7;
	heap32[(r8+36)] = 0;
}
	r7 = heapU16[(r10+4)>>1];
	r8 = r7 & 2;
if(!(r8 !=0)) //_LBB67_11
{
	r7 = r7 | 2;
	r8 = r10 >> 2;
	heap16[(r10+4)>>1] = r7;
	heap32[(r8+36)] = 0;
}
}
}
else{
	r1 = sp + -96; 
	r11 = heap32[(r3+15)];
	r12 = heap32[(r3+14)];
	r7 = heap32[(r7+3)];
	r8 = heap32[(r8+3)];
	r13 = r1 >> 2;
	heap32[(r13+4)] = 0;
	heap32[(r13+5)] = 0;
	heap32[(r13+6)] = 0;
	heap32[(r13+11)] = 0;
	heap32[(r13+12)] = 0;
	heap32[(r13+13)] = 0;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = r12;
	_ZN15b2DistanceProxy3SetEPK7b2Shapei(i7);
	r7 = (r1 + 28)&-1;
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r8;
	heap32[(g0+2)] = r11;
	r9 = r9 >> 2;
	_ZN15b2DistanceProxy3SetEPK7b2Shapei(i7);
	heap32[(r13+14)] = heap32[(r9+3)];
	heap32[(r13+15)] = heap32[(r9+4)];
	heap32[(r13+16)] = heap32[(r9+5)];
	r10 = r10 >> 2;
	heap32[(r13+17)] = heap32[(r9+6)];
	heap32[(r13+18)] = heap32[(r10+3)];
	heap32[(r13+19)] = heap32[(r10+4)];
	heap32[(r13+20)] = heap32[(r10+5)];
	r9 = 1;
	heap32[(r13+21)] = heap32[(r10+6)];
	r10 = 0;
	heap8[sp+-8] = r9;
	heap16[(sp+-108)>>1] = r10;
	r9 = sp + -136; 
	r10 = sp + -112; 
	heap32[(g0)] = r9;
	heap32[(g0+1)] = r10;
	heap32[(g0+2)] = r1;
	_Z10b2DistanceP16b2DistanceOutputP14b2SimplexCachePK15b2DistanceInput(i7);
	r1 = r9 >> 2;
	f0 = heapFloat[(r1+4)];
	f1 =   1.1920928955078125e-006;
	r1 = f0 < f1;
	r1 = r1 & 1;
	heap32[(r3+31)] = 0;
}
	r7 = heap32[(r3+1)];
	r1 = r1 & 255;
_22: do {
	if(r1 ==0) //_LBB67_20
{
	r2 = r7 & -3;
	heap32[(r3+1)] = r2;
	if(r4 ==0) //_LBB67_26
{
break _22;
}
else{
	if(r6 ==0) //_LBB67_26
{
break _22;
}
else{
	r2 = r6 >> 2;
	r2 = heap32[(r2)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+3)];
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r0;
	__FUNCTION_TABLE__[(r2)>>2](i7);
	return;
}
}
}
else{
	r7 = r7 | 2;
	heap32[(r3+1)] = r7;
if(!(r4 != 0)) //_LBB67_23
{
if(!(r6 ==0)) //_LBB67_23
{
	r3 = r6 >> 2;
	r3 = heap32[(r3)];
	r3 = r3 >> 2;
	r3 = heap32[(r3+2)];
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r0;
	__FUNCTION_TABLE__[(r3)>>2](i7);
}
}
if(!(r5 !=0)) //_LBB67_26
{
if(!(r6 ==0)) //_LBB67_26
{
	r1 = r6 >> 2;
	r1 = heap32[(r1)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+4)];
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r2;
	__FUNCTION_TABLE__[(r1)>>2](i7);
}
}
}
} while(0);
	return;
}

function _ZN9b2ContactD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV9b2Contact;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN9b2ContactD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV9b2Contact;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN15b2ContactSolver24SolveVelocityConstraintsEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
	var f16;
	var f17;
	var f18;
	var f19;
	var f20;
	var f21;
	var f22;
	var f23;
	var f24;
	var f25;
	var f26;
	var f27;
	var f28;
	var f29;
	var f30;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = 0;
	r2 = r1;
_1: while(true){
	r3 = r0 >> 2;
	r4 = heap32[(r3+12)];
	if(r4 >r2) //_LBB70_1
{
	r4 = heap32[(r3+10)];
	r4 = (r4 + r1)&-1;
	r5 = r4 >> 2;
	r6 = heap32[(r5+36)];
	r7 = (r6 + -1)&-1;
	if(uint(r7) >uint(1)) //_LBB70_5
{
__label__ = 4;
break _1;
}
else{
	r7 = heap32[(r5+28)];
	r8 = heap32[(r5+29)];
	r7 = (r7 * 12)&-1;
	r9 = heap32[(r3+7)];
	r8 = (r8 * 12)&-1;
	r10 = (r9 + r7)&-1;
	r9 = (r9 + r8)&-1;
	r10 = r10 >> 2;
	r9 = r9 >> 2;
	f0 = heapFloat[(r5+18)];
	f1 = heapFloat[(r5+30)];
	f2 = heapFloat[(r5+32)];
	f3 = heapFloat[(r5+31)];
	f4 = heapFloat[(r5+33)];
	f5 = heapFloat[(r10)];
	f6 = heapFloat[(r10+1)];
	f7 = heapFloat[(r10+2)];
	f8 = heapFloat[(r9)];
	f9 = heapFloat[(r9+1)];
	f10 = heapFloat[(r9+2)];
	f11 = heapFloat[(r5+19)];
	if(r6 >0) //_LBB70_4
{
	f12 = -f0;
	f13 = heapFloat[(r5+34)];
	r9 = 0;
_7: while(true){
	r10 = (r9 * 9)&-1;
	r10 = r10 << 2;
	r10 = (r4 + r10)&-1;
	r10 = r10 >> 2;
	f14 = heapFloat[(r10+2)];
	f15 = heapFloat[(r10+3)];
	f16 = f15*f10;
	f17 = f14*f10;
	f16 = f8-f16;
	f17 = f9+f17;
	f18 = heapFloat[(r10)];
	f19 = heapFloat[(r10+1)];
	f16 = f16-f5;
	f20 = f19*f7;
	f17 = f17-f6;
	f21 = f18*f7;
	f16 = f16+f20;
	f17 = f17-f21;
	f16 = f16*f11;
	f17 = f17*f12;
	f16 = f16+f17;
	f17 = heapFloat[(r10+7)];
	f16 = f17*f16;
	f17 = heapFloat[(r10+5)];
	f20 = heapFloat[(r10+4)];
	f20 = f20*f13;
	f16 = f17-f16;
	f16 = f16 < f20 ? f16 : f20; 
	f20 = -f20;
	f16 = f16 < f20 ? f20 : f16; 
	f17 = f16-f17;
	f20 = f12*f17;
	f17 = f11*f17;
	f18 = f18*f20;
	f19 = f19*f17;
	f14 = f14*f20;
	f15 = f15*f17;
	f18 = f18-f19;
	f14 = f14-f15;
	f15 = f17*f1;
	f19 = f20*f1;
	f18 = f18*f2;
	f17 = f17*f3;
	f20 = f20*f3;
	f14 = f14*f4;
	r9 = (r9 + 1)&-1;
	f5 = f5-f15;
	f6 = f6-f19;
	f7 = f7-f18;
	f8 = f8+f17;
	f9 = f9+f20;
	f10 = f14+f10;
	heapFloat[(r10+5)] = f16;
if(!(r6 !=r9)) //_LBB70_6
{
break _7;
}
}
	if(r6 ==1) //_LBB70_9
{
	f12 = heapFloat[(r5+2)];
	f13 = heapFloat[(r5+3)];
	f14 = f13*f10;
	f15 = f12*f10;
	f14 = f8-f14;
	f15 = f9+f15;
	f16 = heapFloat[(r5)];
	f17 = heapFloat[(r5+1)];
	f14 = f14-f5;
	f18 = f17*f7;
	f15 = f15-f6;
	f19 = f16*f7;
	f14 = f14+f18;
	f15 = f15-f19;
	f14 = f14*f0;
	f15 = f15*f11;
	f14 = f14+f15;
	f15 = heapFloat[(r5+8)];
	f14 = f14-f15;
	f15 = heapFloat[(r5+6)];
	f18 = heapFloat[(r5+4)];
	f14 = f14*f15;
	f14 = f18-f14;
	f15 =                         0;
	f14 = f14 > f15 ? f14 : f15; 
	f15 = f14-f18;
	f11 = f11*f15;
	f0 = f0*f15;
	f15 = f16*f11;
	f16 = f17*f0;
	f12 = f12*f11;
	f13 = f13*f0;
	f15 = f15-f16;
	f12 = f12-f13;
	f13 = f0*f1;
	f1 = f11*f1;
	f2 = f15*f2;
	f0 = f0*f3;
	f3 = f11*f3;
	f4 = f12*f4;
	f5 = f5-f13;
	f6 = f6-f1;
	f7 = f7-f2;
	f8 = f8+f0;
	f9 = f9+f3;
	f10 = f4+f10;
	heapFloat[(r5+4)] = f14;
__label__ = 23;
}
else{
__label__ = 8;
}
}
else{
__label__ = 8;
}
_11: do {
switch(__label__ ){//multiple entries
case 8: 
	f12 = heapFloat[(r5+4)];
	f13 =                         0;
	if(f12 <f13) //_LBB70_12
{
__label__ = 10;
break _1;
}
else{
	f14 = heapFloat[(r5+13)];
	if(f14 >=f13) //_LBB70_13
{
	f15 = heapFloat[(r5+3)];
	f16 = heapFloat[(r5+2)];
	f17 = heapFloat[(r5+12)];
	heapFloat[(fp+-1)] = f17;
	f18 = heapFloat[(r5+11)];
	heapFloat[(fp+-2)] = f18;
	f19 = f15*f10;
	f17 = f17*f10;
	f20 = f16*f10;
	f18 = f18*f10;
	f21 = heapFloat[(r5+1)];
	f22 = heapFloat[(r5)];
	f23 = heapFloat[(r5+10)];
	f24 = heapFloat[(r5+9)];
	f19 = f8-f19;
	f17 = f8-f17;
	f20 = f9+f20;
	f18 = f9+f18;
	f19 = f19-f5;
	f25 = f21*f7;
	f20 = f20-f6;
	f26 = f22*f7;
	f17 = f17-f5;
	f27 = f23*f7;
	f18 = f18-f6;
	f28 = f24*f7;
	f19 = f19+f25;
	f17 = f17+f27;
	f20 = f20-f26;
	f18 = f18-f28;
	f25 = heapFloat[(r5+26)];
	f26 = heapFloat[(r5+25)];
	f27 = heapFloat[(r5+24)];
	f28 = heapFloat[(r5+27)];
	f19 = f19*f0;
	f20 = f20*f11;
	f17 = f17*f0;
	f18 = f18*f11;
	f19 = f19+f20;
	f20 = heapFloat[(r5+8)];
	f27 = f27*f12;
	f29 = f25*f14;
	f17 = f17+f18;
	f18 = heapFloat[(r5+17)];
	f30 = f26*f12;
	f28 = f28*f14;
	f19 = f19-f20;
	f20 = f27+f29;
	f17 = f17-f18;
	f18 = f30+f28;
	f19 = f19-f20;
	f20 = heapFloat[(r5+20)];
	f17 = f17-f18;
	f18 = heapFloat[(r5+22)];
	f20 = f20*f19;
	f18 = f18*f17;
	f18 = f20+f18;
	f18 = -f18;
if(!(f18 <f13)) //_LBB70_16
{
	f20 = heapFloat[(r5+21)];
	f27 = heapFloat[(r5+23)];
	f20 = f20*f19;
	f27 = f27*f17;
	f20 = f20+f27;
	f20 = -f20;
if(!(f20 <f13)) //_LBB70_16
{
	f12 = f18-f12;
	f13 = f20-f14;
	f14 = f11*f12;
	f11 = f11*f13;
	f12 = f0*f12;
	f0 = f0*f13;
	f13 = f22*f14;
	f17 = f21*f12;
	f19 = f24*f11;
	f21 = f23*f0;
	f16 = f16*f14;
	f15 = f15*f12;
	f22 = heapFloat[(fp+-2)];
	f22 = f22*f11;
	f23 = heapFloat[(fp+-1)];
	f23 = f23*f0;
	f13 = f13-f17;
	f17 = f19-f21;
	f15 = f16-f15;
	f16 = f22-f23;
	f0 = f12+f0;
	f11 = f14+f11;
	f12 = f13+f17;
	f13 = f15+f16;
	f14 = f0*f1;
	f1 = f11*f1;
	f2 = f12*f2;
	f0 = f0*f3;
	f3 = f11*f3;
	f4 = f13*f4;
	f5 = f5-f14;
	f6 = f6-f1;
	f7 = f7-f2;
	f8 = f8+f0;
	f9 = f9+f3;
	f10 = f4+f10;
	heapFloat[(r5+4)] = f18;
	heapFloat[(r5+13)] = f20;
break _11;
}
}
	f18 = heapFloat[(r5+6)];
	f18 = -f18;
	f18 = f19*f18;
if(!(f18 <f13)) //_LBB70_19
{
	f20 = f26*f18;
	f20 = f20+f17;
if(!(f20 <f13)) //_LBB70_19
{
	f12 = f18-f12;
	f13 = f13-f14;
	f14 = f11*f12;
	f11 = f11*f13;
	f12 = f0*f12;
	f0 = f0*f13;
	f13 = f22*f14;
	f17 = f21*f12;
	f19 = f24*f11;
	f21 = f23*f0;
	f16 = f16*f14;
	f15 = f15*f12;
	f22 = heapFloat[(fp+-2)];
	f22 = f22*f11;
	f23 = heapFloat[(fp+-1)];
	f23 = f23*f0;
	f13 = f13-f17;
	f17 = f19-f21;
	f15 = f16-f15;
	f16 = f22-f23;
	f0 = f12+f0;
	f11 = f14+f11;
	f12 = f13+f17;
	f13 = f15+f16;
	f14 = f0*f1;
	f1 = f11*f1;
	f2 = f12*f2;
	f0 = f0*f3;
	f3 = f11*f3;
	f4 = f13*f4;
	f5 = f5-f14;
	f6 = f6-f1;
	f7 = f7-f2;
	f8 = f8+f0;
	f9 = f9+f3;
	f10 = f4+f10;
	heapFloat[(r5+4)] = f18;
	heap32[(r5+13)] = 0;
break _11;
}
}
	f18 = heapFloat[(r5+15)];
	f18 = -f18;
	f18 = f17*f18;
if(!(f18 <f13)) //_LBB70_22
{
	f20 = f25*f18;
	f20 = f20+f19;
if(!(f20 <f13)) //_LBB70_22
{
	f12 = f13-f12;
	f13 = f18-f14;
	f14 = f11*f12;
	f11 = f11*f13;
	f12 = f0*f12;
	f0 = f0*f13;
	f13 = f22*f14;
	f17 = f21*f12;
	f19 = f24*f11;
	f21 = f23*f0;
	f16 = f16*f14;
	f15 = f15*f12;
	f22 = heapFloat[(fp+-2)];
	f22 = f22*f11;
	f23 = heapFloat[(fp+-1)];
	f23 = f23*f0;
	f13 = f13-f17;
	f17 = f19-f21;
	f15 = f16-f15;
	f16 = f22-f23;
	f0 = f12+f0;
	f11 = f14+f11;
	f12 = f13+f17;
	f13 = f15+f16;
	f14 = f0*f1;
	f1 = f11*f1;
	f2 = f12*f2;
	f0 = f0*f3;
	f3 = f11*f3;
	f4 = f13*f4;
	f5 = f5-f14;
	f6 = f6-f1;
	f7 = f7-f2;
	f8 = f8+f0;
	f9 = f9+f3;
	f10 = f4+f10;
	heap32[(r5+4)] = 0;
	heapFloat[(r5+13)] = f18;
break _11;
}
}
if(!(f19 <f13)) //_LBB70_24
{
	if(f17 >=f13) //_LBB70_25
{
	f12 = f13-f12;
	f13 = f13-f14;
	f14 = f11*f12;
	f11 = f11*f13;
	f12 = f0*f12;
	f0 = f0*f13;
	f13 = f22*f14;
	f17 = f21*f12;
	f18 = f24*f11;
	f19 = f23*f0;
	f16 = f16*f14;
	f15 = f15*f12;
	f20 = heapFloat[(fp+-2)];
	f20 = f20*f11;
	f21 = heapFloat[(fp+-1)];
	f21 = f21*f0;
	f13 = f13-f17;
	f17 = f18-f19;
	f15 = f16-f15;
	f16 = f20-f21;
	f0 = f12+f0;
	f11 = f14+f11;
	f12 = f13+f17;
	f13 = f15+f16;
	f14 = f0*f1;
	f1 = f11*f1;
	f2 = f12*f2;
	f0 = f0*f3;
	f3 = f11*f3;
	f4 = f13*f4;
	f5 = f5-f14;
	f6 = f6-f1;
	f7 = f7-f2;
	f8 = f8+f0;
	f9 = f9+f3;
	f10 = f4+f10;
	heap32[(r5+4)] = 0;
	heap32[(r5+13)] = 0;
}
}
}
else{
__label__ = 10;
break _1;
}
}
break;
}
} while(0);
	r4 = heap32[(r3+7)];
	r4 = (r4 + r7)&-1;
	r4 = r4 >> 2;
	heapFloat[(r4)] = f5;
	heapFloat[(r4+1)] = f6;
	r4 = heap32[(r3+7)];
	r4 = (r4 + r7)&-1;
	r4 = r4 >> 2;
	heapFloat[(r4+2)] = f7;
	r4 = heap32[(r3+7)];
	r4 = (r4 + r8)&-1;
	r4 = r4 >> 2;
	heapFloat[(r4)] = f8;
	heapFloat[(r4+1)] = f9;
	r3 = heap32[(r3+7)];
	r3 = (r3 + r8)&-1;
	r2 = (r2 + 1)&-1;
	r1 = (r1 + 152)&-1;
	r3 = r3 >> 2;
	heapFloat[(r3+2)] = f10;
continue _1;
}
}
else{
__label__ = 25;
break _1;
}
}
switch(__label__ ){//multiple entries
case 4: 
	r0 = _2E_str207;
	r1 = _2E_str1208;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 311;
	_assert(i7);
break;
case 25: 
	return;
break;
case 10: 
	r0 = _2E_str2209;
	r1 = _2E_str1208;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 406;
	_assert(i7);
break;
}
}

function _ZN24b2PositionSolverManifold10InitializeEP27b2ContactPositionConstraintRK11b2TransformS4_i(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = r0 >> 2;
	r2 = heap32[(r1+21)];
	if(r2 >0) //_LBB71_2
{
	r2 = heap32[(fp)];
	r3 = heap32[(fp+2)];
	r4 = heap32[(fp+3)];
	r5 = heap32[(fp+4)];
	r6 = heap32[(r1+18)];
	if(r6 ==2) //_LBB71_10
{
	r4 = r4 >> 2;
	f0 = heapFloat[(r4+2)];
	f1 = heapFloat[(r1+4)];
	f2 = heapFloat[(r4+3)];
	f3 = heapFloat[(r1+5)];
	f4 = f2*f1;
	f5 = f0*f3;
	r5 = r5 << 3;
	f4 = f4-f5;
	r2 = r2 >> 2;
	f0 = f0*f1;
	f1 = f2*f3;
	r0 = (r0 + r5)&-1;
	f0 = f0+f1;
	heapFloat[(r2)] = f4;
	heapFloat[(r2+1)] = f0;
	r3 = r3 >> 2;
	r0 = r0 >> 2;
	f1 = heapFloat[(r4+3)];
	f2 = heapFloat[(r1+6)];
	f3 = heapFloat[(r4+2)];
	f5 = heapFloat[(r1+7)];
	f6 = heapFloat[(r3+3)];
	f7 = heapFloat[(r0)];
	f8 = heapFloat[(r3+2)];
	f9 = heapFloat[(r0+1)];
	f10 = f8*f7;
	f11 = f6*f9;
	f6 = f6*f7;
	f7 = f8*f9;
	f8 = f1*f2;
	f9 = f3*f5;
	f2 = f3*f2;
	f1 = f1*f5;
	f3 = f10+f11;
	f5 = heapFloat[(r3+1)];
	f6 = f6-f7;
	f7 = heapFloat[(r3)];
	f8 = f8-f9;
	f9 = heapFloat[(r4)];
	f1 = f2+f1;
	f2 = heapFloat[(r4+1)];
	f3 = f3+f5;
	f1 = f1+f2;
	f2 = f6+f7;
	f5 = f8+f9;
	f5 = f2-f5;
	f1 = f3-f1;
	f5 = f5*f4;
	f1 = f1*f0;
	f1 = f5+f1;
	f5 = heapFloat[(r1+19)];
	f6 = heapFloat[(r1+20)];
	f1 = f1-f5;
	f1 = f1-f6;
	heapFloat[(r2+4)] = f1;
	heapFloat[(r2+2)] = f2;
	f1 = -f4;
	heapFloat[(r2+3)] = f3;
	f0 = -f0;
	heapFloat[(r2)] = f1;
	heapFloat[(r2+1)] = f0;
}
else{
	if(r6 ==1) //_LBB71_9
{
	r3 = r3 >> 2;
	f0 = heapFloat[(r3+2)];
	f1 = heapFloat[(r1+4)];
	f2 = heapFloat[(r3+3)];
	f3 = heapFloat[(r1+5)];
	f4 = f2*f1;
	f5 = f0*f3;
	r5 = r5 << 3;
	r2 = r2 >> 2;
	f0 = f0*f1;
	f1 = f2*f3;
	f2 = f4-f5;
	r0 = (r0 + r5)&-1;
	f0 = f0+f1;
	heapFloat[(r2)] = f2;
	heapFloat[(r2+1)] = f0;
	r4 = r4 >> 2;
	r0 = r0 >> 2;
	f1 = heapFloat[(r3+3)];
	f3 = heapFloat[(r1+6)];
	f4 = heapFloat[(r3+2)];
	f5 = heapFloat[(r1+7)];
	f6 = heapFloat[(r4+3)];
	f7 = heapFloat[(r0)];
	f8 = heapFloat[(r4+2)];
	f9 = heapFloat[(r0+1)];
	f10 = f8*f7;
	f11 = f6*f9;
	f6 = f6*f7;
	f7 = f8*f9;
	f8 = f1*f3;
	f9 = f4*f5;
	f3 = f4*f3;
	f1 = f1*f5;
	f4 = f10+f11;
	f5 = heapFloat[(r4+1)];
	f6 = f6-f7;
	f7 = heapFloat[(r4)];
	f8 = f8-f9;
	f9 = heapFloat[(r3)];
	f1 = f3+f1;
	f3 = heapFloat[(r3+1)];
	f4 = f4+f5;
	f1 = f1+f3;
	f3 = f6+f7;
	f5 = f8+f9;
	f5 = f3-f5;
	f1 = f4-f1;
	f2 = f5*f2;
	f0 = f1*f0;
	f0 = f2+f0;
	f1 = heapFloat[(r1+19)];
	f2 = heapFloat[(r1+20)];
	f0 = f0-f1;
	f0 = f0-f2;
	heapFloat[(r2+4)] = f0;
	heapFloat[(r2+2)] = f3;
	heapFloat[(r2+3)] = f4;
	return;
}
else{
if(!(r6 !=0)) //_LBB71_11
{
	r0 = r4 >> 2;
	r3 = r3 >> 2;
	f0 = heapFloat[(r0+3)];
	f1 = heapFloat[(r1)];
	f2 = heapFloat[(r0+2)];
	f3 = heapFloat[(r1+1)];
	f4 = heapFloat[(r3+3)];
	f5 = heapFloat[(r1+6)];
	f6 = heapFloat[(r3+2)];
	f7 = heapFloat[(r1+7)];
	f8 = f0*f1;
	f9 = f2*f3;
	f10 = f4*f5;
	f11 = f6*f7;
	f1 = f2*f1;
	f0 = f0*f3;
	f2 = f6*f5;
	f3 = f4*f7;
	f4 = f8-f9;
	f5 = heapFloat[(r0)];
	f6 = f10-f11;
	f7 = heapFloat[(r3)];
	f4 = f4+f5;
	f5 = f6+f7;
	f0 = f1+f0;
	f1 = heapFloat[(r0+1)];
	f6 = heapFloat[(r3+1)];
	f2 = f2+f3;
	f3 = f4-f5;
	f0 = f0+f1;
	f1 = f2+f6;
	r0 = r2 >> 2;
	f2 = f0-f1;
	heapFloat[(r0)] = f3;
	heapFloat[(r0+1)] = f2;
	f6 = f3*f3;
	f7 = f2*f2;
	f6 = f6+f7;
	heapFloat[(g0)] = f6;
	sqrtf(i7);
	f6 = f_g0;
	f7 =   1.1920928955078125e-007;
	if(f6 >=f7) //_LBB71_7
{
	f7 =                         1;
	f7 = f7/f6;
	f6 = heapFloat[(r0)];
	f6 = f6*f7;
	heapFloat[(r0)] = f6;
	f8 = heapFloat[(r0+1)];
	f7 = f8*f7;
	heapFloat[(r0+1)] = f7;
}
else{
	f6 = heapFloat[(r0)];
	f7 = heapFloat[(r0+1)];
}
	f4 = f5+f4;
	f5 =                       0.5;
	f0 = f1+f0;
	f1 = f4*f5;
	f0 = f0*f5;
	heapFloat[(r0+2)] = f1;
	f1 = f3*f6;
	f2 = f2*f7;
	heapFloat[(r0+3)] = f0;
	f0 = f1+f2;
	f1 = heapFloat[(r1+19)];
	f2 = heapFloat[(r1+20)];
	f0 = f0-f1;
	f0 = f0-f2;
	heapFloat[(r0+4)] = f0;
	return;
}
}
}
	return;
}
else{
	r0 = _2E_str3210;
	r1 = _2E_str1208;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 617;
	_assert(i7);
}
}

function _ZN15b2ContactSolver29InitializeVelocityConstraintsEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
	var f16;
	var f17;
	var f18;
	var f19;
	var f20;
	var f21;
	var f22;
	var f23;
	var f24;
	var f25;
	var f26;
	var f27;
	var f28;
	var f29;
var __label__ = 0;
	i7 = sp + -40;var g0 = i7>>2; // save stack
	r0 = sp + -24; 
	r1 = heap32[(fp)];
	r2 = (r0 + 12)&-1;
	r3 = 32;
	r4 = 0;
_1: while(true){
	r5 = r1 >> 2;
	r6 = heap32[(r5+12)];
	if(r6 >r4) //_LBB72_1
{
	r6 = (r4 * 38)&-1;
	r7 = heap32[(r5+10)];
	r8 = r6 << 2;
	r8 = (r7 + r8)&-1;
	r8 = r8 >> 2;
	r9 = heap32[(r8+37)];
	r10 = heap32[(r5+11)];
	r9 = r9 << 2;
	r9 = (r10 + r9)&-1;
	r9 = r9 >> 2;
	r9 = heap32[(r9)];
	r10 = r9 >> 2;
	r11 = heap32[(r10+31)];
	if(r11 >0) //_LBB72_3
{
	r11 = (r4 * 22)&-1;
	r12 = heap32[(r8+28)];
	r13 = heap32[(r8+29)];
	r14 = heap32[(r5+9)];
	r11 = r11 << 2;
	r12 = (r12 * 12)&-1;
	r15 = heap32[(r5+6)];
	r5 = heap32[(r5+7)];
	r13 = (r13 * 12)&-1;
	r11 = (r14 + r11)&-1;
	r14 = (r15 + r12)&-1;
	r12 = (r5 + r12)&-1;
	r15 = (r15 + r13)&-1;
	r5 = (r5 + r13)&-1;
	r11 = r11 >> 2;
	r13 = r14 >> 2;
	r12 = r12 >> 2;
	r14 = r15 >> 2;
	r5 = r5 >> 2;
	f0 = heapFloat[(r8+30)];
	f1 = heapFloat[(r8+31)];
	f2 = heapFloat[(r8+32)];
	f3 = heapFloat[(r8+33)];
	f4 = heapFloat[(r11+12)];
	f5 = heapFloat[(r11+13)];
	f6 = heapFloat[(r11+14)];
	f7 = heapFloat[(r11+15)];
	f8 = heapFloat[(r13)];
	f9 = heapFloat[(r13+1)];
	f10 = heapFloat[(r13+2)];
	f11 = heapFloat[(r12)];
	f12 = heapFloat[(r12+1)];
	f13 = heapFloat[(r12+2)];
	f14 = heapFloat[(r14)];
	f15 = heapFloat[(r14+1)];
	f16 = heapFloat[(r14+2)];
	f17 = heapFloat[(r5)];
	f18 = heapFloat[(r5+1)];
	f19 = heapFloat[(r5+2)];
	f20 = heapFloat[(r11+20)];
	f21 = heapFloat[(r11+19)];
	heapFloat[(g0)] = f10;
	sinf(i7);
	f22 = f_g0;
	heapFloat[(g0)] = f10;
	cosf(i7);
	f10 = f_g0;
	heapFloat[(g0)] = f16;
	sinf(i7);
	f23 = f_g0;
	heapFloat[(g0)] = f16;
	cosf(i7);
	f16 = f_g0;
	r5 = heap32[(r10+31)];
_5: do {
if(!(r5 ==0)) //_LBB72_24
{
	f24 = f22*f4;
	f25 = f10*f5;
	f4 = f10*f4;
	f5 = f22*f5;
	f26 = f23*f6;
	f27 = f16*f7;
	f6 = f16*f6;
	f7 = f23*f7;
	f24 = f24+f25;
	f4 = f4-f5;
	f5 = f26+f27;
	f6 = f6-f7;
	f7 = f9-f24;
	f4 = f8-f4;
	f5 = f15-f5;
	f6 = f14-f6;
	r11 = heap32[(r10+30)];
	if(r11 ==2) //_LBB72_17
{
	f24 = heapFloat[(r10+26)];
	f25 = heapFloat[(r10+27)];
	f26 = f16*f24;
	f27 = f23*f25;
	f26 = f26-f27;
	f24 = f23*f24;
	f25 = f16*f25;
	f24 = f24+f25;
	r11 = r0 >> 2;
	heapFloat[(fp+-6)] = f26;
	heapFloat[(r11+1)] = f24;
	if(r5 >0) //_LBB72_19
{
	f25 = heapFloat[(r10+28)];
	f27 = heapFloat[(r10+29)];
	f28 = f16*f25;
	f29 = f23*f27;
	f23 = f23*f25;
	f16 = f16*f27;
	f25 = f28-f29;
	f16 = f23+f16;
	f6 = f25+f6;
	f5 = f16+f5;
	r10 = 1;
_11: while(true){
	r12 = (r10 * 5)&-1;
	r12 = r12 << 2;
	r12 = (r9 + r12)&-1;
	r12 = r12 >> 2;
	f16 = heapFloat[(r12+11)];
	f23 = heapFloat[(r12+12)];
	f25 = f10*f16;
	f27 = f22*f23;
	f16 = f22*f16;
	f23 = f10*f23;
	f25 = f25-f27;
	f16 = f16+f23;
	f23 = f25+f4;
	f16 = f16+f7;
	f25 = f23-f6;
	f27 = f16-f5;
	f25 = f25*f26;
	f27 = f27*f24;
	f25 = f25+f27;
	f25 = f20-f25;
	f27 = f26*f21;
	f26 = f26*f25;
	f28 = f24*f21;
	f24 = f24*f25;
	r12 = r10 << 3;
	f25 = f23-f27;
	f26 = f23+f26;
	r12 = (r0 + r12)&-1;
	f23 = f16-f28;
	f24 = f16+f24;
	f26 = f25+f26;
	f16 =                       0.5;
	f24 = f23+f24;
	r12 = r12 >> 2;
	f26 = f26*f16;
	f24 = f24*f16;
	heapFloat[(r12)] = f26;
	heapFloat[(r12+1)] = f24;
	if(r5 <=r10) //_LBB72_22
{
break _11;
}
else{
	f26 = heapFloat[(fp+-6)];
	f24 = heapFloat[(r11+1)];
	r10 = (r10 + 1)&-1;
}
}
	f24 = heapFloat[(r11+1)];
	f26 = heapFloat[(fp+-6)];
}
	f4 = -f26;
	f5 = -f24;
	heapFloat[(fp+-6)] = f4;
	heapFloat[(r11+1)] = f5;
}
else{
	if(r11 ==1) //_LBB72_13
{
	f24 = heapFloat[(r10+26)];
	f25 = heapFloat[(r10+27)];
	f26 = f10*f24;
	f27 = f22*f25;
	f26 = f26-f27;
	f24 = f22*f24;
	f25 = f10*f25;
	f24 = f24+f25;
	r11 = r0 >> 2;
	heapFloat[(fp+-6)] = f26;
	heapFloat[(r11+1)] = f24;
if(!(r5 <1)) //_LBB72_24
{
	f25 = heapFloat[(r10+28)];
	f27 = heapFloat[(r10+29)];
	f28 = f10*f25;
	f29 = f22*f27;
	f22 = f22*f25;
	f10 = f10*f27;
	f25 = f28-f29;
	f10 = f22+f10;
	f4 = f25+f4;
	f7 = f10+f7;
	r10 = 1;
_20: while(true){
	r12 = (r10 * 5)&-1;
	r12 = r12 << 2;
	r12 = (r9 + r12)&-1;
	r12 = r12 >> 2;
	f10 = heapFloat[(r12+11)];
	f22 = heapFloat[(r12+12)];
	f25 = f23*f10;
	f27 = f16*f22;
	f10 = f16*f10;
	f22 = f23*f22;
	f25 = f25+f27;
	f10 = f10-f22;
	f10 = f10+f6;
	f22 = f25+f5;
	f25 = f10-f4;
	f27 = f22-f7;
	f25 = f25*f26;
	f27 = f27*f24;
	f25 = f25+f27;
	f25 = f21-f25;
	f27 = f26*f25;
	f26 = f26*f20;
	f25 = f24*f25;
	f24 = f24*f20;
	r12 = r10 << 3;
	f27 = f10+f27;
	f10 = f10-f26;
	r12 = (r0 + r12)&-1;
	f26 = f22+f25;
	f22 = f22-f24;
	f10 = f27+f10;
	f24 =                       0.5;
	f22 = f26+f22;
	r12 = r12 >> 2;
	f10 = f10*f24;
	f22 = f22*f24;
	heapFloat[(r12)] = f10;
	heapFloat[(r12+1)] = f22;
	if(r5 <=r10) //_LBB72_24
{
break _5;
}
else{
	f26 = heapFloat[(fp+-6)];
	f24 = heapFloat[(r11+1)];
	r10 = (r10 + 1)&-1;
continue _20;
}
}
}
}
else{
if(!(r11 !=0)) //_LBB72_24
{
	r5 = r0 >> 2;
	heap32[(fp+-6)] = 1065353216;
	heap32[(r5+1)] = 0;
	f24 = heapFloat[(r10+28)];
	f25 = heapFloat[(r10+29)];
	f26 = heapFloat[(r10+16)];
	f27 = heapFloat[(r10+17)];
	f28 = f10*f24;
	f29 = f22*f25;
	f22 = f22*f24;
	f10 = f10*f25;
	f24 = f16*f26;
	f25 = f23*f27;
	f23 = f23*f26;
	f16 = f16*f27;
	f26 = f28-f29;
	f10 = f22+f10;
	f22 = f24-f25;
	f16 = f23+f16;
	f4 = f26+f4;
	f6 = f22+f6;
	f7 = f10+f7;
	f5 = f16+f5;
	f10 = f4-f6;
	f16 = f7-f5;
	f10 = f10*f10;
	f16 = f16*f16;
	f10 = f10+f16;
	f16 =   1.4210854715202004e-014;
	if(f10 >f16) //_LBB72_9
{
	f10 = f6-f4;
	f16 = f5-f7;
	heapFloat[(fp+-6)] = f10;
	heapFloat[(r5+1)] = f16;
	f22 = f10*f10;
	f23 = f16*f16;
	f22 = f22+f23;
	heapFloat[(g0)] = f22;
	sqrtf(i7);
	f22 = f_g0;
	f23 =   1.1920928955078125e-007;
	if(f22 >=f23) //_LBB72_11
{
	f23 =                         1;
	f22 = f23/f22;
	f10 = f10*f22;
	f16 = f16*f22;
	heapFloat[(fp+-6)] = f10;
	heapFloat[(r5+1)] = f16;
}
}
else{
	f10 =                         1;
	f16 =                         0;
}
	f22 = f10*f21;
	f10 = f10*f20;
	f21 = f16*f21;
	f16 = f16*f20;
	f4 = f4+f22;
	f6 = f6-f10;
	f7 = f7+f21;
	f5 = f5-f16;
	f4 = f4+f6;
	f6 =                       0.5;
	f5 = f7+f5;
	f4 = f4*f6;
	f5 = f5*f6;
	heapFloat[(r5+2)] = f4;
	heapFloat[(r5+3)] = f5;
}
}
}
}
} while(0);
	r5 = r0 >> 2;
	f4 = heapFloat[(r5+1)];
	heap32[(r8+18)] = heap32[(fp+-6)];
	heapFloat[(r8+19)] = f4;
	r5 = heap32[(r8+36)];
if(!(r5 <1)) //_LBB72_42
{
	f0 = f0+f1;
	f1 = -f13;
	f4 = -f19;
	r9 = (r7 + r3)&-1;
	r10 = r2;
_33: while(true){
	r11 = r10 >> 2;
	f5 = heapFloat[(r11+-1)];
	f6 = heapFloat[(r11)];
	f7 = f5-f8;
	r11 = r9 >> 2;
	f10 = f6-f9;
	heapFloat[(r11+-8)] = f7;
	f5 = f5-f14;
	heapFloat[(r11+-7)] = f10;
	r12 = r6 << 2;
	r12 = (r7 + r12)&-1;
	f6 = f6-f15;
	heapFloat[(r11+-6)] = f5;
	r12 = r12 >> 2;
	heapFloat[(r11+-5)] = f6;
	f16 = heapFloat[(r12+19)];
	f20 = heapFloat[(r12+18)];
	f21 = f7*f16;
	f22 = f10*f20;
	f21 = f21-f22;
	f22 = f5*f16;
	f23 = f6*f20;
	f24 = f2*f21;
	f22 = f22-f23;
	f23 = f3*f22;
	f21 = f24*f21;
	f21 = f0+f21;
	f22 = f23*f22;
	f21 = f21+f22;
	f22 =                         0;
	if(f21 >f22) //_LBB72_28
{
	f23 =                         1;
	f21 = f23/f21;
}
else{
	f21 = f22;
}
	f23 = -f20;
	f24 = f7*f23;
	f25 = f10*f16;
	f24 = f24-f25;
	f23 = f5*f23;
	f25 = f6*f16;
	f26 = f2*f24;
	f23 = f23-f25;
	f25 = f3*f23;
	f24 = f26*f24;
	f24 = f0+f24;
	f23 = f25*f23;
	f23 = f24+f23;
	heapFloat[(r11+-2)] = f21;
	if(f23 >f22) //_LBB72_31
{
	f21 =                         1;
	f23 = f21/f23;
}
else{
	f23 =                         0;
}
	f6 = f6*f4;
	f5 = f5*f19;
	f6 = f17+f6;
	f5 = f18+f5;
	f6 = f6-f11;
	f10 = f10*f1;
	f5 = f5-f12;
	f7 = f7*f13;
	f6 = f6-f10;
	f5 = f5-f7;
	f6 = f20*f6;
	f5 = f16*f5;
	f5 = f6+f5;
	heapFloat[(r11+-1)] = f23;
	heap32[(r11)] = 0;
	f6 =                        -1;
if(!(f5 >=f6)) //_LBB72_34
{
	f6 = heapFloat[(r8+35)];
	f6 = -f6;
	f5 = f5*f6;
	heapFloat[(r11)] = f5;
}
	r5 = (r5 + -1)&-1;
	r10 = (r10 + 8)&-1;
	r9 = (r9 + 36)&-1;
if(!(r5 !=0)) //_LBB72_26
{
break _33;
}
}
	r5 = heap32[(r8+36)];
if(!(r5 !=2)) //_LBB72_42
{
	f1 = heapFloat[(r8)];
	f4 = heapFloat[(r8+9)];
	f5 = heapFloat[(r8+1)];
	f6 = heapFloat[(r8+10)];
	f7 = heapFloat[(r8+2)];
	f8 = heapFloat[(r8+3)];
	f9 = heapFloat[(r8+11)];
	f10 = heapFloat[(r8+12)];
	f1 = f1*f16;
	f5 = f5*f20;
	f4 = f4*f16;
	f6 = f6*f20;
	f1 = f1-f5;
	f4 = f4-f6;
	f5 = f7*f16;
	f6 = f8*f20;
	f7 = f9*f16;
	f8 = f10*f20;
	f9 = f2*f1;
	f2 = f2*f4;
	f5 = f5-f6;
	f6 = f7-f8;
	f7 = f3*f5;
	f3 = f3*f6;
	f1 = f9*f1;
	f2 = f2*f4;
	f4 = f9*f4;
	f1 = f0+f1;
	f5 = f7*f5;
	f2 = f0+f2;
	f3 = f3*f6;
	f0 = f0+f4;
	f4 = f7*f6;
	f1 = f1+f5;
	f2 = f2+f3;
	f0 = f0+f4;
	f3 = f1*f2;
	f4 = f0*f0;
	f3 = f3-f4;
	f4 =                      1000;
	f5 = f1*f1;
	f4 = f3*f4;
	if(f5 >=f4) //_LBB72_41
{
	heap32[(r8+36)] = 1;
}
else{
	heapFloat[(r8+24)] = f1;
	heapFloat[(r8+25)] = f0;
	heapFloat[(r8+26)] = f0;
	f4 =                         0;
	heapFloat[(r8+27)] = f2;
	if(f3 !=f4) //_LBB72_39
{
	f4 =                         1;
	f3 = f4/f3;
}
	f2 = f3*f2;
	f4 = -f3;
	f0 = f0*f4;
	heapFloat[(r8+20)] = f2;
	heapFloat[(r8+21)] = f0;
	f1 = f3*f1;
	heapFloat[(r8+22)] = f0;
	heapFloat[(r8+23)] = f1;
}
}
}
	r4 = (r4 + 1)&-1;
	r3 = (r3 + 152)&-1;
continue _1;
}
else{
__label__ = 2;
break _1;
}
}
else{
__label__ = 41;
break _1;
}
}
switch(__label__ ){//multiple entries
case 41: 
	return;
break;
case 2: 
	r0 = _2E_str4211;
	r1 = _2E_str1208;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 168;
	_assert(i7);
break;
}
}

function _ZN15b2ContactSolverC1EP18b2ContactSolverDef(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
	var f0;
	var f1;
	var f2;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = r0 >> 2;
	r3 = r1 >> 2;
	heap32[(r2)] = heap32[(r3)];
	heap32[(r2+1)] = heap32[(r3+1)];
	heap32[(r2+2)] = heap32[(r3+2)];
	r4 = heap32[(r3+3)];
	heap32[(r2+3)] = r4;
	r4 = heap32[(r3+4)];
	heap32[(r2+4)] = r4;
	r1 = heapU8[r1+20];
	heap8[r0+20] = r1;
	r1 = heap32[(r3+10)];
	heap32[(r2+8)] = r1;
	r4 = heap32[(r3+7)];
	heap32[(r2+12)] = r4;
	r4 = (r4 * 88)&-1;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r4;
	_ZN16b2StackAllocator8AllocateEi(i7);
	heap32[(r2+9)] = r_g0;
	r1 = heap32[(r2+12)];
	r4 = heap32[(r2+8)];
	r1 = (r1 * 152)&-1;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r1;
	_ZN16b2StackAllocator8AllocateEi(i7);
	heap32[(r2+10)] = r_g0;
	r1 = heap32[(r3+8)];
	heap32[(r2+6)] = r1;
	r1 = heap32[(r3+9)];
	heap32[(r2+7)] = r1;
	r1 = heap32[(r3+6)];
	r3 = 80;
	r4 = 0;
	heap32[(r2+11)] = r1;
_1: while(true){
	r1 = heap32[(r2+12)];
	if(r1 >r4) //_LBB73_1
{
	r1 = heap32[(r2+11)];
	r5 = r4 << 2;
	r1 = (r1 + r5)&-1;
	r1 = r1 >> 2;
	r1 = heap32[(r1)];
	r5 = r1 >> 2;
	r6 = heap32[(r5+31)];
	if(r6 >0) //_LBB73_3
{
	r7 = heap32[(r5+12)];
	r8 = heap32[(r5+13)];
	r7 = r7 >> 2;
	r8 = r8 >> 2;
	r9 = heap32[(r7+2)];
	r10 = heap32[(r8+2)];
	r11 = (r4 * 38)&-1;
	r8 = heap32[(r8+3)];
	r7 = heap32[(r7+3)];
	r8 = r8 >> 2;
	r7 = r7 >> 2;
	r12 = heap32[(r2+10)];
	r11 = r11 << 2;
	r13 = (r12 + r11)&-1;
	f0 = heapFloat[(r8+2)];
	f1 = heapFloat[(r7+2)];
	r7 = r13 >> 2;
	heap32[(r7+34)] = heap32[(r5+34)];
	r8 = r9 >> 2;
	heap32[(r7+35)] = heap32[(r5+35)];
	r9 = heap32[(r8+2)];
	r10 = r10 >> 2;
	heap32[(r7+28)] = r9;
	r9 = heap32[(r10+2)];
	heap32[(r7+29)] = r9;
	heap32[(r7+30)] = heap32[(r8+30)];
	heap32[(r7+31)] = heap32[(r10+30)];
	heap32[(r7+32)] = heap32[(r8+32)];
	heap32[(r7+33)] = heap32[(r10+32)];
	r9 = (r12 + r3)&-1;
	heap32[(r7+37)] = r4;
	r9 = r9 >> 2;
	heap32[(r7+36)] = r6;
	heap32[(r9)] = 0;
	heap32[(r9+1)] = 0;
	heap32[(r9+2)] = 0;
	heap32[(r9+3)] = 0;
	heap32[(r9+4)] = 0;
	heap32[(r9+5)] = 0;
	heap32[(r9+6)] = 0;
	heap32[(r9+7)] = 0;
	r7 = (r4 * 22)&-1;
	r9 = heap32[(r2+9)];
	r7 = r7 << 2;
	r13 = (r9 + r7)&-1;
	r14 = heap32[(r8+2)];
	r13 = r13 >> 2;
	heap32[(r13+8)] = r14;
	r14 = heap32[(r10+2)];
	heap32[(r13+9)] = r14;
	heap32[(r13+10)] = heap32[(r8+30)];
	heap32[(r13+11)] = heap32[(r10+30)];
	f2 = heapFloat[(r8+8)];
	heap32[(r13+12)] = heap32[(r8+7)];
	heapFloat[(r13+13)] = f2;
	f2 = heapFloat[(r10+8)];
	heap32[(r13+14)] = heap32[(r10+7)];
	heapFloat[(r13+15)] = f2;
	heap32[(r13+16)] = heap32[(r8+32)];
	heap32[(r13+17)] = heap32[(r10+32)];
	f2 = heapFloat[(r5+27)];
	heap32[(r13+4)] = heap32[(r5+26)];
	heapFloat[(r13+5)] = f2;
	f2 = heapFloat[(r5+29)];
	heap32[(r13+6)] = heap32[(r5+28)];
	heapFloat[(r13+7)] = f2;
	heap32[(r13+21)] = r6;
	heapFloat[(r13+19)] = f1;
	r8 = 0;
	heapFloat[(r13+20)] = f0;
	r5 = heap32[(r5+30)];
	r6 = (r8 - r6)&-1;
	heap32[(r13+18)] = r5;
	r5 = r8;
	r10 = r8;
_5: while(true){
	r13 = (r12 + r8)&-1;
	r14 = (r10 * -5)&-1;
	r15 = (r9 + r5)&-1;
	r16 = heapU8[r0+20];
	if(r16 ==0) //_LBB73_6
{
	r16 = (r13 + r11)&-1;
	f0 =                         0;
	r16 = r16 >> 2;
	heap32[(r16+4)] = 0;
}
else{
	r16 = r14 << 2;
	r16 = (r1 + r16)&-1;
	r16 = r16 >> 2;
	r17 = (r13 + r11)&-1;
	f0 = heapFloat[(r2+2)];
	f1 = heapFloat[(r16+18)];
	r17 = r17 >> 2;
	f0 = f0*f1;
	heapFloat[(r17+4)] = f0;
	f0 = heapFloat[(r2+2)];
	f1 = heapFloat[(r16+19)];
	f0 = f0*f1;
}
	r16 = (r13 + r11)&-1;
	r17 = (r13 + r11)&-1;
	r16 = r16 >> 2;
	r18 = (r13 + r11)&-1;
	r17 = r17 >> 2;
	heapFloat[(r16+5)] = f0;
	r19 = (r13 + r11)&-1;
	r18 = r18 >> 2;
	heap32[(r17)] = 0;
	r17 = (r13 + r11)&-1;
	r19 = r19 >> 2;
	heap32[(r18+1)] = 0;
	r17 = r17 >> 2;
	heap32[(r19+2)] = 0;
	r18 = (r13 + r11)&-1;
	heap32[(r17+3)] = 0;
	r13 = (r13 + r11)&-1;
	r17 = r14 << 2;
	r18 = r18 >> 2;
	heap32[(r16+6)] = 0;
	r16 = (r1 + r17)&-1;
	r13 = r13 >> 2;
	heap32[(r18+7)] = 0;
	r14 = r14 << 2;
	r16 = r16 >> 2;
	heap32[(r13+8)] = 0;
	r13 = (r15 + r7)&-1;
	f0 = heapFloat[(r16+17)];
	r14 = (r1 + r14)&-1;
	r13 = r13 >> 2;
	r14 = r14 >> 2;
	r10 = (r10 + -1)&-1;
	r5 = (r5 + 8)&-1;
	r8 = (r8 + 36)&-1;
	heap32[(r13)] = heap32[(r14+16)];
	heapFloat[(r13+1)] = f0;
if(!(r6 !=r10)) //_LBB73_4
{
break _5;
}
}
	r4 = (r4 + 1)&-1;
	r3 = (r3 + 152)&-1;
continue _1;
}
else{
__label__ = 2;
break _1;
}
}
else{
__label__ = 10;
break _1;
}
}
switch(__label__ ){//multiple entries
case 10: 
	return;
break;
case 2: 
	r0 = _2E_str5212;
	r1 = _2E_str1208;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 71;
	_assert(i7);
break;
}
}

function _ZN22b2EdgeAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
	var f1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+4)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 144;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r0 = r_g0;
	r1 = _ZTV9b2Contact;
	r1 = (r1 + 8)&-1;
	r2 = r0 >> 2;
	heap32[(r2)] = r1;
	r1 = heap32[(fp)];
	heap32[(r2+1)] = 4;
	r3 = heap32[(fp+2)];
	heap32[(r2+12)] = r1;
	heap32[(r2+13)] = r3;
	heap32[(r2+14)] = 0;
	heap32[(r2+15)] = 0;
	heap32[(r2+31)] = 0;
	heap32[(r2+2)] = 0;
	heap32[(r2+3)] = 0;
	heap32[(r2+5)] = 0;
	heap32[(r2+6)] = 0;
	heap32[(r2+7)] = 0;
	heap32[(r2+4)] = 0;
	heap32[(r2+9)] = 0;
	heap32[(r2+10)] = 0;
	heap32[(r2+11)] = 0;
	heap32[(r2+8)] = 0;
	r3 = r3 >> 2;
	heap32[(r2+32)] = 0;
	r1 = r1 >> 2;
	f0 = heapFloat[(r3+4)];
	f1 = heapFloat[(r1+4)];
	f0 = f1*f0;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	heapFloat[(r2+34)] = f_g0;
	r1 = heap32[(r2+13)];
	r3 = heap32[(r2+12)];
	r1 = r1 >> 2;
	r3 = r3 >> 2;
	f0 = heapFloat[(r1+5)];
	f1 = heapFloat[(r3+5)];
	r4 = _ZTV22b2EdgeAndCircleContact;
	f0 = f1 > f0 ? f1 : f0; 
	r4 = (r4 + 8)&-1;
	heapFloat[(r2+35)] = f0;
	heap32[(r2)] = r4;
	r2 = heap32[(r3+3)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+1)];
	if(r2 ==1) //_LBB74_2
{
	r1 = heap32[(r1+3)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	if(r1 ==0) //_LBB74_4
{
	r_g0 = r0;
	return;
}
else{
	r0 = _2E_str2191;
	r1 = _2E_str1222;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 42;
	_assert(i7);
}
}
else{
	r0 = _2E_str221;
	r1 = _2E_str1222;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 41;
	_assert(i7);
}
}

function _ZN22b2EdgeAndCircleContactD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV22b2EdgeAndCircleContact;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN22b2EdgeAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+13)];
	r0 = heap32[(r0+12)];
	r1 = r1 >> 2;
	r0 = r0 >> 2;
	r1 = heap32[(r1+3)];
	r0 = heap32[(r0+3)];
	r2 = heap32[(fp+1)];
	r3 = heap32[(fp+2)];
	r4 = heap32[(fp+3)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = r1;
	heap32[(g0+4)] = r4;
	_Z22b2CollideEdgeAndCircleP10b2ManifoldPK11b2EdgeShapeRK11b2TransformPK13b2CircleShapeS6_(i7);
	return;
}

function _ZN22b2EdgeAndCircleContactD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV22b2EdgeAndCircleContact;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN22b2EdgeAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r1 = heap32[(r1)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	heap32[(g0)] = r0;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r1 = heap32[(fp+1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 144;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
	return;
}

function _ZN23b2EdgeAndPolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
	var f1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+4)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 144;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r0 = r_g0;
	r1 = _ZTV9b2Contact;
	r1 = (r1 + 8)&-1;
	r2 = r0 >> 2;
	heap32[(r2)] = r1;
	r1 = heap32[(fp)];
	heap32[(r2+1)] = 4;
	r3 = heap32[(fp+2)];
	heap32[(r2+12)] = r1;
	heap32[(r2+13)] = r3;
	heap32[(r2+14)] = 0;
	heap32[(r2+15)] = 0;
	heap32[(r2+31)] = 0;
	heap32[(r2+2)] = 0;
	heap32[(r2+3)] = 0;
	heap32[(r2+5)] = 0;
	heap32[(r2+6)] = 0;
	heap32[(r2+7)] = 0;
	heap32[(r2+4)] = 0;
	heap32[(r2+9)] = 0;
	heap32[(r2+10)] = 0;
	heap32[(r2+11)] = 0;
	heap32[(r2+8)] = 0;
	r3 = r3 >> 2;
	heap32[(r2+32)] = 0;
	r1 = r1 >> 2;
	f0 = heapFloat[(r3+4)];
	f1 = heapFloat[(r1+4)];
	f0 = f1*f0;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	heapFloat[(r2+34)] = f_g0;
	r1 = heap32[(r2+13)];
	r3 = heap32[(r2+12)];
	r1 = r1 >> 2;
	r3 = r3 >> 2;
	f0 = heapFloat[(r1+5)];
	f1 = heapFloat[(r3+5)];
	r4 = _ZTV23b2EdgeAndPolygonContact;
	f0 = f1 > f0 ? f1 : f0; 
	r4 = (r4 + 8)&-1;
	heapFloat[(r2+35)] = f0;
	heap32[(r2)] = r4;
	r2 = heap32[(r3+3)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+1)];
	if(r2 ==1) //_LBB79_2
{
	r1 = heap32[(r1+3)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	if(r1 ==2) //_LBB79_4
{
	r_g0 = r0;
	return;
}
else{
	r0 = _2E_str2194;
	r1 = _2E_str1227;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 42;
	_assert(i7);
}
}
else{
	r0 = _2E_str221;
	r1 = _2E_str1227;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 41;
	_assert(i7);
}
}

function _ZN23b2EdgeAndPolygonContactD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV23b2EdgeAndPolygonContact;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN23b2EdgeAndPolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+13)];
	r0 = heap32[(r0+12)];
	r1 = r1 >> 2;
	r0 = r0 >> 2;
	r1 = heap32[(r1+3)];
	r0 = heap32[(r0+3)];
	r2 = heap32[(fp+1)];
	r3 = heap32[(fp+2)];
	r4 = heap32[(fp+3)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = r1;
	heap32[(g0+4)] = r4;
	_Z23b2CollideEdgeAndPolygonP10b2ManifoldPK11b2EdgeShapeRK11b2TransformPK14b2PolygonShapeS6_(i7);
	return;
}

function _ZN23b2EdgeAndPolygonContactD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV23b2EdgeAndPolygonContact;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN23b2EdgeAndPolygonContact7DestroyEP9b2ContactP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r1 = heap32[(r1)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	heap32[(g0)] = r0;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r1 = heap32[(fp+1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 144;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
	return;
}

function _ZN25b2PolygonAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
	var f1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+4)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 144;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r0 = r_g0;
	r1 = _ZTV9b2Contact;
	r1 = (r1 + 8)&-1;
	r2 = r0 >> 2;
	heap32[(r2)] = r1;
	r1 = heap32[(fp)];
	heap32[(r2+1)] = 4;
	r3 = heap32[(fp+2)];
	heap32[(r2+12)] = r1;
	heap32[(r2+13)] = r3;
	heap32[(r2+14)] = 0;
	heap32[(r2+15)] = 0;
	heap32[(r2+31)] = 0;
	heap32[(r2+2)] = 0;
	heap32[(r2+3)] = 0;
	heap32[(r2+5)] = 0;
	heap32[(r2+6)] = 0;
	heap32[(r2+7)] = 0;
	heap32[(r2+4)] = 0;
	heap32[(r2+9)] = 0;
	heap32[(r2+10)] = 0;
	heap32[(r2+11)] = 0;
	heap32[(r2+8)] = 0;
	r3 = r3 >> 2;
	heap32[(r2+32)] = 0;
	r1 = r1 >> 2;
	f0 = heapFloat[(r3+4)];
	f1 = heapFloat[(r1+4)];
	f0 = f1*f0;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	heapFloat[(r2+34)] = f_g0;
	r1 = heap32[(r2+13)];
	r3 = heap32[(r2+12)];
	r1 = r1 >> 2;
	r3 = r3 >> 2;
	f0 = heapFloat[(r1+5)];
	f1 = heapFloat[(r3+5)];
	r4 = _ZTV25b2PolygonAndCircleContact;
	f0 = f1 > f0 ? f1 : f0; 
	r4 = (r4 + 8)&-1;
	heapFloat[(r2+35)] = f0;
	heap32[(r2)] = r4;
	r2 = heap32[(r3+3)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+1)];
	if(r2 ==2) //_LBB84_2
{
	r1 = heap32[(r1+3)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	if(r1 ==0) //_LBB84_4
{
	r_g0 = r0;
	return;
}
else{
	r0 = _2E_str2191;
	r1 = _2E_str1232;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 42;
	_assert(i7);
}
}
else{
	r0 = _2E_str231;
	r1 = _2E_str1232;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 41;
	_assert(i7);
}
}

function _ZN25b2PolygonAndCircleContactD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV25b2PolygonAndCircleContact;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN25b2PolygonAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+13)];
	r0 = heap32[(r0+12)];
	r1 = r1 >> 2;
	r0 = r0 >> 2;
	r2 = heap32[(fp+1)];
	r1 = heap32[(r1+3)];
	r0 = heap32[(r0+3)];
	r3 = heap32[(fp+3)];
	r2 = r2 >> 2;
	r3 = r3 >> 2;
	heap32[(r2+15)] = 0;
	r1 = r1 >> 2;
	f0 = heapFloat[(r3+3)];
	f1 = heapFloat[(r1+3)];
	f2 = heapFloat[(r3+2)];
	f3 = heapFloat[(r1+4)];
	r4 = heap32[(fp+2)];
	f4 = f2*f1;
	f5 = f0*f3;
	f0 = f0*f1;
	f1 = f2*f3;
	r4 = r4 >> 2;
	f2 = f4+f5;
	f3 = heapFloat[(r3+1)];
	f0 = f0-f1;
	f1 = heapFloat[(r3)];
	f2 = f2+f3;
	f3 = heapFloat[(r4+1)];
	f0 = f0+f1;
	f1 = heapFloat[(r4)];
	r3 = r0 >> 2;
	f4 = heapFloat[(r4+3)];
	f2 = f2-f3;
	f0 = f0-f1;
	f1 = heapFloat[(r4+2)];
	f3 = f4*f0;
	f5 = f1*f2;
	f2 = f4*f2;
	f0 = f0*f1;
	f1 = heapFloat[(r3+2)];
	f4 = heapFloat[(r1+2)];
	f3 = f3+f5;
	f0 = f2-f0;
	f1 = f1+f4;
	r3 = heap32[(r3+37)];
	r4 = 0;
	f2 =  -3.4028234663852886e+038;
	r5 = r4;
_1: while(true){
	if(r5 <r3) //_LBB86_1
{
	r6 = r5 << 3;
	r6 = (r0 + r6)&-1;
	r6 = r6 >> 2;
	f4 = heapFloat[(r6+5)];
	f5 = heapFloat[(r6+6)];
	f6 = heapFloat[(r6+21)];
	f4 = f3-f4;
	f7 = heapFloat[(r6+22)];
	f5 = f0-f5;
	f4 = f6*f4;
	f5 = f7*f5;
	f4 = f4+f5;
	if(f4 >f1) //_LBB86_19
{
__label__ = 19;
break _1;
}
else{
	r4 = f4 > f2 ? r5 : r4; 
	f2 = f4 > f2 ? f4 : f2; 
	r5 = (r5 + 1)&-1;
continue _1;
}
}
else{
__label__ = 4;
break _1;
}
}
_5: do {
switch(__label__ ){//multiple entries
case 4: 
	r5 = (r4 + 1)&-1;
	r6 = 0;
	r3 = r5 < r3 ? r5 : r6; 
	r4 = r4 << 3;
	r5 = (r0 + 20)&-1;
	r3 = r3 << 3;
	r6 = (r5 + r4)&-1;
	r3 = (r5 + r3)&-1;
	r5 = r6 >> 2;
	r3 = r3 >> 2;
	f4 = heapFloat[(r5)];
	f5 = heapFloat[(r5+1)];
	f6 = heapFloat[(r3)];
	f7 = heapFloat[(r3+1)];
	f8 =   1.1920928955078125e-007;
	if(f2 >=f8) //_LBB86_6
{
	f2 = f0-f5;
	f9 = f7-f5;
	f10 = f3-f4;
	f11 = f6-f4;
	f11 = f10*f11;
	f9 = f2*f9;
	f9 = f11+f9;
	f11 =                         0;
	if(f9 >f11) //_LBB86_12
{
	f2 = f3-f6;
	f9 = f4-f6;
	f10 = f0-f7;
	f12 = f5-f7;
	f9 = f2*f9;
	f12 = f10*f12;
	f9 = f9+f12;
	if(f9 >f11) //_LBB86_17
{
	r0 = (r0 + r4)&-1;
	f2 = f5+f7;
	f5 =                       0.5;
	f4 = f4+f6;
	r0 = r0 >> 2;
	f2 = f2*f5;
	f4 = f4*f5;
	f3 = f3-f4;
	f5 = heapFloat[(r0+21)];
	f0 = f0-f2;
	f6 = heapFloat[(r0+22)];
	f3 = f3*f5;
	f0 = f0*f6;
	f0 = f3+f0;
	if(f0 >f1) //_LBB86_19
{
break _5;
}
else{
	heap32[(r2+15)] = 1;
	heap32[(r2+14)] = 1;
	f0 = heapFloat[(r0+22)];
	heap32[(r2+10)] = heap32[(r0+21)];
	heapFloat[(r2+11)] = f0;
	heapFloat[(r2+12)] = f4;
	heapFloat[(r2+13)] = f2;
}
}
else{
	f0 = f2*f2;
	f3 = f10*f10;
	f0 = f0+f3;
	f1 = f1*f1;
	if(f0 >f1) //_LBB86_19
{
break _5;
}
else{
	heap32[(r2+15)] = 1;
	heap32[(r2+14)] = 1;
	heapFloat[(r2+10)] = f2;
	heapFloat[(r2+11)] = f10;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	f0 = f_g0;
if(!(f0 <f8)) //_LBB86_16
{
	f1 =                         1;
	f0 = f1/f0;
	f1 = heapFloat[(r2+10)];
	f1 = f1*f0;
	heapFloat[(r2+10)] = f1;
	f1 = heapFloat[(r2+11)];
	f0 = f1*f0;
	heapFloat[(r2+11)] = f0;
}
	heapFloat[(r2+12)] = f6;
	heapFloat[(r2+13)] = f7;
}
}
}
else{
	f0 = f10*f10;
	f3 = f2*f2;
	f0 = f0+f3;
	f1 = f1*f1;
	if(f0 >f1) //_LBB86_19
{
break _5;
}
else{
	heap32[(r2+15)] = 1;
	heap32[(r2+14)] = 1;
	heapFloat[(r2+10)] = f10;
	heapFloat[(r2+11)] = f2;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	f0 = f_g0;
if(!(f0 <f8)) //_LBB86_10
{
	f1 =                         1;
	f0 = f1/f0;
	f1 = heapFloat[(r2+10)];
	f1 = f1*f0;
	heapFloat[(r2+10)] = f1;
	f1 = heapFloat[(r2+11)];
	f0 = f1*f0;
	heapFloat[(r2+11)] = f0;
}
	heapFloat[(r2+12)] = f4;
	heapFloat[(r2+13)] = f5;
}
}
}
else{
	r0 = (r0 + r4)&-1;
	heap32[(r2+15)] = 1;
	r0 = r0 >> 2;
	heap32[(r2+14)] = 1;
	f0 = heapFloat[(r0+22)];
	heap32[(r2+10)] = heap32[(r0+21)];
	f1 = f4+f6;
	f3 =                       0.5;
	f4 = f5+f7;
	f1 = f1*f3;
	heapFloat[(r2+11)] = f0;
	f0 = f4*f3;
	heapFloat[(r2+12)] = f1;
	heapFloat[(r2+13)] = f0;
}
	f0 = heapFloat[(r1+4)];
	heap32[(r2)] = heap32[(r1+3)];
	heapFloat[(r2+1)] = f0;
	heap32[(r2+4)] = 0;
	return;
break;
}
} while(0);
	return;
}

function _ZN25b2PolygonAndCircleContactD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV25b2PolygonAndCircleContact;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN25b2PolygonAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r1 = heap32[(r1)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	heap32[(g0)] = r0;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r1 = heap32[(fp+1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 144;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
	return;
}

function _ZN16b2PolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
	var f1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+4)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 144;
	_ZN16b2BlockAllocator8AllocateEi(i7);
	r0 = r_g0;
	r1 = _ZTV9b2Contact;
	r1 = (r1 + 8)&-1;
	r2 = r0 >> 2;
	heap32[(r2)] = r1;
	r1 = heap32[(fp)];
	heap32[(r2+1)] = 4;
	r3 = heap32[(fp+2)];
	heap32[(r2+12)] = r1;
	heap32[(r2+13)] = r3;
	heap32[(r2+14)] = 0;
	heap32[(r2+15)] = 0;
	heap32[(r2+31)] = 0;
	heap32[(r2+2)] = 0;
	heap32[(r2+3)] = 0;
	heap32[(r2+5)] = 0;
	heap32[(r2+6)] = 0;
	heap32[(r2+7)] = 0;
	heap32[(r2+4)] = 0;
	heap32[(r2+9)] = 0;
	heap32[(r2+10)] = 0;
	heap32[(r2+11)] = 0;
	heap32[(r2+8)] = 0;
	r3 = r3 >> 2;
	heap32[(r2+32)] = 0;
	r1 = r1 >> 2;
	f0 = heapFloat[(r3+4)];
	f1 = heapFloat[(r1+4)];
	f0 = f1*f0;
	heapFloat[(g0)] = f0;
	sqrtf(i7);
	heapFloat[(r2+34)] = f_g0;
	r1 = heap32[(r2+13)];
	r3 = heap32[(r2+12)];
	r1 = r1 >> 2;
	r3 = r3 >> 2;
	f0 = heapFloat[(r1+5)];
	f1 = heapFloat[(r3+5)];
	r4 = _ZTV16b2PolygonContact;
	f0 = f1 > f0 ? f1 : f0; 
	r4 = (r4 + 8)&-1;
	heapFloat[(r2+35)] = f0;
	heap32[(r2)] = r4;
	r2 = heap32[(r3+3)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+1)];
	if(r2 ==2) //_LBB89_2
{
	r1 = heap32[(r1+3)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	if(r1 ==2) //_LBB89_4
{
	r_g0 = r0;
	return;
}
else{
	r0 = _2E_str2194;
	r1 = _2E_str1237;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 45;
	_assert(i7);
}
}
else{
	r0 = _2E_str231;
	r1 = _2E_str1237;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 44;
	_assert(i7);
}
}

function _ZN16b2PolygonContactD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV16b2PolygonContact;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN16b2PolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var f0;
	var f1;
	var f2;
	var f3;
	var f4;
	var f5;
	var f6;
	var f7;
	var f8;
	var f9;
	var f10;
	var f11;
	var f12;
	var f13;
	var f14;
	var f15;
	var f16;
	var f17;
	var f18;
	var f19;
	var f20;
	var f21;
	var f22;
var __label__ = 0;
	i7 = sp + -104;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+13)];
	r0 = heap32[(r0+12)];
	r1 = r1 >> 2;
	r0 = r0 >> 2;
	r2 = heap32[(fp+1)];
	r1 = heap32[(r1+3)];
	r0 = heap32[(r0+3)];
	r3 = r2 >> 2;
	r4 = r0 >> 2;
	heap32[(r3+15)] = 0;
	r5 = r1 >> 2;
	f0 = heapFloat[(r4+2)];
	f1 = heapFloat[(r5+2)];
	heap32[(fp+-1)] = 0;
	r4 = heap32[(fp+2)];
	r5 = heap32[(fp+3)];
	r6 = sp + -4; 
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r4;
	heap32[(g0+3)] = r1;
	heap32[(g0+4)] = r5;
	f0 = f0+f1;
	_ZL19b2FindMaxSeparationPiPK14b2PolygonShapeRK11b2TransformS2_S5_(i7);
	f1 = f_g0;
_1: do {
if(!(f1 >f0)) //_LBB91_27
{
	heap32[(fp+-2)] = 0;
	r6 = sp + -8; 
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r5;
	heap32[(g0+3)] = r0;
	heap32[(g0+4)] = r4;
	_ZL19b2FindMaxSeparationPiPK14b2PolygonShapeRK11b2TransformS2_S5_(i7);
	f2 = f_g0;
if(!(f2 >f0)) //_LBB91_27
{
	f3 =       0.98000001907348633;
	f1 = f1*f3;
	f3 =     0.0010000000474974513;
	f1 = f1+f3;
	if(f1 >=f2) //_LBB91_4
{
	r4 = r4 >> 2;
	r5 = r5 >> 2;
	f1 = heapFloat[(r4)];
	f2 = heapFloat[(r4+1)];
	f3 = heapFloat[(r4+2)];
	f4 = heapFloat[(r4+3)];
	f5 = heapFloat[(r5)];
	f6 = heapFloat[(r5+1)];
	f7 = heapFloat[(r5+2)];
	f8 = heapFloat[(r5+3)];
	r4 = heap32[(fp+-1)];
	r5 = 0;
	r6 = r1;
	heap32[(r3+14)] = 1;
	r1 = r0;
	r0 = r6;
}
else{
	r5 = r5 >> 2;
	r4 = r4 >> 2;
	f1 = heapFloat[(r5)];
	f2 = heapFloat[(r5+1)];
	f3 = heapFloat[(r5+2)];
	f4 = heapFloat[(r5+3)];
	f5 = heapFloat[(r4)];
	f6 = heapFloat[(r4+1)];
	f7 = heapFloat[(r4+2)];
	f8 = heapFloat[(r4+3)];
	r4 = heap32[(fp+-2)];
	r5 = 1;
	heap32[(r3+14)] = 2;
}
if(!(r4 <0)) //_LBB91_7
{
	r6 = r1 >> 2;
	r6 = heap32[(r6+37)];
	if(r6 >r4) //_LBB91_8
{
	r7 = r0 >> 2;
	r7 = heap32[(r7+37)];
	r8 = r4 << 3;
	f9 = -f7;
_11: do {
	if(r7 >0) //_LBB91_10
{
	r9 = (r1 + r8)&-1;
	r9 = r9 >> 2;
	f10 = heapFloat[(r9+21)];
	f11 = heapFloat[(r9+22)];
	f12 = f4*f10;
	f13 = f3*f11;
	f10 = f3*f10;
	f11 = f4*f11;
	f12 = f12-f13;
	f10 = f10+f11;
	f11 = f8*f10;
	f13 = f12*f7;
	f12 = f8*f12;
	f10 = f7*f10;
	f11 = f11-f13;
	f10 = f12+f10;
	r10 = 0;
	f12 =   3.4028234663852886e+038;
	r9 = r10;
_13: while(true){
	r11 = r10 << 3;
	r11 = (r0 + r11)&-1;
	r11 = r11 >> 2;
	f13 = heapFloat[(r11+21)];
	f14 = heapFloat[(r11+22)];
	f13 = f10*f13;
	f14 = f11*f14;
	f13 = f13+f14;
	r11 = (r10 + 1)&-1;
	r9 = f13 < f12 ? r10 : r9; 
	f12 = f13 < f12 ? f13 : f12; 
	r10 = r11;
if(!(r7 !=r11)) //_LBB91_11
{
break _11;
}
}
}
else{
	r9 = 0;
}
} while(0);
	r0 = (r0 + 20)&-1;
	r10 = r9 << 3;
	r10 = (r0 + r10)&-1;
	r10 = r10 >> 2;
	f10 = heapFloat[(r10)];
	f11 = heapFloat[(r10+1)];
	f12 = f8*f10;
	f13 = f7*f11;
	f10 = f7*f10;
	f11 = f8*f11;
	f12 = f12-f13;
	r10 = sp + -32; 
	f10 = f10+f11;
	f11 = f12+f5;
	r11 = r10 >> 2;
	f10 = f10+f6;
	heapFloat[(fp+-8)] = f11;
	heapFloat[(r11+1)] = f10;
	r12 = 0;
	r13 = (r9 + 1)&-1;
	r7 = r13 < r7 ? r13 : r12; 
	heap8[sp+-24] = r4;
	r13 = r7 << 3;
	r14 = 1;
	heap8[sp+-23] = r9;
	r0 = (r0 + r13)&-1;
	heap8[sp+-22] = r14;
	r0 = r0 >> 2;
	heap8[sp+-21] = r12;
	f10 = heapFloat[(r0)];
	f11 = heapFloat[(r0+1)];
	f12 = f8*f10;
	f13 = f7*f11;
	f12 = f12-f13;
	f10 = f7*f10;
	f11 = f8*f11;
	f10 = f10+f11;
	f11 = f12+f5;
	f10 = f10+f6;
	heapFloat[(r11+3)] = f11;
	heapFloat[(r11+4)] = f10;
	r0 = (r4 + 1)&-1;
	r0 = r0 < r6 ? r0 : r12; 
	heap8[sp+-12] = r4;
	heap8[sp+-11] = r7;
	r6 = r0 << 3;
	r1 = (r1 + 20)&-1;
	r6 = (r1 + r6)&-1;
	r1 = (r1 + r8)&-1;
	heap8[sp+-10] = r14;
	r6 = r6 >> 2;
	heap8[sp+-9] = r12;
	r1 = r1 >> 2;
	f10 = heapFloat[(r6+1)];
	f11 = heapFloat[(r1+1)];
	f12 = heapFloat[(r6)];
	f13 = heapFloat[(r1)];
	f14 = f10-f11;
	f15 = f12-f13;
	f16 = f15*f15;
	f17 = f14*f14;
	f16 = f16+f17;
	heapFloat[(g0)] = f16;
	sqrtf(i7);
	f16 = f_g0;
	f17 =   1.1920928955078125e-007;
	if(f16 >=f17) //_LBB91_14
{
	f17 =                         1;
	f16 = f17/f16;
	f15 = f15*f16;
	f14 = f14*f16;
}
	f16 = f4*f13;
	f17 = f3*f11;
	f18 = f3*f13;
	f19 = f4*f11;
	f20 = f3*f15;
	f21 = f4*f14;
	f16 = f16-f17;
	f17 = f4*f15;
	f22 = f3*f14;
	f18 = f18+f19;
	f19 = f20+f21;
	f17 = f17-f22;
	f16 = f16+f1;
	f18 = f18+f2;
	f20 = f17*f16;
	f21 = f19*f18;
	f20 = f20+f21;
	f21 = -f17;
	r1 = sp + -56; 
	f22 = -f19;
	f20 = f0-f20;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r10;
	heapFloat[(g0+2)] = f21;
	heapFloat[(g0+3)] = f22;
	heapFloat[(g0+4)] = f20;
	heap32[(g0+5)] = r4;
	_Z19b2ClipSegmentToLineP12b2ClipVertexPKS_RK6b2Vec2fi(i7);
	r4 = r_g0;
	if(r4 <2) //_LBB91_27
{
break _1;
}
else{
	f20 = f4*f12;
	f22 = f3*f10;
	f3 = f3*f12;
	f4 = f4*f10;
	f20 = f20-f22;
	f3 = f3+f4;
	f1 = f20+f1;
	f2 = f3+f2;
	f1 = f17*f1;
	f2 = f19*f2;
	f1 = f1+f2;
	r4 = sp + -80; 
	f1 = f1+f0;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r1;
	heapFloat[(g0+2)] = f17;
	heapFloat[(g0+3)] = f19;
	heapFloat[(g0+4)] = f1;
	heap32[(g0+5)] = r0;
	_Z19b2ClipSegmentToLineP12b2ClipVertexPKS_RK6b2Vec2fi(i7);
	r0 = r_g0;
	if(r0 <2) //_LBB91_27
{
break _1;
}
else{
	f1 = f11+f10;
	f2 =                       0.5;
	f3 = f13+f12;
	f4 = f19*f16;
	f10 = f17*f18;
	f11 = -f15;
	f1 = f1*f2;
	f2 = f3*f2;
	f3 = f4-f10;
	heapFloat[(r3+10)] = f14;
	heapFloat[(r3+11)] = f11;
	heapFloat[(r3+12)] = f2;
	heapFloat[(r3+13)] = f1;
	r0 = r4 >> 2;
	f1 = heapFloat[(fp+-20)];
	f2 = heapFloat[(r0+1)];
	f4 = f19*f1;
	f10 = f21*f2;
	f4 = f4+f10;
	f4 = f4-f3;
	if(f4 <=f0) //_LBB91_19
{
	f1 = f1-f5;
	f2 = f2-f6;
	f4 = f8*f1;
	f10 = f7*f2;
	f4 = f4+f10;
	f1 = f1*f9;
	f2 = f8*f2;
	f1 = f1+f2;
	heapFloat[(r3)] = f4;
	heapFloat[(r3+1)] = f1;
	r12 = heap32[(r0+2)];
	heap32[(r3+4)] = r12;
	r1 = r5 & 255;
	if(r1 !=0) //_LBB91_21
{
	r1 = heapU8[r2+18];
	r4 = heapU8[r2+19];
	r6 = heapU8[r2+17];
	heap8[r2+16] = r6;
	heap8[r2+17] = r12;
	heap8[r2+18] = r4;
	heap8[r2+19] = r1;
	r12 = r14;
}
else{
	r12 = 1;
}
}
	f1 = heapFloat[(r0+3)];
	f2 = heapFloat[(r0+4)];
	f4 = f19*f1;
	f10 = f21*f2;
	f4 = f4+f10;
	f3 = f4-f3;
	if(f3 <=f0) //_LBB91_26
{
	r1 = (r12 * 20)&-1;
	f0 = f1-f5;
	f1 = f2-f6;
	r2 = (r2 + r1)&-1;
	f2 = f8*f0;
	f3 = f7*f1;
	r1 = r2 >> 2;
	f2 = f2+f3;
	f0 = f0*f9;
	f1 = f8*f1;
	f0 = f0+f1;
	heapFloat[(r1)] = f2;
	heapFloat[(r1+1)] = f0;
	r0 = heap32[(r0+5)];
	heap32[(r1+4)] = r0;
	r1 = r5 & 255;
if(!(r1 ==0)) //_LBB91_24
{
	r5 = heapU8[r2+18];
	r1 = heapU8[r2+19];
	r4 = heapU8[r2+17];
	heap8[r2+16] = r4;
	heap8[r2+17] = r0;
	heap8[r2+18] = r1;
	heap8[r2+19] = r5;
}
	r12 = (r12 + 1)&-1;
}
	heap32[(r3+15)] = r12;
	return;
}
}
}
}
	r0 = _2E_str4;
	r1 = _2E_str15;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 151;
	_assert(i7);
}
}
} while(0);
	return;
}

function _ZN16b2PolygonContactD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTV16b2PolygonContact;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	return;
}

function _ZN16b2PolygonContact7DestroyEP9b2ContactP16b2BlockAllocator(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r1 = heap32[(r1)];
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	heap32[(g0)] = r0;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r1 = heap32[(fp+1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 144;
	_ZN16b2BlockAllocator4FreeEPvi(i7);
	return;
}

function __init(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = _2E_str380;
	heap32[(g0)] = r0;
	printf(i7);
	_Z5benchv(i7);
	return;
}

function __draw(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function _GLOBAL__I__ZN4__rw9__catfindEPNS_8__rw_catE(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = _ZN4__rwL12__rw_catlistE_2E_0;
	r1 = _ZN4__rwL12__rw_catlistE_2E_1;
	r0 = r0 >> 2;
	r2 = _ZN4__rwL12__rw_catlistE_2E_2;
	r1 = r1 >> 2;
	heap32[(r0)] = 0;
	r2 = r2 >> 2;
	heap32[(r1)] = 0;
	heap32[(r2)] = 0;
	heap32[(g0)] = 136;
	_Znwj(i7);
	r3 = r_g0;
if(!(r3 !=0)) //_LBB96_3
{
	heap32[(g0)] = 3;
	_ZN4__rw10__rw_throwEiz(i7);
}
	heap32[(g0)] = 0;
	_ZdlPv(i7);
	r4 = heap32[(r0)];
	r5 = (r3 + 136)&-1;
	if(r4 ==0) //_LBB96_5
{
	r8 = r3;
}
else{
	r6 = r4;
	r7 = r3;
_8: while(true){
	r9 = r6 >> 2;
	r6 = (r6 + 4)&-1;
	r8 = (r7 + 4)&-1;
	r7 = r7 >> 2;
	r9 = heap32[(r9)];
	heap32[(r7)] = r9;
	r7 = r8;
	if(r6 !=0) //_LBB96_6
{
continue _8;
}
else{
break _8;
}
}
}
	r6 = 0;
_11: while(true){
	r7 = r6 << 2;
	r7 = (r8 + r7)&-1;
	r6 = (r6 + 1)&-1;
	r7 = r7 >> 2;
	heap32[(r7)] = 0;
	if(r6 !=2) //_LBB96_8
{
continue _11;
}
else{
break _11;
}
}
	r6 = heap32[(r1)];
	if(r6 ==0) //_LBB96_11
{
	r6 = (r8 + 8)&-1;
	heap32[(r0)] = r3;
	heap32[(r1)] = r6;
	heap32[(r2)] = r5;
	heap32[(g0)] = r4;
	_ZdlPv(i7);
	return;
}
else{
	abort(i7);
}
}

function _GLOBAL__D__ZN4__rw9__catfindEPNS_8__rw_catE(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = _ZN4__rwL12__rw_catlistE_2E_0;
	r1 = _ZN4__rwL12__rw_catlistE_2E_1;
	r0 = r0 >> 2;
	r1 = r1 >> 2;
	r0 = heap32[(r0)];
	r2 = heap32[(r1)];
	r3 = (r2 - r0)&-1;
	r3 = r3 >> 2;
if(!(r3 ==0)) //_LBB97_2
{
	r3 = r3 << 2;
	r2 = (r2 - r3)&-1;
	heap32[(r1)] = r2;
}
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN4__rwL13__rw_vfmtwhatEPcjPKcS0_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
var __label__ = 0;
	i7 = sp + -48;var g0 = i7>>2; // save stack
	r0 = _ZN4__rwL16__rw_what_refcntE;
	r0 = r0 >> 2;
	r1 = heap32[(r0)];
	r2 = heap32[(fp)];
	r3 = heap32[(fp+1)];
	r4 = (r1 + 1)&-1;
	heap32[(r0)] = r4;
	if(r1 !=0) //_LBB98_2
{
	heap32[(g0)] = 256;
	_Znaj(i7);
	r1 = r_g0;
	r4 = heap32[(r0)];
	r4 = (r4 + -1)&-1;
	heap32[(r0)] = r4;
}
else{
	r1 = _ZN4__rwL13__rw_what_bufE;
}
	r4 = 256;
	r12 = swrite__index__;
_5: while(true){
	r5 = sp + -16; 
	heap32[(fp+-8)] = r3;
	r6 = r5 >> 2;
	heap32[(fp+-7)] = r3;
	r7 = (r4 + -1)&-1;
	r8 = 0;
	heap32[(r6+1)] = 0;
	r9 = sp + -24; 
	r10 = r4 == 0 ? r8 : r7; 
	heap32[(fp+-4)] = r1;
	r11 = r9 >> 2;
	heap32[(r6+2)] = r10;
	heap32[(r11+1)] = r12;
	heap32[(fp+-6)] = r5;
	heap32[(g0)] = r9;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r3;
	__v_printf(i7);
	r5 = r_g0;
_7: do {
if(!(r1 ==0)) //_LBB98_11
{
if(!(r4 ==0)) //_LBB98_11
{
if(!(r5 <0)) //_LBB98_11
{
if(!(r4 ==-1)) //_LBB98_10
{
if(!(uint(r5) <uint(r4))) //_LBB98_10
{
	heap8[r1+r7] = r8;
break _7;
}
}
	heap8[r1+r5] = r8;
}
}
}
} while(0);
	r5 = r5 < 0 ? r8 : r5; 
	r5 = r7 > r5 ? r5 : r8; 
	if(r5 !=0) //_LBB98_13
{
	if(r4 >r5) //_LBB98_20
{
break _5;
}
else{
	r4 = (r5 + 1)&-1;
}
}
else{
	r4 = r4 << 1;
}
	r5 = _ZN4__rwL13__rw_what_bufE;
	if(r1 !=r5) //_LBB98_17
{
if(!(r1 ==0)) //_LBB98_19
{
	heap32[(g0)] = r1;
	_ZdaPv(i7);
}
}
else{
	r1 = heap32[(r0)];
	r1 = (r1 + -1)&-1;
	heap32[(r0)] = r1;
}
	heap32[(g0)] = r4;
	_Znaj(i7);
	r1 = r_g0;
continue _5;
}
	r_g0 = r1;
	return;
}

function _ZN4__rw10__rw_throwEiz(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
var __label__ = 0;
	i7 = sp + -64;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	if(r0 >4) //_LBB99_9
{
	r1 = (sp + 4)&-1;
	heap32[(fp+-7)] = r1;
	r2 = _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E7__fname;
	heap32[(fp+-9)] = r1;
	r2 = r2 >> 2;
	heap32[(fp+-8)] = r1;
	r3 = heap32[(r2)];
if(!(r3 !=0)) //_LBB99_41
{
	r3 = _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E6buffer;
	r4 = 0;
_5: while(true){
	r5 = heapU8[r3];
	r4 = r5 == 58 ? r3 : r4; 
	if(r5 !=0) //_LBB99_13
{
	r5 = (r3 + 1)&-1;
	r6 = heapU8[r3+1];
	r4 = r6 == 58 ? r5 : r4; 
	if(r6 !=0) //_LBB99_15
{
	r5 = (r3 + 2)&-1;
	r6 = heapU8[r3+2];
	r4 = r6 == 58 ? r5 : r4; 
	if(r6 !=0) //_LBB99_17
{
	r5 = (r3 + 3)&-1;
	r6 = heapU8[r3+3];
	r4 = r6 == 58 ? r5 : r4; 
	if(r6 !=0) //_LBB99_19
{
	r3 = (r3 + 4)&-1;
}
else{
break _5;
}
}
else{
break _5;
}
}
else{
break _5;
}
}
else{
break _5;
}
}
_12: do {
if(!(r4 ==0)) //_LBB99_24
{
	r3 = 0;
	heap8[r4] = r3;
	r3 = _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E8__catset;
	r4 = (r4 + 1)&-1;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r3;
	sscanf(i7);
	r4 = r_g0;
	r3 = r3 >> 2;
if(!(r4 !=1)) //_LBB99_23
{
	r4 = heap32[(r3)];
	if(r4 >0) //_LBB99_24
{
break _12;
}
}
	heap32[(r3)] = 1;
}
} while(0);
	r3 = _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E4msgs;
	r4 = r3 >> 2;
	heap32[(r4+1)] = 0;
	heap32[(r4+2)] = 0;
	heap32[(r4+3)] = 0;
	heap32[(r4+4)] = 0;
	heap32[(r4+5)] = 0;
	r5 = _ZTVSt8messagesIcE;
	heap32[(r4+6)] = 0;
	r5 = (r5 + 8)&-1;
	heap32[(r4+7)] = 0;
	r6 = _ZN4__rwL22__rw_classic_once_initE_2E_0_2E_b;
	heap32[(r4)] = r5;
	r5 = heapU8[r6];
if(!(r5 != 0)) //_LBB99_29
{
	_ZN4__rw11__rw_locale11_C_get_bodyEPS0_S1_PKciPKNS_10__rw_facetE(i7);
	r5 = r_g0;
	r7 = _ZN4__rwL12__rw_classicE;
	r7 = r7 >> 2;
	heap32[(r7)] = r5;
if(!(r5 !=0)) //_LBB99_28
{
	r5 = _2E_str12102;
	r7 = _2E_str10100;
	r8 = _2E_str538;
	heap32[(g0)] = 19;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r7;
	heap32[(g0+3)] = r8;
	_ZN4__rw10__rw_throwEiz(i7);
}
	r5 = 1;
	heap8[r6] = r5;
}
	r5 = _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E6buffer;
	r6 = heapU8[r5];
	if(r6 ==0) //_LBB99_31
{
	r6 = _ZNSs11_C_null_refE;
	r7 = 0;
	r6 = (r6 + 12)&-1;
}
else{
	r6 = 0;
_28: while(true){
	r7 = (r5 - r6)&-1;
	r6 = (r6 + -1)&-1;
	r7 = heapU8[r7+1];
if(!(r7 !=0)) //_LBB99_32
{
break _28;
}
}
	r7 = 0;
	r7 = (r7 - r6)&-1;
	if(r6 !=0) //_LBB99_35
{
	r6 = 32;
	r6 = uint(r7) > uint(r6) ? r7 : r6; 
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r7;
	_ZNSs10_C_get_repEjj(i7);
	r6 = (r_g0 + 12)&-1;
}
else{
	r6 = _ZNSs11_C_null_refE;
	r6 = (r6 + 12)&-1;
}
}
	heap32[(fp+-4)] = r6;
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r7;
	memcpy(i7);
	r4 = heap32[(r4)];
	r4 = r4 >> 2;
	r4 = heap32[(r4+2)];
	r6 = sp + -16; 
	r7 = _ZN4__rwL12__rw_classicE;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r6;
	heap32[(g0+2)] = r7;
	__FUNCTION_TABLE__[(r4)>>2](i7);
	r3 = r_g0;
	r4 = _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E5__cat;
	r4 = r4 >> 2;
	heap32[(r4)] = r3;
	r3 = heap32[(fp+-4)];
	r3 = (r3 + -12)&-1;
	r4 = _ZNSs11_C_null_refE;
if(!(r3 ==r4)) //_LBB99_40
{
	r3 = r3 >> 2;
	r4 = heap32[(r3)];
	r6 = (r4 + -1)&-1;
	heap32[(r3)] = r6;
if(!(r4 >0)) //_LBB99_40
{
	r3 = heap32[(fp+-4)];
	r3 = (r3 + -12)&-1;
	heap32[(g0)] = r3;
	_ZdlPv(i7);
}
}
	heap32[(fp+-4)] = 0;
	heap32[(r2)] = r5;
}
	r2 = _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E5__cat;
	r2 = r2 >> 2;
	r2 = heap32[(r2)];
	if(r2 !=-1) //_LBB99_43
{
	r3 = _ZNSs11_C_null_refE;
	r4 = _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E4msgs;
	r5 = (r3 + 12)&-1;
	r6 = r4 >> 2;
	heap32[(fp+-2)] = r5;
	r5 = _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E8__catset;
	r6 = heap32[(r6)];
	r6 = r6 >> 2;
	r5 = r5 >> 2;
	r6 = heap32[(r6+3)];
	r5 = heap32[(r5)];
	r7 = sp + -24; 
	r8 = sp + -8; 
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r5;
	heap32[(g0+4)] = r0;
	heap32[(g0+5)] = r8;
	__FUNCTION_TABLE__[(r6)>>2](i7);
	r2 = heap32[(fp+-2)];
	r2 = (r2 + -12)&-1;
if(!(r2 ==r3)) //_LBB99_47
{
	r2 = r2 >> 2;
	r4 = heap32[(r2)];
	r5 = (r4 + -1)&-1;
	heap32[(r2)] = r5;
if(!(r4 >0)) //_LBB99_47
{
	r2 = heap32[(fp+-2)];
	r2 = (r2 + -12)&-1;
	heap32[(g0)] = r2;
	_ZdlPv(i7);
}
}
	heap32[(fp+-2)] = 0;
	r2 = heap32[(fp+-6)];
	r4 = r2 >> 2;
	r4 = heap32[(r4+-1)];
	if(r4 !=0) //_LBB99_49
{
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r1;
	_ZN4__rwL13__rw_vfmtwhatEPcjPKcS0_(i7);
	r1 = r_g0;
	r2 = heap32[(fp+-6)];
}
else{
	r1 = 0;
}
	r2 = (r2 + -12)&-1;
if(!(r2 ==r3)) //_LBB99_54
{
	r2 = r2 >> 2;
	r3 = heap32[(r2)];
	r4 = (r3 + -1)&-1;
	heap32[(r2)] = r4;
if(!(r3 >0)) //_LBB99_54
{
	r2 = heap32[(fp+-6)];
	r2 = (r2 + -12)&-1;
	heap32[(g0)] = r2;
	_ZdlPv(i7);
}
}
	heap32[(fp+-6)] = 0;
	if(r1 ==0) //_LBB99_56
{
__label__ = 50;
}
else{
__label__ = 51;
}
}
else{
__label__ = 50;
}
switch(__label__ ){//multiple entries
case 50: 
	r1 = 24;
	r2 = 0;
	r0 = uint(r0) > uint(r1) ? r2 : r0; 
	r1 = _ZZN4__rw10__rw_throwEizE6errors;
	r2 = r0 << 2;
	r1 = (r1 + r2)&-1;
	r1 = r1 >> 2;
	r2 = heap32[(fp+-7)];
	r1 = heap32[(r1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	_ZN4__rwL13__rw_vfmtwhatEPcjPKcS0_(i7);
	r1 = r_g0;
	if(r1 ==0) //_LBB99_60
{
	if(r0 ==2) //_LBB99_65
{
	r0 = _2E_str47;
}
else{
	if(r0 ==1) //_LBB99_64
{
	r0 = _2E_str4385;
}
else{
	if(r0 !=0) //_LBB99_66
{
	r0 = _2E_str5389;
}
else{
	r0 = _2E_str3388;
}
}
}
	heap32[(g0)] = r0;
	fprintf(i7);
__label__ = 62;
}
else{
__label__ = 51;
}
break;
}
switch(__label__ ){//multiple entries
case 51: 
	heap32[(g0)] = r1;
	r0 = _ZN4__rwL13__rw_what_bufE;
	fprintf(i7);
	if(r1 !=r0) //_LBB99_59
{
	heap32[(g0)] = r1;
	_ZdaPv(i7);
}
else{
	r0 = _ZN4__rwL16__rw_what_refcntE;
	r0 = r0 >> 2;
	r1 = heap32[(r0)];
	r1 = (r1 + -1)&-1;
	heap32[(r0)] = r1;
}
break;
}
	abort(i7);
}
else{
	if(r0 ==2) //_LBB99_6
{
	r0 = _2E_str47;
}
else{
	if(r0 ==1) //_LBB99_5
{
	r0 = _2E_str4385;
}
else{
	if(r0 !=0) //_LBB99_7
{
	r0 = _2E_str5389;
}
else{
	r0 = _2E_str3388;
}
}
}
	heap32[(g0)] = r0;
	fprintf(i7);
	abort(i7);
}
}

function _ZN4__rw10__rw_facetD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTVN4__rw10__rw_facetE;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	heap32[(r0+5)] = -1;
	r1 = heap32[(r0+1)];
	r2 = heap32[(r0+2)];
if(!(r1 ==r2)) //_LBB100_3
{
if(!(r1 ==0)) //_LBB100_3
{
	heap32[(g0)] = r1;
	_ZdaPv(i7);
}
}
	r1 = _ZZN4__rw10__rw_facetD4EvE9destroyed;
	heap32[(r0+1)] = r1;
	r1 = heap32[(r0+4)];
if(!(r1 !=-1)) //_LBB100_5
{
	r0 = heap32[(r0+3)];
	heap32[(g0)] = r0;
	_ZdlPv(i7);
}
	return;
}

function _ZN4__rw10__rw_facetD0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTVN4__rw10__rw_facetE;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(r2+5)] = -1;
	r1 = heap32[(r2+1)];
	r3 = heap32[(r2+2)];
if(!(r1 ==r3)) //_LBB101_3
{
if(!(r1 ==0)) //_LBB101_3
{
	heap32[(g0)] = r1;
	_ZdaPv(i7);
}
}
	r1 = _ZZN4__rw10__rw_facetD4EvE9destroyed;
	heap32[(r2+1)] = r1;
	r1 = heap32[(r2+4)];
if(!(r1 !=-1)) //_LBB101_5
{
	r1 = heap32[(r2+3)];
	heap32[(g0)] = r1;
	_ZdlPv(i7);
}
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_E(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = _ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE12n_std_facets;
	r1 = _ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE10std_facets;
	r0 = r0 >> 2;
	r1 = r1 >> 2;
	r2 = heap32[(fp)];
	r3 = heap32[(r0)];
	r4 = heap32[(r1)];
_1: do {
	if(r2 ==0) //_LBB102_24
{
	r5 = heap32[(fp+1)];
	r2 = heap32[(fp+2)];
	r6 = heap32[(fp+3)];
	r7 = _2E_str538;
	r8 = r2 == 0 ? r7 : r2; 
	r9 = r3;
_3: while(true){
	r10 = r9;
	if(r10 ==0) //_LBB102_34
{
__label__ = 34;
break _3;
}
else{
	r9 = r10 << 1;
	r11 = r9 & -4;
	r12 = (r4 + r11)&-1;
	r9 = r12 >> 2;
	r13 = heap32[(r9)];
	r14 = r13 >> 2;
	r15 = heap32[(r14+5)];
	r9 = r10 >>> 1;
	if(r15 !=r5) //_LBB102_27
{
	r15 = (r15 - r5)&-1;
}
else{
	r15 = heap32[(r14+1)];
	r15 = r15 == 0 ? r7 : r15; 
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r15;
	strcmp(i7);
	r15 = r_g0;
}
	if(r15 <0) //_LBB102_31
{
__label__ = 31;
}
else{
	if(r15 <1) //_LBB102_32
{
__label__ = 32;
break _3;
}
else{
	r4 = (r11 + r4)&-1;
	r10 = (r10 + -1)&-1;
	r4 = (r4 + 4)&-1;
	r9 = (r10 - r9)&-1;
}
}
}
}
switch(__label__ ){//multiple entries
case 32: 
if(!(r12 ==0)) //_LBB102_34
{
	r2 = heap32[(r14+6)];
	r2 = (r2 + 1)&-1;
	heap32[(r14+6)] = r2;
	r_g0 = r13;
	return;
}
break;
}
	r4 = _ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE17std_facet_bufsize;
	r4 = r4 >> 2;
	r7 = heap32[(r4)];
if(!(r3 !=r7)) //_LBB102_39
{
	r3 = r3 << 3;
	heap32[(g0)] = r3;
	_Znaj(i7);
	r3 = r_g0;
	r7 = heap32[(r1)];
	r8 = heap32[(r0)];
	r8 = r8 << 2;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = r8;
	memcpy(i7);
	r8 = _ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE13std_facet_buf;
if(!(r7 ==r8)) //_LBB102_38
{
if(!(r7 ==0)) //_LBB102_38
{
	heap32[(g0)] = r7;
	_ZdaPv(i7);
}
}
	heap32[(r1)] = r3;
	r3 = heap32[(r4)];
	r3 = r3 << 1;
	heap32[(r4)] = r3;
}
	r3 = r5 & 1;
	r4 = 0;
	r2 = r3 == 0 ? r2 : r4; 
	heap32[(g0)] = 1;
	heap32[(g0+1)] = r2;
	__FUNCTION_TABLE__[(r6)>>2](i7);
	r2 = r_g0;
	r3 = (r5 + 1)&-1;
	r4 = r3 >>> 31;
	r6 = r2 >> 2;
	r3 = (r3 + r4)&-1;
	r4 = heap32[(r6+7)];
	r4 = r4 >> 2;
	r3 = r3 >> 1;
	heap32[(r4)] = r3;
	r3 = heap32[(r6+5)];
if(!(r3 ==r5)) //_LBB102_41
{
	r3 = r2 >> 2;
	heap32[(r3+5)] = r5;
}
	r3 = r2 >> 2;
	r4 = heap32[(r3+6)];
if(!(r4 ==1)) //_LBB102_43
{
	heap32[(r3+6)] = 1;
}
	r3 = heap32[(r0)];
	r1 = heap32[(r1)];
	r4 = r3 << 2;
	r4 = (r1 + r4)&-1;
	r4 = r4 >> 2;
	r5 = (r3 + 1)&-1;
	heap32[(r4)] = r2;
	heap32[(r0)] = r5;
	r0 = (r3 + -1)&-1;
	if(uint(r0) <uint(2147483645)) //_LBB102_45
{
	r0 = cmpfacets__index__;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = r0;
	quicksort(i7);
}
}
else{
	r5 = r3;
	r6 = r4;
_31: while(true){
	r7 = r5;
	if(r7 ==0) //_LBB102_23
{
__label__ = 23;
break _31;
}
else{
	r5 = r7 << 1;
	r8 = r5 & -4;
	r9 = (r6 + r8)&-1;
	r5 = r9 >> 2;
	r5 = heap32[(r5)];
	r10 = r2 >> 2;
	r11 = r5 >> 2;
	r12 = heap32[(r10+5)];
	r13 = heap32[(r11+5)];
	r5 = r7 >>> 1;
	if(r12 !=r13) //_LBB102_4
{
	r12 = (r13 - r12)&-1;
}
else{
	r12 = heap32[(r11+1)];
	r13 = heap32[(r10+1)];
	r10 = _2E_str538;
	r13 = r13 == 0 ? r10 : r13; 
	r12 = r12 == 0 ? r10 : r12; 
	heap32[(g0)] = r13;
	heap32[(g0+1)] = r12;
	strcmp(i7);
	r12 = r_g0;
}
	if(r12 <0) //_LBB102_8
{
__label__ = 8;
}
else{
	if(r12 <1) //_LBB102_9
{
__label__ = 9;
break _31;
}
else{
	r6 = (r8 + r6)&-1;
	r7 = (r7 + -1)&-1;
	r6 = (r6 + 4)&-1;
	r5 = (r7 - r5)&-1;
}
}
}
}
switch(__label__ ){//multiple entries
case 9: 
if(!(r9 ==0)) //_LBB102_23
{
	r2 = (r9 - r4)&-1;
	r5 = r2 & -4;
	r6 = (r4 + r5)&-1;
	r6 = r6 >> 2;
	r6 = heap32[(r6)];
	r7 = r6 >> 2;
	r8 = heap32[(r7+6)];
	r8 = (r8 + -1)&-1;
	heap32[(r7+6)] = r8;
	if(r8 ==0) //_LBB102_12
{
	r2 = r2 >> 2;
	r8 = (r3 + -1)&-1;
	heap32[(r0)] = r8;
	if(uint(r8) >uint(207)) //_LBB102_17
{
__label__ = 17;
}
else{
	r0 = _ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE13std_facet_buf;
	if(r4 ==r0) //_LBB102_17
{
__label__ = 17;
}
else{
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r5;
	r3 = r2 << 2;
	r5 = (r3 + r4)&-1;
	r2 = (r8 - r2)&-1;
	memcpy(i7);
	r3 = (r0 + r3)&-1;
	r8 = (r5 + 4)&-1;
	r2 = r2 << 2;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r8;
	heap32[(g0+2)] = r2;
	memcpy(i7);
if(!(r4 ==0)) //_LBB102_16
{
	heap32[(g0)] = r4;
	_ZdaPv(i7);
}
	heap32[(r1)] = r0;
__label__ = 20;
}
}
_51: do {
switch(__label__ ){//multiple entries
case 17: 
	r0 = (r8 - r2)&-1;
	r0 = r0 << 2;
if(!(r0 ==0)) //_LBB102_20
{
	r0 = r3 << 2;
	r2 = r2 << 2;
	r0 = (r0 + -4)&-1;
	r1 = (r2 + r4)&-1;
	r2 = (r0 - r2)&-1;
	r0 = (r1 + 4)&-1;
_54: while(true){
	r1 = heapU8[r0];
	r2 = (r2 + -1)&-1;
	r3 = (r0 + 1)&-1;
	heap8[r0+-4] = r1;
	r0 = r3;
if(!(r2 !=0)) //_LBB102_19
{
break _51;
}
}
}
break;
}
} while(0);
	r2 = heap32[(r7+1)];
if(!(r2 ==0)) //_LBB102_11
{
if(!(r6 ==0)) //_LBB102_11
{
	r2 = heap32[(r7)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+1)];
	heap32[(g0)] = r6;
	__FUNCTION_TABLE__[(r2)>>2](i7);
	r2 = 0;
	r_g0 = r2;
	return;
}
}
}
	r2 = 0;
break _1;
}
break;
}
	r0 = r2 >> 2;
	r1 = heap32[(r0+6)];
	r1 = (r1 + -1)&-1;
	heap32[(r0+6)] = r1;
	r0 = 0;
	r_g0 = r0;
	return;
}
} while(0);
	r_g0 = r2;
	return;
}

function cmpfacets(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r0 = r0 >> 2;
	r1 = r1 >> 2;
	r0 = heap32[(r0)];
	r1 = heap32[(r1)];
	r0 = r0 >> 2;
	r1 = r1 >> 2;
	r2 = heap32[(r0+5)];
	r3 = heap32[(r1+5)];
	if(r2 !=r3) //_LBB103_2
{
	r0 = (r3 - r2)&-1;
	r_g0 = r0;
	return;
}
else{
	r2 = heap32[(r1+1)];
	r3 = heap32[(r0+1)];
	r0 = _2E_str538;
	r3 = r3 == 0 ? r0 : r3; 
	r2 = r2 == 0 ? r0 : r2; 
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	return;
}
}

function _ZN4__rwL16__rw_expand_nameERNS_14__rw_pod_arrayIcLj256EEEPKc(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
var __label__ = 0;
	i7 = sp + -640;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = 0;
	r3 = r1;
_1: while(true){
	r4 = r2 << 2;
	r5 = heapU8[r3];
	if(r5 !=59) //_LBB104_3
{
	if(r5 !=0) //_LBB104_5
{
	r5 = heapU8[r3+1];
	if(r5 ==59) //_LBB104_14
{
__label__ = 14;
break _1;
}
else{
	if(r5 ==0) //_LBB104_4
{
__label__ = 4;
break _1;
}
else{
	r5 = heapU8[r3+2];
	if(r5 !=59) //_LBB104_9
{
	if(r5 ==0) //_LBB104_4
{
__label__ = 4;
break _1;
}
else{
	r5 = heapU8[r3+3];
	if(r5 !=59) //_LBB104_12
{
	if(r5 ==0) //_LBB104_4
{
__label__ = 4;
break _1;
}
else{
	r2 = (r2 + 1)&-1;
	r3 = (r3 + 4)&-1;
continue _1;
}
}
else{
__label__ = 11;
break _1;
}
}
}
else{
__label__ = 8;
break _1;
}
}
}
}
else{
__label__ = 4;
break _1;
}
}
else{
__label__ = 2;
break _1;
}
}
switch(__label__ ){//multiple entries
case 14: 
	r2 = (r3 + 1)&-1;
break;
case 4: 
	r2 = 0;
break;
case 2: 
	r2 = (r1 + r4)&-1;
break;
case 11: 
	r2 = r4 | 3;
	r2 = (r1 + r2)&-1;
break;
case 8: 
	r2 = r4 | 2;
	r2 = (r1 + r2)&-1;
break;
}
_18: do {
	if(r2 ==r1) //_LBB104_17
{
	r3 = (r1 + 1)&-1;
	r4 = (r1 + 3)&-1;
	r5 = 0;
	r2 = r3;
_20: while(true){
	r6 = heapU8[r4+-2];
	if(r6 ==59) //_LBB104_21
{
__label__ = 19;
break _20;
}
else{
	if(r6 !=0) //_LBB104_22
{
	r6 = heapU8[r4+-1];
	if(r6 ==0) //_LBB104_20
{
__label__ = 90;
break _18;
}
else{
	r7 = r5 << 2;
	if(r6 !=59) //_LBB104_25
{
	r6 = heapU8[r4];
	if(r6 ==0) //_LBB104_20
{
__label__ = 90;
break _18;
}
else{
	if(r6 !=59) //_LBB104_28
{
	r6 = heapU8[r4+1];
	if(r6 ==0) //_LBB104_20
{
__label__ = 90;
break _18;
}
else{
	if(r6 !=59) //_LBB104_31
{
	r5 = (r5 + 1)&-1;
	r4 = (r4 + 4)&-1;
	r2 = (r2 + 4)&-1;
}
else{
__label__ = 27;
break _20;
}
}
}
else{
__label__ = 32;
break _18;
}
}
}
else{
__label__ = 22;
break _20;
}
}
}
else{
__label__ = 90;
break _18;
}
}
}
switch(__label__ ){//multiple entries
case 19: 
	r1 = r3;
__label__ = 29;
break _18;
break;
case 27: 
	r2 = r7 | 3;
	r1 = (r2 + r1)&-1;
	r4 = (r1 + 1)&-1;
__label__ = 32;
break _18;
break;
case 22: 
	r2 = r7 | 1;
	r1 = (r2 + r1)&-1;
	r4 = (r1 + 1)&-1;
__label__ = 32;
break;
}
}
else{
__label__ = 29;
}
} while(0);
switch(__label__ ){//multiple entries
case 29: 
	if(r2 ==0) //_LBB104_34
{
	r3 = r1;
__label__ = 90;
}
else{
	r4 = r2;
	r3 = r1;
__label__ = 32;
}
break;
}
_39: do {
switch(__label__ ){//multiple entries
case 90: 
	r7 = heapU8[r3];
	if(r7 ==0) //_LBB104_98
{
	r0 = sp + -624; 
	r0 = r0 >> 2;
	heap32[(r0+20)] = 0;
	heap32[(r0+22)] = 0;
	heap32[(r0+21)] = 0;
__label__ = 73;
break _39;
}
else{
	r7 = 1;
__label__ = 93;
break _39;
}
break;
case 32: 
	r1 = sp + -264; 
	r2 = sp + -528; 
	r5 = (r1 + 8)&-1;
	r6 = (r2 + 8)&-1;
	r7 = 1;
	r8 = 0;
_45: while(true){
	if(r4 ==0) //_LBB104_39
{
	r4 = heapU8[r3];
_49: do {
	if(r4 !=0) //_LBB104_41
{
	r9 = (r3 + 1)&-1;
	r10 = 0;
_51: while(true){
	r4 = (r10 + 1)&-1;
	r11 = heapU8[r9+r10];
	r10 = r4;
if(!(r11 !=0)) //_LBB104_42
{
break _49;
}
}
}
else{
	r4 = 0;
}
} while(0);
	r4 = (r3 + r4)&-1;
}
	r9 = (r4 - r3)&-1;
	heap32[(fp+-66)] = r9;
	if(uint(r9) >uint(255)) //_LBB104_46
{
	r10 = (r9 + 1)&-1;
	heap32[(g0)] = r10;
	_Znaj(i7);
	r10 = r_g0;
}
else{
	r10 = r5;
}
	r11 = r1 >> 2;
	heap32[(r11+1)] = r10;
	heap32[(g0)] = r10;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r9;
	memcpy(i7);
	r9 = heap32[(r11+1)];
	r10 = heap32[(fp+-66)];
	r12 = 0;
	heap8[r9+r10] = r12;
	r9 = r2 >> 2;
	heap32[(fp+-132)] = 0;
	heap32[(r9+1)] = r6;
	heap8[sp+-520] = r12;
	r10 = _ZN4__rw9__rw_catsE;
	r13 = (r8 * 12)&-1;
	r10 = (r10 + r13)&-1;
	r13 = heap32[(r11+1)];
	r10 = r10 >> 2;
	r10 = heap32[(r10)];
	heap32[(g0)] = r10;
	heap32[(g0+1)] = r13;
	heap32[(g0+2)] = r2;
	_ZN4__rw16__rw_locale_nameEiPKcRNS_14__rw_pod_arrayIcLj256EEE(i7);
	r10 = r_g0;
	if(r10 !=0) //_LBB104_50
{
	r13 = heapU8[r10];
_63: do {
	if(r13 !=0) //_LBB104_52
{
	r14 = (r10 + 1)&-1;
_65: while(true){
	r13 = (r12 + 1)&-1;
	r15 = heapU8[r14+r12];
	r12 = r13;
if(!(r15 !=0)) //_LBB104_53
{
break _63;
}
}
}
else{
	r13 = 0;
}
} while(0);
	r12 = r7 & 255;
_69: do {
if(!(r12 ==0)) //_LBB104_56
{
	if(r8 !=0) //_LBB104_57
{
	r7 = r0 >> 2;
	r7 = heap32[(r7+1)];
	r12 = r7;
	r14 = r10;
	r15 = r13;
_72: while(true){
	if(r15 !=0) //_LBB104_58
{
	r15 = (r15 + -1)&-1;
	r16 = (r14 + 1)&-1;
	r17 = (r12 + 1)&-1;
	r18 = heapU8[r12];
	r19 = heapU8[r14];
	r12 = r17;
	r14 = r16;
	if(r18 !=r19) //_LBB104_62
{
__label__ = 57;
break _72;
}
else{
__label__ = 54;
}
}
else{
__label__ = 55;
break _72;
}
}
switch(__label__ ){//multiple entries
case 55: 
	r7 = heapU8[r7+r13];
if(!(r7 !=59)) //_LBB104_62
{
	r7 = 1;
break _69;
}
break;
}
	r7 = 0;
}
}
} while(0);
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r10;
	heap32[(g0+2)] = r13;
	_ZN4__rw14__rw_pod_arrayIcLj256EE6appendEPKcj(i7);
	r8 = (r8 + 1)&-1;
	if(r8 !=6) //_LBB104_66
{
	r10 = heapU8[r4];
	if(r10 !=0) //_LBB104_68
{
	r3 = _2E_str785;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = 1;
	_ZN4__rw14__rw_pod_arrayIcLj256EE6appendEPKcj(i7);
	r3 = (r4 + 1)&-1;
	r4 = 2;
}
else{
	r4 = 1;
}
}
else{
	r4 = 1;
	r8 = 6;
}
}
else{
	r4 = 0;
}
	r9 = heap32[(r9+1)];
if(!(r9 ==r6)) //_LBB104_73
{
if(!(r9 ==0)) //_LBB104_73
{
	heap32[(g0)] = r9;
	_ZdaPv(i7);
}
}
	if(r4 ==1) //_LBB104_79
{
__label__ = 74;
break _45;
}
else{
	if(r4 !=0) //_LBB104_83
{
	r4 = heap32[(r11+1)];
	if(r4 ==r5) //_LBB104_85
{
__label__ = 79;
}
else{
	if(r4 !=0) //_LBB104_86
{
	r10 = 0;
	heap32[(g0)] = r4;
	_ZdaPv(i7);
	r9 = r3;
__label__ = 81;
}
else{
__label__ = 79;
}
}
switch(__label__ ){//multiple entries
case 79: 
	r10 = 0;
	r9 = r3;
break;
}
_101: while(true){
	r4 = r10 << 2;
	r11 = r4 | 3;
	r12 = r4 | 2;
	r13 = heapU8[r9];
	r4 = (r3 + r4)&-1;
	r11 = (r3 + r11)&-1;
	r12 = (r3 + r12)&-1;
	if(r13 ==59) //_LBB104_37
{
continue _45;
}
else{
	r4 = 0;
	if(r13 ==0) //_LBB104_37
{
continue _45;
}
else{
	r13 = heapU8[r9+1];
	if(r13 ==59) //_LBB104_36
{
break _101;
}
else{
	r4 = 0;
	if(r13 ==0) //_LBB104_37
{
continue _45;
}
else{
	r13 = heapU8[r9+2];
	r4 = r12;
	if(r13 ==59) //_LBB104_37
{
continue _45;
}
else{
	r4 = 0;
	if(r13 ==0) //_LBB104_37
{
continue _45;
}
else{
	r12 = heapU8[r9+3];
	r4 = r11;
	if(r12 ==59) //_LBB104_37
{
continue _45;
}
else{
	r4 = 0;
	if(r12 ==0) //_LBB104_37
{
continue _45;
}
else{
	r10 = (r10 + 1)&-1;
	r9 = (r9 + 4)&-1;
}
}
}
}
}
}
}
}
}
	r4 = (r9 + 1)&-1;
continue _45;
}
else{
__label__ = 70;
break _45;
}
}
}
switch(__label__ ){//multiple entries
case 74: 
	r1 = heap32[(r11+1)];
	if(r1 ==r5) //_LBB104_81
{
__label__ = 93;
break _39;
}
else{
	if(r1 !=0) //_LBB104_82
{
	heap32[(g0)] = r1;
	_ZdaPv(i7);
__label__ = 93;
break _39;
}
else{
__label__ = 93;
break _39;
}
}
break;
case 70: 
	r0 = heap32[(r11+1)];
	if(r0 ==r5) //_LBB104_78
{
__label__ = 73;
}
else{
	if(r0 ==0) //_LBB104_78
{
__label__ = 73;
}
else{
	heap32[(g0)] = r0;
	_ZdaPv(i7);
__label__ = 73;
}
}
break;
}
break;
}
} while(0);
_119: do {
switch(__label__ ){//multiple entries
case 93: 
	r1 = r0 >> 2;
	r2 = heap32[(r1+1)];
	r4 = heapU8[r2];
	if(r4 ==0) //_LBB104_117
{
	heap32[(g0)] = 0;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r0;
	_ZN4__rw16__rw_locale_nameEiPKcRNS_14__rw_pod_arrayIcLj256EEE(i7);
	r0 = r_g0;
	if(r0 ==0) //_LBB104_78
{
break _119;
}
}
else{
	r3 = r7 & 255;
if(!(r3 ==0)) //_LBB104_118
{
	r3 = 0;
	r4 = r2;
_125: while(true){
	r5 = r3 << 2;
	r6 = heapU8[r4];
	if(r6 !=59) //_LBB104_104
{
	if(r6 !=0) //_LBB104_106
{
	r6 = heapU8[r4+1];
	if(r6 ==59) //_LBB104_115
{
__label__ = 109;
break _125;
}
else{
	if(r6 ==0) //_LBB104_105
{
__label__ = 99;
break _125;
}
else{
	r6 = heapU8[r4+2];
	if(r6 !=59) //_LBB104_110
{
	if(r6 ==0) //_LBB104_105
{
__label__ = 99;
break _125;
}
else{
	r6 = heapU8[r4+3];
	if(r6 !=59) //_LBB104_113
{
	if(r6 ==0) //_LBB104_105
{
__label__ = 99;
break _125;
}
else{
	r3 = (r3 + 1)&-1;
	r4 = (r4 + 4)&-1;
}
}
else{
__label__ = 106;
break _125;
}
}
}
else{
__label__ = 103;
break _125;
}
}
}
}
else{
__label__ = 99;
break _125;
}
}
else{
__label__ = 97;
break _125;
}
}
switch(__label__ ){//multiple entries
case 109: 
	r3 = (r4 + 1)&-1;
break;
case 99: 
	r3 = 0;
break;
case 97: 
	r3 = (r2 + r5)&-1;
break;
case 106: 
	r3 = r5 | 3;
	r3 = (r2 + r3)&-1;
break;
case 103: 
	r3 = r5 | 2;
	r3 = (r2 + r3)&-1;
break;
}
	r3 = (r3 - r2)&-1;
	heap32[(r1+1)] = r2;
	heap32[(r1)] = r3;
	r3 = _2E_str15386;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = 1;
	_ZN4__rw14__rw_pod_arrayIcLj256EE6appendEPKcj(i7);
}
}
	r0 = heap32[(r1+1)];
	r_g0 = r0;
	return;
break;
}
} while(0);
	r0 = 0;
	r_g0 = r0;
	return;
}

function cmplocales(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r0 = r0 >> 2;
	r1 = r1 >> 2;
	r0 = heap32[(r0)];
	r1 = heap32[(r1)];
	r1 = r1 >> 2;
	r0 = r0 >> 2;
	r1 = heap32[(r1+38)];
	r0 = heap32[(r0+38)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	strcmp(i7);
	return;
}

function _ZN4__rw11__rw_localeD2Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r2 = heap32[(r1+38)];
	r3 = (r0 + 112)&-1;
	if(r2 ==r3) //_LBB106_2
{
__label__ = 2;
}
else{
	if(r2 !=0) //_LBB106_3
{
	r3 = 0;
	heap32[(g0)] = r2;
	_ZdaPv(i7);
__label__ = 4;
}
else{
__label__ = 2;
}
}
switch(__label__ ){//multiple entries
case 2: 
	r3 = 0;
break;
}
_6: while(true){
	r2 = r3 << 2;
	r2 = (r0 - r2)&-1;
	r2 = r2 >> 2;
	r4 = 0;
	r2 = heap32[(r2)];
if(!(r2 ==0)) //_LBB106_10
{
	r5 = r2 >> 2;
	r6 = heap32[(r5+5)];
	if(r6 ==0) //_LBB106_7
{
	r2 = heap32[(r5+6)];
	r2 = (r2 + -1)&-1;
	heap32[(r5+6)] = r2;
if(!(r2 !=0)) //_LBB106_10
{
	r2 = (r4 - r3)&-1;
	r2 = r2 << 2;
	r2 = (r0 + r2)&-1;
	r2 = r2 >> 2;
	r2 = heap32[(r2)];
if(!(r2 ==0)) //_LBB106_10
{
	r5 = r2 >> 2;
	r5 = heap32[(r5)];
	r5 = r5 >> 2;
	r5 = heap32[(r5+1)];
	heap32[(g0)] = r2;
	__FUNCTION_TABLE__[(r5)>>2](i7);
}
}
}
else{
	r5 = heap32[(r5+1)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r6;
	heap32[(g0+2)] = r5;
	heap32[(g0+3)] = 0;
	_ZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_E(i7);
}
}
	r3 = (r3 + -1)&-1;
	if(r3 !=-26) //_LBB106_4
{
continue _6;
}
else{
break _6;
}
}
	r0 = heap32[(r1+26)];
	r2 = heap32[(r1+27)];
_17: do {
if(!(r2 ==0)) //_LBB106_13
{
_18: while(true){
	r2 = r4 << 2;
	r0 = (r0 + r2)&-1;
	r0 = r0 >> 2;
	r0 = heap32[(r0)];
	r0 = r0 >> 2;
	r3 = heap32[(r0+6)];
	r3 = (r3 + -1)&-1;
	heap32[(r0+6)] = r3;
if(!(r3 !=0)) //_LBB106_17
{
	r0 = heap32[(r1+26)];
	r0 = (r0 + r2)&-1;
	r0 = r0 >> 2;
	r0 = heap32[(r0)];
if(!(r0 ==0)) //_LBB106_17
{
	r2 = r0 >> 2;
	r2 = heap32[(r2)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+1)];
	heap32[(g0)] = r0;
	__FUNCTION_TABLE__[(r2)>>2](i7);
}
}
	r4 = (r4 + 1)&-1;
	r0 = heap32[(r1+26)];
	r2 = heap32[(r1+27)];
	if(r4 !=r2) //_LBB106_14
{
continue _18;
}
else{
break _17;
}
}
}
} while(0);
if(!(r0 ==0)) //_LBB106_20
{
	heap32[(g0)] = r0;
	_ZdaPv(i7);
}
	return;
}

function _ZN4__rw11__rw_localeC2EPKc(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
var __label__ = 0;
	i7 = sp + -280;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	heap32[(r1+26)] = 0;
	heap32[(r1+27)] = 0;
	heap32[(r1+39)] = 1;
	r2 = heap32[(fp+1)];
	heap32[(r1+40)] = 0;
	heap32[(r1+41)] = 0;
	r3 = heapU8[r2];
	if(r3 ==0) //_LBB107_2
{
	r3 = sp + -264; 
	r4 = 0;
	r5 = r3 >> 2;
	r6 = (r0 + 112)&-1;
	heap8[sp+-256] = r4;
	heap32[(r5+1)] = r6;
	heap32[(fp+-66)] = 0;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r2;
	r2 = (r3 + 8)&-1;
	_ZN4__rwL16__rw_expand_nameERNS_14__rw_pod_arrayIcLj256EEEPKc(i7);
	r3 = r_g0;
	heap32[(r1+38)] = r3;
	heap32[(r5+1)] = r2;
}
else{
	r3 = 1;
_5: while(true){
	r4 = (r3 + 1)&-1;
	r5 = heapU8[r2+r3];
	r3 = r4;
if(!(r5 !=0)) //_LBB107_4
{
break _5;
}
}
	if(uint(r4) >uint(39)) //_LBB107_7
{
	heap32[(g0)] = r4;
	_Znaj(i7);
	r3 = r_g0;
}
else{
	r3 = (r0 + 112)&-1;
}
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r4;
	memcpy(i7);
	heap32[(r1+38)] = r3;
}
	r2 = 0;
	heap32[(r1+40)] = 67108863;
	heap32[(r1+41)] = 0;
_13: while(true){
	r4 = (r3 - r2)&-1;
	r5 = heapU8[r4];
	if(r5 ==0) //_LBB107_43
{
__label__ = 41;
break _13;
}
else{
	if(r5 ==59) //_LBB107_20
{
__label__ = 20;
break _13;
}
else{
	r5 = heapU8[r4+1];
	if(r5 ==0) //_LBB107_43
{
__label__ = 41;
break _13;
}
else{
	if(r5 !=59) //_LBB107_15
{
	r5 = heapU8[r4+2];
	if(r5 ==0) //_LBB107_43
{
__label__ = 41;
break _13;
}
else{
	if(r5 ==59) //_LBB107_14
{
__label__ = 14;
break _13;
}
else{
	r4 = heapU8[r4+3];
	if(r4 ==0) //_LBB107_43
{
__label__ = 41;
break _13;
}
else{
	if(r4 ==59) //_LBB107_14
{
__label__ = 14;
break _13;
}
else{
	r2 = (r2 + -4)&-1;
continue _13;
}
}
}
}
}
else{
__label__ = 14;
break _13;
}
}
}
}
}
switch(__label__ ){//multiple entries
case 20: 
	if(r3 ==r2) //_LBB107_43
{
__label__ = 41;
}
else{
__label__ = 14;
}
break;
}
_25: do {
switch(__label__ ){//multiple entries
case 41: 
	r2 = heapU8[r3];
if(!(r2 !=67)) //_LBB107_45
{
	r2 = heapU8[r3+1];
	if(r2 ==0) //_LBB107_46
{
break _25;
}
}
	heap32[(r1+41)] = 67108863;
break;
case 14: 
	r2 = 0;
	r4 = r2;
_31: while(true){
	r5 = heapU8[r3];
	if(r5 ==0) //_LBB107_46
{
break _25;
}
else{
	if(r2 !=-6) //_LBB107_21
{
	r5 = r5 & 255;
	if(r5 !=67) //_LBB107_24
{
__label__ = 23;
}
else{
	r5 = heapU8[r3+1];
	if(r5 !=59) //_LBB107_24
{
__label__ = 23;
}
else{
__label__ = 24;
}
}
switch(__label__ ){//multiple entries
case 23: 
	r5 = (r2 * -3)&-1;
	r6 = _ZN4__rw9__rw_catsE;
	r5 = r5 << 2;
	r5 = (r6 + r5)&-1;
	r5 = r5 >> 2;
	r5 = heap32[(r5+2)];
	r4 = r5 | r4;
	heap32[(r1+41)] = r4;
break;
}
	r5 = 0;
	r6 = r3;
_40: while(true){
	r7 = heapU8[r6];
	if(r7 ==0) //_LBB107_46
{
break _25;
}
else{
	if(r7 ==59) //_LBB107_37
{
__label__ = 36;
break _40;
}
else{
	r7 = heapU8[r6+1];
	if(r7 ==0) //_LBB107_46
{
break _25;
}
else{
	if(r7 ==59) //_LBB107_39
{
__label__ = 37;
break _40;
}
else{
	r7 = heapU8[r6+2];
	if(r7 ==0) //_LBB107_46
{
break _25;
}
else{
	r8 = r5 << 2;
	if(r7 !=59) //_LBB107_33
{
	r7 = heapU8[r6+3];
	if(r7 ==0) //_LBB107_46
{
break _25;
}
else{
	if(r7 !=59) //_LBB107_36
{
	r5 = (r5 + 1)&-1;
	r6 = (r6 + 4)&-1;
}
else{
__label__ = 34;
break _40;
}
}
}
else{
__label__ = 31;
break _40;
}
}
}
}
}
}
}
switch(__label__ ){//multiple entries
case 36: 
	if(r6 ==0) //_LBB107_46
{
break _25;
}
break;
case 37: 
	r6 = (r6 + 1)&-1;
break;
case 34: 
	r5 = r8 | 3;
	r6 = (r3 + r5)&-1;
break;
case 31: 
	r5 = r8 | 2;
	r6 = (r3 + r5)&-1;
break;
}
	r3 = (r6 + 1)&-1;
	r2 = (r2 + -1)&-1;
continue _31;
}
else{
break _25;
}
}
}
break;
}
} while(0);
	r1 = 104;
	r3 = 0;
_57: while(true){
	r2 = (r1 + -1)&-1;
	r1 = (r0 - r1)&-1;
	heap8[r1+104] = r3;
	r1 = r2;
	if(r2 !=0) //_LBB107_47
{
continue _57;
}
else{
break _57;
}
}
	return;
}

function _ZN4__rw11__rw_locale9_C_manageEPS0_PKc(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
var __label__ = 0;
	i7 = sp + -280;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = heap32[(fp)];
	if(r0 !=0) //_LBB108_9
{
	r2 = heapU8[r0];
	if(r2 ==67) //_LBB108_11
{
	r2 = heapU8[r0+1];
	r3 = 0;
	r2 = r2 != r3;
}
else{
	r2 = 1;
}
	r3 = sp + -264; 
	r4 = (r3 + 8)&-1;
	r5 = _2E_str538;
	r6 = r3 >> 2;
	heap32[(fp+-66)] = 0;
	r0 = r2 != 0 ? r0 : r5; 
	r7 = 0;
	heap32[(r6+1)] = r4;
	heap8[sp+-256] = r7;
	if(r1 !=0) //_LBB108_14
{
__label__ = 19;
}
else{
	if(r2 != 0) //_LBB108_15
{
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r0;
	_ZN4__rwL16__rw_expand_nameERNS_14__rw_pod_arrayIcLj256EEEPKc(i7);
	r0 = r_g0;
	if(r0 !=0) //_LBB108_18
{
	r2 = heapU8[r0];
	if(r2 ==67) //_LBB108_20
{
	r2 = heapU8[r0+1];
	if(r2 !=0) //_LBB108_19
{
__label__ = 19;
}
else{
	r0 = r5;
__label__ = 19;
}
}
else{
__label__ = 19;
}
}
else{
__label__ = 15;
}
}
else{
__label__ = 19;
}
}
_14: do {
switch(__label__ ){//multiple entries
case 19: 
	r2 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE9n_locales;
	r3 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE7locales;
	r2 = r2 >> 2;
	r3 = r3 >> 2;
	r5 = heap32[(r2)];
	r8 = heap32[(r3)];
	if(r1 ==0) //_LBB108_24
{
	r7 = r5;
_18: while(true){
	r9 = r7;
	if(r9 ==0) //_LBB108_53
{
__label__ = 49;
break _18;
}
else{
	r1 = r9 << 1;
	r10 = r1 & -4;
	r11 = (r8 + r10)&-1;
	r1 = r11 >> 2;
	r1 = heap32[(r1)];
	r12 = r1 >> 2;
	r7 = heap32[(r12+38)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r7;
	strcmp(i7);
	r13 = r_g0;
	r7 = r9 >>> 1;
	if(r13 <0) //_LBB108_50
{
__label__ = 46;
}
else{
	if(r13 <1) //_LBB108_51
{
__label__ = 47;
break _18;
}
else{
	r1 = (r10 + r8)&-1;
	r9 = (r9 + -1)&-1;
	r8 = (r1 + 4)&-1;
	r7 = (r9 - r7)&-1;
}
}
}
}
switch(__label__ ){//multiple entries
case 47: 
if(!(r11 ==0)) //_LBB108_53
{
	r0 = heap32[(r12+39)];
	r0 = (r0 + 1)&-1;
	heap32[(r12+39)] = r0;
__label__ = 65;
break _14;
}
break;
}
	r1 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE14locale_bufsize;
	r1 = r1 >> 2;
	r7 = heap32[(r1)];
if(!(r5 !=r7)) //_LBB108_59
{
	r5 = r5 << 3;
	heap32[(g0)] = r5;
	_Znaj(i7);
	r5 = r_g0;
	r7 = heap32[(r3)];
	r8 = heap32[(r2)];
	r8 = r8 << 2;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = r8;
	memcpy(i7);
	r8 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE10locale_buf;
if(!(r7 ==r8)) //_LBB108_58
{
if(!(r7 ==0)) //_LBB108_58
{
	heap32[(g0)] = r7;
	_ZdaPv(i7);
}
}
	heap32[(r3)] = r5;
	r5 = heap32[(r1)];
	r5 = r5 << 1;
	heap32[(r1)] = r5;
}
	r1 = heapU8[r0];
	if(r1 !=67) //_LBB108_65
{
__label__ = 61;
}
else{
	r1 = heapU8[r0+1];
	if(r1 !=0) //_LBB108_65
{
__label__ = 61;
}
else{
	r1 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE7classic;
	r5 = r1 >> 2;
	r1 = heap32[(r5)];
	if(r1 !=0) //_LBB108_64
{
	r0 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE12classic_body;
	r0 = r0 >> 2;
	r5 = heap32[(r0+39)];
	r5 = (r5 + 1)&-1;
	heap32[(r0+39)] = r5;
__label__ = 63;
}
else{
	r1 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE12classic_body;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	_ZN4__rw11__rw_localeC2EPKc(i7);
	heap32[(r5)] = r1;
__label__ = 63;
}
}
}
switch(__label__ ){//multiple entries
case 61: 
	heap32[(g0)] = 172;
	_Znwj(i7);
	r1 = r_g0;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	_ZN4__rw11__rw_localeC2EPKc(i7);
break;
}
	r0 = heap32[(r2)];
	r3 = heap32[(r3)];
	r5 = r0 << 2;
	r5 = (r3 + r5)&-1;
	r5 = r5 >> 2;
	r7 = (r0 + 1)&-1;
	heap32[(r5)] = r1;
	heap32[(r2)] = r7;
	r2 = (r0 + -1)&-1;
	if(uint(r2) <uint(2147483645)) //_LBB108_69
{
	r2 = cmplocales__index__;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = r0;
	heap32[(g0+3)] = r2;
	quicksort(i7);
__label__ = 65;
}
else{
__label__ = 65;
}
}
else{
	r9 = r5;
	r10 = r8;
_48: while(true){
	r11 = r9;
	if(r11 ==0) //_LBB108_46
{
__label__ = 42;
break _48;
}
else{
	r9 = r11 << 1;
	r12 = r9 & -4;
	r13 = (r10 + r12)&-1;
	r9 = r13 >> 2;
	r9 = heap32[(r9)];
	r9 = r9 >> 2;
	r9 = heap32[(r9+38)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r9;
	strcmp(i7);
	r14 = r_g0;
	r9 = r11 >>> 1;
	if(r14 <0) //_LBB108_28
{
__label__ = 25;
}
else{
	if(r14 <1) //_LBB108_29
{
__label__ = 26;
break _48;
}
else{
	r10 = (r12 + r10)&-1;
	r11 = (r11 + -1)&-1;
	r10 = (r10 + 4)&-1;
	r9 = (r11 - r9)&-1;
}
}
}
}
switch(__label__ ){//multiple entries
case 26: 
if(!(r13 ==0)) //_LBB108_46
{
	r1 = (r13 - r8)&-1;
	r0 = r1 & -4;
	r9 = (r8 + r0)&-1;
	r9 = r9 >> 2;
	r9 = heap32[(r9)];
	r10 = r9 >> 2;
	r11 = heap32[(r10+39)];
	r11 = (r11 + -1)&-1;
	heap32[(r10+39)] = r11;
	if(r11 !=0) //_LBB108_17
{
__label__ = 15;
break _14;
}
else{
	r1 = r1 >> 2;
	r11 = (r5 + -1)&-1;
	heap32[(r2)] = r11;
	if(uint(r11) >uint(3)) //_LBB108_36
{
__label__ = 33;
}
else{
	r2 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE10locale_buf;
	if(r8 ==r2) //_LBB108_36
{
__label__ = 33;
}
else{
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r8;
	heap32[(g0+2)] = r0;
	r0 = r1 << 2;
	r5 = (r0 + r8)&-1;
	r1 = (r11 - r1)&-1;
	memcpy(i7);
	r0 = (r2 + r0)&-1;
	r5 = (r5 + 4)&-1;
	r1 = r1 << 2;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r1;
	memcpy(i7);
if(!(r8 ==0)) //_LBB108_35
{
	heap32[(g0)] = r8;
	_ZdaPv(i7);
}
	r1 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE14locale_bufsize;
	r1 = r1 >> 2;
	heap32[(r3)] = r2;
	heap32[(r1)] = 8;
__label__ = 36;
}
}
_63: do {
switch(__label__ ){//multiple entries
case 33: 
	r0 = (r11 - r1)&-1;
	r0 = r0 << 2;
if(!(r0 ==0)) //_LBB108_39
{
	r0 = r5 << 2;
	r1 = r1 << 2;
	r0 = (r0 + -4)&-1;
	r2 = (r1 + r8)&-1;
	r1 = (r0 - r1)&-1;
	r0 = (r2 + 4)&-1;
_66: while(true){
	r2 = heapU8[r0];
	r1 = (r1 + -1)&-1;
	r3 = (r0 + 1)&-1;
	heap8[r0+-4] = r2;
	r0 = r3;
if(!(r1 !=0)) //_LBB108_38
{
break _63;
}
}
}
break;
}
} while(0);
	r1 = heap32[(r10+38)];
	r0 = heapU8[r1];
	if(r0 ==67) //_LBB108_41
{
	r1 = heapU8[r1+1];
	r7 = 0;
	r7 = r1 == r7;
}
	if(r7 != 0) //_LBB108_17
{
__label__ = 15;
break _14;
}
else{
	if(r9 ==0) //_LBB108_17
{
__label__ = 15;
break _14;
}
else{
	heap32[(g0)] = r9;
	_ZN4__rw11__rw_localeD2Ev(i7);
	heap32[(g0)] = r9;
	r1 = 0;
	_ZdlPv(i7);
__label__ = 65;
break _14;
}
}
}
}
break;
}
	r0 = r1 >> 2;
	r2 = heap32[(r0+39)];
	r1 = 0;
	r2 = (r2 + -1)&-1;
	heap32[(r0+39)] = r2;
__label__ = 65;
}
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 15: 
	r1 = 0;
break;
}
	r0 = heap32[(r6+1)];
if(!(r0 ==r4)) //_LBB108_73
{
if(!(r0 ==0)) //_LBB108_73
{
	heap32[(g0)] = r0;
	_ZdaPv(i7);
}
}
	r_g0 = r1;
	return;
}
else{
	r0 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE6global;
	r0 = r0 >> 2;
	r2 = heap32[(r0)];
_84: do {
	if(r2 ==0) //_LBB108_3
{
	r3 = _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE5ginit;
	r3 = r3 >> 2;
	r4 = heap32[(r3)];
	if(r4 !=0) //_LBB108_5
{
_87: while(true){
	r4 = heap32[(r3)];
if(!(r4 <1000)) //_LBB108_5
{
break _84;
}
}
}
else{
	r2 = (r4 + 1)&-1;
	heap32[(r3)] = r2;
	r2 = _2E_str538;
	heap32[(g0)] = 0;
	heap32[(g0+1)] = r2;
	_ZN4__rw11__rw_locale9_C_manageEPS0_PKc(i7);
	r2 = r_g0;
	heap32[(r0)] = r2;
	r4 = heap32[(r3)];
	r4 = (r4 + 1000)&-1;
	heap32[(r3)] = r4;
}
}
} while(0);
	if(r1 ==0) //_LBB108_8
{
	r0 = r2 >> 2;
	r1 = heap32[(r0+39)];
	r1 = (r1 + 1)&-1;
	heap32[(r0+39)] = r1;
	r_g0 = r2;
	return;
}
else{
	r3 = r1 >> 2;
	r4 = heap32[(r3+39)];
	r4 = (r4 + 1)&-1;
	heap32[(r3+39)] = r4;
	heap32[(r0)] = r1;
	r_g0 = r2;
	return;
}
}
}

function _ZN4__rw11__rw_locale11_C_get_bodyEPS0_S1_PKciPKNS_10__rw_facetE(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
var __label__ = 0;
	i7 = sp + -304;var g0 = i7>>2; // save stack
	r0 = sp + -264; 
	r1 = (r0 + 8)&-1;
	r2 = r0 >> 2;
	heap32[(fp+-66)] = 0;
	r3 = 0;
	heap32[(r2+1)] = r1;
	heap8[sp+-256] = r3;
	r4 = _2E_str538;
	r5 = _2E_str292;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = 3;
	strncmp(i7);
	r5 = r_g0;
_1: do {
	if(r5 ==0) //_LBB109_2
{
	r4 = sp + -288; 
	r5 = r4 >> 2;
	heap32[(fp+-72)] = 0;
	heap32[(r5+1)] = 0;
	heap32[(r5+2)] = 0;
	heap32[(r5+3)] = 0;
	r6 = 4;
	heap32[(r5+4)] = 0;
	heap32[(r5+5)] = 0;
_3: while(true){
	r6 = (r6 + -4)&-1;
if(!(r6 !=0)) //_LBB109_3
{
break _3;
}
}
	r5 = _2E_str538;
_6: while(true){
	r6 = heapU8[r5];
	if(r6 ==0) //_LBB109_48
{
__label__ = 44;
break _6;
}
else{
	r6 = r3;
	r7 = r3;
_9: while(true){
	r8 = (r5 + r6)&-1;
	r9 = heapU8[r5+r6];
	if(r9 ==59) //_LBB109_17
{
__label__ = 16;
break _9;
}
else{
	if(r9 !=0) //_LBB109_8
{
	r9 = heapU8[r8+1];
	if(r9 ==0) //_LBB109_7
{
__label__ = 6;
break _9;
}
else{
	if(r9 ==59) //_LBB109_21
{
__label__ = 18;
break _9;
}
else{
	r9 = heapU8[r8+2];
	if(r9 ==0) //_LBB109_7
{
__label__ = 6;
break _9;
}
else{
	r10 = r7 << 2;
	if(r9 !=59) //_LBB109_13
{
	r8 = heapU8[r8+3];
	if(r8 ==0) //_LBB109_7
{
__label__ = 6;
break _9;
}
else{
	if(r8 !=59) //_LBB109_16
{
	r7 = (r7 + 1)&-1;
	r6 = (r6 + 4)&-1;
}
else{
__label__ = 14;
break _9;
}
}
}
else{
__label__ = 11;
break _9;
}
}
}
}
}
else{
__label__ = 6;
break _9;
}
}
}
_19: do {
switch(__label__ ){//multiple entries
case 16: 
	if(r8 ==0) //_LBB109_7
{
__label__ = 6;
break _19;
}
else{
__label__ = 19;
break _19;
}
break;
case 18: 
	r8 = (r8 + 1)&-1;
__label__ = 19;
break _19;
break;
case 14: 
	r6 = r10 | 3;
	r8 = (r5 + r6)&-1;
__label__ = 19;
break _19;
break;
case 11: 
	r6 = r10 | 2;
	r8 = (r5 + r6)&-1;
__label__ = 19;
break;
}
} while(0);
_24: do {
switch(__label__ ){//multiple entries
case 6: 
	r6 = r5;
_26: while(true){
	r8 = (r6 + 1)&-1;
	r7 = heapU8[r6+1];
	r6 = r8;
if(!(r7 !=0)) //_LBB109_19
{
break _24;
}
}
break;
}
} while(0);
	r6 = 0;
	r7 = r6;
_29: while(true){
	r9 = (r5 + r6)&-1;
	r10 = heapU8[r5+r6];
	if(r10 ==61) //_LBB109_35
{
__label__ = 32;
break _29;
}
else{
	if(r10 !=0) //_LBB109_26
{
	r10 = heapU8[r9+1];
	if(r10 ==0) //_LBB109_25
{
__label__ = 22;
break _6;
}
else{
	if(r10 ==61) //_LBB109_37
{
__label__ = 33;
break _29;
}
else{
	r10 = heapU8[r9+2];
	if(r10 ==0) //_LBB109_25
{
__label__ = 22;
break _6;
}
else{
	r11 = r7 << 2;
	if(r10 !=61) //_LBB109_31
{
	r9 = heapU8[r9+3];
	if(r9 ==0) //_LBB109_25
{
__label__ = 22;
break _6;
}
else{
	if(r9 !=61) //_LBB109_34
{
	r7 = (r7 + 1)&-1;
	r6 = (r6 + 4)&-1;
}
else{
__label__ = 30;
break _29;
}
}
}
else{
__label__ = 27;
break _29;
}
}
}
}
}
else{
__label__ = 22;
break _6;
}
}
}
switch(__label__ ){//multiple entries
case 32: 
	if(r9 ==0) //_LBB109_25
{
__label__ = 22;
break _6;
}
break;
case 33: 
	r9 = (r9 + 1)&-1;
break;
case 30: 
	r6 = r11 | 3;
	r9 = (r5 + r6)&-1;
break;
case 27: 
	r6 = r11 | 2;
	r9 = (r5 + r6)&-1;
break;
}
	r6 = (r9 - r5)&-1;
	r7 = 0;
_45: while(true){
	if(r7 !=-6) //_LBB109_39
{
	r10 = (r7 * -3)&-1;
	r11 = _ZN4__rw9__rw_catsE;
	r10 = r10 << 2;
	r10 = (r11 + r10)&-1;
	r10 = r10 >> 2;
	r10 = heap32[(r10+1)];
	heap32[(g0)] = r10;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r6;
	strncmp(i7);
	r10 = r_g0;
	if(r10 !=0) //_LBB109_42
{
	r7 = (r7 + -1)&-1;
}
else{
__label__ = 36;
break _45;
}
}
else{
__label__ = 40;
break _45;
}
}
switch(__label__ ){//multiple entries
case 36: 
	r6 = r7 << 2;
	r6 = (r4 - r6)&-1;
	r6 = r6 >> 2;
	r6 = heap32[(r6)];
	if(r6 !=0) //_LBB109_25
{
__label__ = 22;
break _6;
}
else{
	r6 = 0;
	r6 = (r6 - r7)&-1;
	r6 = r6 << 2;
	r6 = (r4 + r6)&-1;
	r6 = r6 >> 2;
	r7 = (r9 + 1)&-1;
	heap32[(r6)] = r7;
}
break;
}
	r6 = heapU8[r8];
	r5 = r8;
	if(r6 ==0) //_LBB109_46
{
__label__ = 42;
}
else{
	r5 = (r8 + 1)&-1;
}
}
}
switch(__label__ ){//multiple entries
case 44: 
	r3 = 0;
	r5 = r3;
_56: while(true){
	if(r5 !=-6) //_LBB109_49
{
	r6 = (r3 - r5)&-1;
	r6 = r6 << 2;
	r6 = (r4 + r6)&-1;
	r6 = r6 >> 2;
	r7 = heap32[(r6)];
	if(r7 ==0) //_LBB109_51
{
	r7 = _2E_str538;
	heap32[(r6)] = r7;
}
	r6 = 0;
	r8 = r6;
_62: while(true){
	r9 = heapU8[r7+r6];
	if(r9 ==0) //_LBB109_66
{
__label__ = 60;
break _62;
}
else{
	r10 = (r7 + r6)&-1;
	if(r9 ==59) //_LBB109_64
{
__label__ = 59;
break _62;
}
else{
	r9 = heapU8[r10+1];
	if(r9 ==0) //_LBB109_66
{
__label__ = 60;
break _62;
}
else{
	if(r9 ==59) //_LBB109_71
{
__label__ = 65;
break _62;
}
else{
	r9 = heapU8[r10+2];
	if(r9 ==0) //_LBB109_66
{
__label__ = 60;
break _62;
}
else{
	r11 = r8 << 2;
	if(r9 !=59) //_LBB109_60
{
	r10 = heapU8[r10+3];
	if(r10 ==0) //_LBB109_66
{
__label__ = 60;
break _62;
}
else{
	if(r10 !=59) //_LBB109_63
{
	r8 = (r8 + 1)&-1;
	r6 = (r6 + 4)&-1;
}
else{
__label__ = 57;
break _62;
}
}
}
else{
__label__ = 54;
break _62;
}
}
}
}
}
}
}
_72: do {
switch(__label__ ){//multiple entries
case 59: 
	if(r10 ==0) //_LBB109_66
{
__label__ = 60;
break _72;
}
else{
__label__ = 66;
break _72;
}
break;
case 65: 
	r10 = (r10 + 1)&-1;
__label__ = 66;
break _72;
break;
case 57: 
	r6 = r11 | 3;
	r10 = (r7 + r6)&-1;
__label__ = 66;
break _72;
break;
case 54: 
	r6 = r11 | 2;
	r10 = (r7 + r6)&-1;
__label__ = 66;
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 60: 
	r10 = heapU8[r7];
_79: do {
	if(r10 !=0) //_LBB109_68
{
	r6 = (r7 + 1)&-1;
	r8 = 0;
_81: while(true){
	r10 = (r8 + 1)&-1;
	r9 = heapU8[r6+r8];
	r8 = r10;
if(!(r9 !=0)) //_LBB109_69
{
break _79;
}
}
}
else{
	r10 = 0;
}
} while(0);
	r10 = (r7 + r10)&-1;
break;
}
	r6 = (r10 - r7)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = r6;
	_ZN4__rw14__rw_pod_arrayIcLj256EE6appendEPKcj(i7);
	r6 = _2E_str785;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r6;
	heap32[(g0+2)] = 1;
	_ZN4__rw14__rw_pod_arrayIcLj256EE6appendEPKcj(i7);
	r5 = (r5 + -1)&-1;
}
else{
break _56;
}
}
	r4 = heap32[(r2+1)];
	if(r4 ==0) //_LBB109_78
{
	heap32[(g0)] = 0;
	heap32[(g0+1)] = 0;
	_ZN4__rw11__rw_locale9_C_manageEPS0_PKc(i7);
	r4 = r_g0;
__label__ = 73;
break _1;
}
else{
__label__ = 72;
break _1;
}
break;
case 22: 
	r4 = 0;
__label__ = 73;
break;
}
}
else{
__label__ = 72;
}
} while(0);
switch(__label__ ){//multiple entries
case 72: 
	heap32[(g0)] = 0;
	heap32[(g0+1)] = r4;
	_ZN4__rw11__rw_locale9_C_manageEPS0_PKc(i7);
	r4 = r_g0;
break;
}
	r0 = heap32[(r2+1)];
if(!(r0 ==r1)) //_LBB109_83
{
if(!(r0 ==0)) //_LBB109_83
{
	heap32[(g0)] = r0;
	_ZdaPv(i7);
}
}
	r_g0 = r4;
	return;
}

function _ZNSt6localeD1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0)];
	r2 = r1 >> 2;
	r3 = heap32[(r2+27)];
_1: do {
if(!(r3 !=0)) //_LBB110_86
{
	r3 = heap32[(r2+40)];
	r3 = r3 & 67108863;
if(!(r3 !=67108863)) //_LBB110_86
{
	r3 = heap32[(r2+41)];
	r4 = r3 & 8193;
if(!(r4 ==0)) //_LBB110_4
{
	if(r4 !=8193) //_LBB110_86
{
break _1;
}
}
	r4 = r3 & 49158;
if(!(r4 ==0)) //_LBB110_6
{
	if(r4 !=49158) //_LBB110_86
{
break _1;
}
}
	r4 = r3 & 983160;
if(!(r4 ==0)) //_LBB110_8
{
	if(r4 !=983160) //_LBB110_86
{
break _1;
}
}
	r4 = r3 & 7340928;
if(!(r4 ==0)) //_LBB110_10
{
	if(r4 !=7340928) //_LBB110_86
{
break _1;
}
}
	r4 = r3 & 25168896;
if(!(r4 ==0)) //_LBB110_12
{
	if(r4 !=25168896) //_LBB110_86
{
break _1;
}
}
	r3 = r3 & 33558528;
if(!(r3 ==0)) //_LBB110_14
{
	if(r3 !=33558528) //_LBB110_86
{
break _1;
}
}
	r3 = heap32[(r2+38)];
	r4 = _2E_str538;
	r5 = r3 == 0 ? r4 : r3; 
	r6 = heapU8[r5];
	if(r6 ==59) //_LBB110_16
{
	r5 = (r5 + 1)&-1;
}
	r6 = 0;
	r7 = r6;
_25: while(true){
	r8 = heapU8[r5+r6];
	if(r8 ==0) //_LBB110_33
{
__label__ = 31;
break _25;
}
else{
	r9 = (r5 + r6)&-1;
	if(r8 ==59) //_LBB110_29
{
__label__ = 28;
break _25;
}
else{
	r8 = heapU8[r9+1];
	if(r8 ==0) //_LBB110_33
{
__label__ = 31;
break _25;
}
else{
	if(r8 ==59) //_LBB110_31
{
__label__ = 29;
break _25;
}
else{
	r8 = heapU8[r9+2];
	if(r8 ==0) //_LBB110_33
{
__label__ = 31;
break _25;
}
else{
	r10 = r7 << 2;
	if(r8 !=59) //_LBB110_25
{
	r9 = heapU8[r9+3];
	if(r9 ==0) //_LBB110_33
{
__label__ = 31;
break _25;
}
else{
	if(r9 !=59) //_LBB110_28
{
	r7 = (r7 + 1)&-1;
	r6 = (r6 + 4)&-1;
}
else{
__label__ = 26;
break _25;
}
}
}
else{
__label__ = 23;
break _25;
}
}
}
}
}
}
}
_35: do {
switch(__label__ ){//multiple entries
case 28: 
	if(r9 ==0) //_LBB110_33
{
__label__ = 31;
break _35;
}
else{
__label__ = 30;
break _35;
}
break;
case 29: 
	r9 = (r9 + 1)&-1;
__label__ = 30;
break _35;
break;
case 26: 
	r6 = r10 | 3;
	r9 = (r5 + r6)&-1;
__label__ = 30;
break _35;
break;
case 23: 
	r6 = r10 | 2;
	r9 = (r5 + r6)&-1;
__label__ = 30;
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 31: 
	r6 = heapU8[r5];
	if(r6 !=0) //_LBB110_35
{
	r7 = (r5 + 1)&-1;
	r8 = 0;
_44: while(true){
	r6 = (r8 + 1)&-1;
	r9 = heapU8[r7+r8];
	r8 = r6;
if(!(r9 !=0)) //_LBB110_36
{
break _44;
}
}
	r9 = 0;
	r7 = r9;
	r8 = r9;
}
else{
	r9 = 0;
	r6 = r9;
	r7 = r9;
	r8 = r9;
}
break;
case 30: 
	r6 = (r9 - r5)&-1;
	r7 = 0;
	r8 = r7;
break;
}
_49: while(true){
	if(r7 !=26) //_LBB110_38
{
	r10 = r7 << 2;
	r10 = (r1 + r10)&-1;
	r10 = r10 >> 2;
	r10 = heap32[(r10)];
_52: do {
	if(r10 !=0) //_LBB110_40
{
	r10 = r10 >> 2;
	r11 = heap32[(r10+7)];
	r11 = r11 >> 2;
	r10 = heap32[(r10+1)];
	r12 = 0;
	r13 = r10 != r12;
	r11 = heap32[(r11)];
	r13 = r13 & 1;
	r11 = r11 << 1;
	r11 = r13 | r11;
	r11 = (r11 + -1)&-1;
	r13 = 53;
	r11 = uint(r11) < uint(r13) ? r11 : r12; 
	if(r11 >36) //_LBB110_43
{
	r11 = (r11 + -37)&-1;
if(!(uint(r11) >uint(8))) //_LBB110_45
{
	r13 = 1;
	r11 = r13 << r11;
	r11 = r11 & 325;
	if(r11 !=0) //_LBB110_39
{
break _52;
}
}
}
else{
if(!(uint(r11) >uint(19))) //_LBB110_45
{
	r13 = 1;
	r11 = r13 << r11;
	r11 = r11 & 665600;
	if(r11 !=0) //_LBB110_39
{
break _52;
}
}
}
	r11 = 1;
	r11 = r11 << r7;
_60: while(true){
	if(r9 ==0) //_LBB110_75
{
break _60;
}
else{
	r13 = _ZN4__rw9__rw_catsE;
	r14 = (r8 * 12)&-1;
	r13 = (r13 + r14)&-1;
	r13 = r13 >> 2;
	r13 = heap32[(r13+2)];
	r13 = r13 & r11;
	if(r13 ==0) //_LBB110_46
{
	r5 = heapU8[r9];
	if(r5 ==0) //_LBB110_48
{
	if(r3 !=0) //_LBB110_50
{
	r8 = 0;
	r5 = r3;
}
else{
	r8 = 0;
	r5 = r4;
}
}
else{
	r5 = (r9 + 1)&-1;
	r8 = (r8 + 1)&-1;
}
	r6 = heapU8[r5];
	if(r6 ==59) //_LBB110_53
{
	r5 = (r5 + 1)&-1;
}
	r6 = r12;
	r13 = r12;
_74: while(true){
	r14 = heapU8[r5+r6];
	if(r14 ==0) //_LBB110_70
{
__label__ = 65;
break _74;
}
else{
	r9 = (r5 + r6)&-1;
	if(r14 ==59) //_LBB110_66
{
__label__ = 62;
break _74;
}
else{
	r14 = heapU8[r9+1];
	if(r14 ==0) //_LBB110_70
{
__label__ = 65;
break _74;
}
else{
	if(r14 ==59) //_LBB110_68
{
__label__ = 63;
break _74;
}
else{
	r14 = heapU8[r9+2];
	if(r14 ==0) //_LBB110_70
{
__label__ = 65;
break _74;
}
else{
	r15 = r13 << 2;
	if(r14 !=59) //_LBB110_62
{
	r9 = heapU8[r9+3];
	if(r9 ==0) //_LBB110_70
{
__label__ = 65;
break _74;
}
else{
	if(r9 !=59) //_LBB110_65
{
	r13 = (r13 + 1)&-1;
	r6 = (r6 + 4)&-1;
}
else{
__label__ = 60;
break _74;
}
}
}
else{
__label__ = 57;
break _74;
}
}
}
}
}
}
}
_84: do {
switch(__label__ ){//multiple entries
case 62: 
	if(r9 ==0) //_LBB110_70
{
__label__ = 65;
break _84;
}
else{
__label__ = 64;
break _84;
}
break;
case 63: 
	r9 = (r9 + 1)&-1;
__label__ = 64;
break _84;
break;
case 60: 
	r6 = r15 | 3;
	r9 = (r5 + r6)&-1;
__label__ = 64;
break _84;
break;
case 57: 
	r6 = r15 | 2;
	r9 = (r5 + r6)&-1;
__label__ = 64;
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 65: 
	r9 = _2E_str15386;
	r6 = 0;
	r13 = heapU8[r5];
	if(r13 ==0) //_LBB110_73
{
continue _60;
}
else{
	r13 = (r5 + 1)&-1;
	r14 = 0;
_92: while(true){
	r6 = (r14 + 1)&-1;
	r9 = _2E_str15386;
	r15 = heapU8[r13+r14];
	r14 = r6;
if(!(r15 !=0)) //_LBB110_72
{
continue _60;
}
}
}
break;
case 64: 
	r6 = (r9 - r5)&-1;
break;
}
}
else{
break _60;
}
}
}
	r11 = _2E_str538;
	r10 = r10 == 0 ? r11 : r10; 
	r11 = heapU8[r10];
_96: do {
	if(r11 !=0) //_LBB110_77
{
	r12 = (r10 + 1)&-1;
	r13 = 0;
_98: while(true){
	r11 = (r13 + 1)&-1;
	r14 = heapU8[r12+r13];
	r13 = r11;
if(!(r14 !=0)) //_LBB110_78
{
break _96;
}
}
}
else{
	r11 = 0;
}
} while(0);
	if(r11 !=r6) //_LBB110_86
{
break _1;
}
else{
	r11 = 0;
_103: while(true){
	r12 = (r6 + r11)&-1;
	if(r12 !=0) //_LBB110_81
{
	r12 = (r5 - r11)&-1;
	r13 = (r10 - r11)&-1;
	r11 = (r11 + -1)&-1;
	r12 = heapU8[r12];
	r13 = heapU8[r13];
	if(r12 !=r13) //_LBB110_86
{
break _1;
}
}
else{
break _52;
}
}
}
}
} while(0);
	r7 = (r7 + 1)&-1;
}
else{
break _49;
}
}
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r3;
	_ZN4__rw11__rw_locale9_C_manageEPS0_PKc(i7);
	return;
}
}
} while(0);
	r1 = heap32[(r2+39)];
	r1 = (r1 + -1)&-1;
	heap32[(r2+39)] = r1;
if(!(r1 !=0)) //_LBB110_89
{
	r0 = heap32[(r0)];
if(!(r0 ==0)) //_LBB110_89
{
	heap32[(g0)] = r0;
	_ZN4__rw11__rw_localeD2Ev(i7);
	heap32[(g0)] = r0;
	_ZdlPv(i7);
}
}
	return;
}

function _ZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataE(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE4init_2E_b;
	r1 = heapU8[r0];
if(!(r1 != 0)) //_LBB111_5
{
	r1 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE15catalog_bufsize;
	r1 = r1 >> 2;
	r1 = heap32[(r1)];
if(!(r1 ==0)) //_LBB111_4
{
	r2 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE8catalogs;
	r2 = r2 >> 2;
	r2 = heap32[(r2)];
	r3 = 0;
_5: while(true){
	r4 = r3 << 3;
	r4 = (r2 + r4)&-1;
	r3 = (r3 + 1)&-1;
	r4 = r4 >> 2;
	heap32[(r4)] = -1;
if(!(uint(r3) <uint(r1))) //_LBB111_3
{
break _5;
}
}
}
	r1 = 1;
	heap8[r0] = r1;
}
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r0 = r0 >> 2;
	r2 = heap32[(r0)];
_9: do {
	if(r2 !=-1) //_LBB111_27
{
	if(r1 !=0) //_LBB111_30
{
	r3 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE10n_catalogs;
	r3 = r3 >> 2;
	r4 = heap32[(r3)];
	r5 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE8catalogs;
	r4 = (r4 + -1)&-1;
	r5 = r5 >> 2;
	heap32[(r3)] = r4;
	r3 = heap32[(r5)];
	r2 = r2 << 3;
	r2 = (r3 + r2)&-1;
	r4 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE11largest_cat;
	r2 = r2 >> 2;
	heap32[(r2)] = -1;
	r2 = r4 >> 2;
	r0 = heap32[(r0)];
	r4 = heap32[(r2)];
	if(r0 ==r4) //_LBB111_32
{
__label__ = 33; //SET chanka
_13: while(true){
	if(r0 >-1) //_LBB111_33
{
	r6 = r0 << 3;
	r6 = (r3 + r6)&-1;
	r6 = r6 >> 2;
	r6 = heap32[(r6)];
	if(r6 ==-1) //_LBB111_35
{
	r0 = (r0 + -1)&-1;
}
else{
__label__ = 31;
break _13;
}
}
else{
__label__ = 34;
break _13;
}
}
switch(__label__ ){//multiple entries
case 34: 
	r0 = r4;
break;
case 31: 
	heap32[(r2)] = r0;
break;
}
	if(uint(r0) >uint(3)) //_LBB111_31
{
__label__ = 40;
break _9;
}
else{
	r0 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE11catalog_buf;
	if(r3 ==r0) //_LBB111_31
{
__label__ = 40;
break _9;
}
else{
	r2 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE15catalog_bufsize;
	r2 = r2 >> 2;
	heap32[(r2)] = 8;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = 64;
	memcpy(i7);
if(!(r3 ==0)) //_LBB111_42
{
	heap32[(g0)] = r3;
	_ZdaPv(i7);
}
	heap32[(r5)] = r0;
__label__ = 40;
break _9;
}
}
}
else{
__label__ = 40;
break _9;
}
}
else{
	r0 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE15catalog_bufsize;
	r0 = r0 >> 2;
	r0 = heap32[(r0)];
	if(uint(r2) >=uint(r0)) //_LBB111_7
{
__label__ = 7;
break _9;
}
else{
	r0 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE8catalogs;
	r0 = r0 >> 2;
	r0 = heap32[(r0)];
	r1 = r2 << 3;
	r0 = (r0 + r1)&-1;
	r_g0 = r0;
	return;
}
}
}
else{
	if(r1 !=0) //_LBB111_8
{
	r2 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE10n_catalogs;
	r2 = r2 >> 2;
	r3 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE15catalog_bufsize;
	r4 = heap32[(r2)];
	r3 = r3 >> 2;
	r5 = heap32[(r3)];
	if(r4 ==r5) //_LBB111_12
{
	r4 = r4 << 4;
	r5 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE8catalogs;
	heap32[(g0)] = r4;
	_Znaj(i7);
	r4 = r_g0;
	r5 = r5 >> 2;
	r6 = heap32[(r2)];
	r7 = heap32[(r5)];
	r8 = r6 << 3;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r7;
	heap32[(g0+2)] = r8;
	memcpy(i7);
	r8 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE11catalog_buf;
if(!(r7 ==r8)) //_LBB111_14
{
	if(r7 !=0) //_LBB111_15
{
	heap32[(g0)] = r7;
	_ZdaPv(i7);
	r6 = heap32[(r2)];
}
}
	heap32[(r5)] = r4;
	r5 = heap32[(r3)];
	r5 = r5 << 1;
	heap32[(r3)] = r5;
_36: do {
if(!(uint(r6) >=uint(r5))) //_LBB111_20
{
	r3 = (r6 + 1)&-1;
_38: while(true){
	r7 = r3 << 3;
	r7 = (r4 + r7)&-1;
	r7 = r7 >> 2;
	heap32[(r7+-2)] = -1;
	if(uint(r3) >=uint(r5)) //_LBB111_20
{
break _36;
}
else{
	r3 = (r3 + 1)&-1;
}
}
}
} while(0);
	r3 = r6 << 3;
	r3 = (r4 + r3)&-1;
	heap32[(r0)] = r6;
	r3 = (r3 + 4)&-1;
	r5 = (r1 + 4)&-1;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = 4;
	memcpy(i7);
	r3 = heap32[(r0)];
	r3 = r3 << 3;
	r5 = r1 >> 2;
	r3 = (r4 + r3)&-1;
	r4 = heap32[(r5)];
	r3 = r3 >> 2;
	heap32[(r3)] = r4;
	r0 = heap32[(r0)];
	r3 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE11largest_cat;
	r3 = r3 >> 2;
	r4 = heap32[(r3)];
if(!(uint(r0) <=uint(r4))) //_LBB111_22
{
	heap32[(r3)] = r0;
}
	r0 = (r6 + 1)&-1;
	heap32[(r2)] = r0;
	r_g0 = r1;
	return;
}
else{
	r3 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE8catalogs;
	r3 = r3 >> 2;
	heap32[(r0)] = 0;
	r3 = heap32[(r3)];
	r5 = r3 >> 2;
	r5 = heap32[(r5)];
_46: do {
	if(r5 !=-1) //_LBB111_11
{
	r5 = 0;
_48: while(true){
	r6 = r5 << 3;
	r6 = (r3 + r6)&-1;
	r5 = (r5 + 1)&-1;
	r6 = r6 >> 2;
	heap32[(r0)] = r5;
	r6 = heap32[(r6+2)];
if(!(r6 !=-1)) //_LBB111_23
{
break _46;
}
}
}
else{
	r5 = 0;
}
} while(0);
	r6 = _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE11largest_cat;
	r6 = r6 >> 2;
	r7 = heap32[(r6)];
if(!(uint(r5) <=uint(r7))) //_LBB111_26
{
	heap32[(r6)] = r5;
}
	r5 = r5 << 3;
	r5 = (r3 + r5)&-1;
	r5 = (r5 + 4)&-1;
	r6 = (r1 + 4)&-1;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r6;
	heap32[(g0+2)] = 4;
	memcpy(i7);
	r0 = heap32[(r0)];
	r0 = r0 << 3;
	r5 = r1 >> 2;
	r0 = (r3 + r0)&-1;
	r3 = heap32[(r5)];
	r0 = r0 >> 2;
	r4 = (r4 + 1)&-1;
	heap32[(r0)] = r3;
	heap32[(r2)] = r4;
	r_g0 = r1;
	return;
}
}
else{
__label__ = 7;
}
}
} while(0);
switch(__label__ ){//multiple entries
case 7: 
	r1 = 0;
break;
}
	r_g0 = r1;
	return;
}

function _ZN4__rw14__rw_cat_closeEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	heap32[(fp+-1)] = r0;
if(!(r0 <0)) //_LBB112_20
{
	r0 = sp + -4; 
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 0;
	_ZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataE(i7);
	r1 = r_g0;
if(!(r1 ==0)) //_LBB112_20
{
	r2 = r1 >> 2;
	r2 = heap32[(r2)];
if(!(r2 ==-1)) //_LBB112_20
{
	r3 = _ZN4__rwL12__rw_catlistE_2E_1;
	r4 = _ZN4__rwL12__rw_catlistE_2E_0;
	r3 = r3 >> 2;
	r4 = r4 >> 2;
	r5 = heap32[(r3)];
	r6 = heap32[(r4)];
	r7 = (r5 - r6)&-1;
	r7 = r7 >> 2;
	r8 = 0;
_5: while(true){
	if(uint(r7) >uint(r8)) //_LBB112_9
{
	r9 = r8 << 2;
	r9 = (r6 + r9)&-1;
	r9 = r9 >> 2;
	r9 = heap32[(r9)];
	if(r9 ==0) //_LBB112_8
{
__label__ = 7;
break _5;
}
else{
	if(r9 !=r2) //_LBB112_6
{
	r8 = (r8 + 1)&-1;
}
else{
__label__ = 9;
break _5;
}
}
}
else{
__label__ = 7;
break _5;
}
}
switch(__label__ ){//multiple entries
case 7: 
	r8 = r7;
break;
}
_13: do {
if(!(uint(r7) <=uint(r8))) //_LBB112_19
{
	r2 = r8 << 2;
	r7 = (r6 + r2)&-1;
	r7 = r7 >> 2;
	r7 = heap32[(r7)];
	if(r7 !=0) //_LBB112_13
{
	heap32[(g0)] = r7;
	_ZdlPv(i7);
	r6 = heap32[(r4)];
	r5 = heap32[(r3)];
}
	r3 = (r5 - r6)&-1;
	r2 = (r6 + r2)&-1;
	r4 = (r8 + 1)&-1;
	r3 = r3 >> 2;
	r2 = r2 >> 2;
	heap32[(r2)] = 0;
_18: while(true){
	if(uint(r3) <=uint(r4)) //_LBB112_19
{
break _13;
}
else{
	r2 = r4 << 2;
	r2 = (r6 + r2)&-1;
	r5 = r2 >> 2;
	r2 = heap32[(r5)];
	if(r2 !=0) //_LBB112_15
{
	r4 = (r4 + 1)&-1;
	heap32[(r5+-1)] = r2;
}
else{
break _18;
}
}
}
	heap32[(r5)] = 0;
}
} while(0);
	r2 = (r1 + 4)&-1;
	heap32[(g0)] = r2;
	_ZNSt6localeD1Ev(i7);
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	_ZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataE(i7);
	return;
}
}
}
	r0 = _2E_str115419;
	r1 = _2E_str1116;
	heap32[(g0)] = 7;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r1;
	_ZN4__rw10__rw_throwEiz(i7);
	return;
}

function _ZN4__rw16__rw_locale_nameEiPKcRNS_14__rw_pod_arrayIcLj256EEE(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
var __label__ = 0;
	i7 = sp + -368;var g0 = i7>>2; // save stack
	r0 = _ZZN4__rw16__rw_locale_nameEiPKcRNS_14__rw_pod_arrayIcLj256EEEE11locale_root;
	r1 = heap32[(fp)];
	r2 = heap32[(fp+1)];
	r3 = heapU8[r0];
	r4 = 0;
	heap8[sp+-259] = r4;
	r5 = heapU8[r2];
_1: do {
	if(r5 !=0) //_LBB113_2
{
	r6 = (r2 + 1)&-1;
_3: while(true){
	r5 = (r4 + 1)&-1;
	r7 = heapU8[r6+r4];
	r4 = r5;
	if(r7 !=0) //_LBB113_3
{
continue _3;
}
else{
break _1;
}
}
}
else{
	r5 = 0;
}
} while(0);
	r3 = r3 & 255;
_7: do {
	if(r3 !=0) //_LBB113_6
{
	r3 = (r5 + 1)&-1;
	r4 = (r0 + 1)&-1;
_9: while(true){
	r3 = (r3 + 1)&-1;
	r6 = (r4 + 1)&-1;
	r7 = heapU8[r4];
	r4 = r6;
if(!(r7 !=0)) //_LBB113_7
{
break _9;
}
}
	if(uint(r3) >uint(258)) //_LBB113_5
{
__label__ = 5;
}
else{
	r3 = sp + -259; 
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r0;
	strcpy(i7);
	r0 = heapU8[sp+-259];
_13: do {
	if(r0 !=0) //_LBB113_11
{
	r0 = (r3 + 1)&-1;
	r6 = 0;
_15: while(true){
	r4 = (r6 + 1)&-1;
	r7 = heapU8[r0+r6];
	r6 = r4;
if(!(r7 !=0)) //_LBB113_12
{
break _13;
}
}
}
else{
	r4 = 0;
}
} while(0);
	r6 = 47;
	r0 = (r4 + 1)&-1;
	r7 = 0;
	heap8[r3+r4] = r6;
	heap8[r3+r0] = r7;
	r4 = heapU8[sp+-259];
	if(r4 !=0) //_LBB113_15
{
	r4 = (r3 + 1)&-1;
_21: while(true){
	r3 = (r7 + 1)&-1;
	r6 = heapU8[r4+r7];
	r7 = r3;
	if(r6 !=0) //_LBB113_16
{
continue _21;
}
else{
__label__ = 17;
break _7;
}
}
}
else{
	r3 = 0;
__label__ = 17;
}
}
}
else{
__label__ = 5;
}
} while(0);
switch(__label__ ){//multiple entries
case 5: 
	r0 = 0;
	r3 = r0;
break;
}
	r3 = (r3 + r5)&-1;
if(!(uint(r3) >uint(258))) //_LBB113_27
{
	r3 = sp + -259; 
	r0 = (r3 + r0)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r2;
	strcpy(i7);
	r0 = _2E_str1645;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r0;
	fopen(i7);
	r0 = r_g0;
if(!(r0 ==0)) //_LBB113_27
{
	if(uint(r0) <uint(10)) //_LBB113_21
{
	r2 = _ZL13s_file_stdout;
	r3 = r2 >> 2;
	r3 = heap32[(r3)];
	r3 = r3 >> 2;
	r3 = heap32[(r3+7)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = 2;
	__FUNCTION_TABLE__[(r3)>>2](i7);
}
else{
	r2 = r0 >> 2;
	r2 = heap32[(r2)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+7)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = 2;
	__FUNCTION_TABLE__[(r2)>>2](i7);
	r2 = r0;
}
	r3 = r2 >> 2;
	r3 = heap32[(r3)];
	r3 = r3 >> 2;
	r3 = heap32[(r3+5)];
	heap32[(g0)] = r2;
	__FUNCTION_TABLE__[(r3)>>2](i7);
	if(uint(r0) >uint(9)) //_LBB113_24
{
	r2 = r0;
}
else{
	r2 = _ZL13s_file_stdout;
}
	r3 = r2 >> 2;
	r3 = heap32[(r3)];
	r3 = r3 >> 2;
	r3 = heap32[(r3+4)];
	heap32[(g0)] = r2;
	__FUNCTION_TABLE__[(r3)>>2](i7);
if(!(uint(r0) <uint(10))) //_LBB113_27
{
	heap32[(g0)] = r2;
	_ZdlPv(i7);
}
}
}
	r0 = sp + -352; 
	r0 = r0 >> 2;
	heap32[(r0+20)] = 0;
	heap32[(r0+22)] = r1;
	heap32[(r0+21)] = 0;
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZNKSt8messagesIcE8do_closeEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	heap32[(g0)] = r0;
	_ZN4__rw14__rw_cat_closeEi(i7);
	return;
}

function _ZNKSt8messagesIcE6do_getEiiiRKSs(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	heap32[(fp+-1)] = r0;
if(!(r0 <0)) //_LBB115_8
{
	r0 = sp + -4; 
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 0;
	_ZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataE(i7);
	r0 = r_g0;
if(!(r0 ==0)) //_LBB115_8
{
	r0 = r0 >> 2;
	r0 = heap32[(r0)];
if(!(r0 ==-1)) //_LBB115_8
{
	r1 = _ZN4__rwL12__rw_catlistE_2E_1;
	r2 = _ZN4__rwL12__rw_catlistE_2E_0;
	r1 = r1 >> 2;
	r2 = r2 >> 2;
	r2 = heap32[(r2)];
	r1 = heap32[(r1)];
	r1 = (r1 - r2)&-1;
	r1 = r1 >> 2;
	r3 = 0;
_5: while(true){
	if(uint(r1) <=uint(r3)) //_LBB115_8
{
break _5;
}
else{
	r4 = r3 << 2;
	r4 = (r2 + r4)&-1;
	r4 = r4 >> 2;
	r4 = heap32[(r4)];
	if(r4 ==0) //_LBB115_8
{
break _5;
}
else{
	if(r4 !=r0) //_LBB115_4
{
	r3 = (r3 + 1)&-1;
continue _5;
}
else{
break _5;
}
}
}
}
}
}
}
	r0 = heap32[(fp)];
	r1 = heap32[(fp+5)];
	r1 = r1 >> 2;
	r2 = heap32[(r1)];
	r3 = r2 >> 2;
	r4 = heap32[(r3+-3)];
	if(r4 ==-1) //_LBB115_11
{
	r2 = heap32[(r3+-1)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r2;
	_ZNSs10_C_get_repEjj(i7);
	r0 = r0 >> 2;
	r3 = (r_g0 + 12)&-1;
	heap32[(r0)] = r3;
	r0 = heap32[(r1)];
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r2;
	memcpy(i7);
}
else{
	r1 = (r2 + -12)&-1;
	r0 = r0 >> 2;
	r3 = _ZNSs11_C_null_refE;
	heap32[(r0)] = r2;
if(!(r1 ==r3)) //_LBB115_12
{
	r0 = r1 >> 2;
	r1 = (r4 + 1)&-1;
	heap32[(r0)] = r1;
	return;
}
}
	return;
}

function _ZNKSt8messagesIcE7do_openERKSsRKSt6locale(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	heap32[(g0)] = 1;
	_Znwj(i7);
	r0 = r_g0;
if(!(r0 ==0)) //_LBB116_2
{
	heap32[(g0)] = r0;
	_ZdlPv(i7);
}
	r0 = -1;
	r_g0 = r0;
	return;
}

function _ZNSt8messagesIcED0Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTVN4__rw10__rw_facetE;
	r2 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r2)] = r1;
	heap32[(r2+5)] = -1;
	r1 = heap32[(r2+1)];
	r3 = heap32[(r2+2)];
if(!(r1 ==r3)) //_LBB117_3
{
if(!(r1 ==0)) //_LBB117_3
{
	heap32[(g0)] = r1;
	_ZdaPv(i7);
}
}
	r1 = _ZZN4__rw10__rw_facetD4EvE9destroyed;
	heap32[(r2+1)] = r1;
	r1 = heap32[(r2+4)];
if(!(r1 !=-1)) //_LBB117_5
{
	r1 = heap32[(r2+3)];
	heap32[(g0)] = r1;
	_ZdlPv(i7);
}
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	return;
}

function _ZNSt8messagesIcED1Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _ZTVN4__rw10__rw_facetE;
	r0 = r0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r0)] = r1;
	heap32[(r0+5)] = -1;
	r1 = heap32[(r0+1)];
	r2 = heap32[(r0+2)];
if(!(r1 ==r2)) //_LBB118_3
{
if(!(r1 ==0)) //_LBB118_3
{
	heap32[(g0)] = r1;
	_ZdaPv(i7);
}
}
	r1 = _ZZN4__rw10__rw_facetD4EvE9destroyed;
	heap32[(r0+1)] = r1;
	r1 = heap32[(r0+4)];
if(!(r1 !=-1)) //_LBB118_5
{
	r0 = heap32[(r0+3)];
	heap32[(g0)] = r0;
	_ZdlPv(i7);
}
	return;
}

function _ZN4__rw14__rw_pod_arrayIcLj256EE6appendEPKcj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r2 = heap32[(fp+2)];
	r3 = heap32[(r1)];
	r4 = (r3 + r2)&-1;
	r5 = heap32[(fp+1)];
	if(uint(r4) >uint(255)) //_LBB119_2
{
	r3 = (r4 + 1)&-1;
	heap32[(g0)] = r3;
	_Znaj(i7);
	r7 = r_g0;
	r3 = heap32[(r1)];
	r6 = heap32[(r1+1)];
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r6;
	heap32[(g0+2)] = r3;
	memcpy(i7);
	r3 = heap32[(r1+1)];
	r6 = (r0 + 8)&-1;
if(!(r3 ==r6)) //_LBB119_5
{
if(!(r3 ==0)) //_LBB119_5
{
	heap32[(g0)] = r3;
	_ZdaPv(i7);
}
}
	r6 = (r0 + 4)&-1;
	heap32[(r1+1)] = r7;
	r3 = heap32[(r1)];
}
else{
	r6 = (r0 + 4)&-1;
	r7 = heap32[(r1+1)];
}
	r3 = (r7 + r3)&-1;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r2;
	memcpy(i7);
	r2 = r6 >> 2;
	heap32[(r1)] = r4;
	r1 = heap32[(r2)];
	r2 = 0;
	heap8[r1+r4] = r2;
	r_g0 = r0;
	return;
}

function _ZNSs10_C_get_repEjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
_1: do {
	if(uint(r0) <uint(-13)) //_LBB120_4
{
	if(uint(r0) <uint(r1)) //_LBB120_6
{
	r2 = _2E_str4362;
	r3 = _2E_str3361;
	heap32[(g0)] = 8;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = r1;
	heap32[(g0+4)] = r0;
	_ZN4__rw10__rw_throwEiz(i7);
__label__ = 6;
break _1;
}
else{
__label__ = 6;
break _1;
}
}
else{
	if(uint(r1) >uint(-14)) //_LBB120_3
{
	r0 = _2E_str2360;
	r2 = _2E_str3361;
	heap32[(g0)] = 8;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r1;
	heap32[(g0+4)] = -14;
	_ZN4__rw10__rw_throwEiz(i7);
	r0 = r1;
__label__ = 8;
}
else{
	r0 = r1;
__label__ = 6;
}
}
} while(0);
switch(__label__ ){//multiple entries
case 6: 
	if(r0 ==0) //_LBB120_9
{
	r0 = _ZNSs11_C_null_refE;
	r_g0 = r0;
	return;
}
break;
}
	r2 = (r0 + 14)&-1;
	heap32[(g0)] = r2;
	_Znwj(i7);
	r2 = r_g0;
if(!(r2 !=0)) //_LBB120_12
{
	heap32[(g0)] = 3;
	_ZN4__rw10__rw_throwEiz(i7);
}
	r3 = r2 >> 2;
	heap32[(r3)] = 0;
	heap32[(r3+1)] = r0;
	r0 = (r1 + r2)&-1;
	r4 = 0;
	heap32[(r3+2)] = r1;
	heap8[r0+12] = r4;
	r_g0 = r2;
	return;
}

function block_merge_next(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = r0 >> 2;
	r2 = heap32[(r1+1)];
	r2 = (r2 + -4)&-1;
	r2 = r2 & -4;
	r3 = (r0 + 8)&-1;
	r4 = (r2 + 4)&-1;
	r4 = (r3 + r4)&-1;
	r4 = r4 >> 2;
	r5 = heap32[(r4)];
	r6 = r5 & 1;
if(!(r6 ==0)) //_LBB121_9
{
	r6 = heap32[(fp)];
	r7 = (r3 + r2)&-1;
	r8 = r5 & -4;
	if(uint(r8) >uint(255)) //_LBB121_3
{
	r5 = r8 >>> 1;
	r5 = r8 | r5;
	r9 = r5 >>> 2;
	r5 = r5 | r9;
	r9 = r5 >>> 4;
	r5 = r5 | r9;
	r9 = r5 >>> 8;
	r5 = r5 | r9;
	r9 = r5 >>> 16;
	r5 = r5 | r9;
	r9 = r5 ^ -1;
	r10 = 1431655765;
	r9 = r9 >>> 1;
	r5 = r10 & (~r5);
	r9 = r9 & 1431655765;
	r5 = (r5 + r9)&-1;
	r9 = r5 >>> 2;
	r5 = r5 & 858993459;
	r9 = r9 & 858993459;
	r5 = (r5 + r9)&-1;
	r9 = r5 >>> 4;
	r5 = r5 & 252645135;
	r9 = r9 & 252645135;
	r5 = (r5 + r9)&-1;
	r9 = r5 >>> 8;
	r5 = r5 & 16711935;
	r9 = r9 & 16711935;
	r5 = (r5 + r9)&-1;
	r9 = r5 & 65535;
	r5 = r5 >>> 16;
	r10 = 26;
	r5 = (r9 + r5)&-1;
	r9 = (r10 - r5)&-1;
	r8 = r8 >>> r9;
	r9 = 24;
	r8 = r8 ^ 32;
	r5 = (r9 - r5)&-1;
}
else{
	r8 = r5 >>> 3;
	r5 = 0;
}
	r2 = (r2 + r3)&-1;
	r2 = r2 >> 2;
	r9 = r5 << 7;
	r10 = heap32[(r2+2)];
	r2 = heap32[(r2+3)];
	r9 = (r6 + r9)&-1;
	r11 = r8 << 2;
	r9 = (r9 + r11)&-1;
	r11 = r10 >> 2;
	r12 = r2 >> 2;
	heap32[(r11+3)] = r2;
	r2 = r9 >> 2;
	heap32[(r12+2)] = r10;
	r2 = heap32[(r2+24)];
if(!(r2 !=r7)) //_LBB121_8
{
	r2 = (r9 + 96)&-1;
	r2 = r2 >> 2;
	r7 = block_null;
	heap32[(r2)] = r10;
if(!(r10 !=r7)) //_LBB121_8
{
	r2 = r5 << 2;
	r2 = (r6 + r2)&-1;
	r2 = r2 >> 2;
	r7 = 1;
	r8 = r7 << r8;
	r9 = heap32[(r2+1)];
	r8 = r9 & (~r8);
	heap32[(r2+1)] = r8;
if(!(r8 !=0)) //_LBB121_8
{
	r2 = r6 >> 2;
	r5 = r7 << r5;
	r6 = heap32[(r2)];
	r5 = r6 & (~r5);
	heap32[(r2)] = r5;
}
}
}
	r2 = heap32[(r4)];
	r4 = heap32[(r1+1)];
	r2 = r2 & -4;
	r2 = (r2 + r4)&-1;
	r4 = r2 & -4;
	r3 = (r3 + r4)&-1;
	r2 = (r2 + 4)&-1;
	r3 = r3 >> 2;
	heap32[(r1+1)] = r2;
	heap32[(r3)] = r0;
}
	r_g0 = r0;
	return;
}

function tlsf_free(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
if(!(r0 ==0)) //_LBB122_15
{
	r1 = heap32[(fp)];
	r2 = r0 >> 2;
	r3 = heap32[(r2+-1)];
	r3 = (r3 + -4)&-1;
	r3 = r3 & -4;
	r3 = (r0 + r3)&-1;
	r0 = (r0 + -8)&-1;
	r3 = r3 >> 2;
	heap32[(r3)] = r0;
	r4 = heap32[(r3+1)];
	r4 = r4 | 2;
	heap32[(r3+1)] = r4;
	r3 = heap32[(r2+-1)];
	r4 = r3 | 1;
	heap32[(r2+-1)] = r4;
	r3 = r3 & 2;
	if(r3 !=0) //_LBB122_3
{
	r0 = r0 >> 2;
	r0 = heap32[(r0)];
	r3 = r0 >> 2;
	r4 = heap32[(r3+1)];
	r5 = r4 & -4;
	if(uint(r5) >uint(255)) //_LBB122_5
{
	r4 = r5 >>> 1;
	r4 = r5 | r4;
	r6 = r4 >>> 2;
	r4 = r4 | r6;
	r6 = r4 >>> 4;
	r4 = r4 | r6;
	r6 = r4 >>> 8;
	r4 = r4 | r6;
	r6 = r4 >>> 16;
	r4 = r4 | r6;
	r6 = r4 ^ -1;
	r7 = 1431655765;
	r6 = r6 >>> 1;
	r4 = r7 & (~r4);
	r6 = r6 & 1431655765;
	r4 = (r4 + r6)&-1;
	r6 = r4 >>> 2;
	r4 = r4 & 858993459;
	r6 = r6 & 858993459;
	r4 = (r4 + r6)&-1;
	r6 = r4 >>> 4;
	r4 = r4 & 252645135;
	r6 = r6 & 252645135;
	r4 = (r4 + r6)&-1;
	r6 = r4 >>> 8;
	r4 = r4 & 16711935;
	r6 = r6 & 16711935;
	r4 = (r4 + r6)&-1;
	r6 = r4 & 65535;
	r4 = r4 >>> 16;
	r7 = 26;
	r4 = (r6 + r4)&-1;
	r6 = (r7 - r4)&-1;
	r5 = r5 >>> r6;
	r6 = 24;
	r5 = r5 ^ 32;
	r4 = (r6 - r4)&-1;
}
else{
	r5 = r4 >>> 3;
	r4 = 0;
}
	r6 = r4 << 7;
	r7 = heap32[(r3+2)];
	r8 = heap32[(r3+3)];
	r6 = (r1 + r6)&-1;
	r9 = r5 << 2;
	r6 = (r6 + r9)&-1;
	r9 = r7 >> 2;
	r10 = r8 >> 2;
	heap32[(r9+3)] = r8;
	r8 = r6 >> 2;
	heap32[(r10+2)] = r7;
	r8 = heap32[(r8+24)];
if(!(r8 !=r0)) //_LBB122_10
{
	r6 = (r6 + 96)&-1;
	r6 = r6 >> 2;
	r8 = block_null;
	heap32[(r6)] = r7;
if(!(r7 !=r8)) //_LBB122_10
{
	r6 = r4 << 2;
	r6 = (r1 + r6)&-1;
	r6 = r6 >> 2;
	r7 = 1;
	r5 = r7 << r5;
	r8 = heap32[(r6+1)];
	r5 = r8 & (~r5);
	heap32[(r6+1)] = r5;
if(!(r5 !=0)) //_LBB122_10
{
	r5 = r1 >> 2;
	r4 = r7 << r4;
	r6 = heap32[(r5)];
	r4 = r6 & (~r4);
	heap32[(r5)] = r4;
}
}
}
	r4 = (r0 + 8)&-1;
	r2 = heap32[(r2+-1)];
	r5 = heap32[(r3+1)];
	r2 = r2 & -4;
	r2 = (r2 + r5)&-1;
	r5 = r2 & -4;
	r4 = (r4 + r5)&-1;
	r2 = (r2 + 4)&-1;
	r4 = r4 >> 2;
	heap32[(r3+1)] = r2;
	heap32[(r4)] = r0;
}
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	block_merge_next(i7);
	r0 = r_g0;
	r2 = r0 >> 2;
	r2 = heap32[(r2+1)];
	r3 = r2 & -4;
	if(uint(r3) >uint(255)) //_LBB122_13
{
	r2 = r3 >>> 1;
	r2 = r3 | r2;
	r4 = r2 >>> 2;
	r2 = r2 | r4;
	r4 = r2 >>> 4;
	r2 = r2 | r4;
	r4 = r2 >>> 8;
	r2 = r2 | r4;
	r4 = r2 >>> 16;
	r2 = r2 | r4;
	r4 = r2 ^ -1;
	r5 = 1431655765;
	r4 = r4 >>> 1;
	r2 = r5 & (~r2);
	r4 = r4 & 1431655765;
	r2 = (r2 + r4)&-1;
	r4 = r2 >>> 2;
	r2 = r2 & 858993459;
	r4 = r4 & 858993459;
	r2 = (r2 + r4)&-1;
	r4 = r2 >>> 4;
	r2 = r2 & 252645135;
	r4 = r4 & 252645135;
	r2 = (r2 + r4)&-1;
	r4 = r2 >>> 8;
	r2 = r2 & 16711935;
	r4 = r4 & 16711935;
	r2 = (r2 + r4)&-1;
	r4 = r2 & 65535;
	r2 = r2 >>> 16;
	r5 = 26;
	r2 = (r4 + r2)&-1;
	r4 = (r5 - r2)&-1;
	r3 = r3 >>> r4;
	r4 = 24;
	r3 = r3 ^ 32;
	r2 = (r4 - r2)&-1;
}
else{
	r3 = r2 >>> 3;
	r2 = 0;
}
	r4 = r2 << 7;
	r4 = (r1 + r4)&-1;
	r5 = r3 << 2;
	r4 = (r4 + r5)&-1;
	r4 = r4 >> 2;
	r5 = heap32[(r4+24)];
	r6 = r0 >> 2;
	r7 = block_null;
	heap32[(r6+2)] = r5;
	r5 = r5 >> 2;
	heap32[(r6+3)] = r7;
	heap32[(r5+3)] = r0;
	r5 = 1;
	r6 = r1 >> 2;
	heap32[(r4+24)] = r0;
	r0 = r2 << 2;
	r2 = r5 << r2;
	r4 = heap32[(r6)];
	r0 = (r1 + r0)&-1;
	r1 = r4 | r2;
	r0 = r0 >> 2;
	heap32[(r6)] = r1;
	r1 = r5 << r3;
	r2 = heap32[(r0+1)];
	r1 = r2 | r1;
	heap32[(r0+1)] = r1;
}
	return;
}

function block_prepare_used(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	if(r0 ==0) //_LBB123_8
{
	r0 = 0;
	r_g0 = r0;
	return;
}
else{
	r1 = heap32[(fp+2)];
	r2 = r0 >> 2;
	r3 = heap32[(r2+1)];
	r4 = r3 & -4;
	r5 = (r1 + 16)&-1;
	if(uint(r4) >=uint(r5)) //_LBB123_3
{
	r3 = heap32[(fp)];
	r5 = (r0 + 8)&-1;
	r6 = (r5 + r1)&-1;
	r7 = r6 >> 2;
	r8 = -4;
	r9 = heap32[(r7)];
	r8 = (r8 - r1)&-1;
	r9 = r9 & 3;
	r4 = (r8 + r4)&-1;
	r4 = r9 | r4;
	heap32[(r7)] = r4;
	r4 = heap32[(r2+1)];
	r4 = r4 & 3;
	r4 = r4 | r1;
	heap32[(r2+1)] = r4;
	r4 = heap32[(r7)];
	r4 = (r4 + -4)&-1;
	r8 = (r1 + 4)&-1;
	r4 = r4 & -4;
	r1 = (r1 + 8)&-1;
	r9 = (r4 + r8)&-1;
	r4 = (r4 + r1)&-1;
	r9 = (r5 + r9)&-1;
	r4 = (r5 + r4)&-1;
	r6 = (r6 + -4)&-1;
	r9 = r9 >> 2;
	r4 = r4 >> 2;
	heap32[(r9)] = r6;
	r9 = heap32[(r4)];
	r9 = r9 | 2;
	heap32[(r4)] = r9;
	r4 = heap32[(r7)];
	r4 = r4 | 1;
	heap32[(r7)] = r4;
	r4 = heap32[(r2+1)];
	r4 = (r4 + -4)&-1;
	r4 = r4 & -4;
	r4 = (r5 + r4)&-1;
	r4 = r4 >> 2;
	heap32[(r4)] = r0;
	r4 = heap32[(r7)];
	r9 = r4 & -4;
	r10 = r4 | 2;
	heap32[(r7)] = r10;
	if(uint(r9) >uint(255)) //_LBB123_5
{
	r4 = r9 >>> 1;
	r4 = r9 | r4;
	r7 = r4 >>> 2;
	r4 = r4 | r7;
	r7 = r4 >>> 4;
	r4 = r4 | r7;
	r7 = r4 >>> 8;
	r4 = r4 | r7;
	r7 = r4 >>> 16;
	r4 = r4 | r7;
	r7 = r4 ^ -1;
	r10 = 1431655765;
	r7 = r7 >>> 1;
	r4 = r10 & (~r4);
	r7 = r7 & 1431655765;
	r4 = (r4 + r7)&-1;
	r7 = r4 >>> 2;
	r4 = r4 & 858993459;
	r7 = r7 & 858993459;
	r4 = (r4 + r7)&-1;
	r7 = r4 >>> 4;
	r4 = r4 & 252645135;
	r7 = r7 & 252645135;
	r4 = (r4 + r7)&-1;
	r7 = r4 >>> 8;
	r4 = r4 & 16711935;
	r7 = r7 & 16711935;
	r4 = (r4 + r7)&-1;
	r7 = r4 & 65535;
	r4 = r4 >>> 16;
	r10 = 26;
	r4 = (r7 + r4)&-1;
	r7 = (r10 - r4)&-1;
	r9 = r9 >>> r7;
	r7 = 24;
	r9 = r9 ^ 32;
	r4 = (r7 - r4)&-1;
}
else{
	r9 = r4 >>> 3;
	r4 = 0;
}
	r7 = r4 << 7;
	r7 = (r3 + r7)&-1;
	r10 = r9 << 2;
	r7 = (r7 + r10)&-1;
	r7 = r7 >> 2;
	r8 = (r5 + r8)&-1;
	r1 = (r5 + r1)&-1;
	r5 = heap32[(r7+24)];
	r8 = r8 >> 2;
	r1 = r1 >> 2;
	r10 = block_null;
	heap32[(r8)] = r5;
	r5 = r5 >> 2;
	heap32[(r1)] = r10;
	heap32[(r5+3)] = r6;
	r1 = 1;
	r5 = r3 >> 2;
	heap32[(r7+24)] = r6;
	r6 = r4 << 2;
	r4 = r1 << r4;
	r7 = heap32[(r5)];
	r3 = (r3 + r6)&-1;
	r4 = r7 | r4;
	r3 = r3 >> 2;
	heap32[(r5)] = r4;
	r1 = r1 << r9;
	r4 = heap32[(r3+1)];
	r1 = r4 | r1;
	heap32[(r3+1)] = r1;
	r3 = heap32[(r2+1)];
}
	r1 = r3 & -4;
	r0 = (r0 + 8)&-1;
	r1 = (r0 + r1)&-1;
	r1 = r1 >> 2;
	r3 = heap32[(r1)];
	r3 = r3 & -3;
	heap32[(r1)] = r3;
	r1 = heap32[(r2+1)];
	r1 = r1 & -2;
	heap32[(r2+1)] = r1;
	r_g0 = r0;
	return;
}
}

function block_locate_free(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
_1: do {
if(!(r0 ==0)) //_LBB124_16
{
	r1 = heap32[(fp)];
	if(uint(r0) >uint(31)) //_LBB124_3
{
	r2 = r0 >>> 1;
	r2 = r0 | r2;
	r3 = r2 >>> 2;
	r2 = r2 | r3;
	r3 = r2 >>> 4;
	r2 = r2 | r3;
	r3 = r2 >>> 8;
	r2 = r2 | r3;
	r3 = r2 >>> 16;
	r2 = r2 | r3;
	r3 = r2 ^ -1;
	r4 = 1431655765;
	r3 = r3 >>> 1;
	r2 = r4 & (~r2);
	r3 = r3 & 1431655765;
	r2 = (r2 + r3)&-1;
	r3 = r2 >>> 2;
	r2 = r2 & 858993459;
	r3 = r3 & 858993459;
	r2 = (r2 + r3)&-1;
	r3 = r2 >>> 4;
	r2 = r2 & 252645135;
	r3 = r3 & 252645135;
	r2 = (r2 + r3)&-1;
	r3 = r2 >>> 8;
	r2 = r2 & 16711935;
	r3 = r3 & 16711935;
	r2 = (r2 + r3)&-1;
	r3 = r2 & 65535;
	r2 = r2 >>> 16;
	r5 = 26;
	r2 = (r3 + r2)&-1;
	r3 = 1;
	r2 = (r5 - r2)&-1;
	r2 = r3 << r2;
	r0 = (r0 + r2)&-1;
	r0 = (r0 + -1)&-1;
	if(uint(r0) >uint(255)) //_LBB124_5
{
	r2 = r0 >>> 1;
	r2 = r0 | r2;
	r3 = r2 >>> 2;
	r2 = r2 | r3;
	r3 = r2 >>> 4;
	r2 = r2 | r3;
	r3 = r2 >>> 8;
	r2 = r2 | r3;
	r3 = r2 >>> 16;
	r2 = r2 | r3;
	r3 = r2 ^ -1;
	r3 = r3 >>> 1;
	r4 = r4 & (~r2);
	r2 = r3 & 1431655765;
	r4 = (r4 + r2)&-1;
	r2 = r4 >>> 2;
	r4 = r4 & 858993459;
	r2 = r2 & 858993459;
	r4 = (r4 + r2)&-1;
	r2 = r4 >>> 4;
	r4 = r4 & 252645135;
	r2 = r2 & 252645135;
	r4 = (r4 + r2)&-1;
	r2 = r4 >>> 8;
	r4 = r4 & 16711935;
	r2 = r2 & 16711935;
	r4 = (r4 + r2)&-1;
	r2 = r4 & 65535;
	r4 = r4 >>> 16;
	r4 = (r2 + r4)&-1;
	r2 = (r5 - r4)&-1;
	r0 = r0 >>> r2;
	r2 = 24;
	r0 = r0 ^ 32;
	r4 = (r2 - r4)&-1;
__label__ = 5;
}
else{
__label__ = 3;
}
}
else{
__label__ = 3;
}
switch(__label__ ){//multiple entries
case 3: 
	r0 = r0 >>> 3;
	r4 = 0;
break;
}
	r2 = r4 << 2;
	r2 = (r1 + r2)&-1;
	r2 = r2 >> 2;
	r3 = -1;
	r2 = heap32[(r2+1)];
	r0 = r3 << r0;
	r0 = r2 & r0;
	if(r0 ==0) //_LBB124_8
{
	r0 = r1 >> 2;
	r4 = (r4 + 1)&-1;
	r0 = heap32[(r0)];
	r4 = r3 << r4;
	r0 = r0 & r4;
	if(r0 ==0) //_LBB124_16
{
break _1;
}
else{
	r4 = (r0 + -1)&-1;
	r0 = r4 & (~r0);
	r4 = r0 >>> 1;
	r0 = r0 & 1431655765;
	r4 = r4 & 1431655765;
	r0 = (r0 + r4)&-1;
	r4 = r0 >>> 2;
	r0 = r0 & 858993459;
	r4 = r4 & 858993459;
	r0 = (r0 + r4)&-1;
	r4 = r0 >>> 4;
	r0 = r0 & 252645135;
	r4 = r4 & 252645135;
	r0 = (r0 + r4)&-1;
	r4 = r0 >>> 8;
	r0 = r0 & 16711935;
	r4 = r4 & 16711935;
	r0 = (r0 + r4)&-1;
	r4 = r0 & 65535;
	r0 = r0 >>> 16;
	r4 = (r4 + r0)&-1;
	r0 = r4 << 2;
	r0 = (r1 + r0)&-1;
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
}
}
	r2 = (r0 + -1)&-1;
	r2 = r2 & (~r0);
	r5 = r2 >>> 1;
	r2 = r2 & 1431655765;
	r5 = r5 & 1431655765;
	r2 = (r2 + r5)&-1;
	r5 = r2 >>> 2;
	r2 = r2 & 858993459;
	r5 = r5 & 858993459;
	r2 = (r2 + r5)&-1;
	r5 = r2 >>> 4;
	r2 = r2 & 252645135;
	r5 = r5 & 252645135;
	r2 = (r2 + r5)&-1;
	r5 = r2 >>> 8;
	r2 = r2 & 16711935;
	r5 = r5 & 16711935;
	r2 = (r2 + r5)&-1;
	r5 = r2 & 65535;
	r2 = r2 >>> 16;
	r2 = (r5 + r2)&-1;
	r0 = r0 == 0 ? r3 : r2; 
	r2 = r4 << 7;
	r2 = (r1 + r2)&-1;
	r3 = r0 << 2;
	r2 = (r2 + r3)&-1;
	r3 = r2 >> 2;
	r3 = heap32[(r3+24)];
if(!(r3 ==0)) //_LBB124_16
{
	r2 = (r2 + 96)&-1;
	r5 = r3 >> 2;
	r6 = heap32[(r5+2)];
	r5 = heap32[(r5+3)];
	r7 = r6 >> 2;
	r8 = r5 >> 2;
	heap32[(r7+3)] = r5;
	r2 = r2 >> 2;
	heap32[(r8+2)] = r6;
	r5 = heap32[(r2)];
if(!(r5 !=r3)) //_LBB124_15
{
	r5 = block_null;
	heap32[(r2)] = r6;
if(!(r6 !=r5)) //_LBB124_15
{
	r2 = r4 << 2;
	r2 = (r1 + r2)&-1;
	r2 = r2 >> 2;
	r5 = 1;
	r0 = r5 << r0;
	r6 = heap32[(r2+1)];
	r0 = r6 & (~r0);
	heap32[(r2+1)] = r0;
if(!(r0 !=0)) //_LBB124_15
{
	r0 = r1 >> 2;
	r1 = r5 << r4;
	r2 = heap32[(r0)];
	r1 = r2 & (~r1);
	heap32[(r0)] = r1;
}
}
}
	r_g0 = r3;
	return;
}
}
} while(0);
	r0 = 0;
	r_g0 = r0;
	return;
}

function tlsf_malloc(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = heap32[(fp)];
	r2 = (r0 + -1)&-1;
	if(uint(r2) <uint(1073741823)) //_LBB125_2
{
	r0 = (r0 + 7)&-1;
	r0 = r0 & -8;
	r2 = 12;
	r0 = uint(r0) < uint(r2) ? r2 : r0; 
}
else{
	r0 = 0;
}
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	block_locate_free(i7);
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r_g0;
	heap32[(g0+2)] = r0;
	block_prepare_used(i7);
	return;
}

function tlsf_realloc(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = heap32[(fp)];
	r2 = heap32[(fp+2)];
if(!(r0 ==0)) //_LBB126_3
{
if(!(r2 !=0)) //_LBB126_3
{
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	tlsf_free(i7);
	r0 = 0;
	r_g0 = r0;
	return;
}
}
	if(r0 !=0) //_LBB126_8
{
	r3 = r0 >> 2;
	r4 = heap32[(r3+-1)];
	r5 = r4 & -4;
	r6 = (r0 + r5)&-1;
	r6 = r6 >> 2;
	r6 = heap32[(r6)];
	r7 = r6 & -4;
	r7 = (r5 + r7)&-1;
	r8 = (r2 + -1)&-1;
	r9 = (r0 + -8)&-1;
	r7 = (r7 + 4)&-1;
	if(uint(r8) <uint(1073741823)) //_LBB126_10
{
	r10 = (r2 + 7)&-1;
	r10 = r10 & -8;
	r11 = 12;
	r10 = uint(r10) < uint(r11) ? r11 : r10; 
}
else{
	r10 = 0;
}
_11: do {
	if(uint(r10) >uint(r5)) //_LBB126_13
{
	r4 = r6 & 1;
if(!(r4 ==0)) //_LBB126_15
{
	if(uint(r10) <=uint(r7)) //_LBB126_20
{
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r9;
	block_merge_next(i7);
	r4 = heap32[(r3+-1)];
	r4 = r4 & -4;
	r4 = (r0 + r4)&-1;
	r4 = r4 >> 2;
	r2 = heap32[(r4)];
	r2 = r2 & -3;
	heap32[(r4)] = r2;
	r4 = heap32[(r3+-1)];
	r4 = r4 & -2;
	heap32[(r3+-1)] = r4;
break _11;
}
}
	if(uint(r8) <uint(1073741823)) //_LBB126_17
{
	r3 = (r2 + 7)&-1;
	r3 = r3 & -8;
	r4 = 12;
	r3 = uint(r3) < uint(r4) ? r4 : r3; 
}
else{
	r3 = 0;
}
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r3;
	block_locate_free(i7);
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r_g0;
	heap32[(g0+2)] = r3;
	block_prepare_used(i7);
	r3 = r_g0;
	if(r3 ==0) //_LBB126_27
{
	r_g0 = r3;
	return;
}
else{
	r4 = uint(r5) >= uint(r2) ? r2 : r5; 
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r4;
	memcpy(i7);
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	tlsf_free(i7);
	r_g0 = r3;
	return;
}
}
} while(0);
	r2 = r4 & -4;
	r4 = (r10 + 16)&-1;
if(!(uint(r2) <uint(r4))) //_LBB126_26
{
	r4 = (r0 + r10)&-1;
	r5 = r4 >> 2;
	r6 = -4;
	r7 = heap32[(r5)];
	r6 = (r6 - r10)&-1;
	r7 = r7 & 3;
	r2 = (r6 + r2)&-1;
	r2 = r7 | r2;
	heap32[(r5)] = r2;
	r2 = heap32[(r3+-1)];
	r2 = r2 & 3;
	r2 = r2 | r10;
	heap32[(r3+-1)] = r2;
	r3 = heap32[(r5)];
	r3 = (r3 + -4)&-1;
	r3 = r3 & -4;
	r3 = (r10 + r3)&-1;
	r3 = (r3 + r0)&-1;
	r2 = (r4 + -4)&-1;
	r3 = r3 >> 2;
	heap32[(r3+1)] = r2;
	r4 = heap32[(r3+2)];
	r4 = r4 | 2;
	heap32[(r3+2)] = r4;
	r3 = heap32[(r5)];
	r3 = r3 | 1;
	r3 = r3 & -3;
	heap32[(r5)] = r3;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	block_merge_next(i7);
	r3 = r_g0;
	r2 = r3 >> 2;
	r2 = heap32[(r2+1)];
	r4 = r2 & -4;
	if(uint(r4) >uint(255)) //_LBB126_24
{
	r2 = r4 >>> 1;
	r2 = r4 | r2;
	r5 = r2 >>> 2;
	r2 = r2 | r5;
	r5 = r2 >>> 4;
	r2 = r2 | r5;
	r5 = r2 >>> 8;
	r2 = r2 | r5;
	r5 = r2 >>> 16;
	r2 = r2 | r5;
	r5 = r2 ^ -1;
	r6 = 1431655765;
	r5 = r5 >>> 1;
	r2 = r6 & (~r2);
	r5 = r5 & 1431655765;
	r2 = (r2 + r5)&-1;
	r5 = r2 >>> 2;
	r2 = r2 & 858993459;
	r5 = r5 & 858993459;
	r2 = (r2 + r5)&-1;
	r5 = r2 >>> 4;
	r2 = r2 & 252645135;
	r5 = r5 & 252645135;
	r2 = (r2 + r5)&-1;
	r5 = r2 >>> 8;
	r2 = r2 & 16711935;
	r5 = r5 & 16711935;
	r2 = (r2 + r5)&-1;
	r5 = r2 & 65535;
	r2 = r2 >>> 16;
	r6 = 26;
	r2 = (r5 + r2)&-1;
	r5 = (r6 - r2)&-1;
	r4 = r4 >>> r5;
	r5 = 24;
	r4 = r4 ^ 32;
	r2 = (r5 - r2)&-1;
}
else{
	r4 = r2 >>> 3;
	r2 = 0;
}
	r5 = r2 << 7;
	r5 = (r1 + r5)&-1;
	r6 = r4 << 2;
	r5 = (r5 + r6)&-1;
	r5 = r5 >> 2;
	r6 = heap32[(r5+24)];
	r7 = r3 >> 2;
	r8 = block_null;
	heap32[(r7+2)] = r6;
	r6 = r6 >> 2;
	heap32[(r7+3)] = r8;
	heap32[(r6+3)] = r3;
	r6 = 1;
	r7 = r1 >> 2;
	heap32[(r5+24)] = r3;
	r3 = r2 << 2;
	r2 = r6 << r2;
	r5 = heap32[(r7)];
	r3 = (r1 + r3)&-1;
	r1 = r5 | r2;
	r3 = r3 >> 2;
	heap32[(r7)] = r1;
	r1 = r6 << r4;
	r2 = heap32[(r3+1)];
	r1 = r2 | r1;
	heap32[(r3+1)] = r1;
}
	r_g0 = r0;
	return;
}
else{
	r0 = (r2 + -1)&-1;
	if(uint(r0) <uint(1073741823)) //_LBB126_6
{
	r0 = (r2 + 7)&-1;
	r0 = r0 & -8;
	r2 = 12;
	r0 = uint(r0) < uint(r2) ? r2 : r0; 
}
else{
	r0 = 0;
}
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	block_locate_free(i7);
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r_g0;
	heap32[(g0+2)] = r0;
	block_prepare_used(i7);
	return;
}
}

function tlsf_create(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r0 = (r0 + -3048)&-1;
	r1 = r0 & -8;
	r2 = (r1 + -12)&-1;
	if(uint(r2) <uint(1073741813)) //_LBB127_2
{
	r2 = heap32[(fp)];
	r3 = block_null;
	r4 = r3 >> 2;
	heap32[(r4+2)] = r3;
	r5 = -1;
	r6 = r2 >> 2;
	heap32[(r4+3)] = r3;
	heap32[(r6)] = 0;
_3: while(true){
	r4 = r5 << 2;
	r7 = r5 << 7;
	r4 = (r2 - r4)&-1;
	r7 = (r2 - r7)&-1;
	r4 = r4 >> 2;
	r7 = r7 >> 2;
	heap32[(r4)] = 0;
	heap32[(r7+-8)] = r3;
	heap32[(r7+-7)] = r3;
	heap32[(r7+-6)] = r3;
	heap32[(r7+-5)] = r3;
	heap32[(r7+-4)] = r3;
	heap32[(r7+-3)] = r3;
	heap32[(r7+-2)] = r3;
	heap32[(r7+-1)] = r3;
	heap32[(r7)] = r3;
	heap32[(r7+1)] = r3;
	heap32[(r7+2)] = r3;
	heap32[(r7+3)] = r3;
	heap32[(r7+4)] = r3;
	heap32[(r7+5)] = r3;
	heap32[(r7+6)] = r3;
	heap32[(r7+7)] = r3;
	heap32[(r7+8)] = r3;
	heap32[(r7+9)] = r3;
	heap32[(r7+10)] = r3;
	heap32[(r7+11)] = r3;
	heap32[(r7+12)] = r3;
	heap32[(r7+13)] = r3;
	heap32[(r7+14)] = r3;
	heap32[(r7+15)] = r3;
	heap32[(r7+16)] = r3;
	heap32[(r7+17)] = r3;
	heap32[(r7+18)] = r3;
	heap32[(r7+19)] = r3;
	heap32[(r7+20)] = r3;
	heap32[(r7+21)] = r3;
	r5 = (r5 + -1)&-1;
	heap32[(r7+22)] = r3;
	heap32[(r7+23)] = r3;
if(!(r5 !=-24)) //_LBB127_3
{
break _3;
}
}
	r4 = r0 | 1;
	r5 = (r2 + 3036)&-1;
	r4 = r4 & -7;
	heap32[(r6+760)] = r4;
	if(uint(r1) >uint(255)) //_LBB127_6
{
	r0 = r1 >>> 1;
	r0 = r1 | r0;
	r4 = r0 >>> 2;
	r0 = r0 | r4;
	r4 = r0 >>> 4;
	r0 = r0 | r4;
	r4 = r0 >>> 8;
	r0 = r0 | r4;
	r4 = r0 >>> 16;
	r0 = r0 | r4;
	r4 = r0 ^ -1;
	r7 = 1431655765;
	r4 = r4 >>> 1;
	r0 = r7 & (~r0);
	r4 = r4 & 1431655765;
	r0 = (r0 + r4)&-1;
	r4 = r0 >>> 2;
	r0 = r0 & 858993459;
	r4 = r4 & 858993459;
	r0 = (r0 + r4)&-1;
	r4 = r0 >>> 4;
	r0 = r0 & 252645135;
	r4 = r4 & 252645135;
	r0 = (r0 + r4)&-1;
	r4 = r0 >>> 8;
	r0 = r0 & 16711935;
	r4 = r4 & 16711935;
	r0 = (r0 + r4)&-1;
	r4 = r0 & 65535;
	r0 = r0 >>> 16;
	r7 = 26;
	r0 = (r4 + r0)&-1;
	r4 = (r7 - r0)&-1;
	r1 = r1 >>> r4;
	r4 = 24;
	r1 = r1 ^ 32;
	r0 = (r4 - r0)&-1;
}
else{
	r1 = r0 >>> 3;
	r0 = 0;
}
	r4 = r0 << 7;
	r4 = (r2 + r4)&-1;
	r7 = r1 << 2;
	r4 = (r4 + r7)&-1;
	r4 = r4 >> 2;
	r7 = heap32[(r4+24)];
	heap32[(r6+761)] = r7;
	r7 = r7 >> 2;
	heap32[(r6+762)] = r3;
	heap32[(r7+3)] = r5;
	r3 = 1;
	heap32[(r4+24)] = r5;
	r4 = r0 << 2;
	r0 = r3 << r0;
	r7 = heap32[(r6)];
	r4 = (r2 + r4)&-1;
	r0 = r7 | r0;
	r4 = r4 >> 2;
	heap32[(r6)] = r0;
	r0 = r3 << r1;
	r1 = heap32[(r4+1)];
	r0 = r1 | r0;
	heap32[(r4+1)] = r0;
	r0 = heap32[(r6+760)];
	r0 = (r0 + 3040)&-1;
	r0 = r0 & -4;
	r0 = (r2 + r0)&-1;
	r0 = r0 >> 2;
	heap32[(r0)] = r5;
	heap32[(r0+1)] = 2;
	r_g0 = r2;
	return;
}
else{
	r0 = _2E_str640;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 3060;
	heap32[(g0+2)] = 1073744872;
	printf(i7);
	r0 = 0;
	r_g0 = r0;
	return;
}
}

function _stricmp(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r5 = 26;
_1: while(true){
	r2 = heap8[r1];
	r3 = heap8[r0];
	r4 = (r2 + -65)&-1;
	r2 = (r2 + -33)&-1;
	r6 = (r3 + -65)&-1;
	r3 = (r3 + -33)&-1;
	r2 = uint(r4) < uint(r5) ? r2 : r4; 
	r3 = uint(r6) < uint(r5) ? r3 : r6; 
	if(r2 !=r3) //_LBB128_3
{
break _1;
}
else{
	r0 = (r0 + 1)&-1;
	r1 = (r1 + 1)&-1;
	if(r3 !=-65) //_LBB128_1
{
continue _1;
}
else{
break _1;
}
}
}
	r0 = (r3 - r2)&-1;
	r_g0 = r0;
	return;
}

function strcasecmp(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r5 = 26;
_1: while(true){
	r2 = heap8[r1];
	r3 = heap8[r0];
	r4 = (r2 + -65)&-1;
	r2 = (r2 + -33)&-1;
	r6 = (r3 + -65)&-1;
	r3 = (r3 + -33)&-1;
	r2 = uint(r4) < uint(r5) ? r2 : r4; 
	r3 = uint(r6) < uint(r5) ? r3 : r6; 
	if(r2 !=r3) //_LBB129_3
{
break _1;
}
else{
	r1 = (r1 + 1)&-1;
	r0 = (r0 + 1)&-1;
	if(r3 !=-65) //_LBB129_1
{
continue _1;
}
else{
break _1;
}
}
}
	r0 = (r3 - r2)&-1;
	r_g0 = r0;
	return;
}

function strcpy(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = r1 ^ r0;
	r2 = r2 & 3;
_1: do {
	if(r2 ==0) //_LBB130_2
{
	r2 = r0 & 3;
	if(r2 !=0) //_LBB130_4
{
	r2 = r0 | -4;
_5: while(true){
	if(r2 !=0) //_LBB130_7
{
	r3 = heapU8[r1];
	r4 = (r0 + 1)&-1;
	r1 = (r1 + 1)&-1;
	r2 = (r2 + 1)&-1;
	heap8[r0] = r3;
	r0 = r4;
if(!(r3 !=0)) //_LBB130_5
{
break _1;
}
}
else{
break _5;
}
}
}
	r2 = r1 >> 2;
	r2 = heap32[(r2)];
	r3 = r2 & -2139062144;
	r3 = r3 ^ -2139062144;
	r4 = (r2 + -16843009)&-1;
	r3 = r3 & r4;
_9: do {
	if(r3 ==0) //_LBB130_11
{
	r1 = (r1 + 4)&-1;
_11: while(true){
	r3 = r0 >> 2;
	r4 = r1 >> 2;
	heap32[(r3)] = r2;
	r2 = heap32[(r4)];
	r3 = r2 & -2139062144;
	r0 = (r0 + 4)&-1;
	r1 = (r1 + 4)&-1;
	r3 = r3 ^ -2139062144;
	r4 = (r2 + -16843009)&-1;
	r3 = r3 & r4;
if(!(r3 ==0)) //_LBB130_15
{
break _9;
}
}
}
} while(0);
	r1 = r2 & 255;
	heap8[r0] = r2;
if(!(r1 ==0)) //_LBB130_8
{
	r0 = (r0 + 1)&-1;
_15: while(true){
	r2 = r2 >>> 8;
	r1 = (r0 + 1)&-1;
	heap8[r0] = r2;
	r3 = r2 & 255;
	r0 = r1;
	if(r3 ==0) //_LBB130_8
{
break _1;
}
else{
continue _15;
}
}
}
}
else{
_17: while(true){
	r2 = heapU8[r1];
	r3 = (r0 + 1)&-1;
	r1 = (r1 + 1)&-1;
	heap8[r0] = r2;
	r0 = r3;
	if(r2 ==0) //_LBB130_8
{
break _1;
}
else{
continue _17;
}
}
}
} while(0);
	return;
}

function strcmp(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = r1 ^ r0;
	r2 = r2 & 3;
_1: do {
	if(r2 ==0) //_LBB131_7
{
	r2 = r0 & 3;
_3: do {
	if(r2 !=0) //_LBB131_9
{
	r2 = r0 | -4;
_5: while(true){
	if(r2 !=0) //_LBB131_10
{
	r3 = heapU8[r0];
	r4 = heapU8[r1];
	if(r3 ==0) //_LBB131_12
{
break _5;
}
else{
	r5 = r4 & 255;
	if(r3 ==r5) //_LBB131_13
{
	r0 = (r0 + 1)&-1;
	r1 = (r1 + 1)&-1;
	r2 = (r2 + 1)&-1;
}
else{
break _5;
}
}
}
else{
break _3;
}
}
	r0 = r3 << 24;
	r1 = r4 << 24;
break _1;
}
} while(0);
_11: while(true){
	r2 = r0 >> 2;
	r2 = heap32[(r2)];
	r3 = r1 >> 2;
	r4 = r2 & -2139062144;
	r3 = heap32[(r3)];
	r4 = r4 ^ -2139062144;
	r5 = (r2 + -16843009)&-1;
	r4 = r4 & r5;
	if(r4 !=0) //_LBB131_18
{
break _11;
}
else{
	r4 = r3 & -2139062144;
	r4 = r4 ^ -2139062144;
	r5 = (r3 + -16843009)&-1;
	r4 = r4 & r5;
	if(r4 !=0) //_LBB131_18
{
break _11;
}
else{
	r0 = (r0 + 4)&-1;
	r1 = (r1 + 4)&-1;
if(!(r2 ==r3)) //_LBB131_15
{
break _11;
}
}
}
}
	r0 = r2 & 255;
_16: do {
if(!(r0 ==0)) //_LBB131_21
{
	r0 = r2 & 255;
	r1 = r3 & 255;
if(!(r0 !=r1)) //_LBB131_21
{
__label__ = 19; //SET chanka
_18: while(true){
	r2 = r2 >>> 8;
	r3 = r3 >>> 8;
	r0 = r2 & 255;
	if(r0 ==0) //_LBB131_24
{
break _16;
}
else{
	r1 = r3 & 255;
if(!(r0 ==r1)) //_LBB131_22
{
break _16;
}
}
}
}
}
} while(0);
	r2 = r2 & 255;
	r3 = r3 & 255;
	r2 = (r2 - r3)&-1;
	r_g0 = r2;
	return;
}
else{
_22: while(true){
	r2 = heapU8[r0];
	r3 = heapU8[r1];
	if(r2 ==0) //_LBB131_5
{
break _22;
}
else{
	r4 = r3 & 255;
	if(r2 ==r4) //_LBB131_2
{
	r0 = (r0 + 1)&-1;
	r1 = (r1 + 1)&-1;
}
else{
break _22;
}
}
}
	r0 = r2 << 24;
	r1 = r3 << 24;
}
} while(0);
	r0 = r0 >> 24;
	r1 = r1 >> 24;
	r0 = (r0 - r1)&-1;
	r_g0 = r0;
	return;
}

function memmove(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = heap32[(fp)];
_1: do {
if(!(r0 ==r1)) //_LBB132_8
{
	r2 = heap32[(fp+2)];
	if(uint(r0) <=uint(r1)) //_LBB132_5
{
if(!(r2 ==0)) //_LBB132_8
{
	r3 = 0;
	r2 = (r3 - r2)&-1;
_6: while(true){
	r3 = (r0 - r2)&-1;
	r4 = (r2 + 1)&-1;
	r2 = (r1 - r2)&-1;
	r3 = heapU8[r3+-1];
	heap8[r2+-1] = r3;
	r2 = r4;
	if(r4 !=0) //_LBB132_7
{
continue _6;
}
else{
break _1;
}
}
}
}
else{
if(!(r2 ==0)) //_LBB132_8
{
	r3 = r1;
_10: while(true){
	r4 = heapU8[r0];
	r2 = (r2 + -1)&-1;
	r5 = (r3 + 1)&-1;
	r0 = (r0 + 1)&-1;
	heap8[r3] = r4;
	r3 = r5;
	if(r2 ==0) //_LBB132_8
{
break _1;
}
else{
continue _10;
}
}
}
}
}
} while(0);
	r_g0 = r1;
	return;
}

function strncasecmp(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = heap32[(fp+2)];
	r3 = 0;
	r7 = 26;
_1: while(true){
	if(r3 >=r2) //_LBB133_5
{
__label__ = 5;
break _1;
}
else{
	r4 = heap8[r1+r3];
	r5 = heap8[r0+r3];
	r6 = (r4 + -65)&-1;
	r4 = (r4 + -33)&-1;
	r8 = (r5 + -65)&-1;
	r5 = (r5 + -33)&-1;
	r4 = uint(r6) < uint(r7) ? r4 : r6; 
	r5 = uint(r8) < uint(r7) ? r5 : r8; 
	if(r4 !=r5) //_LBB133_4
{
__label__ = 4;
break _1;
}
else{
	r3 = (r3 + 1)&-1;
	if(r5 !=-65) //_LBB133_1
{
continue _1;
}
else{
__label__ = 4;
break _1;
}
}
}
}
switch(__label__ ){//multiple entries
case 5: 
	r0 = 0;
	r_g0 = r0;
	return;
break;
case 4: 
	r0 = (r5 - r4)&-1;
	r_g0 = r0;
	return;
break;
}
}

function strncmp(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp)];
	r2 = heap32[(fp+1)];
	if(uint(r0) >uint(3)) //_LBB134_2
{
	r5 = r0 >>> 2;
	r1 = (r1 + 2)&-1;
_3: while(true){
	r3 = heapU8[r1+-2];
	r4 = heapU8[r2];
	if(r3 ==0) //_LBB134_5
{
__label__ = 5;
break _3;
}
else{
	r6 = r4 & 255;
	if(r3 ==r6) //_LBB134_6
{
	r3 = heapU8[r1+-1];
	r4 = heapU8[r2+1];
	if(r3 ==0) //_LBB134_8
{
__label__ = 5;
break _3;
}
else{
	r6 = r4 & 255;
	if(r3 ==r6) //_LBB134_9
{
	r3 = heapU8[r1];
	r4 = heapU8[r2+2];
	if(r3 ==0) //_LBB134_11
{
__label__ = 5;
break _3;
}
else{
	r6 = r4 & 255;
	if(r3 ==r6) //_LBB134_12
{
	r3 = heapU8[r1+1];
	r4 = heapU8[r2+3];
	if(r3 ==0) //_LBB134_14
{
__label__ = 5;
break _3;
}
else{
	r6 = r4 & 255;
	if(r3 ==r6) //_LBB134_15
{
	r5 = (r5 + -1)&-1;
	r1 = (r1 + 4)&-1;
	r2 = (r2 + 4)&-1;
	if(r5 !=0) //_LBB134_3
{
__label__ = 3;
}
else{
__label__ = 13;
break _3;
}
}
else{
__label__ = 5;
break _3;
}
}
}
else{
__label__ = 5;
break _3;
}
}
}
else{
__label__ = 5;
break _3;
}
}
}
else{
__label__ = 5;
break _3;
}
}
}
switch(__label__ ){//multiple entries
case 5: 
	r1 = r4 & 255;
	r1 = (r3 - r1)&-1;
	r_g0 = r1;
	return;
break;
case 13: 
	r0 = r0 & 3;
	r1 = (r1 + -2)&-1;
break;
}
}
else{
	r3 = 0;
	r4 = r3;
}
_17: while(true){
	if(r0 !=0) //_LBB134_17
{
	r3 = heapU8[r1];
	r4 = heapU8[r2];
	if(r3 ==0) //_LBB134_19
{
__label__ = 16;
break _17;
}
else{
	r5 = r4 & 255;
	if(r3 ==r5) //_LBB134_20
{
	r0 = (r0 + -1)&-1;
	r1 = (r1 + 1)&-1;
	r2 = (r2 + 1)&-1;
continue _17;
}
else{
__label__ = 16;
break _17;
}
}
}
else{
__label__ = 19;
break _17;
}
}
switch(__label__ ){//multiple entries
case 16: 
	r0 = r4 & 255;
	r0 = (r3 - r0)&-1;
	r_g0 = r0;
	return;
break;
case 19: 
	r0 = r3 & 255;
	r1 = r4 & 255;
	r0 = (r0 - r1)&-1;
	r_g0 = r0;
	return;
break;
}
}

function quicksort(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
	var r20;
	var r21;
	var r22;
	var r23;
	var r24;
	var r25;
var __label__ = 0;
	i7 = sp + -40;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	heap32[(fp+-4)] = r0;
	r1 = heap32[(fp+1)];
	heap32[(fp+-3)] = r1;
if(!(r0 <=r1)) //_LBB135_37
{
	r0 = heap32[(fp)];
	r1 = heap32[(fp+3)];
	r2 = 4;
	r3 = heap32[(fp+-4)];
	r4 = r3 << 2;
	r5 = (r0 + r4)&-1;
	r6 = -4;
	r7 = -8;
	r2 = (r2 - r0)&-1;
	r3 = (r3 + -1)&-1;
	r8 = (r0 + 4)&-1;
	r6 = (r6 - r0)&-1;
	heap32[(fp+-1)] = r6;
	r6 = (r5 + -4)&-1;
	heap32[(fp+-2)] = r6;
	r6 = (r7 - r0)&-1;
	r2 = (r2 - r4)&-1;
	heap32[(fp+-6)] = r2;
_3: while(true){
	r2 = heap32[(fp+-3)];
	r4 = (r2 + -1)&-1;
	r7 = (r2 + 1)&-1;
	r9 = -1;
	r10 = -2;
	heap32[(fp+-5)] = r2;
	r2 = heap32[(fp+-4)];
	r11 = r4;
_5: while(true){
	r12 = r4 << 2;
	r13 = (r0 + r12)&-1;
	r14 = (r12 + 4)&-1;
	r15 = heap32[(fp+-1)];
	r15 = (r15 - r12)&-1;
	r16 = (r8 + r12)&-1;
	r12 = (r6 - r12)&-1;
_7: while(true){
	r17 = r12;
	r18 = r16;
	r19 = r15;
	r20 = r14;
	r21 = r4;
	r22 = r13;
	if(r3 ==r21) //_LBB135_6
{
break _7;
}
else{
	r4 = (r0 + r20)&-1;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r5;
	r13 = (r22 + 4)&-1;
	r4 = (r21 + 1)&-1;
	r14 = (r20 + 4)&-1;
	r15 = (r19 + -4)&-1;
	r16 = (r18 + 4)&-1;
	r12 = (r17 + -4)&-1;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r23 = r_g0;
if(!(r23 <0)) //_LBB135_4
{
break _7;
}
}
}
	r4 = r2 << 2;
	r12 = (r0 + r4)&-1;
	r13 = 0;
	r14 = (r13 - r12)&-1;
	r4 = (r21 + 1)&-1;
	r15 = (r12 + -4)&-1;
	r16 = r14;
_11: while(true){
	r23 = r14;
	r24 = r16;
	r25 = r2;
	r2 = (r15 + r13)&-1;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r2;
	r13 = (r13 + -4)&-1;
	r2 = (r25 + -1)&-1;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r14 = r_g0;
	if(r14 >-1) //_LBB135_9
{
break _11;
}
else{
	r16 = (r24 + 4)&-1;
	r14 = (r23 + 4)&-1;
if(!(r7 !=r25)) //_LBB135_7
{
break _11;
}
}
}
	if(r4 >=r2) //_LBB135_20
{
break _5;
}
else{
	r17 = 0;
_16: while(true){
	r22 = (r17 - r19)&-1;
	r14 = (r17 - r24)&-1;
	r15 = heapU8[r22];
	r14 = heapU8[r14+-4];
	r16 = (r17 + 1)&-1;
	r17 = (r17 - r23)&-1;
	heap8[r22] = r14;
	heap8[r17+-4] = r15;
	r17 = r16;
if(!(r16 !=4)) //_LBB135_11
{
break _16;
}
}
	r17 = (r0 + r20)&-1;
	heap32[(g0)] = r17;
	heap32[(g0+1)] = r5;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r17 = r_g0;
_19: do {
	if(r17 ==0) //_LBB135_14
{
	r17 = r11 << 2;
	r11 = (r11 + 1)&-1;
	r17 = (r8 + r17)&-1;
	r22 = 0;
_21: while(true){
	r14 = (r18 - r22)&-1;
	r15 = (r17 - r22)&-1;
	r16 = heapU8[r15];
	r19 = heapU8[r14];
	r22 = (r22 + -1)&-1;
	heap8[r15] = r19;
	heap8[r14] = r16;
if(!(r22 !=-4)) //_LBB135_15
{
break _19;
}
}
}
} while(0);
	r17 = (r12 + r13)&-1;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r17;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r17 = r_g0;
if(!(r17 !=0)) //_LBB135_3
{
	r4 = (r21 + 1)&-1;
	r17 = 0;
_25: while(true){
	r18 = heap32[(fp+-2)];
	r18 = (r17 + r18)&-1;
	r21 = r10 << 2;
	r18 = (r18 - r21)&-1;
	r21 = (r17 + r12)&-1;
	r21 = heapU8[r21+r13];
	r22 = heapU8[r18+-8];
	r14 = (r17 + r12)&-1;
	r17 = (r17 + 1)&-1;
	heap8[r14+r13] = r22;
	heap8[r18+-8] = r21;
	if(r17 ==4) //_LBB135_18
{
break _25;
}
}
	r10 = (r10 + 1)&-1;
	r9 = (r9 + 1)&-1;
}
}
}
	r2 = heap32[(fp+-4)];
	r2 = (r2 - r10)&-1;
	r4 = 0;
	r2 = (r2 + -2)&-1;
	r7 = (r4 - r22)&-1;
_29: while(true){
	r12 = (r5 - r4)&-1;
	r13 = (r18 - r4)&-1;
	r14 = heapU8[r13];
	r15 = heapU8[r12];
	r4 = (r4 + -1)&-1;
	heap8[r13] = r15;
	heap8[r12] = r14;
if(!(r4 !=-4)) //_LBB135_21
{
break _29;
}
}
	r4 = (r21 + 2)&-1;
	r12 = heap32[(fp+-3)];
	if(r12 <r11) //_LBB135_24
{
	r13 = r12 << 2;
	r14 = 0;
	r13 = (r0 + r13)&-1;
	r13 = (r14 - r13)&-1;
	r12 = (r11 - r12)&-1;
_34: while(true){
	r15 = r14;
_36: while(true){
	r16 = (r15 - r7)&-1;
	r18 = (r15 - r13)&-1;
	r19 = heapU8[r18];
	r20 = heapU8[r16];
	r15 = (r15 + 1)&-1;
	heap8[r18] = r20;
	heap8[r16] = r19;
if(!(r15 !=4)) //_LBB135_26
{
break _36;
}
}
	r12 = (r12 + -1)&-1;
	r13 = (r13 + -4)&-1;
	r7 = (r7 + 4)&-1;
if(!(r12 !=0)) //_LBB135_25
{
break _34;
}
}
	r7 = heap32[(fp+-3)];
	r7 = (r7 - r11)&-1;
	r7 = (r7 + r21)&-1;
}
else{
	r7 = r21;
}
	if(r3 >r2) //_LBB135_35
{
	r2 = heap32[(fp+-6)];
_44: while(true){
	r4 = 0;
_46: while(true){
	r11 = (r4 - r2)&-1;
	r12 = (r4 - r17)&-1;
	r13 = heapU8[r12];
	r14 = heapU8[r11];
	r4 = (r4 + 1)&-1;
	heap8[r12] = r14;
	heap8[r11] = r13;
if(!(r4 !=4)) //_LBB135_30
{
break _46;
}
}
	r9 = (r9 + -1)&-1;
	r17 = (r17 + -4)&-1;
	r2 = (r2 + 4)&-1;
if(!(r9 !=0)) //_LBB135_29
{
break _44;
}
}
	r2 = (r10 + r21)&-1;
	r2 = (r2 + 3)&-1;
	heap32[(fp+-3)] = r2;
}
else{
	heap32[(fp+-3)] = r4;
}
	heap32[(g0)] = r0;
	r2 = heap32[(fp+-5)];
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r7;
	heap32[(g0+3)] = r1;
	quicksort(i7);
	r4 = heap32[(fp+-3)];
	r2 = heap32[(fp+-4)];
	if(r4 <r2) //_LBB135_2
{
continue _3;
}
else{
break _3;
}
}
}
	return;
}

function __dtostr(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var f0;
	var f1;
	var f2;
	var f3;
var __label__ = 0;
	i7 = sp + -40;var g0 = i7>>2; // save stack
	f0 = llvm_readDouble((sp));
	r0 = sp + -8; 
	llvm_writeDouble((sp+-8),f0);
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	r1 = heap32[(fp+2)];
	r2 = heap32[(fp+3)];
	r3 = heap32[(fp+4)];
	r4 = heap32[(fp+5)];
	r5 = heap32[(fp+6)];
	r6 = heap32[(fp+-2)];
	if(r0 >2146435071) //_LBB136_3
{
	r7 = r0 ^ 2146959360;
	r7 = r6 | r7;
	if(r7 ==0) //_LBB136_13
{
__label__ = 13;
}
else{
	r7 = r0 ^ 2146435072;
	r6 = r6 | r7;
	if(r6 !=0) //_LBB136_21
{
__label__ = 20;
}
else{
__label__ = 5;
}
}
}
else{
	r7 = r0 ^ -1048576;
	r7 = r6 | r7;
	if(r7 ==0) //_LBB136_5
{
__label__ = 5;
}
else{
	r7 = r0 ^ -524288;
	r6 = r6 | r7;
	if(r6 ==0) //_LBB136_13
{
__label__ = 13;
}
else{
__label__ = 20;
}
}
}
_6: do {
switch(__label__ ){//multiple entries
case 13: 
	if(r2 >0) //_LBB136_15
{
	r0 = (r2 + -1)&-1;
	r3 = 2;
	r4 = 0;
	r5 = (r2 + 2)&-1;
	r0 = uint(r0) > uint(r3) ? r0 : r3; 
	r3 = (r4 - r2)&-1;
	r0 = (r5 - r0)&-1;
	r4 = _2E_str9652;
	r5 = r1;
_10: while(true){
	r6 = heapU8[r4];
	r0 = (r0 + -1)&-1;
	r7 = (r5 + 1)&-1;
	r4 = (r4 + 1)&-1;
	heap8[r5] = r6;
	r5 = r7;
if(!(r0 !=0)) //_LBB136_16
{
break _10;
}
}
	r0 = -3;
	r4 = 3;
	r0 = uint(r3) > uint(r0) ? r2 : r4; 
}
else{
	r0 = 0;
}
	if(r0 >=r2) //_LBB136_20
{
	r_g0 = r0;
	return;
}
else{
__label__ = 11;
break _6;
}
break;
case 20: 
	f1 =                         0;
	if(f0 !=f1) //_LBB136_32
{
	r0 = r0 >>> 20;
	r0 = r0 & 2047;
	r0 = (r0 + -1023)&-1;
	f2 = r0; //fitod r0, f2
	f3 =        0.3010299956639812;
	f2 = f2*f3;
	r0 = f2&-1;
	r6 = (r0 + 1)&-1;
	if(f0 <f1) //_LBB136_34
{
	f1 = -f0;
	r2 = (r2 + -1)&-1;
	r7 = (r1 + 1)&-1;
	r8 = 45;
	heap8[r1] = r8;
}
else{
	r7 = r1;
	f1 = f0;
}
_23: do {
	if(r4 ==0) //_LBB136_37
{
	f2 =                       0.5;
}
else{
	f2 =                       0.5;
	r8 = r4;
	f3 =       0.10000000000000001;
_26: while(true){
	r8 = (r8 + -1)&-1;
	f2 = f2*f3;
if(!(r8 !=0)) //_LBB136_38
{
break _23;
}
}
}
} while(0);
	f1 = f1+f2;
	f2 =                         1;
	if(f1 <f2) //_LBB136_41
{
	r2 = (r2 + -1)&-1;
	r8 = (r7 + 1)&-1;
	r9 = 48;
	heap8[r7] = r9;
	r7 = r8;
}
_32: do {
	if(r6 >0) //_LBB136_44
{
_34: do {
	if(uint(r6) >uint(10)) //_LBB136_46
{
	r0 = (r0 + 1)&-1;
	f2 =                        10;
	f3 =               10000000000;
_36: while(true){
	r0 = (r0 + -10)&-1;
	f2 = f2*f3;
if(!(uint(r0) >uint(10))) //_LBB136_47
{
break _34;
}
}
}
else{
	f2 =                        10;
	r0 = r6;
}
} while(0);
	if(uint(r0) >uint(1)) //_LBB136_50
{
	r0 = (r0 + -1)&-1;
	f3 =                        10;
_42: while(true){
	r0 = (r0 + -1)&-1;
	f2 = f2*f3;
if(!(r0 !=0)) //_LBB136_51
{
break _42;
}
}
	r0 = 1;
}
else{
	r0 = 1;
}
_46: while(true){
	f3 =       0.90000000000000002;
	if(f2 >f3) //_LBB136_53
{
	f3 = f1/f2;
	r8 = f3&-1;
	if(r0 ==0) //_LBB136_56
{
__label__ = 52;
}
else{
	r9 = r8 & 255;
	if(r9 !=0) //_LBB136_56
{
__label__ = 52;
}
else{
__label__ = 64;
}
}
switch(__label__ ){//multiple entries
case 52: 
	r0 = (r8 + 48)&-1;
	heap8[r7] = r0;
	if(r2 !=0) //_LBB136_70
{
	r0 = r8 << 24;
	r0 = r0 >> 24;
	f3 = r0; //fitod r0, f3
	f3 = f3*f2;
	r7 = (r7 + 1)&-1;
	f1 = f1-f3;
	r2 = (r2 + -1)&-1;
	r0 = 0;
}
else{
break _46;
}
break;
}
	f3 =                        10;
	f2 = f2/f3;
}
else{
__label__ = 66;
break _32;
}
}
	f0 = f0/f2;
	llvm_writeDouble((i7),f0);
	heap32[(g0+2)] = r1;
	heap32[(g0+3)] = r2;
	heap32[(g0+4)] = r3;
	heap32[(g0+5)] = r4;
	heap32[(g0+6)] = 0;
	__dtostr(i7);
	r0 = r_g0;
	if(r0 ==0) //_LBB136_92
{
__label__ = 83;
}
else{
	r3 = (r0 + r7)&-1;
	r7 = (r3 + 1)&-1;
	if(r2 !=r0) //_LBB136_60
{
	r3 = (r3 + 2)&-1;
	r4 = 101;
	heap8[r7] = r4;
	r7 = r3;
}
	r2 = (r2 + -1)&-1;
	r3 = (r2 - r0)&-1;
_60: do {
	if(r6 <1000) //_LBB136_66
{
	if(r6 <100) //_LBB136_93
{
	if(r6 >9) //_LBB136_95
{
__label__ = 90;
break _60;
}
else{
__label__ = 91;
break _60;
}
}
else{
__label__ = 87;
break _60;
}
}
else{
	if(r2 !=r0) //_LBB136_64
{
	r0 = (r6 / 1000)&-1;
	r2 = (r7 + 1)&-1;
	r0 = (r0 + 48)&-1;
	heap8[r7] = r0;
	r7 = r2;
}
	r3 = (r3 + -1)&-1;
	r6 = (r6 % 1000)&-1;
__label__ = 87;
}
} while(0);
switch(__label__ ){//multiple entries
case 87: 
	if(r3 !=0) //_LBB136_97
{
	r0 = (r6 / 100)&-1;
	r2 = (r7 + 1)&-1;
	r0 = (r0 + 48)&-1;
	heap8[r7] = r0;
	r7 = r2;
}
	r3 = (r3 + -1)&-1;
	r6 = (r6 % 100)&-1;
__label__ = 90;
break;
}
switch(__label__ ){//multiple entries
case 90: 
	if(r3 !=0) //_LBB136_101
{
	r0 = (r6 / 10)&-1;
	r2 = (r7 + 1)&-1;
	r0 = (r0 + 48)&-1;
	heap8[r7] = r0;
	r7 = r2;
}
	r3 = (r3 + -1)&-1;
	r6 = (r6 % 10)&-1;
break;
}
	if(r3 !=0) //_LBB136_68
{
	r0 = (r6 + 48)&-1;
	heap8[r7] = r0;
	if(r3 ==1) //_LBB136_92
{
__label__ = 83;
}
else{
	r7 = (r7 + 1)&-1;
__label__ = 82;
}
}
else{
__label__ = 82;
}
}
}
else{
	f2 =       0.10000000000000001;
__label__ = 66;
}
} while(0);
_81: do {
switch(__label__ ){//multiple entries
case 66: 
	if(r7 ==r1) //_LBB136_75
{
	if(r2 ==0) //_LBB136_92
{
__label__ = 83;
break _81;
}
else{
	r2 = (r2 + -1)&-1;
	r6 = (r7 + 1)&-1;
	r0 = 48;
	heap8[r7] = r0;
	r7 = r6;
}
}
if(!(r4 !=0)) //_LBB136_80
{
	r6 = 1;
	r6 = (r6 - r1)&-1;
	r6 = (r6 + r7)&-1;
if(!(uint(r6) <uint(r3))) //_LBB136_80
{
__label__ = 82;
break _81;
}
}
	if(r2 ==0) //_LBB136_92
{
__label__ = 83;
}
else{
	r6 = (r2 + -1)&-1;
	r0 = (r7 + 1)&-1;
	r2 = 46;
	heap8[r7] = r2;
	if(r5 ==0) //_LBB136_83
{
if(!(r4 !=0)) //_LBB136_85
{
	r3 = (r1 + r3)&-1;
	r3 = (r3 + 1)&-1;
	r4 = (r3 - r0)&-1;
}
}
else{
	r3 = r4 == 0 ? r3 : r4; 
	r3 = (r1 + r3)&-1;
	r3 = (r3 + 1)&-1;
	r4 = (r3 - r0)&-1;
}
	if(uint(r4) >uint(r6)) //_LBB136_92
{
__label__ = 83;
}
else{
	if(r4 !=0) //_LBB136_88
{
	r3 = (r4 + 1)&-1;
	r6 = (r7 + 1)&-1;
	f3 =                        10;
_99: while(true){
	f0 = f1/f2;
	r0 = f0&-1;
	r2 = r0 << 24;
	r2 = r2 >> 24;
	f0 = r2; //fitod r2, f0
	f0 = f0*f2;
	r4 = (r4 + -1)&-1;
	f2 = f2/f3;
	f1 = f1-f0;
	r2 = (r6 + 1)&-1;
	r0 = (r0 + 48)&-1;
	heap8[r6] = r0;
	r6 = r2;
if(!(r4 !=0)) //_LBB136_89
{
break _99;
}
}
	r7 = (r7 + r3)&-1;
__label__ = 82;
}
else{
	r7 = r0;
__label__ = 82;
}
}
}
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 83: 
	r1 = 0;
	r_g0 = r1;
	return;
break;
case 82: 
	r3 = 0;
	heap8[r7] = r3;
	r1 = (r7 - r1)&-1;
	r_g0 = r1;
	return;
break;
}
}
else{
	r3 = 1;
	r5 = (r4 + 2)&-1;
	r4 = r4 == 0 ? r3 : r5; 
	r5 = 8;
	r2 = uint(r4) > uint(r2) ? r5 : r4; 
	if(r2 ==0) //_LBB136_24
{
__label__ = 23;
}
else{
	if(r0 <0) //_LBB136_25
{
	r0 = 45;
	heap8[r1] = r0;
	r0 = r3;
__label__ = 25;
}
else{
__label__ = 23;
}
}
switch(__label__ ){//multiple entries
case 23: 
	r0 = 0;
break;
}
	if(uint(r0) <uint(r2)) //_LBB136_28
{
	r5 = 48;
_115: while(true){
	r4 = (r0 + 1)&-1;
	heap8[r1+r0] = r5;
	r0 = r4;
if(!(r2 !=r4)) //_LBB136_29
{
break _115;
}
}
	r0 = r2;
}
	r2 = 2;
	r4 = heapU8[r1];
	r2 = r4 == 48 ? r3 : r2; 
	r3 = 46;
	r4 = 0;
	heap8[r1+r2] = r3;
	heap8[r1+r0] = r4;
	r_g0 = r0;
	return;
}
break;
case 5: 
	if(r2 >0) //_LBB136_7
{
	r0 = (r2 + -1)&-1;
	r3 = 2;
	r4 = 0;
	r5 = (r2 + 2)&-1;
	r0 = uint(r0) > uint(r3) ? r0 : r3; 
	r3 = (r4 - r2)&-1;
	r0 = (r5 - r0)&-1;
	r4 = _2E_str7651;
	r5 = r1;
_122: while(true){
	r6 = heapU8[r4];
	r0 = (r0 + -1)&-1;
	r7 = (r5 + 1)&-1;
	r4 = (r4 + 1)&-1;
	heap8[r5] = r6;
	r5 = r7;
if(!(r0 !=0)) //_LBB136_8
{
break _122;
}
}
	r0 = -3;
	r4 = 3;
	r0 = uint(r3) > uint(r0) ? r2 : r4; 
}
else{
	r0 = 0;
}
	if(r0 >=r2) //_LBB136_12
{
__label__ = 12;
}
else{
__label__ = 11;
}
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 11: 
	r2 = 0;
	heap8[r1+r0] = r2;
	r0 = (r0 + 1)&-1;
break;
}
	r_g0 = r0;
	return;
}

function write_pad(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	if(r0 >0) //_LBB137_2
{
	r1 = heap32[(fp)];
	r1 = r1 >> 2;
	r2 = heap32[(r1)];
	r2 = (r2 + r0)&-1;
	if(uint(r2) >=uint(r0)) //_LBB137_4
{
	r2 = heap32[(fp+1)];
	r3 = heap32[(fp+3)];
	if(uint(r0) >uint(15)) //_LBB137_6
{
	r4 = 48;
	r4 = r3 == r4;
	r4 = r4 & 1;
	r5 = _ZL8pad_line;
	r4 = r4 << 5;
	r4 = (r5 + r4)&-1;
	r5 = 0;
_7: while(true){
	r6 = r2 >> 2;
	r7 = heap32[(r6+1)];
	r6 = heap32[(r6)];
	heap32[(g0)] = r4;
	heap32[(g0+1)] = 16;
	heap32[(g0+2)] = r6;
	r5 = (r5 + -16)&-1;
	__FUNCTION_TABLE__[(r7)>>2](i7);
	r6 = (r0 + r5)&-1;
if(!(uint(r6) >uint(15))) //_LBB137_7
{
break _7;
}
}
	r0 = 0;
	r4 = (r0 - r5)&-1;
	if(r6 ==0) //_LBB137_10
{
__label__ = 11;
}
else{
	r0 = r6;
__label__ = 10;
}
}
else{
	r4 = 0;
__label__ = 10;
}
switch(__label__ ){//multiple entries
case 10: 
	r5 = 48;
	r2 = r2 >> 2;
	r3 = r3 == r5;
	r3 = r3 & 1;
	r5 = heap32[(r2+1)];
	r2 = heap32[(r2)];
	r6 = _ZL8pad_line;
	r3 = r3 << 5;
	r3 = (r6 + r3)&-1;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r2;
	r4 = (r4 + r0)&-1;
	__FUNCTION_TABLE__[(r5)>>2](i7);
break;
}
	r0 = heap32[(r1)];
	r0 = (r0 + r4)&-1;
	heap32[(r1)] = r0;
	r0 = 0;
}
else{
	r0 = -1;
}
}
else{
	r0 = 0;
}
	r_g0 = r0;
	return;
}

function sgetc(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0)];
	r2 = heapU8[r1];
	r1 = (r1 + 1)&-1;
	heap32[(r0)] = r1;
	if(r2 ==0) //_LBB138_2
{
	r0 = -1;
	r_g0 = r0;
	return;
}
else{
	r_g0 = r2;
	return;
}
}

function sputc(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r0 = r0 >> 2;
	r1 = heap32[(r0)];
	r2 = (r1 + -1)&-1;
	heap32[(r0)] = r2;
	r0 = heapU8[r1+-1];
	r1 = heap32[(fp)];
	r2 = -1;
	r0 = r0 == r1 ? r1 : r2; 
	r_g0 = r0;
	return;
}

function memset(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp)];
if(!(r0 ==0)) //_LBB140_3
{
	r2 = heap32[(fp+1)];
	r3 = r1;
_3: while(true){
	r0 = (r0 + -1)&-1;
	r4 = (r3 + 1)&-1;
	heap8[r3] = r2;
	r3 = r4;
	if(r0 !=0) //_LBB140_2
{
continue _3;
}
else{
break _3;
}
}
}
	r_g0 = r1;
	return;
}

function memcpy(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = heap32[(fp+2)];
	r3 = r1 ^ r0;
	r3 = r3 & 3;
_1: do {
	if(r3 !=0) //_LBB141_2
{
__label__ = 2;
}
else{
	if(uint(r2) >uint(4)) //_LBB141_3
{
	r3 = r0 & 3;
	if(r3 !=0) //_LBB141_5
{
	r3 = (r3 + -5)&-1;
	r4 = r2 ^ -1;
	r3 = uint(r3) < uint(r4) ? r4 : r3; 
	r4 = (r3 + r2)&-1;
	r3 = r3 ^ -1;
	r4 = (r4 + 1)&-1;
	r6 = (r1 + r3)&-1;
	r5 = (r0 + r3)&-1;
	r3 = r0 | -4;
	r7 = r0;
_6: while(true){
	if(r3 ==0) //_LBB141_9
{
break _6;
}
else{
	if(r2 ==0) //_LBB141_20
{
__label__ = 19;
break _1;
}
else{
	r8 = heapU8[r1];
	r2 = (r2 + -1)&-1;
	r3 = (r3 + 1)&-1;
	r1 = (r1 + 1)&-1;
	r9 = (r7 + 1)&-1;
	heap8[r7] = r8;
	r7 = r9;
}
}
}
	if(r4 ==-1) //_LBB141_20
{
__label__ = 19;
break _1;
}
else{
	r2 = r4;
	r1 = r6;
}
}
else{
	r5 = r0;
}
	if(uint(r2) >uint(3)) //_LBB141_13
{
	r6 = r5;
	r4 = r1;
_16: while(true){
	r7 = r4 >> 2;
	r2 = (r2 + -4)&-1;
	r4 = (r4 + 4)&-1;
	r3 = (r6 + 4)&-1;
	r6 = r6 >> 2;
	r7 = heap32[(r7)];
	heap32[(r6)] = r7;
	r6 = r3;
	if(uint(r2) >uint(3)) //_LBB141_14
{
continue _16;
}
else{
__label__ = 15;
break _1;
}
}
}
else{
	r4 = r1;
	r3 = r5;
__label__ = 15;
}
}
else{
__label__ = 2;
}
}
} while(0);
switch(__label__ ){//multiple entries
case 2: 
	r3 = 0;
	r4 = r3;
	r5 = r0;
__label__ = 15;
break;
}
_21: do {
switch(__label__ ){//multiple entries
case 15: 
if(!(r2 ==0)) //_LBB141_20
{
	if(r3 !=0) //_LBB141_18
{
	r1 = r4;
	r5 = r3;
}
_26: while(true){
	r3 = heapU8[r1];
	r2 = (r2 + -1)&-1;
	r4 = (r5 + 1)&-1;
	r1 = (r1 + 1)&-1;
	heap8[r5] = r3;
	r5 = r4;
	if(r2 !=0) //_LBB141_19
{
continue _26;
}
else{
break _21;
}
}
}
break;
}
} while(0);
	r_g0 = r0;
	return;
}

function swrite(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+1)];
	r2 = heap32[(r0+2)];
	r3 = heap32[(fp+1)];
if(!(r2 ==r1)) //_LBB142_5
{
	r2 = (r2 - r1)&-1;
	r4 = heap32[(r0)];
	r2 = uint(r2) < uint(r3) ? r2 : r3; 
	if(r4 !=0) //_LBB142_3
{
	r5 = heap32[(fp)];
	r1 = (r4 + r1)&-1;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r2;
	memcpy(i7);
	r1 = heap32[(r0+1)];
	r4 = heap32[(r0)];
	r1 = (r1 + r2)&-1;
	r5 = 0;
	heap8[r4+r1] = r5;
	r1 = heap32[(r0+1)];
}
	r1 = (r1 + r2)&-1;
	heap32[(r0+1)] = r1;
}
	r_g0 = r3;
	return;
}

function __sync_fetch_and_add_4(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(fp+1)];
	r2 = heap32[(r0)];
	r1 = (r2 + r1)&-1;
	heap32[(r0)] = r1;
	r_g0 = r2;
	return;
}

function __muldi3(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = heap32[(fp)];
	r2 = heap32[(fp+2)];
	r3 = heap32[(fp+3)];
	if(r0 <0) //_LBB144_2
{
	r5 = 0;
	r4 = 1;
	r0 = (r5 - r0)&-1;
	r6 = r1 != 0 ? r4 : r5; 
	r1 = (r5 - r1)&-1;
	r0 = (r0 - r6)&-1;
}
else{
	r4 = 0;
}
	if(r3 <0) //_LBB144_5
{
	r5 = 0;
	r6 = 1;
	r3 = (r5 - r3)&-1;
	r6 = r2 != 0 ? r6 : r5; 
	r4 = r4 ^ 1;
	r2 = (r5 - r2)&-1;
	r3 = (r3 - r6)&-1;
}
	r5 = r2 & 65535;
	r6 = r1 & 65535;
	r7 = r3 | r0;
	r8 = (r5 * r6)&-1;
	r9 = r2 | r1;
	r9 = r9 >>> 16;
	if(r9 !=0) //_LBB144_8
{
	r9 = r1 >>> 16;
	r10 = r2 >>> 16;
	r11 = (r10 - r5)&-1;
	r12 = (r5 - r10)&-1;
	r13 = (r6 - r9)&-1;
	r14 = (r9 - r6)&-1;
	r15 = (r10 * r9)&-1;
	r11 = uint(r5) < uint(r10) ? r11 : r12; 
	r12 = uint(r9) < uint(r6) ? r13 : r14; 
	r11 = (r11 * r12)&-1;
	r12 = r15 >>> 16;
	r12 = (r12 + r15)&-1;
	r13 = r15 << 16;
	r14 = r11 << 16;
	r6 = uint(r9) < uint(r6);
	r5 = uint(r5) < uint(r10);
	r5 = r6 ^ r5;
	r5 = r5 & 1;
	if(r5 ==0) //_LBB144_10
{
	r5 = (r14 + r13)&-1;
	r6 = uint(r5) < uint(r13);
	r11 = r11 >>> 16;
	r11 = (r11 + r12)&-1;
	r6 = r6 & 1;
	r11 = (r11 + r6)&-1;
}
else{
	r5 = (r13 - r14)&-1;
	r11 = r11 >>> 16;
	r14 = -1;
	r6 = 0;
	r11 = (r12 - r11)&-1;
	r12 = uint(r5) > uint(r13) ? r14 : r6; 
	r11 = (r11 + r12)&-1;
}
	r6 = r8 << 16;
	r6 = (r5 + r6)&-1;
	r9 = (r6 + r8)&-1;
	r5 = uint(r6) < uint(r5);
	r6 = r8 >>> 16;
	r8 = uint(r9) < uint(r8);
	r6 = (r11 + r6)&-1;
	r5 = r5 & 1;
	r5 = (r6 + r5)&-1;
	r8 = r8 & 1;
	r5 = (r5 + r8)&-1;
	r8 = r9;
}
else{
	r5 = 0;
}
	if(r7 !=0) //_LBB144_14
{
	r6 = (r3 - r2)&-1;
	r7 = (r2 - r3)&-1;
	r9 = (r1 - r0)&-1;
	r10 = (r0 - r1)&-1;
	r6 = uint(r2) < uint(r3) ? r6 : r7; 
	r7 = uint(r0) < uint(r1) ? r9 : r10; 
	r1 = uint(r0) < uint(r1);
	r2 = uint(r2) < uint(r3);
	r9 = 0;
	r6 = (r6 * r7)&-1;
	r1 = r1 ^ r2;
	r2 = (r9 - r6)&-1;
	r1 = r1 != 0 ? r2 : r6; 
	r0 = (r3 * r0)&-1;
	r0 = (r1 + r0)&-1;
	r0 = (r0 + r8)&-1;
	r5 = (r0 + r5)&-1;
}
	r0 = 0;
	r1 = 1;
	r2 = (r0 - r5)&-1;
	r1 = r8 != 0 ? r1 : r0; 
	r0 = (r0 - r8)&-1;
	r1 = (r2 - r1)&-1;
	r0 = r4 == 0 ? r8 : r0; 
	r1 = r4 == 0 ? r5 : r1; 
	r_g0 = r0;
	r_g1 = r1;
	return;
}

function __fixdfdi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = sp + 0; 
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	r1 = r0 >>> 20;
	r1 = r1 & 2047;
	r2 = (r1 + -1023)&-1;
	if(r2 <0) //_LBB145_5
{
	r0 = 0;
	r_g0 = r0;
	r_g1 = r0;
	return;
}
else{
	r3 = heap32[(fp)];
	r4 = r0 & 1048575;
	r0 = r0 >> 31;
	r4 = r4 | 1048576;
	if(r2 <53) //_LBB145_3
{
	r2 = 1075;
	r1 = (r2 - r1)&-1;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r1;
	__lshrdi3(i7);
	r1 = r_g0;
	r3 = r_g1;
}
else{
	r1 = (r1 + -1075)&-1;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r1;
	__ashldi3(i7);
	r1 = r_g0;
	r3 = r_g1;
}
	r2 = r3 ^ r0;
	r1 = r1 ^ r0;
	r3 = 1;
	r4 = 0;
	r2 = (r2 - r0)&-1;
	r3 = uint(r1) < uint(r0) ? r3 : r4; 
	r0 = (r1 - r0)&-1;
	r1 = (r2 - r3)&-1;
	r_g0 = r0;
	r_g1 = r1;
	return;
}
}

function __floatdidf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var f0;
	var f1;
	var f2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = heap32[(fp)];
	f0 = r0; //fitod r0, f0
	f1 =                4294967296;
	f2 = uint(r1); //fuitod r1, f2
	f0 = f0*f1;
	f0 = f2+f0;
	f_g0 = f0;
	return;
}

function __lshrdi3(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp+1)];
	r2 = r0 & 32;
	if(r2 ==0) //_LBB147_2
{
	r2 = heap32[(fp)];
if(!(r0 ==0)) //_LBB147_4
{
	r3 = 32;
	r3 = (r3 - r0)&-1;
	r3 = r1 << r3;
	r2 = r2 >>> r0;
	r2 = r3 | r2;
	r1 = r1 >>> r0;
}
	r_g0 = r2;
	r_g1 = r1;
	return;
}
else{
	r0 = (r0 + -32)&-1;
	r0 = r1 >>> r0;
	r1 = 0;
	r_g0 = r0;
	r_g1 = r1;
	return;
}
}

function __ashldi3(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp)];
	r2 = r0 & 32;
	if(r2 ==0) //_LBB148_2
{
	r2 = heap32[(fp+1)];
if(!(r0 ==0)) //_LBB148_4
{
	r3 = 32;
	r3 = (r3 - r0)&-1;
	r2 = r2 << r0;
	r3 = r1 >>> r3;
	r1 = r1 << r0;
	r2 = r2 | r3;
}
	r_g0 = r1;
	r_g1 = r2;
	return;
}
else{
	r0 = (r0 + -32)&-1;
	r2 = 0;
	r0 = r1 << r0;
	r_g0 = r2;
	r_g1 = r0;
	return;
}
}

function __ashrdi3(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp+1)];
	r2 = r0 & 32;
	if(r2 ==0) //_LBB149_2
{
	r2 = heap32[(fp)];
if(!(r0 ==0)) //_LBB149_4
{
	r3 = 32;
	r3 = (r3 - r0)&-1;
	r3 = r1 << r3;
	r2 = r2 >>> r0;
	r2 = r3 | r2;
	r1 = r1 >> r0;
}
	r_g0 = r2;
	r_g1 = r1;
	return;
}
else{
	r0 = (r0 + -32)&-1;
	r0 = r1 >> r0;
	r1 = r1 >> 31;
	r_g0 = r0;
	r_g1 = r1;
	return;
}
}

function __fixunssfdi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >>> 23;
	r1 = r1 & 255;
	r2 = (r1 + -127)&-1;
if(!(r2 <0)) //_LBB150_5
{
if(!(r0 <0)) //_LBB150_5
{
	r0 = r0 & 8388607;
	r0 = r0 | 8388608;
	r3 = 0;
	if(r2 <24) //_LBB150_4
{
	r2 = 150;
	r1 = (r2 - r1)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r1;
	__lshrdi3(i7);
	return;
}
else{
	r1 = (r1 + -150)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r1;
	__ashldi3(i7);
	return;
}
}
}
	r0 = 0;
	r_g0 = r0;
	r_g1 = r0;
	return;
}

function _ZNK14CFileInterface12IsFileSystemEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZN11CFileStdout5freadEPvjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = -1;
	r_g0 = r0;
	return;
}

function _ZN11CFileStdout5ftellEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZN11CFileStdout4feofEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZN11CFileStdout5fseekEli(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZN11CFileStdout6ungetcEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZN11CFileStdout6fflushEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZN11CFileStdout6fcloseEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZNK11CFileSystem12IsFileSystemEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 1;
	r_g0 = r0;
	return;
}

function _ZN11CFileSystem5freadEPvjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	r1 = heap32[(fp+1)];
	r2 = heap32[(fp+2)];
	r3 = heap32[(fp+3)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = r0;
	mandreel_fread(i7);
	return;
}

function _ZN11CFileSystem6fwriteEPKvjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = -1;
	r_g0 = r0;
	return;
}

function _ZN11CFileSystem6fflushEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZN11CFileSystem6fcloseEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	heap32[(g0)] = r0;
	mandreel_fclose(i7);
	return;
}

function _ZN11CFileSystem5ftellEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	heap32[(g0)] = r0;
	mandreel_ftell(i7);
	return;
}

function _ZN11CFileSystem4feofEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	heap32[(g0)] = r0;
	mandreel_feof(i7);
	return;
}

function _ZN11CFileSystem5fseekEli(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	r1 = heap32[(fp+1)];
	r2 = heap32[(fp+2)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r2;
	mandreel_fseek(i7);
	return;
}

function _ZN11CFileSystem6ungetcEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	r1 = heap32[(fp+1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	mandreel_ungetc(i7);
	return;
}

function _ZN7CFileLS5freadEPvjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(fp+2)];
	r2 = heap32[(fp+3)];
	r3 = heap32[(r0+4)];
	r4 = heap32[(r0+2)];
	r2 = (r2 * r1)&-1;
	r5 = (r3 + r2)&-1;
	r6 = (r4 - r3)&-1;
	r2 = r5 > r4 ? r6 : r2; 
	if(r2 <0) //_LBB168_2
{
	r0 = -1;
	r_g0 = r0;
	return;
}
else{
	r4 = heap32[(fp+1)];
	r5 = heap32[(r0+6)];
	r3 = (r5 + r3)&-1;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r2;
	memcpy(i7);
	r3 = heap32[(r0+4)];
	r3 = (r3 + r2)&-1;
	heap32[(r0+4)] = r3;
	r0 = Math.floor(uint(r2) /uint(r1));
	r_g0 = r0;
	return;
}
}

function _ZN7CFileLS5ftellEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+4)];
	r_g0 = r0;
	return;
}

function _ZN7CFileLS4feofEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+4)];
	r0 = heap32[(r0+2)];
	r0 = r1 >= r0;
	r0 = r0 & 1;
	r_g0 = r0;
	return;
}

function _ZN7CFileLS5fseekEli(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp)];
	r2 = heap32[(fp+1)];
_1: do {
	if(r0 ==0) //_LBB171_4
{
	r1 = r1 >> 2;
}
else{
	if(r0 ==1) //_LBB171_6
{
	r0 = r1 >> 2;
	r1 = heap32[(r0+4)];
	r1 = (r1 + r2)&-1;
	heap32[(r0+4)] = r1;
}
else{
if(!(r0 !=2)) //_LBB171_7
{
	r1 = r1 >> 2;
	r0 = heap32[(r1+2)];
	r2 = (r0 + r2)&-1;
break _1;
}
}
	r0 = 0;
	r_g0 = r0;
	return;
}
} while(0);
	heap32[(r1+4)] = r2;
	r1 = 0;
	r_g0 = r1;
	return;
}

function _ZN7CFileLS6ungetcEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = -1;
	r_g0 = r0;
	return;
}

function _ZN10CFileCloud5freadEPvjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(fp+2)];
	r2 = heap32[(fp+3)];
	r3 = heap32[(r0+4)];
	r4 = heap32[(r0+2)];
	r2 = (r2 * r1)&-1;
	r5 = (r3 + r2)&-1;
	r6 = (r4 - r3)&-1;
	r2 = r5 > r4 ? r6 : r2; 
	if(r2 <0) //_LBB173_2
{
	r0 = -1;
	r_g0 = r0;
	return;
}
else{
	r4 = heap32[(fp+1)];
	r5 = heap32[(r0+6)];
	r3 = (r5 + r3)&-1;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r2;
	memcpy(i7);
	r3 = heap32[(r0+4)];
	r3 = (r3 + r2)&-1;
	heap32[(r0+4)] = r3;
	r0 = Math.floor(uint(r2) /uint(r1));
	r_g0 = r0;
	return;
}
}

function _ZN10CFileCloud5ftellEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r0 = heap32[(r0+4)];
	r_g0 = r0;
	return;
}

function _ZN10CFileCloud4feofEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0+4)];
	r0 = heap32[(r0+2)];
	r0 = r1 >= r0;
	r0 = r0 & 1;
	r_g0 = r0;
	return;
}

function _ZN10CFileCloud5fseekEli(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp)];
	r2 = heap32[(fp+1)];
_1: do {
	if(r0 ==0) //_LBB176_4
{
	r1 = r1 >> 2;
}
else{
	if(r0 ==1) //_LBB176_6
{
	r0 = r1 >> 2;
	r1 = heap32[(r0+4)];
	r1 = (r1 + r2)&-1;
	heap32[(r0+4)] = r1;
}
else{
if(!(r0 !=2)) //_LBB176_7
{
	r1 = r1 >> 2;
	r0 = heap32[(r1+2)];
	r2 = (r0 + r2)&-1;
break _1;
}
}
	r0 = 0;
	r_g0 = r0;
	return;
}
} while(0);
	heap32[(r1+4)] = r2;
	r1 = 0;
	r_g0 = r1;
	return;
}

function _ZN10CFileCloud6ungetcEi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = -1;
	r_g0 = r0;
	return;
}

function __fwrite(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp)];
	r2 = heap32[(fp+1)];
if(!(uint(r0) >uint(9))) //_LBB178_2
{
	r0 = _ZL13s_file_stdout;
}
	r3 = r0 >> 2;
	r3 = heap32[(r3)];
	r3 = r3 >> 2;
	r3 = heap32[(r3+2)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 1;
	heap32[(g0+3)] = r2;
	__FUNCTION_TABLE__[(r3)>>2](i7);
	return;
}

function _ZN7CFileLS6fwriteEPKvjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(fp+3)];
	r2 = heap32[(fp+2)];
	r3 = heap32[(fp+1)];
	r2 = (r1 * r2)&-1;
	r4 = heap32[(r0+4)];
	r5 = (r4 + r2)&-1;
	r6 = heap32[(r0+3)];
	if(r5 >r6) //_LBB179_2
{
	r4 = (r2 + r4)&-1;
	r4 = (r4 + 131072)&-1;
	heap32[(r0+3)] = r4;
	r5 = heap32[(r0+6)];
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r4;
	realloc(i7);
	r5 = r_g0;
	heap32[(r0+6)] = r5;
	r4 = heap32[(r0+4)];
}
else{
	r5 = heap32[(r0+6)];
}
	r4 = (r5 + r4)&-1;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r2;
	memcpy(i7);
	r3 = heap32[(r0+4)];
	r2 = (r3 + r2)&-1;
	heap32[(r0+4)] = r2;
	r3 = heap32[(r0+5)];
if(!(r2 <=r3)) //_LBB179_5
{
	heap32[(r0+5)] = r2;
}
	r_g0 = r1;
	return;
}

function _ZN7CFileLS6fflushEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heapU8[r0+5];
if(!(r1 ==0)) //_LBB180_2
{
	r1 = r0 >> 2;
	r2 = heap32[(r1+5)];
	r1 = heap32[(r1+6)];
	r0 = (r0 + 28)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r2;
	mandreel_writels(i7);
}
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZN7CFileLS6fcloseEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heapU8[r0+5];
if(!(r1 ==0)) //_LBB181_2
{
	r1 = r0 >> 2;
	r2 = heap32[(r1+5)];
	r1 = heap32[(r1+6)];
	r3 = (r0 + 28)&-1;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r2;
	mandreel_writels(i7);
}
	r1 = 0;
	r2 = r0 >> 2;
	heap8[r0+4] = r1;
	r0 = heap32[(r2+6)];
	heap32[(g0)] = r0;
	free(i7);
	r_g0 = r1;
	return;
}

function _ZN10CFileCloud6fwriteEPKvjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(fp+3)];
	r2 = heap32[(fp+2)];
	r3 = heap32[(fp+1)];
	r2 = (r1 * r2)&-1;
	r4 = heap32[(r0+4)];
	r5 = (r4 + r2)&-1;
	r6 = heap32[(r0+3)];
	if(r5 >r6) //_LBB182_2
{
	r4 = (r2 + r4)&-1;
	r4 = (r4 + 131072)&-1;
	heap32[(r0+3)] = r4;
	r5 = heap32[(r0+6)];
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r4;
	realloc(i7);
	r5 = r_g0;
	heap32[(r0+6)] = r5;
	r4 = heap32[(r0+4)];
}
else{
	r5 = heap32[(r0+6)];
}
	r4 = (r5 + r4)&-1;
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r2;
	memcpy(i7);
	r3 = heap32[(r0+4)];
	r2 = (r3 + r2)&-1;
	heap32[(r0+4)] = r2;
	r3 = heap32[(r0+5)];
if(!(r2 <=r3)) //_LBB182_5
{
	heap32[(r0+5)] = r2;
}
	r_g0 = r1;
	return;
}

function _ZN10CFileCloud6fflushEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
var __label__ = 0;
	i7 = sp + -32;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heapU8[r0+5];
if(!(r1 ==0)) //_LBB183_2
{
	r1 = r0 >> 2;
	r2 = heap32[(r1+5)];
	r3 = r2 << 1;
	heap32[(g0)] = r3;
	malloc(i7);
	r4 = r_g0;
	r1 = heap32[(r1+6)];
	r5 = sp + -4; 
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r4;
	heap32[(g0+3)] = r3;
	heap32[(g0+4)] = r5;
	_ZN12mandreel_b64L11b64_encode_EPKhjPcjjPNS_6B64_RCE(i7);
	r0 = (r0 + 28)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r_g0;
	mandreel_writecloud(i7);
	heap32[(g0)] = r4;
	free(i7);
}
	r0 = 0;
	r_g0 = r0;
	return;
}

function _ZN10CFileCloud6fcloseEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
var __label__ = 0;
	i7 = sp + -32;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heapU8[r0+5];
if(!(r1 ==0)) //_LBB184_2
{
	r1 = r0 >> 2;
	r2 = heap32[(r1+5)];
	r3 = r2 << 1;
	heap32[(g0)] = r3;
	malloc(i7);
	r4 = r_g0;
	r1 = heap32[(r1+6)];
	r5 = sp + -4; 
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r4;
	heap32[(g0+3)] = r3;
	heap32[(g0+4)] = r5;
	_ZN12mandreel_b64L11b64_encode_EPKhjPcjjPNS_6B64_RCE(i7);
	r2 = (r0 + 28)&-1;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r_g0;
	mandreel_writecloud(i7);
	heap32[(g0)] = r4;
	free(i7);
}
	r1 = 0;
	r2 = r0 >> 2;
	heap8[r0+4] = r1;
	r0 = heap32[(r2+6)];
	heap32[(g0)] = r0;
	free(i7);
	r_g0 = r1;
	return;
}

function __sync_val_compare_and_swap_4(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r0 = r0 >> 2;
	r1 = heap32[(r0)];
	r2 = heap32[(fp+1)];
if(!(r1 !=r2)) //_LBB185_2
{
	r2 = heap32[(fp+2)];
	heap32[(r0)] = r2;
}
	r_g0 = r1;
	return;
}

function _ZN11CFileStdout6fwriteEPKvjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16392;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp+3)];
	r0 = (r1 * r0)&-1;
	if(r0 !=0) //_LBB186_2
{
	r2 = heap32[(fp+1)];
	r3 = sp + -16384; 
	r4 = r0;
_3: while(true){
	r5 = heapU8[r2];
	r4 = (r4 + -1)&-1;
	r2 = (r2 + 1)&-1;
	r6 = (r3 + 1)&-1;
	heap8[r3] = r5;
	r3 = r6;
if(!(r4 !=0)) //_LBB186_3
{
break _3;
}
}
	r2 = sp + -16384; 
	r0 = (r2 + r0)&-1;
}
else{
	r0 = sp + -16384; 
}
	r2 = 0;
	heap8[r0] = r2;
	r0 = sp + -16384; 
	heap32[(g0)] = r0;
	puts(i7);
	r_g0 = r1;
	return;
}

function fopen(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = _2E_str33676;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 4;
	r1 = heap32[(fp+1)];
	strncmp(i7);
	r2 = r_g0;
_1: do {
	if(r2 ==0) //_LBB187_2
{
__label__ = 2;
}
else{
	r2 = _2E_str34677;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = 4;
	strncmp(i7);
	r2 = r_g0;
	if(r2 !=0) //_LBB187_17
{
	r2 = _2E_str35678;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = 4;
	strncmp(i7);
	r2 = r_g0;
if(!(r2 ==0)) //_LBB187_19
{
	r2 = _2E_str36679;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = 4;
	strncmp(i7);
	r2 = r_g0;
	if(r2 !=0) //_LBB187_33
{
	r2 = heapU8[r0];
_7: do {
	if(r2 ==92) //_LBB187_39
{
__label__ = 39;
}
else{
	if(r2 ==47) //_LBB187_39
{
__label__ = 39;
}
else{
_10: do {
if(!(r2 !=46)) //_LBB187_40
{
	r2 = heapU8[r0+1];
if(!(r2 ==47)) //_LBB187_38
{
	if(r2 !=92) //_LBB187_40
{
break _10;
}
}
	r0 = (r0 + 2)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	mandreel_fopen(i7);
	r0 = r_g0;
__label__ = 41;
break _7;
}
} while(0);
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	mandreel_fopen(i7);
	r0 = r_g0;
__label__ = 41;
}
}
} while(0);
switch(__label__ ){//multiple entries
case 39: 
	r0 = (r0 + 1)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	mandreel_fopen(i7);
	r0 = r_g0;
break;
}
	if(r0 ==0) //_LBB187_16
{
__label__ = 16;
break _1;
}
else{
	heap32[(g0)] = 8;
	r1 = _ZTV11CFileSystem;
	_Znwj(i7);
	r3 = r_g0 >> 2;
	r1 = (r1 + 8)&-1;
	heap32[(r3)] = r1;
	heap32[(r3+1)] = r0;
	return;
}
}
}
	r2 = _2E_str31674;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	r2 = r_g0;
_21: do {
	if(r2 !=0) //_LBB187_21
{
	r2 = _2E_str4648;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	r2 = r_g0;
	if(r2 ==0) //_LBB187_20
{
__label__ = 20;
}
else{
	r2 = _2E_str5649;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	r2 = r_g0;
	if(r2 !=0) //_LBB187_24
{
	r2 = _2E_str32675;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	r2 = r_g0;
if(!(r2 ==0)) //_LBB187_23
{
	r3 = heapU8[r1];
	r1 = 119;
	r2 = 114;
	r1 = r3 == r1;
	r4 = r3 == r2;
	r2 = r1 & 1;
	r1 = r4 & 1;
	if(r3 ==114) //_LBB187_27
{
__label__ = 27;
break _21;
}
else{
	r3 = 0;
__label__ = 28;
break _21;
}
}
}
	r1 = 1;
	r3 = 0;
	r2 = r1;
__label__ = 28;
}
}
else{
__label__ = 20;
}
} while(0);
switch(__label__ ){//multiple entries
case 20: 
	r1 = 1;
	r2 = r1;
__label__ = 27;
break;
}
switch(__label__ ){//multiple entries
case 27: 
	heap32[(g0)] = r0;
	mandreel_opencloud(i7);
	r3 = r_g0;
	if(r3 ==-1) //_LBB187_16
{
__label__ = 16;
break _1;
}
break;
}
	heap32[(g0)] = 284;
	_Znwj(i7);
	r4 = r_g0;
	r5 = _ZTV10CFileCloud;
	r6 = r4 >> 2;
	r5 = (r5 + 8)&-1;
	r7 = 1;
	heap32[(r6)] = r5;
	heap8[r4+4] = r7;
	heap32[(r6+4)] = 0;
	heap32[(r6+6)] = 0;
	heap32[(r6+2)] = r3;
	heap8[r4+5] = r2;
	heap8[r4+6] = r1;
	heap32[(r6+5)] = 0;
	r1 = (r4 + 28)&-1;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	strcpy(i7);
	if(r3 ==0) //_LBB187_30
{
	r0 = r2 & 255;
if(!(r0 ==0)) //_LBB187_32
{
	r0 = r4 >> 2;
	heap32[(r0+3)] = 131072;
	heap32[(g0)] = 131072;
	malloc(i7);
	heap32[(r0+6)] = r_g0;
}
}
else{
	r0 = (r3 + 131072)&-1;
	r2 = r4 >> 2;
	heap32[(r2+3)] = r0;
	heap32[(g0)] = r0;
	malloc(i7);
	heap32[(r2+6)] = r_g0;
	r0 = (r3 + 4)&-1;
	heap32[(g0)] = r0;
	malloc(i7);
	r0 = r_g0;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r3;
	mandreel_readcloud(i7);
	r1 = heap32[(r2+3)];
	r5 = heap32[(r2+6)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r5;
	heap32[(g0+3)] = r1;
	_ZN12mandreel_b6410b64_decodeEPKcjPvj(i7);
	r1 = r_g0;
	heap32[(g0)] = r0;
	free(i7);
	heap32[(r2+2)] = r1;
	heap32[(r2+5)] = r1;
}
	r_g0 = r4;
	return;
}
else{
__label__ = 2;
}
}
} while(0);
_39: do {
switch(__label__ ){//multiple entries
case 2: 
	r2 = _2E_str31674;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	r2 = r_g0;
_41: do {
	if(r2 !=0) //_LBB187_4
{
	r2 = _2E_str4648;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	r2 = r_g0;
	if(r2 ==0) //_LBB187_3
{
__label__ = 3;
}
else{
	r2 = _2E_str5649;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	r2 = r_g0;
	if(r2 !=0) //_LBB187_7
{
	r2 = _2E_str32675;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	r2 = r_g0;
if(!(r2 ==0)) //_LBB187_6
{
	r3 = heapU8[r1];
	r1 = 119;
	r2 = 114;
	r1 = r3 == r1;
	r4 = r3 == r2;
	r2 = r1 & 1;
	r1 = r4 & 1;
	if(r3 ==114) //_LBB187_10
{
__label__ = 10;
break _41;
}
else{
	r3 = 0;
__label__ = 11;
break _41;
}
}
}
	r1 = 1;
	r3 = 0;
	r2 = r1;
__label__ = 11;
}
}
else{
__label__ = 3;
}
} while(0);
switch(__label__ ){//multiple entries
case 3: 
	r1 = 1;
	r2 = r1;
__label__ = 10;
break;
}
switch(__label__ ){//multiple entries
case 10: 
	heap32[(g0)] = r0;
	mandreel_openls(i7);
	r3 = r_g0;
	if(r3 ==-1) //_LBB187_16
{
break _39;
}
break;
}
	heap32[(g0)] = 284;
	_Znwj(i7);
	r4 = r_g0;
	r5 = _ZTV7CFileLS;
	r6 = r4 >> 2;
	r5 = (r5 + 8)&-1;
	r7 = 1;
	heap32[(r6)] = r5;
	heap8[r4+4] = r7;
	heap32[(r6+4)] = 0;
	heap32[(r6+6)] = 0;
	heap32[(r6+2)] = r3;
	heap8[r4+5] = r2;
	heap8[r4+6] = r1;
	heap32[(r6+5)] = 0;
	r1 = (r4 + 28)&-1;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	strcpy(i7);
	if(r3 ==0) //_LBB187_13
{
	r0 = r2 & 255;
if(!(r0 ==0)) //_LBB187_15
{
	r0 = r4 >> 2;
	heap32[(r0+3)] = 131072;
	heap32[(g0)] = 131072;
	malloc(i7);
	heap32[(r0+6)] = r_g0;
}
}
else{
	r0 = (r3 + 131072)&-1;
	r2 = r4 >> 2;
	heap32[(r2+3)] = r0;
	heap32[(g0)] = r0;
	malloc(i7);
	heap32[(r2+6)] = r_g0;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r_g0;
	heap32[(g0+2)] = r3;
	mandreel_readls(i7);
	heap32[(r2+5)] = r3;
}
	r_g0 = r4;
	return;
break;
}
} while(0);
	r0 = 0;
	r_g0 = r0;
	return;
}

function strtoul(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap8[r0];
	r2 = r1 << 2;
	r3 = my_ctype;
	r2 = (r2 + r3)&-1;
	r4 = heap32[(fp+1)];
	r2 = heapU8[r2+4];
	r2 = r2 & 8;
	if(r2 ==0) //_LBB188_2
{
	r2 = r0;
}
else{
	r2 = r0;
_4: while(true){
	r1 = heap8[r2+1];
	r5 = r1 << 2;
	r5 = (r5 + r3)&-1;
	r2 = (r2 + 1)&-1;
	r5 = heapU8[r5+4];
	r5 = r5 & 8;
	if(r5 !=0) //_LBB188_3
{
continue _4;
}
else{
break _4;
}
}
}
	r1 = r1 & 255;
	if(r1 ==43) //_LBB188_8
{
	r2 = (r2 + 1)&-1;
	r1 = 0;
}
else{
	if(r1 ==45) //_LBB188_7
{
	r2 = (r2 + 1)&-1;
	r1 = 1;
}
else{
	r1 = 0;
}
}
	r3 = 0;
	r5 = r3;
	r6 = r3;
	r11 = -1;
_14: while(true){
	r8 = (r2 - r3)&-1;
	r7 = heapU8[r8];
	if(r7 ==0) //_LBB188_14
{
break _14;
}
else{
	if(uint(r7) <uint(65)) //_LBB188_10
{
	r9 = r7 & 255;
	r10 = 58;
	r7 = (r7 + -48)&-1;
	r7 = uint(r9) < uint(r10) ? r7 : r11; 
	r7 = r7 & 255;
	if(uint(r7) >uint(9)) //_LBB188_14
{
break _14;
}
else{
	r8 = r6 & 255;
	r8 = (r8 * 10)&-1;
	r7 = (r7 + r8)&-1;
	r6 = r6 >>> 8;
	r8 = r7 >>> 8;
	r6 = (r6 * 10)&-1;
	r6 = (r8 + r6)&-1;
	r8 = 16777215;
	r9 = 1;
	r10 = r6 << 8;
	r7 = r7 & 255;
	r5 = uint(r6) > uint(r8) ? r9 : r5; 
	r6 = r10 | r7;
	r3 = (r3 + -1)&-1;
continue _14;
}
}
else{
break _14;
}
}
}
	if(r3 ==0) //_LBB188_16
{
	_errno(i7);
	r6 = 0;
	r8 = r_g0 >> 2;
	heap32[(r8)] = 22;
	r8 = r0;
}
if(!(r4 ==0)) //_LBB188_19
{
	r0 = r4 >> 2;
	heap32[(r0)] = r8;
}
	if(r5 ==0) //_LBB188_21
{
	r0 = 0;
	r0 = (r0 - r6)&-1;
	r0 = r1 == 0 ? r6 : r0; 
	r_g0 = r0;
	return;
}
else{
	_errno(i7);
	r1 = r_g0 >> 2;
	heap32[(r1)] = 34;
	r1 = -1;
	r_g0 = r1;
	return;
}
}

function strtol(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap8[r0];
	r2 = r1 << 2;
	r3 = my_ctype;
	r2 = (r2 + r3)&-1;
	r4 = heap32[(fp+1)];
	r2 = heapU8[r2+4];
	r2 = r2 & 8;
	if(r2 ==0) //_LBB189_2
{
	r2 = r0;
}
else{
	r2 = r0;
_4: while(true){
	r1 = heap8[r2+1];
	r5 = r1 << 2;
	r5 = (r5 + r3)&-1;
	r2 = (r2 + 1)&-1;
	r5 = heapU8[r5+4];
	r5 = r5 & 8;
	if(r5 !=0) //_LBB189_3
{
continue _4;
}
else{
break _4;
}
}
}
	r1 = r1 & 255;
	if(r1 ==45) //_LBB189_6
{
	r1 = heap8[r2+1];
	r1 = r1 << 2;
	r3 = (r1 + r3)&-1;
	r3 = heapU16[(r3+4)>>1];
	r3 = r3 & 263;
	if(r3 ==0) //_LBB189_5
{
__label__ = 5;
}
else{
	r2 = (r2 + 1)&-1;
	r3 = -1;
__label__ = 8;
}
}
else{
__label__ = 5;
}
switch(__label__ ){//multiple entries
case 5: 
	r3 = 0;
break;
}
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r4;
	strtoul(i7);
	r1 = r_g0;
if(!(r4 ==0)) //_LBB189_11
{
	r4 = r4 >> 2;
	r5 = heap32[(r4)];
if(!(r5 !=r2)) //_LBB189_11
{
	heap32[(r4)] = r0;
}
}
	if(r1 >-1) //_LBB189_16
{
	r0 = 0;
	r0 = (r0 - r1)&-1;
	r0 = r3 == 0 ? r1 : r0; 
	r_g0 = r0;
	return;
}
else{
	_errno(i7);
	r0 = r_g0;
if(!(r1 !=-2147483648)) //_LBB189_15
{
if(!(r3 ==0)) //_LBB189_15
{
	r0 = r0 >> 2;
	heap32[(r0)] = 0;
	r_g0 = r1;
	return;
}
}
	r1 = r0 >> 2;
	r0 = 2147483647;
	r2 = -2147483648;
	heap32[(r1)] = 34;
	r1 = r3 == 0 ? r0 : r2; 
	r_g0 = r1;
	return;
}
}

function __floatundidf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var f0;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = r0 | r1;
	if(r2 ==0) //_LBB190_12
{
	f0 =                         0;
	f_g0 = f0;
	return;
}
else{
	r2 = r0 >>> 1;
	r3 = r1 >>> 1;
	r2 = r0 | r2;
	r3 = r1 | r3;
	r4 = r2 >>> 2;
	r5 = r3 >>> 2;
	r2 = r2 | r4;
	r3 = r3 | r5;
	r4 = r2 >>> 4;
	r5 = r3 >>> 4;
	r2 = r2 | r4;
	r3 = r3 | r5;
	r4 = r2 >>> 8;
	r5 = r3 >>> 8;
	r2 = r2 | r4;
	r3 = r3 | r5;
	r4 = r2 >>> 16;
	r5 = r3 >>> 16;
	r2 = r2 | r4;
	r3 = r3 | r5;
	r4 = r2 ^ -1;
	r5 = 1431655765;
	r6 = r3 ^ -1;
	r4 = r4 >>> 1;
	r6 = r6 >>> 1;
	r2 = r5 & (~r2);
	r4 = r4 & 1431655765;
	r2 = (r2 + r4)&-1;
	r3 = r5 & (~r3);
	r4 = r6 & 1431655765;
	r3 = (r3 + r4)&-1;
	r4 = r2 >>> 2;
	r5 = r3 >>> 2;
	r2 = r2 & 858993459;
	r4 = r4 & 858993459;
	r2 = (r2 + r4)&-1;
	r3 = r3 & 858993459;
	r4 = r5 & 858993459;
	r3 = (r3 + r4)&-1;
	r4 = r2 >>> 4;
	r5 = r3 >>> 4;
	r2 = r2 & 252645135;
	r4 = r4 & 252645135;
	r2 = (r2 + r4)&-1;
	r3 = r3 & 252645135;
	r4 = r5 & 252645135;
	r3 = (r3 + r4)&-1;
	r4 = r2 >>> 8;
	r5 = r3 >>> 8;
	r2 = r2 & 16711935;
	r4 = r4 & 16711935;
	r2 = (r2 + r4)&-1;
	r3 = r3 & 16711935;
	r4 = r5 & 16711935;
	r3 = (r3 + r4)&-1;
	r4 = r2 & 65535;
	r2 = r2 >>> 16;
	r2 = (r4 + r2)&-1;
	r4 = r3 & 65535;
	r3 = r3 >>> 16;
	r3 = (r4 + r3)&-1;
	r2 = (r2 + 32)&-1;
	r4 = 64;
	r2 = r1 != 0 ? r3 : r2; 
	r3 = 63;
	r4 = (r4 - r2)&-1;
	r2 = (r3 - r2)&-1;
	if(r4 <54) //_LBB190_10
{
	r3 = 53;
	r3 = (r3 - r4)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r3;
	__ashldi3(i7);
	r3 = r_g0;
	r1 = r_g1;
}
else{
	if(r4 ==54) //_LBB190_5
{
	r1 = r1 << 1;
	r3 = r0 >>> 31;
	r0 = r0 << 1;
	r1 = r1 | r3;
}
else{
	if(r4 !=55) //_LBB190_6
{
	r3 = (r4 + -55)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r3;
	__lshrdi3(i7);
	r3 = r_g0;
	r5 = r_g1;
	r6 = 119;
	r6 = (r6 - r4)&-1;
	heap32[(g0)] = -1;
	heap32[(g0+1)] = -1;
	heap32[(g0+2)] = r6;
	__lshrdi3(i7);
	r0 = r_g0 & r0;
	r1 = r_g1 & r1;
	r0 = r0 | r1;
	r1 = 0;
	r0 = r0 != r1;
	r0 = r0 & 1;
	r0 = r0 | r3;
	r1 = r5;
}
}
	r3 = r0 >>> 2;
	r3 = r3 & 1;
	r0 = r3 | r0;
	r3 = (r0 + 1)&-1;
	r5 = 1;
	r6 = 0;
	r0 = uint(r3) < uint(r0) ? r5 : r6; 
	r0 = r3 == 0 ? r5 : r0; 
	r0 = (r1 + r0)&-1;
	r1 = r0 >>> 2;
	r5 = r1 & 2097152;
	if(r5 !=0) //_LBB190_9
{
	r1 = r3 >>> 3;
	r2 = r0 << 29;
	r3 = r1 | r2;
	r1 = r0 >>> 3;
	r2 = r4;
}
else{
	r3 = r3 >>> 2;
	r0 = r0 << 30;
	r3 = r3 | r0;
}
}
	r0 = r2 << 20;
	r2 = sp + -8; 
	r1 = r1 & 1048575;
	r0 = (r0 + 1072693248)&-1;
	r2 = r2 >> 2;
	r0 = r1 | r0;
	heap32[(fp+-2)] = r3;
	heap32[(r2+1)] = r0;
	f0 = llvm_readDouble((sp+-8));
	f_g0 = f0;
	return;
}
}

function __udivmoddi4(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = heap32[(fp+4)];
	r2 = heap32[(fp)];
	r3 = heap32[(fp+2)];
	r4 = heap32[(fp+3)];
_1: do {
	if(r0 !=0) //_LBB191_10
{
_3: do {
	if(r3 !=0) //_LBB191_27
{
	if(r4 !=0) //_LBB191_34
{
	r5 = r4 >>> 1;
	r6 = r0 >>> 1;
	r5 = r4 | r5;
	r6 = r0 | r6;
	r7 = r5 >>> 2;
	r9 = r6 >>> 2;
	r5 = r5 | r7;
	r6 = r6 | r9;
	r7 = r5 >>> 4;
	r9 = r6 >>> 4;
	r5 = r5 | r7;
	r6 = r6 | r9;
	r7 = r5 >>> 8;
	r9 = r6 >>> 8;
	r5 = r5 | r7;
	r6 = r6 | r9;
	r7 = r5 >>> 16;
	r9 = r6 >>> 16;
	r5 = r5 | r7;
	r6 = r6 | r9;
	r7 = r5 ^ -1;
	r9 = r6 ^ -1;
	r8 = 1431655765;
	r7 = r7 >>> 1;
	r9 = r9 >>> 1;
	r5 = r8 & (~r5);
	r7 = r7 & 1431655765;
	r6 = r8 & (~r6);
	r9 = r9 & 1431655765;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r9)&-1;
	r7 = r5 >>> 2;
	r9 = r6 >>> 2;
	r5 = r5 & 858993459;
	r7 = r7 & 858993459;
	r6 = r6 & 858993459;
	r9 = r9 & 858993459;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r9)&-1;
	r7 = r5 >>> 4;
	r9 = r6 >>> 4;
	r5 = r5 & 252645135;
	r7 = r7 & 252645135;
	r6 = r6 & 252645135;
	r9 = r9 & 252645135;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r9)&-1;
	r7 = r5 >>> 8;
	r9 = r6 >>> 8;
	r5 = r5 & 16711935;
	r7 = r7 & 16711935;
	r6 = r6 & 16711935;
	r9 = r9 & 16711935;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r9)&-1;
	r7 = r5 & 65535;
	r5 = r5 >>> 16;
	r9 = r6 & 65535;
	r6 = r6 >>> 16;
	r5 = (r7 + r5)&-1;
	r6 = (r9 + r6)&-1;
	r5 = (r5 - r6)&-1;
	if(uint(r5) <uint(32)) //_LBB191_37
{
	r6 = 31;
	r7 = (r5 + 1)&-1;
	r9 = (r5 + -31)&-1;
	r5 = (r6 - r5)&-1;
	r6 = r2 >>> r7;
	r8 = r9 >> 31;
	r10 = r0 >>> r7;
	r6 = r6 & r8;
	r0 = r0 << r5;
	r9 = 0;
	r2 = r2 << r5;
	r5 = r6 | r0;
	r6 = r10 & r8;
__label__ = 39;
break _3;
}
else{
	if(r1 ==0) //_LBB191_7
{
__label__ = 7;
break _1;
}
else{
	r5 = r1 >> 2;
	heap32[(r5)] = r2;
	heap32[(r5+1)] = r0;
	r2 = 0;
	r_g0 = r2;
	r_g1 = r2;
	return;
}
}
}
else{
	r5 = (r3 + -1)&-1;
	r6 = r5 & r3;
	if(r6 !=0) //_LBB191_38
{
	r5 = r3 >>> 1;
	r6 = r0 >>> 1;
	r5 = r3 | r5;
	r6 = r0 | r6;
	r7 = r5 >>> 2;
	r9 = r6 >>> 2;
	r5 = r5 | r7;
	r6 = r6 | r9;
	r7 = r5 >>> 4;
	r9 = r6 >>> 4;
	r5 = r5 | r7;
	r6 = r6 | r9;
	r7 = r5 >>> 8;
	r9 = r6 >>> 8;
	r5 = r5 | r7;
	r6 = r6 | r9;
	r7 = r5 >>> 16;
	r9 = r6 >>> 16;
	r5 = r5 | r7;
	r6 = r6 | r9;
	r7 = r5 ^ -1;
	r9 = r6 ^ -1;
	r8 = 1431655765;
	r7 = r7 >>> 1;
	r9 = r9 >>> 1;
	r5 = r8 & (~r5);
	r7 = r7 & 1431655765;
	r6 = r8 & (~r6);
	r9 = r9 & 1431655765;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r9)&-1;
	r7 = r5 >>> 2;
	r9 = r6 >>> 2;
	r5 = r5 & 858993459;
	r7 = r7 & 858993459;
	r6 = r6 & 858993459;
	r9 = r9 & 858993459;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r9)&-1;
	r7 = r5 >>> 4;
	r9 = r6 >>> 4;
	r5 = r5 & 252645135;
	r7 = r7 & 252645135;
	r6 = r6 & 252645135;
	r9 = r9 & 252645135;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r9)&-1;
	r7 = r5 >>> 8;
	r9 = r6 >>> 8;
	r5 = r5 & 16711935;
	r7 = r7 & 16711935;
	r6 = r6 & 16711935;
	r9 = r9 & 16711935;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r9)&-1;
	r7 = r5 & 65535;
	r5 = r5 >>> 16;
	r9 = r6 & 65535;
	r6 = r6 >>> 16;
	r5 = (r7 + r5)&-1;
	r6 = (r9 + r6)&-1;
	r5 = (r5 - r6)&-1;
	r6 = 31;
	r7 = (r5 + 33)&-1;
	r9 = r5 ^ -1;
	r8 = (r5 + 1)&-1;
	r6 = (r6 - r5)&-1;
	r10 = -2;
	r10 = (r10 - r5)&-1;
	r11 = r0 << r6;
	r12 = r2 >>> r8;
	r13 = r2 >>> r7;
	r14 = r0 << r9;
	r11 = r11 | r12;
	r12 = r9 >> 31;
	r9 = r2 << r9;
	r5 = r5 >> 31;
	r13 = r13 | r14;
	r14 = r8 >> 31;
	r8 = r0 >>> r8;
	r10 = r10 >> 31;
	r2 = r2 << r6;
	r0 = r0 >>> r7;
	r6 = r11 & r12;
	r5 = r9 & r5;
	r11 = r13 & r14;
	r8 = r8 & r10;
	r9 = r2 & r12;
	r2 = r6 | r5;
	r5 = r11 | r8;
	r6 = r0 & r14;
	if(r7 ==0) //_LBB191_40
{
	r0 = 0;
	r3 = r0;
__label__ = 42;
break _3;
}
else{
__label__ = 39;
break _3;
}
}
else{
if(!(r1 ==0)) //_LBB191_31
{
	r1 = r1 >> 2;
	r4 = r5 & r2;
	heap32[(r1)] = r4;
	heap32[(r1+1)] = 0;
}
	if(r3 !=1) //_LBB191_33
{
	r1 = r5 & (~r3);
	r3 = r1 >>> 1;
	r1 = r1 & 1431655765;
	r3 = r3 & 1431655765;
	r1 = (r1 + r3)&-1;
	r3 = r1 >>> 2;
	r1 = r1 & 858993459;
	r3 = r3 & 858993459;
	r1 = (r1 + r3)&-1;
	r3 = r1 >>> 4;
	r1 = r1 & 252645135;
	r3 = r3 & 252645135;
	r1 = (r1 + r3)&-1;
	r3 = r1 >>> 8;
	r1 = r1 & 16711935;
	r3 = r3 & 16711935;
	r1 = (r1 + r3)&-1;
	r3 = r1 & 65535;
	r1 = r1 >>> 16;
	r1 = (r3 + r1)&-1;
	r3 = 32;
	r3 = (r3 - r1)&-1;
	r3 = r0 << r3;
	r2 = r2 >>> r1;
	r2 = r3 | r2;
	r0 = r0 >>> r1;
__label__ = 44;
break _1;
}
else{
__label__ = 44;
break _1;
}
}
}
}
else{
	if(r4 !=0) //_LBB191_15
{
	if(r2 !=0) //_LBB191_19
{
	r5 = (r4 + -1)&-1;
	r6 = r5 & r4;
	if(r6 !=0) //_LBB191_23
{
	r5 = r4 >>> 1;
	r6 = r0 >>> 1;
	r5 = r4 | r5;
	r6 = r0 | r6;
	r7 = r5 >>> 2;
	r8 = r6 >>> 2;
	r5 = r5 | r7;
	r6 = r6 | r8;
	r7 = r5 >>> 4;
	r8 = r6 >>> 4;
	r5 = r5 | r7;
	r6 = r6 | r8;
	r7 = r5 >>> 8;
	r8 = r6 >>> 8;
	r5 = r5 | r7;
	r6 = r6 | r8;
	r7 = r5 >>> 16;
	r8 = r6 >>> 16;
	r5 = r5 | r7;
	r6 = r6 | r8;
	r7 = r5 ^ -1;
	r8 = r6 ^ -1;
	r9 = 1431655765;
	r7 = r7 >>> 1;
	r8 = r8 >>> 1;
	r5 = r9 & (~r5);
	r7 = r7 & 1431655765;
	r6 = r9 & (~r6);
	r8 = r8 & 1431655765;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r8)&-1;
	r7 = r5 >>> 2;
	r8 = r6 >>> 2;
	r5 = r5 & 858993459;
	r7 = r7 & 858993459;
	r6 = r6 & 858993459;
	r8 = r8 & 858993459;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r8)&-1;
	r7 = r5 >>> 4;
	r8 = r6 >>> 4;
	r5 = r5 & 252645135;
	r7 = r7 & 252645135;
	r6 = r6 & 252645135;
	r8 = r8 & 252645135;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r8)&-1;
	r7 = r5 >>> 8;
	r8 = r6 >>> 8;
	r5 = r5 & 16711935;
	r7 = r7 & 16711935;
	r6 = r6 & 16711935;
	r8 = r8 & 16711935;
	r5 = (r5 + r7)&-1;
	r6 = (r6 + r8)&-1;
	r7 = r5 & 65535;
	r5 = r5 >>> 16;
	r8 = r6 & 65535;
	r6 = r6 >>> 16;
	r5 = (r7 + r5)&-1;
	r6 = (r8 + r6)&-1;
	r5 = (r5 - r6)&-1;
	if(uint(r5) <uint(31)) //_LBB191_26
{
	r6 = 31;
	r7 = (r5 + 1)&-1;
	r5 = (r6 - r5)&-1;
	r6 = r0 << r5;
	r8 = r2 >>> r7;
	r9 = 0;
	r2 = r2 << r5;
	r5 = r6 | r8;
	r6 = r0 >>> r7;
__label__ = 39;
break _3;
}
else{
	if(r1 ==0) //_LBB191_7
{
__label__ = 7;
break _1;
}
else{
	r1 = r1 >> 2;
	heap32[(r1)] = r2;
	heap32[(r1+1)] = r0;
__label__ = 9;
break _1;
}
}
}
else{
if(!(r1 ==0)) //_LBB191_22
{
	r1 = r1 >> 2;
	r3 = r5 & r0;
	heap32[(r1)] = r2;
	heap32[(r1+1)] = r3;
}
	r1 = (r4 + -1)&-1;
	r1 = r1 & (~r4);
	r2 = r1 >>> 1;
	r1 = r1 & 1431655765;
	r2 = r2 & 1431655765;
	r1 = (r1 + r2)&-1;
	r2 = r1 >>> 2;
	r1 = r1 & 858993459;
	r2 = r2 & 858993459;
	r1 = (r1 + r2)&-1;
	r2 = r1 >>> 4;
	r1 = r1 & 252645135;
	r2 = r2 & 252645135;
	r1 = (r1 + r2)&-1;
	r2 = r1 >>> 8;
	r1 = r1 & 16711935;
	r2 = r2 & 16711935;
	r1 = (r1 + r2)&-1;
	r2 = r1 & 65535;
	r1 = r1 >>> 16;
	r1 = (r2 + r1)&-1;
	r0 = r0 >>> r1;
__label__ = 5;
break _1;
}
}
else{
if(!(r1 ==0)) //_LBB191_18
{
	r1 = r1 >> 2;
	r2 = Math.floor(uint(r0) % uint(r4));
	heap32[(r1)] = 0;
	heap32[(r1+1)] = r2;
}
	r0 = Math.floor(uint(r0) /uint(r4));
__label__ = 5;
break _1;
}
}
else{
if(!(r1 ==0)) //_LBB191_14
{
	r1 = r1 >> 2;
	r2 = Math.floor(uint(r0) % uint(r3));
	heap32[(r1)] = r2;
	heap32[(r1+1)] = 0;
}
	r0 = Math.floor(uint(r0) /uint(r3));
__label__ = 5;
break _1;
}
}
} while(0);
switch(__label__ ){//multiple entries
case 39: 
	r8 = (r3 + -1)&-1;
	r10 = 0;
	r11 = 1;
	r0 = uint(r8) < uint(r3) ? r11 : r10; 
	r0 = r3 != 0 ? r11 : r0; 
	r0 = (r4 + r0)&-1;
	r12 = (r0 + -1)&-1;
	r13 = r10;
_45: while(true){
	r0 = r5 << 1;
	r14 = r2 >>> 31;
	r6 = r6 << 1;
	r5 = r5 >>> 31;
	r14 = r0 | r14;
	r0 = r6 | r5;
	r5 = (r12 - r0)&-1;
	r6 = uint(r8) < uint(r14) ? r11 : r10; 
	r5 = (r5 - r6)&-1;
	r5 = r5 >> 31;
	r6 = r5 & r3;
	r15 = r5 & r4;
	r16 = r9 << 1;
	r2 = r2 << 1;
	r17 = r9 >>> 31;
	r15 = (r0 - r15)&-1;
	r18 = uint(r14) < uint(r6) ? r11 : r10; 
	r7 = (r7 + -1)&-1;
	r0 = r5 & 1;
	r9 = r13 | r16;
	r2 = r2 | r17;
	r5 = (r14 - r6)&-1;
	r6 = (r15 - r18)&-1;
	r13 = r0;
if(!(r7 !=0)) //_LBB191_42
{
break _45;
}
}
	r3 = 0;
break;
}
	r2 = r2 << 1;
	r4 = r9 >>> 31;
	r7 = r9 << 1;
	r4 = r2 | r4;
	r2 = r0 | r7;
	r0 = r3 | r4;
	if(r1 !=0) //_LBB191_46
{
	r1 = r1 >> 2;
	heap32[(r1)] = r5;
	heap32[(r1+1)] = r6;
__label__ = 44;
break _1;
}
else{
__label__ = 44;
break _1;
}
}
else{
	if(r4 !=0) //_LBB191_6
{
	if(r1 !=0) //_LBB191_8
{
	r0 = r1 >> 2;
	heap32[(r0)] = r2;
	heap32[(r0+1)] = 0;
__label__ = 9;
break _1;
}
else{
__label__ = 7;
break _1;
}
}
else{
if(!(r1 ==0)) //_LBB191_4
{
	r0 = r1 >> 2;
	r1 = Math.floor(uint(r2) % uint(r3));
	heap32[(r0)] = r1;
	heap32[(r0+1)] = 0;
}
	r0 = Math.floor(uint(r2) /uint(r3));
__label__ = 5;
}
}
} while(0);
switch(__label__ ){//multiple entries
case 7: 
	r2 = 0;
	r0 = r2;
break;
case 9: 
	r0 = 0;
	r_g0 = r0;
	r_g1 = r0;
	return;
break;
case 5: 
	r1 = 0;
	r_g0 = r0;
	r_g1 = r1;
	return;
break;
}
	r_g0 = r2;
	r_g1 = r0;
	return;
}

function __umoddi3(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -32;var g0 = i7>>2; // save stack
	r0 = sp + -8; 
	r1 = heap32[(fp)];
	r2 = heap32[(fp+1)];
	r3 = heap32[(fp+2)];
	r4 = heap32[(fp+3)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = r4;
	heap32[(g0+4)] = r0;
	__udivmoddi4(i7);
	r0 = r0 >> 2;
	r1 = heap32[(fp+-2)];
	r0 = heap32[(r0+1)];
	r_g0 = r1;
	r_g1 = r0;
	return;
}

function __moddi3(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
var __label__ = 0;
	i7 = sp + -32;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+3)];
	r1 = heap32[(fp+1)];
	r2 = r0 >> 31;
	r3 = heap32[(fp+2)];
	r4 = r1 >> 31;
	r5 = heap32[(fp)];
	r1 = r4 ^ r1;
	r5 = r4 ^ r5;
	r0 = r2 ^ r0;
	r3 = r2 ^ r3;
	r6 = 1;
	r7 = 0;
	r1 = (r1 - r4)&-1;
	r8 = uint(r5) < uint(r4) ? r6 : r7; 
	r0 = (r0 - r2)&-1;
	r9 = uint(r3) < uint(r2) ? r6 : r7; 
	r10 = sp + -8; 
	r5 = (r5 - r4)&-1;
	r1 = (r1 - r8)&-1;
	r2 = (r3 - r2)&-1;
	r0 = (r0 - r9)&-1;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r0;
	heap32[(g0+4)] = r10;
	__udivmoddi4(i7);
	r0 = r10 >> 2;
	r0 = heap32[(r0+1)];
	r1 = heap32[(fp+-2)];
	r1 = r1 ^ r4;
	r0 = r0 ^ r4;
	r0 = (r0 - r4)&-1;
	r2 = uint(r1) < uint(r4) ? r6 : r7; 
	r1 = (r1 - r4)&-1;
	r0 = (r0 - r2)&-1;
	r_g0 = r1;
	r_g1 = r0;
	return;
}

function __divdi3(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+3)];
	r1 = heap32[(fp+1)];
	r2 = r1 >> 31;
	r3 = heap32[(fp)];
	r4 = r0 >> 31;
	r5 = heap32[(fp+2)];
	r6 = r2 ^ r1;
	r3 = r2 ^ r3;
	r7 = r4 ^ r0;
	r5 = r4 ^ r5;
	r8 = 1;
	r9 = 0;
	r6 = (r6 - r2)&-1;
	r10 = uint(r3) < uint(r2) ? r8 : r9; 
	r7 = (r7 - r4)&-1;
	r11 = uint(r5) < uint(r4) ? r8 : r9; 
	r2 = (r3 - r2)&-1;
	r3 = (r6 - r10)&-1;
	r4 = (r5 - r4)&-1;
	r5 = (r7 - r11)&-1;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = r4;
	heap32[(g0+3)] = r5;
	heap32[(g0+4)] = 0;
	r0 = r0 ^ r1;
	__udivmoddi4(i7);
	r0 = r0 >> 31;
	r1 = r_g0 ^ r0;
	r2 = r_g1 ^ r0;
	r2 = (r2 - r0)&-1;
	r3 = uint(r1) < uint(r0) ? r8 : r9; 
	r0 = (r1 - r0)&-1;
	r1 = (r2 - r3)&-1;
	r_g0 = r0;
	r_g1 = r1;
	return;
}

function __udivdi3(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = heap32[(fp+2)];
	r3 = heap32[(fp+3)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r3;
	heap32[(g0+4)] = 0;
	__udivmoddi4(i7);
	return;
}

function sscanf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
	var r20;
	var f0;
	var f1;
	var f2;
	var f3;
var __label__ = 0;
	i7 = sp + -40;var g0 = i7>>2; // save stack
	r0 = (sp + 4)&-1;
	r1 = heap32[(fp)];
	heap32[(fp+-5)] = r0;
	heap32[(fp+-4)] = r1;
	heap32[(fp+-1)] = r0;
	r0 = sp + -16; 
	heap32[(g0)] = r0;
	r1 = 1;
	r2 = 0;
	r3 = _2E_str7391;
	sgetc(i7);
	r4 = r_g0;
	f3 =                        10;
	r20 = 255;
_1: while(true){
	r5 = heapU8[r3];
	if(r5 !=0) //_LBB196_1
{
	r5 = r5 << 24;
	r5 = r5 >> 24;
	r6 = (r3 + 1)&-1;
	if(r5 >31) //_LBB196_4
{
	if(r5 ==32) //_LBB196_7
{
__label__ = 7;
}
else{
	if(r5 ==37) //_LBB196_8
{
	r5 = -1;
	r7 = 0;
	r8 = r7;
	r9 = r7;
	r10 = r7;
	r11 = r7;
_8: while(true){
	r12 = heap8[r6];
if(!(r12 ==110)) //_LBB196_17
{
	if(r4 ==-1) //_LBB196_187
{
__label__ = 168;
break _1;
}
}
	if(r12 >103) //_LBB196_31
{
	if(r12 >111) //_LBB196_38
{
	if(r12 >114) //_LBB196_41
{
__label__ = 40;
break _8;
}
else{
	if(r12 ==112) //_LBB196_59
{
__label__ = 52;
break _8;
}
else{
if(!(r12 ==113)) //_LBB196_45
{
__label__ = 168;
break _1;
}
}
}
}
else{
	if(r12 >107) //_LBB196_35
{
	if(r12 ==108) //_LBB196_55
{
	r3 = 1;
	r10 = r10 & 255;
	r11 = r10 == 0 ? r11 : r3; 
	r6 = (r6 + 1)&-1;
	r10 = r3;
continue _8;
}
else{
__label__ = 35;
break _8;
}
}
else{
	if(r12 ==104) //_LBB196_53
{
	r6 = (r6 + 1)&-1;
	r9 = 1;
continue _8;
}
else{
__label__ = 33;
break _8;
}
}
}
}
else{
	if(r12 >75) //_LBB196_25
{
	if(r12 >98) //_LBB196_28
{
__label__ = 27;
break _8;
}
else{
if(!(r12 ==76)) //_LBB196_45
{
__label__ = 26;
break _8;
}
}
}
else{
	if(r12 >41) //_LBB196_22
{
	if(r12 ==42) //_LBB196_46
{
	r6 = (r6 + 1)&-1;
	r8 = 1;
continue _8;
}
else{
	r5 = (r12 + -48)&-1;
	if(uint(r5) <uint(10)) //_LBB196_57
{
	r5 = sp + -8; 
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r5;
	strtol(i7);
	r5 = r_g0;
	r6 = heap32[(fp+-2)];
	r7 = 1;
continue _8;
}
else{
__label__ = 23;
break _8;
}
}
}
else{
__label__ = 19;
break _8;
}
}
}
	r6 = (r6 + 1)&-1;
	r11 = 1;
}
_36: do {
switch(__label__ ){//multiple entries
case 40: 
	if(r12 ==115) //_LBB196_165
{
	r8 = r8 & 255;
if(!(r8 !=0)) //_LBB196_167
{
	r3 = sp + -4; 
	heap32[(g0)] = r3;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r3 = r_g0 >> 2;
	r3 = heap32[(r3)];
	heap32[(fp+-2)] = r3;
}
	r3 = (r6 + 1)&-1;
	r6 = r4 << 2;
	r7 = my_ctype;
	r6 = (r6 + r7)&-1;
	r6 = heapU8[r6+4];
	r6 = r6 & 8;
_43: do {
	if(r6 ==0) //_LBB196_169
{
	r6 = r4;
}
else{
_45: while(true){
	heap32[(g0)] = r0;
	sgetc(i7);
	r6 = r_g0;
	r4 = r6 << 2;
	r4 = (r4 + r7)&-1;
	r1 = (r1 + 1)&-1;
	r4 = heapU8[r4+4];
	r4 = r4 & 8;
if(!(r4 !=0)) //_LBB196_170
{
break _43;
}
}
}
} while(0);
	r4 = -1;
	if(r6 ==-1) //_LBB196_186
{
continue _1;
}
else{
	r4 = r6;
_49: while(true){
	if(r4 ==-1) //_LBB196_180
{
break _49;
}
else{
	if(r5 ==0) //_LBB196_180
{
break _49;
}
else{
	r6 = r4 << 2;
	r6 = (r6 + r7)&-1;
	r6 = heapU8[r6+4];
	r6 = r6 & 8;
	if(r6 ==0) //_LBB196_173
{
if(!(r8 !=0)) //_LBB196_175
{
	r6 = heap32[(fp+-2)];
	heap8[r6] = r4;
}
	if(r4 ==0) //_LBB196_180
{
break _49;
}
else{
	r4 = heap32[(fp+-2)];
	r4 = (r4 + 1)&-1;
	heap32[(fp+-2)] = r4;
	heap32[(g0)] = r0;
	r1 = (r1 + 1)&-1;
	r5 = (r5 + -1)&-1;
	sgetc(i7);
	r4 = r_g0;
}
}
else{
break _49;
}
}
}
}
	if(r8 !=0) //_LBB196_186
{
continue _1;
}
else{
	r2 = (r2 + 1)&-1;
	r5 = heap32[(fp+-2)];
	r6 = 0;
	heap8[r5] = r6;
continue _1;
}
}
}
else{
	if(r12 ==117) //_LBB196_60
{
__label__ = 53;
break _36;
}
else{
	if(r12 ==120) //_LBB196_59
{
__label__ = 52;
break _36;
}
else{
__label__ = 168;
break _1;
}
}
}
break;
case 35: 
	if(r12 ==110) //_LBB196_182
{
	r3 = (r6 + 1)&-1;
	r5 = r8 & 255;
	if(r5 !=0) //_LBB196_186
{
continue _1;
}
else{
	r5 = sp + -4; 
	heap32[(g0)] = r5;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r5 = r_g0 >> 2;
	r5 = heap32[(r5)];
	r5 = r5 >> 2;
	r6 = (r1 + -1)&-1;
	heap32[(r5)] = r6;
continue _1;
}
}
else{
	if(r12 ==111) //_LBB196_44
{
	r13 = 8;
__label__ = 55;
break _36;
}
else{
__label__ = 168;
break _1;
}
}
break;
case 33: 
	if(r12 ==105) //_LBB196_60
{
__label__ = 53;
break _36;
}
else{
__label__ = 168;
break _1;
}
break;
case 27: 
	if(r12 ==99) //_LBB196_155
{
	r3 = (r6 + 1)&-1;
	r6 = r8 & 255;
	if(r6 ==0) //_LBB196_157
{
	r8 = sp + -4; 
	heap32[(g0)] = r8;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r8 = r_g0 >> 2;
	r8 = heap32[(r8)];
	r2 = (r2 + 1)&-1;
	heap32[(fp+-2)] = r8;
}
	r8 = r7 & 255;
	r7 = 1;
	r5 = r8 == 0 ? r7 : r5; 
	if(r5 ==0) //_LBB196_186
{
continue _1;
}
else{
	if(r4 ==-1) //_LBB196_186
{
continue _1;
}
else{
	r5 = (r5 + -1)&-1;
_77: while(true){
if(!(r6 !=0)) //_LBB196_163
{
	r8 = heap32[(fp+-2)];
	r7 = (r8 + 1)&-1;
	heap8[r8] = r4;
	heap32[(fp+-2)] = r7;
}
	heap32[(g0)] = r0;
	r1 = (r1 + 1)&-1;
	sgetc(i7);
	r4 = r_g0;
	if(r5 ==0) //_LBB196_186
{
continue _1;
}
else{
	r5 = (r5 + -1)&-1;
	if(r4 !=-1) //_LBB196_161
{
continue _77;
}
else{
continue _1;
}
}
}
}
}
}
else{
	if(r12 ==100) //_LBB196_61
{
	r13 = 10;
__label__ = 55;
break _36;
}
else{
	r5 = (r12 + -101)&-1;
	if(uint(r5) <uint(3)) //_LBB196_48
{
__label__ = 46;
break _36;
}
else{
__label__ = 168;
break _1;
}
}
}
break;
case 26: 
	if(r12 ==88) //_LBB196_59
{
__label__ = 52;
break _36;
}
else{
__label__ = 168;
break _1;
}
break;
case 23: 
	if(r12 ==69) //_LBB196_48
{
__label__ = 46;
break _36;
}
else{
__label__ = 168;
break _1;
}
break;
case 19: 
	if(r12 ==0) //_LBB196_6
{
__label__ = 6;
break _1;
}
else{
	if(r12 ==37) //_LBB196_51
{
	r5 = r4 & 255;
	if(r5 !=r12) //_LBB196_187
{
__label__ = 168;
break _1;
}
else{
	heap32[(g0)] = r0;
	r1 = (r1 + 1)&-1;
	r3 = (r6 + 1)&-1;
	sgetc(i7);
	r4 = r_g0;
continue _1;
}
}
else{
__label__ = 168;
break _1;
}
}
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 53: 
	r13 = 0;
break;
case 52: 
	r13 = 16;
break;
case 46: 
	r5 = r4 << 2;
	r7 = my_ctype;
	r5 = (r5 + r7)&-1;
	r5 = heapU8[r5+4];
	r3 = (r6 + 1)&-1;
	r5 = r5 & 8;
_97: do {
if(!(r5 ==0)) //_LBB196_50
{
_98: while(true){
	heap32[(g0)] = r0;
	sgetc(i7);
	r4 = r_g0;
	r5 = r4 << 2;
	r5 = (r5 + r7)&-1;
	r1 = (r1 + 1)&-1;
	r5 = heapU8[r5+4];
	r5 = r5 & 8;
if(!(r5 !=0)) //_LBB196_111
{
break _97;
}
}
}
} while(0);
	if(r4 ==45) //_LBB196_114
{
	heap32[(g0)] = r0;
	r1 = (r1 + 1)&-1;
	r5 = 1;
	sgetc(i7);
	r4 = r_g0;
}
else{
	r5 = 0;
}
	if(r4 ==43) //_LBB196_117
{
	heap32[(g0)] = r0;
	r1 = (r1 + 1)&-1;
	sgetc(i7);
	r4 = r_g0;
}
	r6 = (r4 + -48)&-1;
_108: do {
	if(uint(r6) >uint(9)) //_LBB196_120
{
	f0 =                         0;
	r6 = r1;
}
else{
	f0 =                         0;
	r6 = r1;
_111: while(true){
	r4 = (r4 + -48)&-1;
	f1 =                        10;
	heap32[(g0)] = r0;
	f0 = f0*f1;
	f1 = r4; //fitod r4, f1
	sgetc(i7);
	r4 = r_g0;
	f0 = f0+f1;
	r6 = (r6 + 1)&-1;
	r7 = (r4 + -48)&-1;
if(!(uint(r7) <uint(10))) //_LBB196_121
{
break _108;
}
}
}
} while(0);
_114: do {
	if(r4 ==46) //_LBB196_124
{
	heap32[(g0)] = r0;
	sgetc(i7);
	r4 = r_g0;
	r1 = (r1 + 1)&-1;
	r7 = (r4 + -48)&-1;
	if(uint(r7) <uint(10)) //_LBB196_126
{
	r6 = (r6 + 1)&-1;
	f1 =       0.10000000000000001;
_118: while(true){
	r4 = (r4 + -48)&-1;
	f2 = r4; //fitod r4, f2
	heap32[(g0)] = r0;
	f2 = f2*f1;
	sgetc(i7);
	r4 = r_g0;
	f0 = f2+f0;
	f1 = f1/f3;
	r6 = (r6 + 1)&-1;
	r7 = (r4 + -48)&-1;
if(!(uint(r7) <uint(10))) //_LBB196_127
{
break _114;
}
}
}
else{
	r6 = (r6 + 1)&-1;
}
}
} while(0);
	if(r1 ==r6) //_LBB196_73
{
__label__ = 172;
break _1;
}
else{
	r1 = r4 | 32;
_123: do {
	if(r1 ==101) //_LBB196_131
{
	heap32[(g0)] = r0;
	sgetc(i7);
	r1 = r_g0;
	if(r1 ==45) //_LBB196_135
{
	heap32[(g0)] = r0;
	f1 =       0.10000000000000001;
	sgetc(i7);
	r4 = r_g0;
}
else{
	if(r1 ==43) //_LBB196_136
{
	heap32[(g0)] = r0;
	f1 =                        10;
	sgetc(i7);
	r4 = r_g0;
}
else{
	if(r1 !=-1) //_LBB196_137
{
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	f0 =                         0;
	sputc(i7);
	r1 = r6;
break _123;
}
else{
	r1 = (r6 + 1)&-1;
	f0 =                         0;
break _123;
}
}
}
	r7 = (r6 + 2)&-1;
	r1 = (r4 + -48)&-1;
_135: do {
	if(uint(r1) <uint(10)) //_LBB196_140
{
	r1 = (r6 + 2)&-1;
	r6 = 0;
_137: while(true){
	r6 = (r6 * 10)&-1;
	heap32[(g0)] = r0;
	r6 = (r4 + r6)&-1;
	sgetc(i7);
	r4 = r_g0;
	r6 = (r6 + -48)&-1;
	r1 = (r1 + 1)&-1;
	r9 = (r4 + -48)&-1;
if(!(uint(r9) <uint(10))) //_LBB196_141
{
break _135;
}
}
}
else{
	r6 = 0;
	r1 = r7;
}
} while(0);
	if(r7 ==r1) //_LBB196_73
{
__label__ = 172;
break _1;
}
else{
if(!(r6 ==0)) //_LBB196_145
{
__label__ = 130; //SET chanka
_142: while(true){
	r6 = (r6 + -1)&-1;
	f0 = f0*f1;
if(!(r6 !=0)) //_LBB196_146
{
break _123;
}
}
}
}
}
else{
	r1 = r6;
}
} while(0);
	if(r5 !=0) //_LBB196_149
{
	f0 = -f0;
}
	r5 = r8 & 255;
	if(r5 !=0) //_LBB196_186
{
continue _1;
}
else{
	r5 = sp + -4; 
	heap32[(g0)] = r5;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r5 = r_g0;
	r6 = r10 & 255;
	if(r6 ==0) //_LBB196_153
{
	r5 = r5 >> 2;
	r5 = heap32[(r5)];
	r5 = r5 >> 2;
	f0 = f0; //fdtos f0, f0
	heapFloat[(r5)] = f0;
}
else{
	r5 = r5 >> 2;
	r5 = heap32[(r5)];
	llvm_writeDouble((r5),f0);
}
	r2 = (r2 + 1)&-1;
continue _1;
}
}
break;
}
	r3 = r4 << 2;
	r14 = my_ctype;
	r3 = (r3 + r14)&-1;
	r15 = heapU8[r3+4];
	r3 = (r6 + 1)&-1;
	r6 = r15 & 8;
_155: do {
if(!(r6 ==0)) //_LBB196_64
{
_156: while(true){
	heap32[(g0)] = r0;
	sgetc(i7);
	r4 = r_g0;
	r6 = r4 << 2;
	r6 = (r6 + r14)&-1;
	r1 = (r1 + 1)&-1;
	r6 = heapU8[r6+4];
	r6 = r6 & 8;
if(!(r6 !=0)) //_LBB196_65
{
break _155;
}
}
}
} while(0);
	if(r4 ==45) //_LBB196_68
{
	heap32[(g0)] = r0;
	r1 = (r1 + 1)&-1;
	r6 = 1;
	sgetc(i7);
	r4 = r_g0;
}
else{
	r6 = 0;
}
	if(r4 ==43) //_LBB196_71
{
	heap32[(g0)] = r0;
	r14 = (r1 + 1)&-1;
	sgetc(i7);
	r4 = r_g0;
}
else{
	r14 = r1;
}
	if(r4 !=-1) //_LBB196_74
{
	r7 = r7 & 255;
_168: do {
	if(r7 ==0) //_LBB196_76
{
	if(r13 !=16) //_LBB196_79
{
__label__ = 68;
}
else{
	if(r4 !=48) //_LBB196_79
{
__label__ = 68;
}
else{
__label__ = 72;
}
}
_172: do {
switch(__label__ ){//multiple entries
case 68: 
if(!(r13 !=0)) //_LBB196_82
{
	r7 = 48;
	r7 = r4 != r7;
if(!(r7 != 0)) //_LBB196_82
{
	r13 = 8;
break _172;
}
}
	r7 = 10;
	r13 = r13 != 0 ? r13 : r7; 
	r1 = r14;
break _168;
break;
}
} while(0);
	heap32[(g0)] = r0;
	sgetc(i7);
	r4 = r_g0;
	r7 = r4 | 32;
	if(r7 ==120) //_LBB196_85
{
	heap32[(g0)] = r0;
	r1 = (r14 + 2)&-1;
	r13 = 16;
	sgetc(i7);
	r4 = r_g0;
}
else{
	r1 = (r14 + 1)&-1;
}
}
else{
	r1 = r14;
}
} while(0);
	r7 = 0;
	r15 = r7;
	r16 = r7;
_184: while(true){
	if(r5 ==0) //_LBB196_97
{
break _184;
}
else{
	if(r4 !=-1) //_LBB196_87
{
	r17 = r4 & 255;
	r18 = r17 | 32;
	if(uint(r18) <uint(97)) //_LBB196_89
{
	r18 = 58;
	r19 = (r17 + -48)&-1;
	r17 = uint(r17) < uint(r18) ? r19 : r20; 
}
else{
	r17 = (r18 + -87)&-1;
}
	if(uint(r17) >=uint(r13)) //_LBB196_97
{
break _184;
}
else{
	heap32[(g0)] = r15;
	heap32[(g0+1)] = r16;
	heap32[(g0+2)] = r13;
	heap32[(g0+3)] = r7;
	__muldi3(i7);
	r4 = r_g0;
	r18 = r_g1;
	r15 = uint(r4) >= uint(r15);
	r19 = uint(r18) >= uint(r16);
	r15 = r18 == r16 ? r15 : r19; 
	if(r15 != 0) //_LBB196_93
{
	r15 = (r17 + r4)&-1;
	r16 = 1;
	r17 = uint(r15) < uint(r17) ? r16 : r7; 
	r4 = uint(r15) < uint(r4) ? r16 : r17; 
	r16 = (r18 + r4)&-1;
}
else{
	r15 = -1;
	r16 = r15;
}
	heap32[(g0)] = r0;
	r1 = (r1 + 1)&-1;
	r5 = (r5 + -1)&-1;
	sgetc(i7);
	r4 = r_g0;
}
}
else{
break _184;
}
}
}
	if(r14 ==r1) //_LBB196_73
{
__label__ = 172;
break _1;
}
else{
	r5 = r12 | 32;
if(!(uint(r5) >uint(111))) //_LBB196_100
{
	if(r16 >-1) //_LBB196_101
{
	r5 = 1;
	r12 = (r7 - r16)&-1;
	r5 = r15 != 0 ? r5 : r7; 
	r7 = (r7 - r15)&-1;
	r5 = (r12 - r5)&-1;
	r15 = r6 != 0 ? r7 : r15; 
	r16 = r6 != 0 ? r5 : r16; 
}
}
	r5 = r8 & 255;
	if(r5 !=0) //_LBB196_186
{
continue _1;
}
else{
	r5 = r11 & 255;
	if(r5 ==0) //_LBB196_105
{
	r5 = r10 & 255;
	if(r5 ==0) //_LBB196_107
{
	r5 = sp + -4; 
	heap32[(g0)] = r5;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r5 = r_g0;
	r7 = r9 & 255;
	if(r7 ==0) //_LBB196_109
{
	r5 = r5 >> 2;
	r5 = heap32[(r5)];
	r5 = r5 >> 2;
	heap32[(r5)] = r15;
}
else{
	r5 = r5 >> 2;
	r5 = heap32[(r5)];
	heap16[(r5)>>1] = r15;
}
}
else{
	r5 = sp + -4; 
	heap32[(g0)] = r5;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r5 = r_g0 >> 2;
	r5 = heap32[(r5)];
	r5 = r5 >> 2;
	heap32[(r5)] = r15;
}
}
else{
	r5 = sp + -4; 
	heap32[(g0)] = r5;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r5 = r_g0 >> 2;
	r5 = heap32[(r5)];
	r5 = r5 >> 2;
	heap32[(r5)] = r15;
	heap32[(r5+1)] = r16;
}
	r5 = uint(r14) < uint(r1);
	r5 = r5 & 1;
	r2 = (r5 + r2)&-1;
continue _1;
}
}
}
else{
__label__ = 172;
break _1;
}
}
else{
__label__ = 165;
}
}
}
else{
	if(r5 ==0) //_LBB196_6
{
__label__ = 6;
break _1;
}
else{
	r7 = (r5 + -9)&-1;
	if(uint(r7) <uint(5)) //_LBB196_7
{
__label__ = 7;
}
else{
__label__ = 165;
}
}
}
switch(__label__ ){//multiple entries
case 7: 
	r3 = (r3 + 1)&-1;
_218: while(true){
	r5 = heapU8[r3];
	if(r5 ==0) //_LBB196_13
{
break _218;
}
else{
	r5 = r5 << 24;
	r5 = r5 >> 24;
	r5 = r5 << 2;
	r6 = my_ctype;
	r5 = (r5 + r6)&-1;
	r5 = heapU8[r5+4];
	r5 = r5 & 8;
	if(r5 ==0) //_LBB196_13
{
break _218;
}
else{
	r3 = (r3 + 1)&-1;
}
}
}
	r6 = r4 << 2;
	r5 = my_ctype;
	r6 = (r6 + r5)&-1;
	r6 = heapU8[r6+4];
	r6 = r6 & 8;
	if(r6 ==0) //_LBB196_186
{
continue _1;
}
else{
__label__ = 12; //SET chanka
_223: while(true){
	heap32[(g0)] = r0;
	sgetc(i7);
	r4 = r_g0;
	r6 = r4 << 2;
	r6 = (r6 + r5)&-1;
	r1 = (r1 + 1)&-1;
	r6 = heapU8[r6+4];
	r6 = r6 & 8;
	if(r6 ==0) //_LBB196_186
{
continue _1;
}
}
}
break;
case 165: 
	r3 = r4 & 255;
	if(r3 !=r5) //_LBB196_187
{
__label__ = 168;
break _1;
}
else{
	heap32[(g0)] = r0;
	r1 = (r1 + 1)&-1;
	sgetc(i7);
	r4 = r_g0;
	r3 = r6;
continue _1;
}
break;
}
}
else{
__label__ = 168;
break _1;
}
}
_227: do {
switch(__label__ ){//multiple entries
case 168: 
if(!(r4 >-1)) //_LBB196_190
{
if(!(r2 !=0)) //_LBB196_190
{
	r2 = -1;
break _227;
}
}
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r0;
	sputc(i7);
break;
case 6: 
	r2 = 0;
break;
}
} while(0);
	r_g0 = r2;
	return;
}

function __v_printf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
	var r18;
	var r19;
	var r20;
	var r21;
	var r22;
	var r23;
	var f0;
	var f1;
var __label__ = 0;
	i7 = sp + -184;var g0 = i7>>2; // save stack
	r0 = sp + -136; 
	r1 = heap32[(fp+2)];
	r2 = heap32[(fp)];
	r3 = heap32[(fp+1)];
	r0 = (r0 + 1)&-1;
	heap32[(fp+-1)] = r1;
	heap32[(fp+-2)] = 0;
_1: while(true){
	r4 = heapU8[r3];
	if(r4 ==0) //_LBB197_209
{
__label__ = 197;
break _1;
}
else{
	r1 = 0;
	r5 = r4;
_4: while(true){
	r5 = r5 & 255;
	if(r5 ==0) //_LBB197_4
{
break _4;
}
else{
	if(r5 !=37) //_LBB197_1
{
	r5 = (r3 - r1)&-1;
	r5 = heapU8[r5+1];
	r1 = (r1 + -1)&-1;
}
else{
break _4;
}
}
}
	r5 = 0;
	if(r1 !=0) //_LBB197_6
{
	r4 = (r5 - r1)&-1;
	if(r4 <0) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r6 = heap32[(fp+-2)];
	r7 = (r6 - r1)&-1;
	if(uint(r7) <uint(r6)) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r6 = (r3 - r1)&-1;
	r7 = r2 >> 2;
	r8 = heap32[(r7+1)];
	r7 = heap32[(r7)];
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r7;
	__FUNCTION_TABLE__[(r8)>>2](i7);
	r4 = heap32[(fp+-2)];
	r4 = (r4 - r1)&-1;
	r1 = (r3 - r1)&-1;
	heap32[(fp+-2)] = r4;
	r4 = heapU8[r1];
	r3 = r6;
}
}
}
	r1 = r4 & 255;
	if(r1 !=37) //_LBB197_207
{
continue _1;
}
else{
	r3 = (r3 + 1)&-1;
	r1 = 32;
	r4 = r5;
	r6 = r5;
	r7 = r5;
	r8 = r5;
	r9 = r5;
	r10 = r5;
	r11 = r5;
_15: while(true){
	r12 = r4;
	r13 = r3;
	r14 = heapU8[r13];
	r3 = (r13 + 1)&-1;
	heap8[sp+-145] = r14;
_17: do {
	if(r14 >99) //_LBB197_29
{
	if(r14 >110) //_LBB197_37
{
	if(r14 >114) //_LBB197_41
{
	if(r14 >119) //_LBB197_44
{
	if(r14 ==122) //_LBB197_47
{
__label__ = 50;
break _17;
}
else{
__label__ = 44;
break _15;
}
}
else{
__label__ = 41;
break _15;
}
}
else{
	if(r14 ==111) //_LBB197_105
{
__label__ = 99;
break _15;
}
else{
	if(r14 ==112) //_LBB197_97
{
__label__ = 91;
break _15;
}
else{
	if(r14 ==113) //_LBB197_53
{
__label__ = 49;
break _17;
}
else{
continue _1;
}
}
}
}
}
else{
	if(r14 >104) //_LBB197_34
{
	if(r14 ==105) //_LBB197_108
{
__label__ = 102;
break _15;
}
else{
	if(r14 ==106) //_LBB197_53
{
__label__ = 49;
break _17;
}
else{
	if(r14 ==108) //_LBB197_47
{
__label__ = 50;
break _17;
}
else{
continue _1;
}
}
}
}
else{
	if(r14 ==100) //_LBB197_108
{
__label__ = 102;
break _15;
}
else{
	r4 = (r14 + -102)&-1;
	if(uint(r4) <uint(2)) //_LBB197_135
{
__label__ = 129;
break _15;
}
else{
	if(r14 ==104) //_LBB197_48
{
__label__ = 48;
break _17;
}
else{
continue _1;
}
}
}
}
}
}
else{
	if(r14 >44) //_LBB197_20
{
	if(r14 >75) //_LBB197_24
{
	if(r14 >97) //_LBB197_27
{
__label__ = 26;
break _15;
}
else{
	if(r14 ==76) //_LBB197_53
{
__label__ = 49;
break _17;
}
else{
__label__ = 25;
break _15;
}
}
}
else{
	r4 = 1;
	if(r14 ==45) //_LBB197_11
{
continue _15;
}
else{
	if(r14 ==46) //_LBB197_61
{
	r4 = heapU8[r3];
	if(r4 !=42) //_LBB197_63
{
	r4 = sp + -144; 
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r4;
	strtol(i7);
	r14 = 0;
	r11 = r_g0 < 0 ? r14 : r_g0; 
	r3 = heap32[(fp+-36)];
}
else{
	r4 = sp + -4; 
	heap32[(g0)] = r4;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r4 = r_g0 >> 2;
	r4 = heap32[(r4)];
	r14 = 0;
	r11 = r4 < 0 ? r14 : r4; 
	r3 = (r13 + 2)&-1;
}
	r8 = 1;
	r4 = r12;
	if(uint(r11) >uint(10240)) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
continue _15;
}
}
else{
	r4 = (r14 + -48)&-1;
	if(uint(r4) <uint(10)) //_LBB197_57
{
	r4 = r8 & 255;
	if(r4 !=0) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r4 = sp + -144; 
	heap32[(g0)] = r13;
	heap32[(g0+1)] = r4;
	strtoul(i7);
	r10 = r_g0;
	if(uint(r10) >uint(10240)) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r8 = 0;
	r4 = r12 & 255;
	r13 = heapU8[sp+-145];
	r14 = 48;
	r13 = r13 == r14;
	r4 = r4 == r8;
	r4 = r13 & r4;
	r1 = r4 != 0 ? r14 : r1; 
	r3 = heap32[(fp+-36)];
	r4 = r12;
continue _15;
}
}
}
else{
continue _1;
}
}
}
}
}
else{
	if(r14 >36) //_LBB197_17
{
	if(r14 ==37) //_LBB197_66
{
__label__ = 62;
break _15;
}
else{
	if(r14 ==42) //_LBB197_60
{
	r4 = sp + -4; 
	heap32[(g0)] = r4;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r4 = r_g0 >> 2;
	r4 = heap32[(r4)];
	r13 = r4 >> 31;
	r14 = (r4 + r13)&-1;
	r15 = 1;
	r10 = r14 ^ r13;
	r4 = r4 < 0 ? r15 : r12; 
	if(uint(r10) >uint(10240)) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
continue _15;
}
}
else{
	if(r14 ==43) //_LBB197_56
{
	r7 = 1;
	r4 = r12;
continue _15;
}
else{
continue _1;
}
}
}
}
else{
	if(r14 ==0) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	if(r14 ==32) //_LBB197_55
{
	r6 = 1;
	r4 = r12;
continue _15;
}
else{
	if(r14 ==35) //_LBB197_51
{
	r5 = 255;
__label__ = 48;
}
else{
continue _1;
}
}
}
}
}
}
} while(0);
switch(__label__ ){//multiple entries
case 49: 
	r9 = (r9 + 1)&-1;
break;
case 48: 
	r9 = (r9 + -1)&-1;
	r4 = r12;
continue _15;
break;
}
	r9 = (r9 + 1)&-1;
	r4 = r12;
}
_71: do {
switch(__label__ ){//multiple entries
case 26: 
	if(r14 ==98) //_LBB197_49
{
	r4 = 0;
	r13 = 2;
	r14 = r4;
	r15 = r4;
__label__ = 104;
break _71;
}
else{
	if(r14 ==99) //_LBB197_65
{
	r1 = sp + -4; 
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r1 = r_g0 >> 2;
	r1 = heap32[(r1)];
	heap8[sp+-145] = r1;
__label__ = 62;
break _71;
}
else{
continue _1;
}
}
break;
case 25: 
	if(r14 ==88) //_LBB197_50
{
__label__ = 92;
break _71;
}
else{
continue _1;
}
break;
case 44: 
	if(r14 !=120) //_LBB197_207
{
continue _1;
}
else{
	r4 = 0;
__label__ = 93;
break _71;
}
break;
case 41: 
	if(r14 ==115) //_LBB197_68
{
	r1 = sp + -4; 
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r1 = r_g0 >> 2;
	r4 = _2E_str37680;
	r1 = heap32[(r1)];
	r1 = r1 == 0 ? r4 : r1; 
	heap32[(fp+-36)] = r1;
	r4 = heapU8[r1];
_83: do {
	if(r4 !=0) //_LBB197_70
{
	r4 = (r1 + 1)&-1;
	r14 = 0;
_85: while(true){
	r1 = (r14 + 1)&-1;
	r6 = heapU8[r4+r14];
	r14 = r1;
if(!(r6 !=0)) //_LBB197_71
{
break _83;
}
}
}
else{
	r1 = 0;
}
} while(0);
	r16 = 0;
	r4 = r8 & 255;
	r4 = r4 != r16;
	r14 = uint(r1) > uint(r11);
	r4 = r4 & r14;
	r14 = 32;
	r4 = r4 != 0 ? r11 : r1; 
	r1 = r14;
	r8 = r16;
	r11 = r16;
__label__ = 69;
break _71;
}
else{
	if(r14 ==117) //_LBB197_109
{
	r4 = 0;
	r13 = 10;
	r14 = r4;
	r15 = r4;
__label__ = 104;
break _71;
}
else{
continue _1;
}
}
break;
case 99: 
	r4 = r5 & 255;
	if(r4 !=0) //_LBB197_107
{
	r5 = 1;
	r4 = 0;
	r13 = 8;
	r14 = 48;
	heap8[sp+-135] = r14;
	r14 = r4;
	r15 = r5;
__label__ = 104;
break _71;
}
else{
	r4 = 0;
	r13 = 8;
	r14 = r4;
	r5 = r4;
	r15 = r4;
__label__ = 104;
break _71;
}
break;
case 91: 
	r14 = 120;
	r5 = 2;
	r9 = 1;
	heap8[sp+-145] = r14;
__label__ = 92;
break _71;
break;
case 102: 
	r4 = 0;
	r14 = 1;
	r13 = 10;
	r15 = r4;
__label__ = 104;
break _71;
break;
case 129: 
	r4 = sp + -4; 
	heap32[(g0)] = r4;
	heap32[(g0+1)] = 8;
	my_arg_test(i7);
	f0 = llvm_readDouble((r_g0));
	heap32[(fp+-36)] = r0;
	r4 = 103;
	r4 = r14 == r4;
	r8 = r8 & 255;
	r16 = 1;
	r9 = 6;
	r10 = r10 == 0 ? r16 : r10; 
	r11 = r8 == 0 ? r9 : r11; 
	r4 = r4 & 1;
	f1 =                         0;
	r9 = r7 & 255;
	r13 = 0;
	llvm_writeDouble((i7),f0);
	heap32[(g0+2)] = r0;
	heap32[(g0+3)] = 127;
	heap32[(g0+4)] = r10;
	heap32[(g0+5)] = r11;
	heap32[(g0+6)] = r4;
	r4 = r9 != r13;
	r16 = f0 < f1;
	r4 = r4 | r16;
	r16 = r4 & 1;
	__dtostr(i7);
	r4 = r_g0;
_98: do {
	if(r8 !=0) //_LBB197_137
{
	r8 = heap32[(fp+-36)];
	r15 = r13;
_100: while(true){
	r17 = heapU8[r8+r13];
	if(r17 ==0) //_LBB197_161
{
__label__ = 151;
break _100;
}
else{
	r18 = (r8 + r13)&-1;
	if(r17 ==46) //_LBB197_149
{
__label__ = 142;
break _100;
}
else{
	r17 = heapU8[r18+1];
	if(r17 ==0) //_LBB197_161
{
__label__ = 151;
break _100;
}
else{
	r19 = r15 << 2;
	if(r17 !=46) //_LBB197_143
{
	r17 = heapU8[r18+2];
	if(r17 ==0) //_LBB197_161
{
__label__ = 151;
break _100;
}
else{
	if(r17 !=46) //_LBB197_146
{
	r17 = heapU8[r18+3];
	if(r17 ==0) //_LBB197_161
{
__label__ = 151;
break _100;
}
else{
	if(r17 ==46) //_LBB197_151
{
__label__ = 143;
break _100;
}
else{
	r15 = (r15 + 1)&-1;
	r13 = (r13 + 4)&-1;
}
}
}
else{
__label__ = 138;
break _100;
}
}
}
else{
__label__ = 135;
break _100;
}
}
}
}
}
_110: do {
switch(__label__ ){//multiple entries
case 142: 
	if(r18 ==0) //_LBB197_161
{
__label__ = 151;
break _110;
}
else{
__label__ = 144;
break _110;
}
break;
case 143: 
	r18 = (r18 + 3)&-1;
__label__ = 144;
break _110;
break;
case 138: 
	r4 = r19 | 2;
	r18 = (r8 + r4)&-1;
__label__ = 144;
break _110;
break;
case 135: 
	r4 = r19 | 1;
	r18 = (r8 + r4)&-1;
__label__ = 144;
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 151: 
	r5 = r5 & 255;
	if(r5 ==0) //_LBB197_136
{
break _98;
}
else{
	r5 = 46;
	heap8[r8+r4] = r5;
	r5 = heap32[(fp+-36)];
	r4 = (r4 + r5)&-1;
	r5 = 0;
	heap8[r4+1] = r5;
}
break;
case 144: 
	if(r11 !=0) //_LBB197_155
{
__label__ = 146;
}
else{
	r4 = r5 & 255;
	if(r4 !=0) //_LBB197_155
{
__label__ = 146;
}
else{
__label__ = 147;
}
}
switch(__label__ ){//multiple entries
case 146: 
	r18 = (r18 + 1)&-1;
break;
}
_123: while(true){
	r4 = r11;
	if(r4 !=0) //_LBB197_158
{
	r11 = (r4 + -1)&-1;
	r5 = (r18 + 1)&-1;
	r8 = heapU8[r18+1];
	r18 = r5;
	if(r8 !=0) //_LBB197_156
{
__label__ = 147;
}
else{
__label__ = 149;
break _123;
}
}
else{
__label__ = 150;
break _123;
}
}
switch(__label__ ){//multiple entries
case 149: 
	r18 = r5;
break;
}
	r5 = 0;
	heap8[r18] = r5;
	r11 = r4;
break;
}
}
} while(0);
_130: do {
if(!(r14 !=103)) //_LBB197_199
{
	r4 = heap32[(fp+-36)];
	r5 = 0;
	r8 = r5;
_132: while(true){
	r14 = heapU8[r4+r5];
	if(r14 ==0) //_LBB197_199
{
break _130;
}
else{
	r13 = (r4 + r5)&-1;
	if(r14 ==46) //_LBB197_176
{
__label__ = 166;
break _132;
}
else{
	r14 = heapU8[r13+1];
	if(r14 ==0) //_LBB197_199
{
break _130;
}
else{
	r15 = r8 << 2;
	if(r14 !=46) //_LBB197_170
{
	r14 = heapU8[r13+2];
	if(r14 ==0) //_LBB197_199
{
break _130;
}
else{
	if(r14 !=46) //_LBB197_173
{
	r14 = heapU8[r13+3];
	if(r14 ==0) //_LBB197_199
{
break _130;
}
else{
	if(r14 ==46) //_LBB197_178
{
__label__ = 167;
break _132;
}
else{
	r8 = (r8 + 1)&-1;
	r5 = (r5 + 4)&-1;
}
}
}
else{
__label__ = 162;
break _132;
}
}
}
else{
__label__ = 159;
break _132;
}
}
}
}
}
switch(__label__ ){//multiple entries
case 166: 
	if(r13 ==0) //_LBB197_199
{
break _130;
}
break;
case 167: 
	r13 = (r13 + 3)&-1;
break;
case 162: 
	r5 = r15 | 2;
	r13 = (r4 + r5)&-1;
break;
case 159: 
	r5 = r15 | 1;
	r13 = (r4 + r5)&-1;
break;
}
	r4 = 0;
	r5 = r13;
_148: while(true){
	r8 = heapU8[r5];
	if(r8 !=101) //_LBB197_182
{
	if(r8 !=0) //_LBB197_184
{
	r8 = r4 << 2;
	r14 = heapU8[r5+1];
	if(r14 !=101) //_LBB197_186
{
	if(r14 ==0) //_LBB197_183
{
__label__ = 171;
break _148;
}
else{
	r14 = heapU8[r5+2];
	if(r14 !=101) //_LBB197_189
{
	if(r14 ==0) //_LBB197_183
{
__label__ = 171;
break _148;
}
else{
	r14 = heapU8[r5+3];
	if(r14 !=101) //_LBB197_192
{
	if(r14 ==0) //_LBB197_183
{
__label__ = 171;
break _148;
}
else{
	r4 = (r4 + 1)&-1;
	r5 = (r5 + 4)&-1;
}
}
else{
__label__ = 179;
break _148;
}
}
}
else{
__label__ = 176;
break _148;
}
}
}
else{
__label__ = 173;
break _148;
}
}
else{
__label__ = 171;
break _148;
}
}
else{
__label__ = 182;
break _148;
}
}
switch(__label__ ){//multiple entries
case 171: 
	r5 = 0;
break;
case 179: 
	r4 = r8 | 3;
	r5 = (r13 + r4)&-1;
break;
case 176: 
	r4 = r8 | 2;
	r5 = (r13 + r4)&-1;
break;
case 173: 
	r4 = r8 | 1;
	r5 = (r13 + r4)&-1;
break;
}
_163: while(true){
	r4 = (r13 + 1)&-1;
	r8 = heapU8[r13+1];
	r13 = r4;
if(!(r8 !=0)) //_LBB197_194
{
break _163;
}
}
	r4 = r5 == 0 ? r4 : r5; 
_166: while(true){
	r8 = heapU8[r4+-1];
	r4 = (r4 + -1)&-1;
if(!(r8 ==48)) //_LBB197_196
{
break _166;
}
}
	r14 = (r4 + 1)&-1;
	r4 = r8 == 46 ? r4 : r14; 
	r8 = 0;
	heap8[r4] = r8;
if(!(r5 ==0)) //_LBB197_199
{
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r5;
	strcpy(i7);
}
}
} while(0);
	r4 = r7 | r6;
	r4 = r4 & 255;
if(!(r4 ==0)) //_LBB197_202
{
if(!(f0 <f1)) //_LBB197_202
{
	r4 = heap32[(fp+-36)];
	r5 = (r4 + -1)&-1;
	r8 = 32;
	r14 = 43;
	r8 = r9 == 0 ? r8 : r14; 
	heap32[(fp+-36)] = r5;
	heap8[r4+-1] = r8;
}
}
	r4 = heap32[(fp+-36)];
	r5 = heapU8[r4];
_175: do {
	if(r5 !=0) //_LBB197_204
{
	r5 = (r4 + 1)&-1;
	r8 = 0;
_177: while(true){
	r4 = (r8 + 1)&-1;
	r14 = heapU8[r5+r8];
	r8 = r4;
if(!(r14 !=0)) //_LBB197_205
{
break _175;
}
}
}
else{
	r4 = 0;
}
} while(0);
	r10 = uint(r10) < uint(r4) ? r4 : r10; 
	r14 = 48;
	r5 = 0;
	r8 = r5;
__label__ = 69;
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 62: 
	r1 = heap32[(fp+-2)];
	if(r1 ==-1) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r1 = r2 >> 2;
	r4 = heap32[(r1+1)];
	r1 = heap32[(r1)];
	r5 = sp + -145; 
	heap32[(g0)] = r5;
	heap32[(g0+1)] = 1;
	heap32[(g0+2)] = r1;
	__FUNCTION_TABLE__[(r4)>>2](i7);
	r1 = heap32[(fp+-2)];
	r1 = (r1 + 1)&-1;
	heap32[(fp+-2)] = r1;
continue _1;
}
break;
case 92: 
	r4 = r14 & 255;
	r13 = 88;
	r4 = r4 == r13;
	r4 = r4 & 1;
__label__ = 93;
break;
}
switch(__label__ ){//multiple entries
case 93: 
	r5 = r5 & 255;
	if(r5 !=0) //_LBB197_101
{
	r13 = 48;
	r5 = 2;
	heap8[sp+-135] = r13;
	heap8[sp+-134] = r14;
	r15 = r5;
}
else{
	r5 = 0;
	r15 = r5;
}
	if(uint(r11) >uint(r10)) //_LBB197_104
{
	r14 = 0;
	r13 = 16;
	r10 = r11;
__label__ = 104;
}
else{
	r14 = 0;
	r13 = 16;
__label__ = 104;
}
break;
}
_194: do {
switch(__label__ ){//multiple entries
case 104: 
	heap32[(fp+-36)] = r0;
	r16 = sp + -4; 
	heap32[(g0)] = r16;
	heap32[(g0+1)] = 4;
	my_arg_test(i7);
	r17 = r_g0 >> 2;
	r18 = r14 & 255;
	r16 = 0;
	r17 = heap32[(r17)];
	r18 = r18 != r16;
	r19 = r17 < r16;
	r20 = (r16 - r17)&-1;
	r18 = r18 & r19;
	r9 = r9 << 24;
	r17 = r18 != 0 ? r20 : r17; 
	r9 = r9 >> 24;
	r19 = r17 & 65535;
	r17 = r9 < 0 ? r19 : r17; 
	r19 = heap32[(fp+-36)];
	r20 = r17 & 255;
	r21 = 2;
	r9 = r9 < -1 ? r20 : r17; 
	r17 = r18 != 0 ? r21 : r14; 
	r14 = (r19 + r15)&-1;
	heap8[r14+122] = r16;
	if(r9 !=0) //_LBB197_112
{
	r18 = (r13 + -1)&-1;
	r19 = 35;
	r20 = 10;
	r18 = uint(r18) > uint(r19) ? r20 : r13; 
	r4 = r4 & 255;
	r13 = 39;
	r19 = 7;
	r4 = r4 == 0 ? r13 : r19; 
	r19 = (r15 + 121)&-1;
	r20 = -122;
_198: while(true){
	r13 = Math.floor(uint(r9) % uint(r18));
	r13 = (r13 + 48)&-1;
	r22 = r13 & 255;
	r23 = 57;
	r22 = uint(r22) > uint(r23) ? r4 : r16; 
	r23 = (r20 + 1)&-1;
	r13 = (r13 + r22)&-1;
	r20 = (r14 - r20)&-1;
	heap8[r20+-1] = r13;
	if(r19 <=r15) //_LBB197_115
{
break _198;
}
else{
	r9 = Math.floor(uint(r9) /uint(r18));
	r19 = (r19 + -1)&-1;
	r20 = r23;
if(!(r9 !=0)) //_LBB197_113
{
break _198;
}
}
}
	r18 = (r23 + 122)&-1;
	r9 = (r14 - r23)&-1;
}
else{
	r4 = (r15 + r19)&-1;
	r13 = 48;
	r9 = (r4 + 121)&-1;
	r18 = 1;
	heap8[r4+121] = r13;
}
_204: do {
if(!(r9 ==r14)) //_LBB197_125
{
	if(uint(r9) <=uint(r14)) //_LBB197_122
{
if(!(r18 ==-1)) //_LBB197_125
{
	r4 = (r16 - r18)&-1;
_209: while(true){
	r13 = r4;
	r19 = (r9 - r13)&-1;
	r4 = (r13 + 1)&-1;
	r20 = (r14 - r13)&-1;
	r19 = heapU8[r19];
	heap8[r20] = r19;
if(!(r13 !=0)) //_LBB197_124
{
break _204;
}
}
}
}
else{
if(!(r18 ==-1)) //_LBB197_125
{
	r4 = (r9 + 1)&-1;
	r9 = r18;
_213: while(true){
	heap8[r14] = r13;
	if(r9 ==0) //_LBB197_125
{
break _204;
}
else{
	r13 = heapU8[r4];
	r4 = (r4 + 1)&-1;
	r9 = (r9 + -1)&-1;
	r14 = (r14 + 1)&-1;
}
}
}
}
}
} while(0);
	r4 = 1;
	r4 = r18 != r4;
	r4 = r4 & 1;
	r14 = r8 ^ 1;
	r4 = r4 | r14;
	r4 = r4 & 255;
	if(r4 !=0) //_LBB197_128
{
__label__ = 122;
}
else{
	r4 = heap32[(fp+-36)];
	r4 = heapU8[r4+r15];
	if(r4 !=48) //_LBB197_128
{
__label__ = 122;
}
else{
	r4 = r5 << 24;
	r5 = 0;
	r4 = r4 >> 24;
	r14 = r11 == r5;
	r4 = r4 > r5;
	r4 = r14 | r4;
	r4 = r4 != 0 ? r5 : r15; 
__label__ = 123;
}
}
switch(__label__ ){//multiple entries
case 122: 
	r4 = (r18 + r15)&-1;
break;
}
	r14 = r17 & 255;
	if(r14 ==2) //_LBB197_132
{
	r6 = heap32[(fp+-36)];
	r7 = (r6 + -1)&-1;
	r4 = (r4 + 1)&-1;
	r14 = 48;
	r16 = 45;
	heap32[(fp+-36)] = r7;
	heap8[r6+-1] = r16;
	r16 = r21;
}
else{
	if(r14 !=0) //_LBB197_133
{
	r14 = r7 | r6;
	r14 = r14 & 255;
if(!(r14 ==0)) //_LBB197_131
{
	r6 = heap32[(fp+-36)];
	r16 = (r6 + -1)&-1;
	r7 = r7 & 255;
	r9 = 32;
	r13 = 43;
	r4 = (r4 + 1)&-1;
	r14 = 48;
	r7 = r7 == 0 ? r9 : r13; 
	heap32[(fp+-36)] = r16;
	heap8[r6+-1] = r7;
	r16 = r17;
break _194;
}
}
	r14 = 48;
}
break;
}
} while(0);
	r6 = heap32[(fp+-36)];
	r7 = r11 | r10;
	if(r7 !=0) //_LBB197_77
{
	r7 = 0;
	r5 = r5 << 24;
	r5 = r5 >> 24;
	if(r5 <1) //_LBB197_79
{
	r9 = r16 & 255;
	r5 = r9 != r7;
	r5 = r5 & 1;
	if(r9 !=0) //_LBB197_81
{
__label__ = 75;
}
else{
__label__ = 76;
}
}
else{
__label__ = 75;
}
switch(__label__ ){//multiple entries
case 75: 
	r4 = (r4 - r5)&-1;
	r10 = (r10 - r5)&-1;
	r9 = (r6 + r5)&-1;
	heap32[(fp+-36)] = r9;
break;
}
	r8 = r8 & 255;
	r9 = r8 != r7;
	r7 = r10 == r7;
	r7 = r9 & r7;
	r7 = r7 != 0 ? r11 : r10; 
	r8 = r8 == 0 ? r4 : r11; 
	r9 = r12 & 255;
if(!(r9 !=0)) //_LBB197_85
{
	r10 = r1 & 255;
if(!(r10 !=32)) //_LBB197_85
{
	r11 = sp + -8; 
	r12 = (r7 - r8)&-1;
	heap32[(g0)] = r11;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r12;
	heap32[(g0+3)] = r10;
	write_pad(i7);
	r10 = r_g0;
	if(r10 !=0) //_LBB197_210
{
__label__ = 198;
break _1;
}
}
}
if(!(r5 ==0)) //_LBB197_89
{
	if(r5 <0) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r10 = heap32[(fp+-2)];
	r11 = (r10 + r5)&-1;
	if(uint(r11) <uint(r10)) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r10 = r2 >> 2;
	r11 = heap32[(r10+1)];
	r10 = heap32[(r10)];
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r10;
	__FUNCTION_TABLE__[(r11)>>2](i7);
	r6 = heap32[(fp+-2)];
	r5 = (r6 + r5)&-1;
	heap32[(fp+-2)] = r5;
}
}
}
if(!(r9 !=0)) //_LBB197_92
{
	r5 = r1 & 255;
if(!(r5 ==32)) //_LBB197_92
{
	r6 = sp + -8; 
	r10 = (r7 - r8)&-1;
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r10;
	heap32[(g0+3)] = r5;
	write_pad(i7);
	r5 = r_g0;
	if(r5 !=0) //_LBB197_210
{
__label__ = 198;
break _1;
}
}
}
	r5 = sp + -8; 
	r6 = (r8 - r4)&-1;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r6;
	heap32[(g0+3)] = r14;
	write_pad(i7);
	r14 = r_g0;
	if(r14 !=0) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	if(r4 <0) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r14 = heap32[(fp+-2)];
	r6 = (r14 + r4)&-1;
	if(uint(r6) <uint(r14)) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r14 = r2 >> 2;
	r6 = heap32[(r14+1)];
	r14 = heap32[(r14)];
	r10 = heap32[(fp+-36)];
	heap32[(g0)] = r10;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r14;
	__FUNCTION_TABLE__[(r6)>>2](i7);
	r14 = heap32[(fp+-2)];
	r4 = (r14 + r4)&-1;
	heap32[(fp+-2)] = r4;
	if(r9 ==0) //_LBB197_207
{
continue _1;
}
else{
	r4 = (r7 - r8)&-1;
	r14 = r1 & 255;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r4;
	heap32[(g0+3)] = r14;
	write_pad(i7);
	r4 = r_g0;
	if(r4 ==0) //_LBB197_207
{
continue _1;
}
else{
__label__ = 198;
break _1;
}
}
}
}
}
}
else{
	if(r4 <0) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r14 = heap32[(fp+-2)];
	r1 = (r14 + r4)&-1;
	if(uint(r1) <uint(r14)) //_LBB197_210
{
__label__ = 198;
break _1;
}
else{
	r14 = r2 >> 2;
	r1 = heap32[(r14+1)];
	r14 = heap32[(r14)];
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r14;
	__FUNCTION_TABLE__[(r1)>>2](i7);
	r14 = heap32[(fp+-2)];
	r4 = (r14 + r4)&-1;
	heap32[(fp+-2)] = r4;
continue _1;
}
}
}
}
}
}
switch(__label__ ){//multiple entries
case 197: 
	r0 = heap32[(fp+-2)];
	r_g0 = r0;
	return;
break;
case 198: 
	r0 = -1;
	r_g0 = r0;
	return;
break;
}
}

function fprintf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -32;var g0 = i7>>2; // save stack
	r0 = sp + -8; 
	r1 = r0 >> 2;
	r2 = __fwrite__index__;
	heap32[(fp+-3)] = sp;
	heap32[(r1+1)] = r2;
	heap32[(fp+-2)] = 3;
	r1 = _2E_str26387;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = sp;
	__v_printf(i7);
	return;
}

function vsnprintf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
var __label__ = 0;
	i7 = sp + -40;var g0 = i7>>2; // save stack
	r0 = sp + -16; 
	r1 = heap32[(fp+1)];
	r2 = r0 >> 2;
	r3 = heap32[(fp)];
	heap32[(r2+1)] = 0;
	r4 = (r1 + -1)&-1;
	r5 = 0;
	r6 = sp + -24; 
	r7 = r1 == 0 ? r5 : r4; 
	heap32[(fp+-4)] = r3;
	r8 = r6 >> 2;
	r9 = swrite__index__;
	heap32[(r2+2)] = r7;
	heap32[(r8+1)] = r9;
	heap32[(fp+-6)] = r0;
	r0 = heap32[(fp+2)];
	r2 = heap32[(fp+3)];
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r2;
	__v_printf(i7);
	r0 = r_g0;
if(!(r3 ==0)) //_LBB199_7
{
if(!(r1 ==0)) //_LBB199_7
{
if(!(r0 <0)) //_LBB199_7
{
if(!(r1 ==-1)) //_LBB199_6
{
if(!(uint(r0) <uint(r1))) //_LBB199_6
{
	heap8[r3+r4] = r5;
	r_g0 = r0;
	return;
}
}
	heap8[r3+r0] = r5;
}
}
}
	r_g0 = r0;
	return;
}

function _ZN12mandreel_b64L11b64_encode_EPKhjPcjjPNS_6B64_RCE(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
var __label__ = 0;
	i7 = sp + -32;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = (r0 + 2)&-1;
	r2 = heap32[(fp+4)];
	r1 = Math.floor(uint(r1) / uint(3));
	r3 = heap32[(fp+2)];
	r1 = r1 << 2;
	r4 = r2 >> 2;
	heap32[(r4)] = 0;
_1: do {
if(!(r3 ==0)) //_LBB200_20
{
	r5 = heap32[(fp+3)];
	if(uint(r1) <=uint(r5)) //_LBB200_3
{
	r4 = heap32[(fp)];
	if(uint(r0) >uint(2)) //_LBB200_5
{
	r5 = (r3 + r5)&-1;
	r6 = 0;
	r12 = _ZN12mandreel_b64L9b64_charsE;
_7: while(true){
	r7 = heapU8[r4];
	r8 = heapU8[r4+1];
	r9 = r7 << 4;
	r10 = heapU8[r4+2];
	r11 = r8 << 2;
	r9 = r9 & 48;
	r8 = r8 >>> 4;
	r7 = r7 >>> 2;
	r8 = r9 | r8;
	r9 = r11 & 60;
	r11 = r10 >>> 6;
	r7 = heapU8[r12+r7];
	r9 = r9 | r11;
	r8 = heapU8[r12+r8];
	heap8[r3] = r7;
	r7 = r10 & 63;
	r9 = heapU8[r12+r9];
	heap8[r3+1] = r8;
	r8 = (r3 + 4)&-1;
	r6 = (r6 + 4)&-1;
	r7 = heapU8[r12+r7];
	heap8[r3+2] = r9;
	heap8[r3+3] = r7;
	if(r8 ==r5) //_LBB200_8
{
__label__ = 7;
}
else{
	if(r6 ==0) //_LBB200_9
{
	r7 = 13;
	r8 = (r3 + 6)&-1;
	r6 = 0;
	r9 = 10;
	heap8[r3+4] = r7;
	heap8[r3+5] = r9;
	r3 = r8;
__label__ = 9;
}
else{
__label__ = 7;
}
}
switch(__label__ ){//multiple entries
case 7: 
	r3 = r8;
break;
}
	r0 = (r0 + -3)&-1;
	r4 = (r4 + 3)&-1;
if(!(uint(r0) >uint(2))) //_LBB200_6
{
break _7;
}
}
}
if(!(r0 ==0)) //_LBB200_20
{
	r5 = 0;
_17: while(true){
	r6 = sp + -3; 
	r7 = (r4 - r5)&-1;
	r8 = (r5 + -1)&-1;
	r5 = (r6 - r5)&-1;
	r7 = heapU8[r7];
	heap8[r5] = r7;
	r7 = (r0 + r8)&-1;
	r5 = r8;
if(!(r7 !=0)) //_LBB200_13
{
break _17;
}
}
	if(r0 !=3) //_LBB200_16
{
	r4 = 3;
	r5 = (r4 - r0)&-1;
	r8 = 0;
_22: while(true){
	r7 = (r5 + -1)&-1;
	r5 = (r6 - r5)&-1;
	heap8[r5+3] = r8;
	r5 = r7;
if(!(r7 !=0)) //_LBB200_17
{
break _22;
}
}
	heap32[(g0)] = r6;
	heap32[(g0+1)] = 3;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = 12;
	heap32[(g0+4)] = r2;
	r0 = (r4 - r0)&-1;
	_ZN12mandreel_b64L11b64_encode_EPKhjPcjjPNS_6B64_RCE(i7);
	r4 = 61;
_25: while(true){
	r2 = (r0 + -1)&-1;
	r0 = (r3 - r0)&-1;
	heap8[r0+4] = r4;
	r0 = r2;
	if(r2 !=0) //_LBB200_19
{
continue _25;
}
else{
break _1;
}
}
}
else{
	heap32[(g0)] = r6;
	heap32[(g0+1)] = 3;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = 12;
	heap32[(g0+4)] = r2;
	_ZN12mandreel_b64L11b64_encode_EPKhjPcjjPNS_6B64_RCE(i7);
	r_g0 = r1;
	return;
}
}
}
else{
	heap32[(r4)] = 1;
	r0 = 0;
	r_g0 = r0;
	return;
}
}
} while(0);
	r_g0 = r1;
	return;
}

function _ZN12mandreel_b6410b64_decodeEPKcjPvj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = r0 & 3;
	r2 = 0;
	r1 = r1 != r2;
	r1 = r1 & 1;
	r3 = r0 >>> 2;
	r1 = (r1 + r3)&-1;
	r3 = heap32[(fp+2)];
	r1 = (r1 * 3)&-1;
	if(r3 !=0) //_LBB201_2
{
	r4 = heap32[(fp+3)];
	if(uint(r1) <=uint(r4)) //_LBB201_4
{
	r1 = heap32[(fp)];
	r4 = r3;
	r5 = r2;
_5: while(true){
	if(r0 !=0) //_LBB201_5
{
	r6 = heapU8[r1];
	if(r6 !=61) //_LBB201_7
{
	r7 = _ZN12mandreel_b64L11b64_indexesE;
	r6 = heapU8[r7+r6];
	if(r6 !=255) //_LBB201_9
{
	r5 = 0;
	r7 = sp + -4; 
	heap8[r7+r2] = r6;
__label__ = 8;
}
else{
__label__ = 15;
}
}
else{
	r5 = (r5 + 1)&-1;
	r6 = sp + -4; 
	r7 = 0;
	heap8[r6+r2] = r7;
__label__ = 8;
}
switch(__label__ ){//multiple entries
case 8: 
	r2 = (r2 + 1)&-1;
	if(r2 ==4) //_LBB201_12
{
	r2 = heapU8[sp+-3];
	r6 = heapU8[sp+-4];
	r2 = r2 >>> 4;
	r2 = r2 & 3;
	r6 = r6 << 2;
	r2 = r2 | r6;
	heap8[r4] = r2;
	if(r5 !=2) //_LBB201_14
{
	r2 = heapU8[sp+-2];
	r6 = heapU8[sp+-3];
	r2 = r2 >>> 2;
	r2 = r2 & 15;
	r6 = r6 << 4;
	r2 = r2 | r6;
	heap8[r4+1] = r2;
	if(r5 !=1) //_LBB201_16
{
	r2 = heapU8[sp+-2];
	r7 = heapU8[sp+-1];
	r2 = r2 << 6;
	r6 = (r4 + 3)&-1;
	r2 = (r2 + r7)&-1;
	heap8[r4+2] = r2;
	if(r5 ==0) //_LBB201_18
{
	r2 = 0;
	r4 = r6;
	r5 = r2;
}
else{
__label__ = 18;
break _5;
}
}
else{
__label__ = 12;
break _5;
}
}
else{
__label__ = 10;
break _5;
}
}
break;
}
	r0 = (r0 + -1)&-1;
	r1 = (r1 + 1)&-1;
}
else{
__label__ = 17;
break _5;
}
}
switch(__label__ ){//multiple entries
case 17: 
	r6 = r4;
break;
case 12: 
	r6 = (r4 + 2)&-1;
break;
case 10: 
	r6 = (r4 + 1)&-1;
break;
}
	r1 = (r6 - r3)&-1;
}
else{
	r1 = 0;
}
}
	r_g0 = r1;
	return;
}

function __mandreel_internal_SetResolution(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = _ZL25s_mandreel_internal_width;
	r1 = _ZL26s_mandreel_internal_height;
	r0 = r0 >> 2;
	r2 = heap32[(fp)];
	r1 = r1 >> 2;
	r3 = heap32[(fp+1)];
	heap32[(r0)] = r2;
	heap32[(r1)] = r3;
	return;
}

function __keyEvent(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function __mouseMove(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function __mouseButton(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function __mouseWheelDelta(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function printf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -16408;var g0 = i7>>2; // save stack
	r0 = (sp + 4)&-1;
	heap32[(fp+-4097)] = r0;
	r1 = sp + -16384; 
	r2 = heap32[(fp)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 16384;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r0;
	r0 = g_msgcallback;
	r0 = r0 >> 2;
	vsnprintf(i7);
	r0 = heap32[(r0)];
if(!(r0 ==0)) //_LBB207_2
{
	heap32[(g0)] = r1;
	Mandreel_Debug_PrintfODS(i7);
}
	return;
}

function _printf_error(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -16408;var g0 = i7>>2; // save stack
	r0 = (sp + 4)&-1;
	heap32[(fp+-4097)] = r0;
	r1 = sp + -16384; 
	r2 = heap32[(fp)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 16384;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r0;
	r0 = g_msgcallback;
	r0 = r0 >> 2;
	vsnprintf(i7);
	r0 = heap32[(r0)];
if(!(r0 ==0)) //_LBB208_2
{
	heap32[(g0)] = r1;
	Mandreel_Debug_PrintfODS(i7);
}
	return;
}

function _printf_warning(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + -16408;var g0 = i7>>2; // save stack
	r0 = (sp + 4)&-1;
	heap32[(fp+-4097)] = r0;
	r1 = sp + -16384; 
	r2 = heap32[(fp)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 16384;
	heap32[(g0+2)] = r2;
	heap32[(g0+3)] = r0;
	r0 = g_msgcallback;
	r0 = r0 >> 2;
	vsnprintf(i7);
	r0 = heap32[(r0)];
if(!(r0 ==0)) //_LBB209_2
{
	heap32[(g0)] = r1;
	Mandreel_Debug_PrintfODS(i7);
}
	return;
}

function Mandreel_Debug_PrintfODS(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16432;var g0 = i7>>2; // save stack
	r0 = (sp + 4)&-1;
	r1 = sp + -16; 
	r2 = r1 >> 2;
	heap32[(fp+-4103)] = r0;
	r3 = sp + -16408; 
	heap32[(r2+1)] = 0;
	r4 = sp + -24; 
	heap32[(fp+-4)] = r3;
	r5 = r4 >> 2;
	r6 = swrite__index__;
	heap32[(r2+2)] = 16383;
	heap32[(r5+1)] = r6;
	heap32[(fp+-6)] = r1;
	r1 = heap32[(fp)];
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r0;
	__v_printf(i7);
	r0 = r_g0;
if(!(r0 <0)) //_LBB210_4
{
	if(uint(r0) <uint(16384)) //_LBB210_3
{
	r1 = 0;
	heap8[r3+r0] = r1;
}
else{
	r0 = 0;
	heap8[sp+-25] = r0;
}
}
	heap32[(g0)] = r3;
	__sandbox_OutputDebugString(i7);
	return;
}

function _Z31MandreelDefaultDebugMsgCallbackiPKc(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	heap32[(g0)] = r0;
	Mandreel_Debug_PrintfODS(i7);
	return;
}

function __mandreel_internal_update(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = -32788;
_1: while(true){
	r1 = _ZL10s_aSockets;
	r1 = (r1 - r0)&-1;
	r2 = heapU8[r1];
if(!(r2 ==0)) //_LBB212_3
{
	r1 = r1 >> 2;
	r1 = heap32[(r1+-1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 2048;
	js_mandreel_flash_tcp_update(i7);
}
	r0 = (r0 + -32792)&-1;
	if(r0 !=-295124) //_LBB212_1
{
continue _1;
}
else{
break _1;
}
}
	r0 = _ZL7g_bInit_2E_b;
	r1 = heapU8[r0];
	if(r1 != 0) //_LBB212_6
{
	mandreel_audio_update(i7);
	r1 = sp + -8; 
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 0;
	gettimeofday(i7);
	r2 = heap32[(fp+-2)];
	r3 = r2 >> 31;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = 1000000;
	heap32[(g0+3)] = 0;
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
	__muldi3(i7);
	r4 = 0;
	r5 = (r_g0 + r1)&-1;
	r6 = 1;
	r7 = r1 >> 31;
	r2 = uint(r5) < uint(r_g0) ? r6 : r4; 
	r3 = (r_g1 + r7)&-1;
	r1 = uint(r5) < uint(r1) ? r6 : r2; 
	r1 = (r3 + r1)&-1;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 1000;
	heap32[(g0+3)] = 0;
	__udivdi3(i7);
	r1 = r_g0;
	r2 = _ZL11g_aChannels;
_9: while(true){
	if(r4 <32) //_LBB212_7
{
	r3 = r2 >> 2;
	r5 = heap32[(r3+72)];
if(!(r5 !=1)) //_LBB212_31
{
	r5 = _ZL11g_aChannels;
	r7 = (r4 * 292)&-1;
	r5 = (r5 + r7)&-1;
	r7 = heapU8[r5+268];
if(!(r7 !=0)) //_LBB212_31
{
	r7 = heap32[(r3+71)];
	if(r7 ==-1) //_LBB212_11
{
	r7 = heapU8[r0];
	if(r7 !=1) //_LBB212_13
{
__label__ = 12;
break _9;
}
else{
	r7 = _ZL21g_pFirstSoundDuration;
_18: while(true){
	r7 = r7 >> 2;
	r7 = heap32[(r7)];
	if(r7 !=0) //_LBB212_14
{
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r2;
	strcmp(i7);
	r8 = r_g0;
	if(r8 !=0) //_LBB212_16
{
	r7 = (r7 + 260)&-1;
}
else{
__label__ = 14;
break _18;
}
}
else{
__label__ = 17;
break _18;
}
}
switch(__label__ ){//multiple entries
case 17: 
	r7 = _2E_str10457;
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r2;
	r7 = 0;
	_printf_warning(i7);
break;
case 14: 
	r7 = r7 >> 2;
	r7 = heap32[(r7+64)];
break;
}
	heap32[(r3+71)] = r7;
}
}
	r8 = heap32[(r3+70)];
	r7 = (r8 + r7)&-1;
if(!(uint(r7) >uint(r1))) //_LBB212_31
{
	r7 = heapU8[r0];
	if(r7 != 0) //_LBB212_23
{
	r7 = (r4 + -1)&-1;
if(!(uint(r7) >uint(30))) //_LBB212_31
{
	r7 = heapU8[r5+269];
if(!(r7 !=0)) //_LBB212_31
{
if(!(uint(r4) >uint(31))) //_LBB212_27
{
	r7 = heap32[(r3+68)];
	r8 = heap32[(r3+69)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r8;
	heap32[(g0+2)] = r7;
	mandreel_audio_stopChannel(i7);
	heap32[(r3+72)] = 0;
	heap32[(r3+68)] = -1;
}
	r3 = _ZL15g_iFreeChannels;
	r3 = r3 >> 2;
	heap8[r5+269] = r6;
	r5 = heap32[(r3)];
	r7 = (r5 + -1)&-1;
_34: do {
if(!(r7 <0)) //_LBB212_30
{
	r7 = r5;
_36: while(true){
	r8 = _ZL15g_aFreeChannels;
	r9 = r7 << 2;
	r8 = (r8 + r9)&-1;
	r8 = r8 >> 2;
	r9 = heap32[(r8+-1)];
	r7 = (r7 + -1)&-1;
	heap32[(r8)] = r9;
if(!(r7 !=0)) //_LBB212_29
{
break _34;
}
}
}
} while(0);
	r7 = _ZL15g_aFreeChannels;
	r7 = r7 >> 2;
	r5 = (r5 + 1)&-1;
	heap32[(r7)] = r4;
	heap32[(r3)] = r5;
}
}
}
else{
__label__ = 21;
break _9;
}
}
}
}
	r4 = (r4 + 1)&-1;
	r2 = (r2 + 292)&-1;
}
else{
__label__ = 32;
break _9;
}
}
switch(__label__ ){//multiple entries
case 32: 
	return;
break;
case 12: 
	r7 = _2E_str447;
	r0 = _2E_str1448;
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = 267;
	_assert(i7);
break;
case 21: 
	r0 = _2E_str447;
	r1 = _2E_str1448;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 511;
	_assert(i7);
break;
}
}
else{
	r0 = _2E_str447;
	r1 = _2E_str1448;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 287;
	_assert(i7);
}
}

function __mandreel_internal_init(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = __mandreel_internal_SetResolution__index__;
	r1 = _ZZ24__mandreel_internal_initE54s_723478567_mandreel___mandreel_internal_SetResolution;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	r0 = g_msgcallback;
	r0 = r0 >> 2;
	r1 = _Z31MandreelDefaultDebugMsgCallbackiPKc__index__;
	iMandreelRegisterExternalCallback(i7);
	heap32[(r0)] = r1;
	Mandreel_Audio_Init_(i7);
	__mandreel_internal_CreateWindow(i7);
	return;
}

function __forceSuperLink(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = __mandreel_internal_SetResolution__index__;
	r1 = _ZZ24__mandreel_internal_initE54s_723478567_mandreel___mandreel_internal_SetResolution;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	r0 = g_msgcallback;
	r0 = r0 >> 2;
	r1 = _Z31MandreelDefaultDebugMsgCallbackiPKc__index__;
	iMandreelRegisterExternalCallback(i7);
	heap32[(r0)] = r1;
	Mandreel_Audio_Init_(i7);
	__mandreel_internal_CreateWindow(i7);
	return;
}

function Mandreel_Audio_Init_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
	var r17;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = _ZL7g_bInit_2E_b;
	r1 = heapU8[r0];
	if(r1 !=1) //_LBB215_2
{
	r1 = 1;
	heap8[r0] = r1;
	r0 = 0;
	mandreel_audio_isLogEnabled(i7);
	r2 = r_g0 != r0;
	r3 = _ZL6g_bLog;
	r2 = r2 & 1;
	heap8[r3] = r2;
	mandreel_audio_useMusicFunctions(i7);
	r2 = heapU8[r3];
	if(r2 !=0) //_LBB215_4
{
	r2 = _2E_str21468;
	heap32[(g0)] = r2;
	printf(i7);
}
else{
	r0 = 0;
}
_6: while(true){
	r2 = (r0 * 73)&-1;
	r3 = _ZL11g_aChannels;
	r2 = r2 << 2;
	r2 = (r3 + r2)&-1;
	r4 = (r0 * 292)&-1;
	r2 = r2 >> 2;
	r5 = _ZL15g_aFreeChannels;
	r6 = r0 << 2;
	r5 = (r5 + r6)&-1;
	r3 = (r3 + r4)&-1;
	heap32[(r2+69)] = r0;
	r2 = (r0 + 1)&-1;
	r4 = r5 >> 2;
	heap8[r3+269] = r1;
	heap32[(r4)] = r0;
	r0 = r2;
if(!(r2 !=32)) //_LBB215_5
{
break _6;
}
}
	r0 = _ZL15g_iFreeChannels;
	r0 = r0 >> 2;
	heap32[(r0)] = 32;
	mandreel_audio_init(i7);
	r0 = _2E_str11458;
	r2 = _2E_str1645;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r2;
	fopen(i7);
	r0 = r_g0;
	if(r0 !=0) //_LBB215_8
{
	if(uint(r0) <uint(10)) //_LBB215_10
{
	r2 = _ZL13s_file_stdout;
	r3 = r2 >> 2;
	r3 = heap32[(r3)];
	r3 = r3 >> 2;
	r3 = heap32[(r3+7)];
	heap32[(g0)] = r2;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = 2;
	__FUNCTION_TABLE__[(r3)>>2](i7);
}
else{
	r2 = r0 >> 2;
	r2 = heap32[(r2)];
	r2 = r2 >> 2;
	r2 = heap32[(r2+7)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = 2;
	__FUNCTION_TABLE__[(r2)>>2](i7);
	r2 = r0;
}
	r3 = r2 >> 2;
	r3 = heap32[(r3)];
	r3 = r3 >> 2;
	r3 = heap32[(r3+5)];
	heap32[(g0)] = r2;
	__FUNCTION_TABLE__[(r3)>>2](i7);
	r2 = r_g0;
	if(uint(r0) >uint(9)) //_LBB215_13
{
	r3 = r0;
}
else{
	r3 = _ZL13s_file_stdout;
}
	r4 = r3 >> 2;
	r4 = heap32[(r4)];
	r4 = r4 >> 2;
	r4 = heap32[(r4+7)];
	heap32[(g0)] = r3;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = 0;
	__FUNCTION_TABLE__[(r4)>>2](i7);
	r3 = (r2 + 1)&-1;
	heap32[(g0)] = r3;
	malloc(i7);
	r3 = r_g0;
	if(uint(r0) <uint(10)) //_LBB215_16
{
	r4 = _ZL13s_file_stdout;
	r5 = r4 >> 2;
	r5 = heap32[(r5)];
	r5 = r5 >> 2;
	r5 = heap32[(r5+1)];
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = 1;
	heap32[(g0+3)] = r2;
	r6 = 0;
	__FUNCTION_TABLE__[(r5)>>2](i7);
	heap8[r3+r2] = r6;
}
else{
	r4 = r0 >> 2;
	r4 = heap32[(r4)];
	r4 = r4 >> 2;
	r4 = heap32[(r4+1)];
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r3;
	heap32[(g0+2)] = 1;
	heap32[(g0+3)] = r2;
	r5 = 0;
	__FUNCTION_TABLE__[(r4)>>2](i7);
	heap8[r3+r2] = r5;
	r4 = r0;
}
	r5 = r4 >> 2;
	r5 = heap32[(r5)];
	r5 = r5 >> 2;
	r5 = heap32[(r5+4)];
	heap32[(g0)] = r4;
	__FUNCTION_TABLE__[(r5)>>2](i7);
if(!(uint(r0) <uint(10))) //_LBB215_19
{
	heap32[(g0)] = r4;
	_ZdlPv(i7);
}
if(!(r3 ==0)) //_LBB215_138
{
_28: do {
if(!(r2 <1)) //_LBB215_137
{
	r0 = (r3 + 1)&-1;
	r4 = 0;
_30: while(true){
	r5 = (r3 + r4)&-1;
	r6 = heapU8[r3+r4];
if(!(r6 ==13)) //_LBB215_24
{
	if(r4 <r2) //_LBB215_25
{
	r6 = r4;
_35: while(true){
	r4 = (r6 + 1)&-1;
	r6 = heapU8[r0+r6];
	if(r6 ==13) //_LBB215_28
{
break _35;
}
else{
	r6 = r4;
if(!(r4 <r2)) //_LBB215_26
{
break _35;
}
}
}
}
}
	r6 = _ZL10strtok_pos;
	r7 = 0;
	r6 = r6 >> 2;
	heap8[r3+r4] = r7;
	r8 = heap32[(r6)];
	r4 = (r4 + 2)&-1;
	r5 = r5 == 0 ? r8 : r5; 
_39: while(true){
	r8 = heapU8[r5];
	if(r8 ==0) //_LBB215_46
{
__label__ = 44;
break _39;
}
else{
	r9 = r7;
_42: while(true){
	if(r9 ==-1) //_LBB215_35
{
__label__ = 34;
break _39;
}
else{
	r10 = _2E_str4133;
	r10 = (r10 - r9)&-1;
	r11 = r8 & 255;
	r10 = heapU8[r10];
	if(r11 !=r10) //_LBB215_29
{
	r9 = (r9 + -1)&-1;
}
else{
break _42;
}
}
}
	r5 = (r5 + 1)&-1;
}
}
_47: do {
switch(__label__ ){//multiple entries
case 34: 
	if(r8 ==0) //_LBB215_46
{
__label__ = 44;
}
else{
	r7 = r5;
_50: while(true){
	r8 = heapU8[r7];
	if(r8 ==0) //_LBB215_43
{
break _50;
}
else{
	r9 = r1;
_53: while(true){
	if(r9 !=0) //_LBB215_37
{
	r10 = _2E_str4133;
	r10 = (r10 - r9)&-1;
	r11 = r8 & 255;
	r10 = heapU8[r10+1];
	if(r11 ==r10) //_LBB215_43
{
break _50;
}
else{
	r9 = (r9 + -1)&-1;
}
}
else{
break _53;
}
}
	r7 = (r7 + 1)&-1;
}
}
	r8 = heapU8[r7];
	if(r8 !=0) //_LBB215_45
{
	r8 = (r7 + 1)&-1;
	r9 = 0;
	heap8[r7] = r9;
	r7 = r8;
}
	heap32[(r6)] = r7;
	r8 = _2E_str14461;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r5;
	strcmp(i7);
	r8 = r_g0;
	if(r8 !=0) //_LBB215_70
{
	r8 = _2E_str17464;
	heap32[(g0)] = r8;
	heap32[(g0+1)] = r5;
	strcmp(i7);
	r5 = r_g0;
	if(r5 !=0) //_LBB215_69
{
__label__ = 66;
}
else{
	r5 = 0;
	r7 = (r5 - r7)&-1;
	r8 = r7;
	r9 = r7;
	r10 = r7;
	r11 = r7;
	r12 = r7;
	r13 = r7;
_65: while(true){
	r14 = (r5 - r7)&-1;
	r14 = heapU8[r14];
	if(r14 ==0) //_LBB215_89
{
__label__ = 85;
break _65;
}
else{
	r15 = r5;
_68: while(true){
	if(r15 ==-1) //_LBB215_78
{
__label__ = 75;
break _65;
}
else{
	r16 = _2E_str4133;
	r16 = (r16 - r15)&-1;
	r17 = r14 & 255;
	r16 = heapU8[r16];
	if(r17 !=r16) //_LBB215_72
{
	r15 = (r15 + -1)&-1;
}
else{
break _68;
}
}
}
	r13 = (r13 + -1)&-1;
	r12 = (r12 + -1)&-1;
	r11 = (r11 + -1)&-1;
	r10 = (r10 + -1)&-1;
	r9 = (r9 + -1)&-1;
	r8 = (r8 + -1)&-1;
	r7 = (r7 + -1)&-1;
}
}
_73: do {
switch(__label__ ){//multiple entries
case 75: 
	if(r14 ==0) //_LBB215_89
{
__label__ = 85;
}
else{
	r8 = 0;
	r5 = 2;
	r7 = (r8 - r13)&-1;
	r5 = (r5 - r13)&-1;
_76: while(true){
	r14 = (r8 - r9)&-1;
	r14 = heapU8[r14];
	if(r14 ==0) //_LBB215_86
{
break _76;
}
else{
	r15 = 1;
_79: while(true){
	if(r15 !=0) //_LBB215_80
{
	r16 = _2E_str4133;
	r16 = (r16 - r15)&-1;
	r17 = r14 & 255;
	r16 = heapU8[r16+1];
	if(r17 ==r16) //_LBB215_86
{
break _76;
}
else{
	r15 = (r15 + -1)&-1;
}
}
else{
break _79;
}
}
	r8 = (r8 + 1)&-1;
}
}
	r9 = (r8 - r10)&-1;
	r10 = heapU8[r9];
	if(r10 !=0) //_LBB215_88
{
	r8 = (r8 - r11)&-1;
	r8 = (r8 + 1)&-1;
	r10 = 0;
	heap8[r9] = r10;
	r9 = r8;
}
	r8 = 0;
	r13 = r13 == r8;
	heap32[(r6)] = r9;
_88: while(true){
	r10 = heapU8[r9];
	if(r10 ==0) //_LBB215_108
{
__label__ = 102;
break _88;
}
else{
	r11 = r8;
_91: while(true){
	if(r11 ==-1) //_LBB215_97
{
__label__ = 93;
break _88;
}
else{
	r14 = _2E_str4133;
	r14 = (r14 - r11)&-1;
	r15 = r10 & 255;
	r14 = heapU8[r14];
	if(r15 !=r14) //_LBB215_91
{
	r11 = (r11 + -1)&-1;
}
else{
break _91;
}
}
}
	r9 = (r9 + 1)&-1;
}
}
switch(__label__ ){//multiple entries
case 93: 
if(!(r10 ==0)) //_LBB215_108
{
_98: while(true){
	r8 = heapU8[r9];
	if(r8 ==0) //_LBB215_105
{
break _98;
}
else{
	r10 = 1;
_101: while(true){
	if(r10 !=0) //_LBB215_99
{
	r11 = _2E_str4133;
	r11 = (r11 - r10)&-1;
	r14 = r8 & 255;
	r11 = heapU8[r11+1];
	if(r14 ==r11) //_LBB215_105
{
break _98;
}
else{
	r10 = (r10 + -1)&-1;
}
}
else{
break _101;
}
}
	r9 = (r9 + 1)&-1;
}
}
	r8 = heapU8[r9];
	if(r8 !=0) //_LBB215_107
{
	r8 = (r9 + 1)&-1;
	r10 = 0;
	heap8[r9] = r10;
	r9 = r8;
}
	heap32[(r6)] = r9;
_110: while(true){
	r8 = heapU8[r9];
	if(r8 ==0) //_LBB215_127
{
__label__ = 120;
break _110;
}
else{
	r10 = 0;
_113: while(true){
	if(r10 ==-1) //_LBB215_116
{
__label__ = 110;
break _110;
}
else{
	r11 = _2E_str4133;
	r11 = (r11 - r10)&-1;
	r14 = r8 & 255;
	r11 = heapU8[r11];
	if(r14 !=r11) //_LBB215_110
{
	r10 = (r10 + -1)&-1;
}
else{
break _113;
}
}
}
	r9 = (r9 + 1)&-1;
}
}
switch(__label__ ){//multiple entries
case 110: 
if(!(r8 ==0)) //_LBB215_127
{
	r7 = r9;
_121: while(true){
	r13 = heapU8[r7];
	if(r13 ==0) //_LBB215_124
{
break _121;
}
else{
	r8 = 1;
_124: while(true){
	if(r8 !=0) //_LBB215_118
{
	r10 = _2E_str4133;
	r10 = (r10 - r8)&-1;
	r11 = r13 & 255;
	r10 = heapU8[r10+1];
	if(r11 ==r10) //_LBB215_124
{
break _121;
}
else{
	r8 = (r8 + -1)&-1;
}
}
else{
break _124;
}
}
	r7 = (r7 + 1)&-1;
}
}
	r13 = heapU8[r7];
	if(r13 !=0) //_LBB215_126
{
	r13 = (r7 + 1)&-1;
	r8 = 0;
	heap8[r7] = r8;
	r7 = r13;
}
	heap32[(r6)] = r7;
	heap32[(g0)] = 264;
	_Znwj(i7);
	r7 = r_g0;
	heap32[(g0)] = r9;
	heap32[(g0+1)] = 0;
	r13 = 1;
	r6 = r7 >> 2;
	strtol(i7);
	r13 = (r13 - r12)&-1;
	heap32[(r6+64)] = r_g0;
	r13 = heapU8[r13];
_133: do {
	if(r13 ==0) //_LBB215_130
{
	r6 = r7;
}
else{
	r6 = r7;
_136: while(true){
	r8 = r13 & 255;
	if(r8 !=92) //_LBB215_133
{
	r8 = r13 << 24;
	r8 = r8 >> 24;
	r8 = (r8 + -65)&-1;
	r9 = 26;
	r10 = (r13 + 32)&-1;
	r13 = uint(r8) < uint(r9) ? r10 : r13; 
}
else{
	r13 = 47;
}
	heap8[r6] = r13;
	r13 = heapU8[r5];
	r6 = (r6 + 1)&-1;
	r5 = (r5 + 1)&-1;
if(!(r13 !=0)) //_LBB215_131
{
break _133;
}
}
}
} while(0);
	r13 = _ZL21g_pFirstSoundDuration;
	r5 = 0;
	r13 = r13 >> 2;
	heap8[r6] = r5;
	r5 = r7 >> 2;
	r6 = heap32[(r13)];
	heap32[(r5+65)] = r6;
	heap32[(r13)] = r7;
__label__ = 66;
break _47;
}
break;
}
	heap32[(r6)] = r9;
__label__ = 129;
break _73;
}
break;
}
	heap32[(r6)] = r9;
__label__ = 129;
}
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 85: 
	r7 = 0;
	r13 = 1;
	r5 = (r7 - r8)&-1;
	heap32[(r6)] = r5;
break;
}
	r5 = _2E_str18465;
	r6 = _2E_str19466;
	r5 = r13 != 0 ? r5 : r7; 
	heap32[(g0)] = r6;
	heap32[(g0+1)] = r5;
	_printf_warning(i7);
__label__ = 66;
break _47;
}
}
else{
_148: while(true){
	r5 = heapU8[r7];
	if(r5 ==0) //_LBB215_55
{
__label__ = 52;
break _148;
}
else{
	r8 = 0;
_151: while(true){
	if(r8 ==-1) //_LBB215_56
{
__label__ = 53;
break _148;
}
else{
	r9 = _2E_str4133;
	r9 = (r9 - r8)&-1;
	r10 = r5 & 255;
	r9 = heapU8[r9];
	if(r10 !=r9) //_LBB215_49
{
	r8 = (r8 + -1)&-1;
}
else{
break _151;
}
}
}
	r7 = (r7 + 1)&-1;
}
}
switch(__label__ ){//multiple entries
case 53: 
	if(r5 ==0) //_LBB215_55
{
__label__ = 52;
}
else{
	r8 = r7;
_159: while(true){
	r5 = heapU8[r8];
	if(r5 ==0) //_LBB215_64
{
break _159;
}
else{
	r9 = 1;
_162: while(true){
	if(r9 !=0) //_LBB215_58
{
	r10 = _2E_str4133;
	r10 = (r10 - r9)&-1;
	r11 = r5 & 255;
	r10 = heapU8[r10+1];
	if(r11 ==r10) //_LBB215_64
{
break _159;
}
else{
	r9 = (r9 + -1)&-1;
}
}
else{
break _162;
}
}
	r8 = (r8 + 1)&-1;
}
}
	r5 = heapU8[r8];
	if(r5 !=0) //_LBB215_66
{
	r9 = (r8 + 1)&-1;
	r5 = 0;
	heap8[r8] = r5;
	r5 = r7;
	r7 = r9;
__label__ = 64;
}
else{
	r5 = r7;
	r7 = r8;
__label__ = 64;
}
}
break;
}
switch(__label__ ){//multiple entries
case 52: 
	r5 = 0;
break;
}
	heap32[(r6)] = r7;
	r6 = _2E_str15462;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r6;
	strcmp(i7);
	r7 = r_g0;
	if(r7 ==0) //_LBB215_69
{
__label__ = 66;
}
else{
	r7 = _2E_str16463;
	heap32[(g0)] = r7;
	heap32[(g0+1)] = r5;
	heap32[(g0+2)] = r6;
	_printf_error(i7);
__label__ = 66;
}
}
}
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 44: 
	heap32[(r6)] = r5;
break;
}
if(!(r4 <r2)) //_LBB215_22
{
break _28;
}
}
}
} while(0);
	heap32[(g0)] = r3;
	free(i7);
}
	return;
}
else{
	r0 = _2E_str12459;
	heap32[(g0)] = r0;
	_printf_error(i7);
	return;
}
}
else{
	r0 = _2E_str20467;
	r1 = _2E_str1448;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = 233;
	_assert(i7);
}
}

function __extendsfdf2(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 & 2147483647;
	r2 = r0 & -2147483648;
	r3 = (r1 + -8388608)&-1;
	if(uint(r3) >uint(2130706431)) //_LBB216_2
{
	if(uint(r1) <uint(2139095040)) //_LBB216_4
{
	if(r1 !=0) //_LBB216_6
{
	r0 = r1 >>> 1;
	r0 = r1 | r0;
	r3 = r0 >>> 2;
	r0 = r0 | r3;
	r3 = r0 >>> 4;
	r0 = r0 | r3;
	r3 = r0 >>> 8;
	r0 = r0 | r3;
	r3 = r0 >>> 16;
	r0 = r0 | r3;
	r3 = r0 ^ -1;
	r4 = 1431655765;
	r3 = r3 >>> 1;
	r0 = r4 & (~r0);
	r3 = r3 & 1431655765;
	r0 = (r0 + r3)&-1;
	r3 = r0 >>> 2;
	r0 = r0 & 858993459;
	r3 = r3 & 858993459;
	r0 = (r0 + r3)&-1;
	r3 = r0 >>> 4;
	r0 = r0 & 252645135;
	r3 = r3 & 252645135;
	r0 = (r0 + r3)&-1;
	r3 = r0 >>> 8;
	r0 = r0 & 16711935;
	r3 = r3 & 16711935;
	r0 = (r0 + r3)&-1;
	r3 = r0 & 65535;
	r0 = r0 >>> 16;
	r0 = (r3 + r0)&-1;
	r3 = (r0 + 21)&-1;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = r3;
	r3 = 905;
	__ashldi3(i7);
	r1 = r_g0;
	r0 = (r3 - r0)&-1;
	r3 = r_g1 ^ 1048576;
	r0 = r0 << 20;
	r0 = r3 | r0;
}
else{
	r1 = 0;
	r0 = r1;
}
}
else{
	r1 = r0 >>> 3;
	r3 = r1 & 524288;
	r1 = r0 & 4194303;
	r0 = r3 | 2146435072;
}
}
else{
	r0 = r1 >>> 3;
	r1 = r1 << 29;
	r0 = (r0 + 939524096)&-1;
}
	r3 = sp + -8; 
	r3 = r3 >> 2;
	r0 = r0 | r2;
	heap32[(fp+-2)] = r1;
	heap32[(r3+1)] = r0;
	f0 = llvm_readDouble((sp+-8));
	f_g0 = f0;
	return;
}

function __fixdfsi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = sp + 0; 
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	r1 = r0 >>> 20;
	r1 = r1 & 2047;
	r2 = r0 & 1048575;
	r3 = -1;
	r4 = 1;
	r5 = (r1 + -1023)&-1;
	r0 = r0 < 0 ? r3 : r4; 
	r3 = heap32[(fp)];
	r2 = r2 | 1048576;
	if(uint(r5) >uint(51)) //_LBB217_2
{
	if(r5 <0) //_LBB217_5
{
	r0 = 0;
	r_g0 = r0;
	return;
}
else{
	r1 = (r1 + -1075)&-1;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r1;
	__ashldi3(i7);
}
}
else{
	r5 = 1075;
	r1 = (r5 - r1)&-1;
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r1;
	__lshrdi3(i7);
}
	heap32[(g0)] = r_g0;
	heap32[(g0+1)] = r_g1;
	heap32[(g0+2)] = r0;
	heap32[(g0+3)] = r0;
	__muldi3(i7);
	return;
}

function __floatsidf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var f0;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	if(r0 !=0) //_LBB218_2
{
	r1 = r0 >> 31;
	r2 = (r0 + r1)&-1;
	r1 = r2 ^ r1;
	r2 = r1 >>> 1;
	r2 = r1 | r2;
	r3 = r2 >>> 2;
	r2 = r2 | r3;
	r3 = r2 >>> 4;
	r2 = r2 | r3;
	r3 = r2 >>> 8;
	r2 = r2 | r3;
	r3 = r2 >>> 16;
	r2 = r2 | r3;
	r3 = r2 ^ -1;
	r4 = 1431655765;
	r3 = r3 >>> 1;
	r2 = r4 & (~r2);
	r3 = r3 & 1431655765;
	r2 = (r2 + r3)&-1;
	r3 = r2 >>> 2;
	r2 = r2 & 858993459;
	r3 = r3 & 858993459;
	r2 = (r2 + r3)&-1;
	r3 = r2 >>> 4;
	r2 = r2 & 252645135;
	r3 = r3 & 252645135;
	r2 = (r2 + r3)&-1;
	r3 = r2 >>> 8;
	r2 = r2 & 16711935;
	r3 = r3 & 16711935;
	r2 = (r2 + r3)&-1;
	r3 = r2 & 65535;
	r2 = r2 >>> 16;
	r4 = 31;
	r2 = (r3 + r2)&-1;
	r3 = 52;
	r4 = (r4 - r2)&-1;
	r3 = (r3 - r4)&-1;
	heap32[(g0)] = r1;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = r3;
	r1 = 1054;
	__ashldi3(i7);
	r1 = (r1 - r2)&-1;
	r2 = r_g1 ^ 1048576;
	r1 = r1 << 20;
	r4 = sp + -8; 
	r1 = (r2 + r1)&-1;
	r0 = r0 & -2147483648;
	r2 = r4 >> 2;
	r0 = r1 | r0;
	heap32[(fp+-2)] = r_g0;
	heap32[(r2+1)] = r0;
	f0 = llvm_readDouble((sp+-8));
	f_g0 = f0;
	return;
}
else{
	f0 =                         0;
	f_g0 = f0;
	return;
}
}

function __floatunsidf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var f0;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	if(r0 !=0) //_LBB219_2
{
	r1 = r0 >>> 1;
	r1 = r0 | r1;
	r2 = r1 >>> 2;
	r1 = r1 | r2;
	r2 = r1 >>> 4;
	r1 = r1 | r2;
	r2 = r1 >>> 8;
	r1 = r1 | r2;
	r2 = r1 >>> 16;
	r1 = r1 | r2;
	r2 = r1 ^ -1;
	r3 = 1431655765;
	r2 = r2 >>> 1;
	r1 = r3 & (~r1);
	r2 = r2 & 1431655765;
	r1 = (r1 + r2)&-1;
	r2 = r1 >>> 2;
	r1 = r1 & 858993459;
	r2 = r2 & 858993459;
	r1 = (r1 + r2)&-1;
	r2 = r1 >>> 4;
	r1 = r1 & 252645135;
	r2 = r2 & 252645135;
	r1 = (r1 + r2)&-1;
	r2 = r1 >>> 8;
	r1 = r1 & 16711935;
	r2 = r2 & 16711935;
	r1 = (r1 + r2)&-1;
	r2 = r1 & 65535;
	r1 = r1 >>> 16;
	r3 = 31;
	r1 = (r2 + r1)&-1;
	r2 = 52;
	r3 = (r3 - r1)&-1;
	r2 = (r2 - r3)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = 0;
	heap32[(g0+2)] = r2;
	r0 = 1054;
	__ashldi3(i7);
	r0 = (r0 - r1)&-1;
	r1 = sp + -8; 
	r3 = r_g1 ^ 1048576;
	r0 = r0 << 20;
	r1 = r1 >> 2;
	r0 = (r3 + r0)&-1;
	heap32[(fp+-2)] = r_g0;
	heap32[(r1+1)] = r0;
	f0 = llvm_readDouble((sp+-8));
	f_g0 = f0;
	return;
}
else{
	f0 =                         0;
	f_g0 = f0;
	return;
}
}

function __truncdfsf2(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var f0;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = sp + 0; 
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	r1 = r0 & 2147483647;
	r2 = heap32[(fp)];
	r3 = (r1 + -940572672)&-1;
	r4 = (r1 + -1206910976)&-1;
_1: do {
	if(uint(r3) >=uint(r4)) //_LBB220_6
{
	r3 = 0;
	r4 = 2146435072;
	r5 = r2 == r3;
	r4 = uint(r1) < uint(r4);
	r4 = r1 == 2146435072 ? r5 : r4; 
	if(r4 != 0) //_LBB220_8
{
	r4 = 1206910976;
	r4 = uint(r1) < uint(r4);
	r4 = r1 == 1206910976 ? r5 : r4; 
	if(r4 != 0) //_LBB220_10
{
	r4 = 897;
	r1 = r1 >>> 20;
	r1 = (r4 - r1)&-1;
	if(r1 <53) //_LBB220_12
{
	r4 = r0 & 1048575;
	r4 = r4 | 1048576;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r1;
	__lshrdi3(i7);
	r5 = r_g0;
	r6 = r_g1;
	r7 = 64;
	r1 = (r7 - r1)&-1;
	heap32[(g0)] = r2;
	heap32[(g0+1)] = r4;
	heap32[(g0+2)] = r1;
	__ashldi3(i7);
	r1 = r_g0 | r_g1;
	r1 = r1 != r3;
	r1 = r1 & 1;
	r2 = r5 & 536870911;
	r4 = r5 >>> 29;
	r5 = r6 << 3;
	r1 = r1 | r2;
	r2 = r4 | r5;
	if(uint(r1) <uint(268435457)) //_LBB220_14
{
	r1 = r1 ^ 268435456;
	r3 = r1 | r3;
	if(r3 ==0) //_LBB220_16
{
	r3 = r2 & 1;
	r3 = (r3 + r2)&-1;
}
else{
	r3 = r2;
}
}
else{
	r3 = (r2 + 1)&-1;
}
}
else{
break _1;
}
}
else{
	r3 = 2139095040;
}
}
else{
	r1 = r2 & 4194303;
	r3 = r1 | 2143289344;
}
}
else{
	r1 = r2 >>> 29;
	r3 = r0 << 3;
	r1 = r1 | r3;
	r2 = r2 & 536870911;
	if(uint(r2) <uint(268435457)) //_LBB220_3
{
	r3 = (r1 + 1073741824)&-1;
	r1 = 0;
	r2 = r2 ^ 268435456;
	r1 = r2 | r1;
	if(r1 ==0) //_LBB220_5
{
	r1 = r3 & 1;
	r3 = (r1 + r3)&-1;
}
}
else{
	r3 = (r1 + 1073741825)&-1;
}
}
} while(0);
	r0 = r0 & -2147483648;
	r0 = r3 | r0;
	heap32[(fp+-1)] = r0;
	f0 = heapFloat[(fp+-1)];
	f_g0 = f0;
	return;
}

function __fixunsdfsi(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = sp + 0; 
	r0 = r0 >> 2;
	r0 = heap32[(r0+1)];
	r1 = r0 >>> 20;
	r1 = r1 & 2047;
	r2 = (r1 + -1023)&-1;
if(!(r2 <0)) //_LBB221_3
{
if(!(r0 <0)) //_LBB221_3
{
	r2 = heap32[(fp)];
	r2 = r2 >>> 21;
	r0 = r0 << 11;
	r0 = r2 | r0;
	r2 = 1054;
	r0 = r0 | -2147483648;
	r1 = (r2 - r1)&-1;
	r0 = r0 >>> r1;
	r_g0 = r0;
	return;
}
}
	r0 = 0;
	r_g0 = r0;
	return;
}

function __floatundisf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var f0;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = r0 | r1;
	if(r2 ==0) //_LBB222_12
{
	f0 =                         0;
	f_g0 = f0;
	return;
}
else{
	r2 = r0 >>> 1;
	r3 = r1 >>> 1;
	r2 = r0 | r2;
	r3 = r1 | r3;
	r4 = r2 >>> 2;
	r5 = r3 >>> 2;
	r2 = r2 | r4;
	r3 = r3 | r5;
	r4 = r2 >>> 4;
	r5 = r3 >>> 4;
	r2 = r2 | r4;
	r3 = r3 | r5;
	r4 = r2 >>> 8;
	r5 = r3 >>> 8;
	r2 = r2 | r4;
	r3 = r3 | r5;
	r4 = r2 >>> 16;
	r5 = r3 >>> 16;
	r2 = r2 | r4;
	r3 = r3 | r5;
	r4 = r2 ^ -1;
	r5 = 1431655765;
	r6 = r3 ^ -1;
	r4 = r4 >>> 1;
	r6 = r6 >>> 1;
	r2 = r5 & (~r2);
	r4 = r4 & 1431655765;
	r2 = (r2 + r4)&-1;
	r3 = r5 & (~r3);
	r4 = r6 & 1431655765;
	r3 = (r3 + r4)&-1;
	r4 = r2 >>> 2;
	r5 = r3 >>> 2;
	r2 = r2 & 858993459;
	r4 = r4 & 858993459;
	r2 = (r2 + r4)&-1;
	r3 = r3 & 858993459;
	r4 = r5 & 858993459;
	r3 = (r3 + r4)&-1;
	r4 = r2 >>> 4;
	r5 = r3 >>> 4;
	r2 = r2 & 252645135;
	r4 = r4 & 252645135;
	r2 = (r2 + r4)&-1;
	r3 = r3 & 252645135;
	r4 = r5 & 252645135;
	r3 = (r3 + r4)&-1;
	r4 = r2 >>> 8;
	r5 = r3 >>> 8;
	r2 = r2 & 16711935;
	r4 = r4 & 16711935;
	r2 = (r2 + r4)&-1;
	r3 = r3 & 16711935;
	r4 = r5 & 16711935;
	r3 = (r3 + r4)&-1;
	r4 = r2 & 65535;
	r2 = r2 >>> 16;
	r2 = (r4 + r2)&-1;
	r4 = r3 & 65535;
	r3 = r3 >>> 16;
	r3 = (r4 + r3)&-1;
	r2 = (r2 + 32)&-1;
	r4 = 64;
	r2 = r1 != 0 ? r3 : r2; 
	r3 = 63;
	r4 = (r4 - r2)&-1;
	r2 = (r3 - r2)&-1;
	if(r4 <25) //_LBB222_10
{
	r3 = 24;
	r3 = (r3 - r4)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r3;
	__ashldi3(i7);
	r1 = r_g0;
}
else{
	if(r4 ==25) //_LBB222_5
{
	r1 = r1 << 1;
	r3 = r0 >>> 31;
	r0 = r0 << 1;
	r1 = r1 | r3;
}
else{
	if(r4 !=26) //_LBB222_6
{
	r3 = (r4 + -26)&-1;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	heap32[(g0+2)] = r3;
	__lshrdi3(i7);
	r3 = r_g0;
	r5 = r_g1;
	r6 = 90;
	r6 = (r6 - r4)&-1;
	heap32[(g0)] = -1;
	heap32[(g0+1)] = -1;
	heap32[(g0+2)] = r6;
	__lshrdi3(i7);
	r0 = r_g0 & r0;
	r1 = r_g1 & r1;
	r0 = r0 | r1;
	r1 = 0;
	r0 = r0 != r1;
	r0 = r0 & 1;
	r0 = r0 | r3;
	r1 = r5;
}
}
	r3 = r0 >>> 2;
	r3 = r3 & 1;
	r0 = r3 | r0;
	r3 = (r0 + 1)&-1;
	r5 = 1;
	r6 = 0;
	r0 = uint(r3) < uint(r0) ? r5 : r6; 
	r0 = r3 == 0 ? r5 : r0; 
	r0 = (r1 + r0)&-1;
	r1 = r3 >>> 2;
	r5 = r0 << 30;
	r1 = r1 | r5;
	r5 = r1 & 16777216;
	if(r5 !=0) //_LBB222_9
{
	r1 = r3 >>> 3;
	r0 = r0 << 29;
	r1 = r1 | r0;
	r2 = r4;
}
}
	r0 = r2 << 23;
	r0 = (r0 + 1065353216)&-1;
	r1 = r1 & 8388607;
	r0 = r0 | r1;
	heap32[(fp+-1)] = r0;
	f0 = heapFloat[(fp+-1)];
	f_g0 = f0;
	return;
}
}

function __floatdisf(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var f0;
var __label__ = 0;
	i7 = sp + -24;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = heap32[(fp+1)];
	r2 = r0 | r1;
	if(r2 ==0) //_LBB223_12
{
	f0 =                         0;
	f_g0 = f0;
	return;
}
else{
	r2 = r1 >> 31;
	r1 = r2 ^ r1;
	r0 = r2 ^ r0;
	r3 = 1;
	r4 = 0;
	r5 = (r0 - r2)&-1;
	r1 = (r1 - r2)&-1;
	r0 = uint(r0) < uint(r2) ? r3 : r4; 
	r0 = (r1 - r0)&-1;
	r1 = r5 >>> 1;
	r6 = r0 >>> 1;
	r1 = r5 | r1;
	r6 = r0 | r6;
	r7 = r1 >>> 2;
	r8 = r6 >>> 2;
	r1 = r1 | r7;
	r6 = r6 | r8;
	r7 = r1 >>> 4;
	r8 = r6 >>> 4;
	r1 = r1 | r7;
	r6 = r6 | r8;
	r7 = r1 >>> 8;
	r8 = r6 >>> 8;
	r1 = r1 | r7;
	r6 = r6 | r8;
	r7 = r1 >>> 16;
	r8 = r6 >>> 16;
	r1 = r1 | r7;
	r6 = r6 | r8;
	r7 = r1 ^ -1;
	r8 = 1431655765;
	r9 = r6 ^ -1;
	r7 = r7 >>> 1;
	r9 = r9 >>> 1;
	r1 = r8 & (~r1);
	r7 = r7 & 1431655765;
	r1 = (r1 + r7)&-1;
	r6 = r8 & (~r6);
	r7 = r9 & 1431655765;
	r6 = (r6 + r7)&-1;
	r7 = r1 >>> 2;
	r8 = r6 >>> 2;
	r1 = r1 & 858993459;
	r7 = r7 & 858993459;
	r1 = (r1 + r7)&-1;
	r6 = r6 & 858993459;
	r7 = r8 & 858993459;
	r6 = (r6 + r7)&-1;
	r7 = r1 >>> 4;
	r8 = r6 >>> 4;
	r1 = r1 & 252645135;
	r7 = r7 & 252645135;
	r1 = (r1 + r7)&-1;
	r6 = r6 & 252645135;
	r7 = r8 & 252645135;
	r6 = (r6 + r7)&-1;
	r7 = r1 >>> 8;
	r8 = r6 >>> 8;
	r1 = r1 & 16711935;
	r7 = r7 & 16711935;
	r1 = (r1 + r7)&-1;
	r6 = r6 & 16711935;
	r7 = r8 & 16711935;
	r6 = (r6 + r7)&-1;
	r7 = r1 & 65535;
	r1 = r1 >>> 16;
	r1 = (r7 + r1)&-1;
	r7 = r6 & 65535;
	r6 = r6 >>> 16;
	r6 = (r7 + r6)&-1;
	r1 = (r1 + 32)&-1;
	r7 = 64;
	r1 = r0 != 0 ? r6 : r1; 
	r6 = 63;
	r7 = (r7 - r1)&-1;
	r1 = (r6 - r1)&-1;
	if(r7 <25) //_LBB223_10
{
	r3 = 24;
	r3 = (r3 - r7)&-1;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r3;
	__ashldi3(i7);
	r5 = r_g0;
}
else{
	if(r7 ==25) //_LBB223_5
{
	r0 = r0 << 1;
	r6 = r5 >>> 31;
	r5 = r5 << 1;
	r0 = r0 | r6;
}
else{
	if(r7 !=26) //_LBB223_6
{
	r6 = (r7 + -26)&-1;
	heap32[(g0)] = r5;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r6;
	__lshrdi3(i7);
	r6 = r_g0;
	r8 = r_g1;
	r9 = 90;
	r9 = (r9 - r7)&-1;
	heap32[(g0)] = -1;
	heap32[(g0+1)] = -1;
	heap32[(g0+2)] = r9;
	__lshrdi3(i7);
	r5 = r_g0 & r5;
	r0 = r_g1 & r0;
	r0 = r5 | r0;
	r0 = r0 != r4;
	r0 = r0 & 1;
	r5 = r0 | r6;
	r0 = r8;
}
}
	r6 = r5 >>> 2;
	r6 = r6 & 1;
	r5 = r6 | r5;
	r6 = (r5 + 1)&-1;
	r5 = uint(r6) < uint(r5) ? r3 : r4; 
	r5 = r6 == 0 ? r3 : r5; 
	r0 = (r0 + r5)&-1;
	r5 = r6 >>> 2;
	r3 = r0 << 30;
	r5 = r5 | r3;
	r3 = r5 & 16777216;
	if(r3 !=0) //_LBB223_9
{
	r0 = r0 >> 2;
	r5 = r5 >>> 1;
	r0 = r0 << 31;
	r5 = r5 | r0;
	r1 = r7;
}
}
	r0 = r1 << 23;
	r1 = r5 & 8388607;
	r2 = r2 & -2147483648;
	r1 = r1 | r2;
	r0 = (r0 + 1065353216)&-1;
	r0 = r1 | r0;
	heap32[(fp+-1)] = r0;
	f0 = heapFloat[(fp+-1)];
	f_g0 = f0;
	return;
}
}

function _GLOBAL__I__mandreel_create_tcp_socket(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = mandreel_flash_tcp_onError__index__;
	r1 = _ZZL32_mandreel_init_tcp_socket_librayvE47s_723478567_mandreel_mandreel_flash_tcp_onError;
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r1;
	iMandreelRegisterExternalCallback(i7);
	return;
}

function mandreel_flash_tcp_onConnect(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function mandreel_flash_tcp_onError(sp)
{
	var i7;
	var fp = sp>>2;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	return;
}

function mandreel_flash_tcp_receive_callbak(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
var __label__ = 0;
	i7 = sp + -32784;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
	r1 = heap32[(fp)];
	r2 = heapU8[r0];
_1: do {
	if(r2 !=0) //_LBB227_2
{
	r3 = (r0 + 1)&-1;
	r4 = 0;
_3: while(true){
	r2 = (r4 + 1)&-1;
	r5 = heapU8[r3+r4];
	r4 = r2;
	if(r5 !=0) //_LBB227_3
{
continue _3;
}
else{
break _1;
}
}
}
else{
	r2 = 0;
}
} while(0);
	r3 = sp + -32768; 
	heap32[(g0)] = r0;
	heap32[(g0+1)] = r2;
	heap32[(g0+2)] = r3;
	heap32[(g0+3)] = 32768;
	r0 = _ZL10s_aSockets;
	r2 = 0;
	_ZN12mandreel_b6410b64_decodeEPKcjPvj(i7);
	r4 = r_g0;
	r6 = _ZL10s_aSockets;
_7: while(true){
	if(uint(r2) <uint(8)) //_LBB227_5
{
	r5 = (r2 * 8198)&-1;
	r5 = r5 << 2;
	r5 = (r6 + r5)&-1;
	r5 = r5 >> 2;
	r5 = heap32[(r5+8196)];
	if(r5 !=r1) //_LBB227_7
{
	r2 = (r2 + 1)&-1;
	r0 = (r0 + 32792)&-1;
continue _7;
}
else{
__label__ = 9;
break _7;
}
}
else{
__label__ = 8;
break _7;
}
}
switch(__label__ ){//multiple entries
case 8: 
	r0 = 0;
break;
}
	r1 = r0 >> 2;
	r2 = heap32[(r1+8194)];
	if(r4 >0) //_LBB227_12
{
	r5 = r4;
_16: while(true){
	r6 = (r2 + 1)&-1;
	r5 = (r5 + -1)&-1;
	r6 = r6 & 32767;
	r7 = (r3 + 1)&-1;
	r3 = heapU8[r3];
	heap8[r0+r2] = r3;
	r3 = r7;
	r2 = r6;
if(!(r5 !=0)) //_LBB227_13
{
break _16;
}
}
	r2 = r6;
}
	heap32[(r1+8194)] = r2;
	r0 = heap32[(r1+8192)];
	r0 = (r0 + r4)&-1;
	heap32[(r1+8192)] = r0;
	return;
}

function _GLOBAL__I__ZN5my_gl14glAttachShaderEjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = _ZN5my_glL9m_contextE;
	r1 = r0 >> 2;
	heap32[(r1+63)] = 0;
	heap32[(r1+64)] = 0;
	heap32[(r1+65)] = 0;
	heap32[(r1+66)] = 0;
	heap32[(r1+67)] = 0;
	heap32[(r1+68)] = 0;
	heap32[(r1+79)] = 0;
	heap32[(r1+80)] = 0;
	heap32[(r1+75)] = 0;
	heap32[(r1+78)] = 0;
	heap32[(r1+77)] = 0;
	heap32[(r1+76)] = 0;
	_ZN4__rw9__rb_treeIjSt4pairIKjPN5my_gl12TIndexBufferEENS_11__select1stIS6_jEESt4lessIjESaIS6_EE11_C_get_linkEv(i7);
	r2 = r_g0;
	r3 = r2 >> 2;
	heap32[(r1+79)] = r2;
	heap32[(r3+1)] = 0;
	heap32[(r3+3)] = r2;
	heap32[(r3+2)] = r2;
	heap32[(r1)] = 0;
	heap32[(r1+1)] = 0;
	heap32[(r1+4)] = 0;
	heap32[(r1+62)] = 0;
	heap32[(r1+5)] = 0;
	heap32[(r1+69)] = 0;
	heap32[(r1+70)] = 0;
	r2 = _ZL26s_mandreel_internal_height;
	r3 = _ZL25s_mandreel_internal_width;
	heap32[(r1+2)] = 0;
	r2 = r2 >> 2;
	heap32[(r1+3)] = 1;
	r3 = r3 >> 2;
	r2 = heap32[(r2)];
	r3 = heap32[(r3)];
	heap32[(r1+71)] = 0;
	heap32[(r1+72)] = 0;
	r4 = 224;
	heap32[(r1+73)] = r3;
	heap32[(r1+74)] = r2;
	r2 = 0;
_2: while(true){
	r1 = (r4 + -1)&-1;
	r4 = (r0 - r4)&-1;
	heap8[r4+248] = r2;
	r4 = r1;
	if(r1 !=0) //_LBB228_2
{
continue _2;
}
else{
break _2;
}
}
	return;
}

function _GLOBAL__D__ZN5my_gl14glAttachShaderEjj(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -16;var g0 = i7>>2; // save stack
	r0 = _ZN5my_glL9m_contextE;
	r0 = r0 >> 2;
	r1 = heap32[(r0+79)];
_1: do {
if(!(r1 ==0)) //_LBB229_24
{
	r2 = r1 >> 2;
	r3 = heap32[(r0+80)];
	if(r3 !=0) //_LBB229_5
{
	r1 = heap32[(r2+1)];
	heap32[(g0)] = r1;
	_ZN4__rw9__rb_treeIjSt4pairIKjPN5my_gl12TIndexBufferEENS_11__select1stIS6_jEESt4lessIjESaIS6_EE8_C_eraseEPNS_17__rw_rb_tree_nodeISB_S6_jS8_EE(i7);
	r1 = heap32[(r0+79)];
	r2 = r1 >> 2;
	heap32[(r2+1)] = 0;
	heap32[(r2+3)] = r1;
	heap32[(r2+2)] = r1;
	heap32[(r0+80)] = 0;
}
else{
	r2 = heap32[(r2+2)];
if(!(r2 ==r1)) //_LBB229_4
{
_6: while(true){
	r3 = r2;
	r4 = r3 >> 2;
	r2 = heap32[(r4+3)];
_8: do {
	if(r2 !=0) //_LBB229_10
{
	r4 = r2 >> 2;
	r4 = heap32[(r4+2)];
	if(r4 ==0) //_LBB229_12
{
break _8;
}
else{
__label__ = 8; //SET chanka
_10: while(true){
	r2 = r4;
	r4 = r2 >> 2;
	r4 = heap32[(r4+2)];
	if(r4 !=0) //_LBB229_13
{
continue _10;
}
else{
break _8;
}
}
}
}
else{
	r4 = heap32[(r4+1)];
	r2 = r4 >> 2;
	r2 = heap32[(r2+3)];
	if(r3 ==r2) //_LBB229_9
{
_14: while(true){
	r2 = r4;
	r5 = r2 >> 2;
	r4 = heap32[(r5+1)];
	r6 = r4 >> 2;
	r6 = heap32[(r6+3)];
if(!(r2 ==r6)) //_LBB229_15
{
break _14;
}
}
	r5 = heap32[(r5+3)];
}
else{
	r5 = 0;
	r2 = r3;
}
	if(r5 !=r4) //_LBB229_19
{
	r2 = r4;
}
}
} while(0);
	r4 = sp + -8; 
	heap32[(g0)] = r4;
	heap32[(g0+1)] = r3;
	_ZN4__rw9__rb_treeIjSt4pairIKjPN5my_gl12TIndexBufferEENS_11__select1stIS6_jEESt4lessIjESaIS6_EE5eraseENS_14__rw_tree_iterIS6_iPS6_RS6_NS_17__rw_rb_tree_nodeISB_S6_jS8_EEEE(i7);
if(!(r2 !=r1)) //_LBB229_6
{
break _6;
}
}
	r1 = heap32[(r0+79)];
}
}
	r2 = r1 >> 2;
	r3 = heap32[(r0+76)];
	heap32[(r2+3)] = r3;
	heap32[(r0+76)] = r1;
	r1 = heap32[(r0+75)];
if(!(r1 ==0)) //_LBB229_24
{
__label__ = 16; //SET chanka
_23: while(true){
	r2 = r1 >> 2;
	r3 = heap32[(r2)];
	heap32[(r0+75)] = r3;
	r2 = heap32[(r2+2)];
	heap32[(g0)] = r2;
	_ZdlPv(i7);
	heap32[(g0)] = r1;
	_ZdlPv(i7);
	r1 = heap32[(r0+75)];
	if(r1 !=0) //_LBB229_23
{
continue _23;
}
else{
break _1;
}
}
}
}
} while(0);
	r1 = heap32[(r0+66)];
	r2 = heap32[(r0+67)];
	r3 = (r2 - r1)&-1;
	r3 = r3 >> 5;
	if(r3 !=0) //_LBB229_26
{
	r1 = (r2 + -32)&-1;
	heap32[(r0+67)] = r1;
	r1 = (r2 + -28)&-1;
	heap32[(g0)] = r1;
	_ZN4__rw9__rb_treeISsSt4pairIKSsiENS_11__select1stIS3_SsEESt4lessISsESaIS3_EED2Ev(i7);
_28: do {
if(!(r3 ==1)) //_LBB229_29
{
	r1 = (r3 + -1)&-1;
_30: while(true){
	r2 = heap32[(r0+67)];
	r3 = (r2 + -32)&-1;
	heap32[(r0+67)] = r3;
	r2 = (r2 + -28)&-1;
	r1 = (r1 + -1)&-1;
	heap32[(g0)] = r2;
	_ZN4__rw9__rb_treeISsSt4pairIKSsiENS_11__select1stIS3_SsEESt4lessISsESaIS3_EED2Ev(i7);
if(!(r1 !=0)) //_LBB229_28
{
break _28;
}
}
}
} while(0);
	r1 = heap32[(r0+66)];
}
	heap32[(g0)] = r1;
	_ZdlPv(i7);
	r1 = heap32[(r0+64)];
	r2 = heap32[(r0+63)];
	r3 = (r1 - r2)&-1;
	r4 = (r3 + 11)&-1;
if(!(uint(r4) <uint(23))) //_LBB229_32
{
	r3 = (r3 / -12)&-1;
	r3 = (r3 * 12)&-1;
	r1 = (r1 + r3)&-1;
	heap32[(r0+64)] = r1;
}
	heap32[(g0)] = r2;
	_ZdlPv(i7);
	return;
}

function _ZN4__rw9__rb_treeIjSt4pairIKjPN5my_gl12TIndexBufferEENS_11__select1stIS6_jEESt4lessIjESaIS6_EE8_C_eraseEPNS_17__rw_rb_tree_nodeISB_S6_jS8_EE(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
if(!(r0 ==0)) //_LBB230_2
{
_2: while(true){
	r1 = r0 >> 2;
	r2 = heap32[(r1+3)];
	heap32[(g0)] = r2;
	r2 = _ZN5my_glL9m_contextE;
	_ZN4__rw9__rb_treeIjSt4pairIKjPN5my_gl12TIndexBufferEENS_11__select1stIS6_jEESt4lessIjESaIS6_EE8_C_eraseEPNS_17__rw_rb_tree_nodeISB_S6_jS8_EE(i7);
	r2 = r2 >> 2;
	r3 = heap32[(r1+2)];
	r4 = heap32[(r2+76)];
	heap32[(r1+3)] = r4;
	heap32[(r2+76)] = r0;
	r0 = r3;
	if(r3 !=0) //_LBB230_1
{
continue _2;
}
else{
break _2;
}
}
}
	return;
}

function _ZN4__rw9__rb_treeISsSt4pairIKSsiENS_11__select1stIS3_SsEESt4lessISsESaIS3_EE8_C_eraseEPNS_17__rw_rb_tree_nodeIS8_S3_SsS5_EE(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+1)];
if(!(r0 ==0)) //_LBB231_6
{
	r1 = heap32[(fp)];
_3: while(true){
	r2 = r0;
	r3 = r2 >> 2;
	r0 = heap32[(r3+3)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	_ZN4__rw9__rb_treeISsSt4pairIKSsiENS_11__select1stIS3_SsEESt4lessISsESaIS3_EE8_C_eraseEPNS_17__rw_rb_tree_nodeIS8_S3_SsS5_EE(i7);
	r4 = r1 >> 2;
	r0 = heap32[(r3+2)];
	r5 = heap32[(r4+1)];
	heap32[(r3+3)] = r5;
	r5 = heap32[(r3+4)];
	r5 = (r5 + -12)&-1;
	r6 = _ZNSs11_C_null_refE;
if(!(r5 ==r6)) //_LBB231_5
{
	r5 = r5 >> 2;
	r6 = heap32[(r5)];
	r7 = (r6 + -1)&-1;
	heap32[(r5)] = r7;
if(!(r6 >0)) //_LBB231_5
{
	r5 = heap32[(r3+4)];
	r5 = (r5 + -12)&-1;
	heap32[(g0)] = r5;
	_ZdlPv(i7);
}
}
	heap32[(r3+4)] = 0;
	heap32[(r4+1)] = r2;
	if(r0 !=0) //_LBB231_2
{
continue _3;
}
else{
break _3;
}
}
}
	return;
}

function _ZN4__rw9__rb_treeISsSt4pairIKSsiENS_11__select1stIS3_SsEESt4lessISsESaIS3_EE5eraseENS_14__rw_tree_iterIS3_iPS3_RS3_NS_17__rw_rb_tree_nodeIS8_S3_SsS5_EEEESF_(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
	var r15;
	var r16;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = heap32[(fp+2)];
	r1 = heap32[(fp+1)];
	r0 = r0 >> 2;
	r2 = r1 >> 2;
	r3 = heap32[(r2+4)];
	r4 = heap32[(r0)];
	r5 = heap32[(fp)];
	r6 = heap32[(fp+3)];
	r7 = r3 >> 2;
	r8 = heap32[(r7+2)];
if(!(r4 !=r8)) //_LBB232_3
{
if(!(r3 !=r6)) //_LBB232_3
{
	r8 = heap32[(r2+5)];
	if(r8 !=0) //_LBB232_4
{
	r0 = heap32[(r7+1)];
	heap32[(g0)] = r1;
	heap32[(g0+1)] = r0;
	_ZN4__rw9__rb_treeISsSt4pairIKSsiENS_11__select1stIS3_SsEESt4lessISsESaIS3_EE8_C_eraseEPNS_17__rw_rb_tree_nodeIS8_S3_SsS5_EE(i7);
	r0 = heap32[(r2+4)];
	r0 = r0 >> 2;
	heap32[(r0+1)] = 0;
	r0 = heap32[(r2+4)];
	r1 = r0 >> 2;
	heap32[(r1+3)] = r0;
	heap32[(r1+2)] = r0;
	heap32[(r2+5)] = 0;
	r0 = r5 >> 2;
	r1 = heap32[(r2+4)];
	heap32[(r0)] = r1;
	return;
}
}
}
	r1 = r5 >> 2;
	heap32[(r1)] = r3;
if(!(r4 ==r6)) //_LBB232_165
{
_7: while(true){
	r3 = r4 >> 2;
	r5 = heap32[(r3+3)];
	if(r5 !=0) //_LBB232_9
{
	r7 = r5 >> 2;
	r7 = heap32[(r7+2)];
if(!(r7 ==0)) //_LBB232_11
{
_12: while(true){
	r5 = r7;
	r7 = r5 >> 2;
	r7 = heap32[(r7+2)];
if(!(r7 !=0)) //_LBB232_12
{
break _12;
}
}
}
	heap32[(r0)] = r5;
}
else{
	r7 = heap32[(r3+1)];
	r5 = r7 >> 2;
	r5 = heap32[(r5+3)];
	if(r4 ==r5) //_LBB232_8
{
_17: while(true){
	r5 = r7;
	r8 = r5 >> 2;
	r7 = heap32[(r8+1)];
	r9 = r7 >> 2;
	r9 = heap32[(r9+3)];
if(!(r5 ==r9)) //_LBB232_14
{
break _17;
}
}
	heap32[(r0)] = r5;
	r8 = heap32[(r8+3)];
}
else{
	r8 = 0;
	r5 = r4;
}
	if(r8 !=r7) //_LBB232_18
{
	heap32[(r0)] = r7;
	r5 = r7;
}
}
	r7 = heap32[(r2+4)];
	if(r4 !=r7) //_LBB232_21
{
	r9 = heap32[(r3+3)];
_26: do {
	if(r9 !=0) //_LBB232_25
{
	r8 = r9 >> 2;
	r10 = heap32[(r8+2)];
	if(r10 ==0) //_LBB232_27
{
	r8 = r9;
}
else{
_30: while(true){
	r8 = r10;
	r10 = r8 >> 2;
	r10 = heap32[(r10+2)];
	if(r10 !=0) //_LBB232_28
{
continue _30;
}
else{
break _26;
}
}
}
}
else{
	r8 = heap32[(r3+1)];
	r10 = r8 >> 2;
	r10 = heap32[(r10+3)];
	if(r4 ==r10) //_LBB232_24
{
_34: while(true){
	r11 = r8;
	r10 = r11 >> 2;
	r8 = heap32[(r10+1)];
	r12 = r8 >> 2;
	r12 = heap32[(r12+3)];
if(!(r11 ==r12)) //_LBB232_30
{
break _34;
}
}
	r10 = heap32[(r10+3)];
}
else{
	r10 = 0;
	r11 = r4;
}
	if(r10 ==r8) //_LBB232_34
{
	r8 = r11;
}
}
} while(0);
	r10 = heap32[(r3+2)];
	if(r10 !=0) //_LBB232_37
{
	if(r9 !=0) //_LBB232_39
{
	r11 = r9 >> 2;
	r12 = heap32[(r11+2)];
_45: do {
	if(r12 ==0) //_LBB232_41
{
	r11 = r9;
}
else{
_47: while(true){
	r11 = r12;
	r12 = r11 >> 2;
	r12 = heap32[(r12+2)];
if(!(r12 !=0)) //_LBB232_42
{
break _45;
}
}
}
} while(0);
	r13 = r11 >> 2;
	r9 = heap32[(r13+3)];
	if(r11 !=r4) //_LBB232_45
{
	r7 = r10 >> 2;
	heap32[(r7+1)] = r11;
	r7 = heap32[(r3+2)];
	heap32[(r13+2)] = r7;
	r7 = heap32[(r3+3)];
	if(r7 !=r11) //_LBB232_47
{
	r12 = heap32[(r13+1)];
	if(r9 !=0) //_LBB232_49
{
	r7 = r9 >> 2;
	heap32[(r7+1)] = r12;
	r7 = heap32[(r13+1)];
}
else{
	r7 = r12;
}
	r7 = r7 >> 2;
	heap32[(r7+2)] = r9;
	r7 = heap32[(r3+3)];
	heap32[(r13+3)] = r7;
	r7 = heap32[(r3+3)];
	r7 = r7 >> 2;
	heap32[(r7+1)] = r11;
}
else{
	r12 = r11;
}
	r7 = heap32[(r2+4)];
	r7 = r7 >> 2;
	r10 = heap32[(r7+1)];
	if(r10 !=r4) //_LBB232_53
{
	r7 = heap32[(r3+1)];
	r10 = r7 >> 2;
	r10 = heap32[(r10+2)];
	r10 = r10 != r4;
	r10 = r10 & 1;
	r10 = r10 << 2;
	r7 = (r7 + r10)&-1;
	r7 = (r7 + 8)&-1;
	r10 = (r4 + 4)&-1;
	r7 = r7 >> 2;
	heap32[(r7)] = r11;
}
else{
	r10 = (r4 + 4)&-1;
	heap32[(r7+1)] = r11;
}
	r7 = r10 >> 2;
	r7 = heap32[(r7)];
	heap32[(r13+1)] = r7;
	r7 = heap32[(r13)];
	r11 = heap32[(r3)];
	heap32[(r13)] = r11;
	heap32[(r3)] = r7;
__label__ = 66;
}
else{
__label__ = 45;
}
}
else{
	r12 = heap32[(r3+1)];
	r11 = r4;
	r9 = r10;
__label__ = 47;
}
}
else{
	r11 = r4;
__label__ = 45;
}
switch(__label__ ){//multiple entries
case 45: 
	r12 = r11 >> 2;
	r12 = heap32[(r12+1)];
	if(r9 ==0) //_LBB232_57
{
	r9 = 0;
__label__ = 48;
}
else{
__label__ = 47;
}
break;
}
switch(__label__ ){//multiple entries
case 47: 
	r7 = r9 >> 2;
	heap32[(r7+1)] = r12;
	r7 = heap32[(r2+4)];
__label__ = 48;
break;
}
switch(__label__ ){//multiple entries
case 48: 
	r7 = r7 >> 2;
	r10 = heap32[(r7+1)];
	if(r10 !=r4) //_LBB232_61
{
	r7 = heap32[(r3+1)];
	r10 = r7 >> 2;
	r10 = heap32[(r10+2)];
	r10 = r10 != r4;
	r10 = r10 & 1;
	r10 = r10 << 2;
	r7 = (r7 + r10)&-1;
	r7 = (r7 + 8)&-1;
	r7 = r7 >> 2;
	heap32[(r7)] = r9;
}
else{
	heap32[(r7+1)] = r9;
}
	r7 = heap32[(r2+4)];
	r7 = r7 >> 2;
	r10 = heap32[(r7+2)];
if(!(r10 !=r4)) //_LBB232_70
{
	r10 = heap32[(r3+3)];
	if(r10 !=0) //_LBB232_65
{
	r10 = r9 >> 2;
	r10 = heap32[(r10+2)];
_80: do {
	if(r10 ==0) //_LBB232_67
{
	r13 = r9;
}
else{
_82: while(true){
	r13 = r10;
	r10 = r13 >> 2;
	r10 = heap32[(r10+2)];
if(!(r10 !=0)) //_LBB232_68
{
break _80;
}
}
}
} while(0);
	heap32[(r7+2)] = r13;
}
else{
	r10 = heap32[(r3+1)];
	heap32[(r7+2)] = r10;
}
}
	r7 = heap32[(r2+4)];
	r7 = r7 >> 2;
	r10 = heap32[(r7+3)];
	if(r10 ==r4) //_LBB232_72
{
	r4 = heap32[(r3+2)];
	if(r4 !=0) //_LBB232_74
{
	r4 = r9 >> 2;
	r4 = heap32[(r4+3)];
_91: do {
	if(r4 ==0) //_LBB232_76
{
	r3 = r9;
}
else{
_93: while(true){
	r3 = r4;
	r4 = r3 >> 2;
	r4 = heap32[(r4+3)];
if(!(r4 !=0)) //_LBB232_77
{
break _91;
}
}
}
} while(0);
	heap32[(r7+3)] = r3;
	r4 = r11;
}
else{
	r4 = heap32[(r3+1)];
	heap32[(r7+3)] = r4;
	r4 = r11;
}
}
else{
	r4 = r11;
}
break;
}
	r3 = r4 >> 2;
	r7 = heap32[(r3)];
_99: do {
if(!(r7 ==0)) //_LBB232_160
{
_100: while(true){
	r7 = heap32[(r2+4)];
	r7 = r7 >> 2;
	r7 = heap32[(r7+1)];
	if(r7 ==r9) //_LBB232_158
{
__label__ = 140;
break _100;
}
else{
if(!(r9 ==0)) //_LBB232_81
{
	r7 = r9 >> 2;
	r7 = heap32[(r7)];
if(!(r7 ==1)) //_LBB232_81
{
__label__ = 141;
break _100;
}
}
	r7 = r12 >> 2;
	r10 = heap32[(r7+2)];
	if(r10 !=r9) //_LBB232_119
{
	r11 = r10 >> 2;
	r13 = heap32[(r11)];
	if(r13 ==0) //_LBB232_121
{
	heap32[(r11)] = 1;
	heap32[(r7)] = 0;
	r10 = heap32[(r7+2)];
	r11 = r10 >> 2;
	r13 = heap32[(r11+3)];
	heap32[(r7+2)] = r13;
	r13 = heap32[(r11+3)];
if(!(r13 ==0)) //_LBB232_123
{
	r13 = r13 >> 2;
	heap32[(r13+1)] = r12;
}
	r13 = heap32[(r7+1)];
	heap32[(r11+1)] = r13;
	r13 = heap32[(r2+4)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+1)];
	if(r14 !=r12) //_LBB232_125
{
	r13 = heap32[(r7+1)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+3)];
	if(r14 !=r12) //_LBB232_127
{
	heap32[(r13+2)] = r10;
}
else{
	heap32[(r13+3)] = r10;
}
}
else{
	heap32[(r13+1)] = r10;
}
	heap32[(r11+3)] = r12;
	heap32[(r7+1)] = r10;
	r10 = heap32[(r7+2)];
}
	r11 = r10 >> 2;
	r13 = heap32[(r11+3)];
if(!(r13 ==0)) //_LBB232_131
{
	r13 = r13 >> 2;
	r14 = heap32[(r13)];
	if(r14 !=1) //_LBB232_135
{
__label__ = 117;
break _100;
}
}
	r13 = heap32[(r11+2)];
if(!(r13 ==0)) //_LBB232_134
{
	r13 = r13 >> 2;
	r13 = heap32[(r13)];
if(!(r13 ==1)) //_LBB232_134
{
__label__ = 127;
break _100;
}
}
	heap32[(r11)] = 0;
}
else{
	r10 = heap32[(r7+3)];
	r11 = r10 >> 2;
	r13 = heap32[(r11)];
	if(r13 ==0) //_LBB232_84
{
	heap32[(r11)] = 1;
	heap32[(r7)] = 0;
	r10 = heap32[(r7+3)];
	r11 = r10 >> 2;
	r13 = heap32[(r11+2)];
	heap32[(r7+3)] = r13;
	r13 = heap32[(r11+2)];
if(!(r13 ==0)) //_LBB232_86
{
	r13 = r13 >> 2;
	heap32[(r13+1)] = r12;
}
	r13 = heap32[(r7+1)];
	heap32[(r11+1)] = r13;
	r13 = heap32[(r2+4)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+1)];
	if(r14 !=r12) //_LBB232_88
{
	r13 = heap32[(r7+1)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+2)];
	if(r14 !=r12) //_LBB232_90
{
	heap32[(r13+3)] = r10;
}
else{
	heap32[(r13+2)] = r10;
}
}
else{
	heap32[(r13+1)] = r10;
}
	heap32[(r11+2)] = r12;
	heap32[(r7+1)] = r10;
	r10 = heap32[(r7+3)];
}
	r11 = r10 >> 2;
	r13 = heap32[(r11+2)];
if(!(r13 ==0)) //_LBB232_94
{
	r13 = r13 >> 2;
	r14 = heap32[(r13)];
	if(r14 !=1) //_LBB232_99
{
__label__ = 83;
break _100;
}
}
	r13 = heap32[(r11+3)];
if(!(r13 ==0)) //_LBB232_97
{
	r13 = r13 >> 2;
	r13 = heap32[(r13)];
if(!(r13 ==1)) //_LBB232_97
{
__label__ = 93;
break _100;
}
}
	heap32[(r11)] = 0;
}
	r10 = heap32[(r7+1)];
	r9 = r12;
	r12 = r10;
}
}
_148: do {
switch(__label__ ){//multiple entries
case 117: 
	r14 = heap32[(r11+2)];
if(!(r14 ==0)) //_LBB232_137
{
	r14 = r14 >> 2;
	r14 = heap32[(r14)];
	if(r14 !=1) //_LBB232_133
{
__label__ = 127;
break _148;
}
}
	heap32[(r13)] = 1;
	r13 = heap32[(r11+3)];
	r14 = r13 >> 2;
	heap32[(r11)] = 0;
	r15 = heap32[(r14+2)];
	heap32[(r11+3)] = r15;
	r15 = heap32[(r14+2)];
if(!(r15 ==0)) //_LBB232_139
{
	r15 = r15 >> 2;
	heap32[(r15+1)] = r10;
}
	r15 = heap32[(r11+1)];
	heap32[(r14+1)] = r15;
	r15 = heap32[(r2+4)];
	r15 = r15 >> 2;
	r16 = heap32[(r15+1)];
	if(r16 !=r10) //_LBB232_141
{
	r15 = heap32[(r11+1)];
	r15 = r15 >> 2;
	r16 = heap32[(r15+2)];
	if(r16 !=r10) //_LBB232_143
{
	heap32[(r15+3)] = r13;
}
else{
	heap32[(r15+2)] = r13;
}
}
else{
	heap32[(r15+1)] = r13;
}
	heap32[(r14+2)] = r10;
	heap32[(r11+1)] = r13;
	r10 = heap32[(r7+2)];
__label__ = 127;
break _148;
break;
case 83: 
	r14 = heap32[(r11+3)];
if(!(r14 ==0)) //_LBB232_101
{
	r14 = r14 >> 2;
	r14 = heap32[(r14)];
	if(r14 !=1) //_LBB232_96
{
__label__ = 93;
break _148;
}
}
	heap32[(r13)] = 1;
	r13 = heap32[(r11+2)];
	r14 = r13 >> 2;
	heap32[(r11)] = 0;
	r15 = heap32[(r14+3)];
	heap32[(r11+2)] = r15;
	r15 = heap32[(r14+3)];
if(!(r15 ==0)) //_LBB232_103
{
	r15 = r15 >> 2;
	heap32[(r15+1)] = r10;
}
	r15 = heap32[(r11+1)];
	heap32[(r14+1)] = r15;
	r15 = heap32[(r2+4)];
	r15 = r15 >> 2;
	r16 = heap32[(r15+1)];
	if(r16 !=r10) //_LBB232_105
{
	r15 = heap32[(r11+1)];
	r15 = r15 >> 2;
	r16 = heap32[(r15+3)];
	if(r16 !=r10) //_LBB232_107
{
	heap32[(r15+2)] = r13;
}
else{
	heap32[(r15+3)] = r13;
}
}
else{
	heap32[(r15+1)] = r13;
}
	heap32[(r14+3)] = r10;
	heap32[(r11+1)] = r13;
	r10 = heap32[(r7+3)];
__label__ = 93;
break;
}
} while(0);
_177: do {
switch(__label__ ){//multiple entries
case 127: 
	r10 = r10 >> 2;
	r11 = heap32[(r7)];
	heap32[(r10)] = r11;
	heap32[(r7)] = 1;
	r10 = heap32[(r10+2)];
if(!(r10 ==0)) //_LBB232_147
{
	r10 = r10 >> 2;
	heap32[(r10)] = 1;
}
	r10 = heap32[(r7+2)];
	r11 = r10 >> 2;
	r13 = heap32[(r11+3)];
	heap32[(r7+2)] = r13;
	r13 = heap32[(r11+3)];
if(!(r13 ==0)) //_LBB232_149
{
	r13 = r13 >> 2;
	heap32[(r13+1)] = r12;
}
	r13 = heap32[(r7+1)];
	heap32[(r11+1)] = r13;
	r13 = heap32[(r2+4)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+1)];
	if(r14 !=r12) //_LBB232_151
{
	r13 = heap32[(r7+1)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+3)];
	if(r14 !=r12) //_LBB232_153
{
	heap32[(r13+2)] = r10;
}
else{
	heap32[(r13+3)] = r10;
}
}
else{
	heap32[(r13+1)] = r10;
}
	heap32[(r11+3)] = r12;
	heap32[(r7+1)] = r10;
__label__ = 140;
break _177;
break;
case 93: 
	r10 = r10 >> 2;
	r11 = heap32[(r7)];
	heap32[(r10)] = r11;
	heap32[(r7)] = 1;
	r10 = heap32[(r10+3)];
if(!(r10 ==0)) //_LBB232_111
{
	r10 = r10 >> 2;
	heap32[(r10)] = 1;
}
	r10 = heap32[(r7+3)];
	r11 = r10 >> 2;
	r13 = heap32[(r11+2)];
	heap32[(r7+3)] = r13;
	r13 = heap32[(r11+2)];
if(!(r13 ==0)) //_LBB232_113
{
	r13 = r13 >> 2;
	heap32[(r13+1)] = r12;
}
	r13 = heap32[(r7+1)];
	heap32[(r11+1)] = r13;
	r13 = heap32[(r2+4)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+1)];
	if(r14 !=r12) //_LBB232_115
{
	r13 = heap32[(r7+1)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+2)];
	if(r14 !=r12) //_LBB232_117
{
	heap32[(r13+3)] = r10;
}
else{
	heap32[(r13+2)] = r10;
}
}
else{
	heap32[(r13+1)] = r10;
}
	heap32[(r11+2)] = r12;
	heap32[(r7+1)] = r10;
__label__ = 140;
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 140: 
	if(r9 ==0) //_LBB232_160
{
break _99;
}
break;
}
	r7 = r9 >> 2;
	heap32[(r7)] = 1;
}
} while(0);
	r7 = heap32[(r2+1)];
	heap32[(r3+3)] = r7;
	r7 = heap32[(r3+4)];
	r7 = (r7 + -12)&-1;
	r9 = _ZNSs11_C_null_refE;
if(!(r7 ==r9)) //_LBB232_163
{
	r7 = r7 >> 2;
	r9 = heap32[(r7)];
	r10 = (r9 + -1)&-1;
	heap32[(r7)] = r10;
if(!(r9 >0)) //_LBB232_163
{
	r7 = heap32[(r3+4)];
	r7 = (r7 + -12)&-1;
	heap32[(g0)] = r7;
	_ZdlPv(i7);
}
}
	heap32[(r3+4)] = 0;
	heap32[(r2+1)] = r4;
	r4 = heap32[(r2+5)];
	r4 = (r4 + -1)&-1;
	heap32[(r2+5)] = r4;
}
else{
	r8 = r7;
}
	heap32[(r1)] = r8;
	r4 = r5;
	if(r5 !=r6) //_LBB232_5
{
continue _7;
}
else{
break _7;
}
}
}
	return;
}

function _ZN4__rw9__rb_treeIjSt4pairIKjPN5my_gl12TIndexBufferEENS_11__select1stIS6_jEESt4lessIjESaIS6_EE5eraseENS_14__rw_tree_iterIS6_iPS6_RS6_NS_17__rw_rb_tree_nodeISB_S6_jS8_EEEE(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
	var r7;
	var r8;
	var r9;
	var r10;
	var r11;
	var r12;
	var r13;
	var r14;
var __label__ = 0;
	i7 = sp + 0;var g0 = i7>>2; // save stack
	r0 = _ZN5my_glL9m_contextE;
	r0 = r0 >> 2;
	r1 = heap32[(r0+79)];
	r2 = heap32[(fp+1)];
	r3 = heap32[(fp)];
	if(r1 !=r2) //_LBB233_2
{
	r4 = r2 >> 2;
	r5 = heap32[(r4+3)];
_3: do {
	if(r5 !=0) //_LBB233_6
{
	r6 = r5 >> 2;
	r7 = heap32[(r6+2)];
	if(r7 ==0) //_LBB233_8
{
	r6 = r5;
}
else{
_7: while(true){
	r6 = r7;
	r7 = r6 >> 2;
	r7 = heap32[(r7+2)];
	if(r7 !=0) //_LBB233_9
{
continue _7;
}
else{
break _3;
}
}
}
}
else{
	r6 = heap32[(r4+1)];
	r7 = r6 >> 2;
	r7 = heap32[(r7+3)];
	if(r7 ==r2) //_LBB233_5
{
_11: while(true){
	r8 = r6;
	r7 = r8 >> 2;
	r6 = heap32[(r7+1)];
	r9 = r6 >> 2;
	r9 = heap32[(r9+3)];
if(!(r8 ==r9)) //_LBB233_11
{
break _11;
}
}
	r7 = heap32[(r7+3)];
}
else{
	r7 = 0;
	r8 = r2;
}
	if(r7 ==r6) //_LBB233_15
{
	r6 = r8;
}
}
} while(0);
	r7 = heap32[(r4+2)];
	if(r7 !=0) //_LBB233_18
{
	if(r5 !=0) //_LBB233_20
{
	r8 = r5 >> 2;
	r9 = heap32[(r8+2)];
_22: do {
	if(r9 ==0) //_LBB233_22
{
	r8 = r5;
}
else{
_24: while(true){
	r8 = r9;
	r9 = r8 >> 2;
	r9 = heap32[(r9+2)];
if(!(r9 !=0)) //_LBB233_23
{
break _22;
}
}
}
} while(0);
	r10 = r8 >> 2;
	r5 = heap32[(r10+3)];
	if(r8 !=r2) //_LBB233_26
{
	r9 = r7 >> 2;
	heap32[(r9+1)] = r8;
	r9 = heap32[(r4+2)];
	heap32[(r10+2)] = r9;
	r9 = heap32[(r4+3)];
	if(r9 !=r8) //_LBB233_28
{
	r9 = heap32[(r10+1)];
	if(r5 !=0) //_LBB233_30
{
	r7 = r5 >> 2;
	heap32[(r7+1)] = r9;
	r7 = heap32[(r10+1)];
}
else{
	r7 = r9;
}
	r7 = r7 >> 2;
	heap32[(r7+2)] = r5;
	r7 = heap32[(r4+3)];
	heap32[(r10+3)] = r7;
	r7 = heap32[(r4+3)];
	r7 = r7 >> 2;
	heap32[(r7+1)] = r8;
}
else{
	r9 = r8;
}
	r7 = r1 >> 2;
	r11 = heap32[(r7+1)];
	if(r11 !=r2) //_LBB233_34
{
	r11 = heap32[(r4+1)];
	r7 = r11 >> 2;
	r7 = heap32[(r7+2)];
	r7 = r7 != r2;
	r7 = r7 & 1;
	r7 = r7 << 2;
	r11 = (r11 + r7)&-1;
	r7 = (r11 + 8)&-1;
	r11 = (r2 + 4)&-1;
	r7 = r7 >> 2;
	heap32[(r7)] = r8;
}
else{
	r11 = (r2 + 4)&-1;
	heap32[(r7+1)] = r8;
}
	r8 = r11 >> 2;
	r8 = heap32[(r8)];
	heap32[(r10+1)] = r8;
	r8 = heap32[(r10)];
	r7 = heap32[(r4)];
	heap32[(r10)] = r7;
	heap32[(r4)] = r8;
__label__ = 51;
}
else{
__label__ = 30;
}
}
else{
	r9 = heap32[(r4+1)];
	r8 = r2;
	r5 = r7;
__label__ = 32;
}
}
else{
	r8 = r2;
__label__ = 30;
}
switch(__label__ ){//multiple entries
case 30: 
	r9 = r8 >> 2;
	r9 = heap32[(r9+1)];
	if(r5 ==0) //_LBB233_38
{
	r5 = 0;
__label__ = 33;
}
else{
__label__ = 32;
}
break;
}
switch(__label__ ){//multiple entries
case 32: 
	r7 = r5 >> 2;
	heap32[(r7+1)] = r9;
__label__ = 33;
break;
}
switch(__label__ ){//multiple entries
case 33: 
	r7 = r1 >> 2;
	r10 = heap32[(r7+1)];
	if(r10 !=r2) //_LBB233_42
{
	r10 = heap32[(r4+1)];
	r11 = r10 >> 2;
	r11 = heap32[(r11+2)];
	r11 = r11 != r2;
	r11 = r11 & 1;
	r11 = r11 << 2;
	r10 = (r10 + r11)&-1;
	r10 = (r10 + 8)&-1;
	r10 = r10 >> 2;
	heap32[(r10)] = r5;
}
else{
	heap32[(r7+1)] = r5;
}
	r10 = heap32[(r7+2)];
if(!(r10 !=r2)) //_LBB233_51
{
	r10 = heap32[(r4+3)];
	if(r10 !=0) //_LBB233_46
{
	r10 = r5 >> 2;
	r10 = heap32[(r10+2)];
_57: do {
	if(r10 ==0) //_LBB233_48
{
	r11 = r5;
}
else{
_59: while(true){
	r11 = r10;
	r10 = r11 >> 2;
	r10 = heap32[(r10+2)];
if(!(r10 !=0)) //_LBB233_49
{
break _57;
}
}
}
} while(0);
	heap32[(r7+2)] = r11;
}
else{
	r10 = heap32[(r4+1)];
	heap32[(r7+2)] = r10;
}
}
	r10 = heap32[(r7+3)];
	if(r10 ==r2) //_LBB233_53
{
	r2 = heap32[(r4+2)];
	if(r2 !=0) //_LBB233_55
{
	r2 = r5 >> 2;
	r2 = heap32[(r2+3)];
_68: do {
	if(r2 ==0) //_LBB233_57
{
	r4 = r5;
}
else{
_70: while(true){
	r4 = r2;
	r2 = r4 >> 2;
	r2 = heap32[(r2+3)];
if(!(r2 !=0)) //_LBB233_58
{
break _68;
}
}
}
} while(0);
	heap32[(r7+3)] = r4;
	r2 = r8;
}
else{
	r2 = heap32[(r4+1)];
	heap32[(r7+3)] = r2;
	r2 = r8;
}
}
else{
	r2 = r8;
}
break;
}
	r4 = r2 >> 2;
	r7 = heap32[(r4)];
_76: do {
if(!(r7 ==0)) //_LBB233_141
{
_77: while(true){
	r7 = r1 >> 2;
	r8 = heap32[(r7+1)];
	if(r8 ==r5) //_LBB233_139
{
__label__ = 125;
break _77;
}
else{
if(!(r5 ==0)) //_LBB233_62
{
	r8 = r5 >> 2;
	r8 = heap32[(r8)];
if(!(r8 ==1)) //_LBB233_62
{
__label__ = 126;
break _77;
}
}
	r8 = r9 >> 2;
	r10 = heap32[(r8+2)];
	if(r10 !=r5) //_LBB233_100
{
	r11 = r10 >> 2;
	r12 = heap32[(r11)];
	if(r12 ==0) //_LBB233_102
{
	heap32[(r11)] = 1;
	heap32[(r8)] = 0;
	r10 = heap32[(r8+2)];
	r11 = r10 >> 2;
	r12 = heap32[(r11+3)];
	heap32[(r8+2)] = r12;
	r12 = heap32[(r11+3)];
if(!(r12 ==0)) //_LBB233_104
{
	r12 = r12 >> 2;
	heap32[(r12+1)] = r9;
}
	r12 = heap32[(r8+1)];
	heap32[(r11+1)] = r12;
	r12 = heap32[(r7+1)];
	if(r12 !=r9) //_LBB233_106
{
	r12 = heap32[(r8+1)];
	r12 = r12 >> 2;
	r13 = heap32[(r12+3)];
	if(r13 !=r9) //_LBB233_108
{
	heap32[(r12+2)] = r10;
}
else{
	heap32[(r12+3)] = r10;
}
}
else{
	heap32[(r7+1)] = r10;
}
	heap32[(r11+3)] = r9;
	heap32[(r8+1)] = r10;
	r10 = heap32[(r8+2)];
}
	r11 = r10 >> 2;
	r12 = heap32[(r11+3)];
if(!(r12 ==0)) //_LBB233_112
{
	r12 = r12 >> 2;
	r13 = heap32[(r12)];
	if(r13 !=1) //_LBB233_116
{
__label__ = 102;
break _77;
}
}
	r12 = heap32[(r11+2)];
if(!(r12 ==0)) //_LBB233_115
{
	r12 = r12 >> 2;
	r12 = heap32[(r12)];
if(!(r12 ==1)) //_LBB233_115
{
__label__ = 112;
break _77;
}
}
	heap32[(r11)] = 0;
}
else{
	r10 = heap32[(r8+3)];
	r11 = r10 >> 2;
	r12 = heap32[(r11)];
	if(r12 ==0) //_LBB233_65
{
	heap32[(r11)] = 1;
	heap32[(r8)] = 0;
	r10 = heap32[(r8+3)];
	r11 = r10 >> 2;
	r12 = heap32[(r11+2)];
	heap32[(r8+3)] = r12;
	r12 = heap32[(r11+2)];
if(!(r12 ==0)) //_LBB233_67
{
	r12 = r12 >> 2;
	heap32[(r12+1)] = r9;
}
	r12 = heap32[(r8+1)];
	heap32[(r11+1)] = r12;
	r12 = heap32[(r7+1)];
	if(r12 !=r9) //_LBB233_69
{
	r12 = heap32[(r8+1)];
	r12 = r12 >> 2;
	r13 = heap32[(r12+2)];
	if(r13 !=r9) //_LBB233_71
{
	heap32[(r12+3)] = r10;
}
else{
	heap32[(r12+2)] = r10;
}
}
else{
	heap32[(r7+1)] = r10;
}
	heap32[(r11+2)] = r9;
	heap32[(r8+1)] = r10;
	r10 = heap32[(r8+3)];
}
	r11 = r10 >> 2;
	r12 = heap32[(r11+2)];
if(!(r12 ==0)) //_LBB233_75
{
	r12 = r12 >> 2;
	r13 = heap32[(r12)];
	if(r13 !=1) //_LBB233_80
{
__label__ = 68;
break _77;
}
}
	r12 = heap32[(r11+3)];
if(!(r12 ==0)) //_LBB233_78
{
	r12 = r12 >> 2;
	r12 = heap32[(r12)];
if(!(r12 ==1)) //_LBB233_78
{
__label__ = 78;
break _77;
}
}
	heap32[(r11)] = 0;
}
	r10 = heap32[(r8+1)];
	r5 = r9;
	r9 = r10;
}
}
_125: do {
switch(__label__ ){//multiple entries
case 102: 
	r1 = heap32[(r11+2)];
if(!(r1 ==0)) //_LBB233_118
{
	r1 = r1 >> 2;
	r1 = heap32[(r1)];
	if(r1 !=1) //_LBB233_114
{
__label__ = 112;
break _125;
}
}
	heap32[(r12)] = 1;
	r1 = heap32[(r11+3)];
	r12 = r1 >> 2;
	heap32[(r11)] = 0;
	r13 = heap32[(r12+2)];
	heap32[(r11+3)] = r13;
	r13 = heap32[(r12+2)];
if(!(r13 ==0)) //_LBB233_120
{
	r13 = r13 >> 2;
	heap32[(r13+1)] = r10;
}
	r13 = heap32[(r11+1)];
	heap32[(r12+1)] = r13;
	r13 = heap32[(r7+1)];
	if(r13 !=r10) //_LBB233_122
{
	r13 = heap32[(r11+1)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+2)];
	if(r14 !=r10) //_LBB233_124
{
	heap32[(r13+3)] = r1;
}
else{
	heap32[(r13+2)] = r1;
}
}
else{
	heap32[(r7+1)] = r1;
}
	heap32[(r12+2)] = r10;
	heap32[(r11+1)] = r1;
	r10 = heap32[(r8+2)];
__label__ = 112;
break _125;
break;
case 68: 
	r1 = heap32[(r11+3)];
if(!(r1 ==0)) //_LBB233_82
{
	r1 = r1 >> 2;
	r1 = heap32[(r1)];
	if(r1 !=1) //_LBB233_77
{
__label__ = 78;
break _125;
}
}
	heap32[(r12)] = 1;
	r1 = heap32[(r11+2)];
	r12 = r1 >> 2;
	heap32[(r11)] = 0;
	r13 = heap32[(r12+3)];
	heap32[(r11+2)] = r13;
	r13 = heap32[(r12+3)];
if(!(r13 ==0)) //_LBB233_84
{
	r13 = r13 >> 2;
	heap32[(r13+1)] = r10;
}
	r13 = heap32[(r11+1)];
	heap32[(r12+1)] = r13;
	r13 = heap32[(r7+1)];
	if(r13 !=r10) //_LBB233_86
{
	r13 = heap32[(r11+1)];
	r13 = r13 >> 2;
	r14 = heap32[(r13+3)];
	if(r14 !=r10) //_LBB233_88
{
	heap32[(r13+2)] = r1;
}
else{
	heap32[(r13+3)] = r1;
}
}
else{
	heap32[(r7+1)] = r1;
}
	heap32[(r12+3)] = r10;
	heap32[(r11+1)] = r1;
	r10 = heap32[(r8+3)];
__label__ = 78;
break;
}
} while(0);
_154: do {
switch(__label__ ){//multiple entries
case 112: 
	r1 = r10 >> 2;
	r10 = heap32[(r8)];
	heap32[(r1)] = r10;
	heap32[(r8)] = 1;
	r1 = heap32[(r1+2)];
if(!(r1 ==0)) //_LBB233_128
{
	r1 = r1 >> 2;
	heap32[(r1)] = 1;
}
	r1 = heap32[(r8+2)];
	r10 = r1 >> 2;
	r11 = heap32[(r10+3)];
	heap32[(r8+2)] = r11;
	r11 = heap32[(r10+3)];
if(!(r11 ==0)) //_LBB233_130
{
	r11 = r11 >> 2;
	heap32[(r11+1)] = r9;
}
	r11 = heap32[(r8+1)];
	heap32[(r10+1)] = r11;
	r11 = heap32[(r7+1)];
	if(r11 !=r9) //_LBB233_132
{
	r7 = heap32[(r8+1)];
	r7 = r7 >> 2;
	r11 = heap32[(r7+3)];
	if(r11 !=r9) //_LBB233_134
{
	heap32[(r7+2)] = r1;
}
else{
	heap32[(r7+3)] = r1;
}
}
else{
	heap32[(r7+1)] = r1;
}
	heap32[(r10+3)] = r9;
	heap32[(r8+1)] = r1;
__label__ = 125;
break _154;
break;
case 78: 
	r1 = r10 >> 2;
	r10 = heap32[(r8)];
	heap32[(r1)] = r10;
	heap32[(r8)] = 1;
	r1 = heap32[(r1+3)];
if(!(r1 ==0)) //_LBB233_92
{
	r1 = r1 >> 2;
	heap32[(r1)] = 1;
}
	r1 = heap32[(r8+3)];
	r10 = r1 >> 2;
	r11 = heap32[(r10+2)];
	heap32[(r8+3)] = r11;
	r11 = heap32[(r10+2)];
if(!(r11 ==0)) //_LBB233_94
{
	r11 = r11 >> 2;
	heap32[(r11+1)] = r9;
}
	r11 = heap32[(r8+1)];
	heap32[(r10+1)] = r11;
	r11 = heap32[(r7+1)];
	if(r11 !=r9) //_LBB233_96
{
	r7 = heap32[(r8+1)];
	r7 = r7 >> 2;
	r11 = heap32[(r7+2)];
	if(r11 !=r9) //_LBB233_98
{
	heap32[(r7+3)] = r1;
}
else{
	heap32[(r7+2)] = r1;
}
}
else{
	heap32[(r7+1)] = r1;
}
	heap32[(r10+2)] = r9;
	heap32[(r8+1)] = r1;
__label__ = 125;
break;
}
} while(0);
switch(__label__ ){//multiple entries
case 125: 
	if(r5 ==0) //_LBB233_141
{
break _76;
}
break;
}
	r1 = r5 >> 2;
	heap32[(r1)] = 1;
}
} while(0);
	r1 = heap32[(r0+76)];
	heap32[(r4+3)] = r1;
	heap32[(r0+76)] = r2;
	r1 = heap32[(r0+80)];
	r1 = (r1 + -1)&-1;
	r2 = r3 >> 2;
	heap32[(r0+80)] = r1;
	heap32[(r2)] = r6;
	return;
}
else{
	r0 = r3 >> 2;
	heap32[(r0)] = r1;
	return;
}
}

function _ZN4__rw9__rb_treeIjSt4pairIKjPN5my_gl12TIndexBufferEENS_11__select1stIS6_jEESt4lessIjESaIS6_EE11_C_get_linkEv(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
	var r5;
	var r6;
var __label__ = 0;
	i7 = sp + -8;var g0 = i7>>2; // save stack
	r0 = _ZN5my_glL9m_contextE;
	r0 = r0 >> 2;
	r1 = heap32[(r0+76)];
	if(r1 ==0) //_LBB234_2
{
	r1 = heap32[(r0+77)];
	r2 = heap32[(r0+78)];
	if(r1 !=r2) //_LBB234_11
{
	r2 = (r1 + 24)&-1;
	heap32[(r0+77)] = r2;
}
else{
	r1 = heap32[(r0+75)];
	if(r1 !=0) //_LBB234_5
{
	r1 = r1 >> 2;
	r1 = heap32[(r1+1)];
}
else{
	r1 = 0;
}
	heap32[(g0)] = 12;
	_Znwj(i7);
	r2 = r_g0;
if(!(r2 !=0)) //_LBB234_8
{
	heap32[(g0)] = 3;
	_ZN4__rw10__rw_throwEiz(i7);
}
	r3 = r1 & 1023;
	r3 = (r3 * 1656)&-1;
	r4 = r1 >>> 10;
	r3 = r3 >>> 10;
	r4 = (r4 * 1656)&-1;
	r5 = (r1 + 32)&-1;
	r3 = (r3 + r4)&-1;
	r3 = uint(r5) > uint(r3) ? r5 : r3; 
	r4 = (r1 + 1)&-1;
	r3 = uint(r3) > uint(r1) ? r3 : r4; 
	r4 = (r3 * 24)&-1;
	heap32[(g0)] = r4;
	_Znwj(i7);
	r1 = r_g0;
if(!(r1 !=0)) //_LBB234_10
{
	heap32[(g0)] = 3;
	_ZN4__rw10__rw_throwEiz(i7);
}
	r5 = r2 >> 2;
	heap32[(r5+2)] = r1;
	r6 = heap32[(r0+75)];
	heap32[(r5)] = r6;
	heap32[(r5+1)] = r3;
	r3 = (r1 + r4)&-1;
	heap32[(r0+75)] = r2;
	r2 = (r1 + 24)&-1;
	heap32[(r0+78)] = r3;
	heap32[(r0+77)] = r2;
}
}
else{
	r2 = r1 >> 2;
	r2 = heap32[(r2+3)];
	heap32[(r0+76)] = r2;
}
	r0 = r1 >> 2;
	heap32[(r0+1)] = 0;
	heap32[(r0+2)] = 0;
	heap32[(r0+3)] = 0;
	heap32[(r0)] = 0;
	r_g0 = r1;
	return;
}

function _ZN4__rw9__rb_treeISsSt4pairIKSsiENS_11__select1stIS3_SsEESt4lessISsESaIS3_EED2Ev(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
	var r4;
var __label__ = 0;
	i7 = sp + -32;var g0 = i7>>2; // save stack
	r0 = heap32[(fp)];
	r1 = r0 >> 2;
	r2 = heap32[(r1+4)];
if(!(r2 ==0)) //_LBB235_3
{
	r3 = r2 >> 2;
	r3 = heap32[(r3+2)];
	heap32[(fp+-2)] = r3;
	r3 = sp + -16; 
	r4 = sp + -8; 
	heap32[(g0)] = r3;
	heap32[(g0+1)] = r0;
	heap32[(g0+2)] = r4;
	heap32[(g0+3)] = r2;
	_ZN4__rw9__rb_treeISsSt4pairIKSsiENS_11__select1stIS3_SsEESt4lessISsESaIS3_EE5eraseENS_14__rw_tree_iterIS3_iPS3_RS3_NS_17__rw_rb_tree_nodeIS8_S3_SsS5_EEEESF_(i7);
	r0 = heap32[(r1+4)];
	r2 = heap32[(r1+1)];
	r3 = r0 >> 2;
	heap32[(r3+3)] = r2;
	heap32[(r1+1)] = r0;
	r0 = heap32[(r1)];
if(!(r0 ==0)) //_LBB235_3
{
__label__ = 2; //SET chanka
_3: while(true){
	r2 = r0 >> 2;
	r3 = heap32[(r2)];
	heap32[(r1)] = r3;
	r2 = heap32[(r2+2)];
	heap32[(g0)] = r2;
	_ZdlPv(i7);
	heap32[(g0)] = r0;
	_ZdlPv(i7);
	r0 = heap32[(r1)];
	if(r0 !=0) //_LBB235_2
{
continue _3;
}
else{
break _3;
}
}
}
}
	return;
}

function Mandreel_TextureAsync_Loaded(sp)
{
	var i7;
	var fp = sp>>2;
	var r0;
	var r1;
	var r2;
	var r3;
var __label__ = 0;
	i7 = sp + -40;var g0 = i7>>2; // save stack
	r0 = 5;
	r0 = heap32[(r0)];
	r1 = heap32[(fp)];
	heap32[(g0)] = 0;
	heap32[(g0+1)] = 3553;
	heap32[(g0+2)] = r1;
	r2 = 100;
	__FUNCTION_TABLE__[(r0)>>2](i7);
	r0 = heap32[(r2)];
	r2 = heap32[(fp+1)];
	r3 = heap32[(fp+2)];
	heap32[(g0)] = 0;
	heap32[(g0+1)] = 3553;
	heap32[(g0+2)] = 0;
	heap32[(g0+3)] = 6408;
	heap32[(g0+4)] = r2;
	heap32[(g0+5)] = r3;
	heap32[(g0+6)] = 0;
	heap32[(g0+7)] = 6408;
	heap32[(g0+8)] = 5121;
	heap32[(g0+9)] = 0;
	__FUNCTION_TABLE__[(r0)>>2](i7);
	heap32[(g0)] = r1;
	Mandreel_TextureAsync_SetData(i7);
	return;
}

var _ZTI7b2Shape = Malloc(8);
var _ZTS7b2Shape = Malloc(9);
var _2E_str = Malloc(4);
var _2E_str1 = Malloc(2);
var _2E_str2 = Malloc(11);
var _2E_str13 = Malloc(47);
var _2E_str4 = Malloc(43);
var _2E_str15 = Malloc(50);
var b2_gjkCalls = Malloc(4);
var _2E_str7 = Malloc(6);
var _2E_str18 = Malloc(44);
var _2E_str29 = Malloc(30);
var _2E_str3 = Malloc(83);
var _2E_str410 = Malloc(37);
var _2E_str5 = Malloc(18);
var b2_gjkIters = Malloc(4);
var b2_gjkMaxIters = Malloc(4);
var _2E_str115 = Malloc(47);
var _2E_str1320 = Malloc(39);
var _2E_str17 = Malloc(11);
var _2E_str1823 = Malloc(31);
var _2E_str19 = Malloc(31);
var _2E_str20 = Malloc(31);
var _2E_str21 = Malloc(31);
var _2E_str22 = Malloc(32);
var _2E_str23 = Malloc(31);
var _2E_str24 = Malloc(31);
var _2E_str25 = Malloc(32);
var _2E_str26 = Malloc(16);
var _2E_str27 = Malloc(41);
var _2E_str28 = Malloc(26);
var _2E_str2924 = Malloc(30);
var _2E_str30 = Malloc(15);
var _2E_str31 = Malloc(15);
var b2_toiCalls = Malloc(4);
var _2E_str335 = Malloc(48);
var _2E_str436 = Malloc(23);
var _2E_str537 = Malloc(19);
var b2_toiRootIters = Malloc(4);
var b2_toiMaxRootIters = Malloc(4);
var b2_toiIters = Malloc(4);
var b2_toiMaxIters = Malloc(4);
var _2E_str139 = Malloc(53);
var _2E_str240 = Malloc(34);
var _ZTV11b2EdgeShape = Malloc(40);
var _ZTI11b2EdgeShape = Malloc(12);
var _ZTS11b2EdgeShape = Malloc(14);
var _ZTV14b2PolygonShape = Malloc(40);
var _ZTI14b2PolygonShape = Malloc(12);
var _ZTS14b2PolygonShape = Malloc(17);
var _2E_str48 = Malloc(19);
var _2E_str149 = Malloc(55);
var _2E_str250 = Malloc(22);
var _2E_str351 = Malloc(44);
var _ZN16b2BlockAllocator12s_blockSizesE = Malloc(56);
var _2E_str57 = Malloc(9);
var _2E_str158 = Malloc(47);
var _ZN16b2BlockAllocator17s_blockSizeLookupE = Malloc(641);
var _2E_str259 = Malloc(36);
var _2E_str360 = Malloc(96);
var _2E_str461 = Malloc(6);
var _ZN16b2BlockAllocator28s_blockSizeLookupInitializedE_2E_b = Malloc(1);
var _2E_str562 = Malloc(18);
var _2E_str663 = Malloc(39);
var _2E_str68 = Malloc(13);
var _2E_str169 = Malloc(47);
var _2E_str270 = Malloc(18);
var _2E_str371 = Malloc(17);
var _2E_str472 = Malloc(17);
var _2E_str573 = Malloc(34);
var _2E_str2094 = Malloc(29);
var _2E_str2195 = Malloc(39);
var _2E_str2296 = Malloc(11);
var _2E_str2397 = Malloc(25);
var _2E_str2498 = Malloc(23);
var _2E_str2599 = Malloc(29);
var _2E_str26100 = Malloc(21);
var _2E_str27101 = Malloc(31);
var _2E_str28102 = Malloc(60);
var _2E_str29103 = Malloc(58);
var b2_defaultFilter = Malloc(4);
var _ZTV17b2ContactListener = Malloc(32);
var _ZTI17b2ContactListener = Malloc(8);
var _ZTS17b2ContactListener = Malloc(20);
var b2_defaultListener = Malloc(4);
var _2E_str1109 = Malloc(86);
var _2E_str32144 = Malloc(42);
var _2E_str153 = Malloc(24);
var _2E_str1154 = Malloc(41);
var _2E_str2155 = Malloc(24);
var _2E_str13169 = Malloc(40);
var _2E_str16170 = Malloc(14);
var _2E_str17171 = Malloc(76);
var _2E_str18172 = Malloc(35);
var _2E_str19173 = Malloc(80);
var _2E_str20174 = Malloc(29);
var _2E_str21175 = Malloc(31);
var _2E_str23177 = Malloc(51);
var _2E_str24178 = Malloc(22);
var _2E_str25179 = Malloc(23);
var _2E_str26180 = Malloc(20);
var _ZTV15b2ContactFilter = Malloc(20);
var _ZTI15b2ContactFilter = Malloc(8);
var _ZTS15b2ContactFilter = Malloc(18);
var _ZTV23b2ChainAndCircleContact = Malloc(20);
var _ZTI23b2ChainAndCircleContact = Malloc(12);
var _ZTS23b2ChainAndCircleContact = Malloc(26);
var _ZTI9b2Contact = Malloc(8);
var _ZTS9b2Contact = Malloc(11);
var _2E_str189 = Malloc(42);
var _2E_str1190 = Malloc(65);
var _2E_str2191 = Malloc(43);
var _ZTV24b2ChainAndPolygonContact = Malloc(20);
var _ZTI24b2ChainAndPolygonContact = Malloc(12);
var _ZTS24b2ChainAndPolygonContact = Malloc(27);
var _2E_str1193 = Malloc(66);
var _2E_str2194 = Malloc(44);
var _ZTV15b2CircleContact = Malloc(20);
var _ZTI15b2CircleContact = Malloc(12);
var _ZTS15b2CircleContact = Malloc(18);
var _2E_str195 = Malloc(43);
var _2E_str1196 = Malloc(57);
var _ZN9b2Contact11s_registersE = Malloc(192);
var _ZTV9b2Contact = Malloc(20);
var _ZN9b2Contact13s_initializedE_2E_b = Malloc(1);
var _2E_str198 = Malloc(22);
var _2E_str1199 = Malloc(51);
var _2E_str2200 = Malloc(43);
var _2E_str3201 = Malloc(43);
var _2E_str4202 = Malloc(43);
var _2E_str207 = Malloc(35);
var _2E_str1208 = Malloc(57);
var _2E_str2209 = Malloc(27);
var _2E_str3210 = Malloc(19);
var _2E_str4211 = Malloc(25);
var _2E_str5212 = Malloc(15);
var _ZTV22b2EdgeAndCircleContact = Malloc(20);
var _ZTI22b2EdgeAndCircleContact = Malloc(12);
var _ZTS22b2EdgeAndCircleContact = Malloc(25);
var _2E_str221 = Malloc(41);
var _2E_str1222 = Malloc(64);
var _ZTV23b2EdgeAndPolygonContact = Malloc(20);
var _ZTI23b2EdgeAndPolygonContact = Malloc(12);
var _ZTS23b2EdgeAndPolygonContact = Malloc(26);
var _2E_str1227 = Malloc(65);
var _ZTV25b2PolygonAndCircleContact = Malloc(20);
var _ZTI25b2PolygonAndCircleContact = Malloc(12);
var _ZTS25b2PolygonAndCircleContact = Malloc(28);
var _2E_str231 = Malloc(44);
var _2E_str1232 = Malloc(67);
var _ZTV16b2PolygonContact = Malloc(20);
var _ZTI16b2PolygonContact = Malloc(12);
var _ZTS16b2PolygonContact = Malloc(19);
var _2E_str1237 = Malloc(58);
var _2E_str380 = Malloc(13);
var _ZN4__rwL12__rw_catlistE_2E_0 = Malloc(4);
var _ZN4__rwL12__rw_catlistE_2E_1 = Malloc(4);
var _ZN4__rwL12__rw_catlistE_2E_2 = Malloc(4);
var llvm_2E_eh_2E_catch_2E_all_2E_value = Malloc(4);
var _ZTIN4__rw10__rw_facetE = Malloc(12);
var _ZTSN4__rw10__rw_facetE = Malloc(20);
var _ZTIN4__rw17__rw_synchronizedE = Malloc(8);
var _ZTSN4__rw17__rw_synchronizedE = Malloc(27);
var _2E_str4385 = Malloc(21);
var _2E_str15386 = Malloc(1);
var _ZN4__rwL13__rw_what_bufE = Malloc(256);
var _ZN4__rwL16__rw_what_refcntE = Malloc(4);
var _2E_str26387 = Malloc(16);
var _2E_str3388 = Malloc(10);
var _2E_str47 = Malloc(25);
var _2E_str5389 = Malloc(18);
var _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E7__fname = Malloc(4);
var _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E6buffer = Malloc(11);
var _2E_str7391 = Malloc(3);
var _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E8__catset = Malloc(4);
var _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E4msgs = Malloc(32);
var _ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E5__cat = Malloc(4);
var _ZZN4__rw10__rw_throwEizE6errors = Malloc(100);
var _2E_str8392 = Malloc(26);
var _2E_str9393 = Malloc(18);
var _2E_str10394 = Malloc(29);
var _2E_str11395 = Malloc(33);
var _2E_str12396 = Malloc(17);
var _2E_str138 = Malloc(20);
var _2E_str14397 = Malloc(21);
var _2E_str159 = Malloc(25);
var _2E_str16398 = Malloc(51);
var _2E_str17399 = Malloc(47);
var _2E_str18400 = Malloc(22);
var _2E_str19401 = Malloc(44);
var _2E_str20402 = Malloc(23);
var _2E_str21403 = Malloc(24);
var _2E_str22404 = Malloc(39);
var _2E_str23405 = Malloc(38);
var _2E_str24406 = Malloc(38);
var _2E_str25407 = Malloc(29);
var _2E_str2610 = Malloc(44);
var _2E_str27408 = Malloc(30);
var _2E_str28409 = Malloc(40);
var _2E_str29410 = Malloc(26);
var _2E_str30411 = Malloc(27);
var _2E_str31412 = Malloc(30);
var _2E_str32413 = Malloc(32);
var _2E_str33414 = Malloc(11);
var _2E_str134 = Malloc(9);
var _2E_str235 = Malloc(12);
var _2E_str336 = Malloc(11);
var _2E_str437 = Malloc(8);
var _ZTVN4__rw10__rw_facetE = Malloc(16);
var _2E_str538 = Malloc(2);
var _ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE12n_std_facets = Malloc(4);
var _ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE10std_facets = Malloc(4);
var _ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE13std_facet_buf = Malloc(1664);
var _ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE17std_facet_bufsize = Malloc(4);
var _ZZN4__rw10__rw_facetD4EvE9destroyed = Malloc(24);
var _ZN4__rw9__rw_catsE = Malloc(72);
var _2E_str785 = Malloc(2);
var _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE6global = Malloc(4);
var _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE5ginit = Malloc(4);
var _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE9n_locales = Malloc(4);
var _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE7locales = Malloc(4);
var _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE10locale_buf = Malloc(32);
var _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE14locale_bufsize = Malloc(4);
var _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE7classic = Malloc(4);
var _ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE12classic_body = Malloc(172);
var _ZN4__rwL22__rw_classic_once_initE_2E_0_2E_b = Malloc(1);
var _ZN4__rwL12__rw_classicE = Malloc(4);
var _2E_str292 = Malloc(4);
var _2E_str10100 = Malloc(29);
var _2E_str12102 = Malloc(33);
var _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE4init_2E_b = Malloc(1);
var _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE8catalogs = Malloc(4);
var _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE11catalog_buf = Malloc(64);
var _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE15catalog_bufsize = Malloc(4);
var _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE10n_catalogs = Malloc(4);
var _ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE11largest_cat = Malloc(4);
var _2E_str115419 = Malloc(27);
var _2E_str1116 = Malloc(25);
var _2E_str4133 = Malloc(2);
var _ZZN4__rw16__rw_locale_nameEiPKcRNS_14__rw_pod_arrayIcLj256EEEE11locale_root = Malloc(259);
var _ZNSs11_C_null_refE = Malloc(16);
var _ZTVSt8messagesIcE = Malloc(28);
var _ZTISt8messagesIcE = Malloc(32);
var _ZTSSt8messagesIcE = Malloc(15);
var _ZTISt13messages_base = Malloc(8);
var _ZTSSt13messages_base = Malloc(18);
var _2E_str2360 = Malloc(31);
var _2E_str3361 = Malloc(48);
var _2E_str4362 = Malloc(31);
var block_null = Malloc(16);
var _2E_str640 = Malloc(57);
var _2E_str1645 = Malloc(3);
var _2E_str4648 = Malloc(4);
var _2E_str5649 = Malloc(4);
var my_ctype = Malloc(1028);
var _2E_str7651 = Malloc(4);
var _2E_str9652 = Malloc(4);
var _ZL8pad_line = Malloc(64);
var _ZL10strtok_pos = Malloc(4);
var _ZTI14CFileInterface = Malloc(8);
var _ZTS14CFileInterface = Malloc(17);
var _ZTV11CFileSystem = Malloc(44);
var _ZTI11CFileSystem = Malloc(12);
var _ZTS11CFileSystem = Malloc(14);
var _ZL13s_file_stdout = Malloc(4);
var _ZTV7CFileLS = Malloc(44);
var _ZTI7CFileLS = Malloc(12);
var _ZTS7CFileLS = Malloc(9);
var _ZTV10CFileCloud = Malloc(44);
var _ZTI10CFileCloud = Malloc(12);
var _ZTS10CFileCloud = Malloc(13);
var _ZL10s_aSockets = Malloc(262336);
var _ZTV11CFileStdout = Malloc(44);
var _ZTI11CFileStdout = Malloc(12);
var _ZTS11CFileStdout = Malloc(14);
var _2E_str31674 = Malloc(4);
var _2E_str32675 = Malloc(4);
var _2E_str33676 = Malloc(5);
var _2E_str34677 = Malloc(5);
var _2E_str35678 = Malloc(8);
var _2E_str36679 = Malloc(8);
var _2E_str37680 = Malloc(7);
var _ZN12mandreel_b64L9b64_charsE = Malloc(65);
var _ZN12mandreel_b64L11b64_indexesE = Malloc(256);
var _ZL25s_mandreel_internal_width = Malloc(4);
var _ZL26s_mandreel_internal_height = Malloc(4);
var g_msgcallback = Malloc(4);
var _ZZ24__mandreel_internal_initE54s_723478567_mandreel___mandreel_internal_SetResolution = Malloc(4);
var _ZL11g_aChannels = Malloc(9344);
var _ZL7g_bInit_2E_b = Malloc(1);
var _2E_str447 = Malloc(8);
var _2E_str1448 = Malloc(21);
var _ZL15g_iFreeChannels = Malloc(4);
var _ZL15g_aFreeChannels = Malloc(128);
var _ZL6g_bLog = Malloc(1);
var _ZL21g_pFirstSoundDuration = Malloc(4);
var _2E_str10457 = Malloc(71);
var _2E_str11458 = Malloc(13);
var _2E_str12459 = Malloc(86);
var _2E_str14461 = Malloc(8);
var _2E_str15462 = Malloc(4);
var _2E_str16463 = Malloc(60);
var _2E_str17464 = Malloc(10);
var _2E_str18465 = Malloc(3);
var _2E_str19466 = Malloc(75);
var _2E_str20467 = Malloc(9);
var _2E_str21468 = Malloc(22);
var _ZZL32_mandreel_init_tcp_socket_librayvE47s_723478567_mandreel_mandreel_flash_tcp_onError = Malloc(4);
var _ZN5my_glL9m_contextE = Malloc(328);
var llvm_2E_global_ctors = Malloc(24);
var llvm_2E_global_dtors = Malloc(24);
var llvm_2E_used = Malloc(300);
function global_init(stackPos)
{
emit_start(_ZTI7b2Shape)
emit_32(_ZTVN10__cxxabiv117__class_type_infoE+8);
emit_32(_ZTS7b2Shape);
emit_start(_ZTS7b2Shape)
emit_string('7b2Shape\x00');
emit_start(_2E_str)
emit_string('%f\x0a\x00');
emit_start(_2E_str1)
emit_string('\x0a\x00');
emit_start(_2E_str2)
emit_string('den > 0.0f\x00');
emit_start(_2E_str13)
emit_string('Box2D_v2.2.1/Box2D/Collision/b2CollideEdge.cpp\x00');
emit_start(_2E_str4)
emit_string('0 <= edge1 && edge1 < poly1->m_vertexCount\x00');
emit_start(_2E_str15)
emit_string('Box2D_v2.2.1/Box2D/Collision/b2CollidePolygon.cpp\x00');
emit_start(_2E_str7)
emit_string('false\x00');
emit_start(_2E_str18)
emit_string('Box2D_v2.2.1/Box2D/Collision/b2Distance.cpp\x00');
emit_start(_2E_str29)
emit_string('0 <= index && index < m_count\x00');
emit_start(_2E_str3)
emit_string('C:/MandreelSDK/Common/samples/helloworld/Box2D_v2.2.1/Box2D/Collision/b2Distance.h\x00');
emit_start(_2E_str410)
emit_string('0 <= index && index < chain->m_count\x00');
emit_start(_2E_str5)
emit_string('cache->count <= 3\x00');
emit_start(_2E_str115)
emit_string('Box2D_v2.2.1/Box2D/Collision/b2DynamicTree.cpp\x00');
emit_start(_2E_str1320)
emit_string('0 <= nodeId && nodeId < m_nodeCapacity\x00');
emit_start(_2E_str17)
emit_string('iA != (-1)\x00');
emit_start(_2E_str1823)
emit_string('0 <= iB && iB < m_nodeCapacity\x00');
emit_start(_2E_str19)
emit_string('0 <= iC && iC < m_nodeCapacity\x00');
emit_start(_2E_str20)
emit_string('0 <= iF && iF < m_nodeCapacity\x00');
emit_start(_2E_str21)
emit_string('0 <= iG && iG < m_nodeCapacity\x00');
emit_start(_2E_str22)
emit_string('m_nodes[C->parent].child2 == iA\x00');
emit_start(_2E_str23)
emit_string('0 <= iD && iD < m_nodeCapacity\x00');
emit_start(_2E_str24)
emit_string('0 <= iE && iE < m_nodeCapacity\x00');
emit_start(_2E_str25)
emit_string('m_nodes[B->parent].child2 == iA\x00');
emit_start(_2E_str26)
emit_string('0 < m_nodeCount\x00');
emit_start(_2E_str27)
emit_string('0 <= proxyId && proxyId < m_nodeCapacity\x00');
emit_start(_2E_str28)
emit_string('m_nodes[proxyId].IsLeaf()\x00');
emit_start(_2E_str2924)
emit_string('m_nodeCount == m_nodeCapacity\x00');
emit_start(_2E_str30)
emit_string('child1 != (-1)\x00');
emit_start(_2E_str31)
emit_string('child2 != (-1)\x00');
emit_start(_2E_str335)
emit_string('Box2D_v2.2.1/Box2D/Collision/b2TimeOfImpact.cpp\x00');
emit_start(_2E_str436)
emit_string('0 < count && count < 3\x00');
emit_start(_2E_str537)
emit_string('target > tolerance\x00');
emit_start(_2E_str139)
emit_string('Box2D_v2.2.1/Box2D/Collision/Shapes/b2ChainShape.cpp\x00');
emit_start(_2E_str240)
emit_string('0 <= index && index < m_count - 1\x00');
emit_start(_ZTV11b2EdgeShape)
emit_32(0);
emit_32(_ZTI11b2EdgeShape);
emit_32(_ZN11b2EdgeShapeD1Ev__index__);
emit_32(_ZN11b2EdgeShapeD0Ev__index__);
emit_32(_ZNK11b2EdgeShape5CloneEP16b2BlockAllocator__index__);
emit_32(_ZNK11b2EdgeShape13GetChildCountEv__index__);
emit_32(_ZNK11b2EdgeShape9TestPointERK11b2TransformRK6b2Vec2__index__);
emit_32(_ZNK11b2EdgeShape7RayCastEP15b2RayCastOutputRK14b2RayCastInputRK11b2Transformi__index__);
emit_32(_ZNK11b2EdgeShape11ComputeAABBEP6b2AABBRK11b2Transformi__index__);
emit_32(_ZNK11b2EdgeShape11ComputeMassEP10b2MassDataf__index__);
emit_start(_ZTI11b2EdgeShape)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS11b2EdgeShape);
emit_32(_ZTI7b2Shape);
emit_start(_ZTS11b2EdgeShape)
emit_string('11b2EdgeShape\x00');
emit_start(_ZTV14b2PolygonShape)
emit_32(0);
emit_32(_ZTI14b2PolygonShape);
emit_32(_ZN14b2PolygonShapeD1Ev__index__);
emit_32(_ZN14b2PolygonShapeD0Ev__index__);
emit_32(_ZNK14b2PolygonShape5CloneEP16b2BlockAllocator__index__);
emit_32(_ZNK14b2PolygonShape13GetChildCountEv__index__);
emit_32(_ZNK14b2PolygonShape9TestPointERK11b2TransformRK6b2Vec2__index__);
emit_32(_ZNK14b2PolygonShape7RayCastEP15b2RayCastOutputRK14b2RayCastInputRK11b2Transformi__index__);
emit_32(_ZNK14b2PolygonShape11ComputeAABBEP6b2AABBRK11b2Transformi__index__);
emit_32(_ZNK14b2PolygonShape11ComputeMassEP10b2MassDataf__index__);
emit_start(_ZTI14b2PolygonShape)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS14b2PolygonShape);
emit_32(_ZTI7b2Shape);
emit_start(_ZTS14b2PolygonShape)
emit_string('14b2PolygonShape\x00');
emit_start(_2E_str48)
emit_string('m_vertexCount >= 3\x00');
emit_start(_2E_str149)
emit_string('Box2D_v2.2.1/Box2D/Collision/Shapes/b2PolygonShape.cpp\x00');
emit_start(_2E_str250)
emit_string('area > 1.19209290e-7F\x00');
emit_start(_2E_str351)
emit_string('0.0f <= lower && lower <= input.maxFraction\x00');
emit_start(_ZN16b2BlockAllocator12s_blockSizesE)
emit_32(16);
emit_32(32);
emit_32(64);
emit_32(96);
emit_32(128);
emit_32(160);
emit_32(192);
emit_32(224);
emit_32(256);
emit_32(320);
emit_32(384);
emit_32(448);
emit_32(512);
emit_32(640);
emit_start(_2E_str57)
emit_string('0 < size\x00');
emit_start(_2E_str158)
emit_string('Box2D_v2.2.1/Box2D/Common/b2BlockAllocator.cpp\x00');
emit_start(_2E_str259)
emit_string('0 <= index && index < b2_blockSizes\x00');
emit_start(_2E_str360)
emit_string('(int8*)p + blockSize <= (int8*)chunk->blocks || (int8*)chunk->blocks + b2_chunkSize <= (int8*)p\x00');
emit_start(_2E_str461)
emit_string('found\x00');
emit_start(_2E_str562)
emit_string('j < b2_blockSizes\x00');
emit_start(_2E_str663)
emit_string('blockCount * blockSize <= b2_chunkSize\x00');
emit_start(_2E_str68)
emit_string('m_index == 0\x00');
emit_start(_2E_str169)
emit_string('Box2D_v2.2.1/Box2D/Common/b2StackAllocator.cpp\x00');
emit_start(_2E_str270)
emit_string('m_entryCount == 0\x00');
emit_start(_2E_str371)
emit_string('m_entryCount > 0\x00');
emit_start(_2E_str472)
emit_string('p == entry->data\x00');
emit_start(_2E_str573)
emit_string('m_entryCount < b2_maxStackEntries\x00');
emit_start(_2E_str2094)
emit_string('m_world->IsLocked() == false\x00');
emit_start(_2E_str2195)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/b2Body.cpp\x00');
emit_start(_2E_str2296)
emit_string('m_I > 0.0f\x00');
emit_start(_2E_str2397)
emit_string('m_type == b2_dynamicBody\x00');
emit_start(_2E_str2498)
emit_string('bd->position.IsValid()\x00');
emit_start(_2E_str2599)
emit_string('bd->linearVelocity.IsValid()\x00');
emit_start(_2E_str26100)
emit_string('b2IsValid(bd->angle)\x00');
emit_start(_2E_str27101)
emit_string('b2IsValid(bd->angularVelocity)\x00');
emit_start(_2E_str28102)
emit_string('b2IsValid(bd->angularDamping) && bd->angularDamping >= 0.0f\x00');
emit_start(_2E_str29103)
emit_string('b2IsValid(bd->linearDamping) && bd->linearDamping >= 0.0f\x00');
emit_start(b2_defaultFilter)
emit_32(_ZTV15b2ContactFilter+8);
emit_start(_ZTV17b2ContactListener)
emit_32(0);
emit_32(_ZTI17b2ContactListener);
emit_32(_ZN17b2ContactListenerD1Ev__index__);
emit_32(_ZN17b2ContactListenerD0Ev__index__);
emit_32(_ZN17b2ContactListener12BeginContactEP9b2Contact__index__);
emit_32(_ZN17b2ContactListener10EndContactEP9b2Contact__index__);
emit_32(_ZN17b2ContactListener8PreSolveEP9b2ContactPK10b2Manifold__index__);
emit_32(_ZN17b2ContactListener9PostSolveEP9b2ContactPK16b2ContactImpulse__index__);
emit_start(_ZTI17b2ContactListener)
emit_32(_ZTVN10__cxxabiv117__class_type_infoE+8);
emit_32(_ZTS17b2ContactListener);
emit_start(_ZTS17b2ContactListener)
emit_string('17b2ContactListener\x00');
emit_start(b2_defaultListener)
emit_32(_ZTV17b2ContactListener+8);
emit_start(_2E_str1109)
emit_string('C:/MandreelSDK/Common/samples/helloworld/Box2D_v2.2.1/Box2D/Collision/b2DynamicTree.h\x00');
emit_start(_2E_str32144)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/b2Fixture.cpp\x00');
emit_start(_2E_str153)
emit_string('toiIndexA < m_bodyCount\x00');
emit_start(_2E_str1154)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/b2Island.cpp\x00');
emit_start(_2E_str2155)
emit_string('toiIndexB < m_bodyCount\x00');
emit_start(_2E_str13169)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/b2World.cpp\x00');
emit_start(_2E_str16170)
emit_string('alpha0 < 1.0f\x00');
emit_start(_2E_str17171)
emit_string('C:/MandreelSDK/Common/samples/helloworld/Box2D_v2.2.1/Box2D/Common/b2Math.h\x00');
emit_start(_2E_str18172)
emit_string('m_contactCount < m_contactCapacity\x00');
emit_start(_2E_str19173)
emit_string('C:/MandreelSDK/Common/samples/helloworld/Box2D_v2.2.1/Box2D/Dynamics/b2Island.h\x00');
emit_start(_2E_str20174)
emit_string('m_bodyCount < m_bodyCapacity\x00');
emit_start(_2E_str21175)
emit_string('m_jointCount < m_jointCapacity\x00');
emit_start(_2E_str23177)
emit_string('typeA == b2_dynamicBody || typeB == b2_dynamicBody\x00');
emit_start(_2E_str24178)
emit_string('b->IsActive() == true\x00');
emit_start(_2E_str25179)
emit_string('stackCount < stackSize\x00');
emit_start(_2E_str26180)
emit_string('IsLocked() == false\x00');
emit_start(_ZTV15b2ContactFilter)
emit_32(0);
emit_32(_ZTI15b2ContactFilter);
emit_32(_ZN15b2ContactFilterD1Ev__index__);
emit_32(_ZN15b2ContactFilterD0Ev__index__);
emit_32(_ZN15b2ContactFilter13ShouldCollideEP9b2FixtureS1___index__);
emit_start(_ZTI15b2ContactFilter)
emit_32(_ZTVN10__cxxabiv117__class_type_infoE+8);
emit_32(_ZTS15b2ContactFilter);
emit_start(_ZTS15b2ContactFilter)
emit_string('15b2ContactFilter\x00');
emit_start(_ZTV23b2ChainAndCircleContact)
emit_32(0);
emit_32(_ZTI23b2ChainAndCircleContact);
emit_32(_ZN23b2ChainAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__);
emit_32(_ZN23b2ChainAndCircleContactD1Ev__index__);
emit_32(_ZN23b2ChainAndCircleContactD0Ev__index__);
emit_start(_ZTI23b2ChainAndCircleContact)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS23b2ChainAndCircleContact);
emit_32(_ZTI9b2Contact);
emit_start(_ZTS23b2ChainAndCircleContact)
emit_string('23b2ChainAndCircleContact\x00');
emit_start(_ZTI9b2Contact)
emit_32(_ZTVN10__cxxabiv117__class_type_infoE+8);
emit_32(_ZTS9b2Contact);
emit_start(_ZTS9b2Contact)
emit_string('9b2Contact\x00');
emit_start(_2E_str189)
emit_string('m_fixtureA->GetType() == b2Shape::e_chain\x00');
emit_start(_2E_str1190)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2ChainAndCircleContact.cpp\x00');
emit_start(_2E_str2191)
emit_string('m_fixtureB->GetType() == b2Shape::e_circle\x00');
emit_start(_ZTV24b2ChainAndPolygonContact)
emit_32(0);
emit_32(_ZTI24b2ChainAndPolygonContact);
emit_32(_ZN24b2ChainAndPolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__);
emit_32(_ZN24b2ChainAndPolygonContactD1Ev__index__);
emit_32(_ZN24b2ChainAndPolygonContactD0Ev__index__);
emit_start(_ZTI24b2ChainAndPolygonContact)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS24b2ChainAndPolygonContact);
emit_32(_ZTI9b2Contact);
emit_start(_ZTS24b2ChainAndPolygonContact)
emit_string('24b2ChainAndPolygonContact\x00');
emit_start(_2E_str1193)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2ChainAndPolygonContact.cpp\x00');
emit_start(_2E_str2194)
emit_string('m_fixtureB->GetType() == b2Shape::e_polygon\x00');
emit_start(_ZTV15b2CircleContact)
emit_32(0);
emit_32(_ZTI15b2CircleContact);
emit_32(_ZN15b2CircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__);
emit_32(_ZN15b2CircleContactD1Ev__index__);
emit_32(_ZN15b2CircleContactD0Ev__index__);
emit_start(_ZTI15b2CircleContact)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS15b2CircleContact);
emit_32(_ZTI9b2Contact);
emit_start(_ZTS15b2CircleContact)
emit_string('15b2CircleContact\x00');
emit_start(_2E_str195)
emit_string('m_fixtureA->GetType() == b2Shape::e_circle\x00');
emit_start(_2E_str1196)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2CircleContact.cpp\x00');
emit_start(_ZTV9b2Contact)
emit_32(0);
emit_32(_ZTI9b2Contact);
emit_32(__cxa_pure_virtual__index__);
emit_32(_ZN9b2ContactD1Ev__index__);
emit_32(_ZN9b2ContactD0Ev__index__);
emit_start(_2E_str198)
emit_string('s_initialized == true\x00');
emit_start(_2E_str1199)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2Contact.cpp\x00');
emit_start(_2E_str2200)
emit_string('0 <= typeA && typeB < b2Shape::e_typeCount\x00');
emit_start(_2E_str3201)
emit_string('0 <= type1 && type1 < b2Shape::e_typeCount\x00');
emit_start(_2E_str4202)
emit_string('0 <= type2 && type2 < b2Shape::e_typeCount\x00');
emit_start(_2E_str207)
emit_string('pointCount == 1 || pointCount == 2\x00');
emit_start(_2E_str1208)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2ContactSolver.cpp\x00');
emit_start(_2E_str2209)
emit_string('a.x >= 0.0f && a.y >= 0.0f\x00');
emit_start(_2E_str3210)
emit_string('pc->pointCount > 0\x00');
emit_start(_2E_str4211)
emit_string('manifold->pointCount > 0\x00');
emit_start(_2E_str5212)
emit_string('pointCount > 0\x00');
emit_start(_ZTV22b2EdgeAndCircleContact)
emit_32(0);
emit_32(_ZTI22b2EdgeAndCircleContact);
emit_32(_ZN22b2EdgeAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__);
emit_32(_ZN22b2EdgeAndCircleContactD1Ev__index__);
emit_32(_ZN22b2EdgeAndCircleContactD0Ev__index__);
emit_start(_ZTI22b2EdgeAndCircleContact)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS22b2EdgeAndCircleContact);
emit_32(_ZTI9b2Contact);
emit_start(_ZTS22b2EdgeAndCircleContact)
emit_string('22b2EdgeAndCircleContact\x00');
emit_start(_2E_str221)
emit_string('m_fixtureA->GetType() == b2Shape::e_edge\x00');
emit_start(_2E_str1222)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2EdgeAndCircleContact.cpp\x00');
emit_start(_ZTV23b2EdgeAndPolygonContact)
emit_32(0);
emit_32(_ZTI23b2EdgeAndPolygonContact);
emit_32(_ZN23b2EdgeAndPolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__);
emit_32(_ZN23b2EdgeAndPolygonContactD1Ev__index__);
emit_32(_ZN23b2EdgeAndPolygonContactD0Ev__index__);
emit_start(_ZTI23b2EdgeAndPolygonContact)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS23b2EdgeAndPolygonContact);
emit_32(_ZTI9b2Contact);
emit_start(_ZTS23b2EdgeAndPolygonContact)
emit_string('23b2EdgeAndPolygonContact\x00');
emit_start(_2E_str1227)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact.cpp\x00');
emit_start(_ZTV25b2PolygonAndCircleContact)
emit_32(0);
emit_32(_ZTI25b2PolygonAndCircleContact);
emit_32(_ZN25b2PolygonAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__);
emit_32(_ZN25b2PolygonAndCircleContactD1Ev__index__);
emit_32(_ZN25b2PolygonAndCircleContactD0Ev__index__);
emit_start(_ZTI25b2PolygonAndCircleContact)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS25b2PolygonAndCircleContact);
emit_32(_ZTI9b2Contact);
emit_start(_ZTS25b2PolygonAndCircleContact)
emit_string('25b2PolygonAndCircleContact\x00');
emit_start(_2E_str231)
emit_string('m_fixtureA->GetType() == b2Shape::e_polygon\x00');
emit_start(_2E_str1232)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2PolygonAndCircleContact.cpp\x00');
emit_start(_ZTV16b2PolygonContact)
emit_32(0);
emit_32(_ZTI16b2PolygonContact);
emit_32(_ZN16b2PolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__);
emit_32(_ZN16b2PolygonContactD1Ev__index__);
emit_32(_ZN16b2PolygonContactD0Ev__index__);
emit_start(_ZTI16b2PolygonContact)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS16b2PolygonContact);
emit_32(_ZTI9b2Contact);
emit_start(_ZTS16b2PolygonContact)
emit_string('16b2PolygonContact\x00');
emit_start(_2E_str1237)
emit_string('Box2D_v2.2.1/Box2D/Dynamics/Contacts/b2PolygonContact.cpp\x00');
emit_start(_2E_str380)
emit_string('hello world\x0a\x00');
emit_start(llvm_2E_eh_2E_catch_2E_all_2E_value)
emit_32(0);
emit_start(_ZTIN4__rw10__rw_facetE)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTSN4__rw10__rw_facetE);
emit_32(_ZTIN4__rw17__rw_synchronizedE);
emit_start(_ZTSN4__rw10__rw_facetE)
emit_string('N4__rw10__rw_facetE\x00');
emit_start(_ZTIN4__rw17__rw_synchronizedE)
emit_32(_ZTVN10__cxxabiv117__class_type_infoE+8);
emit_32(_ZTSN4__rw17__rw_synchronizedE);
emit_start(_ZTSN4__rw17__rw_synchronizedE)
emit_string('N4__rw17__rw_synchronizedE\x00');
emit_start(_2E_str4385)
emit_string('unexpected exception\x00');
emit_start(_2E_str15386)
emit_fill(0,1);
emit_start(_2E_str26387)
emit_string('Exception: %s.\x0a\x00');
emit_start(_2E_str3388)
emit_string('exception\x00');
emit_start(_2E_str47)
emit_string('bad_alloc: out of memory\x00');
emit_start(_2E_str5389)
emit_string('unknown exception\x00');
emit_start(_ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E6buffer)
emit_string('rwstderr:1\x00');
emit_start(_2E_str7391)
emit_string('%d\x00');
emit_start(_ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E8__catset)
emit_32(1);
emit_start(_ZZN4__rwL13__rw_vfmtwhatEPcjiS0_E5__cat)
emit_32(4294967295);
emit_start(_ZZN4__rw10__rw_throwEizE6errors)
emit_32(_2E_str8392);
emit_32(_2E_str9393);
emit_32(_2E_str10394);
emit_32(_2E_str11395);
emit_32(_2E_str12396);
emit_32(_2E_str138);
emit_32(_2E_str14397);
emit_32(_2E_str159);
emit_32(_2E_str16398);
emit_32(_2E_str17399);
emit_32(_2E_str18400);
emit_32(_2E_str19401);
emit_32(_2E_str20402);
emit_32(_2E_str21403);
emit_32(_2E_str22404);
emit_32(_2E_str23405);
emit_32(_2E_str24406);
emit_32(_2E_str25407);
emit_32(_2E_str2610);
emit_32(_2E_str27408);
emit_32(_2E_str28409);
emit_32(_2E_str29410);
emit_32(_2E_str30411);
emit_32(_2E_str31412);
emit_32(_2E_str32413);
emit_start(_2E_str8392)
emit_string('%s: %s: unspecified error\x00');
emit_start(_2E_str9393)
emit_string('%s: %s: exception\x00');
emit_start(_2E_str10394)
emit_string('%s: %s: unexpected exception\x00');
emit_start(_2E_str11395)
emit_string('%s: %s: bad_alloc: out of memory\x00');
emit_start(_2E_str12396)
emit_string('%s: %s: bad cast\x00');
emit_start(_2E_str138)
emit_string('%s: %s: logic error\x00');
emit_start(_2E_str14397)
emit_string('%s: %s: domain error\x00');
emit_start(_2E_str159)
emit_string('%s: %s: invalid argument\x00');
emit_start(_2E_str16398)
emit_string('%s: %s: length error: size %u out of range [0, %u)\x00');
emit_start(_2E_str17399)
emit_string('%s: %s: argument value %u out of range [0, %u)\x00');
emit_start(_2E_str18400)
emit_string('%s: %s: runtime error\x00');
emit_start(_2E_str19401)
emit_string('%s: %s: range error: invalid range [%d, %d)\x00');
emit_start(_2E_str20402)
emit_string('%s: %s: overflow error\x00');
emit_start(_2E_str21403)
emit_string('%s: %s: underflow error\x00');
emit_start(_2E_str22404)
emit_string('%s: stream object has set ios::failbit\x00');
emit_start(_2E_str23405)
emit_string('%s: stream object has set ios::badbit\x00');
emit_start(_2E_str24406)
emit_string('%s: stream object has set ios::eofbit\x00');
emit_start(_2E_str25407)
emit_string('%s: stream object has set %s\x00');
emit_start(_2E_str2610)
emit_string('%s: %s: facet %u not found in locale (\x22%s\x22)\x00');
emit_start(_2E_str27408)
emit_string('%s: %s: bad locale name: \x22%s\x22\x00');
emit_start(_2E_str28409)
emit_string('%s: %s: failed to construct locale name\x00');
emit_start(_2E_str29410)
emit_string('%s: %s: conversion failed\x00');
emit_start(_2E_str30411)
emit_string('%s: %s: invalid pointer %p\x00');
emit_start(_2E_str31412)
emit_string('%s: %s: transformation failed\x00');
emit_start(_2E_str32413)
emit_string('%s: %s: bad category value: %#x\x00');
emit_start(_2E_str33414)
emit_string('LC_COLLATE\x00');
emit_start(_2E_str134)
emit_string('LC_CTYPE\x00');
emit_start(_2E_str235)
emit_string('LC_MONETARY\x00');
emit_start(_2E_str336)
emit_string('LC_NUMERIC\x00');
emit_start(_2E_str437)
emit_string('LC_TIME\x00');
emit_start(_ZTVN4__rw10__rw_facetE)
emit_32(0);
emit_32(_ZTIN4__rw10__rw_facetE);
emit_32(_ZN4__rw10__rw_facetD1Ev__index__);
emit_32(_ZN4__rw10__rw_facetD0Ev__index__);
emit_start(_2E_str538)
emit_string('C\x00');
emit_start(_ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE10std_facets)
emit_32(_ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE13std_facet_buf);
emit_start(_ZZN4__rw10__rw_facet9_C_manageEPS0_NS0_13_C_facet_typeEPKcPFS1_jS4_EE17std_facet_bufsize)
emit_32(416);
emit_start(_ZZN4__rw10__rw_facetD4EvE9destroyed)
emit_string('*** destroyed facet ***\x00');
emit_start(_ZN4__rw9__rw_catsE)
emit_32(1);
emit_32(_2E_str33414);
emit_32(8193);
emit_32(2);
emit_32(_2E_str134);
emit_32(49158);
emit_32(3);
emit_32(_2E_str235);
emit_32(983160);
emit_32(4);
emit_32(_2E_str336);
emit_32(7340928);
emit_32(5);
emit_32(_2E_str437);
emit_32(25168896);
emit_32(1);
emit_32(_2E_str33414);
emit_32(8193);
emit_start(_2E_str785)
emit_string(';\x00');
emit_start(_ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE7locales)
emit_32(_ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE10locale_buf);
emit_start(_ZZN4__rw11__rw_locale9_C_manageEPS0_PKcE14locale_bufsize)
emit_32(8);
emit_start(_2E_str292)
emit_string('LC_\x00');
emit_start(_2E_str10100)
emit_string('locale::locale (const char*)\x00');
emit_start(_2E_str12102)
emit_string('../stdcxx/locale_combine.cpp:650\x00');
emit_start(_ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE8catalogs)
emit_32(_ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE11catalog_buf);
emit_start(_ZZN4__rwL20__rw_manage_cat_dataERiPNS_18__rw_open_cat_dataEE15catalog_bufsize)
emit_32(8);
emit_start(_2E_str115419)
emit_string('../stdcxx/messages.cpp:308\x00');
emit_start(_2E_str1116)
emit_string('__rw_cat_close (int cat)\x00');
emit_start(_2E_str4133)
emit_string(',\x00');
emit_start(_ZTVSt8messagesIcE)
emit_32(0);
emit_32(_ZTISt8messagesIcE);
emit_32(_ZNSt8messagesIcED1Ev__index__);
emit_32(_ZNSt8messagesIcED0Ev__index__);
emit_32(_ZNKSt8messagesIcE7do_openERKSsRKSt6locale__index__);
emit_32(_ZNKSt8messagesIcE6do_getEiiiRKSs__index__);
emit_32(_ZNKSt8messagesIcE8do_closeEi__index__);
emit_start(_ZTISt8messagesIcE)
emit_32(_ZTVN10__cxxabiv121__vmi_class_type_infoE+8);
emit_32(_ZTSSt8messagesIcE);
emit_32(0);
emit_32(2);
emit_32(_ZTIN4__rw10__rw_facetE);
emit_32(2);
emit_32(_ZTISt13messages_base);
emit_32(2);
emit_start(_ZTSSt8messagesIcE)
emit_string('St8messagesIcE\x00');
emit_start(_ZTISt13messages_base)
emit_32(_ZTVN10__cxxabiv117__class_type_infoE+8);
emit_32(_ZTSSt13messages_base);
emit_start(_ZTSSt13messages_base)
emit_string('St13messages_base\x00');
emit_start(_2E_str2360)
emit_string('../stdcxx/include/string.cc:88\x00');
emit_start(_2E_str3361)
emit_string('basic_string::_C_get_rep (size_type, size_type)\x00');
emit_start(_2E_str4362)
emit_string('../stdcxx/include/string.cc:95\x00');
emit_start(_2E_str640)
emit_string('tlsf_create: Pool size must be between %d and %d bytes.\x0a\x00');
emit_start(_2E_str1645)
emit_string('rb\x00');
emit_start(_2E_str4648)
emit_string('rb+\x00');
emit_start(_2E_str5649)
emit_string('wb+\x00');
emit_start(my_ctype)
emit_32(0);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(40);
emit_32(40);
emit_32(40);
emit_32(40);
emit_32(40);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(32);
emit_32(72);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(132);
emit_32(132);
emit_32(132);
emit_32(132);
emit_32(132);
emit_32(132);
emit_32(132);
emit_32(132);
emit_32(132);
emit_32(132);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(129);
emit_32(129);
emit_32(129);
emit_32(129);
emit_32(129);
emit_32(129);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(1);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(130);
emit_32(130);
emit_32(130);
emit_32(130);
emit_32(130);
emit_32(130);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(2);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(16);
emit_32(32);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_32(0);
emit_start(_2E_str7651)
emit_string('inf\x00');
emit_start(_2E_str9652)
emit_string('nan\x00');
emit_start(_ZL8pad_line)
emit_string('                \x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00');
emit_string('0000000000000000\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00');
emit_start(_ZTI14CFileInterface)
emit_32(_ZTVN10__cxxabiv117__class_type_infoE+8);
emit_32(_ZTS14CFileInterface);
emit_start(_ZTS14CFileInterface)
emit_string('14CFileInterface\x00');
emit_start(_ZTV11CFileSystem)
emit_32(0);
emit_32(_ZTI11CFileSystem);
emit_32(_ZNK11CFileSystem12IsFileSystemEv__index__);
emit_32(_ZN11CFileSystem5freadEPvjj__index__);
emit_32(_ZN11CFileSystem6fwriteEPKvjj__index__);
emit_32(_ZN11CFileSystem6fflushEv__index__);
emit_32(_ZN11CFileSystem6fcloseEv__index__);
emit_32(_ZN11CFileSystem5ftellEv__index__);
emit_32(_ZN11CFileSystem4feofEv__index__);
emit_32(_ZN11CFileSystem5fseekEli__index__);
emit_32(_ZN11CFileSystem6ungetcEi__index__);
emit_start(_ZTI11CFileSystem)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS11CFileSystem);
emit_32(_ZTI14CFileInterface);
emit_start(_ZTS11CFileSystem)
emit_string('11CFileSystem\x00');
emit_start(_ZL13s_file_stdout)
emit_32(_ZTV11CFileStdout+8);
emit_start(_ZTV7CFileLS)
emit_32(0);
emit_32(_ZTI7CFileLS);
emit_32(_ZNK14CFileInterface12IsFileSystemEv__index__);
emit_32(_ZN7CFileLS5freadEPvjj__index__);
emit_32(_ZN7CFileLS6fwriteEPKvjj__index__);
emit_32(_ZN7CFileLS6fflushEv__index__);
emit_32(_ZN7CFileLS6fcloseEv__index__);
emit_32(_ZN7CFileLS5ftellEv__index__);
emit_32(_ZN7CFileLS4feofEv__index__);
emit_32(_ZN7CFileLS5fseekEli__index__);
emit_32(_ZN7CFileLS6ungetcEi__index__);
emit_start(_ZTI7CFileLS)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS7CFileLS);
emit_32(_ZTI14CFileInterface);
emit_start(_ZTS7CFileLS)
emit_string('7CFileLS\x00');
emit_start(_ZTV10CFileCloud)
emit_32(0);
emit_32(_ZTI10CFileCloud);
emit_32(_ZNK14CFileInterface12IsFileSystemEv__index__);
emit_32(_ZN10CFileCloud5freadEPvjj__index__);
emit_32(_ZN10CFileCloud6fwriteEPKvjj__index__);
emit_32(_ZN10CFileCloud6fflushEv__index__);
emit_32(_ZN10CFileCloud6fcloseEv__index__);
emit_32(_ZN10CFileCloud5ftellEv__index__);
emit_32(_ZN10CFileCloud4feofEv__index__);
emit_32(_ZN10CFileCloud5fseekEli__index__);
emit_32(_ZN10CFileCloud6ungetcEi__index__);
emit_start(_ZTI10CFileCloud)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS10CFileCloud);
emit_32(_ZTI14CFileInterface);
emit_start(_ZTS10CFileCloud)
emit_string('10CFileCloud\x00');
emit_start(_ZTV11CFileStdout)
emit_32(0);
emit_32(_ZTI11CFileStdout);
emit_32(_ZNK14CFileInterface12IsFileSystemEv__index__);
emit_32(_ZN11CFileStdout5freadEPvjj__index__);
emit_32(_ZN11CFileStdout6fwriteEPKvjj__index__);
emit_32(_ZN11CFileStdout6fflushEv__index__);
emit_32(_ZN11CFileStdout6fcloseEv__index__);
emit_32(_ZN11CFileStdout5ftellEv__index__);
emit_32(_ZN11CFileStdout4feofEv__index__);
emit_32(_ZN11CFileStdout5fseekEli__index__);
emit_32(_ZN11CFileStdout6ungetcEi__index__);
emit_start(_ZTI11CFileStdout)
emit_32(_ZTVN10__cxxabiv120__si_class_type_infoE+8);
emit_32(_ZTS11CFileStdout);
emit_32(_ZTI14CFileInterface);
emit_start(_ZTS11CFileStdout)
emit_string('11CFileStdout\x00');
emit_start(_2E_str31674)
emit_string('r+b\x00');
emit_start(_2E_str32675)
emit_string('w+b\x00');
emit_start(_2E_str33676)
emit_string('/ls/\x00');
emit_start(_2E_str34677)
emit_string('/ls\x5c\x00');
emit_start(_2E_str35678)
emit_string('/cloud/\x00');
emit_start(_2E_str36679)
emit_string('/cloud\x5c\x00');
emit_start(_2E_str37680)
emit_string('(null)\x00');
emit_start(_ZN12mandreel_b64L9b64_charsE)
emit_string('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x00');
emit_start(_ZN12mandreel_b64L11b64_indexesE)
emit_string('\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff>\xff\xff\xff?456789:;<=\xff\xff\xff\xff\xff\xff\xff\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\xff\xff\xff\xff\xff\xff\x1a\x1b\x1c\x1d\x1e\x1f !\x22#$%&\x27()*+,-./0123\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff');
emit_start(_ZL25s_mandreel_internal_width)
emit_32(1024);
emit_start(_ZL26s_mandreel_internal_height)
emit_32(768);
emit_start(_2E_str447)
emit_string('g_bInit\x00');
emit_start(_2E_str1448)
emit_string('MandreelAudioLib.cpp\x00');
emit_start(_2E_str10457)
emit_string('Mandreel_Audio_GetSoundDuration warning: sound duration not found(%s)\x0a\x00');
emit_start(_2E_str11458)
emit_string('mandreel.fat\x00');
emit_start(_2E_str12459)
emit_string('error: mandreel.fat file not found. Maybe the working folder is not correctly set???\x0a\x00');
emit_start(_2E_str14461)
emit_string('version\x00');
emit_start(_2E_str15462)
emit_string('1.3\x00');
emit_start(_2E_str16463)
emit_string('ERROR: mandreel.fat version number is (%s) instead of (%s)\x0a\x00');
emit_start(_2E_str17464)
emit_string('audiofile\x00');
emit_start(_2E_str18465)
emit_string('??\x00');
emit_start(_2E_str19466)
emit_string('warning: audiofile(%s) duration can\x27t be read, invalid mandreel.fat file?\x0a\x00');
emit_start(_2E_str20467)
emit_string('!g_bInit\x00');
emit_start(_2E_str21468)
emit_string('Mandreel_Audio_Init()\x00');
emit_start(llvm_2E_global_ctors)
emit_32(65535);
emit_32(_GLOBAL__I__ZN4__rw9__catfindEPNS_8__rw_catE__index__);
emit_32(65535);
emit_32(_GLOBAL__I__mandreel_create_tcp_socket__index__);
emit_32(65535);
emit_32(_GLOBAL__I__ZN5my_gl14glAttachShaderEjj__index__);
emit_start(llvm_2E_global_dtors)
emit_32(65535);
emit_32(_GLOBAL__D_b2_defaultFilter__index__);
emit_32(65535);
emit_32(_GLOBAL__D__ZN4__rw9__catfindEPNS_8__rw_catE__index__);
emit_32(65535);
emit_32(_GLOBAL__D__ZN5my_gl14glAttachShaderEjj__index__);
emit_start(llvm_2E_used)
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
emit_32(llvm_2E_eh_2E_catch_2E_all_2E_value);
mandreel_call_constructors(llvm_2E_global_ctors,3,stackPos);
}
var _GLOBAL__D__ZN4__rw9__catfindEPNS_8__rw_catE__index__ = register_delegate(_GLOBAL__D__ZN4__rw9__catfindEPNS_8__rw_catE);
var _GLOBAL__D__ZN5my_gl14glAttachShaderEjj__index__ = register_delegate(_GLOBAL__D__ZN5my_gl14glAttachShaderEjj);
var _GLOBAL__D_b2_defaultFilter__index__ = register_delegate(_GLOBAL__D_b2_defaultFilter);
var _GLOBAL__I__ZN4__rw9__catfindEPNS_8__rw_catE__index__ = register_delegate(_GLOBAL__I__ZN4__rw9__catfindEPNS_8__rw_catE);
var _GLOBAL__I__ZN5my_gl14glAttachShaderEjj__index__ = register_delegate(_GLOBAL__I__ZN5my_gl14glAttachShaderEjj);
var _GLOBAL__I__mandreel_create_tcp_socket__index__ = register_delegate(_GLOBAL__I__mandreel_create_tcp_socket);
var _Z31MandreelDefaultDebugMsgCallbackiPKc__index__ = register_delegate(_Z31MandreelDefaultDebugMsgCallbackiPKc);
var _ZN10CFileCloud4feofEv__index__ = register_delegate(_ZN10CFileCloud4feofEv);
var _ZN10CFileCloud5freadEPvjj__index__ = register_delegate(_ZN10CFileCloud5freadEPvjj);
var _ZN10CFileCloud5fseekEli__index__ = register_delegate(_ZN10CFileCloud5fseekEli);
var _ZN10CFileCloud5ftellEv__index__ = register_delegate(_ZN10CFileCloud5ftellEv);
var _ZN10CFileCloud6fcloseEv__index__ = register_delegate(_ZN10CFileCloud6fcloseEv);
var _ZN10CFileCloud6fflushEv__index__ = register_delegate(_ZN10CFileCloud6fflushEv);
var _ZN10CFileCloud6fwriteEPKvjj__index__ = register_delegate(_ZN10CFileCloud6fwriteEPKvjj);
var _ZN10CFileCloud6ungetcEi__index__ = register_delegate(_ZN10CFileCloud6ungetcEi);
var _ZN11CFileStdout4feofEv__index__ = register_delegate(_ZN11CFileStdout4feofEv);
var _ZN11CFileStdout5freadEPvjj__index__ = register_delegate(_ZN11CFileStdout5freadEPvjj);
var _ZN11CFileStdout5fseekEli__index__ = register_delegate(_ZN11CFileStdout5fseekEli);
var _ZN11CFileStdout5ftellEv__index__ = register_delegate(_ZN11CFileStdout5ftellEv);
var _ZN11CFileStdout6fcloseEv__index__ = register_delegate(_ZN11CFileStdout6fcloseEv);
var _ZN11CFileStdout6fflushEv__index__ = register_delegate(_ZN11CFileStdout6fflushEv);
var _ZN11CFileStdout6fwriteEPKvjj__index__ = register_delegate(_ZN11CFileStdout6fwriteEPKvjj);
var _ZN11CFileStdout6ungetcEi__index__ = register_delegate(_ZN11CFileStdout6ungetcEi);
var _ZN11CFileSystem4feofEv__index__ = register_delegate(_ZN11CFileSystem4feofEv);
var _ZN11CFileSystem5freadEPvjj__index__ = register_delegate(_ZN11CFileSystem5freadEPvjj);
var _ZN11CFileSystem5fseekEli__index__ = register_delegate(_ZN11CFileSystem5fseekEli);
var _ZN11CFileSystem5ftellEv__index__ = register_delegate(_ZN11CFileSystem5ftellEv);
var _ZN11CFileSystem6fcloseEv__index__ = register_delegate(_ZN11CFileSystem6fcloseEv);
var _ZN11CFileSystem6fflushEv__index__ = register_delegate(_ZN11CFileSystem6fflushEv);
var _ZN11CFileSystem6fwriteEPKvjj__index__ = register_delegate(_ZN11CFileSystem6fwriteEPKvjj);
var _ZN11CFileSystem6ungetcEi__index__ = register_delegate(_ZN11CFileSystem6ungetcEi);
var _ZN11b2EdgeShapeD0Ev__index__ = register_delegate(_ZN11b2EdgeShapeD0Ev);
var _ZN11b2EdgeShapeD1Ev__index__ = register_delegate(_ZN11b2EdgeShapeD1Ev);
var _ZN14b2PolygonShapeD0Ev__index__ = register_delegate(_ZN14b2PolygonShapeD0Ev);
var _ZN14b2PolygonShapeD1Ev__index__ = register_delegate(_ZN14b2PolygonShapeD1Ev);
var _ZN15b2CircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__ = register_delegate(_ZN15b2CircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator);
var _ZN15b2CircleContact7DestroyEP9b2ContactP16b2BlockAllocator__index__ = register_delegate(_ZN15b2CircleContact7DestroyEP9b2ContactP16b2BlockAllocator);
var _ZN15b2CircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__ = register_delegate(_ZN15b2CircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4_);
var _ZN15b2CircleContactD0Ev__index__ = register_delegate(_ZN15b2CircleContactD0Ev);
var _ZN15b2CircleContactD1Ev__index__ = register_delegate(_ZN15b2CircleContactD1Ev);
var _ZN15b2ContactFilter13ShouldCollideEP9b2FixtureS1___index__ = register_delegate(_ZN15b2ContactFilter13ShouldCollideEP9b2FixtureS1_);
var _ZN15b2ContactFilterD0Ev__index__ = register_delegate(_ZN15b2ContactFilterD0Ev);
var _ZN15b2ContactFilterD1Ev__index__ = register_delegate(_ZN15b2ContactFilterD1Ev);
var _ZN16b2PolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__ = register_delegate(_ZN16b2PolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator);
var _ZN16b2PolygonContact7DestroyEP9b2ContactP16b2BlockAllocator__index__ = register_delegate(_ZN16b2PolygonContact7DestroyEP9b2ContactP16b2BlockAllocator);
var _ZN16b2PolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__ = register_delegate(_ZN16b2PolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4_);
var _ZN16b2PolygonContactD0Ev__index__ = register_delegate(_ZN16b2PolygonContactD0Ev);
var _ZN16b2PolygonContactD1Ev__index__ = register_delegate(_ZN16b2PolygonContactD1Ev);
var _ZN17b2ContactListener10EndContactEP9b2Contact__index__ = register_delegate(_ZN17b2ContactListener10EndContactEP9b2Contact);
var _ZN17b2ContactListener12BeginContactEP9b2Contact__index__ = register_delegate(_ZN17b2ContactListener12BeginContactEP9b2Contact);
var _ZN17b2ContactListener8PreSolveEP9b2ContactPK10b2Manifold__index__ = register_delegate(_ZN17b2ContactListener8PreSolveEP9b2ContactPK10b2Manifold);
var _ZN17b2ContactListener9PostSolveEP9b2ContactPK16b2ContactImpulse__index__ = register_delegate(_ZN17b2ContactListener9PostSolveEP9b2ContactPK16b2ContactImpulse);
var _ZN17b2ContactListenerD0Ev__index__ = register_delegate(_ZN17b2ContactListenerD0Ev);
var _ZN17b2ContactListenerD1Ev__index__ = register_delegate(_ZN17b2ContactListenerD1Ev);
var _ZN22b2EdgeAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__ = register_delegate(_ZN22b2EdgeAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator);
var _ZN22b2EdgeAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator__index__ = register_delegate(_ZN22b2EdgeAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator);
var _ZN22b2EdgeAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__ = register_delegate(_ZN22b2EdgeAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4_);
var _ZN22b2EdgeAndCircleContactD0Ev__index__ = register_delegate(_ZN22b2EdgeAndCircleContactD0Ev);
var _ZN22b2EdgeAndCircleContactD1Ev__index__ = register_delegate(_ZN22b2EdgeAndCircleContactD1Ev);
var _ZN23b2ChainAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__ = register_delegate(_ZN23b2ChainAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator);
var _ZN23b2ChainAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator__index__ = register_delegate(_ZN23b2ChainAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator);
var _ZN23b2ChainAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__ = register_delegate(_ZN23b2ChainAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4_);
var _ZN23b2ChainAndCircleContactD0Ev__index__ = register_delegate(_ZN23b2ChainAndCircleContactD0Ev);
var _ZN23b2ChainAndCircleContactD1Ev__index__ = register_delegate(_ZN23b2ChainAndCircleContactD1Ev);
var _ZN23b2EdgeAndPolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__ = register_delegate(_ZN23b2EdgeAndPolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator);
var _ZN23b2EdgeAndPolygonContact7DestroyEP9b2ContactP16b2BlockAllocator__index__ = register_delegate(_ZN23b2EdgeAndPolygonContact7DestroyEP9b2ContactP16b2BlockAllocator);
var _ZN23b2EdgeAndPolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__ = register_delegate(_ZN23b2EdgeAndPolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4_);
var _ZN23b2EdgeAndPolygonContactD0Ev__index__ = register_delegate(_ZN23b2EdgeAndPolygonContactD0Ev);
var _ZN23b2EdgeAndPolygonContactD1Ev__index__ = register_delegate(_ZN23b2EdgeAndPolygonContactD1Ev);
var _ZN24b2ChainAndPolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__ = register_delegate(_ZN24b2ChainAndPolygonContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator);
var _ZN24b2ChainAndPolygonContact7DestroyEP9b2ContactP16b2BlockAllocator__index__ = register_delegate(_ZN24b2ChainAndPolygonContact7DestroyEP9b2ContactP16b2BlockAllocator);
var _ZN24b2ChainAndPolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__ = register_delegate(_ZN24b2ChainAndPolygonContact8EvaluateEP10b2ManifoldRK11b2TransformS4_);
var _ZN24b2ChainAndPolygonContactD0Ev__index__ = register_delegate(_ZN24b2ChainAndPolygonContactD0Ev);
var _ZN24b2ChainAndPolygonContactD1Ev__index__ = register_delegate(_ZN24b2ChainAndPolygonContactD1Ev);
var _ZN25b2PolygonAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator__index__ = register_delegate(_ZN25b2PolygonAndCircleContact6CreateEP9b2FixtureiS1_iP16b2BlockAllocator);
var _ZN25b2PolygonAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator__index__ = register_delegate(_ZN25b2PolygonAndCircleContact7DestroyEP9b2ContactP16b2BlockAllocator);
var _ZN25b2PolygonAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4___index__ = register_delegate(_ZN25b2PolygonAndCircleContact8EvaluateEP10b2ManifoldRK11b2TransformS4_);
var _ZN25b2PolygonAndCircleContactD0Ev__index__ = register_delegate(_ZN25b2PolygonAndCircleContactD0Ev);
var _ZN25b2PolygonAndCircleContactD1Ev__index__ = register_delegate(_ZN25b2PolygonAndCircleContactD1Ev);
var _ZN4__rw10__rw_facetD0Ev__index__ = register_delegate(_ZN4__rw10__rw_facetD0Ev);
var _ZN4__rw10__rw_facetD1Ev__index__ = register_delegate(_ZN4__rw10__rw_facetD1Ev);
var _ZN7CFileLS4feofEv__index__ = register_delegate(_ZN7CFileLS4feofEv);
var _ZN7CFileLS5freadEPvjj__index__ = register_delegate(_ZN7CFileLS5freadEPvjj);
var _ZN7CFileLS5fseekEli__index__ = register_delegate(_ZN7CFileLS5fseekEli);
var _ZN7CFileLS5ftellEv__index__ = register_delegate(_ZN7CFileLS5ftellEv);
var _ZN7CFileLS6fcloseEv__index__ = register_delegate(_ZN7CFileLS6fcloseEv);
var _ZN7CFileLS6fflushEv__index__ = register_delegate(_ZN7CFileLS6fflushEv);
var _ZN7CFileLS6fwriteEPKvjj__index__ = register_delegate(_ZN7CFileLS6fwriteEPKvjj);
var _ZN7CFileLS6ungetcEi__index__ = register_delegate(_ZN7CFileLS6ungetcEi);
var _ZN9b2ContactD0Ev__index__ = register_delegate(_ZN9b2ContactD0Ev);
var _ZN9b2ContactD1Ev__index__ = register_delegate(_ZN9b2ContactD1Ev);
var _ZNK11CFileSystem12IsFileSystemEv__index__ = register_delegate(_ZNK11CFileSystem12IsFileSystemEv);
var _ZNK11b2EdgeShape11ComputeAABBEP6b2AABBRK11b2Transformi__index__ = register_delegate(_ZNK11b2EdgeShape11ComputeAABBEP6b2AABBRK11b2Transformi);
var _ZNK11b2EdgeShape11ComputeMassEP10b2MassDataf__index__ = register_delegate(_ZNK11b2EdgeShape11ComputeMassEP10b2MassDataf);
var _ZNK11b2EdgeShape13GetChildCountEv__index__ = register_delegate(_ZNK11b2EdgeShape13GetChildCountEv);
var _ZNK11b2EdgeShape5CloneEP16b2BlockAllocator__index__ = register_delegate(_ZNK11b2EdgeShape5CloneEP16b2BlockAllocator);
var _ZNK11b2EdgeShape7RayCastEP15b2RayCastOutputRK14b2RayCastInputRK11b2Transformi__index__ = register_delegate(_ZNK11b2EdgeShape7RayCastEP15b2RayCastOutputRK14b2RayCastInputRK11b2Transformi);
var _ZNK11b2EdgeShape9TestPointERK11b2TransformRK6b2Vec2__index__ = register_delegate(_ZNK11b2EdgeShape9TestPointERK11b2TransformRK6b2Vec2);
var _ZNK14CFileInterface12IsFileSystemEv__index__ = register_delegate(_ZNK14CFileInterface12IsFileSystemEv);
var _ZNK14b2PolygonShape11ComputeAABBEP6b2AABBRK11b2Transformi__index__ = register_delegate(_ZNK14b2PolygonShape11ComputeAABBEP6b2AABBRK11b2Transformi);
var _ZNK14b2PolygonShape11ComputeMassEP10b2MassDataf__index__ = register_delegate(_ZNK14b2PolygonShape11ComputeMassEP10b2MassDataf);
var _ZNK14b2PolygonShape13GetChildCountEv__index__ = register_delegate(_ZNK14b2PolygonShape13GetChildCountEv);
var _ZNK14b2PolygonShape5CloneEP16b2BlockAllocator__index__ = register_delegate(_ZNK14b2PolygonShape5CloneEP16b2BlockAllocator);
var _ZNK14b2PolygonShape7RayCastEP15b2RayCastOutputRK14b2RayCastInputRK11b2Transformi__index__ = register_delegate(_ZNK14b2PolygonShape7RayCastEP15b2RayCastOutputRK14b2RayCastInputRK11b2Transformi);
var _ZNK14b2PolygonShape9TestPointERK11b2TransformRK6b2Vec2__index__ = register_delegate(_ZNK14b2PolygonShape9TestPointERK11b2TransformRK6b2Vec2);
var _ZNKSt8messagesIcE6do_getEiiiRKSs__index__ = register_delegate(_ZNKSt8messagesIcE6do_getEiiiRKSs);
var _ZNKSt8messagesIcE7do_openERKSsRKSt6locale__index__ = register_delegate(_ZNKSt8messagesIcE7do_openERKSsRKSt6locale);
var _ZNKSt8messagesIcE8do_closeEi__index__ = register_delegate(_ZNKSt8messagesIcE8do_closeEi);
var _ZNSt8messagesIcED0Ev__index__ = register_delegate(_ZNSt8messagesIcED0Ev);
var _ZNSt8messagesIcED1Ev__index__ = register_delegate(_ZNSt8messagesIcED1Ev);
var __cxa_pure_virtual__index__ = register_delegate(__cxa_pure_virtual);
var __fwrite__index__ = register_delegate(__fwrite);
var __mandreel_internal_SetResolution__index__ = register_delegate(__mandreel_internal_SetResolution);
var cmpfacets__index__ = register_delegate(cmpfacets);
var cmplocales__index__ = register_delegate(cmplocales);
var mandreel_flash_tcp_onError__index__ = register_delegate(mandreel_flash_tcp_onError);
var swrite__index__ = register_delegate(swrite);
var _objc_sections = {};
var _objc_sections_size = {};
