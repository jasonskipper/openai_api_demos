require('dotenv').config()
const OpenAI = require('openai')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

const secretKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: secretKey,
})

async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function main() {
  try {
    // Step 1: Create the assistant 
    const assistant = await openai.beta.assistants.create({
      name: 'OpenAI API Tutor',
      instructions:
        'You are a personal OpenAI API tutor. Feel free to look stuff up online to help me.',
      tools: [{ type: 'code_interpreter' }],
      model: 'gpt-4-1106-preview',
    })

    console.log(
      `\nHello there, I am your personal OpenAI API tutor. Ask some complicated questions.\nYou can find me at https://platform.openai.com/playground?assistant=${assistant.id}`
    )

    // Step 2: Create a Thread
    const thread = await openai.beta.threads.create()

    // Step 3: Add messages to the Thread as the user asks questions 
    let keepAsking = true
    while (keepAsking) {
      const userQuestion = await askQuestion('\nWhat is your question? ')

      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: userQuestion,
      })

      // Step 4: Run the assistant on the Thread 
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      })

      let runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      )

      // Step 5: Check the run status 
      while (runStatus.status !== 'completed') {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
      }

      // Step 6: Display the Assistant's response 
      const messages = await openai.beta.threads.messages.list(thread.id)

      const lastMessageForRun = messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === 'assistant'
        )
        .pop()

      if (lastMessageForRun) {
        console.log(`${lastMessageForRun.content[0].text.value} \n`)
      }

      // Then ask if the user wants to ask another question and update keepAsking state
      const continueAsking = await askQuestion(
        'Do you want to ask another question? (yes/no) '
      )
      keepAsking = continueAsking.toLowerCase() === 'yes'

      // If the keepAsking state is falsy show an ending message
      if (!keepAsking) {
        console.log('Alrighty then, I hope you learned something!\n')
      }
    }

    // close the readline
    readline.close()
  } catch (error) {
    console.error(error)
  }
}

// Call the main function
main()