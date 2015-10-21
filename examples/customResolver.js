var enocean = require("../")();  // require node-enocen
// You can add your own eep resolver.
// just push a function to the eepResolvers Array, thats accepts the two parameters eep and data
// it should return an array of json object. each json object should have the type,value and unit properties
// it should return null for all EEPs it can not handle.
enocean.eepResolvers.push( function(eep,data) {
	if( eep === "a5-99-99" ) {
		return [ 
			{
				type:"custom",value:"Hello World!"+data.substring(0,2),unit:""
			}
		]
	}
	return null
})
console.log(enocean.getData("a5-99-99","8003f001"))
