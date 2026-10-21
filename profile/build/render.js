import { colors, wordmark, mark } from './brand.js'
import { textPath } from './text.js'

const mist = '#8FB3BC'
const slate = '#4E7683'
const ease = 'calcMode="spline" keyTimes="0;1" keySplines="0.2 0.8 0.2 1"'

const [smallLeaf, bigLeaf] = mark.d.split(/ (?=M )/)

const languageColors = {
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Python: '#3572A5',
  HTML: '#E34C26',
}

const star = 'M8 0.5l2.2 4.6 5 0.7-3.6 3.5 0.9 5-4.5-2.4-4.5 2.4 0.9-5L0.8 5.8l5-0.7z'

function escapeXml(value) {
  return value.replace(/[<>&"']/g, (char) => `&#${char.charCodeAt(0)};`)
}

function text(value, { size, weight = 'bold', x, y, fill, letterSpacing = 0, extra = '' }) {
  const { d, width } = textPath(value, { size, weight, letterSpacing })
  return { svg: `<path d="${d}" fill="${fill}" transform="translate(${x} ${y})"${extra}/>`, width }
}

function wrap(value, { size, weight, maxWidth, maxLines }) {
  const lines = []
  let current = ''
  for (const word of value.split(' ')) {
    const candidate = current ? `${current} ${word}` : word
    if (current && textPath(candidate, { size, weight }).width > maxWidth) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, maxLines)
}

function riseIn(begin, distance = 14, duration = 0.9) {
  return `<animate attributeName="opacity" values="0;1" dur="${duration}s" begin="${begin}s" fill="freeze" ${ease}/>
<animateTransform attributeName="transform" type="translate" values="0 ${distance};0 0" dur="${duration}s" begin="${begin}s" fill="freeze" additive="sum" ${ease}/>`
}

function leaf({ x, y, scale, fill, opacity = 1 }) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}"><path d="${mark.d}" fill="${fill}" fill-rule="evenodd"/></g>`
}

function drifters({ width, height, count, seed }) {
  let state = seed
  const random = () => {
    state = (state * 16807) % 2147483647
    return state / 2147483647
  }
  return Array.from({ length: count }, () => {
    const x = Math.round(random() * width)
    const scale = (0.9 + random() * 1.6).toFixed(2)
    const duration = (16 + random() * 14).toFixed(1)
    const offset = (-random() * Number(duration)).toFixed(1)
    const spin = random() > 0.5 ? 360 : -360
    const sway = Math.round(20 + random() * 40)
    const opacity = (0.08 + random() * 0.14).toFixed(2)
    return `<g opacity="${opacity}">
  <animateTransform attributeName="transform" type="translate" values="${x} ${height + 30};${x + sway} ${height / 2};${x - sway / 2} -40" dur="${duration}s" begin="${offset}s" repeatCount="indefinite"/>
  <g transform="scale(${scale})">
    <g><animateTransform attributeName="transform" type="rotate" values="0 5.5 8;${spin} 5.5 8" dur="${(Number(duration) * 0.8).toFixed(1)}s" begin="${offset}s" repeatCount="indefinite"/>
      <path d="${mark.d}" fill="${colors.teal}" fill-rule="evenodd"/>
    </g>
  </g>
</g>`
  }).join('\n')
}

function revealLine({ id, value, size, weight, x, baseline, fill, begin, duration = 1 }) {
  const { svg, width } = text(value, { size, weight, x, y: baseline, fill })
  const top = baseline - size
  const height = size * 1.4
  return `<clipPath id="${id}"><rect x="${x - 4}" y="${top}" width="0" height="${height}">
  <animate attributeName="width" values="0;${Math.ceil(width + 12)}" dur="${duration}s" begin="${begin}s" fill="freeze" ${ease}/>
</rect></clipPath>
<g clip-path="url(#${id})">${svg}</g>
<rect x="${x}" y="${top + size * 0.12}" width="4" height="${size * 1.02}" rx="2" fill="${colors.teal}" opacity="0">
  <animate attributeName="x" values="${x};${x + width + 8}" dur="${duration}s" begin="${begin}s" fill="freeze" ${ease}/>
  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.85;1" dur="${duration + 0.3}s" begin="${begin}s" fill="freeze"/>
</rect>`
}

