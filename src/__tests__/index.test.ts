//jest.mock('cross-fetch', () =>  {
  //return jest.fn(() => ({
    //ok: true,
    //json: async () => JSON.parse('{"value":{"id":"did:3:GENESIS","@context":"https://w3id.org/did/v1","publicKey":[{"id":"did:3:GENESIS#signingKey","type":"Secp256k1VerificationKey2018","publicKeyHex":"0452fbcde75f7ddd7cff18767e2b5536211f500ad474c15da8e74577a573e7a346f2192ef49a5aa0552c41f181a7950af3afdb93cafcbff18156943e3ba312e5b2"},{"id":"did:3:GENESIS#encryptionKey","type":"Curve25519EncryptionPublicKey","publicKeyBase64":"DFxR24MNHVxEDAdL2f6pPEwNDJ2p0Ldyjoo7y/ItLDc="},{"id":"did:3:GENESIS#managementKey","type":"Secp256k1VerificationKey2018","ethereumAddress":"0x3f0bb6247d647a30f310025662b29e6fa382b61d"}],"authentication":[{"type":"Secp256k1SignatureAuthentication2018","publicKey":"did:3:GENESIS#signingKey"}]}}')
  //}))
//})
//import fetch from 'cross-fetch'

import NftResolver from '../index'
import { Resolver } from 'did-resolver'
import Ceramic from '@ceramicnetwork/http-client'
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import ganache from 'ganache-core'
import { ethers, ContractFactory } from 'ethers'
import * as u8a from 'uint8arrays'

