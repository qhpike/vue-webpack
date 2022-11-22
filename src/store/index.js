import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './mudules/user'
import app from './mudules/app'
import getters from './getters'

const store = new Vuex.Store({
    modules :{
        user,
        app,
    },
    getters
    
})

export default store