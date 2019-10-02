const { validateAll } = use("Validator");
const ValidateMessages = use("App/Validators/createUser/messages");

module.exports = async body => {
  const validation = await validateAll(
    body,
    {
      username: "required|min:5|max:80|unique:users",
      email: "required|email|unique:users|max:254",
      password: "required|min:6|max:60"
    },
    ValidateMessages
  );
  return validation;
};
