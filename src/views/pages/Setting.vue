<template>
  <div>
    <div class="bg-white w-full h-auto rounded-lg p-3 shadow-sm">
      <div class="border-b-2">
        <label class="text-lg font-semibold text-gray-600">Pengaturan</label>
      </div>
      <div class="flex flex-col p-2 my-2">
        <label class="mx-2 pb-2 text-gray-600 border-b border-gray-400">Pengaturan Aplikasi</label>
        <div class="flex items-center text-gray-600 item hover:bg-gray-100">
          <PhotographIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b flex">
            <label class="text-sm w-full py-1">Unggah Logo Sekolah</label>
            <div class="w-full text-right">
              <!-- <label class="text-sm">{{schoolName}}</label> -->
            <input type="file" class="hidden" id="input-file" @change="checkFile" accept=".jpeg, .jpg, .png">
              <button  type="button" class="bg-green-500 px-1 h-7  rounded-md text-white text-sm" @click="selectFile">
                  Pilih Logo<CloudUploadIcon class="mx-1 h-3 w-3 inline-block" />
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center text-gray-600 item hover:bg-gray-100">
          <LibraryIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b flex">
            <label class="text-sm w-full py-1">Nama Sekolah</label>
            <div class="w-full flex justify-end">
              <!-- <label class="text-sm">{{schoolName}}</label> -->
              <template v-if="isEditSchoolName">
                <input type="text" class="bg-gray-100 border border-gray-300 text-sm p-1 w-full rounded-lg hover:outline-none  focus-within:outline-none focus:outline-none input" v-model="newSchoolName"  placeholder="Nama Sekolah">
                <button  type="button" class="bg-red-500 px-1 h-7  rounded-md text-white mx-1" @click="isEditSchoolName=false">
                    <XIcon class="mx-1 h-3 w-3 inline-block" />
                </button>
                <button  type="button" class="bg-green-500 px-1 h-7  rounded-md text-white" @click="updateSchool">
                    <CheckIcon class="mx-1 h-3 w-3 inline-block" />
                </button>
              </template>
              <template v-else>
                <label class="text-sm w-full py-1 text-right mr-2">{{schoolName}}</label>
                <button  type="button" class="bg-blue-500 px-1 h-7 rounded-md text-white mx-1" @click="isEditSchoolName=true">
                    <PencilIcon class="mx-1 h-3 w-3 inline-block" />
                </button>
              </template>
            </div>
          </div>
        </div>
        <div @click="openListModal('class')" class="flex items-center text-gray-600 item hover:bg-gray-100">
          <ArchiveIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Data Kelas</label>
          </div>
        </div>
        <div @click="openListModal('payment')" class="flex items-center text-gray-600 item hover:bg-gray-100">
          <ArchiveIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Data Jenis Pembayaran</label>
          </div>
        </div>
        <div @click="openListModal('academicYear')" class="flex items-center text-gray-600 item hover:bg-gray-100">
          <ArchiveIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Data Tahun Ajaran</label>
          </div>
        </div>
      </div>
      <div class="flex flex-col p-2 my-2 ">
        <label class="mx-2 pb-2 text-gray-600 border-b border-gray-400">Candangkan & Pulihkan</label>
        <div @click="navigate({name:'aktivitas'})" class="flex items-center text-gray-600 item hover:bg-gray-100">
          <ClockIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Riwayat Aktivitas</label>
          </div>
        </div>
        <div class="flex items-center text-gray-600 item hover:bg-gray-100">
          <CloudDownloadIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b flex">
            <label class="text-sm w-full">Otomatis Cadangkan Data</label>
            <div class="w-full text-right">
              <label v-if="!automaticBackup" for="unchecked" class="inline-flex items-center cursor-pointer" @click="automaticBackup = true">
                <span class="relative">
                  <span class="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
                  <span class="absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out">
                    <input id="unchecked" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                  </span>
                </span>
              </label>

              <label v-else for="checked" class="inline-flex items-center cursor-pointer" @click="automaticBackup = false">
                <span class="relative">
                  <span class="block w-10 h-6 bg-blue-400 rounded-full shadow-inner"></span>
                  <span class="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-white transform translate-x-full">
                    <input id="checked" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
        <div class="flex items-center text-gray-600 item hover:bg-gray-100" @click="showModalRestore()">
          <CloudDownloadIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Memulihkan Data</label>
          </div>
        </div>
        <div class="flex items-center text-gray-600 item hover:bg-gray-100" @click="showModalBackup()">
          <CloudUploadIcon class="mx-2 h-5 w-5 inline-block"/>
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Cadangkan Data</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// import {} from
import { defineComponent } from "vue";
import {
  // CogIcon,
  PencilIcon,
  XIcon,
  CheckIcon,
  PhotographIcon,
  LibraryIcon,
  ArchiveIcon,
  ClockIcon,
  CloudUploadIcon,
  CloudDownloadIcon,
} from "@heroicons/vue/solid";
import {
  findAll as findAllClass,
  create as createClass,
  update as updateClass,
} from "@/db/action/class";
import {
  findAll as findAllPayment,
  create as createPayment,
  update as updatePayment,
} from "@/db/action/payment";
import {
  findAll as findAllAcademicYear,
  create as createAcademicYear,
  update as updateAcademicYear,
} from "@/db/action/academic_year";

