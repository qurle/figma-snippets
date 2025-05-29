/**
 * Set element to fill the parent by setting width and height
 */

const typesToFill: NodeType[] = [
	'COMPONENT', 'COMPONENT_SET', 'ELLIPSE', 'FRAME',
	'HIGHLIGHT', 'INSTANCE', 'LINE', 'POLYGON', 'RECTANGLE',
	'STAMP', 'STAR', 'TEXT', 'VECTOR']

export const fill = (scale = false) => {
	let nodeCount = 0

	for (const node of figma.currentPage.selection) {
		if (!typesToFill.includes(node.type)) return
		if (node.parent && node.parent.type === 'FRAME') {
			if (node.parent.layoutMode !== 'NONE') {
				// autolayout
				node.layoutPositioning = 'ABSOLUTE'
			}
			node.resize(node.parent.width, node.parent.height)
			node.constraints = {
				horizontal: scale ? 'SCALE' : 'STRETCH',
				vertical: scale ? 'SCALE' : 'STRETCH'
			} as Constraints
			nodeCount++
		}
	}
	figma.notify(`Filled ${nodeCount} layers`)
}

export const fillScale = () => { fill(true) }