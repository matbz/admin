<template>
  <tr :class="{ igactive: selectedIG.id === item.id }">
    <td><i class="fa fa-bars dhandle"></i></td>
    <td class="dhandle" @click="editIG()">{{ item.name }}</td>
    <td>
      <i class="fa fa-trash-o" style="margin-left: 1em" @click="confirm(deleteIG)"></i>
    </td>
    <td>
      <i class="fa fa-eye" @click="setIG()" style="margin-left: .6em"></i>
    </td>
  <modal-edit-group :name="item.name" :dataex="item"></modal-edit-group>
  </tr>
</template>

<script>
import { HTTP } from '@/common/utilities';
import { mapGetters } from 'vuex';
import ModalEditGroup from './ModalEditGroup';

export default {
  components: {
    ModalEditGroup
  },
  props: [
    'item'
  ],
  computed: {
    ...mapGetters([
      'selectedIG'
    ]),
  },
  methods: {
    async setIG() {
      await this.$store.dispatch('setIG', this.item);
      this.$store.dispatch('refresh');
    },
    editIG() {
      this.$modal.show(this.item.name, this.item);
    },
    async deleteIG() {
      await HTTP.delete(`api/ingredientgroups/${this.item.id}`);
      this.$store.dispatch('refresh');
    },
    confirm(func, id) {
      this.$modal.show('dialog', {
        title: 'Bestätigung',
        text: 'Diesen Eintrag wirklich löschen?',
        buttons: [
          { title: 'Ja', handler: () => { func(); this.$modal.hide('dialog'); } },
          { title: 'Nein' }
        ]
      });
     },
  }
};
</script>
