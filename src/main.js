#!/usr/bin/gjs
/* global log */
/* global imports */
imports.gi.versions.Gtk = '3.0'
imports.gi.versions.Gdk = '3.0'

const { Gtk, Gdk, Gio } = imports.gi
Gtk.init(null)

// TODO: refactor to use import starting the command from any folder
imports.searchPath.unshift('.')
const { ColorPicker } = imports.src.ColorPicker
const { Category } = imports.src.Category
const { NewPalletePopoverMenu } = imports.src.NewPalletePopoverMenu

// Import CSS
const css = new Gtk.CssProvider()
css.load_from_path('./src/style.css')
const root = Gdk.get_default_root_window()
const screen = root.get_screen()
Gtk.StyleContext.add_provider_for_screen(screen, css, Gtk.STYLE_PROVIDER_PRIORITY_USER)

// Import saved data
const file = Gio.File.new_for_path('./saved/data.json')

const [, contents] = file.load_contents(null)
const session = JSON.parse(contents)

const addNewCategory = ({ name, colors = [] }) => {
  const category = new Category({
    label: name
  })

  colors.forEach(color => {
    log('new')
    log(color)
    const gtkColor = new Gdk.RGBA()
    gtkColor.parse(color)
    category.pushNewColor(gtkColor)
  })

  category.connect('setCurrentCollection', (collection) => {
    log('set collection')
    currentCollection = collection
    colorPicker.show_all()
  })

  category.connect('createNewCollection', (widget, name, colors) => {
    addNewCategory({ name, colors: JSON.parse(colors) })
  })

  box.add(category)
  category.show_all()
}

let currentBox
let currentCollection

const win = new Gtk.Window({
  defaultWidth: 200,
  defaultHeight: 300,
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

const newPaletteButton = new Gtk.Button({
  label: 'gtk-new',
  alwaysShowImage: true,
  useStock: true
})

pickButton.connect('clicked', () => {
  currentCollection = null
  colorPicker.show_all()
})

const newPalletePopoverMenu = new NewPalletePopoverMenu({
  parent: newPaletteButton
})

newPalletePopoverMenu.connect('createNewCollection', (widget, name) => {
  addNewCategory({ name })
})

newPaletteButton.connect('clicked', () => {
  log('create new palette')
  newPalletePopoverMenu.open()
})

const label = new Gtk.Label({ label: 'Select a color' })
box.add(label)

const history = new Category({ label: 'History', history: true })
box.add(history)

// Set history colors
session.history.forEach(color => {
  const gtkColor = new Gdk.RGBA()
  gtkColor.parse(color)
  history.pushNewColor(gtkColor)
})

// Set saved palettes
session.palettes.forEach(palette => {
  const name = Object.keys(palette)[0]
  addNewCategory({ name, colors: palette[name] })
})

colorPicker.connect('newColor', (w, color) => {
  log(color.to_string())
  label.set_text(color.to_string())
  log(color.hash())
  // cs.set_currrsent_rgba(color)
  // colorBtn.set_rgba(color)
  currentBox.forEach(box => box.set_rgba(color))
})

colorPicker.connect('show', () => {
  // log('showshow')
  currentBox = []
  currentBox.push(history.addColor())
  currentCollection && currentBox.push(currentCollection.addColor())
})

box.get_style_context().add_class('box')

header.add(pickButton)
header.add(newPaletteButton)

const scroll = new Gtk.ScrolledWindow({ vexpand: true })
scroll.add(box)
win.add(scroll)

// Window
win.connect('destroy', () => Gtk.main_quit())

win.set_titlebar(header)
win.set_position(Gtk.WindowPosition.CENTER)
win.show_all()

Gtk.main()
