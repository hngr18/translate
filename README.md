# scripts
### description
translate plain text directly from CLI

* *nix
* PowerShell

### usage
./translateFrom.(sh|ps1) [term='Здраво'] [from='Serbian'] [to='English']

./translateTo.(sh|ps1) [term='Hello'] [to='Serbian']

### e.g.
./translateFrom.ps1 pokusati

./translateFrom.ps1 ulov serbian swedish

./translateTo.sh finally danish


# vscode translator
### description
vscode [extension](https://code.visualstudio.com/docs/editor/extension-gallery) implemented as a vscode [language server](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)

### tasks
- [x] translate javascript variable name as hint
  - [x] serbian > :uk:
- [ ] exclude all javascript built-in objects e.g. Math from translation
- [ ] include css files
- [ ] add language setting
- [ ] add DiagnosticSeverity setting
- [ ] add to extension marketplace
