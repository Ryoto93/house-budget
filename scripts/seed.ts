import { seedData } from '../src/lib/data/seed'

async function main() {
  try {
    await seedData()
    process.exit(0)
  } catch (error) {
    console.error('シードスクリプトエラー:', error)
    process.exit(1)
  }
}

main() 