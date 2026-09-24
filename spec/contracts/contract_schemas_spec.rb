require "support/contract_matcher"

RSpec.describe ContractSchemas do
  %w[
    api/v1/about/show
    api/v1/error
    api/v1/home/show
    api/v1/profile/show
    api/v1/work/show
    pages/bootstrap
  ].each do |contract_name|
    context "with the #{contract_name} fixture" do
      subject(:body) { contract_fixture(contract_name:) }

      it "matches its contract" do
        expect(body).to match_contract(contract_name)
      end
    end
  end

  context "without a required key" do
    subject(:body) { contract_fixture(contract_name: "api/v1/home/show").tap { it["home"]["hero"].delete("tagline") } }

    it "fails the contract" do
      expect(body).not_to match_contract("api/v1/home/show")
    end
  end

  context "with a key the contract does not list" do
    subject(:body) do
      contract_fixture(contract_name: "api/v1/work/show").tap { it["work"]["case_studies"][0]["featured"] = true }
    end

    it "fails the contract" do
      expect(body).not_to match_contract("api/v1/work/show")
    end
  end

  context "with a diagram_key outside the enum" do
    subject(:body) do
      contract_fixture(contract_name: "api/v1/work/show").tap { it["work"]["case_studies"][0]["diagram_key"] = "maps" }
    end

    it "fails the contract" do
      expect(body).not_to match_contract("api/v1/work/show")
    end
  end

  context "with null in a non-nullable field" do
    subject(:body) { contract_fixture(contract_name: "api/v1/profile/show").tap { it["profile"]["email"] = nil } }

    it "fails the contract" do
      expect(body).not_to match_contract("api/v1/profile/show")
    end
  end

  context "with a broken shared Experience item" do
    subject(:body) do
      contract_fixture(contract_name: "api/v1/about/show").tap do |about|
        about["about"]["timeline"][0]["subs"] = [{ "date" => "x" }]
      end
    end

    it "fails the contract" do
      expect(body).not_to match_contract("api/v1/about/show")
    end
  end

  context "with an error code outside the enum" do
    subject(:body) { contract_fixture(contract_name: "api/v1/error").tap { it["errors"][0]["code"] = "forbidden" } }

    it "fails the contract" do
      expect(body).not_to match_contract("api/v1/error")
    end
  end

  context "with a bootstrap that embeds queries from another page" do
    subject(:body) do
      contract_fixture(contract_name: "pages/bootstrap").tap do |bootstrap|
        bootstrap["queries"]["work"] = contract_fixture(contract_name: "api/v1/work/show")
      end
    end

    it "fails the contract" do
      expect(body).not_to match_contract("pages/bootstrap")
    end
  end

  context "with a non-string ui value in the bootstrap" do
    subject(:body) { contract_fixture(contract_name: "pages/bootstrap").tap { it["ui"]["skip_to_content"] = 1 } }

    it "fails the contract" do
      expect(body).not_to match_contract("pages/bootstrap")
    end
  end

  describe "failure message" do
    subject(:failure_message) do
      matcher = match_contract("api/v1/profile/show")
      matcher.matches?(contract_fixture(contract_name: "api/v1/profile/show").tap { it["profile"]["email"] = nil })
      matcher.failure_message
    end

    it "names the JSON pointer of the mismatch" do
      expect(failure_message).to include("/profile/email")
    end
  end
end
