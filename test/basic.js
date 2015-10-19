var assert = require('assert');
var path = require("path")
var fs = require("fs")
var en = ""
var eno= ""
describe('enocean', function() {
	before(function() {
      fs.closeSync(fs.openSync('test/sensors.json', 'w'));
      fs.closeSync(fs.openSync('test/config.json', 'w'));
      fs.writeFileSync('test/sensors.json', '{}')
      fs.writeFileSync('test/config.json', '{"base":"00000000"}')
    	en = require("../")
    	eno=en()

  	});
  after(function() {
      fs.unlinkSync('test/sensors.json')
      fs.unlinkSync('test/config.json')
      en = require("../")
      eno=en()

    });
    it('should be a function', function () {
      	assert.equal(typeof en,"function")
  	});
    it('should return an Object when called', function () {
      	assert.equal(typeof en(),"object")
  	});
  	it('should have default values when created without a config object', function () {
  		assert.equal(eno.timeout,60)
      assert.equal(eno.configFilePath,path.resolve("./config.json"))
      assert.equal(eno.sensorFilePath,path.resolve("./modules/knownSensors.json"))
  	});
    it('should be invocable with a config Object', function () { 
      assert.doesNotThrow(function(){eno=en({})})
      eno=en({timeout:30})
      assert.equal(eno.timeout,30)
      assert.equal(eno.configFilePath,path.resolve("./config.json"))
      assert.equal(eno.sensorFilePath,path.resolve("./modules/knownSensors.json"))
      eno=en({timeout:30,configFilePath:path.resolve("./test/config.json"),sensorFilePath:path.resolve("./test/sensors.json")})
      assert.equal(eno.configFilePath,path.resolve("./test/config.json"))
      assert.equal(eno.sensorFilePath,path.resolve("./test/sensors.json"))
    });

  	it('should have a listen method', function () {
      	assert(eno.hasOwnProperty("listen"))
  	});
  	it('should fire a "ready" event after listen got called', function (done) {
      this.timeout(5000);
    	eno.listen("/dev/ttyUSB0")
    	// TODO: find a way to get the right usb port automaticly
    	// setup test evvironment with their own config and sensor file
    	eno.on("ready",function(){
    		done()
    	})
  	});	
  	it('should have a base address by now', function () {
    	assert(eno.base.length===8 && eno.base!=="00000000")
  	});

    it('should save sensors passed to the learn function', function () {
      eno.learn({
        id:"0006d1a6",
        eep:"a5-02-14",
        manufacturer:"THERMOKON",
        desc:"test"
      })
    });



    it('should fire a "data" event when receiving a package', function (done) {
      eno.on("data",function(){done()})
      eno.receive(new Buffer("55000a0701eba5ff0274080006d1a60001ffffffff3a00a2",16))
    });

  	it('should be able to send strings', function () {
    	assert.doesNotThrow(function(){eno.send("00")})
  	});
    it('should not throw on illegal values', function () {
    	assert.doesNotThrow(function(){eno.send("Bla")})
  	});

});