var mandreelAppMandreelJs = "mandreel.js";
var mandreelAppWorkingFolder = "data/js/";
var mandreelAppLog = false;
var mandreelAppLocalHost = "http://localhost";
var mandreelAppReadDataFromLocalHost = false;
var mandreelAppReadMandreelJsFromLocalHost = false;
var mandreelAppHostedAudioServer = null;
var mandreelAppHostedAudioUrl = null;
var mandrelCurrentFatVersion = "1.3";
var mandreelAppPlatform = "webgl";
var mandreelAppCanvasWidth = 1024;
var mandreelAppCanvasHeight = 768;
var mandreelAppCanvasName = "canvas";
var mandreelAppCanvasDiv = "canvasDiv";

if (!Date.now) {
   Date.now = function() {
    return +new Date();
   };
  };


////////////////////////////////////////////

if (window["console"])
{
	if (!window["dump"]) window["dump"] = function dump(str){ if ( mandreelAppLog ) console.log(str) };
}
else
{
	if (!window["dump"]) window["dump"] = function dump(str){ };
}

////////////////////////////////////////////
function mandreelJsScriptLoaded()
{
	if ( mandreelAppStartStateFunc )
		mandreelAppStartStateFunc("scriptLoaded","");
	g_mandreel_working_folder = mandreelAppWorkingFolder;
	if ( mandreelAppReadDataFromLocalHost )
		g_mandreel_working_folder = mandreelAppLocalHost+"/"+mandreelAppWorkingFolder;

	// load audio
	if ( mandreelAppStartStateFunc )
		mandreelAppStartStateFunc("loadingAudio","");
	mandreel_start_audio(mandreelAppHostedAudioServer,mandreelAppHostedAudioUrl,_mandreelAppAudioReady);
}

////////////////////////////////////////////
function mandreelLoadMandreelJsScript()
{
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.onload = ga.onreadystatechange = mandreelJsScriptLoaded;
	var url = mandreelAppMandreelJs;
	if ( mandreelAppReadMandreelJsFromLocalHost )
		ga.src = mandreelAppLocalHost+"/"+url;
	else
		ga.src = url;
	var s = document.getElementsByTagName('script')[0];
	if ( mandreelAppStartStateFunc )
		mandreelAppStartStateFunc("loadingScript","");
	s.parentNode.insertBefore(ga, s);
}

////////////////////////////////////////////
function mandreelFatLoaded()
{
	mandreelLoadMandreelJsScript();
}

var mandreelFatData = "";
var mandreelFatPreloadRequest = 0;
////////////////////////////////////////////
function mandreelLoadFat()
{
	mandreelFatPreloadRequest = new XMLHttpRequest();
	var working_folder = mandreelAppWorkingFolder;
	if ( mandreelAppReadDataFromLocalHost )
		working_folder = mandreelAppLocalHost+"/"+mandreelAppWorkingFolder;
	var url = working_folder+"mandreel.fat.dat";
	mandreelFatPreloadRequest.open("GET", url, true);
	mandreelFatPreloadRequest.onreadystatechange = function()
	{
		if (mandreelFatPreloadRequest.readyState != 4) return;
		if ( mandreelFatPreloadRequest.status != 404 && mandreelFatPreloadRequest.response != null )
		{
			mandreelFatData = mandreelFatPreloadRequest.response;
		}
		if ( mandreelFatData == "" )
		{
			dump("error loading mandreel.fat file, Maybe the working folder is not correctly set???");
		}
		
		// Check version
		var FatLines = mandreelFatData.split('\n');
		for ( line in FatLines )
		{
			var params = line.split(',');
			if ( params[0] == "version" )
			{
				if ( params[1] != mandrelCurrentFatVersion )
					dump("warning: mandreel.fat version number is ("+params[1]+") and it should be ("+mandrelCurrentFatVersion+")");
				
			}
			else if ( params[0] == "platform" && params[1] != "js" )
				dump("warning: mandreel.fat platform is ("+params[1]+") and it should be (js)");
		}
		
		mandreelFatLoaded();
	}
	mandreelFatPreloadRequest.send();
}

