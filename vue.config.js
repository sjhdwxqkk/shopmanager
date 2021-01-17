module.exports = {
   configureWebpack: {
       resolve: {
           extensions:[],
           alias: {
            'assets':'@/assets',
            'common':'@/common',
            'components':'@/components',
            'network':'@/network',
            'views':'@/views',
           }
       },
       // externals: {
       //     vue: 'Vue',
       //     'vue-router': 'VueRouter',
       //     axios: 'axios',
       //     lodash: '_',
       //     echarts: 'echarts',
       //     nprogress: 'NProgress',
       //     'vue-quill-editor': 'VueQuillEditor'
       // }
   }
}