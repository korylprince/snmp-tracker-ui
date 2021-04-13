<template>
    <Error :error="error" />
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
