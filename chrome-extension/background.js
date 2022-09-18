
const ID_COPY_TEXT = 'copy_link_text';

const createContextMenu = () => {
	chrome.contextMenus.create({
		title: 'Copy link text (リンクテキストをコピー)',
		contexts: ['link'],
		documentUrlPatterns: [
			'http://*/*',
			'https://*/*',
			'file:///*',
		],
		id: ID_COPY_TEXT,
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
			file: 'search_link_texts.js',
		}, () => {
			chrome.tabs.sendMessage(activeTabId, {
				method: 'searchLinkTexts',
				linkUrl,
			}, {frameId});
		});
	}
});

chrome.runtime.onMessage.addListener((request, sender) => {
	const preprocessing = request.closeMessageSender ? new Promise(resolve => {
		chrome.tabs.remove(sender.tab.id, resolve);
	}) : Promise.resolve();

	preprocessing.then(() => {
		if (request.method === 'linkTexts') {
			const linkTexts = request.texts;
			if (linkTexts.length === 1) {
				const linkText = linkTexts[0];

				copy(linkText);

				notifyCopyCompletion(linkText);
			} else if (linkTexts.length >= 2) {
				chrome.storage.local.set({
					textSelectorData: {
						linkTexts,
						returnMessageBase: {
							method: 'linkTexts',
						},
					},
				}, () => {
					chrome.windows.create({
						url: 'text_selector.html',
						type: 'popup',
						state: 'fullscreen',
					});
				});
			}
		}
	});
});

const textarea = document.createElement('textarea');
document.body.appendChild(textarea);

const copy = text => {
	textarea.value = text;
	textarea.select();
	document.execCommand('copy');
};

const notifyCopyCompletion = message => {
	/** 通知を何秒後に削除するか [s] */
	const notificationTimeoutSec = 5;

	chrome.notifications.create({
		title: 'コピー完了',
		message,
		type: 'basic',
		iconUrl: 'icon/icon.png',
	}, notificationId => {
		setTimeout(() => {
			chrome.notifications.clear(notificationId);
		}, notificationTimeoutSec * 1000);
	});
};

chrome.notifications.onClicked.addListener(notificationId => {
	chrome.notifications.clear(notificationId);
});