import { paymentKeys } from "@/helper";
import { mapActions, mapMutations, mapState } from "vuex";
import ListModal from "@/views/components/ListModal.vue";
import BackupModal from "@/views/components/BackupModal.vue";
import RestoreModal from "@/views/components/RestoreModal.vue";
import fs from "fs";

interface Fields {
  key: string;
  label: string;
  input?: string;
  selectValues?: Array<string>;
}
interface Payload {
  type: string;
  label: string;
  fields: Array<Fields>;
  findAll: () => Promise<Array<any>>;
  create: (data: any) => Promise<any>;
  update: (data: any) => Promise<any>;
}

export default defineComponent({
  data() {
    return {
      newSchoolName: "",
      automaticBackup: false,
      isEditSchoolName: false,
    };
  },
  computed: {
    ...mapState("app", [
      "logo",
      "schoolName",
      "autoBackup",
      "backupEvery",
      "configPath",
      "userDataPath",
    ]),
  },
  watch: {
    automaticBackup() {
      this.updateAutomaticBackup();
    },
  },
  components: {
    PencilIcon,
    XIcon,
    CheckIcon,
    PhotographIcon,
    LibraryIcon,
    ArchiveIcon,
    ClockIcon,
    CloudDownloadIcon,
    CloudUploadIcon,
  },
  methods: {
    ...mapActions("app", [
      "openModal",
      "updateSchoolName",
      "updateAutoBackup",
      "updateLogo",
    ]),
    ...mapMutations("app", ["setModalPayload"]),
    navigate(route: any) {
      this.$router.push(route);
    },
    openListModal(type: string) {
      let payload = {} as Payload;

      switch (type) {
        case "class":
          payload = {
            type: "class",
            label: "List Data Kelas",
            fields: [
              {
                key: "id",
                label: "Id",
              },
              {
                key: "name",
                label: "Name",
                input: "text",
              },
            ],
            findAll: async () => {
              const result = await findAllClass();
              return result;
            },
            update: async (data: any) => {
              await updateClass(data);
            },
            create: async (data: any) => {
              await createClass(data);
            },
          };
          break;
        case "payment":
          payload = {
            type: "payment",
            label: "List Data Jenis Pembayaran",
            fields: [
              {
                key: "id",
                label: "Id",
              },
              {
                key: "key",
                label: "Key",
                input: "select",
                selectValues: paymentKeys,
              },
              {
                key: "label",
                label: "Label",
                input: "text",
              },
              {
                key: "price",
                label: "Harga",
                input: "number",
              },
              {
                key: "group",
                label: "Grup",
                input: "text",
              },
              {
                key: "isActive",
                label: "Status",
                input: "select",
                selectValues: ["true", "false"],
              },
            ],
            findAll: async () => {
              const result = await findAllPayment();
              return result;
            },
            update: async (data: any) => {
              await updatePayment(data);
            },
            create: async (data: any) => {
              await createPayment(data);
            },
          };
          break;
        case "academicYear":
          payload = {
            type: "Class",
            label: "List Data Tahun Ajaran",
            fields: [
              {
                key: "id",
                label: "Id",
              },
              {
                key: "label",
                label: "Label",
                input: "text",
              },
            ],
            findAll: async () => {
              const result = await findAllAcademicYear();
              return result;
            },
            update: async (data: any) => {
              await updateAcademicYear(data);
            },
            create: async (data: any) => {
              await createAcademicYear(data);
            },
          };
          break;
      }
      console.log(payload);

      this.setModalPayload(payload);
      this.openModal(ListModal);
    },
    showModalBackup() {
      this.openModal(BackupModal)
    },
    showModalRestore () {
      this.openModal(RestoreModal)
    },
    updateAutomaticBackup() {
      this.updateAutoBackup({
        path: this.configPath,
        value: this.automaticBackup,
      });
    },
    updateSchool() {
      this.updateSchoolName({
        path: this.configPath,
        name: this.newSchoolName,
      });
      this.isEditSchoolName = false;
    },
    selectFile() {
      document.getElementById("input-file")!.click();
    },
    async checkFile(event: any) {
      const f = event.target.files[0];
      console.log(f);

      await this.handleFile(f);
    },
    handleFile(f: any) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const path = this.userDataPath;

        const fileNameArray = f.name.split(".");
        const extension = fileNameArray[fileNameArray.length - 1];

        this.updateLogo({
          path: this.configPath,
          value: `/logo.${extension}`,
        });

        reader.readAsArrayBuffer(f);
        reader.onload = async function () {
          const readerResult = reader.result as ArrayBuffer;
          const buffer = Buffer.from(readerResult);

          fs.writeFileSync(`${path}/logo.${extension}`, buffer);
        };
      });
    },
  },
  mounted() {
    this.automaticBackup = this.autoBackup;
    this.newSchoolName = this.schoolName;
  },
});
</script>

<style scoped>
.item {
  margin-bottom: 1rem;
}
.item:last-child {
  margin-bottom: 0;
}
</style>