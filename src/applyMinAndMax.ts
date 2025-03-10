export const applyMinAndMax = async () => {
	let propCount = 0
	let nodeCount = 0
	let nodeAffected = false

	for (const node of figma.currentPage.selection) {
		if ('minWidth' in node) {
			node.minWidth = node.width
			nodeAffected = true
			propCount++
		}
		if ('minHeight' in node) {
			node.minHeight = node.height
			nodeAffected = true
			propCount++
		}
		if ('maxWidth' in node) {
			node.maxWidth = node.width
			nodeAffected = true
			propCount++
		}
		if ('maxHeight' in node) {
			node.maxHeight = node.height
			nodeAffected = true
			propCount++
		}
		if (nodeAffected) nodeCount++
	}
	figma.notify(`Set ${propCount} properties in ${nodeCount} nodes`)
}