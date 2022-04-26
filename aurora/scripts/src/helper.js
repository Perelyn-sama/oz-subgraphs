const Web3 = require("web3");
const BRLMasterChef = require("../abis/BRLMasterChef.json");
const BRLToken = require("../abis/BRLToken.json");
const BigNumber = require("bignumber.js");

require("dotenv").config();

async function main() {
  const BRL_CHEF_ADDR = "0x35CC71888DBb9FfB777337324a4A60fdBAA19DDE";
  const network = process.env.AURORA_NETWORK;

  const web3 = new Web3(new Web3.providers.HttpProvider(network));
  const BRL_CHEF = new web3.eth.Contract(BRLMasterChef, BRL_CHEF_ADDR);

  const rewardTokenAddress = await BRL_CHEF.methods.BRL().call();
  const BRL_TKN = new web3.eth.Contract(BRLToken, rewardTokenAddress);
  const BRL_DECIMALS = await BRL_TKN.methods.decimals().call();

  const currentBlock = await web3.eth.getBlockNumber();

  const multiplier = await BRL_CHEF.methods
    .getMultiplier(currentBlock, currentBlock + 1)
    .call();

  const BRLPerBlock = await BRL_CHEF.methods.BRLPerBlock().call();

  const rewardsPerWeek = ((BRLPerBlock / 1e18) * multiplier * 604800) / 1.1;
  const other = ((BRLPerBlock / 10 ** BRL_DECIMALS) * 604800) / 3;

  console.log(other);
  return rewardsPerWeek;
}
main().then((res) => console.log(res));
