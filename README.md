# node-enocean
an enocean implementation for node.js   
this is still in alpha state, so don't expect too much ;-)
expect everything written here to break in the future, as the interface is not fixed yet.

## installation
```
npm install node-enocean
```
## receiving telegrams
you receive telegrams by listening for the "data" event. The enocean protocol is designed, in a way that prevents you from knowing what exact type of package you are looking at. What you can see is the the general packet type (0x01 in case of a radio telegram) and the ORG. there a in principle 3 ORGs: 1-Byte (1BS or RPS), 4-Byte(4BS) or variable length communication.    
with the following code you can listen for any type of package.

```
var enocean      = require("node-enocean");

enocean.listen("/dev/ttyUSB0"); 

enocean.on("data",function(data){   
	console.log(data) 
});
```
## eep
eep stands for enocean equipment protocol. The eep defines the content of specific telegram data bytes. to know which eep a given sensor or telegram belongs to, you have to recieve a learn telegram (or specify it yourself if you know the type of device). A learn telegram conains the func and type fields. together they form the specific eep of the device.  
if you recieve a learn telegram, the `data.eep` filed contains the recognized eep (if the sensor sends it. there are some sensors who don't). You can store this information and use it for future telegrams from the same sender.
there is a the enocean object provides a lookup feature which you can use to extract information from a telegram with known eep. for example with

```
enocean.eep["f5-2-14"].getValue(data)
```

you can extract the value of a temperature sensor with a temperature range of -20 to +60 °C.

## sending Data
to prevent telegram spoofing, you can not use any address as sending signature. Instead every TCM-3xx device has a base adress, and you can use 255 adresses starting with the base adress. So if your base adress is ff8abc00 you can send with senderId ff8abc00 - ff8abcff. To find out your base you can do `enocean.getBase()` for convienience a special event is fired as a response to getBase().

```
var enocean      = require("../");  
enocean.listen("/dev/ttyUSB0"); 
enocean.on("ready",function(data){   
	enocean.getBase()            
});
enocean.on("base",function(data){   
	console.log(data)  
	enocean.close()             
});
```

*you must put the base adress in config.json to be able to send data.*
If you have done so you can send button click events after the "ready" event got fired.

```
var enocean = require("../");           

enocean.listen("/dev/ttyUSB0");             
enocean.on("ready",function(base){          
	var button = new enocean.Button(1)
	if(process.argv[2]=="on"){
		button.B0.click()
	}else{
		button.B1.click()	
	}
	setTimeout(function(){enocean.close()},200)
});
```
A Button expects number which represents the offset to the base adress for initialization.
Then it provides two chanals (A and B) and two buttons for each chanal (A0,A1,B0,B1). every button can be pressed (.down()) lifted (.up()) or clicked(.click()).    
I'm currently thinking about implementing the sensors like buttons etc. in seperate modules as add-ons...
