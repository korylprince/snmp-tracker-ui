const graphql = {
    store: null,
    gqlURL: null,

    async query(query, vars, include_dates = true) {
        const dates = this.store.getters["date/dates"]
        let variables
        if (include_dates) {
            variables = {...dates, ...vars}
        } else {
            variables = vars
        }

        const response = await fetch(this.gqlURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...this.store.getters["auth/auth_headers"],
            },
            body: JSON.stringify({query, variables}),
        })

        if (!response.ok) {
            let json
            try {
                json = await response.clone().json()
            } catch {
                throw await response.text()
            }
            throw json
        }

        const body = await response.json()

        if (body.data != null) {
            return body.data
        }

        throw body
    },
    get_stats_query: `
        query get_stats {
          hostname_aggregate {
            aggregate {
              count(columns: id)
            }
          }
          ip_address_aggregate {
            aggregate {
              count(columns: id)
            }
          }
          mac_address_aggregate {
            aggregate {
              count(columns: id)
            }
          }
          port_aggregate {
            aggregate {
              count(columns: id)
            }
          }
          system_aggregate {
            aggregate {
              count(columns: id)
            }
          }
          vendor_aggregate {
            aggregate {
              count(columns: prefix)
            }
          }
          mac_address_journal(limit: 1, order_by: {time: desc_nulls_last}) {
            time
          }
        }
    `,
    async get_stats() {
        return await this.query(this.get_stats_query, {}, false)
    },
    get_hostname_query: `
        query get_hostname($id: bigint!, $start_date: timestamp!, $end_date: timestamp!) {
          hostname_by_pk(id: $id) {
            hostname
            resolves(where: {journals: {time: {_gte: $start_date, _lte: $end_date}}}) {
              ip_address {
                id
                ip_address
              }
              journals(order_by: {time: desc}, limit: 1, where: {time: {_gte: $start_date, _lte: $end_date}}) {
                time
              }
            }
            systems {
              id
              name
            }
          }
        }
    `,
    async get_hostname(id) {
        const data = await this.query(this.get_hostname_query, {id})
        return data.hostname_by_pk
    },
    get_ip_address_query: `
        query get_ip_address($id: bigint!, $start_date: timestamp!, $end_date: timestamp!) {
          ip_address_by_pk(id: $id) {
            ip_address
            arps(where: {journals: {time: {_gte: $start_date, _lte: $end_date}}}) {
              mac_address {
                id
                mac_address
              }
              journals(order_by: {time: desc}, limit: 1, where: {time: {_gte: $start_date, _lte: $end_date}}) {
                time
              }
            }
            resolves(where: {journals: {time: {_gte: $start_date, _lte: $end_date}}}) {
              hostname {
                id
                hostname
              }
              journals(order_by: {time: desc}, limit: 1, where: {time: {_gte: $start_date, _lte: $end_date}}) {
                time
              }
            }
          }
        }
    `,
    async get_ip_address(id) {
        const data = await this.query(this.get_ip_address_query, {id})
        return data.ip_address_by_pk
    },
    get_mac_address_query: `
        query get_mac_address($id: bigint!, $start_date: timestamp!, $end_date: timestamp!) {
          mac_address_by_pk(id: $id) {
            mac_address
            vendor {
              vendor {
                prefix
                name
              }
            }
            ports(where: {journals: {time: {_gte: $start_date, _lte: $end_date}}}, order_by: {system: {name: asc}, number: asc, name: asc}) {
              id
              system {
                id
                name
              }
              name
              description
              journals(where: {port: {mac_address: {id: {_eq: $id}}}, time: {_gte: $start_date, _lte: $end_date}}, order_by: {time: desc}, limit: 1) {
                status
                speed
                time
              }
            }
            arps(where: {journals: {time: {_gte: $start_date, _lte: $end_date}}}) {
              ip_address {
                id
                ip_address
              }
              journals(order_by: {time: desc}, limit: 1, where: {time: {_gte: $start_date, _lte: $end_date}}) {
                time
              }
            }
            journals(distinct_on: port_id, order_by: {port_id: asc, time: desc, port: {system: {name: asc}, number: asc, name: asc}}, where: {time: {_gte: $start_date, _lte: $end_date}}) {
              port {
                id
                system {
                  id
                  name
                }
                name
                description
              }
              vlan
              time
            }
          }
        }
    `,
    async get_mac_address(id) {
        const data = await this.query(this.get_mac_address_query, {id})
        return data.mac_address_by_pk
    },
    get_port_query: `
        query get_port($id: bigint!, $start_date: timestamp!, $end_date: timestamp!) {
          port_by_pk(id: $id) {
            system {
              id
              name
            }
            name
            description
            mac_address {
              id
              mac_address
              vendor {
                vendor {
                  prefix
                  name
                }
              }
            }
            mac_address_journals(distinct_on: mac_address_id, order_by: {mac_address_id: asc, time: desc}, where: {time: {_gte: $start_date, _lte: $end_date}}) {
              mac_address {
                id
                mac_address
              }
              time
            }
            local_lldps(order_by: {remote_port: {system: {name: asc}, number: asc, name: asc}}, where: {journals: {time: {_gte: $start_date, _lte: $end_date}}}) {
              remote_port {
                id
                system {
                  id
                  name
                }
                name
                description
                mac_address {
                  id
                  mac_address
                }
              }
              journals(order_by: {time: desc}, limit: 1, where: {time: {_gte: $start_date, _lte: $end_date}}) {
                time
              }
            }
            remote_lldps(order_by: {local_port: {system: {name: asc}, number: asc, name: asc}}, where: {journals: {time: {_gte: $start_date, _lte: $end_date}}}) {
              local_port {
                id
                system {
                  id
                  name
                }
                name
                description
                mac_address {
                  id
                  mac_address
                }
              }
              journals(order_by: {time: desc}, limit: 1, where: {time: {_gte: $start_date, _lte: $end_date}}) {
                time
              }
            }
            journals(distinct_on: [status, speed], order_by: {status: asc, speed: asc, time: desc}, where: {time: {_gte: $start_date, _lte: $end_date}}) {
              status
              speed
              time
            }
          }
        }
    `,
    async get_port(id) {
        const data = await this.query(this.get_port_query, {id})
        return data.port_by_pk
    },
    get_system_query: `
        query get_system($id: bigint!, $start_date: timestamp!, $end_date: timestamp!) {
          system_by_pk(id: $id) {
            name
            hostname {
              id
              hostname
            }
            ports(order_by: {number: asc, name: asc}, where: {journals: {time: {_gte: $start_date, _lte: $end_date}}}) {
              id
              name
              description
              mac_address {
                id
                mac_address
              }
              journals(limit: 1, order_by: {time: desc}, where: {time: {_gte: $start_date, _lte: $end_date}}) {
                status
                speed
                time
              }
            }
          }
        }
    `,
    async get_system(id) {
        const data = await this.query(this.get_system_query, {id})
        return data.system_by_pk
    },
    get_vendor_query: `
        query get_vendor($id: String!, $start_date: timestamp!, $end_date: timestamp!) {
          vendor_by_pk(prefix: $id) {
            name
            mac_addresses {
              mac_address {
                id
                mac_address
                journals(limit: 1, order_by: {time: desc}, where: {time: {_gte: $start_date, _lte: $end_date}}) {
                  time
                }
              }
            }
          }
        }

    `,
    async get_vendor(id) {
        const data = await this.query(this.get_vendor_query, {id})
        return data.vendor_by_pk
    },
    search_query: `
        query search($search: String!, $start_date: timestamp!, $end_date: timestamp!) {
          hostname(where: {hostname: {_ilike: $search}, resolves: {journals: {time: {_gte: $start_date, _lte: $end_date}}}}) {
            id
            hostname
          }
          system(where: {name: {_ilike: $search}}) {
            id
            name
          }
          vendor(where: {prefix: {_eq: $search}}) {
            prefix
          }
        }
    `,
    async search(search) {
        return await this.query(this.search_query, {search})
    },
    search_mac_address_query: `
        query search($search: String!, $start_date: timestamp!, $end_date: timestamp!) {
          mac_address(where: {mac_address: {_eq: $search}, journals: {time: {_gte: $start_date, _lte: $end_date}}}) {
            id
          }
        }
    `,
    async search_mac_address(search) {
        return (await this.query(this.search_mac_address_query, {search})).mac_address
    },
    search_ip_address_query: `
        query search($search: String!, $start_date: timestamp!, $end_date: timestamp!) {
          ip_address(where: {ip_address: {_eq: $search}, _or: [{arps: {journals: {time: {_gte: $start_date, _lte: $end_date}}}}, {resolves: {journals: {time: {_gte: $start_date, _lte: $end_date}}}}]}) {
            id
          }
        }
    `,
    async search_ip_address(search) {
        return (await this.query(this.search_ip_address_query, {search})).ip_address
    },
}

export default ({store, $config}, inject) => {
    graphql.store = store
    graphql.gqlURL = $config.gqlURL
    inject("graphql", graphql)
}
