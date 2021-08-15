// type SupportLanguage = 'en-US' | 'ja' | 'ko'
enum SupportLanguage {
  EN = 'en-US',
  JA = 'ja',
  KO = 'ko'
}
const SupportLanguages = Object.entries(SupportLanguage).map(([_, l]) => l)
const isSupportedLanguage = (lang: any): lang is SupportLanguage => {
  return SupportLanguages.includes(lang)
}

// type SupportLanguage = 'en-US' | 'ja' | 'ko' | 'zh-CN' | 'zh-TW'
// const supportLanguages: SupportLanguage[] = ['en-US', 'ja', 'ko']
// const supportLanguages: SupportLanguage[] = ['en-US', 'ja', 'ko', 'zh-CN', 'zh-TW']

// type 定義の仕方まだうまくできない。。
interface MakeButtonOptions {
  isAvailable?: boolean
  isCurrentLanguage?: boolean
}

interface Language {
  supportLanguage: SupportLanguage
  options?: MakeButtonOptions
}

const makeButton = ({ supportLanguage, options }: Language): HTMLButtonElement => {
  const button = document.createElement('button')
  button.classList.add('simple-language-selector')
  button.textContent = supportLanguage
  button.style.marginRight = '0.5rem'
  if (options?.isCurrentLanguage) {
    button.classList.add('current-language')
    return button
  }

  if (!options?.isAvailable) {
    button.disabled = true
    return button
  }

  if (options?.isAvailable) {
    button.addEventListener('click', () => {
      const replacedPath = document.location.pathname.replace(
        /\/[a-zA-z-]+\//,
        `/${supportLanguage}/`
      )
      console.log(replacedPath)

      document.location.href = replacedPath
    })
  }
  return button
}

window.setInterval(() => {
  const existSimpleLanguageSelector = !!document.querySelector('button.simple-language-selector')
  if (existSimpleLanguageSelector) {
    return
  }

  const [, currentLanguage] = location.pathname.split('/')
  const collection = document.querySelector('#language-menu')?.children ?? new HTMLCollection()
  const availableLanguages: SupportLanguage[] = Array.from(collection)
    .map((item) => {
      const lang = item.lang
      if (isSupportedLanguage(lang)) return lang
      return null
    })
    .reduce((ary: SupportLanguage[], lang: SupportLanguage | null) => {
      if (lang) return [lang].concat(ary)
      return ary
    }, [])

  const buttons: HTMLButtonElement[] = SupportLanguages.map(
    (supportLanguage): Language => {
      if (supportLanguage === currentLanguage) {
        return {
          supportLanguage,
          options: {
            isCurrentLanguage: true
          }
        }
      }

      if (!availableLanguages.includes(supportLanguage)) {
        return {
          supportLanguage,
          options: {
            isAvailable: false
          }
        }
      }

      return {
        supportLanguage,
        options: {
          isAvailable: true
        }
      }
    }
  ).map((language) => makeButton(language))

  const parent = document.querySelector('.dropdown-container')?.parentNode
  const refChild = parent?.childNodes[1]
  buttons.forEach((button) => {
    if (refChild) {
      parent?.insertBefore(button, refChild)
    }
  })
  if (refChild) {
    parent?.removeChild(refChild)
  }
}, 1000)
