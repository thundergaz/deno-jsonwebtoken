import { ms } from './ms.ts'
import {isString, isNumber, isUndefined} from './assertType.ts'

export default function (time: string | number, iat: number) {
  const timestamp = iat || Math.floor(Date.now() / 1000)

  if (isString(time)) {
    const milliseconds = ms(time)
    if (isUndefined(milliseconds)) {
      return
    }
    return Math.floor(timestamp + milliseconds / 1000)
  } else if (isNumber(time)) {
    return timestamp + time
  } else {
    return
  }
}
