<template>
  <div class="flex">
    <Sidebar/>
    <div class="flex flex-col w-full">
      <Navbar/>
      <div class="bg-gray-100 p-3 h-full">
        <router-view :key="$route.fullPath"/>
      </div>
    </div>
    <template v-if="isModalOpen">
      <Modal/>
    </template>
    <notifications />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Navbar from '@/views/components/Navbar.vue'
import Sidebar from '@/views/components/Sidebar.vue'
import Modal from '@/views/components/Modal.vue'
import { mapState } from 'vuex'

export default defineComponent({
  components: {
    Navbar,
    Sidebar,
    Modal
  },
  computed: {
    ...mapState('app', ['isModalOpen'])
  }
})
</script>

<style lang="scss">
:root {
  background-color: white;
  color: black;
}
.bg-white-not-important {
  background-color: white;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.emulated-flex-gap > * {
  margin: 12px 0 0 12px;
}

.emulated-flex-gap {
  display: inline-flex;
  flex-wrap: wrap;
  margin: -12px 0 0 -12px;
  width: calc(100% + 12px);
}
</style>
