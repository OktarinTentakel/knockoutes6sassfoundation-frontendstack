//###[ IMPORTS ]########################################################################################################

import {jQuery as $, lodash as _, knockout as ko} from 'lib/shim';
import {ViewModel} from 'abstract/viewmodel';
import {Component} from 'app/components/component';



//###[ APP ]############################################################################################################

export class App extends ViewModel {

    //###( STATIC )###

	static registerComponents(){
		Component.register();
	}



    //###( CLASS )###

	constructor(){
		super();

		this.viewModel = {};
        this.viewModel.page = ko.observable({});
		this.viewModel.stuff = ko.observableArray([]);

        $(document).foundation();

        $.log('app constructed');
	}



	dispose(){
		$.log('app destroyed');
	}



	applyToElement($element){
		ko.applyBindings(this, $element.first().oo());
	}



	addStuff(){
		this.viewModel.stuff.push(_.uniqueId());
	}



    setPage(page){
        this.viewModel.page = page;
    }
}
