import { Col, Flex, Row, Typography } from "antd";
import Bars from "react-loading-icons/dist/esm/components/bars";
import { useSelector } from "react-redux";
import ckBtc from "../../assets/coin_logo/bitcoin-rootstock.png";
import { getTimeAgo } from "../../utils/common";
import CustomButton from "../Button";
import ModalDisplay from "../modal";
import TableComponent from "../table";

const OffersModal = ({
  modalState,
  offerModalData,
  toggleOfferModal,
  toggleLendModal,
  setLendModalData,
}) => {
  const { Text } = Typography;
  const state = useSelector((state) => state);
  const offers = state.constant.offers;
  const ethAddress = state.wallet.eth.address;

  const BTC_ZERO = process.env.REACT_APP_BTC_ZERO;
  const ETH_ZERO = process.env.REACT_APP_ETH_ZERO;

  const activeOffersColumns = [
    {
      key: "Principal",
      title: "Principal",
      align: "left",
      dataIndex: "loanAmount",
      render: (_, obj) => (
        <Flex
          gap={3}
          align="center"
          className={`text-color-one font-size-16 letter-spacing-small`}
        >
          <img src={ckBtc} alt="noimage" width="20px" />{" "}
          {Number(obj.loanAmount) / ETH_ZERO}
        </Flex>
      ),
    },
    {
      key: "LTV",
      title: "LTV",
      align: "center",
      dataIndex: "loanToValue",
      render: (_, obj) => {
        const floor = Number(offerModalData.floorPrice)
          ? Number(offerModalData.floorPrice)
          : 30000;
        const loanAmount = Number(obj.loanAmount) / BTC_ZERO;
        const LTV = Math.round(loanAmount / floor);

        return (
          <Text className={`text-color-one font-size-16 letter-spacing-small`}>
            {LTV}%
          </Text>
        );
      },
    },
    {
      key: "Date",
      title: "Date",
      align: "center",
      dataIndex: "loanTime",
      render: (_, obj) => (
        <Text className={`text-color-one font-size-16 letter-spacing-small`}>
          {getTimeAgo(Number(obj.createdAt) * 1000)}
        </Text>
      ),
    },
  ];
  // console.log("offerModalData", offerModalData);
  return (
    <ModalDisplay
      width={"70%"}
      footer={null}
      open={modalState}
      onCancel={toggleOfferModal}
    >
      <Row justify={"center"}>
        <Text className={"gradient-text-one font-xlarge letter-spacing-small"}>
          Accept Loan on {offerModalData.collectionName}
        </Text>
      </Row>

      <Row justify={"space-between"} className="mt-15">
        {/* Active Offers */}
        <Col md={12}>
          <Row className="pad-5">
            <Col md={24} className="border border-radius-8 card-box">
              <Row justify={"center"}>
                <Text
                  className={`text-color-two font-small letter-spacing-small`}
                >
                  Active Requests
                </Text>
              </Row>
            </Col>

            <Col
              className={`mt-5 scroll-themed`}
              md={24}
              style={{
                maxHeight: "600px",
                overflowY: offers?.length > 6 && "scroll",
                paddingRight: offers?.length > 6 && "5px",
              }}
            >
              <TableComponent
                rootClassName={"offer-table-theme"}
                loading={{
                  spinning: offers === null,
                  indicator: <Bars />,
                }}
                rowKey={(e) => `${e?.inscriptionid}-${e?.mime_type}`}
                tableColumns={[
                  ...activeOffersColumns,
                  {
                    key: "action",
                    title: " ",
                    align: "center",
                    dataIndex: "borrow",
                    render: (_, obj) => {
                      const floor = Number(offerModalData.floorPrice)
                        ? Number(offerModalData.floorPrice)
                        : 30000;
                      const loanAmount = Number(obj.loanAmount) / BTC_ZERO;
                      const LTV = Math.round(loanAmount / floor);
                      return (
                        <CustomButton
                          disabled={obj.borrower === ethAddress}
                          className={
                            "click-btn font-weight-600 letter-spacing-small"
                          }
                          title={
                            <Flex align="center" justify="center" gap={10}>
                              <span
                                className={`text-color-one font-weight-600 pointer iconalignment font-size-16`}
                              >
                                Lend
                              </span>
                            </Flex>
                          }
                          onClick={() => {
                            toggleOfferModal();
                            toggleLendModal();
                            setLendModalData({
                              ...obj,
                              ...offerModalData,
                              LTV,
                            });
                          }}
                        />
                      );
                    },
                  },
                ]}
                tableData={offers}
                pagination={false}
              />
            </Col>
          </Row>
        </Col>

        {/* Active Loans */}
        <Col md={12}>
          <Row className="pad-5">
            <Col md={24} className="border border-radius-8 card-box">
              <Row justify={"center"} align={"middle"}>
                <Text
                  className={`text-color-two font-small letter-spacing-small`}
                >
                  Active Loans
                </Text>
              </Row>
            </Col>

            <Col
              md={24}
              style={{
                maxHeight: "600px",
                // minHeight: "600px",
                // overflowY: offers?.length > 6 && "scroll",
                // paddingRight: offers?.length > 6 && "5px",
              }}
              className="mt-5"
            >
              <TableComponent
                rootClassName={"offer-table-theme"}
                loading={{
                  spinning: false,
                  indicator: <Bars />,
                }}
                rowKey={(e) => `${e?.inscriptionid}-${e?.mime_type}`}
                tableColumns={activeOffersColumns}
                tableData={[]}
                pagination={false}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </ModalDisplay>
  );
};

export default OffersModal;
