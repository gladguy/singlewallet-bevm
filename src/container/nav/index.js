import { useBTCProvider, useConnectModal, useETHProvider } from "@particle-network/btc-connectkit";
import {
  Col,
  ConfigProvider,
  Divider,
  Drawer,
  Flex,
  Grid,
  Menu,
  Modal,
  Row,
  Tooltip,
  Tour,
  Typography
} from "antd";
import { ethers } from "ethers";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDisconnect } from "react-icons/ai";
import { PiCopyBold } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import ordinals_O_logo from "../../assets/brands/ordinals_O_logo.png";
import bitcoin_rootstock from "../../assets/coin_logo/bitcoin-rootstock.png";
import logo from "../../assets/logo/ordinalslogo.png";
import CustomButton from "../../component/Button";
import Notify from "../../component/notification";
import { setLoading } from "../../redux/slice/constant";
import {
  clearWalletState,
  setWalletCredentials
} from "../../redux/slice/wallet";
import { storageIdlFactory } from "../../storage_canister";
import {
  agentCreator,
  IndexContractAddress,
  sliceAddress,
  storage
} from "../../utils/common";
import indexJson from "../../utils/index_abi.json";
import { propsContainer } from "../props-container";

const Nav = (props) => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const breakPoint = useBreakpoint();
  const { provider: ethProvider, account: ethAccount, chainId } = useETHProvider();
  const { openConnectModal, disconnect } = useConnectModal();
  const { accounts: btcAccount, getNetwork } = useBTCProvider();

  const { location, navigate } = props.router;
  const { dispatch, reduxState } = props.redux;

  const walletState = reduxState.wallet;
  // const constantState = reduxState.constant;
  const activeWallet = reduxState.wallet.active;
  const ethAddress = walletState.eth.address;
  const btcAddress = walletState.btc.address;

  const [isConnectModal, setConnectModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [screenDimensions, setScreenDimensions] = React.useState({
    width: window.screen.width,
    height: window.screen.height,
  });
  const [current, setCurrent] = useState();

  const avatar = process.env.REACT_APP_AVATAR;

  const { confirm } = Modal;
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);

  const [openTour, setOpenTour] = useState(
    localStorage.getItem("isTourEnabled") ?? true
  );

  const tourSteps = [
    {
      title: (
        <Text strong style={{ color: "violet", fontSize: "20px" }}>
          Browse
        </Text>
      ),
      description:
        "In this you can veiw the approved collections and partners we have in group with us and we have a suprise page to view borrow and lend page.",
      target: () => ref1.current,
    },
    {
      title: (
        <Text strong style={{ color: "violet", fontSize: "20px" }}>
          Dashboard
        </Text>
      ),
      description:
        "In Dashboard page, we have the wallet supplies details, your asset supplies details, asset to supply details and we also have your lendings, asset to lend details.",
      target: () => ref2.current,
    },
    {
      title: (
        <Text strong style={{ color: "violet", fontSize: "20px" }}>
          Portfolio
        </Text>
      ),
      description:
        "In Portfolio page, we have the all the three wallet addresses plug wallet, unisat wallet and xverse wallet and we know what are the loan requests avaliable and we have details of our assets.",
      target: () => ref3.current,
    },
    {
      title: (
        <Text strong style={{ color: "violet", fontSize: "20px" }}>
          Connect Button
        </Text>
      ),
      description:
        "This button is used to connect the wallet. when you click the button modal opens with two tabs, in BTC tab we connect plug wallet and in ICP tab we connect unisat or xverse wallet",
      target: () => ref4.current,
    },
  ];
  console.log("reduxState", reduxState);

  const tourConfirm = () => {
    confirm({
      className: "backModel",
      title: (
        <Text style={{ color: "white", fontSize: "20px", marginTop: -30 }}>
          Tour Alert
        </Text>
      ),
      okText: "Yes",
      cancelText: "No",
      type: "error",
      okButtonProps: { htmlType: "submit" },
      content: (
        <>
          <Row>
            <Col>
              <Typography
                style={{ marginBottom: 5, color: "white", fontSize: "18px" }}
              >
                Are you sure want to cancel tour?
              </Typography>
            </Col>
          </Row>
        </>
      ),
      onOk() {
        localStorage.setItem("isTourEnabled", false);
        setOpenTour(localStorage.getItem("isTourEnabled"));
      },
    });
  };

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrent("tmp-0");
    } else if (location.pathname === "/borrow") {
      setCurrent("tmp-1");
    } else if (location.pathname === "/lend") {
      setCurrent("tmp-2");
    }
    if (location.pathname === "/portfolio") {
      setCurrent("tmp-3");
    }
  }, [current, location.pathname]);

  const successMessageNotify = (message) => {
    Notify("success", message);
  };

  const collapseConnectedModal = () => {
    setConnectModal(!isConnectModal);
    setOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const getScreenDimensions = (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setScreenDimensions({ width, height });
  };

  useEffect(() => {
    window.addEventListener("resize", getScreenDimensions);
    return () => {
      window.removeEventListener("resize", getScreenDimensions);
    };
  }, []);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const options = [
    getItem(
      <Row
        className="font-style"
        onClick={() => {
          navigate("/");
          setOpen(false);
        }}
      >
        Browse
      </Row>
    ),
    getItem(
      <Row
        className="font-style"
        onClick={() => {
          navigate("/lending");
          setOpen(false);
        }}
      >
        Lending
      </Row>
    ),
    getItem(
      <Row
        className="font-style"
        onClick={() => {
          navigate("/borrowing");
          setOpen(false);
        }}
      >
        Borrowing
      </Row>
    ),
    getItem(
      <Row
        className="font-style "
        onClick={() => {
          navigate("/bridge");
          setOpen(false);
        }}
      >
        Bridge Ordinals
      </Row>
    ),
    getItem(
      <Row
        className="font-style"
        onClick={() => {
          navigate("/portfolio");
          setOpen(false);
        }}
      >
        Portfolio
      </Row>
    ),
  ];

  const addressRendererWithCopy = (address) => {
    return (
      <Tooltip arrow title={"Copied"} trigger={"click"} placement="top">
        <PiCopyBold
          className="pointer"
          onClick={() => {
            navigator.clipboard.writeText(address);
          }}
          size={15}
        />
      </Tooltip>
    );
  };

  const avatarRenderer = (width) => (
    <img
      src={`${avatar}/svg?seed=${btcAddress
        ? btcAddress
        : ethAddress
        }`}
      width={width}
      className="avatar"
      alt="avatar"
    />
  );
  gsap.to(".round", {
    rotation: 360,
    duration: 4,
    repeat: -1,
    repeatDelay: 10,
    ease: "none",
  });

  const handleConnectionFinish = async () => {
    const API = agentCreator(storageIdlFactory, storage);

    const provider = new ethers.providers.Web3Provider(ethProvider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      IndexContractAddress,
      indexJson,
      signer
    );

    const isAcExist = await contract.getBitcoinAddressId(ethAccount);
    const isAccountExistInABI = Number(isAcExist.toString());

    let verifyAddress = await API.verifyAddressPair({
      chain_id: chainId,
      bitcoinAddress: btcAccount[1],
      ethereumAddress: ethAccount,
    });
    verifyAddress = Number(verifyAddress);

    if (verifyAddress === 1) {
      const btcAddress = await API.getByEthereumAddress({
        chainId: chainId,
        ethereumAddress: ethAccount,
      });
      Notify(
        "warning",
        `Account not found, try connecting ${btcAddress} BTC account!`
      );
    } else if (verifyAddress === 2) {
      const ethAddress = await API.getByBitcoinAddress({
        chainId: chainId,
        bitcoinAddress: btcAccount[1],
      });
      Notify(
        "warning",
        `Account not found, try connecting ${ethAddress} ETH account!`
      );
    } else if (verifyAddress === 3) {
      const storeAddress = await API.storeAddress({
        chain_id: chainId,
        bitcoinAddress: btcAccount[1],
        ethereumAddress: ethAccount,
      });

      if (!isAccountExistInABI) {
        const saveResult = await contract.saveBitcoinAddress(
          Number(storeAddress),
          ethAccount
        );
        await saveResult.wait();
        if (saveResult.hash) {
          Notify("success", "Account creation success!", 3000);
        }
      }
    }
  };

  useEffect(() => {
    if (btcAccount.length && ethAccount && !btcAddress) {
      try {
        (async () => {
          dispatch(setLoading(true));
          // Eth balance
          const provider = new ethers.providers.Web3Provider(ethProvider);
          const balance = await provider.getBalance(ethAccount);
          const balanceInEther = ethers.utils.formatEther(balance);

          // Btc balance
          const network = await getNetwork();
          const networkSuffix = network === 'livenet' ? 'main' : 'test3';
          const response = await fetch(`https://api.blockcypher.com/v1/btc/${networkSuffix}/addrs/${btcAccount[1]}/balance`);
          let data, btcBalance;

          if (response.status === 429) {
            btcBalance = 0;
            console.log('Too many requests. Please try again later.');
          } else {
            data = await response.json();
            btcBalance = data.balance / 1e8;
          }

          dispatch(setWalletCredentials({
            btcAddress: btcAccount[1],
            btcBalance: btcBalance,
            ethAddress: ethAccount,
            ethBalance: Number(balanceInEther)
          }));
          Notify("success", "Wallet connected!");
          await handleConnectionFinish();
          dispatch(setLoading(false));
        })();
      } catch (error) {
        dispatch(setLoading(false));
        console.log("finish connection error", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btcAccount, ethAccount, dispatch])

  return (
    <>
      <Row
        justify={{
          xs: "space-between",
          lg: "space-between",
          xl: "space-between",
        }}
        align={"middle"}
      >
        <Col>
          <Row align={"middle"}>
            <Col>
              <img
                src={logo}
                alt="logo"
                className="pointer"
                width="70px"
                onClick={() => {
                  navigate("/");
                }}
              />
            </Col>
          </Row>
        </Col>

        <Col>
          {screenDimensions.width >= 1200 && (
            <>
              <Flex gap={50}>
                <Text
                  className={`${location.pathname === "/"
                    ? "headertitle headerStyle"
                    : "font-style headerCompanyName"
                    } pointer heading-one `}
                  onClick={() => {
                    navigate("/");
                  }}
                  ref={ref1}
                >
                  Browse
                </Text>
                <Text className="font-xsmall color-grey">|</Text>
                <Text
                  className={`${location.pathname === "/lending"
                    ? "headertitle headerStyle"
                    : "font-style headerCompanyName"
                    } pointer heading-one `}
                  onClick={() => {
                    navigate("/lending");
                  }}
                  ref={ref2}
                >
                  Lending
                </Text>
                <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${location.pathname === "/borrowing"
                    ? "headertitle headerStyle"
                    : "font-style headerCompanyName"
                    } pointer heading-one `}
                  onClick={() => {
                    navigate("/borrowing");
                  }}
                  ref={ref2}
                >
                  Borrowing
                </Text>
                {/* <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${
                    location.pathname === "/myassets"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/myassets");
                    }}
                  ref={ref3}
                >
                  My Assets
                </Text> */}

                <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${location.pathname === "/bridge"
                    ? "headertitle headerStyle"
                    : "font-style headerCompanyName"
                    } pointer heading-one `}
                  onClick={() => {
                    navigate("/bridge");
                  }}
                  ref={ref3}
                >
                  Bridge Ordinals
                </Text>
                <Text className="font-xsmall color-grey">|</Text>
                <Text
                  className={`${location.pathname.includes("portfolio")
                    ? "headertitle headerStyle"
                    : "font-style headerCompanyName"
                    } pointer heading-one  `}
                  onClick={() => {
                    navigate("/portfolio");
                  }}
                  ref={ref5}
                >
                  Portfolio
                </Text>

                <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${location.pathname === "/activeloans"
                    ? "headertitle headerStyle"
                    : "font-style headerCompanyName"
                    } pointer heading-one `}
                  onClick={() => {
                    navigate("/activeloans");
                  }}
                  ref={ref6}
                >
                  Active Loans
                </Text>
              </Flex>
            </>
          )}
        </Col>

        <Col>
          <Flex gap={10} justify="end" align={"center"} ref={ref4}>
            {activeWallet ? (
              <Col>
                <Flex
                  gap={5}
                  align="center"
                  className="pointer"
                  onClick={showDrawer}
                  justify="space-evenly"
                >
                  {screenDimensions.width > 767 ? (
                    <>{avatarRenderer(45)}</>
                  ) : (
                    <label class="hamburger">
                      <input type="checkbox" checked={open} />
                      <svg viewBox="0 0 32 32">
                        <path
                          class="line line-top-bottom"
                          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                        ></path>
                        <path class="line" d="M7 16 27 16"></path>
                      </svg>
                    </label>
                  )}
                </Flex>
              </Col>
            ) : (
              <Col>
                {!breakPoint.xs ? (
                  <Row justify={"end"}>
                    <CustomButton
                      className="click-btn font-weight-600 letter-spacing-small"
                      // old btn style
                      // className="button-css lend-button"
                      title={ethAddress ? "Disconnect" : "Connect"}
                      onClick={async () => {
                        if (ethAddress) {
                          disconnect();
                        } else {
                          openConnectModal();
                        }
                      }}
                    />
                  </Row>
                ) : (
                  <RxHamburgerMenu
                    color="violet"
                    size={25}
                    onClick={showDrawer}
                  />
                )}
              </Col>
            )}
          </Flex>
        </Col>
      </Row>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "green",
          },
        }}
      >
        <Tour
          scrollIntoViewOptions={true}
          open={openTour === "false" ? false : true}
          zIndex={1}
          animated
          onClose={(location) => {
            if (location === 3) {
              localStorage.setItem("isTourEnabled", false);
              setOpenTour(localStorage.getItem("isTourEnabled"));
            } else {
              tourConfirm();
            }
          }}
          steps={tourSteps}
          indicatorsRender={(current, total) => (
            <span>
              {current + 1} / {total}
            </span>
          )}
        />
      </ConfigProvider>

      <Drawer
        closeIcon
        width={screenDimensions.width > 425 ? "320px" : "280px"}
        style={{ height: screenDimensions.width > 1199 ? "43%" : "100%" }}
        title={
          <>
            <Row justify={"space-evenly"} align={"middle"}>
              <Flex gap={10} align="center">
                {avatarRenderer(45)}
                <Text className="text-color-one">
                  {btcAddress ? (
                    <>{sliceAddress(btcAddress, 5)}</>
                  ) : (
                    <>{sliceAddress(ethAddress, 5)}</>
                  )}
                </Text>
              </Flex>
            </Row>
            <Row justify={"center"}>
              <Divider />
            </Row>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        footer={
          <>
            {screenDimensions.width > 1199 && (
              <Row justify={"end"} className="iconalignment pointer">
                <CustomButton
                  className={"click-btn font-weight-600 letter-spacing-small"}
                  onClick={async () => {
                    successMessageNotify("Your are signed out!");
                    dispatch(clearWalletState());
                    disconnect();
                    onClose();
                  }}
                  title={
                    <Flex align="center" justify="center" gap={3}>
                      <AiOutlineDisconnect
                        color="white"
                        style={{ fill: "chocolate" }}
                        size={25}
                      />
                      <Text className="text-color-two font-small heading-one">
                        Disconnect
                      </Text>
                    </Flex>
                  }
                  block
                  size="medium"
                />
              </Row>
            )}
          </>
        }
      >
        {/* Drawer Renderer */}
        <>
          <Row justify={"space-between"} align={"middle"}>
            <Col>
              <Flex align="center">
                <img
                  src={bitcoin_rootstock}
                  alt="aptos"
                  style={{ marginRight: "10px" }}
                  width={30}
                />
                <Flex vertical>
                  <Text className="text-color-two font-medium">Payments</Text>
                  <Text className="text-color-one font-xsmall">
                    {ethAddress ? (
                      <>
                        {sliceAddress(ethAddress, 9)}{" "}
                        {addressRendererWithCopy(ethAddress)}
                      </>
                    ) : (
                      "---"
                    )}
                  </Text>
                </Flex>
              </Flex>
            </Col>

            <Col>
              {walletState.active ? null : (
                <CustomButton
                  className="font-size-18 black-bg text-color-one border-none"
                  title={"Connect"}
                  onClick={() => {
                    if (walletState.active) {
                      collapseConnectedModal();
                    } else {
                      successMessageNotify("Wallet already connected!");
                    }
                  }}
                />
              )}
            </Col>
          </Row>

          <Row justify={"space-between"} className="mt" align={"middle"}>
            <Col>
              <Flex align="center">
                <img
                  src={ordinals_O_logo}
                  alt="bitcoin"
                  style={{ marginRight: "10px", borderRadius: "50%" }}
                  width={25}
                />
                <Flex vertical>
                  <Text className="text-color-two font-medium">Ordinals</Text>
                  <Text className="text-color-one font-xsmall">
                    {btcAddress ? (
                      <>
                        {sliceAddress(btcAddress, 9)}{" "}
                        {addressRendererWithCopy(btcAddress)}
                      </>
                    ) : (
                      "---"
                    )}
                  </Text>
                </Flex>
              </Flex>
            </Col>

            {/* <Col>
              <CustomButton
                className="font-size-18 black-bg text-color-one border-none"
                title={"Connect"}
                onClick={() => {
                  handleTransfer();
                }}
              />
            </Col> */}

            <Col>
              {walletState.active ? null : (
                <CustomButton
                  className="font-size-18 black-bg text-color-one border-none"
                  title={"Connect"}
                  onClick={() => {
                    if (walletState.active) {
                      collapseConnectedModal();
                    } else {
                      successMessageNotify("Wallet already connected!");
                    }
                  }}
                />
              )}
            </Col>
          </Row>

          {screenDimensions.width < 1200 && (
            <>
              <Row
                style={{ marginTop: "10px" }}
                justify={{
                  xs: "center",
                  sm: "center",
                  md: "end",
                  lg: "end",
                  xl: "end",
                }}
                className="iconalignment pointer"
              >
                <CustomButton
                  className={"click-btn font-weight-600 letter-spacing-small"}
                  onClick={async () => {
                    successMessageNotify("Your are signed out!");
                    dispatch(clearWalletState());
                    disconnect();
                    onClose();
                  }}
                  title={
                    <>
                      <AiOutlineDisconnect
                        color="white"
                        style={{ fill: "chocolate" }}
                        size={25}
                      />
                      <Text className="text-color-two font-small heading-one">
                        Disconnect
                      </Text>
                    </>
                  }
                  block
                  size="medium"
                />
              </Row>
              <Row justify={"center"}>
                <Divider />
              </Row>
              <Menu
                onClick={onClick}
                style={{ width: screenDimensions.width > 425 ? 270 : 230 }}
                defaultOpenKeys={["sub1"]}
                selectedKeys={[current]}
                mode="inline"
                items={options}
              />
              {/* {screenDimensions.width < 992 && (
                <Row style={{ padding: " 0px 24px", marginTop: "10px" }}>
                  <Col>
                    <Loading
                      spin={!constantState.btcvalue}
                      indicator={
                        <TailSpin
                          stroke="#6a85f1"
                          alignmentBaseline="central"
                        />
                      }
                    >
                      {constantState.btcvalue ? (
                        <Flex gap={5}>
                          <Text className="gradient-text-one font-small heading-one">
                            BTC
                          </Text>
                          <img
                            src={Bitcoin}
                            alt="noimage"
                            style={{ justifyContent: "center" }}
                            width="35dvw"
                          />{" "}
                          <Text className="gradient-text-one font-small heading-one">
                            $ {constantState.btcvalue}
                          </Text>
                        </Flex>
                      ) : (
                        ""
                      )}
                    </Loading>
                  </Col>
                </Row>
              )} */}
            </>
          )}
        </>
        {/* Drawer renderer ended */}
      </Drawer>
    </>
  );
};

export default propsContainer(Nav);
