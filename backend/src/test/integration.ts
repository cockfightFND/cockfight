import  path from 'path'
import { startBot } from 'main'
import {
  BettingEntity,
  StateEntity,
  getDB,
  initORM,
} from 'orm'
import { publishL1Contracts } from './utils/PublishL1'

async function setup() {
  Promise.all([
    await publishL1Contracts(path.join(__dirname, 'bin')),
  ])
  console.log('contracts published')
}

async function setDB() {
  const [db] = getDB()
  
  await db.getRepository(BettingEntity).clear()
  await db.getRepository(StateEntity).clear()
}

async function main() {
  try {
    await initORM()
    await setup()
    await setDB()
    await startBot()
  } catch (err) {
    console.log(err)
  }
}

if (require.main === module) {
  main()
}
