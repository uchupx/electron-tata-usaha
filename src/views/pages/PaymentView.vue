<template>
  <div>
    <label class="font-bold text-gray-700 text-lg" >Pembayaran - {{ uppercase(idName) }}</label>
    <div class="flex w-full flex-col">
      <div class="flex w-full">
        <div class="w-1/2 p-3 text-sm h-auto bg-white shadow-sm rounded-lg mr-2 flex flex-col">
          <label>Pilih Siswa</label>
          <Autocomplete :items="studentsWithClass" @on-change="find" @selected="selected" :isLoading="isLoading" :classCustom="'h-9'" :isAutoFilled="false"/>

          <template v-if="result.key == 'spp'">
            <label>SPP bulan</label>
            <select class="w-full list-kelas p-2 rounded-lg bg-gray-100 h-9 mb-2" v-model="monthFrom">
              <option></option>
              <template v-for="(month, idx) in months" :key="month">
                <option :value="idx">{{month}}</option>
              </template>
            </select>
            <label>s/d bulan</label>
            <select class="w-full list-kelas p-2 rounded-lg bg-gray-100 h-9 mb-2" v-model="monthUntil">
              <option></option>
              <template v-for="(month, idx) in months" :key="month">
                  <option :value="idx" :disabled="idx < monthFrom">{{month}}</option>
              </template>
            </select>
          </template>

          <template v-else>
            <label class="mt-2">Jenis Bayaran : {{result.label}}</label>
            <template v-if="group.length > 0">
              <div class="rounded-lg bg-gray-100 w-full h-auto flex flex-col p-2">
                <template v-for="item in group" :key="'item-group' + item.id">
                  <label class="flex justify-start items-start">
                    <div class="bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                      <input type="checkbox" class="opacity-0 absolute" @change="pushItem(item)">
                      <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                    </div>
                    <div class="select-none">{{item.label}}</div>
                  </label>
                </template>
              </div>
            </template>
          </template>
        </div>
        <div class="w-1/2 p-3 text-sm h-auto bg-white shadow-sm rounded-lg flex flex-col">
          <label>Nama : {{student ? student.name : ''}}</label>
          <label>Kelas : {{student ? student.className : ''}}</label>
          <label class="mb-0">SPP</label>
          <!-- <label>s/d bulan</label> -->
          <hr class="mb-1 mt-1">
          <template v-for="(item, idx) in forms" :key="'spp-' + idx" >
            <div class="flex text-xs ml-3">
              <label class="w-full">{{result.key === 'spp' ? item.description : paymentLabel(item.paymentId)}}</label>
              <label>Rp.{{item.pay}}</label>
            </div>
          </template>
          <hr class="mb-1 mt-1">
          <div class="flex">
            <label class="w-full">Total: </label>
            <label>Rp.{{total}}</label>
          </div>
        </div>
      </div>
      <button type="button" @click="submit" :disabled="buttonDisable" :class="buttonDisable || isSubmitLoading? 'cursor-not-allowed opacity-50' : ''"  class="w-full bg-blue-600 p-2 mt-2 rounded-lg text-white flex justify-center">
        <template v-if="isSubmitLoading">
          <Spinner/>
        </template>
        <template v-else>
          Simpan
        </template>
      </button>
    </div>
    <div v-if="showModal" class="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
      <div class="absolute bg-black opacity-50 inset-0 z-0" @click="closeModal"></div>
      <div class="h-auto w-auto bg-white z-50 p-3 rounded-lg">
        Pembayaran berhasil, simpan struk pembayaran ?
        <div class="block text-center my-2">
          <button type="button" class="p-2 rounded-lg bg-red-500 text-white mr-2" @click="closeModal">Tidak</button>
          <button type="button" class="p-2 rounded-lg bg-blue-500 text-white" @click="savePdf">Simpan</button>
        </div>
      </div>
      <!-- <component :is="modalComponent"></component> -->
    </div>
    <!-- <template v-if="result">
      {{result}}
    </template> -->
  </div>
</template>
<script lang="ts">
interface NewDetail {
  pay: number;
  description: string | null;
  studentId: number | null;
  paymentId: number | null;
  referId?: number | null;
  isInstalment?: boolean | null;
  id?: number | null;
}

