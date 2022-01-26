<template>
  <div>
    <div class="w-full h-auto bg-white shadow-sm rounded-lg p-3">
      <label class="text-xl">Data Siswa</label>
      <div class="">
        <!-- <label>List Kelas</label> -->
        <div class="flex">
          <select class="w-1/3 list-kelas p-2 rounded-lg bg-gray-100 h-9" v-model="payload.classId" @change="changePage(1)">
            <option value=""></option>
            <template v-for="c in classes" :key="c.name">
              <option :value="c.id">{{c.name}}</option>
            </template>
          </select>
          <input type="text" class="bg-gray-100 p-2 h-9 w-full rounded-lg hover:outline-none ml-2 focus-within:outline-none focus:outline-none input" v-model="keyword" @keyup="changePage(1)" placeholder="Cari siswa...">
        </div>
      </div>
    </div>
    <div class="w-full h-auto mt-4">
      <div class="flex px-3 mb-2">
        <div class="w-1/5">#</div>
        <div class="w-1/2">Nama</div>
        <div class="w-1/5">Kelas</div>
        <div class="w-1/5"></div>
      </div>
      <template v-if="isLoading">
          <div class="w-full h-auto rounded-lg px-3 py-2 text-sm bg-white shadow-sm list-siswa flex justify-center">
            <Spinner/>
          </div>
      </template>
      <template v-else>
        <template v-for="student in students" :key="student.name">
          <div
            class="
              w-full
              h-auto
              rounded-lg
              px-3
              py-2
              text-sm
              bg-white
              shadow-sm
              list-siswa
            "
          >
            <div class="flex">
              <div class="w-1/5 flex items-center">
                <label class="mb-0">{{ student.id }}</label>
              </div>
              <div class="w-1/2 flex items-center">
                <label class="mb-0">{{ student.name }}</label>
              </div>
              <div class="w-1/5 flex items-center">
                <label class="mb-0">{{ student.className }}</label>
              </div>
              <div class="w-1/5 text-right">
                <button type="button" class="bg-blue-500 p-2 rounded-lg" @click="viewStudent(student)">
                  <EyeIcon class="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </template>
      <PaginationButton :limit="payload.limit" :currentPage="currentPage" :pageItems="students.length" :count="count" @change-page="changePage"/>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { findPaginated } from "@/db/action/student";
import { findAll } from "@/db/action/class";
import { Student } from "@/db/model/student";
import { EyeIcon } from "@heroicons/vue/solid";
import PaginationButton from "@/views/components/PaginationButton.vue";
import Spinner from "@/views/components/Spinner.vue";
import { Class } from "@/db/model/class";
// import {vueOp} from '@/db/enums/types'
// import { } from '@types/'
export default defineComponent({
  data() {
    return {
      students: Array<Student>(),
      count: 0,
      classes: Array<Class>(),
      currentPage: 1,
      isLoading: false,
      keyword: '',
      payload: {
        name: '',
        classId: '',
        limit: 10,
        offset: 0,
      },
    };
  },
  components: {
    EyeIcon,
    PaginationButton,
    Spinner,
  },
  methods: {
    find() {
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
    changePage(page = 1) {
      this.payload.name = ''
      if (this.keyword.trim() !== '') {
        this.payload.name = this.keyword
      }
      this.currentPage = page;
      // if (page !== 1 ) {
      this.payload.offset = this.payload.limit * (page - 1);
      // }
      return this.find();
    },
    viewStudent (student: Student) {
      this.$router.push({name: 'view_siswa', params:{id: student.id as any}})
    }
  },
  async mounted() {
    this.find();
    this.classes = await findAll()
  },
});
</script>
<style scoped>
.list-kelas {
  margin-right: 1rem;
  margin-bottom: 1rem;
}
.list-kelas:last-child {
  margin-right: 0;
}
.list-siswa {
  margin-bottom: 0.25rem;
}
.list-siswa:last-child {
  margin-bottom: 0;
}
</style>