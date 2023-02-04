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

/*
let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
*/

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then((result) => {
    response.json(result);
  });
});

app.post("/api/persons", (request, response) => {
  const personBody = request.body;

  if (!personBody.name | !personBody.number) {
    return response.status(400).json({
      error: "name or number field can't be empty",
    });
  }

  const person = new Phonebook({
    name: personBody.name,
    number: personBody.number,
  });

  person.save().then((result) => {
    response.json(result);
    console.log("person added");
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  console.log(body);

  const person = {
    name: body.name,
    number: body.number,
  };

  Phonebook.findByIdAndUpdate(request.params.id, person, { new: true })
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
  if (error.name === "CastError")
    return response.status(400).send({
      error: "malinformed id",
    });
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
