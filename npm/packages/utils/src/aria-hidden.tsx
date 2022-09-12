/*
 * aria hidden
 * ----------------
 * Traverse dom upwards and set aria-hidden on all siblings.
 * Used on modals to hide all other content from screen readers when modal
 * is placed within wrappers in dom, and we are unable to set aria-hidden on the rest
 * of the page.
 *
 * Example:
 * <article>
 *   <div>
 *     <h1>Page title</h1>
 *   </div>
 *   <div role="dialog" id="modal">
 *
 *   </div>
 * </article>
 *
 * Here we are unable to set aria-hidden on article as it would also hide the modal.
 * The script then traverses the dom upwards and set aria-hidden on all siblings of parent element
 * until it reaches the body element.
 *
 */

export interface Siblings {
  allSiblings: Array<Element>;
  ariaHiddens: Array<AriaElement>;
}

export interface AriaElement {
  elIndex: number;
  val: string;
}

export default {
  setAriaHidden(domEl: Element): Siblings {
    // Set aria hidden on siblings
    const siblings: Siblings = this._getSiblings(domEl);
    for (let i = 0; i < siblings.allSiblings.length; i++) {
      siblings.allSiblings[i].setAttribute('aria-hidden', 'true');
    }

    // Return siblings so aria-hiddens can be restored later
    return siblings;
  },
  resetAriaHidden(siblings: Siblings): Siblings | void {
    if (siblings) {
      siblings.allSiblings.forEach(sibling => {
        sibling.removeAttribute('aria-hidden');
      });
      siblings.ariaHiddens.forEach(sibling => {
        siblings.allSiblings[sibling.elIndex].setAttribute('aria-hidden', sibling.val);
      });

      return siblings;
    }
  },
  _getSiblings(domEl: Element | null): Siblings {
    // Get siblings
    const siblings: Siblings = { allSiblings: [], ariaHiddens: [] };
    let x = 0;
    while (domEl && domEl !== document.body) {
      if (domEl.parentElement) {
        for (let i = 0; i < domEl.parentElement.children.length; i++) {
          const child: Element = domEl.parentElement.children[i];
          if (child.nodeType === 1 && child !== domEl) {
            // If element already has aria set, store it for later
            if (child.hasAttribute('aria-hidden')) {
              const value = child.getAttribute('aria-hidden');
              if (value) {
                siblings.ariaHiddens.push({ elIndex: x, val: value.toString() });
              }
            }
            siblings.allSiblings.push(child);
            x++;
          }
        }
      }

      domEl = domEl.parentElement;
    }
    return siblings;
  },
};
