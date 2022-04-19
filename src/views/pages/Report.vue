<template>
  <div>
    <label class="font-bold text-gray-700 text-lg" >Laporan</label>
    <div class="w-full h-auto mb-3 flex">
      <div class="w-1/2 flex items-center" >
        <label class="mr-2">Pilah</label>
        <select class="p-2 h-9 mr-2" v-model="filterBy" @change="updateDateFilter">
          <option value="harian">Hari ini</option>
          <option value="mingguan">Minggu ini</option>
          <option value="bulanan">Bulan ini</option>
          <option value="semester">Semester ini</option>
          <option value="custom">Kustom</option>
        </select>
        <!-- <label class="mr-3">Pilah berdasarkan</label> -->
        <datepicker class="p-2 rounded-md h-9" v-model="startDate"/> <span class="mx-2">s/d</span> <datepicker class="p-2 rounded-md h-9"  v-model="endDate"/>
      </div>
      <div class="w-1/2 text-right">
        <button type="button" class="bg-blue-500 p-2 rounded-md text-white" @click="savePdf()">Print Laporan</button>
      </div>
    </div>
    <div class="bg-white shadow-sm rounded-lg w-full h-full overflow-y-auto p-2 text-xs">
      <div class="border rounded-lg w-full flex pb-2 flex-wrap">
        <div class="w-full flex border-b px-3 py-1 bg-white text-gray-600 font-bold rounded-t-lg">
          <div class="w-1/6"><label>ID</label></div>
          <div class="w-2/6"><label>Jenis</label></div>
          <div class="w-4/6"><label>Nama Siswa</label></div>
          <div class="w-1/6"><label>Kelas</label></div>
          <div class="w-2/6"><label>Jumlah Bayar</label></div>
          <div class="w-2/6"><label>Deskripsi</label></div>
        </div>
        <template v-if="details.length > 0">
          <template  v-for="history in details" :key="'history' + history.id">
            <div class="w-full flex px-3 items-center border-b py-1">
              <label class="w-1/6 mb-1 font-semibold text-gray-600">#{{history.id}}</label>
              <label class="w-2/6 mb-1">{{history.relations.payment.label}}</label>
              <label class="w-4/6 mb-1">{{history.relations.student.name}}</label>
              <label class="w-1/6 mb-1">{{className(history.relations.student.relations.classes)}}</label>
              <label class="w-2/6 mb-1">Rp. {{history.pay.toLocaleString()}}</label>
              <label class="w-2/6 mb-1">{{history.description}}</label>
              <!-- <label class="block mb-1"></label> -->
            </div>
          </template>
        </template>
      </div>
      <PaginationButton :limit="paginatedPayload.limit" :currentPage="currentPage" :pageItems="details.length" :count="count" @change-page="changePage"/>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { PaymentWithRelations } from "@/handlers/relation";
import { PaymentDetailHandler } from "@/handlers/payment_detail";
import PaginationButton from "@/views/components/PaginationButton.vue";
import { DetailsPaginatedPayload } from "@/db/enums/paginated";
import * as Types from "@/db/enums/types";
import { Class } from "@/db/model/class";
import moment from "moment";
import { ipcRenderer } from "electron";
import Datepicker from "vue3-datepicker";
interface DetailObject {
  [key: string]: any;
}

