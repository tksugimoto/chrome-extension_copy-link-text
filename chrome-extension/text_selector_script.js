
chrome.storage.local.get({
	textSelectorData: {},
}, result => {
	const {
		linkTexts = [],
	} = result.textSelectorData;

	const list_container = document.getElementById('list_container');

	if (linkTexts.length === 0) {
		window.close();
		return;
	}
	linkTexts.forEach(linkText => {
		const listItem = document.createElement('li');

		const selectButton = document.createElement('button');
		selectButton.classList.add('select-button');
		selectButton.append(linkText);
		selectButton.addEventListener('click', () => {
			copy(linkText).then(() => {
				chrome.runtime.sendMessage({
					closeMessageSender: true,
					method: 'notify',
					linkText,
				});
			});
		});
		if (linkTexts.length === 1) selectButton.click();

		listItem.append(selectButton);
		list_container.append(listItem);
	});
});

const copy = text => {
	return navigator.clipboard.writeText(text);
};

document.getElementById('close').addEventListener('click', () => {
	window.close();
});

document.body.addEventListener('keydown', evt => {
	if (evt.key === 'Escape') {
		window.close();
	}
});
