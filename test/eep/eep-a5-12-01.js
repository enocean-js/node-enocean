var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eep/eepHelper.js")
describe('a5-12-01', function() {
		it('it should...', function () {
      var raw="0114da09"
      var gd = en.getData('a5-12-01',raw)
      expect(gd[0].value).to.equal(7087.4)
      expect(gd[1].value).to.equal(10)
      expect(gd[2].value).to.equal(0)
			raw="00000019"
			var gd = en.getData('a5-12-01',raw)
			expect(gd[2].value).to.equal(1)
			//expect(gd[0].devisor).to.equal(10)

			raw="00021c0c"
			var gd = en.getData('a5-12-01',raw)
			expect(gd[0].value).to.equal(540)
      expect(gd[1].value).to.equal(1)
      expect(gd[2].value).to.equal(0)
			raw="9903018f"
			var gd = en.getData('a5-12-01',raw)
			expect(gd[0].value).to.equal("ignored")

		});
});
// 55000a0701eba50114da09ffecb3820001ffffffff4f00f3
// 55000a0701eba500000019ffecb3820001ffffffff4f0089
// 55000a0701eba500021c0cffecb3820001ffffffff520035
// 55000a0701eba59903018fffecb3820001ffffffff5000ea
