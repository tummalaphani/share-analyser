import "./App.css";
import Data from "./data.json";
let averageProfit = 0;
let consolidatedShares = 0;
let consolidatedPuchasedAmount = 0;
let consolidatedMarketAmount = 0;
let shouldExecuteSellableLogic = false;
let IndianInr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
function App() {
  const formattedData = [];
  const marketRate = 60;

  Data.unrealizedtransactionDetailsVPop.forEach((each, index) => {
    if (index === 0) {
      averageProfit = 0;
      consolidatedShares = 0;
      shouldExecuteSellableLogic = true;
      consolidatedPuchasedAmount = 0;
      consolidatedMarketAmount = 0;
    }
    const clonedData = { ...each };
    
    clonedData.totalCost = parseFloat(
      clonedData.BuyQuantity * clonedData.BuyRate
    ).toFixed(2);

    clonedData.marketPrice = parseFloat(
      clonedData.BuyQuantity * marketRate
    ).toFixed(2);
    clonedData.todayProfilt = parseFloat(
      clonedData.marketPrice - clonedData.totalCost
    ).toFixed(2);
    clonedData.sellableShares = "-";
    if (
      averageProfit + parseInt(clonedData.todayProfilt) >= 100000 &&
      shouldExecuteSellableLogic
    ) {
      const reamingBalence = 100000 - parseInt(averageProfit);
      console.log(reamingBalence, "reamingBalence");
      shouldExecuteSellableLogic = false;
      if (marketRate >= reamingBalence) {
        clonedData.sellableShares =
          consolidatedShares +
          `  / BP: ${IndianInr.format(
            consolidatedPuchasedAmount
          )}   / SP: ${IndianInr.format(consolidatedMarketAmount)}`;
      } else {
        const requiredShares =
          reamingBalence / (marketRate - clonedData.BuyRate);
        clonedData.sellableShares =
          parseInt(consolidatedShares + requiredShares) +
          `  / BP: ${IndianInr.format(
            consolidatedPuchasedAmount + requiredShares * clonedData.BuyRate
          )}   / SP: ${IndianInr.format(
            consolidatedMarketAmount + requiredShares * marketRate
          )}`;
      }
    }
    averageProfit = averageProfit + parseInt(clonedData.todayProfilt);
    consolidatedPuchasedAmount =
      consolidatedPuchasedAmount + parseInt(clonedData.totalCost);
    clonedData.consolidatedPuchasedAmount = consolidatedPuchasedAmount;
    consolidatedMarketAmount =
      consolidatedMarketAmount + parseInt(clonedData.marketPrice);
    clonedData.consolidatedMarketAmount = consolidatedMarketAmount;
    clonedData.averageProfit = averageProfit;
    consolidatedShares = consolidatedShares + clonedData.BuyQuantity;
    clonedData.consolidatedShares = consolidatedShares;
    clonedData.profitPerShare = parseFloat(
      marketRate - clonedData.BuyRate
    ).toFixed(2);
    clonedData.averagePrice =  clonedData.consolidatedPuchasedAmount / clonedData.consolidatedShares;
    formattedData.push(clonedData);
  });

  return (
    <div className="App">
      <h2>Analyse share</h2>

      <table>
        <tr>
          <th>Company</th>
          <th>Purchased Date</th>
          <th>Purchased Quantity</th>
          <th>Purchased price/share</th>
          <th>Market Rate/share</th>
          <th>Average Rate/share</th>
          
          <th>Profit/share</th>
          <th>Puchased Amount</th>
          <th>Market price</th>
          <th>Average Profit</th>
          <th>Consolidated Puchased Amount</th>
          <th>Consolidated Market Amount</th>

          <th>OverAll Profit</th>
          <th>Toatal Shares</th>
          <th>Sellable Shares</th>
        </tr>
        {formattedData.map((eachRow) => {
          return (
            <tr>
              <td>{eachRow.stockname}</td>
              <td>{new Date(eachRow.BuyDate).toLocaleDateString("en-AU")}</td>
              <td>{eachRow.BuyQuantity}</td>
              <td>{IndianInr.format(eachRow.BuyRate)}</td>
              <td>{IndianInr.format(marketRate)}</td>
              <td>{IndianInr.format(eachRow.averagePrice)}</td>
              
              <td>{IndianInr.format(eachRow.profitPerShare)}</td>
              <td>{IndianInr.format(eachRow.totalCost)}</td>
              <td>{IndianInr.format(eachRow.marketPrice)}</td>
              <td>{IndianInr.format(eachRow.todayProfilt)}</td>
              <td>{IndianInr.format(eachRow.consolidatedPuchasedAmount)}</td>
              <td>{IndianInr.format(eachRow.consolidatedMarketAmount)}</td>

              <td>{IndianInr.format(eachRow.averageProfit)}</td>
              <td>{eachRow.consolidatedShares}</td>
              <td>{eachRow.sellableShares}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default App;
