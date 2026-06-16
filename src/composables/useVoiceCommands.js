const COMMANDS = [
  {
    patterns: [/тёмн(?:ая|ый|ую|ого|ому).*тем(?:а|у|ой)/i, /ночн(?:ая|ой|ую|ого).*тем(?:а|у|ой)/i, /тёмн.*режим/i, /ночн.*режим/i],
    action: 'dark-mode',
    reply: 'Переключаю на тёмную тему'
  },
  {
    patterns: [/светл(?:ая|ый|ую|ого|ому).*тем(?:а|у|ой)/i, /дневн(?:ая|ой|ую|ого).*тем(?:а|у|ой)/i, /светл.*режим/i, /дневн.*режим/i],
    action: 'light-mode',
    reply: 'Переключаю на светлую тему'
  },
  {
    patterns: [/переключ(?:и|ить).*тем(?:а|у|ой)/i, /смен(?:и|ить).*тем(?:а|у|ой)/i, /поменя(?:й|ть).*тем(?:а|у|ой)/i],
    action: 'toggle-theme',
    reply: 'Переключаю тему'
  },
  {
    patterns: [/покаж(?:и|ить).*новост/i, /лент[ау].*новост/i, /открой.*лент/i],
    action: 'switch-to-feed',
    reply: 'Открываю ленту новостей'
  },
  {
    patterns: [/верн(?:и|ись).*чат/i, /открой.*чат/i, /покаж(?:и|ить).*чат/i],
    action: 'switch-to-chat',
    reply: 'Возвращаюсь в чат'
  }
]

export function useVoiceCommands() {
  function matchCommand(text) {
    for (const cmd of COMMANDS) {
      for (const pattern of cmd.patterns) {
        if (pattern.test(text)) {
          return { action: cmd.action, reply: cmd.reply }
        }
      }
    }
    return null
  }

  return { matchCommand, commands: COMMANDS }
}
