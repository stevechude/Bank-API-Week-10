import fs from 'fs';
import { IncomingMessage } from 'http';
import { title } from 'process';

export interface UserObj {
    [title: string]: string | number | string[]
}

export function getPostData(req: IncomingMessage) {
    return new Promise((res, rej) => {
        try {
            let body = ''
            req.on('data', (chunks) => {
                body += chunks.toString();
            })
            req.on('end', () => {
                res(body)
            })
        } catch (error) {
            console.log(error)
        }
    })
}