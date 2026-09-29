const express = require('express');
const mongese = require('mongoose');
require('dotenv').config();

const userRouter = require('./routes/user_routes');
const app = express();
app.use(express.json());

mongese.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log("error", err));

app.use("/api/users", userRouter);

app.listen(3000, () => console.log("Server running on port 3000"));