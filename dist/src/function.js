"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("./jwt");
class Function {
    constructor(config) {
        this.config = config;
    }
    logEvent(event) {
        const short = {};
        const ip = event.requestContext.identity.sourceIp;
        if (event.queryStringParameters) {
            short.queryStringParameters = event.queryStringParameters;
        }
        if (event.body) {
            short.body = event.body;
        }
        if (event.headers && event.headers.Authorization) {
            short.authorization = event.headers.Authorization;
        }
        console.log("Handling request: " + ip + " " + event.httpMethod + " " + event.path + " " + JSON.stringify(short));
    }
    /**
     * Handle request from lambda gateway
     *
     */
    run(event, context, callback) {
        this.logEvent(event);
        this.handle(event).then((body) => {
            if ("statusCode" in body && "headers" in body) {
                // FIXME, this is not a json
                callback(null, body);
                return;
            }
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            };
            console.log("Returning html success with body: " + JSON.stringify(response));
            callback(null, response);
        }).catch((err) => {
            console.log("Returning html failure with error: " + JSON.stringify(err));
            callback(err, null);
        });
    }
    hasBodyParameter(event, key) {
        const body = JSON.parse(event.body);
        return (key in body);
    }
    getBodyParameter(event, key) {
        const body = JSON.parse(event.body);
        if (!(key in body)) {
            throw new Error("Missing parameter " + key);
        }
        return body[key];
    }
    getHeader(headers, header) {
        for (const key in headers) {
            if (key.toLowerCase() === header.toLowerCase()) {
                return headers[key];
            }
        }
        return null;
    }
    getAuthorizationToken(headers) {
        if (headers == null) {
            return null;
        }
        const value = this.getHeader(headers, "Authorization");
        if (value) {
            if (value.startsWith("Bearer ")) {
                return value.substring("Bearer ".length);
            }
        }
        return null;
    }
    getRemoteAddress(event) {
        if (event.requestContext) {
            if (event.requestContext.identity && event.requestContext.identity.sourceIp) {
                return event.requestContext.identity.sourceIp;
            }
        }
        return '0.0.0.0';
    }
    getToken(event) {
        const jwt = new jwt_1.Jwt(this.config.twitch.extensionSecret);
        const token = this.getAuthorizationToken(event.headers);
        if (token === null) {
            throw new Error("No token in request");
        }
        if (!jwt.verify(token)) {
            throw new Error("JWT validation failed for " + token);
        }
        const token_object = jwt.decode(token);
        if (token_object === null) {
            throw new Error("Failed to parse json from " + token);
        }
        return token_object;
    }
}
exports.Function = Function;
