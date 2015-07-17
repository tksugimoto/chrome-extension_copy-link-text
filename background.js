

chrome.contextMenus.create({
	title: "リンクテキストをコピー",
	contexts: ["link"],
	onclick: function (info, tab){
		var linkUrl = info.linkUrl;
		
		var scripts = [];
		scripts.push('var elems = document.getElementsByTagName("a");');
		scripts.push('for (var i = 0, len = elems.length; i < len; i++) {');
		scripts.push('	var elem = elems[i];');
		scripts.push('	if (elem.getElementsByTagName("img").length === 0 && elem.innerText && elem.href === "' + linkUrl + '") {');
		scripts.push('		chrome.runtime.sendMessage({');
		scripts.push('			"method": "copy",');
		scripts.push('			"text": elem.innerText');
		scripts.push('		});');
		scripts.push('		break;');
		scripts.push('	}');
		scripts.push('}');
		// permissionsにURL or activeTabが必要
		chrome.tabs.executeScript(null, {
			"code": scripts.join("")
		});
	}
}, function (){});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.method === "copy") {
		textarea.value = request.text;
		textarea.select();
		document.execCommand("copy");
	}
});

var textarea = document.createElement("textarea");
document.body.appendChild(textarea);