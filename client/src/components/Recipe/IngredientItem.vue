<template>
  <tr>
    <td><i class="fa fa-bars dhandle"></i></td>
    <td class="dhandle" @click="editI()">{{ item.name }}</td>
    <td class="center dhandle" @click="editI()">{{ Number(item.quantity).toLocaleString() }}</td>
    <td class="center dhandle" @click="editI()">{{ item.measurement }}</td>
    <td class="center dhandle" @click="editI()">{{ item.identifier }}</td>
    <td>
      <i class="fa fa-trash-o" style="margin-left: 1em" @click="confirm(deleteI)"></i>
    </td>
  <modal-edit-ingredient :name="item.name" :dataex="item"></modal-edit-ingredient>
  </tr>
</template>

<script>
import { HTTP } from '@/common/utilities';
import ModalEditIngredient from './ModalEditIngredient';

export default {
  components: {
    ModalEditIngredient
  },
  props: [
    'item'
  ],
  methods: {
    editI() {
      this.$modal.show(this.item.name, this.item);
    },
    async deleteI() {
      await HTTP.delete(`api/ingredients/${this.item.id}`);
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
