var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('d1-03-c1', function() {
		it('it should...', function () {
      var raw="03c15a5a4a5b5b4b606053500201a5741e6801"
      var gd = en.getData('d1-03-c1',raw)
			expect(gd[0].value).to.equal(25)
			expect(gd[1].value).to.equal(25)
			expect(gd[2].value).to.equal(17)
			expect(gd[3].value).to.equal(25.5)
			expect(gd[5].value).to.equal(17.5)
		});
});
