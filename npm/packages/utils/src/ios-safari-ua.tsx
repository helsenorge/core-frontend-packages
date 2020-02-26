export default function handleIOSSafariUA(): void {
  if (!document.body.classList.contains("ios-safari")) {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari =
      iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i);
    if (iOSSafari) {
      document.body.classList.add("ios-safari");
    }
  }
}
