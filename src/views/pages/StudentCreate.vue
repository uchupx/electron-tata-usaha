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
              <input type="text" class="bg-gray-100 border border-gray-300 p-2 h-9 w-full rounded-lg hover:outline-none  mb-1 focus-within:outline-none focus:outline-none input" v-model="student.name"  placeholder="Nama siswa">
            </div>
            <div class="w-1/3">
              <label class="block mb-1">Jenis Kelamin</label>
            </div>
            <div class="w-2/3">
              <select class="w-full list-kelas p-2 rounded-lg mb-1 bg-gray-100 h-9 border-gray-700 border" v-model="student.gender">
                <option value="L">Laki-Laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div class="w-1/3">
              <label class="block mb-1">Alamat</label>
            </div>
            <div class="w-2/3">
              <textarea class="bg-gray-100 border border-gray-300 p-2 w-full rounded-lg hover:outline-none  mb-1 focus-within:outline-none focus:outline-none input" v-model="student.address">
              </textarea>
            </div>
            <div class="w-1/3">
              <label class="block mb-1">Kelas</label>
            </div>
            <div class="w-2/3">
              <select class="w-full list-kelas p-2 rounded-lg mb-1 bg-gray-100 h-9 border-gray-700 border" v-model="newClass.classId">
                <!-- <option value="0"></option> -->
                <template v-for="c in classes" :key="c.name">
                  <option :value="c.id">{{c.name}}</option>
                </template>
              </select>
            </div>
            <div class="w-1/3">
              <label class="block mb-1">Tahun Ajaran</label>
            </div>
            <div class="w-2/3">
              <select class="w-full list-kelas p-2 rounded-lg mb-1 bg-gray-100 h-9 border-gray-700 border" v-model="newClass.academicYearId">
                <!-- <option value=""></option> -->
                <template v-for="academicYear in academicYears" :key="academicYear.id + '-' + academicYear.label">
                  <option :value="academicYear.id">{{academicYear.label}}</option>
                </template>
              </select>
            </div>
            <div class="w-1/3">
              <label class="block mb-1">Yatim / Piatu</label>
            </div>
            <div class="w-2/3">
              <select class="w-full list-kelas p-2 rounded-lg mb-1 bg-gray-100 h-9 border-gray-700 border" v-model="student.isOrphan">
                <option value="false">Tidak</option>
                <option value="true">Iya</option>
              </select>
            </div>
          </div>
          </div>
        <div class="flex justify-end">
          <!-- <button type="button" class="bg-red-500 p-2 text-white hover:bg-red-600 rounded-md mr-2" @click="editMode= false">Batal</button> -->
          <button type="button" class="bg-green-500 p-2 text-white rounded-md" :class="buttonDisable ? 'opacity-50' : 'hover:bg-green-600'" @click="submit" :disabled="buttonDisable">Buat Perubahan</button>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { UserCircleIcon } from "@heroicons/vue/solid";
import { createToast } from "mosha-vue-toastify";
import { NewStudent, create } from "@/db/action/student";
import { findAll as findAllClass } from "@/db/action/class";
import { findAll as findAllAcademicYear } from "@/db/action/academic_year";
import "mosha-vue-toastify/dist/style.css";
import { AcademicYear, Class } from "@/db/model/class";
import {
  NewClass,
  findByStudentId as findStudentClassByStudentId,
  update as studentClassUpdate,
  create as studentClassCreate,
} from "@/db/action/student_class";

export default defineComponent({
  data() {
    return {
      student: {} as NewStudent,
      newClass: {} as NewClass,
      classes: Array<Class>(),
      academicYears: Array<AcademicYear>(),
    };
  },
  computed: {
    buttonDisable(): boolean {
      const isNameNotValid = this.student.name == null || this.student.name.trim() == '';
      const isGenderNotValid = this.student.gender == null || this.student.gender.trim() == '';
      const isClassNotValid = this.newClass.classId == null
      const isAcademicNotValid = this.newClass.academicYearId == null

      return isNameNotValid || isGenderNotValid || isClassNotValid || isAcademicNotValid;
    },
  },
  components: {
    UserCircleIcon,
  },
  methods: {
    async submit() {
      const newStudentId = await create(this.student);
      const studentClasses = await findStudentClassByStudentId(newStudentId!);

      for (const idx in studentClasses) {
        const studentClass = studentClasses[idx];
        studentClass.isActive = false;
        await studentClassUpdate(studentClass);
      }

      this.newClass.isActive = true;
      this.newClass.studentId = newStudentId;

      await studentClassCreate(this.newClass);

      createToast("Berhasil menambahkan siswa", {
        hideProgressBar: true,
        type: "success",
      });

      this.$router.push({
        name: "siswa",
      });
    },
  },
  async mounted() {
    // this.studentId = this.$route.params.id as any;
    this.classes = await findAllClass();
    this.academicYears = await findAllAcademicYear();
  },
});
</script>
