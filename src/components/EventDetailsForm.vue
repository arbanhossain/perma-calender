<template>
  <!--
    Form for viewing event details and editing
  -->
  <div class="modal__content">
    <FormKit
      type="form"
      v-model="event"
      :actions="false"
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        name="title"
        label="Title"
        validation="required"
      />
      <FormKit type="textarea" name="desc" label="Description" />
      <FormKit type="checkbox" name="allDay" label="All Day Event" />
      <FormKit type="datetime-local" name="start" label="Start Date" />
      <FormKit
        v-if="!event.allDay"
        type="datetime-local"
        name="end"
        label="End Date"
      />
      <FormKit
        type="select"
        name="color"
        :options="this.$globals.colors"
      />

      <button type="submit" class="pure-button">OK</button>
    </FormKit>
  </div>
</template>

<script>
export default {
  name: "EventDetailsForm",
  date() {
    return {
      formData: {},
    };
  },
  props: ["event"],
  emits: ['update-event', 'close-event-details'],
  methods: {
    handleSubmit() {
      // console.log(this.event);
      if(!this.validateFormData(this.event)){
        window.FlashMessage.error("Validation Error");
        return;
      }
      if(this.event.allDay === true) this.event.end = "";
      this.$emit('update-event', this.event);
      this.$emit('close-event-details');
    },
    handleChange() {
    },
    validateFormData(eventFormData) {
      if (
        eventFormData.title === undefined ||
        eventFormData.title === "" ||
        eventFormData.desc === undefined ||
        eventFormData.desc === "" ||
        eventFormData.start === ""
      ) {
        return false;
      }
      if (eventFormData.allDay === false) {
        if (
          eventFormData.end === undefined ||
          eventFormData.end === ""
        ) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>

<style scoped>
button {
  margin: 1em;
}
.round-button {
  text-align: center;
  border-radius: 1rem;
  margin: 20px;
  color: white;
}

.blue-button {
  background: rgb(132, 230, 255);
}
</style>

<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>