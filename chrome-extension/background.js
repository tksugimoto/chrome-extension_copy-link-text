
const ID_COPY_TEXT = "copy_link_text";

const createContextMenus = () => {
	chrome.contextMenus.create({
		title: "リンクテキストをコピー",
		contexts: ["link"],
		documentUrlPatterns: [
			"http://*/*",
			"https://*/*",
			"file:///*"
		],
		id: ID_COPY_TEXT
	});
};

chrome.runtime.onInstalled.addListener(createContextMenus);
chrome.runtime.onStartup.addListener(createContextMenus);

chrome.contextMenus.onClicked.addListener(info => {
	if (info.menuItemId === ID_COPY_TEXT) {
		const linkUrl = info.linkUrl;
		
		const content_script = () => {
			const elems = document.getElementsByTagName("a");
			for (let i = 0, len = elems.length; i < len; i++) {
				const elem = elems[i];
				if (elem.innerText.replace(/\s/g, "")
				 && elem.href === "linkUrl") {
					chrome.runtime.sendMessage({
						"method": "copy",
						"text": elem.innerText
					});
					break;
				}
			}
		};

		const content_script_str = content_script.toString().replace("linkUrl", linkUrl);
		// permissionsにURL or activeTabが必要
		// tabIdを省略すると現在のtab
		chrome.tabs.executeScript({
			"code": `(${content_script_str})()`
		});
	}
});

chrome.runtime.onMessage.addListener(request => {
	if (request.method === "copy") {
		textarea.value = request.text;
		textarea.select();
		document.execCommand("copy");

		chrome.notifications.create({
			title: "コピー完了",
			message: request.text,
			type: "basic",
			iconUrl: "icon/icon.png"
		});
	}
});

const textarea = document.createElement("textarea");
document.body.appendChild(textarea);

chrome.notifications.onClicked.addListener(notificationId => {
	chrome.notifications.clear(notificationId);
});
