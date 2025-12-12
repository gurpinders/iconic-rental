import Button from '@/components/ui/Button'

export default function CTASection() {
  return (
    <section className="py-24 px-8 bg-black">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl text-gray-400 mb-4">
            Request a personalized quote for your next event
          </p>
          <p className="text-lg text-gray-500">
            Professional service · Premium fleet · Available 24/7
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button variant="primary">
            Request a Quote
          </Button>
          <Button variant="outline">
            Call Us Now
          </Button>
        </div>

        <div className="pt-8 border-t border-white/10">
          <p className="text-gray-400 mb-4">Need immediate assistance?</p>
          <a 
            href="tel:+14161234567" 
            className="text-3xl font-bold hover:text-gray-300 transition-colors"
          >
            (416) 123-4567
          </a>
        </div>
      </div>
    </section>
  )
}