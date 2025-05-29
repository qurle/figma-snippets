// const typesToFill: NodeType[] = [
// 	'COMPONENT', 'COMPONENT_SET', 'ELLIPSE', 'FRAME',
// 	'HIGHLIGHT', 'INSTANCE', 'LINE', 'POLYGON', 'RECTANGLE',
// 	'STAMP', 'STAR', 'TEXT', 'VECTOR']

/**
 * Remove multiple image fills
 */

export const leaveOneImage = () => {
	let nodeCount = 0
	let imageCount = 0

	for (const node of figma.currentPage.selection) {
		if (!node?.fills)
			continue
		if (node.fills.length <= 1)
			continue
		if (!node.fills.some(el => el.type === 'IMAGE'))
			continue

		const images = node.fills.filter((el, i, arr) => el.type === 'IMAGE') as Array<Paint>
		node.fills = [images[images.length - 1]]
		imageCount += images.length - 1
		nodeCount++
	}
	figma.notify(`Cleaned ${imageCount} images in ${nodeCount} layers`)
}