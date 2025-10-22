import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../api/posts";
import { useCallback } from "react";

export function usePostToggleLike() {
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) => toggleLike(postId, isLiked),

    onMutate: async ({ postId, isLiked }) => {
      // stops any current refetches ["posts"] to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });

      const prevData = queryClient.getQueryData<Post>(["posts", postId]);

      queryClient.setQueryData<Post>(["posts", postId], (oldData) => {
        if (!oldData) return oldData;

        const newData = {
          ...oldData,
          isLikedByCurrentUser: isLiked,
          reactionCount: (oldData.reactionCount ?? 0) + (isLiked ? 1 : -1),
        };

        return newData;
      });

      return { prevData };
    },

    onError: (_err, vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["posts", vars.postId], context.prevData);
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
