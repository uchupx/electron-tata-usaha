<template>
      <div class="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        <div class="flex justify-center flex-col items-center">
          <template v-if="isLoading">
            <Spinner :classes="'h-16 w-16'"/>
            <label class="mt-3">Mohon tunggu sedang melakukan import data</label>
          </template>
          <template v-else-if="isDone">
            <CheckCircleIcon class="h-16 w-16 text-green-500"/>
            <label class="mt-3">Import data selesai</label>
            <div class="p-1 mt-2 text-center space-x-4 md:block">
              <button class="bg-red-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-white rounded-xl hover:bg-red-500 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200" @click="closeModal()">
                  Tutup
              </button>
            </div>
          </template>
          <template v-else>
            <label class="mb-3 font-normal"> Masukan file data siswa berupa spreadsheet (.xlsx / .csv)</label>
            <button type="button" class="flex justify-center flex-col items-center w-52 h-32 border-blue-200 border-2 rounded-xl text-blue-500 font-semibold mb-3 hover:bg-blue-500 hover:text-white transition-colors focus:bg-blue-600 focus:text-white" @click="selectFile">
              <UploadIcon class="w-10 h-10 my-4"/>
              <span>Pilih file</span>
            </button>
            <input type="file" class="hidden" id="input-file" @change="checkFile" accept=".csv, .xlsx">
            <button class="flex justify-center flex-col items-center w-52 h-10 border-blue-200 border-2 rounded-xl text-blue-500 font-semibold">
              <span>Unduh template</span>
            </button>
            <div class="p-3  mt-2 text-center space-x-4 md:block">
                <button class="mb-2 md:mb-0 bg-red-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-white rounded-xl hover:bg-red-500 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200" @click="closeModal()">
                    Tutup
                </button>
            </div>
          </template>
        </div>
      </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { mapActions } from "vuex";
import { UploadIcon, CheckCircleIcon } from "@heroicons/vue/outline";
import { findByNameAndClassId, create, update } from "@/db/action/student";
import { isClassExist, create as createClass } from "@/db/action/class";
import Spinner from "@/views/components/Spinner.vue";
import XLSX from "xlsx";

interface NewStudent {
  name: string | null;
  classId: number | null;
  address: string | null;
  semester: number | null;
  gender: string | null;
  academicYear: string | null;
  isOrphan: boolean | null;
  id?: number | null;
}

export default defineComponent({
  data() {
    return {
      isLoading: false,
      isDone: false,
      filew: null,
    };
  },
  components: { UploadIcon, Spinner, CheckCircleIcon },
  methods: {
    ...mapActions("app", ["closeModal"]),
    selectFile() {
      document.getElementById("input-file")!.click();
    },
    processExcel(f: any) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(f);
        reader.onload = async function () {
          const readerResult = reader.result as ArrayBuffer;
          const data = new Uint8Array(readerResult);
          const workbook = XLSX.read(data, { type: "array", password: "1722" });
          const sheet = workbook.Sheets["import_siswa"];
          const result = XLSX.utils.sheet_to_json(sheet) as any;

          for (const i in result) {
            const newStudent = {
              name: result[i].nama,
              classId: 0,
              address: result[i].alamat,
              gender: result[i].jenis_kelamin,
              isOrphan: result[i].yatim_piatu,
              semester: 2,
              academicYear: "2021/2022",
            };

            const isExist = await isClassExist(result[i].kelas);

            if (!isExist) {
              const newClassId = await createClass({
                name: result[i].kelas,
              });
              newStudent.classId = newClassId!;
            } else {
              newStudent.classId = isExist;
            }
            const student = await findByNameAndClassId(
              newStudent.name,
              newStudent.classId
            );

            if (student) {
              student.name = newStudent.name;
              student.classId = newStudent.classId;
              student.address = newStudent.address;
              student.gender = newStudent.gender;
              student.isOrphan = newStudent.isOrphan;
              student.semester = newStudent.semester;
              student.academicYear = newStudent.academicYear;

              await update(student);
            } else {
              await create(newStudent);
            }
          }
          resolve(true);
        };

        reader.onerror = (error) => {
          reject(error);
        };
      });
    },
    async checkFile(event: any) {
      this.isLoading = true;
      const f = event.target.files[0];
      await this.processExcel(f);
      this.isLoading = false;
      this.isDone = true;
    },
  },
});
</script>