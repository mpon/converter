var fs = require('fs'),
	csv = require('csv'),
	util = require('util'),
	iconv = new require('iconv').Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');

/**
 * @namespace Converter
 */
var Converter = {

	/**
	 * output a json file from a csv file
	 * @param {string} csvfile - csv filepath from basedir
	 * @param {string} jsonfile - output json filepath from basedir
	 * @param {Converter~createJsonCallback} createJsonCallback
	 */
	csv2json : function(csvfile, jsonfile, createJsonCallback)
	{
		var readStream = fs.createReadStream(csvfile);
		readStream.on('error', function(err) {
			console.log(err);
		});

		var lists = [];
		csv()
			.from.stream(readStream.pipe(iconv))
			.on('record', function(row, index) {
				// only body exclude head
				if (index > 0) {
					var json = createJsonCallback(row, index);
					lists.push(json);
				} 
			})
			.on('end', function(count) {
				fs.writeFileSync(jsonfile, util.format("%j", lists));
			});
	}
	/**
	 * This Callback return json object
	 * @callback Converter~createJsonCallback
	 * @param {string[]} row
	 * @param {number} index
	 * @returns {object} - json
	 */
};

module.exports = Converter;