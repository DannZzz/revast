import { Configuration, OpenAIApi } from 'openai'
import config from 'config'

const configuration = new Configuration({
  apiKey: <string>config.get('OPENAI_KEY'),
})
const openai = new OpenAIApi(configuration) //

export const openAiFind = async (prompt: string): Promise<string> => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          content: prompt,
          role: 'user',
        },
      ],
      max_tokens: 2000,
    })
    return completion.data.choices[0]?.message?.content?.slice(0, 2000)
  } catch (e) {
    console.log('OPEN_AI_ERROR', e)
    return "I get an error. I'm sorry, or I don't have time to respond."
  }
}
