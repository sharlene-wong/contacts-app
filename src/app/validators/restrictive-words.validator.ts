import { AbstractControl, ValidationErrors } from "@angular/forms";

// AbstractControl is the base class for FormControl, FormGroup, and FormArray
// Returns ValidationErrors type or null
// export function restrictedWords(control: AbstractControl): ValidationErrors | null {
//   return control.value.includes('foo') ?
//   { restrictedWords: true } :
//   null;
// }

// Wrap it in another function to have multiple parameters
// Turns into an arrow function
export function restrictedWords(words: string[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const invalidWords = words
      .map(w => control.value.includes(w) ? w : null) // loop through the words and check if the control value includes any of them, return the word if it matches, otherwise return null
      .filter(w => w !== null); // want to filter out the nulls
    return invalidWords.length > 0
    ? { restrictedWords: invalidWords.join(', ') } :
      null;
  }
}
