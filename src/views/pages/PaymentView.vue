<template>
  <div>
    <label class="font-bold text-gray-700 text-lg" >Pembayaran - {{ uppercase(idName) }}</label>
    <div class="flex w-full flex-col">
        <div class="w-full p-3 text-sm h-auto bg-white shadow-sm rounded-lg flex flex-col">
          <label>Pilih Siswa</label>
          <Autocomplete :items="studentsWithClass" @on-change="find" @selected="selected" :isLoading="isLoading" :classCustom="'h-9'" :isAutoFilled="true"/>
          <div class="flex">
            <div class="w-1/2 mr-1">
              <label class="mt-2">Tahun Ajaran</label>
              <select class="w-full list-kelas p-2 rounded-lg bg-gray-100 h-9 mb-2" v-model="academicYearId">
                <option value="0"></option>
                <template v-for="academicYear in academicYears" :key="academicYear.id + '-' + academicYear.label">
                  <option :value="academicYear.id">{{academicYear.label}}</option>
                </template>
              </select>
            </div>
            <div class="w-1/2 ml-1" v-if="result.key == 'spp'">
              <label class="mt-2">Semester</label>
              <select class="w-full list-kelas p-2 rounded-lg bg-gray-100 h-9 mb-2" v-model="selectedSemester" @change="updateStatus()">
                <option></option>
                <template v-for="(item, index) in semester" :key="item.label">
                <option :value="index">{{item.label}}</option>
                </template>
              </select>
            </div>
          </div>

          <template v-if="result.key == 'spp'">
            <label>SPP</label>
            <div class="flex">
              <div class="w-1/2 mr-1">
              <select class="w-full list-kelas p-2 rounded-lg bg-gray-100 h-9 mb-2" v-model="monthFrom" :disabled="semester[selectedSemester].isPaidUntil > 5">
                <option></option>
                <template v-for="(month, idx) in months[selectedSemester]" :key="month">
                  <option :value="idx">{{month}}</option>
                </template>
              </select>
              </div>
              <div class="flex items-center">
                <label>s/d</label>
              </div>
              <div class="w-1/2 ml-1">
                <select class="w-full list-kelas p-2 rounded-lg bg-gray-100 h-9 mb-2" v-model="monthUntil" :disabled="semester[selectedSemester].isPaidUntil > 5">
                  <option></option>
                  <template v-for="(month, idx) in months[selectedSemester]" :key="month">
                      <option :value="idx" :disabled="idx < monthFrom">{{month}}</option>
                  </template>
                </select>
              </div>
            </div>
            <label class="text-xs text-green-600 font-italic" v-if="semester[selectedSemester].isPaidUntil > 5">*Spp semester {{selectedSemester + 1}} sudah lunas </label>
          </template>

          <template v-else>
            <label class="mt-2">Pilih tagihan yang ingin di bayar </label>
            <template v-if="group.length > 0">
              <div class="rounded-lg bg-gray-100 w-full h-auto flex flex-wrap p-2">
                <template v-for="item in filteredGroup" :key="'item-group' + item.id">
                  <div class="w-1/2 flex" v-if="item.key !== 'spp'">
                    <label class="flex justify-start items-start">
                      <div class="bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                        <input type="checkbox" class="opacity-0 absolute" @change="pushItem(item)" :disabled="isPaymentDisable(item)" :key="'item-key-' + item.id + '-' + academicYearId">
                        <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                      </div>
                      <div class="select-none">{{item.label}} <span class="text-xs text-green-600 italic" v-if="isPaymentDisable(item)"> Sudah di bayar</span></div>
                    </label>
                  </div>
                </template>
              </div>
            </template>
          </template>
        </div>
    
        <div class="w-full p-3 text-sm h-auto bg-white shadow-sm rounded-lg flex flex-col mt-2">
          <label>Nama : {{student ? student.name : ''}} <span v-if="student.is_orphan" class="text-red-600">*</span></label>
          <label>Kelas : {{student ? student.className : ''}}</label>
          
          <div class="border rounded-lg">
            <div class="w-full flex items-center flex-wrap text-gray-600 ">
              <div class="w-full flex border-b px-3 py-1 font-bold rounded-t-lg text-xs">
                <label class="w-1/3 mb-1">Jenis</label>
                <label class="w-1/3 mb-1">Harga</label>
                <label class="w-1/3 mb-1">Deskripsi</label>
              </div>
              <template v-for="(item, idx) in forms" :key="'spp-' + idx" >
                <div class="w-full flex border-b px-3 py-1 rounded-t-lg text-xs">
                  <label class="w-1/3 mb-1"> {{result.key === 'spp' ? 'SPP' :findLabel(item.paymentId)}} </label>
                  <label class="w-1/3 mb-1">Rp. {{item.pay.toLocaleString()}}</label>
                  <label class="w-1/3 mb-1">{{item.description}}</label>
                </div>
              </template>
              <div class="w-full flex border-b px-3 py-1 font-bold rounded-t-lg text-xs">
                <label class="w-1/2 mb-1">Total</label>
                <label class="w-1/2 mb-1">Rp. {{total.toLocaleString()}}</label>
              </div>
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
        <div class="block text-center my-2 text-sm">
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
  academicYearId: number | null;
  referId?: number | null;
  isInstalment?: boolean | null;
  id?: number | null;
}

