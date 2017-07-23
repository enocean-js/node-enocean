var assert = require('chai').assert
var path = require("path")
var fs = require("fs")
var en = require("../")();

describe('Generic EEP Resolver', function() {
	describe('a5-02-03', function() {
		it('generic eep test', function () {
	      	assert.equal(en.getData2("a5-02-14","55000a0701eba5ff037c080006be370001ffffffff3900ee").TMP.value,21.09803921568627)
	  	});
	});
});
