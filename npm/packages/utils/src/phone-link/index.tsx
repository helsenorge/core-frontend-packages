import * as React from "react";
import { isMobileUA } from "../is-mobile-ua";
import stringUtils from "../string-utils";

export default class PhoneLink extends React.Component<PhoneLinkProps, {}> {
  isMobilePhoneNumber(number: string): boolean {
    return (
      number.startsWith("9") || number.startsWith("4") || number.startsWith("8")
    );
  }

  isHotlinePhoneNumber(number: string): boolean {
    return number.length === 6;
  }

  // phone numbers might have prefixes like 0047 or +47
  getPhoneNumberPrefix(number: string): string {
    const length: number = number.length;
    if (length <= 8) {
      return "";
    }
    return number.substring(0, length - 8);
  }

  formatMobileNumber(number: string): string {
    const prefix: string = this.getPhoneNumberPrefix(number);
    const numberWithoutPrefix: string = number.replace(prefix, "");
    const start: string = numberWithoutPrefix.substring(0, 3);
    const middle: string = numberWithoutPrefix.substring(3, 5);
    const end: string = numberWithoutPrefix.substring(5, 8);
    if (prefix.length > 0) {
      return `${prefix} ${start} ${middle} ${end}`;
    }
    return `${start} ${middle} ${end}`;
  }

  formatHotlineNumber(number: string): string {
    const start: string = number.substring(0, 3);
    const end: string = number.substring(4, 6);
    return `${start} ${end}`;
  }

  formatNumber(number: string): string {
    const prefix: string = this.getPhoneNumberPrefix(number);
    const numberWithoutPrefix: string = number.replace(prefix, "");
    if (this.isMobilePhoneNumber(numberWithoutPrefix)) {
      return this.formatMobileNumber(number);
    }

    if (this.isHotlinePhoneNumber(numberWithoutPrefix)) {
      return this.formatHotlineNumber(number);
    }

    const start: string = numberWithoutPrefix.substring(0, 2);
    const middle: string = numberWithoutPrefix.substring(2, 4);
    const middle2: string = numberWithoutPrefix.substring(4, 6);
    const end: string = numberWithoutPrefix.substring(6);
    if (prefix.length > 0) {
      return `${prefix} ${start} ${middle} ${middle2} ${end}`;
    }
    return `${start} ${middle} ${middle2} ${end}`;
  }

  render(): React.ReactElement<{}> | null {
    const { formatNumber }: PhoneLinkProps = this.props;
    if (!this.props.number) {
      return null;
    }

    let number: string = this.props.number;

    if (formatNumber !== undefined && formatNumber) {
      number = this.formatNumber(number);
    }

    const numberText: string = this.props.stringWrapper
      ? stringUtils.format(this.props.stringWrapper, [number])
      : number;

    if (
      this.props.onlyClickableOnMobile !== undefined &&
      this.props.onlyClickableOnMobile
    ) {
      if (!isMobileUA()) {
        return <span>{numberText}</span>;
      }
    }

    const phoneLink = `tel:${number.replace(/\s/g, "")}`;

    const classes: string = this.props.className || "number";

    return (
      <a className={classes} href={phoneLink}>
        {numberText}
      </a>
    );
  }
}

export interface PhoneLinkProps {
  className?: string;
  number?: string;
  onlyClickableOnMobile?: boolean;
  formatNumber?: boolean;
  stringWrapper?: string;
}
