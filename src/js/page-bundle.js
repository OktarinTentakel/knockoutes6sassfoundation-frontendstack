//###[ IMPORTS ]########################################################################################################

import {Page} from 'pages/page';



// ###[ INIT ]##########################################################################################################

/**
 * Wait for DOMReady and initialize the app with the config from the template
 **/
$(function(){
    Page.registerComponents();
	let page = new Page(window.APP.instance);
    page.applyToElement($('#page'));
});
