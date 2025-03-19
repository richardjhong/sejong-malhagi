import NasalizationRules from "../components/NasalizationRules";
import LiquidizationRules from "../components/LiquidizationRules";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        About 세종 말하기 (Sejong Malhagi)
      </h1>

      <div className="max-w-3xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Key Pronunciation Rules
          </h2>

          <div className="space-y-6">
            <NasalizationRules />

            <hr className="my-8" />

            <LiquidizationRules />
          </div>
        </section>

        {/* <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            How to Use This App
          </h2>
        </section> */}
      </div>
    </div>
  );
};

export default About;
