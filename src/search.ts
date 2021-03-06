import { getPublicGalleryAPI } from './util';
import { PublishedExtension, ExtensionQueryFilterType } from 'vso-node-api/interfaces/GalleryInterfaces';
import { tableView, wordTrim } from './viewutils';

const pageSize = 100;

export function search(searchText: string, json: boolean = false, pageNumber: number = 1): Promise<any> {
	const flags = [];
	return getPublicGalleryAPI()
		.extensionQuery({
			pageSize,
			criteria: [
				{ filterType: ExtensionQueryFilterType.SearchText, value: searchText },
			],
			flags,
		})
		.then(results => {
			if (json) {
				console.log(JSON.stringify(results, undefined, '\t'));
			} else {
				renderSearchView(searchText, results);
			}
		});
}

function renderSearchView(searchText: string, results: PublishedExtension[] = []) {
	if (!results.length) {
		console.log('No matching results');
		return;
	}
	console.log([
		`Search results:`,
		'',
		...tableView([
			['<ExtensionId>', '<Description>'],
			...results.map(({ publisher: { publisherName }, extensionName, shortDescription }) =>
				[publisherName + '.' + extensionName, shortDescription.replace(/\n|\r|\t/g, ' ')]
			)
		]),
		'',
		'For more information on an extension use "vsce show <extensionId>"',
	]
		.map(line => wordTrim(line.replace(/\s+$/g, '')))
		.join('\n'));
}
