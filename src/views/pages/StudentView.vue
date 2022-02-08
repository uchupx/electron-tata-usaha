<template>
  <div>
    <template v-if="student">
      <label class="text-lg font-bold text-gray-600">Data Siswa</label>
      <div class="flex bg-white w-full rounded-lg p-3 shadow-sm h-auto">
        <div class="mr-3">
          <UserCircleIcon class=" w-24 h-24 text-gray-600"/>
        </div>
        <div class="w-full flex items-center flex-wrap text-gray-800">
          <div class="w-1/3">
            <label class="block mb-1">Nama</label>
          </div>
          <div class="w-2/3">
            <label class="block mb-1">: {{student.name}}</label>
          </div>
          <div class="w-1/3">
            <label class="block mb-1">Kelas</label>
          </div>
          <div class="w-2/3">
            <label class="block mb-1">: {{student.className}}</label>
          </div>
          <div class="w-1/3">
            <label class="block mb-1">Jenis Kelamin</label>
          </div>
          <div class="w-2/3">
            <label class="block mb-1">: {{student.gender}}</label>
          </div>
          <div class="w-1/3">
            <label class="block mb-1">Alamat</label>
          </div>
          <div class="w-2/3">
            <label class="block mb-1">: {{student.address}}</label>
          </div>
          <!-- {{student}} -->
        </div>
      </div>
      <label class="text-md font-bold text-gray-600 mt-2">Rimayat Pembayaran Siswa</label>
      <div class="bg-white w-full rounded-lg p-3 text-sm shadow-sm h-auto">
        <div class="border rounded-lg">
          <div class="w-full flex items-center flex-wrap text-gray-800 ">
            <div class="w-full flex border-b px-3 py-1 bg-gray-600 text-white rounded-t-lg">
              <label class="w-1/5 mb-1">Id</label>
              <label class="w-1/3 mb-1">Jenis</label>
              <label class="w-1/3 mb-1">Jumlah Bayar</label>
              <label class="w-1/3 mb-1">Deskripsi</label>
              <!-- <label class="block mb-1"></label> -->
            </div>
            <template v-if="histories.length > 0">
              <template  v-for="history in histories" :key="'history' + history.id">
                <div class="w-full flex px-3 items-center border-b py-1">
                  <label class="w-1/5 mb-1 font-semibold text-gray-600">#{{history.id}}</label>
                  <label class="w-1/3 mb-1">{{history.payment_name}}</label>
                  <label class="w-1/3 mb-1">Rp. {{history.pay}}</label>
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
        <PaginationButton :limit="historiesPayload.limit" :currentPage="currentPage" :pageItems="histories.length" :count="count" @change-page="changePage"/>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { findById } from "@/db/action/student";
import { Student } from "@/db/model/student";
import { findByStudentIdPaginated } from "@/db/action/payment_detail";
import { UserCircleIcon } from "@heroicons/vue/solid";
import { PaymentDetail } from "@/db/model/payment";
import PaginationButton from "@/views/components/PaginationButton.vue";

export default defineComponent({
  data() {
    return {
      studentId: String,
      count: 0,
      student: {} as any,
      histories: Array<PaymentDetail>(),
      historiesPagination: {},
      historiesPayload: {
        limit: 10,
        offset: 0,
      },
      currentPage: 1
    };
  },
  components: {
    UserCircleIcon,
    PaginationButton
  },
  methods: {
    find() {
      return findById(parseInt(this.studentId.toString())).then((result) => {
        this.student = result;
      });
    },
    async findHistory() {
      console.log(this.student.id)
      await findByStudentIdPaginated(this.student.id, this.historiesPayload).then((result) => {
          this.count = result.count;
          this.histories = result.rows;
      })
    },
    changePage(page = 1) {
      this.currentPage = page;
      this.historiesPayload.offset = this.historiesPayload.limit * (page - 1);
      return this.findHistory();
    },
  },
  mounted() {
    this.studentId = this.$route.params.id as any;
    this.find().then(() => {
      this.findHistory()
    });
  },
});
</script>
