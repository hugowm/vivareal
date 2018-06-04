var Main = {
	limitPage : 5,
	currentPage : 1,
	filterOpened : false,
	lastLink : '',
	loading : {
		el : $("#loading"),
		on : function(txt){
			this.el.show().find("span").html(txt);
		}, 
		off : function(){
			this.el.hide();
		}
	},
	display : $("#display .anuncios"),

	configListerners : function(){
		$("#loadMore").click(function(){
			Main.loadAnuncios({page:Main.currentPage+1, clear:false, txtLoad:"carregando mais anúncios", keep:true})
		});
		$("#btnFilter").click(function(){
			if(Main.filterOpened){
				$("#filter").animate({height:"55px"});
				$("#filter ul").hide();
				$(this).find('i').addClass("fa-angle-double-down").removeClass("fa-angle-double-up");
				$(this).find('span').html("Filtros");
			} else {
				$("#filter").animate({height:"250px"});
				$("#filter ul").show();
				$(this).find('i').removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
				$(this).find('span').html("Esconder");
			}
			Main.filterOpened = !Main.filterOpened;
		});
		$("#idAnuncio").keyup(function(){
			if($(this).val().length > 0){
				$("#areaAnuncio, #quartosAnuncio, #banheirosAnuncio, #vlminAnuncio, #vlmaxAnuncio").prop('readonly', true).css("background", "#ccc");
			} else {
				$("#areaAnuncio, #quartosAnuncio, #banheirosAnuncio, #vlminAnuncio, #vlmaxAnuncio").prop('readonly', false).css("background", "#FFF");
			}
		});
		$("#areaAnuncio, #quartosAnuncio, #banheirosAnuncio, #vlminAnuncio, #vlmaxAnuncio").change(function(){
			Main.loadAnuncios({clear:true, id : false, squareMeters : $("#areaAnuncio").val(), beds : $("#quartosAnuncio").val(), baths : $("#banheirosAnuncio").val(), minprice : $("#vlminAnuncio").val(), maxprice: $("#vlmaxAnuncio").val(), page:1, txtLoad:"Filtrando anúncios"});
		});
	},

	loadAnuncios: function(defs){
		this.loading.on(defs.txtLoad);
		var link = "http://spotippos.vivareal.com/properties";

		if(defs.id){
			link += "/"+defs.id;
			$("#loadMore").hide();
		} else {
			$("#loadMore").show();
			if(defs.keep){
				link += Main.lastLink+"&page="+defs.page;
			} else {
				defs.squareMeters = (defs.squareMeters) ? defs.squareMeters : '';
				defs.beds = (defs.beds) ? defs.beds : '';
				defs.baths = (defs.baths) ? defs.baths : '';
				defs.minprice = (defs.minprice) ? defs.minprice : '';
				defs.maxprice = (defs.maxprice) ? defs.maxprice : '';
				link += "?squareMeters="+defs.squareMeters+"&beds="+defs.beds+"&baths="+defs.baths+"&minprice="+defs.minprice+"&maxprice="+defs.maxprice+"&page="+defs.page+"&limit="+Main.limitPage;
				Main.lastLink = "?squareMeters="+defs.squareMeters+"&beds="+defs.beds+"&baths="+defs.baths+"&minprice="+defs.minprice+"&maxprice="+defs.maxprice+"&limit="+Main.limitPage;
			}
		}

		var data = $.getJSON(link).done(function() {
	   		var props = (defs.id) ? data.responseJSON : data.responseJSON.properties;
	   		var qntidade = (defs.id) ? 1 : props.length;
	   		var nLi = "";
	   		for(var i = 0; i < qntidade; i++){
	   			var dt = (defs.id) ? props : props[i];
		   		nLi += '<li>'
						+'<div class="image">'
							+'<div class="price">R$'+Main.formatReal(dt.price)+'</div>'
						+'</div>'
						+'<div class="description">'
							+'<div class="idt">ID. '+dt.id+'</div>'
							+'<h3>'+dt.title+'</h3>'
							+dt.description
							+'<div class="features">'
								+'<ul>'
									+'<li>'+dt.squareMeters+'²</li>'
									+'<li>'+dt.beds+' quartos</li>'
									+'<li>'+dt.baths+' banheiros</li>'
								+'</ul>'
								+'<button class="btViewAd">visualizar anúncio</button>'
							+'</div>'
						+'</div>'
					+'</li>';
			}
			if(defs.clear){
				Main.display.html(nLi);
			} else {
				Main.display.append(nLi);
			}
			if(qntidade == 0){
				Main.display.html("<li class='notFound'>Nenhum anúncio encontrado.</li>");
			}
	   		Main.loading.off();
	  	});
	}, 
	formatReal : function(n){
	    var n = n.toString();
	    var r = '';
	    var x = 0;
	    for (var i = n.length; i > 0; i--) {
	        r += n.substr(i - 1, 1) + (x == 2 && i != 1 ? '.' : '');
	        x = x == 2 ? 0 : x + 1;
	    }
	    return r.split('').reverse().join('')+',00';
	},
	init: function(){
		this.configListerners();
		this.loadAnuncios({page:Main.currentPage, txtLoad: "carregando anúncios"});
	},
}

window.onload = function(){
	Main.init();
}