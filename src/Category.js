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

    const header = new Gtk.HBox()
    const headerLeft = new Gtk.HBox()
    const headerRight = new Gtk.HBox()
    this.colorsContainer = new Gtk.FlowBox()
    header.add(headerLeft)
    header.add(new Gtk.Alignment({
      xscale: 1
    }))
    header.add(headerRight)

    headerLeft.add(new Gtk.Label({
      label
    }))

    if (!history) {
      // Add Color button
      const addColorBtn = new Gtk.Button({
        image: new Gtk.Image({ icon_name: 'gtk-select-color', icon_size: Gtk.IconSize.SMALL_TOOLBAR })
      })
      addColorBtn.set_tooltip_text('Add color to this collection')
      addColorBtn.get_style_context().add_class(Gtk.STYLE_CLASS_FLAT)
      addColorBtn.connect('clicked', () => {
        this.emit('setCurrentCollection', this)
      })
      headerLeft.add(addColorBtn)

      // Remove Button
      const removeBtn = new Gtk.Button({
        image: new Gtk.Image({ icon_name: 'user-trash', icon_size: Gtk.IconSize.SMALL_TOOLBAR })
      })
      removeBtn.get_style_context().add_class(Gtk.STYLE_CLASS_FLAT)
      removeBtn.set_tooltip_text('Remove this collection')
      removeBtn.connect('pressed', () => {
        this.destroy()
      })
      headerRight.add(removeBtn)
    }

    // Clear Button
    const clearBtn = new Gtk.Button({
      image: new Gtk.Image({ icon_name: 'edit-clear-all', icon_size: Gtk.IconSize.SMALL_TOOLBAR })
    })
    clearBtn.get_style_context().add_class(Gtk.STYLE_CLASS_FLAT)
    clearBtn.set_tooltip_text('Clear all colors from this collection')
    clearBtn.connect('pressed', () => {
      this.colorsContainer.destroy()
      this.colorsContainer = new Gtk.FlowBox()
      this.add(this.colorsContainer)
    })
    headerRight.add(clearBtn)
    this.add(header)
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
