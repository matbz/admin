<template>
  <tr>
    <td><i class="fa fa-bars dhandle"></i></td>
    <td @click="editStep()" class="dhandle" style="width: 45em">{{ item.step }}</td>
    <td>
      <i class="fa fa-trash-o" style="margin-left: 1em" @click="confirm(deleteStep)"></i>
    </td>
  <modal-edit-step :name="nameS" :dataex="item"></modal-edit-step>
  </tr>
</template>

<script>
import { HTTP } from '@/common/utilities';
import ModalEditStep from './ModalEditStep';

export default {
  components: {
    ModalEditStep
  },
  props: [
    'item'
  ],
  computed: {
    nameS() {
      return `${this.item.id}step`;
    }
  },
  methods: {
    editStep() {
      this.$modal.show(this.nameS, this.item);
    },
    async deleteStep() {
      await HTTP.delete(`api/steps/${this.item.id}`);
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