export default defineComponent({
  data() {
    return {
      details: Array<PaymentWithRelations>(),
      currentPage: 1,
      count: 0,
      filterBy: "harian",
      startDate: new Date(),
      endDate: new Date(),
      isLoading: false,
      paginatedPayload: {
        limit: 5,
        offset: 0,
      } as DetailsPaginatedPayload,
      detailShow: {} as any,
    };
  },
  components: {
    PaginationButton,
    Datepicker,
  },
  watch: {
    startDate() {
      this.updateFilterBy();
      this.find();
    },
    endDate() {
      this.updateFilterBy();
      this.find();
    },
  },
  methods: {
    updateDateFilter() {
      switch (this.filterBy) {
        case "harian":
          console.log(moment().startOf("day").format());
          console.log(moment().endOf("day").format());
          this.startDate = moment().startOf("day").toDate();
          this.endDate = moment().endOf("day").toDate();
          break;
        case "mingguan":
          console.log(moment().startOf("week").format());
          console.log(moment().endOf("week").format());
          this.startDate = moment().startOf("week").toDate();
          this.endDate = moment().endOf("week").toDate();
          break;
        case "bulanan":
          console.log(moment().startOf("month").format());
          console.log(moment().endOf("month").format());
          this.startDate = moment().startOf("month").toDate();
          this.endDate = moment().endOf("month").toDate();
          break;
        case "semester":
          break;
        default:
          break;
      }

      this.find();
      return;
    },
    find(isMax = false) {
      const handler = new PaymentDetailHandler();

      this.isLoading = true;

      this.paginatedPayload.createdStart = moment(this.startDate.getTime())
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      this.paginatedPayload.createdEnd = moment(this.endDate.getTime())
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      this.paginatedPayload.limit = isMax
        ? 10000000
        : this.paginatedPayload.limit;

      handler
        .findPaginated(this.paginatedPayload, {
          "0": Types.PaymentsEnums,
          [Types.StudentsEnums]: {
            "0": Types.ClassesEnums,
          },
        })
        .then((response) => {
          this.details = response.data;
          this.count = response.totalItems;
          this.paginatedPayload.limit = 20;
        });
    },
    changePage(page = 1) {
      this.currentPage = page;
      this.paginatedPayload.offset = this.paginatedPayload.limit * (page - 1);
      return this.find(false);
    },
    className(classes: Array<Class>) {
      return classes[classes.length - 1].name;
    },
    updateFilterBy() {
      const diff = moment(this.endDate.getTime()).diff(
        moment(this.startDate.getTime()),
        "days"
      );

      switch (diff) {
        case 0:
          this.filterBy = "harian";
          break;
        case 27 || 28 || 29 || 30:
          this.filterBy = "harian";

          break;
        case 6:
          this.filterBy = "mingguan";

          break;

        default:
          this.filterBy = "custom";
          break;
      }
    },
    async savePdf() {
      const items = [];
      await this.find(true);

      for (const idx in this.details) {
        items.push({
          id: this.details[idx].id,
          jenis: this.details[idx].relations?.payment?.label,
          nama: this.details[idx].relations?.student?.name,
          kelas: this.className(
            this.details[idx].relations?.student?.relations?.classes!
          ),
          bayar: this.details[idx].pay.toLocaleString(),
          deskripsi: this.details[idx].description,
        });
      }
      // const academicYearIdx = this.academicYears.findIndex(
      //   (i) => i.id === this.academicYearId
      // );
      // const academicYear = this.academicYears[academicYearIdx];
      // const items: Array<ItemsPayload> = [];

      // for (const idx in this.forms) {
      //   const payment = this.group.find(
      //     (i) => i.id === this.forms[idx].paymentId
      //   )!;
      //   const label = payment.label;
      //   const price = payment.price!;

      //   items.push({
      //     jenis: label,
      //     harga: price.toLocaleString(),
      //   });
      // }

      ipcRenderer.sendSync("print-report", {
        payload: {
          createdAt: moment().format("MMMM Do YYYY, HH:mm:ss"),
          reportType: this.filterBy.toUpperCase(),
          dateStart: moment(this.startDate.getTime()).format(
            "MMMM Do YYYY, HH:mm:ss"
          ),
          dateEnd: moment(this.endDate.getTime()).format(
            "MMMM Do YYYY, HH:mm:ss"
          ),
          items: items,
        },
      });
    },
  },
  mounted() {
    // Object.keys
    this.updateDateFilter();
    // this.find();
  },
});
</script>
<style scoped>
.menu-items {
  margin-left: 0.75rem;
}
</style>