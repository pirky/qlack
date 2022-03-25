<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section> Create new channel </q-card-section>
      <q-card-section>
        <q-input
          v-model="channelName"
          label="Channel name"
          filled
          class="q-mt-sm"
          style="width: 100%"
          :rules="nameRules"
        />
      </q-card-section>

      <q-card-section>
        <q-toggle
          v-model="isPrivate"
          label="Private channel"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Create" @click="createChannel()" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { ref, defineComponent } from 'vue'

export default defineComponent({
  props: {
  },

  emits: [
    ...useDialogPluginComponent.emits
  ],

  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const $q = useQuasar()
    const channelName = ref('')
    const isPrivate = ref(false)
    const nameRules = [(value: string) => !!value || 'Field is required']

    return {
      nameRules,
      dialogRef,
      onDialogHide,
      isPrivate,
      channelName,

      createChannel () {
        if (channelName.value) {
          onDialogOK({
            channelName: channelName.value,
            isPrivate: isPrivate.value
          })
        } else {
          $q.notify({
            color: 'negative',
            message: 'Channel name has to be set.',
            position: 'top'
          })
        }
      },
      onCancelClick: onDialogCancel
    }
  }
})
</script>
