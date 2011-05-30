/*
* Text:
* card:
* leaf:
* source: Utilizado para mostrar el código fuente
* */

 sink.Structure = [
	{
	    text: 'Noticias',
	    card: controllers.Noticias,
        source: 'controllers/noticias.js',
	    leaf: true
	},
	{
	    text: 'Mercado',
	    card: controllers.Mercado,
        source: 'controllers/mercado.js',
	    leaf: true
	},
	{
	    text: 'Estudios',
	    card: controllers.Estudios,
        source: 'controllers/estudios.js',
	    leaf: true
	},
	{
	    text: 'Buscador',
	    card: controllers.Buscador,
        source: 'controllers/buscador.js',
	    leaf: true
	},
	{
	    text: 'Clientes',
	    card: controllers.Clientes,
        source: 'controllers/clientes.js',
	    leaf: true
	},
    {
        text: 'Features',
        cls: 'launchscreen',
        items: [
            {
                text: 'Buttones',
                card: demos.Buttons,
                source: 'src/demos/buttons.js',
                leaf: true
            },
            {
                text: 'Forms',
                card: demos.Forms,
                source: 'src/demos/forms.js',
                leaf: true
            },
			{
		        text: 'Picker',
		        card: demos.Picker,
                source: 'src/demos/picker.js',
		        leaf: true
		    },
            {
                text: 'List',
                card: demos.List,
                source: 'src/demos/list.js',
                leaf: true
            },
            {
                text: 'Nested List',
                card: demos.NestedList,
                source: 'src/demos/LeafSelectedPlugin.js',
                leaf: true
            },
            {
                text: 'Icons',
                card: demos.Icons,
                source: 'src/demos/icons.js',
                leaf: true
            },
            {
                text: 'Toolbars',
                card: demos.Toolbars,
                source: 'src/demos/toolbars.js',
                leaf: true
            },
            {
                text: 'Carousel',
                card: demos.Carousel,
                source: 'src/demos/carousel.js',
                leaf: true
            },
            {
                text: 'Tabs',
                card: demos.Tabs,
                source: 'src/demos/tabs.js',
                leaf: true
            },
            {
                text: 'Bottom Tabs',
                card: demos.BottomTabs,
                source: 'src/demos/bottomtabs.js',
                leaf: true
            },

            {
                text: 'Overlays',
                card: demos.SheetsOverlays,
                source: 'src/demos/overlays.js',
                leaf: true
            }
        ]
    },
    {
        text: 'Data',
        items: [
            {
                text: 'Nested Loading',
                card: demos.Data.nestedLoading,
                source: 'src/demos/data/nestedLoading.js',
                leaf: true
            },
            {
                text: 'JSON P',
                card: demos.Data.jsonp,
                source: 'src/demos/data/jsonp.js',
                leaf: true
            },
            {
                text: 'YQL',
                card: demos.Data.yql,
                source: 'src/demos/data/yql.js',
                leaf: true
            },
            {
                text: 'AJAX',
                card: demos.Data.ajax,
                source: 'src/demos/data/ajax.js',
                leaf: true
            }
        ]
    }
];

if (Ext.is.iOS) {
    sink.Structure.push({
        text: 'Simulator',
        leaf: true,
        card: demos.Simulator,
        source: 'src/demos/simulator.js'
    });
}

Ext.regModel('Demo', {
    fields: [
        {name: 'text',        type: 'string'},
        {name: 'source',      type: 'string'},
        {name: 'preventHide', type: 'boolean'},
        {name: 'cardSwitchAnimation'},
        {name: 'card'}
    ]
});

sink.StructureStore = new Ext.data.TreeStore({
    model: 'Demo',
    root: {
        items: sink.Structure
    },
    proxy: {
        type: 'ajax',
        reader: {
            type: 'tree',
            root: 'items'
        }
    }
});

Ext.regModel('DemoDos', {
    fields: [
        {name: 'title',         type: 'string'},
        {name: 'html',          type: 'string'},
        {name: 'iconCls',       type: 'string'},
        {name: 'cls',           type: 'string'},
        {name: 'source',        type: 'string'},
        {name: 'preventHide',   type: 'boolean'},
        {name: 'cardSwitchAnimation'},
        {name: 'card'}
    ]
});

sink.StructureDosStore = new Ext.data.TreeStore({
    model: 'DemoDos',
    root: {
        items: sink.StructureDos
    },
    proxy: {
        type: 'ajax',
        reader: {
            type: 'tree',
            root: 'items'
        }
    }
});