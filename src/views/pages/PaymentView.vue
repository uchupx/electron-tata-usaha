<template>
  <div>
    <label class="font-bold text-gray-700 text-lg" >Pembayaran</label>
    <div class="flex w-full flex-col">
        <div class="w-full p-3 text-sm h-auto bg-white shadow-sm rounded-lg flex flex-col">
          <label>Pilih Siswa</label>
          <Autocomplete :items="studentsWithClass" @on-change="find" @selected="selected" :isLoading="isLoading" :classCustom="'h-9'" :isAutoFilled="true"/>
          <div class="flex">
            <div class="w-1/2 mr-1">
              <label class="mt-2">Tahun Ajaran</label>
              <select class="w-full list-kelas p-2 rounded-lg border border-gray-300 bg-gray-100 h-9 mb-2" v-model="academicYearId">
                <option value="0"></option>
                <template v-for="academicYear in academicYears" :key="academicYear.id + '-' + academicYear.label">
                  <option :value="academicYear.id">{{academicYear.label}}</option>
                </template>
              </select>
            </div>
            <div class="w-1/2 ml-1" v-if="showSpp">
              <label class="mt-2">Semester</label>
              <select class="w-full list-kelas p-2 border border-gray-300 rounded-lg bg-gray-100 h-9 mb-2" v-model="selectedSemester" @change="updateStatus()">
                <option></option>
                <template v-for="(item, index) in semester" :key="item.label">
                <option :value="index">{{item.label}}</option>
                </template>
              </select>
            </div>
          </div>

          <!-- <template v-else> -->
            <label class="mt-2">Pilih tagihan yang ingin di bayar </label>
            <template v-if="group.length > 0">
              <div class="rounded-lg border border-gray-300 bg-gray-100 w-full h-auto flex flex-wrap p-2">
                <template v-for="item in filteredGroup" :key="'item-group' + item.id">
                  <div class="w-1/2 flex">
                    <label class="flex justify-start items-start">
                      <div class="bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                        <input type="checkbox" class="opacity-0 absolute" @change="pushItem(item)" :disabled="item.key != 'spp' && isPaymentDisable(item) == 0 " :key="'item-key-' + item.id + '-' + academicYearId">
                        <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                      </div>
                      <div class="select-none">{{item.label}} 
                        <template v-if="item.key != 'spp'">
                          <span class="text-xs text-green-600 italic" v-if="isPaymentDisable(item) == 0"> Sudah di bayar</span>
                          <span class="text-xs text-yellow-400 italic" v-else-if="isPaymentDisable(item) != item.price">Sisa bayar Rp. {{isPaymentDisable(item).toLocaleString()}}</span>
                        </template>
                      </div>
                    </label>
                  </div>
                </template>
              </div>
            </template>
          <!-- </template> -->
          <template v-if="showSpp">
            <label>SPP</label>
            <div class="flex">
              <div class="w-1/2 mr-1">
              <select class="w-full list-kelas p-2 border border-gray-300 rounded-lg bg-gray-100 h-9 mb-2" v-model="monthFrom" :disabled="semester[selectedSemester].isPaidUntil > 5">
                <option></option>
                <template v-for="(month, idx) in months[selectedSemester]" :key="month">
                  <option :value="idx" :disabled="idx < semester[selectedSemester].isPaidUntil">{{month}}</option>
                </template>
              </select>
              </div>
              <div class="flex items-center">
                <label>s/d</label>
              </div>
              <div class="w-1/2 ml-1">
                <select class="w-full list-kelas p-2 border border-gray-300 rounded-lg bg-gray-100 h-9 mb-2" v-model="monthUntil" :disabled="semester[selectedSemester].isPaidUntil > 5">
                  <option></option>
                  <template v-for="(month, idx) in months[selectedSemester]" :key="month">
                      <option :value="idx" :disabled="idx < monthFrom">{{month}}</option>
                  </template>
                </select>
              </div>
            </div>
            <label class="text-xs text-green-600 font-italic" v-if="semester[selectedSemester].isPaidUntil > 5">*Spp semester {{selectedSemester + 1}} sudah lunas </label>
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
                  <label class="w-1/3 mb-1"> {{findLabel(item.paymentId)}} </label>
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
        <template v-if="!result || result.key != 'spp'">
          <label class="mt-2  text-xs" :class="!isCanInstallment ? ' italic text-red-600' : ''">{{ !isCanInstallment ? "Tidak bisa mencicil jika memilih 2 jenis bayaran" : 'Isi jumlah yang di bayarkan, jika membayar dengan cara di cicil'}}</label>
          <input type="number" class="rounded-lg border border-gray-400 p-2 text-right" :placeholder="'Rp. '+ total.toLocaleString()" :disabled="!isCanInstallment" v-model="pay">
        </template>
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
    </div>
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
import moment from "moment";

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
      showSpp: false,
      isLoading: false,
      isSubmitLoading: false,
      count: 0,
      total: 0,
      pay: null,
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
    async academicYearId(val, oldVal) {
      if (this.student) {
        await this.selected(this.student.id);
      }

      if (parseInt(val) === 0) {
        this.filteredGroup = [];
      } else {
        this.filterGroup();
      }

      if (this.semester.length > 0) {
        this.monthFrom = this.semester[this.selectedSemester].isPaidUntil;
        this.monthUntil = this.semester[this.selectedSemester].isPaidUntil;
      }

      this.forms = [];
    },
    student() {
      this.createForms();
    },
    selectedSemester(val, oldVal) {
      if (Number.isInteger(val)) {
        this.monthFrom = this.semester[val].isPaidUntil;
        this.monthUntil = this.semester[val].isPaidUntil;

        this.createForms();
      }
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
      const paymentSpp = this.group.find((i) => i.key == "spp" && i.isActive)!;
      let totalPrice = 0;
      let totalSpp = 0;

      for (const idx in this.forms) {
        totalPrice = Number(this.forms[idx].pay) + totalPrice;
      }

      if (paymentSpp) {
        totalSpp = this.student.is_orphan
          ? 0
          : this.forms.filter((i) => i.paymentId == paymentSpp.id).length *
            paymentSpp.price!;
      }

      return (
        this.forms.length === 0 ||
        Object.keys(this.student).length === 0 ||
        this.academicYearId === 0 ||
        Number(this.pay) < totalSpp ||
        Number(this.pay) > totalPrice
      );
    },
    isCanInstallment(): boolean {
      // const paymentSpp = this.group.find((i) => i.key == "spp" && i.isActive)!;
      // return this.forms.filter((i) => i.paymentId != paymentSpp.id).length < 2;
      return true;
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

      if (!this.showSpp) {
        return;
      }

      if (Object.keys(this.student).length === 0) {
        return;
      }

      const payment = this.group.find((i) => i.key == "spp")!;

      this.forms = this.forms.filter((i) => i.paymentId != payment.id);

      for (
        let index = 0;
        index < this.monthUntil - this.monthFrom + 1;
        index++
      ) {
        this.forms.push({
          pay: this.student.is_orphan ? 0 : payment.price!,
          description:
            this.months[this.selectedSemester][this.monthFrom + index],
          studentId: this.student.id,
          isInstalment: false,
          paymentId: payment.id,
          academicYearId: this.academicYearId,
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
      const payment = this.group.find((i) => i.key == "spp")!;

      this.monthFrom = 0;
      this.monthUntil = 0;

      for (const idxSemester in this.months) {
        let isPaidUntil = 0;

        for (const idx in this.details) {
          const detail = this.details[idx];

          if (detail.paymentId != payment.id) {
            continue;
          }

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
      let totalPay = 0;

      const payments = this.group.filter(
        (i) =>
          i.key == "ppdb" || i.key == "lks" || i.key == "uam" || i.key == "um"
      )!;
      const formsWithOutInstallment = this.forms.filter((i) => {
        let isFound = false;
        for (const index in payments) {
          const payment = payments[index];
          isFound = i.paymentId == payment.id;

          if (isFound) {
            break;
          }
        }
        if (!isFound) {
          return true;
        }
      });
      const formsWithInstallments = this.forms.filter((i) => {
        for (const index in payments) {
          const payment = payments[index];
          if (i.paymentId == payment.id) {
            return payment;
          }
        }
      });

      this.forms = [];

      for (const i in formsWithOutInstallment) {
        const form = formsWithOutInstallment[i];

        form.isInstalment = false;
        totalPay = Number(form.pay) + totalPay;
      }

      this.forms.push(...formsWithOutInstallment);

      if (this.pay && Number(this.pay) > totalPay) {
        if (formsWithInstallments.length > 0) {
          for (const i in formsWithInstallments) {
            const formsWithInstallment = formsWithInstallments[i];

            formsWithInstallment.isInstalment == Number(this.pay) < totalPay;
            formsWithInstallment.pay = Number(this.pay) - totalPay;

            this.forms.push(formsWithInstallment);
          }
        }
      }

      for (const idx in this.forms) {
        await create(this.forms[idx]);
      }

      createToast("Pembayaran Berhasil", {
        hideProgressBar: true,
        type: "success",
      });

      this.showModal = true;
      this.isSubmitLoading = false;
    },
    clearForm() {
      this.forms = [];
      this.keyword = "";
      this.selectedSemester = 0;
      this.academicYearId = 0;
      // this.student = {}
      return;
    },
    closeModal() {
      this.showModal = false;
      this.clearForm();
      this.$router.push({ name: "pembayaran" });
    },
    uppercase(str: string) {
      const tmp = str.toString();
      return tmp.toUpperCase();
    },
    savePdf() {
      const academicYearIdx = this.academicYears.findIndex(
        (i) => i.id === this.academicYearId
      );
      const academicYear = this.academicYears[academicYearIdx];
      const items: Array<ItemsPayload> = [];

      for (const idx in this.forms) {
        const payment = this.group.find(
          (i) => i.id === this.forms[idx].paymentId
        )!;
        const label =
          payment.key == "spp"
            ? `${payment.label} ${this.forms[idx].description}`
            : payment.label;
        const price = this.forms[idx].pay;

        items.push({
          jenis: label,
          harga: price.toLocaleString(),
        });
      }
      console.log(this.total);

      ipcRenderer.sendSync("print-pdf", {
        payload: {
          tanggalDibuat: moment().format("MMMM Do YYYY, HH:mm:ss"),
          nama: this.student.name,
          kelas: academicYear.className,
          total: this.pay
            ? Number(this.pay).toLocaleString()
            : this.total.toLocaleString(),
          tahun: academicYear.label,
          items: items,
        },
      });

      this.closeModal();
    },
    findPayment() {
      return findByName(this.idName.toString()).then((response) => {
        this.result = response;

        return findGroup(this.idName.toString()).then((res: any) => {
          this.group = res;
        });
      });
    },
    pushItem(item: Payment) {
      this.total = 0;

      if (item.key == "spp") {
        this.showSpp = !this.showSpp;
        return;
      }

      const pay = this.isPaymentDisable(item);
      const idx = this.forms.findIndex((i) => i.paymentId === item.id);

      if (idx > -1) {
        const tmp = this.forms.filter((i) => i.paymentId != item.id);
        this.forms = tmp;
      } else {
        this.forms.push({
          pay: pay,
          description: "Bayar " + item.label,
          studentId: this.student.id,
          paymentId: item.id,
          academicYearId: this.academicYearId,
          referId: null,
          isInstalment: false,
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
    },
    findLabel(id: number) {
      const idx = this.group.findIndex((i) => i.id! === id);

      return this.group[idx].label;
    },
    async fetchPayment() {
      this.group = await findAll(false);
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
      let remainPaid = item.price!;
      let totalPaid = 0;

      for (const idx in this.details) {
        const detail = this.details[idx];

        if (item.id == detail.paymentId) {
          totalPaid = totalPaid + detail.pay;

          if (totalPaid >= item.price!) {
            remainPaid = 0;
            break;
          } else {
            remainPaid = item.price! - totalPaid;
          }
        }
      }

      return remainPaid;
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

    this.fetchPayment();
  },
});
</script>

<style scoped>
input:checked + svg {
  display: block;
}
</style>