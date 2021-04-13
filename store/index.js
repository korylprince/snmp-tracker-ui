export const actions = {
    async nuxtServerInit({commit, getters, dispatch}, {$cookies, redirect}) {
        const session = $cookies.get("session")
        if (session != null) {
            commit("auth/sign_in", session)
        }

        const msgs = $cookies.get("feedback")
        if (msgs != null) {
            commit("feedback/replace", msgs)
        }

        const dates = $cookies.get("dates")
        if (dates != null && dates.start_date != null) {
            commit("date/update_start_date", dates.start_date)
        }
        if (dates != null && dates.end_date != null) {
            commit("date/update_end_date", dates.end_date)
        }

        if (getters["auth/signed_in"]) {
            const route = await dispatch("auth/ping")
            if (route != null) {
                redirect(route)
            }
        }
    },
}
