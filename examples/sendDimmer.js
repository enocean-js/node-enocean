var enocean      = require("../");           // require node-enocean

enocean.listen("/dev/ttyUSB0");              // open the serialport
enocean.on("ready",function(base){           // when ready

	var dimmer = new enocean.Dimmer(2)
	if(process.argv[2]=="teach"){
		dimmer.teach();
	}else{
		dimmer.setValue(process.argv[2]);
	}
	setTimeout(function(){enocean.close()},200)
})