export interface TwitchAuth {
    exp: number;
    opaque_user_id?: string;
    user_id: string;
    channel_id: string;
    role: string;
}
