import { pipeline, env } from '@xenova/transformers'

let encoder = null
let layoutEmbeddings = null
const LAYOUT_CACHE_KEY = 'layout-embeddings-v1'

function meanPool(data, dims) {
  const [batchSize, seqLen, hiddenSize] = dims
  const result = new Float32Array(batchSize * hiddenSize)
  for (let b = 0; b < batchSize; b++) {
    const offset = b * seqLen * hiddenSize
    for (let j = 0; j < hiddenSize; j++) {
      let sum = 0
      for (let i = 0; i < seqLen; i++) {
        sum += data[offset + i * hiddenSize + j]
      }
      result[b * hiddenSize + j] = sum / seqLen
    }
  }
  return result
}

function normalize(vec) {
  let sum = 0
  for (let i = 0; i < vec.length; i++) sum += vec[i] * vec[i]
  const invNorm = 1 / Math.sqrt(sum)
  for (let i = 0; i < vec.length; i++) vec[i] *= invNorm
  return vec
}

function cosineSim(a, b) {
  let dot = 0
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i]
  return dot
}

async function getEncoder() {
  if (!encoder) {
    env.allowLocalModels = true
    env.localModelPath = '/models/'
    env.allowRemoteModels = false
    encoder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', {
      quantized: true
    })
  }
  return encoder
}

function describeNews(news) {
  const parts = [`Заголовок: "${news.title}"`, `Текст: "${news.text}"`]
  if (news.imageUrl) parts.push('[ИЗОБРАЖЕНИЕ] есть фото')
  if (news.videoUrl) parts.push('[ВИДЕО] есть видеозапись')
  if (news.gallery && news.gallery.length) parts.push(`[ГАЛЕРЕЯ] ${news.gallery.length} фотографий`)
  if (news.quote) parts.push('[ЦИТАТА] есть цитата')
  if (news.rating) parts.push(`[РЕЙТИНГ] ${news.rating}/5`)
  if (news.score) parts.push(`[СЧЁТ] ${news.score}`)
  if (news.tips && news.tips.length) parts.push(`[СПИСОК_СОВЕТОВ] ${news.tips.length} советов`)
  if (news.ingredients && news.ingredients.length) parts.push(`[ИНГРЕДИЕНТЫ] ${news.ingredients.length} ингредиентов`)
  if (news.specs) parts.push('[ТАБЛИЦА] технические характеристики')
  if (news.author) parts.push(`[АВТОР] ${news.author}`)
  if (news.location) parts.push(`[ЛОКАЦИЯ] ${news.location}`)
  if (news.cookTime) parts.push(`[ВРЕМЯ] приготовление ${news.cookTime}`)
  if (news.trend) parts.push(`[ТРЕНД] ${news.trend}`)
  if (news.teams && news.teams.length) parts.push(`[КОМАНДЫ] ${news.teams.join(' vs ')}`)
  if (news.stats) parts.push('[СТАТИСТИКА] таблица с данными')
  if (news.findings && news.findings.length) parts.push(`[ОТКРЫТИЯ] ${news.findings.length} результатов`)
  if (news.price) parts.push(`[ЦЕНА] ${news.price}`)
  if (news.benchmarks && news.benchmarks.length) parts.push(`[ТЕСТЫ] ${news.benchmarks.length} бенчмарков`)
  if (news.curator) parts.push(`[КУРАТОР] ${news.curator}`)
  if (news.tickets) parts.push(`[БИЛЕТЫ] ${news.tickets}`)
  if (news.duration) parts.push(`[ДЛИТЕЛЬНОСТЬ] ${news.duration}`)
  if (news.genre) parts.push(`[ЖАНР] ${news.genre}`)
  if (news.changePercent) parts.push(`[ИЗМЕНЕНИЕ] ${news.changePercent}`)
  if (news.volume) parts.push(`[ОБЪЁМ] ${news.volume}`)
  if (news.indexes && news.indexes.length) parts.push(`[ИНДЕКСЫ] ${news.indexes.join(', ')}`)
  if (news.symptoms && news.symptoms.length) parts.push(`[СИМПТОМЫ] ${news.symptoms.length} симптомов`)
  if (news.severity) parts.push(`[ТЯЖЕСТЬ] ${news.severity}`)
  if (news.recoveryTime) parts.push(`[ВОССТАНОВЛЕНИЕ] ${news.recoveryTime}`)
  if (news.students) parts.push(`[СТУДЕНТЫ] ${news.students}`)
  if (news.level) parts.push(`[УРОВЕНЬ] ${news.level}`)
  if (news.researcher) parts.push(`[ИССЛЕДОВАТЕЛЬ] ${news.researcher}`)
  if (news.institution) parts.push(`[УЧРЕЖДЕНИЕ] ${news.institution}`)
  if (news.temperature) parts.push(`[ТЕМПЕРАТУРА] ${news.temperature}`)
  if (news.condition) parts.push(`[ПОГОДА] ${news.condition}`)
  if (news.wind) parts.push(`[ВЕТЕР] ${news.wind}`)
  if (news.humidity) parts.push(`[ВЛАЖНОСТЬ] ${news.humidity}%`)
  if (news.forecast && news.forecast.length) parts.push(`[ПРОГНОЗ] ${news.forecast.join(', ')}`)
  if (news.difficulty) parts.push(`[СЛОЖНОСТЬ] ${news.difficulty}`)
  if (news.nutrition) parts.push('[ТАБЛИЦА] пищевая ценность')
  if (news.servings) parts.push(`[ПОРЦИИ] ${news.servings}`)
  if (news.calories) parts.push(`[КАЛОРИИ] ${news.calories} ккал`)
  if (news.source) parts.push(`[ИСТОЧНИК] ${news.source}`)
  if (news.parties && news.parties.length) parts.push(`[СТОРОНЫ] ${news.parties.join(', ')}`)
  if (news.votes) parts.push(`[ГОЛОСА] ${news.votes}`)
  if (news.chart) parts.push('[ГРАФИК] диаграмма с данными')
  return parts.join('. ')
}

