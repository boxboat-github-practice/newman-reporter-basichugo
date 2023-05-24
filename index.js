markdownContent = ''
module.exports = function newmanHugoReporter(newman, options, collectionRunOptions) {
    newman.on('start', function(err) {
	if (err) { return;}
	console.log('Collection run starting');
	

	var runFolder = collectionRunOptions.folder !== 'undefined' ? collectionRunOptions.folder : null
	var runNumber = collectionRunOptions.reporter.basichugo.runNumber !== 'undefined' ? collectionRunOptions.reporter.basichugo.runNumber : null

	var title = buildTitle(runFolder, options.runId)
	append("---");
	append("title: " + title);
	append("folder: " + runFolder);
	append("runNumber: " + runNumber);
	append("runId: " + options.runId);
	append("---");

    });

    newman.on('beforeRequest', (err, args) => {
	append("\n")
	append("### " + args.item.name)
	this.count = 1
    });
    newman.on('item', function(err, args) {
	console.log('Ran: ' + args.item.name)
    });

    var assertionParams = [];
    
    newman.on('assertion', (err, args) => {
	console.log('assertion name ' + args.assertion)
	if(err) {
	    assertionParams.push(new Array("❌",this.count, "", "**Assertion Failed**", args.assertion))
	} else if (!args.skipped) {
	    assertionParams.push(new Array("✅", this.count, "", "**Assertion Passed!**", args.assertion))
	} else {
	    assertionParams.push(new Array("SKIPPED", this.count, "", "**Assertion Skipped**", args.assertion))
	}
	
	this.count++;
    });

    newman.on('test', (err, args) => {
	console.log("Test: " + args)
	for (var i = 0; i < assertionParams.length; i++) {
	    assertionParams[i][2] = assertionParams.length;
	    append(assertionMarkdown.apply(this, assertionParams[i]));
	};

	assertionParams.length = 0;
    });

    newman.on('done', function() {
	console.log("all done");
    });

    newman.on('beforeDone', (err,args) => {
	if (err) {
	    console.log('Encountered an error');
	    return;
	};

	markdownContent = markdownContent.trim()
	newman.exports.push({
	    name: 'hugo-reporter',
	    default: 'hugo-report.md',
	    path: options.export,
	    content: markdownContent
	})
    });
};

function buildTitle(folder, runId) {
    title = '';
    if (runId !== 'undefined') {
	title = title + runId + "-"
    }
    if (folder !== 'undefined') {
	title = title + folder
    }

    return title
}

function assertionMarkdown(emoji, currCount, totalCount, phrase, assertionName) {
    return emoji + " [" + currCount + " / " + totalCount + "] " + phrase + " `" + assertionName + "`"
}

function append(str) {
    markdownContent = markdownContent + str + "\n\n"
};