var mandreelAppStartStateFunc = 0;
////////////////////////////////////////////
function mandreelAppStart(startStateFunc,params)
{
	mandreelAppStartStateFunc = startStateFunc;
	
	if ( params.log != undefined )
		mandreelAppLog = params.log;

	if ( params.platform != undefined )
		mandreelAppPlatform = params.platform;
		
	
		
	if ( mandreelAppPlatform != "webgl" && mandreelAppPlatform != "flash" )
	{
		mandreelAppStartStateFunc("error",'platform ('+mandreelAppPlatform+') not supported');
		return;
	}
		
	if ( mandreelAppPlatform == "webgl" )
	{
		mandreelAppWorkingFolder = "data/js/";
		if ( params.workingFolderWebgl != undefined )
			mandreelAppWorkingFolder = params.workingFolderWebgl;
		// Check Float64Array availability
		if ( !window["Float64Array"] )
		{
			mandreelAppStartStateFunc("error",'Browser unsupported: Float64Array not available');
			return;
		}
		// Setup WebGL
		if ( params.webglCanvas == undefined )
		{
			mandreelAppStartStateFunc("error",'canvas parameter not found');
			return;
		}
		var canvas = document.getElementById(params.webglCanvas);
		if ( canvas == null )
		{
			mandreelAppStartStateFunc("error",'canvas object ('+params.webglCanvas+') not found');
			return;
		}
		if ( params.width != null )
			canvas.width = params.width;
		if ( params.height != null )
			canvas.height = params.height;
		gl = WebGLUtils.setupWebGL(canvas,{premultipliedAlpha:false});
		if (gl == null)
		{
			mandreelAppStartStateFunc("error","webgl_not_found");
			return;
		}
		
		// load Fat
		if ( mandreelAppStartStateFunc )
			mandreelAppStartStateFunc("loadingFat","");
		mandreelLoadFat();
	}

	if ( mandreelAppPlatform == "flash" )
	{
		mandreelAppWorkingFolder = "data/as3/";
		if ( params.workingFolderFlash != undefined )
			mandreelAppWorkingFolder = params.workingFolderFlash;
		if (!swfobject.hasFlashPlayerVersion('11.0.0'))
		{
			mandreelAppStartStateFunc("error","flash 11 not found");
			return;
		}
		
		if ( params.flashCanvas == undefined )
		{
			mandreelAppStartStateFunc("error",'canvas parameter not found');
			return;
		}
		
		mandreelAppCanvasDiv = params.flashCanvas;			
				
		try
		{	
			var mandreelSocketsSwf = "mandreel.swf";
			if ( params.swfFlash != undefined )
				mandreelSocketsSwf = params.swfFlash;
				
			dump('chanka ' + mandreelSocketsSwf);
			
			var my_flashvars = "workingFolder=" + encodeURIComponent(mandreelAppWorkingFolder);
			var swf = swfobject.createSWF({ data:mandreelSocketsSwf, width:"100%", height:"100%" }, { menu:"false",allowScriptAccess:"always", wmode:"direct",scale:"noscale",salign :"tl",flashvars:my_flashvars}, params.flashCanvas);
			if ( !swf )
			{
				mandreelAppStartStateFunc("error","error loading " + mandreelSocketsSwf);
				return;
			}
			
		}
		catch(err)
		{
			mandreelAppStartStateFunc("error","exception " + err + " while loading " + mandreelSocketsSwf);			
			return;
		}			
		
		appStartState('loadingScript');
	}
}

////////////////////////////////////////////
function _mandreelAppAudioReady()
{
	if ( mandreelAppStartStateFunc )
		mandreelAppStartStateFunc("audioLoaded","");
	if ( mandreelAppStartStateFunc )
	{
		mandreelAppStartRenderWebGL();
		mandreelAppStartStateFunc("ready","");
	}
}

////////////////////////////////////////////
function mandreelAppInit()
{
	if ( mandreelAppPlatform == "webgl" )
	{
		global_init(g_stack_pointer+800*1024);
		var sp = g_stack_pointer+800*1024;
		heapU32[sp>>2] = mandreelAppCanvasWidth;
		heapU32[(sp+4)>>2] = mandreelAppCanvasHeight;
		__mandreel_internal_SetResolution(sp);		
		__mandreel_internal_init(g_stack_pointer+800*1024);
		__init(g_stack_pointer+800*1024);
	}
}

////////////////////////////////////////////
function mandreelAppDraw(elapsed)
{
	if ( mandreelAppPlatform == "webgl" )
	{
		var sp = g_stack_pointer+800*1024;
		heapU32[sp>>2] = elapsed;
		__draw(sp);
		__mandreel_internal_update(sp);
	}
}

