import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchPosts } from "../api/posts";

export type PagedResult<T> = {
  items: T[];
  nextCursor: string | null;
};

export function usePostList(filter: PostFilterType, pageSize = 10) {
  const infiniteQuery = useInfiniteQuery<
    PagedResult<Post>,
    Error,
    InfiniteData<PagedResult<Post>>,
    [string, { filter: PostFilterType; pageSize: number }],
    string | null
  >({
    queryKey: ["posts", { filter, pageSize }],
    queryFn: ({ pageParam }) =>
      fetchPosts({
        filter,
        cursor: pageParam,
        pageSize,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    initialPageParam: null,
  });

  return { ...infiniteQuery };
}
