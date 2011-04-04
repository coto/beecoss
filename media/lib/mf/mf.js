(function (window, $) {
	/*
	 *	Estrategia que animar transiciones basada en la infraestructura de WebKit.
	 * */
	function WebkitEffectStrategy() {

		/* Posiciones en el stack */
		var TOP	= 30, CENTER = 20, BOTTOM = 10;
		
		/* El contenido actual se desplaza en el eje X y deja al descubierto el nuevo */
		function translateCurrentViewerX(newLeftValue, success) {
			translateCurrentViewer(newLeftValue, 0, success);
		}
		
		/* El contenido actual se desplaza en el eje Y y deja al descubierto el nuevo */
		function translateCurrentViewerY(newTopValue, success) {
			translateCurrentViewer(0, newTopValue, success);
		}
		
		/* Prepara los visores para el inicio de la traslación */
		function prepareTranslation(nextViewerPos, success, viewerToAnimate) {
			$L.$currentViewer.css({
				'webkitTransitionProperty'	:'none'
				, 'webkitTransform'			:'none'
				, 'zIndex'					: CENTER
				, 'top'						: 0
				, 'left'					: 0
			});
			$L.$nextViewer.css({
				'webkitTransitionProperty':'none'
				, 'webkitTransform'		  :'none'
				, 'top'		: nextViewerPos.top
				, 'left'	: nextViewerPos.left
				, 'zIndex'	: nextViewerPos.zIndex
			}).show();
			
			viewerToAnimate = viewerToAnimate || $L.$currentViewer;
			viewerToAnimate.one('webkitTransitionEnd', function() {
				$L.resetViewers(); success();
			});
		}
		
		function translateNextViewerY(initialTopValue, success) {
			var nextViewerPos = {'top':initialTopValue,'left':0,'zIndex': TOP};
			prepareTranslation(nextViewerPos, success, $L.$nextViewer);
			setTimeout(function() {
				var styles = {
					'webkitTransitionProperty'	: '-webkit-transform',
					'webkitTransitionDuration'	: '1s',
					'webkitTransform'			: 'translate3d(0px, ' + (-initialTopValue) + 'px, 0px)'
				};
				$L.$nextViewer.css(styles);
			},0);
		}
		
		/* Desplaza el contenido actual y el siguiente, dejando al descubierto el siguiente */
		function translateViewers(currentViewerNewLeftValue, success) {
			var nextViewerPos = {'top':0,'left':-currentViewerNewLeftValue,'zIndex':CENTER};
			prepareTranslation(nextViewerPos, success, $L.$nextViewer);
			setTimeout(function() {
				var currentViewerStyles = {
					'webkitTransitionProperty':'-webkit-transform',
					'webkitTransitionDuration':'1s',
					'-webkit-transform': 'translate3d(' + currentViewerNewLeftValue + 'px, 0px, 0px)'
				},
				nextViewerStyles = {
					'webkitTransitionProperty':'-webkit-transform',
					'webkitTransitionDuration':'1s',
					'-webkit-transform': 'translate3d(' + currentViewerNewLeftValue + 'px, 0px, 0px)'
				};
				
				$L.$currentViewer.css(currentViewerStyles);
				$L.$nextViewer.css(nextViewerStyles);
			},0);
		}
		
		/* Implementa desplazamiento de contenido en ambos ejes (X e Y) */
		function translateCurrentViewer(newLeftValue, newTopValue, success) {
			var nextViewerPos = {'top':0,'left':0,'zIndex':BOTTOM};
			prepareTranslation(nextViewerPos, success, $L.$currentViewer);
			setTimeout(function() {
				var styles = {
					'webkitTransitionProperty'	: '-webkit-transform',
					'webkitTransitionDuration'	: '1s',
					'webkitTransform'			: 'translate3d(' + newLeftValue + 'px,' + newTopValue + 'px, 0px)'
				};
				$L.$currentViewer.css(styles);
			},0);
		}
		
		/* Aplica la estrategia de efectos */
		this.apply = function(data, options, success) {
			options = options || this.DefaultEffectStrategyOptions;
			success = success || function() {};
			
			switch(options.effect) {
				case "toLeft":
					translateCurrentViewerX(-$L.$window.width(), success);
					break;
				case "toRight":
					translateCurrentViewerX($L.$window.width(), success);
					break;
				case "toBottom":
					translateCurrentViewerY($L.$window.height(), success);
					break;
				case "toTop":
					translateCurrentViewerY(-$L.$currentViewer.outerHeight(), success);
					break;				
				case "fromRight":
					translateViewers(-$L.$window.width(), success);
					break;
				case "fromLeft":
					translateViewers($L.$window.width(), success);
					break;
				case "fromTop":
					translateNextViewerY(-$L.$nextViewer.outerHeight(), success);
					break;
				case "fromBottom":
					translateNextViewerY($L.$window.height(), success);
					break;
				default:
					$L.$nextViewer.show();
					$L.resetViewers();
					success();
					break;
			};
		}
	};
		
	var $L = new function () {
		this.loginView = "login";
		this.userNotLoggedInException = "Antaios.DTO.Auth.NotLoggedInException";
		this.validationException = "Antaios.DTO.Validation.ValidationException";
		this.publicException = "Antaios.DTO.Exceptions.PublicException";
		this.loginEffectStrategy = "fromBottom";
		this.effectDuration = "slow";
		this.defaultEffectStrategyOptions = {'effect': 'none'};		
		this.minHeight = 430;
		this.currentView = {};
		this.oldView = {};
		this.caja;
		this.transitionBusy = false;
		this.currentController = {};
		this.views = {};
		this.controllers = {};
		this.controllersCache = {};
		this.items = {};
		this.$container = {};
		this.$currentViewer = {};
		this.$nextViewer = {};
		this.$loading = {};
		this.$window = $(window);
		this.$history = [];
		this.$cursorIndex;
		this.effectBack = "fromLeft";
		
		/* Shortcut para el registro de vistas y controladores.
		 * Asume que la vista y el controlador comparten el mismo ID. */
		this.registerView = function(parms) {
			parms.url 			= parms.url || "";
			parms.controller 	= parms.controller || {};
		
			this.controllersCache[parms.id] = parms.controller;
			this.views[parms.id] = {'url':parms.url, 'controller':parms.id};
		};
		
		this.transferElements = function() {
			$("input, select, textarea").each(function() {
				var $this = $(this), $original;
				if($this.attr("id").indexOf('_') == 0) {
					$original = $("#" + $this.attr("id").substring(1));
					if($original.length > 0) {
						if($original.val() == $original.attr("tip")) {
							$this.val("");
						} else {
							$this.val($original.val());
						}
					}
				}
			});
		};
	
		this.formSerialize = function() {
			var result = {};
			$("input, select, textarea").each(function() {
				var $this = $(this)
				, key = $this.attr("name")
				, value = $this.val()
				, type;
				
				if(value == $this.attr("tip")) {
					value = "";
				}
				
				type = $this.attr("type");
				if(typeof(type) == "undefined") 
					type="";
				else
					type=type.toLowerCase();
					
				if((type!="checkbox" && type!="radio") || $this.get(0).checked) {
					if(result[key]) {
						result[key]+= "," + value;
					} else {
						result[key] = value;
					}
				}
			});
			
			return result;
		};
		
		this.globalPreEffect = function($viewer) {
			var store='null', $tabbar, handlerSelection, viewBack;
			/*
			 * Funcionalidad que permite asignar label for 
			 */
			$viewer.find('label[for]').bind('click', function(i){
				var asign = $(this).attr('for');
				$viewer.find('input[id='+asign+']').focus();
			});
			/*
			 * Funcionalidad que permite discar numeros que se encuentren dentro de elementos con clase "l-dial"
			 * Atributo "call" contine el numero 
			 */
			$viewer.find('.l-dial').bind('click', function(i){
				call = $(this).attr('call');
				number_to_dial = (call != "" && call != undefined) ? call:$(this).text();
				if(number_to_dial != ""){
					window.location.href = "tel:"+number_to_dial;
				}
			});
			/*
			 * Funcionalidad que permite subir la pantalla con clase "l-top"
			 *  
			 */
			$viewer.find('.l-top').click(function(evt){
				evt.preventDefault();
				window.scrollTo(0,1);
			});
			/*
			 * Funcionalidad que permite volver a la vista anterior "l-back"
			 */
			$viewer.find('.l-back').click(function(evt){
				console.log("Call button called");
				$L.$cursorIndex = $L.$cursorIndex - 1;
				if($L.$cursorIndex < 0){
					$L.$cursorIndex = 0;
					alert("No existen elementos en el historial");
					return;
				}
				viewBack        = $L.$history[$L.$cursorIndex][0];
				viewBackOptions = $L.$history[$L.$cursorIndex][1];

				while(viewBackOptions.record == "no"){
					console.log("Exception: Controller " + viewBack.controller + " is " + viewBackOptions.record  + " recording");
					$L.$cursorIndex--;
					viewBack        = $L.$history[$L.$cursorIndex][0];
					viewBackOptions = $L.$history[$L.$cursorIndex][1];
				}
				viewBackOptions.effect = $L.effectBack;
				viewBackOptions.transition = "back";
				if (viewBack != undefined) {
					$L.renderView(viewBack.controller, viewBackOptions);
				}
			});
			/*
			 * tableToggle(): Funcionalidad de Table con Toggle
			 * DOMobject.tableToggle({'url': file.js, ['by' : 'x'|'y'] , ['x' : integer] , ['y' : integer] })
			 */
			$.fn.tableToggle = function(args){
				var elm, table, by, x, y;
				options = jQuery.extend({
					'by': 'x',
					'x' : 0,
					'y' : 0,
					'debug' : false
				}, args);
				by = options.by;
				x = options.x;
				y = options.y;
				if(args.url.lenght < 1)
					return;
				elm = $(this);
					elm.addClass('l-tableToggle');
					elm.html('<h3 class="l-loadingTable">loading...</h3>');
				table = $('<div></div>');
					table.append('<h3 class="title">')
					.append('<select class="option">')
					.append('<ul class="data_content">');
				title=table.find('h3.title');
				select=table.find('select.option');
				content=table.find('ul.data_content');
				
				if (store == 'null') {
					$.getJSON(options.url, function(data){
						store = data;
						exec(store);
					});
				}
				else{
					exec(store);
				}
				function exec(data){
					data_one = (by == "x")?data.X:data.Y;
					data_two = (by == "x")?data.Y:data.X;
					if(typeof(data.title) != "undefined")
						title.text(data.title);
					$.each(data_one, function(index, item){ // It's represented by SELECT
						if(by=='x')
							selected=(index==x)?'selected="selected"':'';
						else
							selected=(index==y)?'selected="selected"':'';
						select.append('<option value="'+index+'" '+selected+'>'+item+'</option>');
					});

					$.each(data_two, function(index, item){ // It's represented by ROW
						var itemName = $('<span class="key">'+item+'</span>')
							.bind("click", function(e){
								if(by=='x'){
									y=$(this).parent().attr('id');
									by='y';
								}
								else{
									x=$(this).parent().attr('id');
									by='x';
								}
								elm.tableToggle({'url': args.url, 'by':by, 'x':x , 'y': y });
							});
						if(by=='x')
							y=index;
						else
							x=index;
						$('<li id="'+index+'"></li>').append(itemName).append('<span class="value">'+data.data[x][y]+'</span>').appendTo(content);
					});
					
					select.bind('change', function(evt){
						if(by=='x')
							x=$(this).val();
						else
							y=$(this).val();
						elm.tableToggle({'url': args.url, 'by':by, 'x':x, 'y':y });
					});
					elm.html(table);
				}
			}
			/*
			 * Permite dar funcionalidad a un slider
			 */
			$.fn.pointerSlider = function(args){
				options = jQuery.extend({
					debug: false
				}, args);
				if($(this).length < 1)
					return;
				var slide = $('<div class="l-slide"><span class="l-pointer"></span></div>')
				, minus = $('<span class="l-minus">-</span>')
				, value = $('<span class="l-value"></span>')
				, more = $('<span class="l-more">+</span>')
				, controllers = $('<div class="l-slideControls"></div>')
				, elm, pointer, bar;
				
				controllers.append(minus)
					.append(value)
					.append(more);
				
				elm = $(this);
					elm.append(slide)
					.append(controllers);
				pointer = $(this).find('.l-pointer')
				bar = $(this).find('.l-slide');
				
				max_width = $('body').css('width').replace(/px$/, '');
				pointer_width = pointer.css('width').replace(/px$/, '');
				left = (max_width/2)-(pointer_width/2);
				value.text(left + "|" + max_width);
				pointer.css('left', left+'px');
				
				bar.bind("touchstart", function(evt) {
					evt.preventDefault();
					var orig = evt.originalEvent;
					left = orig.changedTouches[0].pageX;
					value.text(left);
					pointer.css('left', left+'px');
				})
				
				minus.click(function(evt){
					evt.preventDefault();
					if(left > 0){
						left = left - 10;
						value.text(left);
						//pointer.css({'-webkit-transform': 'translateX('+cursor*10+'px)'});
						pointer.css('left', left+'px');
					}
				});
				more.click(function(evt){
					evt.preventDefault();
					if(left < max_width-pointer_width){
						left = left + 10;
						value.text(left);
						//pointer.css({'-webkit-transform': 'translateX('+cursor*10+'px)'});
						pointer.css('left', left+'px');
					}
				});
			}
			
			/*
			 * Permite dar estilos a un menu tabbar horizontal
			 */
			$tabbar = $(".l-toolbar .l-tabbar").children();
			$tabbar.click(function(evt){
				$tabbar.removeClass('selected');
				$(this).addClass('selected');
			});

			/*
			 * Permite dar estilos a un item plegable
			 */
			$contentPlegable = $(".l-datalist .l-expandable .content");
			$contentPlegable.hide();
			$headerPlegable = $(".l-datalist .l-expandable .header");
			
			$headerPlegable.click(function(evt){
				evt.preventDefault();
				var parent = $(this).parent()
				, content = $(this).next();
				if(content.is(':visible')){
					content.slideToggle("fast", function(){
						parent.toggleClass('active');
					});
				}
				else{
					content.slideToggle("fast");
					parent.toggleClass('active');
				}
			});
			/*
			 * Permite dar estilos a una lista plegable (Accordion)
			 */
			$buttonAccordion = $viewer.find(".l-expandablelist-all");
			$contentAccordion = $viewer.find(".l-expandablelist .content");
			$contentAccordion.hide();
			if($buttonAccordion.attr('showing')!=''&&$buttonAccordion.attr('showing')!=undefined)
				$buttonAccordion.text($buttonAccordion.attr('showing'));
			
			$headerAccordion = $viewer.find(".l-expandablelist .header");

			$headerAccordion.click(function(evt){
				evt.preventDefault();
				$(this).next().slideToggle("fast", function(){
					if($viewer.find(".l-expandablelist .content:visible").length  > ($contentAccordion.length / 2)){
						$buttonAccordion.addClass('toHide').removeClass('toShow');
						if($buttonAccordion.attr('hiding')!=''&&$buttonAccordion.attr('showing')!=undefined)
							$buttonAccordion.text($buttonAccordion.attr('hiding'));
					}
					else{
						$buttonAccordion.addClass('toShow').removeClass('toHide');
						if($buttonAccordion.attr('showing')!=''&&$buttonAccordion.attr('showing')!=undefined)
							$buttonAccordion.text($buttonAccordion.attr('showing'));
					}
				})
				.parent().toggleClass("active");
			});
			
			$buttonAccordion.click(function(evt) {
				evt.preventDefault();
				if($viewer.find(".l-expandablelist .content:visible").length  > ($contentAccordion.length / 2)){
					$(this).addClass('toShow').removeClass('toHide');
					if($buttonAccordion.attr('showing')!=''&&$buttonAccordion.attr('showing')!=undefined)
						$buttonAccordion.text($buttonAccordion.attr('showing'));
				}
				else{
					$(this).removeClass('toShow').addClass('toHide');
					if($buttonAccordion.attr('hiding')!=''&&$buttonAccordion.attr('showing')!=undefined)
						$buttonAccordion.text($buttonAccordion.attr('hiding'));
				}
				if($viewer.find(".l-expandablelist .content:visible").length > ($contentAccordion.length / 2)){
					$contentAccordion.slideUp("fast").parent().removeClass('active');
				}
				else{
					$contentAccordion.slideDown("fast").parent().addClass('active');
				}
			});
			/*
			 * iPhone proporciona un botón "Ir" en el teclado. Dicho
			 * botón actúa como un submit que debe ser capturado para
			 * que el evento pueda ser debidamente procesado.
			 */
			$viewer.find("form[submitPartnerId]").each(function() {
				var $this = $(this);
				$this.bind("submit", function(evt) {
					evt.preventDefault();
					$viewer.find("#" + $this.attr("submitPartnerId")).click();
				});
			});
			$viewer.find("input, select, textarea").each(function() {
				var $this = $(this)
				, v = $.trim($this.val());
				if(v.length == 0) {
					$this.val($this.attr("tip"));
				}
				if($this.val() == $this.attr("tip")) {
					$this.addClass("empty");
				} else {
					$this.removeClass("empty");
				}
			});
			
			/*
			 * l-selectable implementation
			 */
			$viewer.find('li.l-selectable').click(function(evt) {
				$(this).toggleClass('l-selected')
				.siblings().removeClass('l-selected');
			});
			
			/* l-select implementation */
			$viewer.find(".l-select").each(function() {
				var $this = $(this), hiddenId, $hidden;
				
				// Genera un input hidden para guardar el valor seleccionado
				hiddenId = $this.attr("databindid");
				if(typeof(hiddenId) != "undefined") {
					$hidden = $(document.createElement("input"));
					$hidden.attr("type","hidden");
					$hidden.attr("name", hiddenId);
					$hidden.attr("id", hiddenId);
					$("form").append($hidden.get());
				}
			});
			$viewer.find(".l-select").click(function(evt) {
				var $this = $(this)
				, $li = $this.parent('li')
				, $options = $li.find('> .l-options');
				
				if($this.hasClass('opened')) {
					$options.slideUp('slow', function() {$this.removeClass('opened').addClass('closed');$li.removeClass('opened');});
				} else {
					$this.removeClass('closed').addClass('opened');
					$li.addClass('opened');
					$options.slideDown('slow');
				}
			}).addClass('closed');
			
			handlerSelection = function(ele){
				var hiddenId = ele.parents(".l-options").siblings(".l-select").attr("databindid").replace(/\./g, '\\.');
				$("#" + hiddenId).val(ele.attr("optionvalue"));
			}
			
			$viewer.find(".l-options .l-option").click(function(){
				handlerSelection($(this));
			});
			
			$viewer.find(".l-options .l-option:not(.fixed)").click(function() {
				$(this).parents(".l-options").siblings(".l-select").click();
			});
			$viewer.find('.l-options').hide();
			/* l-select execution (pre selected item) */
			$viewer.find(".l-options .l-option-selected").each(function(e){
				handlerSelection($(this));
			});
		};
		
		this.globalPostEffect = function($viewer) {
			$("input,textarea").bind("focus", function() {
				var $this = $(this);
				if($this.val() == $this.attr("tip")) {
					$this.val("");
					$this.removeClass("empty");
				}
				$this.addClass("editing");
			}).bind("blur", function() {
				var $this = $(this), v;
				$this.removeClass("editing");
				v = $.trim($this.val());
				if(v.length == 0) {
					$this.val($this.attr("tip"));
					$this.addClass("empty");
				}
			});
			
			/* l-slider execution */
			$('.l-slider').pointerSlider();
		};
		
		this.errorHandlerStrategy = function(ex) {
			switch(ex.getType) {
				case $L.userNotLoggedInException:
					setTimeout(function() {$L.renderView($L.loginView, {'effect': $L.loginEffectStrategy});}, 500);
					break;
				case $L.validationException:
					$L.validationErrorStrategy(ex);
					break;
				case $L.publicException:
					setTimeout(function() {alert(ex.message);}, 500);
					break;
				default:
					setTimeout(function() {alert("Se produjo un error inesperado. Inténtelo más tarde");}, 500);
					break;
			}
		}
		
		this.ajax = function(s) {
			var originalError = s.error;
			s.error = function(request, textStatus, errorThrown) {
				console.log("> AjaxError - error 1");
				$('li.l-selectable').removeClass('l-selected');
				try {
					var ex, executeDefault = true;
					
					switch(request.status) {
						case 401:
							ex = {"getType": $L.userNotLoggedInException};
							break;
						default:
							ex = $.parseJSON(request.responseText);
							break;
					}
					
					if(originalError) {
						executeDefault = originalError(ex);
					}
					if(executeDefault) {
						$L.errorHandlerStrategy(ex);
					}
				} catch (e) {
					setTimeout(function() {alert('No fue posible completar la solicitud. Inténtelo más tarde');}, 500);
				}
			};
			
			$.ajax(s);
		};
		
		this.validationErrorStrategy = function(ex) {
			setTimeout(function() {alert(ex.message);$("#" + ex.field).focus();}, 500);
		};
		
		function normalizeViewersHeight() {
			if($L.$nextViewer.height() < $L.$currentViewer.height()) {
				$L.$nextViewer.height($L.$currentViewer.height());
			} else {
				$L.$currentViewer.height($L.$nextViewer.height());
			}
			if($L.$nextViewer.height() < $L.minHeight) {
				$L.$nextViewer.height($L.minHeight);
				$L.$currentViewer.height($L.minHeight);
			}
			$L.$nextViewer.css({'height': $L.$nextViewer.height()});
			$L.$currentViewer.css({'height': $L.$currentViewer.height()});
		}
		
		function prepareNextViewer(data) {
			$L.$nextViewer.css({'height': 'auto'}).html(data);
		}
		
		function firePreEffect() {
			$L.globalPreEffect($L.$nextViewer);
			if($L.currentController && $L.currentController.preEffect) {
				$L.currentController.preEffect($L.$nextViewer);
			}
		}
		
		function executePreEffectLogic(data) {
			prepareNextViewer(data);
			normalizeViewersHeight();
			firePreEffect();
		}
		
		this.resetViewers = function() {
			var $tmp = $L.$nextViewer;
			$L.$nextViewer=$L.$currentViewer;
			$L.$currentViewer=$tmp;
			$L.$nextViewer.html("").css({
				'webkitTransitionProperty' 	: 'none'
				, 'webkitTransform'			: 'none'
			}).hide();
			$L.$currentViewer.css({
				'webkitTransitionProperty' 	:'none'
				, 'webkitTransform'			: 'none'
				,'left'						: 0
				, 'top'						: 0
				, 'width'					: '100%'
				, 'height'					:'auto'
				, 'min-height'				: $L.minHeight
			});
			$L.$container.css({'left': 0, 'top': 0});
			setTimeout(function() {window.scrollTo(0, 1);}, 100);
		};
		
		this.alternativeEffectStrategy = function(data, options, success) {
			if(!options) {options = {'effect': 'none'};}
			if(!success) {success = function() {};}
			$L.$nextViewer.css({'height': 'auto'}).html(data);
			if($L.$nextViewer.height() < $L.$currentViewer.height()) {
				$L.$nextViewer.height($L.$currentViewer.height());
			} else {
				$L.$currentViewer.height($L.$nextViewer.height());
			}
			if($L.$nextViewer.height() < $L.minHeight) {
				$L.$nextViewer.height($L.minHeight);
				$L.$currentViewer.height($L.minHeight);
			}
			$L.$nextViewer.css({'height': $L.$nextViewer.height()});
			$L.$currentViewer.css({'height': $L.$currentViewer.height()});
			$L.globalPreEffect($L.$nextViewer);
			if($L.currentController && $L.currentController.preEffect) {
				$L.currentController.preEffect($L.$nextViewer);
			}

			switch(options.effect) {
				case "toLeft":
				case "fromRight":
					$L.$currentViewer.css({'zIndex': 1});
					$L.$nextViewer.css({'top': 0, 'left': 0, 'zIndex': 0}).show('fast', function() {
						$L.$currentViewer.animate({'width': 'hide'}, $L.effectDuration, function() {$L.resetViewers(); success();});
					});			
					break;
				case "toRight":
				case "fromLeft":
					$L.$currentViewer.css({'zIndex': 0});
					$L.$nextViewer.css({'top': 0, 'left': 0, 'width': '0%', 'zIndex': 1}).animate({'width': '100%'}, $L.effectDuration, function() {
						$L.$currentViewer.hide('fast', function() {$L.resetViewers(); success();});
					});			
					break;
				case "toBottom":
				case "fromTop":
					$L.$currentViewer.css({'zIndex': 0});
					$L.$nextViewer.css({'top': 0, 'left': 0, 'zIndex': 1, 'height': 'hide'}).animate({'height': 'show'}, $L.effectDuration, 				   function() {
						$L.$currentViewer.hide('fast', function() {$L.resetViewers(); success();});
					});			
					break;				
				case "toTop":
				case "fromBottom":
					$L.$currentViewer.css({'zIndex': 1});
					$L.$nextViewer.css({'top': 0, 'left': 0, 'zIndex': 0}).show('fast', function() {
						$L.$currentViewer.animate({'height': 'hide'}, $L.effectDuration, function() {$L.resetViewers(); success();});
					});			
					break;
				default:
					$L.$nextViewer.show();
					$L.resetViewers();
					success();
					break;
			}
		};
				
		this.initialize = function() {
			/* Originalmente el body está vacío y genera una estructura compuesta por un
			   container y dos hijos (El current y el next). Además,establece los márgenes y bordes a 0 */
			$("body")
				.append('<div id="l-loading">Cargando</div><div id="container"><div id="one"></div><div id="two"></div></div>');

			$L.$container = $("#container");
			$L.$currentViewer = $("#one");
			$L.$nextViewer = $("#two").hide();
			/* Loading debe tener un zIndex tal que le permita situarse por sobre cualquier otro
			 * elemento de la página */
			$L.$loading = $("#l-loading").hide().css({'position': 'absolute', 'zIndex': 500})
			.ajaxStart(function() {
				console.log("> AjaxStart");
				var h = $L.$window.height()
				, w = $L.$window.width()
				, $this = $(this);
				$this.css({'top': (h-$this.height()) / 2 + window.pageYOffset, 'left': (w-$this.width()) / 2}).show();
			}).ajaxStop(function() {
				console.log("> AjaxStop");
				$(this).hide();
			}).ajaxError(function(){
				console.log("> AjaxError - error 2");
			});
			
			return $L;
		};
		
		this.renderView = function(viewId, options) {
			if($L.transitionBusy){
				console.log('** Exception: transition is busy - impossible show "' + viewId + '"');
				return;
			}
			var cv = $L.views[viewId], $container
			, effectStrategy = $L.effectStrategy || $L.alternativeEffectStrategy
			, ctrl
			, executeEffect;
			if(!cv) {
				alert("No se encuentra la página: " + viewId);
				$('li.l-selectable').removeClass('l-selected');
				return;
			}
			$L.oldView = $L.currentView;
			$L.currentView = cv;
			
			console.log("******** " + $L.oldView.controller + " ==> " + $L.currentView.controller + " ********");
			$container = $("#" + $L.container);
			var successRender = function(request, textStatus, options){
				switch(textStatus) {
					case 'success':
						options.record = options.record || "yes";

						if(options.transition != "back"){
							// Agregar elementos al historial.
							$L.$cursorIndex=($L.$cursorIndex==undefined)?0:parseInt($L.$cursorIndex)+1;
							console.log("... saving history with cursor = " + $L.$cursorIndex);
							$L.$history[$L.$cursorIndex] = [];
							$L.$history[$L.$cursorIndex][0] = $L.currentView;
							$L.$history[$L.$cursorIndex][1] = options;
							
							//Elimina elementos de indice mayor (forward) en caso de que no sea un llamado volver
							$L.$history.splice($L.$cursorIndex+1,$L.$history.length-$L.$cursorIndex);

						}
						// Debug del History
						debugHistory = ""
						for (var k in  $L.$history)	{
							debugHistory = debugHistory + $L.$history[k][0].controller+ " (" + $L.$history[k][1].effect + "|" + $L.$history[k][1].record +"), ";
						}
						console.log("History = ["+ debugHistory +"] | lenght = " + $L.$history.length);
						console.log("CursorIndex = "+ $L.$cursorIndex );
						
						// Quita css antiguo si corresponde
						if($L.oldView && $L.oldView.css) {
							$("head link[@href='" + $L.oldView.css + "']").remove();
						}
						
						// Carga el CSS si corresponde
						if($L.currentView.css) {
							$("head").append("<link type='text/css' rel='stylesheet' href='" + $L.currentView.css + "' />");
						}
						executeEffect = function() {
							console.log("> EffectStart");
							var data = request.responseText;
							executePreEffectLogic(data);
							effectStrategy.apply(data, options, function() {
								if($L.currentController && $L.currentController.postEffect) {
									try {$L.currentController.postEffect($L.$currentViewer);} catch(ex) {console.log(ex);}
								}
								
								$L.globalPostEffect($L.$currentViewer);
								$L.transitionBusy = false;
								console.log("> EffectStop, >> REQUESTS UNLOCKED <<");
							});
						};
						
						// Carga el controlador
						$L.currentController = null;
						if($L.currentView.controller) {
							ctrl = $L.controllers[$L.currentView.controller];
							
							if(!ctrl || ctrl.cache == 'on') {
								if($L.controllersCache[$L.currentView.controller]) {
									$L.currentController = $L.controllersCache[$L.currentView.controller];
								}
							}
						
							if($L.currentController == null && ctrl) {
								$.getJSON(ctrl.url, function(data, textStatus) {
									$L.currentController = data;
									if(ctrl.cache == 'on') {
										$L.controllersCache[$L.currentView.controller] = data;
									}
									executeEffect();									
								});
							} else {
								executeEffect();
							}
						} else {
							executeEffect();
						}
						
						break;
					case 'error':
						console.log("> AjaxError - error 3");
						eval(options && options.error?options.error:function() {return true;});
						$L.transitionBusy = false;
						console.log("** Exception: Error showing view, >> REQUESTS UNLOCKED <<");
						break;
				}
			}
			$L.caja = successRender;
			$L.ajax({
				'type': options && options.data?'POST':'GET'
				,'dataType': 'html'
				,'url': $L.currentView.url
				,'data': options && options.data?options.data:{}
				,'complete': function(request, textStatus) {
					console.log("> AjaxComplete");
					if(successRender === $L.caja){
						$L.transitionBusy = true;
						console.log(request.status + " - " + textStatus  + "... \"" + $L.currentView.controller + "\" is last view called, << REQUESTS LOCKED >>");
						successRender(request, textStatus, options);
					}
					else{
						console.log("** Exception: It is not the last one view called. I can't show it");
					}
				}
			});
			
			return $container;
		};
	}
	
	$L.effectStrategy = new WebkitEffectStrategy();
	
	window.$L = $L;
	
})(window, jQuery);
