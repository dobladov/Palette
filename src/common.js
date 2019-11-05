/* global imports */
const { Gdk } = imports.gi

// eslint-disable-next-line no-unused-vars
function getColor (x, y) {
  // Get the window
  const root = Gdk.get_default_root_window()

  // Create screenshot of 1 x 1 px at x, y
  const screenshot = Gdk.pixbuf_get_from_window(root, x, y, 1, 1)
  const pixels = screenshot.get_pixels()

  const red = pixels[0]
  const green = pixels[1]
  const blue = pixels[2]

  const color = new Gdk.RGBA()
  color.parse(`rgba(${red}, ${green}, ${blue}, 1)`)
  return color
}
