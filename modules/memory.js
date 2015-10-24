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



//     # memory implementation.
//     this module implements saving and deleting sensors as well as hanbling telegrams from known sensor
//     this implementation uses the fiesystem to stor sensor info

var fs             = require("fs")
var knownSensors   = ""
module.exports     = function(app,config){
	if( config    == undefined) config = {} // check if this was called with a config or not
	// if a path to the sensorFile was provided use taht, otherwise use the default
	var outFile    = config.hasOwnProperty( "sensorFilePath" ) ? config.sensorFilePath : __dirname + '/knownSensors.json'
	knownSensors   = require( outFile ) // load the sensorFile
	app.learnMode  = "off"
	app.forgetMode = "off"

	app.on( "data" , function( data ) {
		if ( knownSensors.hasOwnProperty( data.senderId )) {
			//if sensor is known, extract the content of the Data Bits.
			if( data.learnBit === 1 || data.choice === "f6" ) {
				// but only if it is not a learn Telegram (learnBit==1)
				var sensor  = knownSensors[ data.senderId ] // get the sensor Info like the eep and manufacurer Info from the memory file
				data.sensor = sensor // aatch that info to the telegram data
				data.values = app.getData( sensor.eep , data.raw ) // actually extract the Data
				app.emitters.forEach(function(emitter){
					emitter.emit("known-data",data) // and emmit an event propagating the extracted Data downstream
				} )
				knownSensors[ data.senderId ].last = data.values // aatch the just extracted Data to the sensrFile Entry of this sensor
				fs.writeFile( outFile , JSON.stringify( knownSensors , null , 4 ) , function( err ) {} ) // and save it to disk
			} else {
				// if it is a learn telegram, check if we are in "teach in"-mode
				if( app.learnMode === "on" ) {
					// we are in teach in mode
					// And we have just received a "tech in" telegram...
					// but we allready know this sensor
					app.learnMode = "off" // turn of "teach in"-mode to prevent unwanted sensors to be tought in accedently
					app.emitters.forEach( function( emitter ) {
						emitter.emit( "learn-mode-stop" , { code : 1 , reason : "already known sensor" } ) // tell everyone that we stop the "teach-in"-mode
					} )
				}
				if( app.forgetMode === "on" ) {
					// we are in forget mode, and we received a "teach-in" telegram of a known sensor
					// this indicates that it should be forgotten.
					app.forget( data.senderId ) // delete the sensor
				}
			}
			if( app.forgetMode === "on" && data.choice === "f6" ) {
					// we are in forget mode, and we received an RPS telegram form a known sensor
					// but the learnBit is not set, as RPS telegramns don't have learnBits...
					// this indicates that it should be forgotten.
					app.forget( data.senderId ) // delete the sensor
				}
		} else {
		// ???? we don't know this sensor ???
			if( data.learnBit === 0 ) {
			// but it's a "teach in"-telegram, so it wants to tell us about itself 
				if( app.learnMode === "on" ) {
				// we are in learnMode, so extract the sensor info frm the telegram 
				// and save tha info 
					app.learn( {
						id           : data.senderId,
						eep          : data.eep,
						manufacturer : data.manufacturer,
						title        : "New " + app.eepDesc[data.eep.substring(0,5)],           // give it some name
						desc         : "I'm a new sensor...",  // and some description
						eepFunc      : app.eepDesc[data.eep.substring(0,5)], // finde the func description of the eep
						eepType      : app.eepDesc[data.eep]   // find the Type description of the eep
					} )
				} else {
					// we are not in teach in mode, but this is a "tech in" telegram
					if(data.choice !== "f6" ) {
					// "RPS" telegrams do not have a lernBit. depending on the Data Byte sometimes the Bit used for indicating "teach-in"-telegrams is set
					// prevent false positives
						app.emitters.forEach( function( emitter ) {
							emitter.emit( "unknown-teach-in" , data ) // tell everyone we received an unknown "teach-in"
						} )	
					}
				}
			} else {
				// we don't know the sender and the leranBit is not set
				if( data.choice === "f6" && app.learnMode === "on" ) { 
					// but this is an "RPS" signal ( remeber RPS don't have learn bits ), and we are in teach in mode
					// so treat every RPS received during teach in a a request to be tought in
					// do so...
					app.learn( {
						id           : data.senderId,
						eep          : "f6-02-03",
						manufacturer : "unknown",
						title        : "New RPS Switch",       // give it some name
						desc         : "I'm a new sensor...",  // and some description
						eepFunc      : app.eepDesc["f6-02"], // finde the func description of the eep
						eepType      : app.eepDesc["f6-02-03"]   // find the Type description of the eep
					} )
				} else {
					// we are not in learnMode and the sensor of this telegram is not known.
					// neither is this a learn telegram. 
					app.emitters.forEach( function( emitter ){
						emitter.emit( "unknown-data" , data ) // just tell everyone we received something, but we don't know what to do with it
					} )		
				}
			}
		}
	})

	app.startLearning = function( ) {
		// start learnMode ("tech-in"-mode)
		// the learn mode is here to automaticly learn sensors that send a teach in telegram
		app.learnMode = "on"
		app.emitters.forEach( function( emitter ) {
			emitter.emit( "learn-mode-start" , { timeout : app.timeout } ) // propagete that we are ready to learn
		} )	
		setTimeout( app.stopLearning , app.timeout * 1000 ) // make sure we stop learning after timeout
	}

	app.stopLearning       = function( ) {
		// stop learnMode
		if( app.learnMode == "on" ) {
			// but only if we are still in leranMode
			app.learnMode  =" off"
			app.emitters.forEach( function( emitter ) {
				emitter.emit( "learn-mode-stop" , { code : 2 , reason : "timeout" } ) // tell everyone we are not in teach in anymore
			} )
		}
	}

	app.startForgetting = function( ) {
		// start the forget mode
		// this is used to delete single sensors, through its teach in telegram.
		app.forgetMode  = "on"
		app.emitters.forEach( function( emitter ) {
			emitter.emit( "forget-mode-start" , { timeout : app.timeout } ) // tell everyone we are in forget-mode
		} )	
		setTimeout( app.stopForgetting , app.timeout * 1000 ) // make sure we leave stop mode after timeout
	}

	app.stopForgetting      = function( ) {
		// stop forget Mode
		if( app.forgetMode == "on" ) {
			// but only if we are in forget Mode
			app.forgetMode  = "off"
			app.emitters.forEach( function( emitter ) {
				emitter.emit( "forget-mode-stop" , { code : 2 , reason : "timeout" } ) // tell everyone we are not in forget mode anymore
			} )
		}
	}

	app.learn = function( sensor ) {
		// actually learn a sensor.
		// this function can be call from anywhwere.
		// the sensor object should have the following fileds: id,eep,manufacturer,title,desc
		// this can be used to update sensor info like desc and title...
		knownSensors[ sensor.id ] = sensor // save the sensor under its id
		app.learnMode = "off" // stop the learnMode in any case
		app.emitters.forEach( function( emitter ) { 
      		emitter.emit( "learn-mode-stop" , { code : 0 , reason : "success" } ) // tell everyone we are not in learn mode anymore
		} )
		fs.writeFile( outFile , JSON.stringify( knownSensors , null , 4 ) , function( err ) {
			// and actually save it to disc
    		if( err ) {
				app.emitters.forEach( function( emitter ) { 
      				emitter.emit( "learn-error" , { err : err, reason: "error saving sensor file to disk" } ) // there was an error saving the file
				} )
    		} else {
    			// the file was successfully saved
    			app.emitters.forEach( function( emitter ) { 
					emitter.emit( "learned" , sensor ) // let's tell everyone we where successfull attach the sensor info of the sensor we just saved
				} )
   			 }
		})
	}

	app.forget = function( id ) {
		// actuall delete a sensor by its id
		var tmp = "" 
		if( knownSensors.hasOwnProperty( id ) ) {
			tmp = knownSensors[ id ] // but befor we delete it, save the snsor info in a temporary variable
			delete knownSensors[ id ] // delete the sensor from the knownSensor object (in memory)
		}
		app.forgetMode="off" // stop forget Mode
		app.emitters.forEach( function( emitter ) {
			emitter.emit( "forget-mode-stop" , { code : 0 , reason:"success"} ) // and tell the "world" we stoped forget mode
		} )
		fs.writeFile( outFile , JSON.stringify( knownSensors, null, 4), function( err ) {
			// actually save the changes to disk
    		if(err) {
      			app.emitters.forEach( function( emitter ) { 
      				emitter.emit( "forget-error" , { err : err, reason: "error saving sensor file to disk" } ) // there was an error saving the file
				} )
    		} else {
				app.emitters.forEach(function(emitter){
					emitter.emit("forgotten",tmp) // let's tell everyone we where successfull, attach the sensor info of the just deleted sensor
				})
   			 }
		} )
	}

	app.info = function( id ) {
		// get info of a specific sensor
		return knownSensors[ id ]
	}

	app.getSensors = function( ) {
		// return all known sensors
		return knownSensors
	}
}

