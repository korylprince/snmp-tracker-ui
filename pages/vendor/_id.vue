<template>
    <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly">
        <v-row justify="center">
            <Error v-if="$fetchState.error" :error="$fetchState.error" />

            <v-skeleton-loader v-else-if="loading('vendor') || data == null" type="card-heading, image" width="100%" max-width="960px" />
            <v-card v-else class="mx-auto" width="100%" max-width="960px">
                <v-card-title>
                    <v-tooltip bottom>
                        <template #activator="{on}">
                            <v-icon style="padding-right: 10px" v-on="on">
                                {{ icons.mdiDomain }}
                            </v-icon>
                        </template>
                        <span>Vendor</span>
                    </v-tooltip>
                    {{ data.name }}
                    <v-spacer />
                    <v-btn text icon color="accent" @click="$fetch">
                        <v-icon>{{ icons.mdiRefresh }}</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-subtitle>
                    {{ $route.params.id }}
                </v-card-subtitle>

                <v-card-text>
                    <v-card v-if="data.mac_addresses.length > 0">
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
                                :items="data.mac_addresses"
                                :headers="mac_address_headers"
                                :search="mac_address_query"
                                sort-by="mac_address.journals[0].journal.time"
                                :sort-desc="true"
                                :must-sort="true"
                                :mobile-breakpoint="0"
                            >
                                <template #[`item.mac_address.mac_address`]="{item}">
                                    <NuxtLink :to="`/mac_address/${item.mac_address.id}`">
                                        {{ item.mac_address.mac_address }}
                                    </NuxtLink>
                                </template>

                                <template #[`item.mac_address.journals[0].journal.time`]="{item}">
                                    <v-tooltip v-if="item.mac_address.journals.length >= 1" bottom>
                                        <template #activator="{on}">
                                            <span v-on="on">{{ item.mac_address.journals[0].journal.time | distance }}</span>
                                        </template>
                                        <span>{{ item.mac_address.journals[0].journal.time | formatted }}</span>
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
            mac_address_query: "",
            mac_address_headers: [
                {text: "MAC Address", value: "mac_address.mac_address"},
                {text: "Last Seen", value: "mac_address.journals[0].journal.time", filterable: false},
            ],
            data: null,
        }
    },
    async fetch() {
        this.start_loading("vendor")
        try {
            this.data = await this.$graphql.get_vendor(this.$nuxt.context.params.id)
            if (this.data == null) {
                if (process.server) {
                    this.$nuxt.context.res.statusCode = 404
                }
                throw {statusCode: 404, message: "Vendor not found"}
            }
        } finally {
            this.stop_loading("vendor")
        }
    },
    head() {
        if (this.data == null || this.data.name == null) {
            return {title: "Vendor"}
        }
        return {title: `Vendor - ${this.data.name}`}
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
