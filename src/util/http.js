const host = process.env.NODE_ENV === "production"
    ? "https://pushr.info"
    : "http://localhost:8081";

function post(path, body, accessToken, convertResponseToJSON = true, contentType = "application/json;charset=UTF-8") {
    return doHttp(path, "POST",
        JSON.stringify(body), accessToken, convertResponseToJSON, contentType);
}
function del(path, body, accessToken, convertResponseToJSON = true, contentType = "text/plain") {
    return doHttp(path, "DELETE",
        body, accessToken, convertResponseToJSON, contentType);
}

function put(path, body, accessToken, convertResponseToJSON = true, contentType = "text/plain") {
    return doHttp(path, "PUT",
        body, accessToken, convertResponseToJSON, contentType);
}

function get(path, accessToken, convertResponseToJSON = true, contentType = "text/plain") {
    return doHttp(path, "GET",
        null, accessToken, convertResponseToJSON, contentType);
}

function doHttp(path, method, body, accessToken, convertResponseToJSON, contentType) {

    let initOptions = {
        credentials: "omit",
        headers: {
            "content-type": contentType,
            "sec-fetch-mode": "cors",
            "x-pushr-access-token": accessToken
        },
        method: method,
        mode: "cors"
    };
    if (!!body) {
        initOptions.body = body;
    }

    return fetch(`${host}${path}`, initOptions)
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

const http = {
    post: post,
    put: put,
    del: del,
    get: get
};

export default http;