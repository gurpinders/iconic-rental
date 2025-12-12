export default function VehicleCategories() {
  return (
    <section className="py-20 px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-16 tracking-wide">Browse Our Fleet</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Limousines */}
          <div className="relative h-96 rounded-lg border border-white/30 overflow-hidden group cursor-pointer hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:-translate-y-2 transition-all duration-500">
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: "url('/limo.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/70 transition-all duration-500 z-10" />
            <div className="relative z-20 h-full flex flex-col justify-end p-8">
              <div className="w-12 h-0.5 bg-white mb-4 group-hover:w-20 transition-all duration-500"></div>
              <h3 className="text-3xl font-bold mb-3 tracking-wide">Limousines</h3>
              <p className="text-sm text-gray-300 font-light tracking-wide">Timeless Elegance</p>
            </div>
          </div>
          
          {/* Party Buses */}
          <div className="relative h-96 rounded-lg border border-white/30 overflow-hidden group cursor-pointer hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:-translate-y-2 transition-all duration-500">
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: "url('/party.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/70 transition-all duration-500 z-10" />
            <div className="relative z-20 h-full flex flex-col justify-end p-8">
              <div className="w-12 h-0.5 bg-white mb-4 group-hover:w-20 transition-all duration-500"></div>
              <h3 className="text-3xl font-bold mb-3 tracking-wide">Party Buses</h3>
              <p className="text-sm text-gray-300 font-light tracking-wide">Celebration Ready</p>
            </div>
          </div>
          
          {/* Luxury Buses */}
          <div className="relative h-96 rounded-lg border border-white/30 overflow-hidden group cursor-pointer hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:-translate-y-2 transition-all duration-500">
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: "url('/luxury_bus.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/70 transition-all duration-500 z-10" />
            <div className="relative z-20 h-full flex flex-col justify-end p-8">
              <div className="w-12 h-0.5 bg-white mb-4 group-hover:w-20 transition-all duration-500"></div>
              <h3 className="text-3xl font-bold mb-3 tracking-wide">Luxury Buses</h3>
              <p className="text-sm text-gray-300 font-light tracking-wide">Premium Comfort</p>
            </div>
          </div>
          
          {/* SUVs */}
          <div className="relative h-96 rounded-lg border border-white/30 overflow-hidden group cursor-pointer hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:-translate-y-2 transition-all duration-500">
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: "url('/suv.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/70 transition-all duration-500 z-10" />
            <div className="relative z-20 h-full flex flex-col justify-end p-8">
              <div className="w-12 h-0.5 bg-white mb-4 group-hover:w-20 transition-all duration-500"></div>
              <h3 className="text-3xl font-bold mb-3 tracking-wide">SUVs</h3>
              <p className="text-sm text-gray-300 font-light tracking-wide">Executive Class</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}