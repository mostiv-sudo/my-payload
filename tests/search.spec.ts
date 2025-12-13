import { test, expect } from '@playwright/test'

test('anime search returns results', async ({ request }) => {
  const res = await request.get('/api/search?where[searchTitle][like]=naruto')

  expect(res.ok()).toBeTruthy()

  const json = await res.json()

  expect(json.docs.length).toBeGreaterThan(0)
  expect(json.docs[0]).toHaveProperty('searchTitle')
  expect(json.docs[0].doc.relationTo).toBe('anime')
})
