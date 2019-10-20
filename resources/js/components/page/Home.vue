<template>
    <div id="home-container">
        <div id="repo-illustration">
            <img src="/static/image/illustration/tasks.svg" alt="illustration" />
        </div>

        <div id="home-title">
            My <span>Release Notes</span>
        </div>

        <div class="search-input">
            <input type="text"
                   autofocus
                   v-model="repo"
                   @keyup.enter="search"
                   placeholder="Github Repo (eg: https://github.com/vuejs/vue)" />
        </div>
    </div>
</template>

<script>
let name = 'Home';

/**
 * Computed properties
 */
let computed = {};

/**
 * Data
 */
let data = function() {
    return {
        repo: ''
    }
};

/**
 * Component methods
 */
let methods = {};

/**
 * Search
 */
methods.search = function() {
    let self = this;

    let data = {
        repo: self.repo
    };

    self.$http.post(hx.api('repo/validate'), { data }, response => {
        if(hx.invalid(response)) {
            return;
        }

        if (!response.data.valid) {
            hx.notify('Invalid repository given.');
            return;
        }

        self.$router.push(response.data.path);
    })
};

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
