<template>
  <div>
    <div class="bg-white w-full h-auto rounded-lg p-3 shadow-sm">
      <div class="border-b-2">
        <label class="text-lg font-semibold text-gray-600">Pengaturan</label>
      </div>
      <div class="flex flex-col p-2">
        <div class="flex items-center text-gray-600 item hover:bg-gray-100" @click="showImportModal">
          <UploadIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Import Data Siswa</label>
          </div>
        </div>
        <div class="flex items-center text-gray-600 item hover:bg-gray-100" @click="showImportModalPayment">
          <UploadIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Import Pembayaran</label>
          </div>
        </div>
        <!-- <div class="flex items-center text-gray-600 item hover:bg-gray-100">
          <UploadIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Import Data Siswa</label>
          </div>
        </div>
        <div class="flex items-center text-gray-600 item hover:bg-gray-100">
          <UploadIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Import Data Siswa</label>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// import {} from
import { defineComponent } from "vue";
import { UploadIcon } from "@heroicons/vue/solid";
import { mapActions } from "vuex";
import ImportModal from "@/views/components/ImportModal.vue";
import ImportModalPayment from "@/views/components/ImportModalPayment.vue";

export default defineComponent({
  components: {
    // CogIcon,
    UploadIcon,

    // eslint-disable-next-line
    ImportModalPayment,
    // eslint-disable-next-line
    ImportModal,
  },
  methods: {
    ...mapActions("app", ["openModal"]),
    showImportModal() {
      this.openModal(ImportModal);
    },
    showImportModalPayment () {
      this.openModal(ImportModalPayment);
    }
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