// call this from the command line with command line parameters
// "node sendDimmer.js teach" to send a learn telegram to an eltako dimming module
// "node sendDimmer.js off" to switch of the Light
// "node sendDimmer.js 50" to dimm the light 50%. you can pass any value between 0 and 100
var enocean      = require( "../" )( ) // require node-enocean
var Dimmer       = require( "node-enocean-dimmer" ) 
enocean.listen( "/dev/ttyUSB0" ) // open the serialport

enocean.on( "ready" , function( ) {  
	var dimmer = new Dimmer( enocean , 2 )
	dimmer.speed = "01" // dimm very fast
	switch( process.argv[ 2 ] ) {
	case "teach" :
		dimmer.teach( ) // 
	break
	case "off":
		dimmer.off( )
	break
	default:
		dimmer.setValue( process.argv[ 2 ] )
	break;
	}
	enocean.close()
})