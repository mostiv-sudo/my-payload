import { Payload } from 'payload'

export function makeSlug(str: string): string {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
}

export async function getUniqueSlug(payload: Payload, base: string): Promise<string> {
  let slug = makeSlug(base)
  let i = 1

  while (true) {
    const exists = await payload.find({
      collection: 'anime',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (exists.totalDocs === 0) return slug
    slug = `${makeSlug(base)}-${i++}`
  }
}
