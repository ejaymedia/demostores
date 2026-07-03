import { SectionHeader, CategoryCard } from "../../components/index";
import { categories } from "../../data/categories";

const CategoriesSection = () => {
  return (
    <div className="bg-[#0D0D1A] py-20 px-6 md:px-10 border-t border-purple-900/20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Browse Categories"
          title={
            <>
              Everything You Need,
              <br />
              All in One Place
            </>
          }
          description="Curated fashion picks for men and women — quality you can see, feel, and afford."
          center
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;