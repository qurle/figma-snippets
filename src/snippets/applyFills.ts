const fillNames = ['fill', 'image', 'picture', 'bg', 'background']
const typesOfFilled: NodeType[] = [
	'COMPONENT', 'COMPONENT_SET', 'ELLIPSE', 'FRAME',
	'HIGHLIGHT', 'INSTANCE', 'LINE', 'POLYGON', 'RECTANGLE',
	'STAMP', 'STAR', 'TEXT', 'VECTOR']

/**
 * Create lots copies of element with differents fills applied to it
 * @param childeren If should look up a children of elements instead of direct elements 
 */

export const applyFills = async (children = false) => {
	let nodeCount = 0
	const selection = figma.currentPage.selection

	if (selection.length === 0) {
		figma.notify('Selection is empty')
		return
	}

	let samples: readonly any[] = []

	if (children) {
		samples = figma.currentPage.selection.map(parent => 'children' in parent && parent.children).flat().filter(node => isFill(node))
	} else
		samples = selection

	const fillNodes = samples.filter(node => isFill(node) && 'fills' in node)
	if (fillNodes.length === 0) {
		figma.notify('Not found image layers called either: ' + fillNames.join(', '))
		return
	}

	const applier = selection.find(node => !isFill(node) && 'fills' in node)
	if (fillNodes.length === 0) {
		figma.notify('Not found layer to apply fills')
		return
	}

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

export const applyFillsOnChildren = () => { applyFills(true) }

const isFill = (node) => fillNames.includes(node.name.toLowerCase())

const createAL = (child, fillNodesCount) => {
	const al = figma.createFrame()
	al.layoutMode = 'HORIZONTAL'
	al.layoutWrap = 'WRAP'
	const gap = 64
	const widthInNodes = Math.ceil(Math.sqrt(fillNodesCount))
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