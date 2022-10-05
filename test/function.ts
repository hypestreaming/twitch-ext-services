import {expect} from 'chai';

import {Event} from "../src/event";
import {Jwt} from "../src/jwt";
import {Function} from "../src/function";

const atob = require("atob");

class FooFunction extends Function {
	constructor(config: any) {
		super(config);
	}

	async handle(event: Event): Promise<any> {
		return "yo";
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

		const jwt = new Jwt(config.twitch.extensionSecret);
		const object: any = {
			user_id: '12345',
		};

		const bearer = jwt.sign(object);
		const authorization = 'Bearer ' + bearer;

		const event: Event = {
			headers: {
				Authorization: authorization,
			}
		};

		// any class that inherits from Function would suffice..
		const func = new FooFunction(config);
		const token = func.getToken(event);
		expect("iat" in token).to.equal(true);
		expect("user_id" in token).to.equal(true);
		expect(token.user_id).to.equal(object.user_id);
		expect(Object.keys(token).length).to.equal(2);
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
