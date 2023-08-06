const router = require("express").Router();

const Record = require("../data/models/recordModel");
const recordMapper = require("../utils/recordMapper");

router.get("/", async (req, res, next) => {
  const { id: userId } = req.decodedToken;
  try {
    const records = await Record.find(userId);
    res.status(200).json(records.map(recordMapper));
  } catch (error) {
    console.log({ error });
    next([500, "Error fetching records"]);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id: userId } = req.decodedToken;
  const { id: recordId } = req.params;
  try {
    const record = await Record.findById(recordId);
    if (record) {
      if (record?.user_id !== userId) {
        next([401, "Not authorized"]);
      }
      res.status(200).json(recordMapper(record));
    } else next([404, "Record not found"]);
  } catch (error) {
    console.log({ error });
    next([500, "Error fetching record"]);
  }
});

router.post("/", async (req, res, next) => {
  const { id: userId } = req.decodedToken;
  const newRecord = req.body;
  newRecord.user_id = userId

  if (!newRecord.category_id || !newRecord.amount || !newRecord.title) {
    next([400, "Title, category, and amount fields are required"]);
  } else {
    try {
      const record = await Record.add(newRecord);
      delete record.user_id
      res.status(201).json(recordMapper(record));
    } catch (error) {
      console.log({ error });
      next([500, "Error adding a new record"]);
    }
  }
});

router.put("/:id", async (req, res, next) => {
  const { id: userId } = req.decodedToken;
  const { id: updateId } = req.params;
  const updatedRecord = req.body;

  if (typeof updatedRecord.title === "string" && updatedRecord.title === "") {
    next([400, "Tittle cannot be empty"]);
  }

  try {
    const found = await Record.findById(updateId);
    if (!found) {
      next([404, "Record not found"]);
    } else if (found?.user_id !== userId) {
      next([401, "Not authorized-func"]);
    }
    const record = await Record.update(updatedRecord, updateId);
    res.status(200).json(recordMapper(record));
  } catch (error) {
    console.log({ error });
    next([500, "Error updating record"]);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id: userId } = req.decodedToken;
  const { id } = req.params;
  try {
    const found = await Record.findById(id);
    if (!found) {
      next([404, "Record not found"]);
    }
    if (found.user_id !== userId) {
      next([401, "Not authorized"]);
    }
    const deleted = await Record.remove(id);
    if (deleted) {
      res.status(204).end();
    }
  } catch (error) {
    console.log({ error });
    next([500, "Error deleting record"]);
  }
});

module.exports = router;
