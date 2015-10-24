var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-06-03', function() {	

			it('should return the correct dec for any random hex value', function () {
				var gd=en.getData('a5-06-03','00008000')
				expect(Math.round(gd[0].value)).to.equal(2)
				var gd=en.getData('a5-06-03','0000c000')
				expect(Math.round(gd[0].value)).to.equal(3)
				var gd=en.getData('a5-06-03','00004000')
				expect(Math.round(gd[0].value)).to.equal(1)
				var gd=en.getData('a5-06-03','0001c000')
				expect(Math.round(gd[0].value)).to.equal(7)
				var gd=en.getData('a5-06-03','00fa0000')
				expect(Math.round(gd[0].value)).to.equal(1000)

		});
	});