type SupportLanguage = 'en-US' | 'ja' | 'ko' | 'zh-CN' | 'zh-TW'
const supportLanguages: SupportLanguage[] = ['en-US', 'ja', 'ko', 'zh-CN', 'zh-TW']
// type 定義の仕方まだうまくできない。。

interface MakeButtonOptions {
  isAvailable?: boolean
  isCurrentLanguage?: boolean
}

interface Language {
  supportLanguage: SupportLanguage
  options?: MakeButtonOptions
}

const convertLanguage = (htmlLang: string): SupportLanguage => {
  switch (htmlLang) {
    case 'en':
      return 'en-US'
    case 'zh':
      return 'zh-CN'
    default:
      return htmlLang as SupportLanguage
  }
}

const makeButton = ({ supportLanguage, options }: Language): HTMLButtonElement => {
  const button = document.createElement('button')
  button.classList.add('mdn-quick-action')
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
  const existMdnQuickAction = !!document.querySelector('button.mdn-quick-action')
  if (existMdnQuickAction) {
    return
  }

  const currentLanguage = convertLanguage(document.querySelector('html')!.lang)
  const availableLanguages: string[] = Array.from(
    document.querySelector('#language-menu')!.children
  )
    .filter((item) => supportLanguages.includes((item as any).lang))
    .map((item) => (item as any).lang)

  const buttons: HTMLButtonElement[] = supportLanguages
    .map(
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
    )
    .map((language) => makeButton(language))

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
