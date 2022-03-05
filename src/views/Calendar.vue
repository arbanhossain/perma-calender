<template>
  <div v-if="!visibility">Loading your calendar!!</div>
  <div v-if="visibility">
    <FullCalendar id="calendar" ref="calendar" :options="calendarOptions" />

    <div class="float dropdown">
      <button
        class="pure-button round-button blue-button dropdown-content"
        title="All Events"
        @click="showAllEvents = true"
      >
        <i class="fa-solid fa-calendar-check"></i>
      </button>
      <button
        class="pure-button round-button blue-button dropdown-content"
        :disabled="validated"
        @click="showAddEventDialog = true"
        title="Add Event"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
      <button
        class="pure-button round-button blue-button"
        title="Actions"
      >
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>

    <div>
      <vue-final-modal
        v-model="showAddEventDialog"
        classes="modal-container"
        content-class="modal-content"
      >
        <AddEventForm
          :currDate="this.$globals.currentDateStr.substr(0, 16)"
          @add-to-events="addNewEvent"
          @close-add-event="showAddEventDialog = false"
        />
        <!-- <span class="modal__title">Hello, vue-final-modal</span> -->
      </vue-final-modal>
      <!-- <button @click="showModal = true">Open Modal</button> -->
    </div>

    <div>
      <vue-final-modal
        v-model="showEventDetailsDialog"
        classes="modal-container"
        content-class="modal-content"
      >
        <EventDetailsForm
          :event="currEvent"
          @update-event="handleEventChange"
          @close-event-details="showEventDetailsDialog = false"
        />
      </vue-final-modal>
    </div>
    <div>
      <vue-final-modal
        v-model="showAllEvents"
        classes="modal-container"
        content-class="modal-content"
      >
        <AllEvents :events="events" />
      </vue-final-modal>
    </div>
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
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "@/config.js";

import AddEventForm from "@/components/AddEventForm.vue";
import EventDetailsForm from "@/components/EventDetailsForm.vue";
import AllEvents from "@/components/AllEvents.vue";

