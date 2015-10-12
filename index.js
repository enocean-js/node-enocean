var SerialPort   = require("serialport").SerialPort;
var EventEmitter = require('events').EventEmitter;
var Telegram     = require("./telegram.js");
var SP           = null;
var tmp          = null;

function SerialPortListener(){
	this.listen = function(port){
		SP = new SerialPort(port,{baudrate: 57600}); //(/dev/ttyAMA0)
		SP.on("open",function(){
			SP.on('data',function(data){
				var buf=new Buffer(data)
					if(buf[0]==0x55){
						tmp=""
						var l=buf[2]
						var ol=buf[3]
						var totalExpectedLength=l+ol+6+1
						tmp=data
						if(buf.length==totalExpectedLength){
							var t= new Telegram()
							t.loadFromBuffer(buf)
							this.emit("data",t);
						}
					}else{
						tmp=Buffer.concat([tmp,data])
						buf=new Buffer(tmp)
						var l=buf[2]
						var ol=buf[3]
						var totalExpectedLength=l+ol+6+1
						if(buf.length==totalExpectedLength){
							var t= new Telegram()
							t.loadFromBuffer(buf)
							this.emit("data",t);
						}
					}
				}.bind(this));
			}.bind(this));
		}
	this.send = function(tel){
		var buf1=new Buffer(tel,"hex")
		SP.write(buf1)
	}
}

SerialPortListener.prototype.__proto__ = EventEmitter.prototype;	
module.exports = new SerialPortListener()