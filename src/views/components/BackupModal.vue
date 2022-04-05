<template>
  <div class="w-full max-w-xl p-2 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
    <label>Cadangkan Data - Langkah {{step}}</label>
    <template v-if="step==1">
      <div class="flex w-full items-center flex-wrap">
        <label class="w-1/3 text-sm text-gray-600">Pilih Tipe Cadangkan </label>
        <div class="w-2/3 text-right mt-2">
          <button class="py-1 px-2 rounded-md mr-2 bg-blue-500 text-white text-sm" type="button" @click="doBackup('local')" :disabled="isLoading" :class="isLoading ? 'opacity-50' : ''">Melalui Local</button>
          <button class="py-1 px-2 rounded-md bg-blue-500 text-white text-sm" type="button" @click="step++" :disabled="isLoading" :class="isLoading ? 'opacity-50' : ''">Melalui Server</button>
        </div>
        <div class="w-full mt-2">
          <label class="text-xs text-red-600 italic">*Melalui Local - Akan meng-unduh file backup secara manual</label><br>
          <label class="text-xs text-red-600 italic">*Melalui Server - Akan meng-upload file backup ke server, pastikan anda memiliki server backup dan memiliki akses internet</label>
        </div>
      </div>
    </template>
    <template v-if="step==2">
      <div class="flex w-full items-center flex-wrap">
        <label class="w-1/3 text-sm text-gray-600">Server Backup </label>
        <input type="text" class="bg-gray-100 border border-gray-300 p-2 h-9 w-2/3 rounded-lg hover:outline-none mb-1 focus-within:outline-none focus:outline-none input" v-model="host" placeholder="http://localhost:3000">
        <div class="w-full text-right mt-2">
          <button class="py-1 px-2 rounded-md bg-red-500 text-white text-sm mr-2" type="button" @click="step--">Kembali</button>
          <button class="py-1 px-2 rounded-md bg-blue-500 text-white text-sm" type="button" @click="doBackup('server')">Lanjut</button>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { BackupHandler } from "@/handlers/backup";
import { ipcRenderer } from "electron";
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import axios from "axios";
import { createToast } from "mosha-vue-toastify";
// import the styling for the toast
import "mosha-vue-toastify/dist/style.css";

export default defineComponent({
  data() {
    return {
      step: 1,
      host: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapState("app", ["hostBackup", "configPath"]),
  },
  methods: {
    ...mapActions("app", ["closeModal", "updateHost"]),
    async doBackup(type: string) {
      const handler = new BackupHandler();
      const result = await handler.createBackup();

      this.isLoading = true;

      switch (type) {
        case "local":
          ipcRenderer.send("do-save-backup", result);

          createToast("Mencadangkan Data Berhasil", {
            hideProgressBar: true,
            type: "success",
          });
          break;
        case "server": {
          this.updateHost({ path: this.configPath, value: this.host });

          const bodyForm = new FormData();
          const newBlob = new Blob([result], {
            type: "text/plain",
          });

          const headers = {
            "Content-Type": "multipart/form-data",
          };

          bodyForm.append("backup-file", newBlob);
          axios
            .get(`${this.host}/backup/key`)
            .then((response) => {
              bodyForm.append("key", response.data.key);
              axios
                .post(`${this.host}/backup/upload`, bodyForm, {
                  headers,
                })
                .then((res) => {
                  createToast("Mencadangkan Data Berhasil", {
                    hideProgressBar: true,
                    type: "success",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
          break;
        }

        default:
          break;
      }

      this.isLoading = false;
      this.closeModal();
    },
  },
  mounted() {
    this.host = this.hostBackup;
  },
});
</script>