var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-05-01', function() {	
		for(var i=0;i<10;i++){
			it('should return the correct dec for any random hex value (run '+i+')', function () {
				var min = 500
				var max = 1150
				var tv1 = Math.round(Math.random()*(max-min))+min
				var tv0 = Help.generate10BitValue(0,1023,min,max,tv1)
				var gd=en.getData('a5-05-01','00'+tv0+'02')
				assert.equal(gd[1].value,"event")
				expect(Math.round(gd[0].value)).to.be.within(tv1-1,tv1+1)
				var gd=en.getData('a5-05-01','00'+tv0+'00')
				assert.equal(gd[1].value,"heartbeat")
				expect(Math.round(gd[0].value)).to.be.within(tv1-1,tv1+1)
			});
		}
	});