(function() {
  	var datePicker = new Ext.DatePicker({
        useTitles: true,
        value: {
            day: 23,
            month: 2,
            year: 1984
        }
    });

    var buttonsGroup1 = [{
        text: 'Action',
        ui: 'action'
    }, {
        text: 'Forward',
        ui: 'forward'
    }];

    var dockedItems = [{
        xtype: 'toolbar',
        ui: 'light',
        items: buttonsGroup1,
        dock: 'bottom'
    }]

    demos.Picker = new Ext.Panel({
        id: 'toolbartxt',
        cls: 'card',
        html: 'Pick a button, any button. <br /><small>By using SASS, all of the buttons on this screen can be restyled dynamically. The only images used are masks.</small>',
        dockedItems: dockedItems,
		items: [{
            xtype: 'button',
            ui: 'normal',
            text: 'Show DatePicker',
            handler: function() {
                datePicker.show();
            }
        }]
    });
})();
