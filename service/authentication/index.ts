import { Authenticator, Privilege } from "authen-service"
import { Request, Response } from "express"
import { getView, query, toMap, toString } from "express-ext"
import { Attributes, Log, StringMap } from "onecore"
import { validate } from "xvalidators"
import { buildError, buildError500, getResource, getResourceByLang, queryLang } from "../resources"

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
  constructor(private authenticator: Authenticator<User, string>, private log: Log) {
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
    console.log("user " + JSON.stringify(user))
    const errors = validate<User>(user, userModel, resource, true)
    if (errors.length > 0) {
      console.log("Login error")
      const errorMap = toMap(errors)
      console.log("Errors: " + JSON.stringify(errorMap))
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
            console.log("Login successfully")
            const account = result.user
            if (account) {
              console.log("Token " + account.token)
              res.cookie("token", account.token, { httpOnly: true, secure: true, sameSite: "strict" })
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
            res.render(getView(req, "error"), buildError(res, resource.error_grant_title, resource.error_grant_message, resource))
          } else {
            let key: string | undefined = map["" + result.status]
            const message = key ? resource[key] : resource.fail_authentication
            res.render("signin", { resource, user, message })
          }
        })
        .catch((err) => {
          this.log(toString(err))
          res.render(getView(req, "error"), buildError500(resource, res))
        })
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
