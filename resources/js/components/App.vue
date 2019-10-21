<template>
    <div id="app-container" :class="[theme]">
        <div id="head-top">
            <div id="theme-toggle">
                <span @click="themeSwitch" v-text="isDark ? 'Light' : 'Dark'"></span>
            </div>
        </div>
        <div id="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
let name = 'App';

/**
 * Computed properties
 */
let computed = hx.computed([
    'theme'
]);

/**
 * Is Dark theme
 */
computed.isDark = function() {
    return this.theme === 'dark';
};

/**
 * Data
 */
let data = function() {
    return {

    }
};

/**
 * Component methods
 */
let methods = hx.methods([
    'stateStoreInStorage', 'stateLoadFromStorage'
]);

/**
 * Switch theme
 */
methods.themeSwitch = function() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';

    this.stateStoreInStorage();
};

/**
 * Mounted hook.
 * Triggered once html has been injected
 */
let mounted = function() {
    this.stateLoadFromStorage();
};

/**
 * Properties passed by parent component
 */
let props = {

};

/**
 * Export component
 */
export default {
    computed,
    data,
    methods,
    mounted,
    name,
    props,
};
</script>
