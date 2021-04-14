import {format, sub, parse} from "date-fns"

export const state = () => ({
    start_date: null,
    end_date: null,
})

export const mutations = {
    update_start_date(state, start_date) {
        state.start_date = start_date
    },
    update_end_date(state, end_date) {
        state.end_date = end_date
    },
}

export const getters = {
    start_date(state) {
        if (state.start_date == null) {
            return format(sub(new Date(), {days: 7}), "yyyy-MM-dd")
        }
        return state.start_date
    },
    end_date(state) {
        if (state.end_date == null) {
            return format(new Date(), "yyyy-MM-dd")
        }
        return state.end_date
    },
    dates(_, {start_date, end_date}) {
        return {
            start_date: (parse(`${start_date} 00:00:00`, "yyyy-MM-dd HH:mm:ss", new Date())).toISOString(),
            end_date: (parse(`${end_date} 23:59:59.999`, "yyyy-MM-dd HH:mm:ss.SSS", new Date())).toISOString(),
        }
    },
}

export const actions = {
    update_start_date({commit}, start_date) {
        const dates = {...this.$cookies.get("dates")}
        const seven = format(sub(new Date(), {days: 7}), "yyyy-MM-dd")
        if (start_date === seven) {
            delete dates.start_date
            commit("update_start_date", null)
        } else {
            dates.start_date = start_date
            commit("update_start_date", start_date)
        }

        this.$cookies.set("dates", dates,
            {sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/"},
        )
    },
    update_end_date({commit}, end_date) {
        const dates = {...this.$cookies.get("dates")}
        const today = format(new Date(), "yyyy-MM-dd")
        if (end_date === today) {
            delete dates.end_date
            commit("update_end_date", null)
        } else {
            dates.end_date = end_date
            commit("update_end_date", end_date)
        }

        this.$cookies.set("dates", dates,
            {sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/"},
        )
    },
    reset({commit}) {
        commit("update_start_date", null)
        commit("update_end_date", null)
        this.$cookies.set("dates", {},
            {sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/"},
        )
    },
}
