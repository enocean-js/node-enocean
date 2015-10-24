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
	
	
});