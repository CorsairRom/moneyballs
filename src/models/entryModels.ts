export interface Entry {
  id: string;
  name: string;
  amount: number;
  date: string;
}

export interface EntryList {
  entries: Entry[];
}
