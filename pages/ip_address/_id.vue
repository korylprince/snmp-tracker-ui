<template>
    <v-container>
        <Error v-if="$fetchState.error" :error="$fetchState.error" />

        <v-skeleton-loader v-else-if="loading('ip_address') || data == null" type="card-heading, image" width="100%" max-width="960px" />
        <v-card v-else width="100%" max-width="960px">
            <v-card-title>
                <v-tooltip bottom>
                    <template #activator="{on}">
                        <v-icon style="padding-right: 10px" v-on="on">
                            {{ icons.mdiIpNetworkOutline }}
                        </v-icon>
                    </template>
                    <span>IP Address</span>
                </v-tooltip>
                {{ data.ip_address }}
                <v-spacer />
                <v-btn text icon color="accent" @click="$fetch">
                    <v-icon>{{ icons.mdiRefresh }}</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col v-if="data.arps.length > 0" cols="12" sm="6">
                        <v-card>
                            <v-card-title>
                                ARP Lookups
                                <v-spacer />
                                <v-text-field
                                    v-model="arp_query"
                                    :prepend-icon="icons.mdiMagnify"
                                    label="Filter"
                                    single-line
                                    dense
                                    clearable
                                    hide-details
                                    @keydown.esc="arp_query = ''"
                                />
                            </v-card-title>
                            <v-card-text>
                                <v-data-table
                                    :items="data.arps"
                                    :headers="arp_headers"
                                    :search="arp_query"
                                    sort-by="journals[0].journal.time"
                                    :sort-desc="true"
                                    :must-sort="true"
                                    :mobile-breakpoint="0"
                                >
                                    <template #[`item.mac_address.mac_address`]="{item}">
                                        <NuxtLink :to="`/mac_address/${item.mac_address.id}`">
                                            {{ item.mac_address.mac_address }}
                                        </NuxtLink>
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
                    </v-col>

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
                                    sort-by="journals[0].journal.time"
                                    :sort-desc="true"
                                    :must-sort="true"
                                    :mobile-breakpoint="0"
                                >
                                    <template #[`item.hostname.hostname`]="{item}">
                                        <NuxtLink :to="`/hostname/${item.hostname.id}`">
                                            {{ item.hostname.hostname }}
                                        </NuxtLink>
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
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import {mapGetters, mapMutations} from "vuex"
export default {
    data() {
        return {
            arp_query: "",
            resolve_query: "",
            arp_headers: [
                {text: "MAC Address", value: "mac_address.mac_address"},
                {text: "Last Seen", value: "journals[0].journal.time", filterable: false},
            ],
            resolve_headers: [
                {text: "Hostname", value: "hostname.hostname"},
                {text: "Last Seen", value: "journals[0].journal.time", filterable: false},
            ],
            data: null,
        }
    },
    async fetch() {
        this.start_loading("ip_address")
        try {
            this.data = await this.$graphql.get_ip_address(this.$nuxt.context.params.id)
            if (this.data == null) {
                if (process.server) {
                    this.$nuxt.context.res.statusCode = 404
                }
                throw {statusCode: 404, message: "IP Address not found"}
            }
        } finally {
            this.stop_loading("ip_address")
        }
    },
    head() {
        if (this.data == null || this.data.ip_address == null) {
            return {title: "IP Address"}
        }
        return {title: `IP Address - ${this.data.ip_address}`}
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