////////////////////////////////////////////
function mandreelAppMouseWheel(delta)
{
	if ( mandreelAppPlatform == "webgl" )
	{
		var i7 = g_stack_pointer+800*1024;
		heap32[(i7+0)>>2] = delta;	
		__mouseWheelDelta(i7);
	}
}

////////////////////////////////////////////
function mandreelAppMouseMove(x,y)
{
	if ( mandreelAppPlatform == "webgl" )
	{
		var i7 = g_stack_pointer+800*1024;
		heap32[(i7+0)>>2] = x;
		heap32[(i7+4)>>2] = y;
		__mouseMove(i7);
	}
}

////////////////////////////////////////////
function mandreelAppMouseButton(down,x,y)
{
	if ( mandreelAppPlatform == "webgl" )
	{
		var i7 = g_stack_pointer+800*1024;
		heap32[(i7+0)>>2] = down;
		heap32[(i7+4)>>2] = x;
		heap32[(i7+8)>>2] = y;
		__mouseButton(i7);
	}
}

////////////////////////////////////////////
function mandreelAppKeyEvent(down,keyId)
{
	if ( mandreelAppPlatform == "webgl" )
	{
		var i7 = g_stack_pointer+800*1024;
		heap32[(i7+0)>>2] = down;
		heap32[(i7+4)>>2] = keyId;
		__keyEvent(i7);
	}
}

////////////////////////////////////////////
function mandreelAppGetPlatform()
{
	return mandreelAppPlatform;
}

