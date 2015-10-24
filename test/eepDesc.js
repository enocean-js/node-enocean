var assert = require('chai').assert
var should = require('chai').should()
var eo = require("../")()
describe('EEP Descriptions', function() {
    it('should exist for f6-02', function () {
      	assert.equal(eo.eepDesc["f6-02"],"Rocker Switch, 2 Rocker")
  	});
  	it('should exist for a5-38-08', function () {
  		var tel="a5-02-03"
      	assert.equal(eo.eepDesc["a5-38-08"],"Gateway")
  	});
  	it('should exist for a5-02', function () {
  		var tel="a5-02-03"
  		var class1=tel.substring(0,5)
      	assert.equal(eo.eepDesc[class1],"Temperature Sensor")
  	});
});