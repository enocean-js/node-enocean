var enocean      = require("../");  // require node-enocen
var knownSensors = {};              // array to store sensor Information

enocean.listen("/dev/ttyUSB0");     // start listening to the serialport

enocean.on("data",function(data){   // a telegram has been received
	if(knownSensors[data.senderId]!=undefined){ // only handle sensors we have previously leraned
		if(data.learnBit==1){
			var val=knownSensors[data.senderId].eep.getValue(data)
			console.log(val)
		}
	}
	if(data.learnBit==0){ // if the telegram is a learn telegram (learnbit=0) the it contains info about the sensor type (enocean eqipment profile (eep)) and the manufacturer of the device.
		knownSensors[data.senderId]={
			manufacturer:data.manufacturer,
			eepString:data.eep,
			eep:enocean.eep[data.eep] // use the lookup on the enocean object.
		}
		console.log("Sensor successfuly learned in. this is what i know about the sensor: \n",knownSensors[data.senderId]);
	}
});
