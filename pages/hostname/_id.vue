<template>
    <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly">
        <v-row justify="center" class="ma-0">
            <Error v-if="$fetchState.error" :error="$fetchState.error" />

            <v-skeleton-loader v-else-if="loading('hostname') || data == null" type="card-heading, image" width="100%" max-width="960px" />
            <v-card v-else width="100%" max-width="960px" :elevation="$vuetify.breakpoint.xsOnly ? 0 : null">
                <v-card-title>
                    <v-tooltip bottom>
                        <template #activator="{on}">
                            <v-icon style="padding-right: 10px" v-on="on">
                                {{ icons.mdiFormTextbox }}
                            </v-icon>
                        </template>
                        <span>Hostname</span>
                    </v-tooltip>
                    {{ data.hostname }}
                    <v-spacer />
                    <v-btn text icon color="accent" @click="$fetch">
                        <v-icon>{{ icons.mdiRefresh }}</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col v-if="data.resolves.length > 0" cols="12" sm="6">
                            <v-card>
                                <v-card-title>
                                    DNS Lookups
                                    <v-spacer />
                                    <v-text-field
                                        v-model="resolve_query"
                                        :prepend-icon="icons.mdiMagnify"
                                        label="Filter"
                                        single-line
                                        dense
                                        clearable
                                        hide-details
                                        @keydown.esc="resolve_query = ''"
                                    />
                                </v-card-title>
                                <v-card-text>
                                    <v-data-table
                                        :items="data.resolves"
                                        :headers="resolve_headers"
                                        :search="resolve_query"
                                        sort-by="journals[0].time"
                                        :sort-desc="true"
                                        :must-sort="true"
                                        :mobile-breakpoint="0"
                                    >
                                        <template #[`item.ip_address.ip_address`]="{item}">
                                            <NuxtLink :to="`/ip_address/${item.ip_address.id}`">
                                                {{ item.ip_address.ip_address }}
                                            </NuxtLink>
                                        </template>

                                        <template #[`item.journals[0].time`]="{item}">
                                            <v-tooltip v-if="item.journals.length >= 1" bottom>
                                                <template #activator="{on}">
                                                    <span v-on="on">{{ item.journals[0].time | distance }}</span>
                                                </template>
                                                <span>{{ item.journals[0].time | formatted }}</span>
                                            </v-tooltip>
                                        </template>
                                    </v-data-table>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col v-if="data.systems.length > 0" cols="12" sm="6">
                            <v-card>
                                <v-card-title>
                                    Systems
                                    <v-spacer />
                                    <v-text-field
                                        v-model="system_query"
                                        :prepend-icon="icons.mdiMagnify"
                                        label="Filter"
                                        single-line
                                        dense
                                        clearable
                                        hide-details
                                        @keydown.esc="system_query = ''"
                                    />
                                </v-card-title>
                                <v-card-text>
                                    <v-data-table
                                        :items="data.systems"
                                        :headers="system_headers"
                                        :search="system_query"
                                        sort-by="name"
                                        :sort-desc="true"
                                        :must-sort="true"
                                        :mobile-breakpoint="0"
                                    >
                                        <template #[`item.name`]="{item}">
                                            <NuxtLink :to="`/system/${item.id}`">
                                                {{ item.name }}
                                            </NuxtLink>
                                        </template>
                                    </v-data-table>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
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
            resolve_query: "",
            system_query: "",
            resolve_headers: [
                {text: "IP Address", value: "ip_address.ip_address"},
                {text: "Last Seen", value: "journals[0].time", filterable: false},
            ],
            system_headers: [
                {text: "System", value: "name"},
            ],
            data: null,
        }
    },
    async fetch() {
        this.start_loading("hostname")
        try {
            this.data = await this.$graphql.get_hostname(this.$nuxt.context.params.id)
            if (this.data == null) {
                if (process.server) {
                    this.$nuxt.context.res.statusCode = 404
                }
                throw {statusCode: 404, message: "Hostname not found"}
            }
        } finally {
            this.stop_loading("hostname")
        }
    },
    head() {
        if (this.data == null || this.data.hostname == null) {
            return {title: "Hostname"}
        }
        return {title: `Hostname - ${this.data.hostname}`}
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
