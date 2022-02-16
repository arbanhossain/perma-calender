<template>
  <div class="home">
    <div class="textbox">
      <div class="logo">
        <h1>
          <i class="fa-solid fa-calendar-days pic"></i> Perma <br />Calendar
        </h1>
      </div>
      <div>
        <h1 class="subtitle">Shareable calendars for EVERYONE</h1>
      </div>
      <input
        type="text"
        class="calendar-link-input"
        v-model="this.calendarLink"
        v-on:keyup.enter="submit"
        placeholder="Enter Calendar Code"
      />
      <div>
        <button
          class="pure-button plus button-color"
          @click="this.$router.push('/calendar/new')"
        >
          + New Calendar
        </button>
      </div>
    </div>
  </div>
  <div>
    <footer>Author: Arban Hossain</footer>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      calendarLink: "",
    };
  },
  components: {},
  methods: {
    submit() {
      if (this.calendarLink !== "") console.log(this.calendarLink);
      this.$router.push(`/calendar/${this.calendarLink}`);
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap");

.logo {
  text-align: left;
  font-size: 1.4rem;
  font-family: "Raleway", sans-serif;
  color: rgb(0, 100, 100);
  margin-bottom: 7%;
  margin-top: -3%;
}

.plus {
  margin-top: 10%;
  padding: 2% !important;
}

.subtitle {
  font-family: "Raleway", sans-serif;
  color: rgb(181, 236, 255);
  margin-bottom: 5%;
}

.button-color {
  background: rgb(101, 255, 248) !important;
  color: rgb(44, 44, 44) !important;
}

.button-color:hover {
  background-image: linear-gradient(
    to bottom,
    rgb(97, 239, 232),
    rgb(91, 219, 212)
  ) !important;
}

.textbox {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 5%;
  background-image: linear-gradient(
    to bottom right,
    rgb(0, 174, 255),
    rgb(89, 221, 245)
  );
}
.calendar-link-input {
  color: rgb(70, 70, 70);
  font-size: 2rem;
  padding: 2%;
  width: 60%;
  border: none;
  border-radius: 4px;
}

.calendar-link-input:focus {
  outline: none;
}

.calendar-link-input::placeholder {
  color: rgb(197, 197, 197);
}
</style>