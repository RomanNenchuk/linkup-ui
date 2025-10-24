import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchPosts } from "../api/posts";

export type PagedResult<T> = {
  items: T[];
  nextCursor: string | null;
};

type PostParams = {
  sort: PostSortType;
  latitude?: number;
  longitude?: number;
  radius?: number;
  pageSize?: number;
  authorId?: string;
};

type UsePostListParams = PostParams & {
  enabled?: boolean;
};

export function usePostList({
  sort,
  latitude,
  longitude,
  radius,
  authorId,
  enabled = true,
  pageSize = 10,
}: UsePostListParams) {
  const infiniteQuery = useInfiniteQuery<
    PagedResult<Post>,
    Error,
    InfiniteData<PagedResult<Post>>,
    [string, PostParams],
    string | null
  >({
    queryKey: [
      "posts",
      {
        sort,
        pageSize,
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(radius !== undefined && { radius }),
        ...(authorId !== undefined && { authorId }),
      },
    ],
    queryFn: ({ pageParam }) =>
      fetchPosts({
        sort,
        cursor: pageParam,
        pageSize,
        latitude,
        longitude,
        radius,
        authorId,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    initialPageParam: null,
    enabled: enabled,
  });

  return { ...infiniteQuery };
}
