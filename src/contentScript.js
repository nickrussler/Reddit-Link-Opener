chrome.extension.onRequest.addListener( function( command, sender, sendResponse) {
	if ( command == "openSelectedUrls" )
	{	
		var jquery_set_links = jQuery("#siteTable .even a.title");
		var jquery_set_comments = jQuery("#siteTable .even a.comments");
		
		var data = Array();
		
		var i=0;
		for (var i in jquery_set_links)
		{		
			var evObj = document.createEvent('MouseEvents');
			evObj.initEvent( 'mousedown', true, true );
			jquery_set_links[i].dispatchEvent(evObj);
			
			data.push(new Array(jquery_set_links[i].text, jquery_set_links[i].href, jquery_set_comments[i].href));
		}

		if (data.length > 0)
		{
			sendResponse(data);
		}
	}
});


chrome.extension.sendRequest({method: "getStatus"}, function(response) {		
	var KeyboardShortcut = response.status;	

	shortcut.add(KeyboardShortcut, function() {
			chrome.extension.sendRequest({method: "keyboardShortcut"}, function(response) {
			  console.log(response.farewell);
			});
		}
	);	
});

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.method == "updateSettings") {		
			if (request.keyboardshortcut != request.oldkeyboardshortcut) {
				if (request.oldkeyboardshortcut) {
					shortcut.remove(request.oldkeyboardshortcut);
				}
				
				shortcut.add(request.keyboardshortcut, function() {
						chrome.extension.sendRequest({method: "keyboardShortcut"}, function(response) {
						  console.log(response.farewell);
						});
					}
				);	
			}
		}		
	}
);