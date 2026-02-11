import React from 'react'
import HeroContainer from './Hero/HeroContainer'
import Gallary from './Gallary/Gallary'
import Popular from './PopularClasses/Popular'
import PopularTeacher from './PopularTeacher/PopularTeacher'

const Home = () => {
  return (
    <div>
      <HeroContainer/>
      <div className='max-w-screen-xl mx-auto'>
        <Gallary/>
        <Popular/>  {/* popular classes component */}
        <PopularTeacher/> {/* popular teacher component */}
      </div>
    </div>
  )
}

export default Home
