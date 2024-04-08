export const generateVariableValues = async () => {
    let currentLayer = figma.currentPage.selection[0]
    let value = (await figma.variables.getVariableByIdAsync(
        currentLayer.fills[0].boundVariables.color.id))
        .resolveForConsumer(figma.currentPage.selection[0]).value
}