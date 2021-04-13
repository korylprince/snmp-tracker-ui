<template>
    <v-card max-width="300px" style="margin: auto;">
        <v-icon v-if="error.statusCode === 404" size="128" style="width: 100%">
            {{ icons.mdiMagnify }}
        </v-icon>
        <v-icon v-else size="128" style="width: 100%">
            {{ icons.mdiAlertCircleOutline }}
        </v-icon>
        <v-card-title style="justify-content: center">
            <span v-if="error.statusCode === 404 && error.message">
                {{ error.message }}
            </span>
            <span v-else-if="error.statusCode === 404 && !error.message">
                Page not found
            </span>
            <span v-else>
                An error occurred
            </span>
        </v-card-title>

        <v-card-text v-if="error.statusCode !== 404">
            Details:
            {{ JSON.stringify(error) }}
        </v-card-text>

        <v-card-actions>
            <v-spacer />
            <v-btn to="/" text color="accent">
                Go to Dashboard
            </v-btn>
            <v-spacer />
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        error: {
            type: Object,
            required: true,
            default: () => {},
        },
    },
}
</script>
