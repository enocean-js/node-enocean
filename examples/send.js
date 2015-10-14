var enocean      = require("../");  // require node-enocen
var crc          = require("../crc.js")
enocean.listen("/dev/ttyUSB0"); 
enocean.on("ready",function(base){
	var button = new Button(parseInt(base,16),1)
	if(process.argv[2]=="on"){
		button.B0.click()
	}else{
		button.B1.click()	
	}
	setTimeout(function(){enocean.close()},200)
})





function Button(base,offset){
	this.head="55000707017a"
	this.adr=(base+offset).toString(16)
	this.B0={
		click:function(){
			this.B0.down()
			this.B0.up()
		}.bind(this),
		down:function(){
			var b1 = "f670"+this.adr+"3001ffffffffff00";
			b1+=crc(new Buffer(b1,"hex")).toString(16)
			enocean.send({raw:this.head+b1})
		}.bind(this),
		up:function(){
			var b2 = "f600"+this.adr+"3001ffffffffff00";
			b2+=crc(new Buffer(b2,"hex")).toString(16)
			enocean.send({raw:this.head+b2})
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
			enocean.send({raw:this.head+b1})
		}.bind(this),
		up:function(){
			var b2 = "f600"+this.adr+"3001ffffffffff00";
			b2+=crc(new Buffer(b2,"hex")).toString(16)
			enocean.send({raw:this.head+b2})
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
			enocean.send({raw:this.head+b1})
		}.bind(this),
		up:function(){
			var b2 = "f600"+this.adr+"3001ffffffffff00";
			b2+=crc(new Buffer(b2,"hex")).toString(16)
			enocean.send({raw:this.head+b2})
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
			enocean.send({raw:this.head+b1})
		}.bind(this),
		up:function(){
			var b2 = "f600"+this.adr+"3001ffffffffff00";
			b2+=crc(new Buffer(b2,"hex")).toString(16)
			enocean.send({raw:this.head+b2})
		}.bind(this)
	}
}





