import config from '../config/evaluation.json'
import { useI18n } from '../i18n/context'
import { Trans } from '../i18n/Trans'
import { LangSwitcher } from '../molecules/LangSwitcher'
import { SavedEvalList } from '../molecules/SavedEvalList'
import { TYPE_ICONS } from '../icons'

const typeDescIds = {
  movie: 'home.typeDesc.movie',
  series: 'home.typeDesc.series',
  game: 'home.typeDesc.game',
}

const seoWhy = [
  { icon: '\u{1F50D}', id: 'seo.why0' },
  { icon: '\u{1F9E0}', id: 'seo.why1' },
  { icon: '\u{1F4AC}', id: 'seo.why2' },
  { icon: '\u{2696}\u{FE0F}', id: 'seo.why3' },
  { icon: '\u{1F3AF}', id: 'seo.why4' },
]

const useCases = [
  { icon: '\u{1F3AC}', title: 'Movie enthusiasts', desc: 'seo.useCase0.desc' },
  { icon: '\u{1F4FA}', title: 'Series binge-watchers', desc: 'seo.useCase1.desc' },
  { icon: '\u{1F3AE}', title: 'Gamers', desc: 'seo.useCase2.desc' },
  { icon: '\u{270D}\u{FE0F}', title: 'Reviewers & creators', desc: 'seo.useCase3.desc' },
]

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
          <button key={key} class="type-card" style={{ viewTransitionName: 'type-' + key }} onClick={() => onSelect(key)}>
            <span class="type-card-icon">{TYPE_ICONS[key]}</span>
            <span class="type-card-label">{t(type.label)}</span>
            <span class="type-card-desc">{t(typeDescIds[key])}</span>
          </button>
        ))}
      </section>

      <SavedEvalList onSelect={onSelect} />

      <section class="seo">
        <h2>{'\u{1F4CA}'} <Trans>What is UPE?</Trans></h2>
        <p>{t('seo.whatText')}</p>

        <h2>{'\u{1F4A1}'} <Trans>Why use a parametric evaluator?</Trans></h2>
        <ul>
          {seoWhy.map(({ icon, id }) => (
            <li key={id}><span class="li-icon">{icon}</span> <strong>{t(id + '.title')}</strong> {'\u2014'} {t(id + '.desc')}</li>
          ))}
        </ul>

        <h2>{'\u{1F465}'} <Trans>Perfect for</Trans></h2>
        <div class="use-cases">
          {useCases.map(({ icon, title, desc }) => (
            <div key={title} class="use-case">
              <h3><span class="uc-icon">{icon}</span> {t(title)}</h3>
              <p>{t(desc)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
