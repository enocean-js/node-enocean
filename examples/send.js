var enocean      = require("../");           // require node-enocean

enocean.listen("/dev/ttyUSB0");              // open the serialport
enocean.on("ready",function(base){           // when ready

	var button = new enocean.Button(1)
	if(process.argv[2]=="on"){
		button.B0.click()
	}else{
		button.B1.click()	
	}
	setTimeout(function(){enocean.close()},200)
})
