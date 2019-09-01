export interface TextTranslator {
	translateText(input : string): string;
}

import * as https from 'https'

export class Translator implements TextTranslator {
	
	translations: Map<string, string>;

	constructor(){
		this.translations = new Map();
		
		this.translations.set('predmet', 'objx');
	}
	
	translateText(input: string): string {
		// if (!translations.find(t => t.input == inputTerm))
		// 	translations.push({ input: inputTerm, output: await getTranslation(inputTerm) });

		// let outputTerm = translations.find(t => t.input == inputTerm)!.output;

		return this.translations.get(input) || `'err' ${input} not defined`;
	}

	getTranslation(input: string): Promise<string> {

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