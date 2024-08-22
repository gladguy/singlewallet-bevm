import { Col, Collapse, Divider, Flex, Grid, Row, Typography } from "antd";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { TbInfoSquareRounded } from "react-icons/tb";
import { useSelector } from "react-redux";
import Bitcoin from "../../assets/coin_logo/bitcoin-rootstock.png";
import borrowJson from "../../utils/borrow_abi.json";
import {
  API_METHODS,
  apiUrl,
  BorrowContractAddress,
  TokenContractAddress,
} from "../../utils/common";
import tokensJson from "../../utils/tokens_abi.json";
import CustomButton from "../Button";
import ModalDisplay from "../modal";
import Notify from "../notification";
import { Link } from "react-router-dom";
import { useETHProvider } from "@particle-network/btc-connectkit";

const LendModal = ({
  modalState,
  lendModalData,
  toggleLendModal,
  setLendModalData,
  collapseActiveKey,
  setCollapseActiveKey,
}) => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const reduxState = useSelector((state) => state);
  const btcvalue = reduxState.constant.btcvalue;
  const activeWallet = reduxState.wallet.active;

  const ETH_ZERO = process.env.REACT_APP_ETH_ZERO;

  const [isOfferBtnLoading, setIsOfferBtnLoading] = useState(false);
  const { provider: ethProvider } = useETHProvider();

  const handleAcceptRequest = async () => {
    try {
      setIsOfferBtnLoading(true);
      const provider = new ethers.providers.Web3Provider(ethProvider);
      const signer = provider.getSigner();
      const tokensContract = new ethers.Contract(
        TokenContractAddress,
        tokensJson,
        signer
      );

      const borrowContract = new ethers.Contract(
        BorrowContractAddress,
        borrowJson,
        signer
      );

      const isApproved = await tokensContract.isApprovedForAll(
        lendModalData.borrower,
        BorrowContractAddress
      );

      if (!isApproved) {
        Notify("warning", "Borrower not approved!");
        setIsOfferBtnLoading(false);
        return;
      }

      const requestId = Number(lendModalData.requestId);
      const loanAmount = Number(lendModalData.loanAmount);
      console.log("lendModalData.loanAmount", loanAmount);

      const acceptLoan = await borrowContract.acceptBorrowRequest(requestId, {
        value: (loanAmount).toString(),
      });

      await acceptLoan.wait();

      if (acceptLoan.hash) {
        Notify("success", "Lending success");
        toggleLendModal();
      }

      setIsOfferBtnLoading(false);
    } catch (error) {
      setIsOfferBtnLoading(false);
      console.log("Accept req error", error);
      console.log(error.message);
    }
  };

  useEffect(() => {
    (async () => {
      if (Number(lendModalData.tokenId) && !lendModalData.asset) {
        const result = await API_METHODS.get(
          `${apiUrl.Asset_server_base_url}/api/v2/fetch/inscription/${Number(
            lendModalData.tokenId
          )}`
        );
        setLendModalData({ ...lendModalData, asset: result.data.data.data });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lendModalData]);

  return (
    <ModalDisplay
      destroyOnClose={true}
      footer={null}
      title={
        <Flex align="center" gap={5} justify="start">
          <Text className={`font-size-20 text-color-one letter-spacing-small`}>
            {lendModalData.collectionName}{" "}
            <Link
              target="_blank"
              to={`https://magiceden.io/ordinals/item-details/${lendModalData?.asset?.inscription_id}`}
            >
              #{Number(lendModalData.tokenId)}
            </Link>
          </Text>
        </Flex>
      }
      open={modalState}
      onCancel={toggleLendModal}
      width={screens.xl ? "35%" : screens.lg ? "50%" : "100%"}
    >
      {/* Lend Image Display */}
      <Row justify={"space-between"} className="mt-30">
        <Col md={4}>
          {lendModalData?.asset?.mimeType === "text/html" ? (
            <iframe
              className="border-radius-8 pointer"
              title={`Iframe`}
              height={70}
              width={70}
              onError={(e) => (e.target.src = lendModalData.thumbnailURI)}
              src={`${process.env.REACT_APP_ORDINALS_CONTENT_API}/content/${lendModalData?.asset?.inscription_id}`}
            />
          ) : (
            <img
              width={70}
              alt="withdraw_img"
              onError={(e) => (e.target.src = lendModalData.thumbnailURI)}
              className="border-radius-8"
              src={`${process.env.REACT_APP_ORDINALS_CONTENT_API}/content/${lendModalData?.asset?.inscription_id}`}
            />
          )}
        </Col>

        <Col md={5}>
          <Flex
            vertical
            justify="center"
            align="center"
            className={`border border-radius-8 pointer`}
          >
            <Text className={`font-small text-color-one letter-spacing-small`}>
              Floor
            </Text>
            <Text
              className={`font-size-16 text-color-two letter-spacing-small`}
            >
              {Number(lendModalData.loanAmount) / ETH_ZERO}
            </Text>
          </Flex>
        </Col>

        <Col md={5}>
          <Flex
            vertical
            justify="center"
            align="center"
            className={`border border-radius-8 pointer`}
          >
            <Text className={`font-small text-color-one letter-spacing-small`}>
              Term
            </Text>
            <Text
              className={`font-size-16 text-color-two letter-spacing-small`}
            >
              {Number(lendModalData.duration)} Days
            </Text>
          </Flex>
        </Col>

        <Col md={5}>
          <Flex
            vertical
            justify="center"
            align="center"
            className={`border border-radius-8 pointer`}
          >
            <Text className={`font-small text-color-one letter-spacing-small`}>
              LTV
            </Text>
            <Text
              className={`font-size-16 text-color-two letter-spacing-small`}
            >
              {lendModalData?.LTV ? lendModalData?.LTV : 0}%
            </Text>
          </Flex>
        </Col>
      </Row>

      {/* Borrow Divider */}
      <Row justify={"center"}>
        <Divider />
      </Row>

      {/* Lend Offer Summary */}
      <Row className="mt-15">
        <Col md={24} className="collapse-antd">
          <Collapse
            className="border"
            size="small"
            ghost
            expandIcon={({ isActive }) => (
              <FaCaretDown
                color={isActive ? "white" : "#742e4c"}
                size={25}
                style={{
                  transform: isActive ? "" : "rotate(-90deg)",
                  transition: "0.5s ease",
                }}
              />
            )}
            defaultActiveKey={["1"]}
            activeKey={collapseActiveKey}
            onChange={() => {
              if (collapseActiveKey[0] === "1") {
                setCollapseActiveKey(["2"]);
              } else {
                setCollapseActiveKey(["1"]);
              }
            }}
            items={[
              {
                key: "1",
                label: (
                  <Text
                    className={`font-small text-color-one letter-spacing-small`}
                  >
                    Accept Summary
                  </Text>
                ),
                children: (
                  <>
                    <Row justify={"space-between"}>
                      <Col>
                        <Text
                          className={`font-size-16 text-color-one letter-spacing-small`}
                        >
                          Loan amount
                        </Text>
                      </Col>
                      <Col>
                        <Flex align="center" gap={10}>
                          <Text
                            className={`card-box border text-color-two padding-small-box padding-small-box font-xsmall`}
                          >
                            ${" "}
                            {(
                              (Number(lendModalData.loanAmount) / ETH_ZERO) *
                              btcvalue
                            ).toFixed(2)}
                          </Text>

                          <Text
                            className={`font-size-16 text-color-one letter-spacing-small`}
                          >
                            ~ {Number(lendModalData.loanAmount) / ETH_ZERO}
                          </Text>
                          <img
                            src={Bitcoin}
                            alt="noimage"
                            style={{ justifyContent: "center" }}
                            width={25}
                          />
                        </Flex>
                      </Col>
                    </Row>

                    <Row justify={"space-between"} className="mt-7">
                      <Col>
                        <Text
                          className={`font-size-16 text-color-one letter-spacing-small`}
                        >
                          Interest
                        </Text>
                      </Col>
                      <Col>
                        <Flex align="center" gap={10}>
                          <Text
                            className={`card-box border text-color-two padding-small-box font-xsmall`}
                          >
                            ${" "}
                            {(
                              (Number(lendModalData.repayAmount) / ETH_ZERO -
                                Number(lendModalData.loanAmount) / ETH_ZERO) *
                              btcvalue
                            ).toFixed(2)}
                          </Text>

                          <Text
                            className={`font-size-16 text-color-one letter-spacing-small`}
                          >
                            ~{" "}
                            {(
                              Number(lendModalData.repayAmount) / ETH_ZERO -
                              Number(lendModalData.loanAmount) / ETH_ZERO
                            ).toFixed(6)}
                          </Text>
                          <img
                            src={Bitcoin}
                            alt="noimage"
                            style={{ justifyContent: "center" }}
                            width={25}
                          />
                        </Flex>
                      </Col>
                    </Row>

                    <Row justify={"space-between"} className="mt-7">
                      <Col>
                        <Text
                          className={`font-size-16 text-color-one letter-spacing-small`}
                        >
                          Platform fee
                        </Text>
                      </Col>
                      <Col>
                        <Flex align="center" gap={10}>
                          <Text
                            className={`card-box border text-color-two padding-small-box font-xsmall`}
                          >
                            ${" "}
                            {(
                              (Number(lendModalData.platformFee) / ETH_ZERO) *
                              btcvalue
                            ).toFixed(2)}
                          </Text>

                          <Text
                            className={`font-size-16 text-color-one letter-spacing-small`}
                          >
                            ~ {Number(lendModalData.platformFee) / ETH_ZERO}
                          </Text>
                          <img
                            src={Bitcoin}
                            alt="noimage"
                            style={{ justifyContent: "center" }}
                            width={25}
                          />
                        </Flex>
                      </Col>
                    </Row>

                    <Row className="mt-15">
                      <Col>
                        <span className={`font-xsmall text-color-two`}>
                          <TbInfoSquareRounded
                            size={12}
                          // color={true ? "#adadad" : "#333333"}
                          />{" "}
                          {`Once a lender accepts the offer and the loan is
                started they will have ${Number(
                            lendModalData.duration
                          )} days to repay the loan. If
                the loan is not repaid you will receive the
                collateral. Manage the loans in the portfolio page`}
                        </span>
                      </Col>
                    </Row>
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>

      {/* Lend button */}
      <Row
        justify={activeWallet ? "end" : "center"}
        className={`${activeWallet ? "" : "border"
          } border-radius-8 mt-15`}
      >
        <Col xs={24}>
          {activeWallet ? (
            <CustomButton
              block
              loading={isOfferBtnLoading}
              className="click-btn font-weight-600 letter-spacing-small"
              title={"Accept loan"}
              onClick={handleAcceptRequest}
            />
          ) : (
            <Flex justify="center">
              <Text
                className={`font-small text-color-one border-padding-medium letter-spacing-small`}
              >
                Connect
              </Text>
            </Flex>
          )}
        </Col>
      </Row>
    </ModalDisplay>
  );
};

export default LendModal;
