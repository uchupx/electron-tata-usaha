<template>
  <div class="relative w-full">
    <div class="flex items-center justify-start border border-gray-300 bg-gray-100 p-1 rounded-lg" :class="classCustom">
      <div class="flex w-full  p-0 rounded-full">
        <button class="flex items-center justify-center p-1 border-0 rounded-full">
          <SearchIcon class="h-5 w-5 text-gray-500"/>
        </button>
        <input type="text" class=" hover:outline-none bg-transparent ml-2 focus-within:outline-none focus:outline-none input w-full" v-model="keyword" @focus="isShow = true" @keyup="inputChange()" placeholder="Cari siswa...">
        <!-- <input type="text" class="bg-gray-100 p-2  w-full rounded-lg hover:outline-none mb-2 focus-within:outline-none focus:outline-none input"> -->
      </div>
    </div>
    <div class=" w-full absolute flex flex-col  h-auto z-10 " v-if="isShow">
      <template v-if="isLoading">
            <span class="p-2 border-b items bg-gray-100 shadow-sm flex justify-center">
              <Spinner/>
            </span>
      </template>
      <template v-else>
        <template v-for="(item, idx) in items" :key="'item' + idx">
          <template v-if="idx < 5">
            <span class="p-2 border-b items bg-gray-100 hover:bg-blue-500 hover:text-white shadow-sm" @click="selected(item)">{{item.name}}</span>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Spinner from "@/views/components/Spinner.vue";
import { SearchIcon } from "@heroicons/vue/outline";
export default defineComponent({
  data() {
    return {
      keyword: "",
      isShow: false,
    };
  },
  components: {
    Spinner,
    SearchIcon,
  },
  props: {
    items: {
      type: Array,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    classCustom: {
      type: String,
      default: "",
    },
    isAutoFilled: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    selected(item: any) {
      this.isShow = false;
      if (this.isAutoFilled) {
        this.keyword = item.name;
      } else {
        this.keyword = "";
      }
      this.$emit("selected", item.id);
    },
    inputChange() {
      this.$emit("on-change", this.keyword);
    },
  },
});
</script>
<style scoped>
.items:last-child {
  border-bottom: none;
}
</style>