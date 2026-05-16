import config from '../config/evaluation.json'
import { useI18n } from '../i18n/context'
import { Trans } from '../i18n/Trans'
import { LangSwitcher } from '../molecules/LangSwitcher'

const icons = { movie: '\u{1F3AC}', series: '\u{1F4FA}', game: '\u{1F3AE}' }

const typeDescIds = {
  movie: 'home.typeDesc.movie',
  series: 'home.typeDesc.series',
  game: 'home.typeDesc.game',
}

const seoWhyIds = ['seo.why0', 'seo.why1', 'seo.why2', 'seo.why3', 'seo.why4']

const useCaseIcons = ['\u{1F3AC}', '\u{1F4FA}', '\u{1F3AE}', '\u{270D}\u{FE0F}']
const useCaseTitles = ['Movie enthusiasts', 'Series binge-watchers', 'Gamers', 'Reviewers & creators']
const useCaseDescIds = ['seo.useCase0.desc', 'seo.useCase1.desc', 'seo.useCase2.desc', 'seo.useCase3.desc']

export function HomePage({ onSelect }) {
  const { t } = useI18n()

  return (
    <div class="home-page">
      <section class="hero">
        <div class="hero-lang">
          <LangSwitcher />
        </div>
        <h1 class="hero-title">
          <span class="hero-highlight">UPE</span>
        </h1>
        <p class="hero-sub"><Trans>Universal Parametric Evaluator</Trans></p>
        <p class="hero-desc">{t('home.desc')}</p>
      </section>

      <section class="type-cards">
        {Object.entries(config.types).map(([key, type]) => (
          <button key={key} class="type-card" onClick={() => onSelect(key)}>
            <span class="type-card-icon">{icons[key]}</span>
            <span class="type-card-label">{t(type.label)}</span>
            <span class="type-card-desc">{t(typeDescIds[key])}</span>
          </button>
        ))}
      </section>

      <section class="seo">
        <h2>{'\u{1F4CA}'} <Trans>What is UPE?</Trans></h2>
        <p>{t('seo.whatText')}</p>

        <h2>{'\u{1F4A1}'} <Trans>Why use a parametric evaluator?</Trans></h2>
        <ul>
          {seoWhyIds.map((id, i) => (
            <li key={i}><span class="li-icon">{['\u{1F50D}', '\u{1F9E0}', '\u{1F4AC}', '\u{2696}\u{FE0F}', '\u{1F3AF}'][i]}</span> <strong>{t(id + '.title')}</strong> {'\u2014'} {t(id + '.desc')}</li>
          ))}
        </ul>

        <h2>{'\u{1F465}'} <Trans>Perfect for</Trans></h2>
        <div class="use-cases">
          {useCaseTitles.map((title, i) => (
            <div key={i} class="use-case">
              <h3><span class="uc-icon">{useCaseIcons[i]}</span> {t(title)}</h3>
              <p>{t(useCaseDescIds[i])}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
