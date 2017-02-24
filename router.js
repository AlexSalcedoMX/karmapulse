var consultas = require('./db/consultas')
module.exports = function  (app,moment) {


	app.get('/', function (req, res) {

  		res.render('index');

	});

	app.get('/general',function(req,res){
		req.query.inicio = new Date(req.query.inicio+' UTC'),
		req.query.termino = new Date(req.query.termino+' UTC');	
		if(req.query.id_busqueda && moment(req.query.inicio,'YYYY-MM-DDTHH:mm:ss.sssZ',true).isValid() && moment(req.query.termino,'YYYY-MM-DDTHH:mm:ss.sssZ',true).isValid()){
			if(req.query.inicio<req.query.termino){
				consultas.general(req.query,function(data){
					res.json(data);
				});
			}
		}else{
			res.end();
		}
	})

	app.get('/usuarioActivo',function(req,res){
		req.query.inicio = new Date(req.query.inicio+' UTC'),
		req.query.termino = new Date(req.query.termino+' UTC');	
		if(req.query.id_busqueda && moment(req.query.inicio,'YYYY-MM-DDTHH:mm:ss.sssZ',true).isValid() && moment(req.query.termino,'YYYY-MM-DDTHH:mm:ss.sssZ',true).isValid()){
			if(req.query.inicio<req.query.termino){
				consultas.usuarioActivo(req.query,function(data){
					res.json(data);
				});
			}
		}else{
			res.end();
		}
	});


	app.get('/hashtags',function(req,res){
		req.query.inicio = new Date(req.query.inicio+' UTC'),
		req.query.termino = new Date(req.query.termino+' UTC');		
		if(req.query.id_busqueda && moment(req.query.inicio,'YYYY-MM-DDTHH:mm:ss.sssZ',true).isValid() && moment(req.query.termino,'YYYY-MM-DDTHH:mm:ss.sssZ',true).isValid()){
			if(req.query.inicio<req.query.termino){
				consultas.hashtags(req.query,function(data){
					res.json(data);
				});
			}
		}else{
			res.end();
		}
	});


	app.get('/tvsrt',function(req,res){
		req.query.inicio = new Date(req.query.inicio+' UTC'),
		req.query.termino = new Date(req.query.termino+' UTC');	
		if(req.query.id_busqueda && moment(req.query.inicio,'YYYY-MM-DDTHH:mm:ss.sssZ',true).isValid() && moment(req.query.termino,'YYYY-MM-DDTHH:mm:ss.sssZ',true).isValid()){
			if(req.query.inicio<req.query.termino){
				consultas.tweetsvsRts(req.query,function(data){
					res.json(data);
				});
			}
		}else{
			res.end();
		}
	});

}

