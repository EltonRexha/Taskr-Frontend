import { components } from "@/api/types";

/**
 * @description Helper function for the useInfiniteQuery from @tanstack/query
 * @param lastPage contains the metadata object returned from the backend
 * @returns the next page number if there is one, undefined otherwise (used in useInfiniteQuery)
 */
export const getNextPageParam = (lastPage: {
  metadata: components["schemas"]["ResponsePaginationDto"];
}) => {
  return lastPage.metadata.hasNextPage ? lastPage.metadata.page + 1 : undefined;
};
