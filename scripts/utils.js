export const maxSquareSize = (dimx,dimy,container) => {
    const x = dimx % 2 === 0 ? dimx + 1 : dimx
    const y = dimy % 2 === 0 ? dimy + 1 : dimy
    return Math.floor(Math.min(
      container.offsetWidth / x - 0.5,
      container.offsetHeight / y - 0.5
    ))
  }

export const applySquareSize = (dimx, dimy, container) => {
    // compute square size
    const size = maxSquareSize(dimx,dimy,container)
    console.log("foo",size)
    // get last style sheet in list
    const sheet = [...document.styleSheets].slice(-1)[0]
    // remove rule if already present
    sheet.cssRules[0].selectorText === ".square" &&  sheet.deleteRule(0)
    // add new rule with computed square size values
    sheet.insertRule(`.square {width:${size}px; height:${size}px}`,0)
}