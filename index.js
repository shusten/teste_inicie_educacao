const api = require("./api");
const express = require("express");
const res = require("express/lib/response");

const server = express();

server.use(express.json());

server.listen(8001);

server.get("/", async (req, res) => {
  try {
    const { state, dateStart, dateEnd } = req.query;

    const {
      data: { results },
    } = await api.get(
      `?state=${state}&dateStart=${dateStart}&dateEnd=${dateEnd}`
    );

    const testesCovidArray = processApiResponse(results);

    await sendToTestApi(testesCovidArray);

    return res.send({ dados: testesCovidArray });
  } catch (error) {
    res.send({ error: error.message });
  }
});

function processApiResponse(testesCovidArray) {
  return testesCovidArray
    .filter(({ is_last }) => is_last)
    .filter(({ estimated_population }) => estimated_population !== null)
    .map(calcMedia)
    .sort((testeCovidA, testeCovidB) => testeCovidB.media - testeCovidA.media)
    .slice(0, 10)
    .map((testeCovid, index) => ({
      id: index,
      nomeCidade: testeCovid.city,
      percentualDeCasos: testeCovid.media,
    }));
}

function calcMedia(testeCovid) {
  const pop = testeCovid.estimated_population;
  const confirmed = testeCovid.confirmed;
  const media = (confirmed / pop) * 100;

  return { ...testeCovid, media };
}

async function sendToTestApi(testesCovidArray) {
  await Promise.all(
    testesCovidArray.map(async (element) => {
      await api.post(
        "https://us-central1-lms-nuvem-mestra.cloudfunctions.net/testApi",
        element,
        {
          headers: {
            MeuNome: "Luis Carlos",
          },
        }
      );
    })
  );
}
