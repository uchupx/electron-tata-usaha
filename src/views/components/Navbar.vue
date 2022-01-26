<template>
  <nav class="flex h-14 items-center justify-between flex-wrap bg-white shadow-sm p-2">
    <div class="flex items-center flex-no-shrink text-white mr-6">
      <!-- <span class="font-semibold text-xl tracking-tight">Tata Usaha</span> -->
    </div>
    <div class="block w-full max-w-xl">
      <Autocomplete :items="studentsWithClass" @on-change="find" @selected="selected" :isLoading="isLoading" :isAutoFilled="false"/>
    </div>
  </nav>
</template>

<script lang="ts">
import { Student } from "@/db/model/student";
import { defineComponent } from "vue";
import { findPaginated } from "@/db/action/student";
import Autocomplete from "@/views/components/Autocomplete.vue";

// import {SearchIcon } from '@heroicons/vue/solid'
export default defineComponent({
  data() {
    return {
      students: Array<Student>(),
      payload: {
        name: "",
        classId: null,
        limit: 10,
        offset: 0,
      },
      count: 0,
      isLoading: false,
    };
  },
  components: {
    Autocomplete,
  },
  computed: {
    studentsWithClass(): { id: number; name: string }[] {
      const students = [];
      for (const i in this.students) {
        students.push({
          id: this.students[i].id!,
          name: this.students[i].name!,
        });
      }
      return students;
    },
  },
  methods: {
    async selected(id: any) {
      this.$router.push({name: 'view_siswa', params:{id: id}})
    },
    find(name: string) {
      this.payload.name = name;
      this.isLoading = true;
      findPaginated(this.payload)
        .then((result) => {
          this.count = result.count;
          this.students = result.rows;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
</script>