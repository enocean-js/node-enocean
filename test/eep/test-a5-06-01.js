var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-06-01', function() {	
		for(var i=0;i<10;i++){
			it('should return the correct dec for any random hex value (run '+i+')', function () {
				var min = 600
				var max = 60000
				var tv1 = Math.round(Math.random()*(max-min))+min
				var tv0 = Help.generateValue(0,255,min,max,tv1)
				var gd=en.getData('a5-06-01','0000'+tv0+'00')
				expect(Math.round(gd[0].value)).to.be.within(tv1-240,tv1+240)

				var min = 300
				var max = 30000
				var tv1 = Math.round(Math.random()*(max-min))+min
				var tv0 = Help.generateValue(0,255,min,max,tv1)
				var gd=en.getData('a5-06-01','00'+tv0+'0001')
				expect(Math.round(gd[0].value)).to.be.within(tv1-120,tv1+120)
			});
		}
	});