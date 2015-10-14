var enocean      = require("../");           // require node-enocean

enocean.listen("/dev/ttyUSB0");              // open the serialport
enocean.on("ready",function(base){           // when ready

	var dimmer = new enocean.Dimmer(2)
	dimmer.speed="50"
	switch(process.argv[2]){
	case "teach":
		dimmer.teach();
	break;
	case "off":
		dimmer.off();
	break;
	default:
		dimmer.setValue(process.argv[2]);
	break;
	}
	setTimeout(function(){enocean.close()},200)
})