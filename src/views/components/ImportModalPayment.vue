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
        <label class="mb-3 font-normal"> Masukan file data bayaran berupa spreadsheet (.xlsx / .csv)</label>
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
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import { UploadIcon, CheckCircleIcon } from "@heroicons/vue/outline";
import { create, findByName, update } from "@/db/action/payment";
import XLSX from "xlsx";
import Spinner from "@/views/components/Spinner.vue";

// import {db} from '../../db/init'
interface NewPayment {
  key: string | null;
  label: string | null;
  price: number | null;
  group: string | null;
  id?: number | null;
}

export default defineComponent({
  data() {
    return {
      filew: null,
      isLoading: false,
      isDone: false,
    };
  },
  components: { UploadIcon, Spinner, CheckCircleIcon },
  methods: {
    ...mapActions("app", ["closeModal"]),
    selectFile() {
      document.getElementById("input-file")!.click();
    },
    downloadTemplate() {
      return;
    },
    processExcel(f: any) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(f);
        reader.onload = async function () {
          const readerResult = reader.result as ArrayBuffer;
          const data = new Uint8Array(readerResult);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const result = XLSX.utils.sheet_to_json(sheet) as any;

          for (const i in result) {
            const isPaymentExist = await findByName(result[i].key)

            if (isPaymentExist) {
              const payment = isPaymentExist
              payment.isActive = false
              await update(payment)
            }
            
            const newPayment = {
              price: result[i].harga,
              label: result[i].nama,
              key: result[i].key,
              isActive: true,
              group: result[i].group,
            };

            await create(newPayment);
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