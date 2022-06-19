<template>
  <div class="flex">
    <template v-if="shouldLogin && !logginedUser">
      <Login/>
    </template>
    <template v-else>
      <Sidebar/>
      <div class="flex flex-col w-full flex-2 max-h-screen">
        <Navbar class="flex1"/>
        <div class="bg-gray-300 p-3 h-full overflow-y-auto">
          <router-view :key="$route.fullPath"/>
        </div>
      </div>
      <template v-if="isModalOpen">
        <Modal/>
      </template>
    </template>
    <notifications />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/views/components/Navbar.vue";
import Sidebar from "@/views/components/Sidebar.vue";
import Modal from "@/views/components/Modal.vue";
import Login from "@/views/pages/Login.vue";
import { mapState, mapActions } from "vuex";
import { ipcRenderer } from "electron";

export default defineComponent({
  components: {
    Navbar,
    Sidebar,
    Modal,
    Login,
  },
  computed: {
    ...mapState("app", ["isModalOpen", "shouldLogin", "logginedUser"]),
  },
  methods: {
    ...mapActions("app", ["initialize"]),
    getRootPath() {
      const result = ipcRenderer.sendSync('get-root-path')
      return result
    }
  },
  mounted() {
    this.initialize(this.getRootPath());
  },
});
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
.flex1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.emulated-flex-gap {
  display: inline-flex;
  flex-wrap: wrap;
  margin: -12px 0 0 -12px;
  width: calc(100% + 12px);
}
</style>
