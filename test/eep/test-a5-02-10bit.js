var assert = require('chai').assert
var expect = require('chai').expect
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-02-10bit', function() {	
	var sensors={
		"20":{min:-10,max:41.2}, //10
		"30":{min:-40,max:62.3}, //20
	}

	for(var i=0;i<10;i++){
		it('should return the correct dec for any random hex value (run '+i+')', function () {
			for(var index in sensors){
				var min = sensors[index].min
				var max = sensors[index].max
				var v1 = Math.round(Math.random()*(max-min))+min
				var v0 = Help.generate10BitValue(1023,0,min,max,v1)
				var gd = en.getData('a5-02-'+index,'00'+v0+'00')
				expect(Math.round(gd[0].value)).to.be.within(v1-1,v1+1)
			}
		});
	}
});