'use strict';
/* global suite, test */

var assert = require('assert');

var vscode = require('vscode');
var myExtension = require('../extension');

suite("Extension Tests", function() {

    test("Summarizing paragraph is successful", function() {
        // arrange
        let title = "Some text";
        let content = "";
        content +=" Although moreover mistaken kindness me feelings do be marianne. Son over own nay with tell they cold upon are. Cordial village and settled she ability law";
        content += "herself. Finished why bringing but sir bachelor unpacked any thoughts. Unpleasing unsatiable particular inquietude did nor sir. Get his declared appetite";
        content += "distance his together now families. Friends am himself at on norland it viewing. Suspected elsewhere you belonging continued commanded she.";
        // act
        var result = myExtension.services.summarizeSelection(title, content);
        // assert
        assert.notEqual("", result.summary);
    });

    test("Summarizing paragraph fails with invalid content", function() {
        // arrange
        // break the summarization tool by passing in non-string values
        let decimalTitle = 3.142;
        let decimalContent = 3.142;
        let exception = undefined;

        // act
        try {
            var result = myExtension.services.summarizeSelection(decimalTitle, decimalContent);
        } catch (error) {
            exception = error;
        }

        // assert
        assert.notEqual(undefined, exception);
    });

    test("Resulting template is not the same as the original template", function() {
        // arrange
        var unmodifiedTemplate = "${summaryResults.title}\n" +
            "${summaryResults.summary}\n" +
            "Original Length ${summaryResults.originalLength}\n" +
            "Summary Length ${summaryResults.summaryLength}\n" +
            "Summary Ratio ${summaryResults.summaryRatio}";

        var templateCopy = unmodifiedTemplate;
        let title = "Some text";
        let content = "";
        content +=" Although moreover mistaken kindness me feelings do be marianne. Son over own nay with tell they cold upon are. Cordial village and settled she ability law";
        content += "herself. Finished why bringing but sir bachelor unpacked any thoughts. Unpleasing unsatiable particular inquietude did nor sir. Get his declared appetite";
        content += "distance his together now families. Friends am himself at on norland it viewing. Suspected elsewhere you belonging continued commanded she.";

        // act
        var result = myExtension.services.summarizeSelection(title, content);

        let filledTemplate = templateCopy.replace('${summaryResults.title}', result.title);
        filledTemplate = filledTemplate.replace('${summaryResults.summary}', result.summary);
        filledTemplate = filledTemplate.replace('${summaryResults.originalLength}', result.originalLength);
        filledTemplate = filledTemplate.replace('${summaryResults.summaryLength}', result.summaryLength);
        filledTemplate = filledTemplate.replace('${summaryResults.summaryRatio}', result.summaryRatio);

        // assert
        assert.notEqual(unmodifiedTemplate, filledTemplate);
    });


});