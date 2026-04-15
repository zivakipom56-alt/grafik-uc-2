const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: "Method Not Allowed"
            };
        }

        const body = JSON.parse(event.body || "{}");
        const token = body.token || "";
        const data = body.data || null;

        if (!process.env.UPLOAD_TOKEN) {
            return {
                statusCode: 500,
                body: JSON.stringify({ ok: false, error: "UPLOAD_TOKEN не настроен" })
            };
        }

        if (token !== process.env.UPLOAD_TOKEN) {
            return {
                statusCode: 403,
                body: JSON.stringify({ ok: false, error: "Неверный токен" })
            };
        }

        if (!data) {
            return {
                statusCode: 400,
                body: JSON.stringify({ ok: false, error: "Нет данных для сохранения" })
            };
        }

        const store = getStore("schedule-data");
        await store.setJSON("latest", data);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({ ok: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                ok: false,
                error: "Не удалось сохранить данные"
            })
        };
    }
};
