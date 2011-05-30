sink.Structure = [
	{
	    text: 'Noticias',
	    card: controllers.Noticias,
	    leaf: true
	},
	{
	    text: 'Mercado',
	    card: controllers.Mercado,
	    leaf: true
	},
	{
	    text: 'Estudios',
	    card: controllers.Estudios,
	    leaf: true
	},
	{
	    text: 'Buscador',
	    card: controllers.Buscador,
	    leaf: true
	},
	{
	    text: 'Clientes',
	    card: controllers.Clientes,
	    leaf: true
	},
    {
        text: 'Features',
        cls: 'launchscreen',
        items: [
            {
                text: 'Buttones',
                card: demos.Buttons,
                leaf: true
            },
            {
                text: 'Forms',
                card: demos.Forms,
                leaf: true
            },
			{
		        text: 'Picker',
		        card: demos.Picker,
		        leaf: true
		    },
            {
                text: 'List',
                card: demos.List,
                leaf: true
            },
            {
                text: 'Nested List',
                card: demos.NestedList,
                leaf: true
            },
            {
                text: 'Icons',
                card: demos.Icons,
                leaf: true
            },
            {
                text: 'Toolbars',
                card: demos.Toolbars,
                leaf: true
            },
            {
                text: 'Carousel',
                card: demos.Carousel,
                leaf: true
            },
            {
                text: 'Tabs',
                card: demos.Tabs,
                leaf: true
            },
            {
                text: 'Bottom Tabs',
                card: demos.BottomTabs,
                leaf: true
            },

            {
                text: 'Overlays',
                card: demos.SheetsOverlays,
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
