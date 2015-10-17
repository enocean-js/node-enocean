# node-enocean
an enocean implementation for node.js   
this is still in beta but the interface is somewhat stable now.    
there may still be breaking changes before 1.0.

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
