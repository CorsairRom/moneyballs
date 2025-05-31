import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Entry } from 'src/models/entryModels';
import type { EntryList } from 'src/models/entryModels';

// create a new store for save entries in pinia
export const useEntriesStore = defineStore('entries', {
  state: () => ({
    entries: [] as Entry[],
  }),

  persist: true,
  getters: {
    getEntries: (state) => state.entries,
  },
  actions: {
    addEntry(entry: Entry) {
      this.entries.push(entry);
    },
    removeEntry(entry: Entry) {
      const index = this.entries.indexOf(entry);
      if (index > -1) {
        this.entries.splice(index, 1);
      }
    },
    clearEntries() {
      this.entries = [];
    },
    setEntries(entries: EntryList) {
      this.entries = Array.isArray(entries) ? entries.map((entry) => ({ ...entry })) : [];
    },

    updateEntry(id: string, updatedEntry: Entry) {
      const index = this.entries.findIndex((entry) => entry.id === id);
      if (index !== -1) {
        this.entries[index] = {
          ...this.entries[index],
          ...updatedEntry,
        };
      }
    },
    getEntryById(id: string) {
      return this.entries.find((entry) => entry.id === id);
    },
    getAllEntries() {
      return this.entries;
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEntriesStore, import.meta.hot));
}
