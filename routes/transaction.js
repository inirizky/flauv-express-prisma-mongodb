import express from "express";

import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  readTransaction,
} from "../controller/transaction.contoller.js";

const router = express.Router();

router.post("/new", createTransaction);
router.get("/get", readTransaction);
router.put("/edit/:id", editTransaction);
router.delete("/delete/:id", deleteTransaction);

export default router;
