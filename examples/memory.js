var enocean = require("../")();

enocean.listen("/dev/ttyUSB0");

enocean.on("ready",function(){
	enocean.timeout=120
	enocean.startLearning()
})

enocean.on("known-data",async function(data){

	console.log("known Data:", data)
	console.log("last value:", await enocean.getLastValues( data.senderId))
})

enocean.on("unknown-data",function(data){
	console.log("unknown Data: ",data.rawByte)
})

enocean.on("unknown-teach-in",function(data){
	console.log("unknown teach in: ",data)
})

enocean.on("learn-mode-start",function(){
	console.log("press a teach in button on a device...")
})

enocean.on("learn-mode-stop",function(data){
	console.log("learning stoped: ",data.reason)
})

enocean.on("learned",function(data){
	console.log("learned: ",data)
})

enocean.on("forgotten",function(data){
	console.log("forgotten: ",data)
})
