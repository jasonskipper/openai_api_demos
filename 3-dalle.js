const { OpenAI } = require('openai')
require('dotenv').config()


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function generateImage(prompt) {
    const image = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
    })
    console.log(image.data[0].url)
}
// generateImage('Please create an image of a beautiful sunset in Hawaii in the rain.')
// generateImage('a sunrise on a beach in bermuda with a sailboat and clear skies')
generateImage('a snowy day on a glacier in alaska with a penguin drinking steaming hot chocolate')