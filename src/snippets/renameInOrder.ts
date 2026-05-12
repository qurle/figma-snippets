/**
 * Get 2 nodes, transfer names and decription 
 * of children from the node called "rename" 
 * to another selected node  
 */

const componentTypes: NodeType[] = ['COMPONENT', 'COMPONENT_SET']
const defaultSourceParentName = null
const defaultNamesParentName = 'Rename'

type Info = {
	name: string,
	description: string
}

export const renameInOrder = async (sourceNodeName = defaultSourceParentName,
	namesNodeName = defaultNamesParentName) => {
	let nodeCount = 0

	const selection = figma.currentPage.selection
	const sourceParent = sourceNodeName ?
		selection.find(node => node.name.toLowerCase() === sourceNodeName.toLowerCase()) :
		selection.find(node => node.name.toLowerCase() !== namesNodeName.toLowerCase())

	const namesParent = selection.find(node => node.name.toLowerCase() === namesNodeName.toLowerCase())

	const error = checkErrors(selection, sourceParent, namesParent)
	if (error) throw error


	for (let i = 0; i < sourceParent.children.length; i++) {
		const sourceNode = sourceParent.children[i]
		const nameNode = namesParent.children[i]

		console.log(`Renaming ${sourceNode.name} to ${nameNode.name}`)
		console.log(await getInfo(nameNode))

		const success = await setInfo(sourceNode, await getInfo(nameNode))
		if (success) nodeCount++
	}


	figma.notify(`Renamed ${nodeCount} of ${sourceParent.children.length} components`)

}

async function getInfo(node): Promise<Info> {
	let mainComponent = null

	if (node.type === 'INSTANCE')
		mainComponent = await node.getMainComponentAsync()

	if (componentTypes.includes(node.type))
		mainComponent = node

	if (mainComponent)
		return {
			name: mainComponent.name,
			description: mainComponent.descriptionMarkdown
		}

	return null
}

async function setInfo(node, info: Info) {
	if (!info) return null
	let mainComponent = null

	if (node.type === 'INSTANCE')
		mainComponent = await node.getMainComponentAsync()


	if (componentTypes.includes(node.type))
		mainComponent = node

	if (mainComponent) {
		mainComponent.name = info.name
		mainComponent.descriptionMarkdown = info.description
		return info
	}

	return null

}

const checkErrors = (selection, sourceParent, namesParent) => {
	if (selection.length !== 2)
		return `Select 2 layers for predictabile results`

	if (!namesParent)
		return `Parent with name "${defaultNamesParentName}" not found`

	if (!sourceParent)
		return `Parent with original names not found`

	if (sourceParent.children.length !== namesParent.children.length)
		return `Different number of layers in parents`

	if (!('children' in sourceParent))
		return `No children in ${sourceParent.name}`

	if (!('children' in namesParent))
		return `No children in ${namesParent.name}`

	return false
}