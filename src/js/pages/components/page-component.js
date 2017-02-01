//###[ IMPORTS ]########################################################################################################

import {jQuery as $, lodash as _, knockout as ko} from 'lib/shim';
import {ViewModel} from 'abstract/viewmodel';



//###[ CONSTANTS ]######################################################################################################

const TEMPLATE_SELECTOR = '#page-component-template';



//###[ PAGE-COMPONENT ]#################################################################################################

export class PageComponent extends ViewModel {

	//###( STATIC )###

	static register(){
		ko.components.register(
			'PageComponent',
			{
				viewModel : {
					createViewModel : function(params, componentInfo){
						return new PageComponent(params);
					}
				},
				template : $(TEMPLATE_SELECTOR).first().html()
			}
		);
	}



	//###( CLASS )###

	constructor(params){
		// strip possible observables
		params = ko.viewmodel.toModel(params);

		super();

		// reference to the app this step is associated to
		this.app = $.orDefault(params.app, null);
		$.assert($.exists('app.viewModel', this), 'Component.constructor | app has not been set');

		this.viewModel = ko.viewmodel.fromModel($.extend({
            message : 'I\'m a component of a <strong>nested</strong> page'
        }, params.model));

		// id (for id attr), enables us to select the dom element dynamically
		this.viewModel.id = ko.observable(_.uniqueId('pagecomponent_'));
	}



	dispose(){
		super.dispose();
	}



    alert(){
        $.log('pagecomponent rendered');
    }

}
