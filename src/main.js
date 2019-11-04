#!/usr/bin/gjs
/* global log */
/* global imports */
imports.gi.versions.Gtk = '3.0'
imports.gi.versions.Gdk = '3.0'

const { Gtk, Gdk } = imports.gi
Gtk.init(null)

// TODO: refactor to use import starting the command from any folder
imports.searchPath.unshift('.')
const { ColorPicker } = imports.src.ColorPicker

const win = new Gtk.Window({
  defaultHeight: 200,
  defaultWidth: 200,
  title: 'Palette',
  gravity: Gdk.Gravity.CENTER
})

const colorPicker = new ColorPicker()

const box = new Gtk.Box({
  orientation: Gtk.Orientation.VERTICAL
})

// Header
const header = new Gtk.HeaderBar({
  title: 'Palette',
  showCloseButton: true
})

const pickButton = new Gtk.Button({
  label: 'gtk-select-color',
  alwaysShowImage: true,
  useStock: true
})

pickButton.connect('clicked', () => {
  colorPicker.show_all()
})

colorPicker.connect('newColor', (w, color) => {
  log(color.to_string())
  colorBtn.set_rgba(color)
})

const colorBtn = new Gtk.ColorButton()
box.add(colorBtn)

header.add(pickButton)
win.add(box)

// Window
win.connect('destroy', () => Gtk.main_quit())

win.set_titlebar(header)
win.set_position(Gtk.WindowPosition.CENTER)
win.show_all()

Gtk.main()
