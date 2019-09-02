import * as https from 'https'
import { SettingsManager } from './settings';

interface Translation {
	from: string, to: string,
	input: string, output: string
}

export class Translator extends Array<Translation> {

	settingsManager : SettingsManager;
	translations: Translation[];

	constructor(settingsManager : SettingsManager) {
		super();

		this.settingsManager = settingsManager;
		this.translations = new Array<Translation>();
	}

	loadFromCache(): Translation[] {
		return new Array<Translation>(

		)
	};

	async translateText(input: string, resource: string): Promise<string> {

		var settings = await this.settingsManager.getConfiguration(resource);

		if (!this.translations.find(t => t.input == input && t.from == settings.from && t.to == settings.to))
			this.translations.push({ input: input, from: settings.from, to: settings.to, output: await this.getTranslation(input) });

		return this.translations.find(t => t.input == input && t.from == settings.from && t.to == settings.to)!.output;
	}

	async getTranslation(input: string): Promise<string> {
		const
			url = `https://www.bing.com/search?q=${input}+serbian+to+english`,
			rgxTranslation = new RegExp(/(?:<span id="tta_tgt">)(.*)(?:<\/span>)/gm);

		return new Promise(resolve => {
			https.get(url, resp => {

				let data = '';

				resp.on('data', chunk => { data += chunk; });
				resp.on('end', () => {

					let results = rgxTranslation.exec(data);

					resolve(results![1]);
				});

			}).on("error", err => {
				resolve(`error: ${err}`);
			});
		});
	}
}