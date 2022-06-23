import fs from 'fs'
import path from 'path'
import { getDB, getBody, sendResponse } from './utils.js'
import { env } from 'node-blox-sdk'

// Init enviroment
env.init()

/**
 * Add todo request hanlder
 * @param {*} req
 * @param {*} res
 */
const addTodoFunc = async (req, res) => {
  try {
    // health check
    if (req.params['health'] === 'health') {
      return sendResponse(res, 200, {
        success: true,
        msg: 'Health check success',
      })
    }

    const DB_FILE = path.resolve(process.env.DB_FILE_PATH)
    const inmemDB = getDB(DB_FILE)
    const newId = new Date().getTime()
    const newItem = await getBody(req)
    const newEntry = { id: newId, item: newItem }
    console.log('Request to add -', newItem)
    inmemDB.push(newEntry)
    fs.writeFileSync(DB_FILE, JSON.stringify(inmemDB))
    console.log('Updated DB:\n', inmemDB)
    console.log('\n')
    sendResponse(res, 200, newEntry || '[]')
  } catch (e) {
    console.log(e)
    sendResponse(res, 500, { status: 'failed', errMsg: e.message })
  }
}

export default addTodoFunc

