const mapping = {
	from: "Medium",
	to: "Large"
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
			let [prefix, ...name] = styleName.split('/')
			//@ts-ignore
			name = name.join('/')
			if (prefix.toLowerCase() === mapping.from.toLowerCase()) {
				node.textStyleId = textStyles.find(style => style.name === (mapping.from + name)).id
				count++
			}
		}
		if (node.children.length > 0) {
			await swapTextStyles(node.children, textStyles)
		}
	}
}