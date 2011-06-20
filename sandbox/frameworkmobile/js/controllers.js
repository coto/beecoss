
$L.registerView({
	"id"			: "home"	
	,"url"			: "/sandbox/frameworkmobile/views/home.html"
	,"controller"	: {
		preEffect: function($viewer) {

			if($L.$cursorIndex <= 0){
				$viewer.find(".l-back").remove();
			}
			$viewer.find('.menu li[view-id]').click(function(evt) {
				evt.preventDefault();
				newView = $(this).attr('view-id');
				$L.renderView(newView, {'effect': effectGlobal, 'error': 'console.log("Controller RenderView Message: No fue posible mostrar la vista '+newView+'");alert("Controller RenderView Message: No fue posible mostrar la vista '+newView+', inténtelo más tarde.");'});
			});
			$viewer.find('.no-history').click(function(evt) {
				evt.preventDefault();
				$L.renderView('nohistory', {'effect': effectGlobal, 'record': 'no'});
			});
			/********* Ajax Test ************/
			$viewer.find('#ajax_success').click(function(evt){
				evt.preventDefault();
				$L.ajax({
					 "url"		: "tests/ajax_success.py"
					,"success"	: function(data) {
						alert(data);
						console.log("Controller Message: Ajax Call Success");
					}
					,"error"	: function(ex) {
						console.log("¿? - This shouldn't have happened, id=sa01");
					}
				});
			});		
			
			$viewer.find('#ajax_error').click(function(evt){
				evt.preventDefault();
				$L.ajax({
					 "url"		: "tests/ajax_error.py"
					,"dataType"	: "json"
					,"type"		: "POST"
					,"success"	: function() {
						console.log("¿? - This shouldn't have happened, id=sa02");
					}
					,"error"	: function(ex) {
						console.log("Controller Message: Ajax Call Error. ex.getType=" + ex.getType);
						switch(ex.getType) {
							case 'Antaios.DTO.Auth.InvalidUserOrPasswordException':
								setTimeout(function() {alert('Nombre de usuario y/o contraseña inválidos');}, 500);
								return false;
							default:
								return true; //Execute the framework error
						}
					}
				});
			});		
			
			$viewer.find('#ajax_success-render_success').click(function(evt){
				evt.preventDefault();
				$L.ajax({
					 "url"		: "tests/ajax_success.py"
					,"type"		: "POST"
					,"success"	: function() {
						$L.renderView('render_success', {'effect': effectGlobal, 'error': 'console.log("Controller RenderView Message: No fue posible mostrar la vista render_success");alert("Controller RenderView Message: No fue posible mostrar la vista render_success, inténtelo más tarde.");'});
					}
					,"error"	: function(ex) {
						console.log("¿? - This shouldn't have happened, id=sa03");
					}
				});
			});		
			
			$viewer.find('#ajax_success-render_error').click(function(evt){
				evt.preventDefault();
				$L.ajax({
					 "url"		: "tests/ajax_success.py"
					,"type"		: "POST"
					,"success"	: function() {
						$L.renderView('render_error', {'effect': effectGlobal, 'error': 'console.log("Controller RenderView Message: No fue posible mostrar la vista render_error");alert("Controller RenderView Message: No fue posible mostrar la vista render_error, inténtelo más tarde.");'});
					}
					,"error"	: function(ex) {
						console.log("¿? - This shouldn't have happened, id=sa04");
					}
				});
			});		
		}
		,postEffect: function($viewer) {
		}
	}
});

goHome = function(evt) {
	evt.preventDefault();
	$L.renderView('home', {'effect': $L.effectBack});
}
/* Ajax Test */
$L.registerView({
	"id"			: "render_success"
	,"url"			: "/sandbox/frameworkmobile/views/render_success.py"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
			$viewer.find('.myself').click(function(evt) {
				evt.preventDefault();
				$L.renderView('render_success', {'effect': effectGlobal});
			});
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "render_error"	
	,"url"			: "/sandbox/frameworkmobile/views/render_error.py"
	,"controller"	: {
		preEffect: function($viewer) {
		}
		,postEffect: function($viewer) {
		}
	}
});

