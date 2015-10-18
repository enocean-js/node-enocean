var fs = require("fs")
var knownSensors = ""

module.exports=function(app,config){
	if(config==undefined) config={}
	var outFile = config.hasOwnProperty("sensorFilePath") ? config.sensorFilePath : __dirname + '/knownSensors.json'
	app.timeout= config.hasOwnProperty("timeout") ? config.timeout : 10
	knownSensors = require(outFile)
	app.learnMode = "off"
	app.on("data",function(data){
		if (knownSensors.hasOwnProperty(data.senderId)) {
			if(data.learnBit===1 || data.choice==="f6"){
				var sensor=knownSensors[data.senderId]
				data.sensor=sensor
				var da=app.getData(sensor.eep,data.raw)
				data.values=da
				app.emitters.forEach(function(emitter){
					emitter.emit("known-data",data)
				})	
			} else {
				if(app.learnMode==="on"){
					app.learnMode="off"
					app.emitters.forEach(function(emitter){
						emitter.emit("learn-mode-stop",{reason:"already know sensor"})
					})
				}
			}
		} else {
			if(data.learnBit===0){
				if(app.learnMode=="on"){
					app.learn({
						id:data.senderId,
						eep:data.eep,
						manufacturer:data.manufacturer,
						desc:"new sensor"
					})
				} else {
					// log the learn telegram for manual tech in
					if(data.choice!="f6"){
						app.emitters.forEach(function(emitter){
							emitter.emit("unknown-teach-in",data)
						})	
					}
				}
			} else {
				if(data.choice==="f6" && app.learnMode==="on"){
					app.learn({
						id:data.senderId,
						eep:"f6-02-03",
						manufacturer:"unknown",
						desc:"RPS switch"
					})
				}else{
					app.emitters.forEach(function(emitter){
						emitter.emit("unknown-data",data)
					})	
						
				}
			}
		}
	})
	app.startLearning=function(){
		app.learnMode="on"
		app.emitters.forEach(function(emitter){
			emitter.emit("learn-mode-start",{timeout:app.timeout})
		})	
		setTimeout(app.stopLearning,app.timeout*1000)
	}
	app.stopLearning=function(){
		if(app.learnMode=="on"){
			app.learnMode="off"
			app.emitters.forEach(function(emitter){
				emitter.emit("learn-mode-stop",{reason:"timeout"})
			})
		}
	}
	app.learn = function(sensor){
		knownSensors[sensor.id]=sensor
		fs.writeFile(outFile, JSON.stringify(knownSensors, null, 4), function(err) {
    		if(err) {
      			//console.log(err);
    		} else {
    			app.learnMode="off"
    			app.emitters.forEach(function(emitter){
					emitter.emit("learn",sensor)
      				emitter.emit("learn-mode-stop",{reason:"success"})
				})
   			 }
		})
	}
	app.forget = function(id){
		var tmp=""
		if(knownSensors.hasOwnProperty(id)){
			tmp=knownSensors[id]
			delete knownSensors[id];
		}
		fs.writeFile(outFile, JSON.stringify(knownSensors, null, 4), function(err) {
    		if(err) {
      			//console.log(err);
    		} else {
				app.emitters.forEach(function(emitter){
					emitter.emit("forget",tmp)
				})
      			
   			 }
		})
	}
	app.info = function(id){
		return knownSensors[id]
	}
	app.allSensors = knownSensors
}

