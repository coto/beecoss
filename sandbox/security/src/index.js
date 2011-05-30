Ext.ns('sink', 'demos', 'Ext.ux');

Ext.ux.UniversalUI = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    items: [{
        cls: 'launchscreen',
        html: 'HOME'
    }],
    backText: 'Volver',
    useTitleAsBackText: true,
    initComponent : function() {
        // navigationButton ("Menu")
        // Visble solo en iPad o Desktop con Tamaño de pantalla pequeño
        this.navigationButton = new Ext.Button({
            hidden: Ext.is.Phone || Ext.Viewport.orientation == 'landscape',
            text: 'Menu',
            handler: this.onNavButtonTap,
            scope: this
        });

        // backButton ("Volver")
        // Visble solo en Phone
        // Por defecto oculto, se muestra
        this.backButton = new Ext.Button({
            text: this.backText,
            ui: 'back',
            handler: this.onUiBack,
            hidden: true,
            scope: this
        });
        var btns = [this.navigationButton];
        if (Ext.is.Phone) {
            btns.unshift(this.backButton);
        }

        this.navigationBar = new Ext.Toolbar({
            ui: 'dark',
            dock: 'top',
            title: this.title,
            //style: 'border: 2px solid green',
            items: btns.concat(this.buttons || [])
        });

        this.navigationPanel = new Ext.NestedList({
			// Barra lateral izquierda para iPhone y Tablets
            store: sink.StructureStore,
            useToolbar: Ext.is.Phone ? false : true, // Barra superior del menu
			//title: '<img src="media/img/lg.gif" style="height: 100%;"/>',
            updateTitleText: false,
            dock: 'left',
            //style: 'border: 2px solid yellow',
            hidden: !Ext.is.Phone && Ext.Viewport.orientation == 'portrait',
            toolbar: Ext.is.Phone ? this.navigationBar : null,
            listeners: {
               itemtap: this.onNavPanelItemTap,
               scope: this
            }
        });

        this.navigationPanel.on('back', this.onNavBack, this);

        if (!Ext.is.Phone) {
            this.navigationPanel.setWidth(250);
        }

        this.navigationPanelPhone = new Ext.TabPanel({
            tabBar: {
                dock: 'bottom',
                ui: 'light',
                layout: {
                    pack: 'center'
                }
            },
            cardSwitchAnimation: {
                type: 'slide',
                cover: true
            },
            defaults: {
                scroll: 'vertical'
            },
            items: [
                {
                    title: 'Noticias',
                    html: '<p>Docking tabs to the bottom will automatically change their style. The tabs below are ui="light", though the standard type is dark. Badges (like the 4 below) can be added by setting <code>badgeText</code> when creating a tab/card or by using <code>setBadge()</code> on the tab later.</p>',
                    iconCls: 'info',
                    cls: 'card card1'
                },
                {
                    title: 'Mercado',
                    html: 'Favorites Card',
                    iconCls: 'favorites',
                    cls: 'card card2',
                    badgeText: '4'
                },
                {
                    title: 'Estudios',
                    id: 'tab3',
                    html: 'Downloads Card',
                    badgeText: 'Text can go here too, but it will be cut off if it is too long.',
                    cls: 'card card3',
                    iconCls: 'download'
                },
                {
                    title: 'Buscador',
                    html: 'Settings Card',
                    cls: 'card card4',
                    iconCls: 'settings'
                },
                {
                    title: 'Cliente',
                    html: 'User Card',
                    cls: 'card card5',
                    iconCls: 'user'
                }
            ]
        });

        this.dockedItems = this.dockedItems || [];
        this.dockedItems.unshift(this.navigationBar);

        // Muestra el panel de navegación (navigationPanel)
        // como dockedItems al lado izquierdo para lo que no es Phone
        if (!Ext.is.Phone && Ext.Viewport.orientation == 'landscape') {
            this.dockedItems.unshift(this.navigationPanel);
        }
        // Muestra el panel de navegación (navigationPanel)
        // como items, aplica en Phone
        else if (Ext.is.Phone) {
            this.items = this.items || [];
            //this.items.unshift(this.navigationPanel);
            this.items.unshift(this.navigationPanelPhone);
        }

        this.addEvents('navigate');


        Ext.ux.UniversalUI.superclass.initComponent.call(this);
    },

    toggleUiBackButton: function() {
		// Muestra botón back en el iPhone
		// Cada vez que se presiona algun item de menu y cuando se presiona Back (solo en el iPhone)
		// Aplica: 
		//		- Desktop
		//		- iPad
		//		- iPhone
        var navPnl = this.navigationPanel;

        if (Ext.is.Phone) {
            if (this.getActiveItem() === navPnl) {

                var currList      = navPnl.getActiveItem(),
                    currIdx       = navPnl.items.indexOf(currList),
                    recordNode    = currList.recordNode,
                    title         = navPnl.renderTitleText(recordNode),
                    parentNode    = recordNode ? recordNode.parentNode : null,
                    backTxt       = (parentNode && !parentNode.isRoot) ? navPnl.renderTitleText(parentNode) : this.title || '',
                    activeItem;


                if (currIdx <= 0) {
                    this.navigationBar.setTitle(this.title || '');
                    this.backButton.hide();
                } else {
                    this.navigationBar.setTitle(title);
                    if (this.useTitleAsBackText) {
                        this.backButton.setText(backTxt);
                    }

                    this.backButton.show();
                }
            // on a demo
            } else {
                activeItem = navPnl.getActiveItem();
                recordNode = activeItem.recordNode;
                backTxt    = (recordNode && !recordNode.isRoot) ? navPnl.renderTitleText(recordNode) : this.title || '';

                if (this.useTitleAsBackText) {
                    this.backButton.setText(backTxt);
                }
                this.backButton.show();
            }
            this.navigationBar.doLayout();
        }

    },

    onUiBack: function() {
		// Accion Back del iPhone
        var navPnl = this.navigationPanel;

        // if we already in the nested list
        if (this.getActiveItem() === navPnl) {
            navPnl.onBackTap();
        // we were on a demo, slide back into
        // navigation
        } else {
            this.setActiveItem(navPnl, {
                type: 'slide',
                reverse: true
            });
        }
        this.toggleUiBackButton();
        this.fireEvent('navigate', this, {});
    },

    onNavPanelItemTap: function(subList, subIdx, el, e) {
		// Navegando por el menu lateral 
		// Aplica: 
		//		- Desktop
		//		- iPad
		//		- iPhone
        var store      = subList.getStore(),
            record     = store.getAt(subIdx),
            recordNode = record.node,
            nestedList = this.navigationPanel,
            title      = nestedList.renderTitleText(recordNode),
            card, preventHide, anim;

        if (record) {
            card        = record.get('card');
            anim        = record.get('cardSwitchAnimation');
            preventHide = record.get('preventHide');
        }

        if (Ext.Viewport.orientation == 'portrait' && !Ext.is.Phone && !recordNode.childNodes.length && !preventHide) {
			// Esconde el panel lateral en caso de que sea Tablet o browser
            this.navigationPanel.hide();
        }
        if (card) {
			// Muestra realmente la vista (card) - Desktop y iPhone
            this.setActiveItem(card, anim || 'slide');
            this.currentCard = card;
        }

        if (title) {
			// Cambia el titulo de la pantalla (desktop y iphone)
            this.navigationBar.setTitle(title);
        }
        this.toggleUiBackButton();
        this.fireEvent('navigate', this, record);
    },

    onNavButtonTap : function() {
		// Boton que despliga Modal (flotante) de Menu en iPad
		// Aplica: 
		//		- iPad
        this.navigationPanel.showBy(this.navigationButton, 'fade');
    },

    layoutOrientation : function(orientation, w, h) {
		// Se ejecuta: Al inicio, cambio de resolución, cambio portrait/landscape
		// Acción: Identifica cuando no es iPhone
		// Aplica: 
		//		- Desktop
		//		- iPad
		//		- iPhone
		if (!Ext.is.Phone) {
            if (orientation == 'portrait') {
				// Menu flotante
                // No Menu barra Lateral
                // Boton de Navegación (navigationButton) despliega menu flotante
                // Aplica en: iPad (Portrait)
				
                this.navigationPanel.hide(false);
                this.removeDocked(this.navigationPanel, false);
                if (this.navigationPanel.rendered) {
                    this.navigationPanel.el.appendTo(document.body);
                }
                this.navigationPanel.setFloating(true);
                this.navigationPanel.setHeight(400);
                this.navigationButton.show(false);
            }
            else {
                // Menu barra lateral
				// Aplica en: iPad (Landscape), Desktop
                this.navigationPanel.setFloating(false);
                this.navigationPanel.show(false);
                this.navigationButton.hide(false);
                this.insertDocked(0, this.navigationPanel);
            }
            this.navigationBar.doComponentLayout();
        }

        Ext.ux.UniversalUI.superclass.layoutOrientation.call(this, orientation, w, h);
    }
});

