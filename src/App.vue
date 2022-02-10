<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

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
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: "dayGridMonth",
        editable: true,
        selectable: true,
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        events: [
          { title: "event 1", date: "2022-02-09" },
          { title: "event 2", date: "2022-02-15" },
        ],
      },
    };
  },
  methods: {
    handleDateClick(arg) {
      console.log("date click", arg.dateStr);
    },
    handleEventClick(arg) {
      console.log(arg.event.title);
    },
    handleEvents(arg) {
      this.currentEvents = arg;
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