async function embedBatch(texts) {
  const pipe = await getEncoder()
  const output = await pipe(texts)
  const h = output.dims[2]
  const pooled = meanPool(output.data, output.dims)
  const result = []
  for (let b = 0; b < output.dims[0]; b++) {
    const vec = new Float32Array(h)
    for (let j = 0; j < h; j++) vec[j] = pooled[b * h + j]
    result.push(normalize(vec))
  }
  return result
}

function fieldMatchScore(news, layoutDesc) {
  let score = 0
  const tags = layoutDesc.match(/\[([^\]]+)\]/g) || []
  for (const raw of tags) {
    const tag = raw.slice(1, -1)
    switch (tag) {
      case 'СЧЁТ': score += news.score ? 0.35 : -0.15; break
      case 'ТРЕНД': score += news.trend ? 0.35 : -0.1; break
      case 'ВИДЕО': score += news.videoUrl ? 0.35 : -0.2; break
      case 'ИЗОБРАЖЕНИЕ': score += news.imageUrl ? 0.2 : -0.3; break
      case 'РЕЙТИНГ': score += news.rating ? 0.3 : -0.1; break
      case 'ЦИТАТА': score += news.quote ? 0.35 : -0.15; break
      case 'АВТОР': score += news.author ? 0.3 : -0.1; break
      case 'ГАЛЕРЕЯ': score += (news.gallery && news.gallery.length >= 3) ? 0.4 : -0.2; break
      case 'СПИСОК_СОВЕТОВ': score += (news.tips && news.tips.length) ? 0.4 : -0.15; break
      case 'ТАБЛИЦА': score += (news.specs || news.stats || news.nutrition) ? 0.3 : -0.1; break
      case 'ГРАФИК': score += news.chart ? 0.4 : -0.1; break
      case 'ЛОКАЦИЯ': score += news.location ? 0.3 : -0.1; break
      case 'ИНГРЕДИЕНТЫ': score += (news.ingredients && news.ingredients.length) ? 0.4 : -0.15; break
      case 'ВРЕМЯ': score += news.cookTime ? 0.35 : -0.1; break
    }
  }
  if (/без изображений/i.test(layoutDesc) && news.imageUrl) score -= 0.4
  if (/без видео/i.test(layoutDesc) && news.videoUrl) score -= 0.4
  if (/без галереи/i.test(layoutDesc) && news.gallery) score -= 0.4
  return score
}

export async function preloadModel() {
  const pipe = await getEncoder()
  await pipe(['warmup'])
}

async function getLayoutEmbeddings(layoutDescriptions) {
  if (layoutEmbeddings) return layoutEmbeddings
  const cached = localStorage.getItem(LAYOUT_CACHE_KEY)
  if (cached) {
    layoutEmbeddings = JSON.parse(cached).map(arr => {
      const vec = new Float32Array(arr.length)
      for (let i = 0; i < arr.length; i++) vec[i] = arr[i]
      return normalize(vec)
    })
    return layoutEmbeddings
  }
  layoutEmbeddings = await embedBatch(
    layoutDescriptions.map(d => 'passage: ' + d)
  )
  const serialized = layoutEmbeddings.map(v => Array.from(v))
  localStorage.setItem(LAYOUT_CACHE_KEY, JSON.stringify(serialized))
  return layoutEmbeddings
}

export async function predictLayout(news, layoutDescriptions) {
  await getLayoutEmbeddings(layoutDescriptions)

  const [newsVec] = await embedBatch(['query: ' + describeNews(news)])

  let maxScore = -Infinity
  let maxIdx = 0
  for (let i = 0; i < layoutEmbeddings.length; i++) {
    const aiSim = cosineSim(newsVec, layoutEmbeddings[i])
    const ruleScore = fieldMatchScore(news, layoutDescriptions[i])
    const total = aiSim * 0.6 + ruleScore * 0.4
    if (total > maxScore) {
      maxScore = total
      maxIdx = i
    }
  }
  return maxIdx
}

export async function predictLayoutBatch(newsArray, layoutDescriptions) {
  await getLayoutEmbeddings(layoutDescriptions)

  const newsTexts = newsArray.map(n => 'query: ' + describeNews(n))
  const newsVectors = await embedBatch(newsTexts)

  return newsArray.map((news, i) => {
    const newsVec = newsVectors[i]
    let maxScore = -Infinity
    let maxIdx = 0
    for (let j = 0; j < layoutEmbeddings.length; j++) {
      const aiSim = cosineSim(newsVec, layoutEmbeddings[j])
      const ruleScore = fieldMatchScore(news, layoutDescriptions[j])
      const total = aiSim * 0.6 + ruleScore * 0.4
      if (total > maxScore) {
        maxScore = total
        maxIdx = j
      }
    }
    return maxIdx
  })
}
