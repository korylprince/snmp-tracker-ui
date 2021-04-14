<template>
    <v-card width="100%" max-width="600px" :elevation="$vuetify.breakpoint.xsOnly ? 0 : null">
        <v-card-title>
            Search Results
            <v-spacer />
            <v-text-field
                v-if="results != null && results.length > 0"
                v-model="query"
                :prepend-icon="icons.mdiMagnify"
                label="Filter"
                single-line
                dense
                clearable
                hide-details
                @keydown.esc="query = ''"
            />
        </v-card-title>
        <v-card-text>
            <v-data-table
                :headers="headers"
                :items="results"
                :search="query"
                item-key="key"
                sort-by="name"
                :mobile-breakpoint="0"
            >
                <template #[`item.type`]="{item}">
                    <v-tooltip bottom>
                        <template #activator="{on}">
                            <v-icon v-if="item.type === 'Hostname'" v-on="on">
                                {{ icons.mdiFormTextbox }}
                            </v-icon>
                            <v-icon v-if="item.type === 'System'" v-on="on">
                                {{ icons.mdiServerNetwork }}
                            </v-icon>
                        </template>
                        <span>{{ item.type }}</span>
                    </v-tooltip>
                </template>
                <template #[`item.view`]="{item}">
                    <v-tooltip bottom>
                        <template #activator="{on}">
                            <v-btn text icon :to="item.route" exact v-on="on">
                                <v-icon>{{ icons.mdiEye }}</v-icon>
                            </v-btn>
                        </template>
                        <span>View</span>
                    </v-tooltip>
                </template>
                <template #no-data>
                    No results found. Try another search
                </template>
                <template #no-results>
                    No results found. Try another filter
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
const macRegexp = /^(([\da-f]{4}\.){2}[\da-f]{4}|([\da-f]{2}:){5}[\da-f]{2}|[\da-f]{12})$/
const ipRegexp = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/
export default {
    async asyncData({$graphql, route, from, redirect, store}) {
        const back = () => {
            if (from != null) {
                redirect(from)
                return
            }
            redirect("/")
        }

        if (route.query == null || route.query.query == null || route.query.query === "") {
            back()
            return
        }

        let query = route.query.query

        if (ipRegexp.test(query)) {
            store.commit("loading/start_loading", "search")
            try {
                const data = await $graphql.search_ip_address(query)
                if (data.length === 0) {
                    store.commit("feedback/add_msg", {msg: "No results found. Try another search"})
                    back()
                    return
                }
                redirect(`/ip_address/${data[0].id}`)
                return
            } finally {
                store.commit("loading/stop_loading", "search")
            }
        }

        if (macRegexp.test(query.toLowerCase())) {
            query = query.toLowerCase().replace(/[:.]/g, "").match(/.{1,2}/g).join(":")
            store.commit("loading/start_loading", "search")
            try {
                const data = await $graphql.search_mac_address(query)
                if (data.length === 0) {
                    store.commit("feedback/add_msg", {msg: "No results found. Try another search"})
                    back()
                    return
                }
                redirect(`/mac_address/${data[0].id}`)
                return
            } finally {
                store.commit("loading/stop_loading", "search")
            }
        }

        let hostname; let system; let vendor
        store.commit("loading/start_loading", "search")
        try {
            ({hostname, system, vendor} = await $graphql.search(query))
        } finally {
            store.commit("loading/stop_loading", "search")
        }

        if (vendor.length === 1) {
            redirect(`/vendor/${vendor[0].prefix}`)
            return
        } else if (hostname.length === 1 && system.length === 0) {
            redirect(`/hostname/${hostname[0].id}`)
            return
        } else if (system.length === 1 && hostname.length === 0) {
            redirect(`/system/${system[0].id}`)
            return
        } else if (hostname.length + system.length + vendor.length === 0) {
            store.commit("feedback/add_msg", {msg: "No results found. Try another search"})
            back()
            return
        }

        const results = []
        for (const h of hostname) {
            results.push({type: "Hostname", id: h.id, key: `hostname:${h.id}`, name: h.hostname, route: `/hostname/${h.id}`})
        }
        for (const s of system) {
            results.push({type: "System", id: s.id, key: `system:${s.id}`, name: s.name, route: `/system/${s.id}`})
        }

        return {results}
    },
    data() {
        return {
            query: "",
            headers: [
                {text: "Type", value: "type"},
                {text: "Name", value: "name"},
                {text: "View", value: "view", sortable: false},
            ],
        }
    },
    head() {
        if (this.$route.query == null || this.$route.query.query == null) {
            return {title: "Search"}
        }
        return {title: `Search - ${this.$route.query.query}`}
    },
}
</script>

