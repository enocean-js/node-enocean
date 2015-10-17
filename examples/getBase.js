var enocean      = require("../")();  
enocean.listen("/dev/ttyUSB0"); 
enocean.on("ready",function(data){   
	enocean.getBase()            
});
enocean.on("base",function(data){   
	console.log(data)  
	enocean.close()             
});
