import * as cheerio  from "cheerio";
import { BaseballTeam } from "./baseballTeam";

/**
 * 順位表
 * 
 * 対応しているリーグ:
 * セリーグ: CL,
 * パリーグ: PL,
 * セ・パ交流戦: CP,
 * オープン戦: OP
 * @param {String} leagueName
 * @returns {Promise<BaseballTeam[]>}
 */
export const standings = async (leagueName: string) => {

  type LeagueUrls = {
    [key: string]: string
  };
  const leagueUrls: LeagueUrls = {
    "CL": "1",
    "PL": "2",
    "CP": "26",
    "OP": "5"
  };

  const url = "https://baseball.yahoo.co.jp/npb/standings/detail/"
    + leagueUrls[(typeof leagueUrls[leagueName] === "undefined" ? "CL" : leagueName)];

  const response = await fetch(url); 
  const data = await response.text();
  const $ = cheerio.load(data);

  let teams: BaseballTeam[] = [];
  const isOP = leagueName === "OP";
  $('.bb-rankTable > tbody > tr').each((_, teamDom) => {
    const rank = Number($(teamDom).find('td:nth-child(1)').text());
    const name = $(teamDom).find('td:nth-child(2)').text().trim();
    const playGameCount = Number($(teamDom).find('td:nth-child(3)').text());
    const win = Number($(teamDom).find('td:nth-child(4)').text());
    const lose = Number($(teamDom).find('td:nth-child(5)').text());
    const draw = Number($(teamDom).find('td:nth-child(6)').text());
    const pct = Number($(teamDom).find('td:nth-child(7)').text());
    const gamesBehind = $(teamDom).find('td:nth-child(8)').text();

    // Webスクレイピング先の順位表にて、
    // オープン戦だけ残試合数表記がないという仕様の為調整
    const remainingGames = isOP ? 0 : Number($(teamDom).find('td:nth-child(9)').text());

    // ※ isオープン戦 ? index - 1 : index;
    const run = Number($(teamDom).find(`td:nth-child(${10 - Number(isOP)})`).text());
    const ra = Number($(teamDom).find(`td:nth-child(${11 - Number(isOP)})`).text());
    const hr = Number($(teamDom).find(`td:nth-child(${12 - Number(isOP)})`).text());
    const sb = Number($(teamDom).find(`td:nth-child(${13 - Number(isOP)})`).text());
    const avg = Number($(teamDom).find(`td:nth-child(${14 - Number(isOP)})`).text());
    const era = Number($(teamDom).find(`td:nth-child(${15 - Number(isOP)})`).text());
    const e = Number($(teamDom).find(`td:nth-child(${16 - Number(isOP)})`).text());

    let team = new BaseballTeam(
      rank,
      name,
      playGameCount,
      win,
      lose,
      draw,
      pct,
      gamesBehind,
      remainingGames,
      run,
      ra,
      hr,
      sb,
      avg,
      era,
      e
    );
    teams.push(team);
  });

  return teams;
}
