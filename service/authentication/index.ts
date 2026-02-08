import { Authenticator, Privilege } from "authen-service"
import { Request, Response } from "express"
import { buildError, getView, query, queryLang, toMap } from "express-ext"
import * as jsonwebtoken from "jsonwebtoken"
import { Attributes, StringMap } from "onecore"
import { validate } from "xvalidators"
import { getResource, getResourceByLang } from "../resources"
import { renderError500 } from "../template"

export const userModel: Attributes = {
  username: {
    required: true,
    length: 100,
  },
  password: {
    required: true,
    length: 100,
  },
}
export interface User {
  username: string
  password: string
}

export const map: StringMap = {
  "2": "fail_authentication",
  "3": "fail_expired_password",
  "4": "fail_locked_account",
  "9": "fail_disabled_account",
}
export class LoginController {
  constructor(private authenticator: Authenticator<User, string>, private secret: string, private expiresIn: number) {
    this.render = this.render.bind(this)
    this.submit = this.submit.bind(this)
  }
  render(req: Request, res: Response) {
    const lang = queryLang(req)
    const resource = getResource(lang)
    res.render("signin", {
      resource,
      user: {
        username: "kaka",
        password: "Password1!",
      },
      message: "Enter login",
    })
  }
  submit(req: Request, res: Response) {
    const lang = queryLang(req)
    let resource = getResource(lang)
    const user: User = req.body
    const errors = validate<User>(user, userModel, resource, true)
    if (errors.length > 0) {
      const errorMap = toMap(errors)
      res.render("signin", {
        resource,
        user,
        message: errors[0].message,
        errors: errorMap,
      })
    } else {
      this.authenticator
        .authenticate(user)
        .then((result) => {
          if (result.status === 1) {
            const account = result.user
            if (account) {
              const token = jsonwebtoken.sign({ id: account.id, user: user.username, lang: account.language, dateFormat: account.dateFormat }, this.secret, {
                expiresIn: this.expiresIn,
              })
              res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" })
              const redirectUrl = query(req, "redirectUrl")
              if (redirectUrl && redirectUrl.length > 0) {
                res.redirect(redirectUrl)
                return
              } else {
                const privileges = account.privileges
                if (privileges && privileges.length > 0) {
                  const firstPath = getFirstPath(privileges)
                  if (firstPath) {
                    res.redirect(firstPath)
                    return
                  }
                } else if (account.language && account.language.length > 0) {
                  resource = getResourceByLang(account.language)
                }
              }
            }
            res.render(getView(req, "error"), buildError(res, resource.error_grant_title, resource.error_grant_message))
          } else {
            let key: string | undefined = map["" + result.status]
            const message = key ? resource[key] : resource.fail_authentication
            res.render("signin", { resource, user, message })
          }
        })
        .catch((err) => renderError500(req, res, resource, err))
    }
  }
}

function getFirstPath(items: Privilege[]): string | undefined {
  for (let i = 0; i < items.length; i++) {
    const children = items[i].children
    if (children && children.length > 0) {
      return getFirstPath(children)
    } else {
      if (items[i].path) {
        return items[i].path
      }
    }
  }
  return undefined
}
