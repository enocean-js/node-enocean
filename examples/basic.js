var enocean = require( "../" )();  // require node-enocen
// start listening on the serialport 
// if you use the enocean pi on a raspberry pi use:
// enocean.listen("/dev/ttyAMA0")
// on Windows use:
// enocean.listen("COM1") or whatever COM-port you are connected
enocean.listen( "/dev/ttyUSB0" ); 

enocean.on( "data" , function( data ) {   // a telegram has been received
	console.log( data )               // log it to the console
});
