<template>
  <FullCalendar ref="calendar" :options="calendarOptions" />

  <button class="pure-button round-button blue-button" :disabled="validated" @click="showAddEventDialog = true"><b>+</b></button>

  <div>
    <vue-final-modal v-model="showAddEventDialog" classes="modal-container" content-class="modal-content">
      <AddEventForm :currDate="this.$globals.currentDateStr.substr(0,16)" @add-to-events="addNewEvent" @close-add-event="showAddEventDialog = false" />
      <!-- <span class="modal__title">Hello, vue-final-modal</span> -->
    </vue-final-modal>
    <!-- <button @click="showModal = true">Open Modal</button> -->
  </div>

</template>

<script>
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { firebaseConfig } from "./config.js";


import AddEventForm from './components/AddEventForm.vue';

const fbase = initializeApp(firebaseConfig);
const db = getFirestore();

const pick = (obj, ...args) => ({
  ...args.reduce((res, key) => ({ ...res, [key]: obj[key] }), {}),
});

export default {
  name: "App",
  components: {
    FullCalendar,
    AddEventForm,
  },
  //emits: ['close-add-event'],
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        initialView: "dayGridMonth",
        editable: true,
        selectable: true,
        //select:this.handleDateSelect,
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        events: [],
        eventAdd: this.handleEventAdd,
        eventChange: this.handleEventChange,
        eventRemove: this.handleEventRemove,
      },
      validated: true,
      showAddEventDialog: false,
      events: [],
      showModal: false,
    };
  },
  created() {
    this.fetchAndSetEvents();
    this.$globals.currentDateStr = this.createDateString(new Date());
  },
  methods: {
    async fetchAndSetEvents() {
      let query = await getDocs(collection(db, "events"));
      query.forEach((doc) => {
        this.addEvent(doc);
      });
      //console.log(this.events, this.calendarOptions.events);
      this.updateEventsArray();
    },
    sanitizeCalenderEventsFromEvents() {
      return pick(
        this.events,
        "id",
        "title",
        "start",
        "end",
        "allDay",
        "color"
      );
    },
    addEvent(doc) {
      let id = doc.id;
      let event = doc.data();
      event["id"] = id;
      let events = this.events;
      events.push(event);
      this.events = events;
    },
    closeAddEventDialog() {
      this.showAddEventDialog = false;
    },
    createDateString(date) {
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date
        .getSeconds()
        .toString()
        .padStart(2, "0")}${this.timeZoneParser(date.getTimezoneOffset())}`;
    },
    timeZoneParser(mins) {
      let starter = "-";
      if (mins < 0) {
        starter = "+";
        mins = Math.abs(mins);
      }
      let n = mins;
      let hours = n / 60;
      let rhours = Math.floor(hours);
      let minutes = (hours - rhours) * 60;
      let rminutes = Math.round(minutes);
      return `${starter}${rhours.toString().padStart(2, 0)}:${rminutes
        .toString()
        .padStart(2, 0)}`;
    },
    handleDateClick(arg) {
      let date = new Date(Date.parse(arg.date));
      // console.log(arg.date)
      //console.log(date.getFullYear());
      this.$globals.currentDateStr = this.createDateString(date);
      //console.log(this.createDateString(date));

      this.validated = false;
    },
    showEventDialog() {
      // this.showAddEventDialog = !this.showAddEventDialog;
      // this.calendarOptions.selectable = false;
      // MicroModal.show("modal-1");
    },

    // handleDateSelect(arg) {
    //   console.log(arg);
    // },
    addNewEvent(data){
      //console.log(data);
      let id = uuidv4();
      let event = {
        id: id,
        title: data.title,
        desc: data.desc,
        start: data.start,
        allDay: data.allDay,
        color: data.color,
        end: data.end,
        calenderID: "asdfgh"
      };
      console.log(event);
      let events = this.events;
      events.push(event);
      this.events = events;

      this.addEventToFbase(event);

      this.updateEventsArray();
    },
    async addEventToFbase(data) {
      let id = data.id;
      let obj = pick(data, "title", "desc", "start", "end", "allDay", "color", "calenderID");
      let docRef = doc(db, "events", id);
      await setDoc(docRef, obj);
    },
    updateEventsArray() {
      this.calendarOptions.events = this.events;
    },
    handleEventClick(arg) {
      let event = this.events.filter((event) => event.id === arg.event.id)[0];
      console.log(Object.keys(event), Object.keys(arg.event._def));
    },
    handleEvents(arg) {
      this.currentEvents = arg;
    },
    handleEventAdd(arg) {
      console.log(arg);
    },
    handleEventChange(arg) {
      let event = this.events.filter((event) => event.id === arg.event.id)[0];
    },
    handleEventRemove(arg) {
      console.log(arg);
    },
  },
};
</script>

<style>
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>

<style scoped>
button{
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