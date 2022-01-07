import { ethers } from "ethers";
import { get } from "http";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { addressState } from "../atoms/addressAtom";
import { DidState } from "../atoms/DIDAtom";
import { errorState } from "../atoms/errorAtom";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import EnrollL2Account from "../functions/EnrollL2Account";
import GetPublicKey from "../functions/GetPublicKey";
import getTransaction from "../functions/GetTransaction";
import toAbiProof from "../functions/ToAbiProof";
import useProvider from "../hooks/useProvider";

// Vue translation stuff

// import { Component, Vue } from "vue-property-decorator";
import { BrowserQRCodeReader, QRCodeReader } from "@zxing/library";
// import { ethers } from "ethers";
import EthCrypto from "eth-crypto";
import * as ipfs from "ipfs-http-client";
import { EventFilter } from "@decent-bet/solido";
import { filter } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { BigNumber } from "ethers/utils";
import { SolidoSingleton } from "../components/SolidoSingleton";
import { CedulaVC } from "../lib/cedula-vc";
import { MiddlewareOptions } from "../lib";
// import { decodeJWT } from "did-jwt/src";
import * as moment from "moment";
import "share-api-polyfill";
const PromiseFileReader = require("promise-file-reader");

let valid = false;
let nombre = "";
let apellido = "";
let email = "";
let description = "";
let hasIdCredential = false;
let selected = [];
let items: any = [];
let dialog: boolean = false;
let loading: boolean = false;
let amount = 0;
let currentItem = null;
let files: any = [];
let search = "";
let creds = null;
let ipfsFiles: any;
let host: string;
let data = "";
let solidoProps: MiddlewareOptions;

function exitDialog() {
  dialog = false;
}

async function shareVerifier() {
  const { ethereum, did, storage } = solidoProps;
  const cedula = new CedulaVC();
  let jwt = await storage.getIdCredential();
  const verifier = await cedula.createVerifier(jwt, {
    address: did.preferredDIDAddress,
    ethereumAddress: ethereum.account,
    resolver: did.resolver,
    issuer: did.issuer,
  });
  const ref = await storage.setBinaryData(verifier, "text/plain");
  const data = {
    title: "Sharing my ID card verifier",
    text: "ID Card Verifier",
    url: `${location.host}/#/verify_credentials/${ref}`,
  };
  await (navigator as any).share(data);
}

async function fileAdded() {
  const { name, lastname, _data } = (await handleQRFromImage()) as any;
  nombre = name;
  apellido = lastname;
  data = _data;
}

async function handleCreateVC() {
  await fileAdded();
  loading = true;
  const name = nombre;
  const lastname = apellido;
  const hash = data;
  if (!!name === false)
    alert("Cedula no es valida o no es posible leer el codigo");
  const { ethereum, storage, did } = solidoProps;
  const cedula = new CedulaVC();
  const creds = await cedula.issueCredential(
    { name, lastname, hash },
    {
      issuer: did.issuer,
      resolver: did.resolver,
      address: did.preferredDIDAddress,
      ethereumAddress: ethereum.account,
    }
  );
  await storage.setIdCredential(creds);
  dialog = false;
  loading = false;
  $router.go(0);
}

async function mounted() {
  loading = true;
  solidoProps = await SolidoSingleton.getProps();
  host = "API URL";
  let creds = await solidoProps.storage.getIdCredential();
  if (creds.length > 20) {
    const identity = decodeJWT(creds);
    nombre = identity.payload.vc.credentialSubject.name;
    apellido = identity.payload.vc.credentialSubject.familyName;
    creds = identity;
    creds.emitido = moment.unix(identity.payload.iat).format("LLL");
    hasIdCredential = !!creds;
  }
  loading = false;
}

async function handleCredentialPublish() {
  let { nombre, apellido, email, notary, description } = $data;
  const { web3 } = window as any;
  loading = true;
  email = ethers.utils.formatBytes32String(email);
  nombre = ethers.utils.formatBytes32String(nombre);
  apellido = ethers.utils.formatBytes32String(apellido);
  const docFiles = JSON.stringify(ipfsFiles);
  const estimate =
    await solidoProps.ethereum.contracts.Documents.instance.estimate.addDocument(
      notary,
      docFiles,
      description,
      email,
      nombre,
      apellido
    );
  const gas = estimate.toNumber();
  const res =
    await solidoProps.ethereum.contracts.Documents.instance.functions.addDocument(
      notary,
      docFiles,
      description,
      email,
      nombre,
      apellido,
      {
        gasLimit: gas,
        gasPrice: 20000000000, // 10 Gwei
      }
    );
  await res.wait(2);
  loading = false;
}

async function handleQRFromImage() {
  let response = {};
  try {
    const codeReader = new BrowserQRCodeReader();
    const img = await PromiseFileReader.readAsDataURL(files);
    const imgSrc = document.createElement("img");
    imgSrc.src = img;
    document.body.appendChild(imgSrc); // we need to append the element to the dom -> otherwise it will not work in firefox
    const result: any = await codeReader.decodeFromImage(imgSrc);
    imgSrc.remove();
    response = {
      name: result.text.split("|")[1].split(" ")[0],
      lastname: result.text.split("|")[2].split(" ")[0],
      data: result.text,
    };
  } catch (e) {
    return {};
  } finally {
  }
  return response;
}