const erc721Bytecode = '60806040523480156200001157600080fd5b506040518060400160405280600881526020017f47616d654974656d0000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f49544d0000000000000000000000000000000000000000000000000000000000815250816000908051906020019062000096929190620000b8565b508060019080519060200190620000af929190620000b8565b505050620001cd565b828054620000c69062000168565b90600052602060002090601f016020900481019282620000ea576000855562000136565b82601f106200010557805160ff191683800117855562000136565b8280016001018555821562000136579182015b828111156200013557825182559160200191906001019062000118565b5b50905062000145919062000149565b5090565b5b80821115620001645760008160009055506001016200014a565b5090565b600060028204905060018216806200018157607f821691505b602082108114156200019857620001976200019e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6127d580620001dd6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c578063b88d4fde11610066578063b88d4fde1461025b578063c87b56dd14610277578063cf378343146102a7578063e985e9c5146102d7576100ea565b806370a08231146101f157806395d89b4114610221578063a22cb4651461023f576100ea565b8063095ea7b3116100c8578063095ea7b31461016d57806323b872dd1461018957806342842e0e146101a55780636352211e146101c1576100ea565b806301ffc9a7146100ef57806306fdde031461011f578063081812fc1461013d575b600080fd5b610109600480360381019061010491906119a6565b610307565b6040516101169190611d66565b60405180910390f35b6101276103e9565b6040516101349190611d81565b60405180910390f35b610157600480360381019061015291906119f8565b61047b565b6040516101649190611cff565b60405180910390f35b6101876004803603810190610182919061196a565b610500565b005b6101a3600480360381019061019e9190611810565b610618565b005b6101bf60048036038101906101ba9190611810565b610678565b005b6101db60048036038101906101d691906119f8565b610698565b6040516101e89190611cff565b60405180910390f35b61020b600480360381019061020691906117ab565b61074a565b6040516102189190611f63565b60405180910390f35b610229610802565b6040516102369190611d81565b60405180910390f35b610259600480360381019061025491906118da565b610894565b005b6102756004803603810190610270919061185f565b610a15565b005b610291600480360381019061028c91906119f8565b610a77565b60405161029e9190611d81565b60405180910390f35b6102c160048036038101906102bc9190611916565b610b1e565b6040516102ce9190611f63565b60405180910390f35b6102f160048036038101906102ec91906117d4565b610b4c565b6040516102fe9190611d66565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806103d257507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103e257506103e182610be0565b5b9050919050565b6060600080546103f8906121b9565b80601f0160208091040260200160405190810160405280929190818152602001828054610424906121b9565b80156104715780601f1061044657610100808354040283529160200191610471565b820191906000526020600020905b81548152906001019060200180831161045457829003601f168201915b5050505050905090565b600061048682610c4a565b6104c5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104bc90611ec3565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600061050b82610698565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561057c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161057390611f23565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1661059b610cb6565b73ffffffffffffffffffffffffffffffffffffffff1614806105ca57506105c9816105c4610cb6565b610b4c565b5b610609576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060090611e43565b60405180910390fd5b6106138383610cbe565b505050565b610629610623610cb6565b82610d77565b610668576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161065f90611f43565b60405180910390fd5b610673838383610e55565b505050565b61069383838360405180602001604052806000815250610a15565b505050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610741576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161073890611e83565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156107bb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107b290611e63565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b606060018054610811906121b9565b80601f016020809104026020016040519081016040528092919081815260200182805461083d906121b9565b801561088a5780601f1061085f5761010080835404028352916020019161088a565b820191906000526020600020905b81548152906001019060200180831161086d57829003601f168201915b5050505050905090565b61089c610cb6565b73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561090a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161090190611e03565b60405180910390fd5b8060056000610917610cb6565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff166109c4610cb6565b73ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610a099190611d66565b60405180910390a35050565b610a26610a20610cb6565b83610d77565b610a65576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a5c90611f43565b60405180910390fd5b610a71848484846110b1565b50505050565b6060610a8282610c4a565b610ac1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ab890611f03565b60405180910390fd5b6000610acb61110d565b90506000815111610aeb5760405180602001604052806000815250610b16565b80610af584611124565b604051602001610b06929190611cdb565b6040516020818303038152906040525b915050919050565b6000610b2a60066112d1565b6000610b3660066112e7565b9050610b4284826112f5565b8091505092915050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16610d3183610698565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000610d8282610c4a565b610dc1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610db890611e23565b60405180910390fd5b6000610dcc83610698565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610e3b57508373ffffffffffffffffffffffffffffffffffffffff16610e238461047b565b73ffffffffffffffffffffffffffffffffffffffff16145b80610e4c5750610e4b8185610b4c565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16610e7582610698565b73ffffffffffffffffffffffffffffffffffffffff1614610ecb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ec290611ee3565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610f3b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f3290611de3565b60405180910390fd5b610f468383836114c3565b610f51600082610cbe565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610fa191906120cf565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610ff89190612048565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b6110bc848484610e55565b6110c8848484846114c8565b611107576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110fe90611da3565b60405180910390fd5b50505050565b606060405180602001604052806000815250905090565b6060600082141561116c576040518060400160405280600181526020017f300000000000000000000000000000000000000000000000000000000000000081525090506112cc565b600082905060005b6000821461119e5780806111879061221c565b915050600a82611197919061209e565b9150611174565b60008167ffffffffffffffff8111156111e0577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156112125781602001600182028036833780820191505090505b5090505b600085146112c55760018261122b91906120cf565b9150600a8561123a9190612265565b60306112469190612048565b60f81b818381518110611282577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a856112be919061209e565b9450611216565b8093505050505b919050565b6001816000016000828254019250508190555050565b600081600001549050919050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611365576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161135c90611ea3565b60405180910390fd5b61136e81610c4a565b156113ae576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113a590611dc3565b60405180910390fd5b6113ba600083836114c3565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461140a9190612048565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050565b505050565b60006114e98473ffffffffffffffffffffffffffffffffffffffff1661165f565b15611652578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02611512610cb6565b8786866040518563ffffffff1660e01b81526004016115349493929190611d1a565b602060405180830381600087803b15801561154e57600080fd5b505af192505050801561157f57506040513d601f19601f8201168201806040525081019061157c91906119cf565b60015b611602573d80600081146115af576040519150601f19603f3d011682016040523d82523d6000602084013e6115b4565b606091505b506000815114156115fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115f190611da3565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614915050611657565b600190505b949350505050565b600080823b905060008111915050919050565b600061168561168084611fa3565b611f7e565b90508281526020810184848401111561169d57600080fd5b6116a8848285612177565b509392505050565b60006116c36116be84611fd4565b611f7e565b9050828152602081018484840111156116db57600080fd5b6116e6848285612177565b509392505050565b6000813590506116fd81612743565b92915050565b6000813590506117128161275a565b92915050565b60008135905061172781612771565b92915050565b60008151905061173c81612771565b92915050565b600082601f83011261175357600080fd5b8135611763848260208601611672565b91505092915050565b600082601f83011261177d57600080fd5b813561178d8482602086016116b0565b91505092915050565b6000813590506117a581612788565b92915050565b6000602082840312156117bd57600080fd5b60006117cb848285016116ee565b91505092915050565b600080604083850312156117e757600080fd5b60006117f5858286016116ee565b9250506020611806858286016116ee565b9150509250929050565b60008060006060848603121561182557600080fd5b6000611833868287016116ee565b9350506020611844868287016116ee565b925050604061185586828701611796565b9150509250925092565b6000806000806080858703121561187557600080fd5b6000611883878288016116ee565b9450506020611894878288016116ee565b93505060406118a587828801611796565b925050606085013567ffffffffffffffff8111156118c257600080fd5b6118ce87828801611742565b91505092959194509250565b600080604083850312156118ed57600080fd5b60006118fb858286016116ee565b925050602061190c85828601611703565b9150509250929050565b6000806040838503121561192957600080fd5b6000611937858286016116ee565b925050602083013567ffffffffffffffff81111561195457600080fd5b6119608582860161176c565b9150509250929050565b6000806040838503121561197d57600080fd5b600061198b858286016116ee565b925050602061199c85828601611796565b9150509250929050565b6000602082840312156119b857600080fd5b60006119c684828501611718565b91505092915050565b6000602082840312156119e157600080fd5b60006119ef8482850161172d565b91505092915050565b600060208284031215611a0a57600080fd5b6000611a1884828501611796565b91505092915050565b611a2a81612103565b82525050565b611a3981612115565b82525050565b6000611a4a82612005565b611a54818561201b565b9350611a64818560208601612186565b611a6d81612352565b840191505092915050565b6000611a8382612010565b611a8d818561202c565b9350611a9d818560208601612186565b611aa681612352565b840191505092915050565b6000611abc82612010565b611ac6818561203d565b9350611ad6818560208601612186565b80840191505092915050565b6000611aef60328361202c565b9150611afa82612363565b604082019050919050565b6000611b12601c8361202c565b9150611b1d826123b2565b602082019050919050565b6000611b3560248361202c565b9150611b40826123db565b604082019050919050565b6000611b5860198361202c565b9150611b638261242a565b602082019050919050565b6000611b7b602c8361202c565b9150611b8682612453565b604082019050919050565b6000611b9e60388361202c565b9150611ba9826124a2565b604082019050919050565b6000611bc1602a8361202c565b9150611bcc826124f1565b604082019050919050565b6000611be460298361202c565b9150611bef82612540565b604082019050919050565b6000611c0760208361202c565b9150611c128261258f565b602082019050919050565b6000611c2a602c8361202c565b9150611c35826125b8565b604082019050919050565b6000611c4d60298361202c565b9150611c5882612607565b604082019050919050565b6000611c70602f8361202c565b9150611c7b82612656565b604082019050919050565b6000611c9360218361202c565b9150611c9e826126a5565b604082019050919050565b6000611cb660318361202c565b9150611cc1826126f4565b604082019050919050565b611cd58161216d565b82525050565b6000611ce78285611ab1565b9150611cf38284611ab1565b91508190509392505050565b6000602082019050611d146000830184611a21565b92915050565b6000608082019050611d2f6000830187611a21565b611d3c6020830186611a21565b611d496040830185611ccc565b8181036060830152611d5b8184611a3f565b905095945050505050565b6000602082019050611d7b6000830184611a30565b92915050565b60006020820190508181036000830152611d9b8184611a78565b905092915050565b60006020820190508181036000830152611dbc81611ae2565b9050919050565b60006020820190508181036000830152611ddc81611b05565b9050919050565b60006020820190508181036000830152611dfc81611b28565b9050919050565b60006020820190508181036000830152611e1c81611b4b565b9050919050565b60006020820190508181036000830152611e3c81611b6e565b9050919050565b60006020820190508181036000830152611e5c81611b91565b9050919050565b60006020820190508181036000830152611e7c81611bb4565b9050919050565b60006020820190508181036000830152611e9c81611bd7565b9050919050565b60006020820190508181036000830152611ebc81611bfa565b9050919050565b60006020820190508181036000830152611edc81611c1d565b9050919050565b60006020820190508181036000830152611efc81611c40565b9050919050565b60006020820190508181036000830152611f1c81611c63565b9050919050565b60006020820190508181036000830152611f3c81611c86565b9050919050565b60006020820190508181036000830152611f5c81611ca9565b9050919050565b6000602082019050611f786000830184611ccc565b92915050565b6000611f88611f99565b9050611f9482826121eb565b919050565b6000604051905090565b600067ffffffffffffffff821115611fbe57611fbd612323565b5b611fc782612352565b9050602081019050919050565b600067ffffffffffffffff821115611fef57611fee612323565b5b611ff882612352565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b60006120538261216d565b915061205e8361216d565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561209357612092612296565b5b828201905092915050565b60006120a98261216d565b91506120b48361216d565b9250826120c4576120c36122c5565b5b828204905092915050565b60006120da8261216d565b91506120e58361216d565b9250828210156120f8576120f7612296565b5b828203905092915050565b600061210e8261214d565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b838110156121a4578082015181840152602081019050612189565b838111156121b3576000848401525b50505050565b600060028204905060018216806121d157607f821691505b602082108114156121e5576121e46122f4565b5b50919050565b6121f482612352565b810181811067ffffffffffffffff8211171561221357612212612323565b5b80604052505050565b60006122278261216d565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561225a57612259612296565b5b600182019050919050565b60006122708261216d565b915061227b8361216d565b92508261228b5761228a6122c5565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000602082015250565b7f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008201527f726f206164647265737300000000000000000000000000000000000000000000602082015250565b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960008201527f73206e6f74206f776e0000000000000000000000000000000000000000000000602082015250565b7f4552433732314d657461646174613a2055524920717565727920666f72206e6f60008201527f6e6578697374656e7420746f6b656e0000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008201527f776e6572206e6f7220617070726f766564000000000000000000000000000000602082015250565b61274c81612103565b811461275757600080fd5b50565b61276381612115565b811461276e57600080fd5b50565b61277a81612121565b811461278557600080fd5b50565b6127918161216d565b811461279c57600080fd5b5056fea264697066735822122041baa3e83409988db359a30db887a11575eac5e3798635c8ea3806d55c595e5864736f6c63430008020033'
const erc721Abi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "player", "type": "address" }, { "internalType": "string", "name": "tokenURI", "type": "string" } ], "name": "awardItem", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "getApproved", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]


