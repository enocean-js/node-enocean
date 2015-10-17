var enocean      = require("../")();  // require node-enocen


enocean.listen("/dev/ttyUSB0");     // start listening to the serialport
enocean.on("ready", function(){
	enocean.learn({
		id:"002a1d44",
		eep: "f6-02-03",
		desc:"Switch",
		manufacturer:"Enocean GmbH"
	})
});

enocean.on("known-data",function(data){   // a telegram has been received
	console.log(data)
});
