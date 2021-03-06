/**
* @author Sambit Sahoo <soulsam480@hotmail.com>
* @version 0.1.0
*/

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import store from './stores/index'
import { sequelize } from "./getdb"
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// todo sqlite db
sequelize.authenticate().then(() => console.log("connected")
).catch((err: any) => console.log(err))

const app = createApp(App)
app.use(store).use(router).mount('#app')

