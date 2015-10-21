var enocean      = require("../")();  // require node-enocen
enocean.eepResolvers.push(function(eep,data){
	if(eep==="a5-99-99") {
		return {
			type:"custom",value:"Hello World!"+data.substring(0,2)
		}
	}
	return null
})
console.log(enocean.getData("a5-99-99","8003f001"))
