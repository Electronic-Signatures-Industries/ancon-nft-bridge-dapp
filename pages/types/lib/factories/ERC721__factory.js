"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC721__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: "string",
                name: "name_",
                type: "string",
            },
            {
                internalType: "string",
                name: "symbol_",
                type: "string",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "approved",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "ApprovalForAll",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
            },
        ],
        name: "supportsInterface",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "ownerOf",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "tokenURI",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "getApproved",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                internalType: "bool",
                name: "approved",
                type: "bool",
            },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "address",
                name: "operator",
                type: "address",
            },
        ],
        name: "isApprovedForAll",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
            },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x60806040523480156200001157600080fd5b50604051620016a4380380620016a48339810160408190526200003491620001db565b81516200004990600090602085019062000068565b5080516200005f90600190602084019062000068565b50505062000282565b828054620000769062000245565b90600052602060002090601f0160209004810192826200009a5760008555620000e5565b82601f10620000b557805160ff1916838001178555620000e5565b82800160010185558215620000e5579182015b82811115620000e5578251825591602001919060010190620000c8565b50620000f3929150620000f7565b5090565b5b80821115620000f35760008155600101620000f8565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200013657600080fd5b81516001600160401b03808211156200015357620001536200010e565b604051601f8301601f19908116603f011681019082821181831017156200017e576200017e6200010e565b816040528381526020925086838588010111156200019b57600080fd5b600091505b83821015620001bf5785820183015181830184015290820190620001a0565b83821115620001d15760008385830101525b9695505050505050565b60008060408385031215620001ef57600080fd5b82516001600160401b03808211156200020757600080fd5b620002158683870162000124565b935060208501519150808211156200022c57600080fd5b506200023b8582860162000124565b9150509250929050565b600181811c908216806200025a57607f821691505b602082108114156200027c57634e487b7160e01b600052602260045260246000fd5b50919050565b61141280620002926000396000f3fe608060405234801561001057600080fd5b50600436106100df5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb465146101c3578063b88d4fde146101d6578063c87b56dd146101e9578063e985e9c5146101fc57600080fd5b80636352211e1461018757806370a082311461019a57806395d89b41146101bb57600080fd5b8063095ea7b3116100bd578063095ea7b31461014c57806323b872dd1461016157806342842e0e1461017457600080fd5b806301ffc9a7146100e457806306fdde031461010c578063081812fc14610121575b600080fd5b6100f76100f2366004610fc6565b610238565b60405190151581526020015b60405180910390f35b6101146102d5565b604051610103919061103b565b61013461012f36600461104e565b610367565b6040516001600160a01b039091168152602001610103565b61015f61015a366004611083565b610401565b005b61015f61016f3660046110ad565b610533565b61015f6101823660046110ad565b6105ba565b61013461019536600461104e565b6105d5565b6101ad6101a83660046110e9565b610660565b604051908152602001610103565b6101146106fa565b61015f6101d1366004611104565b610709565b61015f6101e4366004611156565b6107ce565b6101146101f736600461104e565b61085c565b6100f761020a366004611232565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982167f80ac58cd00000000000000000000000000000000000000000000000000000000148061029b57506001600160e01b031982167f5b5e139f00000000000000000000000000000000000000000000000000000000145b806102cf57507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316145b92915050565b6060600080546102e490611265565b80601f016020809104026020016040519081016040528092919081815260200182805461031090611265565b801561035d5780601f106103325761010080835404028352916020019161035d565b820191906000526020600020905b81548152906001019060200180831161034057829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b03166103e55760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b600061040c826105d5565b9050806001600160a01b0316836001600160a01b031614156104965760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f720000000000000000000000000000000000000000000000000000000000000060648201526084016103dc565b336001600160a01b03821614806104b257506104b2813361020a565b6105245760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c000000000000000060648201526084016103dc565b61052e8383610952565b505050565b61053d33826109cd565b6105af5760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f76656400000000000000000000000000000060648201526084016103dc565b61052e838383610ac4565b61052e838383604051806020016040528060008152506107ce565b6000818152600260205260408120546001600160a01b0316806102cf5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201527f656e7420746f6b656e000000000000000000000000000000000000000000000060648201526084016103dc565b60006001600160a01b0382166106de5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a6560448201527f726f20616464726573730000000000000000000000000000000000000000000060648201526084016103dc565b506001600160a01b031660009081526003602052604090205490565b6060600180546102e490611265565b6001600160a01b0382163314156107625760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016103dc565b3360008181526005602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6107d833836109cd565b61084a5760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f76656400000000000000000000000000000060648201526084016103dc565b61085684848484610c9e565b50505050565b6000818152600260205260409020546060906001600160a01b03166108e95760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201527f6e6578697374656e7420746f6b656e000000000000000000000000000000000060648201526084016103dc565b600061090060408051602081019091526000815290565b90506000815111610920576040518060200160405280600081525061094b565b8061092a84610d27565b60405160200161093b9291906112a0565b6040516020818303038152906040525b9392505050565b6000818152600460205260409020805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0384169081179091558190610994826105d5565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600260205260408120546001600160a01b0316610a465760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016103dc565b6000610a51836105d5565b9050806001600160a01b0316846001600160a01b03161480610a8c5750836001600160a01b0316610a8184610367565b6001600160a01b0316145b80610abc57506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316610ad7826105d5565b6001600160a01b031614610b535760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201527f73206e6f74206f776e000000000000000000000000000000000000000000000060648201526084016103dc565b6001600160a01b038216610bce5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016103dc565b610bd9600082610952565b6001600160a01b0383166000908152600360205260408120805460019290610c029084906112e5565b90915550506001600160a01b0382166000908152600360205260408120805460019290610c309084906112fc565b9091555050600081815260026020526040808220805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b610ca9848484610ac4565b610cb584848484610e59565b6108565760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016103dc565b606081610d6757505060408051808201909152600181527f3000000000000000000000000000000000000000000000000000000000000000602082015290565b8160005b8115610d915780610d7b81611314565b9150610d8a9050600a83611345565b9150610d6b565b60008167ffffffffffffffff811115610dac57610dac611140565b6040519080825280601f01601f191660200182016040528015610dd6576020820181803683370190505b5090505b8415610abc57610deb6001836112e5565b9150610df8600a86611359565b610e039060306112fc565b60f81b818381518110610e1857610e1861136d565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350610e52600a86611345565b9450610dda565b60006001600160a01b0384163b15610fa257604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610e9d903390899088908890600401611383565b6020604051808303816000875af1925050508015610ed8575060408051601f3d908101601f19168201909252610ed5918101906113bf565b60015b610f88573d808015610f06576040519150601f19603f3d011682016040523d82523d6000602084013e610f0b565b606091505b508051610f805760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016103dc565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610abc565b506001949350505050565b6001600160e01b031981168114610fc357600080fd5b50565b600060208284031215610fd857600080fd5b813561094b81610fad565b60005b83811015610ffe578181015183820152602001610fe6565b838111156108565750506000910152565b60008151808452611027816020860160208601610fe3565b601f01601f19169290920160200192915050565b60208152600061094b602083018461100f565b60006020828403121561106057600080fd5b5035919050565b80356001600160a01b038116811461107e57600080fd5b919050565b6000806040838503121561109657600080fd5b61109f83611067565b946020939093013593505050565b6000806000606084860312156110c257600080fd5b6110cb84611067565b92506110d960208501611067565b9150604084013590509250925092565b6000602082840312156110fb57600080fd5b61094b82611067565b6000806040838503121561111757600080fd5b61112083611067565b91506020830135801515811461113557600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b6000806000806080858703121561116c57600080fd5b61117585611067565b935061118360208601611067565b925060408501359150606085013567ffffffffffffffff808211156111a757600080fd5b818701915087601f8301126111bb57600080fd5b8135818111156111cd576111cd611140565b604051601f8201601f19908116603f011681019083821181831017156111f5576111f5611140565b816040528281528a602084870101111561120e57600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b6000806040838503121561124557600080fd5b61124e83611067565b915061125c60208401611067565b90509250929050565b600181811c9082168061127957607f821691505b6020821081141561129a57634e487b7160e01b600052602260045260246000fd5b50919050565b600083516112b2818460208801610fe3565b8351908301906112c6818360208801610fe3565b01949350505050565b634e487b7160e01b600052601160045260246000fd5b6000828210156112f7576112f76112cf565b500390565b6000821982111561130f5761130f6112cf565b500190565b6000600019821415611328576113286112cf565b5060010190565b634e487b7160e01b600052601260045260246000fd5b6000826113545761135461132f565b500490565b6000826113685761136861132f565b500690565b634e487b7160e01b600052603260045260246000fd5b60006001600160a01b038087168352808616602084015250836040830152608060608301526113b5608083018461100f565b9695505050505050565b6000602082840312156113d157600080fd5b815161094b81610fad56fea26469706673582212207cd7c24d3690991e0c0584dd61f8039b80e0b0a8eb72d6b0b9bbd315315559b764736f6c634300080a0033";
const isSuperArgs = (xs) => xs.length > 1;
class ERC721__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(name_, symbol_, overrides) {
        return super.deploy(name_, symbol_, overrides || {});
    }
    getDeployTransaction(name_, symbol_, overrides) {
        return super.getDeployTransaction(name_, symbol_, overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.ERC721__factory = ERC721__factory;
ERC721__factory.bytecode = _bytecode;
ERC721__factory.abi = _abi;
