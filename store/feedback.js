export const state = () => ({
    msgs: [],
})

export const mutations = {
    replace(state, msgs) {
        state.msgs = msgs
    },
    add_msg(state, {msg, error = false}) {
        if (state.msgs.length === 0 || state.msgs[state.msgs.length - 1].msg !== msg) {
            state.msgs.push({msg, error})
        }
        this.$cookies.set("feedback", state.msgs,
            {sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/"},
        )
    },
    remove_msg(state) {
        state.msgs.shift()
        this.$cookies.set("feedback", state.msgs,
            {sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/"},
        )
    },
}

export const getters = {
    feedback(state) {
        if (state.msgs.length > 0) {
            return state.msgs[0]
        }
        return {}
    },
}
