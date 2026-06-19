import { DB } from "onecore"
import { JobController } from "./controller"
import { SqlJobRepository } from "./repository"
import { JobUseCase } from "./service"
export * from "./controller"

export function useJobController(db: DB): JobController {
  const repository = new SqlJobRepository(db)
  const service = new JobUseCase(repository)
  return new JobController(service)
}
