export const mapState = normalizeNamespace((namespace, states) => {
    const res = {};
    normalizeMap(states).forEach(({ key, val }) => {
        res[key] = {
            get: function mappedState () {
                let state = this.$store.state;
                let getters = this.$store.getters;
                let getterVal = namespace + val;

                if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
                    return
                }
                if ((getterVal in this.$store.getters)) {
                    return this.$store.getters[getterVal]
                }

                if (namespace) {
                    const module = getModuleByNamespace(this.$store, 'mapState', namespace);
                    if (!module) {
                        return
                    }
                    state = module.context.state;
                    getters = module.context.getters
                }

                return typeof val === 'function'
                    ? val.call(this, state, getters)
                    : state[val]
            },
            set: function (...args) {
                let tempVal = namespace + val;

                if (namespace && !getModuleByNamespace(this.$store, 'mapMutations', namespace)) {
                    return
                }
                return this.$store.commit.apply(this.$store, [tempVal].concat(args))
            }
        }
    });

    return res
});

export const mapStateMutations = normalizeNamespace((namespace, states) => {
    const res = {};
    normalizeMap(states).forEach(({ key, val }) => {
        res[key] = function (state, data) {
            state[key] = data;
        }
    });

    return res
});

function normalizeMap (map) {
    return Array.isArray(map)
        ? map.map(key => ({ key, val: key }))
        : Object.keys(map).map(key => ({ key, val: map[key] }))
}

function normalizeNamespace (fn) {
    return (namespace, map) => {
        if (typeof namespace !== 'string') {
            map = namespace;
            namespace = ''
        } else if (namespace.charAt(namespace.length - 1) !== '/') {
            namespace += '/'
        }
        return fn(namespace, map)
    }
}

function getModuleByNamespace (store, helper, namespace) {
    const module = store._modulesNamespaceMap[namespace];
    if (!module) {
        console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`)
    }
    return module
}
