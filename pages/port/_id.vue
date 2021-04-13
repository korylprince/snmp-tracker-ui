<template>
    <v-container>
        <Error v-if="$fetchState.error" :error="$fetchState.error" />

        <v-skeleton-loader v-else-if="loading('port') || data == null" type="card-heading, image" width="100%" max-width="960px" />
        <v-card v-else width="100%" max-width="960px">
            <v-card-title>
                <v-tooltip bottom>
                    <template #activator="{on}">
                        <v-icon style="padding-right: 10px" v-on="on">
                            {{ icons.mdiEthernet }}
                        </v-icon>
                    </template>
                    <span>Port</span>
                </v-tooltip>
                <NuxtLink :to="`/system/${data.system.id}`" style="padding-right: 10px">
                    {{ data.system.name }}
                </NuxtLink>
                {{ data.name }}
                <v-spacer />
                <v-btn text icon color="accent" @click="$fetch">
                    <v-icon>{{ icons.mdiRefresh }}</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-subtitle v-if="data.mac_address || data.description">
                <span v-if="data.description">{{ data.description }}</span>
                <br>
                <NuxtLink v-if="data.mac_address" :to="`/mac_address/${data.mac_address.id}`" style="padding-right: 10px">
                    {{ data.mac_address.mac_address }}
                </NuxtLink>
                <span v-if="data.mac_address.vendor">(
                    <NuxtLink :to="`/vendor/${data.mac_address.vendor.vendor.prefix}`">
                        {{ data.mac_address.vendor.vendor.name }}
                    </NuxtLink>
                    )</span>
            </v-card-subtitle>

            <v-card-text>
                <v-row>
                    <v-col v-if="data.mac_address_journals.length > 0" cols="12" sm="6">
                        <v-card>
                            <v-card-title>
                                MAC Addresses
                                <v-spacer />
                                <v-text-field
                                    v-model="mac_address_query"
                                    :prepend-icon="icons.mdiMagnify"
                                    label="Filter"
                                    single-line
                                    dense
                                    clearable
                                    hide-details
                                    @keydown.esc="mac_address_query = ''"
                                />
                            </v-card-title>
                            <v-card-text>
                                <v-data-table
                                    :items="data.mac_address_journals"
                                    :headers="mac_address_headers"
                                    :search="mac_address_query"
                                    sort-by="journal.time"
                                    :sort-desc="true"
                                    :must-sort="true"
                                    :mobile-breakpoint="0"
                                >
                                    <template #[`item.mac_address.mac_address`]="{item}">
                                        <NuxtLink :to="`/mac_address/${item.mac_address.id}`">
                                            {{ item.mac_address.mac_address }}
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
                    </v-col>

                    <v-col v-if="data.journals.length > 0" cols="12" sm="6">
                        <v-card>
                            <v-card-title>
                                Port Status
                                <v-spacer />
                                <v-text-field
                                    v-model="status_query"
                                    :prepend-icon="icons.mdiMagnify"
                                    label="Filter"
                                    single-line
                                    dense
                                    clearable
                                    hide-details
                                    @keydown.esc="status_query = ''"
                                />
                            </v-card-title>
                            <v-card-text>
                                <v-data-table
                                    :items="data.journals"
                                    :headers="status_headers"
                                    :search="status_query"
                                    sort-by="journal.time"
                                    :sort-desc="true"
                                    :must-sort="true"
                                    :mobile-breakpoint="0"
                                >
                                    <template #[`item.status`]="{item}">
                                        {{ item.status }}
                                    </template>

                                    <template #[`item.speed`]="{item}">
                                        {{ item.speed | formatSpeed }}
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
                    </v-col>
                </v-row>

                <v-row>
                    <v-col v-if="neighbors.length > 0">
                        <v-card>
                            <v-card-title>
                                LLDP Neighbors
                                <v-spacer />
                                <v-text-field
                                    v-model="lldp_query"
                                    :prepend-icon="icons.mdiMagnify"
                                    label="Filter"
                                    single-line
                                    dense
                                    clearable
                                    hide-details
                                    @keydown.esc="lldp_query = ''"
                                />
                            </v-card-title>
                            <v-card-text>
                                <v-data-table
                                    :items="neighbors"
                                    :headers="lldp_headers"
                                    :search="lldp_query"
                                    :sort-desc="true"
                                    :must-sort="true"
                                    sort-by=".journal.time"
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

                                    <template #[`item.mac_address.mac_address`]="{item}">
                                        <NuxtLink :to="`/mac_address/${item.mac_address.id}`">
                                            {{ item.mac_address.mac_address }}
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
            mac_address_query: "",
            status_query: "",
            lldp_query: "",
            mac_address_headers: [
                {text: "MAC Address", value: "mac_address.mac_address"},
                {text: "Last Seen", value: "journal.time", filterable: false},
            ],
            status_headers: [
                {text: "Status", value: "status"},
                {text: "Speed", value: "speed"},
                {text: "Last Seen", value: "journal.time", filterable: false},
            ],
            lldp_headers: [
                {text: "System", value: "system.name"},
                {text: "Port", value: "name"},
                {text: "Description", value: "description"},
                {text: "MAC Address", value: "mac_address.mac_address"},
                {text: "Last Seen", value: "journal.time", filterable: false},
            ],
            data: null,
        }
    },
    async fetch() {
        this.start_loading("port")
        try {
            this.data = await this.$graphql.get_port(this.$nuxt.context.params.id)
            if (this.data == null) {
                if (process.server) {
                    this.$nuxt.context.res.statusCode = 404
                }
                throw {statusCode: 404, message: "Port not found"}
            }
        } finally {
            this.stop_loading("port")
        }
    },
    head() {
        if (this.data == null || this.data.name == null) {
            return {title: "Port"}
        }
        return {title: `Port - ${this.data.system.name} ${this.data.name}`}
    },
    computed: {
        ...mapGetters("loading", ["loading"]),
        ...mapGetters("date", ["dates"]),
        neighbors() {
            if (this.data == null) {
                return null
            }

            const neighbors = []
            const seen = new Set()
            for (const n of this.data.local_lldps) {
                if (seen.has(n.remote_port.id)) {
                    continue
                }
                if (n.journals.length > 0) {
                    n.remote_port.journal = n.journals[0].journal
                }
                neighbors.push(n.remote_port)
                seen.add(n.remote_port.id)
            }
            for (const n of this.data.remote_lldps) {
                if (seen.has(n.local_port.id)) {
                    continue
                }
                if (n.journals.length > 0) {
                    n.local_port.journal = n.journals[0].journal
                }
                neighbors.push(n.local_port)
                seen.add(n.local_port.id)
            }

            return neighbors
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
</template>
