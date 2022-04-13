import fs from 'fs'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'frontend',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // { rel: 'stylesheet', type: 'image/x-icon', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css' },
    ],
    script: [
      // {
      //   src: "/js/jquery.min.js",
      //   body: true
      // },
      // {
      //   src: "/js/popper.js",
      //   body: true
      // },
      // {
      //   src: "/js/bootstrap.min.js",
      //   body: true
      // },
      {
        src: "/js/script.js",
        body: true
      }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // './static/css/poppins.css',
    './static/scss/helper.scss',
    './static/css/font_family.css',
    './static/css/font-awesome/scss/font-awesome.scss',
    './static/css/style.css',
    './static/scss/ck.scss',
    './static/scss/style.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/tagsInput.js', mode: 'client' },
    { src: '~/plugins/paginate.js', mode: 'client' },
    { src: '~/plugins/vueModal.js', mode: 'client' },
    { src: '~/plugins/time-ago.js', mode: 'client' },
    { src: '~/plugins/loading.js', mode: 'client' },
    { src: '~/plugins/fragment.js', mode: 'client' },
    { src: '~/plugins/mixins.js' },
    { src: '~/plugins/vTooltip.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    // 'bootstrap-vue/nuxt',
    '@nuxtjs/dotenv',
    '@nuxtjs/toast',
    'cookie-universal-nuxt',
    '@nuxtjs/firebase',
    '@nuxtjs/auth',
  ],
  
  firebase: {
    config: {
      apiKey: "AIzaSyAdMgYsdBWTNi7Ax5hLpKTTjn0Nwh4NUkA",
      authDomain: "core-port-336010.firebaseapp.com",
      databaseURL: "https://core-port-336010-default-rtdb.firebaseio.com",
      projectId: "core-port-336010",
      storageBucket: "core-port-336010.appspot.com",
      messagingSenderId: "185442058467",
      appId: "1:185442058467:web:f1a154080255a9cd2945d6",
      measurementId: "G-S2WFSJWQJR",
    },
    services: {
      messaging: {
        createServiceWorker: false,
        fcmPublicVapidKey: 'BATShgr6k1cwlYQhCVJp2X4XIosMrw7tI_N5M1Uch155XNnKKyJFKMtwxb_nTq5UIwhtSMu42PHvIFi-IpvqEU8',
        inject: fs.readFileSync('./static/firebase-messaging-sw.js')
      }
    }
  },
  auth: {
    strategies: {
      google: {
        client_id: '604819076500-d6clg4mom6qva476p79r3a9vvl1lob5h.apps.googleusercontent.com'
      },
    },
    vuex: {
      namespace: 'socialAuth'
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      sass: {
        implementation: require('sass'),
      },
      scss: {
        implementation: require('sass'),
      },
    },
  },
  env: {
    API_URL: process.env.API_URL || 'https://backend-manage-time.herokuapp.com/api',
  },
}
