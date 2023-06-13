import { Configuration, OpenAIApi } from 'openai'
import config from 'config'
import { translate } from 'bing-translate-api'

const configuration = new Configuration({
  apiKey: <string>config.get('OPENAI_KEY'),
})
const openai = new OpenAIApi(configuration) //

export const openAiFind = async (prompt: string): Promise<string> => {
  try {
    const toEng = await translate(prompt, null, 'en')
    console.log('тоенг', toEng.translation)
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          content: toEng.translation,
          role: 'user',
        },
      ],
    })
    return (
      await translate(completion.data.choices[0]?.message?.content, null, 'ru')
    ).translation
  } catch (e) {
    console.log('OPEN_AI ERROR', e)
    return 'Я получаю ошибку извините..'
  }
}
