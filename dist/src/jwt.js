"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken = require("jsonwebtoken");
class Jwt {
    constructor(secret) {
        this.secret = secret;
    }
    verify(token) {
        try {
            jsonwebtoken.verify(token, Buffer.from(this.secret, 'base64'));
            return true;
        }
        catch (e) {
            return false;
        }
    }
    decode(token) {
        const args = token.split(".");
        if (args.length === 3) {
            const json = Buffer.from(args[1], 'base64').toString();
            return JSON.parse(json);
        }
        return null;
    }
    sign(message, options) {
        return jsonwebtoken.sign(message, Buffer.from(this.secret, 'base64'), options);
    }
}
exports.Jwt = Jwt;
