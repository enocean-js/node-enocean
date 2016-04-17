var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-09-04', function() {
		it('should return the correct dec for any random hex value', function () {
			var gd=en.getData('a5-09-04','c8ffff03')
			expect(gd[0].value).to.equal(100)
			expect(gd[1].value).to.equal(2550)
      expect(gd[2].value).to.equal(51)
	});
});