import { defineComponent } from "vue";
import Autocomplete from "@/views/components/Autocomplete.vue";
import Spinner from "@/views/components/Spinner.vue";
import { findByName, findGroup } from "@/db/action/payment";
import { findPaginated } from "@/db/action/student";
import {
  create,
  findByPaymentIdAndStudentId,
} from "@/db/action/payment_detail";
import { Student } from "@/db/model/student";
import { Payment } from "@/db/model/payment";
import { ipcRenderer } from "electron";
import { createToast } from 'mosha-vue-toastify';
// import the styling for the toast
import 'mosha-vue-toastify/dist/style.css'

export default defineComponent({
  // setup() {
  //   const savePdf = () => {
  //     this.showMo
  //     ipcRenderer.sendSync("print-pdf", { message: "test apa saja" });
  //   };

  //   return { savePdf };
  // },
  data() {
    return {
      idName: String,
      result: {} as any,
      group: Array<Payment>(),
      student: {} as any,
      students: Array<any>(),
      count: 0,
      total: 0,
      showModal: false,
      keyword: "",
      months: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Augustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
      monthFrom: 0,
      monthUntil: 0,
      isLoading: false,
      payload: {
        name: "",
        classId: null,
        limit: 10,
        offset: 0,
      },
      isSubmitLoading: false,
      forms: Array<NewDetail>(),
    };
  },
  watch: {
    monthFrom() {
      if (this.monthUntil > this.monthFrom) {
        return;
      } else {
        this.monthUntil = this.monthFrom;
      }
      this.createForms();
    },
    student() {
      this.createForms();
    },
    monthUntil() {
      this.createForms();
    },
  },
  components: {
    Autocomplete,
    Spinner,
  },
  computed: {
    buttonDisable(): boolean {
      return this.forms.length === 0 || Object.keys(this.student).length === 0;
    },
    studentsWithClass(): { id: number; name: string }[] {
      const students = [];
      for (const i in this.students) {
        students.push({
          id: this.students[i].id!,
          name: this.students[i].className + "  " + this.students[i].name!,
        });
      }
      return students;
    },
  },
  methods: {
    createForms() {
      console.log("masiul");
      if (this.result.key !== "spp") {
        return;
      }
      if (Object.keys(this.student).length === 0) {
        return;
      }
      this.forms = [];
      for (
        let index = 0;
        index < this.monthUntil - this.monthFrom + 1;
        index++
      ) {
        this.forms.push({
          pay: parseInt(this.result.price),
          description: this.months[this.monthFrom + index],
          studentId: this.student.id,
          paymentId: this.result.id,
          // referId: "",
          // isInstalment: "",
        });
      }
      this.forms.forEach((i) => {
        this.total = this.total + i.pay;
      });
      return;
    },
    async selected(id: any) {
      this.student = this.students.find((item) => item.id === id);
      const detail = await findByPaymentIdAndStudentId(
        this.result.id,
        this.student.id
      );
      if (detail) {
        this.monthFrom =
          this.months.findIndex((item) => item === detail?.description) + 1;
      }
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
    async submit() {
      this.isSubmitLoading = true;
      for (const i in this.forms) {
        const form = this.forms[i];
        await create(form);
      }
      createToast('Pembayaran Berhasil', {
        hideProgressBar: true,
        type: 'success'
      })
      this.showModal = true;
      this.isSubmitLoading = false;
      // this.$router.push({ name: "pembayaran" });
    },
    closeModal() {
      this.showModal = false;
      this.$router.push({ name: "pembayaran" });
    },
    uppercase(str: string) {
      const tmp = str.toString();
      return tmp.toUpperCase();
    },
    savePdf() {
      ipcRenderer.sendSync("print-pdf", { message: "test apa saja" });
      this.closeModal();
    },
    findPayment() {
      return findByName(this.idName.toString()).then((response) => {
        this.result = response;
        return findGroup(this.result.key).then((res: any) => {
          this.group = res;
        });
      });
    },
    pushItem(item: Payment) {
      const idx = this.forms.findIndex((i) => i.paymentId === item.id);
      if (idx > -1) {
        const tmp = this.forms.filter((i) => i.paymentId != item.id);
        this.forms = tmp;
      } else {
        this.forms.push({
          pay: Number(item.price),
          description: "Bayar " + item.label,
          studentId: this.student.id,
          paymentId: item.id,
          // referId: "",
          // isInstalment: "",
        });
      }

      this.forms.forEach((i) => {
        this.total = this.total + i.pay;
      });
    },
    paymentLabel(id: number) {
      const idx = this.group.findIndex((i) => i.id === id);
      return this.group[idx].label;
    },
  },
  async mounted() {
    this.idName = this.$route.params.idName as any;
    this.findPayment();
  },
});
</script>

<style scoped>
input:checked + svg {
  display: block;
}
</style>