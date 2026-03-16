type RecentSearchesTypes = "task" | "project";

export type RecentSearches = {
  type: RecentSearchesTypes;
  query: string;
};
