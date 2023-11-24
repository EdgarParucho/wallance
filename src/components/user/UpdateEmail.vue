<template>
  <Dialog
  :form-is-open="formIsOpen"
  @close-form="$emit('close-form')"
  :icon="AtSymbolIcon"
  title="Updating my email"
  subtitle="You'll need to validate the new address"
  >
    <form @submit.prevent="onSubmit" class="rounded-md px-8 pb-10">
      <fieldset class="my-6">
        <input
        type="email"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="example@newemail.com"
        required
        v-model.trim="email"
                >
        <input
        v-if="validatingEmail"
        type="text"
        class="w-full my-2 p-1 focus:ring-0 border-transparent focus:border-transparent focus:border-b-violet-500 border-b-stone-400 bg-transparent"
        placeholder="OTP"
        required
        v-model="OTP"
        >
      </fieldset>
      <button
      type="submit"
      class="flex justify-center items-center space-x-2 w-full mt-6 py-1 outline-none font-bold rounded-sm text-white bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 dark:disabled:bg-stone-800 dark:disabled:text-stone-500 focus:outline-violet-500 outline-1"
      :disabled="loading || someFieldIsEmpty || !emailFormatIsValid"
      >
        <svg
        v-if="loading"
        class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-if="loading" class="mx-auto">Processing...</span>
        <span v-else>{{ validatingEmail ? 'Update Now': 'Validate My Email' }}</span>
      </button>
      <button
      v-if="validatingEmail"
      class="flex items-center gap-1 mx-auto mb-3 px-3 py-1 text-xs hover:border-stone-500 text-stone-600 hover:scale-110 transition-all hover:text-black dark:hover:text-white"
      @click="requestOTP({ email })"
      :disabled="loading || countDown > 0"
      type="button"
      >
        Request code again
        <span v-if="countDown > 0">
          ({{ countDown }})
        </span>
      </button>
    </form>
  </Dialog>
</template>

<script setup>
import { computed, ref, inject } from 'vue';
import { AtSymbolIcon } from '@heroicons/vue/24/outline';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import Dialog from '../layout/Dialog.vue';

const emit = defineEmits(['close-form'])
const props = defineProps({ formIsOpen: { type: Boolean, required: true } })
const showAlert = inject("showAlert");
const showToast = inject("showToast");

const userStore = useUserStore();
const authStore = useAuthStore();

const loading = ref(false)
const countDown = ref(0);

const email = ref('');
const someFieldIsEmpty = computed(() => {
  const emailFieldEmpty = email.value === ''
  const tokenFieldEmpty = validatingEmail.value && OTP.value === ''
  return emailFieldEmpty || tokenFieldEmpty
})
const validatingEmail = ref(false)
const OTP = ref('');

function onSubmit() {
  if (validatingEmail.value) updateEmail(OTP.value, email.value);
  else requestOTP({ email: email.value })
}

const emailFormatIsValid = computed(() => {
  const emailformat = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  const emailIsValid = emailformat.test(email.value)
  return emailIsValid
})

function updateEmail(OTP, email) {
  loading.value = true
  userStore.updateUser({ OTP, updateEntries: { email } })
  .then((message) => {
    showToast(message);
    emit('close-form');
  })
  .catch((message) => showAlert({ type: "error", text: message }))
  .finally(() => loading.value = false)
}

function requestOTP({ email }) {
  loading.value = true
  authStore.requestOTP({ email, emailShouldBeStored: false })
    .then(({ message }) => {
      showAlert({ type: "info", text: message });
      validatingEmail.value = true;
      startCountDown();
    })
    .catch((message) => showAlert({ type: "error", text: message }))
    .finally(() => loading.value = false)
}

function startCountDown() {
  countDown.value = 30;
  const counting = setInterval(function() {
    if (countDown.value === 0) clearInterval(counting)
    else countDown.value -= 1
  }, 1000);
}

</script>

<style scoped>
/* Remove the default arrows from input number fields */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
  appearance: inherit;
}
</style>