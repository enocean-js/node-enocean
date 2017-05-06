var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('f6-10-00', function() {
				var gd = en.getData('f6-10-00',0b11000000.toString(16))
				expect(gd[0].value).to.equal("handle horizontal")
        var gd = en.getData('f6-10-00',0b11100000.toString(16))
				expect(gd[0].value).to.equal("handle horizontal")
        var gd = en.getData('f6-10-00',0b11010000.toString(16))
				expect(gd[0].value).to.equal("handle vertical up")
        var gd = en.getData('f6-10-00',0b11110000.toString(16))
				expect(gd[0].value).to.equal("handle vertical down")
});
