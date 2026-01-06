import express from "express";

import { prisma } from "../lib/prisma.js";
export const createTransaction = async (req, res) => {
  const { userId, movieId, totalPrice, date } = req.body;
  // console.log(res);

  try {
    await prisma.transaction.create({
      data: {
        userId: parseInt(userId),
        movieId: parseInt(movieId),
        totalPrice: parseFloat(totalPrice),
        date,
      },
    });

    res.json({ message: "Transaksi berhasil", status: 200 });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 403 }).status(403);
  }
};

export const readTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        movie: true,
      },
    });

    res
      .status(200)
      .json({ message: "Success", status: 200, data: transaction });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error", error: error, status: 400 });
  }
};
export const readTransaction = async (req, res) => {
  // console.log(res);
  // const salt = await bcrypt.genSalt();
  // const hashPassword = await bcrypt.hash(password, salt);

  try {
    const transaction = await prisma.transaction.findMany({
      include: {
        movie: true,
        users: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });

    res.json({ message: "Success", status: 200, data: transaction });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 400 });
  }
};

export const editTransaction = async (req, res) => {
  const { id } = req.params;
  const { userId, movieId, totalPrice, date, status } = req.body;

  try {
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        userId: parseInt(userId),
        movieId: parseInt(movieId),
        totalPrice: parseFloat(totalPrice),
        status: status,
        date,
      },

      include: {
        movie: true,
      },
    });

    res.json({
      message: "Berhasil mengubah status",
      status: 200,
      data: transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error", error: error, status: 400 });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  // const { namaGenre } = req.body;

  try {
    await prisma.transaction.delete({
      where: { id: parseInt(id) },
      // data: { namaGenre: namaGenre },
    });

    res.json({ message: "Transaction has been deleted", status: 200 });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 500 });
  }
};
export const createTransactionController = () => {
  const route = express.Router();

  // route.post("/createmany", async (req, res) => {
  //   const { namaGenre } = req.body;
  //   // console.log(res);

  //   console.log(namaGenre);

  //   try {
  //     await prisma.genre.createMany({
  //       data: {
  //         namaGenre: namaGenre,
  //       },
  //     });

  //     res.json({ message: "Success", status: 200 });
  //   } catch (error) {
  //     console.log(error);
  //     res.json({ message: "Error", error: error, status: 403 });
  //   }
  // });

  return route;
};
