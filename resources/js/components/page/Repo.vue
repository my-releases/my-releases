<template>
    <div id="repo-container">
        <div id="repo-illustration">
            <img src="/static/image/illustration/tasks.svg" alt="illustration">
        </div>
        <div id="repo-header">
            <h1 v-if="repo">
                Release notes for
                <a  target="_blank" :href="'https://github.com/' + repo.owner" v-text="repo.owner"></a> /
                <a  target="_blank" :href="'https://github.com/' + repo.owner + '/' + repo.repo" v-text="repo.repo"></a>
            </h1>
        </div>

        <div id="releases-container">
            <div v-for="release in releases" class="release">
                <div class="release-head">
                    <span class="release-version center" v-html="release.version"></span>
                    <span class="release-title" v-html="release.title"></span>
                </div>

                <div class="release-messages">
                    <div class="release-note" v-for="(change, i) in release.changes" :key="i" :class="[!change.tag ? 'no-tag' : '']">
                        <span class="tag" v-show="change.tag" :class="change.type">
                            <b class="ellipsis" v-text="change.tag"></b>
                        </span>
                        <span class="message" v-html="change.message"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let name = 'Repo';

/**
 * Computed properties
 */
let computed = {};

/**
 * Repo
 */
computed.repo = function() {
    let self = this;

    return self.$route.params;
};

/**
 * Repo name
 */
computed.repoName = function() {
    let self = this;

    return self.repo.owner + '/' + self.repo.repo;
};

/**
 * Data
 */
let data = function() {
    return {
        releases: null,
    }
};

/**
 * Component methods
 */
let methods = {};

/**
 * Fetch
 */
methods.fetch = function() {
    let self = this;

    let data = self.$route.params;

    self.$http.get(hx.api('repo'), { data }, response => {
        if (hx.invalid(response)) {
            return;
        }

        // let releases = [];
        //
        // console.log(response.data);
        // response.data.forEach((release, r) => {
        //     release.changes.forEach((change, c) => {
        //         console.log(change);
        //         release.data[r].changes[c].message = 'hmm';
        //     })
        //     // console.log(release);
        // });

        // for (let r in response.data) {
        //     if(!response.data.hasOwnProperty(r)) {
        //         continue;
        //     }
        //     let release = response.data[r];
        //
        //     for (let c in release.changes) {
        //         if (!release.changes.hasOwnProperty(c)) {
        //             continue;
        //         }
        //
        //         let change = release.changes[c];
        //
        //         console.log(change);
        //         release.changes[c].message = 'hmm';
        //     }
        // }

        self.releases = response.data;
    });

    // console.log(self.$route.params);
};

/**
 * Set title
 */
methods.titleSet = function() {
    let self = this;

    document.title = 'Release notes for ' + self.repoName;
};

/**
 * Mounted hook.
 * Triggered once html has been injected
 */
let mounted = function() {
    hx.timeout(10, this.titleSet);
};

/**
 * Properties passed by parent component
 */
let props = {

};

/**
 * Watch
 */
let watch = {};

/**
 * Watch route
 */
watch.$route = {
    immediate: true,
    handler: function() {
        this.fetch();
    }
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
    watch
};
</script>