export function renderHero() {
  const width = 1280
  const height = 440
  const margin = 84
  const logoScale = 46 / wordmark.height

  const markHeight = 280
  const markScale = markHeight / mark.height
  const markX = width - margin - mark.width * markScale - 20
  const markY = (height - markHeight) / 2 + 6

  const eyebrow = text('OPEN SOURCE AT ÁRVORE', { size: 19, x: margin, y: 164, fill: colors.teal, letterSpacing: 4.4 })
  const sub1 = text('We build the reading platform used by schools across Brazil.', { size: 23, weight: 'regular', x: margin, y: 354, fill: mist })
  const sub2 = text('These are the tools we made along the way, free for anyone.', { size: 23, weight: 'regular', x: margin, y: 388, fill: mist })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Árvore open source. We help kids fall in love with reading, and we share the tools we build on the way.">
<title>Árvore open source</title>
<defs>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${colors.teal}" stop-opacity="0.32"/>
    <stop offset="1" stop-color="${colors.teal}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/>
    <stop offset="0.55" stop-color="#fff" stop-opacity="0.9"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0.2"/>
  </linearGradient>
  <mask id="dotsMask"><rect width="${width}" height="${height}" fill="url(#fade)"/></mask>
  <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="${colors.teal}" opacity="0.13"/></pattern>
  <clipPath id="frame"><rect width="${width}" height="${height}" rx="22"/></clipPath>
</defs>
<g clip-path="url(#frame)">
<rect width="${width}" height="${height}" fill="${colors.navy}"/>
<rect width="${width}" height="${height}" fill="url(#dots)" mask="url(#dotsMask)"/>
<circle cx="${markX + 110}" cy="${height / 2}" r="300" fill="url(#glow)">
  <animate attributeName="r" values="270;320;270" dur="7s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
</circle>
${drifters({ width, height, count: 9, seed: 7 })}

<g transform="translate(${markX.toFixed(1)} ${markY.toFixed(1)}) scale(${markScale.toFixed(4)})">
  <g>
    <animateTransform attributeName="transform" type="rotate" values="0 2 11;-3.5 2 11;0 2 11;2 2 11;0 2 11" dur="7s" begin="2.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"/>
    <path d="${bigLeaf}" fill="none" stroke="${colors.teal}" stroke-width="0.09" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">
      <animate attributeName="stroke-dashoffset" values="1;0" dur="1.6s" begin="0.2s" fill="freeze" ${ease}/>
      <animate attributeName="opacity" values="1;0" dur="0.6s" begin="2.2s" fill="freeze"/>
    </path>
    <path d="${bigLeaf}" fill="${colors.teal}" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.4s" fill="freeze"/>
    </path>
  </g>
  <g>
    <animateTransform attributeName="transform" type="translate" values="0 0;0.18 -0.22;0 0" dur="5s" begin="2.4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
    <path d="${smallLeaf}" fill="none" stroke="${colors.teal}" stroke-width="0.09" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">
      <animate attributeName="stroke-dashoffset" values="1;0" dur="1.2s" begin="0.9s" fill="freeze" ${ease}/>
      <animate attributeName="opacity" values="1;0" dur="0.6s" begin="2.6s" fill="freeze"/>
    </path>
    <path d="${smallLeaf}" fill="${colors.tealDeep}" opacity="0">
      <animate attributeName="opacity" values="0;1" dur="0.8s" begin="1.8s" fill="freeze"/>
    </path>
  </g>
</g>

<g opacity="0">${riseIn(0.1)}
  <g transform="translate(${margin} 62) scale(${logoScale.toFixed(4)})"><path d="${wordmark.d}" fill="${colors.white}" fill-rule="evenodd"/></g>
</g>
<g opacity="0">${riseIn(0.45, 10)}${eyebrow.svg}</g>
${revealLine({ id: 'l1', value: 'We help kids fall in love', size: 58, weight: 'bold', x: margin, baseline: 236, fill: colors.white, begin: 0.8 })}
${revealLine({ id: 'l2', value: 'with reading.', size: 58, weight: 'bold', x: margin, baseline: 300, fill: colors.teal, begin: 1.7, duration: 0.8 })}
<g opacity="0">${riseIn(2.5, 10)}${sub1.svg}${sub2.svg}</g>
</g>
</svg>
`
}

export function renderCard({ name, blurb, stars, language, index }) {
  const width = 600
  const height = 208
  const pad = 34
  const delay = (index * 0.18).toFixed(2)
  const title = text(name, { size: 32, x: pad, y: 66, fill: colors.white })
  const lines = wrap(blurb, { size: 19, weight: 'regular', maxWidth: width - pad * 2 - 70, maxLines: 2 })
  const blurbSvg = lines.map((line, i) => text(line, { size: 19, weight: 'regular', x: pad, y: 108 + i * 27, fill: mist }).svg).join('')

  let meta = ''
  let cursor = pad
  if (language) {
    const label = text(language, { size: 16, weight: 'regular', x: cursor + 18, y: 178, fill: slate })
    meta += `<circle cx="${cursor + 6}" cy="172" r="6" fill="${languageColors[language] || mist}"/>${label.svg}`
    cursor += 18 + label.width + 26
  }
  const count = text(String(stars), { size: 16, weight: 'bold', x: cursor + 22, y: 178, fill: slate })
  meta += `<path d="${star}" fill="${colors.teal}" transform="translate(${cursor} 164)"/>${count.svg}`

  const perimeter = 2 * (width - 2 + height - 2)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(`${name}: ${blurb}`)}">
<title>${escapeXml(name)}</title>
<defs>
  <linearGradient id="sheen" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="${colors.teal}" stop-opacity="0"/>
    <stop offset="0.5" stop-color="${colors.teal}" stop-opacity="0.12"/>
    <stop offset="1" stop-color="${colors.teal}" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="card"><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18"/></clipPath>
</defs>
<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18" fill="${colors.navy}" stroke="${colors.navySoft}" stroke-width="2"/>
<g clip-path="url(#card)">
  <rect x="-260" y="0" width="220" height="${height}" fill="url(#sheen)" transform="skewX(-18)">
    <animate attributeName="x" values="-260;-260;${width + 120}" keyTimes="0;0.55;1" dur="7s" begin="${delay}s" repeatCount="indefinite"/>
  </rect>
  <g transform="translate(${width - 118} ${height - 120}) scale(9)" opacity="0.1">
    <g><animateTransform attributeName="transform" type="rotate" values="0 2 11;-4 2 11;0 2 11" dur="6s" begin="${delay}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
      <path d="${bigLeaf}" fill="${colors.teal}"/>
    </g>
    <path d="${smallLeaf}" fill="${colors.teal}"/>
  </g>
</g>
<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="18" fill="none" stroke="${colors.teal}" stroke-width="2" stroke-linecap="round" stroke-dasharray="120 ${perimeter}" stroke-dashoffset="0" opacity="0.85">
  <animate attributeName="stroke-dashoffset" values="0;-${perimeter + 120}" dur="9s" begin="${delay}s" repeatCount="indefinite"/>
</rect>
<g opacity="0">${riseIn(Number(delay), 10, 0.8)}
  ${title.svg}
  <rect x="${pad}" y="80" width="0" height="3" rx="1.5" fill="${colors.teal}">
    <animate attributeName="width" values="0;44" dur="0.8s" begin="${(Number(delay) + 0.4).toFixed(2)}s" fill="freeze" ${ease}/>
  </rect>
  ${blurbSvg}
  ${meta}
</g>
</svg>
`
}

