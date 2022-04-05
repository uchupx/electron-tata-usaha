<template>
  <div>
    <template v-if="student">
      <label class="text-lg font-bold text-gray-600">Data Siswa</label>
      <div class="flex flex-col bg-white w-full rounded-lg p-3 shadow-sm h-auto">
        <div class="flex w-full">
          <div class="mr-3">
            <UserCircleIcon class=" w-24 h-24 text-gray-600"/>
          </div>
          <div class="w-full flex items-center flex-wrap text-gray-800">
            <div class="w-1/3">
              <label class="block mb-1">Nama</label>
            </div>
            <div class="w-2/3">
              <template v-if="editMode">
                <input type="text" class="bg-gray-100 border border-gray-300 p-2 h-9 w-full rounded-lg hover:outline-none  mb-1 focus-within:outline-none focus:outline-none input" v-model="student.name"  placeholder="Nama siswa">
              </template>
              <label v-else class="block mb-1">: {{student.name}} <span v-if="student.is_orphan" class="text-red-600">*</span></label>
            </div>
            <div class="w-1/3">
              <label class="block mb-1">Jenis Kelamin</label>
            </div>
            <div class="w-2/3">
              <template v-if="editMode">
                <select class="w-full list-kelas p-2 rounded-lg mb-1 bg-gray-100 h-9 border-gray-700 border" v-model="student.gender">
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </template>
              <label v-else class="block mb-1">: {{student.gender}}</label>
            </div>
            <div class="w-1/3">
              <label class="block mb-1">Alamat</label>
            </div>
            <div class="w-2/3">
              <template v-if="editMode">
                <textarea class="bg-gray-100 border border-gray-300 p-2 w-full rounded-lg hover:outline-none  mb-1 focus-within:outline-none focus:outline-none input" v-model="student.address">
                </textarea>
              </template>
              <label v-else class="block mb-1">: {{student.address}}</label>
            </div>
          </div>
          </div>
        <div class="flex justify-end">
          <template v-if="editMode">
            <button type="button" class="bg-red-500 p-2 text-white hover:bg-red-600 rounded-md mr-2" @click="editMode= false">Batal</button>
            <button type="button" class="bg-green-500 p-2 text-white hover:bg-green-600 rounded-md" @click="submit">Simpan Perubahan</button>
          </template>
          <template v-else>
            <!-- <button type="button" :disabled="true" class="bg-red-500 p-2 text-white hover:bg-red-600 rounded-md" @click="editMode= true">Hapus Siswa</button> -->
            <button type="button" class="bg-blue-500 p-2 text-white hover:bg-blue-600 rounded-md" @click="editMode= true">Ubah Siswa</button>
          </template>
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
                  <label class="w-1/3 mb-1">Jumlah Bayaran</label>
                  <label class="w-1/3 mb-1">Sisa Bayaran</label>
                  <label class="w-1/3 mb-1 text-center">Deskripsi</label>
                </div>
                <template v-for="paymentItem in payments" :key="paymentItem.label + '-' + item.className">
                  <template v-if="isPaymentShow(paymentItem, item)">
                  <div class="w-full flex border-b px-3 py-1 bg-white text-gray-600 rounded-t-lg text-xs">
                    <label class="w-1/4  mb-1 font-bold">{{paymentItem.label}}</label>
                    <label class="w-1/3 text-center mb-1 " v-if="paymentItem.key === 'spp'" :class="statusSpp(paymentItem, item) === 'Terbayarkan' ? 'text-green-500' : 'text-red-500'">{{statusSpp(paymentItem, item)}}</label>
                    <label class="w-1/3 text-center mb-1 " v-else :class="statusLunas(paymentItem, item) === 'Lunas' ? 'text-green-500' : 'text-red-500'">{{statusLunas(paymentItem, item)}}</label>
                    <label class="w-1/3 mb-1">Rp. {{paymentItem.key === 'spp' ? '-' : totalPay(paymentItem, item).toLocaleString()}}</label>
                    <label class="w-1/3 mb-1">Rp. {{paymentItem.key === 'spp' ? '-' : (paymentItem.price - totalPay(paymentItem, item)).toLocaleString()}}</label>
                    <label class="w-1/3 text-center mb-1">{{paymentItem.key === 'spp' ? sppDescription(paymentItem, item) : '-'}}</label>
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
                  <label class="w-1/3 mb-1">{{history.description}}</label>
                  <label class="w-1/3 mb-1">{{dateToHumanize(history.created_at)}}</label>
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
import { findById, update } from "@/db/action/student";
import { findByStudentId } from "@/db/action/student_class";
import { findAll } from "@/db/action/payment";
import {
  findByStudentIdPaginated,
  findByStudentId as findPaymentDetails,
} from "@/db/action/payment_detail";
import { UserCircleIcon } from "@heroicons/vue/solid";
import { Payment, PaymentDetail } from "@/db/model/payment";
import PaginationButton from "@/views/components/PaginationButton.vue";
import { paymentWithClasses } from "@/helper/index";
import moment from "moment";
import { DetailsPaginatedPayload } from "@/db/enums/paginated";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

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
      } as DetailsPaginatedPayload,
      currentPage: 1,
      editMode: false,
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
      const paymenWithtClasses = paymentWithClasses;

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
    totalPay(payment: Payment, item: any) {
      let detail: any;
      let totalPay = 0;

      for (const idx in this.details) {
        if (
          this.details[idx].id === payment.id &&
          this.details[idx].academicYearId === item.academicYearId
        ) {
          detail = this.details[idx];
          totalPay = totalPay + detail.pay;
        }
      }

      return totalPay;
    },
    statusLunas(payment: Payment, item: any) {
      const totalPay = this.totalPay(payment, item);

      return totalPay === payment.price ? "Lunas" : "Belum Lunas";
    },
    statusSpp(payment: Payment, item: any) {
      let detail: any;

      for (const idx in this.details) {
        if (
          this.details[idx].id === payment.id &&
          this.details[idx].academicYearId === item.academicYearId
        ) {
          detail = this.details[idx];
        }
      }

      return detail ? "Terbayarkan" : "Belum Lunas";
    },
    sppDescription(payment: Payment, item: any) {
      let detail: any;

      for (const idx in this.details) {
        if (
          this.details[idx].id === payment.id &&
          this.details[idx].academicYearId === item.academicYearId
        ) {
          detail = this.details[idx];
        }
      }

      if (detail) {
        return detail.description;
      } else {
        return "-";
      }
    },
    async fetchPaymentDetails() {
      this.details = await findPaymentDetails(this.student.id);
    },
    dateToHumanize(date: string) {
      return moment(date).format("DD MMMM YYYY");
    },
    async submit() {
      await update(this.student);

      createToast("Berhasil menyimpan perubahan data", {
        hideProgressBar: true,
        type: "success",
      });

      this.editMode = false;
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
