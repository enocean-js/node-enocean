# node-enocean
an enocean implementation for node.js
##installation
```
npm install node-enocean
```
##usage
```
var enocean      = require("../");  
enocean.listen("/dev/ttyUSB0"); 
enocean.on("data",function(data){   
	console.log(data) 
});
```
