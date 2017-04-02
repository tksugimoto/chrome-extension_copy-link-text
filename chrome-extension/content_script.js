(() => {
	if (window.isAlreadyPrepared) return;
	window.isAlreadyPrepared = true;

	const searchLinkTexts = linkUrl => {
		const links = document.getElementsByTagName("a");
		return Array.from(links).filter(link => {
			return link.href === linkUrl;
		}).map(link => {
			return link.innerText;
		}).filter(linkText => {
			return linkText.replace(/\s/g, "");
		});
	};
	chrome.runtime.onMessage.addListener(request => {
		if (request.method === "searchLinkTexts") {
			const linkTexts = searchLinkTexts(request.linkUrl);
			chrome.runtime.sendMessage({
				method: "copy",
				texts: linkTexts
			});
		}
	});
})();
