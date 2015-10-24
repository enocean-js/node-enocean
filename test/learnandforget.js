var assert = require('chai').assert
var should = require('chai').should()
var path = require("path")
var fs = require("fs")
var en = ""
var eno= ""
var learn4BS="55000a0701eba508a002800006d1a60001ffffffff490004"
var data4BS="55000a0701eba5ff0274080006d1a60001ffffffff3a00a2"
var RPS="55000707017af600002a1d442001ffffffff4d0045"
var testConfig={timeout:30,configFilePath:path.resolve("./test/config.json"),sensorFilePath:path.resolve("./test/sensors.json")}
describe('enocean(learn and forget)', function() {
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
    eno.close(function(err){})
  });
  it('should fire a "start-learning" and "stop-learning" event when learning', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=1
    var started=0
    eno.on("ready",function(){
      eno.startLearning()
    })
    eno.on("learn-mode-start",function(){
      started=1
    })
    eno.on("learn-mode-stop",function(){
      assert.equal(started,1)
      eno.close(function(){done()})
    })
  });

  it('should be able to manually stop learning', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=100
    eno.on("ready",function(){
      eno.startLearning()
      eno.stopLearning()
    })
    eno.on("learn-mode-stop",function(){
      eno.close(function(){done()})
    })
  });

  it('should learn a sensor when receiving a learn telegram when in learn mode (4BS)', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=1
    var started=0
    eno.on("ready",function(){
      eno.startLearning()
    })
    eno.on("learn-mode-start",function(){
      eno.receive(new Buffer(learn4BS,"hex"))
    })
    eno.on("learned",function(data){
      assert.equal(data.id,"0006d1a6")
      assert.equal(data.title,"New Temperature Sensor")
      assert.equal(data.eepFunc,"Temperature Sensor")
      assert.equal(data.eepType,"Temperature Sensor Range -20°C to +60°C")
      eno.close(function(){done()})
    })
  });

  it('should forget a sensor when receiving a learn telegram when in forget mode (4BS)', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=1
    var started=0
    eno.on("ready",function(){
      eno.startForgetting()
    })
    eno.on("forget-mode-start",function(){
      eno.receive(new Buffer(learn4BS,"hex"))
    })
    eno.on("forgotten",function(data){
      assert.equal(data.id,"0006d1a6")
      eno.close(function(){done()})
    })
  });
  it('should learn a sensor when receiving a RPS telegram when in learn mode (RPS)', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=1
    var started=0
    eno.on("ready",function(){
      eno.startLearning()
    })
    eno.on("learn-mode-start",function(){
      eno.receive(new Buffer(RPS,"hex"))
    })
    eno.on("learned",function(data){
      assert.equal(data.id,"002a1d44")
      assert.equal(data.eepFunc,"Rocker Switch, 2 Rocker")
      assert.equal(data.eepType,"Light Control - Application Style 1")
      eno.close(function(){done()})
    })
  });
  it('should forget a sensor when receiving a RPS telegram when in forget mode (RPS)', function (done) {
    this.timout=5000
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=2
    var started=0
    eno.on("ready",function(){
      eno.startForgetting()
    })
    eno.on("forget-mode-start",function(){
      eno.receive(new Buffer(RPS,"hex"))
    })
    eno.on("forgotten",function(data){
      assert.equal(data.id,"002a1d44")
      eno.close(function(){done()})
    })
  });

  it('should not learn or forget when not in any of the modes', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=1
    var flag=0
    eno.on("ready",function(){
      eno.receive(new Buffer(RPS,"hex"))
      eno.receive(new Buffer(learn4BS,"hex"))
    })
    eno.on("learn-mode-start",function(){

    })
    eno.on("learned",function(data){
      flag=1
    })
    eno.on("forgotten",function(data){
      flag=1
    })
    setTimeout(function(){
      assert.equal(flag,0)
      done()
    },1000)
  });

  it('should ignore data telegrams when in learn mode', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=1
    var flag=0
    eno.on("ready",function(){
      eno.startLearning()
    })
    eno.on("learn-mode-start",function(){
      eno.receive(new Buffer(data4BS,"hex"))
    })
    eno.on("learned",function(data){
      flag=1
    })
    setTimeout(function(){
      assert.equal(flag,0)
      done()
    },1000)
  });
  it('should ignore data telegrams when in forget mode', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=1
    var flag=0
    eno.on("ready",function(){
      eno.startForgetting()
    })
    eno.on("forget-mode-start",function(){
      eno.receive(new Buffer(data4BS,"hex"))
    })
    eno.on("forgotten",function(data){
      flag=1
    })
    setTimeout(function(){
      assert.equal(flag,0)
      done()
    },1000)
  });
  it('should ignore learn telegrams when sensor is already known', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=1
    
    var flag=0
    eno.on("ready",function(){
      eno.learn({
        id:"0006d1a6",
        eep:"a5-02-14",
        manufacturer:"THERMOKON",
        desc:"test"
      })
      eno.startLearning()
      eno.receive(new Buffer(learn4BS,"hex"))
    })
    eno.on("learn-mode-stop",function(data){
      if(data.code == 0 ){flag=1}
      if(data.code == 1 && flag===1){done()}
      //eno.receive(new Buffer(data4BS,"hex"))
    })

  });
  it('should really delete forgotten sensors', function (done) {
    eno=en(testConfig)
    eno.listen("/dev/ttyUSB0")
    eno.timeout=1
    
    var flag=0
    eno.on("ready",function(){
      eno.learn({
        id:"0006d1a6",
        eep:"a5-02-14",
        manufacturer:"THERMOKON",
        desc:"test"
      })
    })
    eno.on("learned",function(data){
      eno.forget("0006d1a6")
    })
    eno.on("forgotten",function(data){
      assert.equal(eno.getSensors().hasOwnProperty(data.id),false)
      done()
    })

  });
});