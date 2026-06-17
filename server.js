const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "schedule_app",
    password: "postgres123",
    port: 5432,
})

app.get("/", (req, res) => {
    res.send("API起動中");
})

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "DB接続失敗"
        });
    }
})

app.listen(3000, () => {
    console.log("server start");
})