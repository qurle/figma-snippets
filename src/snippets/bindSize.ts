/**
 * Bind width and height of elements to variables (if proper ones exist)
 */
const propertiesToBind: VariableBindableNodeField[] = ['width', 'height']
const typesToBind: NodeType[] = ['COMPONENT']

export const bindSize = async () => {
	let propCount = 0
	let nodeCount = 0
	let nodeAffected = false

	const variables = await figma.variables.getLocalVariablesAsync()
	for (const node of figma.currentPage.selection) {
		nodeAffected = false
		if (typesToBind.includes(node.type))
			for (const property of propertiesToBind) {
				if (!node.boundVariables?.[property]) {
					const variable = variables.find(v => approxEqual(node[property], v.resolveForConsumer(node).value))
					if (variable) {
						node.setBoundVariable(property, variable)
						nodeAffected = true
						propCount++
					}
				}
			}
		if (nodeAffected) nodeCount++
	}
	figma.notify(`Bound ${propCount} properties in ${nodeCount} nodes`)
}

function approxEqual(a, b, factor = 0.09) {
	return Math.abs(a - b) <= factor
}