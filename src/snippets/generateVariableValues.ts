/**
 * Get variables from fills of elements and print them as text
 */

import { figmaRGBToHex } from './convertColors'
const fontInter: FontName = { family: 'Inter', style: 'Regular' }

let count = 0

export const generateVariableValues = async () => {
    figma.currentPage.selection.forEach(async (currentLayer: FrameNode) => {
        if (currentLayer.type !== 'FRAME') {
            const oldLayer = currentLayer
            currentLayer = figma.createFrame()
            oldLayer.parent.insertChild(0, currentLayer)
            currentLayer.x = oldLayer.x
            currentLayer.y = oldLayer.y
            currentLayer.fills = oldLayer.fills
            oldLayer.remove()
        }

        let variable = (await figma.variables.getVariableByIdAsync(
            currentLayer.fills[0].boundVariables.color.id))

        await figma.loadFontAsync(fontInter)
        const value = makeText(figmaRGBToHex(variable.resolveForConsumer(currentLayer).value as RGB | RGBA))
        value.opacity = .75
        currentLayer.name = variable.name
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
}

function makeText(text: string) {
    const node = figma.createText()
    node.fontName = fontInter
    node.fontSize = 12
    node.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    node.characters = text
    return node
}