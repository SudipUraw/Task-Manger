var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express3 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);

// config/db.ts
var import_mongoose = __toESM(require("mongoose"), 1);
var isUsingMemoryDb = false;
var dbConnectionError = null;
var connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri || mongoUri === "your_mongodb_atlas_connection_string" || mongoUri.trim() === "") {
    console.log("MONGODB_URI is not configured. Running in-memory database mode for seamless preview.");
    isUsingMemoryDb = true;
    dbConnectionError = "MONGODB_URI environment variable is not set.";
    return;
  }
  try {
    const conn = await import_mongoose.default.connect(mongoUri, {
      serverSelectionTimeoutMS: 4e3
    });
    console.log(`Connected to MongoDB Atlas: ${conn.connection.host}`);
    isUsingMemoryDb = false;
    dbConnectionError = null;
  } catch (error) {
    dbConnectionError = error.message || "Failed to connect to MongoDB Atlas cluster.";
    console.warn("MongoDB Atlas Connection Notice:", dbConnectionError);
    console.warn("Tip: Ensure IP 0.0.0.0/0 is added to Network Access in MongoDB Atlas whitelist.");
    console.log("Falling back to in-memory database store so the app remains fully functional.");
    isUsingMemoryDb = true;
  }
};
var getDbStatus = () => {
  return {
    isUsingMemoryDb,
    type: isUsingMemoryDb ? "In-Memory Store" : "MongoDB Atlas",
    connected: !isUsingMemoryDb,
    error: dbConnectionError
  };
};

// routes/authRoutes.ts
var import_express = __toESM(require("express"), 1);

// controllers/authController.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);

// models/User.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var userSchema = new import_mongoose2.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6
    }
  },
  {
    timestamps: true
  }
);
var User = import_mongoose2.default.model("User", userSchema);

