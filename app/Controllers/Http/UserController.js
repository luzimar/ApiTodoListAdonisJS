"use strict";

const User = use("App/Models/User");
const CreateUserValidate = use("App/Validators/createUser/validate");
const LoginValidate = use("App/Validators/login/validate");

class UserController {
  async create({ request, response }) {
    try {
      const validation = await CreateUserValidate(request.all());

      if (validation.fails()) {
        return response.status(400).send({ message: validation.messages() });
      }

      const data = request.only(["username", "email", "password"]);
      const user = await User.create(data);
      return user;
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }

  async login({ request, response, auth }) {
    try {
      const validation = await LoginValidate(request.all());
      if (validation.fails()) {
        return response.status(400).send({ message: validation.messages() });
      }
      const { email, password } = request.all();
      const token = await auth.attempt(email, password);
      return token;
    } catch (error) {
      return response.status(500).send({ error: `Erro: ${error.message}` });
    }
  }
}

module.exports = UserController;
