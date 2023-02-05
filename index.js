require("dotenv").config();
const Phonebook = require("./models/phonebook");
const { response } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (request, response) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (request, response) => {
  Phonebook.countDocuments({}).then((count) =>
    response.send(
      `<div>
    <p>Phonebook has info for ${count} people</p>

    ${new Date()}
    </div>
  `
    )
  );
});

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const phonebookId = Number(request.params.id);
  Phonebook.findById(request.params.id)
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const personBody = request.body;

  const person = new Phonebook({
    name: personBody.name,
    number: personBody.number,
  });

  person
    .save()
    .then((result) => {
      response.json(result);
      console.log("person added");
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Phonebook.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => response.json(updatedNote))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error);
  if (error.name === "CastError") {
    return response.status(400).send({
      error: "malinformed id",
    });
  } else if (error.name === "ValidationError") {
    return response.status(400).send(error);
  } else if (error.name == "MongoServerError") {
    return response.status(400).send(error);
  }
};

app.use(errorHandler);

/*
app.get("/api/persons/:id", (request, response) => {
  const phonebookId = Number(request.params.id);
  const person = Phonebook.find((person) => person.id === phonebookId);

  if (person) response.json(person);
  else response.status(404).end();
});

app.delete("/api/persons/:id", (requests, response) => {
  const phonebookId = Number(requests.params.id);
  const person = phonebook.find((person) => person.id === phonebookId);

  if (person) {
    phonebook = phonebook.filter((person) => person.id !== phonebookId);
  } else return response.status(404).end();

  response.status(204).end();
});

app.get("/info", (request, response) => {
  response.send(
    `<div>
    <p>Phonebook has info for ${phonebook.length} people</p>

    ${new Date()}
    </div>
  `
  );
});

app.post("/api/persons/", (request, response) => {
  const personBody = request.body;

  if (!personBody.name | !personBody.number) {
    return response.status(400).json({
      error: "name or number field can't be empty",
    });
  }

  const isExist = phonebook.some((person) => person.name === personBody.name);

  if (isExist) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: personBody.name,
    number: personBody.number,
    id: generateId(),
  };

  phonebook = phonebook.concat(person);
  response.json(phonebook);
});

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};
*/

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
