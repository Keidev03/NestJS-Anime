import { resolve } from "path"

const BaseURL = process.env.BASE_URL
const URI = process.env.URI
const idFolder = process.env.FOLDER
const keyFilePath = resolve('secret.json');
const scopes = ["https://www.googleapis.com/auth/drive"]

const env = {
     BaseURL,
     URI,
     keyFilePath,
     scopes,
     idFolder
}

export default env