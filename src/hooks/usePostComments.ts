import { createPostComment, getPostComments } from "@/api/postComments";
import { useAuth } from "@/contexts/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function usePostComments(postId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => (typeof postId === "string" ? getPostComments({ postId }) : undefined),
    enabled: !!postId,
  });

  const { mutate: createPostCommentMutation, isPending: commentCreationPending } = useMutation({
    mutationFn: createPostComment,
    onMutate: async ({ postId, content, repliedTo }) => {
      // stops any current refetches ["posts", postId, "comments"] to avoid conflicts
      await queryClient.cancelQueries({ queryKey: ["posts", postId, "comments"] });

      const prevData = queryClient.getQueryData<PostCommentType[]>(["posts", postId, "comments"]);

      // створюємо тимчасовий коментар
      const tempId = `temp-${Date.now()}`;
      const optimisticComment: PostCommentType = {
        id: tempId,
        postId,
        content,
        repliedTo: repliedTo,
        createdAt: new Date(),
        author: {
          id: user!.id,
          displayName: user!.displayName,
        },
      };

      queryClient.setQueryData<PostCommentType[]>(["posts", postId, "comments"], (old = []) => [
        optimisticComment,
        ...old,
      ]);

      return { prevData, tempId };
    },

    onError: (_err, vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["posts", vars.postId, "comments"], context.prevData);
      }
    },

    onSuccess: (id, vars, context) => {
      // id — рядок, тому створюємо новий об'єкт на основі тимчасового коменту
      queryClient.setQueryData<PostCommentType[]>(["posts", vars.postId, "comments"], (old = []) =>
        old.map((comment) => (comment.id === context?.tempId ? { ...comment, id } : comment))
      );
    },

    onSettled: (_data, _error, _vars) => {
      // optional
      // queryClient.invalidateQueries({ queryKey: ["posts", vars.postId, "comments"] });
    },
  });

  const handleCreatePostComment = () => {
    if (!newComment.trim() || typeof postId !== "string") return;
    createPostCommentMutation({ postId, content: newComment });
    setNewComment("");
  };

  return {
    newComment,
    setNewComment,
    comments,
    commentsLoading,
    commentCreationPending,
    handleCreatePostComment,
  };
}
