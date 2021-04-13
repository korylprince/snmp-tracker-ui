import Vue from "vue"

export const state = () => ({
    count: {},
})

export const getters = {
    loading(state) {
        return (...keys) => {
            for (const key of keys) {
                if (key in state.count && state.count[key] !== 0) {
                    return true
                }
            }
            return false
        }
    },
}

export const mutations = {
    start_loading(state, key) {
        if (!(key in state.count)) {
            Vue.set(state.count, key, 0)
        }
        state.count[key]++
    },
    stop_loading(state, key) {
        state.count[key]--
    },
}
