<template>
    <v-app :class="{mobile: $vuetify.breakpoint.xsOnly}">
        <v-app-bar color="primary" dense app>
            <v-container
                fluid
                :px-0="$vuetify.breakpoint.xsOnly"
                :px-5="$vuetify.breakpoint.smAndUp"
            >
                <v-row align="center" justify="center">
                    <v-col>
                        <v-row align="center" justify="start">
                            <NuxtLink class="toolbar-title" to="/">
                                <v-toolbar-title v-if="$vuetify.breakpoint.xsOnly">
                                    <v-icon>{{ icons.mdiRadar }}</v-icon>
                                </v-toolbar-title>
                                <v-toolbar-title v-else>
                                    SNMP Tracker
                                </v-toolbar-title>
                            </NuxtLink>
                        </v-row>
                    </v-col>
                    <v-col :cols="$vuetify.breakpoint.xsOnly ? 8 : 6">
                        <v-row align="center" justify="center">
                            <Search v-if="signed_in" style="max-width: 640px" />
                        </v-row>
                    </v-col>
                    <v-col v-if="signed_in">
                        <v-row align="center" justify="end">
                            <v-menu offset-y>
                                <template #activator="{ on, attrs }">
                                    <v-avatar color="white" size="32" v-bind="attrs" v-on="on">
                                        <span class="primary--text">{{ initials }}</span>
                                    </v-avatar>
                                </template>
                                <v-list>
                                    <v-list-item @click="do_sign_out">
                                        <v-list-item-title>
                                            Sign out
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-app-bar>

        <v-main>
            <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly">
                <v-layout justify-center>
                    <Nuxt />
                </v-layout>
            </v-container>
        </v-main>

        <Footer v-if="signed_in" />
        <Feedback />
    </v-app>
</template>

<script>
import {mapState, mapGetters, mapActions} from "vuex"
export default {
    name: "App",
    computed: {
        ...mapState("auth", ["display_name"]),
        ...mapGetters("auth", ["signed_in", "initials"]),
    },
    methods: {
        ...mapActions("auth", ["sign_out"]),
        async do_sign_out() {
            this.$router.push(await this.sign_out())
        },
    },
}
</script>

<style lang="sass" scoped>
.theme--dark.v-application.mobile
    background-color: #1e1e1e

.toolbar-title
    color: inherit
    cursor: pointer
    text-decoration: none

    &:hover
        font-weight: bold
.v-main
    padding-bottom: 84px !important // workaround: https://github.com/vuetifyjs/vuetify/issues/11121
</style>
