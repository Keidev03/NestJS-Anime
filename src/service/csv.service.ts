import * as csv from 'csvtojson'

export class ConvertCSVService {

    constructor() { }

    public async CSVToJSON(csvFile: any, key: string[]) {

        try {
            const csvBuffer = csvFile.buffer.toString('utf8')

            if (!this.IsCSV(csvBuffer)) {
                throw new Error('Uploaded file is not a CSV.')
            }

            const fileJSON = await csv({
                delimiter: ';',
                noheader: false,
                headers: key,
            }).fromString(csvBuffer)

            return fileJSON

        } catch (error) {
            console.log(error)
        }
    }

    private IsCSV(content: any) {
        const lines = content.split('\n')
        const firstLine = lines[0].trim()
        return firstLine.includes(';')
    }
}