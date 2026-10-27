import 'dotenv/config'
import {readdir,readFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {uploadBuffer,cloudResource} from './cloudinaryStorage.js'
const folder=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../uploads')
const files=(await readdir(folder)).filter(f=>cloudResource(f))
console.log(`Found ${files.length} eligible files. Existing files in Cloudinary will not be overwritten.`)
if(!process.argv.includes('--upload')){
 console.log('Dry run only. Run: npm run migrate-uploads -- --upload')
 process.exit(0)
}
for(const name of files){
 try{await uploadBuffer(await readFile(path.join(folder,name)),name);console.log('Uploaded:',name)}
 catch(e){console.error('FAILED:',name,e.message);process.exitCode=1}
}
