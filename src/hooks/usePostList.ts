import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchPosts } from "../api/posts";

export type PagedResult<T> = {
  items: T[];
  nextCursor: string | null;
};

export function usePostList(
  filter: PostFilterType,
  latitude?: number,
  longitude?: number,
  radius?: number,
  pageSize = 10
) {
  const infiniteQuery = useInfiniteQuery<
    PagedResult<Post>,
    Error,
    InfiniteData<PagedResult<Post>>,
    [
      string,
      {
        filter: PostFilterType;
        pageSize: number;
        latitude?: number;
        longitude?: number;
        radius?: number;
      },
    ],
    string | null
  >({
    queryKey: [
      "posts",
      {
        filter,
        pageSize,
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(radius !== undefined && { radius }),
      },
    ],
    queryFn: ({ pageParam }) =>
      fetchPosts({
        filter,
        cursor: pageParam,
        pageSize,
        latitude,
        longitude,
        radius,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    initialPageParam: null,
  });

  return { ...infiniteQuery };
}
