import React, { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import TokenMinterABI from "./TokenMinterABI.json"; // ABI for TokenMinter contract

const TokenMinterAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
  const [wallet, setWallet] = useState(null);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [fee, setFee] = useState("0.01"); // Default fee in MATIC
  const [isERC721, setIsERC721] = useState(false);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    setWallet(signer);
  };

  const createToken = async () => {
    if (!wallet) return alert("Please connect your wallet!");
    const contract = new ethers.Contract(TokenMinterAddress, TokenMinterABI, wallet);

    try {
      const tx = isERC721
        ? await contract.createERC721(name, symbol, { value: ethers.utils.parseEther(fee) })
        : await contract.createERC20(name, symbol, ethers.utils.parseUnits(supply, 18), { value: ethers.utils.parseEther(fee) });

      await tx.wait();
      alert("Token created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating token");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Polygon Token Minter</h2>
        <button
          onClick={connectWallet}
          className="w-full mb-4 bg-blue-500 text-white py-2 rounded"
        >
          {wallet ? "Wallet Connected" : "Connect Wallet"}
        </button>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Token Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Token Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {!isERC721 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Supply</label>
            <input
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fee (MATIC)</label>
          <input
            type="text"
            value={fee}
            disabled
            className="w-full p-2 border rounded bg-gray-200"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isERC721}
              onChange={(e) => setIsERC721(e.target.checked)}
              className="mr-2"
            />
            Create ERC-721 Token
          </label>
        </div>
        <button
          onClick={createToken}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Create Token
        </button>
      </div>
    </div>
  );
}

export default App;
