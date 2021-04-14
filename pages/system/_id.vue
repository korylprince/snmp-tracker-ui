<template>
    <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly">
        <v-row justify="center" class="ma-0">
            <Error v-if="$fetchState.error" :error="$fetchState.error" />

            <v-skeleton-loader v-else-if="loading('system') || data == null" type="card-heading, image" width="100%" max-width="960px" />
            <v-card v-else width="100%" max-width="960px" :elevation="$vuetify.breakpoint.xsOnly ? 0 : null">
                <v-card-title>
                    <v-tooltip bottom>
                        <template #activator="{on}">
                            <v-icon style="padding-right: 10px" v-on="on">
                                {{ icons.mdiServerNetwork }}
                            </v-icon>
                        </template>
                        <span>System</span>
                    </v-tooltip>
                    {{ data.name }}
                    <v-spacer />
                    <v-btn text icon color="accent" @click="$fetch">
                        <v-icon>{{ icons.mdiRefresh }}</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-subtitle v-if="data.hostname">
                    <NuxtLink :to="`/hostname/${data.hostname.id}`">
                        {{ data.hostname.hostname }}
                    </NuxtLink>
                </v-card-subtitle>

                <v-card-text>
                    <v-card v-if="data.ports.length > 0">
                        <v-card-title>
                            Ports
                            <v-spacer />
                            <v-text-field
                                v-model="port_query"
                                :prepend-icon="icons.mdiMagnify"
                                label="Filter"
                                single-line
                                dense
                                clearable
                                hide-details
                                @keydown.esc="port_query = ''"
                            />
                        </v-card-title>
                        <v-card-text>
                            <v-data-table
                                :items="data.ports"
                                :headers="port_headers"
                                :search="port_query"
                                :sort-desc="true"
                                :must-sort="true"
                                sort-by="journals[0].journal.time"
                            >
                                <template #[`item.name`]="{item}">
                                    <NuxtLink :to="`/port/${item.id}`">
                                        {{ item.name }}
                                    </NuxtLink>
                                </template>

                                <template #[`item.mac_address.mac_address`]="{item}">
                                    <NuxtLink :to="`/mac_address/${item.mac_address.id}`">
                                        {{ item.mac_address.mac_address }}
                                    </NuxtLink>
                                </template>

                                <template #[`item.journals[0].status`]="{item}">
                                    {{ item.journals[0].status }}
                                </template>

                                <template #[`item.journals[0].speed`]="{item}">
                                    {{ item.journals[0].speed | formatSpeed }}
                                </template>

                                <template #[`item.journals[0].journal.time`]="{item}">
                                    <v-tooltip v-if="item.journals.length >= 1" bottom>
                                        <template #activator="{on}">
                                            <span v-on="on">{{ item.journals[0].journal.time | distance }}</span>
                                        </template>
                                        <span>{{ item.journals[0].journal.time | formatted }}</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
import {mapGetters, mapMutations} from "vuex"
export default {
    data() {
        return {
            port_query: "",
            port_headers: [
                {text: "Name", value: "name"},
                {text: "Description", value: "description"},
                {text: "MAC Address", value: "mac_address.mac_address"},
                {text: "Status", value: "journals[0].status"},
                {text: "Speed", value: "journals[0].speed"},
                {text: "Last Seen", value: "journals[0].journal.time", filterable: false},
            ],
            data: null,
        }
    },
    async fetch() {
        this.start_loading("system")
        try {
            this.data = await this.$graphql.get_system(this.$nuxt.context.params.id)
            if (this.data == null) {
                if (process.server) {
                    this.$nuxt.context.res.statusCode = 404
                }
                throw {statusCode: 404, message: "System not found"}
            }
        } finally {
            this.stop_loading("system")
        }
    },
    head() {
        if (this.data == null || this.data.name == null) {
            return {title: "System"}
        }
        return {title: `System - ${this.data.name}`}
    },
    computed: {
        ...mapGetters("loading", ["loading"]),
        ...mapGetters("date", ["dates"]),
    },
    watch: {
        dates() {
            this.$fetch()
        },
    },
    methods: {
        ...mapMutations("loading", ["start_loading", "stop_loading"]),
    },
}
</script>
</template>
