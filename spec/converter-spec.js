var Converter = require('../lib/converter');

describe('コンバーター', function() {
	it("呼び出せること", function() {
		expect(Converter).toBeDefined();
	});

	it("jsonを出力すること", function() {
		Converter.csv2json();
	});
});