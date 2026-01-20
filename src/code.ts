// Imports
import { generateVariableValues } from './snippets/generateVariableValues'
import { renameCodeSyntax } from './snippets/renameCodeSyntax'
import { renameProperties } from './snippets/renameProperties'
import { swapTextStyleGroups } from './snippets/swapTextStyleGroups'
import { bindSize } from './snippets/bindSize'
import { fill, fillScale } from './snippets/fill'
import { leaveOneImage } from './snippets/leaveOneImage'
import { applyMinAndMax } from './snippets/applyMinAndMax'
import { applyFills, applyFillsOnChildren } from './snippets/applyFills'
import { clone } from './snippets/clone'
import { wrapInAutoLayout } from './snippets/wrapInAutoLayout'
import { printNames } from './snippets/printNames'
// Constants
const snippets = [generateVariableValues, renameCodeSyntax,
  renameProperties, swapTextStyleGroups, bindSize, fill,
  fillScale, leaveOneImage, applyMinAndMax, applyFills,
  applyFillsOnChildren, clone, wrapInAutoLayout, printNames
]
// Variables
let notification: NotificationHandler
let working = false

figma.on("currentpagechange", cancel)

// Main + Elements Check
figma.on('run', async ({ parameters }: RunEvent) => {
  working = true
  console.log(snippets[parameters.snippet].name)
  try {
    await snippets[parameters.snippet]()
    finish()
  }
  catch (e) {
    figma.notify(JSON.stringify(e), { error: true })
  }
})

figma.parameters.on(
  'input',
  async ({ key, query, result }: ParameterInputEvent) => {
    switch (key) {
      case 'snippet': {
        result.setSuggestions(snippets.map((el, index) => ({
          name: camelCaseToSentence(el.name),
          data: index
        })).filter(s => s.name.toLowerCase().includes(query.toLowerCase())))
        break
      }
      default:
        return
    }
  }
)

function camelCaseToSentence(s: string): string {
  const result = s.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

// Ending the work
function finish() {
  working = false
  // notify(confirmMsgs[Math.floor(Math.random() * confirmMsgs.length)])
  setTimeout(() => { console.log("Timeouted"), figma.closePlugin() }, 3000)
}

// Show new notification
function notify(text: string) {
  if (notification != null)
    notification.cancel()
  notification = figma.notify(text)
}

// Showing interruption notification
function cancel() {
  if (notification != null)
    notification.cancel()
  if (working) {
    notify("Plugin work have been interrupted")
  }
}