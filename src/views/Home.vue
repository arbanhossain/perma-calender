<template>
  <div class="home">
    <div class="textbox">
      <input
        type="text"
        class="calendar-link-input"
        v-model="this.calendarLink"
        v-on:keyup.enter="submit"
        placeholder="Enter Calendar Code"
      />
    </div>
    <button
      class="pure-button plus"
      @click="this.$router.push('/calendar/new')"
    >
      + New Calendar
    </button>
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
.plus {
  padding: 30%;
  margin-bottom: 20%;
}

.textbox {
  padding: 10%;
}
.calendar-link-input {
  font-size: 2rem;
  padding: 2%;
  width: 50%;
  border: 2px solid gray;
  border-radius: 4px;
}
</style>