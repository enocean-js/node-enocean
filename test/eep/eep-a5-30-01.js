var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-30-01', function() {
		it('should return the correct dec for any random hex value', function () {
			var gd=en.getData('a5-30-01','00ffff08')
			expect(gd[0].value).to.equal("open")
			expect(gd[1].value).to.equal("OK")
      var gd=en.getData('a5-30-01','00ff0008')
			expect(gd[0].value).to.equal("closed")
			expect(gd[1].value).to.equal("OK")
      var gd=en.getData('a5-30-01','0000ff08')
			expect(gd[0].value).to.equal("open")
			expect(gd[1].value).to.equal("LOW")
	});
});
