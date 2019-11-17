/* global imports */
const { Gtk, Gdk, GObject } = imports.gi

var { getColor } = imports.common

// eslint-disable-next-line no-unused-vars
var ColorPicker = GObject.registerClass({
  Signals: {
    newColor: {
      param_types: [Gdk.RGBA]
    }
  }
}, class ColorPicker extends Gtk.Window {
  _init () {
    super._init({
      type: Gtk.WindowType.POPUP,
      appPaintable: true,
      decorated: false,
      resizable: false,
      defaultHeight: 500,
      defaultWidth: 400
    })

    this.add_events(Gdk.EventMask.POINTER_MOTION_MASK)

    // Make it invisible
    this.set_visual(this.get_screen().get_rgba_visual())

    this.connect('motion-notify-event', (w, e) => {
      const [, x, y] = e.get_coords()
      const color = getColor(x, y)
      this.emit('newColor', color)
    })

    this.connect('button_release_event', (w, e) => {
      w.get_visible() ? w.hide() : w.show_all()
    })

    // Set size
    const root = Gdk.get_default_root_window()
    const screen = root.get_screen()
    const width = screen.get_width()
    const height = screen.get_height()
    this.resize(width, height)
  }
})
