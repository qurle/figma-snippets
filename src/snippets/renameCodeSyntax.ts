/**
 * Rename code syntax of all the variables
 * @param platforms Array of platforms to affect
 * @param from Substring to replace
 * @param to Replacement string
 */

export const renameCodeSyntax = async (platforms: CodeSyntaxPlatform[] = ['iOS'], from: string = '.va', to: string = '.vkui.') => {
    let count = 0;
    (await figma.variables.getLocalVariablesAsync()).forEach(v => {
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
