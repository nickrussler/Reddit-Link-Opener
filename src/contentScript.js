var jquery_set_links;
var jquery_set_comments;

function fakeClick(obj) {
	var evObj = document.createEvent('MouseEvents');
	evObj.initEvent('mousedown', true, true);
	obj.dispatchEvent(evObj);
}

chrome.extension.onRequest.addListener(function(request, sender, callback) {
	switch (request.action) {
		case 'openRedditLinks':
			jquery_set_links = jQuery("#siteTable .even a.title");
			jquery_set_comments = jQuery("#siteTable .even a.comments");

			var data = Array();

			var i;
			for( i = 0; i < jquery_set_links.length; i++) {
				data.push(new Array(jquery_set_links[i].text, jquery_set_links[i].href, jquery_set_comments[i].href));
			}

			if(data.length > 0) {
				callback({
					urls : data,
					tabid : request.tabid
				});
			}
			break;

		case 'openNextPage':
			window.location = $(".nextprev a").attr("href");
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
