export default async function({store, route, redirect}) {
    const auth = route.meta.reduce((auth, meta) => auth && !(meta.auth === false), true)
    if (!auth) {
        const sign_in = route.meta.reduce((sign_in, meta) => sign_in || meta.sign_in === true, false)
        if (sign_in && store.getters["auth/signed_in"]) {
            redirect("/")
        }
        return
    }
    if (!store.getters["auth/signed_in"]) {
        redirect(await store.dispatch("auth/sign_out"))
    }
}
