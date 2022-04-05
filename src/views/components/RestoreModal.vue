<template>
  <div class="w-full max-w-xl p-2 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
    <label>Memulihkan Data - Langkah {{step}}</label>
    <template v-if="step==1">
      <div class="flex w-full items-center flex-wrap">
        <label class="w-1/3 text-sm text-gray-600">Pilih Tipe Memulihkan </label>
        <div class="w-2/3 text-right mt-2">
          <button class="py-1 px-2 rounded-md mr-2 bg-blue-500 text-white text-sm" type="button" @click="doRestore('local')" :disabled="isLoading" :class="isLoading ? 'opacity-50' : ''">Melalui Local</button>
          <button class="py-1 px-2 rounded-md bg-blue-500 text-white text-sm" type="button" @click="restoreViaServer()" :disabled="isLoading" :class="isLoading ? 'opacity-50' : ''">Melalui Server</button>
          <input type="file" class="hidden" id="backup-file" @change="checkFile" accept=".bup, .txt, .json">
        </div>
        <div class="py-1 w-full border-b flex">
            <label class="text-sm w-full">Hapus semua data sebelum yang ada, sebelum memulihkan data</label>
            <div class="text-right">
              <label v-if="!isReset" for="unchecked-restore" class="inline-flex items-center cursor-pointer" @click="isReset = true">
                <span class="relative">
                  <span class="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
                  <span class="absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out">
                    <input id="unchecked-restore" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                  </span>
                </span>
              </label>

              <label v-else for="checked-restore" class="inline-flex items-center cursor-pointer" @click="isReset = false">
                <span class="relative">
                  <span class="block w-10 h-6 bg-blue-400 rounded-full shadow-inner"></span>
                  <span class="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-white transform translate-x-full">
                    <input id="checked-restore" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                  </span>
                </span>
              </label>
            </div>
          </div>
      </div>
    </template>
    <!-- <template v-if="step==2">
      <div class="flex w-full items-center flex-wrap">
        <label class="w-1/3 text-sm text-gray-600">Server Backup </label>
        <input type="text" class="bg-gray-100 border border-gray-300 p-2 h-9 w-2/3 rounded-lg hover:outline-none mb-1 focus-within:outline-none focus:outline-none input" v-model="host" placeholder="http://localhost:3000">
        <div class="w-full text-right mt-2">
          <button class="py-1 px-2 rounded-md bg-red-500 text-white text-sm mr-2" type="button" @click="step--">Kembali</button>
          <button class="py-1 px-2 rounded-md bg-blue-500 text-white text-sm" type="button" @click="doBackup('server')">Lanjut</button>
        </div>
      </div>
    </template> -->
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import axios from "axios";
import { RestoreHandler } from "@/handlers/restore";
import { createToast } from "mosha-vue-toastify";
// import the styling for the toast
import "mosha-vue-toastify/dist/style.css";

export default defineComponent({
  data() {
    return {
      step: 1,
      host: "",
      isReset: false,
      isLoading: false,
    };
  },
  computed: {
    ...mapState("app", ["hostBackup", "configPath"]),
  },
  methods: {
    ...mapActions("app", ["closeModal", "updateHost"]),
    async doRestore(type: string) {
      switch (type) {
        case "local":
          document.getElementById("backup-file")!.click();
          break;

        default:
          break;
      }
      return;
    },
    async checkFile(event: any) {
      const f = event.target.files[0];

      await this.handleFile(f);
      this.closeModal();
    },
    handleFile(f: any) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const isReset = this.isReset;

        reader.readAsArrayBuffer(f);
        reader.onload = async function () {
          const readerResult = reader.result as ArrayBuffer;
          const buffer = Buffer.from(readerResult);
          const data = JSON.parse(buffer.toString());
          const restore = new RestoreHandler(data);

          await restore.doRestore(isReset ? "reset" : "");

          createToast("Memulihkan Data Berhasil", {
            hideProgressBar: true,
            type: "success",
          });
        };
      });
    },
    restoreViaServer() {
      axios.get(`${this.hostBackup}/backup/last`).then(async (response) => {
        const parse = response.data

        const restore = new RestoreHandler(parse);

        await restore.doRestore(this.isReset ? "reset" : "");

        createToast("Memulihkan data Berhasil", {
          hideProgressBar: true,
          type: "success",
        });
        this.closeModal();
      });
    },
  },
  mounted() {
    this.host = this.hostBackup;
  },
});
</script>