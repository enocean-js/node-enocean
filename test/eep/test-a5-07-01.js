var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-07-01', function() {	
		it('should return the correct dec for any random hex value', function () {
			var gd=en.getData('a5-07-01','0000C800')
			expect(gd[0].value).to.equal("on")
			var gd=en.getData('a5-07-01','00007800')
			expect(gd[0].value).to.equal("off")
			var gd=en.getData('a5-07-01','0f005001')
			expect(gd[2].value).to.equal(0.3)
			expect(gd[1].value).to.equal("supported")
			expect(gd[0].value).to.equal("off")
	});
});