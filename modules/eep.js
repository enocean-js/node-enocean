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
var eep = []
// RPS
eep.push(require("./eep/eep-f6-02-03.js"))
// 1BS
eep.push(require("./eep/eep-d5-00-01.js"))
//  4BS
eep.push(require("./eep/eep-a5-02-xx.js"))
eep.push(require("./eep/eep-a5-02-10bit.js"))
eep.push(require("./eep/eep-a5-04-xx.js"))
eep.push(require("./eep/eep-a5-04-10bit.js"))
eep.push(require("./eep/eep-a5-05-01.js"))
eep.push(require("./eep/eep-a5-06-01.js"))
eep.push(require("./eep/eep-a5-06-02.js"))
eep.push(require("./eep/eep-a5-06-03.js"))
eep.push(require("./eep/eep-a5-11-02.js"))
eep.push(require("./eep/eep-a5-07-01.js"))
eep.push(require("./eep/eep-a5-09-04.js"))
module.exports = eep
