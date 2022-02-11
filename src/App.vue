<template>
  <FullCalendar ref="calendar" :options="calendarOptions" />

  <button :disabled="validated" @click="showEventDialog">Add Event</button>

  <div v-show="showAddEventDialog">hahahaah</div>
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
} from "firebase/firestore";
import { firebaseConfig } from "./config.js";

const fbase = initializeApp(firebaseConfig);
const db = getFirestore();

const pick = (obj, ...args) => ({
  ...args.reduce((res, key) => ({ ...res, [key]: obj[key] }), { })
})

export default {
  name: "App",
  components: {
    FullCalendar,
  },
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
      currentDateStr: "",
      validated: true,
      showAddEventDialog: false,
      events: [],
    };
  },
  created() {
    this.fetchAndSetEvents();
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
    sanitizeCalenderEventsFromEvents(){
      return pick(this.events, "id", "title", "start", "end", "allDay", "color");
    },
    addEvent(doc) {
      let id = doc.id;
      let event = doc.data();
      event["id"] = id;
      let events = this.events;
      events.push(event);
      this.events = events;
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
      //console.log(date.getFullYear());
      console.log(this.createDateString(date));

      this.validated = false;
    },
    showEventDialog() {
      this.showAddEventDialog = !this.showAddEventDialog;
    },

    // handleDateSelect(arg) {
    //   console.log(arg);
    // },
    updateEventsArray() {
      this.calendarOptions.events = this.events;
    },
    handleEventClick(arg) {
      let event = this.events.filter( event => event.id === arg.event.id)[0]
      console.log(Object.keys(event), Object.keys(arg.event._def));
    },
    handleEvents(arg) {
      this.currentEvents = arg;
    },
    handleEventAdd(arg) {
      console.log(arg);
    },
    handleEventChange(arg) {
      console.log(arg);
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