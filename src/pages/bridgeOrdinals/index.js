import { useETHProvider } from "@particle-network/btc-connectkit";
import { Col, Flex, Row, Tooltip, Typography } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { FaRegSmileWink } from "react-icons/fa";
import { FcApproval, FcHighPriority } from "react-icons/fc";
import { ImSad } from "react-icons/im";
import { IoInformationCircleSharp, IoWarningSharp } from "react-icons/io5";
import { LuRefreshCw } from "react-icons/lu";
import { MdContentCopy } from "react-icons/md";
import { PiCopyBold } from "react-icons/pi";
import { Bars } from "react-loading-icons";
import { Link } from "react-router-dom";
import Bitcoin from "../../assets/coin_logo/bitcoin-rootstock.png";
import CustomButton from "../../component/Button";
import ModalDisplay from "../../component/modal";
import Notify from "../../component/notification";
import TableComponent from "../../component/table";
import WalletConnectDisplay from "../../component/wallet-error-display";
import { propsContainer } from "../../container/props-container";
import { fetchEthBalance } from "../../redux/service/UserService";
import {
  setBorrowCollateral,
  setLoading,
  setUserCollateral,
} from "../../redux/slice/constant";
import { rootstockApiFactory } from "../../rootstock_canister";
import {
  Capitalaize,
  TokenContractAddress,
  agentCreator,
  rootstock,
  sliceAddress
} from "../../utils/common";
import tokenAbiJson from "../../utils/tokens_abi.json";