import "@/flash.min.js";

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
    EventDetailsForm,
    AllEvents,
  },
  //emits: ['close-add-event'],
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        // buttonIcons: {
        //   copy: 'fa-copy',
        // },
        customButtons: {
          copy: {
            text: "code",
            hint: "Copy Calendar Code",
            click: this.copyCalendarLink,
          },
        },
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "copy dayGridMonth,timeGridWeek,timeGridDay",
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
      showEventDetailsDialog: false,
      events: [],
      showModal: false,
      currEvent: {},
      calendarID: this.$route.params.id,
      visibility: false,
      showAllEvents: false,
    };
  },
  created() {
    if (this.calendarID === "new") {
      try {
        this.createNewCalendar();
      } catch (error) {
        console.log(error);
        window.location.replace("/error?id=2");
      }
    } else {
      this.fetchAndSetEvents();
      this.$globals.currentDateStr = this.createDateString(new Date());
    }
  },
  methods: {
    async fetchAndSetEvents() {
      let reference = collection(db, "events");
      let q = query(reference, where("calendarID", "==", this.calendarID));
      let snapshot = await getDocs(q);
      if (snapshot.docs.length == 0) {
        window.location.replace("/error?id=1");
      }
      this.visibility = true;
      snapshot.forEach((doc) => {
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
    async createNewCalendar() {
      let eventID = "",
        calID = "";
      do {
        calID = uuidv4();
      } while (this.checkIfCalendarExists(calID) === true);
      do {
        eventID = uuidv4();
      } while (this.checkIfEventExists(eventID) === true);
      let event = {
        title: "Sample Event",
        desc: "Sample Description",
        color: "cyan",
        start: this.createDateString(new Date()),
        end: "",
        allDay: true,
        calendarID: calID,
      };
      await setDoc(doc(db, "events", eventID), event);
      window.location.replace("/calendar/" + calID);
    },
    async checkIfCalendarExists(id) {
      let reference = collection(db, "events");
      let q = query(reference, where("calendarID", "==", id));
      let snapshot = await getDocs(q);
      if (snapshot.docs.length === 0) {
        return false;
      } else {
        console.log("calendar exists!!");
        return true;
      }
    },
    async checkIfEventExists(id) {
      let reference = doc(db, "events", id);
      let snapshot = await getDoc(reference);

      if (snapshot.exists()) {
        console.log("event exists!!");
        return true;
      } else {
        return false;
      }
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
    addNewEvent(data) {
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
        calendarID: this.calendarID,
      };
      console.log(event);

      // not mutating the original array
      let events = this.events;
      events.push(event);
      this.events = events;

      this.addEventToFbase(event);

      this.updateEventsArray();
    },
    async addEventToFbase(data) {
      // separate the id and data
      let id = data.id;
      let obj = pick(
        data,
        "title",
        "desc",
        "start",
        "end",
        "allDay",
        "color",
        "calendarID"
      );
      let docRef = doc(db, "events", id);
      await setDoc(docRef, obj);
    },
    updateEventsArray() {
      this.calendarOptions.events = this.events;
    },
    handleEventClick(arg) {
      let event = this.events.filter((event) => event.id === arg.event.id)[0];
      //deep copy so that dumb user cannot make empty title or desc as im using v-model
      let copiedEvent = JSON.parse(JSON.stringify(event));
      copiedEvent.start = copiedEvent.start.substring(0, 16);
      if (copiedEvent.allDay === false) {
        copiedEvent.end = copiedEvent.end.substring(0, 16);
      }

      this.currEvent = copiedEvent;
      this.showEventDetailsDialog = true;
    },
    handleEventAdd(arg) {
      console.log(arg);
    },
    async handleEventChange(arg) {
      let argEvent = arg.event ? arg.event : arg;
      let FbaseEvent = this.events.filter(
        (event) => event.id === argEvent.id
      )[0];

      FbaseEvent.title = argEvent.title;
      FbaseEvent.allDay = argEvent.allDay;
      FbaseEvent.start = this.createDateString(
        new Date(Date.parse(argEvent.start))
      );
      // add conditionals so i can use the same function for both forms
      if (argEvent.allDay === false) {
        FbaseEvent.end = this.createDateString(
          new Date(Date.parse(argEvent.end))
        );
      } else {
        FbaseEvent.end = "";
      }
      if (argEvent.desc) {
        FbaseEvent.desc = argEvent.desc;
      }
      if (argEvent.color) {
        FbaseEvent.color = argEvent.color;
      }

      let docRef = doc(db, "events", argEvent.id);

      let obj = pick(
        FbaseEvent,
        "title",
        "desc",
        "start",
        "end",
        "allDay",
        "color",
        "calendarID"
      );

      await setDoc(docRef, obj, { merge: true });
    },
    handleEventRemove(arg) {
      console.log(arg);
    },
    copyCalendarLink() {
      window.navigator.clipboard.writeText(this.calendarID);
      FlashMessage.success("Copied calendar code!");
    },
  },
};
</script>

<style>
.fc .fc-button-primary {
  background-color: rgb(132, 230, 255);
  color: rgb(0, 0, 0);
  border: none;
}

.fc .fc-button-primary:hover {
  background-image: linear-gradient(
    to bottom,
    rgb(132, 230, 255),
    rgb(124, 215, 238)
  );
  color: rgb(0, 0, 0);
}

.fc .fc-button-primary:not(:disabled).fc-button-active {
  background-color: rgb(124, 215, 238);
  color: rgb(0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
}

.fc .fc-button-primary:disabled {
  background-color: rgb(172, 238, 255);
  color: rgb(0, 0, 0);
}
</style>

<style scoped>
.float {
  z-index: 10;
  position: fixed;
  bottom: 40px;
  right: 40px;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content {
  display: none;
}

button {
  margin: 0.5em;
}

.round-button:hover {
  background: radial-gradient(
    rgb(122, 215, 238),
    rgb(132, 230, 255)
  ) !important;
  filter: drop-shadow(5px 5px 4px #d1d1d1);
}

.blue-button {
  font-size: 1.3em;
  color: white;
  border-radius: 50px;
  text-align: center;
  background: rgb(132, 230, 255);
  width: 60px;
  height: 60px;
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