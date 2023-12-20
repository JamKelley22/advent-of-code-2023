export const Categories = ["x", "m", "a", "s"] as const;
export type Category = (typeof Categories)[number];

export function isOfTypeCategory(keyInput: string): keyInput is Category {
  return Categories.includes(keyInput as Category);
}

export type Part = { [category in Category]: number };

export type Rule = {
  condition: (part: Part) => boolean;
  toWorkflowOnPassCondition: string;
};
export type Workflow = {
  name: string;
  rules: Rule[];
  //   partQueue: Part[];
};
