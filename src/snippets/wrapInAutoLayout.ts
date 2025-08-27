/**
 * Make selected frames an autolayout, add top-level children frame inside
 * @param name Name of top-level frame
 */

export const wrapInAutoLayout = async (name = 'Content') => {
	let nodeCount = 0
	const selection = figma.currentPage.selection

	if (selection.length === 0) {
		figma.notify('Selection is empty')
		return
	}

	for (const el of selection) {

		if (!('insertChild' in el))
			continue

		removeAutoLayout(el)

		const frame = figma.createFrame()
		const content = figma.group(el.children, el)

		el.appendChild(frame)
		frame.x = 0
		frame.y = 0
		frame.fills = []
		frame.clipsContent = false
		frame.name = name
		frame.resize(el.height, el.width)

		frame.appendChild(content)
		figma.ungroup(content)

		addAutoLayout(el)

		nodeCount++
	}
	figma.notify(`Cloned ${nodeCount} nodes`)
}

const removeAutoLayout = (el) => {
	if (el.type === 'FRAME' && el.layoutMode === 'NONE')
		el.layoutMode = 'NONE'
}

const addAutoLayout = (el) => {
	el.layoutMode = 'VERTICAL'
	el.layoutSizingVertical = 'HUG'
	el.layoutSizingHorizontal = 'HUG'
	el.paddingLeft = 0
	el.paddingRight = 0
	el.paddingTop = 0
	el.paddingBottom = 0
	el.itemSpacing = 0
	el.primaryAxisAlignItems = 'CENTER'
	el.counterAxisAlignItems = 'CENTER'
}