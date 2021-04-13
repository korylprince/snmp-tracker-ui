<template>
    <v-snackbar
        :value="show"
        bottom
        app
        elevation="10"
        style="padding-bottom: 60px; /* fix dynamic footer padding */"
        :color="feedback.error ? 'error darken-4' : 'accent'"
        @input="close"
    >
        {{ feedback.msg }}
    </v-snackbar>
</template>

<script>
import {mapMutations, mapGetters} from "vuex"
export default {
    data() {
        return {
            timeout: false,
        }
    },
    computed: {
        ...mapGetters("feedback", ["feedback"]),
        show() {
            return !this.timeout && this.feedback.msg
        },
    },
    methods: {
        ...mapMutations("feedback", ["remove_msg"]),
        close(val) {
            if (val) {return}

            this.timeout = true
            window.setTimeout(() => {
                this.timeout = false
            }, 500)
            window.setTimeout(() => {
                this.remove_msg()
            }, 200)
        },
    },
}
</script>
