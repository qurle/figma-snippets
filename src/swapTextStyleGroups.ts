const mapping = {
	from: "Medium",
	to: "Large",
	spacer: '/'
}

let count = 0

export const swapTextStyleGroups = async () => {
	const textStyles = await figma.getLocalTextStylesAsync()
	swapTextStyles(figma.currentPage.selection, textStyles)
	figma.notify(`Swapped ${count} properties`)
}

async function swapTextStyles(nodes, textStyles) {
	for (const node of nodes) {
		const textStyleId = node.textStyleId
		if (textStyleId && textStyleId !== figma.mixed) {
			const styleName = (await figma.getStyleByIdAsync(textStyleId)).name
			let [prefix, ...name] = styleName.split(mapping.spacer)
			//@ts-ignore
			name = name.join(mapping.spacer)
			if (prefix.toLowerCase() === mapping.from.toLowerCase()) {
				const newStyleId = textStyles.find(style => style.name === (mapping.to + mapping.spacer + name))?.id || null
				if (newStyleId) node.textStyleId = newStyleId
				count++
			}
		}
		if (node.children && node.children.length > 0) {
			await swapTextStyles(node.children, textStyles)
		}
	}
}