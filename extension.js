let vscode = require('vscode');

let summarize = (value) => {
    console.log(value);
};

function activate(context) {
    let summarizerDisposable = vscode.commands.registerCommand('extension.autoSummarize', () => {
        let editor = vscode.window.activeTextEditor;

        if(!editor) {
            vscode.window.showErrorMessage("Cannot summarize text because no document is open.");
            return;
        }

        let selection = editor.selection;
        let text = editor.document.getText(selection);

        if(!text){
            vscode.window.showErrorMessage("No text selected. Please select some text and try again.");
        }

        summarize(text);
    });

    context.subscriptions.push(summarizerDisposable);

}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;