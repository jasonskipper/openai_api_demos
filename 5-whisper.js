const fs = require('fs')
const { OpenAI } = require('openai')
require('dotenv').config()


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })


async function transcribeAudio(filePath) {
  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(filePath),
  })
  console.log(response)
}
transcribeAudio('./speech.mp3')