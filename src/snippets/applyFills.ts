const fillNames = ['image', 'picture', 'fill', 'bg', 'background']
const typesOfFilled: NodeType[] = [
	'COMPONENT', 'COMPONENT_SET', 'ELLIPSE', 'FRAME',
	'HIGHLIGHT', 'INSTANCE', 'LINE', 'POLYGON', 'RECTANGLE',
	'STAMP', 'STAR', 'TEXT', 'VECTOR']

/**
 * Create lots copies of element with differents fills applied to it
 * @param fillNames Array of possible names for fill sample elements
 */

export const applyFills = async (fillNames) => {
	let nodeCount = 0

	const selection = figma.currentPage.selection
	const fillNodes = selection.filter(node => isFill(node) && typesOfFilled.includes(node.type))
	const applier = selection.find(node => !isFill(node) && typesOfFilled.includes(node.type))

	const al = createAL(applier, fillNodes.length)

	for (const fillNode of fillNodes) {
		if (!fillNode.fills) return

		const clone = applier.clone()
		clone.fills = JSON.parse(JSON.stringify(fillNode.fills))
		al.appendChild(clone)

		nodeCount++
	}

	figma.currentPage.selection = [al]
	figma.notify(`Created ${nodeCount} filled copies`)
}

const isFill = (node) => fillNames.includes(node.name.toLowerCase())

const createAL = (child, fillNodesCount) => {
	const al = figma.createFrame()
	al.layoutMode = 'HORIZONTAL'
	al.layoutWrap = 'WRAP'
	const gap = 64
	const widthInNodes = Math.ceil(Math.sqrt(fillNodesCount))
	console.log(widthInNodes)
	console.log('width: ' + child.width + widthInNodes + gap * (widthInNodes + 1))
	al.layoutSizingHorizontal = 'FIXED'
	al.verticalPadding = gap
	al.horizontalPadding = gap
	al.itemSpacing = gap
	al.counterAxisSpacing = gap
	al.resize(child.width * widthInNodes + gap * (widthInNodes + 1), 0)
	al.layoutSizingVertical = 'HUG'
	al.x = child.x
	al.y = child.y + child.height + gap
	al.cornerRadius = 48
	al.cornerSmoothing = 0.6
	al.fills = []
	al.strokes = [{
		type: "SOLID",
		color: { r: 0, g: 0, b: 0 },
		opacity: 0.2
	}]
	al.name = child.name + ' variants'
	return al
}