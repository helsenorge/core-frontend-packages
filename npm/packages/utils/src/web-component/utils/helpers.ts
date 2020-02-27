
import { WebcompProps } from '../';



export const styleInjector = (props: WebcompProps, shadowroot: ShadowRoot) => {
    if (props.styleoverwrite) {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = props.styleoverwrite;
        shadowroot.appendChild(styleTag);
    }
};
