/**
 * @namespace Converter
 */
var Converter = {

	/**
	 * Output json file(you can adjust using callback) from a csv file
	 * @param {string} csvfile - csv filepath from basedir
	 * @param {string} jsonfile - output json filepath from basedir
	 * @param {Converter~createJsonCallback} createJsonCallback
	 */
	csv2json : function(csvfile, jsonfile, createJsonCallback)
	{
		var fs = require('fs'),
			csv = require('csv'),
			util = require('util'),
			iconv = new require('iconv').Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');

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
	},
	/**
	 * This Callback return json object you can freely adjust
	 * @callback Converter~createJsonCallback
	 * @param {string[]} row
	 * @param {number} index
	 * @returns {object} - json
	 */

	/**
	 * Join the source json object an json
	 */
	joinJson : function(companies, lines)
	{
		// create look up table
		lines.lookup = {};
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			lines.lookup[line.cd] = line;
		}

		// populate lines of companies from lines with lookup table
		for (var j = 0; j < companies.length; j++) {
			var company = companies[j];
			for (var k = 0; k < company.lines.length; k++) {
				var lineCd = company.lines[k];
				company.lines[k] = lines.lookup[lineCd];
			}
		}

		return companies;
	}
};

module.exports = Converter;