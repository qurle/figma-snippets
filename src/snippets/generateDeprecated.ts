/**
 * Generated deprecated text by this pattern:
 * =========================================
 * "instance name" : "main component name",
 * =========================================
 */

const fontInter: FontName = { family: 'Inter', style: 'Regular' }


export const generateDeprecated = async () => {
	let nodeCount = 0
	let text = ''
	const selection = figma.currentPage.selection
	await figma.loadFontAsync(fontInter)

	for (const node of figma.currentPage.selection) {
		if (node.type !== 'INSTANCE')
			continue
		const mainComponent = await node.getMainComponentAsync()
		text += `,\n"${cleanName(node.name)}": "${cleanName(mainComponent.name)}"`
		nodeCount++
	}
	const textNode = makeText(text)
	textNode.x = figma.viewport.center.x - textNode.width / 2
	textNode.y = figma.viewport.center.y - textNode.width / 2
	figma.currentPage.selection = [textNode]

	figma.notify(`Generated mapping for ${nodeCount} of ${selection.length} components`)

}

const FILENAME_PARTIAL_REGEXP = /[a-z0-9]+(?:_[a-z0-9]+)*_[0-9]+(?:\.[0-9]+)?[hw]?/;

function cleanName(name: string) {
	return name.match(FILENAME_PARTIAL_REGEXP)?.[0] ?? name
}

function makeText(text: string) {
	const node = figma.createText()
	node.fontName = fontInter
	node.fontSize = 9
	node.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
	node.characters = text
	return node
}