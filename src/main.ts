type LanguageType = 'en-US' | 'ja' | 'ko'

// TODO: popup 에서 바꿀 수 있게 하기
const configuredLanguages = ['en-US', 'ja', 'ko']
const isLanguageType = (lang: string): lang is LanguageType => {
  return configuredLanguages.includes(lang)
}

interface MakeButtonDataSet {
  value: LanguageType
  options: {
    isAvailable?: boolean
    isSelected?: boolean
  }
}

const buildMakeButtonDataSet = (
  selectedLanguage: string,
  availableLanguages: LanguageType[],
  item: LanguageType
): MakeButtonDataSet => {
  if (item === selectedLanguage) {
    return {
      value: item,
      options: { isSelected: true }
    }
  }

  return {
    value: item,
    options: { isAvailable: availableLanguages.includes(item) }
  }
}

const makeButton = ({ value, options }: MakeButtonDataSet): HTMLButtonElement => {
  const $button = document.createElement('button')
  $button.textContent = value
  $button.style.marginRight = '0.5rem'
  $button.classList.add('simple-language-selector')
  if (options?.isSelected) {
    $button.classList.add('current-language')
    return $button
  }

  if (!options?.isAvailable) {
    $button.disabled = true
    return $button
  }

  $button.addEventListener('click', () => {
    const replacedPath = document.location.pathname.replace(/\/[a-zA-z-]+\//, `/${value}/`)
    document.location.href = replacedPath
  })

  return $button
}

const [, selectedLanguage] = location.pathname.split('/')
const availableLanguages: LanguageType[] = Array.from(
  document.querySelector('#language-selector') as HTMLSelectElement
)
  .map((item) => {
    const value = (item as HTMLOptionElement).value
    if (!isLanguageType(value)) return null

    return value
  })
  .reduce((acc: LanguageType[], cur: LanguageType | null) => {
    if (cur === null) return acc

    return [...acc, cur]
  }, [])

const buttons: HTMLButtonElement[] = configuredLanguages
  .map((item) => {
    // TODO: typeGuard 를 여기서 꼭 해야되는지..😵
    if (!isLanguageType(item)) {
      throw new Error('not expected type')
    }

    return buildMakeButtonDataSet(selectedLanguage, availableLanguages, item)
  })
  .map((parameters) => makeButton(parameters))

const $parent = document.querySelector('.breadcrumb-locale-container')
const [_$originalBreadcrumb, $originalLocaleChanger] = Array.from($parent?.childNodes!)
const buttonsContainer = document.createElement('div')
buttonsContainer.classList.add('simple-language-selector-container')
buttonsContainer.style.margin = '0 0 0 auto'

for (const button of buttons) {
  buttonsContainer.appendChild(button)
}
$parent?.replaceChild(buttonsContainer, $originalLocaleChanger)
