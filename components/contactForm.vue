<template>
<section>
  <form action="#" class="space-y-6 mt-12 md:max-w-lg mx-auto">
    <div>
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Your email</label>
      <input v-model="email" type="email" id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@example.com" required>
    </div>
    <div class="sm:col-span-2">
      <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">Your message</label>
      <textarea v-model="message" id="message" rows="6" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
    </div>
    <div v-if="errors.length" class="bg-red-600 text-white py-2 px-4">Error{{errors}}</div>
    <div v-if="sent" class="bg-green-600 text-white py-2 px-4">Thank you. Your message has been sent.</div>
    <button :disabled="sending" @click="checkForm" type="submit" class="py-3 px-5 text-sm text-center text-white bg-black font-bold sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{{sending ? 'Sending message' : 'Send message'}}</button>
  </form>
</section>
</template>

<script>
export default {
  data() {
    return {
      sending: false,
      sent: null,
      errors: [],
      company: null,
      name: null,
      email: null,
      address: null,
      number: null,
      message: null
    };
  },
  methods: {
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    async checkForm(e) {
      this.sending = true

      e.preventDefault();
      this.errors = [];
      if (!this.email) {
        this.errors.push("Email required.");
        setTimeout(() => {
          this.errors = []
          this.sending = false
        }, 2000);
      } else if (!this.validEmail(this.email)) {
        this.errors.push("Valid email required.");
        setTimeout(() => {
          this.errors = []
          this.sending = false
        }, 2000);
      }
      if (!this.message) {
        this.errors.push("Message required.");
      }
      if (!this.errors.length) {
        var bodyFormData = new FormData();
        bodyFormData.set("your-email", this.email);
        bodyFormData.set("your-message", this.message);

        await this.$axios.post(`contact-form-7/v1/contact-forms/5/feedback`, bodyFormData).then((response) => {
            console.log(response);
            this.sent = true;
            this.sending = false
            setTimeout(() => {
              this.sent = false
              this.email = null
              this.message = null
            }, 3000);
            return true;
          })
          .catch((response) => {

            console.log(response);
          });

      }
    }
  }
};
</script>
