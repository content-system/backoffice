import { Request, Response } from "express"
import {
  buildError500,
  buildMessage,
  buildPages,
  buildPageSearch,
  buildSortSearch,
  cloneFilter,
  escapeArray,
  fromRequest,
  getSearch,
  getView,
  handleError,
  hasSearch,
  queryLimit,
  queryPage,
  resources,
  toString,
} from "express-ext"
import { Attribute, Log, Result, Search, SearchResult, StringMap } from "onecore"
import { buildMap, buildToInsert, buildToUpdate, DB, metadata, SearchBuilder } from "query-core"
import { formatDateTime } from "ui-formatter"
import { getDateFormat, getLang, getResource } from "../resources"
import { Content, ContentFilter, contentModel, ContentRepository, ContentService } from "./content"
export * from "./content"

export class SqlContentRepository implements ContentRepository {
  constructor(protected db: DB) {
    const meta = metadata(contentModel)
    this.primaryKeys = meta.keys
    this.map = buildMap(contentModel)
  }
  map?: StringMap
  primaryKeys: Attribute[]
  load(id: string, lang: string): Promise<Content | null> {
    return this.db.query<Content>("select * from contents where id = $1 and lang = $2", [id, lang], this.map).then((contents) => {
      return !contents || contents.length === 0 ? null : contents[0]
    })
  }
  create(content: Content): Promise<number> {
    const stmt = buildToInsert(content, "contents", contentModel, this.db.param)
    if (!stmt) {
      return Promise.resolve(-1)
    }
    return this.db.exec(stmt.query, stmt.params)
  }
  update(content: Content): Promise<number> {
    const stmt = buildToUpdate(content, "contents", contentModel, this.db.param)
    if (!stmt) {
      return Promise.resolve(-1)
    }
    return this.db.exec(stmt.query, stmt.params)
  }
  patch(content: Partial<Content>): Promise<number> {
    return this.update(content as Content)
  }
  delete(id: string, lang: string): Promise<number> {
    return this.db.exec("delete from contents where id = $1 and lang = $2", [id, lang])
  }
}

export class ContentUseCase implements ContentService {
  constructor(private find: Search<Content, ContentFilter>, private repository: ContentRepository) {}
  search(filter: ContentFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Content>> {
    return this.find(filter, limit, page, fields)
  }
  load(id: string, lang: string): Promise<Content | null> {
    return this.repository.load(id, lang)
  }
  create(content: Content): Promise<Result<Content>> {
    return this.repository.create(content)
  }
  update(content: Content): Promise<Result<Content>> {
    return this.repository.update(content)
  }
  patch(content: Partial<Content>): Promise<Result<Content>> {
    return this.repository.patch(content)
  }
  delete(id: string, lang: string): Promise<number> {
    return this.repository.delete(id, lang)
  }
}

const fields = ["title", "publishedAt", "description"]
export class ContentController {
  constructor(private log: Log, private service: ContentService) {
    this.search = this.search.bind(this)
    this.load = this.load.bind(this)
  }
  search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    let filter: ContentFilter = {
      limit: resources.defaultLimit,
      // title: "Java",
    }
    if (hasSearch(req)) {
      filter = fromRequest<ContentFilter>(req)
      format(filter, ["publishedAt"])
    }
    const page = queryPage(req, filter)
    const limit = queryLimit(req)
    this.service
      .search(cloneFilter(filter, limit, page), limit, page)
      .then((result) => {
        const list = escapeArray(result.list)
        for (const item of list) {
          item.publishedAt = formatDateTime(item.publishedAt, dateFormat)
        }
        const search = getSearch(req.url)
        res.render(getView(req, "contents"), {
          resource,
          limits: resources.limits,
          filter,
          list,
          pages: buildPages(limit, result.total),
          pageSearch: buildPageSearch(search),
          sort: buildSortSearch(search, fields, filter.sort),
          message: buildMessage(resource, list, limit, page, result.total),
        })
      })
      .catch((err) => {
        this.log(toString(err))
        res.render(getView(req, "error"), buildError500(resource, res))
      })
  }
  load(req: Request, res: Response) {
    const id = req.params["id"]
    const lang = req.params["lang"]
    if (!id || !lang) {
      res.status(400).json({ error: "id and lang are required" }).end()
      return
    }
    this.service
      .load(id, lang)
      .then((content) => {
        if (!content) {
          res.status(404).end()
        } else {
          res.status(200).json(content).end()
        }
      })
      .catch((err) => handleError(err, res, this.log))
  }
}

export function useContentController(log: Log, db: DB): ContentController {
  const builder = new SearchBuilder<Content, ContentFilter>(db.query, "contents", contentModel, db.driver)
  const repository = new SqlContentRepository(db)
  const service = new ContentUseCase(builder.search, repository)
  return new ContentController(log, service)
}
