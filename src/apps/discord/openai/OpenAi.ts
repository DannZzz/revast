import { Configuration, OpenAIApi } from 'openai'
import config from 'config'

const configuration = new Configuration({
  apiKey: <string>config.get('OPENAI_KEY'),
})
const openai = new OpenAIApi(configuration) //

export const openAiFind = async (prompt: string): Promise<string> => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0301',
      messages: [
        {
          content: prompt,
          role: 'user',
        },
      ],
    })
    return completion.data.choices[0]?.message?.content
  } catch (e) {
    console.log('OPEN_AI ERROR', e)
    return 'Я получаю ошибку извините, либо не успеваю вам отвечать..'
  }
}
