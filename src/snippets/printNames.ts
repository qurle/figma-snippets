/**
 * Copy layer names, divided by new lines
 */

const defaultSeparator = '\n'
const emptyRegex = /^\s*$/
const topOffset = 64

export const printNames = async (separator = defaultSeparator) => {
	let nodeCount = 0
	let names = []

	for (const node of figma.currentPage.selection) {
		if (emptyRegex.test(node.name))
			continue
		names.push(node.name)
		nodeCount++
	}

	const lastNode = figma.currentPage.selection.reduce((max, node) =>
		node.y > max.y ? node : max
	)

	const namesNode = figma.createText()
	namesNode.x = lastNode.x
	namesNode.y = lastNode.y + lastNode.height + topOffset
	figma.loadFontAsync(namesNode.fontName).then(() => {
		namesNode.characters = names.join(separator)
	})
	figma.viewport.scrollAndZoomIntoView([namesNode])
	figma.currentPage.selection = [namesNode]


	figma.notify(`Printed names of ${nodeCount} layers`)
}