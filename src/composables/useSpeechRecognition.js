import { ref, onUnmounted } from 'vue'

export function useSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const isSupported = ref(!!SpeechRecognition)
  const isListening = ref(false)
  const interimText = ref('')
  const finalText = ref('')
  const error = ref('')
  const diagnosticInfo = ref(null)

  let recognition = null
  let retriesLeft = 0
  let diagTimer = null

  function getErrorMessage(eventError) {
    switch (eventError) {
      case 'not-allowed':
        return 'Нет доступа к микрофону. Разрешите доступ в настройках браузера'
      case 'no-speech':
        return 'Речь не распознана. Попробуйте ещё раз'
      case 'network':
        if (window.location.protocol === 'file:') {
          return 'Голосовой ввод не работает при открытии файла. Используйте http://localhost'
        }
        return 'Не удалось соединиться с сервером распознавания речи.\n' +
          'Проверьте подключение к интернету и AdBlock'
      case 'aborted':
        return ''
      default:
        return `Ошибка: ${eventError}`
    }
  }

  async function checkGoogleReachable() {
    try {
      const controller = new AbortController()
      const id = setTimeout(() => controller.abort(), 5000)
      await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        signal: controller.signal
      })
      clearTimeout(id)
      return { reachable: true, message: 'google.com доступен' }
    } catch {
      return { reachable: false, message: 'google.com НЕ доступен. Проверьте VPN, прокси или корпоративный файрвол' }
    }
  }

  async function diagnose() {
    const results = []

    if (window.location.protocol === 'file:') {
      results.push('❌ Открыто как file:// — Speech Recognition не работает через file:// протокол')
    } else {
      results.push(`✅ Протокол: ${window.location.protocol}`)
    }

    if (window.location.protocol === 'https:' || window.location.protocol === 'http:') {
      results.push(`✅ Хост: ${window.location.hostname}`)
    }

    try {
      const mics = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = mics.filter(d => d.kind === 'audioinput')
      if (audioInputs.length === 0) {
        results.push('❌ Микрофон не найден. Подключите микрофон')
      } else {
        results.push(`✅ Микрофон: ${audioInputs.length} найден(о)`)
      }
    } catch {
      results.push('❌ Нет доступа к списку устройств')
    }

    if (!SpeechRecognition) {
      results.push('❌ Web Speech API не поддерживается')
    } else {
      results.push('✅ Web Speech API доступен')
    }

    try {
      const perm = await navigator.permissions.query({ name: 'microphone' })
      results.push(perm.state === 'granted'
        ? '✅ Доступ к микрофону разрешён'
        : perm.state === 'denied'
        ? '❌ Доступ к микрофону запрещён в настройках браузера'
        : '⚠️ Разрешение микрофона: ' + perm.state)
    } catch {
      // permissions API может не поддерживаться
    }

    const google = await checkGoogleReachable()
    results.push(google.reachable
      ? '✅ ' + google.message
      : '❌ ' + google.message)

    if (window !== window.top) {
      results.push('⚠️ Страница открыта в iframe — Speech Recognition может не работать')
    }

    diagnosticInfo.value = results
    return results
  }

  function start() {
    if (!SpeechRecognition) {
      error.value = 'Голосовой ввод не поддерживается в этом браузере'
      return
    }

    interimText.value = ''
    finalText.value = ''
    error.value = ''

    if (recognition) {
      try { recognition.abort() } catch {}
    }

    recognition = new SpeechRecognition()
    recognition.lang = 'ru-RU'
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }
      if (final) finalText.value = final
      interimText.value = interim
    }

    recognition.onerror = (event) => {
      if (event.error === 'network' && retriesLeft > 0 && !error.value) {
        retriesLeft--
        const delay = (3 - retriesLeft) * 1500
        setTimeout(() => start(), delay)
        return
      }
      if (event.error === 'no-speech' && !error.value) {
        error.value = getErrorMessage(event.error)
      }
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        error.value = getErrorMessage(event.error)
      }
      isListening.value = false
    }

    recognition.onend = () => {
      isListening.value = false
    }

    isListening.value = true
    try {
      recognition.start()
    } catch (e) {
      error.value = 'Ошибка запуска: ' + e.message
      isListening.value = false
    }
  }

  function stop() {
    retriesLeft = 0
    if (recognition) {
      try { recognition.stop() } catch {}
      isListening.value = false
    }
  }

  function retry() {
    retriesLeft = 3
    error.value = ''
    start()
  }

  function clearError() {
    error.value = ''
    diagnosticInfo.value = null
  }

  onUnmounted(() => {
    if (recognition) recognition.abort()
  })

  return { isSupported, isListening, interimText, finalText, error, diagnosticInfo, start, stop, retry, diagnose, clearError }
}
