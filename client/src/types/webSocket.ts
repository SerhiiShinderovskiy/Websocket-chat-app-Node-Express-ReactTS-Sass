export interface Message {
    id: number | string;
    message: string;
    event: string;
    username: string;
}

export interface MessageCon {
    event: string;
    username: string;
    id: number;
}