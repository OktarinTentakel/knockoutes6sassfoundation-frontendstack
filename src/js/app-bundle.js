//###[ IMPORTS ]########################################################################################################

import {App} from 'app/app';



// ###[ INIT ]##########################################################################################################

/**
 * Wait for DOMReady and initialize the app with the config from the template
 **/
$(function(){
    App.registerComponents();
	let app = new App();

    window.APP = {
        instance : app,
        start : function(){
            app.applyToElement($('#app'));
        }
    };

	if( $.contextIsTouchDevice() ){
		$('body').addClass('touch');
	}
});
