// Imports
import { generateVariableValues } from './generateVariableValues'
import { renameCodeSyntax } from './renameCodeSyntax'
// Constants
const snippets = [generateVariableValues]
const confirmMsgs = ["Done!", "You got it!", "Aye!", "Is that all?", "My job here is done.", "Gotcha!", "It wasn't hard.", "Got it! What's next?"]
// Variables
let notification: NotificationHandler
let working = false

figma.on("currentpagechange", cancel)

// Main + Elements Check
figma.on('run', async ({ parameters }: RunEvent) => {
  working = true
  await snippets[parameters.snippet]
  finish()
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
  figma.root.setRelaunchData({ relaunch: '' })
  notify(confirmMsgs[Math.floor(Math.random() * confirmMsgs.length)])
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