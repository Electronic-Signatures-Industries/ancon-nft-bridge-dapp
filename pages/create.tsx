import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";

// components
import Header from "../components/Header";
import ErrorMessage from "../components/ErrorMessage";

// storage
import { Web3Storage } from "web3.storage";
import { ethers } from "ethers";
import useProvider from "../hooks/useProvider";
import { addressState } from "../atoms/addressAtom";
import Web3 from "web3";
import { errorState } from "../atoms/errorAtom";
import { base64 } from "ethers/lib/utils";
import { AnconProtocol__factory } from "../types/ethers-contracts/factories/AnconProtocol__factory";
import enrollL2Account from "../functions/EnrollL2Account";
import toAbiProof from "../functions/ToAbiProof";
import getTransaction from "../functions/GetTransaction";
import { get } from "https";
import GetPublicKey from "../functions/GetPublicKey";

//Contracts
const AnconToken = require("../contracts/ANCON.sol/ANCON.json");
const AnconNFT = require("../contracts/AnconNFT.sol/AnconNFT.json");
declare let document: any;
function Create() {
  const [step, setStep] = useState(0);
  const [localImage, setLocalImage] = useState<any | null>(null);
  const [image, setImage] = useState<any | null>(null);
  const [error, setError] = useState(false);
  const[message, setMessage] = useState('')
  const [DIDcid, setDIDCid] = useState<string>("");
  const [tokenData, setTokenData] = useState({
    name: "",
    description: "",
    imageCid: "",
    tokenCid: "",
  });
  const [address, setAddress] = useRecoilState(addressState);
  const [errorModal, setErrorModal] = useRecoilState(errorState);
  const [transactionHash, setTransactionHash] = useState({
    transaction: "",
    name: "",
  });
  const router = useRouter();
  const provider = useProvider();
  const clickInput = () => document.getElementById("nft-img").click();

  //step 0 //

  // STEP 0  gets the public key and handle the get did//
  //get the public key
  const getDid = async () => {
    // check if the a name written
    if (transactionHash.name === "") {
      setError(true);
      return;
    } else {
      setError(false);
    }
    try {
      const provider = ethers.getDefaultProvider();
      // check if the user has made any transaction
      const trans = await getTransaction(
        setStep,
        address,
        setErrorModal
      );
      const transaction: any = await provider.getTransaction(trans);

      // join the signature
      const sig = ethers.utils.joinSignature({
        r: transaction.r,
        s: transaction.s,
        v: transaction.v,
      });
      const getPublicKey = await GetPublicKey(transaction, sig)
      const pubkey = getPublicKey[1]
      const recoveredAddress = getPublicKey[0]
      // // get the txData
      // const txData = {
      //   gasPrice: transaction.gasPrice,
      //   gasLimit: transaction.gasLimit,
      //   value: transaction.value,
      //   nonce: transaction.nonce,
      //   data: transaction.data,
      //   chainId: transaction.chainId,
      //   to: transaction.to,
      // };

      // const rsTx = await ethers.utils.resolveProperties(txData);
      // // returns RLP encoded tx
      // const raw = ethers.utils.serializeTransaction(rsTx);
      // // not sure about this step but it made it work
      // const msgHash = ethers.utils.keccak256(raw);
      // // create binary hash
      // const msgBytes = ethers.utils.arrayify(msgHash);

      // const pubkey = ethers.utils.recoverPublicKey(msgBytes, sig);
      // const recoveredAddress = ethers.utils.recoverAddress(
      //   msgBytes,
      //   sig
      // );
      // console.log(
      //   "addresses are equal ==>",
      //   recoveredAddress === transaction.from
      // );

      // if the address are equal procced to get the proof
      if (recoveredAddress === transaction.from) {
        setStep(-1);
        setTimeout(() => {
          handleProof(pubkey);
        }, 2000);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //get the cid and the proof
  const handleProof = (pubkey: string) => {
    const base58Encode = ethers.utils.base58.encode(pubkey);
    //post to get the did
    const payload = {
      domainName: transactionHash.name,
      pub: base58Encode,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    try {
      const getDid = async () => {
        const rawdata = await fetch(
          "https://api.ancon.did.pa/v0/did/web",
          requestOptions
        );
        const data = await rawdata.json();
        const proofCID: any = await Object?.values(data.proof)[0];
        const cid: any = await Object?.values(data.cid)[0];
        setDIDCid(cid);
        console.log("get /did/web ==>>", data);

        const rawGetReq = await fetch(
          `https://api.ancon.did.pa/user/${transactionHash.name}/did.json`
        );
        const getReqParse = await rawGetReq.json();
        const getReq = await JSON.parse(getReqParse);
        console.log("get user/domain/did.json ==>>", getReq);

        // // another way to request the did
        // const rawDidRequest = await fetch(
        //   `https://api.ancon.did.pa/v0/did/${getReq.id}`
        // );
        // const didRequest = await rawDidRequest.json()
        // console.log('did',JSON.parse(didRequest))
        const rawGetProof = await fetch(
          `https://api.ancon.did.pa/v0/dagjson/${proofCID}/`
        );
        const GetProof = await rawGetProof.json();
        console.log("proof==>", {
          ...GetProof.proof?.proofs[0].Proof,
        });

        // calling to abi proof
        const z = toAbiProof({
          ...GetProof.proof?.proofs[0].Proof.exist,
        });

        // enroll to L2
        let enroll;
        setMessage('Enrolling account')
        // setTimeout(async () => {
        //   enroll = await enrollL2Account(cid, z, setStep, provider, setErrorModal);
        // }, 30000);
        setStep(1);
        // console.log("post /proofs ===>", Postproof);
        console.log("get /proofs/key ===>", GetProof);
      };

      getDid();
      // setStep(1)
    } catch (error) {
      console.log("err", error);
    }
  };

  // step 1 //
  // checks if the user has selected the image, if so the it continue
  const handleUpdloadImage = () => {
    if (image === null) {
      setError(true);
    } else {
      setStep(2);
      handleUpload();
      setError(false);
    }
  };
  // retrieve the ipfs access token
  const getAccessToken = () => {
    const apikey: any = process.env.NEXT_PUBLIC_API_KEY_STORAGE;
    return apikey;
  };

  // step3 //
  // uploads the file to the ipfs
  const handleUpload = async () => {
    try {
      // make the client
      const storage = new Web3Storage({
        token: getAccessToken(),
      });
      // show the root cid as soon as it's ready
      const onRootCidReady = (cid: string) => {
        console.log("uploading files with cid:", cid);
      };

      // when each chunk is stored, update the percentage complete and display
      const totalSize = image.size;
      let uploaded = 0;

      const onStoredChunk = (size: number) => {
        uploaded += size;
        const pct = totalSize / uploaded;
        console.log(`Uploading... ${pct.toFixed(2)}% complete`);
      };

      const imageCid: string = await storage.put([image], {
        onRootCidReady,
        onStoredChunk,
      });
      setTokenData({...tokenData, imageCid})
      setStep(3);
    } catch (error) {
      console.log("err", error);
    }
  };

  // step4 //
  // creates the metadata
  const createMetadata = async () => {
    const prov = new ethers.providers.Web3Provider(provider);
    const signer = prov.getSigner();
    const payload = {
      name:tokenData.name,
      description:tokenData.description,
      image: tokenData.imageCid,
      sources: [],
    };
    // sign the message
    const signature = await signer.signMessage(ethers.utils.keccak256(Buffer.from(JSON.stringify(payload))))
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "/",
        from: DIDcid,
        signature,
        data: payload,
      }),
    };
    
    try {
      // creates the metadata
      const PostRequest = async () => {
        const rawMetadata = await fetch(
          "https://api.ancon.did.pa/v0/dagjson",
          requestOptions
        );
        const metadata = await rawMetadata.json();
        // returns the metadata cid
        console.log("metadata", metadata);
        let id:any;
        if(metadata !== null){
          id= await Object?.values(metadata.cid)[0];
        }
        
        setTokenData({...tokenData, tokenCid:id})
        console.log('didCID', DIDcid)
        const dagRequest = await fetch(
          `https://api.ancon.did.pa/v0/dagjson/${id}/`
        );
        const dag = await dagRequest.json();
        setStep(5);
      };
      PostRequest();
    } catch (error) {
      console.log("err", error);
    }
  };

  // handles the change of the image
  const onImageChange = (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    setImage(event.target.files[0]);
    setError(false);
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (e: any) =>
        setLocalImage(e?.target?.result?.split(",")[1]);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // checks if the user has written a name, if so the it continue
  const handleSetMessageUpload = () => {
    if (tokenData.name === null) {
      setError(true);
    } else {
      createMetadata();
      setError(false);
    }
  };

  // contract

  // const handleClickOpen = () => {
  //   const _web3 = new Web3(provider);
  //   _web3.eth.defaultAccount = address;
  //   //setWeb3(_web3);
  //   bindContracts(_web3);
  // };

  // async function bindContracts(web3: any) {
  //   console.log("Beginning of BINDCONTRACTS()", web3);
  //   const ethersInstance = new ethers.providers.Web3Provider(
  //     web3.currentProvider
  //   );
  //   const anconNFTContractAddress: any =
  //     process.env.NEXT_PUBLIC_AnconTestNFTAddress;
  //   const anconTokenContractAddress: any =
  //     process.env.NEXT_PUBLIC_AnconTokenAddress;
  //   console.log(
  //     "contracts ==>",
  //     anconNFTContractAddress,
  //     anconTokenContractAddress
  //   );
  //   // // const marketplateContractAddress = env.MarketplaceAddress;
  //   const nftContract = new web3.eth.Contract(
  //     AnconNFT.abi,
  //     anconNFTContractAddress
  //   );
  //   const anconTokenContract = new web3.eth.Contract(
  //     AnconToken.abi,
  //     anconTokenContractAddress
  //   );
  //   const ethersContract = new ethers.Contract(
  //     anconNFTContractAddress,
  //     AnconNFT.abi,
  //     ethersInstance.getSigner(0)
  //   );
  //   console.log("End of BINDCONTRACTS()", nftContract.defaultAccount);
  // }
  // useEffect(() => {
  //   handleClickOpen();
  // }, []);
  return (
    <main className="bg-gray-50 relative h-screen w-full mb-4">
      <Header />
      <div className="flex justify-center items-center md:mt-18 2xl:mt-24 mt-8 w-full">
        <div className="bg-white shadow-xl rounded-lg px-3 py-4">
          <span className="text-black font-bold text-xl">
            {step === 5 ? "NFT Created" : "Create NFT"}
          </span>
          {step == 0 ? (
            <div className="mt-4 flex flex-col items-center select-none">
              <p className="font-medium">
                Claim L2 Decentralized Identity
              </p>

              <div className="flex-col flex mt-3">
                <a className="text-gray-600 text-sm font-bold mt-4">
                  Name
                </a>
                <input
                  type="text"
                  className="bg-gray-100 rounded-sm h-10 pl-2"
                  onChange={(e) => {
                    setTransactionHash({
                      ...transactionHash,
                      name: e.target.value,
                    });
                  }}
                  value={transactionHash.name}
                ></input>
                <ErrorMessage
                  message="Please provide a Domain Name"
                  show={error}
                />
              </div>
              <div
                onClick={getDid}
                className="mt-4 bg-purple-700 border-2 border-purple-700 rounded-lg px-4 py-2 text-white hover:text-black hover:bg-purple-300 transition-all duration-100 hover:shadow-xl active:scale-105 transform cursor-pointer"
              >
                <p>Continue</p>
              </div>
            </div>
          ) : null}
          {step === -1 ? (
            <div className="flex flex-col items-center">
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-dashed border-primary-500 mt-4"
                role="status"
              ></div>
              <p className="animate-pulse mt-4">{message != '' ? message: 'getting proof...'}</p>
            </div>
          ) : null}
          {step == 1 ? (
            <div className="mt-4 flex flex-col items-center">
              <div className="p-3 rounded-lg border-2 bg-gray-50 shadow-sm cursor-pointer hover:tracking-wider transition-all duration-200 hover:border-primary-500 hover:drop-shadow-lg hover:shadow-primary-500 ease-out">
                <p className="" onClick={clickInput}>
                  Select Image
                </p>
              </div>
              <ErrorMessage
                message="Please select an image"
                show={error}
              />

              {localImage != null ? (
                <img
                  className="border-2 p-2 rounded-lg border-primary-500 drop-shadow-xl shadow-primary-500 mt-4"
                  src={`data:image/jpeg;base64,${localImage}`}
                  style={{ maxWidth: "100px" }}
                  alt="local"
                />
              ) : null}
              <input
                type="file"
                onChange={onImageChange}
                className="filetype"
                id="nft-img"
                style={{ display: "none" }}
              ></input>
              <div className="mt-4 bg-purple-700 border-2 border-purple-700 rounded-lg px-4 py-2 text-white hover:text-black hover:bg-purple-300 transition-all duration-100 hover:shadow-xl active:scale-105 transform cursor-pointer">
                <p onClick={handleUpdloadImage}>Upload image</p>
              </div>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="flex flex-col items-center">
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-dashed border-primary-500 mt-4"
                role="status"
              ></div>
              <p className="animate-pulse mt-4">
                Uploading Image to IPFS
              </p>
            </div>
          ) : null}
          {step == 3 ? (
            <div className="flex-col flex mt-3">
              <div className="flex-col flex mt-3">
                <a className="text-gray-600 text-sm font-bold">
                  NFT Name
                </a>
                <input
                  type="text"
                  className="bg-gray-100 rounded-sm h-10 pl-2"
                  onChange={(e) => {
                    setTokenData({...tokenData, name:e.target.value});
                  }}
                ></input>
              </div>

              <ErrorMessage
                message="Please provide a Name"
                show={error}
              />
              <div className="flex-col flex mt-3">
                <a className="text-gray-600 text-sm font-bold">
                  Description
                </a>
                <input
                  id="TITLE"
                  className="bg-gray-100 rounded-sm h-10 pl-2"
                  onChange={(e) => {
                    setTokenData({...tokenData, description:e.target.value});
                  }}
                ></input>
              </div>
              <div className="flex items-center justify-center mt-3">
                <div>
                  <img
                    className="border-2 p-2 rounded-lg border-primary-500 drop-shadow-xl shadow-primary-500 mt-2"
                    src={`data:image/jpeg;base64,${localImage}`}
                    style={{ maxWidth: "100px" }}
                    alt="finalLocal"
                  />

                  <p
                    onClick={handleSetMessageUpload}
                    className="bg-purple-700 border-2 border-purple-700 rounded-lg text-white hover:text-black hover:bg-purple-300 transition-all duration-100 hover:shadow-xl active:scale-105 transform cursor-pointer mt-4 flex items-center justify-center py-2 px-4"
                  >
                    Create
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          {step === 4 ? (
            <div className="flex flex-col items-center">
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-dashed border-primary-500 mt-4"
                role="status"
              ></div>
              <p className="animate-pulse mt-4">Minting NFT</p>
            </div>
          ) : null}
          {step == 5 ? (
            <div className="">
              <div className="flex flex-col items-start mt-3">
                <a className="text-gray-600 text-sm">NFT Name</a>
                <span className="text-lg font-medium mb-2">
                  {tokenData.name}
                </span>

                <a className="text-gray-600 text-sm">Description</a>
                <span className="text-lg font-medium mb-2">
                  {tokenData.description}
                </span>

                <a className="text-gray-600 text-sm">Image CID</a>
                <span className="text-lg font-medium mb-2">
                  {tokenData.imageCid}
                </span>

                <a className="text-gray-600 text-sm">Metada CID</a>
                <span className="text-lg font-medium mb-2">
                  {tokenData.tokenCid}
                </span>

                <a className="text-gray-600 text-sm">OWNER</a>
                <span className="text-lg font-medium mb-2">
                  {address}
                </span>

                <div className="flex items-center justify-center mt-3 w-full">
                  <div>
                    <img
                      className="nft-img"
                      src={`data:image/jpeg;base64,${localImage}`}
                      style={{ maxWidth: "120px" }}
                      alt="readyLocal"
                    />

                    <p
                      onClick={() => router.push("/")}
                      className="bg-purple-700 border-2 border-purple-700 rounded-lg text-white hover:text-black hover:bg-purple-300 transition-all duration-100 hover:shadow-xl active:scale-105 transform cursor-pointer mt-4 flex items-center justify-center py-2 px-4"
                    >
                      Close
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default Create;
