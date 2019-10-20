<template>
    <div id="app-container" :class="{dark}">
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
let computed = {};

/**
 * Data
 */
let data = function() {
    return {
        dark: true
    }
};

/**
 * Component methods
 */
let methods = {};

/**
 * Mounted hook.
 * Triggered once html has been injected
 */
let mounted = function() {

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
