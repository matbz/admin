<template>
  <div class="ynab-u content">
    <div class="register-flex-columns">
      Tag
   </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {

  },
  props: [
  ],
  computed: {
    ...mapGetters([

    ])
  },
  methods: {
    getTurnovers() {

    }
  },
  created() {
    this.$store.dispatch('getCategories');
    this.$store.dispatch('getCategoryGroups');
    this.$store.dispatch('getPayees');
  },
};
</script>