const makeDID = (chainid, address, id) => {
  const caip19 = chainid + '_erc721.' + address + '_' + id
  return 'did:nft:' + (caip19.replace(':', '.'))
}

describe('3ID DID Resolver', () => {
  const chainid = 'eip155:1337'
  let config
  let account1, account2
  let did1, did2, did3

  beforeAll(async () => {
    config = {
      ceramic: new Ceramic(),
      ethereumRpcs: {
        [chainid]: 'http://localhost:8545'
      }
    }
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
    const signer1 = provider.getSigner(1)
    account1 = (await signer1.getAddress()).toLowerCase()
    const signer2 = provider.getSigner(2)
    account2 = (await signer2.getAddress()).toLowerCase()
    //const sign = await signer.signMessage('asdfasdf')
    //console.log('p', sign)
    const factory = new ContractFactory(erc721Abi, erc721Bytecode, signer1)
    const contract = await factory.deploy()
    // mint some tokens
    const a = await contract.awardItem(account1, 'ceramic://lolol1')
    const b = await contract.awardItem(account2, 'ceramic://lolol2')
    did1 = makeDID(chainid, contract.address, 1)
    did2 = makeDID(chainid, contract.address, 2)
    did3 = makeDID(chainid, contract.address, 3)
    // create caip10-link

    const ethauthprov = new EthereumAuthProvider({
      send: async (data, cb) => {
        if (data.method === 'eth_chainId') {
          cb(null, {result: '0x0539'})
        } else if (data.method === 'eth_getCode') {
          cb(null, {result: '0x'})
        } else {
          // it's personal_sign
          const msg = u8a.toString(u8a.fromString(data.params[0].slice(2), 'base16'))
          const sign = await signer2.signMessage(msg)
          cb(null, {result: sign})
        }
      }
    }, account2)
    const proof = await ethauthprov.createLink('did:3:testing')
    const doc = await config.ceramic.createDocument('caip10-link', {
      metadata: { family: 'caip10-link', controllers: [proof.account] }
    })
    await doc.change({ content: proof })
  })

  it('getResolver works correctly', async () => {
    const nftResolver = NftResolver.getResolver(config)
    expect(Object.keys(nftResolver)).toEqual(['nft'])
  })

  it('resolves nft document without caip10-link', async () => {
    const nftResolver = NftResolver.getResolver(config)
    const resolver = new Resolver(nftResolver)
    expect(await resolver.resolve(did1)).toEqual({
      didDocument: {
        id: did1,
        verificationMethod: [{
          blockchainAccountId: account1 + '@' + chainid,
          controller: did1,
          id: did1 + '#owner',
          type: 'BlockchainVerificationMethod2021'
        }]
      },
      didDocumentMetadata: {},
      didResolutionMetadata: { contentType: 'application/did+json' }
    })
  })

  it('resolves nft document with caip10-link', async () => {
    const nftResolver = NftResolver.getResolver(config)
    const resolver = new Resolver(nftResolver)
    expect(await resolver.resolve(did2)).toEqual({
      didDocument: {
        id: did2,
        controller: 'did:3:testing',
        verificationMethod: [{
          blockchainAccountId: account2 + '@' + chainid,
          controller: did2,
          id: did2 + '#owner',
          type: 'BlockchainVerificationMethod2021'
        }]
      },
      didDocumentMetadata: {},
      didResolutionMetadata: { contentType: 'application/did+json' }
    })
  })

  it('throws on invalid did', async () => {
    const nftResolver = NftResolver.getResolver(config)
    const resolver = new Resolver(nftResolver)
    expect(await resolver.resolve(did3)).toEqual({
      didDocument: null,
      didDocumentMetadata: {},
      didResolutionMetadata: {
        error: "invalidDid",
        message: "Error: VM Exception while processing transaction: revert ERC721: owner query for nonexistent token"
      }
    })
  })
})
