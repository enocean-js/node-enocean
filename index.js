var SerialPort   = require("serialport").SerialPort;
var EventEmitter = require('events').EventEmitter;
var Telegram     = require("./modules/telegram.js");
var eep          = require("./modules/eep.js")
var crc          = require("./modules/crc.js")
var Memory       = require("./modules/memory.js")
var base         = "00000000"

function SerialPortListener(config){
	var configFile = config.hasOwnProperty("configFile")? config.configFile : "./config.json"
	var config       = require(configFile)
	var serialPort = null
	var tmp        = null
	this.eep       = eep
	this.base      = config.base
	this.crc       = crc

	this.close = function(){
		serialPort.close(function(err){})
	}
	this.listen    = function(port){
		serialPort = new SerialPort(port,{baudrate: 57600});  
		
		serialPort.on("open",function(){
			this.mem = new Memory(this)
			this.emit("ready");
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
		this.emit("data",telegram);
		if(telegram.packetType==2){
			if(telegram.hasOwnProperty("base")){
				this.base=telegram.base;
				base=this.base;
				this.emit("base",telegram.base);
			}
			this.emit("response",telegram);
		}
	}.bind(this)

	this.send = function(msg){
			var buf1 = new Buffer(msg,"hex");
			serialPort.write(buf1);
	}

	this.getBase = function(){
		this.send("5500010005700838")
	}

	this.pad = function ( num , size) {
    	var s = "00000000000000000000000000000000" + num;
    	return s.substr(s.length-size);
	}
}

SerialPortListener.prototype.__proto__ = EventEmitter.prototype;	
module.exports = function(config){
	if(config==undefined) config={}
	return new SerialPortListener(config);
	}


