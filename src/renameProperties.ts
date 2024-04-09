const mapping = {
    "Dark": "Тёмная версия",
    "Date and Number": "Дата и серия",
    "On Package": "Дата на упаковке",
    "Barcode": "Штрих-код",
    "Barcode Number": "Текст штрих-кода",
}

let count = 0
let froms = Object.keys(mapping)

export const renameProperties = () => {
    for (const node of figma.currentPage.selection as ComponentSetNode[]) {
        console.log('Node: ' + node.name)
        if (node.type !== 'COMPONENT_SET')
            continue
        for (const propName in node.componentPropertyDefinitions) {
            console.log('Current name: ' + propName)
            const newName = froms.find(name => propName.startsWith(name))
            if (newName && mapping[newName]) {
                console.log('New name: ' + mapping[newName])
                node.editComponentProperty(propName, { name: mapping[newName] })
                count++
            }
        }
    }
    figma.notify(`Renamed ${count} properties`)

}