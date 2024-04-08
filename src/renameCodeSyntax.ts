export const renameCodeSyntax = async (platforms: CodeSyntaxPlatform[] = ['iOS'], from: string = '.va', to: string = '.vkui.') => {
    let count = 0
    figma.variables.getLocalVariables().forEach(v => {
        platforms.forEach(platform => {
            if (v.codeSyntax[platform]) {
                v.setVariableCodeSyntax(platform, v.codeSyntax[platform].replace(from, to))
                count++
            }
        }
        )
    })
    figma.notify(`Renamed ${count} entries`)
}
