import { Log, Search, UseCase } from "onecore"
import { DB, Repository, SearchBuilder } from "query-core"
import { Contact, ContactFilter, contactModel, ContactRepository, ContactService } from "./contact"
import { ContactController } from "./controller"

export * from "./controller"

export class SqlContactRepository extends Repository<Contact, string> implements ContactRepository {
  constructor(db: DB) {
    super(db, "contacts", contactModel)
  }
}
export class ContactUseCase extends UseCase<Contact, string, ContactFilter> implements ContactService {
  constructor(search: Search<Contact, ContactFilter>, repository: ContactRepository) {
    super(search, repository)
  }
}

export function useContactController(db: DB, log: Log): ContactController {
  const builder = new SearchBuilder<Contact, ContactFilter>(db.query, "contacts", contactModel, db.driver)
  const repository = new SqlContactRepository(db)
  const service = new ContactUseCase(builder.search, repository)
  return new ContactController(service, log)
}
