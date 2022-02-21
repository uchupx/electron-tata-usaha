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
            <label class="block mb-1">: {{student.name}} <span v-if="student.is_orphan" class="text-red-600">*</span></label>
          </div>
          <!-- <div class="w-1/3">
            <label class="block mb-1">Kelas</label>
          </div>
          <div class="w-2/3">
            <label class="block mb-1">: {{student.className}}</label>
          </div> -->
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

      <label class="text-md font-bold text-gray-600 mt-2">Status Pembayaran Siswa</label>
      <template v-for="item in classes" :key="item.className">
        <div class="bg-white w-full rounded-lg p-3 text-sm shadow-sm h-auto flex flex-col mb-2">
          <label>Kelas {{item.className}}, Tahun Ajaran {{item.academicYear}}</label>
            <div class="border rounded-lg">
              <div class="w-full flex items-center flex-wrap text-gray-800 text-sm">
                <div class="w-full flex border-b px-3 py-1 bg-white text-gray-600 font-bold rounded-t-lg text-xs">
                  <label class="w-1/4 mb-1">Jenis</label>
                  <label class="w-1/3 mb-1 text-center">Status</label>
                  <label class="w-1/3 mb-1">Sisa Bayar</label>
                  <label class="w-1/3 mb-1 text-center">Deskripsi</label>
                </div>
                <template v-for="paymentItem in payments" :key="paymentItem.label + '-' + item.className">
                  <template v-if="isPaymentShow(paymentItem, item)">
                  <div class="w-full flex border-b px-3 py-1 bg-white text-gray-600 rounded-t-lg text-xs">
                    <label class="w-1/4  mb-1 font-bold">{{paymentItem.label}}</label>
                    <label class="w-1/3 text-center mb-1 " :class="statusLunas(paymentItem, item) === 'Lunas' ? 'text-green-500' : 'text-red-500'">{{statusLunas(paymentItem, item)}}</label>
                    <label class="w-1/3 mb-1">Rp. {{paymentItem.price.toLocaleString()}}</label>
                    <label class="w-1/3 text-center mb-1">-</label>
                  </div>
                  </template>
                </template>
              </div>
              <!-- {{student}} -->
            </div>
        </div>
      </template>

      <label class="text-md font-bold text-gray-600 mt-2">Rimayat Pembayaran Siswa</label>
      <div class="bg-white w-full rounded-lg p-3 text-sm shadow-sm h-auto">
        <div class="border rounded-lg">
          <div class="w-full flex items-center flex-wrap text-gray-600 ">
            <div class="w-full flex border-b px-3 py-1 font-bold rounded-t-lg text-xs">
              <label class="w-1/3 mb-1">Jenis</label>
              <label class="w-1/3 mb-1">Jumlah Bayar</label>
              <label class="w-1/3 mb-1">Deskripsi</label>
              <label class="w-1/3 mb-1">Tanggal Bayar</label>
              <!-- <label class="block mb-1"></label> -->
            </div>
            <template v-if="histories.length > 0">
              <template  v-for="history in histories" :key="'history' + history.id">
                <div class="w-full flex px-3 items-center border-b py-1 text-xs">
                  <label class="w-1/3 mb-1 font-bold">{{history.payment_name}}</label>
                  <label class="w-1/3 mb-1">Rp. {{history.pay.toLocaleString()}}</label>
                  <label class="w-1/3 mb-1">{{history.created_at}}</label>
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
import { findByStudentId } from "@/db/action/student_class";
import { findAll } from "@/db/action/payment";
import {
  findByStudentIdPaginated,
  findByStudentId as findPaymentDetails,
} from "@/db/action/payment_detail";
import { UserCircleIcon } from "@heroicons/vue/solid";
import { Payment, PaymentDetail } from "@/db/model/payment";
import PaginationButton from "@/views/components/PaginationButton.vue";

export default defineComponent({
  data() {
    return {
      studentId: String,
      count: 0,
      student: {} as any,
      classes: Array<any>(),
      details: Array<any>(),
      histories: Array<PaymentDetail>(),
      payments: Array<Payment>(),
      historiesPagination: {},
      historiesPayload: {
        limit: 10,
        offset: 0,
      },
      currentPage: 1,
    };
  },
  components: {
    UserCircleIcon,
    PaginationButton,
  },
  methods: {
    find() {
      return findById(parseInt(this.studentId.toString())).then((result) => {
        this.student = result;
      });
    },
    async findHistory() {
      console.log(this.student.id);
      await findByStudentIdPaginated(
        this.student.id,
        this.historiesPayload
      ).then((result) => {
        this.count = result.count;
        this.histories = result.rows;
      });
    },
    async findClasses() {
      await findByStudentId(this.student.id).then((result) => {
        this.classes = result;
      });
    },
    async findPayment() {
      this.payments = await findAll();
    },
    changePage(page = 1) {
      this.currentPage = page;
      this.historiesPayload.offset = this.historiesPayload.limit * (page - 1);
      return this.findHistory();
    },
    isPaymentShow(payment: Payment, item: any) {
      const paymenWithtClasses = [
        { classGrade: "7-", payments: ["ppdb", "spp", "pas", "pat", "lks"] },
        { classGrade: "8-", payments: ["du", "spp", "pas", "pat", "lks"] },
        {
          classGrade: "9-",
          payments: ["du", "spp", "pas", "pat", "uam", "lks"],
        },
      ];

      const className = item.className;
      const academicYear = item.academicYear;

      let paymenWithClass: string[] = [];

      for (const i in paymenWithtClasses) {
        if (className.includes(paymenWithtClasses[i].classGrade)) {
          paymenWithClass = paymenWithtClasses[i].payments;
        }
      }

      return paymenWithClass.includes(payment.key!);
    },
    statusLunas(payment: Payment, item: any) {
      let detail: any

      for(const idx in this.details) {
        if (this.details[idx].id === payment.id && this.details[idx].academicYearId === item.academicYearId) {
          detail = this.details[idx]
        }
      }

      return detail ? 'Lunas' : 'Belum Lunas'
    },
    statusSpp(payment: Payment, item: any) {
      let detail: any

      for(const idx in this.details) {
        if (this.details[idx].id === payment.id && this.details[idx].academicYearId === item.academicYearId) {
          detail = this.details[idx]
        }
      }

      return detail ? 'Lunas' : 'Belum Lunas'
    },
    async fetchPaymentDetails() {
      this.details = await findPaymentDetails(this.student.id);
    },
  },
  mounted() {
    this.studentId = this.$route.params.id as any;
    this.find().then(async () => {
      await this.fetchPaymentDetails();
      await this.findClasses();
      await this.findPayment();
      this.findHistory();
    });
  },
});
</script>
