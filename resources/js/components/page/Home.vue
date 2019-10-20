<template>
    <div>
        Component html here {{name}}
    </div>
</template>

<script>
let name = 'Home';

/**
 * Computed properties
 */
let computed = hx.computed({
    name
});

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
