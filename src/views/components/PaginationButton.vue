<template>
	<div>
		<div class="flex pl-0 rounded my-2 text-sm justify-end">
			<button class="relative block py-2 px-3 bg-white-not-important leading-tight bg-gray-1 border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-blue-600 hover:text-white transition-colors" @click="changePage(currentPage - 1)" :class="currentPage === 1 ? 'hidden' : ''">
				<a>Previous</a>
			</button>
			<template v-for="page in countLoop()" :key="'page-' + page">
				<template v-if="countLoop() > 5 && page == 3">
					<button class="relative block py-2 px-3 leading-tight bg-gray-1 border border-gray-300 text-blue-700 border-r-0 hover:bg-blue-600 hover:text-white transition-colors" 
						@click="changePage(page)" 
						:class="currentPage === page ? 'bg-blue-500 text-white' : 'bg-white-not-important'"
						:disabled="currentPage === page"
					>
						<a>{{page}}</a>
					</button>
					<div class="relative block py-2 px-3 bg-white-not-important leading-tight bg-gray-1 border border-gray-300 text-blue-700 border-r-0 hover:bg-blue-600 hover:text-white transition-colors">
						<a>...</a>
					</div>
				</template>
				<template v-else-if="page === countLoop()">
					<button class="relative block py-2 px-3 leading-tight bg-gray-1 border border-gray-300 text-blue-700 border-r-0 hover:bg-blue-600 hover:text-white transition-colors" 
						@click="changePage(page)" 
						:class="currentPage === page ? 'bg-blue-500 text-white' : 'bg-white-not-important'"
						:disabled="currentPage === page"
					>
						<a>{{page}}</a>
					</button>
				</template>
				<template v-else-if="countLoop() > 5 && page > 3">
				</template>
				<template v-else>
					<button class="relative block py-2 px-3 leading-tight bg-gray-1 border border-gray-300 text-blue-700 border-r-0 hover:bg-blue-600 hover:text-white transition-colors" 
						@click="changePage(page)" 
						:class="currentPage === page ? 'bg-blue-500 text-white' : 'bg-white-not-important'"
						:disabled="currentPage === page"
					>
						<a>{{page}}</a>
					</button>
				</template>
			</template>
			<button type="button" class="relative block py-2 px-3 bg-white-not-important leading-tight bg-gray-1 border border-gray-300 text-blue-700 rounded-r hover:bg-blue-600 hover:text-white transition-colors" @click="changePage(currentPage + 1)" :class="currentPage === countLoop() || count === 0 ? 'hidden' : ''">
				<a>Next</a>
			</button>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    limit: {
      type: Number,
      default: 0,
    },
    pageItems: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const countLoop = () => {
      const count = props.count;
      const limit = props.limit;
      return Math.ceil(count / limit);
    };

    return { countLoop };
  },
  methods: {
    changePage(page: number) {
      this.$emit("change-page", page);
    },
  },
});
</script>
