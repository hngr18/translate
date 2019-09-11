import * as https from 'https'
import { patterns } from './patterns'
import { SettingsManager, Settings } from './settings';

interface Translation {
	from: string, to: string,
	input: string, output: string
}

export class Translator extends Array<Translation> {

	settingsManager: SettingsManager;
	translations: Translation[];

	token: string = '';
	lastTokenRefresh: Date | undefined;

	constructor(settingsManager: SettingsManager) {
		super();

		this.settingsManager = settingsManager;
		this.translations = this.loadFromCache();
	}

	loadFromCache(): Translation[] {
		return new Array<Translation>(

		)
	};

	async translateText(input: string, resource: string): Promise<string> {

		const
			settings = await this.settingsManager.getConfiguration(resource),
			pattern = patterns.camelCase,
			words = input.split(pattern!).filter(e => e);

		await Promise.all(
			words.map(async word => {

				let input = word.toLowerCase();

				if (!this.translations.find(t => t.input == input && t.from == settings.input && t.to == settings.output))
					this.translations.push({
						from: settings.input, to: settings.output,
						input: input, output: await this.getTranslation(input, settings)
					});
			})
		);

		let output = '';

		words.forEach(word => {
			let input = word.toLowerCase();
			let translation = this.translations.find(t => t.input == input && t.from == settings.input && t.to == settings.output)!.output;
			output += this.matchCase(word, translation);
		})

		return output;
	}

	private matchCase(word: string, translation: string) {
		return word.substr(0, 1) == word.substr(0, 1).toUpperCase() ?
			translation.substr(0, 1).toUpperCase() + translation.substr(1).toLowerCase() :
			translation.toLowerCase();
	}

	async getTranslation(input: string, settings: Settings): Promise<string> {

		if (this.tokenRefreshRequired())
			await this.refreshToken(settings);

		return new Promise(resolve => {
			
			let translationUrl = new URL(settings.translationUrl);

			let bodyContent = JSON.stringify([{
				Text: input
			}]);

			const req = https.request({
				method: 'POST',
				//search: ,
				host: translationUrl.hostname,
				path: translationUrl.pathname + `${translationUrl.search}&from=${settings.input}&to=${settings.output}`,
				headers: { 
					'Authorization' : "Bearer " + this.token, 
					'Content-Type' : 'application/json',
					'Content-Length' : Buffer.byteLength(bodyContent) }
				}, 
				res => {
					res.on('data', buffer => {

						let data = JSON.parse(buffer.toString())[0];

						resolve(data.translations[0].text);
					})
				}
			);

			req.on('error', (error) => {
				throw `getTranslation error: ${error}`
			});

			req.write(bodyContent);
			req.end();
		});
	}

	private tenMinutesMS = 10 * 60 * 1000;

	tokenRefreshRequired(): boolean {
		return !this.lastTokenRefresh || new Date().getTime() - this.lastTokenRefresh.getTime() > this.tenMinutesMS;
	}

	async refreshToken(settings: Settings): Promise<void> {

		return new Promise(resolve => {

			let tokenUrl = new URL(settings.tokenUrl);

			const req = https.request({
				method: 'POST',
				host: tokenUrl.hostname,
				path: tokenUrl.pathname,
				headers: { 'Ocp-Apim-Subscription-Key': settings.apiKey }
				}, 
				res => {
					res.on('data', token => {
						this.token = token.toString();
					
						resolve();
					})
				}
			);

			req.on('error', (error) => {
				throw `refreshToken error: ${error}`
			})

			req.write('')
			req.end()
		});
	}
}