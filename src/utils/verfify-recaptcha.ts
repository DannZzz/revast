import superagent from 'superagent'
import config from 'config'

export const verifyUserRecaptcha = async (token: string): Promise<boolean> => {
  if (process.env.NODE_ENV !== 'production') return true
  try {
    const res = await superagent
      .post('https://www.google.com/recaptcha/api/siteverify')
      .query({
        response: token,
        secret: config.get('RECAPTCHA_SITE_KEY'),
      })
      .set('accept', 'json')

    return res.body.success
  } catch (e) {
    console.log('RECAPTCHA_VERIFY_ERROR', e)
    return null
  }
}
