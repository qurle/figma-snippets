export const renameCodeSyntax = async (platforms: CodeSyntaxPlatform[] = ['iOS'], from: string = '.va', to: string = '.vkui.') => {
    figma.variables.getLocalVariables().forEach(v => {
        platforms.forEach(platform => {
            if (v.codeSyntax[platform])
                v.setVariableCodeSyntax(platform, v.codeSyntax[platform].replace('.va.', '.vkui.'))
        }
        )
    })
}
