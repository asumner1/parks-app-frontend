import MapWrapper from '@/components/MapWrapper';

export default function Home() {
  return (
    <main>
      {/* <div className="absolute bottom-4 right-4 z-10 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800">Explore National Parks</h1>
        <p className="text-gray-600">Click on markers to discover more</p>
      </div> */}
      <MapWrapper />
    </main>
  );
}
