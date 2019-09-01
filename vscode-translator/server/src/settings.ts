export interface Settings {
	maxNumberOfProblems: number;
}

interface ISettingsManager {
	getDocumentSettings(resource: string): Thenable<Settings>;
	deleteDocumentSettings(resource: string): void;
	updateGlobalSettings(settings: Settings | null): void;
}

const defaultSettings: Settings = { maxNumberOfProblems: 3 };

export class SettingsManager implements ISettingsManager {
	
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

	updateGlobalSettings(settings: Settings | null) {
		if (this.hasConfigurationCapability) {
			this.documentSettings.clear();
		} else {
			this.global = <Settings>(
				(settings || defaultSettings)
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