<template>
    <div>
      <div class="flex">
          <div class="w-1/2 h-28 items bg-white rounded shadow-sm flex flex-col p-3 justify-center text-4xl text-gray-600">
            <label class="text-xl">Jumlah Siswa</label>
            <div class="flex">
              <UsersIcon class=" h-9 w-9 mr-3" />  <span>{{countStudent}} </span>
            </div>
          </div>
          <div class="w-1/2 h-28 items bg-white rounded shadow-sm flex flex-col p-3 justify-center text-4xl text-gray-600">
            <label class="text-xl">Jumlah Siswa</label>
            <div class="flex">
              <UsersIcon class=" h-9 w-9 mr-3" />  <span>{{countStudent}} </span>
            </div>
          </div>
      </div>
      <div class="flex mt-2">
        <div class="w-1/2 h-28 items bg-white rounded shadow-sm">

        </div>
        <div class="w-1/2 h-28 items bg-white rounded shadow-sm">

        </div>
    </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { countStudents } from "@/db/action/student";
import { UsersIcon } from "@heroicons/vue/outline";
export default defineComponent({
  data() {
    return {
      countStudent: 0,
    };
  },
  components: {
    UsersIcon,
  },
  async mounted() {
    this.countStudent = await countStudents();
  },
});
</script>
<style scoped>
.items {
  margin-right: 0.5rem;
}
.items:last-child {
  margin-right: 0;
}
</style>