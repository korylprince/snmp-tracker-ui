import Vue from "vue"
import {format, formatDistanceToNow, parseJSON} from "date-fns"
import {
    mdiAlertCircleOutline,
    mdiCalendar,
    mdiCellphoneLink,
    mdiDomain,
    mdiEthernet,
    mdiEye,
    mdiEyeOff,
    mdiFormTextbox,
    mdiHelpCircleOutline,
    mdiIpNetworkOutline,
    mdiMagnify,
    mdiRadar,
    mdiRefresh,
    mdiRefreshCircle,
    mdiServerNetwork,
} from "@mdi/js"

if (!Vue.__filters_mixin__) {
    Vue.__filters_mixin__ = true
    Vue.mixin({
        filters: {
            distance(val) {
                if (val == null) {return null}
                return formatDistanceToNow(parseJSON(val), {addSuffix: true})
            },
            formatted(val) {
                if (val == null) {return null}
                return format(parseJSON(val), "yyyy-MM-dd pp")
            },
            formatSpeed(val) {
                if (val === 0) return "0"

                const k = 1024
                const sizes = ["Mb", "Gb", "Tb"]

                const i = Math.floor(Math.log(val) / Math.log(k))

                return parseFloat((val / Math.pow(k, i)).toFixed(0)) + " " + sizes[i]
            },
        },
    })
}

if (!Vue.__icons_mixin__) {
    Vue.__icons_mixin__ = true
    Vue.mixin({
        computed: {
            icons() {
                return {
                    mdiAlertCircleOutline,
                    mdiCalendar,
                    mdiCellphoneLink,
                    mdiDomain,
                    mdiEthernet,
                    mdiEye,
                    mdiEyeOff,
                    mdiFormTextbox,
                    mdiHelpCircleOutline,
                    mdiIpNetworkOutline,
                    mdiMagnify,
                    mdiRadar,
                    mdiRefresh,
                    mdiRefreshCircle,
                    mdiServerNetwork,
                }
            },
        },

    })
}
