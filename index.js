var SerialPort   = require("serialport").SerialPort;
var EventEmitter = require('events').EventEmitter;
var Telegram     = require("./modules/telegram.js");
var crc          = require("./modules/crc.js")
var Memory       = require("./modules/memory.js")
var fs           = require("fs")

function SerialPortListener(config){
	this.timeout      = config.timeout ? config.timeout : 60
	this.configFilePath = config.configFilePath ? config.configFilePath : __dirname + "/config.json"
	this.sensorFilePath = config.sensorFilePath ? config.sensorFilePath : __dirname + "/modules/knownSensors.json"

	var configFile    = require(this.configFilePath)
	
	var serialPort    = null
	var tmp           = null
	this.base         = configFile.base
	this.crc          = crc
	var state         = "" //part of the getBase Hack
	this.eepResolvers = require("./modules/eep.js")
	this.emitters     = [this]

	this.close = function(callback){
		serialPort.close(callback)
	}

	this.listen    = function(port){
		// if port is provided use the  provided one
			serialPort = new SerialPort(port,{baudrate: 57600});  
		
		serialPort.on("open",function(){
			this.mem = new Memory(this,{sensorFilePath:this.sensorFilePath})
			if(configFile.base==="00000000" || !configFile.hasOwnProperty("base")){
				this.getBase()
			}else{
				state = "ready" // part of the getBase Hack
				this.emitters.forEach(function(emitter){
					emitter.emit("ready");
				})
			}
			
			serialPort.on('data',function(data){
				var buf = new Buffer(data);

// Are we at the beginnig of a new telegram  ?

					if(buf[0] == 0x55){                                             // yes
						tmp                     = ""
						var length              = buf[2];                           //length should be byte 1 + 2 but lis usaly < 255 so using byte 2 for now 
						var optionalLength      = buf[3];                           //optional length
						var totalExpectedLength = length + optionalLength + 6 + 1;  //total lengh of package (+6 header length, +1 crc checksum)

//there is still the remote chance that we receive the starbyte, but not the complete header. TODO: find out how to handle these cases

						tmp = data;
						if(buf.length == totalExpectedLength) { //if we receive the complete telegram in one go, fill the data structure with it
							this.receive(buf);
						}
					}else{

// We are in the middle of a telegram. there should be something in the tmp buffer already. if not skip all data until wi get a header

						if(tmp != null){
							tmp                     = Buffer.concat([tmp,data]);
							buf                     = new Buffer(tmp);
							var length              = buf[2];
							var optionalLength      = buf[3];
							var totalExpectedLength = length + optionalLength + 6 + 1  //total lengh of package (+6 header length, +1 crc checksum)
							if(buf.length == totalExpectedLength){ //if we receive the complete telegram , fill the data structure with it
								this.receive(buf);
							}
						}
					}
				}.bind(this));
			}.bind(this));
		}

	this.receive=function(buf){
		var telegram = new Telegram();
		telegram.loadFromBuffer(buf);

		this.emitters.forEach(function(emitter){
			emitter.emit("data",telegram);
		})	
		
		if(telegram.packetType==2){
			if(telegram.hasOwnProperty("base")){
				this.base=telegram.base;
				configFile.base=telegram.base;
				fs.writeFile(this.configFilePath, JSON.stringify(configFile, null, 4), function(err) {
    				if(err) {

    				} else {
    					state = "ready"
    					this.emitters.forEach(function(emitter){
							emitter.emit("ready");
    						emitter.emit("base",telegram.base);
						})
    					
   			 		}
				}.bind(this))	
			}
			this.emitters.forEach(function(emitter){
				emitter.emit("response",telegram);
			})
		}
	}.bind(this)

	this.send = function(msg){
		try{
			var buf1 = new Buffer(msg,"hex");
			serialPort.write(buf1);
		}catch(err){

		}	
	}

	this.getBase = function(){
		this.send("5500010005700838")
		 // somtimes the controler does not returen the base address. 
		 // if the address is not know, this may cause the program to hang (ie. not fire the "ready" event)
		 // to fix this, see if the ready event got fired after 1 second, if not fire request the base addres again. 
		 // this is a dirty hack i know... so what, it works ;-)
		setTimeout(function(){
			if(state!=="ready") this.send("5500010005700838") 
		}.bind(this),1000)
	}

	this.getData = function(eep,data){
		var ret = null
		for(var i=0;i<this.eepResolvers.length;i++){
			 ret = this.eepResolvers[i](eep,data)
			 if(ret!=null) {
			 	return ret
			 }
		}
		return ret
	}

	this.pad = function ( num , size) {
    	var s = "00000000000000000000000000000000" + num;
    	return s.substr(s.length-size);
	}
	this.register=function(socket){
		socket.on("start-learning",this.startLearning)
		socket.on("start-forgetting",this.startForgetting)
		socket.on("send",this.send)
		socket.on("learn",this.learn)
		socket.on("forget",this.forget)
	}
}




SerialPortListener.prototype.__proto__ = EventEmitter.prototype;	
module.exports = function(config){
	// TODO: if only some of the values are in config fill in with defaultes
	if(config==undefined) config={}
	return new SerialPortListener(config);
	}


