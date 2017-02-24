var socket = io.connect(window.location.origin);

var opciones;

socket.on('inicio',function(data){
	var opcionesDatos;
	opciones = data;
	for(var i = 0;i<data.length;i++){
		opcionesDatos += '<option value="'+data[i]._id+'">'+data[i].identificador+'</option>';
	}
	$('#opciones').html(opcionesDatos);
	socket.emit('cambioFechaMostrar',{'inicio':data[0].initialDate,'termino':data[0].finalDate});

});

socket.on('validado',function(data){
	if(!data.fecha){
		$('#'+data.id).addClass('advertencia');
		$('#advertencias').html('<p style = "color : red;"><strong>Ingrese fecha de '+data.id+' valida</strong></p>')
	}else{
		$('#'+data.id).removeClass('advertencia');
		$('#advertencias').empty();
		if($('#inicio').val() >= $('#termino').val()){
			$('#inicio').addClass('advertencia');
			$('#advertencias').html('<p style="color:red;"><strong>La fecha de inicio debe ser menor que la de termino</strong></p>');
		}else{
			$('#inicio').removeClass('advertencia');
			$('#advertencias').empty();
		}
	}

});

socket.on('fechaInput',function(data){
	$('#inicio').val(data.inicio);
	$('#termino').val(data.termino);
})

socket.on('fechaInput',function(data){

	$('#inicio').val(data.inicio);
	$('#termino').val(data.termino);
})


$('#opciones').change(function(){
	var inicio = opciones[$('#opciones').prop('selectedIndex')].initialDate,
		termino = opciones[$('#opciones').prop('selectedIndex')].finalDate;
	socket.emit('cambioFechaMostrar',{'inicio':inicio,'termino':termino});
	$('#advertencias').empty();
	$('#inicio').removeClass('advertencia');
	$('#termino').removeClass('advertencia');
})

$('#inicio').on('change',function(){
	socket.emit('validar',{'fecha':$('#inicio').val(),'id':'inicio'});
});

$('#termino').on('change',function(){
	socket.emit('validar',{'fecha':$('#termino').val(),'id':'termino'});
});


$('#generalTab').on('click',function(){
	route('general',function(data){
		if(data.tweets>0){
			$('#generalData').html('<div class="row">\
	                                <div class="col-md-12">\
	                                    <div class="col-md-2 polaroid">\
	                                        <img src="../public/img/twitter.png" class="img-responsive displayed">\
	                                        <h2 class="general">'+data.tweets+'</h2>\
	                                        <p class="textogeneral">Tweets totales</p>\
	                                    </div>\
	                                    <div class="col-md-2 col-md-offset-1 polaroid">\
	                                        <img src="../public/img/user.png" class="img-responsive displayed">\
	                                        <h2 class="general">'+data.usuarios+'</h2>\
	                                        <p class="textogeneral">Usuarios únicos</p>\
	                                    </div>\
	                                    <div class="col-md-2 col-md-offset-1 polaroid">\
	                                        <img src="../public/img/menciones.png" class="img-responsive displayed">\
	                                        <h2 class="general">'+data.menciones+'</h2>\
	                                        <p class="textogeneral">Menciones únicas</p>\
	                                    </div>\
	                                    <div class="col-md-2 col-md-offset-1 polaroid">\
	                                        <img src="../public/img/hashtags.png" class="img-responsive displayed">\
	                                        <h2 class="general">'+data.hashtags+'</h2>\
	                                        <p class="textogeneral">Hashtags únicos</p>\
	                                    </div>\
	                                </div>\
	                            </div>');
		}else{
			$('#generalData').html('<div><h4>No hay datos para mostrar en el rango de fechas indicado</h4></div>');
		}
	});
})

$('#usuarioActivoTab').on('click',function(){
	route('usuarioActivo',function(data){
		if(data.statusesCount>0){			
			$('#usuarioActivoData').html('<div class="row"><div class="col-md-3" ><img src="../public/img/default.png" class="img-responsive shadow displayed" /></div><div class="col-md-8 polaroid">\
	                                        <div class="media col-md-12"><div class="media-body"><h4 class="media-heading"><a href = "'+data.link+'" target="_blank">'+data.displayName+'</a></h4><h4><a href = "'+data.link+'" target = "_blank">@'+data.preferredUsername+'</a></h4><p style="padding: 10px 10px;font-size: 16px;">Fue el usuario más activo en la campaña,<br>realizando un total de <strong style="color:red;">'+data.statusesCount+'</strong> tweets sobre la busqueda.</p> </div></div></div></div>');
			$('#usuarioName').text(data.displayName);
			$('#usuarioName').attr('href',data.link);
			$('#usuarioPreferredName').text('@'+data.preferredUsername)
		}else{
			$('#usuarioActivoData').html('<div><h4>No hay datos para mostrar en el rango de fechas indicado</h4></div>');
		}
	});
})


$('#hashtagsTab').on('click',function(){
	route('hashtags',function(data){
		if(data.length>0){
			var listData = "";
			data.forEach(function(hashtags,index){
		        listData += '<li class="list-group-item"><span class="badge">'+hashtags.total+'</span><div style="text-align:left;"><a href="https://twitter.com/hashtag/'+hashtags._id+'" target="_blank">#'+hashtags._id+'</a> </div></li>'
			});

			$('#hashtagsData').html('<div class="col-md-6 col-md-offset-3"><ul class="list-group shadow">'+listData+'</ul></div>');
		}else{
			$('#hashtagsData').html('<div><h4>No hay datos para mostrar en el rango de fechas indicado</h4></div>');
		} 
	});
})


$('#tvsrtTab').on('click',function(){
	route('tvsrt',function(data){
		if(data.length>0){
			$('#tvsrtData').html('<div class="row"><div id="container" style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"></div></div>')
			Highcharts.chart('container', {
			    chart: {
			        plotBackgroundColor: null,
			        plotBorderWidth: null,
			        plotShadow: false,
			        type: 'pie'
			    },
			    title: {
			        text: 'Tweets originales Vs Retweets'
			    },
			    tooltip: {
			        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			    },
			    plotOptions: {
			        pie: {
			            allowPointSelect: true,
			            cursor: 'pointer',
			            dataLabels: {
			                enabled: true,
			                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
			                style: {
			                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
			                }
			            }
			        }
			    },
			    series: [{
			        name: 'Porcentaje',
			        colorByPoint: true,
			        data: data
			    }]
			});
		}else{
			$('#tvsrtData').html('<div><h4>No hay datos para mostrar en el rango de fechas indicado</h4></div>');
		}
	});
})


function route (url,cb){
	$.ajax({
		method :'GET',
		url : url,
		data : {id_busqueda:$('#opciones').val(),inicio:$('#inicio').val(),termino:$('#termino').val()},
	    success: function(data) {
		    cb(data);
	    },
		error: function (errMsg) {
	    	console.log(errMsg);
		}
	});	
}