export function renderFooter() {
  const width = 1280
  const height = 150
  const count = 34
  const gap = width / count
  const sprouts = Array.from({ length: count }, (_, i) => {
    const wave = Math.sin(i * 0.55) * 0.5 + 0.5
    const scale = (1.6 + wave * 1.8).toFixed(2)
    const x = Math.round(i * gap + gap / 2 - 5.5 * scale)
    const y = Math.round(height - 18 - 16 * scale)
    const begin = (i * 0.06).toFixed(2)
    const fill = i % 3 === 0 ? colors.tealDeep : colors.teal
    return `<g transform="translate(${x} ${y + 16 * scale}) scale(${scale})"><g transform="scale(1 0)">
  <animateTransform attributeName="transform" type="scale" values="1 0;1 1.12;1 1" keyTimes="0;0.7;1" dur="0.9s" begin="${begin}s" fill="freeze"/>
  <g transform="translate(0 -16)"><g>
    <animateTransform attributeName="transform" type="rotate" values="0 6 16;${(3 + wave * 4).toFixed(1)} 6 16;0 6 16" dur="${(3.2 + wave * 2).toFixed(1)}s" begin="${(1 + i * 0.09).toFixed(2)}s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
    <path d="${mark.d}" fill="${fill}" fill-rule="evenodd" opacity="${(0.35 + wave * 0.5).toFixed(2)}"/>
  </g></g>
</g></g>`
  }).join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="A row of Árvore leaves growing">
<title>Árvore</title>
<defs><clipPath id="frame"><rect width="${width}" height="${height}" rx="22"/></clipPath></defs>
<g clip-path="url(#frame)">
<rect width="${width}" height="${height}" fill="${colors.navy}"/>
${sprouts}
<rect y="${height - 18}" width="${width}" height="18" fill="${colors.navySoft}"/>
</g>
</svg>
`
}
