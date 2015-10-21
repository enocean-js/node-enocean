var enocean = require("../")(); 

enocean.listen("/dev/ttyUSB0"); 

enocean.on("ready",function(){
	enocean.startLearning()
})

enocean.on("known-data",function(data){
	console.log("known Data:", data)
})

enocean.on("unknown-data",function(data){
	console.log("unknown Data: ",data.rawByte)
})

enocean.on("unknown-teach-in",function(){
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