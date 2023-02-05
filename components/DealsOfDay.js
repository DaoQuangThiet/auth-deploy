import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Image_1 from "../assets/img/deals_of_day_1.png";
import Image_2 from "../assets/img/deals_of_day_2.png";
import CountDown from "./Countdown";

const colorHover = "#40c6ff";
const useStyles = makeStyles({
  dealsOfDay: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "50px",
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#40c6ff",
    position: "absolute",
    top: 16,
    left: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 125,
    height: 40,
    borderRadius: 20,
    border: "2px solid rgb(64,198,255)",
    color: "rgb(64,198,255)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    cursor: "pointer",
    "&:hover": {
      background: "rgb(64,198,255)",
      color: "#ffff",
      transition: "all 0.25s",
    },
  },
  layoutDealsDay: {
    display: "flex",
    justifyContent: "space-between",
    width: "95%",
    flexWrap: "wrap",
    "@media (max-width: 768px)": {
      display: "flex",
    },
  },
  layoutIteam: {
    display: "flex",
    alignItems: "center",
    width: "45%",
    "@media (max-width: 600px)": {
      display: "block",
      width: "100%",
      marginBottom: "30px",
    },
    "@media (max-width: 768px)": {
      display: "flex",
    },
    "@media (max-width: 1100px)": {
      display: "block",
    },
  },
  buttonLink: {
    textDecoration: "none",
    "&:hover": {
      color: "#fff",
      transition: "all 0.25s",
    },
  },
  nameProSales: {
    fontFamily: "Mulish,sans-serif",
    fontSize: "19px",
    fontWeight: "bold",
    color: "#444",
    marginBottom: "10px",
  },
  titleHome: {
    fontFamily: "Merriweather,sans-serif",
    color: "#444444",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "30px 0px 25px 0px",
    "& span": {
      position: "relative",
      display: "inline-block",
      "&::after": {
        position: "absolute",
        content: '""',
        width: "15px",
        height: "1px",
        left: "-30px",
        top: "18px",
        backgroundColor: `${colorHover}`,
      },
      "&::before": {
        position: "absolute",
        content: '""',
        width: "15px",
        height: "1px",
        right: "-30px",
        top: "18px",
        backgroundColor: `${colorHover}`,
      },
    },
  },
  descPro: {
    color: "#666",
    margin: "18px 8px 27px 0px",
    textDecoration: "none",
  },
});
export default function DealsOfDay(props) {
  const { productDeal } = props;
  const classes = useStyles();
  return (
    <Container>
      <Grid className={classes.dealsOfDay}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography className={classes.titleHome}>
            <span>DEALS OF DAY</span>
          </Typography>
        </Box>
        <Box className={classes.layoutDealsDay}>
          {productDeal &&
            productDeal.map((items, index) => (
              <Box key={index} className={classes.layoutIteam}>
                <Box
                  style={{
                    position: "relative",
                    textAlign: "center",
                    color: "white",
                    border: "1px solid #f1f1f1",
                  }}
                >
                  <img
                    src={items.image?.sourceUrl}
                    style={{
                      width: 264,
                    }}
                  />
                  <Box className={classes.circle}>
                    <Typography style={{ fontSize: 14 }}>-22%</Typography>
                  </Box>
                </Box>
                <Box style={{ marginLeft: 30 }}>
                  <Link
                    href={`/product/${items?.slug}`}
                    className={classes.buttonLink}
                  >
                    <a>
                      <Typography className={classes.nameProSales}>
                        {items?.name}
                      </Typography>
                    </a>
                  </Link>
                  <Box
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      display: "flex",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#999",
                        margin: "0px 20px 0px 0px",
                        textDecoration: "line-through",
                      }}
                    >
                      {items.regularPrice}
                    </Typography>
                    <Typography style={{ color: "rgb(64,198,255)", margin: 0 }}>
                      {items.price}
                    </Typography>
                  </Box>
                  <Typography
                    style={{ color: "#666", margin: "18px 8px 27px 0px" }}
                  >
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been....
                  </Typography>
                  <CountDown />
                  <Box className={classes.button}>
                    <Link
                      href={`/product/${items?.slug}`}
                      className={classes.buttonLink}
                    >
                      <a>
                        <Typography
                          sx={{ fontSize: "14px", fontWeight: "600" }}
                        >
                          SHOP NOW
                        </Typography>
                      </a>
                    </Link>
                  </Box>
                </Box>
              </Box>
            ))}
        </Box>
      </Grid>
    </Container>
  );
}
