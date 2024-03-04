import fs from 'fs'
import vox from '../vox.js'

let log = console.log

vox.initPluralisation('de')
let t_file = `../res/${vox.lang}.json`
vox.dex = JSON.parse(fs.readFileSync(t_file));

log(vox._t('Software for editing translations'))
log(vox._t('My name is Skeller'))
log(vox._tc('button', 'Hello'))
log(vox._t2('I have %s apple', 'I have %s apples',1))
log(vox._t2('I have %s apple', 'I have %s apples',2))