interface Semester {
  label: string;
  isPaidUntil: number;
}

interface ItemsPayload {
  jenis: string | null;
  harga: string | null;
}

import { defineComponent } from "vue";
import Autocomplete from "@/views/components/Autocomplete.vue";
import Spinner from "@/views/components/Spinner.vue";
import { findByName, findGroup, findAll } from "@/db/action/payment";
import { findPaginated } from "@/db/action/student";
import { findAcademicYearByStudentId } from "@/db/action/academic_year";
import { Payment, PaymentDetail } from "@/db/model/payment";
import { ipcRenderer } from "electron";
import { createToast } from "mosha-vue-toastify";
// import the styling for the toast
import "mosha-vue-toastify/dist/style.css";
import {
  create,
  findByStudentIdAndAcademicYear,
} from "@/db/action/payment_detail";
import {
  monthsBySemester,
  semesterByIdx,
  paymentWithClasses,
} from "@/helper/index";

export default defineComponent({
  data() {
    return {
      idName: String,
      result: {} as any,
      group: Array<Payment>(),
      filteredGroup: Array<Payment>(),
      student: {} as any,
      students: Array<any>(),
      academicYears: Array<any>(),
      months: Array<string[]>(),
      forms: Array<NewDetail>(),
      details: Array<PaymentDetail>(),
      semester: Array<Semester>(),
      showModal: false,
      isLoading: false,
      isSubmitLoading: false,
      count: 0,
      total: 0,
      selectedSemester: 0,
      keyword: "",
      monthFrom: 0,
      monthUntil: 0,
      payload: {
        name: "",
        classId: null,
        limit: 10,
        offset: 0,
      },
      academicYearId: 0,
    };
  },
  watch: {
    monthFrom() {
      if (this.monthUntil > this.monthFrom) {
        this.createForms();
      } else {
        this.monthUntil = this.monthFrom;
      }
      this.createForms();
    },
    academicYearId(val, oldVal) {
      if (this.student) {
        this.selected(this.student.id);
      }

      if (parseInt(val) === 0) {
        this.filteredGroup = [];
      } else {
        this.filterGroup();
      }

      if (this.idName.toString() != 'spp') {
        this.forms = []
      }
    },
    student() {
      this.createForms();
    },
    semester() {
      this.monthFrom = this.semester[this.selectedSemester].isPaidUntil;
      this.monthUntil = this.semester[this.selectedSemester].isPaidUntil;
      this.createForms();
    },
    monthUntil() {
      if (this.monthUntil > this.monthFrom) {
        this.createForms();
      } else {
        this.monthUntil = this.monthFrom;
      }

      this.createForms();
    },
  },
  components: {
    Autocomplete,
    Spinner,
  },
  computed: {
    buttonDisable(): boolean {
      if (this.result.key === "spp") {
        return (
          this.forms.length === 0 ||
          Object.keys(this.student).length === 0 ||
          this.academicYearId === 0 ||
          this.semester[this.selectedSemester].isPaidUntil > 5
        );
      } else {
        return (
          this.forms.length === 0 ||
          Object.keys(this.student).length === 0 ||
          this.academicYearId === 0
        );
      }
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
      this.total = 0;
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
          description:
            this.months[this.selectedSemester][this.monthFrom + index],
          studentId: this.student.id,
          paymentId: this.result.id,
          academicYearId: this.academicYearId,
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
      this.details = await findByStudentIdAndAcademicYear(
        this.student.id,
        this.academicYearId
      );
      this.fetchAcademicYear();
      this.updateStatus();
    },
    updateStatus() {
      if (this.result.key === "spp") {
        // let value = 0;
        this.monthFrom = 0;
        this.monthUntil = 0;

        for (const idxSemester in this.months) {
          let isPaidUntil = 0;

          for (const idx in this.details) {
            const detail = this.details[idx];
            const tmpValue =
              this.months[idxSemester].findIndex((item) => {
                return item === detail.description;
              }) + 1;

            if (tmpValue > isPaidUntil) {
              isPaidUntil = tmpValue;
            }
          }

          this.semester[idxSemester].isPaidUntil = isPaidUntil;
        }
        console.log(this.semester);
        // this.monthFrom = value;
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
      createToast("Pembayaran Berhasil", {
        hideProgressBar: true,
        type: "success",
      });
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
      const academicYearIdx = this.academicYears.findIndex(i => i.id === this.academicYearId)
      const academicYear = this.academicYears[academicYearIdx]
      const items: Array<ItemsPayload> = []

      for (const idx in this.forms) {
        const payment = this.group.find(i => i.id === this.forms[idx].paymentId)!
        const label = this.idName.toString() === 'spp' ? payment.label+ ' ' + this.forms[idx].description: payment.label
        const price = payment.price!
        items.push({
          jenis: label,
          harga: price.toLocaleString()
        })
      }
      ipcRenderer.sendSync("print-pdf", { payload: {
        tanggalDibuat: '01 Januari, 2021',
        nama: this.student.name,
        kelas: academicYear.className,
        total: this.total.toLocaleString(),
        tahun: academicYear.label,
        items: items
      } });
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
      this.total = 0;
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
          academicYearId: this.academicYearId,
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
    async fetchAcademicYear() {
      this.academicYears = await findAcademicYearByStudentId(this.student.id);
      console.log(this.academicYears);
    },
    findLabel(id: number) {
      const idx = this.group.findIndex((i) => i.id! === id);
      return this.group[idx].label;
    },
    async fetchPayment() {
      this.group = await findAll();
    },
    filterGroup() {
      const filteredGroup: Array<any> = [];
      const academyIndex = this.academicYears.findIndex(
        (i) => i.id === this.academicYearId
      );
      const academyYear = this.academicYears[academyIndex];

      let paymenWithClass: string[] = [];

      for (const i in paymentWithClasses) {
        if (academyYear.className.includes(paymentWithClasses[i].classGrade)) {
          paymenWithClass = paymentWithClasses[i].payments;
        }
      }

      for (const idx in this.group) {
        const item = this.group[idx];

        if (paymenWithClass.findIndex((i) => i == item.key) > -1) {
          filteredGroup.push(item);
        }
      }

      this.filteredGroup = filteredGroup;
    },
    isPaymentDisable(item: Payment) {
      let result = false
      for (const idx in this.details) {
        const detail = this.details[idx];
        if (item.id == detail.paymentId) {
          result = true
          break
        }
      }
      return result
    },
  },
  async mounted() {
    this.months = monthsBySemester;
    for (const idx in semesterByIdx) {
      this.semester.push({
        label: semesterByIdx[idx].inString,
        isPaidUntil: 0,
      });
    }
    this.idName = this.$route.params.idName as any;
    if (this.idName.toString() === "spp") {
      this.findPayment();
    } else {
      this.fetchPayment();
    }
  },
});
</script>

<style scoped>
input:checked + svg {
  display: block;
}
</style>