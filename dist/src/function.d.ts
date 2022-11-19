import { Event } from "./event";
import { TwitchAuth } from "./twitch-auth";
export declare abstract class Function {
    config: any;
    protected constructor(config: any);
    /**
     * Function implementation. Callback's resolve method will be wrapped with a 200 OK
     * json for lambda.
     *
     */
    abstract handle(event: Event): Promise<any>;
    private logEvent;
    /**
     * Handle request from lambda gateway
     *
     */
    run(event: Event, context: any, callback: any): void;
    protected hasBodyParameter(event: Event, key: string): boolean;
    protected getBodyParameter(event: Event, key: string): any;
    protected getHeader(headers: any, header: string): string;
    protected getAuthorizationToken(headers: any): string;
    protected getRemoteAddress(event: any): string;
    getToken(event: Event): TwitchAuth;
}
