var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('d2-32-02', function() {
		it('it should...', function () {
      var raw="4004c00700d001a03d790001"
      var gd = en.getData('d2-32-02',raw)
      expect(gd[0].value).to.equal(0.1)
      expect(gd[1].value).to.equal(7.6)
      expect(gd[2].value).to.equal(0.7)
      expect(gd[3].value).to.equal(1.3)
      expect(gd[4].value).to.equal(0)
      raw="0004c00700d001a03d790001"
      gd = en.getData('d2-32-02',raw)
      expect(gd[0].value).to.equal(1)
      expect(gd[1].value).to.equal(76)
      expect(gd[2].value).to.equal(07)
      expect(gd[3].value).to.equal(13)
      expect(gd[4].value).to.equal(0)
      raw="c004c00700d001a03d790001"
      var gd = en.getData('d2-32-02',raw)
      expect(gd[4].value).to.equal(1)
		});
});
