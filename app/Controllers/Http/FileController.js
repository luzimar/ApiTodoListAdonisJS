"use strict";
const File = use("App/Models/File");
const Task = use("App/Models/Task");
const Helpers = use("Helpers");

class FileController {
  async store({ params, request, response }) {
    try {
      const task = await Task.findOrFail(params.id);
      const files = request.file("file", {
        size: "1mb"
      });

      await files.moveAll(Helpers.tmpPath("files"), file => ({
        name: `${Date.now()}-${file.clientName}`
      }));

      if (!files.movedAll()) {
        return files.errors();
      }

      await Promise.all(
        files
          .movedList()
          .map(item => task.files().create({ path: item.fileName }))
      );

      return response
        .status(200)
        .send({ message: "Arquivos importados com sucesso" });
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }
}

module.exports = FileController;
