<template>
  <div class="ynab-u content">
    <img src="../../../../server/uploads/2.jpg" width="100" height="100">
    <div class="cat_test"></div>
    <div class="register-flex-columns">
<div class="cat">
  <div class="cat_content">
       <!-- <img class="cat_img" src="../../../static/turkey.svg"> -->
       <div class="cat_content">Aufstriche, Soßen und Dips</div>
       
  </div>
</div>      
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
