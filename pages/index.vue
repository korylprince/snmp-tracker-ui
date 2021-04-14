<template>
    <v-card width="100%" max-width="960px" :elevation="$vuetify.breakpoint.xsOnly ? 0 : null">
        <v-card-title primary-title>
            Dashboard
            <v-spacer />
            <v-btn text icon color="accent" @click="$fetch">
                <v-icon>{{ icons.mdiRefresh }}</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-subtitle v-if="updated">
            Last updated {{ updated }}
        </v-card-subtitle>

        <v-card-text>
            <v-container fluid class="dashboard">
                <v-row>
                    <v-col :md="4" cols="12" order="1" :order-md="1">
                        <v-skeleton-loader v-if="loading('stats') || data == null" type="image" />
                        <v-card v-else>
                            <v-card-title>
                                <v-icon class="mr-2">
                                    {{ icons.mdiServerNetwork }}
                                </v-icon>Systems
                            </v-card-title>
                            <v-card-text>Total: {{ data.system_aggregate.aggregate.count.toLocaleString() }}</v-card-text>
                        </v-card>
                    </v-col>
                    <v-col :md="4" cols="12" order="3" :order-md="2">
                        <v-skeleton-loader v-if="loading('stats') || data == null" type="image" />
                        <v-card v-else>
                            <v-card-title>
                                <v-icon class="mr-2">
                                    {{ icons.mdiDomain }}
                                </v-icon>Vendors
                            </v-card-title>
                            <v-card-text>Total: {{ data.vendor_aggregate.aggregate.count.toLocaleString() }}</v-card-text>
                        </v-card>
                    </v-col>
                    <v-col :md="4" cols="12" order="5" :order-md="3">
                        <v-skeleton-loader v-if="loading('stats') || data == null" type="image" />
                        <v-card v-else>
                            <v-card-title>
                                <v-icon class="mr-2">
                                    {{ icons.mdiFormTextbox }}
                                </v-icon>Hostnames
                            </v-card-title>
                            <v-card-text>Total: {{ data.hostname_aggregate.aggregate.count.toLocaleString() }}</v-card-text>
                        </v-card>
                    </v-col>
                    <v-col :md="4" cols="12" order="2" :order-md="4">
                        <v-skeleton-loader v-if="loading('stats') || data == null" type="image" />
                        <v-card v-else>
                            <v-card-title>
                                <v-icon class="mr-2">
                                    {{ icons.mdiEthernet }}
                                </v-icon>Ports
                            </v-card-title>
                            <v-card-text>Total: {{ data.port_aggregate.aggregate.count.toLocaleString() }}</v-card-text>
                        </v-card>
                    </v-col>
                    <v-col :md="4" cols="12" order="4" :order-md="5">
                        <v-skeleton-loader v-if="loading('stats') || data == null" type="image" />
                        <v-card v-else>
                            <v-card-title>
                                <v-icon class="mr-2">
                                    {{ icons.mdiCellphoneLink }}
                                </v-icon>MAC Addresses
                            </v-card-title>
                            <v-card-text>Total: {{ data.mac_address_aggregate.aggregate.count.toLocaleString() }}</v-card-text>
                        </v-card>
                    </v-col>
                    <v-col :md="4" cols="12" order="6" :order-md="6">
                        <v-skeleton-loader v-if="loading('stats') || data == null" type="image" />
                        <v-card v-else>
                            <v-card-title>
                                <v-icon class="mr-2">
                                    {{ icons.mdiIpNetworkOutline }}
                                </v-icon>IP Addresses
                            </v-card-title>
                            <v-card-text>Total: {{ data.ip_address_aggregate.aggregate.count.toLocaleString() }}</v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
import {formatRelative, parseJSON} from "date-fns"
import {mapGetters, mapMutations} from "vuex"
export default {
    data() {
        return {
            data: null,
        }
    },
    async fetch() {
        this.start_loading("stats")
        try {
            this.data = await this.$graphql.get_stats()
        } finally {
            this.stop_loading("stats")
        }
    },
    head() {
        return {
            title: "Dashboard",
        }
    },
    computed: {
        ...mapGetters("loading", ["loading"]),
        ...mapGetters("date", ["dates"]),
        updated() {
            if (this.data == null) {
                return null
            }
            return formatRelative(parseJSON(this.data.journal[0].time), new Date())
        },
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
