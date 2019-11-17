/* global imports */
const { Gtk, GObject } = imports.gi

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
      this.duplicateBtn.destroy()
      this.deleteBtn.destroy()
      this.duplicateBtn.destroy()
    }

    // Clear Button
    this.clearBtn.connect('pressed', () => {
      this.colorsContainer.destroy()
      this.colorsContainer = new Gtk.FlowBox()
      this.categoryTemplate.add(this.colorsContainer)
    })
  }

  addColor (color) {
    // const area = Gtk.DrawingArea()
    // area.set_size_request(24, 24)
    const colorBtn = new Gtk.ColorButton()
    // colorBtn.set_rgba(color)
    this.colorsContainer.add(colorBtn)
    this.colorsContainer.show_all()
    return colorBtn
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
    colorBtn.set_rgba(color)
    this.colorsContainer.add(colorBtn)
  }
})
