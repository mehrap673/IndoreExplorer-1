import * as cheerio from "cheerio";
import { toCamelCase } from "../utils/helpers";

const extractWikipediaData = (html: string, title: string) => {
  const $ = cheerio.load(html);

  const firstParagraph = $(".mw-parser-output > p").first();
  const summary = firstParagraph
    .text()
    .replace(/\s*\[\d+\]\s*/g, "")
    .trim();
  const aliases = firstParagraph
    .find("b")
    .slice(1)
    .map((i, el) => $(el).text())
    .get();

  const infobox: { [key: string]: any } = {};
  $(".infobox.vcard tr").each((_, element) => {
    const labelEl = $(element).find("th");
    const dataEl = $(element).find("td");
    if (labelEl.length && dataEl.length) {
      const label = labelEl.text().trim();
      const value = dataEl
        .text()
        .replace(/\s*\[\d+\]\s*/g, "")
        .trim();
      infobox[toCamelCase(label)] = value;
    }
  });

  let imageUrl: string | null = null;
  const imageSrc = $(".infobox.vcard .infobox-image img").attr("src");
  if (imageSrc) {
    imageUrl =
      "https:" +
      imageSrc
        .replace(/\/thumb\//, "/")
        .split("/")
        .slice(0, -1)
        .join("/");
  }

  const gallery: { caption: string; imageUrl: string }[] = [];
  $("ul.gallery li.gallerybox").each((_, element) => {
    const caption = $(element).find(".gallerytext").text().trim();
    const imgSrc = $(element).find("img").attr("src");
    if (imgSrc) {
      const fullUrl =
        "https:" +
        imgSrc
          .replace(/\/thumb\//, "/")
          .split("/")
          .slice(0, -1)
          .join("/");
      gallery.push({ caption, imageUrl: fullUrl });
    }
  });

  return {
    title,
    aliases,
    summary,
    imageUrl,
    infobox: Object.keys(infobox).length > 0 ? infobox : null,
    gallery: gallery.length > 0 ? gallery : null,
  };
};

export async function fetchAndParseWikipediaData(placeName: string) {
  try {
    const wikiTitle = encodeURIComponent(placeName);
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${wikiTitle}&prop=text&origin=*&redirects=1`;

    const response = await fetch(wikiUrl);
    if (!response.ok) return null;

    const wikiApiResponse = await response.json();
    if (wikiApiResponse.parse?.text?.["*"]) {
      const rawHtml = wikiApiResponse.parse.text["*"];
      const pageTitle = wikiApiResponse.parse.title;
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
        pageTitle
      )}`;
      const extractedData = extractWikipediaData(rawHtml, pageTitle);

      return {
        ...extractedData,
        wikiUrl: pageUrl,
      };
    }
    return null;
  } catch (err) {
    console.warn(
      "Wikipedia fetch and parse failed for place:",
      placeName,
      err
    );
    return null;
  }
}