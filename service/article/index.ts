import { Log, UseCase } from "onecore"
import { DB, Repository } from "query-core"
import { Article, ArticleFilter, articleModel, ArticleRepository, ArticleService } from "./article"
import { ArticleController } from "./controller"
import { buildQuery } from "./query"

export * from "./controller"

export class SqlArticleRepository extends Repository<Article, string, ArticleFilter> implements ArticleRepository {
  constructor(db: DB) {
    super(db, "articles", articleModel, buildQuery)
  }
}
export class ArticleUseCase extends UseCase<Article, string, ArticleFilter> implements ArticleService {
  constructor(repository: ArticleRepository) {
    super(repository)
  }
}

export function useArticleController(db: DB, log: Log): ArticleController {
  const repository = new SqlArticleRepository(db)
  const service = new ArticleUseCase(repository)
  return new ArticleController(service, log)
}
