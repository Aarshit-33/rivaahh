'use client'

import { useId } from 'react'
import s from './ui.module.css'

/**
 * A group of chips backed by real checkboxes (or radios with `single`).
 * options: [{ slug, label, theme?, count? }]
 */
export default function Choices({
  legend,
  hideLegend = false,
  options,
  value,
  onChange,
  single = false,
  swatches = false,
  autofocus = false,
}) {
  const name = useId()
  const selected = single ? [value] : value
  const toggle = (slug) => {
    if (single) onChange(slug)
    else onChange(selected.includes(slug) ? selected.filter((x) => x !== slug) : [...selected, slug])
  }
  return (
    <fieldset className={s.chips}>
      <legend className={hideLegend ? 'sr-only' : s.chipsLegend}>{legend}</legend>
      {options.map((o, i) => (
        <label key={o.slug} className={s.chip}>
          <input
            type={single ? 'radio' : 'checkbox'}
            name={name}
            checked={selected.includes(o.slug)}
            onChange={() => toggle(o.slug)}
            data-autofocus={autofocus && i === 0 ? '' : undefined}
          />
          {swatches && o.theme && <span className={`${s.swatch} ${s[`sw_${o.theme}`]}`} aria-hidden="true" />}
          {o.label}
          {o.count != null && <span className={s.chipCount}>{o.count}</span>}
        </label>
      ))}
    </fieldset>
  )
}
