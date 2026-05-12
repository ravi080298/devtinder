const validateUserAllowedData = (req, res, next) => {
  const user = req.body;
  const alloweedSchemas = [
    "firstName",
    "lastName",
    "emailId",
    "password",
    "age",
  ];
  const isEachKeyAllowed = alloweedSchemas.every((key) =>
    Object.keys(user).includes(key),
  );
  if (!isEachKeyAllowed) {
    return res.status(400).send("Invalid fields in request body");
  }
  next();
};

const validateuserSkills = (req, res, next) => {
  const user = req.body;
  if (user.skills && user.skills.length > 10) {
    return res.status(400).send("Maximum 10 skills allowed");
  }
  next();
};

module.exports = {
  validateUserAllowedData,
  validateuserSkills,
};
