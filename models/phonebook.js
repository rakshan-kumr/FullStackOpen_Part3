const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_PB_URI;

console.log("connecting to ", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

const phonebookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3, unique: true },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: function (v) {
          return /^\d{2,3}-\d{6,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  },
  {
    collection: "people",
  }
);

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonebook", phonebookSchema);
