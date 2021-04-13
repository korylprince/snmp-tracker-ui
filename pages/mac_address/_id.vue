<template>
    <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly">
        <v-row justify="center">
            <Error v-if="$fetchState.error" :error="$fetchState.error" />

            <v-skeleton-loader v-else-if="loading('mac_address') || data == null" type="card-heading, image" width="100%" max-width="960px" />

            <v-card v-else width="100%" max-width="960px">
                <v-card-title>
                    <v-tooltip bottom>
                        <template #activator="{on}">
                            <v-icon style="padding-right: 10px" v-on="on">
                                {{ icons.mdiCellphoneLink }}
                            </v-icon>
                        </template>
                        <span>MAC Address</span>
                    </v-tooltip>
                    {{ data.mac_address }}
                    <v-spacer />
                    <v-btn text icon color="accent" @click="$fetch">
                        <v-icon>{{ icons.mdiRefresh }}</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-subtitle v-if="data.vendor.vendor">
                    <NuxtLink :to="`/vendor/${data.vendor.vendor.prefix}`">
                        {{ data.vendor.vendor.name }}
                    </NuxtLink>
                </v-card-subtitle>

                <v-card-text>
                    <v-card v-if="data.ports.length > 0">
                        <v-card-title>
                            Assigned Ports
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
                                <template #[`item.system.name`]="{item}">
                                    <NuxtLink :to="`/system/${item.system.id}`">
                                        {{ item.system.name }}
                                    </NuxtLink>
                                </template>

                                <template #[`item.name`]="{item}">
                                    <NuxtLink :to="`/port/${item.id}`">
                                        {{ item.name }}
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

                    <v-card v-if="data.arps.length > 0">
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
                                <template #[`item.ip_address.ip_address`]="{item}">
                                    <NuxtLink :to="`/ip_address/${item.ip_address.id}`">
                                        {{ item.ip_address.ip_address }}
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

                    <v-card v-if="data.journals.length > 0">
                        <v-card-title>
                            Learned Ports
                            <v-spacer />
                            <v-text-field
                                v-model="journal_query"
                                :prepend-icon="icons.mdiMagnify"
                                label="Filter"
                                single-line
                                dense
                                clearable
                                hide-details
                                @keydown.esc="journal_query = ''"
                            />
                        </v-card-title>
                        <v-card-text>
                            <v-data-table
                                :items="data.journals"
                                :headers="journal_headers"
                                :search="journal_query"
                                sort-by="journal.time"
                                :sort-desc="true"
                                :must-sort="true"
                            >
                                <template #[`item.port.system.name`]="{item}">
                                    <NuxtLink :to="`/system/${item.port.system.id}`">
                                        {{ item.port.system.name }}
                                    </NuxtLink>
                                </template>

                                <template #[`item.port.name`]="{item}">
                                    <NuxtLink :to="`/port/${item.port.id}`">
                                        {{ item.port.name }}
                                    </NuxtLink>
                                </template>

                                <template #[`item.journal.time`]="{item}">
                                    <v-tooltip v-if="item.journal" bottom>
                                        <template #activator="{on}">
                                            <span v-on="on">{{ item.journal.time | distance }}</span>
                                        </template>
                                        <span>{{ item.journal.time | formatted }}</span>
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
            arp_query: "",
            journal_query: "",
            port_headers: [
                {text: "System", value: "system.name"},
                {text: "Name", value: "name"},
                {text: "Description", value: "description"},
                {text: "Status", value: "journals[0].status"},
                {text: "Speed", value: "journals[0].speed"},
                {text: "Last Seen", value: "journals[0].journal.time", filterable: false},
            ],
            arp_headers: [
                {text: "IP Address", value: "ip_address.ip_address"},
                {text: "Last Seen", value: "journals[0].journal.time", filterable: false},
            ],
            journal_headers: [
                {text: "System", value: "port.system.name"},
                {text: "Port", value: "port.name"},
                {text: "Description", value: "port.description"},
                {text: "VLAN", value: "vlan"},
                {text: "Last Seen", value: "journal.time", filterable: false},
            ],
            data: null,
        }
    },
    async fetch() {
        this.start_loading("mac_address")
        try {
            this.data = await this.$graphql.get_mac_address(this.$nuxt.context.params.id)
            if (this.data == null) {
                if (process.server) {
                    this.$nuxt.context.res.statusCode = 404
                }
                throw {statusCode: 404, message: "MAC Address not found"}
            }
        } finally {
            this.stop_loading("mac_address")
        }
    },
    head() {
        if (this.data == null || this.data.mac_address == null) {
            return {title: "MAC Address"}
        }
        return {title: `MAC Address - ${this.data.mac_address}`}
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
