<template>
  <div class="w-full max-w-3xl p-2 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
    <div class="flex w-full">
      <label class="w-full">{{payload.label}}</label>
      <div class="w-full text-right">
        <button type="button" class=" p-1 text-white rounded-md" :class="createMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'" @click="createMode = !createMode">{{createMode ? 'Batal' :'Tambah Data'}}</button>
      </div>
    </div>
      <div class="bg-white shadow-sm rounded-lg w-full h-full overflow-y-auto p-2 text-xs">
      <div class="border rounded-lg w-full flex pb-2 flex-wrap">
        <div class="w-full flex border-b px-3 py-1 bg-white text-gray-600 font-bold rounded-t-lg">
          <template v-for="field in payload.fields" :key="field.key">
            <div class="w-full"><label>{{field.label}}</label></div>
          </template>
          <div class="w-full text-right"><label>Aksi</label></div>
        </div>
        <template v-if="tuples.length > 0">
          <template  v-for="(tuple, index) in tuples" :key="'tuple' + tuple.id">
            <div class="w-full flex px-3 items-center border-b py-1">
              <template v-for="field in payload.fields" :key="field.key">
                <template v-if="editMode.findIndex(i => i == index) == -1">
                  <label class="w-full mb-1 font-semibold text-gray-600">{{tuple[field.key]}}</label>
                </template>
                <template v-else>
                  <template v-if="field.key !== 'id' && field.input && (field.input == 'text' || field.input == 'number')">
                    <input :type="field.input" class="bg-gray-100 border border-gray-300 p-2 h-9 w-full rounded-lg hover:outline-none  mb-1 focus-within:outline-none focus:outline-none input" v-model="tuple[field.key]">
                  </template>
                  <template v-if="field.key !== 'id' && field.input && field.input == 'select'">
                    <select v-model="tuple[field.key]" class="w-full list-kelas p-2 rounded-lg mb-1 bg-gray-100 h-9 border-gray-700 border">
                      <template v-for="option in field.selectValues" :key="option">
                        <option :value="option">{{option}}</option>
                      </template>
                    </select>
                  </template>
                </template>
              </template>
              <div class="w-full text-right">
                <template v-if="editMode.findIndex(i => i == index) == -1">
                  <button  type="button" class="bg-blue-500 p-1 rounded-md text-white" @click="editMode.push(index)">
                      <PencilIcon class="mx-2 h-5 w-5 inline-block" />
                  </button>
                </template>
                <template v-else>
                  <button  type="button" class="bg-red-500 p-1 rounded-md text-white mr-1" @click="removeEditMode(index)">
                      <XIcon class="mx-2 h-5 w-5 inline-block" />
                  </button>
                  <button  type="button" class="bg-green-500 p-1 rounded-md text-white" @click="submitUpdate(index)">
                      <CheckIcon class="mx-2 h-5 w-5 inline-block" />
                  </button>
                </template>
              </div>
            </div>
          </template>
        </template>
        <div class="w-full flex px-3 items-center border-b py-1" v-if="createMode">
          <template v-for="field in payload.fields" :key="field.key">
            <div class="w-full" v-if="field.key !== 'id'">
              <template v-if="field.input && (field.input == 'text' || field.input == 'number')">
                <input :type="field.input" class="bg-gray-100 border border-gray-300 p-2 h-9 w-full rounded-lg hover:outline-none  mb-1 focus-within:outline-none focus:outline-none input" v-model="newData[field.key]">
              </template>
              <template v-if="field.input && field.input == 'select'">
                <select v-model="newData[field.key]" class="w-full list-kelas p-2 rounded-lg mb-1 bg-gray-100 h-9 border-gray-700 border">
                  <template v-for="option in field.selectValues" :key="option">
                    <option :value="option">{{option}}</option>
                  </template>
                </select>
              </template>
            </div>
          </template>
          <div class="w-full text-right">
            <button type="button" class="bg-green-500 p-1 rounded-md text-white" :disabled="buttonCreateDisable" :class="buttonCreateDisable ? 'opacity-50' : 'hover:bg-green-600'" @click="submitCreate">
                <CheckIcon class="mx-2 h-5 w-5 inline-block" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";
import { PencilIcon, CheckIcon, XIcon } from "@heroicons/vue/outline";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

export default defineComponent({
  data() {
    return {
      tuples: Array<any>(),
      newData: {} as any,
      createMode: false,
      editMode: []
    };
  },
  computed: {
    ...mapState("app", { payload: "modalPayload" }),
    buttonCreateDisable(): boolean {
      let isNotValid = false;

      for (const idx in this.payload.fields) {
        if (this.payload.fields[idx].key == "id") {
          continue;
        }
        isNotValid = this.newData[this.payload.fields[idx].key].trim() == "";

        if (isNotValid) {
          break;
        }
      }

      return isNotValid;
    },
  },
  methods: {
    ...mapActions("app", ["closeModal"]),
    async submitCreate() {
      await this.payload.create(this.newData);

      createToast("Berhasil menambahkan data", {
        hideProgressBar: true,
        type: "success",
      });

      this.closeModal();
    },
    async submitUpdate(index: any) {
      await this.payload.update(this.tuples[index]);

      createToast("Berhasil mengubah data", {
        hideProgressBar: true,
        type: "success",
      });

      this.closeModal();
    },

    removeEditMode (index: any) {
      const editIdx = this.editMode.findIndex(i => i == index)

      this.editMode.splice(editIdx, 1)
    }
  },
  components: {
    PencilIcon,
    CheckIcon,
    XIcon
  },
  async mounted() {
    for (const idx in this.payload.fields) {
      if (this.payload.fields[idx].key == "id") {
        continue;
      }

      this.newData[this.payload.fields[idx].key] = "";
    }

    this.tuples = await this.payload.findAll();
  },
});
</script>