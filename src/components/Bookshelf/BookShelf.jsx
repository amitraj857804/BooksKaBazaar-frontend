import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import ShelfStatsCards from "./Dashboard/ShelfStatsCards";
import ShelfHeroCard from "./ShelfHeroCard";
import ContinueReading from "./Dashboard/ContinueReading";

export default function BookShelf() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8 ">
                <ShelfHeroCard />

                <div className="mt-8">
                    <ShelfStatsCards />
                </div>

                <ContinueReading />

            </div>
            <Footer />
        </div>
    );
}