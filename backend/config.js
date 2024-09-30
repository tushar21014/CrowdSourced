const dotenv = require("dotenv");
const path = require("path");
const env = dotenv.config({
  path: path.join(__dirname, ".env"),
});

if (env.error) {
  throw new Error("no env file found");
}

module.exports = {
  rpc: {
    pos: {
      parent: process.env.ROOT_RPC || "https://rpc.sepolia.org",
      child: process.env.MATIC_RPC || "https://rpc-amoy.polygon.technology",
    },
  },
  pos: {
    parent: {
      erc20: "0xb480378044d92C96D16589Eb95986df6a97F2cFB",
    },
    child: {
      erc20: "0x7C5352767B9c7b29d5248dc3420825A5F43FE777",
    },
  },

  SYNCER_URL: "https://testnetv3-syncer.api.matic.network/api/v1", // Backend service which syncs the Matic sidechain state to a MySQL database which we use for faster querying. This comes in handy especially for constructing withdrawal proofs while exiting assets from Plasma.
  WATCHER_URL: "https://testnetv3-watcher.api.matic.network/api/v1", // Backend service which syncs the Matic Plasma contract events on Ethereum mainchain to a MySQL database which we use for faster querying. This comes in handy especially for listening to asset deposits on the Plasma contract.
  user1: {
    // '<paste your private key here>' - A sample private key prefix with `0x`
    privateKey: process.env.USER1_PRIVATE_KEY,
    //'<paste address belonging to private key here>', Your address
    address: process.env.USER1_FROM,
  },
  user2: {
    address: process.env.USER2_FROM,
  },
  proofApi:
    process.env.PROOF_API || "https://proof-generator.polygon.technology/",
};
