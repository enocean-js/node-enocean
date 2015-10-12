var enocean      = require("../");  // require node-enocen


enocean.listen("/dev/ttyUSB0");     // start listening to the serialport

enocean.on("data",function(data){   // a telegram has been received
	console.log(data)               // log it to the console
});