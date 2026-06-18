const BASE_URL = 'http://localhost:8000'

export async function checkStatus() {
  const res = await fetch(`${BASE_URL}/`)
  if (!res.ok) throw new Error('Backend unavailable')
  return res.json()
}

export async function fetchNews() {
  const res = await fetch(`${BASE_URL}/api/v1/news`)
  if (!res.ok) throw new Error('Failed to fetch news')
  return res.json()
}

function extFromMime(mime) {
  if (mime.includes('ogg')) return 'ogg'
  if (mime.includes('mp4') || mime.includes('m4a')) return 'm4a'
  if (mime.includes('mpeg') || mime.includes('mp3')) return 'mp3'
  if (mime.includes('wav')) return 'wav'
  return 'webm'
}

export async function voiceQuery(audioBlob) {
  const formData = new FormData()
  const ext = extFromMime(audioBlob.type)
  formData.append('file', audioBlob, `recording.${ext}`)
  const res = await fetch(`${BASE_URL}/api/v1/voice-query`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Voice query failed')
  return res.json()
}
