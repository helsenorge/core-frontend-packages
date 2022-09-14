import * as React from 'react';

export interface CustomTagProps {
  id?: string;
  tabIndex?: number;
  tagName: string;
  className?: string;
  focus?: boolean;
  children: React.ReactNode;
}

export default class CustomTag extends React.Component<CustomTagProps, {}> {
  ctrls: {
    tag?: HTMLElement;
  } = {};

  componentDidMount() {
    if (this.props.focus) {
      if (this.ctrls.tag) {
        this.ctrls.tag.focus();
      }
    }
  }

  componentDidUpdate(prevProps: CustomTagProps) {
    if (this.props.focus) {
      if (this.props.tagName !== prevProps.tagName) {
        if (this.ctrls.tag) {
          this.ctrls.tag.focus();
        }
      }
    }
  }

  createMarkup(markup: React.ReactNode) {
    return { __html: markup };
  }

  render() {
    const { id, tabIndex, tagName, className, focus } = this.props;
    const CustomTagName = tagName;
    return (
      /* eslint-disable  @typescript-eslint/ban-ts-comment */
      // @ts-ignore https://github.com/Microsoft/TypeScript/issues/28892
      <CustomTagName
        // @ts-ignore https://github.com/Microsoft/TypeScript/issues/28892
        className={className}
        id={id}
        tabIndex={focus ? 0 : tabIndex}
        ref={(tag: HTMLElement): HTMLElement => (this.ctrls.tag = tag)}
        dangerouslySetInnerHTML={this.createMarkup(this.props.children)}
      />
    );
  }
}
