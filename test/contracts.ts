import Ajv2020, { type AnySchemaObject } from "ajv/dist/2020";

export type ContractName =
  | "api/v1/about/show"
  | "api/v1/error"
  | "api/v1/home/show"
  | "api/v1/profile/show"
  | "api/v1/work/show"
  | "pages/bootstrap";

const CONTRACT_BASE_URI = "https://louisfreeman.co.uk/contracts/";
const FIXTURES_DIRECTORY = "../spec/fixtures/contracts/";

const schemaModules = import.meta.glob<AnySchemaObject>("../spec/contracts/**/*.json", {
  eager: true,
  import: "default",
});
const fixtureModules = import.meta.glob<unknown>("../spec/fixtures/contracts/**/*.json", {
  eager: true,
  import: "default",
});

const ajv = new Ajv2020({ allErrors: true, allowUnionTypes: true, strict: true });
Object.values(schemaModules).forEach((schema) => ajv.addSchema(schema));

export function contractViolations(contractName: ContractName, body: unknown): string[] {
  const validate = ajv.getSchema(`${CONTRACT_BASE_URI}${contractName}.json`);
  if (!validate) throw new Error(`No contract schema found for ${contractName}`);
  if (validate(body)) return [];

  return (validate.errors ?? []).map(
    (error) => `${error.instancePath || "/"}: ${error.message ?? error.keyword}`,
  );
}

export function contractFixture(contractName: ContractName): unknown {
  const fixture = fixtureModules[`${FIXTURES_DIRECTORY}${contractName}.json`];
  if (fixture === undefined) throw new Error(`No contract fixture found for ${contractName}`);

  return structuredClone(fixture);
}
