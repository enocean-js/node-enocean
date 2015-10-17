var enocean      = require("../")();           // require node-enocean
var Dimmer      = require("../node_modules/node-enocean-dimmer"); 
enocean.listen("/dev/ttyUSB0");              // open the serialport

enocean.on("ready",function(){           // when ready
	var dimmer = new Dimmer( enocean , 2 )
	dimmer.speed = "01"
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
	enocean.close()
})