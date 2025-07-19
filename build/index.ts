import fs from "fs"

export function mergeFiles(newFile: string, files: string[], prettier?: boolean) {
  const arr: string[] = []
  for (let i = 0; i < files.length; i++) {
    const data = fs.readFileSync(files[i], "utf8")
    arr.push(data)
  }
  let outData = arr.join("\n")
  if (prettier) {
    outData = replaceFourSpaces(outData)
  }
  fs.writeFile(newFile, outData, function (err) {
    if (err) {
      return console.log(err)
    }
    console.log("The file was saved: " + newFile)
  })
}

function replaceFourSpaces(input: string): string {
  input = input.replace(/ {4}/g, "  ")
  input = input.replace(/"use strict";/g, "")
  return input
}

export function buildJavascript() {
  const desFile = "./es5/client/script.js"
  // const files: string[] = ["./es6/client/ui.js", "./es6/client/validator.js", "./es6/client/index.js", "./es6/client/search.js"]
  // const files: string[] = ["./es5/client/ui.js", "./es5/client/validator.js", "./es5/client/index.js", "./es5/client/search.js"]
  const files: string[] = ["./es5/client/ui.js", "./es5/client/validator.js", "./es5/client/form.js", "./es5/client/index.js", "./es5/client/layout.js"]
  mergeFiles(desFile, files, true)
}

export function buildCSS() {
  const desFile = "./public/css/style.css"
  const files: string[] = [
    "./public/css/reset.css",
    "./public/css/checkbox.css",
    "./public/css/radio.css",
    "./public/css/grid.css",
    "./public/css/alert.css",
    "./public/css/loader.css",
    "./public/css/page.css",
    "./public/css/main.css",
    "./public/css/form.css",
    "./public/css/list-view.css",
    "./public/css/solid-container.css",
    "./public/css/table.css",
    "./public/css/list-detail.css",
    "./public/css/data-list.css",
    "./public/css/button.css",
    "./public/css/search.css",
    "./public/css/layout.css",
    "./public/css/modal.css",
    "./public/css/navigation.css",
    "./public/css/pagination.css",
    "./public/css/group.css",
    "./public/css/theme.css",
    "./public/css/dark.css",
    "./public/css/grey.css",
    "./public/css/grey-dark.css",
  ]
  mergeFiles(desFile, files)
}
