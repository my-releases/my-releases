import Bootstrap from "./bootstrap";

let Repo = require('./components/page/Repo.vue').default;

/**
 * Define Routes
 */
const routes = [
    // {
        // path: '/', component: require('./components/App.vue').default, children: [
            { name: 'home', path: '/', component: require('./components/page/Home.vue').default},
            { name: 'repo', path: '/:owner/:repo', component: Repo },
            { name: 'markdown', path: '/markdown', component: Repo },
            { name: 'not.found', path: '*', component: require('./components/page/NotFound.vue').default },
        // ]
    // },
];

/**
 * Global states
 */
let states = {
    theme: '' // possible value: dark
};

/**
 * Start
 */
Bootstrap
    .make(routes, states)
    .$mount('#app-wrapper');
