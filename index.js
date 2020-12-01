const express = require("express");
const shortid = require("shortid");

const server = express();
const port = 5000;

server.use(express.json());

// Data
let users = [
  {
    id: shortid.generate(),
    name: "Brandon O'Neal",
    bio: "Web developer in training",
  },
];

// Helper Functions
const User = {
  getAll() {
    return users;
  },
  getById(id) {
    return users.find((user) => user.id == id);
  },
  createNew(user) {
    const newUser = {
      id: shortid.generate(),
      ...user,
    };
    users.push(newUser);
    return newUser;
  },
  delete(id) {
    const user = users.find((user) => user.id == id);
    if (user) {
      users = users.filter((u) => u.id != id);
    }
    return user;
  },
  update(id, changes) {
    const user = users.find((user) => user.id == id);
    if (!user) {
      return null;
    }
    const updatedUser = { id, ...changes };
    users = users.map((u) => {
      if (u.id == id) return updatedUser;
      return u;
    });
    return updatedUser;
  },
};

// Endpoints
server.get("/api/users", (req, res) => {
  const users = User.getAll();
  res.status(200).json(users);
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = User.getById(id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found with id " + id });
  }
});

server.post("/api/users", (req, res) => {
  const user = req.body;

  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    const newUser = User.createNew(user);
    res.status(201).json(newUser);
  }
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const deleted = User.delete(id);

  if (deleted) {
    res.status(200).json(deleted);
  } else {
    res.status(404).json({ message: "User not found with id " + id });
  }
});

server.put("/api/users/:id", (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  const updatedUser = User.update(id, changes);

  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found with id " + id });
  }
});

server.use("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
