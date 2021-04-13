<template>
    <v-card width="100%" max-width="480px">
        <v-card-title primary-title>
            <div class="headline">
                Sign In
            </div>
        </v-card-title>

        <validation-observer ref="form" v-slot="{invalid}">
            <form novalidate @submit.prevent="do_sign_in(username, password)">
                <v-card-text>
                    <validation-provider v-slot="{errors}" name="username" rules="required">
                        <v-text-field
                            v-model="username"
                            label="Username"
                            :error-messages="errors"
                            required
                        />
                    </validation-provider>

                    <validation-provider v-slot="{errors}" name="password" rules="required">
                        <v-text-field
                            v-model="password"
                            :type="show_password ? 'text' : 'password'"
                            :append-icon="show_password ? '{{icons.mdiEye}}' : '{{icons.mdiEyeOff}}'"
                            label="Password"
                            :error-messages="errors"
                            required
                            @click:append="show_password = !show_password"
                        />
                    </validation-provider>

                    <span v-if="error" class="error--text">{{ error }}</span>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        type="submit"
                        color="primary"
                        text
                        :loading="loading('sign_in')"
                        :disabled="invalid || username === '' || password === ''"
                    >
                        Sign In
                    </v-btn>
                </v-card-actions>
            </form>
        </validation-observer>
    </v-card>
</template>

<script>
import {mapMutations, mapGetters, mapActions} from "vuex"
export default {
    data() {
        return {
            username: "",
            password: "",
            show_password: false,
            error: null,
        }
    },
    head() {
        return {
            title: "Sign in",
        }
    },
    meta: {
        auth: false,
        sign_in: true,
    },
    computed: {
        ...mapGetters("loading", ["loading"]),
    },
    methods: {
        ...mapMutations("loading", ["start_loading", "stop_loading"]),
        ...mapActions("auth", ["sign_in"]),
        async do_sign_in(username, password) {
            if (this.loading("sign_in") || !(await this.$refs.form.validate())) {
                return
            }

            this.error = null

            this.start_loading("sign_in")
            try {
                await this.sign_in({username, password})
                this.$router.push(this.$route.query.next || "/")
            } catch (err) {
                if (err.code === 401) {
                    this.error = "Invalid username or password"
                    return
                }
                this.error = "Unknown error occurred. Please contact your administrator"
                console.error("Unknown error occurred:", {type: "sign_in", body: err})
            } finally {
                this.stop_loading("sign_in")
            }
        },
    },
}
</script>
