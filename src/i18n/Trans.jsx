import { useI18n } from './context'

export function Trans({ children }) {
  const { t } = useI18n()
  return typeof children === 'string' ? t(children) : children
}
