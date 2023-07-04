import { Chart } from "frappe-charts";
let jsonQuery = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ['SSS']
      }
    },

    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vaesto"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};
const getAreaCode = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const response = await fetch(url, {
    method: "GET"
  });

  const data = await response.json();
  const municipality = document.getElementById("input-area").value;
  let areaNames = data.variables[1].valueTexts;
  let areaCodes = data.variables[1].values;
  let index;
  let newMunicipality;
  if (municipality !== "") {
    if ((municipality === "Whole Country") || (municipality === "Whole country") ||(municipality === "whole country")) {
      newMunicipality = municipality.toUpperCase();
    } else {
      //How to make first letter capitalized: https://flexiple.com/javascript/javascript-capitalize-first-letter/
      newMunicipality =
        municipality.charAt(0).toUpperCase() + municipality.slice(1);
    }
    index = areaNames.indexOf(newMunicipality);
    return areaCodes[index];
  } else {
    return "SSS";
  }
};
//getAreaCode()
const getData = async () => {
  let response; 
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(jsonQuery)
    });

  if (!response.ok) {
    return;
  }

  const resultData = await response.json();
  return resultData;
};
//import { Chart } from "frappe-charts/dist/frappe-charts.min.esm"
const buildChart = async () => {
  const resultData = await getData();
  const labelYears = Object.values(resultData.dimension.Vuosi.category.label);
  const values = Object.values(resultData.value);
  const chartData = {
    labels: labelYears,
    datasets: [{ values: values }]
  };
  const chart = new Chart("#chart", {
    title: "Population growth",
    data: chartData,
    type: "line",
    height: 450,
    colors: ["#eb5146"]
  });
};

//buildChart()

const submitBtn = document.getElementById("submit-data");
submitBtn.addEventListener("click", async () => {
  const areaCode = await getAreaCode();
  jsonQuery.query[1].selection.values[0] = areaCode;
  buildChart();
});
buildChart();