sink.Main = {
    init : function() {
        this.sourceButton = new Ext.Button({
            text: 'Source',
            ui: 'action',
            hidden: true,
            handler: this.onSourceButtonTap,
            scope: this
        });

        this.codeBox = new Ext.ux.CodeBox({scroll: false});

        var sourceConfig = {
			// Caja de Código fuente
            items: [this.codeBox],
			//style: "background-color: red;",
            bodyCls: 'ux-code',
            scroll: {
                direction: 'both',
                eventTarget: 'parent'
            }
        };

        if (!Ext.is.Phone) {
            Ext.apply(sourceConfig, {
                width: 500,
                height: 500,
                floating: true
            });
        }

        this.sourcePanel = new Ext.Panel(sourceConfig);
		
		// Esta clase será extendida mas adelante, corresponde al panel principal
        this.ui = new Ext.ux.UniversalUI({
            title: Ext.is.Phone ? '<img src="media/img/lg.gif"/>' : 'Inversiones Security',
            useTitleAsBackText: false,
            navigationItems: sink.Structure,
            //style: 'border: 2px solid red',
            buttons: [{xtype: 'spacer'}, this.sourceButton],
            listeners: {
                navigate : this.onNavigate,
                scope: this
            }
        });
    },


    onNavigate : function(ui, record) {
		/* 
		*	Cuando se navega entre las vistas
		*/
        if (record.data && record.data.source) {
			// Muestra boton source
            var source = record.get('source');
            if (this.sourceButton.hidden) {
                this.sourceButton.show();
                ui.navigationBar.doComponentLayout();
            }

            Ext.Ajax.request({
                url: source,
                success: function(response) {
                    this.codeBox.setValue(Ext.htmlEncode(response.responseText));
                },
                scope: this
            });
        }
        else {
            this.codeBox.setValue('No source for this example.');
            this.sourceButton.hide();
            this.sourceActive = false;
            this.sourceButton.setText('Source');
            ui.navigationBar.doComponentLayout();
        }
    },

    onSourceButtonTap : function() {
		/* 
		*	Cuando se presiona el boton source
		*/
        if (!Ext.is.Phone) {
            this.sourcePanel.showBy(this.sourceButton.el, 'fade');
        }
        else {
            if (this.sourceActive) {
                this.ui.setActiveItem(this.ui.currentCard, Ext.is.Android ? false : 'flip');
                this.sourceActive = false;
                this.ui.navigationBar.setTitle(this.currentTitle);
                this.sourceButton.setText('Source');
            }
            else {
                this.ui.setActiveItem(this.sourcePanel, Ext.is.Android ? false : 'flip');
                this.sourceActive = true;
                this.currentTitle = this.ui.navigationBar.title;
                this.ui.navigationBar.setTitle('Source');
                this.sourceButton.setText('Example');
            }
            this.ui.navigationBar.doLayout();
        }
        
        this.sourcePanel.scroller.scrollTo({x: 0, y: 0});
		
    }
};

Ext.setup({
    tabletStartupScreen: 'media/img/tablet_startup.png',
    phoneStartupScreen: 'media/img/phone_startup.png',
    icon: 'media/img/icon.png',
    glossOnIcon: false,

    onReady: function() {
        sink.Main.init();
    }
});

Ext.ns('demos', 'demos.Data', 'controllers');