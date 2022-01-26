<template>
  <div>
    <div class="bg-white w-full h-auto rounded-lg p-3 shadow-sm">
      <div class="border-b-2">
        <label class="text-lg font-semibold text-gray-600">Pengaturan</label>
      </div>
      <div class="flex flex-col p-2">
        <div @click="navigate({name:'aktivitas'})" class="flex items-center text-gray-600 item hover:bg-gray-100">
          <ClockIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Riwayat Aktivitas</label>
          </div>
        </div>
        <div class="flex items-center text-gray-600 item hover:bg-gray-100 cursor-not-allowed">
          <CloudDownloadIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full border-b">
            <label class="text-sm">Memulihkan Data - Disabled</label>
          </div>
        </div>
        <div class="flex items-center text-gray-600 item hover:bg-gray-100 cursor-not-allowed">
          <CloudUploadIcon class="mx-2 h-5 w-5 inline-block" />
          <div class="mx-2 py-1 w-full">
            <label class="text-sm">Cadangkan Data - Disabled</label>
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
  ClockIcon,
  CloudUploadIcon,
  CloudDownloadIcon,
} from "@heroicons/vue/solid";
import { mapActions } from "vuex";
import ImportModal from '@/views/components/ImportModal.vue'

export default defineComponent({
  components: {
    // CogIcon,
    ClockIcon,
    CloudDownloadIcon,
    CloudUploadIcon,
    // eslint-disable-next-line
    ImportModal
  },
  methods: {
    ...mapActions('app', ['openModal']),
    showImportModal () {
      this.openModal(ImportModal)
    },
    navigate(route: any) {
      this.$router.push(route)
    }
  }
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