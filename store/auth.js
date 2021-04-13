export const state = () => ({
    token: null,
    roles: [],
    username: null,
    display_name: null,
})

export const getters = {
    signed_in(state) {
        return state.token != null
    },
    role(state) {
        if (state.roles != null && state.roles.length >= 1) {
            return state.roles[0]
        }
        return null
    },
    initials(state) {
        if (state.display_name == null) {
            return null
        }
        const names = state.display_name.split(" ")
        let initials = ""
        for (const n of names) {
            initials += n[0].toUpperCase()
        }
        return initials
    },
    auth_headers(state, getters) {
        if (!getters.signed_in) {
            return null
        }
        return {
            "Authorization": "Bearer " + state.token,
            "X-Hasura-Role": getters.role,
        }
    },
}

export const mutations = {
    sign_in(state, session) {
        state.token = session.token
        state.roles = session.roles
        state.username = session.username
        state.display_name = session.display_name
    },
    sign_out(state) {
        state.token = null
        state.roles = []
        state.username = null
        state.display_name = null
    },
}

export const actions = {
    async sign_in({commit}, {username, password}) {
        const response = await fetch(`${process.env.authPrefixURL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}),
        })

        if (!response.ok) {
            let json
            try {
                json = await response.clone().json()
            } catch {
                throw await response.text()
            }
            throw json
        }

        const {session_id, attrs: {roles}, ...rest} = await response.json()
        const session = {token: session_id, roles, ...rest}
        commit("sign_in", session)
        this.$cookies.set("session", session,
            {sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/"},
        )
    },
    sign_out({commit}, keep_route = true) {
        commit("sign_out")
        this.$cookies.remove("session")
        if (keep_route && this.$router.currentRoute.path !== "/sign_in" && this.$router.currentRoute.path !== "/") {
            return {path: "/sign_in", query: {next: this.$router.currentRoute.fullPath}}
        }
        return "/sign_in"
    },
    async ping({getters, dispatch}) {
        const response = await fetch(`${process.env.authPrefixURL}/webhook`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...getters.auth_headers,
            },
        })

        if (!response.ok) {
            if (response.status === 401) {
                return await dispatch("sign_out")
            }
            try {
                console.error("Unknown error occurred:", {type: "ping", body: response.clone().json()})
            } catch {
                console.error("Unknown error occurred:", {type: "ping", body: response.text()})
            }
        }
    },
}
