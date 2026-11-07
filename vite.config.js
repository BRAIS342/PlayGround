import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const appUrlPath = process.env.OPENCODE_WEB_DIR
  ? join(process.env.OPENCODE_WEB_DIR, 'app-url')
  : ''
const publicUrl = process.env.APP_URL || (appUrlPath && existsSync(appUrlPath)
  ? readFileSync(appUrlPath, 'utf8').trim()
  : '')
const publicHost = publicUrl ? new URL(publicUrl).hostname : null

export default {
  preview: {
    allowedHosts: publicHost ? [publicHost] : []
  }
}
