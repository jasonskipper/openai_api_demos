const { OpenAI } = require('openai')
require('dotenv').config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function callGPT(appendString){
	let messages = [
        {
            role: 'user',
            content: 'What time is it?',
        }
    ]

	let response = await openai.chat.completions.create({
		model: 'gpt-4-1106-preview',
		messages,
	})
	console.log(response.choices[0])
	
}

callGPT()