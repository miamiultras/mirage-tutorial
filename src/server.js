import { createServer, Model } from "miragejs";

export default function () {
  createServer({
    models: {
      reminder: Model,
    },

    routes() {
      this.get("/api/reminders", (schema) => {
        return schema.reminders.all();
      });

      this.post("/api/reminders", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);

        return schema.reminders.create(attrs);
      });
    },
  });
}
