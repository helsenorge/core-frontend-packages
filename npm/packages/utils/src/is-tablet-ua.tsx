//ubrukt
export function isTabletUA(): boolean {
  let check = false;
  if (navigator.userAgent.match(/(tablet|ipad)|(android(?!.*mobile))/i)) {
    check = true;
  }
  return check;
}
