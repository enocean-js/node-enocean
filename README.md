# node-enocean
an enocean implementation for node.js   
this is still in alpha state, but we are moving slowly towards a more stable beta phase.    
there may still be breaking changes before 1.0 but the interface is getting mor stable every day.

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
The enocean object provides a lookup feature which you can use to extract information from a telegram with known eep. for example with

```
enocean.eep["f5-2-14"].getValue(data)
```

you can extract the value of a temperature sensor with a temperature range of -20 to +60 °C.

## sending Data
### getting the base address
to prevent telegram spoofing, you can not use every random address as sending signature. Instead every TCM-3xx device has a base adress, and you can use 128 adresses starting with the base adress. So if your base adress is aabbcc00 you can send with senderId aabbcc00 - aabbcc7f. To find out your base you can do `enocean.getBase()` for convienience a special event is fired as a response to getBase().     
**after getting your base address, you have to store it in the config.json file**
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
### actualy sending Data
sending data can be done in raw form. just pass a string to the send function.   
`enocean.send("5500010005700838")`
to make it easier to send Data, there are seperate modules that implement certain EEPs. The following modules are currently available.

* [node-enocean-button](https://github.com/Holger-Will/node-enocean-button)
* [node-enocean-dimmer](https://github.com/Holger-Will/node-enocean-dimmer)

to find out how to use them, see the examples in the example folder here or in the other modules repository.
