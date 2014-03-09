var fs = require('fs'),
	csv = require('csv'),
	iconv = new require('iconv').Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');

var Converter = {
	csv2json : function()
	{
		var readStream = fs.createReadStream('spec/fixtures/sample.csv');
		readStream.on('error', function(err) {
			console.log(err);
		});

		csv()
			.from.stream(readStream.pipe(iconv))
			.on('record', function(row, index) {
			});
	}
};

module.exports = Converter;