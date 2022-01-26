<template>
  <div>
    <label class="text-lg font-bold text-gray-700">Pembayaran</label>
    <div class="emulated-flex-gap">
      <router-link to="/setting" v-if="false" class="w-40 h-16 bg-white shadow-sm flex items-center text-gray-700 font-bold rounded-lg list-menu p-2">
        <span class="w-full">PPDB</span>
        <ChevronRightIcon class="h-5 w-5"/>
      </router-link>
      <router-link :to="{ name: 'view_pembayaran', params: { idName: 'SPP' }}"  class=" w-40 h-16 bg-white shadow-sm flex items-center text-gray-700 font-bold rounded-lg list-menu p-2">
        <span class="w-full">SPP</span>
        <ChevronRightIcon class="h-5 w-5"/>
      </router-link>
      <router-link to="/setting" v-if="false"  class=" w-40 h-16 bg-white shadow-sm flex items-center text-gray-700 font-bold rounded-lg list-menu p-2">
        <span class="w-full">PPH 1 / PPH 2</span>
        <ChevronRightIcon class="h-5 w-5"/>
      </router-link>
      <router-link to="/setting" v-if="false"  class=" w-40 h-16 bg-white shadow-sm flex items-center text-gray-700 font-bold rounded-lg list-menu p-2">
        <span class="w-full">PAS 1 / PAS 2</span>
        <ChevronRightIcon class="h-5 w-5"/>
      </router-link>
      <router-link to="/setting" v-if="false"  class=" w-40 h-16 bg-white shadow-sm flex items-center text-gray-700 font-bold rounded-lg list-menu p-2">
        <span class="w-full">UM</span>
        <ChevronRightIcon class="h-5 w-5"/>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ChevronRightIcon } from "@heroicons/vue/outline";
export default defineComponent({
  components: {
    ChevronRightIcon,
  },
});
</script>