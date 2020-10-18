import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { records, mappingQuestions } from "../helpers/api";
import { Record } from "../types/record";
import { MappingQuestion } from "../types/mappingQuestion";
import { MappingOption } from "../types/mappingOption";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tab: "inc-exc",
    page: 1,
    pageLength: 25,
    pageItems: [],
    itemCount: 0,
    currentItemId: -1,
    statusFilter: "",
    nick: null,
    loading: false,
    mappingQuestions: [],
    moveLock: false
  },
  mutations: {
    SET_PAGE(state, payload) {
      state.page = payload;
    },
    SET_CURRENT_ITEM(state, payload) {
      state.currentItemId = !payload ? null : payload.id;
    },
    SET_PAGE_ITEMS(state, payload) {
      state.pageItems = payload;
    },
    SET_STATUS_FILTER(state, payload) {
      state.statusFilter = payload;
    },
    SET_NICK(state, payload) {
      state.nick = payload;
    },
    SET_ITEM_COUNT(state, payload) {
      state.itemCount = payload;
    },
    SET_TAB(state, payload) {
      state.tab = payload;
    },
    SET_MAPPING_QUESTIONS(state, payload) {
      state.mappingQuestions = payload;
    },
    SET_MOVE_LOCK(state, payload) {
      state.moveLock = payload;
    }
  },
  getters: {
    currentItem: ({ currentItemId, pageItems }): Record | null => {
      if (!currentItemId) {
        return null;
      }
      const item = pageItems.find((item: Record) => item.id == currentItemId);
      return item !== undefined ? item : null;
    }
  },
  actions: {
    async setPage({ commit, dispatch, state }, payload) {
      commit("SET_PAGE", payload);
      await dispatch("fetchPageItems");
      await dispatch("setCurrentItem", state.pageItems[0]);
    },
    setCurrentItem({ commit }, payload) {
      commit("SET_CURRENT_ITEM", payload);
    },
    async setStatusFilter({ commit, dispatch }, payload) {
      commit("SET_STATUS_FILTER", payload);
      commit("SET_PAGE", 1);
      await dispatch("fetchPageItems");
    },
    async fetchPageItems({ commit, state, getters, dispatch }, where) {
      const { page, pageLength, statusFilter } = state;
      const { currentItem } = getters;

      const items = await records.index({
        offset: (page - 1) * pageLength,
        limit: pageLength,
        ...where,
        ...(statusFilter !== "" && { status: statusFilter })
      });

      commit("SET_PAGE_ITEMS", items.data.records);
      commit("SET_ITEM_COUNT", items.data.count);
      if (
        currentItem === null ||
        !items.data.records.find((item: Record) => item.id === currentItem.id)
      ) {
        await dispatch("setCurrentItem", items.data.records[0]);
      }
    },
    async setItemStatus({ commit, state, dispatch, getters }, payload) {
      const { pageItems, statusFilter, nick } = state;
      const { currentItem } = getters;
      if (currentItem) {
        const item = await records.update(
          currentItem.id,
          {
            status: payload,
            editedBy: nick
          },
          {}
        );
        const index = pageItems.findIndex(
          (item: Record) => item.id === currentItem.id
        );
        const newItems: Record[] = [...pageItems];
        let nextItem: Record | null = null;
        if (statusFilter !== "" && statusFilter !== item.data.status) {
          await dispatch("fetchPageItems", { status: statusFilter });
          nextItem =
            pageItems.length <= index + 1
              ? state.pageItems[pageItems.length - 1]
              : pageItems[index + 1];
        } else {
          nextItem = item.data;
          if (nextItem !== null) {
            newItems[index] = nextItem;
          }
          commit("SET_PAGE_ITEMS", newItems);
        }
        commit("SET_CURRENT_ITEM", nextItem);
      }
    },
    async setItemComment({ commit, state, getters }, payload) {
      const { nick, pageItems } = state;
      const { currentItem } = getters;
      const index = pageItems.findIndex(
        (item: Record) => item.id === currentItem.id
      );
      const newItems: Record[] = [...pageItems];
      currentItem.comment = payload;
      newItems[index] = currentItem;
      commit("SET_PAGE_ITEMS", newItems);
      await records.update(
        currentItem.id,
        {
          comment: payload || null,
          editedBy: nick
        },
        {}
      );
    },
    updateNick({ commit }, payload) {
      commit("SET_NICK", payload);
    },
    updateTab({ commit }, payload) {
      commit("SET_TAB", payload);
    },
    async fetchMappingQuestions({ commit }) {
      const items = await mappingQuestions.index({});
      commit("SET_MAPPING_QUESTIONS", items.data.questions);
    },
    async createMappingQuestion({ state, commit }) {
      const question = await mappingQuestions.save(
        {
          title: "",
          type: "multiSelect",
          position: state.mappingQuestions.length
        },
        {}
      );
      commit("SET_MAPPING_QUESTIONS", [
        ...state.mappingQuestions,
        question.data
      ]);
    },
    async deleteMappingQuestion({ state, commit }, id) {
      await mappingQuestions.delete(id, {});
      commit("SET_MAPPING_QUESTIONS", [
        ...state.mappingQuestions.filter((q: MappingQuestion) => q.id != id)
      ]);
    },
    async updateMappingQuestion({ state, commit }, data) {
      const { id, ...rest } = data;
      const question = await mappingQuestions.update(id, rest, {});
      const newQuestions: MappingQuestion[] = [...state.mappingQuestions];
      const index = await newQuestions.findIndex(
        (item: MappingQuestion) => item.id === id
      );
      newQuestions[index] = await question.data;
      commit("SET_MAPPING_QUESTIONS", [...newQuestions]);
    },
    async createMappingOption({ state, getters, commit, dispatch }, data) {
      const { pageItems, currentItemId } = state;
      const { currentItem } = getters;
      const { id, ...rest } = data;
      const option = await mappingQuestions.mappingOptions.save(id, rest, {});
      const recordOption = await records.mappingOptions.save(
        currentItemId,
        {
          mappingQuestionId: id,
          mappingOptionId: option.data.id
        },
        {}
      );
      await dispatch("fetchMappingQuestions");
      const index = pageItems.findIndex(
        (item: Record) => item.id === currentItem.id
      );
      const newItems: Record[] = [...pageItems];
      currentItem.MappingOptions = [
        ...currentItem.MappingOptions,
        recordOption.data
      ];
      newItems[index] = currentItem;
      commit("SET_PAGE_ITEMS", newItems);
    },
    async addRecordMappingOption({ state, commit, getters }, data) {
      const { pageItems, currentItemId } = state;
      const { currentItem } = getters;
      const { mappingQuestionId, mappingOptionId } = data;
      const option = await records.mappingOptions.save(
        currentItemId,
        {
          mappingQuestionId,
          mappingOptionId
        },
        {}
      );

      const index = pageItems.findIndex(
        (item: Record) => item.id === currentItem.id
      );
      const newItems: Record[] = [...pageItems];
      currentItem.MappingOptions = [...currentItem.MappingOptions, option.data];
      newItems[index] = currentItem;
      commit("SET_PAGE_ITEMS", newItems);
    },
    async removeRecordMappingOption({ state, commit, getters }, optionId) {
      const { pageItems, currentItemId } = state;
      const { currentItem } = getters;
      await records.mappingOptions.delete(currentItemId, optionId, {});
      const index = pageItems.findIndex(
        (item: Record) => item.id === currentItem.id
      );
      const newItems: Record[] = [...pageItems];
      currentItem.MappingOptions = currentItem.MappingOptions.filter(
        (o: MappingOption) => o.id !== optionId
      );
      newItems[index] = currentItem;
      await commit("SET_PAGE_ITEMS", newItems);
    },
    setMoveLock({ commit }) {
      commit("SET_MOVE_LOCK", true);
    },
    unsetMoveLock({ commit }) {
      commit("SET_MOVE_LOCK", false);
    }
  },
  modules: {},
  plugins: [createPersistedState()]
});
