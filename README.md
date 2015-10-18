# node-enocean
an enocean implementation for node.js   
I would say that this is allmost feature complete. 
Now it must be tested extensively. I will add in some testing framework like mocha, but havn't decidet wich one yet. For 1.0 i will add more eep resolvers.

there may still be breaking changes before 1.0.

### changelog 0.7.0 

* implementation event emitter hook.
* bug fixes

### changelog 0.6.0 

* implementation of eep resolvers.
* bug fixes

## installation
```
npm install node-enocean
```
## receiving telegrams
the enocean object is an event emitter. it emits events for all kinds of things that may happen.
with the following code you can listen for any type of package.

```
var enocean      = require("node-enocean")();
enocean.listen("/dev/ttyUSB0"); 
enocean.on("data",function(data){   
	console.log(data) 
});
```

to only listen for known sensor data, use

```
enocean.on("known-data",function(data){   
	console.log(data) 
});
```

### teach in automaticly

to make a sensor known you have to bring the enocean object into a lerning state by calling `.startLearning()`
When a teach in telegram is received while the object is in the learning state, and the sensor is successfully learned, a "learn" event is fired.

```
enocean.startLearning()
enocean.on("learn",function(data){   
	console.log(data) 
});
```

see the example `memory.js` in the examples folder for more info.

the learning phase stops after a configurable timeout. the default is 60 seconds.
during runtime you can change this timeout with `enocean.timeout=30`

### teach in by hand

you can also change a learned sensor or add a new one by hand.

```
enocean.learn({
		id:"aabbccdd",
		eep: "f6-02-03",
		desc:"Switch",
		manufacturer:"Enocean GmbH"
	})
```
### teach in by editing the knownSensor File

alternatvely you can also hand edit the knownSensors.json file. By default its located at `./modules/knownSensors.json`.

### EEP Resolvers

the enocean object has a property called `.eepResolvers`. This is an array which holds functions that can handle specific EEPs. When a known Sensor is received, the eep is determined form the sensorFile. Then the databytes of the telegram are passed to each resolver function one after the other until one of them returns somthing other than `null`. The build in resolvers implement the following eep

* a5-02-xx
* a5-04-xx

more to come...   

you can easily implement your own eep handler, by adding a function to the .eepResolver array.

```
var enocean      = require("../")();  // require node-enocen
enocean.eepResolvers.push(function(eep,data){
	if(eep==="a5-99-99") {
		return {
			type:"custom",value:"Hello World!"
		}
	}
	return null
})
```

you can test you implementation by calling `enocean.getData` with your implemented eep and some testdata.

```
console.log(enocean.getData("a5-99-99","8003f001"))
```

## sending Data

sending data can be done in raw form. just pass a string to the send function.   

`enocean.send("5500010005700838")`

to make it easier to send Data, there are seperate modules that implement certain EEPs. The following modules are currently available.

* [node-enocean-button](https://github.com/Holger-Will/node-enocean-button)
* [node-enocean-dimmer](https://github.com/Holger-Will/node-enocean-dimmer)

to find out how to use them, see the examples in the example folder here or in the other modules repository.

### the base address

for sending Data the base address is needed. You don't have to care about it though, because its handled automaticly for you. If you are interrested in the details see "sending Data" in the wiki.

## the config object

the learned sensors are saved in the knownSensors.json file located in `./modules/knownSensors`
if you want to change the location of the file, you can pass a config object when creating the enocen object.
you can also change the location of the configFile and the timeout of the learning phase.

```
var enocean      = require("node-enocean")({
sensorFilePath:"/path/to/sensorfile"},
configFilePath:"/path/to/configFile"},
timeout:30
});
```
### the sensor file
the sensorFile can be an empty json file. your initial sensor file should look like this:
```
{}
```
### the config file
the configFile must contain a base address. If you dont know your base address, put "00000000" in. your initial configFile should look like this:
```
{
base:"00000000"
}
```
