<template>
  <div v-if="modal">
    <div
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
    >
      <div class="relative w-auto my-6 mx-auto max-w-6xl">
        <div
          class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
        >
          <div
            class="flex items-start justify-between p-2 border-b border-solid border-slate-200 rounded-t"
          >
            <h3 class="text-3xl font-semibold">{{ heading }}</h3>
            <button
              class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              @click="hideModal()"
            >
              x
            </button>
          </div>
          <div class="relative p-4 flex-auto">
            <p class="text-slate-500 text-lg leading-relaxed">
              {{ body }}
            </p>
          </div>
          <div
            class="flex items-center p-2 border-t border-solid border-slate-200 rounded-b"
          >
            <button
              class="text-white bg-green-500 border border-solid border-green-500 hover:bg-green-500 hover:text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none ml-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              @click="onConfirm()"
            >
              OK
            </button>
            <button
              class="text-white bg-red-500 border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none ml-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              @click="hideModal()"
              v-if="enableCancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script>
export default {
  name: "confirmation-dialog",
  props: {
    enableCancel: {
      type: Boolean,
      default: true,
    },
    heading: {
      type: String,
      default: "Confirm",
    },
    body: {
      type: String,
      default: "Do you want to continue?",
    },
  },
  data() {
    return {
      modal: false,
    };
  },
  methods: {
    toggleModal() {
      this.modal = !this.modal;
    },
    showModal() {
      this.modal = true;
    },
    hideModal() {
      this.modal = false;
    },
    onConfirm() {
      this.$emit("onConfirm", true);
    },
  },
};
</script>
