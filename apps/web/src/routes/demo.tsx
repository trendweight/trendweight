import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/demo")({
  loader: () => {
    throw redirect({
      to: "/u/$sharingCode",
      params: { sharingCode: "demo" },
      replace: true,
    });
  },
});
