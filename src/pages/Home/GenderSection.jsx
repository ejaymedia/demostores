import { motion } from "framer-motion";
import { SectionHeader, GenderCard } from "../../components/index";
import { useSite } from "../../context/SiteContext";

const GenderSection = () => {
  const { siteSettings } = useSite();

  const genders = [
    {
      gender: "men",
      label: "Men",
      description: "Clothing · Shoes · Bags · Accessories",
      image: siteSettings.men_image_url,
    },
    {
      gender: "women",
      label: "Women",
      description: "Clothing · Shoes · Bags · Accessories",
      image: siteSettings.women_image_url,
    },
    {
      gender: "kids",
      label: "Kids",
      description: "Clothing · Shoes · Accessories",
      image: siteSettings.kids_image_url,
    },
  ];

  // Don't render section if no images are set yet
  if (
    !siteSettings.men_image_url &&
    !siteSettings.women_image_url &&
    !siteSettings.kids_image_url
  ) {
    return null;
  }

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionHeader
            label="Shop by Gender"
            title="Find Your Style"
            description="Browse our curated collections for Men, Women and Kids — quality fashion for every occasion."
            center
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {genders
            .filter((item) => item.image)
            .map((item, index) => (
              <GenderCard
                key={item.gender}
                gender={item.gender}
                label={item.label}
                description={item.description}
                image={item.image}
                index={index}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default GenderSection;