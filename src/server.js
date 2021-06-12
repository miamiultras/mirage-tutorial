import {
  createServer,
  Model,
  hasMany,
  belongsTo,
  RestSerializer,
  Factory,
  trait,
} from "miragejs";

export default function () {
  createServer({
    serializers: {
      reminder: RestSerializer.extend({
        include: ["list"],
        embed: true,
      }),
    },
    models: {
      list: Model.extend({
        reminders: hasMany(),
      }),

      reminder: Model.extend({
        list: belongsTo(),
      }),
    },

    factories: {
      list: Factory.extend({
        name(i) {
          return `List ${i}`;
        },

        withReminders: trait({
          afterCreate(list, server) {
            server.createList("reminder", 5, { list });
          },
        }),
      }),

      reminder: Factory.extend({
        text(i) {
          return `Reminder ${i}`;
        },
      }),
    },

    seeds(server) {
      server.create("list", {
        name: "Home",
        reminders: [server.create("reminder", { text: "Do taxes" })],
      });

      server.create("list", "withReminders");
    },

    routes() {
      this.get("/api/reminders", (schema) => {
        return schema.reminders.all();
      });

      this.post("/api/reminders", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);

        return schema.reminders.create(attrs);
      });

      this.delete("/api/reminders/:id", (schema, request) => {
        let id = request.params.id;

        return schema.reminders.find(id).destroy();
      });

      this.get("/api/lists", (schema) => {
        return schema.lists.all();
      });

      this.get("/api/lists/:id/reminders", (schema, request) => {
        let listId = request.params.id;
        let list = schema.lists.find(listId);

        return list.reminders;
      });

      this.post("/api/lists", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);

        return schema.lists.create(attrs);
      });

      this.delete("/api/lists/:id", (schema, request) => {
        let id = request.params.id;
        let list = schema.lists.find(id);

        list.reminders.destroy();

        return list.destroy();
      });
    },
  });
}
