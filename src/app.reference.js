import * as d3 from "d3";
import { RiTa } from "rita";
import Sentiment from "sentiment";

import { partsOfSpeech } from "./partsOfSpeech.js";

const sentiment = new Sentiment();

console.log({ RiTa });

const fetchData = async () => {
  const text = await d3.text("/text/Frankenstein.txt");

  const tokens = RiTa.tokenize(text);

  return d3.rollup(
    tokens,
    (v, ...args) => {
      const word = v[0];
      const score = sentiment.analyze(v.join(" ")).score;
      const posType = RiTa.pos(word, { simple: false })[0];

      return {
        occurrences: v.length,
        sentiment: score,
        partOfSpeech: partsOfSpeech[posType],
      };
    },
    (d) => {
      return d.toLowerCase();
    }
  );
};

const data = await fetchData();

const topNegativeWords = Array.from(data)
  .filter(([key, value]) => {
    return value.sentiment < 0;
  })
  .sort((a, b) => {
    return b[1].occurrences - a[1].occurrences;
  });

const app = d3.select("#app");

const title = app
  .append("h1")
  .text("Text Sentiment")
  .style("padding-bottom", "1em");

const table = app.append("table").style("border-collapse", "collapse");

const thead = table
  .append("thead")
  .append("tr")
  .call((tr) => tr.append("td").text("Word"))
  .call((tr) => tr.append("td").text("Occurrences"))
  .call((tr) => tr.append("td").text("Sentiment Score"))
  .call((tr) => tr.append("td").text("Part of Speech"));

const tbody = table
  .append("tbody")
  .selectAll("tr")
  .data(topNegativeWords)
  .join("tr")
  .call((tr) => tr.append("td").text((d) => d[0]))
  .call((tr) => tr.append("td").text((d) => d[1].occurrences))
  .call((tr) => tr.append("td").text((d) => d[1].sentiment))
  .call((tr) => tr.append("td").text((d) => d[1].partOfSpeech));
