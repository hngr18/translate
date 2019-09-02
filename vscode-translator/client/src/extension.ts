/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { 
	workspace, ExtensionContext } from 'vscode';
import {
	LanguageClient, LanguageClientOptions,
	ServerOptions, TransportKind } from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {

	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);	

	let serverOptions: ServerOptions = {
		run: 	{ module: serverModule, transport: TransportKind.ipc },
		// or
		debug: 	{ module: serverModule, transport: TransportKind.ipc,
				  options: { execArgv: ['--nolazy', '--inspect=6009' ] }
		}
	};

	let clientOptions: LanguageClientOptions = {
		documentSelector: ['javascript','css'],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
