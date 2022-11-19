"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const jwt_1 = require("../src/jwt");
const function_1 = require("../src/function");
const atob = require("atob");
class FooFunction extends function_1.Function {
    constructor(config) {
        super(config);
    }
    handle(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return "yo";
        });
    }
}
describe('base function class', () => {
    const config = {
        twitch: {
            clientId: 'dummy-client-id',
            extensionSecret: atob('dummy-extension-secret'),
        },
    };
    it('works', () => {
        const jwt = new jwt_1.Jwt(config.twitch.extensionSecret);
        const object = {
            user_id: '12345',
        };
        const bearer = jwt.sign(object);
        const authorization = 'Bearer ' + bearer;
        const event = {
            headers: {
                Authorization: authorization,
            }
        };
        // any class that inherits from Function would suffice..
        const func = new FooFunction(config);
        const token = func.getToken(event);
        chai_1.expect("iat" in token).to.equal(true);
        chai_1.expect("user_id" in token).to.equal(true);
        chai_1.expect(token.user_id).to.equal(object.user_id);
        chai_1.expect(Object.keys(token).length).to.equal(2);
    });
    it('detects missing authorization header', () => {
        /*
        const event:Event = {
            headers: {
                hello: 'world',
            },
        };

        const request = new CallerRequestCallFunction(config);
        const token = request.getToken(event);
        expect(token).to.equal(null);
        */
    });
});
