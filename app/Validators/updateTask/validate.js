const { validateAll } = use("Validator");
const ValidateMessages = use("App/Validators/updateTask/messages");

module.exports = async body => {
  const validation = await validateAll(
    body,
    {
      title: "required|min:5|max:30",
      description: "required|min:15|max:254"
    },
    ValidateMessages
  );
  return validation;
};
