import { createServerFn, json } from "@tanstack/start";

export const healthCheck = createServerFn("GET", async () => {  
  return json({ status: "OK" });
});
