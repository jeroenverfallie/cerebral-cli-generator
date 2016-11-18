export const chain = `export default [
  () => { throw new Error('Unimplemented cerebral chain {IDENTIFIER}'); }
];
`;

export const signal = `export default [
    () => throw new Error('Unimplemented cerebral signal {IDENTIFIER}')
];
`;

export const factory = `export default ({FACTORYARGUMENTS}) => {
  function {IDENTIFIER}({{ARGUMENTS}}) {
    throw new Error('Unimplemented cerebral factory {IDENTIFIER}');
  }
{OUTPUTS}{ASYNC}
  return {IDENTIFIER};
};
`;

export const action = `function {IDENTIFIER}({{ARGUMENTS}}) {
  throw new Error('Unimplemented cerebral action {IDENTIFIER}');
}
{OUTPUTS}{ASYNC}
export default {IDENTIFIER};
`;
