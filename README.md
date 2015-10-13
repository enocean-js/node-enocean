# node-enocean
an enocean implementation for node.js   
this is still in pre-alpha state, so don't expect too much ;-)
##installation
```
npm install node-enocean
```
##usage
```
var enocean      = require("node-enocean");  
enocean.listen("/dev/ttyUSB0"); 
enocean.on("data",function(data){   
	console.log(data) 
});
```
