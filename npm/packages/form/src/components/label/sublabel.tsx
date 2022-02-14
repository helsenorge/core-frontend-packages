import * as React from 'react';

import toolkitstyles from './styles.module.scss';

interface Props extends React.PropsWithChildren<{}> {
  /** Tekst som vises som sublabel */
  sublabelText?: string | JSX.Element;
}

export const Sublabel: React.FC<Props> = ({ sublabelText }: Props) => {
  return <span className={toolkitstyles.label__sublabel}>{sublabelText}</span>;
};
