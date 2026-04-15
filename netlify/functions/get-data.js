const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
    try {
        const store = getStore("schedule-data");
        const data = await store.get("latest", { type: "json" });

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-store"
            },
            body: JSON.stringify({
                ok: true,
                data: data || null
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                ok: false,
                error: "Не удалось прочитать данные"
            })
        };
    }
};
