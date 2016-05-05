

chrome.contextMenus.create({
	title: "リンクテキストをコピー",
	contexts: ["link"],
	documentUrlPatterns: [
		"http://*/*",
		"https://*/*",
		"file:///*"
	],
	onclick: function (info){
		var linkUrl = info.linkUrl;
		
		function content_script(){
			var elems = document.getElementsByTagName("a");
			for (var i = 0, len = elems.length; i < len; i++) {
				var elem = elems[i];
				if (elem.innerText.replace(/\s/g, "")
				 && elem.href === "linkUrl") {
					chrome.runtime.sendMessage({
						"method": "copy",
						"text": elem.innerText
					});
					break;
				}
			}
		}
		// permissionsにURL or activeTabが必要
		chrome.tabs.executeScript(null, {
			"code": "(" + content_script.toString().replace("linkUrl", linkUrl) + ")()"
		});
	}
});

chrome.runtime.onMessage.addListener(function (request) {
	if (request.method === "copy") {
		textarea.value = request.text;
		textarea.select();
		document.execCommand("copy");
	}
});

var textarea = document.createElement("textarea");
document.body.appendChild(textarea);