const BridgeOrdinals = (props) => {
  const { getCollaterals } = props.wallet;
  const { reduxState, isPlugError, dispatch } = props.redux;
  const activeWallet = reduxState.wallet.active;

  const walletState = reduxState.wallet;
  const btcValue = reduxState.constant.btcvalue;
  const userCollateral = reduxState.constant.userCollateral;
  const btcAddress = walletState.btc.address;

  const { Text } = Typography;

  // USE STATE
  const [borrowData, setBorrowData] = useState(null);
  const [lendData, setLendData] = useState([]);
  const { provider: ethProvider } = useETHProvider();

  const [copy, setCopy] = useState("Copy");

  const [handleSupplyModal, setHandleSupplyModal] = useState(false);

  const BTC_ZERO = process.env.REACT_APP_BTC_ZERO;
  const CONTENT_API = process.env.REACT_APP_ORDINALS_CONTENT_API;

  // COMPONENTS & FUNCTIONS
  if (borrowData !== null) {
    borrowData.sort((a, b) => {
      return a.inscriptionNumber - b.inscriptionNumber;
    });
  }

  if (lendData.length !== 0) {
    lendData.sort((a, b) => {
      return a.inscriptionNumber - b.inscriptionNumber;
    });
  }

  const handleOk = () => {
    setHandleSupplyModal(false);
  };

  const handleCancel = () => {
    setHandleSupplyModal(false);
  };

  const handleTokenMint = async (inscriptionNumber) => {
    try {
      dispatch(setLoading(true));
      const provider = new ethers.providers.Web3Provider(ethProvider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        TokenContractAddress,
        tokenAbiJson,
        signer
      );

      const API = agentCreator(rootstockApiFactory, rootstock);
      const tx = await API.getTransactionByKey(inscriptionNumber.toString());

      if (JSON.parse(tx)?.inscriptionNumber) {
        const mintResult = await contract.mintOrdinal(inscriptionNumber);
        await mintResult.wait();
        if (mintResult.hash) {
          Notify("success", "Minting success!");
          getCollaterals();
          dispatch(fetchEthBalance());
        }
      } else {
        Notify("warning", "Please wait for the asset to settle in custody.");
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log("minting error", error);
    }
  };

  const handleTokenBurn = async (inscriptionNumber) => {
    try {
      dispatch(setLoading(true));
      const provider = new ethers.providers.Web3Provider(ethProvider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        TokenContractAddress,
        tokenAbiJson,
        signer
      );

      const mintResult = await contract.burn(inscriptionNumber);
      await mintResult.wait();
      if (mintResult.hash) {
        Notify("success", "Burn success!");
        getCollaterals();
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log("Burn error", error);
    }
  };

  // T1 --------------------------------------------------------------
  const AssetsToSupplyTableColumns = [
    {
      key: "Asset",
      title: "Asset",
      align: "center",
      dataIndex: "asset",
      render: (_, obj) => (
        <>
          <Flex gap={5} vertical align="center">
            {obj.contentType === "image/webp" ||
              obj.contentType === "image/jpeg" ||
              obj.contentType === "image/png" ||
              obj.contentType === "image/svg+xml" ? (
              <img
                src={`${CONTENT_API}/content/${obj.id}`}
                alt={`${obj.id}-borrow_image`}
                className="border-radius-30"
                width={70}
                height={70}
              />
            ) : obj.contentType === "image/svg" ||
              obj.contentType === "text/html;charset=utf-8" ||
              obj.contentType === "text/html" ? (
              //  || obj.contentType === "image/svg+xml"
              <iframe
                loading="lazy"
                width={"80px"}
                height={"80px"}
                style={{ border: "none", borderRadius: "20%" }}
                src={`${CONTENT_API}/content/${obj.id}`}
                title="svg"
                sandbox="allow-scripts"
              >
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <image href={`${CONTENT_API}/content/${obj.id}`} />
                </svg>
              </iframe>
            ) : (
              <img
                src={`${obj?.meta?.collection_page_img_url
                  ? obj?.meta?.collection_page_img_url
                  : `${process.env.PUBLIC_URL}/collections/${obj?.collectionSymbol}`
                  }`}
                // NatBoys
                // src={`https://ipfs.io/ipfs/QmdQboXbkTdwEa2xPkzLsCmXmgzzQg3WCxWFEnSvbnqKJr/1842.png`}
                // src={`${process.env.PUBLIC_URL}/collections/${obj?.collectionSymbol}.png`}
                onError={(e) =>
                  (e.target.src = `${process.env.PUBLIC_URL}/collections/${obj?.collectionSymbol}.png`)
                }
                alt={`${obj.id}-borrow_image`}
                className="border-radius-30"
                width={70}
                height={70}
              />
            )}
            {Capitalaize(obj.collectionSymbol)} - #{obj.inscriptionNumber}
          </Flex>
        </>
      ),
    },
    {
      key: "APY",
      title: "APY",
      align: "center",
      dataIndex: "APY",
      render: (_, obj) => (
        <Text className={"text-color-one"}>
          {Math.round(obj.collection.APY)}%
        </Text>
      ),
    },
    {
      key: "Term",
      title: "Term",
      align: "center",
      dataIndex: "terms",
      render: (_, obj) => (
        <Text className={"text-color-one"}>
          {Number(obj.collection.terms)} Days
        </Text>
      ),
    },
    {
      key: "LTV",
      title: "LTV",
      align: "center",
      dataIndex: "ltv",
      render: (_, obj) => {
        return (
          <Text className={"text-color-one"}>
            {obj?.loanToValue ? obj.collection.loanToValue : 0}%
          </Text>
        );
      },
    },
    {
      key: "Floor Price",
      title: "Floor price",
      align: "center",
      dataIndex: "value",
      render: (_, obj) => {
        const floor = Number(obj.collection.floorPrice)
          ? Number(obj.collection.floorPrice) / BTC_ZERO
          : 25000 / BTC_ZERO;
        return (
          <>
            <Flex vertical align="center">
              <Flex
                align="center"
                gap={3}
                className="text-color-one font-xsmall letter-spacing-small"
              >
                <img src={Bitcoin} alt="noimage" width={20} height={20} />
                {parseInt(floor.toFixed(2))
                  ? floor.toFixed(2)
                  : floor.toFixed(4)}
              </Flex>
              <span className="text-color-two font-xsmall letter-spacing-small">
                $ {(floor * btcValue).toFixed(2)}
              </span>
            </Flex>
          </>
        );
      },
    },
    {
      key: "Can be collateral",
      title: "Can be collateral",
      align: "center",
      dataIndex: "link",
      render: (_, obj) => (
        <>
          {obj.isToken || obj.inLoan ? (
            <FcApproval size={30} />
          ) : (
            <FcHighPriority size={30} />
          )}
        </>
      ),
    },
    {
      key: "Action Buttons",
      title: (
        <Tooltip title="You can create borrow request using your minted collateral ordinals!">
          <IoInformationCircleSharp size={25} color="#a7a700" />
        </Tooltip>
      ),
      align: "center",
      render: (_, obj) => {
        return (
          <Flex gap={5} justify="center">
            {obj.isToken && !obj.inLoan ? (
              <CustomButton
                className="click-btn font-weight-600 letter-spacing-small"
                trigger={"click"}
                disabled={!obj.isToken}
                onClick={() => {
                  handleTokenBurn(obj.inscriptionNumber);
                }}
                title={"Burn🔥"}
              />
            ) : obj.inLoan ? (
              <Text className={"text-color-one font-small"}>In Loan</Text>
            ) : (
              <Flex gap={5}>
                <CustomButton
                  className="click-btn font-weight-600 letter-spacing-small"
                  trigger={"click"}
                  disabled={obj.isToken}
                  onClick={() => handleTokenMint(obj.inscriptionNumber)}
                  title="Mint"
                />
              </Flex>
            )}
          </Flex>
        );
      },
    },
  ];

  useEffect(() => {
    if (activeWallet === 0) {
      setLendData([]);
      setBorrowData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWallet]);

  return (
    <>
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <h1 className="font-xlarge gradient-text-two">Bridge Ordinals</h1>
        </Col>
      </Row>

      <Row justify={"space-between"} align={"middle"}>
        <Col md={24}>
          <Flex className="page-box" align="center" gap={3}>
            <IoInformationCircleSharp size={25} color="#a7a700" />
            <Text className="font-small text-color-two">
              Your ordinal inscription stored in custody address. Address -
              <Link
                to={
                  "https://ordiscan.com/address/bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                }
                target="_blank"
              >
                <Tooltip
                  className="link"
                  title="bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                >
                  {" "}
                  {sliceAddress(
                    "bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                  )}
                </Tooltip>
                .
              </Link>{" "}
              <Tooltip title="Copied" trigger={"click"}>
                <PiCopyBold
                  className="pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                    );
                  }}
                  size={15}
                />{" "}
              </Tooltip>
              Ordinals sent will reflect here in 15 minutes.
            </Text>
          </Flex>
        </Col>
      </Row>

      <Row justify={"end"} align={"middle"} className="mt-20">
        {activeWallet ? (
          <Col
            onClick={() => {
              dispatch(setBorrowCollateral(null));
              dispatch(setUserCollateral(null));
              getCollaterals();
            }}
          >
            <LuRefreshCw
              className={`pointer ${userCollateral === null ? "spin" : ""}`}
              color="whitesmoke"
              size={25}
            />
          </Col>
        ) : (
          ""
        )}
      </Row>

      {walletState.active ? (
        <Row
          justify={"space-between"}
          className="mt-20 pad-bottom-30"
          gutter={32}
        >
          <Col xl={24}>
            <Row className="m-bottom">
              <Col xl={24}>
                <TableComponent
                  locale={{
                    emptyText: (
                      <Flex align="center" justify="center" gap={5}>
                        {!btcAddress ? (
                          <>
                            <FaRegSmileWink size={25} />
                            <span className="font-medium">
                              Connect any BTC Wallet !
                            </span>
                          </>
                        ) : (
                          <>
                            <ImSad size={25} />
                            <span className="font-medium">
                              Seems you have no assets!
                            </span>
                          </>
                        )}
                      </Flex>
                    ),
                  }}
                  loading={{
                    spinning: userCollateral === null,
                    indicator: <Bars />,
                  }}
                  pagination={{ pageSize: 5 }}
                  rowKey={(e) =>
                    `${e?.id}-${e?.inscriptionNumber
                    }-${Math.random()}-${Date.now()}`
                  }
                  tableColumns={AssetsToSupplyTableColumns}
                  tableData={userCollateral}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <WalletConnectDisplay
          heading={"Please connect any BTC wallets"}
          message={"Connect your wallet to see your assets!"}
          isPlugError={isPlugError}
        />
      )}

      {/* Custody supply address display */}
      <ModalDisplay
        width={"25%"}
        open={handleSupplyModal}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={null}
      >
        <Row justify={"center"}>
          <IoWarningSharp size={50} color="#f46d6d" />
        </Row>
        <Row justify={"center"}>
          <Text className="text-color-one font-xlarge font-weight-600 m-25">
            Reserved Address
          </Text>
        </Row>
        <Row>
          <span className="text-color-two mt-15">
            This is the token reserved contract address, please do not transfer
            directly through the CEX, you will not be able to confirm the source
            of funds, and you will not be responsible for lost funds.
          </span>
        </Row>
        <Row
          justify={"space-around"}
          align={"middle"}
          className="mt-30  border "
        >
          <Col md={18}>
            <span className="text-color-two">
              bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz
            </span>
          </Col>
          <Col md={3}>
            <Row justify={"end"}>
              <Tooltip arrow title={copy} trigger={"hover"} placement="top">
                <MdContentCopy
                  className="pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                    );
                    setCopy("Copied");
                    setTimeout(() => {
                      setCopy("Copy");
                    }, 2000);
                  }}
                  size={20}
                  color="#764ba2"
                />
              </Tooltip>
            </Row>
          </Col>
        </Row>
        <Row>
          <CustomButton
            onClick={handleCancel}
            title="I Know"
            className={"m-25 width background text-color-one "}
          />
        </Row>
      </ModalDisplay>
    </>
  );
};

export default propsContainer(BridgeOrdinals);
