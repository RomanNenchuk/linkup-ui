import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: ({ context }) => {
    const { checkedAuth, token } = context.auth;

    if (!token && checkedAuth) {
      return redirect({ to: "/login" });
    }
  },
});
