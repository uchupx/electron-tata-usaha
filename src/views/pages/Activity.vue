<template>
  <div>
    <label class="font-bold text-gray-700 text-lg" >Riwayat Aktivitas</label>
    <div class="bg-white shadow-sm rounded-lg w-full h-full overflow-y-auto p-2 text-sm">
      <div class="border rounded-lg w-full flex pb-2 flex-wrap">
        <div class="flex px-3 pt-2 w-full font-semibold text-white border-b bg-gray-600 rounded-t-lg">
          <div class="w-1/12"><label>ID</label></div>
          <div class="w-5/12"><label>Jenis</label></div>
          <div class="w-2/12"><label>Jenis ID</label></div>
          <div class="w-4/12"><label></label></div>
        </div>
          <template v-for="activity in activities" :key="'activity-' + activity.id">
          <div class="flex px-3 py-2 w-full text-xs border-b flex-wrap">
            <div class="w-1/12"><label>#{{activity.id}}</label></div>
            <div class="w-5/12"><label>{{activity.entity}}</label></div>
            <div class="w-2/12"><label>{{activity.entity_id}}</label></div>
            <div class="w-4/12 mb-1 text-right">
            <template v-if="detailShow[activity.id]">
              <button type="button" class="bg-blue-500 p-1 rounded-lg" @click="hideDetail(activity.id)">
                <EyeOffIcon class="h-3 w-3 text-white" />
              </button>
            </template>
            <template v-else>
              <button type="button" class="bg-blue-500 p-1 rounded-lg" @click="showDetail(activity.id)">
                <EyeIcon class="h-3 w-3 text-white" />
              </button>
            </template>
            </div>
            <div class="w-full flex flex-wrap bg-gray-100 rounded p-2" v-if="detailShow[activity.id]">
              <label class="w-full font-semibold">Detail Aktivitas</label>
              <template v-for="key in Object.keys(JSON.parse(activity.payload))" :key="key">
                <label class="w-1/2">{{key}} : {{JSON.parse(activity.payload)[key]}}</label>
              </template>
            </div>
          </div>
          </template>
        <!-- <div class="w-1/5"><label>ID</label></div> -->
      </div>
      <PaginationButton :limit="paginatedPayload.limit" :currentPage="currentPage" :pageItems="activities.length" :count="count" @change-page="changePage"/>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { findPaginated } from "@/db/action/activity";
import { Activity } from "@/db/model/activity";
import { EyeIcon, EyeOffIcon } from "@heroicons/vue/solid";
import PaginationButton from "@/views/components/PaginationButton.vue";

interface DetailObject {
  [key: string]: any;
}
export default defineComponent({
  data() {
    return {
      activities: Array<Activity>(),
      currentPage: 1,
      count: 0,
      isLoading: false,
      paginatedPayload: {
        entity: "",
        limit: 20,
        offset: 0,
      },
      detailShow: {} as any,
    };
  },
  components: {
    EyeIcon,
    EyeOffIcon,
    PaginationButton,
  },
  methods: {
    find() {
      this.isLoading = true;
      findPaginated(this.paginatedPayload)
        .then((result) => {
          this.count = result.count;
          this.activities = result.rows;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    changePage(page = 1) {
      this.paginatedPayload.entity = "";

      this.currentPage = page;
      // if (page !== 1 ) {
      this.paginatedPayload.offset = this.paginatedPayload.limit * (page - 1);
      // }
      return this.find();
    },
    showDetail(id: number) {
      const data: DetailObject = {};
      data[id.toString()] = true;

      Object.assign(this.detailShow, data);
    },
    hideDetail(id: number) {
      delete this.detailShow[id.toString()];
    },
  },
  mounted() {
    // Object.keys
    this.find();
  },
});
</script>