<template>
  <!-- <div class="modal__title">
    <p>Add Event</p>
  </div> -->
  <div class="modal__content">
    <FormKit
      type="form"
      v-model="eventFormData"
      @submit="handleEventSubmit"
      :actions="false"
    >
      <FormKit type="text" name="title" label="Title" />
      <FormKit type="textarea" name="desc" label="Description" />
      <FormKit type="checkbox" name="allDay" label="All Day Event" />
      <FormKit v-model="currDate" type="datetime-local" name="start" />
      <FormKit
        type="datetime-local"
        name="end"
        v-if="!this.eventFormData.allDay"
      />
      <!-- <FormKit
        type="text"
        name="start"
        label="Start"
        help="Date"
        validation="required"
      />
      <FormKit
        type="select"
        name="hours"
        help="hours"
        :options="[
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23,
        ]"
      />
      <FormKit
        type="select"
        name="minutes"
        help="minutes"
        :options="[0, 15, 30, 45]"
      /> -->
      <!-- <FormKit type=datetime-local name=end label=End help=Ends v-if="!this.eventFormData.allDay" /> -->
      <FormKit
        type="select"
        name="color"
        :options="['pink', 'lime', 'cyan', 'gray']"
      />
      <button type="submit" class="pure-button blue-button">
        Submit Event
      </button>
    </FormKit>
  </div>
  <!-- <div class="modal__actions">
    <button class="pure-button" @click="$emit('close-add-event')">Close</button>
  </div> -->
</template>

<script>
export default {
  name: "AddEventForm",
  data() {
    return {
      eventFormData: {
        // start: this.currDate,
        allDay: false,
      },
    };
  },
  mounted() {
    // console.log('mounted');
  },
  emits: ["close-add-event", "add-to-events"],
  props:['currDate'],
  methods: {
    handleEventSubmit() {
      if (!this.validateFormData()) {
        window.FlashMessage.error("Validation Error")
        return;
      }
      // console.log(this.eventFormData);
      //   console.log(this.currentDate);
      if(this.eventFormData.allDay == true) this.eventFormData.end = "";
      this.$emit("add-to-events", this.eventFormData);
      this.clearFormData();
      this.$emit("close-add-event");
    },
    clearFormData() {
      this.eventFormData.title = "";
      this.eventFormData.desc = "";
      this.eventFormData.allDay = false;
      this.eventFormData.start = this.currDate;
      this.eventFormData.end = "";
    },
    validateFormData() {
      if (
        this.eventFormData.title === undefined ||
        this.eventFormData.title === "" ||
        this.eventFormData.desc === undefined ||
        this.eventFormData.desc === "" ||
        this.eventFormData.start === ""
      ) {
        return false;
      }
      if (this.eventFormData.allDay === false) {
        if (this.eventFormData.end === undefined || this.eventFormData.end === "") {
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

FormKit[type="submit"] {
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