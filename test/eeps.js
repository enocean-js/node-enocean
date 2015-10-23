var assert = require('chai').assert
var path = require("path")
var fs = require("fs")
var en = require("../")();

describe('EEP Resolver', function() {
	it('should be available', function () {
		assert.equal(typeof en.getData,"function")
	});
	describe('00-00-00', function() {
		it('should return unknown for unknown eeps', function () {
	      	assert.equal(en.getData("00-00-00","00")[0].value,"unknown")
	  	});
	});
	describe('f6-02-03', function() {
		it('should return a value of "released" for "00"', function () {
	      	assert.equal(en.getData("f6-02-03","00")[0].value,"released")
	  	});
	  	it('should return a value of "B0 down" for "70"', function () {
	      	assert.equal(en.getData("f6-02-03","70")[0].value,"B0 down")
	  	});
	  	it('should return a value of "B1 down" for "50"', function () {
	      	assert.equal(en.getData("f6-02-03","50")[0].value,"B1 down")
	  	});
	  	it('should return a value of "A0 down" for "30"', function () {
	      	assert.equal(en.getData("f6-02-03","30")[0].value,"A0 down")
	  	});
	  	it('should return a value of "A1 down" for "10"', function () {
	      	assert.equal(en.getData("f6-02-03","10")[0].value,"A1 down")
	  	});
	});
	describe('a5-02-xx', function() {	

		function pad(num,size) {
			var s = "00000000000000000000000000000000" + num;
			return s.substr(s.length-size);
		}
		function getV(minB,maxB,minV,maxV,val1){
			var B=((maxV-minV)/(maxB-minB))
			val0   = ((val1-minV)/B)+minB
			return pad(Math.floor(val0).toString(16),2)
		}
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
					var v0 = getV(255,0,min,max,v1)
					assert.equal(Math.round(en.getData('a5-02-'+index,'0000'+v0+'00')[0].value),v1);
				}
			});
		}
	});
	describe('a5-02-20/30', function() {	

		function pad(num,size) {
			var s = "00000000000000000000000000000000" + num;
			return s.substr(s.length-size);
		}
		function getV(minB,maxB,minV,maxV,val1){
			var B=((maxV-minV)/(maxB-minB))
			val0   = ((val1-minV)/B)+minB
			return pad(Math.floor(val0).toString(16),4)
		}
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
					var v0 = getV(1023,0,min,max,v1)
					assert.equal(Math.round(en.getData('a5-02-'+index,'00'+v0+'00')[0].value),v1);
				}
			});
		}
	});
	describe('d5-00-01', function() {	
		it('should interpret "00" to be "open"', function () {
			assert.equal(en.getData('d5-00-01','00')[0].value,"open");
		})
		it('should interpret "01" to be "closed"', function () {
			assert.equal(en.getData('d5-00-01','01')[0].value,"closed");
		})
	});
	describe('a5-07-01', function() {	
		it('should return the "supported" "on" the PIR Status and Voltage', function () {
			var dat=en.getData('a5-07-01','c307ff09')
			assert.equal(dat[0].value,"supported")
			assert.equal(dat[1].value,"on")
			assert.equal(dat[2].value,"3.8235294117647056")
			assert.equal(dat[0].type,"Supply voltage")
			assert.equal(dat[1].type,"PIR Status")
			assert.equal(dat[2].type,"Voltage")
			assert.equal(dat[2].unit,"V")
		})
	});
	describe('a5-04-xx', function() {	

		function pad(num,size) {
			var s = "00000000000000000000000000000000" + num;
			return s.substr(s.length-size);
		}
		function getV(minB,maxB,minV,maxV,val1){
			var B=((maxV-minV)/(maxB-minB))
			val0   = ((val1-minV)/B)+minB
			return pad(Math.floor(val0).toString(16),2)
		}
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
					var hv0 = getV(0,255,hmin,hmax,hv1)
					var tmin = sensors[index].tmin
					var tmax = sensors[index].tmax
					var tv1 = Math.round(Math.random()*(tmax-tmin))+tmin
					var tv0 = getV(0,255,tmin,tmax,tv1)
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
});