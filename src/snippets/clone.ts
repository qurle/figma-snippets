/**
 * Create clone of selection 
 */

export const clone = async () => {
	let nodeCount = 0
	const selection = figma.currentPage.selection

	if (selection.length === 0) {
		figma.notify('Selection is empty')
		return
	}

	const clones = []
	for (const el of selection) {
		const clone = el.clone()
		clone.name += ' (Copy)'
		clone.x += 32
		clone.y += 32
		clones.push(clone)
		nodeCount++
	}
	figma.currentPage.selection = clones
	figma.notify(`Cloned ${nodeCount} nodes`)
}
