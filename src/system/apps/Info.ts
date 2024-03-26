import icon from '../../assets/icons/userinfo.svg'
import badge from '../../assets/badge.png'

import HTML from '../../HTML'
import { Process } from '../../types'

const Info: Process = {
  config: {
    name: 'Info',
    type: 'process',
    icon,
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    const win = await process.loadLibrary('lib/WindowManager').then((wm: any) => {
      return wm.createWindow({
        title: 'Info',
        icon,
        width: 300,
        height: 400,
        canResize: false
      }, process)
    })

    win.content.style.padding = '10px'
    win.content.style.textAlign = 'center'
    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'
    win.content.style.justifyContent = 'center'
    win.content.style.alignItems = 'center'
    win.content.style.background = 'var(--base)'

    new HTML('div').appendTo(win.content)
      .appendMany(
        new HTML('h1').style({
          margin: '0'
        }).text('OS Simulator')
        
      )
  }
}

export default Info
