/* global imports */
const { Gtk, GObject, Gio } = imports.gi

function readFile (filename) {
  const file = Gio.file_new_for_path(filename)
  const [, data] = file.load_contents(null)
  return data
}

// eslint-disable-next-line no-unused-vars
var NewPalletePopoverMenu = GObject.registerClass({
  Signals: {
    createNewCollection: {
      param_types: [GObject.TYPE_STRING]
    }
  },
  Children: ['popover', 'newCollectionName', 'newCollectionAdd'],
  Template: readFile('src/newPalettePopoverMenu.glade')
}, class NewPalletePopoverMenu extends Gtk.PopoverMenu {
  _init ({ parent }) {
    super._init()
    this.popover.set_relative_to(parent)

    this.newCollectionName.connect('changed', () => {
      const text = this.newCollectionName.get_text()
      text
        ? this.newCollectionAdd.get_style_context().add_class(Gtk.STYLE_CLASS_SUGGESTED_ACTION)
        : this.newCollectionAdd.get_style_context().remove_class(Gtk.STYLE_CLASS_SUGGESTED_ACTION)
    })

    this.newCollectionAdd.connect('pressed', () => {
      const name = this.newCollectionName.get_text()
      this.newCollectionName.set_text('')
      this.emit('createNewCollection', name)
      this.popover.popdown()
    })
  }

  open () {
    this.popover.show_all()
    this.popover.popup()
  }
})
