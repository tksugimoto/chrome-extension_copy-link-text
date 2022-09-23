
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
			copy(linkText);
			window.setTimeout(() => {
				chrome.runtime.sendMessage({
					closeMessageSender: true,
					method: 'notify',
					linkText,
				});
			}, 100 /* ms */); // すぐに閉じるとコピーができない
		});
		if (linkTexts.length === 1) selectButton.click();

		listItem.append(selectButton);
		list_container.append(listItem);
	});
});

const textarea = document.createElement('textarea');
document.body.appendChild(textarea);
textarea.style.display = 'none';

const copy = text => {
	textarea.value = text;
	textarea.style.display = '';
	textarea.select();
	document.execCommand('copy');
	textarea.style.display = 'none';
};

document.getElementById('close').addEventListener('click', () => {
	window.close();
});

document.body.addEventListener('keydown', evt => {
	if (evt.key === 'Escape') {
		window.close();
	}
});