function IdQr() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState(false);
  const [transactionHash, setTransactionHash] = useState({
    transaction: "",
    name: "",
  });
  const [message, setMessage] = useState("");
  const [DIDCid, setDIDCid] = useState("");

  // atoms
  const address = useRecoilValue(addressState);
  const [errorModal, setErrorModal] = useRecoilState(errorState);
  const setDIDcid = useSetRecoilState(DidState);

  //custom hooks
  const provider = useProvider();
  const router = useRouter();

  // step 0 //
  // check if domain already exists
  const getDomainName = async () => {
    const rawResponse = await fetch(
      `https://api.ancon.did.pa/user/${transactionHash.name}/did.json`
    );
    const response = await rawResponse.json();
    console.log("response", rawResponse);
    if (rawResponse.status === 400) {
      return false;
    }
    return true;
  };
  // STEP 1  gets the public key and handle the get did//
  //get the public key
  const getDid = async () => {
    // check if theres a name written
    if (transactionHash.name === "") {
      setError(true);
      return;
    } else {
      setStep(1);
      setMessage("Getting a valid transaction...");
    }
    try {
      setStep(1);
      const domain = await getDomainName();
      if (domain === false) {
        // check if the user has made any transaction
        const trans = await getTransaction(
          setStep,
          address,
          setErrorModal,
          setMessage,
          provider
        );
        console.log("transaction", trans);
        const prov = new ethers.providers.Web3Provider(provider);
        const transaction: any = await prov.getTransaction(trans);
        console.log("transaction2", transaction);
        // join the signature
        const sig = ethers.utils.joinSignature({
          r: transaction.r,
          s: transaction.s,
          v: transaction.v,
        });

        // get publicKey
        const getPublicKey = await GetPublicKey(transaction, sig, prov);
        const pubkey = getPublicKey[1];
        const recoveredAddress = getPublicKey[0];
        setMessage("Validating proof...");
        // if the address are equal procced to get the proof
        if (recoveredAddress === transaction.from) {
          setTimeout(() => {
            handleProof(pubkey);
          }, 2000);
        } else {
          setError(true);
        }
      } else {
        setErrorModal([
          "This Domain already exists please try again or procced to create a NFT",
          "Try again",
          "/enroll",
          "Create NFT",
          "/create",
        ]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //get the cid and the proof
  const handleProof = async (pubkey: string) => {
    const base58Encode = ethers.utils.base58.encode(pubkey);
    const prov = new ethers.providers.Web3Provider(provider);
    const signer = prov.getSigner();
    const signature = await signer.signMessage(
      ethers.utils.arrayify(
        ethers.utils.toUtf8Bytes("signin this message to verify my public key")
      )
    );
    //post to get the did
    const payload = {
      domainName: transactionHash.name,
      pub: base58Encode,
      signature: signature,
      message: "signin this message to verify my public key",
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
        setDIDcid(cid);
        localStorage.setItem("DIDCid", cid);
        localStorage.setItem("ProofCid", proofCID);
        console.log("get /did/web ==>>", data);

        const rawGetReq = await fetch(
          `https://api.ancon.did.pa/user/${transactionHash.name}/did.json`
        );
        const getReqParse = await rawGetReq.json();
        const getReq = await JSON.parse(getReqParse);
        console.log("get user/domain/did.json ==>>", getReq);

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
        setMessage(
          "Preparing to enroll account, this proccess can take several minutes"
        );
        setTimeout(async () => {
          enroll = await EnrollL2Account(
            cid,
            z,
            setStep,
            provider,
            setErrorModal,
            address
          );
        }, 40000);
        // setStep(1);
        // console.log("post /proofs ===>", Postproof);
        console.log("get /proofs/key ===>", GetProof);
      };

      getDid();
      // setStep(3)
    } catch (error) {
      console.log("err", error);
    }
  };
  return (
    <main className="bg-gray-50 relative h-screen w-full mb-4">
      <Header />
      <div className="flex justify-center items-center md:mt-18 2xl:mt-24 mt-8 w-full">
        <div className="bg-white shadow-xl rounded-lg px-3 py-4 mx-2">
          <span className="text-black font-bold text-xl">
            {step === 3
              ? "Account enrolled"
              : step === 1
              ? "Enrollment Proccess"
              : "Enroll Account"}
          </span>
          {step === 0 ? (
            <div className="mt-4 flex flex-col items-center select-none">
              <p className="font-medium">Claim L2 Decentralized Identity</p>

              <div className="flex-col flex mt-3">
                <a className="text-gray-600 text-sm font-bold mt-4">Name</a>
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
          {step === 1 ? (
            <div className="flex flex-col items-center">
              <div
                className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-dashed border-primary-500 mt-4"
                role="status"
              ></div>
              <p className="animate-pulse mt-4">{message}</p>
            </div>
          ) : null}

          {/* step 3 account enrolled create nft */}
          {step === 3 ? (
            <div className="flex items-center justify-center mt-3">
              <div className="grid grid-cols-1">
                <a className="text-gray-600 text-sm">Domain Name</a>
                <span className="text-lg font-medium mb-2">
                  {transactionHash.name}
                </span>

                <a className="text-gray-600 text-sm">DID Cid</a>
                <p className="hidden md:inline text-lg font-medium mb-2">
                  {DIDCid}
                </p>
                <p className="md:hidden text-lg">
                  {DIDCid.substring(0, 30)}...
                </p>
                <p className="md:hidden text-lg">...{DIDCid.substring(30)}</p>

                <div className="flex items-center justify-center mt-3 w-full">
                  <div>
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

export default IdQr;
