<template>
    <div>
      <div class="flex">
          <div class="w-1/2 h-28 items bg-white rounded shadow-sm flex flex-col p-3 justify-center text-4xl text-gray-600">
            <label class="text-xl">Jumlah Siswa</label>
            <div class="flex">
              <UsersIcon class=" h-9 w-9 mr-3" />  <span>{{countStudent}} </span>
            </div>
          </div>
          <!-- <div class="w-1/2 h-28 items bg-white rounded shadow-sm flex flex-col p-3 justify-center text-4xl text-gray-600">
            <label class="text-xl">Jumlah Siswa</label>
            <div class="flex">
              <button type="button" @click="doPrint">Test print</button>
            </div>
          </div> -->
      </div>
      <div class="flex mt-2">
        <div class="w-full h-auto items bg-white rounded shadow-sm p-3 text-gray-600 text-xs">
            <label class="text-lg ">Aktivitas pembayaran</label>
            <div class="border rounded-lg">
              <div class="w-full flex items-center flex-wrap text-gray-800 ">
                <div class="w-full flex border-b px-3 py-1 bg-white text-gray-600 font-bold rounded-t-lg">
                  <label class="w-1/5 mb-1">Id</label>
                  <label class="w-1/2 mb-1">Nama Siswa</label>
                  <label class="w-1/3 mb-1">Jenis</label>
                  <label class="w-1/3 mb-1">Jumlah Bayar</label>
                  <label class="w-1/3 mb-1">Deskripsi</label>
                </div>
                <template v-if="details.length > 0">
                  <template  v-for="history in details" :key="'history' + history.id">
                    <div class="w-full flex px-3 items-center border-b py-1">
                      <label class="w-1/5 mb-1 font-semibold text-gray-600">#{{history.id}}</label>
                      <label class="w-1/2 mb-1">{{history.student_name}}</label>
                      <label class="w-1/3 mb-1">{{history.payment_name}}</label>
                      <label class="w-1/3 mb-1">Rp. {{history.pay.toLocaleString()}}</label>
                      <label class="w-1/3 mb-1">{{history.description}}</label>
                      <!-- <label class="block mb-1"></label> -->
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div class="w-full text-center text-sm px-3 py-1">
                      <label class="block mb-1">Belum ada riwayat pembayaran</label>
                  </div>
                </template>
              </div>
              <!-- {{student}} -->
            </div>
            <PaginationButton :limit="historiesPayload.limit" :currentPage="currentPage" :pageItems="details.length" :count="countHistory" @change-page="changePage"/>
        </div>
    </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { countStudents } from "@/db/action/student";
import { UsersIcon } from "@heroicons/vue/outline";
import { remote, ipcRenderer } from "electron";
import { findPaginated } from "@/db/action/payment_detail";
import PaginationButton from "@/views/components/PaginationButton.vue";
export default defineComponent({
  setup() {
    const doPrint = async () => {
      ipcRenderer.sendSync("print-pdf", { message: "test apa saja" });
      // console.log(ipcRenderer.sendSync("ping"));
    };
    return { doPrint };
  },
  data() {
    return {
      countStudent: 0,
      countHistory: 0,
      details: Array<any>(),
      historiesPagination: {},
      historiesPayload: {
        limit: 10,
        offset: 0,
      },
      currentPage: 1,
    };
  },
  components: {
    UsersIcon,
    PaginationButton,
  },
  methods: {
    changePage(page = 1) {
      this.currentPage = page;
      this.historiesPayload.offset = this.historiesPayload.limit * (page - 1);
      return this.findHistory();
    },
    async findHistory() {
      await findPaginated(this.historiesPayload).then((result) => {
        this.countHistory = result.count;
        this.details = result.rows;
      });
    },
  },
  async mounted() {
    this.countStudent = await countStudents();
    await this.findHistory();
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