# node-enocean
an enocean implementation for node.js   
this is still in beta but the interface is somewhat stable now.    
there may still be breaking changes before 1.0.

## installation
```
npm install node-enocean
```
## receiving telegrams
the enocean object is an event emitter. it emits events for all kinds of things taht may happen.
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
to make a sensor know you bring the enocean object into a lerning state by calling `.startLearning()`
When a teach in telegram is received while the object is in the learning state, and the sensor is successfully learned, a "learn" event is fired.

```
enocean.startLearning()
enocean.on("learn",function(data){   
	console.log(data) 
});
```
the learning phase stops after a confugurable timeout. the default is 60 seconds.
during runtime you can change this timeout with `enocean.timeout=30`

you can extract the value of a temperature sensor with a temperature range of -20 to +60 °C.

## sending Data

sending data can be done in raw form. just pass a string to the send function.   

`enocean.send("5500010005700838")`

for sending Data the base address is needed. You don't have to care about it though, because its handled automaticly for you. If you are interrested in the details see "sending Data" in the wiki.


to make it easier to send Data, there are seperate modules that implement certain EEPs. The following modules are currently available.

* [node-enocean-button](https://github.com/Holger-Will/node-enocean-button)
* [node-enocean-dimmer](https://github.com/Holger-Will/node-enocean-dimmer)

to find out how to use them, see the examples in the example folder here or in the other modules repository.
