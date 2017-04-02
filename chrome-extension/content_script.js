(() => {
	if (window.isAlreadyPrepared) return;
	window.isAlreadyPrepared = true;

	const searchLinkText = linkUrl => {
		const links = document.getElementsByTagName("a");
		for (let i = 0, len = links.length; i < len; i++) {
			const link = links[i];
			if (link.innerText.replace(/\s/g, "")
			 && link.href === linkUrl) {
			 	return link.innerText;
			}
		}
	};
	chrome.runtime.onMessage.addListener(request => {
		if (request.method === "searchLinkText") {
			const linkText = searchLinkText(request.linkUrl);
			if (linkText) {
				chrome.runtime.sendMessage({
					method: "copy",
					text: linkText
				});
			}
		}
	});
})();
