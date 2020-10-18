<template>
  <section id="sidebar">
    <h4>Show by status:</h4>

    <v-select
      @input="item => setStatusFilter(item.value)"
      :options="statusOptions"
      :value="statusOptions.find(status => status.value === statusFilter).label"
      :clearable="false"
      :searchable="false"
    ></v-select>

    <h4>Records {{ recordRange }} of {{ itemCount }}:</h4>
    <ul class="item-list">
      <li
        v-for="item in pageItems"
        :key="item.id"
        @click="setCurrentItem(item)"
        class="item"
        :class="[
          item.status !== null && `item--${item.status}`,
          !!currentItem && item.id === currentItem.id && 'item--current'
        ]"
      >
        <small>
          id:
          <b>{{ item.id }}</b> </small
        >&nbsp;
        <span class="item-title">{{ truncate(item.title) }}</span>
      </li>
    </ul>
    <ul class="pagination">
      <li
        @click="movePage(1)"
        class="pagination-item"
        :class="[page <= 1 && 'pagination-item--disabled']"
      >
        ‹‹ First
      </li>
      <li
        @click="movePage(page - 1)"
        class="pagination-item"
        :class="[page <= 1 && 'pagination-item--disabled']"
      >
        ‹ Prev
      </li>
      <li
        @click="movePage(page + 1)"
        class="pagination-item"
        :class="[page >= itemCount / pageLength && 'pagination-item--disabled']"
      >
        Next ›
      </li>
      <li
        @click="movePage(Math.ceil(itemCount / pageLength))"
        class="pagination-item"
        :class="[page >= itemCount / pageLength && 'pagination-item--disabled']"
      >
        Last ››
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState, mapGetters } from "vuex";
import vSelect from "vue-select";

export default Vue.extend({
  name: "Sidebar",
  components: {
    vSelect
  },
  computed: {
    ...mapGetters(["currentItem"]),
    ...mapState([
      "page",
      "pageLength",
      "pageItems",
      "itemCount",
      "statusFilter"
    ]),
    recordRange(): string {
      return `${
        this.itemCount <= 0 ? 0 : (this.page - 1) * this.pageLength + 1
      } – ${
        this.itemCount < this.pageLength
          ? this.itemCount
          : this.page * this.pageLength
      }`;
    }
  },
  data() {
    return {
      statusOptions: [
        { label: "All", value: "" },
        { label: "Unset", value: "null" },
        { label: "Uncertain", value: "uncertain" },
        { label: "Excluded", value: "excluded" },
        { label: "Included", value: "included" }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("fetchPageItems");
  },
  methods: {
    ...mapActions([
      "fetchPageItems",
      "setPage",
      "setCurrentItem",
      "setStatusFilter"
    ]),
    truncate(str: string) {
      return str.length > 20 ? `${str.substring(0, 20)}...` : str;
    },
    movePage(to: number) {
      if (to > 0) {
        this.$store.dispatch("setPage", to);
      }
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#sidebar {
  width: 200px;
  border: 1px solid #eaeaea;
  padding: 5px;
  margin-right: 10px;
  position: absolute;
  top: 0;
  left: 0;
}

h4 {
  margin: 0;
  background: #f7f7f7;
  padding: 3px 5px;
  color: #5b5858;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
}

.v-select {
  margin: 10px 0;
  font-size: 12px;
}

.item-list {
  list-style: none;
  padding: 0;

  .item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    padding: 5px;
    font-size: 12px;
    position: relative;
    cursor: pointer;
    opacity: 0.8;
    white-space: nowrap;
    overflow: hidden;
    height: 18px;

    &:hover {
      opacity: 1;
    }

    &--uncertain {
      background: #ffffb4;
    }

    &--excluded {
      background: #ffb4b4;
    }

    &--included {
      background: #c4ffb4;
    }

    &--current {
      opacity: 1;
      &::after {
        background: #3750dc;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        right: 0;
        top: 0;
        bottom: 0;
        width: 20px;
        content: ">";
      }
    }

    small {
      color: #000000aa;
    }
  }
}
.pagination {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0;
  font-size: 12px;

  .pagination-item {
    color: #3750dc;
    font-weight: 600;
    padding: 5px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      color: #233496;
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
