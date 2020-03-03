export default {
  isDescendant(parent: Element, child: Element): boolean {
    let node: Node | null = child.parentNode;

    while (node !== null) {
      if (node === parent) {
        return true;
      }
      if (node) {
        node = node.parentNode;
      }
    }

    return false;
  },

  addClass(el: Element, className: string): void {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ` ${className}`;
    }
  },

  removeClass(el: Element, className: string): void {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
    }
  },

  hasClass(el: Element, className: string): boolean {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className);
    }
  },

  toggleClass(el: Element, className: string): void {
    if (this.hasClass(el, className)) {
      this.removeClass(el, className);
    } else {
      this.addClass(el, className);
    }
  },

  addClassToTag(tagName: string, className: string): void {
    const tag: Element = document.getElementsByTagName(tagName)[0];
    this.addClass(tag, className);
  },

  removeClassFromTag(tagName: string, className: string): void {
    const tag: Element = document.getElementsByTagName(tagName)[0];
    this.removeClass(tag, className);
  },
};
