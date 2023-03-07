<template>
  <TransitionRoot appear :show="props.formIsOpen" as="template">
    <Dialog as="div" @close="$emit('close-form')" class="relative z-10">
      <TransitionChild
      as="template"
      enter="duration-300 ease-out"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="duration-200 ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0"
      >
      <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
  
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="max-w-lg transform overflow-hidden rounded-2xl bg-stone-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-white">
                Fund Form
              </DialogTitle>
              <form @submit.prevent="handleSubmit">
                <div class="p-4">
                  <div class="h-1/3">
                    <label for="fund-name" class="text-xs font-semibold">Name</label>
                    <input id="fund-name" class="px-2 text-xl font-bold text-stone-50 mb-2 bg-transparent w-full border-0 border-b focus:outline-0 active:outline-0" v-model="fund.name" placeholder="College">
                  </div>
                  <div class="h-1/3">
                    <label for="fund-description" class="text-xs font-semibold">Description</label>
                    <textarea id="fund-description" class="text-sm text-stone-200 bg-transparent w-full border-0 border-b focus:outline-0 active:outline-0 focus:ring-0 active:ring-0" v-model="fund.description" placeholder="A creative description" maxlength="80"></textarea>
                  </div>
                  <div class="h-1/3 flex items-center justify-end my-4 space-x-2">
                    <button
                    class="text-white bg-transparent hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 rounded-md text-sm w-1/3 py-2 transition-colors"
                    type="button"
                    @click="$emit('close-form')"
                    >
                      Cancel
                    </button>
                    <button
                    class="text-yellow-400 bg-stone-900 hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 font-bold rounded-md text-sm w-1/3 py-2 transition-colors disabled:text-stone-300 disabled:bg-stone-700"
                    type="submit"
                    @click.prevent="handleSubmit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
 
<script setup>
import { ref } from 'vue'
import { useFundStore } from '../../stores/fundStore';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle, } from '@headlessui/vue'

const props = defineProps(['form-is-open', 'editing-fund'])
const emit = defineEmits(['close-form'])
const fundStore = useFundStore()

const queryInProgress = ref(false)
const fund = ref({
  _id: '',
  usersIDs: [],
  name: '',
  description: '',
  lastUpdated: new Date().toISOString().slice(0, 10),
  savings: 0,
})

const editing = props.editingFund !== null
if(editing) fund.value = { ...props.editingFund };

function handleSubmit() {
  queryInProgress.value = true
  const queryStatus = editing ? fundStore.editFund(fund.value) : fundStore.addFund(fund.value)
  alert(queryStatus.feedback)
  queryInProgress.value = false
  if(queryStatus.succeed) emit('close-form')
}
 </script>