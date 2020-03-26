interface WebCompProps {
  domain: string;
  entryName: string;
  templateName: string;
}

//getMicrofrontend can be used to import web-components in react
const getMicrofrontend = (props: WebCompProps) => {
  const { domain, entryName, templateName } = props;

  fetch(`${domain}/assets.json`)
    .then(response => {
      if (response.status === 200) {
        const resp = response.json();
        return resp;
      }
      return Promise.reject(Error('Error while fetching asset-manifest.json'));
    })
    .then(assets => {
      const header = templateName;
      const tmpl: HTMLTemplateElement = document.getElementById(header) as HTMLTemplateElement;

      //gets scripts and css from entrypoints
      assets.entrypoints[entryName].map((e: string) => {
        if (!e.includes('.map')) {
          if (e.includes('.css')) {
            // vendors css
            const vendorsInlineCSS = document.createElement('link');
            vendorsInlineCSS.setAttribute('href', `${domain}/${e}`);
            vendorsInlineCSS.rel = 'stylesheet';
            //cant append to a document fragment
            tmpl.innerHTML += vendorsInlineCSS.outerHTML;
          } else {
            // vendors js
            const vendorsInlineScript = document.createElement('script');
            vendorsInlineScript.setAttribute('src', `${domain}/${e}`);
            document.head.appendChild(vendorsInlineScript);
          }
        }
      });
    })
    .catch(error => {
      return Promise.reject(Error(error.message));
    });
};
export default getMicrofrontend;
