const { validateAll } = use("Validator");
const ValidateMessages = use("App/Validators/login/messages");

module.exports = async body => {
  const validation = await validateAll(
    body,
    {
      email: "required|email",
      password: "required"
    },
    ValidateMessages
  );
  return validation;
};
