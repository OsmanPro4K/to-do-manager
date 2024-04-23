const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/to-do");
}

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
});
const User = mongoose.model("User", userSchema);

const taskSchema = new mongoose.Schema({
  username: String,
  tasks: [{ task: String }],
});
const Task = mongoose.model("Task", taskSchema);

app.post("/api/signin", async (req, res) => {
  const { username, email } = req.body;
  try {
    const existingUser = await User.findOne({
      username: username,
      email: email,
    });
    if (!existingUser) {
      const newUser = new User({ username: username, email: email });
      await newUser.save();

      return res
        .status(200)
        .json({ message: "User saved successfully", savedUser: newUser });
    } else {
      return res
        .status(200)
        .json({ message: "User saved successfully", savedUser: existingUser });
    }
  } catch (error) {
    console.log("Error while saving in DB: ", error);
    return res.status(404).json({ message: "User not saved successfully" });
  }
});

app.post("/api/task", async (req, res) => {
  const { username, task } = req.body;
  try {
    // Find the user by username
    let updatedUser = await Task.findOne({ username: username });

    if (!updatedUser) {
      // If user doesn't exist, create a new user with the task
      updatedUser = new Task({
        username: username,
        tasks: [{ task: task }],
      });
      // Save the new user document
      updatedUser = await updatedUser.save();
    } else {
      // If user exists, use $push to add the new task to the tasks array
      updatedUser = await Task.findOneAndUpdate(
        { username: username },
        { $push: { tasks: { task: task } } },
        { new: true } // Return the updated document after update
      );
    }

    return res
      .status(200)
      .json({ message: "Task added successfully", updatedUser: updatedUser });
  } catch (error) {
    console.log("Error while adding task: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/task", async (req, res) => {
  const { username } = req.query;
  try {
    const existingUser = await Task.findOne({ username: username });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    } else {
      return res.status(200).json({
        message: "User found, here are the fetched tasks.",
        fetchedTasks: existingUser.tasks,
      });
    }
  } catch (error) {
    console.error("Error while retrieving tasks: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/task", async (req, res) => {
  const { username, taskID } = req.query;
  try {
    // Update the user document to remove the task
    const updatedUser = await Task.findOneAndUpdate(
      { username: username },
      { $pull: { tasks: { _id: taskID } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error while deleting task: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/task-edit", async (req, res) => {
  const { username, editedTask, taskID } = req.body;
  console.log(username, editedTask, taskID);
  try {
    // Update the task using $set operator
    const updatedTask = await Task.findOneAndUpdate(
      {
        username: username,
        "tasks._id": taskID,
      },
      {
        $set: { "tasks.$.task": editedTask },
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res
      .status(200)
      .json({ message: "Task edited successfully", updatedTask: updatedTask });
  } catch (error) {
    console.error("Error while editing task: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/all-users-tasks", async (req, res) => {
  try {
    // Fetch all users with their corresponding tasks
    const allUsersTasks = await User.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "username",
          foreignField: "username",
          as: "tasks",
        },
      },
    ]);

    console.log(allUsersTasks);
    return res.status(200).json({ allUsers: allUsersTasks });
  } catch (error) {
    console.error("Error while fetching users and tasks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server listening at port 3000.");
});
