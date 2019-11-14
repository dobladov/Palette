/* global imports */
const { Gtk, GObject } = imports.gi

// eslint-disable-next-line no-unused-vars
var Category = GObject.registerClass({
  // GTypeName: 'Category',
  Signals: {
    setCurrentCollection: {
      param_types: [Gtk.VBox]
    }
  }
}, class Category extends Gtk.VBox {
  _init ({ label, history }) {
    super._init()

    this.get_style_context().add_class('collection')

    const vBox = new Gtk.Box()
    this.colorsContainer = new Gtk.FlowBox()
    // this.colorsContainer = new Gtk.Box()

    const header = new Gtk.HBox()
    header.add(new Gtk.Label({
      label
    }))

    if (!history) {
      const removeBtn = new Gtk.Button({
        // label: 'remove'
        image: new Gtk.Image({ icon_name: 'user-trash', icon_size: Gtk.IconSize.SMALL_TOOLBAR })
      })

      removeBtn.get_style_context().add_class(Gtk.STYLE_CLASS_FLAT)

      removeBtn.connect('button_release_event', () => {
        this.destroy()
      })

      header.add(removeBtn)
      this.addColorButton = new Gtk.Button({
        // label: 'Add',
        image: new Gtk.Image({ icon_name: 'gtk-add', icon_size: Gtk.IconSize.SMALL_TOOLBAR })
      })

      this.addColorButton.get_style_context().add_class(Gtk.STYLE_CLASS_FLAT)

      this.addColorButton.connect('clicked', () => {
        this.emit('setCurrentCollection', this)
      })
      header.add(this.addColorButton)
    }

    vBox.add(header)
    this.add(vBox)
    this.add(this.colorsContainer)

    this.show_all()
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

  pushNewColor (color) {
    const colorBtn = new Gtk.ColorButton()
    colorBtn.set_rgba(color)
    this.colorsContainer.add(colorBtn)
  }
})
