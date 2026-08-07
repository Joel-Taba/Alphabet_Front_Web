import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { trackResumeCheckpoint } from "./lib/resumeCheckpoint";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  // Alimente le point de reprise de session à chaque navigation résolue —
  // voir lib/resumeCheckpoint.ts.
  router.subscribe("onResolved", (event) => {
    trackResumeCheckpoint(event.toLocation.pathname, event.toLocation.href);
  });

  return router;
};
