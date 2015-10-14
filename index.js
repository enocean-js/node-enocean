var SerialPort   = require("serialport").SerialPort;
var EventEmitter = require('events').EventEmitter;
var Telegram     = require("./telegram.js");
var eep          = require("./eep.js")
var crc          = require("./crc.js")

function SerialPortListener(){
	var serialPort = null;
	var tmp        = null;
	this.eep       = eep;
	this.base      = null;
	this.close = function(){
		serialPort.close(function(err){})
	}
	this.listen    = function(port){
		serialPort = new SerialPort(port,{baudrate: 57600});  
		
		serialPort.on("open",function(){
			this.emit("open")
			serialPort.on('data',function(data){
				var buf = new Buffer(data);

// Are we at the beginnig of a new telegram  ?

					if(buf[0] == 0x55){                                             // yes
						tmp                     = ""
						var length              = buf[2];                           //length should be byte 1 + 2 but lis usaly < 255 so using byte 2 for now 
						var optionalLength      = buf[3];                           //optional length
						var totalExpectedLength = length + optionalLength + 6 + 1;  //total lengh of package (+6 header length, +1 crc checksum)

//there is still the remote chance that we receive the starbyte, but not the complete header. TODO: find out how to handle these cases

						tmp=data;
						if(buf.length == totalExpectedLength){ //if we receive the complete telegram in one go, fill the data structure with it
							var telegram = new Telegram();
							telegram.loadFromBuffer(buf);
							this.emit("data",telegram);
							if(telegram.packetType==2){
								
								if(telegram.hasOwnProperty("base")){
									this.base=telegram.base;
									this.emit("ready",telegram.base);
								}
								this.emit("response",telegram);
							}
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
								var telegram = new Telegram();
								telegram.loadFromBuffer(buf);
								this.emit("data",telegram);
								if(telegram.packetType==2){
								
								if(telegram.hasOwnProperty("base")){
									this.base=telegram.base;
									this.emit("ready",telegram.base);
								}
								this.emit("response",telegram);
							}
							}
						}
					}
				}.bind(this));
				this.getBase()
			}.bind(this));
		}
	this.send = function(obj){
		if(obj.hasOwnProperty("raw")){
			var buf1 = new Buffer(obj.raw,"hex");
			serialPort.write(buf1);
		}
	}
	this.getBase = function(){
		this.send({raw:"5500010005700838"})
	}
}

SerialPortListener.prototype.__proto__ = EventEmitter.prototype;	
module.exports = new SerialPortListener();