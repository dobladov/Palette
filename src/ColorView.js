/* global imports */
const { Gtk, GObject } = imports.gi

const { readFile } = imports.common

// eslint-disable-next-line no-unused-vars
var ColorView = GObject.registerClass({
  GTypeName: 'ColorView',
  //   Signals: {
  //     createNewCollection: {
  //       param_types: [GObject.TYPE_STRING]
  //     }
  //   },
  Children: ['colorView', 'colorNameLabel', 'colorValueLabel', 'colorBtn'],
  Template: readFile('src/templates/ColorView.glade')
}, class ColorView extends Gtk.Box {
  _init ({ colorValue }) {
    super._init()
    this.colorNameLabel.set_label('')
    this.colorValueLabel.set_label(colorValue.to_string())
    this.colorBtn.set_rgba(colorValue)
    this.add(this.colorView)
    log(colorValue.hash())
  }
})
