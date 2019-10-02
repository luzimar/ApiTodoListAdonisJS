"use strict";
const Task = use("App/Models/Task");
const CreateTaskValidate = use("App/Validators/createTask/validate");
const UpdateTaskValidate = use("App/Validators/updateTask/validate");
const Database = use("Database");

class TaskController {
  async index({ auth }) {
    const { id } = auth.user;
    const tasks = await Task.query()
      .where("user_id", auth.user.id)
      .withCount("files as files_total")
      .fetch();
    // const tasks = Database.select("id", "title", "description", "created_at")
    //   .from("tasks")
    //   .where("user_id", id);

    return tasks;
  }

  async store({ request, response, auth }) {
    try {
      const validation = await CreateTaskValidate(request.all());

      if (validation.fails()) {
        return response.status(400).send({ message: validation.messages() });
      }

      const { id } = auth.user;
      const data = request.only(["title", "description"]);
      const task = await Task.create({ ...data, user_id: id });
      return task;
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }

  async show({ params, response, auth }) {
    const { id } = auth.user;
    const task = await Task.query()
      .where("id", params.id)
      .where("user_id", id)
      .first();

    if (!task) {
      return response
        .status(400)
        .send({ message: "Nenhum registro encontrado" });
    }
    await task.load("files");
    return task;
  }

  async update({ params, request, response, auth }) {
    try {
      const validation = await UpdateTaskValidate(request.all());

      if (validation.fails()) {
        return response.status(400).send({ message: validation.messages() });
      }

      const { title, description } = request.all();
      const { id } = auth.user;
      const task = await Task.query()
        .where("id", params.id)
        .where("user_id", id)
        .first();

      if (!task) {
        return response
          .status(400)
          .send({ message: "Nenhum registro encontrado" });
      }

      task.description = description;
      task.title = title;
      task.id = params.id;

      await task.save();
      return task;
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }

  async destroy({ params, request, response, auth }) {
    try {
      const { id } = auth.user;
      const task = await Task.query()
        .where("id", params.id)
        .where("user_id", id)
        .first();

      if (!task) {
        return response
          .status(400)
          .send({ message: "Nenhum registro encontrado" });
      }

      await task.delete();
      return response
        .status(200)
        .send({ message: "Registro removido com sucesso" });
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }
}

module.exports = TaskController;
