import Bootstrap from "./bootstrap";

/**
 * Define Routes
 */
const routes = [
    {
        path: '/', component: require('./components/App.vue').default, children: [
            { name: 'home', path: '', component: require('./components/page/Home.vue').default},
            { name: 'repo', path: ':owner/:repo', component: require('./components/page/Repo.vue').default },
            { name: 'not.found', path: '*', component: require('./components/page/NotFound.vue').default },
        ]
    },
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
    .$mount('#application');
