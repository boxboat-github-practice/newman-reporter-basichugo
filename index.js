var _ = require('lodash');

module.exports = function newmanHugoReporter(newman, options, collectionRunOptions) {
    newman.on('start', function(err) {
	if (err) { return;}
	console.log('Collection run starting');
    });

    newman.on('item', function(err, args) {
	console.log('Ran: ' + args.item.name)
    });

    newman.on('done', function() {
	console.log("all done");
    });

    newman.on('beforeDone', function(err, o) {
	console.log(o.summary);
	newman.exports.push({
	    name: 'hugo-reporter',
	    default: 'newman-run-report.md',
	    path: options.export,
	    content: '#' + o.summary
	});
    ));
};

