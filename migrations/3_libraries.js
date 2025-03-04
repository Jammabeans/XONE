const XENTorrent = artifacts.require("XENTorrent");
const MintInfo = artifacts.require("MintInfo_.sol");
const Metadata = artifacts.require("Metadata");

require("dotenv").config();

module.exports = async function (deployer, network) {
    if (network === 'test') {
        const mintinfoAddress = process.env[`${network.toUpperCase()}_MINTINFO_ADDRESS`];
        const metadataAddress = process.env[`${network.toUpperCase()}_METADATA_ADDRESS`];

        if (!mintinfoAddress) {
            await deployer.deploy(MintInfo);
            await deployer.link(MintInfo, Metadata);
            await deployer.link(MintInfo, XENTorrent);
        } else {
            console.log('    using existing MintInfo_.sol contract at', mintinfoAddress)
            const existingMintinfo = await MintInfo.at(mintinfoAddress);
            await deployer.link(existingMintinfo, Metadata);
            await deployer.link(existingMintinfo, XENTorrent);
        }

        if (!metadataAddress) {
            await deployer.deploy(Metadata);
            await deployer.link(Metadata, XENTorrent);
        } else {
            console.log('    using existing Metadata contract at', metadataAddress);
            const existingMetadata = await Metadata.at(metadataAddress);
            await deployer.link(existingMetadata, XENTorrent);
        }
    }
};
