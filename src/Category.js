/* global imports */
const { Gtk, Gdk, GObject } = imports.gi

const { readFile } = imports.common

// eslint-disable-next-line no-unused-vars
var Category = GObject.registerClass({
  GTypeName: 'Category',
  Signals: {
    setCurrentCollection: {
      param_types: [Gtk.Box]
    },
    createNewCollection: {
      param_types: [
        GObject.String,
        GObject.String
      ]
    },
    setColor: {
      param_types: [
        GObject.String
      ]
    }
  },
  Children: [
    'categoryTemplate',
    'categoryName',
    'pickBtn',
    'duplicateBtn',
    'exportBtn',
    'clearBtn',
    'deleteBtn',
    'colorsContainer'
  ],
  Template: readFile('src/templates/Category.glade')
}, class Category extends Gtk.Box {
  _init ({ label, history }) {
    super._init()

    this.categoryName.set_label(label)

    this.add(this.categoryTemplate)

    if (!history) {
      this.pickBtn.connect('clicked', () => {
        this.emit('setCurrentCollection', this.categoryTemplate)
      })

      this.duplicateBtn.connect('clicked', () => {
        this.emit('createNewCollection', label, JSON.stringify(this.getColors()))
      })

      this.deleteBtn.connect('pressed', () => {
        this.destroy()
      })
    } else {
      this.pickBtn.destroy()
      this.deleteBtn.destroy()
      this.duplicateBtn.destroy()
    }
    this.exportBtn.destroy()

    // Clear Button
    this.clearBtn.connect('pressed', () => {
      this.colorsContainer.destroy()
      this.colorsContainer = new Gtk.FlowBox()
      this.categoryTemplate.add(this.colorsContainer)
    })
  }

  getColors () {
    const colors = []
    this.colorsContainer.get_children().map(colorButton => {
      colors.push(colorButton.get_children()[0].get_rgba().to_string())
    })
    return colors
  }

  pushNewColor (color) {
    const colorBtn = new Gtk.ColorButton()
    if (color) {
      colorBtn.set_rgba(color)
    }
    colorBtn.connect('button_release_event', (widget, e) => {
      const [, button] = e.get_button()
      if (button === 3) {
        const clipboard = Gtk.Clipboard.get_default(Gdk.Display.get_default())
        const color = colorBtn.get_rgba().to_string()
        clipboard.set_text(color, -1)
        this.emit('setColor', color)
        return false
      }
    })
    this.colorsContainer.add(colorBtn)
    this.colorsContainer.show_all()
    return colorBtn
  }
})