/******** Feature's Views ********/
$L.registerView({
	"id"			: "back-1"
	,"url"			: "/sandbox/frameworkmobile/views/back-1.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
			$viewer.find('#view-2').click(function(evt) {
				evt.preventDefault();
				$L.renderView("back-2", {'effect': effectGlobal});
			});
			$viewer.find('.no-history').click(function(evt) {
				evt.preventDefault();
				$L.renderView('nohistory', {'effect': effectGlobal, 'record': 'no'});
			});
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "back-2"
	,"url"			: "/sandbox/frameworkmobile/views/back-2.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
			$viewer.find('#view-3').click(function(evt) {
				evt.preventDefault();
				$L.renderView("back-3", {'effect': effectGlobal});
			});
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "back-3"
	,"url"			: "/sandbox/frameworkmobile/views/back-3.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "nohistory"
	,"url"			: "/sandbox/frameworkmobile/views/nohistory.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
			$viewer.find('#view-2').click(function(evt) {
				evt.preventDefault();
				$L.renderView("back-2", {'effect': effectGlobal});
			});
			$viewer.find('.no-history').click(function(evt) {
				evt.preventDefault();
				$L.renderView('nohistory', {'effect': effectGlobal, 'record': 'no'});
			});
		}
		,postEffect: function($viewer) {
		}
	}
});
/******** Feature's Views ********/
$L.registerView({
	"id"			: "slider"
	,"url"			: "/sandbox/frameworkmobile/views/slider.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "table"
	,"url"			: "/sandbox/frameworkmobile/views/table-toggle.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
			// DOMobject.tableToggle({'url': file.js, ['by' : 'x'|'y'] , ['x' : integer] , ['y' : integer] })
			source = '/sandbox/frameworkmobile/data/table_evaluations.js';
			$viewer.find('#tableEvaluations').tableToggle({'url': source});
			
		}
		,postEffect: function($viewer) {
			//  Big Table
			elm = $("#bigone");
			if($viewer.find('table tbody.data_content tr').size() > 0)
				return;

			table = $('<table border="1"></table>');
				table.append('<tr class="option" style="font-weight: bold; text-align: center; background-color: white;">')
				.append('<tbody class="data_content">');

			select=table.find('tr.option');
			content=table.find('tbody.data_content');


			$.getJSON(source, function(data){
				select.append('<td>&nbsp;</td>');
				$.each(data.Y, function(index, item){ // It's represented by SELECT
					select.append('<td>'+item+'</td>');
				});


				$.each(data.X, function(index, item){ // It's represented by ROW
					var itemName = $('<td style="font-weight: bold; text-align: center; background-color: white;">'+item+'</td>');
					var stack = "";
					$.each(data.data[index], function(i){
						stack = stack + '<td>'+data.data[index][i]+'</td>';
					});

					$('<tr id="'+index+'"></tr>').append(itemName).append(stack).appendTo(content);
				});
				elm.html(table);
			});
			
			// Show 
			$viewer.find('#bigtable').click(function(evt){
				evt.preventDefault();
				$("#bigone").toggle();
			});
			$("#bigtable").show();
			
		}
	}
});
$L.registerView({
	"id"			: "tabs"
	,"url"			: "/sandbox/frameworkmobile/views/tabs.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "map"
	,"url"			: "/sandbox/frameworkmobile/views/map.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
				var geocoder;
				var map;
				function flash(a, alert){
					$(".l-map-info .l-map-message").html(a).show();
					if(alert) {$(".l-map-info").addClass("alert");}
				}
				
				function initialize(address) {
					$(".l-map-info .l-map-message").html("").removeClass("alert").hide();
					geocoder = new google.maps.Geocoder();
					var latlng = new google.maps.LatLng(-34.397, 150.644);
					var myOptions = {
						zoom: 16,
						//center: latlng,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					}
					map = new google.maps.Map(document.getElementById("l-map-canvas"), myOptions);
					var infowindow = new google.maps.InfoWindow();

					geocoder.geocode( { 'address': address}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							map.setCenter(results[0].geometry.location);
							var marker = new google.maps.Marker({
								map: map, 
								position: results[0].geometry.location,
								title: address
							});
							infowindow.setContent("<div id='marker'><address>"+address+"</address></div>");
							infowindow.setPosition(results[0].geometry.location);
							flash(address, false);
							google.maps.event.addListener(marker, 'click', function() {
								infowindow.open(map, marker);
							});
						} else {
							if(navigator.geolocation) {
								browserSupportFlag = true;
								navigator.geolocation.getCurrentPosition(function(position) {
								initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
								if(address!="" && address!=undefined)flash("Dirección: ["+address+"] no encontrada en el mapa", true);
								map.setCenter(initialLocation);
								});
							} else {
								if(address!="" && address!=undefined)flash("Dirección: ["+address+"] no encontrada en el mapa", true);
							}
						}
					});
				}			
				
				initialize();
				
				$viewer.find('.l-map-search').click(function(){
					var field = $('.l-map-addresssearch');
					if (!field.hasClass('empty')){
						initialize(field.val());
					}
				});
		}
	}
});
$L.registerView({
	"id"			: "accordion"
	,"url"			: "/sandbox/frameworkmobile/views/accordion.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "item-desplegable"
	,"url"			: "/sandbox/frameworkmobile/views/item-desplegable.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "item-desplegable-select"
	,"url"			: "/sandbox/frameworkmobile/views/item-desplegable-select.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "buttons"
	,"url"			: "/sandbox/frameworkmobile/views/buttons.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "forms"	
	,"url"			: "/sandbox/frameworkmobile/views/forms.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
			$viewer.find('#form-button').click(function(evt){
				evt.preventDefault();
				serial = $L.formSerialize();
				virtualConsole = $viewer.find('#form-console');
				virtualConsole.html("<h3>data to send<h3>");
				for (e in serial){
					virtualConsole.append("<p>"+ e +" : "+ serial[e] + "</p>");
				}
			});
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "properties"
	,"url"			: "/sandbox/frameworkmobile/views/properties.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "titles"
	,"url"			: "/sandbox/frameworkmobile/views/titles-text.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "expanded-list"
	,"url"			: "/sandbox/frameworkmobile/views/expanded-list.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "rounded-list"	
	,"url"			: "/sandbox/frameworkmobile/views/rounded-list.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
$L.registerView({
	"id"			: "dial-phone"
	,"url"			: "/sandbox/frameworkmobile/views/dial-phone.html"
	,"controller"	: {
		preEffect: function($viewer) {
			$viewer.find('#homeButton').click(goHome);
		}
		,postEffect: function($viewer) {
		}
	}
});
