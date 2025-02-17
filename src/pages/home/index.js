import {
  Col,
  Grid,
  Row,
  Skeleton,
  Tooltip,
  Typography
} from "antd";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import bitcoin from "../../assets/coin_logo/Bitcoin.png";
import CardDisplay from "../../component/card";
import { propsContainer } from "../../container/props-container";

const Home = (props) => {
  const { reduxState } = props.redux;
  const collections = reduxState.constant.approvedCollections;
  const { Title, Text } = Typography;
  const { useBreakpoint } = Grid;
  const breakpoints = useBreakpoint();

  const [collectionList, setCollectionList] = useState(collections.slice(0, 9));

  const BTC_ZERO = process.env.REACT_APP_BTC_ZERO;

  gsap.to(".box", {
    y: 10,
    stagger: {
      // wrap advanced options in an object
      each: 0.1,
      from: "center",
      grid: "auto",
      ease: "power2.inOut",
      repeat: 1, // Repeats immediately, not waiting for the other staggered animations to finish
    },
  });

  useEffect(() => {
    if (collections[0]) {
      setCollectionList(collections.slice(0, 9));
    }
  }, [collections]);

  return (
    <React.Fragment>
      {/* Collections */}
      <Row>
        <Col>
          <Title level={breakpoints.xs ? 3 : 2} className="gradient-text-two">
            Bitcoin Ordinal Collections
          </Title>
        </Col>
      </Row>

      <Row justify={"start"} gutter={32}>
        {collectionList?.map((collection, index) => {
          const name = collection?.name;
          const nameSplitted = collection?.name?.split(" ");
          let modifiedName = "";
          nameSplitted?.forEach((word) => {
            if ((modifiedName + word).length < 25) {
              modifiedName = modifiedName + " " + word;
            }
          });
          const floor = collection?.floorPrice ? collection?.floorPrice : 30000;

          return (
            <Col
              key={`${collection?.symbol}-${index}`}
              lg={8}
              md={12}
              sm={12}
              xs={24}
            >
              <Skeleton loading={!collection.symbol} active>
                <CardDisplay
                  className={
                    "main-bg dashboard-card-padding m-top-bottom dashboard-cards pointer box collection-bg"
                  }
                >
                  <Row justify={"center"}>
                    <Col>
                      <div style={{ display: "grid", placeContent: "center" }}>
                        {name?.length > 35 ? (
                          <Tooltip arrow title={name}>
                            <Text className="heading-one text-color-four font-medium">
                              {`${modifiedName}...`}
                            </Text>
                          </Tooltip>
                        ) : (
                          <Text className="heading-one font-medium text-color-four">
                            {modifiedName}
                          </Text>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row
                    justify={{ xs: "space-between", md: "center" }}
                    align={"middle"}
                    className={breakpoints.xs || breakpoints.md ? "mt-5" : ""}
                    gutter={breakpoints.xs || breakpoints.md ? [0, 12] : []}
                  >
                    <Col xs={24} md={24} lg={5} xl={5}>
                      <Row justify={"center"}>
                        <img
                          className="border-radius-5 loan-cards"
                          width={"90px"}
                          height={"75dvw"}
                          alt={name}
                          src={collection?.imageURI}
                          onError={(e) =>
                            (e.target.src = `${process.env.PUBLIC_URL}/collections/${collection?.symbol}.png`)
                          }
                        />
                      </Row>
                    </Col>

                    <Col xs={24} sm={20} md={20} lg={18} xl={18}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "auto auto",
                          gridAutoFlow: "row",
                          gridColumnGap: "10px",
                          placeContent: "center",
                        }}
                      >
                        <div>
                          <Text className="font-medium text-color-two">
                            Floor
                          </Text>
                        </div>

                        <div>
                          <Text className="font-medium text-color-two">
                            <img src={bitcoin} alt="noimage" width="20px" />{" "}
                            {(floor / BTC_ZERO).toFixed(3)}
                          </Text>
                        </div>

                        <div>
                          <Text className="font-medium text-color-two">
                            Volume
                          </Text>
                        </div>

                        <div>
                          <Text className="font-medium text-color-two">
                            <img src={bitcoin} alt="noimage" width="20px" />{" "}
                            {(collection.totalVolume / BTC_ZERO).toFixed(2)}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardDisplay>
              </Skeleton>
            </Col>
          );
        })}
      </Row>

      <Row justify={"center"} className="m-bottom">
        <Col>
          <Text
            className="font-large pointer gradient-text-two"
            onClick={() =>
              setCollectionList(
                collectionList.length > 10
                  ? collections.slice(0, 9)
                  : collections
              )
            }
          >
            {collectionList.length > 10 ? "Hide" : "View all"}
          </Text>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default propsContainer(Home);
