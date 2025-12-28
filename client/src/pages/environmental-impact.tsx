import TreeCounter from '../../../components/TreeCounter';

/**
 * Environmental Impact Page
 *
 * Demonstrates the integration of the Plant-for-the-Planet tree counter widget
 * into the Fruitful Global Planet ecosystem.
 */
export default function EnvironmentalImpact() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-10 font-sans text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-300 pb-6 mb-10">
        <h1 className="text-4xl font-bold text-emerald-700 tracking-wide text-center">
          🌳 Environmental Impact Dashboard
        </h1>
        <p className="text-center text-gray-600 mt-2 text-lg">
          Tracking our contribution to the Trillion Tree Campaign
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto space-y-12">
        {/* Introduction Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
            Our Commitment to the Planet
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Fruitful Global Planet is proud to partner with Plant-for-the-Planet in their mission to
            plant 1 trillion trees worldwide. Every action we take contributes to a healthier planet
            for future generations.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The tree counter below displays our real-time progress and impact. Together with our
            community across all HSOMNI9000 ecosystem applications, we're making a measurable
            difference in combating climate change.
          </p>
        </div>

        {/* Tree Counter Widget */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <TreeCounter
            widgetUrl="YOUR_WIDGET_URL"
            width={500}
            height={350}
            borderRadius="12px"
            showInfo={true}
          />
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">🌱</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Trees Planted</h3>
            <p className="text-gray-600 text-sm">Contributing to global reforestation efforts</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">💧</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Water Conservation</h3>
            <p className="text-gray-600 text-sm">
              Trees help maintain water cycles and prevent erosion
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">🌍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Carbon Offset</h3>
            <p className="text-gray-600 text-sm">Each tree absorbs CO₂ and produces oxygen</p>
          </div>
        </div>

        {/* Integration Across Ecosystem */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-200">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
            🌐 HSOMNI9000 Ecosystem Integration
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The tree counter is integrated across all our ecosystem applications, ensuring
            transparency and visibility of our environmental impact:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <strong className="text-gray-800">SamFox Creative Studio:</strong>
                <span className="text-gray-600"> Environmental portfolio showcase</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <strong className="text-gray-800">Banimal Charitable Toys:</strong>
                <span className="text-gray-600"> Trees per purchase tracking</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <strong className="text-gray-800">VaultMesh Trading:</strong>
                <span className="text-gray-600"> Corporate responsibility section</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <strong className="text-gray-800">BuildNest Construction:</strong>
                <span className="text-gray-600"> Green building initiatives</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <strong className="text-gray-800">OmniGrid/FAA.Zone:</strong>
                <span className="text-gray-600"> Infrastructure monitoring</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <div>
                <strong className="text-gray-800">SecureSign Legal:</strong>
                <span className="text-gray-600"> Sustainability reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-emerald-600 text-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-emerald-50 leading-relaxed mb-6">
            Every member of the Fruitful Global Planet community can contribute to our environmental
            goals. Learn more about how you can make a difference.
          </p>
          <a
            href="https://www.plant-for-the-planet.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
          >
            Learn More About Plant-for-the-Planet
          </a>
        </div>

        {/* Setup Instructions Link */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🔧 Widget Setup Instructions</h3>
          <p className="text-gray-700 text-sm mb-4">
            Want to integrate this widget into your own site or application? Check out our
            comprehensive setup guide.
          </p>
          <a
            href="/docs/TREE_WIDGET_SETUP.md"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
          >
            View Setup Documentation →
          </a>
        </div>
      </main>
    </section>
  );
}
