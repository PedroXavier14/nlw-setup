import Fastify from "fastify";
import cors from "@fastify/cors";
import { appRoutes } from "./lib/routes";
const app = Fastify();

app.register(cors);
app.register(appRoutes);

app.listen({
  port: 3333,
});

console.log('HTTP server running on port 3333');
