const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: "tokenなし" });
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "token無効" });
    }
}

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

app.post("/schedules", auth, async (req, res) => {
    try {
        console.log("受信データ:", req.body);

        const {
            date,
            time,
            category,
            title,
            memo
        } = req.body;

        const userId = req.user.id;

        const result = await pool.query(
            `
            INSERT INTO schedules
            (user_id,date,time,category,title,memo)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *
            `,
            [userId,date,time,category,title,memo]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "予定保存失敗"
        });
    }
    
});

app.get("/schedules", auth, async (req, res) => {
    try {

        const userId = req.user.id;

        const result = await pool.query(`
            SELECT *
            FROM schedules
            WHERE user_id = $1
            ORDER BY date, time
            `,
            [userId]
        );

            res.json(result.rows);
    } catch(error) {
        console.error(error);

        res.status(500).json({
            error: "予定取得失敗"
        });
    }
});

app.delete("/schedules/:id", auth, async (req, res) => {
    try {

        const userId = req.user.id;
        const { id } = req.params;

        await pool.query(
            `
            DELETE FROM schedules
            WHERE id = $1 AND user_id = $2
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

app.delete("/tasks/:id", auth, async (req, res) => {

    try {

        const userId = req.user.id;
        const { id } = req.params;

        await pool.query(
            "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
            [id, userId]
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

app.put("/schedules/:id", auth, async (req, res) => {
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

app.get("/tasks", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await pool.query(
            "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "取得失敗"
        });
    }
});

app.post("/tasks", auth, async (req, res) => {

    const {
        text,
        category
    } = req.body;

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            INSERT INTO tasks
            (text, category, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [text, category,userId]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "保存失敗"
        });

    }

});

app.put("/tasks/:id", auth, async (req, res) => {

    try {

        const { id } = req.params;
        const { completed } = req.body;

        const result = await pool.query(
            `
            UPDATE tasks
            SET completed = $1
            WHERE id = $2
            RETURNING *
            `,
            [completed, id]
        );

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "更新失敗"
        });

    }

});

app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // ① 既存チェック
        const exist = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (exist.rows.length > 0) {
            return res.status(400).json({
                message: "そのユーザーは既に存在しています"
            });
        }

        // ② パスワード暗号化
        const hashedPassword = await bcrypt.hash(password, 10);

        // ③ DB保存
        const result = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashedPassword]
        );

        // ④ トークン発行
        const token = jwt.sign(
            { id: result.rows[0].id, email },
            "SECRET_KEY",
            { expiresIn: "24h" }
        );

        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "登録失敗" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // ① ユーザー検索
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        const user = result.rows[0];

        // ② ユーザー存在チェック
        if (!user) {
            return res.status(400).json({
                message: "ユーザーが存在しません"
            });
        }

        // ③ パスワード確認
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "パスワードが違います"
            });
        }

        // ④ トークン発行
        const token = jwt.sign(
            { id: user.id, email: user.email },
            "SECRET_KEY",
            { expiresIn: "24h" }
        );

        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "ログイン失敗" });
    }
});

app.listen(3000, () => {
    console.log("server start");
})


