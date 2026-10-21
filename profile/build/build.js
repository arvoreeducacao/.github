import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { groups } from './projects.js'
import { renderHero, renderCard, renderFooter } from './render.js'

const profileDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = join(profileDir, 'assets')
mkdirSync(join(assetsDir, 'projects'), { recursive: true })

async function repository(name) {
  const headers = { accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const response = await fetch(`https://api.github.com/repos/arvoreeducacao/${name}`, { headers })
  if (!response.ok) throw new Error(`${name}: ${response.status}`)
  return response.json()
}

writeFileSync(join(assetsDir, 'hero.svg'), renderHero())
writeFileSync(join(assetsDir, 'footer.svg'), renderFooter())

const sections = []
for (const group of groups) {
  const cells = []
  for (const [index, project] of group.projects.entries()) {
    const repo = await repository(project.repo)
    const svg = renderCard({ name: repo.name, blurb: project.blurb, stars: repo.stargazers_count, language: repo.language, index })
    writeFileSync(join(assetsDir, 'projects', `${repo.name}.svg`), svg)
    cells.push(`<a href="${repo.html_url}"><img src="assets/projects/${repo.name}.svg" width="49%" alt="${repo.name}: ${project.blurb}"></a>`)
  }
  const rows = []
  for (let i = 0; i < cells.length; i += 2) rows.push(`<p align="center">\n  ${cells.slice(i, i + 2).join('\n  ')}\n</p>`)
  sections.push(`### ${group.title}\n\n${rows.join('\n')}`)
}

const readme = `<p align="center">
  <a href="https://arvore.com.br"><img src="assets/hero.svg" width="100%" alt="Árvore open source. We help kids fall in love with reading, and these are the tools we made along the way."></a>
</p>

<p align="center">
  <a href="https://arvore.com.br"><img src="https://img.shields.io/badge/arvore.com.br-002733?style=flat-square&labelColor=002733&color=46D1C2" alt="arvore.com.br"></a>
  <a href="https://oss.arvore.com.br"><img src="https://oss.arvore.com.br/badges/oss-contributor.svg" alt="Árvore OSS Contributor" height="20"></a>
</p>

Árvore is a Brazilian edtech. Schools use our platform so kids read more, read better and actually enjoy it. Building that, we keep making tools for ourselves, mostly around AI agents and owning our own stack, and we open source the ones that might help you too.

${sections.join('\n\n')}

### Contributing

Every repository takes issues and pull requests. Once one of yours lands, grab your contributor badge and share card at [oss.arvore.com.br](https://oss.arvore.com.br).

<p align="center">
  <img src="assets/footer.svg" width="100%" alt="">
</p>
`

writeFileSync(join(profileDir, 'README.md'), readme)
