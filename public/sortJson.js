window.diffType = "assertDiff";

function sortObject(object) {
    var sortedObj = {};
    var keys = _.keys(object);

    keys = _.sortBy(keys, function (key) {
        return key;
    });

    _.each(keys, function (key) {
        if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
            sortedObj[key] = sortObject(object[key]);
        } else {
            sortedObj[key] = object[key];
        }
    });

    return sortedObj;
}

function sortObject(object){
    var sortedJSON;
    return $.post("/deep_sort", JSON.stringify(object));
}

function getPrettyText(rawText) {
    var obj = rawText;
    while (obj && typeof(obj) != "object")
        obj = JSON.parse(obj);

    // obj = sortObject(obj);

    // var prettyText = JSON.stringify(obj, null, 2);
    // return prettyText;
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

function renderDiff(baseText, newText, viewType){ 
    baseText = difflib.stringAsLines(baseText);
    newText = difflib.stringAsLines(newText);


    //console.log(baseText)
    //console.log(newText)

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