import { DidChangeConfigurationParams } from 'vscode-languageserver';

export interface Settings {
	maxNumberOfProblems: number;
}

const defaultSettings: Settings = { maxNumberOfProblems: 3 };

interface _Settings {

	updateSettings(change: DidChangeConfigurationParams): void;
	getDocumentSettings(resource: string): Thenable<Settings>;
	
	deleteDocumentSettings(resource: string): void;
}

export class SettingsManager implements _Settings {
	
	connection: any;
	hasConfigurationCapability: boolean;

	global: Settings;
	documentSettings: Map<string, Thenable<Settings>>;

	constructor(connection:any, hasConfigurationCapability: boolean) {
		this.connection = connection;
		this.hasConfigurationCapability = hasConfigurationCapability;

		this.global = defaultSettings;
		this.documentSettings = new Map();
	}

	updateSettings(change: DidChangeConfigurationParams) {
		if (this.hasConfigurationCapability) {
			this.documentSettings.clear();
		} else {
			this.global = <Settings>(
				(change.settings.languageServerExample || defaultSettings)
			);
		}
	}

	getDocumentSettings(resource: string): Thenable<Settings> {
		
		if (!this.hasConfigurationCapability) {
			return Promise.resolve(this.global);
		}

		let result = this.documentSettings.get(resource);
		if (!result) {
			result = this.connection.workspace.getConfiguration({
				scopeUri: resource,
				section: 'languageServerExample'
			});
			this.documentSettings.set(resource, result!);
		}
		return result!;
	}

	deleteDocumentSettings(resource: string): void {
		this.documentSettings.delete(resource);
	}
}