import * as mongoose from 'mongoose'
import config from 'config'

export const connectMongo = async () => {
  try {
    await mongoose.connect(config.get('MONGO'))
    console.log('MongoDB is connected!')
  } catch (e) {
    console.log('Error at connecting to MONGO', e?.message)
  }
}
