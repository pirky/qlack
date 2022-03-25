<template>
  <q-page-sticky expand position="bottom" class="bg-transparent command_line">
    <q-input
      v-model="newMessage"
      bg-color="dark"
      class="full-width input"
      outlined
      autogrow
      input-style="max-height: 4.5em; min-height: 4.5em"
      label="Message"
      >

      <q-item class="typing_name" clickable>Someone is typing...
        <q-menu fit anchor="top middle" self="bottom middle">
          <q-list style="min-width: 100px">

            <q-item class="q-pt-sm q-pb-sm q-pl-md q-pr-md" style="min-height: 0">
              Roman
              <q-tooltip anchor="top middle" self="bottom middle">
                Pisem daco
              </q-tooltip>
            </q-item>

            <q-item class="q-pt-sm q-pb-sm q-pl-md q-pr-md" style="min-height: 0">
              Gábor
              <q-tooltip anchor="top middle" self="bottom middle">
                Pisem daco pekne
              </q-tooltip>
            </q-item>

            <q-item class="q-pt-sm q-pb-sm q-pl-md q-pr-md" style="min-height: 0">
              Ctibor
              <q-tooltip anchor="top middle" self="bottom middle">
                Pisem daco skarede
              </q-tooltip>
            </q-item>

            <q-item class="q-pt-sm q-pb-sm q-pl-md q-pr-md" style="min-height: 0">
              Jerguš
              <q-tooltip anchor="top middle" self="bottom middle">
                Pisem daco barz dluhe dluhe dlu
              </q-tooltip>
            </q-item>

          </q-list>
        </q-menu>
      </q-item>

      <template v-slot:after>
        <q-btn
          round
          dense
          flat
          icon="send"
          color="white"
        />
      </template>
    </q-input>
  </q-page-sticky>
</template>

<script>
export default {
  name: 'CommandLine',

  data () {
    return {
      newMessage: ''
    }
  }
}
</script>

<style scoped>
.command_line {
  padding: 0.4em;
}

.input {
  opacity: 0.9;
  display: flex;
  align-items: flex-end;
}

.typing_name {
  position: absolute;
  top: 0.4em;
  right: 0;
  margin: 0;
  padding: 0;
  width: auto;
  font-size: 0.9em;
  max-height: 2.5em;
  min-height: 0;
  color: #888b94;
  opacity: 1;
}

.typing_name:hover {
  color: #eeeeee;
  background-color: #393e46;
  opacity: 1;
}
</style>
