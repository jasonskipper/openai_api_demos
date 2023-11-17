const { OpenAI } = require('openai')
require('dotenv').config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function getTimeOfDay(){
	let date = new Date()
	let hours = date.getHours()
	let minutes = date.getMinutes()
	let seconds = date.getSeconds()
	let timeOfDay = 'AM'
	if(hours > 12){
		hours = hours - 12
		timeOfDay = 'PM'
	}
	return hours + ':' + minutes + ':' + seconds + ' ' + timeOfDay
}

async function callGPTWithFunctions(appendString){
	let messages = [
		{
            role: 'system',
            content: 'Perform function requests for the user',
        },
        {
            role: 'user',
            content: 'What time is it?',
        }
    ]
	// Step 1: Call GPT with the function name
	let chat = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo-0613',
		messages,
		functions: [{
			name: 'getTimeOfDay',
			description: 'Get the time of day.',
			parameters: {
				type: 'object',
				properties: {
				},
				require: [],
			}
		}],
		function_call: 'auto',
	})
	
	let wantsToUseFunction = chat.choices[0].finish_reason == 'function_call'

	let content = ''
	// Step 2: Check if GPT wants to use a function
	if(wantsToUseFunction){
		// Step 3: Use GPT arguments to call your function
		if(chat.choices[0].message.function_call.name == 'getTimeOfDay'){
			content = getTimeOfDay()
			messages.push(chat.choices[0].message)
			messages.push({
				role: 'function',
				name: 'getTimeOfDay', 
				content,
			})
		}
	}

	
	// Step 4: Call GPT again with the function response
	let step4response = await openai.chat.completions.create({
		model: 'gpt-4-1106-preview',
		messages,
	})
	console.log(step4response.choices[0])
	
}

callGPTWithFunctions()