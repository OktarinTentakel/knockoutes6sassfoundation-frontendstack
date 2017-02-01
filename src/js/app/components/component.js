//###[ IMPORTS ]########################################################################################################

import {jQuery as $, lodash as _, knockout as ko} from 'lib/shim';
import {ViewModel} from 'abstract/viewmodel';



//###[ CONSTANTS ]######################################################################################################

const TEMPLATE_SELECTOR = '#component-template';



//###[ COMPONENT ]###########################################################################################################

export class Component extends ViewModel {

	//###( STATIC )###

	static register(){
		ko.components.register(
			'Component',
			{
				viewModel : {
					createViewModel : function(params, componentInfo){
						return new Component(params);
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
            active : true,
            headline : 'headline',
            copytext : 'copytext'
        }, params.model));

		// id (for id attr), enables us to select the dom element dynamically
		this.viewModel.id = ko.observable(_.uniqueId('component_'));
	}



	dispose(){
		super.dispose();
	}



    alert(){
        $.log('component rendered');
    }

}
