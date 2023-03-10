const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.use(
	morgan((tokens, req, res) => {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, "content-length"),
			"-",
			tokens["response-time"](req, res),
			"ms",
		].join(" ");
	})
);
//
let persons = [
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

app.get("/api/persons", (req, res) => {
	res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find((n) => n.id === id);

	if (person) {
		res.status(200).json(person);
	} else {
		return res.status(404).end();
	}
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter((n) => n.id !== id);
	res.status(204).end();
});

app.post("/api/persons", (req, res) => {
	const body = req.body;
	// console.log(req.body);
	if (!body || !body.name || !body.number) {
		return res.status(400).json({ error: "name and number must not be empty" });
	}

	const generateId = () => {
		const maxId =
			persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
		return maxId + 1;
	};

	persons.map((n) => {
		if (n.name === body.name || n.number === body.name) {
			return res.status(401).json({ error: `name must be unique` }).end();
		}
	});

	const newObject = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};

	persons = persons.concat(newObject);

	res.status(201).json(persons);
});

//
app.get("/info", (req, res) => {
	// res.writeHead(200, { "Content-Type": "text/html" });
	res.send(
		`
  <p>The phonebook has information for ${persons.length} people</p>
  <p>${new Date()}</p>
  `
	);
	res.end();
});

// app.get("/", (req, res) => {
// 	// res.writeHead(200, { "Content-Type": "text/html" });
// 	res.send(
// 		`
//   <p>Welcome</p>
//   `
// 	);
// 	res.end();
// });

// app.get("/", (request, response) => {
// 	response.send(" <p>Welcome</p>");
// 	response.end();
// });

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
