var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-04-10bit', function() {	


		it('should return a value of "released" for "00"', function () {
	      	var gd=en.getData('a5-04-03','00000002')
			assert.equal(gd[2].value,"event")
			assert.equal(Math.round(gd[1].value),0);
			assert.equal(Math.round(gd[0].value),-20);
	  	});
	  	it('should return a value of "released" for "00"', function () {
	      	var gd=en.getData('a5-04-03','ff03ff02')
			assert.equal(gd[2].value,"event")
			assert.equal(Math.round(gd[1].value),100);
			assert.equal(Math.round(gd[0].value),60);
	  	});
		
		//assert.equal(Math.round(gd[1].value),-20);
	
		for(var i=0;i<10;i++){
			it('should return the correct dec for any random hex value (run '+i+')', function () {
				var hmin = 0
				var hmax = 100
				var hv1 = Math.round(Math.random()*(hmax-hmin))+hmin
				var hv0 = Help.generateValue(0,255,hmin,hmax,hv1)
				var tmin = -20
				var tmax = 60
				var tv1 = Math.round(Math.random()*(tmax-tmin))+tmin
				var tv0 = Help.generate10BitValue(0,1023,tmin,tmax,tv1)
				var gd=en.getData('a5-04-03',hv0+tv0+'02')
				assert.equal(gd[2].value,"event")
				expect(Math.round(gd[1].value)).to.be.within(hv1-1,hv1+1)
				expect(Math.round(gd[0].value)).to.be.within(tv1-1,tv1+1)
				var gd=en.getData('a5-04-03',hv0+tv0+'00')
				assert.equal(gd[2].value,"heartbeat")
				expect(Math.round(gd[1].value)).to.be.within(hv1-1,hv1+1)
			});
		}
	});