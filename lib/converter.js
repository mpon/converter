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
	 * Join json with forein key
	 * @param {object[]} originals - array of json to be join
	 * @param {object[]} foreigns - array of json to join
	 * @param {string} foreignKeysPropName - property name of contain forein Keys
	 * @param {string} foreignKeyPropName - property name of foreign key
	 * @return {object[]} - array of json after join
	 */
	joinJson : function(originals, foreigns, foreignKeysPropName, foreignKeyPropName)
	{
		// create look up table
		var lookup = {};
		for (var i = 0; i < foreigns.length; i++) {
			var foreign = foreigns[i];
			lookup[foreign[foreignKeyPropName]] = foreign;
		}

		// populate originals from foreings with lookup table
		for (var j = 0; j < originals.length; j++) {
			var origin = originals[j];
			for (var k = 0; k < origin[foreignKeysPropName].length; k++) {
				var key = origin[foreignKeysPropName][k];
				origin[foreignKeysPropName][k] = lookup[key];
			}
		}

		return originals;
	}
};

module.exports = Converter;