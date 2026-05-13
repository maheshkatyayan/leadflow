import { Low, JSONFile } from 'lowdb'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '..', 'data', 'db.json')

const defaultData = { leads: [], discussions: [] }

const adapter = new JSONFile(dbPath)
export const db = new Low(adapter, defaultData)

export async function initDb() {
  await db.read()
  db.data ||= defaultData
  await db.write()
}
