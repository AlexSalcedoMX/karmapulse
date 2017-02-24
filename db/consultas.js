var models = require('../db/models');

module.exports.tweetsvsRts = function (data,cb) {
	var inicio = new Date(data.inicio);
	var termino = new Date(data.termino);
	inicio.toISOString();
	termino.toISOString();
	//models.Tweets.
	models.Tweets.aggregate(
		{
			$match:{
				$and:[
					{'busquedaId':data.id_busqueda},
					{'postedTime' : {'$gte' : inicio}},
					{'postedTime' : {'$lte' : termino}}
				]
			}
		},
		{
			$group:{
				_id:"$verb",
				total:{
					$sum:1
				},
			}

		}	,function(err,res){
		if(err){console.log(err)}
		else{
			if(res.length>0){
				var _total=0;
				var porcentajeOriginales=0;
				var porcentajeRts=0;

				for(var i=0;i<res.length;i++){
					_total+=res[i].total;
				}
				for(var i=0;i<res.length;i++){
					if(res[i]._id == 'post'){
						porcentajeOriginales = Math.round((res[i].total/_total)*100);
					}else{
						porcentajeRts = Math.round((res[i].total/_total)*100);
					}
				}
				cb([{name:'Originales','y':porcentajeOriginales},{name:'Retweets','y':porcentajeRts}]);
			}else{
				cb({'porcentajes':0});
			}
		}
	})
}






module.exports.hashtags = function(data,cb){
	var inicio = new Date(data.inicio);
	var termino = new Date(data.termino);
	inicio.toISOString();
	termino.toISOString();

	models.Tweets.aggregate(
		{
			$match:{
				$and:[
					{'busquedaId':data.id_busqueda},
					{'postedTime' : {'$gte' : inicio}},
					{'postedTime' : {'$lte' : termino}}
				]
			}
		},
		{
			"$unwind" : "$hashtags"
		},
		{
			$group:{
				_id:"$hashtags",
				total:{
					$sum:1
				}
			}
		},
		{
			$sort : { total : -1 }
		},
		{
			$limit:10
		}
	,function(err,hashtags){
		if(err){console.log(err)}
		else{
			cb(hashtags);
		}
	})
}





module.exports.usuarioActivo = function(data,cb){
	var inicio = new Date(data.inicio);
	var termino = new Date(data.termino);
	inicio.toISOString();
	termino.toISOString();

	models.Tweets.aggregate(
		{
			$match:{
				$and:[
					{'busquedaId':data.id_busqueda},
					{'postedTime' : {'$gte' : inicio}},
					{'postedTime' : {'$lte' : termino}}
				]
			}
		},
		{
			$group:{
				_id:"$usuario.preferredUsername",
				total:{
					$sum:1
				}
			}
		},
		{
			$sort : {total : -1}
		},
		{
			$limit:1
		}
	,function(err,res){
		if(err){console.log(err)}
		else{
			if(res.length>0){
				models.Tweets.findOne({'usuario.preferredUsername': res[0]._id},function(err,data){
					if(err){console.log(err)}
					else{
						data.usuario.statusesCount = res[0].total;
						cb(data.usuario);
					}
				})
			}else{
				cb({'statusesCount':0});
			}
		}
	})
}


module.exports.general = function(data,cb){
	var inicio = new Date(data.inicio);
	var termino = new Date(data.termino);
	inicio.toISOString();
	termino.toISOString();
	
	models.Tweets.find(
	{
	    $and:[
	        {'busquedaId':data.id_busqueda},
	        {'postedTime' : {'$gte' : inicio}},
	        {'postedTime' : {'$lte' : termino}}
	    ]   
	}).count(
	function(err,twt){
	    if(err){console.log(err)}
	    else{
	        if(twt>0){
	            //usuarios unicos
	            models.Tweets.aggregate(
	                {
	                    $match:{
	                        $and:[
	                            {'busquedaId':data.id_busqueda},
	                            {'postedTime' : {'$gte' : inicio}},
	                            {'postedTime' : {'$lte' : termino}}
	                        ]
	                    }
	                },

	                {
	                    $group:{
	                        _id : '$usuario.preferredUsername',
	                        count : {$sum : 1}
	                    }
	                }
	            ,function(err,usuarios){

	                if(err){console.log(err)}
	                else{
	                    //menciones menciones unicas
	                    models.Tweets.aggregate(
	                        {
	                            $match:{
	                                $and:[
	                                    {'busquedaId':data.id_busqueda},
	                                    {'postedTime' : {'$gte' : inicio}},
	                                    {'postedTime' : {'$lte' : termino}}
	                                ]
	                            }
	                        },
	                        {
	                            "$unwind" : "$menciones"
	                        },
	                        {
	                            $group:{
	                                _id:"$menciones",
	                                total:{
	                                    $sum:1
	                                }
	                            }
	                        }
	                    ,function(err,menciones){
	                        if(err){console.log(err)}
	                        else{
	                            //hashtags unicos
	                            models.Tweets.aggregate(
	                                {
	                                    $match:{
	                                        $and:[
	                                            {'busquedaId':data.id_busqueda},
	                                            {'postedTime' : {'$gte' : inicio}},
	                                            {'postedTime' : {'$lte' : termino}}
	                                        ]
	                                    }
	                                },
	                                {
	                                    "$unwind" : "$hashtags"
	                                },
	                                {
	                                    $group:{
	                                        _id:"$hashtags",
	                                        total:{
	                                            $sum:1
	                                        }
	                                    }
	                                }
	                            ,function(err,hashtags){
	                                if(err){console.log(err)}
	                                else{
	                                    var general = {'tweets':twt,'usuarios':usuarios.length,'menciones':menciones.length,'hashtags':hashtags.length}
	                                    cb(general);
	                                }
	                            });
	                        }
	                    });
	                }
	            });
	        }else{
	            //aqui va el cb de datos no encontrados
	            cb({'tweets':0});
	        }
	    }
	});
}