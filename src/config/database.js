const mongoes = require("mongoose");
// pass ILN68iPGd9Hr4nkh
const connectDB = async () => {
  await mongoes.connect(
    "mongodb+srv://ravirajchaudhary51_db_user:ILN68iPGd9Hr4nkh@devtinder.3hc4nig.mongodb.net/?appName=devtinder",
  );
};

module.exports = {
  connectDB,
};
