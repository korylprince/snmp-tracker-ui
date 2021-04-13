export default {
    head: {
        titleTemplate: "SNMP Tracker - %s",
        title: "SNMP Tracker",
        htmlAttrs: {
            lang: "en",
        },
        meta: [
            {charset: "utf-8"},
            {name: "viewport", content: "width=device-width, initial-scale=1"},
            {hid: "description", name: "description", content: "SNMP Tracker"},
            {hid: "author", name: "author", content: "Kory Prince <korylprince@gmail.com>"},
        ],
        __dangerouslyDisableSanitizersByTagID: {
            author: ["content"],
        },
    },

    css: [
        "~/assets/main.sass",
    ],

    plugins: [
        "~/plugins/mixins.js",
        "~/plugins/validation.js",
        "~/plugins/graphql.js",
    ],

    components: true,

    buildModules: [
        "@nuxtjs/eslint-module",
        "@nuxtjs/vuetify",
        "@nuxtjs/pwa",
    ],

    router: {
        middleware: ["auth"],
    },

    modules: [
        "cookie-universal-nuxt",
        "@nuxtjs/proxy",
    ],

    vuetify: {
        defaultAssets: false,
        theme: {
            dark: true,
            themes: {
                dark: {
                    primary: "#2257a4",
                    accent: "#5d83d6",
                    anchor: "#5d83d6",
                },
            },
        },
    },

    build: {
        hotMiddleware: {
            client: {
                overlay: false,
            },
        },
        transpile: ["vee-validate/dist/rules"],
    },

    env: {
        authPrefixURL: process.env.AUTH_PREFIX_URL || "http://localhost:3000/api/1.0",
        gqlURL: process.env.GRAPHQL_URL || "http://localhost:3000/v1/graphql",
    },
    ...process.env.PROXY_BASE !== "" && {
        proxy: {
            "/api": process.env.PROXY_BASE,
            "/v1/graphql": process.env.PROXY_BASE,
        },
    },
}