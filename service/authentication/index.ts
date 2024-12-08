import { Request, Response } from "express"
import { toMap } from "express-ext"
import { Attributes } from "onecore"
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

export class LoginController {
  constructor() {
    this.render = this.render.bind(this)
    this.submit = this.submit.bind(this)
  }
  render(req: Request, res: Response) {
    const resource = getResource()
    res.render("login", {
      resource,
      user: {
        username: "kaka",
        password: "1234",
      },
      message: "Enter login",
    })
  }
  submit(req: Request, res: Response) {
    const resource = getResource()
    const user: User = req.body
    console.log("user " + JSON.stringify(user))
    const errors = validate<User>(user, userModel, resource, true)
    if (errors.length > 0) {
      console.log("Login error")
      const errorMap = toMap(errors)
      console.log("Errors: " + JSON.stringify(errorMap))
      res.render("login", {
        resource,
        user,
        message: "Enter login",
        errors: errorMap,
      })
    } else {
      console.log("Login successfully")
      res.redirect("/users")
    }
  }
}

export function useLoginController(): LoginController {
  return new LoginController()
}