// config/memoryStore.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var MemoryStore = class {
  users = [];
  tasks = [];
  constructor() {
    const demoPasswordHash = import_bcryptjs.default.hashSync("password123", 10);
    const demoUserId = "user_demo_123";
    this.users.push({
      _id: demoUserId,
      name: "Demo Student",
      email: "student@example.com",
      passwordHash: demoPasswordHash,
      createdAt: /* @__PURE__ */ new Date()
    });
    this.tasks.push(
      {
        _id: "task_1",
        title: "Complete MERN Stack Assignment",
        description: "Build backend API routes and responsive React frontend for Task Manager.",
        status: "Pending",
        dueDate: new Date(Date.now() + 864e5 * 2).toISOString(),
        userId: demoUserId,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        _id: "task_2",
        title: "Review JWT Auth & Security",
        description: "Ensure token expiration, password hashing with bcrypt, and protected middleware.",
        status: "Completed",
        dueDate: new Date(Date.now() - 864e5).toISOString(),
        userId: demoUserId,
        createdAt: new Date(Date.now() - 864e5 * 2)
      },
      {
        _id: "task_3",
        title: "Deploy & Test MongoDB Atlas Connection",
        description: "Configure environment variables MONGODB_URI and JWT_SECRET.",
        status: "Pending",
        dueDate: new Date(Date.now() + 864e5 * 5).toISOString(),
        userId: demoUserId,
        createdAt: new Date(Date.now() - 864e5 * 3)
      }
    );
  }
  // User operations
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id) {
    return this.users.find((u) => u._id === id);
  }
  createUser(name, email, passwordHash) {
    const newUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.push(newUser);
    return newUser;
  }
  // Task operations
  getTasksForUser(userId, search, status) {
    let list = this.tasks.filter((t) => t.userId === userId);
    if (status && status !== "All") {
      list = list.filter((t) => t.status === status);
    }
    if (search && search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  createTask(userId, title, description, dueDate, status = "Pending") {
    const newTask = {
      _id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      description: description || "",
      status,
      dueDate: dueDate || null,
      userId,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.tasks.push(newTask);
    return newTask;
  }
  updateTask(taskId, userId, updates) {
    const taskIndex = this.tasks.findIndex((t) => t._id === taskId && t.userId === userId);
    if (taskIndex === -1) return null;
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates
    };
    return this.tasks[taskIndex];
  }
  deleteTask(taskId, userId) {
    const initialLen = this.tasks.length;
    this.tasks = this.tasks.filter((t) => !(t._id === taskId && t.userId === userId));
    return this.tasks.length < initialLen;
  }
};
var memoryStore = new MemoryStore();

// controllers/authController.ts
var generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "task_manager_secret_key_2026";
  return import_jsonwebtoken.default.sign({ id }, secret, {
    expiresIn: "30d"
  });
};
var registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please provide all required fields (name, email, password)" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters long" });
      return;
    }
    if (isUsingMemoryDb) {
      const existing = memoryStore.findUserByEmail(email);
      if (existing) {
        res.status(400).json({ message: "User already exists with this email" });
        return;
      }
      const salt2 = await import_bcryptjs2.default.genSalt(10);
      const hashedPassword2 = await import_bcryptjs2.default.hash(password, salt2);
      const user2 = memoryStore.createUser(name, email, hashedPassword2);
      res.status(201).json({
        _id: user2._id,
        name: user2.name,
        email: user2.email,
        token: generateToken(user2._id)
      });
      return;
    }
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }
    const salt = await import_bcryptjs2.default.genSalt(10);
    const hashedPassword = await import_bcryptjs2.default.hash(password, salt);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });
    if (user) {
      res.status(201).json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message || "Server Error during registration" });
  }
};
var loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }
    if (isUsingMemoryDb) {
      const user2 = memoryStore.findUserByEmail(email);
      if (user2 && await import_bcryptjs2.default.compare(password, user2.passwordHash)) {
        res.json({
          _id: user2._id,
          name: user2.name,
          email: user2.email,
          token: generateToken(user2._id)
        });
        return;
      } else {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && await import_bcryptjs2.default.compare(password, user.password)) {
      res.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message || "Server Error during login" });
  }
};
var getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// middleware/authMiddleware.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = process.env.JWT_SECRET || "task_manager_secret_key_2026";
      const decoded = import_jsonwebtoken2.default.verify(token, secret);
      if (isUsingMemoryDb) {
        const memUser = memoryStore.findUserById(decoded.id);
        if (!memUser) {
          res.status(401).json({ message: "Not authorized, user not found" });
          return;
        }
        req.user = {
          _id: memUser._id,
          name: memUser.name,
          email: memUser.email
        };
      } else {
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
          res.status(401).json({ message: "Not authorized, user not found" });
          return;
        }
        req.user = {
          _id: user._id.toString(),
          name: user.name,
          email: user.email
        };
      }
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// routes/authRoutes.ts
var router = import_express.default.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
var authRoutes_default = router;

// routes/taskRoutes.ts
var import_express2 = __toESM(require("express"), 1);

// models/Task.ts
var import_mongoose3 = __toESM(require("mongoose"), 1);
var taskSchema = new import_mongoose3.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a task title"],
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending"
    },
    dueDate: {
      type: Date,
      default: null
    },
    user: {
      type: import_mongoose3.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);
var Task = import_mongoose3.default.model("Task", taskSchema);

