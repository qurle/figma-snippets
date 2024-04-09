import { figmaRGBToHex } from './convertColors'
const fontInter: FontName = { family: 'Inter', style: 'Regular' }

let count = 0

export const generateVariableValues = async () => {
    figma.currentPage.selection.forEach(async (currentLayer: FrameNode) => {
        if (currentLayer.type !== 'FRAME') return

        let variable = (await figma.variables.getVariableByIdAsync(
            currentLayer.fills[0].boundVariables.color.id))

        await figma.loadFontAsync(fontInter)
        const value = makeText(figmaRGBToHex(variable.resolveForConsumer(currentLayer).value as RGB | RGBA))
        value.opacity = .75
        currentLayer.layoutMode = 'HORIZONTAL'
        currentLayer.paddingTop = 16
        currentLayer.paddingBottom = 16
        currentLayer.paddingLeft = 24
        currentLayer.paddingRight = 24
        currentLayer.itemSpacing = 8
        currentLayer.cornerRadius = 8
        currentLayer.cornerSmoothing = .6
        currentLayer.primaryAxisSizingMode = 'AUTO'
        currentLayer.counterAxisSizingMode = 'AUTO'
        currentLayer.primaryAxisAlignItems = 'CENTER'
        currentLayer.counterAxisAlignItems = 'CENTER'

        currentLayer.children.forEach(el => el.remove())
        currentLayer.appendChild(makeText(variable.name))
        currentLayer.appendChild(value)
        count++
    })
    figma.notify(`Generated for ${count} variables`)
}

function makeText(text: string) {
    const node = figma.createText()
    node.fontName = fontInter
    node.fontSize = 12
    node.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    node.characters = text
    return node
}