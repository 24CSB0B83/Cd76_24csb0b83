/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ErrorRule {
  type: string;
  pattern: RegExp;
  meaning: string;
  why: string;
  fix: string[];
  beginnerFriendly: string;
}

export const PYTHON_RULES: ErrorRule[] = [
  {
    type: "NameError",
    pattern: /NameError: name '(.+)' is not defined/,
    meaning: "You're trying to use a name (variable or function) that the computer doesn't recognize.",
    why: "This usually happens because the variable was never created, it's misspelled, or it was defined in a different part of the code that can't be reached here.",
    fix: [
      "Check if you spelled the name correctly.",
      "Ensure you defined the variable before using it.",
      "Check if the variable is defined inside a function (local scope) but you're trying to use it outside."
    ],
    beginnerFriendly: "It's like calling a friend by the wrong name—they won't know you're talking to them!"
  },
  {
    type: "SyntaxError",
    pattern: /SyntaxError: invalid syntax|SyntaxError: expected '(.+)'/,
    meaning: "There is a 'grammar' mistake in your code that prevents Python from understanding it.",
    why: "Python has strict rules about how code should be written. A missing colon, an extra parenthesis, or a misspelled keyword breaks these rules.",
    fix: [
      "Look at the line indicated by the error and the line right above it.",
      "Check for missing colons (:) at the end of 'if', 'for', 'while', or 'def' statements.",
      "Ensure all opening brackets ( [ { have matching closing ones ) ] }."
    ],
    beginnerFriendly: "Think of it like a sentence missing a period or having a typo—it just doesn't make sense to the reader."
  },
  {
    type: "IndentationError",
    pattern: /IndentationError: expected an indented block|IndentationError: unexpected indent/,
    meaning: "The spacing at the beginning of your code lines is incorrect.",
    why: "Python uses spaces (indentation) to know which lines of code belong together in a group (like inside a loop or a function).",
    fix: [
      "Make sure all lines inside a block (like after an 'if' or 'for') are shifted to the right by the same amount of spaces.",
      "Don't mix tabs and spaces.",
      "Check if you forgot to indent after a colon (:)."
    ],
    beginnerFriendly: "It's like a list where some items aren't lined up properly—it makes it hard to see which items belong to which category."
  },
  {
    type: "TypeError",
    pattern: /TypeError: (.+)/,
    meaning: "You're trying to do something with a piece of data that its 'type' doesn't allow.",
    why: "For example, you might be trying to add a number to a string of text, or trying to 'call' a number like it's a function.",
    fix: [
      "Check the types of your variables using the type() function.",
      "Convert data types if needed (e.g., use str(number) to turn a number into text).",
      "Ensure you aren't using parentheses () on something that isn't a function."
    ],
    beginnerFriendly: "It's like trying to put a square peg in a round hole—the shapes just don't match!"
  },
  {
    type: "IndexError",
    pattern: /IndexError: list index out of range/,
    meaning: "You're trying to access an item in a list using a position (index) that doesn't exist.",
    why: "If a list has 3 items, the positions are 0, 1, and 2. If you ask for position 3, Python gets confused because there's nothing there.",
    fix: [
      "Remember that Python starts counting at 0.",
      "Check the length of your list using len(list_name).",
      "Make sure your index is less than the length of the list."
    ],
    beginnerFriendly: "It's like trying to go to the 5th floor of a 3-story building—you can't get there!"
  },
  {
    type: "KeyError",
    pattern: /KeyError: '(.+)'/,
    meaning: "You're looking for a specific label (key) in a dictionary, but that label isn't there.",
    why: "Dictionaries store data in pairs (label: value). You asked for a label that hasn't been added to the dictionary yet.",
    fix: [
      "Check if you spelled the key correctly.",
      "Use the .get() method to avoid errors if a key might be missing.",
      "Check if the key was actually added to the dictionary."
    ],
    beginnerFriendly: "It's like looking for 'Apples' in a fruit basket that only has 'Oranges' and 'Bananas'."
  }
];

export const QUERY_RESPONSES = {
  why: (rule: ErrorRule) => rule.why,
  fix: (rule: ErrorRule) => `Here's how to fix it:\n${rule.fix.map(f => `• ${f}`).join('\n')}`,
  meaning: (rule: ErrorRule) => rule.meaning,
  beginner: (rule: ErrorRule) => rule.beginnerFriendly,
  unknown: "I'm not sure about that specific question. Try asking 'Why did this happen?', 'How can I fix it?', or 'Explain it simply'."
};
