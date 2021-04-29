export interface MemberRole {
  title: string;
  genitiv: string;
}

const asMemberRoles = <T>(value: { [key in keyof T]: MemberRole }) => value;

export const MemberRoles = asMemberRoles({
  "dítě": {
    title: "dítě",
    genitiv: "dětí"
  },
  "instruktor": {
    title: "instruktor",
    genitiv: "instruktorů"
  },
  "vedoucí": {
    title: "vedoucí",
    genitiv: "vedoucích"
  }
});