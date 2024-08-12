const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());

app.use("/url", urlRoute);

// app.get("/:shortId", async (req, res) => {
//   const shortId = req.params.shortId;
//   const entry = await URL.findOneAndUpdate(
//     {
//       shortId,
//     },
//     {
//       $push: {
//         visitHistory: {
//           timestamp: Date.now(),
//         },
//       },
//     }
//   );
//   res.redirect(entry.redirectURL);
// });
app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;

  try {
    const entry = await URL.findOne({ shortId });

    if (!entry) {
      return res.status(404).send({ error: 'Short URL not found' });
    }

    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
