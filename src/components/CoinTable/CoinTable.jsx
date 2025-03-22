import { useState } from "react";
import { fetchCoinData } from "../../services/fetchCoinData";
import { useQuery } from "react-query";
import currencyStore from '../../state/store';
import { useNavigate } from "react-router-dom";
import PageLoader from "../PageLoader/PageLoader";

function CoinTable() {
    const { currency } = currencyStore();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, error } = useQuery(
        ['coins', page, currency], 
        () => fetchCoinData(page, currency), 
        {
            cacheTime: 1000 * 60 * 2,
            staleTime: 1000 * 60 * 2,
        }
    );

    function handleCoinRedirect(id) {
        navigate(`/details/${id}`);
    }

    if (isError) {
        return <div className="text-red-500 text-center mt-4">Error: {error.message}</div>;
    }

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <div className="my-5 flex flex-col items-center justify-center gap-5 w-[90vw] mx-auto">
            
            {/* Table Header (Hidden on Small Screens) */}
            <div className="hidden md:flex w-full bg-yellow-400 text-black py-4 px-2 font-semibold items-center justify-center">
                <div className="basis-[35%] border-r border-gray-600 pr-4">Coin</div>
                <div className="basis-[25%] border-r border-gray-600 px-4">Price</div>
                <div className="basis-[20%] border-r border-gray-600 px-4">24h Change</div>
                <div className="basis-[20%] px-4">Market Cap</div>
            </div>

            {/* Coin List */}
            <div className="flex flex-col w-full gap-4">
                {data.map((coin) => (
                    <div 
                        key={coin.id} 
                        onClick={() => handleCoinRedirect(coin.id)} 
                        className="w-full bg-transparent text-white flex flex-col md:flex-row py-4 px-4 font-semibold items-center md:justify-between justify-center cursor-pointer border-b border-gray-600"
                    >
                        {/* Table View (for Medium & Large Screens) */}
                        <div className="hidden md:flex w-full">
                            {/* Coin Image + Name */}
                            <div className="flex items-center md:justify-start gap-3 md:basis-[35%] border-r border-gray-600 md:pr-4">
                                <div className="w-[4rem] h-[4rem]">
                                    <img src={coin.image} className="w-full h-full" loading="lazy" />
                                </div>
                                <div className="flex flex-col"> 
                                    <div className="text-2xl">{coin.name}</div>
                                    <div className="text-lg text-gray-400 uppercase">{coin.symbol}</div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="basis-[25%] border-r border-gray-600 md:px-4">
                                {currency=='inr'?'₹':'$'}{coin.current_price.toLocaleString()}
                            </div>

                            {/* 24h Change */}
                            <div className="basis-[20%] border-r border-gray-600 md:px-4">
                                {coin.price_change_24h > 0 ? (
                                    <span className="text-green-500">+{coin.price_change_24h.toFixed(2)}</span>
                                ) : (
                                    <span className="text-red-500">{coin.price_change_24h.toFixed(2)}</span>
                                )}
                            </div>

                            {/* Market Cap */}
                            <div className="basis-[20%] md:px-4">
                            {currency=='inr'?'₹':'$'}{coin.market_cap.toLocaleString()}
                            </div>
                        </div>

                        {/* Card View (for Small Screens) */}
                        <div className="flex flex-col md:hidden bg-gray-800 p-4 rounded-lg w-full shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <img src={coin.image} className="w-12 h-12" loading="lazy" />
                                    <div>
                                        <div className="text-xl font-bold">{coin.name}</div>
                                        <div className="text-gray-400 uppercase">{coin.symbol}</div>
                                    </div>
                                </div>
                                <div className="text-lg font-semibold">
                                {currency=='inr'?'₹':'$'}{coin.current_price.toLocaleString()}
                                </div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-300 mt-2 border-t border-gray-700 pt-2">
                                <div>
                                    <span className="block font-semibold">24h Change:</span>
                                    <span className={coin.price_change_24h > 0 ? "text-green-500" : "text-red-500"}>
                                        {coin.price_change_24h.toFixed(2)}
                                    </span>
                                </div>
                                <div>
                                    <span className="block font-semibold">Market Cap:</span>
                                    {currency=='inr'?'₹':'$'}{coin.market_cap.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Buttons */}
            <div className="flex gap-4 justify-center items-center">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:bg-gray-500"
                >
                    Prev
                </button>
                <button
                    onClick={() => setPage(page + 1)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default CoinTable;
