import React from 'react'
import bgImg2 from '../../../assets/home/banner2.jpg' 
const Hero2 = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${bgImg2})` }}
    >
      {/* dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 container mx-auto px-6 lg:px-16 max-w-4xl">
        <div className="py-24">
          <p className="text-sm uppercase tracking-wider text-white/80 mb-4">Best Online</p>

          <h1 className="text-white text-4xl sm:text-6xl font-extrabold leading-tight">
            Courses from Top Instructors
          </h1>

          <p className="mt-6 text-white/90 text-base md:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, at!
            Magni suscipit blanditiis molestias incidunt aut fugiat labore eaque,
            possimus at quisquam ullam minima aliquam aspernatur similique quae.
            Magni molestias fugiat nisi officia at quae corporis repudiandae.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition">
              Join Today
            </button>

            <button className="inline-flex items-center rounded-lg border border-solid border-blue-500 text-white bg-transparent hover:bg-white/10 py-3 px-6 rounded-md transition ">
              View Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero2