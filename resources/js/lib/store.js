import { mapState, mapStateMutations } from './vuex-mapper';
import Vuex from 'vuex';


/**
 *
 * @type {{}}
 */
let actions = {};

/**
 *
 * @param context
 */
actions.stateStoreInStorage = function(context) {
    hx.storage('app', context.state);
};

/**
 *
 * @param context
 */
actions.stateLoadFromStorage = function(context) {
    let store = hx.storage('app');

    if(store && typeof store === 'object') {
        for(let i in store) {
            if(!store.hasOwnProperty(i)) {
                continue;
            }
            context.commit(i, store[i]);
        }
    }
};


let Store = {};

Store.make = function(state) {
    return new Vuex.Store({
        state,
        mutations: mapStateMutations(state),
        actions,
    });
};

Store.computed = mapState;
Store.methods = Vuex.mapActions;

// window.app.storeMapper = {
//     computed: mapState,
//     methods: Vuex.mapActions,
// };

export default Store;
