const { OpenAI } = require('openai')
require('dotenv').config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })


async function main() {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: 'food',
    encoding_format: 'float',
  })

  console.log(embedding.data)
}

main()