const { OpenAI } = require('openai')
require('dotenv').config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function listModels() {
    const list = await openai.models.list()

    for await (const model of list) {
        console.log(model)
    }
}
listModels()