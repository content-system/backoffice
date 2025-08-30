import { Statement } from "query-core";
import { ArticleFilter } from "./article";

export function buildQuery(filter: ArticleFilter): Statement {
  let query = `select * from articles `;
  const where = [];
  const params = [];
  let i = 1;

  if (filter.tags && filter.tags.length > 0) {
    params.push(filter.tags);
    where.push(`tags && $${i++}`);
  }

  if (filter.publishedAt) {
    if (filter.publishedAt.min) {
      where.push(`published_at >= $${i++}`);
      params.push(filter.publishedAt.min);
    }

    if (filter.publishedAt.max) {
      where.push(`published_at <= $${i++}`);
      params.push(filter.publishedAt.max);
    }
  }

  if (filter.id && filter.id.length > 0) {
    where.push(`id = $${i++}`);
    params.push(filter.id);
  }

  if (filter.q && filter.q.length > 0) {
    const q = "%" + filter.q.replace(/%/g, "\\%").replace(/_/g, "\\_") + "%";
    where.push(`(title ilike $${i++} or description ilike $${i++})`);
    params.push(q);
  }

  if (where.length > 0) {
    query = query + ` where ` + where.join(` and `);
  }

  console.log(query);
  return { query, params };
}
