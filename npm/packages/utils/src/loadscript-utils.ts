/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-inferrable-types */
export const loadScriptES6 = (source: string, beforeEl?: HTMLScriptElement, async: boolean = true, defer: boolean = true) => {
  return new Promise((resolve, reject) => {
    let script: any = document.createElement('script');

    const prior = beforeEl || document.getElementsByTagName('script')[0];

    script.async = async;
    script.defer = defer;

    function onloadHander(_: any, isAbort: any) {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = null;
        script.onreadystatechange = null;
        script = undefined;

        if (isAbort) {
          reject();
        } else {
          resolve();
        }
      }
    }

    script.onload = onloadHander;
    script.onreadystatechange = onloadHander;

    script.src = source;
    if (prior.parentNode) prior.parentNode.insertBefore(script, prior);
  });
};

export default { loadScriptES6 };

/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-inferrable-types */
