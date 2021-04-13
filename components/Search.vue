<template>
    <v-text-field
        v-model="query"
        label="Search"
        :prepend-inner-icon="icons.mdiMagnify"
        single-line
        dense
        clearable
        hide-details
        color="white"
        :loading="loading('search')"
        @keydown.esc="query = ''"
        @keypress.enter="search(query)"
    >
        <template #append-outer>
            <v-tooltip
                bottom
            >
                <template #activator="{ on }">
                    <v-icon v-on="on">
                        {{ icons.mdiHelpCircleOutline }}
                    </v-icon>
                </template>
                <div style="text-align: center">
                    Search for Systems, Vendor Prefixes, Hostnames, <br>MAC Addresses, or IP Addresses. Use % as a wildcard.
                </div>
            </v-tooltip>
        </template>
    </v-text-field>
</template>

<script>
import {mapGetters} from "vuex"
export default {
    data() {
        return {
            query: "",
        }
    },
    computed: {
        ...mapGetters("loading", ["loading"]),
    },
    methods: {
        search(query) {
            if (query === "") {
                return
            }

            this.$router.push({path: "/search", query: {query}})
        },
    },
}
</script>
