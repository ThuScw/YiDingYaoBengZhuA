const textModules = import.meta.glob('./resources/text/*.txt', { eager: true, query: '?raw', import: 'default' })
const imageModules = import.meta.glob('./resources/image/*.{png,jpg,jpeg,gif,webp,svg}', { eager: true, query: '?url', import: 'default' })
const videoModules = import.meta.glob('./resources/video/*.{mp4,webm,mov}', { eager: true, query: '?url', import: 'default' })

function buildMaterials() {
  let id = 0
  const materials = []

  for (const content of Object.values(textModules)) {
    materials.push({ id: ++id, type: 'text', content: content.trimEnd() })
  }
  for (const url of Object.values(imageModules)) {
    materials.push({ id: ++id, type: 'image', content: url })
  }
  for (const url of Object.values(videoModules)) {
    materials.push({ id: ++id, type: 'video', content: url })
  }

  return materials
}

export const materials = buildMaterials()
