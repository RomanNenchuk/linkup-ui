import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { togglePostLike } from "../api/posts";
import type { PagedResult } from "./usePostList";
import { useCallback } from "react";

type UsePostListToggleLikeParams = {
  sort: PostSortType;
  latitude?: number;
  longitude?: number;
  radius?: number;
  pageSize?: number;
  authorId?: string;
};

export function usePostListToggleLike({
  sort,
  latitude,
  longitude,
  radius,
  pageSize = 10,
  authorId,
}: UsePostListToggleLikeParams) {
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) => togglePostLike(postId, isLiked),

    onMutate: async ({ postId, isLiked }) => {
      // stops any current refetches ["posts"] to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const prevData = queryClient.getQueryData<InfiniteData<PagedResult<Post>>>(["posts"]);

      queryClient.setQueryData<InfiniteData<PagedResult<Post>>>(
        [
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
        (oldData) => {
          if (!oldData) return oldData;

          const newData = {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              items: page.items.map((p: Post) =>
                p.id === postId
                  ? {
                      ...p,
                      isLikedByCurrentUser: isLiked,
                      reactionCount: (p.reactionCount ?? 0) + (isLiked ? 1 : -1),
                    }
                  : p
              ),
            })),
          };

          return newData;
        }
      );

      return { prevData };
    },

    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["posts"], context.prevData);
      }
    },

    onSettled: () => {
      // optional
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = useCallback(
    (postId: string, isLikedByCurrentUser: boolean) => {
      toggleLikeMutation.mutate({
        postId,
        isLiked: !isLikedByCurrentUser,
      });
    },
    [togglePostLike]
  );

  return { handleLike };
}
