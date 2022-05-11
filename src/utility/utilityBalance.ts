import fs from 'fs';


interface UserObj {
    [key: string]: string | number | Date
}

let Account: UserObj[]

export function writeDataToFile(filename: string, content:UserObj[]) {
    fs.writeFile(filename, JSON.stringify(content, null, 3), 'utf-8', (err) => {
        if(err) {
            console.log(err)
        }
    })
}

export {Account}