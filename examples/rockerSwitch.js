var enocean      = require("../");  // require node-enocen

enocean.listen("/dev/ttyUSB0");     // start listening to the serialport

enocean.on("data",function(data){   // a telegram has been received
	if(data.packetTypeString=="RPS" && data.state=="down") {
		console.log("Button "+ data.button+ " on Sensor "+ data.senderId +" was pressed")
	}
	if(data.packetTypeString=="RPS" && data.state=="up") {
		console.log("a Button on Sensor "+ data.senderId +" was released")
	}
});