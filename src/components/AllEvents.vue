<template>
  <h2>All Events</h2>
  <div class="content">
      <h3 @click="pastEventSelector = !pastEventSelector"><i :class=" pastEventSelector ? 'fa-solid fa-caret-right': 'fa-solid fa-caret-down'"></i> Past Events</h3>
    <div class="collapsible">
      <span
        v-for="event in events.sort((a, b) => {
          return new Date(a.start) - new Date(b.start);
        })"
        :key="event.id"
        :class="{'collapsible-item': pastEventSelector}"
      >
        <li v-if="new Date(event.start) < new Date()">
          {{ event.title }} - {{ event.start.substr(0, 10) }}
        </li>
      </span>
    </div>
      <h3 @click="futureEventSelector = !futureEventSelector"><i :class=" futureEventSelector ? 'fa-solid fa-caret-right': 'fa-solid fa-caret-down'"></i> Future Events</h3>
    <div class="collapsible">
      <span
        v-for="event in events.sort((a, b) => {
          return new Date(a.start) - new Date(b.start);
        })"
        :key="event.id"
        :class="{'collapsible-item': futureEventSelector}"
      >
        <li v-if="new Date(event.start) >= new Date()">
          {{ event.title }} - {{ event.start.substr(0, 10) }}
        </li>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AllEvents",
  props: ["events"],
  data() {
    return {
      pastEventSelector: true,
      futureEventSelector: false,
    }
  }
};
</script>

<style scoped>
.content {
  text-align: left !important;
}

.collapsible-item {
  display: none;
}

.content > h3 {
  cursor: pointer;
}
</style>