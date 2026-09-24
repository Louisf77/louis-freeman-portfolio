import { contractFixture, contractViolations, type ContractName } from "@test/contracts";
import { describe, expect, it } from "vitest";

const CONTRACT_NAMES: ContractName[] = [
  "api/v1/about/show",
  "api/v1/error",
  "api/v1/home/show",
  "api/v1/profile/show",
  "api/v1/work/show",
  "pages/bootstrap",
];

interface BrokenFixture {
  break: (body: Record<string, Record<string, unknown>>) => void;
  contractName: ContractName;
  scenario: string;
}

function firstItem(list: unknown): Record<string, unknown> {
  return (list as Record<string, unknown>[])[0] ?? {};
}

const BROKEN_FIXTURES: BrokenFixture[] = [
  {
    break: (body) => {
      delete (body.home?.hero as Record<string, unknown>).tagline;
    },
    contractName: "api/v1/home/show",
    scenario: "a missing required key",
  },
  {
    break: (body) => {
      firstItem(body.work?.case_studies).featured = true;
    },
    contractName: "api/v1/work/show",
    scenario: "a key the contract does not list",
  },
  {
    break: (body) => {
      firstItem(body.work?.case_studies).diagram_key = "maps";
    },
    contractName: "api/v1/work/show",
    scenario: "a diagram_key outside the enum",
  },
  {
    break: (body) => {
      (body.profile as Record<string, unknown>).email = null;
    },
    contractName: "api/v1/profile/show",
    scenario: "null in a non-nullable field",
  },
  {
    break: (body) => {
      firstItem(body.about?.timeline).subs = [{ date: "x" }];
    },
    contractName: "api/v1/about/show",
    scenario: "a broken shared Experience item",
  },
  {
    break: (body) => {
      firstItem(body.errors).code = "forbidden";
    },
    contractName: "api/v1/error",
    scenario: "an error code outside the enum",
  },
  {
    break: (body) => {
      (body.queries as Record<string, unknown>).work = contractFixture("api/v1/work/show");
    },
    contractName: "pages/bootstrap",
    scenario: "a bootstrap embedding another page's query",
  },
  {
    break: (body) => {
      (body.ui as Record<string, unknown>).skip_to_content = 1;
    },
    contractName: "pages/bootstrap",
    scenario: "a non-string ui value",
  },
];

describe("contract fixtures", () => {
  it.each(CONTRACT_NAMES)("%s fixture matches its contract", (contractName) => {
    expect(contractViolations(contractName, contractFixture(contractName))).toEqual([]);
  });

  it.each(BROKEN_FIXTURES)(
    "$contractName with $scenario fails its contract",
    ({ break: breakFixture, contractName }) => {
      const body = contractFixture(contractName) as Record<string, Record<string, unknown>>;
      breakFixture(body);

      expect(contractViolations(contractName, body)).not.toEqual([]);
    },
  );

  it("names the JSON pointer of the mismatch", () => {
    const body = contractFixture("api/v1/profile/show") as Record<string, Record<string, unknown>>;
    (body.profile as Record<string, unknown>).email = null;

    expect(contractViolations("api/v1/profile/show", body)).toContainEqual(
      expect.stringContaining("/profile/email"),
    );
  });
});
