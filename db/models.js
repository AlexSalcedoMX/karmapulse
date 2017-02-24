var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var busquedaSchema = new Schema ({
	identificador: String,
	descripcion: String,
	inicio : Date,
	termino : Date,
	trabajo : String,
	canal : String,
	end_type: String,
	limit_value: Number,
	limit: Boolean,
	interpretes: [mongoose.Schema.Types.ObjectId],
	querys : mongoose.Schema.Types.ObjectId,
	tags : mongoose.Schema.Types.ObjectId,
	estado : String,
	tipo : String,
	fuente : String,
	created : Date,
	__v : Number,
	account_id : Number,
	owner_id : Number,
});

var tweetsSchema = new Schema({
	tweetId : String,
	queryId : String,
	verb : String,
	busquedaId : String,
	body : String,
	link : String,
	postedTime : Date,
	usuario : { preferredUsername : String, verified : Boolean, followersCount : Number, statusesCount : Number, displayName : String, link : String, friendsCount : Number, image : String},
	aplicacion : String,
	locacion : Object,
	hashtags : [String],
	imagenes : [String],
	urls : [String],
	menciones : [String],
	interpretaciones : [String]
});

module.exports.Busqueda = mongoose.model('busqueda',busquedaSchema);
module.exports.Tweets = mongoose.model('tweets',tweetsSchema);