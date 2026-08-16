import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/utapi";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});