<template>
  <div class="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
      <div class="absolute bg-black opacity-50 inset-0 z-0" @click="closeCurrentModal"></div>
      <component :is="modalComponent"></component>
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
export default {
  computed: {
    ...mapState('app', ['modalComponent'])
  },
  methods: {
    ...mapActions('app', ['closeModal']),
    closeCurrentModal () {
      this.closeModal()
    }
  }
  
}
</script>