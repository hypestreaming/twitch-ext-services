"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const jwt_1 = require("../src/jwt");
describe('jwt functions', () => {
    const config = {
        twitch: {
            extensionSecret: "xx",
        }
    };
    it('verify() works with signed tokens', () => {
        // this is a good token
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksIm9wYXF1ZV91c2VyX2lkIjoiVU1JS2VMd2JFNHhpQVNkR3VpRjgtIiwidXNlcl9pZCI6IjI0Mjg1MDU0NCIsImNoYW5uZWxfaWQiOiIxOTc0MTk4MDUiLCJyb2xlIjoiYnJvYWRjYXN0ZXIiLCJwdWJzdWJfcGVybXMiOnsibGlzdGVuIjpbImJyb2FkY2FzdCIsIndoaXNwZXItVU1JS2VMd2JFNHhpQVNkR3VpRjgtIiwiZ2xvYmFsIl0sInNlbmQiOlsiYnJvYWRjYXN0Iiwid2hpc3Blci0qIl19fQ.JcptlHWBc61_GuU4ZQOtgtjBsTIbjK8d8F7wVPV81Wk';
        const jwt = new jwt_1.Jwt(config.twitch.extensionSecret);
        chai_1.expect(jwt.verify(token)).to.equal(true);
    });
    it('verify() requires secret', () => {
        // this is a good token
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksIm9wYXF1ZV91c2VyX2lkIjoiVU1JS2VMd2JFNHhpQVNkR3VpRjgtIiwidXNlcl9pZCI6IjI0Mjg1MDU0NCIsImNoYW5uZWxfaWQiOiIxOTc0MTk4MDUiLCJyb2xlIjoiYnJvYWRjYXN0ZXIiLCJwdWJzdWJfcGVybXMiOnsibGlzdGVuIjpbImJyb2FkY2FzdCIsIndoaXNwZXItVU1JS2VMd2JFNHhpQVNkR3VpRjgtIiwiZ2xvYmFsIl0sInNlbmQiOlsiYnJvYWRjYXN0Iiwid2hpc3Blci0qIl19fQ.JcptlHWBc61_GuU4ZQOtgtjBsTIbjK8d8F7wVPV81Wk';
        const jwt = new jwt_1.Jwt("X" + config.twitch.extensionSecret);
        chai_1.expect(jwt.verify(token)).to.equal(false);
    });
    it('verify() detects bad token', () => {
        // this is a bad token
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksIm9wYXF1ZV91c2VyX2lkIjoiVU1JS2VMd2JFNHhpQVNkR3VpRjgtIiwidXNlcl9pZCI6IjI0Mjg1MDU0NCIsImNoYW5uZWxfaWQiOiIxOTc0MTk4MDUiLCJyb2xlIjoiYnJvYWRjYXN0ZXIiLCJwdWJzdWJfcGVybXMiOnsibGlzdGVuIjpbImJyb2FkY2FzdCIsIndoaXNwZXItVU1JS2VMd2JFNHhpQVNkR3VpRjgtIiwiZ2xvYmFsIl0sInNlbmQiOlsiYnJvYWRjYXN0Iiwid2hpc3Blci0qIl19fQ.JcptlHWBc61_GuU4ZQOtgtjBsTIbjK8d8F7wVPV81Wk-XXXXX';
        const jwt = new jwt_1.Jwt(config.twitch.extensionSecret);
        chai_1.expect(jwt.verify(token)).to.equal(false);
    });
    it('decode() works', () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoZWxsbyI6MX0.5oQaClPwE4VzdHoHBKAomTksCKXCsws9f474u9tJt7k';
        const jwt = new jwt_1.Jwt("doesnt matter");
        const decoded = jwt.decode(token);
        chai_1.expect("hello" in decoded).to.equal(true);
        chai_1.expect(decoded.hello).to.equal(1);
        chai_1.expect(Object.keys(decoded).length).to.equal(1);
    });
    it('decode() fails on error', () => {
        const jwt = new jwt_1.Jwt("doesnt matter");
        const decoded = jwt.decode("something rotten");
        chai_1.expect(decoded).to.equal(null);
    });
    it('sign() works properly', () => {
        const jwt = new jwt_1.Jwt(config.twitch.extensionSecret);
        const time = Date.now();
        const object = { time: time };
        const signed = jwt.sign(object);
        chai_1.expect(jwt.verify(signed)).to.equal(true);
        const decoded = jwt.decode(signed);
        chai_1.expect("iat" in decoded);
        delete decoded.iat;
        chai_1.expect(JSON.stringify(decoded)).to.equal(JSON.stringify(object));
    });
});
