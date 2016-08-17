// 	   This file is part of node-enocean.

//     node-enocean. is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     node-enocean. is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with node-enocean.  If not, see <http://www.gnu.org/licenses/>.

var SerialPort   = require( "serialport" ).SerialPort
var EventEmitter = require( 'events' ).EventEmitter
var fs           = require( "fs" )
var Telegram     = require( "./modules/telegram.js" )
var crc          = require( "./modules/crc.js" )
var Memory       = require( "./modules/memory.js" )
var eepDesc      = require("./modules/eepDesc.js")

function SerialPortListener( config ) {
	// read the config object passed to the constructor. fill the non existin fileds with defaults
	this.timeout        = config.timeout ? config.timeout : 60 // set the timeout for tech in and forget auto mode to 60 s if not otehrwise specified
	this.configFilePath = config.configFilePath ? config.configFilePath : __dirname + "/config.json" // use the default config file. its recommended to use your own especially when hacking on this module.
	this.sensorFilePath = config.sensorFilePath ? config.sensorFilePath : __dirname + "/modules/knownSensors.json" // same goes for the sensor file in which learnd sensors are stored

	var configFile      = require(this.configFilePath) // load the config file
	this.base           = configFile.base // load the base address stored in the config file. It should be initialized with "00000000"

	var serialPort      = null // pointer to the serialport object
	var tmp             = null // tmp hold parts of uncomplete telegrams

	this.crc            = crc  // pointer to the module for calculatimg checksums. Its only used externaly and is just a helper for external modules, because we are not generating telegrams here
	var state           = ""   //part of the getBase Hack. Sometimes the call to get base does not return a response. state is used to repeat the process until we have a base address
	// the eepResolvers used to extract data from known sensors. you can push your own handlers here
	this.eepResolvers   = require("./modules/eep.js")
	// eepDesc is an Array with Description of all eeps and eep funcs used to look up description (in plain english)
	this.eepDesc        = eepDesc
	// an array of emmiter, all events emitted are emitted on all emitters. start with self, but you can push your own emitters here.
	// for example: add a socket.io object to this array, to have all events automaticly forwarded to the browser.
	this.emitters       = [ this ]
	// used to close the serial port. usefull for CLI inerfaces or tests
	this.close          = function( callback ) {
		serialPort.close( callback )
	}

	this.listen         = function(port){
		// open the serial port
		// use /dev/ttyUSBx for USB Sticks
		// use /dev/ttyAMA0 for enocean pi
		// use /dev/COM1 for USB Sticks on Windows
		serialPort      = new SerialPort( port , { baudrate: 57600 } )
		serialPort.on( "open" , function( ) {
			// when the serial port successfully opend
			this.mem    = new Memory( this , { sensorFilePath : this.sensorFilePath } ) // initialize the Memory implementation used for learning an forgetting sensors. all meaningfull events are emitted there
			if( configFile.base === "00000000" || !configFile.hasOwnProperty( "base" ) ) { // if we dont know the base address yet
				this.getBase( ) // get the base address from the attached device
			} else { // if we know the base address
				state   = "ready" // part of the getBase Hack
				this.emitters.forEach( function( emitter ) {
					emitter.emit( "ready" ) // emit the ready event. we are now ready to receive and send telegrams
				} )
			}
			serialPort.on( 'data' ,function( data ) {
				// when recieving data from the serialport, we dont receive complete telegrams, but jsut chuck of them.
				var buf    = new Buffer( data ) // store the chung we just got in a buffer
				if( buf[ 0 ] == 0x55 ) {  // we are at the beginning of a telegram
					tmp                     = ""
					var length              = 255 * buf[ 1 ] + buf[ 2 ]  // the length of the data part
					var optionalLength      = buf[ 3 ] // optional length
					var totalExpectedLength = length + optionalLength + 6 + 1 // total lengh of package (+6 header length, +1 crc checksum)
					// there is still the remote chance that we receive the starbyte, but not the complete header.
					// TODO: find out how to handle these cases
					tmp = data // store the telegram in a temporary variable
					if( buf.length == totalExpectedLength ) { // if we receive the complete telegram in one go.
						this.receive( buf ) // handle the receiving of the telegram
					}
				}else{
					// We are in the middle of a telegram. there should be something in the tmp buffer already. if not skip all data until wi get a header
					if( tmp != null ) { // if we already have received some parts
						tmp                     = Buffer.concat( [ tmp , data ] ) // concatenate the buffers
						buf                     = new Buffer( tmp ) // to a new Buffer
						var length              = 255 * buf[ 1 ] + buf[ 2 ] // the length of the data part
						var optionalLength      = buf[ 3 ] // optional length
						var totalExpectedLength = length + optionalLength + 6 + 1  //total lengh of package (+6 header length, +1 crc checksum)
						if( buf.length == totalExpectedLength ) { //if we receive the complete telegram , fill the data structure with it
							this.receive(buf) // handle the receiving of the telegram
						}
					}
				}
			}.bind( this ) ) // bind "this" to the enocean object
		}.bind( this ) ) // bind "this" to the enocean objec
	}

	this.receive     = function( buf ) {
		// handle the receiving of telegrams. this can be used to simulate the recieving part... good for testing ;-)
		var telegram = new Telegram( ) // create a new telegram
		telegram.loadFromBuffer( buf ) // and fill it with the datat from the Buffer
		this.emitters.forEach( function( emitter ) {
			emitter.emit( "data" , telegram ) // tell everyone we've got a telegram
		} )
		if( telegram.packetType == 2 ) {
		// handle getting the base address. if we request request the base address from our device, it response with a telegram of type 2
		// the telegram implemetation has already extracted the address.
			if( telegram.hasOwnProperty( "base" ) ) { // if this Response holds our base address
				this.base       = telegram.base // make it globaly available
				configFile.base = telegram.base // write to the config file
				fs.writeFile( this.configFilePath , JSON.stringify( configFile , null , 4 ), function( err ) {
    				if(err) {
    					// error saving config file
    				} else {
    					// when the file was successfully saved
    					state = "ready" // part of the get Base Hack
    					this.emitters.forEach( function( emitter ) {
    						// emit the ready event. when we start listening and we dont know the base address, the ready event is not fired. so do it here.
    						// but remember that every call to getBase also emits "ready"
							emitter.emit( "ready" )
    						emitter.emit( "base" , telegram.base ) // also fire the base event to everyone. also propagete the base address
						} )
   			 		}
				}.bind( this ) ) // bind "this" to the enocean object
			}
			this.emitters.forEach( function( emitter ) {
				emitter.emit( "response" , telegram ) // emit all other response telegrams to everyone
			} )
		}
	}.bind( this )

	this.send = function( msg ) {
		// very simple send implemetation. expects a string (hex)
		try{
			var buf1 = new Buffer( msg , "hex" ) // turn msg into a Buffer
			serialPort.write( buf1 ) // write it to the serial port
			this.emitters.forEach( function( emitter ) {
				emitter.emit( "sent" , msg ) // emit a sent event when we where able to sen something. does not mean the sending itself was successful though
			} )
		}catch(err){
			this.emitters.forEach( function( emitter ) {
				emitter.emit( "sent-error" , { err : err , msg : msg } ) // emit en error whe somthing went wrong
			} )
		}
	}
	this.sendAsync = function( msg ) {
			// very simple send implemetation. expects a string (hex)
			var p = new Promise(function(resolve,reject){
				try{
					var buf1 = new Buffer( msg , "hex" ) // turn msg into a Buffer
					serialPort.write( buf1 , function(err){
							if(err){reject(err)}else{resolve()}
					}) // write it to the serial port
					this.emitters.forEach( function( emitter ) {
						emitter.emit( "sent" , msg ) // emit a sent event when we where able to sen something. does not mean the sending itself was successful though
					} )
				}catch(err){
					this.emitters.forEach( function( emitter ) {
						emitter.emit( "sent-error" , { err : err , msg : msg } ) // emit en error whe somthing went wrong
					} )
				}

			}.bind(this))
			return p

		}
	this.getBase = function(){
		// code to get the base address ( 55 0001 00 05 70 08 38 )
		// 55   = startbyte
		// 0001 = datalength (data is only one Byte)
		// 00   = optionallength t
		// 05   = telegramtype (05 = Common Command)
		// 70   = header checksum
		// 08   = Command Code (08 = Read Base)
		// 38   = CRC of Data
		this.send( "5500010005700838" )
		// somtimes the controler does not returen the base address.
		// if the address is not know, this may cause the program to hang (ie. not fire the "ready" event)
		// to fix this, see if the ready event got fired after 1 second, if not fire request the base addres again.
		// this is a dirty hack i know... so what, it works ;-)
		setTimeout( function( ) {
			if( state !== "ready" ) this.send( "5500010005700838" )
		}.bind( this ) , 1000 )
	}

	this.getData = function( eep , data ) {
		// used to read data from known telegrams
		// can be used as a utilty externaly
		// eep is an eep as a string ( f.e. a5-03-02 )
		// data is the data part of a telegram as a string
		var ret = null // set return to null
		for( var i = 0 ; i < this.eepResolvers.length ; i++ ) { // loop through all eepResolvers
			 ret = this.eepResolvers[i]( eep , data ) // try to decode the data
			 if( ret !== null ) {
			 	return ret // if a resolver returns somthing other than null, we have an answer. return it and be done
			 	// if not try next.
			 }
		}
		// we obviuosly dont have an implementation for this eep yet. return an unknown value
		return [ {
			type : "unknown" ,
			unit : "unknown" ,
			value : "unknown"
		} ]
	}

	// a helper function
	this.pad = function ( num , size ) { // fill a string with leading zeros up to size
	    var s = "00000000000000000000000000000000" + num // maximum number of zero we need
	    return s.substr( s.length - size ) // cut to size
	}

	this.register = function( socket ) {
		// rergister for event emitters.
		// we are lsitening for the following events:
		socket.on( "start-learning" , this.startLearning ) // start learn mode
		socket.on( "start-forgetting" , this.startForgetting ) // start forget mode
		socket.on( "stop-learning" , this.stopLearning ) // stop learn mode
		socket.on( "stop-forgetting" , this.stopForgetting ) // stop forget mode
		socket.on( "send" , this.send ) // send data; expects a string as parameter
		socket.on( "learn" , this.learn ) // manualy learn/save/update a sensor description. expects a sensor description
		socket.on( "forget" ,this.forget ) // deletes a sensor
		socket.on( "get-all-sensors" , function( ) {
			socket.emit("all-sensors", this.getSensors( ) ) // returns a list of all known sensors to this one socket
		}.bind( this ) )
		socket.on( "get-sensor-info" , function( id ) {
			socket.emit("sensors-info", this.info( id ) ) // returns info for one single sensor
		}.bind( this) )
	}
}

SerialPortListener.prototype.__proto__ = EventEmitter.prototype // inherit from EventEmitter

module.exports = function( config ) {
	if( config == undefined) config = {} //if called with no config, pass an empty one
		return new SerialPortListener( config ) // return a constructor
	}
