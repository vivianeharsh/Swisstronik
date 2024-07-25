const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpcLink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = ""; // Contract deployed
  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory(""); 
  const contract = contractFactory.attach(contractAddress);

  const functionName = "transfer";
  const recipientAddress = ""; // Địa chỉ nhận
  const amount = (1 * (10 ** 18)).toString(); // Số lượng token gửi

  const transaction = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, [recipientAddress, amount]),
    0
  );

  await transaction.wait();

  console.log("Transaction Response: ", transaction);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
