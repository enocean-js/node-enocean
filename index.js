var SerialPort   = require("serialport").SerialPort;
var EventEmitter = require('events').EventEmitter;
var Telegram     = require("./telegram.js");

function SerialPortListener(){
	var serialport = null;
	var tmp        = null;
	this.listen    = function(port){
		serialPort = new SerialPort(port,{baudrate: 57600});      
		serialPort.on("open",function(){
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
							}
						}
					}
				}.bind(this));
			}.bind(this));
		}
	this.send = function(tel){
		//Not yet implemented
		var buf1 = new Buffer(tel,"hex");
		serialPort.write(buf1);
	}
}

SerialPortListener.prototype.__proto__ = EventEmitter.prototype;	
module.exports = new SerialPortListener();