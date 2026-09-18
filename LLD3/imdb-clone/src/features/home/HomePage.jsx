import Banner from "./Banner";
import Movies from "./Movies";

function HomePage({
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
}) {
  return (
    <div className="text-white text-center">
      <Banner />
      <Movies
        addToWatchlist={addToWatchlist}
        removeFromWatchlist={removeFromWatchlist}
        isInWatchlist={isInWatchlist}
      />
    </div>
  );
}
export default HomePage;
