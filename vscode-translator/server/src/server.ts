/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import {
	createConnection,
	TextDocuments,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	CodeLensResolveRequest
} from 'vscode-languageserver';

import { SettingsManager } from './settings'

import {
	TextTranslator,
	Translator
} from './translator'

let
	connection = createConnection(ProposedFeatures.all),
	settingsManager: SettingsManager,
	translator: TextTranslator = new Translator(),
	documents: TextDocuments = new TextDocuments();

let
	hasConfigurationCapability: boolean = false,
	hasWorkspaceFolderCapability: boolean = false,
	hasDiagnosticRelatedInformationCapability: boolean = false;

connection.onInitialize((params: InitializeParams) => {

	let capabilities = params.capabilities;

	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			completionProvider: {
				resolveProvider: true
			}
		}
	};
});

connection.onInitialized(() => {

	if (hasConfigurationCapability) {

		connection.client.register(DidChangeConfigurationNotification.type, undefined);

		settingsManager = new SettingsManager(connection, hasConfigurationCapability);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

documents.onDidChangeContent(change => { validateTextDocument(change.document); });
documents.onDidClose(e => { settingsManager.deleteDocumentSettings(e.document.uri); });

connection.onDidChangeConfiguration(change => {

	settingsManager.changeSettings(change);

	documents.all().forEach(validateTextDocument);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {

	let settings = await settingsManager.getDocumentSettings(textDocument.uri);
	let pattern = new RegExp(/\b(?!(abstract|arguments|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|from|function|goto|if|implements|import|in|instanceof|int|interface|let|long|Math|native|new|null|package|private|protected|public|restore|render|return|rotate|save|scale|short|src|static|super|switch|synchronized|this|throw|throws|transient|translate|true|try|typeof|update|var|void|volatile|while|with|yield))\b[A-Za-z0-9_]{3,}\b/gm);

	let text = textDocument.getText();
	let m: RegExpExecArray | null;

	let problems = 0;
	let diagnostics: Diagnostic[] = [];
	while (problems < settings.maxNumberOfProblems && (m = pattern.exec(text))) {

		problems++;

		let inputTerm = m[0].toLowerCase();

		let outputTerm = translator.translateText(inputTerm);

		let diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Hint,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `'${outputTerm}'`,
			source: 'English'
		};
		if (hasDiagnosticRelatedInformationCapability) {
			diagnostic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnostic.range)
					},
					message: 'Particularly for names'
				}
			];
		}
		diagnostics.push(diagnostic);
	}

	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		return [
			{
				label: 'TypeScript',
				kind: CompletionItemKind.Text,
				data: 1
			},
			{
				label: 'JavaScript',
				kind: CompletionItemKind.Text,
				data: 2
			}
		];
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			item.detail = 'TypeScript details';
			item.documentation = 'TypeScript documentation';
		} else if (item.data === 2) {
			item.detail = 'JavaScript details';
			item.documentation = 'JavaScript documentation';
		}
		return item;
	}
);

/*
connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.text the initial full content of the document.
	connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
