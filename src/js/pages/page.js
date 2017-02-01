//###[ IMPORTS ]########################################################################################################

import {jQuery as $, lodash as _, knockout as ko} from 'lib/shim';
import {ViewModel} from 'abstract/ViewModel';
import {PageComponent} from 'pages/components/page-component';



//###[ APP ]############################################################################################################

export class Page extends ViewModel {

    //###( STATIC )###

	static registerComponents(){
		PageComponent.register();
	}



    //###( CLASS )###

	constructor(app){
        super();

        this.app = app;

		this.viewModel = {};
        this.viewModel.stuff = ko.observable('hello there, I\'m stuff');

		this.app.setPage(this);

        $.log('page constructed');
	}



	dispose(){
		$.log('page destroyed');
	}



    applyToElement($element){
		$element.first().attr('data-bind', 'with: $root.viewModel.page');
	}
}
