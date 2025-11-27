import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollow } from "@/api/users";

export function useFollowUser() {
  const qc = useQueryClient();

  const toggleFollowMutation = useMutation({
    mutationFn: toggleFollow,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users", "search"], exact: false });
    },
  });

  return { toggleFollowMutation };
}
