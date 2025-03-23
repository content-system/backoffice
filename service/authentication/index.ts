import { Authenticator } from "authen-service"
import { Request, Response } from "express"
import { toMap } from "express-ext"
import { Attributes, StringMap } from "onecore"
import { validate } from "xvalidators"
import { getResource } from "../resources"

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
  constructor(private authenticator: Authenticator<User, string>) {
    this.render = this.render.bind(this)
    this.submit = this.submit.bind(this)
  }
  render(req: Request, res: Response) {
    const resource = getResource(req, res)
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
    const resource = getResource(req, res)
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
      this.authenticator.authenticate(user).then((result) => {
        if (result.status === 1) {
          if (result.user) {
            res.cookie("token", result.user.token, { httpOnly: true, secure: true, sameSite: "strict" })
            console.log("Token " + result.user.token)
          }
          console.log("Login successfully")
          res.redirect("/users")
        } else {
          let key: string | undefined = map["" + result.status]
          const message = key ? resource[key] : resource.fail_authentication
          res.render("signin", { resource, user, message })
        }
      })
    }
  }
}
