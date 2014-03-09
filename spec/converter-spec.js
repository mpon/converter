describe('Converter csv2json', function() {
	var Converter = require('../lib/converter');
	var fs = require('fs');

	var aCsvFile = 'company.csv', aJsonFile = 'company.json',
		bCsvFile = 'line.csv',    bJsonFile = 'line.json',
		aCsvPath = 'spec/fixtures/' + aCsvFile, aJsonPath = 'spec/' + aJsonFile,
		bCsvPath = 'spec/fixtures/' + bCsvFile, bJsonPath = 'spec/' + bJsonFile;

	beforeEach(function() {
		cleanTestFiles([aJsonPath, bJsonPath]);
	});

	afterEach(function() {
		cleanTestFiles([aJsonPath, bJsonPath]);
	});

	it("shouhld be called.", function() {
		expect(Converter).toBeDefined();
	});

	it("outputs json file", function() {

		runs(function() {
			Converter.csv2json(aCsvPath, aJsonPath, function(row, index) {
				return {
					"cd"		: row[0],
					"rr_cd"		: row[1],
					"name"		: row[2],
					"name_k"	: row[3]
				};
			});
		});
		
		waits(100);

		runs(function() {
			expect(true).toEqual(fs.existsSync(aJsonPath));

			var companies = require('./' + aJsonFile);
			var company = companies[0];
			expect(6).toEqual(companies.length);
			expect('1').toEqual(company.cd);
			expect('11').toEqual(company.rr_cd);
			expect('JR北海道').toEqual(company.name);
			expect('ジェイアールホッカイドウ').toEqual(company.name_k);
		});
	});

	it("shouhld join", function() {

		runs(function() {
			Converter.csv2json(aCsvPath, aJsonPath, function(row, index) {
				return {
					"cd"	: row[0],
					"name"	: row[2],
					"lines"	: row[10].split(',')
				};
			});
		});
		runs(function() {
			Converter.csv2json(bCsvPath, bJsonPath, function(row, index) {
				return {
					"cd"	: row[0],
					"name"	: row[2],
					"lan"	: row[8],
					"lot"	: row[9]
				};
			});
		});
		waits(100);

		runs(function() {
			expect(fs.existsSync(aJsonPath)).toBeTruthy();
			expect(fs.existsSync(bJsonPath)).toBeTruthy();

			var companies = JSON.parse(fs.readFileSync(aJsonPath, 'utf8')),
				lines     = JSON.parse(fs.readFileSync(bJsonPath, 'utf8'));

			expect(3).toEqual(companies[0].lines.length);
			expect('11101').toEqual(lines[0].cd);
			expect('11102').toEqual(lines[1].cd);
			expect('11103').toEqual(lines[2].cd);

			companies = Converter.joinJson(companies, lines);

			expect(3).toEqual(companies[0].lines.length);
			expect('11101').toEqual(companies[0].lines[0].cd);
			expect('JR函館本線(函館〜長万部)').toEqual(companies[0].lines[0].name);
			expect('140.4833696755387').toEqual(companies[0].lines[0].lan);
			expect('42.23981411231523').toEqual(companies[0].lines[0].lot);

			expect('11102').toEqual(companies[0].lines[1].cd);
			expect('11103').toEqual(companies[0].lines[2].cd);

		});
	});
});


// Utility
function cleanTestFiles(files)
{
	var fs = require('fs');

	for (var i in files) {
		var path = files[i];
		if (fs.existsSync(path)) {
			fs.unlinkSync(path);
		}
	}
}