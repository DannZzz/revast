import { uuid } from 'anytool'

const makeToken = () => uuid(100)

class TokenConstructor {
  private _token: string = makeToken()

  constructor()
  constructor(token: string)
  constructor(token?: string) {
    if (token) this._token = token
  }

  get current() {
    return this._token
  }

  regenerate() {
    this._token = makeToken()
  }

  toString() {
    return this._token
  }

  static newTokenString() {
    return makeToken()
  }
}

export const Token = (token?: string) => new TokenConstructor(token)
export type Token = TokenConstructor
