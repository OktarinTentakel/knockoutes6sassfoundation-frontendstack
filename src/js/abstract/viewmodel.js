//###[ VIEWMODEL ]######################################################################################################

/**
 * Basic class all objects/components/parts should inherit from, having an own ViewModel to use in a template.
 * This class provides memormy management helpers for example, automatically disposing any objects pushed into the
 * _disposables array.
 **/
export class ViewModel {

	//###( CLASS )###

	constructor(){
		// list of anything which should be manually disposed of, when object gets destroyed (subscriptions, computeds, ...)
		this._disposables = [];
	}



	dispose(){
		if( $.isArray(this._disposables) ){
			_.each(this._disposables, (disposable) => {
				if( $.isFunction(disposable.dispose) ){
					disposable.dispose();
				}
			});
		}
	}



	//###( PROTECTED )###

	_addDisposable(disposable){
		this._disposables.push(disposable);
	}

}
