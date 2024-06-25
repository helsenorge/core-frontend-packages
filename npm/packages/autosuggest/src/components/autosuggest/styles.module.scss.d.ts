export type Styles = {
  container: string;
  containerOpen: string;
  input: string;
  suggestion: string;
  suggestionHighlighted: string;
  suggestionsContainer: string;
  suggestionsList: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
