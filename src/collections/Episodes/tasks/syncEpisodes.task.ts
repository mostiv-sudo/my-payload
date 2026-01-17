import type { PayloadRequest } from 'payload'
import { episodesSyncKodik } from '../hooks/episodesSyncKodik'

export const runEpisodesSyncKodik = async (req: PayloadRequest) => {
  return episodesSyncKodik(req)
}
