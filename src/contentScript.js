var jquery_set_links;
var jquery_set_comments;

function fakeClick(obj) {
	var evObj = document.createEvent('MouseEvents');
	evObj.initEvent('mousedown', true, true);
	obj.dispatchEvent(evObj);
}

function isNSFW(url){
	var nsfw_arr = $("#siteTable .even .nsfw-stamp, #siteTable .odd .nsfw-stamp");
	
	for (var i=0; i < nsfw_arr.length; i++) {
	  if (url.parentNode.parentNode == nsfw_arr[i].parentNode.parentNode){
	  	return true;
	  }	  
	};
	
	return false;
}

chrome.extension.onRequest.addListener(function(request, sender, callback) {
	switch (request.action) {
		case 'openRedditLinks':
			jquery_set_links = $("#siteTable a.title:visible");
			jquery_set_comments = $("#siteTable a.comments:visible");

			var data = Array();

			var i;
			for( i = 0; i < jquery_set_links.length; i++) {
				data.push(new Array(jquery_set_links[i].text, jquery_set_links[i].href, jquery_set_comments[i].href, isNSFW(jquery_set_links[i])));
			}

			if(data.length > 0) {
				callback({
					urls : data,
					tabid : request.tabid
				});
			}
			break;

		case 'openNextPage':
			window.location = $('.nextprev a[rel~="next"]').attr("href");
			break;

		case 'scrapeInfoCompanionBar':
			fakeClick(jquery_set_links[request.index]);
			break;

		case 'updateSettings':
			if(request.keyboardshortcut != request.oldkeyboardshortcut) {
				if(request.oldkeyboardshortcut) {
					shortcut.remove(request.oldkeyboardshortcut);
				}

				shortcut.add(request.keyboardshortcut, function() {
					chrome.extension.sendRequest({
						action : "keyboardShortcut"
					});
				});
			}
			break;

		default:
			break;
	}
});

chrome.extension.sendRequest({
	action : "initKeyboardShortcut"
});
