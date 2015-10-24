var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-11-02', function() {	
		it('should return the correct dec for any random hex value', function () {
			var gd=en.getData('a5-11-02','ff11ff03')
			expect(gd[0].value).to.equal(51.2)
			expect(gd[1].value).to.equal(100)
			expect(gd[2].value).to.equal("Stage 1 Automatic")
			expect(gd[3].value).to.equal("Frost")
			expect(gd[4].value).to.equal("Normal")
			expect(gd[5].value).to.equal("Automatic")
	});
});