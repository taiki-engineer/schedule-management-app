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

app.post("/schedules", async (req, res) => {
    try {
        console.log("受信データ:", req.body);

        const {
            date,
            time,
            category,
            title,
            memo
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO schedules
            (date,time,category,title,memo)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [date,time,category,title,memo]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "予定保存失敗"
        });
    }
    
});

app.get("/schedules", async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT *
            FROM schedules
            ORDER BY date, time
            `);

            res.json(result.rows);
    } catch(error) {
        console.error(error);

        res.status(500).json({
            error: "予定取得失敗"
        });
    }
});

app.delete("/schedules/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            `
            DELETE FROM schedules
            WHERE id = $1
            `,
            [id]
        );

        res.json({
            message: "削除成功"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "削除失敗"
        });
    }
});

app.put("/schedules/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            date,
            time,
            category,
            title,
            memo
        } = req.body;

        const result = await pool.query(
            `
            UPDATE schedules
            SET
                date = $1,
                time = $2,
                category = $3,
                title = $4,
                memo = $5
            WHERE id = $6
            RETURNING *
            `,
            [date, time, category, title, memo, id]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "更新失敗"
        });
    }
});

app.listen(3000, () => {
    console.log("server start");
})
