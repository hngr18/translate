/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {

	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);	
	let nodeDebugForVS = '--inspect=6009';
	let debugOptions = { execArgv: ['--nolazy', nodeDebugForVS ] };

	let serverOptions: ServerOptions = {
		run: 	{ module: serverModule, transport: TransportKind.ipc },
		debug: 	{ module: serverModule, transport: TransportKind.ipc,
				  options: debugOptions 
		}
	};

	let clientOptions: LanguageClientOptions = {
		documentSelector: ['javascript'],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	client.start(); // launches server too
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
