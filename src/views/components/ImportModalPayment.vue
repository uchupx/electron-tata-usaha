<template>
      <div class="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        <div class="flex justify-center flex-col items-center">
          <label class="mb-3 font-normal"> Masukan file data pembayaran berupa spreadsheet (.xlsx)</label>
          <button type="button" class="flex justify-center flex-col items-center w-52 h-32 border-blue-200 border-2 rounded-xl text-blue-500 font-semibold mb-3 hover:bg-blue-500 hover:text-white transition-colors focus:bg-blue-600 focus:text-white" @click="selectFile">
            <UploadIcon class="w-10 h-10 my-4"/>
            <span>Pilih file</span>
          </button>
          <input type="file" class="hidden" id="input-file" @change="checkFile" accept=".csv, .xlsx">
          <a href="/example_xlsx/DataSiswaExampleImport.xlsx" class="flex justify-center flex-col items-center w-52 h-10 border-blue-200 border-2 rounded-xl text-blue-500 font-semibold" download>
            <span>Unduh template</span>
          </a>
          <div class="p-3  mt-2 text-center space-x-4 md:block">
              <button class="mb-2 md:mb-0 bg-red-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-white rounded-xl hover:bg-red-500 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200" @click="closeModal()">
                  Tutup
              </button>
          </div>
        </div>
      </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { mapActions } from "vuex";
import { UploadIcon } from "@heroicons/vue/outline";
import { findByName, create } from "@/db/action/payment";
import { isClassExist, create as createClass } from "@/db/action/class";
import { remote } from "electron";
import XLSX from "xlsx";

// import {db} from '../../db/init'
interface NewPayment {
  price: number | null;
  name: string | null;
  key: string | null;
  group: string | null;
  id?: number | null;
}

export default defineComponent({
  setup() {
    //todo the reactive state for binding to form
    const student = reactive({
      price: 0,
      name: "",
      key: "",
      group: "",
    });
    //todo reactive repo of all users
    const allData = reactive<NewPayment[]>([]);

    // const syncUsers = async () => {
    //   const allUsers = await getAll();
    //   allUsers.forEach((el: any) => {
    //     const studentFound = allData.find((e) => e.id === el.id);
    //     studentFound
    //       ? allData.splice(
    //           allData.findIndex((e) => e.id === el.id),
    //           1,
    //           {
    //             name: el.name,
    //             classId: el.classId,
    //             address: el.address,
    //             gender: el.gender,
    //             id: el.id,
    //           }
    //         )
    //       : allData.push({
    //           name: el.name,
    //           classId: el.classId,
    //           address: el.address,
    //           gender: el.gender,
    //           id: el.id,
    //         });
    //   });
    // };
    //todo fetch all users on boot
    // onMounted(async () => syncUsers());
    //todo submit user
    const submit = async (data: NewPayment) => {
      const newStudent = await create(data);
    };

    const checkFile = async (event: any) => {
      const f = event.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(f);
      reader.onload = async function () {
        const readerResult = reader.result as ArrayBuffer;
        const data = new Uint8Array(readerResult);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const result = XLSX.utils.sheet_to_json(sheet) as any;

        for (const i in result) {
          const newStudent = {
            price: result[i].harga,
            name: result[i].nama,
            key: result[i].key,
            group: result[i].group,
          };
          console.log(newStudent)
          // const isExist = await findByName(result[i].kelas);

          // if (!isExist) {
          //   const newClassId = await createClass({
          //     name: result[i].kelas,
          //   });
          //   newStudent.classId = newClassId!;
          // } else {
          //   newStudent.classId = isExist;
          // }

          await submit(newStudent);
        }
        // var cell_ref = XLSX.utils.encode_cell({c: 1, r: 2});
        // var cell = sheet[cell_ref];
      };
    };
    return { student, submit, allData, checkFile };
  },
  data() {
    return {
      filew: null,
    };
  },
  components: { UploadIcon },
  methods: {
    ...mapActions("app", ["closeModal"]),
    selectFile() {
      document.getElementById("input-file")!.click();
    },
    downloadTemplate() {
      return;
    },
  },
});
</script>