// controllers/taskController.ts
var getTasks = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const search = req.query.search || "";
    const status = req.query.status || "All";
    if (isUsingMemoryDb) {
      const tasks2 = memoryStore.getTasksForUser(userId, search, status);
      res.json(tasks2);
      return;
    }
    const query = { user: userId };
    if (status && status !== "All") {
      query.status = status;
    }
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("getTasks Error:", error);
    res.status(500).json({ message: error.message || "Server Error fetching tasks" });
  }
};
var createTask = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const { title, description, dueDate, status } = req.body;
    if (!title || title.trim() === "") {
      res.status(400).json({ message: "Task title is required" });
      return;
    }
    const taskStatus = status === "Completed" ? "Completed" : "Pending";
    if (isUsingMemoryDb) {
      const newTask = memoryStore.createTask(
        userId,
        title,
        description,
        dueDate ? new Date(dueDate).toISOString() : null,
        taskStatus
      );
      res.status(201).json(newTask);
      return;
    }
    const task = await Task.create({
      title,
      description: description || "",
      status: taskStatus,
      dueDate: dueDate ? new Date(dueDate) : null,
      user: userId
    });
    res.status(201).json(task);
  } catch (error) {
    console.error("createTask Error:", error);
    res.status(500).json({ message: error.message || "Server Error creating task" });
  }
};
var updateTask = async (req, res) => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const { title, description, dueDate, status } = req.body;
    if (isUsingMemoryDb) {
      const updated = memoryStore.updateTask(taskId, userId, {
        ...title !== void 0 && { title },
        ...description !== void 0 && { description },
        ...dueDate !== void 0 && { dueDate: dueDate ? new Date(dueDate).toISOString() : null },
        ...status !== void 0 && { status }
      });
      if (!updated) {
        res.status(404).json({ message: "Task not found or unauthorized" });
        return;
      }
      res.json(updated);
      return;
    }
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    if (task.user.toString() !== userId) {
      res.status(401).json({ message: "Not authorized to modify this task" });
      return;
    }
    if (title !== void 0) task.title = title;
    if (description !== void 0) task.description = description;
    if (dueDate !== void 0) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (status !== void 0) task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("updateTask Error:", error);
    res.status(500).json({ message: error.message || "Server Error updating task" });
  }
};
var deleteTask = async (req, res) => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    if (isUsingMemoryDb) {
      const removed = memoryStore.deleteTask(taskId, userId);
      if (!removed) {
        res.status(404).json({ message: "Task not found or unauthorized" });
        return;
      }
      res.json({ message: "Task removed successfully" });
      return;
    }
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    if (task.user.toString() !== userId) {
      res.status(401).json({ message: "Not authorized to delete this task" });
      return;
    }
    await task.deleteOne();
    res.json({ message: "Task removed successfully" });
  } catch (error) {
    console.error("deleteTask Error:", error);
    res.status(500).json({ message: error.message || "Server Error deleting task" });
  }
};
var updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;
    const { status } = req.body;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    if (!status || status !== "Pending" && status !== "Completed") {
      res.status(400).json({ message: "Status must be Pending or Completed" });
      return;
    }
    if (isUsingMemoryDb) {
      const updated = memoryStore.updateTask(taskId, userId, { status });
      if (!updated) {
        res.status(404).json({ message: "Task not found or unauthorized" });
        return;
      }
      res.json(updated);
      return;
    }
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    if (task.user.toString() !== userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("updateTaskStatus Error:", error);
    res.status(500).json({ message: error.message || "Server Error updating task status" });
  }
};

// routes/taskRoutes.ts
var router2 = import_express2.default.Router();
router2.use(protect);
router2.route("/").get(getTasks).post(createTask);
router2.route("/:id").put(updateTask).delete(deleteTask);
router2.patch("/:id/status", updateTaskStatus);
var taskRoutes_default = router2;

// server.ts
import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), ".env") });
import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), ".env.local") });
import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), "backend/.env") });
async function startServer() {
  await connectDB();
  const app = (0, import_express3.default)();
  const PORT = Number(process.env.PORT) || 5e3;
  app.use((0, import_cors.default)());
  app.use(import_express3.default.json());
  app.use(import_express3.default.urlencoded({ extended: true }));
  app.use("/api/auth", authRoutes_default);
  app.use("/api/tasks", taskRoutes_default);
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString(), db: getDbStatus() });
  });
  app.get("/api/db-status", (_req, res) => {
    res.json(getDbStatus());
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Task Manager backend running on http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start backend server:", err);
});
//# sourceMappingURL=server.cjs.map
