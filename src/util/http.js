const host = process.env.NODE_ENV === "production"
    ? "https://pushr.info"
    : "http://localhost:8081";

function post(path, body, convertResponseToJSON = true) {
    return fetch(`${host}${path}`, {
        credentials: "omit",
        headers: { "content-type": "application/json;charset=UTF-8", "sec-fetch-mode": "cors" },
        body: JSON.stringify(body),
        method: "POST",
        mode: "cors"
    })
        .then((response) => {
            if (!!convertResponseToJSON) {
                return response.json();
            } else {
                return response;
            }
        })
        .then((data) => {
            return data;
        });
}

function get(path, convertResponseToJSON = true) {
    return fetch(`${host}${path}`, {
        credentials: "omit",
        headers: { "content-type": "application/json;charset=UTF-8", "sec-fetch-mode": "cors" },
        method: "GET",
        mode: "cors"
    })
        .then(function(response) {
            if (!!convertResponseToJSON) {
                return response.json();
            } else {
                return response;
            }
        })
        .then(function(data) {
            return data;
        });
}

const http = {
    post: post,
    get: get
};

export default http;