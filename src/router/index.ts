import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '@/views/pages/Dashboard.vue'
import Setting from '@/views/pages/Setting.vue'
import Student from '@/views/pages/Student.vue'
import Import from '@/views/pages/Import.vue'
import StudentView from '@/views/pages/StudentView.vue'
import Payment from '@/views/pages/Payment.vue'
import PaymentView from '@/views/pages/PaymentView.vue'
import Activity from '@/views/pages/Activity.vue'
import { CogIcon, HomeIcon, UsersIcon, CashIcon, UploadIcon } from '@heroicons/vue/outline'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'dashboard',
    meta: {
      icon: HomeIcon,
      visible: true,
      label: 'Dashboard',

    },
    component: Dashboard
  },
  {
    path: '/payment',
    name: 'pembayaran',
    meta: {
      icon: CashIcon,
      visible: true,
      label: 'Pembayaran',
    },
    component: Payment
  },
  {
    path: '/payment/:idName',
    name: 'view_pembayaran',
    meta: {
      icon: CashIcon,
      visible: false,
      label: 'view_pembayaran',
    },
    component: PaymentView
  },
  {
    path: '/siswa',
    name: 'siswa',
    meta: {
      icon: UsersIcon,
      visible: true,
      label: 'Siswa',
    },
    component: Student
  },
  {
    path: '/siswa/:id',
    name: 'view_siswa',
    meta: {
      icon: UsersIcon,
      visible: false,
      label: 'view_siswa',
    },
    component: StudentView
  },
  {
    path: '/import',
    name: 'import',
    meta: {
      icon: UploadIcon,
      visible: true,
      label: 'Import',
    },
    component: Import
  },
  {
    path: '/setting',
    name: 'pengaturan',
    meta: {
      icon: CogIcon,
      visible: true,
      label: 'Pengaturan',
    },
    component: Setting
  },
  {
    path: '/activity',
    name: 'aktivitas',
    meta: {
      icon: CogIcon,
      visible: false,
      label: 'Activity',
    },
    component: Activity
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
