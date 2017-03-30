(() => {
	if (window.isAlreadyPrepared) return;
	window.isAlreadyPrepared = true;

	const searchLinkText = linkUrl => {
		const elems = document.getElementsByTagName("a");
		for (let i = 0, len = elems.length; i < len; i++) {
			const elem = elems[i];
			if (elem.innerText.replace(/\s/g, "")
			 && elem.href === linkUrl) {
				chrome.runtime.sendMessage({
					"method": "copy",
					"text": elem.innerText
				});
				break;
			}
		}
	};
	chrome.runtime.onMessage.addListener(request => {
		if (request.method === "searchLinkText") {
			searchLinkText(request.linkUrl);
		}
	});
})();
