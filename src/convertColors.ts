// From https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/blob/master/src/helpers/convertColor.ts
// Constants
const namesRGB = ['r', 'g', 'b']

// Types
type webRGB = [number, number, number]
type webRGBA = [number, number, number, number]
function figmaRGBToWebRGB(color: RGBA): webRGBA
function figmaRGBToWebRGB(color: RGB): webRGB

// Functions
function figmaRGBToWebRGB(color): any {
    const rgb = []

    namesRGB.forEach((e, i) => {
        rgb[i] = Math.round(color[e] * 255)
    })

    console.log(rgb)
    console.log(color['a'])
    if (color['a'] !== undefined && color['a'] !== 1) rgb[3] = Math.round(color['a'] * 100) / 100
    return rgb
}

export function figmaRGBToHex(color: RGB | RGBA): string {
    let hex = '#'

    const rgb = figmaRGBToWebRGB(color) as webRGB | webRGBA
    hex += ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).toUpperCase().slice(1)

    if (rgb[3] !== undefined) {
        const a = Math.round(rgb[3] * 100)
        hex += ` ${a}%`
    }
    return hex
}