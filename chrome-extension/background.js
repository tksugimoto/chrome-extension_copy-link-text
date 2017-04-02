
const ID_COPY_TEXT = "copy_link_text";

const createContextMenu = () => {
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

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === ID_COPY_TEXT) {
		const linkUrl = info.linkUrl;
		const frameId = info.frameId;
		const activeTabId = tab.id;

		// permissionsにURL or activeTabが必要
		chrome.tabs.executeScript(activeTabId, {
			frameId,
			file: "content_script.js"
		}, () => {
			chrome.tabs.sendMessage(activeTabId, {
				method: "searchLinkText",
				linkUrl
			}, {frameId});
		});
	}
});

chrome.runtime.onMessage.addListener(request => {
	if (request.method === "copy") {
		copy(request.text);

		notifyCopyCompletion(request.text);
	}
});

const textarea = document.createElement("textarea");
document.body.appendChild(textarea);

const copy = text => {
	textarea.value = text;
	textarea.select();
	document.execCommand("copy");
};

const notifyCopyCompletion = message => {
	chrome.notifications.create({
		title: "コピー完了",
		message,
		type: "basic",
		iconUrl: "icon/icon.png"
	});
};

chrome.notifications.onClicked.addListener(notificationId => {
	chrome.notifications.clear(notificationId);
});
