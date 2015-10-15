var SerialPort   = require("serialport").SerialPort;
var EventEmitter = require('events').EventEmitter;
var Telegram     = require("./telegram.js");
var eep          = require("./eep.js")
var crc          = require("./crc.js")
var config          = require("./config.json")

function SerialPortListener(){
	var base=config.base;
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

						tmp=data;
						if(buf.length == totalExpectedLength){ //if we receive the complete telegram in one go, fill the data structure with it
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

	this.send = function(obj){
		if(obj.hasOwnProperty("raw")){
			var buf1 = new Buffer(obj.raw,"hex");
			serialPort.write(buf1);
		}
	}

	this.getBase = function(){
		this.send({raw:"5500010005700838"})
	}

	var parent=this;

	this.Dimmer=function (offset){
		this.parent=parent;
		this.head="55000a0701eb";
		this.adr=(parseInt(base,16)+parseInt(offset)).toString(16)
		this.speed="01"
		this.setValue=function(val){
			var value=pad(parseInt(val).toString(16),2)
			console.log(value)
			var b1="a502"+value+this.speed+"09"+this.adr+"3001ffffffffff00";
			b1+=pad(crc(new Buffer(b1,"hex")).toString(16),2)
			parent.send({raw:this.head+b1})
		}
		this.teach=function(){
			var b1="a502000000"+this.adr+"3001ffffffffff00";
			b1+=pad(crc(new Buffer(b1,"hex")).toString(16),2)
			parent.send({raw:this.head+b1})
		}
		this.off=function(){
			var b1="a502000008"+this.adr+"3001ffffffffff00";
			b1+=pad(crc(new Buffer(b1,"hex")).toString(16),2)
			console.log(b1)
			parent.send({raw:this.head+b1})
		}
	}

	this.Button=function (offset){
		this.parent=parent;
		this.head="55000707017a";
		this.adr=(parseInt(base,16)+parseInt(offset)).toString(16)
		this.B0={
			click:function(){
				this.B0.down()
				this.B0.up()
			}.bind(this),
			down:function(){
				var b1 = "f670"+this.adr+"3001ffffffffff00";
				b1+=crc(new Buffer(b1,"hex")).toString(16)
				parent.send({raw:this.head+b1})
			}.bind(this),
			up:function(){
				var b2 = "f600"+this.adr+"3001ffffffffff00";
				b2+=crc(new Buffer(b2,"hex")).toString(16)
				parent.send({raw:this.head+b2})
			}.bind(this)
		}
		this.B1={
			click:function(){
				this.B1.down()
				this.B1.up()
			}.bind(this),
			down:function(){
				var b1 = "f650"+this.adr+"3001ffffffffff00";
				b1+=crc(new Buffer(b1,"hex")).toString(16)
				parent.send({raw:this.head+b1})
			}.bind(this),
			up:function(){
				var b2 = "f600"+this.adr+"3001ffffffffff00";
				b2+=crc(new Buffer(b2,"hex")).toString(16)
				parent.send({raw:this.head+b2})
			}.bind(this)
		}
		this.A0={
			click:function(){
				this.A0.down()
				this.A0.up()
			}.bind(this),
			down:function(){
				var b1 = "f630"+this.adr+"3001ffffffffff00";
				b1+=crc(new Buffer(b1,"hex")).toString(16)
				parent.send({raw:this.head+b1})
			}.bind(this),
			up:function(){
				var b2 = "f600"+this.adr+"3001ffffffffff00";
				b2+=crc(new Buffer(b2,"hex")).toString(16)
				parent.send({raw:this.head+b2})
			}.bind(this)
		}
		this.A1={
			click:function(){
				this.A1.down()
				this.A1.up()
			}.bind(this),
			down:function(){
				var b1 = "f610"+this.adr+"3001ffffffffff00";
				b1+=crc(new Buffer(b1,"hex")).toString(16)
				parent.send({raw:this.head+b1})
			}.bind(this),
			up:function(){
				var b2 = "f600"+this.adr+"3001ffffffffff00";
				b2+=crc(new Buffer(b2,"hex")).toString(16)
				parent.send({raw:this.head+b2})
			}.bind(this)
		}
	}
}

SerialPortListener.prototype.__proto__ = EventEmitter.prototype;	
module.exports = new SerialPortListener();


function pad(num,size) {
    var s = "00000000000000000000000000000000" + num;
    return s.substr(s.length-size);
}
