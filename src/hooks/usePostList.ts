import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchPosts } from "../api/posts";
import { useState } from "react";

export type PagedResult<T> = {
  items: T[];
  nextCursor: string | null;
};

export function usePostList(pageSize = 10) {
  const [filter, setFilter] = useState<PostFilterType>("recent");

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

  return { ...infiniteQuery, filter, setFilter };
}
