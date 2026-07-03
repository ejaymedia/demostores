import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeader, ProductCard } from "../../components/index";
import { products } from "../../data/products";

const FeaturedProducts = () => {
  // Show only hot deals first, fill remaining slots from the rest, max 8
  const hotDeals = products.filter((p) => p.hotDeal);
  const others = products.filter((p) => !p.hotDeal);
  const featured = [...hotDeals, ...others].slice(0, 8);

  return (
    <div className="bg-[#0F0F1A] py-20 px-6 md:px-10 border-t border-purple-900/20">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeader
            label="Featured Items"
            title={
              <>
                Hot Picks
                <br />
                Right Now
              </>
            }
          />
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors duration-200 mb-12 shrink-0"
          >
            View Full Catalogue
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeaturedProducts;