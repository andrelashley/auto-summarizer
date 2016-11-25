let vscode = require('vscode');
let summarizer = require('node-summary');

const resultsTemplate = "${summaryResults.title}\n" +
"${summaryResults.summary}\n" +
"Original Length ${summaryResults.originalLength}\n" +
"Summary Length ${summaryResults.summaryLength}\n" +
"Summary Ratio ${summaryResults.summaryRatio}";

let summarizeSelection = (originalTitle, originalText) => {
    let originalLength = 0;
    let summaryLength = 0;
    let summaryRatio = 0;
    let summaryResult = "";
    originalText = originalText || "";
    originalTitle = originalTitle || "";

    summarizer.summarize(originalTitle, originalText, (err, summary) => {
        if (err) {
            vscode.window.showErrorMessage("Oops, something went wrong.");
            return;
        }

        originalLength = originalTitle.length + originalText.length;
        summaryLength = summary.length;
        summaryRatio = (100 - (100 * (summary.length / (originalTitle.length + originalText.length))));
        summaryResult = summary;
    });

    return {
        title: originalTitle,
        originalLength: originalLength,
        summaryLength: summaryLength,
        summaryRatio: summaryRatio,
        summary: summaryResult
    };
};

let insertText = (value) => {
    let editor = vscode.window.activeTextEditor;

    // unlikely, but let's check just in case
    if (!editor) {
        vscode.window.showErrorMessage("Cannot insert summary results because no document is open.");
        return;
    }

    let selection = editor.selection;
    let range = new vscode.Range(selection.start, selection.end);
    editor.edit((editBuilder) => {
        editBuilder.replace(range, value);
    });
};

let fillResultsTemplate = (results) => {
    let filledTemplate = resultsTemplate.replace('${summaryResults.title}', results.title);
    filledTemplate = filledTemplate.replace('${summaryResults.summary}', results.summary);
    filledTemplate = filledTemplate.replace('${summaryResults.originalLength}', results.originalLength);
    filledTemplate = filledTemplate.replace('${summaryResults.summaryLength}', results.summaryLength);
    filledTemplate = filledTemplate.replace('${summaryResults.summaryRatio}', results.summaryRatio);

    return filledTemplate;
};

exports.services = { summarizeSelection: summarizeSelection, fillResultsTemplate: fillResultsTemplate };

function activate(context) {
    let summarizerDisposable = vscode.commands.registerCommand('extension.autoSummarize', () => {
        let editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage("Cannot summarize text because no document is open.");
            return;
        }

        let selection = editor.selection;
        let text = editor.document.getText(selection);
        let title = "";
        let summaryResults = {};

        if (!text) {
            vscode.window.showErrorMessage("No text selected. Please select some text and try again.");
        }

        vscode.window.showInputBox({ prompt: "Title" })
            .then(result => {
                summaryResults = summarizeSelection(result, text);
                insertText(fillResultsTemplate(summaryResults));
            });
    });

    context.subscriptions.push(summarizerDisposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;