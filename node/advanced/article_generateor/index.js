import { loadCorpus } from './lib/corpus.js'
import { createRandomPicker } from './lib/random.js'
import { generate } from './lib/generator.js'

const corpus = loadCorpus('./corpus/data.json') // 获取语料库数据

const title = createRandomPicker(corpus.title)()
const article = generate(title, {corpus, min:2000, max:3000})
console.log(title);
console.log(article);



