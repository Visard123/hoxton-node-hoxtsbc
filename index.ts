import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import "dotenv/config";
const prisma = new PrismaClient({ log: ["error", "info", "query", "warn"] });

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4000;

function createToken(id: number) {
  // @ts-ignore
  return jwt.sign({ id: id }, process.env.MY_SECRET, { expiresIn: "3 hours" });
}

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.post("/register", async (req, res) => {
  const { email, password, name, amountInAccount } = req.body;

  try {
    const hash = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        amountInAccount,
        password: hash,
      },
    });
    res.send({ user, token: createToken(user.id) });
  } catch (err) {
    // @ts-ignore
    res.status(400).send({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    // @ts-ignore
    const passwordMatches = bcrypt.compareSync(password, user.password);

    if (user && passwordMatches) {
      res.send({ user, token: createToken(user.id) });
    } else {
      throw Error("BOOM!");
    }
  } catch (err) {
    res.status(400).send({ error: "User/password invalid." });
  }
});

app.get("/banking-info", async (req, res) => {
  const token = req.headers.authorization;
  try {
    //@ts-ignore
    const decodedData = jwt.verify(token, process.env.My_Secret);
    //@ts-ignore
    const user = await prisma.user.findUnique({
      where: { id: decodedData.id },
      include: { transactions: true },
    });
    res.send({ data: user });
  } catch (error) {
    //@ts-ignore
    res.status(400).send({ error: "User or password invalid" });
  }
});

app.listen(PORT, () => {
  console.log(`Server up: http://localhost:${PORT}`);
});
