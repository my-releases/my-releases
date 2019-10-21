<template>
    <div id="repo-container">
        <div id="repo-illustration">
            <img src="/static/image/illustration/tasks.svg" alt="illustration">
        </div>
        <div id="repo-header">
            <h1 v-if="repo">
                <a href="/" class="btn btn-xs">&laquo;</a>
                Release notes for
                <template v-if="isMarkdown">
                    <a target="_blank" :href="repoName" v-text="repoName"></a>
                </template>
                <template v-if="!isMarkdown">
                    <a target="_blank" :href="'https://github.com/' + repo.owner" v-text="repo.owner"></a> /
                    <a target="_blank" :href="'https://github.com/' + repo.owner + '/' + repo.repo" v-text="repo.repo"></a>
                </template>
            </h1>
        </div>

        <div id="releases-error">
            <span v-text="error"></span>
        </div>

        <div id="releases-container" v-if="releases && releases.length">
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
        <div v-if="releases && releases.length === 0">
            <h3>- No Release Notes Found.</h3>
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

computed.isMarkdown = function() {
    return this.$route.name === 'markdown';
}

/**
 * Repo name
 */
computed.repoName = function() {
    let self = this;

    if (self.isMarkdown) {
        return self.$route.query.url;
    }

    return self.repo.owner + '/' + self.repo.repo;
};

/**
 * Data
 */
let data = function() {
    return {
        releases: null,
        error: null
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

    if(self.$route.name === 'markdown') {
        data = self.$route.query || {};
        data.type = 'markdown';
    }

    self.releases = null;
    self.$http.get(hx.api('repo'), { data }, response => {
        if (hx.invalid(response)) {
            return;
        }

        if (response.data.error) {
            self.error = response.data.error;
            return;
        }

        self.releases = response.data;
    });

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
