# node-enocean
an enocean implementation for node.js  

full documentation, is (partly) available at the projects new homepage 

**[http://node-enocean.com](http://node-enocean.com/)**

>The EnOcean technology is an energy harvesting wireless technology used primarily in building automation systems, and is also applied to other applications in industry, transportation, logistics and smart homes. Modules based on EnOcean technology combine micro energy converters with ultra low power electronics, and enable wireless communications between batteryless wireless sensors, switches, controllers and gateways.    

[Wikipedia](https://en.wikipedia.org/wiki/EnOcean)

to find out whats new in the latest version see the [changelog](https://github.com/Holger-Will/node-enocean/wiki/Changelog)

for a full documentation of the interface visit the [wiki-page](https://github.com/Holger-Will/node-enocean/wiki/the-Enocean-Object) (Work In Progress)

for a fully functional server/client boilerplate see [node-enocean-server-template](https://github.com/Holger-Will/node-enocean-server-template)

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
When a sensor is successfully learned, a "learned" event is fired.

```
enocean.startLearning()
enocean.on("learned",function(data){   
	console.log(data)
});
```

the learning phase stops after a configurable timeout. the default is 60 seconds.
during runtime you can change this timeout with `enocean.timeout=30`

### teach in by hand

you can also change a learned sensor or add a new one by hand. **this only works after the ready event was fired.**

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

* f6-03-02
* d5-00-01
* a5-02-01
* a5-02-02
* a5-02-03
* a5-02-04
* a5-02-05
* a5-02-06
* a5-02-08
* a5-02-09
* a5-02-0A
* a5-02-0B
* a5-02-10
* a5-02-11
* a5-02-12
* a5-02-13
* a5-02-14
* a5-02-15
* a5-02-16
* a5-02-17
* a5-02-18
* a5-02-19
* a5-02-1A
* a5-02-1B
* a5-02-20
* a5-02-30
* a5-04-01
* a5-04-02
* a5-04-03
* a5-05-01
* a5-06-01
* a5-06-02
* a5-06-03
* a5-07-01
* a5-09-04
* a5-10-06
* a5-11-02
* a5-12-01
* a5-30-01
* d2-32-02

I will add more when i need them or find the time to add some random ones.
**if you need a specific eep that is currently not supported, just let me know. It will be a pleasure to add it.**

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

you can test you implementation by calling `enocean.getData` with your implemented eep and some test data.

```
console.log(enocean.getData("a5-99-99","8003f001"))
```

## sending Data

sending data can be done in raw form. just pass a string to the send function.   

`enocean.send("5500010005700838")`

there now is a `sendAsync` function which returns a promise. It therefor is thenable and yieldable so it works with frameworks like co. **It can be used with ES7 async/await.**
`sendAsync` returns after sending, successful receiving is not guaranteed

    async function test(){
      await enocean.sendAsync("5500010005700838")
    }

to make it easier to send Data, there are separate modules that implement certain EEPs. The following modules are currently available.

* [node-enocean-button](https://github.com/Holger-Will/node-enocean-button) sends Button states with the eep f6-03-02
* [node-enocean-dimmer](https://github.com/Holger-Will/node-enocean-dimmer) sends dimmer states compatible to eltako (similar to a5-38-09)
* [node-enocean-lightscene](https://github.com/Holger-Will/node-enocean-lightscene) sends both of the above plus a delay command in any combination.

to find out how to use them, see the examples in the example folder here or in the other modules repository.

### the base address

for sending Data the base address is needed. You don't have to care about it though, because its handled automatically for you. If you are interested in the details see "sending Data" in the wiki.
you can access your base address with `enocean.base`

## the config object

the learned sensors are saved in the knownSensors.json file located in `./modules/knownSensors`
if you want to change the location of the file, you can pass a config object when creating the enocean object.
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
the configFile must contain a base address. If you don't know your base address, put "00000000" in. your initial configFile should look like this:
```
{
base:"00000000"
}
```

special thanks for supporting this project:

* Collin Payne ([complyNC](http://www.complync.com/))
* Matteo Di Sabatino ([apio.cc](http://apio.cc))
* Rafael Kähm (https://github.com/RafaelKa)
