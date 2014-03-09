var Converter = require('../lib/converter');
var fs = require('fs');

var infile = 'company.csv',
	outfile = 'company.json',
	csvPath = 'spec/fixtures/' + infile,
	jsonPath = 'spec/' + outfile;

describe('Converter', function() {

	beforeEach(function() {
		cleanTestFiles([jsonPath]);
	});

	afterEach(function() {
		cleanTestFiles([jsonPath]);
	});

	it("shouhld be called.", function() {
		expect(Converter).toBeDefined();
	});

	it("outputs json file", function() {

		Converter.csv2json(csvPath, jsonPath, function(row, index) {
			return {
				"cd"		: row[0],
				"rr_cd"		: row[1],
				"name"		: row[2],
				"name_k"	: row[3],
				"name_h"	: row[4],
				"url"		: row[6],
				"status"	: [row[7], row[8], row[9]]
			};
		});
		waits(100);

		runs(function() {
			expect(true).toEqual(fs.existsSync(jsonPath));

			var companies = require('./' + outfile);
			var company = companies[0];
			expect(165).toEqual(companies.length);
			expect('1').toEqual(company.cd);
			expect('11').toEqual(company.rr_cd);
			expect('JR北海道').toEqual(company.name);
			expect('ジェイアールホッカイドウ').toEqual(company.name_k);
			expect('北海道旅客鉄道株式会社').toEqual(company.name_h);
			expect('http://www.jrhokkaido.co.jp/').toEqual(company.url);
			expect(['1','0','1']).toEqual(company.status);
		});


	});
});


// Utility
function cleanTestFiles(files)
{
	for (var i in files) {
		var path = files[i];
		if (fs.existsSync(path)) {
			fs.unlinkSync(path);
		}
	}
}