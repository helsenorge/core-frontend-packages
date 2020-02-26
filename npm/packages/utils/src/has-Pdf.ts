import { isMobileUA } from "./is-mobile-ua";
import { isTabletUA } from "./is-tablet-ua";
import { getAssets } from "./page";
import { loadScriptES6 } from "./loadscript-utils";

interface PluginDetectInterface {
  onDetectionDone?: (plugin: string, f: () => void, dummyPDF: string) => void;
  isMinVersion?: (plugin: string) => number;
}
declare let PluginDetect: PluginDetectInterface;

export function hasPdf(): boolean {
  function hasAcrobatInstalled(): ActiveXObject {
    function getActiveXObject(name: string) {
      try {
        return new ActiveXObject(name);
      } catch (e) {
        // Do nothing
      }
    }
    return getActiveXObject("AcroPDF.PDF") || getActiveXObject("PDF.PdfCtrl");
  }

  if (navigator.mimeTypes["application/pdf"] || hasAcrobatInstalled()) {
    return true;
  } else {
    return false;
  }
}

function isFirefox(): boolean {
  return navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
}

function isAndroid(): boolean {
  return navigator.userAgent.toLowerCase().indexOf("android") > -1;
}

export function handlePdfOpening(pdfUrl: string): Promise<boolean> {
  const pdfCompatibility: Promise<boolean> = new Promise(function(
    resolve,
    reject
  ) {
    let pdfIncompatible = false;
    if (isAndroid()) {
      pdfIncompatible = true;
    } else if (isMobileUA() || isTabletUA()) {
      window.open(pdfUrl);
    } else if (isFirefox()) {
      isPdfIncompatibleFF(resolve, pdfUrl);
      return pdfCompatibility;
    } else if (!hasPdf()) {
      pdfIncompatible = true;
    } else {
      window.open(pdfUrl);
    }
    // resolve
    resolve(pdfIncompatible);

    // reject
    const err = new Error("Error during handlePdfOpening");
    reject(err);
  });

  return pdfCompatibility;
}

function isPdfIncompatibleFF(
  resolve: (value?: boolean) => void,
  pdfUrl: string
): void {
  // For å omgå popup-blokkering må vi åpne nytt vindu før async-kall.
  const newWindow: Window | null = window.open();
  const scriptUrl = `${getAssets()}/hn.portal/js/plugindetectpdfjs.js`;
  loadScriptES6(scriptUrl).then(
    () => {
      newWindow &&
        PluginDetect &&
        PluginDetect.onDetectionDone &&
        PluginDetect.onDetectionDone(
          "PDFjs",
          () => {
            const result: number =
              PluginDetect && PluginDetect.isMinVersion
                ? PluginDetect.isMinVersion("PDFjs")
                : -1;
            // Hack: Delete document.documentMode for problems with React browser check

            if (
              "documentMode" in document &&
              typeof document["documentMode"] === "undefined"
            ) {
              delete document["documentMode"];
            }

            if (result === 0) {
              // PDF.js is used as default
              newWindow.location.href = pdfUrl;
              resolve(false);
            } else if (result === -1) {
              // PDF.js will not be used
              newWindow.close();
              resolve(true);
            }
          },
          getAssets() + "/hn.portal/assets/dummy.pdf"
        );
    },
    () => {
      console.log("fail to load script: ", scriptUrl);
    }
  );
}
