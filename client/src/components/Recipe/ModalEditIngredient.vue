<template>
  <modal :name="name" :width="400" height="auto" :pivot-y="0.3" @opened="opened">
    <ul class="form-style-1" @keyup.esc="close()" @keyup.enter="save()">
      <li>
          <label>Menge</label>
          <input ref="quantity" type="text" class="field-long" v-model.trim="data.quantityString"/>
      </li>
      <li>
          <label>Mengeneinheit</label>
          <input ref="measurement" type="text" class="field-long" v-model.trim="data.measurement"/>
      </li>
      <li>
          <label>Name</label>
          <input ref="name" type="text" class="field-long" v-model.trim="data.name"/>
      </li>
      <li>
          <label>Platzhalter</label>
          <input ref="identifier" type="text" class="field-long" v-model.trim="data.identifier"/>
      </li>
      <li style="margin-top: 20px"></li>
      <li class="account-widget-footer">
          <button
            class="button button-cancel x-14"
            @click="close()"
          >
            Abbrechen
            <i class="fa fa-times-circle-o"></i>
          </button>
          <button
            type="submit"
            class="button button-primary x-14"
            @click="save()"
            style="float: right"
          >
            Speichern
            <i class="fa fa-check-circle-o"></i>
          </button>
      </li>
    </ul>
  </modal>
</template>

<script>
import { HTTP } from '@/common/utilities';

export default {
  props: [
    'name',
    'dataex'
  ],
  data() {
    return {
      data: {
        ...this.dataex,
        quantityString: Number(this.dataex.quantity).toLocaleString()
      }
    };
  },
  methods: {
    opened() {
      this.data.quantityString = Number(this.dataex.quantity).toLocaleString();
      this.$refs.quantity.focus();
    },
    close() {
      this.data = {
        ...this.dataex
      };

      this.$modal.hide(this.name);
    },
    async save() {
      try {
        this.data.quantity = parseFloat(this.data.quantityString.replace(/,/g, "."));
        await HTTP.put(`api/ingredients/${this.data.id}`, this.data);
        this.$store.dispatch('refresh');
        this.$modal.hide(this.name);
      } catch (error) {
        this.$toasted.error('Error');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-style-1{
    margin:10px auto;
    max-width: 400px;
    padding: 5px 12px 10px 20px;
    color: black;
}
.form-style-1 li {
    padding: 0;
    display: block;
    list-style: none;
    margin: 2px 0 0 0;
}
.form-style-1 label{
    margin:0 0 5px 1px;
    padding:0px;
    display:block;
    font-weight: bold;
    font-size: 14px;
}
.form-style-1 input[type=text],
.form-style-1 input[type=date],
.form-style-1 input[type=datetime],
.form-style-1 input[type=number],
.form-style-1 input[type=search],
.form-style-1 input[type=time],
.form-style-1 input[type=url],
.form-style-1 input[type=email],
textarea,
select{
    width: 100%;
    font-size: 1em;
    padding: .5em;
    margin-bottom: .5em;
    border: 2px solid #88979d;
    -webkit-border-radius: .3em;
    border-radius: .3em;
}
.form-style-1 input[type=text]:focus,
.form-style-1 input[type=date]:focus,
.form-style-1 input[type=datetime]:focus,
.form-style-1 input[type=number]:focus,
.form-style-1 input[type=search]:focus,
.form-style-1 input[type=time]:focus,
.form-style-1 input[type=url]:focus,
.form-style-1 input[type=email]:focus,
.form-style-1 textarea:focus,
.form-style-1 select:focus{
    border: 2px solid #009cc2;
}
.form-style-1 .field-divided{
    width: 49%;
}

.form-style-1 .field-long{
    width: 100%;
}
.form-style-1 .field-select{
    width: 100%;
}
.form-style-1 .field-textarea{
    height: 100px;
}
</style>
