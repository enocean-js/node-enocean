var enocean = require("../")();           // require node-enocean
var Button = require("../node_modules/node-enocean-button");           // require node-enocean

enocean.listen("/dev/ttyUSB0");              // open the serialport
enocean.on("ready",function(base){           // when ready

	var button = new Button(enocean,1)


	if(process.argv[2] == "on"){
		button.A1.click()
	}else{
		button.A0.click()	
	}
	setTimeout(function(){enocean.close()},200)
});