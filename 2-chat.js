const { OpenAI } = require('openai')
require('dotenv').config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function chatWithAI(prompt) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
    })

    console.log(response.choices[0].message.content)
}

chatWithAI('Hello, how are you today?')
