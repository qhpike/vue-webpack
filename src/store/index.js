import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './mudules/user'
import getters from './getters'

const store = new Vuex.Store({
    modules :{
        user,
    },
    getters
    
})

export default store