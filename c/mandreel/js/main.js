////////////////////////////////////////////
function startApp(_platform)
{
	// Start mandreel
	var params =
	{
		platform : _platform,
		width : 1024,
		height : 768,
		webglCanvas : "canvas",
		flashCanvas : "FlashDiv",
		workingFolderFlash : "data/as3/",
		workingFolderWebgl : "data/js/",
		swfFlash : "mandreel.swf",
		log : true
	};
	mandreelAppStart(appStartState,params);
}

////////////////////////////////////////////
function appStartState(state,param)
{
	// mandreel.js program is been loaded
	if ( state == "loadingScript" )
	{
	}
	
	// mandreel.js program has been loaded
	if ( state == "scriptLoaded" )
	{
	}
	
	// Audio system is been started
	if ( state == "loadingAudio" )
	{
	}
	
	// Audio system is ready and the default audio preloading has been done
	if ( state == "audioLoaded" )
	{
	}
	
	// Mandreel has been started, render will start automatically
	if ( state == "ready" )
	{
		// Hide loading image
		var canvasElement = document.getElementById('loading');
		if ( canvasElement != null )
			canvasElement.style.visibility = "hidden";
	}

	// An error has been produced during the start process and the app must quit
	if ( state == "error" )
	{
		if ( param == "webgl_not_found" )
		{
			window.location = "http://get.webgl.org";
			return;
		}
		alert(param);
	}
}
