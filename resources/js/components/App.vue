<template>
    <div id="app-container" :class="[theme]">
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
 * Data
 */
let data = function() {
    return {

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
