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
const { Category } = imports.src.Category

// Import CSS
const css = new Gtk.CssProvider()
css.load_from_path('./src/style.css')
const root = Gdk.get_default_root_window()
const screen = root.get_screen()
Gtk.StyleContext.add_provider_for_screen(screen, css, Gtk.STYLE_PROVIDER_PRIORITY_USER)

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

const newPaletteButton = new Gtk.Button({
  label: 'gtk-new',
  alwaysShowImage: true,
  useStock: true
})

const newPaletteMenu = new Gtk.PopoverMenu()
const newCollectionName = new Gtk.Entry({
  placeholderText: 'New collection name'
})

const newCollectionAdd = new Gtk.Button({
  label: 'Add'
})

const newPaletteBox = new Gtk.Box({
  spacing: 10,
  name: 'box'
})

newPaletteBox.get_style_context().add_class('box')

win.get_style_context()

newPaletteBox.add(newCollectionName)
newPaletteBox.add(newCollectionAdd)
newPaletteMenu.add(newPaletteBox)
newPaletteMenu.set_relative_to(newPaletteButton)

pickButton.connect('clicked', () => {
  currentCollection = null
  colorPicker.show_all()
})

newPaletteButton.connect('clicked', () => {
  log('create new palette')
  newPaletteMenu.set_relative_to(newPaletteButton)
  newPaletteMenu.show_all()
  newPaletteMenu.popup()
})

newCollectionName.connect('changed', () => {
  const text = newCollectionName.get_text()
  text
    ? newCollectionAdd.get_style_context().add_class(Gtk.STYLE_CLASS_SUGGESTED_ACTION)
    : newCollectionAdd.get_style_context().remove_class(Gtk.STYLE_CLASS_SUGGESTED_ACTION)
})

newCollectionAdd.connect('button_release_event', () => {
  const cat = new Category({ label: newCollectionName.get_text() })
  newCollectionName.set_text('')
  cat.connect('setCurrentCollection', (collection) => {
    log('set collection')
    currentCollection = collection
    colorPicker.show_all()
  })
  box.add(cat)
  newPaletteMenu.popdown()
})

const history = new Category({ label: 'History', history: true })
const site = new Category({ label: 'Website Client' })
const other = new Category({ label: 'Other site' })

site.connect('setCurrentCollection', (collection) => {
  log('set collection')
  currentCollection = collection
  colorPicker.show_all()
})

other.connect('setCurrentCollection', (collection) => {
  log('set collection')
  currentCollection = collection
  colorPicker.show_all()
})

colorPicker.connect('newColor', (w, color) => {
  log(color.to_string())
  label.set_text(color.to_string())
  log(color.hash())
  // cs.set_currrsent_rgba(color)
  // colorBtn.set_rgba(color)
  currentBox.forEach(box => box.set_rgba(color))
})

let currentBox
let currentCollection
colorPicker.connect('show', () => {
  // log('showshow')
  currentBox = []
  currentBox.push(history.addColor())
  currentCollection && currentBox.push(currentCollection.addColor())
})

const label = new Gtk.Label({ label: 'Select a color' })
// const colorBtn = new Gtk.ColorButton()
box.get_style_context().add_class('box')

box.add(label)
// box.add(colorBtn)
box.add(history)
box.add(site)
box.add(other)

header.add(pickButton)
header.add(newPaletteButton)

const scroll = new Gtk.ScrolledWindow({ vexpand: true })
scroll.add(box)
win.add(scroll)

// const cs = new Gtk.ColorSelection()
// box.add(cs)
// const hsv = new Gtk.HSV()
// box.add(hsv)

// Window
win.connect('destroy', () => Gtk.main_quit())
// win.get_style_context().add_provider(css, 0)

win.set_titlebar(header)
win.set_position(Gtk.WindowPosition.CENTER)
win.show_all()

Gtk.main()
