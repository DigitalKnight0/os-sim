import Kernel from '../../kernel'

import FlowLogo from '../../assets/MU-logo.png'
import { Library } from '../../types'
import LibraryLib from '../../structures/LibraryLib'

let library: LibraryLib
let kernel: Kernel

const SplashScreen: Library = {
  config: {
    name: 'SplashScreen',
    type: 'library',
    targetVer: '1.0.0-indev.0'
  },
  init: (l, k, p) => {
    library = l
    kernel = k
  },
  data: {
    getElement: () => {
      const { HTML } = library
      const div = new HTML('div').style({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'justify-content': 'center',
        'z-index': '1000000'
      })
      new HTML('img').attr({
        src: FlowLogo,
        width: 256
      }).appendTo(div)
      const h1 = new HTML('h1').style({ margin: '0' }).text('OS Simulator').appendTo(div)
      new HTML('p').style({ 'font-size': '0.5em' }).text('By 21CS087 & 21CS083').appendTo(h1)
      new HTML('p').style({ margin: '0' }).text('Booting...').appendTo(div)

      return div
    }
  }
}

export default SplashScreen
