<template>
  <div>
    <label class="text-lg font-bold text-gray-700">Pembayaran</label>
    <div class="emulated-flex-gap">
      <router-link :to="{ name: 'view_pembayaran', params: { idName: 'spp' }}"  class=" w-40 h-16 bg-white shadow-sm flex items-center text-gray-700 font-bold rounded-lg list-menu p-2">
        <span class="w-full">SPP</span>
        <ChevronRightIcon class="h-5 w-5"/>
      </router-link>
      <router-link :to="{ name: 'view_pembayaran', params: { idName: 'lainnya' }}"  class=" w-40 h-16 bg-white shadow-sm flex items-center text-gray-700 font-bold rounded-lg list-menu p-2">
        <span class="w-full">Pembayaran Lainnya</span>
        <ChevronRightIcon class="h-5 w-5"/>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ChevronRightIcon } from "@heroicons/vue/outline";
import { findAll } from "@/db/action/payment";
import { Payment } from "@/db/model/payment";
import { any } from "sequelize/types/lib/operators";

export default defineComponent({
  data() {
    return {
      payments: Array<any>(),
    };
  },
  components: {
    ChevronRightIcon,
  },
  methods: {
    fetchPayment() {
      findAll().then((response) => {
        for (const i in response) {
          const item = response[i];
          if (item.group !== null && item.key === item.group) {
            this.payments.push({
              data: item,
              group: [],
            });
          } else if (item.group === null) {
            this.payments.push({
              data: item,
              group: [],
            });
          } else {
            const idx = this.payments.findIndex(
              (i) => i.data.key === item.group
            );
            this.payments[idx].group.push(item);
          }
        }
      });
    },
  },
  async mounted() {
    await this.fetchPayment();
    console.log(this.payments);
  },
});
</script>