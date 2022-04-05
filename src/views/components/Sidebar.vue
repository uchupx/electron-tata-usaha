<template>
  <div class="overflow-y-auto max-h-screen">
    <div class="relative top-0 left-0 w-64 bg-gray-700 min-h-screen">
      <div class="h-14  text-blue-500 text-xl font-semibold p-1 flex items-center justify-center">
        <div>Tata Usaha App</div>
      </div>
      <div class="overflow-y-auto overflow-x-hidden flex-grow">
        <ul class="flex flex-col py-4 space-y-1">
          <li class="px-5">
            <div class="flex flex-row items-center h-8">
              <div class="text-sm tracking-wide text-gray-400">Menu</div>
            </div>
          </li>
          <template v-for="route in routes" :key="route.path">
            <li v-if="route.meta.visible">
              <router-link :to="route.path" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-gray-300 hover:text-white border-l-4 border-transparent hover:border-indigo-500 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                  <template v-if="route.meta && route.meta.icon">
                    <component :is="route.meta.icon" class="h-5 w-5"/>
                  </template>
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">{{route.meta.label}}</span>
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'
export default defineComponent({
  data () {
    return {
      routes: [] as RouteRecordRaw[],
    }
  },
  mounted () {
    this.routes = this.$router.options.routes
  }
})
</script>