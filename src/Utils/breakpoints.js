const size = {
  xs: '375px',
  sm: '768px',
  lg: '1200px',
 }
const devicemin = {
  xs: `(min-width: ${size.xs})`,
  sm: `(min-width: ${size.sm})`,
  lg: `(min-width: ${size.lg})`
 }
const devicemax = {
  xs: `(max-width: ${size.xs})`,
  sm: `(max-width: ${size.sm})`,
  lg: `(max-width: ${size.lg})`
 }

export {devicemax, devicemin}
