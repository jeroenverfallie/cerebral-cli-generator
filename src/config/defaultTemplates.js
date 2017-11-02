export const chain = `export default [
  () => { throw new Error('Unimplemented cerebral chain {IDENTIFIER}'); }
];
`;

export const signal = `export default [
  () => { throw new Error('Unimplemented cerebral signal {IDENTIFIER}'); }
];
`;

export const factory = `export default ({FACTORYARGUMENTS}) => {
  {ASYNC}function {IDENTIFIER}({ {ARGUMENTS} }) {
    {INFO}throw new Error('Unimplemented cerebral factory {IDENTIFIER}');
  }
  return {IDENTIFIER};
};
`;

export const action = `{ASYNC}function {IDENTIFIER}({ {ARGUMENTS} }) {
  {INFO}throw new Error('Unimplemented cerebral action {IDENTIFIER}');
}
export default {IDENTIFIER};
`;
