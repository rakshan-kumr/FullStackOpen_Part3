const { response } = require("express");
const express = require("express");
const app = express();

app.use(express.json());

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

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const phonebookId = Number(request.params.id);
  const person = phonebook.find((person) => person.id === phonebookId);

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
