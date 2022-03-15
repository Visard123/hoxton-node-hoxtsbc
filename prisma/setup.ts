import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

const users = [
  {
    name: "xhoi",
    email: "xhoi@mail",
    password: "1234",
    amountInAccount: 500,
  },
  {
    name: "xhei",
    email: "xhei@mail",
    password: "123456",
    amountInAccount: 1000,
  },
  {
    name: "andres",
    email: "andres@mail",
    password: "123456ab",
    amountInAccount: 2000,
  },
];

const transactions = [
  {
    amount: 30,
    currency: "$",
    receiverOrSender: "sender",
    completedAt: "today",
    isPositive: true,
    usersId: 2,
  },
  {
    amount: 50,
    currency: "$",
    receiverOrSender: "reciever",
    completedAt: "today",
    isPositive: true,
    usersId: 3,
  },
  {
    amount: 10,
    currency: "$",
    receiverOrSender: "sender",
    completedAt: "yesterday",
    isPositive: false,
    usersId: 1,
  },
];

async function getstuff() {
  for (const user of users) {
    await prisma.user.create({ data: user });
  }
  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
  }
}
getstuff();