////////////////////////////////////////////
function mandreelAppGetElementAbsolutePos(elementName)
{
	var element = document.getElementById(elementName);
	var res = new Object();
	res.x = 0; res.y = 0;
	if (element !== null)
	{ 
		if (element.getBoundingClientRect)
		{
			var viewportElement = document.documentElement;  
			var box = element.getBoundingClientRect();
			var scrollLeft = viewportElement.scrollLeft;
			var scrollTop = viewportElement.scrollTop;
			res.x = box.left + scrollLeft;
			res.y = box.top + scrollTop;
		}
		else
		{ //for old browsers
			res.x = element.offsetLeft;
			res.y = element.offsetTop;
			var parentNode = element.parentNode;
			var borderWidth = null;
			while (offsetParent != null)
			{
				res.x += offsetParent.offsetLeft;
				res.y += offsetParent.offsetTop;
				var parentTagName = offsetParent.tagName.toLowerCase();
				if ((__isIEOld && parentTagName != "table") || 
					((__isFireFoxNew || __isChrome) && 
						parentTagName == "td"))
				{
					borderWidth = kGetBorderWidth(offsetParent);
					res.x += borderWidth.left;
					res.y += borderWidth.top;
				}
				
				if (offsetParent != document.body && 
				offsetParent != document.documentElement)
				{
					res.x -= offsetParent.scrollLeft;
					res.y -= offsetParent.scrollTop;
				}

				//next lines are necessary to fix the problem 
				//with offsetParent
				if (!__isIE && !__isOperaOld || __isIENew)
				{
					while (offsetParent != parentNode && 
						parentNode !== null) {
						res.x -= parentNode.scrollLeft;
						res.y -= parentNode.scrollTop;
						if (__isFireFoxOld || __isWebKit) 
						{
						    borderWidth = 
						     kGetBorderWidth(parentNode);
						    res.x += borderWidth.left;
						    res.y += borderWidth.top;
						}
						parentNode = parentNode.parentNode;
					}    
				}

				parentNode = offsetParent.parentNode;
				offsetParent = offsetParent.offsetParent;
			}
		}
	}
	return res;
}
function __getIEVersion()
{
	var rv = -1; // Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer')
	{
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
}
function __getOperaVersion()
{
	var rv = 0; // Default value
	if (window.opera)
	{
		var sver = window.opera.version();
		rv = parseFloat(sver);
	}
	return rv;
}
var __userAgent = navigator.userAgent;
var __isIE =  navigator.appVersion.match(/MSIE/) != null;
var __IEVersion = __getIEVersion();
var __isIENew = __isIE && __IEVersion >= 8;
var __isIEOld = __isIE && !__isIENew;
var __isFireFox = __userAgent.match(/firefox/i) != null;
var __isFireFoxOld = __isFireFox && ((__userAgent.match(/firefox\/2./i) != null) || (__userAgent.match(/firefox\/1./i) != null));
var __isFireFoxNew = __isFireFox && !__isFireFoxOld;
var __isWebKit =  navigator.appVersion.match(/WebKit/) != null;
var __isChrome =  navigator.appVersion.match(/Chrome/) != null;
var __isOpera =  window.opera != null;
var __operaVersion = __getOperaVersion();
var __isOperaOld = __isOpera && (__operaVersion < 10);
function __parseBorderWidth(width)
{
	var res = 0;
	if (typeof(width) == "string" && width != null && width != "" )
	{
		var p = width.indexOf("px");
		if (p >= 0)
		{
			res = parseInt(width.substring(0, p));
		}
		else
		{
			//do not know how to calculate other values (such as 0.5em or 0.1cm) correctly now so just set the width to 1 pixel
			res = 1; 
		}
	}
	return res;
}
function __getBorderWidth(element)
{
	var res = new Object();
	res.left = 0; res.top = 0; res.right = 0; res.bottom = 0;
	if (window.getComputedStyle)
	{
		//for Firefox
		var elStyle = window.getComputedStyle(element, null);
		res.left = parseInt(elStyle.borderLeftWidth.slice(0, -2));  
		res.top = parseInt(elStyle.borderTopWidth.slice(0, -2));  
		res.right = parseInt(elStyle.borderRightWidth.slice(0, -2));  
		res.bottom = parseInt(elStyle.borderBottomWidth.slice(0, -2));  
	}
	else
	{
		//for other browsers
		res.left = __parseBorderWidth(element.style.borderLeftWidth);
		res.top = __parseBorderWidth(element.style.borderTopWidth);
		res.right = __parseBorderWidth(element.style.borderRightWidth);
		res.bottom = __parseBorderWidth(element.style.borderBottomWidth);
	}
	return res;
}


////////////////////////////////////////////
// WebGL
////////////////////////////////////////////
	var gl = null;
	var is_ready = 0;
	var oldTime = Date.now();

	function mandreel_wheel(event) { onMouseWheel(event);event.preventDefault(); event.returnValue=false; }
	
	////////////////////////////////////////////
	function mandreelAppStartRenderWebGL()
	{
		var canvas = document.getElementById(mandreelAppCanvasName);
		
		mandreelAppCanvasWidth = canvas.width;
		mandreelAppCanvasHeight = canvas.height;

		// Register event handlers
		if(window.addEventListener){ window.addEventListener('DOMMouseScroll',mandreel_wheel,false); }  window.onmousewheel=document.onmousewheel=mandreel_wheel;

		window.addEventListener('mousedown',onMouseDown,false); 
		window.addEventListener('mouseup',onMouseUp,false); 
		window.addEventListener('mousemove',onMouseMove,false); 

		var canvasDiv = document.getElementById(mandreelAppCanvasDiv);
		canvasDiv.addEventListener('keydown',onKeyDown,false); 
		canvasDiv.addEventListener('keyup',onKeyUp,false); 
		canvasDiv.focus();

		// Call mandreel app init funtion (__init())
		mandreelAppInit();
		
		// Start rendering
		is_ready = 1;
		render();
	}
	
	////////////////////////////////////////////
	function render()
	{
		if( ABORT )
			return;

		var canvas = document.getElementById(mandreelAppCanvasName);
		WebGLUtils.requestAnimationFrame(canvas, render);     
		
		// Reshape
		if (canvas.clientWidth != mandreelAppCanvasWidth || canvas.clientHeight != mandreelAppCanvasHeight)
		{
			mandreelAppCanvasWidth = canvas.clientWidth;
			mandreelAppCanvasHeight = canvas.clientHeight;
			gl.viewport(0, 0, mandreelAppCanvasWidth, mandreelAppCanvasHeight);
		}
		
		// Set the focus to the canvas div
		var canvasDiv = document.getElementById(mandreelAppCanvasDiv);
		canvasDiv.focus();

		// Call mandreel app draw funtion (__draw())
		var nowTime = Date.now();
		mandreelAppDraw(nowTime-oldTime);
		oldTime = nowTime;
	}


	////////////////////////////////////////////
	function onMouseMove(e)
	{
		if (!is_ready) 
		return;

		var pos = mandreelAppGetElementAbsolutePos(mandreelAppCanvasName);
		var setX = e.clientX - pos.x;      
		var setY = e.clientY - pos.y;
		
		mandreelAppMouseMove(setX,setY);
	}

	////////////////////////////////////////////
	var mandreel_mouse_down = false;
	function onMouseDown(e)
	{
		if (!is_ready) 
			return;
		if (mandreel_mouse_down)
			return;		

		mandreel_mouse_down = true;
		var pos = mandreelAppGetElementAbsolutePos(mandreelAppCanvasName);
		var setX = e.clientX - pos.x;      
		var setY = e.clientY - pos.y;
		
		mandreelAppMouseButton(1,setX,setY);
	}

	////////////////////////////////////////////
	function onMouseUp(e)
	{
		if (!is_ready) 
			return;
			
		if (mandreel_mouse_down == false)
			return;
			
		mandreel_mouse_down = false;

		var pos = mandreelAppGetElementAbsolutePos(mandreelAppCanvasName);
		var setX = e.clientX - pos.x;      
		var setY = e.clientY - pos.y;

		mandreelAppMouseButton(0,setX,setY);
	}

	////////////////////////////////////////////
	function onMouseWheel(e)
	{
		if (!is_ready) 
			return;
			
		mandreelAppMouseWheel(e.wheelDelta);
	}

	////////////////////////////////////////////
	function onKeyUp(e)
	{
		if (!is_ready) 
			return;
		var KeyID = e.keyCode;
		mandreelAppKeyEvent(0,KeyID);
	}

	////////////////////////////////////////////
	window.onkeydown = function(e)
	{
		return !(e.keyCode == 32 || e.keyCode == 9);
	};

	////////////////////////////////////////////
	function onKeyDown(e)
	{
		if (!is_ready) 
			return;
		var KeyID = e.keyCode;
		mandreelAppKeyEvent(1,KeyID);
	}

////////////////////////////////////////////
// Flash
////////////////////////////////////////////

(function(){
		try {
			// Disabling SWFObject's Autohide feature
			if (typeof swfobject.switchOffAutoHideShow === "function") {
				swfobject.switchOffAutoHideShow();
			}
		} catch(e) {}
	})();

function MandreelInterSwfLoaded()
{
	appStartState('scriptLoaded');
	var flashMovie = swfobject.getObjectById(mandreelAppCanvasDiv)
	dump(flashMovie.width);	
	flashMovie.MandreelInit();
	
	if ( mandreelAppStartStateFunc )
		mandreelAppStartStateFunc("ready","");	
}


var g_mandreel_swf = null;

function MandreelInterGetSWF()
{
	if (g_mandreel_swf)
		return g_mandreel_swf;
		
	g_mandreel_swf = swfobject.getObjectById(mandreelAppCanvasDiv)	
	return g_mandreel_swf;
}

function MandreelInterWriteInt(ptr, value)
{
	MandreelInterGetSWF().MandreelInterWriteInt(ptr,value);
}

function MandreelInterWriteFloat(ptr, value)
{
	MandreelInterGetSWF().MandreelInterWriteFloat(ptr,value);
}

function MandreelInterWriteString(ptr, value)
{
	MandreelInterGetSWF().MandreelInterWriteString(ptr,value);
}

function MandreelInterWriteWString(ptr, value)
{
	MandreelInterGetSWF().MandreelInterWriteWString(ptr,value);
}

function MandreelInterCallFunctionRaw(sp, func_name, returnType)
{
	return MandreelInterGetSWF().MandreelInterCallFunctionRaw(sp,func_name,returnType);
}

function MandreelInterGetGlobalStack()
{
	return MandreelInterGetSWF().MandreelInterGetGlobalStack();
}


function MandreelLockFrame()
{
	return MandreelInterGetSWF().MandreelLockFrame();
}

function MandreelUnlockFrame()
{
	return MandreelInterGetSWF().MandreelUnlockFrame();
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
		sp = MandreelInterGetGlobalStack()+800*1024;
		
	sp-=size_params;	
	
	MandreelLockFrame();
		
	var offset = 0;
	var ptr_data = num_params*4+sp;
    for (i=2;i<num_params*2+2;i+=2)
	{
		var type = arguments[i];
		
		
		var size_arg = 0;
		switch(type)
		{
			case 'int':
				MandreelInterWriteInt((sp+offset),arguments[i+1]);
				break;
			case 'float':
				MandreelInterWriteFloat((sp+offset),arguments[i+1]);				
				break;
			case 'string':
				{
					MandreelInterWriteInt((sp+offset),ptr_data);	
					var string = arguments[i+1];
					MandreelInterWriteString(ptr_data,string);
					
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
	
	return_value = MandreelInterCallFunctionRaw(sp, func_name, returnType);
	
	MandreelUnlockFrame();
	
	if (returnType == 'int')
		return parseInt(return_value);
	else if (returnType == 'float')
		return parseFloat(return_value);
	
	return;		
}

