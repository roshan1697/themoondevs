import BurnButtonBar from "./components/burnbuttonbar";
import BurnStatsContainer from "./components/burnstatscontainer";
const BurnPageStyled = styled.div``;

enum BurnTxProgress {
  default = "Burn App Tokens",
  burning = "Burning...",
}

export const BurnPage = () => {
  const {
    walletChain,
  } = useWallet();
  const childRef = useRef(null);

  const { openChainSelector, setOpenChainSelector } =
    useChainSelector();
  const { chains: receiveChains } = useWallet();
  const {
    setSuppliesChain,
    suppliesChain,
  } = useAppSupplies(true);
  const [burnTransactions, setBurnTransactions] = useState<any[]>([]);

  const { toastMsg, toastSev } = useAppToast();


  const [coinData, setCoinData] = useState<any>({});
  useEffect(() => {
    CoinGeckoApi.fetchCoinData()
      .then((data: any) => {
        //console.log("coin stats", data);
        setCoinData(data?.market_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  const refetchTransactions = () => {
    Promise.all(
      ChainScanner.fetchAllTxPromises(isChainTestnet(walletChain?.id))
    )
      .then((results: any) => {
        //console.log(res);
        let res = results.flat();
        res = ChainScanner.sortOnlyBurnTransactions(res);
        res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
        setBurnTransactions(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };



  return (
    <div>
      <DashboardLayoutStyled className="burnpage">
        <div
          className="top_conatiner burnpage"
          style={{ alignItems: "flex-start" }}
        >
          <div className="info_box filled">
            <h1 className="title">App TOKEN BURN</h1>
            <p className="description medium"></p>

            <BurnButtonBar ref={childRef} refetchTransactions={refetchTransactions} />


          </div>
          <BurnStatsContainer />

        </div>
      </DashboardLayoutStyled>
      <TransactionTableStyled>
        <div className="header">
          <p className="header_label">Burn Transactions</p>
        </div>
        <BurnTxTable
          data={burnTransactions}
          priceUSD={coinData?.current_price?.usd}
        />
      </TransactionTableStyled>
      <ChainSelector
        title={"Switch Token Chain"}
        openChainSelector={openChainSelector}
        setOpenChainSelector={setOpenChainSelector}
        chains={receiveChains}
        selectedChain={suppliesChain}
        setSelectedChain={setSuppliesChain}
      />
      <AppToast
        position={{ vertical: "bottom", horizontal: "center" }}
        message={toastMsg}
        severity={toastSev}
      />
    </div>
  );
};