import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchPosts } from "../api/posts";

export type PagedResult<T> = {
  items: T[];
  nextCursor: string | null;
};

export function usePostList(ascending = false, pageSize = 10) {
  return useInfiniteQuery<
    PagedResult<Post>,
    Error,
    InfiniteData<PagedResult<Post>>,
    [string, { ascending: boolean; pageSize: number }],
    string | null
  >({
    queryKey: ["posts", { ascending, pageSize }],
    queryFn: ({ pageParam }) =>
      fetchPosts({
        ascending,
        cursor: pageParam,
        pageSize,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    initialPageParam: null,
  });
}
