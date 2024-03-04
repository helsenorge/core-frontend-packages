import { FormatLongWidth, FormatLongFn } from 'date-fns';

export interface BuildFormatLongFnArgs<DefaultMatchWidth extends FormatLongWidth> {
  formats: Partial<{ [format in FormatLongWidth]: string }> & {
    [format in DefaultMatchWidth]: string;
  };
  defaultWidth: DefaultMatchWidth;
}

export function buildFormatLongFn<DefaultMatchWidth extends FormatLongWidth>(args: BuildFormatLongFnArgs<DefaultMatchWidth>): FormatLongFn {
  return (options = {}) => {
    // TODO: Remove String()
    const width = options.width ? (String(options.width) as FormatLongWidth) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}
