var assert = require('chai').assert
var en = require("../../")();
var Help = require("../../modules/eepGeneratorHelper.js")
describe('a5-02-xx', function() {	
	var sensors={
		"01":{min:-40,max:0}, //1
		"02":{min:-30,max:10}, //2
		"03":{min:-20,max:20}, //3
		"04":{min:-10,max:30}, //4
		"05":{min:-0,max:40}, //5
		"06":{min:10,max:50}, //6
		"07":{min:20,max:60}, //7
		"08":{min:30,max:70}, //8
		"09":{min:40,max:80}, //9
		"0a":{min:50,max:90}, //a
		"0b":{min:60,max:100}, //b
		"10":{min:-60,max:20}, //10
		"11":{min:-50,max:30}, //11
		"12":{min:-40,max:40}, //12
		"13":{min:-30,max:50}, //13
		"14":{min:-20,max:60}, //14
		"15":{min:-10,max:70}, //15
		"16":{min:0,max:80}, //16
		"17":{min:10,max:90}, //17
		"18":{min:20,max:100}, //18
		"19":{min:30,max:110}, //19
		"1a":{min:40,max:120}, //1a
		"1b":{min:50,max:130} //1b
	}
	for(var i=0;i<10;i++){
		it('should return the correct dec for any random hex value (run '+i+')', function () {
			for(var index in sensors){
				var min = sensors[index].min
				var max = sensors[index].max
				var v1 = Math.round(Math.random()*(max-min))+min
				var v0 = Help.generateValue(255,0,min,max,v1)
				assert.equal(Math.round(en.getData('a5-02-'+index,'0000'+v0+'00')[0].value),v1);
			}
		});
	}
});