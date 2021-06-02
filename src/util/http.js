const host = process.env.NODE_ENV === "production"
    ? "https://pushr.info"
    : "http://localhost:8081";

function post(path, body, accessToken, convertResponseToJSON = true) {
    return fetch(`${host}${path}`, {
        credentials: "omit",
        headers: { "content-type": "application/json;charset=UTF-8", "sec-fetch-mode": "cors", "x-pushr-access-token": accessToken },
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

function put(path, body, accessToken, convertResponseToJSON = true, contentType = "text/plain") {
    return fetch(`${host}${path}`, {
        credentials: "omit",
        headers: { "content-type": contentType, "sec-fetch-mode": "cors", "x-pushr-access-token": accessToken },
        body: body,
        method: "PUT",
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

function get(path, accessToken, convertResponseToJSON = true) {
    return fetch(`${host}${path}`, {
        credentials: "omit",
        headers: { "content-type": "application/json;charset=UTF-8", "sec-fetch-mode": "cors", "x-pushr-access-token": accessToken },
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
    put: put,
    get: get
};

export default http;