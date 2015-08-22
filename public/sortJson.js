window.diffType = "jsonDiff";

function sortObject(object){
    var sortedJSON;
    return $.post("/deep_sort", JSON.stringify(object));
}

function getPrettyText(rawText) {
    try {
        var obj = rawText;
        while (obj && typeof(obj) != "object")
            obj = JSON.parse(obj);
    } catch(e){
        alert("Error parsing input");
    }
    return sortObject(obj);
}

function getBaseText() {
    var txt;
    if (window.diffType == "assertDiff") {
        txt = $("#assertErrText").val();
        return txt.match("Expected: (.*)")[0].replace("Expected: ", "");
    } else {
        txt = $("#baseText").val();
        return txt;
    }
}

function getNeWText() {
    var txt;
    if (window.diffType == "assertDiff") {
        txt = $("#assertErrText").val()
        return txt.match("got: (.*)")[0].replace("got: ", "");
    } else {
        txt = $("#newText").val();
        return txt;
    }
}

function showAssertionDiff(viewType) {
    try {
        var baseText = getBaseText();
        var newText = getNeWText();
    } catch (e) {
        alert("Invalid input");
        return 0;
    }

    var sortedBaseText;
    var sortedNewText;

    getPrettyText(baseText).then(function(result) {
        sortedBaseText = JSON.parse(result);
        sortedBaseText = JSON.stringify(sortedBaseText, null, 2);
        return getPrettyText(newText);
    }).then(function(result){
        sortedNewText = JSON.parse(result);
        sortedNewText = JSON.stringify(sortedNewText, null, 2);
    }).then(function() {
        renderDiff(sortedBaseText, sortedNewText, viewType);
    });
}

function getViewType(){
    var type = $('input[name=_viewtype]:checked').attr("id");
    if("sidebyside" == type) {
        return 0;
    } else {
        return 1;
    }
}

function renderDiff(baseText, newText){ 
    baseText = difflib.stringAsLines(baseText);
    newText = difflib.stringAsLines(newText);
    viewType = getViewType();

    var sm = new difflib.SequenceMatcher(baseText, newText);
    var opcodes = sm.get_opcodes();

    var outputDiv = $("#diffoutput");
    outputDiv.html("");

    outputDiv.append(diffview.buildView({
        baseTextLines: baseText,
        newTextLines: newText,
        opcodes: opcodes,
        baseTextName: "Expected",
        newTextName: "Got",
        contextSize: null,
        viewType: viewType
    }));
}