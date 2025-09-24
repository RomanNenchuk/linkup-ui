import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toggleLike } from "../api/posts";
import type { PagedResult } from "./usePostList";
import { useCallback } from "react";

type UseToggleLikeProps = {
  filter: PostFilterType;
  pageSize: number;
};

export function useToggleLike({ filter, pageSize }: UseToggleLikeProps) {
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) => toggleLike(postId, isLiked),

    onMutate: async ({ postId, isLiked }) => {
      // stops any current refetches ["posts"] to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const prevData = queryClient.getQueryData<InfiniteData<PagedResult<Post>>>(["posts"]);

      queryClient.setQueryData<InfiniteData<PagedResult<Post>>>(["posts", { filter, pageSize }], (oldData) => {
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
                    likesCount: (p.likesCount ?? 0) + (isLiked ? 1 : -1),
                  }
                : p
            ),
          })),
        };

        return newData;
      });

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
    [toggleLike]
  );

  return { handleLike };
}
