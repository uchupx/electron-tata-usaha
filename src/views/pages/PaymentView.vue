<template>
  <div>
    <label class="font-bold text-gray-700 text-lg" >Pembayaran - {{idName}}</label>
    <div class="flex w-full flex-col">
      <div class="flex w-full">
        <div class="w-1/2 p-3 text-sm h-auto bg-white shadow-sm rounded-lg mr-2 flex flex-col">
          <label>Pilih Siswa</label>
          <Autocomplete :items="studentsWithClass" @on-change="find" @selected="selected" :isLoading="isLoading" :classCustom="'h-9'" :isAutoFilled="false"/>
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
        </div>
        <div class="w-1/2 p-3 text-sm h-auto bg-white shadow-sm rounded-lg flex flex-col">
          <label>Nama : {{student ? student.name : ''}}</label>
          <label>Kelas : {{student ? student.class : ''}}</label>
          <label class="mb-0">SPP</label>
          <!-- <label>s/d bulan</label> -->
          <hr class="mb-1 mt-1">
          <template v-for="idx in ((monthUntil - monthFrom) + 1)" :key="'spp-' + idx ">
            <div class="flex text-xs ml-3">
              <label class="w-full">Spp bulan {{months[monthFrom + (idx - 1)]}}</label>
              <label>Rp.{{result.price}}</label>
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
    <!-- <template v-if="result">
      {{result}}
    </template> -->
  </div>
</template>
<script lang="ts">
interface NewDetail {
  price: number | null;
  description: string | null;
  studentId: number | null;
  paymentId: number | null;
  id?: number | null;
}

import { defineComponent } from "vue";
import Autocomplete from "@/views/components/Autocomplete.vue";
import Spinner from "@/views/components/Spinner.vue";
import { findByName } from "@/db/action/payment";
import { findPaginated } from "@/db/action/student";
import {
  create,
  findByPaymentIdAndStudentId,
} from "@/db/action/payment_detail";
import { Student } from "@/db/model/student";

export default defineComponent({
  data() {
    return {
      idName: String,
      result: {} as any,
      student: {} as any,
      students: Array<Student>(),
      count: 0,
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
      return this.forms.length === 0;
    },
    total() {
      let total = 0;
      for (
        let index = 0;
        index < this.monthUntil - this.monthFrom + 1;
        index++
      ) {
        total = total + parseInt(this.result.price);
      }
      return total;
    },
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
    createForms() {
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
          price: parseInt(this.result.price),
          description: this.months[this.monthFrom + index],
          studentId: this.student.id,
          paymentId: this.result.id,
        });
      }
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
      this.isSubmitLoading = false;
      this.$router.push({ name: "pembayaran" });
      // const newStudent = await create(data);
      // allData.push(newStudent);
    },
  },
  async mounted() {
    this.idName = this.$route.params.idName as any;
    this.result = await findByName(this.idName.toString());
  },
});
</script>