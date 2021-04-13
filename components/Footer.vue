<template>
    <v-footer app>
        <v-row justify="center">
            <v-col
                cols="10"
                sm="10"
                offset-sm="1"
                md="8"
                offset-md="2"
                lg="6"
                offset-lg="3"
                xl="4"
                offset-xl="4"
            >
                <v-row>
                    <v-col align-self="center" style="padding-top: 20px">
                        <v-dialog
                            v-model="start_date_modal"
                            persistent
                            width="290px"
                        >
                            <template #activator="{ on, attrs }">
                                <v-text-field
                                    :value="start_date"
                                    label="Filter Start Date"
                                    :prepend-icon="icons.mdiCalendar"
                                    readonly
                                    dense
                                    color="white"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="start_date_local = start_date"
                                />
                            </template>
                            <v-date-picker v-model="start_date_local">
                                <v-spacer />
                                <v-btn text color="primary" @click="start_date_modal = false">
                                    Cancel
                                </v-btn>
                                <v-btn text color="primary" @click="do_update_start_date(start_date_local)">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-col>

                    <v-col align-self="center" style="padding-top: 20px">
                        <v-dialog
                            v-model="end_date_modal"
                            persistent
                            width="290px"
                        >
                            <template #activator="{ on, attrs }">
                                <v-text-field
                                    :value="end_date"
                                    label="Filter End Date"
                                    :prepend-icon="icons.mdiCalendar"
                                    readonly
                                    dense
                                    color="white"
                                    v-bind="attrs"
                                    pt-20
                                    v-on="on"
                                    @click="end_date_local = end_date"
                                />
                            </template>
                            <v-date-picker v-model="end_date_local">
                                <v-spacer />
                                <v-btn text color="primary" @click="end_date_modal = false">
                                    Cancel
                                </v-btn>
                                <v-btn text color="primary" @click="do_update_end_date(end_date_local)">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="2" sm="1" align-self="center">
                <v-tooltip top>
                    <template #activator="{ on, attrs }">
                        <v-btn color="accent" icon v-bind="attrs" @click="reset" v-on="on">
                            <v-icon size="32">
                                {{ icons.mdiRefreshCircle }}
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>Reset</span>
                </v-tooltip>
            </v-col>
            <v-spacer />
        </v-row>
    </v-footer>
</template>

<script>
import {mapGetters, mapActions} from "vuex"
export default {
    data() {
        return {
            start_date_local: null,
            end_date_local: null,
            start_date_modal: false,
            end_date_modal: false,
        }
    },
    computed: {
        ...mapGetters("date", ["start_date", "end_date"]),
    },
    methods: {
        ...mapActions("date", ["update_start_date", "update_end_date", "reset"]),
        do_update_start_date(val) {
            this.start_date_modal = false
            this.update_start_date(val)
        },
        do_update_end_date(val) {
            this.end_date_modal = false
            this.update_end_date(val)
        },
    },
}
</script>
