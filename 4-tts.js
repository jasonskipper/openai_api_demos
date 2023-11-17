const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')
require('dotenv').config()



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const speechFile = path.resolve('./speech.mp3')

async function main() {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'shimmer',
    input: 'Hello I am the Text to Speech model, I hope you are all enjoying this demo'
  })
  console.log(speechFile)
  const buffer = Buffer.from(await mp3.arrayBuffer())
  await fs.promises.writeFile(speechFile, buffer)
}
main()