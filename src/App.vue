<template>
  <div id="app">
    <div class="app-name">
      <ul class="app-tabs">
        <li
          :class="{ 'app-tab--active': tab === 'inc-exc' }"
          class="app-tab"
          @click="() => updateTab('inc-exc')"
        >
          Include/exclude literature
        </li>
        <li
          :class="{ 'app-tab--active': tab === 'map' }"
          class="app-tab"
          @click="() => updateTab('map')"
        >
          Map literature
        </li>
      </ul>
      <input
        type="text"
        :class="[!this.nick && 'empty']"
        placeholder="Nickname"
        :value="nick"
        @input="updateNick"
      />
    </div>

    <template v-if="this.nick">
      <div class="main-container" v-if="tab !== 'data-grid'">
        <sidebar></sidebar>
        <classifier></classifier>
      </div>

      <data-tab v-else></data-tab>
    </template>
    <div v-else class="message">
      Start by typing your nickname or initials in the blinking box above
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";
import Sidebar from "./components/Sidebar.vue";
import Classifier from "./components/Classifier.vue";

@Component({
  components: {
    Sidebar,
    Classifier
  },
  computed: {
    ...mapState(["nick", "tab"])
  },
  methods: {
    ...mapActions(["updateNick", "updateTab"])
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "vue-select/src/scss/vue-select.scss";
@import "./scss/nprogress.scss";

.vs__dropdown-toggle {
  border-radius: 0 !important;
  height: 32px;
}

.vs__open-indicator {
  transform: scale(0.6);
}

.vs--open .vs__open-indicator {
  transform: rotate(180deg) scale(0.6);
}

.vs--single.vs--open .vs__selected {
  position: relative;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1200px;
  margin: auto;
}
.main-container {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 220px;
  padding-bottom: 100px;
  min-height: 700px;
}
.app-name {
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 0 10px;
  font-size: 22px;

  input {
    margin-bottom: 5px;
    border: 0;
    padding: 5px;
    height: 20px;
    width: 100px;
    transition: background-color 0.2s ease-in, border-color 0.2s ease-in;
    font-family: "Times New Roman", Times, serif;
    font-style: italic;
    font-weight: 600;
    font-size: 14px;

    &:hover,
    &:focus {
      background: #f7f7f7;
    }

    &.empty {
      animation: blink 1.4s infinite;
    }
  }
}

.message {
  padding: 100px 10px;
  text-align: center;
}

.app-tabs {
  list-style: none;
  padding: 0;
  margin: 0;
}

.app-tab {
  display: inline-block;
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 18px;
  color: #878787;
  transition: background-color 0.2s ease-in, border-color 0.2s ease-in;
  transform: translateY(1px);
  border: 0px solid transparent;
  border-width: 1px 1px 0 1px;

  &:hover {
    background-color: #f7f7f7;
    border-color: #eaeaea;
    cursor: pointer;
  }

  &--active {
    border-color: #eaeaea;
    background-color: #fff;
    color: inherit;

    &:hover {
      background-color: #fff;
    }
  }
}

@keyframes blink {
  0% {
    background: transparent;
  }
  50% {
    background: #f7f7f7;
  }
  100% {
    background: auto;
  }
}

body {
  overflow-y: scroll;
}

button {
  border: 0;
  background: #fff;
  font-size: 12px;
  cursor: pointer;
  color: #2c3e50;
  font-weight: 600;
  padding: 5px 10px;

  &:hover {
    background: #eaeaea;
  }

  .icon {
    display: inline-block;
    padding-right: 4px;
    font-size: 12px;
  }

  &.button--danger {
    color: #7b0c27;
  }
}
</style>
