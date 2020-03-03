export function capitalize(capitalizeMe: string): string {
  const capitalized: string = capitalizeMe.charAt(0).toUpperCase() + capitalizeMe.substring(1);
  return capitalized;
}
export function decapitalize(decapitalizeMe: string): string {
  const decapitalized: string = decapitalizeMe.charAt(0).toLowerCase() + decapitalizeMe.substring(1);
  return decapitalized;
}
// Replaces items in string with format {number} ex: {2}, starting from 0
// Paramtere args is a array in order you want them replaced ex: ['foo', 'bar']
// Returns a new string where values has been replaced
// Note: The order of elements in string decide what order it should be replaced, not number!
export function format(formatString: string, args: string[], allowEmptyStrings?: boolean): string {
  return formatString.replace(/{(\d+)}/g, function replace(match: string, number: number): string {
    if (allowEmptyStrings) {
      return args[number];
    }
    return args[number] ? args[number] : match;
  });
}

export default {
  capitalize,
  decapitalize,
  format,
};
