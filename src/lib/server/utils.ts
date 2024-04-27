import chalk from 'chalk';

const bgOrangeChalk = chalk.bgRgb(253, 142, 57);

export function getElapsedTimeText(elapsed: number) {
	if (elapsed < 1000) {
		return elapsed.toFixed(0) + 'ms';
	}

	if (elapsed < 60_000) {
		return `${(elapsed / 1000).toFixed(0)}s`;
	}

	return `${Math.floor(elapsed / 60000)}m${Math.round((elapsed % 60000) / 1000)}s`;
}

export function getQueryText(params: URLSearchParams) {
	if (params.size === 0) {
		return '';
	}

	let entries = [];
	for (const entry of params.entries()) {
		entries.push(entry);
	}

	return `?${entries.map((val, key) => `${val}=${key}`).join('&')}`;
}

export function getColoredStatusCode(code: number) {
	const codeText = ` ${code} `;

	if (code >= 200 && code < 300) {
		return chalk.bgGreen.black.bold(codeText);
	}

	if (code >= 300 && code < 400) {
		return bgOrangeChalk.black.bold(codeText);
	}

	if (code >= 400 && code < 600) {
		return chalk.bgRed.black.bold(codeText);
	}

	return codeText;
}
