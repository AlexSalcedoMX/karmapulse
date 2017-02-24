var mongoose = require('mongoose');
var parametros = require('../db/models.js');
var moment = require('moment');

module.exports = function(io){
	
	io.on('connection', function (socket) {

		parametros.Busqueda.aggregate([
		    { "$project": {
		    	"identificador" : '$identificador',
		        "initialDate": "$inicio",
		        "finalDate" : "$termino"
		    }}
		],function(err,res){
			socket.emit('inicio',res);
		});

		socket.on('cambioFechaMostrar',function(data){
			var inicio = moment.parseZone(data.inicio).utc().format('YYYY-MM-DD HH:mm:ss.sss'),
				termino = moment.parseZone(data.termino).utc().format('YYYY-MM-DD HH:mm:ss.sss');
			socket.emit('fechaInput',{'inicio':inicio,'termino':termino});
		});

		socket.on('validar',function(data){
			var valido = moment(data.fecha,'YYYY-MM-DD HH:mm:ss.sss',true).isValid();
			socket.emit('validado',{'fecha':valido,'id':data.id});
		});
	});
}