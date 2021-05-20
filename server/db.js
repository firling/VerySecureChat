const mongoose = require("mongoose");
const colors = require("colors");

exports.connect = async () => {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const conn = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log(`Database Connected to ${conn.connection.host}`.cyan.bold);
};
