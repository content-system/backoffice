import { Log, Search, UseCase } from "onecore"
import { DB, Repository, SearchBuilder } from "query-core"
import { Article, ArticleFilter, articleModel, ArticleRepository, ArticleService } from "./article"
import { ArticleController } from "./controller"
import { buildQuery } from "./query"

export * from "./controller"

export class SqlArticleRepository extends Repository<Article, string> implements ArticleRepository {
  constructor(db: DB) {
    super(db, "articles", articleModel)
  }
}
export class ArticleUseCase extends UseCase<Article, string, ArticleFilter> implements ArticleService {
  constructor(search: Search<Article, ArticleFilter>, repository: ArticleRepository) {
    super(search, repository)
  }
}

export function useArticleController(db: DB, log: Log): ArticleController {
  const builder = new SearchBuilder<Article, ArticleFilter>(db.query, "articles", articleModel, db.driver, buildQuery)
  const repository = new SqlArticleRepository(db)
  const service = new ArticleUseCase(builder.search, repository)
  return new ArticleController(service, log)
}
