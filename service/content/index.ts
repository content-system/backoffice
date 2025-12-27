import { Log, Result, SearchUseCase, StringMap } from "onecore"
import { buildMap, DB, SqlSearchWriter } from "query-core"
import { Content, ContentFilter, contentModel, ContentRepository, ContentService } from "./content"
import { ContentController } from "./controller"

export * from "./controller"

export class SqlContentRepository extends SqlSearchWriter<Content, ContentFilter> implements ContentRepository {
  constructor(protected db: DB) {
    super(db, "contents", contentModel)
    this.map = buildMap(contentModel)
  }
  map?: StringMap
  load(id: string, lang: string): Promise<Content | null> {
    return this.db.query<Content>(`select * from contents where id = ${this.db.param(1)} and lang = ${this.db.param(2)}`, [id, lang], this.map).then((contents) => {
      return !contents || contents.length === 0 ? null : contents[0]
    })
  }
  delete(id: string, lang: string): Promise<number> {
    return this.db.exec(`delete from contents where id = ${this.db.param(1)} and lang = ${this.db.param(2)}`, [id, lang])
  }
}

export class ContentUseCase extends SearchUseCase<Content, ContentFilter> implements ContentService {
  constructor(protected repository: ContentRepository) {
    super(repository)
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

export function useContentController(db: DB, log: Log): ContentController {
  const repository = new SqlContentRepository(db)
  const service = new ContentUseCase(repository)
  return new ContentController(service, log)
}
