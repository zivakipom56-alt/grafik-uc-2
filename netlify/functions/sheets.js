exports.handler = async (event) => {
    try {
        const url = event.queryStringParameters?.url;
        if (!url) {
            return { statusCode: 400, body: "Missing url" };
        }

        if (!/^https:\/\/docs\.google\.com\/spreadsheets\/d\/e\//.test(url)) {
            return { statusCode: 400, body: "Invalid url" };
        }

        const res = await fetch(url);
        if (!res.ok) {
            return { statusCode: res.status, body: `Upstream error: ${res.status}` };
        }

        const text = await res.text();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store"
            },
            body: text
        };
    } catch (e) {
        return { statusCode: 500, body: "Server error" };
    }
};