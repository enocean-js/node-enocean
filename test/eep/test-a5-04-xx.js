var assert = require('chai').assert
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-04-xx', function() {	
	var sensors={
		"01":{hmin:0,hmax:100,tmin:0,tmax:40}, //1
		"02":{hmin:0,hmax:100,tmin:-20,tmax:60}//2
	}
	for(var i=0;i<10;i++){
		it('should return the correct dec for any random hex value (run '+i+')', function () {
			for(var index in sensors){
				var hmin = sensors[index].hmin
				var hmax = sensors[index].hmax
				var hv1 = Math.round(Math.random()*(hmax-hmin))+hmin
				var hv0 = Help.generateValue(0,250,hmin,hmax,hv1)
				var tmin = sensors[index].tmin
				var tmax = sensors[index].tmax
				var tv1 = Math.round(Math.random()*(tmax-tmin))+tmin
				var tv0 = Help.generateValue(0,250,tmin,tmax,tv1)
				var gd=en.getData('a5-04-'+index,'00'+hv0+tv0+'02')
				assert.equal(gd.length,2)
				assert.equal(Math.round(gd[0].value),hv1);
				assert.equal(Math.round(gd[1].value),tv1);
				var gd=en.getData('a5-04-'+index,'00'+hv0+tv0+'00')
				assert.equal(gd.length,1)
				assert.equal(Math.round(gd[0].value),hv1);
			}
		});
	}
});