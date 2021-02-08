import { getAssets } from './hn-page';
import { loadScriptES6 } from './loadscript-utils';

interface PluginDetectInterface {
  onDetectionDone?: (plugin: string, f: () => void, dummyPDF: string) => void;
  isMinVersion?: (plugin: string) => number;
}
declare let PluginDetect: PluginDetectInterface;

const isFirefox = (): boolean => {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
};

const isAndroid = (): boolean => {
  return navigator.userAgent.toLowerCase().indexOf('android') > -1;
};

const isPdfIncompatibleFF = (resolve: (value?: boolean) => void, pdfUrl: string): void => {
  // For å omgå popup-blokkering må vi åpne nytt vindu før async-kall.
  const newWindow: Window | null = window.open();
  // Full documentation: http://www.pinlady.net/PluginDetect/PDFjs/
  const scriptUrl = `${getAssets()}/forside/static/js/detectpdf.min.js`;
  loadScriptES6(scriptUrl).then(
    () => {
      newWindow &&
        PluginDetect &&
        PluginDetect.onDetectionDone &&
        PluginDetect.onDetectionDone(
          'PDFjs',
          () => {
            const result: number = PluginDetect && PluginDetect.isMinVersion ? PluginDetect.isMinVersion('PDFjs') : -1;
            // Hack: Delete document.documentMode for problems with React browser check
            if ('documentMode' in document && typeof document['documentMode'] === 'undefined') {
              delete document['documentMode'];
            }

            if (result === 0) {
              // Returns 0 if installed & enabled and is the default PDF viewer in the browser. The version of the viewer is unknown. PDF documents will be displayed in the browser using PDF.js
              newWindow.location.href = pdfUrl;
              resolve(false);
            } else if (result === -1) {
              // Returns -1 if not installed or not enabled or is not the default viewer. PDF.js will NOT be used to display PDF documents in the browser.
              newWindow.close();
              resolve(true);
            }
          },
          `${getAssets()}/forside/static/media/empty.pdf`
        );
    },
    () => {
      console.log('fail to load script: ', scriptUrl);
    }
  );
};

/**
 * Returnerer en boolean som sier om nettleseren støtter eller ikke pdf
 */
export const hasPdf = (): boolean => {
  function hasAcrobatInstalled(): ActiveXObject | null {
    function getActiveXObject(name: string): ActiveXObject | void {
      try {
        return new ActiveXObject(name);
      } catch (e) {
        // Do nothing
      }
    }
    return getActiveXObject('AcroPDF.PDF') || getActiveXObject('PDF.PdfCtrl') || null;
  }

  if (navigator.mimeTypes['application/pdf'] || hasAcrobatInstalled()) {
    return true;
  } else {
    return false;
  }
};

/**
 * Returnerer en Promise med incompatible (boolean) som param til resolve
 * @param pdfUrl url til pdf filen
 */
export const handlePdfOpening = (pdfUrl: string): Promise<boolean> => {
  const pdfCompatibility: Promise<boolean> = new Promise(function(resolve, reject) {
    let pdfIncompatible = false;
    if (isAndroid()) {
      pdfIncompatible = true;
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
    const err = new Error('Error during handlePdfOpening');
    reject(err);
  });

  return pdfCompatibility;
};
